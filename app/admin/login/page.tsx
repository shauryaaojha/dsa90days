'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error ?? 'Invalid password');
      }
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--background)',
        padding: '1rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '380px',
          background: 'var(--surface-container-lowest)',
          border: '1px solid var(--outline-variant)',
          borderRadius: '16px',
          padding: '2.5rem 2rem',
          boxShadow: 'var(--shadow-float)',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: 'var(--primary)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '26px',
              fontFamily: 'serif',
              margin: '0 auto 12px',
            }}
          >
            ॐ
          </div>
          <h1 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--on-surface)', margin: 0 }}>
            Admin Panel
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--outline)', marginTop: '4px' }}>
            DSA 90-Day Tracker
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label
              htmlFor="password"
              style={{ fontSize: '13px', fontWeight: 600, color: 'var(--on-surface-variant)' }}
            >
              Admin Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
              autoFocus
              style={{
                padding: '0.65rem 0.875rem',
                borderRadius: '10px',
                border: `1.5px solid ${error ? 'var(--error)' : 'var(--outline-variant)'}`,
                background: 'var(--surface-container-lowest)',
                fontSize: '14px',
                color: 'var(--on-surface)',
                outline: 'none',
                transition: 'border-color 150ms',
              }}
            />
          </div>

          {error && (
            <p
              style={{
                fontSize: '13px',
                color: 'var(--error)',
                background: 'var(--error-container)',
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                margin: 0,
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            style={{
              padding: '0.7rem 1rem',
              borderRadius: '10px',
              background: loading || !password ? 'var(--outline-variant)' : 'var(--primary)',
              color: loading || !password ? 'var(--outline)' : 'white',
              fontSize: '14px',
              fontWeight: 700,
              cursor: loading || !password ? 'not-allowed' : 'pointer',
              border: 'none',
              transition: 'all 150ms',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            {loading ? (
              <>
                <span className="spinner" style={{ width: '14px', height: '14px' }} />
                Verifying...
              </>
            ) : (
              <>
                <i className="ti ti-lock-open" style={{ fontSize: '14px' }}></i>
                Enter Admin Panel
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
