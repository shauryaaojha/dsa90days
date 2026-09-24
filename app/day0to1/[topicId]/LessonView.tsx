'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { languageMeta } from '@/data/day0to1Topics';
import type { Phase0Language, Day0to1Topic } from '@/data/day0to1Topics';
import type { Lesson, LessonBlock } from '@/data/content';
import CodeBlock from '@/components/CodeBlock';
import RichText from '@/components/RichText';

const CALLOUT_META = {
  tip: { icon: 'ti-bulb', label: 'Tip' },
  warn: { icon: 'ti-alert-triangle', label: 'Careful' },
  trap: { icon: 'ti-bug', label: 'Common mistake' },
} as const;

function Block({ block, lang }: { block: LessonBlock; lang: Phase0Language }) {
  switch (block.kind) {
    case 'heading':
      return <h2 className="lsn-h2">{block.text}</h2>;

    case 'text':
      return (
        <p className="lsn-p">
          <RichText text={block.body} />
        </p>
      );

    case 'code':
      return (
        <CodeBlock code={block.code} caption={block.caption} output={block.output} lang={lang} />
      );

    case 'callout': {
      const meta = CALLOUT_META[block.tone];
      return (
        <aside className={`lsn-callout lsn-callout-${block.tone}`}>
          <div className="lsn-callout-head">
            <i className={`ti ${meta.icon}`} />
            <span className="lsn-callout-kind">{meta.label}</span>
            <span className="lsn-callout-title">{block.title}</span>
          </div>
          <p className="lsn-callout-body">
            <RichText text={block.body} />
          </p>
        </aside>
      );
    }

    case 'table':
      return (
        <div className="lsn-table-wrap">
          <table className="lsn-table">
            <thead>
              <tr>
                {block.headers.map((h) => (
                  <th key={h}>
                    <RichText text={h} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j}>
                      <RichText text={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

/** A neighbouring topic, pre-resolved on the server. */
export interface AdjacentTopic {
  id: string;
  title: string;
  hasLesson: boolean;
}

export interface LessonViewProps {
  topicId: string;
  topic: Day0to1Topic | null;
  lesson: Lesson | null;
  prev: AdjacentTopic | null;
  next: AdjacentTopic | null;
}

export default function LessonView({ topicId, topic, lesson, prev, next }: LessonViewProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [myLanguage, setMyLanguage] = useState<Phase0Language | null>(null);
  const [switchingLang, setSwitchingLang] = useState(false);

  const loadState = useCallback(async () => {
    try {
      const [trackRes, progressRes] = await Promise.all([
        fetch('/api/track'),
        fetch('/api/day0to1/progress'),
      ]);
      const track = await trackRes.json();
      const data = await progressRes.json();

      // Lessons in every language stay readable on every track. Only a student
      // who never onboarded is sent back to pick a track first.
      if (!track.track) {
        router.replace('/track-select');
        return;
      }
      setMyLanguage(track.day0to1Language ?? null);

      const entry = (data.progress ?? []).find(
        (p: { topicId: string; completed: boolean }) => p.topicId === topicId
      );
      setCompleted(!!entry?.completed);
    } catch {
      // Leave the checkbox unticked; marking complete will surface any error.
    } finally {
      setLoading(false);
    }
  }, [topicId, router]);

  const switchToThisLanguage = async () => {
    if (!topic) return;
    setSwitchingLang(true);
    setSaveError('');
    try {
      const res = await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: topic.language }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Could not switch language.');
      }
      setMyLanguage(topic.language);
    } catch (e: unknown) {
      setSaveError(e instanceof Error ? e.message : 'Could not switch language.');
    } finally {
      setSwitchingLang(false);
    }
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
      return;
    }
    if (session) {
      // loadState resolves asynchronously and then updates local state.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadState();
    }
  }, [session, status, loadState, router]);

  // Next preserves scroll position when the destination Page is still visible
  // in the viewport, and both ways of advancing a topic — the "Mark complete &
  // continue" button and the Prev/Next links — live in the footer. So without
  // this you land at the bottom of the next lesson, looking at its footer.
  // `scroll={true}` does not help; that is already the default and it is the
  // visibility heuristic that suppresses the jump. `instant` matters too,
  // because globals.css sets `html { scroll-behavior: smooth }`.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [topicId]);

  const setDone = async (value: boolean, thenNext: boolean) => {
    setSaving(true);
    setSaveError('');
    const previous = completed;
    setCompleted(value);

    try {
      const res = await fetch('/api/day0to1/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicId, completed: value }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Could not save your progress.');
      }
      const body = await res.json();

      if (thenNext) {
        // Finishing the final topic graduates the student — send them back to
        // the dashboard so the graduation modal can fire there.
        if (body.graduated || !next) router.push('/day0to1');
        else router.push(`/day0to1/${next.id}`);
        return;
      }
    } catch (e: unknown) {
      setCompleted(previous);
      setSaveError(e instanceof Error ? e.message : 'Could not save your progress.');
    } finally {
      setSaving(false);
    }
  };

  if (!topic) {
    return (
      <div className="lsn-missing">
        <h1>Topic not found</h1>
        <p>That topic id does not exist in the Phase 0 syllabus.</p>
        <Link href="/day0to1" className="btn-track-confirm">
          Back to Phase 0
        </Link>
      </div>
    );
  }

  if (loading || status === 'loading') {
    return (
      <div className="p0-loading">
        <div className="spinner" />
        <p>Loading lesson…</p>
      </div>
    );
  }

  const meta = languageMeta[topic.language];
  const number = `${topic.displayChapter}.${topic.subIndex}`;
  const otherLanguage = myLanguage && myLanguage !== topic.language ? myLanguage : null;

  return (
    <div className="lsn-page">
      <header className="lsn-header">
        <div className="lsn-header-inner">
          <Link href="/day0to1" className="lsn-back">
            <i className="ti ti-arrow-left" /> Phase 0
          </Link>
          <span className="lsn-crumb">
            <i className={`ti ${meta.icon}`} />
            {meta.name} · Chapter {topic.displayChapter} — {topic.chapterTitle}
          </span>
        </div>
      </header>

      {otherLanguage && (
        <div className="lsn-lang-notice">
          <i className="ti ti-info-circle" />
          <span>
            You&apos;re reading a <strong>{meta.name}</strong> lesson, but your Phase 0 track is set to{' '}
            <strong>{languageMeta[otherLanguage].name}</strong>.
          </span>
          <button type="button" onClick={switchToThisLanguage} disabled={switchingLang} className="lsn-lang-notice-btn">
            <i className="ti ti-switch-horizontal" />
            {switchingLang ? 'Switching…' : `Switch to ${meta.name}`}
          </button>
        </div>
      )}

      <article className="lsn-body">
        <div className="lsn-title-row">
          <span className="lsn-number">{number}</span>
          {completed && (
            <span className="lsn-done-chip">
              <i className="ti ti-circle-check" /> Completed
            </span>
          )}
        </div>
        <h1 className="lsn-title">{topic.title}</h1>

        {lesson ? (
          <>
            <p className="lsn-summary">{lesson.summary}</p>
            <div className="lsn-meta">
              <span>
                <i className="ti ti-clock" /> {lesson.readMinutes} min read
              </span>
              <span>
                <i className="ti ti-book-2" /> Chapter {topic.displayChapter}
              </span>
            </div>

            <div className="lsn-content">
              {lesson.blocks.map((b, i) => (
                <Block key={i} block={b} lang={topic.language} />
              ))}
            </div>

            <section className="lsn-takeaways">
              <h2>
                <i className="ti ti-key" /> Key takeaways
              </h2>
              <ul>
                {lesson.keyTakeaways.map((t, i) => (
                  <li key={i}>
                    <RichText text={t} />
                  </li>
                ))}
              </ul>
            </section>

            {lesson.practice && (
              <section className="lsn-practice">
                <h2>
                  <i className="ti ti-code" /> Now write it yourself
                </h2>
                <p>
                  <RichText text={lesson.practice.prompt} />
                </p>
                {lesson.practice.starter && (
                  <CodeBlock
                    code={lesson.practice.starter}
                    caption="Starter"
                    lang={topic.language}
                  />
                )}
                {lesson.practice.leetcode && (
                  <a
                    className="lsn-lc-link"
                    href={`https://leetcode.com/problems/${lesson.practice.leetcode.slug}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="ti ti-external-link" />
                    Try it on LeetCode: {lesson.practice.leetcode.title}
                  </a>
                )}
              </section>
            )}
          </>
        ) : (
          <div className="lsn-soon">
            <i className="ti ti-pencil" />
            <h2>Written lesson coming soon</h2>
            <p>
              This topic does not have reading content yet. You can still study it from the
              roadmap and mark it complete once you are confident with it.
            </p>
          </div>
        )}
      </article>

      <footer className="lsn-footer">
        {saveError && <p className="track-error">{saveError}</p>}

        <div className="lsn-actions">
          {completed ? (
            <button
              type="button"
              className="lsn-btn-secondary"
              onClick={() => setDone(false, false)}
              disabled={saving}
            >
              <i className="ti ti-rotate" /> Mark as not done
            </button>
          ) : (
            <button
              type="button"
              className="btn-track-confirm"
              onClick={() => setDone(true, true)}
              disabled={saving}
            >
              {next ? 'Mark complete & continue' : 'Mark complete & finish'}{' '}
              <i className="ti ti-arrow-right" />
            </button>
          )}
        </div>

        <nav className="lsn-nav">
          {prev ? (
            <Link href={`/day0to1/${prev.id}`} className="lsn-nav-link prev">
              <i className="ti ti-chevron-left" />
              <span>
                <small>Previous</small>
                {prev.title}
                {!prev.hasLesson && <em className="lsn-nav-flag">no lesson yet</em>}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/day0to1/${next.id}`} className="lsn-nav-link next">
              <span>
                <small>Next</small>
                {next.title}
                {!next.hasLesson && <em className="lsn-nav-flag">no lesson yet</em>}
              </span>
              <i className="ti ti-chevron-right" />
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </footer>
    </div>
  );
}
