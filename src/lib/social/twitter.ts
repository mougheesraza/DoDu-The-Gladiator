import { ContentItem, PlatformId, SocialPlatformConfig } from '../../types/social';
import { socialsConfig } from '../../config/socialsConfig';
import { ISocialProvider } from './types';

export class TwitterProvider implements ISocialProvider {
  platformId: PlatformId = 'twitter';
  private lastError: string | null = null;
  private lastSyncAt: string | null = null;
  private lastItemCount: number = 0;

  getConfig(): SocialPlatformConfig {
    return socialsConfig.find(p => p.id === 'twitter')!;
  }

  getStatusDetails() {
    const configured = this.isLiveApiConfigured();
    return {
      configured,
      connected: configured && !this.lastError && this.lastItemCount > 0,
      status: this.lastError ? 'api_error' : (configured ? 'connected' : 'unconfigured'),
      mode: configured ? 'Live X API v2 Active' : 'Unconfigured State',
      lastSyncAt: this.lastSyncAt,
      itemCount: this.lastItemCount,
      errorDetails: this.lastError
    };
  }

  isLiveApiConfigured(): boolean {
    return Boolean(
      typeof process !== 'undefined' &&
      process.env?.TWITTER_BEARER_TOKEN?.trim()
    );
  }

  async fetchLatestContent(limit: number = 6): Promise<ContentItem[]> {
    if (this.isLiveApiConfigured()) {
      try {
        const items = await this.fetchLiveTwitterAPI(limit);
        this.lastError = null;
        this.lastSyncAt = new Date().toISOString();
        this.lastItemCount = items.length;
        return items;
      } catch (error: any) {
        console.warn('[TwitterProvider] Live X API v2 request failed:', error.message || error);
        this.lastError = error.message || 'X/Twitter API v2 request failed';
        this.lastSyncAt = new Date().toISOString();
        this.lastItemCount = 0;
        return [];
      }
    }

    this.lastError = 'TWITTER_BEARER_TOKEN is not configured';
    this.lastItemCount = 0;
    return [];
  }

  private async fetchLiveTwitterAPI(limit: number): Promise<ContentItem[]> {
    const bearerToken = process.env.TWITTER_BEARER_TOKEN?.trim();
    if (!bearerToken) {
      throw new Error('TWITTER_BEARER_TOKEN environment variable is missing');
    }

    const headers = {
      'Authorization': `Bearer ${bearerToken}`,
      'Content-Type': 'application/json'
    };

    // Step 1: Resolve X User ID and Profile Info
    let userId = process.env.TWITTER_USER_ID?.trim();
    let authorName = 'DoDu The Gladiator';
    let authorUsername = 'RoboNexus0';
    let authorAvatar = 'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=800';

    if (!userId) {
      // Determine username to query
      const config = this.getConfig();
      const configHandle = config.url ? config.url.split('/').pop()?.replace('@', '') : 'RoboNexus0';
      const handleToQuery = configHandle || 'RoboNexus0';

      const userLookupUrl = `https://api.twitter.com/2/users/by/username/${handleToQuery}?user.fields=profile_image_url,username,name,public_metrics`;
      const userRes = await fetch(userLookupUrl, { headers });

      if (userRes.ok) {
        const userData = await userRes.json();
        if (userData.data?.id) {
          userId = userData.data.id;
          authorName = userData.data.name || authorName;
          authorUsername = userData.data.username || authorUsername;
          authorAvatar = userData.data.profile_image_url || authorAvatar;
        }
      } else {
        // Fallback: try /2/users/me (User Context token)
        const meRes = await fetch('https://api.twitter.com/2/users/me?user.fields=profile_image_url,username,name,public_metrics', { headers });
        if (meRes.ok) {
          const meData = await meRes.json();
          if (meData.data?.id) {
            userId = meData.data.id;
            authorName = meData.data.name || authorName;
            authorUsername = meData.data.username || authorUsername;
            authorAvatar = meData.data.profile_image_url || authorAvatar;
          }
        }
      }
    }

    if (!userId) {
      throw new Error('Could not resolve X / Twitter User ID. Please set TWITTER_USER_ID in .env.local or verify TWITTER_BEARER_TOKEN permissions.');
    }

    // Step 2: Fetch Tweets from User Timeline via X API v2
    const maxResults = Math.min(Math.max(limit, 5), 100);
    const tweetFields = 'created_at,public_metrics,entities,attachments,author_id';
    const mediaFields = 'preview_image_url,url,type';
    const userFields = 'name,username,profile_image_url';
    const expansions = 'attachments.media_keys,author_id';

    const tweetsUrl = `https://api.twitter.com/2/users/${userId}/tweets?max_results=${maxResults}&tweet.fields=${tweetFields}&expansions=${expansions}&media.fields=${mediaFields}&user.fields=${userFields}`;

    const res = await fetch(tweetsUrl, { headers });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      const errMsg = errJson?.detail || errJson?.errors?.[0]?.message || errJson?.title || `HTTP status ${res.status}`;
      throw new Error(`X/Twitter API Error (${res.status}): ${errMsg}`);
    }

    const data = await res.json();
    if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
      return [];
    }

    // Parse media inclusions
    const mediaMap: Record<string, string> = {};
    if (data.includes?.media && Array.isArray(data.includes.media)) {
      data.includes.media.forEach((m: any) => {
        if (m.media_key) {
          mediaMap[m.media_key] = m.url || m.preview_image_url;
        }
      });
    }

    // Parse user inclusions
    if (data.includes?.users && Array.isArray(data.includes.users)) {
      const tweetUser = data.includes.users.find((u: any) => u.id === userId) || data.includes.users[0];
      if (tweetUser) {
        authorName = tweetUser.name || authorName;
        authorUsername = tweetUser.username || authorUsername;
        authorAvatar = tweetUser.profile_image_url || authorAvatar;
      }
    }

    const formatNumber = (num?: number) => {
      if (!num) return '0';
      if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
      if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
      return num.toString();
    };

    return data.data.map((tweet: any) => {
      const text = tweet.text || '';
      const title = text.length > 60 ? `${text.substring(0, 57)}...` : text;
      const mediaKey = tweet.attachments?.media_keys?.[0];
      const thumbnail = (mediaKey ? mediaMap[mediaKey] : null) || authorAvatar || 'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=800';

      return {
        id: `tw-${tweet.id}`,
        platform: 'twitter' as PlatformId,
        title,
        description: text,
        thumbnail,
        url: `https://x.com/${authorUsername}/status/${tweet.id}`,
        publishedAt: tweet.created_at || new Date().toISOString(),
        type: 'tweet',
        likes: formatNumber(tweet.public_metrics?.like_count),
        comments: formatNumber(tweet.public_metrics?.reply_count),
        views: formatNumber(tweet.public_metrics?.impression_count),
        tags: ['X', 'Twitter', 'Post'],
        author: {
          name: authorName,
          handle: `@${authorUsername}`,
          avatar: authorAvatar
        },
        isFallback: false
      };
    });
  }
}

export const twitterProvider = new TwitterProvider();
