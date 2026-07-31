import React from 'react';
import { ShieldCheck, Users, Globe, MessageSquare, Sparkles } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="sobre" className="py-20 bg-gradient-to-b from-slate-900 via-slate-950 to-black text-slate-100 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-950/80 border border-blue-800/60 px-3.5 py-1.5 rounded-full shadow-sm">
              Sobre a Opera Digital
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Aceleração Digital e Tecnologia para <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">alavancar seu negócio</span>
            </h2>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              A Opera Digital é uma agência de tecnologia especializada na construção de presença digital forte e atendimento automatizado de alta performance.
            </p>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Desenvolvemos websites modernos, Landing Pages responsivas e portais sob medida, além de estruturar o WhatsApp Web da sua empresa com Inteligência Artificial e automações para maximizar o atendimento aos seus clientes.
            </p>

            {/* Values Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-950/80 text-blue-400 shrink-0 border border-blue-800/50">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Sites de Alta Conversão</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Design exclusivo, responsivo e preparado para o Google (SEO).</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-950/80 text-emerald-400 shrink-0 border border-emerald-800/50">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Automação no WhatsApp</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Atendimento 24/7 com Agentes de IA e triagem ágil.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Visual Card */}
          <div className="lg:col-span-5">
            <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-black rounded-3xl p-8 text-white shadow-2xl relative border border-slate-800 space-y-6">
              <div className="flex items-center gap-3">
                <img 
                  src="https://i.ibb.co/SX9x8b4k/d943fc28-7ed1-4e07-a215-5630a4dea11d.jpg" 
                  alt="Opera Digital Logo" 
                  className="h-10 w-auto rounded-xl object-contain bg-white p-1"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="font-bold text-lg text-white">Opera Digital</h3>
                  <p className="text-xs text-slate-400">Soluções Web & Atendimento Inteligente</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs">
                  <span className="text-slate-300">Criação de Sites</span>
                  <span className="font-bold text-blue-400">Layouts Exclusivos</span>
                </div>
                <div className="flex items-center justify-between p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs">
                  <span className="text-slate-300">WhatsApp Web</span>
                  <span className="font-bold text-emerald-400">Agentes Virtuais com IA</span>
                </div>
                <div className="flex items-center justify-between p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs">
                  <span className="text-slate-300">Otimização</span>
                  <span className="font-bold text-amber-400">SEO & Mobile First</span>
                </div>
              </div>

              <div className="p-4 bg-blue-950/60 border border-blue-800/50 rounded-xl text-xs text-blue-200">
                "Nosso compromisso é destacar sua marca na internet e automatizar o atendimento para que você feche mais negócios todos os dias."
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
