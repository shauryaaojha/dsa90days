import type { Pattern, PatternCategory } from './types';
import { arrayStringPatterns } from './arrayString';
import { searchSortPatterns } from './searchSort';
import { graphPatterns } from './graphs';
import { dpPatterns } from './dp';
import { heapGreedyBitPatterns } from './heapGreedyBits';
import { PATTERN_COUNT } from './count';

export type {
  Pattern,
  PatternCategory,
  PatternSnippet,
  PatternProblem,
  PatternVariant,
  Difficulty,
} from './types';
export { CATEGORY_LABEL } from './types';
export { PATTERN_COUNT } from './count';

const bySlug = new Map<string, Pattern>(
  [
    ...arrayStringPatterns,
    ...searchSortPatterns,
    ...graphPatterns,
    ...dpPatterns,
    ...heapGreedyBitPatterns,
  ].map((p) => [p.slug, p])
);

/**
 * The canonical teaching order — roughly easiest to hardest, and grouped so a
 * student reading top to bottom meets prerequisites first. Authoring is split
 * by category across several files; this list is what the UI actually renders,
 * so a new pattern is not live until its slug appears here.
 */
const ORDER = [
  'two-pointers',
  'sliding-window',
  'binary-search',
  'hash-map-set',
  'prefix-sum',
  'monotonic-stack',
  'slow-fast-pointers',
  'bfs-level-order',
  'dfs-backtracking',
  'knapsack-01',
  'unbounded-knapsack',
  'lcs-edit-distance',
  'interval-merge',
  'topological-sort',
  'dijkstra',
  'union-find',
  'trie',
  'two-heaps',
  'bit-manipulation',
  'greedy',
] as const;

/** All 20 patterns, in teaching order. */
export const patterns: Pattern[] = ORDER.map((slug) => {
  const p = bySlug.get(slug);
  // A typo in ORDER would otherwise ship a hole in the grid and a 404 detail
  // page. Surface it as a missing pattern rather than throwing at module load:
  // a throw here happens during render and, with no error boundary above it,
  // white-screens the whole route.
  if (!p) console.error(`patterns: no pattern authored for slug "${slug}"`);
  return p;
}).filter((p): p is Pattern => Boolean(p));

// Marketing pages import PATTERN_COUNT on its own so they do not pull the
// whole cheatsheet into their bundle. Catch drift here rather than letting the
// landing page quietly advertise the wrong number.
if (patterns.length !== PATTERN_COUNT) {
  console.error(
    `patterns: PATTERN_COUNT is ${PATTERN_COUNT} but ${patterns.length} patterns are live. ` +
      'Update data/patterns/count.ts.'
  );
}

/** One pattern by slug, or null — drives /patterns/[slug]. */
export function getPattern(slug: string): Pattern | null {
  return bySlug.get(slug) ?? null;
}

/** Every slug, for `generateStaticParams` and the sitemap. */
export function patternSlugs(): string[] {
  return patterns.map((p) => p.slug);
}

/** The categories actually in use, in the order they first appear. */
export function usedCategories(): PatternCategory[] {
  const seen: PatternCategory[] = [];
  for (const p of patterns) if (!seen.includes(p.category)) seen.push(p.category);
  return seen;
}
