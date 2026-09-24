import type { SharedLesson } from './types';

/**
 * Searching from Scratch — Master sequential searching, the foundational binary search
 * template, integer overflow and off-by-one avoidance, boundary searches for first and last
 * occurrences, lower and upper bounds, monotonic binary search on the answer, 2D matrix
 * virtualisation, and ternary search on unimodal functions.
 */
export const lessons: SharedLesson[] = [
  // =========================================================================
  // Lesson 1: Linear search and early exit
  // =========================================================================
  {
    sub: 1,
    summary: 'Scan unsorted collections sequentially and exit the loop immediately upon finding the target to minimise comparisons.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Searching is the algorithmic operation of finding the location of a desired value, called the **target**, within a collection, or determining that it is absent. When an array has no guaranteed ordering, an element might reside at any index. The baseline approach is **linear search**: inspecting each slot one by one starting from index `0` and progressing sequentially to the end.',
      },
      { kind: 'heading', text: 'Early exit and why continuing to search is wasteful' },
      {
        kind: 'text',
        body: 'A frequent habit when first writing search loops is iterating across every element of the array regardless of when the match is found. An **early exit** halts iteration the moment a match is identified, returning the index or using a `break` statement. If an array holds one million numbers and the target resides at index `0`, an early exit terminates in a single comparison. Continuing to loop wastes 999,999 unnecessary comparisons.',
      },
      {
        kind: 'code',
        caption: 'Linear search returning index on early exit or -1 on absence',
        code: {
          cpp: `#include <vector>
using namespace std;

int linearSearch(const vector<int>& nums, int target) {
    for (int i = 0; i < (int)nums.size(); i++) {
        if (nums[i] == target) {
            return i; // Early exit: stop the moment target is found
        }
    }
    return -1; // Target is absent from the entire array
}`,
          java: `public class LinearSearch {
    public static int search(int[] nums, int target) {
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] == target) {
                return i; // Early exit: stop the moment target is found
            }
        }
        return -1; // Target is absent from the entire array
    }
}`,
          python: `def linear_search(nums: list[int], target: int) -> int:
    for i in range(len(nums)):
        if nums[i] == target:
            return i  # Early exit: stop the moment target is found
    return -1  # Target is absent from the entire array`,
        },
      },
      { kind: 'heading', text: 'Complexity across best, average, and worst cases' },
      {
        kind: 'table',
        headers: ['Case', 'Comparisons', 'Time Complexity', 'When It Occurs'],
        rows: [
          ['Best Case', '1', 'O(1)', 'Target sits at the first position (index 0)'],
          ['Average Case', 'n / 2', 'O(n)', 'Target appears at a random location with equal likelihood'],
          ['Worst Case', 'n', 'O(n)', 'Target sits at the final position (index n - 1) or is missing'],
          ['Auxiliary Space', '0', 'O(1)', 'Requires only a loop index counter'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Placing the not-found return inside the loop',
        body: 'A common mistake is placing `return -1` inside an `else` branch within the search loop. Doing so forces the function to exit during the very first iteration whenever `nums[0] != target`, leaving the remainder of the array uninspected. The negative return must always sit outside and after the loop.',
      },
    ],
    keyTakeaways: [
      'Linear search scans unsorted collections sequentially with O(n) worst-case time.',
      'Early exit returns immediately upon finding a match, reducing best-case runtime to O(1).',
      'The failure return must sit strictly outside the loop body after all elements have been examined.',
    ],
    practice: {
      prompt: 'Given an array of integers, check whether there exist two distinct indices i and j such that nums[i] == 2 * nums[j]. Use early exit to return true as soon as any valid pair is detected.',
      leetcode: { title: 'Check If N and Its Double Exist', slug: 'check-if-n-and-its-double-exist' },
    },
  },

  // =========================================================================
  // Lesson 2: Binary search: the template
  // =========================================================================
  {
    sub: 2,
    summary: 'Implement the standard binary search algorithm on a sorted array using the inclusive-boundary two-pointer template.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'When data is arranged in ascending sorted order, inspecting the middle element provides immediate information about where the target can exist. If the target is smaller than the middle element, it cannot exist anywhere in the right half because every element there is even larger. Discarding half the remaining candidates at each comparison produces **binary search**, which runs in `O(log n)` time.',
      },
      { kind: 'heading', text: 'The inclusive-range two-pointer template' },
      {
        kind: 'text',
        body: 'The most reliable mental model for binary search maintains an **inclusive search boundary** `[left, right]`. Both pointers start at valid array bounds: `left = 0` and `right = n - 1`. While `left <= right`, calculate the midpoint `mid`. If `nums[mid] == target`, the element is found. If `nums[mid] < target`, the target must lie to the right, so advance `left = mid + 1`. If `nums[mid] > target`, the target lies to the left, so retreat `right = mid - 1`.',
      },
      {
        kind: 'code',
        caption: 'The canonical inclusive binary search template',
        code: {
          cpp: `#include <vector>
using namespace std;

int binarySearch(const vector<int>& nums, int target) {
    int left = 0;
    int right = (int)nums.size() - 1;

    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) {
            return mid;
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return -1;
}`,
          java: `public class BinarySearch {
    public static int search(int[] nums, int target) {
        int left = 0;
        int right = nums.length - 1;

        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) {
                return mid;
            } else if (nums[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        return -1;
    }
}`,
          python: `def binary_search(nums: list[int], target: int) -> int:
    left = 0
    right = len(nums) - 1

    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`,
        },
      },
      { kind: 'heading', text: 'Halving the search space per iteration' },
      {
        kind: 'table',
        headers: ['Step', 'Remaining Candidates (Formula)', 'Candidates (for n = 1,000,000)'],
        rows: [
          ['Start', 'n', '1,000,000'],
          ['Iteration 1', 'n / 2', '500,000'],
          ['Iteration 2', 'n / 4', '250,000'],
          ['Iteration 10', 'n / 1024', '~976'],
          ['Iteration 20', 'n / 1,048,576', '<= 1'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Why left <= right is required for inclusive bounds',
        body: 'When the search space narrows to a single candidate, `left` and `right` point to the exact same index (`left == right`). If the loop condition were `left < right`, the loop would terminate without evaluating that last remaining element, returning `-1` even when the target is present.',
      },
    ],
    keyTakeaways: [
      'Binary search requires sorted input and halves the search space at each step in O(log n) time.',
      'An inclusive boundary [left, right] requires the loop condition `left <= right`.',
      'Always move pointers strictly past mid using `left = mid + 1` and `right = mid - 1` to guarantee convergence.',
    ],
    practice: {
      prompt: 'Given a sorted array of distinct integers and a target value, return the index of target if it exists, or -1 otherwise, using the binary search template.',
      leetcode: { title: 'Binary Search', slug: 'binary-search' },
    },
  },

  // =========================================================================
  // Lesson 3: Off-by-one, infinite loops and the mid overflow bug
  // =========================================================================
  {
    sub: 3,
    summary: 'Prevent the three fatal binary search bugs: integer overflow in mid calculations, pointer stagnation, and interval off-by-one errors.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Binary search is conceptually compact, yet historically infamous for subtle edge-case failures. In 2006, computer scientists discovered that standard binary search implementations across major system libraries had harboured an integer overflow bug for nearly a decade. Mastering binary search requires recognising and eliminating three specific bugs: arithmetic overflow, non-advancing pointers, and interval mismatch.',
      },
      { kind: 'heading', text: 'The midpoint overflow bug' },
      {
        kind: 'text',
        body: 'Writing `mid = (left + right) / 2` works as long as `left + right` does not exceed the maximum positive value of a signed 32-bit integer (`2,147,483,647`). When searching large arrays or value ranges where the sum exceeds this bound, the addition overflows into a negative number. In languages with fixed-width integers, this negative index causes immediate out-of-bounds crashes. Calculating `mid = left + (right - left) / 2` computes the difference first, which never overflows.',
      },
      {
        kind: 'code',
        caption: 'Midpoint calculation: arithmetic overflow versus safe distance',
        code: {
          cpp: `// BUG: left + right can exceed 2^31 - 1, producing negative values
// int mid = (left + right) / 2;

// SAFE: right - left is always positive and <= right
int mid = left + (right - left) / 2;`,
          java: `// BUG: integer overflow produces a negative index
// int mid = (left + right) / 2;

// SAFE: distance calculation avoids large sums entirely
int mid = left + (right - left) / 2;`,
          python: `# Python automatically promotes integers to arbitrary precision,
# but using integer floor division // without float conversion is essential.
mid = left + (right - left) // 2`,
        },
      },
      { kind: 'heading', text: 'Infinite loops caused by non-advancing pointers' },
      {
        kind: 'text',
        body: 'An **infinite loop** occurs when pointer updates fail to shrink the active window. Suppose `left = 4` and `right = 5`. The calculation `mid = 4 + (5 - 4) / 2` produces `mid = 4`. If the code updates `left = mid` instead of `left = mid + 1`, `left` remains `4`. On the subsequent iteration, `left`, `right`, and `mid` have identical values, repeating forever without terminating.',
      },
      {
        kind: 'table',
        headers: ['Bug Pattern', 'Manifestation', 'Correct Defensive Pattern'],
        rows: [
          ['`(left + right) / 2`', 'Signed 32-bit overflow wraps to negative index', '`left + (right - left) / 2`'],
          ['`left = mid` with floor mid', 'Infinite loop when `right == left + 1`', '`left = mid + 1`'],
          ['`while (left < right)` with `[0..n-1]`', 'Final remaining element is never evaluated', '`while (left <= right)`'],
          ['`right = mid` with closed bounds', 'Infinite loop if mid calculation rounds up', '`right = mid - 1`'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Floor division behaviour across languages',
        body: {
          cpp: 'In C++, integer division `/` truncates toward zero. When `left` and `right` are non-negative indices, `(right - left) / 2` rounds down toward `left`.',
          java: 'In Java, integer division between `int` values truncates toward zero. For non-negative index ranges, `(right - left) / 2` rounds down toward `left`.',
          python: 'In Python, using `/` produces a float, which causes a TypeError when indexing a list. You must always use the integer floor division operator `//`.',
        },
      },
    ],
    keyTakeaways: [
      'Always compute the midpoint as `left + (right - left) / 2` to prevent 32-bit signed integer overflow.',
      'Ensure the search space shrinks on every branch; setting `left = mid` with floor division causes an infinite loop.',
      'Pair inclusive boundaries `[0, n - 1]` with `while (left <= right)` and `mid ± 1` adjustments.',
    ],
    practice: {
      prompt: 'Suppose you have an API isBadVersion(version). Implement a function to locate the earliest bad version using binary search, ensuring your midpoint calculation never overflows even when the version count approaches 2^31 - 1.',
      leetcode: { title: 'First Bad Version', slug: 'first-bad-version' },
    },
  },

  // =========================================================================
  // Lesson 4: First and last occurrence
  // =========================================================================
  {
    sub: 4,
    summary: 'Locate the boundary positions of duplicate elements in a sorted array by persisting the binary search after finding matches.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'When a sorted array contains duplicate values, standard binary search stops at whichever instance it discovers first. That discovered element could be the earliest, the latest, or somewhere in the middle of the group. Finding the **first occurrence** (leftmost boundary) or **last occurrence** (rightmost boundary) requires continuing the search after discovering a match rather than halting immediately.',
      },
      { kind: 'heading', text: 'Recording candidate matches and shrinking toward boundaries' },
      {
        kind: 'text',
        body: 'To find the first occurrence, when `nums[mid] == target`, record `ans = mid` as a candidate, but continue searching to the left by setting `right = mid - 1`. If an earlier instance exists, it must lie at a smaller index. Conversely, to find the last occurrence, when `nums[mid] == target`, record `ans = mid` and continue searching to the right by setting `left = mid + 1`.',
      },
      {
        kind: 'code',
        caption: 'First and last occurrence boundary searches',
        code: {
          cpp: `#include <vector>
using namespace std;

int findFirst(const vector<int>& nums, int target) {
    int left = 0, right = (int)nums.size() - 1, ans = -1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) {
            ans = mid;
            right = mid - 1; // Keep searching toward the left boundary
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return ans;
}

int findLast(const vector<int>& nums, int target) {
    int left = 0, right = (int)nums.size() - 1, ans = -1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) {
            ans = mid;
            left = mid + 1; // Keep searching toward the right boundary
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return ans;
}`,
          java: `public class OccurrenceSearch {
    public static int findFirst(int[] nums, int target) {
        int left = 0, right = nums.length - 1, ans = -1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) {
                ans = mid;
                right = mid - 1; // Keep searching toward the left boundary
            } else if (nums[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        return ans;
    }

    public static int findLast(int[] nums, int target) {
        int left = 0, right = nums.length - 1, ans = -1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) {
                ans = mid;
                left = mid + 1; // Keep searching toward the right boundary
            } else if (nums[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        return ans;
    }
}`,
          python: `def find_first(nums: list[int], target: int) -> int:
    left, right, ans = 0, len(nums) - 1, -1
    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] == target:
            ans = mid
            right = mid - 1  # Keep searching toward the left boundary
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return ans


def find_last(nums: list[int], target: int) -> int:
    left, right, ans = 0, len(nums) - 1, -1
    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] == target:
            ans = mid
            left = mid + 1  # Keep searching toward the right boundary
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return ans`,
        },
      },
      { kind: 'heading', text: 'Deriving frequency from boundary indices' },
      {
        kind: 'table',
        headers: ['Metric', 'Expression', 'Example: [1, 3, 3, 3, 5] with target = 3'],
        rows: [
          ['First Position', 'findFirst(nums, target)', 'first = 1'],
          ['Last Position', 'findLast(nums, target)', 'last = 3'],
          ['Total Frequency', 'last - first + 1 (if found)', '3 - 1 + 1 = 3'],
          ['Total Time Complexity', '2 * O(log n) = O(log n)', 'Two independent logarithmic binary searches'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Linear expansion after a match destroys logarithmic time',
        body: 'A tempting shortcut is finding any match with standard binary search and expanding outward linearly using two while loops to locate the boundaries. In an array where all elements are identical, such as an array of one million fives, that linear expansion inspects every element, degrading performance to O(n). Always perform two binary searches to preserve strict O(log n) complexity.',
      },
    ],
    keyTakeaways: [
      'Do not halt on a match: store the candidate index and continue searching toward the target boundary.',
      'To find the first occurrence, move `right = mid - 1`; to find the last occurrence, move `left = mid + 1`.',
      'The frequency of a target equals `last - first + 1`, computable in O(log n) total time.',
    ],
    practice: {
      prompt: 'Given a sorted array of integers in non-decreasing order, find the starting and ending position of a given target value. If target is not found, return [-1, -1] in O(log n) time.',
      leetcode: { title: 'Find First and Last Position of Element in Sorted Array', slug: 'find-first-and-last-position-of-element-in-sorted-array' },
    },
  },

  // =========================================================================
  // Lesson 5: Lower bound and upper bound by hand
  // =========================================================================
  {
    sub: 5,
    summary: 'Implement lower bound and upper bound from scratch to locate insertion points and range boundaries without relying on library built-ins.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Many search problems do not require finding an exact value. Instead, they ask for the first element that meets or exceeds a given threshold, or the correct insertion slot to maintain sorted order. In algorithmic programming, these operations are known as **lower bound** and **upper bound**. Writing them by hand is a fundamental skill because custom comparison conditions and interview settings frequently demand custom variations.',
      },
      { kind: 'heading', text: 'Definitions and condition thresholds' },
      {
        kind: 'text',
        body: 'The **lower bound** of `target` is the smallest index `i` such that `nums[i] >= target`. If every element in the array is strictly smaller than `target`, lower bound returns `n`. The **upper bound** of `target` is the smallest index `i` such that `nums[i] > target`. If no element is strictly greater than `target`, upper bound returns `n`. In both cases, the answer represents a valid insertion index in the range `[0, n]`.',
      },
      {
        kind: 'code',
        caption: 'Handwritten lower_bound and upper_bound implementations',
        code: {
          cpp: `#include <vector>
using namespace std;

// First index i where nums[i] >= target
int lowerBound(const vector<int>& nums, int target) {
    int left = 0, right = (int)nums.size() - 1;
    int ans = (int)nums.size(); // Default to n if all elements are smaller
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] >= target) {
            ans = mid;        // Valid candidate
            right = mid - 1;  // Try to find a smaller index on the left
        } else {
            left = mid + 1;
        }
    }
    return ans;
}

// First index i where nums[i] > target
int upperBound(const vector<int>& nums, int target) {
    int left = 0, right = (int)nums.size() - 1;
    int ans = (int)nums.size(); // Default to n if no element is greater
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] > target) {
            ans = mid;        // Valid candidate
            right = mid - 1;  // Try to find a smaller index on the left
        } else {
            left = mid + 1;
        }
    }
    return ans;
}`,
          java: `public class BoundsSearch {
    // First index i where nums[i] >= target
    public static int lowerBound(int[] nums, int target) {
        int left = 0, right = nums.length - 1;
        int ans = nums.length;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] >= target) {
                ans = mid;
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }
        return ans;
    }

    // First index i where nums[i] > target
    public static int upperBound(int[] nums, int target) {
        int left = 0, right = nums.length - 1;
        int ans = nums.length;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] > target) {
                ans = mid;
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }
        return ans;
    }
}`,
          python: `def lower_bound(nums: list[int], target: int) -> int:
    left, right = 0, len(nums) - 1
    ans = len(nums)
    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] >= target:
            ans = mid
            right = mid - 1
        else:
            left = mid + 1
    return ans


def upper_bound(nums: list[int], target: int) -> int:
    left, right = 0, len(nums) - 1
    ans = len(nums)
    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] > target:
            ans = mid
            right = mid - 1
        else:
            left = mid + 1
    return ans`,
        },
      },
      { kind: 'heading', text: 'Output indices on array nums = [1, 3, 3, 5, 8]' },
      {
        kind: 'table',
        headers: ['Target', 'Lower Bound Condition (>= target)', 'Result Index', 'Upper Bound Condition (> target)', 'Result Index'],
        rows: [
          ['3', 'nums[1] = 3 >= 3', '1', 'nums[3] = 5 > 3', '3'],
          ['4', 'nums[3] = 5 >= 4', '3', 'nums[3] = 5 > 4', '3'],
          ['0', 'nums[0] = 1 >= 0', '0', 'nums[0] = 1 > 0', '0'],
          ['9', 'No element satisfies condition', '5 (= n)', 'No element satisfies condition', '5 (= n)'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Index n is a valid return value, not an out-of-bounds bug',
        body: 'When every element in the array is smaller than the target, both functions return `n` (the length of the array). This value indicates that the target belongs at the end of the array to preserve order. However, attempting to read `nums[ans]` when `ans == n` will cause an index out of bounds exception. Always verify `ans < nums.size()` before accessing elements.',
      },
    ],
    keyTakeaways: [
      'Lower bound finds the first index where `nums[i] >= target`; upper bound finds the first index where `nums[i] > target`.',
      'Initialise the answer to `n`, representing the valid insertion slot when all elements are smaller than the target.',
      'Duplicate occurrences of a target span the half-open range `[lower_bound, upper_bound)`.',
    ],
    practice: {
      prompt: 'Given a sorted array of distinct integers and a target value, return the index if target is found. If not, return the index where it would be if it were inserted in order, using lower bound logic in O(log n) time.',
      leetcode: { title: 'Search Insert Position', slug: 'search-insert-position' },
    },
  },

  // =========================================================================
  // Lesson 6: Binary search on the answer
  // =========================================================================
  {
    sub: 6,
    summary: 'Solve optimisation problems over discrete value ranges by transforming search spaces using monotonic feasibility predicates.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Binary search is not limited to indexing pre-existing arrays. It applies to any problem where the search space is a range of numerical values and a decision function exhibits **monotonicity**. If a condition transitions predictably from false to true (or true to false) as a candidate value increases, binary search can find the exact boundary value in logarithmic iterations. This algorithmic technique is called **binary search on the answer**.',
      },
      { kind: 'heading', text: 'The monotonicity property and feasibility predicates' },
      {
        kind: 'text',
        body: 'Consider determining the minimum eating speed `k` required to finish several piles of bananas within `h` hours. If speed `k = 5` allows finishing on time, any higher speed `k > 5` will also finish on time. Conversely, if `k = 3` fails to finish on time, any slower speed `k < 3` will definitely fail. The feasibility function `canFinish(speed)` produces a monotonic boolean sequence: `[False, False, False, True, True, True, ...]`. The objective is locating the first speed that produces `True`.',
      },
      {
        kind: 'code',
        caption: 'Binary search on the answer: Koko eating bananas',
        code: {
          cpp: `#include <vector>
#include <algorithm>
using namespace std;

bool canFinish(const vector<int>& piles, int speed, int h) {
    long long totalHours = 0;
    for (int p : piles) {
        totalHours += (p + speed - 1) / speed; // Ceiling division: ceil(p / speed)
    }
    return totalHours <= h;
}

int minEatingSpeed(vector<int>& piles, int h) {
    int left = 1;
    int right = *max_element(piles.begin(), piles.end());
    int ans = right;

    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (canFinish(piles, mid, h)) {
            ans = mid;       // Feasible: record candidate and try a smaller speed
            right = mid - 1;
        } else {
            left = mid + 1;  // Infeasible: speed must be increased
        }
    }
    return ans;
}`,
          java: `public class KokoEating {
    private static boolean canFinish(int[] piles, int speed, int h) {
        long totalHours = 0;
        for (int p : piles) {
            totalHours += (p + speed - 1) / speed; // Ceiling division
        }
        return totalHours <= h;
    }

    public static int minEatingSpeed(int[] piles, int h) {
        int left = 1;
        int right = 0;
        for (int p : piles) {
            if (p > right) right = p;
        }
        int ans = right;

        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (canFinish(piles, mid, h)) {
                ans = mid;
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }
        return ans;
    }
}`,
          python: `def can_finish(piles: list[int], speed: int, h: int) -> bool:
    total_hours = 0
    for p in piles:
        total_hours += (p + speed - 1) // speed  # Ceiling division
    return total_hours <= h


def min_eating_speed(piles: list[int], h: int) -> int:
    left = 1
    right = max(piles)
    ans = right

    while left <= right:
        mid = left + (right - left) // 2
        if can_finish(piles, mid, h):
            ans = mid
            right = mid - 1
        else:
            left = mid + 1
    return ans`,
        },
      },
      { kind: 'heading', text: 'Steps to structure binary search on the answer' },
      {
        kind: 'table',
        headers: ['Step', 'Task', 'Design Consideration'],
        rows: [
          ['1. Monotonicity Test', 'Check that feasibility is monotonic', 'Verify that if value x works, every x + 1 works (or vice versa)'],
          ['2. Define Range', 'Establish bounds [low, high]', 'Choose low as the minimum possible answer and high as a safe maximum bound'],
          ['3. Feasibility Check', 'Write check(mid) helper', 'A greedy or linear evaluation returning boolean in O(n) time'],
          ['4. Convergence', 'Binary search over range', 'Runs in O(n * log(range)) time, halving candidate answers at each step'],
        ],
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Accumulator overflow inside validation functions',
        body: 'When summing durations, weights, or capacities inside validation functions, values can easily exceed the capacity of signed 32-bit integers (`2^31 - 1`). In C++ and Java, declare accumulators as 64-bit integers (`long long` or `long`) to prevent silent negative overflow from invalidating your feasibility checks.',
      },
    ],
    keyTakeaways: [
      'Binary search on the answer applies whenever candidate solutions produce a monotonic boolean output.',
      'The overall time complexity is O(V * log(range)), where V is the runtime of the feasibility validator.',
      'Always set search bounds [low, high] based on theoretical limits of the problem rather than array values alone.',
    ],
    practice: {
      prompt: 'Given piles of bananas and an integer h representing available hours, return the minimum integer speed k such that all bananas can be eaten within h hours.',
      leetcode: { title: 'Koko Eating Bananas', slug: 'koko-eating-bananas' },
    },
  },

  // =========================================================================
  // Lesson 7: Search in a sorted 2D matrix
  // =========================================================================
  {
    sub: 7,
    summary: 'Search sorted 2D grids in logarithmic time by virtualising coordinates into a flat 1D sequence.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Matrices frequently appear in interview search problems in two formats. In the first format, each row is sorted and the first element of each row is strictly greater than the last element of the preceding row. This structure forms a single continuous sorted sequence wrapped across rows. In the second format, rows and columns are independently sorted. Recognising continuous ordering allows searching the grid in sub-linear time.',
      },
      { kind: 'heading', text: 'Virtual 1D coordinate mapping' },
      {
        kind: 'text',
        body: 'An `m x n` matrix with continuous sorted order behaves identically to a flat 1D sorted array of length `m * n`. Copying matrix cells into an auxiliary 1D array is unnecessary and wastes `O(m * n)` extra space. Instead, treat indices `0` through `m * n - 1` as a virtual 1D array. Translate any virtual index `mid` back into 2D grid coordinates using integer arithmetic: `row = mid / n` and `col = mid % n`, where `n` is the number of columns.',
      },
      {
        kind: 'code',
        caption: 'Virtual 1D binary search on a sorted matrix',
        code: {
          cpp: `#include <vector>
using namespace std;

bool searchMatrix(const vector<vector<int>>& matrix, int target) {
    if (matrix.empty() || matrix[0].empty()) return false;
    int m = (int)matrix.size();
    int n = (int)matrix[0].size();
    int left = 0, right = m * n - 1;

    while (left <= right) {
        int mid = left + (right - left) / 2;
        int val = matrix[mid / n][mid % n]; // Map 1D mid to 2D coordinates
        if (val == target) {
            return true;
        } else if (val < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return false;
}`,
          java: `public class MatrixSearch {
    public static boolean searchMatrix(int[][] matrix, int target) {
        if (matrix.length == 0 || matrix[0].length == 0) return false;
        int m = matrix.length;
        int n = matrix[0].length;
        int left = 0, right = m * n - 1;

        while (left <= right) {
            int mid = left + (right - left) / 2;
            int val = matrix[mid / n][mid % n]; // Map 1D mid to 2D coordinates
            if (val == target) {
                return true;
            } else if (val < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        return false;
    }
}`,
          python: `def search_matrix(matrix: list[list[int]], target: int) -> bool:
    if not matrix or not matrix[0]:
        return False
    m = len(matrix)
    n = len(matrix[0])
    left, right = 0, m * n - 1

    while left <= right:
        mid = left + (right - left) // 2
        val = matrix[mid // n][mid % n]  # Map 1D mid to 2D coordinates
        if val == target:
            return True
        elif val < target:
            left = mid + 1
        else:
            right = mid - 1
    return False`,
        },
      },
      { kind: 'heading', text: 'Comparison of matrix search techniques' },
      {
        kind: 'table',
        headers: ['Grid Organisation', 'Algorithm', 'Time Complexity', 'Auxiliary Space'],
        rows: [
          ['Continuous wrapped rows', 'Virtual 1D binary search via mid/n and mid%n', 'O(log(m * n))', 'O(1)'],
          ['Independently sorted rows and cols', 'Staircase search from top-right corner', 'O(m + n)', 'O(1)'],
          ['Unsorted grid', 'Exhaustive nested traversal', 'O(m * n)', 'O(1)'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Dividing by row count instead of column count',
        body: 'Coordinate translation requires dividing by the number of columns `n`, not rows `m`. In row-major flattening, each row contains `n` elements. Writing `row = mid / m` is an instant bug that causes index out of bounds exceptions whenever `m != n`.',
      },
    ],
    keyTakeaways: [
      'A continuously sorted m x n matrix maps to a virtual 1D array spanning 0 to m * n - 1.',
      'Translate index mid to 2D using `row = mid / n` and `col = mid % n`, where n is column count.',
      'Virtual coordinate translation preserves O(log(m * n)) time without allocating auxiliary memory.',
    ],
    practice: {
      prompt: 'Given an m x n integer matrix where each row is sorted and the first integer of each row is greater than the last integer of the previous row, return true if target is present in O(log(m * n)) time.',
      leetcode: { title: 'Search a 2D Matrix', slug: 'search-a-2d-matrix' },
    },
  },

  // =========================================================================
  // Lesson 8: Ternary search and unimodal functions
  // =========================================================================
  {
    sub: 8,
    summary: 'Locate extrema of unimodal functions and mountain arrays by trisecting the search space and discarding one third per step.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Standard binary search requires monotonicity: elements must be sorted ascending or descending throughout the entire range. When a sequence or function strictly increases to a single maximum peak and then strictly decreases, it is termed **unimodal**. Because the slope changes direction, ordinary two-way comparison cannot determine which half contains the peak. **Ternary search** resolves this by evaluating two internal probe points and discarding one third of the search space at each iteration.',
      },
      { kind: 'heading', text: 'Trisecting the search window with two interior probes' },
      {
        kind: 'text',
        body: 'Given an active interval `[left, right]`, divide the range into three equal segments using two probes: `m1 = left + (right - left) / 3` and `m2 = right - (right - left) / 3`. If `arr[m1] < arr[m2]`, the global maximum cannot reside in the leftmost third `[left, m1]`, so we advance `left = m1 + 1`. If `arr[m1] > arr[m2]`, the maximum cannot reside in the rightmost third `[m2, right]`, so we retreat `right = m2 - 1`. Once the window shrinks to a small span, inspect the remaining values directly.',
      },
      {
        kind: 'code',
        caption: 'Ternary search for the peak index of a mountain array',
        code: {
          cpp: `#include <vector>
using namespace std;

int peakIndexInMountainArray(const vector<int>& arr) {
    int left = 0, right = (int)arr.size() - 1;

    // Shrink window until three or fewer candidates remain
    while (right - left > 2) {
        int m1 = left + (right - left) / 3;
        int m2 = right - (right - left) / 3;

        if (arr[m1] < arr[m2]) {
            left = m1 + 1;  // Peak cannot be in [left, m1]
        } else {
            right = m2 - 1; // Peak cannot be in [m2, right]
        }
    }

    // Linearly examine the small remaining window [left, right]
    int peak = left;
    for (int i = left + 1; i <= right; i++) {
        if (arr[i] > arr[peak]) {
            peak = i;
        }
    }
    return peak;
}`,
          java: `public class TernarySearch {
    public static int peakIndexInMountainArray(int[] arr) {
        int left = 0, right = arr.length - 1;

        // Shrink window until three or fewer candidates remain
        while (right - left > 2) {
            int m1 = left + (right - left) / 3;
            int m2 = right - (right - left) / 3;

            if (arr[m1] < arr[m2]) {
                left = m1 + 1;
            } else {
                right = m2 - 1;
            }
        }

        // Linearly examine the small remaining window [left, right]
        int peak = left;
        for (int i = left + 1; i <= right; i++) {
            if (arr[i] > arr[peak]) {
                peak = i;
            }
        }
        return peak;
    }
}`,
          python: `def peak_index_in_mountain_array(arr: list[int]) -> int:
    left = 0
    right = len(arr) - 1

    # Shrink window until three or fewer candidates remain
    while right - left > 2:
        m1 = left + (right - left) // 3
        m2 = right - (right - left) // 3

        if arr[m1] < arr[m2]:
            left = m1 + 1
        else:
            right = m2 - 1

    # Linearly examine the small remaining window [left, right]
    peak = left
    for i in range(left + 1, right + 1):
        if arr[i] > arr[peak]:
            peak = i
    return peak`,
        },
      },
      { kind: 'heading', text: 'Binary search versus ternary search' },
      {
        kind: 'table',
        headers: ['Property', 'Binary Search', 'Ternary Search'],
        rows: [
          ['Input Requirement', 'Monotonic (sorted non-decreasing or non-increasing)', 'Unimodal (strictly single peak or trough)'],
          ['Interior Probes per Step', '1 midpoint (`mid`)', '2 probe points (`m1` and `m2`)'],
          ['Space Discarded per Step', '1/2 (50%)', '1/3 (~33.3%)'],
          ['Function Evaluations', '1 per iteration', '2 per iteration'],
          ['Primary Domain', 'Sorted arrays and monotonic decision boundaries', 'Continuous mathematical function optimisation'],
        ],
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Flat plateaus invalidate ternary search',
        body: 'Ternary search strictly requires unimodality without duplicate flat plateaus. If multiple adjacent elements share the maximum value (`arr[m1] == arr[m2]`), it is impossible to know whether the true peak lies to the left, right, or between them without inspecting elements linearly. Ternary search is valid only when slopes are strictly non-zero away from the peak.',
      },
    ],
    keyTakeaways: [
      'Ternary search finds the extremum of a unimodal function by discarding one third of the search space per iteration.',
      'Each iteration evaluates two probe points m1 and m2, shrinking the interval by a factor of 2/3.',
      'Flat plateaus break the unimodality contract, making ternary search unreliable when duplicates occur.',
    ],
    practice: {
      prompt: 'An array is a mountain array if it strictly increases to a peak element and then strictly decreases. Given a mountain array arr, return the index of the peak element in O(log n) time.',
      leetcode: { title: 'Peak Index in a Mountain Array', slug: 'peak-index-in-a-mountain-array' },
    },
  },
];
