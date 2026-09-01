import { socialMediaHubService } from './social/index';
import { socialSyncService } from './social/syncService';
import { contentStore } from './storage/contentStore';

let syncPromise: Promise<unknown> | null = null;

export async function ensureContentSynced() {
  if (contentStore.getItemCount() > 0) return;
  if (!syncPromise) {
    syncPromise = socialSyncService.syncAllPlatforms().finally(() => {
      syncPromise = null;
    });
  }
  await syncPromise;
}

export { socialMediaHubService, socialSyncService, contentStore };
