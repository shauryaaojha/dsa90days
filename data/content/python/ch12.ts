import type { Lesson } from '../types';

/**
 * Python Chapter 12 — Building Data Structures from Scratch.
 * Python's built-ins cover most needs, so this chapter is about the handful
 * that have no built-in, and about understanding what the built-ins do.
 */
export const ch12: Lesson[] = [
  // -------------------------------------------------------------------------
  {
    topicId: 'python-12.1',
    language: 'python',
    summary: 'Build a singly linked list and handle the pointer surgery correctly.',
    readMinutes: 6,
    blocks: [
      {
        kind: 'text',
        body: 'A singly linked list is a chain of nodes, each holding a value and a reference to the next. Python has no linked list in its standard library, and it does not need one — but a whole family of LeetCode problems hands you these nodes and asks you to rewire them by hand.',
      },
      {
        kind: 'code',
        caption: 'The node and the basic moves',
        code: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

# Traverse
cur = head
while cur:
    print(cur.val)
    cur = cur.next

# Insert at the front — O(1)
head = ListNode(x, head)

# Insert after a node — O(1)
node.next = ListNode(x, node.next)

# Delete the node AFTER a given one — O(1)
node.next = node.next.next`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The dummy head removes every edge case',
        body: 'Deleting or inserting at the head normally needs a special branch. Create `dummy = ListNode(0, head)`, work from `dummy`, and return `dummy.next`. The head stops being special and half the bugs disappear.',
      },
      {
        kind: 'code',
        caption: 'Delete by value, with a dummy head',
        code: `def remove_elements(head, val):
    dummy = ListNode(0, head)
    prev = dummy

    while prev.next:
        if prev.next.val == val:
            prev.next = prev.next.next     # skip it — do NOT advance prev
        else:
            prev = prev.next

    return dummy.next        # correct even if the original head was removed`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Do not advance after deleting',
        body: 'After `prev.next = prev.next.next`, the new `prev.next` has not been checked yet. Advancing as well skips it, so consecutive matching values survive. The `if/else` above is what keeps this correct.',
      },
      {
        kind: 'code',
        caption: 'Reversal — worth memorising',
        code: `def reverse(head):
    prev, cur = None, head

    while cur:
        nxt = cur.next        # SAVE before overwriting
        cur.next = prev       # flip the arrow
        prev = cur            # shuffle both forward
        cur = nxt

    return prev               # prev is the new head`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Python lets you write the shuffle in one line',
        body: '`cur.next, prev, cur = prev, cur, cur.next` does all four assignments at once, because the right-hand side is evaluated fully before anything is assigned. It is elegant — but write the explicit version until the algorithm is second nature.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Recursion depth equals list length',
        body: 'A recursive reversal on a 10⁵-node list raises `RecursionError` — Python\'s default limit is 1000. The iterative version above uses O(1) space and no stack. Prefer it whenever the constraints are large.',
      },
    ],
    keyTakeaways: [
      'A dummy head removes every "what if it is the first node?" branch.',
      'After deleting, do not advance the previous pointer.',
      'Reversal is three pointers: save next, flip, shuffle forward.',
      'Recursive list operations hit Python\'s recursion limit at 1000.',
    ],
    practice: {
      prompt: 'Write iterative reversal from memory, then Remove Linked List Elements with a dummy head. Test with a list where every value matches the one to delete.',
      leetcode: { title: 'Reverse Linked List', slug: 'reverse-linked-list' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-12.2',
    language: 'python',
    summary: 'Build a doubly linked list, the structure behind an LRU cache.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'A doubly linked list adds a `prev` reference to each node. That extra pointer buys **O(1) removal of a node you already hold** — no walking from the head to find its predecessor. That is exactly what an LRU cache needs, and it is the main reason to build one in Python.',
      },
      {
        kind: 'code',
        code: `class Node:
    def __init__(self, key=0, value=0):
        self.key, self.value = key, value
        self.prev = self.next = None`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Use sentinel head and tail nodes',
        body: 'Two permanent dummy nodes mean every real node always has a non-null `prev` and `next`. Insert and remove then need no `None` checks — four unconditional assignments each. This is the single biggest simplification available.',
      },
      {
        kind: 'code',
        caption: 'Insert and remove with sentinels',
        code: `head, tail = Node(), Node()
head.next, tail.prev = tail, head        # empty: head <-> tail

def add_after_head(node):                # most-recently-used position
    node.next = head.next
    node.prev = head
    head.next.prev = node
    head.next = node

def remove(node):                        # O(1) — no traversal
    node.prev.next = node.next
    node.next.prev = node.prev`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Order matters when relinking',
        body: 'Set `node.next` before overwriting `head.next`. The wrong order loses the reference to the old first node and silently truncates the list. Write the two "outward" assignments first, then the two "inward" ones.',
      },
      {
        kind: 'code',
        caption: 'LRU Cache — the canonical use',
        code: `class LRUCache:
    def __init__(self, capacity):
        self.cap = capacity
        self.map = {}                        # key -> Node
        self.head, self.tail = Node(), Node()
        self.head.next, self.tail.prev = self.tail, self.head

    def get(self, key):
        if key not in self.map:
            return -1
        node = self.map[key]
        self._remove(node); self._add(node)  # mark as most recently used
        return node.value

    def put(self, key, value):
        if key in self.map:
            self._remove(self.map[key])

        node = Node(key, value)
        self.map[key] = node
        self._add(node)

        if len(self.map) > self.cap:
            lru = self.tail.prev             # least recently used
            self._remove(lru)
            del self.map[lru.key]            # needs lru.key`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Store the key inside the node',
        body: 'On eviction you hold the `Node` but must delete it from the dict, which is keyed by `key`. Without `node.key` that is impossible in O(1). Every correct LRU implementation stores the key for exactly this reason.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The Python shortcut, if allowed',
        body: '`collections.OrderedDict` has `move_to_end` and `popitem(last=False)`, which gives an LRU cache in about six lines. Interviewers usually want the manual version — but knowing the shortcut exists is worth a sentence.',
      },
    ],
    keyTakeaways: [
      '`prev` buys O(1) removal of a node you already hold.',
      'Sentinel head and tail eliminate all `None` checks.',
      'Relink outward first, then inward.',
      'Store the key in the node so eviction can clean up the dict.',
    ],
    practice: {
      prompt: 'Implement LRU Cache with a dict plus your own doubly linked list. Then rewrite it with `OrderedDict` and compare the line counts.',
      leetcode: { title: 'LRU Cache', slug: 'lru-cache' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-12.3',
    language: 'python',
    summary: 'Use a list as a stack, and build the O(1)-minimum variant.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Python needs no stack class — a list already gives O(1) `append` and `pop` at the end. What is worth building is the *augmented* stack: one that answers an extra question in O(1), which is a common design request.',
      },
      {
        kind: 'code',
        caption: 'The list as a stack',
        code: `stack = []
stack.append(x)       # push — O(1)
stack.pop()           # pop  — O(1)
stack[-1]             # peek — O(1)
while stack: ...      # emptiness test`,
      },
      { kind: 'heading', text: 'Min Stack — getMin in O(1)' },
      {
        kind: 'code',
        code: `class MinStack:
    def __init__(self):
        self.stack = []
        self.mins = []                       # running minimum

    def push(self, x):
        self.stack.append(x)
        # keep the two stacks in LOCKSTEP
        self.mins.append(x if not self.mins else min(x, self.mins[-1]))

    def pop(self):
        self.stack.pop()
        self.mins.pop()

    def top(self):
        return self.stack[-1]

    def getMin(self):
        return self.mins[-1]`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Push to the min stack on **every** push',
        body: 'It is tempting to skip pushing when the value is not smaller — but then the stacks fall out of sync and `pop` corrupts the minimum. Push every time; the memory is the price of the simplicity, and it is worth paying.',
      },
      {
        kind: 'text',
        body: 'The "second stack of the answer so far" idea generalises to any property you can maintain incrementally — minimum, maximum, running sum. Recognising that shape matters more than the specific problem.',
      },
      {
        kind: 'code',
        caption: 'A single-stack variant, storing pairs',
        code: `class MinStack:
    def __init__(self):
        self.stack = []                      # (value, min_so_far)

    def push(self, x):
        m = x if not self.stack else min(x, self.stack[-1][1])
        self.stack.append((x, m))

    def pop(self):    self.stack.pop()
    def top(self):    return self.stack[-1][0]
    def getMin(self): return self.stack[-1][1]`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Tuples make the pairing explicit',
        body: 'Storing `(value, min_so_far)` keeps the two numbers physically together, so they cannot desynchronise. It uses the same memory as two stacks and is arguably clearer — a good example of tuples doing real work.',
      },
    ],
    keyTakeaways: [
      'A Python list is already a perfect stack.',
      'A second stack of "minimum so far" gives O(1) `getMin`.',
      'Push to both on every push, or they desynchronise.',
      'Storing `(value, min)` tuples makes desynchronisation impossible.',
    ],
    practice: {
      prompt: 'Implement Min Stack both ways — two stacks and one stack of tuples. Then try skipping the min push when the value is larger and find an input that breaks it.',
      leetcode: { title: 'Min Stack', slug: 'min-stack' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-12.4',
    language: 'python',
    summary: 'Build a queue from a deque, and from two stacks.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'In Python a queue is `collections.deque` and there is nothing to build. What is worth building is the interview classic: **a queue made from two stacks**, which teaches amortised analysis better than any explanation.',
      },
      {
        kind: 'code',
        caption: 'The real answer',
        code: `from collections import deque

q = deque()
q.append(x)          # enqueue — O(1)
q.popleft()          # dequeue — O(1)
q[0]                 # peek front
while q: ...`,
      },
      { kind: 'heading', text: 'Queue from two stacks' },
      {
        kind: 'code',
        code: `class MyQueue:
    def __init__(self):
        self.inbox = []
        self.outbox = []

    def push(self, x):
        self.inbox.append(x)

    def pop(self):
        self._transfer()
        return self.outbox.pop()

    def peek(self):
        self._transfer()
        return self.outbox[-1]

    def _transfer(self):
        # ONLY when outbox is empty — this is what keeps it amortised O(1)
        if not self.outbox:
            while self.inbox:
                self.outbox.append(self.inbox.pop())

    def empty(self):
        return not self.inbox and not self.outbox`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Why the transfer is amortised O(1)',
        body: 'Each element moves from `inbox` to `outbox` **exactly once** in its lifetime. A single `pop` might cost O(n), but across n operations the total work is O(n) — so the average is constant. That amortised argument is the entire point of the question.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Transfer only when the outbox is empty',
        body: 'Transferring on every operation destroys both the ordering and the complexity. The `if not self.outbox` guard *is* the algorithm — remove it and you have a broken, slow queue.',
      },
      {
        kind: 'text',
        body: 'Reversing twice — once into `inbox`, once into `outbox` — is what turns LIFO into FIFO. Drawing it on paper with three elements makes it click far faster than reading the code.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Never build a queue from a list with `pop(0)`',
        body: '`pop(0)` is O(n) because everything shifts left. A BFS over 10⁵ nodes becomes 10¹⁰ operations and times out — while producing perfectly correct answers on small inputs. This is the most common Python performance bug in all of DSA.',
      },
    ],
    keyTakeaways: [
      'A queue in Python is `deque` — there is nothing to build.',
      'Two stacks make a queue; transfer only when the outbox is empty.',
      'Each element moves once, so the transfer is amortised O(1).',
      '`list.pop(0)` is O(n) and the classic Python timeout.',
    ],
    practice: {
      prompt: 'Implement Queue using Stacks. Then remove the `if not self.outbox` guard and trace what happens with pushes interleaved between pops.',
      leetcode: { title: 'Implement Queue using Stacks', slug: 'implement-queue-using-stacks' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-12.5',
    language: 'python',
    summary: 'Define binary tree nodes and build trees for testing.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A binary tree is a node with up to two children, each itself a binary tree. That recursive definition is why nearly every tree algorithm is three lines — you handle the current node and trust the two subtrees.',
      },
      {
        kind: 'code',
        code: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'LeetCode supplies this class',
        body: 'It appears commented out at the top of the editor. You rarely write it — but you must read it fluently, and you will write your own for trie and design problems.',
      },
      {
        kind: 'code',
        caption: 'Building a tree by hand, for local testing',
        code: `#       1
#      / \\
#     2   3
#    /
#   4

root = TreeNode(1,
                TreeNode(2, TreeNode(4)),
                TreeNode(3))`,
      },
      {
        kind: 'code',
        caption: 'Building from a level-order list, the way LeetCode encodes them',
        code: `from collections import deque

def build(values):
    """values is LeetCode's level-order list, with None for missing nodes."""
    if not values:
        return None

    root = TreeNode(values[0])
    q = deque([root])
    i = 1

    while q and i < len(values):
        node = q.popleft()

        if i < len(values) and values[i] is not None:
            node.left = TreeNode(values[i]); q.append(node.left)
        i += 1

        if i < len(values) and values[i] is not None:
            node.right = TreeNode(values[i]); q.append(node.right)
        i += 1

    return root`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Being able to build a tree locally is worth the twenty lines',
        body: 'It lets you test on your own machine with printed output rather than submitting blind. Keep this helper in your snippet file — you will use it on every tree problem you debug.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: '`None` children are normal, not errors',
        body: 'Every leaf has `left = right = None`, which is why every tree recursion begins with `if not node: return`. Omitting that base case gives `AttributeError: NoneType has no attribute val` at the first leaf.',
      },
      {
        kind: 'text',
        body: 'A binary **search** tree adds one rule: everything in the left subtree is smaller, everything in the right is larger. That single invariant is what makes lookup O(height) and makes inorder traversal produce sorted output.',
      },
    ],
    keyTakeaways: [
      'A tree is a node plus two subtrees — hence the three-line recursions.',
      'LeetCode supplies `TreeNode`; you read it more than you write it.',
      'A level-order builder lets you test locally — keep one in your snippets.',
      'Every recursion starts with `if not node: return`.',
    ],
    practice: {
      prompt: 'Write the `build` helper and use it to construct `[3,9,20,None,None,15,7]`. Then write `max_depth` and check it returns 3.',
      leetcode: { title: 'Maximum Depth of Binary Tree', slug: 'maximum-depth-of-binary-tree' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-12.6',
    language: 'python',
    summary: 'Represent graphs, and build the adjacency list from an edge list.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Graph problems almost never hand you a graph — they hand you an **edge list**, and building the representation is your first step. In Python that build is two lines thanks to `defaultdict`.',
      },
      {
        kind: 'code',
        caption: 'The adjacency list',
        code: `from collections import defaultdict

adj = defaultdict(list)

for u, v in edges:
    adj[u].append(v)
    adj[v].append(u)          # omit this line for a DIRECTED graph

for nxt in adj[node]:         # a node with no edges gives [] — no KeyError
    ...`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: '`defaultdict(list)` handles isolated nodes for free',
        body: 'Iterating `adj[node]` for a node with no edges returns an empty list rather than raising. That removes a whole class of guard from traversal code — though note it also *inserts* the empty list as a side effect.',
      },
      {
        kind: 'code',
        caption: 'When nodes are numbered 0..n-1',
        code: `adj = [[] for _ in range(n)]      # a plain list of lists

for u, v in edges:
    adj[u].append(v)
    adj[v].append(u)`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Never write `[[]] * n`',
        body: 'That creates n references to the **same** list, so appending to one appends to all. Use `[[] for _ in range(n)]`. This is the same aliasing bug as the 2-D grid trap, and it is just as easy to miss.',
      },
      {
        kind: 'code',
        caption: 'Weighted graphs and string nodes',
        code: `adj = defaultdict(list)
for u, v, w in edges:
    adj[u].append((v, w))        # store a tuple
    adj[v].append((u, w))

for nxt, weight in adj[node]:
    ...`,
      },
      {
        kind: 'table',
        headers: ['', 'Adjacency list', 'Adjacency matrix'],
        rows: [
          ['Space', 'O(V + E)', '**O(V²)**'],
          ['List a node\'s neighbours', 'O(degree)', 'O(V)'],
          ['"Is there an edge u→v?"', 'O(degree)', '**O(1)**'],
          ['Use for', 'Sparse graphs (most)', 'Dense, or given as a matrix'],
        ],
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Forgetting the reverse edge',
        body: 'Adding only `adj[u].append(v)` makes an undirected graph directed. Traversal then silently misses paths and the answer is wrong in a plausible-looking way. If the problem says undirected, both lines must be there.',
      },
    ],
    keyTakeaways: [
      'Build the adjacency list from the edge list — always the first step.',
      '`defaultdict(list)` handles missing nodes automatically.',
      'Never `[[]] * n` — use a comprehension.',
      'Undirected means appending in both directions.',
    ],
    practice: {
      prompt: 'Build an adjacency list two ways — `defaultdict` and a list comprehension — and run BFS on both. Then try `[[]] * n` and watch every node share one neighbour list.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-12.7',
    language: 'python',
    summary: 'Understand how a heap works by building one.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'You will use `heapq` rather than writing this — but building a heap once removes the mystery, and interviewers do ask how one works. It all rests on the fact that a **complete binary tree fits perfectly into a flat list**.',
      },
      {
        kind: 'code',
        caption: 'The index arithmetic',
        code: `For index i:
    left  = 2i + 1
    right = 2i + 2
    parent = (i - 1) // 2

        1(0)
       /    \\
     3(1)   2(2)
     /  \\
   5(3) 4(4)          list: [1, 3, 2, 5, 4]`,
      },
      {
        kind: 'code',
        caption: 'A min-heap from scratch',
        code: `class MinHeap:
    def __init__(self):
        self.a = []

    def push(self, x):
        self.a.append(x)              # put it at the end
        self._sift_up(len(self.a) - 1)

    def pop(self):
        top = self.a[0]
        self.a[0] = self.a[-1]        # move the last element to the root
        self.a.pop()
        if self.a:
            self._sift_down(0)
        return top

    def _sift_up(self, i):
        while i > 0:
            parent = (i - 1) // 2
            if self.a[parent] <= self.a[i]:
                break                 # heap property restored
            self.a[i], self.a[parent] = self.a[parent], self.a[i]
            i = parent

    def _sift_down(self, i):
        n = len(self.a)
        while True:
            smallest, l, r = i, 2*i + 1, 2*i + 2

            if l < n and self.a[l] < self.a[smallest]: smallest = l
            if r < n and self.a[r] < self.a[smallest]: smallest = r
            if smallest == i:
                break

            self.a[i], self.a[smallest] = self.a[smallest], self.a[i]
            i = smallest`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Both operations walk one root-to-leaf path',
        body: 'That path is log n long in a complete tree, which is exactly why push and pop are O(log n). Nothing else is touched — that is what the weak "parent ≤ child" promise buys you.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: '`_sift_down` must compare against the **smaller** child',
        body: 'Swapping with an arbitrary child can break the heap property on the other branch. You must find the smallest of the node and both children, then swap with that — which is what the two `if` lines do.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Building from n elements is O(n)',
        body: 'Sift down from the middle of the list to the front. Most elements are near the bottom and barely move; only the few near the root travel far. The sum is linear — which is why `heapq.heapify` beats n separate pushes.',
      },
      {
        kind: 'text',
        body: 'For a max-heap, flip every comparison — or, as `heapq` forces you to, negate the values. The structure is identical; only the notion of "smaller" changes.',
      },
    ],
    keyTakeaways: [
      'A complete tree maps to a list via `2i+1`, `2i+2`, `(i-1)//2`.',
      'Push sifts up; pop moves the last element to the root and sifts down.',
      'Both walk one root-to-leaf path — hence O(log n).',
      'Sift down must swap with the smaller child.',
    ],
    practice: {
      prompt: 'Implement the min-heap above and verify it against `heapq` on random input. Then trace `_sift_down` by hand on `[9, 3, 2, 5, 4]` after a pop.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-12.8',
    language: 'python',
    summary: 'Decide when to build your own structure and when to use a built-in.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'For almost every problem: **use the built-in**. Python\'s containers are implemented in C and are dramatically faster than anything you will write in Python. There are four situations where building your own is right.',
      },
      {
        kind: 'table',
        headers: ['Situation', 'Example'],
        rows: [
          ['The problem explicitly asks', '"Implement Trie", "Design LRU Cache"'],
          ['No built-in exists', 'Union-find, trie, segment tree'],
          ['You manipulate the nodes', 'Linked-list and tree problems'],
          ['Combining structures', 'dict + doubly linked list for LRU'],
        ],
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'A hand-written structure in Python is slow',
        body: 'A Python-level heap is perhaps 10–50× slower than `heapq`, because the latter runs in C. In C++ or Java a hand-rolled version costs little; in Python it can be the difference between passing and timing out. Reach for the built-in unless there genuinely is not one.',
      },
      {
        kind: 'code',
        caption: 'The two structures genuinely worth memorising',
        code: `class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.size = [1] * n
        self.components = n

    def find(self, x):
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]   # path compression
            x = self.parent[x]
        return x

    def unite(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return False                                   # already joined
        if self.size[ra] < self.size[rb]:
            ra, rb = rb, ra
        self.parent[rb] = ra
        self.size[ra] += self.size[rb]
        self.components -= 1
        return True


class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_word = False`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The iterative `find` avoids the recursion limit',
        body: 'A recursive `find` with path compression is shorter, but on a degenerate tree it can exceed Python\'s 1000-frame limit. The `while` loop above compresses just as effectively and never overflows.',
      },
      {
        kind: 'table',
        headers: ['Want', 'Use'],
        rows: [
          ['Dynamic array', '`list`'],
          ['Stack', '`list`'],
          ['Queue / deque', '`collections.deque`'],
          ['Heap', '`heapq`'],
          ['Hash map / set', '`dict` / `set`'],
          ['Counting', '`collections.Counter`'],
          ['Grouping', '`collections.defaultdict`'],
          ['Sorted container', '`sorted` + `bisect`'],
          ['Union-find', '**Write it yourself**'],
          ['Trie', '**Write it yourself**'],
        ],
      },
      {
        kind: 'text',
        body: 'Note the one real gap: Python has no built-in balanced BST, so "nearest key" queries need `sorted` plus `bisect` (with O(n) insertion) or a third-party `sortedcontainers`, which LeetCode does provide. That is worth knowing if a problem needs ordered insertion at scale.',
      },
    ],
    keyTakeaways: [
      'Built-ins run in C — a hand-written structure is much slower.',
      'DSU and trie have no built-in; memorise both.',
      'Use the iterative `find` to avoid Python\'s recursion limit.',
      'Python lacks a balanced BST — `bisect` or `sortedcontainers` fills the gap.',
    ],
    practice: {
      prompt: 'Write the DSU from memory and count connected components with it. Then implement a Trie. Those two are the highest-return custom structures in Python DSA.',
      leetcode: { title: 'Number of Provinces', slug: 'number-of-provinces' },
    },
  },
];
