'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ background: '#0A0A0A', borderTop: '1px solid #1a1a1a', padding: '60px 5vw 32px' }}>
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80,
        marginBottom: 48, paddingBottom: 48, borderBottom: '1px solid #1a1a1a',
      }}>
        <div>
          <h2 style={{
            fontFamily: "'Syne', sans-serif", fontSize: 'clamp(28px, 3vw, 44px)',
            fontWeight: 800, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: 10,
          }}>Don&apos;t miss out</h2>
          <p style={{ fontSize: 13, color: '#666', marginBottom: 28, fontWeight: 300 }}>
            Get instant AI support for your SaaS — no credit card required.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {['Website URL', 'Email address', 'Company name', 'Team size'].map(p => (
              <input key={p} placeholder={p} style={{
                background: '#111', border: '1.5px solid #222', borderRadius: 10,
                padding: '12px 14px', fontSize: 13, color: '#fff',
                fontFamily: 'inherit', outline: 'none', width: '100%',
              }} />
            ))}
            <button style={{
              gridColumn: '1 / -1', background: '#fff', color: '#0A0A0A',
              fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 700,
              padding: 14, borderRadius: 10, border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              Start Free Trial
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M11 3L3 11M11 3H5M11 3V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
          {[
            { title: 'Company', links: ['About', 'Pricing', 'Blog', 'Careers'] },
            { title: 'Customer Service', links: ['Help center', 'FAQ', 'Contact', 'Documentation'] },
            { title: 'Why SupportSnap', links: ['No coding required', 'Instant deployment', 'Powered by AI', '24/7 availability'] },
          ].map(col => (
            <div key={col.title}>
              <div style={{
                fontFamily: "'Syne', sans-serif", fontSize: 10, fontWeight: 700,
                color: '#fff', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16,
              }}>{col.title}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 9 }}>
                {col.links.map(link => (
                  <li key={link}>
                    <Link href="#" style={{ fontSize: 12, color: '#555', textDecoration: 'none', fontWeight: 300 }}>{link}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ fontSize: 11, color: '#333' }}>© 2026 SupportSnap. Powered by AI.</span>
        <div style={{ display: 'flex', gap: 10 }}>
          {[
            <svg key="x" width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M10.6 2H12.4L8.4 6.4L12.8 12H9.4L6.6 8.4L3.4 12H1.6L5.8 7.3L1.6 2H5l2.6 3.3L10.6 2ZM10 11h1L4 3H3L10 11Z" fill="#444"/></svg>,
            <svg key="li" width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1.5" y="4.5" width="2.5" height="7" rx="0.5" fill="#444"/><circle cx="2.75" cy="2.5" r="1.25" fill="#444"/><path d="M6 4.5h2.5A2.5 2.5 0 0111 7v5H8.5V7.5a1 1 0 00-1-1H6V4.5Z" fill="#444"/></svg>,
          ].map((icon, i) => (
            <a key={i} href="#" style={{
              width: 32, height: 32, background: '#111', border: '1px solid #222',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              textDecoration: 'none',
            }}>{icon}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}
