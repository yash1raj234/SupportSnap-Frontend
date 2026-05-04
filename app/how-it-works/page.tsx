'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const steps = [
  {
    num: '01',
    title: 'Paste your URL',
    desc: 'Drop in your website URL. SupportSnap automatically crawls every page — docs, FAQs, pricing, blog posts, and more — up to 500 pages per bot.',
    visual: (
      <div style={{ background: '#fff', border: '1px solid #E8E4DB', borderRadius: 24, padding: 32, display: 'flex', flexDirection: 'column', gap: 20, boxShadow: '0 24px 60px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, background: '#F5F1E8', borderRadius: 12, border: '1.5px solid #E8E4DB', overflow: 'hidden' }}>
          <div style={{ padding: '14px', fontSize: 13, color: '#9A9A9A', fontFamily: 'var(--font-dm-mono), monospace', borderRight: '1.5px solid #E8E4DB', whiteSpace: 'nowrap', background: '#EDE8DC', flexShrink: 0 }}>https://</div>
          <input defaultValue="yourproduct.com" style={{ flex: 1, padding: '14px', fontSize: 14, color: '#0A0A0A', fontFamily: 'var(--font-dm-mono), monospace', background: 'transparent', border: 'none', outline: 'none' }} />
          <button style={{ margin: 8, background: '#0A0A0A', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-syne), sans-serif', whiteSpace: 'nowrap' }}>Scan</button>
        </div>
        <div style={{ background: '#F5F1E8', borderRadius: 14, padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 600, color: '#0A0A0A', fontFamily: 'var(--font-syne), sans-serif' }}>
              <div style={{ width: 14, height: 14, border: '2px solid #E8E4DB', borderTopColor: '#0A0A0A', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              Scanning pages
            </div>
            <span style={{ fontSize: 11, color: '#9A9A9A', fontFamily: 'var(--font-dm-mono), monospace' }}>38/50</span>
          </div>
          <div style={{ height: 6, background: '#E8E4DB', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', background: '#0A0A0A', borderRadius: 3, width: '76%' }} />
          </div>
          {[
            { path: '/docs/getting-started', done: true },
            { path: '/pricing', done: true },
            { path: '/api/reference', done: false, active: true },
            { path: '/blog/updates', done: false },
          ].map(({ path, done, active }) => (
            <div key={path} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontFamily: 'var(--font-dm-mono), monospace' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', flexShrink: 0, background: done ? '#27c93f' : active ? '#0A0A0A' : '#E8E4DB' }} />
              <span style={{ color: '#5A5A5A', flex: 1 }}>{path}</span>
              <span style={{ color: done ? '#27c93f' : active ? '#0A0A0A' : '#E8E4DB', fontWeight: 600 }}>{done ? 'done' : active ? 'scanning' : '—'}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    num: '02',
    title: 'AI trains on your content',
    desc: 'SupportSnap chunks your content, generates Voyage AI embeddings, and stores them in a vector database. Your bot now understands semantics, not just keywords.',
    visual: (
      <div style={{ background: '#0A0A0A', borderRadius: 24, padding: '36px 32px', boxShadow: '0 24px 60px rgba(0,0,0,0.35)', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#555', fontFamily: 'var(--font-syne), sans-serif', marginBottom: 4 }}>RAG Pipeline</div>
        {[
          { icon: '🕷️', title: 'Web Scraper', sub: 'Jina AI Reader API', count: '47 pages' },
          { icon: '✂️', title: 'Text Chunker', sub: '500-word chunks, 50-word overlap', count: '156 chunks' },
          { icon: '🔢', title: 'Embeddings', sub: 'Voyage AI (1024 dims)', count: '156 vectors' },
          { icon: '🗄️', title: 'Vector Store', sub: 'Upstash Vector DB', count: 'stored' },
        ].map((node, i, arr) => (
          <div key={node.title}>
            <div style={{ background: '#111', border: '1px solid #222', borderRadius: 14, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14, position: 'relative' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 18 }}>{node.icon}</div>
              <div>
                <div style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: 13, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>{node.title}</div>
                <div style={{ fontSize: 11, color: '#555', marginTop: 2, fontWeight: 300 }}>{node.sub}</div>
              </div>
              <div style={{ marginLeft: 'auto', fontFamily: 'var(--font-dm-mono), monospace', fontSize: 11, color: '#333', flexShrink: 0 }}>{node.count}</div>
              {i < arr.length - 1 && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#27c93f', position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)' }} />}
            </div>
            {i < arr.length - 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4px 0' }}>
                <div style={{ width: 1, height: 20, background: '#222' }} />
                <div style={{ width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '7px solid #333' }} />
              </div>
            )}
          </div>
        ))}
      </div>
    ),
  },
  {
    num: '03',
    title: 'Deploy in one click',
    desc: 'Copy a single `<script>` tag and paste it into your site. Your AI chatbot appears instantly — no backend changes, no config files, no engineering time.',
    visual: (
      <div style={{ background: '#fff', border: '1px solid #E8E4DB', borderRadius: 24, overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.1)' }}>
        <div style={{ background: '#f0ece3', borderBottom: '1px solid #E8E4DB', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', gap: 5 }}>
            {['#ff5f57','#ffbd2e','#27c93f'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
          </div>
          <div style={{ flex: 1, background: '#fff', border: '1px solid #E8E4DB', borderRadius: 6, padding: '5px 12px', fontSize: 11, color: '#5A5A5A', fontFamily: 'var(--font-dm-mono), monospace' }}>yourproduct.com</div>
        </div>
        <div style={{ background: '#fafaf8', padding: 24, minHeight: 240, position: 'relative' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[['55%','#d4cfc3'],['14px','90%','#e8e4db'],['8px','70%','#e8e4db'],['8px','45%','#e8e4db'],['14px','60%','#d4cfc3'],['8px','85%','#e8e4db']].map(([h,w,bg], i) => (
              <div key={i} style={{ height: h as string, width: w as string, background: bg as string, borderRadius: 6 }} />
            ))}
          </div>
          <div style={{ position: 'absolute', bottom: 16, right: 16, width: 210 }}>
            <div style={{ background: '#0A0A0A', borderRadius: '14px 14px 0 0', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>⚡</div>
              <div>
                <div style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: 11, fontWeight: 700, color: '#fff' }}>SupportSnap AI</div>
                <div style={{ fontSize: 9, color: '#7eff9a', display: 'flex', alignItems: 'center', gap: 3 }}>
                  <div style={{ width: 5, height: 5, background: '#7eff9a', borderRadius: '50%' }} /> Live
                </div>
              </div>
            </div>
            <div style={{ background: '#fff', padding: 10, display: 'flex', flexDirection: 'column', gap: 7, borderRadius: '0 0 14px 14px' }}>
              <div style={{ fontSize: 10, padding: '7px 10px', borderRadius: 10, background: '#f4f4f4', color: '#0A0A0A', maxWidth: '88%', lineHeight: 1.4, borderBottomLeftRadius: 3 }}>Hi! How can I help you today?</div>
              <div style={{ fontSize: 10, padding: '7px 10px', borderRadius: 10, background: '#0A0A0A', color: '#fff', maxWidth: '88%', alignSelf: 'flex-end', lineHeight: 1.4, borderBottomRightRadius: 3 }}>How do I reset my password?</div>
              <div style={{ display: 'flex', gap: 3, padding: '8px 10px' }}>
                {[0,0.2,0.4].map(d => <div key={d} style={{ width: 5, height: 5, background: '#ccc', borderRadius: '50%' }} />)}
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
];

export default function HowItWorksPage() {
  return (
    <div style={{ background: '#F5F1E8', minHeight: '100vh', fontFamily: 'var(--font-dm-sans), sans-serif' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes progressFill { from{width:18%} to{width:82%} }
        @keyframes ragPulse { 0%,100%{opacity:1;transform:translateY(-50%) scale(1)} 50%{opacity:0.4;transform:translateY(-50%) scale(0.7)} }
        .step-row { display:grid; grid-template-columns:1fr 1fr; gap:80px; align-items:center; margin-bottom:120px; }
        .step-row.reverse { direction:rtl; }
        .step-row.reverse > * { direction:ltr; }
        @media(max-width:900px){ .step-row { grid-template-columns:1fr !important; gap:40px !important; } .step-row.reverse { direction:ltr; } }
        .tech-card:hover { background:#141414 !important; transform:translateY(-3px); }
        .feat-metric { display:inline-block; margin-top:14px; font-family:var(--font-dm-mono),monospace; font-size:11px; font-weight:500; padding:4px 10px; border-radius:100px; }
      `}</style>

      <Navbar />

      {/* Hero */}
      <section style={{ padding: '140px 5vw 80px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', fontFamily: 'var(--font-syne), sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9A9A9A', background: '#EDE8DC', borderRadius: 100, padding: '6px 16px', marginBottom: 24 }}>
          How It Works
        </div>
        <h1 style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: 'clamp(40px, 6vw, 80px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.05, color: '#0A0A0A', marginBottom: 16 }}>
          Three steps to<br />AI-powered support
        </h1>
        <p style={{ fontSize: 'clamp(15px, 1.5vw, 18px)', color: '#5A5A5A', fontWeight: 300, maxWidth: 480, margin: '0 auto 0', lineHeight: 1.6 }}>
          No engineers. No training data. No configuration. Just your URL.
        </p>
      </section>

      {/* Steps */}
      <section style={{ padding: '60px 5vw 80px' }}>
        {steps.map((step, i) => (
          <div key={step.num} className={`step-row${i % 2 === 1 ? ' reverse' : ''}`}>
            <div>
              <div style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: 'clamp(56px, 8vw, 100px)', fontWeight: 800, letterSpacing: '-0.05em', color: '#EDE8DC', lineHeight: 1, marginBottom: -10, userSelect: 'none' }}>
                {step.num}
              </div>
              <h2 style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, color: '#0A0A0A', marginBottom: 16 }}>
                {step.title}
              </h2>
              <p style={{ fontSize: 15, color: '#5A5A5A', fontWeight: 300, lineHeight: 1.7, maxWidth: 400 }}>
                {step.desc}
              </p>
            </div>
            <div>{step.visual}</div>
          </div>
        ))}
      </section>

      {/* Tech section */}
      <section style={{ background: '#0A0A0A', padding: '80px 5vw' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#444', fontFamily: 'var(--font-syne), sans-serif', textAlign: 'center', marginBottom: 14 }}>
          Technology
        </div>
        <h2 style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, letterSpacing: '-0.04em', color: '#fff', textAlign: 'center', marginBottom: 52, lineHeight: 1.1 }}>
          Built on the best AI stack
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, maxWidth: 860, margin: '0 auto' }}>
          {[
            { icon: '🌊', name: 'Jina AI', desc: 'JS-rendered web scraping that captures dynamic content, SPAs, and auth-gated pages.', metric: 'up to 500 pages', metricBg: 'rgba(74,154,255,0.15)', metricColor: '#4a9aff' },
            { icon: '🧭', name: 'Voyage AI', desc: 'State-of-the-art embeddings (1024 dims) optimized for semantic similarity and retrieval.', metric: '1024 dimensions', metricBg: 'rgba(168,212,168,0.15)', metricColor: '#a8d4a8' },
            { icon: '⚡', name: 'Upstash Vector', desc: 'Serverless vector database with low-latency similarity search at any scale.', metric: '<20ms p99', metricBg: 'rgba(255,189,46,0.15)', metricColor: '#ffbd2e' },
            { icon: '🦙', name: 'Groq + Llama 3', desc: 'Ultra-fast LLM inference via Groq. Llama 3.1 70B for production-grade answers.', metric: '500 tok/s', metricBg: 'rgba(255,95,87,0.15)', metricColor: '#ff5f57' },
            { icon: '🔄', name: 'SSE Streaming', desc: 'Real-time token-by-token streaming so users see answers forming, not waiting.', metric: 'live stream', metricBg: 'rgba(39,201,63,0.15)', metricColor: '#27c93f' },
            { icon: '🔒', name: 'Fastify', desc: 'High-performance Node.js server with rate limiting, CORS, and typed request validation.', metric: '60k req/s', metricBg: 'rgba(130,90,255,0.15)', metricColor: '#825aff' },
          ].map(f => (
            <div key={f.name} className="tech-card" style={{ background: '#0e0e0e', border: '1px solid #1a1a1a', borderRadius: 20, padding: '28px 26px', transition: 'background 0.2s, transform 0.2s', textAlign: 'center' }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, background: '#1a1a1a' }}>{f.icon}</div>
              <div style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: 16, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', marginBottom: 8 }}>{f.name}</div>
              <div style={{ fontSize: 13, color: '#555', lineHeight: 1.55, fontWeight: 300 }}>{f.desc}</div>
              <div className="feat-metric" style={{ background: f.metricBg, color: f.metricColor }}>{f.metric}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#F5F1E8', padding: '100px 5vw', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontFamily: 'var(--font-syne), sans-serif', fontSize: 'clamp(80px, 15vw, 200px)', fontWeight: 800, color: '#EDE8DC', letterSpacing: '-0.05em', whiteSpace: 'nowrap', pointerEvents: 'none', userSelect: 'none' }}>
          BUILD
        </div>
        <h2 style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: 'clamp(32px, 4.5vw, 56px)', fontWeight: 800, letterSpacing: '-0.04em', color: '#0A0A0A', lineHeight: 1.1, marginBottom: 14, position: 'relative', zIndex: 1 }}>
          Ready to build<br />your first bot?
        </h2>
        <p style={{ fontSize: 16, color: '#5A5A5A', fontWeight: 300, marginBottom: 36, maxWidth: 360, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6, position: 'relative', zIndex: 1 }}>
          Join thousands of SaaS teams already using SupportSnap.
        </p>
        <Link href="/demo" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#0A0A0A', color: '#fff', border: 'none', borderRadius: 100, padding: '16px 36px', fontSize: 15, fontWeight: 600, textDecoration: 'none', position: 'relative', zIndex: 1 }}>
          Try It Free
          <span style={{ width: 26, height: 26, background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0A0A0A', fontSize: 13 }}>↗</span>
        </Link>
      </section>

      <Footer />
    </div>
  );
}
