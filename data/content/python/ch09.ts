import type { Lesson } from '../types';

/**
 * Python Chapter 9 — Stack, Queue, and Deque.
 * A plain list is already a perfect stack; the queue is where Python punishes
 * the obvious choice, so that distinction gets the most space here.
 */
export const ch09: Lesson[] = [
  // -------------------------------------------------------------------------
  {
    topicId: 'python-9.1',
    language: 'python',
    summary: 'Understand LIFO, and recognise the problems that are secretly stack problems.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A stack is **last in, first out** — a stack of plates, where only the top one is reachable. That restriction sounds limiting until you notice how many problems need exactly it: anything where the most recent *unresolved* thing must be handled first.',
      },
      {
        kind: 'text',
        body: 'Matching brackets: an opening bracket stays unresolved until its partner arrives, and the most recent one must close first. Undo history. Function calls — the innermost returns first, which is why it is called the *call stack*. Expression evaluation, and the monotonic-stack family later in this chapter.',
      },
      {
        kind: 'code',
        caption: 'Valid Parentheses — the canonical stack problem',
        code: `def is_valid(s):
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []

    for ch in s:
        if ch in "([{":
            stack.append(ch)               # unresolved — remember it
        else:
            # a closer needs the MOST RECENT opener to match
            if not stack or stack.pop() != pairs[ch]:
                return False

    return not stack                       # anything left = unclosed`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The tell: "most recent" or "innermost"',
        body: 'If the problem cares about the nearest unresolved item — the closest opening bracket, the last greater element, the innermost nesting — that is a stack. Recognising that phrasing is worth more than memorising any single solution.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Check the stack is non-empty before popping',
        body: '`[].pop()` raises `IndexError: pop from empty list`. On input like `")"` there is a closer with nothing open. The `not stack or ...` guard above handles it — and short-circuiting means `pop()` never runs when the stack is empty.',
      },
      {
        kind: 'text',
        body: 'Notice that the guard relies on `or` short-circuiting: if `not stack` is true, Python never evaluates the second half. That is the same safety pattern you learned with `and` for array bounds, used in the opposite direction.',
      },
    ],
    keyTakeaways: [
      'A stack is LIFO — only the top is reachable.',
      'The tell is "most recent unresolved" or "innermost".',
      'A Python list is already a perfect stack.',
      'Guard with `if not stack` before popping, using short-circuiting.',
    ],
    practice: {
      prompt: 'Solve Valid Parentheses with the dict-of-pairs approach. Then feed it `")"` and `"("` — the two edge cases that break naive solutions.',
      leetcode: { title: 'Valid Parentheses', slug: 'valid-parentheses' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-9.2',
    language: 'python',
    summary: 'Use a plain list as a stack — Python needs nothing else.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'Python has no `Stack` class, and does not need one. A list already gives O(1) append and O(1) pop **at the end**, which is exactly a stack. This is one of the places where Python is genuinely simpler than Java or C++.',
      },
      {
        kind: 'code',
        code: `stack = []

stack.append(1)      # push — O(1)
stack.append(2)
stack.append(3)      # [1, 2, 3]

stack[-1]            # peek at the top -> 3, without removing
stack.pop()          # pop -> 3, list is now [1, 2]
len(stack)
not stack            # True when empty`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The top of the stack is the **end** of the list',
        body: '`stack[-1]` is the top, and `pop()` with no argument removes it. This is the opposite of what beginners often assume — index 0 is the *bottom*, the oldest element. Getting this right makes every stack problem read naturally.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Never use `pop(0)` for stack behaviour',
        body: '`pop(0)` removes from the front, which is O(n) *and* the wrong end for a stack. Bare `pop()` is the O(1) operation you want. Using `pop(0)` here gives you a slow queue when you meant a fast stack.',
      },
      {
        kind: 'text',
        body: 'Python also gives you emptiness testing for free: an empty list is falsy, so `while stack:` and `if not stack:` both read as English and are the idiomatic forms. Writing `len(stack) > 0` works but marks you as new to the language.',
      },
      {
        kind: 'code',
        caption: 'The idiomatic drain loop',
        code: `while stack:                 # not: while len(stack) > 0
    top = stack.pop()
    process(top)`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'A `deque` works too, but is not needed',
        body: '`deque` is O(1) at both ends, so it can be a stack — but a list is already O(1) at the end and slightly faster there. Use a list for stacks; save the deque for when you genuinely need the *front*.',
      },
    ],
    keyTakeaways: [
      'A list is a stack: `append` to push, `pop()` to pop, `[-1]` to peek.',
      'The top is the end of the list, not the front.',
      '`while stack:` is the idiomatic emptiness test.',
      'Never `pop(0)` — that is the slow end and the wrong one.',
    ],
    practice: {
      prompt: 'Implement a stack-based string reversal and a bracket matcher using only a list. Then try `pop(0)` instead of `pop()` and work out why the output is wrong before reading further.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-9.3',
    language: 'python',
    summary: 'Know exactly what append and pop cost, and where the exceptions come from.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'These two methods carry most of your stack code, so it is worth being precise about their behaviour — particularly the optional argument to `pop`, which quietly changes the complexity from O(1) to O(n).',
      },
      {
        kind: 'code',
        code: `nums = [1, 2, 3]

nums.append(4)       # add at the END — O(1) amortised
nums.pop()           # remove from the END — O(1), returns 4
nums.pop(0)          # remove from the FRONT — O(n), returns 1
nums.pop(1)          # remove at index 1 — O(n), everything shifts`,
      },
      {
        kind: 'table',
        headers: ['Call', 'Removes', 'Cost'],
        rows: [
          ['`pop()`', 'Last element', '**O(1)**'],
          ['`pop(-1)`', 'Last element (same thing)', 'O(1)'],
          ['`pop(0)`', 'First element', '**O(n)**'],
          ['`pop(i)`', 'Element at i', 'O(n)'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: '`pop` on an empty list raises `IndexError`',
        body: 'The message is `pop from empty list`. Guard with `if stack:` — and note that `pop(i)` with an out-of-range index raises the same error, which is the usual cause when you are popping by index inside a loop that also shrinks the list.',
      },
      {
        kind: 'text',
        body: '`append` is amortised O(1): occasionally the underlying array is full, so Python allocates a larger one and copies. Because it over-allocates, the cost averaged across all appends is constant.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: '`extend` beats `append` in a loop',
        body: 'To add many items, `a.extend(b)` is one call and one possible resize, where `for x in b: a.append(x)` pays the loop overhead each time. Same result, measurably faster.',
      },
      {
        kind: 'code',
        caption: 'The related methods',
        code: `a.extend([4, 5])      # append every element of another iterable
a += [4, 5]           # identical to extend
a.append([4, 5])      # DIFFERENT — appends the LIST as one element

a.insert(0, x)        # O(n) — prefer deque.appendleft if you do this often
a.remove(x)           # remove first occurrence BY VALUE — O(n), ValueError if absent
del a[0]              # remove by index, no return value
a.clear()`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: '`append` and `extend` are not interchangeable',
        body: '`a.append([4, 5])` makes the list itself a single element, giving `[1, 2, 3, [4, 5]]`. `a.extend([4, 5])` gives `[1, 2, 3, 4, 5]`. Mixing them up produces nested lists that break later indexing in confusing ways.',
      },
    ],
    keyTakeaways: [
      '`pop()` is O(1); `pop(0)` and `pop(i)` are O(n).',
      '`pop` on an empty list raises `IndexError`.',
      '`append` adds one element; `extend` adds each element of an iterable.',
      'Use `extend` rather than `append` in a loop.',
    ],
    practice: {
      prompt: 'Build a list and try `append([1,2])` and `extend([1,2])` on copies of it. Print both — the difference is immediately obvious and worth seeing once.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-9.4',
    language: 'python',
    summary: 'Understand FIFO, and why a queue is what makes BFS find shortest paths.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A queue is **first in, first out** — a supermarket queue. You join at the back and are served from the front. Where a stack goes deep, a queue goes **wide**, and that difference is precisely why BFS finds shortest paths and DFS does not.',
      },
      {
        kind: 'text',
        body: 'A queue processes nodes in discovery order, so everything at distance 1 is handled before anything at distance 2. That means **the first time you reach a node, you reached it by a shortest path** — a guarantee a stack cannot give, because DFS commits to one branch before considering alternatives.',
      },
      {
        kind: 'code',
        caption: 'The BFS skeleton, with levels',
        code: `from collections import deque

def bfs(start, target, adj):
    q = deque([start])
    visited = {start}                 # mark on ENQUEUE, not on dequeue
    level = 0

    while q:
        for _ in range(len(q)):       # snapshot: this many on this level
            node = q.popleft()

            if node == target:
                return level

            for nxt in adj[node]:
                if nxt not in visited:
                    visited.add(nxt)
                    q.append(nxt)

        level += 1                    # one full ring finished

    return -1`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: '`for _ in range(len(q))` captures the level',
        body: 'Reading `len(q)` once, before the inner loop, freezes the current level\'s size. Everything popped inside belongs to this level; everything pushed belongs to the next. Using the live length instead mixes levels together and every depth answer comes out wrong.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Mark visited when you enqueue',
        body: 'If you wait until you dequeue, a node reachable from several neighbours gets pushed multiple times before any copy is processed. The queue balloons well beyond the node count and dense graphs time out.',
      },
      {
        kind: 'text',
        body: 'Multi-source BFS is a small twist with big reach: seed the queue with *every* starting node before the loop. "Rotting Oranges" and "01 Matrix" become straightforward, because the wave expands from all sources at once and each cell is still reached by its nearest source first.',
      },
      {
        kind: 'code',
        code: `# Multi-source: push every source before the loop starts
q = deque()
for r in range(rows):
    for c in range(cols):
        if grid[r][c] == 2:          # every rotten orange
            q.append((r, c))`,
      },
    ],
    keyTakeaways: [
      'A queue is FIFO: in at the back, out at the front.',
      'FIFO order is what makes BFS find shortest paths.',
      '`for _ in range(len(q))` processes exactly one level.',
      'Mark visited on enqueue; seed all sources for multi-source BFS.',
    ],
    practice: {
      prompt: 'Write BFS on a small graph and print each node with its level. Then solve Rotting Oranges with multi-source BFS — the levels are literally minutes.',
      leetcode: { title: 'Rotting Oranges', slug: 'rotting-oranges' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-9.5',
    language: 'python',
    summary: 'Use deque for queues — the single most important performance choice in Python DSA.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'This is the lesson that saves the most submissions. A list looks like a fine queue — `append` to add, `pop(0)` to remove — and it is **catastrophically slow**, because `pop(0)` shifts every remaining element left. `deque` exists precisely for this.',
      },
      {
        kind: 'code',
        code: `from collections import deque

q = deque([1, 2, 3])

q.append(4)          # add at the BACK — O(1)
q.popleft()          # remove from the FRONT — O(1)   <- the key operation

q.appendleft(0)      # add at the FRONT — O(1)
q.pop()              # remove from the BACK — O(1)

q[0]                 # peek front — O(1)
q[-1]                # peek back — O(1)
len(q)
while q: ...         # empty test, same as a list`,
      },
      {
        kind: 'table',
        headers: ['Operation', 'list', 'deque'],
        rows: [
          ['Append right', 'O(1)', 'O(1)'],
          ['Pop right', 'O(1)', 'O(1)'],
          ['Append left', '**O(n)**', '**O(1)**'],
          ['Pop left', '**O(n)**', '**O(1)**'],
          ['Index the middle', '**O(1)**', '**O(n)**'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: '`pop(0)` in a BFS is the classic Python TLE',
        body: 'With 10⁵ nodes, `pop(0)` makes the traversal about 10¹⁰ operations instead of 10⁵. The code is *correct* — it produces the right answer on small inputs and simply times out on the judge, which makes it maddening to debug. Import `deque` reflexively.',
      },
      {
        kind: 'text',
        body: 'The reason for the difference is structural: a list is one contiguous block, so removing the front means shifting everything. A deque is a linked chain of small blocks with pointers at both ends, so removing from either end just moves a pointer.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'The trade-off: middle indexing is O(n)',
        body: '`dq[0]` and `dq[-1]` are fast, but `dq[n // 2]` walks the blocks. If your algorithm needs random access, use a list. The two containers complement each other rather than one being strictly better.',
      },
      {
        kind: 'code',
        caption: 'Construction',
        code: `deque()                      # empty
deque([1, 2, 3])             # from an iterable
deque(maxlen=3)              # bounded — adding a 4th drops the oldest

# maxlen is a neat fixed-window trick:
w = deque(maxlen=3)
for x in [1, 2, 3, 4]:
    w.append(x)
print(list(w))               # [2, 3, 4]`,
        output: '[2, 3, 4]',
      },
    ],
    keyTakeaways: [
      '`deque.popleft()` is O(1); `list.pop(0)` is O(n).',
      'This single swap is the most common Python DSA performance fix.',
      'Middle indexing is O(n) on a deque — use a list for random access.',
      '`maxlen` gives a self-evicting fixed-size window.',
    ],
    practice: {
      prompt: 'Time a loop that removes 100,000 elements with `list.pop(0)` against `deque.popleft()`. The gap is enormous, and one measurement fixes the habit permanently.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-9.6',
    language: 'python',
    summary: 'Use the left-hand deque operations, and keep the four method names straight.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'A deque has four operations — two at each end — and the naming is completely regular once you see it: **the plain name means the right, and the `left` suffix means the left**.',
      },
      {
        kind: 'table',
        headers: ['Method', 'End', 'Action'],
        rows: [
          ['`append(x)`', 'Right', 'Add'],
          ['`pop()`', 'Right', 'Remove'],
          ['`appendleft(x)`', 'Left', 'Add'],
          ['`popleft()`', 'Left', 'Remove'],
        ],
      },
      {
        kind: 'code',
        caption: 'The three roles a deque plays',
        code: `from collections import deque
dq = deque()

# QUEUE (FIFO): in one end, out the other
dq.append(1); dq.append(2)
dq.popleft()                      # 1

# STACK (LIFO): same end for both
dq.append(1); dq.append(2)
dq.pop()                          # 2

# DEQUE: both ends, both directions
dq.appendleft(0)
dq.pop()`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Mixing `popleft` and `pop` on one deque',
        body: '`append` + `popleft` is FIFO. `append` + `pop` is LIFO. Using both removal methods on the same structure gives you neither, and produces output that looks almost right — the hardest kind of bug to spot. Decide the role once.',
      },
      {
        kind: 'code',
        caption: 'The other two methods worth knowing',
        code: `dq.extendleft([1, 2, 3])     # note: inserts one at a time, so the
                             # result is REVERSED -> 3, 2, 1, ...

dq.rotate(1)                 # shift everything right by one
dq.rotate(-1)                # ...and left`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: '`extendleft` reverses what you give it',
        body: 'It calls `appendleft` for each element in turn, so the last one ends up leftmost. `deque([1,2,3])` then `extendleft([4,5])` gives `[5, 4, 1, 2, 3]`. If you want the original order, pass a reversed iterable.',
      },
      {
        kind: 'text',
        body: 'For DSA the essential four are the ones in the table. `rotate` occasionally simplifies a circular-array problem, and `extendleft` is rare enough that its surprise ordering is mostly worth knowing so it does not catch you out.',
      },
    ],
    keyTakeaways: [
      'Plain name = right end; `left` suffix = left end.',
      '`append` + `popleft` = queue; `append` + `pop` = stack.',
      'Do not mix the two removal methods on one structure.',
      '`extendleft` reverses the order of what you pass it.',
    ],
    practice: {
      prompt: 'Create one deque and use it as a queue, then another as a stack, pushing the same values. Then run `extendleft([4,5])` and confirm the reversal for yourself.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-9.7',
    language: 'python',
    summary: 'Use a deque to hold a sliding window, including the self-evicting maxlen form.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A sliding window moves along a sequence, admitting elements at one end and discarding them at the other. That is exactly a deque\'s shape — which is why window problems and deques go together so naturally.',
      },
      {
        kind: 'code',
        caption: 'A fixed window that evicts itself',
        code: `from collections import deque

window = deque(maxlen=k)         # bounded: the oldest drops automatically

for x in nums:
    window.append(x)             # when full, this evicts from the left
    if len(window) == k:
        process(list(window))`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: '`maxlen` removes the manual eviction',
        body: 'With `maxlen=k`, appending to a full deque silently drops the opposite end. That deletes an entire class of off-by-one error from fixed-window code — no index arithmetic, no explicit `popleft`.',
      },
      {
        kind: 'text',
        body: 'For most window problems you do not need to hold the elements at all — a running sum or a count map is enough, and cheaper. Reach for the deque when you need the actual *contents*, or when you need the window\'s maximum, which is the next lesson.',
      },
      {
        kind: 'code',
        caption: 'Compare: a running sum needs no container',
        code: `# Fixed-window sum — no deque required
total, best = 0, float("-inf")

for r, x in enumerate(nums):
    total += x                          # element enters
    if r >= k:
        total -= nums[r - k]            # element leaves
    if r >= k - 1:
        best = max(best, total)`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Do not scan the window to find its maximum',
        body: 'Calling `max(window)` on every step is O(k) per element and O(n·k) overall — that is the brute force the problem is asking you to beat. The monotonic deque in the next lessons gets it to O(n).',
      },
      {
        kind: 'code',
        caption: 'A variable-size window, for reference',
        code: `# Longest window with no repeats — a count map, not a deque
from collections import defaultdict

count = defaultdict(int)
best = l = 0

for r, ch in enumerate(s):
    count[ch] += 1                   # GROW

    while count[ch] > 1:             # SHRINK while invalid
        count[s[l]] -= 1
        l += 1

    best = max(best, r - l + 1)      # RECORD`,
      },
    ],
    keyTakeaways: [
      'A sliding window admits at one end and discards at the other — a deque\'s shape.',
      '`maxlen` makes a fixed window evict itself, removing off-by-one bugs.',
      'Most window problems need only a running sum or count map.',
      '`max(window)` every step is O(n·k) — the thing you are meant to avoid.',
    ],
    practice: {
      prompt: 'Solve Maximum Average Subarray I with a running sum (no deque), then rewrite it with `deque(maxlen=k)`. Comparing them shows when the container earns its place and when it does not.',
      leetcode: { title: 'Maximum Average Subarray I', slug: 'maximum-average-subarray-i' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-9.8',
    language: 'python',
    summary: 'Learn the monotonic stack, which turns an O(n²) scan into a single pass.',
    readMinutes: 6,
    blocks: [
      {
        kind: 'text',
        body: 'A **monotonic** stack is one you deliberately keep ordered — always increasing or always decreasing — by popping anything that would break the order. That discipline turns "for each element, scan right until I find something bigger" from O(n²) into O(n).',
      },
      {
        kind: 'text',
        body: 'The insight that makes it work: when a new element arrives and breaks the order, **it is the answer for every element it pops**. The pop is where you record the result. That is the entire pattern, and everything else is bookkeeping.',
      },
      {
        kind: 'code',
        caption: 'Next greater element to the right',
        code: `def next_greater(nums):
    res = [-1] * len(nums)        # default: nothing greater exists
    stack = []                    # holds INDICES, values decreasing

    for i, x in enumerate(nums):
        # x is the next greater element for everything it beats
        while stack and nums[stack[-1]] < x:
            res[stack.pop()] = x

        stack.append(i)

    return res                    # leftovers keep -1`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'It really is O(n), despite the inner `while`',
        body: 'Each index is pushed exactly once and popped at most once, so the total pops across the whole run are bounded by n. Amortised, the inner loop is free. Being able to explain this is worth practising — interviewers ask about it directly.',
      },
      {
        kind: 'table',
        headers: ['You want', 'Keep the stack', 'Pop while'],
        rows: [
          ['Next **greater**', 'Decreasing', '`nums[stack[-1]] < x`'],
          ['Next **smaller**', 'Increasing', '`nums[stack[-1]] > x`'],
          ['Previous greater', 'Decreasing, scan left', '`nums[stack[-1]] < x`'],
          ['Previous smaller', 'Increasing, scan left', '`nums[stack[-1]] > x`'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Store indices, not values',
        body: 'Daily Temperatures wants `i - stack[-1]`, a *distance*. Largest Rectangle needs positions to compute widths. You can always recover a value with `nums[idx]`, but never an index from a value — so default to indices.',
      },
      {
        kind: 'code',
        caption: 'Daily Temperatures — the distance version',
        code: `def daily_temperatures(temps):
    res = [0] * len(temps)
    stack = []

    for i, t in enumerate(temps):
        while stack and temps[stack[-1]] < t:
            j = stack.pop()
            res[j] = i - j            # how many days j had to wait

        stack.append(i)

    return res`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: '`<` versus `<=` matters with duplicates',
        body: 'The comparison decides whether equal elements pop each other. For "next *strictly* greater" use `<`. The wrong choice usually still passes on distinct inputs and fails only on a hidden test containing repeats.',
      },
    ],
    keyTakeaways: [
      'A monotonic stack records the answer at the moment it pops.',
      'Each index is pushed and popped once, so the scan is O(n).',
      'Decreasing stack → next greater; increasing → next smaller.',
      'Store indices; `<` vs `<=` decides duplicate behaviour.',
    ],
    practice: {
      prompt: 'Solve Daily Temperatures. Then print the stack contents at each step and watch it stay decreasing — seeing the invariant hold makes the pattern click.',
      leetcode: { title: 'Daily Temperatures', slug: 'daily-temperatures' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-9.9',
    language: 'python',
    summary: 'Extend the monotonic idea to a deque, for maxima over a moving window.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'A monotonic **deque** is the same idea with one addition: because the window also moves on the left, you must discard elements that have fallen out of range. Removing from both ends is exactly what a deque provides — hence the name.',
      },
      {
        kind: 'code',
        caption: 'Sliding Window Maximum',
        code: `from collections import deque

def max_sliding_window(nums, k):
    dq = deque()          # indices, values DECREASING
    res = []

    for i, x in enumerate(nums):
        # 1. drop indices that have slid out of the window
        if dq and dq[0] <= i - k:
            dq.popleft()

        # 2. drop values smaller than x — they can never win again
        while dq and nums[dq[-1]] < x:
            dq.pop()

        dq.append(i)

        # 3. the front is always the window maximum
        if i >= k - 1:
            res.append(nums[dq[0]])

    return res`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Why discarding smaller values is safe',
        body: 'If `nums[j] < nums[i]` and `j < i`, then `j` can never be the maximum again — `i` is both larger *and* stays in the window longer. Convincing yourself of that turns the algorithm from magic into something obvious.',
      },
      {
        kind: 'text',
        body: 'The three steps happen in a fixed order and each has a distinct job: **evict** the out-of-range front, **maintain** the decreasing order at the back, then **read** the answer from the front. Writing them in that order every time prevents most of the bugs.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'The eviction test uses `<=`, not `<`',
        body: 'The window covering indices `i-k+1 .. i` means anything at index `i-k` or earlier is out. Writing `dq[0] < i - k` leaves one stale element in and the maximum can come from outside the window — a bug that only shows on specific inputs.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Do not confuse the two ends',
        body: 'The **front** (`dq[0]`) holds the maximum and is where you evict stale indices. The **back** (`dq[-1]`) is where you maintain order and append. Mixing them up gives an answer that is right for some windows and wrong for others.',
      },
      {
        kind: 'text',
        body: 'For a sliding-window *minimum*, flip one comparison: pop while `nums[dq[-1]] > x`, keeping the deque increasing. Everything else is identical, which is a good sign you have understood the pattern rather than memorised the code.',
      },
    ],
    keyTakeaways: [
      'Evict from the front, maintain order at the back, read from the front.',
      'A smaller earlier element can never be the maximum again — so drop it.',
      'The eviction test is `dq[0] <= i - k`.',
      'Flip one comparison to get sliding-window minimum instead.',
    ],
    practice: {
      prompt: 'Implement Sliding Window Maximum, then change the single comparison to get the minimum. If both work, you understand the pattern rather than the code.',
      leetcode: { title: 'Sliding Window Maximum', slug: 'sliding-window-maximum' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-9.10',
    language: 'python',
    summary: 'Work through the two problem families these structures unlock.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'This lesson closes the chapter by putting the pieces together on the two families you will actually meet: bracket-style matching, and next-greater-style scanning.',
      },
      { kind: 'heading', text: 'Family 1 — matching and nesting' },
      {
        kind: 'code',
        caption: 'Valid Parentheses, and its common extensions',
        code: `def is_valid(s):
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []

    for ch in s:
        if ch in "([{":
            stack.append(ch)
        elif not stack or stack.pop() != pairs[ch]:
            return False

    return not stack`,
      },
      {
        kind: 'text',
        body: 'Variations keep the same skeleton. **Min Add to Make Valid** counts unmatched closers instead of returning early. **Longest Valid Parentheses** pushes indices and measures gaps. **Remove Invalid Parentheses** marks positions to delete. In each case the stack answers "which opener does this closer belong to?".',
      },
      { kind: 'heading', text: 'Family 2 — next greater / smaller' },
      {
        kind: 'table',
        headers: ['Problem', 'What you record on pop'],
        rows: [
          ['Next Greater Element', 'The current value'],
          ['Daily Temperatures', '`i - j`, the distance'],
          ['Largest Rectangle in Histogram', 'Height × width, using the new top'],
          ['Trapping Rain Water', 'Bounded water between the walls'],
          ['Sum of Subarray Minimums', 'Count of subarrays where j is minimal'],
        ],
      },
      {
        kind: 'code',
        caption: 'Largest Rectangle — the width formula is the hard part',
        code: `def largest_rectangle(heights):
    stack = []                       # indices, heights INCREASING
    best = 0
    heights = heights + [0]          # sentinel forces a full drain at the end

    for i, h in enumerate(heights):
        while stack and heights[stack[-1]] > h:
            height = heights[stack.pop()]

            # left bound is whatever is now on top; right bound is i
            width = i if not stack else i - stack[-1] - 1
            best = max(best, height * width)

        stack.append(i)

    return best`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The sentinel trick',
        body: 'Appending a 0 at the end guarantees every remaining bar gets popped, so you do not need a separate drain loop afterwards. Adding a sentinel to force the last iteration is a broadly useful habit in stack problems.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'The width when the stack empties',
        body: 'If the stack is empty after popping, the bar extends all the way back to index 0, so the width is `i`, not `i - stack[-1] - 1`. Getting this branch wrong is the single most common Largest Rectangle bug.',
      },
      {
        kind: 'text',
        body: 'If you can write Valid Parentheses, Daily Temperatures and Sliding Window Maximum from memory, you have the whole chapter. Largest Rectangle is the stretch goal, and it rewards the effort — several harder problems reduce to it.',
      },
    ],
    keyTakeaways: [
      'Matching problems ask "which opener does this closer belong to?".',
      'Next-greater problems differ only in what you record on the pop.',
      'A sentinel value forces the stack to drain without a second loop.',
      'In Largest Rectangle, an empty stack means the width is `i`.',
    ],
    practice: {
      prompt: 'Write Valid Parentheses, Daily Temperatures and Sliding Window Maximum from memory. Then attempt Largest Rectangle in Histogram — dry-run it on `[2,1,5,6,2,3]` on paper before coding.',
      leetcode: { title: 'Largest Rectangle in Histogram', slug: 'largest-rectangle-in-histogram' },
    },
  },
];
