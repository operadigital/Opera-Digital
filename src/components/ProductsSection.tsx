import React, { useState } from 'react';
import { 
  FileText, Layers, Store, Wallet, Truck, Check, ArrowRight, 
  Sparkles, CheckCircle2, ShieldCheck, Zap
} from 'lucide-react';
import { PRODUCTS_LIST } from '../data/mockData';

interface ProductsSectionProps {
  onNavigateToRegister: () => void;
}

export const ProductsSection: React.FC<ProductsSectionProps> = ({ onNavigateToRegister }) => {
  const [activePreview, setActivePreview] = useState<Record<string, string>>({});

  const getProductIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileText': return <FileText className="w-6 h-6 text-[#0A4EE4]" />;
      case 'Layers': return <Layers className="w-6 h-6 text-[#0A4EE4]" />;
      case 'Store': return <Store className="w-6 h-6 text-[#0A4EE4]" />;
      case 'Wallet': return <Wallet className="w-6 h-6 text-[#0A4EE4]" />;
      case 'Truck': return <Truck className="w-6 h-6 text-[#0A4EE4]" />;
      default: return <Sparkles className="w-6 h-6 text-[#0A4EE4]" />;
    }
  };

  return (
    <section id="produtos" className="py-20 bg-slate-50 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0A4EE4] bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
            Ecossistema Completo Opera Digital
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Tudo o que sua empresa precisa em um <br className="hidden sm:inline" />
            <span className="text-[#0A4EE4]">único sistema integrado</span>
          </h2>

          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Acabe com a colcha de retalhos de softwares desconectados. A Opera Digital oferece todas as 
            ferramentas para gerenciar e escalar suas vendas físicas e digitais.
          </p>
        </div>

        {/* Alternating Products Blocks */}
        <div className="space-y-12 sm:space-y-20">
          {PRODUCTS_LIST.map((prod, index) => {
            const isEven = index % 2 === 0;

            return (
              <div 
                key={prod.id}
                id={`produto-${prod.id}`}
                className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center"
              >
                {/* Content Column */}
                <div className={`lg:col-span-6 space-y-4 sm:space-y-6 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A4EE4]/10 text-[#0A4EE4] text-xs font-bold">
                    {getProductIcon(prod.iconName)}
                    <span>{prod.category}</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                    {prod.title}
                  </h3>

                  <p className="text-slate-600 text-sm sm:text-lg leading-relaxed">
                    {prod.fullDesc}
                  </p>

                  {/* Highlights Checklist */}
                  <div className="space-y-2.5 pt-1">
                    {prod.highlights.map((item, hIdx) => (
                      <div key={hIdx} className="flex items-start gap-3">
                        <div className="p-1 rounded-full bg-emerald-100 text-emerald-600 shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-slate-800">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Call to Action for Product */}
                  <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <button
                      onClick={onNavigateToRegister}
                      className="w-full sm:w-auto h-12 bg-[#0A4EE4] hover:bg-blue-700 text-white font-bold text-sm px-6 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                    >
                      <span>Conhecer {prod.title}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <span className="text-xs text-slate-500 font-medium text-center sm:text-left">
                      Plataforma 100% Homologada
                    </span>
                  </div>
                </div>

                {/* Mockup / Visual Column */}
                <div className={`lg:col-span-6 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                  <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-xl border border-slate-200/80 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
                    
                    {/* Header of Mockup Card */}
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                        <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                        <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                        <span className="text-xs font-mono text-slate-400 ml-2">
                          operadigital.com.br/módulo/{prod.id}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-[#0A4EE4] bg-blue-50 px-2.5 py-0.5 rounded-full">
                        {prod.badge}
                      </span>
                    </div>

                    {/* Specific Mockup Previews Based on Module */}
                    {prod.mockupType === 'erp' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="text-xs text-slate-500 block">NFs Autorizadas Sefaz</span>
                            <span className="text-xl font-bold text-slate-900">1.480 NFe</span>
                            <span className="text-[10px] text-emerald-600 block mt-0.5 font-medium">Status 100% Ok</span>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="text-xs text-slate-500 block">Integrado com</span>
                            <span className="text-xl font-bold text-[#0A4EE4]">+30 Canas</span>
                            <span className="text-[10px] text-slate-500 block mt-0.5">Mercado Livre, Shopee, Amazon</span>
                          </div>
                        </div>

                        <div className="p-4 bg-slate-900 text-white rounded-xl space-y-2">
                          <div className="flex justify-between text-xs font-semibold text-slate-300">
                            <span>Demonstrativo do Resultado (DRE)</span>
                            <span className="text-emerald-400">Lucro Operacional: +32.4%</span>
                          </div>
                          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 w-[78%]"></div>
                          </div>
                          <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                            <span>Receita Bruta: R$ 184.900</span>
                            <span>CMV + Impostos: R$ 125.000</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {prod.mockupType === 'hub' && (
                      <div className="space-y-3">
                        <div className="p-3 bg-[#0A4EE4]/5 rounded-xl border border-[#0A4EE4]/20 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Zap className="w-5 h-5 text-[#0A4EE4]" />
                            <div>
                              <span className="text-xs font-bold text-slate-900 block">Anúncios em Massa</span>
                              <span className="text-[11px] text-slate-500">250 produtos publicados em 4 marketplaces simultâneos</span>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-[#0A4EE4] bg-white px-2 py-1 rounded shadow-xs">
                            Sincronizado
                          </span>
                        </div>

                        <div className="space-y-2">
                          {[
                            { channel: 'Mercado Livre', label: '1.240 anúncios ativos', status: 'Estoque Unificado' },
                            { channel: 'Shopee Brasil', label: '980 anúncios ativos', status: 'Preço Dinâmico' },
                            { channel: 'Amazon BR', label: '450 anúncios ativos', status: 'Etiqueta Automática' }
                          ].map((item, i) => (
                            <div key={i} className="p-2.5 bg-slate-50 rounded-lg flex items-center justify-between text-xs">
                              <span className="font-semibold text-slate-800">{item.channel}</span>
                              <span className="text-slate-500">{item.label}</span>
                              <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">{item.status}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {prod.mockupType === 'pdv' && (
                      <div className="space-y-3">
                        <div className="p-4 bg-slate-900 text-white rounded-xl flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Frente de Caixa PDV</span>
                            <span className="text-2xl font-bold font-mono">Caixa #01 - ABERTO</span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs text-emerald-400 font-bold block">Vendas Hoje</span>
                            <span className="text-lg font-bold text-white font-mono">R$ 4.250,00</span>
                          </div>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-slate-800 block">Comissão Vendedor: Ricardo M.</span>
                            <span className="text-slate-500">Comissão de 3.5% acumulada: R$ 148,75</span>
                          </div>
                          <span className="text-emerald-600 font-bold bg-emerald-100 px-2.5 py-1 rounded-full">
                            NFCe Emitida
                          </span>
                        </div>
                      </div>
                    )}

                    {prod.mockupType === 'bank' && (
                      <div className="space-y-3">
                        <div className="p-4 bg-[#0A4EE4] text-white rounded-xl">
                          <span className="text-xs opacity-80 block">Saldo Conta Digital Opera</span>
                          <span className="text-2xl font-extrabold font-mono mt-0.5 block">R$ 48.920,45</span>
                          <div className="flex items-center gap-2 mt-3 text-xs opacity-90">
                            <span className="bg-white/20 px-2 py-0.5 rounded">Pix Sem Taxas</span>
                            <span className="bg-white/20 px-2 py-0.5 rounded">Conciliação Automática</span>
                          </div>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-slate-800 block">Pagamento em Lote — Fornecedores</span>
                            <span className="text-slate-500">12 guias GNRE + 5 boletos quitados sem fila</span>
                          </div>
                          <span className="text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded">
                            Concluído
                          </span>
                        </div>
                      </div>
                    )}

                    {prod.mockupType === 'shipping' && (
                      <div className="space-y-3">
                        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-emerald-900 block">Coleta sem Cota Mínima</span>
                            <span className="text-xs text-emerald-700">Coletador a caminho para 14 pacotes de hoje</span>
                          </div>
                          <span className="text-xs font-bold bg-emerald-600 text-white px-2.5 py-1 rounded-full">
                            Coleta Confirmada
                          </span>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs">
                          <div className="flex justify-between font-semibold text-slate-800">
                            <span>Rastreio WhatsApp ao Cliente</span>
                            <span className="text-emerald-600 font-bold">Em Trânsito</span>
                          </div>
                          <p className="text-slate-500 text-[11px]">
                            "Seu pedido #ML-89320 foi coletado e está a caminho de São Paulo/SP. Código de rastreio: OP984210BR"
                          </p>
                        </div>
                      </div>
                    )}

                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
