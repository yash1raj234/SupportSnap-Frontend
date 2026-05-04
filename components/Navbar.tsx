'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/demo', label: 'Demo' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(245,241,232,0.92)',
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(10,10,10,0.08)',
      padding: '0 5vw', height: 64,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <Link href="/" style={{
        fontFamily: 'var(--font-syne), sans-serif', fontWeight: 800, fontSize: 18,
        letterSpacing: '-0.5px', color: '#0A0A0A', textDecoration: 'none',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{ width: 8, height: 8, background: '#0A0A0A', borderRadius: '50%', display: 'inline-block' }} />
        SupportSnap
      </Link>

      <ul style={{ display: 'flex', alignItems: 'center', gap: 36, listStyle: 'none', margin: 0, padding: 0 }}>
        {navLinks.map(({ href, label }) => (
          <li key={href} style={{ display: 'flex' }}>
            <Link href={href} style={{
              fontSize: 14,
              fontWeight: pathname === href ? 600 : 400,
              color: pathname === href ? '#0A0A0A' : '#5A5A5A',
              textDecoration: 'none', transition: 'color 0.2s',
            }}>
              {label}
            </Link>
          </li>
        ))}
        <li>
          <Link href="/dashboard/new" style={{
            background: '#0A0A0A', color: '#fff',
            padding: '10px 22px', borderRadius: 100,
            fontSize: 13, fontWeight: 500,
            display: 'inline-flex', alignItems: 'center', gap: 8,
            textDecoration: 'none',
          }}>
            Try Free
            <span style={{
              width: 20, height: 20, background: '#fff', borderRadius: '50%',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              color: '#0A0A0A', fontSize: 11,
            }}>↗</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
