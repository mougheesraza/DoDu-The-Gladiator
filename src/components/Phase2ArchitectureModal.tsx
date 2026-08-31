import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  Database, 
  Key, 
  Server, 
  Terminal, 
  RefreshCw,
  Sparkles,
  Lock,
  Star,
  ExternalLink
} from 'lucide-react';
import { ContentItem, Phase2Status, ProviderStatusDetails } from '../types/social';
import { socialMediaHubService } from '../lib/social';

interface Phase2ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Phase2ArchitectureModal: React.FC<Phase2ArchitectureModalProps> = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState<Phase2Status | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [allContent, setAllContent] = useState<ContentItem[]>([]);
  const [selectedFeaturedId, setSelectedFeaturedId] = useState<string>('');

  const loadStatusAndContent = async () => {
    try {
      const res = await fetch('/api/phase2/status');
      if (res.ok) {
        const json = await res.json();
        setStatus(json);
      } else {
        setStatus(socialMediaHubService.getPhase2Status());
      }

      const contentRes = await fetch('/api/content');
      if (contentRes.ok) {
        const json = await contentRes.json();
        if (json.data) {
          setAllContent(json.data);
          const currentFeatured = json.data.find((i: ContentItem) => i.featured);
          if (currentFeatured) setSelectedFeaturedId(currentFeatured.id);
        }
      }
    } catch (e) {
      setStatus(socialMediaHubService.getPhase2Status());
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadStatusAndContent();
    }
  }, [isOpen]);

  const handleTriggerSync = async () => {
    setIsSyncing(true);
    setSyncMessage(null);
    try {
      const res = await fetch('/api/social/sync', { method: 'POST' });
      if (res.ok) {
        const json = await res.json();
        const ytMsg = json.summary?.providers?.youtube?.message || '';
        setSyncMessage(`Sync Complete! Total Synced: ${json.summary?.totalSynced || 0}. ${ytMsg}`);
        await loadStatusAndContent();
      } else {
        await socialMediaHubService.triggerSync();
        setSyncMessage('Local sync completed.');
        await loadStatusAndContent();
      }
    } catch (err: any) {
      await socialMediaHubService.triggerSync();
      setSyncMessage('Fallback local sync executed.');
      await loadStatusAndContent();
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSetFeatured = async (id: string) => {
    setSelectedFeaturedId(id);
    try {
      await fetch('/api/featured', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      await socialMediaHubService.setFeaturedContent(id);
      window.location.reload();
    } catch (e) {
      console.warn('Failed to update featured item:', e);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4">
        
        <div className="fixed inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative bg-slate-900 border border-indigo-500/30 rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl z-10 overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
              <Layers className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                Phase 2 API Pipeline & Control Center
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                Social Media API Status & Admin Controller
              </h2>
            </div>
          </div>

          <div className="space-y-6 text-xs text-slate-300 max-h-[75vh] overflow-y-auto pr-1 scrollbar-none">
            
            {/* Status & Sync Trigger */}
            <div className="p-4 rounded-xl bg-slate-950 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="font-bold text-white text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Normalized Server Pipeline Active</span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Consolidates YouTube, TikTok, Instagram, Facebook, and X APIs into a unified normalized feed.
                </p>
              </div>

              <button
                onClick={handleTriggerSync}
                disabled={isSyncing}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 font-bold text-white shadow-lg flex items-center gap-2 shrink-0 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Syncing...' : 'Trigger Manual Sync'}</span>
              </button>
            </div>

            {syncMessage && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{syncMessage}</span>
              </div>
            )}

            {/* Provider Matrix */}
            <div>
              <div className="font-mono text-slate-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                <Server className="w-4 h-4 text-cyan-400" />
                <span>6 Platform Adapter Statuses</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono">
                {status && Object.entries(status.providers).map(([key, providerInfo]) => {
                  const info = providerInfo as ProviderStatusDetails;
                  const isRestricted = key === 'facebook_profile';
                  const isConnected = info.connected;
                  const isError = info.status === 'invalid_key' || info.status === 'invalid_channel' || info.status === 'quota_exceeded' || info.status === 'api_error';

                  return (
                    <div
                      key={key}
                      className="p-3 rounded-xl bg-slate-950/80 border border-white/5 flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <div className="font-bold text-white uppercase text-[11px] truncate">
                          {key.replace('_', ' ')}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">{info.mode}</div>
                      </div>

                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold shrink-0 ${
                        isConnected
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : isError
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : info.configured
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : isRestricted
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                      }`}>
                        {isConnected
                          ? 'CONNECTED'
                          : isError
                          ? 'API ERROR'
                          : info.configured
                          ? 'CONFIGURED'
                          : isRestricted
                          ? 'META RESTRICTED'
                          : 'MOCK PREVIEW'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Admin Spotlight Picker */}
            <div className="p-4 rounded-xl bg-slate-950 border border-white/10 space-y-3">
              <div className="font-bold text-white font-mono flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400" />
                <span>Select Spotlight Featured Content</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Choose which video, reel, or tweet is highlighted in the hero Spotlight section.
              </p>
              <select
                value={selectedFeaturedId}
                onChange={(e) => handleSetFeatured(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                {allContent.map((item) => (
                  <option key={item.id} value={item.id}>
                    [{item.platform.toUpperCase()}] {item.title}
                  </option>
                ))}
              </select>
            </div>

            {/* API Endpoints & DB */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-white/10 space-y-2">
                <div className="font-bold text-white font-mono flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-fuchsia-400" />
                  <span>Server API Routes</span>
                </div>
                <ul className="space-y-1 font-mono text-[11px] text-slate-400">
                  <li className="text-cyan-300">GET /api/content</li>
                  <li className="text-cyan-300">GET /api/featured</li>
                  <li className="text-cyan-300">POST /api/social/sync</li>
                  <li className="text-cyan-300">GET /api/phase2/status</li>
                  <li className="text-cyan-300">GET /api/facebook/status</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-white/10 space-y-2">
                <div className="font-bold text-white font-mono flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span>Database / Cache Layer</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  In-memory server cache active with optional Supabase / PostgreSQL attachment.
                </p>
              </div>
            </div>

            {/* Environment Variables Reference */}
            <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/20 space-y-2 font-mono text-[11px]">
              <div className="text-indigo-300 font-bold flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-400" />
                <span>Phase 2 Credentials Reference (.env.example)</span>
              </div>
              <div className="text-slate-400 bg-slate-900 p-3 rounded-lg border border-white/5 space-y-1 overflow-x-auto text-[10px]">
                <p>YOUTUBE_API_KEY=""</p>
                <p>YOUTUBE_CHANNEL_ID=""</p>
                <p>TIKTOK_ACCESS_TOKEN=""</p>
                <p>INSTAGRAM_ACCESS_TOKEN=""</p>
                <p>FACEBOOK_PAGE_ACCESS_TOKEN=""</p>
                <p>TWITTER_BEARER_TOKEN=""</p>
              </div>
            </div>

            {/* Footer Close Button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500"
              >
                Close Controller
              </button>
            </div>

          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
