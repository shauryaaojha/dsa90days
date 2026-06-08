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
    <div className="spotify-auth-container animate-fade-in">
      <div className="spotify-auth-card">
        <div className="spotify-auth-header">
          <div className="spotify-auth-logo">
            <span className="spotify-auth-logo-icon">⚡</span>
            <span>DSA TRACKER</span>
          </div>
          <h1 className="spotify-auth-title">Log in to DSA Tracker</h1>
          <p className="spotify-auth-subtitle">Continue your 90-day mastery plan</p>
        </div>

        {error && <div className="spotify-auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="spotify-form-group">
            <label className="spotify-form-label" htmlFor="login-email">
              Email Address
            </label>
            <input
              id="login-email"
              className="spotify-form-input"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="spotify-form-group">
            <label className="spotify-form-label" htmlFor="login-password">
              Password
            </label>
            <input
              id="login-password"
              className="spotify-form-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="spotify-auth-btn"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className="spotify-auth-footer">
          Don&apos;t have an account?{' '}
          <Link href="/register">Sign up for DSA Tracker</Link>
        </div>
      </div>
    </div>
  );
}
