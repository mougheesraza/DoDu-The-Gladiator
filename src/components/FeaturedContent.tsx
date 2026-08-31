import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Play, 
  Eye, 
  Heart, 
  Calendar, 
  ExternalLink, 
  Flame, 
  Youtube 
} from 'lucide-react';
import { ContentItem } from '../types/social';

interface FeaturedContentProps {
  content: ContentItem | null;
  onSelectContent: (item: ContentItem) => void;
}

export const FeaturedContent: React.FC<FeaturedContentProps> = ({ content, onSelectContent }) => {
  if (!content) return null;

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="relative rounded-3xl bg-slate-900/90 border border-indigo-500/30 p-6 lg:p-10 shadow-2xl backdrop-blur-xl overflow-hidden">
          
          {/* Subtle Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[100px] pointer-events-none" />

          {/* Section Header Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono uppercase tracking-wider mb-6">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Featured Spotlight</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Large Video Thumbnail Frame */}
            <div className="lg:col-span-7 relative group cursor-pointer" onClick={() => onSelectContent(content)}>
              <div className="relative h-64 sm:h-96 rounded-2xl overflow-hidden border border-white/10">
                <img
                  src={content.thumbnail}
                  alt={content.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-colors flex items-center justify-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 fill-current ml-1" />
                  </div>
                </div>

                {/* Duration Badge */}
                {content.duration && (
                  <div className="absolute bottom-4 right-4 px-3 py-1 rounded-lg bg-slate-950/90 border border-white/10 text-xs font-mono text-white">
                    {content.duration}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Detailed Description & CTAs */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-3 text-xs font-mono text-cyan-400">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 uppercase font-semibold">
                  {content.platform}
                </span>
                <span>•</span>
                <span>{content.type.toUpperCase()}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                {content.title}
              </h3>

              <p className="text-slate-300 text-sm leading-relaxed">
                {content.description}
              </p>

              {/* Engagement Stats */}
              <div className="flex items-center gap-6 py-3 border-t border-b border-white/10 text-xs font-mono text-slate-300">
                {content.views && (
                  <div className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-cyan-400" />
                    <span>{content.views} Views</span>
                  </div>
                )}
                {content.likes && (
                  <div className="flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-rose-500" />
                    <span>{content.likes} Likes</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onSelectContent(content)}
                  className="px-6 py-3 rounded-xl font-bold text-xs text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2"
                  id="btn-featured-watch"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Watch Now</span>
                </button>

                <a
                  href={content.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl font-semibold text-xs text-white bg-slate-800 hover:bg-slate-700 border border-white/10 flex items-center gap-2 transition-all"
                >
                  <span>Open External</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
