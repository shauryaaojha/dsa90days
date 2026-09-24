import type { SharedLesson } from './types';

/**
 * Hashing in Depth — Understand hash functions, collision resolution via chaining,
 * load factor and rehashing overhead, composite keys, ordered vs unordered trade-offs,
 * canonical hashing patterns, and when to avoid hashing.
 */
export const lessons: SharedLesson[] = [
  // =========================================================================
  // Lesson 1: What a hash function does
  // =========================================================================
  {
    sub: 1,
    summary: 'Understand how hash functions deterministically map keys of arbitrary size to fixed-width integers and compress them into array indices.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'An array provides instant O(1) access because memory addresses are calculated through direct arithmetic: base address plus index multiplied by element size. However, real-world data uses non-integer keys such as usernames, URL strings, or sparse 64-bit identifiers. A **hash function** bridges this gap by transforming an arbitrary key into a fixed-size integer called a **hash code**. A compression operation, usually modulo division, then maps that integer into a valid slot within an array of size `m`: `index = hash_code % m`.',
      },
      { kind: 'heading', text: 'Core mathematical requirements' },
      {
        kind: 'text',
        body: 'A valid hash function must satisfy three fundamental properties. First is **determinism**: given the identical key, the function must return the exact same hash code every time throughout program execution. Second is **uniform distribution**: keys must scatter evenly across all possible output values rather than clustering into a few buckets. Third is **speed**: computing the hash code should require O(L) time where L is the length of the key, ensuring the hash calculation does not become a bottleneck.',
      },
      {
        kind: 'code',
        caption: 'Polynomial rolling hash function for strings',
        code: {
          cpp: `int hashString(const string& s, int tableSize) {
    long long hashVal = 0;
    const int p = 31;
    const int m = 1e9 + 7;
    for (char c : s) {
        hashVal = (hashVal * p + (c - 'a' + 1)) % m;
    }
    return (hashVal % tableSize + tableSize) % tableSize;
}`,
          java: `public class HashFunctionDemo {
    public static int hashString(String s, int tableSize) {
        long hashVal = 0;
        final int p = 31;
        final int m = 1_000_000_007;
        for (int i = 0; i < s.length(); i++) {
            hashVal = (hashVal * p + (s.charAt(i) - 'a' + 1)) % m;
        }
        return (int) Math.floorMod(hashVal, tableSize);
    }
}`,
          python: `def hash_string(s: str, table_size: int) -> int:
    hash_val = 0
    p = 31
    m = 1_000_000_007
    for ch in s:
        hash_val = (hash_val * p + (ord(ch) - ord('a') + 1)) % m
    return hash_val % table_size`,
        },
      },
      { kind: 'heading', text: 'Hash function properties and failures' },
      {
        kind: 'table',
        headers: ['Property', 'Requirement', 'Failure Impact'],
        rows: [
          ['Determinism', 'Identical keys always yield identical hash values', 'Stored elements become impossible to find or delete'],
          ['Uniformity', 'Keys distribute evenly across table slots', 'Keys cluster in few buckets, degrading O(1) to O(n)'],
          ['Speed', 'O(L) computation time where L is key length', 'Hashing overhead negates the performance benefit of O(1) lookup'],
          ['Range compression', 'Hash code maps into [0, tableSize - 1] via modulo', 'Out-of-bounds array access and runtime termination'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Negative remainder from modulo operations',
        body: 'In C++ and Java, the remainder operator `%` preserves the sign of the dividend. If an integer hash code is negative due to arithmetic overflow or a negative input, `-17 % 10` evaluates to `-7`. Passing a negative index to an array causes an out-of-bounds error. In Java, normalize negative remainders using `Math.floorMod(hashVal, tableSize)` or bitwise masking with `0x7fffffff`. In C++, write `(hashVal % tableSize + tableSize) % tableSize`.',
      },
    ],
    keyTakeaways: [
      'A hash function converts arbitrary keys into integer hash codes, which modulo compression maps into array indices.',
      'Determinism is mandatory: identical keys must always produce identical hash values.',
      'Uniformity ensures keys scatter evenly across table slots, preventing high-collision hotspots.',
      'Guard against negative remainders in languages where `%` yields negative results for negative dividends.',
    ],
    practice: {
      prompt: 'Implement a string hash function using polynomial accumulation with a base multiplier of 31 and compress the result into an array of size 1000.',
      leetcode: { title: 'Design HashSet', slug: 'design-hashset' },
    },
  },

  // =========================================================================
  // Lesson 2: Collisions and chaining
  // =========================================================================
  {
    sub: 2,
    summary: 'Handle inevitable hash collisions using separate chaining and understand how bucket lists preserve correctness.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'The **Pigeonhole Principle** states that if you place `n` items into `m` containers where `n > m`, at least one container must hold more than one item. Because the universe of possible keys (such as all valid strings) is virtually infinite while table capacity is finite, two distinct keys will inevitably map to the same bucket index. When `hash(k1) % m == hash(k2) % m` for distinct keys `k1 != k2`, a **collision** occurs. A hash table cannot prevent collisions; it must resolve them systematically.',
      },
      { kind: 'heading', text: 'Separate chaining mechanism' },
      {
        kind: 'text',
        body: 'In **separate chaining**, each table slot is a bucket that maintains a list of entries. When inserting a key-value pair, the table computes the bucket index and inspects the entries stored in that bucket. If the key is already present, its value updates. If the key is absent, the new pair is appended to the bucket. During lookup, the table hashes to the bucket index and performs a linear scan through the short bucket list, comparing each entry against the target key using exact equality.',
      },
      {
        kind: 'code',
        caption: 'Separate chaining hash map implementation',
        code: {
          cpp: `struct BucketEntry {
    int key;
    int value;
};

class ChainedHashMap {
    static const int CAPACITY = 1009;
    vector<vector<BucketEntry>> buckets;

    int getIndex(int key) const {
        return (key % CAPACITY + CAPACITY) % CAPACITY;
    }

public:
    ChainedHashMap() : buckets(CAPACITY) {}

    void put(int key, int value) {
        int idx = getIndex(key);
        for (auto& entry : buckets[idx]) {
            if (entry.key == key) {
                entry.value = value;
                return;
            }
        }
        buckets[idx].push_back({key, value});
    }

    int get(int key) const {
        int idx = getIndex(key);
        for (const auto& entry : buckets[idx]) {
            if (entry.key == key) return entry.value;
        }
        return -1;
    }
};`,
          java: `public class ChainedHashMap {
    private static final int CAPACITY = 1009;

    private static class Entry {
        int key, value;
        Entry(int key, int value) { this.key = key; this.value = value; }
    }

    private List<Entry>[] buckets;

    @SuppressWarnings("unchecked")
    public ChainedHashMap() {
        buckets = new ArrayList[CAPACITY];
        for (int i = 0; i < CAPACITY; i++) {
            buckets[i] = new ArrayList<>();
        }
    }

    private int getIndex(int key) {
        return Math.floorMod(key, CAPACITY);
    }

    public void put(int key, int value) {
        int idx = getIndex(key);
        for (Entry e : buckets[idx]) {
            if (e.key == key) {
                e.value = value;
                return;
            }
        }
        buckets[idx].add(new Entry(key, value));
    }

    public int get(int key) {
        int idx = getIndex(key);
        for (Entry e : buckets[idx]) {
            if (e.key == key) return e.value;
        }
        return -1;
    }
}`,
          python: `class ChainedHashMap:
    def __init__(self, capacity: int = 1009):
        self.capacity = capacity
        self.buckets: list[list[tuple[int, int]]] = [[] for _ in range(capacity)]

    def _get_index(self, key: int) -> int:
        return key % self.capacity

    def put(self, key: int, value: int) -> None:
        idx = self._get_index(key)
        bucket = self.buckets[idx]
        for i, (k, _) in enumerate(bucket):
            if k == key:
                bucket[i] = (key, value)
                return
        bucket.append((key, value))

    def get(self, key: int) -> int:
        idx = self._get_index(key)
        for k, v in self.buckets[idx]:
            if k == key:
                return v
        return -1`,
        },
      },
      { kind: 'heading', text: 'Chaining compared to open addressing' },
      {
        kind: 'table',
        headers: ['Attribute', 'Separate Chaining', 'Open Addressing (Probing)'],
        rows: [
          ['Storage Model', 'Each bucket holds a linked list or dynamic array', 'All elements reside directly within the primary array'],
          ['Load Factor Tolerance', 'Can exceed 1.0 gracefully as chains lengthen', 'Strictly must remain below 1.0; degrades above 0.7'],
          ['Cache Locality', 'Lower due to pointer chasing across linked nodes', 'High during linear probing due to contiguous memory'],
          ['Deletion Complexity', 'Simple removal of a node from the bucket list', 'Requires tombstone markers to preserve probe sequences'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Equating hash code equality with key equality',
        body: 'A hash code collision means two different keys produce the identical bucket index. When searching inside a bucket, code must verify key equality using exact comparison (`==` or `.equals()`), never hash codes alone. If an algorithm assumes that identical bucket indices imply identical keys, it will overwrite values for unrelated keys or return incorrect results for lookups.',
      },
    ],
    keyTakeaways: [
      'Collisions are mathematically guaranteed when mapping a large key space into a finite table.',
      'Separate chaining resolves collisions by storing multiple entries in a list at each bucket.',
      'Retrieval requires two phases: hashing to the bucket, then scanning the bucket with exact key equality.',
      'Never assume matching hash codes mean identical keys; exact equality comparison is strictly required.',
    ],
    practice: {
      prompt: 'Build a hash map using separate chaining with an array of lists to handle put, get, and remove operations.',
      leetcode: { title: 'Design HashMap', slug: 'design-hashmap' },
    },
  },

  // =========================================================================
  // Lesson 3: Load factor and rehashing
  // =========================================================================
  {
    sub: 3,
    summary: 'Analyse load factor thresholds, understand how dynamic rehashing preserves average O(1) performance, and avoid resizing penalties.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'The textbook statement that hash tables offer O(1) lookups is an **average-case** and **amortised** guarantee, not a constant worst-case promise. The performance of a hash table is governed by its **load factor**, denoted by alpha: `alpha = n / m`, where `n` is the number of stored keys and `m` is the total number of buckets. When `alpha` is small, most buckets contain at most one entry, making operations instantaneous. When `alpha` grows large, bucket chains lengthen, causing searches to slow down toward linear O(n) scans.',
      },
      { kind: 'heading', text: 'Dynamic resizing and the rehashing process' },
      {
        kind: 'text',
        body: 'To maintain average O(1) operations, production hash tables enforce a maximum load factor threshold, typically 0.75. Once `alpha` crosses this threshold, the table triggers **rehashing**. The table allocates a new bucket array with double the previous capacity (`2m`). It then iterates through every existing element, recalculates its new bucket index using `hash(key) % (2m)`, and reinserts it into the expanded array. While rehashing takes O(n) time to migrate all elements, capacity doubles exponentially. Distributing this O(n) cost across the `n` individual insertions that preceded it yields an **amortised O(1)** cost per insertion.',
      },
      {
        kind: 'code',
        caption: 'Capacity pre-allocation eliminates rehashing spikes',
        code: {
          cpp: `// Unreserved: table repeatedly doubles capacity and rehashes elements
unordered_map<int, int> unreservedMap;
for (int i = 0; i < 100000; i++) {
    unreservedMap[i] = i * 2; // triggers multiple O(n) rehash pauses
}

// Reserved: allocates bucket array upfront, eliminating rehash operations
unordered_map<int, int> reservedMap;
reservedMap.reserve(100000); // reserves buckets for 100,000 elements
for (int i = 0; i < 100000; i++) {
    reservedMap[i] = i * 2; // uninterrupted O(1) insertions
}`,
          java: `// Unreserved: default capacity is 16; rehashes repeatedly at 0.75 load factor
Map<Integer, Integer> unreservedMap = new HashMap<>();
for (int i = 0; i < 100_000; i++) {
    unreservedMap.put(i, i * 2); // triggers multiple array resizes
}

// Reserved: calculate initial capacity accounting for the 0.75 load factor
int expectedSize = 100_000;
int initialCapacity = (int) Math.ceil(expectedSize / 0.75f) + 1;
Map<Integer, Integer> reservedMap = new HashMap<>(initialCapacity);
for (int i = 0; i < 100_000; i++) {
    reservedMap.put(i, i * 2); // zero rehash overhead
}`,
          python: `# Python dicts resize automatically when roughly two-thirds full
n = 100_000

# Incremental addition triggers internal table reallocations as dict grows
unreserved_dict = {}
for i in range(n):
    unreserved_dict[i] = i * 2

# Dictionary comprehension creates internal storage in one operation
prebuilt_dict = {i: i * 2 for i in range(n)}`,
        },
      },
      { kind: 'heading', text: 'Load factor trade-offs' },
      {
        kind: 'table',
        headers: ['Load Factor (alpha)', 'Memory Overhead', 'Lookup Efficiency', 'Rehash Frequency'],
        rows: [
          ['Low (alpha < 0.25)', 'High; vast majority of buckets sit empty', 'Near-perfect O(1); collisions are minimal', 'Infrequent, but memory footprint is excessive'],
          ['Balanced (alpha = 0.70 - 0.75)', 'Optimal balance of memory and throughput', 'Average bucket chain length remains near 1', 'Standard threshold in standard libraries'],
          ['High (alpha > 1.5)', 'Minimal memory overhead per element', 'Degrades toward O(n) as chains grow long', 'Frequent if permitted, causing latency spikes'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Rehash latency spikes causing Time Limit Exceeded',
        body: 'While rehashing achieves amortised O(1) performance over many insertions, an individual insertion that triggers a rehash incurs an O(n) delay. In competitive programming with inputs exceeding 100,000 items, repeatedly doubling and rehashing inside a time-critical loop can cause execution time to exceed the allowed limit. If the total number of keys is known beforehand, always pre-reserve table capacity.',
      },
    ],
    keyTakeaways: [
      'Load factor alpha = n / m measures the ratio of stored elements to total bucket capacity.',
      'Rehashing doubles bucket capacity and redistributes all n elements in O(n) time.',
      'Amortised analysis spreads the O(n) rehash cost over preceding insertions, keeping average insertion at O(1).',
      'Pre-reserving capacity when the element count is known eliminates dynamic resizing overhead.',
    ],
    practice: {
      prompt: 'Given an unsorted integer array, determine the length of the longest consecutive elements sequence in O(n) time using a hash set with amortised O(1) lookups.',
      leetcode: { title: 'Longest Consecutive Sequence', slug: 'longest-consecutive-sequence' },
    },
  },

  // =========================================================================
  // Lesson 4: Hashing pairs, tuples and custom objects
  // =========================================================================
  {
    sub: 4,
    summary: 'Design hashable composite keys including coordinate pairs and custom objects by satisfying the equals-hashcode contract.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Primitive types like integers and strings include built-in hash implementations in every language. However, complex algorithmic problems often demand tracking composite keys: 2D grid coordinates `(row, col)`, directed edges `(source, target)`, or state vectors. Storing composite keys inside a hash table requires the key type to satisfy two foundational requirements: a deterministic hash code calculation and an exact equality comparison.',
      },
      { kind: 'heading', text: 'The equals and hashcode contract' },
      {
        kind: 'text',
        body: 'The contract between equality and hashing is defined by three strict rules. First, if two objects are equal according to their equality comparison, their hash codes **must be identical**. Second, if two objects produce different hash codes, they are guaranteed to be unequal. Third, equal hash codes do not guarantee equal objects, representing a collision. Violating the first rule breaks the hash table: two equal objects placed into different buckets cannot locate each other. In addition, keys must be **immutable**. If an object\'s fields mutate after insertion, its hash code changes, stranding the entry in the wrong bucket.',
      },
      {
        kind: 'code',
        caption: 'Composite keys for 2D coordinate pairs',
        code: {
          cpp: `struct PairHash {
    size_t operator()(const pair<int, int>& p) const {
        size_t h1 = hash<int>()(p.first);
        size_t h2 = hash<int>()(p.second);
        // Combine hashes using bit shifts and golden ratio constant
        return h1 ^ (h2 + 0x9e3779b9 + (h1 << 6) + (h1 >> 2));
    }
};

void trackCoordinates() {
    unordered_set<pair<int, int>, PairHash> visited;
    visited.insert({3, 5});
    if (visited.count({3, 5})) {
        // Coordinate (3, 5) found in set
    }
}`,
          java: `// Java 16+ records automatically generate equals() and hashCode()
public record Point(int row, int col) {}

public class CustomHashingDemo {
    public static void main(String[] args) {
        Set<Point> visited = new HashSet<>();
        visited.add(new Point(3, 5));
        if (visited.contains(new Point(3, 5))) {
            // Coordinate (3, 5) found in set
        }
    }
}`,
          python: `# In Python, tuples are immutable and hashable; lists are mutable and unhashable
visited: set[tuple[int, int]] = set()

# Coordinate pair stored as an immutable tuple
point = (3, 5)
visited.add(point)

if (3, 5) in visited:
    # Coordinate (3, 5) found in set
    pass

# Attempting visited.add([3, 5]) raises TypeError: unhashable type: 'list'`,
        },
      },
      { kind: 'heading', text: 'Language rules for composite keys' },
      {
        kind: 'table',
        headers: ['Language', 'Built-in Pair Hashable?', 'Required Mechanism for Custom Key', 'Immutability Requirement'],
        rows: [
          ['C++', 'No (std::pair lacks std::hash specialization)', 'Provide custom hash functor and operator==', 'Key members must not mutate while stored in container'],
          ['Java', 'No (Object defaults to reference identity)', 'Override both equals() and hashCode() or use record', 'Fields contributing to hashCode must be final'],
          ['Python', 'Yes (tuples of hashable items are hashable)', 'Implement __hash__ and __eq__ on custom classes', 'Object must be immutable; mutable lists and dicts fail'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Mutating keys after insertion into a collection',
        body: 'Never modify the fields of an object after inserting it as a key into a hash map or hash set. When inserted, the entry is placed into a bucket dictated by its current hash code. If an internal field changes later, subsequent lookups will search a newly computed bucket where the entry does not exist. The original entry remains trapped in the old bucket, causing phantom entries that can neither be found nor deleted.',
      },
    ],
    keyTakeaways: [
      'If two objects are equal, their hash codes must be identical; the reverse is not required.',
      'Composite keys must be immutable: modifying an object after insertion corrupts hash table integrity.',
      'C++ requires custom hash functors for std::pair; Java requires equals() and hashCode(); Python requires immutable types like tuples.',
      'Never use mutable containers like lists as keys in hash collections.',
    ],
    practice: {
      prompt: 'Group an array of strings into anagram clusters by constructing a hashable canonical signature (such as a character count tuple or sorted string) for each word.',
      leetcode: { title: 'Group Anagrams', slug: 'group-anagrams' },
    },
  },

  // =========================================================================
  // Lesson 5: Ordered vs unordered: what you give up
  // =========================================================================
  {
    sub: 5,
    summary: 'Contrast hash tables with balanced search trees to choose the right structure for ordering, range queries, and worst-case guarantees.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Standard libraries provide two principal families of associative collections: **unordered** containers backed by hash tables (`unordered_map` and `unordered_set` in C++, `HashMap` and `HashSet` in Java, `dict` and `set` in Python) and **ordered** containers backed by self-balancing binary search trees (`map` and `set` in C++, `TreeMap` and `TreeSet` in Java). While hash tables offer average O(1) time compared to logarithmic O(log n) tree operations, choosing a hash table sacrifices several essential geometric and algorithmic capabilities.',
      },
      { kind: 'heading', text: 'Capabilities absent in hash tables' },
      {
        kind: 'text',
        body: 'Hash tables distribute keys pseudo-randomly across bucket arrays. Because of this distribution, they cannot support ordered operations efficiently. First, **sorted iteration** is impossible without extracting all keys and sorting them in an explicit O(n log n) step. Second, **range queries** such as finding all keys between values `L` and `R` require inspecting every single element in O(n) time, whereas a balanced search tree answers in O(log n + k) time. Third, **predecessor and successor lookups** (such as finding the smallest key greater than or equal to a target) require a full O(n) scan in a hash table but only an O(log n) tree traversal. Finally, balanced search trees guarantee **strict O(log n) worst-case time**, whereas hash tables can degrade to O(n) under adverse collisions or resizing.',
      },
      {
        kind: 'code',
        caption: 'Ordered ceiling query versus unordered full scan',
        code: {
          cpp: `void demonstrateOrderedLookup() {
    // Ordered map: backed by a Red-Black tree
    map<int, string> schedule;
    schedule[10] = "Task A";
    schedule[25] = "Task B";
    schedule[40] = "Task C";

    // lower_bound finds first key >= 20 in O(log n) time
    auto it = schedule.lower_bound(20);
    if (it != schedule.end()) {
        // Found key 25 ("Task B")
    }

    // unordered_map has no lower_bound; finding successor requires O(n) scan
    unordered_map<int, string> unsortedMap;
}`,
          java: `public class OrderedMapDemo {
    public static void main(String[] args) {
        // TreeMap: backed by a Red-Black tree
        TreeMap<Integer, String> schedule = new TreeMap<>();
        schedule.put(10, "Task A");
        schedule.put(25, "Task B");
        schedule.put(40, "Task C");

        // ceilingKey finds the smallest key >= 20 in O(log n) time
        Integer nextTime = schedule.ceilingKey(20); // returns 25

        // HashMap has no ceilingKey method; requires iterating every entry
        Map<Integer, String> unsortedMap = new HashMap<>();
    }
}`,
          python: `import bisect

# Python dict does not maintain sorted numerical key order
# To perform floor/ceiling lookups, pair a dict with a sorted key list
sorted_keys = [10, 25, 40]
schedule = {10: "Task A", 25: "Task B", 40: "Task C"}

# bisect_left finds first key >= 20 in O(log n) time
idx = bisect.bisect_left(sorted_keys, 20)
if idx < len(sorted_keys):
    next_key = sorted_keys[idx] # 25
    event = schedule[next_key]   # "Task B"`,
        },
      },
      { kind: 'heading', text: 'Hash table versus balanced search tree' },
      {
        kind: 'table',
        headers: ['Operation', 'Hash Table (unordered)', 'Balanced BST (ordered)'],
        rows: [
          ['Exact key search', 'Average O(1), Worst O(n)', 'Strict O(log n)'],
          ['Insert and Delete', 'Average O(1), Worst O(n)', 'Strict O(log n)'],
          ['Find Minimum / Maximum', 'O(n) full scan', 'O(log n) or O(1) via boundary pointer'],
          ['Floor / Ceiling / Successor', 'O(n) full scan', 'O(log n) tree traversal'],
          ['Range query [L, R]', 'O(n) inspection of all elements', 'O(log n + k) subtree traversal'],
          ['Iteration order', 'Arbitrary bucket distribution', 'Guaranteed ascending sorted order'],
        ],
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Insertion order is distinct from sorted order',
        body: { cpp: '`unordered_map` has no order at all: iterating it visits keys in bucket order, which changes as the table grows. If you need sorted keys or range queries, use `map`, or copy the keys into a vector and sort them.', java: '`HashMap` has no order: iteration visits keys in bucket order, which changes as the table grows. `LinkedHashMap` preserves insertion order, but that is arrival order, not sorted order. For sorted keys or range queries, use `TreeMap`.', python: 'Modern dictionaries preserve the sequence in which keys were inserted. This arrival order must not be confused with sorted numerical or alphabetical order. A dictionary preserving insertion order cannot perform binary searches or range lookups without sorting its keys into an auxiliary collection.' },
      },
    ],
    keyTakeaways: [
      'Hash tables trade ordering, range querying, and predictable worst-case bounds for average O(1) speed.',
      'Use balanced search trees when an algorithm requires floor, ceiling, range, or min/max key lookups.',
      'Hash table operations can degrade to O(n) under collisions; balanced trees guarantee O(log n).',
      'Preserving insertion sequence does not equate to sorted order and cannot support binary search.',
    ],
    practice: {
      prompt: 'Design a data structure that stores key-value pairs with timestamps and retrieves the value with the largest timestamp less than or equal to a given query timestamp.',
      leetcode: { title: 'Time Based Key-Value Store', slug: 'time-based-key-value-store' },
    },
  },

  // =========================================================================
  // Lesson 6: Hash set vs hash map patterns
  // =========================================================================
  {
    sub: 6,
    summary: 'Apply the three core hashing patterns in algorithmic problems: seen-before membership, complement lookup, and signature grouping.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'The majority of algorithmic problems that employ hashing fall into three core patterns: **seen-before membership**, **complement lookup**, and **signature grouping**. Choosing between a hash set and a hash map hinges on whether the algorithm needs to verify presence alone or associate each key with secondary metadata such as an index, an occurrence count, or an accumulated prefix state.',
      },
      { kind: 'heading', text: 'The three algorithmic patterns' },
      {
        kind: 'text',
        body: 'The **seen-before** pattern uses a hash set to detect duplicate items in a sequence, identify cycles in linked lists or state spaces, and record visited nodes in graph traversals. The **complement lookup** pattern resolves equations of the form `x + y = target` by rewriting them as `y = target - x`. As the array is scanned, the code checks whether the precomputed complement `y` was already observed, turning quadratic nested comparisons into a single linear pass. The **signature grouping** pattern converts diverse elements into a standard canonical form called a signature. Elements sharing identical signatures are grouped into the same hash map bucket list.',
      },
      {
        kind: 'code',
        caption: 'Complement lookup pattern for Two Sum',
        code: {
          cpp: `// Complement lookup pattern: stores value mapped to original index
vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> numToIndex;
    for (int i = 0; i < (int)nums.size(); i++) {
        int complement = target - nums[i];
        if (numToIndex.count(complement)) {
            return {numToIndex[complement], i};
        }
        numToIndex[nums[i]] = i;
    }
    return {};
}`,
          java: `// Complement lookup pattern: stores value mapped to original index
public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> numToIndex = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (numToIndex.containsKey(complement)) {
            return new int[]{numToIndex.get(complement), i};
        }
        numToIndex.put(nums[i], i);
    }
    return new int[0];
}`,
          python: `# Complement lookup pattern: stores value mapped to original index
def two_sum(nums: list[int], target: int) -> list[int]:
    num_to_index = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in num_to_index:
            return [num_to_index[complement], i]
        num_to_index[num] = i
    return []`,
        },
      },
      { kind: 'heading', text: 'Hashing pattern taxonomy' },
      {
        kind: 'table',
        headers: ['Pattern Name', 'Primary Container', 'Stored Key-Value', 'Canonical Problem'],
        rows: [
          ['Seen-Before Membership', 'Hash Set', 'Element or state representation', 'Cycle detection, duplicate verification'],
          ['Complement Lookup', 'Hash Map', 'Value mapped to initial array index', 'Two Sum, Subarray Sum Equals K'],
          ['Frequency Counting', 'Hash Map', 'Element mapped to occurrence count', 'Majority Element, Valid Anagram'],
          ['Signature Grouping', 'Hash Map', 'Canonical signature mapped to item list', 'Group Anagrams, Group Shifted Strings'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Inserting an element before querying its complement',
        body: 'Always check the map for the complement before adding the current element. If you insert `nums[i]` into the map first and `target == 2 * nums[i]`, the lookup will match the current element against itself. This returns the same index twice rather than finding two distinct elements that satisfy the sum.',
      },
    ],
    keyTakeaways: [
      'Use a hash set when checking existence alone; use a hash map when associating values with metadata.',
      'The complement pattern replaces quadratic nested loops with a single linear pass.',
      'Always query the complement before inserting the current item to prevent self-matching bugs.',
      'Signature grouping collects disparate items under a shared canonical representation.',
    ],
    practice: {
      prompt: 'Given an integer array and a target value, return the indices of two numbers that add up to target using the complement lookup pattern in O(n) time.',
      leetcode: { title: 'Two Sum', slug: 'two-sum' },
    },
  },

  // =========================================================================
  // Lesson 7: When hashing is the wrong tool
  // =========================================================================
  {
    sub: 7,
    summary: 'Identify scenarios where hash tables are inferior to direct index arrays, balanced trees, or bitsets due to overhead and worst-case risks.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'The convenience of hash tables frequently leads programmers to treat them as an all-purpose solution for every lookup task. However, deploying a hash table where simpler or specialised structures fit creates unnecessary performance penalties: high constant factors, heavy memory overhead, CPU cache misses, and vulnerability to adversarial worst-case inputs. Discerning when to bypass a hash table in favor of flat arrays, balanced trees, or bitsets is a key attribute of proficient software development.',
      },
      { kind: 'heading', text: 'When alternatives surpass hash tables' },
      {
        kind: 'text',
        body: 'Direct flat arrays outperform hash tables when keys belong to a small bounded universe, such as lowercase English letters (`\'a\'` to `\'z\'`) or integers from 0 to 1000. An array `count[26]` eliminates hashing calculations, incurs no pointer indirection, avoids dynamic heap allocations, and guarantees continuous CPU cache hits, executing 10 to 50 times faster than a hash map. For ordered traversal or range queries, balanced search trees provide guaranteed logarithmic bounds where hash tables require full linear scans. Furthermore, standard library integer hash functions in C++ compilers often use identity mapping, allowing crafted adversarial inputs to collide all keys into a single bucket and degrade runtime to O(n²).',
      },
      {
        kind: 'code',
        caption: 'Direct array frequency counter versus hash map',
        code: {
          cpp: `// Direct array indexing: 26 contiguous stack integers, zero heap allocation
int firstUniqChar(string s) {
    int count[26] = {0};
    for (char c : s) {
        count[c - 'a']++;
    }
    for (int i = 0; i < (int)s.size(); i++) {
        if (count[s[i] - 'a'] == 1) return i;
    }
    return -1;
}`,
          java: `// Direct array indexing: avoids HashMap node allocation and Integer autoboxing
public int firstUniqChar(String s) {
    int[] count = new int[26];
    for (int i = 0; i < s.length(); i++) {
        count[s.charAt(i) - 'a']++;
    }
    for (int i = 0; i < s.length(); i++) {
        if (count[s.charAt(i) - 'a'] == 1) return i;
    }
    return -1;
}`,
          python: `# Direct list indexing for bounded character domain
def first_uniq_char(s: str) -> int:
    count = [0] * 26
    for ch in s:
        count[ord(ch) - ord('a')] += 1

    for i, ch in enumerate(s):
        if count[ord(ch) - ord('a')] == 1:
            return i
    return -1`,
        },
      },
      { kind: 'heading', text: 'Container selection matrix' },
      {
        kind: 'table',
        headers: ['Scenario', 'Optimal Container', 'Why Hash Table is Inferior', 'Performance Advantage'],
        rows: [
          ['Small bounded universe (e.g. chars, 0..K)', 'Direct index array', 'Heavy hashing overhead and heap node allocation', 'Direct memory offset without hashing computation'],
          ['Range queries and ordered traversal', 'Balanced search tree (std::map, TreeMap)', 'Hash table requires inspecting every element in O(n)', 'O(log n + k) range traversal vs O(n) full scan'],
          ['Dense boolean presence checks', 'Bitset / boolean vector', 'Hash set consumes 24 to 32 bytes of node storage per item', '1 bit per flag vs 32 bytes per hash node'],
          ['Large sparse keys with exact equality', 'Hash Table', 'This is the exact domain hash tables are designed to solve', 'Average O(1) retrieval across arbitrary keys'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Adversarial collision tests on standard integer hashing',
        body: { cpp: 'With GCC, `std::hash<long long>` returns the raw integer value without modification. When an adversarial test suite provides keys that are multiples of the internal table capacity, every single key hashes to bucket 0. The bucket degrades into a linked list of length N, collapsing an intended O(n) solution into an O(n²) timeout. In competitive programming contests, guard against anti-hash tests by using a custom hash functor with a randomised bit-shift mask.', java: '`Integer.hashCode()` is the value itself, and `HashMap` only lightly scrambles it, so keys chosen as multiples of the table size collide heavily. Since Java 8 a bucket that grows past 8 entries becomes a balanced tree, so the worst case is O(log n) per operation rather than O(n); anti-hash tests are far less effective here than in other languages.', python: 'Small integers hash to themselves, so adversarial inputs can in principle cause collisions. In practice CPython’s open addressing with perturbation keeps this rare on LeetCode, and string hashing is randomised per process, which defeats prepared anti-hash inputs.' },
      },
    ],
    keyTakeaways: [
      'For small bounded keys like characters or small integers, a direct array is significantly faster than a hash table.',
      'Hash tables demand considerable memory overhead for bucket arrays and collision chain nodes.',
      'Avoid hash tables when an algorithm requires sorted order, predecessor queries, or range searches.',
      'Predictable default integer hash functions can be exploited by adversarial test suites to force quadratic runtime.',
    ],
    practice: {
      prompt: 'Find the first non-repeating character in a string containing lowercase letters using a direct index array of size 26 instead of a hash map.',
      leetcode: { title: 'First Unique Character in a String', slug: 'first-unique-character-in-a-string' },
    },
  },
];
