import React, { useState } from 'react';
import { 
  ArrowUp, 
  Layers, 
  ShieldCheck, 
  FileText, 
  Globe2, 
  Youtube, 
  Video, 
  Instagram, 
  Facebook, 
  Twitter 
} from 'lucide-react';
import { profileConfig } from '../config/profileConfig';
import { socialsConfig } from '../config/socialsConfig';

interface FooterProps {
  onOpenPhase2Modal: () => void;
  onNavigate?: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPhase2Modal, onNavigate }) => {

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNav = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new Event('popstate'));
    }
  };

  const iconMap: Record<string, any> = {
    youtube: Youtube,
    tiktok: Video,
    instagram: Instagram,
    facebook_page: Facebook,
    facebook_profile: Facebook,
    twitter: Twitter
  };

  return (
    <footer className="bg-slate-950 border-t border-white/10 text-slate-400 py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-white/10 items-start">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={profileConfig.avatarUrl}
                alt={profileConfig.name}
                className="w-8 h-8 rounded-lg object-cover ring-2 ring-cyan-500/50"
              />
              <span className="font-bold text-white text-base tracking-tight">
                {profileConfig.name}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {profileConfig.shortBio}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenPhase2Modal}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-xs font-mono hover:bg-indigo-500/20 transition-all"
                id="btn-footer-phase2"
              >
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span>Phase 2 API Architecture</span>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-2">
            <div className="text-xs font-mono uppercase text-white font-semibold tracking-wider mb-3">
              Navigation
            </div>
            <ul className="space-y-2 text-xs">
              <li><a href="#home" className="hover:text-cyan-400 transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-cyan-400 transition-colors">About Me</a></li>
              <li><a href="#socials" className="hover:text-cyan-400 transition-colors">Find Me Everywhere</a></li>
              <li><a href="#content" className="hover:text-cyan-400 transition-colors">Unified Content Feed</a></li>
              <li><a href="#contact" className="hover:text-cyan-400 transition-colors">Contact & Collaborations</a></li>
            </ul>
          </div>

          {/* Connected Platforms */}
          <div className="md:col-span-4 space-y-3">
            <div className="text-xs font-mono uppercase text-white font-semibold tracking-wider mb-3">
              Social Media Accounts
            </div>
            <div className="flex flex-wrap gap-2">
              {socialsConfig.map((soc) => {
                const Icon = iconMap[soc.id] || Globe2;
                return (
                  <a
                    key={soc.id}
                    href={soc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-slate-900 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white transition-all text-xs flex items-center gap-1.5"
                    title={soc.name}
                  >
                    <Icon className="w-3.5 h-3.5" style={{ color: soc.brandColor }} />
                    <span className="font-mono text-[11px]">{soc.name}</span>
                  </a>
                );
              })}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} {profileConfig.name}. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/privacy"
              onClick={(e) => handleNav(e, '/privacy')}
              className="hover:text-slate-300 transition-colors"
              id="link-footer-privacy"
            >
              Privacy Policy
            </a>
            <span>•</span>
            <a
              href="/terms"
              onClick={(e) => handleNav(e, '/terms')}
              className="hover:text-slate-300 transition-colors"
              id="link-footer-terms"
            >
              Terms of Service
            </a>
            <span>•</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors"
              id="btn-back-to-top"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
