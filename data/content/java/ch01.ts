import type { Lesson } from '../types';

/**
 * Java Chapter 1 — Java Setup and Core Syntax.
 * Aimed at getting a first LeetCode submission to compile.
 */
export const ch01: Lesson[] = [
  // -------------------------------------------------------------------------
  {
    topicId: 'java-1.1',
    language: 'java',
    summary: 'Read a Java file top to bottom and know what every line is doing.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Every Java program lives inside a **class**. There are no free-floating functions — even `main` must be a method of some class. That single rule shapes everything else about the language\'s structure.',
      },
      {
        kind: 'code',
        caption: 'Hello.java — the anatomy of a Java file',
        code: `public class Hello {
    public static void main(String[] args) {
        System.out.println("Ready for DSA");
    }
}`,
        output: 'Ready for DSA',
      },
      { kind: 'heading', text: 'Line by line' },
      {
        kind: 'table',
        headers: ['Part', 'What it does'],
        rows: [
          ['`public class Hello`', 'Declares a class. Everything lives inside it'],
          ['`public`', 'Visible from anywhere — the JVM needs this to call `main`'],
          ['`static`', 'Belongs to the class, so it runs without creating an object'],
          ['`void`', 'Returns nothing'],
          ['`main(String[] args)`', 'The entry point. `args` holds command-line arguments'],
          ['`System.out.println(...)`', 'Prints, then a newline'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'The file name must match the public class name',
        body: 'A `public class Hello` must live in a file called `Hello.java` — exactly, including capitalisation. Get it wrong and the compiler says `class Hello is public, should be declared in a file named Hello.java`. This is the first error almost everyone hits, and it does not exist in C++ or Python.',
      },
      { kind: 'heading', text: 'The three rules that trip people up' },
      {
        kind: 'text',
        body: '**1. Statements end in a semicolon.** A newline means nothing to the compiler.',
      },
      {
        kind: 'text',
        body: '**2. Blocks are braces, not indentation.** Indent for readability, but `{` and `}` are what actually group code. Python habits mislead here.',
      },
      {
        kind: 'text',
        body: '**3. Java is case-sensitive and strict about naming.** `String` is a class, `string` does not exist. `System` is capitalised; `println` is not.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'On LeetCode you do not write main()',
        body: 'LeetCode gives you `class Solution` with one method to fill in, and runs its own hidden `main` behind the scenes. Practise with `main` locally; on the judge, write only inside the method they give you. The logic is identical — only the wrapper changes.',
      },
      {
        kind: 'code',
        caption: 'The same method, as LeetCode presents it',
        code: `class Solution {
    public int addOne(int x) {
        return x + 1;
    }
}`,
      },
      {
        kind: 'text',
        body: 'Note there is no `static` on the LeetCode method: the judge creates a `Solution` object and calls the method on it. Adding `static` yourself will not compile against their harness.',
      },
    ],
    keyTakeaways: [
      'Everything lives inside a class — Java has no free functions.',
      'The file name must exactly match the public class name.',
      '`public static void main(String[] args)` is the entry point.',
      'On LeetCode you fill in a non-static method inside `class Solution`.',
    ],
    practice: {
      prompt: 'Type the Hello program by hand and run it. Then break it three ways: rename the file, delete a semicolon, and lowercase `String`. Read each error carefully — the file-name one in particular is unique to Java and worth recognising instantly.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-1.2',
    language: 'java',
    summary: 'Understand what class and main() actually mean, and why main is static.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A class is a blueprint that bundles data and the methods acting on it. In Java it is also the *only* place code can live — which is why even a one-line program needs one.',
      },
      {
        kind: 'code',
        code: `public class Calculator {
    // fields (data)
    private int result;

    // methods (behaviour)
    public void add(int x) { result += x; }
    public int getResult() { return result; }

    // entry point
    public static void main(String[] args) {
        Calculator c = new Calculator();
        c.add(5);
        System.out.println(c.getResult());     // 5
    }
}`,
      },
      { kind: 'heading', text: 'Why main must be static' },
      {
        kind: 'text',
        body: 'When you run a program, the JVM has to call `main` **before any object exists** — there is nothing to create an object from yet. A `static` method belongs to the class rather than to an instance, so it can be called without one. That is the whole reason for the keyword.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'A static method cannot use instance fields',
        body: '`main` is static, so it cannot touch non-static fields or call non-static methods directly — there is no object for them to belong to. The error is `non-static variable cannot be referenced from a static context`. The fix is to create an object first, as the example above does with `new Calculator()`.',
      },
      {
        kind: 'code',
        caption: 'The error, and the two fixes',
        code: `public class Demo {
    int count = 0;                     // instance field

    public static void main(String[] args) {
        count++;                       // ERROR — no object exists

        Demo d = new Demo();           // FIX 1 — make one
        d.count++;
    }
}

public class Demo {
    static int count = 0;              // FIX 2 — make the field static too
    public static void main(String[] args) {
        count++;                       // fine
    }
}`,
      },
      { kind: 'heading', text: 'One class per file, mostly' },
      {
        kind: 'code',
        code: `// Solution.java
public class Solution { ... }          // only ONE public class per file

class Helper { ... }                   // non-public classes may share the file

class ListNode { ... }                 // which is how LeetCode gives you node types`,
      },
      {
        kind: 'text',
        body: 'A file may contain several classes but only one `public` one, whose name must match the file. LeetCode relies on this: `ListNode` and `TreeNode` are declared as non-public classes alongside your `public class Solution`.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Naming conventions are enforced by convention, not the compiler',
        body: 'Classes are `PascalCase`, methods and variables are `camelCase`, constants are `UPPER_SNAKE_CASE`. The compiler does not care, but every Java codebase and every interviewer does. Writing `class solution` or `int MyCount` reads as unfamiliarity with the language.',
      },
    ],
    keyTakeaways: [
      'A class bundles fields and methods; all Java code lives inside one.',
      '`main` is static because the JVM calls it before any object exists.',
      'A static method cannot reference instance fields directly.',
      'One public class per file, matching the file name; others may share it.',
    ],
    practice: {
      prompt: 'Write a `Counter` class with an instance field and a `main` that tries to increment it directly — read the "non-static context" error, then fix it both ways. That error accounts for a large share of first-week Java confusion.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-1.3',
    language: 'java',
    summary: 'Decode every word in the main signature, and know which parts are negotiable.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: '`public static void main(String[] args)` is the longest line a beginner has to type before anything happens, and most people copy it for months without knowing what it says. It is not one magic phrase — it is **four independent words**, each answering a different question, and you can understand them one at a time.',
      },
      {
        kind: 'code',
        code: `public static void main(String[] args)`,
      },
      {
        kind: 'table',
        headers: ['Word', 'Meaning', 'Can it change?'],
        rows: [
          ['`public`', 'Callable from outside the class', 'No — the JVM must reach it'],
          ['`static`', 'Belongs to the class, not an object', 'No — no object exists yet'],
          ['`void`', 'Returns nothing', 'No'],
          ['`main`', 'The name the JVM looks for', 'No — exact spelling'],
          ['`String[] args`', 'Command-line arguments', 'The *name* can change'],
        ],
      },
      {
        kind: 'code',
        caption: 'The legal variations',
        code: `public static void main(String[] args)      // conventional
public static void main(String args[])      // C-style brackets — legal
public static void main(String... args)     // varargs — also legal
static public void main(String[] args)      // modifier order can swap`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Get it wrong and you get a runtime error, not a compile error',
        body: 'Misspelling `main`, or writing `String args` instead of `String[] args`, compiles perfectly — it is just a normal method the JVM never calls. You get `Error: Main method not found in class X`. Because it compiles, people look for a logic bug rather than a signature typo.',
      },
      { kind: 'heading', text: 'Using args' },
      {
        kind: 'code',
        code: `public static void main(String[] args) {
    if (args.length > 0) {
        System.out.println("First argument: " + args[0]);
        int n = Integer.parseInt(args[0]);      // arguments are always Strings
    }
}
// java Demo 42   →   First argument: 42`,
      },
      {
        kind: 'text',
        body: 'Arguments arrive as `String`s, so numbers need parsing. Unlike C, `args[0]` is the first *argument*, not the program name — and `args.length` is 0 when none are supplied, never null.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'None of this matters on LeetCode',
        body: 'The judge calls your method directly with real arguments, so there is no `main` and nothing to parse. Understand the signature so you can write local test harnesses and answer the interview question about why `main` is static — then forget it while solving.',
      },
      {
        kind: 'code',
        caption: 'A local test harness',
        code: `public class Test {
    public static void main(String[] args) {
        Solution s = new Solution();
        int[] nums = {2, 7, 11, 15};
        int[] result = s.twoSum(nums, 9);
        System.out.println(Arrays.toString(result));    // [0, 1]
    }
}`,
      },
      {
        kind: 'text',
        body: 'That pattern — construct the `Solution`, build an input, print the result — is how you test a LeetCode solution locally. `Arrays.toString` is needed because printing an array directly shows its memory address instead of its contents.',
      },
    ],
    keyTakeaways: [
      '`public static void main(String[] args)` — only the parameter name is free.',
      'A wrong signature compiles and fails at runtime with "Main method not found".',
      'Arguments are `String`s; `args.length` is 0 when none are given.',
      'Use a local `main` to construct `Solution` and test it before submitting.',
    ],
    practice: {
      prompt: 'Write a program that prints its command-line arguments, then misspell `main` as `Main` and read the runtime error. Then write a test harness that constructs a `Solution` and prints an `int[]` result with `Arrays.toString`.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-1.4',
    language: 'java',
    summary: 'Print results and read input, including the Scanner pitfall everyone hits.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Printing is how you see what your code is doing, and for your first few weeks it is also your debugger. Java gives you three printing methods that differ only in small ways, and one input class with a single famous trap. Learn them now and you will spend your debugging time reading output instead of fighting the tools.',
      },
      {
        kind: 'code',
        caption: 'Output',
        code: `System.out.println("with a newline");
System.out.print("without one");
System.out.printf("%d items, %.2f average%n", 5, 3.14159);

// Concatenation with + converts automatically
int n = 42;
System.out.println("n is " + n);          // "n is 42"`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Printing an array shows its address',
        body: '`System.out.println(arr)` prints something like `[I@6d06d69c` — the type and hash code, not the contents. Use `Arrays.toString(arr)` for a 1D array and `Arrays.deepToString(grid)` for 2D. This surprises everyone once and is the main reason local debugging feels broken at first.',
      },
      {
        kind: 'code',
        code: `int[] arr = {1, 2, 3};
System.out.println(arr);                       // [I@6d06d69c   ← useless
System.out.println(Arrays.toString(arr));      // [1, 2, 3]

int[][] grid = {{1,2},{3,4}};
System.out.println(Arrays.deepToString(grid)); // [[1, 2], [3, 4]]

List<Integer> list = List.of(1, 2, 3);
System.out.println(list);                      // [1, 2, 3]  — collections print fine`,
      },
      { kind: 'heading', text: 'Input with Scanner' },
      {
        kind: 'code',
        code: `import java.util.Scanner;

Scanner sc = new Scanner(System.in);

int n = sc.nextInt();
double d = sc.nextDouble();
String word = sc.next();          // one token, stops at whitespace
String line = sc.nextLine();      // the rest of the line, including spaces`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'The leftover-newline bug',
        body: '`nextInt()` reads the number but leaves the newline you pressed in the buffer. The next `nextLine()` finds that newline immediately, returns an empty string, and moves on — so it looks like the read was skipped entirely. This is the single most common Java input bug.',
      },
      {
        kind: 'code',
        caption: 'Broken, then fixed',
        code: `// BROKEN — name comes out empty
int n = sc.nextInt();
String name = sc.nextLine();          // consumes the leftover newline

// FIXED — discard the rest of the line first
int n = sc.nextInt();
sc.nextLine();                        // throw away the newline
String name = sc.nextLine();          // now reads the real line`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'BufferedReader is much faster for large input',
        body: '`Scanner` parses and is convenient but slow. For competitive input with 10⁵ lines, `BufferedReader` plus `Integer.parseInt` can be several times faster. On LeetCode it never matters — input arrives as method parameters — but it is worth knowing for contests.',
      },
      {
        kind: 'code',
        code: `import java.io.*;

BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
int n = Integer.parseInt(br.readLine().trim());
String[] parts = br.readLine().split(" ");`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'On LeetCode, print only for debugging',
        body: 'The judge reads your **return value** and ignores what you print. Using `System.out.println` to output the answer instead of returning it gives "Wrong Answer" on code that looks correct in your terminal. Remove debug printing before submitting — heavy printing in a loop can also cause Time Limit Exceeded.',
      },
    ],
    keyTakeaways: [
      '`Arrays.toString` / `Arrays.deepToString` — printing an array directly shows its address.',
      'After `nextInt()`, call `nextLine()` once to discard the leftover newline.',
      '`BufferedReader` is much faster than `Scanner` for large input.',
      'The judge reads your return value, not your printed output.',
    ],
    practice: {
      prompt: 'Read an integer `n` then `n` full names with spaces, and print them numbered. You will hit the leftover-newline bug on the first name — fix it with the extra `nextLine()`. Then print an `int[]` both directly and with `Arrays.toString` to see the difference.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-1.5',
    language: 'java',
    summary: 'Write comments and format code so an interviewer can follow your reasoning.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'Comments are ignored by the compiler, so it is tempting to skip them entirely. Do not. In an interview the person reading your screen is judging whether they can *follow your thinking*, and a one-line comment naming your approach does more for that than perfect variable names. The goal is not to explain what the code does — it is to explain **why**.',
      },
      {
        kind: 'code',
        caption: 'The three comment forms',
        code: `// Single line — everything after the slashes is ignored.

/* Multi-line: everything between the markers
   is ignored, across as many lines as you like. */

/**
 * Javadoc — a documentation comment.
 * @param nums the input array
 * @return the index of the target, or -1
 */`,
      },
      {
        kind: 'text',
        body: 'Javadoc is Java-specific: tools extract those comments into API documentation. You will not need it on LeetCode, but recognising it matters when reading library source or a real codebase.',
      },
      { kind: 'heading', text: 'Comment the why, not the what' },
      {
        kind: 'code',
        code: `// USELESS — the code already says this
i++;  // increment i

// USEFUL — explains a decision the code cannot express
// Shrink from the left: the window is too wide, so this is the
// only way the sum can come back down.
left++;`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The habit that pays off in interviews',
        body: 'Put a two-line comment above each solution stating the approach and its complexity — `// Sliding window with a frequency map. O(n) time, O(k) space.` It forces you to articulate the approach before coding, and interviewers consistently read it as a signal of clear thinking.',
      },
      { kind: 'heading', text: 'Formatting conventions' },
      {
        kind: 'table',
        headers: ['Convention', 'Example'],
        rows: [
          ['Classes: `PascalCase`', '`class MinStack`'],
          ['Methods and variables: `camelCase`', '`int maxSum`, `void addNode()`'],
          ['Constants: `UPPER_SNAKE_CASE`', '`static final int MOD = 1_000_000_007;`'],
          ['Opening brace on the same line', '`if (x) {`'],
          ['Four-space indentation', '— standard across Java'],
        ],
      },
      {
        kind: 'text',
        body: 'Java conventions are stricter and more universally followed than C++ ones. Deviating is not a compile error but reads immediately as unfamiliarity with the language.',
      },
      {
        kind: 'code',
        caption: 'Why braces matter even for one line',
        code: `// DANGEROUS — only the first statement is inside the if
if (found)
    System.out.println("yes");
    count++;                       // ALWAYS runs — the indentation is a lie

// SAFE
if (found) {
    System.out.println("yes");
    count++;
}`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Block comments do not nest',
        body: 'You cannot wrap a `/* ... */` inside another — the first `*/` closes both and the rest becomes code. To comment out a large region containing block comments, use `//` on every line (Ctrl+/ in most editors).',
      },
      {
        kind: 'text',
        body: 'One Java-specific readability note: `1_000_000_007` is a legal integer literal. The underscores are ignored by the compiler and make large constants far easier to read — worth using for the modulus in counting problems.',
      },
    ],
    keyTakeaways: [
      '`//`, `/* */`, and Javadoc `/** */`; block comments cannot nest.',
      'Explain *why*, not *what* — and label each solution with its complexity.',
      'PascalCase classes, camelCase methods, UPPER_SNAKE constants.',
      'Underscores in numeric literals (`1_000_000_007`) aid readability.',
    ],
    practice: {
      prompt: 'Add a two-line approach-and-complexity header to a solution you have already written. If you cannot state the complexity in one line, that is a useful signal you do not yet fully understand your own solution.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-1.6',
    language: 'java',
    summary: 'Trace source through javac and the JVM, and know which stage failed.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Java compiles to **bytecode**, not machine code. `javac` turns `.java` into `.class` files of bytecode, and the JVM then executes that bytecode — interpreting it at first, then JIT-compiling the hot paths into native code.',
      },
      {
        kind: 'code',
        caption: 'Compile and run',
        code: `javac Hello.java        # produces Hello.class
java Hello              # runs it — note: NO .class extension

# Since Java 11, single files can be run directly:
java Hello.java`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'You run the class name, not the file name',
        body: '`java Hello.class` fails with `Could not find or load main class Hello.class`. The `java` command takes a *class* name and finds the file itself. This trips up nearly everyone on their first run.',
      },
      {
        kind: 'table',
        headers: ['Stage', 'What happens', 'Typical error'],
        rows: [
          ['**Compile** (`javac`)', 'Syntax and type checking → bytecode', '`cannot find symbol`, `incompatible types`'],
          ['**Class loading**', 'The JVM loads `.class` files', '`NoClassDefFoundError`'],
          ['**Execution**', 'Bytecode runs, JIT compiles hot paths', '`NullPointerException`, `ArrayIndexOutOfBoundsException`'],
        ],
      },
      { kind: 'heading', text: 'Compile-time vs runtime errors' },
      {
        kind: 'code',
        code: `// COMPILE-TIME — caught before it ever runs
int x = "hello";                    // incompatible types
undefinedMethod();                  // cannot find symbol

// RUNTIME — compiles fine, throws when executed
int[] arr = new int[3];
arr[5] = 1;                         // ArrayIndexOutOfBoundsException
String s = null;
s.length();                         // NullPointerException`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Java bounds-checks arrays; C++ does not',
        body: 'An out-of-range index throws `ArrayIndexOutOfBoundsException` with the offending index in the message. In C++ the same mistake silently reads adjacent memory. Java\'s version is far easier to debug — the exception tells you exactly what went wrong and where.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Fix the first error first',
        body: 'One missing semicolon or brace can produce dozens of errors, because the compiler loses track of the structure. Always fix the topmost error and recompile — the rest usually vanish.',
      },
      { kind: 'heading', text: 'What LeetCode reports' },
      {
        kind: 'table',
        headers: ['Verdict', 'Meaning'],
        rows: [
          ['**Compile Error**', 'Never ran — syntax or type problem'],
          ['**Runtime Error**', 'Compiled and threw — the exception name is shown'],
          ['**Time Limit Exceeded**', 'Correct but too slow — a complexity problem'],
          ['**Wrong Answer**', 'Finished, produced the wrong output'],
        ],
      },
      {
        kind: 'text',
        body: 'Java\'s runtime errors are more informative than C++\'s: you get an exception name and often a line number, rather than a bare crash. `NullPointerException` and `ArrayIndexOutOfBoundsException` between them cover most of what you will see.',
      },
    ],
    keyTakeaways: [
      '`javac` produces bytecode; the JVM executes it and JIT-compiles hot paths.',
      'Run `java Hello`, not `java Hello.class`.',
      'Java bounds-checks arrays and throws a named exception.',
      'Fix the first compile error and rebuild — later ones are often knock-on.',
    ],
    practice: {
      prompt: 'Compile and run a program from the command line. Then trigger a compile error, an `ArrayIndexOutOfBoundsException`, and a `NullPointerException` on purpose, and note how differently each is reported. Recognising those two exception names on sight saves real debugging time.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-1.7',
    language: 'java',
    summary: 'Recognise the handful of errors behind most failed Java submissions.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Almost every compile error you hit in your first month is one of about six mistakes, repeated. That is genuinely good news: once you can recognise an error message on sight, fixing it takes seconds instead of twenty frustrated minutes. This lesson is a lookup table — read it once now, then come back whenever the compiler shouts at you.',
      },
      { kind: 'heading', text: '1. Comparing strings with ==' },
      {
        kind: 'code',
        code: `String a = "hello";
String b = "hello";
a == b;              // true — but only by accident (string pooling)

String c = new String("hello");
a == c;              // FALSE — different objects
a.equals(c);         // true — compares CONTENT

// Always use equals for strings:
if (s1.equals(s2)) { ... }`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'This is the defining Java beginner bug',
        body: '`==` compares **references** for objects, not contents. It appears to work for string literals because Java pools them, then fails for strings built at runtime — from input, concatenation, or `substring`. Use `.equals()` for every object comparison; `==` only for primitives.',
      },
      { kind: 'heading', text: '2. Integer caching and ==' },
      {
        kind: 'code',
        code: `Integer a = 127, b = 127;
a == b;              // true  — small Integers are cached

Integer c = 128, d = 128;
c == d;              // FALSE — outside the cache, different objects

c.equals(d);         // true
// Or unbox explicitly:
c.intValue() == d.intValue();     // true`,
      },
      {
        kind: 'text',
        body: 'Java caches `Integer` objects from −128 to 127. Comparing wrapper objects with `==` therefore works for small values and breaks for large ones — a bug that passes every small test case. This matters whenever you pull values out of a `List<Integer>` or `Map<Integer, Integer>`.',
      },
      { kind: 'heading', text: '3. Integer division' },
      {
        kind: 'code',
        code: `int a = 7, b = 2;
double wrong = a / b;              // 3.0 — divided as ints first
double right = (double) a / b;     // 3.5 — cast before dividing

double avg = sum / nums.length;             // WRONG
double avg = (double) sum / nums.length;    // correct`,
      },
      { kind: 'heading', text: '4. Integer overflow' },
      {
        kind: 'code',
        code: `int a = 100000, b = 100000;
long bad  = a * b;                 // OVERFLOWS — multiplied as int first
long good = (long) a * b;          // correct — cast BEFORE multiplying

int mid = (low + high) / 2;              // can overflow
int mid = low + (high - low) / 2;        // safe`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Java has no unsigned types, so overflow always wraps negative',
        body: '`int` caps at 2,147,483,647 and wraps to a negative number past it. Unlike C++ there is no unsigned wraparound to worry about, but the `size()`-style trap is replaced by this one: any sum or product beyond 2 × 10⁹ needs `long`.',
      },
      { kind: 'heading', text: '5. NullPointerException' },
      {
        kind: 'code',
        code: `String s = null;
s.length();                       // NullPointerException

Map<String,Integer> m = new HashMap<>();
int n = m.get("missing");         // NPE — get returns null, unboxing it throws

// Safe:
int n = m.getOrDefault("missing", 0);
if (m.containsKey(k)) { ... }`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'map.get on a missing key returns null, not 0',
        body: 'Assigning that to an `int` triggers auto-unboxing of `null` and throws an NPE. This differs from C++, where `map[key]` default-constructs a zero. Use `getOrDefault(key, 0)` — it is the idiomatic Java equivalent and prevents the whole problem.',
      },
      { kind: 'heading', text: '6. Array vs List confusion' },
      {
        kind: 'code',
        code: `int[] arr = new int[5];
arr.length;                   // a FIELD — no brackets

List<Integer> list = new ArrayList<>();
list.size();                  // a METHOD

String s = "hello";
s.length();                   // a METHOD, unlike arrays

// Three different spellings for "how big is it" — a constant source of typos.`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'A thirty-second pre-submit checklist',
        body: 'String comparisons use `.equals()` · sums that could exceed 2 × 10⁹ use `long` · casts come *before* division and multiplication · `map.get` replaced with `getOrDefault` where a default is wanted · `arr.length` vs `list.size()` vs `s.length()` correct · debug printing removed.',
      },
    ],
    keyTakeaways: [
      'Use `.equals()` for objects; `==` compares references and fails unpredictably.',
      '`Integer` caching makes `==` work below 128 and break above it.',
      'Cast to `double` or `long` **before** the operation, not after.',
      '`map.get` returns null on a miss — prefer `getOrDefault`.',
    ],
    practice: {
      prompt: 'Compare two runtime-built strings with `==` and watch it return false. Then compare `Integer` 127 and 128 pairs and see the result flip. Then unbox a missing map key into an `int` and read the NPE. All three pass small tests and fail real ones, which is exactly why they are worth causing on purpose.',
      leetcode: { title: 'Two Sum', slug: 'two-sum' },
    },
  },
];
