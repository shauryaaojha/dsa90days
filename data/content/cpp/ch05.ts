import type { Lesson } from '../types';

/**
 * Chapter 5 — Arrays and Strings.
 * The data structures the majority of LeetCode problems are built on. Heavy on
 * vector and std::string, since raw arrays and char* barely appear on the judge.
 */
export const ch05: Lesson[] = [
  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-5.1',
    language: 'cpp',
    summary: 'Store a sequence of values and reach any element in constant time.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'An array is a block of elements of the same type laid out **contiguously** in memory. That layout is the whole point: because the elements are evenly spaced, the computer can jump straight to element `i` by arithmetic rather than searching. That is what makes `arr[i]` **O(1)**.',
      },
      {
        kind: 'code',
        caption: 'Raw arrays',
        code: `int arr[5];                        // 5 ints, uninitialised — garbage values
int nums[5] = {1, 2, 3, 4, 5};     // initialised
int zeros[5] = {0};                // all five set to 0
int sized[] = {1, 2, 3};           // size deduced as 3

nums[0];        // 1  — indexing starts at 0
nums[4];        // 5  — last valid index is size - 1`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'On LeetCode you use vector, not raw arrays',
        body: 'Every LeetCode signature takes `vector<int>&`. A raw array cannot report its own size, cannot grow, and decays to a pointer the moment you pass it anywhere. Learn raw arrays so you can read C-style code and answer questions about memory layout, but write `vector` in solutions.',
      },
      { kind: 'heading', text: 'vector — the array you should actually use' },
      {
        kind: 'code',
        code: `#include <vector>

vector<int> v;                   // empty
vector<int> v(5);                // 5 elements, all 0
vector<int> v(5, -1);            // 5 elements, all -1
vector<int> v = {1, 2, 3};       // from a list

v.push_back(4);       // append          — amortised O(1)
v.pop_back();         // remove last     — O(1)
v.size();             // element count   — O(1)
v.empty();            // is it empty     — O(1)
v[i];                 // access          — O(1), no bounds check
v.at(i);              // access          — O(1), throws if out of range
v.front();  v.back(); // first and last element
v.clear();            // remove everything`,
      },
      {
        kind: 'table',
        headers: ['Operation', 'Complexity', 'Why'],
        rows: [
          ['Access `v[i]`', 'O(1)', 'Direct address arithmetic'],
          ['`push_back`', 'O(1) amortised', 'Occasionally reallocates and copies everything'],
          ['`pop_back`', 'O(1)', 'Nothing shifts'],
          ['Insert / erase in the middle', 'O(n)', 'Every later element must shift'],
          ['Search for a value', 'O(n)', 'Must check each element'],
        ],
      },
      {
        kind: 'text',
        body: '"Amortised O(1)" for `push_back` means most appends are instant, but when the vector runs out of capacity it allocates a bigger block and copies everything across. Since capacity typically doubles, that cost is spread thinly across all the cheap appends — the average stays constant.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Out-of-bounds access does not crash reliably',
        body: '`v[10]` on a five-element vector is undefined behaviour. It may crash, or it may quietly return whatever bytes sit past the end — so your program produces a wrong answer with no error at all. `v.at(10)` throws an exception instead, which is far easier to debug. Use `at()` while learning; switch to `[]` once your indexing is solid.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'reserve() when you know the final size',
        body: 'If you are about to push n elements, `v.reserve(n)` allocates once up front and skips every intermediate reallocation. It does not change the element count, only the capacity. A small, free speedup in tight loops.',
      },
    ],
    keyTakeaways: [
      'Contiguous storage is what makes indexing O(1).',
      'Valid indices are `0` to `size() - 1`; going past that is undefined behaviour.',
      '`push_back`/`pop_back` are O(1); inserting or erasing in the middle is O(n).',
      'Use `vector` on LeetCode — raw arrays cannot report their size or grow.',
    ],
    practice: {
      prompt: 'Build a vector of the first ten squares with `push_back`, print it forwards and backwards, then find its maximum with a single loop. Then read `v[100]` and `v.at(100)` and compare what each does — the difference between silent garbage and a clear exception is worth seeing once.',
      leetcode: { title: 'Running Sum of 1d Array', slug: 'running-sum-of-1d-array' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-5.2',
    language: 'cpp',
    summary: 'Work with grids and matrices, and get the row/column order right.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'A 2-D array is how you represent a grid, a maze, a chessboard or a DP table — and grid problems are a large slice of every interview list. The one thing to fix in your head now is the **order**: the first index is the row, the second is the column, and mixing them up produces code that runs and quietly transposes your data.',
      },
      {
        kind: 'code',
        caption: 'Declaring a 2D vector',
        code: `#include <vector>

// 3 rows, 4 columns, all zeros
vector<vector<int>> grid(3, vector<int>(4, 0));

// From a literal
vector<vector<int>> grid = {
    {1, 2, 3},
    {4, 5, 6}
};

grid[1][2];                 // row 1, column 2  →  6
int rows = grid.size();     // 2
int cols = grid[0].size();  // 3`,
      },
      {
        kind: 'text',
        body: 'Read `vector<vector<int>>` as "a vector whose elements are vectors of int". The outer vector holds the rows; each inner vector is one row. So the first index is always the **row** and the second the **column**.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'rows and cols are easy to swap',
        body: '`grid.size()` is the number of rows, `grid[0].size()` the number of columns. Getting these backwards produces out-of-range crashes on non-square grids — and passes silently on square ones, so your test case looks fine and the judge fails you. Name them `rows` and `cols` immediately and never re-derive them inline.',
      },
      {
        kind: 'code',
        caption: 'The standard traversal',
        code: `int rows = grid.size();
int cols = grid[0].size();

for (int r = 0; r < rows; r++) {
    for (int c = 0; c < cols; c++) {
        cout << grid[r][c] << " ";
    }
    cout << "\\n";
}`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Guard against an empty grid',
        body: '`grid[0].size()` crashes when `grid` is empty, because there is no row 0. Start with `if (grid.empty() || grid[0].empty()) return ...;`. Empty input is one of the most reliably present hidden test cases on LeetCode.',
      },
      { kind: 'heading', text: 'The four-directions idiom' },
      {
        kind: 'text',
        body: 'Nearly every grid problem — flood fill, island counting, shortest path — visits each cell\'s neighbours. Writing four separate `if`s is verbose and error-prone; a direction array collapses it into one loop.',
      },
      {
        kind: 'code',
        caption: 'Learn this pattern by heart',
        code: `int dr[] = {-1, 1, 0, 0};      // up, down, left, right
int dc[] = { 0, 0, -1, 1};

for (int d = 0; d < 4; d++) {
    int nr = r + dr[d];
    int nc = c + dc[d];
    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        // grid[nr][nc] is a valid neighbour
    }
}

// For eight directions (including diagonals):
int dr8[] = {-1,-1,-1, 0, 0, 1, 1, 1};
int dc8[] = {-1, 0, 1,-1, 1,-1, 0, 1};`,
      },
      {
        kind: 'text',
        body: 'The bounds check must come **before** reading `grid[nr][nc]` — short-circuiting again. This is the single most reused block of code in graph and matrix problems.',
      },
      { kind: 'heading', text: 'Rows can have different lengths' },
      {
        kind: 'code',
        code: `vector<vector<int>> jagged = {
    {1, 2, 3},
    {4},                  // shorter row — perfectly legal
    {5, 6}
};

// So iterate each row by ITS own size:
for (int r = 0; r < jagged.size(); r++)
    for (int c = 0; c < jagged[r].size(); c++)      // note jagged[r].size()
        cout << jagged[r][c];`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Flattening a 2D grid into 1D',
        body: 'A grid can be stored in a single vector of size `rows * cols`, where cell (r, c) lives at index `r * cols + c`, and index `i` maps back via `r = i / cols` and `c = i % cols`. This is more cache-friendly and appears in problems that ask you to treat a matrix as a sorted list — another place integer division and modulo earn their keep.',
      },
    ],
    keyTakeaways: [
      '`grid[row][col]` — the outer vector holds rows, `grid.size()` counts them.',
      'Check `grid.empty()` before touching `grid[0].size()`.',
      'The `dr`/`dc` direction arrays plus a bounds check cover every neighbour traversal.',
      'Rows may differ in length — loop each row by `grid[r].size()`.',
    ],
    practice: {
      prompt: 'Build a 3×4 grid, print it row by row, then write the four-direction neighbour loop and print each cell\'s valid neighbours. Test it on a 1×1 grid too. That direction-array pattern reappears in nearly every matrix and graph problem, so it is worth typing until it is automatic.',
      leetcode: { title: 'Number of Islands', slug: 'number-of-islands' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-5.3',
    language: 'cpp',
    summary: 'Know where your array lives in memory and why vector is nearly always the answer.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A **static** array has its size fixed at compile time and normally lives on the stack. A **dynamic** array is allocated at run time on the heap, and can be sized from a value you only learn while running.',
      },
      {
        kind: 'code',
        caption: 'The three ways',
        code: `// 1. Static — size must be a compile-time constant
int arr[100];

// 2. Dynamic with new/delete — manual memory management
int* arr = new int[n];
// ... use it ...
delete[] arr;              // you MUST free it, with delete[] not delete

// 3. vector — dynamic, and frees itself
vector<int> arr(n);`,
      },
      {
        kind: 'table',
        headers: ['', 'Static array', '`new[]`', '`vector`'],
        rows: [
          ['Size known at', 'Compile time', 'Run time', 'Run time'],
          ['Lives on', 'Stack', 'Heap', 'Heap'],
          ['Can resize', 'No', 'No', 'Yes'],
          ['Knows its size', 'No', 'No', 'Yes'],
          ['Frees itself', 'Yes', '**No** — you must `delete[]`', 'Yes'],
          ['Typical limit', '~1 MB total', 'Available RAM', 'Available RAM'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Large static arrays overflow the stack',
        body: 'The stack is only around 1 MB by default, so `int arr[1000000];` inside a function — about 4 MB — crashes immediately with a stack overflow, usually reported as a Runtime Error with no useful message. A `vector<int> arr(1000000);` is fine, because its storage is on the heap. Declaring a big array as a global also works, since globals are not on the stack.',
      },
      { kind: 'heading', text: 'Variable-length arrays are not standard C++' },
      {
        kind: 'code',
        code: `int n;
cin >> n;
int arr[n];        // compiles on GCC as an extension — NOT standard C++
vector<int> v(n);  // the portable, correct way`,
      },
      {
        kind: 'text',
        body: 'GCC accepts `int arr[n]` as a non-standard extension, which is why it works on LeetCode and then fails in MSVC or a stricter build. Use `vector` and the question never arises.',
      },
      { kind: 'heading', text: 'How vector grows' },
      {
        kind: 'text',
        body: 'A vector tracks two numbers: **size** (elements in use) and **capacity** (slots allocated). When `push_back` runs out of capacity, it allocates a larger block — typically double — copies everything over, and frees the old one.',
      },
      {
        kind: 'code',
        code: `vector<int> v;
v.size();        // 0
v.capacity();    // 0

v.push_back(1);  // size 1, capacity 1
v.push_back(2);  // size 2, capacity 2
v.push_back(3);  // size 3, capacity 4   ← reallocated
v.push_back(4);  // size 4, capacity 4

v.reserve(100);  // capacity 100, size still 4 — no more reallocation for a while`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Reallocation invalidates pointers and iterators',
        body: 'After a `push_back` that triggers a resize, any pointer, reference or iterator into the old storage points at freed memory. This is why you must never `push_back` to a vector you are currently range-looping over. If you need stable references while growing, use `deque` or `list` instead.',
      },
      {
        kind: 'text',
        body: 'For the 90-day plan the practical rule is simple: use `vector` for everything. Reach for `new[]`/`delete[]` only when a problem explicitly asks you to implement memory management yourself.',
      },
    ],
    keyTakeaways: [
      'Static arrays are stack-allocated and size-fixed at compile time.',
      'A large array on the stack (≳1 MB) crashes — use `vector` or a global.',
      '`int arr[n]` with a runtime `n` is a GCC extension, not standard C++.',
      'A `push_back` that reallocates invalidates all existing iterators and pointers.',
    ],
    practice: {
      prompt: 'Print `size()` and `capacity()` after each of ten `push_back` calls and watch the doubling. Then declare `int arr[10000000];` inside `main` and observe the crash, and confirm `vector<int> v(10000000);` works fine. The stack-versus-heap distinction becomes concrete very quickly this way.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-5.4',
    language: 'cpp',
    summary: 'Use std::string as the safe, self-managing text type it is.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: '`std::string` is essentially a `vector<char>` with text-specific extras. It manages its own memory, knows its own length, and grows as needed.',
      },
      {
        kind: 'code',
        caption: 'Creating and inspecting',
        code: `#include <string>

string s = "hello";
string t(5, 'x');            // "xxxxx"
string empty;                // ""

s.length();      // 5   — same as size()
s.size();        // 5
s.empty();       // false
s[0];            // 'h'  — no bounds check
s.at(0);         // 'h'  — throws if out of range
s.front();       // 'h'
s.back();        // 'o'`,
      },
      {
        kind: 'code',
        caption: 'The operations you will actually use',
        code: `s += " world";                 // append — O(1) amortised
s.push_back('!');              // append one char
s.pop_back();                  // remove last char

s.substr(1, 3);                // "ell"  — from index 1, length 3
s.substr(2);                   // "llo"  — from index 2 to the end

s.find("ll");                  // 2, or string::npos if absent
s.rfind('l');                  // last occurrence

s.insert(0, "say ");
s.erase(0, 4);                 // remove 4 chars from index 0
s.replace(0, 5, "HELLO");

reverse(s.begin(), s.end());   // from <algorithm>
sort(s.begin(), s.end());      // strings sort like any container`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'find returns npos, not -1',
        body: '`s.find("x")` returns `string::npos` when there is no match — an *unsigned* value equal to the largest possible size_t. Comparing it against `-1` appears to work by accident on some compilers and fails on others. Always write `if (s.find("x") != string::npos)`.',
      },
      { kind: 'heading', text: 'Strings compare and concatenate naturally' },
      {
        kind: 'code',
        code: `string a = "apple", b = "banana";

a == b;           // false — compares contents
a < b;            // true  — lexicographic order
a + b;            // "applebanana"
a + "!";          // fine — string + literal

// But two literals cannot be added:
string c = "a" + "b";        // ERROR — both are const char*
string c = string("a") + "b";  // fine`,
      },
      {
        kind: 'code',
        caption: 'Converting to and from numbers',
        code: `string s = to_string(42);      // "42"
int n = stoi("42");            // 42
long long big = stoll("9999999999");
double d = stod("3.14");`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'A string is a container like any other',
        body: 'Everything from `<algorithm>` works on it: `sort`, `reverse`, `count`, `find`. `sort(s.begin(), s.end())` sorting a string\'s characters is the standard way to build an anagram key. Range-based loops work too: `for (char c : s)`.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'length() is unsigned',
        body: 'Like `vector::size()`, `s.length()` returns an unsigned type, so `s.length() - 1` on an empty string wraps to an enormous number rather than −1. Cast to `int` before subtracting: `(int)s.length() - 1`.',
      },
    ],
    keyTakeaways: [
      '`std::string` manages its own memory and knows its own length.',
      '`find` returns `string::npos`, never −1 — compare against `npos`.',
      '`substr(pos, len)` takes a **length**, not an end index.',
      'Strings work with `<algorithm>`: `sort`, `reverse`, and range-based `for`.',
    ],
    practice: {
      prompt: 'Take a sentence and print its length, its first and last characters, a substring, and the index of a word inside it — handling the not-found case with `npos`. Then reverse it and sort its characters. These calls make up most of what string problems need.',
      leetcode: { title: 'Valid Palindrome', slug: 'valid-palindrome' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-5.5',
    language: 'cpp',
    summary: 'Read C-style strings when you meet them, and know why you should not write them.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A C-style string is a raw `char` array ending in a **null terminator**, the character `\'\\0\'`. There is no stored length — every function that needs the length scans forward until it hits that terminator.',
      },
      {
        kind: 'code',
        code: `char s[] = "hi";        // actually 3 chars: 'h', 'i', '\\0'
const char* p = "hi";   // pointer to a string literal

// Length is computed by scanning — O(n), not O(1)
strlen(s);              // 2`,
      },
      {
        kind: 'table',
        headers: ['', 'C-style `char*`', '`std::string`'],
        rows: [
          ['Knows its length', 'No — `strlen` scans, O(n)', 'Yes — `size()` is O(1)'],
          ['Memory', 'You manage it', 'Managed automatically'],
          ['Can grow', 'No', 'Yes'],
          ['Compare', '`strcmp(a, b) == 0`', '`a == b`'],
          ['Concatenate', '`strcat` — risks overflow', '`a + b`'],
          ['Bounds safety', 'None', '`at()` throws'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: '== on char* compares addresses, not text',
        body: 'Writing `if (p == q)` for two `const char*` asks whether they point at the *same memory*, not whether the text matches. It may appear to work when the compiler happens to share identical literals, then fail on runtime-built strings. Use `strcmp(p, q) == 0`, or just use `std::string`, where `==` does what you expect.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Forgetting room for the terminator',
        body: '`char s[5] = "hello";` does not fit — five letters plus `\'\\0\'` needs six bytes. Writing past the end corrupts adjacent memory, and the crash usually happens somewhere unrelated later. This whole family of bugs is the historical source of a large share of security vulnerabilities, and it is precisely what `std::string` eliminates.',
      },
      { kind: 'heading', text: 'Converting between the two' },
      {
        kind: 'code',
        code: `string s = "hello";
const char* p = s.c_str();     // string → C-string (read-only, borrowed)

const char* raw = "world";
string t = raw;                // C-string → string (copies)`,
      },
      {
        kind: 'text',
        body: '`c_str()` is needed for older C APIs that only accept `const char*`. The pointer it returns is owned by the string — if the string is modified or destroyed, the pointer dangles.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'When this actually comes up',
        body: 'On LeetCode, essentially never — signatures use `string`. It matters for reading legacy code, for interview questions about how strings are represented, and for understanding why `strlen` in a loop condition is a hidden O(n²): `for (int i = 0; i < strlen(s); i++)` rescans the entire string on every iteration.',
      },
      {
        kind: 'code',
        caption: 'The classic strlen-in-a-loop mistake',
        code: `// O(n^2) — strlen runs on every iteration
for (int i = 0; i < strlen(s); i++) { ... }

// O(n) — compute it once
int n = strlen(s);
for (int i = 0; i < n; i++) { ... }

// Or use std::string, where size() is O(1) and this is a non-issue
for (int i = 0; i < s.size(); i++) { ... }`,
      },
    ],
    keyTakeaways: [
      'A C-string is a `char` array terminated by `\'\\0\'` with no stored length.',
      '`==` on `char*` compares pointers; use `strcmp`, or use `std::string`.',
      'You must allocate one extra byte for the terminator.',
      '`strlen` is O(n) — calling it in a loop condition makes the loop O(n²).',
    ],
    practice: {
      prompt: 'Compare two identical `const char*` values with `==` and then with `strcmp`, and note that the results can disagree. Then time a `strlen`-in-the-condition loop against one that caches the length on a long string — the quadratic blow-up is dramatic and memorable.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-5.6',
    language: 'cpp',
    summary: 'Walk and modify arrays and strings without falling off either end.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Traversal — visiting every element once — is the single most common thing you will do to an array or string. C++ gives you two ways, and choosing between them is easy once you state the question: **do I need to know where I am?** If yes, use an index loop. If you only need the values, use range-based `for` and remove a whole class of bug.',
      },
      {
        kind: 'code',
        caption: 'The four ways to traverse',
        code: `vector<int> v = {1, 2, 3, 4};

// 1. Index — when you need i
for (int i = 0; i < v.size(); i++) cout << v[i];

// 2. Range-based, by value — read-only, copies each element
for (int x : v) cout << x;

// 3. Range-based, by reference — modifies the container
for (int& x : v) x *= 2;

// 4. Range-based, by const reference — read-only, no copy
for (const int& x : v) cout << x;`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Choosing between them',
        body: 'Use the index form when you need `i` itself — for comparing neighbours, or building a result at matching positions. Otherwise use range-based: it cannot go out of bounds. Add `&` when modifying, `const&` when the elements are expensive to copy (strings, vectors, structs).',
      },
      { kind: 'heading', text: 'Modifying while traversing' },
      {
        kind: 'code',
        code: `// Modifying VALUES is fine
for (int& x : v) x *= 2;
for (char& c : s) c = toupper(c);

// Changing the SIZE while looping is not
for (int x : v) {
    if (x == 2) v.push_back(99);      // UNDEFINED BEHAVIOUR
}`,
      },
      {
        kind: 'text',
        body: 'Changing values in place is safe. Adding or removing elements during a range-based loop may reallocate the storage, leaving the loop walking freed memory. Build a separate result container instead.',
      },
      { kind: 'heading', text: 'Erasing safely' },
      {
        kind: 'code',
        caption: 'Removing every element equal to a value',
        code: `// WRONG — erase invalidates the iterator, and skips elements
for (int i = 0; i < v.size(); i++)
    if (v[i] == target) v.erase(v.begin() + i);

// RIGHT — the erase-remove idiom, O(n) total
v.erase(remove(v.begin(), v.end(), target), v.end());

// Or build a new vector — often the clearest option
vector<int> result;
for (int x : v) if (x != target) result.push_back(x);`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Erasing inside an index loop skips elements',
        body: 'When you erase index `i`, everything shifts left — so the element that moves into slot `i` is never examined, because the loop immediately advances to `i + 1`. Two adjacent matches leave the second one behind. If you must erase in a loop, do not increment `i` after an erase.',
      },
      { kind: 'heading', text: 'Two-pointer traversal' },
      {
        kind: 'code',
        code: `// From both ends inward
int left = 0, right = v.size() - 1;
while (left < right) {
    swap(v[left], v[right]);
    left++;
    right--;
}

// Reading and writing at different speeds — in-place filtering
int write = 0;
for (int read = 0; read < v.size(); read++) {
    if (v[read] != 0) v[write++] = v[read];
}
// everything from index 'write' onward is now leftover`,
      },
      {
        kind: 'text',
        body: 'That second pattern — a slow write pointer trailing a fast read pointer — is how in-place removal problems are solved in O(n) with no extra space. It appears in Remove Duplicates, Move Zeroes and Remove Element.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'The backward loop, one more time',
        body: '`for (int i = v.size() - 1; i >= 0; i--)` breaks on an empty container because `size()` is unsigned and `0 - 1` wraps to a huge number. Write `(int)v.size() - 1`. It only shows up on empty input, which is exactly what hidden test cases check.',
      },
    ],
    keyTakeaways: [
      'Range-based `for` cannot go out of bounds — prefer it unless you need the index.',
      'Modifying values while looping is safe; changing the size is not.',
      'Use the erase-remove idiom, not `erase` inside an index loop.',
      'A slow write pointer trailing a fast read pointer filters in place in O(n).',
    ],
    practice: {
      prompt: 'Write in-place removal of all zeros from a vector using the read/write two-pointer pattern, then try the naive `erase`-in-a-loop version on `{0, 0, 1}` and watch it leave a zero behind. That failure explains exactly why the two-pointer form exists.',
      leetcode: { title: 'Move Zeroes', slug: 'move-zeroes' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-5.7',
    language: 'cpp',
    summary: 'Extract parts of a string and understand what substring work really costs.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A substring is a slice of a string, and you will take them constantly — checking prefixes, splitting words, testing palindromes. `substr` has an interface worth pinning down: it takes a **start position and a length**, not two positions, which is different from almost every other language you may know.',
      },
      {
        kind: 'code',
        caption: 'substr takes a start and a LENGTH',
        code: `string s = "programming";

s.substr(0, 3);      // "pro"    — from index 0, 3 characters
s.substr(3, 4);      // "gram"
s.substr(7);         // "ming"   — from index 7 to the end
s.substr(0);         // whole string`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'The second argument is a length, not an end index',
        body: 'This is the number one substring bug for people coming from Python or Java, where slicing uses an end index. In C++, `s.substr(2, 5)` gives five characters starting at index 2 — not characters 2 through 5. To go from index `i` to index `j` inclusive, the length is `j - i + 1`.',
      },
      {
        kind: 'code',
        caption: 'Converting between the two mental models',
        code: `// Characters from index i to index j, inclusive:
s.substr(i, j - i + 1);

// Characters from index i up to (but not including) j:
s.substr(i, j - i);`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'A start position past the end throws',
        body: '`s.substr(pos)` with `pos > s.size()` throws `out_of_range`, which on LeetCode is a Runtime Error. A *length* running past the end is fine — it silently stops at the end. So the start needs guarding, the length does not.',
      },
      { kind: 'heading', text: 'substr copies — and that has a cost' },
      {
        kind: 'text',
        body: 'Every `substr` call allocates a new string and copies the characters. Inside a loop that is easy to miss.',
      },
      {
        kind: 'code',
        caption: 'The hidden O(n³)',
        code: `// Generating every substring: O(n^2) substrings, each costing O(n) to copy
for (int i = 0; i < n; i++)
    for (int j = i; j < n; j++)
        string sub = s.substr(i, j - i + 1);      // O(n) copy each time

// Often you do not need the copy — work with indices instead:
for (int i = 0; i < n; i++)
    for (int j = i; j < n; j++)
        // examine s[i..j] directly, no allocation`,
      },
      {
        kind: 'text',
        body: 'When a solution "looks O(n²)" but times out, an inner `substr` is a common culprit. Prefer carrying `(start, end)` indices and only materialising a string when you actually need to store or return it.',
      },
      { kind: 'heading', text: 'Finding and splitting' },
      {
        kind: 'code',
        code: `string s = "hello world hello";

s.find("hello");        // 0
s.find("hello", 1);     // 12  — start searching from index 1
s.rfind("hello");       // 12  — last occurrence
s.find("xyz");          // string::npos

// Splitting on a delimiter
vector<string> parts;
size_t start = 0, pos;
while ((pos = s.find(' ', start)) != string::npos) {
    parts.push_back(s.substr(start, pos - start));
    start = pos + 1;
}
parts.push_back(s.substr(start));      // the final piece`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'stringstream splits more readably',
        body: 'For whitespace-delimited input, `<sstream>` is much cleaner: `stringstream ss(s); string word; while (ss >> word) parts.push_back(word);`. It handles multiple consecutive spaces automatically, which the manual `find` loop above does not.',
      },
    ],
    keyTakeaways: [
      '`substr(pos, len)` — the second argument is a length, not an end index.',
      'For indices `i` to `j` inclusive, the length is `j - i + 1`.',
      'A start beyond the end throws; an over-long length is silently clamped.',
      '`substr` copies — prefer index pairs inside loops to avoid a hidden O(n) factor.',
    ],
    practice: {
      prompt: 'Print every substring of "abc" using nested loops and `substr`, checking the count is 6. Then split a sentence on spaces both with the manual `find` loop and with `stringstream`, and see how the two handle a double space differently.',
      leetcode: { title: 'Longest Common Prefix', slug: 'longest-common-prefix' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-5.8',
    language: 'cpp',
    summary: 'Check palindromes in O(1) space, and handle the filtering variants correctly.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A palindrome reads the same forwards and backwards. The naive check — reverse the string and compare — works but allocates a whole second string. Two pointers do it in place.',
      },
      {
        kind: 'code',
        caption: 'The two-pointer check',
        code: `bool isPalindrome(const string& s) {
    int left = 0, right = s.size() - 1;
    while (left < right) {
        if (s[left] != s[right]) return false;
        left++;
        right--;
    }
    return true;
}
// O(n) time, O(1) space`,
      },
      {
        kind: 'text',
        body: 'The loop condition is `left < right`, not `<=`. When they meet in the middle of an odd-length string, that single character is trivially its own mirror and needs no check — and comparing it to itself would be wasted work.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Why not just reverse and compare?',
        body: '`string r = s; reverse(r.begin(), r.end()); return s == r;` is correct and readable, but uses O(n) extra space. In an interview, mention it as the obvious approach, then give the two-pointer version as the improvement — showing that progression is exactly what interviewers are looking for.',
      },
      { kind: 'heading', text: 'The variant LeetCode actually asks' },
      {
        kind: 'text',
        body: 'Real problems add filtering: ignore non-alphanumeric characters and case. The fix is to advance the pointers past anything that should be skipped, before comparing.',
      },
      {
        kind: 'code',
        caption: 'Valid Palindrome, in full',
        code: `bool isPalindrome(string s) {
    int left = 0, right = s.size() - 1;

    while (left < right) {
        // skip anything that is not a letter or digit
        while (left < right && !isalnum(s[left]))  left++;
        while (left < right && !isalnum(s[right])) right--;

        if (tolower(s[left]) != tolower(s[right])) return false;
        left++;
        right--;
    }
    return true;
}`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'The inner skip loops need the left < right guard too',
        body: 'Without it, a string of only punctuation walks `left` straight past `right` and off the end of the string. `",."` is exactly the hidden test case that catches this. Any inner loop that advances a pointer needs the same bound as the outer one.',
      },
      {
        kind: 'table',
        headers: ['Helper (from `<cctype>`)', 'Returns true for'],
        rows: [
          ['`isalnum(c)`', 'Letters and digits'],
          ['`isalpha(c)`', 'Letters only'],
          ['`isdigit(c)`', 'Digits only'],
          ['`tolower(c)` / `toupper(c)`', 'Converts case (returns an `int`)'],
        ],
      },
      { kind: 'heading', text: 'Palindromic substrings: expand around centre' },
      {
        kind: 'code',
        code: `// Grow outward from a centre while the characters still match
void expand(const string& s, int left, int right, int& bestLen, int& bestStart) {
    while (left >= 0 && right < s.size() && s[left] == s[right]) {
        if (right - left + 1 > bestLen) {
            bestLen = right - left + 1;
            bestStart = left;
        }
        left--;
        right++;
    }
}

// Called with two centre types — one for odd lengths, one for even:
for (int i = 0; i < s.size(); i++) {
    expand(s, i, i, bestLen, bestStart);        // odd:  centre is one char
    expand(s, i, i + 1, bestLen, bestStart);    // even: centre is a gap
}`,
      },
      {
        kind: 'text',
        body: 'Two centre types is the part people forget. An even-length palindrome like `"abba"` has no middle character — its centre is the gap between the two `b`s, which is why the second call starts with `right = i + 1`.',
      },
    ],
    keyTakeaways: [
      'Two pointers check a palindrome in O(n) time and O(1) space.',
      'Use `left < right`; the middle character of an odd-length string needs no check.',
      'Inner skip loops must also be bounded by `left < right`.',
      'Expand-around-centre needs both odd and even centres — `(i, i)` and `(i, i+1)`.',
    ],
    practice: {
      prompt: 'Write the filtered palindrome check and test it on `"A man, a plan, a canal: Panama"`, on `",."`, and on the empty string. Then implement longest-palindromic-substring with expand-around-centre and verify it handles `"abba"` — the even-centre case is the one that separates a working solution from an almost-working one.',
      leetcode: { title: 'Valid Palindrome', slug: 'valid-palindrome' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-5.9',
    language: 'cpp',
    summary: 'Count occurrences in O(n) — the technique behind a huge share of string problems.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Counting how many times each element appears turns many O(n²) problems into O(n). There are two implementations, and picking the right one matters.',
      },
      { kind: 'heading', text: '1. Fixed array — for lowercase letters' },
      {
        kind: 'code',
        code: `int freq[26] = {0};                  // must initialise!

for (char c : s) freq[c - 'a']++;    // 'a'→0, 'b'→1, ... 'z'→25

// Read it back
for (int i = 0; i < 26; i++)
    if (freq[i] > 0)
        cout << (char)('a' + i) << ": " << freq[i] << "\\n";`,
      },
      {
        kind: 'text',
        body: 'When the alphabet is known and small, this is the fastest option — contiguous memory, no hashing, no allocation. `c - \'a\'` maps each letter to an index.',
      },
      {
        kind: 'table',
        headers: ['Character set', 'Array size', 'Index expression'],
        rows: [
          ['Lowercase only', '26', "`c - 'a'`"],
          ['Upper and lower', '52', "`c <= 'Z' ? c - 'A' : c - 'a' + 26`"],
          ['Any ASCII', '128 (or 256)', '`c`'],
          ['Digits only', '10', "`c - '0'`"],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'int freq[26]; without = {0} holds garbage',
        body: 'A local array is not zero-initialised. Counting into uninitialised memory gives wildly wrong answers that vary between runs — and sometimes appear correct locally while failing on the judge. Always write `int freq[26] = {0};`.',
      },
      { kind: 'heading', text: '2. Hash map — for anything else' },
      {
        kind: 'code',
        code: `#include <unordered_map>

unordered_map<char, int> freq;
for (char c : s) freq[c]++;          // missing keys default to 0 automatically

unordered_map<int, int> counts;
for (int x : nums) counts[x]++;      // works for any value range

// Iterate
for (auto& [key, count] : freq)      // structured binding, C++17
    cout << key << ": " << count << "\\n";`,
      },
      {
        kind: 'text',
        body: 'Use a map when the keys are unbounded — arbitrary integers, words, or Unicode. Accessing a missing key with `[]` inserts it with value 0, which is exactly what makes `freq[c]++` work without a prior check.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: '[] inserts; use count() or find() to merely check',
        body: '`if (freq[x] > 0)` silently *creates* an entry for `x` when it is absent, which grows the map and can corrupt a size-based check. To test membership without inserting, use `if (freq.count(x))` or `if (freq.find(x) != freq.end())`.',
      },
      { kind: 'heading', text: 'The patterns this unlocks' },
      {
        kind: 'code',
        caption: 'Anagram check — O(n) with one array',
        code: `bool isAnagram(string s, string t) {
    if (s.size() != t.size()) return false;

    int freq[26] = {0};
    for (char c : s) freq[c - 'a']++;
    for (char c : t) freq[c - 'a']--;      // cancel out

    for (int i = 0; i < 26; i++)
        if (freq[i] != 0) return false;
    return true;
}`,
      },
      {
        kind: 'text',
        body: 'Increment for one string, decrement for the other. If they are anagrams, everything cancels to zero. One array, one pass each, no sorting.',
      },
      {
        kind: 'code',
        caption: 'First non-repeating character',
        code: `int firstUniqChar(string s) {
    int freq[26] = {0};
    for (char c : s) freq[c - 'a']++;        // pass 1: count
    for (int i = 0; i < s.size(); i++)       // pass 2: find the first with count 1
        if (freq[s[i] - 'a'] == 1) return i;
    return -1;
}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Two passes is usually the shape',
        body: 'Count everything first, then walk the data again using the counts. Trying to do both in one pass is a common instinct and usually wrong, because you cannot know a character is unique until you have seen the whole string. Two O(n) passes is still O(n).',
      },
    ],
    keyTakeaways: [
      'Fixed `int freq[26] = {0}` for lowercase letters; a hash map for unbounded keys.',
      'Always zero-initialise a local frequency array.',
      '`map[key]++` works because `[]` default-constructs missing keys to 0.',
      'Use `count()` to test membership — `[]` inserts an entry as a side effect.',
    ],
    practice: {
      prompt: 'Write the anagram check with the increment/decrement trick, then first-non-repeating-character with two passes. Then omit the `= {0}` on the frequency array and run it a few times to see the garbage. Frequency counting shows up in more problems than almost any other technique.',
      leetcode: { title: 'Valid Anagram', slug: 'valid-anagram' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-5.10',
    language: 'cpp',
    summary: 'Build strings efficiently, and avoid the quadratic trap of repeated concatenation.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Building a string piece by piece is so common that it is worth knowing which forms are cheap and which are not. `+=` on a `std::string` is genuinely efficient because the string grows its buffer — but building a **new** string on every iteration is quadratic, and that distinction is what this lesson is about.',
      },
      {
        kind: 'code',
        caption: 'The ways to join strings',
        code: `string a = "hello", b = "world";

string c = a + " " + b;      // "hello world"
a += b;                      // append in place — preferred
a.append(b);                 // same as +=
a.push_back('!');            // append a single char`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Prefer += over s = s + x',
        body: '`s += x` appends into the existing buffer when there is spare capacity. `s = s + x` builds a brand-new temporary string containing everything, then assigns it back. Same result, very different cost — and the difference compounds inside a loop.',
      },
      { kind: 'heading', text: 'The quadratic trap' },
      {
        kind: 'code',
        code: `// O(n^2) — each concatenation copies everything accumulated so far
string result = "";
for (int i = 0; i < n; i++) {
    result = result + to_string(i);
}

// O(n) amortised — append in place
string result;
result.reserve(n * 2);            // optional, avoids reallocation entirely
for (int i = 0; i < n; i++) {
    result += to_string(i);
}`,
      },
      {
        kind: 'text',
        body: 'With `result = result + x`, building a string of length n copies 1 + 2 + 3 + … + n characters — that is n²/2 operations. For n = 100,000 that is five billion character copies, and a guaranteed Time Limit Exceeded on a solution whose logic is perfectly correct.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'This is Java\'s StringBuilder lesson, in C++ form',
        body: 'Java programmers are taught to use `StringBuilder` because Java strings are immutable. C++ `std::string` is mutable, so `+=` already gives you the efficient path — you just have to use it rather than `s = s + x`. There is no separate builder class to reach for.',
      },
      { kind: 'heading', text: 'stringstream for mixed content' },
      {
        kind: 'code',
        code: `#include <sstream>

stringstream ss;
ss << "Total: " << 42 << " items, avg " << 3.14;
string result = ss.str();      // "Total: 42 items, avg 3.14"`,
      },
      {
        kind: 'text',
        body: 'Useful when you are interleaving numbers and text, since it applies the same formatting rules as `cout`. For pure string appending, `+=` is faster and simpler.',
      },
      {
        kind: 'code',
        caption: 'Joining with a separator',
        code: `vector<string> words = {"a", "b", "c"};

string result;
for (int i = 0; i < words.size(); i++) {
    if (i > 0) result += ",";       // separator before all but the first
    result += words[i];
}
// "a,b,c"`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Two string literals cannot be added',
        body: '`string s = "a" + "b";` is a compile error, because both operands are `const char*` and pointers do not add. At least one side must be a `std::string`: `string s = string("a") + "b";`, or in C++14 and later, `"a"s + "b"` with the `s` literal suffix.',
      },
      {
        kind: 'text',
        body: 'One more useful habit: when you know roughly how long the result will be, call `reserve()` first. It is a single line that eliminates every intermediate reallocation.',
      },
    ],
    keyTakeaways: [
      '`s += x` appends in place; `s = s + x` rebuilds the whole string each time.',
      'Repeated `s = s + x` in a loop is O(n²) and a common cause of TLE.',
      '`reserve()` up front removes intermediate reallocations.',
      'Two string literals cannot be added — one side must be a `std::string`.',
    ],
    practice: {
      prompt: 'Build a string of 100,000 characters both ways — with `result = result + c` and with `result += c` — and time them. The gap is large enough to be unmistakable, and it is the clearest demonstration of why an "obviously linear" loop can still time out.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-5.11',
    language: 'cpp',
    summary: 'Recognise the small set of patterns that nearly every string problem reduces to.',
    readMinutes: 6,
    blocks: [
      {
        kind: 'text',
        body: 'String problems look varied but draw on a short list of techniques. Recognising which one applies is most of the work.',
      },
      { kind: 'heading', text: '1. Frequency counting' },
      {
        kind: 'code',
        code: `int freq[26] = {0};
for (char c : s) freq[c - 'a']++;`,
      },
      {
        kind: 'text',
        body: 'Anagrams, first unique character, character replacement, "can this be rearranged into…". Whenever *which* characters matter but their order does not, count them. **O(n)**.',
      },
      { kind: 'heading', text: '2. Two pointers' },
      {
        kind: 'code',
        code: `int left = 0, right = s.size() - 1;
while (left < right) { ... left++; right--; }`,
      },
      {
        kind: 'text',
        body: 'Palindromes, reversal, comparing from both ends. **O(n)** time, **O(1)** space.',
      },
      { kind: 'heading', text: '3. Sliding window' },
      {
        kind: 'code',
        caption: 'Longest substring without repeating characters',
        code: `int lengthOfLongestSubstring(string s) {
    unordered_map<char, int> lastSeen;
    int best = 0, start = 0;

    for (int i = 0; i < s.size(); i++) {
        // if we have seen this char inside the current window, jump past it
        if (lastSeen.count(s[i]) && lastSeen[s[i]] >= start)
            start = lastSeen[s[i]] + 1;

        lastSeen[s[i]] = i;
        best = max(best, i - start + 1);
    }
    return best;
}`,
      },
      {
        kind: 'text',
        body: 'Any "longest/shortest substring with property X" problem. The window grows on the right and its left edge jumps forward when the property breaks. **O(n)**.',
      },
      { kind: 'heading', text: '4. Sorting as a canonical form' },
      {
        kind: 'code',
        caption: 'Group anagrams',
        code: `unordered_map<string, vector<string>> groups;
for (const string& word : words) {
    string key = word;
    sort(key.begin(), key.end());       // "eat" and "tea" both become "aet"
    groups[key].push_back(word);
}`,
      },
      {
        kind: 'text',
        body: 'Sorting a string\'s characters produces a key that is identical for all anagrams. **O(n · k log k)** for n words of length k. A frequency-count key is O(n · k) if you need the extra speed.',
      },
      { kind: 'heading', text: '5. Building a result in place' },
      {
        kind: 'code',
        code: `string result;
result.reserve(s.size());
for (char c : s) {
    if (shouldKeep(c)) result += c;
}`,
      },
      { kind: 'heading', text: '6. Hash set for seen-before' },
      {
        kind: 'code',
        code: `unordered_set<char> seen;
for (char c : s) {
    if (seen.count(c)) { /* duplicate */ }
    seen.insert(c);
}`,
      },
      {
        kind: 'table',
        headers: ['Problem says…', 'Reach for'],
        rows: [
          ['"anagram", "rearrange", "permutation of"', 'Frequency count'],
          ['"palindrome", "reverse"', 'Two pointers'],
          ['"longest/shortest substring such that…"', 'Sliding window'],
          ['"group by", "same letters"', 'Sorted string as a map key'],
          ['"first unique", "duplicate"', 'Frequency count or hash set'],
          ['"prefix", "starts with"', 'Trie, or direct character comparison'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Ask two questions before you code',
        body: 'First: does order matter? If not, counting probably beats scanning. Second: is the answer a contiguous piece of the string? If yes, a sliding window is likely. Those two questions route you to the right technique for the large majority of string problems.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'The edge cases that are always tested',
        body: 'Empty string, single character, all characters identical, and — for palindrome and anagram problems — strings of different lengths. Check them before submitting. `s.size() - 1` on an empty string is the specific thing that breaks, because the unsigned subtraction wraps.',
      },
    ],
    keyTakeaways: [
      'Order irrelevant → frequency count. Contiguous answer → sliding window.',
      'Sorting a string\'s characters gives a canonical key shared by all anagrams.',
      'Build results with `+=` into a reserved string, never `s = s + c`.',
      'Always test empty, single-character, and all-same-character inputs.',
    ],
    practice: {
      prompt: 'Solve Longest Substring Without Repeating Characters with a sliding window, then Group Anagrams with a sorted key. Between them they exercise four of the six patterns above, and they are among the most frequently asked string questions in interviews.',
      leetcode: { title: 'Longest Substring Without Repeating Characters', slug: 'longest-substring-without-repeating-characters' },
    },
  },
];
