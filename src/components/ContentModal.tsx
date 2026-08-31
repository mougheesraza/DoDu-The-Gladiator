import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ExternalLink, 
  Play, 
  Calendar, 
  Eye, 
  Heart, 
  MessageSquare, 
  Clock, 
  Tag, 
  Share2 
} from 'lucide-react';
import { ContentItem } from '../types/social';

interface ContentModalProps {
  item: ContentItem | null;
  onClose: () => void;
}

export const ContentModal: React.FC<ContentModalProps> = ({ item, onClose }) => {
  if (!item) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-4">
        
        {/* Modal Backdrop click */}
        <div className="fixed inset-0" onClick={onClose} />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative bg-slate-900 border border-white/10 rounded-2xl max-w-2xl w-full p-6 shadow-2xl z-10 overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white border border-white/10 transition-colors z-20"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Player / Thumbnail Frame */}
          <div className="relative h-64 sm:h-80 rounded-xl overflow-hidden mb-6 border border-white/10 group">
            <img
              src={item.thumbnail}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-16 h-16 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
              >
                <Play className="w-7 h-7 fill-current ml-1" />
              </a>
            </div>

            {/* Platform Tag */}
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/90 text-xs font-mono text-cyan-400 font-bold border border-white/10 uppercase">
              {item.platform}
            </div>

            {item.duration && (
              <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-slate-950/90 text-xs font-mono text-white flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>{item.duration}</span>
              </div>
            )}
          </div>

          {/* Content Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                {formatDate(item.publishedAt)}
              </span>
              <span>•</span>
              <span className="capitalize px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {item.type}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
              {item.title}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {item.description}
            </p>

            {/* Tags if available */}
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {item.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 text-[11px] font-mono text-slate-300"
                  >
                    <Tag className="w-3 h-3 text-cyan-400" />
                    <span>#{tag}</span>
                  </span>
                ))}
              </div>
            )}

            {/* Stats & External Link */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs font-mono text-slate-300">
                {item.views && (
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4 text-cyan-400" />
                    {item.views}
                  </span>
                )}
                {item.likes && (
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4 text-rose-500" />
                    {item.likes}
                  </span>
                )}
              </div>

              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all"
              >
                <span>View on {item.platform}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
