import type { SharedLesson } from './types';

/**
 * Dynamic Programming Foundations — Master subproblem identification,
 * optimal substructure, top-down memoisation, bottom-up tabulation,
 * 1D state patterns, 2D grid pathing, 0/1 knapsack, and state space compression.
 */
export const lessons: SharedLesson[] = [
  // =========================================================================
  // Lesson 1: Overlapping subproblems and optimal substructure
  // =========================================================================
  {
    sub: 1,
    summary: 'Determine whether a problem exhibits overlapping subproblems and optimal substructure before attempting a dynamic programming approach.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: '**Dynamic programming** is an algorithmic technique that solves a complex problem by breaking it down into smaller constituent parts called **subproblems**, solving each distinct subproblem once, and storing its result to avoid redundant work. Dynamic programming does not apply to every computational task. It requires that a problem satisfy two core properties: **optimal substructure** and **overlapping subproblems**.',
      },
      { kind: 'heading', text: 'Optimal substructure' },
      {
        kind: 'text',
        body: 'A problem exhibits **optimal substructure** when an optimal solution to the full problem is constructed from optimal solutions to its subproblems. Consider finding the shortest path from city A to city C that passes through city B. The overall shortest route consists of the shortest path from A to B combined with the shortest path from B to C. If a problem lacks optimal substructure, solving subproblems in isolation will not yield the globally optimal answer.',
      },
      { kind: 'heading', text: 'Overlapping subproblems' },
      {
        kind: 'text',
        body: 'A problem exhibits **overlapping subproblems** when a recursive decomposition solves the identical smaller problems repeatedly across different branches of execution. In divide-and-conquer algorithms like Merge Sort, the array is partitioned into independent halves that never share work. In dynamic programming, recursive branches repeatedly converge on the same state. Without caching, this causes an exponential explosion in redundant function calls.',
      },
      {
        kind: 'code',
        caption: 'Exponential call count in un-memoised recursive Fibonacci',
        code: {
          cpp: `#include <iostream>
using namespace std;

int callCount = 0;

int fibRecursive(int n) {
    callCount++;
    if (n <= 0) return 0;
    if (n == 1) return 1;
    return fibRecursive(n - 1) + fibRecursive(n - 2);
}

int main() {
    int n = 6;
    int result = fibRecursive(n);
    cout << "fib(" << n << ") = " << result << ", total calls = " << callCount << "\\n";
    return 0;
}`,
          java: `public class Main {
    private static int callCount = 0;

    public static int fibRecursive(int n) {
        callCount++;
        if (n <= 0) return 0;
        if (n == 1) return 1;
        return fibRecursive(n - 1) + fibRecursive(n - 2);
    }

    public static void main(String[] args) {
        int n = 6;
        int result = fibRecursive(n);
        System.out.println("fib(" + n + ") = " + result + ", total calls = " + callCount);
    }
}`,
          python: `call_count = 0

def fib_recursive(n: int) -> int:
    global call_count
    call_count += 1
    if n <= 0:
        return 0
    if n == 1:
        return 1
    return fib_recursive(n - 1) + fib_recursive(n - 2)

if __name__ == "__main__":
    n = 6
    result = fib_recursive(n)
    print(f"fib({n}) = {result}, total calls = {call_count}")`,
        },
        output: 'fib(6) = 8, total calls = 25',
      },
      { kind: 'heading', text: 'Divide and conquer compared to dynamic programming' },
      {
        kind: 'table',
        headers: ['Property', 'Divide and conquer', 'Dynamic programming'],
        rows: [
          ['Subproblem overlap', 'Subproblems are independent and disjoint', 'Subproblems repeat across recursive branches'],
          ['Result caching', 'Subproblems solved once without memory storage', 'Subproblem answers recorded and reused'],
          ['Call tree structure', 'Branches into completely separate data subsets', 'Branches repeatedly visit identical subproblem states'],
          ['Canonical examples', 'Merge Sort, Quick Sort, Binary Search', 'Fibonacci, Shortest Paths, Knapsack'],
          ['Complexity impact', 'Combines subproblems in polynomial or log time', 'Reduces exponential O(2^n) trees to polynomial time'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Assuming greedy choice works when optimal substructure exists',
        body: 'Having optimal substructure does not mean a greedy algorithm will succeed. A greedy algorithm commits to a single local choice at each step without exploring alternatives. Dynamic programming considers every plausible candidate choice because an action that appears suboptimal locally might lead to the global maximum. When subproblems overlap, dynamic programming evaluates all candidate decisions without paying an exponential time penalty.',
      },
    ],
    keyTakeaways: [
      'Dynamic programming requires both optimal substructure and overlapping subproblems.',
      'Optimal substructure means the globally optimal solution is built from optimal subproblem solutions.',
      'Overlapping subproblems mean identical states are recomputed repeatedly across recursive branches.',
      'Without overlapping subproblems, caching provides no benefit and divide-and-conquer is appropriate.',
    ],
    practice: {
      prompt: 'Trace the recursive call tree for fib(4) on paper. Count how many total calls occur, identify which states repeat, and calculate how many function calls caching saves.',
      leetcode: { title: 'Fibonacci Number', slug: 'fibonacci-number' },
    },
  },

  // =========================================================================
  // Lesson 2: Memoisation: top-down
  // =========================================================================
  {
    sub: 2,
    summary: 'Convert an exponential recursive function into a linear-time top-down solution by storing subproblem results in a memoisation cache.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: '**Top-down dynamic programming**, commonly called **memoisation**, preserves the natural recursive structure of an algorithm while eliminating duplicate work. The term derives from *memorandum*, meaning a reminder of something already evaluated. Before executing a recursive branch for input parameter `n`, the function inspects a cache table. If the answer for state `n` is already present, the function returns it immediately in O(1) time. When absent, the function executes the calculation, writes the result to the cache, and returns it.',
      },
      { kind: 'heading', text: 'Collapsing the call tree into a directed acyclic graph' },
      {
        kind: 'text',
        body: 'Without memoisation, evaluating `fib(n)` triggers an execution tree with O(2^n) nodes because subproblems fork uncontrollably. With memoisation, the function evaluates each unique integer state between `0` and `n` exactly once. Every subsequent lookup of an already visited state returns in constant time. The computation changes from an exponential tree of calls into a **directed acyclic graph** of `n + 1` unique subproblem nodes and O(n) total transitions.',
      },
      {
        kind: 'code',
        caption: 'Top-down memoisation with an array cache',
        code: {
          cpp: `#include <vector>
#include <iostream>
using namespace std;

int fibMemo(int n, vector<int>& memo) {
    if (n <= 0) return 0;
    if (n == 1) return 1;
    if (memo[n] != -1) return memo[n];
    memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
    return memo[n];
}

int getFib(int n) {
    if (n <= 0) return 0;
    vector<int> memo(n + 1, -1);
    return fibMemo(n, memo);
}

int main() {
    cout << "fib(10) = " << getFib(10) << "\\n";
    return 0;
}`,
          java: `import java.util.Arrays;

public class Main {
    private static int fibMemo(int n, int[] memo) {
        if (n <= 0) return 0;
        if (n == 1) return 1;
        if (memo[n] != -1) return memo[n];
        memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
        return memo[n];
    }

    public static int getFib(int n) {
        if (n <= 0) return 0;
        int[] memo = new int[n + 1];
        Arrays.fill(memo, -1);
        return fibMemo(n, memo);
    }

    public static void main(String[] args) {
        System.out.println("fib(10) = " + getFib(10));
    }
}`,
          python: `def fib_memo(n: int, memo: list[int]) -> int:
    if n <= 0:
        return 0
    if n == 1:
        return 1
    if memo[n] != -1:
        return memo[n]
    memo[n] = fib_memo(n - 1, memo) + fib_memo(n - 2, memo)
    return memo[n]

def get_fib(n: int) -> int:
    if n <= 0:
        return 0
    memo = [-1] * (n + 1)
    return fib_memo(n, memo)

if __name__ == "__main__":
    print(f"fib(10) = {get_fib(10)}")`,
        },
        output: 'fib(10) = 55',
      },
      { kind: 'heading', text: 'Complexity transformation under memoisation' },
      {
        kind: 'table',
        headers: ['Metric', 'Naive recursion', 'Top-down memoisation'],
        rows: [
          ['Time complexity', 'O(2^n) exponential', 'O(n) linear'],
          ['Auxiliary space', 'O(n) call stack', 'O(n) table + O(n) call stack'],
          ['Total distinct states', 'n + 1 states', 'n + 1 states stored once'],
          ['State lookups', 'O(2^n) redundant evaluations', 'O(1) constant per repeat lookup'],
          ['Maximum recursion depth', 'n frames', 'n frames along leftmost branch'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Using zero as an unvisited sentinel value',
        body: 'Initialising a memoisation cache with `0` is dangerous when `0` is a legitimate computed answer. If the function evaluates a state that yields `0` and stores it, a condition checking `memo[n] != 0` will treat that cell as unvisited. The algorithm will recompute that subproblem every time it is reached, causing execution to degrade back to exponential time. Always initialise integer caches with `-1` or maintain an explicit boolean `visited` array.',
      },
    ],
    keyTakeaways: [
      'Top-down memoisation retains the recursive structure and adds a cache lookup before each calculation.',
      'Every unique subproblem is solved once; all subsequent lookups require O(1) time.',
      'Auxiliary memory includes both the cache table and the call stack frames allocated by recursion.',
      'Never choose a sentinel value that can appear as a valid subproblem result.',
    ],
    practice: {
      prompt: 'Implement a top-down memoised function to find the minimum cost to reach the top of a staircase, where step i costs cost[i] and you can take 1 or 2 steps at a time.',
      leetcode: { title: 'Min Cost Climbing Stairs', slug: 'min-cost-climbing-stairs' },
    },
  },

  // =========================================================================
  // Lesson 3: Tabulation: bottom-up
  // =========================================================================
  {
    sub: 3,
    summary: 'Build iterative bottom-up algorithms that populate a dynamic programming table from base cases to the target state.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: '**Bottom-up dynamic programming**, also known as **tabulation**, replaces recursion with iteration. Instead of starting at the final goal `n` and decomposing downward toward base cases, tabulation begins at the known base values (such as `dp[0]` and `dp[1]`) and systematically fills a table in topological order until reaching `dp[n]`. Every state is computed from already-finalised previous entries.',
      },
      { kind: 'heading', text: 'Why tabulation avoids call stack limits' },
      {
        kind: 'text',
        body: 'Top-down memoisation is intuitive to write, but it consumes call stack frames for each recursive invocation. When `n` reaches 100,000, recursion crashes with a stack overflow error in environments with fixed call stack limits. Tabulation executes inside a standard loop, using heap or stack memory allocated for the table alone. Tabulation also provides superior cache locality: sequential memory reads across a contiguous array allow CPU prefetchers to operate with maximum efficiency.',
      },
      {
        kind: 'code',
        caption: 'Iterative bottom-up tabulation',
        code: {
          cpp: `#include <vector>
#include <iostream>
using namespace std;

int fibTabulated(int n) {
    if (n <= 0) return 0;
    if (n == 1) return 1;
    vector<int> dp(n + 1, 0);
    dp[0] = 0;
    dp[1] = 1;
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
}

int main() {
    cout << "fib(10) = " << fibTabulated(10) << "\\n";
    return 0;
}`,
          java: `public class Main {
    public static int fibTabulated(int n) {
        if (n <= 0) return 0;
        if (n == 1) return 1;
        int[] dp = new int[n + 1];
        dp[0] = 0;
        dp[1] = 1;
        for (int i = 2; i <= n; i++) {
            dp[i] = dp[i - 1] + dp[i - 2];
        }
        return dp[n];
    }

    public static void main(String[] args) {
        System.out.println("fib(10) = " + fibTabulated(10));
    }
}`,
          python: `def fib_tabulated(n: int) -> int:
    if n <= 0:
        return 0
    if n == 1:
        return 1
    dp = [0] * (n + 1)
    dp[0] = 0
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]

if __name__ == "__main__":
    print(f"fib(10) = {fib_tabulated(10)}")`,
        },
        output: 'fib(10) = 55',
      },
      { kind: 'heading', text: 'Top-down memoisation versus bottom-up tabulation' },
      {
        kind: 'table',
        headers: ['Criterion', 'Top-down (memoisation)', 'Bottom-up (tabulation)'],
        rows: [
          ['Execution style', 'Recursive function calls', 'Iterative for or while loops'],
          ['State evaluation order', 'On-demand lazy evaluation', 'Systematic topological order'],
          ['State coverage', 'Evaluates only reachable states', 'Evaluates all states in range'],
          ['Call stack overhead', 'O(n) frames on system stack', 'Zero call stack overhead'],
          ['Memory compression', 'Difficult to drop historical states', 'Straightforward to discard unneeded rows'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Evaluating states out of topological order',
        body: 'In bottom-up tabulation, computing `dp[i]` requires that all states contributing to `dp[i]` already hold their final values. If your loop iterates in reverse or steps over uncomputed indices, your recurrence reads uninitialised cells. Before writing a loop, trace the state dependency direction: if state i depends on i - 1 and i - 2, your loop counter must advance from 2 toward n.',
      },
    ],
    keyTakeaways: [
      'Tabulation begins at the base cases and fills the table iteratively in topological order.',
      'Iterative loops eliminate the danger of recursion stack overflow on large inputs.',
      'Sequential array accesses benefit from hardware cache locality and predictable access patterns.',
      'Verify that all prerequisite states are computed before reading them in a transition.',
    ],
    practice: {
      prompt: 'Write an iterative bottom-up solution to calculate the fewest coins needed to make up a given amount, filling a 1D DP table from amount 0 to the target amount.',
      leetcode: { title: 'Coin Change', slug: 'coin-change' },
    },
  },

  // =========================================================================
  // Lesson 4: Fibonacci to climbing stairs
  // =========================================================================
  {
    sub: 4,
    summary: 'Map transition-based combinatorial problems onto the Fibonacci recurrence and eliminate table allocation using rolling variables.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Many counting problems that appear unrelated to mathematical sequences share an identical underlying recurrence. A standard example is the **Climbing Stairs** problem: given a staircase with `n` steps, where each step can advance by either 1 step or 2 steps, determine the total count of distinct ways to reach the top. Analysing the final move reveals the exact recurrence governing the Fibonacci sequence.',
      },
      { kind: 'heading', text: 'Decomposing the final step' },
      {
        kind: 'text',
        body: 'To arrive at step `i`, your final action must be one of two mutually exclusive choices: take a 1-step leap from step `i - 1`, or take a 2-step leap from step `i - 2`. No other moves can reach step `i`. Because these two paths arrive from distinct predecessors, the addition rule of combinatorics applies: `ways(i) = ways(i - 1) + ways(i - 2)`. The base cases are `ways(1) = 1` and `ways(2) = 2`. This matches the Fibonacci relation, shifted by one index.',
      },
      { kind: 'heading', text: 'Optimising space from O(n) to O(1)' },
      {
        kind: 'text',
        body: 'Computing `dp[i]` depends strictly on the two immediately preceding values: `dp[i - 1]` and `dp[i - 2]`. Storing the full array of size `n + 1` is unnecessary. We can maintain two scalar variables, `prev2` and `prev1`, and advance them across each iteration. This reduces auxiliary space from O(n) to O(1).',
      },
      {
        kind: 'code',
        caption: 'Climbing stairs with O(1) rolling variables',
        code: {
          cpp: `#include <iostream>
using namespace std;

int climbStairs(int n) {
    if (n <= 1) return 1;
    int prev2 = 1; // ways(0)
    int prev1 = 1; // ways(1)
    for (int i = 2; i <= n; i++) {
        int curr = prev1 + prev2;
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}

int main() {
    cout << "ways to climb 5 stairs = " << climbStairs(5) << "\\n";
    return 0;
}`,
          java: `public class Main {
    public static int climbStairs(int n) {
        if (n <= 1) return 1;
        int prev2 = 1; // ways(0)
        int prev1 = 1; // ways(1)
        for (int i = 2; i <= n; i++) {
            int curr = prev1 + prev2;
            prev2 = prev1;
            prev1 = curr;
        }
        return prev1;
    }

    public static void main(String[] args) {
        System.out.println("ways to climb 5 stairs = " + climbStairs(5));
    }
}`,
          python: `def climb_stairs(n: int) -> int:
    if n <= 1:
        return 1
    prev2 = 1  # ways(0)
    prev1 = 1  # ways(1)
    for _ in range(2, n + 1):
        curr = prev1 + prev2
        prev2 = prev1
        prev1 = curr
    return prev1

if __name__ == "__main__":
    print(f"ways to climb 5 stairs = {climb_stairs(5)}")`,
        },
        output: 'ways to climb 5 stairs = 8',
      },
      { kind: 'heading', text: 'Progression of climbing stairs solutions' },
      {
        kind: 'table',
        headers: ['Approach', 'Time complexity', 'Auxiliary space', 'Stack overhead'],
        rows: [
          ['Brute force recursion', 'O(2^n)', 'O(n)', 'O(n) call frames'],
          ['Top-down memoisation', 'O(n)', 'O(n)', 'O(n) call frames'],
          ['Bottom-up tabulation', 'O(n)', 'O(n)', 'O(1) iterations'],
          ['Rolling variables', 'O(n)', 'O(1)', 'O(1) iterations'],
        ],
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Integer overflow on large step counts',
        body: 'Fibonacci values grow at the rate of the golden ratio, approximately 1.618^n. A 32-bit signed integer overflows when n exceeds 46. When competitive programming problems ask for the answer modulo 10^9 + 7, apply the modulo operation at each addition step: `curr = (prev1 + prev2) % MOD`. In languages with fixed-width integers, failing to apply modulo to intermediate additions produces negative values due to integer overflow.',
      },
    ],
    keyTakeaways: [
      'The Climbing Stairs problem maps onto the Fibonacci recurrence by analysing the final move.',
      'Mutually exclusive transitions are combined by adding the distinct counts of their predecessors.',
      'When a state depends only on the previous k values, space can be reduced from O(n) to O(k).',
      'Apply modulo operations during addition to avoid 32-bit integer overflow on large step counts.',
    ],
    practice: {
      prompt: 'Implement the climbing stairs algorithm with O(1) auxiliary space, verifying that base cases n = 1 and n = 2 return without entering the loop.',
      leetcode: { title: 'Climbing Stairs', slug: 'climbing-stairs' },
    },
  },

  // =========================================================================
  // Lesson 5: 1D DP: the house-robber shape
  // =========================================================================
  {
    sub: 5,
    summary: 'Apply the include-or-exclude decision model to linear arrays with adjacency constraints and optimise memory to two variables.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'A fundamental pattern in 1D dynamic programming is the **include-or-exclude** choice under local constraints. The standard problem illustrating this is **House Robber**: an array `nums` represents houses along a street, where `nums[i]` is the money stored in house `i`. Adjacent houses share connected security alarms; robbing two adjacent houses on the same night triggers an alert. We must find the maximum money obtainable without robbing two adjacent houses.',
      },
      { kind: 'heading', text: 'Formulating the choice at house i' },
      {
        kind: 'text',
        body: 'Let `dp[i]` represent the maximum loot obtainable from the prefix of houses from index `0` through index `i`. At house `i`, we evaluate two mutually exclusive decisions: we either rob house `i`, or we pass on house `i`. If we rob house `i`, we collect `nums[i]` and cannot rob house `i - 1`, meaning our prior loot must come from `dp[i - 2]`. If we pass on house `i`, our loot equals `dp[i - 1]`. The recurrence selects the superior option: `dp[i] = max(dp[i - 1], nums[i] + dp[i - 2])`.',
      },
      { kind: 'heading', text: 'Base cases and space compression' },
      {
        kind: 'text',
        body: 'The base cases are direct: for a single house, `dp[0] = nums[0]`. For two houses, we can choose at most one, so `dp[1] = max(nums[0], nums[1])`. Because `dp[i]` depends solely on the two previous values, we can discard the array and retain two rolling variables, keeping space strictly O(1).',
      },
      {
        kind: 'code',
        caption: 'Space-optimised linear house robber',
        code: {
          cpp: `#include <vector>
#include <algorithm>
#include <iostream>
using namespace std;

int rob(const vector<int>& nums) {
    int n = nums.size();
    if (n == 0) return 0;
    if (n == 1) return nums[0];
    int prev2 = nums[0];
    int prev1 = max(nums[0], nums[1]);
    for (int i = 2; i < n; i++) {
        int curr = max(prev1, nums[i] + prev2);
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}

int main() {
    vector<int> nums = {2, 7, 9, 3, 1};
    cout << "max loot = " << rob(nums) << "\\n";
    return 0;
}`,
          java: `public class Main {
    public static int rob(int[] nums) {
        int n = nums.length;
        if (n == 0) return 0;
        if (n == 1) return nums[0];
        int prev2 = nums[0];
        int prev1 = Math.max(nums[0], nums[1]);
        for (int i = 2; i < n; i++) {
            int curr = Math.max(prev1, nums[i] + prev2);
            prev2 = prev1;
            prev1 = curr;
        }
        return prev1;
    }

    public static void main(String[] args) {
        int[] nums = {2, 7, 9, 3, 1};
        System.out.println("max loot = " + rob(nums));
    }
}`,
          python: `def rob(nums: list[int]) -> int:
    n = len(nums)
    if n == 0:
        return 0
    if n == 1:
        return nums[0]
    prev2 = nums[0]
    prev1 = max(nums[0], nums[1])
    for i in range(2, n):
        curr = max(prev1, nums[i] + prev2)
        prev2 = prev1
        prev1 = curr
    return prev1

if __name__ == "__main__":
    nums = [2, 7, 9, 3, 1]
    print(f"max loot = {rob(nums)}")`,
        },
        output: 'max loot = 12',
      },
      { kind: 'heading', text: 'Decision analysis at house i' },
      {
        kind: 'table',
        headers: ['Decision', 'Immediate gain', 'Permitted prior state', 'Total loot expression'],
        rows: [
          ['Include house i', 'nums[i]', 'dp[i - 2] (skips house i - 1)', 'nums[i] + dp[i - 2]'],
          ['Exclude house i', '0', 'dp[i - 1] (house i - 1 may be robbed)', 'dp[i - 1]'],
          ['Optimal choice', 'max of both options', 'N/A', 'max(dp[i - 1], nums[i] + dp[i - 2])'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Out-of-bounds access on short input arrays',
        body: 'When establishing base cases for `dp[0]` and `dp[1]`, an input array of length 0 or length 1 will cause an out-of-bounds indexing crash if you read `nums[1]` directly. Always handle `n == 0` by returning 0 and `n == 1` by returning `nums[0]` as immediate guard clauses before allocating or querying second-element variables.',
      },
    ],
    keyTakeaways: [
      'The include-or-exclude pattern evaluates whether taking an element beats skipping it.',
      'When selecting an element invalidates its neighbour, the recurrence couples nums[i] with dp[i - 2].',
      'Prefix-based state definitions allow local constraints to be enforced systematically.',
      'Guard short arrays with length checks to prevent indexing beyond the bounds of the input.',
    ],
    practice: {
      prompt: 'Implement the House Robber solution using two rolling variables. Verify that it produces correct results for empty inputs, single-element arrays, and arrays with all identical values.',
      leetcode: { title: 'House Robber', slug: 'house-robber' },
    },
  },

  // =========================================================================
  // Lesson 6: 2D DP: grid paths
  // =========================================================================
  {
    sub: 6,
    summary: 'Formulate two-dimensional dynamic programming on coordinate grids and compress table storage from O(m * n) to O(n).',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'When subproblems depend on two spatial coordinates or two independent progress counters, we transition from 1D sequences to **2D dynamic programming**. The standard archetype is grid navigation: given an `m x n` grid, a robot begins at the top-left cell `(0, 0)` and must reach the bottom-right cell `(m - 1, n - 1)`. At each step, the robot can move exclusively down or right. We want to determine the total count of **unique paths** to the destination.',
      },
      { kind: 'heading', text: 'Coordinate-based recurrence and boundaries' },
      {
        kind: 'text',
        body: 'Let `dp[i][j]` be the number of unique paths from `(0, 0)` to cell `(i, j)`. Because movement is restricted to downward and rightward steps, the robot can enter cell `(i, j)` from only two possible adjacent cells: from directly above at `(i - 1, j)`, or from directly to the left at `(i, j - 1)`. These two arrival events are disjoint, giving the recurrence: `dp[i][j] = dp[i - 1][j] + dp[i][j - 1]`.',
      },
      { kind: 'heading', text: 'Boundary conditions and 1D row compression' },
      {
        kind: 'text',
        body: 'The boundary conditions reflect physical movement constraints. Any cell in the top row (`i = 0`) can be reached solely by continuous rightward steps from `(0, 0)`, so `dp[0][j] = 1`. Any cell in the leftmost column (`j = 0`) can be reached solely by continuous downward steps, so `dp[i][0] = 1`. To compute cell `(i, j)`, we only need the value above it in the previous row and the value to its left in the current row. Storing the full `m x n` matrix is unnecessary: a single 1D array of size `n` updated row by row suffices.',
      },
      {
        kind: 'code',
        caption: 'Unique paths with 1D row compression',
        code: {
          cpp: `#include <vector>
#include <iostream>
using namespace std;

int uniquePaths(int m, int n) {
    vector<int> dp(n, 1);
    for (int i = 1; i < m; i++) {
        for (int j = 1; j < n; j++) {
            dp[j] += dp[j - 1];
        }
    }
    return dp[n - 1];
}

int main() {
    cout << "paths in 3x7 grid = " << uniquePaths(3, 7) << "\\n";
    return 0;
}`,
          java: `import java.util.Arrays;

public class Main {
    public static int uniquePaths(int m, int n) {
        int[] dp = new int[n];
        Arrays.fill(dp, 1);
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                dp[j] += dp[j - 1];
            }
        }
        return dp[n - 1];
    }

    public static void main(String[] args) {
        System.out.println("paths in 3x7 grid = " + uniquePaths(3, 7));
    }
}`,
          python: `def unique_paths(m: int, n: int) -> int:
    dp = [1] * n
    for _ in range(1, m):
        for j in range(1, n):
            dp[j] += dp[j - 1]
    return dp[n - 1]

if __name__ == "__main__":
    print(f"paths in 3x7 grid = {unique_paths(3, 7)}")`,
        },
        output: 'paths in 3x7 grid = 28',
      },
      { kind: 'heading', text: 'Common grid dynamic programming variations' },
      {
        kind: 'table',
        headers: ['Problem type', 'State definition dp[i][j]', 'Recurrence relation', 'Boundary rule'],
        rows: [
          ['Unique Paths', 'Total ways to reach (i, j)', 'dp[i-1][j] + dp[i][j-1]', 'Row 0 and Col 0 set to 1'],
          ['Minimum Path Sum', 'Min cost path to (i, j)', 'grid[i][j] + min(dp[i-1][j], dp[i][j-1])', 'Cumulative prefix sums along borders'],
          ['Paths with Obstacles', 'Ways to reach unblocked cell', '0 if obstacle, else dp[i-1][j] + dp[i][j-1]', '0 after first obstacle in row or col'],
          ['Maximum Gold Path', 'Max gold collected at (i, j)', 'grid[i][j] + max(dp[i-1][j], dp[i][j-1])', 'Cumulative prefix sums along borders'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Inverting row and column index dimensions',
        body: 'Confusing rows `m` with columns `n` is an exceptionally common bug in grid DP. In standard 2D arrays, `i` indexes rows from `0` to `m - 1`, while `j` indexes columns from `0` to `n - 1`. If you allocate an array as `dp[n][m]` instead of `dp[m][n]`, or loop `for (int j = 0; j < m; j++)`, you will encounter out-of-bounds runtime exceptions or incorrect path computations whenever `m != n`.',
      },
    ],
    keyTakeaways: [
      'Grid DP uses coordinate states dp[i][j] representing answers at specific spatial locations.',
      'Transitions combine incoming paths from valid neighbouring cells (such as above and left).',
      'Outer boundaries (first row and first column) form the base cases and must be initialised first.',
      'If state dp[i][j] depends only on row i and row i - 1, table space compresses from O(m * n) to O(n).',
    ],
    practice: {
      prompt: 'Implement the unique paths solution using a single 1D array of size n, updating values row by row for an m by n grid.',
      leetcode: { title: 'Unique Paths', slug: 'unique-paths' },
    },
  },

  // =========================================================================
  // Lesson 7: 0/1 knapsack
  // =========================================================================
  {
    sub: 7,
    summary: 'Solve the 0/1 knapsack problem and compress auxiliary memory into a single 1D array using reverse capacity iteration.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'The **0/1 knapsack problem** is the foundational archetype for resource allocation under capacity limits. You are given `n` items, where item `i` possesses a positive integer weight `weights[i]` and a value `values[i]`. You have a knapsack with a maximum weight capacity `W`. The constraint that distinguishes 0/1 knapsack from other variants is that each item can be selected at most once: either you take it (1) or you leave it (0). Fractional selections are forbidden.',
      },
      { kind: 'heading', text: 'State definition and 2D transitions' },
      {
        kind: 'text',
        body: 'We define `dp[i][w]` as the maximum total value achievable using a subset of the first `i` items with a total weight capacity limit `w`. For item `i`, we consider two possibilities: if we do not include item `i`, the value equals `dp[i - 1][w]`. If `weights[i] <= w`, we may optionally include item `i`, yielding `values[i] + dp[i - 1][w - weights[i]]`. The recurrence selects the maximum: `dp[i][w] = max(dp[i - 1][w], values[i] + dp[i - 1][w - weights[i]])`.',
      },
      { kind: 'heading', text: '1D space optimisation and reverse iteration' },
      {
        kind: 'text',
        body: 'Row `i` depends strictly on row `i - 1`. We can maintain a single array `dp` of size `W + 1`. However, we must iterate capacity `w` in **reverse order**, from `W` down to `weights[i]`. If we were to iterate forward, computing `dp[w]` would read `dp[w - weights[i]]` which had already been updated by the current item in the same pass. That would correspond to selecting the same item multiple times, accidentally solving the unbounded knapsack problem. Backward iteration guarantees that `dp[w - weights[i]]` still holds the value from the previous item pass.',
      },
      {
        kind: 'code',
        caption: '0/1 knapsack with 1D reverse-iteration table',
        code: {
          cpp: `#include <vector>
#include <algorithm>
#include <iostream>
using namespace std;

int knapsack01(int W, const vector<int>& weights, const vector<int>& values) {
    int n = weights.size();
    vector<int> dp(W + 1, 0);
    for (int i = 0; i < n; i++) {
        for (int w = W; w >= weights[i]; w--) {
            dp[w] = max(dp[w], values[i] + dp[w - weights[i]]);
        }
    }
    return dp[W];
}

int main() {
    vector<int> weights = {2, 3, 4, 5};
    vector<int> values = {3, 4, 5, 6};
    int W = 5;
    cout << "max knapsack value = " << knapsack01(W, weights, values) << "\\n";
    return 0;
}`,
          java: `public class Main {
    public static int knapsack01(int W, int[] weights, int[] values) {
        int n = weights.length;
        int[] dp = new int[W + 1];
        for (int i = 0; i < n; i++) {
            for (int w = W; w >= weights[i]; w--) {
                dp[w] = Math.max(dp[w], values[i] + dp[w - weights[i]]);
            }
        }
        return dp[W];
    }

    public static void main(String[] args) {
        int[] weights = {2, 3, 4, 5};
        int[] values = {3, 4, 5, 6};
        int W = 5;
        System.out.println("max knapsack value = " + knapsack01(W, weights, values));
    }
}`,
          python: `def knapsack_01(W: int, weights: list[int], values: list[int]) -> int:
    n = len(weights)
    dp = [0] * (W + 1)
    for i in range(n):
        for w in range(W, weights[i] - 1, -1):
            dp[w] = max(dp[w], values[i] + dp[w - weights[i]])
    return dp[W]

if __name__ == "__main__":
    weights = [2, 3, 4, 5]
    values = [3, 4, 5, 6]
    W = 5
    print(f"max knapsack value = {knapsack_01(W, weights, values)}")`,
        },
        output: 'max knapsack value = 7',
      },
      { kind: 'heading', text: 'Knapsack problem comparison' },
      {
        kind: 'table',
        headers: ['Variant', 'Item usage rule', 'Algorithm paradigm', 'Time complexity', 'Space complexity'],
        rows: [
          ['0/1 Knapsack', 'At most once per item', 'Dynamic Programming', 'O(n * W)', 'O(W) with reverse loop'],
          ['Unbounded Knapsack', 'Unlimited copies per item', 'Dynamic Programming', 'O(n * W)', 'O(W) with forward loop'],
          ['Fractional Knapsack', 'Arbitrary fractions allowed', 'Greedy (sort by value/weight)', 'O(n log n)', 'O(1)'],
          ['Subset Sum', 'Subset equals target sum', 'Dynamic Programming (boolean)', 'O(n * Target)', 'O(Target)'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Forward iteration creates unbounded item duplication',
        body: 'In 1D knapsack implementations, looping forward with `for (int w = weights[i]; w <= W; w++)` allows an item to be selected repeatedly across the capacity scan. For 0/1 knapsack, the inner loop must always count downward: `for (int w = W; w >= weights[i]; w--)`. This ensures that every element of the array used in calculating the update originates from the prior iteration where item i was not yet considered.',
      },
    ],
    keyTakeaways: [
      'The 0/1 knapsack balances capacity consumption against value maximisation.',
      'Greedy strategies fail on 0/1 knapsack because items cannot be divided fractionally.',
      'Compressing 2D knapsack DP to 1D requires iterating the capacity loop in reverse.',
      'Reverse iteration ensures each item is included at most once per subset.',
    ],
    practice: {
      prompt: 'Adapt the 0/1 knapsack 1D pattern to determine if a non-empty array of positive integers can be partitioned into two subsets with equal sums.',
      leetcode: { title: 'Partition Equal Subset Sum', slug: 'partition-equal-subset-sum' },
    },
  },

  // =========================================================================
  // Lesson 8: State design and space optimisation
  // =========================================================================
  {
    sub: 8,
    summary: 'Apply the five-step state design framework and compress multidimensional recurrences down to their minimal memory footprint.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Mastering dynamic programming requires moving beyond memorised templates to a disciplined methodology for state design. The **state** of a dynamic programming solution is the minimal set of parameters that uniquely captures a subproblem and contains sufficient information to determine future decisions without needing to inspect past history.',
      },
      { kind: 'heading', text: 'The five-step state design checklist' },
      {
        kind: 'text',
        body: 'When confronted with any dynamic programming problem, execute this systematic five-step sequence before writing code: First, describe the state variables in unambiguous plain words (such as `dp[i]` equals the maximum loot from houses 0 through i). Second, enumerate all valid decisions available at that state. Third, formulate the mathematical recurrence relation combining subproblem answers. Fourth, identify the minimal base cases where decisions terminate. Fifth, determine the topological order of evaluation to ensure prerequisites are satisfied before they are queried.',
      },
      { kind: 'heading', text: 'Decomposing non-linear constraints: House Robber II' },
      {
        kind: 'text',
        body: 'State design also governs how we address non-linear topologies. In **House Robber II**, houses are arranged in a circular ring: the first house is adjacent to the last house. This circular dependency appears to break our linear recurrence. However, we can decompose the circular constraint into two independent linear subproblems: either we exclude the first house (evaluating range `1` to `n - 1`), or we exclude the last house (evaluating range `0` to `n - 2`). Both subproblems use our linear O(1) space solver, and the final answer is the maximum of the two runs.',
      },
      {
        kind: 'code',
        caption: 'Circular state decomposition with O(1) rolling space',
        code: {
          cpp: `#include <vector>
#include <algorithm>
#include <iostream>
using namespace std;

int robLinear(const vector<int>& nums, int start, int end) {
    int prev2 = 0;
    int prev1 = 0;
    for (int i = start; i <= end; i++) {
        int curr = max(prev1, nums[i] + prev2);
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}

int robCircular(const vector<int>& nums) {
    int n = nums.size();
    if (n == 0) return 0;
    if (n == 1) return nums[0];
    return max(robLinear(nums, 0, n - 2), robLinear(nums, 1, n - 1));
}

int main() {
    vector<int> nums = {2, 3, 2};
    cout << "max circular loot = " << robCircular(nums) << "\\n";
    return 0;
}`,
          java: `public class Main {
    private static int robLinear(int[] nums, int start, int end) {
        int prev2 = 0;
        int prev1 = 0;
        for (int i = start; i <= end; i++) {
            int curr = Math.max(prev1, nums[i] + prev2);
            prev2 = prev1;
            prev1 = curr;
        }
        return prev1;
    }

    public static int robCircular(int[] nums) {
        int n = nums.length;
        if (n == 0) return 0;
        if (n == 1) return nums[0];
        return Math.max(robLinear(nums, 0, n - 2), robLinear(nums, 1, n - 1));
    }

    public static void main(String[] args) {
        int[] nums = {2, 3, 2};
        System.out.println("max circular loot = " + robCircular(nums));
    }
}`,
          python: `def rob_linear(nums: list[int], start: int, end: int) -> int:
    prev2 = 0
    prev1 = 0
    for i in range(start, end + 1):
        curr = max(prev1, nums[i] + prev2)
        prev2 = prev1
        prev1 = curr
    return prev1

def rob_circular(nums: list[int]) -> int:
    n = len(nums)
    if n == 0:
        return 0
    if n == 1:
        return nums[0]
    return max(rob_linear(nums, 0, n - 2), rob_linear(nums, 1, n - 1))

if __name__ == "__main__":
    nums = [2, 3, 2]
    print(f"max circular loot = {rob_circular(nums)}")`,
        },
        output: 'max circular loot = 3',
      },
      { kind: 'heading', text: 'Space optimisation decision matrix' },
      {
        kind: 'table',
        headers: ['Lookback dependency', 'Naive table space', 'Optimised space', 'Required iteration discipline'],
        rows: [
          ['Depends on k constant predecessors', 'O(n) 1D array', 'O(1) rolling variables', 'Shift variables at the end of each step'],
          ['Depends only on previous row i - 1', 'O(m * n) 2D array', 'O(n) single 1D row', 'Iterate backward if self-referencing in row'],
          ['Depends on prefix of same row', 'O(m * n) 2D array', 'O(n) single 1D row', 'Iterate forward to allow multiple transitions'],
          ['Arbitrary historical lookback', 'O(n) or O(n^2)', 'Cannot compress dimension', 'Full table must remain allocated in memory'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Validate the full recurrence before compressing space',
        body: 'A frequent source of bugs in technical interviews is attempting to write space-optimised code immediately. Always formulate and mentally verify the complete multidimensional recurrence first. Once the state definitions, base cases, and transitions are validated on small manual inputs, inspect the dependency lookback distance to compress dimensions into rolling variables or 1D arrays.',
      },
    ],
    keyTakeaways: [
      'Follow the 5-step checklist: define state, enumerate choices, write recurrence, set base cases, verify order.',
      'A state must contain all information required to evaluate future transitions without historical lookup.',
      'Circular or complex topologies can often be decomposed into multiple standard linear DP runs.',
      'Verify the full recurrence table for correctness before applying space compression.',
    ],
    practice: {
      prompt: 'Given an array representing house values arranged in a circle, use the 5-step checklist and rolling space optimisation to find the maximum loot without triggering alarms.',
      leetcode: { title: 'House Robber II', slug: 'house-robber-ii' },
    },
  },
];
