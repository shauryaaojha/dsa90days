/**
 * The number of patterns in the cheatsheet, as a standalone module.
 *
 * The landing page and the login page render this as a marketing stat. They
 * used to `import { patterns } from '@/data/patterns'` and read `.length`,
 * which dragged the entire cheatsheet — every template, problem list and
 * pitfall, ~160KB — into the client bundle of the two most performance- and
 * SEO-sensitive pages in the app, to display one integer.
 *
 * Keeping the constant in its own file with no imports means those pages pull
 * in nothing but the number. `data/patterns/index.ts` asserts this matches the
 * real array length at module load, so the two can never drift apart.
 */
export const PATTERN_COUNT = 20;
