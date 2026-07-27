import React from 'react';
import { Users, ShoppingBag, FileCheck2, Wallet } from 'lucide-react';
import { STATS_DATA } from '../data/mockData';

const STAT_ICONS = [
  Users,
  ShoppingBag,
  FileCheck2,
  Wallet
];

export const StatsBar: React.FC = () => {
  return (
    <section className="py-10 bg-slate-50/70 border-y border-slate-200/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {STATS_DATA.map((stat, idx) => {
            const Icon = STAT_ICONS[idx % STAT_ICONS.length];
            return (
              <div 
                key={idx} 
                className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-200 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0A4EE4] group-hover:bg-[#0A4EE4] group-hover:text-white transition-colors duration-300 shadow-2xs">
                      <Icon className="w-5 h-5 stroke-[2.2]" />
                    </div>
                  </div>

                  <div className="text-3xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight group-hover:text-[#0A4EE4] transition-colors duration-200">
                    {stat.value}
                  </div>

                  <div className="text-sm font-bold text-slate-800 mt-1.5 leading-snug">
                    {stat.label}
                  </div>
                </div>

                <div className="mt-3.5 pt-3 border-t border-slate-100 text-xs text-slate-500 font-medium">
                  {stat.detail}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

