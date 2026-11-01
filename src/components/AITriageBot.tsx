import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ChatMessage } from '../types.ts';
import { Sparkles, X, Send, Bot, User, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';

export const AITriageBot: React.FC = () => {
  const { language, simpleWords } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const initialMsg: ChatMessage = {
    id: '1',
    sender: 'bot',
    text:
      language === 'te'
        ? 'నమస్కారం! నేను విశాఖపట్నం ఎకోట్రయాజ్ AI సహాయకుడిని. రోడ్డు క్లియరెన్స్, క్యాంపులు లేదా అత్యవసర నంబర్ల కోసం నన్ను అడగండి.'
        : language === 'hi'
        ? 'नमस्ते! मैं विशाखापत्तनम इकोट्राइएज AI सहायक हूँ। सड़क की स्थिति, राहत शिविर या हेल्पलाइन नंबर पूछें।'
        : 'Hello! I am your EcoTriage Emergency AI Assistant for Visakhapatnam. Ask me about road clearance, nearby shelters, or helpline numbers.',
    timestamp: 'Just now',
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialMsg]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          language,
          simpleWords,
        }),
      });

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: data.reply || 'Emergency squads are actively responding across Visakhapatnam.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const botErr: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: 'Vizag Emergency Helpline: 1800-425-0001 (Control Room). Police: 100, Ambulance: 108.',
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, botErr]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    { en: 'Fallen tree on Beach Road?', te: 'బీచ్ రోడ్డులో పడిన చెట్టు?', hi: 'बीच रोड पर गिरा पेड़?' },
    { en: 'Where is nearest relief camp?', te: 'సమీప పునరావాస కేంద్రం ఎక్కడ ఉంది?', hi: 'निकटतम राहत शिविर कहाँ है?' },
    { en: 'What to do if live wire falls?', te: 'కరెంట్ తీగ పడితే ఏం చేయాలి?', hi: 'बिजली का तार गिरे तो क्या करें?' },
  ];

  return (
    <div className="fixed bottom-36 right-4 sm:bottom-6 sm:right-6 z-50">
      {/* Floating Round Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative w-14 h-14 rounded-full bg-gradient-to-r from-[#2457C5] to-[#1E40AF] text-white shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-white flex items-center justify-center cursor-pointer"
          aria-label="Open AI Triage Assistant"
          title="AI Triage Assistant"
        >
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-400 border border-white"></span>
          </span>
          <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
        </button>
      )}

      {/* Floating Chat Drawer */}
      {isOpen && (
        <div className="w-[92vw] max-w-[380px] h-[78vh] max-h-[520px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#101A3A] to-[#2457C5] text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                <Bot className="w-5 h-5 text-cyan-300" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm leading-tight">EcoTriage AI Bot</h3>
                  <span className="text-[10px] bg-cyan-500/30 text-cyan-200 border border-cyan-400/30 px-1.5 py-0.2 rounded font-mono">
                    LIVE
                  </span>
                </div>
                <p className="text-[11px] text-blue-100 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-green-300" /> Vizag Emergency Smart Assistant
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-full bg-[#2457C5] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-[#2457C5] text-white rounded-tr-xs font-medium'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span
                    className={`block text-[10px] mt-1 text-right ${
                      msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-slate-700 text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    U
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2 justify-start items-center">
                <div className="w-7 h-7 rounded-full bg-[#2457C5] text-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs px-3.5 py-2.5 text-xs text-slate-500 flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#2457C5]" />
                  <span>Analyzing emergency query...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 overflow-x-auto flex gap-1.5 scrollbar-none">
            {quickPrompts.map((qp, idx) => {
              const label = language === 'te' ? qp.te : language === 'hi' ? qp.hi : qp.en;
              return (
                <button
                  key={idx}
                  onClick={() => handleSend(label)}
                  className="shrink-0 text-[11px] font-semibold bg-blue-50 text-[#2457C5] hover:bg-blue-100 border border-blue-200 px-2.5 py-1 rounded-full transition-colors whitespace-nowrap"
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-200 flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                language === 'te'
                  ? 'మీ ప్రశ్న టైప్ చేయండి...'
                  : language === 'hi'
                  ? 'अपना सवाल यहाँ लिखें...'
                  : 'Type your emergency question...'
              }
              className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#2457C5]/30 focus:border-[#2457C5]"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="bg-[#2457C5] hover:bg-[#1E40AF] disabled:opacity-50 text-white p-2 rounded-xl transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
