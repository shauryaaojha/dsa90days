import type { Lesson } from '../types';

/**
 * Chapter 10 — STL Foundation.
 * The orientation chapter: what the library is, how its three pieces fit
 * together, and how to choose a container from a problem statement.
 */
export const ch10: Lesson[] = [
  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-10.1',
    language: 'cpp',
    summary: 'Understand what the standard library gives you and why writing it yourself is a mistake.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'The Standard Template Library is the collection of ready-made data structures and algorithms that ship with C++. Hash maps, balanced trees, heaps, sorting — all implemented, tested, and tuned by people who spent years on them.',
      },
      {
        kind: 'code',
        caption: 'The same task, with and without',
        code: `// Writing it yourself: a hash map is 100+ lines of buckets,
// hashing, collision handling and resizing.

// With the STL:
unordered_map<int, int> seen;
seen[value] = index;
if (seen.count(target)) { ... }`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Knowing the STL is a large part of "knowing C++" for interviews',
        body: 'Almost nobody is asked to implement a hash map from scratch in an interview. You are asked to *pick the right one* and use it fluently. A candidate who reaches for `unordered_map` instantly and states its complexity is demonstrating exactly the skill being assessed.',
      },
      { kind: 'heading', text: 'Why "Template"' },
      {
        kind: 'code',
        code: `vector<int>     numbers;      // vector of ints
vector<string>  words;        // vector of strings
vector<TreeNode*> nodes;      // vector of pointers

// One implementation, generated fresh for each type at compile time.`,
      },
      {
        kind: 'text',
        body: 'Templates let one piece of code work for any type without losing type safety or speed. The compiler stamps out a specialised version for each type you actually use, so `vector<int>` is exactly as fast as a hand-written int array — there is no boxing, no runtime type checking, no indirection.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'This is also why template errors are so long',
        body: 'A single mistake — a missing `const`, the wrong comparator signature — produces pages of output naming internal template types you have never heard of. The trick is to read only the **first** error and the line number in *your* file, ignoring the rest. Nearly always the real problem is one small thing at that line.',
      },
      { kind: 'heading', text: 'What it actually contains' },
      {
        kind: 'table',
        headers: ['Part', 'Examples'],
        rows: [
          ['Sequence containers', '`vector`, `deque`, `list`, `array`'],
          ['Associative containers', '`map`, `set`, `multimap`, `multiset`'],
          ['Unordered containers', '`unordered_map`, `unordered_set`'],
          ['Container adaptors', '`stack`, `queue`, `priority_queue`'],
          ['Algorithms', '`sort`, `find`, `reverse`, `binary_search`, `accumulate`'],
          ['Utilities', '`pair`, `tuple`, `swap`, `min`, `max`'],
        ],
      },
      {
        kind: 'text',
        body: 'Chapters 11 to 16 work through these. The goal is not to memorise every method but to know which container solves which shape of problem, and what each operation costs.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Do not reimplement what the STL provides',
        body: 'Writing your own sort or hash map in a contest wastes time and introduces bugs. The exception is when a problem explicitly asks you to implement a structure — Trie, Min Stack, LRU Cache — where building it *is* the question. Everywhere else, use the library.',
      },
    ],
    keyTakeaways: [
      'The STL provides tested, tuned data structures and algorithms.',
      'Templates give one implementation per type, with no speed penalty.',
      'Template errors are long — read the first one and your own line number.',
      'Reimplement a structure only when the problem is asking you to.',
    ],
    practice: {
      prompt: 'Write Two Sum with an `unordered_map`, then estimate how long a hand-written hash map would have taken. Then deliberately pass a wrong comparator to `sort` and look at the error wall — practising the habit of reading only the first line and your own file is genuinely useful.',
      leetcode: { title: 'Two Sum', slug: 'two-sum' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-10.2',
    language: 'cpp',
    summary: 'See how containers, iterators and algorithms plug into each other.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'The STL has three parts, and the design is what makes them composable: **containers** store data, **algorithms** process ranges, and **iterators** are the common interface between them. Because `sort` speaks iterators rather than "vector", one implementation works on anything that can produce them.',
      },
      {
        kind: 'code',
        code: `vector<int> v = {3, 1, 2};

sort(v.begin(), v.end());        // the algorithm never mentions "vector"

string s = "cba";
sort(s.begin(), s.end());        // the same sort, on a string`,
      },
      { kind: 'heading', text: 'Iterators: the half-open range' },
      {
        kind: 'code',
        code: `vector<int> v = {10, 20, 30};

v.begin();        // points at the first element
v.end();          // points ONE PAST the last — not at an element

*v.begin();       // 10
*v.end();         // UNDEFINED — never dereference end()`,
      },
      {
        kind: 'text',
        body: 'Every STL range is `[begin, end)` — inclusive start, exclusive end. This is the same half-open convention as `for (int i = 0; i < n; i++)`, and it is why `end() - begin()` gives the size directly and why an empty range is simply `begin() == end()`.',
      },
      {
        kind: 'code',
        caption: 'Using them directly',
        code: `for (auto it = v.begin(); it != v.end(); ++it)
    cout << *it << " ";

// Range-based for is sugar over exactly this:
for (int x : v) cout << x << " ";

// Sub-ranges come for free
sort(v.begin() + 1, v.end());         // sort all but the first
reverse(v.begin(), v.begin() + 3);    // reverse only the first three`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Use != not < when comparing iterators',
        body: '`it != v.end()` works for every container. `it < v.end()` only works for contiguous ones like `vector` and `string`, because `map` and `list` iterators have no ordering. Writing `!=` habitually means your loops keep working when you change the container type.',
      },
      { kind: 'heading', text: 'The five iterator categories' },
      {
        kind: 'table',
        headers: ['Category', 'Can do', 'Containers'],
        rows: [
          ['Input / Output', 'Read or write, forward once', 'Streams'],
          ['Forward', '`++`, read/write repeatedly', '`forward_list`'],
          ['Bidirectional', 'Also `--`', '`list`, `map`, `set`'],
          ['Random access', 'Also `+ n`, `- n`, `<`', '`vector`, `deque`, `array`, `string`'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'sort needs random-access iterators',
        body: '`sort(myList.begin(), myList.end())` fails to compile with a wall of template errors, because `list` iterators cannot jump. `list` provides its own `myList.sort()` member function instead. Similarly `binary_search` on a `list` compiles but degrades to O(n), since it cannot jump to the middle. This is the most common cause of "why does this algorithm not work on my container".',
      },
      { kind: 'heading', text: 'Algorithms return iterators, not values' },
      {
        kind: 'code',
        code: `auto it = find(v.begin(), v.end(), 20);

if (it != v.end()) {                  // this is how you test "found"
    cout << *it;                      // dereference to get the value
    int index = it - v.begin();       // subtract to get the position
}

*max_element(v.begin(), v.end());     // the star is required — it returns an iterator`,
      },
      {
        kind: 'text',
        body: 'Returning `end()` is how algorithms say "not found" — there is no special value to collide with real data. Forgetting the `*` on `max_element` is one of the most common small errors in C++ DSA code.',
      },
    ],
    keyTakeaways: [
      'Iterators are the interface that lets one algorithm work on many containers.',
      'Ranges are half-open `[begin, end)`; `end()` points one past the last element.',
      'Compare iterators with `!=`, not `<` — only contiguous containers support `<`.',
      'Algorithms return iterators; `end()` means "not found", and `*` gets the value.',
    ],
    practice: {
      prompt: 'Print a vector with an explicit iterator loop, then find an element and convert the iterator to an index with `it - v.begin()`. Then try `sort` on a `list` and read the first line of the error — recognising "this container has the wrong iterator category" saves real confusion.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-10.3',
    language: 'cpp',
    summary: 'See concretely how the right container turns an O(n²) solution into O(n).',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'The STL is not a convenience on LeetCode — it is usually the difference between passing and exceeding the time limit. Choosing the right container *is* the optimisation in a large share of problems.',
      },
      { kind: 'heading', text: 'The canonical example: Two Sum' },
      {
        kind: 'code',
        caption: 'Brute force — O(n²)',
        code: `vector<int> twoSum(vector<int>& nums, int target) {
    for (int i = 0; i < nums.size(); i++)
        for (int j = i + 1; j < nums.size(); j++)
            if (nums[i] + nums[j] == target) return {i, j};
    return {};
}
// n = 10^4 → 10^8 operations → too slow`,
      },
      {
        kind: 'code',
        caption: 'With a hash map — O(n)',
        code: `vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;          // value → index
    for (int i = 0; i < nums.size(); i++) {
        int need = target - nums[i];
        if (seen.count(need)) return {seen[need], i};
        seen[nums[i]] = i;                 // record AFTER checking
    }
    return {};
}`,
      },
      {
        kind: 'text',
        body: 'The algorithmic insight is small — "have I already seen the complement?" — but it only becomes O(n) because `unordered_map` answers that question in O(1). Without the container, the idea is worthless.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Insert after checking, not before',
        body: 'If you insert `nums[i]` before looking for its complement, an element can pair with itself when `target` is exactly `2 * nums[i]`. Check first, then insert — the ordering is the whole correctness argument for the one-pass version.',
      },
      { kind: 'heading', text: 'The recurring upgrades' },
      {
        kind: 'table',
        headers: ['Instead of', 'Use', 'Goes from', 'To'],
        rows: [
          ['Nested loop searching for a value', '`unordered_set` / `unordered_map`', 'O(n²)', 'O(n)'],
          ['Scanning for the maximum repeatedly', '`priority_queue`', 'O(n²)', 'O(n log n)'],
          ['Re-sorting after each insert', '`set` / `map`', 'O(n² log n)', 'O(n log n)'],
          ['Erasing from the front of a vector', '`deque`', 'O(n) per op', 'O(1)'],
          ['Manual index stack', '`stack`', '—', 'Clearer, fewer bugs'],
        ],
      },
      {
        kind: 'code',
        caption: 'Two more one-line wins',
        code: `// "Have I seen this before?" — O(1) instead of a linear scan
unordered_set<int> seen;
if (seen.count(x)) { /* duplicate */ }
seen.insert(x);

// "What is the largest so far?" — O(log n) instead of re-scanning
priority_queue<int> pq;
pq.push(x);
int largest = pq.top();`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Read the operation the problem repeats',
        body: 'Ask: which operation happens *inside the loop*? If it is "look this up", you need a hash container. If it is "give me the smallest or largest", you need a heap. If it is "give me things in sorted order", you need `set`/`map`. The repeated operation names the container, and the container fixes the complexity.',
      },
      {
        kind: 'text',
        body: 'A useful sanity check before coding: if the constraints allow n = 10⁵ and your plan has a loop inside a loop, the plan is wrong. Find the repeated inner operation and replace it with a container that does it in O(1) or O(log n).',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'The STL is fast, but not free',
        body: '`unordered_map` is O(1) *average*, with real constant overhead from hashing and pointer chasing. For small fixed key ranges — 26 letters, 128 ASCII values — a plain `int freq[26]` array is several times faster and should be preferred. Reach for a hash map when the key range is genuinely large or unknown.',
      },
    ],
    keyTakeaways: [
      'The right container is often the entire optimisation, not a detail.',
      'Nested-loop lookup → hash container: O(n²) becomes O(n).',
      'In Two Sum, check for the complement *before* inserting.',
      'For small fixed key ranges, a plain array beats `unordered_map`.',
    ],
    practice: {
      prompt: 'Write Two Sum both ways and time them on 10,000 elements. Then solve Contains Duplicate with an `unordered_set` in one pass. Feeling the quadratic version actually stall is what makes container choice register as a correctness issue rather than a style one.',
      leetcode: { title: 'Contains Duplicate', slug: 'contains-duplicate' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-10.4',
    language: 'cpp',
    summary: 'Pick the right container from the problem statement, using a short decision procedure.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Container choice sounds like it needs experience. It mostly needs three questions, asked in order.',
      },
      { kind: 'heading', text: 'The three questions' },
      {
        kind: 'text',
        body: '**1. Do I need key–value pairs, or just values?** Pairs → a map. Values only → a set or a sequence.',
      },
      {
        kind: 'text',
        body: '**2. Do I need sorted order, or is any order fine?** Sorted → `map`/`set` (tree-based, O(log n)). Unordered → `unordered_map`/`unordered_set` (hash-based, O(1)).',
      },
      {
        kind: 'text',
        body: '**3. Where do I insert and remove?** Only at the back → `vector`. Both ends → `deque`. Always the largest or smallest → `priority_queue`.',
      },
      {
        kind: 'table',
        headers: ['I need to…', 'Use', 'Cost'],
        rows: [
          ['Store an ordered list, index into it', '`vector`', 'O(1) access, O(1) push_back'],
          ['Add and remove at both ends', '`deque`', 'O(1) both ends'],
          ['Last in, first out', '`stack`', 'O(1)'],
          ['First in, first out', '`queue`', 'O(1)'],
          ['Always get the max or min', '`priority_queue`', 'O(log n) push/pop, O(1) top'],
          ['Check membership fast', '`unordered_set`', 'O(1) average'],
          ['Map keys to values fast', '`unordered_map`', 'O(1) average'],
          ['Keep keys sorted / do range queries', '`map` or `set`', 'O(log n)'],
          ['Allow duplicate keys', '`multiset` / `multimap`', 'O(log n)'],
        ],
      },
      { kind: 'heading', text: 'Reading the statement for clues' },
      {
        kind: 'table',
        headers: ['The problem says…', 'Reach for'],
        rows: [
          ['"has this appeared before", "duplicate", "unique"', '`unordered_set`'],
          ['"count occurrences", "frequency"', '`unordered_map` or `int freq[26]`'],
          ['"k largest", "k smallest", "top k"', '`priority_queue`'],
          ['"matching brackets", "undo", "most recent"', '`stack`'],
          ['"level by level", "shortest path", "BFS"', '`queue`'],
          ['"in sorted order", "next greater key", "range"', '`map` / `set`'],
          ['"sliding window maximum"', '`deque`'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Default to unordered unless you need order',
        body: '`unordered_map` is O(1) average against `map`\'s O(log n), so prefer it by default. Switch to `map` only when you genuinely need sorted iteration, `lower_bound` range queries, or the smallest/largest key. Beginners often reach for `map` out of habit and pay a log factor for ordering they never use.',
      },
      { kind: 'heading', text: 'When two containers work together' },
      {
        kind: 'code',
        caption: 'The combinations worth knowing',
        code: `// LRU Cache — O(1) lookup plus O(1) reordering
unordered_map<int, list<pair<int,int>>::iterator> pos;
list<pair<int,int>> items;

// Top-K frequent — count, then heap over the counts
unordered_map<int,int> freq;
priority_queue<pair<int,int>> pq;

// Insert/Delete/GetRandom in O(1) — vector for random, map for the index
vector<int> values;
unordered_map<int,int> indexOf;`,
      },
      {
        kind: 'text',
        body: 'When one container cannot give every operation the required complexity, pairing two is usually the intended answer. That is the core insight behind most "design a data structure" problems.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Do not over-think it',
        body: '`vector` and `unordered_map` between them cover the majority of problems. Start with those, and only reach for something more specialised when a specific operation is too slow. Choosing an exotic container first usually costs more time than it saves.',
      },
    ],
    keyTakeaways: [
      'Ask: key–value or values? Sorted or not? Where do insertions happen?',
      'Default to `unordered_*`; use `map`/`set` only when you need ordering.',
      'Problem phrasing maps directly onto containers — "top k" means heap.',
      'When no single container suffices, combine two — that is the design pattern.',
    ],
    practice: {
      prompt: 'Take ten LeetCode problems you have seen and, without coding, name the container each needs and why. Then check your answers against the editorials. Building this reflex is worth more than memorising any container\'s method list.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-10.5',
    language: 'cpp',
    summary: 'Know what every common operation costs, and use constraints to choose a target complexity.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'You cannot choose a container without knowing what its operations cost. This table is worth committing to memory — it is also a standard interview question.',
      },
      {
        kind: 'table',
        headers: ['Container', 'Access', 'Search', 'Insert', 'Erase'],
        rows: [
          ['`vector`', 'O(1)', 'O(n)', 'O(1) back, O(n) middle', 'O(1) back, O(n) middle'],
          ['`deque`', 'O(1)', 'O(n)', 'O(1) both ends', 'O(1) both ends'],
          ['`list`', 'O(n)', 'O(n)', 'O(1) given a position', 'O(1) given a position'],
          ['`set` / `map`', '—', 'O(log n)', 'O(log n)', 'O(log n)'],
          ['`unordered_set/map`', '—', 'O(1) avg', 'O(1) avg', 'O(1) avg'],
          ['`priority_queue`', 'O(1) top', '—', 'O(log n)', 'O(log n) top'],
          ['`stack` / `queue`', 'O(1) top/front', '—', 'O(1)', 'O(1)'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Two entries people misremember',
        body: '**`list` access is O(n)** — there is no `myList[5]`, you must walk from one end. Its O(1) insert only applies once you already hold an iterator to the position. And **`unordered_map` is O(1) *average*, O(n) worst case** if every key collides; the average is what matters in practice, but the distinction is worth stating in an interview.',
      },
      { kind: 'heading', text: 'Algorithms' },
      {
        kind: 'table',
        headers: ['Algorithm', 'Complexity'],
        rows: [
          ['`sort`', 'O(n log n)'],
          ['`binary_search`, `lower_bound`', 'O(log n) — sorted input required'],
          ['`find`, `count`, `accumulate`', 'O(n)'],
          ['`reverse`', 'O(n)'],
          ['`min_element`, `max_element`', 'O(n)'],
          ['`next_permutation`', 'O(n) per call'],
        ],
      },
      { kind: 'heading', text: 'Letting constraints pick the target' },
      {
        kind: 'text',
        body: 'A judge handles roughly 10⁸ simple operations per second. Read the constraint, and it tells you which complexity you are aiming for — before you write anything.',
      },
      {
        kind: 'table',
        headers: ['Constraint on n', 'Target', 'Typical approach'],
        rows: [
          ['n ≤ 10', 'O(n!)', 'Permutations, brute force'],
          ['n ≤ 20', 'O(2ⁿ)', 'Subsets, bitmask DP'],
          ['n ≤ 500', 'O(n³)', 'Floyd–Warshall, interval DP'],
          ['n ≤ 5,000', 'O(n²)', 'Nested loops, 2D DP'],
          ['n ≤ 10⁵', 'O(n log n)', 'Sorting, heap, binary search'],
          ['n ≤ 10⁶', 'O(n)', 'Single pass, hash map, two pointers'],
          ['n ≤ 10⁹', 'O(log n) or O(1)', 'Binary search on the answer, maths'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Read the constraints first, always',
        body: 'They tell you the intended approach before you have thought about the problem. `n ≤ 20` is practically an instruction to enumerate subsets. `n ≤ 10⁵` rules out nested loops. A minute spent here saves you from writing a correct solution that is too slow — which is a far more frustrating way to fail than being wrong.',
      },
      { kind: 'heading', text: 'The hidden costs' },
      {
        kind: 'code',
        code: `// This looks O(n) but is O(n^2) — erase from the front shifts everything
for (int i = 0; i < n; i++) v.erase(v.begin());

// This looks O(n) but is O(n^2) — each concatenation copies the whole string
for (int i = 0; i < n; i++) s = s + c;

// This looks O(n) but is O(n^2) — substr copies at every step
for (int i = 0; i < n; i++) process(s.substr(i));

// And this recursive helper is O(n^2) — a full copy per level
void dfs(vector<int> path);`,
      },
      {
        kind: 'text',
        body: 'Each of these has a quadratic factor hidden inside an operation that *looks* constant. When a solution you believe is linear times out, this list is where to look first — it is nearly always one of these four.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Space complexity counts too',
        body: 'Recursion costs O(depth) stack. A hash map over n elements costs O(n). A 2D DP table over a 10⁴ × 10⁴ grid is 10⁸ integers — around 400 MB, well past typical memory limits, and the reason many DP solutions are rewritten to keep only the previous row.',
      },
    ],
    keyTakeaways: [
      '`list` access is O(n); `unordered_map` is O(1) average, O(n) worst case.',
      'Constraints name the target complexity — read them before designing.',
      'Watch for hidden O(n) inside a loop: front-erase, string concat, `substr`, by-value params.',
      'Space matters: recursion costs O(depth) and a large 2D table may exceed the memory limit.',
    ],
    practice: {
      prompt: 'Write out the container complexity table from memory, then check it. Then take five problems and, from the constraints alone, state the target complexity before reading the question — that habit will shape how you approach every problem in Phase 1.',
    },
  },
];
