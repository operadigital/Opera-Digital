import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Bot, CheckCheck, Sparkles, MessageSquare, ArrowRight, PhoneCall, RefreshCw, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getStoredWhatsAppNumber } from '../utils/whatsapp';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
  action?: 'send_menu' | 'send_quote_form' | 'human_transfer' | 'send_catalog' | 'none';
}

interface WhatsAppBotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenQuoteModal?: () => void;
}

export const WhatsAppBotModal: React.FC<WhatsAppBotModalProps> = ({
  isOpen,
  onClose,
  onOpenQuoteModal
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'bot',
      text: '🤖 *Atendimento Automatizado - Opera Digital*\n\nOlá! Sou o assistente virtual da Opera Digital. Como posso te ajudar a acelerar o crescimento da sua empresa hoje?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      action: 'send_menu'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/whatsapp/auto-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });

      const data = await res.json();
      
      setTimeout(() => {
        setIsTyping(false);
        const botMsg: Message = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: data.reply || 'Recebemos sua mensagem com sucesso! Em breve um de nossos especialistas entrará em contato.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          action: data.action
        };
        setMessages((prev) => [...prev, botMsg]);
      }, 700);

    } catch (err) {
      setTimeout(() => {
        setIsTyping(false);
        const botMsg: Message = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: 'Com certeza! Posso te encaminhar para o formulário de orçamento ou conectar diretamente com nosso WhatsApp comercial.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          action: 'send_quote_form'
        };
        setMessages((prev) => [...prev, botMsg]);
      }, 700);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'msg-1',
        sender: 'bot',
        text: '🤖 *Atendimento Automatizado - Opera Digital*\n\nOlá! Sou o assistente virtual da Opera Digital. Como posso te ajudar a acelerar o crescimento da sua empresa hoje?',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action: 'send_menu'
      }
    ]);
  };

  const quickChips = [
    '💡 Solicitar Orçamento',
    '🚀 Nossos Serviços',
    '🕒 Horários de Atendimento',
    '👤 Falar com Atendente Humano'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[620px] max-h-[90vh]"
      >
        {/* WhatsApp Header */}
        <div className="bg-slate-950 px-4 py-3.5 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold">
                <Bot className="w-5 h-5" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>Opera Digital</span>
                <span className="bg-emerald-950 text-emerald-400 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-800/60">
                  Bot Business
                </span>
              </h3>
              <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Atendimento Automático 24/7</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetChat}
              title="Reiniciar Simulação"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Info Bar */}
        <div className="bg-emerald-950/40 px-4 py-2 border-b border-emerald-900/30 flex items-center justify-between text-xs text-emerald-300">
          <span className="flex items-center gap-1.5 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Simulador do Robô de WhatsApp em tempo real</span>
          </span>
          <a
            href={`https://wa.me/${getStoredWhatsAppNumber()}?text=${encodeURIComponent('Olá! Estava testando a automação no site e gostaria de conversar no WhatsApp.')}`}
            target="_blank"
            rel="noreferrer"
            className="text-[11px] font-bold text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>Ir para WhatsApp</span>
            <ArrowRight className="w-3 h-3" />
          </a>
        </div>

        {/* Message Container */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-950/60">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-md whitespace-pre-wrap ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-slate-800 border border-slate-700/80 text-slate-100 rounded-bl-none'
                }`}
              >
                {msg.text}

                {/* Optional Action Card attached to Bot Message */}
                {msg.sender === 'bot' && msg.action === 'send_quote_form' && onOpenQuoteModal && (
                  <div className="mt-3 pt-2.5 border-t border-slate-700/80">
                    <button
                      onClick={() => {
                        onClose();
                        onOpenQuoteModal();
                      }}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Abrir Formulário de Orçamento</span>
                    </button>
                  </div>
                )}

                {msg.sender === 'bot' && msg.action === 'human_transfer' && (
                  <div className="mt-3 pt-2.5 border-t border-slate-700/80">
                    <a
                      href={`https://wa.me/${getStoredWhatsAppNumber()}?text=${encodeURIComponent('Olá! Solicitei atendimento humano através do site da Opera Digital.')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm text-center block"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Iniciar Conversa com Atendente Humano</span>
                    </a>
                  </div>
                )}

                <div className={`text-[10px] mt-1.5 text-right flex items-center justify-end gap-1 ${
                  msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400'
                }`}>
                  <span>{msg.time}</span>
                  {msg.sender === 'user' && <CheckCheck className="w-3 h-3 text-blue-200" />}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-slate-800/80 px-3 py-2 rounded-2xl w-fit border border-slate-700">
              <Bot className="w-4 h-4 animate-bounce" />
              <span>Opera Bot está digitando...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 py-2 bg-slate-900 border-t border-slate-800 flex gap-2 overflow-x-auto no-scrollbar">
          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(chip.replace(/^[^\w\s]+/, '').trim())}
              className="text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-full border border-slate-700/80 whitespace-nowrap shrink-0 transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Digite sua dúvida ou comando (ex: Orçamento)..."
              className="flex-1 bg-slate-900 border border-slate-800 text-white text-xs px-4 py-3 rounded-2xl focus:outline-none focus:border-emerald-500 placeholder-slate-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white p-3 rounded-2xl transition-all shadow-md shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
