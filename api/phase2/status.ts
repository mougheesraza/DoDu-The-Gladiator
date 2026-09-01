import { socialMediaHubService } from '../../src/lib/serverApi.js';

export default async function handler(_req: any, res: any) {
  try {
    return res.status(200).json(socialMediaHubService.getPhase2Status());
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || 'Status check failed' });
  }
}
