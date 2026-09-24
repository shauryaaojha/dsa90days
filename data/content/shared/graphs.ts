import type { SharedLesson } from './types';

/**
 * Graphs — Terminology, graph representations, traversals (BFS/DFS),
 * connected components, cycle detection, topological sorting, shortest paths,
 * minimum spanning trees, and grid graphs.
 */
export const lessons: SharedLesson[] = [
  // =========================================================================
  // Lesson 1: Terminology: directed, weighted, degree, path, cycle
  // =========================================================================
  {
    sub: 1,
    summary: 'Define graph fundamentals including vertices, edges, directionality, edge weights, vertex degrees, paths, and cycles.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A **graph** G = (V, E) is a non-linear data structure consisting of a set of **vertices** (or nodes) and a collection of **edges** connecting pairs of vertices. Unlike trees, which enforce a strict root-and-child hierarchy with no cycles, graphs permit arbitrary interconnection: multiple paths between nodes, disconnected clusters, or circular loops.',
      },
      { kind: 'heading', text: 'Directionality, weights, and degrees' },
      {
        kind: 'text',
        body: 'An edge is **undirected** if it allows bidirectional traversal, and **directed** (or an arc) if travel is one-way from u to v. A graph is **weighted** when edges carry numerical values (cost, distance, latency), and **unweighted** when all edges have uniform cost. For an undirected vertex, its **degree** is the number of connected edges. In directed graphs, we distinguish **in-degree** (incoming edges) from **out-degree** (outgoing edges).',
      },
      {
        kind: 'code',
        caption: 'Computing in-degrees and out-degrees from a directed edge list',
        code: {
          cpp: `#include <bits/stdc++.h>
using namespace std;

void computeDegrees(int n, const vector<vector<int>>& edges) {
    vector<int> inDegree(n, 0), outDegree(n, 0);
    for (const auto& e : edges) {
        outDegree[e[0]]++;
        inDegree[e[1]]++;
    }
    for (int i = 0; i < n; i++) {
        cout << "Node " << i << ": in=" << inDegree[i] << ", out=" << outDegree[i] << "\\n";
    }
}`,
          java: `public void computeDegrees(int n, int[][] edges) {
    int[] inDegree = new int[n], outDegree = new int[n];
    for (int[] e : edges) {
        outDegree[e[0]]++;
        inDegree[e[1]]++;
    }
    for (int i = 0; i < n; i++) {
        System.out.println("Node " + i + ": in=" + inDegree[i] + ", out=" + outDegree[i]);
    }
}`,
          python: `def compute_degrees(n: int, edges: list[list[int]]) -> None:
    in_degree = [0] * n
    out_degree = [0] * n
    for u, v in edges:
        out_degree[u] += 1
        in_degree[v] += 1
    for i in range(n):
        print(f"Node {i}: in={in_degree[i]}, out={out_degree[i]}")`,
        },
      },
      { kind: 'heading', text: 'Paths, cycles, and trees' },
      {
        kind: 'text',
        body: 'A **path** is a sequence of vertices connected by edges; it is **simple** if no vertex repeats. A **cycle** is a path of at least one edge that starts and ends at the identical vertex. A graph without cycles is **acyclic**. A directed graph with no cycles is called a **Directed Acyclic Graph (DAG)**. A connected undirected graph with V vertices and exactly V - 1 edges is a **tree**.',
      },
      {
        kind: 'table',
        headers: ['Graph Concept', 'Definition', 'Key Invariant'],
        rows: [
          ['Undirected Edge', 'Bidirectional connection {u, v}', 'Sum of degrees = 2E (Handshaking lemma)'],
          ['Directed Edge', 'One-way connection (u -> v)', 'Sum of in-degrees = Sum of out-degrees = E'],
          ['Cycle', 'Path where start node equals end node', 'Acyclic graphs have zero cycles'],
          ['Tree', 'Connected acyclic undirected graph', 'Has exactly V - 1 edges'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Confusing 0-indexed and 1-indexed vertex labels',
        body: 'LeetCode problems often label vertices 1 to n. Allocating an array of size n and writing to index n triggers an out-of-bounds crash. Allocate arrays of size n + 1 when vertices are 1-indexed, or subtract 1 from every vertex label during graph construction.',
      },
    ],
    keyTakeaways: [
      'A graph G = (V, E) models entities (vertices) and relationships (edges).',
      'Directed graphs differentiate incoming edges (in-degree) from outgoing edges (out-degree).',
      'A cycle is a path of positive length starting and ending at the same node.',
      'Verify whether problem inputs use 0-based or 1-based vertex indexing.',
    ],
    practice: {
      prompt: 'Given n people labelled 1 to n and a list of trust pairs [a, b], find the town judge if one exists. The judge has an in-degree of n - 1 and an out-degree of 0.',
      leetcode: { title: 'Find the Town Judge', slug: 'find-the-town-judge' },
    },
  },

  // =========================================================================
  // Lesson 2: Adjacency list vs adjacency matrix
  // =========================================================================
  {
    sub: 2,
    summary: 'Compare adjacency lists and adjacency matrices, evaluating their space complexity and runtime trade-offs for edge lookups and neighbor traversal.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Storing a graph in memory requires choosing between two fundamental data structures: an **adjacency matrix** or an **adjacency list**. Picking the wrong structure can exceed memory limits or make traversals too slow to pass competitive benchmarks.',
      },
      { kind: 'heading', text: 'Matrix vs list representations' },
      {
        kind: 'text',
        body: 'An **adjacency matrix** is a 2D array of size V x V where cell `[u][v]` stores 1 (or the edge weight) if an edge connects u to v, and 0 otherwise. An **adjacency list** uses an array or list of length V, where element `adj[u]` contains only the neighbors directly adjacent to u.',
      },
      {
        kind: 'code',
        caption: 'Constructing and iterating neighbors in both graph representations',
        code: {
          cpp: `#include <bits/stdc++.h>
using namespace std;

void graphRepresentations(int n, const vector<vector<int>>& edges) {
    // Adjacency Matrix: O(V^2) space
    vector<vector<int>> matrix(n, vector<int>(n, 0));
    for (const auto& e : edges) {
        matrix[e[0]][e[1]] = matrix[e[1]][e[0]] = 1;
    }

    // Adjacency List: O(V + E) space
    vector<vector<int>> adj(n);
    for (const auto& e : edges) {
        adj[e[0]].push_back(e[1]);
        adj[e[1]].push_back(e[0]);
    }
}`,
          java: `public void graphRepresentations(int n, int[][] edges) {
    // Adjacency Matrix: O(V^2) space
    int[][] matrix = new int[n][n];
    for (int[] e : edges) {
        matrix[e[0]][e[1]] = matrix[e[1]][e[0]] = 1;
    }

    // Adjacency List: O(V + E) space
    List<List<Integer>> adj = new ArrayList<>();
    for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
    for (int[] e : edges) {
        adj.get(e[0]).add(e[1]);
        adj.get(e[1]).add(e[0]);
    }
}`,
          python: `def graph_representations(n: int, edges: list[list[int]]) -> None:
    # Adjacency Matrix: O(V^2) space
    matrix = [[0] * n for _ in range(n)]
    for u, v in edges:
        matrix[u][v] = matrix[v][u] = 1

    # Adjacency List: O(V + E) space
    adj: list[list[int]] = [[] for _ in range(n)]
    for u, v in edges:
        adj[u].append(v)
        adj[v].append(u)`,
        },
      },
      { kind: 'heading', text: 'Sparse graphs versus dense graphs' },
      {
        kind: 'text',
        body: 'A graph is **sparse** when E << V² (often E ≈ V), and **dense** when E approaches V². In competitive programming, V is frequently 10⁵ while E is also 10⁵. An adjacency matrix for 10⁵ vertices requires 10¹⁰ integers (40 GB), instantly triggering Memory Limit Exceeded (MLE). Adjacency lists take only O(V + E) memory.',
      },
      {
        kind: 'table',
        headers: ['Operation', 'Adjacency List', 'Adjacency Matrix'],
        rows: [
          ['Space Complexity', 'O(V + E)', 'O(V^2)'],
          ['Check if edge (u, v) exists', 'O(degree(u))', 'O(1)'],
          ['Iterate all neighbors of u', 'O(degree(u))', 'O(V)'],
          ['Add a new edge', 'O(1) amortised', 'O(1)'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Allocating an adjacency matrix when V exceeds 5,000',
        body: 'A standard judge memory limit of 256 MB accommodates roughly 6 x 10⁷ 32-bit integers. An adjacency matrix fits only when V <= 5,000. For larger V, always use an adjacency list.',
      },
    ],
    keyTakeaways: [
      'Adjacency lists use O(V + E) memory, making them the standard choice for sparse graphs.',
      'Adjacency matrices consume O(V²) memory, causing Memory Limit Exceeded on large node counts.',
      'Checking edge presence is O(1) in a matrix, but iterating neighbors takes O(V) instead of O(degree(u)).',
      'Default to an adjacency list unless the problem explicitly requires frequent O(1) edge lookups on small V.',
    ],
    practice: {
      prompt: 'There are n rooms labelled 0 to n - 1, each containing keys to other rooms. The input rooms[i] is already structured as an adjacency list. Verify whether you can visit all rooms starting from room 0.',
      leetcode: { title: 'Keys and Rooms', slug: 'keys-and-rooms' },
    },
  },

  // =========================================================================
  // Lesson 3: Building a graph from an edge list
  // =========================================================================
  {
    sub: 3,
    summary: 'Construct adjacency lists for unweighted, weighted, directed, and undirected graphs from standard raw edge lists.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Online judge problems almost never deliver graph inputs as pre-built adjacency lists. Instead, inputs arrive as an integer n (number of nodes) and a 2D array of edges, such as `edges = [[0, 1], [0, 2], [1, 2]]`. Converting this raw edge list into an adjacency list is the essential first step before executing any traversal.',
      },
      { kind: 'heading', text: 'Directionality and edge weights' },
      {
        kind: 'text',
        body: 'For an **undirected graph**, each edge `[u, v]` represents bidirectional connectivity, requiring two insertions: append v to `adj[u]` and append u to `adj[v]`. For a **directed graph**, append only v to `adj[u]`. For **weighted graphs**, each list element stores a pair `(neighbor, weight)`.',
      },
      {
        kind: 'code',
        caption: 'Building unweighted undirected and weighted directed adjacency lists',
        code: {
          cpp: `#include <bits/stdc++.h>
using namespace std;

// Unweighted undirected graph builder
vector<vector<int>> buildUnweighted(int n, const vector<vector<int>>& edges) {
    vector<vector<int>> adj(n);
    for (const auto& e : edges) {
        adj[e[0]].push_back(e[1]);
        adj[e[1]].push_back(e[0]);
    }
    return adj;
}

// Weighted directed graph builder: edges[i] = {u, v, weight}
vector<vector<pair<int, int>>> buildWeighted(int n, const vector<vector<int>>& edges) {
    vector<vector<pair<int, int>>> adj(n);
    for (const auto& e : edges) {
        adj[e[0]].push_back({e[1], e[2]});
    }
    return adj;
}`,
          java: `// Unweighted undirected graph builder
public List<List<Integer>> buildUnweighted(int n, int[][] edges) {
    List<List<Integer>> adj = new ArrayList<>();
    for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
    for (int[] e : edges) {
        adj.get(e[0]).add(e[1]);
        adj.get(e[1]).add(e[0]);
    }
    return adj;
}

// Weighted directed graph builder: edges[i] = {u, v, weight}
public List<List<int[]>> buildWeighted(int n, int[][] edges) {
    List<List<int[]>> adj = new ArrayList<>();
    for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
    for (int[] e : edges) {
        adj.get(e[0]).add(new int[]{e[1], e[2]});
    }
    return adj;
}`,
          python: `def build_unweighted(n: int, edges: list[list[int]]) -> list[list[int]]:
    adj: list[list[int]] = [[] for _ in range(n)]
    for u, v in edges:
        adj[u].append(v)
        adj[v].append(u)
    return adj

def build_weighted(n: int, edges: list[list[int]]) -> list[list[tuple[int, int]]]:
    adj: list[list[tuple[int, int]]] = [[] for _ in range(n)]
    for u, v, w in edges:
        adj[u].append((v, w))
    return adj`,
        },
      },
      { kind: 'heading', text: 'Building complexity' },
      {
        kind: 'text',
        body: 'Allocating the list headers takes O(V) time and memory. Inserting E edges takes O(E) amortised time. The overall construction cost is **O(V + E)** time and **O(V + E)** space, which is linear with respect to input size.',
      },
      {
        kind: 'table',
        headers: ['Graph Variant', 'Insertions per Edge [u, v]', 'Total List Elements'],
        rows: [
          ['Directed Unweighted', 'u -> v (1 insertion)', 'E'],
          ['Undirected Unweighted', 'u -> v and v -> u (2 insertions)', '2E'],
          ['Directed Weighted', 'u -> (v, w) (1 insertion)', 'E pairs'],
          ['Undirected Weighted', 'u -> (v, w) and v -> (u, w) (2 insertions)', '2E pairs'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Omitting the reverse edge in undirected graphs',
        body: 'For an undirected edge between u and v, forgetting to add u to adj[v] turns the graph into a directed graph. Your traversal will be unable to travel backward along that edge, causing silent failures on bidirectional test cases.',
      },
    ],
    keyTakeaways: [
      'Raw edge lists must be converted to adjacency lists before running graph algorithms.',
      'Undirected graphs require two insertions per edge: add v to u, and u to v.',
      'Weighted graphs store pairs of (neighbor, weight) in each adjacency bucket.',
      'Constructing an adjacency list runs in O(V + E) time and O(V + E) space.',
    ],
    practice: {
      prompt: 'Given an integer n and an array of undirected edges, construct an adjacency list and determine if a valid path connects a given source node to a destination node.',
      leetcode: { title: 'Find if Path Exists in Graph', slug: 'find-if-path-exists-in-graph' },
    },
  },

  // =========================================================================
  // Lesson 4: BFS implementation
  // =========================================================================
  {
    sub: 4,
    summary: 'Implement Breadth-First Search using a queue, tracking visited states correctly to avoid redundant work and memory blowups.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Breadth-First Search (BFS) explores a graph in concentric waves of increasing distance from a start node. It visits all immediate neighbors at distance 1, then all vertices at distance 2, and so forth. In an unweighted graph, BFS is guaranteed to discover the shortest path in terms of edge count.',
      },
      { kind: 'heading', text: 'The BFS queue template' },
      {
        kind: 'text',
        body: 'BFS requires a **FIFO queue** and a **visited array**. Enqueue the start node and mark it visited immediately. In each iteration, dequeue vertex u, process it, and inspect all unvisited neighbors. Mark each unvisited neighbor visited and enqueue it.',
      },
      {
        kind: 'code',
        caption: 'Standard BFS traversal on an unweighted graph',
        code: {
          cpp: `#include <bits/stdc++.h>
using namespace std;

vector<int> bfsTraversal(int n, const vector<vector<int>>& adj, int start) {
    vector<int> order;
    vector<bool> visited(n, false);
    queue<int> q;

    visited[start] = true;
    q.push(start);

    while (!q.empty()) {
        int u = q.front();
        q.pop();
        order.push_back(u);

        for (int v : adj[u]) {
            if (!visited[v]) {
                visited[v] = true; // Mark when pushing!
                q.push(v);
            }
        }
    }
    return order;
}`,
          java: `public List<Integer> bfsTraversal(int n, List<List<Integer>> adj, int start) {
    List<Integer> order = new ArrayList<>();
    boolean[] visited = new boolean[n];
    Queue<Integer> q = new ArrayDeque<>();

    visited[start] = true;
    q.offer(start);

    while (!q.isEmpty()) {
        int u = q.poll();
        order.add(u);

        for (int v : adj.get(u)) {
            if (!visited[v]) {
                visited[v] = true; // Mark when pushing!
                q.offer(v);
            }
        }
    }
    return order;
}`,
          python: `from collections import deque

def bfs_traversal(n: int, adj: list[list[int]], start: int) -> list[int]:
    order = []
    visited = [False] * n
    queue = deque([start])
    visited[start] = True

    while queue:
        u = queue.popleft()
        order.append(u)
        for v in adj[u]:
            if not visited[v]:
                visited[v] = True  # Mark when pushing!
                queue.append(v)
    return order`,
        },
      },
      { kind: 'heading', text: 'Complexity and wave-by-wave processing' },
      {
        kind: 'text',
        body: 'Every vertex enters the queue once and each edge is examined once (directed) or twice (undirected). The algorithm runs in **O(V + E)** time and uses **O(V)** auxiliary space for the queue and visited array. Capturing `queue.size()` before processing a wave allows level-by-level distance tracking.',
      },
      {
        kind: 'table',
        headers: ['BFS Component', 'Operations per Element', 'Total Bound'],
        rows: [
          ['Queue operations', 'O(1) push and pop per node', 'O(V)'],
          ['Edge examinations', 'O(1) scan per incident edge', 'O(E)'],
          ['Visited lookup', 'O(1) check and update per neighbor', 'O(V)'],
          ['Total Complexity', 'Full traversal from source', 'O(V + E) time, O(V) space'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Marking visited on dequeue instead of enqueue',
        body: 'If a node is marked visited only when popped from the queue, multiple active neighbors can see it as unvisited and push duplicate copies into the queue. In dense graphs, this triggers an exponential explosion in queue size, leading to TLE or Out of Memory crashes. Always mark nodes visited immediately when enqueuing.',
      },
    ],
    keyTakeaways: [
      'BFS explores nodes in increasing order of distance from the source using a FIFO queue.',
      'Always mark nodes visited at the moment they are pushed to the queue, never when dequeued.',
      'BFS runs in O(V + E) time and O(V) auxiliary memory.',
      'Capturing queue size before each iteration enables level-by-level wave processing.',
    ],
    practice: {
      prompt: 'Implement BFS on an unweighted undirected graph starting from vertex 0 to return a list of vertices in the exact order they are first visited.',
      leetcode: { title: 'Find if Path Exists in Graph', slug: 'find-if-path-exists-in-graph' },
    },
  },

  // =========================================================================
  // Lesson 5: DFS: recursive and iterative
  // =========================================================================
  {
    sub: 5,
    summary: 'Implement Depth-First Search using both system recursion and an explicit stack, managing call stack limits and traversal state.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Depth-First Search (DFS) explores a graph by following a single branch as deeply as possible until hitting a dead end or an already visited vertex, then backtracks to explore alternatives. DFS serves as the engine for topological sorting, cycle detection, strongly connected components, and backtracking problems.',
      },
      { kind: 'heading', text: 'Recursive versus iterative DFS' },
      {
        kind: 'text',
        body: 'DFS can be implemented recursively using the system call stack, or iteratively using an explicit stack data structure. Recursive DFS is concise, while iterative DFS allocates its stack on the heap, bypassing operating system recursion limits.',
      },
      {
        kind: 'code',
        caption: 'Recursive DFS and iterative DFS implementations',
        code: {
          cpp: `#include <bits/stdc++.h>
using namespace std;

// Recursive DFS
void dfsRec(int u, const vector<vector<int>>& adj, vector<bool>& vis, vector<int>& order) {
    vis[u] = true;
    order.push_back(u);
    for (int v : adj[u]) {
        if (!vis[v]) dfsRec(v, adj, vis, order);
    }
}

// Iterative DFS using explicit stack
vector<int> dfsIter(int n, const vector<vector<int>>& adj, int start) {
    vector<int> order;
    vector<bool> vis(n, false);
    stack<int> st;
    st.push(start);

    while (!st.empty()) {
        int u = st.top();
        st.pop();
        if (vis[u]) continue;
        vis[u] = true;
        order.push_back(u);
        for (auto it = adj[u].rbegin(); it != adj[u].rend(); ++it) {
            if (!vis[*it]) st.push(*it);
        }
    }
    return order;
}`,
          java: `// Recursive DFS
public void dfsRec(int u, List<List<Integer>> adj, boolean[] vis, List<Integer> order) {
    vis[u] = true;
    order.add(u);
    for (int v : adj.get(u)) {
        if (!vis[v]) dfsRec(v, adj, vis, order);
    }
}

// Iterative DFS using explicit stack
public List<Integer> dfsIter(int n, List<List<Integer>> adj, int start) {
    List<Integer> order = new ArrayList<>();
    boolean[] vis = new boolean[n];
    Deque<Integer> st = new ArrayDeque<>();
    st.push(start);

    while (!st.isEmpty()) {
        int u = st.pop();
        if (vis[u]) continue;
        vis[u] = true;
        order.add(u);
        List<Integer> neighbors = adj.get(u);
        for (int i = neighbors.size() - 1; i >= 0; i--) {
            int v = neighbors.get(i);
            if (!vis[v]) st.push(v);
        }
    }
    return order;
}`,
          python: `# Recursive DFS
def dfs_rec(u: int, adj: list[list[int]], vis: list[bool], order: list[int]) -> None:
    vis[u] = True
    order.append(u)
    for v in adj[u]:
        if not vis[v]:
            dfs_rec(v, adj, vis, order)

# Iterative DFS using explicit stack
def dfs_iter(n: int, adj: list[list[int]], start: int) -> list[int]:
    order, vis, st = [], [False] * n, [start]
    while st:
        u = st.pop()
        if vis[u]:
            continue
        vis[u] = True
        order.append(u)
        for v in reversed(adj[u]):
            if not vis[v]:
                st.append(v)
    return order`,
        },
      },
      { kind: 'heading', text: 'Call stack limitations' },
      {
        kind: 'text',
        body: 'Both recursive and iterative DFS run in **O(V + E)** time and consume **O(V)** space. However, on long chain graphs with 10⁵ vertices, recursive DFS allocates 10⁵ stack frames. Operating system thread stacks are typically limited to 1–8 MB, risking stack overflow crashes.',
      },
      {
        kind: 'table',
        headers: ['Feature', 'Recursive DFS', 'Iterative DFS'],
        rows: [
          ['Time Complexity', 'O(V + E)', 'O(V + E)'],
          ['Auxiliary Space', 'O(V) call stack frames', 'O(V) heap stack'],
          ['Recursion Depth Limit', 'OS stack limited (~10^4 - 10^5 frames)', 'Limited only by available RAM (~10^7)'],
          ['Code Brevity', 'Very concise', 'Moderate (manual stack)'],
        ],
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: { cpp: 'Recursion depth and the stack', java: 'Recursion depth and the stack', python: 'Default recursion limit' },
        body: { cpp: 'Recursive DFS on a path-shaped graph of 10⁵ nodes recurses 10⁵ deep. Most judges tolerate that only if frames are small: pass the adjacency list by reference and declare no arrays inside the function. For 10⁶ nodes, use the iterative version with an explicit stack.', java: 'Recursive DFS on a path-shaped graph of 10⁵ nodes recurses 10⁵ deep, which overflows the default thread stack and throws StackOverflowError. Use the iterative version with an ArrayDeque, or run the solver on a thread created with a large stack size.', python: 'The interpreter enforces a default recursion ceiling of 1,000 calls. Deep graph traversals will trigger RecursionError. Use sys.setrecursionlimit(200000) or prefer an explicit iterative stack.' },
      },
    ],
    keyTakeaways: [
      'DFS plunges as deeply as possible along each branch before backtracking.',
      'Both recursive and iterative implementations execute in O(V + E) time and O(V) space.',
      'Recursive DFS can crash with stack overflow on deep paths; use iterative DFS when depth is unconstrained.',
      'Always maintain a visited set or array to prevent infinite loops on graphs containing cycles.',
    ],
    practice: {
      prompt: 'Given a directed acyclic graph (DAG) of n nodes, find all possible paths from node 0 to node n - 1 and return them in any order using depth-first search.',
      leetcode: { title: 'All Paths From Source to Target', slug: 'all-paths-from-source-to-target' },
    },
  },

  // =========================================================================
  // Lesson 6: Connected components
  // =========================================================================
  {
    sub: 6,
    summary: 'Decompose an undirected graph into its connected components using an outer loop across all vertices.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'An undirected graph may consist of several disconnected subgraphs called **connected components**. Within a connected component, every vertex can reach every other vertex. Between distinct components, no path exists. A single traversal from node 0 will miss disconnected parts of the graph.',
      },
      { kind: 'heading', text: 'The outer loop pattern' },
      {
        kind: 'text',
        body: 'To discover all components, maintain a global visited array and iterate through all vertices from 0 to n - 1 with an outer loop. Whenever an unvisited vertex is found, increment the component counter and launch a full BFS or DFS traversal from that vertex.',
      },
      {
        kind: 'code',
        caption: 'Counting components and assigning component IDs to every vertex',
        code: {
          cpp: `#include <bits/stdc++.h>
using namespace std;

int countComponents(int n, const vector<vector<int>>& adj, vector<int>& compId) {
    compId.assign(n, -1);
    int count = 0;

    auto dfs = [&](auto& self, int u, int id) -> void {
        compId[u] = id;
        for (int v : adj[u]) {
            if (compId[v] == -1) self(self, v, id);
        }
    };

    for (int i = 0; i < n; i++) {
        if (compId[i] == -1) {
            dfs(dfs, i, count);
            count++;
        }
    }
    return count;
}`,
          java: `public int countComponents(int n, List<List<Integer>> adj, int[] compId) {
    Arrays.fill(compId, -1);
    int count = 0;
    for (int i = 0; i < n; i++) {
        if (compId[i] == -1) {
            dfs(i, count, adj, compId);
            count++;
        }
    }
    return count;
}

private void dfs(int u, int id, List<List<Integer>> adj, int[] compId) {
    compId[u] = id;
    for (int v : adj.get(u)) {
        if (compId[v] == -1) dfs(v, id, adj, compId);
    }
}`,
          python: `def count_components(n: int, adj: list[list[int]]) -> tuple[int, list[int]]:
    comp_id = [-1] * n
    count = 0

    def dfs(u: int, cid: int) -> None:
        comp_id[u] = cid
        for v in adj[u]:
            if comp_id[v] == -1:
                dfs(v, cid)

    for i in range(n):
        if comp_id[i] == -1:
            dfs(i, count)
            count += 1
    return count, comp_id`,
        },
      },
      { kind: 'heading', text: 'Component labelling for O(1) queries' },
      {
        kind: 'text',
        body: 'Recording `componentId[u]` for each vertex during the traversal provides an O(1) test for whether two vertices u and v are connected by evaluating `componentId[u] == componentId[v]`. The entire decomposition executes in **O(V + E)** time.',
      },
      {
        kind: 'table',
        headers: ['Phase', 'Action', 'Complexity'],
        rows: [
          ['Outer loop', 'Checks if each vertex 0..n-1 is visited', 'O(V)'],
          ['Inner traversals', 'Visits all vertices and edges once across all components', 'O(V + E)'],
          ['ID assignment', 'Stores integer component label per node', 'O(V)'],
          ['Overall Bound', 'Full component decomposition', 'O(V + E) time, O(V) space'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Assuming vertex 0 connects to the entire graph',
        body: 'Traversing only from vertex 0 ignores disconnected components and isolated single vertices. When a problem asks to process every node in an undirected graph, always wrap the traversal in an outer loop over all nodes 0 to n - 1.',
      },
    ],
    keyTakeaways: [
      'Connected components partition an undirected graph into isolated reachable subgraphs.',
      'An outer loop iterating from 0 to n - 1 guarantees that all disconnected components are visited.',
      'Total execution time remains O(V + E) because every vertex and edge is processed once.',
      'Component IDs enable answering connectivity queries between any two nodes in O(1) time.',
    ],
    practice: {
      prompt: 'Given an n x n adjacency matrix isConnected representing connected cities, compute and return the total number of distinct provinces (connected components).',
      leetcode: { title: 'Number of Provinces', slug: 'number-of-provinces' },
    },
  },

  // =========================================================================
  // Lesson 7: Cycle detection: undirected and directed
  // =========================================================================
  {
    sub: 7,
    summary: 'Detect cycles in both undirected graphs using parent tracking and directed graphs using three-color state DFS.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'A **cycle** is a path of positive length that begins and ends at the identical vertex. Detecting cycles requires fundamentally different algorithms for undirected and directed graphs; using the undirected approach on a directed graph causes false positives and false negatives.',
      },
      { kind: 'heading', text: 'Undirected cycle detection with parent tracking' },
      {
        kind: 'text',
        body: 'In an undirected graph, an edge between u and v is bidirectional. Traversing back to the immediate parent that discovered u is not a cycle. A cycle exists if and only if you encounter an already visited neighbor v that is **not equal to parent**.',
      },
      { kind: 'heading', text: 'Directed cycle detection with three-color states' },
      {
        kind: 'text',
        body: 'In a directed graph, reaching an already visited node does not necessarily indicate a cycle (two paths can independently lead to the same destination without looping). A cycle exists only if an edge points to an **active ancestor in the current recursion stack** (a back-edge). We track vertices using three states: **0 = unvisited**, **1 = visiting (in recursion stack)**, and **2 = visited (fully explored)**.',
      },
      {
        kind: 'code',
        caption: 'Cycle detection in undirected graphs vs directed graphs',
        code: {
          cpp: `#include <bits/stdc++.h>
using namespace std;

// Undirected: parent pointer check
bool hasUndirectedCycle(int n, const vector<vector<int>>& adj) {
    vector<bool> vis(n, false);
    auto dfs = [&](auto& self, int u, int p) -> bool {
        vis[u] = true;
        for (int v : adj[u]) {
            if (!vis[v]) { if (self(self, v, u)) return true; }
            else if (v != p) return true;
        }
        return false;
    };
    for (int i = 0; i < n; i++) {
        if (!vis[i] && dfs(dfs, i, -1)) return true;
    }
    return false;
}

// Directed: 3-color states (0=unvisited, 1=visiting, 2=visited)
bool hasDirectedCycle(int n, const vector<vector<int>>& adj) {
    vector<int> state(n, 0);
    auto dfs = [&](auto& self, int u) -> bool {
        state[u] = 1;
        for (int v : adj[u]) {
            if (state[v] == 1) return true; // Back-edge!
            if (state[v] == 0 && self(self, v)) return true;
        }
        state[u] = 2;
        return false;
    };
    for (int i = 0; i < n; i++) {
        if (state[i] == 0 && dfs(dfs, i)) return true;
    }
    return false;
}`,
          java: `// Undirected cycle detection
public boolean hasUndirectedCycle(int n, List<List<Integer>> adj) {
    boolean[] vis = new boolean[n];
    for (int i = 0; i < n; i++) {
        if (!vis[i] && dfsUndir(i, -1, adj, vis)) return true;
    }
    return false;
}
private boolean dfsUndir(int u, int p, List<List<Integer>> adj, boolean[] vis) {
    vis[u] = true;
    for (int v : adj.get(u)) {
        if (!vis[v]) { if (dfsUndir(v, u, adj, vis)) return true; }
        else if (v != p) return true;
    }
    return false;
}

// Directed cycle detection (0=unvisited, 1=visiting, 2=visited)
public boolean hasDirectedCycle(int n, List<List<Integer>> adj) {
    int[] state = new int[n];
    for (int i = 0; i < n; i++) {
        if (state[i] == 0 && dfsDir(i, adj, state)) return true;
    }
    return false;
}
private boolean dfsDir(int u, List<List<Integer>> adj, int[] state) {
    state[u] = 1;
    for (int v : adj.get(u)) {
        if (state[v] == 1) return true;
        if (state[v] == 0 && dfsDir(v, adj, state)) return true;
    }
    state[u] = 2;
    return false;
}`,
          python: `def has_undirected_cycle(n: int, adj: list[list[int]]) -> bool:
    vis = [False] * n
    def dfs(u: int, p: int) -> bool:
        vis[u] = True
        for v in adj[u]:
            if not vis[v]:
                if dfs(v, u): return True
            elif v != p: return True
        return False
    return any(not vis[i] and dfs(i, -1) for i in range(n))

def has_directed_cycle(n: int, adj: list[list[int]]) -> bool:
    state = [0] * n  # 0=unvisited, 1=visiting, 2=visited
    def dfs(u: int) -> bool:
        state[u] = 1
        for v in adj[u]:
            if state[v] == 1: return True
            if state[v] == 0 and dfs(v): return True
        state[u] = 2
        return False
    return any(state[i] == 0 and dfs(i) for i in range(n))`,
        },
      },
      {
        kind: 'table',
        headers: ['Graph Nature', 'Detection Mechanism', 'Condition for Cycle', 'Complexity'],
        rows: [
          ['Undirected', 'DFS with parent pointer', 'Visited neighbor != parent', 'O(V + E) time, O(V) space'],
          ['Directed', 'Three-color DFS states (0, 1, 2)', 'Neighbor has state == 1 (back-edge)', 'O(V + E) time, O(V) space'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Using a boolean visited array for directed cycle detection',
        body: 'A boolean array cannot distinguish between a back-edge (a real cycle) and a cross-edge (two separate paths converging on a shared node). If paths A -> B -> D and A -> C -> D exist, D is visited from B. When reached from C, D is visited but there is no cycle! Only hitting state 1 confirms a directed cycle.',
      },
    ],
    keyTakeaways: [
      'Undirected cycle detection tracks the parent node to ignore the trivial two-way edge traversal.',
      'Directed cycle detection requires detecting back-edges to ancestors currently in the recursion stack.',
      'Three states (0 = unvisited, 1 = visiting, 2 = visited) correctly identify directed cycles in O(V + E) time.',
      'Wrap cycle checks in an outer loop over all vertices to verify disconnected components.',
    ],
    practice: {
      prompt: 'Given numCourses and an array of prerequisite pairs [a, b] where course b must be taken before a, return true if all courses can be finished, or false if a circular dependency exists.',
      leetcode: { title: 'Course Schedule', slug: 'course-schedule' },
    },
  },

  // =========================================================================
  // Lesson 8: Topological sort: Kahn’s and DFS
  // =========================================================================
  {
    sub: 8,
    summary: 'Order vertices of a Directed Acyclic Graph (DAG) linearly such that every directed edge u -> v has u appearing before v.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'A **topological sort** of a Directed Acyclic Graph (DAG) is a linear ordering of its vertices such that for every directed edge u -> v, vertex u appears before v. This models dependency scheduling: build systems, prerequisite courses, and task workflows. If a graph contains even one directed cycle, no topological ordering exists.',
      },
      { kind: 'heading', text: 'Kahn’s algorithm (in-degree reduction)' },
      {
        kind: 'text',
        body: 'Kahn’s algorithm works by repeatedly processing nodes that have zero incoming edges. First, compute the in-degree of every vertex. Enqueue all vertices with `inDegree == 0`. Then, repeatedly dequeue vertex u, append u to the ordering, and decrement the in-degree of each neighbor v. Whenever a neighbor’s in-degree drops to 0, enqueue it.',
      },
      {
        kind: 'code',
        caption: 'Kahn’s algorithm for topological sorting and cycle detection',
        code: {
          cpp: `#include <bits/stdc++.h>
using namespace std;

vector<int> kahnTopologicalSort(int n, const vector<vector<int>>& adj) {
    vector<int> inDegree(n, 0);
    for (int u = 0; u < n; u++) {
        for (int v : adj[u]) inDegree[v]++;
    }
    queue<int> q;
    for (int i = 0; i < n; i++) {
        if (inDegree[i] == 0) q.push(i);
    }
    vector<int> order;
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        order.push_back(u);
        for (int v : adj[u]) {
            if (--inDegree[v] == 0) q.push(v);
        }
    }
    return (int)order.size() == n ? order : vector<int>{};
}`,
          java: `public int[] kahnTopologicalSort(int n, List<List<Integer>> adj) {
    int[] inDegree = new int[n];
    for (int u = 0; u < n; u++) {
        for (int v : adj.get(u)) inDegree[v]++;
    }
    Queue<Integer> q = new ArrayDeque<>();
    for (int i = 0; i < n; i++) {
        if (inDegree[i] == 0) q.offer(i);
    }
    int[] order = new int[n];
    int idx = 0;
    while (!q.isEmpty()) {
        int u = q.poll();
        order[idx++] = u;
        for (int v : adj.get(u)) {
            if (--inDegree[v] == 0) q.offer(v);
        }
    }
    return idx == n ? order : new int[0];
}`,
          python: `from collections import deque

def kahn_topological_sort(n: int, adj: list[list[int]]) -> list[int]:
    in_degree = [0] * n
    for u in range(n):
        for v in adj[u]:
            in_degree[v] += 1
    queue = deque([i for i in range(n) if in_degree[i] == 0])
    order = []
    while queue:
        u = queue.popleft()
        order.append(u)
        for v in adj[u]:
            in_degree[v] -= 1
            if in_degree[v] == 0:
                queue.append(v)
    return order if len(order) == n else []`,
        },
      },
      { kind: 'heading', text: 'Cycle detection via topological sort' },
      {
        kind: 'text',
        body: 'Vertices trapped in a cycle never have their in-degrees reduced to zero, so they never enter the queue. If the final ordering contains fewer than n vertices, the graph contains a cycle. Kahn’s algorithm thus performs topological sorting and cycle detection simultaneously in **O(V + E)** time.',
      },
      {
        kind: 'table',
        headers: ['Method', 'Traversal Technique', 'Cycle Detection', 'Complexity'],
        rows: [
          ['Kahn’s Algorithm', 'BFS with in-degree queue', 'Built-in: output length < V', 'O(V + E) time, O(V) space'],
          ['DFS Post-Order', 'DFS, reverse finish-time stack', 'Requires 3-color state tracking', 'O(V + E) time, O(V) space'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Lexicographically smallest topological order',
        body: 'When a problem requires the lexicographically smallest ordering among valid options, replace the standard FIFO queue with a min-priority queue (min-heap). This ensures that whenever multiple vertices have in-degree 0, the vertex with the lowest numerical index is popped first.',
      },
    ],
    keyTakeaways: [
      'Topological sorting linearly orders vertices of a DAG so prerequisites precede their dependents.',
      'Kahn’s algorithm enqueues zero-in-degree nodes and decrements neighbor in-degrees iteratively.',
      'If the count of sorted nodes is less than n, the graph contains a directed cycle.',
      'Both Kahn’s and DFS post-order approaches execute in O(V + E) time and O(V) space.',
    ],
    practice: {
      prompt: 'Given numCourses and a list of prerequisite pairs, return the ordering of courses you should take to finish all courses. If impossible due to a cycle, return an empty array.',
      leetcode: { title: 'Course Schedule II', slug: 'course-schedule-ii' },
    },
  },

  // =========================================================================
  // Lesson 9: Shortest path in an unweighted graph
  // =========================================================================
  {
    sub: 9,
    summary: 'Find the shortest distance and reconstruct the full path between vertices in an unweighted graph using BFS and predecessor tracking.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'In an **unweighted graph** (where every edge has identical cost 1), the shortest path between two vertices is defined as the path using the minimum number of edges. Breadth-First Search (BFS) is guaranteed to find this shortest path because it discovers vertices in non-decreasing order of edge distance from the source.',
      },
      { kind: 'heading', text: 'Distance tracking and path reconstruction' },
      {
        kind: 'text',
        body: 'Initialise an array `dist` with -1 for all vertices and set `dist[source] = 0`. When discovering an unvisited neighbor v from u, assign `dist[v] = dist[u] + 1` and record `parent[v] = u`. To reconstruct the path, backtrack from the destination vertex using parent pointers until reaching the source, then reverse the collected list.',
      },
      {
        kind: 'code',
        caption: 'BFS shortest path distance and full path reconstruction',
        code: {
          cpp: `#include <bits/stdc++.h>
using namespace std;

pair<int, vector<int>> shortestPathBFS(int n, const vector<vector<int>>& adj, int start, int target) {
    vector<int> dist(n, -1), parent(n, -1);
    queue<int> q;
    dist[start] = 0;
    q.push(start);

    while (!q.empty()) {
        int u = q.front();
        q.pop();
        if (u == target) break;
        for (int v : adj[u]) {
            if (dist[v] == -1) {
                dist[v] = dist[u] + 1;
                parent[v] = u;
                q.push(v);
            }
        }
    }
    if (dist[target] == -1) return {-1, {}};
    vector<int> path;
    for (int curr = target; curr != -1; curr = parent[curr]) path.push_back(curr);
    reverse(path.begin(), path.end());
    return {dist[target], path};
}`,
          java: `public List<Integer> shortestPathBFS(int n, List<List<Integer>> adj, int start, int target) {
    int[] dist = new int[n], parent = new int[n];
    Arrays.fill(dist, -1);
    Arrays.fill(parent, -1);
    Queue<Integer> q = new ArrayDeque<>();
    dist[start] = 0;
    q.offer(start);

    while (!q.isEmpty()) {
        int u = q.poll();
        if (u == target) break;
        for (int v : adj.get(u)) {
            if (dist[v] == -1) {
                dist[v] = dist[u] + 1;
                parent[v] = u;
                q.offer(v);
            }
        }
    }
    if (dist[target] == -1) return Collections.emptyList();
    List<Integer> path = new ArrayList<>();
    for (int curr = target; curr != -1; curr = parent[curr]) path.add(curr);
    Collections.reverse(path);
    return path;
}`,
          python: `from collections import deque

def shortest_path_bfs(n: int, adj: list[list[int]], start: int, target: int) -> tuple[int, list[int]]:
    dist, parent = [-1] * n, [-1] * n
    queue = deque([start])
    dist[start] = 0

    while queue:
        u = queue.popleft()
        if u == target:
            break
        for v in adj[u]:
            if dist[v] == -1:
                dist[v] = dist[u] + 1
                parent[v] = u
                queue.append(v)

    if dist[target] == -1:
        return -1, []
    path, curr = [], target
    while curr != -1:
        path.append(curr)
        curr = parent[curr]
    path.reverse()
    return dist[target], path`,
        },
      },
      { kind: 'heading', text: 'Why BFS guarantees shortest paths' },
      {
        kind: 'text',
        body: 'BFS visits all nodes at distance 1 before any at distance 2, and all at distance 2 before any at distance 3. The first time BFS reaches any vertex v, the path taken is guaranteed to be minimal. In contrast, DFS may follow a long circuitous route and discover v after dozens of unnecessary edges.',
      },
      {
        kind: 'table',
        headers: ['Component', 'Role in Shortest Path', 'Complexity'],
        rows: [
          ['dist array', 'Records minimum edge distance from source', 'O(V) space'],
          ['parent array', 'Stores predecessor node for path reconstruction', 'O(V) space'],
          ['BFS traversal', 'Discovers shortest paths in wave order', 'O(V + E) time'],
          ['Path reconstruction', 'Backtracks from target to source and reverses', 'O(path length) = O(V) time'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Using DFS to find shortest paths',
        body: 'DFS searches as deep as possible before backtracking. The first path DFS finds between source and target can be arbitrarily long and inefficient. Never use DFS for shortest paths in unweighted graphs; always use BFS.',
      },
    ],
    keyTakeaways: [
      'BFS guarantees finding the shortest path in unweighted graphs in O(V + E) time.',
      'Initialize distance array to -1 to represent unvisited and unreachable vertices.',
      'Use a parent array to record predecessors and reconstruct the exact path via backtracking.',
      'Reverse the backtracked target-to-source sequence to produce the source-to-target path.',
    ],
    practice: {
      prompt: 'Given an n x n binary matrix grid, return the length of the shortest clear path from top-left (0, 0) to bottom-right (n - 1, n - 1) traversing 8-directionally. If no clear path exists, return -1.',
      leetcode: { title: 'Shortest Path in Binary Matrix', slug: 'shortest-path-in-binary-matrix' },
    },
  },

  // =========================================================================
  // Lesson 10: Dijkstra
  // =========================================================================
  {
    sub: 10,
    summary: 'Compute single-source shortest paths on graphs with non-negative edge weights using Dijkstra’s algorithm and a min-priority queue.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'When edges have varying non-negative weights, BFS no longer finds the shortest path: a 2-edge path with weights 10 and 10 (total 20) is worse than a 3-edge path with weights 1, 2, and 1 (total 4). **Dijkstra’s algorithm** solves the Single-Source Shortest Path (SSSP) problem for graphs with **non-negative edge weights** using a greedy strategy guided by a min-priority queue.',
      },
      { kind: 'heading', text: 'Greedy relaxation and the min-heap' },
      {
        kind: 'text',
        body: 'Maintain an array `dist` initialized to infinity with `dist[source] = 0`. Push `(0, source)` into a min-priority queue. In each iteration, pop the pair `(d, u)` with the smallest distance. If `d > dist[u]`, discard it as an outdated entry. Otherwise, for each outgoing edge `(u -> v, weight)`, perform **relaxation**: if `dist[u] + weight < dist[v]`, update `dist[v] = dist[u] + weight` and push `(dist[v], v)` into the queue.',
      },
      {
        kind: 'code',
        caption: 'Dijkstra’s algorithm with min-priority queue',
        code: {
          cpp: `#include <bits/stdc++.h>
using namespace std;

vector<int> dijkstra(int n, const vector<vector<pair<int, int>>>& adj, int start) {
    const int INF = 1e9;
    vector<int> dist(n, INF);
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
    dist[start] = 0;
    pq.push({0, start});

    while (!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop();
        if (d > dist[u]) continue; // Discard stale entry

        for (const auto& [v, w] : adj[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
        }
    }
    return dist;
}`,
          java: `public int[] dijkstra(int n, List<List<int[]>> adj, int start) {
    int[] dist = new int[n];
    Arrays.fill(dist, Integer.MAX_VALUE);
    PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
    dist[start] = 0;
    pq.offer(new int[]{0, start});

    while (!pq.isEmpty()) {
        int[] top = pq.poll();
        int d = top[0], u = top[1];
        if (d > dist[u]) continue; // Discard stale entry

        for (int[] edge : adj.get(u)) {
            int v = edge[0], w = edge[1];
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.offer(new int[]{dist[v], v});
            }
        }
    }
    return dist;
}`,
          python: `import heapq

def dijkstra(n: int, adj: list[list[tuple[int, int]]], start: int) -> list[int]:
    INF = float("inf")
    dist = [INF] * n
    dist[start] = 0
    pq: list[tuple[int, int]] = [(0, start)]

    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]:
            continue  # Discard stale entry
        for v, w in adj[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                heapq.heappush(pq, (dist[v], v))
    return [int(d) if d != INF else -1 for d in dist]`,
        },
      },
      { kind: 'heading', text: 'Lazy deletion and negative weights' },
      {
        kind: 'text',
        body: 'Standard library heaps do not support efficient decrease-key operations. Pushing duplicate pairs when shorter paths are discovered and lazily skipping stale entries with `if (d > dist[u]) continue;` keeps the runtime at **O((V + E) log V)**. Dijkstra assumes distances only increase along paths; negative edge weights invalidate this and require the Bellman-Ford algorithm.',
      },
      {
        kind: 'table',
        headers: ['Operation', 'Frequency', 'Cost per Operation', 'Total Time'],
        rows: [
          ['Heap Insertions', 'At most E', 'O(log V)', 'O(E log V)'],
          ['Heap Extractions (pop)', 'At most E', 'O(log V)', 'O(E log V)'],
          ['Edge Relaxations', 'E edges examined', 'O(1)', 'O(E)'],
          ['Overall Dijkstra', 'Single-source shortest paths', '—', 'O((V + E) log V) time, O(V + E) space'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Forgetting to discard stale heap entries',
        body: 'Because a vertex can be inserted into the priority queue multiple times with progressively smaller distances, obsolete entries remain in the heap. Without if (d > dist[u]) continue;, your code re-explores all outgoing edges of previously finalized vertices, causing Time Limit Exceeded on dense graphs.',
      },
    ],
    keyTakeaways: [
      'Dijkstra’s algorithm finds shortest paths from a single source in graphs with non-negative edge weights.',
      'A min-priority queue greedily selects the unvisited node with the smallest tentative distance.',
      'Relax an edge (u -> v, w) whenever dist[u] + w < dist[v].',
      'Always discard stale heap entries where the popped distance exceeds the recorded best distance.',
    ],
    practice: {
      prompt: 'You are given a network of n nodes labelled 1 to n and a list of travel times directed edges times[i] = [u, v, w]. Return the minimum time for all n nodes to receive a signal sent from node k, or -1 if impossible.',
      leetcode: { title: 'Network Delay Time', slug: 'network-delay-time' },
    },
  },

  // =========================================================================
  // Lesson 11: Minimum spanning tree: Kruskal and Prim
  // =========================================================================
  {
    sub: 11,
    summary: 'Find the minimum spanning tree of a weighted undirected graph using Kruskal’s algorithm with Union-Find and Prim’s algorithm with a priority queue.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'A **spanning tree** of a connected, undirected graph with V vertices is a subgraph that connects all V vertices using exactly V - 1 edges without forming any cycles. A **Minimum Spanning Tree (MST)** is a spanning tree whose total sum of edge weights is minimal. MST algorithms are central to network design, such as laying cables or designing roads at minimum construction cost.',
      },
      { kind: 'heading', text: 'Kruskal’s algorithm (greedy edges with Union-Find)' },
      {
        kind: 'text',
        body: 'Kruskal’s algorithm is an edge-centric greedy algorithm. First, sort all E edges in non-decreasing order of weight. Iterate through the sorted edges: for each edge `(u, v, w)`, use **Disjoint Set Union (DSU / Union-Find)** to check if u and v belong to the same component. If they belong to different components, union their sets and add the edge to the MST. Stop once V - 1 edges have been added.',
      },
      {
        kind: 'code',
        caption: 'Kruskal’s algorithm using Disjoint Set Union with path compression',
        code: {
          cpp: `#include <bits/stdc++.h>
using namespace std;

struct DSU {
    vector<int> parent;
    DSU(int n) : parent(n) { iota(parent.begin(), parent.end(), 0); }
    int find(int i) { return parent[i] == i ? i : parent[i] = find(parent[i]); }
    bool unite(int i, int j) {
        int rootI = find(i), rootJ = find(j);
        if (rootI != rootJ) { parent[rootI] = rootJ; return true; }
        return false;
    }
};

int kruskalMST(int n, vector<vector<int>>& edges) {
    // edges[i] = {u, v, weight}
    sort(edges.begin(), edges.end(), [](const auto& a, const auto& b) { return a[2] < b[2]; });
    DSU dsu(n);
    int totalWeight = 0, edgesUsed = 0;
    for (const auto& e : edges) {
        if (dsu.unite(e[0], e[1])) {
            totalWeight += e[2];
            if (++edgesUsed == n - 1) break;
        }
    }
    return edgesUsed == n - 1 ? totalWeight : -1;
}`,
          java: `static class DSU {
    int[] parent;
    DSU(int n) {
        parent = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
    }
    int find(int i) { return parent[i] == i ? i : (parent[i] = find(parent[i])); }
    boolean unite(int i, int j) {
        int rootI = find(i), rootJ = find(j);
        if (rootI != rootJ) { parent[rootI] = rootJ; return true; }
        return false;
    }
}

public int kruskalMST(int n, int[][] edges) {
    Arrays.sort(edges, Comparator.comparingInt(a -> a[2]));
    DSU dsu = new DSU(n);
    int totalWeight = 0, edgesUsed = 0;
    for (int[] e : edges) {
        if (dsu.unite(e[0], e[1])) {
            totalWeight += e[2];
            if (++edgesUsed == n - 1) break;
        }
    }
    return edgesUsed == n - 1 ? totalWeight : -1;
}`,
          python: `class DSU:
    def __init__(self, n: int):
        self.parent = list(range(n))
    def find(self, i: int) -> int:
        if self.parent[i] == i: return i
        self.parent[i] = self.find(self.parent[i])
        return self.parent[i]
    def unite(self, i: int, j: int) -> bool:
        root_i, root_j = self.find(i), self.find(j)
        if root_i != root_j:
            self.parent[root_i] = root_j
            return True
        return False

def kruskal_mst(n: int, edges: list[list[int]]) -> int:
    edges.sort(key=lambda x: x[2])
    dsu, total_weight, edges_used = DSU(n), 0, 0
    for u, v, w in edges:
        if dsu.unite(u, v):
            total_weight += w
            edges_used += 1
            if edges_used == n - 1: break
    return total_weight if edges_used == n - 1 else -1`,
        },
      },
      { kind: 'heading', text: 'Kruskal vs Prim comparison' },
      {
        kind: 'text',
        body: 'While Kruskal sorts all edges globally, **Prim’s algorithm** grows a single tree outward from an arbitrary start vertex using a min-priority queue (similar to Dijkstra). Kruskal is preferred on sparse graphs and edge lists running in **O(E log E)** time. Prim is preferred on dense graphs where E ≈ V², running in **O(V²)** with an adjacency matrix or **O(E log V)** with a heap.',
      },
      {
        kind: 'table',
        headers: ['Algorithm', 'Strategy', 'Primary Data Structure', 'Time Complexity', 'Best For'],
        rows: [
          ['Kruskal’s', 'Greedy edge selection across whole graph', 'Union-Find (DSU)', 'O(E log E)', 'Sparse graphs (E << V^2)'],
          ['Prim’s (Heap)', 'Grows tree outward from one vertex', 'Min-Priority Queue', 'O(E log V)', 'Dense graphs (E ≈ V^2)'],
        ],
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'MST does not minimize path distances between pairs',
        body: 'An MST minimizes the total weight of all edges combined across the entire tree. It does NOT guarantee shortest path distances between individual pairs of nodes. Use Dijkstra to find shortest paths; use Kruskal or Prim to minimize total network connecting cost.',
      },
    ],
    keyTakeaways: [
      'A Minimum Spanning Tree connects all V vertices with V - 1 edges while minimizing the total edge weight.',
      'Kruskal sorts all edges and uses Union-Find to greedily select edges that bridge separate components.',
      'Kruskal runs in O(E log E) time, which equals O(E log V) because E <= V².',
      'MST minimizes total network weight, whereas Dijkstra minimizes distance from a single source.',
    ],
    practice: {
      prompt: 'Given coordinates of points on a 2D plane where the cost of connecting two points is their Manhattan distance, return the minimum cost to connect all points into a single network.',
      leetcode: { title: 'Min Cost to Connect All Points', slug: 'min-cost-to-connect-all-points' },
    },
  },

  // =========================================================================
  // Lesson 12: Grids as graphs
  // =========================================================================
  {
    sub: 12,
    summary: 'Model 2D matrices as implicit graphs, navigating adjacent cells with coordinate delta vectors and boundary validations.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Many graph problems take place on a 2D matrix representing a maze, map, or chessboard. Instead of an explicit adjacency list, a 2D grid is an **implicit graph**: each cell `(r, c)` is a vertex, and adjacent orthogonal cells (up, down, left, right) are connected by edges. Neighbors are calculated dynamically during the search.',
      },
      { kind: 'heading', text: 'Direction vectors and boundary checks' },
      {
        kind: 'text',
        body: 'To explore orthogonal neighbors cleanly without repetitive code, define direction delta arrays `dr = {-1, 1, 0, 0}` and `dc = {0, 0, -1, 1}`. Iterate through the 4 directions to compute `nr = r + dr[d]` and `nc = c + dc[d]`. Before accessing `grid[nr][nc]`, always verify that coordinates lie within bounds: `nr >= 0 && nr < R && nc >= 0 && nc < C`.',
      },
      {
        kind: 'code',
        caption: 'Counting connected islands on a 2D grid using DFS and direction arrays',
        code: {
          cpp: `#include <bits/stdc++.h>
using namespace std;

int numIslands(vector<vector<char>>& grid) {
    if (grid.empty()) return 0;
    int R = grid.size(), C = grid[0].size(), islands = 0;
    const int dr[4] = {-1, 1, 0, 0}, dc[4] = {0, 0, -1, 1};

    auto dfs = [&](auto& self, int r, int c) -> void {
        grid[r][c] = '0'; // Sink island cell to mark visited
        for (int d = 0; d < 4; d++) {
            int nr = r + dr[d], nc = c + dc[d];
            if (nr >= 0 && nr < R && nc >= 0 && nc < C && grid[nr][nc] == '1') {
                self(self, nr, nc);
            }
        }
    };

    for (int r = 0; r < R; r++) {
        for (int c = 0; c < C; c++) {
            if (grid[r][c] == '1') {
                islands++;
                dfs(dfs, r, c);
            }
        }
    }
    return islands;
}`,
          java: `public int numIslands(char[][] grid) {
    if (grid == null || grid.length == 0) return 0;
    int R = grid.length, C = grid[0].length, islands = 0;
    for (int r = 0; r < R; r++) {
        for (int c = 0; c < C; c++) {
            if (grid[r][c] == '1') {
                islands++;
                dfs(grid, r, c, R, C);
            }
        }
    }
    return islands;
}

private void dfs(char[][] grid, int r, int c, int R, int C) {
    grid[r][c] = '0'; // Sink island cell to mark visited
    int[] dr = {-1, 1, 0, 0}, dc = {0, 0, -1, 1};
    for (int d = 0; d < 4; d++) {
        int nr = r + dr[d], nc = c + dc[d];
        if (nr >= 0 && nr < R && nc >= 0 && nc < C && grid[nr][nc] == '1') {
            dfs(grid, nr, nc, R, C);
        }
    }
}`,
          python: `def num_islands(grid: list[list[str]]) -> int:
    if not grid: return 0
    R, C = len(grid), len(grid[0])
    islands = 0
    directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]

    def dfs(r: int, c: int) -> None:
        grid[r][c] = "0"  # Sink island cell to mark visited
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if 0 <= nr < R and 0 <= nc < C and grid[nr][nc] == "1":
                dfs(nr, nc)

    for r in range(R):
        for c in range(C):
            if grid[r][c] == "1":
                islands += 1
                dfs(r, c)
    return islands`,
        },
      },
      { kind: 'heading', text: 'Grid complexity characteristics' },
      {
        kind: 'text',
        body: 'In an R x C grid, the total number of vertices is V = R x C. Each cell has at most 4 edges, so the total number of edges E is bounded by 4 x R x C. Therefore, both BFS and DFS traversals on a grid run in **O(R x C)** time, which is linear with respect to the total cells in the matrix.',
      },
      {
        kind: 'table',
        headers: ['Grid Feature', 'Graph Analogue', 'Quantity in R x C Grid'],
        rows: [
          ['Cell (r, c)', 'Vertex', 'V = R * C'],
          ['Step (dr, dc)', 'Directed / Undirected Edge', 'E <= 4 * R * C'],
          ['Connected Land Region', 'Connected Component', '1 to R * C components'],
          ['Shortest Grid Path', 'Unweighted Shortest Path (BFS)', 'O(R * C) time and space'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Evaluating array access before coordinate bounds',
        body: 'In expressions like if (grid[nr][nc] == 1 && nr >= 0 && nr < R), code evaluates from left to right. If nr is -1, evaluating grid[-1][nc] immediately throws an out-of-bounds error or segmentation fault. Always validate coordinate bounds before dereferencing array cells.',
      },
    ],
    keyTakeaways: [
      'A 2D matrix is an implicit graph where each cell is a vertex with up to 4 orthogonal neighbors.',
      'Direction vectors (dr and dc) generate neighbor coordinates concisely and reliably.',
      'Always validate 0 <= nr < R and 0 <= nc < C before accessing grid[nr][nc].',
      'Grid traversals run in O(R x C) time and O(R x C) space.',
    ],
    practice: {
      prompt: 'Given an m x n 2D binary grid grid representing a map of 1s (land) and 0s (water), count and return the total number of islands.',
      leetcode: { title: 'Number of Islands', slug: 'number-of-islands' },
    },
  },
];
