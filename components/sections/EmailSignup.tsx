'use client';

import { useState } from 'react';
import { Mail, Check, AlertCircle, ArrowRight } from 'lucide-react';

/* =========================================================
   Email Signup — "Unlock 10% off your first order"
   White canvas, black typography, gold accent reserved
   exclusively for the headline highlight.
   ========================================================= */
export default function EmailSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'homepage-signup' }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        setMessage(data.error || 'Please try again.');
        return;
      }

      setStatus('success');
      setMessage(
        data.alreadySubscribed
          ? "You're already on our list — thank you!"
          : "You're in. Use WELCOME10 for 10% off your first order."
      );
      if (!data.alreadySubscribed) setEmail('');
    } catch {
      setStatus('error');
      setMessage('Could not subscribe. Please try again.');
    }
  };

  return (
    <section className="sinzu-signup" aria-label="Join the community">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Inter:wght@300;400;500;600&display=swap');

        :root {
          --ease-out-expo: cubic-bezier(0.22, 1, 0.36, 1);
        }

        .sinzu-signup {
          position: relative;
          background: #fff;
          border-top: 1px solid rgba(0, 0, 0, 0.06);
          font-family: 'Inter', 'Helvetica Neue', sans-serif;
          padding: clamp(72px, 10vw, 120px) clamp(20px, 5vw, 60px);
          overflow: hidden;
        }

        .su-inner {
          max-width: 520px;
          margin: 0 auto;
          text-align: center;
          position: relative;
          z-index: 1;
        }

        .su-eyebrow {
          font-size: 10px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(0, 0, 0, 0.4);
          margin-bottom: 1.2rem;
          font-weight: 500;
        }

        .su-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-weight: 600;
          font-style: italic;
          font-size: clamp(2rem, 4.5vw, 3.2rem);
          line-height: 1.05;
          color: #000;
          margin: 0 0 1.2rem;
        }

        .su-title .accent {
          background: linear-gradient(
            135deg,
            #c9a227 0%,
            #f5e7a3 35%,
            #ffffff 50%,
            #f5e7a3 65%,
            #c9a227 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          animation: goldShine 6s ease-in-out infinite alternate;
        }

        @keyframes goldShine {
          0% { background-position: 0% 0; }
          100% { background-position: 100% 0; }
        }

        .su-lede {
          font-size: 14px;
          line-height: 1.7;
          color: rgba(0, 0, 0, 0.5);
          max-width: 40ch;
          margin: 0 auto 2.5rem;
          font-weight: 300;
        }

        /* Form — minimal pill with black circle submit */
        .su-form {
          display: flex;
          align-items: center;
          gap: 0;
          max-width: 420px;
          margin: 0 auto;
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 999px;
          background: #fff;
          padding: 4px;
          transition: border-color 0.4s var(--ease-out-expo);
        }

        .su-form:focus-within {
          border-color: rgba(0, 0, 0, 0.25);
        }

        .su-form input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          padding: 12px 16px 12px 20px;
          font-size: 13px;
          color: #000;
          font-family: inherit;
          letter-spacing: 0.01em;
        }

        .su-form input::placeholder {
          color: rgba(0, 0, 0, 0.35);
        }

        .su-form button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          padding: 10px 22px;
          border: none;
          border-radius: 999px;
          background: #000;
          color: #fff;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.4s var(--ease-out-expo);
          font-family: inherit;
          white-space: nowrap;
        }

        .su-form button:hover:not(:disabled) {
          background: #1a1a1a;
          transform: translateY(-1px);
        }

        .su-form button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .su-note {
          margin-top: 1rem;
          font-size: 11px;
          letter-spacing: 0.04em;
          color: rgba(0, 0, 0, 0.35);
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
        }

        .su-note svg {
          color: rgba(0, 0, 0, 0.25);
        }

        /* Status messages */
        .su-status {
          margin-top: 1.5rem;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.7rem 1.4rem;
          border-radius: 999px;
          font-size: 12px;
          letter-spacing: 0.02em;
          font-weight: 400;
        }

        .su-status.success {
          background: #fff;
          color: #000;
          border: 1px solid rgba(0, 0, 0, 0.1);
        }

        .su-status.success svg {
          color: #c9a227;
        }

        .su-status.error {
          background: #fff;
          color: rgba(0, 0, 0, 0.7);
          border: 1px solid rgba(0, 0, 0, 0.1);
        }

        .su-status.error svg {
          color: rgba(0, 0, 0, 0.4);
        }

        /* Entrance animations */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .anim-fade-up {
          animation: fadeInUp 0.8s var(--ease-out-expo) forwards;
          opacity: 0;
        }

        .anim-d1 { animation-delay: 0.1s; }
        .anim-d2 { animation-delay: 0.25s; }
        .anim-d3 { animation-delay: 0.4s; }

        @media (prefers-reduced-motion: reduce) {
          .anim-fade-up {
            animation: none;
            opacity: 1;
          }
        }
      `}</style>

      <div className="su-inner">
        <div className="su-eyebrow anim-fade-up anim-d1">Join The Community</div>

        <h2 className="su-title anim-fade-up anim-d2">
          Unlock <span className="accent">10% Off</span> Your First Order
        </h2>

        <p className="su-lede anim-fade-up anim-d3">
          Be the first to hear about new drops, restocks, and the Mall of America opening. No spam — just the good stuff.
        </p>

        <form className="su-form anim-fade-up anim-d3" onSubmit={submit}>
          <input
            type="email"
            required
            autoComplete="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'loading'}
          />
          <button type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Joining' : (
              <>
                Join
                <ArrowRight size={12} strokeWidth={2.5} />
              </>
            )}
          </button>
        </form>

        <p className="su-note anim-fade-up anim-d3">
          <Mail size={12} />
          We&apos;ll email you your code — check spam if it doesn&apos;t arrive.
        </p>

        {status === 'success' && (
          <div className="su-status success">
            <Check size={14} strokeWidth={2.5} /> {message}
          </div>
        )}
        {status === 'error' && (
          <div className="su-status error">
            <AlertCircle size={14} strokeWidth={2} /> {message}
          </div>
        )}
      </div>
    </section>
  );
}