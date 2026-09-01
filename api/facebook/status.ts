import { facebookPageProvider } from '../../src/lib/social/facebook.js';

export default function handler(_req: any, res: any) {
  return res.status(200).json(facebookPageProvider.getStatusDetails());
}
