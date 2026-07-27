import React from 'react';
import { 
  Instagram, Linkedin, Youtube, Facebook, ShieldCheck, 
  Heart, ArrowUpRight, Lock, CheckCircle2
} from 'lucide-react';

interface FooterProps {
  onOpenTerms: () => void;
  onOpenPrivacy: () => void;
  onNavigateToRegister: () => void;
  onOpenLogin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  onOpenTerms, 
  onOpenPrivacy,
  onNavigateToRegister,
  onOpenLogin
}) => {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4 Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Column 1: Branding (2 cols span) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <img 
                src="https://i.ibb.co/SX9x8b4k/d943fc28-7ed1-4e07-a215-5630a4dea11d.jpg" 
                alt="Opera Digital Logo" 
                className="h-8 w-auto object-contain rounded-lg bg-white p-0.5"
                referrerPolicy="no-referrer"
              />
              <span className="font-extrabold text-xl text-white tracking-tight">
                Opera<span className="text-[#0A4EE4]">Digital</span>
              </span>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Criação de Sites Profissionais, Landing Pages de alta conversão e Estruturação do WhatsApp Web com Atendimento Automático e Inteligência Artificial.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-[#0A4EE4] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-[#0A4EE4] transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-[#0A4EE4] transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-[#0A4EE4] transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>

            <div className="pt-1 flex items-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Conexão criptografada SSL 256-bits • Atendimento Garantido</span>
            </div>
          </div>

          {/* Column 2: Serviços */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider">
              Serviços
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#criacao-de-sites" className="hover:text-white transition-colors">Criação de Sites Profissionais</a></li>
              <li><a href="#estruturacao-whatsapp" className="hover:text-white transition-colors">Estruturação do WhatsApp Web</a></li>
              <li><a href="#criacao-de-sites" className="hover:text-white transition-colors">Landing Pages de Alta Conversão</a></li>
              <li><a href="#estruturacao-whatsapp" className="hover:text-white transition-colors">Robôs & Agentes virtuais de IA</a></li>
              <li><a href="#trabalhos" className="hover:text-white transition-colors">Trabalhos Realizados</a></li>
              <li><a href="#agentes-ia" className="hover:text-white transition-colors font-medium text-blue-400">Simulador de Agente IA</a></li>
            </ul>
          </div>

          {/* Column 3: Empresa */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider">
              Empresa
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#sobre" className="hover:text-white transition-colors">Sobre a Opera Digital</a></li>
              <li><a href="#trabalhos" className="hover:text-white transition-colors">Histórias de Sucesso</a></li>
              <li><a href="#sobre" className="hover:text-white transition-colors">Trabalhe Conosco</a></li>
              <li><a href="#sobre" className="hover:text-white transition-colors">Parceiros & Contadores</a></li>
            </ul>
          </div>

          {/* Column 4: Suporte & Ajuda */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider">
              Suporte
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#sobre" className="hover:text-white transition-colors">Central de Ajuda</a></li>
              <li><a href="#sobre" className="hover:text-white transition-colors">Status do Sistema</a></li>
              <li><a href="#sobre" className="hover:text-white transition-colors">Suporte via WhatsApp</a></li>
              <li><a href="#sobre" className="hover:text-white transition-colors">Documentação de API</a></li>
              <li>
                <button onClick={onOpenTerms} className="hover:text-white text-left transition-colors">
                  Termos de Uso
                </button>
              </li>
              <li>
                <button onClick={onOpenPrivacy} className="hover:text-white text-left transition-colors">
                  Política de Privacidade
                </button>
              </li>
              {onOpenLogin && (
                <li>
                  <button onClick={onOpenLogin} className="hover:text-[#0A4EE4] text-left transition-colors text-slate-500 font-medium">
                    Área Restrita (Admin)
                  </button>
                </li>
              )}
            </ul>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} Opera Digital Tecnologia S.A. Todos os direitos reservados. CNPJ 28.490.112/0001-89
          </div>

          <div className="flex items-center gap-4">
            <button onClick={onOpenTerms} className="hover:text-slate-300">
              Termos de Uso
            </button>
            <span>•</span>
            <button onClick={onOpenPrivacy} className="hover:text-slate-300">
              Política de Privacidade
            </button>
            <span>•</span>
            <span className="text-slate-400">Feito com paixão para o Brasil 🇧🇷</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
