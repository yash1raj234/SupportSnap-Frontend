'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function LandingPage() {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = marqueeRef.current;
    if (!el) return;
    let pos = 0;
    const speed = 0.5;
    let rafId: number;
    const animate = () => {
      pos -= speed;
      if (pos <= -(el.scrollWidth / 2)) pos = 0;
      el.style.transform = `translateX(${pos}px)`;
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div style={{ background: '#F5F1E8', minHeight: '100vh', fontFamily: "var(--font-dm-sans), sans-serif" }}>
      <style>{`
        .btn-explore:hover { background: #333 !important; transform: scale(1.02); }
        .btn-outline-white:hover { border-color: #666 !important; background: rgba(255,255,255,0.05) !important; }
        .case-card:hover { transform: translateY(-4px); box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
        .feature-card:hover { transform: translateY(-3px); box-shadow: 0 16px 48px rgba(0,0,0,0.08); }
        @keyframes statusPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
        @keyframes marqueeSpin {}
        @media(max-width:900px){.case-grid{grid-template-columns:1fr 1fr !important}.features-grid{grid-template-columns:1fr 1fr !important}}
        @media(max-width:600px){.case-grid{grid-template-columns:1fr !important}.features-grid{grid-template-columns:1fr !important}.hero-bottom-row{flex-direction:column !important}.nav-links-list{display:none !important}}
      `}</style>

      <Navbar />

      {/* Hero */}
      <section style={{ padding: '100px 5vw 80px', background: '#F5F1E8' }}>
        <h1 style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: 'clamp(70px, 15vw, 190px)', fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 0.9, color: '#0A0A0A', margin: 0 }}>
          SupportSnap
        </h1>
        <div className="hero-bottom-row" style={{ display: 'flex', alignItems: 'flex-end', gap: 40, marginTop: 40, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <p style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: 'clamp(18px, 2.5vw, 28px)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.2, color: '#0A0A0A', marginBottom: 16 }}>
              Turn your website into<br />an AI support agent
            </p>
            <p style={{ fontSize: 15, color: '#5A5A5A', fontWeight: 300, lineHeight: 1.65, maxWidth: 380, marginBottom: 32 }}>
              Our mission is to help SaaS teams deliver instant, accurate support using AI that knows your product inside-out. No setup, no training, just paste your URL.
            </p>
            <Link href="/demo" className="btn-explore" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#0A0A0A', color: '#fff', borderRadius: 100, padding: '13px 28px', fontSize: 14, fontWeight: 500, textDecoration: 'none', transition: 'background 0.15s, transform 0.15s' }}>
              explore
              <span style={{ width: 22, height: 22, background: '#fff', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#0A0A0A', fontSize: 11 }}>↗</span>
            </Link>
          </div>
          <div style={{ flex: 1, minWidth: 300, position: 'relative' }}>
            <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #E8E4DB', boxShadow: '0 24px 60px rgba(0,0,0,0.1)', overflow: 'hidden', maxWidth: 420 }}>
              <div style={{ background: '#0A0A0A', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, background: '#222', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>⚡</div>
                <div>
                  <div style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: 13, fontWeight: 700, color: '#fff' }}>SupportSnap AI</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#888', marginTop: 2 }}>
                    <span style={{ width: 6, height: 6, background: '#27c93f', borderRadius: '50%', animation: 'statusPulse 2s ease-in-out infinite', display: 'inline-block' }} />
                    Online · Powered by your docs
                  </div>
                </div>
              </div>
              <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { role: 'bot', text: "Hi! I'm trained on your product docs. Ask me anything 👋" },
                  { role: 'user', text: 'How does pricing work?' },
                  { role: 'bot', text: 'We offer 3 plans starting at $29/mo. Pro unlocks unlimited bots and custom branding ✨' },
                  { role: 'user', text: 'Can I use my own domain?' },
                ].map((msg, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-end', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: msg.role === 'user' ? '#e8e4db' : '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: msg.role === 'user' ? '#333' : '#fff', fontWeight: 600, flexShrink: 0 }}>
                      {msg.role === 'user' ? 'U' : 'AI'}
                    </div>
                    <div style={{ padding: '10px 14px', borderRadius: 16, fontSize: 13, lineHeight: 1.5, maxWidth: 260, background: msg.role === 'bot' ? '#f4f4f4' : '#0A0A0A', color: msg.role === 'bot' ? '#0A0A0A' : '#fff', borderBottomLeftRadius: msg.role === 'bot' ? 4 : 16, borderBottomRightRadius: msg.role === 'user' ? 4 : 16 }}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding: '12px 14px', borderTop: '1px solid #E8E4DB', display: 'flex', gap: 8, alignItems: 'center' }}>
                <input placeholder="Ask anything about our product..." style={{ flex: 1, border: '1.5px solid #E8E4DB', borderRadius: 100, padding: '10px 14px', fontSize: 13, outline: 'none', background: '#F5F1E8' }} />
                <button style={{ width: 34, height: 34, background: '#0A0A0A', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none' }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M13 1L1 13M13 1H5M13 1V9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
            </div>
            <div style={{ position: 'absolute', bottom: -16, right: 16, background: '#0A0A0A', borderRadius: 16, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
              <span style={{ fontSize: 20 }}>⚡</span>
              <span style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: 13, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: 6 }}>
                60 sec setup
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M10 2L2 10M10 2H4M10 2V8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div style={{ background: '#0A0A0A', overflow: 'hidden', padding: '18px 0', borderTop: '1px solid #1a1a1a', borderBottom: '1px solid #1a1a1a' }}>
        <div ref={marqueeRef} style={{ display: 'flex', gap: 40, whiteSpace: 'nowrap', willChange: 'transform' }}>
          {Array(12).fill(null).map((_, i) => (
            <span key={i} style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: 18, fontWeight: 700, color: i % 2 === 0 ? '#fff' : '#555', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              {['instant', 'accurate', 'intelligent', '★'][i % 4]}
            </span>
          ))}
        </div>
      </div>

      {/* Demo Section */}
      <section style={{ background: '#0A0A0A', padding: '100px 5vw' }}>
        <div style={{ display: 'flex', gap: 60, alignItems: 'center', flexWrap: 'wrap', maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ flex: 1, minWidth: 300, maxWidth: 500 }}>
            <div style={{ background: '#1a1a1a', borderRadius: '12px 12px 0 0', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid #222' }}>
              <div style={{ display: 'flex', gap: 5 }}>
                {['#ff5f57', '#ffbd2e', '#27c93f'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
              </div>
              <span style={{ fontSize: 11, color: '#555', fontFamily: "var(--font-dm-mono), monospace" }}>supportsnap.io/dashboard</span>
            </div>
            <div style={{ background: '#111', border: '1px solid #222', borderTop: 'none', borderRadius: '0 0 12px 12px', padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#1a1a1a', borderRadius: 10, padding: '10px 14px' }}>
                <span style={{ fontSize: 10, color: '#555', fontFamily: "var(--font-dm-mono), monospace", flexShrink: 0 }}>Website URL</span>
                <span style={{ flex: 1, fontSize: 12, color: '#888', fontFamily: "var(--font-dm-mono), monospace" }}>https://yourproduct.com</span>
                <Link href="/dashboard/new" style={{ background: '#fff', color: '#0A0A0A', fontSize: 10, fontWeight: 700, padding: '5px 12px', borderRadius: 100, cursor: 'pointer', whiteSpace: 'nowrap', textDecoration: 'none' }}>Train →</Link>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#0a1a0a', borderRadius: 10, border: '1px solid #1a3a1a' }}>
                <div style={{ width: 24, height: 24, background: '#27c93f', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>✓</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>Bot Created Successfully!</div>
                  <div style={{ fontSize: 10, color: '#555', marginTop: 2 }}>Your AI is live and ready to chat</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
                {[['47', 'Pages Scraped'], ['156', 'Chunks'], ['2.1k', 'Chats'], ['98%', 'Accuracy']].map(([n, l]) => (
                  <div key={l} style={{ background: '#1a1a1a', border: '1px solid #222', borderRadius: 10, padding: 10, textAlign: 'center' }}>
                    <div style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '-0.04em' }}>{n}</div>
                    <div style={{ fontSize: 9, color: '#555', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 280 }}>
            <div style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.0, color: '#fff', marginBottom: 24 }}>
              demo<br />collection
            </div>
            <p style={{ fontSize: 15, color: '#666', fontWeight: 300, lineHeight: 1.7, marginBottom: 16 }}>
              At SupportSnap, we craft intelligent AI support that feels natural, responds instantly, and knows your product. Every bot is trained on your actual content.
            </p>
            <p style={{ fontSize: 13, color: '#444', marginBottom: 28, fontStyle: 'italic' }}>We embrace quality, minimalism, and speed.</p>
            <Link href="/how-it-works" className="btn-outline-white" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1.5px solid #333', color: '#fff', borderRadius: 100, padding: '12px 26px', fontSize: 14, fontWeight: 500, textDecoration: 'none', transition: 'border-color 0.2s, background 0.2s' }}>
              view more
              <span style={{ width: 22, height: 22, background: '#333', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11 }}>↗</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section style={{ padding: '100px 5vw', background: '#F5F1E8' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9A9A9A', fontFamily: "var(--font-syne), sans-serif", marginBottom: 12 }}>Selected work</div>
        <h2 style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.05, color: '#0A0A0A', marginBottom: 48 }}>Case Studies</h2>
        <div className="case-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, maxWidth: 1000 }}>
          {[
            { cls: 'analytics', bg: '#111', title: 'SaaS brand analytics ✨', sub: 'Conversation tracking & insights' },
            { cls: 'live', bg: '#0a1525', title: 'Live integration ⚡ Custom', sub: 'Widget deployed on real site' },
            { cls: 'config', bg: '#0a1a0a', title: 'Config interface 🛠 Settings', sub: 'Full customization panel' },
          ].map((c) => (
            <div key={c.cls} className="case-card" style={{ background: '#0A0A0A', borderRadius: 20, overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.25s, box-shadow 0.25s' }}>
              <div style={{ background: c.bg, padding: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 180 }}>
                <div style={{ width: 80, height: 80, background: '#222', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>
                  {c.cls === 'analytics' ? '📊' : c.cls === 'live' ? '⚡' : '🛠'}
                </div>
              </div>
              <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #1a1a1a' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', lineHeight: 1.4 }}>
                  {c.title}<br /><span style={{ fontWeight: 400, fontSize: 12, color: '#888' }}>{c.sub}</span>
                </div>
                <div style={{ width: 32, height: 32, background: '#1a1a1a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M10 2L2 10M10 2H4M10 2V8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '100px 5vw', background: '#EDE8DC' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 52, flexWrap: 'wrap', gap: 20 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9A9A9A', fontFamily: "var(--font-syne), sans-serif", marginBottom: 10 }}>Why SupportSnap</div>
            <h2 style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.05, color: '#0A0A0A' }}>
              Everything you need<br />to support customers
            </h2>
          </div>
          <Link href="/pricing" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 500, color: '#5A5A5A', textDecoration: 'none' }}>
            View pricing →
          </Link>
        </div>
        <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, maxWidth: 1000 }}>
          {[
            { icon: '🕷️', name: 'Smart Crawling', desc: 'Automatically discovers and scrapes all pages from your website — docs, FAQs, pricing, blogs.' },
            { icon: '🧠', name: 'RAG Architecture', desc: 'Retrieval-augmented generation ensures answers are always grounded in your actual content.' },
            { icon: '⚡', name: '60-Second Setup', desc: 'Paste your URL, click train. Your AI support bot is live before your coffee gets cold.' },
            { icon: '🎨', name: 'Custom Branding', desc: 'Match your brand — customize colors, name, avatar, and welcome message.' },
            { icon: '📊', name: 'Analytics Dashboard', desc: 'See what customers are asking, track satisfaction scores, and improve over time.' },
            { icon: '🔌', name: 'One-Line Embed', desc: 'Drop a single script tag into your site. Works with React, Vue, WordPress, Webflow — everything.' },
          ].map((f) => (
            <div key={f.name} className="feature-card" style={{ background: '#fff', border: '1.5px solid #E8E4DB', borderRadius: 20, padding: '28px 26px', transition: 'transform 0.25s, box-shadow 0.25s' }}>
              <div style={{ fontSize: 32, marginBottom: 14 }}>{f.icon}</div>
              <div style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: 17, fontWeight: 800, letterSpacing: '-0.03em', color: '#0A0A0A', marginBottom: 8 }}>{f.name}</div>
              <div style={{ fontSize: 13, color: '#5A5A5A', lineHeight: 1.6, fontWeight: 300 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#0A0A0A', padding: '120px 5vw', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontFamily: "var(--font-syne), sans-serif", fontSize: 'clamp(100px, 18vw, 240px)', fontWeight: 800, color: '#111', letterSpacing: '-0.05em', whiteSpace: 'nowrap', pointerEvents: 'none', userSelect: 'none' }}>
          START
        </div>
        <h2 style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: 'clamp(36px, 5vw, 72px)', fontWeight: 800, letterSpacing: '-0.04em', color: '#fff', lineHeight: 1.05, marginBottom: 16, position: 'relative', zIndex: 1 }}>
          Ready to get<br />started?
        </h2>
        <p style={{ fontSize: 16, color: '#666', fontWeight: 300, marginBottom: 40, maxWidth: 400, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6, position: 'relative', zIndex: 1 }}>
          Join thousands of SaaS companies delivering instant AI support. No credit card required.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
          <Link href="/demo" style={{ background: '#fff', color: '#0A0A0A', borderRadius: 100, padding: '15px 36px', fontSize: 15, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            Try Free Demo
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M12 2L2 12M12 2H5M12 2V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </Link>
          <Link href="/pricing" style={{ background: 'transparent', color: '#fff', border: '1.5px solid #333', borderRadius: 100, padding: '15px 36px', fontSize: 15, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            View Pricing
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M12 2L2 12M12 2H5M12 2V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
