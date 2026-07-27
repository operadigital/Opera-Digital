import React from 'react';
import { 
  Bot, MessageSquare, Zap, CheckCircle2, Sparkles, ArrowRight
} from 'lucide-react';
import { AI_AGENTS_FEATURES } from '../data/mockData';

export const AiAgentsSection: React.FC = () => {
  const getAgentIcon = (iconName: string) => {
    switch (iconName) {
      case 'Bot': return <Bot className="w-6 h-6 text-[#0A4EE4]" />;
      case 'MessageSquare': return <MessageSquare className="w-6 h-6 text-[#0A4EE4]" />;
      case 'Zap': return <Zap className="w-6 h-6 text-[#0A4EE4]" />;
      case 'CheckCircle2': return <CheckCircle2 className="w-6 h-6 text-[#0A4EE4]" />;
      default: return <Sparkles className="w-6 h-6 text-[#0A4EE4]" />;
    }
  };

  return (
    <section id="agentes-ia" className="py-16 bg-[#F8FAFC] text-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0A4EE4] bg-blue-50 px-3 py-1 rounded-full mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Agentes de Inteligência Artificial</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Agentes de IA <span className="text-[#0A4EE4] text-xs font-bold align-top ml-1 bg-blue-50 px-2 py-0.5 rounded-full">BETA</span>
            </h2>
          </div>
          <a href="#planos" className="text-sm font-bold text-[#0A4EE4] hover:underline hidden sm:flex items-center gap-1">
            Ver todos os recursos <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* 4 Cards Grid from Sleek Design */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {AI_AGENTS_FEATURES.map((feat) => {
            return (
              <div
                key={feat.id}
                className="p-5 bg-white rounded-xl border border-slate-100 hover:border-blue-200 shadow-sm transition-all hover:shadow-md group text-left"
              >
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-xl mb-3 group-hover:bg-[#0A4EE4] group-hover:text-white transition-colors">
                  {getAgentIcon(feat.iconName)}
                </div>
                <h3 className="font-bold text-sm text-slate-900 mb-1 group-hover:text-[#0A4EE4] transition-colors">
                  {feat.title}
                </h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
