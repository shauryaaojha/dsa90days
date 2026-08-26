import type { Pattern } from './types';

/** Heap-driven selection, greedy exchange arguments, and bit tricks. */
export const heapGreedyBitPatterns: Pattern[] = [
  // ==========================================================================
  {
    slug: 'two-heaps',
    name: 'Two Heaps',
    category: 'heap-greedy',
    oneLiner:
      'Split the data at the middle — a max-heap below, a min-heap above — and the median sits on top.',
    triggers: [
      '"Find the **median** of a stream"',
      'Values arrive one at a time and you must answer after each one',
      '"Median of a sliding window"',
      '"Balance two groups so their sizes stay within one"',
      '"IPO", "maximise capital" — one heap for what is affordable, one for what is not',
    ],
    idea: [
      'Keep the smaller half of the numbers in a **max-heap** (`low`) and the larger half in a **min-heap** (`high`). The top of `low` is the largest of the small values and the top of `high` is the smallest of the large ones — so together they straddle the median exactly. Sorting on every query would be O(n log n) each time; this is O(log n) per insert and O(1) per query.',
      'Two invariants keep it correct: every element of `low` is ≤ every element of `high`, and their sizes never differ by more than one. Insert into `low`, immediately move its top into `high` (which enforces the ordering), then move back if `high` has grown too large (which enforces the balance). Doing those three steps unconditionally, in that order, is far more reliable than branching on comparisons.',
      'Reading the median: if the sizes differ, the answer is the top of the bigger heap; if they are equal, it is the average of the two tops. Deciding up front which heap is allowed to be larger — `low` in the template below — removes an entire class of ambiguity.',
      'Most languages only give you a min-heap, so the max-heap is simulated. C++ `priority_queue` is a max-heap by default and needs `greater<>` for the min one; Java\'s `PriorityQueue` is a min-heap and needs `Collections.reverseOrder()`; Python `heapq` is a min-heap and you **negate on push and on pop**.',
    ],
    time: 'O(log n) per insert, O(1) per median query',
    timeShort: 'O(log n)',
    space: 'O(n)',
    template: {
      cpp: `priority_queue<int> low;                                  // MAX-heap: smaller half
priority_queue<int, vector<int>, greater<int>> high;      // MIN-heap: larger half

void addNum(int num) {
    low.push(num);                     // 1. always into low
    high.push(low.top()); low.pop();   // 2. move its top over -> keeps order

    if (high.size() > low.size()) {    // 3. rebalance (low may be +1)
        low.push(high.top()); high.pop();
    }
}

double findMedian() {
    if (low.size() > high.size()) return low.top();
    return (low.top() + high.top()) / 2.0;
}`,
      java: `PriorityQueue<Integer> low  = new PriorityQueue<>(Collections.reverseOrder()); // MAX
PriorityQueue<Integer> high = new PriorityQueue<>();                          // MIN

void addNum(int num) {
    low.add(num);                      // 1. always into low
    high.add(low.poll());              // 2. move its top over -> keeps order

    if (high.size() > low.size()) {    // 3. rebalance (low may be +1)
        low.add(high.poll());
    }
}

double findMedian() {
    if (low.size() > high.size()) return low.peek();
    return (low.peek() + high.peek()) / 2.0;
}`,
      python: `import heapq

low = []      # MAX-heap via NEGATED values: smaller half
high = []     # MIN-heap: larger half

def addNum(num):
    heapq.heappush(low, -num)                     # 1. always into low
    heapq.heappush(high, -heapq.heappop(low))     # 2. move top over -> order

    if len(high) > len(low):                      # 3. rebalance (low may be +1)
        heapq.heappush(low, -heapq.heappop(high))

def findMedian():
    if len(low) > len(high):
        return -low[0]
    return (-low[0] + high[0]) / 2.0`,
    },
    problems: [
      {
        title: 'Kth Largest Element in a Stream',
        slug: 'kth-largest-element-in-a-stream',
        difficulty: 'Easy',
        note: 'One heap, not two — but it builds the "heap of size k" reflex.',
      },
      {
        title: 'Last Stone Weight',
        slug: 'last-stone-weight',
        difficulty: 'Easy',
        note: 'A pure max-heap warm-up.',
      },
      {
        title: 'Find Median from Data Stream',
        slug: 'find-median-from-data-stream',
        difficulty: 'Hard',
        note: 'The template exactly. This is the problem the pattern exists for.',
      },
      {
        title: 'IPO',
        slug: 'ipo',
        difficulty: 'Hard',
        note: 'Two heaps as "affordable now" and "not yet affordable".',
      },
      {
        title: 'Sliding Window Median',
        slug: 'sliding-window-median',
        difficulty: 'Hard',
        note: 'Adds removal, which heaps do badly — needs lazy deletion.',
      },
    ],
    pitfalls: [
      {
        title: 'Python: forgetting to negate on the way out',
        body: '`heapq` has no max-heap. You push `-num` and must return `-low[0]`. Negating on push but not on read gives a median with the wrong sign, which is obvious — negating on neither is the subtle version, and silently reverses the whole structure.',
      },
      {
        title: 'Rebalancing before enforcing the order',
        body: 'Push into `low`, *then* move its top into `high`, *then* rebalance. Swapping the last two steps can leave an element in `low` that is larger than something in `high`, and the median is quietly wrong from then on.',
      },
      {
        title: 'Integer overflow when averaging',
        body: '`(low.top() + high.top()) / 2` overflows with two large ints, and integer division truncates besides. Divide by `2.0` and, in Java and C++, cast or widen before adding.',
      },
      {
        title: 'Trying to remove an arbitrary element',
        body: 'Heaps only give you the top in O(log n); deleting from the middle is O(n). For Sliding Window Median use lazy deletion — keep a map of pending removals and discard them when they surface at the top.',
      },
    ],
    related: ['greedy', 'interval-merge', 'dijkstra'],
  },

  // ==========================================================================
  {
    slug: 'greedy',
    name: 'Greedy',
    category: 'heap-greedy',
    oneLiner:
      'Take the locally best option each step — when you can argue it never costs you later.',
    triggers: [
      '"Maximum / minimum number of…" where DP feels like overkill',
      '"Can you reach the end?", "minimum jumps"',
      '"Assign / schedule / allocate to maximise…"',
      'Sorting the input makes the right choice obvious',
      '"Buy and sell stock", "gas station", "task scheduler"',
    ],
    idea: [
      'Greedy commits to the best-looking option at each step and never reconsiders. That makes it fast and short — but it is only **correct** when the problem has the exchange property: any optimal solution can be transformed into the greedy one without getting worse. Most wrong greedy answers come from skipping that check.',
      'The practical test is to try to break it. Coin Change with coins `{1, 3, 4}` and amount 6: greedy takes 4 + 1 + 1 = three coins, while the optimum is 3 + 3 = two. So greedy is wrong there and you need DP. Spending thirty seconds hunting for a counterexample before you write is the single highest-value habit in this pattern.',
      'Sorting is usually the enabling step, and choosing the key *is* the algorithm. Intervals sort by end time for "keep the most non-overlapping". Tasks sort by deadline or by frequency. If a greedy approach is not working, the sort key is the first thing to question.',
      'Many greedy solutions are just a running maximum. Jump Game tracks the furthest index reachable so far and returns false the moment the loop index passes it. Best Time to Buy and Sell Stock tracks the lowest price seen and the best profit against it. No sorting, no heap — a single pass with one or two variables.',
    ],
    time: 'O(n log n) with a sort, O(n) without',
    timeShort: 'O(n log n)',
    space: 'O(1)',
    template: {
      cpp: `// Jump Game: can we reach the last index?
int furthest = 0;

for (int i = 0; i < nums.size(); i++) {
    if (i > furthest) return false;            // this index is unreachable

    furthest = max(furthest, i + nums[i]);     // greedily extend the reach
}
return true;`,
      java: `// Jump Game: can we reach the last index?
int furthest = 0;

for (int i = 0; i < nums.length; i++) {
    if (i > furthest) return false;            // this index is unreachable

    furthest = Math.max(furthest, i + nums[i]);   // greedily extend the reach
}
return true;`,
      python: `# Jump Game: can we reach the last index?
furthest = 0

for i, jump in enumerate(nums):
    if i > furthest:
        return False                           # this index is unreachable

    furthest = max(furthest, i + jump)         # greedily extend the reach

return True`,
    },
    variants: [
      {
        name: 'Sort, then sweep',
        when: 'Activity selection — keep the most non-overlapping intervals.',
        code: {
          cpp: `// Sort by END time: finishing early leaves the most room after it.
sort(v.begin(), v.end(),
     [](auto& a, auto& b) { return a[1] < b[1]; });

int kept = 0, lastEnd = INT_MIN;

for (auto& iv : v) {
    if (iv[0] >= lastEnd) {          // no clash -> take it
        kept++;
        lastEnd = iv[1];
    }
}
return v.size() - kept;              // how many had to be removed`,
          java: `// Sort by END time: finishing early leaves the most room after it.
Arrays.sort(v, (a, b) -> Integer.compare(a[1], b[1]));

int kept = 0, lastEnd = Integer.MIN_VALUE;

for (int[] iv : v) {
    if (iv[0] >= lastEnd) {          // no clash -> take it
        kept++;
        lastEnd = iv[1];
    }
}
return v.length - kept;              // how many had to be removed`,
          python: `# Sort by END time: finishing early leaves the most room after it.
v.sort(key=lambda iv: iv[1])

kept, last_end = 0, float("-inf")

for start, end in v:
    if start >= last_end:            # no clash -> take it
        kept += 1
        last_end = end

return len(v) - kept                 # how many had to be removed`,
        },
      },
    ],
    problems: [
      {
        title: 'Best Time to Buy and Sell Stock',
        slug: 'best-time-to-buy-and-sell-stock',
        difficulty: 'Easy',
        note: 'Track the minimum so far. Greedy at its simplest.',
      },
      {
        title: 'Jump Game',
        slug: 'jump-game',
        difficulty: 'Medium',
        note: 'The template. A running maximum and nothing else.',
      },
      {
        title: 'Gas Station',
        slug: 'gas-station',
        difficulty: 'Medium',
        note: 'The "if you fail here, restart from the next one" argument.',
      },
      {
        title: 'Non-overlapping Intervals',
        slug: 'non-overlapping-intervals',
        difficulty: 'Medium',
        note: 'Sort by end time — the classic exchange argument.',
      },
      {
        title: 'Task Scheduler',
        slug: 'task-scheduler',
        difficulty: 'Medium',
        note: 'Greedy on the most frequent task, with a counting formula.',
      },
    ],
    pitfalls: [
      {
        title: 'Using greedy where DP is required',
        body: 'Coin Change with `{1, 3, 4}` and amount 6 breaks greedy — it gives 3 coins where 2 suffice. Before writing, spend thirty seconds looking for a counterexample. If you find one, switch to DP.',
      },
      {
        title: 'Sorting by the wrong key',
        body: 'Activity selection sorts by **end**, not start. Sorting by start gives a wrong answer whenever one long early interval swallows several short ones. The sort key is where the correctness lives.',
      },
      {
        title: 'Assuming a local maximum is the answer',
        body: 'Best Time to Buy and Sell Stock needs the largest *difference*, not the largest value. Tracking the maximum price instead of the minimum-so-far plus the best spread is a common misread.',
      },
      {
        title: 'Not handling the "impossible" case',
        body: 'Gas Station and Jump Game II both have inputs with no valid answer. A greedy loop happily returns a plausible-looking number for them — check reachability or total feasibility explicitly before returning.',
      },
    ],
    related: ['interval-merge', 'two-heaps', 'unbounded-knapsack'],
  },

  // ==========================================================================
  {
    slug: 'bit-manipulation',
    name: 'Bit Manipulation',
    category: 'bit-math',
    oneLiner:
      'Treat a number as 32 flags — XOR cancels pairs, and masks enumerate subsets.',
    triggers: [
      '"Every element appears twice except one"',
      '"Without using + or −", "count the 1 bits", "power of two"',
      '"Generate all subsets" of a set with n ≤ 20',
      'Constraints mention O(1) space where a hash map would be the obvious answer',
      '"Bitmask DP", "state compression", "visited set as an integer"',
    ],
    idea: [
      'The property that carries most problems is `x ^ x == 0` and `x ^ 0 == x`. XOR is commutative and associative, so XOR-ing an entire array cancels every value that appears twice and leaves the one that does not — O(n) time, O(1) space, no hash map. Single Number is that one line.',
      'Three tricks are worth committing to memory. `x & 1` tests oddness. `x & (x - 1)` clears the lowest set bit — loop until zero to count bits, or compare against 0 to test for a power of two. `x & -x` isolates the lowest set bit, which is what Fenwick trees are built on.',
      'Subset enumeration: for `n` items, the integers `0` to `2ⁿ - 1` enumerate every subset, with bit `i` meaning "item `i` is in". Testing `mask & (1 << i)` gives an iterative alternative to backtracking, and it is the foundation of bitmask DP for travelling-salesman-style problems where n ≤ 20.',
      'Shifts have sharp edges. `1 << 31` overflows a signed 32-bit int, so use `1L << i` in Java and C++ past bit 30. Java has `>>>` for a logical right shift alongside `>>`; C++ right-shifting a negative number is implementation-defined; and Python integers are unbounded, so `~x` and negative shifts behave differently from what a C++ habit expects.',
    ],
    time: 'O(1) per operation, O(n) for a scan, O(2ⁿ · n) for subset enumeration',
    timeShort: 'O(1)',
    space: 'O(1)',
    template: {
      cpp: `// Single Number: every value appears twice except one.
int result = 0;

for (int num : nums)
    result ^= num;                   // pairs cancel: x ^ x == 0

return result;

// --- the tricks worth memorising ---
bool isOdd     = x & 1;
bool isPowerOf2 = x > 0 && (x & (x - 1)) == 0;   // clears lowest set bit
int  lowestBit  = x & -x;                        // isolates lowest set bit
int  bitCount   = __builtin_popcount(x);

x |=  (1 << i);   // set bit i
x &= ~(1 << i);   // clear bit i
x ^=  (1 << i);   // flip bit i
bool on = (x >> i) & 1;   // test bit i`,
      java: `// Single Number: every value appears twice except one.
int result = 0;

for (int num : nums)
    result ^= num;                   // pairs cancel: x ^ x == 0

return result;

// --- the tricks worth memorising ---
boolean isOdd      = (x & 1) != 0;
boolean isPowerOf2 = x > 0 && (x & (x - 1)) == 0;   // clears lowest set bit
int     lowestBit  = x & -x;                        // isolates lowest set bit
int     bitCount   = Integer.bitCount(x);

x |=  (1 << i);   // set bit i
x &= ~(1 << i);   // clear bit i
x ^=  (1 << i);   // flip bit i
boolean on = ((x >> i) & 1) != 0;   // test bit i
// note: >>> is the LOGICAL right shift; >> keeps the sign`,
      python: `# Single Number: every value appears twice except one.
result = 0

for num in nums:
    result ^= num                    # pairs cancel: x ^ x == 0

return result

# --- the tricks worth memorising ---
is_odd       = x & 1
is_power_of2 = x > 0 and (x & (x - 1)) == 0    # clears lowest set bit
lowest_bit   = x & -x                          # isolates lowest set bit
bit_count    = bin(x).count("1")               # or x.bit_count() in 3.10+

x |=  (1 << i)    # set bit i
x &= ~(1 << i)    # clear bit i
x ^=  (1 << i)    # flip bit i
on = (x >> i) & 1 # test bit i
# note: Python ints are unbounded — mask with & 0xFFFFFFFF to emulate 32-bit`,
    },
    variants: [
      {
        name: 'Subset enumeration by bitmask',
        when: 'n ≤ 20 and you want all subsets without recursion.',
        code: {
          cpp: `int n = nums.size();

for (int mask = 0; mask < (1 << n); mask++) {   // every subset
    vector<int> subset;

    for (int i = 0; i < n; i++)
        if (mask & (1 << i))                    // is item i in this subset?
            subset.push_back(nums[i]);

    res.push_back(subset);
}`,
          java: `int n = nums.length;

for (int mask = 0; mask < (1 << n); mask++) {   // every subset
    List<Integer> subset = new ArrayList<>();

    for (int i = 0; i < n; i++)
        if ((mask & (1 << i)) != 0)             // is item i in this subset?
            subset.add(nums[i]);

    res.add(subset);
}`,
          python: `n = len(nums)

for mask in range(1 << n):                      # every subset
    subset = []

    for i in range(n):
        if mask & (1 << i):                     # is item i in this subset?
            subset.append(nums[i])

    res.append(subset)`,
        },
      },
    ],
    problems: [
      {
        title: 'Single Number',
        slug: 'single-number',
        difficulty: 'Easy',
        note: 'One XOR loop. The purest use of the pattern.',
      },
      {
        title: 'Number of 1 Bits',
        slug: 'number-of-1-bits',
        difficulty: 'Easy',
        note: 'The `x & (x - 1)` trick, one bit cleared per iteration.',
      },
      {
        title: 'Missing Number',
        slug: 'missing-number',
        difficulty: 'Easy',
        note: 'XOR indices against values — everything cancels but the answer.',
      },
      {
        title: 'Counting Bits',
        slug: 'counting-bits',
        difficulty: 'Easy',
        note: 'DP over bits: `dp[i] = dp[i >> 1] + (i & 1)`.',
      },
      {
        title: 'Sum of Two Integers',
        slug: 'sum-of-two-integers',
        difficulty: 'Medium',
        note: 'Addition with XOR and AND. Painful in Python, and worth knowing why.',
      },
    ],
    pitfalls: [
      {
        title: '`1 << 31` overflows a signed int',
        body: 'In C++ and Java, `1 << 31` is undefined or negative. Use `1L << i` (or `1LL`) whenever the bit index can reach 31 or beyond. The symptom is a sign flip that only shows up on large inputs.',
      },
      {
        title: 'Operator precedence around `&`',
        body: '`x & 1 == 0` parses as `x & (1 == 0)`, because `==` binds tighter than `&` in both C++ and Java. Always parenthesise: `(x & 1) == 0`. This one compiles cleanly and behaves wrongly.',
      },
      {
        title: 'Python integers have no fixed width',
        body: 'Negative numbers have infinitely many leading 1 bits, so bit-twiddling ports from C++ loop forever or return garbage. Mask with `& 0xFFFFFFFF` to emulate 32-bit, and convert back with `~(x ^ 0xFFFFFFFF)` when the result should be negative.',
      },
      {
        title: 'Java: `>>` versus `>>>`',
        body: '`>>` preserves the sign bit, so `-1 >> 1` is still `-1` and a bit-counting loop never terminates. Use `>>>` for the logical shift when treating the int as raw bits.',
      },
    ],
    related: ['hash-map-set', 'dfs-backtracking', 'prefix-sum'],
  },
];
