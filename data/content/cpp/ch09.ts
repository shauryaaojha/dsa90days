import type { Lesson } from '../types';

/**
 * Chapter 9 — Recursion and Backtracking.
 * The highest-leverage chapter in Phase 0: trees, graphs, divide-and-conquer
 * and dynamic programming all rest on it.
 */
export const ch09: Lesson[] = [
  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-9.1',
    language: 'cpp',
    summary: 'Build the mental model that makes recursive code readable instead of dizzying.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Recursion is a function calling itself on a **smaller version of the same problem**. The difficulty is never the syntax — it is trusting that the smaller call works without tracing it in your head.',
      },
      {
        kind: 'code',
        caption: 'The canonical example',
        code: `int factorial(int n) {
    if (n <= 1) return 1;              // base case: smallest problem, answered directly
    return n * factorial(n - 1);       // recursive case: smaller problem
}`,
      },
      { kind: 'heading', text: 'The leap of faith' },
      {
        kind: 'text',
        body: 'When writing `factorial(n)`, do **not** trace what `factorial(n-1)` does. Assume it already returns the correct answer for `n-1`, and ask only: given that, how do I produce the answer for `n`? Here — multiply by `n`. That is the whole design step.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Three questions design any recursive function',
        body: '**1.** What is the smallest input I can answer immediately? (the base case) **2.** How do I make the input smaller? **3.** Given the correct answer for the smaller input, how do I build the answer for this one? Answer those three and the code writes itself — you never need to simulate the whole call tree.',
      },
      {
        kind: 'code',
        caption: 'The three questions applied to a tree',
        code: `int maxDepth(TreeNode* root) {
    // 1. Smallest input: an empty tree has depth 0.
    if (root == nullptr) return 0;

    // 2. Smaller inputs: the left and right subtrees.
    // 3. Given their depths, this tree is one deeper than the larger.
    return 1 + max(maxDepth(root->left), maxDepth(root->right));
}`,
      },
      {
        kind: 'text',
        body: 'Notice you never think about grandchildren. Each call handles exactly one node and delegates everything below it. That is why tree recursion is usually three or four lines.',
      },
      { kind: 'heading', text: 'Why it fits trees and graphs so naturally' },
      {
        kind: 'text',
        body: 'A tree is defined recursively: a node with a left subtree and a right subtree, each of which is itself a tree. When the data structure is recursive, the natural algorithm is too — which is why iterative tree traversal requires you to manage an explicit stack and simulate what recursion does for free.',
      },
      {
        kind: 'table',
        headers: ['Iteration', 'Recursion'],
        rows: [
          ['Explicit loop and counters', 'Implicit — the call stack tracks position'],
          ['Constant extra space', 'O(depth) stack space'],
          ['Natural for linear scans', 'Natural for trees, graphs, divide-and-conquer'],
          ['Faster — no call overhead', 'Slower, but usually far shorter and clearer'],
        ],
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Recursion is never required, but often much clearer',
        body: 'Anything recursive can be rewritten with an explicit stack, and sometimes must be when the depth would overflow. But a recursive tree traversal is three lines while the iterative version is fifteen. Reach for recursion first on tree and graph problems; convert only if depth becomes a real problem.',
      },
      {
        kind: 'code',
        caption: 'The same computation, both ways',
        code: `// Iterative
int factorial(int n) {
    int result = 1;
    for (int i = 2; i <= n; i++) result *= i;
    return result;
}

// Recursive
int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}`,
      },
      {
        kind: 'text',
        body: 'For factorial, iteration is genuinely better — no stack cost. Recursion earns its keep when the problem branches, as trees and backtracking do, because a loop cannot naturally follow two paths at once.',
      },
    ],
    keyTakeaways: [
      'Recursion solves a problem via a smaller instance of the same problem.',
      'Trust the recursive call — do not trace it. Assume it returns the right answer.',
      'Design with three questions: base case, how to shrink, how to combine.',
      'Prefer recursion where the data branches; prefer iteration for linear scans.',
    ],
    practice: {
      prompt: 'Write `factorial` and `maxDepth` recursively, then state each one\'s three design questions out loud. Then write `sum(vector, index)` recursively without tracing a single call — just answer the three questions and trust the result. Getting comfortable *not* simulating the call tree is the actual skill here.',
      leetcode: { title: 'Maximum Depth of Binary Tree', slug: 'maximum-depth-of-binary-tree' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-9.2',
    language: 'cpp',
    summary: 'Write the stopping condition correctly — the difference between a solution and a crash.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'The base case is the input small enough to answer without recursing. Without one — or with a wrong one — the recursion never stops and the stack overflows.',
      },
      {
        kind: 'code',
        caption: 'Missing base case',
        code: `int factorial(int n) {
    return n * factorial(n - 1);      // never stops → stack overflow
}`,
      },
      { kind: 'heading', text: 'The base cases you will write over and over' },
      {
        kind: 'code',
        code: `// Trees — the empty tree
if (root == nullptr) return 0;

// Linked lists — the end, and often the single node
if (head == nullptr || head->next == nullptr) return head;

// Arrays — index reached the end
if (index >= nums.size()) return 0;

// Numbers — counted down to zero or one
if (n <= 1) return n;

// Backtracking — the current candidate is complete
if (current.size() == target) { result.push_back(current); return; }`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Write the base case first',
        body: 'Before the recursive line, before anything else. It forces you to decide what the smallest input is and what the function returns for it — which is usually where the whole design becomes clear. Starting with the recursive case and adding the base case afterwards is how people end up with subtly wrong stopping conditions.',
      },
      { kind: 'heading', text: 'Use <= not ==' },
      {
        kind: 'code',
        code: `// FRAGILE — factorial(-1) recurses forever past the check
if (n == 1) return 1;

// ROBUST — anything at or below the boundary stops
if (n <= 1) return 1;`,
      },
      {
        kind: 'text',
        body: 'If a value can ever skip past your exact-equality check — through a negative input or a step of more than one — the recursion never terminates. An inequality catches every case at or beyond the boundary.',
      },
      { kind: 'heading', text: 'Some problems need more than one base case' },
      {
        kind: 'code',
        caption: 'Fibonacci needs two',
        code: `int fib(int n) {
    if (n == 0) return 0;
    if (n == 1) return 1;             // both are needed —
    return fib(n - 1) + fib(n - 2);   // fib(2) calls fib(1) AND fib(0)
}`,
      },
      {
        kind: 'text',
        body: 'The rule: you need a base case for every input the recursive step can produce that cannot itself be recursed on. Since `fib` steps down by two, both `1` and `0` are reachable directly.',
      },
      {
        kind: 'code',
        caption: 'Linked list reversal needs both conditions',
        code: `ListNode* reverse(ListNode* head) {
    if (head == nullptr || head->next == nullptr) return head;
    // an empty list AND a single node are both already reversed
    ListNode* rest = reverse(head->next);
    head->next->next = head;
    head->next = nullptr;
    return rest;
}`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Check for null before dereferencing in the base case',
        body: '`if (head->next == nullptr) return head;` crashes on an empty list, because `head` itself is null. The null check must come first, and `||` short-circuits so the second test is only reached when `head` is valid. Order matters here exactly as it did in Chapter 2.',
      },
      {
        kind: 'text',
        body: 'A useful sanity check before you run anything: pick the smallest possible input — empty tree, empty list, `n = 0` — and confirm your base case handles it without recursing. That single check catches most termination bugs.',
      },
    ],
    keyTakeaways: [
      'The base case is the input answered directly, with no recursion.',
      'Write it first — it usually clarifies the whole design.',
      'Prefer `<=` over `==` so values cannot skip past the boundary.',
      'Null-check before dereferencing: `head == nullptr || head->next == nullptr`.',
    ],
    practice: {
      prompt: 'Write `factorial` with `if (n == 1)` and call it with −1 to see it never terminate, then fix it with `<=`. Then write recursive list reversal and test it on an empty list and a one-node list — those two inputs are what the compound base case exists for.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-9.3',
    language: 'cpp',
    summary: 'Shrink the problem and combine the results — the other half of every recursive function.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'The recursive case does two things: call itself on a **strictly smaller** input, and combine what comes back into this level\'s answer.',
      },
      {
        kind: 'code',
        code: `int sum(vector<int>& nums, int i) {
    if (i == nums.size()) return 0;        // base
    return nums[i] + sum(nums, i + 1);     // shrink (i+1), combine (+)
}`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'The input must get strictly smaller',
        body: 'If a recursive call can be made with the same input, the recursion never terminates. `return f(n)` or `f(n - 0)` are obvious, but the subtle version is a graph traversal that revisits a node it has already seen — which is why graph DFS needs a `visited` set while tree DFS does not. A tree has no cycles; a graph does.',
      },
      { kind: 'heading', text: 'The three combining shapes' },
      {
        kind: 'code',
        caption: '1. One call — linear recursion',
        code: `int sum(vector<int>& nums, int i) {
    if (i == nums.size()) return 0;
    return nums[i] + sum(nums, i + 1);
}
// depth n, one path — equivalent to a loop`,
      },
      {
        kind: 'code',
        caption: '2. Two calls — binary recursion',
        code: `int maxDepth(TreeNode* root) {
    if (!root) return 0;
    int left  = maxDepth(root->left);
    int right = maxDepth(root->right);
    return 1 + max(left, right);          // combine both results
}`,
      },
      {
        kind: 'code',
        caption: '3. Many calls in a loop — branching recursion',
        code: `void dfs(int node, vector<vector<int>>& adj, vector<bool>& visited) {
    visited[node] = true;
    for (int next : adj[node])
        if (!visited[next]) dfs(next, adj, visited);
}`,
      },
      { kind: 'heading', text: 'Where the work happens: before or after the call' },
      {
        kind: 'code',
        code: `// PRE-ORDER — act on this node, then recurse
void preorder(TreeNode* node) {
    if (!node) return;
    cout << node->val;          // work first
    preorder(node->left);
    preorder(node->right);
}

// POST-ORDER — recurse, then act using the children's results
int size(TreeNode* node) {
    if (!node) return 0;
    int l = size(node->left);
    int r = size(node->right);
    return 1 + l + r;           // work after — needs the children's answers
}

// IN-ORDER — left, act, right (gives sorted output on a BST)
void inorder(TreeNode* node) {
    if (!node) return;
    inorder(node->left);
    cout << node->val;
    inorder(node->right);
}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The ordering question answers itself',
        body: 'Ask: **do I need my children\'s answers to compute mine?** If yes, the work goes after the calls (post-order) — that covers depth, size, sum, and "is this subtree balanced". If no, it can go before (pre-order) — printing, copying, path building. In-order is specifically for BSTs, where it yields sorted order.',
      },
      {
        kind: 'code',
        caption: 'Passing state down vs returning it up',
        code: `// Returning UP — each call computes and returns its own answer
int sumTree(TreeNode* node) {
    if (!node) return 0;
    return node->val + sumTree(node->left) + sumTree(node->right);
}

// Passing DOWN — state accumulates as you descend
void collect(TreeNode* node, int depth, vector<int>& result) {
    if (!node) return;
    if (depth == result.size()) result.push_back(node->val);
    collect(node->left,  depth + 1, result);
    collect(node->right, depth + 1, result);
}`,
      },
      {
        kind: 'text',
        body: 'Returning up is cleaner when each subtree has a self-contained answer. Passing down is needed when a node\'s handling depends on context from above — its depth, the path taken, or a running total. Many problems use both at once.',
      },
    ],
    keyTakeaways: [
      'The recursive call must be on a strictly smaller input, or it never terminates.',
      'Graphs need a `visited` set because they have cycles; trees do not.',
      'Work before the calls is pre-order; work after is post-order.',
      'Post-order when you need your children\'s results; pre-order when you do not.',
    ],
    practice: {
      prompt: 'Write pre-order, in-order and post-order traversal of the same tree and compare the outputs. Then write `countNodes` and notice the work must come *after* both calls. Being able to place the work correctly without thinking is most of what tree problems require.',
      leetcode: { title: 'Binary Tree Inorder Traversal', slug: 'binary-tree-inorder-traversal' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-9.4',
    language: 'cpp',
    summary: 'See what actually happens in memory during recursion, and why depth is limited.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Every function call pushes a **stack frame** holding that call\'s parameters, local variables, and the address to return to. Recursion pushes one frame per level, and they only unwind as calls return.',
      },
      {
        kind: 'code',
        caption: 'Tracing factorial(4)',
        code: `factorial(4)
  → 4 * factorial(3)
        → 3 * factorial(2)
              → 2 * factorial(1)
                    → returns 1           ← base case, unwinding starts
              ← 2 * 1 = 2
        ← 3 * 2 = 6
  ← 4 * 6 = 24`,
      },
      {
        kind: 'text',
        body: 'Four frames exist simultaneously at the deepest point. Nothing is computed on the way *down* — the multiplications all happen on the way back *up*, as each call receives its child\'s result.',
      },
      {
        kind: 'code',
        caption: 'Seeing it directly',
        code: `void trace(int n, int depth) {
    string indent(depth * 2, ' ');
    cout << indent << "enter " << n << "\\n";
    if (n > 0) trace(n - 1, depth + 1);
    cout << indent << "exit  " << n << "\\n";
}
trace(3, 0);`,
        output: 'enter 3\n  enter 2\n    enter 1\n      enter 0\n      exit  0\n    exit  1\n  exit  2\nexit  3',
      },
      {
        kind: 'text',
        body: 'The symmetry of that output is the call stack made visible: every "enter" has a matching "exit", and they nest. Adding this kind of trace to a recursion you do not understand is the single most effective debugging technique for this chapter.',
      },
      { kind: 'heading', text: 'Each frame has its own locals' },
      {
        kind: 'code',
        code: `void f(int n) {
    int local = n * 10;          // a SEPARATE 'local' in every frame
    if (n > 0) f(n - 1);
    cout << local;               // this frame's own copy
}
f(3);      // prints 0 10 20 30 — unwinding order`,
      },
      {
        kind: 'text',
        body: 'This is why recursion works at all: each level keeps its own state, untouched by deeper calls. It is also why a by-value `vector` parameter is so costly — every frame gets its own full copy.',
      },
      { kind: 'heading', text: 'Stack overflow' },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Roughly 10,000–100,000 frames is the ceiling',
        body: 'The stack is typically 1–8 MB. Divide by your frame size and that is your maximum depth. On LeetCode a stack overflow appears as a bare "Runtime Error" with no message — and the classic trigger is a "tree" that is actually a straight line of 10⁵ nodes, making the depth equal to the node count.',
      },
      {
        kind: 'code',
        caption: 'When depth is the problem, use an explicit stack',
        code: `// Recursive — clean, but O(n) stack frames
void inorder(TreeNode* node) {
    if (!node) return;
    inorder(node->left);
    cout << node->val;
    inorder(node->right);
}

// Iterative — same traversal, heap-allocated stack, no depth limit
void inorder(TreeNode* root) {
    stack<TreeNode*> st;
    TreeNode* curr = root;
    while (curr != nullptr || !st.empty()) {
        while (curr != nullptr) {       // go as far left as possible
            st.push(curr);
            curr = curr->left;
        }
        curr = st.top(); st.pop();
        cout << curr->val;              // visit
        curr = curr->right;             // then go right
    }
}`,
      },
      {
        kind: 'text',
        body: 'The iterative version does exactly what the recursion did — it just keeps the pending nodes in a heap-allocated `stack` instead of the call stack, which is far larger. This conversion is always possible and is the standard fix for depth limits.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Tail recursion, and why C++ does not save you',
        body: 'When the recursive call is the very last operation, the compiler *can* reuse the frame instead of pushing a new one, making it a loop. GCC does this at `-O2`. But it is not guaranteed by the standard and LeetCode\'s optimisation settings are not something you control — so never rely on it. If depth is a genuine risk, convert to a loop yourself.',
      },
    ],
    keyTakeaways: [
      'Each call pushes a frame; all frames coexist until the calls return.',
      'Every frame has its own locals — which is why by-value parameters cost so much.',
      'Depth is capped at roughly 10⁴–10⁵ frames; overflow shows as a bare Runtime Error.',
      'Convert to an explicit `stack` when depth could approach the input size.',
    ],
    practice: {
      prompt: 'Write the indented `trace` function and run it — the nesting *is* the call stack. Then write a recursion with no base case and find the depth at which it dies. Then convert recursive in-order traversal to the iterative stack version, which is the standard rescue when a degenerate tree overflows.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-9.5',
    language: 'cpp',
    summary: 'Recurse over arrays with an index, and meet divide-and-conquer.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Arrays are not recursive structures, so you shrink them with an **index** rather than by passing sub-arrays. Never slice — copying a sub-array at every level turns O(n) into O(n²).',
      },
      {
        kind: 'code',
        caption: 'The index pattern',
        code: `int sum(vector<int>& nums, int i = 0) {
    if (i == nums.size()) return 0;
    return nums[i] + sum(nums, i + 1);
}

sum(nums);      // the default argument keeps the entry call clean`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Never pass a sliced sub-array',
        body: 'Writing `sum(vector<int>(nums.begin() + 1, nums.end()))` copies the remaining n−1 elements at every level: n copies of average length n/2, so O(n²) total. The array itself must be passed by reference and unchanged; only the index moves. This is the most common performance mistake in recursive array code.',
      },
      { kind: 'heading', text: 'Two indices for a range' },
      {
        kind: 'code',
        code: `bool isPalindrome(const string& s, int left, int right) {
    if (left >= right) return true;                  // met or crossed
    if (s[left] != s[right]) return false;
    return isPalindrome(s, left + 1, right - 1);     // shrink from both ends
}`,
      },
      { kind: 'heading', text: 'Divide and conquer' },
      {
        kind: 'text',
        body: 'Instead of peeling one element, split the range in half, solve both halves, and combine. This is where recursion beats iteration on arrays.',
      },
      {
        kind: 'code',
        caption: 'Binary search',
        code: `int search(vector<int>& nums, int target, int low, int high) {
    if (low > high) return -1;                       // range is empty

    int mid = low + (high - low) / 2;
    if (nums[mid] == target) return mid;
    if (nums[mid] < target)  return search(nums, target, mid + 1, high);
    return search(nums, target, low, mid - 1);
}`,
      },
      {
        kind: 'code',
        caption: 'Merge sort — the archetype',
        code: `void mergeSort(vector<int>& v, int low, int high) {
    if (low >= high) return;                 // 0 or 1 element is already sorted

    int mid = low + (high - low) / 2;
    mergeSort(v, low, mid);                  // sort the left half
    mergeSort(v, mid + 1, high);             // sort the right half
    merge(v, low, mid, high);                // combine — the real work
}`,
      },
      {
        kind: 'text',
        body: 'Halving gives depth log n, and each level touches n elements once, so the total is **O(n log n)**. That structure — halve, recurse twice, combine linearly — is the shape of merge sort, quicksort and many "build a tree from an array" problems.',
      },
      {
        kind: 'code',
        caption: 'Building a balanced BST from a sorted array',
        code: `TreeNode* build(vector<int>& nums, int low, int high) {
    if (low > high) return nullptr;

    int mid = low + (high - low) / 2;
    TreeNode* root = new TreeNode(nums[mid]);        // middle becomes the root
    root->left  = build(nums, low, mid - 1);
    root->right = build(nums, mid + 1, high);
    return root;
}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Recursion is not the best tool for simple array scans',
        body: 'Summing or finding a maximum recursively costs O(n) stack frames for no benefit — a loop is faster and cannot overflow. Recursion earns its place on arrays specifically when the problem *divides*: sorting, searching a sorted range, or building a balanced structure. For a straight scan, write the loop.',
      },
    ],
    keyTakeaways: [
      'Shrink arrays with an index, never by copying a sub-array.',
      'Two indices `(low, high)` represent a range; `low > high` is the empty base case.',
      'Divide and conquer halves the range: depth log n, O(n log n) total.',
      'Use a loop for linear scans; use recursion when the problem genuinely divides.',
    ],
    practice: {
      prompt: 'Write recursive binary search with `(low, high)` and test it on an empty range and a one-element array. Then build a balanced BST from a sorted vector. Then write the slicing version of `sum` and time it against the index version on 10,000 elements — the quadratic blow-up is the point.',
      leetcode: { title: 'Convert Sorted Array to Binary Search Tree', slug: 'convert-sorted-array-to-binary-search-tree' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-9.6',
    language: 'cpp',
    summary: 'Recurse over strings without copying them at every level.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Strings behave exactly like arrays here: pass the string by `const&` and move an index. `substr` at every level is the string equivalent of slicing an array, and just as costly.',
      },
      {
        kind: 'code',
        caption: 'Index, not substr',
        code: `// BAD — substr copies the remainder at every level: O(n^2)
bool check(string s) {
    if (s.empty()) return true;
    return check(s.substr(1));
}

// GOOD — one string, one moving index: O(n)
bool check(const string& s, int i = 0) {
    if (i == s.size()) return true;
    return check(s, i + 1);
}`,
      },
      { kind: 'heading', text: 'Reversal and palindromes' },
      {
        kind: 'code',
        code: `void reverse(string& s, int left, int right) {
    if (left >= right) return;
    swap(s[left], s[right]);
    reverse(s, left + 1, right - 1);
}

bool isPalindrome(const string& s, int left, int right) {
    if (left >= right) return true;
    if (s[left] != s[right]) return false;
    return isPalindrome(s, left + 1, right - 1);
}`,
      },
      { kind: 'heading', text: 'Building results as you descend' },
      {
        kind: 'code',
        caption: 'All subsets of a string',
        code: `void subsets(const string& s, int i, string current, vector<string>& result) {
    if (i == s.size()) {
        result.push_back(current);
        return;
    }
    subsets(s, i + 1, current + s[i], result);   // include s[i]
    subsets(s, i + 1, current, result);          // exclude s[i]
}`,
      },
      {
        kind: 'text',
        body: 'Two calls per character — include it or skip it — giving 2ⁿ results. Here `current` is deliberately passed **by value**, because each branch needs its own independent copy. That is the one place copying is correct.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'By value for branch-local state, by reference for shared state',
        body: '`current` is by value: each branch builds its own candidate. `result` is by reference: all branches append to one shared list. Getting this distinction right is what separates working backtracking from code that either loses results or corrupts them. The alternative — pass `current` by reference and undo the change after the call — is the classic backtracking form covered shortly.',
      },
      {
        kind: 'code',
        caption: 'The same thing with explicit backtracking',
        code: `void subsets(const string& s, int i, string& current, vector<string>& result) {
    if (i == s.size()) { result.push_back(current); return; }

    current.push_back(s[i]);          // choose
    subsets(s, i + 1, current, result);
    current.pop_back();               // un-choose

    subsets(s, i + 1, current, result);
}`,
      },
      {
        kind: 'text',
        body: 'One shared string, mutated and restored. Slightly more code, but no copying per branch — the standard form once strings get long.',
      },
      {
        kind: 'code',
        caption: 'Letter combinations of a phone number',
        code: `void backtrack(const string& digits, int i, string& current,
               vector<string>& result, const vector<string>& map) {
    if (i == digits.size()) {
        if (!current.empty()) result.push_back(current);
        return;
    }
    for (char c : map[digits[i] - '0']) {
        current.push_back(c);
        backtrack(digits, i + 1, current, result, map);
        current.pop_back();
    }
}`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'The empty-string edge case',
        body: 'Recursive string problems are routinely tested with `""`. Check what your base case does when the string has length zero — often the recursion immediately hits the base case and produces one empty result, which may or may not be what the problem wants. The phone-number problem above needs the explicit `!current.empty()` guard for exactly this reason.',
      },
    ],
    keyTakeaways: [
      'Pass the string by `const&` and move an index — never `substr` per level.',
      'Two calls per character (include / exclude) generates all 2ⁿ subsets.',
      'Branch-local state goes by value; shared results go by reference.',
      'Always test the empty string — it is a standard hidden test case.',
    ],
    practice: {
      prompt: 'Generate all subsets of "abc" both ways — passing `current` by value, and by reference with push/pop — and confirm both give 8 results. Then write recursive palindrome checking with two indices and test it on `""` and a single character.',
      leetcode: { title: 'Letter Combinations of a Phone Number', slug: 'letter-combinations-of-a-phone-number' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-9.7',
    language: 'cpp',
    summary: 'Use the recursive structure of linked lists, where the pointer is already the smaller problem.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'A linked list is recursive by definition: a node plus a pointer to a smaller list. So `head->next` already *is* the smaller subproblem — no index needed.',
      },
      {
        kind: 'code',
        caption: 'The basic shape',
        code: `int length(ListNode* head) {
    if (head == nullptr) return 0;          // base: empty list
    return 1 + length(head->next);          // this node, plus the rest
}

void print(ListNode* head) {
    if (head == nullptr) return;
    cout << head->val << " ";
    print(head->next);
}

void printReverse(ListNode* head) {
    if (head == nullptr) return;
    printReverse(head->next);               // recurse FIRST
    cout << head->val << " ";               // then print, on the way back up
}`,
      },
      {
        kind: 'text',
        body: 'That last one is worth pausing on. Moving one line changes the output order completely — printing on the way down gives forward order, printing on the way up gives reverse. This is pre-order versus post-order on a list.',
      },
      { kind: 'heading', text: 'Recursive reversal — the one to understand' },
      {
        kind: 'code',
        code: `ListNode* reverse(ListNode* head) {
    // Base: empty or single node is already reversed.
    if (head == nullptr || head->next == nullptr) return head;

    // Trust the recursion: everything after head is now reversed,
    // and newHead is the new front of the whole list.
    ListNode* newHead = reverse(head->next);

    // head->next still points at the node that is now the TAIL of the
    // reversed part. Make that node point back at head.
    head->next->next = head;
    head->next = nullptr;          // head becomes the new tail

    return newHead;                // unchanged all the way up
}`,
      },
      {
        kind: 'text',
        body: 'Take `1 → 2 → 3`. The call on `2` returns `3 → 2`, with `head` still at `1` and `head->next` still pointing at `2`. Since `2` is now the tail, `head->next->next = head` makes `2 → 1`, giving `3 → 2 → 1`. Then `head->next = nullptr` terminates it.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'head->next is still valid after the recursive call',
        body: 'This is the part that confuses people. The recursion rearranges pointers, but `head->next` was never changed by it — it still points at the same node, which has become the tail of the reversed portion. That is exactly what makes `head->next->next = head` reattach correctly. Draw three nodes on paper and trace it once; it clicks immediately and never needs re-deriving.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Forgetting head->next = nullptr creates a cycle',
        body: 'Without it, the last node still points forward at the node now behind it: `1 ⇄ 2`. Any subsequent traversal loops forever, showing up as Time Limit Exceeded rather than a crash. Whenever a list solution hangs, look for a node that should have been terminated.',
      },
      { kind: 'heading', text: 'Merging two sorted lists' },
      {
        kind: 'code',
        code: `ListNode* merge(ListNode* a, ListNode* b) {
    if (a == nullptr) return b;        // one list empty → the other is the answer
    if (b == nullptr) return a;

    if (a->val <= b->val) {
        a->next = merge(a->next, b);   // a leads; merge the rest behind it
        return a;
    } else {
        b->next = merge(a, b->next);
        return b;
    }
}`,
      },
      {
        kind: 'text',
        body: 'Pick the smaller head, then trust the recursion to merge everything left over and attach it behind. Six lines, versus a dozen for the iterative version with its dummy node and tail pointer.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Recursion on a long list overflows the stack',
        body: 'These functions use O(n) stack frames, and LeetCode list problems routinely allow 10⁵ nodes. A recursive reversal on a list that long can overflow — a bare Runtime Error with no message. The iterative version uses O(1) space and always works. Write the recursive one to understand the structure; know the iterative one for large constraints.',
      },
      {
        kind: 'code',
        caption: 'Iterative reversal — O(1) space, no depth limit',
        code: `ListNode* reverse(ListNode* head) {
    ListNode* prev = nullptr;
    while (head != nullptr) {
        ListNode* next = head->next;   // save before overwriting
        head->next = prev;             // flip the link
        prev = head;                   // advance both
        head = next;
    }
    return prev;
}`,
      },
    ],
    keyTakeaways: [
      '`head->next` is already the smaller subproblem — no index needed.',
      'Printing before the call gives forward order; after it gives reverse.',
      'In recursive reversal, `head->next` still points at the new tail — that is the key.',
      'Recursion on lists costs O(n) stack; prefer the iterative form for 10⁵ nodes.',
    ],
    practice: {
      prompt: 'Draw `1 → 2 → 3` on paper and hand-trace recursive reversal, writing down every pointer after each step. Then code it, then code the iterative version. Then omit `head->next = nullptr` and watch the traversal hang — that infinite loop is what a missing terminator looks like.',
      leetcode: { title: 'Reverse Linked List', slug: 'reverse-linked-list' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-9.8',
    language: 'cpp',
    summary: 'Explore every possibility systematically, undoing each choice as you retreat.',
    readMinutes: 6,
    blocks: [
      {
        kind: 'text',
        body: 'Backtracking is recursion that **builds a candidate incrementally and undoes each step** when it retreats. It is how you generate permutations, subsets and combinations, and how you solve N-Queens and Sudoku.',
      },
      {
        kind: 'code',
        caption: 'The skeleton — memorise this',
        code: `void backtrack(State& current, Result& result) {
    if (isComplete(current)) {
        result.push_back(current);       // save a COPY
        return;
    }

    for (auto& choice : availableChoices(current)) {
        if (!isValid(choice)) continue;  // prune

        apply(choice, current);          // CHOOSE
        backtrack(current, result);      // EXPLORE
        undo(choice, current);           // UN-CHOOSE
    }
}`,
      },
      {
        kind: 'text',
        body: 'Choose, explore, un-choose. Every backtracking problem is this shape with different definitions of "complete", "choices" and "valid".',
      },
      { kind: 'heading', text: 'Subsets — include or exclude' },
      {
        kind: 'code',
        code: `void backtrack(vector<int>& nums, int start,
               vector<int>& current, vector<vector<int>>& result) {
    result.push_back(current);           // EVERY node is a valid subset

    for (int i = start; i < nums.size(); i++) {
        current.push_back(nums[i]);              // choose
        backtrack(nums, i + 1, current, result); // explore — i+1 avoids reuse
        current.pop_back();                      // un-choose
    }
}`,
      },
      {
        kind: 'text',
        body: 'Note `i + 1` rather than `start + 1`: it prevents reusing earlier elements, which is what stops `{1,2}` and `{2,1}` both appearing. Subsets are unordered, so each combination must be generated once.',
      },
      { kind: 'heading', text: 'Permutations — order matters' },
      {
        kind: 'code',
        code: `void backtrack(vector<int>& nums, vector<int>& current,
               vector<bool>& used, vector<vector<int>>& result) {
    if (current.size() == nums.size()) {
        result.push_back(current);
        return;
    }

    for (int i = 0; i < nums.size(); i++) {
        if (used[i]) continue;           // skip what is already in the candidate

        used[i] = true;                  // choose
        current.push_back(nums[i]);

        backtrack(nums, current, used, result);

        current.pop_back();              // un-choose — BOTH parts
        used[i] = false;
    }
}`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Undo every part of the choice',
        body: 'Here "choose" touched two things — `used[i]` and `current` — so "un-choose" must restore both. Forgetting `used[i] = false` means that element is permanently unavailable to every sibling branch, and you silently get far fewer results. Write the undo immediately after writing the choose, before filling in anything between them.',
      },
      {
        kind: 'table',
        headers: ['Problem type', 'Loop starts at', 'Tracking'],
        rows: [
          ['Subsets / combinations', '`start`, recurse with `i + 1`', 'None needed'],
          ['Permutations', '`0` every time', 'A `used` array'],
          ['Combination sum (reuse allowed)', '`start`, recurse with `i`', 'A running total'],
          ['Grid paths', 'Four directions', 'A `visited` grid'],
        ],
      },
      { kind: 'heading', text: 'Pruning is what makes it fast enough' },
      {
        kind: 'code',
        caption: 'Combination sum — stop as soon as the branch is hopeless',
        code: `void backtrack(vector<int>& candidates, int target, int start,
               vector<int>& current, vector<vector<int>>& result) {
    if (target == 0) { result.push_back(current); return; }
    if (target < 0) return;              // PRUNE — overshot, abandon this branch

    for (int i = start; i < candidates.size(); i++) {
        current.push_back(candidates[i]);
        backtrack(candidates, target - candidates[i], i, current, result);
        current.pop_back();
    }
}`,
      },
      {
        kind: 'text',
        body: 'Without `if (target < 0) return;` the recursion keeps exploring branches that can never succeed. Pruning early is usually the difference between passing and exceeding the time limit — the search space is exponential, so cutting a branch high up removes an enormous subtree.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Sorting first enables stronger pruning',
        body: 'If the candidates are sorted ascending, then once `candidates[i] > target` every later candidate is too, so you can `break` out of the loop entirely rather than `continue`. Sorting also groups duplicates together, which is how the "no duplicate combinations" variants skip repeats: `if (i > start && candidates[i] == candidates[i-1]) continue;`.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Saving the result must be a copy',
        body: '`result.push_back(current)` copies `current` — which is correct and necessary, because `current` keeps mutating as the search continues. If you stored a reference or pointer instead, every saved result would end up identical and empty. This is the one place in backtracking where copying is the right answer.',
      },
    ],
    keyTakeaways: [
      'Backtracking is choose → explore → un-choose, applied recursively.',
      'Undo every part of a choice, or state leaks into sibling branches.',
      'Subsets recurse with `i + 1`; permutations loop from 0 with a `used` array.',
      'Prune impossible branches early — the search space is exponential.',
    ],
    practice: {
      prompt: 'Write Subsets, then Permutations, then Combination Sum — in that order, since each adds one idea. Then remove the `pop_back()` from one of them and study the wrong output; seeing exactly how state leaks between branches is what makes the un-choose step feel necessary rather than ritual.',
      leetcode: { title: 'Subsets', slug: 'subsets' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-9.9',
    language: 'cpp',
    summary: 'Recognise the eight recursion bugs that account for nearly every failure.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Recursion goes wrong in a small number of predictable ways. Once you can name them you stop losing afternoons — most "my recursion is broken" moments are one of the handful below.',
      },
      { kind: 'heading', text: '1. Missing or unreachable base case' },
      {
        kind: 'code',
        code: `int f(int n) { return n * f(n - 1); }       // never stops

if (n == 1) return 1;                        // f(-1) skips straight past
if (n <= 1) return 1;                        // robust`,
      },
      {
        kind: 'text',
        body: 'Symptom: stack overflow, or a bare Runtime Error on the judge.',
      },
      { kind: 'heading', text: '2. Not shrinking the input' },
      {
        kind: 'code',
        code: `return f(n);              // identical input — infinite
return f(n - 1);          // correct

// The subtle version — a graph without a visited set
void dfs(int node) {
    for (int next : adj[node]) dfs(next);    // cycles → infinite recursion
}`,
      },
      { kind: 'heading', text: '3. Forgetting to return the recursive result' },
      {
        kind: 'code',
        code: `int sum(vector<int>& v, int i) {
    if (i == v.size()) return 0;
    sum(v, i + 1);            // BUG — result computed and thrown away
}                             // falls off the end → garbage

int sum(vector<int>& v, int i) {
    if (i == v.size()) return 0;
    return v[i] + sum(v, i + 1);     // correct
}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Build with -Wall to catch this one',
        body: '`control reaches end of non-void function` catches a missing return immediately. It is only a warning, so without `-Wall` the code compiles silently and returns whatever was left in the return register — often producing plausible-looking wrong answers.',
      },
      { kind: 'heading', text: '4. Passing containers by value' },
      {
        kind: 'code',
        code: `void dfs(vector<int> path);        // copies at EVERY level → O(n^2)
void dfs(vector<int>& path);       // one shared vector → O(n)`,
      },
      {
        kind: 'text',
        body: 'Symptom: Time Limit Exceeded on a solution whose complexity looks correct on paper.',
      },
      { kind: 'heading', text: '5. Forgetting to un-choose' },
      {
        kind: 'code',
        code: `current.push_back(x);
backtrack(...);
// missing current.pop_back();  → state leaks into every sibling branch`,
      },
      {
        kind: 'text',
        body: 'Symptom: duplicate, oversized or malformed results. Whenever a backtracking answer has too many entries or entries that are too long, look here first.',
      },
      { kind: 'heading', text: '6. Sharing state that should be per-branch' },
      {
        kind: 'code',
        code: `// Each branch needs its OWN copy of current
void f(string current);        // by value — independent per branch

// One shared list of results
void f(vector<string>& result);   // by reference — shared`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Getting this backwards is a silent logic bug',
        body: 'Sharing what should be branch-local corrupts candidates across branches; copying what should be shared means your results vanish, because each branch appends to its own throwaway copy and the caller sees an empty list. Neither produces an error — just wrong output.',
      },
      { kind: 'heading', text: '7. Recomputing the same subproblem' },
      {
        kind: 'code',
        code: `int fib(int n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);     // O(2^n) — fib(40) takes seconds
}

// Memoised — O(n)
int fib(int n, unordered_map<int,int>& memo) {
    if (n <= 1) return n;
    if (memo.count(n)) return memo[n];
    return memo[n] = fib(n - 1, memo) + fib(n - 2, memo);
}`,
      },
      {
        kind: 'text',
        body: 'Symptom: Time Limit Exceeded on modest inputs. If the same arguments recur across different branches, cache the results — that single change is the whole of top-down dynamic programming.',
      },
      { kind: 'heading', text: '8. Dereferencing without a null check' },
      {
        kind: 'code',
        code: `int depth(TreeNode* root) {
    return 1 + max(depth(root->left), depth(root->right));   // crashes at the leaves
}

int depth(TreeNode* root) {
    if (root == nullptr) return 0;      // null check IS the base case
    return 1 + max(depth(root->left), depth(root->right));
}`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Matching symptoms to causes',
        body: 'Bare Runtime Error → stack overflow (1, 2) or a null dereference (8). Time Limit Exceeded → copies (4) or recomputation (7). Wrong output → missing return (3), missing un-choose (5), or misplaced state (6). Reading the verdict first narrows the search enormously.',
      },
    ],
    keyTakeaways: [
      'Runtime Error usually means infinite recursion or a null dereference.',
      'TLE usually means by-value copies or unmemoised recomputation.',
      'Wrong output usually means a missing return, a missing un-choose, or misplaced state.',
      'Compile with `-Wall` — it catches missing returns for free.',
    ],
    practice: {
      prompt: 'Deliberately write each of the eight bugs in a small program and note its symptom. Ten minutes doing this is worth hours later, because on LeetCode you get only a verdict and a failing input — being able to map "Runtime Error" or "TLE" to a shortlist of likely causes is most of debugging recursion.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-9.10',
    language: 'cpp',
    summary: 'Work out the time and space cost of a recursive function before you submit it.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'The method: count how many calls happen in total, multiply by the work per call, and separately account for the stack depth as space.',
      },
      {
        kind: 'table',
        headers: ['Shape', 'Calls', 'Time', 'Space (stack)'],
        rows: [
          ['One call, shrink by 1', 'n', 'O(n)', 'O(n)'],
          ['One call, halve', 'log n', 'O(log n)', 'O(log n)'],
          ['Two calls, halve, O(n) merge', '—', 'O(n log n)', 'O(log n)'],
          ['Two calls, shrink by 1', '2ⁿ', 'O(2ⁿ)', 'O(n)'],
          ['Tree traversal', 'one per node', 'O(n)', 'O(h), h = height'],
          ['Permutations', 'n!', 'O(n · n!)', 'O(n)'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Time counts total calls; space counts the deepest single path',
        body: 'This is the distinction people miss. `fib(n)` makes O(2ⁿ) calls, but only n of them exist at once — so it is O(2ⁿ) time and O(n) space. Frames are freed as calls return, so what matters for space is the longest chain from the root, not the total.',
      },
      { kind: 'heading', text: 'Worked examples' },
      {
        kind: 'code',
        caption: 'Linear — O(n) time, O(n) space',
        code: `int sum(vector<int>& v, int i) {
    if (i == v.size()) return 0;
    return v[i] + sum(v, i + 1);
}
// n calls, O(1) work each, depth n`,
      },
      {
        kind: 'code',
        caption: 'Binary search — O(log n) time and space',
        code: `int search(vector<int>& v, int t, int lo, int hi) {
    if (lo > hi) return -1;
    int mid = lo + (hi - lo) / 2;
    if (v[mid] == t) return mid;
    return v[mid] < t ? search(v, t, mid + 1, hi) : search(v, t, lo, mid - 1);
}
// halving → log n calls`,
      },
      {
        kind: 'code',
        caption: 'Tree traversal — O(n) time, O(h) space',
        code: `int size(TreeNode* root) {
    if (!root) return 0;
    return 1 + size(root->left) + size(root->right);
}
// exactly one call per node → O(n) time
// depth = tree height → O(log n) if balanced, O(n) if degenerate`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Quote tree space as O(h), and say what h can be',
        body: 'Interviewers listen for this. A balanced tree gives h = log n, but a degenerate one — every node having only a right child — gives h = n. Saying "O(h), which is O(log n) balanced and O(n) worst case" is the complete answer, and it is also the case that overflows the stack on the judge.',
      },
      {
        kind: 'code',
        caption: 'Naive Fibonacci — O(2ⁿ) time, O(n) space',
        code: `int fib(int n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}
// each call spawns two → roughly 2^n calls
// but only n frames are ever alive at once`,
      },
      { kind: 'heading', text: 'Memoisation collapses the tree' },
      {
        kind: 'code',
        code: `int fib(int n, vector<int>& memo) {
    if (n <= 1) return n;
    if (memo[n] != -1) return memo[n];
    return memo[n] = fib(n - 1, memo) + fib(n - 2, memo);
}
// each distinct n computed once → O(n) time, O(n) space`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The memoisation rule of thumb',
        body: 'With memoisation, **time = number of distinct states × work per state**. For `fib` there are n states and O(1) work each, so O(n). For a 2D grid problem there are rows × cols states, so O(rows × cols). Counting the states is usually much easier than analysing the raw recursion tree, and it is exactly how you reason about dynamic programming.',
      },
      {
        kind: 'text',
        body: 'A practical consequence: `O(2ⁿ)` is only viable for n around 20, and `O(n!)` for n around 10. When constraints allow those small sizes, an exponential backtracking solution is usually the *intended* answer — the constraint is telling you what to write.',
      },
      {
        kind: 'table',
        headers: ['Constraint', 'What it suggests'],
        rows: [
          ['n ≤ 10', 'O(n!) — permutations'],
          ['n ≤ 20', 'O(2ⁿ) — subsets, bitmask DP'],
          ['n ≤ 10³', 'O(n²) is fine'],
          ['n ≤ 10⁵', 'O(n log n) or O(n)'],
          ['n ≤ 10⁹', 'O(log n) or O(1) — binary search or maths'],
        ],
      },
    ],
    keyTakeaways: [
      'Time = total calls × work per call; space = maximum depth.',
      '`fib` is O(2ⁿ) time but only O(n) space — frames free as calls return.',
      'Tree recursion is O(n) time and O(h) space, where h can be n in the worst case.',
      'With memoisation, time = distinct states × work per state.',
    ],
    practice: {
      prompt: 'Time naive `fib(35)` and then the memoised version — seconds versus instant. Then state the time and space of every recursive function you have written in this chapter, out loud, in the form "O(x) time, O(y) space because…". That sentence is what an interviewer expects immediately after you finish coding.',
      leetcode: { title: 'Climbing Stairs', slug: 'climbing-stairs' },
    },
  },
];
