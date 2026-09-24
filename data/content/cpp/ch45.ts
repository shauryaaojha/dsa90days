import type { Lesson } from '../types';

/**
 * Chapter 45 — Idioms and Pitfalls (C++).
 * Twelve ways C++ lets a wrong program compile, run, and pass the sample
 * tests. Each lesson shows the mistake, the symptom on the judge, and the
 * habit that prevents it.
 */
export const ch45: Lesson[] = [
  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-45.1',
    language: 'cpp',
    summary: 'Initialise every variable at the point of declaration, because C++ does not do it for you.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'A local variable declared without a value holds whatever bytes were in that memory before: sometimes 0, sometimes a number from a previous function call, sometimes different on each run. Reading it is **undefined behaviour**. The program may work on your machine, pass the samples, and fail on the judge, and the failure will not be reproducible.',
      },
      {
        kind: 'code',
        caption: 'Garbage in, garbage out',
        code: `int total;                  // no value: garbage
for (int x : a) total += x; // adds to garbage
cout << total;              // wrong, unpredictably

int best;                   // garbage; might happen to be small and negative
for (int x : a) best = max(best, x);   // usually "works" locally, fails on the judge`,
      },
      {
        kind: 'text',
        body: 'The fix is a value at the declaration, every time: `int total = 0;`, `int best = INT_MIN;`, `bool found = false;`. Containers are different: `vector<int> v(n)` fills with zeros, `vector<int> v` is empty, and a `std::string` starts empty. Only plain scalars (`int`, `double`, `bool`, `char`, pointers) and plain arrays are left uninitialised.',
      },
      {
        kind: 'table',
        headers: ['Declaration', 'Initial value'],
        rows: [
          ['`int x;` (local)', 'Garbage'],
          ['`int x = 0;` or `int x{};`', '0'],
          ['`int arr[100];` (local)', 'Garbage in every slot'],
          ['`int arr[100] = {};`', 'All zeros'],
          ['`int arr[100];` (global)', 'All zeros: globals are zero-initialised'],
          ['`vector<int> v(n);`', 'n zeros'],
          ['`bool b;` (local)', 'Garbage, possibly neither 0 nor 1'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Let the compiler catch it',
        body: 'Compile locally with `-Wall -Wextra`. The warning `\'total\' may be used uninitialized` is precisely this bug, found before you run. Treat every warning from those two flags as an error until you know why it is there.',
      },
    ],
    keyTakeaways: [
      'Local scalars and arrays start with garbage; reading them is undefined behaviour.',
      'Write `= 0`, `= INT_MIN`, `= false`, `= {}` at every declaration.',
      'Compile with `-Wall -Wextra` and fix every uninitialised warning.',
    ],
    practice: {
      prompt: 'Compile a program that reads an uninitialised `int` and prints it, run it five times, and note whether the value changes. Then compile with `-Wall` and read the warning. Then fix the two examples above and explain why `best = INT_MIN` is correct but `best = 0` is not.',
    },
  },
  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-45.2',
    language: 'cpp',
    summary: 'Predict when arithmetic happens in int and overflows before it reaches a long long.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'The type of an arithmetic expression is decided by its operands, not by where the result is stored. `long long x = a * b;` with `int a` and `int b` multiplies in `int`, overflows if the product exceeds about 2.1 × 10⁹, and only then converts the already-wrong result to `long long`. Signed overflow is undefined behaviour, so the compiler is allowed to do anything, including optimise your bounds check away.',
      },
      {
        kind: 'code',
        caption: 'Overflow before the wide variable is reached',
        code: `int a = 100000, b = 100000;
long long bad  = a * b;          // int * int overflows: garbage (often -727379968)
long long good = (long long)a * b; // cast one operand first: 10000000000

int n = 2000000000;
int mid = (n + n) / 2;           // n + n overflows in int
long long ok = ((long long)n + n) / 2;`,
        output: '-727379968\n10000000000',
      },
      {
        kind: 'table',
        headers: ['Rule', 'Consequence'],
        rows: [
          ['Both operands `int` → result `int`', '`a * b`, `a + b` overflow at 2.1 × 10⁹ even if assigned to `long long`'],
          ['One operand `long long` → result `long long`', 'Cast one operand: `(long long)a * b` or `1LL * a * b`'],
          ['`int` literals are `int`', '`1 << 40` is undefined; write `1LL << 40`'],
          ['`double` with `int` → `double`', '`a / 2.0` divides as decimals; `a / 2` truncates'],
          ['`unsigned` with `int` → `unsigned`', 'The signed value is converted; -1 becomes huge (next lesson)'],
        ],
      },
      { kind: 'heading', text: 'The `1LL` idiom' },
      {
        kind: 'text',
        body: '`1LL * a * b` multiplies left to right: `1LL * a` is `long long`, then `* b` stays `long long`. It is the shortest way to promote a whole expression and is used everywhere in competitive code. For a sum inside a loop, make the accumulator `long long` and the additions widen automatically: `long long total = 0; total += a[i];` is safe because `total + a[i]` is `long long`.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Reading the constraints for products',
        body: 'Values up to 10⁵ and a product of two of them: up to 10¹⁰, needs `long long`. Values up to 10⁹ and a sum of 10⁵ of them: 10¹⁴, needs `long long`. Values up to 10⁹ and a product of two: 10¹⁸, fits `long long` barely; a product of three does not fit anything and must be done modulo something. Do this arithmetic before choosing types, every problem.',
      },
    ],
    keyTakeaways: [
      'Arithmetic type comes from the operands; the target variable does not widen it.',
      'Cast one operand (`1LL * a * b`) to compute in `long long`.',
      'Estimate the largest intermediate value from the constraints, not only the answer.',
    ],
    practice: {
      prompt: 'Compute 10⁵ × 10⁵ three ways: `int * int` into `int`, `int * int` into `long long`, and `1LL * int * int`. Print all three. Then write `mid = lo + (hi - lo) / 2` and explain why it cannot overflow when `lo` and `hi` are valid non-negative indices.',
    },
  },
  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-45.3',
    language: 'cpp',
    summary: 'Compare floating-point values with a tolerance and avoid float where integers will do.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: '`double` has about 16 significant digits and represents most decimals approximately, so `0.1 + 0.2 == 0.3` is false. The C++-specific traps are `float` (only 7 digits: never use it), the silent integer division inside a formula, and a `sqrt` that is off by one when you convert it to an integer.',
      },
      {
        kind: 'code',
        caption: 'Comparisons and conversions',
        code: `double a = 0.1 + 0.2;
cout << (a == 0.3) << "\\n";               // 0
const double EPS = 1e-9;
cout << (fabs(a - 0.3) < EPS) << "\\n";     // 1

int n = 7;
double half = n / 2;        // 3, not 3.5: integer division happened first
double right = n / 2.0;     // 3.5

long long big = 1000000000000000000LL;   // 1e18
long long r = sqrt(big);                 // may be 999999999, off by one
while (r * r > big) r--;                 // correct it
while ((r + 1) * (r + 1) <= big) r++;`,
        output: '0\n1',
      },
      {
        kind: 'table',
        headers: ['Need', 'Do this'],
        rows: [
          ['Equality of computed decimals', '`fabs(a - b) < 1e-9`'],
          ['Less-than with tolerance', '`a < b - 1e-9`'],
          ['Integer square root', '`sqrtl` then adjust with a while loop, or binary search'],
          ['Compare a/b with c/d', '`a * d < c * b` in `long long` (positive denominators)'],
          ['Print with fixed decimals', '`cout << fixed << setprecision(6) << x`'],
          ['Any float at all', '`double`, never `float`'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Printing doubles',
        body: 'Without `fixed`, `cout` prints 6 significant digits and switches to scientific notation for large values: 1234567.0 prints as `1.23457e+06`. Judges that compare text will mark that wrong. Always set `fixed << setprecision(k)` when a problem asks for a decimal answer.',
      },
    ],
    keyTakeaways: [
      'Compare doubles with a tolerance; never use `float`.',
      'Integer division inside a decimal formula truncates silently; make one operand `double`.',
      '`sqrt` on large integers can be off by one; adjust with a loop.',
    ],
    practice: {
      prompt: 'Print 0.1 + 0.2 with `setprecision(20)` to see the stored value. Then find an n ≤ 10¹⁸ where `(long long)sqrt(n)` squared exceeds n. Then compute the average of three ints correctly and print it with two decimals.',
    },
  },
  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-45.4',
    language: 'cpp',
    summary: 'Avoid vector<bool>, which is not a container of bools and breaks code that expects one.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: '`vector<bool>` is a special case in the standard library: to save memory it packs eight values into each byte, and as a result its elements are not real `bool` objects. You cannot take a reference to one, `auto x = v[i]` gives a proxy object rather than a `bool`, and it is slower than a byte-per-element container for the visited arrays and DP tables where you would use it.',
      },
      {
        kind: 'code',
        caption: 'Where it goes wrong',
        code: `vector<bool> vis(n, false);
bool& r = vis[0];            // error: cannot bind a bool& to the proxy
auto x = vis[0];             // x is a proxy, not a bool; changing vis changes x
for (auto& b : vis) b = true;  // error: no reference to a packed bit

// Use one of these instead:
vector<char> vis(n, 0);      // one byte per element; vis[i] is a real char
vector<int> vis(n, 0);       // fine too
bitset<100000> vis;          // fixed size known at compile time; fast bit operations`,
      },
      {
        kind: 'table',
        headers: ['Container', 'Element access', 'Memory', 'Use when'],
        rows: [
          ['`vector<char>`', 'Real reference', '1 byte each', 'Default choice for visited / seen'],
          ['`vector<int>`', 'Real reference', '4 bytes each', 'When you also need counts or colours'],
          ['`bitset<N>`', 'Proxy, but with fast `count`, `&`, `|`, `<<`', '1 bit each', 'Fixed N; subset and sieve tricks'],
          ['`vector<bool>`', 'Proxy', '1 bit each', 'Rarely; when memory is the only constraint'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The habit',
        body: 'Type `vector<char>` whenever your fingers want `vector<bool>`. Reading it, `if (vis[u])` works identically. Assigning `vis[u] = 1` works identically. Only the surprises are gone.',
      },
    ],
    keyTakeaways: [
      '`vector<bool>` stores packed bits and returns proxies, not `bool&`.',
      'Use `vector<char>` for visited flags; `bitset<N>` when N is fixed and you want bit operations.',
      'Reading code is unchanged; only the type name differs.',
    ],
    practice: {
      prompt: 'Write BFS with `vector<char> vis` and then try to change it to `vector<bool>` with a range-for that sets each element by reference; read the compiler error. Then implement the sieve of Eratosthenes with `bitset<1000001>` and count the primes below a million.',
    },
  },
  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-45.5',
    language: 'cpp',
    summary: 'Know which operations invalidate iterators and pointers into a container, and restructure loops that erase.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'An **iterator** is a position inside a container. Some operations rearrange the container’s memory, after which every iterator, pointer and reference into it is **invalid**: using one is undefined behaviour, which in practice means a crash, a skipped element, or a silently wrong value. The rules differ by container and are worth knowing for the three you use most.',
      },
      {
        kind: 'table',
        headers: ['Container', 'Operation', 'What becomes invalid'],
        rows: [
          ['`vector`', '`push_back` when capacity is exceeded', 'Everything: the whole array moved'],
          ['`vector`', '`erase(it)`', '`it` and everything after it'],
          ['`vector`', '`insert`', 'Everything at and after the insertion point; everything if reallocated'],
          ['`deque`', '`push_back` / `push_front`', 'All iterators, but references and pointers stay valid'],
          ['`map` / `set`', '`erase(it)`', 'Only `it`; all other iterators stay valid'],
          ['`unordered_map` / `unordered_set`', '`insert` that triggers a rehash', 'All iterators; references stay valid'],
          ['`list`', '`erase(it)`', 'Only `it`'],
        ],
      },
      {
        kind: 'code',
        caption: 'The erase-in-a-loop bug and its fixes',
        code: `// Bug: after erase, it is invalid; ++it is undefined
for (auto it = v.begin(); it != v.end(); ++it)
    if (*it % 2 == 0) v.erase(it);

// Fix 1: erase returns the next valid iterator
for (auto it = v.begin(); it != v.end(); )
    if (*it % 2 == 0) it = v.erase(it);
    else ++it;

// Fix 2 (preferred for vector): erase-remove idiom, one pass
v.erase(remove_if(v.begin(), v.end(), [](int x) { return x % 2 == 0; }), v.end());

// Same shape for map: erase while iterating
for (auto it = m.begin(); it != m.end(); )
    if (it->second == 0) it = m.erase(it);
    else ++it;`,
      },
      { kind: 'heading', text: 'The push_back-while-iterating bug' },
      {
        kind: 'text',
        body: 'Appending to a vector while range-for-looping over it is the same bug in disguise: the range-for holds an iterator, `push_back` may reallocate, and the next step reads freed memory. If you need to append during a loop, iterate by index up to the **original** size, or collect additions in a second vector and append them after.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Adjacency lists and references',
        body: '`for (int v : adj[u]) adj[v].push_back(...)` can invalidate the range you are iterating if `v == u`, or if `adj` itself is a vector of vectors and you push into `adj` (the outer one). The outer push is the common mistake when building a graph lazily. Build the whole graph first, then traverse.',
      },
    ],
    keyTakeaways: [
      '`vector::push_back` may move everything; `erase` invalidates from that point on.',
      'Erase in a loop with `it = v.erase(it)`, or use the erase-remove idiom.',
      'Never append to a container you are range-for-iterating.',
    ],
    practice: {
      prompt: 'Write the buggy erase loop, run it on [1,2,2,3,4,4,5] and observe that consecutive evens survive. Fix it both ways. Then write a loop that appends to a vector while iterating by index up to the original size, and explain why that is safe.',
    },
  },
  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-45.6',
    language: 'cpp',
    summary: 'Never keep a reference or pointer into a vector across a push_back.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'This is the previous lesson’s most common special case, and it deserves its own page because it looks so innocent. You take a reference to an element to avoid retyping a long expression, then the vector grows, then you use the reference. The vector may have moved to new memory; the reference points at the old, freed block.',
      },
      {
        kind: 'code',
        caption: 'A reference that goes stale',
        code: `vector<int> v = {1, 2, 3};
int& first = v[0];        // reference into v's current buffer
v.push_back(4);           // may reallocate: buffer moves
cout << first;            // undefined: reads the old buffer

// Same bug with a pointer, and with a vector of structs
vector<Node> nodes;
Node* p = &nodes[0];
nodes.push_back(Node{});  // p is now dangling
p->value = 5;             // undefined behaviour, often a silent no-op`,
      },
      {
        kind: 'text',
        body: 'The symptom is a value that "does not change" after you set it through the reference, or a crash far from the push_back. It is especially common when building a tree or graph as `vector<Node>` and holding `Node&` to a parent while pushing children.',
      },
      {
        kind: 'table',
        headers: ['Fix', 'When'],
        rows: [
          ['Use an index instead of a reference: `int i = 0; ... v[i]`', 'Always works; indices survive reallocation'],
          ['`v.reserve(n)` before any references', 'When the final size is known; no reallocation happens below capacity'],
          ['Re-take the reference after each push_back', 'Simple loops'],
          ['Use `deque`', 'Its `push_back` keeps references valid (but not iterators)'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Indices are the C++ way to name nodes',
        body: 'Competitive code stores trees and graphs as vectors indexed by node number precisely so that "a node" is an `int`, which can never dangle. `parent[u]`, `children[u]`, `val[u]`: every property is a separate vector indexed by the same `u`. Reach for this before `Node*`.',
      },
    ],
    keyTakeaways: [
      'A reference or pointer into a vector becomes invalid when the vector reallocates.',
      'Hold an index, not a reference, across any `push_back`.',
      '`reserve` up front removes the reallocation, if the size is known.',
    ],
    practice: {
      prompt: 'Reproduce the stale-reference bug with a vector that starts at capacity 1 and print the value read through the reference. Then fix it with an index. Then rewrite a `vector<Node*>`-based binary tree as parallel `vector<int> left, right, val` indexed by node id.',
    },
  },
  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-45.7',
    language: 'cpp',
    summary: 'Pass containers by reference to avoid copying them, and know when a copy is actually happening.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'C++ passes by value unless you say otherwise. A function parameter `vector<int> v` receives a **copy** of the caller’s vector: O(n) time and memory per call. In a recursive DFS called 10⁵ times, that is 10⁵ copies of the adjacency list and a certain Time Limit Exceeded. The same applies to `string`, `map`, and every other container.',
      },
      {
        kind: 'code',
        caption: 'Copy, reference, const reference',
        code: `int sum(vector<int> v);              // copies: O(n) per call
int sum(vector<int>& v);             // no copy; can modify the caller's vector
int sum(const vector<int>& v);       // no copy; promises not to modify (preferred for read-only)

void dfs(int u, vector<vector<int>>& adj, vector<char>& vis);   // reference: essential in recursion

// Copies you did not ask for:
for (auto row : grid) ...            // copies each row; write for (auto& row : grid)
for (pair<string, int> p : m) ...    // copies each pair; write for (auto& [k, v] : m)
auto v2 = v;                         // a copy (intended, but know it costs O(n))`,
      },
      {
        kind: 'table',
        headers: ['Parameter form', 'Cost', 'Can modify caller’s?', 'Use for'],
        rows: [
          ['`T v`', 'Copy', 'No (modifies the copy)', 'Small scalars: `int`, `double`, `char`, pointers'],
          ['`T& v`', 'None', 'Yes', 'In-place algorithms, output parameters'],
          ['`const T& v`', 'None', 'No', 'Read-only containers, strings, big structs'],
        ],
      },
      {
        kind: 'text',
        body: 'For scalars, pass by value: `int`, `long long`, `bool`, `char`, a pointer. A reference to an `int` is not cheaper than the `int` and makes the call harder to read. For anything that holds many elements, `const T&` is the default and `T&` when you intend to change it.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Global containers avoid the question',
        body: 'Contest code often declares `vector<int> adj[N]` and `bool vis[N]` at global scope and gives `dfs` only an `int u`. That sidesteps parameter passing entirely, and globals are zero-initialised. It is a legitimate style for single-file solutions; in a LeetCode class method, use member variables the same way.',
      },
    ],
    keyTakeaways: [
      'A container parameter without `&` is copied on every call.',
      'Use `const T&` for read-only, `T&` for in-place modification, plain `T` for scalars.',
      'Range-for with `auto` copies; write `auto&` or `const auto&`.',
    ],
    practice: {
      prompt: 'Write DFS on a graph of 10⁵ nodes passing the adjacency list by value, time it, then change to reference and time again. Then find every range-for in a solution you wrote and add `&` where the element is a container or a pair.',
    },
  },
  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-45.8',
    language: 'cpp',
    summary: 'Predict % on negative operands and write a modulo that always returns a non-negative result.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'In C++, integer division truncates towards zero and `%` is defined so that `(a / b) * b + a % b == a`. Together those mean the result of `%` takes the sign of the **left** operand: `-7 % 3` is -1, not 2. Any code that uses `%` to wrap an index or reduce a value modulo a prime is wrong the first time the left side goes negative.',
      },
      {
        kind: 'code',
        caption: 'Signs, and the safe form',
        code: `cout << (7 % 3) << " " << (-7 % 3) << " " << (7 % -3) << " " << (-7 % -3) << "\\n";
// 1 -1 1 -1

// Safe modulo for a positive m: always in 0 .. m-1
long long mod(long long a, long long m) { return ((a % m) + m) % m; }

cout << mod(-7, 3) << "\\n";     // 2

// Under MOD = 1e9+7, subtraction needs it:
long long diff = (x - y + MOD) % MOD;   // fine if x, y are already in 0..MOD-1
long long diff2 = mod(x - y, MOD);      // fine for any x, y`,
        output: '1 -1 1 -1\n2',
      },
      {
        kind: 'table',
        headers: ['Expression', 'Danger', 'Safe version'],
        rows: [
          ['`(i - 1) % n` for a circular index', 'Negative when i = 0', '`(i - 1 + n) % n`'],
          ['`(a - b) % MOD`', 'Negative when a < b', '`(a - b + MOD) % MOD` or `mod(a - b, MOD)`'],
          ['`n % 2 == 1` for odd', 'False for negative odd n', '`n % 2 != 0`'],
          ['`x % m` where x may be very negative', 'Adding m once is not enough', '`((x % m) + m) % m`'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Digit extraction on negatives',
        body: '`n % 10` on a negative n gives a negative digit. For digit problems, take `abs(n)` first (mind that `abs(INT_MIN)` overflows: use `long long`), and restore the sign at the end.',
      },
    ],
    keyTakeaways: [
      '`%` takes the sign of the left operand: `-7 % 3` is -1.',
      'Use `((a % m) + m) % m` for a result in 0..m-1.',
      'Test odd with `!= 0`; add `n` before `% n` when an index can go negative.',
    ],
    practice: {
      prompt: 'Print x % 4 for x from -8 to 8 and mark the negatives. Then implement a circular buffer index step backwards that is correct at index 0. Then compute (a - b) mod 10⁹+7 for a = 5, b = 10 both the wrong and the right way.',
    },
  },
  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-45.9',
    language: 'cpp',
    summary: 'Convert between char and int deliberately, and avoid printing a number as a character by accident.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'A `char` is an integer type, and C++ will convert it to and from `int` without complaint. That is convenient for `c - \'0\'` and `\'a\' + i`, and it is the source of a family of bugs where a number is printed as a control character, a digit is stored as its code, or a `char` arithmetic result silently overflows.',
      },
      {
        kind: 'code',
        caption: 'Conversions, right and wrong',
        code: `char c = '7';
int wrong = c;              // 55: the character code, not 7
int right = c - '0';        // 7

int d = 7;
char wrongc = d;            // the character with code 7 (a bell), not '7'
char rightc = '0' + d;      // '7'

cout << 'a' + 1 << "\\n";        // 98: char + int is int, prints a number
cout << char('a' + 1) << "\\n";  // b

string s = "abc";
s[0] = s[0] - 32;           // 'A': works, but write toupper(s[0])
int total = 0;
for (char ch : s) total += ch;  // sums codes: 294. Intended? Usually not.`,
        output: '98\nb',
      },
      {
        kind: 'table',
        headers: ['From', 'To', 'Write'],
        rows: [
          ['digit char', 'value', '`c - \'0\'`'],
          ['value 0..9', 'digit char', '`\'0\' + d` (cast to `char` when storing)'],
          ['letter', 'index 0..25', '`c - \'a\'` or `c - \'A\'`'],
          ['index 0..25', 'letter', '`char(\'a\' + i)`'],
          ['number', 'string', '`to_string(n)`'],
          ['string', 'number', '`stoi(s)` / `stoll(s)`'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: '`char` may be signed',
        body: 'On most platforms `char` holds -128..127. Characters above 127 (accented letters, bytes of UTF-8 text) come out negative, and `cnt[c]` with a negative `c` indexes before the array. If input can contain non-ASCII bytes, index with `(unsigned char)c`. For LeetCode’s ASCII inputs this does not arise, but it is why `isalpha(c)` on such input is undefined.',
      },
    ],
    keyTakeaways: [
      'A `char` in arithmetic is its code; subtract `\'0\'` or `\'a\'` to get a value or index.',
      '`char + int` is an `int`; cast back to `char` to print or store a character.',
      'Index counting arrays with `(unsigned char)c` if input may be non-ASCII.',
    ],
    practice: {
      prompt: 'Convert "4721" to the integer 4721 by hand with the multiply-and-add loop, then back to a string by hand. Then print the alphabet by looping `char c = \'a\'; c <= \'z\'; c++` and explain why the loop variable can be a `char`.',
    },
  },
  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-45.10',
    language: 'cpp',
    summary: 'Put large arrays at global scope or on the heap, because the stack is small.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'Local variables live on the **stack**, which on most judges is 8 MB or less, sometimes 1 MB. `int a[1000000]` inside `main` is 4 MB and may crash immediately with a segmentation fault before a single line runs. A 2D local `int dp[3000][3000]` is 36 MB and will. The same arrays at global scope live in a different region with no such limit, and are zero-initialised for free.',
      },
      {
        kind: 'code',
        caption: 'Where large arrays go',
        code: `// Crashes on many judges: 40 MB on the stack
int main() {
    int dp[5000][2000];
}

// Fine: global storage, zero-initialised
int dp[5000][2000];
int main() { ... }

// Fine: vector allocates on the heap
int main() {
    vector<vector<int>> dp(5000, vector<int>(2000, 0));
}

// In a LeetCode class: a member vector, sized in the method
class Solution {
    vector<int> memo;
public:
    int solve(int n) { memo.assign(n + 1, -1); ... }
};`,
      },
      {
        kind: 'table',
        headers: ['Storage', 'Limit', 'Initialised?', 'Use for'],
        rows: [
          ['Local array', 'Stack: ~1-8 MB total', 'No (garbage)', 'Small fixed arrays: `int dr[4]`'],
          ['Global array', 'Hundreds of MB', 'Yes (zero)', 'Contest-style fixed-max arrays'],
          ['`vector`', 'Heap: the memory limit', 'Yes (value you give)', 'Anything sized at runtime; LeetCode solutions'],
          ['`static` local', 'Same as global', 'Yes (zero)', 'A lookup table computed once inside a function'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Variable-length arrays are not standard C++',
        body: '`int n; cin >> n; int a[n];` compiles on GCC as an extension and puts `n` ints on the stack, with all the same crash risk and no way to check. Use `vector<int> a(n)`. It is what the language provides for runtime sizes.',
      },
    ],
    keyTakeaways: [
      'The stack is small; large local arrays crash before your code runs.',
      'Put big fixed arrays at global scope (zero-initialised) or use `vector` (heap).',
      '`int a[n]` with a runtime n is a non-standard extension; use `vector`.',
    ],
    practice: {
      prompt: 'Declare `int a[3000][3000]` locally and run it; then move it to global scope and run again. Then rewrite it as a vector of vectors and confirm the memory used is the same 36 MB. Explain where each of the three lives.',
    },
  },
  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-45.11',
    language: 'cpp',
    summary: 'Recognise a stack overflow from deep recursion and know the three ways to avoid it.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'Each function call uses some stack: its parameters, its locals, and a return address, typically tens to hundreds of bytes. Recursion 10⁵ deep uses that much times 10⁵, which can exceed the stack limit and crash with a segmentation fault, reported as Runtime Error. Recursion 10⁶ deep almost certainly does. Unlike Python, there is no limit to raise: the crash is the operating system refusing more memory.',
      },
      {
        kind: 'table',
        headers: ['Recursion', 'Depth', 'Risk'],
        rows: [
          ['DFS on a balanced tree of 10⁶ nodes', '~20', 'None'],
          ['DFS on a linked list or path graph of 10⁵ nodes', '10⁵', 'Depends on frame size and judge; often fine, sometimes not'],
          ['DFS on a 1000×1000 open grid', 'up to 10⁶', 'Crash'],
          ['Memoised recursion over n = 10⁶ states in a chain', '10⁶', 'Crash'],
        ],
      },
      {
        kind: 'code',
        caption: 'Reducing frame size, and going iterative',
        code: `// Big frame: copies and locals on every call
void dfs(int u, vector<vector<int>> adj, vector<int> path) { ... }   // do not

// Small frame: references and no per-call containers
void dfs(int u, const vector<vector<int>>& adj, vector<char>& vis) { ... }

// Iterative DFS: no recursion at all
void dfsIter(int s, const vector<vector<int>>& adj, vector<char>& vis) {
    vector<int> st = {s};
    while (!st.empty()) {
        int u = st.back(); st.pop_back();
        if (vis[u]) continue;
        vis[u] = 1;
        for (int v : adj[u]) if (!vis[v]) st.push_back(v);
    }
}`,
      },
      {
        kind: 'text',
        body: 'Three defences, in order of effort. **Shrink the frame**: pass containers by reference, do not declare arrays inside the recursive function. **Make it a loop**: an explicit stack for DFS, bottom-up tabulation for DP. **Raise the limit**: some judges accept a pragma or a linker flag; LeetCode does not expose one, so rely on the first two there.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Grids: BFS instead of DFS',
        body: 'For flood fill and connected regions on a grid, BFS with a queue has the same cost as DFS, visits the same cells, and never recurses. When the grid can be large, write BFS by default.',
      },
    ],
    keyTakeaways: [
      'Deep recursion overflows the stack; there is no limit to raise on LeetCode.',
      'Keep frames small: references in, no containers declared per call.',
      'Depth beyond ~10⁵: use an explicit stack, BFS, or bottom-up DP.',
    ],
    practice: {
      prompt: 'Write a recursive function that counts down from n and find the n at which it crashes on your machine. Then halve the frame size by removing a local array and find the new n. Then write the iterative version and run it for n = 10⁷.',
    },
  },
  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-45.12',
    language: 'cpp',
    summary: 'Keep a list of the undefined behaviours that pass locally and fail on the judge.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: '**Undefined behaviour** (UB) is C++’s term for operations the standard does not define at all. The compiler assumes they never happen and optimises accordingly, so a program with UB can do anything: work, crash, print garbage, or work on your machine and fail on the judge because the judge uses different flags. This lesson is a checklist of the ones that appear in DSA code. Skim it now; return to it whenever a solution fails without reason.',
      },
      {
        kind: 'table',
        headers: ['Undefined behaviour', 'Typical symptom', 'Fix'],
        rows: [
          ['Reading an uninitialised variable', 'Different answer each run', 'Initialise at declaration'],
          ['Signed integer overflow', 'Negative or tiny result from a big product', '`long long`, `1LL *`, check constraints'],
          ['Index out of bounds (`v[n]`, `a[-1]`)', 'Crash, or a wrong value that looks plausible', 'Half-open loops; `-fsanitize=address` locally'],
          ['Dereferencing a null or dangling pointer', 'Segmentation fault', 'Check `nullptr`; indices instead of pointers into vectors'],
          ['Using an invalidated iterator', 'Skipped elements, crash after erase/push_back', 'Erase-remove; never grow a container while iterating it'],
          ['Shift by ≥ width or by a negative amount (`1 << 32`)', 'Wrong mask, often 1 or 0', '`1LL << k`; keep k < 64'],
          ['Division or modulo by zero', 'Crash (SIGFPE)', 'Check the divisor'],
          ['Modifying a variable twice in one expression (`i = i++`)', 'Unpredictable value', 'One modification per statement'],
          ['A non-void function that falls off the end without `return`', 'Garbage return value', '`-Wall` warns; add the return'],
          ['A comparator that is not a strict weak ordering (`<=`)', 'Crash inside `sort`', 'Use `<`; never return true for equal elements'],
          ['Stack overflow from deep recursion or huge locals', 'Segmentation fault before or during recursion', 'Global arrays; iterative versions'],
        ],
      },
      {
        kind: 'code',
        caption: 'The two flags that find most of these before submission',
        code: `# Warnings for uninitialised, missing return, sign comparison, and more
g++ -std=c++17 -O2 -Wall -Wextra -Wshadow main.cpp -o main

# Sanitizers: catch out-of-bounds, use-after-free, overflow at run time with a line number
g++ -std=c++17 -g -fsanitize=address,undefined main.cpp -o main_debug
./main_debug < input.txt`,
      },
      {
        kind: 'text',
        body: 'The comparator row deserves a word. `sort(v.begin(), v.end(), [](int a, int b){ return a <= b; })` is UB because `<=` returns true for equal elements, which the algorithm assumes cannot happen; it can walk off the end of the array and crash only on inputs with duplicates. Every comparator must return false when both arguments are equal.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: '"It works on my machine" is not evidence',
        body: 'UB is exactly the class of bug for which local success proves nothing. When a solution passes every local test and fails on the judge with Runtime Error or an unexplainable Wrong Answer, go down this table before touching the algorithm.',
      },
    ],
    keyTakeaways: [
      'Undefined behaviour can pass locally and fail on the judge; the algorithm may be fine.',
      'Compile with `-Wall -Wextra` and test with `-fsanitize=address,undefined`.',
      'Comparators use `<`, never `<=`; shifts use `1LL`; indices stay in [0, n).',
    ],
    practice: {
      prompt: 'Write five tiny programs, each with one UB from the table (uninitialised read, overflow, out-of-bounds, `<=` comparator on an array with duplicates, `1 << 40`). Compile each with the sanitizer flags and read what it reports. Keep the compile command in your notes.',
    },
  },
];
