import dotenv from 'dotenv';
import fs from 'fs';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

// Load .env.local first if it exists, then fallback to .env
if (fs.existsSync('.env.local')) {
  dotenv.config({ path: '.env.local', override: true });
}
if (fs.existsSync('.env')) {
  dotenv.config();
}

import { profileConfig } from './src/config/profileConfig';
import { socialMediaHubService } from './src/lib/social';
import { socialSyncService } from './src/lib/social/syncService';
import { facebookPageProvider } from './src/lib/social/facebook';
import { instagramProvider } from './src/lib/social/instagram';
import { twitterProvider } from './src/lib/social/twitter';
import { PlatformId } from './src/types/social';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Trigger initial server-side content sync on startup
  console.log('🔄 Performing initial social media content sync...');
  socialSyncService.syncAllPlatforms()
    .then(summary => {
      console.log(`✅ Initial Sync Completed. Total items in cache: ${summary.totalSynced}`);
    })
    .catch(err => {
      console.warn('⚠️ Initial social sync warning:', err.message || err);
    });

  // Schedule periodic background sync every 30 minutes
  setInterval(() => {
    console.log('⏰ Executing scheduled background social sync...');
    socialSyncService.syncAllPlatforms().catch(console.error);
  }, 30 * 60 * 1000);

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'Creator Social Hub Server',
      phase: 2,
      activeProviders: 6
    });
  });

  // Profile configuration endpoint
  app.get('/api/profile', (req, res) => {
    res.json(profileConfig);
  });

  // Social platforms configuration endpoint
  app.get('/api/socials', (req, res) => {
    const socials = socialMediaHubService.getSocialsConfig();
    res.json(socials);
  });

  // Normalized content feed endpoint
  app.get('/api/content', async (req, res) => {
    try {
      const platform = (req.query.platform as PlatformId | 'all') || 'all';
      const searchQuery = (req.query.q as string) || '';
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;

      const items = await socialMediaHubService.getAllContent({
        platform,
        searchQuery,
        limit
      });

      res.json({
        success: true,
        count: items.length,
        platform,
        data: items
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch social content'
      });
    }
  });

  // Top featured content item endpoint
  app.get('/api/featured', async (req, res) => {
    try {
      const featured = await socialMediaHubService.getFeaturedContent();
      res.json({
        success: true,
        data: featured
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Set featured content item (Admin)
  app.post('/api/featured', async (req, res) => {
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ success: false, error: 'Content ID required' });
      }
      const success = await socialMediaHubService.setFeaturedContent(id);
      res.json({ success, id });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Automatic / Manual Social Content Sync Trigger Endpoint
  const handleSyncRequest = async (req: express.Request, res: express.Response) => {
    try {
      const secret = (req.headers['x-sync-secret'] as string) || (req.query.secret as string);
      const adminSecret = process.env.ADMIN_SECRET_KEY || process.env.SYNC_SECRET_KEY;

      // In production, enforce secret token validation if configured
      if (adminSecret && secret !== adminSecret && process.env.NODE_ENV === 'production') {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized: Invalid or missing x-sync-secret header / query token'
        });
      }

      const summary = await socialSyncService.syncAllPlatforms();
      res.json({
        success: true,
        message: 'Social platforms synchronized successfully',
        summary
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Synchronization failed'
      });
    }
  };

  app.post('/api/social/sync', handleSyncRequest);
  app.get('/api/social/sync', handleSyncRequest);

  // Phase 2 Integration Readiness & API Status Endpoint
  app.get('/api/phase2/status', (req, res) => {
    const status = socialMediaHubService.getPhase2Status();
    res.json(status);
  });

  // Facebook Page Specific Status Endpoint
  app.get('/api/facebook/status', (req, res) => {
    const status = facebookPageProvider.getStatusDetails();
    res.json(status);
  });

  // Instagram Specific Status Endpoint
  app.get('/api/instagram/status', (req, res) => {
    const status = instagramProvider.getStatusDetails();
    res.json(status);
  });

  // Instagram Live API Test / Trigger Endpoint
  app.get('/api/instagram/test', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 6;
      const items = await instagramProvider.fetchLatestContent(limit);
      const statusDetails = instagramProvider.getStatusDetails();

      res.json({
        success: statusDetails.connected,
        status: statusDetails,
        count: items.length,
        hasRealPosts: items.some(i => !i.isFallback),
        data: items
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        status: instagramProvider.getStatusDetails(),
        error: error.message || 'Instagram API test failed'
      });
    }
  });

  // Twitter / X Specific Status Endpoint
  app.get('/api/twitter/status', (req, res) => {
    const status = twitterProvider.getStatusDetails();
    res.json(status);
  });

  // Twitter / X Live API Test / Trigger Endpoint
  app.get('/api/twitter/test', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 6;
      const items = await twitterProvider.fetchLatestContent(limit);
      const statusDetails = twitterProvider.getStatusDetails();

      res.json({
        success: statusDetails.connected,
        status: statusDetails,
        count: items.length,
        hasRealPosts: items.some(i => !i.isFallback),
        data: items
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        status: twitterProvider.getStatusDetails(),
        error: error.message || 'Twitter API test failed'
      });
    }
  });

  // Facebook Page Live API Test / Trigger Endpoint
  app.get('/api/facebook/test', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 6;
      const items = await facebookPageProvider.fetchLatestContent(limit);
      const statusDetails = facebookPageProvider.getStatusDetails();

      res.json({
        success: statusDetails.connected,
        status: statusDetails,
        count: items.length,
        hasRealPosts: items.some(i => !i.isFallback),
        data: items
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        status: facebookPageProvider.getStatusDetails(),
        error: error.message || 'Facebook API test failed'
      });
    }
  });

  // Admin status & capability status
  app.get('/api/admin/status', (req, res) => {
    res.json({
      adminReady: true,
      authConfigured: Boolean(process.env.ADMIN_SECRET_KEY || process.env.SUPABASE_URL),
      allowedOperations: [
        'MANUAL_SOCIAL_SYNC',
        'PIN_FEATURED_CONTENT',
        'UPDATE_PROFILE',
        'INSPECT_API_CONNECTION_STATUS'
      ]
    });
  });

  // Vite development middleware or static production serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Creator Hub Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
