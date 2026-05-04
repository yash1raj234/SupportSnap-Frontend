'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const CHECK_BLACK = (
  <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round"/></svg>
);
const CHECK_WHITE = (
  <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
);
const ARROW = (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M10 2L2 10M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
);

const faqs = [
  { q: 'Can I change plans anytime?', a: 'Yes, absolutely. You can upgrade or downgrade at any time from your account settings. Upgrades take effect immediately. Downgrades apply at the start of your next billing cycle.' },
  { q: 'What happens if I exceed my chat limit?', a: "Your bot keeps working — we won't cut it off mid-month. We'll send you a friendly email when you're at 80% of your limit and offer easy one-click upgrade options." },
  { q: 'Do you offer refunds?', a: 'Yes. We offer a 30-day money-back guarantee, no questions asked. If you\'re not happy for any reason in the first 30 days, just email us and we\'ll issue a full refund.' },
  { q: 'Can I get a custom plan?', a: "Absolutely. If your needs don't fit our standard tiers, contact our sales team and we'll build a plan around your usage, team size, and integration requirements." },
  { q: 'What payment methods do you accept?', a: 'We accept all major credit and debit cards (Visa, Mastercard, Amex), PayPal, and ACH bank transfers for annual plans. All payments are processed securely via Stripe.' },
  { q: 'Is there a setup fee?', a: 'No setup fees, no onboarding fees, no hidden costs. You only pay the plan price. Your bot is ready in 60 seconds — no engineer or consultant needed.' },
];

