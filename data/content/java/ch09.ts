import type { Lesson } from '../types';

/**
 * Java Chapter 9 — List Implementations.
 * ArrayList is the answer almost every time; this chapter explains why, and
 * makes the exceptions concrete rather than folklore.
 */
export const ch09: Lesson[] = [
  // -------------------------------------------------------------------------
  {
    topicId: 'java-9.1',
    language: 'java',
    summary: 'Use ArrayList fluently — the growable list you will reach for by default.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: '`ArrayList` is a **growable array**: internally a plain `Object[]` that gets replaced with a bigger one whenever it fills up. That implementation detail is worth knowing because it explains the whole cost model — instant indexing, cheap appends, expensive insertions at the front.',
      },
      {
        kind: 'code',
        caption: 'The methods you will actually use',
        code: `List<Integer> list = new ArrayList<>();

list.add(10);              // append — O(1) amortised
list.add(0, 5);            // insert at index — O(n), everything shifts
list.get(0);               // O(1)
list.set(0, 7);            // overwrite — O(1)
list.remove(0);            // remove by INDEX — O(n)
list.size();
list.isEmpty();
list.contains(10);         // O(n) — a linear scan
list.indexOf(10);          // O(n), or -1
list.clear();`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: '`remove(int)` versus `remove(Object)`',
        body: 'On a `List<Integer>`, `list.remove(2)` removes the element **at index 2**, while `list.remove(Integer.valueOf(2))` removes the **value** 2. Java picks the overload by static type, so both compile and they do completely different things. This catches everyone once.',
      },
      {
        kind: 'text',
        body: 'Appending is *amortised* O(1). Occasionally the backing array is full, so Java allocates one about 1.5× larger and copies everything across. Spread over all the appends, that cost averages out to constant.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Preallocate when you know the size',
        body: '`new ArrayList<>(1000)` sets the initial capacity, avoiding repeated grow-and-copy cycles. It does not create 1000 elements — `size()` is still 0. Worth doing when you know roughly how many items are coming.',
      },
      {
        kind: 'code',
        caption: 'Creating one with contents',
        code: `List<Integer> a = new ArrayList<>(List.of(1, 2, 3));   // mutable copy
List<Integer> b = List.of(1, 2, 3);                   // IMMUTABLE — add() throws
List<Integer> c = Arrays.asList(1, 2, 3);             // fixed-size — add() throws,
                                                       // but set() works
List<Integer> d = new ArrayList<>(otherList);          // copy of another list`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: '`List.of` and `Arrays.asList` are not mutable',
        body: 'Both throw `UnsupportedOperationException` at runtime — not compile time — when you call `add`. If you need to modify, wrap in `new ArrayList<>(...)`. This surprises people who use `List.of` to build test data and then try to append.',
      },
    ],
    keyTakeaways: [
      '`ArrayList` is a growable array: O(1) index and append, O(n) front insertion.',
      '`remove(int)` is by index; `remove(Object)` is by value.',
      'Growth is amortised O(1) — occasional copy, constant on average.',
      '`List.of` and `Arrays.asList` produce immutable or fixed-size lists.',
    ],
    practice: {
      prompt: 'Build a `List<Integer>` of 1..10, then remove the value 5 and the element at index 5. Confirm they do different things — that is the overload trap made concrete.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-9.2',
    language: 'java',
    summary: 'Understand LinkedList, and why its reputation oversells it.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: '`LinkedList` is a doubly linked list: each node holds a value plus references to its neighbours. Textbooks say it gives O(1) insertion and deletion, which is true — but only **once you already hold a reference to the node**. Getting there is the expensive part, and that caveat is what makes the reputation misleading.',
      },
      {
        kind: 'table',
        headers: ['Operation', 'ArrayList', 'LinkedList'],
        rows: [
          ['`get(i)`', 'O(1)', '**O(n)** — walks from an end'],
          ['`add(x)` at end', 'O(1)', 'O(1)'],
          ['`add(0, x)` at front', 'O(n)', '**O(1)**'],
          ['`remove(0)`', 'O(n)', '**O(1)**'],
          ['`add(i, x)` in the middle', 'O(n) shift', 'O(n) **walk** + O(1) splice'],
          ['Memory per element', 'Just the value', 'Value + 2 references'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Indexing a LinkedList in a loop is O(n²)',
        body: '`for (int i = 0; i < list.size(); i++) list.get(i);` walks from the head every single iteration. On an `ArrayList` this loop is O(n); on a `LinkedList` it is O(n²). Use a for-each loop or an iterator, which walk once.',
      },
      {
        kind: 'code',
        code: `// O(n^2) on a LinkedList — each get() restarts the walk
for (int i = 0; i < list.size(); i++) sum += list.get(i);

// O(n) — the iterator keeps its place
for (int x : list) sum += x;`,
      },
      {
        kind: 'text',
        body: 'In practice `ArrayList` wins almost everywhere, even for some operations where `LinkedList` has the better complexity on paper. Contiguous memory means the CPU cache can prefetch; a linked list scatters nodes across the heap and every hop is a potential cache miss.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The one genuine reason to choose it',
        body: '`LinkedList` implements both `List` and `Deque`. If you truly need indexed access *and* O(1) operations at both ends in the same object, it is the only standard class that offers both. For queue behaviour alone, `ArrayDeque` is faster.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'This class is not what LeetCode linked-list problems mean',
        body: 'Problems like Reverse Linked List give you a bare `ListNode` class with a `next` field, and you manipulate the pointers yourself. `java.util.LinkedList` is a different thing entirely — do not confuse the library container with the data structure you are asked to implement.',
      },
    ],
    keyTakeaways: [
      '`LinkedList` is O(1) at the ends but O(n) to reach any index.',
      'Indexing it inside a loop is O(n²) — use for-each.',
      '`ArrayList` usually wins in practice thanks to cache locality.',
      'Choose it only when you need `List` and `Deque` behaviour in one object.',
    ],
    practice: {
      prompt: 'Fill an `ArrayList` and a `LinkedList` with 100,000 integers, then sum each with an index loop and time them. The gap makes the O(n²) trap unforgettable.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-9.3',
    language: 'java',
    summary: 'Recognise Vector and know why it is no longer used.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: '`Vector` is `ArrayList`\'s older sibling from Java 1.0. It does the same job, with one difference: **every method is synchronised**, meaning it takes a lock for thread safety. That sounds like a bonus and is almost always a cost.',
      },
      {
        kind: 'code',
        code: `Vector<Integer> v = new Vector<>();
v.add(1);
v.get(0);
v.size();        // the API is essentially ArrayList's`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'The synchronisation is usually useless and never free',
        body: 'Locking on every `add` and `get` slows down single-threaded code for no benefit — and in multi-threaded code it is not sufficient anyway, because a sequence like "check size then get" still races between the two calls. It gives you the cost of safety without the guarantee.',
      },
      {
        kind: 'text',
        body: 'The modern answers: use `ArrayList` for ordinary code, and `Collections.synchronizedList(...)` or `CopyOnWriteArrayList` when you genuinely need thread safety. `Vector` survives only for backwards compatibility.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Why it is still worth a lesson',
        body: 'You will meet `Vector` in older code and in tutorials that have not aged well — and `Stack` extends it, which is exactly why `Stack` is also discouraged. Recognising the family explains both recommendations at once.',
      },
      {
        kind: 'table',
        headers: ['Want', 'Use'],
        rows: [
          ['A growable list (99% of cases)', '`ArrayList`'],
          ['Thread-safe list, rare writes', '`CopyOnWriteArrayList`'],
          ['Thread-safe list, general', '`Collections.synchronizedList(new ArrayList<>())`'],
          ['A queue between threads', '`ConcurrentLinkedQueue`, `BlockingQueue`'],
        ],
      },
    ],
    keyTakeaways: [
      '`Vector` is a synchronised `ArrayList` from Java 1.0.',
      'The locking costs speed and does not make compound operations safe.',
      'Use `ArrayList`; use the explicit concurrent collections when you need them.',
      'It matters mainly because `Stack` inherits from it.',
    ],
    practice: {
      prompt: 'Look up `Vector` in the JDK source and find the `synchronized` keyword on `add`. Seeing it there explains the performance advice better than any benchmark.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-9.4',
    language: 'java',
    summary: 'Know the legacy Stack class, and why ArrayDeque replaced it.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: '`java.util.Stack` is the obvious-looking way to get a stack in Java, and it works. It is also discouraged — it extends `Vector`, so it inherits the synchronisation cost *and* something stranger: an iteration order that runs bottom-to-top, the opposite of pop order.',
      },
      {
        kind: 'code',
        code: `Stack<Integer> st = new Stack<>();
st.push(1);
st.push(2);
st.peek();       // 2 — look at the top
st.pop();        // 2 — remove the top
st.isEmpty();
st.search(1);    // 1-based distance from the top — rarely useful`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Iterating a `Stack` gives you bottom-to-top',
        body: 'Because it extends `Vector`, a for-each loop walks it in *insertion* order — the reverse of the order you would pop. Code that prints a stack while debugging shows it upside down, which is genuinely confusing when you are already unsure about your logic.',
      },
      {
        kind: 'text',
        body: 'The modern replacement is `ArrayDeque`, used through the `Deque` interface. It is faster, unsynchronised, and iterates top-first — which matches how you think about a stack.',
      },
      {
        kind: 'code',
        caption: 'The recommended form',
        code: `Deque<Integer> stack = new ArrayDeque<>();

stack.push(1);        // add at the FRONT
stack.push(2);
stack.peek();         // 2
stack.pop();          // 2
stack.isEmpty();

// Iterating gives 1, then 2 popped order — top first`,
      },
      {
        kind: 'table',
        headers: ['', '`Stack`', '`ArrayDeque`'],
        rows: [
          ['Synchronised', 'Yes (slow)', 'No'],
          ['Iteration order', 'Bottom → top', 'Top → bottom'],
          ['Interface', 'Extends `Vector`', 'Implements `Deque`'],
          ['Recommended', 'No', '**Yes**'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Both are fine on LeetCode',
        body: '`Stack` will pass every judge. Use `ArrayDeque` anyway — it is what an interviewer expects to see, and building the habit costs nothing. Just remember `push`/`pop`/`peek` all operate on the *front* of an `ArrayDeque`.',
      },
    ],
    keyTakeaways: [
      '`Stack` extends `Vector`, so it is synchronised and slow.',
      'Its iteration order is bottom-to-top — the reverse of pop order.',
      '`Deque<Integer> stack = new ArrayDeque<>()` is the modern form.',
      'On `ArrayDeque`, push/pop/peek all work at the front.',
    ],
    practice: {
      prompt: 'Solve Valid Parentheses with `ArrayDeque`. Then push three values into a `Stack` and print it with a for-each loop — the reversed order is the point of the lesson.',
      leetcode: { title: 'Valid Parentheses', slug: 'valid-parentheses' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-9.5',
    language: 'java',
    summary: 'Add, remove and access elements, and know which operations shift the array.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'The whole `List` API comes down to four verbs — add, get, set, remove — and the only thing worth memorising is **which of them shift elements**. Anything that changes positions in the middle of an `ArrayList` is O(n), because everything after it has to move.',
      },
      {
        kind: 'code',
        caption: 'Adding',
        code: `list.add(x);              // append at the end — O(1)
list.add(i, x);           // insert at index i — O(n), shifts right
list.addAll(other);       // append every element of another collection
list.addAll(i, other);    // insert a whole collection at i`,
      },
      {
        kind: 'code',
        caption: 'Reading and writing',
        code: `list.get(i);              // O(1)
list.set(i, x);           // overwrite — O(1), no shifting
list.indexOf(x);          // first index of a value, or -1 — O(n)
list.lastIndexOf(x);
list.contains(x);         // O(n)
list.subList(a, b);       // a VIEW of [a, b) — not a copy!`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: '`subList` returns a view, not a copy',
        body: 'Modifying the sublist modifies the original list, and modifying the original structurally makes the sublist throw `ConcurrentModificationException`. When you want an independent copy, write `new ArrayList<>(list.subList(a, b))`.',
      },
      {
        kind: 'code',
        caption: 'Removing',
        code: `list.remove(i);                   // by INDEX — O(n)
list.remove(Integer.valueOf(x));  // by VALUE — O(n)
list.removeIf(x -> x < 0);        // conditional, safe during iteration
list.clear();`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Removing inside a forward index loop skips elements',
        body: 'After `list.remove(i)`, everything shifts left — so the element that was at `i + 1` is now at `i`, and `i++` steps straight past it. Either loop **backwards**, or use `removeIf`, or use an explicit iterator.',
      },
      {
        kind: 'code',
        code: `// BROKEN — skips elements
for (int i = 0; i < list.size(); i++)
    if (list.get(i) < 0) list.remove(i);

// FIXED — backwards, so shifting never affects unvisited indices
for (int i = list.size() - 1; i >= 0; i--)
    if (list.get(i) < 0) list.remove(i);

// BEST
list.removeIf(x -> x < 0);`,
      },
    ],
    keyTakeaways: [
      '`get` and `set` are O(1); inserting or removing in the middle is O(n).',
      '`subList` is a view — wrap it in `new ArrayList<>(...)` for a copy.',
      'Removing in a forward index loop skips elements.',
      '`removeIf` is the cleanest conditional removal.',
    ],
    practice: {
      prompt: 'Build a list of 1..10 and remove every even number with a forward index loop. Note which survive, work out why, then fix it by looping backwards.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-9.6',
    language: 'java',
    summary: 'Traverse lists with the right loop for the job.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Three ways to walk a list, and the choice comes down to two questions: **do I need the index**, and **am I going to modify anything**. Answer those and the loop picks itself.',
      },
      {
        kind: 'code',
        code: `// 1. For-each — no index, read-only. The default.
for (int x : list) System.out.println(x);

// 2. Index loop — when you need the position, or compare neighbours
for (int i = 0; i < list.size(); i++)
    if (i > 0 && list.get(i) < list.get(i - 1)) return false;

// 3. Iterator — the only one that can remove safely mid-walk
Iterator<Integer> it = list.iterator();
while (it.hasNext())
    if (it.next() < 0) it.remove();`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Prefer for-each unless you need the index',
        body: 'It removes every chance of an off-by-one error and reads better. And on a `LinkedList` it is the difference between O(n) and O(n²), because the iterator holds its position instead of restarting the walk on every `get(i)`.',
      },
      {
        kind: 'code',
        caption: 'Walking backwards',
        code: `for (int i = list.size() - 1; i >= 0; i--)
    System.out.println(list.get(i));

// Or, for a Deque:
Iterator<Integer> it = deque.descendingIterator();`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Auto-unboxing null throws NullPointerException',
        body: 'A `List<Integer>` can contain `null`. Writing `for (int x : list)` unboxes each element, and unboxing `null` throws — with a stack trace pointing at the loop rather than at whatever inserted the null. Iterate as `Integer` when nulls are possible.',
      },
      {
        kind: 'code',
        caption: 'Streams — readable, but know the cost',
        code: `list.forEach(System.out::println);
int sum = list.stream().mapToInt(Integer::intValue).sum();
List<Integer> evens = list.stream().filter(x -> x % 2 == 0).toList();`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Streams are slower than plain loops',
        body: 'They are excellent for readability in application code. In a tight DSA loop they add overhead and make debugging harder — you cannot step through a stream as easily. Use plain loops for the hot path and streams where clarity matters more.',
      },
    ],
    keyTakeaways: [
      'For-each by default; index loop when you need positions; iterator to remove.',
      'For-each on a `LinkedList` avoids the O(n²) indexing trap.',
      'Unboxing a `null` element throws `NullPointerException`.',
      'Streams read well but cost performance — avoid them in hot loops.',
    ],
    practice: {
      prompt: 'Write a method that checks whether a list is sorted. You need to compare neighbours, so this is a genuine case for the index loop — then try to write it with for-each and see why it is awkward.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-9.7',
    language: 'java',
    summary: 'Recognise where lists are the right tool in DSA problems.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Lists show up in three recurring roles in DSA, and being able to name which role you are in makes the API choices obvious.',
      },
      { kind: 'heading', text: '1. Collecting a result of unknown size' },
      {
        kind: 'code',
        code: `List<List<Integer>> res = new ArrayList<>();

void backtrack(int start) {
    res.add(new ArrayList<>(path));      // COPY — see the trap below
    for (int i = start; i < nums.length; i++) { ... }
}`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Adding `path` stores a reference, not a snapshot',
        body: 'In backtracking, `res.add(path)` puts the *same* list object in every slot — and since you keep mutating `path`, every entry ends up identical, usually empty. Always `new ArrayList<>(path)`. This is the most common backtracking bug in Java.',
      },
      { kind: 'heading', text: '2. When the answer type is a List' },
      {
        kind: 'code',
        code: `// LeetCode signatures constantly return List
public List<Integer> inorderTraversal(TreeNode root)
public List<List<String>> groupAnagrams(String[] strs)

// Converting an int[] to a List<Integer> — no one-liner, sadly
List<Integer> list = new ArrayList<>();
for (int x : arr) list.add(x);

// Or with streams:
List<Integer> list = Arrays.stream(arr).boxed().toList();

// And back again:
int[] arr = list.stream().mapToInt(Integer::intValue).toArray();`,
      },
      { kind: 'heading', text: '3. Adjacency lists for graphs' },
      {
        kind: 'code',
        code: `List<List<Integer>> adj = new ArrayList<>();
for (int i = 0; i < n; i++) adj.add(new ArrayList<>());

for (int[] e : edges) {
    adj.get(e[0]).add(e[1]);
    adj.get(e[1]).add(e[0]);        // undirected
}

for (int next : adj.get(node)) { ... }`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Do not use a List for membership testing',
        body: 'If you find yourself calling `list.contains(x)` inside a loop, that is O(n²). Swap to a `HashSet` and it becomes O(n). Lists are for *ordered collections*, not for lookups — that is the single most valuable distinction in this chapter.',
      },
      {
        kind: 'text',
        body: 'When performance really matters, prefer `int[]` over `List<Integer>`: no boxing, contiguous memory, and no per-element object overhead. Use a list when the size is genuinely unknown ahead of time.',
      },
    ],
    keyTakeaways: [
      'Lists collect results, satisfy LeetCode return types, and hold adjacency.',
      'In backtracking always store a **copy** of the path.',
      '`list.contains` in a loop is O(n²) — use a `HashSet`.',
      'Prefer `int[]` when the size is known and speed matters.',
    ],
    practice: {
      prompt: 'Build an adjacency list from an edge array and run a BFS over it. Then convert an `int[]` to a `List<Integer>` and back — those conversions come up constantly and are worth having ready.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-9.8',
    language: 'java',
    summary: 'Settle the ArrayList vs LinkedList question with a rule you can apply instantly.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'This question gets asked in interviews constantly, and the textbook answer ("LinkedList is better for insertion") is misleading. Here is the honest version.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The rule: use ArrayList. Almost always.',
        body: 'Use `ArrayList` unless you specifically need O(1) insertion or removal **at the front**, in which case use `ArrayDeque` — not `LinkedList`. That leaves `LinkedList` for the narrow case where you need `List` and `Deque` behaviour in a single object.',
      },
      {
        kind: 'table',
        headers: ['You need', 'Use', 'Not'],
        rows: [
          ['Indexed access', '`ArrayList`', '`LinkedList` — O(n) per get'],
          ['Append at the end', '`ArrayList`', 'Both are O(1); ArrayList is faster'],
          ['Queue behaviour', '`ArrayDeque`', '`LinkedList` — slower'],
          ['Stack behaviour', '`ArrayDeque`', '`Stack` — synchronised'],
          ['Both ends + indexing', '`LinkedList`', '— the one real use'],
        ],
      },
      { kind: 'heading', text: 'Why the theory misleads' },
      {
        kind: 'text',
        body: 'The complexity table says `LinkedList.add(0, x)` is O(1) and `ArrayList.add(0, x)` is O(n). True — but `ArrayList`\'s O(n) is a single `System.arraycopy`, a tight memcpy the CPU executes extremely fast, while `LinkedList`\'s O(1) allocates a node object and follows pointers scattered across the heap. For lists of a few thousand elements, `ArrayList` frequently wins even here.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Cache locality is the missing variable',
        body: 'An `ArrayList` stores its elements contiguously, so the CPU prefetches the next several while working on the current one. A `LinkedList` scatters nodes, and every hop risks a cache miss costing hundreds of cycles. Big-O ignores this entirely, which is why measured results defy the table.',
      },
      { kind: 'heading', text: 'What to say in an interview' },
      {
        kind: 'text',
        body: 'Give the complexity table, then add the practical caveat — that `ArrayList` usually wins in practice because of memory locality, and that `ArrayDeque` beats `LinkedList` for queue and stack behaviour. Knowing *both* the theory and where it breaks down is what a strong answer looks like.',
      },
      {
        kind: 'code',
        caption: 'The defaults worth internalising',
        code: `List<Integer>  list  = new ArrayList<>();     // general purpose
Deque<Integer> stack = new ArrayDeque<>();    // stack
Queue<Integer> queue = new ArrayDeque<>();    // queue
Set<Integer>   seen  = new HashSet<>();       // membership
Map<K,V>       map   = new HashMap<>();       // lookup`,
      },
    ],
    keyTakeaways: [
      'Default to `ArrayList`; use `ArrayDeque` when you need a fast front.',
      '`LinkedList` is only right when you need `List` and `Deque` together.',
      'Cache locality is why `ArrayList` beats the complexity table.',
      'A strong interview answer gives the theory *and* the practical caveat.',
    ],
    practice: {
      prompt: 'Benchmark `add(0, x)` on both classes for 1,000 and 100,000 elements. The crossover point — where LinkedList finally wins — is further out than the complexity table suggests, and finding it makes the lesson stick.',
    },
  },
];
