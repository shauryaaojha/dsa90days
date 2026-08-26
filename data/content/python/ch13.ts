import type { Lesson } from '../types';

/**
 * Python Chapter 13 — Trees and Graph Basics.
 * The structures behind roughly a third of all interview problems, written in
 * the nested-helper style that Python solutions actually use.
 */
export const ch13: Lesson[] = [
  // -------------------------------------------------------------------------
  {
    topicId: 'python-13.1',
    language: 'python',
    summary: 'Learn the tree vocabulary that problem statements assume you know.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Tree problems are written in a vocabulary the statement assumes you already have. Learning the eight or so terms below takes ten minutes and removes a surprising amount of confusion later.',
      },
      {
        kind: 'table',
        headers: ['Term', 'Meaning'],
        rows: [
          ['**Root**', 'The single node with no parent'],
          ['**Leaf**', 'A node with no children'],
          ['**Height**', 'Longest path from a node **down** to a leaf'],
          ['**Depth**', 'Distance from the **root** down to a node'],
          ['**Subtree**', 'A node together with all its descendants'],
          ['**Balanced**', 'Left and right heights differ by at most 1, everywhere'],
          ['**Complete**', 'Every level full except possibly the last, filled left to right'],
          ['**BST**', 'Left subtree all smaller, right subtree all larger'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Height and depth are measured in opposite directions',
        body: 'Depth counts **downward from the root**; height counts **upward from the leaves**. The root has depth 0 and maximum height; a leaf has height 0 and maximum depth. Problems use both words, and swapping them gives an answer that is wrong in a confusingly symmetric way.',
      },
      {
        kind: 'text',
        body: 'Two properties drive nearly every complexity claim. A **balanced** tree of n nodes has height about log₂ n — so a million nodes is only 20 levels deep. A **degenerate** tree (every node with one child) is really a linked list, with height n.',
      },
      {
        kind: 'code',
        caption: 'Why balance matters',
        code: `Balanced, 7 nodes, height 2:          Degenerate, 7 nodes, height 6:

        1                                     1
      /   \\                                     \\
     2     3                                     2
    / \\   / \\                                     \\
   4  5  6  7                                      3 ...

Search: O(log n)                          Search: O(n)
Recursion: 3 frames                       Recursion: 7 frames -> overflows at 1000`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'A skewed tree breaks Python recursion',
        body: 'Recursion depth equals tree height. Python\'s default limit is 1000 frames, so a degenerate tree of 10⁵ nodes raises `RecursionError`. When a problem warns that the tree may be skewed, that is the hint to go iterative or raise the limit.',
      },
      {
        kind: 'text',
        body: 'The BST property is the other one worth internalising: **everything** in the left subtree is smaller, not merely the immediate child. That distinction is exactly what makes validating a BST harder than it first looks.',
      },
    ],
    keyTakeaways: [
      'Depth counts down from the root; height counts up from the leaves.',
      'Balanced height is ~log₂ n; degenerate height is n.',
      'Recursion depth equals tree height — a skewed tree overflows.',
      'A BST orders the whole subtree, not just the immediate children.',
    ],
    practice: {
      prompt: 'Draw a 7-node balanced tree and a 7-node degenerate one. Label every node with its depth and its height, and confirm the two run in opposite directions.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-13.2',
    language: 'python',
    summary: 'Work with TreeNode and the nested-helper shape Python solutions use.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'LeetCode gives you the node class. What is worth learning is the **shape** of a Python tree solution: a nested helper function inside the method, closing over anything it needs.',
      },
      {
        kind: 'code',
        code: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val, self.left, self.right = val, left, right`,
      },
      {
        kind: 'code',
        caption: 'The standard Python solution shape',
        code: `class Solution:
    def maxDepth(self, root):
        def dfs(node):                  # nested — no self parameter
            if not node:
                return 0
            return 1 + max(dfs(node.left), dfs(node.right))

        return dfs(root)`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Why nest the helper',
        body: 'A nested function can read the enclosing scope, so `res`, `grid` and `target` need not be passed down through every recursive call. That is the whole reason this shape dominates Python solutions — it removes parameter noise entirely.',
      },
      {
        kind: 'code',
        caption: 'Closing over a result list',
        code: `def inorder(self, root):
    res = []

    def dfs(node):
        if not node:
            return
        dfs(node.left)
        res.append(node.val)         # reads 'res' from the enclosing scope
        dfs(node.right)

    dfs(root)
    return res`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Reading works; rebinding needs `nonlocal`',
        body: '`res.append(x)` works because you are *mutating* the list. But `best = 5` inside the helper creates a **new local** and the outer `best` never changes. To reassign an enclosing variable you must declare `nonlocal best`.',
      },
      {
        kind: 'code',
        caption: 'The `nonlocal` case',
        code: `def diameterOfBinaryTree(self, root):
    best = 0

    def depth(node):
        nonlocal best                # WITHOUT this, best stays 0
        if not node:
            return 0

        l, r = depth(node.left), depth(node.right)
        best = max(best, l + r)      # path THROUGH this node
        return 1 + max(l, r)         # what the parent needs

    depth(root)
    return best`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Or avoid `nonlocal` with a one-element list',
        body: '`best = [0]` then `best[0] = max(...)` mutates rather than rebinds, so no declaration is needed. Both are idiomatic; `nonlocal` reads better and the list trick works on older code you may encounter.',
      },
    ],
    keyTakeaways: [
      'The nested helper closing over outer state is the standard Python shape.',
      'Mutating an enclosing list works; rebinding a variable does not.',
      'Use `nonlocal` to reassign an enclosing scalar.',
      '"Return one thing, record another" is the diameter pattern.',
    ],
    practice: {
      prompt: 'Write Diameter of Binary Tree with `nonlocal`, then delete the declaration and watch the answer stay 0. That one experiment teaches Python scoping better than any explanation.',
      leetcode: { title: 'Diameter of Binary Tree', slug: 'diameter-of-binary-tree' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-13.3',
    language: 'python',
    summary: 'Understand what traversal means and how the four kinds differ.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Traversal means visiting every node exactly once. There are four standard orders, and they split into two families: **depth-first** (three variants, naturally recursive) and **breadth-first** (one variant, needs a queue).',
      },
      {
        kind: 'code',
        caption: 'The four orders on one tree',
        code: `        1
      /   \\
     2     3
    / \\
   4   5

Preorder   (root, left, right):  1 2 4 5 3
Inorder    (left, root, right):  4 2 5 1 3
Postorder  (left, right, root):  4 5 2 3 1
Level order (BFS):               1 2 3 4 5`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The name tells you where the visit happens',
        body: '**Pre**order visits before recursing, **in**order between the two calls, **post**order after both. The recursive calls never move — only the `visit` line does. That is why the three are one idea rather than three.',
      },
      {
        kind: 'table',
        headers: ['Order', 'Use it when'],
        rows: [
          ['Preorder', 'The parent must be handled first — copying, serialising'],
          ['Inorder', 'The tree is a BST and you want sorted order'],
          ['Postorder', 'The answer depends on the children — height, deleting'],
          ['Level order', 'You need depth, or level-by-level grouping'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Most "compute a value" problems are postorder',
        body: 'Height, diameter, balance, max path sum, subtree sums — all need the children\'s answers before the parent can be computed. If you are unsure which order a problem needs, postorder is the best first guess.',
      },
      {
        kind: 'text',
        body: 'DFS uses O(height) memory — one root-to-leaf path on the call stack. BFS uses O(width), which for a balanced binary tree is about half the nodes at the last level. On a wide shallow tree DFS wins; on a deep narrow one BFS does.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Traversal order is not the same as node order',
        body: 'Inorder on a BST yields sorted values — but on an arbitrary binary tree it yields nothing meaningful. The guarantee comes from the BST property, not from the traversal.',
      },
    ],
    keyTakeaways: [
      'Three DFS orders differ only in where the visit line sits.',
      'Inorder on a BST yields sorted order; on other trees it means nothing.',
      'Postorder suits any problem computing a value from the children.',
      'DFS costs O(height) memory; BFS costs O(width).',
    ],
    practice: {
      prompt: 'Write all four traversals for the tree above and check your output matches. Doing it once by hand makes the orders permanent.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-13.4',
    language: 'python',
    summary: 'Write the three depth-first traversals, recursively and iteratively.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'The recursive versions are three lines each and differ by one line\'s position. The iterative versions matter when the tree may be deep enough to exceed Python\'s recursion limit.',
      },
      {
        kind: 'code',
        caption: 'Recursive — the whole family',
        code: `def preorder(node):
    if not node: return
    res.append(node.val)          # visit FIRST
    preorder(node.left)
    preorder(node.right)

def inorder(node):
    if not node: return
    inorder(node.left)
    res.append(node.val)          # visit BETWEEN
    inorder(node.right)

def postorder(node):
    if not node: return
    postorder(node.left)
    postorder(node.right)
    res.append(node.val)          # visit LAST`,
      },
      {
        kind: 'code',
        caption: 'Iterative preorder — the easiest',
        code: `def preorder(root):
    if not root: return []
    res, stack = [], [root]

    while stack:
        node = stack.pop()
        res.append(node.val)

        # push RIGHT first, so LEFT pops first
        if node.right: stack.append(node.right)
        if node.left:  stack.append(node.left)

    return res`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Push right before left',
        body: 'A stack reverses order, so pushing left then right pops right first. To visit left-to-right you must push **right first**. Getting this backwards produces a mirror-image traversal that still looks plausible.',
      },
      {
        kind: 'code',
        caption: 'Iterative inorder — the useful one',
        code: `def inorder(root):
    res, stack, cur = [], [], root

    while cur or stack:
        while cur:                 # dive as far left as possible
            stack.append(cur)
            cur = cur.left

        cur = stack.pop()          # leftmost unvisited node
        res.append(cur.val)
        cur = cur.right            # then explore its right subtree

    return res`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Iterative inorder solves Kth Smallest in a BST',
        body: 'Because it yields sorted order *lazily*, you can stop after k nodes instead of traversing the whole tree. That turns an O(n) solution into O(h + k) — exactly what the follow-up asks for.',
      },
      {
        kind: 'code',
        caption: 'Iterative postorder — reverse a modified preorder',
        code: `def postorder(root):
    if not root: return []
    res, stack = [], [root]

    while stack:
        node = stack.pop()
        res.append(node.val)
        if node.left:  stack.append(node.left)     # note: LEFT first here
        if node.right: stack.append(node.right)

    return res[::-1]               # root-right-left reversed == left-right-root`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Raise the recursion limit only as a last resort',
        body: '`sys.setrecursionlimit(10**6)` works but risks a genuine interpreter crash, since Python\'s C stack is also finite. The iterative version is safer. Use the limit bump for quick experiments, not for a submission you care about.',
      },
    ],
    keyTakeaways: [
      'The three recursive traversals differ by one line\'s position.',
      'Iterative preorder pushes right before left.',
      'Iterative inorder yields sorted BST order lazily — ideal for Kth Smallest.',
      'Iterative postorder is a modified preorder, reversed.',
    ],
    practice: {
      prompt: 'Write all three iteratively and check them against the recursive versions. Then use iterative inorder to solve Kth Smallest Element in a BST, stopping early.',
      leetcode: { title: 'Kth Smallest Element in a BST', slug: 'kth-smallest-element-in-a-bst' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-13.5',
    language: 'python',
    summary: 'Write level-order traversal and the problems built on it.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Level order visits the tree in rings — everything at depth 1, then depth 2. It needs a queue rather than recursion, and the key trick is snapshotting the queue length so each iteration handles exactly one level.',
      },
      {
        kind: 'code',
        caption: 'The template',
        code: `from collections import deque

def level_order(root):
    if not root:
        return []

    res, q = [], deque([root])

    while q:
        level = []

        for _ in range(len(q)):        # snapshot — this many on this level
            node = q.popleft()
            level.append(node.val)

            if node.left:  q.append(node.left)
            if node.right: q.append(node.right)

        res.append(level)

    return res`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: '`for _ in range(len(q))` freezes the level',
        body: 'Reading `len(q)` once, before the inner loop, captures the current level\'s size. Everything popped inside belongs to this level; everything pushed belongs to the next. Using the live length mixes levels and every depth answer comes out wrong.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Guard the `None` children',
        body: 'Appending `node.left` without checking puts `None` in the queue, and the next iteration crashes with `AttributeError` on `node.val`. Unlike Java\'s `ArrayDeque`, a Python `deque` accepts `None` happily — so the failure comes later and further away.',
      },
      {
        kind: 'code',
        caption: 'Variations, all one line apart',
        code: `# Right side view — the LAST node of each level
if i == len(q) - 1:
    res.append(node.val)

# Bottom-up level order
return res[::-1]

# Zigzag — reverse alternate levels
if len(res) % 2 == 1:
    level.reverse()

# Maximum in each level
res.append(max(level))

# Minimum depth — the first leaf you meet
if not node.left and not node.right:
    return depth`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Minimum depth is BFS, maximum depth is DFS',
        body: 'BFS finds the *shallowest* leaf first, so it can return immediately — often without touching most of the tree. DFS would have to explore everything. That asymmetry is a genuine reason to choose one over the other.',
      },
      {
        kind: 'text',
        body: 'Level order is also how you serialise a tree the way LeetCode encodes them, and how you build one back from a list — the helper from Chapter 12 uses exactly this loop.',
      },
    ],
    keyTakeaways: [
      'Snapshot `len(q)` to process exactly one level per iteration.',
      'Guard `None` children before appending, or you crash later.',
      'Right-side view, zigzag and level maxima are one line apart.',
      'Minimum depth wants BFS; maximum depth wants DFS.',
    ],
    practice: {
      prompt: 'Write level order, then modify it for the right-side view and for zigzag. Each should be a one- or two-line change to the same template.',
      leetcode: { title: 'Binary Tree Level Order Traversal', slug: 'binary-tree-level-order-traversal' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-13.6',
    language: 'python',
    summary: 'Choose a graph representation and build it from the input you are given.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A graph is nodes plus edges, and the representation you choose decides how the rest of your code reads. In Python the adjacency list is almost always right, and `defaultdict(list)` makes building it two lines.',
      },
      {
        kind: 'code',
        caption: 'The three inputs you will be handed',
        code: `from collections import defaultdict

# 1. Edge list -> adjacency list
adj = defaultdict(list)
for u, v in edges:
    adj[u].append(v)
    adj[v].append(u)              # undirected

# 2. Adjacency matrix (given directly)
for v in range(n):
    if matrix[u][v] == 1: ...

# 3. Implicit grid — neighbours are computed, nothing to build
DIRS = ((1,0), (-1,0), (0,1), (0,-1))`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Recognise the grid as a graph',
        body: 'Each cell is a node; each adjacent pair is an edge. Once you see that, island counting, maze solving and shortest paths all become BFS and DFS with no algorithmic change at all — only the neighbour function differs.',
      },
      {
        kind: 'code',
        caption: 'The grid neighbour loop, written once',
        code: `for dr, dc in DIRS:
    nr, nc = r + dr, c + dc

    if not (0 <= nr < rows and 0 <= nc < cols):
        continue                      # off the grid
    if grid[nr][nc] == "0":
        continue                      # wall or already visited
    ...`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Chained comparison makes the bounds check readable',
        body: '`0 <= nr < rows` is Python\'s chained form and reads exactly like the mathematics. In C++ or Java you would need `nr >= 0 && nr < rows`. This is one of the places Python genuinely reduces bugs.',
      },
      {
        kind: 'table',
        headers: ['', 'Adjacency list', 'Adjacency matrix'],
        rows: [
          ['Space', 'O(V + E)', '**O(V²)**'],
          ['Neighbours of a node', 'O(degree)', 'O(V)'],
          ['"Is there an edge u→v?"', 'O(degree)', '**O(1)**'],
          ['Use when', 'Sparse — almost always', 'Dense, or given as a matrix'],
        ],
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'A matrix is impossible at scale',
        body: 'With V = 10⁵ a matrix needs 10¹⁰ cells — far beyond memory. Real graphs are sparse, so E is closer to V than to V². Use an adjacency list unless the problem hands you a matrix.',
      },
    ],
    keyTakeaways: [
      '`defaultdict(list)` builds an adjacency list in two lines.',
      'A grid is an implicit graph with computed neighbours.',
      'Chained comparisons make bounds checks read naturally.',
      'Matrices are O(V²) and impossible for large sparse graphs.',
    ],
    practice: {
      prompt: 'Build an adjacency list from an edge list, then write the grid neighbour loop. Keep both in your snippet file — you will type them constantly.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-13.7',
    language: 'python',
    summary: 'Write BFS, the tool for shortest paths on unweighted graphs.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'BFS visits everything at distance 1, then distance 2, and so on. Because it never looks at distance `d + 1` before finishing `d`, **the first time it reaches a node is by a shortest path**. That guarantee is the only reason to prefer it over DFS — and it holds only when every edge costs the same.',
      },
      {
        kind: 'code',
        caption: 'The template',
        code: `from collections import deque

def bfs(start, target, adj):
    q = deque([start])
    visited = {start}                 # mark on ENQUEUE
    steps = 0

    while q:
        for _ in range(len(q)):       # one level per outer iteration
            node = q.popleft()

            if node == target:
                return steps

            for nxt in adj[node]:
                if nxt not in visited:
                    visited.add(nxt)
                    q.append(nxt)

        steps += 1

    return -1                         # unreachable`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Mark visited on enqueue, not on dequeue',
        body: 'If you wait until dequeue, a node reachable from several neighbours gets queued many times before any copy is processed. The queue balloons past V and dense graphs time out — while still producing the right answer on small inputs.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: '`list.pop(0)` instead of `deque.popleft()`',
        body: 'This is the classic Python BFS bug. `pop(0)` is O(n), turning a 10⁵-node traversal into 10¹⁰ operations. The code is *correct* and simply times out, which makes it maddening to diagnose. Import `deque` reflexively.',
      },
      {
        kind: 'code',
        caption: 'Multi-source BFS — seed every start',
        code: `# Rotting Oranges: every rotten orange starts the wave simultaneously
q = deque()
fresh = 0

for r in range(rows):
    for c in range(cols):
        if grid[r][c] == 2: q.append((r, c))
        elif grid[r][c] == 1: fresh += 1

minutes = 0
while q and fresh:
    for _ in range(len(q)):
        r, c = q.popleft()
        for dr, dc in DIRS:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                grid[nr][nc] = 2
                fresh -= 1
                q.append((nr, nc))
    minutes += 1

return -1 if fresh else minutes`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Multi-source is a one-line change',
        body: 'Push every source before the loop starts. Each cell is still reached by its nearest source first, so "01 Matrix" and "Rotting Oranges" become straightforward. Recognising when a problem is multi-source is most of the difficulty.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'BFS is wrong for weighted graphs',
        body: 'The shortest-path guarantee assumes every edge costs 1. With varying weights BFS returns the path with the fewest *edges*, not the cheapest — you need Dijkstra. The exception is 0/1 weights, where a deque-based "0-1 BFS" works.',
      },
    ],
    keyTakeaways: [
      'BFS finds shortest paths because it finishes each ring before the next.',
      'Mark visited on enqueue; snapshot `len(q)` per level.',
      'Use `deque.popleft()`, never `list.pop(0)`.',
      'Seed all sources for multi-source problems.',
    ],
    practice: {
      prompt: 'Solve Rotting Oranges with multi-source BFS. Then swap `deque` for a list with `pop(0)` and time both on a large grid.',
      leetcode: { title: 'Rotting Oranges', slug: 'rotting-oranges' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-13.8',
    language: 'python',
    summary: 'Write DFS recursively and iteratively, and know the recursion limit.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'DFS dives down one branch fully before backtracking. It is the natural choice for "does a path exist", "find all paths", connected components, and cycle detection — anywhere the *shortest* path is not what is being asked for.',
      },
      {
        kind: 'code',
        caption: 'Recursive DFS',
        code: `def dfs(node, visited, adj):
    visited.add(node)

    for nxt in adj[node]:
        if nxt not in visited:
            dfs(nxt, visited, adj)`,
      },
      {
        kind: 'code',
        caption: 'Grid DFS — flood fill',
        code: `def dfs(r, c):
    if not (0 <= r < rows and 0 <= c < cols):
        return
    if grid[r][c] != "1":
        return                       # wall or already visited

    grid[r][c] = "0"                 # mark — and never undo

    dfs(r + 1, c); dfs(r - 1, c)
    dfs(r, c + 1); dfs(r, c - 1)`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Flood fill must NOT un-mark',
        body: 'Counting islands relies on the mark being permanent — that *is* the visited set. Word Search must un-mark, because a cell reused on a different path is legitimate. Confusing the two gives either infinite recursion or a wrong island count.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Python\'s recursion limit is 1000',
        body: 'A DFS over a 10⁵-node graph, or a 300×300 grid that is one big region, raises `RecursionError`. This is a genuine Python-specific constraint that C++ and Java solutions do not hit at the same sizes.',
      },
      {
        kind: 'code',
        caption: 'The two fixes',
        code: `# 1. Raise the limit — quick, slightly risky
import sys
sys.setrecursionlimit(10**6)

# 2. Go iterative — safe, always works
def dfs_iterative(start, adj):
    stack, visited = [start], set()

    while stack:
        node = stack.pop()
        if node in visited:
            continue
        visited.add(node)

        for nxt in adj[node]:
            if nxt not in visited:
                stack.append(nxt)`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Check membership when popping, not only when pushing',
        body: 'In the iterative version a node can be pushed several times before it is processed. The `if node in visited: continue` at the top handles that. Omitting it revisits nodes and can make the traversal quadratic.',
      },
      {
        kind: 'text',
        body: 'For counting connected components, run DFS from every unvisited node and count how many times you had to start. That loop is the entire solution to Number of Islands and Number of Provinces.',
      },
    ],
    keyTakeaways: [
      'DFS suits path existence, components, and "find all" problems.',
      'Flood fill marks permanently; backtracking un-marks.',
      'Python\'s 1000-frame limit is a real constraint on large graphs.',
      'Iterative DFS must check `visited` on pop, not only on push.',
    ],
    practice: {
      prompt: 'Solve Number of Islands recursively, then rewrite it iteratively. Then build a 1000×1 grid of land and watch the recursive version raise `RecursionError`.',
      leetcode: { title: 'Number of Islands', slug: 'number-of-islands' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-13.9',
    language: 'python',
    summary: 'Count connected components, the simplest real graph problem.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A connected component is a group of nodes all reachable from each other. Counting them is the simplest genuinely useful graph algorithm: start a traversal from every unvisited node, and count how many times you had to start.',
      },
      {
        kind: 'code',
        caption: 'The template',
        code: `def count_components(n, edges):
    adj = defaultdict(list)
    for u, v in edges:
        adj[u].append(v)
        adj[v].append(u)

    visited = set()
    count = 0

    for node in range(n):
        if node not in visited:
            count += 1                    # a NEW component starts here
            dfs(node, visited, adj)       # absorb everything reachable

    return count`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The count is the number of *starts*',
        body: 'Each time the outer loop finds an unvisited node, it has discovered a component nobody reached from earlier ones. The traversal then absorbs the whole group. That is the entire insight — BFS works identically to DFS here.',
      },
      {
        kind: 'code',
        caption: 'Number of Islands — the same algorithm on a grid',
        code: `def num_islands(grid):
    if not grid: return 0
    rows, cols = len(grid), len(grid[0])
    count = 0

    def sink(r, c):
        if not (0 <= r < rows and 0 <= c < cols) or grid[r][c] != "1":
            return
        grid[r][c] = "0"
        sink(r+1, c); sink(r-1, c); sink(r, c+1); sink(r, c-1)

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == "1":
                count += 1                # a new island
                sink(r, c)                # sink the whole thing

    return count`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Mark before recursing, not after',
        body: 'Setting `grid[r][c] = "0"` must happen *before* the four recursive calls. Doing it afterwards lets neighbours call back into this cell and you recurse forever. This is the commonest flood-fill bug.',
      },
      {
        kind: 'text',
        body: 'Union-find solves the same problem and is preferable when edges arrive **over time** — the dynamic case, where re-running a traversal per query would be O(V + E) each time. For a fixed graph traversed once, DFS is simpler and just as fast.',
      },
      {
        kind: 'code',
        caption: 'The union-find version, for comparison',
        code: `dsu = DSU(n)
for u, v in edges:
    dsu.unite(u, v)
return dsu.components`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Related questions, same machinery',
        body: '"Largest component" tracks the size returned by each traversal. "Is the graph connected?" is `count == 1`. "Is it a valid tree?" is `count == 1 and len(edges) == n - 1`. All three are the template plus one line.',
      },
    ],
    keyTakeaways: [
      'The component count is the number of traversal starts.',
      'DFS and BFS work identically here.',
      'Mark a grid cell before recursing, or you loop forever.',
      'Union-find wins when edges arrive dynamically.',
    ],
    practice: {
      prompt: 'Solve Number of Islands and Number of Provinces. Then modify the first to return the size of the largest island instead of the count.',
      leetcode: { title: 'Number of Provinces', slug: 'number-of-provinces' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-13.10',
    language: 'python',
    summary: 'Detect cycles, using the right method for directed and undirected graphs.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Cycle detection is one of the few places where **directed and undirected graphs need genuinely different algorithms**. Using the wrong one gives confidently wrong answers, so it is worth being precise about which is which.',
      },
      { kind: 'heading', text: 'Undirected — DFS tracking the parent' },
      {
        kind: 'code',
        code: `def has_cycle_undirected(n, adj):
    visited = set()

    def dfs(node, parent):
        visited.add(node)

        for nxt in adj[node]:
            if nxt == parent:
                continue                  # the edge we just came along
            if nxt in visited:
                return True               # a DIFFERENT way back -> cycle
            if dfs(nxt, node):
                return True

        return False

    return any(dfs(v, -1) for v in range(n) if v not in visited)`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'You must skip the parent',
        body: 'In an undirected graph every edge appears twice, so `u → v` and `v → u` both exist. Without the parent check, that immediately looks like a cycle and every connected pair reports one. The `if nxt == parent: continue` line is essential.',
      },
      { kind: 'heading', text: 'Directed — DFS with three colours' },
      {
        kind: 'code',
        code: `def has_cycle_directed(n, adj):
    WHITE, GREY, BLACK = 0, 1, 2          # unvisited / in progress / done
    colour = [WHITE] * n

    def dfs(node):
        colour[node] = GREY               # on the current path

        for nxt in adj[node]:
            if colour[nxt] == GREY:
                return True               # back edge -> CYCLE
            if colour[nxt] == WHITE and dfs(nxt):
                return True

        colour[node] = BLACK              # finished — safe
        return False

    return any(dfs(v) for v in range(n) if colour[v] == WHITE)`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'GREY means "on the current path"',
        body: 'Meeting a GREY node means you have looped back on yourself — a genuine cycle. Meeting a BLACK node just means you have been there before via a different route, which is fine in a directed acyclic graph. Two states are not enough to tell those apart.',
      },
      { kind: 'heading', text: 'Directed — the easier alternative' },
      {
        kind: 'code',
        caption: "Kahn's algorithm: count what you can emit",
        code: `from collections import deque

indeg = [0] * n
for u in range(n):
    for v in adj[u]:
        indeg[v] += 1

q = deque(v for v in range(n) if indeg[v] == 0)
emitted = 0

while q:
    node = q.popleft()
    emitted += 1
    for nxt in adj[node]:
        indeg[nxt] -= 1
        if indeg[nxt] == 0:
            q.append(nxt)

return emitted != n           # fewer than n emitted -> a cycle blocked the rest`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Kahn is usually easier under pressure',
        body: 'It gives cycle detection *and* a topological order from one loop, with no colour bookkeeping and no recursion limit to worry about. For "Course Schedule" style problems it is the shorter, safer choice.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Union-find detects undirected cycles only',
        body: 'A DSU reports a cycle whenever an edge joins two already-connected nodes — correct for undirected graphs. On a directed graph, `1→2` and `1→3` would wrongly look like a cycle. Never use it for directed cycle detection.',
      },
    ],
    keyTakeaways: [
      'Undirected cycle detection must skip the parent edge.',
      'Directed cycle detection needs three colours — GREY means on-path.',
      'Kahn\'s algorithm detects directed cycles with a simple count.',
      'Union-find works for undirected cycles only.',
    ],
    practice: {
      prompt: 'Solve Course Schedule with Kahn\'s algorithm, then again with three-colour DFS. Then write undirected detection and omit the parent check to see every edge report a cycle.',
      leetcode: { title: 'Course Schedule', slug: 'course-schedule' },
    },
  },
];
