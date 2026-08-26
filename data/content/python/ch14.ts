import type { Lesson } from '../types';

/**
 * Python Chapter 14 — Core DSA Patterns.
 * The Python-flavoured pattern catalogue: same techniques as the cheatsheet,
 * written with the containers and idioms from Chapters 8–13.
 */
export const ch14: Lesson[] = [
  // -------------------------------------------------------------------------
  {
    topicId: 'python-14.1',
    language: 'python',
    summary: 'Use two pointers to turn a nested loop into a single pass.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'A brute-force pair search tries every `(i, j)` — O(n²). Two pointers works because **sorted order tells you which way to move**: if `nums[l] + nums[r]` is too small, no smaller `r` can help, so the only useful move is `l += 1`. Each step eliminates a whole row of the search space.',
      },
      {
        kind: 'code',
        caption: 'Opposite ends',
        code: `l, r = 0, len(nums) - 1

while l < r:
    total = nums[l] + nums[r]

    if total == target:
        return [l, r]
    elif total < target:
        l += 1               # need bigger  -> move left up
    else:
        r -= 1               # need smaller -> move right down`,
      },
      {
        kind: 'code',
        caption: 'Same direction — read and write',
        code: `# l = where the next kept element goes, r = what we are inspecting
l = 0

for r in range(len(nums)):
    if nums[r] != val:
        nums[l] = nums[r]
        l += 1

return l                     # l is the new length`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Two arrangements, and that is all',
        body: '**Opposite ends** for pair sums, palindromes and "area between two lines". **Same direction** (reader and writer) for in-place removal and de-duplication. Almost every two-pointer problem is one of these.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: '`l < r`, not `l <= r`',
        body: 'With `l == r` you would pair an element with itself, which nearly every prompt forbids. Binary search is the opposite case and wants `lo <= hi`. Mixing the conventions is the classic two-pointer bug.',
      },
      {
        kind: 'code',
        caption: '3Sum — fix one index, two-point the rest',
        code: `nums.sort()
res = []

for i in range(len(nums) - 2):
    if i > 0 and nums[i] == nums[i-1]:
        continue                         # skip duplicate anchors

    l, r = i + 1, len(nums) - 1
    while l < r:
        total = nums[i] + nums[l] + nums[r]

        if total == 0:
            res.append([nums[i], nums[l], nums[r]])
            while l < r and nums[l] == nums[l+1]: l += 1     # skip duplicates
            while l < r and nums[r] == nums[r-1]: r -= 1
            l += 1; r -= 1
        elif total < 0:
            l += 1
        else:
            r -= 1

return res`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Sorting destroys original indices',
        body: 'If the problem wants indices from the original array, sorting breaks them. Use a `dict` instead, or sort `(value, index)` tuples so the index travels with the value.',
      },
    ],
    keyTakeaways: [
      'Sorted order is what tells you which pointer to move.',
      'Opposite ends for pairs; same direction for in-place compaction.',
      '`l < r` for pairs; `lo <= hi` for binary search.',
      'Sorting loses original indices — use a dict if you need them.',
    ],
    practice: {
      prompt: 'Solve Two Sum II, then Remove Duplicates from Sorted Array, then 3Sum. The duplicate skipping in 3Sum is the part worth getting exactly right.',
      leetcode: { title: '3Sum', slug: '3sum' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-14.2',
    language: 'python',
    summary: 'Write sliding windows with the grow / shrink / record skeleton.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Every subarray problem has an obvious O(n²) solution. Sliding window collapses it: when the window moves right, **one element enters and some leave**, so the update is O(1) rather than a rescan.',
      },
      {
        kind: 'text',
        body: 'Write the loop in three steps every time: **grow** (admit `s[r]`), **shrink** while invalid, **record**. Because `l` only moves forward, the inner `while` does not make it quadratic — each index enters and leaves once.',
      },
      {
        kind: 'code',
        caption: 'Longest window with no repeats',
        code: `from collections import defaultdict

count = defaultdict(int)
best = l = 0

for r, ch in enumerate(s):
    count[ch] += 1                   # 1. GROW

    while count[ch] > 1:             # 2. SHRINK while INVALID
        count[s[l]] -= 1
        l += 1

    best = max(best, r - l + 1)      # 3. RECORD

return best`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Longest records after; shortest records inside',
        body: 'For "longest", record after the shrink loop when the window is valid. For "shortest", record **inside** the shrink loop before shrinking further. That one-line difference is the entire distinction.',
      },
      {
        kind: 'code',
        caption: 'Shortest valid window',
        code: `total, best, l = 0, float("inf"), 0

for r in range(len(nums)):
    total += nums[r]                 # GROW

    while total >= target:           # SHRINK while STILL VALID
        best = min(best, r - l + 1)  # RECORD inside
        total -= nums[l]
        l += 1

return 0 if best == float("inf") else best`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Window length is `r - l + 1`',
        body: 'Both indices are inclusive. Dropping the `+ 1` gives an answer consistently one too small — and it often passes the first sample, which makes it easy to miss.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Stale zero-count keys inflate `len(count)`',
        body: 'A count can reach 0 while the key remains in the dict, so `len(count)` overstates the number of distinct characters. If you test "at most k distinct" by size, `del count[c]` when the count hits 0.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Negative numbers break the assumption',
        body: 'The shrink logic assumes growing the window never decreases the sum. With negatives that fails — use prefix sums with a dict instead. Check the constraints before choosing.',
      },
    ],
    keyTakeaways: [
      'Grow, shrink while invalid, record — always in that order.',
      'Each index enters and leaves once, so it is O(n).',
      'Longest records after the shrink; shortest records inside it.',
      'Delete zero-count keys if you measure distinctness by `len`.',
    ],
    practice: {
      prompt: 'Solve Longest Substring Without Repeating Characters, then Minimum Size Subarray Sum. Only the placement of the record line differs.',
      leetcode: { title: 'Longest Substring Without Repeating Characters', slug: 'longest-substring-without-repeating-characters' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-14.3',
    language: 'python',
    summary: 'Use prefix sums, alone and paired with a dict.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Build `pre[i]` = the sum of the first `i` elements, and any range sum becomes one subtraction. Using length `n + 1` with `pre[0] = 0` removes every special case for `l == 0` — do it that way every time.',
      },
      {
        kind: 'code',
        caption: 'The prefix array',
        code: `from itertools import accumulate

pre = [0] * (len(nums) + 1)
for i, x in enumerate(nums):
    pre[i + 1] = pre[i] + x

# Or in one line:
pre = list(accumulate(nums, initial=0))

range_sum = pre[r + 1] - pre[l]        # inclusive [l, r]`,
      },
      {
        kind: 'text',
        body: 'The powerful version pairs prefix sums with a **dict**. To count subarrays summing to `k`: the number ending at `j` equals how many earlier prefixes had value `running - k`. This handles negative numbers, where sliding window cannot.',
      },
      {
        kind: 'code',
        caption: 'Subarray Sum Equals K',
        code: `from collections import defaultdict

seen = defaultdict(int)
seen[0] = 1                       # the empty prefix — do NOT omit

running = count = 0

for x in nums:
    running += x
    count += seen[running - k]    # ADD the count, not 1
    seen[running] += 1

return count`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'The `{0: 1}` seed is mandatory',
        body: 'It represents the empty prefix and is what lets a subarray starting at index 0 be counted. Without it the answer is exactly one too low whenever the running sum itself equals `k`.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Python is immune to the overflow that bites C++ and Java',
        body: 'Prefix sums over 10⁵ elements easily exceed a 32-bit integer, which forces `long` elsewhere. Python integers are arbitrary precision, so this whole class of bug simply does not exist here.',
      },
      {
        kind: 'code',
        caption: 'The variations worth recognising',
        code: `# Equal 0s and 1s: map 0 to -1, then look for a REPEATED running sum
running += -1 if x == 0 else 1

# Divisible by k: key on the remainder (Python's % is already non-negative)
mod = running % k

# Prefix XOR — same machinery, since XOR is its own inverse
running ^= x`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: "Python's `%` is always non-negative",
        body: '`-7 % 3` is 2 in Python, but −1 in C++ and Java. So the `((x % k) + k) % k` normalisation those languages need is unnecessary here — another small Python advantage.',
      },
    ],
    keyTakeaways: [
      'Use `pre` of length `n + 1` so `l == 0` needs no special case.',
      'Prefix + dict counts subarrays in one pass, even with negatives.',
      'Seed with `{0: 1}` and add the stored count, not 1.',
      'Python has no overflow, and `%` is already non-negative.',
    ],
    practice: {
      prompt: 'Solve Subarray Sum Equals K, then Contiguous Array with the 0→−1 mapping. Then delete the seed and find an input where the answer drops by one.',
      leetcode: { title: 'Subarray Sum Equals K', slug: 'subarray-sum-equals-k' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-14.4',
    language: 'python',
    summary: 'Detect cycles and find midpoints with fast and slow pointers.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Move `slow` one step and `fast` two. If the list ends, `fast` falls off and there is no cycle. If there is one, `fast` gains exactly one position per iteration, closing the gap by one each time — so it **must** land on `slow` and cannot step over it.',
      },
      {
        kind: 'code',
        caption: 'Detect, then find the entrance',
        code: `slow = fast = head

while fast and fast.next:
    slow = slow.next               # 1 step
    fast = fast.next.next          # 2 steps

    if slow is fast:               # met -> there IS a cycle
        slow = head                # reset ONE pointer
        while slow is not fast:    # now both move 1 step
            slow = slow.next
            fast = fast.next
        return slow                # the cycle entrance

return None`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Why the reset finds the entrance',
        body: 'The distance from the head to the entrance equals the distance from the meeting point to the entrance, going forward around the loop. Both pointers therefore arrive together. Interviewers ask *why* this works, not just what it does.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Check `fast.next` before double-stepping',
        body: '`fast.next.next` raises `AttributeError` when `fast.next` is `None`. The condition must be `while fast and fast.next` — checking only `fast` crashes on any even-length list.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Use `is`, not `==`',
        body: '`slow is fast` compares identity, which is what you want. `slow == fast` would compare values if the class defined `__eq__`, and a list with repeated values could then report a cycle that does not exist.',
      },
      {
        kind: 'code',
        caption: 'Midpoint in one pass',
        code: `slow = fast = head

while fast and fast.next:
    slow = slow.next
    fast = fast.next.next

return slow          # even length -> the UPPER middle`,
      },
      {
        kind: 'text',
        body: 'The technique generalises to any sequence defined by `next = f(current)`. "Find the Duplicate Number" builds exactly that with `next = nums[current]` — which is why an array problem has a linked-list solution.',
      },
    ],
    keyTakeaways: [
      'Speeds 1 and 2 guarantee the pointers meet inside a cycle.',
      'Reset one to the head to find the cycle entrance.',
      'Guard `while fast and fast.next` before double-stepping.',
      'Compare with `is`, not `==`.',
    ],
    practice: {
      prompt: 'Solve Linked List Cycle II, then Find the Duplicate Number. Recognising the second as the same algorithm is the real lesson.',
      leetcode: { title: 'Linked List Cycle II', slug: 'linked-list-cycle-ii' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-14.5',
    language: 'python',
    summary: 'Use a monotonic stack to answer next-greater questions in O(n).',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Keep a stack whose values stay ordered by popping anything that breaks the order. When a new element breaks it, **that element is the answer for everything it pops**. The pop is where you record — that is the whole pattern.',
      },
      {
        kind: 'code',
        caption: 'Next greater element to the right',
        code: `def next_greater(nums):
    res = [-1] * len(nums)        # default: nothing greater
    stack = []                    # holds INDICES, values decreasing

    for i, x in enumerate(nums):
        while stack and nums[stack[-1]] < x:
            res[stack.pop()] = x  # record on the pop

        stack.append(i)

    return res`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'It is O(n) despite the inner loop',
        body: 'Each index is pushed once and popped at most once, so total pops are bounded by n. Amortised, the `while` is free. Be ready to explain this — it is a standard follow-up.',
      },
      {
        kind: 'table',
        headers: ['You want', 'Keep the stack', 'Pop while'],
        rows: [
          ['Next greater', 'Decreasing', '`nums[stack[-1]] < x`'],
          ['Next smaller', 'Increasing', '`nums[stack[-1]] > x`'],
          ['Previous greater', 'Decreasing, scan left', 'same test'],
          ['Previous smaller', 'Increasing, scan left', 'same test'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Store indices, not values',
        body: 'Daily Temperatures needs `i - stack[-1]`, a distance. Largest Rectangle needs positions for widths. You can recover a value from an index but never the reverse.',
      },
      {
        kind: 'code',
        caption: 'Largest Rectangle — the width formula is the hard part',
        code: `def largest_rectangle(heights):
    stack, best = [], 0
    heights = heights + [0]              # sentinel forces a full drain

    for i, h in enumerate(heights):
        while stack and heights[stack[-1]] > h:
            height = heights[stack.pop()]
            width = i if not stack else i - stack[-1] - 1
            best = max(best, height * width)

        stack.append(i)

    return best`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'When the stack empties, the width is `i`',
        body: 'The popped bar extends all the way back to index 0. Writing `i - stack[-1] - 1` unconditionally raises `IndexError` or gives a wrong width. That branch is the commonest Largest Rectangle bug.',
      },
    ],
    keyTakeaways: [
      'Record the answer at the moment you pop.',
      'Each index pushed and popped once — O(n) overall.',
      'Decreasing → next greater; increasing → next smaller.',
      'A sentinel value drains the stack without a second loop.',
    ],
    practice: {
      prompt: 'Solve Daily Temperatures, then attempt Largest Rectangle in Histogram. Dry-run the second on `[2,1,5,6,2,3]` before coding.',
      leetcode: { title: 'Daily Temperatures', slug: 'daily-temperatures' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-14.6',
    language: 'python',
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
        code: `from collections import deque

def max_sliding_window(nums, k):
    dq = deque()          # indices, values DECREASING
    res = []

    for i, x in enumerate(nums):
        # 1. EVICT indices that have slid out
        if dq and dq[0] <= i - k:
            dq.popleft()

        # 2. MAINTAIN order at the back
        while dq and nums[dq[-1]] < x:
            dq.pop()

        dq.append(i)

        # 3. READ from the front
        if i >= k - 1:
            res.append(nums[dq[0]])

    return res`,
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
        body: 'A window covering `i-k+1 .. i` means index `i-k` or earlier is out. Using `<` leaves one stale element in, so the maximum can come from outside the window — a bug that shows only on specific inputs.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Front and back do different jobs',
        body: 'The **front** (`dq[0]`) holds the answer and is where you evict by age. The **back** (`dq[-1]`) is where you maintain order and append. Swapping them gives results right for some windows and wrong for others.',
      },
      {
        kind: 'text',
        body: 'For a sliding-window **minimum**, flip one comparison: pop while `nums[dq[-1]] > x`, keeping the deque increasing. If both versions work for you, you have understood the pattern rather than memorised it.',
      },
      {
        kind: 'code',
        caption: 'A harder relative, working with negatives',
        code: `# Shortest Subarray with Sum at Least K — monotonic deque over PREFIX SUMS
pre = list(accumulate(nums, initial=0))
dq, best = deque(), float("inf")

for i, p in enumerate(pre):
    while dq and p - pre[dq[0]] >= k:
        best = min(best, i - dq.popleft())

    while dq and pre[dq[-1]] >= p:
        dq.pop()

    dq.append(i)`,
      },
    ],
    keyTakeaways: [
      'Evict from the front by age, maintain order at the back, read the front.',
      'A smaller earlier element can never win again.',
      'The eviction test is `dq[0] <= i - k`.',
      'Over a prefix-sum array, the same deque handles negatives.',
    ],
    practice: {
      prompt: 'Implement Sliding Window Maximum, then flip the comparison for the minimum. If time allows, attempt Shortest Subarray with Sum at Least K.',
      leetcode: { title: 'Sliding Window Maximum', slug: 'sliding-window-maximum' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-14.7',
    language: 'python',
    summary: 'Apply the binary search patterns, especially searching the answer.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Binary search comes in three shapes: exact match, boundary finding, and searching the *answer space*. The third is the one that unlocks the most problems, and the one people spot least often.',
      },
      {
        kind: 'code',
        caption: '1. Exact match',
        code: `lo, hi = 0, len(nums) - 1

while lo <= hi:
    mid = (lo + hi) // 2
    if nums[mid] == target: return mid
    elif nums[mid] < target: lo = mid + 1
    else:                    hi = mid - 1

return -1`,
      },
      {
        kind: 'code',
        caption: '2. Boundary — or just use bisect',
        code: `from bisect import bisect_left, bisect_right

bisect_left(a, x)     # first index >= x
bisect_right(a, x)    # first index >  x

# Hand-written, when the predicate is not a simple comparison
while lo < hi:
    mid = (lo + hi) // 2
    if condition(mid): hi = mid
    else:              lo = mid + 1
return lo`,
      },
      {
        kind: 'code',
        caption: '3. Search the answer — the valuable one',
        code: `def min_eating_speed(piles, h):
    def feasible(speed):
        return sum(math.ceil(p / speed) for p in piles) <= h

    lo, hi = 1, max(piles)
    while lo < hi:
        mid = (lo + hi) // 2
        if feasible(mid): hi = mid
        else:             lo = mid + 1
    return lo`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The tell for answer-searching',
        body: '"Minimum X such that…" or "maximum X such that…", where **a bigger X is always easier**. Koko Eating Bananas, Capacity to Ship Packages, Split Array Largest Sum and Minimum Days to Make Bouquets are the same eight lines with a different `feasible`.',
      },
      {
        kind: 'code',
        caption: 'Rotated arrays — decide which half is sorted',
        code: `while lo <= hi:
    mid = (lo + hi) // 2
    if nums[mid] == target: return mid

    if nums[lo] <= nums[mid]:                    # LEFT half is sorted
        if nums[lo] <= target < nums[mid]: hi = mid - 1
        else:                              lo = mid + 1
    else:                                        # RIGHT half is sorted
        if nums[mid] < target <= nums[hi]: lo = mid + 1
        else:                              hi = mid - 1`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Infinite loop from `lo = mid`',
        body: 'With `while lo < hi`, writing `lo = mid` hangs when `hi == lo + 1`, because `mid` floors to `lo`. Rule: whichever bound you set to `mid` unchanged, the other must move past it.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Verify monotonicity before you write',
        body: 'If `feasible(5)` is True but `feasible(6)` is False, the whole approach is invalid and returns confident nonsense. Check that a larger candidate is always at least as good.',
      },
    ],
    keyTakeaways: [
      'Three shapes: exact match, boundary, and answer-space search.',
      'Use `bisect` for boundaries rather than hand-writing them.',
      '"Minimum X such that…" with monotone difficulty means answer search.',
      'Whichever bound stays at `mid`, the other must move past it.',
    ],
    practice: {
      prompt: 'Solve Koko Eating Bananas by writing `feasible` first. Then solve Search in Rotated Sorted Array — the "which half is sorted" test is the whole trick.',
      leetcode: { title: 'Search in Rotated Sorted Array', slug: 'search-in-rotated-sorted-array' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-14.8',
    language: 'python',
    summary: 'Apply the tree traversal patterns most problems reduce to.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Most tree problems are one of three shapes. Recognising which one you are in tells you where your logic goes, and turns "I do not know how to start" into a three-line helper.',
      },
      { kind: 'heading', text: 'Shape 1 — compute from the children (postorder)' },
      {
        kind: 'code',
        code: `def max_depth(root):
    if not root:
        return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))


# Diameter — the answer may not pass through the root
def diameter(root):
    best = 0

    def depth(node):
        nonlocal best
        if not node:
            return 0

        l, r = depth(node.left), depth(node.right)
        best = max(best, l + r)        # path THROUGH this node
        return 1 + max(l, r)           # what the parent needs

    depth(root)
    return best`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Return one thing, record another',
        body: 'Diameter, Max Path Sum and Longest Univalue Path all share this shape: the helper **returns** what the parent needs while updating a `nonlocal` with the best answer seen anywhere. Separating those two is the key insight.',
      },
      { kind: 'heading', text: 'Shape 2 — carry information down (preorder)' },
      {
        kind: 'code',
        caption: 'Validate a BST with inherited bounds',
        code: `def is_valid_bst(root):
    def valid(node, low, high):
        if not node:
            return True
        if not (low < node.val < high):     # chained comparison
            return False

        return valid(node.left,  low, node.val) \\
           and valid(node.right, node.val, high)

    return valid(root, float("-inf"), float("inf"))`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Comparing only with the children is wrong',
        body: 'Checking `node.left.val < node.val` passes trees that are not BSTs — a node deep in the left subtree can still exceed the root. The bounds must be inherited from **every** ancestor, which is what the two extra parameters do.',
      },
      { kind: 'heading', text: 'Shape 3 — level by level (BFS)' },
      {
        kind: 'code',
        code: `while q:
    level = []
    for _ in range(len(q)):
        node = q.popleft()
        level.append(node.val)
        if node.left:  q.append(node.left)
        if node.right: q.append(node.right)
    res.append(level)`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Inorder on a BST yields sorted order',
        body: 'That single fact solves Kth Smallest in a BST, validates a BST by checking the sequence increases, and converts a BST to a sorted list. If a problem mentions a BST and an ordering, inorder is almost certainly the tool.',
      },
      {
        kind: 'code',
        caption: 'Lowest Common Ancestor — a clean postorder',
        code: `def lca(node, p, q):
    if not node or node is p or node is q:
        return node

    left  = lca(node.left,  p, q)
    right = lca(node.right, p, q)

    if left and right:
        return node              # one on each side -> this is the LCA
    return left or right         # otherwise pass up whichever we found`,
      },
    ],
    keyTakeaways: [
      'Postorder computes from children; preorder carries context down.',
      'Return what the parent needs; record the global best with `nonlocal`.',
      'BST validation needs inherited bounds, not child comparisons.',
      'Inorder on a BST yields sorted order.',
    ],
    practice: {
      prompt: 'Solve Maximum Depth, Diameter, and Validate BST — one for each shape. Then write LCA and note it is postorder again.',
      leetcode: { title: 'Validate Binary Search Tree', slug: 'validate-binary-search-tree' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-14.9',
    language: 'python',
    summary: 'Apply the graph patterns beyond plain traversal.',
    readMinutes: 6,
    blocks: [
      {
        kind: 'text',
        body: 'Once you can traverse a graph, four further patterns cover most graph problems: topological sort, union-find, Dijkstra, and cycle detection. Each has a distinctive tell in the statement.',
      },
      { kind: 'heading', text: 'Topological sort — "prerequisites"' },
      {
        kind: 'code',
        code: `from collections import deque, defaultdict

def topo_order(n, edges):
    adj = defaultdict(list)
    indeg = [0] * n

    for a, b in edges:              # [a, b] means "b before a"
        adj[b].append(a)
        indeg[a] += 1

    q = deque(v for v in range(n) if indeg[v] == 0)
    order = []

    while q:
        node = q.popleft()
        order.append(node)
        for nxt in adj[node]:
            indeg[nxt] -= 1
            if indeg[nxt] == 0:
                q.append(nxt)

    return order if len(order) == n else []      # short -> a cycle`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Cycle detection comes free',
        body: 'If fewer than `n` nodes are emitted, the leftovers are stuck waiting on each other. `len(order) == n` is the whole answer to "can all courses be finished?".',
      },
      { kind: 'heading', text: 'Dijkstra — "cheapest path", weighted' },
      {
        kind: 'code',
        code: `import heapq

def dijkstra(n, adj, start):
    dist = [float("inf")] * n
    dist[start] = 0
    pq = [(0, start)]

    while pq:
        d, u = heapq.heappop(pq)

        if d > dist[u]:
            continue                       # stale entry — already improved

        for v, w in adj[u]:
            if d + w < dist[v]:
                dist[v] = d + w
                heapq.heappush(pq, (dist[v], v))

    return dist`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Lazy deletion is the standard Python Dijkstra',
        body: '`heapq` cannot decrease a key, so rather than updating an entry you push a better one and skip the stale copy on pop. The heap may reach E entries, which is fine.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Dijkstra fails on negative weights',
        body: 'The "popped means final" invariant breaks and the answer is silently wrong. Negative edges need Bellman-Ford, which also detects negative cycles.',
      },
      { kind: 'heading', text: 'Union-find — "are these connected?"' },
      {
        kind: 'code',
        code: `dsu = DSU(n)
for u, v in edges:
    dsu.unite(u, v)
return dsu.components

# unite returns False when both are already joined -> that edge is redundant`,
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
        title: 'Directed and undirected cycles differ',
        body: 'Union-find detects cycles in **undirected** graphs only. A directed cycle needs three-colour DFS or Kahn\'s count check — `1→2` and `1→3` would wrongly look like a cycle to a DSU.',
      },
    ],
    keyTakeaways: [
      'Kahn gives a topological order and cycle detection in one loop.',
      'Python Dijkstra uses lazy deletion and a `(dist, node)` tuple heap.',
      'Union-find shines when edges arrive dynamically.',
      'Undirected cycles → DSU; directed cycles → colours or Kahn.',
    ],
    practice: {
      prompt: 'Solve Course Schedule II, Number of Provinces, and Network Delay Time — one per pattern. Then compare with the /patterns cheatsheet entries for the same three.',
      leetcode: { title: 'Course Schedule II', slug: 'course-schedule-ii' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-14.10',
    language: 'python',
    summary: 'Apply the backtracking template that every "find all" problem uses.',
    readMinutes: 6,
    blocks: [
      {
        kind: 'text',
        body: 'Backtracking is recursion that **explores options and undoes them**. Whenever a problem says "find *all* subsets / permutations / paths / ways", this is the technique — and it is the same three lines every time.',
      },
      {
        kind: 'code',
        caption: 'The skeleton. Memorise this shape.',
        code: `def backtrack(state):
    if is_complete(state):
        res.append(path[:])          # COPY, not the reference
        return

    for option in options:
        path.append(option)          # 1. CHOOSE
        backtrack(smaller_state)     # 2. RECURSE
        path.pop()                   # 3. UN-CHOOSE`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: '`res.append(path)` stores a reference',
        body: 'Python lists are objects. Appending `path` directly puts the *same* list in `res` every time, and since you keep mutating it, every entry ends up identical — usually empty. Always `path[:]` or `list(path)`.',
      },
      {
        kind: 'code',
        caption: 'Subsets, permutations, combinations — one skeleton',
        code: `# SUBSETS — every node is an answer; pass i + 1 so nothing repeats
def dfs(start):
    res.append(path[:])
    for i in range(start, len(nums)):
        path.append(nums[i])
        dfs(i + 1)
        path.pop()

# COMBINATION SUM — reuse allowed, so pass i rather than i + 1
def dfs(start, remaining):
    if remaining == 0: res.append(path[:]); return
    if remaining < 0:  return                      # prune

    for i in range(start, len(nums)):
        path.append(nums[i])
        dfs(i, remaining - nums[i])                # i, not i + 1
        path.pop()

# PERMUTATIONS — order matters, so loop from 0 with a used[] array
def dfs():
    if len(path) == len(nums): res.append(path[:]); return

    for i in range(len(nums)):
        if used[i]: continue

        used[i] = True;  path.append(nums[i])
        dfs()
        used[i] = False; path.pop()                # undo BOTH`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The only difference is the loop',
        body: 'Subsets and combinations pass `i + 1`; reuse-allowed problems pass `i`; permutations loop from 0 with a `used` array. Same skeleton, one changed argument — which is why learning it once covers the whole family.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Every mutation before the call needs a matching undo',
        body: 'If you set `used[i] = True` and append to `path`, you must reverse **both**. Treating them as a symmetric pair around the recursive call makes the mistake visible on sight.',
      },
      {
        kind: 'text',
        body: 'Pruning is what makes backtracking fast enough. If the partial answer already violates a constraint — sum exceeded, column attacked, prefix not in the dictionary — return immediately. On N-Queens and Word Search II, pruning is the difference between passing and timing out.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The immutable alternative',
        body: 'Passing `path + [x]` down creates a fresh list per call, so no undo is needed and the code is shorter. It allocates on every call, so prefer the explicit undo for large search spaces — but for small ones it is genuinely cleaner.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'The output itself is exponential',
        body: 'Subsets produces 2ⁿ results and permutations n!. That cost is unavoidable when the problem asks you to *list* everything — which is why constraints for these problems always have n ≤ 20 or so.',
      },
    ],
    keyTakeaways: [
      'Choose → recurse → un-choose. The undo is what makes it backtracking.',
      'Copy with `path[:]` when recording — never append the reference.',
      'Subsets pass `i + 1`; reuse passes `i`; permutations use `used[]`.',
      'Prune early, and expect exponential output by design.',
    ],
    practice: {
      prompt: 'Write Subsets, then Permutations, then Combination Sum. Then delete the `path.pop()` from one and watch the results turn to nonsense — that shows what the undo is for.',
      leetcode: { title: 'Subsets', slug: 'subsets' },
    },
  },
];
