import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, Send, Sparkles, Bot, Phone, User, Building2, 
  Search, Check, CheckCheck, Clock, RefreshCw, Paperclip, Zap,
  ExternalLink, Filter, Plus, ArrowRight, Shield, AlertCircle
} from 'lucide-react';
import { CrmLead, WhatsAppChatMessage, CrmStage } from '../types';
import { STAGES, PRIORITIES } from './CrmSystem';

interface WhatsAppChatInboxProps {
  leads: CrmLead[];
  onUpdateLead: (updatedLead: CrmLead) => void;
}

export const WhatsAppChatInbox: React.FC<WhatsAppChatInboxProps> = ({
  leads,
  onUpdateLead
}) => {
  const [selectedLeadId, setSelectedLeadId] = useState<string>(leads[0]?.id || '');
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [isSimulatingClient, setIsSimulatingClient] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Selected lead
  const activeLead = leads.find((l) => l.id === selectedLeadId) || leads[0];

  // Get active chat messages or fallback defaults
  const activeMessages: WhatsAppChatMessage[] = activeLead?.chatMessages || [
    {
      id: `msg-def-1`,
      sender: 'client',
      text: activeLead?.projectDescription || `Olá! Gostaria de saber mais sobre ${activeLead?.projectType || 'criação de sites e automação'}.`,
      timestamp: activeLead?.createdAt || new Date().toISOString(),
      status: 'read'
    }
  ];

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeLead?.id, activeMessages.length]);

  // Handle Send Message as Agent
  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || messageInput.trim();
    if (!activeLead || !text) return;

    const newMsg: WhatsAppChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'agent',
      text,
      timestamp: new Date().toISOString(),
      status: 'delivered'
    };

    const updatedMessages = [...(activeLead.chatMessages || activeMessages), newMsg];
    const updatedLead: CrmLead = {
      ...activeLead,
      chatMessages: updatedMessages,
      lastContactDate: new Date().toISOString(),
      activities: [
        {
          id: `act-${Date.now()}`,
          type: 'whatsapp',
          description: `Resposta enviada via WhatsApp CRM: "${text.substring(0, 50)}..."`,
          createdAt: new Date().toISOString(),
          author: 'Atendente Opera Digital'
        },
        ...(activeLead.activities || [])
      ]
    };

    onUpdateLead(updatedLead);
    if (!textToSend) setMessageInput('');

    // Sync with backend API
    try {
      await fetch('/api/whatsapp/chats/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: activeLead.id,
          text,
          sender: 'agent'
        })
      });
    } catch (err) {
      console.warn('Backend sync failed, updated locally:', err);
    }
  };

  // AI Copilot response generator
  const handleGenerateAiReply = async () => {
    if (!activeLead) return;
    setIsGeneratingAi(true);

    try {
      const historyStr = activeMessages.slice(-5).map((m) => `${m.sender === 'client' ? 'Cliente' : 'Atendente'}: ${m.text}`).join('\n');
      const res = await fetch('/api/whatsapp/generate-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: activeLead.fullName,
          projectType: activeLead.projectType,
          conversationHistory: historyStr
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          setMessageInput(data.reply);
        }
      }
    } catch (err) {
      console.error('Error generating AI reply:', err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Simulate incoming WhatsApp message from client (For live testing)
  const handleSimulateClientMessage = async () => {
    if (!activeLead) return;
    setIsSimulatingClient(true);

    const clientPrompts = [
      'Qual o prazo de entrega para esse site?',
      'Vocês conseguem integrar o WhatsApp diretamente com o sistema de vendas?',
      'Qual a diferença entre o plano mensal e a licença vitalícia?',
      'Aceitam pagamento em até 12x no cartão?',
      'Consegue me enviar alguns exemplos de projetos já realizados?'
    ];
    const randomMsg = clientPrompts[Math.floor(Math.random() * clientPrompts.length)];

    setTimeout(() => {
      const newMsg: WhatsAppChatMessage = {
        id: `msg-sim-${Date.now()}`,
        sender: 'client',
        text: randomMsg,
        timestamp: new Date().toISOString(),
        status: 'read'
      };

      const updatedLead: CrmLead = {
        ...activeLead,
        chatMessages: [...(activeLead.chatMessages || activeMessages), newMsg],
        lastContactDate: new Date().toISOString()
      };

      onUpdateLead(updatedLead);
      setIsSimulatingClient(false);
    }, 600);
  };

  // Quick Reply Templates
  const quickTemplates = [
    { label: '👋 Boas-vindas', text: `Olá ${activeLead?.fullName || ''}! Como posso ajudar com o seu projeto hoje?` },
    { label: '📅 Agendar Reunião', text: `Excelente! Podemos agendar uma reunião rápida de 15 minutos para entender seus requisitos e alinhar os detalhes?` },
    { label: '📄 Enviar Orçamento', text: `Preparei a proposta comercial detalhada para o seu projeto. Posso enviar o documento por aqui?` },
    { label: '💳 Opções de Pagamento', text: `Oferecemos pagamento facilitado via PIX com desconto ou em até 12x no cartão de crédito.` }
  ];

  // Filtered contacts
  const filteredLeads = leads.filter((l) => {
    const query = searchQuery.toLowerCase();
    return l.fullName.toLowerCase().includes(query) ||
      l.phone.includes(query) ||
      (l.companyName && l.companyName.toLowerCase().includes(query));
  });

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12 min-h-[680px]">
      
      {/* LEFT SIDEBAR: CONVERSATIONS LIST */}
      <div className="lg:col-span-4 border-r border-slate-800 flex flex-col bg-slate-950/90">
        
        {/* Inbox Header */}
        <div className="p-4 border-b border-slate-800 space-y-3 bg-slate-900/60">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Inbox WhatsApp CRM</span>
            </h3>
            <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
              {leads.length} Atendimentos
            </span>
          </div>

          {/* Search Contacts */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar conversa por nome ou telefone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-white text-xs pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 max-h-[580px]">
          {filteredLeads.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-xs">
              Nenhuma conversa encontrada.
            </div>
          ) : (
            filteredLeads.map((lead) => {
              const isSelected = lead.id === activeLead?.id;
              const msgs = lead.chatMessages || [];
              const lastMsg = msgs[msgs.length - 1];

              return (
                <div
                  key={lead.id}
                  onClick={() => setSelectedLeadId(lead.id)}
                  className={`p-3.5 cursor-pointer transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'bg-emerald-950/20 border-l-4 border-l-emerald-500 bg-slate-900/80'
                      : 'hover:bg-slate-900/40'
                  }`}
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white text-xs shrink-0 relative">
                    {lead.fullName.substring(0, 2).toUpperCase()}
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute bottom-0 right-0 ring-2 ring-slate-950" />
                  </div>

                  {/* Info Preview */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-bold text-white truncate">{lead.fullName}</h4>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {lastMsg ? new Date(lastMsg.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>

                    {lead.companyName && (
                      <div className="text-[10px] text-slate-400 truncate flex items-center gap-1">
                        <Building2 className="w-2.5 h-2.5 text-slate-500" />
                        <span>{lead.companyName}</span>
                      </div>
                    )}

                    <p className="text-[11px] text-slate-400 truncate mt-1">
                      {lastMsg ? (
                        <span>
                          {lastMsg.sender === 'agent' && <span className="text-emerald-400 font-bold">Você: </span>}
                          {lastMsg.text}
                        </span>
                      ) : (
                        <span className="italic text-slate-500">Iniciar atendimento...</span>
                      )}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-900/80 border-t border-slate-800 text-[10px] text-slate-400 text-center flex items-center justify-between">
          <span className="flex items-center gap-1 text-emerald-400 font-bold">
            <Shield className="w-3 h-3" />
            WhatsApp Web Automation Ready
          </span>
          <button
            type="button"
            onClick={handleSimulateClientMessage}
            disabled={isSimulatingClient}
            className="text-xs text-indigo-400 hover:underline font-bold flex items-center gap-1"
            title="Simular mensagem recebida de cliente para testes"
          >
            <Zap className="w-3 h-3 text-indigo-400" />
            <span>Simular Mensagem</span>
          </button>
        </div>

      </div>

      {/* RIGHT CHAT CONSOLE: LIVE CONVERSATION & REPLY ENGINE */}
      <div className="lg:col-span-8 flex flex-col bg-slate-950">
        
        {activeLead ? (
          <>
            {/* Chat Top Header */}
            <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-extrabold text-sm">
                  {activeLead.fullName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <span>{activeLead.fullName}</span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 font-bold px-2 py-0.5 rounded-full">
                      Online no WhatsApp
                    </span>
                  </h3>
                  <div className="text-xs text-slate-400 flex items-center gap-3 mt-0.5">
                    <span className="font-mono text-emerald-400 font-bold">{activeLead.phone}</span>
                    {activeLead.companyName && <span>• {activeLead.companyName}</span>}
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center gap-2">
                {/* Stage selector */}
                <select
                  value={activeLead.stage || activeLead.status || 'novo'}
                  onChange={(e) => {
                    const newStage = e.target.value as CrmStage;
                    onUpdateLead({ ...activeLead, stage: newStage, status: newStage });
                  }}
                  className="bg-slate-950 border border-slate-800 text-slate-200 text-xs p-2 rounded-xl focus:outline-none"
                >
                  {STAGES.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>

                {/* Direct External WhatsApp Web Link */}
                <a
                  href={`https://wa.me/${activeLead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá ${activeLead.fullName}! Aqui é da Opera Digital...`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5"
                  title="Abrir no aplicativo oficial WhatsApp Web"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">WhatsApp Web</span>
                </a>
              </div>
            </div>

            {/* Conversation Stream */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] max-h-[480px]">
              
              <div className="text-center my-2">
                <span className="bg-slate-900 border border-slate-800 text-slate-400 text-[10px] px-3 py-1 rounded-full font-mono">
                  🔒 Conversa sincronizada via Opera Digital WhatsApp API
                </span>
              </div>

              {activeMessages.map((msg) => {
                const isClient = msg.sender === 'client';

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isClient ? 'items-start' : 'items-end'}`}
                  >
                    <div
                      className={`max-w-[80%] sm:max-w-[70%] rounded-2xl p-3.5 text-xs shadow-lg space-y-1 ${
                        isClient
                          ? 'bg-slate-900 border border-slate-800 text-slate-100 rounded-tl-none'
                          : 'bg-emerald-900/80 border border-emerald-700/60 text-emerald-50 rounded-tr-none'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 text-[10px] text-slate-400 mb-1">
                        <span className="font-bold text-slate-300">
                          {isClient ? activeLead.fullName : 'Atendente Opera Digital'}
                        </span>
                        <span className="font-mono text-[9px]">
                          {new Date(msg.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <p className="whitespace-pre-wrap leading-relaxed">
                        {msg.text}
                      </p>

                      {!isClient && (
                        <div className="flex items-center justify-end gap-1 text-[10px] text-emerald-300/80 pt-1">
                          <CheckCheck className="w-3 h-3" />
                          <span>Entregue</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Templates Bar */}
            <div className="p-2 bg-slate-900/60 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-xs">
              <span className="text-[10px] text-slate-500 font-bold uppercase shrink-0 pl-2">
                Templates:
              </span>
              {quickTemplates.map((tmpl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setMessageInput(tmpl.text)}
                  className="bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors shrink-0"
                >
                  {tmpl.label}
                </button>
              ))}
            </div>

            {/* Message Input & AI Copilot Controls */}
            <div className="p-4 border-t border-slate-800 bg-slate-900 space-y-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                {/* AI Copilot Button */}
                <button
                  type="button"
                  onClick={handleGenerateAiReply}
                  disabled={isGeneratingAi}
                  className="bg-purple-950 hover:bg-purple-900 border border-purple-500/40 text-purple-300 px-3 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shrink-0"
                  title="Gerar resposta inteligente usando Gemini AI"
                >
                  <Sparkles className={`w-4 h-4 text-purple-400 ${isGeneratingAi ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">IA Copilot</span>
                </button>

                {/* Text Area Input */}
                <input
                  type="text"
                  placeholder={`Responder para ${activeLead.fullName} via WhatsApp...`}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 text-white text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-emerald-500"
                />

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={!messageInput.trim()}
                  className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-extrabold px-4 py-3 rounded-xl shadow-lg transition-all flex items-center gap-1.5 shrink-0"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar</span>
                </button>
              </form>

              <div className="flex items-center justify-between text-[10px] text-slate-500 px-1">
                <span>Pressione Enter para enviar no chat do CRM</span>
                <span className="text-emerald-400 font-semibold">
                  Atendimento atendido e sincronizado em tempo real
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8 text-slate-500 text-xs">
            Selecione uma conversa ao lado para iniciar o atendimento.
          </div>
        )}

      </div>

    </div>
  );
};
