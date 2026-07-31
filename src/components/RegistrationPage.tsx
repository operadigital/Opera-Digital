import React, { useState } from 'react';
import { 
  CheckCircle2, ShieldCheck, ArrowLeft, Eye, EyeOff, Sparkles, 
  Building, Lock, Mail, Phone, User, Check, AlertCircle, ArrowRight
} from 'lucide-react';
import { RegistrationFormData } from '../types';

interface RegistrationPageProps {
  onNavigateHome: () => void;
  onOpenLogin: () => void;
  onOpenTerms: () => void;
  onOpenPrivacy: () => void;
}

export const RegistrationPage: React.FC<RegistrationPageProps> = ({
  onNavigateHome,
  onOpenLogin,
  onOpenTerms,
  onOpenPrivacy
}) => {
  const [formData, setFormData] = useState<RegistrationFormData>({
    fullName: '',
    preferredName: '',
    email: '',
    phone: '',
    cnpj: '',
    password: '',
    emailOptIn: true,
    whatsappOptIn: true,
    termsAccepted: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: 'bg-slate-200' };
    if (pass.length < 6) return { score: 1, label: 'Fraca', color: 'bg-rose-500' };
    if (pass.length < 10 || !/\d/.test(pass)) return { score: 2, label: 'Média', color: 'bg-amber-500' };
    return { score: 3, label: 'Forte', color: 'bg-emerald-500' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  // Phone auto-formatting
  const handlePhoneChange = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 11);
    let formatted = digits;
    if (digits.length > 2) {
      formatted = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }
    if (digits.length > 7) {
      formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    }
    setFormData((prev) => ({ ...prev, phone: formatted }));
  };

  // CNPJ auto-formatting
  const handleCnpjChange = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 14);
    let formatted = digits;
    if (digits.length > 2) {
      formatted = `${digits.slice(0, 2)}.${digits.slice(2)}`;
    }
    if (digits.length > 5) {
      formatted = `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
    }
    if (digits.length > 8) {
      formatted = `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
    }
    if (digits.length > 12) {
      formatted = `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
    }
    setFormData((prev) => ({ ...prev, cnpj: formatted }));
  };

  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [formattedMessage, setFormattedMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.fullName.trim()) {
      setErrorMessage('Por favor, informe seu nome completo.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Por favor, informe um e-mail válido.');
      return;
    }
    if (!formData.termsAccepted) {
      setErrorMessage('Você precisa aceitar os Termos de Uso e Política de Privacidade.');
      return;
    }

    // Format message for WhatsApp
    const msg = [
      `🚀 *SOLICITAÇÃO DE ORÇAMENTO / CADASTRO - OPERA DIGITAL*`,
      ``,
      `📋 *DADOS DO CLIENTE:*`,
      `• *Nome Completo:* ${formData.fullName.trim()}`,
      formData.preferredName.trim() ? `• *Como gostaria de ser chamado:* ${formData.preferredName.trim()}` : null,
      `• *E-mail Profissional:* ${formData.email.trim()}`,
      `• *Celular / WhatsApp:* ${formData.phone.trim() || 'Não informado'}`,
      formData.cnpj.trim() ? `• *CNPJ / Empresa:* ${formData.cnpj.trim()}` : `• *Tipo:* Pessoa Física`,
      ``,
      `📌 *Preferências:*`,
      `• *Notificações por E-mail:* ${formData.emailOptIn ? 'Sim' : 'Não'}`,
      `• *Notificações por WhatsApp:* ${formData.whatsappOptIn ? 'Sim' : 'Não'}`,
      ``,
      `📅 *Data:* ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`,
      ``,
      `Olá! Gostaria de receber atendimento e dar início ao meu projeto com a Opera Digital.`
    ].filter(Boolean).join('\n');

    setFormattedMessage(msg);

    const targetPhone = '5511978253909'; // Official Opera Digital WhatsApp
    const url = `https://wa.me/${targetPhone}?text=${encodeURIComponent(msg)}`;
    setWhatsappUrl(url);

    try {
      const newLead = {
        id: Date.now(),
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone || '-',
        solution: 'Cadastro & Orçamento Plataforma',
        segment: formData.cnpj ? 'Pessoa Jurídica' : 'Pessoa Física',
        date: new Date().toLocaleDateString('pt-BR'),
        status: 'Novo'
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

    // Save lead data and redirect directly in the current window
    window.location.href = url;
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Bar Navigation */}
      <div className="bg-slate-950 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2 text-slate-300 hover:text-blue-400 font-semibold text-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao site principal</span>
        </button>

        <div className="flex items-center gap-2">
          <img 
            src="https://i.ibb.co/SX9x8b4k/d943fc28-7ed1-4e07-a215-5630a4dea11d.jpg" 
            alt="Opera Digital Logo" 
            className="h-7 w-auto object-contain rounded-lg bg-white p-0.5"
            referrerPolicy="no-referrer"
          />
          <span className="font-extrabold text-sm text-white">
            Opera<span className="text-blue-500">Digital</span>
          </span>
        </div>

        <div className="text-xs text-slate-400 font-medium">
          Cadastro Seguro & Homologado
        </div>
      </div>

      {/* Main Split Screen */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-57px)]">
        
        {/* Left Side: Opera Primary Blue with Benefits */}
        <div className="lg:col-span-5 bg-gradient-to-b from-blue-950 via-slate-900 to-slate-950 text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden border-r border-slate-800">
          {/* Decorative glow circles */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-400/20 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-900/30 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative z-10 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-xs border border-white/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Plataforma de Gestão Completa</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                Acelere sua gestão <br />
                sem complicações.
              </h1>
              <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
                Junte-se a mais de 63.000 empreendedores que unificaram ERP, PDV, Mercado Livre, Shopee e Conta Digital em um só lugar.
              </p>
            </div>

            {/* Benefits List */}
            <div className="space-y-4 pt-2">
              {[
                { title: 'Acesso completo e imediato', desc: 'Acesso total a todas as ferramentas e módulos integrados.' },
                { title: 'Ativação em poucos minutos', desc: 'Cadastre sua empresa e comece a operar hoje mesmo.' },
                { title: 'Setup guiado em 10 minutos', desc: 'Importe seus produtos e emita suas primeiras NFs hoje.' },
                { title: 'Suporte humanizado no WhatsApp', desc: 'Especialistas prontos para te ajudar em cada etapa.' }
              ].map((b, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="p-1 rounded-full bg-white/20 text-white shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">{b.title}</h4>
                    <p className="text-xs text-blue-100/80">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Testimonial Snippet */}
          <div className="relative z-10 pt-8 border-t border-white/20 mt-8">
            <p className="text-xs text-blue-100 italic leading-relaxed">
              "Em menos de 15 minutos já estávamos emitindo notas fiscais e sincronizando o estoque das nossas lojas."
            </p>
            <span className="block text-xs font-bold text-white mt-2">
              — Diego Costa, Founder da Tudo para Moto
            </span>
          </div>
        </div>

        {/* Right Side: Sign-Up Form */}
        <div className="lg:col-span-7 bg-slate-950 p-6 sm:p-12 flex items-center justify-center">
          <div className="w-full max-w-lg space-y-6 bg-slate-900/90 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl">
            
            {!isSubmitted ? (
              <>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Crie sua conta
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Cadastre sua empresa e comece agora mesmo. Leva menos de 2 minutos!
                  </p>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-3 bg-rose-950/80 border border-rose-800/80 text-rose-300 rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Registration Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* Nome Completo */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Nome completo *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-4" />
                      <input
                        type="text"
                        required
                        placeholder="Ex: João da Silva Santos"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full text-base sm:text-sm pl-10 pr-3 h-12 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Como gostaria de ser chamado */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Como gostaria de ser chamado?
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: João"
                      value={formData.preferredName}
                      onChange={(e) => setFormData({ ...formData, preferredName: e.target.value })}
                      className="w-full text-base sm:text-sm px-3.5 h-12 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* E-mail */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      E-mail profissional *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-4" />
                      <input
                        type="email"
                        required
                        placeholder="joao@suaempresa.com.br"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full text-base sm:text-sm pl-10 pr-3 h-12 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Grid for Celular & CNPJ */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Celular / WhatsApp *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-4" />
                        <input
                          type="text"
                          required
                          placeholder="(11) 99999-9999"
                          value={formData.phone}
                          onChange={(e) => handlePhoneChange(e.target.value)}
                          className="w-full text-base sm:text-sm pl-10 pr-3 h-12 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        CNPJ da Empresa
                      </label>
                      <div className="relative">
                        <Building className="w-4 h-4 text-slate-500 absolute left-3.5 top-4" />
                        <input
                          type="text"
                          placeholder="00.000.000/0000-00"
                          value={formData.cnpj}
                          onChange={(e) => handleCnpjChange(e.target.value)}
                          className="w-full text-base sm:text-sm pl-10 pr-3 h-12 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Senha */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Crie sua senha *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-4" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="No mínimo 6 caracteres"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full text-base sm:text-sm pl-10 pr-12 h-12 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-1 top-1.5 h-9 w-10 flex items-center justify-center text-slate-400 hover:text-slate-200 focus:outline-none"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Password Strength Meter */}
                    {formData.password && (
                      <div className="mt-2 space-y-1">
                        <div className="flex gap-1 h-1.5">
                          {[1, 2, 3].map((step) => (
                            <div
                              key={step}
                              className={`flex-1 rounded-full transition-colors ${
                                step <= passwordStrength.score ? passwordStrength.color : 'bg-slate-800'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium block">
                          Força da senha: <strong className="text-slate-200">{passwordStrength.label}</strong>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Opt-in Checkboxes */}
                  <div className="space-y-2 pt-2 text-xs text-slate-300">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.emailOptIn}
                        onChange={(e) => setFormData({ ...formData, emailOptIn: e.target.checked })}
                        className="rounded border-slate-700 bg-slate-950 text-blue-500 focus:ring-blue-500"
                      />
                      <span>Desejo receber dicas de gestão e ofertas por e-mail</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.whatsappOptIn}
                        onChange={(e) => setFormData({ ...formData, whatsappOptIn: e.target.checked })}
                        className="rounded border-slate-700 bg-slate-950 text-blue-500 focus:ring-blue-500"
                      />
                      <span>Desejo receber avisos e lembretes via WhatsApp</span>
                    </label>

                    {/* Mandatory Terms Checkbox */}
                    <label className="flex items-start gap-2 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        required
                        checked={formData.termsAccepted}
                        onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                        className="rounded border-slate-700 bg-slate-950 text-blue-500 focus:ring-blue-500 mt-0.5"
                      />
                      <span className="text-slate-300">
                        Li e aceito os{' '}
                        <button type="button" onClick={onOpenTerms} className="text-blue-400 font-bold hover:underline">
                          Termos de Uso
                        </button>{' '}
                        e a{' '}
                        <button type="button" onClick={onOpenPrivacy} className="text-blue-400 font-bold hover:underline">
                          Política de Privacidade
                        </button>
                        . *
                      </span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-[#0A4EE4] hover:bg-blue-600 text-white font-extrabold text-base py-3.5 rounded-xl shadow-lg shadow-blue-950/60 transition-all duration-200 mt-4 flex items-center justify-center gap-2"
                  >
                    <span>Enviar solicitação e abrir WhatsApp</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </form>

                {/* Social Login Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-800"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-slate-900 px-3 text-slate-400 font-semibold">
                      Ou cadastre-se com
                    </span>
                  </div>
                </div>

                {/* Social Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setIsSubmitted(true)}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24z"/>
                      <path fill="#FBBC05" d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"/>
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"/>
                    </svg>
                    <span>Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsSubmitted(true)}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 23 23">
                      <path fill="#f35325" d="M1 1h10v10H1z"/>
                      <path fill="#81bc06" d="M12 1h10v10H12z"/>
                      <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                      <path fill="#ffba08" d="M12 12h10v10H12z"/>
                    </svg>
                    <span>Microsoft</span>
                  </button>
                </div>

                {/* Login link */}
                <p className="text-center text-xs text-slate-500 pt-2">
                  Já possui uma conta?{' '}
                  <button
                    type="button"
                    onClick={onOpenLogin}
                    className="text-[#0A4EE4] font-bold hover:underline"
                  >
                    Entrar no painel
                  </button>
                </p>
              </>
            ) : (
              /* Success Confirmation Card */
              <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 border border-emerald-500/40 shadow-2xl text-center space-y-5 animate-in fade-in duration-300">
                <div className="w-16 h-16 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                  <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-extrabold text-white">
                    Solicitação Registrada!
                  </h3>
                  <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                    Parabéns, {formData.preferredName || formData.fullName || 'Empreendedor'}! Suas informações foram salvas e formatadas para envio direto no WhatsApp.
                  </p>
                </div>

                {/* Message preview box */}
                <div className="space-y-1.5 text-left">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Mensagem Formatada Enviada:
                  </span>
                  <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-emerald-300/90 whitespace-pre-wrap max-h-40 overflow-y-auto leading-relaxed">
                    {formattedMessage}
                  </div>
                </div>

                <div className="space-y-2.5 pt-1">
                  {whatsappUrl && (
                    <a
                      href={whatsappUrl}
                      target="_self"
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm py-3.5 rounded-xl shadow-lg shadow-emerald-950/60 transition-all flex items-center justify-center gap-2"
                    >
                      <span>Abrir no WhatsApp Agora</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  )}

                  <button
                    onClick={onNavigateHome}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3 rounded-xl transition-colors text-xs"
                  >
                    Voltar ao site principal
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};
