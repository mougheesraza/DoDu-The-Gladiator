import { PlatformId } from '../../types/social';
import { contentStore, SyncSummary } from '../storage/contentStore';
import { facebookPageProvider, facebookProfileProvider } from './facebook';
import { instagramProvider } from './instagram';
import { tiktokProvider } from './tiktok';
import { twitterProvider } from './twitter';
import { youtubeProvider } from './youtube';

export class SocialSyncService {
  private providers = {
    youtube: youtubeProvider,
    tiktok: tiktokProvider,
    instagram: instagramProvider,
    facebook_page: facebookPageProvider,
    facebook_profile: facebookProfileProvider,
    twitter: twitterProvider,
  };

  /**
   * Execute full synchronization across all 6 supported platforms.
   * Safe execution: errors on one platform do NOT break or halt others.
   */
  public async syncAllPlatforms(): Promise<SyncSummary> {
    const timestamp = new Date().toISOString();
    let totalAdded = 0;
    let totalUpdated = 0;

    const providerSummaries: SyncSummary['providers'] = {
      youtube: { status: 'unconfigured', itemCount: 0 },
      tiktok: { status: 'unconfigured', itemCount: 0 },
      instagram: { status: 'unconfigured', itemCount: 0 },
      facebook_page: { status: 'unconfigured', itemCount: 0 },
      facebook_profile: { status: 'restricted', itemCount: 0, message: 'Meta Graph API restricts automated personal post access.' },
      twitter: { status: 'unconfigured', itemCount: 0 },
    };

    const platformKeys = Object.keys(this.providers) as PlatformId[];

    await Promise.all(
      platformKeys.map(async (platform) => {
        const provider = this.providers[platform];
        const isConfigured = provider.isLiveApiConfigured();

        try {
          const items = await provider.fetchLatestContent(10);
          const { added, updated } = await contentStore.upsertItems(items, platform);

          totalAdded += added;
          totalUpdated += updated;

          providerSummaries[platform] = {
            status: isConfigured ? 'success' : 'unconfigured',
            itemCount: items.length,
            message: isConfigured
              ? `Successfully synced ${items.length} items via Live API.`
              : `Loaded ${items.length} preview items (Live API key not provided in .env).`
          };
        } catch (error: any) {
          console.error(`[SocialSyncService] Sync error for ${platform}:`, error.message || error);
          
          providerSummaries[platform] = {
            status: platform === 'facebook_profile' ? 'restricted' : 'error',
            itemCount: 0,
            message: error.message || `Failed to connect to ${platform} API.`
          };
        }
      })
    );

    const summary: SyncSummary = {
      timestamp,
      totalSynced: contentStore.getItemCount(),
      newItemsAdded: totalAdded,
      itemsUpdated: totalUpdated,
      providers: providerSummaries,
    };

    contentStore.setSyncSummary(summary);
    return summary;
  }
}

export const socialSyncService = new SocialSyncService();
