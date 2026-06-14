import type { Metadata } from 'next';
import './globals.css';
import { I18nProvider } from '@/lib/i18n';
import Navbar from '@/components/Navbar';
import BeamsBackground from '@/components/BeamsBackground';
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
          <BeamsBackground />
          <div className="w-full max-w-[960px] mx-auto flex flex-col min-h-screen relative">
            <Navbar />
            <main className="w-full flex-1">{children}</main>
            <footer className="w-full text-center py-5 text-white/15 text-xs border-t border-white/[0.04] mt-10">
              © 2026 · Ruslan Dubov · AI. Art. Adaptogens.
            </footer>
          </div>
          <AiChatWidget />
        </I18nProvider>
      </body>
    </html>
  );
}
