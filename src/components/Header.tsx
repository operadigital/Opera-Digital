import React, { useState, useEffect } from 'react';
import { 
  Menu, X, ChevronDown, Layers, FileText, Store, Wallet, Truck, 
  ArrowRight, Sparkles, Shield, User, LogIn, Check
} from 'lucide-react';
import { PRODUCTS_LIST } from '../data/mockData';

interface HeaderProps {
  onNavigateToRegister: () => void;
  onOpenLogin: () => void;
  currentRoute: 'home' | 'register';
  onNavigateHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigateToRegister,
  onOpenLogin,
  currentRoute,
  onNavigateHome
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsMenuOpen, setProductsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getProductIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileText': return <FileText className="w-5 h-5 text-[#0A4EE4]" />;
      case 'Layers': return <Layers className="w-5 h-5 text-[#0A4EE4]" />;
      case 'Store': return <Store className="w-5 h-5 text-[#0A4EE4]" />;
      case 'Wallet': return <Wallet className="w-5 h-5 text-[#0A4EE4]" />;
      case 'Truck': return <Truck className="w-5 h-5 text-[#0A4EE4]" />;
      default: return <Sparkles className="w-5 h-5 text-[#0A4EE4]" />;
    }
  };

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200 py-3' 
          : 'bg-white/90 backdrop-blur-md border-b border-slate-100 py-3.5'
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
              className="h-8 w-auto object-contain rounded-lg shadow-xs"
              referrerPolicy="no-referrer"
            />
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-[#0A4EE4] transition-colors">
                Opera <span className="text-[#0A4EE4]">Digital</span>
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            {/* Products Mega Menu Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setProductsMenuOpen(true)}
              onMouseLeave={() => setProductsMenuOpen(false)}
            >
              <button 
                className="flex items-center gap-1 font-semibold text-[#0A4EE4] hover:text-blue-700 transition-colors py-2"
                onClick={() => setProductsMenuOpen(!productsMenuOpen)}
              >
                <span>Produtos</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${productsMenuOpen ? 'rotate-180 text-[#0A4EE4]' : 'text-[#0A4EE4]'}`} />
              </button>

              {/* Mega Menu Container */}
              {productsMenuOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[720px] bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 grid grid-cols-2 gap-4 mt-1 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  <div className="col-span-2 pb-2 mb-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider font-bold text-slate-400">
                      Ecossistema de Soluções Opera
                    </span>
                    <span className="text-xs text-[#0A4EE4] font-bold bg-blue-50 px-2.5 py-0.5 rounded-full">
                      Tudo Integrado
                    </span>
                  </div>

                  {PRODUCTS_LIST.map((prod) => (
                    <a
                      key={prod.id}
                      href={`#produto-${prod.id}`}
                      onClick={() => setProductsMenuOpen(false)}
                      className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-slate-50 transition-colors group border border-transparent hover:border-slate-100"
                    >
                      <div className="p-2.5 rounded-xl bg-blue-50 group-hover:bg-[#0A4EE4] group-hover:text-white transition-colors shrink-0">
                        {getProductIcon(prod.iconName)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-slate-900 group-hover:text-[#0A4EE4] transition-colors text-sm">
                            {prod.title}
                          </h4>
                          {prod.badge && (
                            <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                              {prod.category}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">
                          {prod.shortDesc}
                        </p>
                      </div>
                    </a>
                  ))}

                  <div className="col-span-2 mt-2 pt-3 border-t border-slate-100 bg-slate-50 -mx-6 -mb-6 p-4 rounded-b-2xl flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Shield className="w-4 h-4 text-[#0A4EE4]" />
                      <span>Todos os módulos integrados em uma só plataforma</span>
                    </div>
                    <a 
                      href="#agentes-ia"
                      onClick={() => setProductsMenuOpen(false)}
                      className="text-xs font-bold text-[#0A4EE4] hover:underline flex items-center gap-1"
                    >
                      Conhecer Agentes de IA <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}
            </div>

            <a 
              href="#trabalhos" 
              className="hover:text-[#0A4EE4] transition-colors font-semibold"
            >
              Trabalhos Realizados
            </a>

            <a 
              href="#agentes-ia" 
              className="hover:text-[#0A4EE4] transition-colors flex items-center gap-1.5"
            >
              <span>Agentes de IA</span>
              <span className="bg-blue-50 text-[#0A4EE4] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                BETA
              </span>
            </a>

            <a 
              href="#sobre" 
              className="hover:text-[#0A4EE4] transition-colors"
            >
              Sobre
            </a>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={onNavigateToRegister}
              className="bg-[#0A4EE4] text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all duration-200 flex items-center gap-1.5"
            >
              <span>Começar agora</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 active:bg-slate-200 focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center"
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
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Menu */}
          <div className="relative z-50 md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-4 shadow-xl animate-in slide-in-from-top duration-200 max-h-[85vh] overflow-y-auto">
            <div className="space-y-1">
              <div className="text-xs uppercase font-extrabold tracking-wider text-slate-400 px-3 py-1">
                Navegação Principal
              </div>
              
              {/* Products Accordion for Mobile */}
              <div className="space-y-1 bg-slate-50 p-3 rounded-2xl border border-slate-100 my-2">
                <div className="flex items-center justify-between px-2 mb-2">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Produtos
                  </span>
                  <span className="text-[10px] text-[#0A4EE4] font-bold bg-blue-50 px-2 py-0.5 rounded-full">
                    Módulos ERP
                  </span>
                </div>
                {PRODUCTS_LIST.map((prod) => (
                  <a
                    key={prod.id}
                    href={`#produto-${prod.id}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-2.5 text-sm font-semibold text-slate-700 hover:text-[#0A4EE4] active:bg-blue-50 rounded-xl transition-colors min-h-[44px]"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-blue-50 text-[#0A4EE4]">
                        {getProductIcon(prod.iconName)}
                      </div>
                      <span>{prod.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-normal">
                      {prod.category}
                    </span>
                  </a>
                ))}
              </div>

              <a
                href="#trabalhos"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-3 text-base font-semibold text-slate-800 hover:bg-slate-50 active:bg-slate-100 rounded-xl transition-colors min-h-[44px]"
              >
                Trabalhos Realizados
              </a>
              <a
                href="#agentes-ia"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-3 text-base font-semibold text-slate-800 hover:bg-slate-50 active:bg-slate-100 rounded-xl transition-colors min-h-[44px]"
              >
                <span>Agentes de IA</span>
                <span className="bg-blue-50 text-[#0A4EE4] text-xs font-bold px-2.5 py-0.5 rounded-full">
                  BETA
                </span>
              </a>
              <a
                href="#sobre"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-3 text-base font-semibold text-slate-800 hover:bg-slate-50 active:bg-slate-100 rounded-xl transition-colors min-h-[44px]"
              >
                Sobre a Opera Digital
              </a>
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigateToRegister();
                }}
                className="w-full h-12 text-center font-bold text-white bg-[#0A4EE4] hover:bg-blue-700 active:bg-blue-800 rounded-xl text-sm shadow-md shadow-blue-200 transition-colors flex items-center justify-center gap-2"
              >
                <span>Criar minha conta</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </header>
  );
};
