import { socialMediaHubService } from './social/index.js';
import { socialSyncService } from './social/syncService.js';
import { contentStore } from './storage/contentStore.js';

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
