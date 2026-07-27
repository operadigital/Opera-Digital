import React from 'react';
import { X, ShieldCheck, FileText } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  type: 'terms' | 'privacy';
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({
  isOpen,
  type,
  onClose
}) => {
  if (!isOpen) return null;

  const title = type === 'terms' ? 'Termos de Uso Opera Digital' : 'Política de Privacidade Opera Digital';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-slate-100 max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#0A4EE4]" />
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 overflow-y-auto space-y-4 text-xs text-slate-600 leading-relaxed pr-2 scrollbar-thin">
          {type === 'terms' ? (
            <>
              <p><strong>1. Visão Geral:</strong> Bem-vindo ao Opera Digital. Ao utilizar nossa plataforma, você concorda com os termos descritos abaixo. O Opera Digital oferece ferramentas de ERP, PDV, emissão de Notas Fiscais e gestão financeira.</p>
              <p><strong>2. Assinatura e Planos:</strong> A utilização da plataforma é realizada mediante contratação de plano ativo. O usuário pode escolher o plano mais adequado ao seu volume de operações e alterar ou cancelar a qualquer momento.</p>
              <p><strong>3. Responsabilidade pelos Dados Fiscais:</strong> O usuário é inteiramente responsável pela veracidade e exatidão dos dados fornecidos para a emissão de Notas Fiscais perante a Secretaria da Fazenda (Sefaz) e prefeituras.</p>
              <p><strong>4. Disponibilidade do Serviço (SLA):</strong> Garantimos 99,9% de disponibilidade mensal do sistema, exceto em janelas de manutenção programadas pré-notificadas.</p>
              <p><strong>5. Cancelamento:</strong> Você pode cancelar sua assinatura a qualquer momento sem qualquer multa ou cláusula de fidelidade.</p>
            </>
          ) : (
            <>
              <p><strong>1. Coleta de Informações:</strong> Coletamos apenas as informações estritamente necessárias para a prestação dos serviços de gestão (Nome, E-mail, Celular, CNPJ e dados cadastrais da empresa).</p>
              <p><strong>2. Proteção de Dados (LGPD):</strong> Estamos 100% em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018). Seus dados são encriptados e nunca vendidos a terceiros.</p>
              <p><strong>3. Armazenamento Seguro:</strong> Todos os registros e notas fiscais são armazenados em servidores seguros com backup diário criptografado.</p>
              <p><strong>4. Direitos do Titular:</strong> O usuário pode solicitar a exportação ou exclusão definitiva de seus dados a qualquer momento através do nosso suporte.</p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#0A4EE4] text-white font-semibold text-xs px-5 py-2.5 rounded-xl hover:bg-[#083DB4] transition-colors"
          >
            Entendido e Aceito
          </button>
        </div>

      </div>
    </div>
  );
};
