import { ContentItem, PlatformId, SocialPlatformConfig } from '../../types/social';
import { socialsConfig } from '../../config/socialsConfig';
import { mockContentData } from './mockData';
import { ISocialProvider } from './types';

export class TikTokProvider implements ISocialProvider {
  platformId: PlatformId = 'tiktok';

  getConfig(): SocialPlatformConfig {
    return socialsConfig.find(p => p.id === 'tiktok')!;
  }

  isLiveApiConfigured(): boolean {
    return Boolean(
      typeof process !== 'undefined' &&
      process.env?.TIKTOK_ACCESS_TOKEN &&
      process.env.TIKTOK_ACCESS_TOKEN !== ''
    );
  }

  async fetchLatestContent(limit: number = 6): Promise<ContentItem[]> {
    if (this.isLiveApiConfigured()) {
      try {
        return await this.fetchLiveTikTokAPI(limit);
      } catch (error: any) {
        console.warn('[TikTokProvider] Live API failed:', error.message || error);
        return [];
      }
    }

    return [];
  }

  private async fetchLiveTikTokAPI(limit: number): Promise<ContentItem[]> {
    const accessToken = process.env.TIKTOK_ACCESS_TOKEN;
    if (!accessToken) throw new Error('TikTok TIKTOK_ACCESS_TOKEN missing');

    // Official TikTok Display API v2
    const url = 'https://open.tiktokapis.com/v2/video/list/';
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        max_count: limit,
        fields: ['id', 'title', 'cover_image_url', 'share_url', 'create_time', 'like_count', 'comment_count', 'view_count', 'duration']
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`TikTok Display API returned status ${res.status}: ${errText}`);
    }

    const data = await res.json();
    if (!data.data?.videos || !Array.isArray(data.data.videos)) {
      return [];
    }

    const formatNumber = (num?: number) => {
      if (!num) return '0';
      if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
      if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
      return num.toString();
    };

    return data.data.videos.map((vid: any) => {
      const title = vid.title || 'TikTok Short Video';
      const createTimeIso = new Date(vid.create_time * 1000).toISOString();
      const secs = vid.duration || 45;
      const formattedDuration = `0:${secs < 10 ? '0' + secs : secs}`;

      return {
        id: `tt-${vid.id}`,
        platform: 'tiktok' as PlatformId,
        title: title.length > 60 ? `${title.substring(0, 57)}...` : title,
        description: title,
        thumbnail: vid.cover_image_url || 'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=800',
        url: vid.share_url || 'https://tiktok.com',
        publishedAt: createTimeIso,
        type: 'short',
        duration: formattedDuration,
        views: formatNumber(vid.view_count),
        likes: formatNumber(vid.like_count),
        comments: formatNumber(vid.comment_count),
        tags: ['TikTok', 'Shorts', 'Viral']
      };
    });
  }
}

export const tiktokProvider = new TikTokProvider();
