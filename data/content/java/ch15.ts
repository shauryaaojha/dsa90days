import type { Lesson } from '../types';

/**
 * Java Chapter 15 — Building Data Structures from Scratch.
 * Not because you should reimplement the library, but because "design X"
 * questions ask for exactly this, and because building one teaches the costs.
 */
export const ch15: Lesson[] = [
  // -------------------------------------------------------------------------
  {
    topicId: 'java-15.1',
    language: 'java',
    summary: 'Build a singly linked list and handle the pointer surgery correctly.',
    readMinutes: 6,
    blocks: [
      {
        kind: 'text',
        body: 'A singly linked list is a chain of nodes, each holding a value and a reference to the next. It is the structure behind a whole family of LeetCode problems — and unlike most of this chapter, you genuinely manipulate it by hand rather than using a library class.',
      },
      {
        kind: 'code',
        caption: 'The node and the basic operations',
        code: `class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
}

// Traverse
for (ListNode cur = head; cur != null; cur = cur.next)
    System.out.println(cur.val);

// Insert at the front — O(1)
ListNode newHead = new ListNode(x);
newHead.next = head;
head = newHead;

// Insert after a node — O(1) given the node
node.next = new ListNode(x, node.next);

// Delete the node AFTER a given one — O(1)
node.next = node.next.next;`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The dummy head removes every edge case',
        body: 'Deleting or inserting at the head normally needs a special branch. Create `ListNode dummy = new ListNode(0); dummy.next = head;`, work from `dummy`, and return `dummy.next`. The head stops being special, and half the bugs disappear.',
      },
      {
        kind: 'code',
        caption: 'Delete by value, with a dummy head',
        code: `ListNode removeElements(ListNode head, int val) {
    ListNode dummy = new ListNode(0);
    dummy.next = head;

    ListNode prev = dummy;
    while (prev.next != null) {
        if (prev.next.val == val) prev.next = prev.next.next;   // skip it
        else                      prev = prev.next;             // advance
    }
    return dummy.next;      // works even if the original head was deleted
}`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Do not advance `prev` after a deletion',
        body: 'After `prev.next = prev.next.next`, the new `prev.next` has not been checked yet. Advancing as well skips it — so consecutive matching values survive. The `if/else` above is what keeps that correct.',
      },
      {
        kind: 'code',
        caption: 'Reversal — the operation worth memorising',
        code: `ListNode reverse(ListNode head) {
    ListNode prev = null, cur = head;

    while (cur != null) {
        ListNode nextTemp = cur.next;   // SAVE before overwriting
        cur.next = prev;                // flip the arrow
        prev = cur;                     // shuffle both forward
        cur = nextTemp;
    }
    return prev;                        // prev is the new head
}`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Save `next` before you overwrite it',
        body: 'Once `cur.next = prev` runs, the rest of the list is unreachable unless you saved it. Forgetting `nextTemp` truncates the list to two nodes and is the classic reversal bug.',
      },
      {
        kind: 'text',
        body: 'Three pointers, four lines, in that exact order. Write it from memory until it is automatic — reversal appears directly in interviews and as a sub-step in palindrome checks, reordering and k-group reversal.',
      },
    ],
    keyTakeaways: [
      'A dummy head removes every "what if it is the first node?" branch.',
      'After deleting, do not advance the previous pointer.',
      'Reversal is three pointers: save next, flip, shuffle both forward.',
      'Losing the saved `next` truncates the list.',
    ],
    practice: {
      prompt: 'Write reversal from memory, then Remove Linked List Elements with a dummy head. Test with a list where every element matches the value to delete.',
      leetcode: { title: 'Reverse Linked List', slug: 'reverse-linked-list' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-15.2',
    language: 'java',
    summary: 'Build a doubly linked list, the structure behind an LRU cache.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'A doubly linked list adds a `prev` reference to each node. That one extra pointer buys something important: **O(1) removal of a node you already hold**, without needing to walk from the head to find its predecessor. That is exactly what an LRU cache needs.',
      },
      {
        kind: 'code',
        code: `class Node {
    int key, value;
    Node prev, next;
    Node(int key, int value) { this.key = key; this.value = value; }
}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Use sentinel head and tail nodes',
        body: 'Two permanent dummy nodes at each end mean every real node always has a non-null `prev` and `next`. Insert and remove then need no null checks at all — the code becomes four unconditional assignments. This is the single biggest simplification available here.',
      },
      {
        kind: 'code',
        caption: 'Insert and remove with sentinels',
        code: `Node head = new Node(0, 0), tail = new Node(0, 0);
head.next = tail;
tail.prev = head;                 // empty list: head <-> tail

void addAfterHead(Node node) {    // most-recently-used position
    node.next = head.next;
    node.prev = head;
    head.next.prev = node;
    head.next = node;
}

void remove(Node node) {          // O(1) — no traversal needed
    node.prev.next = node.next;
    node.next.prev = node.prev;
}`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Order matters when relinking',
        body: 'In `addAfterHead`, you must set `node.next` before overwriting `head.next`. Doing it in the wrong order loses the reference to the old first node and silently truncates the list. Write the two "outward" assignments first, then the two "inward" ones.',
      },
      {
        kind: 'code',
        caption: 'LRU Cache — the classic use',
        code: `class LRUCache {
    private final Map<Integer,Node> map = new HashMap<>();
    private final Node head = new Node(0,0), tail = new Node(0,0);
    private final int capacity;

    LRUCache(int capacity) {
        this.capacity = capacity;
        head.next = tail; tail.prev = head;
    }

    public int get(int key) {
        Node n = map.get(key);
        if (n == null) return -1;

        remove(n); addAfterHead(n);        // mark as most recently used
        return n.value;
    }

    public void put(int key, int value) {
        Node existing = map.get(key);
        if (existing != null) remove(existing);

        Node n = new Node(key, value);
        map.put(key, n);
        addAfterHead(n);

        if (map.size() > capacity) {
            Node lru = tail.prev;          // least recently used
            remove(lru);
            map.remove(lru.key);           // needs lru.key — hence storing it
        }
    }
}`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Store the key inside the node',
        body: 'On eviction you have the `Node` but need to delete it from the `HashMap`, which is keyed by `key`. Without `node.key` you cannot do that in O(1). Every correct LRU implementation stores the key in the node for exactly this reason.',
      },
    ],
    keyTakeaways: [
      'The `prev` pointer buys O(1) removal of a node you already hold.',
      'Sentinel head and tail nodes eliminate all null checks.',
      'Relink outward first, then inward, or you lose references.',
      'Store the key in the node so eviction can clean up the map.',
    ],
    practice: {
      prompt: 'Implement LRU Cache with a HashMap plus your own doubly linked list. Then delete `node.key` and see why eviction becomes impossible in O(1).',
      leetcode: { title: 'LRU Cache', slug: 'lru-cache' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-15.3',
    language: 'java',
    summary: 'Build a stack from scratch, including the O(1) minimum variant.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'You will not implement a plain stack in a real solution — `ArrayDeque` exists. But "design a stack that also does X" is a common interview question, and building one makes the cost model concrete.',
      },
      {
        kind: 'code',
        caption: 'An array-backed stack',
        code: `class MyStack {
    private int[] data = new int[16];
    private int size = 0;

    void push(int x) {
        if (size == data.length)
            data = Arrays.copyOf(data, size * 2);    // grow and copy
        data[size++] = x;
    }

    int pop() {
        if (size == 0) throw new RuntimeException("empty");
        return data[--size];
    }

    int peek() { return data[size - 1]; }
    boolean isEmpty() { return size == 0; }
}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Doubling is what makes push amortised O(1)',
        body: 'Growing by a fixed amount would make n pushes O(n²). Doubling means the copies happen exponentially less often, so the total copying work across n pushes is O(n) — constant per push on average. That is the same argument behind `ArrayList`.',
      },
      { kind: 'heading', text: 'Min Stack — getMin in O(1)' },
      {
        kind: 'code',
        code: `class MinStack {
    private final Deque<Integer> stack = new ArrayDeque<>();
    private final Deque<Integer> mins  = new ArrayDeque<>();

    public void push(int x) {
        stack.push(x);
        // keep the running minimum in lockstep
        mins.push(mins.isEmpty() ? x : Math.min(x, mins.peek()));
    }

    public void pop()    { stack.pop(); mins.pop(); }
    public int  top()    { return stack.peek(); }
    public int  getMin() { return mins.peek(); }
}`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Push to the min stack on **every** push',
        body: 'It is tempting to skip pushing when the new value is not smaller — but then the two stacks fall out of sync and `pop` corrupts the minimum. Push every time; the extra memory is the price of the simplicity, and it is worth it.',
      },
      {
        kind: 'text',
        body: 'The "second stack of the answer so far" idea generalises: it gives O(1) queries for any property that can be maintained incrementally — minimum, maximum, running sum. Recognising that shape is more valuable than the specific problem.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The follow-up: one stack, O(1) space overhead',
        body: 'You can store encoded differences rather than a second stack, using `2*x - min` when a new minimum arrives. It needs `long` to avoid overflow and is genuinely tricky — worth knowing it exists if an interviewer pushes for it.',
      },
    ],
    keyTakeaways: [
      'Doubling the backing array makes push amortised O(1).',
      'A second stack of "minimum so far" gives O(1) `getMin`.',
      'Push to both stacks on every push, or they desynchronise.',
      'The pattern generalises to any incrementally maintainable property.',
    ],
    practice: {
      prompt: 'Implement Min Stack with two stacks. Then try the "skip pushing when not smaller" optimisation and find an input where popping breaks it.',
      leetcode: { title: 'Min Stack', slug: 'min-stack' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-15.4',
    language: 'java',
    summary: 'Build a queue from scratch, including the two-stack version.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'A queue from an array is trickier than a stack, because removing from the front would shift everything. The fix is a **circular buffer**: keep head and tail indices that wrap, so nothing ever moves.',
      },
      {
        kind: 'code',
        caption: 'A circular-buffer queue',
        code: `class MyQueue {
    private int[] data;
    private int head = 0, size = 0;

    MyQueue(int capacity) { data = new int[capacity]; }

    void offer(int x) {
        if (size == data.length) throw new RuntimeException("full");
        data[(head + size) % data.length] = x;      // wrap with modulo
        size++;
    }

    int poll() {
        if (size == 0) throw new RuntimeException("empty");
        int x = data[head];
        head = (head + 1) % data.length;            // wrap
        size--;
        return x;
    }

    int peek() { return data[head]; }
}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Track size, not a tail index',
        body: 'With head and tail alone, a full queue and an empty queue look identical (`head == tail`). Storing `size` removes that ambiguity entirely and is simpler than the alternative of wasting one slot.',
      },
      { kind: 'heading', text: 'Queue from two stacks — the classic question' },
      {
        kind: 'code',
        code: `class MyQueueFromStacks {
    private final Deque<Integer> in  = new ArrayDeque<>();
    private final Deque<Integer> out = new ArrayDeque<>();

    public void push(int x) { in.push(x); }

    public int pop() {
        transferIfNeeded();
        return out.pop();
    }

    public int peek() {
        transferIfNeeded();
        return out.peek();
    }

    private void transferIfNeeded() {
        // ONLY when 'out' is empty — this is what keeps it amortised O(1)
        if (out.isEmpty())
            while (!in.isEmpty()) out.push(in.pop());
    }

    public boolean empty() { return in.isEmpty() && out.isEmpty(); }
}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Why the transfer is amortised O(1)',
        body: 'Each element is moved from `in` to `out` **exactly once** in its lifetime. A single `pop` might cost O(n), but across n operations the total work is O(n) — so the average is constant. This amortised argument is the point of the question.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Transfer only when `out` is empty',
        body: 'Transferring on every operation destroys the ordering and the complexity. The `if (out.isEmpty())` guard is the entire algorithm — remove it and you have a broken, slow queue.',
      },
      {
        kind: 'text',
        body: 'Reversing the elements twice — once into `in`, once into `out` — is what turns LIFO into FIFO. Drawing it on paper with three elements makes it click faster than reading the code.',
      },
    ],
    keyTakeaways: [
      'A circular buffer avoids shifting on removal — wrap with modulo.',
      'Track `size` so full and empty are distinguishable.',
      'Two stacks make a queue; transfer only when `out` is empty.',
      'Each element moves once, so the transfer is amortised O(1).',
    ],
    practice: {
      prompt: 'Implement Queue using Stacks. Then remove the `if (out.isEmpty())` guard and trace what happens with pushes interleaved between pops.',
      leetcode: { title: 'Implement Queue using Stacks', slug: 'implement-queue-using-stacks' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-15.5',
    language: 'java',
    summary: 'Work with binary tree nodes and the traversals built on them.',
    readMinutes: 6,
    blocks: [
      {
        kind: 'text',
        body: 'A binary tree is a node with up to two children, each of which is itself a binary tree. That recursive definition is why almost every tree algorithm is three lines of recursion — you handle the current node and trust the two subtrees.',
      },
      {
        kind: 'code',
        code: `class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}`,
      },
      {
        kind: 'code',
        caption: 'The three depth-first traversals',
        code: `void preorder(TreeNode n) {     // root, left, right
    if (n == null) return;
    visit(n);
    preorder(n.left);
    preorder(n.right);
}

void inorder(TreeNode n) {      // left, root, right
    if (n == null) return;
    inorder(n.left);
    visit(n);                   // on a BST this yields SORTED order
    inorder(n.right);
}

void postorder(TreeNode n) {    // left, right, root
    if (n == null) return;
    postorder(n.left);
    postorder(n.right);
    visit(n);                   // children done before the parent
}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The name tells you where `visit` goes',
        body: '**Pre**order visits before recursing, **in**order between the two calls, **post**order after both. The recursive calls never move — only the `visit` line does. Once you see that, the three stop being separate things to memorise.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Choose the traversal by what you need',
        body: '**Preorder** when the parent must be handled first (copying a tree, serialising). **Inorder** on a BST, because it yields sorted order. **Postorder** when the answer depends on the children (height, deleting a tree, most "compute a value" problems).',
      },
      {
        kind: 'code',
        caption: 'Postorder in disguise — most tree problems',
        code: `int height(TreeNode n) {
    if (n == null) return 0;
    return 1 + Math.max(height(n.left), height(n.right));   // children first
}

boolean isBalanced(TreeNode n) { return check(n) != -1; }

int check(TreeNode n) {
    if (n == null) return 0;

    int l = check(n.left);   if (l == -1) return -1;    // early exit
    int r = check(n.right);  if (r == -1) return -1;

    if (Math.abs(l - r) > 1) return -1;                 // -1 signals "unbalanced"
    return 1 + Math.max(l, r);
}`,
      },
      {
        kind: 'code',
        caption: 'Level order — BFS with a queue',
        code: `List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> res = new ArrayList<>();
    if (root == null) return res;

    Queue<TreeNode> q = new ArrayDeque<>();
    q.offer(root);

    while (!q.isEmpty()) {
        int size = q.size();                    // snapshot this level
        List<Integer> level = new ArrayList<>();

        for (int i = 0; i < size; i++) {
            TreeNode n = q.poll();
            level.add(n.val);

            if (n.left != null)  q.offer(n.left);    // guard — ArrayDeque
            if (n.right != null) q.offer(n.right);   // rejects null
        }
        res.add(level);
    }
    return res;
}`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Recursion depth equals tree height',
        body: 'A balanced tree of a million nodes is only ~20 deep, so recursion is safe. A **degenerate** tree — every node with one child — is a linked list, so height equals n and you overflow the stack. When a problem warns the tree may be skewed, that is the hint.',
      },
    ],
    keyTakeaways: [
      'A tree is a node plus two subtrees — hence the three-line recursions.',
      'Pre/in/post differ only in where `visit` sits among the calls.',
      'Inorder on a BST gives sorted order; postorder computes from children.',
      'Level order uses a queue and a size snapshot per level.',
    ],
    practice: {
      prompt: 'Write all three DFS traversals and level order for the same tree, and compare the visit sequences. Then write `height` and `isBalanced` — both are postorder in disguise.',
      leetcode: { title: 'Binary Tree Level Order Traversal', slug: 'binary-tree-level-order-traversal' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-15.6',
    language: 'java',
    summary: 'Represent a graph, and choose between adjacency list and matrix.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Graph problems almost never hand you a graph — they hand you an **edge list**, and building the representation is your first step. That build is boilerplate you should be able to type without thinking.',
      },
      {
        kind: 'code',
        caption: 'Adjacency list — the default',
        code: `List<List<Integer>> adj = new ArrayList<>();
for (int i = 0; i < n; i++) adj.add(new ArrayList<>());

for (int[] e : edges) {
    adj.get(e[0]).add(e[1]);
    adj.get(e[1]).add(e[0]);          // omit this line for a DIRECTED graph
}

for (int next : adj.get(node)) { ... }`,
      },
      {
        kind: 'code',
        caption: 'Weighted, and with non-integer nodes',
        code: `// Weighted: store {neighbour, weight}
List<List<int[]>> adj = new ArrayList<>();
adj.get(u).add(new int[]{v, w});

// String or sparse node labels: use a Map
Map<String,List<String>> adj = new HashMap<>();
adj.computeIfAbsent(u, k -> new ArrayList<>()).add(v);`,
      },
      {
        kind: 'table',
        headers: ['', 'Adjacency list', 'Adjacency matrix'],
        rows: [
          ['Space', 'O(V + E)', '**O(V²)**'],
          ['List a node\'s neighbours', 'O(degree)', 'O(V)'],
          ['"Is there an edge u→v?"', 'O(degree)', '**O(1)**'],
          ['Good for', 'Sparse graphs (most)', 'Dense graphs, edge queries'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Use an adjacency list unless told otherwise',
        body: 'Real graphs are sparse — E is far closer to V than to V². A matrix with V = 10⁵ would need 10¹⁰ cells and is simply impossible. Reach for a matrix only when the problem hands you one, or when V is small and you need O(1) edge tests.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Forgetting the reverse edge on an undirected graph',
        body: 'Adding only `adj.get(u).add(v)` makes the graph directed. Traversal then silently misses paths, and the answer is wrong in a way that looks plausible. If the problem says "undirected", both lines must be there.',
      },
      {
        kind: 'code',
        caption: 'Grids are implicit graphs',
        code: `// No adjacency structure needed — neighbours are computed
int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};

for (int[] d : dirs) {
    int nr = r + d[0], nc = c + d[1];
    if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;    // bounds
    if (grid[nr][nc] == '0') continue;                        // wall
    ...
}`,
      },
      {
        kind: 'text',
        body: 'Recognising that a grid *is* a graph — each cell a node, each adjacent pair an edge — is what lets you apply BFS and DFS to island counting, maze solving and shortest paths without changing the algorithm at all.',
      },
    ],
    keyTakeaways: [
      'Build the adjacency list from the edge list — it is your first step.',
      'Undirected means adding both directions.',
      'Lists are O(V + E); matrices are O(V²) and only for dense graphs.',
      'A grid is an implicit graph with computed neighbours.',
    ],
    practice: {
      prompt: 'Build an adjacency list from an edge array and run BFS and DFS over it. Then solve Number of Islands treating the grid as an implicit graph.',
      leetcode: { title: 'Number of Islands', slug: 'number-of-islands' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-15.7',
    language: 'java',
    summary: 'Understand how a heap works internally by building one.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'You will use `PriorityQueue` rather than writing this — but building a heap once removes all the mystery, and interviewers do ask how one works. Everything rests on the fact that a **complete binary tree fits perfectly into an array**.',
      },
      {
        kind: 'code',
        caption: 'The index arithmetic',
        code: `For index i:
    left child  = 2i + 1
    right child = 2i + 2
    parent      = (i - 1) / 2

        1(0)
       /    \\
     3(1)   2(2)
     /  \\
   5(3) 4(4)          array: [1, 3, 2, 5, 4]`,
      },
      {
        kind: 'code',
        caption: 'A min-heap from scratch',
        code: `class MinHeap {
    private final List<Integer> a = new ArrayList<>();

    void push(int x) {
        a.add(x);                       // put it at the end
        siftUp(a.size() - 1);           // then bubble it up
    }

    int pop() {
        int top = a.get(0);
        a.set(0, a.get(a.size() - 1));  // move the last element to the root
        a.remove(a.size() - 1);
        if (!a.isEmpty()) siftDown(0);  // then bubble it down
        return top;
    }

    private void siftUp(int i) {
        while (i > 0) {
            int parent = (i - 1) / 2;
            if (a.get(parent) <= a.get(i)) break;    // heap property restored
            swap(i, parent);
            i = parent;
        }
    }

    private void siftDown(int i) {
        int n = a.size();
        while (true) {
            int smallest = i, l = 2*i + 1, r = 2*i + 2;

            if (l < n && a.get(l) < a.get(smallest)) smallest = l;
            if (r < n && a.get(r) < a.get(smallest)) smallest = r;
            if (smallest == i) break;                // done

            swap(i, smallest);
            i = smallest;
        }
    }
}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Both operations walk one root-to-leaf path',
        body: 'That path has length log n in a complete tree, which is exactly why push and pop are O(log n). Nothing else in the structure is touched — that is the efficiency the weak "parent ≤ child" promise buys you.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: '`siftDown` must compare against the smaller child',
        body: 'Swapping with an arbitrary child can break the heap property on the other branch. You must find the smallest of the node and both children, then swap with that — which is what the two `if` lines above do.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Building from n elements is O(n), not O(n log n)',
        body: 'Sift down from the middle of the array to the front. Most elements are near the bottom and barely move; only the few near the root travel far. The sum is linear — a genuinely surprising result worth being able to quote.',
      },
      {
        kind: 'text',
        body: 'For a max-heap, flip every comparison. For a heap of objects, replace `<` with a comparator call. The structure is identical — only the notion of "smaller" changes.',
      },
    ],
    keyTakeaways: [
      'A complete binary tree maps to an array via `2i+1` / `2i+2` / `(i-1)/2`.',
      'Push sifts up; pop moves the last element to the root and sifts down.',
      'Both walk one root-to-leaf path — hence O(log n).',
      'Sift down must swap with the **smaller** child.',
    ],
    practice: {
      prompt: 'Implement the min-heap above and verify it against `PriorityQueue` on random input. Then trace `siftDown` by hand on `[9, 3, 2, 5, 4]` after popping.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-15.8',
    language: 'java',
    summary: 'Decide when to build your own structure and when to use the library.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'The honest answer for almost every problem: **use the library**. It is tested, fast, and shorter. There are four specific situations where building your own is right, and recognising them is the point of this lesson.',
      },
      { kind: 'heading', text: 'Build your own when…' },
      {
        kind: 'table',
        headers: ['Situation', 'Example'],
        rows: [
          ['The problem explicitly asks', '"Implement Trie", "Design LRU Cache"'],
          ['The library lacks the operation', 'A heap with decrease-key; a DSU'],
          ['You need the nodes themselves', 'Linked-list and tree problems'],
          ['Combining structures', 'HashMap + doubly linked list for LRU'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The structures genuinely worth memorising',
        body: '**DSU** (union-find) — no library equivalent, appears constantly. **Trie** — same. **Doubly linked list + HashMap** — the LRU pattern. Everything else, use the library. Those three are a small investment with a large return.',
      },
      {
        kind: 'code',
        caption: 'DSU — worth being able to type from memory',
        code: `class DSU {
    int[] parent, size;
    int components;

    DSU(int n) {
        parent = new int[n]; size = new int[n]; components = n;
        for (int i = 0; i < n; i++) { parent[i] = i; size[i] = 1; }
    }

    int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);    // path compression
        return parent[x];
    }

    boolean unite(int a, int b) {
        int ra = find(a), rb = find(b);
        if (ra == rb) return false;                          // already joined

        if (size[ra] < size[rb]) { int t = ra; ra = rb; rb = t; }
        parent[rb] = ra;
        size[ra] += size[rb];
        components--;
        return true;
    }
}`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Do not reimplement a library structure under time pressure',
        body: 'Writing your own `ArrayList` or hash map in an interview wastes time and invites bugs, and it does not demonstrate anything the interviewer was asking for. Use the built-in and spend the time on the actual algorithm.',
      },
      {
        kind: 'text',
        body: 'The reason to have built these once, though, is that it tells you what the library is doing. Knowing `ArrayList` doubles-and-copies explains its amortised cost; knowing a heap sifts along one path explains its O(log n). That understanding is what lets you predict performance rather than guess.',
      },
      {
        kind: 'table',
        headers: ['Want', 'Library class'],
        rows: [
          ['Growable array', '`ArrayList`'],
          ['Stack / queue / deque', '`ArrayDeque`'],
          ['Heap', '`PriorityQueue`'],
          ['Hash map / set', '`HashMap` / `HashSet`'],
          ['Sorted map / set', '`TreeMap` / `TreeSet`'],
          ['Union-find', '**Write it yourself**'],
          ['Trie', '**Write it yourself**'],
        ],
      },
    ],
    keyTakeaways: [
      'Use the library unless the problem asks otherwise.',
      'DSU, trie, and HashMap-plus-linked-list have no library equivalent.',
      'Building one once explains the library\'s cost model.',
      'Never reimplement a standard container under time pressure.',
    ],
    practice: {
      prompt: 'Write the DSU from memory and use it to count connected components. Then implement a Trie. Those two are the highest-return custom structures in all of DSA.',
      leetcode: { title: 'Number of Provinces', slug: 'number-of-provinces' },
    },
  },
];
