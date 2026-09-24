import type { SharedLesson } from './types';

/**
 * Union-Find — Dynamic connectivity, disjoint-set forests, parent array
 * representation, union by rank and size, path compression, and component
 * tracking with cycle detection.
 */
export const lessons: SharedLesson[] = [
  // =========================================================================
  // Lesson 1: The connectivity question
  // =========================================================================
  {
    sub: 1,
    summary: 'Model dynamic network connectivity, analyze why static graph searches fall short on streaming edges, and evaluate the Quick-Find baseline.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'The **dynamic connectivity** problem asks whether two vertices in a network share a connection when relationships arrive incrementally over time. Given `n` elements labelled 0 through `n - 1`, we must support two operations: adding an edge between a pair of elements, and querying whether two elements belong to the same connected group. Connectivity in an undirected network is an **equivalence relation**: it is reflexive (every element connects to itself), symmetric (if `p` connects to `q`, then `q` connects to `p`), and transitive (if `p` connects to `q` and `q` connects to `r`, then `p` connects to `r`). These connections partition elements into disjoint subsets called **connected components**.',
      },
      { kind: 'heading', text: 'Streaming edges versus graph traversals' },
      {
        kind: 'text',
        body: 'When all edges are known in advance, one can construct an adjacency list and run Breadth-First Search (BFS) or Depth-First Search (DFS) once in O(V + E) time. However, in streaming scenarios like dynamic networks, edges arrive one by one intermingled with queries. Running a traversal from scratch after each edge costs O(V + E) per query. For Q queries on V vertices and E edges, this incurs an impractical O(Q * (V + E)) total runtime.',
      },
      { kind: 'heading', text: 'The Quick-Find baseline' },
      {
        kind: 'text',
        body: 'The **Quick-Find** algorithm maintains an array `id` of size `n`, where `id[i]` stores the component identifier of element `i`. Checking connectivity takes O(1) time via `id[p] == id[q]`. However, merging two components requires scanning the full array to rewrite every entry matching `id[p]` to `id[q]`, demanding O(n) time per union.',
      },
      {
        kind: 'code',
        caption: 'Quick-Find implementation with O(1) queries and O(n) union',
        code: {
          cpp: `#include <vector>
using namespace std;

class QuickFind {
    vector<int> id;
public:
    QuickFind(int n) : id(n) {
        for (int i = 0; i < n; i++) id[i] = i;
    }
    bool connected(int p, int q) { return id[p] == id[q]; }
    void unionSets(int p, int q) {
        int pid = id[p], qid = id[q];
        if (pid == qid) return;
        for (int i = 0; i < (int)id.size(); i++) {
            if (id[i] == pid) id[i] = qid;
        }
    }
};`,
          java: `public class QuickFind {
    private int[] id;
    public QuickFind(int n) {
        id = new int[n];
        for (int i = 0; i < n; i++) id[i] = i;
    }
    public boolean connected(int p, int q) { return id[p] == id[q]; }
    public void union(int p, int q) {
        int pid = id[p], qid = id[q];
        if (pid == qid) return;
        for (int i = 0; i < id.length; i++) {
            if (id[i] == pid) id[i] = qid;
        }
    }
}`,
          python: `class QuickFind:
    def __init__(self, n: int) -> None:
        self.id = list(range(n))

    def connected(self, p: int, q: int) -> bool:
        return self.id[p] == self.id[q]

    def union(self, p: int, q: int) -> None:
        pid, qid = self.id[p], self.id[q]
        if pid == qid:
            return
        for i in range(len(self.id)):
            if self.id[i] == pid:
                self.id[i] = qid`,
        },
      },
      { kind: 'heading', text: 'Complexity comparison' },
      {
        kind: 'table',
        headers: ['Approach', 'Find / Query', 'Union', 'Space'],
        rows: [
          ['BFS / DFS per query', 'O(V + E)', 'O(1) append', 'O(V + E)'],
          ['Quick-Find', 'O(1)', 'O(n)', 'O(n)'],
          ['Target Disjoint-Set', 'Amortized O(1)', 'Amortized O(1)', 'O(n)'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'The quadratic cost of Quick-Find',
        body: 'Executing n - 1 unions with Quick-Find requires scanning all n entries on every step, producing O(n^2) total work. For n = 100,000, 10^10 operations exceed runtime limits. Quick-Find is only suitable when queries far outnumber union operations.',
      },
    ],
    keyTakeaways: [
      'Dynamic connectivity handles interleaved edge additions and path queries on streaming data.',
      'Equivalence relations divide elements into disjoint connected components.',
      'Quick-Find provides O(1) queries by storing flat component identifiers in an array.',
      'Quick-Find requires O(n) time per union, accumulating to O(n^2) time to connect n nodes.',
    ],
    practice: {
      prompt: 'Given an integer n and an edge list representing bidirectional graph edges, determine whether a valid path exists between a given source and destination vertex.',
      leetcode: { title: 'Find if Path Exists in Graph', slug: 'find-if-path-exists-in-graph' },
    },
  },

  // =========================================================================
  // Lesson 2: Parent array and find
  // =========================================================================
  {
    sub: 2,
    summary: 'Represent disjoint sets as parent-pointer trees inside a flat array and navigate component roots with the Quick-Union find operation.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'To avoid the O(n) array scan of Quick-Find, we restructure data into a collection of directed trees called a **disjoint-set forest** or **Quick-Union**. Rather than storing identical component labels, each element stores a pointer to its **parent**. Elements sharing the same tree belong to the same component. The node at the top of each tree points to itself and serves as the **root** or component representative.',
      },
      { kind: 'heading', text: 'The parent array representation' },
      {
        kind: 'text',
        body: 'An array `parent` of size `n` initially holds `parent[i] = i`. To find the component root of `u`, we trace parent pointers upward: `while (u != parent[u]) u = parent[u]; return u;`. Two elements belong to the same component if and only if their roots match.',
      },
      { kind: 'heading', text: 'Quick-Union linking' },
      {
        kind: 'text',
        body: 'Connecting `p` and `q` resolves their roots `rootP = find(p)` and `rootQ = find(q)`. If the roots differ, we set `parent[rootP] = rootQ`. This modifies one pointer in O(1) time once roots are located, but runtime is bound by tree depth.',
      },
      {
        kind: 'code',
        caption: 'Quick-Union tree representation with parent navigation',
        code: {
          cpp: `#include <vector>
using namespace std;

class QuickUnion {
    vector<int> parent;
public:
    QuickUnion(int n) : parent(n) {
        for (int i = 0; i < n; i++) parent[i] = i;
    }
    int find(int u) {
        while (u != parent[u]) u = parent[u];
        return u;
    }
    bool connected(int p, int q) { return find(p) == find(q); }
    void unionSets(int p, int q) {
        int rootP = find(p), rootQ = find(q);
        if (rootP != rootQ) parent[rootP] = rootQ;
    }
};`,
          java: `public class QuickUnion {
    private int[] parent;
    public QuickUnion(int n) {
        parent = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
    }
    public int find(int u) {
        while (u != parent[u]) u = parent[u];
        return u;
    }
    public boolean connected(int p, int q) { return find(p) == find(q); }
    public void union(int p, int q) {
        int rootP = find(p), rootQ = find(q);
        if (rootP != rootQ) parent[rootP] = rootQ;
    }
}`,
          python: `class QuickUnion:
    def __init__(self, n: int) -> None:
        self.parent = list(range(n))

    def find(self, u: int) -> int:
        while u != self.parent[u]:
            u = self.parent[u]
        return u

    def connected(self, p: int, q: int) -> bool:
        return self.find(p) == self.find(q)

    def union(self, p: int, q: int) -> None:
        root_p, root_q = self.find(p), self.find(q)
        if root_p != root_q:
            self.parent[root_p] = root_q`,
        },
      },
      { kind: 'heading', text: 'Tree height and runtime analysis' },
      {
        kind: 'table',
        headers: ['Operation', 'Best Case', 'Worst Case', 'Degenerate Cause'],
        rows: [
          ['find(u)', 'O(1)', 'O(n)', 'Tree forms a linear chain'],
          ['union(u, v)', 'O(1)', 'O(n)', 'Dominated by root traversal'],
          ['connected(u, v)', 'O(1)', 'O(n)', 'Requires two root lookups'],
          ['Space', 'O(n)', 'O(n)', 'One parent index per element'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Linking elements instead of their roots',
        body: 'Writing `parent[p] = q` instead of finding the roots first creates invalid cycles or detaches subtrees from their actual component root. Always resolve both elements to their respective roots before updating parent pointers.',
      },
    ],
    keyTakeaways: [
      'Quick-Union represents disjoint sets as trees stored inside a parent array.',
      'A component representative is identified by the invariant parent[root] == root.',
      'Union connects two components by pointing one root to the other root.',
      'Without tree balancing, sequential unions can degenerate into linear chains of depth n.',
    ],
    practice: {
      prompt: 'Implement a disjoint-set class using a parent array. Connect pairs of elements from an edge list and determine the component root of each element after all connections are formed.',
      leetcode: { title: 'Number of Provinces', slug: 'number-of-provinces' },
    },
  },

  // =========================================================================
  // Lesson 3: Union by rank and size
  // =========================================================================
  {
    sub: 3,
    summary: 'Prevent tree degeneration by attaching shallower trees under deeper trees using union by rank and union by size.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Arbitrary linking in Quick-Union can produce degenerate linear chains of depth `n` (for instance, linking 0-1, 1-2, 2-3), degrading `find` to O(n). To prevent this, we balance trees using **union by rank** or **union by size**.',
      },
      { kind: 'heading', text: 'Size and rank heuristics' },
      {
        kind: 'text',
        body: 'Both heuristics attach the smaller or shallower tree under the root of the larger or deeper tree. In union by size, an array tracks element counts per subtree, linking smaller roots to larger roots. In union by rank, an array tracks tree height bounds, linking smaller-rank roots under larger-rank roots. If ranks are equal, either root may become parent and its rank increments by one. Because a tree of rank `k` requires at least `2^k` nodes, maximum tree height is strictly bounded by `floor(log2(n))`, guaranteeing O(log n) worst-case time.',
      },
      {
        kind: 'code',
        caption: 'Disjoint-set forest with union by rank',
        code: {
          cpp: `#include <vector>
using namespace std;

class DisjointSet {
    vector<int> parent, rank;
public:
    DisjointSet(int n) : parent(n), rank(n, 0) {
        for (int i = 0; i < n; i++) parent[i] = i;
    }
    int find(int u) {
        while (u != parent[u]) u = parent[u];
        return u;
    }
    bool unionByRank(int u, int v) {
        int rootU = find(u), rootV = find(v);
        if (rootU == rootV) return false;
        if (rank[rootU] < rank[rootV]) {
            parent[rootU] = rootV;
        } else if (rank[rootU] > rank[rootV]) {
            parent[rootV] = rootU;
        } else {
            parent[rootV] = rootU;
            rank[rootU]++;
        }
        return true;
    }
};`,
          java: `public class DisjointSet {
    private int[] parent, rank;
    public DisjointSet(int n) {
        parent = new int[n];
        rank = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
    }
    public int find(int u) {
        while (u != parent[u]) u = parent[u];
        return u;
    }
    public boolean unionByRank(int u, int v) {
        int rootU = find(u), rootV = find(v);
        if (rootU == rootV) return false;
        if (rank[rootU] < rank[rootV]) {
            parent[rootU] = rootV;
        } else if (rank[rootU] > rank[rootV]) {
            parent[rootV] = rootU;
        } else {
            parent[rootV] = rootU;
            rank[rootU]++;
        }
        return true;
    }
}`,
          python: `class DisjointSet:
    def __init__(self, n: int) -> None:
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, u: int) -> int:
        while u != self.parent[u]:
            u = self.parent[u]
        return u

    def union_by_rank(self, u: int, v: int) -> bool:
        root_u, root_v = self.find(u), self.find(v)
        if root_u == root_v:
            return False
        if self.rank[root_u] < self.rank[root_v]:
            self.parent[root_u] = root_v
        elif self.rank[root_u] > self.rank[root_v]:
            self.parent[root_v] = root_u
        else:
            self.parent[root_v] = root_u
            self.rank[root_u] += 1
        return True`,
        },
      },
      { kind: 'heading', text: 'Comparison of linking strategies' },
      {
        kind: 'table',
        headers: ['Strategy', 'Find Worst-Case', 'Union Worst-Case', 'Max Tree Depth', 'Space'],
        rows: [
          ['Arbitrary linking', 'O(n)', 'O(n)', 'n - 1', 'O(n) parent'],
          ['Union by size', 'O(log n)', 'O(log n)', 'floor(log2(n))', 'O(n) parent + size'],
          ['Union by rank', 'O(log n)', 'O(log n)', 'floor(log2(n))', 'O(n) parent + rank'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Incrementing rank on every union',
        body: 'When two roots have unequal ranks, attaching the lower-rank root under the higher-rank root leaves the maximum depth unchanged. Rank must only increment when merging two roots of identical rank. Incrementing rank unconditionally distorts the height bound and leads to suboptimal balance.',
      },
    ],
    keyTakeaways: [
      'Arbitrary linking permits linear chains of depth n where find degrades to O(n).',
      'Union by rank and size attach the shorter or smaller tree under the deeper or larger root.',
      'A tree of rank k requires at least 2^k nodes, bounding tree height by floor(log2(n)).',
      'Union by rank guarantees O(log n) worst-case time for both find and union operations.',
    ],
    practice: {
      prompt: 'Given an array of strings representing equality and inequality equations between single-letter variables, determine if all equations can be satisfied simultaneously.',
      leetcode: { title: 'Satisfiability of Equality Equations', slug: 'satisfiability-of-equality-equations' },
    },
  },

  // =========================================================================
  // Lesson 4: Path compression
  // =========================================================================
  {
    sub: 4,
    summary: 'Flatten disjoint-set trees during find operations using path compression to reach amortized near-constant time.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Union by rank bounds tree height to O(log n), but queries can be optimized further. Whenever `find(u)` executes, it traverses ancestors from `u` to root `r`. Because all visited nodes belong to root `r`, **path compression** flattens the tree by rewiring every node along the path to point directly to `r`. Subsequent lookups for any of these nodes take O(1) time.',
      },
      { kind: 'heading', text: 'Two-pass recursive compression' },
      {
        kind: 'text',
        body: 'Recursive path compression flattens the path in a single assignment as the call stack unwinds: `parent[u] = find(parent[u])`. Combining union by rank with path compression yields the complete Disjoint Set Union (DSU) structure. Tarjan proved that `m` operations on `n` elements take O(m * alpha(n)) time, where `alpha` is the **inverse Ackermann function**. Because `alpha(n) <= 4` for all practical values up to `10^80`, operations run in **amortized O(1)** time.',
      },
      {
        kind: 'code',
        caption: 'Complete Disjoint Set Union with path compression and rank',
        code: {
          cpp: `#include <vector>
using namespace std;

class UnionFind {
    vector<int> parent, rank;
public:
    UnionFind(int n) : parent(n), rank(n, 0) {
        for (int i = 0; i < n; i++) parent[i] = i;
    }
    int find(int u) {
        return parent[u] == u ? u : parent[u] = find(parent[u]);
    }
    bool unionSets(int u, int v) {
        int rootU = find(u), rootV = find(v);
        if (rootU == rootV) return false;
        if (rank[rootU] < rank[rootV]) {
            parent[rootU] = rootV;
        } else if (rank[rootU] > rank[rootV]) {
            parent[rootV] = rootU;
        } else {
            parent[rootV] = rootU;
            rank[rootU]++;
        }
        return true;
    }
};`,
          java: `public class UnionFind {
    private int[] parent, rank;
    public UnionFind(int n) {
        parent = new int[n];
        rank = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
    }
    public int find(int u) {
        return parent[u] == u ? u : (parent[u] = find(parent[u]));
    }
    public boolean union(int u, int v) {
        int rootU = find(u), rootV = find(v);
        if (rootU == rootV) return false;
        if (rank[rootU] < rank[rootV]) {
            parent[rootU] = rootV;
        } else if (rank[rootU] > rank[rootV]) {
            parent[rootV] = rootU;
        } else {
            parent[rootV] = rootU;
            rank[rootU]++;
        }
        return true;
    }
}`,
          python: `class UnionFind:
    def __init__(self, n: int) -> None:
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, u: int) -> int:
        if self.parent[u] != u:
            self.parent[u] = self.find(self.parent[u])
        return self.parent[u]

    def union(self, u: int, v: int) -> bool:
        root_u, root_v = self.find(u), self.find(v)
        if root_u == root_v:
            return False
        if self.rank[root_u] < self.rank[root_v]:
            self.parent[root_u] = root_v
        elif self.rank[root_u] > self.rank[root_v]:
            self.parent[root_v] = root_u
        else:
            self.parent[root_v] = root_u
            self.rank[root_u] += 1
        return True`,
        },
      },
      { kind: 'heading', text: 'Impact of combining optimizations' },
      {
        kind: 'table',
        headers: ['Optimizations', 'Find Amortized', 'Union Amortized', 'Max Tree Depth'],
        rows: [
          ['None (naive Quick-Union)', 'O(n)', 'O(n)', 'O(n)'],
          ['Path compression only', 'O(log n)', 'O(log n)', 'O(n) single op'],
          ['Union by rank only', 'O(log n)', 'O(log n)', 'O(log n)'],
          ['Rank + Path compression', 'O(alpha(n))', 'O(alpha(n))', 'Effectively O(1)'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Do not adjust ranks during path compression',
        body: 'Path compression flattens trees, reducing their actual heights. However, do not attempt to decrement or recalculate rank during find. Computing the new exact height of a tree would require exploring all children, destroying the near-constant runtime. Rank acts as an upper bound heuristic and functions correctly without modification.',
      },
    ],
    keyTakeaways: [
      'Path compression points every visited node along a search path directly to the root.',
      'Recursive find performs path compression in one line: parent[u] = find(parent[u]).',
      'Combining union by rank and path compression achieves O(alpha(n)) amortized runtime.',
      'The inverse Ackermann function alpha(n) does not exceed 4 for any practical value of n.',
    ],
    practice: {
      prompt: 'Given an undirected graph represented by an edge list, use a complete Union-Find structure with path compression and rank to count the total number of connected components.',
      leetcode: { title: 'Number of Operations to Make Network Connected', slug: 'number-of-operations-to-make-network-connected' },
    },
  },

  // =========================================================================
  // Lesson 5: Counting components and detecting cycles
  // =========================================================================
  {
    sub: 5,
    summary: 'Track connected component counts dynamically and detect cycles in undirected networks during edge insertion.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Two primary applications of Union-Find in technical interviews are **maintaining the number of connected components** and **detecting cycles in undirected graphs**. Because Union-Find processes edges incrementally in an online stream, both properties are tracked in real time without building an adjacency list or re-running graph searches.',
      },
      { kind: 'heading', text: 'Maintaining component counts and cycle detection' },
      {
        kind: 'text',
        body: 'We initialize the component count to `n`. For each edge `(u, v)`, we compute `find(u)` and `find(v)`. If the roots differ, the edge merges two separate components, decrementing the count by one. If the roots are already identical, the vertices already share a path, meaning the edge introduces a **cycle** (a redundant connection). This principle powers Kruskal algorithm for Minimum Spanning Trees.',
      },
      {
        kind: 'code',
        caption: 'Tracking component count and detecting redundant cycle-forming edges',
        code: {
          cpp: `#include <vector>
using namespace std;

class UnionFind {
    vector<int> parent, rank;
    int count;
public:
    UnionFind(int n) : parent(n), rank(n, 0), count(n) {
        for (int i = 0; i < n; i++) parent[i] = i;
    }
    int find(int u) {
        return parent[u] == u ? u : parent[u] = find(parent[u]);
    }
    bool unionSets(int u, int v) {
        int rootU = find(u), rootV = find(v);
        if (rootU == rootV) return false;
        if (rank[rootU] < rank[rootV]) {
            parent[rootU] = rootV;
        } else if (rank[rootU] > rank[rootV]) {
            parent[rootV] = rootU;
        } else {
            parent[rootV] = rootU;
            rank[rootU]++;
        }
        count--;
        return true;
    }
    int getCount() const { return count; }
};`,
          java: `public class UnionFind {
    private int[] parent, rank;
    private int count;
    public UnionFind(int n) {
        parent = new int[n];
        rank = new int[n];
        count = n;
        for (int i = 0; i < n; i++) parent[i] = i;
    }
    public int find(int u) {
        return parent[u] == u ? u : (parent[u] = find(parent[u]));
    }
    public boolean union(int u, int v) {
        int rootU = find(u), rootV = find(v);
        if (rootU == rootV) return false;
        if (rank[rootU] < rank[rootV]) {
            parent[rootU] = rootV;
        } else if (rank[rootU] > rank[rootV]) {
            parent[rootV] = rootU;
        } else {
            parent[rootV] = rootU;
            rank[rootU]++;
        }
        count--;
        return true;
    }
    public int getCount() { return count; }
}`,
          python: `class UnionFind:
    def __init__(self, n: int) -> None:
        self.parent = list(range(n))
        self.rank = [0] * n
        self.count = n

    def find(self, u: int) -> int:
        if self.parent[u] != u:
            self.parent[u] = self.find(self.parent[u])
        return self.parent[u]

    def union(self, u: int, v: int) -> bool:
        root_u, root_v = self.find(u), self.find(v)
        if root_u == root_v:
            return False
        if self.rank[root_u] < self.rank[root_v]:
            self.parent[root_u] = root_v
        elif self.rank[root_u] > self.rank[root_v]:
            self.parent[root_v] = root_u
        else:
            self.parent[root_v] = root_u
            self.rank[root_u] += 1
        self.count -= 1
        return True

    def get_count(self) -> int:
        return self.count`,
        },
      },
      { kind: 'heading', text: 'Edge addition outcomes and invariants' },
      {
        kind: 'table',
        headers: ['Edge Condition', 'Root Evaluation', 'Component Count Effect', 'Structural Consequence'],
        rows: [
          ['Cross-component edge', 'find(u) != find(v)', 'Decrements by 1 (count--)', 'Merges two separate trees into one'],
          ['Cycle-forming edge', 'find(u) == find(v)', 'Remains unchanged', 'Identifies redundant edge creating a cycle'],
          ['Spanning tree completed', 'n - 1 successful unions', 'Reaches exactly 1', 'All vertices span a single connected tree'],
          ['Disconnected forest', 'Fewer than n - 1 unions', 'Remains at k > 1', 'Graph consists of k isolated components'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Union-Find only detects cycles in undirected graphs',
        body: 'Union-Find cannot detect cycles in directed graphs. In a directed graph, two paths 0 -> 1 and 0 -> 2 meeting at 1 -> 3 and 2 -> 3 form a directed acyclic diamond, not a cycle. Because all four vertices belong to one connected component in an undirected sense, Union-Find would mistakenly identify 2 -> 3 as a cycle edge. Use Kahn topological sort or three-color DFS for directed cycle detection.',
      },
    ],
    keyTakeaways: [
      'Initialize the component count to n and decrement it by 1 whenever union merges distinct roots.',
      'An undirected edge creates a cycle if and only if find(u) == find(v) before the edge is added.',
      'Detecting cycles during edge addition eliminates the need to build an adjacency list or run DFS.',
      'Union-Find is strictly limited to undirected cycle detection; directed graphs require topological sort or DFS.',
    ],
    practice: {
      prompt: 'Given an undirected graph that started as a tree of n nodes labelled 1 to n with one additional edge added, return an edge that can be removed so that the resulting graph is a tree. If multiple edges qualify, return the one that appears last in the input.',
      leetcode: { title: 'Redundant Connection', slug: 'redundant-connection' },
    },
  },
];
