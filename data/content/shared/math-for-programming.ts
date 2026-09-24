import type { SharedLesson } from './types';

/**
 * Math You Need for Programming — placed after Control Flow, so every lesson
 * ends in a loop the reader can already write. Nothing here needs more than
 * school arithmetic; the point is to see how each idea turns into code and
 * where the computer's version differs from the blackboard version.
 */
export const lessons: SharedLesson[] = [
  // -------------------------------------------------------------------------
  {
    sub: 1,
    summary: 'Use whole-number division and remainder together to split a quantity into groups and leftovers.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'Dividing 17 by 5 gives 3 remainder 2: three full fives, and two left over. In school the remainder is a footnote. In programming it is half the story, because the two results answer two different questions. **How many full groups?** is division. **What is left over?** is remainder, written `%` and called modulo.',
      },
      {
        kind: 'table',
        headers: ['Question', 'Operation', '17 and 5'],
        rows: [
          ['How many full groups of 5 fit in 17?', { cpp: '`17 / 5`', java: '`17 / 5`', python: '`17 // 5`' }, '3'],
          ['What is left after taking those groups out?', '`17 % 5`', '2'],
        ],
      },
      {
        kind: 'text',
        body: 'They always fit together: groups × divisor + remainder = original. 3 × 5 + 2 = 17. If your two results do not satisfy that, one of them is wrong.',
      },
      {
        kind: 'code',
        caption: 'Convert a number of minutes into hours and minutes',
        code: {
          cpp: `int total = 135;
int hours = total / 60;     // 2
int minutes = total % 60;   // 15
cout << hours << "h " << minutes << "m" << endl;`,
          java: `int total = 135;
int hours = total / 60;     // 2
int minutes = total % 60;   // 15
System.out.println(hours + "h " + minutes + "m");`,
          python: `total = 135
hours = total // 60     # 2
minutes = total % 60    # 15
print(f"{hours}h {minutes}m")`,
        },
        output: '2h 15m',
      },
      { kind: 'heading', text: 'Where you will see this' },
      {
        kind: 'text',
        body: 'Turning seconds into h:m:s. Turning a flat position into a row and column of a grid: position 7 in a 3-wide grid is row `7 / 3 = 2`, column `7 % 3 = 1`. Stepping around a circle of n seats: after seat n - 1 comes seat `(n - 1 + 1) % n = 0`. Getting the last digit of a number: `n % 10`. Dropping the last digit: `n / 10`.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Remainder by zero is a crash',
        body: '`x % 0` and `x / 0` stop the program with a runtime error, in every language. Whenever the divisor is a variable, ask yourself whether it can be zero, and check before dividing.',
      },
    ],
    keyTakeaways: [
      'Division gives how many full groups; `%` gives what is left over.',
      'groups × divisor + remainder = original, always.',
      'Grid positions, clocks, circular seating and digit extraction are all division and remainder.',
    ],
    practice: {
      prompt: 'Read a number of seconds and print it as hours, minutes and seconds. Then read a position p and a width w, and print the row and column of p in a grid w cells wide, counting from 0.',
    },
  },
  // -------------------------------------------------------------------------
  {
    sub: 2,
    summary: 'Predict what % gives for negative numbers, which differs between languages and causes silent bugs.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'What is -7 % 3? Mathematics has one convention, programming languages have two, and they disagree. Get this wrong and a program that works for positive input quietly gives a wrong answer the first time a negative number appears, which on LeetCode means a hidden test case fails.',
      },
      {
        kind: 'text',
        body: {
          cpp: 'C++ rounds the division **towards zero**, and the remainder takes the sign of the left operand. `-7 / 3` is -2 (not -3), and `-7 % 3` is -1, because -2 × 3 + (-1) = -7. So `%` can return a negative number.',
          java: 'Java rounds the division **towards zero**, and the remainder takes the sign of the left operand. `-7 / 3` is -2 (not -3), and `-7 % 3` is -1, because -2 × 3 + (-1) = -7. So `%` can return a negative number.',
          python: 'Python rounds the division **down** (towards negative infinity), and the remainder takes the sign of the divisor. `-7 // 3` is -3, and `-7 % 3` is 2, because -3 × 3 + 2 = -7. So `%` with a positive divisor is never negative.',
        },
      },
      {
        kind: 'table',
        headers: ['Expression', 'C++ / Java', 'Python', 'Note'],
        rows: [
          ['`7 % 3`', '1', '1', 'Same for positives'],
          ['`-7 % 3`', '-1', '2', 'Differs!'],
          ['`7 % -3`', '1', '-2', 'Differs!'],
          ['`-7 % -3`', '-1', '-1', 'Same'],
        ],
      },
      { kind: 'heading', text: 'Why it matters' },
      {
        kind: 'text',
        body: 'The usual reason to use `%` is to wrap an index around: position `i % n` is always a valid index from 0 to n - 1. That is true only if the result is never negative. Stepping backwards from index 0 by one gives `-1 % n`, and in a language where that is -1, you have an invalid index and a crash or garbage.',
      },
      {
        kind: 'code',
        caption: 'A wrap-around that is safe for negative values',
        code: {
          cpp: `// Step back k positions in a circle of n, safely
int idx = ((i - k) % n + n) % n;`,
          java: `// Step back k positions in a circle of n, safely
int idx = ((i - k) % n + n) % n;
// or: Math.floorMod(i - k, n)`,
          python: `# Python's % already gives 0..n-1 for positive n
idx = (i - k) % n`,
        },
      },
      {
        kind: 'text',
        body: {
          cpp: 'The `((x % n) + n) % n` pattern: the first `%` brings x into the range -(n-1) to n-1, adding n makes it positive, the second `%` brings it back under n. Memorise it; it appears in every circular buffer and every modular-arithmetic problem.',
          java: 'The `((x % n) + n) % n` pattern: the first `%` brings x into the range -(n-1) to n-1, adding n makes it positive, the second `%` brings it back under n. `Math.floorMod` does the same in one call. Use one or the other whenever the left side can be negative.',
          python: 'Python’s behaviour is the convenient one here, but be aware of it when reading solutions written in other languages, and when a problem asks for the C-style result.',
        },
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Even/odd test on negatives',
        body: {
          cpp: 'Testing `n % 2 == 1` for odd fails for negative odd numbers, because `-3 % 2` is -1. Test `n % 2 != 0` instead. It is correct for every sign.',
          java: 'Testing `n % 2 == 1` for odd fails for negative odd numbers, because `-3 % 2` is -1. Test `n % 2 != 0` instead. It is correct for every sign.',
          python: '`n % 2 == 1` works for negatives in Python, but `n % 2 != 0` is the habit to build, because it is correct in every language you will read.',
        },
      },
    ],
    keyTakeaways: [
      { cpp: 'In C++, `%` takes the sign of the left operand, so `-7 % 3` is -1.', java: 'In Java, `%` takes the sign of the left operand, so `-7 % 3` is -1.', python: 'In Python, `%` takes the sign of the divisor, so `-7 % 3` is 2.' },
      'Wrap-around indices must never be negative; use `((x % n) + n) % n` where needed.',
      'Test odd with `n % 2 != 0`, never `== 1`.',
    ],
    practice: {
      prompt: 'Without running it, fill in a table of x % 4 for x from -6 to 6 in your language. Then run a loop to check. Then write a function that, given i and n, returns the index i - 1 with wrap-around, and test it with i = 0.',
    },
  },
  // -------------------------------------------------------------------------
  {
    sub: 3,
    summary: 'Take a number apart digit by digit, and put it back together reversed.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A number is not a list of digits to the computer; 4721 is one value. To work with its digits you have to peel them off, and there is exactly one trick for that: `% 10` gives the last digit, and dividing by 10 removes it. Repeat until nothing is left.',
      },
      {
        kind: 'table',
        headers: ['n', 'n % 10', 'n after dividing by 10'],
        rows: [
          ['4721', '1', '472'],
          ['472', '2', '47'],
          ['47', '7', '4'],
          ['4', '4', '0'],
          ['0', 'stop', ''],
        ],
      },
      {
        kind: 'code',
        caption: 'Sum of the digits',
        code: {
          cpp: `int n = 4721, sum = 0;
while (n > 0) {
    sum += n % 10;   // add last digit
    n /= 10;         // drop it
}
cout << sum << endl;`,
          java: `int n = 4721, sum = 0;
while (n > 0) {
    sum += n % 10;   // add last digit
    n /= 10;         // drop it
}
System.out.println(sum);`,
          python: `n, total = 4721, 0
while n > 0:
    total += n % 10   # add last digit
    n //= 10          # drop it
print(total)`,
        },
        output: '14',
      },
      { kind: 'heading', text: 'Reversing a number' },
      {
        kind: 'text',
        body: 'To rebuild a number from digits, do the opposite of peeling: multiply what you have by 10 and add the next digit. Combined with peeling from the right, the digits come out in reverse order, which is exactly what reversing needs.',
      },
      {
        kind: 'code',
        caption: 'Reverse the digits',
        code: {
          cpp: `int n = 4721, rev = 0;
while (n > 0) {
    rev = rev * 10 + n % 10;
    n /= 10;
}
cout << rev << endl;`,
          java: `int n = 4721, rev = 0;
while (n > 0) {
    rev = rev * 10 + n % 10;
    n /= 10;
}
System.out.println(rev);`,
          python: `n, rev = 4721, 0
while n > 0:
    rev = rev * 10 + n % 10
    n //= 10
print(rev)`,
        },
        output: '1274',
      },
      {
        kind: 'text',
        body: 'Trace it: rev goes 0 → 1 → 12 → 127 → 1274. Each step shifts the existing digits left by multiplying by 10, then drops the new digit into the empty units place. Counting digits is the same loop with `count += 1` instead; a number’s digit count is also how many times you can divide it by 10 before reaching 0.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Reversal can overflow, and 0 has one digit',
        body: {
          cpp: 'Reversing 1534236469 gives 9646324351, which does not fit in an `int` (max about 2.1 billion). LeetCode’s Reverse Integer is that exact trap. Use `long long` for `rev`, or check before each step. Separately, the loop above says 0 has zero digits; if that matters, treat n = 0 specially.',
          java: 'Reversing 1534236469 gives 9646324351, which does not fit in an `int` (max about 2.1 billion). LeetCode’s Reverse Integer is that exact trap. Use `long` for `rev`, or check before each step. Separately, the loop above says 0 has zero digits; if that matters, treat n = 0 specially.',
          python: 'Python integers never overflow, so the reversal is safe here, but LeetCode’s Reverse Integer asks you to return 0 when the result would not fit in a 32-bit int, so you still have to check. Separately, the loop above says 0 has zero digits; if that matters, treat n = 0 specially.',
        },
      },
    ],
    keyTakeaways: [
      '`n % 10` is the last digit; dividing by 10 drops it. Loop while n > 0.',
      'Rebuild a number with `rev = rev * 10 + digit`.',
      'Reversed numbers can overflow a 32-bit int; n = 0 needs special handling.',
    ],
    practice: {
      prompt: 'Write a program that reads n and prints whether it is a palindrome number (reads the same backwards), without converting it to text. Then count how many digits of n are even.',
      leetcode: { title: 'Palindrome Number', slug: 'palindrome-number' },
    },
  },
  // -------------------------------------------------------------------------
  {
    sub: 4,
    summary: 'Test divisibility with %, and use it to count multiples and find divisors.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: '"a is divisible by b" means dividing leaves nothing over: `a % b == 0`. That one test is behind even/odd checks, FizzBuzz, leap years, finding divisors and checking primes. Everything in this lesson is a variation on it.',
      },
      {
        kind: 'table',
        headers: ['Question', 'Test'],
        rows: [
          ['Is n even?', '`n % 2 == 0`'],
          ['Is n a multiple of 5?', '`n % 5 == 0`'],
          ['Is n divisible by both 3 and 5?', '`n % 15 == 0`  (or `n % 3 == 0 && n % 5 == 0`)'],
          ['Is n divisible by 3 or 5?', '`n % 3 == 0 || n % 5 == 0`'],
          ['Is n a divisor of m?', '`m % n == 0`'],
        ],
      },
      { kind: 'heading', text: 'Finding all divisors' },
      {
        kind: 'text',
        body: 'The divisors of 36 are 1, 2, 3, 4, 6, 9, 12, 18, 36. The direct way is to test every number from 1 to n. That is n tests, which is fine for small n and too slow for n around a billion. The observation that fixes it: divisors come in pairs. If d divides n, so does n / d. Test only d up to the square root of n, and add both d and n / d each time.',
      },
      {
        kind: 'code',
        caption: 'Divisors in pairs, testing only up to the square root',
        code: {
          cpp: `int n = 36;
for (int d = 1; d * d <= n; d++) {
    if (n % d == 0) {
        cout << d << " ";
        if (d != n / d) cout << n / d << " ";   // avoid printing 6 twice
    }
}`,
          java: `int n = 36;
for (int d = 1; d * d <= n; d++) {
    if (n % d == 0) {
        System.out.print(d + " ");
        if (d != n / d) System.out.print(n / d + " ");  // avoid printing 6 twice
    }
}`,
          python: `n = 36
for d in range(1, int(n ** 0.5) + 1):
    if n % d == 0:
        print(d, end=" ")
        if d != n // d:
            print(n // d, end=" ")   # avoid printing 6 twice`,
        },
        output: '1 36 2 18 3 12 4 9 6',
      },
      {
        kind: 'text',
        body: 'For n = 10⁹ the naive loop runs a billion times; this one runs about 31,623 times. The condition `d * d <= n` avoids computing a square root at all, and is exact where a floating-point square root might be off by a rounding error.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Counting multiples without a loop',
        body: 'How many multiples of 7 are there from 1 to n? Not a loop: it is `n / 7` (whole-number division). Multiples of 7 between a and b inclusive: `b / 7 - (a - 1) / 7`. When a problem says "count the multiples", this formula is the intended solution.',
      },
    ],
    keyTakeaways: [
      '`a % b == 0` means b divides a.',
      'Divisors come in pairs (d, n / d); test only up to the square root.',
      'Count multiples of k up to n with `n / k`, not a loop.',
    ],
    practice: {
      prompt: 'Print all numbers from 1 to 100 that are divisible by 7 but not by 3. Then read n and print its number of divisors using the square-root method; check that 36 gives 9 and 49 gives 3.',
    },
  },
  // -------------------------------------------------------------------------
  {
    sub: 5,
    summary: 'Compute the greatest common divisor with Euclid’s algorithm and derive the LCM from it.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'The **greatest common divisor** (GCD) of two numbers is the largest number that divides both. GCD(12, 18) is 6. Euclid found an algorithm for it 2,300 years ago, and it is still the one every programmer uses, because it is short and fast: three lines that take about 30 steps even for numbers in the billions.',
      },
      {
        kind: 'text',
        body: 'The idea: GCD(a, b) is the same as GCD(b, a % b). The remainder is smaller than b, so the numbers shrink every step, and when the remainder reaches 0, the other number is the answer.',
      },
      {
        kind: 'table',
        headers: ['a', 'b', 'a % b'],
        rows: [
          ['48', '18', '12'],
          ['18', '12', '6'],
          ['12', '6', '0'],
          ['6', '0', 'stop: GCD is 6'],
        ],
      },
      {
        kind: 'code',
        caption: 'Euclid’s algorithm',
        code: {
          cpp: `int gcd(int a, int b) {
    while (b != 0) {
        int r = a % b;
        a = b;
        b = r;
    }
    return a;
}
// C++17 also has std::gcd in <numeric>`,
          java: `static int gcd(int a, int b) {
    while (b != 0) {
        int r = a % b;
        a = b;
        b = r;
    }
    return a;
}`,
          python: `def gcd(a, b):
    while b != 0:
        a, b = b, a % b
    return a

# The standard library has math.gcd`,
        },
      },
      { kind: 'heading', text: 'LCM from GCD' },
      {
        kind: 'text',
        body: 'The **least common multiple** (LCM) is the smallest number both divide into. LCM(4, 6) is 12. There is no separate algorithm: `lcm = a / gcd(a, b) * b`. Divide first, then multiply, so the intermediate value stays small; `a * b / gcd` gives the same answer mathematically but `a * b` can overflow before the division happens.',
      },
      {
        kind: 'code',
        caption: 'LCM, overflow-aware',
        code: {
          cpp: `long long lcm(long long a, long long b) {
    return a / gcd(a, b) * b;
}`,
          java: `static long lcm(long a, long b) {
    return a / gcd(a, b) * b;
}`,
          python: `def lcm(a, b):
    return a // gcd(a, b) * b`,
        },
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Where GCD shows up',
        body: 'Reducing a fraction to lowest terms (divide top and bottom by their GCD). Checking whether two numbers share a factor (GCD > 1). Splitting a rectangle into the largest possible equal squares (side = GCD of the sides). GCD of a whole list: fold it in, `g = gcd(g, x)` for each x.',
      },
    ],
    keyTakeaways: [
      'GCD(a, b) = GCD(b, a % b); stop when b is 0.',
      'LCM = a / GCD × b, dividing first to avoid overflow.',
      'GCD of a list: start with the first element and fold the rest in.',
    ],
    practice: {
      prompt: 'Read two numbers and print their GCD and LCM. Then read a fraction as two numbers and print it in lowest terms. Then read n numbers and print the GCD of all of them.',
    },
  },
  // -------------------------------------------------------------------------
  {
    sub: 6,
    summary: 'Test whether a number is prime by trial division up to its square root.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A **prime** is a whole number greater than 1 whose only divisors are 1 and itself. 2, 3, 5, 7, 11 are prime; 9 is not (3 × 3); 1 is not prime by definition. Testing primality is the first algorithm most people write where the obvious version is too slow and a small piece of reasoning makes it fast.',
      },
      {
        kind: 'text',
        body: 'The obvious version: try every d from 2 to n - 1 and see if any divides n. For n = 10⁹ that is a billion tests, several seconds. The reasoning: if n = a × b, then one of a and b is at most √n. So if no number up to √n divides n, nothing larger will either (its partner would have been smaller and already found). Test only up to √n: 31,623 tests instead of a billion.',
      },
      {
        kind: 'code',
        caption: 'Primality by trial division',
        code: {
          cpp: `bool isPrime(long long n) {
    if (n < 2) return false;
    for (long long d = 2; d * d <= n; d++) {
        if (n % d == 0) return false;
    }
    return true;
}`,
          java: `static boolean isPrime(long n) {
    if (n < 2) return false;
    for (long d = 2; d * d <= n; d++) {
        if (n % d == 0) return false;
    }
    return true;
}`,
          python: `def is_prime(n):
    if n < 2:
        return False
    d = 2
    while d * d <= n:
        if n % d == 0:
            return False
        d += 1
    return True`,
        },
      },
      {
        kind: 'text',
        body: 'The `return false` inside the loop is an early exit: the moment one divisor is found, the answer is known and the rest of the loop is pointless. The final `return true` is reached only if the loop finished without finding any.',
      },
      {
        kind: 'table',
        headers: ['n', 'd tested', 'Result'],
        rows: [
          ['1', 'none: caught by n < 2', 'not prime'],
          ['2', 'none: 2 × 2 > 2', 'prime'],
          ['9', '2 (no), 3 (9 % 3 == 0)', 'not prime'],
          ['29', '2, 3, 4, 5 (5 × 5 = 25 ≤ 29), then 6 × 6 > 29', 'prime'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Twice as fast for free',
        body: 'After checking d = 2, every other even d is pointless: if 2 did not divide n, 4 and 6 will not either. Check 2 separately, then loop d = 3, 5, 7, ... in steps of 2. Half the work. When you need to test many numbers rather than one, a completely different approach, the sieve, is faster still and is covered in the number theory chapter.',
      },
    ],
    keyTakeaways: [
      'A divisor pair always has one member at most √n, so test only up to √n.',
      'Use `d * d <= n` rather than a floating-point square root.',
      'Return early the moment a divisor is found; handle n < 2 first.',
    ],
    practice: {
      prompt: 'Print all primes from 2 to 100. Then read n and print the smallest prime greater than n. Then count how many primes are below 100,000 and time it; think about why the sieve would be faster.',
      leetcode: { title: 'Count Primes', slug: 'count-primes' },
    },
  },
  // -------------------------------------------------------------------------
  {
    sub: 7,
    summary: 'Compute factorials with a loop and see exactly where they stop fitting in an integer.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'n **factorial**, written n!, is 1 × 2 × 3 × ... × n. 5! is 120. It counts the ways to arrange n things in a row, which is why it turns up in probability and counting problems. It is also the standard example of a value that grows faster than any container can hold.',
      },
      {
        kind: 'code',
        caption: 'Factorial with a loop',
        code: {
          cpp: `long long fact = 1;
for (int i = 2; i <= n; i++) {
    fact *= i;
}
cout << fact << endl;`,
          java: `long fact = 1;
for (int i = 2; i <= n; i++) {
    fact *= i;
}
System.out.println(fact);`,
          python: `fact = 1
for i in range(2, n + 1):
    fact *= i
print(fact)`,
        },
        output: '120   (for n = 5)',
      },
      { kind: 'heading', text: 'How fast it grows' },
      {
        kind: 'table',
        headers: ['n', 'n!', 'Fits in'],
        rows: [
          ['10', '3,628,800', '32-bit int'],
          ['12', '479,001,600', '32-bit int (last one that does)'],
          ['13', '6,227,020,800', '64-bit only'],
          ['20', '2,432,902,008,176,640,000', '64-bit (last one that does)'],
          ['21', '51,090,942,171,709,440,000', 'nothing built in'],
        ],
      },
      {
        kind: 'text',
        body: {
          cpp: 'An `int` holds up to about 2.1 × 10⁹, so 13! already overflows it. `long long` holds up to about 9.2 × 10¹⁸, so 21! overflows that. Overflow does not produce an error; the number silently wraps around into something wrong, often negative. That is why the code above uses `long long`, and why factorial problems on LeetCode almost always ask for the answer modulo 10⁹ + 7, covered at the end of this chapter.',
          java: 'An `int` holds up to about 2.1 × 10⁹, so 13! already overflows it. `long` holds up to about 9.2 × 10¹⁸, so 21! overflows that. Overflow does not produce an error; the number silently wraps around into something wrong, often negative. That is why the code above uses `long`, and why factorial problems on LeetCode almost always ask for the answer modulo 10⁹ + 7, covered at the end of this chapter.',
          python: 'Python integers grow as large as memory allows, so `fact` is exact for any n. That is convenient, but 1000! has 2,568 digits and every multiplication on it is slow. It is also why LeetCode problems ask for the answer modulo 10⁹ + 7 in every language: it keeps numbers small. That is covered at the end of this chapter.',
        },
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Overflow is silent',
        body: {
          cpp: 'Compute 13! in an `int` and you get 1932053504, a plausible-looking wrong number. No warning, no crash. Whenever you multiply inside a loop, work out roughly how big the result can get, and pick `long long` when in doubt.',
          java: 'Compute 13! in an `int` and you get 1932053504, a plausible-looking wrong number. No warning, no crash. Whenever you multiply inside a loop, work out roughly how big the result can get, and pick `long` when in doubt.',
          python: 'Python will not overflow, but LeetCode’s expected answers are computed with fixed-size integers. When a problem says "the answer fits in a 32-bit integer" it is telling you the intended solution never exceeds that; if yours does, you have misread the problem.',
        },
      },
    ],
    keyTakeaways: [
      'n! = 1 × 2 × ... × n, built with one loop.',
      '12! is the last factorial that fits in 32 bits; 20! the last in 64 bits.',
      'Overflow wraps silently. Estimate the size of products before choosing a type.',
    ],
    practice: {
      prompt: 'Print n! for n from 1 to 25 using a 64-bit integer and find the first n where the printed value is visibly wrong. Then print the number of trailing zeros in 25! by counting how many times the result divides by 10; think about why the answer is 6.',
      leetcode: { title: 'Factorial Trailing Zeroes', slug: 'factorial-trailing-zeroes' },
    },
  },
  // -------------------------------------------------------------------------
  {
    sub: 8,
    summary: 'Recognise powers of two and understand why they are the rhythm of everything a computer does.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'Computers count in twos. A single wire is on or off, one **bit**; two bits give four combinations, three give eight, and n bits give 2ⁿ. So the sizes of everything, from integer ranges to memory, are powers of two, and the sequence 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024 is worth knowing by heart.',
      },
      {
        kind: 'table',
        headers: ['Power', 'Value', 'Where you meet it'],
        rows: [
          ['2⁸', '256', 'one byte: 0 to 255'],
          ['2¹⁰', '1,024', '"1K"; close enough to a thousand for estimates'],
          ['2¹⁶', '65,536', 'range of a 16-bit number'],
          ['2²⁰', '1,048,576', '"1M"; about a million'],
          ['2³¹', '2,147,483,648', 'one past the largest 32-bit signed int'],
          ['2³²', '4,294,967,296', 'number of distinct 32-bit values'],
          ['2⁶³', '≈ 9.2 × 10¹⁸', 'one past the largest 64-bit signed int'],
        ],
      },
      { kind: 'heading', text: 'Doubling and halving' },
      {
        kind: 'text',
        body: 'Multiplying by 2 adds one to the power; dividing by 2 subtracts one. Starting from 1 and doubling reaches a million in 20 steps. Starting from a million and halving reaches 1 in 20 steps. That second fact is the heart of binary search and of every algorithm described as "logarithmic": cutting a problem in half repeatedly finishes in about log₂ n steps, and log₂ of a million is only 20.',
      },
      {
        kind: 'code',
        caption: 'Count how many halvings it takes to reach 1',
        code: {
          cpp: `int n = 1000000, steps = 0;
while (n > 1) {
    n /= 2;
    steps++;
}
cout << steps << endl;`,
          java: `int n = 1000000, steps = 0;
while (n > 1) {
    n /= 2;
    steps++;
}
System.out.println(steps);`,
          python: `n, steps = 1000000, 0
while n > 1:
    n //= 2
    steps += 1
print(steps)`,
        },
        output: '19',
      },
      {
        kind: 'text',
        body: 'The answer is 19 rather than 20 because whole-number halving of 1,000,000 reaches 1 after 19 steps (2¹⁹ = 524,288 < 10⁶ < 2²⁰). The precise value rarely matters; what matters is that it is tiny. A loop that halves its input is a loop that runs a few dozen times no matter how large the input is.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Is n a power of two?',
        body: 'Keep dividing by 2 while it divides evenly; n is a power of two if you end at exactly 1. The bit manipulation chapter shows a one-line version, `n & (n - 1) == 0`, which is the one interviewers expect.',
      },
    ],
    keyTakeaways: [
      'Know 2¹ to 2¹⁰ by heart, and that 2¹⁰ ≈ a thousand, 2²⁰ ≈ a million, 2³⁰ ≈ a billion.',
      'The 32-bit signed int limit is 2³¹ - 1 ≈ 2.1 billion; 64-bit is 2⁶³ - 1 ≈ 9.2 × 10¹⁸.',
      'Halving reaches 1 in about log₂ n steps; log₂ of a million is 20.',
    ],
    practice: {
      prompt: 'Print the powers of two from 2⁰ up to the largest that fits in a 32-bit int, one per line, using a loop that doubles. Then write a function that returns whether n is a power of two using repeated halving, and test it on 1, 2, 3, 64, 96 and 1024.',
      leetcode: { title: 'Power of Two', slug: 'power-of-two' },
    },
  },
  // -------------------------------------------------------------------------
  {
    sub: 9,
    summary: 'Convert between decimal, binary and hexadecimal by hand and in code.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Decimal, the system you use every day, has ten digits and each position is worth ten times the one to its right: 472 is 4 hundreds, 7 tens, 2 units. **Binary** has two digits and each position is worth twice the one to its right. **Hexadecimal** has sixteen (0-9 then A-F) and each position is worth sixteen times. Same idea, different base. The number is the same; only its written form changes.',
      },
      {
        kind: 'table',
        headers: ['Decimal', 'Binary', 'Hexadecimal'],
        rows: [
          ['0', '0', '0'],
          ['5', '101', '5'],
          ['10', '1010', 'A'],
          ['15', '1111', 'F'],
          ['16', '10000', '10'],
          ['255', '11111111', 'FF'],
        ],
      },
      { kind: 'heading', text: 'Decimal to binary: repeated division' },
      {
        kind: 'text',
        body: 'Divide by 2, write down the remainder, repeat with the quotient until it is 0. The remainders, read **backwards**, are the binary digits. For 13: 13 / 2 = 6 r 1, 6 / 2 = 3 r 0, 3 / 2 = 1 r 1, 1 / 2 = 0 r 1. Remainders 1, 0, 1, 1; backwards: 1101. This is the digit-peeling loop from earlier in the chapter, with 2 in place of 10.',
      },
      {
        kind: 'code',
        caption: 'Decimal to binary as text, and the built-in way',
        code: {
          cpp: `int n = 13;
string bits = "";
while (n > 0) {
    bits = char('0' + n % 2) + bits;   // prepend the remainder
    n /= 2;
}
cout << bits << endl;                    // 1101
// Built in: bitset<8>(13) prints 00001101`,
          java: `int n = 13;
String bits = "";
while (n > 0) {
    bits = (n % 2) + bits;   // prepend the remainder
    n /= 2;
}
System.out.println(bits);    // 1101
// Built in: Integer.toBinaryString(13) -> "1101"`,
          python: `n = 13
bits = ""
while n > 0:
    bits = str(n % 2) + bits   # prepend the remainder
    n //= 2
print(bits)                    # 1101
# Built in: bin(13) -> '0b1101', format(13, 'b') -> '1101'`,
        },
        output: '1101',
      },
      { kind: 'heading', text: 'Binary to decimal: multiply and add' },
      {
        kind: 'text',
        body: 'Read the digits left to right, keeping a running value: double it and add the digit. For 1101: 0 → 1 → 2 + 1 = 3 → 6 + 0 = 6 → 12 + 1 = 13. This is `rev = rev * 10 + digit` with 2 in place of 10. Hexadecimal works the same with 16, with A to F standing for 10 to 15.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Why hexadecimal exists',
        body: 'One hex digit is exactly four binary digits, so a byte is exactly two hex digits: 11111111 is FF. Programmers write hex because it is a compact way to write binary, not because they think in sixteens. If you can convert each hex digit to four bits in your head (A = 1010, F = 1111), you can read any hex value as binary.',
      },
    ],
    keyTakeaways: [
      'A base says how much each position is worth: 10, 2 or 16. The number itself does not change.',
      'To binary: divide by 2, collect remainders, read backwards. To decimal: double and add.',
      'One hex digit is four bits; a byte is two hex digits.',
    ],
    practice: {
      prompt: 'Convert 37, 64 and 100 to binary by hand, then check with the program. Then write the reverse: read a binary string and print its decimal value using multiply-and-add. Then extend it to accept hexadecimal, mapping A-F to 10-15.',
      leetcode: { title: 'Convert a Number to Hexadecimal', slug: 'convert-a-number-to-hexadecimal' },
    },
  },
  // -------------------------------------------------------------------------
  {
    sub: 10,
    summary: 'Understand why 0.1 + 0.2 is not 0.3 and how to compare decimals safely.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Type `0.1 + 0.2 == 0.3` into any of these languages and the answer is false. This is not a bug in the language. It is the nature of how computers store decimals, and once you see why, you will know when it can bite you and how to avoid it.',
      },
      {
        kind: 'text',
        body: 'Decimals are stored in binary. Some fractions are exact in binary: 0.5 is 0.1 in binary, 0.25 is 0.01. But 0.1 in binary is 0.000110011001100... repeating forever, the way 1/3 is 0.3333... in decimal. The computer keeps about 16 significant digits and rounds the rest. So 0.1 is stored as something very slightly off, and adding two slightly-off values gives a result that is slightly off in a different way from 0.3.',
      },
      {
        kind: 'code',
        caption: 'The famous example',
        code: {
          cpp: `double a = 0.1 + 0.2;
cout << (a == 0.3) << endl;           // 0 (false)
cout << setprecision(20) << a << endl; // 0.30000000000000004441`,
          java: `double a = 0.1 + 0.2;
System.out.println(a == 0.3);   // false
System.out.println(a);          // 0.30000000000000004`,
          python: `a = 0.1 + 0.2
print(a == 0.3)   # False
print(a)          # 0.30000000000000004`,
        },
      },
      { kind: 'heading', text: 'The two rules' },
      {
        kind: 'text',
        body: '**Never compare decimals with `==`.** Instead ask whether they are close: is the absolute difference smaller than some tiny tolerance, usually written `eps` (for epsilon), like 1e-9. **Prefer integers whenever you can.** Money in paise rather than rupees, percentages as whole numbers, lengths in millimetres. Integers are exact; decimals are approximations.',
      },
      {
        kind: 'code',
        caption: 'Comparing with a tolerance',
        code: {
          cpp: `const double EPS = 1e-9;
bool same = fabs(a - 0.3) < EPS;   // true`,
          java: `final double EPS = 1e-9;
boolean same = Math.abs(a - 0.3) < EPS;   // true`,
          python: `EPS = 1e-9
same = abs(a - 0.3) < EPS   # True
# or: math.isclose(a, 0.3)`,
        },
      },
      {
        kind: 'table',
        headers: ['Situation', 'What to do'],
        rows: [
          ['Checking if two computed decimals are equal', 'Compare `abs(x - y) < 1e-9`'],
          ['Money, counts, indices', 'Use integers; convert only for display'],
          ['Problem says "answers within 1e-5 are accepted"', 'The judge is using a tolerance; you can use doubles'],
          ['Averages, ratios, square roots', 'Use `double`; expect tiny errors; do not test `== 0`'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Integer division hidden inside a decimal formula',
        body: {
          cpp: '`double avg = (a + b) / 2;` with `int` a and b divides as integers first and then converts the already-truncated result. Write `(a + b) / 2.0`. The same trap applies to percentages: `count * 100 / total` truncates; `count * 100.0 / total` does not.',
          java: '`double avg = (a + b) / 2;` with `int` a and b divides as integers first and then converts the already-truncated result. Write `(a + b) / 2.0`. The same trap applies to percentages: `count * 100 / total` truncates; `count * 100.0 / total` does not.',
          python: 'Python’s `/` always gives a float, so this specific trap does not exist. The opposite one does: `//` on floats gives a float with a whole value, `7.0 // 2` is `3.0`, which then cannot be used as a list index.',
        },
      },
    ],
    keyTakeaways: [
      'Most decimals cannot be stored exactly in binary; results are off in the 16th digit.',
      'Compare decimals with a tolerance, never `==`.',
      'Use integers whenever the quantity allows it.',
    ],
    practice: {
      prompt: 'Add 0.1 to itself ten times in a loop and print whether the result equals 1.0. Then fix the comparison with a tolerance. Then compute the same thing using integers (add 1 ten times, compare to 10) and note that no tolerance is needed.',
    },
  },
  // -------------------------------------------------------------------------
  {
    sub: 11,
    summary: 'Replace a loop with a closed-form sum, and know the three formulas that come up constantly.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'Adding the numbers from 1 to n with a loop takes n steps. There is a formula that takes one: n(n + 1) / 2. For n = 100 the loop does 100 additions and the formula does one multiplication and one division. For n = 10⁹ the loop takes seconds and the formula still takes nothing. Recognising when a loop is secretly a formula is a skill that turns Time Limit Exceeded into Accepted.',
      },
      {
        kind: 'text',
        body: 'Why it works: pair the first and last (1 + 100 = 101), the second and second-last (2 + 99 = 101), and so on. There are 50 pairs, each worth 101. 50 × 101 = 5050 = 100 × 101 / 2. For an odd n the middle number pairs with itself and the formula still holds.',
      },
      {
        kind: 'table',
        headers: ['Sum', 'Formula', 'n = 10'],
        rows: [
          ['1 + 2 + ... + n', 'n(n + 1) / 2', '55'],
          ['1² + 2² + ... + n²', 'n(n + 1)(2n + 1) / 6', '385'],
          ['1 + 2 + 4 + ... + 2ⁿ', '2ⁿ⁺¹ - 1', '2047'],
          ['a + (a+d) + ... for k terms', 'k(2a + (k - 1)d) / 2', ''],
        ],
      },
      {
        kind: 'code',
        caption: 'Sum from 1 to n without a loop, and sum of a range',
        code: {
          cpp: `long long n = 1000000000;
long long total = n * (n + 1) / 2;         // 500000000500000000
// Sum from a to b inclusive: sum(1..b) - sum(1..a-1)
long long a = 5, b = 10;
long long range = b * (b + 1) / 2 - (a - 1) * a / 2;   // 45`,
          java: `long n = 1000000000L;
long total = n * (n + 1) / 2;              // 500000000500000000
// Sum from a to b inclusive: sum(1..b) - sum(1..a-1)
long a = 5, b = 10;
long range = b * (b + 1) / 2 - (a - 1) * a / 2;   // 45`,
          python: `n = 1000000000
total = n * (n + 1) // 2               # 500000000500000000
# Sum from a to b inclusive: sum(1..b) - sum(1..a-1)
a, b = 5, 10
range_sum = b * (b + 1) // 2 - (a - 1) * a // 2   # 45`,
        },
      },
      {
        kind: 'text',
        body: 'The range trick, sum(a..b) = sum(1..b) - sum(1..a-1), is the same idea as prefix sums in the arrays chapter: to get a middle piece, take the whole up to the end and subtract the whole up to the start. Here the "whole" is a formula instead of a stored array.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'n(n + 1) overflows before the / 2 rescues it',
        body: {
          cpp: 'For n = 10⁹, n × (n + 1) is 10¹⁸, which fits in `long long` but not in `int`. The division by 2 happens after the multiplication, so the intermediate product must fit. Use `long long` for n itself, not only for the result.',
          java: 'For n = 10⁹, n × (n + 1) is 10¹⁸, which fits in `long` but not in `int`. The division by 2 happens after the multiplication, so the intermediate product must fit. Use `long` for n itself, not only for the result.',
          python: 'Python will not overflow, but the answer might not fit the 32-bit or 64-bit result the problem expects; check the constraints, and use `//`, not `/`, so the result stays an integer.',
        },
      },
    ],
    keyTakeaways: [
      '1 + ... + n = n(n + 1) / 2. Know it cold.',
      'Sum of a range = sum to the end minus sum to the element before the start.',
      'The intermediate product n(n + 1) must fit the integer type.',
    ],
    practice: {
      prompt: 'A list is supposed to hold every number from 1 to n once, but one is missing. Read n and then the n - 1 numbers, and find the missing one using the sum formula and a single loop. Then do the same with a second loop and compare the two approaches.',
      leetcode: { title: 'Missing Number', slug: 'missing-number' },
    },
  },
  // -------------------------------------------------------------------------
  {
    sub: 12,
    summary: 'Read a logarithm as "how many halvings", and keep big answers small with modulo 1e9+7.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Two ideas end this chapter, and both are things you will see in problem statements before you see them in code: **log n** in the expected complexity, and **10⁹ + 7** in "return the answer modulo 10⁹ + 7". Neither needs advanced mathematics.',
      },
      { kind: 'heading', text: 'Logarithms: the halving count' },
      {
        kind: 'text',
        body: 'log₂ n is the number of times you can halve n before reaching 1. log₂ 8 = 3 (8 → 4 → 2 → 1). log₂ 1,000,000 ≈ 20. log₂ 1,000,000,000 ≈ 30. That is all you need. When a problem says a solution should be O(n log n), it means "n times a small number like 20", so for n = 10⁶ about 2 × 10⁷ steps, which is fast. When a loop halves something each iteration, its cost is log n.',
      },
      {
        kind: 'table',
        headers: ['n', 'log₂ n (rounded)', 'n log₂ n'],
        rows: [
          ['1,000', '10', '10,000'],
          ['1,000,000', '20', '20,000,000'],
          ['1,000,000,000', '30', '30,000,000,000 (too slow)'],
        ],
      },
      { kind: 'heading', text: 'Modular arithmetic: keeping numbers small' },
      {
        kind: 'text',
        body: 'Many counting answers are astronomically large: the number of ways to do something can have hundreds of digits. Problem setters do not want you to handle huge numbers, so they ask for the answer **modulo** a big prime, almost always 1,000,000,007. That means: give the remainder when the true answer is divided by that number. The remainder is always below 10⁹ + 7, so it fits in an ordinary 64-bit integer.',
      },
      {
        kind: 'text',
        body: 'The rule that makes it workable: you can take the remainder at every step instead of only at the end. (a + b) % m = ((a % m) + (b % m)) % m, and the same for multiplication. So compute as normal, but apply `% MOD` after each addition or multiplication, and the numbers never grow large.',
      },
      {
        kind: 'code',
        caption: 'n! modulo 10⁹ + 7, never overflowing',
        code: {
          cpp: `const long long MOD = 1000000007;
long long fact = 1;
for (int i = 2; i <= n; i++) {
    fact = fact * i % MOD;   // product is at most ~1e9 * 1e5, fits in long long
}
cout << fact << endl;`,
          java: `final long MOD = 1_000_000_007L;
long fact = 1;
for (int i = 2; i <= n; i++) {
    fact = fact * i % MOD;   // product is at most ~1e9 * 1e5, fits in long
}
System.out.println(fact);`,
          python: `MOD = 10**9 + 7
fact = 1
for i in range(2, n + 1):
    fact = fact * i % MOD   # keeps the number small and the loop fast
print(fact)`,
        },
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Two things modulo does not let you do',
        body: {
          cpp: 'Subtraction can go negative: `(a - b) % MOD` in C++ can be negative if a < b. Write `((a - b) % MOD + MOD) % MOD`. And division does not work at all: `(a / b) % MOD` is not `(a % MOD) / (b % MOD)`. Division under modulo needs the modular inverse, covered in the number theory chapter. Also: `fact * i` must be done in `long long`; if `fact` were an `int`, the product overflows before `% MOD` runs.',
          java: 'Subtraction can go negative: `(a - b) % MOD` in Java can be negative if a < b. Write `((a - b) % MOD + MOD) % MOD` or `Math.floorMod`. And division does not work at all: `(a / b) % MOD` is not `(a % MOD) / (b % MOD)`. Division under modulo needs the modular inverse, covered in the number theory chapter. Also: `fact * i` must be done in `long`; if `fact` were an `int`, the product overflows before `% MOD` runs.',
          python: 'Subtraction is safe in Python because `%` never returns a negative for a positive MOD. But division does not work at all: `(a / b) % MOD` is not `(a % MOD) / (b % MOD)`. Division under modulo needs the modular inverse, covered in the number theory chapter. Also, do not skip the `% MOD` inside the loop on the grounds that Python cannot overflow: without it the numbers grow to thousands of digits and the loop becomes very slow.',
        },
      },
    ],
    keyTakeaways: [
      'log₂ n = number of halvings to reach 1; about 20 for a million, 30 for a billion.',
      'Modulo 10⁹ + 7 keeps answers small; apply `% MOD` after every add or multiply.',
      'Under modulo, fix negative subtraction results and never divide directly.',
    ],
    practice: {
      prompt: 'Compute 2ⁿ modulo 10⁹ + 7 for n = 100 with a loop that multiplies by 2 and takes the remainder each time. Then compute how many times you can halve 10⁹ before reaching 1, and check it against the logarithm table above.',
    },
  },
];
