'use client';
import { useState, useRef, useEffect } from 'react';
import { useLang } from '@/lib/i18n';
import Image from 'next/image';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function AiChatWidget() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [greetingDismissed, setGreetingDismissed] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-greeting after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!open && !greetingDismissed) setShowGreeting(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, [open, greetingDismissed]);

  // Hide greeting when chat is opened
  useEffect(() => {
    if (open) setShowGreeting(false);
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: 'user', text: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      if (data.text) {
        setMessages(prev => [...prev, { role: 'model', text: data.text }]);
      } else {
        setMessages(prev => [...prev, { role: 'model', text: data.error || 'Error' }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: 'model', text: 'Connection error.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ── Auto-greeting bubble ── */}
      {showGreeting && !open && (
        <div 
          className="fixed bottom-28 right-4 z-50 max-w-[260px] animate-[slideUp_0.4s_ease-out]"
          style={{ animation: 'slideUp 0.4s ease-out' }}
        >
          <div className="relative bg-[#1a1a2e]/95 backdrop-blur-xl border border-purple-500/30 rounded-2xl rounded-br-sm px-4 py-3 shadow-[0_0_30px_rgba(139,92,246,0.15)]">
            <button 
              onClick={() => { setGreetingDismissed(true); setShowGreeting(false); }}
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-[10px] text-white/50 hover:text-white hover:bg-white/20 transition-all"
            >
              ✕
            </button>
            <p className="text-white/80 text-xs leading-relaxed">
              {t('agent_greeting')}
            </p>
            <button
              onClick={() => { setGreetingDismissed(true); setShowGreeting(false); setOpen(true); }}
              className="mt-2 w-full py-1.5 rounded-lg bg-gradient-to-r from-purple-600/40 to-blue-600/40 border border-purple-500/30 text-white/80 text-[11px] font-medium hover:from-purple-600/60 hover:to-blue-600/60 transition-all"
            >
              {t('agent_ask_button')}
            </button>
          </div>
        </div>
      )}

      {/* ── Floating Avatar Button with Neon Ring ── */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-5 right-5 z-50 group"
        aria-label="Open AI chat"
      >
        <div className="relative">
          {/* Neon pulsing ring */}
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 opacity-60 blur-sm animate-pulse group-hover:opacity-90 transition-opacity" />
          <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 opacity-80 group-hover:opacity-100 transition-opacity" />
          
          {/* Avatar image */}
          <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#0a0a0a]">
            {open ? (
              <div className="w-full h-full bg-[#1a1a2e] flex items-center justify-center text-white/80 text-xl">
                ✕
              </div>
            ) : (
              <Image
                src="/avatar-chat.jpg"
                alt="AI Agent"
                width={56}
                height={56}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Online indicator dot */}
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-green-400 border-2 border-[#0a0a0a] animate-pulse" />
        </div>
        
        {/* Label under avatar */}
        {!open && (
          <span className="block text-center mt-1 text-[9px] font-medium tracking-wider text-white/50 uppercase">
            AI Agent
          </span>
        )}
      </button>

      {/* ── Chat Panel ── */}
      {open && (
        <div 
          className="fixed bottom-[100px] right-5 z-50 w-[340px] md:w-[400px] bg-[#0d0d1a]/97 backdrop-blur-2xl border border-purple-500/20 rounded-2xl shadow-[0_8px_60px_rgba(139,92,246,0.12)] overflow-hidden flex flex-col"
          style={{ animation: 'slideUp 0.3s ease-out', maxHeight: 'calc(100vh - 140px)' }}
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-white/[0.06] flex items-center gap-3 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
            <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-purple-500/50 flex-shrink-0">
              <Image src="/avatar-chat.jpg" alt="" width={32} height={32} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white/90 text-sm font-medium">{t('agent_title')}</div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400/70 text-[10px]">Gemini 2.5 Flash</span>
              </div>
            </div>
            <button 
              onClick={() => setOpen(false)}
              className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/10 transition-all text-sm"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[360px] min-h-[120px]">
            {messages.length === 0 && (
              <div className="text-center mt-8">
                <div className="text-2xl mb-2">💬</div>
                <p className="text-white/25 text-xs">{t('agent_placeholder')}</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-gradient-to-r from-purple-600/30 to-blue-600/30 border border-purple-500/20 text-white/85'
                    : 'bg-white/[0.04] border border-white/[0.06] text-white/70'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/[0.04] border border-white/[0.06] px-4 py-2.5 rounded-2xl">
                  <span className="inline-flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400/50 animate-bounce [animation-delay:0ms]"/>
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400/50 animate-bounce [animation-delay:150ms]"/>
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/50 animate-bounce [animation-delay:300ms]"/>
                  </span>
                </div>
              </div>
            )}
            <div ref={bottomRef}/>
          </div>

          {/* Input */}
          <div className="p-3 border-t border-white/[0.06] flex gap-2 bg-[#0a0a15]/50">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
              placeholder={t('agent_placeholder')}
              className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-xs text-white/80 placeholder-white/20 outline-none focus:border-purple-500/40 transition-colors"
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-600/50 to-blue-600/50 border border-purple-500/30 flex items-center justify-center text-white/80 hover:from-purple-600/70 hover:to-blue-600/70 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ↑
            </button>
          </div>
        </div>
      )}

      {/* CSS animations */}
      <style jsx global>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
