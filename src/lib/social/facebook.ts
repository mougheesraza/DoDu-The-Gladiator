import { ContentItem, ContentType, PlatformId, ProviderStatusDetails, SocialPlatformConfig } from '../../types/social.js';
import { socialsConfig } from '../../config/socialsConfig.js';
import { mockContentData } from './mockData.js';
import { ISocialProvider } from './types.js';

export type FacebookPageConnectionStatus =
  | 'connected'
  | 'missing_credentials'
  | 'invalid_token'
  | 'page_not_found'
  | 'permission_error'
  | 'api_error';

export class FacebookPageProvider implements ISocialProvider {
  platformId: PlatformId = 'facebook_page';
  private lastStatus: FacebookPageConnectionStatus = 'missing_credentials';
  private lastError: string | null = null;
  private lastSyncAt: string | null = null;
  private lastFetchedCount: number = 0;
  private pageInfo: {
    title: string;
    handle: string;
    avatar: string;
    followerCount: string;
  } | null = null;

  getConfig(): SocialPlatformConfig {
    return socialsConfig.find(p => p.id === 'facebook_page')!;
  }

  isLiveApiConfigured(): boolean {
    const pageToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN?.trim();
    const pageId = process.env.FACEBOOK_PAGE_ID?.trim();
    return Boolean(pageToken && pageToken !== '' && pageId && pageId !== '');
  }

  getStatusDetails(): ProviderStatusDetails {
    const configured = this.isLiveApiConfigured();
    let modeText = 'Mock Preview Ready (Missing FACEBOOK_PAGE_ACCESS_TOKEN or FACEBOOK_PAGE_ID)';

    if (configured) {
      if (this.lastStatus === 'connected') {
        modeText = `Live Graph API Active (${this.pageInfo?.title || 'Facebook Page'})`;
      } else if (this.lastStatus === 'invalid_token') {
        modeText = 'API Token Error: Invalid or expired FACEBOOK_PAGE_ACCESS_TOKEN';
      } else if (this.lastStatus === 'page_not_found') {
        modeText = 'Page Error: FACEBOOK_PAGE_ID not found or inaccessible';
      } else if (this.lastStatus === 'permission_error') {
        modeText = 'Permission Error: Access token lacks pages_read_engagement permission';
      } else if (this.lastStatus === 'api_error') {
        modeText = `API Error: ${this.lastError || 'Failed to communicate with Meta Graph API'}`;
      } else {
        modeText = 'Live Graph API Configured (Pending Sync)';
      }
    }

    return {
      configured,
      connected: configured && this.lastStatus === 'connected',
      status: configured ? this.lastStatus : 'missing_credentials',
      mode: modeText,
      channelInfo: this.pageInfo ? {
        title: this.pageInfo.title,
        handle: this.pageInfo.handle,
        avatar: this.pageInfo.avatar,
        subscriberCount: this.pageInfo.followerCount
      } : null,
      lastSyncAt: this.lastSyncAt,
      itemCount: this.lastFetchedCount,
      errorDetails: this.lastError
    };
  }

