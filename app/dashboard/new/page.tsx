'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { generateBot } from '@/lib/api';

export default function NewBotPage() {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;
    setLoading(true);
    setError('');
    setProgress('Crawling your website…');

    try {
      const result = await generateBot(url.trim());
      router.push(`/dashboard/${result.botId}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create bot. Make sure the backend is running.');
      setLoading(false);
      setProgress('');
    }
  }

  return (
    <div style={{ background: '#F5F1E8', minHeight: '100vh', fontFamily: 'var(--font-dm-sans), sans-serif' }}>
      <style>{`
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes progressFill { from{width:10%} to{width:90%} }
        .create-input:focus { border-color: #0A0A0A !important; background: #fff !important; }
      `}</style>
      <Navbar />
      <section style={{ padding: '140px 5vw 80px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', fontFamily: 'var(--font-syne), sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9A9A9A', background: '#EDE8DC', borderRadius: 100, padding: '6px 16px', marginBottom: 24 }}>
          New Bot
        </div>
        <h1 style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.05, color: '#0A0A0A', marginBottom: 14 }}>
          Create your AI support bot
        </h1>
        <p style={{ fontSize: 16, color: '#5A5A5A', fontWeight: 300, maxWidth: 440, marginBottom: 48, lineHeight: 1.6 }}>
          Paste your website URL. SupportSnap will crawl your site, build a knowledge base, and have your bot live in about 60 seconds.
        </p>

        <form onSubmit={handleCreate} style={{ width: '100%', maxWidth: 560, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', gap: 0, border: '1.5px solid #E8E4DB', borderRadius: 14, overflow: 'hidden', background: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <div style={{ padding: '14px 16px', fontSize: 13, color: '#9A9A9A', fontFamily: 'var(--font-dm-mono), monospace', borderRight: '1.5px solid #E8E4DB', background: '#EDE8DC', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center' }}>
              https://
            </div>
            <input
              className="create-input"
              type="text"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="yourproduct.com"
              disabled={loading}
              style={{ flex: 1, padding: '14px 16px', fontSize: 15, color: '#0A0A0A', fontFamily: 'var(--font-dm-mono), monospace', background: 'transparent', border: 'none', outline: 'none', opacity: loading ? 0.6 : 1 }}
            />
          </div>

          {loading && (
            <div style={{ background: '#fff', border: '1px solid #E8E4DB', borderRadius: 12, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: '#0A0A0A', fontFamily: 'var(--font-syne), sans-serif' }}>
                  <div style={{ width: 14, height: 14, border: '2px solid #E8E4DB', borderTopColor: '#0A0A0A', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  {progress}
                </div>
              </div>
              <div style={{ height: 6, background: '#E8E4DB', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: '#0A0A0A', borderRadius: 3, animation: 'progressFill 4s ease-in-out infinite alternate' }} />
              </div>
            </div>
          )}

          {error && (
            <div style={{ background: '#fff0f0', border: '1px solid #fca5a5', borderRadius: 12, padding: '12px 16px', fontSize: 13, color: '#dc2626', textAlign: 'left' }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading || !url.trim()} style={{ background: '#0A0A0A', color: '#fff', border: 'none', borderRadius: 100, padding: '15px 32px', fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: loading || !url.trim() ? 0.5 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, transition: 'opacity 0.15s' }}>
            {loading ? 'Creating your bot…' : 'Create Bot Free'}
            {!loading && <span style={{ width: 26, height: 26, background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0A0A0A', fontSize: 13 }}>↗</span>}
          </button>
        </form>

        <p style={{ marginTop: 24, fontSize: 12, color: '#9A9A9A' }}>No credit card required · Free forever · Live in 60 seconds</p>
      </section>
    </div>
  );
}
