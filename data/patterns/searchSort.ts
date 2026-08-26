import type { Pattern } from './types';

/** Binary search, interval work, and the linked-list pointer patterns. */
export const searchSortPatterns: Pattern[] = [
  // ==========================================================================
  {
    slug: 'binary-search',
    name: 'Binary Search',
    category: 'search-sort',
    oneLiner:
      'Halve the search space every step — on a sorted array, or on the answer itself.',
    triggers: [
      'The input is **sorted**, or rotated-sorted',
      'n is huge (10⁹) but you only need one number — O(n) is already too slow',
      '"Minimum / maximum value such that <condition> holds"',
      '"Can we do it in `x` time / capacity?" where a bigger `x` is always easier',
      'The constraint mentions O(log n) explicitly',
    ],
    idea: [
      'The classic form searches a sorted array: compare with the middle, throw away half. What makes it hard is not the idea but the **loop invariant** — pick one convention and never deviate. The version below uses a closed interval `[lo, hi]` with `while (lo <= hi)`, which is the easiest to reason about for exact-match search.',
      'The far more valuable form is **binary search on the answer**. When the question is "what is the smallest capacity / speed / size that works?", you are not searching an array at all — you are searching the range of possible answers. It applies whenever the predicate is **monotonic**: if `x` works then every larger `x` works too.',
      'The recipe: write a boolean `feasible(x)` that answers "is `x` good enough?", then binary search the smallest `x` for which it is true. Koko Eating Bananas, Split Array Largest Sum, Capacity to Ship Packages and Minimum Days to Make Bouquets are all literally the same eight lines with a different `feasible`.',
      'For the "find the boundary" form use the half-open convention `while (lo < hi)` with `hi = mid` and `lo = mid + 1`, and return `lo`. It cannot loop forever as long as `mid` is computed with floor division, and it lands exactly on the first `true`.',
    ],
    time: 'O(log n), or O(n log(range)) when searching the answer',
    timeShort: 'O(log n)',
    space: 'O(1)',
    template: {
      cpp: `// Exact match in a sorted array. Closed interval [lo, hi].
int lo = 0, hi = nums.size() - 1;

while (lo <= hi) {
    int mid = lo + (hi - lo) / 2;      // overflow-safe midpoint

    if (nums[mid] == target)  return mid;
    else if (nums[mid] < target) lo = mid + 1;   // answer is right
    else                         hi = mid - 1;   // answer is left
}
return -1;                             // not found`,
      java: `// Exact match in a sorted array. Closed interval [lo, hi].
int lo = 0, hi = nums.length - 1;

while (lo <= hi) {
    int mid = lo + (hi - lo) / 2;      // overflow-safe midpoint

    if (nums[mid] == target)  return mid;
    else if (nums[mid] < target) lo = mid + 1;   // answer is right
    else                         hi = mid - 1;   // answer is left
}
return -1;                             // not found`,
      python: `# Exact match in a sorted array. Closed interval [lo, hi].
lo, hi = 0, len(nums) - 1

while lo <= hi:
    mid = (lo + hi) // 2               # Python ints never overflow

    if nums[mid] == target:
        return mid
    elif nums[mid] < target:
        lo = mid + 1                   # answer is right
    else:
        hi = mid - 1                   # answer is left
return -1                              # not found`,
    },
    variants: [
      {
        name: 'Binary search on the answer',
        when: '"Smallest x such that it works". Needs a monotonic `feasible(x)`.',
        code: {
          cpp: `// Find the SMALLEST x in [lo, hi] with feasible(x) == true.
int lo = 1, hi = *max_element(piles.begin(), piles.end());

while (lo < hi) {                      // half-open: converge on the boundary
    int mid = lo + (hi - lo) / 2;

    if (feasible(mid)) hi = mid;       // mid works — it might BE the answer
    else               lo = mid + 1;   // mid fails — answer is strictly right
}
return lo;                             // lo == hi == first feasible x`,
          java: `// Find the SMALLEST x in [lo, hi] with feasible(x) == true.
int lo = 1, hi = Arrays.stream(piles).max().getAsInt();

while (lo < hi) {                      // half-open: converge on the boundary
    int mid = lo + (hi - lo) / 2;

    if (feasible(mid)) hi = mid;       // mid works — it might BE the answer
    else               lo = mid + 1;   // mid fails — answer is strictly right
}
return lo;                             // lo == hi == first feasible x`,
          python: `# Find the SMALLEST x in [lo, hi] with feasible(x) == True.
lo, hi = 1, max(piles)

while lo < hi:                         # half-open: converge on the boundary
    mid = (lo + hi) // 2

    if feasible(mid):
        hi = mid                       # mid works — it might BE the answer
    else:
        lo = mid + 1                   # mid fails — answer is strictly right
return lo                              # lo == hi == first feasible x`,
        },
      },
      {
        name: 'Library bounds',
        when: 'You just need the insertion point — do not hand-roll it.',
        code: {
          cpp: `// first index with value >= target
int i = lower_bound(v.begin(), v.end(), target) - v.begin();

// first index with value >  target
int j = upper_bound(v.begin(), v.end(), target) - v.begin();

int countOfTarget = j - i;`,
          java: `// Returns the index if found, else -(insertionPoint) - 1
int i = Arrays.binarySearch(a, target);
int insertAt = i >= 0 ? i : -i - 1;

// TreeMap gives you the ordered-container equivalents
Integer ceil  = treeMap.ceilingKey(target);
Integer floor = treeMap.floorKey(target);`,
          python: `from bisect import bisect_left, bisect_right

i = bisect_left(a, target)     # first index with value >= target
j = bisect_right(a, target)    # first index with value >  target

count_of_target = j - i`,
        },
      },
    ],
    problems: [
      {
        title: 'Binary Search',
        slug: 'binary-search',
        difficulty: 'Easy',
        note: 'The template, nothing else. Write it from memory until it is automatic.',
      },
      {
        title: 'First Bad Version',
        slug: 'first-bad-version',
        difficulty: 'Easy',
        note: 'The boundary form — the gateway to searching the answer.',
      },
      {
        title: 'Search in Rotated Sorted Array',
        slug: 'search-in-rotated-sorted-array',
        difficulty: 'Medium',
        note: 'One half is always sorted; work out which, then decide.',
      },
      {
        title: 'Koko Eating Bananas',
        slug: 'koko-eating-bananas',
        difficulty: 'Medium',
        note: 'The archetype of binary search on the answer.',
      },
      {
        title: 'Median of Two Sorted Arrays',
        slug: 'median-of-two-sorted-arrays',
        difficulty: 'Hard',
        note: 'Binary search on the partition. Genuinely hard — save it for later.',
      },
    ],
    pitfalls: [
      {
        title: '`(lo + hi) / 2` overflows',
        body: 'In C++ and Java, `lo + hi` can exceed `INT_MAX` when both are large, producing a negative index and an out-of-bounds crash. Always write `lo + (hi - lo) / 2`. This exact bug sat in the JDK\'s own binary search for nine years.',
      },
      {
        title: 'Infinite loop from the wrong update',
        body: 'With `while (lo < hi)`, writing `lo = mid` (instead of `mid + 1`) hangs forever when `hi == lo + 1`, because `mid` floors to `lo`. Rule: whichever bound you set to `mid` unchanged, the other must move past it.',
      },
      {
        title: 'Mixing the two conventions',
        body: 'Pick one: `while (lo <= hi)` with `hi = mid - 1`, or `while (lo < hi)` with `hi = mid`. Half of one and half of the other either loops forever or skips the answer. Write the same convention every time and it stops being a source of bugs.',
      },
      {
        title: 'Searching an unsorted array',
        body: 'Binary search needs a monotonic property. On raw unsorted input it returns confident nonsense. For "binary search on the answer", verify the predicate is genuinely monotonic — if `feasible(5)` is true but `feasible(6)` is false, the whole approach is invalid.',
      },
    ],
    related: ['two-pointers', 'interval-merge', 'greedy'],
  },

  // ==========================================================================
  {
    slug: 'interval-merge',
    name: 'Interval Merge',
    category: 'search-sort',
    oneLiner: 'Sort by start, then sweep once — overlaps become adjacent.',
    triggers: [
      'The input is a list of `[start, end]` pairs',
      '"Merge overlapping", "insert an interval", "do any two conflict?"',
      '"Meeting rooms", "how many resources do I need at once?"',
      '"Minimum number of X to remove so nothing overlaps"',
      'Anything about booking, scheduling, or time ranges',
    ],
    idea: [
      'Almost every interval problem starts the same way: **sort by start time**. Once sorted, any interval can only overlap with the one immediately before it in the merged output, so a single left-to-right sweep is enough. That sort is not a preliminary step — it *is* the algorithm.',
      'Two intervals `a` and `b` (with `a` starting first) overlap when `a.end >= b.start`. When they do, merge by extending the end to `max(a.end, b.end)` — you must take the max, because `a` can completely contain `b`. When they do not, push `a` and move on.',
      'A different family — "how many rooms are needed at once?" — is better solved as a **sweep line**. Treat each interval as a `+1` at its start and a `−1` at its end, sort all these events by time, and track the running total. The peak of that total is the answer. A min-heap of end times gives the same result and is often easier to write.',
      'For "remove the fewest intervals so none overlap", sort by **end** rather than start and greedily keep the interval that finishes earliest. Finishing early leaves the most room for everything after it — this is the classic activity-selection exchange argument.',
    ],
    time: 'O(n log n) — dominated by the sort',
    timeShort: 'O(n log n)',
    space: 'O(n) for the output',
    template: {
      cpp: `// Merge all overlapping intervals.
sort(intervals.begin(), intervals.end());        // by start

vector<vector<int>> merged;

for (auto& cur : intervals) {
    // no overlap with the last merged interval -> start a new one
    if (merged.empty() || merged.back()[1] < cur[0]) {
        merged.push_back(cur);
    } else {
        // overlap -> extend. max() matters: last may CONTAIN cur
        merged.back()[1] = max(merged.back()[1], cur[1]);
    }
}
return merged;`,
      java: `// Merge all overlapping intervals.
Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));   // by start

List<int[]> merged = new ArrayList<>();

for (int[] cur : intervals) {
    // no overlap with the last merged interval -> start a new one
    if (merged.isEmpty() || merged.get(merged.size() - 1)[1] < cur[0]) {
        merged.add(cur);
    } else {
        // overlap -> extend. max() matters: last may CONTAIN cur
        int[] last = merged.get(merged.size() - 1);
        last[1] = Math.max(last[1], cur[1]);
    }
}
return merged.toArray(new int[0][]);`,
      python: `# Merge all overlapping intervals.
intervals.sort()                                 # by start

merged = []

for cur in intervals:
    # no overlap with the last merged interval -> start a new one
    if not merged or merged[-1][1] < cur[0]:
        merged.append(cur)
    else:
        # overlap -> extend. max() matters: last may CONTAIN cur
        merged[-1][1] = max(merged[-1][1], cur[1])

return merged`,
    },
    variants: [
      {
        name: 'Sweep line / min-heap (meeting rooms)',
        when: '"How many overlap at the busiest moment?" rather than merging.',
        code: {
          cpp: `sort(intervals.begin(), intervals.end());
priority_queue<int, vector<int>, greater<int>> endTimes;   // min-heap

for (auto& cur : intervals) {
    // a room whose meeting already ended is free again
    if (!endTimes.empty() && endTimes.top() <= cur[0]) endTimes.pop();
    endTimes.push(cur[1]);
}
return endTimes.size();          // rooms in use at the peak`,
          java: `Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
PriorityQueue<Integer> endTimes = new PriorityQueue<>();     // min-heap

for (int[] cur : intervals) {
    // a room whose meeting already ended is free again
    if (!endTimes.isEmpty() && endTimes.peek() <= cur[0]) endTimes.poll();
    endTimes.add(cur[1]);
}
return endTimes.size();          // rooms in use at the peak`,
          python: `import heapq

intervals.sort()
end_times = []                   # min-heap

for cur in intervals:
    # a room whose meeting already ended is free again
    if end_times and end_times[0] <= cur[0]:
        heapq.heappop(end_times)
    heapq.heappush(end_times, cur[1])

return len(end_times)            # rooms in use at the peak`,
        },
      },
    ],
    problems: [
      {
        title: 'Merge Intervals',
        slug: 'merge-intervals',
        difficulty: 'Medium',
        note: 'The template exactly.',
      },
      {
        title: 'Insert Interval',
        slug: 'insert-interval',
        difficulty: 'Medium',
        note: 'Already sorted — three phases: before, overlapping, after.',
      },
      {
        title: 'Non-overlapping Intervals',
        slug: 'non-overlapping-intervals',
        difficulty: 'Medium',
        note: 'Sort by END and be greedy. A genuinely different sort key.',
      },
      {
        title: 'Meeting Rooms II',
        slug: 'meeting-rooms-ii',
        difficulty: 'Medium',
        note: 'The min-heap variant. Premium, but the idea shows up everywhere.',
      },
      {
        title: 'Employee Free Time',
        slug: 'employee-free-time',
        difficulty: 'Hard',
        note: 'Flatten everything, merge, then read off the gaps.',
      },
    ],
    pitfalls: [
      {
        title: 'Extending with `cur[1]` instead of `max(...)`',
        body: 'If the previous interval fully contains the current one — `[1,10]` then `[2,3]` — assigning `cur[1]` *shrinks* the merged interval to `[1,3]`. Always take the max of the two ends.',
      },
      {
        title: 'Touching intervals: `<` or `<=`?',
        body: 'Do `[1,2]` and `[2,3]` overlap? For merging, usually yes (merge to `[1,3]`), so the "no overlap" test is `last.end < cur.start`. For meeting rooms, usually no — a meeting ending at 2 frees the room for one starting at 2. Read the prompt; this decides several test cases.',
      },
      {
        title: 'Sorting by the wrong key',
        body: 'Merging sorts by start. Activity selection ("keep the most non-overlapping") sorts by **end**. Using start for the greedy version gives a wrong answer on inputs with one long early interval.',
      },
      {
        title: 'Java: mutating the array you were given',
        body: 'The template writes into `last[1]`, which mutates the caller\'s `int[]`. LeetCode does not care, but it is a real bug in production code — copy the pair before storing it if the input must stay intact.',
      },
    ],
    related: ['greedy', 'binary-search', 'two-heaps'],
  },

  // ==========================================================================
  {
    slug: 'slow-fast-pointers',
    name: 'Slow–Fast Pointers',
    category: 'linked-list',
    oneLiner:
      "Two pointers at different speeds — finds cycles and midpoints without extra memory.",
    triggers: [
      '"Does this linked list have a cycle?"',
      '"Find the middle node" in one pass',
      '"Find the node where the cycle begins"',
      '"Find the duplicate number" with O(1) space and a read-only array',
      '"Happy number", or any "does this sequence repeat?" question',
    ],
    idea: [
      'Move `slow` one step and `fast` two steps. If the list ends, `fast` falls off and there is no cycle. If there is a cycle, `fast` gains one position on `slow` every iteration, so it closes the gap by exactly one each time and **must** land on `slow` eventually. It cannot step over it — that is why the speeds are 1 and 2.',
      'The same setup finds the middle: when `fast` reaches the end, `slow` is at the midpoint, in a single pass with O(1) memory. Whether you get the lower or upper middle for an even-length list depends on your loop condition — `while (fast && fast->next)` gives the upper middle, which is what most problems want.',
      'Finding the **cycle entrance** (Floyd\'s algorithm) is the part people memorise without understanding. After the meeting, reset one pointer to the head and advance both one step at a time; they meet at the entrance. It works because the distance from the head to the entrance equals the distance from the meeting point to the entrance, going forward around the loop.',
      'The trick generalises beyond linked lists to any sequence defined by `next = f(current)`. "Find the Duplicate Number" builds exactly such a sequence with `next = nums[current]`, which is why an array problem has a linked-list solution.',
    ],
    time: 'O(n)',
    timeShort: 'O(n)',
    space: 'O(1)',
    template: {
      cpp: `// Detect a cycle, then find where it starts.
ListNode *slow = head, *fast = head;

while (fast && fast->next) {
    slow = slow->next;                 // 1 step
    fast = fast->next->next;           // 2 steps

    if (slow == fast) {                // they met -> there IS a cycle
        slow = head;                   // reset one to the head
        while (slow != fast) {         // now both move 1 step
            slow = slow->next;
            fast = fast->next;
        }
        return slow;                   // the cycle entrance
    }
}
return nullptr;                        // fast fell off -> no cycle`,
      java: `// Detect a cycle, then find where it starts.
ListNode slow = head, fast = head;

while (fast != null && fast.next != null) {
    slow = slow.next;                  // 1 step
    fast = fast.next.next;             // 2 steps

    if (slow == fast) {                // they met -> there IS a cycle
        slow = head;                   // reset one to the head
        while (slow != fast) {         // now both move 1 step
            slow = slow.next;
            fast = fast.next;
        }
        return slow;                   // the cycle entrance
    }
}
return null;                           // fast fell off -> no cycle`,
      python: `# Detect a cycle, then find where it starts.
slow = fast = head

while fast and fast.next:
    slow = slow.next                   # 1 step
    fast = fast.next.next              # 2 steps

    if slow is fast:                   # they met -> there IS a cycle
        slow = head                    # reset one to the head
        while slow is not fast:        # now both move 1 step
            slow = slow.next
            fast = fast.next
        return slow                    # the cycle entrance

return None                            # fast fell off -> no cycle`,
    },
    variants: [
      {
        name: 'Middle of the list',
        when: 'One-pass midpoint — the setup step for merge-sorting a list or checking a palindrome.',
        code: {
          cpp: `ListNode *slow = head, *fast = head;

while (fast && fast->next) {
    slow = slow->next;
    fast = fast->next->next;
}
return slow;          // even length -> the UPPER middle`,
          java: `ListNode slow = head, fast = head;

while (fast != null && fast.next != null) {
    slow = slow.next;
    fast = fast.next.next;
}
return slow;          // even length -> the UPPER middle`,
          python: `slow = fast = head

while fast and fast.next:
    slow = slow.next
    fast = fast.next.next

return slow           # even length -> the UPPER middle`,
        },
      },
    ],
    problems: [
      {
        title: 'Middle of the Linked List',
        slug: 'middle-of-the-linked-list',
        difficulty: 'Easy',
        note: 'The simplest possible use. Start here.',
      },
      {
        title: 'Linked List Cycle',
        slug: 'linked-list-cycle',
        difficulty: 'Easy',
        note: 'Detection only — no entrance needed.',
      },
      {
        title: 'Linked List Cycle II',
        slug: 'linked-list-cycle-ii',
        difficulty: 'Medium',
        note: 'The full template, including the reset step.',
      },
      {
        title: 'Palindrome Linked List',
        slug: 'palindrome-linked-list',
        difficulty: 'Easy',
        note: 'Find the middle, reverse the second half, compare. O(1) space.',
      },
      {
        title: 'Find the Duplicate Number',
        slug: 'find-the-duplicate-number',
        difficulty: 'Medium',
        note: 'An array problem in disguise — the cleverest use of the pattern.',
      },
    ],
    pitfalls: [
      {
        title: 'Not checking `fast->next` before the double step',
        body: '`fast = fast->next->next` dereferences null when `fast->next` is null. The loop condition must be `while (fast && fast->next)` — checking only `fast` segfaults in C++ and throws `NullPointerException` in Java on any even-length list.',
      },
      {
        title: 'Starting the pointers in different places',
        body: 'Floyd\'s entrance step only works if both start at `head`. Starting `fast` at `head->next` (which some cycle-detection write-ups do) changes the meeting point and breaks the reset step. Keep both at `head`.',
      },
      {
        title: 'Comparing values instead of nodes',
        body: 'Test `slow == fast` (identity), not `slow->val == fast->val`. A list with repeated values would report a cycle that does not exist. In Python this means `is`, not `==`.',
      },
      {
        title: 'Assuming `slow` lands on the lower middle',
        body: 'With `while (fast && fast->next)` and an even-length list you get the **upper** middle. If a problem needs the lower one (splitting a list for merge sort, say), track `prev` or change the condition — off-by-one here causes infinite recursion when merge-sorting a two-node list.',
      },
    ],
    related: ['two-pointers', 'hash-map-set'],
  },
];
