import type { Lesson } from '../types';

/**
 * Java Chapter 3 — Control Flow.
 * Branching and looping, ending with the loop shapes that recur across the
 * whole 90-day plan.
 */
export const ch03: Lesson[] = [
  // -------------------------------------------------------------------------
  {
    topicId: 'java-3.1',
    language: 'java',
    summary: 'Branch on conditions cleanly, and order your cases so the logic stays correct.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'An `if` runs a block only when a condition is true. That much you already understand. What separates readable code from a tangle is **ordering** — arranging the cases so each one only has to handle what the branches above it did not already catch.',
      },
      {
        kind: 'code',
        caption: 'The full form',
        code: `if (score >= 90) {
    grade = 'A';
} else if (score >= 80) {
    grade = 'B';
} else if (score >= 70) {
    grade = 'C';
} else {
    grade = 'F';
}`,
      },
      {
        kind: 'text',
        body: 'Conditions are checked top to bottom and **the first true branch wins** — everything after it is skipped. That is why the example needs no upper bounds: by the time you reach `score >= 80`, the score is already known to be below 90.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Order matters — a wrong order silently swallows cases',
        body: 'Put `score >= 70` first and every score of 95 also matches it, getting a C. Nothing errors; the answers are just wrong. When branches are ranges, always order from most restrictive to least.',
      },
      { kind: 'heading', text: 'Java requires real booleans' },
      {
        kind: 'code',
        code: `int x = 5;
if (x) { ... }              // ERROR — int is not boolean
if (x != 0) { ... }         // required

if (count = 1) { ... }      // ERROR — assignment yields int, not boolean
if (count == 1) { ... }     // correct

String s = null;
if (s) { ... }              // ERROR — object is not boolean
if (s != null) { ... }      // required`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'This eliminates two classic C++ bugs',
        body: 'Because a condition must genuinely be `boolean`, `if (x = 5)` and `if (nonZeroInt)` are compile errors rather than silent misbehaviour. Two of C++\'s most common beginner traps simply cannot occur in Java — a real advantage worth appreciating.',
      },
      { kind: 'heading', text: 'Always use braces' },
      {
        kind: 'code',
        code: `// Legal but fragile — only the next single statement is inside
if (found)
    System.out.println("yes");
    count++;                       // ALWAYS runs, despite the indentation

// Safe
if (found) {
    System.out.println("yes");
    count++;
}`,
      },
      {
        kind: 'text',
        body: 'The braceless form is legal and reads fine until someone adds a second line. This exact pattern caused the well-known "goto fail" TLS bug in 2014. Brace everything.',
      },
      { kind: 'heading', text: 'The ternary operator' },
      {
        kind: 'code',
        code: `int maxVal = (a > b) ? a : b;

// Java-specific: the branches must have compatible types
Object o = flag ? "text" : 42;        // legal but usually a mistake
int n = flag ? 1 : 2;                 // both int — clean`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Guard clauses beat deep nesting',
        body: 'Handle edge cases first and return early, so the main logic stays at one indent level. `if (root == null) return 0;` at the top of a recursive method is both the null guard and the base case — which is why tree solutions are usually three lines.',
      },
      {
        kind: 'code',
        code: `// Nested — the real work drifts rightwards
public int depth(TreeNode root) {
    if (root != null) {
        return 1 + Math.max(depth(root.left), depth(root.right));
    } else {
        return 0;
    }
}

// Guard clause — base case out of the way, logic stays flat
public int depth(TreeNode root) {
    if (root == null) return 0;
    return 1 + Math.max(depth(root.left), depth(root.right));
}`,
      },
    ],
    keyTakeaways: [
      'The first true branch wins; order range checks most to least restrictive.',
      'Java requires genuine booleans, so `if (x = 5)` is a compile error.',
      'Always brace `if` bodies — indentation does not group statements.',
      'Guard clauses with early return keep recursive code flat.',
    ],
    practice: {
      prompt: 'Write FizzBuzz — the trick is checking divisibility by 15 before 3 and 5. Then try `if (x = 5)` and confirm Java refuses to compile it, which C++ would not. Then rewrite a nested method using a guard clause.',
      leetcode: { title: 'Fizz Buzz', slug: 'fizz-buzz' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-3.2',
    language: 'java',
    summary: 'Handle multi-condition logic without drowning in indentation.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'Sooner or later a problem needs a decision inside a decision. Nesting works, but every level costs four more spaces of indentation and a little more of the reader\'s attention. This lesson covers two ways to flatten it: combining conditions with `&&`, and returning early so the main path stays at the left margin.',
      },
      {
        kind: 'code',
        caption: 'The same check, three ways',
        code: `// Nested
if (r >= 0) {
    if (r < rows) {
        if (grid[r][c] == 1) { ... }
    }
}

// Flattened with && — short-circuiting makes this safe
if (r >= 0 && r < rows && grid[r][c] == 1) { ... }

// Guard clause — best when the method can return early
if (r < 0 || r >= rows) return;
if (grid[r][c] != 1) return;
// main logic at one indent level`,
      },
      {
        kind: 'text',
        body: 'The flattened version is safe precisely because of short-circuiting: if `r` is out of range, `grid[r][c]` is never evaluated. Without that guarantee you would be forced into the nested form.',
      },
      { kind: 'heading', text: 'When nesting is genuinely right' },
      {
        kind: 'code',
        code: `if (node != null) {
    if (target < node.val) {
        node = node.left;
    } else {
        node = node.right;
    }
} else {
    return false;          // the outer condition has its own alternative
}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Three levels is the warning sign',
        body: 'Past three levels of indentation, extract a helper method or invert the conditions into guard clauses. Deeply nested code is where off-by-one and missing-else bugs hide, because you can no longer see which branch you are in.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'The dangling else',
        body: 'Without braces, an `else` binds to the **nearest** unmatched `if`, not the one your indentation suggests. In `if (a) if (b) x(); else y();` the `else` belongs to `if (b)`. Braces remove the ambiguity entirely — another reason to always use them.',
      },
      {
        kind: 'code',
        caption: 'The grid-bounds helper worth writing once',
        code: `private boolean inBounds(int r, int c, int rows, int cols) {
    return r >= 0 && r < rows && c >= 0 && c < cols;
}

// Every grid traversal now reads cleanly:
if (inBounds(nr, nc, rows, cols) && grid[nr][nc] == 1) { ... }`,
      },
      {
        kind: 'text',
        body: 'You will write that bounds check in every DFS, BFS and flood-fill problem. Pulling it into a named method removes four conditions from every call site — and in Java, where `grid.length` and `grid[0].length` are verbose, it helps even more than in C++.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Guard grid[0] before reading its length',
        body: '`grid[0].length` throws `ArrayIndexOutOfBoundsException` when the grid has no rows. Start every grid method with `if (grid == null || grid.length == 0 || grid[0].length == 0) return ...;`. Empty input is one of the most reliably present hidden test cases.',
      },
    ],
    keyTakeaways: [
      'Flatten nested `if`s with `&&` — short-circuiting keeps the guard safe.',
      'Guard clauses with early returns beat nesting when a method can bail out.',
      'Without braces, `else` binds to the nearest `if`.',
      'Extract `inBounds(...)` — it removes four conditions from every call site.',
    ],
    practice: {
      prompt: 'Write `inBounds` and use it to count how many cells in a 2D array equal 1, checking all four neighbours of each. Then run it on an empty array to confirm your guard works — that helper reappears in every graph and matrix problem.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-3.3',
    language: 'java',
    summary: 'Use switch for multi-way branching — including on Strings, which C++ cannot do.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'When you are comparing **one variable** against a list of fixed values, a chain of `else if` works but reads badly. `switch` says the same thing more directly. Java\'s version has one feature C++ lacks — it can switch on a `String` — and one notorious hazard, fall-through, which the modern arrow form removes entirely.',
      },
      {
        kind: 'code',
        caption: 'Classic switch',
        code: `switch (op) {
    case '+':
        result = a + b;
        break;
    case '-':
        result = a - b;
        break;
    default:
        result = 0;
}`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Missing break causes fall-through',
        body: 'Without `break`, execution continues into the *next* case, ignoring its label. So a missing `break` in the `+` case computes `a + b` and immediately overwrites it with `a - b`. This is the defining bug of switch statements, and the compiler does not warn by default.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Java can switch on Strings — C++ cannot',
        body: '`switch (command) { case "add": ... }` is legal since Java 7 and uses `.equals()` internally, so it does the right thing. That makes `switch` genuinely useful for command dispatch and state machines in a way it is not in C++.',
      },
      {
        kind: 'code',
        code: `switch (command) {
    case "add":    result = a + b; break;
    case "sub":    result = a - b; break;
    default:       result = 0;
}

// Switching on an enum is also common and needs no qualification:
switch (direction) {
    case UP:    ... break;
    case DOWN:  ... break;
}`,
      },
      { kind: 'heading', text: 'Switch expressions — the modern form' },
      {
        kind: 'code',
        code: `// Java 14+ — arrow syntax, no fall-through, and it RETURNS a value
int result = switch (op) {
    case '+' -> a + b;
    case '-' -> a - b;
    case '*' -> a * b;
    default  -> 0;
};

// Several labels sharing one branch
boolean isVowel = switch (c) {
    case 'a', 'e', 'i', 'o', 'u' -> true;
    default -> false;
};`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The arrow form removes the break bug entirely',
        body: 'There is no fall-through, so no `break` is needed and none can be forgotten. It also produces a value, which makes assignment cleaner. LeetCode supports modern Java, so prefer this form — it is shorter and cannot exhibit the classic switch bug.',
      },
      {
        kind: 'code',
        caption: 'Deliberate fall-through in the classic form',
        code: `switch (c) {
    case 'a':
    case 'e':
    case 'i':
        isVowel = true;      // all three labels share this body
        break;
    default:
        isVowel = false;
}`,
      },
      {
        kind: 'table',
        headers: ['Use `switch` when', 'Use `if/else` when'],
        rows: [
          ['Comparing one value to several constants', 'Testing ranges (`score >= 90`)'],
          ['The type is `int`, `char`, `String` or `enum`', 'Comparing doubles or objects'],
          ['There are four or more cases', 'Conditions involve `&&` / `||`'],
        ],
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Declaring a variable inside a classic case needs braces',
        body: '`case 1: int x = 5; break;` fails, because `x` would be in scope for later cases without being initialised. Wrap the body: `case 1: { int x = 5; break; }`. The arrow form does not have this problem.',
      },
    ],
    keyTakeaways: [
      'Every classic `case` needs `break`, or execution falls through.',
      'Java can switch on `String` and `enum`; C++ cannot.',
      'The arrow form `case x -> value` has no fall-through and returns a value.',
      'Declaring a variable inside a classic case requires braces.',
    ],
    practice: {
      prompt: 'Write a calculator with the classic switch, delete one `break`, and trace the wrong answer. Then rewrite it with the arrow form and note that the bug is now impossible to write.',
      leetcode: { title: 'Evaluate Reverse Polish Notation', slug: 'evaluate-reverse-polish-notation' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-3.4',
    language: 'java',
    summary: 'Write index loops that iterate exactly the right number of times.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'The `for` loop is the workhorse of DSA — you will write it thousands of times. Its three parts run at different moments (**once** at the start, **before** every pass, **after** every pass), and knowing which is which is what lets you write a loop that stops exactly where you intended instead of one element short or one too far.',
      },
      {
        kind: 'code',
        caption: 'The three parts',
        code: `for (int i = 0; i < n; i++) {
    // body
}
//   ^init      ^condition  ^step

// 1. init      runs once, before anything
// 2. condition checked BEFORE each iteration
// 3. step      runs AFTER each iteration`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Index loops are half-open by convention',
        body: '`i = 0; i < n` visits exactly n elements: indices 0 through n−1. Sticking to this convention — inclusive start, exclusive end — eliminates most off-by-one errors, and it matches how `subList`, `Arrays.copyOfRange` and every other range API in Java works.',
      },
      {
        kind: 'code',
        caption: 'The four shapes you will write constantly',
        code: `// Forward
for (int i = 0; i < n; i++) { ... }

// Backward
for (int i = n - 1; i >= 0; i--) { ... }

// Every pair (i, j) with j after i
for (int i = 0; i < n; i++)
    for (int j = i + 1; j < n; j++) { ... }

// 2D grid
for (int r = 0; r < rows; r++)
    for (int c = 0; c < cols; c++) { ... }`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'No unsigned trap in Java',
        body: '`arr.length` is an `int`, not an unsigned type, so `arr.length - 1` on an empty array is simply `-1` and the backward loop correctly does nothing. In C++ that expression wraps to a huge number and the loop runs billions of times. One less thing to guard.',
      },
      { kind: 'heading', text: 'length vs length() vs size()' },
      {
        kind: 'code',
        code: `int[] arr = new int[5];
arr.length;                    // a FIELD — no brackets

String s = "hello";
s.length();                    // a METHOD

List<Integer> list = new ArrayList<>();
list.size();                   // a different METHOD name

int[][] grid = new int[3][4];
grid.length;                   // 3 — rows
grid[0].length;                // 4 — columns`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Three different spellings for "how big is it"',
        body: 'Arrays use the field `length`, `String` uses the method `length()`, and collections use `size()`. It is inconsistent and a constant source of typos. The compiler catches every one, so it costs seconds rather than hours — but it is worth committing to memory.',
      },
      { kind: 'heading', text: 'Multiple variables in one loop' },
      {
        kind: 'code',
        code: `// Two pointers converging — a common two-variable loop
for (int left = 0, right = n - 1; left < right; left++, right--) {
    swap(arr, left, right);
}

// An empty section is legal
int i = 0;
for (; i < n; i++) { ... }
// i survives the loop here, because it was declared outside`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'The empty-body typo',
        body: '`for (int i = 0; i < n; i++);` — note the semicolon — is a complete loop with an empty body. The block that follows then runs exactly once. It compiles silently and the bug is nearly invisible on screen.',
      },
      {
        kind: 'text',
        body: 'One scope note: a variable declared in the init section does not exist after the loop. If you need the final value — as in a linear search that reports where it stopped — declare it before the loop.',
      },
    ],
    keyTakeaways: [
      '`i = 0; i < n` visits exactly n elements — the half-open convention.',
      'Java has no unsigned types, so `length - 1` on an empty array is safely `-1`.',
      '`arr.length` (field), `s.length()` (method), `list.size()` (method).',
      'A stray semicolon after `for (...)` creates an empty-bodied loop.',
    ],
    practice: {
      prompt: 'Print an array forwards, backwards, and every pair `(i, j)` with `j > i`. Run all three on an empty array — the backward one is safe in Java where it would break in C++. Then write `arr.size()` and `s.length` to see which errors the compiler gives.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-3.5',
    language: 'java',
    summary: 'Iterate collections directly — and know exactly what you cannot do with it.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'When you need every element but do not care about positions, the for-each loop says so in half the characters and removes every chance of an index bug. The trade-off is real though: you give up the index, you cannot easily walk backwards, and you must not modify the collection while it runs. Knowing those three limits tells you exactly when to use it.',
      },
      {
        kind: 'code',
        code: `int[] nums = {1, 2, 3};

for (int x : nums) {
    System.out.println(x);
}

List<String> words = List.of("a", "b");
for (String w : words) { ... }

Map<String,Integer> m = new HashMap<>();
for (Map.Entry<String,Integer> e : m.entrySet()) {
    e.getKey();  e.getValue();
}
for (String key : m.keySet()) { ... }
for (int v : m.values()) { ... }`,
      },
      {
        kind: 'text',
        body: 'The for-each loop reads better, cannot go out of bounds, and works on arrays and anything implementing `Iterable`. Use it whenever the index itself is not needed.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'You cannot modify array elements through it',
        body: '`for (int x : nums) x *= 2;` modifies a **copy** of each element — the array is unchanged, and nothing warns you. Java has no reference-binding equivalent of C++\'s `for (int& x : v)`. To modify elements you must use an index loop: `for (int i = 0; i < nums.length; i++) nums[i] *= 2;`.',
      },
      {
        kind: 'code',
        code: `// Does NOT modify nums
for (int x : nums) x *= 2;

// Does modify nums
for (int i = 0; i < nums.length; i++) nums[i] *= 2;

// For objects, you CAN mutate the object (but not reassign the variable):
for (ListNode node : nodes) node.val *= 2;      // works — mutating the object
for (ListNode node : nodes) node = null;        // does nothing to the list`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The distinction is reassignment versus mutation',
        body: 'The loop variable is a copy of the reference. Reassigning it changes nothing, but calling a mutating method on the object it points at works normally. For primitives there is no object, so nothing can be changed at all.',
      },
      { kind: 'heading', text: 'ConcurrentModificationException' },
      {
        kind: 'code',
        code: `List<Integer> list = new ArrayList<>(List.of(1, 2, 3));

for (int x : list) {
    if (x == 2) list.remove(Integer.valueOf(x));    // ConcurrentModificationException
}

// Use an explicit Iterator to remove safely:
Iterator<Integer> it = list.iterator();
while (it.hasNext()) {
    if (it.next() == 2) it.remove();
}

// Or the one-liner:
list.removeIf(x -> x == 2);`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Java fails loudly where C++ fails silently',
        body: 'Modifying a collection during a for-each throws `ConcurrentModificationException` immediately with a clear name. The equivalent C++ mistake is undefined behaviour that may appear to work. `removeIf` is the cleanest fix and reads well.',
      },
      { kind: 'heading', text: 'The int vs Integer unboxing cost' },
      {
        kind: 'code',
        code: `List<Integer> list = ...;

for (int x : list) { ... }          // unboxes each element — fine, but has a cost
for (Integer x : list) { ... }      // no unboxing

// For a hot loop over a large list, an int[] avoids boxing entirely.`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Unboxing null throws',
        body: '`for (int x : listWithNulls)` throws a `NullPointerException` when it reaches a null element, because it cannot unbox null into an `int`. If a list can contain nulls, iterate with `Integer` and check.',
      },
    ],
    keyTakeaways: [
      'For-each reads better and cannot go out of bounds — prefer it without an index.',
      'It cannot modify array elements; use an index loop for that.',
      'Mutating an object through the loop variable works; reassigning it does not.',
      'Modifying a collection during for-each throws `ConcurrentModificationException`.',
    ],
    practice: {
      prompt: 'Write `for (int x : nums) x *= 2;` and confirm the array is unchanged — that silent no-op is the main for-each trap. Then remove an element from a list inside a for-each, read the exception, and fix it with `removeIf`.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-3.6',
    language: 'java',
    summary: 'Loop when you do not know the iteration count in advance.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Use `for` when you know how many iterations you need. Use `while` when looping until something changes — traversing a linked list, converging a binary search, extracting digits.',
      },
      {
        kind: 'code',
        caption: 'The three canonical while loops',
        code: `// 1. Walk a linked list — length unknown
while (node != null) {
    sum += node.val;
    node = node.next;
}

// 2. Extract digits
while (n > 0) {
    digits.add(n % 10);
    n /= 10;
}

// 3. Binary search
while (low <= high) {
    int mid = low + (high - low) / 2;
    if (nums[mid] == target) return mid;
    if (nums[mid] < target) low = mid + 1;
    else high = mid - 1;
}`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Every while loop needs something that changes',
        body: 'The commonest infinite loop is forgetting to advance — omitting `node = node.next;` or `n /= 10;`. On LeetCode this appears as Time Limit Exceeded rather than a hang. Before leaving a `while` loop, point at the line that makes progress toward the exit.',
      },
      { kind: 'heading', text: 'Binary search is where this goes subtly wrong' },
      {
        kind: 'code',
        code: `// INFINITE — mid equals low when only two elements remain
while (low < high) {
    int mid = (low + high) / 2;
    if (check(mid)) high = mid;
    else low = mid;                  // BUG — should be mid + 1
}

// Correct
while (low < high) {
    int mid = low + (high - low) / 2;
    if (check(mid)) high = mid;
    else low = mid + 1;
}`,
      },
      {
        kind: 'text',
        body: 'Because integer division rounds down, `mid` equals `low` when the range shrinks to two. Assigning `low = mid` changes nothing and the loop spins forever. Whenever you write a binary search, hand-check the two-element case.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Use low + (high - low) / 2',
        body: '`(low + high) / 2` overflows when both are near `Integer.MAX_VALUE`, producing a negative `mid` and an out-of-bounds access. This exact bug sat in Java\'s own `Arrays.binarySearch` for nine years. Write the safe form by habit.',
      },
      { kind: 'heading', text: 'while (true) with an internal break' },
      {
        kind: 'code',
        code: `while (true) {
    int value = getNext();
    if (value == SENTINEL) break;
    process(value);
}`,
      },
      {
        kind: 'text',
        body: 'When the natural exit point is in the middle of the body rather than the top, this is clearer than contorting the condition. Just make sure every path can reach a `break`.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Scope difference from for',
        body: 'A variable used by a `while` must be declared before it and stays in scope afterwards, whereas a `for` loop\'s counter disappears. That is occasionally useful when you need the final value — a linear search reporting where it stopped, for instance.',
      },
    ],
    keyTakeaways: [
      '`for` for a known count, `while` for "until a condition changes".',
      'Every `while` needs a statement moving it toward termination.',
      'In binary search, `low = mid` instead of `low = mid + 1` loops forever.',
      'Use `low + (high - low) / 2` — the naive midpoint overflows.',
    ],
    practice: {
      prompt: 'Write binary search with a `while` loop and test it on a two-element array and an empty one — those are the inputs where the `mid + 1` bug and the boundary conditions show up. Getting binary search exactly right by hand is worth the time; it appears in dozens of problems.',
      leetcode: { title: 'Binary Search', slug: 'binary-search' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-3.7',
    language: 'java',
    summary: 'Run a loop body at least once, and know why you will rarely need this.',
    readMinutes: 2,
    blocks: [
      {
        kind: 'text',
        body: 'A `do-while` checks its condition **after** running the body, so the body always executes at least once. It is the rarest of the three loops — worth recognising when you read someone else\'s code, but in DSA you will reach for `for` or `while` almost every time.',
      },
      {
        kind: 'code',
        code: `do {
    // body — always runs at least once
} while (condition);      // note the semicolon`,
      },
      {
        kind: 'text',
        body: 'The only difference from `while` is *when* the condition is checked: at the bottom rather than the top. The body therefore always executes at least once, even if the condition is false from the start.',
      },
      {
        kind: 'code',
        caption: 'The difference in one example',
        code: `int n = 0;

while (n > 0) { System.out.println("runs"); }        // prints nothing
do            { System.out.println("runs"); } while (n > 0);   // prints once`,
      },
      { kind: 'heading', text: 'Where it genuinely fits' },
      {
        kind: 'code',
        caption: 'Digit extraction, handling n = 0 correctly',
        code: `// while version: for n = 0 this produces NOTHING, but 0 has one digit
while (n > 0) { digits.add(n % 10); n /= 10; }

// do-while: correctly yields a single 0
do {
    digits.add(n % 10);
    n /= 10;
} while (n > 0);`,
      },
      {
        kind: 'text',
        body: 'That zero case is a genuine edge case in digit problems, and `do-while` handles it without a special branch. The other classic use is input validation — prompt, read, repeat while invalid.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'The semicolon is required',
        body: '`do { ... } while (x)` without the trailing semicolon is a compile error, and the message is often confusing because the compiler reads on into the next statement. It is the only loop form that ends with a semicolon.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Honestly — you will barely use this',
        body: 'In DSA, `for` and `while` cover nearly everything, and reviewers find `do-while` harder to scan because the exit condition sits at the bottom. Know it so you can read other people\'s code and answer the interview question about the difference. Reach for it only when "at least once" is genuinely part of the requirement.',
      },
    ],
    keyTakeaways: [
      '`do-while` checks its condition at the bottom, so the body always runs once.',
      'It handles `n = 0` in digit extraction without a special branch.',
      'It is the only loop that ends with a semicolon.',
      'Rare in practice — `for` and `while` cover almost every DSA loop.',
    ],
    practice: {
      prompt: 'Write digit extraction both ways and run each on `n = 0`. The `while` version silently produces an empty result while `do-while` correctly gives one digit — a small, concrete demonstration of when "at least once" is the right semantics.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-3.8',
    language: 'java',
    summary: 'Exit loops and methods early, including Java\'s labelled break.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Once you have found what you were looking for, carrying on is wasted work. These three keywords are how you stop: `break` leaves the loop, `continue` skips to the next pass, and `return` leaves the method entirely. Using them well is often the difference between a solution that passes and one that times out.',
      },
      {
        kind: 'table',
        headers: ['Keyword', 'What it does'],
        rows: [
          ['`break`', 'Exits the innermost loop or `switch`'],
          ['`continue`', 'Skips the rest of this iteration, starts the next'],
          ['`return`', 'Exits the whole method, however deeply nested'],
        ],
      },
      {
        kind: 'code',
        code: `// break — stop as soon as you have the answer
for (int x : nums) {
    if (x % 2 == 0) { firstEven = x; break; }
}

// continue — skip the ones you do not care about
for (int x : nums) {
    if (x < 0) continue;
    sum += x;
}`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'continue in a while loop skips your increment',
        body: 'In a `for` loop, `continue` still runs the step section, so the loop advances. In a `while` loop the increment is inside the body — jumping past it means the variable never changes and you get an instant infinite loop. This is the most common `continue` bug.',
      },
      {
        kind: 'code',
        code: `int i = 0;
while (i < n) {
    if (nums[i] < 0) continue;    // INFINITE — i never advances
    sum += nums[i];
    i++;
}

// Fixed — advance before continuing
while (i < n) {
    if (nums[i] < 0) { i++; continue; }
    sum += nums[i];
    i++;
}`,
      },
      { kind: 'heading', text: 'Labelled break — Java has it, C++ does not' },
      {
        kind: 'code',
        code: `outer:
for (int i = 0; i < rows; i++) {
    for (int j = 0; j < cols; j++) {
        if (grid[i][j] == target) {
            found = true;
            break outer;              // exits BOTH loops
        }
    }
}

// continue also takes a label:
outer:
for (int i = 0; i < n; i++) {
    for (int j = 0; j < m; j++) {
        if (skip) continue outer;     // next i, not next j
    }
}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Labelled break is Java\'s answer to goto',
        body: 'C++ needs a flag variable or an actual `goto` to escape nested loops. Java\'s labelled break does it cleanly and is considered idiomatic — unlike `goto`, it can only jump *out* of an enclosing block, so it cannot create spaghetti control flow.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'But returning is usually cleaner still',
        body: 'When a search succeeds, extracting the loops into a method and `return`-ing the answer is clearer than either a label or a flag. Reach for labelled break when you genuinely need to continue after escaping; otherwise a helper method reads better.',
      },
      {
        kind: 'code',
        code: `// Clearest of all — no label, no flag
private int[] find(int[][] grid, int target) {
    for (int i = 0; i < grid.length; i++)
        for (int j = 0; j < grid[0].length; j++)
            if (grid[i][j] == target) return new int[]{i, j};
    return null;
}`,
      },
      {
        kind: 'text',
        body: 'One more note: `break` inside a `switch` that sits inside a loop exits the *switch*, not the loop. If you want to leave the loop from inside a switch case, you need a label — a genuine gotcha worth remembering.',
      },
    ],
    keyTakeaways: [
      '`break` exits one loop level; `continue` starts the next iteration.',
      '`continue` in a `while` loop skips your increment — an easy infinite loop.',
      'Labelled `break outer;` escapes nested loops — Java-only, and idiomatic.',
      '`break` inside a `switch` exits the switch, not the enclosing loop.',
    ],
    practice: {
      prompt: 'Write a nested grid search using labelled break, then rewrite it as a method that returns directly and compare readability. Then write the `while` + `continue` infinite loop deliberately — on the judge that symptom appears only as Time Limit Exceeded.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-3.9',
    language: 'java',
    summary: 'Recognise the loop shapes nearly every array problem reduces to.',
    readMinutes: 6,
    blocks: [
      {
        kind: 'text',
        body: 'Most array and string problems are one of a small number of loop shapes. Recognising which one applies is most of solving the problem — this previews Chapter 16, framed as loop structure.',
      },
      { kind: 'heading', text: '1. Single pass — accumulate' },
      {
        kind: 'code',
        code: `long sum = 0;
int best = Integer.MIN_VALUE;
for (int x : nums) {
    sum += x;
    best = Math.max(best, x);
}`,
      },
      {
        kind: 'text',
        body: 'One variable carrying information forward. **O(n)**. Note `long` for the sum and `Integer.MIN_VALUE` as the initial maximum — both habits worth forming early.',
      },
      { kind: 'heading', text: '2. Two pointers from both ends' },
      {
        kind: 'code',
        code: `int left = 0, right = n - 1;
while (left < right) {
    int sum = nums[left] + nums[right];
    if (sum == target) return new int[]{left, right};
    if (sum < target) left++;
    else right--;
}`,
      },
      {
        kind: 'text',
        body: 'Requires a **sorted** array. Each step eliminates one candidate, giving O(n) where brute force is O(n²). Palindrome checks and reversals use the same shape.',
      },
      { kind: 'heading', text: '3. Fast and slow pointers' },
      {
        kind: 'code',
        code: `ListNode slow = head, fast = head;
while (fast != null && fast.next != null) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow == fast) return true;      // cycle detected
}`,
      },
      {
        kind: 'text',
        body: 'Note that `slow == fast` is correct here: comparing object references is exactly the question being asked — "are these the same node?" This is one of the few places `==` on objects is right.',
      },
      { kind: 'heading', text: '4. Sliding window' },
      {
        kind: 'code',
        code: `int left = 0, sum = 0, best = 0;
for (int right = 0; right < n; right++) {
    sum += nums[right];                 // expand
    while (sum > limit) {               // shrink until valid
        sum -= nums[left];
        left++;
    }
    best = Math.max(best, right - left + 1);
}`,
      },
      {
        kind: 'text',
        body: 'Despite the nested `while`, this is **O(n)** — each element enters and leaves the window at most once. Use it for "longest/shortest contiguous subarray with property X".',
      },
      { kind: 'heading', text: '5. Prefix sum' },
      {
        kind: 'code',
        code: `int[] prefix = new int[n + 1];
for (int i = 0; i < n; i++) prefix[i + 1] = prefix[i] + nums[i];

int rangeSum = prefix[j + 1] - prefix[i];      // sum of nums[i..j], O(1)`,
      },
      {
        kind: 'text',
        body: 'Pay O(n) once to make every subsequent range query O(1). The `n + 1` sizing with a leading zero removes the special case for ranges starting at index 0 — and Java zero-initialises the array for you.',
      },
      { kind: 'heading', text: '6. Nested loops — all pairs' },
      {
        kind: 'code',
        code: `for (int i = 0; i < n; i++)
    for (int j = i + 1; j < n; j++)
        // each unordered pair exactly once`,
      },
      {
        kind: 'text',
        body: '**O(n²)**. Fine when n ≤ 1000, too slow beyond that. If the constraints allow n = 10⁵, an O(n²) loop will exceed the time limit — your signal to reach for a `HashMap` or two pointers instead.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Let the constraints choose the shape',
        body: 'Judges allow roughly 10⁸ simple operations per second. So n ≤ 10⁵ rules out O(n²) and points at O(n) or O(n log n); n ≤ 1000 makes O(n²) fine; n ≤ 20 suggests subsets or permutations. Reading the constraint first tells you which shape to aim for before writing anything.',
      },
      {
        kind: 'table',
        headers: ['Problem sounds like…', 'Reach for'],
        rows: [
          ['"pair summing to target", sorted input', 'Two pointers'],
          ['"longest/shortest contiguous subarray"', 'Sliding window'],
          ['"sum of range i..j", many queries', 'Prefix sum'],
          ['"cycle in a linked list"', 'Fast and slow pointers'],
          ['"have I seen this value"', '`HashSet` in a single pass'],
        ],
      },
    ],
    keyTakeaways: [
      'Most array problems are single pass, two pointers, sliding window, or prefix sum.',
      'Sliding window is O(n) despite the inner `while` — each element enters once.',
      '`slow == fast` on nodes is correct — reference comparison is the question.',
      'Constraints pick the shape: n ≤ 10⁵ rules out O(n²).',
    ],
    practice: {
      prompt: 'Implement each of the six shapes once, on small hand-made inputs, without looking at the code here. They are the vocabulary of the next 90 days — the goal is that reading a problem statement brings one of these to mind before you start typing.',
      leetcode: { title: 'Maximum Subarray', slug: 'maximum-subarray' },
    },
  },
];
