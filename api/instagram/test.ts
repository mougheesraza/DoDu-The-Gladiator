import { instagramProvider } from '../../src/lib/social/instagram.js';

export default async function handler(req: any, res: any) {
  try {
    const raw = Array.isArray(req.query.limit) ? req.query.limit[0] : req.query.limit;
    const limit = raw ? parseInt(raw, 10) : 6;
    const items = await instagramProvider.fetchLatestContent(Number.isFinite(limit) ? limit : 6);
    const status = instagramProvider.getStatusDetails();
    return res.status(200).json({ success: status.connected, status, count: items.length, hasRealPosts: items.some(i => !i.isFallback), data: items });
  } catch (error: any) {
    return res.status(500).json({ success: false, status: instagramProvider.getStatusDetails(), error: error?.message || 'Instagram API test failed' });
  }
}
