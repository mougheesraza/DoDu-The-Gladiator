import { ContentItem, PlatformId, SocialPlatformConfig, ProviderStatusDetails } from '../../types/social';
import { socialsConfig } from '../../config/socialsConfig';
import { mockContentData } from './mockData';
import { ISocialProvider } from './types';

export type YouTubeConnectionStatus =
  | 'connected'
  | 'missing_credentials'
  | 'invalid_key'
  | 'invalid_channel'
  | 'quota_exceeded'
  | 'api_error';

export class YouTubeProvider implements ISocialProvider {
  platformId: PlatformId = 'youtube';
  private lastStatus: YouTubeConnectionStatus = 'missing_credentials';
  private lastError: string | null = null;
  private lastSyncAt: string | null = null;
  private lastFetchedCount: number = 0;
  private channelInfo: ProviderStatusDetails['channelInfo'] = null;

  getConfig(): SocialPlatformConfig {
    return socialsConfig.find(p => p.id === 'youtube')!;
  }

  isLiveApiConfigured(): boolean {
    const apiKey = process.env.YOUTUBE_API_KEY?.trim();
    const channelId = process.env.YOUTUBE_CHANNEL_ID?.trim();
    return Boolean(apiKey && apiKey !== '' && channelId && channelId !== '');
  }

  getStatusDetails(): ProviderStatusDetails {
    const configured = this.isLiveApiConfigured();
    let modeText = 'Mock Preview Ready (Missing YOUTUBE_API_KEY or YOUTUBE_CHANNEL_ID)';

    if (configured) {
      if (this.lastStatus === 'connected') {
        modeText = `Live API v3 Connected (${this.channelInfo?.title || 'YouTube Channel'})`;
      } else if (this.lastStatus === 'invalid_key') {
        modeText = 'API Key Error: Invalid YOUTUBE_API_KEY';
      } else if (this.lastStatus === 'invalid_channel') {
        modeText = 'Channel Error: YOUTUBE_CHANNEL_ID not found';
      } else if (this.lastStatus === 'quota_exceeded') {
        modeText = 'Quota Error: YouTube API Daily Quota Exceeded';
      } else if (this.lastStatus === 'api_error') {
        modeText = `API Error: ${this.lastError || 'Failed to communicate with YouTube API'}`;
      } else {
        modeText = 'Live API Configured (Pending Sync)';
      }
    }

    return {
      configured,
      connected: configured && this.lastStatus === 'connected',
      status: configured ? this.lastStatus : 'missing_credentials',
      mode: modeText,
      channelInfo: this.channelInfo,
      lastSyncAt: this.lastSyncAt,
      itemCount: this.lastFetchedCount,
      errorDetails: this.lastError
    };
  }

  async fetchLatestContent(limit: number = 10): Promise<ContentItem[]> {
    if (!this.isLiveApiConfigured()) {
      this.lastStatus = 'missing_credentials';
      this.lastError = 'Missing YOUTUBE_API_KEY or YOUTUBE_CHANNEL_ID environment variables.';
      return [];
    }

    try {
      const realItems = await this.fetchLiveYouTubeAPI(limit);
      this.lastStatus = 'connected';
      this.lastError = null;
      this.lastSyncAt = new Date().toISOString();
      this.lastFetchedCount = realItems.length;
      return realItems;
    } catch (error: any) {
      const errMsg = error?.message || String(error);
      console.error('[YouTubeProvider] Live API request failed:', errMsg);

      if (errMsg.includes('keyInvalid') || errMsg.includes('API key not valid') || (errMsg.includes('400') && errMsg.includes('key'))) {
        this.lastStatus = 'invalid_key';
        this.lastError = 'Invalid YOUTUBE_API_KEY provided.';
      } else if (errMsg.includes('quotaExceeded') || errMsg.includes('quota')) {
        this.lastStatus = 'quota_exceeded';
        this.lastError = 'YouTube Data API daily quota limit exceeded.';
      } else if (errMsg.includes('channelNotFound') || errMsg.includes('Channel not found')) {
        this.lastStatus = 'invalid_channel';
        this.lastError = 'YouTube Channel ID not found or channel is restricted/private.';
      } else {
        this.lastStatus = 'api_error';
        this.lastError = errMsg;
      }

      return [];
    }
  }

