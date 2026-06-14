'use client';
import { useState } from 'react';
import { useLang } from '@/lib/i18n';
import Hero from '@/components/Hero';

const socials = [
  { platform: 'YouTube', handle: '@ruslandubov5532', href: 'https://www.youtube.com/@ruslandubov5532', icon: '▶' },
  { platform: 'TikTok', handle: '@ruslan.dubov', href: 'https://www.tiktok.com/@ruslan.dubov', icon: '♪' },
  { platform: 'Instagram', handle: '@ruslan.dubov', href: 'https://www.instagram.com/ruslan.dubov', icon: '◎' },
  { platform: 'Facebook', handle: 'rslndubov', href: 'https://www.facebook.com/rslndubov', icon: 'f' },
  { platform: 'Telegram', handle: '@Dubovruslan', href: 'https://t.me/Dubovruslan', icon: '✈' },
  { platform: 'Email', handle: 'rslndubov@gmail.com', href: 'mailto:rslndubov@gmail.com', icon: '✉' },
];

export default function ContactPage() {
  const { t } = useLang();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) { setStatus('sent'); setForm({ name: '', email: '', message: '' }); }
      else setStatus('error');
    } catch { setStatus('error'); }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px', padding: '12px 16px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)',
    outline: 'none', fontFamily: 'inherit',
  };

  return (
    <div style={{ paddingTop: '28px' }}>
      <Hero />

      <section style={{ marginTop: '32px', paddingBottom: '48px' }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.6rem', fontStyle: 'italic', fontWeight: 600, color: 'rgba(255,255,255,0.45)', marginBottom: '24px', letterSpacing: '0.5px', textAlign: 'center' }}>
          {t('contact_title')}
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          {/* Social cards */}
          <div>
            <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '2px', color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase', marginBottom: '14px' }}>Social Media</p>
            <div style={{ display: 'grid', gap: '8px' }}>
              {socials.map(s => (
                <a key={s.platform} href={s.href} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', background: '#141414', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', transition: 'all 0.2s' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>{s.icon}</div>
                  <div>
                    <div style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(255,255,255,0.25)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>{s.platform}</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 500, color: 'rgba(255,255,255,0.65)' }}>{s.handle}</div>
                  </div>
                  <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.15)' }}>→</span>
                </a>
              ))}
            </div>
          </div>

          {/* Email form */}
          <div>
            <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '2px', color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase', marginBottom: '14px' }}>Send Message</p>
            <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder={t('contact_name')} style={inputStyle} />
              <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder={t('contact_email')} style={inputStyle} />
              <textarea required rows={4} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder={t('contact_msg')} style={{ ...inputStyle, resize: 'none' }} />
              <button type="submit" disabled={status === 'sending'}
                style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.85rem', fontWeight: 500, color: 'rgba(255,255,255,0.7)', cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit' }}>
                {status === 'sending' ? '...' : status === 'sent' ? t('contact_sent') : t('contact_send')}
              </button>
              {status === 'error' && <p style={{ color: 'rgba(248,113,113,0.7)', fontSize: '0.75rem', textAlign: 'center' }}>{t('contact_error')}</p>}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
