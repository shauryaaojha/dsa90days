import type { SharedLesson } from './types';

/**
 * Backtracking in Depth — Master state-space tree traversal with the choose,
 * explore, un-choose invariant, subset generation, permutation enumeration,
 * duplicate handling with sibling pruning, geometric constraints in N-Queens,
 * and search tree bounding with pruning techniques.
 */
export const lessons: SharedLesson[] = [
  // =========================================================================
  // Lesson 1: The choose, explore, un-choose template
  // =========================================================================
  {
    sub: 1,
    summary: 'Traverse exhaustive decision trees using the choose, explore, and un-choose backtracking template.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: '**Backtracking** is a systematic algorithmic technique for solving problems by constructing candidate solutions incrementally and abandoning a candidate as soon as it cannot lead to a valid outcome. The collection of states explored during this search forms a **state-space tree**, where the root represents an empty initial state, edges represent decisions, and nodes represent partial solutions. When a branch terminates, execution retreats to the nearest ancestor node with untried options.',
      },
      { kind: 'heading', text: 'The choose, explore, un-choose invariant' },
      {
        kind: 'text',
        body: 'At each decision point in the tree, the algorithm executes three steps. In the **choose** phase, it picks an available candidate and updates a shared state buffer. In the **explore** phase, it calls itself recursively to solve subsequent decisions at the next depth level. In the **un-choose** phase, it reverts the state mutation so the container returns to its prior condition before trying the next sibling option.',
      },
      {
        kind: 'code',
        caption: 'Generating all binary strings of length n using choose, explore, and un-choose',
        code: {
          cpp: `#include <vector>
#include <string>
using namespace std;

class Solution {
    void backtrack(int n, string& path, vector<string>& result) {
        if ((int)path.size() == n) {
            result.push_back(path);
            return;
        }
        for (char c : {'0', '1'}) {
            path.push_back(c);          // Choose
            backtrack(n, path, result); // Explore
            path.pop_back();            // Un-choose
        }
    }
public:
    vector<string> generateBinary(int n) {
        vector<string> result;
        string path = "";
        backtrack(n, path, result);
        return result;
    }
};`,
          java: `import java.util.ArrayList;
import java.util.List;

public class Solution {
    private void backtrack(int n, StringBuilder path, List<String> result) {
        if (path.length() == n) {
            result.add(path.toString());
            return;
        }
        for (char c : new char[]{'0', '1'}) {
            path.append(c);                  // Choose
            backtrack(n, path, result);      // Explore
            path.deleteCharAt(path.length() - 1); // Un-choose
        }
    }

    public List<String> generateBinary(int n) {
        List<String> result = new ArrayList<>();
        backtrack(n, new StringBuilder(), result);
        return result;
    }
}`,
          python: `class Solution:
    def generate_binary(self, n: int) -> list[str]:
        result: list[str] = []
        path: list[str] = []

        def backtrack() -> None:
            if len(path) == n:
                result.append("".join(path))
                return
            for c in ("0", "1"):
                path.append(c)   # Choose
                backtrack()      # Explore
                path.pop()       # Un-choose

        backtrack()
        return result`,
        },
      },
      { kind: 'heading', text: 'State cycle mechanics' },
      {
        kind: 'table',
        headers: ['Phase', 'Action', 'State Impact', 'Stack Effect'],
        rows: [
          ['Base Check', 'Verify if candidate is complete', 'Read-only inspection', 'Returns to caller'],
          ['Choose', 'Select candidate option', 'Appends to mutable path', 'Prepares frame argument'],
          ['Explore', 'Recurse on remaining choices', 'Passes state forward', 'Pushes child frame'],
          ['Un-choose', 'Undo state modification', 'Pops from mutable path', 'Restores parent state'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Forgetting to un-choose with shared mutable buffers',
        body: 'When passing a mutable collection into recursive calls, failing to revert modifications leaves leftover elements in the buffer. When execution returns to an ancestor and tests the next candidate, that candidate is appended to a corrupted path. Every state modification before recursion must be undone immediately after the recursive call returns.',
      },
    ],
    keyTakeaways: [
      'Backtracking traverses a state-space tree depth-first, building candidates incrementally.',
      'The choose, explore, un-choose invariant ensures parent states remain clean across sibling branches.',
      'Un-choosing undoes mutations on shared containers before evaluating the next alternative.',
      'Base cases identify complete candidates and store detached copies into the result list.',
    ],
    practice: {
      prompt: 'Implement a backtracking function that generates all strings of length n composed of characters "A" and "B". Confirm that exactly 2^n strings are produced and that each string has length n.',
      leetcode: { title: 'Letter Combinations of a Phone Number', slug: 'letter-combinations-of-a-phone-number' },
    },
  },

  // =========================================================================
  // Lesson 2: Subsets
  // =========================================================================
  {
    sub: 2,
    summary: 'Generate all 2^n subsets of a collection using the start-index backtracking pattern.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A **subset** of a collection is a selection of zero or more elements where order does not matter. For a collection of `n` distinct items, there are 2^n total subsets, ranging from the empty set to the full collection itself. The set of all 2^n subsets is termed the **power set**. In a subset search, every intermediate node in the recursion tree represents a valid answer.',
      },
      { kind: 'heading', text: 'The start-index pattern' },
      {
        kind: 'text',
        body: 'To avoid duplicate combinations with differing orderings—such as producing both `[1, 2]` and `[2, 1]`—we pass a `start` index into each recursive call. At any recursion depth, the loop iterates from `start` to `n - 1`. Once element `nums[i]` is chosen, exploration recurses with `i + 1`. Restricting future choices to indices strictly greater than `i` guarantees that each element appears in increasing index order.',
      },
      {
        kind: 'code',
        caption: 'Subsets generation using the start-index pattern',
        code: {
          cpp: `#include <vector>
using namespace std;

class Solution {
    void backtrack(int start, const vector<int>& nums, vector<int>& path, vector<vector<int>>& result) {
        result.push_back(path); // Record every state
        for (int i = start; i < (int)nums.size(); i++) {
            path.push_back(nums[i]);              // Choose
            backtrack(i + 1, nums, path, result); // Explore
            path.pop_back();                      // Un-choose
        }
    }
public:
    vector<vector<int>> subsets(vector<int>& nums) {
        vector<vector<int>> result;
        vector<int> path;
        backtrack(0, nums, path, result);
        return result;
    }
};`,
          java: `import java.util.ArrayList;
import java.util.List;

public class Solution {
    private void backtrack(int start, int[] nums, List<Integer> path, List<List<Integer>> result) {
        result.add(new ArrayList<>(path)); // Snapshot copy
        for (int i = start; i < nums.length; i++) {
            path.add(nums[i]);                    // Choose
            backtrack(i + 1, nums, path, result); // Explore
            path.remove(path.size() - 1);         // Un-choose
        }
    }

    public List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        backtrack(0, nums, new ArrayList<>(), result);
        return result;
    }
}`,
          python: `class Solution:
    def subsets(self, nums: list[int]) -> list[list[int]]:
        result: list[list[int]] = []
        path: list[int] = []

        def backtrack(start: int) -> None:
            result.append(list(path)) # Snapshot copy
            for i in range(start, len(nums)):
                path.append(nums[i])  # Choose
                backtrack(i + 1)      # Explore
                path.pop()            # Un-choose

        backtrack(0)
        return result`,
        },
      },
      { kind: 'heading', text: 'Subset complexity' },
      {
        kind: 'table',
        headers: ['Metric', 'Complexity', 'Explanation'],
        rows: [
          ['Total Subsets', 'O(2^n)', 'Each element is independently included or excluded'],
          ['Time Complexity', 'O(n * 2^n)', '2^n subsets copied at average length n / 2'],
          ['Recursion Depth', 'O(n)', 'Maximum stack depth when selecting all n elements'],
          ['Auxiliary Space', 'O(n)', 'Path buffer and stack frames, excluding output list'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Appending mutable references instead of snapshot copies',
        body: { cpp: '`result.push_back(path)` copies the vector, so each stored answer is independent; the O(k) copy is unavoidable and fine. If you ever store pointers or references to `path` instead, they all alias one object and end up empty.', java: 'Appending `path` directly to `result` stores a reference to a single mutable list. As backtracking continues and eventually pops all elements, every entry in `result` will point to that same empty list. Always store a detached snapshot: `new ArrayList<>(path)`.', python: 'Appending `path` directly to `result` stores a reference to a single mutable list. As backtracking continues and eventually pops all elements, every entry in `result` will point to that same empty list. Always store a detached snapshot: `path[:]` or `list(path)`.' },
      },
    ],
    keyTakeaways: [
      'A collection of n distinct items yields 2^n total subsets in its power set.',
      'Every node in the recursion tree is a valid subset, so the path is saved on each call.',
      'The start index parameter prevents duplicate orderings by enforcing increasing index choices.',
      'Always append snapshot copies of mutable path buffers into the result container.',
    ],
    practice: {
      prompt: 'Write a subset generator that takes an array of distinct integers and returns all subsets. Trace the recursion tree for [1, 2, 3] and record the order in which subsets are saved.',
      leetcode: { title: 'Subsets', slug: 'subsets' },
    },
  },

  // =========================================================================
  // Lesson 3: Permutations
  // =========================================================================
  {
    sub: 3,
    summary: 'Construct all n! orderings of a collection using visited tracking arrays in a backtracking search.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A **permutation** is an ordered arrangement containing every element of a collection exactly once. For a collection of `n` distinct items, there are `n!` (n factorial) possible permutations. Permutations differ from subsets: every permutation contains all `n` elements, and distinct orderings such as `[1, 2, 3]` and `[3, 2, 1]` represent separate, valid answers.',
      },
      { kind: 'heading', text: 'Tracking used candidates' },
      {
        kind: 'text',
        body: 'Because order matters, a permutation search cannot use the `start` index pattern. Any unselected element can be placed at any position, including items that appeared earlier in the input array. To track which elements are already placed in the current path, we maintain a boolean array `used` of length `n`. An element at index `i` is an eligible choice if and only if `used[i]` is `false`.',
      },
      {
        kind: 'code',
        caption: 'Permutations generation using a boolean visited tracker',
        code: {
          cpp: `#include <vector>
using namespace std;

class Solution {
    void backtrack(const vector<int>& nums, vector<bool>& used, vector<int>& path, vector<vector<int>>& result) {
        if (path.size() == nums.size()) {
            result.push_back(path);
            return;
        }
        for (int i = 0; i < (int)nums.size(); i++) {
            if (used[i]) continue;
            used[i] = true;                      // Choose
            path.push_back(nums[i]);
            backtrack(nums, used, path, result); // Explore
            path.pop_back();                     // Un-choose
            used[i] = false;
        }
    }
public:
    vector<vector<int>> permute(vector<int>& nums) {
        vector<vector<int>> result;
        vector<int> path;
        vector<bool> used(nums.size(), false);
        backtrack(nums, used, path, result);
        return result;
    }
};`,
          java: `import java.util.ArrayList;
import java.util.List;

public class Solution {
    private void backtrack(int[] nums, boolean[] used, List<Integer> path, List<List<Integer>> result) {
        if (path.size() == nums.length) {
            result.add(new ArrayList<>(path));
            return;
        }
        for (int i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            used[i] = true;                      // Choose
            path.add(nums[i]);
            backtrack(nums, used, path, result); // Explore
            path.remove(path.size() - 1);        // Un-choose
            used[i] = false;
        }
    }

    public List<List<Integer>> permute(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        backtrack(nums, new boolean[nums.length], new ArrayList<>(), result);
        return result;
    }
}`,
          python: `class Solution:
    def permute(self, nums: list[int]) -> list[list[int]]:
        result: list[list[int]] = []
        path: list[int] = []
        used = [False] * len(nums)

        def backtrack() -> None:
            if len(path) == len(nums):
                result.append(list(path))
                return
            for i in range(len(nums)):
                if used[i]:
                    continue
                used[i] = True       # Choose
                path.append(nums[i])
                backtrack()          # Explore
                path.pop()           # Un-choose
                used[i] = False

        backtrack()
        return result`,
        },
      },
      { kind: 'heading', text: 'Permutation complexity' },
      {
        kind: 'table',
        headers: ['Aspect', 'Complexity', 'Explanation'],
        rows: [
          ['Total Leaves', 'O(n!)', 'n choices at depth 0, down to 1 at depth n - 1'],
          ['Time Complexity', 'O(n * n!)', 'n! permutations generated, each copied in O(n) time'],
          ['Recursion Depth', 'O(n)', 'Descends through n stack frames before base case'],
          ['Auxiliary Space', 'O(n)', 'Path buffer, used array, and call stack storage'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Forgetting to reset the visited flag on un-choose',
        body: 'Popping from `path` while forgetting to set `used[i] = false` leaves element `i` locked as consumed. All sibling branches and ancestor returns will find `used[i] == true` and skip that number, causing the algorithm to terminate with missing permutations. Both the path buffer and the visited flag must be reverted during un-choose.',
      },
    ],
    keyTakeaways: [
      'A collection of n distinct elements produces n! distinct permutations of length n.',
      'Permutations inspect all unused elements at each step rather than enforcing a start index.',
      'A boolean used array tracks which elements are committed to the current path buffer.',
      'Reverting both the path and the used flag during un-choose maintains state integrity.',
    ],
    practice: {
      prompt: 'Implement a permutation generator for an array of distinct integers. Verify that for an input of size 3, exactly 6 unique permutations of length 3 are generated.',
      leetcode: { title: 'Permutations', slug: 'permutations' },
    },
  },

  // =========================================================================
  // Lesson 4: Combination sum with de-duplication
  // =========================================================================
  {
    sub: 4,
    summary: 'Eliminate duplicate combinations in combinatorial searches with duplicate inputs using sorting and sibling pruning.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'When searching for combinations summing to a target from an array containing duplicate values—such as `[1, 1, 2, 5, 6, 7, 10]` with target 8—standard backtracking generates identical combinations multiple times. For example, picking the first `1` with `7` yields `[1, 7]`, and picking the second `1` with `7` yields `[1, 7]` again. Eliminating these redundant combinations at generation time is called **de-duplication**.',
      },
      { kind: 'heading', text: 'Vertical depth versus horizontal breadth' },
      {
        kind: 'text',
        body: 'To eliminate duplicates efficiently, sort the input array first so identical values sit in adjacent indices. Next, distinguish between tree depth and tree breadth. When descending deeper from parent to child (vertical depth), using multiple identical numbers is valid (such as `[1, 1, 6]`). When iterating across sibling choices at the same recursion level (horizontal breadth), picking a number identical to its predecessor explores a subtree identical to the one already visited. We skip it with `if (i > start && nums[i] == nums[i - 1]) continue`.',
      },
      {
        kind: 'code',
        caption: 'Combination sum with sorting and sibling de-duplication',
        code: {
          cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
    void backtrack(int start, int remain, const vector<int>& nums, vector<int>& path, vector<vector<int>>& result) {
        if (remain == 0) {
            result.push_back(path);
            return;
        }
        for (int i = start; i < (int)nums.size(); i++) {
            if (nums[i] > remain) break;                       // Early stop on sorted array
            if (i > start && nums[i] == nums[i - 1]) continue; // Sibling de-duplication

            path.push_back(nums[i]);                               // Choose
            backtrack(i + 1, remain - nums[i], nums, path, result); // Explore
            path.pop_back();                                       // Un-choose
        }
    }
public:
    vector<vector<int>> combinationSum2(vector<int>& nums, int target) {
        vector<vector<int>> result;
        vector<int> path;
        sort(nums.begin(), nums.end());
        backtrack(0, target, nums, path, result);
        return result;
    }
};`,
          java: `import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class Solution {
    private void backtrack(int start, int remain, int[] nums, List<Integer> path, List<List<Integer>> result) {
        if (remain == 0) {
            result.add(new ArrayList<>(path));
            return;
        }
        for (int i = start; i < nums.length; i++) {
            if (nums[i] > remain) break;                       // Early stop on sorted array
            if (i > start && nums[i] == nums[i - 1]) continue; // Sibling de-duplication

            path.add(nums[i]);                                     // Choose
            backtrack(i + 1, remain - nums[i], nums, path, result); // Explore
            path.remove(path.size() - 1);                          // Un-choose
        }
    }

    public List<List<Integer>> combinationSum2(int[] nums, int target) {
        List<List<Integer>> result = new ArrayList<>();
        Arrays.sort(nums);
        backtrack(0, target, nums, new ArrayList<>(), result);
        return result;
    }
}`,
          python: `class Solution:
    def combinationSum2(self, nums: list[int], target: int) -> list[list[int]]:
        result: list[list[int]] = []
        path: list[int] = []
        nums.sort()

        def backtrack(start: int, remain: int) -> None:
            if remain == 0:
                result.append(list(path))
                return
            for i in range(start, len(nums)):
                if nums[i] > remain:
                    break
                if i > start and nums[i] == nums[i - 1]:
                    continue
                path.append(nums[i])               # Choose
                backtrack(i + 1, remain - nums[i]) # Explore
                path.pop()                         # Un-choose

        backtrack(0, target)
        return result`,
        },
      },
      { kind: 'heading', text: 'De-duplication strategies compared' },
      {
        kind: 'table',
        headers: ['Strategy', 'Time Complexity', 'Auxiliary Space', 'Mechanism'],
        rows: [
          ['Post-hoc Hash Set', 'O(2^n * n)', 'O(2^n * n)', 'Explores duplicate subtrees and filters combinations after traversal'],
          ['Sibling Pruning with Sort', 'O(2^n)', 'O(n)', 'Prunes duplicate sibling branches before recursive invocation'],
          ['Sorting Overhead', 'O(n log n)', 'O(1) to O(n)', 'Groups duplicates adjacently and enables early loop termination'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Checking i > 0 instead of i > start',
        body: 'Writing `if (i > 0 && nums[i] == nums[i - 1]) continue` checks for duplicates globally rather than locally across sibling choices. This mistakenly blocks selecting identical numbers when descending to deeper levels with the first instance already in `path`. For target 2 on `[1, 1]`, this error discards the valid answer `[1, 1]`. The check must use `i > start`.',
      },
    ],
    keyTakeaways: [
      'Duplicate input elements produce duplicate combinations unless sibling branches are pruned.',
      'Sorting groups duplicate values together so adjacent equality comparisons can detect them.',
      'Checking i > start allows identical numbers at different depths while pruning sibling duplicates.',
      'Sorting enables early stopping: when nums[i] exceeds the remainder, all subsequent items can be skipped.',
    ],
    practice: {
      prompt: 'Given an array of candidate numbers with duplicates and a target value, implement a backtracking function that finds all unique combinations summing to target where each number is used at most once.',
      leetcode: { title: 'Combination Sum II', slug: 'combination-sum-ii' },
    },
  },

  // =========================================================================
  // Lesson 5: N-Queens
  // =========================================================================
  {
    sub: 5,
    summary: 'Place non-attacking queens on an N by N board using row-by-row recursion and O(1) diagonal lookup arrays.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'The **N-Queens** problem asks how to place `N` chess queens on an `N x N` chessboard such that no two queens attack each other. In chess, a queen attacks any piece on the same row, column, or diagonal. Placing queens arbitrarily yields a search space of (N^2 choose N) combinations, exceeding 4.4 million possibilities even for N = 8. Formulating structural invariants reduces this state space dramatically.',
      },
      { kind: 'heading', text: 'Row-by-row placement and diagonal hashing' },
      {
        kind: 'text',
        body: 'Because each row must contain exactly one queen, we recurse row by row from `row = 0` to `row = N - 1`. At each row, the algorithm tests columns `0` through `N - 1`. To verify safety in O(1) time without scanning the board, we track three boolean arrays: columns (`cols`), main diagonals where `row - col` is constant (`diag1`), and anti-diagonals where `row + col` is constant (`diag2`). Adding an offset of `N - 1` maps `row - col` safely to non-negative indices `0` through `2N - 2`.',
      },
      {
        kind: 'code',
        caption: 'N-Queens solver using O(1) column and diagonal lookup arrays',
        code: {
          cpp: `#include <vector>
#include <string>
using namespace std;

class Solution {
    void backtrack(int r, int n, vector<bool>& c, vector<bool>& d1, vector<bool>& d2,
                   vector<string>& board, vector<vector<string>>& result) {
        if (r == n) {
            result.push_back(board);
            return;
        }
        for (int col = 0; col < n; col++) {
            int id1 = r - col + n - 1, id2 = r + col;
            if (c[col] || d1[id1] || d2[id2]) continue;

            board[r][col] = 'Q';
            c[col] = d1[id1] = d2[id2] = true;             // Choose

            backtrack(r + 1, n, c, d1, d2, board, result); // Explore

            board[r][col] = '.';
            c[col] = d1[id1] = d2[id2] = false;            // Un-choose
        }
    }
public:
    vector<vector<string>> solveNQueens(int n) {
        vector<vector<string>> result;
        vector<string> board(n, string(n, '.'));
        vector<bool> c(n, false), d1(2 * n - 1, false), d2(2 * n - 1, false);
        backtrack(0, n, c, d1, d2, board, result);
        return result;
    }
};`,
          java: `import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class Solution {
    private void backtrack(int r, int n, boolean[] c, boolean[] d1, boolean[] d2,
                           char[][] board, List<List<String>> result) {
        if (r == n) {
            List<String> rowList = new ArrayList<>();
            for (char[] row : board) rowList.add(new String(row));
            result.add(rowList);
            return;
        }
        for (int col = 0; col < n; col++) {
            int id1 = r - col + n - 1, id2 = r + col;
            if (c[col] || d1[id1] || d2[id2]) continue;

            board[r][col] = 'Q';
            c[col] = d1[id1] = d2[id2] = true;             // Choose

            backtrack(r + 1, n, c, d1, d2, board, result); // Explore

            board[r][col] = '.';
            c[col] = d1[id1] = d2[id2] = false;            // Un-choose
        }
    }

    public List<List<String>> solveNQueens(int n) {
        List<List<String>> result = new ArrayList<>();
        char[][] board = new char[n][n];
        for (char[] row : board) Arrays.fill(row, '.');
        backtrack(0, n, new boolean[n], new boolean[2 * n - 1], new boolean[2 * n - 1], board, result);
        return result;
    }
}`,
          python: `class Solution:
    def solveNQueens(self, n: int) -> list[list[str]]:
        result: list[list[str]] = []
        board = [["."] * n for _ in range(n)]
        c = [False] * n
        d1 = [False] * (2 * n - 1)
        d2 = [False] * (2 * n - 1)

        def backtrack(r: int) -> None:
            if r == n:
                result.append(["".join(row) for row in board])
                return
            for col in range(n):
                id1, id2 = r - col + n - 1, r + col
                if c[col] or d1[id1] or d2[id2]:
                    continue

                board[r][col] = "Q"
                c[col] = d1[id1] = d2[id2] = True         # Choose

                backtrack(r + 1)                          # Explore

                board[r][col] = "."
                c[col] = d1[id1] = d2[id2] = False        # Un-choose

        backtrack(0)
        return result`,
        },
      },
      { kind: 'heading', text: 'Safety check comparison' },
      {
        kind: 'table',
        headers: ['Method', 'Conflict Check', 'Auxiliary Space', 'Mechanism'],
        rows: [
          ['Ray Casting', 'O(N)', 'O(1)', 'Scans upward along column and both diagonal rays in grid'],
          ['Boolean Arrays', 'O(1)', 'O(N)', 'Direct index lookups in column, row - col + N - 1, and row + col arrays'],
          ['Search Tree', 'O(N!) upper bound', 'O(N) stack', 'Diagonal pruning eliminates non-viable subtrees early'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Negative array index during diagonal offset calculation',
        body: 'The difference `row - col` evaluates to negative numbers whenever `col > row`, down to `-(N - 1)`. In C++ and Java, indexing an array with a negative integer produces out-of-bounds exceptions or memory corruption. Always add the offset `N - 1` to map values into the safe index range `0` through `2N - 2`.',
      },
    ],
    keyTakeaways: [
      'Placing one queen per row eliminates row conflicts and bounds the search tree to N! candidates.',
      'Cells on the same anti-diagonal share an identical sum row + col in range 0 to 2N - 2.',
      'Cells on the same main diagonal share an identical difference row - col, mapped via offset N - 1.',
      'Boolean lookup arrays accelerate candidate conflict verification from O(N) scans to O(1) checks.',
    ],
    practice: {
      prompt: 'Implement an N-Queens solver using column and diagonal boolean lookup arrays. For N = 4, verify that exactly 2 distinct board configurations are produced.',
      leetcode: { title: 'N-Queens', slug: 'n-queens' },
    },
  },

  // =========================================================================
  // Lesson 6: Pruning
  // =========================================================================
  {
    sub: 6,
    summary: 'Bound combinatorial search trees using constraint propagation, sorting heuristics, and symmetry breaking.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: '**Pruning** is the technique of abandoning a recursive branch early when constraints prove that the branch cannot contain a valid or optimal solution. In an unpruned backtracking tree with branching factor `b` and depth `d`, search visits O(b^d) states. For problems like partitioning an array into four equal sides to form a square, an unpruned search visits 4^n states. When `n = 15`, 4^15 exceeds one billion operations. Pruning a branch near the root discards millions of descendant calls at once.',
      },
      { kind: 'heading', text: 'Core pruning strategies' },
      {
        kind: 'text',
        body: 'Combinatorial algorithms apply four primary pruning techniques: **feasibility checks** verify prerequisite conditions before recursion begins (such as total sum divisibility by 4); **heuristic sorting** orders items descending so large values fail constraints high in the tree; **capacity bounding** skips containers whose current sum exceeds the target; and **symmetry breaking** skips identical or empty containers to prevent evaluating duplicate combinatorial permutations.',
      },
      {
        kind: 'code',
        caption: 'Matchsticks to Square partition with multi-level pruning and symmetry breaking',
        code: {
          cpp: `#include <vector>
#include <numeric>
#include <algorithm>
using namespace std;

class Solution {
    bool backtrack(int idx, const vector<int>& matchsticks, int target, vector<int>& sides) {
        if (idx == (int)matchsticks.size()) return true;

        for (int i = 0; i < 4; i++) {
            if (sides[i] + matchsticks[idx] > target) continue; // Capacity bound
            if (i > 0 && sides[i] == sides[i - 1]) continue;    // Symmetry breaking

            sides[i] += matchsticks[idx];                       // Choose
            if (backtrack(idx + 1, matchsticks, target, sides)) return true; // Explore
            sides[i] -= matchsticks[idx];                       // Un-choose
        }
        return false;
    }
public:
    bool makesquare(vector<int>& matchsticks) {
        if (matchsticks.size() < 4) return false;
        long long sum = accumulate(matchsticks.begin(), matchsticks.end(), 0LL);
        if (sum % 4 != 0) return false; // Feasibility check

        int target = sum / 4;
        sort(matchsticks.rbegin(), matchsticks.rend()); // Heuristic sort
        if (matchsticks[0] > target) return false;

        vector<int> sides(4, 0);
        return backtrack(0, matchsticks, target, sides);
    }
};`,
          java: `import java.util.Arrays;

public class Solution {
    private boolean backtrack(int idx, int[] matchsticks, int target, int[] sides) {
        if (idx == matchsticks.length) return true;

        for (int i = 0; i < 4; i++) {
            if (sides[i] + matchsticks[idx] > target) continue; // Capacity bound
            if (i > 0 && sides[i] == sides[i - 1]) continue;    // Symmetry breaking

            sides[i] += matchsticks[idx];                       // Choose
            if (backtrack(idx + 1, matchsticks, target, sides)) return true; // Explore
            sides[i] -= matchsticks[idx];                       // Un-choose
        }
        return false;
    }

    public boolean makesquare(int[] matchsticks) {
        if (matchsticks.length < 4) return false;
        long sum = 0;
        for (int m : matchsticks) sum += m;
        if (sum % 4 != 0) return false; // Feasibility check

        int target = (int) (sum / 4);
        Arrays.sort(matchsticks);
        for (int i = 0, j = matchsticks.length - 1; i < j; i++, j--) {
            int tmp = matchsticks[i];
            matchsticks[i] = matchsticks[j];
            matchsticks[j] = tmp;
        }
        if (matchsticks[0] > target) return false;

        return backtrack(0, matchsticks, target, new int[4]);
    }
}`,
          python: `class Solution:
    def makesquare(self, matchsticks: list[int]) -> bool:
        if len(matchsticks) < 4:
            return False
        total = sum(matchsticks)
        if total % 4 != 0:
            return False  # Feasibility check

        target = total // 4
        matchsticks.sort(reverse=True)  # Heuristic sort
        if matchsticks[0] > target:
            return False

        sides = [0] * 4

        def backtrack(idx: int) -> bool:
            if idx == len(matchsticks):
                return True
            for i in range(4):
                if sides[i] + matchsticks[idx] > target:
                    continue  # Capacity bound
                if i > 0 and sides[i] == sides[i - 1]:
                    continue  # Symmetry breaking

                sides[i] += matchsticks[idx]  # Choose
                if backtrack(idx + 1):        # Explore
                    return True
                sides[i] -= matchsticks[idx]  # Un-choose

            return False

        return backtrack(0)`,
        },
      },
      { kind: 'heading', text: 'Pruning taxonomy and performance impact' },
      {
        kind: 'table',
        headers: ['Pruning Technique', 'Execution Point', 'Mechanism', 'Search Space Impact'],
        rows: [
          ['Feasibility Check', 'Before recursion begins', 'Verifies divisibility and single-item upper bounds', 'Rejects unsolvable instances in O(n) time'],
          ['Heuristic Sorting', 'Input pre-processing', 'Sorts descending to place largest items first', 'Triggers capacity overflows high in tree, cutting wide subtrees'],
          ['Capacity Bounding', 'Inside choice loop', 'Skips containers exceeding remaining capacity', 'Prevents descent into invalid over-capacity states'],
          ['Symmetry Breaking', 'Across sibling choices', 'Skips containers with identical partial sums', 'Collapses factorial permutation redundancies across identical buckets'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Symmetric container redundancy in partitioning problems',
        body: 'When distributing elements into multiple identical containers, trying an element in empty container 2 after it failed in empty container 1 repeats the exact same search tree. If `sides[i] == 0` (or `sides[i] == sides[i - 1]`) and the recursive exploration returns false, testing subsequent identical containers produces purely redundant work. Skipping identical containers is essential to avoid timeout.',
      },
    ],
    keyTakeaways: [
      'Pruning cuts off recursive branches as soon as constraints prove no valid solution can exist.',
      'Feasibility checks verify global properties like total sum divisibility before beginning recursion.',
      'Sorting candidates descending places constrained items first, failing invalid paths high in the tree.',
      'Symmetry breaking skips identical containers to avoid exploring duplicate combinatorial permutations.',
    ],
    practice: {
      prompt: 'Implement a backtracking solver to determine if an array of matchsticks can be partitioned into 4 equal sides to form a square. Apply descending sort, capacity bounds, and symmetry breaking.',
      leetcode: { title: 'Matchsticks to Square', slug: 'matchsticks-to-square' },
    },
  },
];
