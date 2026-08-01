import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { PortfolioSection } from './components/PortfolioSection';
import { AboutSection } from './components/AboutSection';
import { CtaBanner } from './components/CtaBanner';
import { Footer } from './components/Footer';
import { RegistrationPage } from './components/RegistrationPage';
import { LoginModal } from './components/LoginModal';
import { TermsModal } from './components/TermsModal';
import { QuoteModal } from './components/QuoteModal';
import { AdminPanel } from './components/AdminPanel';
import { MessageSquare } from 'lucide-react';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<'home' | 'register' | 'admin'>('home');
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteDefaultService, setQuoteDefaultService] = useState('Criação de Site Profissional');

  const [termsModal, setTermsModal] = useState<{ isOpen: boolean; type: 'terms' | 'privacy' }>({
    isOpen: false,
    type: 'terms'
  });

  const handleOpenQuoteModal = (serviceName?: string) => {
    if (serviceName) {
      setQuoteDefaultService(serviceName);
    }
    setQuoteModalOpen(true);
  };

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
      <div className="min-h-screen bg-slate-950 text-slate-100">
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
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 selection:bg-blue-600/30 selection:text-blue-300">
      
      {/* Sticky Header */}
      <Header
        onNavigateToRegister={navigateToRegister}
        onOpenLogin={() => setLoginModalOpen(true)}
        currentRoute={currentRoute}
        onNavigateHome={navigateToHome}
        onOpenQuoteModal={handleOpenQuoteModal}
      />

      {/* Main Page Sections */}
      <main>
        {/* 1. Hero Section */}
        <Hero 
          onNavigateToRegister={navigateToRegister} 
          onOpenQuoteModal={handleOpenQuoteModal}
        />

        {/* 2. Serviços Section (Criação de Sites e Estruturação WhatsApp Web) */}
        <ServicesSection 
          onNavigateToRegister={navigateToRegister} 
          onOpenQuoteModal={handleOpenQuoteModal}
        />

        {/* 3. Trabalhos Realizados & Portfólio */}
        <PortfolioSection />

        {/* 5. Sobre Section */}
        <AboutSection />

        {/* 7. Final Blue CTA Banner */}
        <CtaBanner 
          onNavigateToRegister={navigateToRegister} 
          onOpenQuoteModal={handleOpenQuoteModal}
        />
      </main>

      {/* Footer */}
      <Footer
        onOpenTerms={() => openTermsModal('terms')}
        onOpenPrivacy={() => openTermsModal('privacy')}
        onNavigateToRegister={navigateToRegister}
        onOpenLogin={() => setLoginModalOpen(true)}
      />

      {/* Modals */}
      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        defaultService={quoteDefaultService}
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

      {/* Floating WhatsApp Action Button */}
      <button
        onClick={() => handleOpenQuoteModal()}
        className="fixed bottom-6 right-6 z-40 bg-emerald-600 hover:bg-emerald-500 text-white p-3.5 sm:px-5 sm:py-3 rounded-full shadow-2xl flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 border border-emerald-400/30 group"
        title="Enviar Orçamento via WhatsApp"
        aria-label="Orçamento via WhatsApp"
      >
        <div className="relative">
          <MessageSquare className="w-6 h-6 fill-current stroke-none" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-300 rounded-full animate-ping" />
        </div>
        <span className="hidden sm:inline font-extrabold text-xs tracking-tight">
          Orçamento no WhatsApp
        </span>
      </button>

    </div>
  );
}
