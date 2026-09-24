import type { Lesson } from '../types';

/**
 * Chapter 43 — Idioms and Pitfalls (Java).
 * Twelve places where Java's rules differ from what the syntax suggests.
 * Most involve the line between primitives and objects, which is where a
 * program compiles cleanly and then does the wrong thing.
 */
export const ch43: Lesson[] = [
  // -------------------------------------------------------------------------
  {
    topicId: 'java-43.1',
    language: 'java',
    summary: 'Compare string contents with equals, and know why == sometimes appears to work.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'On objects, `==` asks whether two references point at the **same object**. `equals` asks whether two objects have the same **contents**. Strings are objects, so `a == b` compares addresses. It sometimes returns true anyway, because the compiler stores identical string literals once and reuses them, and that accident is what lets the bug survive until a string arrives from input or from concatenation.',
      },
      {
        kind: 'code',
        caption: 'Same contents, different answers',
        code: `String a = "hello";
String b = "hello";
System.out.println(a == b);          // true: both literals share one interned object

String c = new String("hello");
String d = "hel" + "lo";             // constant-folded at compile time: also interned
String e = sc.next();                // read "hello" from input: a fresh object
System.out.println(a == c);          // false
System.out.println(a.equals(c));     // true
System.out.println(a == e);          // false, even though e is "hello"
System.out.println(a.equals(e));     // true`,
        output: 'true\nfalse\ntrue\nfalse\ntrue',
      },
      {
        kind: 'table',
        headers: ['Want', 'Write'],
        rows: [
          ['Same contents', '`a.equals(b)`'],
          ['Same contents, ignoring case', '`a.equalsIgnoreCase(b)`'],
          ['Safe when `a` might be null', '`"literal".equals(a)` or `Objects.equals(a, b)`'],
          ['Dictionary order', '`a.compareTo(b)` (negative, zero, positive)'],
          ['Same object (rare)', '`a == b`'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'The same rule for every object',
        body: '`Integer`, `Character`, `List`, arrays, your own classes: `==` is identity for all of them. Arrays do not even override `equals`; compare them with `Arrays.equals(x, y)` (one level) or `Arrays.deepEquals` (nested). The next lesson covers the `Integer` case, which is the nastiest.',
      },
    ],
    keyTakeaways: [
      '`==` on strings compares references; `equals` compares contents.',
      'Literals are interned, which makes `==` accidentally true in tests and false on real input.',
      'Arrays need `Arrays.equals`; anything nullable is safest as `"x".equals(a)`.',
    ],
    practice: {
      prompt: 'Read two words from input that are the same and compare them with `==` and `equals`. Then compare `"ab" + "c"` with `"abc"` using `==`, and then do it again with one half stored in a variable first, and explain the difference.',
    },
  },
  // -------------------------------------------------------------------------
  {
    topicId: 'java-43.2',
    language: 'java',
    summary: 'Never compare Integer objects with ==, because it works for small values and fails for large ones.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: '`Integer` is the object form of `int`. Collections hold `Integer`, not `int`, so values you pull out of a `List<Integer>` or a `Map<String, Integer>` are objects. Java caches one `Integer` object for each value from -128 to 127 and reuses it, so `==` between two `Integer`s holding 100 is true. For 1000 it creates separate objects, and `==` is false. Code that compares list elements with `==` passes the sample tests and fails the hidden ones.',
      },
      {
        kind: 'code',
        caption: 'The cache boundary',
        code: `List<Integer> list = List.of(100, 100, 1000, 1000);
System.out.println(list.get(0) == list.get(1));       // true  (cached)
System.out.println(list.get(2) == list.get(3));       // false (two objects)
System.out.println(list.get(2).equals(list.get(3)));  // true
System.out.println(list.get(2).intValue() == list.get(3).intValue());  // true

Map<String, Integer> count = new HashMap<>();
// ...
if (count.get("a") == count.get("b")) ...   // wrong above 127
if (count.get("a").equals(count.get("b"))) ... // right (if neither is null)`,
        output: 'true\nfalse\ntrue\ntrue',
      },
      {
        kind: 'table',
        headers: ['Situation', 'Safe comparison'],
        rows: [
          ['Two `Integer` objects', '`a.equals(b)` or `a.intValue() == b.intValue()`'],
          ['`Integer` against an `int` literal', '`a == 5` is safe: `a` unboxes to `int`'],
          ['Either side may be null', '`Objects.equals(a, b)`'],
          ['Inside a comparator', '`Integer.compare(a, b)`, never `a - b` (overflow)'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Unboxing null',
        body: '`int x = map.get(key);` throws `NullPointerException` when the key is absent, because `null` cannot become an `int`. Use `map.getOrDefault(key, 0)`, or keep the result as `Integer` and check for null. This is the single most common NPE in map-based solutions.',
      },
    ],
    keyTakeaways: [
      '`Integer == Integer` compares references; it is true only for cached values -128..127.',
      'Use `equals`, `intValue()`, or compare against an `int`.',
      '`int x = map.get(k)` throws NPE when `k` is absent; use `getOrDefault`.',
    ],
    practice: {
      prompt: 'Fill a `List<Integer>` with 127, 127, 128, 128 and compare adjacent pairs with `==`. Then write a frequency count with a `HashMap` and find the key with the largest count without ever unboxing a null.',
    },
  },
  // -------------------------------------------------------------------------
  {
    topicId: 'java-43.3',
    language: 'java',
    summary: 'Know what a new array contains, and treat null in object arrays as the value it is.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'Unlike C++, Java always initialises arrays. `new int[n]` is n zeros, `new boolean[n]` is n falses, `new char[n]` is n NUL characters (code 0, not the character \'0\'). But an array of objects, `new String[n]` or `new ListNode[n]`, is n **nulls**, and calling a method on one of them is a `NullPointerException`.',
      },
      {
        kind: 'table',
        headers: ['Declaration', 'Every element is'],
        rows: [
          ['`new int[n]`, `new long[n]`', '0'],
          ['`new double[n]`', '0.0'],
          ['`new boolean[n]`', 'false'],
          ['`new char[n]`', '\'\\u0000\' (code 0), not \'0\''],
          ['`new String[n]`', 'null'],
          ['`new Integer[n]`', 'null (not 0!)'],
          ['`new int[r][c]`', 'r rows of c zeros'],
          ['`new int[r][]`', 'r nulls: rows must be created individually'],
        ],
      },
      {
        kind: 'code',
        caption: 'Object arrays start as null',
        code: `String[] names = new String[3];
System.out.println(names[0]);            // null
System.out.println(names[0].length());   // NullPointerException

Integer[] boxed = new Integer[3];
int x = boxed[0];                        // NullPointerException on unboxing

// Jagged 2D: create each row
int[][] tri = new int[4][];
for (int i = 0; i < 4; i++) tri[i] = new int[i + 1];

// Fill with a value other than the default
int[] dist = new int[n];
Arrays.fill(dist, Integer.MAX_VALUE);
int[][] dp = new int[n][m];
for (int[] row : dp) Arrays.fill(row, -1);   // fill works one dimension at a time`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Memo tables: pick a sentinel that cannot be an answer',
        body: 'A `new int[n]` memo table full of zeros cannot tell "not computed yet" from "the answer is 0". Fill with -1 when answers are non-negative, or use `Integer[]` and test for null when 0 and negatives are both possible answers.',
      },
    ],
    keyTakeaways: [
      'Primitive arrays start at 0 / false / \'\\u0000\'; object arrays start as null.',
      '`Arrays.fill` sets one dimension; loop over rows for 2D.',
      'Use a sentinel like -1, or `Integer[]` with null, for "not computed yet".',
    ],
    practice: {
      prompt: 'Create a `char[5]`, print it as a string, and note what you see. Then create a 5×5 `int` memo table filled with -1 in one loop. Then create a triangular jagged array and print its shape.',
    },
  },
  // -------------------------------------------------------------------------
  {
    topicId: 'java-43.4',
    language: 'java',
    summary: 'Tell remove(int index) from remove(Object) on a List<Integer>, and call the one you mean.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: '`List` has two `remove` methods: `remove(int index)` removes the element **at** a position, and `remove(Object o)` removes the first element **equal to** a value. On a `List<String>` there is no ambiguity. On a `List<Integer>` both apply to an integer argument, and Java picks the primitive overload: `list.remove(5)` removes the element at index 5, not the value 5.',
      },
      {
        kind: 'code',
        caption: 'Index or value?',
        code: `List<Integer> list = new ArrayList<>(List.of(10, 20, 5, 30));

list.remove(2);                       // by index: removes 5 (at position 2) -> [10, 20, 30]
list.remove(Integer.valueOf(20));     // by value: removes 20 -> [10, 30]
list.remove((Integer) 30);            // by value, cast form -> [10]

// The trap: intending to remove the value 5 but calling remove(5)
List<Integer> ids = new ArrayList<>(List.of(1, 2, 5));
// ids.remove(5);                     // IndexOutOfBoundsException: index 5, size 3`,
      },
      {
        kind: 'table',
        headers: ['Call', 'Which overload', 'Effect'],
        rows: [
          ['`list.remove(i)` with `int i`', '`remove(int)`', 'Removes position i'],
          ['`list.remove(Integer.valueOf(v))`', '`remove(Object)`', 'Removes first element equal to v'],
          ['`list.remove((Integer) v)`', '`remove(Object)`', 'Same, shorter'],
          ['`list.remove(x)` with `Integer x`', '`remove(Object)`', 'Already an object: by value'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Removing by value in a loop is O(n²)',
        body: 'Each `remove(Object)` scans for the value and shifts everything after it. Removing many values from an `ArrayList` this way is quadratic. Use `removeIf(x -> ...)` for a single O(n) pass, or build a new list with the elements to keep.',
      },
    ],
    keyTakeaways: [
      'On `List<Integer>`, `remove(int)` is by index and wins over `remove(Object)`.',
      'To remove by value, pass an `Integer`: `remove(Integer.valueOf(v))`.',
      'Bulk removal: `removeIf`, not repeated `remove`.',
    ],
    practice: {
      prompt: 'Build a `List<Integer>` of 0..9 and remove the value 3 correctly, then the element at index 3. Then remove all even values with `removeIf` and print the result.',
    },
  },
  // -------------------------------------------------------------------------
  {
    topicId: 'java-43.5',
    language: 'java',
    summary: 'Know that Arrays.asList and List.of give fixed-size or immutable lists, and how to get a real ArrayList.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: '`Arrays.asList(1, 2, 3)` looks like a quick way to make a list, and it is, but the list is a fixed-size view over an array: `set` works, `add` and `remove` throw `UnsupportedOperationException`. `List.of(1, 2, 3)` is stricter still: fully immutable, and it rejects null elements. Both are fine for read-only data and wrong as the starting point for a list you will grow.',
      },
      {
        kind: 'code',
        caption: 'Three lists that look alike',
        code: `List<Integer> a = Arrays.asList(1, 2, 3);
a.set(0, 9);            // ok: [9, 2, 3]
a.add(4);               // UnsupportedOperationException

List<Integer> b = List.of(1, 2, 3);
b.set(0, 9);            // UnsupportedOperationException
b.add(4);               // UnsupportedOperationException

List<Integer> c = new ArrayList<>(List.of(1, 2, 3));   // a real, growable copy
c.add(4);               // ok: [1, 2, 3, 4]`,
      },
      {
        kind: 'table',
        headers: ['Factory', 'Resizable', 'Mutable elements', 'Allows null', 'Backed by the array'],
        rows: [
          ['`Arrays.asList(arr)`', 'No', 'Yes', 'Yes', 'Yes: changes show in `arr` too'],
          ['`List.of(...)`', 'No', 'No', 'No', 'No'],
          ['`new ArrayList<>(...)`', 'Yes', 'Yes', 'Yes', 'No: independent copy'],
        ],
      },
      {
        kind: 'text',
        body: 'One more surprise: `Arrays.asList` on a primitive array does not spread the elements. `Arrays.asList(new int[]{1, 2})` is a `List<int[]>` with one element, the array. It only works element-wise on object arrays such as `Integer[]` or `String[]`. To get a list from an `int[]`, stream it: `Arrays.stream(arr).boxed().collect(Collectors.toList())`, or loop.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Returning lists from LeetCode methods',
        body: '`return List.of(a, b);` is fine when the answer is fixed. When you build the answer incrementally, use `new ArrayList<>()` and `add`. Returning `Arrays.asList` from a method is also fine, since the caller only reads it.',
      },
    ],
    keyTakeaways: [
      '`Arrays.asList` is fixed-size; `List.of` is immutable; only `new ArrayList<>` grows.',
      'Wrap either in `new ArrayList<>(...)` to get a growable copy.',
      '`Arrays.asList(int[])` is a one-element list; it only spreads object arrays.',
    ],
    practice: {
      prompt: 'Create a list with `Arrays.asList`, try `add`, and read the exception. Then convert an `int[]` to a `List<Integer>` two ways. Then explain what `Arrays.asList(arr).set(0, 99)` does to `arr`.',
    },
  },
  // -------------------------------------------------------------------------
  {
    topicId: 'java-43.6',
    language: 'java',
    summary: 'Copy a 2D array row by row, because clone and copyOf only copy the outer array.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'A 2D array in Java is an array of references to row arrays. `grid.clone()`, `Arrays.copyOf(grid, n)` and `System.arraycopy` on the outer array all copy those references: the new grid has its own top-level array, but every row is shared with the original. Change one cell through either grid and both see it. For DP tables, visited grids and backtracking snapshots this produces bugs that look like the algorithm is wrong.',
      },
      {
        kind: 'code',
        caption: 'Shallow versus deep copy of a grid',
        code: `int[][] g = {{1, 2}, {3, 4}};

int[][] shallow = g.clone();
shallow[0][0] = 99;
System.out.println(g[0][0]);          // 99: the row is shared

int[][] deep = new int[g.length][];
for (int i = 0; i < g.length; i++) deep[i] = g[i].clone();   // clone each row
deep[1][1] = 77;
System.out.println(g[1][1]);          // 4: independent

// A 1D array clone is a full copy: primitives have no inner references
int[] a = {1, 2, 3};
int[] b = a.clone();
b[0] = 9;
System.out.println(a[0]);             // 1`,
        output: '99\n4\n1',
      },
      {
        kind: 'table',
        headers: ['What you copy', 'Method', 'Result'],
        rows: [
          ['`int[]`', '`clone()` / `Arrays.copyOf`', 'Independent copy'],
          ['`int[][]`', '`clone()` on the outer array', 'Rows shared'],
          ['`int[][]`', 'Loop cloning each row', 'Independent copy'],
          ['`List<List<Integer>>`', '`new ArrayList<>(outer)`', 'Inner lists shared'],
          ['`List<List<Integer>>`', 'New outer, `new ArrayList<>(inner)` for each', 'Independent copy'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Backtracking snapshots',
        body: '`result.add(path)` stores a reference to the list you keep modifying, so every entry in `result` ends up as the same, usually empty, list. Store `new ArrayList<>(path)`. The same applies when the state is a `char[][]` board: copy each row before saving a solution.',
      },
    ],
    keyTakeaways: [
      '`clone()` and `copyOf` on a 2D array copy only the outer array; rows are shared.',
      'Deep-copy a grid by cloning each row.',
      'In backtracking, add `new ArrayList<>(path)` to the result, never `path`.',
    ],
    practice: {
      prompt: 'Generate all subsets of [1, 2, 3] with backtracking, adding `path` directly, and print the broken result. Fix it with a copy. Then write `deepCopy(int[][] g)` and confirm modifying the copy leaves the original unchanged.',
    },
  },
  // -------------------------------------------------------------------------
  {
    topicId: 'java-43.7',
    language: 'java',
    summary: 'Cast the result of char arithmetic back to char, and convert digit characters with - \'0\'.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'A `char` is a 16-bit number and takes part in arithmetic as an `int`. That makes `c - \'a\'` a valid index and `c - \'0\'` a digit value, and it also means `\'a\' + 1` is the `int` 98, not the character b. Assigning that back to a `char` needs a cast, and printing it without one prints a number. `String` has no `charAt` setter, so rewriting characters goes through a `char[]` or a `StringBuilder`.',
      },
      {
        kind: 'code',
        caption: 'Arithmetic and conversion',
        code: `char c = 'e';
int idx = c - 'a';                    // 4
char next = (char) (c + 1);           // 'f'; without the cast: compile error (int to char)
System.out.println(c + 1);            // 102, an int
System.out.println((char) (c + 1));   // f

char d = '7';
int val = d - '0';                    // 7
int wrong = Character.getNumericValue(d);   // also 7, but slower and handles more than digits
char back = (char) ('0' + 3);         // '3'

// Rewriting a string's characters
char[] arr = s.toCharArray();
arr[0] = Character.toUpperCase(arr[0]);
String t = new String(arr);

// Or via StringBuilder
StringBuilder sb = new StringBuilder(s);
sb.setCharAt(0, 'X');`,
        output: '102\nf',
      },
      {
        kind: 'table',
        headers: ['Expression', 'Type', 'Value for c = \'e\''],
        rows: [
          ['`c`', '`char`', '\'e\''],
          ['`c + 1`', '`int`', '102'],
          ['`(char) (c + 1)`', '`char`', '\'f\''],
          ['`c - \'a\'`', '`int`', '4'],
          ['`"" + c`', '`String`', '"e"'],
          ['`c + "" + 1`', '`String`', '"e1"'],
          ['`c + 1 + ""`', '`String`', '"102" (arithmetic first)'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: '`char += 1` compiles, `char = char + 1` does not',
        body: 'Compound assignment includes an implicit cast, so `c += 1` is allowed and `c = c + 1` is an error. Both are fine to use; the point is to recognise the error message "incompatible types: possible lossy conversion from int to char" as this rule and add the cast.',
      },
    ],
    keyTakeaways: [
      '`char` arithmetic produces an `int`; cast back with `(char)`.',
      '`c - \'0\'` for digit value, `c - \'a\'` for letter index, `(char) (\'a\' + i)` to go back.',
      'Rewrite characters through `toCharArray()` or `StringBuilder.setCharAt`.',
    ],
    practice: {
      prompt: 'Print `\'a\' + 2`, `(char) (\'a\' + 2)`, and `\'a\' + "" + 2`. Then Caesar-shift a lowercase string by k with wrap-around using a `char[]`. Then sum the digits of "4721" with `- \'0\'`.',
    },
  },
  // -------------------------------------------------------------------------
  {
    topicId: 'java-43.8',
    language: 'java',
    summary: 'Compute a midpoint and a comparator without int overflow.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'Java `int` wraps silently at 2³¹ - 1. Two places in everyday DSA code add large ints together: the midpoint `(lo + hi) / 2` in binary search, and `a - b` in a comparator. Both are correct in mathematics, both overflow for values near the limit, and both are famous: the binary search bug sat in the JDK itself for nine years.',
      },
      {
        kind: 'code',
        caption: 'The midpoint',
        code: `int lo = 0, hi = Integer.MAX_VALUE - 1;
int bad = (lo + hi) / 2;          // lo + hi overflows to a negative number
int good = lo + (hi - lo) / 2;    // hi - lo cannot overflow when lo <= hi
int alsoGood = (lo + hi) >>> 1;   // unsigned shift treats the overflowed sum as positive`,
      },
      {
        kind: 'text',
        body: 'For array indices the sum never reaches 2³¹ in practice, so `(lo + hi) / 2` passes every test on arrays. The bug appears in binary search on the **answer**, where `lo` and `hi` are values up to 10⁹ or more. Use `lo + (hi - lo) / 2` everywhere and never think about it again.',
      },
      {
        kind: 'code',
        caption: 'The comparator',
        code: `// Wrong: a - b overflows when a and b have opposite signs and large magnitude
Arrays.sort(arr, (a, b) -> a - b);            // TimSort may throw "Comparison method violates its general contract"

// Right
Arrays.sort(arr, (a, b) -> Integer.compare(a, b));
Arrays.sort(arr, Comparator.naturalOrder());
list.sort(Comparator.comparingInt(p -> p[0]));     // by first element, safely
pq = new PriorityQueue<>((x, y) -> Long.compare(x[1], y[1]));`,
      },
      {
        kind: 'table',
        headers: ['Need', 'Write'],
        rows: [
          ['Midpoint', '`lo + (hi - lo) / 2`'],
          ['Compare ints', '`Integer.compare(a, b)`'],
          ['Compare longs', '`Long.compare(a, b)`'],
          ['Descending', '`Integer.compare(b, a)` or `Comparator.reverseOrder()`'],
          ['Sum of two ints that may be large', '`(long) a + b`'],
          ['Absolute value of `Integer.MIN_VALUE`', 'Overflows: `Math.abs` returns negative; use `long`'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Products in loops',
        body: '`int` × `int` is an `int` even when stored in a `long`. Write `(long) a * b`, or make the accumulator `long` and one operand `long`. The same reasoning as the midpoint: the overflow happens in the expression, before the assignment.',
      },
    ],
    keyTakeaways: [
      'Use `lo + (hi - lo) / 2` for midpoints.',
      'Comparators use `Integer.compare`, never `a - b`.',
      'Widen one operand to `long` before large sums or products.',
    ],
    practice: {
      prompt: 'Binary search for a value in the range [0, Integer.MAX_VALUE - 1] with the naive midpoint and observe the failure. Fix it. Then sort an `Integer[]` containing `Integer.MIN_VALUE` and `Integer.MAX_VALUE` with the `a - b` comparator and with `Integer.compare`, and compare the results.',
    },
  },
  // -------------------------------------------------------------------------
  {
    topicId: 'java-43.9',
    language: 'java',
    summary: 'Prefer primitive arrays over boxed collections in hot loops, and know what boxing costs.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: '`List<Integer>` cannot hold an `int`; every value put in is **boxed** into an `Integer` object, and every value read out is **unboxed**. Each box is a heap allocation, and each unbox is a pointer dereference. In a loop over 10⁶ elements that runs several times, the difference between `int[]` and `ArrayList<Integer>` can be the difference between Accepted and Time Limit Exceeded.',
      },
      {
        kind: 'code',
        caption: 'Boxed versus primitive',
        code: `// Boxed: allocation per element, dereference per read
List<Integer> list = new ArrayList<>();
for (int i = 0; i < n; i++) list.add(i);           // n Integer objects
long sum = 0;
for (int x : list) sum += x;                        // unbox each

// Primitive: contiguous ints, no allocation
int[] arr = new int[n];
for (int i = 0; i < n; i++) arr[i] = i;
long sum2 = 0;
for (int x : arr) sum2 += x;

// A map with int values still boxes; for small key ranges use an array
Map<Integer, Integer> freq = new HashMap<>();       // boxes keys and values
int[] freqArr = new int[26];                        // for letters: no boxing at all`,
      },
      {
        kind: 'table',
        headers: ['Structure', 'Per-element cost', 'When it is fine'],
        rows: [
          ['`int[]`, `long[]`, `boolean[]`', 'None', 'Always, when size is known or bounded'],
          ['`ArrayList<Integer>`', 'One object each', 'Result lists, moderate sizes, when the API requires it'],
          ['`HashMap<Integer, Integer>`', 'Two objects plus a node each', 'Sparse or unbounded keys'],
          ['`int[]` as a counting array', 'None', 'Keys in a small range: letters, digits, small ints'],
          ['`PriorityQueue<int[]>`', 'One array each', 'Fine: one allocation per entry, no boxing of fields'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Pairs without a class',
        body: 'Where C++ uses `pair<int,int>`, Java solutions commonly use `int[]{a, b}` in a `PriorityQueue<int[]>` or `ArrayDeque<int[]>` with a comparator on `x[0]`. It is one small allocation per pair and no boxing of the fields. A `record Pair(int a, int b)` is the readable alternative when the code is more than a few lines.',
      },
    ],
    keyTakeaways: [
      'Every value in a `List<Integer>` or `Map<Integer, ...>` is a boxed object.',
      'Use primitive arrays in hot loops and as counting arrays.',
      'Represent pairs as `int[]` or a `record` rather than boxed lists.',
    ],
    practice: {
      prompt: 'Sum 10⁷ integers stored in an `ArrayList<Integer>` and in an `int[]`, timing both. Then rewrite a letter-frequency `HashMap<Character, Integer>` as an `int[26]` and confirm identical output on a test string.',
    },
  },
  // -------------------------------------------------------------------------
  {
    topicId: 'java-43.10',
    language: 'java',
    summary: 'Avoid ConcurrentModificationException by removing through the iterator or with removeIf.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'A for-each loop over a collection uses an iterator behind the scenes. If the collection is structurally changed during the loop by anything other than that iterator, the next step throws `ConcurrentModificationException`. The name suggests threads; in DSA code it is always a single loop that calls `remove` or `add` on the list or map it is walking.',
      },
      {
        kind: 'code',
        caption: 'The exception, and three fixes',
        code: `List<Integer> list = new ArrayList<>(List.of(1, 2, 3, 4));

// Throws on the next iteration after a remove
for (int x : list) if (x % 2 == 0) list.remove(Integer.valueOf(x));

// Fix 1: remove through the iterator
for (Iterator<Integer> it = list.iterator(); it.hasNext(); )
    if (it.next() % 2 == 0) it.remove();

// Fix 2: removeIf, one pass, clearest
list.removeIf(x -> x % 2 == 0);

// Fix 3: iterate a copy, modify the original
for (int x : new ArrayList<>(list)) if (x % 2 == 0) list.remove(Integer.valueOf(x));

// Maps: same rule; use entrySet().removeIf or the iterator
map.entrySet().removeIf(e -> e.getValue() == 0);`,
      },
      {
        kind: 'table',
        headers: ['Modification during for-each', 'Result'],
        rows: [
          ['`list.remove(...)`, `list.add(...)`', 'ConcurrentModificationException'],
          ['`list.set(i, v)`', 'Allowed: not a structural change'],
          ['`map.put(existingKey, v)`', 'Allowed: replacing a value is not structural'],
          ['`map.put(newKey, v)`, `map.remove(k)`', 'ConcurrentModificationException'],
          ['`it.remove()` on the loop\u2019s own iterator', 'Allowed'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'It does not always throw',
        body: 'Removing the second-to-last element makes `hasNext()` return false before the check runs, so the loop ends quietly with a wrong result instead of throwing. The exception is best-effort; the rule is absolute. Never structurally modify a collection inside a for-each over it.',
      },
    ],
    keyTakeaways: [
      'Structural changes during for-each throw `ConcurrentModificationException`, usually.',
      'Use `removeIf`, or the iterator\u2019s own `remove`, or iterate over a copy.',
      '`set` on a list and `put` on an existing key are safe.',
    ],
    practice: {
      prompt: 'Reproduce the exception, then reproduce the silent case by removing the second-to-last element. Then filter a map to keep only entries with value > 1 using `entrySet().removeIf`.',
    },
  },
  // -------------------------------------------------------------------------
  {
    topicId: 'java-43.11',
    language: 'java',
    summary: 'Recognise StackOverflowError from deep recursion and convert to iteration when depth can reach 10⁵.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'Java\u2019s default thread stack is around 512 KB to 1 MB, enough for roughly 10⁴ to 2 × 10⁴ frames of a typical recursive method. A recursive DFS on a linked list of 10⁵ nodes, or a memoised recursion 10⁵ deep, throws `StackOverflowError`. It is an `Error`, not an `Exception`, and catching it is not a fix.',
      },
      {
        kind: 'table',
        headers: ['Input', 'Depth', 'Outcome'],
        rows: [
          ['Balanced tree, 10⁶ nodes', '~20', 'Fine'],
          ['Path-shaped tree or list, 10⁴ nodes', '10⁴', 'Usually fine'],
          ['Path-shaped tree or list, 10⁵ nodes', '10⁵', 'StackOverflowError on most judges'],
          ['Grid DFS, 500×500 open', 'up to 2.5 × 10⁵', 'StackOverflowError'],
        ],
      },
      {
        kind: 'code',
        caption: 'Iterative DFS with an explicit stack',
        code: `void dfs(int start, List<List<Integer>> adj, boolean[] vis) {
    Deque<Integer> stack = new ArrayDeque<>();
    stack.push(start);
    while (!stack.isEmpty()) {
        int u = stack.pop();
        if (vis[u]) continue;
        vis[u] = true;
        for (int v : adj.get(u)) if (!vis[v]) stack.push(v);
    }
}

// Running recursive code on a bigger stack (works on LeetCode and most judges)
public static void main(String[] args) throws Exception {
    Thread t = new Thread(null, () -> solve(), "big", 1 << 26);   // 64 MB stack
    t.start();
    t.join();
}`,
      },
      {
        kind: 'text',
        body: 'The big-stack thread is the standard escape hatch when a recursive solution is clearly correct and only the depth is the problem. For LeetCode class methods you cannot change `main`, so the practical answer is the explicit stack, BFS for grids, or bottom-up DP.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Memoisation depth',
        body: 'A memoised `f(n)` that calls `f(n - 1)` still recurses n deep on the first call. When n is up to 10⁵, write the loop version: same recurrence, filled from the base case upwards, no stack at all.',
      },
    ],
    keyTakeaways: [
      'Recursion deeper than ~10⁴-10⁵ frames throws `StackOverflowError`.',
      'Use `ArrayDeque` as an explicit stack, BFS for grids, or bottom-up DP.',
      'Outside LeetCode, run `solve()` on a thread with a large stack size.',
    ],
    practice: {
      prompt: 'Write recursive `length(ListNode head)` and run it on a list of 10⁵ nodes to see the error. Then run the same method inside a big-stack thread. Then write the iterative version and the DFS above.',
    },
  },
  // -------------------------------------------------------------------------
  {
    topicId: 'java-43.12',
    language: 'java',
    summary: 'Use immutable keys in HashMap and HashSet, and implement equals and hashCode together for custom keys.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A hash map finds a key by its `hashCode`, then confirms with `equals`. Two rules follow. First, if a key\u2019s hash changes after insertion, the map looks in the wrong bucket and the entry is lost while still taking up space. Second, a custom class used as a key must define `equals` and `hashCode` consistently, or two equal-looking keys land in different buckets and the map holds duplicates.',
      },
      {
        kind: 'code',
        caption: 'A mutable key, lost',
        code: `List<Integer> key = new ArrayList<>(List.of(1, 2));
Set<List<Integer>> seen = new HashSet<>();
seen.add(key);
key.add(3);                          // hash changes
System.out.println(seen.contains(key));            // false: wrong bucket
System.out.println(seen.contains(List.of(1, 2)));  // false: old bucket, but equals fails
System.out.println(seen.size());                   // 1: the entry is still there, unreachable`,
        output: 'false\nfalse\n1',
      },
      {
        kind: 'text',
        body: 'Safe key types are the immutable ones: `String`, `Integer`, `Long`, `Character`, and `List.of(...)` (immutable). Coordinates are usually encoded as a single number, `r * cols + c`, or as a `String` like `r + "," + c`, or as a `record`. A `record` generates correct `equals` and `hashCode` from its fields and is immutable, which makes it the cleanest custom key.',
      },
      {
        kind: 'code',
        caption: 'Correct custom keys',
        code: `// Record: equals and hashCode generated from (r, c)
record Cell(int r, int c) {}
Set<Cell> visited = new HashSet<>();
visited.add(new Cell(0, 0));
System.out.println(visited.contains(new Cell(0, 0)));   // true

// Encoded int: fastest, no objects
Set<Integer> vis = new HashSet<>();
vis.add(r * cols + c);

// Hand-written class: both methods, from the same fields
class Point {
    final int x, y;
    Point(int x, int y) { this.x = x; this.y = y; }
    @Override public boolean equals(Object o) {
        return o instanceof Point p && p.x == x && p.y == y;
    }
    @Override public int hashCode() { return Objects.hash(x, y); }
}`,
        output: 'true',
      },
      {
        kind: 'table',
        headers: ['Key', 'Safe?', 'Note'],
        rows: [
          ['`String`, boxed numbers', 'Yes', 'Immutable'],
          ['`int[]`', 'No', 'Arrays use identity: `new int[]{1,2}` never equals another'],
          ['`ArrayList`', 'Only if never modified', 'Contents-based hash; mutation breaks it'],
          ['`List.of(a, b)`', 'Yes', 'Immutable, contents-based'],
          ['`record`', 'Yes', 'Generated equals/hashCode'],
          ['Class without `equals`/`hashCode`', 'No', 'Identity only: every instance is a distinct key'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: '`int[]` as a key or in a set',
        body: 'Arrays do not override `equals` or `hashCode`, so `set.add(new int[]{1, 2})` twice adds two entries. This is the most common reason a "visited states" set fails to prevent revisits in a BFS over grid states. Encode the array as a `String`, a `List`, or a number.',
      },
    ],
    keyTakeaways: [
      'Never modify an object after using it as a key.',
      'Custom keys need `equals` and `hashCode` from the same fields; a `record` does this for you.',
      'Arrays compare by identity; encode them before putting them in a set or map.',
    ],
    practice: {
      prompt: 'Add `new int[]{1, 2}` to a `HashSet` twice and print its size. Then repeat with `List.of(1, 2)` and with a `record`. Then write BFS on a grid using a `record Cell` as the visited key and again using `r * cols + c`.',
    },
  },
];
