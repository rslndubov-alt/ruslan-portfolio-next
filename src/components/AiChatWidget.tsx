'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLang } from '@/lib/i18n';
import { getAvatarUrl } from '@/lib/supabase';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface ChatAction {
  type: 'navigate' | 'brief' | 'paypal';
  path?: string;
  data?: Record<string, string>;
  product?: string;
  price?: number;
  label?: string;
}

export default function AiChatWidget() {
  const { t } = useLang();
  const router = useRouter();
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [greetingDismissed, setGreetingDismissed] = useState(false);
  const [pendingActions, setPendingActions] = useState<ChatAction[]>([]);
  const [briefSent, setBriefSent] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [avatarUrl, setAvatarUrl] = useState('/avatar-chat.jpg');

  // Load same avatar as hero
  useEffect(() => {
    getAvatarUrl().then(url => { if (url) setAvatarUrl(url); });
  }, []);

  // Listen for hero avatar click (homepage)
  useEffect(() => {
    const handler = () => setOpen(o => !o);
    window.addEventListener('toggle-ai-chat', handler);
    return () => window.removeEventListener('toggle-ai-chat', handler);
  }, []);

  // Auto-greeting after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!open && !greetingDismissed) setShowGreeting(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, [open, greetingDismissed]);

  useEffect(() => {
    if (open) setShowGreeting(false);
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, pendingActions]);

  // Handle actions from AI response
  const handleActions = (actions: ChatAction[]) => {
    const navAction = actions.find(a => a.type === 'navigate');
    if (navAction?.path) {
      router.push(navAction.path);
    }
    // Store brief/paypal actions for button rendering
    const interactiveActions = actions.filter(a => a.type === 'brief' || a.type === 'paypal');
    if (interactiveActions.length > 0) {
      setPendingActions(interactiveActions);
    }
  };

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: 'user', text: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setPendingActions([]);
    setBriefSent(false);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      if (data.text) {
        setMessages(prev => [...prev, { role: 'model', text: data.text }]);
        if (data.actions?.length) handleActions(data.actions);
      } else {
        setMessages(prev => [...prev, { role: 'model', text: data.error || 'Error' }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: 'model', text: 'Connection error.' }]);
    } finally {
      setLoading(false);
    }
  };

  const sendBrief = async (briefData: Record<string, string>) => {
    try {
      const res = await fetch('/api/send-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: briefData }),
      });
      if (res.ok) {
        setBriefSent(true);
        setMessages(prev => [...prev, { role: 'model', text: t('brief_sent_success') }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: 'model', text: 'Failed to send brief.' }]);
    }
  };

  const PAYPAL_ME = 'https://paypal.me/rslndubov';

  return (
    <>
      {/* ── Auto-greeting bubble ── */}
      {showGreeting && !open && (
        <div className="fixed bottom-28 right-4 z-50 max-w-[260px]" style={{ animation: 'slideUp 0.4s ease-out' }}>
          <div className="relative bg-[#1a1a2e]/95 backdrop-blur-xl border border-purple-500/30 rounded-2xl rounded-br-sm px-4 py-3 shadow-[0_0_30px_rgba(139,92,246,0.15)]">
            <button 
              onClick={() => { setGreetingDismissed(true); setShowGreeting(false); }}
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-[10px] text-white/50 hover:text-white hover:bg-white/20 transition-all"
            >✕</button>
            <p className="text-white/80 text-xs leading-relaxed">{t('agent_greeting')}</p>
            <button
              onClick={() => { setGreetingDismissed(true); setShowGreeting(false); setOpen(true); }}
              className="mt-2 w-full py-1.5 rounded-lg bg-gradient-to-r from-purple-600/40 to-blue-600/40 border border-purple-500/30 text-white/80 text-[11px] font-medium hover:from-purple-600/60 hover:to-blue-600/60 transition-all"
            >{t('agent_ask_button')}</button>
          </div>
        </div>
      )}

      {/* Floating button removed — hero avatar is the chat trigger on all pages */}

      {/* ── Chat Panel ── */}
      {open && (
        <div 
          className="fixed bottom-[100px] right-5 z-50 w-[340px] md:w-[400px] bg-[#0d0d1a]/97 backdrop-blur-2xl border border-purple-500/20 rounded-2xl shadow-[0_8px_60px_rgba(139,92,246,0.12)] overflow-hidden flex flex-col"
          style={{ animation: 'slideUp 0.3s ease-out', maxHeight: 'calc(100vh - 140px)' }}
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-white/[0.06] flex items-center gap-3 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
            <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-purple-500/50 flex-shrink-0">
              <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
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
            >✕</button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[360px] min-h-[120px]">
            {messages.length === 0 && (
              <div className="text-center mt-6 space-y-3">
                <div className="text-2xl mb-1">💬</div>
                <p className="text-white/25 text-xs">{t('agent_placeholder')}</p>
                {/* Quick action chips */}
                <div className="flex flex-wrap gap-1.5 justify-center mt-3">
                  {[
                    { emoji: '🎨', label: t('nav_arts'), action: () => { setInput(t('agent_chip_arts')); } },
                    { emoji: '🎬', label: t('nav_video'), action: () => { setInput(t('agent_chip_video')); } },
                    { emoji: '📋', label: t('agent_chip_order'), action: () => { setInput(t('agent_chip_order')); } },
                  ].map((chip, i) => (
                    <button key={i} onClick={chip.action} className="px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-white/40 text-[10px] hover:bg-purple-600/20 hover:border-purple-500/30 hover:text-white/70 transition-all">
                      {chip.emoji} {chip.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-gradient-to-r from-purple-600/30 to-blue-600/30 border border-purple-500/20 text-white/85'
                    : 'bg-white/[0.04] border border-white/[0.06] text-white/70'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}

            {/* Action buttons (PayPal, Brief) */}
            {!loading && pendingActions.length > 0 && (
              <div className="space-y-2 mt-2">
                {pendingActions.map((action, i) => {
                  if (action.type === 'paypal') {
                    return (
                      <a key={i} href={`${PAYPAL_ME}/${action.price || ''}`} target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-[#0070ba]/80 to-[#003087]/80 border border-[#0070ba]/40 text-white text-xs font-medium hover:from-[#0070ba] hover:to-[#003087] transition-all shadow-lg"
                      >
                        💳 {action.label || `Buy — $${action.price}`}
                      </a>
                    );
                  }
                  if (action.type === 'brief' && !briefSent) {
                    return (
                      <button key={i} onClick={() => sendBrief(action.data || {})}
                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600/60 to-blue-600/60 border border-purple-500/30 text-white text-xs font-medium hover:from-purple-600/80 hover:to-blue-600/80 transition-all"
                      >
                        📩 {t('agent_send_brief')}
                      </button>
                    );
                  }
                  return null;
                })}
                {/* Donate button — always show with paypal */}
                {pendingActions.some(a => a.type === 'paypal') && (
                  <a href={PAYPAL_ME} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/50 text-[10px] hover:bg-white/[0.08] hover:text-white/70 transition-all"
                  >
                    ☕ {t('agent_donate')}
                  </a>
                )}
              </div>
            )}

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
            >↑</button>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
