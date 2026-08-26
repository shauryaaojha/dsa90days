import type { Phase0Language } from '@/data/day0to1Topics';

/**
 * Phase 0 reading content. Every lesson hangs off a topic id that already
 * exists in `data/day0to1Topics.ts` (e.g. "cpp-1.1"), so adding content needs
 * no schema change — `Day0to1Progress.completed` simply gains real meaning:
 * the student read the lesson instead of ticking a bare checkbox.
 */

/** A paragraph of prose. Supports inline `code` spans and **bold**. */
export interface TextBlock {
  kind: 'text';
  body: string;
}

/** A runnable C++ snippet, optionally with the output it prints. */
export interface CodeBlockData {
  kind: 'code';
  caption?: string;
  code: string;
  /** What the program prints, shown as a muted strip under the snippet. */
  output?: string;
}

/**
 * A highlighted aside.
 *  - `tip`  → do it this way
 *  - `warn` → correct but easy to get wrong
 *  - `trap` → the mistake that costs students a failed submission
 */
export interface CalloutBlock {
  kind: 'callout';
  tone: 'tip' | 'warn' | 'trap';
  title: string;
  body: string;
}

/** A comparison table — used heavily for "X vs Y" and complexity tables. */
export interface TableBlock {
  kind: 'table';
  headers: string[];
  rows: string[][];
}

/** A sub-heading inside a longer lesson. */
export interface HeadingBlock {
  kind: 'heading';
  text: string;
}

export type LessonBlock =
  | TextBlock
  | CodeBlockData
  | CalloutBlock
  | TableBlock
  | HeadingBlock;

/** An optional hands-on task closing the lesson. */
export interface LessonPractice {
  /** What to build. Plain language, no starter code required. */
  prompt: string;
  /** Optional skeleton the student fills in. */
  starter?: string;
  /** A real LeetCode problem that drills this topic, when one fits. */
  leetcode?: { title: string; slug: string };
}

export interface Lesson {
  /** Matches a `Day0to1Topic.id`, e.g. "cpp-1.1". */
  topicId: string;
  language: Phase0Language;
  /** One line answering "what will I be able to do after this?". */
  summary: string;
  /** Rough reading time in minutes — drives the "4 min read" chip. */
  readMinutes: number;
  blocks: LessonBlock[];
  /** 2–4 bullets the student should remember a week later. */
  keyTakeaways: string[];
  practice?: LessonPractice;
}
