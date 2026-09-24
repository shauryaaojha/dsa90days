import type { Lesson } from '../types';
import type { Phase0Language } from '@/data/day0to1Topics';
import { expandShared } from './types';
import type { SharedLesson } from './types';
import { lessons as backtracking } from './backtracking';
import { lessons as numberTheory } from './number-theory';
import { lessons as hashing } from './hashing';
import { lessons as bits } from './bits';
import { lessons as searching } from './searching';
import { lessons as rangeQueries } from './range-queries';
import { lessons as unionFind } from './union-find';
import { lessons as tries } from './tries';
import { lessons as dp } from './dp';
import { lessons as hashTables } from './hash-tables';
import { lessons as heaps } from './heaps';
import { lessons as debugging } from './debugging';
import { lessons as stacksQueues } from './stacks-queues';
import { lessons as linkedLists } from './linked-lists';
import { lessons as stringsInDepth } from './strings-in-depth';
import { lessons as graphs } from './graphs';
import { lessons as sorting } from './sorting';
import { lessons as arraysInDepth } from './arrays-in-depth';
import { lessons as trees } from './trees';
import { lessons as mathForProgramming } from './math-for-programming';
import { lessons as howComputersRun } from './how-computers-run';
import { lessons as firstPrograms } from './first-programs';
import { lessons as complexity } from './complexity';

export type { SharedLesson, SharedBlock, Localised } from './types';
export { expandShared } from './types';

/**
 * Every shared chapter, keyed by its phase0Expansion.ts key. A chapter is
 * added here as soon as its file lands; until then its topics show as "Soon".
 */
const sharedChapters: Record<string, SharedLesson[]> = {
  backtracking,
  'number-theory': numberTheory,
  hashing,
  bits,
  searching,
  'range-queries': rangeQueries,
  'union-find': unionFind,
  tries,
  dp,
  'hash-tables': hashTables,
  heaps,
  debugging,
  'stacks-queues': stacksQueues,
  'linked-lists': linkedLists,
  'strings-in-depth': stringsInDepth,
  graphs,
  sorting,
  'arrays-in-depth': arraysInDepth,
  trees,
  'math-for-programming': mathForProgramming,
  'how-computers-run': howComputersRun,
  'first-programs': firstPrograms,
  complexity,
};

const expanded: Lesson[] = Object.entries(sharedChapters).flatMap(([key, lessons]) =>
  expandShared(key, lessons),
);

/** Chapter keys that have shared content (drives lessonIds.ts). */
export const sharedChapterKeys: string[] = Object.keys(sharedChapters);

/** Shared lessons expanded for one language. */
export function sharedLessonsFor(language: Phase0Language): Lesson[] {
  return expanded.filter((l) => l.language === language);
}
