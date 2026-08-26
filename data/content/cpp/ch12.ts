import type { Lesson } from '../types';

/**
 * Chapter 12 — STL Container Adaptors.
 * stack, queue and priority_queue: restricted interfaces over existing
 * containers, and the backbone of DFS, BFS and every top-K problem.
 */
export const ch12: Lesson[] = [
  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-12.1',
    language: 'cpp',
    summary: 'Use LIFO access for bracket matching, monotonic stacks and iterative DFS.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'A **container adaptor** wraps an existing container and exposes a restricted interface. `stack` wraps a `deque` and offers only last-in-first-out access — no indexing, no iteration.',
      },
      {
        kind: 'code',
        code: `#include <stack>

stack<int> st;

st.push(1);       // add to the top        O(1)
st.push(2);
st.top();         // 2 — inspect, do NOT remove
st.pop();         // remove the top — returns VOID
st.size();
st.empty();`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'pop() returns nothing',
        body: '`int x = st.pop();` does not compile. You must read then remove: `int x = st.top(); st.pop();`. The split exists for exception-safety reasons, but the practical effect is that forgetting it is a universal first-time error. The same applies to `queue` and `priority_queue`.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'top() on an empty stack is undefined behaviour',
        body: 'It does not throw — it reads garbage or crashes. Always guard with `if (!st.empty())`. In loops the idiomatic form is `while (!st.empty() && condition)`, which short-circuits before touching `top()`.',
      },
      { kind: 'heading', text: 'Bracket matching — the classic' },
      {
        kind: 'code',
        code: `bool isValid(string s) {
    stack<char> st;
    for (char c : s) {
        if (c == '(' || c == '[' || c == '{') {
            st.push(c);
        } else {
            if (st.empty()) return false;            // closing with nothing open
            char open = st.top(); st.pop();
            if ((c == ')' && open != '(') ||
                (c == ']' && open != '[') ||
                (c == '}' && open != '{')) return false;
        }
    }
    return st.empty();       // anything left open means invalid
}`,
      },
      {
        kind: 'text',
        body: 'The final `return st.empty()` is the part people forget: `"((("` never fails a check inside the loop, so the leftover items are the only evidence it is invalid.',
      },
      { kind: 'heading', text: 'Monotonic stack — the pattern worth mastering' },
      {
        kind: 'code',
        caption: 'Next Greater Element',
        code: `vector<int> nextGreater(vector<int>& nums) {
    vector<int> result(nums.size(), -1);
    stack<int> st;                       // holds INDICES, values decreasing

    for (int i = 0; i < nums.size(); i++) {
        // Everything smaller than nums[i] has just found its next greater
        while (!st.empty() && nums[st.top()] < nums[i]) {
            result[st.top()] = nums[i];
            st.pop();
        }
        st.push(i);
    }
    return result;      // indices left in the stack keep -1
}`,
      },
      {
        kind: 'text',
        body: 'Each index is pushed once and popped at most once, so despite the inner `while` this is **O(n)**. Whenever a problem asks for "the next greater/smaller element" or "how far until something bigger", this is the shape.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Store indices, not values',
        body: 'The stack holds indices so you can write back to `result[st.top()]` and compute distances like `i - st.top()`. With values alone you lose the position. This is the same reasoning as the monotonic deque.',
      },
      { kind: 'heading', text: 'Iterative DFS' },
      {
        kind: 'code',
        code: `void dfs(TreeNode* root) {
    if (!root) return;
    stack<TreeNode*> st;
    st.push(root);

    while (!st.empty()) {
        TreeNode* node = st.top(); st.pop();
        cout << node->val << " ";

        // push right FIRST so left comes off the stack first
        if (node->right) st.push(node->right);
        if (node->left)  st.push(node->left);
    }
}`,
      },
      {
        kind: 'text',
        body: 'This is the rescue when recursion would overflow the stack: the pending nodes live in a heap-allocated `stack` instead of in call frames. Note the reversed push order — a stack returns things backwards, so pushing right first yields left-to-right visiting.',
      },
    ],
    keyTakeaways: [
      '`pop()` returns void — read `top()` first, then `pop()`.',
      '`top()` on an empty stack is undefined; always guard with `empty()`.',
      'Bracket matching must end with `return st.empty()`.',
      'Monotonic stacks store indices and run in O(n) despite the inner loop.',
    ],
    practice: {
      prompt: 'Solve Valid Parentheses, then Next Greater Element with a monotonic stack, then convert a recursive tree traversal to the iterative stack form. Then write `int x = st.pop();` once to see the error — it is the first mistake everyone makes with adaptors.',
      leetcode: { title: 'Valid Parentheses', slug: 'valid-parentheses' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-12.2',
    language: 'cpp',
    summary: 'Use FIFO access for BFS, level-order traversal and shortest paths.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'A queue is **first in, first out** — a supermarket queue. You add at the back and remove from the front. Where a stack goes deep, a queue goes **wide**, and that difference is exactly why BFS finds shortest paths while DFS does not.',
      },
      {
        kind: 'code',
        code: `#include <queue>

queue<int> q;

q.push(1);        // add at the back      O(1)
q.push(2);
q.front();        // 1 — the oldest element
q.back();         // 2 — the newest
q.pop();          // remove the FRONT — returns void
q.size();
q.empty();`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'front() to read, pop() to remove',
        body: 'Same split as `stack`, and the same first-time error. Note the asymmetry: `push` adds at the back, `pop` removes from the front. Reading `back()` is occasionally useful but rare.',
      },
      { kind: 'heading', text: 'BFS — the reason queue exists' },
      {
        kind: 'code',
        caption: 'Level-order traversal',
        code: `vector<vector<int>> levelOrder(TreeNode* root) {
    vector<vector<int>> result;
    if (!root) return result;

    queue<TreeNode*> q;
    q.push(root);

    while (!q.empty()) {
        int count = q.size();          // snapshot BEFORE the inner loop
        vector<int> level;

        for (int i = 0; i < count; i++) {
            TreeNode* node = q.front(); q.pop();
            level.push_back(node->val);
            if (node->left)  q.push(node->left);
            if (node->right) q.push(node->right);
        }
        result.push_back(level);
    }
    return result;
}`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Snapshot the size before processing a level',
        body: 'The inner loop pushes children, so `q.size()` grows while it runs. Writing `for (int i = 0; i < q.size(); i++)` re-reads the growing value and merges every level into one. Capturing `int count = q.size();` first is what separates the levels — the single most important line in this pattern.',
      },
      { kind: 'heading', text: 'BFS on a grid gives shortest paths' },
      {
        kind: 'code',
        code: `int shortestPath(vector<vector<int>>& grid) {
    int rows = grid.size(), cols = grid[0].size();
    queue<pair<int,int>> q;
    vector<vector<bool>> visited(rows, vector<bool>(cols, false));

    q.push({0, 0});
    visited[0][0] = true;
    int steps = 0;

    int dr[] = {-1, 1, 0, 0}, dc[] = {0, 0, -1, 1};

    while (!q.empty()) {
        int count = q.size();
        for (int i = 0; i < count; i++) {
            auto [r, c] = q.front(); q.pop();
            if (r == rows - 1 && c == cols - 1) return steps;

            for (int d = 0; d < 4; d++) {
                int nr = r + dr[d], nc = c + dc[d];
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols
                    && !visited[nr][nc] && grid[nr][nc] == 0) {
                    visited[nr][nc] = true;      // mark WHEN PUSHING
                    q.push({nr, nc});
                }
            }
        }
        steps++;             // one increment per level
    }
    return -1;
}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'BFS finds shortest paths; DFS does not',
        body: 'BFS explores in order of distance, so the first time it reaches a cell it has taken the fewest possible steps. DFS may reach the same cell by a long detour first. For "minimum number of steps/moves/transformations" on an unweighted graph, BFS is the answer — for weighted edges you need Dijkstra, which is BFS with a `priority_queue`.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Mark visited when you push, not when you pop',
        body: 'If you only mark on pop, a node can be pushed several times by different neighbours before it is first processed — the queue balloons and the same node is expanded repeatedly. On a large grid this alone can cause Time Limit Exceeded. Mark it the moment you enqueue it.',
      },
      {
        kind: 'text',
        body: 'One more variant worth knowing: multi-source BFS. Push *every* starting cell before the loop begins, and the traversal expands from all of them simultaneously — that is how "Rotting Oranges" and "01 Matrix" are solved in one pass.',
      },
    ],
    keyTakeaways: [
      '`push` adds at the back, `pop` removes from the front, `pop` returns void.',
      'Snapshot `q.size()` before the inner loop to keep levels separate.',
      'BFS gives shortest paths on unweighted graphs; DFS does not.',
      'Mark nodes visited when enqueuing, or they get processed repeatedly.',
    ],
    practice: {
      prompt: 'Write level-order traversal, then grid BFS for a shortest path. Then move the `visited` marking from push-time to pop-time and watch the queue grow — that experiment makes the reason for the rule obvious.',
      leetcode: { title: 'Rotting Oranges', slug: 'rotting-oranges' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-12.3',
    language: 'cpp',
    summary: 'Always get the largest or smallest element in O(log n) — the top-K workhorse.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: '`priority_queue` keeps its elements partially ordered so the highest-priority one is always at the top. By default that is the **largest** — a max-heap.',
      },
      {
        kind: 'code',
        code: `#include <queue>

priority_queue<int> pq;          // MAX-heap by default

pq.push(3);
pq.push(1);
pq.push(4);

pq.top();        // 4 — always the largest    O(1)
pq.pop();        // removes it                O(log n)
pq.push(x);      //                           O(log n)
pq.size();  pq.empty();`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'A priority_queue is not sorted, and cannot be iterated',
        body: 'Only `top()` is meaningful — the rest is in heap order, not sorted order, and there is no `begin()`/`end()`. To get everything in order you must pop repeatedly, which costs O(n log n) and empties the container. If you need to inspect all elements in order, you want `sort` or a `set`, not a heap.',
      },
      { kind: 'heading', text: 'Making a min-heap' },
      {
        kind: 'code',
        code: `// The long form
priority_queue<int, vector<int>, greater<int>> minHeap;

minHeap.push(3); minHeap.push(1); minHeap.push(4);
minHeap.top();       // 1 — the smallest

// The shortcut: negate on the way in and out
priority_queue<int> pq;
pq.push(-x);
int smallest = -pq.top();`,
      },
      {
        kind: 'text',
        body: 'The three template parameters are element type, underlying container, and comparator. You must spell out `vector<int>` even though it is the default, because the comparator comes third.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'greater gives a MIN-heap — the naming feels backwards',
        body: 'The comparator answers "does a have *lower* priority than b?". With `greater<int>`, larger values are ranked lower, so the smallest ends up on top. This inversion catches everyone at least once: whenever your heap hands you the wrong end, swapping `less` and `greater` is the fix.',
      },
      { kind: 'heading', text: 'Top-K — the pattern to memorise' },
      {
        kind: 'code',
        caption: 'K largest elements, in O(n log k)',
        code: `vector<int> topK(vector<int>& nums, int k) {
    priority_queue<int, vector<int>, greater<int>> minHeap;   // MIN-heap!

    for (int x : nums) {
        minHeap.push(x);
        if (minHeap.size() > k) minHeap.pop();    // drop the smallest
    }

    vector<int> result;
    while (!minHeap.empty()) { result.push_back(minHeap.top()); minHeap.pop(); }
    return result;
}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Use a min-heap to find the K largest',
        body: 'This is the counter-intuitive part. Keeping a min-heap of size k means the smallest of your current best k sits on top, so it is the cheapest to evict when something better arrives. The heap never exceeds k, giving O(n log k) time and O(k) space — better than sorting everything at O(n log n) when k is small.',
      },
      {
        kind: 'code',
        caption: 'Heaps of pairs',
        code: `// Sorts by .first, then .second — the default pair comparison
priority_queue<pair<int,int>> pq;
pq.push({count, value});
auto [c, v] = pq.top();

// Min-heap of pairs, for Dijkstra: (distance, node)
priority_queue<pair<int,int>, vector<pair<int,int>>, greater<pair<int,int>>> pq;
pq.push({0, start});`,
      },
      {
        kind: 'text',
        body: 'Putting the value you want to prioritise in `.first` lets you use the default pair ordering with no custom comparator — which is why Dijkstra is written with `(distance, node)` rather than `(node, distance)`.',
      },
      {
        kind: 'code',
        caption: 'Building from an existing container',
        code: `vector<int> v = {3, 1, 4};
priority_queue<int> pq(v.begin(), v.end());     // O(n), faster than n pushes`,
      },
    ],
    keyTakeaways: [
      '`priority_queue<int>` is a max-heap; `greater<int>` makes it a min-heap.',
      '`top()` is O(1); `push` and `pop` are O(log n). There is no iteration.',
      'For the K largest, keep a **min**-heap of size k: O(n log k).',
      'Heaps of pairs sort by `.first` — put the priority there.',
    ],
    practice: {
      prompt: 'Find the K largest elements with a size-k min-heap, then Kth Largest Element in an Array. Then build a max-heap and a min-heap of the same data and print the top of each — seeing `greater` produce the smallest is what fixes the naming inversion in your memory.',
      leetcode: { title: 'Kth Largest Element in an Array', slug: 'kth-largest-element-in-an-array' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-12.4',
    language: 'cpp',
    summary: 'Understand what a heap actually is, so its complexities stop being arbitrary.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'A binary heap is a **complete binary tree** — every level full except possibly the last, which fills left to right — satisfying the heap property: every parent is ≥ its children (max-heap) or ≤ them (min-heap).',
      },
      {
        kind: 'code',
        caption: 'A max-heap, and its array form',
        code: `            9
          /   \\
         7     6
        / \\   /
       3   5 2

array: [9, 7, 6, 3, 5, 2]

// Because the tree is complete, it packs into an array with no gaps:
parent(i)     = (i - 1) / 2
leftChild(i)  = 2*i + 1
rightChild(i) = 2*i + 2`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'A heap is an array, not a linked structure',
        body: 'That index arithmetic is why heaps are fast: no pointers, perfect cache locality, no allocation per element. `priority_queue` stores its data in a plain `vector` — the "tree" is entirely conceptual. This is also why building a heap from n elements is O(n) rather than O(n log n).',
      },
      { kind: 'heading', text: 'Why the operations cost what they do' },
      {
        kind: 'text',
        body: '**push** — put the new element at the end of the array, then "sift up": swap with its parent while it is larger. A complete tree of n nodes has height log n, so at most log n swaps. **O(log n)**.',
      },
      {
        kind: 'text',
        body: '**pop** — the root is the answer; move the last element into the root and "sift down", swapping with the larger child while it is smaller. Again at most log n swaps. **O(log n)**.',
      },
      {
        kind: 'text',
        body: '**top** — read index 0. **O(1)**.',
      },
      {
        kind: 'table',
        headers: ['Operation', 'Heap', 'Sorted `vector`', '`set`'],
        rows: [
          ['Get max/min', 'O(1)', 'O(1)', 'O(1)'],
          ['Insert', '**O(log n)**', 'O(n) — must shift', 'O(log n)'],
          ['Remove max/min', 'O(log n)', 'O(1) from the end', 'O(log n)'],
          ['Find an arbitrary value', 'O(n)', 'O(log n)', 'O(log n)'],
          ['Iterate in sorted order', '**Not possible**', 'O(n)', 'O(n)'],
        ],
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'A heap is only partially ordered',
        body: 'The heap property relates parents to children, not siblings. So `[9, 7, 6, 3, 5, 2]` is a valid heap even though it is not sorted — 5 sits after 3. That weaker guarantee is exactly what makes insertion O(log n) instead of O(n), and it is why you cannot iterate a heap in sorted order.',
      },
      { kind: 'heading', text: 'When to use a heap instead of sorting' },
      {
        kind: 'table',
        headers: ['Situation', 'Use'],
        rows: [
          ['Need only the top k of n, k ≪ n', 'Heap — O(n log k)'],
          ['Need everything in sorted order', '`sort` — O(n log n)'],
          ['Data arrives over time, need the max at any moment', 'Heap'],
          ['Need to search for arbitrary values too', '`set` or `map`'],
          ['Need the median as data streams in', 'Two heaps'],
        ],
      },
      {
        kind: 'code',
        caption: 'The two-heap median trick',
        code: `priority_queue<int> lower;                                    // max-heap, small half
priority_queue<int, vector<int>, greater<int>> upper;         // min-heap, large half

// Keep sizes balanced; the median is then at the top(s).
// median = lower.top() if sizes differ, else (lower.top() + upper.top()) / 2.0`,
      },
      {
        kind: 'text',
        body: 'Each half is a heap facing the middle, so both candidate medians are always at a `top()` — O(1) to read, O(log n) to insert. No other structure gives a streaming median that cheaply.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The raw heap algorithms exist too',
        body: '`<algorithm>` provides `make_heap`, `push_heap`, `pop_heap` and `sort_heap` for turning a `vector` into a heap directly. You rarely need them — `priority_queue` wraps exactly this — but `make_heap` is the O(n) bulk build, and knowing it exists explains why constructing a `priority_queue` from a range is cheaper than pushing one at a time.',
      },
    ],
    keyTakeaways: [
      'A heap is a complete binary tree stored in a flat array via index arithmetic.',
      'push/pop are O(log n) because the tree height is log n; `top` is O(1).',
      'Heaps are only partially ordered — no sorted iteration, no fast arbitrary search.',
      'Two opposing heaps give a streaming median in O(log n) per insert.',
    ],
    practice: {
      prompt: 'Draw the array `[9,7,6,3,5,2]` as a tree using the index formulas, then hand-simulate pushing 8 and popping the root. Then implement Find Median from Data Stream with two heaps — it is the clearest demonstration of heaps solving something sorting cannot do efficiently.',
      leetcode: { title: 'Find Median from Data Stream', slug: 'find-median-from-data-stream' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-12.5',
    language: 'cpp',
    summary: 'Order a heap by your own rule — and get the inverted comparison right.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Custom ordering is where `priority_queue` gets fiddly, because the comparator means the *opposite* of what it does in `sort`.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'The rule to internalise',
        body: 'For `sort`, `cmp(a,b)` means "**a comes before b**". For `priority_queue`, `cmp(a,b)` means "**a has lower priority than b**" — so whatever the comparator ranks *highest* ends up at `top()`. The consequence: `less` (the default) gives a max-heap, and `greater` gives a min-heap. It reads backwards, and that is simply how it is.',
      },
      { kind: 'heading', text: 'The three ways to write one' },
      {
        kind: 'code',
        caption: '1. Built-in — the common case',
        code: `priority_queue<int> maxHeap;                                    // largest on top
priority_queue<int, vector<int>, greater<int>> minHeap;         // smallest on top`,
      },
      {
        kind: 'code',
        caption: '2. A struct with operator() — a functor',
        code: `struct Compare {
    bool operator()(const pair<int,int>& a, const pair<int,int>& b) {
        return a.second > b.second;      // '>' → smaller .second has priority
    }
};

priority_queue<pair<int,int>, vector<pair<int,int>>, Compare> pq;`,
      },
      {
        kind: 'code',
        caption: '3. A lambda — needs decltype',
        code: `auto cmp = [](const pair<int,int>& a, const pair<int,int>& b) {
    return a.second > b.second;
};

priority_queue<pair<int,int>, vector<pair<int,int>>, decltype(cmp)> pq(cmp);
//                                                  ^ the type    ^ the object`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'A lambda must be passed twice',
        body: '`priority_queue` takes the comparator as a *type* parameter, but a lambda\'s type is unnameable — hence `decltype(cmp)` for the type and `pq(cmp)` to hand over the actual object. Forgetting the constructor argument gives a confusing error about no default constructor. (From C++20 stateless lambdas can be default-constructed, so `pq(cmp)` becomes optional — but write it anyway for portability.)',
      },
      { kind: 'heading', text: 'Worked example: Top K Frequent Elements' },
      {
        kind: 'code',
        code: `vector<int> topKFrequent(vector<int>& nums, int k) {
    unordered_map<int,int> freq;
    for (int x : nums) freq[x]++;

    // Min-heap by frequency: the LEAST frequent sits on top, ready to evict.
    auto cmp = [](const pair<int,int>& a, const pair<int,int>& b) {
        return a.second > b.second;
    };
    priority_queue<pair<int,int>, vector<pair<int,int>>, decltype(cmp)> pq(cmp);

    for (auto& [value, count] : freq) {
        pq.push({value, count});
        if (pq.size() > k) pq.pop();        // drop the least frequent
    }

    vector<int> result;
    while (!pq.empty()) { result.push_back(pq.top().first); pq.pop(); }
    return result;
}`,
      },
      {
        kind: 'text',
        body: 'Again a min-heap to find the largest k. The comparator uses `>` on `.second`, which — under the inverted rule — puts the *smallest* frequency on top, exactly the element you want to discard when the heap grows past k.',
      },
      { kind: 'heading', text: 'Multi-key ordering' },
      {
        kind: 'code',
        caption: 'By frequency descending, then alphabetically ascending',
        code: `auto cmp = [](const pair<string,int>& a, const pair<string,int>& b) {
    if (a.second != b.second) return a.second > b.second;   // lower count = lower priority
    return a.first < b.first;                               // tie: later alphabetically = lower
};`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Avoid the comparator entirely when you can',
        body: 'If you order by a single value, put it in `.first` of a pair and use the default: `priority_queue<pair<int,int>>` for max-by-first, or add `greater<>` for min-by-first. Dijkstra uses `(distance, node)` for exactly this reason. Reserve custom comparators for genuinely multi-key ordering.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'The comparison must be a strict weak ordering',
        body: 'Never return `true` when the two arguments are equal — using `>=` instead of `>` breaks the ordering contract and produces undefined behaviour, typically a crash deep inside the library. Use strict `<` or `>`, and handle ties by comparing a different field, as in the multi-key example above.',
      },
    ],
    keyTakeaways: [
      'For `priority_queue`, the comparator means "lower priority" — it reads inverted.',
      '`less` (default) → max-heap; `greater` → min-heap.',
      'Lambdas need `decltype(cmp)` as the type *and* `pq(cmp)` in the constructor.',
      'Never return true for equal elements — use strict `<` or `>`.',
    ],
    practice: {
      prompt: 'Solve Top K Frequent Elements with a size-k min-heap and a lambda comparator. Then flip the comparator to `<` and observe you get the k *least* frequent — running that experiment once is the fastest way to stop second-guessing which direction the comparator goes.',
      leetcode: { title: 'Top K Frequent Elements', slug: 'top-k-frequent-elements' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-12.6',
    language: 'cpp',
    summary: 'Match problem phrasing to the right adaptor, quickly and reliably.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'The three container adaptors look similar and solve genuinely different problems. This lesson is the decision table: what a problem statement says, and which adaptor that phrasing points at.',
      },
      {
        kind: 'table',
        headers: ['The problem says…', 'Use'],
        rows: [
          ['"valid parentheses", "matching brackets"', '`stack`'],
          ['"next greater/smaller element"', '`stack` (monotonic)'],
          ['"largest rectangle", "trapping rain water"', '`stack` (monotonic)'],
          ['"undo", "backtrack", "most recent"', '`stack`'],
          ['"level by level", "level order"', '`queue`'],
          ['"minimum steps", "shortest path", unweighted', '`queue` (BFS)'],
          ['"top k", "k largest", "k closest"', '`priority_queue` (size-k)'],
          ['"kth smallest/largest"', '`priority_queue`'],
          ['"merge k sorted lists"', '`priority_queue`'],
          ['"median from a data stream"', 'Two `priority_queue`s'],
          ['"shortest path with weights"', '`priority_queue` (Dijkstra)'],
          ['"sliding window maximum"', '`deque` (monotonic)'],
        ],
      },
      { kind: 'heading', text: 'Stack problems' },
      {
        kind: 'code',
        caption: 'Daily Temperatures — monotonic stack',
        code: `vector<int> dailyTemperatures(vector<int>& temps) {
    vector<int> result(temps.size(), 0);
    stack<int> st;                          // indices, temperatures decreasing

    for (int i = 0; i < temps.size(); i++) {
        while (!st.empty() && temps[st.top()] < temps[i]) {
            result[st.top()] = i - st.top();     // distance to a warmer day
            st.pop();
        }
        st.push(i);
    }
    return result;
}`,
      },
      {
        kind: 'text',
        body: 'Identical structure to Next Greater Element — only the stored result differs. Recognising that two problems share a skeleton is most of the speed benefit of pattern practice.',
      },
      { kind: 'heading', text: 'Queue problems' },
      {
        kind: 'code',
        caption: 'Multi-source BFS — Rotting Oranges',
        code: `int orangesRotting(vector<vector<int>>& grid) {
    int rows = grid.size(), cols = grid[0].size(), fresh = 0;
    queue<pair<int,int>> q;

    for (int r = 0; r < rows; r++)
        for (int c = 0; c < cols; c++) {
            if (grid[r][c] == 2) q.push({r, c});     // EVERY rotten orange starts
            else if (grid[r][c] == 1) fresh++;
        }

    int minutes = 0;
    int dr[] = {-1,1,0,0}, dc[] = {0,0,-1,1};

    while (!q.empty() && fresh > 0) {
        int count = q.size();
        for (int i = 0; i < count; i++) {
            auto [r, c] = q.front(); q.pop();
            for (int d = 0; d < 4; d++) {
                int nr = r + dr[d], nc = c + dc[d];
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols
                    && grid[nr][nc] == 1) {
                    grid[nr][nc] = 2;                 // mark on push
                    fresh--;
                    q.push({nr, nc});
                }
            }
        }
        minutes++;
    }
    return fresh == 0 ? minutes : -1;
}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Multi-source BFS: seed the queue with every start',
        body: 'Pushing all rotten oranges before the loop makes the wavefront expand from all of them at once, so the level count is the time for the last cell to be reached. The same trick solves 01 Matrix and Walls and Gates. Recognising "many starting points" as multi-source BFS rather than running one BFS per source turns O(n·m·k) into O(n·m).',
      },
      { kind: 'heading', text: 'Heap problems' },
      {
        kind: 'code',
        caption: 'Merge K Sorted Lists',
        code: `ListNode* mergeKLists(vector<ListNode*>& lists) {
    auto cmp = [](ListNode* a, ListNode* b) { return a->val > b->val; };  // min-heap
    priority_queue<ListNode*, vector<ListNode*>, decltype(cmp)> pq(cmp);

    for (ListNode* node : lists)
        if (node) pq.push(node);

    ListNode dummy(0);
    ListNode* tail = &dummy;

    while (!pq.empty()) {
        ListNode* node = pq.top(); pq.pop();
        tail->next = node;
        tail = tail->next;
        if (node->next) pq.push(node->next);      // refill from the same list
    }
    return dummy.next;
}`,
      },
      {
        kind: 'text',
        body: 'The heap holds at most k nodes — one per list — so each of the n total nodes costs O(log k), giving **O(n log k)**. Merging pairwise instead would be O(nk). Note the dummy head again, removing the special case for the first node.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The size-k heap is the single most reusable pattern here',
        body: 'Keep a heap capped at k, evicting from the top whenever it overflows. Min-heap for the k largest, max-heap for the k smallest. It appears in Top K Frequent, Kth Largest, K Closest Points and Merge K Lists — four common problems, one skeleton. Learn it once.',
      },
    ],
    keyTakeaways: [
      'Brackets and "next greater" → stack; level order and shortest path → queue.',
      '"Top k" or "kth largest" → a size-k heap, min-heap for the largest.',
      'Multi-source BFS seeds the queue with every starting cell.',
      'Merge K Sorted Lists is O(n log k) with a heap of k list heads.',
    ],
    practice: {
      prompt: 'Work through one problem per adaptor: Daily Temperatures (stack), Rotting Oranges (queue), and K Closest Points to Origin (heap). Then write the size-k heap skeleton from memory — it covers four common problems, so it is the highest-return thing in this chapter to have automatic.',
      leetcode: { title: 'K Closest Points to Origin', slug: 'k-closest-points-to-origin' },
    },
  },
];
