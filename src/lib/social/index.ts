import { ContentItem, Phase2Status, PlatformId, SocialPlatformConfig } from '../../types/social.js';
import { socialsConfig } from '../../config/socialsConfig.js';
import { contentStore, SyncSummary } from '../storage/contentStore.js';
import { facebookPageProvider, facebookProfileProvider } from './facebook.js';
import { instagramProvider } from './instagram.js';
import { tiktokProvider } from './tiktok.js';
import { twitterProvider } from './twitter.js';
import { youtubeProvider } from './youtube.js';
import { socialSyncService } from './syncService.js';

class SocialMediaHubService {
  private providers = {
    youtube: youtubeProvider,
    tiktok: tiktokProvider,
    instagram: instagramProvider,
    facebook_page: facebookPageProvider,
    facebook_profile: facebookProfileProvider,
    twitter: twitterProvider,
  };

  /**
   * Get social platforms configuration
   */
  getSocialsConfig(): SocialPlatformConfig[] {
    return socialsConfig;
  }

  /**
   * Fetch aggregated content feed from normalized content store / cache layer
   */
  async getAllContent(options?: {
    platform?: PlatformId | 'all';
    searchQuery?: string;
    limit?: number;
  }): Promise<ContentItem[]> {
    return contentStore.getAll(options);
  }

  /**
   * Get top featured content item
   */
  async getFeaturedContent(): Promise<ContentItem | null> {
    return contentStore.getFeatured();
  }

  /**
   * Pin / set a featured content item
   */
  async setFeaturedContent(id: string): Promise<boolean> {
    return contentStore.setFeatured(id);
  }

  /**
   * Trigger full synchronization
   */
  async triggerSync(): Promise<SyncSummary> {
    return socialSyncService.syncAllPlatforms();
  }

  /**
   * Get current Phase 2 API connection status & readiness summary
   */
  getPhase2Status(): Phase2Status & { lastSyncSummary: SyncSummary | null } {
    const isEnvPresent = (key: string) =>
      Boolean(typeof process !== 'undefined' && process.env?.[key] && process.env[key] !== '');

    const tt = isEnvPresent('TIKTOK_ACCESS_TOKEN');
    const ig = isEnvPresent('INSTAGRAM_ACCESS_TOKEN');
    const fbp = isEnvPresent('FACEBOOK_PAGE_ACCESS_TOKEN');
    const fbuser = isEnvPresent('FACEBOOK_USER_ACCESS_TOKEN');
    const tw = isEnvPresent('TWITTER_BEARER_TOKEN');
    const db = isEnvPresent('SUPABASE_URL') || isEnvPresent('DATABASE_URL');

    const youtubeStatus = youtubeProvider.getStatusDetails();
    const facebookPageStatus = facebookPageProvider.getStatusDetails();
    const instagramStatus = instagramProvider.getStatusDetails();
    const twitterStatus = twitterProvider.getStatusDetails();

    return {
      phase: 2,
      apiIntegrationsReady: youtubeStatus.configured || facebookPageStatus.configured || instagramStatus.configured || twitterStatus.configured || tt || fbuser,
      lastSyncSummary: contentStore.getSyncSummary(),
      providers: {
        youtube: youtubeStatus,
        tiktok: { configured: tt, mode: tt ? 'Live Display API Active' : 'Mock Preview Ready' },
        instagram: instagramStatus,
        facebook_page: facebookPageStatus,
        facebook_profile: { configured: fbuser, mode: fbuser ? 'Live Graph API (Meta Restricted)' : 'Official API Restricted by Meta' },
        twitter: twitterStatus,
        supabase: { configured: db, mode: db ? 'PostgreSQL Active' : 'In-Memory Cache Engine' },
      },
    };
  }
}

export const socialMediaHubService = new SocialMediaHubService();
