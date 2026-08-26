import type { Lesson } from '../types';

/**
 * Chapter 2 — Variables, Data Types, and Operators.
 * The chapter where overflow, integer division and precedence bugs get caught
 * before they cost a submission.
 */
export const ch02: Lesson[] = [
  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-2.1',
    language: 'cpp',
    summary: 'Understand why every C++ variable must declare its type, and what that buys you.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'C++ is **statically typed**: every variable\'s type is fixed at the moment you declare it, and the compiler checks every use against that type. Python lets `x = 5` become `x = "hello"` later; C++ does not.',
      },
      {
        kind: 'code',
        caption: 'Declaring variables',
        code: `int count = 0;          // declared and initialised together
double average;         // declared, holds garbage until assigned
average = 4.5;          // now initialised

char grade = 'A';
bool found = false;`,
      },
      {
        kind: 'text',
        body: 'A **primitive** type is one built into the language itself, storing a single value directly in memory — not a class, with no methods. `vector` and `string` are library types built on top of these.',
      },
      { kind: 'heading', text: 'What the type actually decides' },
      {
        kind: 'table',
        headers: ['', 'Consequence'],
        rows: [
          ['**How many bytes**', '`char` takes 1, `int` takes 4, `long long` takes 8'],
          ['**What range of values**', '`int` caps near ±2.1 billion; going past that wraps around'],
          ['**Which operations are legal**', '`/` on two `int`s truncates; on `double`s it does not'],
          ['**How the bits are interpreted**', 'The same 32 bits mean different things as `int` vs `float`'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Uninitialised variables hold garbage, not zero',
        body: 'Writing `int sum;` and then `sum += x` is a real bug: `sum` starts as whatever bytes happened to be at that memory address. Sometimes that is 0 and your code appears to work; sometimes it is 1,437,201 and you get a wrong answer you cannot reproduce. Always initialise: `int sum = 0;`. This is the classic bug that passes locally and fails on the judge.',
      },
      {
        kind: 'code',
        caption: 'Checking sizes on your own machine',
        code: `#include <iostream>
using namespace std;

int main() {
    cout << sizeof(int) << endl;        // 4
    cout << sizeof(long long) << endl;  // 8
    cout << sizeof(char) << endl;       // 1
    cout << sizeof(bool) << endl;       // 1
    return 0;
}`,
        output: '4\n8\n1\n1',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'auto lets the compiler pick the type',
        body: 'Writing `auto i = 0;` means "figure out the type from the value" — here, `int`. It is not dynamic typing: the type is still fixed at compile time, you just did not have to spell it out. Invaluable later for iterator types like `vector<int>::iterator`, which `auto` turns into one word.',
      },
      {
        kind: 'text',
        body: 'Static typing feels like extra work coming from Python, but it is what lets the compiler catch a whole class of bugs before you ever run the program — and it is why C++ runs fast enough to pass tight time limits.',
      },
    ],
    keyTakeaways: [
      'Every variable has one fixed type, decided at declaration and enforced by the compiler.',
      'The type controls size in bytes, value range, and which operations mean what.',
      'Uninitialised variables hold garbage — always give them a starting value.',
      '`auto` infers the type at compile time; it is shorthand, not dynamic typing.',
    ],
    practice: {
      prompt: 'Print `sizeof` for every primitive type. Then declare `int sum;` without initialising it, add 10 to it, and print the result — run it several times, and on different machines if you can. Watching an uninitialised variable produce different answers makes this bug memorable in a way that reading about it does not.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-2.2',
    language: 'cpp',
    summary: 'Pick the right numeric type by reading the problem constraints.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Choosing a type is not a style question in DSA — it decides whether your answer is correct. Here are the ranges that matter.',
      },
      {
        kind: 'table',
        headers: ['Type', 'Bytes', 'Range', 'When to use'],
        rows: [
          ['`int`', '4', '−2,147,483,648 to 2,147,483,647', 'The default. Indices, counts, most values'],
          ['`long long`', '8', '≈ ±9.2 × 10¹⁸', 'Sums, products, anything that might exceed 2.1 billion'],
          ['`double`', '8', '≈ 15–17 significant digits', 'Averages, geometry, real-valued maths'],
          ['`float`', '4', '≈ 7 significant digits', 'Almost never — not precise enough. Use `double`'],
          ['`char`', '1', '−128 to 127', 'Single characters, held as their ASCII code'],
          ['`bool`', '1', '`true` / `false`', 'Flags, visited arrays, conditions'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Read the constraints before you pick',
        body: 'LeetCode states limits like `1 <= nums.length <= 10^5` and `-10^9 <= nums[i] <= 10^9`. Multiply the worst case out: 10⁵ elements each up to 10⁹ gives a sum up to 10¹⁴ — far past `int`. That calculation, done in ten seconds before you write anything, is what tells you to use `long long`.',
      },
      { kind: 'heading', text: 'char is secretly a number' },
      {
        kind: 'text',
        body: 'A `char` stores the ASCII code of a character, so you can do arithmetic on it directly. This is the backbone of nearly every string problem.',
      },
      {
        kind: 'code',
        caption: 'Character arithmetic',
        code: `char c = 'a';
int position = c - 'a';        // 0  — 'a' maps to index 0, 'b' to 1, etc.

char upper = 'a' - 32;         // 'A'  — uppercase is 32 lower in ASCII
bool isDigit = (c >= '0' && c <= '9');

// The frequency-array idiom you will use constantly:
int freq[26] = {0};
for (char ch : word) freq[ch - 'a']++;`,
      },
      {
        kind: 'table',
        headers: ['Characters', 'ASCII codes'],
        rows: [
          ["`'0'` – `'9'`", '48 – 57'],
          ["`'A'` – `'Z'`", '65 – 90'],
          ["`'a'` – `'z'`", '97 – 122'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: "'5' is not 5",
        body: 'The character `\'5\'` has value 53, not 5. To convert, subtract `\'0\'`: `int digit = c - \'0\';`. Forgetting this gives answers that are off by 48 per digit — a bug that looks baffling until you know the cause.',
      },
      { kind: 'heading', text: 'Never compare doubles with ==' },
      {
        kind: 'code',
        code: `double a = 0.1 + 0.2;
if (a == 0.3) { ... }              // FALSE — a is 0.30000000000000004

// Correct: compare within a tolerance
if (abs(a - 0.3) < 1e-9) { ... }   // true`,
      },
      {
        kind: 'text',
        body: 'Binary floating point cannot represent 0.1 exactly, so tiny errors accumulate. Compare against a small epsilon instead. Better still, avoid doubles entirely when you can — many problems that look like they need division can be rearranged into integer arithmetic.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'bool arrays are compact but vector<bool> is odd',
        body: '`vector<bool>` is a special case in the standard library: it packs 8 booleans per byte to save space, which means it does not behave like other vectors — you cannot take a reference to an element. For visited arrays this rarely matters, but if you hit a strange compile error involving `vector<bool>`, use `vector<char>` instead.',
      },
    ],
    keyTakeaways: [
      '`int` caps near ±2.1 billion — use `long long` whenever the constraints could exceed it.',
      'Multiply out the worst case from the problem constraints before choosing a type.',
      '`char` is a number: `c - \'a\'` gives an index, `c - \'0\'` converts a digit.',
      'Never compare `double`s with `==`; compare within an epsilon like `1e-9`.',
    ],
    practice: {
      prompt: 'Write a function counting how many times each letter appears in a lowercase string, using `int freq[26]` and the `ch - \'a\'` idiom. Then print `0.1 + 0.2 == 0.3` and see it come out false. Both idioms show up constantly from here on.',
      leetcode: { title: 'Valid Anagram', slug: 'valid-anagram' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-2.3',
    language: 'cpp',
    summary: 'Convert between types on purpose, and spot the conversions C++ does behind your back.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Type casting is converting a value from one type to another. C++ does some conversions automatically (**implicit**) and lets you demand others (**explicit**). The automatic ones cause most of the bugs, because they happen silently.',
      },
      { kind: 'heading', text: 'The integer division trap' },
      {
        kind: 'code',
        caption: 'The single most common casting bug',
        code: `int a = 7, b = 2;

double wrong = a / b;              // 3.0  — the division happened as ints first!
double right = (double)a / b;      // 3.5  — cast before dividing

// Averaging a vector:
double avg = sum / nums.size();            // WRONG — integer division
double avg = (double)sum / nums.size();    // correct`,
      },
      {
        kind: 'text',
        body: 'When both operands are `int`, `/` performs **integer division** and discards the remainder. Assigning the result to a `double` afterwards is too late — the information is already gone. Cast one operand *before* the division and the other is promoted automatically.',
      },
      { kind: 'heading', text: 'The three ways to cast' },
      {
        kind: 'code',
        code: `double d = 3.9;

int a = (int)d;              // C-style       → 3
int b = int(d);              // function-style → 3
int c = static_cast<int>(d); // C++ style      → 3`,
      },
      {
        kind: 'text',
        body: 'All three do the same thing here. `static_cast` is more verbose but searchable and checked more strictly, so professional code prefers it; in contest code the C-style cast is normal. Use whichever your team uses — just be consistent.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'double → int truncates, it does not round',
        body: '`(int)3.9` is `3`, and `(int)-3.9` is `-3` — it chops toward zero rather than rounding. For actual rounding use `round()`, `floor()` or `ceil()` from `<cmath>`. Rounding a negative number by writing `(int)(x + 0.5)` is a classic broken shortcut.',
      },
      { kind: 'heading', text: 'The overflow cast, in the right order' },
      {
        kind: 'code',
        code: `int a = 100000, b = 100000;

long long bad  = a * b;                  // OVERFLOWS — multiplied as int first
long long good = (long long)a * b;       // correct — promotes before multiplying`,
      },
      {
        kind: 'text',
        body: 'Same principle as division: the cast must come *before* the operation. `(long long)(a * b)` widens a value that has already wrapped around, which is useless.',
      },
      { kind: 'heading', text: 'Converting to and from strings' },
      {
        kind: 'code',
        code: `#include <string>

string s = to_string(42);      // "42"
int n = stoi("42");            // 42
long long big = stoll("123456789012");
double d = stod("3.14");`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'stoi throws on bad input',
        body: '`stoi("abc")` throws `invalid_argument` and `stoi("99999999999")` throws `out_of_range` — either crashes your submission with a Runtime Error. If input might not be a clean number, validate it first or use `stoll` for large values.',
      },
    ],
    keyTakeaways: [
      '`int / int` truncates — cast one side to `double` **before** dividing.',
      'Cast to `long long` **before** the multiplication, not after.',
      '`(int)` truncates toward zero; use `round`/`floor`/`ceil` to actually round.',
      '`to_string` / `stoi` convert between numbers and strings; `stoi` throws on bad input.',
    ],
    practice: {
      prompt: 'Write a function returning the average of a `vector<int>` as a `double`. Write it the wrong way first (`sum / nums.size()`), confirm it returns a whole number, then fix it with a cast. Then compute `100000 * 100000` into a `long long` both ways and watch only the correctly-ordered cast survive.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-2.4',
    language: 'cpp',
    summary: 'Use const to lock values down and to pass big objects without copying them.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: '`const` means "this cannot change after initialisation". The compiler enforces it, so an accidental write becomes a compile error instead of a silent bug.',
      },
      {
        kind: 'code',
        code: `const int MAX_SIZE = 1000;
MAX_SIZE = 2000;          // error: assignment of read-only variable

const double PI = 3.14159;
const int MOD = 1e9 + 7;  // the modulus half of all counting problems use`,
      },
      {
        kind: 'text',
        body: 'A `const` variable must be initialised at declaration — there is no later chance to give it a value.',
      },
      { kind: 'heading', text: 'The use that actually matters: const references' },
      {
        kind: 'text',
        body: 'Passing a `vector` to a function by value **copies the entire thing**. For 100,000 elements inside a loop, that copying alone can blow the time limit. A `const` reference passes the original with no copy, while guaranteeing the function cannot modify it.',
      },
      {
        kind: 'code',
        caption: 'Three ways to take a parameter',
        code: `int sum(vector<int> v)          // copies all elements — slow
int sum(vector<int>& v)         // no copy, but the function could modify it
int sum(const vector<int>& v)   // no copy AND cannot modify — best for reading`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The rule of thumb',
        body: 'Pass primitives (`int`, `char`, `bool`, `double`) by value — they are small and copying is free. Pass containers and strings by `const&` when reading, and by plain `&` when you genuinely need to modify the caller\'s copy. This one habit prevents a surprising number of Time Limit Exceeded verdicts.',
      },
      { kind: 'heading', text: 'const member functions' },
      {
        kind: 'code',
        code: `class Counter {
    int value;
public:
    int get() const { return value; }   // promises not to modify the object
    void increment() { value++; }       // no const — it does modify
};`,
      },
      {
        kind: 'text',
        body: 'The trailing `const` promises the method will not change the object. Without it, you cannot call the method on a `const` object — which is why forgetting it produces confusing errors when you later pass things by `const&`.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'LeetCode signatures use & but not const',
        body: 'LeetCode gives you `vector<int>& nums` — a reference without `const`, so you may modify it in place if that helps (sorting, for instance). Just remember the caller sees your changes, which matters if the same vector is used again in a multi-part problem.',
      },
    ],
    keyTakeaways: [
      '`const` values must be initialised at declaration and can never be reassigned.',
      'Passing a container by value copies every element — a real performance cost.',
      'Use `const vector<T>&` to read a container without copying it.',
      'A trailing `const` on a method promises it will not modify the object.',
    ],
    practice: {
      prompt: 'Write the same summing function three times — by value, by `&`, and by `const&` — and call each on a vector of a million elements, timing them. The gap between by-value and by-reference is large enough to see clearly, and seeing it once makes the habit stick.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-2.5',
    language: 'cpp',
    summary: 'Use +, -, *, / and % correctly, including the two behaviours that surprise everyone.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Addition and multiplication behave exactly as you expect. Division does not — and that single surprise causes more silently wrong answers than any other operator in this chapter. C++ has two different divisions hiding behind one `/` symbol, and which one you get depends on the **types**, not on what you meant.',
      },
      {
        kind: 'code',
        caption: 'The five arithmetic operators',
        code: `int a = 17, b = 5;

cout << a + b;   // 22
cout << a - b;   // 12
cout << a * b;   // 85
cout << a / b;   // 3   — integer division, remainder discarded
cout << a % b;   // 2   — the remainder itself`,
      },
      { kind: 'heading', text: 'Integer division truncates' },
      {
        kind: 'text',
        body: 'Covered in casting, worth repeating because it causes so many wrong answers: `int / int` throws away the fractional part. `7 / 2` is `3`, not `3.5`.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Truncation is often exactly what you want',
        body: 'Binary search uses `int mid = low + (high - low) / 2;` and relies on the truncation. Finding a matrix cell from a flat index uses `row = i / cols; col = i % cols;`. Integer division is a tool, not just a hazard — you just have to know when it is active.',
      },
      { kind: 'heading', text: 'The modulo operator' },
      {
        kind: 'text',
        body: '`%` gives the remainder, and shows up everywhere in DSA:',
      },
      {
        kind: 'code',
        code: `bool isEven = (n % 2 == 0);          // parity
int lastDigit = n % 10;              // digit extraction
int wrapped = (i + 1) % size;        // circular array — wraps past the end
int hash = key % tableSize;          // hash bucket`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: '% on negative numbers can be negative',
        body: 'In C++, `-7 % 3` is `-1`, not `2`. If you are wrapping an index backwards or hashing a possibly-negative key, the result can be negative and indexing with it crashes. The fix is `((a % m) + m) % m`, which forces the result into `[0, m)`.',
      },
      {
        kind: 'code',
        caption: 'Safe modulo',
        code: `int mod(int a, int m) {
    return ((a % m) + m) % m;
}

mod(-7, 3);    // 2   (whereas -7 % 3 gives -1)`,
      },
      { kind: 'heading', text: 'Division by zero' },
      {
        kind: 'text',
        body: 'Integer division or modulo by zero is **undefined behaviour** — usually a crash, reported as a Runtime Error. Guard it when a divisor could be zero. Floating-point division by zero is different: it produces `inf` or `nan` instead of crashing.',
      },
      { kind: 'heading', text: 'Compound assignment' },
      {
        kind: 'code',
        code: `sum += x;     // sum = sum + x
diff -= x;
prod *= x;
half /= 2;
rem %= 10;`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'The 10^9 + 7 modulus',
        body: 'Counting problems often ask for the answer "modulo 10^9 + 7" because the true count would overflow any integer type. Apply the modulus at every step, not just at the end: `result = (result * x) % MOD;`. Use `long long` for the intermediate product, since two values just under 10⁹ multiply to nearly 10¹⁸.',
      },
    ],
    keyTakeaways: [
      '`int / int` truncates — deliberate in binary search, a bug when averaging.',
      '`%` powers parity, digit extraction, circular indexing and hashing.',
      '`-7 % 3` is `-1` in C++; use `((a % m) + m) % m` when the value may be negative.',
      'Integer division or modulo by zero crashes; floating-point gives `inf`/`nan`.',
    ],
    practice: {
      prompt: 'Write a function that reverses the digits of an integer using `% 10` and `/ 10` in a loop. Then print `-7 % 3` and confirm it is `-1`, and check your safe-`mod` helper turns it into `2`. Digit extraction is one of the most reused loops in DSA.',
      leetcode: { title: 'Reverse Integer', slug: 'reverse-integer' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-2.6',
    language: 'cpp',
    summary: 'Compare values correctly, and avoid the two comparisons that quietly do the wrong thing.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'Relational operators compare two values and produce a `bool`.',
      },
      {
        kind: 'table',
        headers: ['Operator', 'Meaning'],
        rows: [
          ['`==`', 'equal to'],
          ['`!=`', 'not equal to'],
          ['`<` `>`', 'less than, greater than'],
          ['`<=` `>=`', 'less than or equal, greater than or equal'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: '= is assignment, == is comparison',
        body: 'Writing `if (x = 5)` assigns 5 to `x` and then treats 5 as true — so the branch always runs and `x` is silently destroyed. It compiles, usually with only a warning. If you build with `-Wall` you will be told; without it, this can cost you an hour.',
      },
      { kind: 'heading', text: 'Chaining does not work the way it reads' },
      {
        kind: 'code',
        code: `// WRONG — this compiles and is almost always true
if (0 <= x <= 10) { ... }
// evaluates as ((0 <= x) <= 10)  →  (true or false) <= 10  →  1 or 0 <= 10  →  always true

// CORRECT
if (0 <= x && x <= 10) { ... }`,
      },
      {
        kind: 'text',
        body: 'Python allows `0 <= x <= 10`; C++ does not, but it does not complain either — it just quietly computes something else. Always split the range check with `&&`.',
      },
      { kind: 'heading', text: 'Comparing strings' },
      {
        kind: 'code',
        code: `string a = "apple", b = "banana";

a == b;      // false  — compares contents, as you would expect
a < b;       // true   — lexicographic (dictionary) order

// But with C-style char arrays, == compares ADDRESSES, not contents:
const char* p = "apple";
const char* q = "apple";
p == q;      // unreliable — use strcmp, or just use std::string`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Lexicographic order is not alphabetical order',
        body: 'Comparison is by ASCII code, so every uppercase letter sorts before every lowercase one: `"Zebra" < "apple"` is true, because `\'Z\'` is 90 and `\'a\'` is 97. If a problem wants case-insensitive ordering you must normalise the case yourself first.',
      },
      {
        kind: 'text',
        body: 'Also remember that comparison operators return a real `bool` you can store and pass around: `bool inRange = (0 <= x && x <= 10);` is often clearer than repeating the condition.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Do not compare doubles with ==',
        body: 'Worth stating again in the comparison lesson: `0.1 + 0.2 == 0.3` is false. Use `abs(a - b) < 1e-9`. This bites hardest in geometry problems and anywhere you have divided.',
      },
    ],
    keyTakeaways: [
      '`=` assigns, `==` compares — `if (x = 5)` compiles and is always true.',
      'C++ has no chained comparison; write `0 <= x && x <= 10`.',
      '`std::string` compares by content; C-style `char*` compares by address.',
      'String order is by ASCII, so all uppercase sorts before all lowercase.',
    ],
    practice: {
      prompt: 'Write `if (x = 5)` deliberately, compile with `-Wall`, and read the warning so you recognise it. Then test `0 <= x <= 10` with `x = 100` and watch it return true. Both are bugs your eyes will skip over unless you have seen them fire once.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-2.7',
    language: 'cpp',
    summary: 'Combine conditions with && and ||, and use short-circuiting to prevent crashes.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Logical operators glue yes/no questions together: "is the index in range **and** is the value even?". The part worth learning properly is **short-circuiting** — `&&` stops the moment it finds a false, and `||` stops at the first true. That is not merely a speed optimisation; it is the standard way to guard an array access, and you will write it in almost every DSA loop.',
      },
      {
        kind: 'table',
        headers: ['Operator', 'Name', 'True when'],
        rows: [
          ['`&&`', 'AND', 'both sides are true'],
          ['`||`', 'OR', 'at least one side is true'],
          ['`!`', 'NOT', 'flips true to false'],
        ],
      },
      {
        kind: 'code',
        code: `bool inBounds = (i >= 0 && i < n);
bool isEdge   = (i == 0 || i == n - 1);
bool notFound = !found;`,
      },
      { kind: 'heading', text: 'Short-circuiting: the feature that saves you from crashes' },
      {
        kind: 'text',
        body: '`&&` stops as soon as the left side is false — the right side is never evaluated. `||` stops as soon as the left side is true. This is not just an optimisation; it is a correctness tool you will rely on constantly.',
      },
      {
        kind: 'code',
        caption: 'Bounds-checking before indexing',
        code: `// SAFE — if i is out of range, nums[i] is never evaluated
if (i < nums.size() && nums[i] == target) { ... }

// CRASHES — nums[i] runs even when i is out of range
if (nums[i] == target && i < nums.size()) { ... }`,
      },
      {
        kind: 'text',
        body: 'The order of the two conditions is the entire difference between working code and a Runtime Error. **Always put the guard first.** This pattern is everywhere in linked lists and grids:',
      },
      {
        kind: 'code',
        caption: 'The same idiom in three contexts',
        code: `// Linked list — check the pointer before dereferencing it
while (node != nullptr && node->val != target) node = node->next;

// 2D grid — check both bounds before reading the cell
if (r >= 0 && r < rows && c >= 0 && c < cols && grid[r][c] == 1) { ... }

// Avoid dividing by zero
if (b != 0 && a / b > 10) { ... }`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Any non-zero number is true',
        body: 'C++ treats `0` as false and everything else as true, so `if (x)` means `if (x != 0)`. That is idiomatic for pointers (`if (node)`), but it means a typo like `if (count = 1)` is always true. It also means `if (-1)` runs the branch, which surprises people expecting -1 to be falsy.',
      },
      { kind: 'heading', text: 'Do not confuse && with &' },
      {
        kind: 'code',
        code: `bool a = true, b = false;

a && b;    // logical AND → false, and short-circuits
a & b;     // BITWISE AND → operates on bits, no short-circuit`,
      },
      {
        kind: 'text',
        body: 'For `bool`s they often give the same answer, which is exactly why the typo survives — until you write `if (ptr != nullptr & ptr->val == 5)`, where the missing `&` disables short-circuiting and you dereference a null pointer.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'De Morgan\'s laws simplify negated conditions',
        body: '`!(a && b)` is the same as `!a || !b`, and `!(a || b)` is the same as `!a && !b`. When a condition reads awkwardly with a `!` wrapped around the whole thing, pushing the negation inward usually makes it clearer.',
      },
    ],
    keyTakeaways: [
      '`&&` and `||` short-circuit — the right side may never be evaluated.',
      'Put the bounds or null check first: `i < n && nums[i] == x`, never the reverse.',
      '`0` is false, every other value is true — including negative numbers.',
      '`&&` is logical and short-circuits; `&` is bitwise and does not.',
    ],
    practice: {
      prompt: 'Write a function that safely checks whether `nums[i]` equals a target for any `i`, including out-of-range values, relying on short-circuiting. Then flip the two conditions and watch it crash. Understanding *why* the order matters is what makes grid and linked-list code safe later.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-2.8',
    language: 'cpp',
    summary: 'Manipulate numbers bit by bit — the basis of an entire family of LeetCode problems.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Bitwise operators work on the individual binary digits of a number. They are fast, and a recognisable class of problems is built entirely around them.',
      },
      {
        kind: 'table',
        headers: ['Operator', 'Name', 'Result bit is 1 when'],
        rows: [
          ['`&`', 'AND', 'both bits are 1'],
          ['`|`', 'OR', 'either bit is 1'],
          ['`^`', 'XOR', 'the bits differ'],
          ['`~`', 'NOT', 'flips every bit'],
          ['`<<`', 'left shift', 'shifts bits left, filling with 0'],
          ['`>>`', 'right shift', 'shifts bits right'],
        ],
      },
      {
        kind: 'code',
        caption: 'Seeing it in binary',
        code: `int a = 12;   // 1100
int b = 10;   // 1010

a & b;   //  8  → 1000  (1 only where both had 1)
a | b;   // 14  → 1110  (1 where either had 1)
a ^ b;   //  6  → 0110  (1 only where they differed)
a << 1;  // 24  → 11000 (shift left = multiply by 2)
a >> 1;  //  6  → 110   (shift right = integer divide by 2)`,
      },
      { kind: 'heading', text: 'The idioms worth memorising' },
      {
        kind: 'code',
        code: `// Is n even?  (faster than % 2, and works for negatives)
bool even = !(n & 1);

// Multiply / divide by powers of two
n << 3;          // n * 8
n >> 2;          // n / 4

// Read the i-th bit (0 = rightmost)
bool bit = (n >> i) & 1;

// Set, clear, and toggle the i-th bit
n |= (1 << i);
n &= ~(1 << i);
n ^= (1 << i);

// Isolate the lowest set bit
int lowest = n & (-n);

// Clear the lowest set bit — the basis of fast bit counting
n &= (n - 1);

// Is n a power of two?
bool isPow2 = n > 0 && (n & (n - 1)) == 0;`,
      },
      { kind: 'heading', text: 'XOR is the one that unlocks problems' },
      {
        kind: 'text',
        body: 'XOR has three properties that combine into an elegant trick:',
      },
      {
        kind: 'table',
        headers: ['Property', 'Meaning'],
        rows: [
          ['`x ^ x == 0`', 'A value cancels itself out'],
          ['`x ^ 0 == x`', 'Zero leaves a value unchanged'],
          ['Order does not matter', 'You can XOR a list in any sequence'],
        ],
      },
      {
        kind: 'code',
        caption: 'Find the number that appears once, everything else twice',
        code: `int singleNumber(vector<int>& nums) {
    int result = 0;
    for (int n : nums) result ^= n;   // pairs cancel, the loner survives
    return result;
}
// O(n) time, O(1) space — no hash map needed`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Counting set bits',
        body: 'The loop `while (n) { count++; n &= (n - 1); }` counts 1-bits in as many steps as there are 1-bits, rather than checking all 32 positions. C++20 also offers `popcount(n)` from `<bit>`, and GCC has `__builtin_popcount(n)`, which LeetCode accepts.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Shifting by 32 or more is undefined',
        body: '`1 << 32` on a 32-bit `int` is undefined behaviour — you may get 1, 0, or garbage, and it may differ between your machine and the judge. When you need a large bit mask, use `1LL << 40` so the shift happens in 64-bit. Also note `~` on a signed int flips the sign bit: `~5` is `-6`, not what beginners expect.',
      },
    ],
    keyTakeaways: [
      '`n & 1` tests oddness; `n << k` and `n >> k` multiply and divide by 2ᵏ.',
      '`x ^ x == 0` and `x ^ 0 == x` — XOR the whole array to find the unpaired element.',
      '`n & (n - 1)` clears the lowest set bit; `(n & (n - 1)) == 0` tests for a power of two.',
      'Shifting by ≥ 32 on an `int` is undefined — use `1LL <<` for wide masks.',
    ],
    practice: {
      prompt: 'Implement `countBits(n)` using the `n &= (n - 1)` loop, and `isPowerOfTwo(n)` using the one-line check. Then solve Single Number with XOR — the moment that clicks, an entire category of problems opens up.',
      leetcode: { title: 'Single Number', slug: 'single-number' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-2.9',
    language: 'cpp',
    summary: 'Know exactly what ++i and i++ differ on, and where the difference bites.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: '`++` adds one, `--` subtracts one. Both come in two forms, and the difference is *what the expression evaluates to*, not what happens to the variable. Either way the variable ends up incremented.',
      },
      {
        kind: 'code',
        caption: 'Prefix vs postfix',
        code: `int i = 5;
int a = ++i;    // PRE:  increment first, then use  → i = 6, a = 6

int j = 5;
int b = j++;    // POST: use first, then increment  → j = 6, b = 5`,
      },
      {
        kind: 'text',
        body: 'Remember it by reading left to right: in `++i` the `++` comes first, so the increment happens first. In `i++` the `i` comes first, so the old value is what you get.',
      },
      { kind: 'heading', text: 'Where it actually matters' },
      {
        kind: 'code',
        caption: 'The classic array-fill idiom',
        code: `int idx = 0;
result[idx++] = value;    // store at idx, THEN move to the next slot

// equivalent to:
result[idx] = value;
idx = idx + 1;`,
      },
      {
        kind: 'code',
        caption: 'Two-pointer loops rely on this',
        code: `// Reverse a string in place
while (left < right) {
    swap(s[left++], s[right--]);   // use the current positions, then move both
}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'In a plain for loop the two are identical',
        body: 'In `for (int i = 0; i < n; i++)` the result of the expression is discarded, so `i++` and `++i` behave the same. Some style guides prefer `++i` because for heavyweight types like iterators the postfix form must copy the old value first. For `int` the compiler optimises the difference away entirely — write whichever you find readable.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Never increment the same variable twice in one expression',
        body: 'Expressions like `i++ + ++i` or `arr[i] = i++;` are **undefined behaviour** — the standard does not specify the order, so different compilers give different answers and neither is wrong. If you need two increments, use two statements. Undefined behaviour is the worst class of bug because it can appear to work.',
      },
      {
        kind: 'code',
        caption: 'Incrementing an iterator',
        code: `for (auto it = v.begin(); it != v.end(); ++it) {
    cout << *it << " ";
}`,
      },
      {
        kind: 'text',
        body: 'Here `++it` genuinely is the better choice: `it++` has to construct a copy of the iterator to return the old value, and that copy is then thrown away. For `vector` iterators the cost is negligible, but the habit is free.',
      },
    ],
    keyTakeaways: [
      '`++i` yields the new value; `i++` yields the old one. Both increment the variable.',
      '`arr[idx++] = x` stores then advances — a core array-filling idiom.',
      'In a standalone `for` loop step, `i++` and `++i` are equivalent.',
      'Modifying a variable twice in one expression is undefined behaviour.',
    ],
    practice: {
      prompt: 'Print `i++` and `++i` side by side with the same starting value and confirm the outputs differ by one. Then write an in-place string reversal using `s[left++]` and `s[right--]` — it is the compact form of the two-pointer loop you will write dozens of times.',
      leetcode: { title: 'Reverse String', slug: 'reverse-string' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-2.10',
    language: 'cpp',
    summary: 'Know which operators bind tightest, and when to stop guessing and add brackets.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'Precedence decides how an expression groups when you have not said explicitly. `2 + 3 * 4` is 14, not 20, because `*` binds tighter than `+`.',
      },
      {
        kind: 'table',
        headers: ['Tightest first', 'Operators'],
        rows: [
          ['1', '`()` `[]` `->` `.`'],
          ['2', '`!` `~` `++` `--` unary `-` casts'],
          ['3', '`*` `/` `%`'],
          ['4', '`+` `-`'],
          ['5', '`<<` `>>`  (shifts)'],
          ['6', '`<` `<=` `>` `>=`'],
          ['7', '`==` `!=`'],
          ['8', '`&`  then  `^`  then  `|`'],
          ['9', '`&&`  then  `||`'],
          ['10', '`?:`  then  `=` `+=` `-=` …'],
        ],
      },
      { kind: 'heading', text: 'The three that actually catch people' },
      {
        kind: 'code',
        caption: '1. Bitwise operators bind looser than comparison',
        code: `if (n & 1 == 0) { ... }      // parses as  n & (1 == 0)  →  n & 0  →  always 0!
if ((n & 1) == 0) { ... }    // correct`,
      },
      {
        kind: 'text',
        body: 'This is the single most common precedence bug in C++. `==` binds tighter than `&`, so the comparison happens first and the whole condition becomes false. Always bracket bitwise tests.',
      },
      {
        kind: 'code',
        caption: '2. Shifts bind looser than arithmetic',
        code: `1 << 2 + 3;      // parses as  1 << (2 + 3)  =  32,  not (1 << 2) + 3 = 7`,
      },
      {
        kind: 'code',
        caption: '3. Assignment binds loosest of all',
        code: `int x = a > b ? a : b;      // fine — the ternary resolves before the assignment
bool ok = a == b;           // fine — == binds tighter than =`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The practical rule',
        body: 'Memorise just two things: `*` `/` `%` beat `+` `-`, and `&&` beats `||`. For everything else — especially anything involving `&`, `|`, `^`, `<<` or `>>` — add brackets. Nobody has ever lost marks in an interview for an extra pair of brackets, and plenty of people have lost an hour to a missing one.',
      },
      { kind: 'heading', text: 'Associativity: same precedence, which side first' },
      {
        kind: 'code',
        code: `10 - 4 - 3;      // left to right  →  (10 - 4) - 3  =  3
a = b = 5;       // right to left  →  a = (b = 5)  — both become 5`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Precedence is not evaluation order',
        body: 'Precedence says how an expression *groups*, not the sequence in which parts are computed. In `f() + g()`, C++ does not guarantee `f` runs before `g`. If both functions modify shared state, the result is unpredictable — so avoid side effects inside expressions.',
      },
    ],
    keyTakeaways: [
      '`*` `/` `%` bind tighter than `+` `-`; `&&` binds tighter than `||`.',
      '`==` binds tighter than `&` — always write `(n & 1) == 0`.',
      'Shifts bind looser than arithmetic: `1 << 2 + 3` is `32`.',
      'Precedence controls grouping, not the order functions are called in.',
    ],
    practice: {
      prompt: 'Print `n & 1 == 0` and `(n & 1) == 0` for n = 4 and see them disagree. Then predict the value of `2 + 3 * 4 - 6 / 2` before running it. Getting caught by the bitwise one now is far cheaper than during a contest.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-2.11',
    language: 'cpp',
    summary: 'Predict overflow from the constraints and defuse it before you write the loop.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Overflow is what happens when a value grows past what its type can hold. C++ does not warn you and does not stop — the value silently wraps around to a negative number, and your answer is quietly wrong.',
      },
      {
        kind: 'code',
        caption: 'Watching it wrap',
        code: `#include <climits>

int max = INT_MAX;          //  2147483647
cout << max + 1;            // -2147483648   — wrapped to the minimum`,
      },
      {
        kind: 'text',
        body: 'Signed integer overflow is formally **undefined behaviour**, which means the compiler is entitled to assume it never happens and optimise accordingly. In practice you see wraparound, but you cannot rely on it.',
      },
      { kind: 'heading', text: 'The limits worth knowing' },
      {
        kind: 'table',
        headers: ['Type', 'Maximum', 'Roughly'],
        rows: [
          ['`int`', '2,147,483,647', '2 × 10⁹'],
          ['`long long`', '9,223,372,036,854,775,807', '9 × 10¹⁸'],
          ['`unsigned int`', '4,294,967,295', '4 × 10⁹'],
        ],
      },
      {
        kind: 'code',
        code: `#include <climits>
INT_MAX, INT_MIN, LLONG_MAX, LLONG_MIN

// Modern alternative:
#include <limits>
numeric_limits<int>::max();`,
      },
      { kind: 'heading', text: 'Doing the arithmetic before you code' },
      {
        kind: 'text',
        body: 'This is the habit that prevents the bug. Read the constraints, multiply out the worst case, and compare it to 2 × 10⁹.',
      },
      {
        kind: 'table',
        headers: ['Constraint', 'Worst case', 'Type needed'],
        rows: [
          ['n ≤ 10⁵, values ≤ 10⁹, summed', '10¹⁴', '`long long`'],
          ['Two values ≤ 10⁵, multiplied', '10¹⁰', '`long long`'],
          ['Two values ≤ 10⁴, multiplied', '10⁸', '`int` is fine'],
          ['n ≤ 10⁵, counting pairs n(n−1)/2', '≈ 5 × 10⁹', '`long long`'],
        ],
      },
      { kind: 'heading', text: 'The four places overflow hides' },
      {
        kind: 'code',
        caption: '1. Accumulating a sum',
        code: `int sum = 0;                     // WRONG if the total can exceed 2e9
long long sum = 0;               // safe
for (int n : nums) sum += n;`,
      },
      {
        kind: 'code',
        caption: '2. Multiplying two ints',
        code: `long long area = (long long)width * height;   // cast BEFORE multiplying`,
      },
      {
        kind: 'code',
        caption: '3. Binary search midpoint',
        code: `int mid = (low + high) / 2;          // low + high can overflow!
int mid = low + (high - low) / 2;    // safe — never exceeds high`,
      },
      {
        kind: 'text',
        body: 'This one is famous: it sat undetected in the Java standard library for nine years. When `low` and `high` are both near `INT_MAX`, their sum wraps negative and `mid` lands outside the array.',
      },
      {
        kind: 'code',
        caption: '4. Negating INT_MIN',
        code: `int x = INT_MIN;      // -2147483648
int y = -x;           // OVERFLOW — +2147483648 does not fit in an int
int z = abs(x);       // same problem`,
      },
      {
        kind: 'text',
        body: 'The negative range is one larger than the positive range, so `INT_MIN` has no positive counterpart. Problems that ask you to reverse or negate an integer often use exactly this as a hidden test case.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Detecting overflow before it happens',
        body: 'Instead of adding and checking afterwards (too late — the result is already undefined), check whether the operation *would* overflow: `if (a > INT_MAX - b)` before computing `a + b`. For multiplication, `if (a > INT_MAX / b)` before `a * b`. Problems like Reverse Integer require exactly this.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'unsigned wraps to a huge positive, not a negative',
        body: 'Because `size()` returns an unsigned type, `v.size() - 1` on an empty vector gives 18,446,744,073,709,551,615 rather than −1. A loop guarded by `i >= 0` then never ends. Cast to `int` before subtracting from `size()`.',
      },
    ],
    keyTakeaways: [
      '`int` overflows past ≈ 2 × 10⁹, silently wrapping to a negative value.',
      'Multiply out the constraints before coding to decide `int` vs `long long`.',
      'Use `low + (high - low) / 2` for binary search midpoints.',
      '`-INT_MIN` and `abs(INT_MIN)` overflow; `size() - 1` on an empty container wraps huge.',
    ],
    practice: {
      prompt: 'Print `INT_MAX + 1` and watch it go negative. Then write Reverse Integer, which returns 0 when the reversed value would overflow — solving it properly forces you to use the "check before you compute" pattern rather than detecting damage after the fact.',
      leetcode: { title: 'Reverse Integer', slug: 'reverse-integer' },
    },
  },
];
