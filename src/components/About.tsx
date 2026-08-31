import React from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Sparkles, 
  Check, 
  Globe2, 
  Quote, 
  Layers, 
  Flame, 
  Zap, 
  Eye, 
  Users, 
  Activity 
} from 'lucide-react';
import { profileConfig } from '../config/profileConfig';

export const About: React.FC = () => {
  const metricIconsMap: Record<string, any> = {
    Users: Users,
    Eye: Eye,
    Activity: Activity,
    Globe: Globe2
  };

  return (
    <section id="about" className="py-20 relative bg-slate-950/60 border-t border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-mono uppercase tracking-wider mb-3">
            <User className="w-3.5 h-3.5" />
            <span>Behind The Content</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            About Me & My Creative Vision
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            Bridging technology, storytelling, and digital experience  across every major creator platform.
          </p>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Image & Bio Card */}
          <div className="lg:col-span-5">
            <div className="relative">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 opacity-20 blur-lg" />
              
              <div className="relative bg-slate-900 rounded-2xl border border-white/10 p-6 shadow-xl overflow-hidden">
                <div className="relative h-64 sm:h-72 rounded-xl overflow-hidden mb-6">
                  <img
                    src={profileConfig.avatarUrl}
                    alt={profileConfig.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-xs font-mono uppercase text-cyan-400 font-semibold tracking-wider">
                      Digital Creator
                    </span>
                    <h3 className="text-xl font-bold">{profileConfig.name}</h3>
                    <p className="text-xs text-slate-300 font-mono">{profileConfig.handle}</p>
                  </div>
                </div>

                {/* Quote Box */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-white/5 relative">
                  <Quote className="w-6 h-6 text-cyan-500/30 absolute top-3 right-3" />
                  <p className="text-xs text-slate-300 italic leading-relaxed">
                    "Great content isn't just about high-resolution video; it's about making complex ideas feel simple and inspiring action."
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Bio Details, Pillars & Stats */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Bio Paragraphs */}
            <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
              {profileConfig.fullBio.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* Creator Niches / Content Pillars */}
            <div>
              <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-3 flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Primary Content Pillars</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {profileConfig.niches.map((niche, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-xs font-medium text-slate-200 hover:border-cyan-500/40 hover:text-cyan-300 transition-colors"
                  >
                    <Check className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{niche}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Statistics Grid */}
            <div className="pt-6 border-t border-white/10">
              <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>Key Creator Metrics</span>
              </h4>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {profileConfig.metrics.map((m, idx) => {
                  const Icon = metricIconsMap[m.icon || 'Users'] || Users;
                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-900/90 border border-white/10 hover:border-white/20 transition-all"
                    >
                      <div className="flex items-center justify-between text-slate-400 mb-1">
                        <Icon className="w-4 h-4 text-cyan-400" />
                        <span className="text-[10px] text-emerald-400 font-mono font-medium">{m.trend}</span>
                      </div>
                      <div className="text-xl font-extrabold text-white font-mono mt-1">
                        {m.value}
                      </div>
                      <div className="text-xs font-medium text-slate-300 mt-0.5">
                        {m.label}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        {m.subtext}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
