'use client';

import { useEffect, useState } from 'react';

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

function fmt(dateStr: string | null) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/admin/users')
      .then((r) => r.json())
      .then((d) => setUsers(d.users ?? []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--on-surface)', margin: 0 }}>
          Users
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--outline)', marginTop: '4px' }}>
          All registered users — {users.length} total
        </p>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '1.25rem' }}>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: '0.6rem 0.875rem',
            borderRadius: '10px',
            border: '1.5px solid var(--outline-variant)',
            background: 'var(--surface-container-lowest)',
            fontSize: '13.5px',
            color: 'var(--on-surface)',
            outline: 'none',
            width: '280px',
          }}
        />
      </div>

      <div
        style={{
          background: 'var(--surface-container-lowest)',
          border: '1px solid var(--outline-variant)',
          borderRadius: '14px',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        {loading ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '3rem',
            }}
          >
            <div className="spinner" />
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--surface-container-low)' }}>
                  {['Name', 'Email', 'Provider', 'Solved', 'Pledge', 'Last Active', 'Joined'].map(
                    (h) => (
                      <th
                        key={h}
                        style={{
                          padding: '0.65rem 1rem',
                          textAlign: 'left',
                          fontSize: '11px',
                          fontWeight: 700,
                          color: 'var(--outline)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => (
                  <tr
                    key={u.id}
                    style={{
                      borderTop: i > 0 ? '1px solid var(--outline-variant)' : undefined,
                    }}
                  >
                    <td
                      style={{
                        padding: '0.75rem 1rem',
                        fontSize: '13.5px',
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {u.name}
                    </td>
                    <td
                      style={{
                        padding: '0.75rem 1rem',
                        fontSize: '12.5px',
                        color: 'var(--outline)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {u.email}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '999px',
                          background:
                            u.provider === 'google' ? '#e8f4fd' : 'var(--primary-container)',
                          color: u.provider === 'google' ? '#1a6b9a' : 'var(--primary)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {u.provider}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: '0.75rem 1rem',
                        fontSize: '14px',
                        fontWeight: 800,
                        color: u.problemsSolved > 0 ? 'var(--primary)' : 'var(--outline)',
                      }}
                    >
                      {u.problemsSolved}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span
                        style={{
                          fontSize: '11.5px',
                          fontWeight: 600,
                          color: u.pledgeAcceptedAt ? 'var(--secondary)' : 'var(--outline)',
                        }}
                      >
                        {u.pledgeAcceptedAt ? '✓ Pledged' : 'Not yet'}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: '0.75rem 1rem',
                        fontSize: '12.5px',
                        color: 'var(--outline)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {fmt(u.lastActive)}
                    </td>
                    <td
                      style={{
                        padding: '0.75rem 1rem',
                        fontSize: '12.5px',
                        color: 'var(--outline)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {fmt(u.createdAt)}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      style={{
                        padding: '2.5rem',
                        textAlign: 'center',
                        fontSize: '13px',
                        color: 'var(--outline)',
                      }}
                    >
                      {search ? 'No users match your search.' : 'No users yet.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
