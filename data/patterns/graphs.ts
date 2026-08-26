import type { Pattern } from './types';

/** Graph traversal, ordering, shortest paths, connectivity — plus the trie. */
export const graphPatterns: Pattern[] = [
  // ==========================================================================
  {
    slug: 'bfs-level-order',
    name: 'BFS (Level Order)',
    category: 'graph',
    oneLiner:
      'Explore in rings with a queue — the first time you reach a node is the shortest way there.',
    triggers: [
      '"**Shortest** path / fewest steps / minimum moves" on an **unweighted** graph',
      '"Level order", "level by level", "nodes at depth k"',
      '"Spread", "rot", "infect", "flood" — anything expanding one step at a time',
      'A grid where you may move up/down/left/right one cell at a time',
      '"Minimum number of transformations from A to B"',
    ],
    idea: [
      'BFS visits every node at distance 1, then every node at distance 2, and so on. Because it never looks at distance `d + 1` before finishing distance `d`, **the first time it reaches a node is guaranteed to be by a shortest path**. That guarantee is the entire reason to prefer BFS over DFS for shortest-path questions — and it only holds when every edge costs the same.',
      'The level-by-level form is what most problems want. Record `size = queue.size()` at the top of each outer iteration and then pop exactly that many nodes. Everything popped in that inner loop is on the same level, and anything pushed belongs to the next one. That snapshot is what keeps the levels from bleeding into each other.',
      'Mark nodes as visited **when you enqueue them**, not when you dequeue them. If you wait until dequeue, a node reachable from several neighbours gets pushed multiple times before any of them is processed — the queue blows up and the runtime degrades badly on dense graphs.',
      'Multi-source BFS is a small but powerful twist: push *every* starting node before the loop begins. "Rotting Oranges" and "01 Matrix" become trivial this way, because the wave expands from all sources simultaneously and each cell is still reached by its nearest source first.',
    ],
    time: 'O(V + E) — every node and edge once',
    timeShort: 'O(V + E)',
    space: 'O(V) for the queue and visited set',
    template: {
      cpp: `// Level-order BFS. Returns the number of levels (= shortest distance).
queue<int> q;
vector<bool> visited(n, false);

q.push(start);
visited[start] = true;               // mark on ENQUEUE, not on dequeue
int level = 0;

while (!q.empty()) {
    int size = q.size();             // snapshot: this many nodes on this level

    for (int i = 0; i < size; i++) {
        int node = q.front(); q.pop();

        if (node == target) return level;

        for (int next : adj[node]) {
            if (!visited[next]) {
                visited[next] = true;
                q.push(next);
            }
        }
    }
    level++;                         // finished a whole ring
}
return -1;                           // unreachable`,
      java: `// Level-order BFS. Returns the number of levels (= shortest distance).
Queue<Integer> q = new ArrayDeque<>();
boolean[] visited = new boolean[n];

q.add(start);
visited[start] = true;               // mark on ENQUEUE, not on dequeue
int level = 0;

while (!q.isEmpty()) {
    int size = q.size();             // snapshot: this many nodes on this level

    for (int i = 0; i < size; i++) {
        int node = q.poll();

        if (node == target) return level;

        for (int next : adj.get(node)) {
            if (!visited[next]) {
                visited[next] = true;
                q.add(next);
            }
        }
    }
    level++;                         // finished a whole ring
}
return -1;                           // unreachable`,
      python: `from collections import deque

# Level-order BFS. Returns the number of levels (= shortest distance).
q = deque([start])
visited = [False] * n

visited[start] = True                # mark on ENQUEUE, not on dequeue
level = 0

while q:
    size = len(q)                    # snapshot: this many nodes on this level

    for _ in range(size):
        node = q.popleft()

        if node == target:
            return level

        for nxt in adj[node]:
            if not visited[nxt]:
                visited[nxt] = True
                q.append(nxt)

    level += 1                       # finished a whole ring

return -1                            # unreachable`,
    },
    variants: [
      {
        name: 'Grid BFS (4-directional)',
        when: 'The graph is an implicit grid — islands, mazes, rotting oranges.',
        code: {
          cpp: `int dirs[4][2] = {{1,0},{-1,0},{0,1},{0,-1}};
queue<pair<int,int>> q;

q.push({sr, sc});
grid[sr][sc] = '0';                  // mark visited by mutating the grid

while (!q.empty()) {
    auto [r, c] = q.front(); q.pop();

    for (auto& d : dirs) {
        int nr = r + d[0], nc = c + d[1];

        if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;   // off the grid
        if (grid[nr][nc] != '1') continue;                      // wall or seen

        grid[nr][nc] = '0';
        q.push({nr, nc});
    }
}`,
          java: `int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
Queue<int[]> q = new ArrayDeque<>();

q.add(new int[]{sr, sc});
grid[sr][sc] = '0';                  // mark visited by mutating the grid

while (!q.isEmpty()) {
    int[] cur = q.poll();
    int r = cur[0], c = cur[1];

    for (int[] d : dirs) {
        int nr = r + d[0], nc = c + d[1];

        if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;   // off the grid
        if (grid[nr][nc] != '1') continue;                      // wall or seen

        grid[nr][nc] = '0';
        q.add(new int[]{nr, nc});
    }
}`,
          python: `dirs = ((1, 0), (-1, 0), (0, 1), (0, -1))
q = deque([(sr, sc)])

grid[sr][sc] = "0"                   # mark visited by mutating the grid

while q:
    r, c = q.popleft()

    for dr, dc in dirs:
        nr, nc = r + dr, c + dc

        if not (0 <= nr < m and 0 <= nc < n):
            continue                 # off the grid
        if grid[nr][nc] != "1":
            continue                 # wall or seen

        grid[nr][nc] = "0"
        q.append((nr, nc))`,
        },
      },
    ],
    problems: [
      {
        title: 'Binary Tree Level Order Traversal',
        slug: 'binary-tree-level-order-traversal',
        difficulty: 'Medium',
        note: 'The level snapshot, with no visited set needed.',
      },
      {
        title: 'Number of Islands',
        slug: 'number-of-islands',
        difficulty: 'Medium',
        note: 'Grid traversal. BFS or DFS both work — write it both ways.',
      },
      {
        title: 'Rotting Oranges',
        slug: 'rotting-oranges',
        difficulty: 'Medium',
        note: 'Multi-source BFS, where levels are literally minutes.',
      },
      {
        title: '01 Matrix',
        slug: '01-matrix',
        difficulty: 'Medium',
        note: 'Multi-source again — push every 0 first, and the answer falls out.',
      },
      {
        title: 'Word Ladder',
        slug: 'word-ladder',
        difficulty: 'Hard',
        note: 'The graph is implicit; building the edges is the real work.',
      },
    ],
    pitfalls: [
      {
        title: 'Marking visited on dequeue',
        body: 'A node with many neighbours gets enqueued once per neighbour before it is ever processed. The queue grows far beyond V and the solution times out on dense graphs. Mark it the moment you push it.',
      },
      {
        title: 'Reading `queue.size()` inside the inner loop',
        body: 'You must snapshot the size *before* the inner loop, because pushes during the loop change it. Using the live size mixes levels together and every depth-based answer comes out wrong.',
      },
      {
        title: 'Using BFS on a weighted graph',
        body: 'The shortest-path guarantee assumes every edge costs 1. With varying weights, BFS returns the path with the fewest *edges*, not the cheapest — you need Dijkstra. The exception is 0/1 weights, where a deque-based "0-1 BFS" works.',
      },
      {
        title: 'Java: `new ArrayDeque<>()` rejects nulls',
        body: '`ArrayDeque` throws `NullPointerException` if you offer a null element, which bites when doing level-order traversal of a tree and pushing `node.left` without checking. Guard the null before adding, or use `LinkedList` as the queue.',
      },
    ],
    related: ['dfs-backtracking', 'topological-sort', 'dijkstra'],
  },

  // ==========================================================================
  {
    slug: 'dfs-backtracking',
    name: 'DFS + Backtracking',
    category: 'graph',
    oneLiner:
      'Go deep, and undo the choice on the way back out — the shape of every "list all" problem.',
    triggers: [
      '"Find **all** …" — subsets, permutations, combinations, paths',
      '"How many ways…" where you must actually enumerate them',
      '"Does a path exist?" in a grid or graph, with no shortest requirement',
      'N-Queens, sudoku, word search, expression building',
      'Connected components, flood fill, "count the islands"',
    ],
    idea: [
      'Backtracking is DFS over a tree of decisions. At each node you **choose** an option, **recurse** into the smaller problem, then **un-choose** so the next option starts from a clean slate. Those three lines around the recursive call are the whole pattern, and the un-choose is the part people forget.',
      'The un-choose is only necessary because the path is *shared mutable state*. Add to `path`, recurse, then remove the element you added. If instead you pass a fresh copy down (`path + [x]` in Python), no undo is needed — that is simpler to write but allocates on every call, so the explicit undo is what you want for large search spaces.',
      'What distinguishes subsets, combinations and permutations is only the loop\'s starting index. **Subsets and combinations** pass `i + 1` so each element is considered once and order does not matter. **Permutations** loop from 0 over everything not yet used, because order does matter. Same skeleton, one changed argument.',
      'Pruning is what makes a backtracking solution fast enough. If the partial answer already violates a constraint — sum exceeded, column attacked, prefix not in the dictionary — return immediately instead of recursing further. On problems like N-Queens and Word Search II, pruning is the difference between passing and timing out.',
    ],
    time: 'O(2ⁿ) subsets, O(n!) permutations — exponential by nature',
    timeShort: 'O(2ⁿ)',
    space: 'O(n) recursion depth, plus the output',
    template: {
      cpp: `// All subsets. The choose / recurse / un-choose skeleton.
vector<vector<int>> res;
vector<int> path;

void dfs(int start, vector<int>& nums) {
    res.push_back(path);                 // every node is a valid subset

    for (int i = start; i < nums.size(); i++) {
        path.push_back(nums[i]);         // 1. CHOOSE
        dfs(i + 1, nums);                // 2. RECURSE (i+1 => no reuse)
        path.pop_back();                 // 3. UN-CHOOSE
    }
}`,
      java: `// All subsets. The choose / recurse / un-choose skeleton.
List<List<Integer>> res = new ArrayList<>();
List<Integer> path = new ArrayList<>();

void dfs(int start, int[] nums) {
    res.add(new ArrayList<>(path));      // COPY — every node is a valid subset

    for (int i = start; i < nums.length; i++) {
        path.add(nums[i]);               // 1. CHOOSE
        dfs(i + 1, nums);                // 2. RECURSE (i+1 => no reuse)
        path.remove(path.size() - 1);    // 3. UN-CHOOSE
    }
}`,
      python: `# All subsets. The choose / recurse / un-choose skeleton.
res, path = [], []

def dfs(start):
    res.append(path[:])                  # COPY — every node is a valid subset

    for i in range(start, len(nums)):
        path.append(nums[i])             # 1. CHOOSE
        dfs(i + 1)                       # 2. RECURSE (i+1 => no reuse)
        path.pop()                       # 3. UN-CHOOSE`,
    },
    variants: [
      {
        name: 'Permutations',
        when: 'Order matters and every element is used exactly once.',
        code: {
          cpp: `void dfs(vector<int>& nums, vector<bool>& used) {
    if (path.size() == nums.size()) { res.push_back(path); return; }

    for (int i = 0; i < nums.size(); i++) {   // from 0 — not from 'start'
        if (used[i]) continue;

        used[i] = true;  path.push_back(nums[i]);
        dfs(nums, used);
        used[i] = false; path.pop_back();     // undo BOTH
    }
}`,
          java: `void dfs(int[] nums, boolean[] used) {
    if (path.size() == nums.length) { res.add(new ArrayList<>(path)); return; }

    for (int i = 0; i < nums.length; i++) {   // from 0 — not from 'start'
        if (used[i]) continue;

        used[i] = true;  path.add(nums[i]);
        dfs(nums, used);
        used[i] = false; path.remove(path.size() - 1);   // undo BOTH
    }
}`,
          python: `def dfs(used):
    if len(path) == len(nums):
        res.append(path[:])
        return

    for i in range(len(nums)):                # from 0 — not from 'start'
        if used[i]:
            continue

        used[i] = True;  path.append(nums[i])
        dfs(used)
        used[i] = False; path.pop()           # undo BOTH`,
        },
      },
      {
        name: 'Grid DFS (flood fill)',
        when: 'Counting islands / regions. No undo — visited stays marked.',
        code: {
          cpp: `void dfs(vector<vector<char>>& grid, int r, int c) {
    if (r < 0 || r >= grid.size() || c < 0 || c >= grid[0].size()) return;
    if (grid[r][c] != '1') return;          // wall or already visited

    grid[r][c] = '0';                       // mark — and never undo

    dfs(grid, r + 1, c);
    dfs(grid, r - 1, c);
    dfs(grid, r, c + 1);
    dfs(grid, r, c - 1);
}`,
          java: `void dfs(char[][] grid, int r, int c) {
    if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length) return;
    if (grid[r][c] != '1') return;          // wall or already visited

    grid[r][c] = '0';                       // mark — and never undo

    dfs(grid, r + 1, c);
    dfs(grid, r - 1, c);
    dfs(grid, r, c + 1);
    dfs(grid, r, c - 1);
}`,
          python: `def dfs(r, c):
    if not (0 <= r < len(grid) and 0 <= c < len(grid[0])):
        return
    if grid[r][c] != "1":                   # wall or already visited
        return

    grid[r][c] = "0"                        # mark — and never undo

    dfs(r + 1, c)
    dfs(r - 1, c)
    dfs(r, c + 1)
    dfs(r, c - 1)`,
        },
      },
    ],
    problems: [
      {
        title: 'Subsets',
        slug: 'subsets',
        difficulty: 'Medium',
        note: 'The template with nothing added. Learn it here.',
      },
      {
        title: 'Permutations',
        slug: 'permutations',
        difficulty: 'Medium',
        note: 'The `used[]` variant — see how little actually changes.',
      },
      {
        title: 'Combination Sum',
        slug: 'combination-sum',
        difficulty: 'Medium',
        note: 'Reuse allowed, so recurse with `i` rather than `i + 1`.',
      },
      {
        title: 'Word Search',
        slug: 'word-search',
        difficulty: 'Medium',
        note: 'Grid backtracking where you *do* undo the mark.',
      },
      {
        title: 'N-Queens',
        slug: 'n-queens',
        difficulty: 'Hard',
        note: 'Pruning is mandatory. The diagonal-key trick is worth knowing.',
      },
    ],
    pitfalls: [
      {
        title: 'Adding the path by reference instead of copying',
        body: 'In Java `res.add(path)` stores a reference to the *same* list you keep mutating, so every entry in `res` ends up empty. Use `new ArrayList<>(path)`. Python needs `path[:]` for the same reason. C++ `push_back(path)` copies by value, so it is the one language where this is safe.',
      },
      {
        title: 'Forgetting to un-choose',
        body: 'Without the `pop_back()` the path keeps growing across sibling branches and the results are nonsense. Rule of thumb: every mutation before the recursive call needs a matching undo after it — including `used[i] = false`.',
      },
      {
        title: 'Flood fill that undoes its mark',
        body: 'Counting islands must **not** un-mark cells; the mark is the visited set. Word Search must, because a cell reused on a different path is legitimate. Confusing the two gives either infinite recursion or a wrong island count.',
      },
      {
        title: 'Python recursion depth',
        body: 'The default limit is 1000. A DFS over a 10⁵-node graph raises `RecursionError`. Either call `sys.setrecursionlimit(10**6)` or rewrite the traversal iteratively with an explicit stack. C++ and Java hit real stack overflows at similar depths.',
      },
    ],
    related: ['bfs-level-order', 'knapsack-01', 'trie'],
  },

  // ==========================================================================
  {
    slug: 'topological-sort',
    name: "Topo Sort (Kahn's)",
    category: 'graph',
    oneLiner:
      'Order tasks so every prerequisite comes first — and detect impossible cycles for free.',
    triggers: [
      '"Prerequisites", "dependencies", "must happen before"',
      '"Course schedule", "build order", "task ordering"',
      '"Is there a valid ordering?" — which is really "is the graph acyclic?"',
      'A **directed** graph where you need a linear order',
      '"Alien dictionary" — deduce an alphabet from ordered words',
    ],
    idea: [
      'Kahn\'s algorithm is BFS with a twist: count how many prerequisites each node has (its **in-degree**), start from every node with in-degree 0, and each time you output a node, decrement its neighbours\' counts. A neighbour whose count reaches 0 has all its prerequisites satisfied, so it joins the queue.',
      'Cycle detection comes free. If you finish and have output fewer than `n` nodes, the leftovers are all stuck waiting on each other — that is a cycle, and no valid ordering exists. Comparing `count == n` is usually the entire answer to "can all courses be finished?".',
      'Building the graph correctly is where most of the errors happen. For a pair `[a, b]` meaning "b before a", the edge runs `b → a` and `a`\'s in-degree increases. Get that direction backwards and you compute a valid ordering of the reversed problem, which looks right until a test catches it.',
      'The DFS alternative pushes each node onto a stack after all its descendants are done, then reverses. It is shorter but needs three colours (unvisited / in-progress / done) to detect cycles. Kahn\'s is easier to get right under time pressure, and its "is there a cycle?" answer is a single comparison.',
    ],
    time: 'O(V + E)',
    timeShort: 'O(V + E)',
    space: 'O(V + E)',
    template: {
      cpp: `// Kahn's algorithm. edges[i] = {a, b} means "b must come before a".
vector<vector<int>> adj(n);
vector<int> indeg(n, 0);

for (auto& e : edges) {
    adj[e[1]].push_back(e[0]);       // b -> a
    indeg[e[0]]++;                   // a gains a prerequisite
}

queue<int> q;
for (int i = 0; i < n; i++)
    if (indeg[i] == 0) q.push(i);    // no prerequisites -> ready now

vector<int> order;
while (!q.empty()) {
    int node = q.front(); q.pop();
    order.push_back(node);

    for (int next : adj[node])
        if (--indeg[next] == 0) q.push(next);   // last prerequisite cleared
}

// fewer than n nodes emitted -> a cycle blocked the rest
return order.size() == n ? order : vector<int>{};`,
      java: `// Kahn's algorithm. edges[i] = {a, b} means "b must come before a".
List<List<Integer>> adj = new ArrayList<>();
for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
int[] indeg = new int[n];

for (int[] e : edges) {
    adj.get(e[1]).add(e[0]);         // b -> a
    indeg[e[0]]++;                   // a gains a prerequisite
}

Queue<Integer> q = new ArrayDeque<>();
for (int i = 0; i < n; i++)
    if (indeg[i] == 0) q.add(i);     // no prerequisites -> ready now

List<Integer> order = new ArrayList<>();
while (!q.isEmpty()) {
    int node = q.poll();
    order.add(node);

    for (int next : adj.get(node))
        if (--indeg[next] == 0) q.add(next);    // last prerequisite cleared
}

// fewer than n nodes emitted -> a cycle blocked the rest
return order.size() == n ? order : new ArrayList<>();`,
      python: `from collections import deque

# Kahn's algorithm. edges[i] = [a, b] means "b must come before a".
adj = [[] for _ in range(n)]
indeg = [0] * n

for a, b in edges:
    adj[b].append(a)                 # b -> a
    indeg[a] += 1                    # a gains a prerequisite

q = deque(i for i in range(n) if indeg[i] == 0)   # ready now

order = []
while q:
    node = q.popleft()
    order.append(node)

    for nxt in adj[node]:
        indeg[nxt] -= 1
        if indeg[nxt] == 0:          # last prerequisite cleared
            q.append(nxt)

# fewer than n nodes emitted -> a cycle blocked the rest
return order if len(order) == n else []`,
    },
    problems: [
      {
        title: 'Course Schedule',
        slug: 'course-schedule',
        difficulty: 'Medium',
        note: 'Only asks "is it possible?" — so just compare the count with n.',
      },
      {
        title: 'Course Schedule II',
        slug: 'course-schedule-ii',
        difficulty: 'Medium',
        note: 'The same code, now returning the order. The template exactly.',
      },
      {
        title: 'Find Eventual Safe States',
        slug: 'find-eventual-safe-states',
        difficulty: 'Medium',
        note: 'Reverse the edges and topo-sort — a neat reframing.',
      },
      {
        title: 'Minimum Height Trees',
        slug: 'minimum-height-trees',
        difficulty: 'Medium',
        note: 'Peel leaves layer by layer. Kahn on an undirected graph.',
      },
      {
        title: 'Alien Dictionary',
        slug: 'alien-dictionary',
        difficulty: 'Hard',
        note: 'Deriving the edges from word pairs is most of the work.',
      },
    ],
    pitfalls: [
      {
        title: 'Building the edges backwards',
        body: 'LeetCode\'s `[a, b]` in Course Schedule means "take b before a", so the edge is `b → a`. Reversing it produces a plausible-looking ordering that fails on the first asymmetric test.',
      },
      {
        title: 'Forgetting the cycle check',
        body: 'The loop terminates happily on a cyclic graph — it just emits fewer nodes. If you return `order` without comparing its length to `n`, cyclic inputs silently return a truncated ordering instead of "impossible".',
      },
      {
        title: 'Decrementing in-degree more than once per edge',
        body: 'With duplicate edges in the input, `indeg` is incremented twice but you may only decrement once. Either de-duplicate when building, or make sure every increment has exactly one matching decrement.',
      },
      {
        title: 'Applying it to an undirected graph',
        body: 'Topological order is only defined for directed acyclic graphs. Undirected edges give every node an in-degree from both sides, and the queue starts empty. Minimum Height Trees works only because it deliberately peels degree-1 leaves, which is a different algorithm wearing the same clothes.',
      },
    ],
    related: ['bfs-level-order', 'dfs-backtracking', 'union-find'],
  },

  // ==========================================================================
  {
    slug: 'dijkstra',
    name: 'Dijkstra',
    category: 'graph',
    oneLiner:
      'BFS with a priority queue — always expand the cheapest frontier node next.',
    triggers: [
      '"Shortest / cheapest / fastest path" with **weighted** edges',
      '"Minimum cost to reach", "network delay time", "path with minimum effort"',
      'All weights are **non-negative** (otherwise you need Bellman-Ford)',
      'A grid where moving between cells costs different amounts',
      '"Maximum probability path" — the same algorithm with a flipped comparator',
    ],
    idea: [
      'Dijkstra is BFS where the queue is replaced by a **min-heap keyed on distance**. BFS works for unweighted graphs because the first arrival is always cheapest; with weights that stops being true, and the heap restores it by always expanding the cheapest unfinalised node.',
      'The invariant: when a node is popped from the heap, its distance is **final**. Nothing still in the heap is cheaper, and since no edge has negative weight, no future path can improve it. That is exactly why negative edges break the algorithm — they would let a later, cheaper route appear after you had already committed.',
      'Use the **lazy** version. Rather than decreasing keys inside the heap (which most standard libraries do not support), just push a new `(dist, node)` pair whenever you find an improvement, and skip stale entries on pop with `if (d > dist[node]) continue;`. The heap may hold up to E entries, which is fine.',
      'Everything else is bookkeeping: a `dist` array seeded to infinity with `dist[start] = 0`, and a relaxation step `if (dist[u] + w < dist[v])` that updates and pushes. If a problem asks for something other than a sum — the maximum edge on a path, say — only that comparison changes.',
    ],
    time: 'O((V + E) log V)',
    timeShort: 'O(E log V)',
    space: 'O(V + E)',
    template: {
      cpp: `// Lazy Dijkstra. adj[u] = list of {v, weight}.
vector<long long> dist(n, LLONG_MAX);
priority_queue<pair<long long,int>,
               vector<pair<long long,int>>,
               greater<>> pq;          // MIN-heap on distance

dist[start] = 0;
pq.push({0, start});

while (!pq.empty()) {
    auto [d, u] = pq.top(); pq.pop();

    if (d > dist[u]) continue;         // stale entry — already improved

    for (auto& [v, w] : adj[u]) {
        if (d + w < dist[v]) {         // relax
            dist[v] = d + w;
            pq.push({dist[v], v});
        }
    }
}
return dist;`,
      java: `// Lazy Dijkstra. adj.get(u) = list of {v, weight}.
long[] dist = new long[n];
Arrays.fill(dist, Long.MAX_VALUE);
PriorityQueue<long[]> pq =
    new PriorityQueue<>((a, b) -> Long.compare(a[0], b[0]));   // MIN-heap

dist[start] = 0;
pq.add(new long[]{0, start});

while (!pq.isEmpty()) {
    long[] cur = pq.poll();
    long d = cur[0]; int u = (int) cur[1];

    if (d > dist[u]) continue;         // stale entry — already improved

    for (int[] e : adj.get(u)) {
        int v = e[0], w = e[1];
        if (d + w < dist[v]) {         // relax
            dist[v] = d + w;
            pq.add(new long[]{dist[v], v});
        }
    }
}
return dist;`,
      python: `import heapq

# Lazy Dijkstra. adj[u] = list of (v, weight).
dist = [float("inf")] * n
pq = [(0, start)]                      # MIN-heap on distance

dist[start] = 0

while pq:
    d, u = heapq.heappop(pq)

    if d > dist[u]:
        continue                       # stale entry — already improved

    for v, w in adj[u]:
        if d + w < dist[v]:            # relax
            dist[v] = d + w
            heapq.heappush(pq, (dist[v], v))

return dist`,
    },
    problems: [
      {
        title: 'Network Delay Time',
        slug: 'network-delay-time',
        difficulty: 'Medium',
        note: 'The template, then take the max over all distances.',
      },
      {
        title: 'Path With Minimum Effort',
        slug: 'path-with-minimum-effort',
        difficulty: 'Medium',
        note: 'Cost is the max edge on the path, not the sum — change one comparison.',
      },
      {
        title: 'Cheapest Flights Within K Stops',
        slug: 'cheapest-flights-within-k-stops',
        difficulty: 'Medium',
        note: 'The stop limit breaks plain Dijkstra. Bellman-Ford is the cleaner fit.',
      },
      {
        title: 'Path with Maximum Probability',
        slug: 'path-with-maximum-probability',
        difficulty: 'Medium',
        note: 'Multiply instead of add, and use a max-heap.',
      },
      {
        title: 'Swim in Rising Water',
        slug: 'swim-in-rising-water',
        difficulty: 'Hard',
        note: 'Dijkstra on a grid — or binary search plus BFS. Both are instructive.',
      },
    ],
    pitfalls: [
      {
        title: 'Using it with negative weights',
        body: 'The "popped means final" invariant fails, and the answer is silently wrong rather than crashing. Negative edges need Bellman-Ford (O(V·E)), which also detects negative cycles.',
      },
      {
        title: 'Forgetting the stale-entry skip',
        body: 'Without `if (d > dist[u]) continue;` you reprocess nodes that were already finalised. It still terminates and often gives the right answer, but the runtime degrades badly and can time out on large graphs.',
      },
      {
        title: 'Overflow when seeding with `INT_MAX`',
        body: '`dist[u] + w` overflows if `dist[u]` is `INT_MAX`. Use `long long` / `long`, or guard the relaxation with an "is it reachable yet?" check. The symptom is a negative distance appearing from nowhere.',
      },
      {
        title: 'Java: building a max-heap by negating',
        body: '`PriorityQueue` is a min-heap. For maximum-probability problems either negate the values or pass `(a, b) -> Double.compare(b[0], a[0])`. Negating a `double` probability and forgetting to negate it back is a common source of confusing output.',
      },
    ],
    related: ['bfs-level-order', 'two-heaps', 'union-find'],
  },

  // ==========================================================================
  {
    slug: 'union-find',
    name: 'Union-Find',
    category: 'graph',
    oneLiner:
      'Track "are these two in the same group?" under merging, in near-constant time.',
    triggers: [
      '"Are these two connected?", "how many groups / provinces / components?"',
      'Edges arrive **one at a time** and you must answer as you go',
      '"Detect a cycle" in an **undirected** graph',
      '"Redundant connection", "accounts merge", "number of islands II"',
      'Kruskal\'s minimum spanning tree',
    ],
    idea: [
      'Each set is a tree, and every element points at its parent. `find(x)` walks up to the root, which acts as the set\'s identity — two elements are in the same set exactly when their roots match. `union(a, b)` points one root at the other, merging both trees in O(1).',
      'Two optimisations make it fast, and you should always write both. **Path compression**: during `find`, re-point every node you pass directly at the root, flattening the tree. **Union by size or rank**: always attach the smaller tree under the larger, so the depth never grows unnecessarily. Together they give an amortised cost of α(n) — under 5 for any input that fits in memory.',
      'Union-find beats DFS/BFS specifically when the graph is **dynamic**. If edges arrive over time and you must answer connectivity queries between insertions, re-running a traversal each time is O(V + E) per query; union-find answers in effectively O(1). If the graph is fixed and you just want components once, plain DFS is simpler.',
      'Have `union` return a boolean: `false` when both elements already share a root. That single return value answers "did this edge create a cycle?" and is exactly what Redundant Connection and Kruskal\'s algorithm need.',
    ],
    time: 'O(α(n)) ≈ O(1) amortised per operation',
    timeShort: 'O(α(n))',
    space: 'O(n)',
    template: {
      cpp: `struct DSU {
    vector<int> parent, size;
    int components;

    DSU(int n) : parent(n), size(n, 1), components(n) {
        iota(parent.begin(), parent.end(), 0);    // each node is its own root
    }

    int find(int x) {
        if (parent[x] != x)
            parent[x] = find(parent[x]);          // PATH COMPRESSION
        return parent[x];
    }

    bool unite(int a, int b) {
        int ra = find(a), rb = find(b);
        if (ra == rb) return false;               // already joined -> a cycle

        if (size[ra] < size[rb]) swap(ra, rb);    // UNION BY SIZE
        parent[rb] = ra;
        size[ra] += size[rb];
        components--;
        return true;
    }
};`,
      java: `class DSU {
    int[] parent, size;
    int components;

    DSU(int n) {
        parent = new int[n];
        size = new int[n];
        components = n;
        for (int i = 0; i < n; i++) { parent[i] = i; size[i] = 1; }
    }

    int find(int x) {
        if (parent[x] != x)
            parent[x] = find(parent[x]);          // PATH COMPRESSION
        return parent[x];
    }

    boolean unite(int a, int b) {
        int ra = find(a), rb = find(b);
        if (ra == rb) return false;               // already joined -> a cycle

        if (size[ra] < size[rb]) { int t = ra; ra = rb; rb = t; }   // BY SIZE
        parent[rb] = ra;
        size[ra] += size[rb];
        components--;
        return true;
    }
}`,
      python: `class DSU:
    def __init__(self, n):
        self.parent = list(range(n))              # each node is its own root
        self.size = [1] * n
        self.components = n

    def find(self, x):
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]   # PATH COMPRESSION
            x = self.parent[x]
        return x

    def unite(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return False                          # already joined -> a cycle

        if self.size[ra] < self.size[rb]:         # UNION BY SIZE
            ra, rb = rb, ra
        self.parent[rb] = ra
        self.size[ra] += self.size[rb]
        self.components -= 1
        return True`,
    },
    problems: [
      {
        title: 'Number of Provinces',
        slug: 'number-of-provinces',
        difficulty: 'Medium',
        note: 'Union every edge, then read `components`. The simplest use.',
      },
      {
        title: 'Redundant Connection',
        slug: 'redundant-connection',
        difficulty: 'Medium',
        note: 'The first edge where `unite` returns false is the answer.',
      },
      {
        title: 'Number of Operations to Make Network Connected',
        slug: 'number-of-operations-to-make-network-connected',
        difficulty: 'Medium',
        note: 'Count spare cables against `components - 1`.',
      },
      {
        title: 'Accounts Merge',
        slug: 'accounts-merge',
        difficulty: 'Medium',
        note: 'Union-find over strings — map emails to indices first.',
      },
      {
        title: 'Number of Islands II',
        slug: 'number-of-islands-ii',
        difficulty: 'Hard',
        note: 'The dynamic case, where union-find genuinely beats re-running DFS.',
      },
    ],
    pitfalls: [
      {
        title: 'Comparing `a == b` instead of `find(a) == find(b)`',
        body: 'Membership is decided by *roots*, never by the raw values. Comparing the elements themselves makes every `unite` succeed and the component count collapses to 1.',
      },
      {
        title: 'Skipping path compression',
        body: 'Without it the trees degenerate into linked lists and `find` becomes O(n), so the whole solution slips to O(n²) and times out. It is three lines — always include it.',
      },
      {
        title: 'Union by size, applied to the wrong node',
        body: 'After the swap, `ra` must be the larger root and `rb` gets attached under it. Writing `parent[ra] = rb` after swapping inverts the optimisation and quietly makes the trees deeper.',
      },
      {
        title: 'Using it for directed-graph cycles',
        body: 'Union-find detects cycles in **undirected** graphs only. A directed cycle needs DFS with three colours, or Kahn\'s algorithm — `1 → 2` and `1 → 3` would wrongly look like a cycle to a DSU.',
      },
    ],
    related: ['topological-sort', 'dfs-backtracking', 'greedy'],
  },

  // ==========================================================================
  {
    slug: 'trie',
    name: 'Trie',
    category: 'tree',
    oneLiner:
      'A tree keyed by characters — prefix questions answered in O(length), not O(dictionary).',
    triggers: [
      '"Starts with", "prefix", "autocomplete", "does any word begin with…"',
      'Many searches against **one fixed dictionary**',
      '"Word search II" — matching many words against a board at once',
      '"Replace words", "longest common prefix", "search with wildcards"',
      'Bitwise: "maximum XOR pair" (a trie over the bits of each number)',
    ],
    idea: [
      'A trie stores words by *path*, not by node. The root is the empty prefix, each edge is a character, and a word is a walk from the root. Every shared prefix is stored exactly once, so lookup costs O(length of the word) regardless of how many words the dictionary holds — a hash set can match a whole word that fast, but it cannot answer prefix questions at all.',
      'Each node needs two things: links to children (a 26-slot array for lowercase input, or a map for a larger alphabet), and a boolean marking "a word ends here". That flag matters — without it, inserting "apple" would make `search("app")` return true.',
      '`insert` and `search` are the same walk; they differ only in what happens when a child is missing. `insert` creates it; `search` returns false. `startsWith` is `search` without the final flag check, which is why the two share almost all their code.',
      'A trie shines when you can walk many candidates in lockstep. Word Search II is the showcase: instead of running a separate DFS per word, you DFS the board once while descending the trie, and prune the moment the current path is not a prefix of anything. That turns an intractable search into a fast one.',
    ],
    time: 'O(L) per insert / search, where L is the word length',
    timeShort: 'O(L)',
    space: 'O(total characters × alphabet size)',
    template: {
      cpp: `struct TrieNode {
    TrieNode* children[26] = {nullptr};
    bool isWord = false;                 // a word ENDS here
};

class Trie {
    TrieNode* root = new TrieNode();

public:
    void insert(const string& word) {
        TrieNode* node = root;
        for (char c : word) {
            int i = c - 'a';
            if (!node->children[i])
                node->children[i] = new TrieNode();   // create as needed
            node = node->children[i];
        }
        node->isWord = true;             // mark the end
    }

    bool search(const string& word) { return find(word) != nullptr && find(word)->isWord; }
    bool startsWith(const string& p)  { return find(p) != nullptr; }

private:
    TrieNode* find(const string& s) {
        TrieNode* node = root;
        for (char c : s) {
            int i = c - 'a';
            if (!node->children[i]) return nullptr;   // path breaks -> absent
            node = node->children[i];
        }
        return node;
    }
};`,
      java: `class TrieNode {
    TrieNode[] children = new TrieNode[26];
    boolean isWord = false;              // a word ENDS here
}

class Trie {
    private final TrieNode root = new TrieNode();

    public void insert(String word) {
        TrieNode node = root;
        for (char c : word.toCharArray()) {
            int i = c - 'a';
            if (node.children[i] == null)
                node.children[i] = new TrieNode();    // create as needed
            node = node.children[i];
        }
        node.isWord = true;              // mark the end
    }

    public boolean search(String word)     { TrieNode n = find(word); return n != null && n.isWord; }
    public boolean startsWith(String p)    { return find(p) != null; }

    private TrieNode find(String s) {
        TrieNode node = root;
        for (char c : s.toCharArray()) {
            int i = c - 'a';
            if (node.children[i] == null) return null;   // path breaks -> absent
            node = node.children[i];
        }
        return node;
    }
}`,
      python: `class TrieNode:
    def __init__(self):
        self.children = {}               # char -> TrieNode
        self.is_word = False             # a word ENDS here


class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for c in word:
            if c not in node.children:
                node.children[c] = TrieNode()         # create as needed
            node = node.children[c]
        node.is_word = True              # mark the end

    def search(self, word):
        node = self._find(word)
        return node is not None and node.is_word

    def startsWith(self, prefix):
        return self._find(prefix) is not None

    def _find(self, s):
        node = self.root
        for c in s:
            if c not in node.children:
                return None              # path breaks -> absent
            node = node.children[c]
        return node`,
    },
    problems: [
      {
        title: 'Implement Trie (Prefix Tree)',
        slug: 'implement-trie-prefix-tree',
        difficulty: 'Medium',
        note: 'The template, asked directly.',
      },
      {
        title: 'Longest Common Prefix',
        slug: 'longest-common-prefix',
        difficulty: 'Easy',
        note: 'Solvable without a trie, but building one makes the idea concrete.',
      },
      {
        title: 'Replace Words',
        slug: 'replace-words',
        difficulty: 'Medium',
        note: 'Walk each word until you hit an `isWord` node. A natural fit.',
      },
      {
        title: 'Design Add and Search Words Data Structure',
        slug: 'design-add-and-search-words-data-structure',
        difficulty: 'Medium',
        note: 'The `.` wildcard forces DFS over all children at that level.',
      },
      {
        title: 'Word Search II',
        slug: 'word-search-ii',
        difficulty: 'Hard',
        note: 'Trie + grid backtracking. The reason tries are worth learning.',
      },
    ],
    pitfalls: [
      {
        title: 'Forgetting the `isWord` flag',
        body: 'Without it, inserting "apple" makes `search("app")` return true, because the path exists. The flag is what separates "this is a prefix" from "this is a word".',
      },
      {
        title: 'Assuming lowercase a–z',
        body: 'The 26-slot array breaks on uppercase, digits or Unicode — `c - \'a\'` produces a negative index and an out-of-bounds crash. Use a hash map for children if the alphabet is not guaranteed.',
      },
      {
        title: 'Building a trie when a hash set would do',
        body: 'For exact-match lookup only, a hash set is faster and far less code. The trie earns its keep when you need *prefixes*, wildcards, or lockstep matching of many words.',
      },
      {
        title: 'Not pruning in Word Search II',
        body: 'Without removing matched words (or dead branches) from the trie you re-find the same word from every starting cell and duplicate the output. Clearing `isWord` after a match is the usual fix.',
      },
    ],
    related: ['hash-map-set', 'dfs-backtracking', 'bit-manipulation'],
  },
];
