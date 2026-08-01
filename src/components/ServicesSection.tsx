import React from 'react';
import { Globe, MessageSquare, Check, ArrowRight, Sparkles, ShieldCheck, Zap, Laptop, Bot, Search, Smartphone, CheckCircle2, Star, Cpu } from 'lucide-react';
import { getStoredWhatsAppNumber } from '../utils/whatsapp';

interface ServicesSectionProps {
  onNavigateToRegister: () => void;
  onOpenQuoteModal?: (serviceName?: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onNavigateToRegister, onOpenQuoteModal }) => {
  return (
    <section id="servicos" className="py-20 bg-gradient-to-b from-black via-slate-950 to-slate-900 text-slate-100 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-950/80 border border-blue-800/60 px-3.5 py-1.5 rounded-full shadow-sm">
            Nossas Especialidades
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Soluções Digitais que <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">Impulsionam seu Negócio</span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Desenvolvemos a presença online ideal para sua empresa e automatizamos seu atendimento para transformar visitantes em clientes satisfeitos.
          </p>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* SERVICE 1: CRIAÇÃO DE SITES PROFISSIONAIS (COM IMAGEM & EXPLICAÇÃO) */}
        {/* ------------------------------------------------------------- */}
        <div id="criacao-de-sites" className="bg-slate-900/90 rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-800 shadow-2xl overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Column: Detailed Explanation */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 bg-blue-950/80 text-blue-400 px-3.5 py-1.5 rounded-full text-xs font-bold border border-blue-800/60">
                <Globe className="w-4 h-4" />
                <span>Criação de Sites & Landing Pages</span>
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                Criação de Sites Profissionais de Alta Conversão
              </h3>

              <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
                <p>
                  Um site profissional é a vitrine principal da sua empresa na internet. Na <strong className="text-white">Opera Digital</strong>, criamos websites sob medida que transmitem máxima autoridade e credibilidade logo no primeiro impacto.
                </p>
                <p>
                  Incorporamos as melhores práticas de <strong className="text-white">Design UX/UI, SEO (otimização para o Google) e velocidade de carregamento ultrarrápida</strong>. Cada elemento do seu site é pensado estrategicamente para captar leads e direcioná-los para o seu WhatsApp ou canal de atendimento.
                </p>
              </div>

              {/* Feature Bullets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded-full bg-blue-950 text-blue-400 border border-blue-800/60 shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-200">Layout 100% Personalizado</span>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded-full bg-blue-950 text-blue-400 border border-blue-800/60 shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-200">Otimizado para o Google (SEO)</span>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded-full bg-blue-950 text-blue-400 border border-blue-800/60 shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-200">Responsivo em Celular e Tablet</span>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded-full bg-blue-950 text-blue-400 border border-blue-800/60 shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-200">Integração Direta no WhatsApp</span>
                </div>
              </div>

              <div className="pt-4">
                <a
                  href={`https://wa.me/${getStoredWhatsAppNumber()}?text=${encodeURIComponent('Olá! Gostaria de solicitar a criação de um site profissional de alta conversão para o meu negócio.')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-8 py-4 bg-[#0A4EE4] hover:bg-blue-600 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-blue-900/40 transition-all flex items-center justify-center gap-2 group min-h-[48px]"
                >
                  <span>Solicitar Criação do Meu Site</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            {/* Right Column: Example Showcase Image & Interactive Browser Box */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl group">
                {/* Real Showcase Screenshot Image */}
                <img 
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80" 
                  alt="Exemplo de Criação de Site Profissional Opera Digital" 
                  className="w-full h-64 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />

                {/* Floating Badge overlay */}
                <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-slate-950/85 backdrop-blur-md text-white px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-bold flex items-center gap-1.5 sm:gap-2 border border-slate-700/80 max-w-[calc(100%-1.5rem)] truncate">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></div>
                  <span className="truncate">Exemplo de Site de Alta Performance</span>
                </div>

                <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 bg-slate-900/95 backdrop-blur-md text-slate-100 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-[10px] sm:text-xs font-extrabold shadow-lg border border-slate-800 flex items-center gap-1.5 sm:gap-2 max-w-[calc(100%-1.5rem)] truncate">
                  <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 fill-amber-400 shrink-0" />
                  <span className="truncate">Google PageSpeed: 99/100</span>
                </div>
              </div>

              {/* Mini Details Box */}
              <div className="bg-slate-950 text-slate-200 p-4 rounded-2xl text-xs space-y-2 border border-slate-800">
                <div className="flex items-center justify-between font-mono text-slate-400 border-b border-slate-800 pb-2">
                  <span>🔒 https://suaempresa.com.br</span>
                  <span className="text-emerald-400 font-bold">100% Responsivo</span>
                </div>
                <p className="text-slate-300">
                  A inclusão de botões flutuantes de atendimento e formulários inteligentes de orçamento converte visitantes casuais em contatos reais diretamente no seu WhatsApp.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* SERVICE 2: ESTRUTURAÇÃO DO WHATSAPP WEB (COM IMAGEM & EXPLICAÇÃO) */}
        {/* ------------------------------------------------------------- */}
        <div id="estruturacao-whatsapp" className="bg-slate-900/90 rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-800 shadow-2xl overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Column: Authentic WhatsApp Web Interface Mockup */}
            <div className="lg:col-span-6 space-y-4 order-2 lg:order-1">
              {/* WhatsApp Web Desktop Screen Container */}
              <div className="bg-[#111b21] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl font-sans text-slate-100">
                {/* Top WhatsApp Web Green Header Bar */}
                <div className="bg-[#202c33] px-4 py-3 flex items-center justify-between border-b border-[#222d34]">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                        <Bot className="w-5 h-5 text-emerald-100" />
                      </div>
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#202c33]"></div>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                        <span>WhatsApp Web • Agente IA Opera</span>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30 font-semibold">
                          Online 24/7
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-400">Atendimento Automático & Multi-Atendentes</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="hidden sm:inline-block text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-800/80">
                      3 Atendentes Ativos
                    </span>
                  </div>
                </div>

                {/* Main WhatsApp Web Layout: Sidebar + Chat Panel */}
                <div className="grid grid-cols-12 min-h-[300px] sm:min-h-[340px]">
                  
                  {/* Left Chat List (Hidden on smallest screens, visible sm+) */}
                  <div className="hidden sm:block sm:col-span-4 bg-[#111b21] border-r border-[#222d34] p-2 space-y-2">
                    <div className="bg-[#202c33] px-3 py-1.5 rounded-lg text-xs text-slate-400 flex items-center gap-2">
                      <Search className="w-3.5 h-3.5 text-slate-400" />
                      <span>Pesquisar conversas...</span>
                    </div>

                    {/* Chat Item 1 (Active) */}
                    <div className="p-2 rounded-xl bg-[#2a3942] border border-emerald-500/30 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white truncate">Cliente Lead Google</span>
                        <span className="text-[10px] text-emerald-400 font-mono">14:32</span>
                      </div>
                      <p className="text-[11px] text-slate-300 line-clamp-1">Vim pelo site e quero um orçamento...</p>
                      <div className="flex items-center gap-1">
                        <span className="text-[9px] font-bold bg-emerald-500 text-slate-950 px-1.5 py-0.2 rounded">NOVO LEAD</span>
                        <span className="text-[9px] font-bold bg-blue-500/30 text-blue-300 px-1.5 py-0.2 rounded">SITE</span>
                      </div>
                    </div>

                    {/* Chat Item 2 */}
                    <div className="p-2 rounded-xl bg-[#111b21] opacity-70 hover:opacity-100 transition-opacity space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-200 truncate">Carlos - Orçamento</span>
                        <span className="text-[10px] text-slate-500">14:10</span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1">Proposta aceita! Como pago?</p>
                      <span className="text-[9px] font-bold bg-amber-500/30 text-amber-300 px-1.5 py-0.2 rounded">PROPOSTA</span>
                    </div>

                    {/* Chat Item 3 */}
                    <div className="p-2 rounded-xl bg-[#111b21] opacity-70 hover:opacity-100 transition-opacity space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-200 truncate">Fernanda D.</span>
                        <span className="text-[10px] text-slate-500">13:45</span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1">Obrigado pelas informações!</p>
                      <span className="text-[9px] font-bold bg-slate-700 text-slate-300 px-1.5 py-0.2 rounded">FINALIZADO</span>
                    </div>
                  </div>

                  {/* Right Chat Panel */}
                  <div className="col-span-12 sm:col-span-8 bg-[#0b141a] p-3 sm:p-4 flex flex-col justify-between space-y-3 relative">
                    {/* Background Chat Pattern Subtle Tint */}
                    <div className="absolute inset-0 bg-[radial-gradient(#202c33_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none"></div>

                    {/* Chat Bubbles Container */}
                    <div className="space-y-3 relative z-10 text-xs">
                      <div className="text-center">
                        <span className="text-[10px] bg-[#182229] text-slate-400 px-3 py-1 rounded-md font-mono">
                          Hoje • Atendimento Automatizado IA
                        </span>
                      </div>

                      {/* Customer Message */}
                      <div className="bg-[#202c33] text-slate-100 p-3 rounded-xl rounded-tl-none max-w-[88%] shadow-md border border-[#2a3942] space-y-1">
                        <p className="text-xs leading-relaxed">
                          "Olá! 👋 Vi o site de vocês e gostaria de saber o valor para criar um site para minha empresa e automatizar o WhatsApp."
                        </p>
                        <div className="text-[9px] text-slate-400 text-right font-mono">14:32</div>
                      </div>

                      {/* AI Agent Automated Instant Response */}
                      <div className="bg-[#005c4b] text-emerald-50 p-3 rounded-xl rounded-tr-none max-w-[88%] ml-auto shadow-md border border-emerald-600/30 space-y-1.5">
                        <div className="flex items-center justify-between border-b border-emerald-500/30 pb-1">
                          <span className="text-[10px] font-bold text-emerald-300 flex items-center gap-1">
                            <Bot className="w-3 h-3 text-emerald-300" /> Resposta Imediata Agente IA
                          </span>
                          <span className="text-[9px] text-emerald-200 font-mono">14:32</span>
                        </div>
                        <p className="text-xs leading-relaxed">
                          "Com certeza! Nossos projetos incluem site exclusivo e WhatsApp estruturado. Qual o segmento do seu negócio para agilizarmos seu orçamento personalizado?"
                        </p>
                      </div>

                      {/* Status Notification */}
                      <div className="bg-[#182229]/90 border border-emerald-500/30 text-emerald-400 p-2 rounded-lg text-[11px] font-semibold flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-emerald-400" />
                          Lead qualificado e encaminhado para atendente
                        </span>
                        <span className="text-[10px] bg-emerald-950 px-2 py-0.5 rounded text-emerald-300">
                          Etiqueta: Quente
                        </span>
                      </div>
                    </div>

                    {/* Bottom Input Field Visual */}
                    <div className="relative z-10 bg-[#202c33] p-2 rounded-xl border border-[#2a3942] flex items-center justify-between text-slate-400 text-xs gap-2 min-w-0">
                      <span className="truncate min-w-0 text-[11px] sm:text-xs">Digite sua mensagem ou escolha uma resposta rápida...</span>
                      <div className="p-1.5 bg-emerald-600 text-white rounded-lg shrink-0">
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Bottom Feature Badges */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-slate-950 text-white p-3 rounded-xl border border-slate-800 text-xs flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-800/50">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white">Multi-Atendimento</h5>
                    <p className="text-[10px] text-slate-400">Vários atendentes no 1º número</p>
                  </div>
                </div>

                <div className="bg-slate-950 text-white p-3 rounded-xl border border-slate-800 text-xs flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-800/50">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white">Sem Fila de Espera</h5>
                    <p className="text-[10px] text-slate-400">Resposta em até 3 segundos</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Detailed Explanation */}
            <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 bg-emerald-950/80 text-emerald-400 px-3.5 py-1.5 rounded-full text-xs font-bold border border-emerald-800/60">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>Automação & Atendimento no WhatsApp</span>
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                Estruturação do WhatsApp Web Profissional
              </h3>

              <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
                <p>
                  O WhatsApp é o principal canal de vendas no Brasil. No entanto, muitas empresas perdem clientes por demora no atendimento, falta de organização de contatos ou mensagens perdidas.
                </p>
                <p>
                  A <strong className="text-white">Opera Digital</strong> estrutura o seu WhatsApp Web criando uma central profissional de atendimento. Implementamos <strong className="text-white">robôs inteligentes e Agentes de IA treinados</strong> para tirar dúvidas, qualificar potenciais clientes, organizar funis de propostas e permitir que múltiplos colaboradores atendam no mesmo número.
                </p>
              </div>

              {/* Feature Bullets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60 shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-200">Respostas Automáticas 24 horas</span>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60 shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-200">Agentes Virtuais com IA</span>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60 shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-200">Organização de Etiquetas e Funis</span>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60 shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-200">Painel Multi-Atendentes</span>
                </div>
              </div>

              <div className="pt-4">
                <a
                  href={`https://wa.me/${getStoredWhatsAppNumber()}?text=${encodeURIComponent('Olá! Gostaria de estruturar o WhatsApp Web da minha empresa.')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-emerald-950/50 transition-all flex items-center justify-center gap-2 group min-h-[48px]"
                >
                  <span>Estruturar Meu WhatsApp Web</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

