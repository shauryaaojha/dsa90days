import type { Lesson } from '../types';

/**
 * Java Chapter 14 — Utility Classes and Helpers.
 * The support code every solution needs: pairs, node classes, comparators,
 * lambdas, and the Arrays/Collections static methods.
 */
export const ch14: Lesson[] = [
  // -------------------------------------------------------------------------
  {
    topicId: 'java-14.1',
    language: 'java',
    summary: 'Work around Java\'s missing Pair type, and pick the right substitute.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Java has no general-purpose `Pair` in the standard library — a genuine gap compared with C++\'s `std::pair` or a Python tuple. There are four workarounds, and knowing which to reach for saves a lot of small decisions.',
      },
      { kind: 'heading', text: '1. int[] — the DSA default' },
      {
        kind: 'code',
        code: `int[] pair = {distance, node};

pq.offer(new int[]{dist, node});
int[] cur = pq.poll();
int d = cur[0], node = cur[1];        // unpack immediately`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Why `int[]` wins for heaps and queues',
        body: 'No class to declare, no boxing, works for any arity. The cost is readability — `cur[0]` says nothing — so unpack into named variables on the very next line, every time.',
      },
      { kind: 'heading', text: '2. record — readable, and nearly free' },
      {
        kind: 'code',
        code: `record Point(int row, int col) {}          // Java 16+

Point p = new Point(3, 4);
p.row();                                   // accessor, not a field
// equals, hashCode and toString are generated — so it works in a HashSet`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Records are hashable out of the box',
        body: 'That matters: a `record Point` can be a `HashMap` key or `HashSet` element with no extra code, because `equals` and `hashCode` are generated from the components. An `int[]` **cannot** — arrays use identity equality.',
      },
      { kind: 'heading', text: '3. Map.Entry — available, but awkward' },
      {
        kind: 'code',
        code: `Map.Entry<Integer,Integer> e = Map.entry(1, 2);   // immutable
e.getKey(); e.getValue();

// Boxes both halves, cannot be updated, and reads poorly. Rarely worth it.`,
      },
      { kind: 'heading', text: '4. Encoding two ints in a long' },
      {
        kind: 'code',
        code: `long key = ((long) r << 32) | (c & 0xFFFFFFFFL);
int r = (int) (key >> 32);
int c = (int) key;

// Useful as a HashSet element for visited cells — no object allocation.`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'The mask is not optional',
        body: 'Without `& 0xFFFFFFFFL`, a negative `c` sign-extends and corrupts the high half. This encoding is genuinely useful for `Set<Long> visited` on a grid, but get the mask wrong and the bug is very hard to see.',
      },
      {
        kind: 'table',
        headers: ['Need', 'Use'],
        rows: [
          ['Heap or queue entry', '`int[]`'],
          ['HashSet / HashMap key', '`record`, or a packed `long`'],
          ['Readability with several fields', '`record`'],
          ['Returning two values', '`int[]` or a `record`'],
        ],
      },
    ],
    keyTakeaways: [
      'Java has no `Pair`; `int[]` is the DSA default.',
      'An `int[]` cannot be a hash key — arrays use identity equality.',
      'A `record` is hashable, readable and nearly free on Java 16+.',
      'Packing two ints into a `long` avoids allocation but needs the mask.',
    ],
    practice: {
      prompt: 'Put an `int[]{1,2}` into a `HashSet`, then add another `int[]{1,2}` and check the size — it will be 2, because arrays compare by identity. Then repeat with a `record` and see it deduplicate.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-14.2',
    language: 'java',
    summary: 'Write the node classes that LeetCode problems are built on.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Linked-list and tree problems hand you a node class. You rarely write it — it appears commented out at the top of the editor — but you must be able to read it fluently, and you will write your own for design problems.',
      },
      {
        kind: 'code',
        caption: 'The two you will meet constantly',
        code: `class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The dummy-head trick',
        body: 'Linked-list problems that build a new list are far cleaner with a throwaway head node: you never have to special-case "is this the first element?". Build onto `dummy`, then return `dummy.next`. Once you use it you will use it every time.',
      },
      {
        kind: 'code',
        code: `ListNode dummy = new ListNode(0), tail = dummy;

while (...) {
    tail.next = new ListNode(value);
    tail = tail.next;
}
return dummy.next;          // skips the dummy`,
      },
      {
        kind: 'code',
        caption: 'Nodes you write yourself',
        code: `class TrieNode {
    TrieNode[] children = new TrieNode[26];
    boolean isWord = false;
}

// For an LRU cache — a doubly linked list node
class Node {
    int key, value;
    Node prev, next;
    Node(int key, int value) { this.key = key; this.value = value; }
}`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Reference fields default to `null`',
        body: '`new TreeNode(5)` leaves `left` and `right` as `null` — that is correct and intended, and it is why every tree recursion starts with `if (root == null)`. Forgetting that check gives a `NullPointerException` at the first leaf.',
      },
      {
        kind: 'text',
        body: 'Declare helper classes as static nested classes or as plain top-level classes in the same file. Inside a LeetCode `Solution`, a non-static inner class would hold a hidden reference to the enclosing instance, which you never want.',
      },
    ],
    keyTakeaways: [
      'You read `ListNode`/`TreeNode` far more often than you write them.',
      'The dummy head removes every "is this the first node?" special case.',
      'Reference fields default to `null` — hence the base case in tree recursion.',
      'Declare helper node classes static, not inner.',
    ],
    practice: {
      prompt: 'Write Merge Two Sorted Lists using a dummy head. Then write it without one and count the extra special cases — that comparison sells the trick.',
      leetcode: { title: 'Merge Two Sorted Lists', slug: 'merge-two-sorted-lists' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-14.3',
    language: 'java',
    summary: 'Write comparators fluently — the skill behind sorting and heaps.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'A `Comparator` tells Java how to order two things. It is the single most-used piece of "helper" code in DSA — sorting intervals, ordering heap entries, ranking results — so being fluent here pays back constantly.',
      },
      {
        kind: 'code',
        caption: 'The contract',
        code: `// compare(a, b) returns:
//   negative  -> a comes FIRST
//   zero      -> tie
//   positive  -> b comes first

Comparator<Integer> asc  = (a, b) -> Integer.compare(a, b);
Comparator<Integer> desc = (a, b) -> Integer.compare(b, a);`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Never write `a - b`',
        body: 'Subtraction overflows: with `a = Integer.MIN_VALUE` and `b = 1`, `a - b` wraps to a positive number and the sort silently produces wrong order. Always `Integer.compare(a, b)`. This bug shipped in the JDK itself for years.',
      },
      {
        kind: 'code',
        caption: 'The factory methods — clearer than raw lambdas',
        code: `Comparator.comparingInt(Person::getAge)
Comparator.comparingDouble(Point::distance)
Comparator.comparing(Person::getName)                  // for objects

Comparator.comparingInt(Person::getAge).reversed()
Comparator.comparingInt(Person::getAge)
          .thenComparing(Person::getName)              // tie-break

Comparator.naturalOrder()
Comparator.reverseOrder()`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Prefer the factories over hand-written lambdas',
        body: '`comparingInt(...).reversed()` reads in the same direction as the sort. A raw `(a, b) -> Integer.compare(b.x, a.x)` requires decoding the argument order every time you read it — and is where the `a - b` bug creeps in.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: '`.reversed()` flips everything before it',
        body: '`comparingInt(A).thenComparing(B).reversed()` reverses **both** keys. To reverse only the first, place `.reversed()` directly after it: `comparingInt(A).reversed().thenComparing(B)`. Position changes the meaning.',
      },
      {
        kind: 'code',
        caption: 'The patterns you will actually type',
        code: `// Sort intervals by start
Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));

// Sort intervals by END — activity selection
Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));

// Max-heap
new PriorityQueue<>(Comparator.reverseOrder());

// Two keys on an int[]
(a, b) -> a[0] != b[0] ? Integer.compare(a[0], b[0])
                       : Integer.compare(b[1], a[1]);

// Sort strings by length, then alphabetically
words.sort(Comparator.comparingInt(String::length).thenComparing(s -> s));`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: '`Arrays.sort` on primitives takes no comparator',
        body: '`Arrays.sort(int[])` has no comparator overload — it uses dual-pivot quicksort. To sort an `int[]` descending you must box it to `Integer[]`, or sort ascending and reverse. This catches people out constantly.',
      },
    ],
    keyTakeaways: [
      'Negative means the first argument comes first.',
      'Use `Integer.compare`, never `a - b`.',
      '`comparingInt(...).thenComparing(...)` reads better than raw lambdas.',
      '`.reversed()` flips every key chained before it.',
    ],
    practice: {
      prompt: 'Sort a `List<int[]>` by the second element descending, then the first ascending. Write it as a raw lambda and with the factory methods, and try to sort an `int[]` descending to feel the primitive limitation.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-14.4',
    language: 'java',
    summary: 'Implement Comparable to give a class its one natural order.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: '`Comparable` is how a class declares its **own** ordering. Where a `Comparator` is supplied from outside and you can have many, `Comparable` is built in and there is exactly one — which is the whole distinction between them.',
      },
      {
        kind: 'code',
        code: `class Task implements Comparable<Task> {
    int priority;
    String name;

    @Override
    public int compareTo(Task other) {
        return Integer.compare(this.priority, other.priority);
    }
}

Collections.sort(tasks);                    // uses compareTo
new PriorityQueue<Task>();                  // uses compareTo
new TreeSet<Task>();                        // uses compareTo`,
      },
      {
        kind: 'table',
        headers: ['', '`Comparable`', '`Comparator`'],
        rows: [
          ['Defined', 'Inside the class', 'Outside, at the call site'],
          ['How many', 'Exactly one', 'As many as you like'],
          ['Method', '`compareTo(other)`', '`compare(a, b)`'],
          ['Use for', 'The obvious natural order', 'Any alternative order'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Sorted containers need one or the other',
        body: 'Putting a custom class into a `TreeSet`, `TreeMap` or `PriorityQueue` with neither throws `ClassCastException` at runtime — often on the *second* insert, since the first needs no comparison. Implement `Comparable` or pass a comparator at construction.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Keep `compareTo` consistent with `equals`',
        body: 'If `compareTo` returns 0, `equals` should return true. Sorted collections use `compareTo` to decide duplicates, so an inconsistent pair means a `TreeSet` silently drops elements it considers equal even though `equals` disagrees.',
      },
      {
        kind: 'code',
        caption: 'Multi-key natural order',
        code: `@Override
public int compareTo(Task other) {
    if (this.priority != other.priority)
        return Integer.compare(this.priority, other.priority);
    return this.name.compareTo(other.name);     // tie-break
}

// Or, more compactly:
private static final Comparator<Task> ORDER =
    Comparator.comparingInt((Task t) -> t.priority).thenComparing(t -> t.name);

@Override public int compareTo(Task o) { return ORDER.compare(this, o); }`,
      },
      {
        kind: 'text',
        body: 'In DSA you will write `Comparator` far more often than `Comparable`, because problems usually want one specific ordering rather than a permanent property of the type. Use `Comparable` when the order is genuinely intrinsic — a version number, a date.',
      },
    ],
    keyTakeaways: [
      '`Comparable` = one natural order, defined in the class.',
      '`Comparator` = any number of orders, defined outside.',
      'Sorted containers throw `ClassCastException` without either.',
      'Keep `compareTo` consistent with `equals`.',
    ],
    practice: {
      prompt: 'Put a class with no `Comparable` into a `TreeSet` and read the exception. Then implement `compareTo` with a tie-break on a second field and confirm the ordering.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-14.5',
    language: 'java',
    summary: 'Read and write lambdas, and understand what they really are.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A lambda is a short way to write an object that implements a **single-method interface**. That is the whole mechanism: when you pass `(a, b) -> ...` to `sort`, Java builds a `Comparator` whose `compare` has that body. Understanding this explains where lambdas can and cannot be used.',
      },
      {
        kind: 'code',
        caption: 'The same thing, three ways',
        code: `// 1. A named class
class ByAge implements Comparator<Person> {
    public int compare(Person a, Person b) { return Integer.compare(a.age, b.age); }
}
list.sort(new ByAge());

// 2. An anonymous class — what lambdas replaced
list.sort(new Comparator<Person>() {
    public int compare(Person a, Person b) { return Integer.compare(a.age, b.age); }
});

// 3. A lambda — identical, minus the ceremony
list.sort((a, b) -> Integer.compare(a.age, b.age));`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Lambdas only work where one abstract method is expected',
        body: 'That is why `Comparator`, `Runnable` and `Predicate` all accept them, and why an interface with two abstract methods cannot. If a lambda will not compile, check that the target interface really has exactly one method to implement.',
      },
      {
        kind: 'code',
        caption: 'Syntax forms',
        code: `x -> x * 2                          // one parameter, no brackets needed
(a, b) -> a + b                     // two parameters
(a, b) -> { return a + b; }         // block body needs an explicit return
() -> System.out.println("hi")      // no parameters`,
      },
      {
        kind: 'code',
        caption: 'Method references — shorter still',
        code: `list.forEach(System.out::println);            // x -> System.out.println(x)
list.sort(Comparator.comparingInt(Person::getAge));
list.stream().map(String::valueOf);
list.removeIf(String::isEmpty);`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Captured variables must be effectively final',
        body: 'A lambda can read a local variable only if it is never reassigned after initialisation. `int count = 0; list.forEach(x -> count++);` does not compile. Work around it with a one-element array (`int[] count = {0}`) or an `AtomicInteger` — or restructure to avoid the mutation.',
      },
      {
        kind: 'code',
        caption: 'The common functional interfaces',
        code: `Predicate<Integer> positive = x -> x > 0;          // test    -> boolean
Function<Integer,String> f = x -> "n=" + x;        // apply   -> R
Consumer<String> print = System.out::println;      // accept  -> void
Supplier<List<Integer>> make = ArrayList::new;     // get     -> T
BiFunction<Integer,Integer,Integer> add = Integer::sum;`,
      },
      {
        kind: 'text',
        body: 'In DSA you mostly meet lambdas as comparators, in `removeIf`, and in `computeIfAbsent(k, x -> new ArrayList<>())`. Those three cover almost every use.',
      },
    ],
    keyTakeaways: [
      'A lambda implements a single-method interface — that is all it is.',
      '`ClassName::method` is a shorter form when the shapes match.',
      'Captured locals must be effectively final.',
      'In DSA: comparators, `removeIf`, and `computeIfAbsent`.',
    ],
    practice: {
      prompt: 'Write the same comparator as an anonymous class and as a lambda. Then try to increment a local `int` inside a `forEach` and read the compiler error about effectively final variables.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-14.6',
    language: 'java',
    summary: 'Use the Arrays utility class instead of writing loops.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: '`java.util.Arrays` is a box of static helpers for arrays. Half of them replace a loop you would otherwise write by hand, and knowing them saves real time — particularly `fill`, `sort`, `copyOfRange` and `toString`.',
      },
      {
        kind: 'code',
        caption: 'The ones you will use most',
        code: `Arrays.sort(nums);                     // ascending, in place
Arrays.sort(arr, comparator);          // objects only — NOT int[]
Arrays.fill(dp, -1);                   // set every element
Arrays.fill(dp, 2, 5, 0);              // fill a range [2, 5)

Arrays.toString(nums);                 // "[1, 2, 3]" — for debugging
Arrays.deepToString(grid);             // for 2-D arrays

Arrays.equals(a, b);                   // element-wise comparison
Arrays.deepEquals(gridA, gridB);

Arrays.copyOf(nums, 10);               // resize, padding with zeros
Arrays.copyOfRange(nums, 2, 5);        // a slice, [2, 5)

Arrays.binarySearch(sorted, target);   // index, or -(insertionPoint) - 1
Arrays.stream(nums).sum();             // also .max(), .min(), .average()`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: '`System.out.println(nums)` prints garbage',
        body: 'Arrays do not override `toString`, so you get something like `[I@1b6d3586` — the type and hash code. Always use `Arrays.toString(nums)`, or `Arrays.deepToString` for 2-D. This is the first thing everyone hits when debugging.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: '`nums.equals(other)` compares references',
        body: 'It answers "are these the same array object?", not "do they hold the same values". Use `Arrays.equals(a, b)`. The same applies to using an array as a `HashMap` key — it hashes by identity, which is almost never what you want.',
      },
      {
        kind: 'code',
        caption: 'Filling a DP table',
        code: `int[][] dp = new int[m][n];
for (int[] row : dp) Arrays.fill(row, -1);     // 2-D fill needs the loop

long[] dist = new long[n];
Arrays.fill(dist, Long.MAX_VALUE);             // Dijkstra initialisation`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: '`Arrays.asList` on an `int[]` does not do what you expect',
        body: '`Arrays.asList(intArray)` produces a `List<int[]>` with **one** element — the array itself — because generics cannot hold primitives. To get a `List<Integer>`, use `Arrays.stream(nums).boxed().toList()`.',
      },
      {
        kind: 'code',
        caption: 'Converting between arrays and lists',
        code: `List<Integer> list = Arrays.stream(nums).boxed().toList();
int[] back = list.stream().mapToInt(Integer::intValue).toArray();

String[] arr = strList.toArray(new String[0]);`,
      },
    ],
    keyTakeaways: [
      '`Arrays.toString` for printing; `deepToString` for 2-D.',
      '`Arrays.equals`, not `.equals`, to compare contents.',
      '`Arrays.fill` initialises; 2-D needs a loop over the rows.',
      '`Arrays.asList` on an `int[]` gives a one-element list.',
    ],
    practice: {
      prompt: 'Print an `int[]` with `System.out.println` and then with `Arrays.toString`. Then try `Arrays.asList(intArray).size()` and work out why it is 1.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-14.7',
    language: 'java',
    summary: 'Use the Collections utility class for lists, sets and maps.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: '`java.util.Collections` is the same idea as `Arrays`, but for the Collection Framework. A handful of its methods come up constantly in DSA.',
      },
      {
        kind: 'code',
        code: `Collections.sort(list);                     // natural order
Collections.sort(list, comparator);         // or list.sort(comparator)
Collections.reverse(list);                  // in place
Collections.shuffle(list);

Collections.max(list);
Collections.min(list);
Collections.max(list, comparator);

Collections.frequency(list, x);             // how many times x appears
Collections.swap(list, i, j);
Collections.nCopies(5, 0);                  // [0, 0, 0, 0, 0]

Collections.emptyList();                    // immutable empty
Collections.reverseOrder();                 // a descending Comparator`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: '`Collections.reverseOrder()` for max-heaps',
        body: '`new PriorityQueue<>(Collections.reverseOrder())` is one of the two standard ways to build a max-heap — the other being `Comparator.reverseOrder()`. They are equivalent; pick one and stay consistent.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'These mutate — they do not return a new collection',
        body: '`Collections.reverse(list)` returns `void` and reverses in place. `list = Collections.reverse(list)` does not compile, and expecting a copy is a common misreading. When you need the original preserved, copy first.',
      },
      {
        kind: 'code',
        caption: 'Sorting a list: two equivalent forms',
        code: `Collections.sort(list, comparator);     // older
list.sort(comparator);                  // Java 8+, preferred

// Descending
list.sort(Collections.reverseOrder());
list.sort(Comparator.reverseOrder());`,
      },
      {
        kind: 'text',
        body: '`Collections.unmodifiableList(...)` and the `synchronizedXxx` wrappers exist too, but neither comes up in DSA. Know they are there; you will not need them on a judge.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: '`Collections.emptyList()` is immutable',
        body: 'Returning it from a method is fine, but the caller cannot add to it — `UnsupportedOperationException`. If the result might be modified, return `new ArrayList<>()` instead.',
      },
    ],
    keyTakeaways: [
      '`Collections` is to collections what `Arrays` is to arrays.',
      'Prefer `list.sort(cmp)` over `Collections.sort(list, cmp)`.',
      'These methods mutate in place and return `void`.',
      '`Collections.emptyList()` cannot be added to.',
    ],
    practice: {
      prompt: 'Sort a list ascending, then reverse it, then sort descending directly. Confirm all three give what you expect, and try assigning the result of `Collections.reverse`.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-14.8',
    language: 'java',
    summary: 'Sort arrays and lists correctly, and know the algorithm behind each.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Sorting is the most common single operation in DSA after iteration, and Java has two entry points with genuinely different behaviour depending on whether you are sorting primitives or objects.',
      },
      {
        kind: 'code',
        code: `Arrays.sort(intArray);                  // primitives — dual-pivot quicksort
Arrays.sort(objectArray);               // objects — TimSort (merge sort)
Arrays.sort(objectArray, comparator);

list.sort(comparator);                  // TimSort
Collections.sort(list);                 // same thing`,
      },
      {
        kind: 'table',
        headers: ['Input', 'Algorithm', 'Time', 'Stable?'],
        rows: [
          ['`int[]`, `long[]`…', 'Dual-pivot quicksort', 'O(n log n) avg', '**No**'],
          ['`Integer[]`, `String[]`…', 'TimSort', 'O(n log n) worst', '**Yes**'],
          ['`List<T>`', 'TimSort', 'O(n log n) worst', '**Yes**'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Stability matters when you sort twice',
        body: 'A stable sort keeps equal elements in their original relative order. That lets you sort by a secondary key first, then by the primary — and the secondary ordering survives. Object sorts are stable; primitive sorts are not.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: '`Arrays.sort(int[])` cannot take a comparator',
        body: 'There is no such overload. To sort an `int[]` descending you must box it — `Arrays.stream(nums).boxed().sorted(Comparator.reverseOrder())` — or sort ascending and reverse manually. This is the single most-asked Java sorting question.',
      },
      {
        kind: 'code',
        caption: 'Descending sort of an int[], three ways',
        code: `// 1. Box, sort, unbox
int[] desc = Arrays.stream(nums).boxed()
                   .sorted(Comparator.reverseOrder())
                   .mapToInt(Integer::intValue).toArray();

// 2. Sort ascending, then reverse in place
Arrays.sort(nums);
for (int i = 0, j = nums.length - 1; i < j; i++, j--) {
    int t = nums[i]; nums[i] = nums[j]; nums[j] = t;
}

// 3. Negate, sort, negate back — only safe if no Integer.MIN_VALUE
for (int i = 0; i < nums.length; i++) nums[i] = -nums[i];
Arrays.sort(nums);
for (int i = 0; i < nums.length; i++) nums[i] = -nums[i];`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Quicksort on primitives has an O(n²) worst case',
        body: 'Dual-pivot quicksort can be forced quadratic by adversarial input, and some judges have such tests for `int[]`. If you hit an unexplained timeout on a sorting-heavy problem, boxing to `Integer[]` gets you TimSort\'s guaranteed O(n log n).',
      },
      {
        kind: 'code',
        caption: 'The 2-D sort you will write most',
        code: `// Sort intervals by start — the first line of most interval problems
Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));

// By end — activity selection / non-overlapping intervals
Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));`,
      },
      {
        kind: 'text',
        body: 'Note that `int[][]` is an array of *objects* (each row is an object), so it uses TimSort and **does** accept a comparator. Only truly primitive arrays are restricted.',
      },
    ],
    keyTakeaways: [
      'Primitives get quicksort (unstable); objects get TimSort (stable).',
      '`Arrays.sort(int[])` accepts no comparator — box or reverse.',
      '`int[][]` is an object array, so it does accept a comparator.',
      'Stability lets you sort by secondary key then primary.',
    ],
    practice: {
      prompt: 'Sort an `int[]` descending all three ways. Then sort a `List<int[]>` by second element ascending and confirm the sort is stable by checking equal elements keep their order.',
    },
  },
];
