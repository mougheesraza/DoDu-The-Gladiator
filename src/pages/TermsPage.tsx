import React, { useEffect } from 'react';
import { ShieldCheck, FileText, ArrowLeft, ArrowUpRight, Scale, CheckCircle2, Lock, HelpCircle } from 'lucide-react';
import { profileConfig } from '../config/profileConfig';

interface TermsPageProps {
  onNavigate: (path: string) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onNavigate }) => {
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
            id="btn-back-home-terms"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400" />
            <span>Back to Creator Hub</span>
          </button>
          
          <div className="text-xs font-mono text-slate-500">
            Last Updated: February 2026
          </div>
        </div>

        {/* Hero Header */}
        <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-indigo-500/30 shadow-2xl mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                Legal Framework
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Terms of Service
              </h1>
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
            Welcome to <strong className="text-white">{profileConfig.name}'s Creator Hub</strong>. Please read these Terms of Service carefully before exploring our consolidated social media feed, embedded content, and public platforms.
          </p>
        </div>

        {/* Content Body */}
        <div className="space-y-8 text-sm text-slate-300 leading-relaxed font-sans">
          
          {/* Section 1 */}
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <CheckCircle2 className="w-5 h-5 text-cyan-400" />
              <span>1. Acceptance of Terms</span>
            </h2>
            <p>
              By accessing or using this website (including all subpages, embedded video players, and aggregated feeds), you agree to comply with and be bound by these Terms of Service ("Terms") and our accompanying Privacy Policy. If you do not agree to these Terms, please refrain from using this website.
            </p>
          </section>

          {/* Section 2 */}
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <FileText className="w-5 h-5 text-cyan-400" />
              <span>2. Social Media Aggregation & Platform API Usage</span>
            </h2>
            <p>
              This website serves as a unified content aggregator showcasing public media posts, video uploads, and updates published across official social media channels, including YouTube, TikTok, Instagram, Facebook, and X (Twitter).
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-400">
              <li>
                <strong className="text-slate-200">YouTube API Services:</strong> This website utilizes YouTube API Services to display video content, thumbnails, and channel metrics. By viewing YouTube content on this site, you agree to be bound by the <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline inline-flex items-center gap-0.5">YouTube Terms of Service <ArrowUpRight className="w-3 h-3" /></a>.
              </li>
              <li>
                <strong className="text-slate-200">Third-Party Platform Terms:</strong> Content aggregated from TikTok, Meta (Instagram & Facebook), and X (Twitter) adheres to their respective developer guidelines and public API usage policies.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <Lock className="w-5 h-5 text-cyan-400" />
              <span>3. Intellectual Property Rights</span>
            </h2>
            <p>
              All video content, photographs, graphics, trademarks, logos, and audio assets published on this site belong exclusively to <strong className="text-white">{profileConfig.name}</strong> or the respective social media platform rights holders.
            </p>
            <p>
              You are granted a limited, non-exclusive, non-transferable license to view the content for personal, non-commercial purposes. You may not re-upload, re-sell, frame without permission, or commercialize any media without prior written consent.
            </p>
          </section>

          {/* Section 4 */}
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <span>4. Acceptable User Conduct</span>
            </h2>
            <p>When interacting with this website or sending messages via our contact forms, you agree not to:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
              <li>Attempt to gain unauthorized access to server infrastructure or API endpoints.</li>
              <li>Execute automated scraping, data mining, or rate-limit circumvention against our backend routes.</li>
              <li>Submit abusive, defamatory, illegal, or unsolicited spam content through contact inquiries.</li>
              <li>Interfere with the proper operation or security mechanisms of the website.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <HelpCircle className="w-5 h-5 text-cyan-400" />
              <span>5. Disclaimers & Limitation of Liability</span>
            </h2>
            <p>
              This website and all included content are provided on an <strong className="text-slate-200">"AS IS"</strong> and <strong className="text-slate-200">"AS AVAILABLE"</strong> basis without warranties of any kind, either express or implied.
            </p>
            <p>
              We do not warrant that third-party social media APIs will remain uninterrupted or free from temporary service disruptions. Under no circumstances shall <strong className="text-white">{profileConfig.name}</strong> be liable for any indirect, incidental, or consequential damages resulting from your use of this website.
            </p>
          </section>

          {/* Section 6 */}
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <FileText className="w-5 h-5 text-cyan-400" />
              <span>6. Contact & Legal Inquiries</span>
            </h2>
            <p>
              If you have questions regarding these Terms of Service or intellectual property rights, please reach out directly:
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
            onClick={() => onNavigate('/privacy')}
            className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Read Privacy Policy →
          </button>
        </div>

      </div>
    </div>
  );
};