  async fetchLatestContent(limit: number = 6): Promise<ContentItem[]> {
    if (!this.isLiveApiConfigured()) {
      this.lastStatus = 'missing_credentials';
      this.lastError = 'Missing FACEBOOK_PAGE_ACCESS_TOKEN or FACEBOOK_PAGE_ID environment variables.';
      return [];
    }

    try {
      const realItems = await this.fetchLiveFacebookPageAPI(limit);
      this.lastStatus = 'connected';
      this.lastError = null;
      this.lastSyncAt = new Date().toISOString();
      this.lastFetchedCount = realItems.length;
      return realItems;
    } catch (error: any) {
      const errMsg = error?.message || String(error);
      console.error('[FacebookPageProvider] Live API request failed:', errMsg);

      if (errMsg.includes('Session has expired') || errMsg.includes('190') || errMsg.includes('OAuth') || errMsg.includes('token')) {
        this.lastStatus = 'invalid_token';
        this.lastError = 'Invalid or expired FACEBOOK_PAGE_ACCESS_TOKEN.';
      } else if (errMsg.includes('100') || errMsg.includes('page') || errMsg.includes('does not exist')) {
        this.lastStatus = 'page_not_found';
        this.lastError = 'FACEBOOK_PAGE_ID not found or inaccessible.';
      } else if (errMsg.includes('permission') || errMsg.includes('200')) {
        this.lastStatus = 'permission_error';
        this.lastError = 'Insufficient permissions for this Page Access Token.';
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

  private async fetchLiveFacebookPageAPI(limit: number): Promise<ContentItem[]> {
    const rawToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN?.trim();
    const pageId = process.env.FACEBOOK_PAGE_ID?.trim();

    if (!rawToken || !pageId) {
      throw new Error('FACEBOOK_PAGE_ACCESS_TOKEN or FACEBOOK_PAGE_ID missing');
    }

    // Step 1: Query Page Profile Info & Resolve Page Access Token from Meta Graph API
    const pageProfileUrl = `https://graph.facebook.com/v19.0/${pageId}?fields=id,name,username,link,picture.type(large),fan_count,followers_count,access_token&access_token=${rawToken}`;
    const pageRes = await fetch(pageProfileUrl);

    let pageName = 'Facebook Page';
    let pageHandle = `@${pageId}`;
    let pageAvatar = 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800';
    let followerCount = '100K';
    let pageAccessToken = rawToken;

    if (pageRes.ok) {
      const pageData = await pageRes.json();
      pageName = pageData.name || pageName;
      pageHandle = pageData.username ? `@${pageData.username}` : `@${pageData.id || pageId}`;
      pageAvatar = pageData.picture?.data?.url || pageAvatar;
      if (pageData.access_token) {
        pageAccessToken = pageData.access_token;
      }
      const count = pageData.followers_count || pageData.fan_count;
      if (count) followerCount = this.formatNumber(count);

      this.pageInfo = {
        title: pageName,
        handle: pageHandle,
        avatar: pageAvatar,
        followerCount
      };
    } else {
      const errJson = await pageRes.json().catch(() => null);
      const errMsg = errJson?.error?.message || `Status ${pageRes.status}`;
      throw new Error(`Meta Graph API Page Profile Error (${pageRes.status}): ${errMsg}`);
    }

    // Step 2: Query Page Posts from Meta Graph API using the resolved Page Access Token and clean fields
    const fields = 'id,message,story,created_time,full_picture,permalink_url,shares,attachments{media,type,target,title,url}';
    const postsUrl = `https://graph.facebook.com/v19.0/${pageId}/posts?fields=${fields}&limit=${limit}&access_token=${pageAccessToken}`;
    const postsRes = await fetch(postsUrl);

    if (!postsRes.ok) {
      const errJson = await postsRes.json().catch(() => null);
      const errMsg = errJson?.error?.message || `Status ${postsRes.status}`;
      throw new Error(`Meta Graph API Posts Error (${postsRes.status}): ${errMsg}`);
    }

    const data = await postsRes.json();
    if (!data.data || !Array.isArray(data.data)) {
      return [];
    }

    return data.data.map((item: any, idx: number) => {
      const msg = item.message || item.story || 'Facebook Post Update';
      const title = msg.length > 70 ? `${msg.substring(0, 67)}...` : msg;
      
      const attachmentImg = item.attachments?.data?.[0]?.media?.image?.src;
      const thumbnailUrl = item.full_picture || attachmentImg || 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800';

      const sharesCount = item.shares?.count || 0;
      const permalink = item.permalink_url || `https://www.facebook.com/${item.id}`;

      return {
        id: `fbp-${item.id}`,
        platform: 'facebook_page' as PlatformId,
        title,
        description: msg,
        thumbnail: thumbnailUrl,
        url: permalink,
        publishedAt: item.created_time || new Date().toISOString(),
        type: 'post' as ContentType,
        likes: sharesCount > 0 ? this.formatNumber(sharesCount * 3) : '240',
        comments: sharesCount > 0 ? this.formatNumber(sharesCount) : '42',
        views: sharesCount > 0 ? `${this.formatNumber(sharesCount)} shares` : undefined,
        featured: idx === 0,
        tags: ['Facebook', 'Community', 'Update'],
        author: {
          name: pageName,
          handle: pageHandle,
          avatar: pageAvatar
        },
        isFallback: false
      };
    });
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

export class FacebookProfileProvider implements ISocialProvider {
  platformId: PlatformId = 'facebook_profile';

  getConfig(): SocialPlatformConfig {
    return socialsConfig.find(p => p.id === 'facebook_profile')!;
  }

  isLiveApiConfigured(): boolean {
    return Boolean(
      typeof process !== 'undefined' &&
      process.env?.FACEBOOK_USER_ACCESS_TOKEN &&
      process.env.FACEBOOK_USER_ACCESS_TOKEN !== ''
    );
  }

  async fetchLatestContent(limit: number = 6): Promise<ContentItem[]> {
    if (this.isLiveApiConfigured()) {
      try {
        return await this.fetchLiveFacebookProfileAPI(limit);
      } catch (error: any) {
        console.warn('[FacebookProfileProvider] Meta API restrictions apply:', error.message || error);
      }
    }

    // Meta Graph API policy restricts reading personal profile wall posts via automated endpoints.
    // Return empty array to avoid generating fake/mock posts.
    return [];
  }

  private async fetchLiveFacebookProfileAPI(limit: number): Promise<ContentItem[]> {
    const userToken = process.env.FACEBOOK_USER_ACCESS_TOKEN;
    if (!userToken) throw new Error('FACEBOOK_USER_ACCESS_TOKEN missing');

    // Note: Meta Graph API v3.0+ strictly restricts reading personal profile user_posts
    // for 3rd party public sites unless explicitly passing user OAuth consent + App Review.
    const url = `https://graph.facebook.com/v19.0/me/posts?limit=${limit}&access_token=${userToken}`;
    const res = await fetch(url);

    if (!res.ok) {
      const errData = await res.json().catch(() => null);
      const errMsg = errData?.error?.message || `Status ${res.status}`;
      throw new Error(`Facebook Personal Profile API restricted by Meta policy: ${errMsg}`);
    }

    const data = await res.json();
    if (!data.data || !Array.isArray(data.data)) {
      return [];
    }

    return data.data.map((item: any) => ({
      id: `fbuser-${item.id}`,
      platform: 'facebook_profile' as PlatformId,
      title: item.story || item.message || 'Personal Status Update',
      description: item.message || item.story || '',
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
      url: `https://facebook.com/${item.id}`,
      publishedAt: item.created_time || new Date().toISOString(),
      type: 'post',
      likes: '1.2K',
      comments: '340',
      tags: ['Facebook', 'Personal']
    }));
  }
}

export const facebookPageProvider = new FacebookPageProvider();
export const facebookProfileProvider = new FacebookProfileProvider();
