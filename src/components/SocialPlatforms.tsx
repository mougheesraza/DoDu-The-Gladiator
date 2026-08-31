import React from 'react';
import { motion } from 'motion/react';
import { 
  Globe2, 
  ExternalLink, 
  Youtube, 
  Video, 
  Instagram, 
  Facebook, 
  Twitter, 
  UserCheck, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { socialsConfig } from '../config/socialsConfig';
import { SocialPlatformConfig } from '../types/social';

export const SocialPlatforms: React.FC = () => {
  const iconMap: Record<string, any> = {
    Youtube,
    Video,
    Instagram,
    Facebook,
    UserCheck,
    Twitter
  };

  return (
    <section id="socials" className="py-20 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-indigo-600/10 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-mono uppercase tracking-wider mb-3">
            <Globe2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Find Me Everywhere</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Connect Across All 6 Platforms
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            Follow my official channels for long-form deep dives, short-form tips, photo journals, and live discussions.
          </p>
        </div>

        {/* 6 Platforms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {socialsConfig.map((soc: SocialPlatformConfig) => {
            const Icon = iconMap[soc.iconName] || Globe2;

            return (
              <motion.div
                key={soc.id}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.2 }}
                className="relative group rounded-2xl bg-slate-900/90 border border-white/10 hover:border-white/20 p-6 flex flex-col justify-between shadow-xl backdrop-blur-md overflow-hidden"
              >
                {/* Top Subtle Gradient Accent Line */}
                <div 
                  className="absolute top-0 left-0 right-0 h-1 transition-opacity opacity-80 group-hover:opacity-100"
                  style={{ backgroundColor: soc.brandColor }}
                />

                <div>
                  {/* Header: Platform Badge & Followers */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-110"
                        style={{ backgroundColor: `${soc.brandColor}25`, border: `1px solid ${soc.brandColor}40` }}
                      >
                        <Icon className="w-6 h-6" style={{ color: soc.brandColor }} />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-base leading-tight flex items-center gap-1.5">
                          {soc.name}
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                        </h3>
                        <p className="text-xs text-slate-400 font-mono">
                          {soc.handle}
                        </p>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-slate-800 text-slate-300 border border-white/5">
                      {soc.followers}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
                    {soc.description}
                  </p>
                </div>

                {/* Footer: Category Tag & Direct Visit Button */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-cyan-400/90 bg-cyan-950/60 px-2.5 py-0.5 rounded-md border border-cyan-500/20">
                    {soc.badgeText}
                  </span>

                  <a
                    href={soc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-white/10 hover:border-white/20 transition-all group-hover:text-cyan-300"
                    id={`btn-visit-${soc.id}`}
                  >
                    <span>Visit Profile</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
