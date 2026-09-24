import type { Phase0Language } from '@/data/day0to1Topics';
import type { PerLanguage } from '@/data/phase0Expansion';
import type {
  Lesson,
  LessonBlock,
  LessonPractice,
  TableBlock,
  HeadingBlock,
} from '../types';
import { chapterNumberFor } from '@/data/phase0Expansion';

/**
 * Shared Phase 0 lessons.
 *
 * Most of the expansion chapters (complexity, sorting, trees, graphs…) teach
 * the same idea in every language; only the code differs. Authoring them three
 * times would triple the cost of writing and reviewing them. Instead a shared
 * chapter is written once in this format, where any piece of text or code can
 * be either a single value (identical in every language) or a per-language
 * record, and `expandShared` turns it into three ordinary `Lesson`s.
 *
 * Rule of thumb for authors: prose is shared, code is per-language, and prose
 * becomes per-language only when the languages genuinely differ (e.g. what
 * `%` does with negative numbers).
 */

/** A value that is either the same in every language or specified per language. */
export type Localised<T> = T | PerLanguage<T>;

export interface SharedTextBlock {
  kind: 'text';
  body: Localised<string>;
}

export interface SharedCodeBlock {
  kind: 'code';
  caption?: Localised<string>;
  /** Always per-language: a code sample is never valid in all three. */
  code: PerLanguage<string>;
  output?: Localised<string>;
}

export interface SharedCalloutBlock {
  kind: 'callout';
  tone: 'tip' | 'warn' | 'trap';
  title: Localised<string>;
  body: Localised<string>;
}

export interface SharedTableBlock {
  kind: 'table';
  headers: string[];
  /** Whole table per language, or a shared table whose individual cells may be per-language. */
  rows: PerLanguage<string[][]> | Localised<string>[][];
}

export type SharedBlock =
  | SharedTextBlock
  | SharedCodeBlock
  | SharedCalloutBlock
  | SharedTableBlock
  | HeadingBlock;

export interface SharedPractice {
  prompt: Localised<string>;
  starter?: PerLanguage<string>;
  leetcode?: { title: string; slug: string };
}

export interface SharedLesson {
  /** 1-based position within the chapter; matches the topic list in phase0Expansion.ts. */
  sub: number;
  summary: Localised<string>;
  readMinutes: number;
  blocks: SharedBlock[];
  /** Whole list per language, or a shared list whose individual bullets may be per-language. */
  keyTakeaways: PerLanguage<string[]> | Localised<string>[];
  practice?: SharedPractice;
}

const LANGUAGES: Phase0Language[] = ['cpp', 'java', 'python'];

function isPerLanguage<T>(value: Localised<T>): value is PerLanguage<T> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    'cpp' in value &&
    'java' in value &&
    'python' in value
  );
}

function pick<T>(value: Localised<T>, language: Phase0Language): T {
  return isPerLanguage(value) ? value[language] : value;
}

/** A list that is either per-language as a whole or shared with per-language items. */
function pickList<T>(value: PerLanguage<T[]> | Localised<T>[], language: Phase0Language): T[] {
  return isPerLanguage(value) ? value[language] : value.map((item) => pick(item, language));
}

function pickBlock(block: SharedBlock, language: Phase0Language): LessonBlock {
  switch (block.kind) {
    case 'text':
      return { kind: 'text', body: pick(block.body, language) };
    case 'code': {
      const out: LessonBlock = { kind: 'code', code: block.code[language] };
      if (block.caption !== undefined) out.caption = pick(block.caption, language);
      if (block.output !== undefined) out.output = pick(block.output, language);
      return out;
    }
    case 'callout':
      return {
        kind: 'callout',
        tone: block.tone,
        title: pick(block.title, language),
        body: pick(block.body, language),
      };
    case 'table': {
      const rows = isPerLanguage(block.rows)
        ? block.rows[language]
        : block.rows.map((row) => pickList(row, language));
      const out: TableBlock = { kind: 'table', headers: block.headers, rows };
      return out;
    }
    case 'heading':
      return block;
  }
}

/**
 * Expand a shared chapter into one `Lesson` per language. `key` is the
 * chapter's key in phase0Expansion.ts; it fixes the chapter number (and so the
 * topic ids) in each language.
 */
export function expandShared(key: string, lessons: SharedLesson[]): Lesson[] {
  return LANGUAGES.flatMap((language) => {
    const chapter = chapterNumberFor(language, key);
    return lessons.map((l): Lesson => {
      const lesson: Lesson = {
        topicId: `${language}-${chapter}.${l.sub}`,
        language,
        summary: pick(l.summary, language),
        readMinutes: l.readMinutes,
        blocks: l.blocks.map((b) => pickBlock(b, language)),
        keyTakeaways: pickList(l.keyTakeaways, language),
      };
      if (l.practice) {
        const practice: LessonPractice = { prompt: pick(l.practice.prompt, language) };
        if (l.practice.starter) practice.starter = l.practice.starter[language];
        if (l.practice.leetcode) practice.leetcode = l.practice.leetcode;
        lesson.practice = practice;
      }
      return lesson;
    });
  });
}
