import type { Lesson } from '../types';

/**
 * Python Chapter 8 — Built-in DSA Containers.
 * The single highest-leverage chapter in the Python track: choosing the right
 * built-in is usually the whole optimisation.
 */
export const ch08: Lesson[] = [
  // -------------------------------------------------------------------------
  {
    topicId: 'python-8.1',
    language: 'python',
    summary: 'Understand the list as a dynamic array, and what each operation really costs.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'A Python list is a **dynamic array**: a contiguous block of slots that Python quietly grows when it fills up. That one implementation fact explains its entire cost model — cheap at the end, expensive at the front, instant to index.',
      },
      {
        kind: 'table',
        headers: ['Operation', 'Cost', 'Why'],
        rows: [
          ['`nums[i]`', 'O(1)', 'Direct offset into the block'],
          ['`nums.append(x)`', 'O(1)*', 'Write to the next free slot'],
          ['`nums.pop()`', 'O(1)', 'Drop the last slot'],
          ['`nums.insert(0, x)`', '**O(n)**', 'Everything shifts right'],
          ['`nums.pop(0)`', '**O(n)**', 'Everything shifts left'],
          ['`x in nums`', '**O(n)**', 'Linear scan'],
          ['`nums.remove(x)`', '**O(n)**', 'Find it, then shift'],
          ['`len(nums)`', 'O(1)', 'Stored, not counted'],
        ],
      },
      {
        kind: 'text',
        body: '*`append` is *amortised* O(1). Occasionally the block is full and Python allocates a bigger one and copies everything — but it over-allocates, so that cost spread across all the appends is constant.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: '`pop(0)` in a loop is the classic Python timeout',
        body: 'Using a list as a queue — `append` to add, `pop(0)` to remove — makes every removal O(n), so a BFS over 10⁵ nodes becomes 10¹⁰ operations. Use `collections.deque`, whose `popleft` is genuinely O(1). This single mistake accounts for a large share of TLE verdicts in Python.',
      },
      {
        kind: 'code',
        caption: 'The same loop, 1000x apart',
        code: `# SLOW — O(n) per removal
queue = [1, 2, 3]
while queue:
    node = queue.pop(0)          # shifts everything left

# FAST — O(1) per removal
from collections import deque
queue = deque([1, 2, 3])
while queue:
    node = queue.popleft()`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Preallocate when you know the size',
        body: '`dp = [0] * n` builds the whole list at once instead of appending n times, and it is how you set up a DP table or a `visited` array. For 2-D use `[[0] * n for _ in range(m)]` — never `[[0] * n] * m`, which shares one row m times.',
      },
    ],
    keyTakeaways: [
      'A list is a dynamic array: O(1) at the end, O(n) at the front.',
      '`x in list` is O(n) — use a set when you are testing membership repeatedly.',
      '`pop(0)` in a loop is the most common Python performance bug.',
      '`[0] * n` preallocates; `[[0] * n for _ in range(m)]` builds a safe grid.',
    ],
    practice: {
      prompt: 'Time `pop(0)` against `deque.popleft()` on 100,000 elements. The gap is not subtle, and seeing it once will stop you reaching for a list as a queue ever again.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-8.2',
    language: 'python',
    summary: 'Use deque for O(1) operations at both ends — the queue you actually want.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'A `deque` ("deck", double-ended queue) gives O(1) insertion and removal at **both** ends. It is implemented as a linked list of blocks rather than one contiguous array, which is exactly the trade: you lose fast random indexing, you gain a genuinely fast front.',
      },
      {
        kind: 'code',
        code: `from collections import deque

dq = deque([1, 2, 3])

dq.append(4)         # add at the RIGHT   -> [1, 2, 3, 4]
dq.appendleft(0)     # add at the LEFT    -> [0, 1, 2, 3, 4]

dq.pop()             # remove from RIGHT  -> 4
dq.popleft()         # remove from LEFT   -> 0

dq[0]                # peek at the front — O(1)
dq[-1]               # peek at the back  — O(1)
len(dq)`,
      },
      {
        kind: 'table',
        headers: ['Operation', 'list', 'deque'],
        rows: [
          ['Append right', 'O(1)', 'O(1)'],
          ['Pop right', 'O(1)', 'O(1)'],
          ['Append left', '**O(n)**', '**O(1)**'],
          ['Pop left', '**O(n)**', '**O(1)**'],
          ['Index in the middle', '**O(1)**', '**O(n)**'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Use a deque for BFS, always',
        body: 'BFS adds at one end and removes at the other, which is precisely the deque\'s strength. `queue = deque([start])` then `queue.popleft()` is the standard Python BFS. Reaching for a plain list here is the difference between passing and timing out.',
      },
      {
        kind: 'code',
        caption: 'The BFS skeleton',
        code: `from collections import deque

def bfs(start, adj):
    q = deque([start])
    visited = {start}                # mark on ENQUEUE

    while q:
        node = q.popleft()           # O(1)

        for nxt in adj[node]:
            if nxt not in visited:
                visited.add(nxt)
                q.append(nxt)`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Indexing the middle of a deque is O(n)',
        body: '`dq[0]` and `dq[-1]` are fast, but `dq[n // 2]` walks the blocks. If your algorithm needs random access, you want a list — the two containers are complements, not one strictly better than the other.',
      },
      {
        kind: 'code',
        caption: 'Two more things it does well',
        code: `dq.rotate(1)                 # shift everything right by one
dq.rotate(-1)                # ...and left

window = deque(maxlen=3)     # bounded: adding a 4th drops the oldest
for x in [1, 2, 3, 4]:
    window.append(x)
print(list(window))          # [2, 3, 4]`,
        output: '[2, 3, 4]',
      },
    ],
    keyTakeaways: [
      '`deque` is O(1) at both ends; a list is O(n) at the front.',
      'It is the correct container for BFS and for sliding-window maxima.',
      'Middle indexing is O(n) — use a list when you need random access.',
      '`maxlen` gives you a fixed-size window that evicts automatically.',
    ],
    practice: {
      prompt: 'Write a BFS over a small graph using `deque`. Then swap it for a list with `pop(0)` and confirm the output is identical — the difference is purely speed, which is what makes the bug so easy to miss.',
      leetcode: { title: 'Binary Tree Level Order Traversal', slug: 'binary-tree-level-order-traversal' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-8.3',
    language: 'python',
    summary: 'Use defaultdict to delete the "does this key exist yet?" boilerplate.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Half the dict code beginners write is the same three lines: check whether a key exists, create it with an empty value if not, then use it. A `defaultdict` takes a **factory** — a function producing the default — and does all of that automatically.',
      },
      {
        kind: 'code',
        code: `from collections import defaultdict

d = defaultdict(int)      # missing key -> 0
d = defaultdict(list)     # missing key -> []
d = defaultdict(set)      # missing key -> set()
d = defaultdict(lambda: -1)   # any factory you like`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Pass the factory, not a value',
        body: '`defaultdict(list)` works because `list()` returns `[]`. Writing `defaultdict([])` or `defaultdict(list())` raises `TypeError: first argument must be callable or None` — you passed a value where a function was expected.',
      },
      {
        kind: 'code',
        caption: 'Where it earns its place',
        code: `# Grouping — four lines become one
groups = defaultdict(list)
for w in words:
    groups["".join(sorted(w))].append(w)

# Counting
counts = defaultdict(int)
for x in nums:
    counts[x] += 1

# Graph adjacency — no need to pre-create any node
adj = defaultdict(list)
for u, v in edges:
    adj[u].append(v)
    adj[v].append(u)`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Reading a missing key *inserts* it',
        body: '`if d[x] > 0:` on a defaultdict creates `x` with the default value as a side effect, growing the dict and corrupting any later `len()` or iteration. Use `if x in d:` to test without inserting. This is the one real cost of the convenience.',
      },
      {
        kind: 'code',
        code: `d = defaultdict(int)
print(len(d))          # 0
if d["missing"] > 0:   # inserts "missing" -> 0
    pass
print(len(d))          # 1  <- phantom key`,
        output: '0\n1',
      },
      {
        kind: 'text',
        body: 'A `defaultdict` is still a `dict` — every dict method works, and `dict(dd)` converts back when a problem insists on a plain dict as the return value.',
      },
    ],
    keyTakeaways: [
      '`defaultdict(factory)` supplies missing values automatically.',
      'Pass `list`, not `list()` — the factory is a function.',
      'Grouping becomes one line: `groups[key].append(x)`.',
      'Reading a missing key inserts it — test with `in`.',
    ],
    practice: {
      prompt: 'Solve Group Anagrams with `defaultdict(list)`, then rewrite it with a plain dict and explicit checks. Comparing the two side by side is the clearest case for the container.',
      leetcode: { title: 'Group Anagrams', slug: 'group-anagrams' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-8.4',
    language: 'python',
    summary: 'Use Counter — the biggest single advantage Python has in DSA.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'If there is one place Python simply beats C++ and Java for interviews, it is `Counter`. It counts an entire sequence in one call, compares two counts with `==`, and hands back the k most common items already sorted. Problems that take twenty lines in Java take three here.',
      },
      {
        kind: 'code',
        code: `from collections import Counter

c = Counter("hello")
print(c)                    # Counter({'l': 2, 'h': 1, 'e': 1, 'o': 1})
print(c["l"])               # 2
print(c["z"])               # 0 — missing keys return 0, no KeyError
print(c.most_common(2))     # [('l', 2), ('h', 1)]`,
        output: "Counter({'l': 2, 'h': 1, 'e': 1, 'o': 1})\n2\n0\n[('l', 2), ('h', 1)]",
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Anagram checking is one line',
        body: '`Counter(s) == Counter(t)` compares the full frequency maps directly. That is the entire solution to Valid Anagram — no sorting, no manual counting, O(n) rather than O(n log n).',
      },
      {
        kind: 'code',
        caption: 'The operations worth knowing',
        code: `a, b = Counter("aab"), Counter("abc")

a + b        # add counts     -> a:3 b:2 c:1
a - b        # subtract, keeping only POSITIVE counts -> a:1
a & b        # intersection: min of each -> a:1 b:1
a | b        # union: max of each        -> a:2 b:1 c:1

c.total()          # sum of all counts (Python 3.10+)
sum(c.values())    # the same, on any version
list(c.elements()) # expand back out to individual items`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: '`a - b` drops zero and negative counts',
        body: 'Counter subtraction is not arithmetic — it silently discards anything that would go to zero or below. If you need true signed differences, use `a.subtract(b)`, which mutates `a` in place and *does* keep negatives.',
      },
      {
        kind: 'code',
        caption: 'Problems it collapses',
        code: `# Valid Anagram
return Counter(s) == Counter(t)

# Top K Frequent Elements
return [x for x, _ in Counter(nums).most_common(k)]

# First unique character
c = Counter(s)
for i, ch in enumerate(s):
    if c[ch] == 1:
        return i
return -1

# Majority element
return Counter(nums).most_common(1)[0][0]`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: '`most_common` sorts, so it is O(n log n)',
        body: 'For "top k" that is usually fine. But if you only need the single most common item, `max(c, key=c.get)` is O(n) and avoids sorting the whole thing. Worth knowing when n is large.',
      },
    ],
    keyTakeaways: [
      '`Counter(seq)` counts everything in one call; missing keys give 0.',
      '`Counter(s) == Counter(t)` is a complete anagram check.',
      '`most_common(k)` returns the top k already sorted.',
      '`a - b` discards non-positive counts; use `subtract` to keep them.',
    ],
    practice: {
      prompt: 'Solve Valid Anagram and Top K Frequent Elements using only `Counter`. Both should be one or two lines — that compression is exactly why Python is a strong interview language.',
      leetcode: { title: 'Top K Frequent Elements', slug: 'top-k-frequent-elements' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-8.5',
    language: 'python',
    summary: 'Use heapq for priority queues, and simulate the max-heap Python does not give you.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'A heap keeps the **smallest element always at the front** for O(log n) insertion and removal — without keeping everything sorted, which would be far more expensive. Python\'s `heapq` operates on an ordinary list, so there is no heap class to construct; you just use the module functions on a list.',
      },
      {
        kind: 'code',
        code: `import heapq

heap = []
heapq.heappush(heap, 3)
heapq.heappush(heap, 1)
heapq.heappush(heap, 2)

print(heap[0])              # 1 — peek at the smallest, O(1)
print(heapq.heappop(heap))  # 1 — remove the smallest, O(log n)`,
        output: '1\n1',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'The list is a heap, not a sorted list',
        body: 'Only `heap[0]` is guaranteed to be the minimum. Printing the whole list shows a jumble — that is correct, not a bug. Never index into a heap expecting sorted order.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Python has no max-heap — negate instead',
        body: '`heapq` is min-only. For a max-heap, push `-x` and negate again on the way out. Forgetting the second negation is the classic bug, and it produces answers with the right magnitude and the wrong sign.',
      },
      {
        kind: 'code',
        caption: 'Max-heap by negation',
        code: `max_heap = []
for x in nums:
    heapq.heappush(max_heap, -x)     # negate going IN

largest = -heapq.heappop(max_heap)   # negate coming OUT`,
      },
      {
        kind: 'code',
        caption: 'Tuples for priority, and the tie-break trap',
        code: `# Sorts by the first element automatically
heapq.heappush(pq, (dist, node))
d, node = heapq.heappop(pq)

# If the first elements TIE, Python compares the second — so if that is an
# object with no __lt__, it raises TypeError. Add a counter to break ties:
counter = 0
heapq.heappush(pq, (priority, counter, task))
counter += 1`,
      },
      {
        kind: 'code',
        caption: 'The shortcuts',
        code: `heapq.heapify(nums)                  # turn a list into a heap IN PLACE, O(n)

heapq.nlargest(3, nums)              # top 3
heapq.nsmallest(3, nums)             # bottom 3
heapq.heappushpop(heap, x)           # push then pop — cheaper than doing both
heapq.heapreplace(heap, x)           # pop then push`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Kth largest: keep a min-heap of size k',
        body: 'Push everything; whenever the heap exceeds k, pop the smallest. What remains at `heap[0]` is the kth largest, in O(n log k) rather than O(n log n). This "bounded heap" trick is the answer to most Top-K problems.',
      },
    ],
    keyTakeaways: [
      '`heapq` is a min-heap over a plain list — only `heap[0]` is ordered.',
      'Negate on push *and* on pop to simulate a max-heap.',
      'Tuples sort by the first element; add a counter to avoid tie-break errors.',
      '`heapify` is O(n) — cheaper than pushing n times.',
    ],
    practice: {
      prompt: 'Solve Kth Largest Element with a bounded min-heap of size k. Then build a max-heap by negation and confirm you remembered to negate on the way out.',
      leetcode: { title: 'Kth Largest Element in an Array', slug: 'kth-largest-element-in-an-array' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-8.6',
    language: 'python',
    summary: 'Use bisect for binary search on sorted lists without writing the loop.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'The `bisect` module does binary search on an already-sorted list and hands you the **insertion point** — the index where a value would go to keep the list sorted. That single number answers far more questions than "is this present?", and it saves you from hand-writing a loop that is notoriously easy to get wrong.',
      },
      {
        kind: 'code',
        code: `from bisect import bisect_left, bisect_right, insort

a = [1, 3, 3, 5, 7]

bisect_left(a, 3)     # 1 — FIRST index where 3 could go (before existing 3s)
bisect_right(a, 3)    # 3 — LAST index where 3 could go (after them)
bisect_left(a, 4)     # 3 — 4 is absent; this is where it belongs

bisect_right(a, 3) - bisect_left(a, 3)   # 2 — how many 3s there are`,
      },
      {
        kind: 'table',
        headers: ['Question', 'Call'],
        rows: [
          ['First index with value ≥ x', '`bisect_left(a, x)`'],
          ['First index with value > x', '`bisect_right(a, x)`'],
          ['Is x present?', '`i = bisect_left(a, x); i < len(a) and a[i] == x`'],
          ['How many equal x', '`bisect_right(a, x) - bisect_left(a, x)`'],
          ['How many < x', '`bisect_left(a, x)`'],
          ['Largest value ≤ x', '`a[bisect_right(a, x) - 1]`'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: '`bisect_left` alone does not tell you if x exists',
        body: 'It returns an insertion point whether or not the value is present — for an absent value you still get a valid index. You must check `i < len(a) and a[i] == x`. Forgetting the bounds check causes an `IndexError` when x is larger than everything.',
      },
      {
        kind: 'code',
        caption: 'Inserting while keeping sorted order',
        code: `insort(a, 4)        # finds the position AND inserts -> [1, 3, 3, 4, 5, 7]

# Note: the search is O(log n) but the insert is O(n), because a list
# must shift everything right. Fine for small n; for heavy insertion
# workloads you want a different structure.`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'The list must already be sorted',
        body: '`bisect` does not check and does not sort. On unsorted input it returns confident nonsense with no error at all. Sorting first is O(n log n), which may or may not be worth it depending on how many queries follow.',
      },
      {
        kind: 'text',
        body: 'Python has no built-in `TreeMap`, so `bisect` on a sorted list is the usual stand-in for "find the nearest key" style questions — with the caveat that insertion is O(n) rather than O(log n).',
      },
    ],
    keyTakeaways: [
      '`bisect` returns an insertion point, not a found/not-found flag.',
      '`bisect_left` = first index ≥ x; `bisect_right` = first index > x.',
      'Their difference counts duplicates in O(log n).',
      'The list must already be sorted — `bisect` will not tell you otherwise.',
    ],
    practice: {
      prompt: 'Given a sorted list with duplicates, use `bisect` to find the first and last index of a target, then count occurrences. That is Search for a Range solved without writing a single binary-search loop.',
      leetcode: { title: 'Find First and Last Position of Element in Sorted Array', slug: 'find-first-and-last-position-of-element-in-sorted-array' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-8.7',
    language: 'python',
    summary: 'Use dict as the hash map behind more solutions than any other container.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A `dict` maps **keys to values** with O(1) average lookup. It sits behind more accepted solutions than any other container: frequency counts, "seen before and where?", graph adjacency, memoisation. If you master one container, make it this one.',
      },
      {
        kind: 'code',
        code: `d = {}
d["a"] = 1              # insert or overwrite — always works
d["a"]                  # 1
d["zz"]                 # KeyError! reading a missing key RAISES

d.get("zz")             # None — safe
d.get("zz", 0)          # 0 — safe with a default
"zz" in d               # False — the test that never inserts
d.pop("a", None)        # remove, with a fallback if absent`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Look before you insert, in Two Sum',
        body: 'Check whether the complement is already in the dict, and only then add the current element. That ordering is what stops an element pairing with itself, and it turns Two Sum into a single pass.',
      },
      {
        kind: 'code',
        caption: 'The one-pass Two Sum',
        code: `seen = {}                        # value -> index

for i, x in enumerate(nums):
    need = target - x

    if need in seen:             # look FIRST
        return [seen[need], i]

    seen[x] = i                  # then insert`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Keys must be hashable',
        body: 'Strings, numbers and tuples work as keys. Lists, sets and dicts do not — `d[[1,2]] = x` raises `TypeError: unhashable type: \'list\'`. Convert to a tuple: `d[(1,2)] = x`. This is why the anagram key is `"".join(sorted(w))` or `tuple(sorted(w))` rather than the sorted list itself.',
      },
      {
        kind: 'code',
        caption: 'The idioms worth having',
        code: `for k, v in d.items(): ...           # loop both at once
d.setdefault(k, []).append(x)        # like defaultdict, without importing

{k: v for k, v in d.items() if v > 1}    # dict comprehension
{v: k for k, v in d.items()}             # invert it

merged = {**d1, **d2}                # merge; d2 wins on conflicts
sorted(d.items(), key=lambda kv: -kv[1]) # by value, descending`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Insertion order is guaranteed, sorted order is not',
        body: 'Since Python 3.7 a dict preserves the order you inserted keys. That is *not* sorted order. If a problem wants results sorted by key, sort explicitly — do not rely on the dict.',
      },
    ],
    keyTakeaways: [
      '`d[k]` raises on a missing key; `d.get(k, default)` does not.',
      'Look before you insert in Two Sum, or an element pairs with itself.',
      'Keys must be hashable — tuples yes, lists no.',
      'Dicts preserve insertion order, not sorted order.',
    ],
    practice: {
      prompt: 'Solve Two Sum in one pass. Then try using a list as a dict key and read the `TypeError` — knowing that message on sight saves real time later.',
      leetcode: { title: 'Two Sum', slug: 'two-sum' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-8.8',
    language: 'python',
    summary: 'Use set for O(1) membership, and the algebra that comes free with it.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A `set` holds **unique** values and answers "is this in here?" in O(1). Swapping a list for a set when you are testing membership repeatedly is the single most reusable optimisation in beginner DSA — it is what turns a nested loop into one pass.',
      },
      {
        kind: 'code',
        code: `s = set()
s.add(1)
s.add(1)              # ignored — already there
len(s)                # 1

1 in s                # True — O(1)
s.discard(9)          # remove if present, no error if absent
s.remove(9)           # KeyError if absent

s = {1, 2, 3}         # literal
empty = set()         # NOT {} — that is an empty dict`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: '`{}` is an empty dict, not an empty set',
        body: 'Python gave the braces to dicts first. An empty set must be written `set()`. `{1, 2}` is a set, but `{}` is a dict — a genuinely confusing corner of the syntax.',
      },
      {
        kind: 'code',
        caption: 'Set algebra, which is often the whole answer',
        code: `a, b = {1, 2, 3}, {2, 3, 4}

a | b        # union         {1, 2, 3, 4}
a & b        # intersection  {2, 3}
a - b        # difference    {1}
a ^ b        # symmetric difference {1, 4}

a.issubset(b)
a.isdisjoint(b)          # no elements in common`,
      },
      {
        kind: 'text',
        body: 'Those operators turn several problems into one-liners. "Intersection of two arrays" is `list(set(a) & set(b))`. "Elements in a but not b" is `set(a) - set(b)`.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Deduplicate with `list(set(x))`',
        body: 'It is the shortest way to remove duplicates — but it **loses the order**. When order matters use `list(dict.fromkeys(x))`, which deduplicates while preserving first-seen order.',
      },
      {
        kind: 'code',
        caption: 'Where sets change the complexity',
        code: `# O(n^2) — 'in' on a list is a linear scan
seen = []
for x in nums:
    if x in seen: return True
    seen.append(x)

# O(n) — same shape, O(1) membership
seen = set()
for x in nums:
    if x in seen: return True
    seen.add(x)

# Or simply:
return len(set(nums)) < len(nums)`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Set elements must be hashable, and sets are unordered',
        body: 'You cannot put a list in a set — use a tuple. And iteration order is not insertion order and not sorted order; if you need either, convert and sort explicitly.',
      },
    ],
    keyTakeaways: [
      'A set gives O(1) membership versus O(n) for a list.',
      '`set()` is the empty set — `{}` is an empty dict.',
      '`|`, `&`, `-`, `^` solve intersection/difference problems in one line.',
      'Sets are unordered and need hashable elements.',
    ],
    practice: {
      prompt: 'Solve Contains Duplicate and Intersection of Two Arrays using sets only. Then solve Longest Consecutive Sequence — a set turns an O(n log n) sort into O(n), and it is the best demonstration of the container there is.',
      leetcode: { title: 'Longest Consecutive Sequence', slug: 'longest-consecutive-sequence' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-8.9',
    language: 'python',
    summary: 'Choose the right container in seconds, using the questions that decide it.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'This lesson closes the chapter with the decision procedure. On LeetCode, container choice is frequently the *entire* optimisation — the algorithm is unchanged and the verdict flips from Time Limit Exceeded to Accepted.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Five questions, in order',
        body: 'Do I need **key → value**? → `dict`. Do I only need **uniqueness / membership**? → `set`. Do I need **both ends fast**? → `deque`. Do I repeatedly need the **smallest or largest**? → `heapq`. Otherwise → `list`.',
      },
      {
        kind: 'table',
        headers: ['Problem shape', 'Container', 'Why'],
        rows: [
          ['Two Sum, "seen before"', '`dict`', 'Value → index in O(1)'],
          ['Contains duplicate', '`set`', 'Membership in O(1)'],
          ['Frequency counting', '`Counter`', 'One call, plus `most_common`'],
          ['Grouping by a key', '`defaultdict(list)`', 'No existence checks'],
          ['BFS / sliding window', '`deque`', 'O(1) at both ends'],
          ['Top K, Dijkstra, merge K', '`heapq`', 'O(log n) min extraction'],
          ['Binary search on sorted data', '`bisect`', 'No hand-written loop'],
          ['Collecting results', '`list`', 'Ordered, indexable'],
          ['Graph adjacency', '`defaultdict(list)`', 'Nodes appear on demand'],
        ],
      },
      { kind: 'heading', text: 'The complexity table worth memorising' },
      {
        kind: 'table',
        headers: ['Operation', 'list', 'deque', 'set / dict', 'heapq'],
        rows: [
          ['Index access', 'O(1)', 'O(n)', '—', '—'],
          ['Append / push', 'O(1)', 'O(1)', 'O(1)', 'O(log n)'],
          ['Pop from front', '**O(n)**', '**O(1)**', '—', '—'],
          ['Membership `in`', '**O(n)**', 'O(n)', '**O(1)**', 'O(n)'],
          ['Find minimum', 'O(n)', 'O(n)', 'O(n)', '**O(1)**'],
          ['Ordered?', 'insertion', 'insertion', 'insertion (dict)', 'no'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'The three mistakes that cause most Python timeouts',
        body: '**1.** `x in list` inside a loop — use a set. **2.** `list.pop(0)` as a queue — use a deque. **3.** `result += ch` building a string in a loop — collect in a list and `"".join` at the end. Each turns a linear algorithm quadratic.',
      },
      {
        kind: 'code',
        caption: 'The imports to type before you start',
        code: `from collections import deque, defaultdict, Counter
import heapq
from bisect import bisect_left, bisect_right`,
      },
      {
        kind: 'text',
        body: 'Getting these into muscle memory is worth the small effort. Between them they cover almost every container decision you will make in Phase 1, and each one exists precisely because the plain list is the wrong tool for that job.',
      },
    ],
    keyTakeaways: [
      'Five questions pick the container: map? unique? both ends? min/max? else list.',
      '`in` on a list is O(n) and on a set is O(1) — the highest-value single fact.',
      '`pop(0)` and string `+=` in loops are the other two classic timeouts.',
      'Learn the import line by heart; it covers nearly every Phase 1 problem.',
    ],
    practice: {
      prompt: 'Reproduce the complexity table from memory. Then take five problems you have solved and ask whether a different container would have been better — that review is what turns the table into instinct.',
    },
  },
];
