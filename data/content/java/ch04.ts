import type { Lesson } from '../types';

/**
 * Java Chapter 4 — Functions and Methods.
 * Java's pass-by-value semantics are the centrepiece here: the rule is simple
 * but its consequences surprise almost everyone.
 */
export const ch04: Lesson[] = [
  // -------------------------------------------------------------------------
  {
    topicId: 'java-4.1',
    language: 'java',
    summary: 'Declare and call methods, and know why order never matters in Java.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A method is a named block of code you can run on demand. Breaking a solution into methods is not decoration — it is how you keep a hard problem in your head, because each piece can be understood and tested on its own. Java is friendlier than C++ here: a class sees all of its own methods, so you can call one that is defined further down the file.',
      },
      {
        kind: 'code',
        caption: 'The anatomy',
        code: `public int add(int a, int b) {
    return a + b;
}
// ^access ^return ^name ^parameters

int result = add(3, 5);        // calling it`,
      },
      {
        kind: 'text',
        body: 'A method is always a member of a class — Java has no free functions. Every method needs a return type (`void` if it returns nothing) and lives inside a class body.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Declaration order does not matter in Java',
        body: 'Unlike C++, you can call a method defined further down the file. The compiler reads the entire class before compiling any method body, so forward declarations do not exist and are not needed. Put your public entry point first and helpers below it — which is exactly how LeetCode solutions are usually structured.',
      },
      {
        kind: 'code',
        code: `class Solution {
    public int solve(int[] nums) {
        return helper(nums, 0);        // calling a method defined BELOW — fine
    }

    private int helper(int[] nums, int i) {
        if (i == nums.length) return 0;
        return nums[i] + helper(nums, i + 1);
    }
}`,
      },
      { kind: 'heading', text: 'Access modifiers on methods' },
      {
        kind: 'table',
        headers: ['Modifier', 'Callable from'],
        rows: [
          ['`public`', 'Anywhere — the judge needs this on your solution method'],
          ['`private`', 'Only inside the same class — right for helpers'],
          ['`protected`', 'Same class, subclasses, same package'],
          ['(none)', 'Same package — "package-private"'],
        ],
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Your LeetCode method must stay public',
        body: 'The judge constructs a `Solution` object and calls the given method from outside the class. Changing `public` to `private` produces a compile error against their harness. Helpers you add should be `private` — it signals intent and keeps the public surface to exactly what was asked for.',
      },
      { kind: 'heading', text: 'Static vs instance methods' },
      {
        kind: 'code',
        code: `class Solution {
    public int solve(int[] nums) { ... }     // instance — the judge calls this

    private static int gcd(int a, int b) {   // static — no object state needed
        return b == 0 ? a : gcd(b, a % b);
    }
}

// A static method can be called without an object:
Solution.gcd(12, 18);
// An instance method needs one:
new Solution().solve(nums);`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'A static method cannot call an instance method directly',
        body: 'It has no object to call it on, giving `non-static method cannot be referenced from a static context`. If your helper touches instance fields, it must be an instance method. Keep helpers static only when they are pure functions of their arguments — like `gcd` above.',
      },
      {
        kind: 'text',
        body: 'One naming note: methods are `camelCase` and usually start with a verb — `findMax`, `isValid`, `buildGraph`. In an interview the naming is part of what is being assessed, so it is worth being deliberate.',
      },
    ],
    keyTakeaways: [
      'Methods live inside classes; Java has no free functions.',
      'Declaration order does not matter — you can call a method defined below.',
      'Keep the judge\'s method `public` and your helpers `private`.',
      'A `static` method cannot touch instance state or call instance methods.',
    ],
    practice: {
      prompt: 'Write a `Solution` with a public entry point calling a private helper defined below it — confirming order does not matter. Then make the helper `static` and have it call an instance method, and read the "non-static context" error.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-4.2',
    language: 'java',
    summary: 'Take inputs and return results, including how to return more than one value.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Parameters are what a method needs; the return value is what it gives back. Java allows exactly **one** return value, which sounds limiting the first time you need two — the answer is to return an array or a small object, and this lesson shows the options in the order you should reach for them.',
      },
      {
        kind: 'code',
        code: `public int maxOf(int a, int b) {      // two parameters
    return a > b ? a : b;              // one return value
}

int result = maxOf(3, 7);              // 3 and 7 are the arguments`,
      },
      {
        kind: 'text',
        body: '**Parameters** are the names in the declaration; **arguments** are the values at the call site. The distinction matters when reading compiler errors, which talk about parameters.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Every path must return',
        body: 'Java refuses to compile a non-void method that can reach its end without returning — `missing return statement`. This is stricter than C++, which only warns. It means the "forgot the fallback return" bug simply cannot ship, which is a genuine advantage.',
      },
      {
        kind: 'code',
        code: `public int find(int[] nums, int target) {
    for (int i = 0; i < nums.length; i++)
        if (nums[i] == target) return i;
    // ERROR: missing return statement
}

public int find(int[] nums, int target) {
    for (int i = 0; i < nums.length; i++)
        if (nums[i] == target) return i;
    return -1;                              // the fallback
}`,
      },
      { kind: 'heading', text: 'Returning multiple values' },
      {
        kind: 'code',
        caption: '1. An array — what LeetCode usually expects',
        code: `public int[] twoSum(int[] nums, int target) {
    // ...
    return new int[]{i, j};        // array literal syntax
}`,
      },
      {
        kind: 'code',
        caption: '2. A List — for variable-length results',
        code: `public List<Integer> collect(TreeNode root) {
    List<Integer> result = new ArrayList<>();
    dfs(root, result);
    return result;
}

public List<List<Integer>> levelOrder(TreeNode root) { ... }   // nested`,
      },
      {
        kind: 'code',
        caption: '3. int[] as a lightweight pair',
        code: `// Java has no built-in Pair in java.util, so int[] is the common workaround
public int[] minMax(int[] nums) {
    int lo = Integer.MAX_VALUE, hi = Integer.MIN_VALUE;
    for (int x : nums) { lo = Math.min(lo, x); hi = Math.max(hi, x); }
    return new int[]{lo, hi};
}

int[] r = minMax(nums);
int lo = r[0], hi = r[1];`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Java has no standard Pair class',
        body: 'C++ has `std::pair` and Python has tuples; `java.util` has nothing equivalent. The usual substitutes are `int[]{a, b}` for two ints, `Map.Entry` via `Map.entry(a, b)`, or a small private class. `int[]` is the most common in LeetCode solutions because it needs no import and works as a return type.',
      },
      {
        kind: 'code',
        caption: '4. A small class — when the values deserve names',
        code: `private static class Result {
    int index;
    boolean found;
    Result(int index, boolean found) { this.index = index; this.found = found; }
}

private Result search(int[] nums, int target) {
    for (int i = 0; i < nums.length; i++)
        if (nums[i] == target) return new Result(i, true);
    return new Result(-1, false);
}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'A record is shorter, if you want one',
        body: '`private record Result(int index, boolean found) {}` (Java 16+) generates the constructor, accessors, `equals` and `toString` automatically. LeetCode supports it. For a throwaway two-field holder inside one solution, `int[]` is usually still simpler.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Output parameters do not work the way C++ programmers expect',
        body: 'You cannot pass an `int` and have the method change the caller\'s variable — Java is pass-by-value with no references. Passing a one-element array (`int[] count = {0}`) is the standard workaround, and it appears constantly in recursive helpers that need to accumulate a value.',
      },
    ],
    keyTakeaways: [
      'Java enforces "every path returns" at compile time, unlike C++.',
      'Return several values with an array, a `List`, or a small class/record.',
      'There is no standard `Pair` — `int[]{a, b}` is the common substitute.',
      'To let a method update a caller\'s number, pass a one-element array.',
    ],
    practice: {
      prompt: 'Write `minMax` returning an `int[]`, then rewrite it with a private record. Then write a method that omits the fallback `return` and confirm Java refuses to compile it — that strictness catches a real C++ bug class for you.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-4.3',
    language: 'java',
    summary: 'Give one name to several methods that differ by parameters.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'Overloading lets several methods share one name as long as their **parameter lists differ**. You have already used it without noticing: `System.out.println` accepts an `int`, a `String` or an object because there is a separate overload for each. In DSA it is most useful for giving a recursive helper a friendly public wrapper.',
      },
      {
        kind: 'code',
        code: `int maxOf(int a, int b)          { return a > b ? a : b; }
double maxOf(double a, double b) { return a > b ? a : b; }
int maxOf(int a, int b, int c)   { return maxOf(maxOf(a, b), c); }

maxOf(3, 7);        // the int version
maxOf(3.5, 7.1);    // the double version
maxOf(1, 2, 3);     // the three-argument version`,
      },
      {
        kind: 'text',
        body: 'Overloads must differ in the **number or types** of parameters. Differing only in return type is a compile error, because the compiler chooses from the arguments alone and would have no way to decide.',
      },
      {
        kind: 'code',
        code: `int process(int x);
void process(int x);        // ERROR — same parameters, only return type differs`,
      },
      { kind: 'heading', text: 'Where you meet it in the standard library' },
      {
        kind: 'code',
        code: `System.out.println(42);        // int overload
System.out.println("text");    // String overload
System.out.println(3.14);      // double overload

Arrays.sort(arr);                          // whole array
Arrays.sort(arr, 1, 5);                    // a range
Arrays.sort(objArr, comparator);           // with a comparator

Math.max(int, int);  Math.max(long, long);  Math.max(double, double);`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'The List.remove ambiguity',
        body: '`List<Integer>` has both `remove(int index)` and `remove(Object o)`. So `list.remove(2)` removes the element at **index 2**, not the value 2. To remove by value you must write `list.remove(Integer.valueOf(2))`. This is a genuinely confusing overload in the standard library and catches people regularly.',
      },
      {
        kind: 'code',
        code: `List<Integer> list = new ArrayList<>(List.of(10, 20, 30));

list.remove(1);                       // removes index 1 → [10, 30]
list.remove(Integer.valueOf(10));     // removes the VALUE 10 → [30]`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Autoboxing makes overload resolution subtle',
        body: 'Java prefers an exact match, then widening, then boxing, then varargs. So `f(int)` beats `f(Integer)` for an `int` argument, and `f(long)` beats `f(Integer)` because widening outranks boxing. You rarely need to reason about this, but it explains otherwise baffling "which overload got called" surprises.',
      },
      { kind: 'heading', text: 'Overloading vs overriding' },
      {
        kind: 'table',
        headers: ['', 'Overloading', 'Overriding'],
        rows: [
          ['Same name, different…', 'Parameters', 'Nothing — identical signature'],
          ['Resolved', 'At compile time', 'At run time'],
          ['Chosen by', 'Argument types', 'The actual object type'],
          ['Requires inheritance', 'No', '**Yes**'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'This is a standard interview question',
        body: '"Overloading is compile-time: same name, different parameters, chosen from argument types. Overriding is run-time: a subclass replaces a superclass method with an identical signature, chosen from the actual object type." Being able to state both cleanly is worth the thirty seconds it takes to memorise.',
      },
      {
        kind: 'text',
        body: 'In DSA you will overload rarely — a differently-named helper is usually clearer. The reason to understand it is reading the standard library and answering that interview question.',
      },
    ],
    keyTakeaways: [
      'Overloads must differ in parameter count or types, not return type.',
      '`list.remove(2)` removes index 2; use `Integer.valueOf(2)` for the value.',
      'Resolution prefers exact match, then widening, then boxing.',
      'Overloading is compile-time by parameters; overriding is run-time by inheritance.',
    ],
    practice: {
      prompt: 'Write three `maxOf` overloads and call each. Then build a `List<Integer>` and call `remove(1)` versus `remove(Integer.valueOf(1))` — the difference is genuinely surprising and worth seeing once.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-4.4',
    language: 'java',
    summary: 'Understand the one rule that explains every Java parameter surprise.',
    readMinutes: 6,
    blocks: [
      {
        kind: 'text',
        body: 'This is the topic that confuses more Java learners than any other, and it has exactly one rule: **Java always passes a copy**. That is it. Everything that looks like an exception — "but my array changed!" — follows from the rule once you are precise about *what* is being copied. Read this lesson slowly; it pays for itself many times over.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Java is always pass-by-value. Always.',
        body: 'There are no references, no pointers, no `&` parameters. The method always receives a **copy** of the argument. The subtlety is that for objects, the thing being copied is the *reference* — so the copy points at the same object.',
      },
      { kind: 'heading', text: 'Primitives — the simple case' },
      {
        kind: 'code',
        code: `void increment(int x) {
    x++;                    // modifies the local copy only
}

int n = 5;
increment(n);
System.out.println(n);      // still 5`,
      },
      { kind: 'heading', text: 'Objects — the case that confuses everyone' },
      {
        kind: 'code',
        code: `void modify(int[] arr) {
    arr[0] = 99;            // MUTATES the object both references point at
}

void reassign(int[] arr) {
    arr = new int[]{7, 8};  // rebinds the LOCAL copy of the reference
}

int[] a = {1, 2, 3};
modify(a);
System.out.println(a[0]);   // 99 — the object changed

reassign(a);
System.out.println(a[0]);   // 99 — unchanged; the caller still sees the old array`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'You can mutate the object, but never rebind the caller\'s variable',
        body: 'This is the entire rule. `arr[0] = 99` reaches through the reference and changes the shared object. `arr = new int[]{...}` only changes which object *this method\'s copy* of the reference points at — the caller\'s variable is untouched. People describe Java as "pass-by-reference for objects", which is wrong and leads directly to this confusion.',
      },
      {
        kind: 'code',
        caption: 'The same thing with a List',
        code: `void addItem(List<Integer> list) {
    list.add(4);                       // caller sees this
}

void replaceList(List<Integer> list) {
    list = new ArrayList<>();          // caller does NOT see this
    list.add(99);
}`,
      },
      { kind: 'heading', text: 'The consequences in DSA' },
      {
        kind: 'code',
        caption: '1. Arrays passed to methods ARE modifiable',
        code: `public int[] twoSum(int[] nums, int target) {
    Arrays.sort(nums);        // this sorts the JUDGE'S array
    ...
}`,
      },
      {
        kind: 'text',
        body: 'That is usually fine and often desirable — no copying cost. But if the problem later needs the original order, you must copy first: `int[] copy = nums.clone();` or `Arrays.copyOf(nums, nums.length)`.',
      },
      {
        kind: 'code',
        caption: '2. Accumulating a value needs a workaround',
        code: `// Does NOT work — count is a copy
void countNodes(TreeNode node, int count) {
    if (node == null) return;
    count++;                              // lost when the method returns
    countNodes(node.left, count);
}

// Workaround 1 — a one-element array
void countNodes(TreeNode node, int[] count) {
    if (node == null) return;
    count[0]++;                           // mutating the shared array works
    countNodes(node.left, count);
}

// Workaround 2 — an instance field (usually cleaner)
private int count;
void countNodes(TreeNode node) {
    if (node == null) return;
    count++;
    countNodes(node.left);
}

// Workaround 3 — return the value instead (cleanest of all)
int countNodes(TreeNode node) {
    if (node == null) return 0;
    return 1 + countNodes(node.left) + countNodes(node.right);
}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Prefer returning over accumulating',
        body: 'The third form has no shared state, needs no reset between test cases, and reads better. Use a field or an `int[]` only when the value genuinely cannot be expressed as a return — as in Diameter of Binary Tree, where the method returns depth while a field records the answer.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Strings are immutable, so they always behave like primitives',
        body: '`void f(String s) { s = "changed"; }` never affects the caller — and neither does anything else, because `String` has no mutating methods at all. `s.toUpperCase()` returns a *new* string; it does not modify `s`. Forgetting to assign the result is a very common bug.',
      },
      {
        kind: 'code',
        code: `String s = "hello";
s.toUpperCase();              // result discarded — s is still "hello"
s = s.toUpperCase();          // correct`,
      },
    ],
    keyTakeaways: [
      'Java is always pass-by-value; for objects, the *reference* is copied.',
      'You can mutate the shared object, but never rebind the caller\'s variable.',
      'Arrays passed to a method really are modifiable — `Arrays.sort(nums)` affects the caller.',
      'To accumulate, return the value, or use a field or a one-element array.',
    ],
    practice: {
      prompt: 'Write `modify` and `reassign` on the same array and confirm only the first is visible to the caller. Then write a recursive counter three ways — `int` parameter, `int[]` parameter, and return value — and see which actually works.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-4.5',
    language: 'java',
    summary: 'Know exactly where each variable is visible and when it disappears.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A variable\'s **scope** is the region where its name is visible. In Java scope is defined by braces: a variable exists from its declaration to the closing `}` of its enclosing block.',
      },
      {
        kind: 'code',
        code: `void method() {
    int a = 1;                  // visible for the rest of the method

    if (true) {
        int b = 2;              // visible only inside this block
        System.out.println(a);  // outer variables are visible
    }

    System.out.println(b);      // ERROR — cannot find symbol
}`,
      },
      {
        kind: 'code',
        caption: 'Loop variables die with the loop',
        code: `for (int i = 0; i < n; i++) { ... }
System.out.println(i);          // ERROR — i no longer exists

int i = 0;                      // declare outside if you need the final value
for (; i < n; i++) { ... }
System.out.println(i);          // fine`,
      },
      { kind: 'heading', text: 'The four scope levels' },
      {
        kind: 'table',
        headers: ['Level', 'Lives', 'Declared'],
        rows: [
          ['Local', 'Its enclosing block', 'Inside a method or block'],
          ['Parameter', 'The whole method', 'In the method signature'],
          ['Instance field', 'As long as the object', 'In the class, no `static`'],
          ['Static field', 'The whole program', 'In the class, with `static`'],
        ],
      },
      {
        kind: 'code',
        code: `class Solution {
    static int callCount;         // one copy shared by all objects
    private int result;           // one copy per object

    public int solve(int[] nums) {     // nums is a parameter
        int local = 0;                 // local to this method
        for (int i = 0; i < nums.length; i++) {
            int temp = nums[i];        // local to the loop body
        }
        return local;
    }
}`,
      },
      { kind: 'heading', text: 'Shadowing' },
      {
        kind: 'code',
        code: `class Point {
    int x;

    Point(int x) {
        x = x;                  // BUG — assigns the parameter to itself!
                                // the field is never set
    }

    Point(int x) {
        this.x = x;             // correct — this.x is the field
    }
}`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Java forbids shadowing a local with a local, but allows shadowing a field',
        body: 'You cannot declare `int a` twice in nested blocks — that is a compile error, unlike C++. But a parameter *may* shadow a field, which produces the silent `x = x` bug above. Use `this.x = x` in constructors, and the problem disappears.',
      },
      {
        kind: 'code',
        caption: 'The accumulator bug Java prevents',
        code: `// In C++ this compiles and silently resets sum every iteration.
// In Java it is a compile error if sum already exists outside — and if it
// does not, the "variable might not have been initialized" check catches
// the usual follow-on mistake.

int sum = 0;
for (int x : nums) {
    int sum = 0;                // ERROR: variable sum is already defined
    sum += x;
}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Declare variables in the smallest scope that works',
        body: 'Narrow scope means fewer names in flight, no accidental reuse, and the compiler catching mistakes. Declare loop counters inside the `for`, temporaries inside the block that uses them, and widen only when you genuinely need the value afterwards.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Definite assignment is enforced',
        body: 'Java refuses to compile a read of a local that might not have been assigned — `variable x might not have been initialized`. Fields get defaults (0, null, false); locals do not. This catches a whole class of C++ bugs at compile time.',
      },
    ],
    keyTakeaways: [
      'Scope is bounded by braces; a `for` counter does not exist after the loop.',
      'Java forbids shadowing a local with a local, but a parameter may shadow a field.',
      'Use `this.x = x` in constructors to avoid the silent self-assignment bug.',
      'Locals must be definitely assigned before use — the compiler enforces it.',
    ],
    practice: {
      prompt: 'Write a constructor with `x = x` and confirm the field stays 0, then fix it with `this.x`. Then try redeclaring a variable inside a loop and read the "already defined" error — that is a C++ bug Java simply will not let you write.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-4.6',
    language: 'java',
    summary: 'Use static methods for pure helpers, and know the LeetCode pitfall.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A `static` method belongs to the class rather than to any object. It has no `this`, cannot touch instance fields, and can be called without creating an object.',
      },
      {
        kind: 'code',
        code: `class MathUtils {
    static int gcd(int a, int b) {
        return b == 0 ? a : gcd(b, a % b);
    }
}

MathUtils.gcd(12, 18);          // no object needed

// The standard library is full of them:
Math.max(a, b);
Arrays.sort(arr);
Integer.parseInt("42");
Collections.reverse(list);`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Static is right for pure functions',
        body: 'If a helper depends only on its arguments and touches no instance state, `static` documents that fact and lets the compiler verify it. `gcd`, `isPrime`, a comparator helper — all naturally static. It also makes them callable from `main` for local testing without constructing an object.',
      },
      {
        kind: 'code',
        code: `class Solution {
    // Pure — depends only on arguments
    private static boolean isPalindrome(String s, int l, int r) {
        while (l < r) {
            if (s.charAt(l++) != s.charAt(r--)) return false;
        }
        return true;
    }

    public String longestPalindrome(String s) {
        // ...uses isPalindrome
    }
}`,
      },
      { kind: 'heading', text: 'What static cannot do' },
      {
        kind: 'code',
        code: `class Solution {
    private int count;                   // instance field

    private static void bump() {
        count++;                         // ERROR — non-static variable
                                         // cannot be referenced from a static context
    }
}`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Static state survives across LeetCode test cases',
        body: 'A `static` field belongs to the class, so it is **not** reset even when the judge constructs a fresh `Solution` object. Your solution passes the first test and fails every one after. This is worse than the instance-field version of the same trap, because a new object does not help. Avoid static mutable state entirely, or clear it at the start of your public method.',
      },
      {
        kind: 'code',
        caption: 'The bug, and the fix',
        code: `class Solution {
    private static Map<Integer, Integer> memo = new HashMap<>();   // DANGER

    public int fib(int n) {
        // memo still holds the previous test case's entries!
        return helper(n);
    }
}

class Solution {
    private Map<Integer, Integer> memo = new HashMap<>();          // instance

    public int fib(int n) {
        memo.clear();                    // reset — safe against object reuse
        return helper(n);
    }
}`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'static final constants are perfectly safe',
        body: 'The problem is only mutable static state. `private static final int MOD = 1_000_000_007;` and `private static final int[] DR = {-1,1,0,0};` are immutable, shared correctly, and avoid reallocating on every call. Use them freely.',
      },
      {
        kind: 'text',
        body: 'One practical note: a `static` helper cannot be recursive *through* instance state, so a DFS that accumulates into a field must be an instance method. If you find yourself passing everything as parameters just to keep a helper static, an instance method is probably the better design.',
      },
    ],
    keyTakeaways: [
      '`static` methods belong to the class, have no `this`, and cannot touch instance fields.',
      'Use it for pure helpers that depend only on their arguments.',
      'Mutable `static` state persists across LeetCode test cases — avoid or clear it.',
      '`static final` constants are safe and worth using for `MOD` and direction arrays.',
    ],
    practice: {
      prompt: 'Write a static `gcd` and call it without an object. Then add a static counter, call your solution method twice, and watch the count carry over — that is exactly the bug that makes a solution pass test 1 and fail the rest.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-4.7',
    language: 'java',
    summary: 'Structure a LeetCode solution with helpers so the recursion stays readable.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'LeetCode gives you one method with a fixed signature. Almost every non-trivial solution needs a second method alongside it, because recursion needs parameters the given signature does not have.',
      },
      {
        kind: 'code',
        caption: 'The standard shape',
        code: `class Solution {
    // Public — the judge calls this. Sets up state and delegates.
    public List<Integer> rightSideView(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        dfs(root, 0, result);
        return result;
    }

    // Private — carries the extra parameters recursion needs.
    private void dfs(TreeNode node, int depth, List<Integer> result) {
        if (node == null) return;
        if (depth == result.size()) result.add(node.val);
        dfs(node.right, depth + 1, result);
        dfs(node.left, depth + 1, result);
    }
}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The accumulator can be a parameter — no copying cost',
        body: 'Because Java passes the *reference* by value, `List<Integer> result` in the helper points at the caller\'s list. Every level shares one list, so there is no per-level copy and no need for a field. This is where Java is simpler than C++, where you must remember the `&`.',
      },
      { kind: 'heading', text: 'The alternative: instance fields' },
      {
        kind: 'code',
        code: `class Solution {
    private List<Integer> result;

    public List<Integer> preorder(TreeNode root) {
        result = new ArrayList<>();       // fresh each call — safe against reuse
        dfs(root);
        return result;
    }

    private void dfs(TreeNode node) {
        if (node == null) return;
        result.add(node.val);
        dfs(node.left);
        dfs(node.right);
    }
}`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Reinitialise fields in the public method',
        body: 'The judge may call your method several times on one object, so a field still holds the previous test case\'s data. Assign a fresh collection (or `clear()` it) at the top of the public method. The symptom of forgetting is distinctive: test 1 passes, everything after fails.',
      },
      { kind: 'heading', text: 'The backtracking shape' },
      {
        kind: 'code',
        code: `class Solution {
    public List<List<Integer>> permute(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        backtrack(nums, new ArrayList<>(), new boolean[nums.length], result);
        return result;
    }

    private void backtrack(int[] nums, List<Integer> current,
                           boolean[] used, List<List<Integer>> result) {
        if (current.size() == nums.length) {
            result.add(new ArrayList<>(current));   // a COPY — current keeps changing
            return;
        }

        for (int i = 0; i < nums.length; i++) {
            if (used[i]) continue;

            used[i] = true;                  // choose
            current.add(nums[i]);

            backtrack(nums, current, used, result);

            current.remove(current.size() - 1);   // un-choose — BOTH parts
            used[i] = false;
        }
    }
}`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'new ArrayList<>(current) is essential',
        body: 'Writing `result.add(current)` adds a *reference* to the list that keeps mutating — so every saved result ends up identical and empty. You must copy. This is the direct consequence of reference semantics, and it is the most common backtracking bug in Java specifically.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'And undo every part of the choice',
        body: 'Here "choose" touched `used[i]` and `current`, so "un-choose" must restore both. Forgetting `used[i] = false` makes that element permanently unavailable to sibling branches and you silently get too few results. Write the undo immediately after writing the choose.',
      },
      {
        kind: 'code',
        caption: 'Naming and documenting the helper',
        code: `// Returns the depth of this subtree; records the best diameter in a field.
private int depth(TreeNode node) { ... }`,
      },
      {
        kind: 'text',
        body: '`dfs`, `backtrack` and `helper` are conventional and fine, but a one-line comment saying what the helper *returns* is genuinely useful — especially when the return value differs from the answer, as in Diameter of Binary Tree.',
      },
    ],
    keyTakeaways: [
      'Public method sets up state and delegates; a private helper does the recursion.',
      'Passing a `List` accumulator costs nothing — the reference is shared.',
      'Reinitialise fields in the public method; the judge reuses the object.',
      'In backtracking, save `new ArrayList<>(current)` — never `current` itself.',
    ],
    practice: {
      prompt: 'Write `permute` with the backtracking skeleton. Then replace `new ArrayList<>(current)` with `current` and study the output — every result comes out empty, which makes the reference-semantics lesson concrete.',
      leetcode: { title: 'Permutations', slug: 'permutations' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-4.8',
    language: 'java',
    summary: 'Read a method signature precisely, including generics and varargs.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A method\'s **signature** is its name plus its parameter types. The return type is *not* part of it — which is why you cannot overload on return type alone.',
      },
      {
        kind: 'code',
        code: `public static <T> List<T> filter(List<T> items, Predicate<T> test) throws Exception
//     ^access ^static ^generic ^return ^name ^parameters                ^checked exceptions`,
      },
      { kind: 'heading', text: 'Reading LeetCode signatures' },
      {
        kind: 'code',
        code: `public int[] twoSum(int[] nums, int target)
// takes an int array and an int; returns an int array

public List<List<Integer>> levelOrder(TreeNode root)
// takes a tree root; returns a list of lists of Integer

public boolean isValid(String s)
// takes a String; returns true/false

public ListNode reverseList(ListNode head)
// takes a node reference; returns a node reference`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The return type tells you what to build',
        body: '`int[]` means `return new int[]{a, b};`. `List<Integer>` means `new ArrayList<>()`. `List<List<Integer>>` means a list you add whole lists to. Reading the return type first tells you which container to create before you have thought about the algorithm.',
      },
      { kind: 'heading', text: 'The int[] and List<Integer> conversion' },
      {
        kind: 'code',
        code: `// int[] → List<Integer>
List<Integer> list = Arrays.stream(arr).boxed().collect(Collectors.toList());
// or, verbosely:
List<Integer> list = new ArrayList<>();
for (int x : arr) list.add(x);

// List<Integer> → int[]
int[] arr = list.stream().mapToInt(Integer::intValue).toArray();
// or:
int[] arr = new int[list.size()];
for (int i = 0; i < list.size(); i++) arr[i] = list.get(i);`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Arrays.asList does not work on int[]',
        body: '`Arrays.asList(intArray)` gives a single-element `List<int[]>`, not a `List<Integer>` — because generics cannot hold primitives, so the whole array becomes one element. It compiles and then behaves nothing like you expect. Use the stream form, or a loop.',
      },
      { kind: 'heading', text: 'Varargs' },
      {
        kind: 'code',
        code: `int sum(int... nums) {          // zero or more ints
    int total = 0;
    for (int x : nums) total += x;      // nums is an int[] inside
    return total;
}

sum();              // 0
sum(1, 2, 3);       // 6
sum(new int[]{1,2}); // also legal — an array can be passed directly

// You have used this already:
List<Integer> list = List.of(1, 2, 3);
Math.max(a, b);     // not varargs, but List.of and String.format are`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Varargs must be the last parameter',
        body: '`void f(int... nums, String s)` is a compile error — there would be no way to tell where the varargs end. Only one varargs parameter is allowed, and it must come last.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Generics in your own helpers',
        body: 'You will rarely need `<T>` in DSA, but recognising it matters for reading library signatures. `Collections.sort(List<T> list, Comparator<? super T> c)` looks intimidating; it just means "a list of anything, plus a comparator that can compare that type". The `? super T` wildcard is why a `Comparator<Object>` can sort a `List<String>`.',
      },
      {
        kind: 'text',
        body: 'One thing you can ignore for DSA: checked exceptions. `throws IOException` appears on I/O methods, but LeetCode solutions never need to declare one — no method you write will throw a checked exception.',
      },
    ],
    keyTakeaways: [
      'The signature is name plus parameter types; the return type is excluded.',
      'Read the return type first — it tells you which container to build.',
      '`Arrays.asList(intArray)` gives `List<int[]>`, not `List<Integer>`.',
      'Varargs (`int... nums`) is an array inside and must be the last parameter.',
    ],
    practice: {
      prompt: 'Convert an `int[]` to a `List<Integer>` and back, both with streams and with loops. Then try `Arrays.asList(intArray)` and print its size — the answer of 1 is genuinely surprising and explains a confusing class of bug.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-4.9',
    language: 'java',
    summary: 'Write recursive helpers that are correct, fast, and easy to read.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Recursive helpers follow a small number of shapes. Getting the parameter design right up front is what keeps them fast and readable.',
      },
      { kind: 'heading', text: 'Shape 1 — return the answer up' },
      {
        kind: 'code',
        code: `public int maxDepth(TreeNode root) {
    if (root == null) return 0;
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
      },
      {
        kind: 'text',
        body: 'No helper needed at all — the given signature already has everything. Prefer this whenever it works: no shared state, no reset, nothing to get wrong.',
      },
      { kind: 'heading', text: 'Shape 2 — pass context down' },
      {
        kind: 'code',
        code: `public boolean isValidBST(TreeNode root) {
    return validate(root, Long.MIN_VALUE, Long.MAX_VALUE);
}

private boolean validate(TreeNode node, long lo, long hi) {
    if (node == null) return true;
    if (node.val <= lo || node.val >= hi) return false;
    return validate(node.left, lo, node.val)
        && validate(node.right, node.val, hi);
}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Use long for the bounds',
        body: 'With `int` bounds, a node holding `Integer.MIN_VALUE` fails incorrectly because it equals the initial lower bound. `long` sidesteps it entirely. This is a specific hidden test case on Validate BST and worth knowing before you meet it.',
      },
      { kind: 'heading', text: 'Shape 3 — accumulate into a shared collection' },
      {
        kind: 'code',
        code: `public List<Integer> inorder(TreeNode root) {
    List<Integer> result = new ArrayList<>();
    dfs(root, result);
    return result;
}

private void dfs(TreeNode node, List<Integer> result) {
    if (node == null) return;
    dfs(node.left, result);
    result.add(node.val);          // one shared list — no copying
    dfs(node.right, result);
}`,
      },
      { kind: 'heading', text: 'Shape 4 — return one thing, record another' },
      {
        kind: 'code',
        code: `class Solution {
    private int best;

    public int diameterOfBinaryTree(TreeNode root) {
        best = 0;                       // reset — the judge reuses the object
        depth(root);
        return best;
    }

    // Returns the DEPTH of this subtree; records the DIAMETER in 'best'.
    private int depth(TreeNode node) {
        if (node == null) return 0;
        int l = depth(node.left);
        int r = depth(node.right);
        best = Math.max(best, l + r);   // the answer accumulates here
        return 1 + Math.max(l, r);      // but this is what we return
    }
}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'This shape is the one people find hardest',
        body: 'The return value and the answer are different things. Recognising that unlocks Diameter, Maximum Path Sum and Longest Univalue Path. Always write a comment stating what the helper returns — it is not obvious from the name, and future-you will need it.',
      },
      { kind: 'heading', text: 'Memoisation' },
      {
        kind: 'code',
        code: `class Solution {
    private Map<Integer, Long> memo;

    public long fib(int n) {
        memo = new HashMap<>();          // fresh per call
        return helper(n);
    }

    private long helper(int n) {
        if (n <= 1) return n;
        if (memo.containsKey(n)) return memo.get(n);
        long result = helper(n - 1) + helper(n - 2);
        memo.put(n, result);
        return result;
    }
}`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Prefer an int[] memo when the state is a bounded index',
        body: '`int[] memo = new int[n + 1]; Arrays.fill(memo, -1);` avoids boxing entirely and is noticeably faster than a `HashMap<Integer, Integer>`. Use the map only when the key space is sparse or not a simple integer range.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Watch the recursion depth',
        body: 'Java\'s default stack allows roughly 10,000–20,000 frames. A "tree" that is really a straight line of 10⁵ nodes, or a recursive linked-list traversal on a long list, throws `StackOverflowError` — which LeetCode reports as a bare Runtime Error. When the constraints allow that many nodes, use an explicit `Deque` as a stack instead.',
      },
      {
        kind: 'code',
        caption: 'The iterative rescue',
        code: `// Recursive in-order — O(h) stack frames
private void inorder(TreeNode node, List<Integer> out) { ... }

// Iterative — heap-allocated stack, no depth limit
public List<Integer> inorder(TreeNode root) {
    List<Integer> out = new ArrayList<>();
    Deque<TreeNode> stack = new ArrayDeque<>();
    TreeNode curr = root;
    while (curr != null || !stack.isEmpty()) {
        while (curr != null) { stack.push(curr); curr = curr.left; }
        curr = stack.pop();
        out.add(curr.val);
        curr = curr.right;
    }
    return out;
}`,
      },
    ],
    keyTakeaways: [
      'Prefer returning the answer up — no shared state to reset or corrupt.',
      'A shared `List` parameter costs nothing; the reference is passed by value.',
      'When the helper returns one thing and records another, comment which is which.',
      'Java\'s stack allows ~10⁴ frames — use an explicit `Deque` when depth may exceed it.',
    ],
    practice: {
      prompt: 'Write maxDepth (return up), isValidBST (pass down), inorder (shared list) and Diameter (both). For Diameter, state in one sentence what `depth` returns versus what `best` records — if you cannot, you have not understood it yet.',
      leetcode: { title: 'Diameter of Binary Tree', slug: 'diameter-of-binary-tree' },
    },
  },
];
