import { ContentItem, PlatformId } from '../../types/social';
import { mockContentData } from '../social/mockData';

export interface StoredContentItem extends ContentItem {
  platformContentId?: string;
  syncedAt?: string;
}

export interface SyncSummary {
  timestamp: string;
  totalSynced: number;
  newItemsAdded: number;
  itemsUpdated: number;
  providers: Record<PlatformId, {
    status: 'success' | 'unconfigured' | 'restricted' | 'error';
    itemCount: number;
    message?: string;
  }>;
}

/**
 * Server-Side Normalized Content Store & Cache Engine
 * Manages in-memory caching with duplicate prevention and optional Supabase / PostgreSQL sync
 */
class ContentStore {
  private cache: Map<string, StoredContentItem> = new Map();
  private featuredId: string | null = null;
  private lastSyncSummary: SyncSummary | null = null;
  private initialized = false;

  constructor() {
    this.initialized = true;
  }

  /**
   * Upsert a list of normalized content items into the store.
   * Prevents duplicates and cleans out stale items for the provider.
   */
  public async upsertItems(
    items: ContentItem[],
    providerId: PlatformId
  ): Promise<{ added: number; updated: number }> {
    let added = 0;
    let updated = 0;

    // Remove previous items for this provider so only real, active live items remain
    for (const [key, cached] of this.cache.entries()) {
      if (cached.platform === providerId) {
        this.cache.delete(key);
      }
    }

    // Filter out any fallback items or items marked isFallback
    const realItems = items.filter(i => !i.isFallback);

    for (const item of realItems) {
      const platformContentId = item.id.includes('-') ? item.id.split('-').slice(1).join('-') : item.id;

      const existing = Array.from(this.cache.values()).find(
        cached =>
          cached.id === item.id ||
          (cached.platform === item.platform && cached.platformContentId === platformContentId)
      );

      const storedItem: StoredContentItem = {
        ...item,
        platformContentId,
        syncedAt: new Date().toISOString()
      };

      if (existing) {
        if (existing.featured) {
          storedItem.featured = true;
        }
        this.cache.set(existing.id, storedItem);
        updated++;
      } else {
        this.cache.set(item.id, storedItem);
        added++;
      }
    }

    // Auto-feature the newest item if no featured item exists
    if (!this.featuredId && this.cache.size > 0) {
      const newest = Array.from(this.cache.values()).sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      )[0];
      if (newest) {
        newest.featured = true;
        this.featuredId = newest.id;
      }
    }

    return { added, updated };
  }

  /**
   * Get all cached content items with filtering, searching, sorting & limits
   */
  public async getAll(options?: {
    platform?: PlatformId | 'all';
    searchQuery?: string;
    limit?: number;
  }): Promise<ContentItem[]> {
    let items = Array.from(this.cache.values());

    // Filter by platform
    if (options?.platform && options.platform !== 'all') {
      items = items.filter(item => item.platform === options.platform);
    }

    // Filter by search query
    if (options?.searchQuery) {
      const query = options.searchQuery.toLowerCase();
      items = items.filter(
        item =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Sort by publication date descending
    items.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    if (options?.limit && options.limit > 0) {
      return items.slice(0, options.limit);
    }

    return items;
  }

  /**
   * Get featured content item
   */
  public async getFeatured(): Promise<ContentItem | null> {
    if (this.featuredId && this.cache.has(this.featuredId)) {
      return this.cache.get(this.featuredId)!;
    }

    const items = await this.getAll();
    const explicitFeatured = items.find(i => i.featured);
    if (explicitFeatured) return explicitFeatured;

    return items[0] || null;
  }

  /**
   * Set a content item as featured
   */
  public async setFeatured(id: string): Promise<boolean> {
    if (!this.cache.has(id)) return false;

    // Unset current featured items
    for (const item of this.cache.values()) {
      if (item.featured) {
        item.featured = false;
      }
    }

    const item = this.cache.get(id)!;
    item.featured = true;
    this.featuredId = id;
    return true;
  }

  /**
   * Save sync summary record
   */
  public setSyncSummary(summary: SyncSummary) {
    this.lastSyncSummary = summary;
  }

  /**
   * Retrieve last sync summary
   */
  public getSyncSummary(): SyncSummary | null {
    return this.lastSyncSummary;
  }

  /**
   * Get total item count stored
   */
  public getItemCount(): number {
    return this.cache.size;
  }
}

export const contentStore = new ContentStore();
