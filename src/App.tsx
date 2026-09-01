import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { SocialPlatforms } from './components/SocialPlatforms';
import { LatestContent } from './components/LatestContent';
import { FeaturedContent } from './components/FeaturedContent';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { ContentModal } from './components/ContentModal';
import { Phase2ArchitectureModal } from './components/Phase2ArchitectureModal';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { ContentItem } from './types/social';

export default function App() {
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [featuredItem, setFeaturedItem] = useState<ContentItem | null>(null);
  const [phase2ModalOpen, setPhase2ModalOpen] = useState<boolean>(false);
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    // Load featured content through the serverless API so secrets and server cache stay server-side.
    fetch('/api/featured')
      .then(async (res) => {
        const json = await res.json().catch(() => null);
        if (!res.ok || !json?.success) throw new Error(json?.error || `Featured API returned HTTP ${res.status}`);
        setFeaturedItem(json.data || null);
      })
      .catch((err) => {
        console.error('Failed to load featured content:', err);
        setFeaturedItem(null);
      });
  }, []);

  const renderContent = () => {
    if (currentPath === '/terms') {
      return <TermsPage onNavigate={navigate} />;
    }
    if (currentPath === '/privacy') {
      return <PrivacyPage onNavigate={navigate} />;
    }

    return (
      <main>
        <Hero />
        <About />
        <SocialPlatforms />
        
        {/* Spotlight Video Section */}
        {featuredItem && (
          <FeaturedContent
            content={featuredItem}
            onSelectContent={(item) => setSelectedContent(item)}
          />
        )}

        {/* Filterable Content Feed */}
        <LatestContent
          onSelectContent={(item) => setSelectedContent(item)}
        />

        <Contact />
      </main>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Top Navbar */}
      <Navbar
        onOpenPhase2Modal={() => setPhase2ModalOpen(true)}
        onNavigate={navigate}
      />

      {/* Main Content or Subpage */}
      {renderContent()}

      {/* Footer */}
      <Footer
        onOpenPhase2Modal={() => setPhase2ModalOpen(true)}
        onNavigate={navigate}
      />

      {/* Content Video View Modal */}
      <ContentModal
        item={selectedContent}
        onClose={() => setSelectedContent(null)}
      />

      {/* Phase 2 Architecture & API Readiness Inspector */}
      <Phase2ArchitectureModal
        isOpen={phase2ModalOpen}
        onClose={() => setPhase2ModalOpen(false)}
      />

    </div>
  );
}
