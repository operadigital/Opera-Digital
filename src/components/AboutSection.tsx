import React from 'react';
import { ShieldCheck, Heart, Users, Target, Building2, Award } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="sobre" className="py-20 bg-white text-slate-900 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0A4EE4] bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
              Sobre a Opera Digital
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
              Desenvolvido por quem entende a realidade do <span className="text-[#0A4EE4]">empreendedor brasileiro</span>
            </h2>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              Nascemos com a missão clara de descomplicar a burocracia e as barreiras tecnológicas no Brasil. 
              Sabemos que gerenciar estoques, emitir notas fiscais, vender em múltiplos marketplaces e acompanhar o 
              fluxo de caixa é um desafio diário para quem constrói o próprio negócio.
            </p>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Por isso, criamos o ecossistema Opera Digital: uma plataforma unificada que conecta ERP, PDV de loja física, 
              Conta Digital e Agentes de Inteligência Artificial para transformar horas de trabalho manual em apenas alguns cliques.
            </p>

            {/* Values Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#0A4EE4]/10 text-[#0A4EE4] shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Segurança & Conformidade</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Homologado em todas as Sefaz e prefeituras do país.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#0A4EE4]/10 text-[#0A4EE4] shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Suporte 100% Humanizado</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Atendimento rápido via WhatsApp por especialistas reais.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Visual Card */}
          <div className="lg:col-span-5">
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl p-8 text-white shadow-2xl relative border border-slate-800 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#0A4EE4] flex items-center justify-center text-white font-black text-2xl">
                  O
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Ecossistema Opera</h3>
                  <p className="text-xs text-slate-400">Transformando a gestão no Brasil desde 2018</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between p-3 bg-slate-800/80 rounded-xl text-xs">
                  <span className="text-slate-300">Clientes Ativos no País</span>
                  <span className="font-bold text-emerald-400 font-mono">+63.000 empresas</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-800/80 rounded-xl text-xs">
                  <span className="text-slate-300">Notas Fiscais Emitidas</span>
                  <span className="font-bold text-blue-400 font-mono">+194 Milhões</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-800/80 rounded-xl text-xs">
                  <span className="text-slate-300">Marketplaces Conectados</span>
                  <span className="font-bold text-amber-400 font-mono">+30 Canais</span>
                </div>
              </div>

              <div className="p-4 bg-[#0A4EE4]/20 border border-[#0A4EE4]/40 rounded-xl text-xs text-blue-200">
                "Nosso compromisso é garantir que nenhum empreendedor brasileiro perca tempo com burocracia que um bom sistema pode resolver."
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
