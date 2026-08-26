import type { Lesson } from '../types';

/**
 * Chapter 14 — STL Unordered Containers.
 * Hash-based, O(1) average. The single most useful family of containers for
 * LeetCode, and the one that turns the most O(n^2) solutions into O(n).
 */
export const ch14: Lesson[] = [
  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-14.1',
    language: 'cpp',
    summary: 'Answer "have I seen this before?" in O(1) — the most reusable trick in DSA.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: '`unordered_set` stores unique values with **O(1) average** insert, erase and lookup. It gives up sorted order in exchange for that speed.',
      },
      {
        kind: 'code',
        code: `#include <unordered_set>

unordered_set<int> seen;

seen.insert(3);
seen.insert(3);            // ignored — duplicates are not stored

seen.count(3);             // 1 if present, 0 if not
seen.find(3) != seen.end();  // same test
seen.contains(3);          // C++20, clearest
seen.erase(3);
seen.size();  seen.empty();

for (int x : seen) { ... }   // ARBITRARY order — do not rely on it`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Iteration order is unspecified and can change',
        body: 'It depends on the hash function, the bucket count, and the insertion history — and it can change after a rehash. Never write a solution whose *output* depends on iteration order; you will get different results between runs or compilers. If you need order, use `set` or sort at the end.',
      },
      { kind: 'heading', text: 'The pattern it exists for' },
      {
        kind: 'code',
        caption: 'Contains Duplicate — O(n) instead of O(n²)',
        code: `bool containsDuplicate(vector<int>& nums) {
    unordered_set<int> seen;
    for (int x : nums) {
        if (seen.count(x)) return true;
        seen.insert(x);
    }
    return false;
}

// Even shorter — insert reports whether the value was new
bool containsDuplicate(vector<int>& nums) {
    unordered_set<int> seen;
    for (int x : nums)
        if (!seen.insert(x).second) return true;    // already present
    return false;
}`,
      },
      {
        kind: 'text',
        body: '`insert` returns `{iterator, bool}`, where the bool is false if the value was already there. That collapses check-then-insert into one hash lookup instead of two.',
      },
      {
        kind: 'code',
        caption: 'Building from a range, and set operations',
        code: `vector<int> v = {1, 2, 2, 3};
unordered_set<int> s(v.begin(), v.end());     // {1, 2, 3}

// Intersection of two arrays
unordered_set<int> a(nums1.begin(), nums1.end());
vector<int> result;
for (int x : nums2)
    if (a.erase(x)) result.push_back(x);      // erase returns how many it removed,
                                              // which also prevents duplicates`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'erase returns a count — use it as a test',
        body: '`s.erase(x)` returns 1 if it removed something and 0 otherwise. Using it as the condition does membership-test and removal in a single lookup, which is exactly what the intersection problem needs to avoid emitting duplicates.',
      },
      { kind: 'heading', text: 'A real problem where it is the whole solution' },
      {
        kind: 'code',
        caption: 'Longest Consecutive Sequence — O(n)',
        code: `int longestConsecutive(vector<int>& nums) {
    unordered_set<int> s(nums.begin(), nums.end());
    int best = 0;

    for (int x : s) {
        if (s.count(x - 1)) continue;      // not the start of a run — skip

        int length = 1;
        while (s.count(x + length)) length++;
        best = max(best, length);
    }
    return best;
}`,
      },
      {
        kind: 'text',
        body: 'The `continue` is what keeps this linear: each run is walked only from its starting element, so across the whole loop every value is visited a constant number of times. Without that check it would be O(n²). Sorting would be O(n log n) — the hash set beats it.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'A pair or vector cannot be a key without a custom hash',
        body: 'There is no `std::hash` for `pair` or `vector`, so `unordered_set<pair<int,int>>` fails to compile with a template error wall. For grid coordinates, encode them into one integer: `r * cols + c`. Otherwise use `set`, which needs only `<`.',
      },
    ],
    keyTakeaways: [
      '`unordered_set` gives O(1) average membership testing on unique values.',
      '`insert(x).second` is false when `x` was already present — one lookup, not two.',
      'Iteration order is arbitrary and may change after a rehash.',
      '`pair` and `vector` keys need a custom hash — encode or use `set` instead.',
    ],
    practice: {
      prompt: 'Solve Contains Duplicate with `insert(x).second`, then Longest Consecutive Sequence. In the second, remove the `if (s.count(x - 1)) continue;` line and time it on 10⁵ elements — that single line is the difference between O(n) and O(n²).',
      leetcode: { title: 'Longest Consecutive Sequence', slug: 'longest-consecutive-sequence' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-14.2',
    language: 'cpp',
    summary: 'Map keys to values in O(1) — the container behind more solutions than any other.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'An `unordered_map` stores **key to value** pairs with O(1) average lookup. It sits behind more accepted solutions than any other container: frequency counts, "have I seen this and where?", graph adjacency, memoisation. If you master one container in this chapter, make it this one.',
      },
      {
        kind: 'code',
        code: `#include <unordered_map>

unordered_map<string, int> counts;

counts["apple"] = 3;          // insert or overwrite
counts["apple"]++;            // now 4
counts["banana"]++;           // creates it at 0, then increments to 1

counts.at("apple");           // 4 — throws if absent, never inserts
counts.count("cherry");       // 0
counts.erase("apple");
counts.size();

for (auto& [key, value] : counts) { ... }     // arbitrary order`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'operator[] inserts missing keys',
        body: 'Identical to `map`. `if (counts["missing"] > 0)` silently creates an entry with value 0, growing the map and corrupting `size()`. Query with `count`, `find` or `contains`; use `[]` only when you intend to create or overwrite. This is the most common hash-map bug there is.',
      },
      {
        kind: 'code',
        caption: 'Query versus create',
        code: `if (m.count(key))               { ... }    // no insertion
if (m.find(key) != m.end())     { ... }    // no insertion, and gives you the iterator
if (m.contains(key))            { ... }    // C++20

m[key]++;                                  // intentional creation — the counting idiom
m.at(key);                                 // throws if absent`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'find gives you the value too',
        body: '`count(key)` followed by `m[key]` performs two hash lookups. `auto it = m.find(key); if (it != m.end()) use(it->second);` does one. In a hot loop that halves the hashing work — a free optimisation once it becomes habit.',
      },
      { kind: 'heading', text: 'Two Sum, the archetype' },
      {
        kind: 'code',
        code: `vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int,int> seen;                // value → index

    for (int i = 0; i < nums.size(); i++) {
        int need = target - nums[i];
        auto it = seen.find(need);
        if (it != seen.end()) return {it->second, i};
        seen[nums[i]] = i;                      // insert AFTER checking
    }
    return {};
}`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Check before inserting',
        body: 'If you insert `nums[i]` first, an element can pair with itself whenever `target == 2 * nums[i]`. Checking first is the entire correctness argument for the one-pass version — and it is a subtle enough bug that it usually passes the sample tests.',
      },
      { kind: 'heading', text: 'The three shapes it takes' },
      {
        kind: 'code',
        code: `// 1. Counting
unordered_map<char,int> freq;
for (char c : s) freq[c]++;

// 2. Remembering positions
unordered_map<int,int> lastSeen;
lastSeen[nums[i]] = i;

// 3. Grouping
unordered_map<string, vector<string>> groups;
groups[key].push_back(word);        // [] builds the empty vector for you`,
      },
      {
        kind: 'text',
        body: 'Counting, position-tracking and grouping cover the large majority of hash-map usage in DSA. Recognising which of the three a problem needs is usually enough to structure the whole solution.',
      },
      {
        kind: 'code',
        caption: 'Custom-struct values work fine',
        code: `struct Info { int count; int firstIndex; };
unordered_map<int, Info> data;

data[x].count++;                    // Info is value-initialised on first access
data[x].firstIndex = i;`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'reserve() when the size is predictable',
        body: '`m.reserve(nums.size())` pre-allocates buckets and avoids repeated rehashing as the map grows. On a 10⁵-element input this is a measurable speedup for one line of code — the hash-container equivalent of `vector::reserve`.',
      },
    ],
    keyTakeaways: [
      '`unordered_map` gives O(1) average key-value storage.',
      '`operator[]` inserts on read — query with `count`, `find` or `contains`.',
      '`find` returns the value with a single lookup; `count` then `[]` does two.',
      'Its three roles are counting, remembering positions, and grouping.',
    ],
    practice: {
      prompt: 'Write Two Sum with `find` rather than `count` + `[]`. Then swap the insert above the check and find an input where it wrongly pairs an element with itself. Then print `m.size()` before and after `if (m["missing"] == 0)` to see the phantom key appear.',
      leetcode: { title: 'Two Sum', slug: 'two-sum' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-14.3',
    language: 'cpp',
    summary: 'Understand how a hash table finds things instantly, without searching.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'A hash table does not search. It **computes** where an element should live, then looks there directly. That is why lookup does not depend on how many elements are stored.',
      },
      {
        kind: 'code',
        caption: 'The idea in three lines',
        code: `// A hash function turns any key into a number
size_t h = hash<string>{}("apple");     // e.g. 4038958929

// Modulo the bucket count gives an index into an array
size_t index = h % bucketCount;         // e.g. 9

// Store the element in buckets[9]. Looking it up recomputes the same index.`,
      },
      {
        kind: 'text',
        body: 'The table is an array of **buckets**. The hash function maps a key to a bucket index; insertion puts the element there and lookup goes straight to that bucket. No comparisons with other elements, no tree to descend.',
      },
      {
        kind: 'code',
        caption: 'A minimal hash table',
        code: `vector<vector<pair<int,int>>> buckets(16);      // 16 buckets

void insert(int key, int value) {
    int i = key % 16;                          // "hash" — for ints, often identity
    for (auto& [k, v] : buckets[i])
        if (k == key) { v = value; return; }   // update an existing key
    buckets[i].push_back({key, value});
}

int get(int key) {
    int i = key % 16;
    for (auto& [k, v] : buckets[i])            // scan only THIS bucket
        if (k == key) return v;
    return -1;
}`,
      },
      {
        kind: 'text',
        body: 'That is genuinely all `unordered_map` does, plus resizing and a better hash function. The inner loop only scans one bucket, which is short if the hash spreads keys evenly — that is where O(1) comes from.',
      },
      { kind: 'heading', text: 'What makes a hash function good' },
      {
        kind: 'table',
        headers: ['Property', 'Why it matters'],
        rows: [
          ['**Deterministic**', 'The same key must always give the same bucket'],
          ['**Uniform**', 'Keys should spread evenly, or some buckets grow long'],
          ['**Fast**', 'It runs on every single operation'],
          ['Equal keys hash equally', 'Required for correctness — enforced by contract'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Equal keys must hash to the same value',
        body: 'This is the one hard rule when writing a custom hash: if `a == b`, then `hash(a)` must equal `hash(b)`. The reverse is not required — different keys may collide, and the table handles that. Violating this rule means a key can be stored in one bucket and searched for in another, so lookups fail unpredictably.',
      },
      { kind: 'heading', text: 'Writing a custom hash' },
      {
        kind: 'code',
        code: `struct PairHash {
    size_t operator()(const pair<int,int>& p) const {
        return hash<long long>{}(((long long)p.first << 32) ^ p.second);
    }
};

unordered_map<pair<int,int>, int, PairHash> grid;
grid[{2, 3}] = 5;`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'For grid coordinates, encoding beats hashing',
        body: 'Rather than writing a hash functor, combine the coordinates into one integer: `int key = r * cols + c;` and use `unordered_map<int,int>`. Decode with `r = key / cols` and `c = key % cols`. It is shorter, faster, and reuses the integer arithmetic from Chapter 2. Reserve custom hash functors for keys that genuinely cannot be encoded.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Why hashing destroys ordering',
        body: 'A good hash deliberately scatters similar keys into distant buckets — that is what makes the distribution uniform. So consecutive keys end up nowhere near each other, and iteration order has no relationship to key order. This is not an oversight; it is the direct cost of the speed, and it is why `lower_bound` cannot exist on a hash container.',
      },
    ],
    keyTakeaways: [
      'A hash table computes a bucket index instead of searching.',
      'Lookup cost depends on bucket length, not on total element count.',
      'Equal keys must hash equally; unequal keys are allowed to collide.',
      'Good hashing scatters keys, which is exactly why ordering is lost.',
    ],
    practice: {
      prompt: 'Implement the 16-bucket hash table above and use it for a small key-value store. Then print `hash<string>{}(s)` for several similar strings and note how unrelated the values are — that scattering is precisely what buys O(1) and costs you ordering.',
      leetcode: { title: 'Design HashMap', slug: 'design-hashmap' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-14.4',
    language: 'cpp',
    summary: 'Understand what "average O(1)" really promises, and when it does not hold.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Hash container operations are **O(1) average, O(n) worst case**. The average is what you get in practice; the worst case is what an interviewer wants you to acknowledge.',
      },
      {
        kind: 'table',
        headers: ['Operation', 'Average', 'Worst case'],
        rows: [
          ['`insert`', 'O(1)', 'O(n) — all keys in one bucket'],
          ['`find` / `count`', 'O(1)', 'O(n)'],
          ['`erase`', 'O(1)', 'O(n)'],
          ['Iterate all', 'O(n)', 'O(n + buckets)'],
        ],
      },
      { kind: 'heading', text: 'Load factor and rehashing' },
      {
        kind: 'code',
        code: `unordered_map<int,int> m;

m.bucket_count();       // how many buckets exist
m.load_factor();        // size / bucket_count
m.max_load_factor();    // 1.0 by default

m.reserve(1000);        // pre-allocate for ~1000 elements
m.rehash(2048);         // set the bucket count directly`,
      },
      {
        kind: 'text',
        body: 'The **load factor** is elements divided by buckets — roughly the average bucket length. When it exceeds the maximum (1.0 by default), the container allocates more buckets and **rehashes**: every existing element is redistributed. That is O(n), but it happens rarely enough to amortise away, exactly like `vector` growth.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'reserve() eliminates rehashing entirely',
        body: 'If you know roughly how many elements are coming, `m.reserve(n)` allocates the buckets up front so no rehash ever occurs. On 10⁵ insertions this is a genuine speedup for one line — and it is the same idea as `vector::reserve`.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'A rehash invalidates iterators, but not references',
        body: 'After a rehash, every iterator into the container is invalid. References and pointers to *elements* remain valid, because the elements themselves are not moved — only the bucket structure changes. This differs from `vector`, where reallocation invalidates everything. Do not hold iterators across insertions either way.',
      },
      { kind: 'heading', text: 'When O(1) is a lie' },
      {
        kind: 'text',
        body: 'If every key hashes to the same bucket, the table degenerates into one long list and every operation becomes O(n). With random data this effectively never happens — but it can be *engineered*.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Hash-collision attacks on competitive judges',
        body: 'GCC\'s hash for integers is close to the identity function, so a crafted input where all keys are multiples of the bucket count lands everything in one bucket. Codeforces has anti-hash-test rounds that exploit this exactly. LeetCode does not do this, but the standard defence is worth knowing: add a random or time-based offset to your keys, or use `map` where the O(log n) is guaranteed.',
      },
      {
        kind: 'code',
        caption: 'The competitive-programming defence',
        code: `// Mix the key with a random constant so an adversary cannot predict buckets
struct SafeHash {
    static uint64_t splitmix64(uint64_t x) {
        x += 0x9e3779b97f4a7c15;
        x = (x ^ (x >> 30)) * 0xbf58476d1ce4e5b9;
        x = (x ^ (x >> 27)) * 0x94d049bb133111eb;
        return x ^ (x >> 31);
    }
    size_t operator()(uint64_t x) const {
        static const uint64_t SEED =
            chrono::steady_clock::now().time_since_epoch().count();
        return splitmix64(x + SEED);
    }
};

unordered_map<long long, int, SafeHash> safe;`,
      },
      {
        kind: 'text',
        body: 'You will not need this on LeetCode. It is worth recognising because you will see it in competitive-programming templates and may be asked why it exists.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The interview answer',
        body: '"Average O(1), because the hash function distributes keys evenly across buckets so each holds a constant number of elements. Worst case O(n) if every key collides into one bucket. Rehashing when the load factor is exceeded is O(n) but amortises to O(1) per insertion."',
      },
    ],
    keyTakeaways: [
      'Hash operations are O(1) average, O(n) worst case when keys all collide.',
      'Load factor = size / buckets; exceeding it triggers an O(n) rehash.',
      '`reserve(n)` avoids rehashing entirely and is a free speedup.',
      'A rehash invalidates iterators but leaves references to elements valid.',
    ],
    practice: {
      prompt: 'Print `bucket_count()` and `load_factor()` while inserting a thousand elements, and watch the bucket count jump at each rehash. Then repeat after calling `reserve(1000)` and confirm it never rehashes. Then state the average and worst-case complexity out loud as you would in an interview.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-14.5',
    language: 'cpp',
    summary: 'Understand what happens when two keys land in the same bucket.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A **collision** is two different keys hashing to the same bucket. It is not an error and not rare — it is inevitable, because there are vastly more possible keys than buckets. The table\'s job is to handle it gracefully.',
      },
      {
        kind: 'code',
        caption: 'Collisions are unavoidable',
        code: `// 16 buckets, but every possible int is a valid key.
// By the pigeonhole principle, many keys must share buckets.

hash("apple")  % 16 == 9
hash("cherry") % 16 == 9      // collision — both belong in bucket 9`,
      },
      { kind: 'heading', text: 'Separate chaining — what the STL uses' },
      {
        kind: 'code',
        code: `// Each bucket is a linked list of everything that hashed there.

buckets[9] → ("apple", 3) → ("cherry", 7) → null

// Lookup: hash to bucket 9, then walk that short list comparing keys.`,
      },
      {
        kind: 'text',
        body: 'The C++ standard effectively mandates this approach, which is why `unordered_map` guarantees that references to elements survive a rehash — the elements live in nodes, and rehashing only relinks them into different buckets.',
      },
      {
        kind: 'table',
        headers: ['Strategy', 'How it resolves a collision', 'Used by'],
        rows: [
          ['**Separate chaining**', 'A list per bucket', '`unordered_map` (C++)'],
          ['**Open addressing**', 'Probe for the next free slot', 'Python dict, many fast custom maps'],
          ['**Robin Hood / cuckoo**', 'Displace entries to even out probe distance', 'High-performance libraries'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Why open addressing is often faster',
        body: 'It stores everything in one contiguous array, so probing stays in cache, whereas chaining follows pointers to scattered nodes. That is why hand-written open-addressed maps routinely beat `unordered_map` in competitive programming. The trade-off is that any insertion can move elements, so references cannot be stable — which is precisely the guarantee C++ chose to keep.',
      },
      { kind: 'heading', text: 'Why the equality operator matters' },
      {
        kind: 'code',
        code: `// A bucket may contain several different keys, so after hashing
// the table must still compare keys for equality:

for (auto& entry : buckets[index])
    if (entry.key == key) return entry.value;      // '==' is essential`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'A custom key type needs both a hash and operator==',
        body: 'Providing only the hash produces a compile error, because the table cannot distinguish colliding keys. Supply both — and keep them consistent: two keys that are `==` must produce the same hash, or lookups will fail silently for keys that are stored but unfindable.',
      },
      {
        kind: 'code',
        caption: 'A complete custom key',
        code: `struct Point {
    int x, y;
    bool operator==(const Point& other) const {
        return x == other.x && y == other.y;
    }
};

struct PointHash {
    size_t operator()(const Point& p) const {
        return hash<int>{}(p.x) ^ (hash<int>{}(p.y) << 1);
    }
};

unordered_set<Point, PointHash> points;`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Beware naive hash combining',
        body: 'A plain XOR of two hashes maps `(a, b)` and `(b, a)` to the same value, and `(x, x)` always to zero — so symmetric or diagonal points all collide. The `<< 1` above partially breaks the symmetry. For real work, combine with something like `h1 ^ (h2 + 0x9e3779b9 + (h1 << 6) + (h1 >> 2))`, the pattern Boost uses.',
      },
      {
        kind: 'text',
        body: 'The practical summary: collisions are normal and cheap when the hash spreads keys well. They only become a problem when the distribution is poor — which for standard key types is not something you have to worry about.',
      },
    ],
    keyTakeaways: [
      'Collisions are inevitable and handled, not errors.',
      'C++ uses separate chaining — a list per bucket — which keeps references stable.',
      'A custom key needs both a hash functor and `operator==`, kept consistent.',
      'Naive XOR combining makes symmetric key pairs collide; mix the bits properly.',
    ],
    practice: {
      prompt: 'Write a custom `Point` key with a hash and `operator==` and store points in an `unordered_set`. Then deliberately return a constant from the hash function so everything collides, and time lookups on 10⁴ points — that is the O(n) worst case made real.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-14.6',
    language: 'cpp',
    summary: 'Count occurrences efficiently, choosing between an array and a hash map.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Frequency counting appears in more problems than almost any other technique. There are two implementations, and picking the right one matters more than people expect.',
      },
      {
        kind: 'code',
        caption: 'Fixed array — when the key range is small and known',
        code: `int freq[26] = {0};                     // MUST initialise
for (char c : s) freq[c - 'a']++;

// Read back
for (int i = 0; i < 26; i++)
    if (freq[i]) cout << (char)('a' + i) << ": " << freq[i] << "\\n";`,
      },
      {
        kind: 'code',
        caption: 'Hash map — when the keys are unbounded',
        code: `unordered_map<int,int> freq;
for (int x : nums) freq[x]++;           // [] creates missing keys at 0

for (auto& [value, count] : freq) { ... }`,
      },
      {
        kind: 'table',
        headers: ['Key range', 'Use', 'Why'],
        rows: [
          ['Lowercase letters', '`int freq[26]`', 'Fastest — no hashing, contiguous'],
          ['Any ASCII character', '`int freq[128]`', 'Same'],
          ['Digits', '`int freq[10]`', 'Same'],
          ['Arbitrary integers', '`unordered_map<int,int>`', 'Range is unbounded'],
          ['Strings or words', '`unordered_map<string,int>`', 'No array indexing possible'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'A local array is not zero-initialised',
        body: '`int freq[26];` without `= {0}` holds garbage, so your counts start from random values. It sometimes appears to work — stack memory is often zero on the first call — and then fails on the judge or on a second invocation. Always write `= {0}`.',
      },
      { kind: 'heading', text: 'The patterns it unlocks' },
      {
        kind: 'code',
        caption: 'Anagram check — increment then decrement',
        code: `bool isAnagram(string s, string t) {
    if (s.size() != t.size()) return false;

    int freq[26] = {0};
    for (char c : s) freq[c - 'a']++;
    for (char c : t) freq[c - 'a']--;

    for (int i = 0; i < 26; i++)
        if (freq[i] != 0) return false;
    return true;
}`,
      },
      {
        kind: 'code',
        caption: 'First unique character — two passes',
        code: `int firstUniqChar(string s) {
    int freq[26] = {0};
    for (char c : s) freq[c - 'a']++;             // pass 1: count
    for (int i = 0; i < s.size(); i++)            // pass 2: scan in order
        if (freq[s[i] - 'a'] == 1) return i;
    return -1;
}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Two passes is usually the right shape',
        body: 'You cannot know a character is unique until you have seen the entire string, so trying to do it in one pass is a common instinct and generally wrong. Two O(n) passes is still O(n) — there is no cost to the second one.',
      },
      { kind: 'heading', text: 'Frequency as a key' },
      {
        kind: 'code',
        caption: 'Group Anagrams with a count key',
        code: `unordered_map<string, vector<string>> groups;

for (const string& word : words) {
    int count[26] = {0};
    for (char c : word) count[c - 'a']++;

    // Build a canonical string key from the counts: "#2#1#0..."
    string key;
    for (int i = 0; i < 26; i++) key += "#" + to_string(count[i]);

    groups[key].push_back(word);
}`,
      },
      {
        kind: 'text',
        body: 'Sorting each word gives an O(k log k) key; counting gives an O(k) one. For long words the counting version is faster, though sorting is shorter to write. The `#` separators matter — without them, counts of 1 and 11 would produce ambiguous keys.',
      },
      {
        kind: 'code',
        caption: 'Sliding window with a frequency map',
        code: `unordered_map<char,int> window;
int left = 0;

for (int right = 0; right < s.size(); right++) {
    window[s[right]]++;

    while (window.size() > k) {                 // too many distinct characters
        if (--window[s[left]] == 0)
            window.erase(s[left]);              // ERASE, do not leave zeros
        left++;
    }
    best = max(best, right - left + 1);
}`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Erase keys that reach zero',
        body: 'If you only decrement, keys with count 0 linger and `window.size()` keeps counting characters that are no longer in the window. The condition then never becomes true and the answer is wrong. Any sliding window that tests `map.size()` must erase zero-count keys.',
      },
    ],
    keyTakeaways: [
      'Use `int freq[26] = {0}` for fixed alphabets, a hash map for unbounded keys.',
      'Always zero-initialise a local frequency array.',
      'Count in one pass, then scan in a second — one pass usually cannot work.',
      'In sliding windows, erase keys whose count drops to zero.',
    ],
    practice: {
      prompt: 'Write Valid Anagram with the increment/decrement trick and First Unique Character with two passes. Then write a sliding window over distinct characters, omit the erase-on-zero step, and find the input where it gives the wrong answer.',
      leetcode: { title: 'Longest Substring Without Repeating Characters', slug: 'longest-substring-without-repeating-characters' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-14.7',
    language: 'cpp',
    summary: 'Combine prefix sums with a hash map to answer subarray questions in O(n).',
    readMinutes: 6,
    blocks: [
      {
        kind: 'text',
        body: 'This is the most powerful single technique in the chapter. It turns "count subarrays with property X" from O(n²) into O(n), and it appears constantly.',
      },
      { kind: 'heading', text: 'The foundation' },
      {
        kind: 'code',
        code: `// prefix[i] = sum of nums[0..i-1]
// Then the sum of nums[i..j] = prefix[j+1] - prefix[i]

vector<int> prefix(n + 1, 0);
for (int i = 0; i < n; i++) prefix[i + 1] = prefix[i] + nums[i];`,
      },
      {
        kind: 'text',
        body: 'Rearranging that identity is the key insight. A subarray ending at `j` sums to `k` exactly when `prefix[j+1] - prefix[i] == k`, i.e. when `prefix[i] == prefix[j+1] - k`. So instead of trying every start `i`, **look up** how many earlier prefixes had the required value.',
      },
      { kind: 'heading', text: 'Subarray Sum Equals K' },
      {
        kind: 'code',
        code: `int subarraySum(vector<int>& nums, int k) {
    unordered_map<int,int> seen;      // prefix sum → how many times it occurred
    seen[0] = 1;                      // the empty prefix — essential

    int sum = 0, count = 0;

    for (int x : nums) {
        sum += x;                                  // running prefix
        if (seen.count(sum - k)) count += seen[sum - k];
        seen[sum]++;
    }
    return count;
}`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'seen[0] = 1 is not optional',
        body: 'It represents the empty prefix, and it is what allows a subarray *starting at index 0* to be counted. Without it, an input like `nums = [3], k = 3` returns 0 instead of 1. This single line is the most commonly forgotten part of the pattern, and it fails only on subarrays that begin at the start — which sample tests often miss.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Why sliding window does not work here',
        body: 'A sliding window needs the sum to grow monotonically as the window widens, which requires all values to be non-negative. With negative numbers, shrinking the window can *increase* the sum, so the window logic breaks. Prefix-sum plus hash map has no such restriction — that is exactly why this problem is posed with negative values allowed.',
      },
      { kind: 'heading', text: 'The variants' },
      {
        kind: 'code',
        caption: 'Longest subarray summing to k — store the first index',
        code: `int longestSubarray(vector<int>& nums, int k) {
    unordered_map<int,int> firstIndex;     // prefix sum → EARLIEST index seen
    firstIndex[0] = -1;                    // empty prefix ends before index 0

    int sum = 0, best = 0;

    for (int i = 0; i < nums.size(); i++) {
        sum += nums[i];
        if (firstIndex.count(sum - k))
            best = max(best, i - firstIndex[sum - k]);

        if (!firstIndex.count(sum))        // only record the FIRST occurrence
            firstIndex[sum] = i;
    }
    return best;
}`,
      },
      {
        kind: 'text',
        body: 'For counting you store frequencies; for the *longest* you store the earliest index and never overwrite it, because an earlier start gives a longer subarray. That `if (!count(sum))` guard is the whole difference between the two variants.',
      },
      {
        kind: 'code',
        caption: 'Subarrays divisible by k — store remainders',
        code: `int subarraysDivByK(vector<int>& nums, int k) {
    unordered_map<int,int> seen;
    seen[0] = 1;

    int sum = 0, count = 0;
    for (int x : nums) {
        sum += x;
        int r = ((sum % k) + k) % k;       // safe modulo — sums can be negative
        count += seen[r];
        seen[r]++;
    }
    return count;
}`,
      },
      {
        kind: 'text',
        body: 'Two prefixes with the same remainder mod k bracket a subarray divisible by k. Note the safe-modulo expression from Chapter 2 — `-7 % 3` is `-1` in C++, which would index the wrong bucket without the correction.',
      },
      {
        kind: 'code',
        caption: 'Contiguous Array — map 0 to −1',
        code: `int findMaxLength(vector<int>& nums) {
    unordered_map<int,int> firstIndex;
    firstIndex[0] = -1;

    int balance = 0, best = 0;
    for (int i = 0; i < nums.size(); i++) {
        balance += (nums[i] == 1) ? 1 : -1;      // treat 0 as -1
        if (firstIndex.count(balance))
            best = max(best, i - firstIndex[balance]);
        else
            firstIndex[balance] = i;
    }
    return best;
}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The recognition rule',
        body: 'If a problem says "**count** or find the **longest** contiguous subarray whose sum/count/balance satisfies some condition" — and especially if negative numbers are allowed — reach for prefix sum plus hash map. Convert the condition into "two prefixes differ by k" or "two prefixes are equal", and the rest is mechanical.',
      },
    ],
    keyTakeaways: [
      'Sum of `nums[i..j]` is `prefix[j+1] - prefix[i]` — rearrange it into a lookup.',
      'Seed the map with `seen[0] = 1` (counting) or `firstIndex[0] = -1` (longest).',
      'Counting stores frequencies; longest stores the earliest index only.',
      'Works with negative numbers, where a sliding window cannot.',
    ],
    practice: {
      prompt: 'Solve Subarray Sum Equals K, then remove `seen[0] = 1` and find the input it breaks on. Then solve Contiguous Array by mapping 0 to −1. Once you see that both are "two prefixes with the same value", the family stops looking like separate problems.',
      leetcode: { title: 'Subarray Sum Equals K', slug: 'subarray-sum-equals-k' },
    },
  },
];
