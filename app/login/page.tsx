'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        router.push('/');
        router.refresh();
      }
    } catch {
      setError('Something went wrong. Please try again.');
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
            <h2 className="auth-brand-heading">Back to the grind.</h2>
            <p className="auth-brand-sub">Your progress is waiting. Every day you practice, you compound your edge over the competition.</p>
            <div className="auth-brand-stats">
              <div className="auth-brand-stat">
                <span className="auth-brand-stat-num">200+</span>
                <span className="auth-brand-stat-lbl">Problems</span>
              </div>
              <div className="auth-brand-stat">
                <span className="auth-brand-stat-num">90</span>
                <span className="auth-brand-stat-lbl">Day Plan</span>
              </div>
              <div className="auth-brand-stat">
                <span className="auth-brand-stat-num">20</span>
                <span className="auth-brand-stat-lbl">Patterns</span>
              </div>
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
            <h1 className="auth-form-title">Welcome back</h1>
            <p className="auth-form-sub">Sign in to continue your journey</p>
          </div>

          {error && (
            <div className="auth-error-box">
              <i className="ti ti-alert-circle" style={{ fontSize: '15px' }}></i>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label className="auth-field-label" htmlFor="login-email">Email</label>
              <div className="auth-input-wrap">
                <i className="ti ti-mail auth-input-icon"></i>
                <input
                  id="login-email"
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

            <div className="auth-field">
              <label className="auth-field-label" htmlFor="login-password">Password</label>
              <div className="auth-input-wrap">
                <i className="ti ti-lock auth-input-icon"></i>
                <input
                  id="login-password"
                  className="auth-input"
                  type="password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="auth-btn-spinner"></span>
                  Signing in...
                </>
              ) : (
                <>
                  <i className="ti ti-login-2" style={{ fontSize: '16px' }}></i>
                  Sign In
                </>
              )}
            </button>
          </form>

          <p className="auth-switch-text">
            New here?{' '}
            <Link href="/register" className="auth-switch-link">Create a free account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
