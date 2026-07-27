import React from 'react';
import { Star, Quote, TrendingUp, CheckCircle2 } from 'lucide-react';
import { TESTIMONIAL_DATA } from '../data/mockData';

export const Testimonial: React.FC = () => {
  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#0A4EE4]/15 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="bg-slate-800/80 rounded-3xl p-8 sm:p-12 border border-slate-700/80 shadow-2xl relative">
          
          <Quote className="absolute top-6 right-8 w-16 h-16 text-slate-700/40 pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Author Photo & Highlight Badge */}
            <div className="lg:col-span-4 flex flex-col items-center text-center lg:border-r lg:border-slate-700/80 lg:pr-8">
              <div className="relative mb-4">
                <img 
                  src={TESTIMONIAL_DATA.avatarUrl} 
                  alt={TESTIMONIAL_DATA.author}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-[#0A4EE4] shadow-lg shadow-[#0A4EE4]/30"
                />
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-slate-950 p-1.5 rounded-lg shadow-md">
                  <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                </div>
              </div>

              <h4 className="font-extrabold text-xl text-white">
                {TESTIMONIAL_DATA.author}
              </h4>

              <p className="text-xs text-blue-300 font-semibold mt-0.5">
                {TESTIMONIAL_DATA.role}
              </p>

              <p className="text-xs text-slate-400 mt-1">
                {TESTIMONIAL_DATA.company}
              </p>

              {/* Star Rating */}
              <div className="flex gap-1 mt-3 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap justify-center gap-1.5 mt-4">
                {TESTIMONIAL_DATA.tags.map((tag, tIdx) => (
                  <span key={tIdx} className="text-[10px] bg-slate-700/80 text-slate-300 font-medium px-2.5 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Quote Content & Results */}
            <div className="lg:col-span-8 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{TESTIMONIAL_DATA.metrics}</span>
              </div>

              <p className="text-lg sm:text-2xl font-semibold text-slate-100 leading-relaxed italic">
                "{TESTIMONIAL_DATA.quote}"
              </p>

              <div className="pt-4 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
                <span>
                  Lojas físicas integradas com Mercado Livre, Shopee e PDV balcão
                </span>
                <span className="text-[#0A4EE4] font-bold">
                  Cliente Opera Digital há 3 anos
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
