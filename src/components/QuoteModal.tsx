import React, { useState } from 'react';
import { X, Send, Sparkles, CheckCircle2, MessageSquare, ShieldCheck, Globe, Bot, Building, User, Mail, Phone, FileText } from 'lucide-react';
import { getStoredWhatsAppNumber } from '../utils/whatsapp';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultService?: string;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({ isOpen, onClose, defaultService = 'Criação de Site Profissional' }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [service, setService] = useState(defaultService);
  const [details, setDetails] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [formattedMessage, setFormattedMessage] = useState('');

  if (!isOpen) return null;

  const handlePhoneChange = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 11);
    let formatted = digits;
    if (digits.length > 2) {
      formatted = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }
    if (digits.length > 7) {
      formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    }
    setPhone(formatted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) return;

    // Create WhatsApp message string
    const messageLines = [
      `🚀 *SOLICITAÇÃO DE ORÇAMENTO - OPERA DIGITAL*`,
      ``,
      `📋 *DADOS DO CLIENTE:*`,
      `• *Nome:* ${name.trim()}`,
      `• *E-mail:* ${email.trim()}`,
      `• *WhatsApp:* ${phone.trim()}`,
      company.trim() ? `• *Empresa / CNPJ:* ${company.trim()}` : null,
      ``,
      `🎯 *SERVIÇO DE INTERESSE:*`,
      `• ${service}`,
      ``,
      details.trim() ? `📝 *DETALHES DO PROJETO:* \n${details.trim()}` : null,
      ``,
      `📅 *Data:* ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`,
      ``,
      `Gostaria de receber um orçamento e mais detalhes!`
    ].filter(Boolean).join('\n');

    setFormattedMessage(messageLines);

    // Configured Opera Digital WhatsApp Number
    const targetPhone = getStoredWhatsAppNumber();
    const encoded = encodeURIComponent(messageLines);
    const url = `https://wa.me/${targetPhone}?text=${encoded}`;
    setWhatsappUrl(url);

    // Save lead to local storage & backend API
    try {
      const newLead = {
        id: Date.now(),
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        solution: service,
        segment: company.trim() ? 'Pessoa Jurídica' : 'Pessoa Física',
        date: new Date().toLocaleDateString('pt-BR'),
        status: 'Novo',
        notes: details.trim() || undefined
      };
      const existing = localStorage.getItem('opera_registered_leads');
      const leads = existing ? JSON.parse(existing) : [];
      leads.unshift(newLead);
      localStorage.setItem('opera_registered_leads', JSON.stringify(leads));

      fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLead)
      }).catch(() => {});
    } catch (err) {
      console.error(err);
    }

    // Redirect directly to WhatsApp in the same window
    window.location.href = url;
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setName('');
    setEmail('');
    setPhone('');
    setCompany('');
    setDetails('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden relative text-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-blue-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-xl">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white flex items-center gap-1.5">
                <span>Orçamento via WhatsApp</span>
                <span className="text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full">
                  RÁPIDO & DIRETO
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Preencha seus dados para enviar a proposta direto ao nosso atendimento.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Service Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Qual serviço você necessita? *
                </label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full text-sm h-11 px-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium"
                >
                  <option value="Criação de Site Profissional">🌐 Criação de Site Profissional</option>
                  <option value="Landing Page de Alta Conversão">🚀 Landing Page de Alta Conversão</option>
                  <option value="Estruturação do WhatsApp Web">💬 Estruturação do WhatsApp Web</option>
                  <option value="Agente de IA para Atendimento">🤖 Agente de Inteligência Artificial</option>
                  <option value="E-commerce & Loja Virtual">🛒 E-commerce & Loja Virtual</option>
                  <option value="Outros Serviços / Consultoria">⚡ Outros Serviços / Consultoria</option>
                </select>
              </div>

              {/* Customer Name */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Seu nome completo *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="Ex: Carlos Eduardo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-sm pl-10 pr-3 h-11 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Grid: Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    E-mail profissional *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      placeholder="seunome@empresa.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-sm pl-10 pr-3 h-11 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    WhatsApp com DDD *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      placeholder="(11) 99999-9999"
                      value={phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      className="w-full text-sm pl-10 pr-3 h-11 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Company / CNPJ */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Empresa / CNPJ <span className="text-slate-500 font-normal">(opcional)</span>
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    placeholder="Nome da sua empresa ou CNPJ"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full text-sm pl-10 pr-3 h-11 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Project Details */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Detalhes ou observações do orçamento <span className="text-slate-500 font-normal">(opcional)</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Conte brevemente sobre o seu projeto ou objetivos..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full text-sm p-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm py-3.5 rounded-xl shadow-lg shadow-emerald-950/60 transition-all flex items-center justify-center gap-2 group mt-2"
              >
                <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                <span>Enviar Orçamento para o WhatsApp</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Mensagem enviada diretamente ao atendimento oficial Opera Digital</span>
              </div>
            </form>
          ) : (
            /* Success confirmation & manual link fallback */
            <div className="space-y-5 text-center py-2">
              <div className="w-14 h-14 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-white">
                  Orçamento Pronto para Envio!
                </h3>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">
                  Caso a janela do WhatsApp não tenha aberto automaticamente, clique no botão abaixo para concluir o envio:
                </p>
              </div>

              {/* Message preview container */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-left text-xs font-mono text-emerald-300/90 whitespace-pre-wrap max-h-44 overflow-y-auto">
                {formattedMessage}
              </div>

              <div className="space-y-3">
                <a
                  href={whatsappUrl}
                  target="_self"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm py-3.5 rounded-xl shadow-lg shadow-emerald-950/60 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Abrir no WhatsApp Web / App</span>
                </a>

                <button
                  onClick={handleReset}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs py-2.5 rounded-xl transition-colors"
                >
                  Fechar Janela
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
