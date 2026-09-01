import { twitterProvider } from '../../src/lib/social/twitter.js';

export default function handler(_req: any, res: any) {
  return res.status(200).json(twitterProvider.getStatusDetails());
}
