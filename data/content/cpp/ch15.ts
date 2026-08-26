import type { Lesson } from '../types';

/**
 * Chapter 15 — STL Utilities.
 * pair, tuple, structured bindings, comparators, lambdas and auto: the glue
 * that makes the rest of the library pleasant to use.
 */
export const ch15: Lesson[] = [
  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-15.1',
    language: 'cpp',
    summary: 'Bundle two values together, and get sorting and comparison for free.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'A `pair` bundles two values into one object. That sounds trivial, and it is quietly one of the most useful things in the STL — because a `pair` compares element by element, which gives you sorting, heap ordering and map keys for free, with no code of your own.',
      },
      {
        kind: 'code',
        code: `#include <utility>

pair<int, string> p = {1, "one"};
pair<int, string> q(2, "two");

p.first;         // 1
p.second;        // "one"

p.first = 10;    // mutable, unless the pair itself is const`,
      },
      {
        kind: 'text',
        body: 'A `pair` is the lightest way to return or store two related values. It appears constantly: map elements are pairs, `insert` returns a pair, and intervals, coordinates and (value, index) records are all naturally pairs.',
      },
      { kind: 'heading', text: 'The default comparison is the reason it is everywhere' },
      {
        kind: 'code',
        code: `pair<int,int> a = {1, 5};
pair<int,int> b = {1, 9};
pair<int,int> c = {2, 0};

a < b;      // true  — .first ties, so .second decides
a < c;      // true  — .first decides
a == b;     // false — both members must match`,
      },
      {
        kind: 'text',
        body: 'Comparison is **lexicographic**: compare `.first`, and only fall back to `.second` on a tie. That means a `vector<pair<int,int>>` sorts correctly with no comparator at all.',
      },
      {
        kind: 'code',
        caption: 'Merge Intervals needs no comparator',
        code: `vector<pair<int,int>> intervals = {{8,10}, {1,3}, {2,6}};

sort(intervals.begin(), intervals.end());     // sorts by start, then by end
// {1,3}, {2,6}, {8,10}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Put the sort key in .first',
        body: 'If you want to sort by frequency, store `{frequency, value}` rather than `{value, frequency}` — then the default comparison does exactly what you need and no lambda is required. The same reasoning is why Dijkstra uses `pair<distance, node>`: it lets a plain `priority_queue` order by distance.',
      },
      {
        kind: 'code',
        caption: 'Sorting by the second element does need one',
        code: `sort(v.begin(), v.end(), [](const auto& a, const auto& b) {
    return a.second < b.second;
});`,
      },
      { kind: 'heading', text: 'Pairs in containers' },
      {
        kind: 'code',
        code: `// A map's elements ARE pairs
map<string,int> m;
for (const pair<const string,int>& p : m)      // note: the key is const
    cout << p.first << " " << p.second;

// insert returns {iterator, bool}
auto result = s.insert(5);
if (result.second) cout << "newly inserted";

// A vector of coordinates
vector<pair<int,int>> points = {{0,0}, {1,2}};

// A pair as a map key — works with map, not unordered_map
map<pair<int,int>, int> grid;
grid[{2,3}] = 5;`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'A pair works as a map key but not an unordered_map key',
        body: '`map` needs only `<`, which `pair` provides. `unordered_map` needs `std::hash`, which `pair` does not have — so it fails to compile. Either use `map`, encode the pair into one integer (`r * cols + c`), or supply a custom hash functor.',
      },
      {
        kind: 'code',
        caption: 'Creating pairs',
        code: `pair<int,string> a(1, "x");
pair<int,string> b = {1, "x"};        // most common
auto c = make_pair(1, "x");           // deduces the types
auto d = pair(1, "x");                // C++17 — deduction without make_pair

// Returning one
pair<int,int> minMax(vector<int>& v) {
    return {*min_element(v.begin(), v.end()),
            *max_element(v.begin(), v.end())};
}`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'first and second are terrible names',
        body: 'For a two-element return value they are fine. But `p.first` tells a reader nothing about what it holds, and in an interview that costs you clarity. When the members have real meaning, a small `struct` with named fields is better: `struct Result { int index; bool found; };`.',
      },
    ],
    keyTakeaways: [
      '`pair` compares lexicographically — `.first`, then `.second` on a tie.',
      'Put your sort key in `.first` and you rarely need a comparator.',
      'Map elements are pairs, and `insert` returns `{iterator, bool}`.',
      'A `pair` works as a `map` key but needs a custom hash for `unordered_map`.',
    ],
    practice: {
      prompt: 'Sort a `vector<pair<int,int>>` with no comparator and confirm it orders by first then second. Then solve Merge Intervals. Then try a `pair` key in an `unordered_map`, read the error, and fix it by encoding the pair into one integer.',
      leetcode: { title: 'Merge Intervals', slug: 'merge-intervals' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-15.2',
    language: 'cpp',
    summary: 'Bundle three or more values, and know when a struct is the better choice.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A `tuple` is a `pair` that holds any number of values. It is useful when you need three or four things travelling together and do not want to declare a struct — but readability drops fast, and this lesson covers where that trade stops being worth it.',
      },
      {
        kind: 'code',
        code: `#include <tuple>

tuple<int, string, double> t = {1, "one", 1.0};

get<0>(t);         // 1        — index must be a compile-time constant
get<1>(t);         // "one"
get<2>(t);         // 1.0

get<0>(t) = 10;    // assignable`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'get<i> needs a constant index',
        body: '`get<i>(t)` where `i` is a runtime variable does not compile — the element type must be known at compile time, and different indices have different types. A tuple is not a container; you cannot loop over it with an ordinary index.',
      },
      {
        kind: 'text',
        body: 'Like `pair`, `tuple` compares lexicographically across all its elements, so sorting a `vector<tuple<...>>` orders by the first field, then the second, and so on.',
      },
      {
        kind: 'code',
        code: `vector<tuple<int,int,int>> edges = {{5,0,1}, {2,1,2}, {5,0,2}};

sort(edges.begin(), edges.end());     // by weight, then u, then v
// {2,1,2}, {5,0,1}, {5,0,2}`,
      },
      {
        kind: 'code',
        caption: 'Where it shows up in DSA — weighted graph edges',
        code: `// (weight, u, v) — weight first so the default sort works for Kruskal
vector<tuple<int,int,int>> edges;
edges.push_back({w, u, v});
sort(edges.begin(), edges.end());

for (auto& [w, u, v] : edges) { ... }        // structured binding`,
      },
      {
        kind: 'code',
        caption: 'And three-dimensional state in BFS',
        code: `// (row, col, keysCollected) — a state needing three components
queue<tuple<int,int,int>> q;
q.push({0, 0, 0});

auto [r, c, keys] = q.front(); q.pop();`,
      },
      { kind: 'heading', text: 'Unpacking' },
      {
        kind: 'code',
        code: `tuple<int,string,double> t = {1, "one", 1.0};

// Structured bindings — C++17, what you should use
auto [id, name, value] = t;

// tie — older, but useful for ignoring fields
int id; string name; double value;
tie(id, name, value) = t;

tie(id, ignore, value) = t;      // skip the middle one`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'tie is still handy for lexicographic comparison',
        body: 'Writing a multi-key comparator by hand is verbose and easy to get wrong. `tie` does it in one line: `return tie(a.x, a.y) < tie(b.x, b.y);` compares `x` first and falls back to `y`, exactly like a tuple. It is the tidiest way to write a multi-field `operator<`.',
      },
      {
        kind: 'code',
        caption: 'A clean multi-key comparator',
        code: `struct Item { string name; int priority; int cost; };

sort(items.begin(), items.end(), [](const Item& a, const Item& b) {
    return tie(a.priority, a.cost, a.name)
         < tie(b.priority, b.cost, b.name);
});`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Past three elements, use a struct',
        body: '`get<3>(t)` tells a reader nothing. A `struct` with named fields is self-documenting, works with `unordered_map` once you add a hash, and produces far better error messages. Use `tuple` for short-lived bundles — a multiple return, a queue state — and a `struct` for anything that persists or is passed around.',
      },
    ],
    keyTakeaways: [
      '`tuple` holds any number of values; `get<i>` needs a compile-time index.',
      'It compares lexicographically, so sorting orders by field in order.',
      'Unpack with structured bindings; use `tie` to skip fields or build comparators.',
      'Beyond three elements, a named `struct` is clearer.',
    ],
    practice: {
      prompt: 'Store weighted graph edges as `tuple<int,int,int>` with the weight first, sort them, and unpack with structured bindings. Then write a three-key comparator using `tie` and compare it with the hand-written nested-if version.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-15.3',
    language: 'cpp',
    summary: 'Know why make_pair exists and why modern code no longer needs it.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: '`make_pair` builds a `pair` while deducing the element types, so you do not have to spell them out.',
      },
      {
        kind: 'code',
        code: `auto p = make_pair(1, string("hello"));      // pair<int, string>

// Before C++17 this was necessary, because the type could not be deduced
// from the constructor:
pair<int,string> q(1, "hello");             // you had to name both types`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'C++17 made it largely obsolete',
        body: 'Class template argument deduction lets you write `pair(1, "x")` and have the types worked out automatically. And brace initialisation — `{1, "x"}` — has always worked wherever the target type is known. Modern code uses braces; `make_pair` survives mainly in older examples and habits.',
      },
      {
        kind: 'table',
        headers: ['Form', 'Works when', 'Verdict'],
        rows: [
          ['`{1, "x"}`', 'The target type is known', '**Preferred**'],
          ['`make_pair(1, "x")`', 'Always', 'Legacy but harmless'],
          ['`pair(1, "x")`', 'C++17 and later', 'Fine'],
          ['`pair<int,string>(1, "x")`', 'Always', 'Verbose'],
        ],
      },
      {
        kind: 'code',
        caption: 'Braces are usually enough',
        code: `vector<pair<int,int>> v;
v.push_back({1, 2});                 // type known from the vector
v.emplace_back(1, 2);                // constructs in place — no temporary

map<string,int> m;
m.insert({"key", 1});

pair<int,int> f() { return {1, 2}; } // return type known`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'emplace_back constructs in place',
        body: '`v.push_back({1,2})` builds a temporary pair and then moves it in. `v.emplace_back(1, 2)` forwards the arguments and constructs the pair directly in the vector\'s storage — no temporary at all. For pairs of ints the difference is negligible; for pairs of strings or vectors it is real.',
      },
      { kind: 'heading', text: 'The one place make_pair still helps' },
      {
        kind: 'code',
        code: `// When the target type is NOT known, braces cannot deduce anything:
auto p = {1, 2};              // this is an initializer_list<int>, NOT a pair!
auto q = make_pair(1, 2);     // pair<int,int> — correct
auto r = pair(1, 2);          // C++17 — also correct`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'auto p = {1, 2} is not a pair',
        body: 'Bare braces assigned to `auto` deduce `std::initializer_list<int>`, which is almost never what you meant and produces confusing errors downstream. When there is no target type to guide deduction, use `make_pair`, `pair(...)`, or write the type explicitly.',
      },
      {
        kind: 'text',
        body: 'There is a matching `make_tuple` with the same story: useful before C++17, now mostly replaced by braces and deduction. Recognise both when reading code; prefer braces when writing it.',
      },
    ],
    keyTakeaways: [
      '`make_pair` deduces element types; braces do the same when the target is known.',
      'C++17 deduction makes `pair(1, "x")` valid, so `make_pair` is largely legacy.',
      '`emplace_back` constructs in place and avoids a temporary.',
      '`auto p = {1, 2}` gives an `initializer_list`, not a pair.',
    ],
    practice: {
      prompt: 'Create pairs four ways — braces, `make_pair`, C++17 deduction, and the explicit type — and confirm they behave identically. Then write `auto p = {1, 2}`, try `p.first`, and read the error; knowing that deduction quirk saves a genuinely puzzling ten minutes.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-15.4',
    language: 'cpp',
    summary: 'Unpack pairs, tuples and map entries into named variables.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Structured bindings (C++17) destructure a composite value into named variables. They replace `.first`/`.second` and `get<i>` with names that say what the data means.',
      },
      {
        kind: 'code',
        code: `pair<int,string> p = {1, "one"};
auto [id, name] = p;                  // id = 1, name = "one"

tuple<int,int,int> t = {1, 2, 3};
auto [a, b, c] = t;

struct Point { int x, y; };
Point pt = {3, 4};
auto [x, y] = pt;                     // works on plain structs too`,
      },
      { kind: 'heading', text: 'The place it matters most: iterating maps' },
      {
        kind: 'code',
        code: `unordered_map<string,int> counts;

// Before
for (const auto& p : counts)
    cout << p.first << ": " << p.second;

// After — self-documenting
for (const auto& [word, count] : counts)
    cout << word << ": " << count;`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'The & controls everything',
        body: '`auto [k, v]` **copies** each element, so `v++` modifies a copy and the map is unchanged — a silent no-op. `auto& [k, v]` binds references and modifies the map. `const auto& [k, v]` reads without copying. This is the same missing-`&` bug as elsewhere, but here it is especially easy to miss because the syntax looks like unpacking rather than assignment.',
      },
      {
        kind: 'code',
        code: `for (auto [k, v] : m)        v++;    // BUG — map unchanged
for (auto& [k, v] : m)       v++;    // modifies the map
for (const auto& [k, v] : m) { ... } // read-only, no copies`,
      },
      {
        kind: 'code',
        caption: 'Unpacking function returns',
        code: `auto [lo, hi] = minMax(nums);

auto [it, inserted] = mySet.insert(5);
if (!inserted) cout << "already present";

auto [first, last] = ms.equal_range(3);`,
      },
      {
        kind: 'code',
        caption: 'Unpacking queue and stack elements',
        code: `queue<pair<int,int>> q;
q.push({0, 0});

auto [r, c] = q.front(); q.pop();          // much clearer than .first/.second

queue<tuple<int,int,int>> q3;
auto [row, col, dist] = q3.front(); q3.pop();`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'This is where grid BFS becomes readable',
        body: '`auto [r, c] = q.front();` versus `int r = q.front().first; int c = q.front().second;` — the first says what the values *are*. In an interview, readable unpacking is a small but real signal of fluency with modern C++.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'The names cannot be reused or skipped',
        body: 'You must bind every element — there is no `auto [x, , z]` to ignore the middle one; use `tie` with `std::ignore` for that. And each name must be new: `auto [r, c] = ...` twice in the same scope is a redeclaration error, which comes up when unpacking inside a loop body that also declares `r` outside.',
      },
      {
        kind: 'text',
        body: 'One limitation worth knowing: structured bindings cannot be captured directly by a lambda in C++17 (fixed in C++20). If you need one inside a lambda, copy it into an ordinary variable first.',
      },
    ],
    keyTakeaways: [
      'Structured bindings unpack pairs, tuples and structs into named variables.',
      '`auto [k, v]` copies; use `auto&` to modify and `const auto&` to read.',
      'They make map iteration and grid BFS substantially more readable.',
      'Every element must be bound, and each name must be fresh in its scope.',
    ],
    practice: {
      prompt: 'Rewrite a map loop from `.first`/`.second` to structured bindings. Then try `for (auto [k, v] : m) v++;` and confirm the map is untouched — that silent failure is the one thing to remember from this lesson.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-15.5',
    language: 'cpp',
    summary: 'Define custom ordering correctly, and avoid the contract violation that crashes sort.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'A comparator is a function or object that decides ordering. For `sort`, `cmp(a, b)` must return true when **a should come before b**.',
      },
      {
        kind: 'code',
        code: `// Ascending — the default
sort(v.begin(), v.end());
sort(v.begin(), v.end(), less<int>());

// Descending
sort(v.begin(), v.end(), greater<int>());
sort(v.begin(), v.end(), [](int a, int b) { return a > b; });`,
      },
      { kind: 'heading', text: 'The strict weak ordering contract' },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Never return true for equal elements',
        body: 'A comparator must return **false** when its two arguments are equivalent. Writing `return a <= b;` violates this, and `sort` may then read past the end of the array — an actual segmentation fault, not merely a wrong order. The symptom is a crash inside library code with no obvious cause. Always use strict `<` or `>`.',
      },
      {
        kind: 'code',
        code: `// BROKEN — undefined behaviour, can segfault
sort(v.begin(), v.end(), [](int a, int b) { return a <= b; });

// CORRECT
sort(v.begin(), v.end(), [](int a, int b) { return a < b; });`,
      },
      {
        kind: 'text',
        body: 'The reason is that `sort` uses the comparator to know when to stop scanning. If `cmp(a, a)` is true, an element compares "before itself", the scan never terminates at the partition boundary, and it walks off the array.',
      },
      { kind: 'heading', text: 'Multi-key comparators' },
      {
        kind: 'code',
        caption: 'By score descending, then name ascending',
        code: `sort(students.begin(), students.end(), [](const Student& a, const Student& b) {
    if (a.score != b.score) return a.score > b.score;   // primary key
    return a.name < b.name;                             // tie-break
});

// The same thing with tie — shorter and harder to get wrong
sort(items.begin(), items.end(), [](const Item& a, const Item& b) {
    return tie(a.priority, a.cost) < tie(b.priority, b.cost);
});`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Handle the primary key with != first',
        body: 'The `if (a.score != b.score) return a.score > b.score;` shape guarantees you fall through to the tie-break only on an exact tie, which keeps the ordering strict. Writing `return a.score > b.score || a.name < b.name;` is a common and broken shortcut — it violates the contract.',
      },
      { kind: 'heading', text: 'The three places comparators appear' },
      {
        kind: 'code',
        code: `// 1. sort — "a comes before b"
sort(v.begin(), v.end(), cmp);

// 2. set / map — "a orders before b"; also DEFINES equality
set<string, ByLength> s;

// 3. priority_queue — "a has LOWER PRIORITY than b"  ← inverted!
priority_queue<int, vector<int>, greater<int>> minHeap;`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'priority_queue is the odd one out',
        body: 'For `sort` and `set`, `greater` gives descending order. For `priority_queue`, `greater` gives a **min**-heap, because the comparator expresses lower priority rather than earlier position. This inconsistency catches everyone — when a heap hands you the wrong end, flip the comparator.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'In a set, the comparator defines equality',
        body: 'Two elements are "the same" when neither compares less than the other. A comparator that only checks string length therefore treats every same-length string as a duplicate and silently discards them. Always include a tie-breaker in a `set` comparator unless you deliberately want that grouping.',
      },
      {
        kind: 'code',
        caption: 'The built-in function objects',
        code: `less<int>()          // a < b   — the default everywhere
greater<int>()       // a > b
less<>()             // C++14 — deduces the type: sort(v.begin(), v.end(), greater<>())`,
      },
    ],
    keyTakeaways: [
      'For `sort`, `cmp(a,b)` means "a comes before b" — use strict `<` or `>`.',
      'Returning true for equal elements is undefined behaviour and can segfault.',
      'Handle the primary key with `if (a.k != b.k)` then tie-break.',
      '`priority_queue` inverts the meaning — `greater` gives a min-heap.',
    ],
    practice: {
      prompt: 'Sort a struct by two keys, once with nested ifs and once with `tie`. Then write a comparator using `<=` on a large vector and see whether it crashes — that undefined behaviour is exactly why the strict-ordering rule exists.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-15.6',
    language: 'cpp',
    summary: 'Write inline functions that capture surrounding state — the modern way to customise algorithms.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'A lambda is a function you define inline, right where it is used. In DSA you will meet them in exactly one place more than any other: telling `sort` **what to sort by**. The capture list is the part that is genuinely new, and it is what lets a lambda see the variables around it.',
      },
      {
        kind: 'code',
        caption: 'The anatomy',
        code: `[capture](parameters) -> returnType { body }

auto add = [](int a, int b) { return a + b; };     // return type deduced
add(2, 3);                                         // 5`,
      },
      {
        kind: 'text',
        body: 'A lambda is an anonymous function object. Its distinguishing feature — and the reason it replaced function pointers — is the **capture list**: it can use variables from the surrounding scope.',
      },
      { kind: 'heading', text: 'Capture modes' },
      {
        kind: 'table',
        headers: ['Capture', 'Meaning'],
        rows: [
          ['`[]`', 'Capture nothing'],
          ['`[x]`', 'Copy `x`'],
          ['`[&x]`', 'Reference `x`'],
          ['`[=]`', 'Copy everything used'],
          ['`[&]`', 'Reference everything used'],
          ['`[&, x]`', 'Reference everything except `x`, which is copied'],
          ['`[this]`', 'Capture the enclosing object, for member access'],
        ],
      },
      {
        kind: 'code',
        code: `int pivot = 5;

auto byCopy = [pivot](int x) { return x > pivot; };   // pivot frozen at capture
auto byRef  = [&pivot](int x) { return x > pivot; };  // reads the live value

pivot = 10;
byCopy(7);      // true  — still comparing against 5
byRef(7);       // false — now comparing against 10`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'A captured reference can dangle',
        body: 'If a lambda captures by reference and outlives the variable — stored in a member, returned from a function, kept in a container — it holds a reference to destroyed memory. For lambdas used immediately (passed straight to `sort`), `[&]` is safe and convenient. For anything stored, capture by value.',
      },
      { kind: 'heading', text: 'Where you will use them' },
      {
        kind: 'code',
        caption: '1. Custom sorting',
        code: `int target = 5;
sort(v.begin(), v.end(), [target](int a, int b) {
    return abs(a - target) < abs(b - target);      // by distance from target
});`,
      },
      {
        kind: 'code',
        caption: '2. Algorithm predicates',
        code: `count_if(v.begin(), v.end(), [](int x) { return x % 2 == 0; });
all_of(v.begin(), v.end(), [](int x) { return x > 0; });
any_of(v.begin(), v.end(), [](int x) { return x < 0; });
find_if(v.begin(), v.end(), [](int x) { return x > 100; });

v.erase(remove_if(v.begin(), v.end(),
                  [](int x) { return x < 0; }), v.end());`,
      },
      {
        kind: 'code',
        caption: '3. Recursive helpers without a separate function',
        code: `#include <functional>

vector<int> result;
function<void(TreeNode*)> dfs = [&](TreeNode* node) {
    if (!node) return;
    result.push_back(node->val);
    dfs(node->left);
    dfs(node->right);
};
dfs(root);`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'A recursive lambda needs std::function',
        body: '`auto dfs = [&](...) { dfs(...); }` does not compile, because `auto` cannot deduce the type while the lambda is still being defined — it would need its own type to refer to itself. `std::function<void(TreeNode*)>` names the type up front. It carries a small indirection cost, but for a helper inside one function it is usually worth the convenience. (In C++23, `[](this auto&& self, ...)` removes the need.)',
      },
      {
        kind: 'code',
        caption: '4. Heap comparators',
        code: `auto cmp = [](const pair<int,int>& a, const pair<int,int>& b) {
    return a.second > b.second;                  // min-heap by .second
};
priority_queue<pair<int,int>, vector<pair<int,int>>, decltype(cmp)> pq(cmp);`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Lambdas are const by default',
        body: 'A lambda cannot modify its by-value captures unless you mark it `mutable`: `[count]() mutable { count++; }`. Without `mutable` that assignment is a compile error. It rarely comes up in DSA, but the error message is confusing the first time.',
      },
      {
        kind: 'text',
        body: 'One more convenience: `[&]` captures everything by reference, which is why recursive DFS lambdas need no parameters for shared state. It is the most common capture in contest code precisely because the lambda is used immediately.',
      },
    ],
    keyTakeaways: [
      'A lambda is an anonymous function object that can capture surrounding state.',
      '`[&]` references (fast, but can dangle if stored); `[=]` copies.',
      'A recursive lambda needs `std::function` to name its own type.',
      'Lambdas are `const` by default — add `mutable` to modify by-value captures.',
    ],
    practice: {
      prompt: 'Sort a vector by distance from a captured target value. Then write a recursive DFS as a `std::function` lambda with `[&]`. Then capture by copy, change the captured variable afterwards, and confirm the lambda still uses the old value.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-15.7',
    language: 'cpp',
    summary: 'Use auto to shorten declarations without accidentally copying.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: '`auto` asks the compiler to deduce a variable\'s type from its initialiser. The type is still fixed at compile time — this is not dynamic typing, only less typing.',
      },
      {
        kind: 'code',
        code: `auto x = 5;                    // int
auto d = 3.14;                 // double
auto s = string("hello");      // string

// The case it was invented for:
vector<int>::iterator it = v.begin();
auto it = v.begin();           // identical, vastly more readable

unordered_map<string, vector<pair<int,int>>>::iterator it2 = m.begin();
auto it2 = m.begin();          // the alternative is unusable`,
      },
      { kind: 'heading', text: 'The rule that causes the most bugs' },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'auto strips references and const',
        body: '`auto x = something` always deduces a **value type**, so you get a copy even when the source is a reference. Writing `auto& x` or `const auto& x` is what preserves the reference. This is the single most common `auto` mistake, and it fails silently: the code compiles, runs, and does nothing.',
      },
      {
        kind: 'code',
        code: `vector<vector<int>> grid;

auto row = grid[0];            // COPY of the whole row
row[0] = 99;                   // grid is unchanged

auto& row = grid[0];           // reference
row[0] = 99;                   // grid IS changed

const auto& row = grid[0];     // read-only, no copy`,
      },
      {
        kind: 'code',
        caption: 'The same trap in loops',
        code: `for (auto x : v)             { ... }   // copies each element
for (auto& x : v)            { x *= 2; } // modifies v
for (const auto& x : v)      { ... }   // reads, no copies

for (auto [k, val] : m)      { val++; } // BUG — map unchanged
for (auto& [k, val] : m)     { val++; } // modifies the map
for (const auto& [k, val] : m) { ... }  // reads, no copies`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The habit that avoids all of it',
        body: 'Default to `const auto&` when reading and `auto&` when modifying. Use plain `auto` only for cheap value types — `int`, iterators, pointers — where a copy costs nothing and is what you want. Applied consistently, this removes an entire class of silent bug and an entire class of hidden performance cost.',
      },
      { kind: 'heading', text: 'Where auto genuinely helps' },
      {
        kind: 'code',
        code: `// 1. Iterators — the original motivation
for (auto it = m.begin(); it != m.end(); ++it) { ... }

// 2. Lambdas — the type is unnameable
auto cmp = [](int a, int b) { return a > b; };

// 3. Structured bindings — required
auto [key, value] = *m.begin();

// 4. Long template types
auto result = someFunction();      // instead of spelling out the return type`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Do not use auto where the type is the useful information',
        body: '`auto n = getCount();` hides whether you got an `int`, a `size_t`, or a `long long` — which matters for overflow and for signed/unsigned comparisons. When the exact type affects correctness, write it out. `auto` is for reducing noise, not for hiding decisions.',
      },
      {
        kind: 'code',
        caption: 'A concrete case where it matters',
        code: `auto n = v.size();               // size_t — UNSIGNED
for (auto i = n - 1; i >= 0; i--)  // INFINITE LOOP: unsigned is never < 0

int n = v.size();                  // explicit, signed
for (int i = n - 1; i >= 0; i--)   // terminates correctly`,
      },
      {
        kind: 'text',
        body: 'That is the unsigned-wraparound trap from Chapter 2, arriving through `auto`. Because `size()` is unsigned, `auto` inherits the unsignedness and the backward loop never ends. Being explicit about `int` here is the fix.',
      },
    ],
    keyTakeaways: [
      '`auto` deduces types at compile time — shorter code, same static typing.',
      'It strips references and const: write `auto&` or `const auto&` to keep them.',
      'Default to `const auto&` for reading, `auto&` for modifying.',
      'Spell the type out when signedness or width affects correctness.',
    ],
    practice: {
      prompt: 'Loop a `vector<vector<int>>` with `auto row` and try to modify it, then fix it with `auto&`. Then write `auto i = v.size() - 1;` in a backward loop and watch it never terminate — both bugs come from the same deduction rule.',
    },
  },
];
