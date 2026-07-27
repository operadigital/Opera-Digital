import React, { useState } from 'react';
import { 
  ArrowRight, Sparkles, Globe, MessageSquare, 
  Bot, CheckCircle2, Zap, ShieldCheck
} from 'lucide-react';

interface HeroProps {
  onNavigateToRegister: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigateToRegister }) => {
  const [activeTab, setActiveTab] = useState<'sites' | 'whatsapp'>('sites');

  return (
    <section className="relative pt-8 pb-16 md:pt-12 md:pb-20 overflow-hidden bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Text Column */}
          <div className="space-y-5 text-left">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-blue-50/80 border border-blue-100 text-[#0A4EE4] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#0A4EE4]" />
                <span>Transformação Digital & Vendas Multicanal</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[46px] xl:text-5xl font-black text-slate-900 leading-[1.15] tracking-tight">
                Prepare sua loja física para o <span className="bg-gradient-to-r from-[#0A4EE4] to-blue-700 bg-clip-text text-transparent">mundo digital</span>
              </h1>

              <div className="flex items-center gap-2.5 pt-1">
                <div className="w-1.5 h-6 sm:h-7 bg-[#0A4EE4] rounded-full shrink-0"></div>
                <p className="text-lg sm:text-2xl font-extrabold text-slate-800 tracking-tight">
                  Venda onde seus clientes já compram.
                </p>
              </div>
            </div>

            <p className="text-base sm:text-lg text-slate-600 max-w-lg leading-relaxed pt-1">
              Unifique seu balcão presencial, e-commerce, emissão de NFe e os maiores marketplaces do Brasil em uma única plataforma automatizada com IA.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={onNavigateToRegister}
                className="bg-[#0A4EE4] text-white px-8 py-4 rounded-xl font-bold shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Solicitar orçamento</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#servicos"
                className="border-2 border-slate-200 text-slate-700 px-8 py-4 rounded-xl font-bold hover:bg-slate-50 transition-colors text-center"
              >
                Ver nossas soluções
              </a>
            </div>
          </div>

          {/* Right Interactive Mockup Column */}
          <div className="relative mt-2 lg:mt-0">
            <div className="bg-white rounded-2xl shadow-xl sm:shadow-2xl border border-slate-100 overflow-hidden transform lg:rotate-1 hover:rotate-0 transition-transform duration-300">
              {/* Top Browser Bar */}
              <div className="bg-slate-50 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                </div>

                {/* Mockup Service Selector */}
                <div className="flex bg-slate-200/60 p-0.5 rounded-lg text-[10px] sm:text-[11px] font-semibold text-slate-600">
                  <button
                    onClick={() => setActiveTab('sites')}
                    className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                      activeTab === 'sites' ? 'bg-[#0A4EE4] text-white shadow-2xs font-bold' : 'hover:text-slate-900'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Criação de Sites</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('whatsapp')}
                    className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                      activeTab === 'whatsapp' ? 'bg-emerald-600 text-white shadow-2xs font-bold' : 'hover:text-slate-900'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp Web</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Content inside Sleek Mockup */}
              <div className="p-4 sm:p-6 space-y-4">
                {activeTab === 'sites' ? (
                  <div className="space-y-3.5">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                      <div>
                        <span className="text-[10px] font-bold text-[#0A4EE4] bg-blue-50 px-2 py-0.5 rounded">
                          https://seunegocio.com.br
                        </span>
                        <h3 className="text-sm font-black text-slate-900 mt-1">Website Profissional Responsivo</h3>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        SEO Google OK
                      </span>
                    </div>

                    <div className="bg-slate-900 text-white p-4 rounded-xl space-y-2">
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
                      <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 font-semibold text-slate-700 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#0A4EE4]" />
                        <span>Carregamento Veloz</span>
                      </div>
                      <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 font-semibold text-slate-700 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#0A4EE4]" />
                        <span>Domínio Próprio</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        <h3 className="text-sm font-black text-slate-900">Atendimento WhatsApp Web</h3>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        Bot + IA Ativo
                      </span>
                    </div>

                    <div className="bg-emerald-950 text-white p-4 rounded-xl space-y-2 font-sans text-xs">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                        <Bot className="w-4 h-4" />
                        <span>Agente Inteligente Opera</span>
                      </div>
                      <p className="text-emerald-100 text-xs">
                        "Olá! Recebi seu contato pelo site. Como posso ajudar com seu orçamento hoje?"
                      </p>
                      <div className="bg-emerald-800/60 p-2 rounded-lg text-[11px] text-emerald-200 border border-emerald-700/60">
                        ✓ Resposta imediata • Agilidade na qualificação de clientes
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 font-semibold text-slate-700 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-emerald-600" />
                        <span>Respostas 24/7</span>
                      </div>
                      <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 font-semibold text-slate-700 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Multi-Atendentes</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-4 sm:-bottom-6 right-2 sm:-left-6 bg-white p-3 sm:p-4 rounded-xl shadow-xl border border-slate-100 animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="p-2 sm:p-2.5 bg-blue-100 text-[#0A4EE4] rounded-lg shrink-0">
                  <Globe className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <div className="text-[9px] sm:text-[10px] text-slate-500 font-bold uppercase">Aceleração Digital</div>
                  <div className="text-xs sm:text-sm font-extrabold text-slate-900 leading-none">Sites & WhatsApp Web</div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
