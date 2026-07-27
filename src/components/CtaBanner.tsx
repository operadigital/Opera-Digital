import React from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

interface CtaBannerProps {
  onNavigateToRegister: () => void;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({ onNavigateToRegister }) => {
  return (
    <section className="py-20 bg-[#0A4EE4] text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-900/40 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-xs border border-white/20 text-xs font-semibold text-white">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Transforme a gestão do seu negócio hoje</span>
        </div>

        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
          Negócios que vão longe <br className="hidden sm:inline" />
          não vão sozinhos
        </h2>

        <p className="text-blue-100 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed font-normal">
          Junte-se a mais de 63.000 empreendedores brasileiros e transforme sua gestão hoje mesmo com o Opera Digital.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onNavigateToRegister}
            className="w-full sm:w-auto bg-white hover:bg-slate-100 text-[#0A4EE4] font-extrabold text-base px-9 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center justify-center gap-2.5 group"
          >
            <span>Criar minha conta</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-blue-100 font-medium">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-300 stroke-[3]" />
            Ativação imediata
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-300 stroke-[3]" />
            Setup em menos de 10 min
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            Migração de dados auxiliada
          </span>
        </div>

      </div>
    </section>
  );
};
