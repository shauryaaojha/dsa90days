import { day0to1Topics } from '@/data/day0to1Topics';
import type { Phase0Language } from '@/data/day0to1Topics';
import { chapterNumberFor } from '@/data/phase0Expansion';

/**
 * Which topics have a written lesson — answered without loading any lesson.
 *
 * `app/day0to1/page.tsx` is a Client Component that needs one boolean per
 * topic ("does this row get a Read link?"). Importing `hasLesson` from
 * `@/data/content` to answer that dragged every lesson body — megabytes —
 * into the browser. This module only needs the topic list, which the page
 * already ships.
 *
 * Coverage is tracked per chapter: a chapter file is either authored in full
 * or not at all. Nothing in this repo checks that the resulting id set matches
 * the real lesson set (there is no test runner), so when a chapter lands, list
 * it here in the same change — otherwise its topics silently lose their Read
 * links, or gain links that 404.
 */

/** Original chapters — all fully covered. */
const ORIGINAL_CHAPTERS: Record<Phase0Language, number> = { cpp: 19, java: 17, python: 15 };

/** Shared expansion chapters (data/content/shared) that have content, by key. */
const SHARED_WITH_CONTENT: string[] = [
  'backtracking',
  'number-theory',
  'hashing',
  'bits',
  'searching',
  'range-queries',
  'union-find',
  'tries',
  'dp',
  'hash-tables',
  'heaps',
  'debugging',
  'stacks-queues',
  'linked-lists',
  'strings-in-depth',
  'graphs',
  'sorting',
  'arrays-in-depth',
  'trees',
  'math-for-programming',
  'how-computers-run',
  'first-programs',
  'complexity',
];

/** Language-specific expansion chapters that have content, by key. */
const LANGUAGE_WITH_CONTENT: Record<Phase0Language, string[]> = {
  cpp: ['pitfalls', 'workspace', 'toolbox', 'capstones'],
  java: ['pitfalls', 'workspace', 'toolbox', 'capstones'],
  python: ['pitfalls', 'workspace', 'toolbox', 'capstones'],
};

function chaptersWithContent(language: Phase0Language): Set<number> {
  const numbers = new Set<number>();
  for (let n = 1; n <= ORIGINAL_CHAPTERS[language]; n++) numbers.add(n);
  for (const key of SHARED_WITH_CONTENT) numbers.add(chapterNumberFor(language, key));
  for (const key of LANGUAGE_WITH_CONTENT[language]) numbers.add(chapterNumberFor(language, key));
  return numbers;
}

const covered: Record<Phase0Language, Set<number>> = {
  cpp: chaptersWithContent('cpp'),
  java: chaptersWithContent('java'),
  python: chaptersWithContent('python'),
};

const LESSON_TOPIC_IDS: readonly string[] = day0to1Topics
  .filter((t) => covered[t.language].has(t.chapter))
  .map((t) => t.id);

const lessonIdSet = new Set(LESSON_TOPIC_IDS);

/** Whether a topic has reading content. Same answer as `@/data/content`'s
 *  `hasLesson`, without pulling the lesson bodies into the bundle. */
export function hasLessonId(topicId: string): boolean {
  return lessonIdSet.has(topicId);
}

export { LESSON_TOPIC_IDS };
