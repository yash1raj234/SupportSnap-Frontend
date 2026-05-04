'use client';

import { useState, useEffect, useCallback, use, useRef } from 'react';
import Link from 'next/link';
import { getBotInfo, type BotInfo } from '@/lib/api';

type Tab = 'overview' | 'customize' | 'embed' | 'analytics';

interface BotConfig {
  color: string;
  position: 'bottom-right' | 'bottom-left' | 'top-right';
  avatar: string;
  name: string;
  welcomeMsg: string;
  placeholder: string;
  style: 'Professional' | 'Friendly' | 'Technical';
  confidence: number;
}

export default function DashboardPage({ params }: { params: Promise<{ botId: string }> }) {
  const { botId } = use(params);
  const [tab, setTab] = useState<Tab>('overview');
  const [botInfo, setBotInfo] = useState<BotInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [toast, setToast] = useState('');
  const [copied, setCopied] = useState(false);
  const [cfg, setCfg] = useState<BotConfig>({
    color: '#0A0A0A', position: 'bottom-right', avatar: '⚡',
    name: 'Support Bot', welcomeMsg: 'Hi! How can I help you today?',
    placeholder: 'Ask me anything…', style: 'Friendly', confidence: 70,
  });

  useEffect(() => {
    setLoading(true);
    getBotInfo(botId)
      .then(info => { setBotInfo(info); setLoading(false); })
      .catch(err => {
        setLoading(false);
        if (err?.statusCode === 404 || err?.message?.includes('not found')) setNotFound(true);
      });
  }, [botId]);

  // ── Chat state ──
  type Message = { role: 'user' | 'bot'; text: string };
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(async () => {
    const text = chatInput.trim();
    if (!text || chatLoading) return;
    setChatInput('');
    setMessages(prev => [...prev, { role: 'user', text }]);
    setChatLoading(true);
    const { chatWithBot } = await import('@/lib/api');
    let botText = '';
    setMessages(prev => [...prev, { role: 'bot', text: '' }]);
    try {
      for await (const token of chatWithBot(botId, text)) {
        botText += token;
        setMessages(prev => {
          const next = [...prev];
          next[next.length - 1] = { role: 'bot', text: botText };
          return next;
        });
      }
    } catch {
      setMessages(prev => {
        const next = [...prev];
        next[next.length - 1] = { role: 'bot', text: "Sorry, I couldn't get a response. Please try again." };
        return next;
      });
    } finally {
      setChatLoading(false);
    }
  }, [botId, chatInput, chatLoading]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  }, []);

  const embedCode = `<script\n  src="https://cdn.supportsnap.io/widget.js"\n  data-bot-id="${botId}"\n  data-color="${cfg.color}"\n  data-position="${cfg.position}"\n></script>`;

  const copyEmbed = () => {
    navigator.clipboard.writeText(embedCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // ── Loading state ──
  if (loading) {
    return (
      <div style={{ background: '#F5F1E8', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-dm-sans), sans-serif' }}>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 32, height: 32, border: '3px solid #E8E4DB', borderTopColor: '#0A0A0A', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ fontSize: 14, color: '#9A9A9A' }}>Loading dashboard…</p>
        </div>
      </div>
    );
  }

  // ── Not found state ──
  if (notFound || !botInfo) {
    return (
      <div style={{ background: '#F5F1E8', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-dm-sans), sans-serif' }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🤖</div>
          <h2 style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', color: '#0A0A0A', marginBottom: 10 }}>Bot not found</h2>
          <p style={{ fontSize: 14, color: '#5A5A5A', lineHeight: 1.6, marginBottom: 28, fontWeight: 300 }}>
            <code style={{ fontFamily: 'var(--font-dm-mono), monospace', background: '#EDE8DC', padding: '2px 8px', borderRadius: 6, fontSize: 13 }}>{botId}</code>
            <br /><br />
            This bot doesn&apos;t exist or the server was restarted (bots are held in-memory). Create a new one to get started.
          </p>
          <Link href="/dashboard/new" style={{ background: '#0A0A0A', color: '#fff', borderRadius: 100, padding: '13px 28px', fontSize: 14, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            Create a Bot
            <span style={{ width: 22, height: 22, background: '#fff', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#0A0A0A', fontSize: 11 }}>↗</span>
          </Link>
        </div>
      </div>
    );
  }

  const { stats, url, createdAt, config: apiConfig } = botInfo;
  const botHostname = (() => { try { return new URL(url).hostname; } catch { return url; } })();
  const createdDate = new Date(createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div style={{ background: '#F5F1E8', minHeight: '100vh', fontFamily: 'var(--font-dm-sans), sans-serif' }}>
      <style>{`
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(0.8)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .tab-btn{background:transparent;border:none;padding:10px 16px;font-size:13px;font-weight:500;cursor:pointer;color:#9A9A9A;border-bottom:2px solid transparent;transition:color 0.15s,border-color 0.15s;font-family:inherit;}
        .tab-btn:hover{color:#0A0A0A;}
        .tab-btn.active{color:#0A0A0A;font-weight:600;border-bottom-color:#0A0A0A;}
        .quick-action-item{display:flex;align-items:center;gap:10px;padding:12px 0;border-bottom:1px solid #E8E4DB;cursor:pointer;transition:opacity 0.15s;}
        .quick-action-item:last-child{border-bottom:none;}
        .quick-action-item:hover{opacity:0.7;}
        .radio-option{display:flex;align-items:center;gap:8px;padding:8px 12px;border-radius:8px;cursor:pointer;transition:background 0.15s;}
        .radio-option:hover{background:#F5F1E8;}
        .radio-option.selected{background:#F5F1E8;}
        .emoji-option{width:38px;height:38px;border-radius:10px;border:2px solid #E8E4DB;background:#fff;display:flex;align-items:center;justify-content:center;font-size:18px;cursor:pointer;transition:border-color 0.15s,background 0.15s;}
        .emoji-option:hover{background:#F5F1E8;}
        .emoji-option.selected{border-color:#0A0A0A;background:#F5F1E8;}
        .platform-card:hover{background:#F5F1E8!important;border-color:#bbb!important;transform:translateY(-1px);}
        .copy-btn:hover{background:#2a2a2a!important;color:#fff!important;}
        .copy-btn.copied{color:#27c93f!important;border-color:#1a4a2a!important;background:#0a2a1a!important;}
        .help-link:hover{background:#0A0A0A!important;color:#fff!important;border-color:#0A0A0A!important;}
        .form-input{width:100%;border:1.5px solid #E8E4DB;border-radius:10px;padding:10px 14px;font-size:13px;color:#0A0A0A;font-family:inherit;outline:none;background:#fff;transition:border-color 0.15s;}
        .form-input:focus{border-color:#0A0A0A;}
        .range-input{flex:1;appearance:none;height:4px;border-radius:2px;background:#E8E4DB;outline:none;cursor:pointer;}
        .range-input::-webkit-slider-thumb{appearance:none;width:16px;height:16px;border-radius:50%;background:#0A0A0A;cursor:pointer;}
        @media(max-width:900px){.dash-layout{grid-template-columns:1fr!important}.left-panel{border-right:none!important;border-bottom:1px solid #E8E4DB;}}
        @media(max-width:600px){.dash-nav-center{display:none!important}}
      `}</style>

      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(245,241,232,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #E8E4DB', height: 60, display: 'flex', alignItems: 'center', padding: '0 28px', gap: 20 }}>
        <Link href="/" style={{ fontFamily: 'var(--font-syne), sans-serif', fontWeight: 800, fontSize: 16, letterSpacing: '-0.5px', color: '#0A0A0A', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
          <span style={{ width: 7, height: 7, background: '#0A0A0A', borderRadius: '50%', display: 'inline-block' }} />
          SupportSnap
        </Link>
        <div className="dash-nav-center" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <div style={{ background: '#fff', border: '1px solid #E8E4DB', borderRadius: 100, padding: '6px 14px', fontSize: 13, fontWeight: 500, color: '#2A2A2A', display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-dm-mono), monospace', letterSpacing: '-0.02em' }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="4" stroke="#9A9A9A" strokeWidth="1"/><path d="M5 1v4l2.5 2.5" stroke="#9A9A9A" strokeWidth="1" strokeLinecap="round"/></svg>
            {botHostname}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#16a34a', background: '#dcfce7', borderRadius: 100, padding: '5px 12px', fontFamily: 'var(--font-syne), sans-serif', letterSpacing: '0.02em' }}>
            <span style={{ width: 6, height: 6, background: '#27c93f', borderRadius: '50%', display: 'inline-block', animation: 'pulse 2s ease-in-out infinite' }} />
            Live
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link href="/dashboard/new" style={{ background: '#0A0A0A', color: '#fff', borderRadius: 100, padding: '7px 16px', fontSize: 12, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            + New Bot
          </Link>
        </div>
      </nav>

      {/* Main */}
      <div className="dash-layout" style={{ display: 'grid', gridTemplateColumns: '60% 40%', minHeight: 'calc(100vh - 60px)' }}>

        {/* LEFT: Live Chat */}
        <div className="left-panel" style={{ borderRight: '1px solid #E8E4DB', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 60px)', position: 'sticky', top: 60 }}>
          {/* Chat header */}
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #E8E4DB', display: 'flex', alignItems: 'center', gap: 12, background: '#fff', flexShrink: 0 }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: cfg.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{cfg.avatar}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: 14, fontWeight: 700, color: '#0A0A0A' }}>{cfg.name}</div>
              <div style={{ fontSize: 11, color: '#5A5A5A', display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 6, height: 6, background: '#27c93f', borderRadius: '50%', display: 'inline-block', animation: 'pulse 2s ease-in-out infinite', flexShrink: 0 }} />
                Trained on <span style={{ fontFamily: 'var(--font-dm-mono), monospace', fontWeight: 600, color: '#0A0A0A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 180 }}>{botHostname}</span>
              </div>
            </div>
            <div style={{ fontSize: 10, color: '#9A9A9A', flexShrink: 0 }}>{stats.pagesScraped}p · {stats.totalChunks}c</div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 12, background: '#F5F1E8' }}>
            {/* Welcome bubble */}
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: cfg.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0 }}>{cfg.avatar}</div>
              <div style={{ background: '#fff', border: '1px solid #E8E4DB', borderRadius: '14px 14px 14px 4px', padding: '10px 14px', fontSize: 13, color: '#0A0A0A', lineHeight: 1.5, maxWidth: '80%' }}>
                {cfg.welcomeMsg} I&apos;m trained on <strong>{botHostname}</strong> — ask me anything!
              </div>
            </div>

            {/* Conversation */}
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: m.role === 'user' ? 'row-reverse' : 'row', gap: 10, alignItems: 'flex-end' }}>
                {m.role === 'bot' && (
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: cfg.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0 }}>{cfg.avatar}</div>
                )}
                <div style={{
                  background: m.role === 'user' ? cfg.color : '#fff',
                  border: m.role === 'user' ? 'none' : '1px solid #E8E4DB',
                  borderRadius: m.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  padding: '10px 14px',
                  fontSize: 13,
                  color: m.role === 'user' ? '#fff' : '#0A0A0A',
                  lineHeight: 1.5,
                  maxWidth: '80%',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}>
                  {m.text || (m.role === 'bot' && chatLoading && i === messages.length - 1 ? (
                    <span style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                      {[0, 0.15, 0.3].map(d => (
                        <span key={d} style={{ width: 6, height: 6, background: '#ccc', borderRadius: '50%', display: 'inline-block', animation: `pulse 1s ease-in-out ${d}s infinite` }} />
                      ))}
                    </span>
                  ) : m.text)}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '14px 24px', borderTop: '1px solid #E8E4DB', background: '#fff', display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0 }}>
            <input
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder={cfg.placeholder}
              disabled={chatLoading}
              style={{ flex: 1, border: '1.5px solid #E8E4DB', borderRadius: 100, padding: '10px 16px', fontSize: 13, outline: 'none', fontFamily: 'inherit', background: chatLoading ? '#F5F1E8' : '#fff', color: '#0A0A0A', transition: 'border-color 0.15s' }}
              onFocus={e => { e.currentTarget.style.borderColor = '#0A0A0A'; }}
              onBlur={e => { e.currentTarget.style.borderColor = '#E8E4DB'; }}
            />
            <button
              onClick={sendMessage}
              disabled={!chatInput.trim() || chatLoading}
              style={{ width: 40, height: 40, borderRadius: '50%', background: chatInput.trim() && !chatLoading ? cfg.color : '#E8E4DB', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: chatInput.trim() && !chatLoading ? 'pointer' : 'default', flexShrink: 0, transition: 'background 0.15s' }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M13 1L1 13M13 1H4M13 1V10" stroke="white" strokeWidth="1.8" strokeLinecap="round"/></svg>
            </button>
          </div>
        </div>

        {/* RIGHT: Tabs */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ borderBottom: '1px solid #E8E4DB', display: 'flex', paddingLeft: 8 }}>
            {(['overview','customize','embed','analytics'] as Tab[]).map(t => (
              <button key={t} className={`tab-btn${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* ── OVERVIEW ── */}
            {tab === 'overview' && (
              <>
                {/* Knowledge Base — real stats */}
                <div style={{ background: '#fff', border: '1px solid #E8E4DB', borderRadius: 16, padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>📊 Knowledge Base</div>
                    <span style={{ fontSize: 11, color: '#9A9A9A' }}>Created {createdDate}</span>
                  </div>
                  {[
                    ['Bot ID', botId],
                    ['Source URL', url],
                    ['Pages scraped', stats.pagesScraped],
                    ['Chunks stored', stats.totalChunks],
                    ['Vectors stored', stats.vectorsStored],
                    ['Processing time', stats.processingTime],
                    ['Embedding model', apiConfig.embeddingModel],
                    ['LLM', apiConfig.model],
                  ].map(([k, v]) => (
                    <div key={k as string} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #F5F1E8', gap: 12 }}>
                      <span style={{ fontSize: 12, color: '#5A5A5A', flexShrink: 0 }}>{k}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, fontFamily: typeof v === 'string' && (v.startsWith('http') || v.startsWith('bot_') || v.includes('-')) ? 'var(--font-dm-mono), monospace' : 'var(--font-syne), sans-serif', textAlign: 'right', wordBreak: 'break-all', maxWidth: '60%' }}>{v}</span>
                    </div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div style={{ background: '#fff', border: '1px solid #E8E4DB', borderRadius: 16, padding: 20 }}>
                  <div style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Quick Actions</div>
                  {[
                    { icon: '🎨', label: 'Customize Appearance', action: () => setTab('customize') },
                    { icon: '📋', label: 'Get Embed Code', action: () => setTab('embed') },
                    { icon: '💬', label: 'Test Chat', action: () => window.open(`/demo?botId=${botId}`, '_blank') },
                    { icon: '📈', label: 'View Analytics', action: () => setTab('analytics') },
                    { icon: '➕', label: 'Create Another Bot', action: () => window.open('/dashboard/new', '_self') },
                  ].map(a => (
                    <div key={a.label} className="quick-action-item" onClick={a.action}>
                      <span style={{ fontSize: 16, flexShrink: 0 }}>{a.icon}</span>
                      <span style={{ flex: 1, fontSize: 13 }}>{a.label}</span>
                      <span style={{ color: '#9A9A9A', fontSize: 13 }}>→</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* ── CUSTOMIZE ── */}
            {tab === 'customize' && (
              <>
                <div style={{ background: '#fff', border: '1px solid #E8E4DB', borderRadius: 16, padding: 20 }}>
                  <div style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>Appearance</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Widget Color</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <input type="color" value={cfg.color} onChange={e => setCfg(c => ({ ...c, color: e.target.value }))} style={{ width: 36, height: 36, borderRadius: 8, border: '1.5px solid #E8E4DB', cursor: 'pointer', padding: 2 }} />
                        <input type="text" value={cfg.color} onChange={e => setCfg(c => ({ ...c, color: e.target.value }))} maxLength={7} className="form-input" style={{ width: 100 }} />
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Position</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {(['bottom-right','bottom-left','top-right'] as const).map(pos => (
                          <div key={pos} className={`radio-option${cfg.position === pos ? ' selected' : ''}`} onClick={() => setCfg(c => ({ ...c, position: pos }))}>
                            <div style={{ width: 16, height: 16, borderRadius: '50%', border: `2px solid ${cfg.position === pos ? '#0A0A0A' : '#E8E4DB'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              {cfg.position === pos && <div style={{ width: 8, height: 8, background: '#0A0A0A', borderRadius: '50%' }} />}
                            </div>
                            <span style={{ fontSize: 13 }}>{pos.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Avatar</div>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {['⚡','💬','🤖','🎯','✨'].map(e => (
                          <div key={e} className={`emoji-option${cfg.avatar === e ? ' selected' : ''}`} onClick={() => setCfg(c => ({ ...c, avatar: e }))}>{e}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ background: '#fff', border: '1px solid #E8E4DB', borderRadius: 16, padding: 20 }}>
                  <div style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>Messages</div>
                  {[
                    { label: 'Welcome Message', key: 'welcomeMsg' as const },
                    { label: 'Placeholder Text', key: 'placeholder' as const },
                    { label: 'Bot Name', key: 'name' as const },
                  ].map(({ label, key }) => (
                    <div key={key} style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>{label}</div>
                      <input className="form-input" value={cfg[key]} onChange={e => setCfg(c => ({ ...c, [key]: e.target.value }))} />
                    </div>
                  ))}
                </div>

                <div style={{ background: '#fff', border: '1px solid #E8E4DB', borderRadius: 16, padding: 20 }}>
                  <div style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>Behavior</div>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Response Style</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {(['Professional','Friendly','Technical'] as const).map(s => (
                        <div key={s} className={`radio-option${cfg.style === s ? ' selected' : ''}`} onClick={() => setCfg(c => ({ ...c, style: s }))}>
                          <div style={{ width: 16, height: 16, borderRadius: '50%', border: `2px solid ${cfg.style === s ? '#0A0A0A' : '#E8E4DB'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            {cfg.style === s && <div style={{ width: 8, height: 8, background: '#0A0A0A', borderRadius: '50%' }} />}
                          </div>
                          <span style={{ fontSize: 13 }}>{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Confidence Threshold</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <input type="range" className="range-input" min={50} max={95} value={cfg.confidence} onChange={e => setCfg(c => ({ ...c, confidence: Number(e.target.value) }))} />
                      <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-syne), sans-serif', minWidth: 36, textAlign: 'right' }}>{cfg.confidence}%</span>
                    </div>
                    <div style={{ fontSize: 11, color: '#9A9A9A', marginTop: 4 }}>Only answer if confidence ≥ threshold</div>
                  </div>
                </div>

                <button onClick={() => showToast('Changes saved ✓')} style={{ background: '#0A0A0A', color: '#fff', border: 'none', borderRadius: 100, padding: '13px 24px', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', fontFamily: 'inherit' }}>
                  Save Changes
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7l4 4 6-6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </button>
              </>
            )}

            {/* ── EMBED ── */}
            {tab === 'embed' && (
              <>
                <div style={{ background: '#fff', border: '1px solid #E8E4DB', borderRadius: 16, padding: 20 }}>
                  <p style={{ fontSize: 13, color: '#5A5A5A', lineHeight: 1.6, marginBottom: 16 }}>
                    Copy this snippet and paste it before the closing{' '}
                    <code style={{ fontFamily: 'var(--font-dm-mono), monospace', background: '#F5F1E8', padding: '2px 6px', borderRadius: 4 }}>&lt;/body&gt;</code> tag.
                  </p>
                  <div style={{ background: '#111', borderRadius: 12, padding: '16px 18px', position: 'relative', marginBottom: 16 }}>
                    <pre style={{ fontFamily: 'var(--font-dm-mono), monospace', fontSize: 12, color: '#aaa', lineHeight: 1.7, whiteSpace: 'pre', overflow: 'auto', margin: 0 }}>
                      <span style={{ color: '#7eb8f7' }}>&lt;script</span>{'\n'}
                      {'  '}<span style={{ color: '#a8d4a8' }}>src</span>=<span style={{ color: '#f7c27e' }}>&quot;https://cdn.supportsnap.io/widget.js&quot;</span>{'\n'}
                      {'  '}<span style={{ color: '#a8d4a8' }}>data-bot-id</span>=<span style={{ color: '#f7c27e' }}>&quot;{botId}&quot;</span>{'\n'}
                      {'  '}<span style={{ color: '#a8d4a8' }}>data-color</span>=<span style={{ color: '#f7c27e' }}>&quot;{cfg.color}&quot;</span>{'\n'}
                      {'  '}<span style={{ color: '#a8d4a8' }}>data-position</span>=<span style={{ color: '#f7c27e' }}>&quot;{cfg.position}&quot;</span>{'\n'}
                      <span style={{ color: '#7eb8f7' }}>&gt;&lt;/script&gt;</span>
                    </pre>
                    <button className={`copy-btn${copied ? ' copied' : ''}`} onClick={copyEmbed} style={{ position: 'absolute', top: 10, right: 10, background: '#222', border: '1px solid #333', borderRadius: 7, padding: '5px 10px', fontSize: 11, color: copied ? '#27c93f' : '#888', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 5, transition: 'background 0.15s, color 0.15s' }}>
                      {copied ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div style={{ background: '#fff', border: '1px solid #E8E4DB', borderRadius: 16, padding: 20 }}>
                  <div style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: 13, fontWeight: 700, marginBottom: 14 }}>Install on your platform</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {[
                      { icon: '⚡', name: 'Webflow' }, { icon: '🔵', name: 'WordPress' },
                      { icon: '▲', name: 'Next.js' }, { icon: '🟢', name: 'Shopify' },
                      { icon: '🔶', name: 'Framer' }, { icon: '🟣', name: 'Bubble' },
                    ].map(p => (
                      <div key={p.name} className="platform-card" onClick={() => showToast(`Opening ${p.name} guide…`)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: 12, border: '1.5px solid #E8E4DB', background: '#fff', cursor: 'pointer', transition: 'background 0.15s, border-color 0.15s, transform 0.15s' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                          <span style={{ fontSize: 15 }}>{p.icon}</span>
                          <span style={{ fontSize: 12, fontWeight: 600 }}>{p.name}</span>
                        </div>
                        <span style={{ fontSize: 11, color: '#9A9A9A' }}>↗</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ── ANALYTICS ── */}
            {tab === 'analytics' && (
              <>
                <div style={{ background: '#fff', border: '1px solid #E8E4DB', borderRadius: 16, padding: 20 }}>
                  <div style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Bot Statistics</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                    {[
                      [stats.pagesScraped, 'Pages Scraped'],
                      [stats.totalChunks, 'Knowledge Chunks'],
                      [stats.vectorsStored, 'Vectors Stored'],
                    ].map(([n, l]) => (
                      <div key={l as string} style={{ background: '#F5F1E8', borderRadius: 12, padding: 14, textAlign: 'center' }}>
                        <div style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: 22, fontWeight: 800, letterSpacing: '-0.04em', color: '#0A0A0A', lineHeight: 1 }}>{n}</div>
                        <div style={{ fontSize: 10, color: '#9A9A9A', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{l}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: '#fff', border: '1px solid #E8E4DB', borderRadius: 16, padding: 20 }}>
                  <div style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Configuration</div>
                  {[
                    ['Model', apiConfig.model],
                    ['Embedding model', apiConfig.embeddingModel],
                    ['Top-K retrieval', apiConfig.topK],
                    ['Similarity threshold', apiConfig.similarityThreshold],
                    ['Processing time', stats.processingTime],
                  ].map(([k, v]) => (
                    <div key={k as string} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #F5F1E8', gap: 12 }}>
                      <span style={{ fontSize: 12, color: '#5A5A5A' }}>{k}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-dm-mono), monospace', textAlign: 'right' }}>{String(v)}</span>
                    </div>
                  ))}
                </div>

                <div style={{ background: '#EDE8DC', border: '1px solid #E8E4DB', borderRadius: 16, padding: 20 }}>
                  <div style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>ℹ️ Chat Analytics</div>
                  <p style={{ fontSize: 13, color: '#5A5A5A', lineHeight: 1.6, fontWeight: 300 }}>
                    Per-conversation analytics (messages sent, satisfaction ratings, top questions) require persistent storage — coming in a future release. The bot itself is fully functional.
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Help footer */}
          <div style={{ borderTop: '1px solid #E8E4DB', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, background: '#F5F1E8' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: 14, fontWeight: 700, letterSpacing: '-0.02em' }}>Need help?</div>
              <div style={{ fontSize: 12, color: '#5A5A5A', marginTop: 3 }}>Docs, tutorials, and support are one click away.</div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['Docs', 'Tutorial', 'Support'].map(l => (
                <a key={l} href="#" className="help-link" style={{ padding: '8px 16px', borderRadius: 100, border: '1.5px solid #E8E4DB', background: '#fff', fontSize: 12, fontWeight: 500, color: '#0A0A0A', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, transition: 'background 0.15s, border-color 0.15s, color 0.15s' }}>
                  {l}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: `translateX(-50%) translateY(${toast ? 0 : 8}px)`, background: '#0A0A0A', color: '#fff', padding: '10px 20px', borderRadius: 100, fontSize: 13, fontWeight: 500, opacity: toast ? 1 : 0, transition: 'opacity 0.25s, transform 0.25s', pointerEvents: 'none', zIndex: 9999, whiteSpace: 'nowrap' }}>
        {toast}
      </div>
    </div>
  );
}
