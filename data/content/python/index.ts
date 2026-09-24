import type { Lesson } from '../types';
import { sharedLessonsFor } from '../shared';
import { ch01 } from './ch01';
import { ch02 } from './ch02';
import { ch03 } from './ch03';
import { ch04 } from './ch04';
import { ch05 } from './ch05';
import { ch06 } from './ch06';
import { ch07 } from './ch07';
import { ch08 } from './ch08';
import { ch09 } from './ch09';
import { ch10 } from './ch10';
import { ch11 } from './ch11';
import { ch12 } from './ch12';
import { ch13 } from './ch13';
import { ch14 } from './ch14';
import { ch15 } from './ch15';
import { ch41 } from './ch41';
import { ch17 } from './ch17';
import { ch27 } from './ch27';
import { ch42 } from './ch42';

/**
 * All Python Phase 0 lessons, in chapter order.
 *
 * Chapters are authored one file per chapter and appended here as they land.
 * A topic without a lesson yet simply has no entry — the UI degrades to the
 * old checkbox-only row, so partial coverage is always safe to ship.
 */
export const pythonLessons: Lesson[] = [
  ...ch01,
  ...ch02,
  ...ch03,
  ...ch04,
  ...ch05,
  ...ch06,
  ...ch07,
  ...ch08,
  ...ch09,
  ...ch10,
  ...ch11,
  ...ch12,
  ...ch13,
  ...ch14,
  ...ch15,
  ...ch41,
  ...ch17,
  ...ch27,
  ...ch42,
  // Expansion chapters authored once for all languages (data/content/shared).
  ...sharedLessonsFor('python'),
];
