import type { Pattern } from './types';

/** The three DP shapes that cover most interview dynamic programming. */
export const dpPatterns: Pattern[] = [
  // ==========================================================================
  {
    slug: 'knapsack-01',
    name: '0/1 Knapsack DP',
    category: 'dp',
    oneLiner:
      'Each item is taken or skipped, once — the "include / exclude" decision table.',
    triggers: [
      'A set of items, each usable **at most once**, and a capacity or target',
      '"Can we reach exactly sum S?" — subset sum',
      '"Partition into two equal halves", "target sum with + and −"',
      '"Maximum value within weight W"',
      'The brute force is "try every subset" and n is around 100–1000',
    ],
    idea: [
      'Every 0/1 knapsack problem reduces to one question asked at each item: **take it or skip it**. `dp[i][w]` is the best you can do using the first `i` items with capacity `w`, and it equals `max(skip, take)` — where skip is `dp[i-1][w]` and take is `value[i] + dp[i-1][w - weight[i]]`. The `i-1` in both is what enforces "at most once".',
      'The subset-sum family is the same recurrence with booleans instead of values: `dp[w] = dp[w] || dp[w - num]`. Partition Equal Subset Sum, Target Sum and Last Stone Weight II are all this, wearing different stories. Recognising that a "partition into equal halves" question is really "can I hit `total / 2`?" is most of the work.',
      'The 1-D space optimisation is the part worth memorising, because it is where the bug lives. Since row `i` only depends on row `i-1`, you can keep a single array — but you must iterate the capacity **backwards**. Going forwards would let the same item be picked twice, because `dp[w - num]` would already have been updated in this pass. **Backwards means 0/1; forwards means unbounded.**',
      'Start from the recursive form if the table confuses you. Write the "take or skip" recursion, add memoisation, and only then convert to a table. The recursion is easier to get right, and the table is a mechanical translation of it.',
    ],
    time: 'O(n · W)',
    timeShort: 'O(n·W)',
    space: 'O(W) after the 1-D optimisation',
    template: {
      cpp: `// Subset sum: can any subset of nums total exactly 'target'?
vector<bool> dp(target + 1, false);
dp[0] = true;                        // empty subset always reaches 0

for (int num : nums) {
    // BACKWARDS — this is what makes each item usable only ONCE
    for (int w = target; w >= num; w--) {
        dp[w] = dp[w] || dp[w - num];   // skip it  ||  take it
    }
}
return dp[target];`,
      java: `// Subset sum: can any subset of nums total exactly 'target'?
boolean[] dp = new boolean[target + 1];
dp[0] = true;                        // empty subset always reaches 0

for (int num : nums) {
    // BACKWARDS — this is what makes each item usable only ONCE
    for (int w = target; w >= num; w--) {
        dp[w] = dp[w] || dp[w - num];   // skip it  ||  take it
    }
}
return dp[target];`,
      python: `# Subset sum: can any subset of nums total exactly 'target'?
dp = [False] * (target + 1)
dp[0] = True                         # empty subset always reaches 0

for num in nums:
    # BACKWARDS — this is what makes each item usable only ONCE
    for w in range(target, num - 1, -1):
        dp[w] = dp[w] or dp[w - num]    # skip it  or  take it

return dp[target]`,
    },
    variants: [
      {
        name: 'Maximise value (the classic knapsack)',
        when: 'Items have both a weight and a value, and you want the best total value.',
        code: {
          cpp: `vector<int> dp(W + 1, 0);

for (int i = 0; i < n; i++) {
    for (int w = W; w >= weight[i]; w--) {          // BACKWARDS
        dp[w] = max(dp[w],                          // skip
                    value[i] + dp[w - weight[i]]);  // take
    }
}
return dp[W];`,
          java: `int[] dp = new int[W + 1];

for (int i = 0; i < n; i++) {
    for (int w = W; w >= weight[i]; w--) {          // BACKWARDS
        dp[w] = Math.max(dp[w],                     // skip
                         value[i] + dp[w - weight[i]]);  // take
    }
}
return dp[W];`,
          python: `dp = [0] * (W + 1)

for i in range(n):
    for w in range(W, weight[i] - 1, -1):           # BACKWARDS
        dp[w] = max(dp[w],                          # skip
                    value[i] + dp[w - weight[i]])   # take

return dp[W]`,
        },
      },
      {
        name: 'Top-down memoisation',
        when: 'You find the recursion clearer, or the reachable state space is sparse.',
        code: {
          cpp: `map<pair<int,int>, int> memo;

int solve(int i, int w) {
    if (i == n || w == 0) return 0;              // base case
    if (memo.count({i, w})) return memo[{i, w}];

    int best = solve(i + 1, w);                  // skip
    if (weight[i] <= w)
        best = max(best, value[i] + solve(i + 1, w - weight[i]));   // take

    return memo[{i, w}] = best;
}`,
          java: `Integer[][] memo = new Integer[n + 1][W + 1];

int solve(int i, int w) {
    if (i == n || w == 0) return 0;              // base case
    if (memo[i][w] != null) return memo[i][w];

    int best = solve(i + 1, w);                  // skip
    if (weight[i] <= w)
        best = Math.max(best, value[i] + solve(i + 1, w - weight[i]));   // take

    return memo[i][w] = best;
}`,
          python: `from functools import cache

@cache                               # memoisation, for free
def solve(i, w):
    if i == n or w == 0:
        return 0                     # base case

    best = solve(i + 1, w)           # skip
    if weight[i] <= w:
        best = max(best, value[i] + solve(i + 1, w - weight[i]))   # take

    return best`,
        },
      },
    ],
    problems: [
      {
        title: 'Partition Equal Subset Sum',
        slug: 'partition-equal-subset-sum',
        difficulty: 'Medium',
        note: 'The template. Realise the target is `total / 2` and it is done.',
      },
      {
        title: 'Target Sum',
        slug: 'target-sum',
        difficulty: 'Medium',
        note: 'Assigning + and − is subset sum after one algebraic rewrite.',
      },
      {
        title: 'Last Stone Weight II',
        slug: 'last-stone-weight-ii',
        difficulty: 'Medium',
        note: 'Disguised hard. It is "split into two halves as close as possible".',
      },
      {
        title: 'Ones and Zeroes',
        slug: 'ones-and-zeroes',
        difficulty: 'Medium',
        note: 'Knapsack with two capacities — two nested backwards loops.',
      },
      {
        title: 'Profitable Schemes',
        slug: 'profitable-schemes',
        difficulty: 'Hard',
        note: 'Three dimensions. Good proof that the shape scales.',
      },
    ],
    pitfalls: [
      {
        title: 'Looping capacity forwards',
        body: 'Forwards lets the same item be used repeatedly, silently turning your 0/1 knapsack into an unbounded one. The answer comes back too large. **Backwards for 0/1, forwards for unbounded** — worth writing on a sticky note.',
      },
      {
        title: 'Forgetting `dp[0] = true`',
        body: 'The empty subset reaches sum 0. Without that seed every entry stays false and the answer is always false — this is the single most common subset-sum bug.',
      },
      {
        title: 'Not checking that the total is even',
        body: 'Partition Equal Subset Sum has no solution when the total is odd, and `total / 2` truncates into a wrong target. Return false immediately on an odd total.',
      },
      {
        title: 'Java: `int[][]` memo cannot express "not computed"',
        body: '0 is a legitimate answer, so a zero-filled `int[][]` cannot distinguish "unseen" from "computed as 0". Use `Integer[][]` and check for null, or fill with −1 and test against that.',
      },
    ],
    related: ['unbounded-knapsack', 'lcs-edit-distance', 'dfs-backtracking'],
  },

  // ==========================================================================
  {
    slug: 'unbounded-knapsack',
    name: 'Unbounded Knapsack',
    category: 'dp',
    oneLiner:
      'Same table as 0/1, but items are reusable — so the inner loop runs forwards.',
    triggers: [
      'Items may be used **any number of times**',
      '"Coin change", "how many ways to make amount X"',
      '"Rod cutting", "minimum number of perfect squares"',
      '"Unlimited supply of…"',
      '"Word break" — reusing dictionary words freely',
    ],
    idea: [
      'The recurrence is nearly identical to 0/1 knapsack, with one change: taking an item leaves you looking at the *same* item set, not a smaller one. So `take` reads `dp[i][w - weight[i]]` rather than `dp[i-1][w - weight[i]]`. In the 1-D form that single difference becomes the loop direction — **forwards, so the update you just made can be reused.**',
      'Coin Change is the archetype. For the *minimum coins* version, `dp[a] = min(dp[a], dp[a - coin] + 1)`, seeded with `dp[0] = 0` and everything else infinite. If `dp[amount]` is still infinite at the end, the amount is unreachable — return −1 rather than the sentinel.',
      'For *counting* versions the loop order carries meaning, and this trips up almost everyone. **Coins outer, amount inner** counts combinations — `{1,2}` and `{2,1}` are the same, which is what Coin Change II wants. **Amount outer, coins inner** counts permutations, which is what Combination Sum IV wants despite its name. Same body, different answer.',
      'Once you see the loop-direction and loop-order rules, the whole knapsack family collapses into one template with two switches: backwards vs forwards for reuse, and coins-outer vs amount-outer for whether order matters.',
    ],
    time: 'O(n · amount)',
    timeShort: 'O(n·W)',
    space: 'O(amount)',
    template: {
      cpp: `// Coin Change: fewest coins that total 'amount'. Coins are reusable.
vector<int> dp(amount + 1, INT_MAX);
dp[0] = 0;                           // zero coins make amount 0

for (int coin : coins) {
    // FORWARDS — lets this coin be used again in the same pass
    for (int a = coin; a <= amount; a++) {
        if (dp[a - coin] != INT_MAX)
            dp[a] = min(dp[a], dp[a - coin] + 1);
    }
}
return dp[amount] == INT_MAX ? -1 : dp[amount];`,
      java: `// Coin Change: fewest coins that total 'amount'. Coins are reusable.
int[] dp = new int[amount + 1];
Arrays.fill(dp, Integer.MAX_VALUE);
dp[0] = 0;                           // zero coins make amount 0

for (int coin : coins) {
    // FORWARDS — lets this coin be used again in the same pass
    for (int a = coin; a <= amount; a++) {
        if (dp[a - coin] != Integer.MAX_VALUE)
            dp[a] = Math.min(dp[a], dp[a - coin] + 1);
    }
}
return dp[amount] == Integer.MAX_VALUE ? -1 : dp[amount];`,
      python: `# Coin Change: fewest coins that total 'amount'. Coins are reusable.
dp = [float("inf")] * (amount + 1)
dp[0] = 0                            # zero coins make amount 0

for coin in coins:
    # FORWARDS — lets this coin be used again in the same pass
    for a in range(coin, amount + 1):
        dp[a] = min(dp[a], dp[a - coin] + 1)

return -1 if dp[amount] == float("inf") else dp[amount]`,
    },
    variants: [
      {
        name: 'Count combinations (order does NOT matter)',
        when: 'Coin Change II — {1,2} and {2,1} count once.',
        code: {
          cpp: `vector<long long> dp(amount + 1, 0);
dp[0] = 1;

for (int coin : coins)               // COINS OUTER
    for (int a = coin; a <= amount; a++)
        dp[a] += dp[a - coin];

return dp[amount];`,
          java: `long[] dp = new long[amount + 1];
dp[0] = 1;

for (int coin : coins)               // COINS OUTER
    for (int a = coin; a <= amount; a++)
        dp[a] += dp[a - coin];

return dp[amount];`,
          python: `dp = [0] * (amount + 1)
dp[0] = 1

for coin in coins:                   # COINS OUTER
    for a in range(coin, amount + 1):
        dp[a] += dp[a - coin]

return dp[amount]`,
        },
      },
      {
        name: 'Count permutations (order DOES matter)',
        when: 'Combination Sum IV — {1,2} and {2,1} count separately.',
        code: {
          cpp: `vector<long long> dp(target + 1, 0);
dp[0] = 1;

for (int a = 1; a <= target; a++)    // AMOUNT OUTER
    for (int num : nums)
        if (num <= a) dp[a] += dp[a - num];

return dp[target];`,
          java: `long[] dp = new long[target + 1];
dp[0] = 1;

for (int a = 1; a <= target; a++)    // AMOUNT OUTER
    for (int num : nums)
        if (num <= a) dp[a] += dp[a - num];

return dp[target];`,
          python: `dp = [0] * (target + 1)
dp[0] = 1

for a in range(1, target + 1):       # AMOUNT OUTER
    for num in nums:
        if num <= a:
            dp[a] += dp[a - num]

return dp[target]`,
        },
      },
    ],
    problems: [
      {
        title: 'Coin Change',
        slug: 'coin-change',
        difficulty: 'Medium',
        note: 'The template. Watch the unreachable case.',
      },
      {
        title: 'Coin Change II',
        slug: 'coin-change-ii',
        difficulty: 'Medium',
        note: 'Counting combinations — coins on the outer loop.',
      },
      {
        title: 'Combination Sum IV',
        slug: 'combination-sum-iv',
        difficulty: 'Medium',
        note: 'Counting permutations. Compare it side by side with the one above.',
      },
      {
        title: 'Perfect Squares',
        slug: 'perfect-squares',
        difficulty: 'Medium',
        note: 'Coin change where the coins are 1, 4, 9, 16…',
      },
      {
        title: 'Word Break',
        slug: 'word-break',
        difficulty: 'Medium',
        note: 'Unbounded knapsack over string positions.',
      },
    ],
    pitfalls: [
      {
        title: 'Swapping the loop order in counting problems',
        body: 'Coins outer gives combinations; amount outer gives permutations. Both compile, both run, and one is wrong for your problem. If your Coin Change II answer is far too large, this is why.',
      },
      {
        title: 'Adding 1 to an infinite sentinel',
        body: '`dp[a - coin] + 1` when `dp[a - coin]` is `INT_MAX` overflows to a negative number, which then wins the `min`. Guard it, or seed with `amount + 1` instead of `INT_MAX` — that value is unreachable but safe to add to.',
      },
      {
        title: 'Returning the sentinel instead of −1',
        body: 'When the amount cannot be formed, `dp[amount]` is still the sentinel. Coin Change wants −1. Forgetting the final translation gives a wildly wrong output on exactly one class of test.',
      },
      {
        title: 'Counting overflow',
        body: 'Combination counts grow fast — Combination Sum IV can exceed a 32-bit `int` on intermediate values even when the final answer fits. Use `long` / `long long`.',
      },
    ],
    related: ['knapsack-01', 'lcs-edit-distance', 'greedy'],
  },

  // ==========================================================================
  {
    slug: 'lcs-edit-distance',
    name: 'LCS / Edit Distance',
    category: 'dp',
    oneLiner:
      'Two strings, one grid — compare character by character and take the best neighbour.',
    triggers: [
      '**Two** strings (or two sequences) compared against each other',
      '"Longest common subsequence / substring"',
      '"Minimum operations to convert A into B"',
      '"Is A a subsequence of B?", "how many distinct subsequences?"',
      '"Delete / insert / replace" with a cost',
      '"Longest palindromic subsequence" — the string against its own reverse',
    ],
    idea: [
      'Build a grid where `dp[i][j]` answers the question for the **first `i` characters of A** against the **first `j` characters of B**. Row 0 and column 0 are the base cases (comparing against an empty string), which is why the table is `(m+1) × (n+1)` — the offset removes every boundary special case.',
      'Each cell asks one thing: do `A[i-1]` and `B[j-1]` match? **If they match**, the answer extends the diagonal: `dp[i-1][j-1] + 1`. **If they do not**, you take the better of ignoring one character from either string: `max(dp[i-1][j], dp[i][j-1])`. That is the whole of LCS.',
      'Edit distance is the same grid with three neighbours instead of two: `dp[i-1][j]` is a **delete**, `dp[i][j-1]` is an **insert**, and `dp[i-1][j-1]` is a **replace**. Take the minimum and add 1. When the characters match, the cost is simply the diagonal with nothing added.',
      'Many single-string problems are secretly this pattern. Longest Palindromic Subsequence is LCS of `s` against `reverse(s)`. "Minimum deletions to make two strings equal" is `m + n - 2 × LCS`. Spotting the second sequence is the trick.',
    ],
    time: 'O(m · n)',
    timeShort: 'O(m·n)',
    space: 'O(m · n), or O(min(m, n)) keeping two rows',
    template: {
      cpp: `// Longest Common Subsequence of a and b.
int m = a.size(), n = b.size();
vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));   // row/col 0 = empty

for (int i = 1; i <= m; i++) {
    for (int j = 1; j <= n; j++) {
        if (a[i - 1] == b[j - 1])
            dp[i][j] = dp[i - 1][j - 1] + 1;            // match -> diagonal + 1
        else
            dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]); // skip one, take better
    }
}
return dp[m][n];`,
      java: `// Longest Common Subsequence of a and b.
int m = a.length(), n = b.length();
int[][] dp = new int[m + 1][n + 1];                     // row/col 0 = empty

for (int i = 1; i <= m; i++) {
    for (int j = 1; j <= n; j++) {
        if (a.charAt(i - 1) == b.charAt(j - 1))
            dp[i][j] = dp[i - 1][j - 1] + 1;            // match -> diagonal + 1
        else
            dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);  // take better
    }
}
return dp[m][n];`,
      python: `# Longest Common Subsequence of a and b.
m, n = len(a), len(b)
dp = [[0] * (n + 1) for _ in range(m + 1)]              # row/col 0 = empty

for i in range(1, m + 1):
    for j in range(1, n + 1):
        if a[i - 1] == b[j - 1]:
            dp[i][j] = dp[i - 1][j - 1] + 1             # match -> diagonal + 1
        else:
            dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])  # skip one, take better

return dp[m][n]`,
    },
    variants: [
      {
        name: 'Edit distance',
        when: '"Minimum insert / delete / replace operations to turn A into B".',
        code: {
          cpp: `vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));

for (int i = 0; i <= m; i++) dp[i][0] = i;       // delete everything
for (int j = 0; j <= n; j++) dp[0][j] = j;       // insert everything

for (int i = 1; i <= m; i++) {
    for (int j = 1; j <= n; j++) {
        if (a[i - 1] == b[j - 1])
            dp[i][j] = dp[i - 1][j - 1];         // free — no operation
        else
            dp[i][j] = 1 + min({dp[i - 1][j],      // delete
                                dp[i][j - 1],      // insert
                                dp[i - 1][j - 1]});// replace
    }
}
return dp[m][n];`,
          java: `int[][] dp = new int[m + 1][n + 1];

for (int i = 0; i <= m; i++) dp[i][0] = i;       // delete everything
for (int j = 0; j <= n; j++) dp[0][j] = j;       // insert everything

for (int i = 1; i <= m; i++) {
    for (int j = 1; j <= n; j++) {
        if (a.charAt(i - 1) == b.charAt(j - 1))
            dp[i][j] = dp[i - 1][j - 1];         // free — no operation
        else
            dp[i][j] = 1 + Math.min(dp[i - 1][j - 1],           // replace
                            Math.min(dp[i - 1][j],              // delete
                                     dp[i][j - 1]));            // insert
    }
}
return dp[m][n];`,
          python: `dp = [[0] * (n + 1) for _ in range(m + 1)]

for i in range(m + 1):
    dp[i][0] = i                                 # delete everything
for j in range(n + 1):
    dp[0][j] = j                                 # insert everything

for i in range(1, m + 1):
    for j in range(1, n + 1):
        if a[i - 1] == b[j - 1]:
            dp[i][j] = dp[i - 1][j - 1]          # free — no operation
        else:
            dp[i][j] = 1 + min(dp[i - 1][j],     # delete
                               dp[i][j - 1],     # insert
                               dp[i - 1][j - 1]) # replace

return dp[m][n]`,
        },
      },
    ],
    problems: [
      {
        title: 'Is Subsequence',
        slug: 'is-subsequence',
        difficulty: 'Easy',
        note: 'Two pointers solve it, but framing it as LCS builds the intuition.',
      },
      {
        title: 'Longest Common Subsequence',
        slug: 'longest-common-subsequence',
        difficulty: 'Medium',
        note: 'The template exactly.',
      },
      {
        title: 'Edit Distance',
        slug: 'edit-distance',
        difficulty: 'Medium',
        note: 'The three-neighbour variant. A genuine interview favourite.',
      },
      {
        title: 'Longest Palindromic Subsequence',
        slug: 'longest-palindromic-subsequence',
        difficulty: 'Medium',
        note: 'LCS of the string with its own reverse. A lovely reframing.',
      },
      {
        title: 'Distinct Subsequences',
        slug: 'distinct-subsequences',
        difficulty: 'Hard',
        note: 'Counting rather than maximising — the recurrence adds instead of maxes.',
      },
    ],
    pitfalls: [
      {
        title: 'Indexing the strings with `i` instead of `i - 1`',
        body: 'The table is offset by one because row 0 means "empty prefix". Cell `dp[i][j]` compares `a[i-1]` with `b[j-1]`. Using `a[i]` reads one character too far and throws on the last row.',
      },
      {
        title: 'Forgetting to initialise the first row and column',
        body: 'LCS is fine with zeros, but edit distance needs `dp[i][0] = i` and `dp[0][j] = j` — the cost of deleting or inserting everything. Leaving them zero makes converting to an empty string free, and every answer comes out too small.',
      },
      {
        title: 'Confusing subsequence with substring',
        body: 'A subsequence may skip characters; a substring may not. Longest Common **Substring** uses a different recurrence — on a mismatch the cell resets to 0 rather than taking a max, and the answer is the table maximum, not `dp[m][n]`.',
      },
      {
        title: 'Rolling two rows in the wrong order',
        body: 'The O(n) space version needs `dp[i-1][j-1]` — the value from the previous row *before* it is overwritten. Save it in a temp before the assignment, or the diagonal silently becomes the current row.',
      },
    ],
    related: ['knapsack-01', 'unbounded-knapsack', 'two-pointers'],
  },
];
