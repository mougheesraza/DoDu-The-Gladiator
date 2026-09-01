import { twitterProvider } from '../../src/lib/social/twitter.js';

export default async function handler(req: any, res: any) {
  try {
    const raw = Array.isArray(req.query.limit) ? req.query.limit[0] : req.query.limit;
    const limit = raw ? parseInt(raw, 10) : 6;
    const items = await twitterProvider.fetchLatestContent(Number.isFinite(limit) ? limit : 6);
    const status = twitterProvider.getStatusDetails();
    return res.status(200).json({ success: status.connected, status, count: items.length, hasRealPosts: items.some(i => !i.isFallback), data: items });
  } catch (error: any) {
    return res.status(500).json({ success: false, status: twitterProvider.getStatusDetails(), error: error?.message || 'Twitter API test failed' });
  }
}
