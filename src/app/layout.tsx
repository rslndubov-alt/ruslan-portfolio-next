import type { Metadata } from 'next';
import './globals.css';
import { I18nProvider } from '@/lib/i18n';
import Navbar from '@/components/Navbar';
import BgOrnament from '@/components/BgOrnament';
import AiChatWidget from '@/components/AiChatWidget';
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: 'Ruslan Dubov — AI Content Creator',
  description: 'Portfolio of Ruslan Dubov — AI, visual art, and mindful living. Midjourney, ChatGPT, Suno.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body>
        <I18nProvider>
          <BgOrnament />
          <Navbar />
          <main>{children}</main>
          <footer className="text-center py-5 text-white/15 text-xs border-t border-white/[0.04] mt-10">
            © 2026 · Ruslan Dubov · AI. Art. Adaptogens.
          </footer>
          <AiChatWidget />
        </I18nProvider>
      </body>
    </html>
  );
}
