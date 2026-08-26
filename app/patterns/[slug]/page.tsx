'use client';

import { use, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getPattern, CATEGORY_LABEL } from '@/data/patterns';
import RichText from '@/components/RichText';
import PatternCode, { PatternLangProvider, PatternLangTabs } from '@/components/PatternCode';

export default function PatternDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();

  const pattern = getPattern(slug);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  if (status === 'loading') {
    return <div className="loading-spinner"><div className="spinner" /></div>;
  }
  if (!session) return null;

  if (!pattern) {
    return (
      <div className="lsn-missing">
        <h1>Pattern not found</h1>
        <p>That pattern is not in the cheatsheet.</p>
        <Link href="/patterns" className="btn-track-confirm">
          Back to all patterns
        </Link>
      </div>
    );
  }

  return (
    <PatternLangProvider>
      <div className="lsn-page">
        <header className="lsn-header">
          <div className="lsn-header-inner">
            <Link href="/patterns" className="lsn-back">
              <i className="ti ti-arrow-left" /> Patterns
            </Link>
            <span className="lsn-crumb">
              <i className="ti ti-folders" />
              {CATEGORY_LABEL[pattern.category]}
            </span>
          </div>
        </header>

        <article className="lsn-body">
          <h1 className="lsn-title">{pattern.name}</h1>
          <p className="lsn-summary">{pattern.oneLiner}</p>

          <div className="lsn-meta">
            <span><i className="ti ti-clock" /> Time {pattern.time}</span>
            <span><i className="ti ti-database" /> Space {pattern.space}</span>
          </div>

          {/* 1 — Recognise it. The whole point of the page, so it goes first. */}
          <section className="ptn-triggers">
            <h2><i className="ti ti-eye" /> Recognise it</h2>
            <p className="ptn-triggers-lead">Reach for this pattern when you see:</p>
            <ul>
              {pattern.triggers.map((t, i) => (
                <li key={i}><RichText text={t} /></li>
              ))}
            </ul>
          </section>

          {/* 2 — The mental model. */}
          <div className="lsn-content">
            <h2 className="lsn-h2">The idea</h2>
            {pattern.idea.map((para, i) => (
              <p key={i} className="lsn-p"><RichText text={para} /></p>
            ))}
          </div>

          {/* 3 — The template, in the reader's language. */}
          <section className="ptn-template">
            <div className="ptn-template-head">
              <h2><i className="ti ti-code" /> The template</h2>
              <PatternLangTabs />
            </div>
            <PatternCode snippet={pattern.template} caption={`${pattern.name} — core template`} />
          </section>

          {pattern.variants && pattern.variants.length > 0 && (
            <section className="ptn-variants">
              <h2><i className="ti ti-git-branch" /> Variants</h2>
              {pattern.variants.map((v, i) => (
                <div key={i} className="ptn-variant">
                  <h3>{v.name}</h3>
                  <p className="lsn-p"><RichText text={v.when} /></p>
                  <PatternCode snippet={v.code} caption={v.name} />
                </div>
              ))}
            </section>
          )}

          {/* 4 — Go practise. */}
          <section className="ptn-problems">
            <h2><i className="ti ti-target-arrow" /> Classic problems</h2>
            <div className="lsn-table-wrap">
              <table className="lsn-table ptn-problem-table">
                <thead>
                  <tr>
                    <th>Problem</th>
                    <th>Level</th>
                    <th>Why this one</th>
                  </tr>
                </thead>
                <tbody>
                  {pattern.problems.map((p) => (
                    <tr key={p.slug}>
                      <td>
                        <a
                          className="ptn-problem-link"
                          href={`https://leetcode.com/problems/${p.slug}/`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {p.title} <i className="ti ti-external-link" />
                        </a>
                      </td>
                      <td>
                        <span className={`ptn-diff ptn-diff-${p.difficulty.toLowerCase()}`}>
                          {p.difficulty}
                        </span>
                      </td>
                      <td>{p.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 5 — What goes wrong. */}
          <section className="ptn-pitfalls">
            <h2><i className="ti ti-bug" /> Watch out for</h2>
            {pattern.pitfalls.map((p, i) => (
              <aside key={i} className="lsn-callout lsn-callout-trap">
                <div className="lsn-callout-head">
                  <i className="ti ti-bug" />
                  <span className="lsn-callout-kind">Common mistake</span>
                  <span className="lsn-callout-title"><RichText text={p.title} /></span>
                </div>
                <p className="lsn-callout-body"><RichText text={p.body} /></p>
              </aside>
            ))}
          </section>

          {pattern.related.length > 0 && (
            <section className="ptn-related">
              <h2><i className="ti ti-arrows-shuffle" /> Related patterns</h2>
              <div className="ptn-related-chips">
                {pattern.related.map((slug) => {
                  const r = getPattern(slug);
                  if (!r) return null;
                  return (
                    <Link key={slug} href={`/patterns/${slug}`} className="ptn-related-chip">
                      {r.name} <i className="ti ti-chevron-right" />
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </article>

        <footer className="lsn-footer">
          <nav className="lsn-nav">
            <Link href="/patterns" className="lsn-nav-link prev">
              <i className="ti ti-chevron-left" />
              <span>
                <small>Back to</small>
                All {CATEGORY_LABEL[pattern.category]} patterns
              </span>
            </Link>
          </nav>
        </footer>
      </div>
    </PatternLangProvider>
  );
}
