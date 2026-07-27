import React, { useState } from 'react';
import { 
  ArrowRight, Sparkles, Play, TrendingUp, 
  FileCheck2, DollarSign, ShoppingBag, Bot, RefreshCw, BarChart2
} from 'lucide-react';

interface HeroProps {
  onNavigateToRegister: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigateToRegister }) => {
  const [activeTab, setActiveTab] = useState<'visão' | 'pedidos' | 'notas' | 'ia'>('visão');
  const [timeframe, setTimeframe] = useState<'Hoje' | '7 dias' | '30 dias'>('Hoje');

  return (
    <section className="relative pt-8 pb-16 md:pt-12 md:pb-20 overflow-hidden bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Text Column */}
          <div className="space-y-5 text-left">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-blue-50/80 border border-blue-100 text-[#0A4EE4] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-xs">
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
                <span>Começar agora</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#agentes-ia"
                className="border-2 border-slate-200 text-slate-700 px-8 py-4 rounded-xl font-bold hover:bg-slate-50 transition-colors text-center"
              >
                Conhecer plataforma
              </a>
            </div>
          </div>

          {/* Right Visual / Interactive Mockup Column */}
          <div className="relative mt-2 lg:mt-0">
            <div className="bg-white rounded-2xl shadow-xl sm:shadow-2xl border border-slate-100 overflow-hidden transform lg:rotate-1 hover:rotate-0 transition-transform duration-300">
              {/* Top Browser Bar */}
              <div className="bg-slate-50 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                </div>

                {/* Mockup Tabs */}
                <div className="flex bg-slate-200/60 p-0.5 rounded-lg text-[10px] sm:text-[11px] font-semibold text-slate-600 overflow-x-auto whitespace-nowrap scrollbar-none">
                  <button
                    onClick={() => setActiveTab('visão')}
                    className={`px-2 sm:px-2.5 py-1 rounded-md transition-colors ${
                      activeTab === 'visão' ? 'bg-[#0A4EE4] text-white shadow-xs' : 'hover:text-slate-900'
                    }`}
                  >
                    Visão Geral
                  </button>
                  <button
                    onClick={() => setActiveTab('pedidos')}
                    className={`px-2 sm:px-2.5 py-1 rounded-md transition-colors ${
                      activeTab === 'pedidos' ? 'bg-[#0A4EE4] text-white shadow-xs' : 'hover:text-slate-900'
                    }`}
                  >
                    Pedidos
                  </button>
                  <button
                    onClick={() => setActiveTab('ia')}
                    className={`px-2 sm:px-2.5 py-1 rounded-md transition-colors ${
                      activeTab === 'ia' ? 'bg-[#0A4EE4] text-white shadow-xs' : 'hover:text-slate-900'
                    }`}
                  >
                    Agente IA
                  </button>
                </div>
              </div>

              {/* Dashboard Content inside Sleek Mockup */}
              <div className="p-4 sm:p-6 space-y-3.5 sm:space-y-4">
                <div className="flex justify-between items-center gap-2">
                  <div>
                    <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">Painel Operacional Opera</h3>
                    <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">Multicanal • Mercado Livre, Shopee & PDV</p>
                  </div>
                  <div className="text-[10px] sm:text-xs font-bold text-[#0A4EE4] bg-blue-50 px-2.5 sm:px-3 py-1 rounded-full shrink-0">
                    30 canais
                  </div>
                </div>

                {/* Stat Grid */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <div className="p-2 sm:p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-[9px] sm:text-[10px] text-slate-500 font-bold uppercase block">Faturamento</span>
                    <span className="text-xs sm:text-base font-extrabold text-slate-900 font-mono">R$ 18.450</span>
                  </div>
                  <div className="p-2 sm:p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-[9px] sm:text-[10px] text-slate-500 font-bold uppercase block">Pedidos</span>
                    <span className="text-xs sm:text-base font-extrabold text-slate-900 font-mono">184 ped.</span>
                  </div>
                  <div className="p-2 sm:p-3 bg-[#0A4EE4]/5 rounded-lg border border-[#0A4EE4]/20">
                    <span className="text-[9px] sm:text-[10px] text-[#0A4EE4] font-bold uppercase block">Sefaz NFe</span>
                    <span className="text-xs sm:text-base font-extrabold text-[#0A4EE4] font-mono">100% OK</span>
                  </div>
                </div>

                {/* Graph Representation */}
                <div className="p-3 sm:p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex justify-between items-center text-[11px] sm:text-xs mb-2">
                    <span className="font-bold text-slate-700">Ritmo de Vendas Hoje</span>
                    <span className="text-emerald-600 font-bold">+24.8% vs ontem</span>
                  </div>
                  <div className="h-16 sm:h-20 flex items-end gap-1 sm:gap-1.5 pt-2">
                    {[35, 50, 70, 45, 80, 100, 75, 110, 130, 120, 140, 160].map((val, idx) => (
                      <div 
                        key={idx} 
                        className="flex-1 bg-[#0A4EE4] rounded-t hover:bg-blue-700 transition-colors" 
                        style={{ height: `${(val / 160) * 100}%` }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Sales Badge */}
            <div className="absolute -bottom-4 sm:-bottom-6 right-2 sm:-left-6 bg-white p-3 sm:p-4 rounded-xl shadow-xl border border-slate-100 animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="p-2 sm:p-2.5 bg-emerald-100 text-emerald-600 rounded-lg shrink-0">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <div className="text-[9px] sm:text-[10px] text-slate-500 font-bold uppercase">Vendas hoje</div>
                  <div className="text-sm sm:text-lg font-bold text-slate-900 leading-none">R$ 12.450,00</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
