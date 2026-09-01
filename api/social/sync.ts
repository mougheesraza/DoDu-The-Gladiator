import { socialSyncService } from '../../src/lib/serverApi.js';

export default async function handler(req: any, res: any) {
  try {
    const secret = (req.headers['x-sync-secret'] as string) || (req.query.secret as string);
    const adminSecret = process.env.ADMIN_SECRET_KEY || process.env.SYNC_SECRET_KEY;

    if (adminSecret && secret !== adminSecret && process.env.NODE_ENV === 'production') {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Invalid or missing sync secret',
      });
    }

    const summary = await socialSyncService.syncAllPlatforms();
    return res.status(200).json({
      success: true,
      message: 'Social platforms synchronized successfully',
      summary,
    });
  } catch (error: any) {
    console.error('[api/social/sync]', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Synchronization failed',
    });
  }
}
