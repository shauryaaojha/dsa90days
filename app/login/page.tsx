'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [pwdErr, setPwdErr]     = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const canSubmit = email.trim() && password && !emailErr && !loading;

  const handleEmailBlur = () => {
    if (!email.trim()) {
      setEmailErr('Email is required');
    } else if (!isValidEmail(email)) {
      setEmailErr('Enter a valid email address');
    } else {
      setEmailErr('');
    }
  };

  const handlePwdBlur = () => {
    setPwdErr(!password ? 'Password is required' : '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setError('');
    setLoading(true);
    try {
      const result = await signIn('credentials', {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });
      if (result?.error) {
        setError('Incorrect email or password. Please try again.');
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

  const handleGoogle = async () => {
    setGoogleLoading(true);
    await signIn('google', { callbackUrl: '/' });
  };

  return (
    <div className="auth-page-container animate-fade-in">
      {/* ── Left brand panel ── */}
      <div className="auth-split-left">
        <div className="auth-brand-panel">
          <div className="auth-brand-logo">
            <div className="auth-brand-logo-icon" style={{ fontSize: '20px', fontFamily: 'serif' }}>ॐ</div>
            <span>DSA Tracker</span>
          </div>
          <div className="auth-brand-body">
            <h2 className="auth-brand-heading">Back to<br />the grind.</h2>
            <p className="auth-brand-sub">Your progress is waiting. Every day you practice, you compound your edge over the competition.</p>
            <div className="auth-brand-stats">
              <div className="auth-brand-stat"><span className="auth-brand-stat-num">200+</span><span className="auth-brand-stat-lbl">Problems</span></div>
              <div className="auth-brand-stat"><span className="auth-brand-stat-num">90</span><span className="auth-brand-stat-lbl">Days</span></div>
              <div className="auth-brand-stat"><span className="auth-brand-stat-num">20</span><span className="auth-brand-stat-lbl">Patterns</span></div>
            </div>
            <div className="auth-deco-cards">
              <div className="auth-deco-card"><div className="auth-deco-dot green"></div><span className="auth-deco-card-text">twoSum(nums, target) → O(n)</span></div>
              <div className="auth-deco-card"><div className="auth-deco-dot orange"></div><span className="auth-deco-card-text">BFS: queue + visited set</span></div>
              <div className="auth-deco-card"><div className="auth-deco-dot red"></div><span className="auth-deco-card-text">dp[i] = dp[i-1] + dp[i-2]</span></div>
            </div>
          </div>
          <div className="auth-brand-quote">&ldquo;कर्मण्येवाधिकारस्ते मा फलेषु कदाचन&rdquo; — Bhagavad Gita, 2:47</div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="auth-split-right">
        <div className="auth-form-card">
          <div className="auth-form-header">
            <h1 className="auth-form-title">Welcome back</h1>
            <p className="auth-form-sub">Sign in to continue your journey</p>
          </div>

          {/* Google button */}
          <button
            type="button"
            className="auth-google-btn"
            onClick={handleGoogle}
            disabled={googleLoading || loading}
          >
            {googleLoading ? (
              <span className="auth-btn-spinner" style={{ borderColor: 'rgba(0,0,0,0.2)', borderTopColor: '#444' }}></span>
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
            )}
            Continue with Google
          </button>

          <div className="auth-divider"><span>or sign in with email</span></div>

          {error && (
            <div className="auth-error-box">
              <i className="ti ti-alert-circle" style={{ fontSize: '15px' }}></i>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {/* Email */}
            <div className="auth-field">
              <label className="auth-field-label" htmlFor="login-email">
                Email <span className="auth-required">*</span>
              </label>
              <div className={`auth-input-wrap ${emailErr ? 'auth-input-error' : email && isValidEmail(email) ? 'auth-input-ok' : ''}`}>
                <i className="ti ti-mail auth-input-icon"></i>
                <input
                  id="login-email"
                  className="auth-input"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (emailErr) setEmailErr(''); }}
                  onBlur={handleEmailBlur}
                  autoComplete="email"
                />
                {email && isValidEmail(email) && <i className="ti ti-circle-check auth-field-ok-icon"></i>}
              </div>
              {emailErr && <p className="auth-field-err"><i className="ti ti-alert-circle"></i>{emailErr}</p>}
            </div>

            {/* Password */}
            <div className="auth-field">
              <label className="auth-field-label" htmlFor="login-password">
                Password <span className="auth-required">*</span>
              </label>
              <div className={`auth-input-wrap ${pwdErr ? 'auth-input-error' : ''}`}>
                <i className="ti ti-lock auth-input-icon"></i>
                <input
                  id="login-password"
                  className="auth-input"
                  type="password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (pwdErr) setPwdErr(''); }}
                  onBlur={handlePwdBlur}
                  autoComplete="current-password"
                />
              </div>
              {pwdErr && <p className="auth-field-err"><i className="ti ti-alert-circle"></i>{pwdErr}</p>}
            </div>

            <button type="submit" className="auth-submit-btn" disabled={!canSubmit}>
              {loading ? (
                <><span className="auth-btn-spinner"></span>Signing in...</>
              ) : (
                <><i className="ti ti-login-2" style={{ fontSize: '16px' }}></i>Sign In</>
              )}
            </button>

            {!canSubmit && (email || password) && !loading && (
              <p className="auth-hint">
                <i className="ti ti-info-circle"></i>
                {!email.trim() ? 'Enter your email to continue' : !isValidEmail(email) ? 'Fix the email address above' : 'Enter your password to continue'}
              </p>
            )}
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
