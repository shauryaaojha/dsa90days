import type { Lesson } from '../types';

/**
 * Python Chapter 11 — Searching and Sorting Helpers.
 * Python's sort is excellent and its bisect module removes most hand-written
 * binary search. The `key` function is the skill that unlocks both.
 */
export const ch11: Lesson[] = [
  // -------------------------------------------------------------------------
  {
    topicId: 'python-11.1',
    language: 'python',
    summary: 'Know when a linear scan is genuinely the right answer.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'Linear search checks every element until it finds what it wants. It is O(n) and it is the correct choice more often than beginners expect — on unsorted data there is simply nothing faster, and Python gives you several ways to express it in one line.',
      },
      {
        kind: 'code',
        code: `x in nums                     # is it present?      O(n)
nums.index(x)                 # first index         O(n), ValueError if absent
nums.count(x)                 # how many times      O(n)

min(nums), max(nums)          # O(n)
sum(nums)                     # O(n)

any(x > 10 for x in nums)     # short-circuits on the first True
all(x > 0 for x in nums)      # short-circuits on the first False`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Built-ins are C loops — far faster than yours',
        body: '`max(nums)` runs the loop in C rather than in Python bytecode, so it is several times quicker than an equivalent `for` loop even though both are O(n). Prefer the built-in whenever one fits.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: '`nums.index(x)` raises when the value is absent',
        body: 'It throws `ValueError: x is not in list` rather than returning −1 like other languages. Guard with `if x in nums` first — though that scans twice, so for a single lookup a manual loop with `enumerate` is better.',
      },
      {
        kind: 'code',
        caption: 'Finding an index safely',
        code: `# Two scans — simple but wasteful
if x in nums:
    i = nums.index(x)

# One scan
i = next((i for i, v in enumerate(nums) if v == x), -1)`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Repeated linear search is the real mistake',
        body: 'One O(n) scan is fine. `x in nums` *inside a loop* is O(n²) and the single most common Python timeout. If you are searching repeatedly, build a `set` or `dict` once and search that instead.',
      },
      {
        kind: 'text',
        body: 'The decision is simple: searching **once** on unsorted data → linear scan. Searching **repeatedly** → build a set or dict. Data already **sorted** → binary search, which is the rest of this chapter.',
      },
    ],
    keyTakeaways: [
      'Linear search is O(n) and correct on unsorted data.',
      'Built-ins like `max` and `sum` run in C — prefer them to hand loops.',
      '`list.index` raises rather than returning −1.',
      'Searching repeatedly? Build a set or dict once.',
    ],
    practice: {
      prompt: 'Write a loop that calls `x in nums` on a 10,000-element list 10,000 times, then rewrite it with a `set`. Time both — that gap is why this lesson exists.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-11.2',
    language: 'python',
    summary: 'Write binary search correctly, and know when to search the answer instead.',
    readMinutes: 6,
    blocks: [
      {
        kind: 'text',
        body: 'Binary search halves the search space each step. The idea is easy; the **loop invariant** is what people get wrong. Pick one convention and never deviate — the version below uses a closed interval, which is the easiest to reason about for exact matching.',
      },
      {
        kind: 'code',
        caption: 'Exact match on a sorted list',
        code: `lo, hi = 0, len(nums) - 1

while lo <= hi:
    mid = (lo + hi) // 2          # Python ints never overflow

    if nums[mid] == target:
        return mid
    elif nums[mid] < target:
        lo = mid + 1              # answer is right
    else:
        hi = mid - 1              # answer is left

return -1`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Python is spared the overflow bug',
        body: 'In C++ and Java, `(lo + hi) // 2` can overflow and you must write `lo + (hi - lo) // 2`. Python integers are arbitrary precision, so the simple form is safe — one of the few places Python is strictly easier.',
      },
      {
        kind: 'text',
        body: 'The far more valuable form is **binary search on the answer**. When the question is "what is the smallest capacity / speed / size that works?", you are searching the range of possible answers, not a list. It applies whenever the predicate is monotonic: if `x` works, every larger `x` works too.',
      },
      {
        kind: 'code',
        caption: 'The answer-search template',
        code: `def min_feasible(lo, hi, feasible):
    while lo < hi:                    # half-open: converge on the boundary
        mid = (lo + hi) // 2

        if feasible(mid):
            hi = mid                  # mid works — it might BE the answer
        else:
            lo = mid + 1              # mid fails — answer is strictly right

    return lo                         # lo == hi == first feasible x`,
      },
      {
        kind: 'code',
        caption: 'Koko Eating Bananas — write `feasible` first',
        code: `def min_eating_speed(piles, h):
    def feasible(speed):
        return sum(math.ceil(p / speed) for p in piles) <= h

    lo, hi = 1, max(piles)
    while lo < hi:
        mid = (lo + hi) // 2
        if feasible(mid): hi = mid
        else:             lo = mid + 1
    return lo`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'One template, many problems',
        body: 'Koko Eating Bananas, Capacity to Ship Packages, Split Array Largest Sum and Minimum Days to Make Bouquets are literally the same eight lines with a different `feasible`. Isolating that function makes the reuse obvious.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Infinite loop from the wrong update',
        body: 'With `while lo < hi`, writing `lo = mid` hangs forever when `hi == lo + 1`, because `mid` floors to `lo`. Rule: whichever bound you set to `mid` unchanged, the other must move past it.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Check the predicate is genuinely monotonic',
        body: 'If `feasible(5)` is True but `feasible(6)` is False, binary search on the answer is invalid and returns confident nonsense. Verify the monotonicity before writing the loop.',
      },
    ],
    keyTakeaways: [
      'Pick one convention: `lo <= hi` with `mid ± 1`, or `lo < hi` with `hi = mid`.',
      'Python integers cannot overflow, so `(lo + hi) // 2` is safe.',
      'Binary search on the answer needs a monotonic `feasible(x)`.',
      'Whichever bound stays at `mid`, the other must move past it.',
    ],
    practice: {
      prompt: 'Write plain binary search from memory. Then solve Koko Eating Bananas by writing `feasible(speed)` first and dropping it into the template unchanged.',
      leetcode: { title: 'Koko Eating Bananas', slug: 'koko-eating-bananas' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-11.3',
    language: 'python',
    summary: 'Use bisect_left to find the first position where a value could go.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: '`bisect_left(a, x)` returns the **leftmost** index where `x` could be inserted while keeping the list sorted. Equivalently: the number of elements strictly less than `x`. That framing answers more questions than "is it present?" does.',
      },
      {
        kind: 'code',
        code: `from bisect import bisect_left

a = [1, 3, 3, 5, 7]

bisect_left(a, 3)     # 1 — BEFORE the existing 3s
bisect_left(a, 4)     # 3 — 4 is absent; this is where it belongs
bisect_left(a, 0)     # 0 — smaller than everything
bisect_left(a, 9)     # 5 — larger than everything (== len(a))`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Read it as "how many are strictly less than x"',
        body: '`bisect_left(a, x)` counts elements `< x`. That single sentence explains all four results above and makes the function useful for counting, not just for locating.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'It does not tell you whether x exists',
        body: 'You get a valid index whether or not the value is present. To test membership you must check both bounds and the value: `i = bisect_left(a, x); found = i < len(a) and a[i] == x`. Skipping the length check raises `IndexError` when `x` exceeds everything.',
      },
      {
        kind: 'code',
        caption: 'The safe membership test',
        code: `def contains(a, x):
    i = bisect_left(a, x)
    return i < len(a) and a[i] == x`,
      },
      {
        kind: 'code',
        caption: 'Where it shines: first index ≥ x',
        code: `# "Find the first meeting starting at or after time t"
i = bisect_left(starts, t)
if i < len(starts):
    next_meeting = starts[i]

# "Largest value strictly less than x"
i = bisect_left(a, x)
if i > 0:
    predecessor = a[i - 1]`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'The list must already be sorted',
        body: '`bisect` neither checks nor sorts. On unsorted input it returns a meaningless index with no error at all. If you sort first, that is O(n log n) — worth it only when many queries follow.',
      },
      {
        kind: 'text',
        body: 'Since Python 3.10 `bisect_left` accepts a `key` parameter, so you can search a list of tuples or objects by one field without unpacking them first. On older versions you must search a separate list of keys.',
      },
    ],
    keyTakeaways: [
      '`bisect_left(a, x)` = first index where x fits = count of elements < x.',
      'It returns an index whether or not x exists.',
      'Membership needs `i < len(a) and a[i] == x`.',
      'The list must already be sorted — nothing warns you otherwise.',
    ],
    practice: {
      prompt: 'On `[1, 3, 3, 5, 7]`, call `bisect_left` with 0, 3, 4 and 9 and predict each answer before running. Then write the safe `contains` helper.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-11.4',
    language: 'python',
    summary: 'Use bisect_right, and combine both to count duplicates.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: '`bisect_right(a, x)` returns the **rightmost** insertion point — after any existing copies of `x`. Equivalently: the number of elements less than **or equal to** `x`. The pair with `bisect_left` is what makes duplicate counting a one-liner.',
      },
      {
        kind: 'code',
        code: `from bisect import bisect_left, bisect_right

a = [1, 3, 3, 5, 7]

bisect_left(a, 3)     # 1 — before the 3s
bisect_right(a, 3)    # 3 — after the 3s

bisect_right(a, 3) - bisect_left(a, 3)   # 2  <- how many 3s there are`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Together they bracket a value',
        body: '`[bisect_left(a, x), bisect_right(a, x))` is exactly the slice of the list equal to `x`. That gives you the first index, the last index, and the count — which is the whole of "Find First and Last Position of Element in Sorted Array".',
      },
      {
        kind: 'code',
        caption: 'Search for a range, in three lines',
        code: `def search_range(nums, target):
    lo = bisect_left(nums, target)
    hi = bisect_right(nums, target)

    return [lo, hi - 1] if lo < hi else [-1, -1]`,
      },
      {
        kind: 'table',
        headers: ['Question', 'Expression'],
        rows: [
          ['How many `< x`', '`bisect_left(a, x)`'],
          ['How many `<= x`', '`bisect_right(a, x)`'],
          ['How many `== x`', '`bisect_right(a,x) - bisect_left(a,x)`'],
          ['How many `> x`', '`len(a) - bisect_right(a, x)`'],
          ['First index `>= x`', '`bisect_left(a, x)`'],
          ['Last index `<= x`', '`bisect_right(a, x) - 1`'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: '`bisect` is an alias for `bisect_right`',
        body: 'Calling plain `bisect(a, x)` gives you the *right* variant. When you meant `bisect_left` the difference only appears on inputs with duplicates — which is precisely the case that hidden tests cover. Always name the one you want explicitly.',
      },
      {
        kind: 'code',
        caption: 'insort — find and insert in one call',
        code: `from bisect import insort

insort(a, 4)          # keeps the list sorted -> [1, 3, 3, 4, 5, 7]

# The SEARCH is O(log n) but the INSERT is O(n), because a list
# must shift everything right. Fine for small n; for heavy insertion
# workloads you need a different structure.`,
      },
    ],
    keyTakeaways: [
      '`bisect_right` counts elements ≤ x; `bisect_left` counts those < x.',
      'Their difference is the number of copies of x.',
      'Together they solve "find first and last position" in three lines.',
      'Bare `bisect` means `bisect_right` — name it explicitly.',
    ],
    practice: {
      prompt: 'Solve Find First and Last Position with `bisect_left` and `bisect_right`. Then build the counting table above from memory on a list with duplicates.',
      leetcode: { title: 'Find First and Last Position of Element in Sorted Array', slug: 'find-first-and-last-position-of-element-in-sorted-array' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-11.5',
    language: 'python',
    summary: 'Use sorted() to get a new sorted list from any iterable.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: '`sorted(iterable)` returns a **new list**, leaving the original untouched. It works on anything iterable — lists, strings, sets, dicts, tuples — which makes it more flexible than the in-place `list.sort()`.',
      },
      {
        kind: 'code',
        code: `sorted([3, 1, 2])           # [1, 2, 3]
sorted("hello")             # ['e', 'h', 'l', 'l', 'o'] — a LIST of chars
sorted({3, 1, 2})           # [1, 2, 3] — from a set
sorted({"b": 2, "a": 1})    # ['a', 'b'] — dict yields its KEYS

sorted(nums, reverse=True)  # descending
sorted(words, key=len)      # by a computed value`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: '`sorted("hello")` gives a list, not a string',
        body: 'To get a sorted string back you must rejoin: `"".join(sorted(s))`. That expression is the standard anagram key, and forgetting the join is why a `dict` lookup silently fails — a list is unhashable and raises `TypeError`.',
      },
      {
        kind: 'code',
        caption: 'Sorting anything, into anything',
        code: `# Sort a dict by value, into a list of pairs
sorted(d.items(), key=lambda kv: kv[1])

# Sort by value descending, then key ascending
sorted(d.items(), key=lambda kv: (-kv[1], kv[0]))

# Sort a list of tuples by the second element
sorted(pairs, key=lambda p: p[1])`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Python\'s sort is stable',
        body: 'Elements comparing equal keep their original relative order. That lets you sort by a secondary key first, then by the primary — and the secondary ordering survives. It is a real technique, not a curiosity.',
      },
      {
        kind: 'code',
        caption: 'Stability in use',
        code: `# Sort by name, then by score — the name order survives within equal scores
people.sort(key=lambda p: p.name)
people.sort(key=lambda p: p.score, reverse=True)

# Equivalent, in one pass:
people.sort(key=lambda p: (-p.score, p.name))`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Sorting is O(n log n) — do not do it in a loop',
        body: 'Re-sorting inside a loop is a common accidental O(n² log n). If you need repeated access to the minimum, use a heap. If you need repeated range queries, sort once and use `bisect`.',
      },
    ],
    keyTakeaways: [
      '`sorted()` returns a new list and accepts any iterable.',
      '`sorted(str)` gives a list — rejoin with `"".join(...)`.',
      'Python\'s sort is stable, so you can sort by keys in sequence.',
      'Sorting inside a loop is a common accidental blow-up.',
    ],
    practice: {
      prompt: 'Sort a dict by value descending and then by key ascending, in one call. Then build the anagram key `"".join(sorted(w))` and use it in a `defaultdict`.',
      leetcode: { title: 'Group Anagrams', slug: 'group-anagrams' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-11.6',
    language: 'python',
    summary: 'Use list.sort() to sort in place, and know when it beats sorted().',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: '`list.sort()` sorts **in place** and returns `None`. It works only on lists, uses no extra memory for the result, and is marginally faster than `sorted()` because nothing is copied.',
      },
      {
        kind: 'code',
        code: `nums = [3, 1, 2]

nums.sort()                  # nums is now [1, 2, 3]; returns None
nums.sort(reverse=True)
nums.sort(key=abs)

new = sorted(nums)           # a separate list; nums untouched`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: '`nums = nums.sort()` destroys your list',
        body: '`sort()` returns `None`, so that assignment sets `nums` to `None` and every later use raises `TypeError: object is not subscriptable`. It is the most common Python sorting mistake. Call it as a statement.',
      },
      {
        kind: 'table',
        headers: ['', '`list.sort()`', '`sorted()`'],
        rows: [
          ['Works on', 'Lists only', 'Any iterable'],
          ['Returns', '`None`', 'A new list'],
          ['Original', 'Modified', 'Untouched'],
          ['Memory', 'O(1) extra', 'O(n) for the copy'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Which to use',
        body: 'Use `sort()` when you own the list and do not need the original — the common case in DSA, and it saves a copy. Use `sorted()` when the input is not a list, or when the caller\'s data must stay intact.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Do not mutate an input you were given',
        body: 'On LeetCode, sorting the input array in place is usually accepted — but if the problem asks for original indices, sorting destroys them. Store `(value, index)` pairs before sorting, or use a dict instead.',
      },
      {
        kind: 'code',
        caption: 'Sorting while keeping original indices',
        code: `indexed = sorted(range(len(nums)), key=lambda i: nums[i])
# indexed[0] is the index of the smallest value

# or carry the index along
pairs = sorted((v, i) for i, v in enumerate(nums))`,
      },
      {
        kind: 'text',
        body: 'Both use **Timsort** — a hybrid merge sort that detects already-ordered runs. It is O(n log n) worst case and genuinely O(n) on already-sorted input, which is why sorting nearly-sorted data in Python is so fast.',
      },
    ],
    keyTakeaways: [
      '`sort()` mutates and returns `None`; `sorted()` copies.',
      '`nums = nums.sort()` sets `nums` to `None`.',
      'Use `sort()` when you own the list; `sorted()` otherwise.',
      'Both use Timsort — O(n log n) worst case, O(n) on sorted input.',
    ],
    practice: {
      prompt: 'Write `nums = nums.sort()` and watch the next line fail. Then sort a list while preserving original indices using the `(value, index)` trick.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-11.7',
    language: 'python',
    summary: 'Use key functions — the single most useful sorting feature in Python.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'The `key` parameter takes a function applied to each element, and sorting happens on the **results**. This is Python\'s answer to comparators, and it is both simpler and faster than writing one — because the key is computed once per element, not once per comparison.',
      },
      {
        kind: 'code',
        code: `sorted(words, key=len)                    # by length
sorted(words, key=str.lower)              # case-insensitive
sorted(nums, key=abs)                     # by absolute value
sorted(points, key=lambda p: p[0]**2 + p[1]**2)   # by distance

sorted(people, key=lambda p: p.age)       # by attribute`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Pass the function, not a call to it',
        body: '`key=len` is correct; `key=len()` is an error. You are handing `sort` a function to apply, not a value. This is the same distinction as `defaultdict(list)` versus `defaultdict(list())`.',
      },
      { kind: 'heading', text: 'Multi-key sorting with tuples' },
      {
        kind: 'code',
        code: `# By score descending, then name ascending
sorted(people, key=lambda p: (-p.score, p.name))

# By length, then alphabetically
sorted(words, key=lambda w: (len(w), w))

# Tuples compare element by element — the first decides,
# later ones only break ties.`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Negate a numeric key to reverse just that field',
        body: '`reverse=True` flips **everything**. To reverse only one field, negate it inside the tuple: `(-score, name)` gives descending score with ascending name. That mixed ordering is impossible with `reverse` alone.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'You cannot negate a string',
        body: '`-name` raises `TypeError`. For descending text order combined with another ascending field, sort twice — relying on stability — or map the strings to something numeric.',
      },
      {
        kind: 'code',
        caption: 'Descending text, ascending number, via stability',
        code: `people.sort(key=lambda p: p.age)                 # secondary first
people.sort(key=lambda p: p.name, reverse=True)  # primary last`,
      },
      {
        kind: 'code',
        caption: 'Faster keys with operator',
        code: `from operator import itemgetter, attrgetter

sorted(pairs, key=itemgetter(1))            # faster than lambda p: p[1]
sorted(pairs, key=itemgetter(1, 0))         # multi-key
sorted(people, key=attrgetter("age"))`,
      },
      {
        kind: 'text',
        body: 'The same `key` parameter works on `min`, `max`, `heapq.nlargest` and `heapq.nsmallest` — so learning it once pays off across the whole standard library.',
      },
    ],
    keyTakeaways: [
      '`key` applies a function to each element; sorting uses the results.',
      'Pass the function itself — `key=len`, not `key=len()`.',
      'Tuple keys give multi-key sorting; negate a number to reverse one field.',
      'The same `key` works on `min`, `max` and the `heapq` helpers.',
    ],
    practice: {
      prompt: 'Sort a list of `(name, score)` by score descending then name ascending using a tuple key. Then try negating the name and read the `TypeError`.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-11.8',
    language: 'python',
    summary: 'Sort tuples and build the custom keys that DSA problems need.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Tuples compare **element by element**: the first decides, later ones only break ties. That behaviour is free multi-key sorting, and it is why so much Python DSA code stores data as tuples.',
      },
      {
        kind: 'code',
        code: `(1, "b") < (2, "a")      # True  — 1 < 2, the second element never matters
(1, "a") < (1, "b")      # True  — tie on the first, so compare the second
(1, 2, 3) < (1, 2, 4)    # True

sorted([(3, "c"), (1, "a"), (1, "b")])    # [(1,'a'), (1,'b'), (3,'c')]`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'This is why heap entries are tuples',
        body: '`heapq.heappush(pq, (dist, node))` orders by distance automatically, with no comparator and no class. Tuple comparison is doing the work — the same mechanism that makes multi-key sorting free.',
      },
      {
        kind: 'code',
        caption: 'The interval sorts you will write most',
        code: `intervals.sort()                          # by start — merging
intervals.sort(key=lambda iv: iv[1])      # by END — activity selection

# Sort points by distance from the origin
points.sort(key=lambda p: p[0]**2 + p[1]**2)     # squared — no sqrt needed`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Comparison stops at the first difference',
        body: 'Tuples of different lengths compare fine until one runs out — `(1, 2) < (1, 2, 3)` is True. But comparing incompatible types at the same position raises `TypeError`, which is what breaks heaps whose tie-break lands on an unorderable object.',
      },
      {
        kind: 'code',
        caption: 'The heap tie-break fix',
        code: `import itertools
counter = itertools.count()

# The counter is unique, so the third element is never compared
heapq.heappush(pq, (priority, next(counter), task))`,
      },
      {
        kind: 'code',
        caption: 'Custom keys worth recognising',
        code: `# Anagram grouping
key = "".join(sorted(word))
key = tuple(sorted(word))                 # also hashable, slightly faster

# Sudoku box index
key = (r // 3) * 3 + (c // 3)

# Grid diagonals
key = r - c          # top-left to bottom-right
key = r + c          # top-right to bottom-left`,
      },
      {
        kind: 'text',
        body: 'Choosing that derived key is usually the *whole* problem in grouping questions. Once you have the right key, the rest is a `defaultdict(list)` and one line.',
      },
    ],
    keyTakeaways: [
      'Tuples compare element by element — free multi-key ordering.',
      'That is why heap entries and sort keys are tuples.',
      'Add a unique counter so ties never reach an unorderable object.',
      'In grouping problems, choosing the derived key is the whole task.',
    ],
    practice: {
      prompt: 'Sort intervals by start, then by end, and note which problems need each. Then group words by `tuple(sorted(w))` and confirm it behaves like the string version.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-11.9',
    language: 'python',
    summary: 'Translate comparator thinking into Python key functions.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Coming from C++ or Java, you expect to write a comparator — a function of two arguments returning an ordering. Python deliberately dropped that in version 3 in favour of `key`, which is simpler and faster. Knowing how to translate between them is a useful skill.',
      },
      {
        kind: 'table',
        headers: ['Java / C++', 'Python'],
        rows: [
          ['`(a,b) -> a.age - b.age`', '`key=lambda p: p.age`'],
          ['`(a,b) -> b.age - a.age`', '`key=lambda p: -p.age`'],
          ['`comparingInt(A).thenComparing(B)`', '`key=lambda p: (p.A, p.B)`'],
          ['`comparingInt(A).reversed()`', '`key=lambda p: -p.A`'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Why `key` is faster',
        body: 'A comparator runs on every comparison — O(n log n) calls. A key function runs **once per element** — n calls — and the results are then compared directly. On large inputs that difference is measurable, which is why Python made the switch.',
      },
      { kind: 'heading', text: 'When a key genuinely cannot express the order' },
      {
        kind: 'text',
        body: 'Some orderings are relational rather than derived from a single value. The classic is Largest Number: sort strings so that `a + b > b + a`. There is no key you can compute per element that captures that — the order depends on the pair.',
      },
      {
        kind: 'code',
        caption: 'The escape hatch: functools.cmp_to_key',
        code: `from functools import cmp_to_key

def compare(a, b):
    if a + b > b + a: return -1      # a comes first
    if a + b < b + a: return 1       # b comes first
    return 0

nums = sorted(map(str, nums), key=cmp_to_key(compare))
return "".join(nums).lstrip("0") or "0"`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: '`cmp_to_key` is slower — use it only when needed',
        body: 'It wraps each element in a comparison object, restoring the per-comparison cost `key` was designed to avoid. Reach for it only when the order genuinely depends on pairs, as in Largest Number or Reorganise by relative rank.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The comparator contract is the same everywhere',
        body: 'Negative means the first argument comes first; zero is a tie; positive means the second comes first. Identical to Java\'s `compare` and C++\'s strict-weak ordering — so the reasoning transfers directly.',
      },
      {
        kind: 'text',
        body: 'In practice, ninety-nine problems in a hundred are expressible with `key`. Learn `cmp_to_key` so you recognise it, and reach for a tuple key first every time.',
      },
    ],
    keyTakeaways: [
      'Python replaced comparators with `key` — simpler and faster.',
      'A key runs once per element; a comparator runs per comparison.',
      '`functools.cmp_to_key` restores comparator behaviour when needed.',
      'Negative means the first argument sorts first, as in Java and C++.',
    ],
    practice: {
      prompt: 'Solve Largest Number with `cmp_to_key`. Then try to express the same order with a plain `key` and convince yourself it cannot be done.',
      leetcode: { title: 'Largest Number', slug: 'largest-number' },
    },
  },
];
