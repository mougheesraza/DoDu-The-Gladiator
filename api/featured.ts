import { ensureContentSynced, socialMediaHubService } from '../src/lib/serverApi.js';

export default async function handler(req: any, res: any) {
  try {
    await ensureContentSynced();

    if (req.method === 'POST') {
      const id = req.body?.id;
      if (!id) return res.status(400).json({ success: false, error: 'Content ID required' });
      const success = await socialMediaHubService.setFeaturedContent(id);
      return res.status(200).json({ success, id });
    }

    const featured = await socialMediaHubService.getFeaturedContent();
    return res.status(200).json({ success: true, data: featured });
  } catch (error: any) {
    console.error('[api/featured]', error);
    return res.status(500).json({ success: false, error: error?.message || 'Failed to load featured content' });
  }
}
