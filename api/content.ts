import { ensureContentSynced, socialMediaHubService } from '../src/lib/serverApi';
import type { PlatformId } from '../src/types/social';

export default async function handler(req: any, res: any) {
  try {
    await ensureContentSynced();

    const platform = (req.query.platform as PlatformId | 'all') || 'all';
    const searchQuery = (req.query.q as string) || '';
    const rawLimit = Array.isArray(req.query.limit) ? req.query.limit[0] : req.query.limit;
    const limit = rawLimit ? parseInt(rawLimit, 10) : undefined;

    const items = await socialMediaHubService.getAllContent({
      platform,
      searchQuery,
      limit: Number.isFinite(limit) ? limit : undefined,
    });

    return res.status(200).json({
      success: true,
      count: items.length,
      platform,
      data: items,
    });
  } catch (error: any) {
    console.error('[api/content]', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Failed to fetch social content',
    });
  }
}
