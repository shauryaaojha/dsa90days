import type { Lesson } from '../types';

/**
 * Python Chapter 15 — Python-Specific LeetCode Readiness.
 * The final chapter: the Python-flavoured working method, and the language
 * traps that cost submissions.
 */
export const ch15: Lesson[] = [
  // -------------------------------------------------------------------------
  {
    topicId: 'python-15.1',
    language: 'python',
    summary: 'Choose the right built-in container in seconds.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Container choice is frequently the whole optimisation — the algorithm unchanged, the verdict flipping from Time Limit Exceeded to Accepted. Five questions settle it.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The five questions',
        body: 'Do I need **key → value**? → `dict`. Do I only need **membership**? → `set`. Do I need **both ends fast**? → `deque`. Do I repeatedly need the **smallest**? → `heapq`. Otherwise → `list`.',
      },
      {
        kind: 'table',
        headers: ['Operation', 'list', 'deque', 'set / dict', 'heapq'],
        rows: [
          ['Index access', 'O(1)', 'O(n)', '—', '—'],
          ['Append', 'O(1)', 'O(1)', 'O(1)', 'O(log n)'],
          ['Pop from front', '**O(n)**', '**O(1)**', '—', '—'],
          ['Membership `in`', '**O(n)**', 'O(n)', '**O(1)**', 'O(n)'],
          ['Find minimum', 'O(n)', 'O(n)', 'O(n)', '**O(1)**'],
        ],
      },
      {
        kind: 'table',
        headers: ['Problem shape', 'Container'],
        rows: [
          ['Two Sum, "seen before"', '`dict`'],
          ['Duplicates, membership', '`set`'],
          ['Frequency counting', '`Counter`'],
          ['Grouping by a key', '`defaultdict(list)`'],
          ['BFS, sliding window max', '`deque`'],
          ['Top K, Dijkstra, merge K', '`heapq`'],
          ['Binary search on sorted data', '`bisect`'],
        ],
      },
      {
        kind: 'code',
        caption: 'The import line worth memorising',
        code: `from collections import deque, defaultdict, Counter
import heapq
from bisect import bisect_left, bisect_right`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Python has no built-in balanced BST',
        body: 'For "nearest key" queries you need `sorted` plus `bisect` — which gives O(log n) search but **O(n) insertion**. LeetCode provides `sortedcontainers`, whose `SortedList` gives O(log n) for both. Know it exists; most judges outside LeetCode do not have it.',
      },
      {
        kind: 'text',
        body: 'When performance genuinely matters, prefer plain structures: a `list` of ints beats a list of objects, and `int` arithmetic beats `Decimal`. Python is slow enough that container choice matters more here than in C++ or Java.',
      },
    ],
    keyTakeaways: [
      'Five questions pick the container: map? membership? ends? min? else list.',
      '`in` is O(n) on a list and O(1) on a set — the highest-value fact.',
      'Learn the import line by heart.',
      'No built-in balanced BST — `bisect` or `sortedcontainers` fills the gap.',
    ],
    practice: {
      prompt: 'Reproduce the complexity table from memory. Then review five past solutions and ask whether a different container would have been faster.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-15.2',
    language: 'python',
    summary: 'Avoid the patterns that make Python solutions time out.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Python is roughly 10–100× slower than C++ on the same loop, so a solution with the *right* complexity can still time out if written carelessly. Three patterns account for most Python TLE verdicts.',
      },
      { kind: 'heading', text: '1. `in` on a list inside a loop' },
      {
        kind: 'code',
        code: `# O(n^2) — 'in' scans the whole list every time
seen = []
for x in nums:
    if x in seen: return True
    seen.append(x)

# O(n)
seen = set()
for x in nums:
    if x in seen: return True
    seen.add(x)`,
      },
      { kind: 'heading', text: '2. `list.pop(0)` as a queue' },
      {
        kind: 'code',
        code: `# O(n) per removal -> BFS becomes O(n^2)
while queue:
    node = queue.pop(0)

# O(1)
from collections import deque
while queue:
    node = queue.popleft()`,
      },
      { kind: 'heading', text: '3. Building a string with `+=`' },
      {
        kind: 'code',
        code: `# O(n^2) — strings are immutable, so each += builds a NEW string
result = ""
for ch in s:
    result += ch

# O(n) — collect, then join once
parts = []
for ch in s:
    parts.append(ch)
result = "".join(parts)`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'These three are correct and slow',
        body: 'Each produces the right answer on small inputs and simply times out on the judge, which makes them maddening to diagnose. If your complexity analysis says O(n) but the verdict is TLE, check for these three first.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Push work into C',
        body: 'Built-ins run in C, not Python bytecode. `sum(nums)` beats a manual loop; `Counter(s)` beats hand-counting; `"".join(parts)` beats concatenation; a comprehension beats `append` in a loop. Same complexity, several times faster.',
      },
      {
        kind: 'code',
        caption: 'Smaller wins that add up',
        code: `# Comprehension beats append-in-a-loop
squares = [x*x for x in nums]

# Local variable lookup is faster than repeated attribute access
append = res.append          # in a very hot loop
for x in nums: append(x)

# Avoid recomputing len() inside a loop condition
n = len(nums)`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Slicing copies',
        body: '`s[1:]` inside a recursion is O(n) per call, turning O(n) into O(n²). Pass an index instead. The same applies to `nums[i:j]` inside a loop — it is not free.',
      },
    ],
    keyTakeaways: [
      '`x in list`, `pop(0)` and string `+=` are the three classic timeouts.',
      'All three are *correct* — they just fail on large inputs.',
      'Built-ins run in C and beat hand-written loops of the same complexity.',
      'Slicing copies — pass indices in recursion.',
    ],
    practice: {
      prompt: 'Write all three slow patterns and time them against the fast versions on 100,000 elements. One measurement each fixes the habit permanently.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-15.3',
    language: 'python',
    summary: 'Understand copy versus reference, the source of Python\'s subtlest bugs.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Assignment in Python never copies. `b = a` makes `b` another **name for the same object** — so mutating through one name is visible through the other. For immutable types this is invisible; for lists and dicts it causes real bugs.',
      },
      {
        kind: 'code',
        code: `a = [1, 2, 3]
b = a                # NOT a copy — the same list
b.append(4)
print(a)             # [1, 2, 3, 4]  <- a changed too

c = a[:]             # a shallow COPY
c.append(5)
print(a)             # unchanged`,
      },
      {
        kind: 'table',
        headers: ['Expression', 'What you get'],
        rows: [
          ['`b = a`', 'The same object — a second name'],
          ['`b = a[:]`', 'A shallow copy'],
          ['`b = list(a)`', 'A shallow copy'],
          ['`b = a.copy()`', 'A shallow copy'],
          ['`b = copy.deepcopy(a)`', 'A full recursive copy'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'A shallow copy of a 2-D list still shares the rows',
        body: '`grid[:]` copies the outer list but the inner lists are still shared, so `copy[0][0] = 9` changes the original. For a grid you need `[row[:] for row in grid]` or `copy.deepcopy`.',
      },
      {
        kind: 'code',
        caption: 'The three aliasing bugs you will actually hit',
        code: `# 1. Backtracking — appending the reference
res.append(path)         # every entry is the SAME list
res.append(path[:])      # correct

# 2. Grid construction — shared rows
grid = [[0] * n] * m                     # m references to ONE row
grid = [[0] * n for _ in range(m)]       # correct

# 3. Mutable default argument — created ONCE
def f(acc=[]):           # shared across every call
def f(acc=None):         # correct
    acc = acc or []`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Use `is` to check identity when debugging',
        body: '`a is b` tells you whether two names point at the same object. When a list changes "by itself", printing `a is b` or `id(a) == id(b)` finds the aliasing immediately.',
      },
      {
        kind: 'text',
        body: 'Function arguments follow the same rule: you receive a reference to the caller\'s object, so mutating a list parameter mutates the caller\'s list. That is often intended — in-place algorithms rely on it — but it should be deliberate.',
      },
    ],
    keyTakeaways: [
      'Assignment never copies — it creates another name.',
      'A shallow copy of a nested structure still shares the inner objects.',
      'The three aliasing bugs: backtracking, `[[0]*n]*m`, mutable defaults.',
      'Use `is` or `id()` to diagnose aliasing.',
    ],
    practice: {
      prompt: 'Reproduce all three aliasing bugs above and fix each. Then build a 2-D grid with `[[0]*n]*m`, set one cell, and print the whole grid.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-15.4',
    language: 'python',
    summary: 'Avoid the slicing mistakes that cost correctness and speed.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Slicing is Python\'s most distinctive feature and its rules are consistent — but three details catch people out: the exclusive end, the silent out-of-range behaviour, and the fact that every slice copies.',
      },
      {
        kind: 'code',
        code: `a = [0, 1, 2, 3, 4]

a[1:3]        # [1, 2]        — end is EXCLUSIVE
a[:3]         # [0, 1, 2]
a[2:]         # [2, 3, 4]
a[:]          # a full copy
a[::-1]       # reversed copy
a[::2]        # every second element
a[-2:]        # last two`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Slices never raise; indexing does',
        body: '`a[10:20]` on a 5-element list returns `[]` silently. But `a[10]` raises `IndexError`. That asymmetry means a slicing bug produces empty results rather than a crash — much harder to locate.',
      },
      {
        kind: 'code',
        caption: 'The silent-empty trap',
        code: `a = [1, 2, 3]

a[5:]         # []  — no error
a[3:1]        # []  — start after end, no error
a[5]          # IndexError

# So an off-by-one in a slice gives you [] and no clue where it came from.`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Every slice copies — O(k)',
        body: '`s[1:]` inside a recursion is O(n) per call, turning an O(n) algorithm into O(n²). Pass an index instead. In a loop, `nums[i:j]` is equally not free — this is one of the commonest hidden costs in Python DSA.',
      },
      {
        kind: 'code',
        caption: 'Index instead of slice',
        code: `# O(n^2) — copies the remaining string every call
def rec(s):
    if not s: return
    rec(s[1:])

# O(n) — nothing is copied
def rec(s, i):
    if i == len(s): return
    rec(s, i + 1)`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Slice assignment mutates in place',
        body: '`a[1:3] = [9, 9, 9]` replaces that range and can change the list length. `a[:] = other` replaces the *contents* while keeping the same object — useful when other names refer to it and you want them to see the change.',
      },
      {
        kind: 'text',
        body: 'Negative indices count from the end: `a[-1]` is the last element, `a[-2]` the second-last. Combined with slicing, `a[:-1]` means "everything but the last" — a very common and readable idiom.',
      },
    ],
    keyTakeaways: [
      'The end index is exclusive; out-of-range slices return `[]` silently.',
      'Indexing raises but slicing does not — bugs surface as empty results.',
      'Every slice copies — pass indices in recursion and loops.',
      '`a[:] = other` replaces contents in place, keeping the same object.',
    ],
    practice: {
      prompt: 'Try `a[5:]`, `a[3:1]` and `a[5]` on a 3-element list and note which raises. Then time a recursion using `s[1:]` against one passing an index.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-15.5',
    language: 'python',
    summary: 'Handle the dict and set edge cases that bite in submissions.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Dicts and sets are the backbone of Python DSA, and four of their behaviours cause most of the bugs: KeyError on read, unhashable keys, the defaultdict insertion side-effect, and modification during iteration.',
      },
      {
        kind: 'code',
        caption: '1. Reading a missing key raises',
        code: `d = {}
d["x"]                    # KeyError
d.get("x")                # None — safe
d.get("x", 0)             # 0 — safe with a default
"x" in d                  # False — the test that never inserts`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: '2. `defaultdict` inserts on read',
        body: '`if d[x] > 0:` on a `defaultdict` **creates** `x` as a side effect, growing the dict and corrupting any later `len()` or iteration. Test with `if x in d:` to avoid inserting. This is the price of the convenience.',
      },
      {
        kind: 'code',
        code: `from collections import defaultdict
d = defaultdict(int)

len(d)              # 0
if d["missing"]:    # inserts "missing" -> 0
    pass
len(d)              # 1  <- phantom key`,
      },
      {
        kind: 'code',
        caption: '3. Keys must be hashable',
        code: `d[(1, 2)] = x        # tuple — fine
d[[1, 2]] = x        # TypeError: unhashable type: 'list'
s.add({1, 2})        # TypeError — sets are mutable too
s.add(frozenset({1, 2}))     # frozenset IS hashable`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Convert lists to tuples for keys',
        body: 'That is why the anagram key is `"".join(sorted(w))` or `tuple(sorted(w))` rather than the sorted list. Any time you want to key on a sequence, make it a tuple first.',
      },
      {
        kind: 'code',
        caption: '4. Do not modify during iteration',
        code: `# RuntimeError: dictionary changed size during iteration
for k in d:
    if d[k] == 0:
        del d[k]

# Fix: iterate over a snapshot of the keys
for k in list(d):
    if d[k] == 0:
        del d[k]

# Or build a new dict
d = {k: v for k, v in d.items() if v != 0}`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Dicts preserve insertion order, not sorted order',
        body: 'Since Python 3.7 a dict remembers the order keys were inserted. That is **not** sorted order. If the expected output is sorted, sort explicitly — relying on the dict is a bug waiting for a different input.',
      },
      {
        kind: 'text',
        body: 'One more: `set` iteration order is neither insertion nor sorted, and can vary between runs. If you build an answer from a set and it must be ordered, always `sorted(s)`.',
      },
    ],
    keyTakeaways: [
      '`d[k]` raises; `d.get(k, default)` and `k in d` do not.',
      'Reading a missing `defaultdict` key inserts it.',
      'Keys must be hashable — convert lists to tuples.',
      'Iterate `list(d)` when deleting; dicts keep insertion order, not sorted.',
    ],
    practice: {
      prompt: 'Reproduce the phantom-key bug with a `defaultdict`, then the RuntimeError from deleting during iteration. Fix both.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-15.6',
    language: 'python',
    summary: 'Work with Python\'s recursion limit rather than being surprised by it.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Python\'s default recursion limit is **1000 frames**. That is a genuine, Python-specific constraint: solutions that work in C++ or Java at the same input size will raise `RecursionError` here.',
      },
      {
        kind: 'code',
        code: `import sys
sys.getrecursionlimit()          # 1000 by default
sys.setrecursionlimit(10**6)     # raise it`,
      },
      {
        kind: 'table',
        headers: ['Structure', 'Depth', 'Safe?'],
        rows: [
          ['Balanced tree, 10⁶ nodes', '~20', 'Yes'],
          ['Skewed tree, 10⁵ nodes', '10⁵', '**No**'],
          ['Linked list, 10⁵ nodes', '10⁵', '**No**'],
          ['Grid DFS, 300×300 one region', '~90,000', '**No**'],
          ['Subsets, n = 20', '20', 'Yes'],
        ],
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Raising the limit can crash the interpreter',
        body: 'Python frames sit on the C stack, which is also finite. Setting the limit to 10⁶ may produce a hard segfault rather than a clean exception. It is fine for experiments; for a submission you care about, prefer the iterative version.',
      },
      {
        kind: 'code',
        caption: 'The reliable fix: an explicit stack',
        code: `# Recursive — RecursionError on a large grid
def dfs(r, c):
    if out_of_bounds or visited: return
    mark(r, c)
    for dr, dc in DIRS: dfs(r + dr, c + dc)

# Iterative — no limit
stack = [(sr, sc)]
while stack:
    r, c = stack.pop()
    if out_of_bounds or visited: continue
    mark(r, c)
    for dr, dc in DIRS: stack.append((r + dr, c + dc))`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Iterative DFS must check `visited` on pop',
        body: 'A node can be pushed several times before it is processed, so the check belongs at the top of the loop, not only before pushing. Omitting it revisits nodes and can make the traversal quadratic.',
      },
      {
        kind: 'text',
        body: 'For memoised recursion, `@cache` from `functools` does not change the depth — it only avoids recomputation. A deep recursion is still deep. If depth is the problem, you need the iterative form or a bottom-up table.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: '`@cache` is the shortest memoisation in any language',
        body: '`from functools import cache` then `@cache` above a function gives you full memoisation with one line. Arguments must be hashable, so pass tuples rather than lists — a small price for removing all the memo bookkeeping.',
      },
    ],
    keyTakeaways: [
      'The default limit is 1000 frames — a real Python-specific constraint.',
      'Balanced trees are safe; skewed trees, lists and big grids are not.',
      'Raising the limit risks a hard crash — prefer the iterative form.',
      '`@cache` removes recomputation but not depth.',
    ],
    practice: {
      prompt: 'Build a 2000-node linked list and reverse it recursively — watch it raise. Then rewrite iteratively and confirm it works.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-15.7',
    language: 'python',
    summary: 'Debug effectively, separating syntax errors from logic errors.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'When something fails, first identify which *kind* of failure it is. Syntax and logic errors are found in completely different ways, and mixing the approaches wastes time on both.',
      },
      {
        kind: 'table',
        headers: ['Error', 'Usual cause'],
        rows: [
          ['`IndentationError`', 'Mixed tabs and spaces, or a misaligned block'],
          ['`NameError`', 'Typo, or using a variable before assigning it'],
          ['`TypeError`', 'Wrong type — often `None` from a function with no return'],
          ['`IndexError`', 'Off-by-one in a loop bound'],
          ['`KeyError`', 'Reading a missing dict key with `[]`'],
          ['`AttributeError`', 'Calling a method on `None` — usually an unguarded node'],
          ['`RecursionError`', 'Depth over 1000, or a broken base case'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Read the traceback from the bottom up',
        body: 'The last line names the error; the line above it points at your code. Everything higher is the call chain that got you there. Beginners read from the top and drown in library frames — start at the bottom.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: '`TypeError: NoneType` usually means a missing `return`',
        body: 'A Python function with no `return` returns `None`. Forgetting `return` on one branch of a recursion produces `None` that then flows into arithmetic, and the error appears far from the actual mistake.',
      },
      {
        kind: 'code',
        caption: 'Printing that actually helps',
        code: `print(f"{i=} {l=} {r=} {total=}")      # f-string debugging, Python 3.8+
# prints:  i=3 l=1 r=5 total=12

print(nums)                            # lists print fine, unlike Java
print(dict(counter))                   # Counter prints readably too

import pprint
pprint.pprint(grid)                    # 2-D structures, one row per line`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The `=` f-string is the best debug tool in Python',
        body: '`f"{x=}"` prints both the name and the value, so you never mislabel a print statement. It is the fastest way to dump loop state, and it removes a whole class of confusion.',
      },
      {
        kind: 'text',
        body: 'For a wrong answer on a large hidden test, do not stare at the input. Find the **smallest** input that reproduces it — usually one of the standard edge cases — and debug that instead.',
      },
      {
        kind: 'code',
        caption: 'Testing against a brute force',
        code: `import random

for _ in range(1000):
    nums = [random.randint(-10, 10) for _ in range(random.randint(1, 8))]
    if solution(nums) != brute_force(nums):
        print("MISMATCH:", nums)       # a tiny failing case, found automatically
        break`,
      },
    ],
    keyTakeaways: [
      'Read tracebacks from the bottom up.',
      '`TypeError: NoneType` usually means a missing `return`.',
      '`f"{x=}"` prints the name and value together.',
      'Random testing against a brute force finds tiny failing inputs.',
    ],
    practice: {
      prompt: 'Write the random-testing loop above for a problem you have solved two ways. It will find edge cases faster than you can think of them.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-15.8',
    language: 'python',
    summary: 'Read constraints and pick an approach before writing code.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'The constraints section is a **hint about the intended solution**. A judge allows roughly 10⁸ simple operations per second in C++ — and Python is 10–100× slower, so budget closer to **10⁶–10⁷** operations.',
      },
      {
        kind: 'table',
        headers: ['n up to', 'Target complexity', 'Suggests'],
        rows: [
          ['10–20', 'O(2ⁿ), O(n!)', 'Backtracking, bitmask DP'],
          ['100–500', 'O(n³)', 'Floyd-Warshall, interval DP'],
          ['1,000–2,000', 'O(n²)', '2-D DP — but be careful in Python'],
          ['10⁵', 'O(n log n) or O(n)', 'Sorting, heap, two pointers, hashing'],
          ['10⁶+', 'O(n) with small constants', 'Single pass, built-ins only'],
        ],
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'O(n²) at n = 10⁴ is borderline in Python',
        body: 'That is 10⁸ operations — fine in C++, likely TLE in Python. When you are near the boundary, push the work into built-ins, or accept that the intended solution is probably faster than O(n²).',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Read the constraint before choosing the approach',
        body: 'If n ≤ 20, the problem is telling you exponential is *expected* — stop hunting for something polynomial. If n is 10⁵, an O(n²) idea is a dead end however elegant. This single habit saves enormous time.',
      },
      {
        kind: 'text',
        body: 'Constraints also tell you what **cannot** happen. "1 ≤ n" means the array is never empty, so skip that guard. "All values distinct" means no duplicate handling. They remove work as often as they add it.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Python\'s one free advantage: no overflow',
        body: 'Integers are arbitrary precision, so prefix sums, products and factorials never wrap. C++ and Java solutions need `long` and careful casting; you simply do not have that class of bug.',
      },
      {
        kind: 'code',
        caption: 'The method, in order',
        code: `1. Read the problem. Identify input, output, and edge cases.
2. Read the constraints. Derive the target complexity.
3. Name the pattern. (See /patterns if recognition is the blocker.)
4. Write the brute force if the approach is unclear.
5. Apply the matching optimisation.
6. Dry-run on a tiny input.
7. Check the edge cases.
8. Submit.`,
      },
      {
        kind: 'text',
        body: 'Steps 2 and 3 are the ones beginners skip, and they are where most of the leverage is. Deriving the target complexity from n, then asking which pattern achieves it, converts an open-ended problem into a much smaller search.',
      },
    ],
    keyTakeaways: [
      'Budget 10⁶–10⁷ operations in Python, not the 10⁸ C++ gets.',
      'n ≤ 20 means exponential is expected; n = 10⁵ rules out O(n²).',
      'Constraints remove work as often as they add it.',
      'Python integers never overflow — one genuine free advantage.',
    ],
    practice: {
      prompt: 'For five problems, predict the intended complexity from the constraints alone before reading any solution. Check how often you were right.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-15.9',
    language: 'python',
    summary: 'Build a personal snippet notebook and a log of your own mistakes.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'You will write the same fifteen or so fragments hundreds of times. Keeping them in one file — and typing them from memory until the file becomes unnecessary — removes a real tax from every problem you attempt.',
      },
      {
        kind: 'code',
        caption: 'The snippets worth memorising',
        code: `from collections import deque, defaultdict, Counter
import heapq
from bisect import bisect_left, bisect_right

# Frequency
freq = Counter(s)
freq = defaultdict(int);  freq[x] += 1

# Grouping
groups = defaultdict(list);  groups[key].append(x)

# BFS
q = deque([start]); visited = {start}
while q:
    for _ in range(len(q)):
        node = q.popleft()

# Grid directions and bounds
DIRS = ((1,0), (-1,0), (0,1), (0,-1))
if 0 <= nr < rows and 0 <= nc < cols: ...

# Heap
heapq.heappush(pq, (dist, node));  d, node = heapq.heappop(pq)
heapq.heappush(mx, -x);  largest = -heapq.heappop(mx)

# Binary search on the answer
while lo < hi:
    mid = (lo + hi) // 2
    if feasible(mid): hi = mid
    else:             lo = mid + 1

# Backtracking
def dfs(start):
    res.append(path[:])
    for i in range(start, len(nums)):
        path.append(nums[i]); dfs(i + 1); path.pop()

# Nodes
class ListNode:
    def __init__(self, val=0, next=None): self.val, self.next = val, next
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val, self.left, self.right = val, left, right`,
      },
      {
        kind: 'code',
        caption: 'The two structures with no built-in',
        code: `class DSU:
    def __init__(self, n):
        self.parent = list(range(n)); self.size = [1]*n; self.components = n
    def find(self, x):
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]
            x = self.parent[x]
        return x
    def unite(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb: return False
        if self.size[ra] < self.size[rb]: ra, rb = rb, ra
        self.parent[rb] = ra; self.size[ra] += self.size[rb]
        self.components -= 1; return True

class TrieNode:
    def __init__(self): self.children = {}; self.is_word = False`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Type them, do not copy them',
        body: 'The value is in the recall. A snippet you can type from memory costs nothing mid-problem; one you have to look up breaks your concentration. Write each from scratch until it flows.',
      },
      { kind: 'heading', text: 'The mistake log' },
      {
        kind: 'text',
        body: 'Every time a submission fails, write one line: **what the bug was**, and **what would have caught it**. After thirty problems you will have a personalised list of your own recurring errors — shorter and far more useful than any generic checklist.',
      },
      {
        kind: 'code',
        caption: 'What entries look like',
        code: `2026-02-14  Subarray Sum Equals K
  Bug: forgot seen[0] = 1
  Catch: test where the whole prefix equals k

2026-02-16  Number of Islands
  Bug: RecursionError on a 300x300 grid
  Catch: estimate depth before choosing recursion

2026-02-19  Subsets
  Bug: res.append(path) instead of path[:]
  Catch: print res after two iterations

2026-02-22  Course Schedule
  Bug: built the edges backwards
  Catch: hand-trace a 2-node example`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Log the failures, not the successes',
        body: 'A list of problems solved feels good and teaches nothing. A list of bugs made is uncomfortable and is what actually improves your accuracy. Keep the one that stings.',
      },
      {
        kind: 'text',
        body: 'That is the end of Phase 0. You can read and write Python fluently, you know which built-in to reach for and why, you recognise the core patterns, and you have a method for attacking an unfamiliar problem. The rest is practice — and the pattern cheatsheet is there whenever recognition is the thing that stalls you.',
      },
    ],
    keyTakeaways: [
      'The same fifteen fragments cover most problems — type them from memory.',
      'DSU and Trie have no built-in equivalent.',
      'Keep a mistake log: the bug, and what would have caught it.',
      'Review the log before contests; log failures, not successes.',
    ],
    practice: {
      prompt: 'Create the snippet file and type everything above from memory, checking afterwards. Then start the mistake log with the last three bugs you remember.',
    },
  },
];
