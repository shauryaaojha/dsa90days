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
    <div className="spotify-auth-container animate-fade-in">
      <div className="spotify-auth-card">
        <div className="spotify-auth-header">
          <div className="spotify-auth-logo">
            <span className="spotify-auth-logo-icon">⚡</span>
            <span>DSA TRACKER</span>
          </div>
          <h1 className="spotify-auth-title">Sign up to start tracking</h1>
          <p className="spotify-auth-subtitle">Create a free account to track your progress</p>
        </div>

        {error && <div className="spotify-auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="spotify-form-group">
            <label className="spotify-form-label" htmlFor="register-name">
              Full Name
            </label>
            <input
              id="register-name"
              className="spotify-form-input"
              type="text"
              placeholder="What should we call you?"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="spotify-form-group">
            <label className="spotify-form-label" htmlFor="register-email">
              Email Address
            </label>
            <input
              id="register-email"
              className="spotify-form-input"
              type="email"
              placeholder="name@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="spotify-form-group">
            <label className="spotify-form-label" htmlFor="register-password">
              Password
            </label>
            <input
              id="register-password"
              className="spotify-form-input"
              type="password"
              placeholder="Create a password (min. 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <div className="spotify-form-group">
            <label className="spotify-form-label" htmlFor="register-confirm">
              Confirm Password
            </label>
            <input
              id="register-confirm"
              className="spotify-form-input"
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {/* Honeypot field to catch automated bots */}
          <div style={{ display: 'none' }}>
            <label htmlFor="website">Leave this field blank</label>
            <input
              id="website"
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          <div className="spotify-form-group">
            <label className="spotify-form-label" htmlFor="register-captcha">
              Human Verification: What is {num1} + {num2}?
            </label>
            <input
              id="register-captcha"
              className="spotify-form-input"
              type="number"
              placeholder="Sum of the two numbers"
              value={captchaAnswer}
              onChange={(e) => setCaptchaAnswer(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="spotify-auth-btn"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="spotify-auth-footer">
          Already have an account?{' '}
          <Link href="/login">Log in here</Link>
        </div>
      </div>
    </div>
  );
}
