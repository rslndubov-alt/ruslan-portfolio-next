'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLang } from '@/lib/i18n';
import LangSwitcher from './LangSwitcher';

export default function Navbar() {
  const pathname = usePathname();
  const { t } = useLang();

  const links = [
    { href: '/', key: 'nav_about' as const },
    { href: '/arts', key: 'nav_arts' as const },
    { href: '/video', key: 'nav_video' as const },
    { href: '/contact', key: 'nav_contact' as const },
  ];

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      <div className="flex justify-end px-8 pt-4">
        <LangSwitcher />
      </div>
      <nav className="flex justify-center px-5 pt-3">
        <div className="flex items-center bg-white/[0.07] border border-white/10 rounded-full px-2 py-1.5 gap-0.5">
          {links.map(({ href, key }) => (
            <Link
              key={href}
              href={href}
              className={`px-5 py-2 rounded-full text-sm font-normal transition-all duration-200 ${
                isActive(href)
                  ? 'bg-white/[0.12] text-white'
                  : 'text-white/50 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              {t(key)}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
