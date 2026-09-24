import type { Lesson } from '../types';

/**
 * Java Chapter 29 — The Language Toolbox.
 * Advanced language mechanics, performance characteristics, and standard
 * library utilities essential for DSA and competitive programming in Java.
 */
export const ch29: Lesson[] = [
  // -------------------------------------------------------------------------
  // java-29.1 — Scanner vs BufferedReader
  // -------------------------------------------------------------------------
  {
    topicId: 'java-29.1',
    language: 'java',
    summary: 'Choose BufferedReader over Scanner to avoid Time Limit Exceeded when parsing massive program inputs.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Reading input from standard input (`System.in`) with the wrong utility can cause unexpected Time Limit Exceeded (TLE) verdicts. When an input file contains 100,000 or more values, `java.util.Scanner` spends substantial runtime on regular expression matching and repeated buffer updates. In contrast, `java.io.BufferedReader` ingests raw characters with minimal overhead.',
      },
      { kind: 'heading', text: 'Buffering and parsing overhead' },
      {
        kind: 'text',
        body: '`Scanner` maintains a small 1 KB buffer (1024 characters) and parses tokens using regular expressions, acquiring internal locks on each call. `BufferedReader` defaults to an 8 KB buffer (8192 characters) and performs no token parsing, reading entire lines directly into memory in bulk.',
      },
      {
        kind: 'table',
        headers: ['Feature', 'Scanner', 'BufferedReader'],
        rows: [
          ['Package', '`java.util`', '`java.io`'],
          ['Buffer Size', '1 KB (1024 characters)', '8 KB (8192 characters)'],
          ['Parsing', 'Regex parsing (`nextInt()`)', 'Raw text only (`readLine()`)'],
          ['Speed', 'Slow (~1-2M numbers/sec)', 'Fast (~10-20M numbers/sec)'],
          ['Exceptions', 'Hides `IOException`', 'Throws checked `IOException`'],
        ],
      },
      {
        kind: 'code',
        caption: 'Fast input reading with BufferedReader vs Scanner',
        code: `import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.IOException;
import java.util.Scanner;

public class Main {
    public static void readWithBuffer() throws IOException {
        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
        String line;
        long sum = 0;
        while ((line = reader.readLine()) != null) {
            sum += Integer.parseInt(line.trim());
        }
        System.out.println("Sum: " + sum);
    }

    public static void readWithScanner() {
        Scanner scanner = new Scanner(System.in);
        long sum = 0;
        while (scanner.hasNextInt()) {
            sum += scanner.nextInt();
        }
        System.out.println("Sum: " + sum);
    }
}`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Scanner.nextInt() does not consume trailing newlines',
        body: 'Calling `scanner.nextInt()` reads only the digits and leaves the newline character (`\\n`) waiting in the buffer. A subsequent `scanner.nextLine()` immediately consumes that leftover newline and returns an empty string. When using `Scanner`, call an extra `scanner.nextLine()` after `nextInt()` to discard the newline.',
      },
    ],
    keyTakeaways: [
      'Scanner relies on regular expressions and a 1 KB buffer, making it slow on large inputs.',
      'BufferedReader uses an 8 KB buffer to read raw characters with minimal OS calls.',
      'BufferedReader methods declare checked IOException, which must be caught or propagated.',
      'Calling nextLine() after nextInt() on a Scanner reads the residual newline character.',
    ],
    practice: {
      prompt: 'Write a benchmark class that reads an in-memory stream of 200,000 integers. Measure elapsed time in milliseconds to sum all integers using Scanner versus BufferedReader paired with Integer.parseInt.',
    },
  },

  // -------------------------------------------------------------------------
  // java-29.2 — StringTokenizer and buffered output
  // -------------------------------------------------------------------------
  {
    topicId: 'java-29.2',
    language: 'java',
    summary: 'Parse space-separated tokens with StringTokenizer and buffer program outputs to prevent console I/O bottlenecks.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'While `BufferedReader.readLine()` ingests full lines rapidly, extracting space-separated values requires splitting each line. Reaching for `String.split(" ")` introduces hidden costs: it compiles a regular expression and allocates a `String[]` array holding every token at once, consuming substantial memory.',
      },
      { kind: 'heading', text: 'Tokenizing and buffering output' },
      {
        kind: 'text',
        body: '`StringTokenizer` in `java.util` steps through a string character by character without regular expressions or array allocations. On the output side, `System.out.println()` flushes the OS console stream on every line. Printing 100,000 outputs individually triggers thousands of kernel context switches, requiring a buffered writer such as `PrintWriter(BufferedOutputStream)` or `BufferedWriter`.',
      },
      {
        kind: 'table',
        headers: ['Output Strategy', 'Mechanism', 'Performance on 200k lines'],
        rows: [
          ['`System.out.println`', 'Unbuffered write, flushes every line', 'Very slow (~1.5 to 3.0 s)'],
          ['`StringBuilder`', 'Accumulates all text in one memory buffer', 'Fast (~0.2 s), higher RAM usage'],
          ['`BufferedWriter`', 'Fixed-size character buffer (8 KB)', 'Fast (~0.15 s), low memory'],
          ['`PrintWriter(BufferedOutputStream)`', 'Formats primitives with 8 KB byte buffer', 'Fast and idiomatic for competitive code'],
        ],
      },
      {
        kind: 'code',
        caption: 'High-throughput parsing and buffered printing template',
        code: `import java.io.BufferedReader;
import java.io.BufferedOutputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.io.IOException;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
        PrintWriter writer = new PrintWriter(new BufferedOutputStream(System.out));
        StringTokenizer tokenizer = null;

        String line;
        while ((line = reader.readLine()) != null) {
            tokenizer = new StringTokenizer(line);
            while (tokenizer.hasMoreTokens()) {
                int value = Integer.parseInt(tokenizer.nextToken());
                writer.println(value * 2);
            }
        }
        writer.flush(); // Flush remaining buffered characters
    }
}`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Forgetting to flush the output buffer',
        body: 'Buffered writers hold output in memory until their internal buffer fills up. If the program terminates without calling `writer.flush()` or `writer.close()`, the final batch of characters remains in memory and is never written to standard output. Online judges will mark your submission as producing empty or truncated output.',
      },
    ],
    keyTakeaways: [
      'String.split() compiles a regular expression and allocates a full string array on the heap.',
      'StringTokenizer extracts tokens sequentially without intermediate array allocations.',
      'System.out.println flushes on every invocation, causing severe I/O bottlenecks in loops.',
      'Always call flush() on buffered writers before program termination to commit all output.',
    ],
    practice: {
      prompt: 'Build a FastScanner helper class with next() and nextInt() methods that wrap BufferedReader and StringTokenizer. Test it by reading multiple lines of space-separated integers and outputting running totals through a buffered PrintWriter.',
    },
  },

  // -------------------------------------------------------------------------
  // java-29.3 — Integer, Long and Character utility methods
  // -------------------------------------------------------------------------
  {
    topicId: 'java-29.3',
    language: 'java',
    summary: 'Harness built-in wrapper methods for bit operations, numerical bounds, and character classification.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Primitive wrapper classes like `Integer`, `Long`, and `Character` offer built-in static utilities that replace manual loops with constant-time hardware instructions. Using them reduces code complexity and prevents edge-case errors in bit manipulation and string processing.',
      },
      { kind: 'heading', text: 'Bit operations and character inspection' },
      {
        kind: 'text',
        body: '`Integer.bitCount(n)` counts the set bits in an integer in constant time via the x86 `POPCNT` instruction. `Integer.highestOneBit(n)` and `Integer.numberOfLeadingZeros(n)` isolate bit positions without iteration. For strings, `Character.isLetterOrDigit(c)` and `Character.toLowerCase(c)` handle Unicode and ASCII ranges reliably.',
      },
      {
        kind: 'table',
        headers: ['Method', 'Class', 'Behavior', 'Complexity'],
        rows: [
          ['`bitCount(n)`', '`Integer` / `Long`', 'Counts set bits (1s)', 'O(1) hardware instruction'],
          ['`numberOfLeadingZeros(n)`', '`Integer` / `Long`', 'Count of zero bits before highest 1', 'O(1) hardware instruction'],
          ['`highestOneBit(n)`', '`Integer` / `Long`', 'Isolates the most significant set bit', 'O(1) bitwise operations'],
          ['`isLetterOrDigit(c)`', '`Character`', 'Validates alphanumeric character', 'O(1) table lookup'],
          ['`toLowerCase(c)`', '`Character`', 'Converts uppercase character to lowercase', 'O(1) table lookup'],
        ],
      },
      {
        kind: 'code',
        caption: 'Alphanumeric verification and bitwise analysis',
        code: `public class Main {
    public static boolean isPalindrome(String s) {
        int left = 0, right = s.length() - 1;
        while (left < right) {
            char cl = s.charAt(left);
            char cr = s.charAt(right);

            if (!Character.isLetterOrDigit(cl)) {
                left++;
            } else if (!Character.isLetterOrDigit(cr)) {
                right--;
            } else {
                if (Character.toLowerCase(cl) != Character.toLowerCase(cr)) {
                    return false;
                }
                left++;
                right--;
            }
        }
        return true;
    }

    public static void printBitInfo(int n) {
        System.out.println("Set bits: " + Integer.bitCount(n));
        System.out.println("Highest power of 2: " + Integer.highestOneBit(n));
    }
}`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Using subtraction inside comparators causes integer overflow',
        body: 'Writing a comparator as `(a, b) -> a - b` is dangerous. If `a = -2_000_000_000` and `b = 2_000_000_000`, the subtraction overflows a 32-bit signed integer and wraps to `+294967296`. A negative number is incorrectly evaluated as greater than a positive number. Always use `Integer.compare(a, b)` or `Long.compare(a, b)`.',
      },
    ],
    keyTakeaways: [
      'Integer.bitCount compiles directly into hardware POPCNT instructions for O(1) bit counting.',
      'Character.isLetterOrDigit and Character.toLowerCase eliminate manual ASCII range checks.',
      'Never use a - b for sorting; use Integer.compare(a, b) to prevent signed integer overflow.',
      'Integer.highestOneBit isolates the largest power of two less than or equal to a positive number.',
    ],
    practice: {
      prompt: 'Solve LeetCode 125 "Valid Palindrome" using Character.isLetterOrDigit and Character.toLowerCase with a two-pointer approach.',
      leetcode: { title: 'Valid Palindrome', slug: 'valid-palindrome' },
    },
  },

  // -------------------------------------------------------------------------
  // java-29.4 — The Math class
  // -------------------------------------------------------------------------
  {
    topicId: 'java-29.4',
    language: 'java',
    summary: 'Apply java.lang.Math functions accurately while avoiding signed overflow and floating-point precision traps.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'The `java.lang.Math` class provides static numerical routines for bounds, rounding, and powers. Because it belongs to `java.lang`, it is available without import statements. However, treating mathematical operations as purely abstract leads to integer overflow and floating-point precision errors.',
      },
      { kind: 'heading', text: 'Range limits and exact operations' },
      {
        kind: 'text',
        body: 'The signed 32-bit integer range is asymmetric: -2,147,483,648 to +2,147,483,647. Evaluating `Math.abs(Integer.MIN_VALUE)` produces a negative value because +2,147,483,648 cannot fit in a 32-bit signed integer. For checked arithmetic, `Math.addExact()` and `Math.multiplyExact()` throw `ArithmeticException` on overflow instead of silently wrapping around.',
      },
      {
        kind: 'table',
        headers: ['Method', 'Return Type', 'Edge Case Behavior'],
        rows: [
          ['`Math.max(a, b)`', 'Same as operands', 'Handles negative numbers; for floats, handles `NaN`'],
          ['`Math.min(a, b)`', 'Same as operands', 'Handles negative numbers; for floats, handles `NaN`'],
          ['`Math.abs(x)`', 'Same as operand', '`Math.abs(Integer.MIN_VALUE)` returns `Integer.MIN_VALUE`'],
          ['`Math.pow(a, b)`', '`double`', '53-bit mantissa; cannot represent exact 64-bit integers'],
          ['`Math.addExact(a, b)`', '`int` / `long`', 'Throws `ArithmeticException` on integer overflow'],
        ],
      },
      {
        kind: 'code',
        caption: 'Safe modular exponentiation and Math.abs behavior',
        code: `public class Main {
    public static long powerMod(long base, long exp, long mod) {
        long result = 1;
        base %= mod;
        while (exp > 0) {
            if ((exp & 1) == 1) {
                result = (result * base) % mod;
            }
            base = (base * base) % mod;
            exp >>= 1;
        }
        return result;
    }

    public static void checkAbs() {
        int min = Integer.MIN_VALUE;
        System.out.println("Math.abs(MIN_VALUE): " + Math.abs(min)); // -2147483648
        System.out.println("Safe abs on long: " + Math.abs((long) min)); // 2147483648
    }
}`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Math.abs on Integer.MIN_VALUE remains negative',
        body: 'Because `+2,147,483,648` exceeds `Integer.MAX_VALUE`, `Math.abs(Integer.MIN_VALUE)` returns `Integer.MIN_VALUE`. If you write `Math.abs(x) % k` to index into an array, a value of `Integer.MIN_VALUE` yields a negative index and crashes with `ArrayIndexOutOfBoundsException`. Cast to `long` before calling `Math.abs`, or use `((x % k) + k) % k`.',
      },
    ],
    keyTakeaways: [
      'Math.abs(Integer.MIN_VALUE) returns a negative number because 2^31 exceeds Integer.MAX_VALUE.',
      'Math.pow works with double precision (53 mantissa bits) and is unsuitable for exact 64-bit integer powers.',
      'Math.addExact and Math.multiplyExact throw ArithmeticException instead of silently overflowing.',
      'Use ((x % mod) + mod) % mod to guarantee positive array indices when modulo values can be negative.',
    ],
    practice: {
      prompt: 'Implement LeetCode 50 "Pow(x, n)" to calculate x^n. Handle n = Integer.MIN_VALUE by casting n to a 64-bit long before negating.',
      leetcode: { title: 'Pow(x, n)', slug: 'powx-n' },
    },
  },

  // -------------------------------------------------------------------------
  // java-29.5 — Integer caching and == on wrappers
  // -------------------------------------------------------------------------
  {
    topicId: 'java-29.5',
    language: 'java',
    summary: 'Understand Java wrapper object caching to prevent bugs caused by comparing Integer references with ==.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Assigning a primitive `int` to an `Integer` object triggers autoboxing via `Integer.valueOf()`. To conserve heap memory, the Java Virtual Machine maintains an internal cache of pre-allocated `Integer` objects for values from **-128 to 127 inclusive**.',
      },
      { kind: 'heading', text: 'Reference equality vs value equality' },
      {
        kind: 'text',
        body: 'The `==` operator on object references compares memory addresses, not mathematical values. Within the range [-128, 127], autoboxing returns the shared cached instance, so `==` evaluates to `true`. For numbers outside this range, new heap objects are allocated, causing `==` to evaluate to `false` even when values match.',
      },
      {
        kind: 'table',
        headers: ['Expression', 'Values Assigned', 'Result with `==`', 'Result with `.equals()`'],
        rows: [
          ['`a == b`', '`Integer a = 127; Integer b = 127;`', '`true` (cached instance)', '`true`'],
          ['`a == b`', '`Integer a = 128; Integer b = 128;`', '`false` (distinct heap objects)', '`true`'],
          ['`a == b`', '`Integer a = -128; Integer b = -128;`', '`true` (cached instance)', '`true`'],
          ['`a == b`', '`Integer a = -129; Integer b = -129;`', '`false` (distinct heap objects)', '`true`'],
        ],
      },
      {
        kind: 'code',
        caption: 'Demonstrating wrapper equality and proper comparison techniques',
        code: `import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        List<Integer> list = new ArrayList<>();
        list.add(100);
        list.add(100);
        list.add(500);
        list.add(500);

        // Inside cache (-128 to 127): == evaluates to true
        System.out.println("100 == 100: " + (list.get(0) == list.get(1))); // true

        // Outside cache: == evaluates to false!
        System.out.println("500 == 500: " + (list.get(2) == list.get(3))); // false

        // Correct approach: use .equals()
        System.out.println("500 equals 500: " + list.get(2).equals(list.get(3))); // true

        // Alternative: unbox to primitive int
        System.out.println("Primitive comparison: " + ((int) list.get(2) == (int) list.get(3))); // true
    }
}`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Comparing elements in a List<Integer> with == fails on large test cases',
        body: 'Writing `if (list.get(i) == list.get(j))` passes sample test cases where values are small (like 1, 2, or 10) because they hit the Integer cache. On hidden test cases with numbers outside [-128, 127], the comparison evaluates to `false`, causing silent submission failures. Always compare wrapper objects using `.equals()` or by casting to `(int)`.',
      },
    ],
    keyTakeaways: [
      'Java caches Integer instances between -128 and 127 inclusive to reduce heap allocations.',
      'The == operator on objects compares reference addresses, not numerical values.',
      'Comparing two Integer wrapper objects with == fails for numbers outside [-128, 127].',
      'Always compare wrapper objects using .equals() or unbox them explicitly with (int).',
    ],
    practice: {
      prompt: 'Write a verification method that loops from -200 to 200, autoboxes each value into two Integer variables a and b, and prints the exact boundaries where a == b evaluates to true versus false.',
    },
  },

  // -------------------------------------------------------------------------
  // java-29.6 — The equals and hashCode contract
  // -------------------------------------------------------------------------
  {
    topicId: 'java-29.6',
    language: 'java',
    summary: 'Implement equals and hashCode consistently so custom objects function correctly as keys in hash-based collections.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Algorithms using grid coordinates or multi-field states often store tuples like `Point(r, c)` in a `HashSet` or as `HashMap` keys. Inherited from `java.lang.Object`, the default implementations of `equals()` and `hashCode()` rely on reference identity (memory addresses). Two separate instances with identical coordinates are treated as distinct keys unless both methods are overridden.',
      },
      { kind: 'heading', text: 'The formal contract' },
      {
        kind: 'text',
        body: 'If two objects are equal according to `equals(Object)`, calling `hashCode()` on each must produce the exact same integer. If two objects have different hash codes, they cannot be equal. Hash collections check `hashCode()` first to select a bucket; if the hash code does not match, `equals()` is never even called.',
      },
      {
        kind: 'table',
        headers: ['Condition', '`equals` Result', '`hashCode` Relationship', 'Status under Contract'],
        rows: [
          ['Equal objects', '`true`', '`a.hashCode() == b.hashCode()`', 'Required by contract'],
          ['Equal objects', '`true`', '`a.hashCode() != b.hashCode()`', 'Violates contract; breaks hash maps'],
          ['Unequal objects', '`false`', '`a.hashCode() == b.hashCode()`', 'Allowed (hash collision)'],
          ['Unequal objects', '`false`', '`a.hashCode() != b.hashCode()`', 'Ideal for bucket distribution'],
        ],
      },
      {
        kind: 'code',
        caption: 'Custom Point class with correct equals and hashCode',
        code: `import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

public class Main {
    public static class Point {
        public final int row;
        public final int col;

        public Point(int row, int col) {
            this.row = row;
            this.col = col;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            Point point = (Point) o;
            return row == point.row && col == point.col;
        }

        @Override
        public int hashCode() {
            return Objects.hash(row, col);
        }
    }

    public static void main(String[] args) {
        Set<Point> visited = new HashSet<>();
        visited.add(new Point(1, 2));
        System.out.println("Contains: " + visited.contains(new Point(1, 2))); // true
    }
}`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Overriding equals() without overriding hashCode()',
        body: 'If you override `equals()` to compare field values but omit `hashCode()`, each `Point` continues using its default memory-derived hash code. When searching the `HashSet`, the collection hashes the lookup instance to a different bucket and returns `false`, even though an equal point exists in another bucket.',
      },
    ],
    keyTakeaways: [
      'If two objects are equal according to equals(), their hashCode() values must be identical.',
      'HashSet and HashMap check hashCode() to find the target bucket before invoking equals().',
      'Overriding equals() without hashCode() causes hash collections to lose stored elements.',
      'Use Objects.hash(...) to compute well-distributed composite hash codes from object fields.',
    ],
    practice: {
      prompt: 'Implement a custom State class representing (int node, int bitmask) for graph shortest paths. Override equals and hashCode correctly, and verify that a new State(5, 3) correctly matches an existing entry in a HashSet.',
    },
  },

  // -------------------------------------------------------------------------
  // java-29.7 — Generics: type parameters, bounds and wildcards
  // -------------------------------------------------------------------------
  {
    topicId: 'java-29.7',
    language: 'java',
    summary: 'Use type parameters, bounds, and the PECS wildcard rule to write type-safe reusable data structures.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Generics enforce compile-time type safety, catching type mismatches before execution. At compilation, Java uses **type erasure** to verify constraints and strip type arguments, replacing them with bounds or `Object`. At runtime, generic collections hold plain `Object` references.',
      },
      { kind: 'heading', text: 'Bounds and the PECS guideline' },
      {
        kind: 'text',
        body: 'Bounded parameters like `<T extends Comparable<T>>` require `T` to implement comparison methods. When writing methods that accept collections of varying type hierarchies, use wildcards following **PECS**: **Producer Extends, Consumer Super**. Read from `<? extends T>` and write into `<? super T>`.',
      },
      {
        kind: 'table',
        headers: ['Syntax', 'Meaning', 'Read Capability', 'Write Capability'],
        rows: [
          ['`<T>`', 'Type parameter', 'Can read as `T`', 'Can write `T` instances'],
          ['`<T extends Bound>`', 'Upper-bounded parameter', 'Can read as `Bound`', 'Can write `T` instances'],
          ['`<? extends T>`', 'Producer wildcard', 'Can read as `T`', 'Read-only (cannot add items)'],
          ['`<? super T>`', 'Consumer wildcard', 'Can read as `Object`', 'Can write `T` or subtypes'],
        ],
      },
      {
        kind: 'code',
        caption: 'Bounded type parameter and PECS copy helper',
        code: `import java.util.List;
import java.util.ArrayList;

public class Main {
    public static <T extends Comparable<T>> T findMax(T[] array) {
        if (array == null || array.length == 0) return null;
        T max = array[0];
        for (T item : array) {
            if (item.compareTo(max) > 0) {
                max = item;
            }
        }
        return max;
    }

    public static <T> void copy(List<? extends T> src, List<? super T> dest) {
        for (T item : src) {
            dest.add(item);
        }
    }

    public static void main(String[] args) {
        List<Integer> integers = List.of(10, 20, 30);
        List<Number> numbers = new ArrayList<>();
        copy(integers, numbers); // Integer extends Number: legal under PECS
        System.out.println("Copied size: " + numbers.size());
    }
}`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Cannot create a generic array directly: new T[capacity]',
        body: 'Writing `T[] array = new T[capacity];` produces a compilation error. Because of type erasure, the runtime environment does not know what type `T` represents and cannot allocate the array. In DSA implementations, use `ArrayList<T>` or create an `Object[]` array and cast it: `(T[]) new Object[capacity]`.',
      },
    ],
    keyTakeaways: [
      'Type erasure strips generic type information at compile time, replacing parameters with their bounds.',
      'Generic arrays cannot be instantiated directly with new T[n] due to type erasure.',
      'Generics are invariant by default: List<Integer> is not a subtype of List<Number>.',
      'Remember PECS: Producer Extends, Consumer Super. Use ? extends T to read and ? super T to write.',
    ],
    practice: {
      prompt: 'Write a generic MinStack<T extends Comparable<T>> class supporting push, pop, top, and getMin in O(1) time without using primitive arrays.',
    },
  },

  // -------------------------------------------------------------------------
  // java-29.8 — Records and enums
  // -------------------------------------------------------------------------
  {
    topicId: 'java-29.8',
    language: 'java',
    summary: 'Model lightweight immutable states with records and typesafe categories with enums.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Algorithms frequently bundle multiple state values, such as BFS queue items `(row, col, distance)` or graph edge entries. Writing traditional classes for small immutable tuples requires tedious boilerplate for constructors, accessors, `equals()`, and `hashCode()`.',
      },
      { kind: 'heading', text: 'Records and enums' },
      {
        kind: 'text',
        body: 'Introduced in Java 16, a `record` declares an immutable data carrier in one line, generating constructor, fields, accessors, `equals()`, `hashCode()`, and `toString()`. An `enum` defines a fixed set of constants, optionally with fields and methods, and pairs with high-performance `EnumSet` and `EnumMap`.',
      },
      {
        kind: 'table',
        headers: ['Feature', 'Standard Class', 'Record (Java 16+)', 'Enum'],
        rows: [
          ['Boilerplate', 'High (fields, getters, hash)', 'Zero (one-line declaration)', 'Minimal'],
          ['Mutability', 'Mutable or immutable', 'Shallowly immutable', 'Immutable instances'],
          ['equals / hashCode', 'Inherited from Object (identity)', 'Auto-generated (value-based)', 'Inherited from Enum (identity)'],
          ['Specialized Collections', 'HashMap, HashSet', 'HashMap, HashSet', '`EnumMap`, `EnumSet` (bit-vector fast)'],
        ],
      },
      {
        kind: 'code',
        caption: 'BFS traversal using a record for state and an enum for directions',
        code: `import java.util.ArrayDeque;
import java.util.Queue;

public class Main {
    public record State(int row, int col, int dist) {}

    public enum Direction {
        UP(-1, 0), DOWN(1, 0), LEFT(0, -1), RIGHT(0, 1);
        public final int dr, dc;
        Direction(int dr, int dc) { this.dr = dr; this.dc = dc; }
    }

    public static int bfs(int[][] grid) {
        Queue<State> queue = new ArrayDeque<>();
        queue.add(new State(0, 0, 0));
        boolean[][] visited = new boolean[grid.length][grid[0].length];
        visited[0][0] = true;

        while (!queue.isEmpty()) {
            State curr = queue.poll();
            if (curr.row() == grid.length - 1 && curr.col() == grid[0].length - 1) {
                return curr.dist();
            }
            for (Direction d : Direction.values()) {
                int nr = curr.row() + d.dr, nc = curr.col() + d.dc;
                if (nr >= 0 && nr < grid.length && nc >= 0 && nc < grid[0].length && !visited[nr][nc]) {
                    visited[nr][nc] = true;
                    queue.add(new State(nr, nc, curr.dist() + 1));
                }
            }
        }
        return -1;
    }
}`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Records are shallowly immutable',
        body: 'A record makes its component references `final`, but does not make referenced objects immutable. If a record holds an array `record Node(int id, int[] weights)`, external code can mutate the array elements. Arrays use identity for `equals()` and `hashCode()`, causing records with identical array contents to compare as unequal.',
      },
    ],
    keyTakeaways: [
      'A record generates constructors, accessors, equals, hashCode, and toString in a single line.',
      'Records are ideal for BFS queue states, graph edge representations, and memoization keys.',
      'Enums provide compile-time safety and pair with high-speed EnumSet and EnumMap.',
      'Record immutability is shallow; mutable components like arrays break value-based equality.',
    ],
    practice: {
      prompt: 'Solve LeetCode 200 "Number of Islands" using a Breadth-First Search queue driven by a record Cell(int r, int c).',
      leetcode: { title: 'Number of Islands', slug: 'number-of-islands' },
    },
  },

  // -------------------------------------------------------------------------
  // java-29.9 — Exceptions: try/catch and the ones LeetCode throws
  // -------------------------------------------------------------------------
  {
    topicId: 'java-29.9',
    language: 'java',
    summary: 'Diagnose runtime exceptions thrown on competitive platforms and use try/catch appropriately.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Java distinguishes between **checked exceptions** (enforced at compile time, like `IOException`) and **unchecked exceptions** (subclasses of `RuntimeException`, representing programmatic bugs). Understanding unchecked exceptions is key to diagnosing competitive coding errors.',
      },
      { kind: 'heading', text: 'Exceptions behind LeetCode Runtime Errors' },
      {
        kind: 'text',
        body: 'A **Runtime Error (RE)** on an online judge indicates an unhandled exception. Identifying the exception type reveals the bug immediately: `NullPointerException` indicates missing null guards, while `ArrayIndexOutOfBoundsException` indicates flawed loop boundaries.',
      },
      {
        kind: 'table',
        headers: ['Exception', 'Root Cause', 'Prevention Checklist'],
        rows: [
          ['`NullPointerException`', 'Accessing field/method on `null` reference', 'Check `head != null` or guard against unboxing `null` `Integer`'],
          ['`ArrayIndexOutOfBoundsException`', 'Array index `< 0` or `>= length`', 'Check loop upper bound (`< n`, not `<= n`) and empty inputs'],
          ['`StringIndexOutOfBoundsException`', '`charAt` or `substring` out of range', 'Verify `i < s.length()` and `start <= end <= s.length()`'],
          ['`StackOverflowError`', 'Recursion depth exceeded call stack limit', 'Verify recursion base cases; use iteration if depth > 10,000'],
          ['`ArithmeticException`', 'Integer division or modulo by zero', 'Guard against zero denominators before division'],
        ],
      },
      {
        kind: 'code',
        caption: 'Defensive checks preventing common runtime exceptions',
        code: `public class Main {
    static class ListNode {
        int val;
        ListNode next;
        ListNode(int val) { this.val = val; }
    }

    public static int getSecondValSafe(ListNode head) {
        // Guard checks prevent NullPointerException
        if (head == null || head.next == null) {
            return -1;
        }
        return head.next.val;
    }

    public static int parsePositive(String s) {
        try {
            int val = Integer.parseInt(s);
            return val > 0 ? val : -1;
        } catch (NumberFormatException e) {
            return -1; // Graceful recovery on invalid numerical input
        }
    }
}`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Catching generic Exception to silence LeetCode crashes',
        body: 'Wrapping your logic in `try { ... } catch (Exception e) { return 0; }` does not fix algorithmic bugs. Catching `NullPointerException` and returning a default value instead converts a Runtime Error into a **Wrong Answer (WA)**. Address the underlying boundary conditions directly.',
      },
    ],
    keyTakeaways: [
      'Checked exceptions must be declared or caught; unchecked exceptions represent logic errors.',
      'A LeetCode Runtime Error is an unhandled exception, most commonly NullPointerException or IndexOutOfBounds.',
      'StackOverflowError indicates recursion depth exceeded JVM call stack limits.',
      'Do not catch generic Exception to suppress crashes; resolve the root pointer or boundary bug.',
    ],
    practice: {
      prompt: 'Review a recursive tree traversal method. Identify the missing base case that causes a NullPointerException when passed a null root, and add defensive guard checks.',
    },
  },

  // -------------------------------------------------------------------------
  // java-29.10 — Arrays: fill, copyOf, asList and deepToString
  // -------------------------------------------------------------------------
  {
    topicId: 'java-29.10',
    language: 'java',
    summary: 'Manipulate native arrays efficiently using the utility methods in java.util.Arrays.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Native arrays provide low-level memory layout and speed. The `java.util.Arrays` utility class provides static methods to populate, slice, compare, and display arrays without manual loops.',
      },
      { kind: 'heading', text: 'Core Arrays helper methods' },
      {
        kind: 'text',
        body: 'Essential methods include `Arrays.fill()`, `Arrays.copyOfRange()`, `Arrays.equals()`, `Arrays.deepToString()`, and `Arrays.asList()`. Knowing their signatures and limitations prevents common mistakes.',
      },
      {
        kind: 'table',
        headers: ['Method', 'Arguments', 'Complexity', 'Notes'],
        rows: [
          ['`Arrays.fill(arr, val)`', '1D array, value', 'O(N)', 'Fills 1D array with specified value'],
          ['`Arrays.copyOfRange(arr, from, to)`', 'Array, start, end', 'O(K)', 'Creates copy of slice (`to` is exclusive)'],
          ['`Arrays.equals(a, b)`', 'Two 1D arrays', 'O(N)', 'Compares elements in corresponding order'],
          ['`Arrays.deepToString(grid)`', 'Multi-dimensional array', 'O(R * C)', 'Formats nested arrays into readable string'],
          ['`Arrays.asList(T... a)`', 'Reference array', 'O(1)', 'Wraps array in fixed-size List view'],
        ],
      },
      {
        kind: 'code',
        caption: 'Initializing, slicing, and debugging arrays',
        code: `import java.util.Arrays;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        // Initializing 2D array: loop over rows
        int[][] dp = new int[3][3];
        for (int[] row : dp) {
            Arrays.fill(row, -1);
        }

        // Slicing an array
        int[] original = {10, 20, 30, 40, 50};
        int[] slice = Arrays.copyOfRange(original, 1, 4); // {20, 30, 40}

        System.out.println("Slice: " + Arrays.toString(slice));
        System.out.println("DP grid: " + Arrays.deepToString(dp));

        // Fixed-size list bridge from boxed array
        Integer[] boxed = {1, 2, 3};
        List<Integer> list = Arrays.asList(boxed);
        System.out.println("List size: " + list.size());
    }
}`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Arrays.asList on a primitive int[] creates a List<int[]>',
        body: '`Arrays.asList(T... a)` requires reference types. Passing a primitive `int[]` does not autobox individual ints; Java treats the entire `int[]` as one argument, returning a `List<int[]>` of size 1. Furthermore, `Arrays.asList()` returns a fixed-size list: calling `.add()` or `.remove()` throws `UnsupportedOperationException`.',
      },
    ],
    keyTakeaways: [
      'Arrays.fill operates on 1D arrays; initializing a 2D matrix requires looping over each row.',
      'Arrays.copyOfRange(arr, from, to) creates a slice where to is exclusive.',
      'Arrays.deepToString formats nested multi-dimensional arrays for instant visual debugging.',
      'Passing primitive int[] to Arrays.asList produces a List<int[]> containing one array object.',
    ],
    practice: {
      prompt: 'Solve LeetCode 88 "Merge Sorted Array" using array copying principles and two-pointer traversal.',
      leetcode: { title: 'Merge Sorted Array', slug: 'merge-sorted-array' },
    },
  },

  // -------------------------------------------------------------------------
  // java-29.11 — Collections: reverse, max, frequency and unmodifiableList
  // -------------------------------------------------------------------------
  {
    topicId: 'java-29.11',
    language: 'java',
    summary: 'Leverage java.util.Collections static methods for element manipulation, queries, and immutable views.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'While `java.util.Arrays` provides utilities for primitive and object arrays, `java.util.Collections` provides static methods designed to manipulate collections implementing `List`, `Set`, or `Collection`.',
      },
      { kind: 'heading', text: 'Manipulations and binary search' },
      {
        kind: 'text',
        body: 'Methods such as `Collections.reverse()`, `Collections.swap()`, `Collections.max()`, and `Collections.frequency()` deliver clean, bug-free implementations of standard routines. `Collections.binarySearch()` searches sorted lists in logarithmic time.',
      },
      {
        kind: 'table',
        headers: ['Method', 'Target Collection', 'Complexity', 'Description'],
        rows: [
          ['`Collections.reverse(list)`', '`List<T>`', 'O(N)', 'Reverses list elements in place'],
          ['`Collections.swap(list, i, j)`', '`List<T>`', 'O(1) for `ArrayList`', 'Swaps elements at indices `i` and `j`'],
          ['`Collections.max(coll)`', '`Collection<T>`', 'O(N)', 'Finds maximum element by natural order'],
          ['`Collections.frequency(coll, o)`', '`Collection<?>`', 'O(N)', 'Counts occurrences equal to object `o`'],
          ['`Collections.binarySearch(list, k)`', 'Sorted `List<T>`', 'O(log N) for `ArrayList`', 'Returns index or `(-insertion_point - 1)`'],
        ],
      },
      {
        kind: 'code',
        caption: 'Applying Collections utilities on an ArrayList',
        code: `import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        List<Integer> nums = new ArrayList<>(List.of(5, 1, 9, 3, 7, 3));

        System.out.println("Max: " + Collections.max(nums));
        System.out.println("Freq of 3: " + Collections.frequency(nums, 3));

        Collections.reverse(nums);
        System.out.println("Reversed: " + nums);

        Collections.sort(nums);
        int index = Collections.binarySearch(nums, 7);
        System.out.println("Index of 7: " + index);

        List<Integer> readOnly = Collections.unmodifiableList(nums);
        // readOnly.add(10); // Throws UnsupportedOperationException
    }
}`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Calling Collections.binarySearch on a LinkedList degrades to O(N)',
        body: '`Collections.binarySearch()` checks whether the list implements the `RandomAccess` marker interface. Because `LinkedList` does not implement `RandomAccess`, navigating to the middle element requires traversing pointers sequentially, degrading the search from O(log N) to O(N). Use `Collections.binarySearch` exclusively on `ArrayList` or arrays.',
      },
    ],
    keyTakeaways: [
      'Collections.reverse and Collections.swap mutate the underlying list in place.',
      'Collections.max and Collections.min find extreme values in O(N) time.',
      'Collections.binarySearch requires an already sorted list and runs in O(log N) on RandomAccess lists.',
      'Collections.unmodifiableList wraps a collection in a read-only view that prevents modifications.',
    ],
    practice: {
      prompt: 'Solve LeetCode 189 "Rotate Array" by applying the three-reversal algorithm: reverse the entire array, reverse the first k elements, and reverse the remaining elements.',
      leetcode: { title: 'Rotate Array', slug: 'rotate-array' },
    },
  },

  // -------------------------------------------------------------------------
  // java-29.12 — Iterator and ConcurrentModificationException
  // -------------------------------------------------------------------------
  {
    topicId: 'java-29.12',
    language: 'java',
    summary: 'Inspect how collection iterators work and avoid ConcurrentModificationException during loops.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'The enhanced for-loop `for (T item : collection)` is syntactic sugar for `Iterator<T> it = collection.iterator()`. Under the hood, collections use a fail-fast design to detect invalid concurrent modifications.',
      },
      { kind: 'heading', text: 'modCount and safe removal' },
      {
        kind: 'text',
        body: 'Collections track structural modifications in a counter called `modCount`. When an iterator is initialized, it records `expectedModCount`. If the collection is modified directly during iteration, `modCount` changes, and the next iterator call throws `ConcurrentModificationException`.',
      },
      {
        kind: 'table',
        headers: ['Strategy', 'Syntax', 'Safety', 'Performance'],
        rows: [
          ['Direct `list.remove()` in for-each', '`for (T x : list) list.remove(x);`', 'Throws exception', 'Fails at runtime'],
          ['Index loop `list.remove(i)`', '`for (int i=0; i<list.size(); i++)`', 'Safe from crash, but skips elements', 'O(N^2) shifting overhead'],
          ['`Iterator.remove()`', '`it.remove()` during iteration', 'Safe', 'O(N^2) ArrayList, O(N) LinkedList'],
          ['`Collection.removeIf()`', '`list.removeIf(predicate);`', 'Idiomatic and safe', 'O(N) single-pass in-place shifting'],
        ],
      },
      {
        kind: 'code',
        caption: 'Safe versus unsafe removal patterns during collection traversal',
        code: `import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class Main {
    public static void removeEvensIterator(List<Integer> list) {
        // Safe: it.remove() updates expectedModCount internally
        Iterator<Integer> it = list.iterator();
        while (it.hasNext()) {
            if (it.next() % 2 == 0) {
                it.remove();
            }
        }
    }

    public static void removeEvensModern(List<Integer> list) {
        // Cleanest approach: O(N) single-pass removal
        list.removeIf(val -> val % 2 == 0);
    }
}`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'ConcurrentModificationException does not require multi-threading',
        body: 'Despite its name, `ConcurrentModificationException` does not require multi-threaded code. It is thrown in single-threaded applications whenever a collection is structurally modified while an iterator is actively traversing it. Modifying a collection inside a `for (T item : list)` loop is the primary cause.',
      },
    ],
    keyTakeaways: [
      'Enhanced for-loops translate into Iterator calls behind the scenes.',
      'Collections track modCount; iterators verify that modCount matches expectedModCount on every step.',
      'Modifying a collection directly while looping through it throws ConcurrentModificationException.',
      'Use it.remove() or collection.removeIf(predicate) for safe, error-free element removal.',
    ],
    practice: {
      prompt: 'Write a method that takes an ArrayList of strings and removes all strings with odd lengths using both an explicit Iterator and list.removeIf. Confirm that neither throws ConcurrentModificationException.',
    },
  },

  // -------------------------------------------------------------------------
  // java-29.13 — Lambdas and functional interfaces
  // -------------------------------------------------------------------------
  {
    topicId: 'java-29.13',
    language: 'java',
    summary: 'Write custom comparators and concise transformation logic using lambdas and functional interfaces.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'A **functional interface** contains exactly one abstract method. Java lambdas provide compact syntax for implementing functional interfaces directly as parameters without anonymous classes.',
      },
      { kind: 'heading', text: 'Core functional interfaces and custom comparators' },
      {
        kind: 'text',
        body: 'Standard interfaces in `java.util.function` include `Predicate<T>`, `Function<T, R>`, and `Consumer<T>`. In algorithmic sorting, `Comparator<T>` allows ordering objects with lambda expressions and combinators like `Comparator.comparingInt()`.',
      },
      {
        kind: 'table',
        headers: ['Interface', 'Abstract Method', 'Lambda Signature', 'Typical Algorithmic Use Case'],
        rows: [
          ['`Predicate<T>`', '`boolean test(T t)`', '`t -> boolean`', 'Filtering in `list.removeIf(...)`'],
          ['`Function<T, R>`', '`R apply(T t)`', '`t -> result`', 'Extracting sorting keys or mapping values'],
          ['`Consumer<T>`', '`void accept(T t)`', '`t -> void`', 'Side-effect actions in `forEach`'],
          ['`Comparator<T>`', '`int compare(T a, T b)`', '`(a, b) -> int`', 'Custom sorting and `PriorityQueue` order'],
        ],
      },
      {
        kind: 'code',
        caption: 'Custom sorting using lambdas and comparator chaining',
        code: `import java.util.Arrays;
import java.util.Comparator;

public class Main {
    public static void sortIntervals(int[][] intervals) {
        // Sort by start time ascending; break ties by end time descending
        Arrays.sort(intervals, (a, b) -> {
            if (a[0] != b[0]) {
                return Integer.compare(a[0], b[0]);
            }
            return Integer.compare(b[1], a[1]);
        });
    }

    public static void sortStrings(String[] words) {
        // Chained comparator: sort by length descending, then alphabetical
        Arrays.sort(words, Comparator.comparingInt(String::length)
                                     .reversed()
                                     .thenComparing(Comparator.naturalOrder()));
    }
}`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Variables captured by a lambda must be final or effectively final',
        body: 'A lambda can read local variables from its outer scope only if they are never modified after assignment. Attempting to increment an outer counter from within a lambda—such as `int count = 0; list.forEach(x -> count++);`—fails compilation. Use a traditional for-loop or a single-element array `int[] count = new int[1];`.',
      },
    ],
    keyTakeaways: [
      'A functional interface contains exactly one abstract method and can be implemented with a lambda.',
      'Comparator.comparingInt and .thenComparing build multi-key sorting logic without nested if-statements.',
      'Lambdas can only capture enclosing local variables that are final or effectively final.',
      'Always use Integer.compare(a, b) inside custom lambda comparators to avoid integer overflow.',
    ],
    practice: {
      prompt: 'Solve LeetCode 791 "Custom Sort String" using a custom lambda comparator that orders characters according to their index in the target order string.',
      leetcode: { title: 'Custom Sort String', slug: 'custom-sort-string' },
    },
  },

  // -------------------------------------------------------------------------
  // java-29.14 — Streams, and why to avoid them in hot loops
  // -------------------------------------------------------------------------
  {
    topicId: 'java-29.14',
    language: 'java',
    summary: 'Understand Java Streams overhead and know when to prefer primitive loops to avoid Time Limit Exceeded.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Java 8 Streams provide declarative pipelines like `filter`, `map`, and `reduce`. While expressive for enterprise data manipulation, using Streams inside performance-critical inner loops frequently causes Time Limit Exceeded (TLE) in competitive programming.',
      },
      { kind: 'heading', text: 'Sources of stream overhead' },
      {
        kind: 'text',
        body: 'Streams incur overhead from three main sources: pipeline object allocation on the heap, boxing of primitives into wrapper objects (`Stream<Integer>` rather than raw arrays), and reduced HotSpot JIT compiler loop vectorization compared to classic for-loops.',
      },
      {
        kind: 'table',
        headers: ['Approach', 'Heap Allocations', 'Vectorization', 'Relative Runtime (10M items)'],
        rows: [
          ['Primitive `for` loop (`int[]`)', '0 allocations', 'Full SIMD vectorization', '~1x (fastest, baseline)'],
          ['`IntStream.range().sum()`', 'Small pipeline objects', 'Partial', '~2x to 4x slower'],
          ['`List<Integer>.stream()`', 'Millions of boxed wrappers', 'None', '~10x to 20x slower + GC pressure'],
          ['Nested streams in BFS/DFS', 'Allocations per iteration', 'None', 'Frequent TLE verdict on online judges'],
        ],
      },
      {
        kind: 'code',
        caption: 'Comparing a declarative stream pipeline with a primitive loop',
        code: `import java.util.Arrays;

public class Main {
    // Declarative but slow: allocates pipeline objects
    public static int sumEvenSquaresStream(int[] nums) {
        return Arrays.stream(nums)
                     .filter(x -> x % 2 == 0)
                     .map(x -> x * x)
                     .sum();
    }

    // High performance: zero heap allocations, vector-friendly
    public static int sumEvenSquaresLoop(int[] nums) {
        int sum = 0;
        for (int i = 0; i < nums.length; i++) {
            int x = nums[i];
            if ((x & 1) == 0) {
                sum += x * x;
            }
        }
        return sum;
    }
}`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'When is it appropriate to use Streams?',
        body: 'Streams are appropriate for one-off tasks outside critical execution paths, such as reading configuration files, converting lists during setup, or writing readable code during discussions. Inside any loop executing 10,000 or more times, stick to primitive arrays and standard for-loops.',
      },
    ],
    keyTakeaways: [
      'Streams allocate pipeline objects and lambda instances that strain the garbage collector.',
      'Generic streams cause boxing overhead, turning 4-byte primitive integers into 24-byte heap objects.',
      'Traditional imperative for-loops compile into SIMD instructions and unrolled loops in JIT machine code.',
      'Keep streams for one-off setup code; stick to classic loops for algorithmic hot paths and inner iterations.',
    ],
    practice: {
      prompt: 'Solve LeetCode 217 "Contains Duplicate" using an imperative loop with a HashSet. Compare the submission runtime percentile against a one-liner solution using Arrays.stream(nums).distinct().count().',
      leetcode: { title: 'Contains Duplicate', slug: 'contains-duplicate' },
    },
  },
];
