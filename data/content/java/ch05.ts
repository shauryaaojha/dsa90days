import type { Lesson } from '../types';

/**
 * Java Chapter 5 — Arrays and Strings.
 * The data structures most problems are built on. Heavy on the array/ArrayList
 * split and on StringBuilder, since string immutability is a real performance
 * concern in Java.
 */
export const ch05: Lesson[] = [
  // -------------------------------------------------------------------------
  {
    topicId: 'java-5.1',
    language: 'java',
    summary: 'Create and use fixed-size arrays — the type every LeetCode signature uses.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'An array is a fixed run of slots, all the same type, numbered from **0**. It is the most important structure in this whole chapter, because `int[]` is what almost every LeetCode method signature hands you. The one rule that never bends: the size is fixed at creation and cannot change afterwards — if you need growth, you need an `ArrayList`.',
      },
      {
        kind: 'code',
        caption: 'Creating arrays',
        code: `int[] a = new int[5];              // 5 zeros — Java initialises for you
int[] b = {1, 2, 3, 4, 5};         // from a literal
int[] c = new int[]{1, 2, 3};      // explicit form, needed when not declaring

int[] d;
d = new int[]{1, 2};               // the literal form only works at declaration
// d = {1, 2};                     // ERROR`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Java arrays are zero-initialised',
        body: '`new int[26]` gives 26 zeros, `new boolean[n]` gives n `false`s, and an object array gives `null`s. No `= {0}` needed, unlike C++, where a local array holds garbage. That removes one of the most common C++ frequency-counting bugs entirely.',
      },
      {
        kind: 'code',
        caption: 'The essentials',
        code: `arr.length;               // a FIELD — no parentheses
arr[0];                   // O(1)
arr[arr.length - 1];      // last element

// Bounds are checked at runtime:
arr[10];                  // ArrayIndexOutOfBoundsException: Index 10 out of
                          // bounds for length 5`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Bounds checking is a genuine advantage over C++',
        body: 'Java throws a named exception with the offending index in the message. C++ silently reads adjacent memory, producing a wrong answer with no indication of where it came from. Java\'s version costs a small runtime check and saves hours of debugging.',
      },
      { kind: 'heading', text: 'Arrays are objects, not values' },
      {
        kind: 'code',
        code: `int[] a = {1, 2, 3};
int[] b = a;              // b refers to the SAME array
b[0] = 99;
System.out.println(a[0]); // 99 — a changed too

int[] c = a.clone();      // a real copy
int[] d = Arrays.copyOf(a, a.length);
int[] e = Arrays.copyOfRange(a, 1, 3);   // indices 1..2`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Passing an array to a method lets that method modify it',
        body: 'Because the reference is copied, not the array. So `Arrays.sort(nums)` inside your solution sorts the judge\'s array. That is usually fine and saves a copy — but if a later part of the solution needs the original order, `clone()` first.',
      },
      { kind: 'heading', text: 'The Arrays utility class' },
      {
        kind: 'code',
        code: `import java.util.Arrays;

Arrays.sort(arr);                       // O(n log n), in place
Arrays.sort(arr, 1, 4);                 // sort a range
Arrays.fill(arr, -1);                   // fill with a value
Arrays.toString(arr);                   // "[1, 2, 3]" — for printing
Arrays.equals(a, b);                    // element-wise comparison
Arrays.binarySearch(arr, target);       // O(log n) on a SORTED array
Arrays.stream(arr).sum();               // sum without a loop
Arrays.stream(arr).max().getAsInt();`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Printing an array directly shows its address',
        body: '`System.out.println(arr)` prints `[I@6d06d69c`. Use `Arrays.toString(arr)` for 1D and `Arrays.deepToString(grid)` for 2D. This is the main reason local debugging feels broken to newcomers.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Arrays.sort on primitives is not stable and uses dual-pivot quicksort',
        body: 'For `int[]` it is quicksort — O(n log n) average but O(n²) on adversarial input, and some judges have anti-quicksort tests. For object arrays it uses a stable merge sort. If you hit an unexplained timeout on a sort-heavy problem, converting to `Integer[]` forces the merge sort.',
      },
    ],
    keyTakeaways: [
      'Java arrays are zero-initialised and bounds-checked at runtime.',
      '`arr.length` is a field; `s.length()` and `list.size()` are methods.',
      'Arrays are objects — assigning copies the reference, not the contents.',
      'Use `Arrays.toString` to print, `clone()` or `copyOf` to copy.',
    ],
    practice: {
      prompt: 'Build an array, assign it to a second variable, modify through the second, and confirm the first changed. Then `clone()` and confirm it does not. Then print an array directly and with `Arrays.toString`.',
      leetcode: { title: 'Running Sum of 1d Array', slug: 'running-sum-of-1d-array' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-5.2',
    language: 'java',
    summary: 'Work with grids and matrices, including Java\'s jagged arrays.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'A 2-D array is how you represent a grid, a maze, a chessboard or a matrix — and grid problems are a large slice of every interview list. In Java a `int[][]` is really an **array of arrays**, which has one consequence worth knowing up front: the rows are separate objects and do not have to be the same length.',
      },
      {
        kind: 'code',
        code: `int[][] grid = new int[3][4];          // 3 rows, 4 columns, all zeros
int[][] g = {{1, 2, 3}, {4, 5, 6}};    // from a literal

grid[1][2];                            // row 1, column 2
int rows = grid.length;                // 3
int cols = grid[0].length;             // 4`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'rows and cols are easy to swap',
        body: '`grid.length` is the row count, `grid[0].length` the column count. Getting them backwards crashes on non-square grids and passes silently on square ones — so your test case looks fine and the judge fails you. Name them `rows` and `cols` immediately and never re-derive them inline.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Guard grid[0] before reading its length',
        body: '`grid[0].length` throws when the grid has no rows. Start every grid method with `if (grid == null || grid.length == 0 || grid[0].length == 0) return ...;`. Empty input is a reliably present hidden test.',
      },
      { kind: 'heading', text: 'A 2D array is an array of arrays' },
      {
        kind: 'code',
        code: `int[][] grid = new int[3][];           // 3 rows, each still null
grid[0] = new int[5];                  // rows may have DIFFERENT lengths
grid[1] = new int[2];

// So iterate each row by ITS own length:
for (int r = 0; r < grid.length; r++)
    for (int c = 0; c < grid[r].length; c++)     // note grid[r].length
        ...`,
      },
      {
        kind: 'text',
        body: 'Unlike C++, where a 2D array is one contiguous block, Java\'s is an array of row references. That is why rows can differ in length, why `new int[3][]` is legal, and why passing a 2D array to a method needs no column count.',
      },
      {
        kind: 'code',
        caption: 'The standard traversal',
        code: `int rows = grid.length, cols = grid[0].length;

for (int r = 0; r < rows; r++) {
    for (int c = 0; c < cols; c++) {
        System.out.print(grid[r][c] + " ");
    }
    System.out.println();
}

// For-each works too, when indices are not needed
for (int[] row : grid)
    for (int x : row)
        ...`,
      },
      { kind: 'heading', text: 'The four-directions idiom' },
      {
        kind: 'code',
        code: `private static final int[] DR = {-1, 1, 0, 0};
private static final int[] DC = {0, 0, -1, 1};

for (int d = 0; d < 4; d++) {
    int nr = r + DR[d], nc = c + DC[d];
    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] == 1) {
        // valid neighbour
    }
}

// Or as pairs, which some find clearer:
private static final int[][] DIRS = {{-1,0}, {1,0}, {0,-1}, {0,1}};
for (int[] d : DIRS) {
    int nr = r + d[0], nc = c + d[1];
    ...
}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Declare direction arrays as static final',
        body: 'Putting them at class level rather than inside the method avoids reallocating on every call, and `static final` signals they are constants. Small habit, cleaner grid solutions.',
      },
      {
        kind: 'code',
        caption: 'Copying and printing',
        code: `System.out.println(Arrays.deepToString(grid));    // [[1, 2], [3, 4]]

// A shallow clone shares the rows!
int[][] bad = grid.clone();
bad[0][0] = 9;                     // grid[0][0] is now 9 too

// A proper 2D copy
int[][] copy = new int[rows][];
for (int r = 0; r < rows; r++) copy[r] = grid[r].clone();`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'clone() on a 2D array is shallow',
        body: 'It copies the array of row references, so both arrays point at the same rows. Writing to one changes the other. This is the same aliasing problem Python has with `[[0]*c]*r`, arriving through a different route. Clone each row individually.',
      },
    ],
    keyTakeaways: [
      '`grid.length` is rows, `grid[0].length` is columns — guard the empty case.',
      'Java 2D arrays are arrays of arrays, so rows may differ in length.',
      'Use `static final` direction arrays plus a bounds check for neighbours.',
      '`clone()` on a 2D array is shallow — clone each row.',
    ],
    practice: {
      prompt: 'Build a 3×4 grid, print it with `deepToString`, and write the four-direction neighbour loop. Then `clone()` a 2D array, modify the copy, and confirm the original changed — then fix it with a per-row clone.',
      leetcode: { title: 'Number of Islands', slug: 'number-of-islands' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-5.3',
    language: 'java',
    summary: 'Walk arrays and collections, choosing the right loop for the job.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Traversal — visiting every element once — is the single most common thing you will do to an array. Java gives you two ways, and choosing between them is easy once you state the question: **do I need to know where I am?** If yes, use an index loop. If you only need the values, use for-each and remove a whole class of bug.',
      },
      {
        kind: 'code',
        caption: 'The three forms',
        code: `// 1. Index — when you need i, or must modify elements
for (int i = 0; i < arr.length; i++) {
    arr[i] *= 2;
}

// 2. For-each — read-only, cannot go out of bounds
for (int x : arr) {
    sum += x;
}

// 3. Iterator — when you must remove during traversal
Iterator<Integer> it = list.iterator();
while (it.hasNext()) {
    if (it.next() < 0) it.remove();
}`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'For-each cannot modify array elements',
        body: '`for (int x : arr) x *= 2;` modifies a copy — the array is untouched, and nothing warns you. Java has no reference-binding form like C++\'s `for (int& x : v)`. Any loop that writes to elements must be an index loop.',
      },
      {
        kind: 'text',
        body: 'For objects the distinction is between mutation and reassignment: `for (ListNode n : nodes) n.val = 0;` works, because it mutates the shared object. `for (ListNode n : nodes) n = null;` does nothing, because it rebinds a local copy of the reference.',
      },
      { kind: 'heading', text: 'Two-pointer traversal' },
      {
        kind: 'code',
        code: `// From both ends inward
int left = 0, right = arr.length - 1;
while (left < right) {
    int temp = arr[left];
    arr[left] = arr[right];
    arr[right] = temp;
    left++;
    right--;
}

// Read and write at different speeds — in-place filtering
int write = 0;
for (int read = 0; read < arr.length; read++) {
    if (arr[read] != 0) arr[write++] = arr[read];
}
// everything from index 'write' onward is leftover`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The write/read pattern solves in-place removal',
        body: 'A slow write pointer trailing a fast read pointer filters in O(n) with no extra space. It is how Remove Element, Remove Duplicates and Move Zeroes are all solved — and LeetCode asks for the new length precisely to check you did it in place.',
      },
      { kind: 'heading', text: 'Removing while iterating' },
      {
        kind: 'code',
        code: `// THROWS ConcurrentModificationException
for (Integer x : list) {
    if (x < 0) list.remove(x);
}

// Iterator — the general solution
Iterator<Integer> it = list.iterator();
while (it.hasNext()) {
    if (it.next() < 0) it.remove();
}

// removeIf — the one-liner
list.removeIf(x -> x < 0);

// Backwards index loop — also safe
for (int i = list.size() - 1; i >= 0; i--) {
    if (list.get(i) < 0) list.remove(i);
}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Java fails loudly; Python and C++ fail silently',
        body: '`ConcurrentModificationException` names the problem immediately. The equivalent Python loop silently skips elements and C++ is undefined behaviour. `removeIf` is the cleanest fix and reads well — prefer it unless you need the index.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'list.remove(int) versus list.remove(Object)',
        body: 'On a `List<Integer>`, `list.remove(2)` removes **index 2**, not the value 2. To remove by value use `list.remove(Integer.valueOf(2))`. It is a genuinely confusing overload in the standard library and it catches people regularly.',
      },
    ],
    keyTakeaways: [
      'For-each is read-only for primitives; use an index loop to modify.',
      'A write pointer trailing a read pointer filters in place in O(n).',
      'Use `removeIf` or an `Iterator` to delete while traversing.',
      '`list.remove(2)` removes index 2 — use `Integer.valueOf(2)` for the value.',
    ],
    practice: {
      prompt: 'Write `for (int x : arr) x *= 2;` and confirm nothing changed. Then implement Move Zeroes with the read/write two-pointer pattern. Then remove elements inside a for-each, read the exception, and fix it with `removeIf`.',
      leetcode: { title: 'Move Zeroes', slug: 'move-zeroes' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-5.4',
    language: 'java',
    summary: 'Choose between the fixed array and the growable list, and convert between them.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'An array has a fixed size; an `ArrayList` grows as you add to it. That one difference decides almost every choice between them: if you know the size up front, use an array, and if you are collecting results as you go, use a list. LeetCode makes this concrete — it hands you arrays and often wants a `List` back, so converting between the two is a daily skill.',
      },
      {
        kind: 'table',
        headers: ['', '`int[]`', '`ArrayList<Integer>`'],
        rows: [
          ['Size', 'Fixed at creation', 'Grows automatically'],
          ['Holds', 'Primitives directly', 'Objects only (boxed)'],
          ['Access', '`arr[i]`', '`list.get(i)`'],
          ['Size query', '`arr.length`', '`list.size()`'],
          ['Add', 'Impossible', '`add(x)` — O(1) amortised'],
          ['Memory', 'Compact', '~4× more (boxing + object headers)'],
          ['Speed', 'Faster', 'Slower — boxing and indirection'],
        ],
      },
      {
        kind: 'code',
        code: `int[] arr = new int[5];
arr[0] = 1;
arr.length;

List<Integer> list = new ArrayList<>();
list.add(1);              // autoboxed
list.get(0);              // returns Integer, auto-unboxed to int
list.size();
list.set(0, 9);
list.remove(0);           // by INDEX
list.contains(5);         // O(n)
list.isEmpty();`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Use int[] when the size is known, ArrayList when it grows',
        body: 'LeetCode signatures decide most of this for you: input is usually `int[]`, output is sometimes `List<Integer>`. When building a result of unknown length, use an `ArrayList` and convert at the end. For DP tables and frequency counts, always `int[]` — the boxing cost of a list is real.',
      },
      { kind: 'heading', text: 'Converting between them' },
      {
        kind: 'code',
        code: `// int[] → List<Integer>
List<Integer> list = Arrays.stream(arr).boxed().collect(Collectors.toList());
// or a plain loop
List<Integer> list = new ArrayList<>();
for (int x : arr) list.add(x);

// List<Integer> → int[]
int[] arr = list.stream().mapToInt(Integer::intValue).toArray();
// or a plain loop
int[] arr = new int[list.size()];
for (int i = 0; i < list.size(); i++) arr[i] = list.get(i);`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Arrays.asList does not work on int[]',
        body: '`Arrays.asList(intArray)` gives a single-element `List<int[]>`, because generics cannot hold primitives so the whole array becomes one element. It compiles and behaves nothing like you expect. It *does* work correctly on `Integer[]` and `String[]`.',
      },
      {
        kind: 'code',
        code: `int[] prim = {1, 2, 3};
Arrays.asList(prim).size();          // 1  ← the whole array is one element

Integer[] boxed = {1, 2, 3};
Arrays.asList(boxed).size();         // 3  ← correct

List<String> l = Arrays.asList("a", "b");   // fine — but FIXED SIZE
l.add("c");                                 // UnsupportedOperationException`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Arrays.asList and List.of return immutable-ish lists',
        body: '`Arrays.asList` gives a fixed-size view — `set` works but `add` and `remove` throw. `List.of(...)` is fully immutable — even `set` throws. To get a modifiable list, wrap it: `new ArrayList<>(List.of(1, 2, 3))`. This trips people up when building a result they intend to modify.',
      },
      { kind: 'heading', text: 'ArrayList internals' },
      {
        kind: 'code',
        code: `List<Integer> list = new ArrayList<>();       // default capacity 10
List<Integer> sized = new ArrayList<>(1000);  // pre-allocate — avoids resizing

// Growth: when full, allocates a 1.5× larger array and copies.
// That is why add() is amortised O(1), not exactly O(1).`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Pre-size when you know the count',
        body: '`new ArrayList<>(n)` allocates once instead of resizing repeatedly. It is the same idea as C++\'s `reserve` and Python has no equivalent. A one-line, zero-risk speedup when you are about to add a known number of elements.',
      },
      {
        kind: 'text',
        body: 'One more difference from C++: `ArrayList` has no `pop_back`. Removing the last element is `list.remove(list.size() - 1)` — verbose, and worth wrapping in a helper if you are using a list as a stack. Better still, use `ArrayDeque` for stack behaviour.',
      },
    ],
    keyTakeaways: [
      '`int[]` is compact and fast; `ArrayList` grows but boxes every element.',
      '`Arrays.asList(intArray)` gives `List<int[]>` — use streams or a loop.',
      '`List.of` and `Arrays.asList` are not modifiable — wrap in `new ArrayList<>()`.',
      'Pre-size with `new ArrayList<>(n)` when the count is known.',
    ],
    practice: {
      prompt: 'Convert an `int[]` to a `List<Integer>` and back, both ways. Then call `Arrays.asList(intArray).size()` and see the answer of 1. Then try `add` on a `List.of` result and read the `UnsupportedOperationException`.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-5.5',
    language: 'java',
    summary: 'Use String correctly, remembering that every operation returns a new one.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Java strings are **immutable**: nothing you call on a `String` ever changes it, and every method that looks like it edits one actually builds a brand-new string and hands it back. That single fact explains the whole API, the `==` trap, and why concatenating in a loop is slow — keep it in mind and the rest of this chapter follows.',
      },
      {
        kind: 'code',
        code: `String s = "hello";
String t = new String("hello");        // rarely needed — creates a new object

s.length();                // 5 — a METHOD, unlike arr.length
s.charAt(0);               // 'h' — no s[0] indexing in Java
s.isEmpty();               // false
s.isBlank();               // false — Java 11+, true for whitespace-only`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Java has no string indexing',
        body: '`s[0]` does not compile — use `s.charAt(0)`. For repeated access in a tight loop, convert once with `s.toCharArray()` and then use plain array indexing, which is faster than repeated `charAt` calls.',
      },
      {
        kind: 'code',
        caption: 'The methods you will actually use',
        code: `s.substring(1, 4);         // "ell" — start inclusive, END exclusive
s.indexOf("ll");           // 2, or -1 if absent
s.lastIndexOf('l');        // 3
s.contains("ell");         // true
s.startsWith("he");  s.endsWith("lo");
s.toUpperCase();  s.toLowerCase();
s.trim();  s.strip();      // strip is Unicode-aware, Java 11+
s.replace('l', 'L');
s.split(",");              // returns String[]
String.join("-", parts);
s.repeat(3);               // Java 11+
s.chars();                 // IntStream of code points`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'substring takes an end index, not a length',
        body: 'This is the opposite of C++\'s `substr(pos, len)`. `s.substring(2, 5)` gives characters at indices 2, 3, 4. To get characters i through j inclusive, write `s.substring(i, j + 1)`. If you switch between the languages, this is the most likely thing to get backwards.',
      },
      {
        kind: 'code',
        code: `String s = "programming";

s.substring(0, 3);         // "pro"
s.substring(3);            // "gramming" — to the end
s.substring(3, 7);         // "gram"

// Out of range throws:
s.substring(5, 100);       // StringIndexOutOfBoundsException`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Every method returns a new String',
        body: '`s.toUpperCase()` does not modify `s` — it returns a modified copy. Calling it without assigning the result is a very common bug that fails silently, because the expression is perfectly valid. If a string operation "does nothing", check you assigned the result.',
      },
      {
        kind: 'code',
        code: `String s = "hello";
s.toUpperCase();           // result discarded — s is still "hello"
s = s.toUpperCase();       // correct`,
      },
      { kind: 'heading', text: 'The string pool' },
      {
        kind: 'code',
        code: `String a = "hello";
String b = "hello";
a == b;                    // true — both point at the pooled literal

String c = new String("hello");
a == c;                    // FALSE — a distinct object
a.equals(c);               // true

String d = c.intern();     // returns the pooled instance
a == d;                    // true`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Pooling is why == on strings appears to work',
        body: 'Identical literals share one object, so `==` returns true — until you compare a string built at runtime, from input or concatenation, where it fails. Always use `.equals()`. This is the defining Java beginner bug and it passes every test built from literals.',
      },
      {
        kind: 'text',
        body: 'Immutability is also why `String` is safe as a `HashMap` key: its hash code is computed once and can never change, so a stored entry can always be found again.',
      },
    ],
    keyTakeaways: [
      '`s.charAt(i)` — Java has no string indexing with `[]`.',
      '`substring(start, end)` takes an end index, not a length.',
      'Every String method returns a new String; you must assign the result.',
      'Literals are pooled, which is why `==` misleadingly works on them.',
    ],
    practice: {
      prompt: 'Call `s.toUpperCase()` without assigning and confirm nothing changed. Then compare two literals with `==` and then a `new String` with `==` and `.equals()` — the flip between them is the bug worth seeing once.',
      leetcode: { title: 'Valid Palindrome', slug: 'valid-palindrome' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-5.6',
    language: 'java',
    summary: 'Build strings efficiently — the single most important Java string lesson.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Because `String` is immutable, `s += c` creates a brand-new string every time. Over n characters that copies 1 + 2 + … + n characters — **O(n²)**. `StringBuilder` is the mutable buffer that fixes it.',
      },
      {
        kind: 'code',
        code: `// O(n^2) — a new String every iteration
String result = "";
for (char c : chars) {
    result += c;
}

// O(n) — one growable buffer
StringBuilder sb = new StringBuilder();
for (char c : chars) {
    sb.append(c);
}
String result = sb.toString();`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'This is the most common Java TLE cause',
        body: 'For n = 10⁵ the concatenation version copies about five billion characters — a guaranteed Time Limit Exceeded on a solution whose logic is perfectly correct. Any loop that builds a string must use `StringBuilder`.',
      },
      {
        kind: 'code',
        caption: 'The StringBuilder API',
        code: `StringBuilder sb = new StringBuilder();
StringBuilder sb = new StringBuilder(1000);       // pre-size, avoids resizing

sb.append("text");  sb.append(42);  sb.append('c');   // overloaded for everything
sb.insert(0, "start");
sb.deleteCharAt(sb.length() - 1);                 // remove the last char
sb.delete(0, 3);                                  // remove a range
sb.setCharAt(0, 'X');
sb.charAt(0);
sb.reverse();                                     // in place!
sb.length();
sb.setLength(0);                                  // clear it, keeping capacity
sb.toString();                                    // final conversion`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'sb.reverse() and deleteCharAt are the backtracking pair',
        body: '`deleteCharAt(sb.length() - 1)` is Java\'s `pop_back` — essential for backtracking, where you append a choice, recurse, then undo it. And `sb.reverse()` reverses in place, which is how digit-building loops finish.',
      },
      {
        kind: 'code',
        caption: 'Backtracking with StringBuilder',
        code: `private void backtrack(StringBuilder current, List<String> result) {
    if (isComplete(current)) {
        result.add(current.toString());        // a snapshot — toString copies
        return;
    }
    for (char c : options) {
        current.append(c);                     // choose
        backtrack(current, result);
        current.deleteCharAt(current.length() - 1);   // un-choose
    }
}`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'toString() creates a copy — which is what you want when saving',
        body: 'Adding `current` itself would store a reference to the buffer that keeps mutating, so every saved result would end up identical. `current.toString()` snapshots it. This is the Java form of the copy-on-save rule that every backtracking solution needs.',
      },
      { kind: 'heading', text: 'StringBuilder vs StringBuffer' },
      {
        kind: 'table',
        headers: ['', '`StringBuilder`', '`StringBuffer`'],
        rows: [
          ['Thread-safe', 'No', 'Yes — synchronised'],
          ['Speed', '**Faster**', 'Slower — locking overhead'],
          ['Use in DSA', '**Always this one**', 'Never'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Always StringBuilder',
        body: '`StringBuffer` is the older, synchronised version. Single-threaded LeetCode solutions gain nothing from the locking and pay for it. The only reason to know `StringBuffer` exists is the interview question about the difference — the answer is "StringBuffer is synchronised and therefore slower; use StringBuilder unless you genuinely share it across threads".',
      },
      {
        kind: 'code',
        caption: 'When concatenation is fine',
        code: `// The compiler optimises a single expression into one StringBuilder:
String s = "a" + b + "c" + d;          // fine — one buffer under the hood

// But NOT across loop iterations:
for (...) s += x;                      // a new StringBuilder every iteration`,
      },
      {
        kind: 'text',
        body: 'So concatenating a handful of pieces in one expression is perfectly efficient — the compiler rewrites it. It is only the loop case that is quadratic, because each iteration is a separate expression.',
      },
    ],
    keyTakeaways: [
      '`s += c` in a loop is O(n²) — the leading cause of Java TLE on string problems.',
      '`StringBuilder` is the mutable buffer; `append` then `toString()` once.',
      '`deleteCharAt(len-1)` is the un-choose step in backtracking.',
      'Use `StringBuilder`, never `StringBuffer`, in single-threaded code.',
    ],
    practice: {
      prompt: 'Build a 100,000-character string with `+=` and with `StringBuilder`, and time both — the gap is dramatic. Then write a backtracking method using `append` and `deleteCharAt`, and check what happens if you add `current` instead of `current.toString()`.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-5.7',
    language: 'java',
    summary: 'Extract parts of a string, and understand what substring really costs.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A substring is a slice of a string, and you will take them constantly — checking prefixes, splitting words, testing palindromes. Java\'s `substring` has one interface quirk worth burning in now: the start index is **inclusive** and the end index is **exclusive**, which is exactly how every other range in Java works.',
      },
      {
        kind: 'code',
        caption: 'substring takes start and END',
        code: `String s = "programming";

s.substring(0, 3);      // "pro"       — indices 0, 1, 2
s.substring(3, 7);      // "gram"      — indices 3, 4, 5, 6
s.substring(7);         // "ming"      — from 7 to the end
s.substring(0);         // the whole string`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'End index, not length',
        body: 'C++ uses `substr(pos, len)`; Java uses `substring(start, end)`. For characters i through j **inclusive**, write `s.substring(i, j + 1)`. Getting this backwards produces strings of the wrong length that still look plausible — a genuinely confusing bug.',
      },
      {
        kind: 'code',
        caption: 'Converting between the models',
        code: `// Indices i to j inclusive
s.substring(i, j + 1);

// Starting at i, length L
s.substring(i, i + L);`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Out-of-range throws — unlike Python slicing',
        body: '`s.substring(5, 100)` throws `StringIndexOutOfBoundsException`. Python would silently clamp and return what it can. Java\'s behaviour is safer but means you must bound-check before calling — especially in sliding-window code where the right edge can run past the end.',
      },
      { kind: 'heading', text: 'substring copies — and that costs' },
      {
        kind: 'code',
        code: `// The hidden O(n^3)
for (int i = 0; i < n; i++)
    for (int j = i; j < n; j++)
        String sub = s.substring(i, j + 1);      // O(n) copy each time

// Work with indices instead — no allocation
for (int i = 0; i < n; i++)
    for (int j = i; j < n; j++)
        // examine s.charAt(k) for k in [i, j]`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'substring has been O(n) since Java 7',
        body: 'Before Java 7 it shared the underlying character array and was O(1). Since then it copies, to avoid a memory-leak problem where a small substring kept a huge string alive. So any advice you read about "substring is free in Java" is out of date — inside a loop it is a real cost.',
      },
      { kind: 'heading', text: 'Finding substrings' },
      {
        kind: 'code',
        code: `s.indexOf("gram");           // 3, or -1 if absent
s.indexOf("gram", 5);        // search from index 5
s.lastIndexOf("m");
s.contains("gram");          // true — usually the clearest test
s.matches("[a-z]+");         // full-string regex match`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'indexOf returns -1, unlike C++ which returns npos',
        body: 'Java\'s convention is the familiar −1, so `if (s.indexOf(x) != -1)` reads naturally. C++ uses `string::npos`, an unsigned value that misbehaves when compared with −1. Java\'s choice is simply easier to get right.',
      },
      {
        kind: 'code',
        caption: 'Splitting',
        code: `String[] parts = s.split(",");
String[] words = s.split("\\\\s+");        // regex: one or more whitespace

// split takes a REGEX, which surprises people:
"a.b.c".split(".");            // [] — '.' matches ANY character!
"a.b.c".split("\\\\.");          // ["a", "b", "c"] — escaped

String joined = String.join("-", parts);`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'split takes a regular expression, not a literal',
        body: 'So `split(".")` splits on every character and returns an empty array, and `split("|")` or `split("+")` misbehave similarly. Escape regex metacharacters with `\\\\` or use `Pattern.quote(delimiter)`. This catches almost everyone the first time they split on a dot.',
      },
    ],
    keyTakeaways: [
      '`substring(start, end)` — end is exclusive, not a length.',
      'Out-of-range throws; it does not clamp like Python.',
      '`substring` copies in O(n) — use indices inside loops.',
      '`split` takes a regex, so `.` and `|` must be escaped.',
    ],
    practice: {
      prompt: 'Print every substring of "abc" and check you get 6. Then call `"a.b.c".split(".")` and see the empty array, then fix it with escaping. Then time a loop that builds substrings against one that uses `charAt`.',
      leetcode: { title: 'Longest Common Prefix', slug: 'longest-common-prefix' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-5.8',
    language: 'java',
    summary: 'Compare strings correctly — the one Java rule everyone gets wrong first.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'If you remember one thing from this entire chapter, make it this: compare strings with `.equals()`, never with `==`. `==` asks "are these the same object in memory?", which is almost never the question you meant. The cruel part is that it sometimes returns `true` anyway — so the bug hides through all your testing and surfaces on the judge.',
      },
      {
        kind: 'code',
        code: `String a = "hello";
String b = "hello";
String c = new String("hello");

a == b;              // true  — both are the pooled literal
a == c;              // FALSE — c is a distinct object
a.equals(c);         // true  — compares CONTENT`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Always use .equals() for strings',
        body: '`==` asks "are these the same object in memory". It happens to work for literals because Java pools them, then fails for any string built at runtime — from input, concatenation, `substring`, or `StringBuilder`. This is the defining Java beginner bug, and it passes every test written with literals.',
      },
      {
        kind: 'code',
        caption: 'Where it fails in practice',
        code: `String key = "he" + "llo";        // compile-time constant → pooled → == works
String input = scanner.next();     // runtime → NOT pooled → == fails
String sub = text.substring(0, 5); // runtime → NOT pooled → == fails

sub == "hello";                    // false, even when the content matches
sub.equals("hello");               // true`,
      },
      { kind: 'heading', text: 'The comparison methods' },
      {
        kind: 'code',
        code: `a.equals(b);                  // exact content match
a.equalsIgnoreCase(b);        // case-insensitive
a.compareTo(b);               // <0, 0, >0 — lexicographic ordering
a.compareToIgnoreCase(b);
a.contentEquals(sb);          // compare against a StringBuilder

Objects.equals(a, b);         // null-safe in both directions`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Put the literal first to avoid a null check',
        body: '`input.equals("target")` throws if `input` is null. `"target".equals(input)` returns false instead. Reversing the order is a free null guard, and it is a small idiom that appears throughout production Java.',
      },
      { kind: 'heading', text: 'Ordering' },
      {
        kind: 'code',
        code: `"apple".compareTo("banana");      // negative — apple comes first
"banana".compareTo("apple");      // positive
"apple".compareTo("apple");       // 0

// Sorting uses it automatically:
Arrays.sort(words);
Collections.sort(list);

// Case-insensitive sort:
Arrays.sort(words, String.CASE_INSENSITIVE_ORDER);
words.sort(Comparator.comparing(String::toLowerCase));`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Lexicographic is not alphabetical',
        body: 'Comparison is by UTF-16 code unit, so every uppercase letter sorts before every lowercase one: `"Zebra".compareTo("apple")` is negative because `Z` is 90 and `a` is 97. If a problem wants case-insensitive ordering you must ask for it explicitly.',
      },
      {
        kind: 'code',
        caption: 'Comparing characters',
        code: `char a = 'x', b = 'y';
a == b;                       // fine — char is a PRIMITIVE, == compares values
a < b;                        // also fine

Character A = 'x', B = 'x';
A == B;                       // works here — Characters are cached like Integers
A.equals(B);                  // always correct`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'char is a primitive — == is correct for it',
        body: 'The `.equals()` rule applies to objects. `s.charAt(i) == s.charAt(j)` is exactly right and is what every palindrome check uses. Only the boxed `Character` type has the caching issue, and you rarely encounter it.',
      },
    ],
    keyTakeaways: [
      'Use `.equals()` for strings; `==` compares references and misleads on literals.',
      '`"literal".equals(input)` is a free null guard.',
      '`compareTo` gives lexicographic order — uppercase before lowercase.',
      '`char` is a primitive, so `charAt(i) == charAt(j)` is correct.',
    ],
    practice: {
      prompt: 'Compare two literals with `==`, then compare a `substring` result with `==` and `.equals()` — the flip is the bug worth seeing. Then sort a mixed-case word list and note that all the capitals come first.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-5.9',
    language: 'java',
    summary: 'Convert between strings, char arrays and numbers.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Because strings are immutable, the standard move when you need to *edit* one is to convert it to a `char[]`, change what you like, and build a new string from the result. Sorting the letters of a word, reversing in place and swapping characters all work this way — so these conversions are worth having at your fingertips.',
      },
      {
        kind: 'code',
        caption: 'String ↔ char[]',
        code: `String s = "hello";

char[] chars = s.toCharArray();       // O(n) — copies
chars[0] = 'H';
String back = new String(chars);      // "Hello"
String back = String.valueOf(chars);  // same thing`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Convert once when you need repeated access',
        body: '`s.charAt(i)` has a small bounds-check cost per call. In a tight loop over 10⁵ characters, `toCharArray()` once followed by plain array indexing is measurably faster. And it is the only way to *modify* characters, since `String` is immutable.',
      },
      {
        kind: 'code',
        caption: 'In-place reversal via char[]',
        code: `char[] c = s.toCharArray();
int left = 0, right = c.length - 1;
while (left < right) {
    char temp = c[left];
    c[left++] = c[right];
    c[right--] = temp;
}
String reversed = new String(c);

// Or just:
String reversed = new StringBuilder(s).reverse().toString();`,
      },
      { kind: 'heading', text: 'char ↔ int' },
      {
        kind: 'code',
        code: `char c = 'a';
int code = c;                    // 97 — implicit widening
int index = c - 'a';             // 0..25 for a lowercase letter
int digit = c - '0';             // '5' → 5

char back = (char) (index + 'a');       // explicit cast needed to narrow
char digitChar = (char) (5 + '0');      // '5'`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'char + int gives int — you must cast back',
        body: '`\'a\' + 1` has type `int`, so assigning it to a `char` needs `(char)`. Forgetting the cast gives `incompatible types: possible lossy conversion from int to char`. And `System.out.println(\'a\' + 1)` prints 98, not `b` — a classic surprise.',
      },
      {
        kind: 'code',
        caption: 'The Character helpers',
        code: `Character.isDigit(c);
Character.isLetter(c);
Character.isLetterOrDigit(c);      // the isalnum equivalent
Character.isUpperCase(c);  Character.isLowerCase(c);
Character.isWhitespace(c);
Character.toLowerCase(c);  Character.toUpperCase(c);   // return char
Character.getNumericValue(c);      // '5' → 5, and handles more than ASCII`,
      },
      { kind: 'heading', text: 'String ↔ number' },
      {
        kind: 'code',
        code: `int n = Integer.parseInt("42");
long l = Long.parseLong("10000000000");
double d = Double.parseDouble("3.14");
int hex = Integer.parseInt("ff", 16);        // with a radix

String s = String.valueOf(42);
String s = Integer.toString(42);
String s = "" + 42;                          // works, but allocates
String bin = Integer.toBinaryString(42);     // "101010"`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'parseInt throws on bad input',
        body: '`Integer.parseInt("abc")` throws `NumberFormatException`, which on the judge is a Runtime Error. `parseInt("")` and `parseInt(null)` throw too. For a single digit character, `c - \'0\'` is faster and cannot throw — prefer it when you know the character is a digit.',
      },
      {
        kind: 'code',
        caption: 'String ↔ String[]',
        code: `String[] words = sentence.split(" ");
String joined = String.join(" ", words);
String joined = String.join(", ", listOfStrings);      // works on a List too

// Reverse the words in a sentence:
String[] w = s.trim().split("\\\\s+");
Collections.reverse(Arrays.asList(w));
return String.join(" ", w);`,
      },
      {
        kind: 'text',
        body: 'That last snippet uses `Arrays.asList` as a *view* over the array — reversing the view reverses the underlying array. It works precisely because `asList` is a fixed-size view rather than a copy, which is one of the few times that behaviour is useful rather than surprising.',
      },
    ],
    keyTakeaways: [
      '`toCharArray()` / `new String(chars)` convert both ways, in O(n).',
      '`c - \'a\'` gives an index; casting back to `char` requires `(char)`.',
      '`Character.isLetterOrDigit` and friends replace C++\'s `<cctype>`.',
      '`parseInt` throws on malformed input; `c - \'0\'` cannot.',
    ],
    practice: {
      prompt: 'Reverse a string via `toCharArray` and two pointers, then again with `new StringBuilder(s).reverse()`. Then print `\'a\' + 1` and see 98 rather than `b`, and fix it with a cast.',
      leetcode: { title: 'Reverse String', slug: 'reverse-string' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-5.10',
    language: 'java',
    summary: 'Count occurrences in O(n) — the technique behind a huge share of problems.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Counting turns many O(n²) problems into O(n). Java gives you two implementations, and picking the right one matters more than people expect.',
      },
      { kind: 'heading', text: '1. Fixed array — for a known small alphabet' },
      {
        kind: 'code',
        code: `int[] freq = new int[26];               // zero-initialised automatically
for (char c : s.toCharArray()) {
    freq[c - 'a']++;
}

for (int i = 0; i < 26; i++)
    if (freq[i] > 0)
        System.out.println((char)('a' + i) + ": " + freq[i]);`,
      },
      {
        kind: 'table',
        headers: ['Character set', 'Array size', 'Index expression'],
        rows: [
          ['Lowercase only', '26', "`c - 'a'`"],
          ['Upper and lower', '52', "`c <= 'Z' ? c - 'A' : c - 'a' + 26`"],
          ['Any ASCII', '128', '`c`'],
          ['Digits only', '10', "`c - '0'`"],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Java arrays are zero-initialised, so no = {0} needed',
        body: 'This removes the single most common C++ frequency-counting bug, where a local `int freq[26];` holds garbage. In Java `new int[26]` is guaranteed to be all zeros. One fewer thing to remember.',
      },
      { kind: 'heading', text: '2. HashMap — for unbounded keys' },
      {
        kind: 'code',
        code: `Map<Character, Integer> freq = new HashMap<>();
for (char c : s.toCharArray()) {
    freq.put(c, freq.getOrDefault(c, 0) + 1);
}

// Or more concisely:
freq.merge(c, 1, Integer::sum);

// Java 8+ alternative:
freq.compute(c, (k, v) -> v == null ? 1 : v + 1);

for (Map.Entry<Character, Integer> e : freq.entrySet())
    System.out.println(e.getKey() + ": " + e.getValue());`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'map.get returns null, not 0',
        body: 'Assigning that to an `int` unboxes null and throws a `NullPointerException`. C++ default-constructs a zero; Java does not. `getOrDefault(key, 0)` is the direct equivalent, and `merge(key, 1, Integer::sum)` is the tidiest counting idiom.',
      },
      { kind: 'heading', text: 'The patterns this unlocks' },
      {
        kind: 'code',
        caption: 'Anagram check — increment then decrement',
        code: `public boolean isAnagram(String s, String t) {
    if (s.length() != t.length()) return false;

    int[] freq = new int[26];
    for (char c : s.toCharArray()) freq[c - 'a']++;
    for (char c : t.toCharArray()) freq[c - 'a']--;

    for (int f : freq)
        if (f != 0) return false;
    return true;
}`,
      },
      {
        kind: 'code',
        caption: 'First unique character — two passes',
        code: `public int firstUniqChar(String s) {
    int[] freq = new int[26];
    for (char c : s.toCharArray()) freq[c - 'a']++;      // pass 1: count
    for (int i = 0; i < s.length(); i++)                 // pass 2: scan in order
        if (freq[s.charAt(i) - 'a'] == 1) return i;
    return -1;
}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Two passes is usually the right shape',
        body: 'You cannot know a character is unique until you have seen the whole string, so trying to do it in one pass is a common instinct and generally wrong. Two O(n) passes is still O(n).',
      },
      {
        kind: 'code',
        caption: 'A frequency array as a map key',
        code: `// Group Anagrams without sorting each word
Map<String, List<String>> groups = new HashMap<>();
for (String w : words) {
    int[] count = new int[26];
    for (char c : w.toCharArray()) count[c - 'a']++;

    String key = Arrays.toString(count);       // canonical key from the counts
    groups.computeIfAbsent(key, k -> new ArrayList<>()).add(w);
}`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'int[] cannot be a HashMap key directly',
        body: 'Arrays use identity for `hashCode` and `equals`, so two arrays with identical contents hash differently and a lookup always misses. Convert to a `String` with `Arrays.toString(count)`, or use a `List<Integer>`, which does compare by content.',
      },
    ],
    keyTakeaways: [
      '`new int[26]` for a fixed alphabet — zero-initialised automatically.',
      '`getOrDefault` or `merge` for maps; `get` returns null and unboxing it throws.',
      'Count in one pass, scan in a second — one pass usually cannot work.',
      '`int[]` cannot be a map key; convert with `Arrays.toString`.',
    ],
    practice: {
      prompt: 'Write Valid Anagram with the increment/decrement trick and First Unique Character with two passes. Then try using an `int[]` as a `HashMap` key and watch every lookup miss — that identity-hashing behaviour is worth knowing before it costs you an hour.',
      leetcode: { title: 'Valid Anagram', slug: 'valid-anagram' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-5.11',
    language: 'java',
    summary: 'Recognise the patterns nearly every string problem reduces to.',
    readMinutes: 6,
    blocks: [
      {
        kind: 'text',
        body: 'String problems look varied but draw on a short list of techniques. Recognising which applies is most of the work.',
      },
      { kind: 'heading', text: '1. Frequency counting' },
      {
        kind: 'code',
        code: `int[] freq = new int[26];
for (char c : s.toCharArray()) freq[c - 'a']++;`,
      },
      {
        kind: 'text',
        body: 'Anagrams, first unique character, "can this be rearranged into…". Whenever *which* characters matter but their order does not, count them. **O(n)**.',
      },
      { kind: 'heading', text: '2. Two pointers' },
      {
        kind: 'code',
        code: `int left = 0, right = s.length() - 1;
while (left < right) {
    if (s.charAt(left) != s.charAt(right)) return false;
    left++;
    right--;
}`,
      },
      { kind: 'heading', text: '3. Sliding window' },
      {
        kind: 'code',
        caption: 'Longest substring without repeating characters',
        code: `public int lengthOfLongestSubstring(String s) {
    Map<Character, Integer> lastSeen = new HashMap<>();
    int best = 0, start = 0;

    for (int i = 0; i < s.length(); i++) {
        char c = s.charAt(i);
        if (lastSeen.containsKey(c) && lastSeen.get(c) >= start) {
            start = lastSeen.get(c) + 1;         // jump past the duplicate
        }
        lastSeen.put(c, i);
        best = Math.max(best, i - start + 1);
    }
    return best;
}`,
      },
      {
        kind: 'text',
        body: 'Any "longest/shortest substring with property X". The window grows on the right and its left edge jumps when the property breaks. **O(n)**.',
      },
      { kind: 'heading', text: '4. Sorting as a canonical form' },
      {
        kind: 'code',
        caption: 'Group anagrams',
        code: `Map<String, List<String>> groups = new HashMap<>();
for (String w : words) {
    char[] c = w.toCharArray();
    Arrays.sort(c);
    String key = new String(c);              // all anagrams share this key
    groups.computeIfAbsent(key, k -> new ArrayList<>()).add(w);
}
return new ArrayList<>(groups.values());`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'computeIfAbsent replaces the containsKey dance',
        body: '`groups.computeIfAbsent(key, k -> new ArrayList<>()).add(w)` creates the inner list only when the key is new, then adds to it — one line instead of a check, a put and an add. It is Java\'s equivalent of C++\'s `map[key].push_back(...)` and Python\'s `defaultdict`.',
      },
      { kind: 'heading', text: '5. Building a result with StringBuilder' },
      {
        kind: 'code',
        code: `StringBuilder sb = new StringBuilder();
for (char c : s.toCharArray())
    if (Character.isLetterOrDigit(c))
        sb.append(Character.toLowerCase(c));
String cleaned = sb.toString();`,
      },
      { kind: 'heading', text: '6. HashSet for seen-before' },
      {
        kind: 'code',
        code: `Set<Character> seen = new HashSet<>();
for (char c : s.toCharArray()) {
    if (!seen.add(c)) {          // add returns false if already present
        // duplicate
    }
}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'set.add returns whether it was new',
        body: 'So `if (!seen.add(c))` tests and inserts in a single hash lookup, instead of `contains` then `add`. Small, but it is the idiomatic Java form and it halves the hashing work.',
      },
      {
        kind: 'table',
        headers: ['Problem says…', 'Reach for'],
        rows: [
          ['"anagram", "rearrange", "permutation of"', 'Frequency count'],
          ['"palindrome", "reverse"', 'Two pointers'],
          ['"longest/shortest substring such that…"', 'Sliding window'],
          ['"group by", "same letters"', 'Sorted string as a map key'],
          ['"first unique", "duplicate"', 'Frequency count or `HashSet`'],
          ['"build a result string"', '`StringBuilder`'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'The Java-specific traps to check before submitting',
        body: 'Strings compared with `.equals()` not `==` · results built with `StringBuilder` not `+=` · `map.get` replaced with `getOrDefault` · `substring(start, end)` not `(start, length)` · `split` argument escaped if it is a regex metacharacter. Those five cover the large majority of avoidable Java string failures.',
      },
    ],
    keyTakeaways: [
      'Order irrelevant → frequency count. Contiguous answer → sliding window.',
      'A sorted `char[]` turned back into a String is the anagram key.',
      '`computeIfAbsent` and `set.add`\'s return value cut a lookup each.',
      'Build results with `StringBuilder`, never `+=` in a loop.',
    ],
    practice: {
      prompt: 'Solve Longest Substring Without Repeating Characters with a sliding window, then Group Anagrams with `computeIfAbsent`. Between them they exercise four of the six patterns and are among the most frequently asked string questions.',
      leetcode: { title: 'Group Anagrams', slug: 'group-anagrams' },
    },
  },
];
