'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useSyncExternalStore,
} from 'react';
import type { ReactNode } from 'react';
import type { Phase0Language } from '@/data/day0to1Topics';
import type { PatternSnippet } from '@/data/patterns';
import CodeBlock from '@/components/CodeBlock';

/**
 * The 3-language switcher for cheatsheet snippets.
 *
 * Every code block on a pattern page shares one language, held in context: a
 * student reading in Java must never scroll into a Python snippet. The choice
 * persists in localStorage, and seeds from the student's Phase 0 track the
 * first time they land here.
 */

const LANGS: { id: Phase0Language; label: string }[] = [
  { id: 'cpp', label: 'C++' },
  { id: 'java', label: 'Java' },
  { id: 'python', label: 'Python' },
];

const STORAGE_KEY = 'pattern-lang';

function isLanguage(v: unknown): v is Phase0Language {
  return v === 'cpp' || v === 'java' || v === 'python';
}

/**
 * localStorage, exposed as an external store.
 *
 * Reading it in an effect and calling setState would fire a second render on
 * every mount (and trips `react-hooks/set-state-in-effect`). `useSyncExternalStore`
 * is the sanctioned way in: the server snapshot is `null`, so SSR and the first
 * client render agree, and the stored value is picked up without a cascade.
 *
 * `cached` must be memoised — `getSnapshot` returning a fresh value each call
 * would loop forever.
 */
let cached: Phase0Language | null | undefined;
const listeners = new Set<() => void>();

function readStored(): Phase0Language | null {
  if (cached === undefined) {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      cached = isLanguage(v) ? v : null;
    } catch {
      cached = null; // Private mode / storage disabled.
    }
  }
  return cached;
}

function writeStored(l: Phase0Language) {
  cached = l;
  try {
    localStorage.setItem(STORAGE_KEY, l);
  } catch {
    // The choice just will not persist across reloads.
  }
  for (const fn of listeners) fn();
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

interface Ctx {
  lang: Phase0Language;
  setLang: (l: Phase0Language) => void;
}

const PatternLangContext = createContext<Ctx | null>(null);

export function PatternLangProvider({ children }: { children: ReactNode }) {
  // A previous choice on this page always wins — it is the most recent signal
  // we have about what they want to read.
  const stored = useSyncExternalStore(subscribe, readStored, () => null);
  const [tracked, setTracked] = useState<Phase0Language | null>(null);

  useEffect(() => {
    if (stored) return; // Already chosen — no need to ask the server.

    let cancelled = false;

    // Fall back to their Phase 0 track, so the first visit already shows the
    // language they are actually learning.
    (async () => {
      try {
        const res = await fetch('/api/track');
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && isLanguage(data.day0to1Language)) {
          setTracked(data.day0to1Language);
        }
      } catch {
        // Logged out, or offline. 'cpp' is a fine default.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [stored]);

  const setLang = useCallback((l: Phase0Language) => writeStored(l), []);
  const lang = stored ?? tracked ?? 'cpp';

  return (
    <PatternLangContext.Provider value={{ lang, setLang }}>
      {children}
    </PatternLangContext.Provider>
  );
}

function useLang(): Ctx {
  const ctx = useContext(PatternLangContext);
  if (!ctx) throw new Error('PatternCode must be rendered inside <PatternLangProvider>');
  return ctx;
}

/** The tab strip. Rendered once, near the top of the page. */
export function PatternLangTabs() {
  const { lang, setLang } = useLang();

  return (
    <div className="ptn-lang-tabs" role="tablist" aria-label="Code language">
      {LANGS.map((l) => (
        <button
          key={l.id}
          type="button"
          role="tab"
          aria-selected={lang === l.id}
          className={`ptn-lang-tab${lang === l.id ? ' is-active' : ''}`}
          onClick={() => setLang(l.id)}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}

/** A snippet that follows the page-wide language choice. */
export default function PatternCode({
  snippet,
  caption,
}: {
  snippet: PatternSnippet;
  caption?: string;
}) {
  const { lang } = useLang();
  return <CodeBlock code={snippet[lang]} caption={caption} lang={lang} />;
}
