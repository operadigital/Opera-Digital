import React, { useState } from 'react';
import { 
  ArrowRight, Sparkles, Globe, MessageSquare, 
  Bot, CheckCircle2, Zap, ShieldCheck
} from 'lucide-react';
import { getStoredWhatsAppNumber } from '../utils/whatsapp';

interface HeroProps {
  onNavigateToRegister: () => void;
  onOpenQuoteModal?: (serviceName?: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigateToRegister, onOpenQuoteModal }) => {
  const [activeTab, setActiveTab] = useState<'sites' | 'whatsapp'>('sites');

  return (
    <section className="relative pt-8 pb-16 md:pt-14 md:pb-24 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-black text-slate-100">
      {/* Background Radial Glowing Elements (Preto e Azul) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/20 via-blue-950/10 to-transparent pointer-events-none" />
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-blue-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Text Column */}
          <div className="space-y-6 text-left">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-blue-950/80 border border-blue-800/60 text-blue-400 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Transformação Digital & Vendas Multicanal</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-[52px] xl:text-6xl font-black text-white leading-[1.12] tracking-tight">
                Sua empresa pronta para o <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">próximo passo.</span>
              </h1>

              <div className="flex items-center gap-2.5 pt-1">
                <div className="w-1.5 h-6 sm:h-7 bg-[#0A4EE4] rounded-full shrink-0"></div>
                <p className="text-lg sm:text-2xl font-extrabold text-blue-200 tracking-tight">
                  Estratégia clara, execução próxima e conhecimento prático.
                </p>
              </div>
            </div>

            <p className="text-base sm:text-xl text-slate-300 max-w-xl leading-relaxed pt-1 font-medium">
              Ajudamos empresas e profissionais a crescer com estratégia clara, execução próxima e conhecimento prático.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-3">
              <a
                href={`https://wa.me/${getStoredWhatsAppNumber()}?text=${encodeURIComponent('Olá! Gostaria de solicitar um orçamento com a Opera Digital.')}`}
                target="_blank"
                rel="noreferrer"
                className="bg-[#0A4EE4] text-white px-8 py-4 rounded-xl font-bold shadow-xl shadow-blue-900/50 hover:bg-blue-600 transition-all flex items-center justify-center gap-2 group min-h-[48px]"
              >
                <span>Solicitar orçamento</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="#servicos"
                className="border-2 border-slate-800 bg-slate-900/60 text-slate-300 px-8 py-4 rounded-xl font-bold hover:bg-slate-800 hover:text-white hover:border-slate-700 transition-colors text-center min-h-[48px] flex items-center justify-center"
              >
                Ver nossas soluções
              </a>
            </div>
          </div>

          {/* Right Interactive Mockup Column */}
          <div className="relative mt-2 lg:mt-0">
            <div className="bg-slate-900/90 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden transform lg:rotate-1 hover:rotate-0 transition-transform duration-300">
              {/* Top Browser Bar */}
              <div className="bg-slate-950 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-slate-800 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
                </div>

                {/* Mockup Service Selector */}
                <div className="flex bg-slate-900 p-0.5 rounded-lg text-[10px] sm:text-[11px] font-semibold text-slate-400 border border-slate-800 shrink-0">
                  <button
                    onClick={() => setActiveTab('sites')}
                    className={`px-2.5 sm:px-3 py-1 rounded-md transition-all flex items-center gap-1 sm:gap-1.5 whitespace-nowrap ${
                      activeTab === 'sites' ? 'bg-[#0A4EE4] text-white shadow-xs font-bold' : 'hover:text-white'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5 shrink-0" />
                    <span>Criação de Sites</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('whatsapp')}
                    className={`px-2.5 sm:px-3 py-1 rounded-md transition-all flex items-center gap-1 sm:gap-1.5 whitespace-nowrap ${
                      activeTab === 'whatsapp' ? 'bg-emerald-600 text-white shadow-xs font-bold' : 'hover:text-white'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                    <span>WhatsApp Web</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Content inside Sleek Dark Mockup */}
              <div className="p-4 sm:p-6 space-y-4 bg-slate-950">
                {activeTab === 'sites' ? (
                  <div className="space-y-3.5">
                    <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
                      <div>
                        <span className="text-[10px] font-bold text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/50">
                          https://seunegocio.com.br
                        </span>
                        <h3 className="text-sm font-black text-white mt-1">Website Profissional Responsivo</h3>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/50">
                        SEO Google OK
                      </span>
                    </div>

                    <div className="bg-gradient-to-r from-blue-950/80 via-slate-900 to-slate-950 text-white p-4 rounded-xl space-y-2 border border-blue-900/40">
                      <div className="text-xs font-bold text-blue-400 uppercase tracking-wider">Alta Conversão & Design Exclusivo</div>
                      <p className="text-xs text-slate-300">
                        Layout moderno, navegação fluida em dispositivos móveis e integração imediata para os clientes chamarem no WhatsApp.
                      </p>
                      <div className="pt-2 flex items-center gap-2">
                        <span className="text-[10px] bg-[#0A4EE4] text-white px-2.5 py-1 rounded-md font-bold">
                          Ver Demonstração
                        </span>
                        <span className="text-[10px] text-slate-400">100% Personalizado</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 font-semibold text-slate-300 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-400" />
                        <span>Carregamento Veloz</span>
                      </div>
                      <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 font-semibold text-slate-300 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-400" />
                        <span>Domínio Próprio</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        <h3 className="text-sm font-black text-white">Atendimento WhatsApp Web</h3>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/50">
                        Bot + IA Ativo
                      </span>
                    </div>

                    <div className="bg-emerald-950/80 text-white p-4 rounded-xl space-y-2 font-sans text-xs border border-emerald-800/60">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                        <Bot className="w-4 h-4" />
                        <span>Agente Inteligente Opera</span>
                      </div>
                      <p className="text-emerald-100 text-xs">
                        "Olá! Recebi seu contato pelo site. Como posso ajudar com seu orçamento hoje?"
                      </p>
                      <div className="bg-emerald-900/60 p-2 rounded-lg text-[11px] text-emerald-200 border border-emerald-700/60">
                        ✓ Resposta imediata • Agilidade na qualificação de clientes
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 font-semibold text-slate-300 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-emerald-400" />
                        <span>Respostas 24/7</span>
                      </div>
                      <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 font-semibold text-slate-300 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>Multi-Atendentes</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-4 sm:-bottom-6 right-2 sm:-left-6 bg-slate-900/90 backdrop-blur-md p-3 sm:p-4 rounded-xl shadow-2xl border border-slate-800 animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="p-2 sm:p-2.5 bg-blue-950 text-blue-400 rounded-lg shrink-0 border border-blue-800/50">
                  <Globe className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <div className="text-[9px] sm:text-[10px] text-blue-400 font-bold uppercase tracking-wider">Aceleração Digital</div>
                  <div className="text-xs sm:text-sm font-extrabold text-white leading-none">Sites & WhatsApp Web</div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
