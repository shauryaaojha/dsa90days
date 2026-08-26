import type { Lesson } from '../types';

/**
 * Chapter 16 — STL Algorithms.
 * The functions from <algorithm> and <numeric> that appear in real solutions,
 * each with its complexity, its preconditions, and the way it typically breaks.
 */
export const ch16: Lesson[] = [
  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-16.1',
    language: 'cpp',
    summary: 'Sort any random-access range, with or without a custom order.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: '`sort` is the most-used algorithm in the STL and one of the fastest things in the language. It sorts any random-access range in O(n log n), and the only real decision you make is **the comparator** — which is where the thinking in most sorting problems actually lives.',
      },
      {
        kind: 'code',
        code: `#include <algorithm>

vector<int> v = {3, 1, 2};

sort(v.begin(), v.end());                    // ascending      → 1 2 3
sort(v.begin(), v.end(), greater<int>());    // descending     → 3 2 1
sort(v.begin() + 1, v.end());                // partial range

string s = "cba";
sort(s.begin(), s.end());                    // "abc"`,
      },
      {
        kind: 'text',
        body: '`sort` is **O(n log n)** and uses introsort — quicksort that falls back to heapsort when recursion gets too deep, with insertion sort for small ranges. That hybrid is why the O(n log n) bound is a genuine worst case, not just an average.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'sort needs random-access iterators',
        body: '`sort(myList.begin(), myList.end())` fails to compile with a wall of template errors, because `list` iterators cannot jump. Use the member function `myList.sort()` instead. The same applies to `set` and `map` — they are already sorted and cannot be reordered.',
      },
      { kind: 'heading', text: 'Custom orderings' },
      {
        kind: 'code',
        code: `// By a computed value
sort(v.begin(), v.end(), [](int a, int b) { return abs(a) < abs(b); });

// Structs, primary key then tie-break
sort(people.begin(), people.end(), [](const Person& a, const Person& b) {
    if (a.age != b.age) return a.age > b.age;    // age descending
    return a.name < b.name;                      // then name ascending
});

// Pairs sort lexicographically already — no comparator needed
sort(intervals.begin(), intervals.end());`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Never return true for equal elements',
        body: 'A comparator using `<=` violates the strict weak ordering contract, and `sort` can then read past the end of the array — an actual crash, not a wrong order. Always use strict `<` or `>`, and handle ties by comparing a second field.',
      },
      { kind: 'heading', text: 'stable_sort, and when it matters' },
      {
        kind: 'code',
        code: `sort(v.begin(), v.end(), cmp);          // O(n log n), order of equals unspecified
stable_sort(v.begin(), v.end(), cmp);   // O(n log n) with extra memory,
                                        // equal elements keep their relative order`,
      },
      {
        kind: 'text',
        body: 'Use `stable_sort` when a previous ordering must survive among ties — sorting by score while preserving alphabetical order within each score. Otherwise `sort` is faster and uses no extra memory.',
      },
      { kind: 'heading', text: 'Sorting only part of the data' },
      {
        kind: 'code',
        code: `// The k smallest, in order — O(n log k), cheaper than a full sort
partial_sort(v.begin(), v.begin() + k, v.end());

// The k smallest, in ANY order — O(n), and v[k] lands in its final position
nth_element(v.begin(), v.begin() + k, v.end());

// The median in O(n)
nth_element(v.begin(), v.begin() + v.size()/2, v.end());
int median = v[v.size()/2];`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'nth_element is O(n) — use it when you do not need full order',
        body: 'For "the kth largest element", `nth_element` beats both sorting (O(n log n)) and a heap (O(n log k)). It uses quickselect: partition around a pivot and recurse into only one side. If the problem asks for a single order statistic rather than the top k *in order*, this is the fastest answer.',
      },
      {
        kind: 'text',
        body: 'One practical note: `sort` reorders the caller\'s data. On LeetCode that is allowed — signatures pass `vector<int>&` — but if a later part of your solution needs the original order, copy first.',
      },
    ],
    keyTakeaways: [
      '`sort` is O(n log n) worst case and needs random-access iterators.',
      'Use `myList.sort()` for `list`; `set`/`map` are already sorted.',
      'Comparators must be strict — `<=` is undefined behaviour and can crash.',
      '`nth_element` finds the kth element in O(n) without fully sorting.',
    ],
    practice: {
      prompt: 'Sort a vector of structs by two keys. Then solve Kth Largest Element three ways — full sort, a size-k heap, and `nth_element` — and time all three on 10⁵ elements. The complexity differences are visible and make the choice concrete.',
      leetcode: { title: 'Kth Largest Element in an Array', slug: 'kth-largest-element-in-an-array' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-16.2',
    language: 'cpp',
    summary: 'Reverse a range in place, and know the cheaper alternatives.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: '`reverse` flips a range in place. It is a one-liner you will use constantly — reversing a string, a result vector built backwards, or half a linked list — and it is worth knowing the cheaper alternatives for the cases where you do not actually need to move anything.',
      },
      {
        kind: 'code',
        code: `#include <algorithm>

vector<int> v = {1, 2, 3, 4};
reverse(v.begin(), v.end());          // {4, 3, 2, 1}

string s = "hello";
reverse(s.begin(), s.end());          // "olleh"

reverse(v.begin(), v.begin() + 2);    // reverse only the first two`,
      },
      {
        kind: 'text',
        body: '**O(n)**, in place, with O(1) extra space. It swaps from both ends inward — exactly the two-pointer loop from Chapter 3, already written for you.',
      },
      {
        kind: 'code',
        caption: 'What it does internally',
        code: `while (left < right) {
    swap(v[left], v[right]);
    left++;
    right--;
}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Iterate backwards instead of reversing',
        body: 'If you only need to *read* in reverse, do not reverse the container — use reverse iterators. `for (auto it = v.rbegin(); it != v.rend(); ++it)` costs nothing, whereas `reverse` is O(n) and mutates data other code may depend on.',
      },
      {
        kind: 'code',
        caption: 'Reverse iterators',
        code: `for (auto it = v.rbegin(); it != v.rend(); ++it)
    cout << *it;                      // reverse order, container untouched

vector<int> reversed(v.rbegin(), v.rend());     // a reversed COPY

string r(s.rbegin(), s.rend());
bool isPalindrome = (s == r);                   // simple, though O(n) extra space`,
      },
      { kind: 'heading', text: 'Where it appears' },
      {
        kind: 'code',
        caption: 'Building a result backwards, then flipping',
        code: `// Digit extraction naturally produces reversed digits
string result;
while (n > 0) {
    result += ('0' + n % 10);
    n /= 10;
}
reverse(result.begin(), result.end());     // put them the right way round`,
      },
      {
        kind: 'code',
        caption: 'Root-to-leaf paths collected on the way up',
        code: `// A post-order recursion builds each path leaf-first
vector<int> path = buildPath(node);
reverse(path.begin(), path.end());         // now root-first`,
      },
      {
        kind: 'code',
        caption: 'Rotating an array — three reversals',
        code: `void rotate(vector<int>& nums, int k) {
    k %= nums.size();
    reverse(nums.begin(), nums.end());          // reverse everything
    reverse(nums.begin(), nums.begin() + k);    // fix the first k
    reverse(nums.begin() + k, nums.end());      // fix the rest
}
// O(n) time, O(1) space`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The triple-reversal rotation is worth memorising',
        body: 'It rotates an array by k positions in O(n) time and O(1) space, with no extra buffer. The `k %= n` guard matters — without it, a k larger than the array length produces out-of-range iterators. It is a small trick that comes up in interviews reasonably often.',
      },
    ],
    keyTakeaways: [
      '`reverse` is O(n), in place, and needs no extra memory.',
      'To read backwards, use `rbegin()`/`rend()` rather than reversing.',
      '`vector<int>(v.rbegin(), v.rend())` makes a reversed copy.',
      'Three reversals rotate an array in O(n) time and O(1) space.',
    ],
    practice: {
      prompt: 'Reverse a string in place, then build a reversed copy with reverse iterators without touching the original. Then implement array rotation with the three-reversal trick and test it with k larger than the array size.',
      leetcode: { title: 'Rotate Array', slug: 'rotate-array' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-16.3',
    language: 'cpp',
    summary: 'Search a range linearly, and convert the result into an index.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: '`find` scans a range for a value and returns an **iterator**, not an index or a boolean. That return type trips people up every time, because the "not found" case is signalled by returning `end()` rather than by anything that looks like a failure.',
      },
      {
        kind: 'code',
        code: `#include <algorithm>

vector<int> v = {10, 20, 30};

auto it = find(v.begin(), v.end(), 20);

if (it != v.end()) {                     // this is how you test "found"
    cout << *it;                         // 20
    int index = it - v.begin();          // 1
}`,
      },
      {
        kind: 'text',
        body: '**O(n)** — it checks each element in turn. It returns an *iterator*, and returns `end()` when there is no match.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Always compare against end(), never dereference blindly',
        body: '`*find(...)` when the value is absent dereferences `end()`, which is undefined behaviour. There is no "not found" sentinel value to check for — the only correct test is `it != v.end()`. Forgetting the guard is the standard way this function crashes.',
      },
      {
        kind: 'code',
        caption: 'Iterator to index',
        code: `int index = it - v.begin();                    // vector/string only
int index = distance(v.begin(), it);          // works for any container`,
      },
      {
        kind: 'text',
        body: '`distance` is O(1) on contiguous containers and O(n) on `list`, `set` and `map` — it has to walk. Subtraction is only available on random-access iterators.',
      },
      { kind: 'heading', text: 'find_if — searching by condition' },
      {
        kind: 'code',
        code: `// First element greater than 100
auto it = find_if(v.begin(), v.end(), [](int x) { return x > 100; });

// First element NOT matching
auto it = find_if_not(v.begin(), v.end(), [](int x) { return x > 0; });

// First occurrence of any of several values
vector<int> targets = {3, 7};
auto it = find_first_of(v.begin(), v.end(), targets.begin(), targets.end());`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Use the member find on associative containers',
        body: '`std::find(s.begin(), s.end(), x)` on a `set` runs in **O(n)** — it ignores the tree entirely and walks linearly. The member `s.find(x)` is O(log n), and `m.find(key)` on a hash map is O(1). This is a silent performance bug: correct results, needlessly slow. The rule is that a member function with the same name as an algorithm always exists for a reason.',
      },
      {
        kind: 'table',
        headers: ['Container', 'Correct call', 'Cost'],
        rows: [
          ['`vector`, `string`', '`std::find(v.begin(), v.end(), x)`', 'O(n)'],
          ['`set`, `map`', '`s.find(x)`', 'O(log n)'],
          ['`unordered_set/map`', '`s.find(x)`', 'O(1) average'],
          ['Sorted `vector`', '`binary_search` / `lower_bound`', 'O(log n)'],
        ],
      },
      {
        kind: 'code',
        caption: 'String find is different again',
        code: `string s = "hello world";

s.find("world");                 // 5 — returns an INDEX, not an iterator
s.find("xyz");                   // string::npos, not end()

if (s.find("world") != string::npos) { ... }`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'string::find returns an index and npos',
        body: 'Unlike `std::find`, `s.find` returns a position and signals failure with `string::npos` — an unsigned value, so comparing it against `-1` is unreliable. Two different conventions with the same name; check which one you are calling.',
      },
    ],
    keyTakeaways: [
      '`std::find` is O(n) and returns an iterator; `end()` means not found.',
      'Convert to an index with `it - v.begin()` or `distance(v.begin(), it)`.',
      'Use the **member** `find` on `set`/`map` — the algorithm version is O(n).',
      '`string::find` returns an index and `npos`, not an iterator and `end()`.',
    ],
    practice: {
      prompt: 'Find a value in a vector and print its index, handling the not-found case. Then time `std::find` against the member `find` on a `set` of 10⁵ elements — the gap is the whole point of the member-function rule.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-16.4',
    language: 'cpp',
    summary: 'Count matching elements without writing a loop.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: '`count` tells you how many times a value appears in a range, in one line and without a loop of your own. It is O(n), which is exactly right for a one-off question and exactly wrong inside a loop — that distinction is the whole lesson.',
      },
      {
        kind: 'code',
        code: `#include <algorithm>

vector<int> v = {1, 2, 2, 3, 2};

count(v.begin(), v.end(), 2);        // 3

string s = "hello";
count(s.begin(), s.end(), 'l');      // 2`,
      },
      {
        kind: 'text',
        body: '**O(n)** — it scans the whole range regardless. There is no early exit, because it must see every element to know the total.',
      },
      {
        kind: 'code',
        caption: 'count_if — counting by condition',
        code: `count_if(v.begin(), v.end(), [](int x) { return x % 2 == 0; });   // evens
count_if(v.begin(), v.end(), [](int x) { return x > 10; });

count_if(s.begin(), s.end(), [](char c) { return isvowel(c); });`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Prefer count_if over a manual loop',
        body: 'A one-line `count_if` states the intent directly, cannot get the loop bounds wrong, and reads better in an interview than four lines of counter increment. The same applies to `all_of`, `any_of` and `none_of` for boolean questions over a range.',
      },
      {
        kind: 'code',
        caption: 'The related predicates',
        code: `all_of(v.begin(), v.end(),  [](int x) { return x > 0; });   // every element
any_of(v.begin(), v.end(),  [](int x) { return x < 0; });   // at least one
none_of(v.begin(), v.end(), [](int x) { return x == 0; });  // not a single one`,
      },
      {
        kind: 'text',
        body: 'Unlike `count_if`, these three short-circuit — `any_of` stops at the first match. When you only need a yes/no answer, they are both clearer and faster than counting and comparing to zero.',
      },
      { kind: 'heading', text: 'The member versions on associative containers' },
      {
        kind: 'code',
        code: `set<int> s = {1, 2, 3};
s.count(2);              // O(log n) — 0 or 1 for a set

multiset<int> ms = {2, 2, 3};
ms.count(2);             // O(log n + k) — 2 here

unordered_map<int,int> m;
m.count(key);            // O(1) average — the standard membership test`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'For a set or map, count is a membership test',
        body: 'It returns 0 or 1, so `if (s.count(x))` reads as "does x exist". For a `multiset` it is a genuine count and costs O(log n + k). And as always, prefer the member version — `std::count(s.begin(), s.end(), x)` is O(n) on a set.',
      },
      {
        kind: 'code',
        caption: 'Counting frequencies is not this function\'s job',
        code: `// WRONG — O(n^2): a full scan for every distinct value
for (int x : v)
    cout << count(v.begin(), v.end(), x);

// RIGHT — O(n) with a single pass
unordered_map<int,int> freq;
for (int x : v) freq[x]++;`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'count inside a loop is quadratic',
        body: 'Calling `count` once per element scans the range n times. It looks innocuous — one function call in a loop body — and it is O(n²). When you need every frequency, build a map in one pass; `count` is for a single value.',
      },
    ],
    keyTakeaways: [
      '`count` and `count_if` are O(n) with no early exit.',
      '`all_of` / `any_of` / `none_of` short-circuit for yes/no questions.',
      'On `set`/`map`, member `count` is a membership test at O(log n) or O(1).',
      'Calling `count` per element is O(n²) — use a frequency map instead.',
    ],
    practice: {
      prompt: 'Count vowels in a string with `count_if`. Then compute every element\'s frequency twice — once with `count` in a loop and once with a hash map — and time both on 10⁴ elements. The quadratic version is noticeably slower and looks perfectly innocent.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-16.5',
    language: 'cpp',
    summary: 'Sum or fold a range — and avoid the overflow the default argument causes.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: '`accumulate` folds a range down to a single value — a sum by default, or anything you like with a custom operation. It has one genuinely dangerous default, and it is the kind that produces a wrong answer rather than an error.',
      },
      {
        kind: 'code',
        code: `#include <numeric>          // NOT <algorithm>

vector<int> v = {1, 2, 3, 4};

accumulate(v.begin(), v.end(), 0);       // 10 — the 0 is the starting value`,
      },
      {
        kind: 'text',
        body: '**O(n)**. The third argument is both the initial value and — crucially — the accumulator\'s **type**.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'accumulate(..., 0) sums into an int and overflows',
        body: 'Passing a literal `0` makes the accumulator an `int`, so a total beyond 2.1 billion wraps to a negative number — even if you assign the result to a `long long`. The damage happens inside the fold, before the assignment. Pass `0LL` whenever the sum could be large. This is a silent wrong answer, not a crash.',
      },
      {
        kind: 'code',
        code: `vector<int> big(100000, 100000);            // sums to 10^10

int wrong = accumulate(big.begin(), big.end(), 0);          // OVERFLOWS
long long alsoWrong = accumulate(big.begin(), big.end(), 0); // STILL overflows
long long right = accumulate(big.begin(), big.end(), 0LL);   // correct`,
      },
      { kind: 'heading', text: 'Custom folds' },
      {
        kind: 'code',
        code: `// Product instead of sum
accumulate(v.begin(), v.end(), 1LL, multiplies<long long>());

// Maximum
accumulate(v.begin(), v.end(), INT_MIN,
           [](int acc, int x) { return max(acc, x); });

// Concatenating strings
accumulate(words.begin(), words.end(), string(""),
           [](const string& acc, const string& w) { return acc + w; });

// Summing a member of a struct
accumulate(people.begin(), people.end(), 0,
           [](int acc, const Person& p) { return acc + p.age; });`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'The lambda takes (accumulator, element) in that order',
        body: 'The first parameter is the running total, the second is the current element. Getting them the wrong way round compiles when both are the same type and then produces silently wrong results — the classic case being string concatenation, where the pieces come out in a scrambled order.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'String concatenation with accumulate is O(n²)',
        body: 'The lambda above returns `acc + w`, building a whole new string every step. For n strings that is quadratic. Use a plain loop with `+=`, which appends in place — the same lesson as Chapter 5, arriving through a different route.',
      },
      { kind: 'heading', text: 'The related numeric algorithms' },
      {
        kind: 'code',
        code: `// Prefix sums, written straight into another container
vector<int> prefix(v.size());
partial_sum(v.begin(), v.end(), prefix.begin());
// {1, 2, 3, 4} → {1, 3, 6, 10}

// Consecutive differences — the inverse
adjacent_difference(v.begin(), v.end(), diff.begin());

// Dot product of two ranges
inner_product(a.begin(), a.end(), b.begin(), 0LL);

// Fill with consecutive values
vector<int> ids(5);
iota(ids.begin(), ids.end(), 0);        // {0, 1, 2, 3, 4}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'iota is genuinely useful',
        body: 'It fills a range with increasing values, which is exactly what you need to initialise a Union-Find parent array (`iota(parent.begin(), parent.end(), 0)` makes every node its own parent) or to build an index array you then sort by some other key. One line replacing a loop, and it appears in real solutions.',
      },
    ],
    keyTakeaways: [
      '`accumulate` is in `<numeric>`, not `<algorithm>`.',
      'The third argument sets the accumulator type — use `0LL` for large sums.',
      'The fold lambda takes `(accumulator, element)` in that order.',
      '`iota` fills a range with consecutive values — ideal for Union-Find parents.',
    ],
    practice: {
      prompt: 'Sum a vector whose total exceeds 2 billion with `0` and then `0LL`, and confirm only the second is correct even when both are stored in a `long long`. Then build a prefix-sum array with `partial_sum` and initialise a Union-Find parent array with `iota`.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-16.6',
    language: 'cpp',
    summary: 'Binary search for the first element not less than a value.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: '`lower_bound` returns an iterator to the **first element ≥ x** in a sorted range. If every element is smaller, it returns `end()`.',
      },
      {
        kind: 'code',
        code: `vector<int> v = {1, 3, 3, 5, 7};       // MUST be sorted

lower_bound(v.begin(), v.end(), 3);     // → the first 3   (index 1)
lower_bound(v.begin(), v.end(), 4);     // → 5             (index 3)
lower_bound(v.begin(), v.end(), 0);     // → 1             (index 0)
lower_bound(v.begin(), v.end(), 9);     // → end()`,
      },
      {
        kind: 'text',
        body: '**O(log n)** on a random-access range. The result is exactly the position where `x` would be inserted to keep the range sorted — which is why it answers "where does this belong?" directly.',
      },
      {
        kind: 'code',
        caption: 'Insertion position',
        code: `int pos = lower_bound(v.begin(), v.end(), x) - v.begin();
v.insert(v.begin() + pos, x);           // O(log n) to find, O(n) to insert`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'The range must be sorted',
        body: 'On unsorted data it returns a meaningless position with no warning — binary search assumes ordering and cannot detect its absence. If your answers are subtly wrong, check that you actually sorted first.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Use the member version on set and map',
        body: '`std::lower_bound(s.begin(), s.end(), x)` on a `set` compiles but runs in **O(n)**, because tree iterators cannot jump to the middle. The member `s.lower_bound(x)` uses the tree and is O(log n). Same name, hugely different cost.',
      },
      { kind: 'heading', text: 'Search Insert Position, in one line' },
      {
        kind: 'code',
        code: `int searchInsert(vector<int>& nums, int target) {
    return lower_bound(nums.begin(), nums.end(), target) - nums.begin();
}`,
      },
      {
        kind: 'text',
        body: 'The problem asks for the index of the target, or where it would be inserted — which is the definition of `lower_bound`. Worth writing the manual binary search once to understand it, then using this.',
      },
      { kind: 'heading', text: 'With a comparator' },
      {
        kind: 'code',
        code: `// On a descending range, pass the same comparator used to sort it
lower_bound(v.begin(), v.end(), x, greater<int>());

// On a sorted vector of pairs, searching by .first
auto it = lower_bound(v.begin(), v.end(), make_pair(target, INT_MIN));

// On structs, comparing against a plain value
auto it = lower_bound(events.begin(), events.end(), t,
                      [](const Event& e, int time) { return e.start < time; });`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The comparator is asymmetric — element first, value second',
        body: 'For `lower_bound`, the lambda receives `(element, value)`. For `upper_bound` the order is reversed: `(value, element)`. Getting this backwards produces a compile error that mentions neither parameter clearly. When searching a container of structs by one field, this asymmetry is the thing to check first.',
      },
      {
        kind: 'code',
        caption: 'Longest Increasing Subsequence — the O(n log n) solution',
        code: `int lengthOfLIS(vector<int>& nums) {
    vector<int> tails;                       // tails[i] = smallest tail of an
                                             // increasing subsequence of length i+1
    for (int x : nums) {
        auto it = lower_bound(tails.begin(), tails.end(), x);
        if (it == tails.end()) tails.push_back(x);    // extends the longest
        else *it = x;                                 // improves an existing tail
    }
    return tails.size();
}`,
      },
      {
        kind: 'text',
        body: '`tails` is not the actual subsequence — only its length is meaningful. But it stays sorted, which is what lets `lower_bound` find the replacement position in O(log n) and turns the O(n²) DP into **O(n log n)**.',
      },
    ],
    keyTakeaways: [
      '`lower_bound` finds the first element ≥ x, in O(log n), on sorted data.',
      'Its result is the correct insertion position for x.',
      'Use the member version on `set`/`map`; the free one is O(n) there.',
      'With a comparator the arguments are `(element, value)` — the reverse of `upper_bound`.',
    ],
    practice: {
      prompt: 'Solve Search Insert Position with one `lower_bound` call, then write the manual binary search and confirm they agree — including on an empty vector and on a target larger than everything. Then implement Longest Increasing Subsequence in O(n log n).',
      leetcode: { title: 'Longest Increasing Subsequence', slug: 'longest-increasing-subsequence' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-16.7',
    language: 'cpp',
    summary: 'Find the first element strictly greater — and use the pair for range queries.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: '`upper_bound` returns an iterator to the **first element > x**. The only difference from `lower_bound` is what happens when `x` is present: `lower_bound` points at it, `upper_bound` points past it.',
      },
      {
        kind: 'code',
        code: `vector<int> v = {1, 3, 3, 5, 7};

lower_bound(v.begin(), v.end(), 3);    // → the first 3    (index 1)
upper_bound(v.begin(), v.end(), 3);    // → 5              (index 3)

lower_bound(v.begin(), v.end(), 4);    // → 5              (index 3)
upper_bound(v.begin(), v.end(), 4);    // → 5              — identical when absent`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'They coincide exactly when x is absent',
        body: '`lower_bound(x) == upper_bound(x)` is a clean test for "x is not present". The gap between them is precisely the run of elements equal to `x`, which makes the pair far more useful than either alone.',
      },
      { kind: 'heading', text: 'Counting with the pair' },
      {
        kind: 'code',
        code: `// How many times does x occur?
int occurrences = upper_bound(v.begin(), v.end(), x)
                - lower_bound(v.begin(), v.end(), x);

// How many elements satisfy lo <= val <= hi?
int inRange = upper_bound(v.begin(), v.end(), hi)
            - lower_bound(v.begin(), v.end(), lo);

// Both in one call
auto [first, last] = equal_range(v.begin(), v.end(), x);
int count = last - first;`,
      },
      {
        kind: 'text',
        body: 'These range counts on a sorted array are O(log n), against O(n) for a linear scan. It is the standard technique whenever a problem asks "how many values fall between a and b" over many queries.',
      },
      { kind: 'heading', text: 'The predecessor pattern' },
      {
        kind: 'code',
        caption: 'The largest element ≤ x',
        code: `auto it = upper_bound(v.begin(), v.end(), x);      // first STRICTLY greater
if (it != v.begin()) {
    --it;                                          // step back
    cout << *it;                                   // largest value <= x
}`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Guard against begin() before stepping back',
        body: 'If every element is greater than `x`, `upper_bound` returns `begin()` and `--it` walks before the start — undefined behaviour. The `it != begin()` check is mandatory, and the failing case is "x smaller than everything", which is exactly what hidden tests include.',
      },
      {
        kind: 'code',
        caption: 'Where this pattern earns its place',
        code: `// Time-Based Key-Value Store: the latest value at or before a timestamp
map<int,string> timeline;

string get(int t) {
    auto it = timeline.upper_bound(t);       // member version — O(log n)
    if (it == timeline.begin()) return "";   // nothing at or before t
    return (--it)->second;
}`,
      },
      {
        kind: 'text',
        body: 'This "step past, then step back" idiom answers "the most recent entry at or before time t" — a query no hash container can serve at any complexity. It shows up in calendar booking, stock-price and time-series problems.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'The comparator argument order is reversed',
        body: 'For `lower_bound` the lambda is `(element, value)`; for `upper_bound` it is `(value, element)`. The asymmetry is easy to forget and produces a confusing template error. When searching structs by one field, write both comparators carefully or use the member versions on a `map` keyed by that field.',
      },
    ],
    keyTakeaways: [
      '`upper_bound` finds the first element strictly greater than x.',
      '`upper_bound - lower_bound` counts occurrences or elements in a range.',
      '`upper_bound` then `--it` gives the largest element ≤ x — guard `begin()` first.',
      'Its comparator takes `(value, element)`, the reverse of `lower_bound`.',
    ],
    practice: {
      prompt: 'On a sorted vector with duplicates, count occurrences and count a range using the two bounds. Then write the predecessor query and test it with a value smaller than everything — that is the case the `begin()` guard exists for.',
      leetcode: { title: 'Find First and Last Position of Element in Sorted Array', slug: 'find-first-and-last-position-of-element-in-sorted-array' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-16.8',
    language: 'cpp',
    summary: 'Test membership in a sorted range — and know why it is rarely what you want.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: '`binary_search` answers one narrow question: is this value present in a sorted range? It returns a plain `bool`, which sounds convenient and is usually **not** what you want — because most problems need the position, not the presence.',
      },
      {
        kind: 'code',
        code: `#include <algorithm>

vector<int> v = {1, 3, 5, 7};           // MUST be sorted

binary_search(v.begin(), v.end(), 5);   // true
binary_search(v.begin(), v.end(), 4);   // false`,
      },
      {
        kind: 'text',
        body: '**O(log n)**, and it returns only a **bool** — not a position, not an iterator. That limitation is the whole story of this function.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'It tells you whether, never where',
        body: 'If you need the index — and in DSA you almost always do — `binary_search` is useless on its own. Use `lower_bound` instead: it gives an iterator, and comparing `*it == target` tells you whether it was found. One call answers both questions.',
      },
      {
        kind: 'code',
        caption: 'The idiom that replaces it',
        code: `auto it = lower_bound(v.begin(), v.end(), target);

if (it != v.end() && *it == target) {
    int index = it - v.begin();          // found, and you know where
} else {
    // not found — 'it' is still the correct insertion position
}`,
      },
      {
        kind: 'text',
        body: 'Both checks are needed: `it != end()` guards the dereference, and `*it == target` distinguishes "found it" from "found where it would go". `lower_bound` returns a valid position either way.',
      },
      { kind: 'heading', text: 'When binary_search is fine' },
      {
        kind: 'code',
        code: `// A pure yes/no question, position irrelevant
if (binary_search(allowed.begin(), allowed.end(), value)) { ... }

// Inside a loop testing many values against a sorted reference list
for (int x : queries)
    if (binary_search(sorted.begin(), sorted.end(), x)) count++;`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'For membership alone, a hash set is usually better',
        body: '`unordered_set::count` is O(1) against `binary_search`\'s O(log n), and needs no sorting. Reach for `binary_search` when the data is *already* sorted for another reason, or when you also want the ordering. If membership is the only requirement, build a hash set.',
      },
      { kind: 'heading', text: 'Writing it by hand' },
      {
        kind: 'code',
        caption: 'Worth being able to write from memory',
        code: `int binarySearch(vector<int>& nums, int target) {
    int low = 0, high = nums.size() - 1;

    while (low <= high) {
        int mid = low + (high - low) / 2;      // avoids overflow
        if (nums[mid] == target) return mid;
        if (nums[mid] < target) low = mid + 1;
        else                    high = mid - 1;
    }
    return -1;
}`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'The three details that make or break it',
        body: '**1.** `low + (high - low) / 2`, not `(low + high) / 2` — the sum can overflow. **2.** `while (low <= high)` with `high = size - 1`; mixing that up with the `low < high` / `high = size` form causes off-by-one bugs. **3.** `mid + 1` and `mid - 1`, never plain `mid`, or the range stops shrinking and the loop spins forever.',
      },
      {
        kind: 'text',
        body: 'Interviewers ask for the hand-written version regularly, and "binary search on the answer" — searching a value range rather than an array — requires writing the loop yourself. Learn the manual form; use the library one in solutions.',
      },
      {
        kind: 'code',
        caption: 'Binary search on the answer',
        code: `// "Smallest capacity such that the job finishes in D days"
int low = maxWeight, high = totalWeight;

while (low < high) {
    int mid = low + (high - low) / 2;
    if (canFinish(weights, mid, days)) high = mid;    // feasible — try smaller
    else                               low = mid + 1; // infeasible — go bigger
}
return low;`,
      },
      {
        kind: 'text',
        body: 'Here there is no array to search — the range is the space of possible answers, and `canFinish` is the sorted predicate. This pattern solves Koko Eating Bananas, Split Array Largest Sum and Capacity to Ship Packages, and no library function covers it.',
      },
    ],
    keyTakeaways: [
      '`binary_search` returns only a bool — use `lower_bound` when you need the index.',
      'Test with `it != end() && *it == target`.',
      'For membership alone, `unordered_set` is O(1) and needs no sorting.',
      'Learn the manual loop — "binary search on the answer" requires it.',
    ],
    practice: {
      prompt: 'Write binary search by hand and test it on an empty array, a one-element array, and a target absent from the middle. Then rewrite it using `lower_bound` plus the equality check. Then solve Koko Eating Bananas, where the search space is the answer range rather than an array.',
      leetcode: { title: 'Koko Eating Bananas', slug: 'koko-eating-bananas' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-16.9',
    language: 'cpp',
    summary: 'Find extremes in a range, and remember the dereference.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: '`min_element` and `max_element` find the extreme value in a range. Like `find`, they return **iterators** rather than values, which means you must dereference the result — and forgetting to is one of the most common small STL mistakes.',
      },
      {
        kind: 'code',
        code: `#include <algorithm>

vector<int> v = {3, 1, 4, 1, 5};

*min_element(v.begin(), v.end());     // 1  — note the star
*max_element(v.begin(), v.end());     // 5

auto it = max_element(v.begin(), v.end());
int index = it - v.begin();           // 4 — where the maximum is`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'They return iterators, not values',
        body: 'Forgetting the `*` gives a compile error about assigning an iterator to an int — one of the most frequent small mistakes in C++ DSA code. The upside of returning an iterator is that you also get the *position*, which `min`/`max` cannot give you.',
      },
      {
        kind: 'text',
        body: '**O(n)** — every element must be examined. On ties, both return the **first** occurrence.',
      },
      {
        kind: 'code',
        caption: 'Both at once',
        code: `auto [lo, hi] = minmax_element(v.begin(), v.end());
cout << *lo << " " << *hi;        // one pass instead of two`,
      },
      {
        kind: 'code',
        caption: 'With a comparator',
        code: `// Longest string
auto it = max_element(words.begin(), words.end(),
                      [](const string& a, const string& b) {
                          return a.size() < b.size();
                      });

// Struct with the highest score
auto best = max_element(people.begin(), people.end(),
                        [](const Person& a, const Person& b) {
                            return a.score < b.score;
                        });`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'The comparator is always "less than", even for max_element',
        body: '`max_element` uses `<` to decide which element is larger — it does not want a "greater than" comparator. Passing `greater<>()` gives you the *minimum*. The same comparator works for both functions; only the algorithm differs.',
      },
      { kind: 'heading', text: 'Do not confuse these with min and max' },
      {
        kind: 'code',
        code: `min(3, 7);                            // 3  — two values, returns a value
max(3, 7);                            // 7

min({3, 7, 1, 9});                    // 1  — initializer list, still a value
max({a, b, c});                       // no iterators involved

*min_element(v.begin(), v.end());     // a RANGE, returns an iterator`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'min({a, b, c}) is very handy',
        body: 'The braced form takes any number of arguments, which is exactly what Edit Distance needs: `1 + min({dp[i-1][j], dp[i][j-1], dp[i-1][j-1]})`. Without it you would write nested `min(min(a, b), c)` calls. The braces are required — `min(a, b, c)` does not compile.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'These are undefined on an empty range',
        body: '`min_element(v.begin(), v.end())` on an empty vector returns `end()`, and dereferencing it is undefined behaviour. Guard with `if (!v.empty())` whenever the input might be empty — another case hidden tests reliably check.',
      },
      {
        kind: 'text',
        body: 'One practical note: if you need the maximum repeatedly as data changes, scanning with `max_element` each time is O(n) per query. That is the situation a `priority_queue` or `multiset` exists for.',
      },
    ],
    keyTakeaways: [
      '`min_element`/`max_element` return iterators — remember the `*`.',
      'They are O(n) and return the first occurrence on ties.',
      'Their comparator is always "less than", even for `max_element`.',
      '`min({a,b,c})` takes a braced list; `min_element` takes a range.',
    ],
    practice: {
      prompt: 'Find a vector\'s maximum and its index in one call. Then find the longest string in a `vector<string>` with a comparator. Then call `min_element` on an empty vector and dereference it — the crash is why the empty guard matters.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-16.10',
    language: 'cpp',
    summary: 'Generate permutations in lexicographic order without writing recursion.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: '`next_permutation` rearranges a range into the **next lexicographically larger** permutation, returning `false` and wrapping to the smallest when there is none.',
      },
      {
        kind: 'code',
        code: `#include <algorithm>

vector<int> v = {1, 2, 3};

do {
    for (int x : v) cout << x;
    cout << " ";
} while (next_permutation(v.begin(), v.end()));`,
        output: '123 132 213 231 312 321',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Start from a sorted range or you miss permutations',
        body: 'It only produces permutations *after* the current one. Starting from `{3, 2, 1}` — already the largest — the loop runs once and stops. Always `sort` first if you need all n! arrangements. This is the mistake that makes people think the function is broken.',
      },
      {
        kind: 'code',
        caption: 'The correct setup',
        code: `sort(v.begin(), v.end());        // start at the smallest permutation
do {
    // process v
} while (next_permutation(v.begin(), v.end()));`,
      },
      {
        kind: 'text',
        body: 'Each call is **O(n)**, so generating all permutations is O(n · n!). That is only viable for n up to about 10 — which is exactly the constraint under which permutation problems are posed.',
      },
      { kind: 'heading', text: 'It handles duplicates correctly' },
      {
        kind: 'code',
        code: `vector<int> v = {1, 1, 2};
sort(v.begin(), v.end());
do { print(v); } while (next_permutation(v.begin(), v.end()));
// 112, 121, 211 — three DISTINCT permutations, not six`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Duplicate handling comes free',
        body: 'Hand-written backtracking for Permutations II needs an explicit `if (i > 0 && nums[i] == nums[i-1] && !used[i-1]) continue;` to skip repeats. `next_permutation` gives distinct permutations automatically, because lexicographic succession never revisits an arrangement. That makes it a genuinely shorter solution to that problem.',
      },
      {
        kind: 'code',
        caption: 'The companion function',
        code: `prev_permutation(v.begin(), v.end());     // the next SMALLER permutation`,
      },
      { kind: 'heading', text: 'Next Permutation as its own problem' },
      {
        kind: 'code',
        caption: 'What the algorithm actually does',
        code: `void nextPermutation(vector<int>& nums) {
    int n = nums.size();

    // 1. Find the rightmost i with nums[i] < nums[i+1] — the "pivot"
    int i = n - 2;
    while (i >= 0 && nums[i] >= nums[i + 1]) i--;

    // 2. If one exists, swap it with the rightmost element greater than it
    if (i >= 0) {
        int j = n - 1;
        while (nums[j] <= nums[i]) j--;
        swap(nums[i], nums[j]);
    }

    // 3. Reverse everything after i — it was descending, now it is the smallest
    reverse(nums.begin() + i + 1, nums.end());
}`,
      },
      {
        kind: 'text',
        body: 'The suffix after the pivot is always non-increasing, so reversing it produces the smallest arrangement of those elements. When no pivot exists the whole range was descending, and step 3 reverses it to the smallest permutation — which is exactly the wrap-around behaviour.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'LeetCode asks you to implement this one',
        body: 'The problem "Next Permutation" requires the in-place O(n) algorithm above, not a call to the library function. Understanding the find-pivot / swap / reverse structure is the point of the exercise — and it is a common interview question precisely because the three steps are easy to state and easy to get wrong.',
      },
    ],
    keyTakeaways: [
      '`next_permutation` gives the next lexicographic arrangement, or `false` at the end.',
      'Sort first, or you only get the permutations after the current one.',
      'It handles duplicates automatically, producing distinct permutations only.',
      'The algorithm is: find the pivot, swap with the rightmost greater, reverse the suffix.',
    ],
    practice: {
      prompt: 'Print all permutations of {1,2,3} with the do-while loop, then start from {3,2,1} and see only one printed. Then run it on {1,1,2} and confirm you get three rather than six. Then implement Next Permutation by hand with the three steps.',
      leetcode: { title: 'Next Permutation', slug: 'next-permutation' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-16.11',
    language: 'cpp',
    summary: 'Remove consecutive duplicates — and understand why it does not shrink the container.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: '`unique` removes **consecutive** duplicates by shifting the surviving elements forward. It returns an iterator to the new logical end — but the container\'s size is unchanged.',
      },
      {
        kind: 'code',
        code: `vector<int> v = {1, 1, 2, 2, 3};

auto newEnd = unique(v.begin(), v.end());
// v is now {1, 2, 3, ?, ?} — the last two are unspecified leftovers
// v.size() is STILL 5

v.erase(newEnd, v.end());      // actually shrink it
// v is now {1, 2, 3}, size 3`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'unique alone does not remove anything',
        body: 'Algorithms operate on iterator ranges and have no access to the container, so they cannot change its size. `unique` only rearranges. Forgetting the `erase` leaves stale values at the end and a wrong `size()` — a bug that often survives testing because the visible prefix looks correct.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Only CONSECUTIVE duplicates are removed',
        body: '`{1, 2, 1}` stays `{1, 2, 1}` — the two 1s are not adjacent. To remove all duplicates you must sort first, which is why the deduplication idiom is always sort-then-unique-then-erase.',
      },
      {
        kind: 'code',
        caption: 'The full deduplication idiom',
        code: `sort(v.begin(), v.end());
v.erase(unique(v.begin(), v.end()), v.end());
// O(n log n) overall, dominated by the sort`,
      },
      {
        kind: 'text',
        body: 'Worth memorising as a single line. The alternative — building an `unordered_set` and copying back — is O(n) but loses the ordering and allocates; the sort-based version is usually preferred when you want sorted unique output anyway.',
      },
      {
        kind: 'code',
        caption: 'With a custom equality predicate',
        code: `// Treat values within 1 of each other as duplicates
unique(v.begin(), v.end(), [](int a, int b) { return abs(a - b) <= 1; });

// Case-insensitive duplicate characters
unique(s.begin(), s.end(), [](char a, char b) {
    return tolower(a) == tolower(b);
});`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'The predicate answers "are these equal", not "is a less than b"',
        body: 'Unlike `sort`, whose comparator is an ordering, `unique`\'s is an equality test. Passing a `<` comparator by mistake compiles and silently removes the wrong elements.',
      },
      { kind: 'heading', text: 'Removing duplicates in place, by hand' },
      {
        kind: 'code',
        caption: 'Remove Duplicates from Sorted Array',
        code: `int removeDuplicates(vector<int>& nums) {
    if (nums.empty()) return 0;

    int write = 1;                                   // slow pointer
    for (int read = 1; read < nums.size(); read++)   // fast pointer
        if (nums[read] != nums[write - 1])
            nums[write++] = nums[read];

    return write;                    // the problem wants the new length
}`,
      },
      {
        kind: 'text',
        body: 'This is what `unique` does internally — a write pointer trailing a read pointer, from Chapter 5. LeetCode asks for the hand-written version because the exercise is the two-pointer technique, not the library call.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The elements past the new end are unspecified',
        body: 'After `unique`, the tail holds values in a valid but unspecified state — do not assume they are the originals. That is why `erase` is not merely tidiness: reading past `newEnd` is meaningless.',
      },
    ],
    keyTakeaways: [
      '`unique` shifts elements and returns the new end; it never resizes the container.',
      'Always pair it with `erase(newEnd, v.end())`.',
      'It only removes *consecutive* duplicates — sort first for full deduplication.',
      'Its predicate is an equality test, not an ordering.',
    ],
    practice: {
      prompt: 'Call `unique` without the `erase` and print `size()` to see it unchanged. Then apply the full sort-unique-erase idiom. Then hand-write Remove Duplicates from Sorted Array with two pointers — that is what the library function is doing internally.',
      leetcode: { title: 'Remove Duplicates from Sorted Array', slug: 'remove-duplicates-from-sorted-array' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-16.12',
    language: 'cpp',
    summary: 'Delete elements from a container correctly, in O(n) rather than O(n²).',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'The erase-remove idiom is how you delete elements by value from a `vector`. It looks strange until you see why the naive approaches fail.',
      },
      {
        kind: 'code',
        caption: 'The idiom',
        code: `v.erase(remove(v.begin(), v.end(), value), v.end());

// By condition
v.erase(remove_if(v.begin(), v.end(),
                  [](int x) { return x < 0; }), v.end());`,
      },
      { kind: 'heading', text: 'Why two functions are needed' },
      {
        kind: 'text',
        body: '`remove` cannot actually remove anything — like `unique`, it only sees an iterator range and has no access to the container. It shifts the surviving elements forward and returns the new logical end. `erase` is the container member that truly shrinks it.',
      },
      {
        kind: 'code',
        code: `vector<int> v = {1, 2, 1, 3};

auto newEnd = remove(v.begin(), v.end(), 1);
// v is now {2, 3, ?, ?}   — size STILL 4
// newEnd points at index 2

v.erase(newEnd, v.end());
// v is now {2, 3}, size 2`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'remove without erase leaves the container the same size',
        body: 'The values you wanted gone are no longer at the front, but `size()` is unchanged and the tail holds unspecified leftovers. Loops over the whole container then process garbage. This half-done state is the classic error, and it often survives casual testing because the useful prefix looks right.',
      },
      { kind: 'heading', text: 'Why not just erase in a loop' },
      {
        kind: 'code',
        code: `// BROKEN — skips elements
for (int i = 0; i < v.size(); i++)
    if (v[i] == target) v.erase(v.begin() + i);

// On {1, 1, 2}: erasing index 0 shifts the second 1 into index 0,
// but the loop moves to i = 1 — that 1 is never examined.`,
      },
      {
        kind: 'text',
        body: 'And even when written correctly (by not incrementing after an erase), it is **O(n²)**: each `erase` shifts every later element. The erase-remove idiom does one pass of shifting and one truncation — **O(n)** total.',
      },
      {
        kind: 'code',
        caption: 'The correct index-loop version, for comparison',
        code: `for (int i = 0; i < v.size(); ) {
    if (v[i] == target) v.erase(v.begin() + i);   // do NOT increment
    else i++;
}
// Correct, but O(n^2)`,
      },
      { kind: 'heading', text: 'Erasing from other containers' },
      {
        kind: 'code',
        code: `// Associative containers erase by key directly — O(log n) or O(1)
set<int> s;      s.erase(value);
map<int,int> m;  m.erase(key);

// Erasing during iteration — erase returns the next valid iterator
for (auto it = m.begin(); it != m.end(); ) {
    if (shouldRemove(it->first)) it = m.erase(it);
    else ++it;
}

// list has its own remove member — O(n) with no shifting
list<int> lst;   lst.remove(value);`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Never erase inside a range-based for loop',
        body: 'The loop holds internal iterators that erasing invalidates, so the behaviour is undefined — often a crash, sometimes silently skipped elements. Use the explicit iterator loop above, where `it = container.erase(it)` keeps the iterator valid.',
      },
      {
        kind: 'code',
        caption: 'C++20 simplifies all of this',
        code: `erase(v, value);                                   // one call
erase_if(v, [](int x) { return x < 0; });

// LeetCode supports C++20, but the older idiom is what you will
// see in most existing code — recognise both.`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Often, building a new vector is clearest',
        body: 'When the filtering logic is non-trivial, `vector<int> result; for (int x : v) if (keep(x)) result.push_back(x);` is O(n), obviously correct, and easier to read than any of the above. Reach for erase-remove when you must modify in place; otherwise a fresh vector is a perfectly good answer.',
      },
    ],
    keyTakeaways: [
      '`remove` only shifts elements; `erase` is what actually shrinks the container.',
      'Erasing inside an index loop skips elements and is O(n²).',
      'For `map`/`set`, use `it = c.erase(it)` to erase while iterating.',
      'C++20 offers `erase(c, v)` and `erase_if(c, pred)` as one-liners.',
    ],
    practice: {
      prompt: 'Call `remove` without `erase` and print the size and contents. Then remove all occurrences of a value from `{1, 1, 2}` with the naive index loop and watch a 1 survive. Then apply the erase-remove idiom and confirm it is correct.',
      leetcode: { title: 'Remove Element', slug: 'remove-element' },
    },
  },
];
