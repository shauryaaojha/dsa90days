import type { Lesson } from '../types';

/**
 * Java Chapter 8 — Java Collection Framework Foundations.
 * The map of the territory. Individual containers get their own chapters; this
 * one is about how they relate and how to choose between them.
 */
export const ch08: Lesson[] = [
  // -------------------------------------------------------------------------
  {
    topicId: 'java-8.1',
    language: 'java',
    summary: 'Understand what the Collection Framework is and why it exists.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Arrays are fixed-size and have almost no methods. Every real program needs more: something that grows, something that keeps things unique, something that maps keys to values. The **Collection Framework** is Java\'s ready-made answer — a set of interfaces and classes covering essentially every container you will need in DSA.',
      },
      {
        kind: 'text',
        body: 'The design idea worth grasping is the split between **interfaces** (what a container can do) and **implementations** (how it does it). `List` is a promise about ordered access; `ArrayList` and `LinkedList` are two different ways of keeping that promise, with very different performance.',
      },
      {
        kind: 'code',
        caption: 'The map',
        code: `Collection (interface)
 |
 +-- List   -> ArrayList, LinkedList, Vector      ordered, duplicates OK
 +-- Set    -> HashSet, LinkedHashSet, TreeSet    unique elements
 +-- Queue  -> ArrayDeque, LinkedList, PriorityQueue
      |
      +-- Deque -> ArrayDeque, LinkedList          both ends

Map (interface — NOT a Collection)
 +-- HashMap, LinkedHashMap, TreeMap               key -> value`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: '`Map` is deliberately not a `Collection`',
        body: 'A `Collection` holds single elements; a `Map` holds *pairs*. That is why you cannot pass a `HashMap` where a `Collection` is expected, and why `Map` has no `add` method. You can still get collection views out of it with `keySet()`, `values()` and `entrySet()`.',
      },
      { kind: 'heading', text: 'Why this matters for LeetCode' },
      {
        kind: 'text',
        body: 'Choosing the right container is frequently the *whole* optimisation. A membership test is O(n) on a `List` and O(1) on a `HashSet` — the same algorithm passes or times out depending only on that choice. Learning this framework is not Java trivia; it is where most of your speed comes from.',
      },
      {
        kind: 'table',
        headers: ['Need', 'Reach for'],
        rows: [
          ['Ordered, indexed, growable', '`ArrayList`'],
          ['"Have I seen this?"', '`HashSet`'],
          ['"How many times have I seen this?"', '`HashMap`'],
          ['LIFO (stack) or FIFO (queue)', '`ArrayDeque`'],
          ['Always pull out the smallest/largest', '`PriorityQueue`'],
          ['Sorted keys, or "next key ≥ x"', '`TreeMap` / `TreeSet`'],
        ],
      },
    ],
    keyTakeaways: [
      'The framework splits interfaces (what) from implementations (how).',
      '`Map` is not a `Collection` — it holds pairs, not elements.',
      'Picking the right container is often the entire optimisation.',
      'Six containers cover almost all of DSA.',
    ],
    practice: {
      prompt: 'For five LeetCode problems you have seen, write down which container you would use and why. Do not code them — the point is to practise the *choice*, which is the skill this chapter teaches.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-8.2',
    language: 'java',
    summary: 'Declare variables by interface and instantiate by implementation.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'You will see this line everywhere, and the asymmetry is deliberate: `List<Integer> list = new ArrayList<>();`. The **left** side is an interface, the **right** is a concrete class. Understanding why is the point of this lesson.',
      },
      {
        kind: 'code',
        code: `List<Integer> list = new ArrayList<>();          // declare interface
Set<String> seen = new HashSet<>();
Map<String,Integer> freq = new HashMap<>();
Deque<Integer> stack = new ArrayDeque<>();
Queue<int[]> queue = new ArrayDeque<>();`,
      },
      {
        kind: 'text',
        body: 'Declaring the interface says "I only depend on the *contract*". Swapping `HashMap` for `TreeMap` because a problem suddenly needs sorted keys becomes a one-word change, and nothing else in your method has to move.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Interviewers read this as a signal',
        body: '`ArrayList<Integer> list = new ArrayList<>()` works fine and nobody will fail you for it — but `List<Integer> list = ...` is the expected form and reads as more polished. It costs nothing to make it your default.',
      },
      { kind: 'heading', text: 'When you need the concrete type on the left' },
      {
        kind: 'code',
        code: `// ArrayDeque has methods Queue does not expose
ArrayDeque<Integer> dq = new ArrayDeque<>();
dq.addFirst(1);        // not on the Queue interface
dq.peekLast();

// Declared as Deque, both are available:
Deque<Integer> dq2 = new ArrayDeque<>();
dq2.addFirst(1);       // fine — Deque declares this`,
      },
      {
        kind: 'text',
        body: 'The rule is simply: declare the **most general type that still exposes every method you need**. If you call `addFirst`, `Queue` is too narrow and `Deque` is right.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: '`List.of(...)` gives you an immutable list',
        body: '`List.of(1, 2, 3)` and `Arrays.asList(...)` return fixed-size or immutable lists. Calling `add` on them throws `UnsupportedOperationException` at runtime, not compile time. When you need a mutable list, wrap it: `new ArrayList<>(List.of(1, 2, 3))`.',
      },
      {
        kind: 'code',
        caption: 'The diamond operator',
        code: `List<Map<String,List<Integer>>> x = new ArrayList<>();   // <> infers the rest

// Java 10+ — 'var' infers the whole thing, but hides the interface
var list = new ArrayList<Integer>();    // type is ArrayList, not List`,
      },
    ],
    keyTakeaways: [
      'Declare the interface, instantiate the implementation.',
      'Swapping implementations then becomes a one-word change.',
      'Declare the most general type that still exposes the methods you call.',
      '`List.of` and `Arrays.asList` are not mutable — wrap them if you need to add.',
    ],
    practice: {
      prompt: 'Write `List<Integer> a = new ArrayList<>()` then try `a = new LinkedList<>()` on the next line. It compiles, because both satisfy `List`. Now try the same with `ArrayList` on the left and watch it fail.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-8.3',
    language: 'java',
    summary: 'Know what each of the four core interfaces promises.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Four interfaces cover nearly everything. Each one makes a different promise, and knowing those promises is how you pick a container in seconds rather than guessing.',
      },
      {
        kind: 'table',
        headers: ['Interface', 'Promise', 'Duplicates?', 'Ordered?'],
        rows: [
          ['`List`', 'Indexed positions, `get(i)`', 'Yes', 'By insertion'],
          ['`Set`', 'Every element unique', 'No', 'Depends on impl'],
          ['`Queue`', 'Add at one end, remove at the other', 'Yes', 'FIFO (or by priority)'],
          ['`Map`', 'Key → value lookup', 'Keys unique', 'Depends on impl'],
        ],
      },
      { kind: 'heading', text: 'List — when position matters' },
      {
        kind: 'code',
        code: `List<Integer> list = new ArrayList<>();
list.add(10);              // append
list.add(0, 5);            // insert at index -> [5, 10]
list.get(0);               // 5
list.set(0, 7);            // overwrite -> [7, 10]
list.size();
list.contains(10);         // O(n) — a linear scan`,
      },
      { kind: 'heading', text: 'Set — when uniqueness matters' },
      {
        kind: 'code',
        code: `Set<Integer> set = new HashSet<>();
set.add(5);
set.add(5);                // ignored — already present
set.size();                // 1
set.contains(5);           // O(1) — the reason to use a Set
set.remove(5);`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: '`add` returns a boolean, and it is useful',
        body: '`set.add(x)` returns `false` when `x` was already there. That gives you duplicate detection in one line: `if (!seen.add(x)) return true;` is a complete "contains duplicate" check, with no separate `contains` call.',
      },
      { kind: 'heading', text: 'Queue — when order of processing matters' },
      {
        kind: 'code',
        code: `Queue<Integer> q = new ArrayDeque<>();
q.offer(1);  q.offer(2);   // add at the back
q.poll();                  // 1 — remove from the front (FIFO)
q.peek();                  // 2 — look without removing`,
      },
      { kind: 'heading', text: 'Map — when you need a lookup' },
      {
        kind: 'code',
        code: `Map<String,Integer> map = new HashMap<>();
map.put("a", 1);
map.get("a");                    // 1
map.get("zz");                   // null — NOT an error
map.getOrDefault("zz", 0);       // 0 — usually what you want
map.containsKey("a");
map.merge("a", 1, Integer::sum); // insert-or-add, in one call`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: '`map.get` returns null for a missing key',
        body: 'Assigning that into an `int` throws `NullPointerException` on unboxing — and the stack trace points at the assignment, not at the missing key, which makes it confusing. Use `getOrDefault` whenever a missing key is possible.',
      },
    ],
    keyTakeaways: [
      '`List` = positions, `Set` = uniqueness, `Queue` = processing order, `Map` = lookup.',
      '`set.add` returns false on a duplicate — a free duplicate check.',
      '`list.contains` is O(n); `set.contains` is O(1).',
      'Prefer `getOrDefault` over `get` to avoid null-unboxing crashes.',
    ],
    practice: {
      prompt: 'Solve Contains Duplicate two ways: with a `List` and `contains`, then with a `HashSet`. Time both on a large array. The gap is the entire reason this chapter exists.',
      leetcode: { title: 'Contains Duplicate', slug: 'contains-duplicate' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-8.4',
    language: 'java',
    summary: 'Use generics so the compiler catches type errors and you stop casting.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'The `<Integer>` in `List<Integer>` is a **generic type parameter** — it tells the compiler what the container holds. Without it you would be storing `Object` and casting everything back on the way out, which is exactly how Java worked before version 5 and exactly why generics were added.',
      },
      {
        kind: 'code',
        caption: 'Life without generics',
        code: `List raw = new ArrayList();      // raw type — avoid
raw.add("hello");
raw.add(42);                     // compiles! different types, no complaint

String s = (String) raw.get(1);  // ClassCastException at RUNTIME

// With generics, the mistake is caught at COMPILE time:
List<String> safe = new ArrayList<>();
safe.add(42);                    // compiler error — good`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Generics cannot hold primitives',
        body: '`List<int>` does not compile. You must use the wrapper class: `List<Integer>`, `Map<Character,Integer>`, `Set<Long>`. Java boxes and unboxes automatically, so it mostly feels seamless — but it costs memory and time, and it is why `int[]` beats `List<Integer>` when performance matters.',
      },
      {
        kind: 'table',
        headers: ['Primitive', 'Wrapper'],
        rows: [
          ['`int`', '`Integer`'],
          ['`long`', '`Long`'],
          ['`char`', '`Character`'],
          ['`double`', '`Double`'],
          ['`boolean`', '`Boolean`'],
        ],
      },
      { kind: 'heading', text: 'Nested generics' },
      {
        kind: 'code',
        code: `List<List<Integer>> grid = new ArrayList<>();       // list of lists
Map<String,List<String>> groups = new HashMap<>();  // anagram grouping
Map<Integer,Set<Integer>> adj = new HashMap<>();    // graph adjacency
PriorityQueue<int[]> pq = new PriorityQueue<>();    // arrays work as elements`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Use `int[]` as a lightweight pair',
        body: 'Java has no built-in `Pair`. For a heap of `(distance, node)` or a queue of `(row, col)`, a two-element `int[]` is the standard trick — it avoids boxing and needs no extra class. `pq.add(new int[]{dist, node})` is idiomatic Java DSA code.',
      },
      {
        kind: 'code',
        caption: 'A generic method of your own',
        code: `// <T> declares a type variable; the method works for any type
static <T> void printAll(List<T> items) {
    for (T item : items) System.out.println(item);
}`,
      },
    ],
    keyTakeaways: [
      'Generics move type errors from runtime to compile time.',
      'Primitives are not allowed — use the wrapper classes.',
      'Boxing costs memory, so prefer `int[]` over `List<Integer>` in hot loops.',
      '`int[]` is the idiomatic stand-in for a missing `Pair` type.',
    ],
    practice: {
      prompt: 'Build a `Map<String, List<Integer>>` and add to it with `computeIfAbsent`. Then try adding an `int` to a `List<String>` and read the compiler error — that error is generics doing its job.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-8.5',
    language: 'java',
    summary: 'Iterate collections safely, including how to remove while looping.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'There are three ways to walk a collection, and they differ in exactly one respect: **what you are allowed to do while walking**. Reading is always safe. Removing is where people get an exception.',
      },
      {
        kind: 'code',
        caption: 'The three ways',
        code: `// 1. For-each — cleanest, read-only
for (int x : list) System.out.println(x);

// 2. Index loop — when you need the position (List only)
for (int i = 0; i < list.size(); i++) System.out.println(list.get(i));

// 3. Iterator — the only one that can remove safely
Iterator<Integer> it = list.iterator();
while (it.hasNext()) {
    int x = it.next();
    if (x < 0) it.remove();        // safe
}`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: '`ConcurrentModificationException`',
        body: 'Removing from a collection inside a for-each loop throws this at runtime. The loop keeps an internal cursor and a modification counter; changing the collection invalidates them. It is not about threads despite the name — a single thread triggers it just as easily.',
      },
      {
        kind: 'code',
        caption: 'The bug and three fixes',
        code: `// BROKEN
for (Integer x : list)
    if (x < 0) list.remove(x);         // ConcurrentModificationException

// FIX 1 — removeIf (cleanest, Java 8+)
list.removeIf(x -> x < 0);

// FIX 2 — explicit iterator
Iterator<Integer> it = list.iterator();
while (it.hasNext()) if (it.next() < 0) it.remove();

// FIX 3 — walk backwards by index (indices after i are untouched)
for (int i = list.size() - 1; i >= 0; i--)
    if (list.get(i) < 0) list.remove(i);`,
      },
      { kind: 'heading', text: 'Iterating a Map' },
      {
        kind: 'code',
        code: `// Best: one pass, key and value together
for (Map.Entry<String,Integer> e : map.entrySet())
    System.out.println(e.getKey() + " -> " + e.getValue());

// Java 10+ shorthand
for (var e : map.entrySet()) { ... }

// Keys only, or values only
for (String k : map.keySet())   { ... }
for (int v : map.values())      { ... }`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Do not loop keys and then call `get` for each',
        body: '`for (String k : map.keySet()) { map.get(k); }` performs a second hash lookup per key for no reason. `entrySet()` gives you both at once and is the form to default to.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: '`list.remove(int)` vs `list.remove(Object)`',
        body: 'On a `List<Integer>`, `list.remove(2)` removes the element at **index 2**, while `list.remove(Integer.valueOf(2))` removes the **value** 2. The overloads pick by static type, which surprises everyone at least once.',
      },
    ],
    keyTakeaways: [
      'For-each is read-only; use `removeIf` or an `Iterator` to delete.',
      '`ConcurrentModificationException` has nothing to do with threads.',
      'Iterate maps with `entrySet()` — one lookup, not two.',
      'On `List<Integer>`, `remove(int)` is by index and `remove(Object)` is by value.',
    ],
    practice: {
      prompt: 'Build a list of ten numbers and try to remove the even ones inside a for-each loop. Watch it throw. Then fix it three ways — `removeIf`, an iterator, and a backwards index loop.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-8.6',
    language: 'java',
    summary: 'Define sort order with Comparable and Comparator, and know which to use.',
    readMinutes: 6,
    blocks: [
      {
        kind: 'text',
        body: 'Java can sort numbers and strings on its own, but for your own objects — or for any order other than the natural one — you must say what "smaller" means. There are two mechanisms: `Comparable` for the object\'s **one natural order**, and `Comparator` for **any other order**, defined outside the class.',
      },
      {
        kind: 'code',
        caption: 'Comparable — the class sorts itself',
        code: `class Task implements Comparable<Task> {
    int priority;

    @Override
    public int compareTo(Task other) {
        return Integer.compare(this.priority, other.priority);
    }
}

Collections.sort(tasks);       // uses compareTo`,
      },
      {
        kind: 'code',
        caption: 'Comparator — order supplied at the call site',
        code: `tasks.sort((a, b) -> Integer.compare(a.priority, b.priority));   // ascending
tasks.sort((a, b) -> Integer.compare(b.priority, a.priority));   // descending

// Clearer, and harder to get backwards:
tasks.sort(Comparator.comparingInt(t -> t.priority));
tasks.sort(Comparator.comparingInt((Task t) -> t.priority).reversed());`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The contract: negative, zero, positive',
        body: '`compare(a, b)` returns a **negative** number if `a` comes first, **zero** if they tie, **positive** if `b` comes first. You never return `true`/`false`. Remembering "negative means a is smaller" is enough to derive every comparator you will write.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Never write `a - b` for comparison',
        body: '`return a.value - b.value;` overflows when the values are far apart — `Integer.MIN_VALUE - 1` wraps to a positive number and the sort silently produces wrong order. Always use `Integer.compare(a, b)`. This is a genuine production bug, not a style preference.',
      },
      { kind: 'heading', text: 'Sorting by several keys' },
      {
        kind: 'code',
        code: `// By score descending, then by name ascending
people.sort(Comparator.comparingInt(Person::getScore).reversed()
                      .thenComparing(Person::getName));

// Sorting a 2-D int array by the first column — very common
Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: '`Arrays.sort` on primitives cannot take a comparator',
        body: '`Arrays.sort(int[])` uses a dual-pivot quicksort with no comparator overload. To sort an `int[]` in descending order you must either box it to `Integer[]`, or sort ascending and reverse. This catches people out constantly.',
      },
      { kind: 'heading', text: 'Comparators for a PriorityQueue' },
      {
        kind: 'code',
        code: `// Min-heap is the default
PriorityQueue<Integer> minHeap = new PriorityQueue<>();

// Max-heap
PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Comparator.reverseOrder());

// Heap of int[] pairs, ordered by the first element
PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> Integer.compare(a[0], b[0]));`,
      },
    ],
    keyTakeaways: [
      '`Comparable` = the class\'s one natural order; `Comparator` = any other order.',
      'Return negative / zero / positive — never a boolean.',
      'Use `Integer.compare(a, b)`, never `a - b`, to avoid overflow.',
      '`Arrays.sort` on a primitive array accepts no comparator.',
    ],
    practice: {
      prompt: 'Sort a `List<int[]>` by the second element descending, then by the first ascending. Write it once with a raw lambda and once with `Comparator.comparingInt(...).thenComparing(...)` and keep whichever you find clearer.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-8.7',
    language: 'java',
    summary: 'See how container choice alone decides whether a solution passes.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'This lesson ties the chapter together with the only argument that really matters: on LeetCode, the container you pick frequently **is** the difference between accepted and Time Limit Exceeded. The algorithm can be identical.',
      },
      {
        kind: 'code',
        caption: 'Two Sum, the same idea with two containers',
        code: `// O(n^2) — list.contains scans the whole list every time
List<Integer> seen = new ArrayList<>();
for (int x : nums) {
    if (seen.contains(target - x)) return true;   // O(n)
    seen.add(x);
}

// O(n) — same shape, O(1) lookup
Set<Integer> seen = new HashSet<>();
for (int x : nums) {
    if (seen.contains(target - x)) return true;   // O(1)
    seen.add(x);
}`,
      },
      {
        kind: 'text',
        body: 'With n = 10⁵ the first version performs about 10¹⁰ operations and times out; the second does about 10⁵ and finishes instantly. Nothing changed but the declaration on line 1.',
      },
      { kind: 'heading', text: 'The complexity table worth memorising' },
      {
        kind: 'table',
        headers: ['Operation', 'ArrayList', 'LinkedList', 'HashSet/Map', 'TreeSet/Map', 'ArrayDeque'],
        rows: [
          ['Access by index', 'O(1)', 'O(n)', '—', '—', '—'],
          ['Add at end', 'O(1)*', 'O(1)', 'O(1)', 'O(log n)', 'O(1)'],
          ['Add at front', 'O(n)', 'O(1)', '—', '—', 'O(1)'],
          ['Contains / lookup', 'O(n)', 'O(n)', 'O(1)', 'O(log n)', 'O(n)'],
          ['Remove by value', 'O(n)', 'O(n)', 'O(1)', 'O(log n)', 'O(n)'],
          ['Ordered iteration', 'insertion', 'insertion', '**no order**', 'sorted', 'insertion'],
        ],
      },
      {
        kind: 'text',
        body: '*`ArrayList.add` is amortised O(1) — occasionally it must grow its backing array and copy everything, but that cost spread over all the adds is constant.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The decision, in four questions',
        body: 'Do I need **key → value**? → `Map`. Do I only need **uniqueness**? → `Set`. Do I need **sorted order or nearest-key queries**? → the `Tree` variant. Do I need **both ends**? → `ArrayDeque`. Otherwise → `ArrayList`.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: '`LinkedList` is almost never the right answer',
        body: 'Its O(1) insertion only helps if you already hold a reference to the node — and `list.add(0, x)` still has to walk there. In practice `ArrayList` wins on nearly every real workload because of cache locality, and `ArrayDeque` beats it for queue behaviour. Use `LinkedList` when you genuinely need `List` and `Deque` in one type.',
      },
      {
        kind: 'table',
        headers: ['Problem shape', 'Container'],
        rows: [
          ['Two Sum, duplicates, first unique', '`HashMap` / `HashSet`'],
          ['BFS on a grid or graph', '`ArrayDeque` as the queue'],
          ['Valid parentheses, monotonic stack', '`ArrayDeque` as the stack'],
          ['Top K, merge K lists, Dijkstra', '`PriorityQueue`'],
          ['"Next key ≥ x", sorted iteration', '`TreeMap`'],
          ['Collecting results to return', '`ArrayList`'],
        ],
      },
    ],
    keyTakeaways: [
      'Container choice alone can turn O(n²) into O(n).',
      '`contains` is O(n) on a List and O(1) on a HashSet — the key fact.',
      'Four questions pick the container: map? unique? sorted? both ends?',
      '`LinkedList` is rarely the right answer despite its reputation.',
    ],
    practice: {
      prompt: 'Take the complexity table and rewrite it from memory. Then solve Contains Duplicate with an `ArrayList` and with a `HashSet` on a 100,000-element array and time both — the number will stay with you longer than the table.',
      leetcode: { title: 'Two Sum', slug: 'two-sum' },
    },
  },
];
