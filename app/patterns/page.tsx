'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { patterns } from '@/data/patterns';

export default function PatternsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  if (status === 'loading') {
    return <div className="loading-spinner"><div className="spinner" /></div>;
  }
  if (!session) return null;

  return (
    <div className="wrap-bento page-container" style={{ padding: '1.5rem 1.5rem 3rem' }}>

      {/* Page Header */}
      <div className="bento-header-wrapper animate-fade-in">
        <div className="bento-header-left">
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="ti ti-folders" aria-hidden="true" style={{ fontSize: '20px', color: 'var(--primary)' }}></i>
            Pattern Recognition Cheatsheet
          </h1>
          <p className="page-subtitle">
            Master these {patterns.length} core patterns to optimize spatial-temporal efficiency.
          </p>
        </div>
      </div>

      {/* Bento Patterns Grid */}
      <div className="bento-patterns-grid animate-fade-in stagger-children">
        {patterns.map((pattern, idx) => {
          const cardTypes = ['card-premium-purple', 'card-premium-green', 'card-premium-amber'];
          const cardClass = cardTypes[idx % 3];
          return (
            <div key={idx} className={`bento-pattern-card ${cardClass}`}>
              <div className="bento-pattern-header">
                <span className="bento-pattern-name-lbl">{pattern.name}</span>
                <span className="bento-pattern-complexity-pill">
                  <i className="ti ti-cpu" style={{ marginRight: '3px' }}></i> {pattern.timeComplexity}
                </span>
              </div>
              
              <p className="bento-pattern-when-text">
                {pattern.whenToUse}
              </p>
              
              <div className="bento-pattern-questions-wrap">
                <strong><i className="ti ti-help" style={{ marginRight: '3px' }}></i> Classic Qs: </strong>
                {pattern.keyQuestions}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
