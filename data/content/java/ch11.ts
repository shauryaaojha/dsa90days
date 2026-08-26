import type { Lesson } from '../types';

/**
 * Java Chapter 11 — Priority Queue and Heap.
 * One class, PriorityQueue, plus the comparator skill from Chapter 8. The
 * bounded-heap trick in 11.8/11.9 is the payoff.
 */
export const ch11: Lesson[] = [
  // -------------------------------------------------------------------------
  {
    topicId: 'java-11.1',
    language: 'java',
    summary: 'Understand what a heap is and why it beats sorting for "give me the smallest".',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'A heap answers one question extremely well: **what is the smallest (or largest) element right now?** It gives you that in O(1), and lets you remove it or add a new element in O(log n) — without ever sorting the whole collection, which would be O(n log n) every time the data changed.',
      },
      {
        kind: 'text',
        body: 'The structure is a **complete binary tree** with one rule, the heap property: every parent is ≤ both of its children (a min-heap). That is a much weaker promise than full sorting — siblings are in no particular order — and it is exactly why maintaining it is cheap.',
      },
      {
        kind: 'code',
        caption: 'A valid min-heap',
        code: `        1
      /   \\
     3     2          Parent <= children, everywhere.
    / \\   /           Note 3 > 2 — siblings need no order at all.
   5   4 6

Stored as an array, level by level:  [1, 3, 2, 5, 4, 6]

For index i:   left child  = 2i + 1
               right child = 2i + 2
               parent      = (i - 1) / 2`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'A heap is an array, not a tree of objects',
        body: 'Because the tree is always complete, the children of index `i` are always at `2i+1` and `2i+2`. No node objects, no pointers — just arithmetic on one array. That is what makes heaps fast and compact.',
      },
      { kind: 'heading', text: 'Why not just sort?' },
      {
        kind: 'table',
        headers: ['Operation', 'Sorted array', 'Heap'],
        rows: [
          ['Find minimum', 'O(1)', 'O(1)'],
          ['Remove minimum', 'O(n) — shift everything', '**O(log n)**'],
          ['Insert a new element', 'O(n) — find the spot and shift', '**O(log n)**'],
          ['Build from n elements', 'O(n log n)', '**O(n)**'],
          ['Full ordering available', 'Yes', '**No**'],
        ],
      },
      {
        kind: 'text',
        body: 'The trade is deliberate: a heap gives up knowing the full order, and in exchange it makes insertion and minimum-removal cheap. When a problem repeatedly asks for the extreme element while data keeps arriving, that is precisely the right bargain.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Never iterate a heap expecting sorted order',
        body: 'Only the root is guaranteed. Printing a `PriorityQueue` shows the internal array — a jumble, not a sorted list. To get sorted output you must poll repeatedly, which is O(n log n) and destroys the heap.',
      },
    ],
    keyTakeaways: [
      'A heap gives O(1) access to the extreme and O(log n) insert/remove.',
      'It is a complete binary tree stored as a plain array.',
      'Siblings have no ordering — the promise is only parent vs child.',
      'Iterating a heap does not give sorted order.',
    ],
    practice: {
      prompt: 'Draw the array `[1, 3, 2, 5, 4, 6]` as a tree using the index formulas, and verify the heap property at every node. Doing it once on paper makes the array representation permanent.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-11.2',
    language: 'java',
    summary: 'Use PriorityQueue, Java\'s heap implementation, and know its API.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: '`PriorityQueue` is Java\'s heap. It implements `Queue`, so the method names are the familiar `offer`/`poll`/`peek` — but instead of FIFO order, it hands back the **smallest** element first.',
      },
      {
        kind: 'code',
        code: `PriorityQueue<Integer> pq = new PriorityQueue<>();

pq.offer(5);
pq.offer(1);
pq.offer(3);

pq.peek();      // 1 — the smallest, without removing. O(1)
pq.poll();      // 1 — remove and return the smallest. O(log n)
pq.poll();      // 3
pq.size();
pq.isEmpty();`,
      },
      {
        kind: 'table',
        headers: ['Method', 'Does', 'Cost'],
        rows: [
          ['`offer(x)` / `add(x)`', 'Insert', 'O(log n)'],
          ['`poll()`', 'Remove and return the head', 'O(log n)'],
          ['`peek()`', 'Look at the head', '**O(1)**'],
          ['`remove(Object)`', 'Remove a specific element', '**O(n)**'],
          ['`contains(x)`', 'Search', '**O(n)**'],
          ['`size()`', 'Count', 'O(1)'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Printing a PriorityQueue shows the raw array',
        body: '`System.out.println(pq)` prints the internal heap array, which is *not* sorted. Beginners see something like `[1, 3, 2]` and conclude the heap is broken. Only `peek()` is meaningful — to see sorted output, poll everything into a list.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: '`remove(Object)` and `contains` are O(n)',
        body: 'A heap has no index, so finding an arbitrary element means scanning. If your algorithm needs to delete arbitrary elements, either use a `TreeSet`, or use **lazy deletion**: mark entries as stale and skip them when they surface at the top.',
      },
      {
        kind: 'code',
        caption: 'Constructing one',
        code: `new PriorityQueue<>();                        // min-heap, natural order
new PriorityQueue<>(Comparator.reverseOrder()); // max-heap
new PriorityQueue<>(existingList);              // heapify — O(n), not O(n log n)
new PriorityQueue<>(100);                       // initial capacity`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Building from a collection is O(n)',
        body: '`new PriorityQueue<>(list)` heapifies in linear time, which is cheaper than `n` separate `offer` calls at O(n log n). When you already have all the data, pass it to the constructor.',
      },
    ],
    keyTakeaways: [
      '`PriorityQueue` is a min-heap using `offer`/`poll`/`peek`.',
      '`peek` is O(1); `offer` and `poll` are O(log n).',
      '`contains` and `remove(Object)` are O(n) — avoid them.',
      'Constructing from a collection heapifies in O(n).',
    ],
    practice: {
      prompt: 'Offer 5, 1, 3 into a PriorityQueue and print it — note the array order is not sorted. Then poll everything into a list and confirm *that* comes out sorted.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-11.3',
    language: 'java',
    summary: 'Remember that Java\'s default is a min-heap, and what "natural order" means.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'With no comparator, `PriorityQueue` uses each element\'s **natural ordering** — whatever its `compareTo` says. For `Integer` that is ascending, so you get a **min-heap**. This is the opposite of C++, where `priority_queue` is a max-heap by default, and the mismatch trips people who switch languages.',
      },
      {
        kind: 'code',
        code: `PriorityQueue<Integer> pq = new PriorityQueue<>();
pq.offer(5); pq.offer(1); pq.offer(3);
pq.poll();       // 1  — SMALLEST first

PriorityQueue<String> words = new PriorityQueue<>();
words.offer("banana"); words.offer("apple");
words.poll();    // "apple" — alphabetical, String's natural order`,
      },
      {
        kind: 'table',
        headers: ['Language', 'Default'],
        rows: [
          ['Java `PriorityQueue`', '**Min**-heap'],
          ['C++ `priority_queue`', '**Max**-heap'],
          ['Python `heapq`', '**Min**-heap'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Custom classes need `Comparable` or a comparator',
        body: 'Putting your own objects in a `PriorityQueue` with neither raises `ClassCastException: X cannot be cast to Comparable` — at runtime, on the *first offer that needs a comparison*, which may be the second insert rather than the first. Implement `Comparable` or pass a `Comparator`.',
      },
      {
        kind: 'code',
        caption: 'Two ways to make your class work',
        code: `// Option 1 — the class defines its own natural order
class Task implements Comparable<Task> {
    int priority;
    public int compareTo(Task o) { return Integer.compare(priority, o.priority); }
}
new PriorityQueue<Task>();

// Option 2 — order supplied at construction (more flexible)
new PriorityQueue<Task>((a, b) -> Integer.compare(a.priority, b.priority));`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Min-heap is what most problems want',
        body: '"Kth largest" uses a **min**-heap of size k, which feels backwards until you see it: you keep the k biggest, and the smallest of those sits at the top ready to be evicted. That pattern is in lesson 11.8, and it is the most useful heap trick there is.',
      },
    ],
    keyTakeaways: [
      'Java\'s default is a min-heap; C++\'s default is a max-heap.',
      'Natural order comes from `compareTo`.',
      'Custom classes need `Comparable` or a comparator, or you get a runtime cast error.',
      'Min-heaps solve "kth largest" — counterintuitive but standard.',
    ],
    practice: {
      prompt: 'Put a custom class into a `PriorityQueue` without `Comparable` and read the `ClassCastException`. Then fix it both ways — implementing the interface, and passing a lambda.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-11.4',
    language: 'java',
    summary: 'Build a max-heap by reversing the comparator.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'There is no `MaxPriorityQueue` in Java. You get a max-heap by passing a **reversed comparator**, and there are three ways to write it — all equivalent, so pick one and stay with it.',
      },
      {
        kind: 'code',
        code: `// 1. Clearest, and hardest to get backwards
new PriorityQueue<>(Comparator.reverseOrder());

// 2. Explicit — note b before a
new PriorityQueue<>((a, b) -> Integer.compare(b, a));

// 3. Also fine
new PriorityQueue<>(Collections.reverseOrder());`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Never write `(a, b) -> b - a`',
        body: 'Subtraction overflows when the values are far apart — `b - a` with `a = Integer.MIN_VALUE` wraps to a negative and the heap silently orders wrongly. Use `Integer.compare(b, a)`. This is a real bug, not a style rule.',
      },
      {
        kind: 'code',
        caption: 'Max-heap in use',
        code: `PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Comparator.reverseOrder());

maxHeap.offer(5); maxHeap.offer(1); maxHeap.offer(3);
maxHeap.poll();      // 5 — LARGEST first`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Remember the direction with one sentence',
        body: '"`compare(a, b)` negative means **a comes out first**." For a max-heap you want the bigger value first, so comparing `b` to `a` gives a negative when `a` is bigger. Deriving it beats memorising the argument order.',
      },
      {
        kind: 'code',
        caption: 'Max-heaps over objects and arrays',
        code: `// Heap of int[] pairs, largest first element on top
PriorityQueue<int[]> pq =
    new PriorityQueue<>((a, b) -> Integer.compare(b[0], a[0]));

// Max-heap by a field
PriorityQueue<Task> tasks =
    new PriorityQueue<>(Comparator.comparingInt((Task t) -> t.priority).reversed());`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Java has no negation trick — and does not need one',
        body: 'Python programmers negate values to fake a max-heap because `heapq` takes no comparator. Java does take one, so negating is unnecessary and error-prone. Use the comparator.',
      },
    ],
    keyTakeaways: [
      'Max-heap = `new PriorityQueue<>(Comparator.reverseOrder())`.',
      'Never use `b - a` — it overflows.',
      'Negative from `compare` means that element comes out first.',
      'Unlike Python, Java needs no value-negation trick.',
    ],
    practice: {
      prompt: 'Build a max-heap three ways and confirm all three poll in the same order. Then try `(a, b) -> b - a` with `Integer.MIN_VALUE` in the heap and watch the ordering break.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-11.5',
    language: 'java',
    summary: 'Use offer, poll and peek correctly, including the empty-heap behaviour.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'These three carry every heap algorithm you will write. They are the same `Queue` methods from Chapter 10, with the same two families — one that throws, one that returns null.',
      },
      {
        kind: 'code',
        code: `PriorityQueue<Integer> pq = new PriorityQueue<>();

pq.offer(3);         // insert — O(log n). Bubbles up to its place.
pq.peek();           // head — O(1), null if empty
pq.poll();           // remove head — O(log n), null if empty

pq.add(3);           // same as offer for an unbounded heap
pq.remove();         // like poll, but THROWS when empty
pq.element();        // like peek, but THROWS when empty`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: '`int x = pq.poll();` on an empty heap throws NullPointerException',
        body: '`poll` returns `null`, Java unboxes it into an `int`, and you get an NPE whose stack trace points at the assignment rather than at the empty heap. Guard with `isEmpty()` first, or receive it as an `Integer`.',
      },
      { kind: 'heading', text: 'What actually happens inside' },
      {
        kind: 'text',
        body: '`offer` puts the new element at the end of the array and **bubbles it up**, swapping with its parent while it is smaller — at most log n swaps. `poll` returns the root, moves the last element into the root slot, and **bubbles it down**, swapping with its smaller child until the heap property holds again. Both walk one root-to-leaf path, hence O(log n).',
      },
      {
        kind: 'code',
        caption: 'The standard drain loop',
        code: `while (!pq.isEmpty()) {
    int x = pq.poll();     // safe — the guard prevents the null
    process(x);
}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Peek before you poll when the decision depends on the value',
        body: 'A common pattern is "if the smallest is too old, drop it". Use `peek()` to inspect at O(1), and only `poll()` when you have decided — polling and re-offering costs 2 log n for nothing.',
      },
      {
        kind: 'code',
        code: `// Evict everything outside the window, cheaply
while (!pq.isEmpty() && pq.peek()[0] < cutoff) {
    pq.poll();
}`,
      },
    ],
    keyTakeaways: [
      '`offer` bubbles up, `poll` bubbles down — both O(log n).',
      '`peek` is O(1) and safe to call repeatedly.',
      '`poll` returns null when empty; unboxing that throws.',
      'Peek to decide, poll to commit.',
    ],
    practice: {
      prompt: 'Poll from an empty `PriorityQueue` into an `int` and read the NullPointerException. Then rewrite the loop with an `isEmpty()` guard.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-11.6',
    language: 'java',
    summary: 'Write comparators for heaps, including multi-key ordering.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'The comparator is where the real thinking happens in heap problems. The heap machinery never changes; what changes is your definition of "smallest". Getting fluent here is most of the skill.',
      },
      {
        kind: 'code',
        caption: 'The forms you will use',
        code: `// By a field, ascending
new PriorityQueue<Task>(Comparator.comparingInt(t -> t.priority));

// By a field, descending
new PriorityQueue<Task>(Comparator.comparingInt((Task t) -> t.priority).reversed());

// On int[] pairs, by the first element
new PriorityQueue<int[]>((a, b) -> Integer.compare(a[0], b[0]));

// Two keys: distance ascending, then id ascending
new PriorityQueue<int[]>((a, b) ->
    a[0] != b[0] ? Integer.compare(a[0], b[0])
                 : Integer.compare(a[1], b[1]));`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Prefer `Comparator.comparingInt` over a raw lambda',
        body: 'It reads in the same direction as the sort — `comparingInt(...).reversed()` is unambiguous, while `(a, b) -> Integer.compare(b.x, a.x)` requires you to decode the argument order every time. Fewer chances to write it backwards.',
      },
      {
        kind: 'code',
        caption: 'Chaining several keys',
        code: `PriorityQueue<Person> pq = new PriorityQueue<>(
    Comparator.comparingInt(Person::getAge)
              .thenComparing(Person::getName)
              .reversed()                       // careful — reverses BOTH keys
);

// To reverse only the first key:
Comparator.comparingInt(Person::getAge).reversed()
          .thenComparing(Person::getName);`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: '`.reversed()` applies to everything before it',
        body: 'Chaining `.thenComparing(...).reversed()` reverses the *whole* comparator, not just the last key. Where you place `.reversed()` changes the result — put it directly after the key you want flipped.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'The comparator must be consistent',
        body: 'It must be transitive and must never say `a < b` and `b < a`. An inconsistent comparator — one built from a mutable field you change while elements are in the heap — corrupts the structure silently, and elements come out in nonsense order with no exception.',
      },
      {
        kind: 'text',
        body: 'That last point is worth stressing: **never mutate a field the comparator reads while the object is inside the heap**. The heap placed it based on the old value and will not re-sort. Remove it, change it, then re-insert.',
      },
      {
        kind: 'code',
        caption: 'A heap of pairs, the common DSA shape',
        code: `// Dijkstra: (distance, node), smallest distance first
PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> Integer.compare(a[0], b[0]));

pq.offer(new int[]{0, start});

while (!pq.isEmpty()) {
    int[] cur = pq.poll();
    int d = cur[0], node = cur[1];
    ...
}`,
      },
    ],
    keyTakeaways: [
      'The comparator defines "smallest" — the heap itself never changes.',
      '`Comparator.comparingInt(...)` is clearer than a raw lambda.',
      '`.reversed()` flips everything chained before it.',
      'Never mutate a comparator-relevant field while the object is in the heap.',
    ],
    practice: {
      prompt: 'Build a heap of `int[]` ordered by the first element ascending and the second descending. Then move `.reversed()` around a chained comparator and observe how the ordering changes.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-11.7',
    language: 'java',
    summary: 'Carry several values per heap entry, since Java has no Pair type.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Heap entries usually need more than one value — a distance *and* a node, a frequency *and* an element. Java has no built-in `Pair`, so there are three standard workarounds, and the first is what most DSA code uses.',
      },
      { kind: 'heading', text: '1. int[] — the idiomatic choice' },
      {
        kind: 'code',
        code: `PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> Integer.compare(a[0], b[0]));

