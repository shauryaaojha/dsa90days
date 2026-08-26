import type { Lesson } from './types';
import type { Phase0Language } from '@/data/day0to1Topics';
import { cppLessons } from './cpp';
import { javaLessons } from './java';
import { pythonLessons } from './python';

export type {
  Lesson,
  LessonBlock,
  LessonPractice,
  TextBlock,
  CodeBlockData,
  CalloutBlock,
  TableBlock,
  HeadingBlock,
} from './types';

/** Every lesson across every language. */
const allLessons: Lesson[] = [
  ...cppLessons,
  ...javaLessons,
  ...pythonLessons,
];

const lessonById = new Map<string, Lesson>(allLessons.map((l) => [l.topicId, l]));

/** The lesson for a topic id, or null if that topic has no content yet. */
export function getLesson(topicId: string): Lesson | null {
  return lessonById.get(topicId) ?? null;
}

/** Whether a topic has reading content — drives the "Read" affordance. */
export function hasLesson(topicId: string): boolean {
  return lessonById.has(topicId);
}

/** Every topic id that has a lesson, for a given language. */
export function lessonTopicIds(language: Phase0Language): string[] {
  return allLessons.filter((l) => l.language === language).map((l) => l.topicId);
}
