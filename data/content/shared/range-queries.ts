import type { SharedLesson } from './types';

/**
 * Range Query Structures — Master dynamic range queries and point/range updates
 * across Fenwick trees (Binary Indexed Trees), Segment Trees with point updates
 * and lazy propagation, and Sparse Tables for static range-minimum queries.
 */
export const lessons: SharedLesson[] = [
  // =========================================================================
  // Lesson 1: Prefix sums vs updates: the problem these solve
  // =========================================================================
  {
    sub: 1,
    summary: 'Understand why static prefix sums fail under updates and how tree structures balance operations.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A range query asks for an aggregate value—such as sum, minimum, or maximum—over an interval `[L, R]`. On a static array, a prefix sum array precomputes cumulative totals in O(N) time, allowing range sum queries in O(1) time via `pref[R + 1] - pref[L]`. However, many problems involve updates: modifying values after queries begin.',
      },
      { kind: 'heading', text: 'The update penalty' },
      {
        kind: 'text',
        body: 'Modifying `arr[i]` invalidates all prefix sums from `i + 1` to `N`, requiring O(N) time to rebuild. A raw array updates in O(1) time but answers range queries in O(N) time. Under `Q` mixed updates and queries, both naive approaches degrade to O(Q * N) overall runtime. Tree-based structures balance both operations in O(log N) time.',
      },
      {
        kind: 'code',
        caption: 'The update penalty in dynamic prefix sums',
        code: {
          cpp: `// O(1) query, but O(N) update penalty
int query(const vector<int>& pref, int l, int r) {
    return pref[r + 1] - pref[l];
}

void update(vector<int>& arr, vector<int>& pref, int idx, int val) {
    int diff = val - arr[idx];
    arr[idx] = val;
    for (int i = idx + 1; i < (int)pref.size(); i++) {
        pref[i] += diff; // O(N) penalty per update
    }
}`,
          java: `// O(1) query, but O(N) update penalty
public static int query(int[] pref, int l, int r) {
    return pref[r + 1] - pref[l];
}

public static void update(int[] arr, int[] pref, int idx, int val) {
    int diff = val - arr[idx];
    arr[idx] = val;
    for (int i = idx + 1; i < pref.length; i++) {
        pref[i] += diff; // O(N) penalty per update
    }
}`,
          python: `# O(1) query, but O(N) update penalty
def query(pref: list[int], l: int, r: int) -> int:
    return pref[r + 1] - pref[l]

def update(arr: list[int], pref: list[int], idx: int, val: int) -> None:
    diff = val - arr[idx]
    arr[idx] = val
    for i in range(idx + 1, len(pref)):
        pref[i] += diff  # O(N) penalty per update`,
        },
      },
      {
        kind: 'table',
        headers: ['Structure', 'Point Update', 'Range Query', 'Total Time (Q ops)'],
        rows: [
          ['Raw Array', 'O(1)', 'O(N)', 'O(Q * N)'],
          ['Prefix Sums', 'O(N)', 'O(1)', 'O(Q * N)'],
          ['Fenwick Tree', 'O(log N)', 'O(log N)', 'O(Q log N)'],
          ['Segment Tree', 'O(log N)', 'O(log N)', 'O(Q log N)'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Using prefix sums on mutable arrays',
        body: 'A common mistake is using prefix sums when values change between queries. With 10^5 elements and 10^5 updates, rebuilding prefix sums requires 10^10 operations, triggering Time Limit Exceeded. Prefix sums are strictly for static arrays.',
      },
    ],
    keyTakeaways: [
      'Static prefix sums give O(1) queries but cost O(N) per point update.',
      'Raw arrays allow O(1) updates but cost O(N) per range query.',
      'Interleaved queries and updates cause both naive methods to run in O(Q * N) time.',
      'Fenwick and segment trees balance both operations to O(log N) time.',
    ],
    practice: {
      prompt: 'Measure the update cost by writing a class that maintains prefix sums and benchmarks recomputing entries when index 0 updates.',
      leetcode: { title: 'Range Sum Query - Immutable', slug: 'range-sum-query-immutable' },
    },
  },

  // =========================================================================
  // Lesson 2: Fenwick tree: point update
  // =========================================================================
  {
    sub: 2,
    summary: 'Update values in a Fenwick tree in logarithmic time using least significant bit arithmetic.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A **Fenwick tree** (Binary Indexed Tree) stores partial sums in a 1D array of size `N + 1` with 1-based indexing. Unlike explicit trees with pointers, index arithmetic in binary governs all parent-child navigation.',
      },
      { kind: 'heading', text: 'The lowbit operation' },
      {
        kind: 'text',
        body: 'Each index `i` stores the sum of `lowbit(i) = i & (-i)` elements ending at `i`. In two\'s complement binary, `-i` equals `~i + 1`, so `i & (-i)` isolates the lowest set bit. For example, `12` is `1100_2`. `12 & (-12)` evaluates to `4`, meaning `tree[12]` covers 4 elements (`arr[9..12]`). Point updates add `delta` to index `i` and repeatedly add `lowbit(i)` to ascend covering nodes in O(log N) steps.',
      },
      {
        kind: 'code',
        caption: 'Fenwick tree point update via lowbit propagation',
        code: {
          cpp: `// Add delta to 1-based index i in O(log N) time
void add(vector<int>& tree, int n, int i, int delta) {
    while (i <= n) {
        tree[i] += delta;
        i += i & (-i); // advance to next covering ancestor
    }
}`,
          java: `// Add delta to 1-based index i in O(log N) time
public static void add(int[] tree, int n, int i, int delta) {
    while (i <= n) {
        tree[i] += delta;
        i += i & (-i); // advance to next covering ancestor
    }
}`,
          python: `# Add delta to 1-based index i in O(log N) time
def add(tree: list[int], n: int, i: int, delta: int) -> None:
    while i <= n:
        tree[i] += delta
        i += i & (-i)  # advance to next covering ancestor`,
        },
      },
      {
        kind: 'table',
        headers: ['Property', 'Expression', 'Complexity', 'Significance'],
        rows: [
          ['Lowest Set Bit', 'i & (-i)', 'O(1)', 'Interval length stored at index i'],
          ['Next Ancestor', 'i + (i & -i)', 'O(1)', 'Next index whose range covers i'],
          ['Tree Height', 'floor(log2 N)', 'O(1)', 'Maximum set bits in index <= N'],
          ['Update Time', 'O(log N)', 'O(log N)', 'Visits at most log2(N) nodes to the root'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Passing index 0 causes an infinite loop',
        body: 'A Fenwick tree strictly requires 1-based indexing. Passing 0 into add() evaluates 0 & (-0) = 0, turning i += lowbit(i) into i += 0, which freezes execution in an infinite loop. Always shift 0-indexed inputs by adding 1 before calling Fenwick operations.',
      },
    ],
    keyTakeaways: [
      'Fenwick trees store cumulative intervals in a 1-based array of size N + 1.',
      'The lowest set bit i & (-i) determines how many elements index i covers.',
      'Point updates ascend to covering ancestors in O(log N) steps via i += i & (-i).',
      'Index 0 must never be accessed because lowbit(0) is 0, causing infinite loops.',
    ],
    practice: {
      prompt: 'Construct a Fenwick tree of size N + 1 and insert all elements of an input array by calling add with 1-based indices.',
      leetcode: { title: 'Range Sum Query - Mutable', slug: 'range-sum-query-mutable' },
    },
  },

  // =========================================================================
  // Lesson 3: Fenwick tree: prefix and range query
  // =========================================================================
  {
    sub: 3,
    summary: 'Query prefix and arbitrary range sums on a Fenwick tree in logarithmic time by stripping lowest set bits.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'While point update ascends the Fenwick tree by adding `lowbit(i)`, a prefix query descends toward index 0 by stripping the lowest set bit: `i -= i & (-i)`. Each subtraction removes the lowest 1-bit, adding `tree[i]` to a running sum. Because an index has at most `floor(log2 N) + 1` set bits, a prefix query finishes in O(log N) steps.',
      },
      { kind: 'heading', text: 'Range sums via prefix subtraction' },
      {
        kind: 'text',
        body: 'A Fenwick tree evaluates prefix sums `1..i`. An arbitrary range sum over `[L, R]` is obtained by prefix subtraction: `queryPrefix(R) - queryPrefix(L - 1)`. When `L = 1`, `queryPrefix(0)` returns 0 without entering the loop. Both prefix and range queries execute in O(log N) time.',
      },
      {
        kind: 'code',
        caption: 'Fenwick tree prefix and range sum queries',
        code: {
          cpp: `int queryPrefix(const vector<int>& tree, int i) {
    int sum = 0;
    while (i > 0) {
        sum += tree[i];
        i -= i & (-i); // strip lowest set bit
    }
    return sum;
}

int queryRange(const vector<int>& tree, int l, int r) {
    return queryPrefix(tree, r) - queryPrefix(tree, l - 1);
}`,
          java: `public static int queryPrefix(int[] tree, int i) {
    int sum = 0;
    while (i > 0) {
        sum += tree[i];
        i -= i & (-i); // strip lowest set bit
    }
    return sum;
}

public static int queryRange(int[] tree, int l, int r) {
    return queryPrefix(tree, r) - queryPrefix(tree, l - 1);
}`,
          python: `def query_prefix(tree: list[int], i: int) -> int:
    total = 0
    while i > 0:
        total += tree[i]
        i -= i & (-i)  # strip lowest set bit
    return total

def query_range(tree: list[int], l: int, r: int) -> int:
    return query_prefix(tree, r) - query_prefix(tree, l - 1)`,
        },
      },
      {
        kind: 'table',
        headers: ['Operation', 'Index Step', 'Time', 'Space'],
        rows: [
          ['Prefix Query (1..i)', 'i -= i & (-i) toward 0', 'O(log N)', 'O(1)'],
          ['Range Query (L..R)', 'pref(R) - pref(L - 1)', 'O(log N)', 'O(1)'],
          ['Point Update', 'i += i & (-i) toward N', 'O(log N)', 'O(1)'],
          ['Array Storage', 'Contiguous flat array', 'O(1)', 'O(N)'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Fenwick range queries require invertible operations',
        body: 'A Fenwick tree answers arbitrary range queries [L, R] because addition has an algebraic inverse: subtraction. For operations without an inverse—such as range minimum, maximum, or greatest common divisor—subtracting prefix(L - 1) is undefined. Use a segment tree or sparse table when operations lack an inverse.',
      },
    ],
    keyTakeaways: [
      'Prefix queries subtract i & (-i) to descend toward index 0 in O(log N) time.',
      'Range sum queries evaluate as queryPrefix(R) - queryPrefix(L - 1).',
      'Fenwick trees require invertible operations like addition and XOR.',
      'Non-invertible operations like range minimum require segment trees or sparse tables.',
    ],
    practice: {
      prompt: 'Implement a mutable range sum structure using a Fenwick tree that handles 0-indexed updates and sum queries.',
      leetcode: { title: 'Range Sum Query - Mutable', slug: 'range-sum-query-mutable' },
    },
  },

  // =========================================================================
  // Lesson 4: Segment tree: build
  // =========================================================================
  {
    sub: 4,
    summary: 'Construct a segment tree in linear time by recursively dividing intervals and merging child nodes into a 4N array.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A **segment tree** is a binary tree where every node represents an interval `[L, R]` of an array. The root covers `[0, N - 1]`. Any node with `L < R` bisects at `mid = L + (R - L) / 2`. The left child covers `[L, mid]` and the right child covers `[mid + 1, R]`. Leaf nodes occur when `L == R`, holding individual array elements.',
      },
      { kind: 'heading', text: 'Flat array layout and 4N allocation' },
      {
        kind: 'text',
        body: 'Segment trees are stored in flat arrays: node `p` has left child `2 * p + 1` and right child `2 * p + 2` (0-indexed). Although an array of size `N` creates `2 * N - 1` active nodes, the tree is not complete when `N` is not an exact power of 2. Child indices can reach up to `4 * N`. Allocating `4 * N` elements guarantees that index calculations stay within bounds.',
      },
      {
        kind: 'code',
        caption: 'Recursive segment tree build in O(N) time',
        code: {
          cpp: `void build(const vector<int>& arr, vector<int>& tree, int node, int l, int r) {
    if (l == r) {
        tree[node] = arr[l];
        return;
    }
    int mid = l + (r - l) / 2;
    build(arr, tree, 2 * node + 1, l, mid);
    build(arr, tree, 2 * node + 2, mid + 1, r);
    tree[node] = tree[2 * node + 1] + tree[2 * node + 2]; // merge
}`,
          java: `public static void build(int[] arr, int[] tree, int node, int l, int r) {
    if (l == r) {
        tree[node] = arr[l];
        return;
    }
    int mid = l + (r - l) / 2;
    build(arr, tree, 2 * node + 1, l, mid);
    build(arr, tree, 2 * node + 2, mid + 1, r);
    tree[node] = tree[2 * node + 1] + tree[2 * node + 2]; // merge
}`,
          python: `def build(arr: list[int], tree: list[int], node: int, l: int, r: int) -> None:
    if l == r:
        tree[node] = arr[l]
        return
    mid = l + (r - l) // 2
    build(arr, tree, 2 * node + 1, l, mid)
    build(arr, tree, 2 * node + 2, mid + 1, r)
    tree[node] = tree[2 * node + 1] + tree[2 * node + 2]  # merge`,
        },
      },
      {
        kind: 'table',
        headers: ['Property', 'Value', 'Significance'],
        rows: [
          ['Leaves', 'N', 'Each leaf stores one array element'],
          ['Internal Nodes', 'N - 1', 'Every full binary tree has N - 1 internal nodes'],
          ['Array Capacity', '4N', 'Accommodates indexing gaps in implicit binary representation'],
          ['Build Complexity', 'O(N)', 'Each node is visited and computed exactly once'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Allocating 2N space instead of 4N causes crashes',
        body: 'Because there are 2 * N - 1 nodes, beginners often allocate 2 * N space. When N is not a power of 2, the tree contains index gaps. For N = 5, tree height is 3 and the right child of index 5 is placed at 2 * 5 + 2 = 12. Sizing the array to 2 * 5 = 10 causes an out-of-bounds error. Always allocate 4 * N space.',
      },
    ],
    keyTakeaways: [
      'A segment tree divides intervals at midpoints until leaf intervals [i, i] are reached.',
      'Internal nodes store the merged value of their left and right children.',
      'Building the entire tree takes O(N) time during post-order traversal.',
      'Always allocate 4 * N elements in flat arrays to prevent out-of-bounds access.',
    ],
    practice: {
      prompt: 'Write a recursive build function for a segment tree that computes range minimums: leaves store arr[l], and internal nodes store min(left, right).',
      leetcode: { title: 'Range Sum Query - Immutable', slug: 'range-sum-query-immutable' },
    },
  },

  // =========================================================================
  // Lesson 5: Segment tree: query
  // =========================================================================
  {
    sub: 5,
    summary: 'Answer range queries in O(log N) time by classifying node intervals into disjoint, contained, or overlapping cases.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A range query seeks the aggregate result over an arbitrary subsegment `[ql, qr]`. The segment tree traverses downward starting at the root `[0, N - 1]`. At each node covering `[l, r]`, the query evaluates how `[l, r]` relates to `[ql, qr]`.',
      },
      { kind: 'heading', text: 'The three interval conditions' },
      {
        kind: 'text',
        body: 'Every visited node falls into one of three cases. If `[l, r]` is disjoint from `[ql, qr]` (`r < ql` or `l > qr`), return the identity element (0 for sum, infinity for min). If `[l, r]` is completely contained within `[ql, qr]` (`ql <= l && r <= qr`), return `tree[node]` immediately. If `[l, r]` partially overlaps, recurse into both children and merge their results.',
      },
      {
        kind: 'code',
        caption: 'Segment tree range query with identity base case',
        code: {
          cpp: `int query(const vector<int>& tree, int node, int l, int r, int ql, int qr) {
    if (r < ql || l > qr) return 0; // disjoint
    if (ql <= l && r <= qr) return tree[node]; // contained
    int mid = l + (r - l) / 2;
    return query(tree, 2 * node + 1, l, mid, ql, qr) +
           query(tree, 2 * node + 2, mid + 1, r, ql, qr);
}`,
          java: `public static int query(int[] tree, int node, int l, int r, int ql, int qr) {
    if (r < ql || l > qr) return 0; // disjoint
    if (ql <= l && r <= qr) return tree[node]; // contained
    int mid = l + (r - l) / 2;
    return query(tree, 2 * node + 1, l, mid, ql, qr) +
           query(tree, 2 * node + 2, mid + 1, r, ql, qr);
}`,
          python: `def query(tree: list[int], node: int, l: int, r: int, ql: int, qr: int) -> int:
    if r < ql or l > qr:
        return 0  # disjoint
    if ql <= l and r <= qr:
        return tree[node]  # contained
    mid = l + (r - l) // 2
    return (query(tree, 2 * node + 1, l, mid, ql, qr) +
            query(tree, 2 * node + 2, mid + 1, r, ql, qr))`,
        },
      },
      {
        kind: 'table',
        headers: ['Level', 'Max Nodes Visited', 'Explanation'],
        rows: [
          ['Root Level', '1', 'Query always begins at root node'],
          ['Interior Levels', '<= 4', 'Only nodes straddling boundary points ql or qr split'],
          ['Total Nodes', '<= 4 * ceil(log2 N)', 'Constant factor multiplied by logarithmic depth'],
          ['Query Runtime', 'O(log N)', 'Strictly bounded by tree height regardless of range width'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Returning 0 as identity for range minimum queries',
        body: 'When querying range minimums, returning 0 for disjoint segments returns incorrect results whenever all array elements are positive. The disjoint case must always return the mathematical identity: 0 for sum, positive infinity for minimum, and negative infinity for maximum.',
      },
    ],
    keyTakeaways: [
      'Range queries test disjoint (return identity), contained (return value), or overlap (branch).',
      'At most 4 nodes are visited at each level, bounding query time to O(log N).',
      'Disjoint branches must return the mathematical identity for the merge operator.',
      'Segment trees support non-invertible associative operations such as min, max, and GCD.',
    ],
    practice: {
      prompt: 'Write a range minimum query function that returns positive infinity on disjoint intervals and merges children using min.',
      leetcode: { title: 'Range Sum Query - Mutable', slug: 'range-sum-query-mutable' },
    },
  },

  // =========================================================================
  // Lesson 6: Segment tree: point update
  // =========================================================================
  {
    sub: 6,
    summary: 'Update an element in a segment tree in O(log N) time by descending a single path to a leaf and recalculating ancestors.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A **point update** modifies an individual value at index `idx`. Because segment tree intervals partition the array disjointly at each level, `idx` belongs to exactly one child at every internal node. The update descends a single path from the root directly to the target leaf where `l == r == idx`.',
      },
      { kind: 'heading', text: 'Single-path descent and post-order pull' },
      {
        kind: 'text',
        body: 'If `idx <= mid`, the target element resides in the left subtree; otherwise, it resides in the right subtree. Only one child is visited at each level. As recursive calls return, `tree[node] = tree[leftChild] + tree[rightChild]`. This post-order pull ensures that all ancestor intervals covering `idx` reflect the updated value in O(log N) total time.',
      },
      {
        kind: 'code',
        caption: 'Segment tree point update with upward pull',
        code: {
          cpp: `void update(vector<int>& tree, int node, int l, int r, int idx, int val) {
    if (l == r) {
        tree[node] = val;
        return;
    }
    int mid = l + (r - l) / 2;
    if (idx <= mid) {
        update(tree, 2 * node + 1, l, mid, idx, val);
    } else {
        update(tree, 2 * node + 2, mid + 1, r, idx, val);
    }
    tree[node] = tree[2 * node + 1] + tree[2 * node + 2]; // pull
}`,
          java: `public static void update(int[] tree, int node, int l, int r, int idx, int val) {
    if (l == r) {
        tree[node] = val;
        return;
    }
    int mid = l + (r - l) / 2;
    if (idx <= mid) {
        update(tree, 2 * node + 1, l, mid, idx, val);
    } else {
        update(tree, 2 * node + 2, mid + 1, r, idx, val);
    }
    tree[node] = tree[2 * node + 1] + tree[2 * node + 2]; // pull
}`,
          python: `def update(tree: list[int], node: int, l: int, r: int, idx: int, val: int) -> None:
    if l == r:
        tree[node] = val
        return
    mid = l + (r - l) // 2
    if idx <= mid:
        update(tree, 2 * node + 1, l, mid, idx, val)
    else:
        update(tree, 2 * node + 2, mid + 1, r, idx, val)
    tree[node] = tree[2 * node + 1] + tree[2 * node + 2]  # pull`,
        },
      },
      {
        kind: 'table',
        headers: ['Phase', 'Action', 'Nodes Visited', 'Complexity'],
        rows: [
          ['Descent Phase', 'Check if idx <= mid; branch left or right', 'ceil(log2 N)', 'O(log N)'],
          ['Leaf Base Case', 'Assign new value at leaf where l == r == idx', '1', 'O(1)'],
          ['Ascent Pull', 'Merge updated child values into ancestor', 'ceil(log2 N)', 'O(log N)'],
          ['Total Work', 'Single path from root to leaf and back', '2 * ceil(log2 N)', 'O(log N)'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Failing to recalculate ancestors during recursion unwinding',
        body: 'A common bug is setting tree[node] = val at the leaf but omitting the pull step tree[node] = tree[left] + tree[right] after the recursive call. Without updating ancestor nodes, the leaf change remains isolated, and subsequent range queries terminating higher in the tree read stale values.',
      },
    ],
    keyTakeaways: [
      'Point updates descend a single path because each index belongs to one child.',
      'The leaf is modified when l == r == idx, followed by upward recomputation.',
      'Point update visits at most 2 * ceil(log2 N) nodes, guaranteeing O(log N) runtime.',
      'Recomputing ancestors during unwinding keeps all parent intervals accurate.',
    ],
    practice: {
      prompt: 'Combine build, query, and point update into a complete SegmentTree class that implements LeetCode 307 Range Sum Query - Mutable.',
      leetcode: { title: 'Range Sum Query - Mutable', slug: 'range-sum-query-mutable' },
    },
  },

  // =========================================================================
  // Lesson 7: Lazy propagation
  // =========================================================================
  {
    sub: 7,
    summary: 'Apply range updates in O(log N) time using lazy propagation tags and on-demand push-down.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Applying a range update (e.g. adding `v` to every element in `[ql, qr]`) using point updates takes `O((R - L + 1) log N)` time, degrading to O(N log N) across the whole array. **Lazy propagation** defers updates: when a node interval `[l, r]` is completely enclosed within `[ql, qr]`, we update `tree[node]` immediately, store the pending delta in `lazy[node]`, and return without visiting its children.',
      },
      { kind: 'heading', text: 'The push-down mechanism' },
      {
        kind: 'text',
        body: 'A lazy tag represents work applied to `tree[node]` but not yet propagated to its children. Whenever recursion needs to descend into child nodes during a subsequent update or query, the node calls `pushDown(node, l, r)`. This transfers the pending tag to the left and right children, adjusts their tree values according to their segment lengths, and resets `lazy[node] = 0`.',
      },
      {
        kind: 'code',
        caption: 'Lazy propagation push-down and range update',
        code: {
          cpp: `void pushDown(vector<long long>& tree, vector<long long>& lazy, int node, int l, int r) {
    if (lazy[node] == 0 || l == r) return;
    int mid = l + (r - l) / 2;
    int left = 2 * node + 1, right = 2 * node + 2;
    lazy[left] += lazy[node];
    tree[left] += lazy[node] * (mid - l + 1);
    lazy[right] += lazy[node];
    tree[right] += lazy[node] * (r - mid);
    lazy[node] = 0;
}

void updateRange(vector<long long>& tree, vector<long long>& lazy, int node, int l, int r, int ql, int qr, long long val) {
    if (ql <= l && r <= qr) {
        tree[node] += val * (r - l + 1);
        lazy[node] += val;
        return;
    }
    pushDown(tree, lazy, node, l, r);
    int mid = l + (r - l) / 2;
    if (ql <= mid) updateRange(tree, lazy, 2 * node + 1, l, mid, ql, qr, val);
    if (qr > mid) updateRange(tree, lazy, 2 * node + 2, mid + 1, r, ql, qr, val);
    tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
}`,
          java: `public static void pushDown(long[] tree, long[] lazy, int node, int l, int r) {
    if (lazy[node] == 0 || l == r) return;
    int mid = l + (r - l) / 2;
    int left = 2 * node + 1, right = 2 * node + 2;
    lazy[left] += lazy[node];
    tree[left] += lazy[node] * (mid - l + 1);
    lazy[right] += lazy[node];
    tree[right] += lazy[node] * (r - mid);
    lazy[node] = 0;
}

public static void updateRange(long[] tree, long[] lazy, int node, int l, int r, int ql, int qr, long val) {
    if (ql <= l && r <= qr) {
        tree[node] += val * (r - l + 1);
        lazy[node] += val;
        return;
    }
    pushDown(tree, lazy, node, l, r);
    int mid = l + (r - l) / 2;
    if (ql <= mid) updateRange(tree, lazy, 2 * node + 1, l, mid, ql, qr, val);
    if (qr > mid) updateRange(tree, lazy, 2 * node + 2, mid + 1, r, ql, qr, val);
    tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
}`,
          python: `def push_down(tree: list[int], lazy: list[int], node: int, l: int, r: int) -> None:
    if lazy[node] == 0 or l == r:
        return
    mid = l + (r - l) // 2
    left, right = 2 * node + 1, 2 * node + 2
    lazy[left] += lazy[node]
    tree[left] += lazy[node] * (mid - l + 1)
    lazy[right] += lazy[node]
    tree[right] += lazy[node] * (r - mid)
    lazy[node] = 0

def update_range(tree: list[int], lazy: list[int], node: int, l: int, r: int, ql: int, qr: int, val: int) -> None:
    if ql <= l and r <= qr:
        tree[node] += val * (r - l + 1)
        lazy[node] += val
        return
    push_down(tree, lazy, node, l, r)
    mid = l + (r - l) // 2
    if ql <= mid:
        update_range(tree, lazy, 2 * node + 1, l, mid, ql, qr, val)
    if qr > mid:
        update_range(tree, lazy, 2 * node + 2, mid + 1, r, ql, qr, val)
    tree[node] = tree[2 * node + 1] + tree[2 * node + 2]`,
        },
      },
      {
        kind: 'table',
        headers: ['Operation', 'Standard Segment Tree', 'Lazy Segment Tree', 'Benefit'],
        rows: [
          ['Point Update', 'O(log N)', 'O(log N)', 'Single branch traversal remains identical'],
          ['Range Update', 'O(N log N)', 'O(log N)', 'Stops at canonical subsegments without visiting leaves'],
          ['Range Query', 'O(log N)', 'O(log N)', 'Pushes down pending tags on demand'],
          ['Memory Footprint', '4N array', 'Two 4N arrays', 'Adds one secondary array for pending tags'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Multiplying pending deltas by interval length',
        body: 'When adding delta v to a range sum node covering [l, r], the node aggregate increases by v * (r - l + 1). Adding v without multiplying by segment length is the most frequent error in lazy segment trees. For range minimum or maximum queries, an addition shifts the extrema by v directly without multiplying by segment length.',
      },
    ],
    keyTakeaways: [
      'Lazy propagation defers updates by storing tags at canonical nodes without visiting leaves.',
      'Before descending into children during updates or queries, pushDown flushes pending tags.',
      'Range sum updates must multiply the pending delta by segment length (r - l + 1).',
      'Lazy segment trees support both range updates and range queries in O(log N) time.',
    ],
    practice: {
      prompt: 'Adapt pushDown for a lazy segment tree supporting range addition and range maximum: increment child values by lazy[node] directly without multiplying by segment length.',
      leetcode: { title: 'Falling Squares', slug: 'falling-squares' },
    },
  },

  // =========================================================================
  // Lesson 8: Sparse table for range-minimum queries
  // =========================================================================
  {
    sub: 8,
    summary: 'Precompute static range minimum queries in O(N log N) time and answer queries in true O(1) time using idempotent intervals.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'When an array is static and the query operator is **idempotent**—satisfying `op(x, x) = x`, such as `min`, `max`, or greatest common divisor—a **sparse table** provides true O(1) query time. Precomputing values for all power-of-two interval lengths (1, 2, 4, 8, ...) requires O(N log N) preprocessing time and memory. Any subsequent range query is answered in constant time using two overlapping power-of-two intervals.',
      },
      { kind: 'heading', text: 'The table recurrence and overlapping intervals' },
      {
        kind: 'text',
        body: 'Let `st[i][j]` store the minimum starting at index `i` with length `2^j`. The base case is `st[i][0] = arr[i]`. For `j > 0`: `st[i][j] = min(st[i][j - 1], st[i + 2^(j - 1)][j - 1])`. For query `[L, R]`, let `k = floor(log2(R - L + 1))`. The length `2^k` exceeds half the window length. Two intervals of length `2^k`—one starting at `L` and another ending at `R`—completely cover `[L, R]`. Because `min(x, x) = x`, overlap does not affect correctness: `queryMin(L, R) = min(st[L][k], st[R - 2^k + 1][k])`.',
      },
      {
        kind: 'code',
        caption: 'Sparse table build and O(1) query',
        code: {
          cpp: `void buildSparseTable(const vector<int>& arr, vector<vector<int>>& st, const vector<int>& lg) {
    int n = arr.size(), maxLog = lg[n] + 1;
    st.assign(n, vector<int>(maxLog));
    for (int i = 0; i < n; i++) st[i][0] = arr[i];
    for (int j = 1; j < maxLog; j++) {
        for (int i = 0; i + (1 << j) <= n; i++) {
            st[i][j] = min(st[i][j - 1], st[i + (1 << (j - 1))][j - 1]);
        }
    }
}

int queryMin(const vector<vector<int>>& st, const vector<int>& lg, int l, int r) {
    int k = lg[r - l + 1];
    return min(st[l][k], st[r - (1 << k) + 1][k]);
}`,
          java: `public static void buildSparseTable(int[] arr, int[][] st, int[] lg) {
    int n = arr.length, maxLog = lg[n] + 1;
    for (int i = 0; i < n; i++) st[i][0] = arr[i];
    for (int j = 1; j < maxLog; j++) {
        for (int i = 0; i + (1 << j) <= n; i++) {
            st[i][j] = Math.min(st[i][j - 1], st[i + (1 << (j - 1))][j - 1]);
        }
    }
}

public static int queryMin(int[][] st, int[] lg, int l, int r) {
    int k = lg[r - l + 1];
    return Math.min(st[l][k], st[r - (1 << k) + 1][k]);
}`,
          python: `def build_sparse_table(arr: list[int], lg: list[int]) -> list[list[int]]:
    n = len(arr)
    max_log = lg[n] + 1
    st = [[0] * max_log for _ in range(n)]
    for i in range(n):
        st[i][0] = arr[i]
    for j in range(1, max_log):
        for i in range(n - (1 << j) + 1):
            st[i][j] = min(st[i][j - 1], st[i + (1 << (j - 1))][j - 1])
    return st

def query_min(st: list[list[int]], lg: list[int], l: int, r: int) -> int:
    k = lg[r - l + 1]
    return min(st[l][k], st[r - (1 << k) + 1][k])`,
        },
      },
      {
        kind: 'table',
        headers: ['Metric', 'Sparse Table', 'Segment Tree', 'Comparison'],
        rows: [
          ['Build Time', 'O(N log N)', 'O(N)', 'Sparse table precalculates all power-of-two blocks'],
          ['Query Time', 'O(1)', 'O(log N)', 'Sparse table evaluates two indices without tree traversal'],
          ['Update Support', 'O(N log N) (Static only)', 'O(log N)', 'Sparse table cannot support dynamic updates'],
          ['Allowed Operations', 'Idempotent (min, max, gcd)', 'Any associative operator', 'Overlap tolerance requires op(x, x) = x'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Range sum queries on a sparse table cannot overlap',
        body: 'A sparse table achieves O(1) query time because min(x, x) = x. If you attempt range sum queries by adding two power-of-two intervals, overlapping elements are counted twice, producing an incorrect total. Answering range sums with a sparse table requires breaking the range into disjoint power-of-two pieces in O(log N) time, eliminating its speed advantage over prefix sums or Fenwick trees.',
      },
    ],
    keyTakeaways: [
      'Sparse tables answer range queries in true O(1) time after O(N log N) static preprocessing.',
      'Queries cover [L, R] using two overlapping intervals of length 2^k where k = floor(log2(len)).',
      'The O(1) query requires an idempotent operation where op(x, x) = x, such as min, max, or GCD.',
      'Sparse tables are strictly for immutable arrays; updates require rebuilding the table.',
    ],
    practice: {
      prompt: 'Precompute log values and initialize a 2D sparse table to query range maximum values on a static array in O(1) time.',
      leetcode: { title: 'Sliding Window Maximum', slug: 'sliding-window-maximum' },
    },
  },
];
