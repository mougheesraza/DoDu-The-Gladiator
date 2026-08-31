import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  ArrowRight, 
  Play, 
  Users, 
  TrendingUp, 
  Compass, 
  CheckCircle2,
  Youtube,
  Video,
  Instagram,
  Facebook,
  Twitter
} from 'lucide-react';
import { profileConfig } from '../config/profileConfig';
import { socialsConfig } from '../config/socialsConfig';

export const Hero: React.FC = () => {
  const scrollToSection = (href: string) => {
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const platformIconsMap: Record<string, any> = {
    youtube: Youtube,
    tiktok: Video,
    instagram: Instagram,
    facebook_page: Facebook,
    facebook_profile: Facebook,
    twitter: Twitter
  };

  return (
    <section id="home" className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Background Subtle Gradient Mesh */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-600/15 via-indigo-600/15 to-fuchsia-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293d0f_1px,transparent_1px),linear-gradient(to_bottom,#1f293d0f_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Creator Identity & Pitch */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 text-center lg:text-left"
          >
            {/* Status pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-white/10 shadow-lg text-xs font-medium text-slate-300 mb-6 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Available for Sponsorships & Collaborations</span>
              <span className="text-slate-600">|</span>
              <span className="text-cyan-400 font-mono">6 Connected Hubs</span>
            </div>

            {/* Main Title & Name */}
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-4">
              Hi, I'm{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-fuchsia-400">
                {profileConfig.name}
              </span>
            </h1>

            <p className="text-lg sm:text-xl font-medium text-cyan-200/90 mb-4 tracking-wide">
              {profileConfig.title}
            </p>

            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              {profileConfig.shortBio}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
              <button
                onClick={() => scrollToSection('#content')}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-300 to-fuchsia-300 hover:brightness-110 transition-all shadow-xl shadow-cyan-500/20 active:scale-[0.98]"
                id="btn-hero-explore"
              >
                <Compass className="w-4 h-4 text-slate-950" />
                <span>Explore My Content</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => scrollToSection('#socials')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-slate-900/90 hover:bg-slate-800 border border-white/10 transition-all active:scale-[0.98]"
                id="btn-hero-follow"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Follow Everywhere</span>
              </button>
            </div>

            {/* Platform Quick Bar */}
            <div className="pt-6 border-t border-white/10">
              <p className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-3 text-center lg:text-left">
                Direct Channels
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                {socialsConfig.map((soc) => {
                  const Icon = platformIconsMap[soc.id] || Youtube;
                  return (
                    <a
                      key={soc.id}
                      href={soc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white transition-all text-xs group"
                      title={`${soc.name} - ${soc.followers}`}
                    >
                      <Icon className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" style={{ color: soc.brandColor }} />
                      <span className="font-medium">{soc.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {soc.followers.split(' ')[0]}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Right Column: Hero Visual Card / Profile Display */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-sm lg:max-w-none">
              
              {/* Outer Decorative Ring */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-fuchsia-500 opacity-30 blur-xl animate-pulse" />

              <div className="relative bg-slate-900/90 rounded-2xl border border-white/10 p-6 shadow-2xl backdrop-blur-xl">
                
                {/* Avatar with status indicator */}
                <div className="relative w-full h-72 sm:h-80 rounded-xl overflow-hidden mb-6 group">
                  <img
                    src={profileConfig.avatarUrl}
                    alt={profileConfig.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                  
                  {/* Verified Creator Badge */}
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 text-xs font-medium text-emerald-400 flex items-center gap-1.5 shadow-md">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified Hub</span>
                  </div>

                  {/* Bottom Image Overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="text-white font-bold text-lg leading-snug">
                      {profileConfig.name}
                    </div>
                    <div className="text-xs text-slate-300 font-mono">
                      {profileConfig.location}
                    </div>
                  </div>
                </div>

                {/* Floating Metric Card Overlay */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                      <Users className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Audience</span>
                    </div>
                    <div className="text-lg font-bold text-white font-mono">
                      {profileConfig.metrics[0].value}
                    </div>
                    <div className="text-[10px] text-emerald-400 font-medium">
                      {profileConfig.metrics[0].trend}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                      <TrendingUp className="w-3.5 h-3.5 text-fuchsia-400" />
                      <span>Monthly Views</span>
                    </div>
                    <div className="text-lg font-bold text-white font-mono">
                      {profileConfig.metrics[1].value}
                    </div>
                    <div className="text-[10px] text-cyan-400 font-medium">
                      Across 6 networks
                    </div>
                  </div>
                </div>

                {/* Interactive Teaser Badge */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-indigo-950/50 to-slate-900 border border-indigo-500/20">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-400 flex items-center justify-center">
                      <Play className="w-4 h-4 fill-current" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">Latest Video</div>
                      <div className="text-[10px] text-slate-400">Desk Setup 2026</div>
                    </div>
                  </div>
                  <button
                    onClick={() => scrollToSection('#content')}
                    className="text-xs font-medium text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
                  >
                    Watch Now
                  </button>
                </div>

              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
