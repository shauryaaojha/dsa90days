import type { Phase0Language } from '@/data/day0to1Topics';

/**
 * The pattern cheatsheet — the bridge between "I have read the problem" and
 * "I know which technique to write".
 *
 * Phase 0 teaches a language; the phase lists hand out problems. Nothing else
 * in the app teaches recognition, which is where most students actually stall.
 * Everything here is therefore ordered recognise → understand → write.
 */

export type PatternCategory =
  | 'array-string'
  | 'linked-list'
  | 'tree'
  | 'graph'
  | 'search-sort'
  | 'dp'
  | 'heap-greedy'
  | 'bit-math';

export const CATEGORY_LABEL: Record<PatternCategory, string> = {
  'array-string': 'Arrays & Strings',
  'linked-list': 'Linked Lists',
  tree: 'Trees',
  graph: 'Graphs',
  'search-sort': 'Search & Sort',
  dp: 'Dynamic Programming',
  'heap-greedy': 'Heaps & Greedy',
  'bit-math': 'Bits & Math',
};

/**
 * The same algorithm in all three tracks.
 *
 * These are kept deliberately *line-comparable*: same variable names, same
 * comment text, same line order wherever the languages allow. A student who
 * learned two pointers in Python and later switches to Java should see the
 * same shape with only the syntax changed. That property is worth more than
 * squeezing out the last drop of per-language idiom.
 */
export interface PatternSnippet {
  cpp: string;
  java: string;
  python: string;
}

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface PatternProblem {
  title: string;
  /** A real LeetCode slug — leetcode.com/problems/<slug>/ */
  slug: string;
  difficulty: Difficulty;
  /** Why *this* problem drills *this* pattern. */
  note?: string;
}

/** A genuine fork in the pattern — fixed vs variable window, and so on. */
export interface PatternVariant {
  name: string;
  when: string;
  code: PatternSnippet;
}

export interface Pattern {
  /** URL segment: /patterns/two-pointers */
  slug: string;
  name: string;
  category: PatternCategory;
  /** The card subtitle — one sentence, no jargon. */
  oneLiner: string;
  /** Phrases a student would actually read in a prompt that mean "use me". */
  triggers: string[];
  /** The mental model, in prose. Supports `code` and **bold** via RichText. */
  idea: string[];
  /**
   * Full complexity, shown on the detail page. May be a sentence.
   */
  time: string;
  /**
   * Glanceable form for the index card's pill — keep it under ~14 characters.
   * The pill is `white-space: nowrap`, and a grid item cannot shrink below its
   * own min-content width, so a long string here overflows the whole grid.
   */
  timeShort: string;
  space: string;
  /** THE skeleton to internalise. */
  template: PatternSnippet;
  variants?: PatternVariant[];
  /** 3–5, ordered easy → hard. */
  problems: PatternProblem[];
  /** Concrete bugs, with the symptom named. */
  pitfalls: { title: string; body: string }[];
  /** Slugs of neighbouring patterns. */
  related: string[];
}

export type { Phase0Language };
