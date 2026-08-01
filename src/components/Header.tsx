import React, { useState, useEffect } from 'react';
import { 
  Menu, X, ChevronDown, Globe, MessageSquare, 
  ArrowRight, Sparkles, ShieldCheck
} from 'lucide-react';
import { SERVICES_LIST } from '../data/mockData';
import { getStoredWhatsAppNumber } from '../utils/whatsapp';

interface HeaderProps {
  onNavigateToRegister: () => void;
  onOpenLogin: () => void;
  currentRoute: 'home' | 'register';
  onNavigateHome: () => void;
  onOpenQuoteModal?: (serviceName?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigateToRegister,
  onOpenLogin,
  currentRoute,
  onNavigateHome,
  onOpenQuoteModal
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesMenuOpen, setServicesMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-slate-950/90 backdrop-blur-md shadow-xl border-b border-slate-800/80 py-3' 
          : 'bg-slate-950/80 backdrop-blur-md border-b border-slate-800/60 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <button 
            onClick={onNavigateHome}
            className="flex items-center gap-2.5 group text-left focus:outline-none"
          >
            <img 
              src="https://i.ibb.co/SX9x8b4k/d943fc28-7ed1-4e07-a215-5630a4dea11d.jpg" 
              alt="Opera Digital Logo" 
              className="h-8 w-auto object-contain rounded-lg bg-white p-0.5 shadow-xs"
              referrerPolicy="no-referrer"
            />
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-blue-400 transition-colors">
                Opera <span className="text-blue-500">Digital</span>
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            {/* Services Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setServicesMenuOpen(true)}
              onMouseLeave={() => setServicesMenuOpen(false)}
            >
              <button 
                className="flex items-center gap-1 font-semibold text-blue-400 hover:text-blue-300 transition-colors py-2"
                onClick={() => setServicesMenuOpen(!servicesMenuOpen)}
              >
                <span>Serviços & Soluções</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${servicesMenuOpen ? 'rotate-180 text-blue-400' : 'text-blue-400'}`} />
              </button>

              {/* Menu Container */}
              {servicesMenuOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[520px] bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 p-4 grid grid-cols-1 gap-3 mt-1 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  <a
                    href="#criacao-de-sites"
                    onClick={() => setServicesMenuOpen(false)}
                    className="flex items-start gap-3.5 p-3.5 rounded-xl hover:bg-slate-800/80 transition-colors group border border-transparent hover:border-slate-700/80"
                  >
                    <div className="p-2.5 rounded-xl bg-blue-950/80 text-blue-400 group-hover:bg-[#0A4EE4] group-hover:text-white transition-colors shrink-0 border border-blue-800/50">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white group-hover:text-blue-400 transition-colors text-sm">
                        Criação de Sites Profissionais
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                        Websites modernos, Landing Pages de alta conversão e portais responsivos.
                      </p>
                    </div>
                  </a>

                  <a
                    href="#estruturacao-whatsapp"
                    onClick={() => setServicesMenuOpen(false)}
                    className="flex items-start gap-3.5 p-3.5 rounded-xl hover:bg-slate-800/80 transition-colors group border border-transparent hover:border-slate-700/80"
                  >
                    <div className="p-2.5 rounded-xl bg-emerald-950/80 text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0 border border-emerald-800/50">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white group-hover:text-emerald-400 transition-colors text-sm">
                        Estruturação do WhatsApp Web
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                        Atendimento automatizado, Agentes de IA e funis de vendas inteligentes no chat.
                      </p>
                    </div>
                  </a>
                </div>
              )}
            </div>

            <a 
              href="#trabalhos" 
              className="hover:text-blue-400 transition-colors font-semibold"
            >
              Trabalhos Realizados
            </a>

            <a 
              href="#agentes-ia" 
              className="hover:text-blue-400 transition-colors flex items-center gap-1.5 font-semibold"
            >
              <span>Agentes de IA</span>
              <span className="bg-blue-950/80 text-blue-400 border border-blue-800/60 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                BETA
              </span>
            </a>

            <a 
              href="#sobre" 
              className="hover:text-blue-400 transition-colors font-semibold"
            >
              Sobre a Opera
            </a>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href={`https://wa.me/${getStoredWhatsAppNumber()}?text=${encodeURIComponent('Olá! Gostaria de solicitar um orçamento com a Opera Digital.')}`}
              target="_blank"
              rel="noreferrer"
              className="bg-[#0A4EE4] hover:bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-blue-900/40 transition-all duration-200 flex items-center gap-1.5"
            >
              <span>Solicitar Orçamento</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl text-slate-200 hover:bg-slate-800 active:bg-slate-700 focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Abrir menu de navegação"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer & Backdrop */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-xs md:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Menu */}
          <div className="relative z-50 md:hidden bg-slate-950 border-b border-slate-800 px-4 pt-3 pb-6 space-y-4 shadow-2xl animate-in slide-in-from-top duration-200 max-h-[85vh] overflow-y-auto text-slate-100">
            <div className="space-y-1">
              <div className="text-xs uppercase font-extrabold tracking-wider text-slate-400 px-3 py-1">
                Serviços Principais
              </div>
              
              <div className="space-y-1 bg-slate-900 p-2.5 rounded-2xl border border-slate-800 my-2">
                <a
                  href="#criacao-de-sites"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 text-sm font-semibold text-slate-200 hover:text-blue-400 active:bg-slate-800 rounded-xl transition-colors"
                >
                  <div className="p-2 rounded-lg bg-blue-950 text-blue-400 border border-blue-800/50">
                    <Globe className="w-4 h-4" />
                  </div>
                  <span>Criação de Sites Profissionais</span>
                </a>

                <a
                  href="#estruturacao-whatsapp"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 text-sm font-semibold text-slate-200 hover:text-emerald-400 active:bg-slate-800 rounded-xl transition-colors"
                >
                  <div className="p-2 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <span>Estruturação do WhatsApp Web</span>
                </a>
              </div>

              <a
                href="#trabalhos"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-3 text-base font-semibold text-slate-200 hover:bg-slate-900 active:bg-slate-800 rounded-xl transition-colors"
              >
                Trabalhos Realizados
              </a>
              <a
                href="#agentes-ia"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-3 text-base font-semibold text-slate-200 hover:bg-slate-900 active:bg-slate-800 rounded-xl transition-colors"
              >
                <span>Agentes de IA</span>
                <span className="bg-blue-950 text-blue-400 text-xs font-bold px-2.5 py-0.5 rounded-full border border-blue-800/50">
                  BETA
                </span>
              </a>
              <a
                href="#sobre"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-3 text-base font-semibold text-slate-200 hover:bg-slate-900 active:bg-slate-800 rounded-xl transition-colors"
              >
                Sobre a Opera Digital
              </a>
            </div>

            <div className="pt-3 border-t border-slate-800">
              <a
                href={`https://wa.me/${getStoredWhatsAppNumber()}?text=${encodeURIComponent('Olá! Gostaria de solicitar um orçamento com a Opera Digital.')}`}
                target="_blank"
                rel="noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full h-12 text-center font-bold text-white bg-[#0A4EE4] hover:bg-blue-600 rounded-xl text-sm shadow-lg shadow-blue-950 transition-colors flex items-center justify-center gap-2"
              >
                <span>Solicitar Orçamento</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

