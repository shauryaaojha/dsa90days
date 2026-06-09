'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Stats {
  totalUsers: number;
  pledgedUsers: number;
  activeUsers7d: number;
  totalCompletions: number;
}

interface UserRow {
  id: string;
  name: string;
  email: string;
  provider: string;
  createdAt: string;
  pledgeAcceptedAt: string | null;
  problemsSolved: number;
  lastActive: string | null;
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: string;
  label: string;
  value: number | string;
  color: string;
}) {
  return (
    <div
      style={{
        background: 'var(--surface-container-lowest)',
        border: '1px solid var(--outline-variant)',
        borderRadius: '14px',
        padding: '1.25rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '11px',
          background: `${color}18`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color,
          fontSize: '20px',
          flexShrink: 0,
        }}
      >
        <i className={`ti ${icon}`}></i>
      </div>
      <div>
        <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--on-surface)', lineHeight: 1 }}>
          {value}
        </div>
        <div style={{ fontSize: '12.5px', color: 'var(--outline)', marginTop: '4px', fontWeight: 500 }}>
          {label}
        </div>
      </div>
    </div>
  );
}

function fmt(dateStr: string | null) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentUsers, setRecentUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/stats').then((r) => r.json()),
      fetch('/api/admin/users').then((r) => r.json()),
    ])
      .then(([statsData, usersData]) => {
        setStats(statsData.stats ?? null);
        setRecentUsers((usersData.users ?? []).slice(0, 5));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--on-surface)', margin: 0 }}>
          Dashboard
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--outline)', marginTop: '4px' }}>
          Overview of all users and activity
        </p>
      </div>

      {/* Stat cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
          gap: '1rem',
          marginBottom: '2.5rem',
        }}
      >
        <StatCard icon="ti-users" label="Total Users" value={stats?.totalUsers ?? 0} color="#944521" />
        <StatCard icon="ti-writing" label="Pledged Users" value={stats?.pledgedUsers ?? 0} color="#52634d" />
        <StatCard
          icon="ti-flame"
          label="Active (last 7 days)"
          value={stats?.activeUsers7d ?? 0}
          color="#c97215"
        />
        <StatCard
          icon="ti-checkbox"
          label="Total Completions"
          value={stats?.totalCompletions ?? 0}
          color="#1a6b9a"
        />
      </div>

      {/* Recent users */}
      <div
        style={{
          background: 'var(--surface-container-lowest)',
          border: '1px solid var(--outline-variant)',
          borderRadius: '14px',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div
          style={{
            padding: '1rem 1.5rem',
            borderBottom: '1px solid var(--outline-variant)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--on-surface)', margin: 0 }}>
            Recent Signups
          </h2>
          <Link
            href="/admin/users"
            style={{ fontSize: '12.5px', color: 'var(--primary)', fontWeight: 600 }}
          >
            View all →
          </Link>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--surface-container-low)' }}>
                {['Name', 'Email', 'Provider', 'Problems', 'Joined'].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: '0.6rem 1rem',
                      textAlign: 'left',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      color: 'var(--outline)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((u, i) => (
                <tr
                  key={u.id}
                  style={{
                    borderTop: i > 0 ? '1px solid var(--outline-variant)' : undefined,
                  }}
                >
                  <td style={{ padding: '0.75rem 1rem', fontSize: '13.5px', fontWeight: 600 }}>
                    {u.name}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '13px', color: 'var(--outline)' }}>
                    {u.email}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span
                      style={{
                        fontSize: '11.5px',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '999px',
                        background: u.provider === 'google' ? '#e8f4fd' : 'var(--primary-container)',
                        color: u.provider === 'google' ? '#1a6b9a' : 'var(--primary)',
                      }}
                    >
                      {u.provider}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: '0.75rem 1rem',
                      fontSize: '13.5px',
                      fontWeight: 700,
                      color: 'var(--primary)',
                    }}
                  >
                    {u.problemsSolved}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '13px', color: 'var(--outline)' }}>
                    {fmt(u.createdAt)}
                  </td>
                </tr>
              ))}
              {recentUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      padding: '2rem',
                      textAlign: 'center',
                      fontSize: '13px',
                      color: 'var(--outline)',
                    }}
                  >
                    No users yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
