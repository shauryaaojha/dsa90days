import type { Lesson } from '../types';

/**
 * Python Chapter 4 — Lists and Strings.
 * The two data structures most problems are built on, with slicing and
 * immutability given the weight they deserve.
 */
export const ch04: Lesson[] = [
  // -------------------------------------------------------------------------
  {
    topicId: 'python-4.1',
    language: 'python',
    summary: 'Use the list — Python\'s dynamic array — and know what each operation costs.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'The list is the container you will use most. It grows on demand, holds anything, and indexes from **0** — so it plays the role that arrays and `vector`/`ArrayList` play elsewhere, all in one type. Its friendliness hides a cost model, though, and knowing which operations are O(1) and which are O(n) is what keeps your solutions inside the time limit.',
      },
      {
        kind: 'code',
        code: `nums = []                    # empty
nums = [1, 2, 3]             # from a literal
nums = [0] * 5               # [0, 0, 0, 0, 0]
nums = list(range(5))        # [0, 1, 2, 3, 4]
nums = [x * x for x in range(5)]      # comprehension`,
      },
      {
        kind: 'text',
        body: 'A Python list is a dynamic array of **references**, so it can hold mixed types and grows automatically. Under the hood it is a contiguous block of pointers, which is why indexing is O(1) and appending is amortised O(1).',
      },
      {
        kind: 'table',
        headers: ['Operation', 'Cost', 'Why'],
        rows: [
          ['`nums[i]`', 'O(1)', 'Direct index into the pointer array'],
          ['`nums.append(x)`', 'O(1) amortised', 'Occasionally reallocates'],
          ['`nums.pop()`', 'O(1)', 'Nothing shifts'],
          ['`nums.pop(0)`', '**O(n)**', 'Every element shifts left'],
          ['`nums.insert(0, x)`', '**O(n)**', 'Every element shifts right'],
          ['`x in nums`', '**O(n)**', 'Linear scan'],
          ['`len(nums)`', 'O(1)', 'Stored, not counted'],
          ['`nums.sort()`', 'O(n log n)', 'Timsort'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'pop(0) and insert(0, x) are O(n)',
        body: 'Using a list as a queue with `pop(0)` makes an apparently linear BFS O(n²). `collections.deque` gives O(1) at both ends and is what every Python BFS uses. This is the most common hidden cost in Python DSA code.',
      },
      {
        kind: 'code',
        caption: 'Negative indexing',
        code: `nums = [10, 20, 30, 40]

nums[-1]         # 40 — the last element
nums[-2]         # 30
nums[0]          # 10

# Which means "the last element" needs no length arithmetic:
last = nums[-1]                  # Python
# vs  nums[nums.size() - 1]      in C++`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Negative indices remove a whole class of off-by-one',
        body: '`nums[-1]` cannot be wrong. In C++ and Java you write `size() - 1` and must guard against an empty container, where the unsigned version wraps. Python raises a clear `IndexError` on an empty list instead — and for the common "last element" case you never compute an index at all.',
      },
      {
        kind: 'code',
        caption: 'The methods you will actually use',
        code: `nums.append(x)           # add to the end
nums.extend(other)       # add all of another iterable
nums.pop()               # remove and return the last
nums.pop(i)              # remove and return index i — O(n)
nums.remove(x)           # remove the first occurrence of VALUE x — O(n)
nums.insert(i, x)        # O(n)
nums.index(x)            # first index of x — raises ValueError if absent
nums.count(x)            # occurrences
nums.sort()              # in place, returns None
nums.reverse()           # in place
nums.clear()`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'sort() returns None',
        body: '`nums = nums.sort()` sets `nums` to `None` — a very common beginner bug. In-place methods (`sort`, `reverse`, `append`) all return `None` by design. Use `sorted(nums)` and `reversed(nums)` when you want a value back.',
      },
      {
        kind: 'code',
        code: `nums.sort()                  # modifies nums, returns None
new = sorted(nums)           # leaves nums alone, returns a new list

nums.reverse()               # in place
new = nums[::-1]             # a reversed copy
new = list(reversed(nums))   # same`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'index() and remove() raise if the value is absent',
        body: '`nums.index(5)` on a list without a 5 raises `ValueError` — it does not return −1 like C++ or Java conventions. Check with `if 5 in nums:` first, or catch the exception. This surprises people expecting a sentinel return.',
      },
    ],
    keyTakeaways: [
      'Lists are dynamic arrays: O(1) index and append, O(n) front operations.',
      '`pop(0)` is O(n) — use `collections.deque` for queue behaviour.',
      'Negative indices (`nums[-1]`) remove an entire class of off-by-one bugs.',
      'In-place methods return `None`; `sorted()` returns a new list.',
    ],
    practice: {
      prompt: 'Write `nums = nums.sort()` and print the result — `None`. Then time `pop(0)` against `deque.popleft()` on 10⁵ elements. Then call `nums.index(x)` for a missing value and read the `ValueError` rather than getting −1.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-4.2',
    language: 'python',
    summary: 'Walk a list the Pythonic way, and avoid the modify-while-iterating trap.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Python loops over the **elements** of a list directly — you rarely need an index at all. When you do need one too, `enumerate` gives you both without the C-style index dance. The one rule to respect: never add to or remove from a list while you are looping over it, because the loop loses its place and silently skips elements.',
      },
      {
        kind: 'code',
        caption: 'The four traversal forms',
        code: `# 1. Values — the default
for x in nums:
    print(x)

# 2. Indices — when you genuinely need i
for i in range(len(nums)):
    print(i, nums[i])

# 3. Both — the idiomatic choice
for i, x in enumerate(nums):
    print(i, x)

# 4. Two lists in parallel
for a, b in zip(list1, list2):
    print(a, b)`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'enumerate over range(len(...))',
        body: '`for i in range(len(nums)): x = nums[i]` works but is the clearest possible sign of a C++ or Java background. `enumerate` gives both without indexing, cannot go out of bounds, and reads better. It also accepts a start value: `enumerate(nums, 1)` counts from 1.',
      },
      {
        kind: 'code',
        code: `for i, x in enumerate(nums, 1):      # i starts at 1
    print(f"{i}. {x}")

# Reverse iteration
for x in reversed(nums):
    ...
for i in range(len(nums) - 1, -1, -1):     # with indices — note the -1 stop
    ...
for i, x in reversed(list(enumerate(nums))):
    ...`,
      },
      { kind: 'heading', text: 'Modifying while iterating' },
      {
        kind: 'code',
        code: `# BROKEN — removing shifts elements and the loop skips some
nums = [1, 2, 2, 3]
for x in nums:
    if x == 2:
        nums.remove(x)
# result: [1, 2, 3] — one 2 survives

# FIX 1 — build a new list (usually clearest)
nums = [x for x in nums if x != 2]

# FIX 2 — iterate over a copy
for x in nums[:]:
    if x == 2:
        nums.remove(x)

# FIX 3 — walk backwards, so removals do not affect unvisited indices
for i in range(len(nums) - 1, -1, -1):
    if nums[i] == 2:
        nums.pop(i)`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Python fails silently where Java raises',
        body: 'Removing from a list during a `for` loop does not raise — it just skips elements, because the internal index keeps advancing while the list shrinks. Java throws `ConcurrentModificationException` immediately, which is more helpful. In Python you get a wrong answer with no error at all.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Dicts and sets DO raise',
        body: 'Changing a dict\'s or set\'s size while iterating raises `RuntimeError: dictionary changed size during iteration`. Only lists fail silently. Iterate over `list(d.keys())` when you need to delete entries while looping.',
      },
      { kind: 'heading', text: 'Comprehensions replace most loops' },
      {
        kind: 'code',
        code: `squares = [x * x for x in nums]
evens = [x for x in nums if x % 2 == 0]
pairs = [(i, x) for i, x in enumerate(nums) if x > 0]
flat = [x for row in grid for x in row]        # flatten a 2D list

# The nested order matches the equivalent loops:
# for row in grid:
#     for x in row:`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Comprehensions are faster as well as shorter',
        body: 'The loop runs largely in C rather than interpreted bytecode, so a comprehension typically beats an explicit loop with `append`. Given Python\'s speed disadvantage on LeetCode, that is a real benefit rather than just style.',
      },
      {
        kind: 'text',
        body: 'One readability limit: past two `for` clauses or one `if`, a comprehension becomes harder to read than the loop it replaces. Use them for simple transforms and filters; write the loop when the logic is genuinely branching.',
      },
    ],
    keyTakeaways: [
      'Use `enumerate` when you need indices; `zip` for parallel lists.',
      'Removing from a list while iterating silently skips elements.',
      'Dicts and sets raise on size change; lists do not.',
      'Comprehensions are shorter and faster than an explicit append loop.',
    ],
    practice: {
      prompt: 'Remove all 2s from `[1, 2, 2, 3]` with a for-loop and `remove()` and watch one survive. Then fix it three ways. Then rewrite a `range(len(nums))` loop with `enumerate`.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-4.3',
    language: 'python',
    summary: 'Add and remove elements, choosing the O(1) operation over the O(n) one.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Adding and removing at the **end** of a list is O(1); doing it anywhere else is O(n), because everything after the gap has to shuffle along. That single fact should drive your choices: `append` and `pop()` are free, `insert(0, x)` and `pop(0)` are not — and if you need cheap operations at both ends, you want a `deque` instead.',
      },
      {
        kind: 'table',
        headers: ['Method', 'Effect', 'Cost'],
        rows: [
          ['`append(x)`', 'Add to the end', 'O(1) amortised'],
          ['`extend(iterable)`', 'Add all elements', 'O(k)'],
          ['`insert(i, x)`', 'Insert at index i', '**O(n)**'],
          ['`pop()`', 'Remove and return the last', 'O(1)'],
          ['`pop(i)`', 'Remove and return index i', '**O(n)**'],
          ['`remove(x)`', 'Remove the first occurrence of value x', '**O(n)**'],
          ['`clear()`', 'Remove everything', 'O(n)'],
        ],
      },
      {
        kind: 'code',
        code: `nums = [1, 2, 3]

nums.append(4)              # [1, 2, 3, 4]
nums.extend([5, 6])         # [1, 2, 3, 4, 5, 6]
nums.insert(0, 0)           # [0, 1, 2, 3, 4, 5, 6] — O(n)

nums.pop()                  # returns 6
nums.pop(0)                 # returns 0 — O(n)
nums.remove(3)              # removes the VALUE 3, not index 3`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'pop takes an index, remove takes a value',
        body: '`nums.pop(2)` removes index 2; `nums.remove(2)` removes the first element *equal to* 2. Confusing them gives a wrong answer with no error. This is the same confusion Java has with `List.remove(int)` versus `List.remove(Object)`.',
      },
      {
        kind: 'code',
        code: `nums = [10, 20, 30]
nums.pop(1)                 # removes 20 (index 1) → [10, 30]

nums = [10, 20, 30]
nums.remove(10)             # removes the value 10 → [20, 30]`,
      },
      { kind: 'heading', text: 'append vs extend vs +' },
      {
        kind: 'code',
        code: `a = [1, 2]

a.append([3, 4])            # [1, 2, [3, 4]]  ← nests the list!
a = [1, 2]
a.extend([3, 4])            # [1, 2, 3, 4]    ← flattens it
a = [1, 2]
a = a + [3, 4]              # [1, 2, 3, 4]    ← builds a NEW list, O(n)
a += [3, 4]                 # same as extend — modifies in place`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'append([3,4]) nests; extend([3,4]) flattens',
        body: 'A very common mix-up. `append` adds *one element* whatever it is, so appending a list gives you a nested list. `extend` adds each element of the iterable. When your 1D list mysteriously contains a list, this is why.',
      },
      { kind: 'heading', text: 'Using a list as a stack' },
      {
        kind: 'code',
        code: `stack = []
stack.append(x)             # push — O(1)
top = stack[-1]             # peek — O(1)
stack.pop()                 # pop  — O(1)
if not stack: ...           # empty check`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'A list IS the Python stack',
        body: 'There is no separate stack class and none is needed — `append` and `pop` are both O(1) at the end. Every monotonic-stack and DFS solution uses a plain list. Note `stack.pop()` *returns* the value, unlike C++ where `top()` and `pop()` are separate.',
      },
      {
        kind: 'code',
        caption: 'And a deque as a queue',
        code: `from collections import deque

q = deque()
q.append(x)                 # enqueue at the right — O(1)
q.popleft()                 # dequeue from the left — O(1)
q[0]                        # peek the front
if not q: ...

q.appendleft(x)             # also O(1) — deques work at both ends
q.pop()                     # O(1) from the right`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Never use a list for a queue',
        body: '`list.pop(0)` is O(n), so a BFS written with a list is O(n²) and times out on large grids. `deque.popleft()` is O(1). Importing `deque` is one line and it is the single most important container substitution in Python DSA.',
      },
    ],
    keyTakeaways: [
      '`append`/`pop` at the end are O(1); `insert(0,x)`/`pop(0)`/`remove(x)` are O(n).',
      '`pop(i)` takes an index, `remove(x)` takes a value.',
      '`append` adds one element (nesting a list); `extend` adds each element.',
      'A list is the stack; `collections.deque` is the queue.',
    ],
    practice: {
      prompt: 'Compare `append([3,4])` with `extend([3,4])` and see the nesting. Then implement a stack with a list and a queue with a deque, and time the deque against `list.pop(0)` on 10⁵ operations.',
      leetcode: { title: 'Valid Parentheses', slug: 'valid-parentheses' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-4.4',
    language: 'python',
    summary: 'Extract sublists with slice syntax — Python\'s most distinctive feature.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Slicing pulls out a run of elements with `a[start:stop]`, and it is the feature Python programmers miss most in other languages. Two things to fix in your head from the outset: the stop index is **excluded**, and a slice always builds a **new list** — which makes it convenient, and makes it O(k) rather than free.',
      },
      {
        kind: 'code',
        caption: 'nums[start:stop:step]',
        code: `nums = [0, 1, 2, 3, 4, 5]

nums[1:4]        # [1, 2, 3]     — start inclusive, stop EXCLUSIVE
nums[:3]         # [0, 1, 2]     — from the beginning
nums[3:]         # [3, 4, 5]     — to the end
nums[:]          # a full copy
nums[::2]        # [0, 2, 4]     — every second element
nums[::-1]       # [5,4,3,2,1,0] — reversed`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The stop is exclusive, matching range',
        body: '`nums[1:4]` gives indices 1, 2, 3 — the same half-open convention as `range(1, 4)` and as `for (int i = 1; i < 4; i++)`. It means `nums[:k] + nums[k:]` reconstructs the whole list with no overlap or gap, which is exactly what makes slicing composable.',
      },
      {
        kind: 'code',
        caption: 'Negative indices in slices',
        code: `nums[-3:]        # [3, 4, 5]  — the last three
nums[:-1]        # [0,1,2,3,4] — everything but the last
nums[-2:-1]      # [4]
nums[::-1]       # reversed — the idiom everyone learns first`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Slices never raise IndexError',
        body: '`nums[10:20]` on a six-element list returns `[]` rather than raising. Out-of-range bounds are silently clamped. That makes slicing forgiving — but it also means a wrong slice fails quietly, producing an empty list instead of an error.',
      },
      {
        kind: 'code',
        code: `nums = [1, 2, 3]
nums[10]         # IndexError
nums[10:20]      # []  — no error at all
nums[1:100]      # [2, 3] — clamped`,
      },
      { kind: 'heading', text: 'Slicing copies' },
      {
        kind: 'code',
        code: `a = [1, 2, 3]
b = a[:]                    # a shallow COPY
b.append(4)
print(a)                    # [1, 2, 3] — unaffected

c = a                       # NOT a copy — same object
c.append(4)
print(a)                    # [1, 2, 3, 4] — changed`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Slicing costs O(k) — avoid it in recursive calls',
        body: '`total(nums[1:])` allocates a new list every level, turning an O(n) recursion into O(n²). Pass the original list plus an index instead. The same applies to strings. This is the single most common performance mistake in recursive Python.',
      },
      {
        kind: 'code',
        caption: 'Shallow, not deep',
        code: `grid = [[1, 2], [3, 4]]
copy = grid[:]              # copies the OUTER list only
copy[0][0] = 9
print(grid[0][0])           # 9 — the inner lists are shared!

import copy as copy_module
deep = copy_module.deepcopy(grid)      # genuinely independent

# Or for a 2D list of primitives:
deep = [row[:] for row in grid]`,
      },
      { kind: 'heading', text: 'Slice assignment' },
      {
        kind: 'code',
        code: `nums = [0, 1, 2, 3, 4]

nums[1:3] = [9, 9, 9]       # [0, 9, 9, 9, 3, 4] — lengths need not match
nums[:] = [1, 2]            # replaces CONTENTS in place — callers see this
del nums[1:3]               # removes a range

# The in-place form matters when a problem says "modify nums in place":
def rotate(nums, k):
    k %= len(nums)
    nums[:] = nums[-k:] + nums[:-k]        # modifies the caller's list`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'nums[:] = ... is how you satisfy "modify in place"',
        body: '`nums = [...]` rebinds the local name and the caller sees nothing. `nums[:] = [...]` replaces the contents of the existing object, which the caller shares. Several LeetCode problems require in-place modification and check the original list — this is the idiom that satisfies them.',
      },
    ],
    keyTakeaways: [
      '`nums[start:stop:step]` — stop is exclusive, matching `range`.',
      'Slices clamp out-of-range bounds and never raise `IndexError`.',
      'Slicing copies at O(k) — never slice inside a recursive call.',
      '`nums[:] = ...` modifies in place; `nums = ...` only rebinds the local name.',
    ],
    practice: {
      prompt: 'Reverse a list with `[::-1]`, take the last three with `[-3:]`, and confirm `nums[10:20]` returns `[]` rather than raising. Then write `rotate` using `nums[:] = ...` and verify the caller sees the change.',
      leetcode: { title: 'Rotate Array', slug: 'rotate-array' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-4.5',
    language: 'python',
    summary: 'Build and traverse 2D structures — and avoid the aliasing bug.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'A grid in Python is a list of lists, and grid problems are a large slice of every interview list. There is exactly one trap here, but it is a vicious one: the obvious way to build a grid — `[[0] * n] * m` — creates **m references to the same row**, so writing one cell appears to change a whole column. This lesson makes sure that never costs you an hour.',
      },
      {
        kind: 'code',
        caption: 'The only correct way to build a grid',
        code: `# CORRECT — a fresh inner list per row
grid = [[0] * cols for _ in range(rows)]

# BROKEN — all rows are the SAME list object
grid = [[0] * cols] * rows`,
      },
      {
        kind: 'code',
        code: `grid = [[0] * 3] * 3
grid[0][0] = 1
print(grid)         # [[1,0,0], [1,0,0], [1,0,0]]  ← all three changed

grid = [[0] * 3 for _ in range(3)]
grid[0][0] = 1
print(grid)         # [[1,0,0], [0,0,0], [0,0,0]]  ← correct`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'This is the most damaging Python DSA bug',
        body: '`* rows` repeats the same inner list *reference* rows times, so writing to one row writes to all. It breaks every DP table, every visited grid, every matrix problem — and the symptom (rows changing together) is baffling until you know the cause. The comprehension evaluates `[0] * cols` fresh on each iteration, which is why it works.',
      },
      {
        kind: 'text',
        body: 'Note that `[0] * cols` for the *inner* list is fine, because integers are immutable — there is no shared mutable object to alias. The problem only arises when the repeated element is itself mutable.',
      },
      {
        kind: 'code',
        caption: 'Higher dimensions',
        code: `# 3D
dp = [[[0] * c for _ in range(b)] for _ in range(a)]

# A grid of lists (an adjacency structure)
adj = [[] for _ in range(n)]        # NOT [[]] * n`,
      },
      { kind: 'heading', text: 'Traversal' },
      {
        kind: 'code',
        code: `rows, cols = len(grid), len(grid[0])      # guard against empty first!

for r in range(rows):
    for c in range(cols):
        print(grid[r][c])

# Values only
for row in grid:
    for x in row:
        ...

# With indices, Pythonically
for r, row in enumerate(grid):
    for c, x in enumerate(row):
        ...`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Guard before reading grid[0]',
        body: '`len(grid[0])` raises `IndexError` when the grid is empty. Start every grid solution with `if not grid or not grid[0]: return ...`. Empty input is one of the most reliably present hidden test cases.',
      },
      { kind: 'heading', text: 'The direction loop' },
      {
        kind: 'code',
        code: `for dr, dc in ((-1, 0), (1, 0), (0, -1), (0, 1)):
    nr, nc = r + dr, c + dc
    if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
        ...

# Eight directions, including diagonals
DIRS8 = [(-1,-1), (-1,0), (-1,1), (0,-1), (0,1), (1,-1), (1,0), (1,1)]`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Tuple unpacking plus chained comparison',
        body: 'Python\'s version of this pattern is noticeably cleaner than C++\'s parallel `dr`/`dc` arrays: the directions are tuples unpacked directly, and `0 <= nr < rows` is one chained comparison rather than two conditions. Four lines cover what takes eight elsewhere.',
      },
      {
        kind: 'code',
        caption: 'Useful 2D one-liners',
        code: `transposed = [list(row) for row in zip(*grid)]     # transpose
flat = [x for row in grid for x in row]            # flatten
total = sum(sum(row) for row in grid)              # sum everything
copy = [row[:] for row in grid]                    # a proper 2D copy

# Rotate 90 degrees clockwise: transpose, then reverse each row
grid[:] = [list(row)[::-1] for row in zip(*grid)]`,
      },
      {
        kind: 'text',
        body: 'A grid of characters is often better as a list of strings — `grid = ["abc", "def"]` indexes identically with `grid[r][c]`. It is more compact, though strings are immutable so you cannot write to a cell without converting the row to a list first.',
      },
    ],
    keyTakeaways: [
      '`[[0] * cols for _ in range(rows)]` — never `[[0] * cols] * rows`.',
      'The aliasing bug only affects mutable elements; `[0] * n` is safe.',
      'Guard `if not grid or not grid[0]` before reading dimensions.',
      '`zip(*grid)` transposes; combining it with a reverse rotates 90°.',
    ],
    practice: {
      prompt: 'Build a grid both ways, set `grid[0][0] = 1`, and print — the broken version changes every row. Then write the four-direction neighbour loop with tuple unpacking, and rotate a matrix with `zip(*grid)`.',
      leetcode: { title: 'Number of Islands', slug: 'number-of-islands' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-4.6',
    language: 'python',
    summary: 'Use strings as the sequence type they are, and know the essential methods.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'A Python string behaves like a **sequence of characters**, so nearly everything you just learned about lists applies: you can index it, slice it, loop over it and ask for its length. The one difference — and it shapes the rest of this chapter — is that a string cannot be modified once it exists.',
      },
      {
        kind: 'code',
        code: `s = "hello"
s = 'hello'                 # single and double quotes are identical
s = """multi
line"""

len(s)          # 5
s[0]            # 'h'
s[-1]           # 'o'
s[1:3]          # 'el' — slicing works exactly as on lists
'l' in s        # True — substring test`,
      },
      {
        kind: 'text',
        body: 'A string is an immutable sequence of characters, so every list operation that does not modify works: indexing, slicing, iteration, `len`, `in`, `min`, `max`, `sorted`.',
      },
      {
        kind: 'code',
        caption: 'The methods you will actually use',
        code: `s.upper()  s.lower()               # returns a NEW string
s.strip()  s.lstrip()  s.rstrip()  # remove whitespace
s.split()                          # split on whitespace → list
s.split(",")                       # split on a delimiter
"-".join(parts)                    # join a list into a string
s.replace("a", "b")
s.find("lo")                       # index, or -1 if absent
s.index("lo")                      # index, or raises ValueError
s.startswith("he")  s.endswith("lo")
s.count("l")                       # 2
s.isdigit()  s.isalpha()  s.isalnum()  s.isupper()`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'find returns -1; index raises',
        body: 'This is the one pair worth remembering: `s.find("x")` gives −1 when absent, matching C-style conventions, while `s.index("x")` raises `ValueError`. Use `find` when absence is expected, `index` when it would be a bug.',
      },
      {
        kind: 'code',
        caption: 'Splitting and joining',
        code: `"a b  c".split()             # ['a', 'b', 'c'] — collapses runs of whitespace
"a,b,,c".split(",")          # ['a', 'b', '', 'c'] — keeps empty fields
"".join(["a", "b"])          # "ab"
" ".join(words)              # "a b c"
"".join(sorted(s))           # anagram key — sorted characters`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'split() and split(" ") differ on multiple spaces',
        body: '`"a  b".split()` gives `["a","b"]`, collapsing whitespace. `"a  b".split(" ")` gives `["a","","b"]`, keeping the empty field. For word-splitting problems the bare form is almost always what you want.',
      },
      { kind: 'heading', text: 'Characters are numbers' },
      {
        kind: 'code',
        code: `ord('a')        # 97 — character to code point
chr(97)         # 'a' — code point to character

ord(c) - ord('a')       # 0..25 for a lowercase letter
int(c)                  # for a digit character: '5' → 5
ord(c) - ord('0')       # same, without parsing

# The frequency-array idiom:
freq = [0] * 26
for c in word:
    freq[ord(c) - ord('a')] += 1`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'A dict or Counter is usually simpler than a 26-array',
        body: 'Python has no `char` arithmetic shortcut like C++\'s `c - \'a\'`, so `ord(c) - ord(\'a\')` is more verbose. Unless you specifically need array speed, `collections.Counter(word)` or a plain dict is shorter and handles any character set.',
      },
      {
        kind: 'code',
        code: `from collections import Counter
freq = Counter(word)            # one line, any characters
freq['a']                       # 0 for missing keys, no KeyError`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Iterating a string gives characters, not indices',
        body: '`for c in s:` yields one-character *strings* — Python has no separate char type, so `s[0]` is itself a string of length 1. That means `s[0] == "h"` works, and comparing to a character literal is just a string comparison.',
      },
    ],
    keyTakeaways: [
      'Strings support every non-mutating list operation: index, slice, `in`, `sorted`.',
      '`find` returns −1; `index` raises `ValueError`.',
      '`split()` collapses whitespace; `split(" ")` keeps empty fields.',
      '`ord`/`chr` convert to and from code points; `Counter` is usually simpler.',
    ],
    practice: {
      prompt: 'Split a sentence into words, uppercase each, and join them back. Then build a character frequency count with both `[0]*26` and `Counter`, and note which reads better. Then compare `"a  b".split()` with `.split(" ")`.',
      leetcode: { title: 'Reverse Words in a String', slug: 'reverse-words-in-a-string' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-4.7',
    language: 'python',
    summary: 'Understand why strings cannot be modified, and what to do instead.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Strings are **immutable**: `s[0] = "x"` is an error, and every method that looks like it edits a string actually returns a new one. This is not an inconvenience to work around so much as a fact to design with — when you genuinely need to modify text, you convert it to a list, change that, and join it back.',
      },
      {
        kind: 'code',
        code: `s = "hello"
s[0] = 'H'          # TypeError: 'str' object does not support item assignment

s.upper()           # returns a NEW string — s is unchanged
s = s.upper()       # you must reassign`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Every string method returns a new string',
        body: '`s.replace("a", "b")` does not modify `s` — it returns a modified copy. Calling it without assigning the result is a very common bug, and it fails silently because the expression is valid. If a string operation "does nothing", check that you assigned the result.',
      },
      { kind: 'heading', text: 'The performance consequence' },
      {
        kind: 'code',
        code: `# O(n^2) — a brand-new string every iteration
result = ""
for c in chars:
    result += c

# O(n) — collect then join once
parts = []
for c in chars:
    parts.append(c)
result = "".join(parts)

# Or a comprehension
result = "".join(c for c in chars if keep(c))`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: '"".join() is the Python StringBuilder',
        body: 'Java has `StringBuilder` and C++ has mutable `std::string`. Python has neither, so building character by character with `+=` is genuinely quadratic and unavoidable. `"".join(list_of_pieces)` is the idiomatic fix and is O(n) — it computes the total length once and allocates a single buffer.',
      },
      {
        kind: 'text',
        body: 'CPython does optimise some `s += c` cases when the string has only one reference, so short loops may not show the quadratic behaviour. Do not rely on it — the optimisation disappears as soon as another name refers to the string.',
      },
      { kind: 'heading', text: 'Modifying via a list' },
      {
        kind: 'code',
        code: `s = "hello"
chars = list(s)             # ['h','e','l','l','o']
chars[0] = 'H'
s = "".join(chars)          # "Hello"

# In-place reversal of a "string" via a list
chars = list(s)
left, right = 0, len(chars) - 1
while left < right:
    chars[left], chars[right] = chars[right], chars[left]
    left += 1
    right -= 1
s = "".join(chars)`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'LeetCode "reverse a string in place" gives you a list',
        body: 'Because a Python string genuinely cannot be modified, that problem\'s signature is `def reverseString(self, s: List[str]) -> None` — a list of characters, not a string. Recognising why the signature looks odd is worth a moment: it is a direct consequence of immutability.',
      },
      { kind: 'heading', text: 'What immutability buys you' },
      {
        kind: 'code',
        code: `# Strings are hashable, so they work as dict keys and set members
seen = {"hello", "world"}
counts = {"apple": 3}

# Lists are not:
seen = {["a", "b"]}         # TypeError: unhashable type: 'list'
seen = {("a", "b")}         # tuples are fine — also immutable`,
      },
      {
        kind: 'text',
        body: 'That is why the sorted-string anagram key works: `"".join(sorted(word))` produces an immutable, hashable value usable as a dict key. A list of characters could not be used the same way.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Slicing is often cleaner than mutation',
        body: 'Rather than converting to a list to change one character, `s = s[:i] + new + s[i+1:]` does it in one expression. It is O(n) either way, and for a single edit it reads better than the list round-trip.',
      },
    ],
    keyTakeaways: [
      'Strings are immutable — every method returns a new string you must assign.',
      'Building with `+=` in a loop is O(n²); use `"".join(parts)`.',
      'To modify characters, convert to a list and join back.',
      'Immutability is why strings are hashable and usable as dict keys.',
    ],
    practice: {
      prompt: 'Build a 100,000-character string with `+=` and with `"".join()` and time both. Then try `s[0] = "H"` and read the `TypeError`, then do it via a list. Then try to put a list in a set and see why tuples exist.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-4.8',
    language: 'python',
    summary: 'Extract parts of a string, and know when slicing costs you.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Slicing a string works exactly like slicing a list, which is one of the nicest consistencies in the language — `s[::-1]` reverses a string in a single expression. The cost model is the same too: every slice **copies**, so a slice inside a loop quietly turns an O(n) algorithm into an O(n²) one.',
      },
      {
        kind: 'code',
        code: `s = "programming"

s[0:3]          # "pro"   — start inclusive, stop exclusive
s[3:7]          # "gram"
s[7:]           # "ming"
s[:4]           # "prog"
s[-4:]          # "ming"
s[::-1]         # "gnimmargorp" — reversed`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Python slicing takes an end index, not a length',
        body: 'This is the opposite of C++\'s `substr(pos, len)`. `s[2:5]` gives characters at indices 2, 3, 4 — three characters, ending *before* 5. If you switch between the languages, this is the single most likely thing to get backwards.',
      },
      {
        kind: 'code',
        caption: 'Converting between the two mental models',
        code: `# Characters from index i to index j INCLUSIVE:
s[i:j+1]

# Characters starting at i, length L:
s[i:i+L]`,
      },
      { kind: 'heading', text: 'Finding substrings' },
      {
        kind: 'code',
        code: `s.find("gram")          # 3, or -1 if absent
s.find("gram", 5)       # search starting at index 5
s.rfind("m")            # last occurrence
s.index("gram")         # same as find, but raises ValueError if absent

"gram" in s             # True — the simplest membership test
s.startswith("pro")     # True
s.count("m")            # 2`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Slicing costs O(k) — do not do it in a loop',
        body: 'Every slice copies the characters. Generating all substrings with `s[i:j+1]` inside nested loops is O(n³): O(n²) substrings each costing O(n) to build. When you only need to *examine* a range, carry `(i, j)` indices and compare `s[k]` directly instead of materialising the substring.',
      },
      {
        kind: 'code',
        code: `# O(n^3) — a copy at every step
for i in range(n):
    for j in range(i, n):
        sub = s[i:j+1]
        process(sub)

# O(n^2) — no copying
for i in range(n):
    for j in range(i, n):
        # examine s[i..j] via indices
        ...`,
      },
      { kind: 'heading', text: 'And do not slice in recursion' },
      {
        kind: 'code',
        code: `# BAD — copies the remainder every level: O(n^2)
def check(s):
    if not s:
        return True
    return check(s[1:])

# GOOD — one string, one moving index: O(n)
def check(s, i=0):
    if i == len(s):
        return True
    return check(s, i + 1)`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Palindrome checks are where this bites hardest',
        body: '`s == s[::-1]` is elegant and O(n) in both time and space — fine for a single check. But inside a loop over all substrings it becomes the dominant cost. The two-pointer version uses O(1) space and avoids the allocation entirely.',
      },
      {
        kind: 'code',
        code: `# Elegant, O(n) extra space
def is_palindrome(s):
    return s == s[::-1]

# Two pointers, O(1) extra space
def is_palindrome(s):
    left, right = 0, len(s) - 1
    while left < right:
        if s[left] != s[right]:
            return False
        left += 1
        right -= 1
    return True`,
      },
      {
        kind: 'text',
        body: 'For an interview, mention the slice version as the obvious approach and then give the two-pointer improvement — showing that progression is exactly what is being assessed.',
      },
    ],
    keyTakeaways: [
      'Python slicing takes an end index; C++ `substr` takes a length.',
      '`s[i:j+1]` is indices i through j inclusive.',
      'Slicing copies at O(k) — use index pairs inside loops and recursion.',
      '`s == s[::-1]` is O(n) space; two pointers is O(1).',
    ],
    practice: {
      prompt: 'Print all substrings of "abc" and check you get 6. Then write palindrome checking both ways and time them on a long string. Then write recursive character checking with slicing and with an index, and time both.',
      leetcode: { title: 'Longest Palindromic Substring', slug: 'longest-palindromic-substring' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-4.9',
    language: 'python',
    summary: 'Build strings efficiently — join, f-strings, and what to avoid.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Because strings are immutable, `result += ch` in a loop does not extend anything — it builds a brand-new string every pass, making the loop O(n²). The fix is a habit worth forming immediately: **collect the pieces in a list, then `"".join(...)` once at the end.** That is the Python equivalent of Java\'s `StringBuilder`.',
      },
      {
        kind: 'code',
        caption: 'The ways to combine strings',
        code: `a, b = "hello", "world"

a + " " + b                 # "hello world" — fine for a few pieces
f"{a} {b}"                  # f-string — clearest for mixed content
" ".join([a, b])            # join — best for a list of pieces
a * 3                       # "hellohellohello" — repetition`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'join is the one to reach for in loops',
        body: 'It computes the total length once and allocates a single buffer, so building n pieces is O(total length) rather than O(n²). Every time you find yourself doing `result += piece` inside a loop, the answer is to append to a list and join at the end.',
      },
      {
        kind: 'code',
        code: `# O(n^2)
result = ""
for word in words:
    result += word + " "

# O(n)
result = " ".join(words)

# With filtering or transformation
result = " ".join(w.upper() for w in words if w)`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'join only accepts strings',
        body: '`" ".join([1, 2, 3])` raises `TypeError: sequence item 0: expected str instance, int found`. Convert first: `" ".join(str(x) for x in nums)` or `" ".join(map(str, nums))`. This catches people constantly when printing a list of numbers.',
      },
      {
        kind: 'code',
        code: `nums = [1, 2, 3]
" ".join(nums)                      # TypeError
" ".join(map(str, nums))            # "1 2 3"
" ".join(str(x) for x in nums)      # same`,
      },
      { kind: 'heading', text: 'f-strings for mixed content' },
      {
        kind: 'code',
        code: `name, count, avg = "DSA", 42, 3.14159

f"{name}: {count} items"            # "DSA: 42 items"
f"{avg:.2f}"                        # "3.14"
f"{count:5}"                        # "   42" — width 5, right-aligned
f"{count:<5}"                       # "42   " — left-aligned
f"{count:05}"                       # "00042" — zero-padded
f"{count + 1}"                      # expressions are allowed
f"{count=}"                         # "count=42" — handy for debugging`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'f-strings replaced everything else',
        body: 'You will still see `%` formatting and `.format()` in older code, but f-strings are faster and clearer. The `f"{x=}"` debug form in particular is worth knowing — it prints both the expression and its value, which saves writing the label by hand.',
      },
      { kind: 'heading', text: 'Building results in DSA' },
      {
        kind: 'code',
        code: `# Filtering characters
result = "".join(c for c in s if c.isalnum())

# Building from digits (which come out reversed)
digits = []
while n > 0:
    digits.append(str(n % 10))
    n //= 10
result = "".join(reversed(digits))

# Root-to-leaf paths
def dfs(node, path):
    if not node:
        return
    path.append(str(node.val))
    if not node.left and not node.right:
        result.append("->".join(path))
    dfs(node.left, path)
    dfs(node.right, path)
    path.pop()                  # backtrack`,
      },
      {
        kind: 'text',
        body: 'That last pattern — a shared list of pieces with `append`/`pop` around the recursive calls, joined only at a leaf — is the standard way to build path strings without quadratic concatenation.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'A trailing separator is the classic off-by-one',
        body: 'Building `"a, b, c, "` with a loop leaves a trailing comma. `", ".join(parts)` places separators *between* elements and cannot produce one. That alone is a good reason to prefer it over manual concatenation.',
      },
    ],
    keyTakeaways: [
      '`"".join(parts)` is O(n); `+=` in a loop is O(n²).',
      '`join` requires strings — use `map(str, nums)` for numbers.',
      'f-strings handle formatting: `{x:.2f}`, `{x:05}`, `{x=}`.',
      '`join` places separators between elements, so no trailing separator.',
    ],
    practice: {
      prompt: 'Join a list of integers and read the `TypeError`, then fix it with `map(str, ...)`. Then build a 100,000-piece string with `+=` and with `join` and time both. Then write root-to-leaf paths with the append/pop pattern.',
      leetcode: { title: 'Binary Tree Paths', slug: 'binary-tree-paths' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-4.10',
    language: 'python',
    summary: 'Count occurrences — and use the tool that makes it a one-liner.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Frequency counting appears in more problems than almost any other technique. Python offers three implementations, and the third makes it trivial.',
      },
      {
        kind: 'code',
        caption: '1. A plain dict',
        code: `freq = {}
for c in s:
    freq[c] = freq.get(c, 0) + 1        # get with a default avoids KeyError`,
      },
      {
        kind: 'code',
        caption: '2. defaultdict — no default needed',
        code: `from collections import defaultdict

freq = defaultdict(int)                 # missing keys become 0
for c in s:
    freq[c] += 1

groups = defaultdict(list)              # missing keys become []
groups[key].append(word)`,
      },
      {
        kind: 'code',
        caption: '3. Counter — one line',
        code: `from collections import Counter

freq = Counter(s)                       # done
freq = Counter(nums)                    # works on any iterable

freq['a']                               # 0 for missing keys, no KeyError
freq.most_common(3)                     # the 3 most frequent, as (value, count)
freq.most_common()[-1]                  # the least frequent
sum(freq.values())                      # total count`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Counter is the biggest single Python advantage in DSA',
        body: 'What takes a loop and a 26-element array in C++ or Java is `Counter(s)`. And `most_common(k)` solves Top K Frequent Elements without building a heap. When a problem mentions frequencies, reach for `Counter` first.',
      },
      { kind: 'heading', text: 'Counter arithmetic' },
      {
        kind: 'code',
        code: `a = Counter("aabbc")
b = Counter("abbbd")

a == b                  # equality — the anagram check
a - b                   # Counter({'a': 1, 'c': 1}) — keeps positive counts only
a + b                   # combined counts
a & b                   # intersection: minimum of each count
a | b                   # union: maximum of each count`,
      },
      {
        kind: 'code',
        caption: 'Problems this collapses',
        code: `# Valid Anagram — one line
def isAnagram(self, s, t):
    return Counter(s) == Counter(t)

# First unique character
def firstUniqChar(self, s):
    freq = Counter(s)
    for i, c in enumerate(s):
        if freq[c] == 1:
            return i
    return -1

# Top K frequent
def topKFrequent(self, nums, k):
    return [x for x, _ in Counter(nums).most_common(k)]`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'A dict lookup on a missing key raises KeyError',
        body: 'Plain `freq[c]` on an absent key raises; `freq.get(c, 0)`, `defaultdict(int)` and `Counter` all return 0 instead. This differs from C++, where `map[key]` silently creates a zero entry. Python\'s version is safer — you get a clear error rather than a phantom key — but you must handle it.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'defaultdict creates entries on read',
        body: '`if freq[x] > 0:` on a `defaultdict` *inserts* `x` with value 0 as a side effect, growing the dict and corrupting any `len()` check. Use `if x in freq:` to test membership without inserting. `Counter` does not have this problem — reading a missing key returns 0 without storing it.',
      },
      { kind: 'heading', text: 'The sliding-window pattern' },
      {
        kind: 'code',
        code: `from collections import defaultdict

window = defaultdict(int)
left = 0
best = 0

for right, c in enumerate(s):
    window[c] += 1

    while len(window) > k:              # too many distinct characters
        window[s[left]] -= 1
        if window[s[left]] == 0:
            del window[s[left]]        # DELETE, do not leave zeros
        left += 1

    best = max(best, right - left + 1)`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Delete keys that reach zero',
        body: 'If you only decrement, zero-count keys linger and `len(window)` keeps counting characters no longer in the window — so the condition never becomes true and the answer is wrong. Any sliding window testing `len(dict)` must delete zero-count keys.',
      },
    ],
    keyTakeaways: [
      '`Counter(iterable)` counts in one line and returns 0 for missing keys.',
      '`Counter(s) == Counter(t)` is the anagram check; `most_common(k)` gives top-k.',
      'Plain `dict[missing]` raises; use `get`, `defaultdict` or `Counter`.',
      'In sliding windows, delete keys whose count drops to zero.',
    ],
    practice: {
      prompt: 'Solve Valid Anagram with `Counter` equality and Top K Frequent with `most_common`. Then write a sliding window over distinct characters, omit the `del`, and find the input where it gives the wrong answer.',
      leetcode: { title: 'Top K Frequent Elements', slug: 'top-k-frequent-elements' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-4.11',
    language: 'python',
    summary: 'Check palindromes, from the one-liner to the O(1)-space version.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A palindrome reads the same forwards and backwards, and it is one of the most common shapes in beginner problem sets. Python can answer it in a single expression — but an interviewer will usually follow up with "now do it without the extra copy", so it is worth knowing both the one-liner and the two-pointer version underneath it.',
      },
      {
        kind: 'code',
        caption: 'The one-liner',
        code: `def is_palindrome(s):
    return s == s[::-1]`,
      },
      {
        kind: 'text',
        body: 'Correct, readable, and **O(n) time with O(n) extra space** — the reversed copy. Fine for a single check, and worth mentioning in an interview as the obvious approach before improving on it.',
      },
      {
        kind: 'code',
        caption: 'Two pointers — O(1) space',
        code: `def is_palindrome(s):
    left, right = 0, len(s) - 1
    while left < right:
        if s[left] != s[right]:
            return False
        left += 1
        right -= 1
    return True`,
      },
      {
        kind: 'text',
        body: 'The condition is `left < right`, not `<=`. When they meet in the middle of an odd-length string, that character is trivially its own mirror and needs no check.',
      },
      { kind: 'heading', text: 'The variant LeetCode actually asks' },
      {
        kind: 'code',
        caption: 'Ignoring case and non-alphanumeric characters',
        code: `def isPalindrome(self, s):
    left, right = 0, len(s) - 1

    while left < right:
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1

        if s[left].lower() != s[right].lower():
            return False
        left += 1
        right -= 1

    return True`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'The inner skip loops need the left < right guard too',
        body: 'Without it, a string of only punctuation walks `left` straight past `right` and off the end. `",."` is exactly the hidden test case that catches this. Any inner loop advancing a pointer needs the same bound as the outer one.',
      },
      {
        kind: 'code',
        caption: 'The Pythonic filter-first alternative',
        code: `def isPalindrome(self, s):
    filtered = [c.lower() for c in s if c.isalnum()]
    return filtered == filtered[::-1]`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Two valid answers with different trade-offs',
        body: 'The filter version is three lines and obviously correct but uses O(n) extra space. The two-pointer version is O(1) space. Mention both in an interview — showing you know the trade-off is worth more than either solution alone.',
      },
      { kind: 'heading', text: 'Expand around centre' },
      {
        kind: 'code',
        caption: 'Longest palindromic substring',
        code: `def longestPalindrome(self, s):
    best = ""

    def expand(left, right):
        while left >= 0 and right < len(s) and s[left] == s[right]:
            left -= 1
            right += 1
        return s[left + 1:right]        # the last valid window

    for i in range(len(s)):
        odd = expand(i, i)              # odd length: centre is one char
        even = expand(i, i + 1)         # even length: centre is a gap
        best = max(best, odd, even, key=len)

    return best`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Two centre types is the part people forget',
        body: 'An even-length palindrome like `"abba"` has no middle character — its centre is the gap between the two b\'s, which is why the second call starts with `right = i + 1`. A solution handling only odd centres passes many tests and fails on even-length answers.',
      },
      {
        kind: 'text',
        body: 'Note `max(best, odd, even, key=len)` — using `max` with a key across three candidates in one expression is a small Python win over the equivalent nested comparisons.',
      },
    ],
    keyTakeaways: [
      '`s == s[::-1]` is O(n) space; two pointers is O(1).',
      'Use `left < right`; the middle character of an odd string needs no check.',
      'Inner skip loops must also be bounded by `left < right`.',
      'Expand-around-centre needs both `(i, i)` and `(i, i+1)` centres.',
    ],
    practice: {
      prompt: 'Write the filtered palindrome check and test it on `"A man, a plan, a canal: Panama"`, on `",."`, and on `""`. Then implement longest-palindromic-substring and verify it handles `"abba"` — the even-centre case separates a working solution from an almost-working one.',
      leetcode: { title: 'Valid Palindrome', slug: 'valid-palindrome' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-4.12',
    language: 'python',
    summary: 'Recognise the small set of patterns nearly every string problem reduces to.',
    readMinutes: 6,
    blocks: [
      {
        kind: 'text',
        body: 'String problems look varied but draw on a short list of techniques. Recognising which applies is most of the work.',
      },
      { kind: 'heading', text: '1. Frequency counting' },
      {
        kind: 'code',
        code: `from collections import Counter
freq = Counter(s)`,
      },
      {
        kind: 'text',
        body: 'Anagrams, first unique character, "can this be rearranged into…". Whenever *which* characters matter but their order does not, count them. **O(n)**.',
      },
      { kind: 'heading', text: '2. Two pointers' },
      {
        kind: 'code',
        code: `left, right = 0, len(s) - 1
while left < right:
    ...
    left += 1
    right -= 1`,
      },
      {
        kind: 'text',
        body: 'Palindromes, reversal, comparing from both ends. **O(n)** time, **O(1)** space.',
      },
      { kind: 'heading', text: '3. Sliding window' },
      {
        kind: 'code',
        caption: 'Longest substring without repeating characters',
        code: `def lengthOfLongestSubstring(self, s):
    last_seen = {}
    start = best = 0

    for i, c in enumerate(s):
        if c in last_seen and last_seen[c] >= start:
            start = last_seen[c] + 1        # jump past the duplicate
        last_seen[c] = i
        best = max(best, i - start + 1)

    return best`,
      },
      {
        kind: 'text',
        body: 'Any "longest/shortest substring with property X". The window grows on the right and its left edge jumps forward when the property breaks. **O(n)**.',
      },
      { kind: 'heading', text: '4. Sorting as a canonical form' },
      {
        kind: 'code',
        caption: 'Group anagrams',
        code: `from collections import defaultdict

def groupAnagrams(self, words):
    groups = defaultdict(list)
    for w in words:
        key = "".join(sorted(w))            # all anagrams share this key
        groups[key].append(w)
    return list(groups.values())

# Or with a count tuple key — O(k) instead of O(k log k) per word:
key = tuple(sorted(Counter(w).items()))`,
      },
      { kind: 'heading', text: '5. Building a result with join' },
      {
        kind: 'code',
        code: `result = "".join(c for c in s if c.isalnum())
result = " ".join(reversed(s.split()))          # reverse word order`,
      },
      { kind: 'heading', text: '6. Set for seen-before' },
      {
        kind: 'code',
        code: `seen = set()
for c in s:
    if c in seen:
        ...                                  # duplicate
    seen.add(c)`,
      },
      {
        kind: 'table',
        headers: ['Problem says…', 'Reach for'],
        rows: [
          ['"anagram", "rearrange", "permutation of"', '`Counter`'],
          ['"palindrome", "reverse"', 'Two pointers'],
          ['"longest/shortest substring such that…"', 'Sliding window'],
          ['"group by", "same letters"', 'Sorted string as a dict key'],
          ['"first unique", "duplicate"', '`Counter` or `set`'],
          ['"prefix", "starts with"', 'Trie, or `startswith`'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Two questions route most string problems',
        body: 'First: **does order matter?** If not, counting probably beats scanning. Second: **is the answer a contiguous piece of the string?** If yes, a sliding window is likely. Those two questions cover the large majority of cases.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'The edge cases that are always tested',
        body: 'Empty string, single character, all characters identical, and — for palindrome and anagram problems — strings of different lengths. `s[-1]` on an empty string raises `IndexError`, and `len(s) - 1` gives −1 which makes `range` produce nothing. Check them before submitting.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Watch the O(n²) traps specific to Python',
        body: 'Building with `+=` instead of `join`, slicing inside a loop or recursion, and `x in list` where a set was needed. All three read as linear and are not. Given Python\'s speed penalty on the judge, they matter more here than in C++.',
      },
    ],
    keyTakeaways: [
      'Order irrelevant → `Counter`. Contiguous answer → sliding window.',
      '`"".join(sorted(w))` is the canonical anagram key.',
      'Build results with `join`, never `+=` in a loop.',
      'Always test empty, single-character and all-same-character inputs.',
    ],
    practice: {
      prompt: 'Solve Longest Substring Without Repeating Characters with a sliding window, then Group Anagrams with a sorted key. Between them they exercise four of the six patterns, and both are among the most frequently asked string questions in interviews.',
      leetcode: { title: 'Longest Substring Without Repeating Characters', slug: 'longest-substring-without-repeating-characters' },
    },
  },
];
