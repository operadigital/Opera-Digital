import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { StatsBar } from './components/StatsBar';
import { AiAgentsSection } from './components/AiAgentsSection';
import { ProductsSection } from './components/ProductsSection';
import { PortfolioSection } from './components/PortfolioSection';
import { Testimonial } from './components/Testimonial';
import { AboutSection } from './components/AboutSection';
import { CtaBanner } from './components/CtaBanner';
import { Footer } from './components/Footer';
import { RegistrationPage } from './components/RegistrationPage';
import { LoginModal } from './components/LoginModal';
import { TermsModal } from './components/TermsModal';
import { AdminPanel } from './components/AdminPanel';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<'home' | 'register' | 'admin'>('home');
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [termsModal, setTermsModal] = useState<{ isOpen: boolean; type: 'terms' | 'privacy' }>({
    isOpen: false,
    type: 'terms'
  });

  // Handle URL pathname, hash or search routes (e.g. /admin, #admin, /inscricao.html or #inscricao)
  useEffect(() => {
    const handleUrlRoute = () => {
      try {
        const path = window.location.pathname.toLowerCase();
        const hash = window.location.hash.toLowerCase();
        const search = window.location.search.toLowerCase();

        // Check if admin is in URL path, hash or search (e.g., /admin, #admin, ?admin)
        if (path.includes('admin') || hash.includes('admin') || search.includes('admin')) {
          setLoginModalOpen(true);
        }

        if (path.includes('inscricao') || hash === '#inscricao') {
          setCurrentRoute('register');
        } else if (path === '/' || path === '/index.html' || hash === '#home') {
          setCurrentRoute('home');
        }
      } catch (e) {
        console.warn('URL route handling error:', e);
      }
    };

    handleUrlRoute();
    window.addEventListener('popstate', handleUrlRoute);
    window.addEventListener('hashchange', handleUrlRoute);
    return () => {
      window.removeEventListener('popstate', handleUrlRoute);
      window.removeEventListener('hashchange', handleUrlRoute);
    };
  }, []);

  const navigateToRegister = () => {
    setCurrentRoute('register');
    try {
      window.history.pushState({}, '', '/inscricao.html');
    } catch (e) {
      console.warn('pushState ignored in sandboxed iframe environment:', e);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToHome = () => {
    setCurrentRoute('home');
    try {
      window.history.pushState({}, '', '/');
    } catch (e) {
      console.warn('pushState ignored in sandboxed iframe environment:', e);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openTermsModal = (type: 'terms' | 'privacy') => {
    setTermsModal({ isOpen: true, type });
  };

  const handleLoginSuccess = () => {
    setCurrentRoute('admin');
    setLoginModalOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If user is in Admin View
  if (currentRoute === 'admin') {
    return (
      <AdminPanel
        onLogout={() => {
          setCurrentRoute('home');
          window.history.pushState({}, '', '/');
        }}
        onGoToSite={() => {
          setCurrentRoute('home');
          window.history.pushState({}, '', '/');
        }}
      />
    );
  }

  // If user is on Registration Page (inscricao.html)
  if (currentRoute === 'register') {
    return (
      <div className="min-h-screen bg-slate-50">
        <RegistrationPage
          onNavigateHome={navigateToHome}
          onOpenLogin={() => setLoginModalOpen(true)}
          onOpenTerms={() => openTermsModal('terms')}
          onOpenPrivacy={() => openTermsModal('privacy')}
        />

        <LoginModal
          isOpen={loginModalOpen}
          onClose={() => setLoginModalOpen(false)}
          onNavigateToRegister={navigateToRegister}
          onLoginSuccess={handleLoginSuccess}
        />

        <TermsModal
          isOpen={termsModal.isOpen}
          type={termsModal.type}
          onClose={() => setTermsModal({ ...termsModal, isOpen: false })}
        />
      </div>
    );
  }

  // Main Institutional Page (index.html)
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-[#0A4EE4]/20 selection:text-[#0A4EE4]">
      
      {/* Sticky Header */}
      <Header
        onNavigateToRegister={navigateToRegister}
        onOpenLogin={() => setLoginModalOpen(true)}
        currentRoute={currentRoute}
        onNavigateHome={navigateToHome}
      />

      {/* Main Page Sections */}
      <main>
        {/* 1. Hero Section with Interactive Platform Dashboard Mockup */}
        <Hero onNavigateToRegister={navigateToRegister} />

        {/* 2. Stats Bar */}
        <StatsBar />

        {/* 3. Agentes de IA Section with Interactive Simulator */}
        <AiAgentsSection />

        {/* 4. Products Section with Alternating Blocks */}
        <ProductsSection onNavigateToRegister={navigateToRegister} />

        {/* 5. Trabalhos Realizados & Portfólio Dashboard */}
        <PortfolioSection />

        {/* 6. Customer Testimonial (Diego Costa - Tudo para Moto) */}
        <Testimonial />

        {/* 7. Sobre Section */}
        <AboutSection />

        {/* 8. Final Blue CTA Banner */}
        <CtaBanner onNavigateToRegister={navigateToRegister} />
      </main>

      {/* Footer */}
      <Footer
        onOpenTerms={() => openTermsModal('terms')}
        onOpenPrivacy={() => openTermsModal('privacy')}
        onNavigateToRegister={navigateToRegister}
        onOpenLogin={() => setLoginModalOpen(true)}
      />

      {/* Modals */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onNavigateToRegister={navigateToRegister}
        onLoginSuccess={handleLoginSuccess}
      />

      <TermsModal
        isOpen={termsModal.isOpen}
        type={termsModal.type}
        onClose={() => setTermsModal({ ...termsModal, isOpen: false })}
      />

    </div>
  );
}