export default function PricingPage() {
  const [yearly, setYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const freePrice = 0;
  const proPrice = yearly ? 23 : 29;

  return (
    <div style={{ background: '#F5F1E8', minHeight: '100vh', fontFamily: "var(--font-dm-sans), sans-serif" }}>
      <style>{`
        .pricing-card { transition: transform 0.25s, box-shadow 0.25s; }
        .pricing-card:hover { transform: translateY(-4px); }
        .card-pro:hover { transform: translateY(-6px) !important; box-shadow: 0 20px 60px rgba(0,0,0,0.45) !important; }
        .faq-answer { max-height: 0; overflow: hidden; transition: max-height 0.35s ease, padding 0.25s ease; padding: 0 24px; }
        .faq-answer.open { max-height: 200px; }
        .faq-chevron { transition: transform 0.25s; }
        .faq-chevron.open { transform: rotate(180deg); background: #0A0A0A !important; color: white !important; }
        .btn-card:hover { transform: scale(1.01); }
        @media(max-width:900px){ .pricing-grid { grid-template-columns: 1fr !important; max-width: 440px !important; } }
        @media(max-width:700px){ .faq-grid { grid-template-columns: 1fr !important; } .nav-links-list { display: none !important; } }
      `}</style>

      <Navbar />

      {/* Hero */}
      <section style={{ padding: '140px 5vw 80px', textAlign: 'center', background: '#F5F1E8' }}>
        <div style={{ display: 'inline-block', fontFamily: "var(--font-syne), sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9A9A9A', background: '#EDE8DC', borderRadius: 100, padding: '6px 16px', marginBottom: 24 }}>
          Pricing
        </div>
        <h1 style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: 'clamp(40px, 6vw, 80px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.05, color: '#0A0A0A', marginBottom: 16 }}>
          Simple, transparent<br />pricing
        </h1>
        <p style={{ fontSize: 'clamp(15px, 1.5vw, 18px)', color: '#5A5A5A', fontWeight: 300, maxWidth: 480, margin: '0 auto 40px', lineHeight: 1.6 }}>
          Start free. Scale as you grow. No hidden fees, no surprises.
        </p>

        {/* Billing toggle */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, background: '#fff', border: '1.5px solid #E8E4DB', borderRadius: 100, padding: '6px 8px 6px 16px' }}>
          <span onClick={() => setYearly(false)} style={{ fontSize: 13, fontWeight: yearly ? 400 : 600, color: yearly ? '#5A5A5A' : '#0A0A0A', cursor: 'pointer', userSelect: 'none', transition: 'color 0.2s' }}>Monthly</span>
          <div onClick={() => setYearly(v => !v)} style={{ width: 44, height: 24, background: '#0A0A0A', borderRadius: 100, position: 'relative', cursor: 'pointer', transition: 'background 0.25s', flexShrink: 0 }}>
            <div style={{ width: 18, height: 18, background: '#fff', borderRadius: '50%', position: 'absolute', top: 3, left: 3, transition: 'transform 0.25s', transform: yearly ? 'translateX(20px)' : 'translateX(0)', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
          </div>
          <span onClick={() => setYearly(true)} style={{ fontSize: 13, fontWeight: yearly ? 600 : 400, color: yearly ? '#0A0A0A' : '#5A5A5A', cursor: 'pointer', userSelect: 'none', transition: 'color 0.2s' }}>Yearly</span>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#fff', background: '#16a34a', borderRadius: 100, padding: '4px 10px', fontFamily: "var(--font-syne), sans-serif", letterSpacing: '0.02em' }}>Save 20%</div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section style={{ padding: '0 5vw 100px' }}>
        <div className="pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, maxWidth: 1100, margin: '0 auto' }}>

          {/* Free */}
          <div className="pricing-card" style={{ background: '#fff', border: '1.5px solid #E8E4DB', borderRadius: 24, padding: '36px 32px', display: 'flex', flexDirection: 'column', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: 22, fontWeight: 800, letterSpacing: '-0.04em', marginBottom: 6 }}>Free</div>
            <div style={{ fontSize: 13, fontWeight: 300, color: '#5A5A5A', marginBottom: 28, lineHeight: 1.5 }}>Perfect for testing ideas and solo projects.</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 6 }}>
              <span style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: 20, fontWeight: 700, opacity: 0.6, marginTop: 4 }}>$</span>
              <span style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: 56, fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1, transition: 'opacity 0.2s, transform 0.2s' }}>{freePrice}</span>
            </div>
            <div style={{ fontSize: 13, color: '#5A5A5A', marginBottom: 32 }}>forever</div>
            <div style={{ height: 1, background: '#E8E4DB', marginBottom: 24 }} />
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12, flex: 1, marginBottom: 32 }}>
              {['1 bot', '50 pages crawled', '100 chats / month', 'Basic customization', 'Email support'].map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, lineHeight: 1.4 }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>{CHECK_BLACK}</div>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/demo" className="btn-card" style={{ background: '#0A0A0A', color: '#fff', border: 'none', borderRadius: 100, padding: '14px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, textDecoration: 'none', transition: 'background 0.15s, transform 0.15s' }}>
              Start Free {ARROW}
            </Link>
          </div>

          {/* Pro */}
          <div className="pricing-card card-pro" style={{ background: '#0A0A0A', border: '1.5px solid #111', borderRadius: 24, padding: '36px 32px', display: 'flex', flexDirection: 'column', boxShadow: '0 8px 40px rgba(0,0,0,0.3)', color: '#fff' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: "var(--font-syne), sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '5px 12px', borderRadius: 100, marginBottom: 20, width: 'fit-content' }}>
              🔥 Most Popular
            </div>
            <div style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: 22, fontWeight: 800, letterSpacing: '-0.04em', marginBottom: 6 }}>Pro</div>
            <div style={{ fontSize: 13, fontWeight: 300, color: '#888', marginBottom: 28, lineHeight: 1.5 }}>For growing businesses that need power and speed.</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 6 }}>
              <span style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: 20, fontWeight: 700, color: '#888', marginTop: 4 }}>$</span>
              <span style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: 56, fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1, transition: 'opacity 0.2s' }}>{proPrice}</span>
            </div>
            <div style={{ fontSize: 13, color: '#666', marginBottom: 32 }}>per month{yearly ? ' (billed yearly)' : ''}</div>
            <div style={{ height: 1, background: 'rgba(255,255,255,0.1)', marginBottom: 24 }} />
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12, flex: 1, marginBottom: 32 }}>
              {['Unlimited bots', '500 pages per bot', '5,000 chats / month', 'Advanced analytics', 'Custom branding', 'Priority support', 'API access'].map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, lineHeight: 1.4 }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>{CHECK_WHITE}</div>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/demo" className="btn-card" style={{ background: '#fff', color: '#0A0A0A', border: 'none', borderRadius: 100, padding: '14px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, textDecoration: 'none', transition: 'background 0.15s, transform 0.15s' }}>
              Start Free Trial {ARROW}
            </Link>
          </div>

          {/* Enterprise */}
          <div className="pricing-card" style={{ background: '#fff', border: '1.5px solid #E8E4DB', borderRadius: 24, padding: '36px 32px', display: 'flex', flexDirection: 'column', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: 22, fontWeight: 800, letterSpacing: '-0.04em', marginBottom: 6 }}>Enterprise</div>
            <div style={{ fontSize: 13, fontWeight: 300, color: '#5A5A5A', marginBottom: 28, lineHeight: 1.5 }}>For large teams with custom requirements and scale.</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 6 }}>
              <span style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: 36, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1 }}>Custom</span>
            </div>
            <div style={{ fontSize: 13, color: '#5A5A5A', marginBottom: 32 }}>pricing</div>
            <div style={{ height: 1, background: '#E8E4DB', marginBottom: 24 }} />
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12, flex: 1, marginBottom: 32 }}>
              {['Everything in Pro', 'Unlimited everything', 'Custom AI training', 'Dedicated support', 'SLA guarantees', 'On-premise option', 'Custom integrations'].map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, lineHeight: 1.4 }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>{CHECK_BLACK}</div>
                  {f}
                </li>
              ))}
            </ul>
            <a href="#faq" className="btn-card" style={{ background: 'transparent', color: '#0A0A0A', border: '1.5px solid #E8E4DB', borderRadius: 100, padding: '14px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, textDecoration: 'none', transition: 'border-color 0.15s, background 0.15s, transform 0.15s' }}>
              Contact Sales {ARROW}
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: '80px 5vw 100px', background: '#F5F1E8' }}>
        <div style={{ marginBottom: 52 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9A9A9A', fontFamily: "var(--font-syne), sans-serif", marginBottom: 12 }}>Support</div>
          <h2 style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.05 }}>
            Frequently asked<br />questions
          </h2>
        </div>
        <div className="faq-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, maxWidth: 900 }}>
          {faqs.map((faq, i) => (
            <div key={i} onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ background: '#fff', border: '1px solid #E8E4DB', cursor: 'pointer', overflow: 'hidden', borderRadius: i === 0 ? '16px 0 0 0' : i === 1 ? '0 16px 0 0' : i === faqs.length - 2 ? '0 0 0 16px' : i === faqs.length - 1 ? '0 0 16px 0' : 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 24px', gap: 16 }}>
                <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em', color: '#0A0A0A', lineHeight: 1.4, flex: 1 }}>{faq.q}</span>
                <button className={`faq-chevron${openFaq === i ? ' open' : ''}`} style={{ width: 28, height: 28, borderRadius: '50%', background: openFaq === i ? '#0A0A0A' : '#F5F1E8', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: openFaq === i ? '#fff' : '#5A5A5A' }}>
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </button>
              </div>
              <div className={`faq-answer${openFaq === i ? ' open' : ''}`}>
                <div style={{ fontSize: 13, lineHeight: 1.7, color: '#5A5A5A', paddingBottom: 22, fontWeight: 300 }}>{faq.a}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#0A0A0A', padding: '80px 5vw', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 800, letterSpacing: '-0.04em', color: '#fff', lineHeight: 1.05, marginBottom: 14 }}>
          Ready to get started?
        </h2>
        <p style={{ fontSize: 16, color: '#666', fontWeight: 300, marginBottom: 40, maxWidth: 440, marginLeft: 'auto', marginRight: 'auto' }}>
          Start your free trial. No credit card required.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/demo" style={{ background: '#fff', color: '#0A0A0A', border: 'none', borderRadius: 100, padding: '14px 32px', fontSize: 14, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            Start Free Trial
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M12 2L2 12M12 2H5M12 2V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </Link>
          <a href="#faq" style={{ background: 'transparent', color: '#fff', border: '1.5px solid #333', borderRadius: 100, padding: '14px 32px', fontSize: 14, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            Contact Sales
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M12 2L2 12M12 2H5M12 2V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
