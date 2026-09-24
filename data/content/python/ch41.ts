import type { Lesson } from '../types';

/**
 * Chapter 41 — Idioms and Pitfalls (Python).
 * Twelve things Python does that surprise people who learned the rules from
 * another language, or from a tutorial. Each one has cost a real student a
 * real submission.
 */
export const ch41: Lesson[] = [
  // -------------------------------------------------------------------------
  {
    topicId: 'python-41.1',
    language: 'python',
    summary: 'Understand why a default argument of [] is shared between calls, and what to write instead.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A default argument is evaluated **once**, when the `def` line runs, not each time the function is called. For a number or a string that does not matter. For a list, dictionary or set it means every call that uses the default shares the same object, and anything one call appends is still there for the next call.',
      },
      {
        kind: 'code',
        caption: 'The shared default',
        code: `def add_item(item, items=[]):
    items.append(item)
    return items

print(add_item(1))   # [1]
print(add_item(2))   # [1, 2]   <- not [2]: same list as before
print(add_item(3))   # [1, 2, 3]`,
        output: '[1]\n[1, 2]\n[1, 2, 3]',
      },
      {
        kind: 'text',
        body: 'The idiom is to default to `None` and create the list inside the function, so each call that needs one gets a fresh one.',
      },
      {
        kind: 'code',
        caption: 'The fix',
        code: `def add_item(item, items=None):
    if items is None:
        items = []
    items.append(item)
    return items

print(add_item(1))   # [1]
print(add_item(2))   # [2]`,
        output: '[1]\n[2]',
      },
      {
        kind: 'text',
        body: 'This bites hardest in recursive helpers: `def dfs(node, visited=set())` looks convenient, and works for the first test case. On the second test case in the same run, `visited` still contains every node from the first, and the search finds nothing. LeetCode runs all test cases in one process, so the second case fails and the message says nothing useful.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'It is not only lists',
        body: 'Any mutable default has this problem: `{}`, `set()`, a `deque`, an object of your own class. The `None` pattern covers all of them. An immutable default (`0`, `""`, `()`, `None`, `False`) is always safe.',
      },
    ],
    keyTakeaways: [
      'Defaults are evaluated once at definition time, so a mutable default is shared by every call.',
      'Default to `None` and create the mutable object inside the function.',
      'In LeetCode, a shared default leaks state between test cases.',
    ],
    practice: {
      prompt: 'Write `def memo_fib(n, cache={})` that caches results in the default dict. Call it for n = 10, then print the cache to see it persisted. Then rewrite it with the `None` pattern and confirm the cache is fresh per top-level call, and explain which behaviour you would actually want for memoisation and why.',
    },
  },
  // -------------------------------------------------------------------------
  {
    topicId: 'python-41.2',
    language: 'python',
    summary: 'Use == to compare values and is only for None, and know why the difference is invisible until it is not.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: '`==` asks whether two values are equal. `is` asks whether two names point at the **same object** in memory. For most values you want `==`. The trap is that `is` sometimes gives the same answer as `==` by accident, so code that uses it wrongly passes tests and then fails on a slightly different input.',
      },
      {
        kind: 'code',
        caption: 'Same answer by accident, then not',
        code: `a = 256
b = 256
print(a == b, a is b)   # True True   (small integers are cached: same object)

a = 1000
b = 1000
print(a == b, a is b)   # True False  (two separate objects)

x = [1, 2]
y = [1, 2]
print(x == y, x is y)   # True False  (equal contents, different lists)
z = x
print(x is z)           # True        (z is another name for the same list)`,
        output: 'True True\nTrue False\nTrue False\nTrue',
      },
      {
        kind: 'text',
        body: 'CPython keeps one shared object for each integer from -5 to 256, so `is` on small numbers happens to be True. It is an implementation detail, not a rule, and it stops at 257. Similar caching applies to some short strings. Never rely on it.',
      },
      {
        kind: 'table',
        headers: ['Comparison', 'Write', 'Reason'],
        rows: [
          ['Is x equal to 5?', '`x == 5`', 'Value comparison'],
          ['Is x None?', '`x is None`', 'There is only one `None`; identity is the idiom'],
          ['Is x True / False?', '`if x:` / `if not x:`', 'Do not compare to `True` at all'],
          ['Are two lists the same contents?', '`a == b`', 'Element-by-element'],
          ['Do two names refer to one list (aliasing)?', '`a is b`', 'Identity, the rare case where you mean it'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Linters will warn about `== None`',
        body: '`x == None` usually works, but a class can override `==` to say anything, and `is None` is both faster and always correct. Write `is None` and `is not None`; it is the one place `is` belongs in everyday code.',
      },
    ],
    keyTakeaways: [
      '`==` compares values; `is` compares identity.',
      'Use `is` only for `None` (and, rarely, to detect aliasing).',
      'Small integers and some strings are cached, which makes `is` accidentally True; never rely on it.',
    ],
    practice: {
      prompt: 'Predict the output of `a = "hi"; b = "".join(["h", "i"]); print(a == b, a is b)` and then run it. Then write a function that takes an optional list parameter and correctly distinguishes "no list given" from "an empty list given" using `is None`.',
    },
  },
  // -------------------------------------------------------------------------
  {
    topicId: 'python-41.3',
    language: 'python',
    summary: 'Build a 2D list correctly, and recognise the shared-row bug from its symptom.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Multiplying a list repeats its **references**, not its contents. `[0] * 4` is fine because the four zeros are immutable and can never diverge. `[[0] * 4] * 3` is a list of three references to one inner list: change any row and all three rows change, because there is only one row.',
      },
      {
        kind: 'code',
        caption: 'The bug and its symptom',
        code: `grid = [[0] * 4] * 3
grid[0][0] = 7
print(grid)
# [[7, 0, 0, 0], [7, 0, 0, 0], [7, 0, 0, 0]]   <- every row changed

print(grid[0] is grid[1])   # True: same object`,
        output: '[[7, 0, 0, 0], [7, 0, 0, 0], [7, 0, 0, 0]]\nTrue',
      },
      {
        kind: 'text',
        body: 'The fix is a comprehension, which runs `[0] * 4` afresh for each row and so creates three distinct lists.',
      },
      {
        kind: 'code',
        caption: 'The right way to build a grid',
        code: `R, C = 3, 4
grid = [[0] * C for _ in range(R)]
grid[0][0] = 7
print(grid)
# [[7, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]

# Same rule for any nested structure:
visited = [[False] * C for _ in range(R)]
buckets = [[] for _ in range(10)]        # not [[]] * 10
dp = [[0] * (m + 1) for _ in range(n + 1)]`,
        output: '[[7, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]',
      },
      {
        kind: 'text',
        body: 'The symptom in a real program is a DP table or visited grid where marking one cell appears to mark a whole column, or a BFS that thinks everything is visited after one step. If a grid algorithm behaves as though rows are linked, check how the grid was built before checking the algorithm.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Three levels deep',
        body: 'For a 3D table, nest the comprehension: `[[[0] * Z for _ in range(Y)] for _ in range(X)]`. Any `*` applied to a list containing mutable things is suspect; any `*` on a list of numbers, strings or tuples is fine.',
      },
    ],
    keyTakeaways: [
      '`[[0] * C] * R` makes R references to one row; changes appear in every row.',
      'Build grids with `[[0] * C for _ in range(R)]`.',
      'The symptom is a column or whole grid changing when you set one cell.',
    ],
    practice: {
      prompt: 'Build a 3×3 grid both ways, set the centre cell to 1 in each, and print them. Then build a list of 5 empty lists both ways, append to the first, and print. Then write a function `make_grid(r, c, fill)` that is safe for any `fill`, including a list.',
    },
  },
  // -------------------------------------------------------------------------
  {
    topicId: 'python-41.4',
    language: 'python',
    summary: 'Choose between assignment, a shallow copy and a deep copy, and know what each one shares.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Assignment never copies. `b = a` makes `b` another name for the same list, and modifying through either name modifies the one list. To get an independent list you have to ask for a copy, and there are two kinds: **shallow**, which copies the outer list but shares whatever is inside it, and **deep**, which copies all the way down.',
      },
      {
        kind: 'code',
        caption: 'Assignment, shallow copy, deep copy',
        code: `import copy

a = [[1, 2], [3, 4]]

b = a                    # alias: same list
c = a[:]                 # shallow copy: new outer list, same inner lists (also list(a), a.copy())
d = copy.deepcopy(a)     # deep copy: everything new

a.append([5, 6])         # outer change
a[0][0] = 99             # inner change

print(b)   # [[99, 2], [3, 4], [5, 6]]  sees both changes
print(c)   # [[99, 2], [3, 4]]          new outer, so no [5, 6]; shared inner, so 99
print(d)   # [[1, 2], [3, 4]]           untouched`,
        output: '[[99, 2], [3, 4], [5, 6]]\n[[99, 2], [3, 4]]\n[[1, 2], [3, 4]]',
      },
      {
        kind: 'table',
        headers: ['Operation', 'Outer list', 'Inner objects', 'When to use'],
        rows: [
          ['`b = a`', 'shared', 'shared', 'You want two names for one thing (rare on purpose)'],
          ['`a[:]`, `list(a)`, `a.copy()`', 'new', 'shared', 'Flat lists of numbers or strings; a snapshot you will not mutate inside'],
          ['`copy.deepcopy(a)`', 'new', 'new', 'Nested lists or dicts you will modify independently'],
        ],
      },
      { kind: 'heading', text: 'Where it bites in DSA code' },
      {
        kind: 'text',
        body: 'Backtracking. You build a `path` list, and when you find a complete answer you do `result.append(path)`. Then the loop continues, pops from `path`, pushes something else, and `result` now contains references to the same, now-changed, list. Every answer in `result` ends up identical, usually empty. The fix is `result.append(path[:])`: a shallow copy is enough because the elements are numbers.',
      },
      {
        kind: 'code',
        caption: 'The backtracking snapshot',
        code: `def subsets(nums):
    result, path = [], []
    def go(i):
        if i == len(nums):
            result.append(path[:])      # snapshot; path alone would alias
            return
        go(i + 1)
        path.append(nums[i])
        go(i + 1)
        path.pop()
    go(0)
    return result

print(subsets([1, 2]))   # [[], [2], [1], [1, 2]]`,
        output: '[[], [2], [1], [1, 2]]',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Function arguments are references too',
        body: 'Passing a list to a function passes the reference. If the function sorts or appends, the caller’s list changes. That is often what you want (in-place algorithms) and sometimes a surprise (a helper that "only reads" the list but calls `.sort()` on it). Use `sorted(a)` instead of `a.sort()` when you must not touch the input.',
      },
    ],
    keyTakeaways: [
      '`b = a` aliases; `a[:]` copies one level; `deepcopy` copies everything.',
      'In backtracking, append `path[:]`, never `path`.',
      'Functions receive references; `sorted()` and slicing leave the caller’s list alone.',
    ],
    practice: {
      prompt: 'Write the permutations of [1, 2, 3] with backtracking, first appending `path` and observing the broken output, then `path[:]`. Then build a nested list, shallow-copy it, change an inner element, and explain in one sentence why the copy changed.',
    },
  },
  // -------------------------------------------------------------------------
  {
    topicId: 'python-41.5',
    language: 'python',
    summary: 'Know which values count as false in a condition, and stop writing `if x:` when x can legitimately be 0.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'Python lets any value stand in a condition. Empty containers, zero, `None` and empty strings count as false; everything else counts as true. That makes `if not stack:` a clean way to say "if the stack is empty". It also makes `if node.val:` a bug when the value can be 0, because 0 is false and the node is silently skipped.',
      },
      {
        kind: 'table',
        headers: ['Falsy', 'Truthy'],
        rows: [
          ['`None`', 'Any object that is not one of the falsy ones'],
          ['`0`, `0.0`', 'Any non-zero number, including negatives'],
          ['`""`', 'Any non-empty string, including `" "`'],
          ['`[]`, `()`, `{}`, `set()`', 'Any non-empty container, including `[0]` and `[None]`'],
          ['`False`', '`True`'],
        ],
      },
      {
        kind: 'code',
        caption: 'Idiomatic uses and a bug',
        code: `while stack:                # good: "while not empty"
    node = stack.pop()

if not seen:                # good: "if the set is empty"
    ...

# Bug: a tree whose values can be 0
def find(node, target):
    if not node:            # fine: None is the "no node" case
        return False
    if node.val:            # bug: skips nodes with val == 0
        ...

# Bug: a dictionary lookup that may return 0
count = counts.get(key)
if count:                   # 0 and "missing" are treated the same
    ...
if count is not None:       # distinguishes them`,
      },
      {
        kind: 'text',
        body: 'The rule: use bare `if x:` when the question is "is there anything here", for containers and `None` checks. Use an explicit comparison when the value is a number that could be 0 or a string that could be empty and still be meaningful.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Returning 0 or None from a search',
        body: 'A function that returns an index (which may be 0) or `None` for "not found" cannot be tested with `if result:` because index 0 looks like not-found. Test `if result is not None:`. Better still, return -1 for not-found when the result is an index, so there is no overlap.',
      },
    ],
    keyTakeaways: [
      'Falsy: `None`, `0`, `""`, empty containers, `False`. Everything else is truthy.',
      '`if x:` is for "is there anything"; use `== 0` or `is None` when 0 or empty are valid values.',
      'A result that can be 0 must be tested with `is not None`.',
    ],
    practice: {
      prompt: 'Write `first_even_index(a)` returning the index of the first even number or None. Call it on [3, 4] and on [2, 3] and test the result with `if result:` to see the bug, then fix the test. Then rewrite it to return -1 instead and note that the calling code becomes simpler.',
    },
  },
  // -------------------------------------------------------------------------
  {
    topicId: 'python-41.6',
    language: 'python',
    summary: 'Predict // and % on negative numbers, and translate C-style truncating division when a problem demands it.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'Python’s `//` rounds **down** (towards negative infinity) and `%` always has the sign of the divisor. Most other languages round towards zero. The difference only shows on negative operands, which is exactly when it goes unnoticed in testing and noticed in submission.',
      },
      {
        kind: 'code',
        caption: 'Floor division and modulo with negatives',
        code: `print(7 // 2, 7 % 2)      #  3  1
print(-7 // 2, -7 % 2)    # -4  1   (floor: -3.5 rounds down to -4; -4*2 + 1 = -7)
print(7 // -2, 7 % -2)    # -4 -1   (sign of % follows the divisor)
print(divmod(-7, 2))      # (-4, 1) both at once`,
        output: '3 1\n-4 1\n-4 -1\n(-4, 1)',
      },
      {
        kind: 'text',
        body: 'For wrap-around indices this is the convenient behaviour: `(i - 1) % n` is always in 0..n-1, even when i is 0. For problems that specify C-style behaviour ("truncate toward zero", as in Reverse Integer or Divide Two Integers), you must round towards zero yourself.',
      },
      {
        kind: 'code',
        caption: 'Truncating division when a problem asks for it',
        code: `def trunc_div(a, b):
    q = abs(a) // abs(b)
    return q if (a < 0) == (b < 0) else -q

print(trunc_div(-7, 2))    # -3, as C, Java and C++ would give
print(int(-7 / 2))         # -3 too: int() truncates a float, fine for small values`,
        output: '-3\n-3',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Digit peeling on negative numbers',
        body: 'The `n % 10` and `n //= 10` loop for extracting digits gives wrong results for negative n in Python (`-123 % 10` is 7). Take `abs(n)` first and reapply the sign at the end. The same applies to any digit-manipulation problem.',
      },
    ],
    keyTakeaways: [
      '`//` floors and `%` takes the divisor’s sign: `-7 // 2` is -4, `-7 % 2` is 1.',
      'Wrap-around indices need no fix in Python; C-style truncation must be written by hand.',
      'Use `abs(n)` before digit peeling and restore the sign afterwards.',
    ],
    practice: {
      prompt: 'Print a table of x // 3 and x % 3 for x from -7 to 7. Then implement reverse-digits for negative input (-123 → -321) using abs and the sign. Then implement C-style `%` (result has the sign of the dividend) as a function and verify against the table.',
    },
  },
  // -------------------------------------------------------------------------
  {
    topicId: 'python-41.7',
    language: 'python',
    summary: 'Compare floats with a tolerance, and prefer integer arithmetic whenever the problem allows.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'Python floats are the same 64-bit binary values as `double` in other languages, with the same rounding: `0.1 + 0.2 == 0.3` is `False`. The Python-specific parts are the tools for dealing with it, and one integer trick that removes the problem entirely more often than you would expect.',
      },
      {
        kind: 'code',
        caption: 'Tolerance and exact alternatives',
        code: `import math

a = 0.1 + 0.2
print(a == 0.3)                       # False
print(math.isclose(a, 0.3))           # True (relative tolerance 1e-9 by default)
print(abs(a - 0.3) < 1e-9)            # True, the manual version

# Exact integer square root: no float involved
print(math.isqrt(10**18))             # 1000000000, exact
print(int(math.sqrt(10**18)))         # usually right, but float rounding can be off by one for big values

# Is n a perfect square? Exactly:
def is_square(n):
    r = math.isqrt(n)
    return r * r == n`,
        output: 'False\nTrue\nTrue\n1000000000\n1000000000',
      },
      {
        kind: 'text',
        body: '`math.isqrt` matters more than it looks: many problems ask "is n a perfect square" or "the largest k with k² ≤ n", and `int(math.sqrt(n))` is wrong for n near 10¹⁸ because the float cannot represent n exactly. `isqrt` works on integers and is always right.',
      },
      {
        kind: 'table',
        headers: ['Task', 'Float way (avoid)', 'Exact way'],
        rows: [
          ['Compare computed decimals', '`a == b`', '`math.isclose(a, b)` or `abs(a - b) < eps`'],
          ['Integer square root', '`int(math.sqrt(n))`', '`math.isqrt(n)`'],
          ['Is a/b an integer?', '`a / b == int(a / b)`', '`a % b == 0`'],
          ['Compare fractions a/b and c/d', '`a / b < c / d`', '`a * d < c * b` (for positive b, d)'],
          ['Average is at least x', '`sum(v) / len(v) >= x`', '`sum(v) >= x * len(v)`'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Big integers make the exact way easy',
        body: 'Because Python integers never overflow, cross-multiplying fractions or comparing `sum >= x * n` is always safe, where in C++ you would first worry about the product fitting. Take advantage of it: reach for integers first and floats only when the answer itself is a decimal.',
      },
    ],
    keyTakeaways: [
      'Compare floats with `math.isclose` or a tolerance, never `==`.',
      'Use `math.isqrt` for integer square roots; `int(sqrt(n))` can be off by one.',
      'Cross-multiply and compare integers instead of dividing.',
    ],
    practice: {
      prompt: 'Find the largest n below 10¹⁸ for which `int(math.sqrt(n * n))` is not n (search downwards from 10⁹ squared). Then write `is_perfect_square` with `isqrt` and test it on 0, 1, 2, 4, 10¹⁸ and 10¹⁸ + 1.',
    },
  },
  // -------------------------------------------------------------------------
  {
    topicId: 'python-41.8',
    language: 'python',
    summary: 'Recognise RecursionError, raise the limit when it is safe, and convert to iteration when it is not.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Python limits recursion depth to 1000 frames by default. A recursive DFS on a linked list of 10⁴ nodes, or on a tree that happens to be a straight line, or on a grid of 100×100 cells in one connected blob, exceeds it and raises `RecursionError: maximum recursion depth exceeded`. Other languages have larger default stacks; Python’s is deliberately small.',
      },
      {
        kind: 'code',
        caption: 'Raising the limit',
        code: `import sys
sys.setrecursionlimit(10**6)   # put this at the top of your solution

def depth(node):
    if node is None:
        return 0
    return 1 + max(depth(node.left), depth(node.right))`,
      },
      {
        kind: 'text',
        body: 'Raising the limit is safe on LeetCode for depths up to about 10⁵; the judge’s process has enough stack for that. Beyond that, or when in doubt, the interpreter itself can crash with a segmentation fault, which reports as Runtime Error with no message. Then the real fix is an explicit stack.',
      },
      {
        kind: 'code',
        caption: 'Same DFS, iterative, no depth limit',
        code: `def dfs_iterative(root):
    if root is None:
        return
    stack = [root]
    while stack:
        node = stack.pop()
        visit(node)
        if node.right:
            stack.append(node.right)    # push right first so left is processed first
        if node.left:
            stack.append(node.left)`,
      },
      {
        kind: 'table',
        headers: ['Input', 'Maximum recursion depth', 'Safe?'],
        rows: [
          ['Balanced tree of 10⁵ nodes', '~17', 'Yes, even at the default limit'],
          ['Linked list or degenerate tree of 10⁴ nodes', '10⁴', 'Only after raising the limit'],
          ['Grid DFS on a 1000×1000 all-open grid', 'up to 10⁶', 'No: use BFS or an explicit stack'],
          ['Memoised recursion over n ≤ 5000', 'up to 5000', 'After raising the limit; or use bottom-up DP'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'A memoised function that is still too deep',
        body: '`@lru_cache` does not reduce depth; the first call to `f(5000)` still recurses to `f(0)` before anything is cached. If the state count is large and linear, write the loop version (bottom-up) instead. The DP chapter shows both forms side by side.',
      },
    ],
    keyTakeaways: [
      'Default recursion limit is 1000; deep inputs raise `RecursionError`.',
      '`sys.setrecursionlimit(10**6)` is the standard first line for recursive solutions on LeetCode.',
      'For depth beyond ~10⁵, use an explicit stack or bottom-up iteration.',
    ],
    practice: {
      prompt: 'Write a recursive function that sums a linked list of 5000 nodes and observe the error. Fix it with `setrecursionlimit`. Then write the iterative version. Then build a 300×300 grid DFS recursively and find the smallest all-open grid that breaks it at the default limit.',
    },
  },
  // -------------------------------------------------------------------------
  {
    topicId: 'python-41.9',
    language: 'python',
    summary: 'Know that `in` on a list is a linear scan, and switch to a set or dict when membership is checked in a loop.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: '`x in a` reads as one operation, and for a set or a dictionary key it is one operation on average. For a list it is a scan of every element until a match. Inside a loop over n items, `in` on a list of n items is O(n²), and it is the single most common cause of Time Limit Exceeded in Python solutions that are algorithmically correct.',
      },
      {
        kind: 'code',
        caption: 'The same code, quadratic and linear',
        code: `# O(n^2): each "in" scans the list
seen = []
for x in nums:
    if x in seen:
        return True
    seen.append(x)

# O(n): each "in" is a hash lookup
seen = set()
for x in nums:
    if x in seen:
        return True
    seen.add(x)`,
      },
      {
        kind: 'table',
        headers: ['Operation', 'list', 'set / dict', 'Note'],
        rows: [
          ['`x in c`', 'O(n)', 'O(1) average', 'The one that matters'],
          ['`c.append(x)` / `c.add(x)`', 'O(1)', 'O(1)', ''],
          ['`c.remove(x)`', 'O(n)', 'O(1)', 'List remove also shifts everything after'],
          ['`c.pop(0)`', 'O(n)', '—', 'Use `collections.deque` for a queue'],
          ['`c.index(x)`', 'O(n)', '—', 'Use a dict from value to index'],
          ['`c[i]`', 'O(1)', '—', 'Lists win at indexing; sets have no order'],
        ],
      },
      {
        kind: 'text',
        body: 'The related trap is `list.pop(0)` for a queue: it shifts every remaining element, O(n) per pop. A BFS written with a list and `pop(0)` is O(n²). Use `collections.deque` and `popleft()`. Similarly `list.insert(0, x)` is O(n); `deque.appendleft` is O(1).',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'When a list is still right',
        body: 'Sets and dicts need hashable elements and give up ordering and duplicates. If you need order, duplicates, or indexing, keep the list, and add a set alongside it for membership tests. Two structures over the same data is a normal pattern, not a smell.',
      },
    ],
    keyTakeaways: [
      '`in` on a list is O(n); on a set or dict it is O(1) average.',
      'Membership tests inside a loop belong on a set.',
      '`pop(0)` and `insert(0, x)` are O(n) on a list; use `deque`.',
    ],
    practice: {
      prompt: 'Time "contains duplicate" on a list of 20,000 distinct integers with the list version and the set version. Then write BFS on a line graph of 50,000 nodes with `list.pop(0)` and with `deque.popleft()` and compare.',
      leetcode: { title: 'Contains Duplicate', slug: 'contains-duplicate' },
    },
  },
  // -------------------------------------------------------------------------
  {
    topicId: 'python-41.10',
    language: 'python',
    summary: 'Build strings with join, and know which string operations copy the whole string.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'Strings are immutable, so every operation that "changes" a string builds a new one. `s += c` in a loop can be O(n²); CPython has an optimisation that often rescues it, but it depends on there being exactly one reference to the string, which is not something to rely on in a solution. The reliable pattern is: collect pieces in a list, `join` once.',
      },
      {
        kind: 'code',
        caption: 'Building a string of n pieces',
        code: `# Reliable and O(n)
parts = []
for i in range(n):
    parts.append(str(i))
s = ",".join(parts)

# Same thing in one line
s = ",".join(str(i) for i in range(n))

# Character rewrite: list, modify, join
chars = list(s)
chars[0] = chars[0].upper()
s = "".join(chars)`,
      },
      {
        kind: 'table',
        headers: ['Operation', 'Cost', 'Note'],
        rows: [
          ['`s[i]`, `len(s)`', 'O(1)', ''],
          ['`s[a:b]`', 'O(b - a)', 'Copies the slice; slicing inside a loop is a hidden cost'],
          ['`s + t`', 'O(len(s) + len(t))', 'New string every time'],
          ['`"".join(parts)`', 'O(total length)', 'The right way to build'],
          ['`s == t`', 'O(min length)', 'Stops at the first difference'],
          ['`s in t`', 'O(len(s) × len(t)) worst case', 'Fast in practice; not a free operation'],
          ['`s.replace`, `s.split`, `s.lower()`', 'O(n)', 'Each returns a new string'],
        ],
      },
      {
        kind: 'text',
        body: 'The slicing row is the one that hides in solutions: `s[i:]` inside a loop over i copies a suffix each time and makes an O(n) idea O(n²). Compare characters by index instead, or pass indices to a helper rather than slices.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Recursion on string slices',
        body: 'A recursive palindrome check `is_pal(s[1:-1])` copies the string at every level, O(n²) in total and O(n²) memory across the call stack. Pass `lo` and `hi` indices instead. The same applies to recursive parsing of any kind.',
      },
    ],
    keyTakeaways: [
      'Build strings with a list and `"".join`, not `+=` in a loop.',
      'Slicing copies; avoid `s[i:]` inside loops and recursion.',
      'To rewrite characters, go through `list(s)` and join back.',
    ],
    practice: {
      prompt: 'Reverse the words of a sentence three ways: with `split` and `join`, by building a list of characters, and with a slice-per-word loop; time them on a 10⁵-word string. Then rewrite a recursive slice-based palindrome check to use indices.',
    },
  },
  // -------------------------------------------------------------------------
  {
    topicId: 'python-41.11',
    language: 'python',
    summary: 'Sort by several keys at once, in mixed directions, using tuple keys and sort stability.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Python’s sort is **stable**: elements that compare equal keep their original relative order. Combined with the `key` function, that gives two ways to sort by several criteria, and knowing both keeps you out of the `cmp_to_key` swamp for almost every problem.',
      },
      { kind: 'heading', text: 'Way 1: a tuple key' },
      {
        kind: 'text',
        body: 'Tuples compare element by element, so `key=lambda p: (p.age, p.name)` sorts by age and breaks ties by name. To sort a numeric field descending while others stay ascending, negate it inside the tuple.',
      },
      {
        kind: 'code',
        caption: 'Tuple keys',
        code: `people = [("bob", 25), ("alice", 30), ("carol", 25), ("dave", 30)]

# By age ascending, then name ascending
people.sort(key=lambda p: (p[1], p[0]))
# [('bob', 25), ('carol', 25), ('alice', 30), ('dave', 30)]

# By age descending, then name ascending: negate the number
people.sort(key=lambda p: (-p[1], p[0]))
# [('alice', 30), ('dave', 30), ('bob', 25), ('carol', 25)]

# Intervals by start, then by longer first
intervals.sort(key=lambda iv: (iv[0], -(iv[1] - iv[0])))`,
      },
      { kind: 'heading', text: 'Way 2: sort twice, least significant key first' },
      {
        kind: 'text',
        body: 'When one key needs `reverse=True` and cannot be negated (strings, for instance), sort by the secondary key first, then by the primary key. Stability preserves the secondary order within each primary group.',
      },
      {
        kind: 'code',
        caption: 'Two stable sorts',
        code: `words = ["pear", "fig", "apple", "kiwi", "date"]

# Want: by length descending, ties alphabetical ascending
words.sort()                                   # alphabetical first (the tie-breaker)
words.sort(key=len, reverse=True)              # then by length; ties keep alphabetical order
# ['apple', 'date', 'kiwi', 'pear', 'fig']`,
        output: "['apple', 'date', 'kiwi', 'pear', 'fig']",
      },
      {
        kind: 'table',
        headers: ['Need', 'Use'],
        rows: [
          ['Several keys, all ascending', 'Tuple key'],
          ['Some numeric keys descending', 'Tuple key with negation'],
          ['A string key descending among others', 'Sort twice, or `reverse=True` plus negated numbers'],
          ['A comparison that is not a key (e.g. `a + b` vs `b + a`)', '`functools.cmp_to_key`'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: '`reverse=True` reverses the whole tuple, not one element',
        body: '`sort(key=lambda p: (p[1], p[0]), reverse=True)` gives age descending **and** name descending. If you want mixed directions, negate the numeric field instead, or sort twice.',
      },
    ],
    keyTakeaways: [
      'Tuple keys sort by several fields; negate a number to make that field descending.',
      'Stability means you can sort by the tie-breaker first, then by the main key.',
      '`reverse=True` applies to the whole key.',
    ],
    practice: {
      prompt: 'Sort a list of (name, score, time) so that higher score comes first, then lower time, then name alphabetically, using one tuple key. Then achieve the same with three stable sorts. Then sort a list of number-strings so the concatenation is largest (Largest Number) with `cmp_to_key`.',
      leetcode: { title: 'Largest Number', slug: 'largest-number' },
    },
  },
  // -------------------------------------------------------------------------
  {
    topicId: 'python-41.12',
    language: 'python',
    summary: 'Use only hashable keys, never mutate one, and make heap entries compare correctly with tuples.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Three related facts about which values can go where. Sets and dictionary keys need **hashable** values: numbers, strings, tuples of hashables, frozensets. Lists, sets and dicts are not hashable, so they cannot be keys. And `heapq` orders entries by comparing them, so a tuple entry compares field by field, which is both the standard trick and a source of a specific error.',
      },
      {
        kind: 'code',
        caption: 'Hashable and unhashable keys',
        code: `seen = set()
seen.add((1, 2))              # tuple: fine
seen.add(frozenset([1, 2]))   # frozenset: fine
# seen.add([1, 2])            # TypeError: unhashable type: 'list'

# Grid cell as a key: use a tuple
visited = {(0, 0), (0, 1)}
if (r, c) in visited: ...

# A list as a key: convert first
key = tuple(sorted(word))     # the anagram key, hashable
groups[key].append(word)`,
      },
      {
        kind: 'text',
        body: 'Tuples are hashable only if every element is. `(1, [2])` is not. And a hashable object must not change: a custom class with `__hash__` based on a field that later changes will be in the wrong bucket and silently unfindable. For DSA code, keep keys as tuples of numbers and strings and this never arises.',
      },
      { kind: 'heading', text: 'Tuples in a heap' },
      {
        kind: 'text',
        body: '`heapq` has no key parameter. The idiom is to push tuples with the priority first: `(distance, node)`. Ties on distance fall through to comparing the second element, which is fine when it is a number and a `TypeError` when it is an object that does not support `<`.',
      },
      {
        kind: 'code',
        caption: 'Priority tuples, and the tie-break problem',
        code: `import heapq

pq = []
heapq.heappush(pq, (3, "task c"))
heapq.heappush(pq, (1, "task a"))
print(heapq.heappop(pq))          # (1, 'task a'): smallest priority first

# Max-heap: negate the priority
heapq.heappush(pq, (-score, item))

# Objects that cannot be compared: add a unique counter as the tie-breaker
import itertools
counter = itertools.count()
heapq.heappush(pq, (priority, next(counter), some_object))   # never compares some_object`,
        output: "(1, 'task a')",
      },
      {
        kind: 'table',
        headers: ['Entry', 'Behaviour on equal priority'],
        rows: [
          ['`(priority, number)`', 'Compares the numbers; fine'],
          ['`(priority, string)`', 'Compares the strings; fine'],
          ['`(priority, ListNode)`', '`TypeError: \'<\' not supported`'],
          ['`(priority, counter, ListNode)`', 'Counter breaks the tie; the node is never compared'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Merging k sorted linked lists',
        body: 'The classic case: pushing `(node.val, node)` works until two nodes have equal values, then it crashes on the second element. Push `(node.val, i, node)` with the list index i as tie-breaker, or define `__lt__` on the node class. The error appears only on inputs with duplicates, so it passes the examples and fails submission.',
      },
    ],
    keyTakeaways: [
      'Set and dict keys must be hashable: use tuples, not lists, for coordinates and composite keys.',
      '`heapq` compares whole tuples; put the priority first.',
      'When the payload cannot be compared, insert a unique counter before it.',
    ],
    practice: {
      prompt: 'Store visited grid cells in a set as tuples and confirm a list version raises TypeError. Then push (value, node) pairs for two nodes with equal values into a heap and observe the error; fix it with a counter. Then implement merge-k-sorted-lists with the fixed tuple.',
      leetcode: { title: 'Merge k Sorted Lists', slug: 'merge-k-sorted-lists' },
    },
  },
];
