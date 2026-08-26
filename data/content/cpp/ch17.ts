import type { Lesson } from '../types';

/**
 * Chapter 17 — Building Data Structures from Scratch.
 * Not to replace the STL, but because LeetCode hands you raw nodes, design
 * problems require hand-built internals, and interviewers ask.
 */
export const ch17: Lesson[] = [
  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-17.1',
    language: 'cpp',
    summary: 'Build and manipulate the structure every linked-list problem hands you.',
    readMinutes: 6,
    blocks: [
      {
        kind: 'text',
        body: 'A singly linked list is a chain of nodes, each holding a value and a pointer to the next. It is the structure behind a whole family of LeetCode problems — and unlike most of this chapter, you genuinely manipulate it by hand rather than using a library container.',
      },
      {
        kind: 'code',
        caption: 'The node — write this from memory',
        code: `struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};`,
      },
      {
        kind: 'text',
        body: 'A linked list is a chain of heap-allocated nodes, each pointing to the next, with `nullptr` marking the end. There is no size field and no indexing — everything costs a traversal.',
      },
      {
        kind: 'table',
        headers: ['Operation', 'Linked list', '`vector`'],
        rows: [
          ['Access index i', 'O(n)', 'O(1)'],
          ['Insert at front', '**O(1)**', 'O(n)'],
          ['Insert after a known node', '**O(1)**', 'O(n)'],
          ['Insert at back', 'O(n) without a tail pointer', 'O(1)'],
          ['Memory per element', 'Value + a pointer', 'Just the value'],
        ],
      },
      { kind: 'heading', text: 'The core operations' },
      {
        kind: 'code',
        code: `// Traverse
ListNode* curr = head;
while (curr != nullptr) {
    cout << curr->val << " ";
    curr = curr->next;
}

// Insert at the front — O(1)
ListNode* node = new ListNode(val);
node->next = head;
head = node;

// Insert AFTER a node — O(1)
node->next = prev->next;      // link forward FIRST
prev->next = node;            // then relink backwards

// Delete the node after prev
ListNode* toDelete = prev->next;
prev->next = toDelete->next;
delete toDelete;`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Order matters when relinking',
        body: 'Writing `prev->next = node;` before `node->next = prev->next;` loses the rest of the list — you have already overwritten the pointer you needed to save. Always attach the new node forward first, then redirect the predecessor. The same rule applies when deleting: capture `next` before you `delete`.',
      },
      { kind: 'heading', text: 'The dummy head — the idiom that removes edge cases' },
      {
        kind: 'code',
        code: `ListNode dummy(0);              // on the stack, no delete needed
dummy.next = head;
ListNode* prev = &dummy;

while (prev->next != nullptr) {
    if (prev->next->val == target) {
        ListNode* toDelete = prev->next;
        prev->next = toDelete->next;
        delete toDelete;
    } else {
        prev = prev->next;
    }
}
return dummy.next;              // the head may have changed`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Use a dummy head whenever the head might change',
        body: 'Without it, deleting or inserting at the front needs its own branch, because there is no predecessor to relink. A dummy node gives every real node a predecessor, so one loop handles all cases. Returning `dummy.next` rather than `head` picks up any change automatically. This single trick removes the majority of linked-list edge-case bugs.',
      },
      { kind: 'heading', text: 'The three operations worth memorising' },
      {
        kind: 'code',
        caption: '1. Reversal — iterative, O(1) space',
        code: `ListNode* reverse(ListNode* head) {
    ListNode* prev = nullptr;
    while (head != nullptr) {
        ListNode* next = head->next;   // save before overwriting
        head->next = prev;             // flip
        prev = head;                   // advance both
        head = next;
    }
    return prev;                       // the new head
}`,
      },
      {
        kind: 'code',
        caption: '2. Find the middle — fast and slow pointers',
        code: `ListNode* middle(ListNode* head) {
    ListNode *slow = head, *fast = head;
    while (fast != nullptr && fast->next != nullptr) {
        slow = slow->next;
        fast = fast->next->next;
    }
    return slow;                       // fast reached the end, slow the middle
}`,
      },
      {
        kind: 'code',
        caption: '3. Detect a cycle — Floyd\'s algorithm',
        code: `bool hasCycle(ListNode* head) {
    ListNode *slow = head, *fast = head;
    while (fast != nullptr && fast->next != nullptr) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) return true;      // they meet inside the loop
    }
    return false;
}`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'The guard must match how deep you dereference',
        body: '`fast != nullptr && fast->next != nullptr` checks two levels because the body does `fast->next->next`. Dropping either half crashes — the first on an even-length list, the second on an odd-length one. Every fast-pointer loop needs exactly this guard.',
      },
    ],
    keyTakeaways: [
      'Write `struct ListNode` from memory — you need it to test locally.',
      'Link the new node forward first, then redirect the predecessor.',
      'A dummy head removes every "what if it is the first node" branch.',
      'Fast/slow pointers need the `fast && fast->next` two-level guard.',
    ],
    practice: {
      prompt: 'Build a five-node list by hand, then implement reversal, find-the-middle and cycle detection. Then solve Remove Linked List Elements twice — once without a dummy head and once with — and compare how many special cases each needs.',
      leetcode: { title: 'Reverse Linked List', slug: 'reverse-linked-list' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-17.2',
    language: 'cpp',
    summary: 'Add backward links for O(1) deletion — the structure behind LRU Cache.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'A doubly linked list adds a `prev` pointer to each node. That one extra pointer buys something important: **O(1) removal of a node you already hold**, without walking from the head to find its predecessor. That is exactly what an LRU cache needs.',
      },
      {
        kind: 'code',
        code: `struct DListNode {
    int val;
    DListNode* prev;
    DListNode* next;
    DListNode(int x) : val(x), prev(nullptr), next(nullptr) {}
};`,
      },
      {
        kind: 'text',
        body: 'The extra `prev` pointer buys one crucial thing: **given a node, you can delete it in O(1)** without knowing its predecessor. In a singly linked list that requires a traversal from the head.',
      },
      {
        kind: 'code',
        caption: 'Deleting a node you already hold',
        code: `void remove(DListNode* node) {
    if (node->prev) node->prev->next = node->next;
    if (node->next) node->next->prev = node->prev;
    delete node;
}
// Four pointer updates, no traversal — O(1)`,
      },
      {
        kind: 'code',
        caption: 'Inserting after a node',
        code: `void insertAfter(DListNode* pos, DListNode* node) {
    node->next = pos->next;
    node->prev = pos;
    if (pos->next) pos->next->prev = node;
    pos->next = node;
}`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Four links, and every one must be updated',
        body: 'Each insertion or deletion touches four pointers, and missing one corrupts the list in a way that only shows up when you later traverse in the *other* direction. Draw the before-and-after on paper the first few times — this is the most error-prone hand-built structure in the chapter.',
      },
      { kind: 'heading', text: 'Sentinel nodes remove the null checks' },
      {
        kind: 'code',
        code: `DListNode* head = new DListNode(0);      // sentinel, never holds real data
DListNode* tail = new DListNode(0);
head->next = tail;
tail->prev = head;

// Now every real node has both a prev and a next — no null checks at all
void remove(DListNode* node) {
    node->prev->next = node->next;
    node->next->prev = node->prev;
}

void addToFront(DListNode* node) {
    node->next = head->next;
    node->prev = head;
    head->next->prev = node;
    head->next = node;
}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Two sentinels turn six branches into zero',
        body: 'With dummy head and tail nodes, the list is never truly empty and no real node is ever first or last. Every `if (node->prev)` disappears. This is the dummy-head idea from the previous lesson, applied at both ends — and it is exactly how a production LRU Cache is written.',
      },
      { kind: 'heading', text: 'Where you actually build one' },
      {
        kind: 'code',
        caption: 'LRU Cache — the archetype',
        code: `class LRUCache {
    struct Node {
        int key, value;
        Node *prev, *next;
        Node(int k, int v) : key(k), value(v), prev(nullptr), next(nullptr) {}
    };

    int capacity;
    Node *head, *tail;                    // sentinels
    unordered_map<int, Node*> pos;        // key → its node

    void remove(Node* n) {
        n->prev->next = n->next;
        n->next->prev = n->prev;
    }
    void addFront(Node* n) {
        n->next = head->next;  n->prev = head;
        head->next->prev = n;  head->next = n;
    }

public:
    LRUCache(int capacity) : capacity(capacity) {
        head = new Node(0, 0);
        tail = new Node(0, 0);
        head->next = tail;  tail->prev = head;
    }

    int get(int key) {
        if (!pos.count(key)) return -1;
        Node* n = pos[key];
        remove(n); addFront(n);           // mark as most recently used
        return n->value;
    }

    void put(int key, int value) {
        if (pos.count(key)) { remove(pos[key]); delete pos[key]; pos.erase(key); }
        else if (pos.size() == capacity) {
            Node* lru = tail->prev;       // least recently used
            remove(lru); pos.erase(lru->key); delete lru;
        }
        Node* n = new Node(key, value);
        addFront(n);
        pos[key] = n;
    }
};`,
      },
      {
        kind: 'text',
        body: 'The hash map gives O(1) lookup of a node; the doubly linked list gives O(1) removal and reinsertion. Neither alone can do both, which is why this exact pairing is the standard answer. The `std::list` version from Chapter 11 is shorter — this one is what an interviewer usually wants to see.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'std::list is a doubly linked list',
        body: 'You rarely need to build one by hand outside of design problems, because `list` already provides it with `splice` for O(1) reordering. Build it manually when the problem is *about* the structure — LRU Cache, Flatten a Multilevel List, Design Browser History.',
      },
    ],
    keyTakeaways: [
      'The `prev` pointer allows O(1) deletion of a node you already hold.',
      'Every insert or delete updates four pointers — miss one and the list corrupts.',
      'Sentinel head and tail nodes eliminate all null checks.',
      'Hash map plus doubly linked list is the standard O(1) LRU Cache.',
    ],
    practice: {
      prompt: 'Build a doubly linked list with sentinels and implement `remove` and `addFront` without any null checks. Then write LRU Cache with raw nodes rather than `std::list` — it is a very common interview question and the sentinel trick is what keeps it short.',
      leetcode: { title: 'LRU Cache', slug: 'lru-cache' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-17.3',
    language: 'cpp',
    summary: 'Implement LIFO on top of a vector, and know what the adaptor is doing.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A stack needs only push, pop and top at one end — which is exactly what `vector` already gives in O(1). Implementing one is mostly a matter of restricting the interface.',
      },
      {
        kind: 'code',
        caption: 'Backed by a vector',
        code: `class Stack {
    vector<int> data;

public:
    void push(int x) { data.push_back(x); }
    void pop()       { if (!data.empty()) data.pop_back(); }
    int  top() const { return data.back(); }
    bool empty() const { return data.empty(); }
    int  size()  const { return data.size(); }
};`,
      },
      {
        kind: 'text',
        body: 'That is essentially `std::stack`, which wraps a `deque` by default. All operations are O(1) — `push_back` amortised, the rest exact.',
      },
      {
        kind: 'code',
        caption: 'Backed by a fixed array',
        code: `class Stack {
    int data[1000];
    int topIndex = -1;              // -1 means empty

public:
    void push(int x) { if (topIndex < 999) data[++topIndex] = x; }
    void pop()       { if (topIndex >= 0) topIndex--; }
    int  top() const { return data[topIndex]; }
    bool empty() const { return topIndex == -1; }
};`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'top() on an empty stack is undefined',
        body: 'Both versions above read garbage when empty — `data.back()` on an empty vector and `data[-1]` on an array are equally undefined. Real implementations leave this unchecked for speed, which is why *you* must guard with `empty()` before every `top()`. It is the same contract `std::stack` has.',
      },
      { kind: 'heading', text: 'The design problem: Min Stack' },
      {
        kind: 'code',
        caption: 'O(1) minimum with a parallel stack',
        code: `class MinStack {
    vector<int> data;
    vector<int> mins;              // running minimum at each depth

public:
    void push(int val) {
        data.push_back(val);
        mins.push_back(mins.empty() ? val : min(val, mins.back()));
    }
    void pop() { data.pop_back(); mins.pop_back(); }
    int top()    const { return data.back(); }
    int getMin() const { return mins.back(); }      // O(1)
};`,
      },
      {
        kind: 'text',
        body: 'Each entry in `mins` records the minimum of everything at or below that depth, so popping restores the previous minimum automatically. The naive alternative — scanning for the minimum on each query — is O(n).',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The parallel-stack trick generalises',
        body: 'Any property that can be computed from "the new element plus the previous answer" can be tracked this way — minimum, maximum, running sum, or a count. It costs O(n) extra space and turns an O(n) query into O(1).',
      },
      { kind: 'heading', text: 'Stack from two queues, and vice versa' },
      {
        kind: 'code',
        caption: 'A queue built from two stacks',
        code: `class Queue {
    stack<int> in, out;

    void shift() {
        if (out.empty())
            while (!in.empty()) { out.push(in.top()); in.pop(); }
    }

public:
    void push(int x) { in.push(x); }
    int  pop()  { shift(); int v = out.top(); out.pop(); return v; }
    int  peek() { shift(); return out.top(); }
    bool empty() { return in.empty() && out.empty(); }
};`,
      },
      {
        kind: 'text',
        body: 'Moving elements from `in` to `out` reverses their order, turning LIFO into FIFO. Each element is transferred at most once, so `pop` is **amortised O(1)** even though a single call can be O(n). Being able to explain that amortised argument is the actual point of the problem.',
      },
    ],
    keyTakeaways: [
      'A stack is a `vector` with a restricted interface — all operations O(1).',
      '`top()` on an empty stack is undefined; guard with `empty()`.',
      'A parallel stack of running minimums gives O(1) `getMin`.',
      'Two stacks make a queue with amortised O(1) operations.',
    ],
    practice: {
      prompt: 'Implement Min Stack with the parallel-stack approach. Then build a queue from two stacks and explain why `pop` is amortised O(1) rather than O(n) — that explanation is what the interview question is really testing.',
      leetcode: { title: 'Min Stack', slug: 'min-stack' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-17.4',
    language: 'cpp',
    summary: 'Implement FIFO without the O(n) shifting the naive version causes.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'A queue from a raw array is trickier than a stack, because removing from the front would shift everything behind it. The fix is a **circular buffer**: keep head and tail indices that wrap around, so nothing ever moves.',
      },
      {
        kind: 'code',
        caption: 'The naive version — and why it is wrong',
        code: `class Queue {
    vector<int> data;
public:
    void push(int x) { data.push_back(x); }
    void pop()       { data.erase(data.begin()); }    // O(n) — shifts everything
    int  front() const { return data.front(); }
};`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'erase(begin()) makes every pop O(n)',
        body: 'Removing the first element shifts all the others left. A loop of n pops is therefore O(n²) — the classic hidden quadratic factor from Chapter 10. This is exactly why `std::queue` wraps a `deque` rather than a `vector`.',
      },
      {
        kind: 'code',
        caption: 'Fix 1 — a head index instead of erasing',
        code: `class Queue {
    vector<int> data;
    int head = 0;

public:
    void push(int x) { data.push_back(x); }
    void pop()       { head++; }                    // O(1) — nothing moves
    int  front() const { return data[head]; }
    bool empty() const { return head == data.size(); }
};`,
      },
      {
        kind: 'text',
        body: 'O(1) for everything, at the cost of never reclaiming the space before `head`. Fine when the total number of pushes is bounded — which on LeetCode it always is.',
      },
      { kind: 'heading', text: 'The circular buffer' },
      {
        kind: 'code',
        caption: 'Fixed memory, O(1) operations',
        code: `class CircularQueue {
    vector<int> data;
    int head = 0, count = 0, capacity;

public:
    CircularQueue(int k) : data(k), capacity(k) {}

    bool push(int x) {
        if (count == capacity) return false;
        data[(head + count) % capacity] = x;      // wrap with modulo
        count++;
        return true;
    }
    bool pop() {
        if (count == 0) return false;
        head = (head + 1) % capacity;             // advance, wrapping
        count--;
        return true;
    }
    int front() const { return count ? data[head] : -1; }
    int back()  const { return count ? data[(head + count - 1) % capacity] : -1; }
    bool isEmpty() const { return count == 0; }
    bool isFull()  const { return count == capacity; }
};`,
      },
      {
        kind: 'text',
        body: 'The array is treated as a ring: indices wrap with `%`, so freed space at the front is reused. This is how real bounded queues — network buffers, task schedulers — are built, and it is the intended solution to Design Circular Queue.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Store a count, not just head and tail',
        body: 'With only head and tail indices, "full" and "empty" both look like `head == tail` and cannot be distinguished. The usual workarounds are wasting one slot or keeping a separate flag. Storing `count` is simpler than either and makes both checks trivial — the modulo does the rest.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Guard the modulo against a zero capacity',
        body: '`% capacity` with `capacity == 0` is division by zero — a crash. A `Design Circular Queue` test with k = 0 is unusual but the general habit matters: any modulo by a runtime value needs the divisor checked.',
      },
      { kind: 'heading', text: 'And the reverse construction' },
      {
        kind: 'code',
        caption: 'A stack built from one queue',
        code: `class Stack {
    queue<int> q;
public:
    void push(int x) {
        q.push(x);
        for (int i = 0; i < q.size() - 1; i++) {   // rotate the new element
            q.push(q.front());                     // to the front
            q.pop();
        }
    }
    int pop() { int v = q.front(); q.pop(); return v; }
    int top() { return q.front(); }
};`,
      },
      {
        kind: 'text',
        body: 'Push is O(n) because the queue is rotated; pop and top are O(1). The two-stack queue from the previous lesson had the opposite trade — cheap push, amortised pop. Which construction is better depends entirely on which operation dominates.',
      },
    ],
    keyTakeaways: [
      '`erase(begin())` makes pop O(n) — use a head index or a deque instead.',
      'A circular buffer reuses freed space with `% capacity` wrapping.',
      'Store an element `count` so full and empty are distinguishable.',
      'One queue can simulate a stack with O(n) push and O(1) pop.',
    ],
    practice: {
      prompt: 'Implement Design Circular Queue with a fixed vector and modulo wrapping. Then implement a stack from one queue. Then time the naive `erase(begin())` queue against the head-index version on 10⁵ pops — the quadratic cost is unmistakable.',
      leetcode: { title: 'Design Circular Queue', slug: 'design-circular-queue' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-17.5',
    language: 'cpp',
    summary: 'Define tree nodes, build test trees by hand, and know the traversals.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'A binary tree is a node with up to two children, each of which is itself a binary tree. That recursive definition is why almost every tree algorithm is three lines of recursion — you handle the current node and trust the two subtrees.',
      },
      {
        kind: 'code',
        caption: 'The node — write this from memory too',
        code: `struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* l, TreeNode* r) : val(x), left(l), right(r) {}
};`,
      },
      {
        kind: 'code',
        caption: 'Building a test tree locally',
        code: `//       1
//      / \\
//     2   3
//    /
//   4

TreeNode* root = new TreeNode(1);
root->left = new TreeNode(2);
root->right = new TreeNode(3);
root->left->left = new TreeNode(4);

// Or with the three-argument constructor:
TreeNode* root = new TreeNode(1,
                    new TreeNode(2, new TreeNode(4), nullptr),
                    new TreeNode(3));`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Being able to build a tree by hand is what lets you test locally',
        body: 'LeetCode constructs trees for you from an array, so it is easy to reach Phase 1 without ever having built one. But debugging a tree solution locally requires it — and so does every interview where you sketch a small example. It takes two minutes to memorise.',
      },
      { kind: 'heading', text: 'The four traversals' },
      {
        kind: 'code',
        code: `// PRE-ORDER: node, left, right → 1 2 4 3
void preorder(TreeNode* n) {
    if (!n) return;
    visit(n);
    preorder(n->left);
    preorder(n->right);
}

// IN-ORDER: left, node, right → 4 2 1 3   (sorted, on a BST)
void inorder(TreeNode* n) {
    if (!n) return;
    inorder(n->left);
    visit(n);
    inorder(n->right);
}

// POST-ORDER: left, right, node → 4 2 3 1
void postorder(TreeNode* n) {
    if (!n) return;
    postorder(n->left);
    postorder(n->right);
    visit(n);
}

// LEVEL-ORDER: breadth-first → 1 2 3 4  (uses a queue, not recursion)`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Choose the traversal from what you need',
        body: '**Pre-order** when the parent must be handled before its children — copying a tree, serialising, building paths. **In-order** for BSTs, where it yields sorted order. **Post-order** when you need the children\'s results first — depth, size, "is this subtree balanced". **Level-order** for anything organised by depth.',
      },
      { kind: 'heading', text: 'Binary search tree operations' },
      {
        kind: 'code',
        code: `bool search(TreeNode* root, int target) {
    while (root) {
        if (root->val == target) return true;
        root = (target < root->val) ? root->left : root->right;
    }
    return false;
}

TreeNode* insert(TreeNode* root, int val) {
    if (!root) return new TreeNode(val);
    if (val < root->val) root->left  = insert(root->left, val);
    else                 root->right = insert(root->right, val);
    return root;
}`,
      },
      {
        kind: 'text',
        body: 'Both are **O(h)** where h is the height — O(log n) if balanced, O(n) if the tree has degenerated into a line. That distinction is exactly what red-black trees exist to prevent, and it is why `set` guarantees O(log n) while a hand-built BST does not.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Quote tree complexity as O(h), and say what h can be',
        body: 'Interviewers listen for this. "O(h), which is O(log n) for a balanced tree and O(n) in the worst case" is the complete answer. The degenerate case is also what overflows the recursion stack on the judge, so it is not merely theoretical.',
      },
      {
        kind: 'code',
        caption: 'Validating a BST — the trap',
        code: `// WRONG — only checks parent against child, not the whole subtree
bool isValid(TreeNode* n) {
    if (!n) return true;
    if (n->left  && n->left->val  >= n->val) return false;
    if (n->right && n->right->val <= n->val) return false;
    return isValid(n->left) && isValid(n->right);
}

// CORRECT — carry down the permitted range
bool isValid(TreeNode* n, long lo = LONG_MIN, long hi = LONG_MAX) {
    if (!n) return true;
    if (n->val <= lo || n->val >= hi) return false;
    return isValid(n->left, lo, n->val) && isValid(n->right, n->val, hi);
}`,
      },
      {
        kind: 'text',
        body: 'The naive version passes a tree like `[5, 1, 6, null, null, 3, 7]` — 3 is less than 5 but sits in the right subtree. Every node must satisfy a *range* inherited from all its ancestors, not just a comparison with its parent. Note `long` bounds, so nodes holding `INT_MIN` or `INT_MAX` still work.',
      },
    ],
    keyTakeaways: [
      'Write `struct TreeNode` from memory so you can build test trees locally.',
      'Pre/in/post-order differ only in where the visit sits among the two calls.',
      'BST operations are O(h) — O(log n) balanced, O(n) degenerate.',
      'Validating a BST needs an inherited range, not a parent-child comparison.',
    ],
    practice: {
      prompt: 'Build the four-node tree above by hand and run all three recursive traversals, checking the outputs match. Then write Validate BST the naive way and find the input that fools it, then fix it with range bounds.',
      leetcode: { title: 'Validate Binary Search Tree', slug: 'validate-binary-search-tree' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-17.6',
    language: 'cpp',
    summary: 'Represent a graph the way every graph problem expects.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Graph problems almost never hand you a graph — they hand you an **edge list**, and building the representation is your first step. That build is boilerplate you should be able to type without thinking.',
      },
      {
        kind: 'code',
        caption: 'The adjacency list',
        code: `// adj[u] holds every neighbour of u
vector<vector<int>> adj(n);

// Undirected edge
adj[u].push_back(v);
adj[v].push_back(u);

// Directed edge — only one direction
adj[u].push_back(v);

// Iterate a node's neighbours
for (int next : adj[node]) { ... }`,
      },
      {
        kind: 'table',
        headers: ['', 'Adjacency list', 'Adjacency matrix'],
        rows: [
          ['Space', '**O(V + E)**', 'O(V²)'],
          ['Iterate neighbours of u', '**O(degree(u))**', 'O(V)'],
          ['Is there an edge u→v?', 'O(degree(u))', '**O(1)**'],
          ['Best for', 'Sparse graphs — almost all problems', 'Dense graphs, frequent edge queries'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Use an adjacency list unless the graph is dense',
        body: 'LeetCode graphs are almost always sparse — a few edges per node — so a matrix wastes O(V²) memory to store mostly zeros. With V = 10⁵ a matrix is 10¹⁰ entries and simply will not fit. The list is the default; reach for a matrix only when V is small and you query specific edges repeatedly.',
      },
      { kind: 'heading', text: 'Building from an edge list' },
      {
        kind: 'code',
        code: `// LeetCode usually gives edges as vector<vector<int>>
vector<vector<int>> buildGraph(int n, vector<vector<int>>& edges) {
    vector<vector<int>> adj(n);
    for (auto& e : edges) {
        adj[e[0]].push_back(e[1]);
        adj[e[1]].push_back(e[0]);      // omit this line if directed
    }
    return adj;
}`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Read the problem for directedness and for 0- or 1-indexing',
        body: 'Adding both directions on a directed graph, or only one on an undirected graph, produces wrong answers that look like algorithm bugs. And if nodes are labelled 1..n, either size the vector `n + 1` or subtract 1 from every label — mixing the two gives an out-of-range crash on the last node.',
      },
      {
        kind: 'code',
        caption: 'Weighted graphs',
        code: `vector<vector<pair<int,int>>> adj(n);      // (neighbour, weight)
adj[u].push_back({v, w});
adj[v].push_back({u, w});

for (auto& [next, weight] : adj[node]) { ... }`,
      },
      {
        kind: 'code',
        caption: 'When nodes are not integers',
        code: `unordered_map<string, vector<string>> adj;
adj["a"].push_back("b");                   // [] creates the vector for you

for (const string& next : adj[node]) { ... }`,
      },
      { kind: 'heading', text: 'Traversal, with the visited set' },
      {
        kind: 'code',
        code: `// DFS
void dfs(int node, vector<vector<int>>& adj, vector<bool>& visited) {
    visited[node] = true;
    for (int next : adj[node])
        if (!visited[next]) dfs(next, adj, visited);
}

// BFS
void bfs(int start, vector<vector<int>>& adj, vector<bool>& visited) {
    queue<int> q;
    q.push(start);
    visited[start] = true;                  // mark WHEN PUSHING

    while (!q.empty()) {
        int node = q.front(); q.pop();
        for (int next : adj[node])
            if (!visited[next]) {
                visited[next] = true;
                q.push(next);
            }
    }
}`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Graphs need a visited set; trees do not',
        body: 'A tree has no cycles, so recursion always terminates. A graph can loop back, and without `visited` the traversal recurses forever — a stack overflow, or Time Limit Exceeded. This is the single most common graph bug, and it is why every graph DFS carries a `visited` array while tree DFS does not.',
      },
      {
        kind: 'code',
        caption: 'Disconnected graphs need an outer loop',
        code: `int components = 0;
vector<bool> visited(n, false);

for (int i = 0; i < n; i++)
    if (!visited[i]) {
        dfs(i, adj, visited);
        components++;                       // each start is one component
    }`,
      },
      {
        kind: 'text',
        body: 'A single DFS only reaches nodes connected to its start. Counting connected components, or handling a forest, requires iterating every node and starting a fresh traversal from each unvisited one.',
      },
    ],
    keyTakeaways: [
      'An adjacency list is O(V + E) and the right default for sparse graphs.',
      'Add both directions for undirected edges, one for directed.',
      'Check whether nodes are 0- or 1-indexed before sizing the vector.',
      'Graph traversal needs `visited`; a missing one loops forever.',
    ],
    practice: {
      prompt: 'Build an adjacency list from an edge list and run both DFS and BFS. Then count connected components with the outer loop. Then remove the `visited` check on a graph containing a cycle and watch it hang — that is the failure mode to recognise instantly.',
      leetcode: { title: 'Number of Provinces', slug: 'number-of-provinces' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-17.7',
    language: 'cpp',
    summary: 'Build a heap on a flat array and understand why sift-up and sift-down are O(log n).',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'A binary heap is a complete binary tree stored in an array. Because the tree is complete, the parent-child relationships are pure arithmetic — no pointers at all.',
      },
      {
        kind: 'code',
        code: `parent(i)     = (i - 1) / 2
leftChild(i)  = 2*i + 1
rightChild(i) = 2*i + 2

//            9              index 0
//          /   \\
//         7     6           indices 1, 2
//        / \\
//       3   5               indices 3, 4
//
// array: [9, 7, 6, 3, 5]`,
      },
      {
        kind: 'code',
        caption: 'A max-heap from scratch',
        code: `class MaxHeap {
    vector<int> data;

    void siftUp(int i) {
        while (i > 0) {
            int parent = (i - 1) / 2;
            if (data[parent] >= data[i]) break;      // heap property restored
            swap(data[parent], data[i]);
            i = parent;
        }
    }

    void siftDown(int i) {
        int n = data.size();
        while (true) {
            int largest = i;
            int l = 2*i + 1, r = 2*i + 2;
            if (l < n && data[l] > data[largest]) largest = l;
            if (r < n && data[r] > data[largest]) largest = r;
            if (largest == i) break;                 // already correct
            swap(data[i], data[largest]);
            i = largest;
        }
    }

public:
    void push(int x) {
        data.push_back(x);            // append at the end
        siftUp(data.size() - 1);      // bubble it up to its place
    }

    int top() const { return data[0]; }

    void pop() {
        data[0] = data.back();        // move the last element to the root
        data.pop_back();
        if (!data.empty()) siftDown(0);
    }

    bool empty() const { return data.empty(); }
};`,
      },
      {
        kind: 'text',
        body: 'Both sift operations walk one path from a node to a leaf or to the root. A complete tree of n nodes has height ⌊log₂ n⌋, so both are **O(log n)**. `top()` reads index 0, which is O(1).',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Why pop moves the LAST element to the root',
        body: 'Removing the root leaves a hole. Filling it with the last element keeps the tree complete — no gaps — and then one sift-down restores the ordering. Taking a child instead would leave a gap in the middle and break the array packing that makes the index arithmetic work.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'siftDown must compare against both children',
        body: 'Swapping with the left child alone can move a smaller value above a larger right child, silently breaking the heap property. Find the largest of the three — node, left, right — and swap with that. Getting this wrong produces a structure that mostly works and occasionally returns the wrong maximum.',
      },
      { kind: 'heading', text: 'Building a heap in O(n)' },
      {
        kind: 'code',
        code: `void buildHeap(vector<int>& v) {
    // Start from the last non-leaf node and sift down
    for (int i = v.size() / 2 - 1; i >= 0; i--) siftDown(i);
}`,
      },
      {
        kind: 'text',
        body: 'Pushing n elements one at a time is O(n log n). Building bottom-up is **O(n)**, because most nodes are near the leaves and sift down only a short distance. That is what `make_heap` does, and why constructing a `priority_queue` from a range beats n separate pushes.',
      },
      {
        kind: 'code',
        caption: 'Heapsort falls straight out',
        code: `void heapSort(vector<int>& v) {
    buildHeap(v);                         // O(n)
    for (int end = v.size() - 1; end > 0; end--) {
        swap(v[0], v[end]);               // largest goes to its final place
        // sift down within v[0..end-1]
    }
}
// O(n log n), in place, no extra memory`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Use priority_queue in solutions',
        body: 'Hand-writing a heap in a contest wastes time and risks a subtle sift bug. Build one once to understand the mechanics and to answer the interview question — then use `priority_queue` everywhere, unless a problem explicitly asks you to implement it.',
      },
    ],
    keyTakeaways: [
      'A heap is an array; parent is `(i-1)/2`, children are `2i+1` and `2i+2`.',
      'siftUp and siftDown walk one root-to-leaf path — O(log n).',
      'Pop moves the last element to the root to keep the tree complete.',
      'Bottom-up building is O(n), not O(n log n).',
    ],
    practice: {
      prompt: 'Implement `MaxHeap` with `siftUp` and `siftDown`, push ten values and pop them all, confirming they come out descending. Then make `siftDown` compare only the left child and find an input where it returns the wrong maximum.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-17.8',
    language: 'cpp',
    summary: 'Decide when hand-building is required and when it is wasted effort.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'For almost every problem the answer is: **use the STL**. It is tested, fast, and far shorter. There are a few specific situations where building your own is right, and recognising them is what this lesson is for.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The default is always the STL',
        body: 'It is tested, optimised and shorter. Hand-writing a container in a timed setting costs minutes you do not have and introduces bugs the library does not have. Reach for a manual implementation only for the specific reasons below.',
      },
      { kind: 'heading', text: 'When you must build it yourself' },
      {
        kind: 'text',
        body: '**1. The problem is about the structure.** "Implement a Trie", "Design Circular Queue", "LRU Cache", "Min Stack" — building it *is* the question, and calling a library function would be answering a different one.',
      },
      {
        kind: 'text',
        body: '**2. The STL has no equivalent.** Trie, Union-Find, Segment Tree, Fenwick Tree. None of these exist in the standard library, and several are essential for Phase 1.',
      },
      {
        kind: 'text',
        body: '**3. LeetCode gives you raw nodes.** `ListNode*` and `TreeNode*` are handed to you directly, so linked-list and tree problems are always manual pointer work — there is no container involved at all.',
      },
      {
        kind: 'text',
        body: '**4. You need an operation no container provides.** O(1) `getMin` on a stack, or a heap supporting arbitrary deletion. Usually you combine two containers rather than build from nothing.',
      },
      {
        kind: 'table',
        headers: ['Structure', 'Use the STL?', 'Which'],
        rows: [
          ['Dynamic array', '**Yes**', '`vector`'],
          ['Stack / queue', '**Yes**', '`stack` / `queue`'],
          ['Heap', '**Yes**', '`priority_queue`'],
          ['Hash map / set', '**Yes**', '`unordered_map` / `unordered_set`'],
          ['Sorted map / set', '**Yes**', '`map` / `set`'],
          ['Doubly linked list', 'Usually', '`list` — build it for LRU design questions'],
          ['Linked list nodes', '**No**', 'LeetCode gives you `ListNode*`'],
          ['Binary tree', '**No**', 'LeetCode gives you `TreeNode*`'],
          ['Trie', '**No**', 'Build it — no STL equivalent'],
          ['Union-Find', '**No**', 'Build it — 20 lines'],
          ['Segment / Fenwick tree', '**No**', 'Build it'],
        ],
      },
      { kind: 'heading', text: 'The two you should be able to write from memory' },
      {
        kind: 'code',
        caption: 'Union-Find — about 20 lines, and it appears constantly',
        code: `class UnionFind {
    vector<int> parent, rank;

public:
    UnionFind(int n) : parent(n), rank(n, 0) {
        iota(parent.begin(), parent.end(), 0);      // each node is its own parent
    }

    int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);   // path compression
        return parent[x];
    }

    bool unite(int a, int b) {
        int ra = find(a), rb = find(b);
        if (ra == rb) return false;                 // already connected

        if (rank[ra] < rank[rb]) swap(ra, rb);      // union by rank
        parent[rb] = ra;
        if (rank[ra] == rank[rb]) rank[ra]++;
        return true;
    }
};`,
      },
      {
        kind: 'text',
        body: 'Path compression plus union by rank gives effectively O(1) per operation. It solves connected components, cycle detection in undirected graphs, Kruskal\'s MST, and Accounts Merge. Twenty lines that unlock a whole problem category.',
      },
      {
        kind: 'code',
        caption: 'Trie — prefix problems have no other good answer',
        code: `class Trie {
    struct Node {
        array<Node*, 26> children = {nullptr};
        bool isWord = false;
    };
    Node* root = new Node();

public:
    void insert(const string& word) {
        Node* n = root;
        for (char c : word) {
            int i = c - 'a';
            if (!n->children[i]) n->children[i] = new Node();
            n = n->children[i];
        }
        n->isWord = true;
    }

    bool search(const string& word) {
        Node* n = find(word);
        return n && n->isWord;
    }

    bool startsWith(const string& prefix) { return find(prefix) != nullptr; }

private:
    Node* find(const string& s) {
        Node* n = root;
        for (char c : s) {
            n = n->children[c - 'a'];
            if (!n) return nullptr;
        }
        return n;
    }
};`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Do not reimplement what the library already gives you',
        body: 'Writing your own sort, hash map or heap in a contest is time spent introducing bugs. The one exception is competitive programming at a level where a hand-written open-addressed hash map genuinely outperforms `unordered_map` — and that is well beyond what this plan is for.',
      },
      {
        kind: 'text',
        body: 'The honest summary for Phase 1: use the STL for everything it covers, be fluent with raw `ListNode*` and `TreeNode*` pointer work, and have Union-Find and Trie memorised. That combination covers essentially every problem in the 90-day plan.',
      },
    ],
    keyTakeaways: [
      'Default to the STL; build manually only for specific reasons.',
      'Linked lists and trees are always manual — LeetCode gives raw pointers.',
      'Trie, Union-Find and Segment Tree have no STL equivalent.',
      'Memorise Union-Find and Trie; they unlock whole problem categories.',
    ],
    practice: {
      prompt: 'Write Union-Find from memory and use it to count connected components, then implement Trie and solve Implement Trie. Both are short enough to memorise and appear often enough that recalling them instantly is a genuine advantage in Phase 1.',
      leetcode: { title: 'Implement Trie (Prefix Tree)', slug: 'implement-trie-prefix-tree' },
    },
  },
];
