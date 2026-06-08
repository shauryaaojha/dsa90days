'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Bot Prevention state
  const [honeypot, setHoneypot] = useState('');
  const [num1, setNum1] = useState(() => Math.floor(Math.random() * 9) + 1);
  const [num2, setNum2] = useState(() => Math.floor(Math.random() * 9) + 1);
  const [captchaAnswer, setCaptchaAnswer] = useState('');

  const refreshCaptcha = () => {
    setNum1(Math.floor(Math.random() * 9) + 1);
    setNum2(Math.floor(Math.random() * 9) + 1);
    setCaptchaAnswer('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (parseInt(captchaAnswer) !== num1 + num2) {
      setError('Human verification failed. Please solve the math problem correctly.');
      refreshCaptcha();
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          email, 
          password, 
          website: honeypot, 
          num1, 
          num2, 
          captchaAnswer 
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed');
        refreshCaptcha();
      } else {
        router.push('/login');
      }
    } catch {
      setError('Something went wrong. Please try again.');
      refreshCaptcha();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container animate-fade-in">
      <div className="auth-split-left">
        <div className="auth-brand-panel">
          <div className="auth-brand-logo">
            <i className="ti ti-code" style={{ fontSize: '22px' }}></i>
            <span>DSA Tracker</span>
          </div>
          <div className="auth-brand-body">
            <h2 className="auth-brand-heading">Start your 90-day journey.</h2>
            <p className="auth-brand-sub">Join engineers who&apos;ve structured their prep and landed top-tier offers. Free, always.</p>
            <div className="auth-brand-checklist">
              <div className="auth-brand-check-item"><i className="ti ti-check"></i> 200+ curated LeetCode problems</div>
              <div className="auth-brand-check-item"><i className="ti ti-check"></i> Daily progress tracking &amp; streaks</div>
              <div className="auth-brand-check-item"><i className="ti ti-check"></i> 20 essential algorithm patterns</div>
              <div className="auth-brand-check-item"><i className="ti ti-check"></i> Video solutions &amp; curated resources</div>
            </div>
          </div>
          <div className="auth-brand-quote">
            &ldquo;कर्मण्येवाधिकारस्ते मा फलेषु कदाचन&rdquo;
          </div>
        </div>
      </div>

      <div className="auth-split-right">
        <div className="auth-form-card">
          <div className="auth-form-header">
            <h1 className="auth-form-title">Create your account</h1>
            <p className="auth-form-sub">Free forever. No credit card needed.</p>
          </div>

          {error && (
            <div className="auth-error-box">
              <i className="ti ti-alert-circle" style={{ fontSize: '15px' }}></i>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label className="auth-field-label" htmlFor="register-name">Name</label>
              <div className="auth-input-wrap">
                <i className="ti ti-user auth-input-icon"></i>
                <input
                  id="register-name"
                  className="auth-input"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-field-label" htmlFor="register-email">Email</label>
              <div className="auth-input-wrap">
                <i className="ti ti-mail auth-input-icon"></i>
                <input
                  id="register-email"
                  className="auth-input"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="auth-field-row">
              <div className="auth-field">
                <label className="auth-field-label" htmlFor="register-password">Password</label>
                <div className="auth-input-wrap">
                  <i className="ti ti-lock auth-input-icon"></i>
                  <input
                    id="register-password"
                    className="auth-input"
                    type="password"
                    placeholder="Min. 6 chars"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    autoComplete="new-password"
                  />
                </div>
              </div>
              <div className="auth-field">
                <label className="auth-field-label" htmlFor="register-confirm">Confirm</label>
                <div className="auth-input-wrap">
                  <i className="ti ti-lock-check auth-input-icon"></i>
                  <input
                    id="register-confirm"
                    className="auth-input"
                    type="password"
                    placeholder="Re-enter"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'none' }}>
              <input id="website" type="text" name="website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
            </div>

            <div className="auth-field auth-captcha-field">
              <label className="auth-field-label" htmlFor="register-captcha">
                Quick check: what is <strong>{num1} + {num2}</strong>?
              </label>
              <div className="auth-input-wrap">
                <i className="ti ti-math auth-input-icon"></i>
                <input
                  id="register-captcha"
                  className="auth-input"
                  type="number"
                  placeholder="Answer"
                  value={captchaAnswer}
                  onChange={(e) => setCaptchaAnswer(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="auth-btn-spinner"></span>
                  Creating account...
                </>
              ) : (
                <>
                  <i className="ti ti-user-plus" style={{ fontSize: '16px' }}></i>
                  Create Account
                </>
              )}
            </button>
          </form>

          <p className="auth-switch-text">
            Already have an account?{' '}
            <Link href="/login" className="auth-switch-link">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
