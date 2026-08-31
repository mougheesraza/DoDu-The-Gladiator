import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Grid, 
  Search, 
  Filter, 
  ExternalLink, 
  Eye, 
  Heart, 
  Play, 
  Calendar, 
  RefreshCw, 
  Youtube,
  Video,
  Instagram,
  Facebook,
  Twitter,
  Clock,
  AlertCircle,
  Info,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { ContentItem, PlatformId } from '../types/social';
import { socialMediaHubService } from '../lib/social';

interface LatestContentProps {
  onSelectContent: (item: ContentItem) => void;
}

export const LatestContent: React.FC<LatestContentProps> = ({ onSelectContent }) => {
  const [selectedFilter, setSelectedFilter] = useState<PlatformId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);

  const filterTabs: { id: PlatformId | 'all'; label: string; icon: any }[] = [
    { id: 'all', label: 'All Content', icon: Grid },
    { id: 'youtube', label: 'YouTube', icon: Youtube },
    { id: 'tiktok', label: 'TikTok', icon: Video },
    { id: 'instagram', label: 'Instagram', icon: Instagram },
    { id: 'facebook_page', label: 'Facebook Page', icon: Facebook },
    { id: 'facebook_profile', label: 'Facebook Personal', icon: Facebook },
    { id: 'twitter', label: 'X / Twitter', icon: Twitter },
  ];

  const fetchContent = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      // First attempt server API endpoint
      const params = new URLSearchParams();
      if (selectedFilter !== 'all') params.append('platform', selectedFilter);
      if (searchQuery) params.append('q', searchQuery);

      const res = await fetch(`/api/content?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setItems(json.data);
          return;
        }
      }

      // Fallback to local service
      const data = await socialMediaHubService.getAllContent({
        platform: selectedFilter,
        searchQuery: searchQuery,
      });
      setItems(data);
    } catch (err) {
      console.error('Failed to load content:', err);
      // Fallback
      try {
        const data = await socialMediaHubService.getAllContent({
          platform: selectedFilter,
          searchQuery: searchQuery,
        });
        setItems(data);
      } catch (e) {
        setHasError(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    setSyncStatusMsg(null);
    try {
      const res = await fetch('/api/social/sync', { method: 'POST' });
      if (res.ok) {
        const json = await res.json();
        setSyncStatusMsg(`Synced! ${json.summary?.totalSynced || items.length} total items ready.`);
        await fetchContent();
      } else {
        setSyncStatusMsg('Sync triggered locally.');
        await socialMediaHubService.triggerSync();
        await fetchContent();
      }
    } catch (err) {
      console.warn('Sync error:', err);
      await socialMediaHubService.triggerSync();
      await fetchContent();
      setSyncStatusMsg('Refreshed local content feed.');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncStatusMsg(null), 4000);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [selectedFilter, searchQuery]);

  const getPlatformBadge = (platform: PlatformId) => {
    switch (platform) {
      case 'youtube':
        return { name: 'YouTube', color: 'bg-red-600 text-white', icon: Youtube };
      case 'tiktok':
        return { name: 'TikTok', color: 'bg-cyan-500 text-slate-950 font-bold', icon: Video };
      case 'instagram':
        return { name: 'Instagram', color: 'bg-fuchsia-600 text-white', icon: Instagram };
      case 'facebook_page':
        return { name: 'Facebook Page', color: 'bg-blue-600 text-white', icon: Facebook };
      case 'facebook_profile':
        return { name: 'Facebook Profile', color: 'bg-sky-600 text-white', icon: Facebook };
      case 'twitter':
        return { name: 'X / Twitter', color: 'bg-zinc-800 text-white border border-white/20', icon: Twitter };
    }
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getPlatformNotice = () => {
    if (selectedFilter === 'facebook_profile') {
      return {
        title: 'Facebook Personal Profile Notice',
        message: 'Meta Graph API policy restricts third-party applications from reading personal profile wall posts via automated API endpoints. Your Facebook Page and other official channels sync live content automatically.',
        actionText: 'Visit Profile',
        url: 'https://www.facebook.com/profile.php?id=61586773150521',
        isRestricted: true
      };
    }
    if (selectedFilter === 'twitter') {
      return {
        title: 'X / Twitter API Credits Depleted (HTTP 402)',
        message: 'Live X / Twitter posts are temporarily unavailable because the X API Developer Project has ran out of API credits. All API credentials and User ID configuration remain intact and will resume live sync automatically once credits are refreshed.',
        actionText: 'X Developer Portal',
        url: 'https://developer.x.com/en/portal/dashboard',
        isRestricted: true
      };
    }
    if (selectedFilter === 'tiktok' && items.length === 0) {
      return {
        title: 'TikTok Integration Notice',
        message: 'TikTok setup and review will be completed in a future phase. Live TikTok posts will automatically populate here once live API credentials are confirmed.',
        actionText: 'Visit TikTok',
        url: 'https://www.tiktok.com',
        isRestricted: false
      };
    }
    return null;
  };

  const platformNotice = getPlatformNotice();

  return (
    <section id="content" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-mono uppercase tracking-wider mb-3">
              <Grid className="w-3.5 h-3.5" />
              <span>Unified Feed</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Latest From My Socials
            </h2>
            <p className="mt-2 text-slate-400 text-sm sm:text-base max-w-xl">
              Browse videos, reels, threads, and posts in one synchronized, filterable stream.
            </p>
          </div>

          {/* Sync Trigger Button */}
          <div className="flex items-center gap-3">
            {syncStatusMsg && (
              <span className="text-xs text-emerald-400 font-mono flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl animate-fade-in">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {syncStatusMsg}
              </span>
            )}
            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 hover:border-cyan-500/40 text-xs font-semibold text-slate-200 hover:text-white transition-all shadow-lg hover:shadow-cyan-500/10 active:scale-95 disabled:opacity-50"
              title="Trigger manual API sync"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing APIs...' : 'Sync Social Feeds'}</span>
            </button>
          </div>
        </div>

        {/* Filter Bar & Search Input */}
        <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/80 p-3 rounded-2xl border border-white/10 backdrop-blur-md">
          
          {/* Scrollable Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {filterTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = selectedFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedFilter(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                  id={`btn-filter-${tab.id}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search content..."
              className="w-full bg-slate-950/80 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

        </div>

        {/* Platform Status Info Banner (when applicable) */}
        {platformNotice && (
          <div className="mb-8 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
            <div className="flex items-start gap-3">
              <Lock className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
              <div>
                <span className="font-bold text-amber-300 block mb-0.5">{platformNotice.title}</span>
                <span className="text-slate-300 leading-relaxed">{platformNotice.message}</span>
              </div>
            </div>
            <a
              href={platformNotice.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/30 font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all self-end sm:self-auto"
            >
              <span>{platformNotice.actionText}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}

        {/* Content States: Loading, Error, Empty, or Content Grid */}
        {isLoading ? (
          /* Loading Skeleton State */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="rounded-2xl bg-slate-900 border border-white/10 p-4 space-y-4 animate-pulse">
                <div className="h-48 bg-slate-800 rounded-xl" />
                <div className="h-4 bg-slate-800 rounded w-3/4" />
                <div className="h-3 bg-slate-800 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : hasError ? (
          /* Error State UI */
          <div className="p-12 text-center rounded-2xl bg-slate-900 border border-red-500/20 max-w-md mx-auto">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">Failed to load content feed</h3>
            <p className="text-xs text-slate-400 mb-4">
              Unable to aggregate platform feeds at this time.
            </p>
            <button
              onClick={fetchContent}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 text-white hover:bg-red-500"
            >
              Try Again
            </button>
          </div>
        ) : items.length === 0 ? (
          /* Empty State UI */
          <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-white/10 max-w-md mx-auto">
            <Filter className="w-10 h-10 text-cyan-400 mx-auto mb-3 opacity-60" />
            <h3 className="text-lg font-bold text-white mb-1">No content found</h3>
            <p className="text-xs text-slate-400 mb-4">
              No matching posts or videos were found for "{searchQuery || selectedFilter}".
            </p>
            <button
              onClick={() => {
                setSelectedFilter('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-white hover:bg-slate-700 border border-white/10"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* Content Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => {
              const badge = getPlatformBadge(item.platform);
              const Icon = badge.icon;

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="group bg-slate-900/90 rounded-2xl border border-white/10 hover:border-white/20 p-4 flex flex-col justify-between shadow-xl backdrop-blur-md overflow-hidden"
                >
                  <div>
                    {/* Thumbnail Area */}
                    <div className="relative h-48 rounded-xl overflow-hidden mb-4 group/thumb cursor-pointer" onClick={() => onSelectContent(item)}>
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shadow-lg">
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </div>
                      </div>

                      {/* Top Left: Platform Badge */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold shadow-md backdrop-blur-md">
                        <span className={`px-2 py-0.5 rounded-full flex items-center gap-1 ${badge.color}`}>
                          <Icon className="w-3 h-3" />
                          <span>{badge.name}</span>
                        </span>
                      </div>

                      {/* Bottom Right: Duration or Content Type */}
                      {item.duration && (
                        <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-slate-950/90 border border-white/10 text-[10px] font-mono text-white flex items-center gap-1">
                          <Clock className="w-3 h-3 text-cyan-400" />
                          <span>{item.duration}</span>
                        </div>
                      )}
                    </div>

                    {/* Metadata Header */}
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2 font-mono">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        {formatDate(item.publishedAt)}
                      </span>
                      <span className="capitalize px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {item.type}
                      </span>
                    </div>

                    {/* Content Title */}
                    <h3 
                      onClick={() => onSelectContent(item)}
                      className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2 mb-2 cursor-pointer"
                    >
                      {item.title}
                    </h3>

                    {/* Content Description */}
                    <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    {/* Stats */}
                    <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                      {item.views && (
                        <span className="flex items-center gap-1" title="Views">
                          <Eye className="w-3.5 h-3.5 text-slate-500" />
                          {item.views}
                        </span>
                      )}
                      {item.likes && (
                        <span className="flex items-center gap-1" title="Likes">
                          <Heart className="w-3.5 h-3.5 text-rose-500" />
                          {item.likes}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectContent(item)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all"
                        id={`btn-view-${item.id}`}
                      >
                        Watch
                      </button>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white border border-white/10"
                        title="Open on platform"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
