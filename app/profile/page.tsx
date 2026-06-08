'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { problems } from '@/data/problems';

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState<{ problemId: string; completed: boolean; completedAt: string | null }[]>([]);

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/login');
    if (session?.user?.name) setName(session.user.name);
  }, [session, status, router]);

  useEffect(() => {
    if (session) {
      fetch('/api/progress')
        .then((r) => r.json())
        .then((d) => setProgress(d.progress || []));
    }
  }, [session]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Update failed');
      } else {
        await update({ name: data.user.name });
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="loading-spinner">
        <div className="spinner" />
      </div>
    );
  }

  if (!session) return null;

  const completed = progress.filter((p) => p.completed);
  const totalProblems = problems.length;

  // Streak calc
  const completedDates = new Set(
    completed.filter((p) => p.completedAt).map((p) =>
      new Date(p.completedAt!).toLocaleDateString('en-CA')
    )
  );
  let streak = 0;
  const checkDate = new Date();
  const todayStr = checkDate.toLocaleDateString('en-CA');
  if (completedDates.has(todayStr)) {
    streak++;
    checkDate.setDate(checkDate.getDate() - 1);
    while (completedDates.has(checkDate.toLocaleDateString('en-CA'))) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
  }

  const initials = (session.user?.name || 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const pct = totalProblems > 0 ? Math.round((completed.length / totalProblems) * 100) : 0;

  return (
    <div className="profile-page animate-fade-in">
      {/* Hero */}
      <div className="profile-hero">
        <div className="profile-avatar-lg">{initials}</div>
        <div className="profile-hero-info">
          <div className="profile-hero-name">{session.user?.name}</div>
          <div className="profile-hero-email">{session.user?.email}</div>
          <div className="profile-hero-since">
            <i className="ti ti-calendar" style={{ fontSize: '12px' }}></i>
            {' '}DSA Tracker member
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="profile-card">
        <div className="profile-card-title">
          <i className="ti ti-chart-bar" style={{ fontSize: '14px', color: 'var(--primary)' }}></i>
          Your stats
        </div>
        <div className="profile-stats-grid">
          <div className="profile-stat-card">
            <span className="profile-stat-val">{completed.length}</span>
            <span className="profile-stat-lbl">Solved</span>
          </div>
          <div className="profile-stat-card">
            <span className="profile-stat-val">{pct}%</span>
            <span className="profile-stat-lbl">Complete</span>
          </div>
          <div className="profile-stat-card">
            <span className="profile-stat-val">{streak}</span>
            <span className="profile-stat-lbl">Day streak</span>
          </div>
        </div>
      </div>

      {/* Edit name */}
      <div className="profile-card">
        <div className="profile-card-title">
          <i className="ti ti-user-edit" style={{ fontSize: '14px', color: 'var(--primary)' }}></i>
          Edit profile
        </div>

        {error && (
          <div className="auth-error-box" style={{ marginBottom: '16px' }}>
            <i className="ti ti-alert-circle" style={{ fontSize: '15px' }}></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSave}>
          <div className="profile-field">
            <label className="profile-field-label" htmlFor="profile-name">Display name</label>
            <div className="profile-input-wrap">
              <i className="ti ti-user auth-input-icon"></i>
              <input
                id="profile-name"
                className="profile-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                minLength={2}
              />
            </div>
          </div>

          <div className="profile-field">
            <label className="profile-field-label">Email</label>
            <div className="profile-input-wrap disabled">
              <i className="ti ti-mail auth-input-icon"></i>
              <input
                className="profile-input"
                type="email"
                value={session.user?.email || ''}
                disabled
              />
            </div>
          </div>

          <button type="submit" className="profile-save-btn" disabled={saving}>
            {saving ? (
              <>
                <span className="auth-btn-spinner"></span>
                Saving...
              </>
            ) : (
              <>
                <i className="ti ti-device-floppy" style={{ fontSize: '15px' }}></i>
                Save changes
              </>
            )}
          </button>

          {success && (
            <div className="profile-success-msg">
              <i className="ti ti-circle-check" style={{ fontSize: '16px' }}></i>
              Profile updated!
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
