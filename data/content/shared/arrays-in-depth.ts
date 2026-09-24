import type { SharedLesson } from './types';

/**
 * Arrays and Matrices in Depth — the array techniques that Phase 1 assumes
 * you already own: in-place rewriting, rotation, prefix sums, every way of
 * walking a grid, and the boundary bugs that come with all of them. The
 * language chapter covered what an array is; this one covers what you do
 * with it.
 */
export const lessons: SharedLesson[] = [
  // -------------------------------------------------------------------------
  {
    sub: 1,
    summary: 'Decide when to modify an array where it sits and when to build a new one.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'There are two ways to change an array. **In place** means you overwrite the existing slots and use no second array. **Extra space** means you build a new array and fill it. Both are correct; they cost different things. A problem that says "do it in place" or "O(1) extra space" is telling you the second way is not allowed, and that restriction is the whole difficulty.',
      },
      {
        kind: 'code',
        caption: 'Double every element: both ways',
        code: {
          cpp: `// Extra space: a new array, original untouched
vector<int> doubled(a.size());
for (int i = 0; i < a.size(); i++) doubled[i] = a[i] * 2;

// In place: overwrite, no second array
for (int i = 0; i < a.size(); i++) a[i] *= 2;`,
          java: `// Extra space: a new array, original untouched
int[] doubled = new int[a.length];
for (int i = 0; i < a.length; i++) doubled[i] = a[i] * 2;

// In place: overwrite, no second array
for (int i = 0; i < a.length; i++) a[i] *= 2;`,
          python: `# Extra space: a new list, original untouched
doubled = [x * 2 for x in a]

# In place: overwrite, no second list
for i in range(len(a)):
    a[i] *= 2`,
        },
      },
      {
        kind: 'table',
        headers: ['', 'In place', 'Extra space'],
        rows: [
          ['Memory', 'None beyond a few variables', 'A second array of the same size'],
          ['Original array', 'Destroyed', 'Preserved'],
          ['Difficulty', 'Harder when later slots are still needed', 'Straightforward'],
          ['When required', '"O(1) space", "modify in place"', 'When the caller still needs the input'],
        ],
      },
      { kind: 'heading', text: 'The trap in in-place work' },
      {
        kind: 'text',
        body: 'Overwriting a slot destroys what was there. If a later step still needs the old value, it is gone. Removing all zeros from an array in place is the classic example: you cannot delete a slot, so you keep a **write position** that lags behind the **read position**, copying each non-zero forward and leaving the tail to be ignored or filled.',
      },
      {
        kind: 'code',
        caption: 'Remove zeros in place with two positions',
        code: {
          cpp: `int write = 0;
for (int read = 0; read < a.size(); read++) {
    if (a[read] != 0) a[write++] = a[read];
}
// a[0..write) holds the non-zeros; the rest is leftover`,
          java: `int write = 0;
for (int read = 0; read < a.length; read++) {
    if (a[read] != 0) a[write++] = a[read];
}
// a[0..write) holds the non-zeros; the rest is leftover`,
          python: `write = 0
for read in range(len(a)):
    if a[read] != 0:
        a[write] = a[read]
        write += 1
# a[:write] holds the non-zeros; the rest is leftover`,
        },
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Write never overtakes read',
        body: 'Because `write` only advances when `read` does, `write <= read` always holds, so you only ever overwrite a slot you have already read. That invariant is what makes the in-place version safe. When you design an in-place algorithm, find the invariant that guarantees you never destroy something unread.',
      },
    ],
    keyTakeaways: [
      'In place overwrites and uses no second array; extra space builds a new one.',
      'In-place algorithms must never overwrite a value that is still needed.',
      'The read/write two-position pattern compacts an array in place safely.',
    ],
    practice: {
      prompt: 'Move all zeros to the end of an array in place, keeping the other elements in their original order. Use the read/write pattern, then fill the tail with zeros.',
      leetcode: { title: 'Move Zeroes', slug: 'move-zeroes' },
    },
  },
  // -------------------------------------------------------------------------
  {
    sub: 2,
    summary: 'Reverse an array in place with two pointers, and rotate it with three reversals.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Reversing an array is the first two-pointer algorithm most people meet: one index starts at each end, they swap what they point at, and they walk towards each other until they meet. No second array, n / 2 swaps. Rotation, shifting every element k places with wrap-around, looks unrelated and turns out to be three reversals.',
      },
      {
        kind: 'code',
        caption: 'Reverse in place',
        code: {
          cpp: `void reverseRange(vector<int>& a, int lo, int hi) {   // inclusive bounds
    while (lo < hi) {
        swap(a[lo], a[hi]);
        lo++; hi--;
    }
}
// Whole array: reverseRange(a, 0, a.size() - 1), or std::reverse(a.begin(), a.end())`,
          java: `static void reverseRange(int[] a, int lo, int hi) {   // inclusive bounds
    while (lo < hi) {
        int t = a[lo]; a[lo] = a[hi]; a[hi] = t;
        lo++; hi--;
    }
}
// Whole array: reverseRange(a, 0, a.length - 1)`,
          python: `def reverse_range(a, lo, hi):   # inclusive bounds
    while lo < hi:
        a[lo], a[hi] = a[hi], a[lo]
        lo += 1
        hi -= 1
# Whole list: reverse_range(a, 0, len(a) - 1), or a.reverse()`,
        },
      },
      {
        kind: 'text',
        body: 'The condition is `lo < hi`, not `<=`. When they are equal they point at the middle element of an odd-length array, which does not need swapping. When they cross, everything has been swapped once. Either way the loop stops.',
      },
      { kind: 'heading', text: 'Rotate right by k with three reversals' },
      {
        kind: 'text',
        body: 'Rotating [1, 2, 3, 4, 5] right by 2 gives [4, 5, 1, 2, 3]: the last two move to the front. The naive way shifts everything one step, k times, costing n × k. The three-reversal trick costs 2n and uses no extra space. Reverse the whole array, then reverse the first k elements, then reverse the rest.',
      },
      {
        kind: 'table',
        headers: ['Step', 'Array'],
        rows: [
          ['Start', '1 2 3 4 5'],
          ['Reverse all', '5 4 3 2 1'],
          ['Reverse first k = 2', '4 5 3 2 1'],
          ['Reverse the remaining 3', '4 5 1 2 3'],
        ],
      },
      {
        kind: 'code',
        caption: 'Rotate right by k',
        code: {
          cpp: `void rotateRight(vector<int>& a, int k) {
    int n = a.size();
    k %= n;                        // rotating by n is rotating by 0
    reverseRange(a, 0, n - 1);
    reverseRange(a, 0, k - 1);
    reverseRange(a, k, n - 1);
}`,
          java: `static void rotateRight(int[] a, int k) {
    int n = a.length;
    k %= n;                        // rotating by n is rotating by 0
    reverseRange(a, 0, n - 1);
    reverseRange(a, 0, k - 1);
    reverseRange(a, k, n - 1);
}`,
          python: `def rotate_right(a, k):
    n = len(a)
    k %= n                         # rotating by n is rotating by 0
    reverse_range(a, 0, n - 1)
    reverse_range(a, 0, k - 1)
    reverse_range(a, k, n - 1)
# With extra space it is one line: a[:] = a[-k:] + a[:-k]`,
        },
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'k larger than n, and k equal to 0',
        body: 'Rotating by 7 in an array of 5 is rotating by 2, hence `k %= n`. Forget it and `reverseRange(a, 0, k - 1)` runs past the end. After the modulo, k = 0 makes the middle reversal `reverseRange(a, 0, -1)`, whose loop condition `0 < -1` is false immediately, so it is safe; but check that your own version handles it too.',
      },
    ],
    keyTakeaways: [
      'Reverse in place: two indices from the ends, swap, walk inwards while `lo < hi`.',
      'Rotate by k: reverse all, reverse the first k, reverse the rest.',
      'Always reduce k with `k %= n` first.',
    ],
    practice: {
      prompt: 'Implement rotate left by k using the same three-reversal idea (the split point changes). Verify with [1,2,3,4,5], k = 2, which should give [3,4,5,1,2]. Then test k = 0, k = 5 and k = 7.',
      leetcode: { title: 'Rotate Array', slug: 'rotate-array' },
    },
  },
  // -------------------------------------------------------------------------
  {
    sub: 3,
    summary: 'Precompute prefix sums so any range sum costs one subtraction.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Suppose you are asked the sum of a[2..5], then a[0..7], then a[3..3], thousands of times on the same array. Adding up each range from scratch costs the length of the range every time. A **prefix sum** array answers every such question in constant time after one pass of preparation. It is the single most reused array trick in Phase 1.',
      },
      {
        kind: 'text',
        body: 'Define `pre[i]` as the sum of the first i elements: `pre[0] = 0`, `pre[1] = a[0]`, `pre[2] = a[0] + a[1]`, and so on, with `pre` having one more slot than `a`. Then the sum of a[l..r] inclusive is `pre[r + 1] - pre[l]`: everything up to r, minus everything before l.',
      },
      {
        kind: 'table',
        headers: ['i', '0', '1', '2', '3', '4', '5'],
        rows: [
          ['a[i]', '3', '1', '4', '1', '5', ''],
          ['pre[i]', '0', '3', '4', '8', '9', '14'],
        ],
      },
      {
        kind: 'text',
        body: 'Sum of a[1..3] = 1 + 4 + 1 = 6. From the table: pre[4] - pre[1] = 9 - 3 = 6. The extra leading zero is what lets `l = 0` work without a special case: sum of a[0..2] = pre[3] - pre[0] = 8 - 0.',
      },
      {
        kind: 'code',
        caption: 'Build once, query many times',
        code: {
          cpp: `int n = a.size();
vector<long long> pre(n + 1, 0);
for (int i = 0; i < n; i++) pre[i + 1] = pre[i] + a[i];

// sum of a[l..r] inclusive
long long rangeSum(int l, int r) { return pre[r + 1] - pre[l]; }`,
          java: `int n = a.length;
long[] pre = new long[n + 1];
for (int i = 0; i < n; i++) pre[i + 1] = pre[i] + a[i];

// sum of a[l..r] inclusive
long rangeSum(int l, int r) { return pre[r + 1] - pre[l]; }`,
          python: `n = len(a)
pre = [0] * (n + 1)
for i in range(n):
    pre[i + 1] = pre[i] + a[i]
# or: from itertools import accumulate; pre = [0, *accumulate(a)]

def range_sum(l, r):        # inclusive
    return pre[r + 1] - pre[l]`,
        },
      },
      {
        kind: 'table',
        headers: ['Operation', 'Without prefix sums', 'With prefix sums'],
        rows: [
          ['Build', '—', 'O(n) once'],
          ['One range query', 'O(r - l)', 'O(1)'],
          ['q queries', 'O(q × n) worst case', 'O(n + q)'],
          ['Change one element', 'free', 'O(n) rebuild (see range query structures later)'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Sums overflow before you expect',
        body: {
          cpp: '10⁵ elements each up to 10⁹ sum to 10¹⁴, far beyond `int`. Make the prefix array `long long` even when the input is `int`.',
          java: '10⁵ elements each up to 10⁹ sum to 10¹⁴, far beyond `int`. Make the prefix array `long` even when the input is `int`.',
          python: 'Python integers do not overflow, so the prefix array is safe. The trap here is the off-by-one: `pre` has n + 1 entries and the query is `pre[r + 1] - pre[l]`, not `pre[r] - pre[l]`.',
        },
      },
    ],
    keyTakeaways: [
      '`pre[i]` = sum of the first i elements, with `pre[0] = 0` and n + 1 slots.',
      'Sum of a[l..r] = `pre[r + 1] - pre[l]`, in O(1) after O(n) build.',
      'Use a 64-bit type for the prefix array.',
    ],
    practice: {
      prompt: 'Read an array and then q queries of the form l r; print each range sum using prefix sums. Then use the same array to count how many subarrays have sum exactly k by looping over all (l, r) pairs; note that this is O(n²), and that the hashing chapter shows how to do it in O(n).',
      leetcode: { title: 'Range Sum Query - Immutable', slug: 'range-sum-query-immutable' },
    },
  },
  // -------------------------------------------------------------------------
  {
    sub: 4,
    summary: 'Extend prefix sums to two dimensions and answer any rectangle sum in constant time.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'The same idea works on a grid. Define `pre[i][j]` as the sum of every cell in the rectangle from the top-left corner (0, 0) to (i - 1, j - 1). Then the sum of any rectangle is four lookups: the big rectangle to its bottom-right corner, minus the strip above, minus the strip to the left, plus the corner that was subtracted twice.',
      },
      {
        kind: 'text',
        body: 'Building `pre` uses the same inclusion-exclusion in reverse: each cell is the cell itself, plus the prefix above, plus the prefix to the left, minus the prefix diagonally up-left (which both of those contain).',
      },
      {
        kind: 'code',
        caption: 'Build a 2D prefix array with a one-cell border of zeros',
        code: {
          cpp: `int R = g.size(), C = g[0].size();
vector<vector<long long>> pre(R + 1, vector<long long>(C + 1, 0));
for (int i = 0; i < R; i++)
    for (int j = 0; j < C; j++)
        pre[i+1][j+1] = g[i][j] + pre[i][j+1] + pre[i+1][j] - pre[i][j];

// Sum of rows r1..r2, cols c1..c2, inclusive
long long rect(int r1, int c1, int r2, int c2) {
    return pre[r2+1][c2+1] - pre[r1][c2+1] - pre[r2+1][c1] + pre[r1][c1];
}`,
          java: `int R = g.length, C = g[0].length;
long[][] pre = new long[R + 1][C + 1];
for (int i = 0; i < R; i++)
    for (int j = 0; j < C; j++)
        pre[i+1][j+1] = g[i][j] + pre[i][j+1] + pre[i+1][j] - pre[i][j];

// Sum of rows r1..r2, cols c1..c2, inclusive
long rect(int r1, int c1, int r2, int c2) {
    return pre[r2+1][c2+1] - pre[r1][c2+1] - pre[r2+1][c1] + pre[r1][c1];
}`,
          python: `R, C = len(g), len(g[0])
pre = [[0] * (C + 1) for _ in range(R + 1)]
for i in range(R):
    for j in range(C):
        pre[i+1][j+1] = g[i][j] + pre[i][j+1] + pre[i+1][j] - pre[i][j]

def rect(r1, c1, r2, c2):     # inclusive corners
    return pre[r2+1][c2+1] - pre[r1][c2+1] - pre[r2+1][c1] + pre[r1][c1]`,
        },
      },
      {
        kind: 'table',
        headers: ['Term', 'Meaning'],
        rows: [
          ['`pre[r2+1][c2+1]`', 'Everything from the origin to the bottom-right corner'],
          ['`- pre[r1][c2+1]`', 'Remove the rows above r1'],
          ['`- pre[r2+1][c1]`', 'Remove the columns left of c1'],
          ['`+ pre[r1][c1]`', 'The top-left block was removed twice; add it back'],
        ],
      },
      {
        kind: 'text',
        body: 'Draw it once on squared paper and the formula stops being something to memorise. Cost: O(R × C) to build, O(1) per rectangle query. The border of zeros plays the same role as `pre[0] = 0` in one dimension: it makes rectangles touching the top or left edge need no special case.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Row and column order',
        body: 'Grids are indexed `g[row][col]`, row first. Mixing that up compiles fine and produces a transposed answer that passes square test cases and fails rectangular ones. Name the variables `r` and `c`, never `x` and `y`, and be consistent.',
      },
    ],
    keyTakeaways: [
      '`pre[i][j]` = sum of the rectangle from (0,0) to (i-1, j-1), with a zero border.',
      'Rectangle sum = big corner − above − left + up-left corner.',
      'Index grids as `[row][col]` and name the variables to match.',
    ],
    practice: {
      prompt: 'Build the 2D prefix array for a 4×5 grid of your choosing and answer three rectangle queries by hand, then in code. Then find the 2×2 sub-square with the largest sum using rect() inside a double loop.',
      leetcode: { title: 'Range Sum Query 2D - Immutable', slug: 'range-sum-query-2d-immutable' },
    },
  },
  // -------------------------------------------------------------------------
  {
    sub: 5,
    summary: 'Walk a grid by rows, by columns and along its diagonals with the right loop for each.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A grid of R rows and C columns is an array of arrays: `g[r][c]`, with r from 0 to R - 1 and c from 0 to C - 1. Almost every grid problem is one of a handful of traversal orders plus something done at each cell. Learn the orders as loop shapes and the problems become "which order, and what do I do per cell".',
      },
      {
        kind: 'code',
        caption: 'Row-major and column-major',
        code: {
          cpp: `// Row by row, left to right (the natural order)
for (int r = 0; r < R; r++)
    for (int c = 0; c < C; c++)
        visit(g[r][c]);

// Column by column, top to bottom: swap the loops
for (int c = 0; c < C; c++)
    for (int r = 0; r < R; r++)
        visit(g[r][c]);`,
          java: `// Row by row, left to right (the natural order)
for (int r = 0; r < R; r++)
    for (int c = 0; c < C; c++)
        visit(g[r][c]);

// Column by column, top to bottom: swap the loops
for (int c = 0; c < C; c++)
    for (int r = 0; r < R; r++)
        visit(g[r][c]);`,
          python: `# Row by row, left to right (the natural order)
for r in range(R):
    for c in range(C):
        visit(g[r][c])

# Column by column, top to bottom: swap the loops
for c in range(C):
    for r in range(R):
        visit(g[r][c])`,
        },
      },
      { kind: 'heading', text: 'Diagonals' },
      {
        kind: 'text',
        body: 'Cells on the same **main diagonal** (top-left to bottom-right direction) share the value `r - c`. Cells on the same **anti-diagonal** (top-right to bottom-left) share `r + c`. That one fact turns "process each diagonal" into a grouping by a single number, and it is the key to the N-Queens conflict check, where a queen attacks every cell with the same `r - c` or the same `r + c`.',
      },
      {
        kind: 'code',
        caption: 'Sum every anti-diagonal, grouped by r + c',
        code: {
          cpp: `vector<long long> diag(R + C - 1, 0);   // r + c ranges 0 .. R+C-2
for (int r = 0; r < R; r++)
    for (int c = 0; c < C; c++)
        diag[r + c] += g[r][c];`,
          java: `long[] diag = new long[R + C - 1];   // r + c ranges 0 .. R+C-2
for (int r = 0; r < R; r++)
    for (int c = 0; c < C; c++)
        diag[r + c] += g[r][c];`,
          python: `diag = [0] * (R + C - 1)   # r + c ranges 0 .. R+C-2
for r in range(R):
    for c in range(C):
        diag[r + c] += g[r][c]`,
        },
      },
      {
        kind: 'text',
        body: 'For the main diagonals, `r - c` ranges from -(C - 1) to R - 1, so shift it by adding C - 1 to get a non-negative index. To walk one specific diagonal cell by cell, start at its first cell and step `r++, c++` (main) or `r++, c--` (anti) until you leave the grid.',
      },
      {
        kind: 'table',
        headers: ['Order', 'Loop shape', 'Typical use'],
        rows: [
          ['Row-major', 'r outer, c inner', 'Reading input, printing, most scans'],
          ['Column-major', 'c outer, r inner', 'Column sums, vertical patterns'],
          ['Diagonals', 'Group by `r - c` or `r + c`', 'N-Queens, diagonal sums, zigzag output'],
          ['Reverse row-major', 'r from R-1 down, c from C-1 down', 'DP that depends on cells below/right'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Neighbours with a direction array',
        body: 'The four neighbours of (r, c) are (r-1, c), (r+1, c), (r, c-1), (r, c+1). Store the offsets as `dr = {-1, 1, 0, 0}` and `dc = {0, 0, -1, 1}` and loop over the four, checking bounds each time. Eight directions add the diagonals. This is how grid BFS and DFS are written in the graph chapters.',
      },
    ],
    keyTakeaways: [
      'Row-major is r outer, c inner; swap the loops for column-major.',
      'Diagonals: constant `r - c` (main) or `r + c` (anti). Group by that number.',
      'Neighbour visits use a direction-offset array plus a bounds check.',
    ],
    practice: {
      prompt: 'Print an R×C grid four ways: row-major, column-major, each anti-diagonal on its own line, and each main diagonal on its own line. Then count the cells whose four neighbours are all larger than the cell (local minima), using the direction array and a bounds check.',
    },
  },
  // -------------------------------------------------------------------------
  {
    sub: 6,
    summary: 'Traverse a grid in a spiral by shrinking its boundaries one side at a time.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Spiral order visits the outer ring of a grid clockwise, then the next ring in, and so on. It is a favourite interview problem because the obvious approaches drown in special cases. The clean approach keeps four boundaries, top, bottom, left, right, walks one side, and then moves that boundary inward. The loop ends when the boundaries cross.',
      },
      {
        kind: 'code',
        caption: 'Spiral order with four shrinking boundaries',
        code: {
          cpp: `vector<int> spiral(vector<vector<int>>& g) {
    vector<int> out;
    int top = 0, bottom = g.size() - 1, left = 0, right = g[0].size() - 1;
    while (top <= bottom && left <= right) {
        for (int c = left; c <= right; c++) out.push_back(g[top][c]);
        top++;
        for (int r = top; r <= bottom; r++) out.push_back(g[r][right]);
        right--;
        if (top <= bottom) {
            for (int c = right; c >= left; c--) out.push_back(g[bottom][c]);
            bottom--;
        }
        if (left <= right) {
            for (int r = bottom; r >= top; r--) out.push_back(g[r][left]);
            left++;
        }
    }
    return out;
}`,
          java: `static List<Integer> spiral(int[][] g) {
    List<Integer> out = new ArrayList<>();
    int top = 0, bottom = g.length - 1, left = 0, right = g[0].length - 1;
    while (top <= bottom && left <= right) {
        for (int c = left; c <= right; c++) out.add(g[top][c]);
        top++;
        for (int r = top; r <= bottom; r++) out.add(g[r][right]);
        right--;
        if (top <= bottom) {
            for (int c = right; c >= left; c--) out.add(g[bottom][c]);
            bottom--;
        }
        if (left <= right) {
            for (int r = bottom; r >= top; r--) out.add(g[r][left]);
            left++;
        }
    }
    return out;
}`,
          python: `def spiral(g):
    out = []
    top, bottom, left, right = 0, len(g) - 1, 0, len(g[0]) - 1
    while top <= bottom and left <= right:
        for c in range(left, right + 1):
            out.append(g[top][c])
        top += 1
        for r in range(top, bottom + 1):
            out.append(g[r][right])
        right -= 1
        if top <= bottom:
            for c in range(right, left - 1, -1):
                out.append(g[bottom][c])
            bottom -= 1
        if left <= right:
            for r in range(bottom, top - 1, -1):
                out.append(g[r][left])
            left += 1
    return out`,
        },
      },
      {
        kind: 'text',
        body: 'The two `if` checks are the whole difficulty. After walking the top row and the right column, the grid may have run out of rows (a single-row grid) or columns (a single-column grid). Without the checks, the bottom row would be walked a second time in reverse. Trace a 1×4 grid and a 4×1 grid to see each check earn its place.',
      },
      {
        kind: 'table',
        headers: ['Grid', 'Walks performed', 'Which check saves you'],
        rows: [
          ['3×3', 'top, right, bottom, left, then the centre as a top walk', 'neither, but both are harmless'],
          ['1×4', 'top only', '`top <= bottom` blocks a reversed re-walk'],
          ['4×1', 'top (one cell), right (three cells)', '`left <= right` blocks a reversed re-walk'],
        ],
      },
      { kind: 'heading', text: 'The boundary ring only' },
      {
        kind: 'text',
        body: 'Walking only the outer boundary is the same code with the `while` replaced by a single pass. Filling a grid in spiral order (write 1, 2, 3, ... instead of reading) is the same code with `out.push_back(g[r][c])` replaced by `g[r][c] = counter++`.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Alternative: direction turning',
        body: 'Another correct version keeps a direction index into `dr`/`dc`, steps forward until the next cell is out of bounds or already visited, then turns right. It needs a visited grid (extra space) but handles any shape with no special cases. Know both; the boundary version is what interviewers expect to see written fluently.',
      },
    ],
    keyTakeaways: [
      'Keep four boundaries; walk one side, then move that boundary inward.',
      'Re-check `top <= bottom` and `left <= right` before the bottom and left walks.',
      'Test single-row and single-column grids; they are the cases that break naive versions.',
    ],
    practice: {
      prompt: 'Generate an n×n grid filled with 1 to n² in spiral order. Then, on paper, trace the spiral read of a 2×3 and a 3×2 grid and check your output against your trace.',
      leetcode: { title: 'Spiral Matrix', slug: 'spiral-matrix' },
    },
  },
  // -------------------------------------------------------------------------
  {
    sub: 7,
    summary: 'Transpose a square matrix in place and combine it with a reversal to rotate by 90 degrees.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'The **transpose** of a matrix flips it over its main diagonal: rows become columns. `t[c][r] = g[r][c]`. Rotating a matrix by 90 degrees sounds like a different, harder problem, and it is not: rotate clockwise = transpose, then reverse each row. Rotate anticlockwise = transpose, then reverse each column. Both in place for a square matrix, no second grid.',
      },
      {
        kind: 'code',
        caption: 'Transpose a square matrix in place',
        code: {
          cpp: `int n = g.size();
for (int r = 0; r < n; r++)
    for (int c = r + 1; c < n; c++)      // only above the diagonal
        swap(g[r][c], g[c][r]);`,
          java: `int n = g.length;
for (int r = 0; r < n; r++)
    for (int c = r + 1; c < n; c++) {    // only above the diagonal
        int t = g[r][c]; g[r][c] = g[c][r]; g[c][r] = t;
    }`,
          python: `n = len(g)
for r in range(n):
    for c in range(r + 1, n):            # only above the diagonal
        g[r][c], g[c][r] = g[c][r], g[r][c]
# With extra space, transpose is one line: t = [list(row) for row in zip(*g)]`,
        },
      },
      {
        kind: 'text',
        body: 'The inner loop starts at `c = r + 1`, not 0. Starting at 0 would swap every pair twice and leave the matrix unchanged. Each pair above the diagonal is swapped with its mirror below exactly once; the diagonal itself stays put.',
      },
      { kind: 'heading', text: 'Rotate 90° clockwise' },
      {
        kind: 'table',
        headers: ['Step', 'Matrix'],
        rows: [
          ['Start', '1 2 3 / 4 5 6 / 7 8 9'],
          ['Transpose', '1 4 7 / 2 5 8 / 3 6 9'],
          ['Reverse each row', '7 4 1 / 8 5 2 / 9 6 3'],
        ],
      },
      {
        kind: 'code',
        caption: 'Rotate clockwise = transpose + reverse rows',
        code: {
          cpp: `void rotateClockwise(vector<vector<int>>& g) {
    int n = g.size();
    for (int r = 0; r < n; r++)
        for (int c = r + 1; c < n; c++) swap(g[r][c], g[c][r]);
    for (auto& row : g) reverse(row.begin(), row.end());
}`,
          java: `static void rotateClockwise(int[][] g) {
    int n = g.length;
    for (int r = 0; r < n; r++)
        for (int c = r + 1; c < n; c++) {
            int t = g[r][c]; g[r][c] = g[c][r]; g[c][r] = t;
        }
    for (int[] row : g)
        for (int i = 0, j = n - 1; i < j; i++, j--) {
            int t = row[i]; row[i] = row[j]; row[j] = t;
        }
}`,
          python: `def rotate_clockwise(g):
    n = len(g)
    for r in range(n):
        for c in range(r + 1, n):
            g[r][c], g[c][r] = g[c][r], g[r][c]
    for row in g:
        row.reverse()`,
        },
      },
      {
        kind: 'text',
        body: 'Check with the top-left corner: 1 must end up top-right after a clockwise turn, and it does. If you get 3 there, you reversed columns instead of rows and rotated anticlockwise. For a non-square matrix, in-place rotation is impossible (the shape changes), so build a new R×C → C×R grid with `out[c][R - 1 - r] = g[r][c]`.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Aliased rows',
        body: {
          cpp: 'Building a grid with `vector<vector<int>> g(n, row)` copies `row` n times, which is what you want. There is no aliasing trap in C++ here; the trap is in the other direction, accidentally copying a whole grid by passing it by value to a function. Pass `vector<vector<int>>&`.',
          java: 'Building a grid with `int[][] g = new int[n][n]` is safe. But `int[][] copy = g.clone()` copies only the outer array: both grids share the same row arrays, and rotating one rotates the other. Copy row by row when you need an independent grid.',
          python: '`g = [[0] * n] * n` creates n references to the **same** row: change `g[0][0]` and every row changes. Build grids with `[[0] * n for _ in range(n)]`. This is the most common Python grid bug there is, and it is silent.',
        },
      },
    ],
    keyTakeaways: [
      'Transpose in place: swap `g[r][c]` with `g[c][r]` for c > r only.',
      'Clockwise rotation = transpose + reverse each row; anticlockwise = transpose + reverse each column.',
      'Non-square grids cannot rotate in place; build a new one with swapped dimensions.',
    ],
    practice: {
      prompt: 'Implement rotate anticlockwise in place and verify that four applications return the original. Then rotate a 2×3 grid clockwise into a new 3×2 grid.',
      leetcode: { title: 'Rotate Image', slug: 'rotate-image' },
    },
  },
  // -------------------------------------------------------------------------
  {
    sub: 8,
    summary: 'Use an array as a set of counters, indexed by the value being counted.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'When the values you are counting are small whole numbers, the fastest possible counter is an array where the **value is the index**. To count how often each digit 0-9 appears, make an array of ten zeros and do `count[d]++` for each digit. No searching, no hashing: one array access per item. This is called a counting array, bucket array or frequency array, and it is the idea behind counting sort and half of the "easy" string problems.',
      },
      {
        kind: 'code',
        caption: 'Count letters in a lowercase word',
        code: {
          cpp: `int cnt[26] = {0};
for (char ch : s) cnt[ch - 'a']++;
// cnt[0] is how many 'a', cnt[1] how many 'b', ...
for (int i = 0; i < 26; i++)
    if (cnt[i] > 0) cout << char('a' + i) << ": " << cnt[i] << endl;`,
          java: `int[] cnt = new int[26];
for (char ch : s.toCharArray()) cnt[ch - 'a']++;
// cnt[0] is how many 'a', cnt[1] how many 'b', ...
for (int i = 0; i < 26; i++)
    if (cnt[i] > 0) System.out.println((char) ('a' + i) + ": " + cnt[i]);`,
          python: `cnt = [0] * 26
for ch in s:
    cnt[ord(ch) - ord('a')] += 1
# cnt[0] is how many 'a', cnt[1] how many 'b', ...
for i in range(26):
    if cnt[i] > 0:
        print(chr(ord('a') + i), cnt[i])`,
        },
      },
      {
        kind: 'text',
        body: 'The expression `ch - \'a\'` maps the letter a to 0, b to 1, and so on, because characters are stored as numbers and the lowercase letters are consecutive. It is covered properly in the strings chapter; for now, read it as "position of the letter in the alphabet, from 0".',
      },
      { kind: 'heading', text: 'Where it beats a hash map' },
      {
        kind: 'table',
        headers: ['Values being counted', 'Use'],
        rows: [
          ['Lowercase letters', 'Array of 26'],
          ['Any byte / ASCII character', 'Array of 128 or 256'],
          ['Integers known to be in 0..K for small K', 'Array of K + 1'],
          ['Integers in a huge or unknown range, strings, pairs', 'Hash map (hashing chapter)'],
        ],
      },
      {
        kind: 'text',
        body: 'Two counting arrays compared element by element tell you whether two strings are anagrams. A counting array walked in index order gives you the values sorted, which is counting sort. A counting array of "how many elements are ≤ v" is a prefix sum over a counting array, which is how counting sort places elements stably.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Negative or out-of-range values',
        body: 'An index must be from 0 to size - 1. Counting values that can be negative needs an offset: index `v + OFFSET` with `OFFSET` at least the most negative value. Counting values up to 10⁹ needs a hash map, not an array of a billion. Check the constraints before choosing.',
      },
    ],
    keyTakeaways: [
      'When values are small non-negative integers, count them with `cnt[value]++`.',
      '`ch - \'a\'` maps lowercase letters to 0..25.',
      'Anagram checks, counting sort and "most frequent" questions are all counting arrays.',
    ],
    practice: {
      prompt: 'Read a string of lowercase letters and print the first character that appears exactly once, or a message if there is none. Then read two strings and decide whether one is an anagram of the other using two counting arrays.',
      leetcode: { title: 'First Unique Character in a String', slug: 'first-unique-character-in-a-string' },
    },
  },
  // -------------------------------------------------------------------------
  {
    sub: 9,
    summary: 'Keep a running best and reset it when it stops helping: the idea behind Kadane’s algorithm.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Find the contiguous stretch of an array with the largest sum. Trying every (start, end) pair costs O(n²) and, with prefix sums, still O(n²). One pass suffices, and the way it works teaches a way of thinking you will reuse in dynamic programming: at each position, ask "what is the best answer that **ends here**?" and build it from the best answer that ended one step earlier.',
      },
      {
        kind: 'text',
        body: 'The best sum ending at position i is either `a[i]` on its own, or `a[i]` added onto the best sum ending at i - 1. Pick whichever is larger. If the earlier best was negative, it would only drag `a[i]` down, so start fresh. The overall answer is the largest of all these "best ending here" values.',
      },
      {
        kind: 'table',
        headers: ['i', 'a[i]', 'best ending here', 'best so far'],
        rows: [
          ['0', '-2', '-2', '-2'],
          ['1', '1', 'max(1, -2 + 1) = 1', '1'],
          ['2', '-3', 'max(-3, 1 - 3) = -2', '1'],
          ['3', '4', 'max(4, -2 + 4) = 4', '4'],
          ['4', '-1', 'max(-1, 4 - 1) = 3', '4'],
          ['5', '2', 'max(2, 3 + 2) = 5', '5'],
          ['6', '1', 'max(1, 5 + 1) = 6', '6'],
        ],
      },
      {
        kind: 'code',
        caption: 'Kadane’s algorithm',
        code: {
          cpp: `long long endingHere = a[0], best = a[0];
for (int i = 1; i < a.size(); i++) {
    endingHere = max((long long)a[i], endingHere + a[i]);
    best = max(best, endingHere);
}
// best is the maximum subarray sum`,
          java: `long endingHere = a[0], best = a[0];
for (int i = 1; i < a.length; i++) {
    endingHere = Math.max(a[i], endingHere + a[i]);
    best = Math.max(best, endingHere);
}
// best is the maximum subarray sum`,
          python: `ending_here = best = a[0]
for x in a[1:]:
    ending_here = max(x, ending_here + x)
    best = max(best, ending_here)
# best is the maximum subarray sum`,
        },
      },
      {
        kind: 'text',
        body: 'Both variables start at `a[0]`, not 0. Starting `best` at 0 fails on an all-negative array, where the correct answer is the largest single element (a negative number) and 0 was never a possible sum. This is the same mistake as starting a "largest element" search at 0, and it fails the same hidden test.',
      },
      { kind: 'heading', text: 'Recovering the stretch itself' },
      {
        kind: 'text',
        body: 'To know **which** stretch, track where the current run started: whenever `endingHere` restarts from `a[i]` alone, record `start = i`; whenever `best` improves, record `bestStart = start, bestEnd = i`. Same loop, three more variables.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The pattern generalises',
        body: 'Maximum product subarray (track best and worst, because a negative times a negative is positive). Longest run of increasing values (length ending here). Best time to buy and sell a stock (best ending here = price minus the lowest price so far). Whenever a problem asks for the best contiguous something, try "best ending at i, from best ending at i - 1".',
      },
    ],
    keyTakeaways: [
      'Best sum ending at i = max(a[i], best ending at i-1 + a[i]).',
      'Answer = maximum over all positions of best-ending-here.',
      'Initialise from a[0], never 0, so all-negative arrays are handled.',
    ],
    practice: {
      prompt: 'Implement Kadane’s algorithm and print both the maximum sum and the start and end indices of the stretch. Test on [-2,1,-3,4,-1,2,1,-5,4] (expect 6, indices 3..6) and on [-3,-1,-2] (expect -1).',
      leetcode: { title: 'Maximum Subarray', slug: 'maximum-subarray' },
    },
  },
  // -------------------------------------------------------------------------
  {
    sub: 10,
    summary: 'Find and prevent the index errors that account for most array bugs.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Arrays are indexed from 0, so an array of n elements has valid positions 0 to n - 1, and position n does not exist. Nearly every array bug is a variation on forgetting this: a loop that goes one step too far, a comparison with the neighbour of the last element, a window that starts before 0. They are called **off-by-one** errors, and they are so common that the check for them should be a reflex.',
      },
      {
        kind: 'table',
        headers: ['Code', 'Problem', 'Fix'],
        rows: [
          ['`for (i = 0; i <= n; i++) a[i]`', 'Reads a[n], one past the end', '`i < n`'],
          ['`for (i = 1; i < n; i++)`', 'Skips a[0]; fine only if intentional', 'Start at 0 unless comparing to i-1'],
          ['`a[i + 1]` inside a loop to n - 1', 'Reads a[n] on the last step', 'Loop to n - 2, or check `i + 1 < n`'],
          ['`a[i - 1]` starting from i = 0', 'Reads a[-1]', 'Start at i = 1'],
          ['`a[n - 1]` on an empty array', 'n - 1 is -1', 'Handle n == 0 first'],
        ],
      },
      {
        kind: 'text',
        body: {
          cpp: 'C++ does not check bounds. `a[n]` on a `vector` reads whatever memory follows: sometimes a crash, sometimes a plausible wrong number, sometimes it works on your machine and fails on the judge. `a.at(n)` throws an exception instead, which is slower but useful while debugging.',
          java: 'Java checks every access and throws `ArrayIndexOutOfBoundsException: Index 5 out of bounds for length 5`. The message tells you the index and the length, which is enough to find the line and reason about why the index got there.',
          python: 'Python raises `IndexError: list index out of range` for positive indices past the end. Negative indices are the trap: `a[-1]` is legal and means the last element, so a loop that accidentally reaches -1 silently reads the wrong end of the list instead of failing.',
        },
      },
      { kind: 'heading', text: 'Habits that prevent them' },
      {
        kind: 'text',
        body: '**Half-open ranges.** Think of every range as [start, end): start included, end excluded. Length is `end - start`, an empty range is `start == end`, and consecutive ranges [0, 3) and [3, 6) meet without overlap or gap. All the standard loops are half-open: `for i in 0..n` visits n elements.',
      },
      {
        kind: 'text',
        body: '**Check before you touch a neighbour.** Any time you write `a[i + 1]` or `a[i - 1]`, or `g[r + 1][c]`, ask where i is when the loop ends and whether that neighbour exists. In grids, put the bounds check in one helper, `inBounds(r, c)`, and call it every time.',
      },
      {
        kind: 'text',
        body: '**Test the edges by hand.** Empty array, one element, two elements. If the code survives n = 0, 1 and 2 it usually survives everything. This is exactly the trace-table habit from the first chapter, applied to the boundaries.',
      },
      {
        kind: 'code',
        caption: 'A bounds helper for grids',
        code: {
          cpp: `bool inBounds(int r, int c) { return r >= 0 && r < R && c >= 0 && c < C; }
// ... for each direction:
int nr = r + dr[d], nc = c + dc[d];
if (inBounds(nr, nc)) visit(nr, nc);`,
          java: `static boolean inBounds(int r, int c) { return r >= 0 && r < R && c >= 0 && c < C; }
// ... for each direction:
int nr = r + dr[d], nc = c + dc[d];
if (inBounds(nr, nc)) visit(nr, nc);`,
          python: `def in_bounds(r, c):
    return 0 <= r < R and 0 <= c < C
# ... for each direction:
nr, nc = r + dr[d], c + dc[d]
if in_bounds(nr, nc):
    visit(nr, nc)`,
        },
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'The last element is at n - 1, the length is n',
        body: 'Say it out loud when you write `a[a.size() - 1]`. Then ask whether size can be zero, because then that index is -1. On a `vector`, `size() - 1` with size 0 does not even become -1: `size()` is unsigned, so it wraps to an enormous positive number and the read goes far out of bounds.',
      },
    ],
    keyTakeaways: [
      'Valid indices are 0 to n - 1. Position n does not exist.',
      'Think in half-open ranges [start, end); length is end - start.',
      'Check bounds before touching any neighbour, and test n = 0, 1, 2 by hand.',
    ],
    practice: {
      prompt: 'Write a function that returns how many elements in an array are strictly greater than both their neighbours (peaks). Decide deliberately what happens at the two ends. Test with [], [5], [1,2], [1,3,2], [1,3,2,4,1]; expected 0, 0, 0, 1, 2.',
    },
  },
];
