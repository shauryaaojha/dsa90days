'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { resourceCategories } from '@/data/resources';

export default function ResourcesPage() {
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
            <i className="ti ti-library" aria-hidden="true" style={{ fontSize: '20px', color: 'var(--primary)' }}></i>
            Curated Study Resources
          </h1>
          <p className="page-subtitle">
            Supplement your preparation with the best handpicked roadmaps, channels, and playlists.
          </p>
        </div>
      </div>

      {resourceCategories.map((category, idx) => {
        const cardTypes = ['card-premium-purple', 'card-premium-green', 'card-premium-amber'];
        const cardClass = cardTypes[idx % 3];
        return (
          <div key={idx} className="bento-resources-section animate-fade-in">
            <h2 className="bento-resources-title">
              <span style={{ marginRight: '6px' }}>{category.icon}</span> {category.title}
            </h2>
            <div className="bento-resources-grid">
              {category.resources.map((resource, rIdx) => (
                <a
                  key={rIdx}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none' }}
                >
                  <div className={`bento-resource-card ${cardClass}`}>
                    <div className="bento-resource-icon-box">
                      <i className="ti ti-link" aria-hidden="true"></i>
                    </div>
                    <div className="bento-resource-info">
                      <span className="bento-resource-name-txt">{resource.name}</span>
                      <span className="bento-resource-desc-txt">{resource.description}</span>
                    </div>
                    <span className="bento-resource-arrow-icon">
                      <i className="ti ti-arrow-right"></i>
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
