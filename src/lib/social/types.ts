import { ContentItem, PlatformId, SocialPlatformConfig } from '../../types/social.js';

export interface ISocialProvider {
  platformId: PlatformId;
  getConfig(): SocialPlatformConfig;
  fetchLatestContent(limit?: number): Promise<ContentItem[]>;
  isLiveApiConfigured(): boolean;
}

export interface SocialFeedQueryOptions {
  platform?: PlatformId | 'all';
  searchQuery?: string;
  limit?: number;
  offset?: number;
}
