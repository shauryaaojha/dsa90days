import type { Lesson } from '../types';

/**
 * Java Chapter 17 — LeetCode Readiness Checklist.
 * The final chapter: not new syntax, but the working method that turns
 * knowing Java into solving problems reliably.
 */
export const ch17: Lesson[] = [
  // -------------------------------------------------------------------------
  {
    topicId: 'java-17.1',
    language: 'java',
    summary: 'Read a problem properly before writing anything.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'The most expensive mistake in DSA is not a bad algorithm — it is solving the wrong problem. Five minutes of careful reading regularly saves half an hour of debugging code that was never going to be correct.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Four questions before you type',
        body: '**What exactly is the input?** (types, ranges, sorted?, duplicates?) **What exactly is the output?** (a value, an index, a list, in what order?) **What counts as an edge case?** (empty, one element, all equal) **What does the example actually show?** — work through it by hand before trusting your reading.',
      },
      {
        kind: 'text',
        body: 'Pay particular attention to words that quietly change everything: *contiguous* versus *subsequence*, *sorted*, *distinct*, *non-negative*, *in place*, *return the index* versus *return the value*. Each of those single words decides which technique applies.',
      },
      {
        kind: 'table',
        headers: ['Word in the prompt', 'What it changes'],
        rows: [
          ['"contiguous"', 'Sliding window or prefix sum, not subsequence DP'],
          ['"subsequence"', 'Order preserved but gaps allowed — usually DP'],
          ['"sorted"', 'Two pointers or binary search become available'],
          ['"in place"', 'O(1) extra space — no building a second array'],
          ['"distinct"', 'A set is probably involved'],
          ['"may contain negatives"', 'Sliding window is invalid; use prefix + map'],
          ['"return all"', 'Backtracking, and the output is exponential'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Re-read the return type',
        body: 'Two Sum wants **indices**, not values. Many problems want a `List<List<Integer>>` where you built a `List<int[]>`. Getting this wrong produces a compile error at best and a subtly wrong answer at worst — check the signature LeetCode gave you before you start.',
      },
      {
        kind: 'text',
        body: 'Work through the provided example by hand, on paper, before coding. If your understanding produces the stated output, your reading is right. If it does not, you have just saved yourself a debugging session.',
      },
    ],
    keyTakeaways: [
      'Solving the wrong problem is the most expensive mistake available.',
      'Single words — contiguous, sorted, in place — decide the technique.',
      'Check whether the answer is an index or a value.',
      'Hand-trace the given example before writing code.',
    ],
    practice: {
      prompt: 'Take three problems you have solved and re-read their statements looking only for constraint words. Note any you missed the first time — that is the habit this lesson is building.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-17.2',
    language: 'java',
    summary: 'Read the constraints — they tell you the intended complexity.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'The constraints section is not fine print; it is a **hint about the intended solution**. A judge allows roughly 10⁸ simple operations per second, so the maximum n tells you directly what complexity is acceptable.',
      },
      {
        kind: 'table',
        headers: ['n up to', 'Acceptable complexity', 'Suggests'],
        rows: [
          ['10–20', 'O(2ⁿ), O(n!)', 'Backtracking, bitmask DP'],
          ['100–500', 'O(n³)', 'Floyd-Warshall, interval DP'],
          ['1,000–5,000', 'O(n²)', '2-D DP, nested loops'],
          ['10⁵–10⁶', 'O(n log n) or O(n)', 'Sorting, heap, two pointers, hashing'],
          ['10⁷–10⁹', 'O(log n) or O(1)', 'Binary search, or a formula'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Read the constraint before choosing the approach',
        body: 'If n ≤ 20, the problem is quietly telling you an exponential solution is *expected* — stop looking for a clever polynomial one. If n is 10⁵, an O(n²) idea is a dead end no matter how neat it looks. This single habit saves enormous amounts of time.',
      },
      {
        kind: 'text',
        body: 'The value ranges matter too, and they are what decide your types. Values up to 10⁹ summed over 10⁵ elements overflow an `int` — the total needs `long`. Watch for that in prefix sums, products and distance accumulations.',
      },
      {
        kind: 'code',
        caption: 'Overflow, and the fix',
        code: `// n = 10^5, values up to 10^4  ->  total up to 10^9, borderline
// n = 10^5, values up to 10^9  ->  total up to 10^14, definitely overflows

int sum = 0;          // WRONG for the second case
long sum = 0;         // correct

// Dijkstra distances, prefix sums, and products almost always want long.`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Overflow is silent',
        body: 'Java does not throw on integer overflow — it wraps around to a negative number and the program continues. The symptom is a bizarre negative answer on large inputs only. If a solution passes small tests and fails big ones with strange values, check your types first.',
      },
      {
        kind: 'text',
        body: 'Also read the constraints for what *cannot* happen. "1 ≤ n" means the array is never empty, so you can skip that guard. "All values are distinct" means no duplicate-handling. Constraints remove work as often as they add it.',
      },
    ],
    keyTakeaways: [
      'A judge allows roughly 10⁸ operations — n tells you the target complexity.',
      'n ≤ 20 means exponential is expected; n = 10⁵ rules out O(n²).',
      'Value ranges decide `int` versus `long`.',
      'Java overflow is silent — it wraps, it does not throw.',
    ],
    practice: {
      prompt: 'For five problems, predict the intended complexity from the constraints alone before reading any solution. Then check whether the running sum would overflow an `int`.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-17.3',
    language: 'java',
    summary: 'Choose the right Java collection in seconds.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Container choice is frequently the whole optimisation — the algorithm unchanged, the verdict flipping from Time Limit Exceeded to Accepted. Four questions settle it.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The four questions',
        body: 'Do I need **key → value**? → `HashMap`. Do I only need **membership**? → `HashSet`. Do I need **both ends**, or a stack, or a queue? → `ArrayDeque`. Do I repeatedly need the **smallest or largest**? → `PriorityQueue`. Otherwise → `ArrayList`.',
      },
      {
        kind: 'table',
        headers: ['Operation', 'ArrayList', 'ArrayDeque', 'HashMap/Set', 'TreeMap/Set', 'PriorityQueue'],
        rows: [
          ['Index access', 'O(1)', '—', '—', '—', '—'],
          ['Add at end', 'O(1)', 'O(1)', 'O(1)', 'O(log n)', 'O(log n)'],
          ['Add at front', 'O(n)', '**O(1)**', '—', '—', '—'],
          ['Contains', '**O(n)**', 'O(n)', '**O(1)**', 'O(log n)', 'O(n)'],
          ['Min / max', 'O(n)', 'O(n)', 'O(n)', '**O(1)**', '**O(1)**'],
          ['Sorted order', 'No', 'No', 'No', '**Yes**', 'No'],
        ],
      },
      {
        kind: 'code',
        caption: 'The declarations to have in muscle memory',
        code: `List<Integer> list = new ArrayList<>();
Map<Integer,Integer> map = new HashMap<>();
Set<Integer> seen = new HashSet<>();
Deque<Integer> stack = new ArrayDeque<>();
Queue<Integer> queue = new ArrayDeque<>();
PriorityQueue<Integer> minHeap = new PriorityQueue<>();
PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Comparator.reverseOrder());`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'The three habits that cause most Java timeouts',
        body: '**1.** `list.contains(x)` inside a loop — use a `HashSet`. **2.** `list.add(0, x)` or `list.remove(0)` in a loop — use `ArrayDeque`. **3.** String `+` inside a loop — use `StringBuilder`. Each turns a linear algorithm quadratic.',
      },
      {
        kind: 'text',
        body: 'When performance genuinely matters and the size is known, prefer primitive arrays: `int[]` over `List<Integer>`, and `int[26]` over `HashMap<Character,Integer>` for lowercase letters. No boxing, contiguous memory, measurably faster.',
      },
    ],
    keyTakeaways: [
      'Four questions pick the container: map? membership? ends? extremes?',
      '`contains` is O(n) on a List and O(1) on a HashSet.',
      'Avoid front operations on `ArrayList` and `+` on Strings in loops.',
      'Primitive arrays beat collections when the size is known.',
    ],
    practice: {
      prompt: 'Reproduce the complexity table from memory. Then review five past solutions and ask whether a different container would have been faster.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-17.4',
    language: 'java',
    summary: 'Write the brute force first — deliberately, not as a failure.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Jumping straight to the optimal solution is how people freeze. Writing the obvious O(n²) version first is not giving up — it is a technique, and it gives you three concrete things.',
      },
      {
        kind: 'text',
        body: '**One:** it proves you understand the problem, because a working brute force produces correct answers. **Two:** it becomes your reference implementation for testing the fast version. **Three:** the optimisation is usually visible *in* the brute force — you can see which inner loop is wasteful.',
      },
      {
        kind: 'code',
        caption: 'The optimisation is visible in the brute force',
        code: `// Brute force: for each x, SEARCH the rest for its complement
for (int i = 0; i < n; i++)
    for (int j = i + 1; j < n; j++)
        if (nums[i] + nums[j] == target) return new int[]{i, j};

// The inner loop is a SEARCH. Searches become O(1) with a hash map.
Map<Integer,Integer> seen = new HashMap<>();
for (int i = 0; i < n; i++) {
    if (seen.containsKey(target - nums[i]))
        return new int[]{seen.get(target - nums[i]), i};
    seen.put(nums[i], i);
}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Ask what the inner loop is doing',
        body: 'If it is **searching**, a hash map removes it. If it is **re-summing a range**, prefix sums remove it. If it is **finding a max**, a heap or monotonic structure removes it. If it is **recomputing a subproblem**, memoisation removes it. That question is the whole optimisation method.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'In an interview, say what you are doing',
        body: '"Let me start with the brute force to make sure I have the problem right, then optimise" is a strong opening. Silently writing O(n²) and stopping is not. The narration is what turns it from a weak answer into a deliberate method.',
      },
      {
        kind: 'text',
        body: 'For some problems the brute force *is* the answer — when n ≤ 20 and the intended solution is exponential, there is nothing to optimise. The constraints tell you which situation you are in, which is why the previous lesson comes first.',
      },
    ],
    keyTakeaways: [
      'The brute force proves you understood the problem.',
      'It becomes the reference for testing the optimised version.',
      'Ask what the inner loop does: search, re-sum, find max, or recompute.',
      'Narrate the approach in an interview rather than working silently.',
    ],
    practice: {
      prompt: 'Take a problem you already solved optimally and write its brute force. Then run both on random inputs and check they agree — that is the testing technique the next lessons build on.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-17.5',
    language: 'java',
    summary: 'Optimise in deliberate steps rather than rewriting from scratch.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Optimisation is a sequence of specific moves, not inspiration. Each one targets a particular kind of waste, and knowing the catalogue turns "make it faster" into a checklist.',
      },
      {
        kind: 'table',
        headers: ['The waste', 'The move', 'Result'],
        rows: [
          ['Inner loop searches', 'Hash map / set', 'O(n²) → O(n)'],
          ['Re-summing a range', 'Prefix sums', 'O(n²) → O(n)'],
          ['Re-scanning a window', 'Sliding window', 'O(n·k) → O(n)'],
          ['Repeated subproblems', 'Memoisation', 'O(2ⁿ) → O(n²)'],
          ['Scanning for next greater', 'Monotonic stack', 'O(n²) → O(n)'],
          ['Repeatedly finding the min', 'Heap', 'O(n²) → O(n log n)'],
          ['Searching a sorted array', 'Binary search', 'O(n) → O(log n)'],
          ['Testing every candidate answer', 'Binary search on the answer', 'O(n·R) → O(n log R)'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Optimise space only after time',
        body: 'Get to the right time complexity first, then reduce memory if the problem demands it. Rolling a 2-D DP table down to two rows, or to one, is mechanical once the recurrence is correct — and impossible to do safely before.',
      },
      {
        kind: 'code',
        caption: 'The classic space reduction',
        code: `// 2-D: dp[i][j] depends only on the previous row
int[][] dp = new int[m + 1][n + 1];

// 1-D: keep one row, iterate carefully
int[] dp = new int[n + 1];
// 0/1 knapsack -> iterate capacity BACKWARDS
// unbounded    -> iterate capacity FORWARDS`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Verify after every step',
        body: 'Run the optimised version against the brute force on random inputs after **each** change, not once at the end. When something breaks you then know exactly which move caused it — otherwise you are debugging three changes at once.',
      },
      {
        kind: 'text',
        body: 'Know when to stop. If your solution meets the constraint budget, further micro-optimisation is wasted effort. O(n log n) on n = 10⁵ is roughly 1.7 million operations — comfortably fast. Chasing O(n) there gains nothing.',
      },
    ],
    keyTakeaways: [
      'Each kind of waste has a specific matching technique.',
      'Fix time complexity first, space second.',
      'Test against the brute force after every single change.',
      'Stop once you are inside the constraint budget.',
    ],
    practice: {
      prompt: 'Take a memoised recursion and convert it to a bottom-up table, then to a one-dimensional array. Verify against the original at each step.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-17.6',
    language: 'java',
    summary: 'Dry-run your code on paper before submitting it.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A dry run is stepping through your own code by hand with a small input, writing down every variable at every iteration. It feels slow and it is the fastest debugging method available — it finds off-by-one errors that a debugger would take far longer to surface.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Use a tiny input and a table',
        body: 'Three or four elements is plenty. Draw a column per variable and a row per iteration, and fill it in honestly — writing what the code *says*, not what you meant. The discrepancy is the bug.',
      },
      {
        kind: 'code',
        caption: 'What a dry run looks like',
        code: `nums = [2, 7, 11], target = 9

i=0: nums[0]=2, need=7. seen={} -> no match. seen={2:0}
i=1: nums[1]=7, need=2. seen={2:0} -> MATCH, return [0, 1]

Correct. And notice the ordering: we LOOKED before we INSERTED,
which is why 2 was available when we reached 7.`,
      },
      {
        kind: 'text',
        body: 'Dry-run the **boundaries** specifically: the first iteration, the last iteration, and the moment a loop condition flips. That is where nearly all off-by-one errors live — the middle of a loop is rarely where things go wrong.',
      },
      {
        kind: 'table',
        headers: ['Always dry-run', 'Because'],
        rows: [
          ['Empty input', 'Does the loop body run at all? Does it return sensibly?'],
          ['One element', 'Do two-pointer and window logic still hold?'],
          ['Two elements', 'The smallest case where `l < r` matters'],
          ['All identical', 'Duplicate handling, `<` vs `<=`'],
          ['Already sorted / reversed', 'Worst cases for many algorithms'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Do not dry-run what you meant to write',
        body: 'The commonest failure is reading your own intention instead of the actual code. Point at each line as you trace it. If you find yourself saying "and then it obviously...", stop and check that line character by character.',
      },
      {
        kind: 'text',
        body: 'When a submission fails on a hidden test, use LeetCode\'s "Run" with the failing input as a custom test case, and print your key variables. That is a dry run the machine does for you, and it is the fastest way to find where reality diverged from your model.',
      },
    ],
    keyTakeaways: [
      'Trace by hand with 3–4 elements and a variable table.',
      'Focus on the first and last iterations, where off-by-ones live.',
      'Always check empty, single, and all-identical inputs.',
      'Trace the code as written, not as intended.',
    ],
    practice: {
      prompt: 'Take your last binary search and dry-run it on a two-element array with the target absent. If it terminates correctly, your loop convention is sound.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-17.7',
    language: 'java',
    summary: 'Handle the edge cases that hidden tests are built from.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Hidden test cases are not random — they are built from a predictable list of awkward inputs. Checking that list before submitting catches most failures before the judge does.',
      },
      {
        kind: 'table',
        headers: ['Category', 'Cases to check'],
        rows: [
          ['Size', 'Empty, one element, two elements'],
          ['Values', 'All equal, all negative, zeros, `Integer.MAX_VALUE`'],
          ['Order', 'Already sorted, reverse sorted'],
          ['Structure', 'Null root, single node, a completely skewed tree'],
          ['Answer', 'No valid answer exists; the answer is the whole input'],
          ['Strings', 'Empty string, one character, all identical characters'],
        ],
      },
      {
        kind: 'code',
        caption: 'Guards worth writing by reflex',
        code: `if (nums == null || nums.length == 0) return ...;
if (root == null) return ...;
if (head == null || head.next == null) return head;
if (k > nums.length) return ...;
if (!stack.isEmpty()) ...              // before every pop/peek
if (map.containsKey(k)) ...            // or use getOrDefault`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'The five exceptions you will actually hit',
        body: '`NullPointerException` — unboxing a null from a map or queue. `ArrayIndexOutOfBoundsException` — an off-by-one in a loop bound. `NoSuchElementException` — popping an empty `ArrayDeque`. `ConcurrentModificationException` — removing during a for-each. `StackOverflowError` — recursion too deep or a broken base case.',
      },
      {
        kind: 'code',
        caption: 'The two overflow traps',
        code: `int mid = lo + (hi - lo) / 2;          // not (lo + hi) / 2

Integer.compare(a, b);                 // not a - b in a comparator

long sum = 0;                          // not int, for accumulations`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Read the constraints before adding guards',
        body: 'If the problem guarantees `1 ≤ n`, an empty-array check is dead code. Guards are not free — they add noise, and an interviewer may ask why you wrote one the constraints rule out. Guard against what can actually happen.',
      },
      {
        kind: 'text',
        body: 'A useful habit before submitting: mentally run your solution on the empty input, the single-element input, and the all-identical input. Thirty seconds, and it catches the majority of edge-case failures.',
      },
    ],
    keyTakeaways: [
      'Hidden tests come from a predictable list — check it before submitting.',
      'Five exceptions cover nearly every runtime failure in Java DSA.',
      'Overflow lives in `(lo+hi)/2`, `a - b` comparators, and int accumulators.',
      'Only guard against what the constraints permit.',
    ],
    practice: {
      prompt: 'Take your last three solutions and run each on empty, single-element, and all-identical inputs. Fix anything that breaks — that is exactly what the hidden tests would have found.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-17.8',
    language: 'java',
    summary: 'Separate syntax errors from logic errors when debugging.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'When something fails, the first question is which *kind* of failure it is. Syntax and logic errors are found in completely different ways, and mixing the two approaches wastes time on both.',
      },
      {
        kind: 'table',
        headers: ['', 'Syntax / compile error', 'Logic error'],
        rows: [
          ['When', 'Before anything runs', 'Wrong answer or timeout'],
          ['Message', 'Points at a line', 'None — it just runs'],
          ['Fix by', 'Reading the message literally', 'Dry running and printing'],
          ['Typical cause', 'Types, missing symbol, wrong method', 'Off-by-one, wrong condition'],
        ],
      },
      {
        kind: 'code',
        caption: 'The compile errors you will meet most',
        code: `// "incompatible types: Object cannot be converted to int"
//   -> a raw type or a missing generic parameter

// "cannot find symbol"
//   -> typo, or missing import, or wrong method name

// "int cannot be dereferenced"
//   -> calling a method on a primitive: x.equals(y) where x is int

// "unreported exception"
//   -> a checked exception you must catch or declare

// "non-static method cannot be referenced from a static context"
//   -> calling an instance method from main without an object`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Fix the first compile error only, then recompile',
        body: 'One genuine mistake often produces a cascade of follow-on errors. Fixing the first frequently clears five more. Working from the bottom of the list up is how people end up "fixing" code that was never wrong.',
      },
      {
        kind: 'text',
        body: 'For logic errors, print aggressively. `System.out.println` inside a loop showing your key variables is crude, immediate, and finds bugs faster than reasoning about them from the outside.',
      },
      {
        kind: 'code',
        caption: 'Printing that actually helps',
        code: `System.out.println("i=" + i + " l=" + l + " r=" + r + " sum=" + sum);

System.out.println(Arrays.toString(nums));        // arrays need this
System.out.println(Arrays.deepToString(grid));    // 2-D
System.out.println(map);                          // collections print fine`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Printing an array directly gives you a hash code',
        body: '`System.out.println(nums)` prints `[I@1b6d3586`. Always `Arrays.toString(nums)`. Everyone hits this once, and it wastes ten confused minutes.',
      },
      {
        kind: 'text',
        body: 'For a wrong answer on a large hidden test, do not stare at the input. Find the **smallest** input that reproduces it — usually by testing the edge cases from the previous lesson — and debug that instead.',
      },
    ],
    keyTakeaways: [
      'Identify which kind of error you have before trying to fix it.',
      'Fix the first compile error, then recompile — cascades are common.',
      'Print variables inside loops rather than reasoning from outside.',
      'Shrink a failing input before debugging it.',
    ],
    practice: {
      prompt: 'Deliberately introduce each of the five compile errors above and read the messages. Recognising them on sight turns a ten-minute stall into a ten-second fix.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-17.9',
    language: 'java',
    summary: 'Build a personal snippet notebook so you stop re-deriving the same code.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'You will write the same fifteen or so code fragments hundreds of times. Keeping them in one file — and typing them from memory until you no longer need it — removes a real cognitive tax from every problem you attempt.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Write them out, do not copy them',
        body: 'The value is in the recall, not the file. A snippet you can type from memory costs nothing mid-problem; one you have to look up breaks your concentration. Type each from scratch until it flows.',
      },
      {
        kind: 'code',
        caption: 'The snippets worth memorising',
        code: `// Container declarations
List<Integer> list = new ArrayList<>();
Map<Integer,Integer> map = new HashMap<>();
Set<Integer> seen = new HashSet<>();
Deque<Integer> stack = new ArrayDeque<>();
PriorityQueue<int[]> pq = new PriorityQueue<>((a,b) -> Integer.compare(a[0], b[0]));

// Frequency map
map.merge(key, 1, Integer::sum);
int[] freq = new int[26];  freq[c - 'a']++;

// Grouping
map.computeIfAbsent(key, k -> new ArrayList<>()).add(x);

// Sorting
Arrays.sort(intervals, (a,b) -> Integer.compare(a[0], b[0]));
list.sort(Comparator.comparingInt(x -> x.field));

// Array <-> List
List<Integer> l = Arrays.stream(nums).boxed().toList();
int[] a = l.stream().mapToInt(Integer::intValue).toArray();

// Grid directions
int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};

// Binary search on the answer
while (lo < hi) { int mid = lo + (hi - lo)/2; if (ok(mid)) hi = mid; else lo = mid+1; }

// Node classes
class ListNode { int val; ListNode next; ListNode(int v){val=v;} }
class TreeNode { int val; TreeNode left, right; TreeNode(int v){val=v;} }`,
      },
      {
        kind: 'code',
        caption: 'The two structures with no library equivalent',
        code: `class DSU {
    int[] parent, size; int components;
    DSU(int n) { parent = new int[n]; size = new int[n]; components = n;
                 for (int i = 0; i < n; i++) { parent[i] = i; size[i] = 1; } }
    int find(int x) { if (parent[x] != x) parent[x] = find(parent[x]); return parent[x]; }
    boolean unite(int a, int b) {
        int ra = find(a), rb = find(b);
        if (ra == rb) return false;
        if (size[ra] < size[rb]) { int t = ra; ra = rb; rb = t; }
        parent[rb] = ra; size[ra] += size[rb]; components--; return true;
    }
}

class TrieNode { TrieNode[] children = new TrieNode[26]; boolean isWord; }`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Keep it short',
        body: 'A notebook of two hundred snippets is a reference you will never read. Fifteen to twenty, all of which you can type from memory, is worth more than a comprehensive file you have to search.',
      },
    ],
    keyTakeaways: [
      'The same fifteen fragments cover most problems.',
      'The value is in recall — type them, do not copy them.',
      'DSU and Trie have no library equivalent, so memorise both.',
      'A short notebook you know beats a long one you search.',
    ],
    practice: {
      prompt: 'Create the file and type every snippet above from memory, checking afterwards. Repeat weekly until the checking step becomes unnecessary.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-17.10',
    language: 'java',
    summary: 'Keep a container cheat sheet and a log of your own mistakes.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Two documents are worth maintaining beyond the snippet file: a **container cheat sheet** for choosing quickly, and a **mistake log** of bugs you have actually made. The second is the more valuable of the two, and almost nobody keeps it.',
      },
      { kind: 'heading', text: 'The container cheat sheet' },
      {
        kind: 'table',
        headers: ['Need', 'Container', 'Key operation'],
        rows: [
          ['Ordered, indexed, growable', '`ArrayList`', '`get(i)` O(1)'],
          ['"Have I seen this?"', '`HashSet`', '`add` returns false on dup'],
          ['"How many times?"', '`HashMap`', '`merge(k, 1, Integer::sum)`'],
          ['Stack or queue', '`ArrayDeque`', '`push`/`pop`, `offer`/`poll`'],
          ['Smallest / largest repeatedly', '`PriorityQueue`', '`peek` O(1)'],
          ['Sorted keys, nearest key', '`TreeMap`', '`floorKey` / `ceilingKey`'],
          ['Insertion order + O(1)', '`LinkedHashMap`', 'access order → LRU'],
        ],
      },
      { kind: 'heading', text: 'The mistake log' },
      {
        kind: 'text',
        body: 'Every time a submission fails, write one line: **what the bug was**, and **what would have caught it**. After thirty problems you will have a personalised list of your own recurring errors — and it will be shorter and more useful than any generic checklist.',
      },
      {
        kind: 'code',
        caption: 'What entries look like',
        code: `2026-02-14  Subarray Sum Equals K
  Bug: forgot seen.put(0L, 1)
  Catch: test where the whole prefix equals k

2026-02-16  Sliding Window Maximum
  Bug: used < instead of <= in the eviction test
  Catch: dry-run the moment an element leaves the window

2026-02-19  Merge Intervals
  Bug: set end = cur[1] instead of max(...)
  Catch: test [1,10] followed by [2,3]

2026-02-22  Top K Frequent
  Bug: compared two Integers with == above 127
  Catch: always .equals() or unbox for boxed types`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Review the log before a contest or interview',
        body: 'Five minutes reading your own past mistakes is the highest-value preparation available, because these are the errors *you* actually make. A generic list of common bugs cannot compete with that.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Log the failures, not the successes',
        body: 'A list of problems solved feels good and teaches nothing. A list of bugs made is uncomfortable and is what actually improves your accuracy. Keep the one that stings.',
      },
      {
        kind: 'text',
        body: 'That is the end of Phase 0. You can now read and write Java fluently, you know which container to reach for and why, you recognise the core patterns, and you have a method for attacking an unfamiliar problem. The rest is practice — and the pattern cheatsheet is there whenever recognition is the thing that stalls you.',
      },
    ],
    keyTakeaways: [
      'Keep a container cheat sheet for fast, confident choices.',
      'Keep a mistake log — your own bugs, and what would have caught them.',
      'Review the log before contests and interviews.',
      'Log failures rather than successes; only one of them teaches.',
    ],
    practice: {
      prompt: 'Start the mistake log today with the last three bugs you remember. Add one line every time a submission fails, and read the whole file before your next contest.',
    },
  },
];
