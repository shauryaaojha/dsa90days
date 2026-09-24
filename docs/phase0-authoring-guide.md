# Phase 0 lesson authoring guide

This is the contract for every new Phase 0 chapter file. Read it fully before
writing a lesson. The curriculum and the per-chapter topic lists are in
`docs/phase0-curriculum.md` and `data/phase0Expansion.ts`.

## Audience

Students of a 2nd-year CS programme in India who are preparing for a 90-day
LeetCode sprint (Phase 1). Tier A readers have **never programmed**. Tier B and
C readers have finished the earlier chapters of this track and nothing else.
Assume no prior CS course. Define every term the first time it appears. Never
write "obviously", "simply" or "just".

## Two kinds of chapter file

### 1. Shared chapter — `data/content/shared/<key>.ts`

Written once, expanded into C++, Java and Python. Types are in
`data/content/shared/types.ts`; read that file. The shape:

```ts
import type { SharedLesson } from './types';

/**
 * <Chapter title> — one line on what the chapter achieves.
 */
export const lessons: SharedLesson[] = [
  {
    sub: 1,                     // 1-based, matches the topic list order
    summary: 'One line: what the reader can do after this lesson.',
    readMinutes: 4,
    blocks: [
      { kind: 'text', body: 'Prose first. Always. Explain the idea before any code.' },
      { kind: 'heading', text: 'A sub-heading' },
      {
        kind: 'code',
        caption: 'What this snippet shows',
        code: {
          cpp: `// C++ version`,
          java: `// Java version`,
          python: `# Python version`,
        },
        output: '42',            // optional; string, or per-language record if outputs differ
      },
      {
        kind: 'text',
        // Per-language prose only where the languages genuinely differ.
        body: {
          cpp: 'In C++ ...',
          java: 'In Java ...',
          python: 'In Python ...',
        },
      },
      { kind: 'callout', tone: 'trap', title: 'The mistake that costs a submission', body: '...' },
      { kind: 'table', headers: ['Operation', 'Cost'], rows: [['insert', 'O(1)']] },
    ],
    keyTakeaways: ['Two to four bullets the reader should remember a week later.'],
    practice: {
      prompt: 'A hands-on task in plain language.',
      starter: { cpp: `...`, java: `...`, python: `...` },   // optional
      leetcode: { title: 'Two Sum', slug: 'two-sum' },       // optional, only a real problem
    },
  },
];
```

Rules for shared chapters:
- `sub` runs 1..N with no gaps, N = number of topics for that chapter key in
  `data/phase0Expansion.ts`. One lesson per topic, in order.
- `code.cpp`, `code.java`, `code.python` are all required in every code block and
  must be real, idiomatic, compilable code in that language — not a translation
  of C++ syntax into Python. Same algorithm, native style.
- Prose is a plain string unless the languages truly differ. Do not write three
  copies of the same sentence.
- Never mention "the other languages" in a language-specific string.

### 2. Language-specific chapter — `data/content/<lang>/chNN.ts`

Same format as existing chapters. Read `data/content/cpp/ch01.ts` (first two
lessons) for the shape. The shape:

```ts
import type { Lesson } from '../types';

/**
 * Chapter NN — <Title>.
 * One or two lines on the chapter's goal.
 */
export const chNN: Lesson[] = [
  {
    topicId: '<lang>-NN.1',
    language: '<lang>',
    summary: '...',
    readMinutes: 4,
    blocks: [ /* same block kinds; `code` is a plain string here */ ],
    keyTakeaways: ['...'],
    practice: { prompt: '...' },
  },
];
```

## Content rules

1. The **first block of every lesson is `text`**. Never open with code, a
   heading or a table.
2. Every lesson has a non-empty `summary`, at least one block, and 2–4
   `keyTakeaways`.
3. `readMinutes` is 3–6 (Tier A may be 2–4; a Tier C lesson with a full
   implementation may be 7).
4. No empty code blocks.
5. Every lesson has a `practice`. Add `leetcode` only when a real problem on
   leetcode.com drills exactly this topic; the slug must be the real URL slug.
6. Target 2.5–4 KB of text per lesson. Do not pad. Do not write essays.
7. Each lesson: prose intro → one worked example with code → the trap/callout
   → key takeaways → practice. Tier C lessons also include a `table` block with
   the complexity of each operation.
8. Inline code uses backticks in prose: `vector<int>`. Bold with `**bold**`.
   No other markdown (no lists, no links, no headings inside text bodies —
   use `heading` blocks).
9. Code must compile / run. Use `#include <bits/stdc++.h>` and
   `using namespace std;` in C++; `public class Main` with `main` in Java when
   showing a whole program, or a bare method when showing a LeetCode-style
   snippet; Python 3.10+ without type-hint gymnastics.
10. Do not reference chapter numbers in prose ("see chapter 7"): they change.
    Refer to topics by title instead.
11. Existing chapters cover library usage (e.g. `sort()`, `priority_queue`,
    `heapq`). New chapters that "extend" them teach how it works and when it
    breaks. Do not repeat the usage tutorial.

## What NOT to do

- Do not edit any file other than the one chapter file you were asked to write.
  Registration (`data/content/shared/index.ts`, `data/content/lessonIds.ts`,
  language index files) is done by the orchestrator.
- Do not run `npm install`, `git`, or a dev server.
- Do not create README, notes, or scratch files in the repo.

## Verify before finishing

```
npx tsc --noEmit -p tsconfig.json
```

must report no errors in your file. Then end with a short summary: file path,
number of lessons, total bytes, and anything you were unsure about.
