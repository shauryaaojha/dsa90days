import type { Lesson } from '../types';

/**
 * Java Chapter 16 — Core DSA Patterns.
 * The Java-flavoured version of the pattern cheatsheet: same techniques, but
 * written with the containers and idioms from Chapters 8–15.
 */
export const ch16: Lesson[] = [
  // -------------------------------------------------------------------------
  {
    topicId: 'java-16.1',
    language: 'java',
    summary: 'Use two pointers to turn a nested loop into a single pass.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'A brute-force pair search tries every `(i, j)` — O(n²). Two pointers works because **sorted order tells you which way to move**: if `nums[l] + nums[r]` is too small, no smaller `r` can help, so the only useful move is `l++`. Every step eliminates a whole row of the search space.',
      },
      {
        kind: 'code',
        caption: 'Opposite ends — pair sum on a sorted array',
        code: `int l = 0, r = nums.length - 1;

while (l < r) {
    int sum = nums[l] + nums[r];

    if (sum == target)      return new int[]{l, r};
    else if (sum < target)  l++;      // need bigger  -> move left up
    else                    r--;      // need smaller -> move right down
}
return new int[]{-1, -1};`,
      },
      {
        kind: 'code',
        caption: 'Same direction — read/write compaction',
        code: `// l = where the next kept element goes, r = what we are inspecting
int l = 0;

for (int r = 0; r < nums.length; r++) {
    if (nums[r] != val) nums[l++] = nums[r];
}
return l;                              // l is the new length`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Name the two arrangements',
        body: '**Opposite ends** for pair sums, palindromes and "area between two lines". **Same direction** (a reader and a writer) for in-place removal and de-duplication. Almost every two-pointer problem is one of these two shapes.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: '`l < r`, not `l <= r`',
        body: 'With `l == r` you would pair an element with itself, which nearly every prompt forbids. Binary search is the opposite case and wants `lo <= hi`. Mixing the two conventions up is the most common two-pointer bug.',
      },
      {
        kind: 'code',
        caption: '3Sum — fix one index, two-point the rest',
        code: `Arrays.sort(nums);
List<List<Integer>> res = new ArrayList<>();

for (int i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] == nums[i-1]) continue;      // skip duplicate anchors

    int l = i + 1, r = nums.length - 1;
    while (l < r) {
        int sum = nums[i] + nums[l] + nums[r];

        if (sum == 0) {
            res.add(List.of(nums[i], nums[l], nums[r]));
            while (l < r && nums[l] == nums[l+1]) l++;    // skip duplicates
            while (l < r && nums[r] == nums[r-1]) r--;
            l++; r--;
        }
        else if (sum < 0) l++;
        else              r--;
    }
}`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Sorting destroys original indices',
        body: 'If the problem wants indices from the *original* array, sorting breaks them. Either use a `HashMap` instead, or sort `int[][]` pairs of `(value, originalIndex)` so the index travels with the value.',
      },
    ],
    keyTakeaways: [
      'Two pointers works because sorted order tells you which one to move.',
      'Opposite ends for pairs; same direction for in-place compaction.',
      'Use `l < r` for pairs and `lo <= hi` for binary search.',
      'Sorting loses original indices — use a map if you need them.',
    ],
    practice: {
      prompt: 'Solve Two Sum II, then Remove Duplicates from Sorted Array, then 3Sum. The duplicate-skipping in 3Sum is the part worth getting right.',
      leetcode: { title: '3Sum', slug: '3sum' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-16.2',
    language: 'java',
    summary: 'Write sliding windows with the grow / shrink / record skeleton.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Every subarray problem has an obvious O(n²) solution. Sliding window collapses it by noticing that when the window moves right, **one element enters and some leave** — so the update is O(1) rather than a rescan.',
      },
      {
        kind: 'text',
        body: 'Write the loop in three steps, in this order, every time: **grow** (admit `s[r]`), **shrink** while the window is invalid, **record** the answer. Because `l` only ever moves forward, the nested `while` does not make it O(n²) — each index enters and leaves once.',
      },
      {
        kind: 'code',
        caption: 'Longest window with no repeats',
        code: `Map<Character,Integer> count = new HashMap<>();
int best = 0, l = 0;

for (int r = 0; r < s.length(); r++) {
    char c = s.charAt(r);
    count.merge(c, 1, Integer::sum);              // 1. GROW

    while (count.get(c) > 1) {                    // 2. SHRINK while INVALID
        count.merge(s.charAt(l), -1, Integer::sum);
        l++;
    }

    best = Math.max(best, r - l + 1);             // 3. RECORD
}
return best;`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Longest records after; shortest records inside',
        body: 'For "longest", record after the shrink loop, when the window is valid. For "shortest", record **inside** the shrink loop, before shrinking further. That one-line difference is the entire distinction between the two families.',
      },
      {
        kind: 'code',
        caption: 'Shortest valid window',
        code: `int sum = 0, best = Integer.MAX_VALUE, l = 0;

for (int r = 0; r < nums.length; r++) {
    sum += nums[r];                               // GROW

    while (sum >= target) {                       // SHRINK while STILL VALID
        best = Math.min(best, r - l + 1);         // RECORD inside
        sum -= nums[l++];
    }
}
return best == Integer.MAX_VALUE ? 0 : best;`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Window length is `r - l + 1`',
        body: 'Both indices are inclusive. Dropping the `+ 1` gives an answer consistently one too small — and it often still passes the first sample, which makes it hard to notice.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Sliding window fails on negative numbers',
        body: 'The shrink logic assumes growing the window never *decreases* the sum. With negatives that breaks, and you must use prefix sums with a `HashMap` instead. Check the constraints before choosing.',
      },
      {
        kind: 'code',
        caption: 'Fixed size — no shrink loop at all',
        code: `int sum = 0, best = Integer.MIN_VALUE;

for (int r = 0; r < nums.length; r++) {
    sum += nums[r];
    if (r >= k) sum -= nums[r - k];               // element leaves
    if (r >= k - 1) best = Math.max(best, sum);
}`,
      },
    ],
    keyTakeaways: [
      'Grow, shrink while invalid, record — in that order.',
      'Each index enters and leaves once, so it is O(n).',
      'Longest records after the shrink; shortest records inside it.',
      'Negatives break the assumption — use prefix sums instead.',
    ],
    practice: {
      prompt: 'Solve Longest Substring Without Repeating Characters, then Minimum Size Subarray Sum. Note that only the placement of the "record" line differs.',
      leetcode: { title: 'Longest Substring Without Repeating Characters', slug: 'longest-substring-without-repeating-characters' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-16.3',
    language: 'java',
    summary: 'Use prefix sums, alone and paired with a HashMap.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Build `pre[i]` = the sum of the first `i` elements, and any range sum becomes one subtraction: `nums[l..r]` is `pre[r+1] - pre[l]`. Using length `n + 1` with `pre[0] = 0` removes every special case for `l == 0` — do it that way every time.',
      },
      {
        kind: 'code',
        caption: 'The prefix array',
        code: `long[] pre = new long[nums.length + 1];        // pre[0] = 0

for (int i = 0; i < nums.length; i++)
    pre[i + 1] = pre[i] + nums[i];

long rangeSum = pre[r + 1] - pre[l];           // inclusive [l, r]`,
      },
      {
        kind: 'text',
        body: 'The powerful version pairs prefix sums with a **hash map**. To count subarrays summing to `k`: the number ending at position `j` equals how many earlier prefixes had value `running - k`. This handles negative numbers, where sliding window cannot.',
      },
      {
        kind: 'code',
        caption: 'Subarray Sum Equals K',
        code: `Map<Long,Integer> seen = new HashMap<>();
seen.put(0L, 1);                    // the empty prefix — do NOT omit

long running = 0;
int count = 0;

for (int x : nums) {
    running += x;
    count += seen.getOrDefault(running - k, 0);   // ADD the count, not 1
    seen.merge(running, 1, Integer::sum);
}
return count;`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'The `{0: 1}` seed is mandatory',
        body: 'It represents the empty prefix and is what lets a subarray starting at index 0 be counted. Without it the answer is exactly one too low whenever the running sum itself equals `k`.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Use `long` for the running sum',
        body: 'With n = 10⁵ and values to 10⁴, the total exceeds `int`. And for the "divisible by k" variant, Java\'s `%` can return negative — normalise with `((x % k) + k) % k`.',
      },
      {
        kind: 'code',
        caption: 'The variations worth recognising',
        code: `// Equal 0s and 1s: map 0 to -1, look for a REPEATED running sum
running += (nums[i] == 0 ? -1 : 1);

// Divisible by k: key on the remainder
int mod = ((running % k) + k) % k;

// 2-D prefix sums for submatrix queries
pre[i+1][j+1] = pre[i][j+1] + pre[i+1][j] - pre[i][j] + grid[i][j];`,
      },
      {
        kind: 'text',
        body: 'Prefix sums also generalise beyond addition: prefix XOR answers "subarray with XOR k" using exactly the same map technique, because XOR is its own inverse.',
      },
    ],
    keyTakeaways: [
      'Use `pre` of length `n + 1` so `l == 0` needs no special case.',
      'Prefix + HashMap counts subarrays in one pass, even with negatives.',
      'Seed the map with `{0: 1}` and add the stored count.',
      'Use `long`, and normalise negative remainders.',
    ],
    practice: {
      prompt: 'Solve Subarray Sum Equals K, then Contiguous Array with the 0→−1 mapping. The second one shows the same machinery answering a different question.',
      leetcode: { title: 'Subarray Sum Equals K', slug: 'subarray-sum-equals-k' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-16.4',
    language: 'java',
    summary: 'Detect cycles and find midpoints with fast and slow pointers.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Move `slow` one step and `fast` two. If the list ends, `fast` falls off and there is no cycle. If there is a cycle, `fast` gains exactly one position per iteration, so it closes the gap by one each time and **must** land on `slow` — it cannot step over it.',
      },
      {
        kind: 'code',
        caption: 'Detect the cycle, then find its start',
        code: `ListNode slow = head, fast = head;

while (fast != null && fast.next != null) {
    slow = slow.next;              // 1 step
    fast = fast.next.next;         // 2 steps

    if (slow == fast) {            // met -> there IS a cycle
        slow = head;               // reset ONE pointer to the head
        while (slow != fast) {     // now both move 1 step
            slow = slow.next;
            fast = fast.next;
        }
        return slow;               // the cycle entrance
    }
}
return null;`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Why the reset step finds the entrance',
        body: 'The distance from the head to the entrance equals the distance from the meeting point to the entrance, going forward around the loop. Both pointers therefore arrive together. It is worth deriving once — interviewers ask why it works, not just what it does.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Check `fast.next` before the double step',
        body: '`fast = fast.next.next` throws `NullPointerException` when `fast.next` is null. The condition must be `while (fast != null && fast.next != null)` — checking only `fast` crashes on any even-length list.',
      },
      {
        kind: 'code',
        caption: 'Midpoint in one pass',
        code: `ListNode slow = head, fast = head;

while (fast != null && fast.next != null) {
    slow = slow.next;
    fast = fast.next.next;
}
return slow;              // even length -> the UPPER middle`,
      },
      {
        kind: 'text',
        body: 'The technique generalises beyond linked lists to any sequence defined by `next = f(current)`. "Find the Duplicate Number" builds exactly such a sequence with `next = nums[current]` — which is why an array problem has a linked-list solution.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Compare nodes, not values',
        body: 'Test `slow == fast` (reference identity), not `slow.val == fast.val`. A list with repeated values would otherwise report a cycle that does not exist.',
      },
    ],
    keyTakeaways: [
      'Speeds 1 and 2 guarantee they meet inside a cycle.',
      'Reset one pointer to the head to find the cycle entrance.',
      'Guard `fast != null && fast.next != null` before double-stepping.',
      'Compare references, never values.',
    ],
    practice: {
      prompt: 'Solve Linked List Cycle II, then Find the Duplicate Number. Recognising the second as the same algorithm is the real lesson.',
      leetcode: { title: 'Linked List Cycle II', slug: 'linked-list-cycle-ii' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-16.5',
    language: 'java',
    summary: 'Use a monotonic stack to answer next-greater questions in O(n).',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Keep a stack whose values stay ordered — decreasing, say — by popping anything that breaks the order. When a new element arrives and breaks it, **that element is the answer for everything it pops**. The pop is where you record the result; that is the entire pattern.',
      },
      {
        kind: 'code',
        caption: 'Next greater element to the right',
        code: `int[] res = new int[nums.length];
Arrays.fill(res, -1);                            // default: nothing greater
Deque<Integer> stack = new ArrayDeque<>();       // holds INDICES

for (int i = 0; i < nums.length; i++) {
    while (!stack.isEmpty() && nums[stack.peek()] < nums[i]) {
        res[stack.pop()] = nums[i];              // record on the pop
    }
    stack.push(i);
}
return res;                                      // leftovers keep -1`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'It is O(n) despite the inner loop',
        body: 'Each index is pushed once and popped at most once, so total pops across the run are bounded by n. Amortised, the `while` is free. Be ready to explain this — it is a standard follow-up question.',
      },
      {
        kind: 'table',
        headers: ['You want', 'Keep the stack', 'Pop while'],
        rows: [
          ['Next greater', 'Decreasing', '`nums[stack.peek()] < nums[i]`'],
          ['Next smaller', 'Increasing', '`nums[stack.peek()] > nums[i]`'],
          ['Previous greater', 'Decreasing, scan left', 'same test'],
          ['Previous smaller', 'Increasing, scan left', 'same test'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Store indices, not values',
        body: 'Daily Temperatures needs `i - stack.peek()`, a distance. Largest Rectangle needs positions for widths. You can recover a value from an index but never the reverse — so default to indices.',
      },
      {
        kind: 'code',
        caption: 'Largest Rectangle — the width formula is the hard part',
        code: `Deque<Integer> stack = new ArrayDeque<>();     // increasing heights
int best = 0;

for (int i = 0; i <= heights.length; i++) {
    int h = (i == heights.length) ? 0 : heights[i];    // sentinel drains it

    while (!stack.isEmpty() && heights[stack.peek()] > h) {
        int height = heights[stack.pop()];
        int width = stack.isEmpty() ? i : i - stack.peek() - 1;
        best = Math.max(best, height * width);
    }
    stack.push(i);
}
return best;`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'When the stack empties, the width is `i`',
        body: 'The popped bar extends all the way back to index 0. Writing `i - stack.peek() - 1` unconditionally throws or gives a wrong width. That branch is the single most common Largest Rectangle bug.',
      },
    ],
    keyTakeaways: [
      'Record the answer at the moment you pop.',
      'Each index pushed and popped once — O(n) overall.',
      'Decreasing → next greater; increasing → next smaller.',
      'A sentinel value drains the stack without a second loop.',
    ],
    practice: {
      prompt: 'Solve Daily Temperatures, then attempt Largest Rectangle in Histogram. Dry-run the second on `[2,1,5,6,2,3]` on paper before coding.',
      leetcode: { title: 'Daily Temperatures', slug: 'daily-temperatures' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-16.6',
    language: 'java',
    summary: 'Extend the monotonic idea to a deque for sliding-window extremes.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'A monotonic deque is the monotonic stack plus one thing: because the window also moves on the left, you must **evict elements that have slid out of range**. Removing from both ends is exactly what a deque provides.',
      },
      {
        kind: 'code',
        caption: 'Sliding Window Maximum',
        code: `Deque<Integer> dq = new ArrayDeque<>();       // indices, values decreasing
int[] res = new int[nums.length - k + 1];

for (int i = 0; i < nums.length; i++) {
    // 1. EVICT indices that have slid out
    if (!dq.isEmpty() && dq.peekFirst() <= i - k) dq.pollFirst();

    // 2. MAINTAIN order at the back
    while (!dq.isEmpty() && nums[dq.peekLast()] < nums[i]) dq.pollLast();

    dq.addLast(i);

    // 3. READ the answer from the front
    if (i >= k - 1) res[i - k + 1] = nums[dq.peekFirst()];
}
return res;`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Why discarding smaller values is safe',
        body: 'If `nums[j] < nums[i]` and `j < i`, then `j` can never be the maximum again — `i` is both larger and stays in the window longer. Once you believe that, the algorithm stops being magic.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'The eviction test is `<=`, not `<`',
        body: 'A window covering `i-k+1 .. i` means index `i-k` or earlier is out. Using `<` leaves one stale element in and the maximum can come from outside the window.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Front and back do different jobs',
        body: 'The **front** holds the answer and is where you evict by age. The **back** is where you maintain order and append. Swapping them gives results that are right for some windows and wrong for others.',
      },
      {
        kind: 'text',
        body: 'For a sliding-window **minimum**, flip one comparison: pop while `nums[dq.peekLast()] > nums[i]`, keeping the deque increasing. If both versions work for you, you have understood the pattern rather than memorised it.',
      },
      {
        kind: 'code',
        caption: 'A harder relative: Shortest Subarray with Sum at Least K',
        code: `// Works with NEGATIVE numbers, where sliding window fails.
// Monotonic deque over the PREFIX SUM array, kept increasing.
long[] pre = new long[nums.length + 1];
for (int i = 0; i < nums.length; i++) pre[i+1] = pre[i] + nums[i];

Deque<Integer> dq = new ArrayDeque<>();
int best = Integer.MAX_VALUE;

for (int i = 0; i <= nums.length; i++) {
    while (!dq.isEmpty() && pre[i] - pre[dq.peekFirst()] >= k)
        best = Math.min(best, i - dq.pollFirst());

    while (!dq.isEmpty() && pre[dq.peekLast()] >= pre[i]) dq.pollLast();

    dq.addLast(i);
}`,
      },
    ],
    keyTakeaways: [
      'Evict from the front by age, maintain order at the back, read the front.',
      'A smaller earlier element can never win again.',
      'The eviction test is `dq.peekFirst() <= i - k`.',
      'Over a prefix-sum array, the same deque handles negative numbers.',
    ],
    practice: {
      prompt: 'Implement Sliding Window Maximum, then flip the comparison for the minimum. If time allows, attempt Shortest Subarray with Sum at Least K.',
      leetcode: { title: 'Sliding Window Maximum', slug: 'sliding-window-maximum' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-16.7',
    language: 'java',
    summary: 'Write binary search on an array and, more usefully, on the answer.',
    readMinutes: 6,
    blocks: [
      {
        kind: 'text',
        body: 'The classic form searches a sorted array. What makes it hard is not the idea but the **loop invariant** — pick one convention and never deviate from it.',
      },
      {
        kind: 'code',
        caption: 'Exact match, closed interval',
        code: `int lo = 0, hi = nums.length - 1;

while (lo <= hi) {
    int mid = lo + (hi - lo) / 2;          // overflow-safe

    if (nums[mid] == target)  return mid;
    else if (nums[mid] < target) lo = mid + 1;
    else                         hi = mid - 1;
}
return -1;`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: '`(lo + hi) / 2` overflows',
        body: '`lo + hi` can exceed `Integer.MAX_VALUE`, producing a negative index and an out-of-bounds crash. Always `lo + (hi - lo) / 2`. This exact bug sat in the JDK\'s own binary search for nine years.',
      },
      {
        kind: 'text',
        body: 'The far more valuable form is **binary search on the answer**. When the question is "what is the smallest capacity / speed / size that works?", you are searching the range of possible answers, not an array. It applies whenever the predicate is monotonic: if `x` works, every larger `x` works too.',
      },
      {
        kind: 'code',
        caption: 'The answer-search template',
        code: `// Smallest x in [lo, hi] with feasible(x) == true
int lo = 1, hi = maxPossible;

while (lo < hi) {                          // half-open — converge on the boundary
    int mid = lo + (hi - lo) / 2;

    if (feasible(mid)) hi = mid;           // mid works — might BE the answer
    else               lo = mid + 1;       // mid fails — answer is strictly right
}
return lo;                                 // lo == hi == first feasible x`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Write `feasible` as a separate method',
        body: 'Koko Eating Bananas, Capacity to Ship Packages, Split Array Largest Sum and Minimum Days to Make Bouquets are literally the same eight lines with a different `feasible`. Isolating it makes that obvious and keeps the search loop uniform.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Infinite loop from the wrong update',
        body: 'With `while (lo < hi)`, writing `lo = mid` hangs forever when `hi == lo + 1`, because `mid` floors to `lo`. Rule: whichever bound you set to `mid` unchanged, the other must move past it.',
      },
      {
        kind: 'code',
        caption: 'Library alternatives',
        code: `Arrays.binarySearch(a, target);        // index, or -(insertionPoint) - 1
int insertAt = i >= 0 ? i : -i - 1;

Integer ceil  = treeMap.ceilingKey(x);  // sorted-container equivalents
Integer floor = treeMap.floorKey(x);`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Verify the predicate is genuinely monotonic',
        body: 'If `feasible(5)` is true but `feasible(6)` is false, binary search on the answer is invalid and will return confident nonsense. Check the monotonicity before you write the loop.',
      },
    ],
    keyTakeaways: [
      'Use `lo + (hi - lo) / 2` to avoid overflow.',
      'Pick one convention: `lo <= hi` with `mid ± 1`, or `lo < hi` with `hi = mid`.',
      'Binary search on the answer needs a monotonic `feasible(x)`.',
      'Whichever bound stays at `mid`, the other must move past it.',
    ],
    practice: {
      prompt: 'Write plain binary search from memory. Then solve Koko Eating Bananas by writing `feasible(speed)` first and dropping it into the template.',
      leetcode: { title: 'Koko Eating Bananas', slug: 'koko-eating-bananas' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-16.8',
    language: 'java',
    summary: 'Write DFS and BFS, and know which one a problem needs.',
    readMinutes: 6,
    blocks: [
      {
        kind: 'text',
        body: 'DFS goes deep down one branch before backtracking; BFS explores in rings. The practical difference is one guarantee: **BFS finds shortest paths on unweighted graphs, DFS does not.** That alone decides most choices.',
      },
      {
        kind: 'code',
        caption: 'BFS with levels',
        code: `Queue<Integer> q = new ArrayDeque<>();
boolean[] visited = new boolean[n];

q.offer(start);
visited[start] = true;                  // mark on ENQUEUE
int level = 0;

while (!q.isEmpty()) {
    int size = q.size();                // snapshot BEFORE the inner loop

    for (int i = 0; i < size; i++) {
        int node = q.poll();
        if (node == target) return level;

        for (int next : adj.get(node)) {
            if (!visited[next]) {
                visited[next] = true;
                q.offer(next);
            }
        }
    }
    level++;
}
return -1;`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Mark visited on enqueue, not on dequeue',
        body: 'If you wait until dequeue, a node reachable from several neighbours is pushed many times before any copy is processed. The queue balloons past V and dense graphs time out.',
      },
      {
        kind: 'code',
        caption: 'DFS, recursive and iterative',
        code: `void dfs(int node, boolean[] visited) {
    visited[node] = true;
    for (int next : adj.get(node))
        if (!visited[next]) dfs(next, visited);
}

// Iterative — when recursion would overflow
Deque<Integer> stack = new ArrayDeque<>();
stack.push(start);
while (!stack.isEmpty()) {
    int node = stack.pop();
    if (visited[node]) continue;
    visited[node] = true;

    for (int next : adj.get(node)) if (!visited[next]) stack.push(next);
}`,
      },
      {
        kind: 'code',
        caption: 'Grid traversal — the shape you will write most',
        code: `int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};

void dfs(char[][] grid, int r, int c) {
    if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length) return;
    if (grid[r][c] != '1') return;              // wall or already visited

    grid[r][c] = '0';                           // mark — and never undo

    for (int[] d : dirs) dfs(grid, r + d[0], c + d[1]);
}`,
      },
      {
        kind: 'table',
        headers: ['Need', 'Use'],
        rows: [
          ['Shortest path, unweighted', '**BFS**'],
          ['Level-by-level processing', '**BFS**'],
          ['Multi-source spreading', '**BFS**, seed all sources'],
          ['Does a path exist?', 'Either'],
          ['Connected components / islands', 'Either'],
          ['All paths, backtracking', '**DFS**'],
          ['Cycle detection', '**DFS** with colours'],
        ],
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Recursive DFS overflows on deep graphs',
        body: 'Depth can reach V. On a 10⁵-node path graph you get `StackOverflowError`. Rewrite iteratively with an explicit `ArrayDeque` when the constraints are large — the logic is the same, only the stack changes.',
      },
    ],
    keyTakeaways: [
      'Only BFS guarantees shortest paths on unweighted graphs.',
      'Mark visited on enqueue; snapshot the queue size per level.',
      'Grid flood fill marks and never un-marks.',
      'Deep graphs need iterative DFS to avoid stack overflow.',
    ],
    practice: {
      prompt: 'Solve Number of Islands with both DFS and BFS. Then solve Rotting Oranges — multi-source BFS, where levels are literally minutes.',
      leetcode: { title: 'Number of Islands', slug: 'number-of-islands' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-16.9',
    language: 'java',
    summary: 'Apply the tree traversal patterns that most tree problems reduce to.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Most tree problems are one of three shapes. Recognising which one you are in tells you immediately where to put your logic, and turns "I do not know how to start" into a three-line method.',
      },
      { kind: 'heading', text: 'Shape 1 — compute from the children (postorder)' },
      {
        kind: 'code',
        code: `int height(TreeNode n) {
    if (n == null) return 0;
    return 1 + Math.max(height(n.left), height(n.right));
}

// Diameter — the answer may not pass through the root, so track it separately
int best = 0;

int depth(TreeNode n) {
    if (n == null) return 0;
    int l = depth(n.left), r = depth(n.right);

    best = Math.max(best, l + r);      // path THROUGH this node
    return 1 + Math.max(l, r);         // what the parent needs
}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Return one thing, record another',
        body: 'Diameter, Max Path Sum and Longest Univalue Path all share this shape: the method **returns** what the parent needs, while updating a field with the best answer seen anywhere. Separating those two is the key insight.',
      },
      { kind: 'heading', text: 'Shape 2 — carry information down (preorder)' },
      {
        kind: 'code',
        code: `// Validate a BST: each node inherits bounds from its ancestors
boolean valid(TreeNode n, long min, long max) {
    if (n == null) return true;
    if (n.val <= min || n.val >= max) return false;

    return valid(n.left,  min, n.val)        // left subtree tightens the max
        && valid(n.right, n.val, max);       // right subtree tightens the min
}
// call: valid(root, Long.MIN_VALUE, Long.MAX_VALUE)`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Validating a BST by comparing with children only is wrong',
        body: 'Checking `node.left.val < node.val` passes trees that are not BSTs — a node deep in the left subtree can still exceed the root. The bounds must be carried down from every ancestor, which is what the two extra parameters do.',
      },
      { kind: 'heading', text: 'Shape 3 — level by level (BFS)' },
      {
        kind: 'code',
        code: `while (!q.isEmpty()) {
    int size = q.size();
    List<Integer> level = new ArrayList<>();

    for (int i = 0; i < size; i++) {
        TreeNode n = q.poll();
        level.add(n.val);
        if (n.left != null)  q.offer(n.left);
        if (n.right != null) q.offer(n.right);
    }
    res.add(level);
}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Inorder on a BST yields sorted order',
        body: 'That single fact solves Kth Smallest in a BST, Validate BST (check the sequence is increasing), and Convert BST to Sorted List. If a problem mentions a BST and an ordering, inorder is almost certainly the tool.',
      },
      {
        kind: 'code',
        caption: 'Lowest Common Ancestor — a clean postorder',
        code: `TreeNode lca(TreeNode n, TreeNode p, TreeNode q) {
    if (n == null || n == p || n == q) return n;

    TreeNode l = lca(n.left, p, q);
    TreeNode r = lca(n.right, p, q);

    if (l != null && r != null) return n;    // found one on each side -> this is it
    return l != null ? l : r;                // otherwise pass up whichever we found
}`,
      },
    ],
    keyTakeaways: [
      'Postorder computes from children; preorder carries context down.',
      'Return what the parent needs; record the global best in a field.',
      'BST validation needs inherited bounds, not child comparisons.',
      'Inorder on a BST yields sorted order.',
    ],
    practice: {
      prompt: 'Solve Maximum Depth, Diameter of Binary Tree, and Validate BST. Each one is a different shape from this lesson.',
      leetcode: { title: 'Diameter of Binary Tree', slug: 'diameter-of-binary-tree' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-16.10',
    language: 'java',
    summary: 'Apply the graph patterns beyond plain traversal.',
    readMinutes: 6,
    blocks: [
      {
        kind: 'text',
        body: 'Once you can traverse a graph, four further patterns cover most graph problems: topological sort, union-find, Dijkstra, and cycle detection. Each has a distinctive tell in the problem statement.',
      },
      { kind: 'heading', text: 'Topological sort — "prerequisites"' },
      {
        kind: 'code',
        code: `// Kahn's algorithm. edges [a, b] means "b before a".
int[] indeg = new int[n];
for (int[] e : edges) { adj.get(e[1]).add(e[0]); indeg[e[0]]++; }

Queue<Integer> q = new ArrayDeque<>();
for (int i = 0; i < n; i++) if (indeg[i] == 0) q.offer(i);

List<Integer> order = new ArrayList<>();
while (!q.isEmpty()) {
    int node = q.poll();
    order.add(node);
    for (int next : adj.get(node))
        if (--indeg[next] == 0) q.offer(next);
}
return order.size() == n ? order : new ArrayList<>();   // short = cycle`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Cycle detection comes free',
        body: 'If fewer than `n` nodes are emitted, the leftovers are stuck waiting on each other — a cycle. `order.size() == n` is the entire answer to "can all courses be finished?".',
      },
      { kind: 'heading', text: 'Union-find — "are these connected?"' },
      {
        kind: 'code',
        code: `DSU dsu = new DSU(n);
for (int[] e : edges) dsu.unite(e[0], e[1]);
return dsu.components;                    // number of provinces / components

// unite returns false when both are already joined -> that edge is redundant`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Union-find beats DFS when the graph is dynamic',
        body: 'If edges arrive over time and you must answer connectivity between insertions, re-running DFS is O(V + E) per query. Union-find answers in effectively O(1). For a fixed graph traversed once, plain DFS is simpler.',
      },
      { kind: 'heading', text: 'Dijkstra — "weighted shortest path"' },
      {
        kind: 'code',
        code: `long[] dist = new long[n];
Arrays.fill(dist, Long.MAX_VALUE);
PriorityQueue<long[]> pq = new PriorityQueue<>((a,b) -> Long.compare(a[0], b[0]));

dist[start] = 0;
pq.offer(new long[]{0, start});

while (!pq.isEmpty()) {
    long[] cur = pq.poll();
    long d = cur[0]; int u = (int) cur[1];

    if (d > dist[u]) continue;               // stale entry

    for (int[] e : adj.get(u)) {
        if (d + e[1] < dist[e[0]]) {
            dist[e[0]] = d + e[1];
            pq.offer(new long[]{dist[e[0]], e[0]});
        }
    }
}`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Dijkstra fails on negative weights',
        body: 'The "popped means final" invariant breaks, and the answer is silently wrong rather than crashing. Negative edges need Bellman-Ford, which also detects negative cycles.',
      },
      {
        kind: 'table',
        headers: ['The tell', 'Pattern'],
        rows: [
          ['"prerequisites", "build order"', 'Topological sort'],
          ['"connected?", "how many groups?"', 'Union-find'],
          ['"cheapest path", weighted edges', 'Dijkstra'],
          ['"fewest steps", unweighted', 'BFS'],
          ['"all paths", "every way"', 'DFS + backtracking'],
          ['Edges arrive over time', 'Union-find'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Directed and undirected cycles need different tools',
        body: 'Union-find detects cycles in **undirected** graphs only. A directed cycle needs DFS with three colours (unvisited / in-progress / done) or Kahn\'s count check — `1→2` and `1→3` would look like a cycle to a DSU.',
      },
    ],
    keyTakeaways: [
      'Kahn\'s algorithm gives both a topological order and cycle detection.',
      'Union-find shines when edges arrive dynamically.',
      'Dijkstra is BFS with a priority queue — and needs non-negative weights.',
      'Undirected cycles → DSU; directed cycles → DFS colours or Kahn.',
    ],
    practice: {
      prompt: 'Solve Course Schedule II, Number of Provinces, and Network Delay Time — one for each pattern. Then read the /patterns cheatsheet entries for the same three and compare the C++ and Python templates.',
      leetcode: { title: 'Course Schedule II', slug: 'course-schedule-ii' },
    },
  },
];
