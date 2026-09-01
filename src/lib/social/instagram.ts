import { ContentItem, PlatformId, SocialPlatformConfig } from '../../types/social.js';
import { socialsConfig } from '../../config/socialsConfig.js';
import { mockContentData } from './mockData.js';
import { ISocialProvider } from './types.js';

export class InstagramProvider implements ISocialProvider {
  platformId: PlatformId = 'instagram';
  private lastError: string | null = null;
  private lastSyncAt: string | null = null;
  private lastItemCount: number = 0;

  getConfig(): SocialPlatformConfig {
    return socialsConfig.find(p => p.id === 'instagram')!;
  }

  getStatusDetails() {
    const configured = this.isLiveApiConfigured();
    return {
      configured,
      connected: configured && !this.lastError && this.lastItemCount > 0,
      status: this.lastError ? 'api_error' : (configured ? 'connected' : 'unconfigured'),
      mode: configured ? 'Live Graph API Active' : 'Mock Preview Ready',
      lastSyncAt: this.lastSyncAt,
      itemCount: this.lastItemCount,
      errorDetails: this.lastError
    };
  }

  isLiveApiConfigured(): boolean {
    return Boolean(
      typeof process !== 'undefined' &&
      process.env?.INSTAGRAM_ACCESS_TOKEN?.trim() &&
      process.env?.INSTAGRAM_USER_ID?.trim()
    );
  }

  async fetchLatestContent(limit: number = 10): Promise<ContentItem[]> {
    if (this.isLiveApiConfigured()) {
      try {
        const items = await this.fetchLiveInstagramAPI(limit);
        this.lastError = null;
        this.lastSyncAt = new Date().toISOString();
        this.lastItemCount = items.length;
        return items;
      } catch (error: any) {
        console.warn('[InstagramProvider] Live API request failed:', error.message || error);
        this.lastError = error.message || 'Instagram API request failed';
        return [];
      }
    }

    return [];
  }

  private async fetchLiveInstagramAPI(limit: number): Promise<ContentItem[]> {
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN?.trim();
    const userId = process.env.INSTAGRAM_USER_ID?.trim();

    if (!accessToken || !userId) {
      throw new Error('Instagram credentials INSTAGRAM_ACCESS_TOKEN or INSTAGRAM_USER_ID missing');
    }

    // Standard Meta Graph API endpoint for Instagram Business / Creator Media
    const fields = 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,like_count,comments_count,username';
    const graphUrl = `https://graph.facebook.com/v19.0/${userId}/media?fields=${fields}&limit=${limit}&access_token=${accessToken}`;

    let res = await fetch(graphUrl);

    // Fallback attempt: if graph.facebook.com fails and user ID is "me" or Basic Display API token, try graph.instagram.com
    if (!res.ok && (userId.toLowerCase() === 'me' || res.status === 400)) {
      const basicDisplayUrl = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username&limit=${limit}&access_token=${accessToken}`;
      const fallbackRes = await fetch(basicDisplayUrl);
      if (fallbackRes.ok) {
        res = fallbackRes;
      }
    }

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      const errMsg = errJson?.error?.message || `HTTP status ${res.status}`;
      throw new Error(`Instagram Graph API Error (${res.status}): ${errMsg}`);
    }

    const data = await res.json();
    if (!data.data || !Array.isArray(data.data)) {
      return [];
    }

    const formatNumber = (num?: number) => {
      if (!num) return '0';
      if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
      if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
      return num.toString();
    };

    return data.data.map((item: any) => {
      const isReel = item.media_type === 'VIDEO';
      const caption = item.caption || 'Instagram Media Post';
      const title = caption.length > 60 ? `${caption.substring(0, 57)}...` : caption;

      return {
        id: `ig-${item.id}`,
        platform: 'instagram' as PlatformId,
        title,
        description: caption,
        thumbnail: item.thumbnail_url || item.media_url || 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800',
        url: item.permalink || 'https://www.instagram.com/doduthegladdiator/',
        publishedAt: item.timestamp || new Date().toISOString(),
        type: isReel ? 'reel' : 'post',
        likes: formatNumber(item.like_count),
        comments: formatNumber(item.comments_count),
        mediaUrl: item.media_url,
        duration: isReel ? '0:30' : undefined,
        tags: ['Instagram', isReel ? 'Reels' : 'Post', 'DoDu'],
        author: {
          name: item.username || 'DoDu The Gladiator',
          handle: item.username ? `@${item.username}` : '@doduthegladdiator',
          avatar: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800'
        },
        isFallback: false
      };
    });
  }
}

export const instagramProvider = new InstagramProvider();