pq.offer(new int[]{dist, node});

int[] cur = pq.poll();
int d = cur[0], node = cur[1];`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Why `int[]` wins in DSA',
        body: 'No class to define, no boxing, and it works for any number of fields. The cost is readability — `cur[0]` says nothing about what it holds — so unpack into named variables immediately, as above.',
      },
      { kind: 'heading', text: '2. A small class, when clarity matters' },
      {
        kind: 'code',
        code: `class Node implements Comparable<Node> {
    int dist, id;
    Node(int dist, int id) { this.dist = dist; this.id = id; }

    public int compareTo(Node o) { return Integer.compare(dist, o.dist); }
}

PriorityQueue<Node> pq = new PriorityQueue<>();     // uses compareTo

// Java 16+: a record is far shorter
record Node(int dist, int id) {}
PriorityQueue<Node> pq2 = new PriorityQueue<>(Comparator.comparingInt(Node::dist));`,
      },
      { kind: 'heading', text: '3. Encoding two ints into a long' },
      {
        kind: 'code',
        code: `long packed = ((long) dist << 32) | (node & 0xFFFFFFFFL);
int dist = (int) (packed >> 32);
int node = (int) packed;`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Packing is clever and rarely worth it',
        body: 'It avoids object allocation, which occasionally matters in very tight loops. It is also easy to get wrong — the `& 0xFFFFFFFFL` mask is essential to stop sign extension corrupting the low half. Use `int[]` unless you have measured a real need.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Do not use `Map.Entry` as a mutable pair',
        body: '`Map.entry(a, b)` is immutable and allocates a boxed `Integer` for each half. It reads fine but is slower than `int[]` and cannot be updated in place — a poor fit for hot heap loops.',
      },
      {
        kind: 'text',
        body: 'The practical recommendation: use `int[]` for heap entries in DSA, and reach for a `record` when a problem has several fields and readability starts to suffer.',
      },
    ],
    keyTakeaways: [
      'Java has no `Pair`; `int[]` is the idiomatic DSA substitute.',
      'Unpack into named variables straight after polling.',
      'A `record` gives readability with little ceremony on Java 16+.',
      'Bit-packing works but is easy to get wrong — mask against sign extension.',
    ],
    practice: {
      prompt: 'Write Dijkstra using a `PriorityQueue<int[]>` of `(dist, node)`. Then rewrite the entry as a `record` and compare which you find easier to read six months from now.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-11.8',
    language: 'java',
    summary: 'Learn the bounded-heap trick that solves the whole Top-K family.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Top-K problems — "the k largest", "the k most frequent", "the k closest" — all yield to one trick: **keep a heap of exactly k elements, ordered the "wrong" way round**. It takes a moment to accept, and then it solves the entire family.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'For the k LARGEST, use a MIN-heap of size k',
        body: 'The heap holds the k biggest seen so far. Its root is the *smallest of those* — the weakest survivor. When something bigger arrives, evict the root. What remains at the end is exactly the top k, and the root is the kth largest.',
      },
      {
        kind: 'code',
        caption: 'The template',
        code: `// k largest elements
