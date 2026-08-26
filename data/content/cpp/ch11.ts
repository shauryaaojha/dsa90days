import type { Lesson } from '../types';

/**
 * Chapter 11 — STL Sequence Containers.
 * vector dominates; the others exist for specific access patterns worth
 * recognising when a problem demands them.
 */
export const ch11: Lesson[] = [
  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-11.1',
    language: 'cpp',
    summary: 'Master the container you will use in almost every problem.',
    readMinutes: 6,
    blocks: [
      {
        kind: 'text',
        body: '`vector` is a dynamic array: contiguous storage, O(1) indexing, and automatic growth. It is the default choice, and roughly 80% of LeetCode solutions use nothing else.',
      },
      {
        kind: 'code',
        caption: 'Creating one',
        code: `vector<int> a;                    // empty
vector<int> b(5);                 // 5 elements, all 0
vector<int> c(5, -1);             // 5 elements, all -1
vector<int> d = {1, 2, 3};        // from a list
vector<int> e(d);                 // copy of d
vector<int> f(d.begin() + 1, d.end());   // from a range → {2, 3}`,
      },
      {
        kind: 'code',
        caption: 'The methods you actually use',
        code: `v.push_back(x);       // append                 O(1) amortised
v.pop_back();         // remove last            O(1)
v.size();             // count                  O(1)
v.empty();            // is it empty            O(1)
v[i];                 // access, unchecked      O(1)
v.at(i);              // access, throws if bad  O(1)
v.front();  v.back(); // first / last element
v.clear();            // remove all (capacity kept)
v.resize(n);          // change the element count
v.reserve(n);         // pre-allocate capacity only
v.insert(v.begin() + i, x);   // insert at i    O(n)
v.erase(v.begin() + i);       // erase at i     O(n)`,
      },
      {
        kind: 'table',
        headers: ['Operation', 'Cost', 'Why'],
        rows: [
          ['`v[i]`', 'O(1)', 'Address arithmetic on contiguous memory'],
          ['`push_back` / `pop_back`', 'O(1) amortised', 'Nothing shifts; occasional reallocation'],
          ['`insert` / `erase` in the middle', 'O(n)', 'Every later element must move'],
          ['`find` a value', 'O(n)', 'Must check each element'],
          ['`sort`', 'O(n log n)', '—'],
        ],
      },
      { kind: 'heading', text: 'size vs capacity' },
      {
        kind: 'code',
        code: `vector<int> v;
v.reserve(100);       // capacity 100, size 0 — no elements yet
v.size();             // 0
v[0];                 // UNDEFINED — there is no element there

v.resize(100);        // size 100, all value-initialised to 0
v[0];                 // fine`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'reserve does not create elements',
        body: '`reserve` only allocates space; the vector is still empty. Indexing into reserved-but-unsized space is undefined behaviour. Use `reserve` when you will `push_back`, and `resize` when you want elements you can index immediately. Mixing them up produces a crash that looks like an out-of-bounds bug because it is one.',
      },
      { kind: 'heading', text: 'Idioms worth knowing' },
      {
        kind: 'code',
        code: `// Sort and deduplicate
sort(v.begin(), v.end());
v.erase(unique(v.begin(), v.end()), v.end());

// Remove every element equal to x
v.erase(remove(v.begin(), v.end(), x), v.end());

// Sum
int total = accumulate(v.begin(), v.end(), 0);
long long big = accumulate(v.begin(), v.end(), 0LL);   // note 0LL for large sums

// Min and max — remember the star
int lo = *min_element(v.begin(), v.end());
int hi = *max_element(v.begin(), v.end());

// Reverse, and build a reversed copy
reverse(v.begin(), v.end());
vector<int> r(v.rbegin(), v.rend());

// Fill
fill(v.begin(), v.end(), 0);`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'accumulate with 0 truncates to int',
        body: 'The third argument sets the accumulator\'s type. `accumulate(v.begin(), v.end(), 0)` sums into an `int` and overflows past 2.1 billion even if you assign the result to a `long long`. Pass `0LL` when the total could be large — a genuinely easy way to get a silently wrong answer.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Any growth invalidates iterators and references',
        body: 'A `push_back` that reallocates leaves every existing iterator, pointer and reference dangling. This is why you must never `push_back` while range-looping over the same vector, and why holding `&v[0]` across a growth is a bug. Store indices instead — they survive reallocation.',
      },
      {
        kind: 'text',
        body: 'One habit worth forming: pass vectors as `const vector<int>&` when reading and `vector<int>&` when modifying. Passing by value copies every element, which is the leading cause of unexpected timeouts.',
      },
    ],
    keyTakeaways: [
      'Contiguous storage gives O(1) indexing and O(1) amortised `push_back`.',
      'Middle insert and erase are O(n) — everything after shifts.',
      '`reserve` allocates capacity; `resize` creates elements you can index.',
      'Growth invalidates all iterators and references — store indices, not pointers.',
    ],
    practice: {
      prompt: 'Build a vector, sort it, deduplicate it with the `unique`+`erase` idiom, and sum it with `accumulate` using both `0` and `0LL` on large values so you see the truncation. Then hold `&v[0]`, `push_back` until it reallocates, and print through the stale pointer.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-11.2',
    language: 'cpp',
    summary: 'Get O(1) insertion and removal at both ends — the container behind sliding-window maximum.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: '`deque` — "double-ended queue" — supports O(1) push and pop at **both** ends, while keeping O(1) indexing. That combination is what `vector` cannot offer.',
      },
      {
        kind: 'code',
        code: `#include <deque>

deque<int> dq = {2, 3};

dq.push_front(1);     // {1, 2, 3}     O(1) — a vector would be O(n)
dq.push_back(4);      // {1, 2, 3, 4}  O(1)
dq.pop_front();       // {2, 3, 4}     O(1)
dq.pop_back();        // {2, 3}        O(1)

dq.front();  dq.back();
dq[0];                // O(1) indexing still works
dq.size();  dq.empty();`,
      },
      {
        kind: 'table',
        headers: ['', '`vector`', '`deque`'],
        rows: [
          ['Push/pop back', 'O(1)', 'O(1)'],
          ['Push/pop **front**', '**O(n)**', '**O(1)**'],
          ['Index `[i]`', 'O(1)', 'O(1), slightly slower'],
          ['Memory layout', 'One contiguous block', 'Several fixed-size blocks'],
          ['Pointer arithmetic on data', 'Yes', 'No — not contiguous'],
        ],
      },
      {
        kind: 'text',
        body: 'A deque stores its elements in several fixed-size blocks with an index of block pointers. That is why it can grow at the front cheaply, and why its elements are not one contiguous run.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Erasing from the front of a vector is O(n)',
        body: '`v.erase(v.begin())` shifts every remaining element left. Inside a loop that makes an apparently linear algorithm O(n²) — one of the most common hidden costs in DSA code. If your algorithm consumes from the front, use a `deque`, or use an index that walks forward instead of physically removing elements.',
      },
      { kind: 'heading', text: 'The killer application: monotonic deque' },
      {
        kind: 'code',
        caption: 'Sliding Window Maximum — O(n)',
        code: `vector<int> maxSlidingWindow(vector<int>& nums, int k) {
    deque<int> dq;              // holds INDICES, values decreasing
    vector<int> result;

    for (int i = 0; i < nums.size(); i++) {
        // Drop indices that have fallen out of the window
        if (!dq.empty() && dq.front() <= i - k) dq.pop_front();

        // Drop values smaller than the incoming one — they can never be the max
        while (!dq.empty() && nums[dq.back()] <= nums[i]) dq.pop_back();

        dq.push_back(i);

        if (i >= k - 1) result.push_back(nums[dq.front()]);   // front = maximum
    }
    return result;
}`,
      },
      {
        kind: 'text',
        body: 'The deque keeps indices whose values are decreasing, so the front is always the window\'s maximum. Both ends are modified — expiring from the front, discarding from the back — which is exactly why no other container fits. Each index is pushed and popped at most once, so the whole thing is **O(n)** despite the inner `while`.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Store indices, not values',
        body: 'The deque holds indices so that `dq.front() <= i - k` can test whether the front has expired. With values alone you could not tell where they came from. Index-storing is standard in monotonic-deque and monotonic-stack problems.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'deque is also the default engine for stack and queue',
        body: '`std::stack` and `std::queue` are adaptors wrapping a `deque` by default. So when you use `queue`, you are already using a deque underneath — which is why `queue::pop` is O(1) rather than the O(n) it would be on a vector.',
      },
      {
        kind: 'text',
        body: 'Use `vector` by default. Switch to `deque` when you genuinely need cheap front access — BFS-style consumption, monotonic windows, or any algorithm that adds at one end and removes at the other.',
      },
    ],
    keyTakeaways: [
      '`deque` gives O(1) push/pop at both ends plus O(1) indexing.',
      '`vector::erase(begin())` is O(n) — a common hidden quadratic factor.',
      'Monotonic deque solves sliding-window maximum in O(n) by storing indices.',
      '`stack` and `queue` use `deque` internally by default.',
    ],
    practice: {
      prompt: 'Implement Sliding Window Maximum with a monotonic deque, then write the brute-force O(n·k) version and time both on 10⁵ elements with k = 1000. Then time `vector::erase(begin())` in a loop against `deque::pop_front()` — the gap makes the O(n) front-erase cost concrete.',
      leetcode: { title: 'Sliding Window Maximum', slug: 'sliding-window-maximum' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-11.3',
    language: 'cpp',
    summary: 'Use a doubly linked list when you need O(1) splicing and stable references.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: '`list` is a doubly linked list: each element holds pointers to its neighbours. Insertion and removal anywhere are O(1) **given an iterator**, but there is no indexing — reaching element 5 means walking five links.',
      },
      {
        kind: 'code',
        code: `#include <list>

list<int> lst = {1, 2, 3};

lst.push_front(0);       // O(1)
lst.push_back(4);        // O(1)
lst.pop_front();  lst.pop_back();

lst.front();  lst.back();
lst.size();   lst.empty();

// lst[2];               // ERROR — no indexing at all

auto it = lst.begin();
advance(it, 2);          // O(n) — must walk
lst.insert(it, 99);      // O(1) once you hold the iterator
lst.erase(it);           // O(1)`,
      },
      {
        kind: 'table',
        headers: ['', '`vector`', '`list`'],
        rows: [
          ['Index access', 'O(1)', '**Not supported**'],
          ['Insert/erase at a known position', 'O(n)', '**O(1)**'],
          ['Find a value', 'O(n)', 'O(n)'],
          ['Memory per element', 'Just the value', 'Value + two pointers'],
          ['Cache friendliness', 'Excellent', 'Poor — elements are scattered'],
          ['References survive insertion', 'No', '**Yes**'],
        ],
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'list is usually slower than vector, even for middle insertion',
        body: 'Its O(1) insert assumes you already have the iterator. Finding the position is O(n), and the walk is cache-hostile because each node is a separate allocation. In practice a `vector` with O(n) shifting frequently beats a `list` with O(1) insertion, because shifting contiguous memory is extremely fast. Do not choose `list` on complexity tables alone.',
      },
      { kind: 'heading', text: 'The two reasons to actually use it' },
      {
        kind: 'text',
        body: '**1. splice** — moving elements between positions in O(1), with no copying or reallocation. **2. stable references** — an iterator or pointer to an element stays valid no matter what else is inserted or erased.',
      },
      {
        kind: 'code',
        caption: 'splice — the operation nothing else offers',
        code: `list<int> lst = {1, 2, 3, 4};
auto it = lst.begin();
advance(it, 2);                       // points at 3

lst.splice(lst.begin(), lst, it);     // move that node to the front — O(1)
// lst is now {3, 1, 2, 4}, and 'it' is STILL valid`,
      },
      { kind: 'heading', text: 'Where this earns its keep: LRU Cache' },
      {
        kind: 'code',
        code: `class LRUCache {
    int capacity;
    list<pair<int,int>> items;                              // front = most recent
    unordered_map<int, list<pair<int,int>>::iterator> pos;  // key → node

public:
    LRUCache(int capacity) : capacity(capacity) {}

    int get(int key) {
        if (!pos.count(key)) return -1;
        items.splice(items.begin(), items, pos[key]);   // O(1) move to front
        return pos[key]->second;                        // iterator still valid!
    }

    void put(int key, int value) {
        if (pos.count(key)) items.erase(pos[key]);
        else if (items.size() == capacity) {
            pos.erase(items.back().first);
            items.pop_back();
        }
        items.push_front({key, value});
        pos[key] = items.begin();
    }
};`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The stored iterators are the whole trick',
        body: 'The hash map stores *iterators into the list*. That only works because `list` never invalidates them — with a `vector` every reallocation would break every stored iterator at once. This combination of stable iterators and O(1) splice is precisely why LRU Cache is written with a `list`.',
      },
      {
        kind: 'code',
        caption: 'list has its own sort',
        code: `list<int> lst = {3, 1, 2};

// sort(lst.begin(), lst.end());   // ERROR — needs random-access iterators
lst.sort();                        // O(n log n), a member function
lst.reverse();
lst.unique();                      // removes CONSECUTIVE duplicates
lst.merge(other);                  // merge two sorted lists`,
      },
      {
        kind: 'text',
        body: 'Because `list` iterators cannot jump, the generic `sort` will not compile on it. The member `sort()` uses merge sort, which only needs sequential access.',
      },
    ],
    keyTakeaways: [
      '`list` has no indexing; O(1) insert/erase requires already holding an iterator.',
      'Often slower than `vector` in practice — poor cache locality.',
      'Its real advantages are O(1) `splice` and iterators that never invalidate.',
      'Use `lst.sort()`, not `std::sort`, since its iterators are not random-access.',
    ],
    practice: {
      prompt: 'Implement LRU Cache with `list` + `unordered_map` and make sure you understand why the stored iterators stay valid. Then try rewriting it with `vector` and see where it breaks — that failure is the clearest argument for when `list` is the right tool.',
      leetcode: { title: 'LRU Cache', slug: 'lru-cache' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-11.4',
    language: 'cpp',
    summary: 'Know the singly linked list container exists, and why you will not use it.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: '`forward_list` is a singly linked list: each node points only forward. It exists to save the one back-pointer per node that `list` carries.',
      },
      {
        kind: 'code',
        code: `#include <forward_list>

forward_list<int> fl = {1, 2, 3};

fl.push_front(0);        // O(1)
fl.pop_front();          // O(1)
fl.front();

// fl.push_back(4);      // NOT AVAILABLE — no tail pointer
// fl.size();            // NOT AVAILABLE — would require an O(n) walk
// fl.back();            // NOT AVAILABLE`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'No size(), no push_back(), no back()',
        body: 'These are omitted deliberately: providing them would require either an O(n) traversal or an extra stored field, defeating the container\'s entire purpose. If you need any of them, `forward_list` is the wrong choice.',
      },
      { kind: 'heading', text: 'insert_after, not insert' },
      {
        kind: 'code',
        code: `forward_list<int> fl = {1, 2, 3};

auto it = fl.begin();
fl.insert_after(it, 99);       // insert AFTER the element at it → {1, 99, 2, 3}
fl.erase_after(it);            // erase the element after it

// To insert at the very front you need a special iterator:
fl.insert_after(fl.before_begin(), 0);    // → {0, 1, 99, 2, 3}`,
      },
      {
        kind: 'text',
        body: 'Because a node has no back-pointer, you cannot modify the position *at* an iterator — you can only work with the node after it. `before_begin()` exists purely so front insertion has something to point at.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'You will essentially never use this on LeetCode',
        body: 'The memory saving matters only for very large collections of tiny elements, and the missing operations make it awkward. Linked-list *problems* on LeetCode give you a raw `ListNode*` structure, not `forward_list` — so the container is not what you practise on either.',
      },
      {
        kind: 'text',
        body: 'The reason to know it exists: **`ListNode` is a hand-rolled `forward_list` node.** Understanding why `forward_list` cannot offer `size()` or `back()` in O(1) is understanding why LeetCode list problems always require a traversal to find the length, and why "remove the nth node from the end" needs two pointers rather than simple arithmetic.',
      },
      {
        kind: 'code',
        caption: 'The connection made explicit',
        code: `struct ListNode {
    int val;
    ListNode* next;      // forward only — exactly forward_list's node
};

// No size field, so length is O(n):
int length(ListNode* head) {
    int n = 0;
    while (head) { n++; head = head->next; }
    return n;
}

// No back-pointer, so "nth from the end" needs two pointers:
ListNode* fast = head;
for (int i = 0; i < n; i++) fast = fast->next;
ListNode* slow = head;
while (fast) { fast = fast->next; slow = slow->next; }
// slow is now n nodes from the end`,
      },
    ],
    keyTakeaways: [
      '`forward_list` is singly linked — no `size()`, `back()` or `push_back()`.',
      'It uses `insert_after`/`erase_after` and `before_begin()`.',
      'Rarely useful in practice; `list` or `vector` is almost always better.',
      'Worth knowing because LeetCode\'s `ListNode` has exactly the same limitations.',
    ],
    practice: {
      prompt: 'Rather than using `forward_list`, write the two-pointer "remove nth node from end" on a raw `ListNode*` list. The reason that technique exists at all is the missing back-pointer this lesson describes — the container and the problem share one constraint.',
      leetcode: { title: 'Remove Nth Node From End of List', slug: 'remove-nth-node-from-end-of-list' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-11.5',
    language: 'cpp',
    summary: 'Use the fixed-size array wrapper that behaves like a proper container.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: '`std::array` is a raw array with a size fixed at compile time, wrapped so that it behaves like a real container — it knows its own size, does not decay to a pointer, and works with STL algorithms.',
      },
      {
        kind: 'code',
        code: `#include <array>

array<int, 5> a = {1, 2, 3, 4, 5};      // size is part of the TYPE

a[0];             // O(1)
a.at(0);          // bounds-checked
a.size();         // 5 — a raw array cannot do this
a.front();  a.back();
a.fill(0);

sort(a.begin(), a.end());               // works with every algorithm`,
      },
      {
        kind: 'table',
        headers: ['', 'Raw `int[5]`', '`array<int,5>`', '`vector<int>`'],
        rows: [
          ['Size fixed at', 'Compile time', 'Compile time', 'Runtime, resizable'],
          ['Knows its size', 'No', '**Yes**', 'Yes'],
          ['Decays to a pointer', 'Yes', '**No**', 'No'],
          ['Stored on', 'Stack', 'Stack', 'Heap'],
          ['Can be copied/returned', 'No', '**Yes**', 'Yes'],
          ['Overhead vs raw array', '—', 'None', 'Small'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Zero overhead over a raw array',
        body: '`array` compiles to exactly the same machine code as `int a[5]` — the wrapper is entirely compile-time. So it is strictly better than a raw array: same speed, plus `size()`, plus algorithm support, plus it can be copied and returned from functions. If the size is a compile-time constant, prefer `array`.',
      },
      { kind: 'heading', text: 'Where it fits in DSA' },
      {
        kind: 'code',
        caption: 'Fixed-alphabet frequency counting',
        code: `array<int, 26> freq = {0};
for (char c : s) freq[c - 'a']++;

// It compares directly — which raw arrays cannot do:
array<int, 26> a = {0}, b = {0};
if (a == b) { /* same frequencies */ }`,
      },
      {
        kind: 'text',
        body: 'That comparison is genuinely useful. In Group Anagrams you can use `array<int,26>` as a map key or compare two frequency arrays in one expression — with a raw array you would need a manual loop.',
      },
      {
        kind: 'code',
        caption: 'Trie nodes',
        code: `struct TrieNode {
    array<TrieNode*, 26> children = {nullptr};
    bool isWord = false;
};`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'The size is part of the type',
        body: '`array<int,5>` and `array<int,10>` are different types, so a function taking one cannot accept the other. The size must be a compile-time constant — you cannot write `array<int, n>` for a runtime `n`. When the size is only known at runtime, you need `vector`.',
      },
      {
        kind: 'text',
        body: 'In practice most solutions use `vector` because sizes come from the input. Reach for `array` when the bound is genuinely fixed by the problem — 26 letters, 128 ASCII codes, 10 digits, 4 directions.',
      },
    ],
    keyTakeaways: [
      '`array<T,N>` is a raw array that knows its size and works with algorithms.',
      'Zero runtime overhead — strictly better than a raw array when N is constant.',
      'It supports `==`, which makes it usable as a frequency-array key.',
      'The size is part of the type and must be compile-time constant.',
    ],
    practice: {
      prompt: 'Rewrite a frequency counter with `array<int,26>` instead of `int[26]`, and compare two of them with `==` in a single expression. Then try to write `array<int, n>` with a runtime `n` and read the error — that limitation is exactly the line between `array` and `vector`.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-11.6',
    language: 'cpp',
    summary: 'Treat std::string as the sequence container it is, and unlock every algorithm on it.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: '`std::string` is a `vector<char>` with text-specific extras. Recognising that is what lets you apply the whole algorithm library to strings.',
      },
      {
        kind: 'code',
        caption: 'Everything a vector can do',
        code: `string s = "hello";

s.size();  s.length();       // identical
s[0];  s.at(0);
s.front();  s.back();
s.push_back('!');  s.pop_back();
s.empty();  s.clear();
s.begin();  s.end();

for (char c : s) { ... }
for (char& c : s) c = toupper(c);      // note the & to modify

sort(s.begin(), s.end());
reverse(s.begin(), s.end());
count(s.begin(), s.end(), 'l');
find(s.begin(), s.end(), 'e');`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'sort on a string is the anagram key',
        body: '`sort(s.begin(), s.end())` rearranges the characters, so all anagrams collapse to the same string. That single line is the whole idea behind Group Anagrams — `"eat"`, `"tea"` and `"ate"` all become `"aet"`, which becomes a hash-map key.',
      },
      {
        kind: 'code',
        caption: 'Plus the string-only operations',
        code: `s.substr(2, 3);            // by (position, LENGTH)
s.find("lo");              // index, or string::npos
s.rfind('l');              // last occurrence
s.replace(0, 5, "HELLO");
s.insert(0, "say ");
s.erase(0, 4);
s.append("world");
s.compare(other);
s += "text";               // append in place — prefer over s = s + x`,
      },
      { kind: 'heading', text: 'Conversions' },
      {
        kind: 'code',
        code: `string s = to_string(42);
int n = stoi("42");
long long b = stoll("999999999999");

// string ↔ vector<char>
vector<char> v(s.begin(), s.end());
string back(v.begin(), v.end());

// A single char to a string
string one(1, 'a');            // "a"
string one = string(1, c);
// NOT string one = c;         // does not compile`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Adding chars gives an int, not a string',
        body: '`char + char` promotes both to `int` and adds their codes: `\'a\' + \'b\'` is 195, not `"ab"`. To build a string from characters use `s += c` or `string(1, c)`. This catches people constructing keys or results character by character.',
      },
      {
        kind: 'code',
        caption: 'The character helpers, from <cctype>',
        code: `isalpha(c);  isdigit(c);  isalnum(c);
isupper(c);  islower(c);  isspace(c);
tolower(c);  toupper(c);       // these return int — cast if storing in a char

c - 'a';       // letter → 0..25
c - '0';       // digit char → its numeric value`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'length() is unsigned',
        body: 'Exactly like `vector::size()`. `s.length() - 1` on an empty string wraps to a huge number rather than −1, so a backward loop guarded by `i >= 0` never terminates. Write `(int)s.length() - 1`.',
      },
      {
        kind: 'text',
        body: 'The practical takeaway: any time you would reach for a loop over a string, check whether an algorithm already does it. `count`, `find`, `reverse`, `sort`, `all_of` and `transform` all work directly and express the intent more clearly.',
      },
    ],
    keyTakeaways: [
      '`string` is a sequence container — every `<algorithm>` function works on it.',
      '`sort(s.begin(), s.end())` produces the canonical anagram key.',
      '`char + char` yields an int; build strings with `+=` or `string(1, c)`.',
      '`length()` is unsigned — cast before subtracting.',
    ],
    practice: {
      prompt: 'Solve Group Anagrams using a sorted string as the map key. Then count vowels with `count_if` instead of a manual loop, and uppercase a string with `transform`. Seeing the library replace loops you would have written by hand is the point of this lesson.',
      leetcode: { title: 'Group Anagrams', slug: 'group-anagrams' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-11.7',
    language: 'cpp',
    summary: 'Build and traverse 2D structures — grids, matrices and DP tables.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'A `vector<vector<int>>` is how you represent a grid, a matrix, an adjacency list or a DP table. It is the most common nested structure in DSA, and it has one construction detail worth getting right immediately, because the wrong form silently shares rows.',
      },
      {
        kind: 'code',
        caption: 'The declarations to memorise',
        code: `// rows × cols, filled with 0
vector<vector<int>> grid(rows, vector<int>(cols, 0));

// From a literal
vector<vector<int>> g = {{1, 2, 3}, {4, 5, 6}};

// A DP table, initialised to -1 for "not computed"
vector<vector<int>> dp(n + 1, vector<int>(m + 1, -1));

// A 3D table
vector<vector<vector<int>>> dp3(a, vector<vector<int>>(b, vector<int>(c, 0)));`,
      },
      {
        kind: 'text',
        body: 'Read the constructor as "`rows` copies of a `vector<int>` of length `cols`". The inner vector is the prototype that gets copied for each row.',
      },
      {
        kind: 'code',
        caption: 'Dimensions and traversal',
        code: `int rows = grid.size();
int cols = grid[0].size();          // guard against an empty grid first!

for (int r = 0; r < rows; r++)
    for (int c = 0; c < cols; c++)
        cout << grid[r][c];

// Range-based — note both references
for (const auto& row : grid)
    for (int x : row)
        cout << x;

// To modify:
for (auto& row : grid)
    for (int& x : row)
        x *= 2;`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Guard grid[0] before reading it',
        body: '`grid[0].size()` crashes when the grid is empty. Start every grid solution with `if (grid.empty() || grid[0].empty()) return ...;`. Empty input is one of the most reliably present hidden test cases.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'auto without & copies the entire row',
        body: '`for (auto row : grid)` copies each row vector — O(rows × cols) of pointless copying, and any modification is lost. Use `const auto&` to read and `auto&` to modify. This is the same missing-`&` bug as before, but here the copy is a whole vector per iteration.',
      },
      { kind: 'heading', text: 'The direction-array traversal' },
      {
        kind: 'code',
        code: `int dr[] = {-1, 1, 0, 0};
int dc[] = { 0, 0,-1, 1};

for (int d = 0; d < 4; d++) {
    int nr = r + dr[d], nc = c + dc[d];
    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] == 1) {
        // valid neighbour
    }
}`,
      },
      {
        kind: 'text',
        body: 'The bounds check must precede the grid access — short-circuiting again. This block appears in every flood fill, island count and grid BFS.',
      },
      { kind: 'heading', text: 'DP tables' },
      {
        kind: 'code',
        caption: 'Edit distance — the classic 2D DP shape',
        code: `vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));

for (int i = 0; i <= m; i++) dp[i][0] = i;      // base row
for (int j = 0; j <= n; j++) dp[0][j] = j;      // base column

for (int i = 1; i <= m; i++)
    for (int j = 1; j <= n; j++)
        dp[i][j] = (a[i-1] == b[j-1])
                 ? dp[i-1][j-1]
                 : 1 + min({dp[i-1][j], dp[i][j-1], dp[i-1][j-1]});`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The n+1 sizing removes the base-case branches',
        body: 'Sizing the table `(m+1) × (n+1)` gives you a row and column of zeros to represent "empty prefix", so the recurrence needs no special case for `i = 0`. The cost is that `dp[i][j]` refers to `a[i-1]` — an off-by-one you must keep straight, but far less error-prone than branching inside the loop.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Watch the memory on large tables',
        body: 'A 10⁴ × 10⁴ table of ints is 10⁸ integers, around 400 MB — past the typical limit. When the recurrence only reads the previous row, keep two rows instead of the whole table: O(n) space rather than O(n·m). That optimisation is expected in interviews once the basic version works.',
      },
    ],
    keyTakeaways: [
      '`vector<vector<int>> g(rows, vector<int>(cols, 0))` is the standard construction.',
      'Check `grid.empty()` before reading `grid[0].size()`.',
      'Use `const auto&` / `auto&` in row loops — bare `auto` copies whole rows.',
      'Size DP tables `(m+1) × (n+1)` to absorb the base cases.',
    ],
    practice: {
      prompt: 'Build a 3×4 grid, print it, and write the four-direction neighbour loop. Then implement Edit Distance with a full 2D table, and then reduce it to two rows. That reduction is a standard interview follow-up once the table version works.',
      leetcode: { title: 'Number of Islands', slug: 'number-of-islands' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-11.8',
    language: 'cpp',
    summary: 'Combine containers into the composite structures real problems need.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Beyond `vector<vector<int>>`, a handful of nested combinations cover most problems. Recognising them by shape saves you designing from scratch each time.',
      },
      { kind: 'heading', text: 'vector of pairs — sortable records' },
      {
        kind: 'code',
        code: `vector<pair<int,int>> intervals = {{1,3}, {2,6}, {8,10}};

// Sorts by .first, then .second — exactly what interval problems need
sort(intervals.begin(), intervals.end());

for (auto& [start, end] : intervals)          // structured binding
    cout << start << "-" << end << "\\n";

// Sorting by the SECOND element needs a comparator
sort(intervals.begin(), intervals.end(),
     [](const auto& a, const auto& b) { return a.second < b.second; });`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'pair sorts lexicographically for free',
        body: 'The default `<` on `pair` compares `.first` and falls back to `.second` on ties. Merge Intervals needs exactly this, so `sort(intervals.begin(), intervals.end())` with no comparator is already correct. Sorting by end time — needed for activity-selection problems — is the case that requires a lambda.',
      },
      { kind: 'heading', text: 'Adjacency lists — graphs' },
      {
        kind: 'code',
        code: `// Unweighted graph: adj[u] holds u's neighbours
vector<vector<int>> adj(n);
adj[u].push_back(v);
adj[v].push_back(u);            // omit for a directed graph

for (int next : adj[node]) { ... }

// Weighted graph: (neighbour, weight)
vector<vector<pair<int,int>>> adj(n);
adj[u].push_back({v, w});

for (auto& [next, weight] : adj[node]) { ... }`,
      },
      {
        kind: 'text',
        body: 'An adjacency list uses O(V + E) space against an adjacency matrix\'s O(V²), and iterating a node\'s neighbours is proportional to its degree rather than to V. For the sparse graphs LeetCode uses, it is always the right representation.',
      },
      { kind: 'heading', text: 'Map to vector — grouping' },
      {
        kind: 'code',
        caption: 'Group Anagrams',
        code: `unordered_map<string, vector<string>> groups;

for (const string& word : words) {
    string key = word;
    sort(key.begin(), key.end());
    groups[key].push_back(word);        // [] default-constructs the vector
}

vector<vector<string>> result;
for (auto& [key, group] : groups)
    result.push_back(group);`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'operator[] builds the inner container for you',
        body: '`groups[key].push_back(word)` works even when `key` is absent: `[]` default-constructs an empty `vector<string>` first. No existence check needed — this is what makes grouping code so short.',
      },
      { kind: 'heading', text: 'vector of strings' },
      {
        kind: 'code',
        code: `vector<string> grid = {"abc", "def", "ghi"};      // a character grid

grid[1][2];                          // 'f' — row 1, column 2
int rows = grid.size();
int cols = grid[0].size();

// Modify in place
grid[0][0] = 'X';`,
      },
      {
        kind: 'text',
        body: 'Word Search and Number of Islands often hand you `vector<vector<char>>`, but `vector<string>` indexes identically and is more compact. Both support `grid[r][c]`.',
      },
      { kind: 'heading', text: 'Results as vector of vectors' },
      {
        kind: 'code',
        code: `vector<vector<int>> result;

result.push_back({1, 2, 3});         // braces build the inner vector inline
result.push_back(current);           // a COPY — correct in backtracking

// Level-order traversal builds one inner vector per level
vector<vector<int>> levelOrder(TreeNode* root) {
    vector<vector<int>> result;
    if (!root) return result;

    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        int count = q.size();               // fix the level size BEFORE the loop
        vector<int> level;
        for (int i = 0; i < count; i++) {
            TreeNode* node = q.front(); q.pop();
            level.push_back(node->val);
            if (node->left)  q.push(node->left);
            if (node->right) q.push(node->right);
        }
        result.push_back(level);
    }
    return result;
}`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Capture the queue size before the level loop',
        body: '`int count = q.size();` must be read *before* the inner loop, because that loop pushes children and changes the size as it runs. Writing `for (int i = 0; i < q.size(); i++)` re-evaluates the growing size and merges every level into one. This is the defining bug of level-order traversal.',
      },
    ],
    keyTakeaways: [
      '`vector<pair<int,int>>` sorts lexicographically — ideal for intervals.',
      '`vector<vector<int>>` as an adjacency list is O(V + E) and the right graph representation.',
      '`map<K, vector<V>>` plus `[]` gives grouping with no existence checks.',
      'In level-order traversal, snapshot `q.size()` before the inner loop.',
    ],
    practice: {
      prompt: 'Solve Merge Intervals with a `vector<pair<int,int>>`, build an adjacency list and run a DFS over it, and write level-order traversal. Then remove the `int count = q.size();` line and watch every level collapse into one — that failure is worth causing once.',
      leetcode: { title: 'Binary Tree Level Order Traversal', slug: 'binary-tree-level-order-traversal' },
    },
  },
];
