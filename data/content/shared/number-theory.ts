import type { SharedLesson } from './types';

/**
 * Number Theory Algorithms — Core arithmetic algorithms for competitive programming:
 * Sieve of Eratosthenes, fast binary exponentiation, modular multiplicative inverse,
 * prime factorisation via SPF, and combinatorial selections nCr modulo a prime p.
 */
export const lessons: SharedLesson[] = [
  // =========================================================================
  // Lesson 1: Sieve of Eratosthenes
  // =========================================================================
  {
    sub: 1,
    summary: 'Generate all prime numbers up to N in O(N log log N) time by eliminating composite multiples of discovered primes.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A **prime number** is an integer greater than 1 whose only positive divisors are 1 and itself. Testing an individual integer requires checking divisors up to its square root in O(sqrt(N)) time. When a problem requires testing all numbers up to N = 10^6, running trial division per integer takes O(N sqrt(N)) steps—roughly one billion operations—exceeding standard 1-second limits.\n\nThe **Sieve of Eratosthenes** finds all primes up to N simultaneously in O(N log log N) time. We maintain a boolean array `isPrime` of size N + 1. Starting at 2, whenever `isPrime[p]` remains true, `p` is prime. We then eliminate its multiples starting at `p * p` because smaller multiples `k * p` (with `k < p`) were already eliminated by a smaller prime factor of `k`. The loop terminates once `p * p > n`.',
      },
      {
        kind: 'code',
        caption: 'Sieve of Eratosthenes boolean lookup',
        code: {
          cpp: `#include <vector>
using namespace std;

vector<bool> sieve(int n) {
    if (n < 0) return {};
    vector<bool> isPrime(n + 1, true);
    if (n >= 0) isPrime[0] = false;
    if (n >= 1) isPrime[1] = false;
    for (int p = 2; (long long)p * p <= n; p++) {
        if (isPrime[p]) {
            for (long long j = (long long)p * p; j <= n; j += p) {
                isPrime[j] = false;
            }
        }
    }
    return isPrime;
}`,
          java: `import java.util.Arrays;

public class Sieve {
    public static boolean[] sieve(int n) {
        if (n < 0) return new boolean[0];
        boolean[] isPrime = new boolean[n + 1];
        Arrays.fill(isPrime, true);
        if (n >= 0) isPrime[0] = false;
        if (n >= 1) isPrime[1] = false;
        for (int p = 2; (long) p * p <= n; p++) {
            if (isPrime[p]) {
                for (long j = (long) p * p; j <= n; j += p) {
                    isPrime[(int) j] = false;
                }
            }
        }
        return isPrime;
    }
}`,
          python: `def sieve(n: int) -> list[bool]:
    if n < 0:
        return []
    is_prime = [True] * (n + 1)
    if n >= 0:
        is_prime[0] = False
    if n >= 1:
        is_prime[1] = False
    p = 2
    while p * p <= n:
        if is_prime[p]:
            for j in range(p * p, n + 1, p):
                is_prime[j] = False
        p += 1
    return is_prime`,
        },
      },
      { kind: 'heading', text: 'Prime generation complexity' },
      {
        kind: 'table',
        headers: ['Algorithm', 'Time Complexity', 'Space Complexity', 'Primary Use Case'],
        rows: [
          ['Trial Division (single)', 'O(sqrt(N))', 'O(1)', 'Checking a single isolated number'],
          ['Trial Division (1 to N)', 'O(N sqrt(N))', 'O(1)', 'Unusable when N exceeds 10^4'],
          ['Sieve of Eratosthenes', 'O(N log log N)', 'O(N)', 'Bulk primality queries up to 10^7'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: '32-bit integer overflow in p * p',
        body: 'Computing `p * p` as a 32-bit signed integer overflows when `p` exceeds 46340, wrapping negative and causing an infinite loop. Always cast `p` to a 64-bit integer before squaring, or write `p <= n / p`.',
      },
    ],
    keyTakeaways: [
      'The Sieve of Eratosthenes precomputes primality for all numbers up to N in near-linear O(N log log N) time.',
      'Marking multiples starting at p * p skips values already eliminated by smaller prime factors.',
      'The outer loop terminates at sqrt(N) because every composite number has a prime factor at or below its square root.',
    ],
    practice: {
      prompt: 'Given an integer n, return the number of prime numbers strictly less than n.',
      leetcode: { title: 'Count Primes', slug: 'count-primes' },
    },
  },

  // =========================================================================
  // Lesson 2: Fast exponentiation
  // =========================================================================
  {
    sub: 2,
    summary: 'Compute large powers and modular powers in O(log exp) time by repeatedly squaring the base.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Calculating `base^exp` by repeatedly multiplying the base takes O(exp) operations. When `exp = 10^18`, linear multiplication cannot finish within time limits. **Fast exponentiation** (or **binary exponentiation**) calculates powers in O(log exp) time by taking advantage of the binary representation of the exponent.\n\nAny non-negative exponent can be written as a sum of powers of two. For example, 13 is 1101 in binary (8 + 4 + 1), so `a^13 = a^8 * a^4 * a^1`. We obtain the powers `a^1, a^2, a^4, a^8, ...` by repeatedly squaring the base. Whenever the current lowest bit of the exponent is 1, we multiply the accumulator by the current base. We then halve the exponent and square the base, reducing billions of operations to roughly 60 multiplications.',
      },
      {
        kind: 'code',
        caption: 'Iterative binary exponentiation modulo mod',
        code: {
          cpp: `long long powerMod(long long base, long long exp, long long mod) {
    long long res = 1;
    base %= mod;
    while (exp > 0) {
        if (exp % 2 == 1) res = (res * base) % mod;
        base = (base * base) % mod;
        exp /= 2;
    }
    return res;
}`,
          java: `public class FastExp {
    public static long powerMod(long base, long exp, long mod) {
        long res = 1;
        base %= mod;
        while (exp > 0) {
            if (exp % 2 == 1) res = (res * base) % mod;
            base = (base * base) % mod;
            exp /= 2;
        }
        return res;
    }
}`,
          python: `def power_mod(base: int, exp: int, mod: int) -> int:
    res = 1
    base %= mod
    while exp > 0:
        if exp % 2 == 1:
            res = (res * base) % mod
        base = (base * base) % mod
        exp //= 2
    return res`,
        },
      },
      { kind: 'heading', text: 'Exponentiation complexity comparison' },
      {
        kind: 'table',
        headers: ['Approach', 'Time Complexity', 'Operations for exp = 10^18', 'Space Complexity'],
        rows: [
          ['Linear Multiplication', 'O(exp)', '10^18 steps (TLE)', 'O(1)'],
          ['Recursive Fast Exponentiation', 'O(log exp)', 'Approx 60 steps', 'O(log exp) stack'],
          ['Iterative Fast Exponentiation', 'O(log exp)', 'Approx 60 steps', 'O(1)'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: '32-bit multiplication overflow before modulo',
        body: 'When multiplying two values up to 10^9 + 7, their product reaches 10^18. In a 32-bit `int`, this product overflows before `% mod` is evaluated. Always store intermediate variables in 64-bit integer types (`long long` in C++, `long` in Java).',
      },
    ],
    keyTakeaways: [
      'Fast exponentiation evaluates powers in logarithmic O(log exp) time by squaring the base.',
      'Bitwise inspection tests each power-of-two component of the binary exponent.',
      'Intermediate multiplications must use 64-bit integer types to prevent overflow prior to modulo reduction.',
    ],
    practice: {
      prompt: 'A digit string is good if digits at even indices are even (0, 2, 4, 6, 8) and digits at odd indices are prime (2, 3, 5, 7). Given an integer n, return the total count of good digit strings modulo 10^9 + 7.',
      leetcode: { title: 'Count Good Numbers', slug: 'count-good-numbers' },
    },
  },

  // =========================================================================
  // Lesson 3: Modular inverse and Fermat’s little theorem
  // =========================================================================
  {
    sub: 3,
    summary: 'Divide under a prime modulus in O(log p) time by calculating the modular multiplicative inverse using Fermat’s Little Theorem.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'In ordinary arithmetic, dividing `a` by `b` yields a fraction. Under modulo arithmetic, all values must remain integers. The division operator does not distribute over modulo: `(a / b) % m` does not equal `((a % m) / (b % m)) % m`. To divide under modulo, we must find an integer that acts as a multiplicative inverse.\n\nThe **modular multiplicative inverse** of `b` modulo `m` is an integer `x` satisfying `(b * x) % m == 1`. When `x` exists, division becomes multiplication: `(a / b) % m` becomes `(a * x) % m`. When `p` is a **prime number** and `b % p != 0`, Fermat’s Little Theorem states that `b^(p - 1) % p == 1`. Multiplying both sides by `b^(-1)` yields `b^(p - 2) % p == b^(-1)`. We evaluate `b^(p - 2) % p` using fast exponentiation in O(log p) time.',
      },
      {
        kind: 'code',
        caption: 'Modular inverse and division using Fermat’s Little Theorem',
        code: {
          cpp: `long long powerMod(long long base, long long exp, long long mod) {
    long long res = 1;
    base %= mod;
    while (exp > 0) {
        if (exp % 2 == 1) res = (res * base) % mod;
        base = (base * base) % mod;
        exp /= 2;
    }
    return res;
}

long long modInverse(long long b, long long p) {
    return powerMod(b, p - 2, p);
}

long long modDivide(long long a, long long b, long long p) {
    return ((a % p) * modInverse(b, p)) % p;
}`,
          java: `public class ModularArithmetic {
    public static long powerMod(long base, long exp, long mod) {
        long res = 1;
        base %= mod;
        while (exp > 0) {
            if (exp % 2 == 1) res = (res * base) % mod;
            base = (base * base) % mod;
            exp /= 2;
        }
        return res;
    }

    public static long modInverse(long b, long p) {
        return powerMod(b, p - 2, p);
    }

    public static long modDivide(long a, long b, long p) {
        return ((a % p) * modInverse(b, p)) % p;
    }
}`,
          python: `def power_mod(base: int, exp: int, mod: int) -> int:
    res = 1
    base %= mod
    while exp > 0:
        if exp % 2 == 1:
            res = (res * base) % mod
        base = (base * base) % mod
        exp //= 2
    return res

def mod_inverse(b: int, p: int) -> int:
    return power_mod(b, p - 2, p)

def mod_divide(a: int, b: int, p: int) -> int:
    return ((a % p) * mod_inverse(b, p)) % p`,
        },
      },
      { kind: 'heading', text: 'Operations under prime modulus' },
      {
        kind: 'table',
        headers: ['Operation', 'Algebraic Form', 'Modular Implementation', 'Time Complexity'],
        rows: [
          ['Addition', 'a + b', '(a % p + b % p) % p', 'O(1)'],
          ['Subtraction', 'a - b', '(a % p - b % p + p) % p', 'O(1)'],
          ['Multiplication', 'a * b', '((a % p) * (b % p)) % p', 'O(1)'],
          ['Division', 'a / b', '((a % p) * powerMod(b, p - 2, p)) % p', 'O(log p)'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Composite modulus breaks Fermat’s Little Theorem',
        body: 'Fermat’s Little Theorem requires `p` to be a prime number. If `m` is composite, `b^(m - 2) % m` fails. For composite moduli, you must use the Extended Euclidean Algorithm instead, provided `gcd(b, m) == 1`.',
      },
    ],
    keyTakeaways: [
      'Standard integer division does not distribute across the modulo operator.',
      'Dividing by b modulo a prime p is equivalent to multiplying by b^(p - 2) modulo p.',
      'Fermat’s Little Theorem evaluates the modular inverse in O(log p) time with fast exponentiation.',
    ],
    practice: {
      prompt: 'Given a string of space-separated words, calculate the number of distinct anagram permutations of the string modulo 10^9 + 7. For each word with character counts c1, c2, ..., compute n! / (c1! * c2! * ...) using modular inverse.',
      leetcode: { title: 'Count Anagrams', slug: 'count-anagrams' },
    },
  },

  // =========================================================================
  // Lesson 4: Prime factorisation
  // =========================================================================
  {
    sub: 4,
    summary: 'Decompose numbers into prime factors using trial division in O(sqrt(N)) time and precomputed SPF tables in O(log N) time.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'The **Fundamental Theorem of Arithmetic** states that every integer greater than 1 has a unique prime factorisation: `N = p1^a1 * p2^a2 * ... * pk^ak`. Prime factorisation is required for divisor counting, computing greatest common divisors, and evaluating Euler totient functions.\n\nTo factor an isolated integer `n`, we test candidate divisors `d` from 2 up to `sqrt(n)`. Whenever `d` divides `n`, we record `d` and divide `n` by `d` repeatedly. If `n > 1` remains after testing candidates up to `sqrt(n)`, that remainder must be prime, running in O(sqrt(n)) time.\n\nFor answering factorisation queries across many numbers up to N, trial division takes O(Q sqrt(N)) time. We can precompute an array `spf` where `spf[x]` stores the **Smallest Prime Factor** of `x` using a sieve. Factoring any number `x` then takes O(log x) steps by repeatedly recording `spf[x]` and updating `x = x / spf[x]`.',
      },
      {
        kind: 'code',
        caption: 'Precomputing SPF sieve and retrieving prime factors in O(log N)',
        code: {
          cpp: `#include <vector>
using namespace std;

vector<int> buildSPF(int n) {
    vector<int> spf(n + 1);
    for (int i = 0; i <= n; i++) spf[i] = i;
    for (int p = 2; (long long)p * p <= n; p++) {
        if (spf[p] == p) {
            for (long long j = (long long)p * p; j <= n; j += p) {
                if (spf[j] == j) spf[j] = p;
            }
        }
    }
    return spf;
}

vector<int> getFactors(int x, const vector<int>& spf) {
    vector<int> factors;
    while (x > 1) {
        factors.push_back(spf[x]);
        x /= spf[x];
    }
    return factors;
}`,
          java: `import java.util.ArrayList;
import java.util.List;

public class PrimeFactorization {
    public static int[] buildSPF(int n) {
        int[] spf = new int[n + 1];
        for (int i = 0; i <= n; i++) spf[i] = i;
        for (int p = 2; (long) p * p <= n; p++) {
            if (spf[p] == p) {
                for (long j = (long) p * p; j <= n; j += p) {
                    if (spf[(int) j] == (int) j) spf[(int) j] = p;
                }
            }
        }
        return spf;
    }

    public static List<Integer> getFactors(int x, int[] spf) {
        List<Integer> factors = new ArrayList<>();
        while (x > 1) {
            factors.add(spf[x]);
            x /= spf[x];
        }
        return factors;
    }
}`,
          python: `def build_spf(n: int) -> list[int]:
    spf = list(range(n + 1))
    p = 2
    while p * p <= n:
        if spf[p] == p:
            for j in range(p * p, n + 1, p):
                if spf[j] == j:
                    spf[j] = p
        p += 1
    return spf

def get_factors(x: int, spf: list[int]) -> list[int]:
    factors: list[int] = []
    while x > 1:
        factors.append(spf[x])
        x //= spf[x]
    return factors`,
        },
      },
      { kind: 'heading', text: 'Factorisation strategy comparison' },
      {
        kind: 'table',
        headers: ['Strategy', 'Precomputation Time', 'Query Time', 'Memory Footprint'],
        rows: [
          ['Trial Division (single query)', 'O(1)', 'O(sqrt(N))', 'O(1)'],
          ['Precomputed Primes List', 'O(N log log N)', 'O(sqrt(N) / log N)', 'O(N / log N)'],
          ['Smallest Prime Factor (SPF)', 'O(N log log N)', 'O(log N)', 'O(N) integers'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Missing prime factor larger than sqrt(n)',
        body: 'If a number has a prime factor exceeding `sqrt(n)`, trial division terminates the loop with `n > 1`. For example, factoring 14 checks divisor 2, leaves 7, and stops because 3 exceeds `sqrt(7)`. Always verify if `n > 1` after the loop and include the residual factor.',
      },
    ],
    keyTakeaways: [
      'Every composite integer has at least one prime factor at or below its square root.',
      'Trial division factors an individual number in O(sqrt(N)) time without extra memory.',
      'The Smallest Prime Factor (SPF) sieve enables O(log N) factorisation per query after O(N log log N) preprocessing.',
    ],
    practice: {
      prompt: 'Given an array of positive integers nums, return the number of distinct prime factors present in the product of all elements of nums.',
      leetcode: { title: 'Distinct Prime Factors of Product of Array', slug: 'distinct-prime-factors-of-product-of-array' },
    },
  },

  // =========================================================================
  // Lesson 5: nCr with factorials mod p
  // =========================================================================
  {
    sub: 5,
    summary: 'Compute combinatorial selections nCr modulo a prime p in O(1) time per query using precomputed factorials and backward inverse factorials.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'The combination `nCr` counts the number of ways to choose `r` unordered elements from `n` distinct items: `nCr = n! / (r! * (n - r)!)`. In competitive programming, `n` and `r` often reach 10^5 or 10^6, and answers are required modulo a prime `p` (such as 10^9 + 7). Computing factorials directly exceeds integer limits, requiring modular precomputation.\n\nWe precompute `fact[i] = (fact[i - 1] * i) % p` in O(N) time. To avoid computing each inverse independently in O(N log p), we compute `invFact[N] = power(fact[N], p - 2)` once, and work backwards: `invFact[i] = (invFact[i + 1] * (i + 1)) % p`. This precomputes all inverse factorials in O(N + log p) time. Any `nCr` query then completes in O(1) time via `fact[n] * invFact[r] % p * invFact[n - r] % p`.',
      },
      {
        kind: 'code',
        caption: 'Combinatorics class supporting O(1) nCr queries modulo prime p',
        code: {
          cpp: `#include <vector>
using namespace std;

class Combinatorics {
    long long mod;
    vector<long long> fact, invFact;

    long long power(long long b, long long e) {
        long long res = 1;
        for (b %= mod; e > 0; e /= 2, b = (b * b) % mod) {
            if (e % 2 == 1) res = (res * b) % mod;
        }
        return res;
    }

public:
    Combinatorics(int n, long long p) : mod(p), fact(n + 1), invFact(n + 1) {
        fact[0] = 1;
        for (int i = 1; i <= n; i++) fact[i] = (fact[i - 1] * i) % mod;
        invFact[n] = power(fact[n], mod - 2);
        for (int i = n - 1; i >= 0; i--) {
            invFact[i] = (invFact[i + 1] * (i + 1)) % mod;
        }
    }

    long long nCr(int n, int r) {
        if (r < 0 || r > n) return 0;
        return fact[n] * invFact[r] % mod * invFact[n - r] % mod;
    }
};`,
          java: `public class Combinatorics {
    private final long mod;
    private final long[] fact, invFact;

    private long power(long b, long e) {
        long res = 1;
        for (b %= mod; e > 0; e /= 2, b = (b * b) % mod) {
            if (e % 2 == 1) res = (res * b) % mod;
        }
        return res;
    }

    public Combinatorics(int n, long p) {
        this.mod = p;
        fact = new long[n + 1];
        invFact = new long[n + 1];
        fact[0] = 1;
        for (int i = 1; i <= n; i++) fact[i] = (fact[i - 1] * i) % mod;
        invFact[n] = power(fact[n], mod - 2);
        for (int i = n - 1; i >= 0; i--) {
            invFact[i] = (invFact[i + 1] * (i + 1)) % mod;
        }
    }

    public long nCr(int n, int r) {
        if (r < 0 || r > n) return 0;
        return fact[n] * invFact[r] % mod * invFact[n - r] % mod;
    }
}`,
          python: `class Combinatorics:
    def __init__(self, n: int, p: int) -> None:
        self.mod = p
        self.fact = [1] * (n + 1)
        self.inv_fact = [1] * (n + 1)
        for i in range(1, n + 1):
            self.fact[i] = (self.fact[i - 1] * i) % p
        self.inv_fact[n] = pow(self.fact[n], p - 2, p)
        for i in range(n - 1, -1, -1):
            self.inv_fact[i] = (self.inv_fact[i + 1] * (i + 1)) % p

    def n_cr(self, n: int, r: int) -> int:
        if r < 0 or r > n:
            return 0
        return self.fact[n] * self.inv_fact[r] % self.mod * self.inv_fact[n - r] % self.mod`,
        },
      },
      { kind: 'heading', text: 'Combinatorial computation methods' },
      {
        kind: 'table',
        headers: ['Method', 'Precomputation Time', 'Query Time', 'Memory Footprint'],
        rows: [
          ['Pascal Triangle Addition DP', 'O(N^2)', 'O(1)', 'O(N^2) integers'],
          ['Factorial with Individual Inverse', 'O(N)', 'O(log p)', 'O(N) integers'],
          ['Factorials + Backward Inverse', 'O(N + log p)', 'O(1)', 'O(N) integers'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Missing boundary check for r < 0 or r > n',
        body: 'Querying `nCr` with `r < 0` or `r > n` leads to negative array indexing or out-of-bounds errors. Mathematically, selecting more items than the set contains yields 0 ways. Always guard with `if (r < 0 || r > n) return 0;` before indexing factorial tables.',
      },
    ],
    keyTakeaways: [
      'Precomputing factorials and inverse factorials enables O(1) query time for combinations modulo a prime.',
      'Inverse factorials are derived backwards in O(N) linear time from invFact[N].',
      'The formula nCr mod p combines fact[n], invFact[r], and invFact[n - r] via modular multiplication.',
      'Guard queries against invalid bounds where r < 0 or r > n to prevent lookup errors.',
    ],
    practice: {
      prompt: 'Given an array of integers representing a permutation, return the number of ways to reorder the array such that inserting elements into an initially empty Binary Search Tree yields the identical tree structure, modulo 10^9 + 7.',
      leetcode: { title: 'Number of Ways to Reorder Array to Get Same BST', slug: 'number-of-ways-to-reorder-array-to-get-same-bst' },
    },
  },
];
