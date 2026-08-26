import type { Lesson } from '../types';

/**
 * Java Chapter 2 — Variables, Data Types, and Operators.
 * The chapter where the primitive/wrapper split, autoboxing and overflow get
 * caught before they cost a submission.
 */
export const ch02: Lesson[] = [
  // -------------------------------------------------------------------------
  {
    topicId: 'java-2.1',
    language: 'java',
    summary: 'Understand the eight primitives and how they differ from every other type.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Java has exactly **eight primitive types**. Everything else — `String`, arrays, `ArrayList`, your own classes — is an object. That split shapes how values are stored, compared and passed.',
      },
      {
        kind: 'table',
        headers: ['Type', 'Bits', 'Range', 'Default'],
        rows: [
          ['`byte`', '8', '−128 to 127', '0'],
          ['`short`', '16', '±32,767', '0'],
          ['`int`', '32', '±2.1 × 10⁹', '0'],
          ['`long`', '64', '±9.2 × 10¹⁸', '0L'],
          ['`float`', '32', '≈7 digits', '0.0f'],
          ['`double`', '64', '≈15 digits', '0.0'],
          ['`char`', '16', '0 to 65,535 (Unicode)', "'\\u0000'"],
          ['`boolean`', '—', '`true` / `false`', '`false`'],
        ],
      },
      {
        kind: 'code',
        code: `int count = 0;
long big = 10000000000L;      // L suffix required — the literal is int by default
double avg = 4.5;
float f = 4.5f;               // f suffix required
char grade = 'A';
boolean found = false;`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Large literals need the L suffix',
        body: '`long big = 10000000000;` fails to compile with `integer number too large` — the literal is parsed as an `int` before it is ever assigned. The `L` tells the compiler it is a `long` from the start. Same idea for `float f = 4.5f;` since decimal literals default to `double`.',
      },
      { kind: 'heading', text: 'Primitives vs objects' },
      {
        kind: 'table',
        headers: ['', 'Primitive', 'Object'],
        rows: [
          ['Stores', 'The value itself', 'A reference to the value'],
          ['Can be null', 'No', '**Yes**'],
          ['Compared with', '`==` (value)', '`.equals()` (content)'],
          ['Default value', '0 / false', '`null`'],
          ['Has methods', 'No', 'Yes'],
          ['In collections', '**Not directly**', 'Yes'],
        ],
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Collections cannot hold primitives',
        body: '`List<int>` does not compile — generics only work with objects. You must write `List<Integer>`, which is why the wrapper classes exist and why autoboxing matters so much in Java DSA code. `int[]` is fine; `List<int>` is not.',
      },
      {
        kind: 'code',
        code: `int[] arr = new int[5];              // fine — arrays hold primitives
List<int> bad;                       // ERROR
List<Integer> good = new ArrayList<>();   // wrapper required`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Local variables are not auto-initialised',
        body: 'The defaults in the table apply to **fields**. A local variable inside a method must be assigned before use, or the compiler refuses with `variable might not have been initialized`. Java catches this at compile time — unlike C++, where uninitialised locals silently hold garbage.',
      },
    ],
    keyTakeaways: [
      'Eight primitives; everything else is an object holding a reference.',
      'Large literals need `L`, decimal literals need `f` for float.',
      'Collections need wrappers — `List<Integer>`, never `List<int>`.',
      'Local variables must be assigned before use; the compiler enforces it.',
    ],
    practice: {
      prompt: 'Declare all eight primitives and print their values. Then try `long big = 10000000000;` without the `L` and read the error. Then declare a local `int` and use it before assigning — Java catching that at compile time is a genuine advantage over C++.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-2.2',
    language: 'java',
    summary: 'Pick the right numeric type by reading the problem constraints.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Type choice is not style in DSA — it decides whether your answer is correct. Read the constraints, multiply out the worst case, and compare against 2.1 × 10⁹.',
      },
      {
        kind: 'table',
        headers: ['Constraint', 'Worst case', 'Type needed'],
        rows: [
          ['n ≤ 10⁵, values ≤ 10⁹, summed', '10¹⁴', '`long`'],
          ['Two values ≤ 10⁵, multiplied', '10¹⁰', '`long`'],
          ['Two values ≤ 10⁴, multiplied', '10⁸', '`int` is fine'],
          ['Counting pairs, n ≤ 10⁵: n(n−1)/2', '≈5 × 10⁹', '`long`'],
        ],
      },
      {
        kind: 'code',
        code: `long sum = 0;
for (int x : nums) sum += x;         // safe even for 10^5 values of 10^9

long product = (long) a * b;         // cast BEFORE multiplying`,
      },
      { kind: 'heading', text: 'char is a number' },
      {
        kind: 'code',
        code: `char c = 'a';
int position = c - 'a';              // 0 — 'a' maps to index 0

boolean isDigit = (c >= '0' && c <= '9');
int digit = c - '0';                 // '5' → 5

// The frequency-array idiom you will use constantly:
int[] freq = new int[26];
for (char ch : word.toCharArray()) freq[ch - 'a']++;`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Java arrays are zero-initialised',
        body: 'Unlike C++, `new int[26]` gives you 26 zeros automatically — no `= {0}` needed. That removes one of the most common C++ frequency-counting bugs entirely. Object arrays are filled with `null` instead.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Strings are not char arrays',
        body: 'Java has no `s[i]` indexing on a `String`. Use `s.charAt(i)`, or convert once with `s.toCharArray()` when you need repeated access — the conversion is O(n) but then indexing is a plain array access, which is faster inside a tight loop.',
      },
      {
        kind: 'code',
        code: `String s = "hello";
s.charAt(0);                     // 'h'
// s[0];                         // ERROR — no array indexing on String

char[] chars = s.toCharArray();  // O(n) once
chars[0];                        // then plain array access
new String(chars);               // convert back`,
      },
      { kind: 'heading', text: 'Never compare doubles with ==' },
      {
        kind: 'code',
        code: `double a = 0.1 + 0.2;
a == 0.3;                             // FALSE — a is 0.30000000000000004

Math.abs(a - 0.3) < 1e-9;             // true — compare within a tolerance`,
      },
      {
        kind: 'text',
        body: 'Binary floating point cannot represent 0.1 exactly. Compare against a small epsilon, or better, restructure to use integers — many problems that look like they need division can be rearranged to avoid it.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'boolean[] for visited arrays',
        body: '`new boolean[n]` gives n `false` values and is the idiomatic visited array. Unlike C++, there is no `vector<bool>` bit-packing weirdness — `boolean[]` behaves like any other array.',
      },
    ],
    keyTakeaways: [
      'Multiply out the constraints to decide `int` versus `long`.',
      '`char` is a number: `c - \'a\'` gives an index, `c - \'0\'` a digit value.',
      'Java arrays are zero-initialised automatically.',
      '`String` has no `[]` — use `charAt(i)` or `toCharArray()`.',
    ],
    practice: {
      prompt: 'Count letter frequencies in a lowercase string with `int[26]` and the `ch - \'a\'` idiom, using `toCharArray()`. Then print `0.1 + 0.2 == 0.3` and see it come out false. Both idioms recur constantly from here on.',
      leetcode: { title: 'Valid Anagram', slug: 'valid-anagram' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-2.3',
    language: 'java',
    summary: 'Understand autoboxing, and the three ways it silently causes bugs.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Every primitive has an object **wrapper**: `int`→`Integer`, `long`→`Long`, `char`→`Character`, `boolean`→`Boolean`, and so on. Wrappers exist because collections and generics can only hold objects.',
      },
      {
        kind: 'code',
        code: `int primitive = 5;
Integer wrapper = 5;              // AUTOBOXING — int becomes Integer
int back = wrapper;               // AUTO-UNBOXING — Integer becomes int

List<Integer> list = new ArrayList<>();
list.add(5);                      // autoboxed automatically
int x = list.get(0);              // auto-unboxed`,
      },
      {
        kind: 'text',
        body: 'The conversion is automatic, which is convenient and also why the resulting bugs are hard to see — nothing in the code marks where a boxing happens.',
      },
      { kind: 'heading', text: 'Bug 1 — == compares references' },
      {
        kind: 'code',
        code: `Integer a = 127, b = 127;
a == b;              // true  — cached

Integer c = 128, d = 128;
c == d;              // FALSE — outside the cache

c.equals(d);         // true — always use equals
c.intValue() == d.intValue();     // or unbox explicitly`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Java caches Integers from −128 to 127',
        body: 'So `==` on wrappers works for small values and silently fails for large ones — passing every small test case and failing on real input. Whenever you compare values pulled from a `List<Integer>` or `Map<Integer,Integer>`, use `.equals()` or unbox first.',
      },
      { kind: 'heading', text: 'Bug 2 — unboxing null throws' },
      {
        kind: 'code',
        code: `Map<String,Integer> m = new HashMap<>();
int n = m.get("missing");         // NullPointerException — get returns null

// Safe alternatives:
int n = m.getOrDefault("missing", 0);
Integer n = m.get("missing");     // keep it boxed, check for null
if (m.containsKey(k)) { ... }`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'getOrDefault is the idiom to internalise',
        body: 'In C++, `map[key]` default-constructs a zero. Java\'s `get` returns `null`, and unboxing that throws. `getOrDefault(key, 0)` is the direct equivalent and prevents the entire class of bug. For counting, `map.merge(key, 1, Integer::sum)` or `map.put(k, map.getOrDefault(k, 0) + 1)` are both idiomatic.',
      },
      { kind: 'heading', text: 'Bug 3 — the performance cost' },
      {
        kind: 'code',
        code: `// Slow — every operation allocates an Integer object
Long sum = 0L;
for (int x : nums) sum += x;      // unbox, add, re-box — n allocations

// Fast — no boxing at all
long sum = 0;
for (int x : nums) sum += x;`,
      },
      {
        kind: 'text',
        body: 'Wrappers are immutable objects, so `sum += x` on a `Long` creates a brand-new object every iteration. On 10⁵ elements that is 10⁵ allocations for no reason. Use primitives for accumulators and loop counters; use wrappers only where a collection forces you to.',
      },
      {
        kind: 'code',
        caption: 'The useful static methods on wrappers',
        code: `Integer.parseInt("42");           // String → int
Integer.valueOf("42");            // String → Integer
Integer.toString(42);             // int → String
Integer.MAX_VALUE;                // 2147483647
Integer.MIN_VALUE;
Long.MAX_VALUE;
Integer.bitCount(n);              // number of 1-bits
Character.isDigit(c);
Character.isLetter(c);
Character.toLowerCase(c);`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'int[] and List<Integer> are not interchangeable',
        body: '`Arrays.asList(intArray)` does **not** give you a `List<Integer>` — it gives a single-element `List<int[]>`. Converting requires a stream: `Arrays.stream(arr).boxed().collect(Collectors.toList())`. LeetCode signatures use `int[]` for input and often `List<Integer>` for output, so this conversion comes up regularly.',
      },
    ],
    keyTakeaways: [
      'Wrappers let primitives live in collections; boxing is automatic and invisible.',
      '`Integer` caching makes `==` work below 128 and fail above it — use `.equals()`.',
      'Unboxing a null (from `map.get`) throws — use `getOrDefault`.',
      'Use primitives for accumulators; boxing in a loop allocates every iteration.',
    ],
    practice: {
      prompt: 'Compare `Integer` 127 and 128 pairs with `==` and watch the result flip. Then unbox a missing map key into an `int` and read the NPE. Then time a `Long` accumulator against a `long` one over a million elements — the allocation cost is clearly visible.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-2.4',
    language: 'java',
    summary: 'Convert between types deliberately, and spot the conversions Java does silently.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Java performs **widening** conversions automatically — `int` to `long`, `int` to `double` — because no information is lost. **Narrowing** conversions require an explicit cast, because they can lose data.',
      },
      {
        kind: 'code',
        code: `int i = 42;
long l = i;                  // widening — automatic
double d = i;                // widening — automatic

double x = 3.9;
int n = (int) x;             // narrowing — cast REQUIRED, gives 3

long big = 10000000000L;
int truncated = (int) big;   // compiles, silently loses data`,
      },
      { kind: 'heading', text: 'The two casts that matter in DSA' },
      {
        kind: 'code',
        caption: '1. Integer division',
        code: `int a = 7, b = 2;
double wrong = a / b;                 // 3.0 — divided as ints first
double right = (double) a / b;        // 3.5

double avg = (double) sum / nums.length;      // the common case`,
      },
      {
        kind: 'code',
        caption: '2. Overflow before widening',
        code: `int a = 100000, b = 100000;
long bad  = a * b;                    // OVERFLOWS then widens — wrong
long good = (long) a * b;             // widens then multiplies — correct`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'The cast must come before the operation',
        body: 'In both cases, casting the *result* is too late — the damage is already done. `(double)(a / b)` widens a value that has already been truncated; `(long)(a * b)` widens one that has already wrapped. Cast an operand, not the result.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: '(int) truncates toward zero, it does not round',
        body: '`(int) 3.9` is `3` and `(int) -3.9` is `-3`. For actual rounding use `Math.round()`, `Math.floor()` or `Math.ceil()`. Note `Math.round` returns a `long` for a `double` input, so it often needs its own cast: `(int) Math.round(x)`.',
      },
      { kind: 'heading', text: 'Converting to and from Strings' },
      {
        kind: 'code',
        code: `int n = Integer.parseInt("42");
long l = Long.parseLong("10000000000");
double d = Double.parseDouble("3.14");

String s = String.valueOf(42);
String s = Integer.toString(42);
String s = "" + 42;                   // works, but allocates — prefer the above

char c = '7';
int digit = c - '0';                  // 7 — arithmetic, no parsing needed
int digit = Character.getNumericValue(c);`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'parseInt throws on bad input',
        body: '`Integer.parseInt("abc")` throws `NumberFormatException`, which on the judge is a Runtime Error. If input might not be a clean number, validate first or wrap in a try/catch. For a single digit character, `c - \'0\'` is faster and cannot throw.',
      },
      {
        kind: 'code',
        caption: 'Casting objects',
        code: `Object o = "hello";
String s = (String) o;                // downcast — checked at runtime

Object n = Integer.valueOf(5);
String bad = (String) n;              // compiles, throws ClassCastException

if (o instanceof String str) { ... }  // safe, and binds str (Java 16+)`,
      },
      {
        kind: 'text',
        body: 'Object casts are verified at runtime rather than compile time, so a wrong one throws `ClassCastException`. This rarely comes up in DSA — generics handle types for you — but `instanceof` appears in design problems involving mixed types.',
      },
    ],
    keyTakeaways: [
      'Widening is automatic; narrowing needs an explicit cast.',
      'Cast an **operand** before dividing or multiplying, never the result.',
      '`(int)` truncates toward zero — use `Math.round`/`floor`/`ceil` to round.',
      '`parseInt` throws on malformed input; `c - \'0\'` cannot.',
    ],
    practice: {
      prompt: 'Compute an average as a `double` the wrong way, confirm it is a whole number, then fix it with a cast. Then multiply 100000 by 100000 into a `long` both ways and watch only the correctly-placed cast survive.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-2.5',
    language: 'java',
    summary: 'Lock values, methods and classes — and know what final does not guarantee.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: '`final` means "this cannot be reassigned after initialisation". It applies to variables, methods and classes, with a different meaning in each position.',
      },
      {
        kind: 'code',
        caption: 'final variables',
        code: `final int MAX = 100;
MAX = 200;                            // ERROR — cannot assign a final variable

static final int MOD = 1_000_000_007; // the modulus counting problems use

final int[] arr = {1, 2, 3};
arr[0] = 99;                          // ALLOWED — the array contents are not final
arr = new int[5];                     // ERROR — the reference is`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'final freezes the reference, not the object',
        body: 'A `final List` cannot be pointed at a different list, but you can still `add` to it all day. This is the single most misunderstood thing about `final`: it is about the *variable*, not the contents. For genuinely unmodifiable contents you need `List.of(...)` or `Collections.unmodifiableList(...)`.',
      },
      {
        kind: 'code',
        code: `final List<Integer> list = new ArrayList<>();
list.add(1);                          // fine — contents are mutable
list = new ArrayList<>();             // ERROR — reference is final

List<Integer> frozen = List.of(1, 2, 3);
frozen.add(4);                        // UnsupportedOperationException at runtime`,
      },
      { kind: 'heading', text: 'final methods and classes' },
      {
        kind: 'code',
        code: `class Base {
    final void cannotOverride() { ... }    // subclasses may not replace this
}

final class CannotExtend { ... }           // no subclass may be written

// String is final — which is why it is safe to share and cache`,
      },
      {
        kind: 'text',
        body: '`String` being `final` and immutable is why Java can pool string literals and why `String` is safe to use as a `HashMap` key — its hash code can never change after insertion.',
      },
      { kind: 'heading', text: 'Where it appears in DSA' },
      {
        kind: 'code',
        code: `class Solution {
    private static final int MOD = 1_000_000_007;
    private static final int[] DR = {-1, 1, 0, 0};
    private static final int[] DC = {0, 0, -1, 1};

    public int solve(int[][] grid) {
        // DR and DC are shared constants — no need to rebuild them per call
    }
}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'static final for direction arrays and moduli',
        body: 'Declaring them once at class level rather than inside the method avoids reallocating on every call, and the naming convention signals immediately that they are constants. It is a small habit that makes grid solutions read more cleanly.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Lambdas require effectively final captures',
        body: 'A lambda or anonymous class can only capture local variables that are never reassigned — "effectively final", whether or not you wrote the keyword. `int count = 0; list.forEach(x -> count++);` does not compile. The workaround in DSA code is usually a one-element array (`int[] count = {0}`) or an instance field.',
      },
      {
        kind: 'code',
        code: `int count = 0;
nums.forEach(x -> count++);          // ERROR — count is not effectively final

int[] count = {0};
nums.forEach(x -> count[0]++);       // works — the reference never changes`,
      },
    ],
    keyTakeaways: [
      '`final` prevents reassignment of the variable, not mutation of the object.',
      '`static final` is the idiom for constants like `MOD` and direction arrays.',
      '`String` is final and immutable, which makes it a safe map key.',
      'Lambdas can only capture effectively-final locals.',
    ],
    practice: {
      prompt: 'Declare a `final List`, add to it successfully, then try to reassign it and read the error. Then write a lambda that tries to increment a local counter and see the "effectively final" error — the `int[]` workaround is worth knowing before you meet it in real code.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-2.6',
    language: 'java',
    summary: 'Use the arithmetic operators correctly, including integer division and modulo.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Addition and multiplication behave exactly as you expect. Division does not — and that single surprise causes more silently wrong answers than any other operator in this chapter. Java has two different divisions hiding behind one `/` symbol, and which one you get depends on the *types*, not on what you meant.',
      },
      {
        kind: 'code',
        code: `int a = 17, b = 5;

a + b;      // 22
a - b;      // 12
a * b;      // 85
a / b;      // 3   — integer division, remainder discarded
a % b;      // 2   — the remainder`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Truncation is often exactly what you want',
        body: 'Binary search uses `low + (high - low) / 2` and relies on it. Mapping a flat index into a grid uses `row = i / cols; col = i % cols;`. Integer division is a tool as often as it is a hazard — you just have to know when it is active.',
      },
      { kind: 'heading', text: 'The modulo operator' },
      {
        kind: 'code',
        code: `boolean isEven = (n % 2 == 0);
int lastDigit = n % 10;
int wrapped = (i + 1) % size;         // circular array
int bucket = key % tableSize;`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: '% on negatives is negative in Java',
        body: '`-7 % 3` is `-1`, not `2` — Java follows the same rule as C++, unlike Python. If you are wrapping an index backwards or hashing a possibly-negative key, the result can be negative and indexing with it throws. The fix is `((a % m) + m) % m`, which forces the result into `[0, m)`.',
      },
      {
        kind: 'code',
        code: `static int mod(int a, int m) {
    return ((a % m) + m) % m;
}
mod(-7, 3);        // 2`,
      },
      { kind: 'heading', text: 'Compound assignment hides a cast' },
      {
        kind: 'code',
        code: `int x = 5;
x += 3;            // x = x + 3
x *= 2;
x /= 4;
x %= 3;

// The subtle part:
int n = 5;
n += 1.5;          // COMPILES — compound assignment casts implicitly, n becomes 6
n = n + 1.5;       // ERROR — explicit form requires an explicit cast`,
      },
      {
        kind: 'text',
        body: 'Compound operators perform a hidden narrowing cast, so `n += 1.5` silently truncates while `n = n + 1.5` refuses to compile. It rarely bites in DSA but it is a classic interview trivia question.',
      },
      { kind: 'heading', text: 'The Math helpers' },
      {
        kind: 'code',
        code: `Math.abs(x);
Math.max(a, b);   Math.min(a, b);
Math.pow(2, 10);          // returns a DOUBLE — cast for integer work
Math.sqrt(16);            // double
Math.floor(x);  Math.ceil(x);  Math.round(x);

// Integer power without doubles:
int result = 1;
for (int i = 0; i < exp; i++) result *= base;

// Ceiling division without doubles:
int ceil = (a + b - 1) / b;`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Math.pow returns a double — avoid it for integers',
        body: '`(int) Math.pow(10, 2)` can give 99 on some inputs because of floating-point representation. For integer powers use a loop or repeated multiplication. The same caution applies to `Math.sqrt` when you need an exact integer square root — verify with `r * r == n` afterwards.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The 10⁹ + 7 modulus',
        body: 'Counting problems ask for answers "modulo 10^9 + 7" because the true count would overflow. Apply the modulus at every step, not just at the end, and use `long` for intermediates — two values just under 10⁹ multiply to nearly 10¹⁸.',
      },
    ],
    keyTakeaways: [
      '`int / int` truncates — deliberate in binary search, a bug when averaging.',
      '`-7 % 3` is `-1`; use `((a % m) + m) % m` when values may be negative.',
      'Compound assignment performs a hidden narrowing cast.',
      '`Math.pow` returns a double — use loops for exact integer powers.',
    ],
    practice: {
      prompt: 'Write a digit-reversal loop using `% 10` and `/ 10`. Then print `-7 % 3` and confirm it is `-1`, and check your safe-mod helper turns it into `2`. Then compare `(int) Math.pow(10, 2)` with a loop-based power on several exponents.',
      leetcode: { title: 'Reverse Integer', slug: 'reverse-integer' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-2.7',
    language: 'java',
    summary: 'Compare values correctly — and know when == is the wrong tool entirely.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Relational operators answer yes/no questions and always produce a `boolean`. They are the simplest operators in Java with one enormous exception: `==` does **not** mean "has the same value" for objects. It means "is the same object". Getting that distinction wrong is the defining Java beginner bug, and this lesson is where you learn to avoid it for good.',
      },
      {
        kind: 'table',
        headers: ['Operator', 'Meaning'],
        rows: [
          ['`==` `!=`', 'Equal / not equal — **value** for primitives, **reference** for objects'],
          ['`<` `>` `<=` `>=`', 'Ordering — primitives only'],
        ],
      },
      {
        kind: 'code',
        code: `int a = 5, b = 5;
a == b;                    // true — primitives compare by value

String s1 = new String("hi"), s2 = new String("hi");
s1 == s2;                  // FALSE — different objects
s1.equals(s2);             // true — compares content`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'The defining Java bug: == on objects',
        body: 'For any object — `String`, `Integer`, your own classes — `==` asks "are these the same object in memory", not "do they hold the same value". It appears to work for string literals (Java pools them) and for small `Integer`s (cached), then fails for anything built at runtime. **Use `.equals()` for every object comparison.**',
      },
      { kind: 'heading', text: 'Comparing strings' },
      {
        kind: 'code',
        code: `s1.equals(s2);                  // content equality
s1.equalsIgnoreCase(s2);        // case-insensitive
s1.compareTo(s2);               // <0, 0, or >0 — lexicographic ordering

// Null-safe, in either order:
Objects.equals(s1, s2);

// A null-safe idiom worth knowing:
"target".equals(userInput);     // never throws, even if userInput is null`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Put the literal first to avoid a null check',
        body: '`userInput.equals("target")` throws if `userInput` is null. `"target".equals(userInput)` returns false instead. Reversing the order is a free null guard — a small idiom that shows up throughout production Java.',
      },
      { kind: 'heading', text: 'Ordering objects' },
      {
        kind: 'code',
        code: `// You cannot use < or > on objects:
Integer a = 5, b = 10;
a < b;                          // works — auto-unboxed to int
// but for non-numeric objects:
"apple" < "banana";             // ERROR — no operator overloading in Java

"apple".compareTo("banana");    // negative — lexicographic
Integer.compare(a, b);          // -1, 0, or 1 — no overflow risk`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Use Integer.compare, not subtraction, in comparators',
        body: 'Writing `(a, b) -> a - b` looks fine and overflows when `a` is large and `b` is very negative, giving a wrong ordering and occasionally a crash inside the sort. `Integer.compare(a, b)` cannot overflow. This is a genuine bug that only appears on extreme inputs.',
      },
      {
        kind: 'code',
        caption: 'Lexicographic order is not alphabetical order',
        code: `"Zebra".compareTo("apple");     // negative — 'Z' is 90, 'a' is 97

// All uppercase sorts before all lowercase. Normalise the case first
// if a problem wants case-insensitive ordering.`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Java has no chained comparison',
        body: 'Unlike Python, `0 <= x <= 10` does not compile in Java — which is an improvement on C++, where it compiles and silently means something else. Write `0 <= x && x <= 10`.',
      },
    ],
    keyTakeaways: [
      '`==` compares values for primitives and references for objects.',
      'Use `.equals()` for every object comparison, including `Integer` and `String`.',
      'Put the literal first — `"x".equals(input)` is a free null guard.',
      'Use `Integer.compare(a, b)` in comparators, never `a - b`.',
    ],
    practice: {
      prompt: 'Compare two runtime-built strings with `==` and then `.equals()`. Then write a comparator using `a - b` and test it with `Integer.MIN_VALUE` — the overflow produces a visibly wrong ordering, which is why the rule exists.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-2.8',
    language: 'java',
    summary: 'Combine conditions with && and ||, and use short-circuiting as a safety guard.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Logical operators glue yes/no questions together: "is the index in range **and** is the value even?". The part worth learning properly is **short-circuiting** — `&&` stops the moment it finds a false, and `||` stops at the first true. That is not just a speed optimisation; it is the standard way to guard an array access, and you will write it in almost every DSA loop.',
      },
      {
        kind: 'table',
        headers: ['Operator', 'Name', 'True when'],
        rows: [
          ['`&&`', 'AND', 'both sides are true — short-circuits'],
          ['`||`', 'OR', 'at least one is true — short-circuits'],
          ['`!`', 'NOT', 'flips the value'],
          ['`&` `|`', 'Non-short-circuit AND/OR', 'Both sides always evaluated'],
        ],
      },
      {
        kind: 'text',
        body: '`&&` stops as soon as the left side is false; `||` stops as soon as it is true. That is not merely an optimisation — it is a correctness tool you will rely on constantly.',
      },
      {
        kind: 'code',
        caption: 'Guarding before you access',
        code: `// SAFE — if i is out of range, nums[i] is never evaluated
if (i < nums.length && nums[i] == target) { ... }

// THROWS — nums[i] runs even when i is out of range
if (nums[i] == target && i < nums.length) { ... }

// SAFE — null check first
if (node != null && node.val == target) { ... }`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'The order of the two conditions is the entire difference',
        body: 'Guard first, access second. This pattern is everywhere — linked lists, grids, map lookups. In Java the failure is a clear `ArrayIndexOutOfBoundsException` or `NullPointerException` rather than C++\'s silent memory read, but it is still a Runtime Error on the judge.',
      },
      {
        kind: 'code',
        caption: 'The same idiom in three contexts',
        code: `// Linked list
while (node != null && node.val != target) node = node.next;

// 2D grid — check both bounds before reading
if (r >= 0 && r < rows && c >= 0 && c < cols && grid[r][c] == 1) { ... }

// Fast/slow pointers — two levels deep
while (fast != null && fast.next != null) { ... }`,
      },
      { kind: 'heading', text: 'Java is stricter than C++ here' },
      {
        kind: 'code',
        code: `int x = 5;
if (x) { ... }              // ERROR in Java — int is not boolean
if (x != 0) { ... }         // required

if (list) { ... }           // ERROR — object is not boolean
if (list != null) { ... }   // required

int count = 1;
if (count = 1) { ... }      // ERROR — assignment does not produce a boolean`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Java eliminates two classic C++ bugs',
        body: 'Because conditions must be genuinely `boolean`, `if (x = 5)` and `if (nonZeroInt)` are compile errors rather than silent misbehaviour. That is a real advantage — two of C++\'s most common beginner traps simply cannot occur.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: '& and | do not short-circuit',
        body: '`if (node != null & node.val == 5)` evaluates both sides and throws a NullPointerException. For booleans, `&` and `|` are valid but almost never what you want — they exist mainly for bitwise use on integers. A single `&` where you meant `&&` is a genuine bug.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'De Morgan\'s laws simplify negated conditions',
        body: '`!(a && b)` equals `!a || !b`, and `!(a || b)` equals `!a && !b`. When a condition reads awkwardly with a `!` around the whole thing, pushing the negation inward usually makes it clearer.',
      },
    ],
    keyTakeaways: [
      '`&&` and `||` short-circuit — put the guard condition first.',
      'Java requires genuine booleans, so `if (x = 5)` is a compile error.',
      '`&` and `|` do not short-circuit; a single `&` is usually a typo.',
      'Match the guard depth to the access: `fast != null && fast.next != null`.',
    ],
    practice: {
      prompt: 'Write a safe bounds-checked array access relying on short-circuiting, then flip the two conditions and watch it throw. Then try `if (x = 5)` and confirm Java refuses to compile it — that strictness is worth appreciating if you are coming from C++.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-2.9',
    language: 'java',
    summary: 'Manipulate bits, including the unsigned shift Java has and C++ does not.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Every `int` is really 32 on/off switches, and bitwise operators let you work with those switches directly. You will not need this for your first few dozen problems — but a small family of questions ("find the number that appears once", "count the set bits") becomes almost trivial with it, and interviewers like asking them precisely because they separate people who know the trick from people who do not.',
      },
      {
        kind: 'table',
        headers: ['Operator', 'Name', 'Effect'],
        rows: [
          ['`&`', 'AND', '1 where both bits are 1'],
          ['`|`', 'OR', '1 where either bit is 1'],
          ['`^`', 'XOR', '1 where the bits differ'],
          ['`~`', 'NOT', 'Flips every bit'],
          ['`<<`', 'Left shift', 'Multiply by 2ᵏ'],
          ['`>>`', 'Arithmetic right shift', 'Divide by 2ᵏ, keeping the sign'],
          ['`>>>`', '**Unsigned** right shift', 'Fills with 0 — Java only'],
        ],
      },
      {
        kind: 'code',
        code: `int a = 12;   // 1100
int b = 10;   // 1010

a & b;        //  8 → 1000
a | b;        // 14 → 1110
a ^ b;        //  6 → 0110
a << 1;       // 24
a >> 1;       //  6`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: '>>> is Java-specific and genuinely useful',
        body: 'Java has no unsigned types, so `-8 >> 1` keeps the sign bit and gives `-4`, while `-8 >>> 1` fills with zeros and gives 2147483644. Problems like Reverse Bits and Number of 1 Bits treat the input as unsigned, and `>>>` is what makes the loop terminate — with `>>` a negative number shifts forever.',
      },
      {
        kind: 'code',
        code: `int n = -8;
n >> 1;        // -4          — sign-extending
n >>> 1;       // 2147483644  — zero-filling

// This is why bit-counting loops use >>>:
int count = 0;
while (n != 0) { count += (n & 1); n >>>= 1; }    // terminates
// with >>= it would loop forever on a negative n`,
      },
      { kind: 'heading', text: 'The idioms worth memorising' },
      {
        kind: 'code',
        code: `boolean even = (n & 1) == 0;          // parity
n << 3;                                // n * 8
n >> 2;                                // n / 4

boolean bit = ((n >> i) & 1) == 1;     // read the i-th bit
n |= (1 << i);                         // set it
n &= ~(1 << i);                        // clear it
n ^= (1 << i);                         // toggle it

int lowest = n & (-n);                 // isolate the lowest set bit
n &= (n - 1);                          // clear the lowest set bit

boolean isPow2 = n > 0 && (n & (n - 1)) == 0;`,
      },
      { kind: 'heading', text: 'XOR unlocks a whole problem family' },
      {
        kind: 'code',
        code: `// x ^ x == 0   and   x ^ 0 == x   and order does not matter

public int singleNumber(int[] nums) {
    int result = 0;
    for (int n : nums) result ^= n;    // pairs cancel, the loner survives
    return result;
}
// O(n) time, O(1) space — no HashSet needed`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Integer has the bit helpers built in',
        body: '`Integer.bitCount(n)` counts 1-bits, `Integer.toBinaryString(n)` shows the bits, `Integer.highestOneBit(n)` and `Integer.reverse(n)` are also available. They are allowed on LeetCode and save writing the loop — though interviewers often want the manual version too.',
      },
      {
        kind: 'code',
        code: `Integer.bitCount(12);            // 2
Integer.toBinaryString(12);      // "1100"
Integer.numberOfTrailingZeros(8);// 3
Long.bitCount(bigValue);`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Precedence: == binds tighter than &',
        body: '`if (n & 1 == 0)` parses as `n & (1 == 0)` — and in Java that is a compile error rather than a silent bug, because `int & boolean` is illegal. Java catches what C++ silently miscomputes, but you still need the brackets: `(n & 1) == 0`.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Shifting by 32 or more wraps the shift count',
        body: 'Java masks the shift distance to 5 bits for `int`, so `1 << 32` is `1 << 0` = 1, not 0. This is defined behaviour (unlike C++, where it is undefined) but still surprising. For wide masks use `1L << 40` so the shift happens in 64-bit.',
      },
    ],
    keyTakeaways: [
      '`>>>` is Java\'s zero-filling right shift — essential for treating ints as unsigned.',
      '`(n & 1)` tests oddness; `n & (n - 1)` clears the lowest set bit.',
      'XOR the whole array to find the unpaired element in O(1) space.',
      '`1 << 32` wraps to `1 << 0` in Java — use `1L <<` for wide masks.',
    ],
    practice: {
      prompt: 'Write a bit-counting loop with `>>=` on a negative number and watch it hang, then fix it with `>>>=`. Then solve Single Number with XOR and Number of 1 Bits both manually and with `Integer.bitCount`.',
      leetcode: { title: 'Single Number', slug: 'single-number' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-2.10',
    language: 'java',
    summary: 'Know which operators bind tightest, and when to stop guessing and bracket.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'When an expression mixes operators, Java applies them in a fixed order — the same "multiply before you add" rule you already know from arithmetic, extended to every operator in the language. You do not need to memorise the whole table. You need to know the three places it surprises people, and to reach for brackets everywhere else.',
      },
      {
        kind: 'table',
        headers: ['Tightest first', 'Operators'],
        rows: [
          ['1', '`()` `[]` `.` postfix `++` `--`'],
          ['2', 'prefix `++` `--` `!` `~` casts'],
          ['3', '`*` `/` `%`'],
          ['4', '`+` `-`'],
          ['5', '`<<` `>>` `>>>`'],
          ['6', '`<` `<=` `>` `>=` `instanceof`'],
          ['7', '`==` `!=`'],
          ['8', '`&` then `^` then `|`'],
          ['9', '`&&` then `||`'],
          ['10', '`?:` then `=` `+=` `-=` …'],
        ],
      },
      { kind: 'heading', text: 'The ones that actually catch people' },
      {
        kind: 'code',
        caption: '1. Bitwise binds looser than comparison',
        code: `if (n & 1 == 0) { ... }        // parses as n & (1 == 0) — compile error in Java
if ((n & 1) == 0) { ... }      // correct`,
      },
      {
        kind: 'text',
        body: 'Java turns this into a compile error because `int & boolean` is illegal — a real improvement over C++, where it compiles and silently evaluates to something else. You still need the brackets, but at least you find out immediately.',
      },
      {
        kind: 'code',
        caption: '2. Shifts bind looser than arithmetic',
        code: `1 << 2 + 3;        // parses as 1 << (2 + 3) = 32, not (1 << 2) + 3 = 7`,
      },
      {
        kind: 'code',
        caption: '3. String concatenation is left-to-right + ',
        code: `System.out.println("Sum: " + 1 + 2);      // "Sum: 12"  ← string first!
System.out.println("Sum: " + (1 + 2));    // "Sum: 3"
System.out.println(1 + 2 + " total");     // "3 total"  ← numbers first`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'The concatenation trap is Java-specific',
        body: 'Once a `String` appears on the left, every subsequent `+` becomes concatenation. `"Sum: " + 1 + 2` gives `"Sum: 12"` rather than `"Sum: 3"`. Bracket the arithmetic. This shows up constantly in debug output and makes people think their calculation is wrong when only the printing is.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The practical rule',
        body: 'Memorise two things: `*` `/` `%` beat `+` `-`, and `&&` beats `||`. For everything else — especially anything with `&`, `|`, `^`, `<<`, `>>` — add brackets. Nobody has ever lost marks for an extra pair, and plenty of people have lost an hour to a missing one.',
      },
      { kind: 'heading', text: 'Associativity' },
      {
        kind: 'code',
        code: `10 - 4 - 3;        // left to right → (10 - 4) - 3 = 3
a = b = 5;         // right to left → a = (b = 5), both become 5`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Java does fix evaluation order, unlike C++',
        body: 'Java guarantees operands are evaluated strictly left to right, so `f() + g()` always calls `f` first. In C++ that order is unspecified. It means expressions with side effects are at least predictable in Java — though they are still worth avoiding for readability.',
      },
    ],
    keyTakeaways: [
      '`*` `/` `%` bind tighter than `+` `-`; `&&` binds tighter than `||`.',
      '`==` binds tighter than `&` — always write `(n & 1) == 0`.',
      '`"x: " + 1 + 2` concatenates to `"x: 12"` — bracket the arithmetic.',
      'Java evaluates operands strictly left to right, unlike C++.',
    ],
    practice: {
      prompt: 'Print `"Sum: " + 1 + 2` and `"Sum: " + (1 + 2)` and note the difference — you will hit this in debug output within your first week. Then try `n & 1 == 0` and read the compile error Java gives you where C++ would have stayed silent.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-2.11',
    language: 'java',
    summary: 'Predict overflow from the constraints and defuse it before writing the loop.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Java integers wrap silently on overflow — no exception, no warning. Unlike C++ this is *defined* behaviour (two\'s-complement wraparound), which makes it predictable but no less wrong.',
      },
      {
        kind: 'code',
        code: `int max = Integer.MAX_VALUE;      //  2147483647
System.out.println(max + 1);      // -2147483648 — wrapped`,
      },
      {
        kind: 'table',
        headers: ['Type', 'Maximum', 'Roughly'],
        rows: [
          ['`int`', '2,147,483,647', '2 × 10⁹'],
          ['`long`', '9,223,372,036,854,775,807', '9 × 10¹⁸'],
        ],
      },
      {
        kind: 'text',
        body: 'Java has **no unsigned types**, so there is no unsigned-wraparound trap like C++\'s `size() - 1`. The flip side is that `int` tops out at half of what an `unsigned int` could hold.',
      },
      { kind: 'heading', text: 'The four places overflow hides' },
      {
        kind: 'code',
        caption: '1. Accumulating a sum',
        code: `int sum = 0;                       // WRONG if the total can exceed 2e9
long sum = 0;                      // safe
for (int x : nums) sum += x;`,
      },
      {
        kind: 'code',
        caption: '2. Multiplying two ints',
        code: `long area = (long) width * height;      // cast BEFORE multiplying`,
      },
      {
        kind: 'code',
        caption: '3. Binary search midpoint',
        code: `int mid = (low + high) / 2;             // low + high can overflow
int mid = low + (high - low) / 2;       // safe`,
      },
      {
        kind: 'text',
        body: 'This bug sat undetected in Java\'s own `Arrays.binarySearch` for nine years before Joshua Bloch wrote about it in 2006. If it survived that long in the standard library, it is worth writing the safe form by habit.',
      },
      {
        kind: 'code',
        caption: '4. Negating Integer.MIN_VALUE',
        code: `int x = Integer.MIN_VALUE;         // -2147483648
int y = -x;                        // OVERFLOWS — still -2147483648
int z = Math.abs(x);               // same problem — abs(MIN_VALUE) is negative!`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Math.abs(Integer.MIN_VALUE) is negative',
        body: 'The negative range is one larger than the positive range, so `MIN_VALUE` has no positive counterpart and `Math.abs` returns it unchanged — a negative "absolute value". Problems that reverse or negate integers use exactly this as a hidden test case.',
      },
      { kind: 'heading', text: 'Detecting overflow before it happens' },
      {
        kind: 'code',
        code: `// Check BEFORE computing — afterwards is too late
if (a > Integer.MAX_VALUE - b) { /* a + b would overflow */ }
if (a > Integer.MAX_VALUE / b) { /* a * b would overflow */ }

// Java 8+ throws instead of wrapping:
Math.addExact(a, b);         // throws ArithmeticException on overflow
Math.multiplyExact(a, b);
Math.toIntExact(longValue);  // throws if it does not fit`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The Math.*Exact methods are a Java advantage',
        body: 'They convert a silent wrong answer into a loud exception. In a problem like Reverse Integer, wrapping the arithmetic in `Math.addExact` and catching the exception is a clean way to detect overflow — though the explicit pre-check is usually what an interviewer expects to see.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'The habit that prevents all of this',
        body: 'Read the constraints, multiply out the worst case, and compare against 2 × 10⁹ — ten seconds before you write anything. If it can exceed that, use `long`. This single habit removes the most common category of silently wrong answers in Java DSA.',
      },
    ],
    keyTakeaways: [
      '`int` wraps silently past ±2.1 × 10⁹; Java has no unsigned types.',
      'Cast to `long` **before** multiplying, and use `low + (high - low) / 2`.',
      '`Math.abs(Integer.MIN_VALUE)` is negative — a standard hidden test case.',
      '`Math.addExact` / `multiplyExact` throw instead of wrapping.',
    ],
    practice: {
      prompt: 'Print `Integer.MAX_VALUE + 1` and `Math.abs(Integer.MIN_VALUE)` and confirm both are negative. Then solve Reverse Integer, which returns 0 when the result would overflow — it forces the check-before-you-compute pattern rather than detecting damage afterwards.',
      leetcode: { title: 'Reverse Integer', slug: 'reverse-integer' },
    },
  },
];