  private getFallbackMockItems(reason: string): ContentItem[] {
    return [];
  }

  private async fetchLiveYouTubeAPI(limit: number): Promise<ContentItem[]> {
    const apiKey = process.env.YOUTUBE_API_KEY?.trim();
    const rawChannelId = process.env.YOUTUBE_CHANNEL_ID?.trim();

    if (!apiKey || !rawChannelId) {
      throw new Error('YOUTUBE_API_KEY or YOUTUBE_CHANNEL_ID missing');
    }

    // Step 1: Channel Lookup / Resolution
    let channelLookupParam = `id=${rawChannelId}`;
    if (rawChannelId.startsWith('@')) {
      channelLookupParam = `forHandle=${rawChannelId.replace('@', '')}`;
    } else if (!rawChannelId.startsWith('UC') && !rawChannelId.startsWith('uu') && !rawChannelId.startsWith('UU')) {
      channelLookupParam = `forUsername=${rawChannelId}`;
    }

    const channelUrl = `https://www.googleapis.com/youtube/v3/channels?key=${apiKey}&${channelLookupParam}&part=snippet,contentDetails,statistics`;
    const channelRes = await fetch(channelUrl);

    if (!channelRes.ok) {
      const errJson = await channelRes.json().catch(() => null);
      const message = errJson?.error?.message || `HTTP ${channelRes.status}`;
      const reason = errJson?.error?.errors?.[0]?.reason || 'apiError';

      if (reason === 'keyInvalid' || message.includes('API key not valid') || message.includes('key')) {
        throw new Error('keyInvalid: API key not valid. Please verify YOUTUBE_API_KEY.');
      }
      if (reason === 'quotaExceeded') {
        throw new Error('quotaExceeded: YouTube API quota limit reached.');
      }
      throw new Error(`YouTube Channels API Error (${channelRes.status}): ${message}`);
    }

    const channelData = await channelRes.json();
    let channelItem = channelData.items?.[0];

    // Fallback: search for channel if username/id direct query didn't return
    if (!channelItem && !rawChannelId.startsWith('UC')) {
      const directChanUrl = `https://www.googleapis.com/youtube/v3/channels?key=${apiKey}&id=${rawChannelId}&part=snippet,contentDetails,statistics`;
      const directChanRes = await fetch(directChanUrl);
      if (directChanRes.ok) {
        const dData = await directChanRes.json();
        channelItem = dData.items?.[0];
      }
    }

    if (!channelItem) {
      throw new Error(`channelNotFound: Channel '${rawChannelId}' not found on YouTube.`);
    }

    const resolvedChannelId = channelItem.id;
    const channelTitle = this.decodeHtmlEntities(channelItem.snippet?.title || 'YouTube Channel');
    const channelCustomUrl = channelItem.snippet?.customUrl || `@${rawChannelId.replace('@', '')}`;
    const channelAvatar =
      channelItem.snippet?.thumbnails?.medium?.url ||
      channelItem.snippet?.thumbnails?.default?.url ||
      '';
    const uploadsPlaylistId = channelItem.contentDetails?.relatedPlaylists?.uploads;

    this.channelInfo = {
      title: channelTitle,
      handle: channelCustomUrl,
      avatar: channelAvatar,
      subscriberCount: this.formatNumber(channelItem.statistics?.subscriberCount),
      videoCount: channelItem.statistics?.videoCount
    };

    // Step 2: Fetch recent video items from Uploads Playlist
    let videoIds: string[] = [];
    let videoSnippetMap: Record<string, any> = {};

    if (uploadsPlaylistId) {
      const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?key=${apiKey}&playlistId=${uploadsPlaylistId}&part=snippet,contentDetails&maxResults=${limit}`;
      const playlistRes = await fetch(playlistUrl);
      if (playlistRes.ok) {
        const playlistData = await playlistRes.json();
        if (playlistData.items && Array.isArray(playlistData.items)) {
          playlistData.items.forEach((pItem: any) => {
            const vId = pItem.contentDetails?.videoId || pItem.snippet?.resourceId?.videoId;
            if (vId) {
              videoIds.push(vId);
              videoSnippetMap[vId] = pItem.snippet;
            }
          });
        }
      }
    }

    // Secondary fallback: Search API if playlist query returned empty
    if (videoIds.length === 0) {
      const searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${resolvedChannelId}&part=snippet,id&order=date&type=video&maxResults=${limit}`;
      const searchRes = await fetch(searchUrl);
      if (!searchRes.ok) {
        const errJson = await searchRes.json().catch(() => null);
        throw new Error(`YouTube Search API Error (${searchRes.status}): ${errJson?.error?.message || 'Search failed'}`);
      }
      const searchData = await searchRes.json();
      if (searchData.items && Array.isArray(searchData.items)) {
        searchData.items.forEach((sItem: any) => {
          const vId = sItem.id?.videoId;
          if (vId) {
            videoIds.push(vId);
            videoSnippetMap[vId] = sItem.snippet;
          }
        });
      }
    }

    if (videoIds.length === 0) {
      return [];
    }

    // Step 3: Get detailed video statistics & duration
    const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${videoIds.join(',')}&part=snippet,contentDetails,statistics`;
    const detailsRes = await fetch(detailsUrl);
    let detailsMap: Record<string, any> = {};

    if (detailsRes.ok) {
      const detailsData = await detailsRes.json();
      if (detailsData.items) {
        detailsData.items.forEach((vItem: any) => {
          detailsMap[vItem.id] = vItem;
        });
      }
    }

    // Step 4: Normalize raw YouTube items into ContentItem schema
    return videoIds.map((vId, idx) => {
      const details = detailsMap[vId];
      const snippet = details?.snippet || videoSnippetMap[vId] || {};
      const title = this.decodeHtmlEntities(snippet.title || 'YouTube Video');
      const description = this.decodeHtmlEntities(snippet.description || '');
      const publishedAt = snippet.publishedAt || new Date().toISOString();
      const thumbnails = snippet.thumbnails || {};
      const thumbnailUrl =
        thumbnails.maxres?.url ||
        thumbnails.high?.url ||
        thumbnails.medium?.url ||
        thumbnails.default?.url ||
        `https://i.ytimg.com/vi/${vId}/hqdefault.jpg`;

      const isoDuration = details?.contentDetails?.duration;
      const formattedDuration = this.formatDuration(isoDuration);
      const isShort = formattedDuration.startsWith('0:') && parseInt(formattedDuration.split(':')[1], 10) < 60;

      return {
        id: `yt-${vId}`,
        platform: 'youtube' as PlatformId,
        title,
        description,
        thumbnail: thumbnailUrl,
        url: `https://www.youtube.com/watch?v=${vId}`,
        publishedAt,
        type: isShort ? 'short' : 'video',
        duration: formattedDuration,
        views: this.formatNumber(details?.statistics?.viewCount),
        likes: this.formatNumber(details?.statistics?.likeCount),
        comments: this.formatNumber(details?.statistics?.commentCount),
        mediaUrl: `https://www.youtube.com/embed/${vId}`,
        featured: idx === 0,
        tags: ['YouTube', isShort ? 'Shorts' : 'Video'],
        author: {
          name: channelTitle,
          handle: channelCustomUrl,
          avatar: channelAvatar
        },
        isFallback: false
      };
    });
  }

  private decodeHtmlEntities(str: string): string {
    if (!str) return '';
    return str
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&apos;/g, "'")
      .replace(/&#x2F;/g, '/');
  }

  private formatDuration(isoDuration?: string): string {
    if (!isoDuration) return '10:00';
    const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return '0:59';
    const hours = match[1] ? parseInt(match[1], 10) : 0;
    const minutes = match[2] ? parseInt(match[2], 10) : 0;
    const seconds = match[3] ? parseInt(match[3], 10) : 0;
    const secsPadded = seconds < 10 ? `0${seconds}` : `${seconds}`;
    if (hours > 0) {
      const minsPadded = minutes < 10 ? `0${minutes}` : `${minutes}`;
      return `${hours}:${minsPadded}:${secsPadded}`;
    }
    return `${minutes}:${secsPadded}`;
  }

  private formatNumber(numStr?: string | number): string {
    if (!numStr) return '0';
    const num = typeof numStr === 'number' ? numStr : parseInt(numStr, 10);
    if (isNaN(num)) return String(numStr);
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  }
}

export const youtubeProvider = new YouTubeProvider();