PriorityQueue<Integer> heap = new PriorityQueue<>();   // MIN-heap

for (int x : nums) {
    heap.offer(x);
    if (heap.size() > k) heap.poll();    // drop the smallest survivor
}
// heap now holds the k largest; heap.peek() is the kth largest`,
      },
      {
        kind: 'table',
        headers: ['You want', 'Heap type', 'Root is'],
        rows: [
          ['k **largest**', '**Min**-heap of size k', 'The kth largest'],
          ['k **smallest**', '**Max**-heap of size k', 'The kth smallest'],
        ],
      },
      {
        kind: 'text',
        body: 'The complexity is the point. Sorting everything is O(n log n); this is **O(n log k)**, because the heap never exceeds k. When n is 10⁶ and k is 10, that is a large win — and it works on a stream, where you cannot sort at all because you never hold all the data.',
      },
      {
        kind: 'code',
        caption: 'Top K Frequent Elements',
        code: `Map<Integer,Integer> freq = new HashMap<>();
for (int x : nums) freq.merge(x, 1, Integer::sum);

// Min-heap on frequency, size capped at k
PriorityQueue<int[]> heap =
    new PriorityQueue<>((a, b) -> Integer.compare(a[1], b[1]));

for (var e : freq.entrySet()) {
    heap.offer(new int[]{e.getKey(), e.getValue()});
    if (heap.size() > k) heap.poll();
}

int[] res = new int[k];
for (int i = k - 1; i >= 0; i--) res[i] = heap.poll()[0];   // fill backwards
return res;`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Polling gives you ascending order',
        body: 'A min-heap of the k largest polls the *smallest first*. If the answer should be largest-first, fill the result array backwards — as above — or reverse it afterwards.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Offer then trim, not the reverse',
        body: 'Offer the element, *then* poll if the size exceeds k. Checking "is it bigger than the root?" before offering also works, but needs a separate empty-heap case. The offer-then-trim form has no special cases.',
      },
    ],
    keyTakeaways: [
      'k largest → min-heap of size k; k smallest → max-heap of size k.',
      'The root is the kth element and the eviction candidate.',
      'O(n log k) beats sorting, and works on streams.',
      'Offer first, then trim — no special cases.',
    ],
    practice: {
      prompt: 'Solve Top K Frequent Elements with a bounded min-heap. Then say out loud why a min-heap gives the k *largest* — if you can explain it, you own the pattern.',
      leetcode: { title: 'Top K Frequent Elements', slug: 'top-k-frequent-elements' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-11.9',
    language: 'java',
    summary: 'Find the kth largest or smallest, and know when a heap is not the best tool.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: '"Find the kth largest" is the purest Top-K problem, and it has three good solutions with genuinely different trade-offs. Knowing all three — and when each wins — is exactly what an interviewer is probing for.',
      },
      {
        kind: 'code',
        caption: '1. Bounded min-heap — O(n log k)',
        code: `PriorityQueue<Integer> heap = new PriorityQueue<>();

for (int x : nums) {
    heap.offer(x);
    if (heap.size() > k) heap.poll();
}
return heap.peek();          // the kth largest`,
      },
      {
        kind: 'code',
        caption: '2. Sort — O(n log n), one line',
        code: `Arrays.sort(nums);
return nums[nums.length - k];`,
      },
      {
        kind: 'code',
        caption: '3. Quickselect — O(n) average, O(n²) worst',
        code: `// Partition around a pivot; recurse into ONE side only.
// Same idea as quicksort, but you discard half instead of sorting it.
int quickSelect(int[] nums, int lo, int hi, int target) {
    int p = partition(nums, lo, hi);

    if (p == target) return nums[p];
    if (p < target)  return quickSelect(nums, p + 1, hi, target);
    return quickSelect(nums, lo, p - 1, target);
}`,
      },
      {
        kind: 'table',
        headers: ['Approach', 'Time', 'Space', 'Use when'],
        rows: [
          ['Bounded heap', 'O(n log k)', 'O(k)', 'k is small, or data is a stream'],
          ['Sort', 'O(n log n)', 'O(1)', 'k is near n, or clarity matters most'],
          ['Quickselect', 'O(n) avg', 'O(1)', 'You want the optimum and can modify the array'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'What to say in an interview',
        body: 'Offer the heap solution first — it is O(n log k), easy to write correctly, and handles streams. Then mention quickselect as the O(n)-average option, noting its O(n²) worst case and that it mutates the input. Naming the trade-offs matters more than picking one.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'The heap must be size k, not k+1',
        body: 'Trim *after* offering, so the heap settles back to exactly k. Off-by-one here returns the (k+1)th largest — an answer that looks reasonable and is quietly wrong on every test.',
      },
      {
        kind: 'text',
        body: 'A related family — "k closest points to the origin", "k closest to a target" — is the same template with a different comparator. Order by distance, keep a max-heap of size k, and evict the farthest. Only the definition of "worst" changes.',
      },
    ],
    keyTakeaways: [
      'Three solutions: bounded heap, sort, quickselect.',
      'The heap is O(n log k) and works on streams; quickselect is O(n) average.',
      'Trim after offering so the heap holds exactly k.',
      '"K closest" is the same template with a distance comparator.',
    ],
    practice: {
      prompt: 'Solve Kth Largest Element in an Array with the bounded heap, then with sorting. If you have time, attempt quickselect — the partition step is worth writing once.',
      leetcode: { title: 'Kth Largest Element in an Array', slug: 'kth-largest-element-in-an-array' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-11.10',
    language: 'java',
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
        code: `long[] dist = new long[n];
Arrays.fill(dist, Long.MAX_VALUE);
PriorityQueue<long[]> pq = new PriorityQueue<>((a, b) -> Long.compare(a[0], b[0]));

dist[start] = 0;
pq.offer(new long[]{0, start});

while (!pq.isEmpty()) {
    long[] cur = pq.poll();
    long d = cur[0]; int u = (int) cur[1];

    if (d > dist[u]) continue;              // stale entry — already improved

    for (int[] e : adj.get(u)) {
        int v = e[0], w = e[1];
        if (d + w < dist[v]) {
            dist[v] = d + w;
            pq.offer(new long[]{dist[v], v});
        }
    }
}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The lazy-deletion pattern',
        body: 'Java\'s `PriorityQueue` cannot decrease a key, so instead of updating an entry you push a new, better one and skip the stale copy when it surfaces: `if (d > dist[u]) continue;`. The heap may hold up to E entries, which is fine, and this is the standard Java Dijkstra.',
      },
      { kind: 'heading', text: 'Greedy scheduling' },
      {
        kind: 'code',
        caption: 'Meeting Rooms II — how many rooms at the busiest moment?',
        code: `Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));   // by start
PriorityQueue<Integer> endTimes = new PriorityQueue<>();         // min-heap

for (int[] iv : intervals) {
    // the earliest-finishing room is free again if it ended before this starts
    if (!endTimes.isEmpty() && endTimes.peek() <= iv[0]) endTimes.poll();
    endTimes.offer(iv[1]);
}
return endTimes.size();`,
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
          ['Task Scheduler', 'Remaining counts', 'Most frequent task left'],
          ['Connect Sticks', 'Stick lengths', 'Two cheapest to join'],
        ],
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'A heap does not make a greedy algorithm correct',
        body: 'It only makes "pick the best option" fast. Whether picking greedily *yields the optimum* is a separate argument you still have to make — and for problems like Coin Change it simply does not hold. Establish correctness first, then reach for the heap.',
      },
      {
        kind: 'code',
        caption: 'Merge K Sorted Lists — one line of insight',
        code: `PriorityQueue<ListNode> pq =
    new PriorityQueue<>((a, b) -> Integer.compare(a.val, b.val));

for (ListNode head : lists) if (head != null) pq.offer(head);

ListNode dummy = new ListNode(0), tail = dummy;
while (!pq.isEmpty()) {
    ListNode node = pq.poll();
    tail.next = node; tail = node;
    if (node.next != null) pq.offer(node.next);    // refill from the same list
}
return dummy.next;`,
      },
    ],
    keyTakeaways: [
      'Heaps power any algorithm that repeatedly asks "what is best right now?".',
      'Java Dijkstra uses lazy deletion: push improvements, skip stale entries.',
      'Greedy scheduling keeps end times in a heap; the root frees up soonest.',
      'The heap makes greedy fast, not correct — argue correctness separately.',
    ],
    practice: {
      prompt: 'Implement Dijkstra with `PriorityQueue<long[]>` including the stale-entry skip. Then solve Merge K Sorted Lists — both are heap problems that look nothing alike until you see the "best available now" shape.',
      leetcode: { title: 'Merge k Sorted Lists', slug: 'merge-k-sorted-lists' },
    },
  },
];
