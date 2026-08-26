import type { Lesson } from '../types';

/**
 * Chapter 13 — STL Associative Containers.
 * Tree-based, always sorted, O(log n). Slower than the hash containers, but
 * they answer ordering questions the hash versions cannot.
 */
export const ch13: Lesson[] = [
  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-13.1',
    language: 'cpp',
    summary: 'Keep a sorted collection of unique values with O(log n) insert, erase and lookup.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: '`set` stores **unique** elements in **sorted** order. It is implemented as a self-balancing binary search tree, so every operation is O(log n) and iteration comes out in ascending order for free.',
      },
      {
        kind: 'code',
        code: `#include <set>

set<int> s;

s.insert(3);
s.insert(1);
s.insert(3);           // ignored — already present

s.size();              // 2
s.count(3);            // 1 if present, 0 if not  (never more, for a set)
s.erase(3);            // erase by value
s.empty();
s.clear();

for (int x : s) cout << x << " ";      // ALWAYS ascending`,
      },
      {
        kind: 'table',
        headers: ['Operation', 'Cost'],
        rows: [
          ['`insert`, `erase`, `count`, `find`', 'O(log n)'],
          ['`*s.begin()`  — smallest', 'O(1)'],
          ['`*s.rbegin()` — largest', 'O(1)'],
          ['`lower_bound` / `upper_bound`', 'O(log n)'],
          ['Iterating all elements', 'O(n), in sorted order'],
          ['Indexing `s[i]`', '**Not supported**'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'No indexing, and no random access',
        body: '`s[2]` does not compile, and there is no way to jump to the k-th element in less than O(k). If you need "the k-th smallest" repeatedly, a `set` is the wrong tool — sort a `vector` instead, or use a different structure. Getting the *single* smallest or largest is O(1) via `begin()`/`rbegin()`.',
      },
      { kind: 'heading', text: 'insert reports whether it was new' },
      {
        kind: 'code',
        code: `auto [it, inserted] = s.insert(5);

if (!inserted) cout << "5 was already there";

// So duplicate detection needs only one operation:
if (!seen.insert(x).second) return true;      // x is a duplicate`,
      },
      {
        kind: 'text',
        body: '`insert` returns a pair: an iterator to the element, and a bool saying whether it was actually added. That lets you test-and-insert in a single O(log n) lookup instead of `count` followed by `insert`.',
      },
      { kind: 'heading', text: 'Erasing' },
      {
        kind: 'code',
        code: `s.erase(5);              // by value — safe even if absent, returns the count erased
s.erase(s.begin());      // by iterator — O(1) amortised

auto it = s.find(5);
if (it != s.end()) s.erase(it);       // find then erase`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Erasing invalidates only that element\'s iterator',
        body: 'Unlike `vector`, erasing from a `set` leaves every other iterator valid. That makes it safe to hold iterators into a set across modifications — the same stability property that makes `list` useful. To erase while looping, use `it = s.erase(it);`, which returns the next valid iterator.',
      },
      { kind: 'heading', text: 'Where it earns its place' },
      {
        kind: 'code',
        caption: 'Sorted unique values in one step',
        code: `set<int> unique(nums.begin(), nums.end());
vector<int> sorted(unique.begin(), unique.end());   // sorted and deduplicated

// Equivalent to, but slower than:
sort(v.begin(), v.end());
v.erase(std::unique(v.begin(), v.end()), v.end());`,
      },
      {
        kind: 'text',
        body: 'The sort-and-unique version is O(n log n) with better constants and cache behaviour. Use a `set` when you need the ordering *maintained* as elements arrive, not when you can sort once at the end.',
      },
      {
        kind: 'code',
        caption: 'Custom ordering',
        code: `set<int, greater<int>> descending;         // largest first

struct ByLength {
    bool operator()(const string& a, const string& b) const {
        if (a.size() != b.size()) return a.size() < b.size();
        return a < b;                          // tie-break, or equal-length
    }                                          // strings would be "equal"
};
set<string, ByLength> byLength;`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'The comparator defines equality, not just order',
        body: 'A `set` considers `a` and `b` equal when neither compares less than the other. So a comparator that only checks length treats every same-length string as a duplicate and silently discards them. Always include a tie-breaker unless you genuinely want that grouping. Note also that `set` comparators are *not* inverted the way `priority_queue`\'s are — `greater` really does give descending order here.',
      },
    ],
    keyTakeaways: [
      '`set` keeps unique elements sorted; all operations are O(log n).',
      'No indexing — `*begin()` and `*rbegin()` give the extremes in O(1).',
      '`insert` returns `{iterator, bool}` — test and insert in one lookup.',
      'The comparator defines equality; omitting a tie-breaker silently drops elements.',
    ],
    practice: {
      prompt: 'Insert duplicates into a `set` and confirm only unique values survive, in sorted order. Then use `insert(x).second` to detect duplicates in one pass. Then write a length-only comparator and watch same-length strings vanish — that is the equality trap made visible.',
      leetcode: { title: 'Contains Duplicate', slug: 'contains-duplicate' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-13.2',
    language: 'cpp',
    summary: 'Keep a sorted collection that allows duplicates — and erase carefully.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: '`multiset` is a `set` that permits duplicate values. Same tree, same O(log n) costs, same sorted iteration — it simply does not reject repeats.',
      },
      {
        kind: 'code',
        code: `#include <set>

multiset<int> ms;
ms.insert(3);
ms.insert(1);
ms.insert(3);          // kept this time

ms.size();             // 3
ms.count(3);           // 2 — now genuinely a count, and O(log n + k)

for (int x : ms) cout << x << " ";      // 1 3 3`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'erase(value) removes EVERY copy',
        body: '`ms.erase(3)` deletes both 3s. To remove just one, erase by iterator: `ms.erase(ms.find(3));`. This is the defining `multiset` bug — the value form is almost never what you want, and it silently removes more than you intended.',
      },
      {
        kind: 'code',
        caption: 'Removing exactly one occurrence',
        code: `auto it = ms.find(3);
if (it != ms.end()) ms.erase(it);        // removes ONE copy

ms.erase(3);                             // removes ALL copies`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'count() on a multiset is not O(log n)',
        body: 'It is O(log n + k), where k is the number of matches, because it has to walk the equal range. For a `set` k is at most 1 so the distinction never matters; for a `multiset` with many duplicates it does. Use `find() != end()` when you only need to know whether the value is present.',
      },
      { kind: 'heading', text: 'Where it is the right tool' },
      {
        kind: 'text',
        body: 'A `multiset` is essentially a sorted collection with fast insert, erase and access to both extremes. That combination is exactly what a sliding window over ordered data needs.',
      },
      {
        kind: 'code',
        caption: 'Sliding window with min and max',
        code: `multiset<int> window;

for (int i = 0; i < nums.size(); i++) {
    window.insert(nums[i]);

    if (i >= k) window.erase(window.find(nums[i - k]));   // ONE copy — find first!

    if (i >= k - 1) {
        int lo = *window.begin();          // O(1)
        int hi = *window.rbegin();         // O(1)
        // ...
    }
}`,
      },
      {
        kind: 'text',
        body: 'A monotonic deque gives sliding-window maximum in O(n), which is faster. But a `multiset` gives *both* extremes at once and handles arbitrary removals, so it is the tool when the window needs more than one order statistic — as in Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit.',
      },
      {
        kind: 'code',
        caption: 'The equal range',
        code: `auto [first, last] = ms.equal_range(3);      // all elements equal to 3
for (auto it = first; it != last; ++it) cout << *it;

int occurrences = distance(first, last);    // same as count(3)`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'multiset vs a map of counts',
        body: '`map<int,int>` storing value→count is often better: `count[x]++` and `count[x]--` are cleaner than find-then-erase, and the size stays proportional to the number of *distinct* values. Prefer `multiset` when you need the extremes in O(1) and the total element count; prefer a count map when you mainly need frequencies.',
      },
    ],
    keyTakeaways: [
      '`multiset` allows duplicates with the same O(log n) tree operations.',
      '`erase(value)` removes every copy — use `erase(find(value))` for one.',
      '`count()` is O(log n + k), not O(log n).',
      'Ideal for sliding windows needing both the minimum and maximum.',
    ],
    practice: {
      prompt: 'Insert three copies of a value into a `multiset`, call `erase(value)`, and confirm all three vanish. Then do it with `erase(find(value))` and confirm only one goes. Then write a sliding window tracking both `*begin()` and `*rbegin()`.',
      leetcode: { title: 'Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit', slug: 'longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-13.3',
    language: 'cpp',
    summary: 'Store sorted key-value pairs, and avoid the operator[] insertion trap.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: '`map` stores key–value pairs sorted by key, with unique keys. Same balanced tree as `set`, so every operation is O(log n) and iteration yields keys in ascending order.',
      },
      {
        kind: 'code',
        code: `#include <map>

map<string, int> ages;

ages["alice"] = 30;          // insert or overwrite
ages["bob"] = 25;
ages.insert({"carol", 35});

ages["alice"];               // 30
ages.at("alice");            // 30 — throws if absent
ages.count("dave");          // 0
ages.size();
ages.erase("bob");

for (auto& [name, age] : ages)          // iterates in KEY order
    cout << name << ": " << age << "\\n";`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'operator[] inserts when the key is missing',
        body: '`if (ages["dave"] > 0)` creates an entry for "dave" with value 0 as a side effect. Your map silently grows, `size()` becomes wrong, and iteration produces keys you never added. To check without inserting, use `count(key)` or `find(key) != end()`. This is the single most common map bug.',
      },
      {
        kind: 'code',
        caption: 'Checking versus inserting',
        code: `if (m.count(key)) { ... }               // no insertion
if (m.find(key) != m.end()) { ... }     // no insertion
if (m.contains(key)) { ... }            // C++20, clearest of all

m[key];                                 // INSERTS if absent
m.at(key);                              // throws if absent, never inserts`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'But the insertion behaviour is exactly what makes counting work',
        body: '`freq[c]++` relies on `[]` default-constructing a missing key to 0, then incrementing it. That is why frequency counting is a one-liner. The behaviour is not a design flaw — it is just dangerous when you meant to *query*.',
      },
      { kind: 'heading', text: 'Iterating and modifying' },
      {
        kind: 'code',
        code: `// Structured bindings, C++17
for (auto& [key, value] : m) value++;          // modifies the map
for (const auto& [key, value] : m) { ... }     // read-only, no copies
for (auto [key, value] : m) value++;           // BUG — copies, map unchanged

// Pre-C++17
for (auto& p : m) cout << p.first << " " << p.second;`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Keys are const — you cannot modify them in place',
        body: 'A map\'s element type is `pair<const Key, Value>`, so `key = "x"` inside a loop does not compile. Changing a key means erasing and re-inserting, which makes sense: the key determines the element\'s position in the tree.',
      },
      { kind: 'heading', text: 'What map gives you that unordered_map cannot' },
      {
        kind: 'code',
        code: `map<int,int> m = {{1,10}, {5,50}, {10,100}};

m.begin()->first;              // 1  — smallest key,   O(1)
m.rbegin()->first;             // 10 — largest key,    O(1)

m.lower_bound(3);              // → key 5  (first key >= 3)
m.upper_bound(5);              // → key 10 (first key > 5)

// Every key in a range
for (auto it = m.lower_bound(2); it != m.upper_bound(8); ++it)
    cout << it->first;         // 5`,
      },
      {
        kind: 'text',
        body: 'Sorted iteration, smallest/largest key, and range queries. If you need none of those, `unordered_map` does the same job at O(1) instead of O(log n).',
      },
      {
        kind: 'code',
        caption: 'A real use: Time-Based Key-Value Store',
        code: `map<int, string> timeline;             // timestamp → value

string get(int timestamp) {
    auto it = timeline.upper_bound(timestamp);   // first STRICTLY after
    if (it == timeline.begin()) return "";       // nothing at or before
    --it;                                        // step back to the latest <=
    return it->second;
}`,
      },
      {
        kind: 'text',
        body: 'That "latest entry at or before a given time" query is impossible with a hash map at any complexity — the ordering is the entire point. This is the clearest example of when `map` is the correct choice.',
      },
    ],
    keyTakeaways: [
      '`map` keeps unique keys sorted; all operations are O(log n).',
      '`operator[]` inserts missing keys — use `count`/`find`/`contains` to query.',
      'Keys are `const`; changing one means erase and re-insert.',
      'Choose `map` only for sorted iteration, extremes, or range queries.',
    ],
    practice: {
      prompt: 'Build a map, then write `if (m["missing"] == 0)` and print `m.size()` before and after — watching it grow is what makes the `[]` trap stick. Then implement the Time-Based Key-Value Store with `upper_bound` and a step back.',
      leetcode: { title: 'Time Based Key-Value Store', slug: 'time-based-key-value-store' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-13.4',
    language: 'cpp',
    summary: 'Map one key to several values, and know the simpler alternative.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: '`multimap` allows repeated keys. Sorted by key, O(log n) operations — but no `operator[]`, because with duplicate keys there is no single value to return.',
      },
      {
        kind: 'code',
        code: `#include <map>

multimap<string, string> phone;

phone.insert({"alice", "555-1111"});
phone.insert({"alice", "555-2222"});      // both are kept
phone.insert({"bob",   "555-3333"});

// phone["alice"];        // ERROR — no operator[] on a multimap

phone.count("alice");     // 2
phone.size();             // 3`,
      },
      {
        kind: 'code',
        caption: 'Reading all values for one key',
        code: `auto [first, last] = phone.equal_range("alice");
for (auto it = first; it != last; ++it)
    cout << it->second << "\\n";          // 555-1111, 555-2222`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'erase(key) removes every entry for that key',
        body: 'Exactly as with `multiset`. To remove one specific pair, find it and erase by iterator. And because there is no `[]`, every read goes through `find` or `equal_range` — which is why `multimap` code is noticeably more verbose than `map` code.',
      },
      { kind: 'heading', text: 'The alternative you will usually prefer' },
      {
        kind: 'code',
        code: `// multimap
multimap<string, string> phone;
phone.insert({"alice", "555-1111"});
auto [first, last] = phone.equal_range("alice");
for (auto it = first; it != last; ++it) { ... }

// map to vector — simpler, and usually faster
map<string, vector<string>> phone;
phone["alice"].push_back("555-1111");     // [] builds the vector automatically
for (const string& number : phone["alice"]) { ... }`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'map<K, vector<V>> is almost always the better choice',
        body: 'You get `operator[]`, a real `.size()` per key, indexable values, and much clearer code. Grouping problems — Group Anagrams, bucketing by frequency — all use this form. `multimap` is worth recognising when you read it, but there is rarely a reason to reach for it yourself.',
      },
      {
        kind: 'code',
        caption: 'The grouping idiom in full',
        code: `unordered_map<string, vector<string>> groups;

for (const string& word : words) {
    string key = word;
    sort(key.begin(), key.end());
    groups[key].push_back(word);      // no existence check needed
}`,
      },
      {
        kind: 'text',
        body: 'One place `multimap` is genuinely natural: when entries must stay sorted by key *and* duplicates are meaningful — for example an event log ordered by timestamp where several events share a time. Even then, `map<int, vector<Event>>` usually reads better.',
      },
    ],
    keyTakeaways: [
      '`multimap` allows duplicate keys and therefore has no `operator[]`.',
      'Use `equal_range` to read all values for a key.',
      '`erase(key)` removes every matching entry.',
      'Prefer `map<K, vector<V>>` — clearer, indexable, and `[]` builds the vector.',
    ],
    practice: {
      prompt: 'Store two phone numbers for one name in a `multimap` and read them back with `equal_range`. Then rewrite it as `map<string, vector<string>>` and compare the two versions — the second is shorter and easier to read, which is why it wins in practice.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-13.5',
    language: 'cpp',
    summary: 'Understand the balanced tree underneath, and what the log factor buys you.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: '`set`, `map`, `multiset` and `multimap` are all the same structure: a **self-balancing binary search tree**, in practice a red-black tree. Every element sits in a node with a left and right child, ordered so that everything left of a node is smaller and everything right is larger.',
      },
      {
        kind: 'code',
        caption: 'The shape',
        code: `            8
          /   \\
         3     10
        / \\      \\
       1   6      14

// In-order traversal → 1 3 6 8 10 14, always sorted.
// Searching for 6: 6 < 8 go left, 6 > 3 go right, found. Three comparisons.`,
      },
      {
        kind: 'text',
        body: 'Each comparison eliminates half the remaining tree, so a search takes at most log₂ n steps. For a million elements that is about 20 comparisons — the log factor in every complexity in this chapter.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: '"Self-balancing" is what makes the guarantee real',
        body: 'A plain BST degenerates: insert 1, 2, 3, 4, 5 in order and it becomes a straight line, making every operation O(n). Red-black trees rotate on insertion and deletion to keep the height within a constant factor of log n. That is why `set` guarantees O(log n) even for sorted input — a hand-written BST would not.',
      },
      { kind: 'heading', text: 'What the ordering gives you' },
      {
        kind: 'table',
        headers: ['Capability', '`set`/`map`', '`unordered_set`/`unordered_map`'],
        rows: [
          ['Lookup', 'O(log n)', '**O(1) average**'],
          ['Iterate in sorted order', '**Yes, free**', 'No — arbitrary order'],
          ['Smallest / largest element', '**O(1)**', 'O(n) scan'],
          ['`lower_bound` / range queries', '**O(log n)**', '**Not available**'],
          ['Predecessor / successor of a key', '**O(log n)**', 'Not available'],
          ['Worst-case guarantee', '**O(log n)**', 'O(n) if all keys collide'],
        ],
      },
      {
        kind: 'code',
        caption: 'The operations only a tree can do',
        code: `set<int> s = {1, 3, 6, 8, 10};

*s.begin();                 // 1  — smallest,  O(1)
*s.rbegin();                // 10 — largest,   O(1)

*s.lower_bound(5);          // 6  — first >= 5
*s.upper_bound(6);          // 8  — first > 6

// Predecessor of 6:
auto it = s.lower_bound(6);
if (it != s.begin()) cout << *prev(it);      // 3`,
      },
      {
        kind: 'text',
        body: 'None of these exist on a hash container, at any complexity — hashing deliberately destroys the ordering to gain speed. When a problem asks for "the closest value", "the next larger key" or "everything in a range", you need a tree.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Iteration order is guaranteed and stable',
        body: 'A `map` always iterates in key order, no matter what order you inserted in. An `unordered_map`\'s order is unspecified and can even change after a rehash. If your output depends on iteration order, a hash container will give you inconsistent results between runs or between compilers — a genuinely confusing class of bug.',
      },
      { kind: 'heading', text: 'The cost side' },
      {
        kind: 'text',
        body: 'Each node is a separate heap allocation holding the value plus three pointers and a colour bit, so a `set<int>` uses roughly five times the memory of a `vector<int>`. Traversal chases pointers across scattered memory, which is far less cache-friendly than a contiguous array. In practice a `set` lookup is often several times slower than an `unordered_map` lookup even though both are "fast".',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The decision, in one line',
        body: 'Use a hash container by default. Switch to a tree container only when you need sorted iteration, the extremes, range queries, or a hard worst-case guarantee. Beginners often reach for `map` out of habit and pay the log factor for ordering they never use.',
      },
    ],
    keyTakeaways: [
      'All four associative containers are self-balancing binary search trees.',
      'Balancing is what guarantees O(log n) even for sorted insertions.',
      'Trees alone offer sorted iteration, O(1) extremes and range queries.',
      'Hash containers are faster in practice — use trees only when order matters.',
    ],
    practice: {
      prompt: 'Insert 1 through 10 in order into a `set` and confirm lookups stay fast — an unbalanced BST would have degenerated into a list. Then time a million lookups in a `set` against an `unordered_map` to feel the constant-factor difference behind "O(log n) versus O(1)".',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-13.6',
    language: 'cpp',
    summary: 'Find where a value belongs in sorted data — the basis of every range query.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: '`lower_bound` and `upper_bound` do binary search on sorted data and hand you a **position** rather than a yes/no answer. That position answers far more questions than "is it present?" does — counting duplicates, finding the nearest value, and every range query is built on it.',
      },
      {
        kind: 'table',
        headers: ['Function', 'Returns an iterator to'],
        rows: [
          ['`lower_bound(x)`', 'The first element **≥ x**'],
          ['`upper_bound(x)`', 'The first element **> x**'],
        ],
      },
      {
        kind: 'text',
        body: 'Both return `end()` when no such element exists. The difference is only what happens when `x` is present: `lower_bound` points *at* it, `upper_bound` points *past* it.',
      },
      {
        kind: 'code',
        caption: 'On the set {1, 3, 3, 5, 7}',
        code: `lower_bound(3);      // → the first 3
upper_bound(3);      // → 5   (past both 3s)

lower_bound(4);      // → 5   (no 4, so the first thing above it)
upper_bound(4);      // → 5   (identical when x is absent)

lower_bound(9);      // → end()  (nothing that large)`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'They are equal exactly when x is absent',
        body: '`lower_bound(x) == upper_bound(x)` means there are no elements equal to `x`. The gap between them is the run of elements equal to `x`, which is precisely what `equal_range` returns and how `count` is computed.',
      },
      { kind: 'heading', text: 'Member versus free function' },
      {
        kind: 'code',
        code: `set<int> s = {1, 3, 5};
s.lower_bound(2);                        // MEMBER — O(log n), uses the tree

vector<int> v = {1, 3, 5};
lower_bound(v.begin(), v.end(), 2);      // FREE — O(log n) on a sorted vector`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Never use the free version on a set or map',
        body: '`std::lower_bound(s.begin(), s.end(), x)` compiles but runs in **O(n)**, because set iterators cannot jump to the middle — it degrades to a linear walk. Always use the member function `s.lower_bound(x)`. This is a silent performance bug: correct answers, mysteriously slow.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'The free version requires sorted input',
        body: 'On an unsorted `vector` it gives nonsense with no warning — binary search on unsorted data is meaningless. Sort first, or use a container that maintains order.',
      },
      { kind: 'heading', text: 'The patterns these unlock' },
      {
        kind: 'code',
        caption: '1. Insertion position in a sorted vector',
        code: `int pos = lower_bound(v.begin(), v.end(), x) - v.begin();
v.insert(v.begin() + pos, x);        // O(log n) to find, O(n) to insert`,
      },
      {
        kind: 'code',
        caption: '2. Counting a value, and counting a range',
        code: `int occurrences = upper_bound(v.begin(), v.end(), x)
                - lower_bound(v.begin(), v.end(), x);

int inRange = upper_bound(v.begin(), v.end(), hi)
            - lower_bound(v.begin(), v.end(), lo);      // count of lo <= val <= hi`,
      },
      {
        kind: 'code',
        caption: '3. Predecessor and successor',
        code: `set<int> s = {1, 3, 6, 8};

// Successor: smallest element > x
auto succ = s.upper_bound(x);
if (succ != s.end()) cout << *succ;

// Predecessor: largest element < x
auto pred = s.lower_bound(x);
if (pred != s.begin()) cout << *prev(pred);`,
      },
      {
        kind: 'text',
        body: 'The predecessor form — `lower_bound` then step back — is worth memorising. It answers "the nearest value at or below x", which is what interval-scheduling, calendar-booking and time-series problems keep asking for.',
      },
      {
        kind: 'code',
        caption: '4. Closest value',
        code: `auto it = s.lower_bound(x);
int best = INT_MAX;
if (it != s.end())   best = min(best, abs(*it - x));
if (it != s.begin()) best = min(best, abs(*prev(it) - x));`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Always check begin() before calling prev()',
        body: '`prev(s.begin())` is undefined behaviour — there is nothing before the first element. Every predecessor query needs the `it != s.begin()` guard first. Forgetting it produces a crash only when `x` is smaller than everything in the container, which is exactly the kind of edge case hidden tests include.',
      },
    ],
    keyTakeaways: [
      '`lower_bound` finds the first element ≥ x; `upper_bound` the first > x.',
      'They are equal exactly when x is absent; the gap between them is the count.',
      'Use the **member** version on `set`/`map` — the free one degrades to O(n).',
      'Guard with `it != begin()` before `prev(it)` for predecessor queries.',
    ],
    practice: {
      prompt: 'On a sorted vector with duplicates, use `upper_bound - lower_bound` to count occurrences and to count a range. Then write predecessor and successor queries on a `set`, testing with values below the minimum and above the maximum — those are the two cases the guards exist for.',
      leetcode: { title: 'Search Insert Position', slug: 'search-insert-position' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-13.7',
    language: 'cpp',
    summary: 'Decide between tree and hash containers using the operations the problem needs.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'C++ gives you two families of associative container — tree-based and hash-based — and the choice reduces to a single question: **do I need order?** If not, hash wins on speed. If yes, the tree containers are the only option.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The default',
        body: 'Use `unordered_map` / `unordered_set`. They are O(1) average against O(log n), and most problems only ever ask "is this key present" and "what is its value". Reach for a tree container only when you need something a hash cannot do.',
      },
      { kind: 'heading', text: 'The five reasons to choose a tree container' },
      {
        kind: 'text',
        body: '**1. You need sorted iteration.** The output must be in key order, and sorting afterwards would cost an extra O(n log n) — or the keys are consumed in order as you go.',
      },
      {
        kind: 'text',
        body: '**2. You need the smallest or largest, repeatedly.** `*begin()` and `*rbegin()` are O(1); scanning an `unordered_map` is O(n) every time.',
      },
      {
        kind: 'text',
        body: '**3. You need range or nearest queries.** `lower_bound`, `upper_bound`, predecessor, successor, "the closest value to x" — none of these exist on a hash container.',
      },
      {
        kind: 'text',
        body: '**4. The keys are not hashable.** `unordered_map` needs a hash function. `pair`, `vector` and custom structs have none by default, while `map` only needs `<`, which `pair` and `vector` already provide.',
      },
      {
        kind: 'text',
        body: '**5. You need a worst-case guarantee.** `unordered_map` is O(n) if every key collides. Rare in practice, but a tree\'s O(log n) is a hard bound.',
      },
      {
        kind: 'code',
        caption: 'Reason 4, concretely',
        code: `map<pair<int,int>, int> m;            // works immediately — pair has <
m[{1, 2}] = 5;

unordered_map<pair<int,int>, int> um; // ERROR — no std::hash for pair

// You would have to supply one:
struct PairHash {
    size_t operator()(const pair<int,int>& p) const {
        return hash<long long>()(((long long)p.first << 32) ^ p.second);
    }
};
unordered_map<pair<int,int>, int, PairHash> um;   // now it compiles`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'This error surprises everyone once',
        body: 'Trying to use a `pair` as an `unordered_map` key produces a wall of template errors about a missing `std::hash`. The quickest fixes are: use `map` instead, encode the pair into a single number (`r * cols + c` for grid coordinates), or write a hash functor as above. For grid problems the encoding trick is usually cleanest.',
      },
      {
        kind: 'table',
        headers: ['The problem needs…', 'Container'],
        rows: [
          ['"has this been seen"', '`unordered_set`'],
          ['"count occurrences"', '`unordered_map`'],
          ['"output in sorted order"', '`map` / `set`'],
          ['"smallest / largest key"', '`map` / `set`'],
          ['"next greater key", "closest value"', '`set` with `lower_bound`'],
          ['"all keys between a and b"', '`map` with `lower_bound`/`upper_bound`'],
          ['"latest entry at or before time t"', '`map` with `upper_bound` and `prev`'],
          ['A `pair` or `vector` as the key', '`map`, or encode into one number'],
        ],
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Do not sort a map to get order — that is what map is for',
        body: 'Copying an `unordered_map` into a vector and sorting it costs O(n log n) and extra code. If you knew you needed sorted output, a `map` gives it for free. Conversely, if you only sort *once* at the very end, an `unordered_map` plus one sort is faster than paying the log factor on every one of n insertions.',
      },
      {
        kind: 'text',
        body: 'That last trade-off is the honest summary: `map` amortises the ordering cost across every operation, `unordered_map` plus a final sort pays it once. Which wins depends on whether you need the order *during* the algorithm or only at the end.',
      },
    ],
    keyTakeaways: [
      'Default to hash containers; use trees only for ordering-dependent operations.',
      'Trees give sorted iteration, O(1) extremes, and range/nearest queries.',
      '`pair` and `vector` work as `map` keys but need a custom hash for `unordered_map`.',
      'Need order only at the end? Use a hash container and sort once.',
    ],
    practice: {
      prompt: 'Try `unordered_map<pair<int,int>, int>` and read the error, then make it work three ways: switch to `map`, encode the pair as `r * cols + c`, and write a hash functor. Then take five problems and justify the container choice in one sentence each.',
    },
  },
];
