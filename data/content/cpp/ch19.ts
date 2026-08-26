import type { Lesson } from '../types';

/**
 * Chapter 19 — LeetCode Readiness Checklist.
 * The closing chapter: the process to apply to every problem in Phase 1, and
 * the habits that make 90 days of practice actually compound.
 */
export const ch19: Lesson[] = [
  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-19.1',
    language: 'cpp',
    summary: 'Let the constraints tell you the intended approach before you start thinking.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'The constraints are the most information-dense part of a problem statement, and most people skip them. They tell you the target complexity, the data types you need, and which edge cases will be tested.',
      },
      { kind: 'heading', text: '1. They name the target complexity' },
      {
        kind: 'table',
        headers: ['Constraint', 'Target', 'Likely approach'],
        rows: [
          ['n ≤ 10', 'O(n!)', 'Permutations, exhaustive search'],
          ['n ≤ 20', 'O(2ⁿ)', 'Subsets, bitmask DP'],
          ['n ≤ 500', 'O(n³)', 'Floyd–Warshall, interval DP'],
          ['n ≤ 5,000', 'O(n²)', 'Nested loops, 2D DP'],
          ['n ≤ 10⁵', 'O(n log n)', 'Sorting, heap, binary search'],
          ['n ≤ 10⁶', 'O(n)', 'Single pass, hash map, two pointers'],
          ['n ≤ 10⁹', 'O(log n)', 'Binary search on the answer, maths'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'A judge handles roughly 10⁸ simple operations per second',
        body: 'So n = 10⁵ with an O(n²) solution is 10¹⁰ operations — a hundred seconds, and a certain timeout. Whereas n ≤ 20 practically *announces* that an exponential solution is intended, because nothing smaller would need such a tiny bound. Reading the constraint first stops you writing a correct solution that is too slow, which is a far more frustrating way to fail than being wrong.',
      },
      { kind: 'heading', text: '2. They tell you the data type' },
      {
        kind: 'code',
        code: `// "1 <= nums.length <= 10^5"  and  "-10^9 <= nums[i] <= 10^9"
// Worst-case sum: 10^5 * 10^9 = 10^14  →  exceeds int, use long long

long long sum = 0;
for (int x : nums) sum += x;`,
      },
      {
        kind: 'text',
        body: 'Multiply out the worst case in ten seconds before writing anything. If it can exceed 2 × 10⁹, you need `long long`. This single habit prevents the most common category of silently wrong answers.',
      },
      { kind: 'heading', text: '3. They tell you which edge cases are tested' },
      {
        kind: 'code',
        code: `// "0 <= nums.length"     → the empty array WILL be tested
// "1 <= nums.length"     → it will not; you may assume at least one element
// "-10^9 <= nums[i]"     → negatives are present; sliding window may not apply
// "nums[i] != nums[j]"   → all values distinct; no duplicate handling needed
// "The answer is guaranteed to fit in a 32-bit integer"  → int is safe`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'The lower bound is the one to read carefully',
        body: '`0 <= nums.length` is an explicit promise that an empty input appears in the tests. `1 <= nums.length` frees you from that check. People routinely add unnecessary guards for the second case and omit necessary ones for the first — both are avoidable by reading one line.',
      },
      { kind: 'heading', text: '4. They rule approaches in and out' },
      {
        kind: 'code',
        code: `// "nums is sorted"              → two pointers or binary search
// "-10^4 <= nums[i]"            → negatives: sliding window will NOT work
// "nums[i] > 0"                 → all positive: sliding window IS available
// "Can you do it in O(1) space?" → no extra array; modify in place or use pointers
// "1 <= k <= nums.length"       → k is always valid, no bounds check needed`,
      },
      {
        kind: 'text',
        body: 'The presence of negative numbers is the single most decisive clue in subarray problems: it eliminates the sliding window and points at prefix sums with a hash map. That one detail changes the entire solution.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The thirty-second routine',
        body: 'Before writing anything: **1.** What is the maximum n, and what complexity does it allow? **2.** Can any value or sum exceed 2 × 10⁹? **3.** Can the input be empty, or a single element? **4.** Are negatives possible? **5.** Is the input sorted or are values distinct? Half a minute that shapes everything you write afterwards.',
      },
    ],
    keyTakeaways: [
      'The maximum n names your target complexity before you have had an idea.',
      'Multiply out the worst case to decide `int` versus `long long`.',
      'A lower bound of 0 means the empty input is genuinely tested.',
      'Negative values rule out sliding windows and point at prefix sums.',
    ],
    practice: {
      prompt: 'Take ten problems and, reading only the constraints, write down the target complexity and the required integer type before reading the question. Then check against the editorials. You will be right most of the time, which is the point.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-19.2',
    language: 'cpp',
    summary: 'Map the problem statement onto one of the patterns you already know.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Most problems are a known pattern with unfamiliar wording. Speed comes from recognition, not invention — and recognition is trainable.',
      },
      {
        kind: 'table',
        headers: ['The statement says…', 'Pattern'],
        rows: [
          ['"pair summing to target", sorted input', 'Two pointers'],
          ['"longest/shortest contiguous subarray"', 'Sliding window'],
          ['"count subarrays with sum k", negatives allowed', 'Prefix sum + hash map'],
          ['"has this appeared before", "duplicate"', 'Hash set'],
          ['"frequency", "anagram", "rearrange"', 'Frequency count'],
          ['"top k", "kth largest", "k closest"', 'Size-k heap'],
          ['"next greater", "days until warmer"', 'Monotonic stack'],
          ['"maximum of every window of size k"', 'Monotonic deque'],
          ['"minimum steps", unweighted', 'BFS'],
          ['"all combinations", "all permutations"', 'Backtracking'],
          ['"cycle", "middle", "nth from end" in a list', 'Fast and slow pointers'],
          ['"minimum x such that condition holds"', 'Binary search on the answer'],
          ['"prerequisites", "valid ordering"', 'Topological sort'],
        ],
      },
      { kind: 'heading', text: 'The questions that route you' },
      {
        kind: 'text',
        body: '**1. What is the input?** Array, string, linked list, tree, graph, or a number. This alone eliminates most patterns.',
      },
      {
        kind: 'text',
        body: '**2. Is it sorted, or would sorting help?** Sorted input strongly suggests two pointers or binary search.',
      },
      {
        kind: 'text',
        body: '**3. Is the answer contiguous?** A contiguous stretch means sliding window or prefix sum; a subset or arrangement means backtracking.',
      },
      {
        kind: 'text',
        body: '**4. Does order matter?** If not, counting probably beats scanning.',
      },
      {
        kind: 'text',
        body: '**5. What operation repeats inside the loop?** Lookup → hash map. Extreme value → heap. Nearest greater → monotonic stack.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Question 5 is the most reliable one',
        body: 'Identify the operation you would perform over and over in the brute force, then pick the container that makes *that* operation fast. That single substitution is what converts most O(n²) solutions into O(n) — it is exactly the Two Sum story, and it generalises.',
      },
      { kind: 'heading', text: 'Watch for disguises' },
      {
        kind: 'code',
        code: `// "Minimum number of coins to make an amount"
//   → not greedy; it is unbounded-knapsack DP

// "Can you split the array into two equal-sum halves?"
//   → subset-sum DP, not a scan

// "Find the duplicate without modifying the array, in O(1) space"
//   → Floyd's cycle detection applied to an array

// "Minimum eating speed to finish in h hours"
//   → binary search on the answer, not simulation

// "Number of islands"
//   → connected components via DFS/BFS`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'If nothing matches, brute force first',
        body: 'Do not sit staring at a problem trying to recall the clever solution. Write the O(n²) version, get it correct, and *then* look at which step is slow. The optimisation is usually visible from working code in a way it is not from the statement alone — and a correct slow solution is worth far more than an unfinished fast one.',
      },
      {
        kind: 'text',
        body: 'One practical note for Phase 1: after solving a problem, write down which pattern it used. After thirty problems you will have your own recognition table, built from problems you actually solved — which is far more durable than one you read.',
      },
    ],
    keyTakeaways: [
      'Most problems are known patterns in unfamiliar wording.',
      'Ask what repeats inside the loop, then pick the container that makes it fast.',
      'Contiguous answers suggest windows; subsets and arrangements suggest backtracking.',
      'When nothing matches, write brute force — the optimisation becomes visible.',
    ],
    practice: {
      prompt: 'Take twenty problem titles and descriptions and name the pattern for each without coding. Check against the editorials and note every miss. Those misses are exactly where your recognition needs work, and they are worth more than the ones you got right.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-19.3',
    language: 'cpp',
    summary: 'Pick the data structure that makes the repeated operation cheap.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Container choice is frequently the whole optimisation — the algorithm unchanged, the verdict flipping from Time Limit Exceeded to Accepted. The way to choose quickly is to ask which operation the problem repeats most, and then pick the container that makes **that** operation cheap.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The rule',
        body: 'Find the operation your algorithm performs **inside the loop**, and choose the container that makes it O(1) or O(log n). The container choice usually *is* the optimisation, not a detail added afterwards.',
      },
      {
        kind: 'table',
        headers: ['Repeated operation', 'Container', 'Cost'],
        rows: [
          ['"Have I seen this value?"', '`unordered_set`', 'O(1)'],
          ['"What value maps to this key?"', '`unordered_map`', 'O(1)'],
          ['"What is the largest/smallest?"', '`priority_queue`', 'O(log n)'],
          ['"What is the next larger key?"', '`map` / `set`', 'O(log n)'],
          ['"Most recently added"', '`stack`', 'O(1)'],
          ['"Least recently added"', '`queue`', 'O(1)'],
          ['"Add and remove at both ends"', '`deque`', 'O(1)'],
          ['"Index into a sequence"', '`vector`', 'O(1)'],
          ['"Are these two connected?"', 'Union-Find', '≈O(1)'],
          ['"Does any word start with this prefix?"', 'Trie', 'O(length)'],
        ],
      },
      { kind: 'heading', text: 'The decision, in three questions' },
      {
        kind: 'code',
        code: `// 1. Key-value pairs, or just values?
//      pairs  → map / unordered_map
//      values → set / unordered_set / vector

// 2. Do I need sorted order?
//      yes → map / set          (O(log n))
//      no  → unordered_map/set  (O(1))   ← the default

// 3. Where do insertions and removals happen?
//      back only  → vector
//      both ends  → deque
//      by priority → priority_queue`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Default to unordered; upgrade only when you need order',
        body: 'Beginners reach for `map` out of habit and pay a log factor for ordering they never use. Switch to `map`/`set` only when you genuinely need sorted iteration, the smallest/largest key, or `lower_bound` range queries.',
      },
      { kind: 'heading', text: 'When one container is not enough' },
      {
        kind: 'code',
        code: `// LRU Cache — O(1) lookup AND O(1) reordering
unordered_map<int, list<...>::iterator> pos;
list<pair<int,int>> items;

// Insert/Delete/GetRandom in O(1) — random access AND O(1) removal
vector<int> values;
unordered_map<int,int> indexOf;

// Top-K frequent — count, then rank
unordered_map<int,int> freq;
priority_queue<pair<int,int>> pq;`,
      },
      {
        kind: 'text',
        body: 'When no single container gives every operation the required complexity, pairing two is the intended answer. Recognising that is the core skill in "design a data structure" problems.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'For small fixed key ranges, an array beats a hash map',
        body: '26 letters, 128 ASCII values, 10 digits — a plain `int freq[26] = {0}` is several times faster than `unordered_map`, with no hashing and perfect cache locality. Use a hash map when the key range is genuinely large or unknown.',
      },
      {
        kind: 'text',
        body: 'A useful sanity check: `vector` and `unordered_map` between them cover the majority of problems. Start there, and reach for something more specialised only when a specific operation is measurably too slow.',
      },
    ],
    keyTakeaways: [
      'Choose the container that makes the loop\'s repeated operation cheap.',
      'Default to `unordered_*`; upgrade to `map`/`set` only for ordering.',
      'Combine two containers when one cannot give every required complexity.',
      'A fixed-size array beats a hash map for small known key ranges.',
    ],
    practice: {
      prompt: 'For ten problems you have already solved, write down the repeated inner operation and the container that made it fast. Then check whether a different container would have been better — that comparison is where the judgement develops.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-19.4',
    language: 'cpp',
    summary: 'Get something correct on the board before trying to make it fast.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Jumping straight to the optimal solution is how people freeze. Writing the obvious slow version first is not giving up — it is a technique, and it gives you three concrete things that make the fast version easier to reach.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'A correct slow solution beats an unfinished fast one',
        body: 'In an interview, brute force demonstrates that you understood the problem and can write working code. From there you optimise out loud, which is exactly the process being assessed. Silence while you search for the clever trick demonstrates nothing at all.',
      },
      {
        kind: 'code',
        caption: 'Brute force — always available',
        code: `vector<int> twoSum(vector<int>& nums, int target) {
    for (int i = 0; i < nums.size(); i++)
        for (int j = i + 1; j < nums.size(); j++)
            if (nums[i] + nums[j] == target) return {i, j};
    return {};
}
// O(n^2) — correct, and takes ninety seconds to write`,
      },
      { kind: 'heading', text: 'Why it is worth the time' },
      {
        kind: 'text',
        body: '**1. It proves you understood the problem.** If your brute force is wrong, you misread the question — far better to discover that in a simple version than inside a complex one.',
      },
      {
        kind: 'text',
        body: '**2. It gives you a reference implementation.** You can test the optimised version against it on random inputs and see exactly where they diverge.',
      },
      {
        kind: 'text',
        body: '**3. The bottleneck becomes visible.** "This inner loop is searching for a value" is obvious in code and often invisible in the problem statement.',
      },
      {
        kind: 'text',
        body: '**4. Sometimes it is fast enough.** If n ≤ 1000, O(n²) passes. Check the constraints before optimising something that does not need it.',
      },
      {
        kind: 'code',
        caption: 'Testing an optimised version against the brute force',
        code: `for (int trial = 0; trial < 1000; trial++) {
    vector<int> nums = randomVector();
    int target = rand() % 100;

    auto slow = bruteForce(nums, target);
    auto fast = optimised(nums, target);

    if (slow != fast) {
        cout << "MISMATCH on: ";
        for (int x : nums) cout << x << " ";
        cout << "\\ntarget = " << target << "\\n";
        break;
    }
}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'This finds bugs the sample tests never will',
        body: 'Random testing against a known-correct reference — "stress testing" in competitive programming — reliably surfaces the edge case that a hidden test would have caught. And it hands you a *minimal failing input*, which is far more useful than "Wrong Answer on test 47".',
      },
      { kind: 'heading', text: 'What to say while writing it' },
      {
        kind: 'text',
        body: '"Let me start with the straightforward approach so we have something correct, then improve it. Checking every pair is O(n²) — that works but will be too slow for the stated constraint of 10⁵, so once it is written I will look at replacing the inner search."',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Do not skip straight to the optimal solution from memory',
        body: 'If you have seen the problem before, writing the optimal answer immediately looks like recall rather than reasoning — and if the interviewer varies the problem slightly, you have nowhere to go. Show the progression even when you know the destination; it is the reasoning that is being graded.',
      },
    ],
    keyTakeaways: [
      'Brute force proves you understood the problem and gives a testing reference.',
      'The bottleneck is usually obvious in working code and invisible in the statement.',
      'Check the constraints — sometimes O(n²) is fast enough.',
      'Stress-test the optimised version against the brute force on random inputs.',
    ],
    practice: {
      prompt: 'For your next five problems, write brute force first every time, then optimise. Then stress-test one optimised solution against its brute force with a thousand random inputs — if it finds a bug you did not know about, the habit has already paid for itself.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-19.5',
    language: 'cpp',
    summary: 'Improve a working solution in deliberate steps rather than rewriting from scratch.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Optimisation is not inspiration. It is a short list of transformations applied to the specific step that is slow.',
      },
      { kind: 'heading', text: 'The five moves' },
      {
        kind: 'text',
        body: '**1. Replace a search with a lookup.** An inner loop hunting for a value becomes a hash map. O(n²) → O(n). This is the most common optimisation there is.',
      },
      {
        kind: 'code',
        code: `// Before — inner loop searches
for (int i = 0; i < n; i++)
    for (int j = i + 1; j < n; j++)
        if (nums[i] + nums[j] == target) ...

// After — the search becomes a lookup
unordered_map<int,int> seen;
for (int i = 0; i < n; i++) {
    if (seen.count(target - nums[i])) return {seen[target - nums[i]], i};
    seen[nums[i]] = i;
}`,
      },
      {
        kind: 'text',
        body: '**2. Sort to enable something better.** Sorting costs O(n log n) but unlocks two pointers and binary search. Worth it whenever the alternative is O(n²).',
      },
      {
        kind: 'text',
        body: '**3. Cache repeated subproblems.** If recursion recomputes the same arguments, memoise. O(2ⁿ) → O(states). This is the whole of top-down dynamic programming.',
      },
      {
        kind: 'code',
        code: `// Before — O(2^n)
int fib(int n) {
    if (n <= 1) return n;
    return fib(n-1) + fib(n-2);
}

// After — O(n)
int fib(int n, unordered_map<int,int>& memo) {
    if (n <= 1) return n;
    if (memo.count(n)) return memo[n];
    return memo[n] = fib(n-1, memo) + fib(n-2, memo);
}`,
      },
      {
        kind: 'text',
        body: '**4. Reuse work between iterations.** A sliding window updates its state incrementally instead of recomputing. A prefix-sum array answers every range query in O(1) after one pass.',
      },
      {
        kind: 'text',
        body: '**5. Cut the space.** Once the time is right, look at memory: a 2D DP table that only reads the previous row becomes two rows, or one. Interviewers ask for this as a follow-up.',
      },
      {
        kind: 'code',
        caption: 'Space reduction in DP',
        code: `// O(n * m) space
vector<vector<int>> dp(n + 1, vector<int>(m + 1, 0));

// O(m) space — only the previous row is ever read
vector<int> prev(m + 1, 0), curr(m + 1, 0);
for (int i = 1; i <= n; i++) {
    for (int j = 1; j <= m; j++)
        curr[j] = /* uses prev[j], prev[j-1], curr[j-1] */;
    swap(prev, curr);
}`,
      },
      { kind: 'heading', text: 'And the invisible costs' },
      {
        kind: 'code',
        code: `// These four LOOK linear and are not:
for (...) v.erase(v.begin());          // O(n) per erase   → O(n^2)
for (...) s = s + c;                   // O(n) per concat  → O(n^2)
for (...) process(s.substr(i));        // O(n) per copy    → O(n^2)
void dfs(vector<int> path);            // O(n) per level   → O(n^2)`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'When a correct O(n) solution still times out, check these first',
        body: 'A front-erase, a string rebuild, a `substr` in a loop, or a by-value container parameter. All four hide an O(n) inside something that looks constant. They are a more common cause of Time Limit Exceeded than a genuinely wrong algorithm.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Optimise one step at a time, and re-test after each',
        body: 'Rewriting everything at once means that when it breaks you cannot tell which change did it. Change one thing, run the tests, keep it if it works. This is slower for the first two problems and much faster thereafter.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Stop when the complexity matches the constraints',
        body: 'If n ≤ 10⁵ and you are at O(n log n), you are done — micro-optimising the constant factor is wasted effort. Optimise to the target the constraints imply, then move to the next problem.',
      },
    ],
    keyTakeaways: [
      'Replace search with lookup, sort to enable, cache repeats, reuse work, cut space.',
      'Memoising a recursion is exactly top-down dynamic programming.',
      'Check for hidden O(n) — front-erase, string concat, `substr`, by-value params.',
      'Change one thing at a time, and stop once the complexity fits the constraints.',
    ],
    practice: {
      prompt: 'Take one brute-force solution and optimise it in stages, timing after each change. Then take a 2D DP solution and reduce it to one or two rows. Both progressions are standard interview follow-ups, so having done them once makes the second time fluent.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-19.6',
    language: 'cpp',
    summary: 'Trace your code by hand before running it — the fastest debugging there is.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Running code to find out what it does is slow. Tracing it on paper with a tiny input finds most bugs faster, and it is the only debugging available in an interview.',
      },
      { kind: 'heading', text: 'How to do it' },
      {
        kind: 'text',
        body: 'Pick the smallest input that exercises the logic — three or four elements, not ten. Write the variables as columns, and fill in one row per iteration.',
      },
      {
        kind: 'code',
        caption: 'Tracing a sliding window on "abcabcbb"',
        code: `right  char   window    left   length   best
  0     a      {a}        0      1       1
  1     b      {a,b}      0      2       2
  2     c      {a,b,c}    0      3       3
  3     a      {b,c,a}    1      3       3     ← left moved past the first a
  4     b      {c,a,b}    2      3       3
  5     c      {a,b,c}    3      3       3
  6     b      {c,b}      5      2       3
  7     b      {b}        7      1       3`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The table shows what a debugger would, at zero setup cost',
        body: 'Four columns and eight rows take two minutes and reveal off-by-one errors, wrong update order, and pointers that fail to advance. In an interview it also lets you *narrate* your verification, which is a substantial part of what is being assessed.',
      },
      { kind: 'heading', text: 'The inputs worth tracing' },
      {
        kind: 'table',
        headers: ['Input', 'What it catches'],
        rows: [
          ['Empty', 'Unguarded `size() - 1`, `grid[0]`, null head'],
          ['One element', 'Loops requiring two elements, `left < right`'],
          ['Two elements', 'Binary search `mid` bugs, pointer crossing'],
          ['All identical', 'Duplicate handling, infinite shrink loops'],
          ['Already sorted / reverse sorted', 'Best and worst cases, degenerate trees'],
        ],
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Two elements is where binary search breaks',
        body: 'When the range narrows to two, integer division makes `mid == low`. If you then write `low = mid` instead of `low = mid + 1`, the range stops shrinking and the loop runs forever. Tracing a two-element array catches it immediately, whereas the sample tests usually will not.',
      },
      { kind: 'heading', text: 'When tracing is not enough' },
      {
        kind: 'code',
        caption: 'Targeted printing — one line per iteration',
        code: `for (int right = 0; right < s.size(); right++) {
    // ...
    cout << "right=" << right << " left=" << left
         << " len=" << (right - left + 1) << " best=" << best << "\\n";
}`,
      },
      {
        kind: 'code',
        caption: 'And for recursion, an indented trace',
        code: `void dfs(TreeNode* node, int depth) {
    cout << string(depth * 2, ' ') << "enter " << (node ? node->val : -1) << "\\n";
    // ...
    cout << string(depth * 2, ' ') << "exit\\n";
}`,
      },
      {
        kind: 'text',
        body: 'The indentation makes the call structure visible — every "enter" has a matching "exit", and the nesting *is* the call stack. For a recursion you do not understand, this is the single most effective technique available.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Delete debug output before submitting',
        body: 'LeetCode ignores what you print when checking the answer, but heavy printing inside a loop is slow enough to cause Time Limit Exceeded on large inputs. A solution that fails only on the biggest test is worth checking for leftover `cout` lines.',
      },
    ],
    keyTakeaways: [
      'Trace a three- or four-element input by hand before running anything.',
      'Always check empty, single, two-element, and all-identical inputs.',
      'Two elements is where binary search off-by-ones appear.',
      'Indent recursive trace output — the nesting shows the call stack.',
    ],
    practice: {
      prompt: 'Take a sliding-window solution and trace it on a five-character string in a table before running it. Then trace a binary search on a two-element array. Then add an indented trace to a recursive function and read the nesting.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-19.7',
    language: 'cpp',
    summary: 'Check the inputs that hidden tests are built from.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Hidden test cases are not random — they are constructed from a predictable list of boundaries. Checking that list before submitting catches most avoidable failures.',
      },
      { kind: 'heading', text: 'The universal checklist' },
      {
        kind: 'table',
        headers: ['Input', 'Typical failure'],
        rows: [
          ['Empty array / string', '`size() - 1` wraps; `grid[0]` crashes'],
          ['Single element', 'Loops needing two elements never run'],
          ['Two elements', 'Binary search `mid` never advances'],
          ['All identical', 'Duplicate handling; infinite shrink'],
          ['Already sorted', 'Degenerate BST; worst-case quicksort'],
          ['Reverse sorted', 'Same, from the other side'],
          ['Negative numbers', 'Sliding window invalid; `%` returns negative'],
          ['Maximum size', 'Timeouts; stack overflow in recursion'],
          ['Extreme values', '`INT_MAX` overflow; `abs(INT_MIN)`'],
        ],
      },
      { kind: 'heading', text: 'Structure-specific cases' },
      {
        kind: 'code',
        caption: 'Linked lists',
        code: `head == nullptr                 // empty list
head->next == nullptr           // single node
// two nodes — where fast/slow pointer guards break
// the target is the FIRST node — needs a dummy head
// the target is the LAST node`,
      },
      {
        kind: 'code',
        caption: 'Trees',
        code: `root == nullptr                 // empty tree
// single node — is it a leaf, and does your leaf test handle it?
// completely one-sided — depth n, may overflow the stack
// duplicate values — does your BST logic assume distinctness?`,
      },
      {
        kind: 'code',
        caption: 'Grids and graphs',
        code: `grid.empty() || grid[0].empty()    // check BEFORE reading grid[0].size()
// a 1x1 grid
// a single row or single column — non-square index confusion
// a disconnected graph — one traversal is not enough
// a self-loop, or duplicate edges`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'The three that appear most often',
        body: '**1.** `size() - 1` on an empty container wraps to a huge unsigned number. **2.** `grid[0].size()` on an empty grid crashes. **3.** A recursion with no null check dereferences a leaf\'s missing child. All three are one line of guarding, and together they account for a large share of Runtime Errors.',
      },
      {
        kind: 'code',
        caption: 'The guards themselves',
        code: `if (nums.empty()) return {};
if (grid.empty() || grid[0].empty()) return 0;
if (!root) return 0;
if (!head || !head->next) return head;

for (int i = (int)v.size() - 1; i >= 0; i--)     // cast before subtracting`,
      },
      { kind: 'heading', text: 'Numeric edge cases' },
      {
        kind: 'code',
        code: `// Overflow — check BEFORE computing, not after
if (a > INT_MAX - b) { /* would overflow */ }

// INT_MIN has no positive counterpart
int x = INT_MIN;
-x;  abs(x);                       // both overflow

// Negative modulo
-7 % 3;                            // -1 in C++, not 2
((a % m) + m) % m;                 // the safe form

// Division by zero
if (b != 0) result = a / b;`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'A thirty-second pre-submit pass',
        body: 'Empty input guarded · single-element case works · `size()` cast before subtracting · every path returns · sums that could exceed 2 × 10⁹ use `long long` · null checked before every dereference · debug `cout` removed. Half a minute, and it catches the overwhelming majority of avoidable rejections.',
      },
      {
        kind: 'text',
        body: 'A useful habit for Phase 1: when a hidden test does catch you out, add that input to your own checklist. After a few weeks it becomes personalised to the mistakes you actually make.',
      },
    ],
    keyTakeaways: [
      'Hidden tests are built from a predictable list — check it before submitting.',
      'Empty, single, two-element, all-identical and maximum-size are the constants.',
      'Guard `size() - 1`, `grid[0]`, and every pointer dereference.',
      'Check overflow before computing, and use the safe modulo for negatives.',
    ],
    practice: {
      prompt: 'Take three solved problems and run each against every input in the checklist. You will find at least one failure. Then write the checklist somewhere you will actually see it, and run through it before each submission for the first two weeks of Phase 1.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-19.8',
    language: 'cpp',
    summary: 'Read the verdict first — it tells you which kind of bug you have.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'When a submission fails, the verdict tells you which **kind** of problem you have before you read a single line of your code. Compile error, wrong answer, time limit and runtime error each point at a different class of bug and a different way of hunting it.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The verdict narrows the search enormously',
        body: 'LeetCode gives you four outcomes, and each points at a different category of mistake. Reading it before re-reading your code saves real time — most people start scanning the algorithm when the verdict already told them it is a syntax or overflow problem.',
      },
      {
        kind: 'table',
        headers: ['Verdict', 'Meaning', 'Look for'],
        rows: [
          ['**Compile Error**', 'It never ran', 'Syntax, types, missing headers'],
          ['**Runtime Error**', 'It ran and crashed', 'Out of bounds, null deref, stack overflow'],
          ['**Time Limit Exceeded**', 'Correct but too slow', 'Complexity, hidden copies, infinite loop'],
          ['**Wrong Answer**', 'It finished, wrong output', 'Logic, edge cases, off-by-one'],
        ],
      },
      { kind: 'heading', text: 'Compile Error' },
      {
        kind: 'code',
        code: `};                    // missing semicolon after class Solution
public:                // missing — methods are private by default
return -1;             // missing on some path
#include <unordered_map>   // missing header`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Fix the first error, then recompile',
        body: 'One missing semicolon can produce thirty errors, because the compiler loses track of where statements end. Always fix the topmost one and rebuild — the rest usually vanish. And read the `^` caret: it points at the exact character, and the real mistake is often on the line *above* the one reported.',
      },
      { kind: 'heading', text: 'Runtime Error' },
      {
        kind: 'code',
        code: `nums[i]                // i out of range — check bounds and <= vs <
node->val              // node is nullptr — guard first, short-circuit order
v.size() - 1           // unsigned wraparound on an empty container
a / b                  // b is zero
// deep recursion      // stack overflow on a degenerate tree or list`,
      },
      {
        kind: 'text',
        body: 'A bare Runtime Error with no message is almost always a stack overflow from deep recursion, or a null dereference. Both are checkable in under a minute.',
      },
      { kind: 'heading', text: 'Time Limit Exceeded' },
      {
        kind: 'code',
        code: `// 1. Genuinely wrong complexity — O(n^2) when 10^5 is allowed
// 2. Hidden O(n) inside a loop:
for (...) v.erase(v.begin());
for (...) s = s + c;
void dfs(vector<int> path);          // by value
// 3. Infinite loop — a while whose condition never changes
// 4. Unmemoised recursion recomputing the same subproblems
// 5. Leftover debug printing`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'TLE on a solution you believe is O(n)',
        body: 'Check the four hidden costs before doubting your algorithm — front-erase, string concatenation, `substr` in a loop, and by-value container parameters. They are a more common cause than a genuinely wrong approach, and each is a one-character fix.',
      },
      { kind: 'heading', text: 'Wrong Answer' },
      {
        kind: 'text',
        body: 'LeetCode shows the failing input. Run it locally, trace it by hand, and compare with the expected output — do not re-read the code hoping to spot the bug. The failing input is the most valuable thing you have.',
      },
      {
        kind: 'code',
        code: `// The usual causes, in rough order of frequency:
// - an edge case: empty, single element, all identical
// - off-by-one: <= instead of <, or a wrong loop bound
// - printing instead of returning
// - overflow: int where long long was needed
// - missing an un-choose in backtracking
// - reading uninitialised memory: int freq[26]; without = {0}`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Passes test 1, fails everything after',
        body: 'That specific pattern means leftover state. The judge reuses your `Solution` object, so a member variable or a `static` still holds the previous test case\'s value. Reset it at the top of the public method. The symptom is distinctive enough to diagnose instantly once you have seen it.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Separate syntax debugging from logic debugging',
        body: 'Get it compiling first, without thinking about correctness. Then test the logic on small inputs. Trying to fix both at once means every change alters two things and you cannot tell which one mattered — which is how a ten-minute bug becomes an hour.',
      },
    ],
    keyTakeaways: [
      'Read the verdict first — each one points at a different bug category.',
      'Fix the first compile error and rebuild; the rest are often knock-on.',
      'A bare Runtime Error is usually stack overflow or a null dereference.',
      '"Passes test 1, fails the rest" means unreset member or static state.',
    ],
    practice: {
      prompt: 'Deliberately trigger all four verdicts on a problem you have already solved — break the syntax, index out of range, add a slow loop, and change a comparison. Seeing each one produced on purpose makes the mapping from verdict to cause immediate.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-19.9',
    language: 'cpp',
    summary: 'Build a one-page reference so syntax never costs you thinking time.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'In a timed setting you should never be trying to recall whether it is `push` or `push_back`, or how a `priority_queue` comparator is declared. A cheat sheet you wrote yourself fixes that — and the act of writing it is most of the benefit.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Write it yourself, do not copy one',
        body: 'The value is in deciding what belongs on it. A borrowed sheet is someone else\'s memory gaps. Yours should contain exactly the things *you* look up repeatedly — which you discover by noticing every time you reach for a search engine.',
      },
      { kind: 'heading', text: 'What belongs on it' },
      {
        kind: 'code',
        caption: 'Container declarations',
        code: `vector<int> v(n, 0);
vector<vector<int>> grid(rows, vector<int>(cols, 0));
unordered_map<int,int> m;
unordered_set<int> s;
map<int,int> sorted;
priority_queue<int> maxHeap;
priority_queue<int, vector<int>, greater<int>> minHeap;
deque<int> dq;
stack<int> st;
queue<int> q;`,
      },
      {
        kind: 'code',
        caption: 'The operations whose names you confuse',
        code: `v.push_back(x);   v.pop_back();
st.push(x);       st.top();     st.pop();      // pop returns VOID
q.push(x);        q.front();    q.pop();
pq.push(x);       pq.top();     pq.pop();
dq.push_front(x); dq.push_back(x);
                  dq.pop_front(); dq.pop_back();
m.count(k);       m.find(k);    m[k];          // [] INSERTS`,
      },
      {
        kind: 'code',
        caption: 'Algorithms with their exact spelling',
        code: `sort(v.begin(), v.end());
sort(v.begin(), v.end(), greater<int>());
reverse(v.begin(), v.end());
*max_element(v.begin(), v.end());              // the star matters
accumulate(v.begin(), v.end(), 0LL);           // 0LL, not 0
lower_bound(v.begin(), v.end(), x) - v.begin();
v.erase(unique(v.begin(), v.end()), v.end());
v.erase(remove(v.begin(), v.end(), x), v.end());`,
      },
      {
        kind: 'code',
        caption: 'The node definitions',
        code: `struct ListNode {
    int val; ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

struct TreeNode {
    int val; TreeNode *left, *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};`,
      },
      {
        kind: 'code',
        caption: 'The patterns you keep re-deriving',
        code: `// Direction arrays
int dr[] = {-1,1,0,0}, dc[] = {0,0,-1,1};

// Binary search
int mid = low + (high - low) / 2;

// Safe modulo
((a % m) + m) % m;

// Character to index
c - 'a';    c - '0';

// Ceiling division
(a + b - 1) / b;

// Limits
INT_MAX, INT_MIN, LLONG_MAX          // <climits>`,
      },
      {
        kind: 'code',
        caption: 'The heap comparator — nobody remembers this one',
        code: `auto cmp = [](const pair<int,int>& a, const pair<int,int>& b) {
    return a.second > b.second;      // '>' gives a MIN-heap
};
priority_queue<pair<int,int>, vector<pair<int,int>>, decltype(cmp)> pq(cmp);`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Keep it to one page',
        body: 'A five-page reference is a book, and you will not scan it under time pressure. One page forces you to include only what you genuinely forget. If something has been on it for a month without being looked up, remove it — you know it now.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The goal is to eventually not need it',
        body: 'Every lookup you make is a signal. Write that item down, and it will fade from the sheet within a couple of weeks of use. By the end of Phase 1 most of the page should feel redundant — which is exactly the point.',
      },
    ],
    keyTakeaways: [
      'Write your own sheet — deciding what belongs on it is most of the value.',
      'Include declarations, confusable method names, and patterns you re-derive.',
      'Keep it to one page so it is scannable under time pressure.',
      'Remove items once they become automatic; the sheet should shrink.',
    ],
    practice: {
      prompt: 'Create your one-page sheet now, seeded from this lesson. Then for the next week, add an entry every single time you look something up. By the end you will have a personalised reference containing exactly your own gaps.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-19.10',
    language: 'cpp',
    summary: 'Keep a log of your own mistakes so ninety days of practice actually compounds.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'The difference between solving 200 problems and *learning* from 200 problems is whether you record what went wrong. Without a log, you will make the same mistake in week nine that you made in week two.',
      },
      { kind: 'heading', text: 'What to record' },
      {
        kind: 'code',
        caption: 'One entry, four lines',
        code: `Problem:  Subarray Sum Equals K
Pattern:  prefix sum + hash map
Mistake:  forgot seen[0] = 1, so subarrays starting at index 0 were missed
Lesson:   always seed the map with the empty prefix`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The "Lesson" line is the one that matters',
        body: 'It must be general enough to apply to a *different* problem. "Forgot seen[0] = 1" helps only with that problem; "always seed the prefix map with the empty prefix" transfers to every problem in the family. If you cannot generalise it, you have not fully understood the mistake yet.',
      },
      { kind: 'heading', text: 'Log every one of these' },
      {
        kind: 'table',
        headers: ['Situation', 'Why it is worth recording'],
        rows: [
          ['You looked at the solution', 'You did not know the pattern — that is the gap'],
          ['Wrong Answer on a hidden test', 'The edge case you did not consider'],
          ['Time Limit Exceeded', 'A complexity or hidden-cost blind spot'],
          ['It took far longer than expected', 'Something was unfamiliar — find out what'],
          ['It felt easy', 'Worth one line: which pattern, so recognition builds'],
        ],
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Reading the editorial without logging teaches you almost nothing',
        body: 'Understanding a solution and being able to produce it are different skills. If you read the answer, write down *what you would have needed to know* to find it yourself — then re-solve the problem from scratch a few days later. That second attempt is where the learning actually happens.',
      },
      { kind: 'heading', text: 'The mistakes worth watching for' },
      {
        kind: 'code',
        code: `// Syntax
// - missing ; after a class
// - forgot the * on max_element
// - int freq[26]; without = {0}

// Correctness
// - printed instead of returned
// - off-by-one: <= where < was needed
// - forgot to reset member state between test cases
// - missing un-choose in backtracking

// Complexity
// - passed a container by value into recursion
// - built a string with s = s + c
// - erased from the front of a vector in a loop

// Types
// - int where long long was needed
// - unsigned wraparound from size() - 1`,
      },
      {
        kind: 'text',
        body: 'After thirty problems, patterns in your own errors become visible. If half your entries are edge cases, your pre-submit checklist needs work. If half are complexity, revisit Chapter 10. The log tells you what to study next — which is far better than guessing.',
      },
      { kind: 'heading', text: 'How to review it' },
      {
        kind: 'text',
        body: '**Weekly**, read every entry from that week — five minutes. **Before each session**, skim the last two weeks. **Before an interview**, read the whole thing. The point is not to memorise it but to keep recent mistakes near the surface.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Re-solve, do not re-read',
        body: 'Schedule a re-attempt of any problem you needed help with — three days later, then two weeks later. Solving it again from a blank editor is what proves you learned it. Re-reading your old solution feels productive and demonstrates nothing.',
      },
      {
        kind: 'text',
        body: 'Keep it wherever you will actually open it — a text file, a spreadsheet, a notes app. The format matters far less than the habit. One entry per problem, four lines, thirty seconds.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'That is the end of Phase 0',
        body: 'You can read and write C++, you know the STL and what each operation costs, you can write recursion and backtracking, and you have the patterns that most problems reduce to. Phase 1 is 200+ problems applying exactly this. The syntax should now be automatic enough that you spend your thinking on the algorithm — which was the entire point of these nineteen chapters.',
      },
    ],
    keyTakeaways: [
      'Log four lines per problem: problem, pattern, mistake, general lesson.',
      'The lesson must transfer to a different problem, or it is not general enough.',
      'Patterns in your own mistakes tell you what to study next.',
      'Re-solve from scratch after a few days — re-reading proves nothing.',
    ],
    practice: {
      prompt: 'Start the log today with the last three problems you solved, even if they went well. Then commit to one entry per problem for all of Phase 1. It costs thirty seconds each and is the single highest-return habit in the whole plan.',
    },
  },
];
