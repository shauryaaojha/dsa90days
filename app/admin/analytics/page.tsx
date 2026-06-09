'use client';

import { useEffect, useState } from 'react';

interface TopProblem {
  problemId: string;
  name: string;
  count: number;
}

interface Cohort {
  label: string;
  count: number;
}

interface Analytics {
  topProblems: TopProblem[];
  phase1Completions: number;
  phase2Completions: number;
  phase1Total: number;
  phase2Total: number;
  cohorts: Cohort[];
}

function Bar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
      <div
        style={{
          fontSize: '12.5px',
          color: 'var(--on-surface-variant)',
          width: '220px',
          flexShrink: 0,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
        title={label}
      >
        {label}
      </div>
      <div
        style={{
          flex: 1,
          height: '8px',
          background: 'var(--surface-container)',
          borderRadius: '999px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            background: color,
            borderRadius: '999px',
            transition: 'width 0.6s ease',
          }}
        />
      </div>
      <div
        style={{
          fontSize: '13px',
          fontWeight: 700,
          color: 'var(--on-surface)',
          width: '28px',
          textAlign: 'right',
          flexShrink: 0,
        }}
      >
        {value}
      </div>
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then((r) => r.json())
      .then((d) => setData(d))
      .finally(() => setLoading(false));
  }, []);

  const maxProblemCount = data?.topProblems[0]?.count ?? 1;
  const maxCohortCount = Math.max(...(data?.cohorts.map((c) => c.count) ?? [1]));

  const cardStyle: React.CSSProperties = {
    background: 'var(--surface-container-lowest)',
    border: '1px solid var(--outline-variant)',
    borderRadius: '14px',
    padding: '1.5rem',
    boxShadow: 'var(--shadow-card)',
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--on-surface)', margin: 0 }}>
          Analytics
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--outline)', marginTop: '4px' }}>
          Completion patterns and user cohorts
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <div className="spinner" />
        </div>
      ) : !data ? (
        <p style={{ color: 'var(--error)' }}>Failed to load analytics.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Phase comparison */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {[
              {
                label: 'Phase 1 — Core DS',
                days: 'Day 1–60',
                completions: data.phase1Completions,
                total: data.phase1Total,
                color: '#944521',
                bg: 'var(--primary-container)',
              },
              {
                label: 'Phase 2 — Advanced',
                days: 'Day 61–90',
                completions: data.phase2Completions,
                total: data.phase2Total,
                color: '#52634d',
                bg: 'var(--secondary-container)',
              },
            ].map((p) => {
              const pct = p.total > 0 ? Math.round((p.completions / p.total) * 100) : 0;
              return (
                <div key={p.label} style={{ ...cardStyle, background: p.bg }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: p.color, marginBottom: '4px' }}>
                    {p.days}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--on-surface)' }}>
                    {p.label}
                  </div>
                  <div
                    style={{
                      fontSize: '36px',
                      fontWeight: 900,
                      color: p.color,
                      lineHeight: 1.1,
                      marginTop: '8px',
                    }}
                  >
                    {pct}%
                  </div>
                  <div style={{ fontSize: '12.5px', color: 'var(--outline)', marginTop: '2px' }}>
                    {p.completions.toLocaleString()} completions across all users
                  </div>
                  <div
                    style={{
                      height: '6px',
                      background: 'rgba(0,0,0,0.1)',
                      borderRadius: '999px',
                      marginTop: '12px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${pct}%`,
                        height: '100%',
                        background: p.color,
                        borderRadius: '999px',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Top 10 most solved */}
          <div style={cardStyle}>
            <h2
              style={{
                fontSize: '14px',
                fontWeight: 700,
                color: 'var(--on-surface)',
                margin: '0 0 1.25rem',
              }}
            >
              Top 10 Most Solved Problems
            </h2>
            {data.topProblems.length === 0 ? (
              <p style={{ color: 'var(--outline)', fontSize: '13px' }}>No completions yet.</p>
            ) : (
              data.topProblems.map((p) => (
                <Bar
                  key={p.problemId}
                  label={p.name}
                  value={p.count}
                  max={maxProblemCount}
                  color="var(--primary)"
                />
              ))
            )}
          </div>

          {/* Signup cohorts */}
          <div style={cardStyle}>
            <h2
              style={{
                fontSize: '14px',
                fontWeight: 700,
                color: 'var(--on-surface)',
                margin: '0 0 1.25rem',
              }}
            >
              User Signups by Week
            </h2>
            {data.cohorts.length === 0 ? (
              <p style={{ color: 'var(--outline)', fontSize: '13px' }}>No signup data yet.</p>
            ) : (
              data.cohorts.map((c) => (
                <Bar
                  key={c.label}
                  label={c.label}
                  value={c.count}
                  max={maxCohortCount}
                  color="var(--secondary)"
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
