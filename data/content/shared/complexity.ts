import type { SharedLesson } from './types';

/**
 * Time and Space Complexity — Master Big-O notation, runtime estimation,
 * loop and recursive analysis, amortised bounds, and constraint reading.
 */
export const lessons: SharedLesson[] = [
  // =========================================================================
  // Lesson 1: Why speed matters: 10^8 operations per second
  // =========================================================================
  {
    sub: 1,
    summary: 'Estimate whether a proposed solution will pass or timeout under online judge limits.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Online judges like LeetCode and Codeforces evaluate code by running it against hidden test suites under a strict time limit, typically 1.0 to 2.0 seconds per test file. Small sample inputs finish in milliseconds on any machine, but competitive platforms test extreme bounds where an inefficient algorithm will run for minutes.',
      },
      { kind: 'heading', text: 'The 10⁸ operations benchmark' },
      {
        kind: 'text',
        body: 'Modern CPUs run billions of clock cycles per second, but memory access, branching, and runtime overhead reduce real-world throughput. The universal rule of thumb in automated grading is that a judge executes roughly **10⁸ (100 million) basic operations per second**.',
      },
      {
        kind: 'code',
        caption: 'A single loop running 10⁸ iterations to observe one second of execution',
        code: {
          cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    long long count = 0;
    for (int i = 0; i < 100000000; i++) count++;
    cout << count << endl;
    return 0;
}`,
          java: `public class Main {
    public static void main(String[] args) {
        long count = 0;
        for (int i = 0; i < 100000000; i++) count++;
        System.out.println(count);
    }
}`,
          python: `count = 0
for _ in range(100_000_000):
    count += 1
print(count)`,
        },
        output: '100000000',
      },
      { kind: 'heading', text: 'Operation counts versus verdict' },
      {
        kind: 'text',
        body: 'When your algorithm exceeds 10⁸ operations on the largest input, the judge halts execution with **Time Limit Exceeded (TLE)**. Calculating operations beforehand tells you if your code will pass before clicking Submit.',
      },
      {
        kind: 'table',
        headers: ['Operations on Max Input', 'Estimated Runtime', 'Expected Verdict'],
        rows: [
          ['10^6', '0.01s', 'Comfortable Pass'],
          ['10^7', '0.10s', 'Comfortable Pass'],
          ['10^8', '1.00s', 'Borderline (Pass in C++, tight in Python)'],
          ['10^9', '10.0s', 'Time Limit Exceeded (TLE)'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Testing only small sample cases on your machine',
        body: 'A solution that executes in 2 milliseconds on sample input n = 5 may take 40 minutes on n = 100,000. Never rely on sample tests to evaluate speed; calculate operations against the maximum constraint value.',
      },
    ],
    keyTakeaways: [
      'Online judges enforce a 1.0 to 2.0 second limit per test file.',
      'A standard server CPU processes roughly 10⁸ basic operations in one second.',
      'Exceeding 10⁸ operations on the maximum input triggers a Time Limit Exceeded (TLE) verdict.',
      'Always calculate expected operations from constraints before coding.',
    ],
    practice: {
      prompt: 'Write a loop that accumulates the running sum of an array with 1,000 elements. Calculate the total operations and verify that it finishes well within the 10⁸ limit.',
      leetcode: { title: 'Running Sum of 1d Array', slug: 'running-sum-of-1d-array' },
    },
  },

  // =========================================================================
  // Lesson 2: Counting operations, not seconds
  // =========================================================================
  {
    sub: 2,
    summary: 'Express the execution cost of a program as a mathematical function of input size n.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Measuring algorithm performance with a stopwatch is unreliable. Wall-clock time varies with CPU hardware, background operating system tasks, and compiler flags. To compare algorithms objectively, computer science counts **fundamental operations** as a function of the input size n.',
      },
      { kind: 'heading', text: 'Tracing operations in code' },
      {
        kind: 'text',
        body: 'A fundamental operation is an atomic computation: reading or writing a variable, performing arithmetic, evaluating a comparison, or following a pointer. Each executes in bounded time on modern hardware.',
      },
      {
        kind: 'code',
        caption: 'Counting operations in an array maximum search',
        code: {
          cpp: `int findMax(const vector<int>& arr) {
    int maxVal = arr[0];                    // 1 assignment
    for (int i = 1; i < (int)arr.size(); i++) { // n checks, n increments
        if (arr[i] > maxVal) maxVal = arr[i];   // n - 1 comparisons
    }
    return maxVal;                          // 1 return
}`,
          java: `public int findMax(int[] arr) {
    int maxVal = arr[0];                    // 1 assignment
    for (int i = 1; i < arr.length; i++) {  // n checks, n increments
        if (arr[i] > maxVal) maxVal = arr[i];   // n - 1 comparisons
    }
    return maxVal;                          // 1 return
}`,
          python: `def find_max(arr: list[int]) -> int:
    max_val = arr[0]                   # 1 assignment
    for i in range(1, len(arr)):       # n checks, n increments
        if arr[i] > max_val: max_val = arr[i] # n - 1 comparisons
    return max_val                     # 1 return`,
        },
      },
      { kind: 'heading', text: 'Formulating f(n)' },
      {
        kind: 'text',
        body: 'Summing initialization, comparisons, increments, and updates yields an equation like `f(n) = 3n + 2`. When n is 10, `f(n) = 32`. When n is 1,000,000, `f(n) = 3,000,002`. The linear term `3n` accounts for over 99.999% of all operations.',
      },
      {
        kind: 'table',
        headers: ['Input Size n', 'Formula f(n) = 3n + 2', 'Linear Term Share'],
        rows: [
          ['10', '32 operations', '93.75%'],
          ['1,000', '3,002 operations', '99.93%'],
          ['100,000', '300,002 operations', '99.999%'],
          ['1,000,000', '3,000,002 operations', '99.9999%'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Focus on how the count scales, not tiny constants',
        body: 'Whether an increment translates to one CPU instruction or two does not alter scalability. What matters is that doubling n roughly doubles the total work. The rate of growth governs algorithm viability.',
      },
    ],
    keyTakeaways: [
      'Stopwatch timings depend on hardware; counting operations provides a universal metric.',
      'The variable n represents the size of the input data.',
      'Summing operations yields an equation f(n) that depends directly on n.',
      'As n grows large, the highest-order term dominates total execution time.',
    ],
    practice: {
      prompt: 'Count the operations required to reduce an integer to zero by dividing by 2 if even or subtracting 1 if odd. Trace n = 14 by hand, then implement the counting loop.',
      leetcode: { title: 'Number of Steps to Reduce a Number to Zero', slug: 'number-of-steps-to-reduce-a-number-to-zero' },
    },
  },

  // =========================================================================
  // Lesson 3: Big-O: drop constants and lower-order terms
  // =========================================================================
  {
    sub: 3,
    summary: 'Simplify exact operation counts into clean Big-O asymptotic notation.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Exact formulas like `f(n) = 4n² + 150n + 900` are cumbersome to compare. As n grows into tens of thousands, the `4n²` term completely overshadows the rest. Big-O notation formalises this: it captures the upper bound on growth rate as n approaches infinity.',
      },
      { kind: 'heading', text: 'The two reduction rules' },
      {
        kind: 'text',
        body: 'To derive Big-O from an exact operation formula, apply two rules: first, **drop lower-order terms** because the highest power dominates at scale. Second, **drop constant multipliers** because hardware variations affect constant factors, but cannot change the fundamental growth rate.',
      },
      {
        kind: 'code',
        caption: 'Sequential loops add work without changing Big-O class',
        code: {
          cpp: `// Two sequential loops: f(n) = 2n -> O(n)
void linearTwoPass(int n) {
    for (int i = 0; i < n; i++) { /* pass 1: n steps */ }
    for (int i = 0; i < n; i++) { /* pass 2: n steps */ }
}

// Nested plus single loop: f(n) = n^2 + 100n -> O(n^2)
void quadraticPlusLinear(int n) {
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) { /* n^2 steps dominate */ }
    }
    for (int k = 0; k < 100 * n; k++) { /* 100n steps fade away */ }
}`,
          java: `// Two sequential loops: f(n) = 2n -> O(n)
public void linearTwoPass(int n) {
    for (int i = 0; i < n; i++) { /* pass 1: n steps */ }
    for (int i = 0; i < n; i++) { /* pass 2: n steps */ }
}

// Nested plus single loop: f(n) = n^2 + 100n -> O(n^2)
public void quadraticPlusLinear(int n) {
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) { /* n^2 steps dominate */ }
    }
    for (int k = 0; k < 100 * n; k++) { /* 100n steps fade away */ }
}`,
          python: `# Two sequential loops: f(n) = 2n -> O(n)
def linear_two_pass(n: int) -> None:
    for i in range(n): pass # pass 1: n steps
    for i in range(n): pass # pass 2: n steps

# Nested plus single loop: f(n) = n^2 + 100n -> O(n^2)
def quadratic_plus_linear(n: int) -> None:
    for i in range(n):
        for j in range(n): pass # n^2 steps dominate
    for k in range(100 * n): pass # 100n steps fade away`,
        },
      },
      {
        kind: 'table',
        headers: ['Exact Formula', 'Dominant Term', 'Big-O Simplification'],
        rows: [
          ['12n + 45', '12n', 'O(n)'],
          ['0.5n^2 + 80n + 300', '0.5n^2', 'O(n^2)'],
          ['7 * 2^n + 500n^3', '7 * 2^n', 'O(2^n)'],
          ['9999 (independent of n)', '9999', 'O(1)'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Constants matter in competitive code, but never change Big-O',
        body: 'An algorithm running in 50n operations is fifty times slower than one running in n operations. On a tight 1-second limit, that difference can matter. But 50n will always outperform 0.01n² once n grows large enough.',
      },
    ],
    keyTakeaways: [
      'Big-O notation describes the upper bound on growth rate as n approaches infinity.',
      'Drop lower-order terms: keep only the fastest-growing term in the polynomial.',
      'Drop constant multipliers: 100n and 2n both scale as O(n).',
      'Sequential blocks add together: O(A) + O(B) = O(max(A, B)) for the same variable.',
    ],
    practice: {
      prompt: 'Given an integer n, calculate the product and sum of its digits in a single pass. Express the Big-O time complexity as a function of the digit count d = log10(n).',
      leetcode: { title: 'Subtract the Product and Sum of Digits of an Integer', slug: 'subtract-the-product-and-sum-of-digits-of-an-integer' },
    },
  },

  // =========================================================================
  // Lesson 4: O(1), O(log n), O(n)
  // =========================================================================
  {
    sub: 4,
    summary: 'Recognise, write, and compare the three fastest complexity tiers: O(1), O(log n), and O(n).',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'The three fastest complexity classes encountered in algorithm design are **O(1)** (constant time), **O(log n)** (logarithmic time), and **O(n)** (linear time). When an algorithm belongs to one of these classes, it processes hundreds of thousands of items well within standard execution limits.',
      },
      { kind: 'heading', text: 'Constant, logarithmic, and linear tiers' },
      {
        kind: 'text',
        body: 'An operation is **O(1)** if its cost does not depend on n, such as array index access. It is **O(log n)** if it cuts the remaining search space in half at each step, like binary search. It is **O(n)** if work scales directly with n, such as scanning an array to compute its sum.',
      },
      {
        kind: 'code',
        caption: 'Implementations of O(1), O(log n), and O(n)',
        code: {
          cpp: `// O(1): direct index access
int getFirst(const vector<int>& nums) {
    return nums.empty() ? -1 : nums[0];
}

// O(log n): binary search on sorted array
int binarySearch(const vector<int>& nums, int target) {
    int left = 0, right = (int)nums.size() - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) return mid;
        if (nums[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}

// O(n): linear scan
int sumElements(const vector<int>& nums) {
    int total = 0;
    for (int x : nums) total += x;
    return total;
}`,
          java: `// O(1): direct index access
public int getFirst(int[] nums) {
    return nums.length == 0 ? -1 : nums[0];
}

// O(log n): binary search on sorted array
public int binarySearch(int[] nums, int target) {
    int left = 0, right = nums.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) return mid;
        if (nums[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}

// O(n): linear scan
public int sumElements(int[] nums) {
    int total = 0;
    for (int x : nums) total += x;
    return total;
}`,
          python: `# O(1): direct index access
def get_first(nums: list[int]) -> int:
    return nums[0] if nums else -1

# O(log n): binary search on sorted array
def binary_search(nums: list[int], target: int) -> int:
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] == target: return mid
        if nums[mid] < target: left = mid + 1
        else: right = mid - 1
    return -1

# O(n): linear scan
def sum_elements(nums: list[int]) -> int:
    total = 0
    for x in nums: total += x
    return total`,
        },
      },
      {
        kind: 'table',
        headers: ['Input Size n', 'O(1) Steps', 'O(log2 n) Steps', 'O(n) Steps'],
        rows: [
          ['16', '1', '4', '16'],
          ['1,024', '1', '10', '1,024'],
          ['1,048,576 (~10^6)', '1', '20', '1,048,576'],
          ['10^9', '1', '30', '1,000,000,000 (TLE)'],
        ],
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'The logarithm base does not change the Big-O class',
        body: 'In algorithm analysis, log n implies base 2. By change of base, log10(n) = log2(n) / log2(10). Because dividing by log2(10) is multiplying by a constant (~0.301), constant factors drop out and we write O(log n) regardless of base.',
      },
    ],
    keyTakeaways: [
      'O(1) runs in fixed time regardless of dataset size.',
      'O(log n) halves the search space at each step; doubling n adds only 1 step.',
      'O(n) scales linearly; doubling n doubles the total operations.',
      'Binary search achieves O(log n) efficiency by requiring sorted input.',
    ],
    practice: {
      prompt: 'Implement binary search to find the index of a target integer in a sorted array in O(log n) time. Return -1 if target is not found.',
      leetcode: { title: 'Binary Search', slug: 'binary-search' },
    },
  },

  // =========================================================================
  // Lesson 5: O(n log n), O(n^2), O(2^n), O(n!)
  // =========================================================================
  {
    sub: 5,
    summary: 'Distinguish between sorting time O(n log n), quadratic loops O(n^2), and combinatorial explosions O(2^n) and O(n!).',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Higher complexity tiers separate practical algorithms from non-viable ones. While **O(n log n)** scales effectively to millions of elements, **O(n²)** fails when inputs reach 100,000. Combinatorial algorithms running in **O(2ⁿ)** or **O(n!)** expand so aggressively that they can only finish on tiny inputs where n is smaller than 25.',
      },
      { kind: 'heading', text: 'Linearithmic vs Quadratic vs Combinatorial' },
      {
        kind: 'text',
        body: 'Standard sorting runs in **O(n log n)** by dividing inputs logarithmically and doing linear work per level. Nested loops comparing all pairs run in **O(n²)**. Generating all subsets doubles work per element in **O(2ⁿ)**, while generating all permutations multiplies choices in **O(n!)**.',
      },
      {
        kind: 'code',
        caption: 'Examples of O(n log n), O(n^2), and O(2^n)',
        code: {
          cpp: `// O(n log n): standard sorting
void sortArray(vector<int>& nums) {
    sort(nums.begin(), nums.end());
}

// O(n^2): comparing all distinct pairs
bool hasDuplicate(const vector<int>& nums) {
    int n = nums.size();
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (nums[i] == nums[j]) return true;
        }
    }
    return false;
}

// O(2^n): generating all subsets
void getSubsets(int i, const vector<int>& nums, vector<int>& cur) {
    if (i == (int)nums.size()) return;
    getSubsets(i + 1, nums, cur);
    cur.push_back(nums[i]);
    getSubsets(i + 1, nums, cur);
    cur.pop_back();
}`,
          java: `// O(n log n): standard sorting
public void sortArray(int[] nums) {
    Arrays.sort(nums);
}

// O(n^2): comparing all distinct pairs
public boolean hasDuplicate(int[] nums) {
    int n = nums.length;
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (nums[i] == nums[j]) return true;
        }
    }
    return false;
}

// O(2^n): generating all subsets
public void getSubsets(int i, int[] nums, List<Integer> cur) {
    if (i == nums.length) return;
    getSubsets(i + 1, nums, cur);
    cur.add(nums[i]);
    getSubsets(i + 1, nums, cur);
    cur.remove(cur.size() - 1);
}`,
          python: `# O(n log n): standard sorting
def sort_array(nums: list[int]) -> list[int]:
    return sorted(nums)

# O(n^2): comparing all distinct pairs
def has_duplicate(nums: list[int]) -> bool:
    n = len(nums)
    for i in range(n):
        for j in range(i + 1, n):
            if nums[i] == nums[j]: return True
    return False

# O(2^n): generating all subsets
def get_subsets(i: int, nums: list[int], cur: list[int]) -> None:
    if i == len(nums): return
    get_subsets(i + 1, nums, cur)
    cur.append(nums[i])
    get_subsets(i + 1, nums, cur)
    cur.pop()`,
        },
      },
      {
        kind: 'table',
        headers: ['Complexity', 'n = 10', 'n = 20', 'Max Feasible n in 1s'],
        rows: [
          ['O(n log n)', '33', '86', '~10^7'],
          ['O(n^2)', '100', '400', '~5,000'],
          ['O(2^n)', '1,024', '1,048,576', '~22'],
          ['O(n!)', '3,628,800', '2.43 x 10^18', '~11'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'The pairwise O(n²) bottleneck on n = 100,000',
        body: 'Nested loops to check all pairs of elements is the most frequent source of TLE. For n = 100,000, an O(n²) solution requires 10¹⁰ operations (~100 seconds). You must sort first in O(n log n) or use a hash set in O(n).',
      },
    ],
    keyTakeaways: [
      'O(n log n) is the benchmark complexity for sorting and scales to 10⁷ elements.',
      'O(n²) solutions pass for n up to 5,000, but guarantee TLE when n reaches 10⁵.',
      'O(2ⁿ) and O(n!) grow astronomically and are viable only when n is smaller than 25.',
      'Always compare problem constraint bounds against maximum feasible n.',
    ],
    practice: {
      prompt: 'Given an array of unique integers, generate all possible subsets. Notice how the output size of 2ⁿ restricts nums.length to at most 10 in LeetCode.',
      leetcode: { title: 'Subsets', slug: 'subsets' },
    },
  },

  // =========================================================================
  // Lesson 6: Analysing a single loop
  // =========================================================================
  {
    sub: 6,
    summary: 'Determine the exact Big-O complexity of any single loop by examining step updates and termination bounds.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'When analysing loop complexity, inspecting the loop header reveals the iteration count. A common error is assuming that every loop over n elements takes O(n) time. The actual runtime depends on the step update: whether the loop counter increments by addition, jumps by multiplication, or terminates at a square root bound.',
      },
      { kind: 'heading', text: 'Addition, multiplication, and square root steps' },
      {
        kind: 'text',
        body: 'When a loop counter increments by a constant (`i += c`), it completes `n / c` iterations, which scales as **O(n)**. When it multiplies by a constant factor (`i *= 2`), it reaches n in `log2(n)` iterations, scaling as **O(log n)**. When the condition checks `i * i <= n`, it terminates when `i > √n`, taking **O(√n)** time.',
      },
      {
        kind: 'code',
        caption: 'The three foundational single-loop patterns',
        code: {
          cpp: `// Pattern 1: O(n) - increments by constant
void linearLoop(int n) {
    for (int i = 0; i < n; i += 2) { /* n / 2 iterations */ }
}

// Pattern 2: O(log n) - doubles each step
void logLoop(int n) {
    for (int i = 1; i < n; i *= 2) { /* log2(n) iterations */ }
}

// Pattern 3: O(sqrt(n)) - square root bound
void sqrtLoop(int n) {
    for (int i = 1; i * i <= n; i++) { /* sqrt(n) iterations */ }
}`,
          java: `// Pattern 1: O(n) - increments by constant
public void linearLoop(int n) {
    for (int i = 0; i < n; i += 2) { /* n / 2 iterations */ }
}

// Pattern 2: O(log n) - doubles each step
public void logLoop(int n) {
    for (int i = 1; i < n; i *= 2) { /* log2(n) iterations */ }
}

// Pattern 3: O(sqrt(n)) - square root bound
public void sqrtLoop(int n) {
    for (int i = 1; i * i <= n; i++) { /* sqrt(n) iterations */ }
}`,
          python: `# Pattern 1: O(n) - increments by constant
def linear_loop(n: int) -> None:
    for i in range(0, n, 2): pass # n // 2 iterations

# Pattern 2: O(log n) - doubles each step
def log_loop(n: int) -> None:
    i = 1
    while i < n: i *= 2 # log2(n) iterations

# Pattern 3: O(sqrt(n)) - square root bound
def sqrt_loop(n: int) -> None:
    i = 1
    while i * i <= n: i += 1 # sqrt(n) iterations`,
        },
      },
      {
        kind: 'table',
        headers: ['Loop Header', 'Step Update', 'Iterations', 'Complexity'],
        rows: [
          ['for i from 0 to n', 'i += 1', 'n', 'O(n)'],
          ['for i from 0 to n', 'i += 3', 'n / 3', 'O(n)'],
          ['for i from 1 to n', 'i *= 2', 'log2(n)', 'O(log n)'],
          ['for i from 1 while i*i <= n', 'i += 1', 'floor(sqrt(n))', 'O(sqrt(n))'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Always account for the work inside the loop body',
        body: 'Total loop time equals `(iterations) × (work per iteration)`. If a loop executes n iterations and performs an O(1) step inside, it takes O(n). But if the body copies an array of length n on each pass, the total becomes n × O(n) = O(n²).',
      },
    ],
    keyTakeaways: [
      'Total loop runtime equals iteration count multiplied by work done inside the body.',
      'Adding or subtracting a constant step results in O(n) iterations.',
      'Multiplying or dividing the counter by a constant factor results in O(log n) iterations.',
      'Checking `i * i <= n` stops after `√n` iterations, running in O(√n) time.',
    ],
    practice: {
      prompt: 'Find the maximum number of consecutive 1s in a binary array using a single loop in O(n) time and O(1) extra space.',
      leetcode: { title: 'Max Consecutive Ones', slug: 'max-consecutive-ones' },
    },
  },

  // =========================================================================
  // Lesson 7: Analysing nested and dependent loops
  // =========================================================================
  {
    sub: 7,
    summary: 'Calculate the complexity of nested loops, distinguishing between independent and dependent index bounds.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'When loops are independent, each pass of the outer loop executes the inner loop completely, meaning their iteration counts multiply. When the inner loop counter depends on the outer loop index, the iteration count changes dynamically on every pass and requires summing a series.',
      },
      { kind: 'heading', text: 'Independent vs triangular nested loops' },
      {
        kind: 'text',
        body: 'Two independent loops each running up to n execute `n × n = O(n²)` operations. In a triangular loop (`for j from i to n`), the inner loop runs n times, then `n - 1`, down to 1. The total iterations equal `n(n + 1) / 2 = 0.5n² + 0.5n`. Dropping constants and lower terms leaves **O(n²)**.',
      },
      {
        kind: 'code',
        caption: 'Triangular nested loops vs linear two-pointer loops',
        code: {
          cpp: `// Triangular loop: n*(n-1)/2 iterations -> O(n^2)
bool hasPairSum(const vector<int>& nums, int target) {
    int n = nums.size();
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (nums[i] + nums[j] == target) return true;
        }
    }
    return false;
}

// Two pointers: total pointer movements <= 2n -> O(n)
bool hasPairSumSorted(const vector<int>& nums, int target) {
    int left = 0, right = (int)nums.size() - 1;
    while (left < right) {
        int sum = nums[left] + nums[right];
        if (sum == target) return true;
        if (sum < target) left++;
        else right--;
    }
    return false;
}`,
          java: `// Triangular loop: n*(n-1)/2 iterations -> O(n^2)
public boolean hasPairSum(int[] nums, int target) {
    int n = nums.length;
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (nums[i] + nums[j] == target) return true;
        }
    }
    return false;
}

// Two pointers: total pointer movements <= 2n -> O(n)
public boolean hasPairSumSorted(int[] nums, int target) {
    int left = 0, right = nums.length - 1;
    while (left < right) {
        int sum = nums[left] + nums[right];
        if (sum == target) return true;
        if (sum < target) left++;
        else right--;
    }
    return false;
}`,
          python: `# Triangular loop: n*(n-1)/2 iterations -> O(n^2)
def has_pair_sum(nums: list[int], target: int) -> bool:
    n = len(nums)
    for i in range(n):
        for j in range(i + 1, n):
            if nums[i] + nums[j] == target: return True
    return False

# Two pointers: total pointer movements <= 2n -> O(n)
def has_pair_sum_sorted(nums: list[int], target: int) -> bool:
    left, right = 0, len(nums) - 1
    while left < right:
        s = nums[left] + nums[right]
        if s == target: return True
        if s < target: left += 1
        else: right -= 1
    return False`,
        },
      },
      { kind: 'heading', text: 'Nested loops that run in O(n) overall' },
      {
        kind: 'text',
        body: 'Seeing nested loops does not guarantee O(n²). In two-pointer and sliding-window algorithms, the outer pointer advances from 0 to n, and the inner pointer also advances forward without ever resetting backward. Because each pointer moves at most n times over the whole execution, total operations across both loops are `n + n = 2n`, which is **O(n)**.',
      },
      {
        kind: 'table',
        headers: ['Outer Loop', 'Inner Loop', 'Total Iterations', 'Complexity'],
        rows: [
          ['for i from 0 to n', 'for j from 0 to m', 'n * m', 'O(n * m)'],
          ['for i from 0 to n', 'for j from 0 to n', 'n * n', 'O(n^2)'],
          ['for i from 0 to n', 'for j from i to n', 'n(n + 1) / 2', 'O(n^2)'],
          ['right: 0 to n', 'left: advances <= n times', 'n + n = 2n', 'O(n) (Amortised)'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Triangular loops run half as many steps, but remain O(n²)',
        body: 'Running `n(n - 1) / 2` iterations executes roughly 50% fewer steps than a full `n²` loop. However, constant factors drop in Big-O analysis. For n = 100,000, half of 10¹⁰ is 5 × 10⁹ operations, which heavily exceeds the 10⁸ per-second limit.',
      },
    ],
    keyTakeaways: [
      'Independent nested loops multiply: an n-loop containing an m-loop takes O(n × m).',
      'Dependent triangular loops execute `n(n + 1) / 2` steps, simplifying to quadratic O(n²).',
      'If an inner index advances monotonically without resetting, overall runtime is O(n) amortised.',
      'Sorting first often replaces an O(n²) nested search with O(n log n).',
    ],
    practice: {
      prompt: 'Find indices of two numbers that add up to target. Compare the O(n²) triangular brute-force loop with an O(n) hash map approach.',
      leetcode: { title: 'Two Sum', slug: 'two-sum' },
    },
  },

  // =========================================================================
  // Lesson 8: Analysing recursion: draw the call tree
  // =========================================================================
  {
    sub: 8,
    summary: 'Evaluate recursive runtime by constructing the invocation call tree to count total calls and work per level.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Analysing recursive functions requires looking beyond the function body. Because a recursive function calls itself, each invocation may spawn further invocations. To determine the time complexity of recursion, we draw the **call tree** and count the total nodes generated across all levels.',
      },
      { kind: 'heading', text: 'The recursive cost formula' },
      {
        kind: 'text',
        body: 'The total time complexity of recursion is: `(total recursive calls) × (non-recursive work per call)`. The call count depends on the **branching factor** `b` (child calls spawned per call) and the **recursion depth** `d` (levels before reaching a base case).',
      },
      { kind: 'heading', text: 'Linear recursion vs branching recursion' },
      {
        kind: 'text',
        body: 'In linear recursion (`factorial`), each invocation makes 1 child call. The tree is a single chain of depth n, yielding n calls and **O(n)** time. In branching recursion (`fib(n) = fib(n-1) + fib(n-2)`), each call spawns 2 children. The tree has depth n and sums to `2ⁿ⁺¹ - 1` nodes, producing **O(2ⁿ)** time.',
      },
      {
        kind: 'code',
        caption: 'Single-branch linear recursion vs branching exponential recursion',
        code: {
          cpp: `// Single branch: depth n, 1 call per level -> O(n)
long long factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

// Branching: depth n, 2 calls per level -> O(2^n)
long long fibNaive(int n) {
    if (n <= 1) return n;
    return fibNaive(n - 1) + fibNaive(n - 2);
}`,
          java: `// Single branch: depth n, 1 call per level -> O(n)
public long factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

// Branching: depth n, 2 calls per level -> O(2^n)
public long fibNaive(int n) {
    if (n <= 1) return n;
    return fibNaive(n - 1) + fibNaive(n - 2);
}`,
          python: `# Single branch: depth n, 1 call per level -> O(n)
def factorial(n: int) -> int:
    if n <= 1: return 1
    return n * factorial(n - 1)

# Branching: depth n, 2 calls per level -> O(2^n)
def fib_naive(n: int) -> int:
    if n <= 1: return n
    return fib_naive(n - 1) + fib_naive(n - 2)`,
        },
      },
      {
        kind: 'table',
        headers: ['Algorithm', 'Branches per Call', 'Tree Depth', 'Total Calls', 'Time Complexity'],
        rows: [
          ['Factorial / linear scan', '1', 'n', 'n', 'O(n)'],
          ['Binary Search', '1 (halves input)', 'log2(n)', 'log2(n)', 'O(log n)'],
          ['Merge Sort', '2', 'log2(n)', '2n - 1', 'O(n log n)'],
          ['Naive Fibonacci', '2', 'n', '2^(n+1) - 1', 'O(2^n)'],
        ],
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Redundant subproblems cause exponential blowups',
        body: 'Drawing the call tree for fib(5) reveals that fib(3) is computed 2 times, fib(2) 3 times, and fib(1) 5 times. Storing previously computed results in an array (memoization) ensures each state is solved once, reducing complexity from O(2ⁿ) to O(n).',
      },
    ],
    keyTakeaways: [
      'Recursive time complexity equals `(total tree nodes) × (work per node)`.',
      'A tree with 1 branch per call and depth n produces n calls, scaling as O(n).',
      'A tree with 2 branches per call and depth n produces ~2ⁿ calls, scaling as O(2ⁿ).',
      'Divide-and-conquer algorithms with depth log2(n) and O(n) work per level run in O(n log n).',
    ],
    practice: {
      prompt: 'Calculate the n-th Fibonacci number. Compare the naive recursive call tree with an O(n) iterative or memoized solution.',
      leetcode: { title: 'Fibonacci Number', slug: 'fibonacci-number' },
    },
  },

  // =========================================================================
  // Lesson 9: Amortised cost: why append is O(1)
  // =========================================================================
  {
    sub: 9,
    summary: 'Explain amortised analysis and prove why dynamic array doubling achieves O(1) average append time.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Dynamic array containers — `vector.push_back()` in C++, `ArrayList.add()` in Java, and `list.append()` in Python — are documented as having **O(1) amortised** time complexity. However, when the underlying array fills up, appending an item forces the container to allocate a larger array and copy all existing elements, taking O(n) time. Understanding why append is considered O(1) requires amortised analysis.',
      },
      { kind: 'heading', text: 'Geometric doubling' },
      {
        kind: 'text',
        body: 'A dynamic array maintains `size` and `capacity`. When `size == capacity`, it cannot expand in place. Instead, it: (1) allocates a new buffer with double the capacity, (2) copies all n elements over, (3) deallocates the old buffer, and (4) stores the new element.',
      },
      {
        kind: 'code',
        caption: 'Tracking capacity doubling and cumulative copy steps',
        code: {
          cpp: `void trackDoubling() {
    int capacity = 1, size = 0;
    long long totalCopies = 0;
    for (int i = 1; i <= 8; i++) {
        if (size == capacity) {
            totalCopies += size; // copy existing
            capacity *= 2;       // double buffer
        }
        size++;
    }
}`,
          java: `public void trackDoubling() {
    int capacity = 1, size = 0;
    long totalCopies = 0;
    for (int i = 1; i <= 8; i++) {
        if (size == capacity) {
            totalCopies += size;
            capacity *= 2;
        }
        size++;
    }
}`,
          python: `def track_doubling():
    capacity = 1
    size = 0
    total_copies = 0
    for i in range(1, 9):
        if size == capacity:
            total_copies += size
            capacity *= 2
        size += 1`,
        },
      },
      { kind: 'heading', text: 'Spreading the reallocation cost' },
      {
        kind: 'text',
        body: 'Resizing happens rarely. For n appends starting at capacity 1, copies occur at sizes 1, 2, 4, 8, up to n. The total copies sum to `1 + 2 + 4 + ... + n = 2n - 1`. Adding n direct insertions gives at most `3n` total operations for n appends. The average cost per append is `3n / n = 3`, which is **O(1) amortised**.',
      },
      {
        kind: 'table',
        headers: ['Append Index', 'Size', 'Capacity', 'Copy Cost', 'Insert Cost'],
        rows: [
          ['1', '1', '1', '0', '1'],
          ['2', '2', '2 (doubled)', '1 copy', '1'],
          ['3', '3', '4 (doubled)', '2 copies', '1'],
          ['5', '5', '8 (doubled)', '4 copies', '1'],
          ['9', '9', '16 (doubled)', '8 copies', '1'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Pre-allocate capacity with reserve when size is known',
        body: { cpp: 'When you know a vector will hold n elements, call `v.reserve(n)` first. This allocates the entire capacity in a single step, eliminating all intermediate buffer copying.', java: 'When you know a list will hold n elements, create it as `new ArrayList<>(n)`. This allocates the entire capacity in a single step, eliminating all intermediate buffer copying.', python: 'When you know a list will hold n elements and will fill every slot, create it as `[0] * n` and assign by index. This allocates once instead of growing.' },
      },
    ],
    keyTakeaways: [
      'Amortised analysis averages the total cost of a sequence of operations across all operations.',
      'Dynamic arrays double their buffer when full, copying n elements once every n steps.',
      'Performing n appends incurs fewer than 3n total operations, yielding an amortised cost of O(1) per append.',
      'Expanding capacity by a fixed additive increment (+k) degrades total append time to quadratic O(n²).',
    ],
    practice: {
      prompt: 'Given an integer array nums of length n, create an array of length 2n by appending nums twice. Observe that sequential appends run in O(n) total time.',
      leetcode: { title: 'Concatenation of Array', slug: 'concatenation-of-array' },
    },
  },

  // =========================================================================
  // Lesson 10: Space complexity and the recursion stack
  // =========================================================================
  {
    sub: 10,
    summary: 'Measure auxiliary memory usage, distinguishing between heap data structures and the call stack.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Algorithm evaluation requires analysing memory as well as execution speed. **Space complexity** measures the peak memory an algorithm allocates relative to the input size n. Online judges enforce strict limits, typically 256 MB or 512 MB. Exceeding this boundary triggers **Memory Limit Exceeded (MLE)** or crashes with a stack overflow.',
      },
      { kind: 'heading', text: 'Input space versus auxiliary space' },
      {
        kind: 'text',
        body: '**Input space** is the memory needed to store the original problem arguments. **Auxiliary space** is the extra memory allocated by your algorithm to compute the answer. Unless specified otherwise, space complexity in interviews refers to auxiliary space.',
      },
      { kind: 'heading', text: 'The call stack and stack frames' },
      {
        kind: 'text',
        body: 'Each active function call places a stack frame on the call stack to store parameters and local variables. A recursive function that reaches a maximum depth of `d` consumes **O(d) auxiliary stack space**.',
      },
      {
        kind: 'code',
        caption: 'Iterative O(1) auxiliary space vs recursive O(n) auxiliary stack space',
        code: {
          cpp: `// Iterative: O(1) auxiliary space
int sumIterative(const vector<int>& nums) {
    int total = 0;
    for (int x : nums) total += x;
    return total;
}

// Recursive: O(n) auxiliary stack space
int sumRecursive(const vector<int>& nums, int i) {
    if (i == (int)nums.size()) return 0;
    return nums[i] + sumRecursive(nums, i + 1);
}`,
          java: `// Iterative: O(1) auxiliary space
public int sumIterative(int[] nums) {
    int total = 0;
    for (int x : nums) total += x;
    return total;
}

// Recursive: O(n) auxiliary stack space
public int sumRecursive(int[] nums, int i) {
    if (i == nums.length) return 0;
    return nums[i] + sumRecursive(nums, i + 1);
}`,
          python: `# Iterative: O(1) auxiliary space
def sum_iterative(nums: list[int]) -> int:
    total = 0
    for x in nums: total += x
    return total

# Recursive: O(n) auxiliary stack space
def sum_recursive(nums: list[int], i: int) -> int:
    if i == len(nums): return 0
    return nums[i] + sum_recursive(nums, i + 1)`,
        },
      },
      {
        kind: 'table',
        headers: ['Pattern / Structure', 'Auxiliary Space', 'Primary Location'],
        rows: [
          ['Scalar counters / two pointers', 'O(1)', 'CPU registers / local stack'],
          ['Fixed frequency array (26 letters)', 'O(1)', 'Stack or Heap (constant 26 entries)'],
          ['Hash table of size n', 'O(n)', 'Heap memory'],
          ['Balanced tree recursion (depth log n)', 'O(log n)', 'Call stack frames'],
          ['Linear recursion (depth n)', 'O(n)', 'Call stack frames (stack overflow risk)'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Stack overflow crashes on deep recursion',
        body: 'Processes receive a restricted stack size, often only 1 MB to 8 MB. A recursive function with 100,000 active frames will crash with a segmentation fault or StackOverflowError, even if hundreds of megabytes of heap memory remain free. Prefer iteration when depth can exceed 10,000.',
      },
    ],
    keyTakeaways: [
      'Auxiliary space measures additional memory created by an algorithm, excluding the input.',
      'In-place algorithms modify input directly and require O(1) auxiliary space.',
      'Each level of active recursion consumes a stack frame; space complexity equals maximum tree depth.',
      'Deep recursion risks stack overflow errors despite available heap space.',
    ],
    practice: {
      prompt: 'Reverse a singly linked list. Write the iterative solution using O(1) auxiliary space, and contrast it with the recursive approach that uses O(n) call stack space.',
      leetcode: { title: 'Reverse Linked List', slug: 'reverse-linked-list' },
    },
  },

  // =========================================================================
  // Lesson 11: Constraints to target complexity
  // =========================================================================
  {
    sub: 11,
    summary: 'Deduce the expected Big-O time complexity of a problem by reading its numerical constraints.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Every competitive programming problem specifies an explicit **Constraints** section defining the bounds of the input data. Experienced problem solvers inspect the constraints before designing an approach. The numerical limits indicate which algorithmic complexity the test cases accept and which will be rejected with TLE.',
      },
      { kind: 'heading', text: 'Connecting constraints to the 10⁸ budget' },
      {
        kind: 'text',
        body: 'Because standard judges permit roughly 10⁸ operations per second, you can evaluate a proposed Big-O complexity by substituting the maximum value of n. If `n = 100,000`, an O(n²) algorithm requires `(10⁵)² = 10¹⁰` operations, exceeding the budget by 100x. This immediately proves you need an **O(n log n)** or **O(n)** approach.',
      },
      {
        kind: 'table',
        headers: ['Maximum Bound', 'Target Complexity', 'Applicable Algorithmic Families'],
        rows: [
          ['n <= 11', 'O(n!)', 'Permutations, TSP brute force'],
          ['n <= 22', 'O(2^n)', 'Subsets, bitmask DP, meet-in-the-middle'],
          ['n <= 100', 'O(n^4) or O(n^3)', 'Floyd-Warshall, matrix multiplication, 3-loop search'],
          ['n <= 1,000', 'O(n^2)', 'All-pairs comparison, nested loops, 2D dynamic programming'],
          ['n <= 100,000', 'O(n log n)', 'Sorting, heap, divide and conquer, tree queries'],
          ['n <= 1,000,000', 'O(n)', 'Two pointers, sliding window, prefix sums, hash lookups'],
          ['n >= 10^9', 'O(log n) or O(1)', 'Binary search on answer, Euclidean GCD, math formulas'],
        ],
      },
      { kind: 'heading', text: 'Case study: Maximum Subarray' },
      {
        kind: 'text',
        body: 'For `nums.length <= 100,000`, an O(n²) all-subarrays search requires `10¹⁰` operations and receives TLE. Kadane algorithm runs in a single O(n) pass (`10⁵` operations) and passes in under 10 milliseconds.',
      },
      {
        kind: 'code',
        caption: 'Why n = 100,000 requires O(n) instead of O(n^2)',
        code: {
          cpp: `// O(n^2) Brute force: 10^10 operations on n = 10^5 -> TLE!
int maxSubarrayBrute(const vector<int>& nums) {
    int maxVal = INT_MIN, n = nums.size();
    for (int i = 0; i < n; i++) {
        int sum = 0;
        for (int j = i; j < n; j++) {
            sum += nums[j];
            maxVal = max(maxVal, sum);
        }
    }
    return maxVal;
}

// O(n) Kadane's Algorithm: 10^5 operations -> Passes in 5ms!
int maxSubarrayLinear(const vector<int>& nums) {
    int maxVal = nums[0], sum = nums[0];
    for (int i = 1; i < (int)nums.size(); i++) {
        sum = max(nums[i], sum + nums[i]);
        maxVal = max(maxVal, sum);
    }
    return maxVal;
}`,
          java: `// O(n^2) Brute force: 10^10 operations -> TLE!
public int maxSubarrayBrute(int[] nums) {
    int maxVal = Integer.MIN_VALUE, n = nums.length;
    for (int i = 0; i < n; i++) {
        int sum = 0;
        for (int j = i; j < n; j++) {
            sum += nums[j];
            maxVal = Math.max(maxVal, sum);
        }
    }
    return maxVal;
}

// O(n) Kadane's Algorithm: 10^5 operations -> Passes in 5ms!
public int maxSubarrayLinear(int[] nums) {
    int maxVal = nums[0], sum = nums[0];
    for (int i = 1; i < nums.length; i++) {
        sum = Math.max(nums[i], sum + nums[i]);
        maxVal = Math.max(maxVal, sum);
    }
    return maxVal;
}`,
          python: `# O(n^2) Brute force: 10^10 operations -> TLE!
def max_subarray_brute(nums: list[int]) -> int:
    max_val = float("-inf")
    for i in range(len(nums)):
        s = 0
        for j in range(i, len(nums)):
            s += nums[j]
            max_val = max(max_val, s)
    return int(max_val)

# O(n) Kadane's Algorithm: 10^5 operations -> Passes in 5ms!
def max_subarray_linear(nums: list[int]) -> int:
    max_val = s = nums[0]
    for x in nums[1:]:
        s = max(x, s + x)
        max_val = max(max_val, s)
    return max_val`,
        },
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Constraints also reveal necessary data types',
        body: 'If constraints state elements reach 10⁹ and array length is 10⁵, their total sum can reach 10¹⁴. A standard 32-bit signed integer overflows past 2 × 10⁹. In C++ and Java, store accumulators in 64-bit integer types (`long long` or `long`) to prevent arithmetic overflow.',
      },
    ],
    keyTakeaways: [
      'Always inspect the Constraints block before choosing an algorithm.',
      'Substitute maximum constraint values into target Big-O classes to verify operations stay under 10⁸.',
      'Constraints with n ≤ 20 indicate exponential backtracking; n ≤ 1,000 permits O(n²); n ≤ 100,000 demands O(n log n) or O(n).',
      'Value bounds above 10⁹ indicate the need for 64-bit integer variables.',
    ],
    practice: {
      prompt: 'Find the contiguous subarray with the largest sum. The constraint nums.length <= 100,000 requires an O(n) solution (Kadane algorithm) to avoid timing out.',
      leetcode: { title: 'Maximum Subarray', slug: 'maximum-subarray' },
    },
  },

  // =========================================================================
  // Lesson 12: Common complexity mistakes
  // =========================================================================
  {
    sub: 12,
    summary: 'Identify and resolve hidden complexity traps in string operations, linear searches, and collection manipulations.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Code that looks clean and concise can still suffer unexpected TLE errors. In most cases, the failure stems from a **hidden loop** concealed inside a standard library method or language feature. Writing a single method call does not mean the operation executes in O(1) time.',
      },
      { kind: 'heading', text: 'Three frequent hidden complexity traps' },
      {
        kind: 'text',
        body: { cpp: 'Writing `s = s + ch` inside an n-step loop builds a new string each time, taking **O(n²)** total time; `s += ch` is amortised O(1). Calling `find` on a vector scans sequentially in O(n), so m such calls are O(m × n). Erasing from the front of a vector shifts every element left, producing O(n²) total shifts over n erases.', java: 'Strings are **immutable**. Writing `s += ch` inside an n-step loop reallocates and copies the string each time, taking **O(n²)** total time. Calling `indexOf()` or `contains()` on a list scans sequentially in O(n), creating `m × O(n) = O(m × n)` nested work. Removing index 0 from an ArrayList shifts all elements left, producing O(n²) total shifts.', python: 'Strings are **immutable**. Writing `s += ch` inside an n-step loop can reallocate and copy the string each time, taking **O(n²)** total time. Using `in` or `index()` on a list scans sequentially in O(n), creating `m × O(n) = O(m × n)` nested work. `pop(0)` on a list shifts all elements left, producing O(n²) total shifts.' },
      },
      {
        kind: 'code',
        caption: 'Accidental O(n^2) hidden operations vs efficient O(n) equivalents',
        code: {
          cpp: `// Accidental O(n^2): erasing from vector front shifts all elements
void slowDrain(vector<int>& nums) {
    while (!nums.empty()) {
        nums.erase(nums.begin()); // O(n) shift per pop!
    }
}

// Correct O(n): std::deque provides O(1) front removals
void fastDrain(deque<int>& nums) {
    while (!nums.empty()) {
        nums.pop_front(); // O(1) pop
    }
}`,
          java: `// Accidental O(n^2): string concatenation in loop copies string
public String slowBuild(int n) {
    String s = "";
    for (int i = 0; i < n; i++) s += "a"; // copies string -> O(n^2)
    return s;
}

// Correct O(n): StringBuilder appends in O(1) amortised time
public String fastBuild(int n) {
    StringBuilder sb = new StringBuilder();
    for (int i = 0; i < n; i++) sb.append("a"); // O(1) append -> O(n)
    return sb.toString();
}`,
          python: `# Accidental O(m * n): 'in' on list does a linear scan
def slow_lookup(items: list[int], queries: list[int]) -> int:
    return sum(1 for q in queries if q in items) # O(n) scan inside loop!

# Correct O(n + m): set lookup operates in O(1) time
def fast_lookup(items: list[int], queries: list[int]) -> int:
    item_set = set(items) # O(n) conversion
    return sum(1 for q in queries if q in item_set) # O(1) lookup`,
        },
      },
      {
        kind: 'table',
        headers: ['Innocent-Looking Syntax', 'Hidden Cost', 'Efficient O(1) Replacement'],
        rows: [
          ['String concatenation in loop (s += ch)', 'O(n^2) due to immutability', 'StringBuilder (Java), join() (Python)'],
          ['List membership check (x in list)', 'O(n) sequential scan', 'Hash set (unordered_set, HashSet, set)'],
          ['Remove from start (pop(0), remove(0))', 'O(n) element shifting', 'Double-ended queue (std::deque, ArrayDeque, deque)'],
          ['Passing containers by value in C++', 'O(n) deep copy', 'Pass by const reference (const vector<int>&)'],
          ['List slicing in loop (arr[1:])', 'O(k) slice copy', 'Index pointers (left, right) without copying'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Passing large containers by value in recursive helpers',
        body: { cpp: 'Declaring `void helper(vector<int> nums)` without an ampersand copies the entire vector on every call. If recursion visits 10,000 states, the program creates 10,000 deep copies, causing TLE and memory exhaustion. Always pass containers by reference (`const vector<int>& nums`).', java: 'A method parameter `List<Integer> nums` is a reference; no copy happens. The hidden copy is `new ArrayList<>(nums)` or `subList(...)` materialised inside a recursive call: 10,000 states times O(n) copies is a TLE. Pass the original list and an index instead.', python: 'A function parameter is a reference; no copy happens. The hidden copy is a slice: `helper(nums[1:])` copies n elements per call, so 10,000 recursive calls copy 10,000 × n elements, which is a TLE. Pass the original list and an index instead.' },
      },
    ],
    keyTakeaways: [
      'A single method call can hide an O(n) loop: string copying, linear search, element shifting, or container cloning.',
      { cpp: 'Building a string with `s = s + c` copies the whole string each time; use `+=` or `push_back`.', java: 'Repeated string concatenation creates O(n²) overhead; use StringBuilder.', python: 'Repeated string concatenation can create O(n²) overhead; collect the parts in a list and join().' },
      'Membership checks on lists take O(n) time; convert to a hash set for O(1) lookups.',
      { cpp: 'Pass containers by reference to avoid expensive deep copies on each function call.', java: 'Passing a collection to a method passes a reference, which is O(1); copying it with `new ArrayList<>(list)` is O(n), so avoid that inside recursion.', python: 'Passing a list to a function passes a reference, which is O(1); slicing it (`a[1:]`) copies, so avoid slices inside recursion.' },
    ],
    practice: {
      prompt: 'Determine whether ransomNote can be constructed using letters from magazine. Avoid repeated linear searches or character erasures; use a frequency array to solve it in O(n + m) time.',
      leetcode: { title: 'Ransom Note', slug: 'ransom-note' },
    },
  },
];
