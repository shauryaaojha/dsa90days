import type { Lesson } from '../types';

/**
 * Java Chapter 12 — Set and Map Collections.
 * The highest-value chapter in the Java track: HashMap and HashSet turn more
 * O(n^2) solutions into O(n) than every other technique combined.
 */
export const ch12: Lesson[] = [
  // -------------------------------------------------------------------------
  {
    topicId: 'java-12.1',
    language: 'java',
    summary: 'Use HashSet for O(1) membership — the most reusable optimisation in DSA.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A `HashSet` holds **unique** elements and answers "is this in here?" in O(1) average time. Swapping a list for a set when you are testing membership repeatedly is the single most reusable optimisation a beginner can learn — it is what turns a nested loop into one pass.',
      },
      {
        kind: 'code',
        code: `Set<Integer> seen = new HashSet<>();

seen.add(5);
seen.add(5);              // ignored — already present
seen.size();              // 1
seen.contains(5);         // true — O(1)
seen.remove(5);
seen.isEmpty();`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: '`add` returns false on a duplicate',
        body: 'That gives you duplicate detection in one line: `if (!seen.add(x)) return true;` is a complete "contains duplicate" check with no separate `contains` call — one hash lookup instead of two.',
      },
      {
        kind: 'code',
        caption: 'The optimisation, made concrete',
        code: `// O(n^2) — contains on a List is a linear scan
List<Integer> seen = new ArrayList<>();
for (int x : nums) {
    if (seen.contains(x)) return true;      // O(n)
    seen.add(x);
}

// O(n) — identical shape, O(1) lookup
Set<Integer> seen = new HashSet<>();
for (int x : nums) {
    if (!seen.add(x)) return true;          // O(1)
}`,
      },
      {
        kind: 'text',
        body: 'With n = 10⁵ the first version runs about 10¹⁰ operations and times out; the second does 10⁵ and finishes instantly. Nothing changed but the container.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'A HashSet has no order at all',
        body: 'Iteration order is neither insertion order nor sorted order — it depends on hash codes and can change between runs. If the expected output is ordered, sort explicitly or use `LinkedHashSet` / `TreeSet`.',
      },
      {
        kind: 'code',
        caption: 'Bulk operations',
        code: `a.addAll(b);        // union
a.retainAll(b);     // intersection
a.removeAll(b);     // difference
a.containsAll(b);   // subset test

Set<Integer> s = new HashSet<>(list);   // deduplicate a list in one line`,
      },
    ],
    keyTakeaways: [
      '`HashSet` gives O(1) membership versus O(n) for a list.',
      '`add` returns false on a duplicate — a free duplicate check.',
      'Iteration order is undefined and may vary between runs.',
      '`retainAll` / `removeAll` do set intersection and difference.',
    ],
    practice: {
      prompt: 'Solve Contains Duplicate with `!seen.add(x)`. Then time the `ArrayList` version against the `HashSet` version on 100,000 elements — the gap is the whole lesson.',
      leetcode: { title: 'Contains Duplicate', slug: 'contains-duplicate' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-12.2',
    language: 'java',
    summary: 'Use LinkedHashSet when you need uniqueness and insertion order.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: '`LinkedHashSet` is a `HashSet` that also remembers **the order you inserted things**. It keeps O(1) operations and adds a doubly linked list threading the elements together, so iteration is predictable.',
      },
      {
        kind: 'code',
        code: `Set<Integer> hash = new HashSet<>();
Set<Integer> linked = new LinkedHashSet<>();

for (int x : new int[]{3, 1, 2}) { hash.add(x); linked.add(x); }

System.out.println(hash);      // [1, 2, 3] — hash order, not insertion
System.out.println(linked);    // [3, 1, 2] — exactly as inserted`,
        output: '[1, 2, 3]\n[3, 1, 2]',
      },
      {
        kind: 'table',
        headers: ['', 'HashSet', 'LinkedHashSet', 'TreeSet'],
        rows: [
          ['Order', 'None', 'Insertion', 'Sorted'],
          ['add / contains', 'O(1)', 'O(1)', 'O(log n)'],
          ['Memory', 'Lowest', 'Slightly more', 'Higher'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Use it when the answer must preserve input order',
        body: 'Problems like "return the unique elements in the order they first appeared" need exactly this. With a plain `HashSet` you would have to track order separately; `LinkedHashSet` does it for free at essentially no cost.',
      },
      {
        kind: 'code',
        caption: 'Deduplicate while keeping order',
        code: `// Preserves first-seen order — a HashSet would scramble it
List<Integer> unique = new ArrayList<>(new LinkedHashSet<>(list));`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Insertion order means *first* insertion',
        body: 'Re-adding an element that is already present does **not** move it to the end — the original position is kept. If you need "most recently used last", that is `LinkedHashMap` with access order, covered in lesson 12.5.',
      },
    ],
    keyTakeaways: [
      '`LinkedHashSet` = `HashSet` + insertion order, still O(1).',
      'Ideal when the answer must preserve first-appearance order.',
      'Re-adding an existing element does not change its position.',
      'Costs slightly more memory than `HashSet`, and nothing in time.',
    ],
    practice: {
      prompt: 'Insert 3, 1, 2 into all three set types and print each. Then re-add 3 to the `LinkedHashSet` and confirm it stays at the front.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-12.3',
    language: 'java',
    summary: 'Use TreeSet for sorted order and nearest-neighbour queries.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: '`TreeSet` keeps its elements **sorted** at all times, using a red-black tree. Operations cost O(log n) rather than O(1) — you pay that price for two abilities a hash set cannot offer: ordered iteration, and "find the nearest element to x".',
      },
      {
        kind: 'code',
        code: `TreeSet<Integer> ts = new TreeSet<>(List.of(5, 1, 3));

System.out.println(ts);       // [1, 3, 5] — always sorted

ts.first();                   // 1
ts.last();                    // 5
ts.higher(3);                 // 5  — strictly greater
ts.ceiling(3);                // 3  — greater OR equal
ts.lower(3);                  // 1  — strictly smaller
ts.floor(3);                  // 3  — smaller OR equal`,
        output: '[1, 3, 5]',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The four navigation methods are why TreeSet exists',
        body: '`ceiling`/`floor`/`higher`/`lower` answer "what is the closest value to x?" in O(log n). No hash structure can do this — it needs order. Remember them as: **ceiling and floor include equality; higher and lower are strict.**',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'They return `null`, not a sentinel',
        body: '`ts.higher(100)` on a set whose maximum is 5 returns `null`. Assigning that into an `int` throws `NullPointerException` via unboxing. Always receive into an `Integer` and check before using.',
      },
      {
        kind: 'code',
        caption: 'Range views',
        code: `ts.headSet(3);           // everything < 3
ts.tailSet(3);           // everything >= 3
ts.subSet(1, 5);         // [1, 5) — inclusive start, exclusive end

ts.pollFirst();          // remove and return the smallest
ts.pollLast();           // remove and return the largest

ts.descendingSet();      // a reversed view`,
      },
      {
        kind: 'text',
        body: 'These are **views**, not copies — they reflect later changes to the underlying set, and modifying them modifies the original. That makes them cheap, and occasionally surprising.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Elements must be comparable',
        body: 'A `TreeSet` needs an ordering. Custom classes must implement `Comparable`, or you must pass a `Comparator` to the constructor — otherwise you get `ClassCastException` at runtime on the first insert that needs a comparison.',
      },
      {
        kind: 'code',
        code: `TreeSet<Task> ts = new TreeSet<>(Comparator.comparingInt(t -> t.priority));`,
      },
    ],
    keyTakeaways: [
      '`TreeSet` is always sorted; operations cost O(log n).',
      '`ceiling`/`floor` include equality; `higher`/`lower` are strict.',
      'They return `null` when nothing qualifies — never unbox blindly.',
      'Custom elements need `Comparable` or a `Comparator`.',
    ],
    practice: {
      prompt: 'Build a `TreeSet` of 1, 3, 5 and call all four navigation methods with 3 and with 4. Predict each answer first — that exercise is what makes the naming stick.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-12.4',
    language: 'java',
    summary: 'Use HashMap — the container behind more accepted solutions than any other.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'A `HashMap` stores **key → value** pairs with O(1) average lookup. It is behind more accepted solutions than any other container: frequency counts, "have I seen this and where?", graph adjacency, memoisation. If you master one class in this chapter, make it this one.',
      },
      {
        kind: 'code',
        code: `Map<String,Integer> map = new HashMap<>();

map.put("a", 1);                  // insert or overwrite
map.get("a");                     // 1
map.get("zz");                    // null — NOT an exception
map.getOrDefault("zz", 0);        // 0 — usually what you want
map.containsKey("a");
map.remove("a");
map.size();`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: '`get` returns null for a missing key',
        body: 'Assigning that into an `int` throws `NullPointerException` on unboxing, and the stack trace points at the assignment rather than the missing key. Use `getOrDefault` whenever a key might be absent — it is the single habit that prevents most `HashMap` crashes.',
      },
      {
        kind: 'code',
        caption: 'The methods that remove boilerplate',
        code: `map.merge(key, 1, Integer::sum);            // insert-or-add — frequency counting
map.computeIfAbsent(key, k -> new ArrayList<>()).add(x);   // grouping
map.putIfAbsent(key, value);               // only if not already there
map.compute(key, (k, v) -> v == null ? 1 : v + 1);`,
      },
      {
        kind: 'text',
        body: '`merge` and `computeIfAbsent` deserve special attention — between them they replace the "check whether the key exists, create it if not, then update" pattern that otherwise fills half your map code.',
      },
      {
        kind: 'code',
        caption: 'The one-pass Two Sum',
        code: `Map<Integer,Integer> seen = new HashMap<>();      // value -> index

for (int i = 0; i < nums.length; i++) {
    int need = target - nums[i];

    if (seen.containsKey(need))                  // look FIRST
        return new int[]{seen.get(need), i};

    seen.put(nums[i], i);                        // then insert
}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Look before you insert',
        body: 'If you insert first and then search for the complement, an element whose value is exactly half the target matches itself and you return `[i, i]`. Looking first is what makes the one-pass version correct.',
      },
    ],
    keyTakeaways: [
      '`HashMap` gives O(1) average key lookup.',
      '`get` returns `null` on a miss — prefer `getOrDefault`.',
      '`merge` counts; `computeIfAbsent` groups.',
      'In Two Sum, look before you insert.',
    ],
    practice: {
      prompt: 'Solve Two Sum in one pass. Then build a frequency map twice — once with `getOrDefault` and `put`, once with `merge` — and keep whichever reads better to you.',
      leetcode: { title: 'Two Sum', slug: 'two-sum' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-12.5',
    language: 'java',
    summary: 'Use LinkedHashMap for insertion order, and access order for LRU caches.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: '`LinkedHashMap` is a `HashMap` that remembers order. By default that is **insertion order** — but it has a second mode, **access order**, which reorders on every `get` and turns the class into a ready-made LRU cache.',
      },
      {
        kind: 'code',
        code: `Map<String,Integer> m = new LinkedHashMap<>();
m.put("c", 3); m.put("a", 1); m.put("b", 2);

System.out.println(m);      // {c=3, a=1, b=2} — insertion order preserved`,
        output: '{c=3, a=1, b=2}',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Access-order mode is the LRU trick',
        body: 'The three-argument constructor takes `accessOrder = true`. In that mode every `get` moves the entry to the end, so the *first* entry is always the least recently used. Override `removeEldestEntry` and you have an LRU cache in about six lines.',
      },
      {
        kind: 'code',
        caption: 'An LRU cache, almost for free',
        code: `class LRUCache extends LinkedHashMap<Integer,Integer> {
    private final int capacity;

    LRUCache(int capacity) {
        super(16, 0.75f, true);        // true = ACCESS order
        this.capacity = capacity;
    }

    @Override
    protected boolean removeEldestEntry(Map.Entry<Integer,Integer> eldest) {
        return size() > capacity;      // evict automatically when too big
    }

    public int get(int key)             { return super.getOrDefault(key, -1); }
    public void put(int key, int value) { super.put(key, value); }
}`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Interviewers usually want the manual version',
        body: 'The `LinkedHashMap` trick is legitimate and worth knowing, but "implement an LRU cache" is really asking for a `HashMap` plus your own doubly linked list. Write that version too — the built-in shortcut answers the question without demonstrating what is being tested.',
      },
      {
        kind: 'text',
        body: 'For ordinary problems, use `LinkedHashMap` when the output must preserve the order keys were first inserted — for instance grouping results that must come back in input order.',
      },
    ],
    keyTakeaways: [
      '`LinkedHashMap` preserves insertion order by default.',
      'Access-order mode reorders on `get`, making LRU trivial.',
      '`removeEldestEntry` gives automatic eviction.',
      'Interviewers want the manual HashMap + linked list version.',
    ],
    practice: {
      prompt: 'Build the `LRUCache` above and verify eviction with capacity 2. Then implement the same thing manually with a `HashMap` and your own node class — that is the version worth being able to write.',
      leetcode: { title: 'LRU Cache', slug: 'lru-cache' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-12.6',
    language: 'java',
    summary: 'Use TreeMap for sorted keys and nearest-key queries.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: '`TreeMap` is the map counterpart of `TreeSet`: keys are kept **sorted**, operations are O(log n), and you get the navigation methods that let you ask "what is the nearest key to x?". That question is the entire reason to accept the slower lookups.',
      },
      {
        kind: 'code',
        code: `TreeMap<Integer,String> tm = new TreeMap<>();
tm.put(5, "five"); tm.put(1, "one"); tm.put(3, "three");

System.out.println(tm);       // {1=one, 3=three, 5=five} — sorted by key

tm.firstKey();                // 1
tm.lastKey();                 // 5
tm.firstEntry();              // 1=one
tm.floorKey(4);               // 3 — largest key <= 4
tm.ceilingKey(4);             // 5 — smallest key >= 4
tm.lowerKey(3);               // 1 — strictly less
tm.higherKey(3);              // 5 — strictly greater`,
        output: '{1=one, 3=three, 5=five}',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Where TreeMap is the only sensible answer',
        body: 'Calendar booking ("is there a conflict with the nearest event?"), stock-price lookups by timestamp, range counting, and the "my Time Map" family. Any time the question involves *nearest* or *range* on ordered keys, `HashMap` cannot help and `TreeMap` is the tool.',
      },
      {
        kind: 'code',
        caption: 'Range views and iteration',
        code: `tm.headMap(3);              // keys < 3
tm.tailMap(3);              // keys >= 3
tm.subMap(1, 5);            // [1, 5)

tm.descendingMap();         // reversed view
tm.pollFirstEntry();        // remove and return the smallest entry

for (var e : tm.entrySet()) { ... }        // iterates in sorted key order`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Navigation methods return `null`',
        body: '`tm.floorKey(0)` on a map whose smallest key is 1 returns `null`. Unboxing that into an `int` throws. Receive into an `Integer` and check — this is the same trap as `TreeSet`, and it catches people just as often.',
      },
      {
        kind: 'table',
        headers: ['', 'HashMap', 'TreeMap'],
        rows: [
          ['get / put', 'O(1)', 'O(log n)'],
          ['Key order', 'None', 'Sorted'],
          ['Nearest-key queries', 'Impossible', '**Yes**'],
          ['Use when', 'Plain lookup', 'Order or ranges matter'],
        ],
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Do not reach for TreeMap by default',
        body: 'It is genuinely slower, and most problems only need lookup. Use `HashMap` unless the problem asks something order-dependent — that is the decision rule, and it is nearly always clear from the prompt.',
      },
    ],
    keyTakeaways: [
      '`TreeMap` keeps keys sorted at O(log n) per operation.',
      '`floorKey`/`ceilingKey`/`lowerKey`/`higherKey` answer nearest-key questions.',
      'All of them return `null` when nothing qualifies.',
      'Default to `HashMap`; switch only when order or ranges matter.',
    ],
    practice: {
      prompt: 'Build a `TreeMap` with keys 1, 3, 5 and call all four navigation methods with 4. Then use `subMap` to count keys in a range — that is the shape of most `TreeMap` problems.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-12.7',
    language: 'java',
    summary: 'Use the core map methods, and prefer the ones that remove boilerplate.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Three methods cover most map usage — `put`, `get`, `containsKey` — but Java 8 added several that collapse common multi-line patterns into one call. Learning those is what makes map code short and readable.',
      },
      {
        kind: 'code',
        caption: 'The basics',
        code: `map.put(k, v);            // insert or overwrite; returns the OLD value or null
map.get(k);               // value, or null
map.getOrDefault(k, d);   // value, or d
map.containsKey(k);
map.containsValue(v);     // O(n) — scans every entry, avoid in loops`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: '`containsValue` is O(n)',
        body: 'A map indexes by key, not by value, so finding a value means scanning everything. If you need lookups in both directions, keep a second map from value to key.',
      },
      {
        kind: 'code',
        caption: 'The methods worth adopting',
        code: `// Frequency counting — one line instead of four
map.merge(key, 1, Integer::sum);

// equivalent to:
// map.put(key, map.getOrDefault(key, 0) + 1);

// Grouping — creates the list only when needed
map.computeIfAbsent(key, k -> new ArrayList<>()).add(value);

// equivalent to:
// if (!map.containsKey(key)) map.put(key, new ArrayList<>());
// map.get(key).add(value);

map.putIfAbsent(key, value);          // no-op if the key exists
map.compute(key, (k, v) -> v == null ? 1 : v + 1);
map.computeIfPresent(key, (k, v) -> v - 1);`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: '`merge` for counting, `computeIfAbsent` for grouping',
        body: 'Those two cover almost every map-building loop you will write. Getting them into muscle memory removes a lot of repetitive code and a lot of null checks.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: '`merge` removes the key when the function returns null',
        body: '`map.merge(k, -1, Integer::sum)` producing 0 keeps the key at 0 — but if your remapping function returns `null`, the entry is **deleted**. That is occasionally what you want (decrementing a count to zero), and a surprise otherwise.',
      },
      {
        kind: 'code',
        caption: 'A useful idiom: decrement and clean up',
        code: `// Sliding-window count maps often want the key gone at zero
map.merge(c, -1, (a, b) -> a + b == 0 ? null : a + b);

// now map.size() is a true count of DISTINCT characters in the window`,
      },
    ],
    keyTakeaways: [
      '`getOrDefault` avoids null; `merge` counts; `computeIfAbsent` groups.',
      '`containsValue` is O(n) — keep a reverse map if you need it.',
      '`put` returns the previous value, which is occasionally useful.',
      'A remapping function returning `null` deletes the entry.',
    ],
    practice: {
      prompt: 'Build a character frequency map three ways — `containsKey`+`put`, `getOrDefault`, and `merge`. Then use the null-returning `merge` to keep a sliding-window map clean at zero.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-12.8',
    language: 'java',
    summary: 'Remove entries and iterate maps without triggering exceptions.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Removing from a map is straightforward until you try to do it *while iterating*, which throws. The rules are the same as for lists, and the fixes are the same three.',
      },
      {
        kind: 'code',
        caption: 'Removal',
        code: `map.remove(key);              // returns the removed value, or null
map.remove(key, value);       // only removes if the value matches too
map.clear();`,
      },
      {
        kind: 'code',
        caption: 'Iteration — always prefer entrySet',
        code: `// BEST — one hash lookup, key and value together
for (Map.Entry<String,Integer> e : map.entrySet())
    System.out.println(e.getKey() + " -> " + e.getValue());

// Java 10+
for (var e : map.entrySet()) { ... }

for (String k : map.keySet()) { ... }
for (int v : map.values())    { ... }`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Do not loop keys and then call `get`',
        body: '`for (String k : map.keySet()) map.get(k);` does a second hash lookup for every key, for no benefit. `entrySet()` already has both. It is a small thing that shows up constantly in beginner code.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Removing during iteration throws',
        body: 'Calling `map.remove(k)` inside a for-each over the map throws `ConcurrentModificationException`. Use `entrySet().removeIf(...)`, or an explicit `Iterator` with `it.remove()`.',
      },
      {
        kind: 'code',
        caption: 'The three safe removals',
        code: `// 1. removeIf on a view — cleanest
map.entrySet().removeIf(e -> e.getValue() < 2);
map.values().removeIf(v -> v == 0);
map.keySet().removeIf(k -> k.isEmpty());

// 2. explicit iterator
Iterator<Map.Entry<String,Integer>> it = map.entrySet().iterator();
while (it.hasNext()) {
    if (it.next().getValue() < 2) it.remove();
}

// 3. collect keys first, then remove
List<String> doomed = new ArrayList<>();
for (var e : map.entrySet()) if (e.getValue() < 2) doomed.add(e.getKey());
for (String k : doomed) map.remove(k);`,
      },
      {
        kind: 'text',
        body: 'Note that `keySet()`, `values()` and `entrySet()` are **views**, not copies — removing from a view removes from the map. That is what makes option 1 work, and it is also why you cannot `add` to them.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: '`setValue` on an entry writes through',
        body: 'Inside an `entrySet` loop you may call `e.setValue(x)` to update the map safely — that is a modification of a value, not a structural change, so it does not throw. Only adding or removing keys is forbidden mid-iteration.',
      },
    ],
    keyTakeaways: [
      'Iterate with `entrySet()` — one lookup, not two.',
      'Removing inside a for-each throws `ConcurrentModificationException`.',
      '`entrySet().removeIf(...)` is the cleanest conditional removal.',
      '`e.setValue(x)` is safe mid-iteration; adding or removing keys is not.',
    ],
    practice: {
      prompt: 'Build a frequency map and try to remove entries with count 1 inside a for-each. Watch it throw, then fix it with `entrySet().removeIf(...)`.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-12.9',
    language: 'java',
    summary: 'Choose between the hash and tree families with one question.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Java gives you two families of `Set` and `Map` — hash-based and tree-based — and the choice reduces to a single question: **do I need order?** If not, hash wins on speed. If yes, tree is the only option.',
      },
      {
        kind: 'table',
        headers: ['', 'Hash (`HashMap`/`HashSet`)', 'Tree (`TreeMap`/`TreeSet`)'],
        rows: [
          ['Lookup', '**O(1)** average', 'O(log n)'],
          ['Order', 'None', 'Sorted'],
          ['Nearest-key queries', 'Impossible', '**Yes**'],
          ['Range views', 'Impossible', '**Yes**'],
          ['Requires', '`hashCode` + `equals`', '`Comparable` or comparator'],
          ['Null key', 'One allowed', '**Not allowed**'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The decision rule',
        body: 'Default to `HashMap` / `HashSet`. Switch to the tree version only when the problem asks something order-dependent: sorted output, "nearest key", a range count, or "first key greater than x". That signal is almost always explicit in the prompt.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Hash performance is *average*, not guaranteed',
        body: 'With many keys colliding, a `HashMap` bucket degrades toward a list. Modern Java converts long buckets to balanced trees, so the worst case is O(log n) rather than O(n) — but adversarial inputs can still slow it down. For DSA this essentially never matters.',
      },
      {
        kind: 'text',
        body: 'The middle option is `LinkedHashMap` / `LinkedHashSet`: hash speed plus insertion order. When you need predictable iteration but not *sorted* iteration, that is cheaper than a tree.',
      },
      {
        kind: 'table',
        headers: ['Need', 'Use'],
        rows: [
          ['Fast lookup, order irrelevant', '`HashMap` / `HashSet`'],
          ['Fast lookup + insertion order', '`LinkedHashMap` / `LinkedHashSet`'],
          ['Sorted iteration', '`TreeMap` / `TreeSet`'],
          ['"Nearest key to x"', '`TreeMap` / `TreeSet`'],
          ['LRU eviction', '`LinkedHashMap` in access order'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: '`TreeMap` rejects null keys',
        body: 'It must compare keys to place them, and `null` cannot be compared — so `tm.put(null, v)` throws `NullPointerException`. `HashMap` permits exactly one null key. Worth knowing when keys come from parsed input that might be missing.',
      },
    ],
    keyTakeaways: [
      'One question decides it: do I need order?',
      'Hash is O(1) average; tree is O(log n) but ordered.',
      '`LinkedHash*` is the middle option — hash speed, insertion order.',
      '`TreeMap` rejects null keys; `HashMap` allows one.',
    ],
    practice: {
      prompt: 'Take five problems you have solved with a `HashMap` and ask whether any actually needed `TreeMap`. Then try `put(null, 1)` on both and compare the behaviour.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-12.10',
    language: 'java',
    summary: 'Master the frequency map — the most common map pattern in DSA.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: '"How many times does each thing appear?" is one of the most common sub-problems in all of DSA — anagrams, majority element, first unique character, top k frequent. The pattern is always the same, and Java gives you a one-line version.',
      },
      {
        kind: 'code',
        caption: 'Building one',
        code: `Map<Character,Integer> freq = new HashMap<>();

for (char c : s.toCharArray())
    freq.merge(c, 1, Integer::sum);        // the idiomatic form

// Equivalent, more verbose:
// freq.put(c, freq.getOrDefault(c, 0) + 1);`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'For lowercase letters, use an int[26] instead',
        body: 'When the alphabet is small and known, `int[] freq = new int[26]; freq[c - \'a\']++;` is faster and simpler than a `HashMap` — no hashing, no boxing. This is a real optimisation on string problems, and interviewers notice it.',
      },
      {
        kind: 'code',
        caption: 'The array version',
        code: `int[] freq = new int[26];
for (char c : s.toCharArray()) freq[c - 'a']++;

// Anagram check in one pass, no map at all
for (char c : t.toCharArray())
    if (--freq[c - 'a'] < 0) return false;
return true;`,
      },
      {
        kind: 'code',
        caption: 'The problems it solves',
        code: `// First unique character
Map<Character,Integer> freq = new HashMap<>();
for (char c : s.toCharArray()) freq.merge(c, 1, Integer::sum);
for (int i = 0; i < s.length(); i++)
    if (freq.get(s.charAt(i)) == 1) return i;
return -1;

// Majority element
for (var e : freq.entrySet())
    if (e.getValue() > n / 2) return e.getKey();

// Group anagrams — the derived key is the whole trick
Map<String,List<String>> groups = new HashMap<>();
for (String w : words) {
    char[] k = w.toCharArray();
    Arrays.sort(k);
    groups.computeIfAbsent(new String(k), x -> new ArrayList<>()).add(w);
}`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Comparing boxed Integers with `==`',
        body: '`freq.get(c) == 1` works by autounboxing when compared to a literal `int`. But comparing two `Integer` objects — `freq.get(a) == freq.get(b)` — compares **references** and is false above 127. Use `.equals()` or unbox explicitly.',
      },
      {
        kind: 'text',
        body: 'A related pattern worth knowing: to compare two frequency maps for equality, `map1.equals(map2)` does it directly — that is a complete anagram check, though the `int[26]` version is faster.',
      },
    ],
    keyTakeaways: [
      '`map.merge(k, 1, Integer::sum)` is the idiomatic frequency counter.',
      'For a known small alphabet, `int[26]` beats a HashMap.',
      '`map1.equals(map2)` compares frequency maps directly.',
      'Comparing two boxed `Integer`s with `==` fails above 127.',
    ],
    practice: {
      prompt: 'Solve Valid Anagram three ways — sorting, a `HashMap`, and an `int[26]`. Time all three; the array version should win clearly.',
      leetcode: { title: 'Valid Anagram', slug: 'valid-anagram' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-12.11',
    language: 'java',
    summary: 'Combine prefix sums with a HashMap to count subarrays in one pass.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'This is the most powerful map technique in the chapter, and the one that handles cases sliding window cannot. The question "how many subarrays sum to k?" becomes a single pass once you pair a running total with a map of the totals you have already seen.',
      },
      {
        kind: 'text',
        body: 'The insight: if the running sum at position `j` is `S`, then a subarray ending at `j` sums to `k` exactly when some earlier prefix equalled `S - k`. So you keep a map from prefix value to **how many times it has occurred**, and each element contributes that count.',
      },
      {
        kind: 'code',
        caption: 'Subarray Sum Equals K',
        code: `Map<Long,Integer> seen = new HashMap<>();
seen.put(0L, 1);                    // the empty prefix — do NOT omit this

long running = 0;
int count = 0;

for (int x : nums) {
    running += x;

    count += seen.getOrDefault(running - k, 0);   // prefixes that close a subarray

    seen.merge(running, 1, Integer::sum);
}
return count;`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'The `{0: 1}` seed is not optional',
        body: 'It represents the empty prefix, and it is what lets a subarray starting at index 0 be counted. Without it the answer is exactly one too low whenever the prefix itself equals `k` — and the first sample often still passes, which makes it a nasty bug.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'This is what to use when sliding window fails',
        body: 'Sliding window assumes growing the window never decreases the sum — true only for non-negative values. With negatives that assumption breaks. Prefix sum plus hash map has no such requirement, so it is the correct tool whenever negatives are possible.',
      },
      {
        kind: 'code',
        caption: 'Count, do not increment',
        code: `count += seen.getOrDefault(running - k, 0);   // CORRECT
count++;                                     // WRONG`,
      },
      {
        kind: 'text',
        body: 'Several earlier prefixes can share the same value, and each one closes a distinct valid subarray — so you must add the *count*, not one.',
      },
      {
        kind: 'code',
        caption: 'The same idea, three variations',
        code: `// Contiguous Array — equal 0s and 1s. Map 0 to -1 and look for a REPEAT.
Map<Integer,Integer> firstIndex = new HashMap<>();
firstIndex.put(0, -1);
int running = 0, best = 0;
for (int i = 0; i < nums.length; i++) {
    running += (nums[i] == 0 ? -1 : 1);
    if (firstIndex.containsKey(running))
        best = Math.max(best, i - firstIndex.get(running));
    else
        firstIndex.put(running, i);          // keep the EARLIEST index only
}

// Subarray Sums Divisible by K — key on the remainder
int mod = ((running % k) + k) % k;           // guard against negative %`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Use `long` for the running sum',
        body: 'With n = 10⁵ and values up to 10⁴, the total exceeds a 32-bit `int`. And in the modulo variant, Java\'s `%` can return a negative — `((x % k) + k) % k` normalises it.',
      },
    ],
    keyTakeaways: [
      'Prefix sum + map counts subarrays in one pass, even with negatives.',
      'Seed the map with `{0: 1}` for the empty prefix.',
      'Add the stored count, do not increment by one.',
      'Use `long` for the running sum, and normalise negative remainders.',
    ],
    practice: {
      prompt: 'Solve Subarray Sum Equals K, then delete the `{0: 1}` seed and find an input where the answer drops by one. That experiment fixes the lesson permanently.',
      leetcode: { title: 'Subarray Sum Equals K', slug: 'subarray-sum-equals-k' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-12.12',
    language: 'java',
    summary: 'Use the sorted-map navigation methods that HashMap cannot offer.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'The four navigation methods are the whole reason `TreeMap` exists. They answer "what is the nearest key to x?" in O(log n) — a question no hash structure can answer at all, because it requires order.',
      },
      {
        kind: 'table',
        headers: ['Method', 'Returns', 'Includes x?'],
        rows: [
          ['`floorKey(x)`', 'Largest key ≤ x', 'Yes'],
          ['`lowerKey(x)`', 'Largest key < x', '**No**'],
          ['`ceilingKey(x)`', 'Smallest key ≥ x', 'Yes'],
          ['`higherKey(x)`', 'Smallest key > x', '**No**'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Remember it as two pairs',
        body: '**floor / ceiling** are the inclusive pair — like rounding down and up, where an exact value stays put. **lower / higher** are the strict pair. Once you group them that way the four names stop blurring together.',
      },
      {
        kind: 'code',
        caption: 'Entry versions, when you need the value too',
        code: `tm.floorEntry(x);       // the whole Map.Entry, not just the key
tm.ceilingEntry(x);
tm.firstEntry();
tm.lastEntry();

Map.Entry<Integer,String> e = tm.floorEntry(4);
if (e != null) { int k = e.getKey(); String v = e.getValue(); }`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Always null-check the result',
        body: '`floorKey(0)` on a map whose smallest key is 1 returns `null`. So does every navigation method when nothing qualifies. Assigning that to an `int` throws `NullPointerException` — receive into an `Integer` or a `Map.Entry` and test first.',
      },
      {
        kind: 'code',
        caption: 'A real use: Time Based Key-Value Store',
        code: `// For each key, a TreeMap of timestamp -> value
Map<String, TreeMap<Integer,String>> store = new HashMap<>();

void set(String key, String value, int timestamp) {
    store.computeIfAbsent(key, k -> new TreeMap<>()).put(timestamp, value);
}

String get(String key, int timestamp) {
    TreeMap<Integer,String> tm = store.get(key);
    if (tm == null) return "";

    // the most recent value at or before this timestamp
    Map.Entry<Integer,String> e = tm.floorEntry(timestamp);
    return e == null ? "" : e.getValue();
}`,
      },
      {
        kind: 'text',
        body: 'That is the canonical `TreeMap` problem, and it shows the pattern clearly: a `HashMap` for the outer lookup where order is irrelevant, and a `TreeMap` inside where "nearest at or before" is exactly the question.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Range counting with `subMap`',
        body: '`tm.subMap(lo, true, hi, true).size()` counts keys in a range. It is O(k) in the number of matches rather than O(log n), so for pure counting a Fenwick tree is better — but for small ranges it is far less code.',
      },
    ],
    keyTakeaways: [
      'floor/ceiling include equality; lower/higher are strict.',
      'The `Entry` variants give you the value as well as the key.',
      'Every navigation method returns `null` when nothing qualifies.',
      '`HashMap` of `TreeMap` is the shape for timestamped lookups.',
    ],
    practice: {
      prompt: 'Implement Time Based Key-Value Store with `HashMap<String, TreeMap<Integer,String>>`. The `floorEntry` call is the entire solution once the structure is right.',
      leetcode: { title: 'Time Based Key-Value Store', slug: 'time-based-key-value-store' },
    },
  },
];
