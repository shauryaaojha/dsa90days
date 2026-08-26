'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getTopicsForLanguage, getChaptersForLanguage, languageMeta } from '@/data/day0to1Topics';
import type { Day0to1Topic, Day0to1Chapter, Phase0Language } from '@/data/day0to1Topics';
// Ids only — importing hasLesson from '@/data/content' would pull all 478
// lesson bodies (1.7MB) into this Client Component's bundle.
import { hasLessonId } from '@/data/content/lessonIds';

interface ProgressEntry {
  topicId: string;
  completed: boolean;
  completedAt: string | null;
}

const LANGUAGES: Phase0Language[] = ['cpp', 'java', 'python'];

const LANGUAGE_COLORS: Record<Phase0Language, string> = {
  cpp: '#00599C',
  java: '#ED8B00',
  python: '#3776AB',
};

/**
 * Derived from the content files rather than hardcoded — the previous literals
 * (168/164/147) were wrong for all three languages, and the landing page
 * already derives its figures for exactly this reason.
 *
 * `lessons` is what makes the choice honest: all 478 topics have written
 * lessons today, but the count is derived rather than asserted so a language
 * added with partial coverage says so on the card instead of surprising the
 * student with a "coming soon" placeholder after they commit.
 */
const LANGUAGE_CARDS = LANGUAGES.map((key) => {
  const topics = getTopicsForLanguage(key);
  return {
    key,
    color: LANGUAGE_COLORS[key],
    chapters: getChaptersForLanguage(key).length,
    topics: topics.length,
    lessons: topics.filter((t) => hasLessonId(t.id)).length,
  };
});

