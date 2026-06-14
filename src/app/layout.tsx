import type { Metadata } from 'next';
import './globals.css';
import { I18nProvider } from '@/lib/i18n';
import Navbar from '@/components/Navbar';
import BeamsBackground from '@/components/BeamsBackground';
import AiChatWidget from '@/components/AiChatWidget';

export const metadata: Metadata = {
  title: 'Ruslan Dubov — AI Content Creator',
  description: 'Portfolio of Ruslan Dubov — AI, visual art, and mindful living. Midjourney, ChatGPT, Suno.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <I18nProvider>
          <BeamsBackground />
          <div className="site-container">
            <Navbar />
            <main style={{ flex: 1 }}>{children}</main>
            <footer style={{ textAlign: 'center', padding: '20px 0', color: 'rgba(255,255,255,0.15)', fontSize: '0.7rem', borderTop: '1px solid rgba(255,255,255,0.04)', letterSpacing: '0.3px', marginTop: '40px' }}>
              © 2026 · Ruslan Dubov · AI. Art. Adaptogens.
            </footer>
          </div>
          <AiChatWidget />
        </I18nProvider>
      </body>
    </html>
  );
}
