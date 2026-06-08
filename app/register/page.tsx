'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const NAME_MAX = 50;

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

const pwdRules = [
  { label: 'At least 6 characters', test: (p: string) => p.length >= 6 },
  { label: 'One uppercase letter',  test: (p: string) => /[A-Z]/.test(p) },
  { label: 'One number',            test: (p: string) => /\d/.test(p) },
];

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName]                     = useState('');
  const [email, setEmail]                   = useState('');
  const [password, setPassword]             = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [captchaAnswer, setCaptchaAnswer]   = useState('');
  const [honeypot, setHoneypot]             = useState('');
  const [num1]  = useState(() => Math.floor(Math.random() * 9) + 1);
  const [num2]  = useState(() => Math.floor(Math.random() * 9) + 1);

  const [nameErr, setNameErr]   = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [confirmErr, setConfirmErr] = useState('');
  const [captchaErr, setCaptchaErr] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [pwdTouched, setPwdTouched] = useState(false);

  const allPwdOk = pwdRules.every(r => r.test(password));
  const captchaOk = captchaAnswer !== '' && parseInt(captchaAnswer) === num1 + num2;
  const confirmOk = confirmPassword !== '' && password === confirmPassword;

  const canSubmit =
    name.trim().length >= 2 &&
    isValidEmail(email) &&
    allPwdOk &&
    confirmOk &&
    captchaOk &&
    !nameErr && !emailErr &&
    !loading;

  const handleNameBlur = () => {
    const trimmed = name.trim();
    if (!trimmed) setNameErr('Name is required');
    else if (trimmed.length < 2) setNameErr('Name must be at least 2 characters');
    else setNameErr('');
    setName(trimmed); // Rule 6: auto-trim on blur
  };

  const handleEmailBlur = () => {
    if (!email.trim()) setEmailErr('Email is required');
    else if (!isValidEmail(email)) setEmailErr('Enter a valid email address');
    else setEmailErr('');
    setEmail(email.trim().toLowerCase()); // Rule 6: normalize on blur
  };

  const handleConfirmBlur = () => {
    if (!confirmPassword) setConfirmErr('Please confirm your password');
    else if (password !== confirmPassword) setConfirmErr('Passwords do not match');
    else setConfirmErr('');
  };

  const handleCaptchaBlur = () => {
    if (!captchaAnswer) setCaptchaErr('Please answer the question');
    else if (parseInt(captchaAnswer) !== num1 + num2) setCaptchaErr('Incorrect — try again');
    else setCaptchaErr('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim().toLowerCase(), password, website: honeypot, num1, num2, captchaAnswer }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Registration failed');
      } else {
        router.push('/login');
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
            <h2 className="auth-brand-heading">Start your<br />90-day journey.</h2>
            <p className="auth-brand-sub">Join engineers who&apos;ve structured their prep and landed top-tier offers. Free, always.</p>
            <div className="auth-brand-checklist">
              <div className="auth-brand-check-item"><i className="ti ti-check"></i>200+ curated LeetCode problems</div>
              <div className="auth-brand-check-item"><i className="ti ti-check"></i>Daily progress tracking &amp; streaks</div>
              <div className="auth-brand-check-item"><i className="ti ti-check"></i>20 essential algorithm patterns</div>
              <div className="auth-brand-check-item"><i className="ti ti-check"></i>Video solutions &amp; curated resources</div>
            </div>
            <div className="auth-deco-cards" style={{ marginTop: '28px' }}>
              <div className="auth-deco-card"><div className="auth-deco-dot green"></div><span className="auth-deco-card-text">Sliding Window → O(n)</span></div>
              <div className="auth-deco-card"><div className="auth-deco-dot orange"></div><span className="auth-deco-card-text">Two Pointers → O(n)</span></div>
            </div>
          </div>
          <div className="auth-brand-quote">&ldquo;कर्मण्येवाधिकारस्ते मा फलेषु कदाचन&rdquo; — Bhagavad Gita, 2:47</div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="auth-split-right">
        <div className="auth-form-card">
          <div className="auth-form-header">
            <h1 className="auth-form-title">Create your account</h1>
            <p className="auth-form-sub">Free forever. No credit card needed.</p>
          </div>

          {/* Google */}
          <button type="button" className="auth-google-btn" onClick={handleGoogle} disabled={googleLoading || loading}>
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

          <div className="auth-divider"><span>or sign up with email</span></div>

          {error && (
            <div className="auth-error-box">
              <i className="ti ti-alert-circle" style={{ fontSize: '15px' }}></i>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {/* Name */}
            <div className="auth-field">
              <div className="auth-field-label-row">
                <label className="auth-field-label" htmlFor="register-name">
                  Name <span className="auth-required">*</span>
                </label>
                <span className={`auth-char-count ${name.length > NAME_MAX * 0.85 ? 'auth-char-warn' : ''}`}>
                  {name.length}/{NAME_MAX}
                </span>
              </div>
              <div className={`auth-input-wrap ${nameErr ? 'auth-input-error' : name.trim().length >= 2 ? 'auth-input-ok' : ''}`}>
                <i className="ti ti-user auth-input-icon"></i>
                <input
                  id="register-name"
                  className="auth-input"
                  type="text"
                  placeholder="Your full name"
                  value={name}
                  maxLength={NAME_MAX}
                  onChange={(e) => { setName(e.target.value); if (nameErr) setNameErr(''); }}
                  onBlur={handleNameBlur}
                  autoComplete="name"
                />
                {name.trim().length >= 2 && !nameErr && <i className="ti ti-circle-check auth-field-ok-icon"></i>}
              </div>
              {nameErr && <p className="auth-field-err"><i className="ti ti-alert-circle"></i>{nameErr}</p>}
            </div>

            {/* Email */}
            <div className="auth-field">
              <label className="auth-field-label" htmlFor="register-email">
                Email <span className="auth-required">*</span>
              </label>
              <div className={`auth-input-wrap ${emailErr ? 'auth-input-error' : email && isValidEmail(email) ? 'auth-input-ok' : ''}`}>
                <i className="ti ti-mail auth-input-icon"></i>
                <input
                  id="register-email"
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

            {/* Password + live checklist */}
            <div className="auth-field">
              <label className="auth-field-label" htmlFor="register-password">
                Password <span className="auth-required">*</span>
              </label>
              <div className={`auth-input-wrap ${pwdTouched && !allPwdOk ? 'auth-input-error' : allPwdOk ? 'auth-input-ok' : ''}`}>
                <i className="ti ti-lock auth-input-icon"></i>
                <input
                  id="register-password"
                  className="auth-input"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (!pwdTouched) setPwdTouched(true); }}
                  autoComplete="new-password"
                />
                {allPwdOk && <i className="ti ti-circle-check auth-field-ok-icon"></i>}
              </div>
              {/* Live password requirements — only show once user starts typing */}
              {pwdTouched && (
                <div className="auth-pwd-rules">
                  {pwdRules.map((rule) => {
                    const ok = rule.test(password);
                    return (
                      <div key={rule.label} className={`auth-pwd-rule ${ok ? 'rule-ok' : 'rule-fail'}`}>
                        <i className={`ti ${ok ? 'ti-circle-check' : 'ti-circle-x'}`}></i>
                        {rule.label}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Confirm password — live match indicator */}
            <div className="auth-field">
              <label className="auth-field-label" htmlFor="register-confirm">
                Confirm Password <span className="auth-required">*</span>
              </label>
              <div className={`auth-input-wrap ${confirmErr ? 'auth-input-error' : confirmOk ? 'auth-input-ok' : ''}`}>
                <i className="ti ti-lock-check auth-input-icon"></i>
                <input
                  id="register-confirm"
                  className="auth-input"
                  type="password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); if (confirmErr) setConfirmErr(''); }}
                  onBlur={handleConfirmBlur}
                  autoComplete="new-password"
                />
                {confirmOk && <i className="ti ti-circle-check auth-field-ok-icon"></i>}
              </div>
              {confirmErr && <p className="auth-field-err"><i className="ti ti-alert-circle"></i>{confirmErr}</p>}
              {confirmPassword && !confirmOk && !confirmErr && (
                <p className="auth-field-warn"><i className="ti ti-alert-triangle"></i>Passwords don&apos;t match yet</p>
              )}
            </div>

            {/* Honeypot */}
            <div style={{ display: 'none' }}>
              <input id="website" type="text" name="website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
            </div>

            {/* Captcha */}
            <div className="auth-field">
              <label className="auth-field-label" htmlFor="register-captcha">
                Quick check: what is <strong style={{ color: 'var(--on-surface)' }}>{num1} + {num2}</strong>?{' '}
                <span className="auth-required">*</span>
              </label>
              <div className={`auth-input-wrap ${captchaErr ? 'auth-input-error' : captchaOk ? 'auth-input-ok' : ''}`}>
                <i className="ti ti-math auth-input-icon"></i>
                <input
                  id="register-captcha"
                  className="auth-input"
                  type="number"
                  placeholder="Your answer"
                  value={captchaAnswer}
                  onChange={(e) => { setCaptchaAnswer(e.target.value); if (captchaErr) setCaptchaErr(''); }}
                  onBlur={handleCaptchaBlur}
                />
                {captchaOk && <i className="ti ti-circle-check auth-field-ok-icon"></i>}
              </div>
              {captchaErr && <p className="auth-field-err"><i className="ti ti-alert-circle"></i>{captchaErr}</p>}
            </div>

            <button type="submit" className="auth-submit-btn" disabled={!canSubmit}>
              {loading ? (
                <><span className="auth-btn-spinner"></span>Creating account...</>
              ) : (
                <><i className="ti ti-user-plus" style={{ fontSize: '16px' }}></i>Create Account</>
              )}
            </button>

            {!canSubmit && !loading && (name || email || password) && (
              <p className="auth-hint">
                <i className="ti ti-info-circle"></i>
                Fill all fields correctly to create your account
              </p>
            )}
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
