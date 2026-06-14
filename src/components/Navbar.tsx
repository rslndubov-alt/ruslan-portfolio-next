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
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '16px' }}>
        <LangSwitcher />
      </div>
      <nav style={{ display: 'flex', justifyContent: 'center', paddingTop: '12px' }}>
        <div className="nav-pill">
          {links.map(({ href, key }) => (
            <Link
              key={href}
              href={href}
              className={isActive(href) ? 'active' : ''}
            >
              {t(key)}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