export default function Phase0Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [track, setTrack] = useState<'phase0' | 'phase1' | null>(null);
  const [language, setLanguage] = useState<Phase0Language | null>(null);
  const [progress, setProgress] = useState<ProgressEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedChapter, setExpandedChapter] = useState<number | null>(null);
  const [togglingTopic, setTogglingTopic] = useState<string | null>(null);
  const [showGradModal, setShowGradModal] = useState(false);
  const [graduated, setGraduated] = useState(false);
  const [advancing, setAdvancing] = useState(false);
  const [advanceError, setAdvanceError] = useState('');
  const [switchingLang, setSwitchingLang] = useState<Phase0Language | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [trackRes, progressRes] = await Promise.all([
        fetch('/api/track'),
        fetch('/api/day0to1/progress'),
      ]);
      const trackData = await trackRes.json();
      const progressData = await progressRes.json();

      setTrack(trackData.track ?? null);
      setLanguage(trackData.day0to1Language ?? null);
      setGraduated(!!trackData.day0to1CompletedAt);
      setProgress(progressData.progress || []);

      // Phase 0 stays open to everyone who has onboarded. Only a student who
      // never chose a track is sent back to pick one.
      if (!trackData.track) {
        router.replace('/track-select');
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
      return;
    }
    if (session) {
      // fetchData updates local state once its request resolves.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchData();
    }
  }, [session, status, fetchData, router]);

  const switchLanguage = async (next: Phase0Language) => {
    if (next === language || switchingLang) return;
    setSwitchingLang(next);
    setAdvanceError('');
    try {
      const res = await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: next }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Could not switch language. Please try again.');
      }
      const data = await res.json();
      setLanguage(data.day0to1Language);
      setGraduated(!!data.day0to1CompletedAt);
      setExpandedChapter(null);
    } catch (error: unknown) {
      setAdvanceError(error instanceof Error ? error.message : 'Could not switch language.');
    } finally {
      setSwitchingLang(null);
    }
  };

  const toggleTopic = async (topicId: string, currentCompleted: boolean) => {
    setTogglingTopic(topicId);
    const newCompleted = !currentCompleted;

    // Optimistic update
    setProgress((prev) => {
      const exists = prev.some((p) => p.topicId === topicId);
      if (exists) {
        return prev.map((p) =>
          p.topicId === topicId
            ? { ...p, completed: newCompleted, completedAt: newCompleted ? new Date().toISOString() : null }
            : p
        );
      }
      return [...prev, { topicId, completed: newCompleted, completedAt: newCompleted ? new Date().toISOString() : null }];
    });

    try {
      const res = await fetch('/api/day0to1/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicId, completed: newCompleted }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.graduated) {
          setGraduated(true);
          setShowGradModal(true);
        }
      } else {
        // Revert on failure
        setProgress((prev) =>
          prev.map((p) =>
            p.topicId === topicId
              ? { ...p, completed: currentCompleted, completedAt: currentCompleted ? p.completedAt : null }
              : p
          )
        );
      }
    } catch {
      // Revert
      setProgress((prev) =>
        prev.map((p) =>
          p.topicId === topicId
            ? { ...p, completed: currentCompleted, completedAt: currentCompleted ? p.completedAt : null }
            : p
        )
      );
    } finally {
      setTogglingTopic(null);
    }
  };

  const advanceToPhase1 = async () => {
    setAdvancing(true);
    setAdvanceError('');
    try {
      const res = await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ track: 'phase1' }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Could not start Phase 1. Please try again.');
      }
      router.replace('/');
    } catch (error: unknown) {
      setAdvanceError(error instanceof Error ? error.message : 'Could not start Phase 1. Please try again.');
      setAdvancing(false);
    }
  };

  const makePhase0PrimaryTrack = async () => {
    setAdvancing(true);
    setAdvanceError('');
    try {
      const res = await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ track: 'phase0', language }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Could not switch to Phase 0. Please try again.');
      }
      setTrack('phase0');
    } catch (error: unknown) {
      setAdvanceError(error instanceof Error ? error.message : 'Could not switch to Phase 0.');
    } finally {
      setAdvancing(false);
    }
  };

  if (loading || status === 'loading') {
    return (
      <div className="p0-loading">
        <div className="spinner" />
        <p>Loading Phase 0…</p>
      </div>
    );
  }

  // A student who came straight from the DSA Sprint may never have picked a
  // Phase 0 language — let them choose one right here.
  if (!language) {
    return (
      <div className="p0-page">
        <header className="p0-header">
          <div className="p0-header-top">
            <div className="p0-header-actions">
              <Link href="/" className="p0-header-link">
                <i className="ti ti-layout-dashboard" /> 90-day sprint
              </Link>
            </div>
          </div>
        </header>
        <main className="p0-lang-gate">
          <h1 className="p0-hero-title">Pick a language to begin</h1>
          <p className="p0-hero-sub" style={{ maxWidth: 'none', marginBottom: '1.5rem' }}>
            Phase 0 covers the same fundamentals in each language. You can switch at any time —
            your progress is kept separately per language.
          </p>
          <div className="lang-cards">
            {LANGUAGE_CARDS.map((lang) => (
              <button
                key={lang.key}
                className="lang-card"
                onClick={() => switchLanguage(lang.key)}
                disabled={switchingLang !== null}
              >
                <div className="lang-card-icon" style={{ color: lang.color }}>
                  <i className={`ti ${languageMeta[lang.key].icon}`} />
                </div>
                <h3>{languageMeta[lang.key].name}</h3>
                <div className="lang-card-meta">
                  <span>{lang.chapters} chapters</span>
                  <span className="lang-dot">·</span>
                  <span>{lang.topics} topics</span>
                </div>
                {lang.lessons >= lang.topics ? (
                  <span className="lang-card-coverage full">
                    <i className="ti ti-book" /> All lessons written
                  </span>
                ) : (
                  <span className="lang-card-coverage partial">
                    <i className="ti ti-pencil" /> {lang.lessons} of {lang.topics} lessons written
                  </span>
                )}
              </button>
            ))}
          </div>
          <p className="p0-lang-switch-hint" style={{ marginTop: '1rem', textAlign: 'center' }}>
            Every topic can be tracked and ticked off in all three languages. Where a written lesson
            is still being prepared, study the topic from the roadmap and mark it complete.
          </p>
          {advanceError && <p className="track-error">{advanceError}</p>}
        </main>
      </div>
    );
  }

  const topics: Day0to1Topic[] = getTopicsForLanguage(language);
  const chapters: Day0to1Chapter[] = getChaptersForLanguage(language);
  const completedSet = new Set(progress.filter((p) => p.completed).map((p) => p.topicId));
  const totalTopics = topics.length;
  const completedCount = topics.filter((t) => completedSet.has(t.id)).length;
  const pct = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

  // Group topics by chapter
  const chapterTopics = new Map<number, Day0to1Topic[]>();
  for (const t of topics) {
    if (!chapterTopics.has(t.chapter)) chapterTopics.set(t.chapter, []);
    chapterTopics.get(t.chapter)!.push(t);
  }

  // Count chapters fully completed
  let chaptersCompleted = 0;
  for (const [, chTopics] of chapterTopics) {
    if (chTopics.every((t) => completedSet.has(t.id))) chaptersCompleted++;
  }

  const meta = languageMeta[language];
  const onPhase0Track = track === 'phase0';

  return (
    <div className="p0-page">
      {/* Graduation Modal */}
      {showGradModal && (
        <div className="p0-grad-overlay" onClick={() => setShowGradModal(false)}>
          <div className="p0-grad-modal animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="p0-grad-confetti">🎉</div>
            <h2>Phase 0 Complete!</h2>
            <p>
              You&apos;ve mastered the {meta.name} fundamentals.
              {onPhase0Track
                ? ' You’re now ready to tackle 200+ LeetCode problems in the DSA Sprint.'
                : ' Keep going in the DSA Sprint, or start Phase 0 again in another language.'}
            </p>
            <div className="p0-grad-actions">
              {onPhase0Track ? (
                <button type="button" className="btn-track-confirm" onClick={advanceToPhase1} disabled={advancing}>
                  Start Phase 1 — DSA Sprint <i className="ti ti-arrow-right" />
                </button>
              ) : (
                <Link href="/" className="btn-track-confirm">
                  Back to DSA Sprint <i className="ti ti-arrow-right" />
                </Link>
              )}
              {advanceError && <p className="track-error">{advanceError}</p>}
              <button className="btn-tutorial-skip" onClick={() => setShowGradModal(false)}>
                Stay here for now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="p0-header">
        <div className="p0-header-top">
          <div className="p0-header-actions">
            <Link href="/" className="p0-header-link">
              <i className="ti ti-layout-dashboard" /> 90-day sprint
            </Link>
          </div>
        </div>

        <div className="p0-hero">
          <div className="p0-hero-left">
            <div className="p0-lang-badge" title={meta.name}>
              <i className={`ti ${meta.icon}`} />
              <span>Phase 0 · {meta.name}</span>
            </div>
            <h1 className="p0-hero-title">Language Foundation</h1>
            <p className="p0-hero-sub">
              Master {meta.name} syntax, data structures, and DSA patterns —
              then graduate to the 90-day LeetCode sprint.
            </p>

            {/* Language switcher — available at any time */}
            <div className="p0-lang-switch" role="group" aria-label="Phase 0 language">
              <span className="p0-lang-switch-label">Language</span>
              {LANGUAGES.map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => switchLanguage(code)}
                  disabled={switchingLang !== null}
                  aria-pressed={code === language}
                  className={`p0-lang-opt${code === language ? ' active' : ''}`}
                >
                  <i className={`ti ${languageMeta[code].icon}`} />
                  {languageMeta[code].name}
                  {switchingLang === code && <span className="spinner p0-lang-spin" />}
                </button>
              ))}
            </div>
            <p className="p0-lang-switch-hint">
              Progress is saved per language — switch back any time and pick up where you left off.
            </p>
          </div>
          <div className="p0-hero-stats">
            <div className="p0-stat-ring">
              <svg viewBox="0 0 120 120" className="p0-ring-svg">
                <circle cx="60" cy="60" r="52" className="p0-ring-bg" />
                <circle
                  cx="60" cy="60" r="52"
                  className="p0-ring-fill"
                  strokeDasharray={`${2 * Math.PI * 52}`}
                  strokeDashoffset={`${2 * Math.PI * 52 * (1 - pct / 100)}`}
                />
              </svg>
              <div className="p0-ring-label">
                <span className="p0-ring-pct">{pct}%</span>
              </div>
            </div>
            <div className="p0-stat-details">
              <div className="p0-stat-row">
                <i className="ti ti-checks" />
                <span>{completedCount} / {totalTopics} topics</span>
              </div>
              <div className="p0-stat-row">
                <i className="ti ti-book" />
                <span>{chaptersCompleted} / {chapters.length} chapters</span>
              </div>
              {graduated && (
                <div className="p0-stat-row p0-graduated">
                  <i className="ti ti-certificate" />
                  <span>Graduated!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <div className="p0-progress-bar-wrap">
        <div className="p0-progress-bar">
          <div className="p0-progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Chapters */}
      <main className="p0-chapters">
        {chapters.map((ch) => {
          const chTopics = chapterTopics.get(ch.chapter) ?? [];
          const chCompleted = chTopics.filter((t) => completedSet.has(t.id)).length;
          const chTotal = chTopics.length;
          const chDone = chCompleted === chTotal;
          const isExpanded = expandedChapter === ch.chapter;

          return (
            <div key={ch.chapter} className={`p0-chapter ${chDone ? 'done' : ''} ${isExpanded ? 'expanded' : ''}`}>
              <button
                className="p0-chapter-header"
                onClick={() => setExpandedChapter(isExpanded ? null : ch.chapter)}
              >
                <div className="p0-chapter-left">
                  <span className="p0-chapter-num">{ch.chapter}</span>
                  <div className="p0-chapter-info">
                    <h3 className="p0-chapter-title">{ch.title}</h3>
                    <span className="p0-chapter-count">
                      {chDone ? (
                        <><i className="ti ti-circle-check" /> All complete</>
                      ) : (
                        <>{chCompleted} / {chTotal} topics</>
                      )}
                    </span>
                  </div>
                </div>
                <div className="p0-chapter-right">
                  <div className="p0-chapter-mini-bar">
                    <div
                      className="p0-chapter-mini-fill"
                      style={{ width: `${chTotal > 0 ? (chCompleted / chTotal) * 100 : 0}%` }}
                    />
                  </div>
                  <i className={`ti ti-chevron-${isExpanded ? 'up' : 'down'}`} />
                </div>
              </button>

              {isExpanded && (
                <div className="p0-chapter-body animate-fade-in">
                  {chTopics.map((topic) => {
                    const isDone = completedSet.has(topic.id);
                    const isToggling = togglingTopic === topic.id;

                    return (
                      <div key={topic.id} className={`p0-topic ${isDone ? 'completed' : ''}`}>
                        <button
                          className={`p0-topic-check ${isDone ? 'checked' : ''} ${isToggling ? 'toggling' : ''}`}
                          onClick={() => toggleTopic(topic.id, isDone)}
                          disabled={isToggling}
                          aria-label={isDone ? 'Mark as incomplete' : 'Mark as complete'}
                        >
                          {isDone ? (
                            <i className="ti ti-circle-check" />
                          ) : (
                            <i className="ti ti-circle" />
                          )}
                        </button>
                        <Link href={`/day0to1/${topic.id}`} className="p0-topic-info">
                          <span className="p0-topic-label">
                            {topic.chapter}.{topic.subIndex}
                          </span>
                          <span className="p0-topic-title">{topic.title}</span>
                          {hasLessonId(topic.id) ? (
                            <span className="p0-topic-read">
                              <i className="ti ti-book" /> Read
                            </span>
                          ) : (
                            <span className="p0-topic-read soon">
                              <i className="ti ti-pencil" /> Soon
                            </span>
                          )}
                        </Link>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </main>

      {/* Footer actions */}
      <footer className="p0-footer">
        {advanceError && <p className="track-error">{advanceError}</p>}
        {onPhase0Track ? (
          graduated ? (
            <button type="button" className="btn-track-confirm" onClick={advanceToPhase1} disabled={advancing}>
              Continue to Phase 1 — DSA Sprint <i className="ti ti-arrow-right" />
            </button>
          ) : (
            <button type="button" className="p0-footer-switch" onClick={advanceToPhase1} disabled={advancing}>
              <i className="ti ti-switch-horizontal" /> Switch to Phase 1 (DSA Sprint)
            </button>
          )
        ) : (
          <div className="p0-footer-dual">
            <Link href="/" className="btn-track-confirm">
              Back to DSA Sprint <i className="ti ti-arrow-right" />
            </Link>
            <button type="button" className="p0-footer-switch" onClick={makePhase0PrimaryTrack} disabled={advancing}>
              <i className="ti ti-switch-horizontal" /> Make Phase 0 my main track
            </button>
          </div>
        )}
      </footer>
    </div>
  );
}
