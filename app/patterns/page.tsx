'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { patterns, usedCategories, CATEGORY_LABEL } from '@/data/patterns';
import type { PatternCategory } from '@/data/patterns';

export default function PatternsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<PatternCategory | 'all'>('all');

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  const categories = useMemo(() => usedCategories(), []);

  // Search deliberately covers the trigger phrases too, so typing "subarray"
  // surfaces Sliding Window and Prefix Sum — that is the recognition behaviour
  // the whole page exists for, and name-only search would miss it.
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();

    return patterns.filter((p) => {
      if (category !== 'all' && p.category !== category) return false;
      if (!q) return true;

      return (
        p.name.toLowerCase().includes(q) ||
        p.oneLiner.toLowerCase().includes(q) ||
        p.triggers.some((t) => t.toLowerCase().includes(q)) ||
        p.problems.some((pr) => pr.title.toLowerCase().includes(q))
      );
    });
  }, [query, category]);

  if (status === 'loading') {
    return <div className="loading-spinner"><div className="spinner" /></div>;
  }
  if (!session) return null;

  return (
    <div className="wrap-bento page-container" style={{ padding: '1.5rem 1.5rem 3rem' }}>

      <div className="bento-header-wrapper animate-fade-in">
        <div className="bento-header-left">
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="ti ti-folders" aria-hidden="true" style={{ fontSize: '20px', color: 'var(--primary)' }} />
            Pattern Recognition Cheatsheet
          </h1>
          <p className="page-subtitle">
            {patterns.length} patterns that bridge the gap between reading a problem and
            knowing what to write — each with a C++, Java and Python template.
          </p>
        </div>
      </div>

      <div className="ptn-filter-bar animate-fade-in">
        <div className="ptn-search">
          <i className="ti ti-search" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a pattern, or a phrase like &quot;subarray&quot; or &quot;shortest path&quot;…"
            aria-label="Search patterns"
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} aria-label="Clear search">
              <i className="ti ti-x" />
            </button>
          )}
        </div>

        <div className="ptn-cat-chips" role="group" aria-label="Filter by category">
          <button
            type="button"
            className={`ptn-cat-chip${category === 'all' ? ' is-active' : ''}`}
            onClick={() => setCategory('all')}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              className={`ptn-cat-chip${category === c ? ' is-active' : ''}`}
              onClick={() => setCategory(c)}
            >
              {CATEGORY_LABEL[c]}
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="ptn-empty">
          <i className="ti ti-mood-search" />
          <p>
            Nothing matches <strong>{query}</strong>.
          </p>
          <button type="button" className="lsn-btn-secondary" onClick={() => { setQuery(''); setCategory('all'); }}>
            Clear filters
          </button>
        </div>
      ) : (
        <div className="bento-patterns-grid animate-fade-in stagger-children">
          {visible.map((pattern, idx) => {
            const cardTypes = ['card-premium-purple', 'card-premium-green', 'card-premium-amber'];
            const cardClass = cardTypes[idx % 3];

            return (
              <Link
                key={pattern.slug}
                href={`/patterns/${pattern.slug}`}
                className={`bento-pattern-card ptn-card-link ${cardClass}`}
              >
                <div className="bento-pattern-header">
                  <span className="bento-pattern-name-lbl">{pattern.name}</span>
                  {/* timeShort, not time: the pill is nowrap, and a grid item
                      cannot shrink below its own min-content width — a long
                      string here blows the whole grid past the viewport. */}
                  <span className="bento-pattern-complexity-pill">
                    <i className="ti ti-cpu" style={{ marginRight: '3px' }} /> {pattern.timeShort}
                  </span>
                </div>

                <p className="bento-pattern-when-text">{pattern.oneLiner}</p>

                <div className="ptn-card-foot">
                  <span className="ptn-card-cat">{CATEGORY_LABEL[pattern.category]}</span>
                  <span className="ptn-card-more">
                    {pattern.problems.length} problems <i className="ti ti-arrow-right" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
