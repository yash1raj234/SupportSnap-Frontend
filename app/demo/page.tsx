'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { chatWithBot } from '@/lib/api';

interface Message {
  role: 'user' | 'bot';
  text: string;
  streaming?: boolean;
}

const SUPPORTSNAP_CHIPS = [
  'How does pricing work?',
  'What technology do you use?',
  'How long does setup take?',
];

function NoBotState() {
  return (
    <div style={{ background: '#F5F1E8', minHeight: '100vh', fontFamily: 'var(--font-dm-sans), sans-serif' }}>
      <Navbar />
      <section style={{ padding: '160px 5vw 80px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, background: '#EDE8DC', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, marginBottom: 24 }}>🤖</div>
        <h1 style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, letterSpacing: '-0.04em', color: '#0A0A0A', marginBottom: 12 }}>
          No bot selected
        </h1>
        <p style={{ fontSize: 16, color: '#5A5A5A', fontWeight: 300, maxWidth: 420, lineHeight: 1.6, marginBottom: 36 }}>
          Create a bot from your website first, then come back here to test it live.
        </p>
        <Link href="/dashboard/new" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#0A0A0A', color: '#fff', borderRadius: 100, padding: '14px 32px', fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>
          Create a Bot Free
          <span style={{ width: 26, height: 26, background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0A0A0A', fontSize: 13 }}>↗</span>
        </Link>
      </section>
      <Footer />
    </div>
  );
}

function DemoChat({ botId }: { botId: string }) {
  const isOwnBot = !botId.startsWith('bot_demo');
  const chips = isOwnBot ? [] : SUPPORTSNAP_CHIPS;
  const greeting = isOwnBot
    ? `👋 Hi! I'm trained on your website. Ask me anything and I'll answer based on your content.`
    : `👋 Hi! I'm trained on SupportSnap's documentation. Ask me anything about how it works, pricing, the technology, or how to get started!`;

  const [messages, setMessages] = useState<Message[]>([{ role: 'bot', text: greeting }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chipsHidden, setChipsHidden] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    setChipsHidden(true);
    setInput('');
    setLoading(true);
    setMessages(prev => [...prev, { role: 'user', text }]);
    setMessages(prev => [...prev, { role: 'bot', text: '', streaming: true }]);

    try {
      const gen = chatWithBot(botId, text);
      let full = '';
      for await (const chunk of gen) {
        full += chunk;
        setMessages(prev => {
          const next = [...prev];
          next[next.length - 1] = { role: 'bot', text: full, streaming: true };
          return next;
        });
      }
      setMessages(prev => {
        const next = [...prev];
        next[next.length - 1] = { role: 'bot', text: full, streaming: false };
        return next;
      });
    } catch {
      setMessages(prev => {
        const next = [...prev];
        next[next.length - 1] = { role: 'bot', text: "Sorry, I couldn't reach the API right now. Make sure the backend is running.", streaming: false };
        return next;
      });
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  return (
    <div style={{ background: '#F5F1E8', minHeight: '100vh', fontFamily: 'var(--font-dm-sans), sans-serif' }}>
      <style>{`
        @keyframes typeBounce { 0%,80%,100%{transform:translateY(0);opacity:0.4} 40%{transform:translateY(-5px);opacity:1} }
        @keyframes livePulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
        .chat-input-field:focus { border-color: #0A0A0A !important; background: #fff !important; }
        .send-btn:hover:not(:disabled) { background: #333 !important; transform: scale(1.05); }
        .send-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .chip:hover { background: #EDE8DC !important; border-color: #ccc !important; transform: scale(1.02); }
        .tech-feat:hover { background: #141414 !important; transform: translateY(-3px); }
      `}</style>

      <Navbar />

      {/* Hero */}
      <section style={{ padding: '140px 5vw 60px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-syne), sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#16a34a', background: '#dcfce7', borderRadius: 100, padding: '6px 16px', marginBottom: 24 }}>
          <span style={{ width: 6, height: 6, background: '#27c93f', borderRadius: '50%', display: 'inline-block', animation: 'livePulse 2s ease-in-out infinite' }} />
          Live Demo
        </div>
        <h1 style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: 'clamp(40px, 6vw, 80px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.05, color: '#0A0A0A', marginBottom: 16 }}>
          {isOwnBot ? 'Test your bot' : 'Try it yourself'}
        </h1>
        <p style={{ fontSize: 'clamp(15px, 1.5vw, 18px)', color: '#5A5A5A', fontWeight: 300, maxWidth: 480, margin: '0 auto', lineHeight: 1.6 }}>
          {isOwnBot
            ? 'Chat with your AI support bot — trained on your website content.'
            : "Chat with our AI support bot — trained on SupportSnap's own docs. Ask anything."}
        </p>
      </section>

      {/* Chat Window */}
      <section style={{ padding: '0 5vw 80px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '100%', maxWidth: 680, background: '#fff', border: '1px solid #E8E4DB', borderRadius: 24, overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', minHeight: 520, maxHeight: '70vh' }}>

          {/* Header */}
          <div style={{ background: '#0A0A0A', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
            <div style={{ width: 38, height: 38, background: '#222', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>⚡</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: 14, fontWeight: 700, color: '#fff' }}>
                {isOwnBot ? 'Your Support Bot' : 'SupportSnap Bot'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#888', marginTop: 2 }}>
                <span style={{ width: 6, height: 6, background: '#27c93f', borderRadius: '50%', display: 'inline-block', animation: 'livePulse 2s ease-in-out infinite' }} />
                Live · {botId}
              </div>
            </div>
            <button onClick={() => { setMessages([{ role: 'bot', text: greeting }]); setChipsHidden(false); }} style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#888' }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 18px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-end', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: msg.role === 'user' ? '#e8e4db' : '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: msg.role === 'bot' ? 14 : 11, color: msg.role === 'user' ? '#333' : '#fff', fontWeight: 600, flexShrink: 0 }}>
                  {msg.role === 'bot' ? '⚡' : 'U'}
                </div>
                <div style={{ maxWidth: '72%' }}>
                  <div style={{ padding: '12px 16px', borderRadius: 18, fontSize: 14, lineHeight: 1.55, background: msg.role === 'bot' ? '#fff' : '#0A0A0A', color: msg.role === 'bot' ? '#0A0A0A' : '#fff', borderBottomLeftRadius: msg.role === 'bot' ? 4 : 18, borderBottomRightRadius: msg.role === 'user' ? 4 : 18, boxShadow: msg.role === 'bot' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none', border: msg.role === 'bot' ? '1px solid #E8E4DB' : 'none' }}>
                    {msg.text || (msg.streaming && (
                      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                        {[0, 0.18, 0.36].map(d => <span key={d} style={{ width: 7, height: 7, background: '#ccc', borderRadius: '50%', display: 'inline-block', animation: `typeBounce 1.2s ease-in-out ${d}s infinite` }} />)}
                      </div>
                    ))}
                  </div>
                  {/* Suggestion chips on first bot message */}
                  {i === 0 && !chipsHidden && chips.length > 0 && (
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
                      {chips.map(c => (
                        <button key={c} className="chip" onClick={() => send(c)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 100, background: '#F5F1E8', border: '1.5px solid #E8E4DB', fontSize: 12, fontWeight: 500, cursor: 'pointer', color: '#2A2A2A', transition: 'background 0.15s, border-color 0.15s, transform 0.15s', fontFamily: 'inherit' }}>
                          <span style={{ fontSize: 11, color: '#9A9A9A' }}>→</span> {c}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '16px 18px', borderTop: '1px solid #E8E4DB', background: '#fff', display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0 }}>
            <input
              ref={inputRef}
              className="chat-input-field"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send(input)}
              placeholder={isOwnBot ? 'Ask your bot anything…' : 'Ask anything about SupportSnap…'}
              disabled={loading}
              style={{ flex: 1, border: '1.5px solid #E8E4DB', borderRadius: 100, padding: '12px 18px', fontSize: 14, color: '#0A0A0A', fontFamily: 'inherit', outline: 'none', background: '#F5F1E8', transition: 'border-color 0.15s, background 0.15s', opacity: loading ? 0.6 : 1 }}
            />
            <button className="send-btn" onClick={() => send(input)} disabled={loading || !input.trim()} style={{ width: 44, height: 44, borderRadius: '50%', background: '#0A0A0A', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.15s, transform 0.15s' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M14 2L2 14M14 2H6M14 2V10" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>

        <p style={{ marginTop: 24, textAlign: 'center', fontSize: 13, color: '#9A9A9A', lineHeight: 1.6, maxWidth: 460 }}>
          <strong style={{ color: '#5A5A5A', fontWeight: 600 }}>This is a real AI.</strong>{' '}
          {isOwnBot
            ? 'It knows exactly what your website says — trained directly from your content.'
            : "It knows about SupportSnap's pricing, features, how it works, and more."}<br />
          Built with the exact same technology that powers every SupportSnap bot.
        </p>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#9A9A9A', background: '#EDE8DC', borderRadius: 100, padding: '5px 12px', marginTop: 12, fontFamily: 'var(--font-syne), sans-serif', fontWeight: 600, letterSpacing: '0.04em' }}>
          ⚡ Powered by Groq + RAG
        </div>

        {isOwnBot && (
          <Link href={`/dashboard/${botId}`} style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#5A5A5A', textDecoration: 'none', fontWeight: 500 }}>
            ← Back to dashboard
          </Link>
        )}
      </section>

      {/* Features section — shown only for the SupportSnap demo bot */}
      {!isOwnBot && (
        <>
          <section style={{ background: '#0A0A0A', padding: '80px 5vw' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#444', fontFamily: 'var(--font-syne), sans-serif', textAlign: 'center', marginBottom: 14 }}>Why it&apos;s different</div>
            <h2 style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, letterSpacing: '-0.04em', color: '#fff', textAlign: 'center', marginBottom: 52, lineHeight: 1.1 }}>
              What makes this special?
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, maxWidth: 860, margin: '0 auto' }}>
              {[
                { bg: '#1a1a2e', icon: <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M13 3C7.48 3 3 7.48 3 13s4.48 10 10 10 10-4.48 10-10S18.52 3 13 3zm0 14v-4H9l7-10v4h4L13 17z" fill="#7eb8f7"/></svg>, name: 'Instant', desc: 'Responses stream in real-time. No loading spinners, no waiting.', metricBg: '#1a1a2e', metricColor: '#7eb8f7', metric: '< 2 second response' },
                { bg: '#0a2a1a', icon: <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M13 3l2.09 6.26L22 11l-5.63 3.74L18.18 22 13 18.27 7.82 22l2.81-7.26L5 11l6.91-1.74L13 3z" stroke="#7eff9a" strokeWidth="1.5" strokeLinejoin="round"/></svg>, name: 'Accurate', desc: 'Every answer is grounded in your actual documentation. No hallucinations.', metricBg: '#0a2a1a', metricColor: '#7eff9a', metric: '98% accuracy rate' },
                { bg: '#1a0a2a', icon: <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><circle cx="13" cy="10" r="4" stroke="#c4a7ff" strokeWidth="1.5"/><path d="M5 21c0-4.42 3.58-8 8-8s8 3.58 8 8" stroke="#c4a7ff" strokeWidth="1.5" strokeLinecap="round"/></svg>, name: 'Smart', desc: 'Understands context, follows up gracefully, and knows when to escalate.', metricBg: '#1a0a2a', metricColor: '#c4a7ff', metric: 'RAG + LLM reasoning' },
              ].map(f => (
                <div key={f.name} className="tech-feat" style={{ background: '#0e0e0e', border: '1px solid #1a1a1a', borderRadius: 20, padding: '28px 26px', transition: 'background 0.2s, transform 0.2s', textAlign: 'center' }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, margin: '0 auto 16px', background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{f.icon}</div>
                  <div style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: 16, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', marginBottom: 8 }}>{f.name}</div>
                  <div style={{ fontSize: 13, color: '#555', lineHeight: 1.55, fontWeight: 300 }}>{f.desc}</div>
                  <span style={{ display: 'inline-block', marginTop: 14, fontFamily: 'var(--font-dm-mono), monospace', fontSize: 11, fontWeight: 500, padding: '4px 10px', borderRadius: 100, background: f.metricBg, color: f.metricColor }}>{f.metric}</span>
                </div>
              ))}
            </div>
          </section>

          <section style={{ background: '#F5F1E8', padding: '100px 5vw', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontFamily: 'var(--font-syne), sans-serif', fontSize: 'clamp(100px, 18vw, 240px)', fontWeight: 800, color: '#EDE8DC', letterSpacing: '-0.05em', whiteSpace: 'nowrap', pointerEvents: 'none', userSelect: 'none' }}>
              yours
            </div>
            <h2 style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: 'clamp(32px, 4.5vw, 56px)', fontWeight: 800, letterSpacing: '-0.04em', color: '#0A0A0A', lineHeight: 1.1, marginBottom: 14, position: 'relative', zIndex: 1 }}>
              Want this for your website?
            </h2>
            <p style={{ fontSize: 16, color: '#5A5A5A', fontWeight: 300, marginBottom: 36, maxWidth: 360, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6, position: 'relative', zIndex: 1 }}>
              Create your own AI support bot in 60 seconds — free, no credit card required.
            </p>
            <Link href="/dashboard/new" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#0A0A0A', color: '#fff', border: 'none', borderRadius: 100, padding: '16px 36px', fontSize: 15, fontWeight: 600, textDecoration: 'none', position: 'relative', zIndex: 1 }}>
              Create Your Bot Free
              <span style={{ width: 26, height: 26, background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0A0A0A', fontSize: 13 }}>↗</span>
            </Link>
          </section>
        </>
      )}

      <Footer />
    </div>
  );
}

function DemoPageInner() {
  const searchParams = useSearchParams();
  const botId = searchParams.get('botId') ?? '';

  if (!botId) return <NoBotState />;
  return <DemoChat botId={botId} />;
}

export default function DemoPage() {
  return (
    <Suspense fallback={
      <div style={{ background: '#F5F1E8', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 32, height: 32, border: '3px solid #E8E4DB', borderTopColor: '#0A0A0A', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    }>
      <DemoPageInner />
    </Suspense>
  );
}
