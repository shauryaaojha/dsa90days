import type { Lesson } from '../types';

/**
 * Java Chapter 13 — Queue Variants and Deque.
 * ArrayDeque in depth, and the monotonic deque that Chapter 10 introduced.
 */
export const ch13: Lesson[] = [
  // -------------------------------------------------------------------------
  {
    topicId: 'java-13.1',
    language: 'java',
    summary: 'Understand ArrayDeque and why a circular array makes both ends cheap.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: '`ArrayDeque` is backed by a **circular array**: a normal array plus two indices marking the head and tail, which wrap around when they reach the end. That design is what gives O(1) at both ends without any of the pointer-chasing a linked list would need.',
      },
      {
        kind: 'code',
        caption: 'How wrapping works',
        code: `Backing array of size 8, head=6, tail=1:

  index:  0    1    2    3    4    5    6    7
        [ C ][   ][   ][   ][   ][   ][ A ][ B ]
               ^tail                    ^head

Logical order: A, B, C — the data wraps past the end.
addFirst moves head backwards (wrapping to 7, 6, 5...).
addLast  moves tail forwards.  No element ever shifts.`,
      },
      {
        kind: 'text',
        body: 'Because nothing shifts, both ends are genuinely O(1). When the array fills, it doubles and copies once — the same amortised story as `ArrayList`.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'It replaces both `Stack` and `LinkedList`',
        body: '`ArrayDeque` is faster than `Stack` (no synchronisation) and faster than `LinkedList` (contiguous memory, no node objects). One class covers stack, queue and deque — which is why it is the default for all three in modern Java.',
      },
      {
        kind: 'code',
        code: `Deque<Integer> dq = new ArrayDeque<>();
Deque<Integer> sized = new ArrayDeque<>(100);       // initial capacity
Deque<Integer> from = new ArrayDeque<>(someList);   // copy a collection`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'It rejects `null`',
        body: '`dq.offer(null)` throws `NullPointerException`. The class uses `null` internally to mark empty slots, so it cannot store one. This bites during tree traversal when you push `node.left` without checking — guard the null, which is better practice anyway.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'No indexed access',
        body: 'There is no `dq.get(5)`. A deque exposes only its ends — if you need to reach the middle, you want a `List`. Being unable to index is the price of the wrapping.',
      },
    ],
    keyTakeaways: [
      '`ArrayDeque` is a circular array — O(1) at both ends, nothing shifts.',
      'It replaces `Stack`, and beats `LinkedList` as a queue.',
      'It cannot hold `null`.',
      'There is no indexed access — only the two ends.',
    ],
    practice: {
      prompt: 'Use one `ArrayDeque` as a stack and another as a queue with the same inputs, then compare the removal orders. Then try `offer(null)` and read the exception.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-13.2',
    language: 'java',
    summary: 'Know what a double-ended queue is and when you genuinely need both ends.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'A deque ("deck") lets you add and remove at **both** ends. That superset behaviour is why one class can act as a stack (use one end) or a queue (use opposite ends) — and why a few problems need it as a deque proper.',
      },
      {
        kind: 'table',
        headers: ['Role', 'Add at', 'Remove from'],
        rows: [
          ['Stack (LIFO)', 'Front', 'Front'],
          ['Queue (FIFO)', 'Back', 'Front'],
          ['Deque', 'Either', 'Either'],
        ],
      },
      { kind: 'heading', text: 'When you actually need both ends' },
      {
        kind: 'text',
        body: 'Three cases come up in practice. **Sliding window maximum** — you evict stale indices from the front and maintain order at the back. **Palindrome checking on a stream** — compare and remove from both ends. **0-1 BFS** — push zero-weight edges to the front and weight-one edges to the back, which turns Dijkstra into a plain deque traversal.',
      },
      {
        kind: 'code',
        caption: '0-1 BFS — a neat use of both ends',
        code: `// Edges cost 0 or 1 only. A deque replaces the priority queue entirely.
Deque<Integer> dq = new ArrayDeque<>();
dq.addFirst(start);
dist[start] = 0;

while (!dq.isEmpty()) {
    int u = dq.pollFirst();

    for (int[] e : adj.get(u)) {
        int v = e[0], w = e[1];
        if (dist[u] + w < dist[v]) {
            dist[v] = dist[u] + w;

            if (w == 0) dq.addFirst(v);    // free move — explore immediately
            else        dq.addLast(v);     // costs 1 — explore later
        }
    }
}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Why 0-1 BFS works',
        body: 'The deque stays sorted by distance automatically: everything at the front costs `d`, everything at the back costs `d + 1`. That gives Dijkstra\'s guarantee at O(V + E) instead of O(E log V) — but only when weights are exactly 0 or 1.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Most problems do not need both ends',
        body: 'If you are only ever using one end, or opposite ends consistently, you have a stack or a queue — say so with the declaration. Reaching for `Deque` when `Queue` would do just makes the intent less clear.',
      },
    ],
    keyTakeaways: [
      'A deque supports add and remove at both ends.',
      'Stack, queue and deque are all the same class used differently.',
      '0-1 BFS pushes free moves to the front and costly ones to the back.',
      'Declare `Queue` or `Deque` to document which behaviour you rely on.',
    ],
    practice: {
      prompt: 'Implement 0-1 BFS on a small grid where some moves are free. Compare its output with Dijkstra on the same graph — they should agree, and the deque version should be simpler.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-13.3',
    language: 'java',
    summary: 'Add at either end, and pick the right method family.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'There are two ways to add at each end, differing only in how they report failure. For `ArrayDeque`, which is unbounded, they behave identically — but the habit matters when you meet a bounded queue.',
      },
      {
        kind: 'code',
        code: `Deque<Integer> dq = new ArrayDeque<>();

dq.addFirst(1);      // throws IllegalStateException if capacity-bound and full
dq.offerFirst(1);    // returns false instead

dq.addLast(2);
dq.offerLast(2);

// Aliases you will see in stack/queue code:
dq.push(1);          // == addFirst
dq.add(2);           // == addLast
dq.offer(2);         // == offerLast`,
      },
      {
        kind: 'table',
        headers: ['Intent', 'Front', 'Back'],
        rows: [
          ['Add (throws)', '`addFirst`', '`addLast`'],
          ['Add (returns false)', '`offerFirst`', '`offerLast`'],
          ['Stack alias', '`push`', '—'],
          ['Queue alias', '—', '`add` / `offer`'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: '`add` and `push` go to opposite ends',
        body: '`add(x)` appends at the **back**; `push(x)` inserts at the **front**. They read as synonyms and are not. Mixing them on one deque silently produces an ordering that is neither LIFO nor FIFO.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Prefer the explicit names',
        body: 'In deque code, write `addFirst` and `addLast` rather than the aliases — they say which end without you having to remember the convention. Save `push`/`pop` for when the variable is genuinely named `stack`.',
      },
      {
        kind: 'code',
        caption: 'Building a result front-to-back',
        code: `// Level order, bottom-up: build the answer by prepending
Deque<List<Integer>> res = new ArrayDeque<>();

while (!q.isEmpty()) {
    List<Integer> level = new ArrayList<>();
    ...
    res.addFirst(level);      // O(1) — a List would need O(n) insert(0, ...)
}
return new ArrayList<>(res);`,
      },
      {
        kind: 'text',
        body: 'That last pattern is genuinely useful: when a problem wants results in reverse, prepending to a deque is O(1) per item, where `list.add(0, x)` is O(n) and makes the whole loop quadratic.',
      },
    ],
    keyTakeaways: [
      '`addFirst`/`addLast` throw; `offerFirst`/`offerLast` return false.',
      '`push` goes to the front, `add` goes to the back — not synonyms.',
      'Prefer the explicit `First`/`Last` names in deque code.',
      '`addFirst` is O(1) — use it instead of `list.add(0, x)`.',
    ],
    practice: {
      prompt: 'Build a list in reverse two ways: `list.add(0, x)` in a loop, and `deque.addFirst(x)`. Time both on 100,000 elements.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-13.4',
    language: 'java',
    summary: 'Remove from either end, and handle the empty case deliberately.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'Removal mirrors insertion: two families per end, differing only in what happens when the deque is empty. This is where the choice actually matters, because empty deques are common and `null` unboxing throws.',
      },
      {
        kind: 'code',
        code: `dq.removeFirst();     // throws NoSuchElementException if empty
dq.pollFirst();       // returns null if empty

dq.removeLast();
dq.pollLast();

// Aliases:
dq.pop();             // == removeFirst  (throws)
dq.poll();            // == pollFirst    (null)
dq.remove();          // == removeFirst  (throws)`,
      },
      {
        kind: 'code',
        caption: 'Peeking without removing',
        code: `dq.peekFirst();       // null if empty
dq.peekLast();        // null if empty
dq.getFirst();        // throws if empty
dq.getLast();         // throws if empty
dq.peek();            // == peekFirst
dq.element();         // == getFirst (throws)`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: '`int x = dq.pollFirst();` throws on an empty deque',
        body: '`pollFirst` returns `null`, Java unboxes it into an `int`, and you get a `NullPointerException` whose stack trace points at the assignment rather than at the empty deque. Guard with `isEmpty()` first.',
      },
      {
        kind: 'code',
        caption: 'The safe patterns',
        code: `// Guard first — clearest, and what you want in DSA
while (!dq.isEmpty()) {
    int x = dq.pollFirst();
}

// Or handle the null explicitly
Integer x = dq.pollFirst();
if (x != null) { ... }`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Removing by value is O(n)',
        body: '`dq.remove(Object)` and `removeFirstOccurrence` scan the whole structure. If your algorithm needs arbitrary removal, a deque is the wrong container — that requirement usually points at a `LinkedHashSet` or a `TreeSet`.',
      },
      {
        kind: 'text',
        body: 'One more useful method: `descendingIterator()` walks the deque back to front without modifying it, which is handy for printing a stack top-down or checking a palindrome.',
      },
    ],
    keyTakeaways: [
      '`removeFirst`/`removeLast` throw; `pollFirst`/`pollLast` return null.',
      'Unboxing a null result throws `NullPointerException`.',
      'Guard with `isEmpty()` rather than relying on either behaviour.',
      'Removing by value is O(n) — the wrong use for a deque.',
    ],
    practice: {
      prompt: 'On an empty `ArrayDeque`, call `removeFirst`, `pollFirst`, `getFirst` and `peekFirst`. Note which two throw. Then write `int x = dq.pollFirst();` and read the NPE.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-13.5',
    language: 'java',
    summary: 'Use a deque to hold the state of a sliding window.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A sliding window admits elements at one end and discards at the other — exactly a deque\'s shape. Most window problems need only a running sum or a count map, but when you need the window\'s **maximum**, a deque is the only structure that keeps it O(n).',
      },
      {
        kind: 'code',
        caption: 'What most windows need — no deque at all',
        code: `// Fixed window sum
int sum = 0, best = Integer.MIN_VALUE;

for (int r = 0; r < nums.length; r++) {
    sum += nums[r];                        // enters
    if (r >= k) sum -= nums[r - k];        // leaves
    if (r >= k - 1) best = Math.max(best, sum);
}`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Do not scan the window for its maximum',
        body: 'Calling a loop over the window on every step is O(k) per element and O(n·k) overall — that is the brute force the problem wants you to beat. A monotonic deque brings it to O(n), and that is the next lesson.',
      },
      { kind: 'heading', text: 'When the deque earns its place' },
      {
        kind: 'text',
        body: 'Reach for it when you need the window\'s extreme value, or when the elements themselves must be inspected in order. Those are the cases where a scalar running total cannot capture enough state.',
      },
      {
        kind: 'code',
        caption: 'A deque holding raw window contents',
        code: `Deque<Integer> window = new ArrayDeque<>();

for (int r = 0; r < nums.length; r++) {
    window.addLast(nums[r]);                       // element enters

    if (window.size() > k) window.pollFirst();     // element leaves

    if (window.size() == k) process(window);
}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Store indices, not values',
        body: 'Storing indices lets you test whether the front has slid out of range with `dq.peekFirst() <= i - k`. With values you have no way to know how old the front is, which is exactly what the eviction step needs.',
      },
      {
        kind: 'text',
        body: 'The variable-size window — "longest substring with at most k distinct" — is a different tool again: a `HashMap` count plus two pointers. Deques are for the fixed-size, extreme-value family specifically.',
      },
      {
        kind: 'table',
        headers: ['Window question', 'Tool'],
        rows: [
          ['Sum over a fixed window', 'Running total'],
          ['At most k distinct', '`HashMap` + two pointers'],
          ['Maximum / minimum in the window', '**Monotonic deque**'],
          ['Median in the window', 'Two heaps'],
        ],
      },
    ],
    keyTakeaways: [
      'A sliding window admits at one end and discards at the other.',
      'Most windows need only a running sum or a count map.',
      'Use a deque when you need the window extreme in O(n).',
      'Store indices so you can detect elements that have slid out.',
    ],
    practice: {
      prompt: 'Solve Maximum Average Subarray I with a running sum. Then rewrite it holding the window in a deque and note that the deque adds nothing here — that is the point.',
      leetcode: { title: 'Maximum Average Subarray I', slug: 'maximum-average-subarray-i' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-13.6',
    language: 'java',
    summary: 'Build a monotonic deque for sliding-window maxima in O(n).',
    readMinutes: 6,
    blocks: [
      {
        kind: 'text',
        body: 'A monotonic deque keeps its values in order — decreasing for a maximum query — by discarding anything that can never win again. It is the monotonic stack from Chapter 10 with one addition: because the window also moves on the left, you must evict from the front too.',
      },
      {
        kind: 'code',
        caption: 'Sliding Window Maximum',
        code: `int[] maxSlidingWindow(int[] nums, int k) {
    Deque<Integer> dq = new ArrayDeque<>();      // INDICES, values decreasing
    int[] res = new int[nums.length - k + 1];

    for (int i = 0; i < nums.length; i++) {
        // 1. EVICT indices that have slid out of the window
        if (!dq.isEmpty() && dq.peekFirst() <= i - k) dq.pollFirst();

        // 2. MAINTAIN order: drop values smaller than the incoming one
        while (!dq.isEmpty() && nums[dq.peekLast()] < nums[i]) dq.pollLast();

        dq.addLast(i);

        // 3. READ: the front is always the window maximum
        if (i >= k - 1) res[i - k + 1] = nums[dq.peekFirst()];
    }
    return res;
}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Why discarding smaller values is safe',
        body: 'If `nums[j] < nums[i]` and `j < i`, then `j` can never be the maximum again — `i` is both larger **and** stays in the window longer. Convincing yourself of that turns the algorithm from magic into something obvious.',
      },
      {
        kind: 'text',
        body: 'The three steps have distinct jobs and a fixed order: **evict** the stale front, **maintain** the ordering at the back, then **read** the answer from the front. Writing them in that sequence every time prevents most of the bugs.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'The eviction test is `<=`, not `<`',
        body: 'A window covering indices `i-k+1 .. i` means anything at index `i-k` or earlier is out. Writing `dq.peekFirst() < i - k` leaves one stale element in, so the maximum can come from outside the window — a bug that only shows on specific inputs.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Front and back have different jobs',
        body: 'The **front** holds the maximum and is where you evict by age. The **back** is where you maintain order and append. Confusing them gives an answer that is right for some windows and wrong for others — the hardest kind of bug to spot.',
      },
      {
        kind: 'text',
        body: 'For a sliding-window **minimum**, flip one comparison: pop while `nums[dq.peekLast()] > nums[i]`, keeping the deque increasing. Everything else is identical — and if both versions work, you have understood the pattern rather than memorised the code.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'It is O(n) despite the inner `while`',
        body: 'Each index is added once and removed once, so total removals across the whole run are bounded by n. Amortised, the inner loop is free — the same argument as the monotonic stack.',
      },
    ],
    keyTakeaways: [
      'Evict from the front by age, maintain order at the back, read the front.',
      'A smaller earlier element can never be the maximum again.',
      'The eviction test is `dq.peekFirst() <= i - k`.',
      'Flip one comparison to get sliding-window minimum.',
    ],
    practice: {
      prompt: 'Implement Sliding Window Maximum, then change the single comparison to get the minimum. Print the deque contents each step and watch the ordering invariant hold.',
      leetcode: { title: 'Sliding Window Maximum', slug: 'sliding-window-maximum' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-13.7',
    language: 'java',
    summary: 'Choose between queue, deque and priority queue with one question.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Three queue-like structures, and the choice reduces to asking **what determines the order things come out**. Insertion order, position, or priority — each answer points at exactly one container.',
      },
      {
        kind: 'table',
        headers: ['', 'Queue', 'Deque', 'PriorityQueue'],
        rows: [
          ['Order out', 'Insertion (FIFO)', 'Whichever end you ask', 'By comparator'],
          ['Add', 'O(1)', 'O(1) either end', 'O(log n)'],
          ['Remove', 'O(1)', 'O(1) either end', 'O(log n)'],
          ['Peek', 'O(1)', 'O(1) either end', 'O(1)'],
          ['Typical use', 'BFS', 'Sliding window max', 'Top-K, Dijkstra'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The decision question',
        body: 'Does the **order of arrival** decide? → `Queue`. Do I need **both ends**? → `Deque`. Does a **value** decide, regardless of arrival? → `PriorityQueue`. Every queue-shaped problem lands in one of those three.',
      },
      {
        kind: 'code',
        caption: 'All three, declared',
        code: `Queue<Integer> q = new ArrayDeque<>();                            // FIFO
Deque<Integer> dq = new ArrayDeque<>();                           // both ends
PriorityQueue<Integer> pq = new PriorityQueue<>();                // min-heap
PriorityQueue<Integer> maxPq =
    new PriorityQueue<>(Comparator.reverseOrder());               // max-heap`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: '`PriorityQueue` is not FIFO for equal elements',
        body: 'Two elements that compare equal come out in **no defined order** — the heap makes no stability promise. If arrival order must break ties, add a monotonically increasing counter as a second sort key.',
      },
      {
        kind: 'code',
        code: `int counter = 0;
PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) ->
    a[0] != b[0] ? Integer.compare(a[0], b[0])
                 : Integer.compare(a[1], b[1]));   // counter breaks the tie

pq.offer(new int[]{priority, counter++, value});`,
      },
      {
        kind: 'table',
        headers: ['Problem', 'Container'],
        rows: [
          ['BFS, level order, shortest unweighted path', '`Queue`'],
          ['Sliding window maximum, 0-1 BFS', '`Deque`'],
          ['Top K, kth largest, merge K lists', '`PriorityQueue`'],
          ['Dijkstra, cheapest-first greedy', '`PriorityQueue`'],
          ['Valid parentheses, monotonic stack, DFS', '`Deque` as a stack'],
        ],
      },
      {
        kind: 'text',
        body: 'Note that `ArrayDeque` covers the first two rows *and* the stack row — one class, three roles. Only `PriorityQueue` is genuinely a different structure, because only it reorders based on value.',
      },
    ],
    keyTakeaways: [
      'Arrival order → Queue; both ends → Deque; value order → PriorityQueue.',
      '`ArrayDeque` serves as queue, deque and stack.',
      '`PriorityQueue` gives no ordering guarantee for equal elements.',
      'Add a counter as a tie-break key when arrival order matters.',
    ],
    practice: {
      prompt: 'For ten problems you have seen, name which of the three you would use and why. Then push equal-priority items into a `PriorityQueue` and confirm the pop order is not the insertion order.',
    },
  },
];
