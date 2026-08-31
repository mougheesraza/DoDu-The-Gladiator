import React, { useEffect } from 'react';
import { Shield, Lock, Eye, ArrowLeft, ArrowUpRight, CheckCircle2, Server, Globe2, UserCheck } from 'lucide-react';
import { profileConfig } from '../config/profileConfig';

interface PrivacyPageProps {
  onNavigate: (path: string) => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onNavigate }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => onNavigate('/')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-white/10 hover:border-cyan-500/50 text-xs font-semibold text-slate-300 hover:text-white transition-all shadow-sm"
            id="btn-back-home-privacy"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400" />
            <span>Back to Creator Hub</span>
          </button>
          
          <div className="text-xs font-mono text-slate-500">
            Last Updated: February 2026
          </div>
        </div>

        {/* Hero Header */}
        <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-cyan-500/30 shadow-2xl mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                Data Protection & Transparency
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Privacy Policy
              </h1>
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
            At <strong className="text-white">{profileConfig.name}'s Creator Hub</strong>, we respect your privacy and are committed to safeguarding personal information. This Privacy Policy details how data is handled when you visit our website.
          </p>
        </div>

        {/* Content Body */}
        <div className="space-y-8 text-sm text-slate-300 leading-relaxed font-sans">
          
          {/* Section 1 */}
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <Eye className="w-5 h-5 text-cyan-400" />
              <span>1. Information We Collect</span>
            </h2>
            <p>
              We prioritize data minimization. The types of information we collect or process fall into three categories:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-400">
              <li>
                <strong className="text-slate-200">Public Social Media API Data:</strong> We aggregate publicly available video metadata, post titles, descriptions, public view counts, like counts, and channel information from official developer APIs (YouTube, TikTok, Instagram, Facebook, and X). We do not request or access private account passwords or non-public user data.
              </li>
              <li>
                <strong className="text-slate-200">Contact Information:</strong> If you voluntarily send a message through our Contact & Collaboration form, we collect your name, email address, message subject, and content solely to respond to your inquiry.
              </li>
              <li>
                <strong className="text-slate-200">Technical Log Data:</strong> Standard server logs (IP address, browser type, device information, access timestamps) may be generated for security monitoring, performance optimization, and spam prevention.
              </li>
            </ul>
          </section>

          {/* Section 2 - YouTube API Disclosure */}
          <section className="p-6 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-indigo-500/20 pb-3">
              <Globe2 className="w-5 h-5 text-indigo-400" />
              <span>2. YouTube API Services & Google Privacy Policy Notice</span>
            </h2>
            <p>
              This website uses <strong className="text-white">YouTube API Services</strong> to display public video uploads, thumbnails, duration information, and statistics from our official YouTube channel.
            </p>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-indigo-500/20 text-xs space-y-2 font-mono text-slate-300">
              <p className="text-cyan-300 font-bold">Important Notice to Visitors:</p>
              <p>
                By using or interacting with YouTube content hosted on this website, you agree to be bound by the <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline inline-flex items-center gap-0.5">YouTube Terms of Service <ArrowUpRight className="w-3 h-3" /></a> and the <a href="http://www.google.com/policies/privacy" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline inline-flex items-center gap-0.5">Google Privacy Policy <ArrowUpRight className="w-3 h-3" /></a>.
              </p>
            </div>
            <p className="text-slate-400">
              YouTube API data fetched by our server is cached temporarily in server memory to reduce API quota usage and improve response times. No private personal data from YouTube account holders is stored or tracked by our application.
            </p>
          </section>

          {/* Section 3 */}
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <Server className="w-5 h-5 text-cyan-400" />
              <span>3. How We Use Information</span>
            </h2>
            <p>We use the collected information exclusively to:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
              <li>Display unified social media content feeds and spotlight featured videos.</li>
              <li>Respond to sponsorship, collaboration, and press inquiries.</li>
              <li>Maintain website reliability, performance, and server security.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <Lock className="w-5 h-5 text-cyan-400" />
              <span>4. Data Caching & Security</span>
            </h2>
            <p>
              We implement industry-standard server safeguards, encryption in transit (HTTPS/SSL), and key isolation. Environment variables containing API keys are strictly confined to server-side code and are never exposed to client browsers.
            </p>
          </section>

          {/* Section 5 */}
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <UserCheck className="w-5 h-5 text-cyan-400" />
              <span>5. Your Data Choices & Contact</span>
            </h2>
            <p>
              You may clear your browser local storage at any time to remove saved preferences. If you have any privacy questions, or wish to request the deletion of a message sent via our contact form, please reach out to us:
            </p>
            <div className="pt-2 font-mono text-xs text-cyan-300">
              Email: <a href={`mailto:${profileConfig.email}`} className="underline hover:text-cyan-200">{profileConfig.email}</a>
            </div>
          </section>

        </div>

        {/* Footer Navigation */}
        <div className="mt-12 pt-6 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={() => onNavigate('/')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            ← Return to Homepage
          </button>
          
          <button
            onClick={() => onNavigate('/terms')}
            className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Read Terms of Service →
          </button>
        </div>

      </div>
    </div>
  );
};
