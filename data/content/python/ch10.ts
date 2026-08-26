import type { Lesson } from '../types';

/**
 * Python Chapter 10 — Heap and Priority Queue.
 * heapq is a module of functions over a plain list, not a class. That surprises
 * people, and the max-heap negation trick is where most bugs live.
 */
export const ch10: Lesson[] = [
  // -------------------------------------------------------------------------
  {
    topicId: 'python-10.1',
    language: 'python',
    summary: 'Understand what a heap is and why it beats sorting for repeated minimums.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'A heap answers one question extremely well: **what is the smallest element right now?** It gives you that in O(1), and lets you add an element or remove the smallest in O(log n) — without ever sorting the whole collection, which would cost O(n log n) every time the data changed.',
      },
      {
        kind: 'text',
        body: 'The structure is a **complete binary tree** obeying one rule: every parent is ≤ both children. That is a far weaker promise than sorting — siblings are in no order at all — and the weakness is exactly why it is cheap to maintain.',
      },
      {
        kind: 'code',
        caption: 'A valid min-heap',
        code: `        1
      /   \\
     3     2         Parent <= children everywhere.
    / \\   /          3 > 2 is fine — siblings need no order.
   5   4 6

As a flat list, level by level:  [1, 3, 2, 5, 4, 6]

For index i:  left  = 2i + 1
              right = 2i + 2
              parent = (i - 1) // 2`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'A heap is a list, not a tree of objects',
        body: 'Because the tree is always complete, a child\'s position is pure arithmetic — no node objects, no pointers. That is why `heapq` operates directly on an ordinary Python list rather than giving you a class.',
      },
      {
        kind: 'table',
        headers: ['Operation', 'Sorted list', 'Heap'],
        rows: [
          ['Find minimum', 'O(1)', 'O(1)'],
          ['Remove minimum', 'O(n) — shifts', '**O(log n)**'],
          ['Insert', 'O(n) — find and shift', '**O(log n)**'],
          ['Build from n items', 'O(n log n)', '**O(n)**'],
          ['Full ordering', 'Yes', '**No**'],
        ],
      },
      {
        kind: 'text',
        body: 'The trade is deliberate: give up knowing the complete order, gain cheap insertion and minimum-removal. When a problem repeatedly wants the extreme element while data keeps arriving, that is exactly the right bargain.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Only `heap[0]` is meaningful',
        body: 'Printing the list shows a jumble — that is correct, not a bug. Anything beyond index 0 has no guaranteed position, so never index into a heap expecting sorted order.',
      },
    ],
    keyTakeaways: [
      'A heap gives O(1) minimum access and O(log n) insert/remove.',
      'It is a complete binary tree stored as a flat list.',
      'Siblings are unordered — only parent-vs-child is promised.',
      'Only `heap[0]` is guaranteed; the rest of the list looks random.',
    ],
    practice: {
      prompt: 'Draw `[1, 3, 2, 5, 4, 6]` as a tree using the index formulas and check the heap property at every node. Doing it on paper once makes the list representation permanent.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-10.2',
    language: 'python',
    summary: 'Use the heapq module, which works on a plain list rather than a class.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Python has no `Heap` class. `heapq` is a **module of functions** that operate on an ordinary list you own — which surprises everyone at first, and then turns out to be convenient, because every list method still works.',
      },
      {
        kind: 'code',
        code: `import heapq

heap = []                        # just a list

heapq.heappush(heap, 3)          # O(log n)
heapq.heappush(heap, 1)
heapq.heappush(heap, 2)

heap[0]                          # 1 — peek, O(1). No function needed.
heapq.heappop(heap)              # 1 — remove smallest, O(log n)
len(heap)
while heap: ...                  # emptiness test, as with any list`,
      },
      {
        kind: 'table',
        headers: ['Function', 'Does', 'Cost'],
        rows: [
          ['`heappush(h, x)`', 'Insert', 'O(log n)'],
          ['`heappop(h)`', 'Remove and return the smallest', 'O(log n)'],
          ['`h[0]`', 'Peek — plain indexing', '**O(1)**'],
          ['`heapify(h)`', 'Turn a list into a heap in place', '**O(n)**'],
          ['`heappushpop(h, x)`', 'Push then pop', 'O(log n), one pass'],
          ['`heapreplace(h, x)`', 'Pop then push', 'O(log n), one pass'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'There is no `heappeek` — use `heap[0]`',
        body: 'People search the module for a peek function and do not find one, because plain indexing already does the job in O(1). Just remember to check the heap is non-empty first: `heap[0]` on an empty list raises `IndexError`.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'The functions do not check that your list is a heap',
        body: '`heappop` on an arbitrary unsorted list returns `list[0]` and then corrupts the structure — silently, with no error. If you built the list yourself, call `heapify` before using any heap function on it.',
      },
      {
        kind: 'code',
        caption: 'heapify is the cheap way to start',
        code: `nums = [5, 1, 4, 2, 3]
heapq.heapify(nums)          # in place, O(n) — cheaper than 5 pushes
print(nums[0])               # 1

# heapify returns None — it mutates. This is a classic slip:
nums = heapq.heapify(nums)   # nums is now None!`,
        output: '1',
      },
    ],
    keyTakeaways: [
      '`heapq` is functions over a plain list — there is no heap class.',
      'Peek with `heap[0]`; there is no `heappeek`.',
      '`heapify` is O(n) and mutates in place, returning `None`.',
      'The functions assume the heap property — call `heapify` first if unsure.',
    ],
    practice: {
      prompt: 'Push 5, 1, 3 and print the list — note it is not sorted. Then write `nums = heapq.heapify(nums)` and watch `nums` become `None`; that slip costs people real time.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-10.3',
    language: 'python',
    summary: 'Work with the min-heap behaviour Python gives you by default.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: '`heapq` is a **min-heap**, always. The smallest element sits at `heap[0]` and comes out first. There is no option, no comparator parameter, and no max-heap variant — which shapes everything else in this chapter.',
      },
      {
        kind: 'code',
        code: `import heapq

heap = []
for x in [5, 1, 3]:
    heapq.heappush(heap, x)

heapq.heappop(heap)      # 1 — smallest
heapq.heappop(heap)      # 3
heapq.heappop(heap)      # 5`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'No `key` parameter, unlike `sorted`',
        body: '`sorted(items, key=...)` works; `heapq.heappush(heap, item, key=...)` does not exist. To order by something other than the natural value you must push **tuples** whose first element is the sort key, or define `__lt__` on your class.',
      },
      {
        kind: 'code',
        caption: 'Ordering by a key, using tuples',
        code: `# Order tasks by priority: put the key FIRST in the tuple
heapq.heappush(heap, (priority, task_name))

priority, name = heapq.heappop(heap)     # smallest priority first`,
      },
      {
        kind: 'text',
        body: 'Tuples compare element by element, so `(1, "b")` sorts before `(2, "a")` — the first element decides, and later ones only break ties. That is exactly the behaviour a priority queue needs.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Tie-breaking can raise TypeError',
        body: 'If two tuples have equal first elements, Python compares the second. When that is a custom object with no `__lt__`, you get `TypeError: \'<\' not supported`. Insert a unique counter as a second element — `(priority, counter, obj)` — to guarantee the tie is broken before reaching the object.',
      },
      {
        kind: 'code',
        code: `import itertools
counter = itertools.count()          # 0, 1, 2, ...

heapq.heappush(heap, (priority, next(counter), task))
# the counter is unique, so the third element is never compared`,
      },
    ],
    keyTakeaways: [
      '`heapq` is min-only — `heap[0]` is always the smallest.',
      'There is no `key` parameter; push tuples with the key first.',
      'Tuples compare element by element, which is exactly what a priority queue wants.',
      'Add a unique counter to stop ties from comparing unorderable objects.',
    ],
    practice: {
      prompt: 'Push `(2, "b")` and `(1, "a")` and confirm the order. Then push two tuples with equal first elements and a custom object third — read the `TypeError`, then fix it with a counter.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-10.4',
    language: 'python',
    summary: 'Simulate a max-heap by negating, and avoid the bug that causes.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Because `heapq` is min-only, a max-heap needs a trick: **negate on the way in, negate again on the way out**. Negating flips the order, so the largest value becomes the smallest negative and rises to the top.',
      },
      {
        kind: 'code',
        code: `import heapq

max_heap = []

for x in [5, 1, 3]:
    heapq.heappush(max_heap, -x)      # negate GOING IN

largest = -heapq.heappop(max_heap)    # negate COMING OUT
print(largest)                        # 5

peek = -max_heap[0]                   # peeking needs it too`,
        output: '5',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Forgetting the second negation',
        body: 'This is the single most common `heapq` bug. Negating on push but not on pop gives you `-5` where you wanted `5` — right magnitude, wrong sign. Negating on neither silently gives you a min-heap that you believe is a max-heap, which is far harder to spot.',
      },
      {
        kind: 'code',
        caption: 'Negating tuples — negate the key only',
        code: `# Max-heap by frequency
heapq.heappush(heap, (-freq, word))       # negate the KEY

neg_freq, word = heapq.heappop(heap)
freq = -neg_freq                          # restore it`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Do not negate a string or a non-numeric key',
        body: '`-"abc"` raises `TypeError`. When the sort key is text and you need descending order, either use `sorted(..., reverse=True)` instead of a heap, or map the strings to numbers first.',
      },
      {
        kind: 'table',
        headers: ['Want', 'Push', 'Pop'],
        rows: [
          ['Min-heap', '`heappush(h, x)`', '`heappop(h)`'],
          ['Max-heap', '`heappush(h, -x)`', '`-heappop(h)`'],
          ['Min by key', '`heappush(h, (key, x))`', '`heappop(h)`'],
          ['Max by key', '`heappush(h, (-key, x))`', 'negate the key back'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'For a one-off answer, use nlargest instead',
        body: 'If you only need the k biggest once — not a live max-heap — `heapq.nlargest(k, nums)` does it with no negation and no chance of a sign bug. Reserve the negation trick for when you genuinely need to push and pop repeatedly.',
      },
    ],
    keyTakeaways: [
      'Max-heap = negate on push **and** on pop.',
      'The missing second negation is the classic `heapq` bug.',
      'For tuples, negate only the sort key.',
      'Non-numeric keys cannot be negated — use `sorted(reverse=True)`.',
    ],
    practice: {
      prompt: 'Build a max-heap of five numbers and pop them all. Then deliberately drop the negation on pop and watch every answer come back negative — seeing it once fixes the habit.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-10.5',
    language: 'python',
    summary: 'Use heappush and heappop correctly, and know the combined forms.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'These two functions carry every heap algorithm you will write. Both are O(log n), and both mutate the list in place rather than returning a new one — `heappush` returns `None`, `heappop` returns the element it removed.',
      },
      {
        kind: 'code',
        code: `import heapq

heap = []
heapq.heappush(heap, 3)      # returns None — mutates 'heap'
smallest = heapq.heappop(heap)   # returns the element`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: '`heap = heapq.heappush(heap, x)` destroys your heap',
        body: '`heappush` returns `None`, so that assignment sets `heap` to `None` and the next call raises `TypeError`. The same applies to `heapify`. Call them as statements, never as expressions.',
      },
      {
        kind: 'text',
        body: 'Internally, `heappush` appends to the end and **bubbles up**, swapping with the parent while it is smaller. `heappop` takes `heap[0]`, moves the last element into the root, and **bubbles down**. Each walks one root-to-leaf path — hence O(log n).',
      },
      {
        kind: 'code',
        caption: 'The two combined forms',
        code: `heapq.heappushpop(heap, x)   # push x, then pop — ONE pass
heapq.heapreplace(heap, x)   # pop, then push x — ONE pass

# They differ when x is smaller than the current root:
#   heappushpop returns x itself (it never really enters)
#   heapreplace returns the OLD root, and x does enter`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Use `heappushpop` for bounded heaps',
        body: 'In a size-k heap, `heappushpop` is faster than a separate push and pop — it does one sift instead of two. In a Top-K loop that runs n times, that is a real saving for a one-word change.',
      },
      {
        kind: 'code',
        caption: 'The safe drain loop',
        code: `while heap:                       # guard — heappop on empty raises IndexError
    x = heapq.heappop(heap)
    process(x)`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: '`heapreplace` on an empty heap raises',
        body: 'It pops first, so there must be something there. `heappushpop` pushes first and is safe on an empty heap. When in doubt, prefer `heappushpop`.',
      },
    ],
    keyTakeaways: [
      'Both mutate in place; `heappush` returns `None`.',
      'Never assign the result of `heappush` or `heapify`.',
      '`heappushpop` = push then pop; `heapreplace` = pop then push.',
      '`heapreplace` needs a non-empty heap; `heappushpop` does not.',
    ],
    practice: {
      prompt: 'Write `heap = heapq.heappush(heap, 1)` and watch the next call fail. Then compare `heappushpop` and `heapreplace` on a heap whose root is larger than the value you push.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-10.6',
    language: 'python',
    summary: 'Use heapify to build a heap in linear time.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'When you already hold all the data, `heapify` rearranges the list into a valid heap **in place, in O(n)** — cheaper than pushing each element separately, which would be O(n log n).',
      },
      {
        kind: 'code',
        code: `import heapq

nums = [5, 1, 4, 2, 3]
heapq.heapify(nums)        # O(n), in place
print(nums[0])             # 1 — smallest is now at the front

# Compare with the naive build:
heap = []
for x in [5, 1, 4, 2, 3]:
    heapq.heappush(heap, x)     # O(n log n) total`,
        output: '1',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Why building is O(n), not O(n log n)',
        body: 'Heapify sifts down from the middle of the list to the front. Most elements are near the bottom of the tree and have almost no distance to sink — only the few near the root can travel far. Summed up, the total work is linear, which is a genuinely surprising and quotable result.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: '`heapify` returns None',
        body: 'It mutates the list you pass. `nums = heapq.heapify(nums)` sets `nums` to `None` and every later heap call fails with a confusing `TypeError`. Call it as a statement.',
      },
      {
        kind: 'code',
        caption: 'Where it matters in practice',
        code: `# Heap sort — though sorted() is faster in practice
def heap_sort(nums):
    heapq.heapify(nums)
    return [heapq.heappop(nums) for _ in range(len(nums))]

# Starting Dijkstra or a merge from existing data
pq = [(0, start)]
heapq.heapify(pq)          # trivial here, but the habit is right

# Turning a dict into a heap of pairs
heap = [(-count, word) for word, count in freq.items()]
heapq.heapify(heap)        # O(n) — then pop k times for top-k`,
      },
      {
        kind: 'text',
        body: 'That last pattern is worth noting: for "top k of n" you can either keep a bounded heap of size k as you scan (O(n log k)), or heapify everything and pop k times (O(n + k log n)). When k is close to n the second wins; when k is tiny the first does.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Heapify destroys the original order',
        body: 'It rearranges the list you gave it. If you still need the original ordering, heapify a copy: `heap = nums[:]` then `heapq.heapify(heap)`.',
      },
    ],
    keyTakeaways: [
      '`heapify` builds a heap in O(n), beating n pushes at O(n log n).',
      'It mutates in place and returns `None`.',
      'It destroys the original order — copy first if you need it.',
      'Heapify-then-pop-k competes with a bounded heap when k is large.',
    ],
    practice: {
      prompt: 'Time `heapify` on 100,000 elements against a loop of `heappush`. Then heapify a list you still need elsewhere and watch the original order disappear.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-10.7',
    language: 'python',
    summary: 'Solve the Top-K family with a bounded heap.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Top-K problems — "the k largest", "the k most frequent", "the k closest" — all yield to one trick: **keep a heap of exactly k elements, ordered the "wrong" way round**. It takes a moment to accept and then solves the whole family.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'For the k LARGEST, use a MIN-heap of size k',
        body: 'The heap holds the k biggest seen so far, and its root is the *smallest of those* — the weakest survivor. When something bigger arrives, evict the root. What remains is exactly the top k, and the root is the kth largest.',
      },
      {
        kind: 'code',
        caption: 'The template',
        code: `import heapq

def k_largest(nums, k):
    heap = []                          # MIN-heap

    for x in nums:
        heapq.heappush(heap, x)
        if len(heap) > k:
            heapq.heappop(heap)        # drop the smallest survivor

    return heap                        # the k largest; heap[0] is the kth`,
      },
      {
        kind: 'text',
        body: 'The complexity is the point. Sorting everything is O(n log n); this is **O(n log k)** because the heap never exceeds k. With n = 10⁶ and k = 10 that is a large win — and it works on a stream, where sorting is impossible because you never hold all the data at once.',
      },
      {
        kind: 'table',
        headers: ['You want', 'Heap type', 'Root is'],
        rows: [
          ['k **largest**', '**Min**-heap of size k', 'The kth largest'],
          ['k **smallest**', '**Max**-heap of size k (negate)', 'The kth smallest'],
        ],
      },
      {
        kind: 'code',
        caption: 'Top K Frequent Elements',
        code: `from collections import Counter
import heapq

def top_k_frequent(nums, k):
    freq = Counter(nums)

    heap = []                                    # (count, value)
    for value, count in freq.items():
        heapq.heappush(heap, (count, value))
        if len(heap) > k:
            heapq.heappop(heap)

    return [value for count, value in heap]`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Or just use nlargest',
        body: '`heapq.nlargest(k, freq, key=freq.get)` does the same thing in one line, and unlike `heappush` it *does* accept a `key`. For a one-off answer prefer it; write the loop when you need a live heap that keeps updating.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Push then trim — in that order',
        body: 'Push the element, *then* pop if the size exceeds k. Checking "is it bigger than the root?" first also works but needs a separate empty-heap case. The push-then-trim form has no special cases, and `heappushpop` makes it a single operation once the heap is full.',
      },
    ],
    keyTakeaways: [
      'k largest → min-heap of size k; k smallest → max-heap of size k.',
      'The root is both the kth element and the eviction candidate.',
      'O(n log k) beats sorting and works on streams.',
      '`nlargest`/`nsmallest` accept a `key` and are best for one-off answers.',
    ],
    practice: {
      prompt: 'Solve Top K Frequent Elements with a bounded heap, then again with `nlargest`. Then explain out loud why a *min*-heap gives the k *largest* — if you can, you own the pattern.',
      leetcode: { title: 'Top K Frequent Elements', slug: 'top-k-frequent-elements' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-10.8',
    language: 'python',
    summary: 'Find the kth largest or smallest, and know when a heap is not the best tool.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: '"Find the kth largest" is the purest Top-K problem, and it has three good solutions with genuinely different trade-offs. Knowing all three is exactly what an interviewer is checking for.',
      },
      {
        kind: 'code',
        caption: '1. Bounded min-heap — O(n log k)',
        code: `import heapq

def find_kth_largest(nums, k):
    heap = []
    for x in nums:
        heapq.heappush(heap, x)
        if len(heap) > k:
            heapq.heappop(heap)
    return heap[0]`,
      },
      {
        kind: 'code',
        caption: '2. Sort or nlargest — O(n log n), one line',
        code: `return sorted(nums)[-k]
# or
return heapq.nlargest(k, nums)[-1]`,
      },
      {
        kind: 'code',
        caption: '3. Quickselect — O(n) average',
        code: `import random

def quickselect(nums, k):
    """kth LARGEST -> the (len-k)th smallest, 0-indexed."""
    target = len(nums) - k

    def helper(lo, hi):
        pivot = nums[random.randint(lo, hi)]     # random pivot avoids O(n^2)
        # ... partition into < pivot, == pivot, > pivot, then recurse ONE side
    return helper(0, len(nums) - 1)`,
      },
      {
        kind: 'table',
        headers: ['Approach', 'Time', 'Space', 'Use when'],
        rows: [
          ['Bounded heap', 'O(n log k)', 'O(k)', 'k small, or a stream'],
          ['Sort', 'O(n log n)', 'O(n)', 'k near n, or clarity matters'],
          ['Quickselect', 'O(n) avg', 'O(1)', 'You want optimal and can mutate'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'What to say in an interview',
        body: 'Offer the heap first — O(n log k), easy to write correctly, handles streams. Then mention quickselect as the O(n)-average option, noting its O(n²) worst case (mitigated by a random pivot) and that it mutates the input. Naming the trade-offs matters more than picking one.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Off-by-one between "kth largest" and list indices',
        body: 'The kth largest of a sorted ascending list is `nums[-k]`, equivalently `nums[len(nums) - k]`. Writing `nums[k]` or `nums[-k-1]` gives a neighbouring element — plausible-looking and wrong. Check it against a tiny example every time.',
      },
      {
        kind: 'text',
        body: '"K closest points to the origin" is the same template with a different key: order by squared distance and keep a max-heap of size k, evicting the farthest. Only the definition of "worst" changes — and use *squared* distance, since the square root is a needless cost that does not change the ordering.',
      },
    ],
    keyTakeaways: [
      'Three solutions: bounded heap, sort, quickselect.',
      'The heap is O(n log k) and stream-friendly; quickselect is O(n) average.',
      'kth largest of an ascending list is `nums[-k]`.',
      '"K closest" is the same template — compare squared distances.',
    ],
    practice: {
      prompt: 'Solve Kth Largest Element three ways and check they agree on `[3,2,1,5,6,4], k=2`. Then solve K Closest Points to Origin with a bounded heap.',
      leetcode: { title: 'Kth Largest Element in an Array', slug: 'kth-largest-element-in-an-array' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-10.9',
    language: 'python',
    summary: 'Recognise where heaps power greedy algorithms and graph search.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Beyond Top-K, heaps appear wherever an algorithm repeatedly asks "what is the best option available right now?". That is the shape of most greedy algorithms and of Dijkstra\'s shortest path.',
      },
      { kind: 'heading', text: 'Dijkstra — BFS with a priority queue' },
      {
        kind: 'code',
        code: `import heapq

def dijkstra(n, adj, start):
    dist = [float("inf")] * n
    dist[start] = 0
    pq = [(0, start)]                    # (distance, node)

    while pq:
        d, u = heapq.heappop(pq)

        if d > dist[u]:
            continue                     # stale entry — already improved

        for v, w in adj[u]:
            if d + w < dist[v]:          # relax
                dist[v] = d + w
                heapq.heappush(pq, (dist[v], v))

    return dist`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The lazy-deletion pattern',
        body: '`heapq` cannot decrease a key, so rather than updating an entry you push a new, better one and skip the stale copy when it surfaces: `if d > dist[u]: continue`. The heap may grow to E entries, which is fine, and this is the standard Python Dijkstra.',
      },
      { kind: 'heading', text: 'Greedy scheduling' },
      {
        kind: 'code',
        caption: 'Meeting Rooms II — how many rooms at the busiest moment?',
        code: `import heapq

def min_meeting_rooms(intervals):
    intervals.sort()                     # by start time
    end_times = []                       # min-heap of end times

    for start, end in intervals:
        # the earliest-finishing room is free again if it ended before this start
        if end_times and end_times[0] <= start:
            heapq.heappop(end_times)
        heapq.heappush(end_times, end)

    return len(end_times)                # rooms in use at the peak`,
      },
      {
        kind: 'text',
        body: 'The heap holds the end times of rooms currently in use, and its root is the one freeing up soonest — exactly the question the greedy step asks. The same shape solves Task Scheduler, IPO, and Minimum Cost to Connect Sticks.',
      },
      {
        kind: 'table',
        headers: ['Problem', 'What the heap holds', 'Root means'],
        rows: [
          ['Dijkstra', '`(dist, node)`', 'Cheapest frontier node'],
          ['Meeting Rooms II', 'End times', 'Room freeing up soonest'],
          ['Merge K Sorted Lists', 'Head of each list', 'Smallest unmerged value'],
          ['Connect Sticks', 'Stick lengths', 'Two cheapest to join'],
          ['Find Median from Stream', 'Two heaps', 'The middle of the data'],
        ],
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'A heap makes greedy fast, not correct',
        body: 'It only speeds up "pick the best option". Whether picking greedily yields the optimum is a separate argument you still have to make — and for problems like Coin Change with coins `{1,3,4}` it simply does not hold. Establish correctness first, then reach for the heap.',
      },
      {
        kind: 'code',
        caption: 'Merge K Sorted Lists — the whole insight',
        code: `import heapq

def merge_k(lists):
    heap = []
    for i, node in enumerate(lists):
        if node:
            heapq.heappush(heap, (node.val, i, node))   # i breaks ties

    dummy = tail = ListNode(0)
    while heap:
        _, i, node = heapq.heappop(heap)
        tail.next = node; tail = node

        if node.next:
            heapq.heappush(heap, (node.next.val, i, node.next))

    return dummy.next`,
      },
    ],
    keyTakeaways: [
      'Heaps power any algorithm that repeatedly asks "what is best right now?".',
      'Python Dijkstra uses lazy deletion: push improvements, skip stale entries.',
      'Greedy scheduling keeps end times in a heap; the root frees up soonest.',
      'Add an index to heap tuples so ties never compare unorderable objects.',
    ],
    practice: {
      prompt: 'Implement Dijkstra with the stale-entry skip, then Merge K Sorted Lists. Note the index in the tuple — remove it and see the `TypeError` when two nodes have equal values.',
      leetcode: { title: 'Merge k Sorted Lists', slug: 'merge-k-sorted-lists' },
    },
  },
];
