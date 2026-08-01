import React from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { getStoredWhatsAppNumber } from '../utils/whatsapp';

interface CtaBannerProps {
  onNavigateToRegister: () => void;
  onOpenQuoteModal?: (serviceName?: string) => void;
}

export const CtaBanner: React.FC<CtaBannerProps> = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-slate-950 via-slate-900 to-black text-white relative overflow-hidden border-t border-slate-800">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-900/20 blur-[130px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6"
      >
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-800/60 text-xs font-semibold text-blue-400">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Sua empresa pronta para vender mais</span>
        </div>

        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white">
          Sua Presença Digital <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">Começa Aqui</span>
        </h2>

        <p className="text-slate-300 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed font-normal">
          Tenha um site profissional de alta conversão e seu WhatsApp Web estruturado para atender e vender 24 horas por dia.
        </p>

        <div className="pt-4 flex justify-center">
          <motion.a
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            href={`https://wa.me/${getStoredWhatsAppNumber()}?text=${encodeURIComponent('Olá! Gostaria de solicitar um orçamento com a Opera Digital.')}`}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto bg-[#0A4EE4] hover:bg-blue-600 text-white font-extrabold text-base px-9 py-4 rounded-xl shadow-xl shadow-blue-950/60 transition-all duration-200 flex items-center justify-center gap-2.5 group min-h-[52px]"
          >
            <span>Solicitar Orçamento</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.a>
        </div>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-300 font-medium">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 stroke-[3]" />
            Atendimento Personalizado
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 stroke-[3]" />
            Layout Exclusivo e Responsivo
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Estruturação Completa do WhatsApp
          </span>
        </div>

      </motion.div>
    </section>
  );
};

