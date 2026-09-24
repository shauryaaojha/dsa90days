import type { SharedLesson } from './types';

/**
 * Bit Manipulation — Binary representations, two’s complement, bitwise operators,
 * single-bit operations, power-of-two detection, set bit counting, XOR properties,
 * and bitmask subset iteration.
 */
export const lessons: SharedLesson[] = [
  // =========================================================================
  // Lesson 1: Binary representation and two’s complement
  // =========================================================================
  {
    sub: 1,
    summary: 'Convert numbers between decimal and binary, and trace how two’s complement represents negative values in computer memory.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Computers store and process all information as sequences of binary digits, or **bits**. A bit holds one of two possible states: 0 or 1. While decimal notation represents quantities as sums of powers of 10, binary notation represents quantities as sums of powers of 2. For an unsigned integer of width w, bit index k (counting from 0 at the rightmost position) contributes a value of 2^k when set to 1.',
      },
      { kind: 'heading', text: 'Signed integers and two’s complement' },
      {
        kind: 'text',
        body: 'Modern processors represent negative integers using a notation called **two’s complement**. In two’s complement, the most significant bit (the leftmost bit, at position w - 1) carries a negative weight of -2^(w - 1). All other bit positions k < w - 1 continue to contribute positive values +2^k. This design allows the CPU to perform addition and subtraction with the identical hardware adder circuit.',
      },
      {
        kind: 'table',
        headers: ['Value', 'Sign Bit (Weight -128)', 'Remaining Bits', 'Arithmetic Sum'],
        rows: [
          ['5', '0', '0000101', '0 + 4 + 1 = 5'],
          ['1', '0', '0000001', '0 + 1 = 1'],
          ['0', '0', '0000000', '0'],
          ['-1', '1', '1111111', '-128 + 64 + 32 + 16 + 8 + 4 + 2 + 1 = -1'],
          ['-5', '1', '1111011', '-128 + 64 + 32 + 16 + 8 + 2 + 1 = -5'],
          ['-128', '1', '0000000', '-128 + 0 = -128'],
        ],
      },
      { kind: 'heading', text: 'The negation rule' },
      {
        kind: 'text',
        body: 'To negate any number x in two’s complement, invert all bits and add 1. In mathematical terms, -x = ~x + 1, where ~ represents bitwise NOT. For example, to negate 5 (`00000101` in 8 bits), inverting gives `11111010`, and adding 1 gives `11111011`, which represents -5.',
      },
      {
        kind: 'code',
        caption: 'Verifying two’s complement negation and binary layouts',
        code: {
          cpp: `#include <iostream>
#include <bitset>
using namespace std;

int main() {
    int x = 5;
    int neg = ~x + 1; // Two's complement negation: -5

    cout << " 5 in binary: " << bitset<8>(x) << endl;
    cout << "-5 in binary: " << bitset<8>(neg) << endl;
    cout << "Calculated negation: " << neg << endl;
    return 0;
}`,
          java: `public class Main {
    public static void main(String[] args) {
        int x = 5;
        int neg = ~x + 1; // Two's complement negation: -5

        System.out.println(" 5 in binary: " + String.format("%8s", Integer.toBinaryString(x & 0xFF)).replace(' ', '0'));
        System.out.println("-5 in binary: " + String.format("%8s", Integer.toBinaryString(neg & 0xFF)).replace(' ', '0'));
        System.out.println("Calculated negation: " + neg);
    }
}`,
          python: `# Python integers have arbitrary precision, so mask with 0xFF to view 8-bit two's complement
x = 5
neg = ~x + 1  # Two's complement negation: -5

print(f" 5 in binary: {x & 0xFF:08b}")
print(f"-5 in binary: {neg & 0xFF:08b}")
print(f"Calculated negation: {neg}")`,
        },
        output: ' 5 in binary: 00000101\n-5 in binary: 11111011\nCalculated negation: -5',
      },
      {
        kind: 'text',
        body: {
          cpp: 'In C++, standard `int` is a signed 32-bit integer covering the range -2,147,483,648 to 2,147,483,647. If non-negative values are guaranteed, `unsigned int` or `<cstdint>` types like `uint32_t` can be selected.',
          java: 'In Java, integer types are fixed-width and signed. An `int` is strictly a 32-bit signed two’s complement integer covering -2,147,483,648 to 2,147,483,647. Java does not provide unsigned integer primitive types.',
          python: 'In Python, the `int` type has arbitrary precision and automatically expands rather than wrapping around at 32 or 64 bits. Bitwise operators treat negative numbers as having an infinite sequence of leading sign bits.',
        },
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'The asymmetric range of two’s complement',
        body: 'Because 0 uses a sign bit of 0, an N-bit signed type can hold 2^(N-1) negative numbers but only 2^(N-1) - 1 positive numbers. For a 32-bit signed integer, the minimum possible value is -2,147,483,648, but the maximum positive value is 2,147,483,647. Attempting to negate -2,147,483,648 cannot produce a positive result within 32 bits, causing integer overflow.',
      },
    ],
    keyTakeaways: [
      'Binary numbers express values as sums of powers of 2.',
      'Two’s complement assigns a negative weight to the leading sign bit, unifying hardware addition and subtraction.',
      'Negating an integer inverts every bit and adds 1: -x = ~x + 1.',
      'Signed ranges are asymmetric; the minimum negative integer has no positive counterpart within the same bit width.',
    ],
    practice: {
      prompt: 'Write a function that reverses the 32 bits of a given unsigned integer and returns the resulting number.',
      leetcode: { title: 'Reverse Bits', slug: 'reverse-bits' },
    },
  },

  // =========================================================================
  // Lesson 2: AND, OR, XOR, NOT
  // =========================================================================
  {
    sub: 2,
    summary: 'Apply the four core bitwise operators (AND, OR, XOR, NOT) using truth tables and operational mental models.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Bitwise operators evaluate each bit position of two numbers independently in parallel. Unlike logical operators that evaluate an entire condition to a single truth value, bitwise operators produce a new integer where each resulting bit reflects the interaction between the two corresponding input bits.',
      },
      { kind: 'heading', text: 'Truth tables for the four operators' },
      {
        kind: 'table',
        headers: ['Bit A', 'Bit B', 'AND (A & B)', 'OR (A | B)', 'XOR (A ^ B)', 'NOT (~A)'],
        rows: [
          ['0', '0', '0', '0', '0', '1'],
          ['0', '1', '0', '1', '1', '1'],
          ['1', '0', '0', '1', '1', '0'],
          ['1', '1', '1', '1', '0', '0'],
        ],
      },
      { kind: 'heading', text: 'Operational mental models' },
      {
        kind: 'text',
        body: 'Understanding bitwise operators is easier when thinking in terms of masks. Bitwise AND (`&`) acts as an extraction filter: computing `x & 1` preserves the bit, while `x & 0` forces it to 0. Bitwise OR (`|`) acts as an enabler: computing `x | 1` forces the bit on, while `x | 0` leaves it unaltered. Bitwise XOR (`^`) acts as a toggler: computing `x ^ 1` flips the bit, while `x ^ 0` retains it. Bitwise NOT (`~`) inverts every bit.',
      },
      {
        kind: 'code',
        caption: 'Demonstrating AND, OR, XOR, and NOT on small integers',
        code: {
          cpp: `#include <iostream>
#include <bitset>
using namespace std;

int main() {
    int a = 0b1100; // 12 in decimal
    int b = 0b1010; // 10 in decimal

    cout << "a & b: " << bitset<4>(a & b) << " (" << (a & b) << ")" << endl;
    cout << "a | b: " << bitset<4>(a | b) << " (" << (a | b) << ")" << endl;
    cout << "a ^ b: " << bitset<4>(a ^ b) << " (" << (a ^ b) << ")" << endl;
    cout << "~a:    " << (~a) << " (~x equals -x - 1)" << endl;
    return 0;
}`,
          java: `public class Main {
    public static void main(String[] args) {
        int a = 0b1100; // 12 in decimal
        int b = 0b1010; // 10 in decimal

        System.out.println("a & b: " + Integer.toBinaryString(a & b) + " (" + (a & b) + ")");
        System.out.println("a | b: " + Integer.toBinaryString(a | b) + " (" + (a | b) + ")");
        System.out.println("a ^ b: " + Integer.toBinaryString(a ^ b) + " (" + (a ^ b) + ")");
        System.out.println("~a:    " + (~a) + " (~x equals -x - 1)");
    }
}`,
          python: `a = 0b1100  # 12 in decimal
b = 0b1010  # 10 in decimal

print(f"a & b: {a & b:04b} ({a & b})")
print(f"a | b: {a | b:04b} ({a | b})")
print(f"a ^ b: {a ^ b:04b} ({a ^ b})")
print(f"~a:    {~a} (~x equals -x - 1)")`,
        },
        output: 'a & b: 1000 (8)\na | b: 1110 (14)\na ^ b: 0110 (6)\n~a:    -13 (~x equals -x - 1)',
      },
      { kind: 'heading', text: 'Why NOT produces negative numbers' },
      {
        kind: 'text',
        body: 'Because computers use two’s complement notation, the identity ~x = -x - 1 holds for all integers. When inverting 0, every bit turns to 1, which represents -1. When inverting 12, the result is -13. Inverting flips the sign bit along with all value bits.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Confusing bitwise with logical operators',
        body: 'Substituting `&` for `&&` or `|` for `||` causes hard-to-detect logic errors. In a boolean expression, `2 && 1` evaluates to true because both non-zero values are truthy. In contrast, `2 & 1` performs bitwise AND on `0b10` and `0b01`, producing 0, which evaluates to false. Furthermore, bitwise operators do not short-circuit.',
      },
    ],
    keyTakeaways: [
      'Bitwise operators work on each bit position independently in parallel.',
      'AND filters bits, OR enables bits, and XOR flips bits where the operand has 1.',
      'NOT inverts all bits, producing ~x = -x - 1 under two’s complement.',
      'Never use single-character bitwise operators `&` and `|` when boolean logical decisions are required.',
    ],
    practice: {
      prompt: 'Given two integers x and y, write a function that calculates the Hamming distance: the number of bit positions at which the corresponding bits are different.',
      leetcode: { title: 'Hamming Distance', slug: 'hamming-distance' },
    },
  },

  // =========================================================================
  // Lesson 3: Left and right shifts
  // =========================================================================
  {
    sub: 3,
    summary: 'Shift bits left and right to perform fast powers-of-two arithmetic, distinguishing logical from arithmetic shifts.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Bit shifts move all bits of an integer left or right by a specified count of positions. Shifting serves as the binary equivalent of sliding decimal digits past the decimal point. Shifting left by 1 position multiplies an integer by 2, while shifting right by 1 position divides an integer by 2 with floor rounding.',
      },
      { kind: 'heading', text: 'Left shift (`<<`)' },
      {
        kind: 'text',
        body: 'Left-shifting `x << k` moves every bit k places toward higher-value powers of 2. The k vacant positions created on the right are filled with zeros. Bits that shift beyond the integer width are discarded. As long as no significant set bit overflows into or past the sign bit, `x << k` computes x * 2^k.',
      },
      { kind: 'heading', text: 'Arithmetic versus logical right shift' },
      {
        kind: 'text',
        body: 'Right-shifting moves bits toward lower-value positions. When bits move right, new bits must fill the vacated positions on the left. Computer architectures define two distinct ways to fill these positions:',
      },
      {
        kind: 'table',
        headers: ['Shift Type', 'Operator', 'Left Fill Bit', 'Intended Usage'],
        rows: [
          ['Arithmetic Right Shift', '>>', 'Copies the original sign bit (0 for positive, 1 for negative)', 'Preserves sign for division of signed integers'],
          ['Logical Right Shift', '>>> or unsigned >>', 'Always fills with 0', 'Inspects raw bit patterns without sign interpretation'],
        ],
      },
      {
        kind: 'text',
        body: {
          cpp: 'In C++, right shift (`>>`) on signed integers performs an arithmetic shift in standard implementations. On `unsigned` types, `>>` performs a logical shift, inserting zeros on the left.',
          java: 'In Java, `>>` performs arithmetic right shift, preserving the sign bit. The dedicated operator `>>>` performs an unsigned logical right shift, always shifting zeros into the leftmost positions.',
          python: 'In Python, `>>` performs an arithmetic shift on arbitrary-precision signed integers. To simulate a 32-bit logical right shift, mask the input with `& 0xFFFFFFFF` before shifting.',
        },
      },
      {
        kind: 'code',
        caption: 'Arithmetic shifting compared with logical right shifting',
        code: {
          cpp: `#include <iostream>
using namespace std;

int main() {
    int val = 20;
    cout << "20 << 2: " << (val << 2) << " (20 * 4)" << endl;
    cout << "20 >> 2: " << (val >> 2) << " (20 / 4)" << endl;

    int neg = -16;
    cout << "-16 >> 2: " << (neg >> 2) << " (arithmetic right shift)" << endl;

    // Logical shift on unsigned value
    unsigned int u = static_cast<unsigned int>(neg);
    cout << "unsigned neg >> 2: " << (u >> 2) << " (zeros shifted from left)" << endl;
    return 0;
}`,
          java: `public class Main {
    public static void main(String[] args) {
        int val = 20;
        System.out.println("20 << 2: " + (val << 2) + " (20 * 4)");
        System.out.println("20 >> 2: " + (val >> 2) + " (20 / 4)");

        int neg = -16;
        System.out.println("-16 >> 2: " + (neg >> 2) + " (arithmetic right shift)");
        System.out.println("-16 >>> 2: " + (neg >>> 2) + " (logical right shift)");
    }
}`,
          python: `val = 20
print(f"20 << 2: {val << 2} (20 * 4)")
print(f"20 >> 2: {val >> 2} (20 // 4)")

neg = -16
print(f"-16 >> 2: {neg >> 2} (arithmetic right shift)")

# Logical shift for 32-bit representation:
logical_result = (neg & 0xFFFFFFFF) >> 2
print(f"unsigned neg >> 2: {logical_result} (zeros shifted from left)")`,
        },
        output: '20 << 2: 80 (20 * 4)\n20 >> 2: 5 (20 / 4)\n-16 >> 2: -4 (arithmetic right shift)',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Shift count equal to or greater than type width',
        body: 'Shifting a 32-bit integer by 32 or more positions (for example `x << 32` or `x >> 35`) does not clear the integer to 0. Processor architectures mask the shift count using `count % 32`. In C++, shifting by a count that is negative or greater than or equal to the bit width constitutes undefined behaviour. Shift counts must strictly remain in the range 0 to 31 for 32-bit integers.',
      },
    ],
    keyTakeaways: [
      '`x << k` computes x * 2^k, and `x >> k` computes floor(x / 2^k).',
      'Arithmetic shift (`>>`) duplicates the sign bit to preserve negative values.',
      { cpp: 'Right-shifting an `unsigned` value is a logical shift: zeros come in on the left. On a signed negative value the shift is arithmetic on GCC and keeps the sign.', java: '`>>>` is the logical right shift: zeros come in on the left. `>>` is arithmetic and keeps the sign.', python: 'Integers are unbounded, so `>>` on a negative number keeps the sign forever; mask with `& 0xFFFFFFFF` first to get the 32-bit logical result.' },
      'Shifting by 32 or more bits on 32-bit integers is undefined or masked.',
    ],
    practice: {
      prompt: 'Given a positive integer n, check whether its binary representation has alternating bits: adjacent bits always have differing values (for example, 5 is 101 in binary, which alternates, while 7 is 111, which does not). Solve this using shifting and XOR.',
      leetcode: { title: 'Binary Number with Alternating Bits', slug: 'binary-number-with-alternating-bits' },
    },
  },

  // =========================================================================
  // Lesson 4: Check, set, clear and toggle a bit
  // =========================================================================
  {
    sub: 4,
    summary: 'Inspect, set, clear, and toggle individual bit positions using canonical bitmask formulas.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Individual bits within an integer can represent boolean flags, configuration switches, or element memberships. Bit indexing begins at 0 for the least significant bit (the rightmost position, representing 2^0). Controlling individual bits requires four fundamental operations: checking, setting, clearing, and toggling.',
      },
      { kind: 'heading', text: 'The four fundamental formulas' },
      {
        kind: 'table',
        headers: ['Operation', 'Formula', 'Mask Used', 'Effect on Target Bit'],
        rows: [
          ['Check bit i', '(n >> i) & 1', '1 << i', 'Produces 1 if bit i is set, 0 if cleared'],
          ['Set bit i', 'n | (1 << i)', '1 << i', 'Forces bit i to 1 without altering others'],
          ['Clear bit i', 'n & ~(1 << i)', '~(1 << i)', 'Forces bit i to 0 without altering others'],
          ['Toggle bit i', 'n ^ (1 << i)', '1 << i', 'Inverts bit i: 0 becomes 1, 1 becomes 0'],
        ],
      },
      { kind: 'heading', text: 'How each formula operates' },
      {
        kind: 'text',
        body: 'To construct a single-bit probe at index i, we evaluate `1 << i`, which places a 1 at position i and zeros everywhere else. In `set`, computing `n | (1 << i)` leaves all other bits unchanged because b | 0 = b, while forcing position i to 1 because b | 1 = 1. In `clear`, inverting the mask with `~(1 << i)` creates a number containing 1s everywhere except at position i. Computing `n & ~(1 << i)` retains all existing bits because b & 1 = b, while forcing position i to 0 because b & 0 = 0. In `toggle`, XOR inverts position i because b ^ 1 = 1 - b.',
      },
      {
        kind: 'code',
        caption: 'Implementing the four bit manipulation operations',
        code: {
          cpp: `#include <iostream>
using namespace std;

bool checkBit(int n, int i)  { return (n >> i) & 1; }
int setBit(int n, int i)     { return n | (1 << i); }
int clearBit(int n, int i)   { return n & ~(1 << i); }
int toggleBit(int n, int i)  { return n ^ (1 << i); }

int main() {
    int n = 0; // Binary: 0000
    n = setBit(n, 3); // Binary: 1000 (decimal 8)
    cout << "After setting bit 3: " << n << " (check: " << checkBit(n, 3) << ")" << endl;

    n = toggleBit(n, 3); // Binary: 0000 (decimal 0)
    cout << "After toggling bit 3: " << n << endl;

    n = setBit(n, 2); // Binary: 0100 (decimal 4)
    n = clearBit(n, 2); // Binary: 0000 (decimal 0)
    cout << "After clearing bit 2: " << n << endl;
    return 0;
}`,
          java: `public class Main {
    static boolean checkBit(int n, int i)  { return ((n >> i) & 1) == 1; }
    static int setBit(int n, int i)     { return n | (1 << i); }
    static int clearBit(int n, int i)   { return n & ~(1 << i); }
    static int toggleBit(int n, int i)  { return n ^ (1 << i); }

    public static void main(String[] args) {
        int n = 0;
        n = setBit(n, 3);
        System.out.println("After setting bit 3: " + n + " (check: " + checkBit(n, 3) + ")");

        n = toggleBit(n, 3);
        System.out.println("After toggling bit 3: " + n);

        n = setBit(n, 2);
        n = clearBit(n, 2);
        System.out.println("After clearing bit 2: " + n);
    }
}`,
          python: `def check_bit(n: int, i: int) -> int:
    return (n >> i) & 1

def set_bit(n: int, i: int) -> int:
    return n | (1 << i)

def clear_bit(n: int, i: int) -> int:
    return n & ~(1 << i)

def toggle_bit(n: int, i: int) -> int:
    return n ^ (1 << i)

n = 0
n = set_bit(n, 3)
print(f"After setting bit 3: {n} (check: {check_bit(n, 3)})")

n = toggle_bit(n, 3)
print(f"After toggling bit 3: {n}")

n = set_bit(n, 2)
n = clear_bit(n, 2)
print(f"After clearing bit 2: {n}")`,
        },
        output: 'After setting bit 3: 8 (check: 1)\nAfter toggling bit 3: 0\nAfter clearing bit 2: 0',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Testing bit equality with 1 without right shifting',
        body: 'A frequent error is writing `if ((n & (1 << i)) == 1)`. When i = 3, `n & (1 << 3)` equals 8 (`0b1000`), never 1! The comparison `8 == 1` evaluates to false even though bit 3 is set. When checking a bit, either shift right first with `((n >> i) & 1) == 1`, or test against non-zero with `(n & (1 << i)) != 0`.',
      },
    ],
    keyTakeaways: [
      'The single-bit mask for index i is `1 << i`.',
      'Use `|` to set, `& ~` to clear, and `^` to toggle.',
      'Check whether bit i is set using `((n >> i) & 1) == 1` or `(n & (1 << i)) != 0`.',
      'Never check equality with 1 when testing an unshifted mask `n & (1 << i)`.',
    ],
    practice: {
      prompt: 'Given two integers start and goal, write a function that returns the minimum number of bit flips required to convert start into goal. Flip operations toggle any single bit from 0 to 1 or from 1 to 0.',
      leetcode: { title: 'Minimum Bit Flips to Convert Number', slug: 'minimum-bit-flips-to-convert-number' },
    },
  },

  // =========================================================================
  // Lesson 5: Power-of-two test
  // =========================================================================
  {
    sub: 5,
    summary: 'Determine whether an integer is an exact power of two in O(1) time using the n & (n - 1) bit trick.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'A positive integer is an exact power of two (1, 2, 4, 8, 16, ...) if and only if its binary representation contains a single 1-bit. Testing powers of two by repeated division takes logarithmic time O(log n). Bit manipulation enables an O(1) constant-time test based on the relationship between n and n - 1.',
      },
      { kind: 'heading', text: 'The binary effect of subtracting 1' },
      {
        kind: 'text',
        body: 'Subtracting 1 from an integer borrows through all trailing zeros until it reaches the lowest set bit. That lowest 1-bit flips to 0, and every 0-bit to its right flips to 1. All bits to the left of that lowest set bit remain identical.',
      },
      {
        kind: 'table',
        headers: ['Value n', 'Binary n', 'Value n - 1', 'Binary n - 1', 'n & (n - 1)', 'Result Description'],
        rows: [
          ['8', '1000', '7', '0111', '0000', 'Single 1 cleared to 0 (power of 2)'],
          ['12', '1100', '11', '1011', '1000', 'Lowest 1 cleared, higher 1 remains'],
          ['7', '0111', '6', '0110', '0110', 'Lowest 1 cleared, two 1s remain'],
          ['1', '0001', '0', '0000', '0000', 'Single 1 cleared to 0 (power of 2)'],
        ],
      },
      { kind: 'heading', text: 'Why n & (n - 1) strips the lowest set bit' },
      {
        kind: 'text',
        body: 'Because n and n - 1 share identical bits above the lowest set bit, while the lowest set bit and all lower bits are inverted between them, computing `n & (n - 1)` forces the lowest set bit and all trailing bits to 0. If n contains only one set bit in total, stripping that bit yields 0. If n contains two or more set bits, higher bits survive and the expression yields a non-zero value.',
      },
      {
        kind: 'code',
        caption: 'Testing for power of two in constant time',
        code: {
          cpp: `#include <iostream>
using namespace std;

bool isPowerOfTwo(int n) {
    return n > 0 && (n & (n - 1)) == 0;
}

int main() {
    cout << "16 is power of two: " << boolalpha << isPowerOfTwo(16) << endl;
    cout << "12 is power of two: " << boolalpha << isPowerOfTwo(12) << endl;
    cout << " 0 is power of two: " << boolalpha << isPowerOfTwo(0) << endl;
    return 0;
}`,
          java: `public class Main {
    public static boolean isPowerOfTwo(int n) {
        return n > 0 && (n & (n - 1)) == 0;
    }

    public static void main(String[] args) {
        System.out.println("16 is power of two: " + isPowerOfTwo(16));
        System.out.println("12 is power of two: " + isPowerOfTwo(12));
        System.out.println(" 0 is power of two: " + isPowerOfTwo(0));
    }
}`,
          python: `def is_power_of_two(n: int) -> bool:
    return n > 0 and (n & (n - 1)) == 0

print("16 is power of two:", is_power_of_two(16))
print("12 is power of two:", is_power_of_two(12))
print(" 0 is power of two:", is_power_of_two(0))`,
        },
        output: '16 is power of two: true\n12 is power of two: false\n 0 is power of two: false',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Forgetting the zero and negative guard',
        body: 'Evaluating `n & (n - 1)` on 0 computes `0 & -1`, which evaluates to 0. Without checking `n > 0`, an algorithm would incorrectly classify 0 as a power of two. Negative integers also produce false positives under certain signed configurations (for instance, the minimum 32-bit integer in two’s complement). Always enforce `n > 0` before testing.',
      },
    ],
    keyTakeaways: [
      'Subtracting 1 flips the lowest set bit and all bits to its right.',
      '`n & (n - 1)` clears the lowest set bit of n in O(1) time.',
      'A positive integer is a power of two if and only if `(n & (n - 1)) == 0`.',
      'The condition must include `n > 0` to exclude zero and negative numbers.',
    ],
    practice: {
      prompt: 'Given an integer n, write a function that returns true if it is a power of two, and false otherwise, without using any loops or recursion.',
      leetcode: { title: 'Power of Two', slug: 'power-of-two' },
    },
  },

  // =========================================================================
  // Lesson 6: Counting set bits
  // =========================================================================
  {
    sub: 6,
    summary: 'Count set bits using Brian Kernighan’s algorithm and hardware-backed language built-ins.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'The count of set bits (1s) in an integer is termed its **Hamming weight** or **population count** (`popcount`). A standard inspection scans all 32 bit positions one by one. By applying the bit-clearing property of `n & (n - 1)`, we can skip directly across sequences of zeros from one set bit to the next.',
      },
      { kind: 'heading', text: 'Brian Kernighan’s algorithm' },
      {
        kind: 'text',
        body: 'Because each evaluation of `n = n & (n - 1)` eliminates the lowest set bit of n, running this assignment in a loop until n = 0 executes in exactly k iterations, where k represents the number of 1-bits present. If a 32-bit number has only three set bits, the loop executes three times rather than 32 times.',
      },
      { kind: 'heading', text: 'Hardware-backed built-in functions' },
      {
        kind: 'text',
        body: 'Modern CPUs include a dedicated hardware instruction (`POPCNT` on x86) that counts set bits in a single machine cycle. Standard libraries expose this hardware instruction through built-in functions that execute in O(1) time.',
      },
      {
        kind: 'code',
        caption: 'Kernighan’s loop alongside language built-in functions',
        code: {
          cpp: `#include <iostream>
using namespace std;

// Brian Kernighan's algorithm: O(k) where k is the number of set bits
int countSetBits(unsigned int n) {
    int count = 0;
    while (n > 0) {
        n = n & (n - 1);
        count++;
    }
    return count;
}

int main() {
    unsigned int x = 29; // Binary: 0b11101 (4 set bits)
    cout << "Kernighan count: " << countSetBits(x) << endl;
    cout << "Built-in count:  " << __builtin_popcount(x) << endl;
    return 0;
}`,
          java: `public class Main {
    // Brian Kernighan's algorithm: O(k) where k is the number of set bits
    public static int countSetBits(int n) {
        int count = 0;
        while (n != 0) {
            n = n & (n - 1);
            count++;
        }
        return count;
    }

    public static void main(String[] args) {
        int x = 29; // Binary: 0b11101 (4 set bits)
        System.out.println("Kernighan count: " + countSetBits(x));
        System.out.println("Built-in count:  " + Integer.bitCount(x));
    }
}`,
          python: `# Brian Kernighan's algorithm: O(k) where k is the number of set bits
def count_set_bits(n: int) -> int:
    count = 0
    while n > 0:
        n = n & (n - 1)
        count += 1
    return count

x = 29  # Binary: 0b11101 (4 set bits)
print("Kernighan count:", count_set_bits(x))
print("Built-in count: ", x.bit_count())  # Python 3.10+`,
        },
        output: 'Kernighan count: 4\nBuilt-in count:  4',
      },
      { kind: 'heading', text: 'Algorithmic comparison' },
      {
        kind: 'table',
        headers: ['Approach', 'Time Complexity', 'Iterations on 32-bit int', 'Primary Advantage'],
        rows: [
          ['Shift-and-check loop', 'O(w)', 'Always 32 iterations', 'Directly inspects individual positions'],
          ['Brian Kernighan', 'O(k)', 'k iterations (number of 1s)', 'Independent of word width; interview standard'],
          ['Built-in popcount', 'O(1)', '1 CPU cycle', 'Hardware instruction; optimal for contest submissions'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Memorize the built-in function names',
        body: 'During competitive programming and timed online assessments, use language built-ins: `__builtin_popcount(x)` in C++, `Integer.bitCount(x)` in Java, and `x.bit_count()` in Python. In technical interview rounds, interviewers often ask you to implement Brian Kernighan’s algorithm to explain the underlying bit manipulation.',
      },
    ],
    keyTakeaways: [
      'Brian Kernighan’s algorithm removes one set bit per iteration with `n & (n - 1)`.',
      'Its execution time is proportional to the number of set bits k, not the total bit width.',
      'Hardware built-ins (`__builtin_popcount`, `Integer.bitCount`, `bit_count`) run in O(1) single-cycle time.',
    ],
    practice: {
      prompt: 'Write a function that takes the binary representation of a positive integer and returns the number of set bits it has (also known as the Hamming weight).',
      leetcode: { title: 'Number of 1 Bits', slug: 'number-of-1-bits' },
    },
  },

  // =========================================================================
  // Lesson 7: XOR tricks: swap and the unique element
  // =========================================================================
  {
    sub: 7,
    summary: 'Exploit XOR algebraic properties (identity and self-inversion) to eliminate paired values and swap in place.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'The XOR operator (`^`) obeys mathematical properties that make it a powerful tool in algorithmic design. Because XOR computes addition modulo 2 on each bit position without carry, it satisfies four algebraic properties: identity (x ^ 0 = x), self-inversion (x ^ x = 0), commutativity (a ^ b = b ^ a), and associativity ((a ^ b) ^ c = a ^ (b ^ c)).',
      },
      { kind: 'heading', text: 'The in-place XOR swap' },
      {
        kind: 'text',
        body: 'Using the self-inversion property x ^ x = 0, two variables can exchange values without an intermediate storage variable. Sequence of assignments: first `a = a ^ b`. Second, `b = a ^ b`, which expands to `(a ^ b) ^ b = a ^ (b ^ b) = a ^ 0 = a`, assigning the original value of a into b. Third, `a = a ^ b`, which expands to `(a ^ b) ^ a = (a ^ a) ^ b = 0 ^ b = b`, assigning the original value of b into a.',
      },
      { kind: 'heading', text: 'Finding the unique element' },
      {
        kind: 'text',
        body: 'Suppose an array contains numbers where every element occurs twice, except for one unique value that occurs once. Cumulative XOR across the entire array evaluates to the unique value. Because duplicate numbers cancel each other out (v ^ v = 0) and the order of elements does not affect the outcome due to commutativity and associativity, the total evaluation reduces to 0 ^ unique = unique. This achieves O(n) time and O(1) space without requiring a hash table.',
      },
      {
        kind: 'code',
        caption: 'XOR swap and single number detection',
        code: {
          cpp: `#include <iostream>
#include <vector>
using namespace std;

int singleNumber(const vector<int>& nums) {
    int unique = 0;
    for (int x : nums) {
        unique ^= x;
    }
    return unique;
}

int main() {
    int a = 25, b = 77;
    // XOR swap: valid only when a and b occupy distinct memory addresses
    a ^= b;
    b ^= a;
    a ^= b;
    cout << "Swapped: a=" << a << ", b=" << b << endl;

    vector<int> nums = {4, 1, 2, 1, 2};
    cout << "Unique element: " << singleNumber(nums) << endl;
    return 0;
}`,
          java: `public class Main {
    public static int singleNumber(int[] nums) {
        int unique = 0;
        for (int x : nums) {
            unique ^= x;
        }
        return unique;
    }

    public static void main(String[] args) {
        int a = 25, b = 77;
        a ^= b;
        b ^= a;
        a ^= b;
        System.out.println("Swapped: a=" + a + ", b=" + b);

        int[] nums = {4, 1, 2, 1, 2};
        System.out.println("Unique element: " + singleNumber(nums));
    }
}`,
          python: `def single_number(nums: list[int]) -> int:
    unique = 0
    for x in nums:
        unique ^= x
    return unique

a, b = 25, 77
a ^= b
b ^= a
a ^= b
print(f"Swapped: a={a}, b={b}")

nums = [4, 1, 2, 1, 2]
print("Unique element:", single_number(nums))`,
        },
        output: 'Swapped: a=77, b=25\nUnique element: 4',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'The identical memory address swap trap',
        body: 'If a and b refer to the exact same memory location (such as `swap(arr[i], arr[i])`), the first assignment `a ^= b` computes `arr[i] ^= arr[i]`, which sets the variable to 0. The original value is permanently erased. In production code, standard library `swap` functions or tuple assignments are preferred over the XOR swap idiom.',
      },
    ],
    keyTakeaways: [
      'XOR satisfies x ^ x = 0 and x ^ 0 = x.',
      'Order does not matter: XOR operations can be reordered and grouped arbitrarily.',
      'XORing all elements in an array cancels duplicate pairs, isolating the single unique value in O(n) time and O(1) space.',
      'Never apply the XOR swap idiom when swapping an element with itself.',
    ],
    practice: {
      prompt: 'Given a non-empty array of integers nums, every element appears twice except for one. Find that single one using linear runtime complexity and constant extra space.',
      leetcode: { title: 'Single Number', slug: 'single-number' },
    },
  },

  // =========================================================================
  // Lesson 8: Bitmasks as subsets
  // =========================================================================
  {
    sub: 8,
    summary: 'Represent finite sets as binary integers to perform union, intersection, and subset generation.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'A standard integer can represent a subset of elements chosen from a universe {0, 1, ..., n-1}. In this representation, bit index i is set to 1 if element i belongs to the subset, and 0 if element i is omitted. An integer utilized in this manner is designated a **bitmask**.',
      },
      { kind: 'heading', text: 'Mapping set operations to bitwise instructions' },
      {
        kind: 'text',
        body: 'Representing collections as bitmasks converts set operations into single machine instructions. The empty set is integer 0. The full universal set containing all n elements has the lowest n bits set to 1, constructed by evaluating `(1 << n) - 1`.',
      },
      {
        kind: 'table',
        headers: ['Set Concept', 'Mathematical Form', 'Bitwise Expression', 'Action Performed'],
        rows: [
          ['Empty set', '∅', '0', 'All bits cleared'],
          ['Universal set of n elements', 'U', '(1 << n) - 1', 'Lowest n bits set to 1'],
          ['Add element i', 'S ∪ {i}', 'S | (1 << i)', 'Sets bit i to 1'],
          ['Remove element i', 'S \\ {i}', 'S & ~(1 << i)', 'Clears bit i to 0'],
          ['Test membership of i', 'i ∈ S', '(S >> i) & 1', 'Returns 1 if present, 0 otherwise'],
          ['Union of sets', 'A ∪ B', 'A | B', 'Elements present in A, B, or both'],
          ['Intersection of sets', 'A ∩ B', 'A & B', 'Elements present in both A and B'],
          ['Set difference', 'A \\ B', 'A & ~B', 'Elements in A that are not in B'],
        ],
      },
      { kind: 'heading', text: 'Generating all 2ⁿ subsets' },
      {
        kind: 'text',
        body: 'For an array containing n elements, there exist 2^n distinct subsets. By running an integer `mask` from 0 up to (1 << n) - 1, every binary pattern of length n is visited. For each mask, testing bit i determines whether to include element i in the corresponding subset.',
      },
      {
        kind: 'code',
        caption: 'Generating all subsets using bitmask iteration',
        code: {
          cpp: `#include <iostream>
#include <vector>
using namespace std;

vector<vector<int>> subsets(const vector<int>& nums) {
    int n = nums.size();
    int total = 1 << n; // 2^n
    vector<vector<int>> result;

    for (int mask = 0; mask < total; mask++) {
        vector<int> current;
        for (int i = 0; i < n; i++) {
            if ((mask >> i) & 1) {
                current.push_back(nums[i]);
            }
        }
        result.push_back(current);
    }
    return result;
}

int main() {
    vector<int> nums = {1, 2, 3};
    auto all = subsets(nums);
    cout << "Generated " << all.size() << " subsets." << endl;
    return 0;
}`,
          java: `import java.util.ArrayList;
import java.util.List;

public class Main {
    public static List<List<Integer>> subsets(int[] nums) {
        int n = nums.length;
        int total = 1 << n; // 2^n
        List<List<Integer>> result = new ArrayList<>();

        for (int mask = 0; mask < total; mask++) {
            List<Integer> current = new ArrayList<>();
            for (int i = 0; i < n; i++) {
                if (((mask >> i) & 1) == 1) {
                    current.add(nums[i]);
                }
            }
            result.add(current);
        }
        return result;
    }

    public static void main(String[] args) {
        int[] nums = {1, 2, 3};
        List<List<Integer>> all = subsets(nums);
        System.out.println("Generated " + all.size() + " subsets.");
    }
}`,
          python: `def subsets(nums: list[int]) -> list[list[int]]:
    n = len(nums)
    total = 1 << n  # 2^n
    result = []

    for mask in range(total):
        current = [nums[i] for i in range(n) if (mask >> i) & 1]
        result.append(current)
    return result

nums = [1, 2, 3]
all_subsets = subsets(nums)
print(f"Generated {len(all_subsets)} subsets.")`,
        },
        output: 'Generated 8 subsets.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Exponential growth of the search space',
        body: 'The count of subsets 2^n doubles with each added element. For n = 20, 2^20 is approximately 10^6, which finishes well within typical 1-second execution budgets. For n = 30, 2^30 is approximately 10^9, which will exceed standard time limits. Bitmask subset generation is applicable primarily when n <= 20.',
      },
    ],
    keyTakeaways: [
      'A bitmask stores set membership for up to 30 elements within a single integer.',
      'Standard set operations map directly to bitwise operations: `|` for union, `&` for intersection, and `& ~` for difference.',
      'Iterating `mask` from 0 to (1 << n) - 1 generates all 2^n subsets in O(n * 2^n) time.',
      'Bitmask enumeration is restricted to problem constraints where n <= 20.',
    ],
    practice: {
      prompt: 'Given an integer array nums of unique elements, return all possible subsets (the power set) without duplicates, using bitmask iteration.',
      leetcode: { title: 'Subsets', slug: 'subsets' },
    },
  },

  // =========================================================================
  // Lesson 9: Iterating over all subsets of a mask
  // =========================================================================
  {
    sub: 9,
    summary: 'Traverse submasks of a given mask in O(2ᵏ) time using the sub = (sub - 1) & mask idiom.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'In dynamic programming over subsets and graph partitioning algorithms, problems frequently require inspecting every sub-configuration of a specified set. A mask A is termed a **submask** of mask M if every bit set in A is also set in M. Iterating through all integers from 0 to M wastes time checking invalid patterns that contain 1s outside M.',
      },
      { kind: 'heading', text: 'The submask decrement pattern' },
      {
        kind: 'text',
        body: 'To visit only valid submasks of M, begin with `sub = M`. At each iteration, decrement `sub` by 1 and compute the bitwise AND with M: `sub = (sub - 1) & M`. Subtracting 1 turns off the lowest set bit in `sub` while setting all lower bits to 1. Performing `& M` clears any newly introduced bits that were not in the original mask M, preserving strictly valid submasks.',
      },
      { kind: 'heading', text: 'Step-by-step trace' },
      {
        kind: 'text',
        body: 'Consider mask M = 0b1011 (decimal 11, with bits {0, 1, 3} set). The valid submasks are all subsets of {0, 1, 3}, giving 2^3 = 8 total configurations.',
      },
      {
        kind: 'table',
        headers: ['Step', 'Current sub', 'sub - 1', '(sub - 1) & M', 'Binary Pattern'],
        rows: [
          ['Start', '11', '-', '-', '1011 (bits 0, 1, 3)'],
          ['1', '11 (1011)', '10 (1010)', '10 & 11 = 10', '1010 (bits 1, 3)'],
          ['2', '10 (1010)', '9 (1001)', '9 & 11 = 9', '1001 (bits 0, 3)'],
          ['3', '9 (1001)', '8 (1000)', '8 & 11 = 8', '1000 (bit 3)'],
          ['4', '8 (1000)', '7 (0111)', '7 & 11 = 3', '0011 (bits 0, 1)'],
          ['5', '3 (0011)', '2 (0010)', '2 & 11 = 2', '0010 (bit 1)'],
          ['6', '2 (0010)', '1 (0001)', '1 & 11 = 1', '0001 (bit 0)'],
          ['7', '1 (0001)', '0 (0000)', '0 & 11 = 0', '0000 (empty subset)'],
        ],
      },
      {
        kind: 'code',
        caption: 'Iterating through all submasks of a bitmask',
        code: {
          cpp: `#include <iostream>
using namespace std;

int main() {
    int mask = 0b1011; // 11 in decimal
    int count = 0;

    // Iterates all non-empty submasks down to 1
    for (int sub = mask; sub > 0; sub = (sub - 1) & mask) {
        cout << "Submask: " << sub << endl;
        count++;
    }
    count++; // Account for the empty submask (0)
    cout << "Total submasks visited: " << count << " (2^3 = 8)" << endl;
    return 0;
}`,
          java: `public class Main {
    public static void main(String[] args) {
        int mask = 0b1011; // 11 in decimal
        int count = 0;

        for (int sub = mask; sub > 0; sub = (sub - 1) & mask) {
            System.out.println("Submask: " + sub);
            count++;
        }
        count++; // Account for the empty submask (0)
        System.out.println("Total submasks visited: " + count + " (2^3 = 8)");
    }
}`,
          python: `mask = 0b1011  # 11 in decimal
count = 0

sub = mask
while sub > 0:
    print(f"Submask: {sub:04b} ({sub})")
    count += 1
    sub = (sub - 1) & mask

count += 1  # Account for the empty submask (0)
print(f"Total submasks visited: {count} (2^3 = 8)")`,
        },
        output: 'Submask: 11\nSubmask: 10\nSubmask: 9\nSubmask: 8\nSubmask: 3\nSubmask: 2\nSubmask: 1\nTotal submasks visited: 8 (2^3 = 8)',
      },
      { kind: 'heading', text: 'Total complexity across all masks: O(3ⁿ)' },
      {
        kind: 'text',
        body: 'When an algorithm loops over every mask from 0 to 2^n - 1 and enumerates all submasks for each, the overall operation count across all masks is not O(4^n). A mask with k set bits has 2^k submasks. By the binomial theorem, the sum of C(n, k) * 2^k for k from 0 to n equals (1 + 2)^n = 3^n. For n = 15, 3^15 is approximately 1.4 * 10^7 iterations, executing in under 0.1 seconds.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Infinite loop when sub reaches zero',
        body: 'Looping with `sub >= 0` causes an infinite loop. When `sub` equals 0, evaluating `sub - 1` yields -1 (represented by all 1-bits in two’s complement). Computing `(-1) & mask` resets `sub` back to `mask`, restarting the loop indefinitely. Always terminate the loop at `sub > 0`, and process the empty submask 0 outside the loop.',
      },
    ],
    keyTakeaways: [
      '`sub = (sub - 1) & mask` visits each submask in strictly decreasing numerical order.',
      'The pattern skips invalid bit patterns, taking O(2^k) steps where k is the count of set bits.',
      'Iterating all submasks over all 2^n masks takes O(3^n) total operations by the binomial theorem.',
      'Terminate the loop with `sub > 0` to prevent -1 wrapping back to `mask`.',
    ],
    practice: {
      prompt: 'Given an integer array nums, return the sum of all XOR totals for every subset of nums. Implement this by iterating over subset masks.',
      leetcode: { title: 'Sum of All Subset XOR Totals', slug: 'sum-of-all-subset-xor-totals' },
    },
  },

  // =========================================================================
  // Lesson 10: Bit pitfalls: signed shifts, overflow, precedence
  // =========================================================================
  {
    sub: 10,
    summary: 'Identify and avoid silent bugs caused by operator precedence, 32-bit signed overflow, and sign extension.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Bitwise operations are efficient, but they contain syntactic and structural pitfalls that fail silently at runtime without producing compiler errors. Three specific traps cause the majority of failed submissions on bit manipulation problems: operator precedence oversights, signed integer overflow on shifts, and sign extension during right shifts of negative values.',
      },
      { kind: 'heading', text: 'Pitfall 1: Operator precedence' },
      {
        kind: 'text',
        body: 'In C++, Java, and Python, comparison and equality operators (`==`, `!=`, `<`, `>`) bind tighter than bitwise operators (`&`, `|`, `^`). Writing `if (x & 1 == 0)` does not test whether the lowest bit of `x` is 0. It evaluates `x & (1 == 0)`, which reduces to `x & 0`, evaluating to 0 (false) for every integer. Always surround bitwise operations with parentheses: `if ((x & 1) == 0)`.',
      },
      { kind: 'heading', text: 'Pitfall 2: Shifting 32-bit signed integer literals' },
      {
        kind: 'text',
        body: 'The literal `1` is a standard 32-bit signed integer. Evaluating `1 << 31` shifts a 1 into the sign bit. In C++, shifting into or past the sign bit of a signed integer produces undefined behaviour. If a mask requires 64 bits, writing `1 << i` where i >= 32 truncates to 32 bits and overflows. A 64-bit literal must be used: `1LL << i` in C++, `1L << i` in Java, or standard integers in Python.',
      },
      { kind: 'heading', text: 'Pitfall 3: Right shifting negative values' },
      {
        kind: 'text',
        body: 'Performing an arithmetic right shift on a negative integer replicates the leading 1 sign bit. In C++ and Java, `-1 >> 1` remains `-1` perpetually. Running a loop such as `while (n > 0)` or `while (n != 0)` with `n >>= 1` on negative input creates an infinite loop. Always cast to unsigned integers in C++, utilize `>>>` in Java, or mask with `& 0xFFFFFFFF` in Python.',
      },
      {
        kind: 'table',
        headers: ['Flawed Code', 'Actual Evaluation', 'Corrected Syntax', 'Root Cause'],
        rows: [
          ['x & 1 == 0', 'x & (1 == 0) -> x & 0', '(x & 1) == 0', 'Equality (==) binds tighter than bitwise AND (&)'],
          ['1 << 35', '1 << (35 % 32) -> 1 << 3', '1LL << 35 (C++) or 1L << 35 (Java)', 'Literal 1 defaults to a 32-bit signed integer'],
          ['x ^ y == 0', 'x ^ (y == 0)', '(x ^ y) == 0', 'Equality (==) binds tighter than bitwise XOR (^)'],
          ['n >> 1 on negative n', 'Replicates 1 sign bit', 'unsigned (C++) or n >>> 1 (Java)', 'Arithmetic shift preserves sign of negative numbers'],
        ],
      },
      {
        kind: 'code',
        caption: 'Correcting operator precedence, 64-bit shifts, and negative shifts',
        code: {
          cpp: `#include <iostream>
using namespace std;

int main() {
    int x = 4;
    // WRONG: x & 1 == 0 evaluates as x & (1 == 0) -> x & 0 -> 0
    // CORRECT: parenthesize bitwise expression
    if ((x & 1) == 0) {
        cout << x << " is even." << endl;
    }

    // WRONG: 1 << 35 overflows 32-bit integer
    // CORRECT: use 1LL for 64-bit integer literal
    long long mask64 = 1LL << 35;
    cout << "64-bit mask valid: " << boolalpha << (mask64 > 0) << endl;

    // WRONG: while (n != 0) with n >>= 1 on negative numbers loops forever
    // CORRECT: cast to unsigned int for logical right shifting
    int neg = -8;
    unsigned int u = static_cast<unsigned int>(neg);
    int bitCount = 0;
    while (u > 0) {
        bitCount += (u & 1);
        u >>= 1;
    }
    cout << "Set bits in negative number: " << bitCount << endl;
    return 0;
}`,
          java: `public class Main {
    public static void main(String[] args) {
        int x = 4;
        // WRONG: x & 1 == 0 evaluates as x & (1 == 0)
        // CORRECT: parenthesize bitwise expression
        if ((x & 1) == 0) {
            System.out.println(x + " is even.");
        }

        // WRONG: 1 << 35 overflows 32-bit integer
        // CORRECT: use 1L for 64-bit integer literal
        long mask64 = 1L << 35;
        System.out.println("64-bit mask valid: " + (mask64 > 0));

        // WRONG: neg >>= 1 keeps -1 perpetually
        // CORRECT: use >>>= for logical unsigned right shift
        int neg = -8;
        int bitCount = 0;
        int u = neg;
        while (u != 0) {
            bitCount += (u & 1);
            u >>>= 1;
        }
        System.out.println("Set bits in negative number: " + bitCount);
    }
}`,
          python: `x = 4
# WRONG: x & 1 == 0 evaluates as x & (1 == 0)
# CORRECT: parenthesize bitwise expression
if (x & 1) == 0:
    print(f"{x} is even.")

# Python arbitrary-precision ints do not overflow,
# but precedence rules remain identical:
mask64 = 1 << 35
print("64-bit mask valid:", mask64 > 0)

# Negative numbers maintain sign bits; mask with 0xFFFFFFFF
# to simulate 32-bit unsigned logical shift:
neg = -8
u = neg & 0xFFFFFFFF
bit_count = 0
while u > 0:
    bit_count += (u & 1)
    u >>= 1
print("Set bits in negative number:", bit_count)`,
        },
        output: '4 is even.\n64-bit mask valid: true\nSet bits in negative number: 29',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Parenthesize every bitwise calculation',
        body: 'In the C operator grammar, bitwise operators were placed below equality operators. This design was preserved across C++, Java, and Python. Expressions such as `a & b == c` and `a | b != c` never execute in the order a human reader expects without explicit parentheses. Treat parentheses as mandatory around every bitwise operator.',
      },
    ],
    keyTakeaways: [
      'Equality and relational operators (`==`, `!=`, `<`, `>`) take precedence over `&`, `|`, and `^`. Always wrap bitwise expressions in parentheses.',
      { cpp: 'Literal `1` is a 32-bit `int`; to shift by 32 or more positions write `1LL << k`.', java: 'Literal `1` is a 32-bit `int`; to shift by 32 or more positions write `1L << k`.', python: 'Integers are unbounded, so `1 << k` is exact for any k; the trap is instead forgetting to mask when a problem expects 32-bit wrap-around.' },
      'Arithmetic right shifting replicates the sign bit on negative integers; use unsigned types or logical shifts (`>>>`, `& 0xFFFFFFFF`) to avoid infinite loops.',
    ],
    practice: {
      prompt: 'Calculate the sum of two integers a and b using bitwise operators, without using the arithmetic operators + or -.',
      leetcode: { title: 'Sum of Two Integers', slug: 'sum-of-two-integers' },
    },
  },
];
