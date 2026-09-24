import type { SharedLesson } from './types';

/**
 * Trees — Master tree terminology, binary tree representation, recursive and
 * iterative traversals, breadth-first search, depth and diameter calculations,
 * binary search tree invariants and operations, balancing mechanics, and N-ary trees.
 */
export const lessons: SharedLesson[] = [
  // =========================================================================
  // Lesson 1: Tree terminology
  // =========================================================================
  {
    sub: 1,
    summary: 'Identify tree components, calculate depths and heights, and trace hierarchical relationships.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Linear data structures such as arrays and linked lists arrange elements in sequential order, where every item has a single predecessor and successor. Hierarchical data, including file directory systems, Document Object Models (DOM), and organisational charts, cannot be represented cleanly in a line. A **tree** is a non-linear data structure consisting of nodes connected by directed edges that form a hierarchy without any closed cycles.',
      },
      { kind: 'heading', text: 'Core tree anatomy' },
      {
        kind: 'text',
        body: 'The topmost node in a tree is the **root**; it is the unique node that has no parent. Every other node has exactly one **parent** directly above it. Nodes connected directly below a parent are its **children**. Nodes sharing the identical parent are **siblings**. A node with no children is called a **leaf** or terminal node, while a node with at least one child is an **internal node**.',
      },
      {
        kind: 'code',
        caption: 'A basic general tree node storing children references',
        code: {
          cpp: `#include <iostream>
#include <vector>
#include <string>
using namespace std;

struct HierarchyNode {
    string name;
    vector<HierarchyNode*> children;
    HierarchyNode(string val) : name(val) {}
};

int main() {
    HierarchyNode root("Root");
    HierarchyNode childA("Child_A");
    HierarchyNode childB("Child_B");
    root.children.push_back(&childA);
    root.children.push_back(&childB);

    cout << root.name << " has " << root.children.size() << " children." << endl;
    return 0;
}`,
          java: `import java.util.ArrayList;
import java.util.List;

class HierarchyNode {
    String name;
    List<HierarchyNode> children;

    HierarchyNode(String name) {
        this.name = name;
        this.children = new ArrayList<>();
    }
}

public class Main {
    public static void main(String[] args) {
        HierarchyNode root = new HierarchyNode("Root");
        root.children.add(new HierarchyNode("Child_A"));
        root.children.add(new HierarchyNode("Child_B"));

        System.out.println(root.name + " has " + root.children.size() + " children.");
    }
}`,
          python: `class HierarchyNode:
    def __init__(self, name: str):
        self.name = name
        self.children: list['HierarchyNode'] = []

root = HierarchyNode("Root")
root.children.append(HierarchyNode("Child_A"))
root.children.append(HierarchyNode("Child_B"))

print(f"{root.name} has {len(root.children)} children.")`,
        },
        output: 'Root has 2 children.',
      },
      { kind: 'heading', text: 'Measuring depth, height, and levels' },
      {
        kind: 'text',
        body: 'Two distance measurements describe positions within a tree. The **depth** of a node is the number of edges on the path from the root down to that node; the root itself resides at depth 0. The **height** of a node is the number of edges on the longest downward path from that node to a leaf; any leaf has a height of 0. The height of the entire tree is defined as the height of its root.',
      },
      {
        kind: 'table',
        headers: ['Metric / Concept', 'Definition', 'Example on a 3-Node Balanced Tree'],
        rows: [
          ['Root', 'The origin node with no incoming edges', 'Depth = 0'],
          ['Edge Count', 'Total links connecting nodes: always N - 1 for N nodes', '3 nodes -> 2 edges'],
          ['Leaf Node', 'A node with degree 0 (no children)', 'Height = 0'],
          ['Subtree', 'A node together with all its descendants', 'Left and right subtrees of root'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Edge counts versus node counts in height definitions',
        body: 'Literature sometimes measures height and depth in nodes rather than edges. In standard competitive programming and LeetCode, height and depth measure the count of **edges**: a single isolated root has height 0, and an empty tree has height -1. Always inspect whether a problem statement defines an empty tree as height 0 or height -1.',
      },
    ],
    keyTakeaways: [
      'A tree of N nodes contains exactly N - 1 edges and contains no cycles.',
      'Depth is measured from the root downward; height is measured from a node down to its deepest leaf.',
      'Leaves have degree 0; every non-root node has exactly one parent.',
    ],
    practice: {
      prompt: 'Draw a tree with 6 nodes labelled 1 through 6 where 1 is the root, 1 has children 2 and 3, 2 has children 4 and 5, and 3 has child 6. Compute the depth of node 5, the height of node 1, the total edge count, and list all leaf nodes.',
    },
  },

  // =========================================================================
  // Lesson 2: Binary tree node and building from an array
  // =========================================================================
  {
    sub: 2,
    summary: 'Define binary tree node structures and build linked trees from level-order array representations.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'A **binary tree** is a specialised tree where each node has at most two children, referred to as the **left child** and the **right child**. Online judges and technical interview platforms present binary trees using level-order arrays containing `null` placeholders, such as `[1, 2, 3, null, 4]`. To test solutions locally, you must reconstruct these arrays into linked node objects in memory.',
      },
      { kind: 'heading', text: 'The TreeNode structure' },
      {
        kind: 'text',
        body: 'In code, each node stores a data value and two pointers or object references. In languages with explicit memory management like C++, pointers default to `nullptr`. In managed languages like Java and Python, unassigned references evaluate to `null` or `None`.',
      },
      { kind: 'heading', text: 'Rebuilding a tree with a FIFO queue' },
      {
        kind: 'text',
        body: 'To construct a tree from a level-order array, we use a queue to track parent nodes awaiting children. We instantiate the root node from the first array element and push it into the queue. For each subsequent pair of array elements, we pop the front node from the queue, attach non-null values as left and right children, and enqueue the newly created child nodes.',
      },
      {
        kind: 'code',
        caption: 'Building a binary tree from a level-order array representation',
        code: {
          cpp: `#include <iostream>
#include <vector>
#include <queue>
#include <optional>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

TreeNode* buildTree(const vector<optional<int>>& arr) {
    if (arr.empty() || !arr[0].has_value()) return nullptr;
    TreeNode* root = new TreeNode(arr[0].value());
    queue<TreeNode*> q;
    q.push(root);
    size_t i = 1;

    while (!q.empty() && i < arr.size()) {
        TreeNode* curr = q.front();
        q.pop();

        if (i < arr.size() && arr[i].has_value()) {
            curr->left = new TreeNode(arr[i].value());
            q.push(curr->left);
        }
        i++;

        if (i < arr.size() && arr[i].has_value()) {
            curr->right = new TreeNode(arr[i].value());
            q.push(curr->right);
        }
        i++;
    }
    return root;
}`,
          java: `import java.util.Queue;
import java.util.LinkedList;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int val) { this.val = val; }
}

public class Main {
    public static TreeNode buildTree(Integer[] arr) {
        if (arr == null || arr.length == 0 || arr[0] == null) return null;
        TreeNode root = new TreeNode(arr[0]);
        Queue<TreeNode> q = new LinkedList<>();
        q.offer(root);
        int i = 1;

        while (!q.isEmpty() && i < arr.length) {
            TreeNode curr = q.poll();

            if (i < arr.length && arr[i] != null) {
                curr.left = new TreeNode(arr[i]);
                q.offer(curr.left);
            }
            i++;

            if (i < arr.length && arr[i] != null) {
                curr.right = new TreeNode(arr[i]);
                q.offer(curr.right);
            }
            i++;
        }
        return root;
    }
}`,
          python: `from collections import deque

class TreeNode:
    def __init__(self, val: int = 0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def build_tree(arr: list[int | None]) -> TreeNode | None:
    if not arr or arr[0] is None:
        return None
    root = TreeNode(arr[0])
    q = deque([root])
    i = 1

    while q and i < len(arr):
        curr = q.popleft()
        if i < len(arr) and arr[i] is not None:
            curr.left = TreeNode(arr[i])
            q.append(curr.left)
        i += 1

        if i < len(arr) and arr[i] is not None:
            curr.right = TreeNode(arr[i])
            q.append(curr.right)
        i += 1

    return root`,
        },
      },
      { kind: 'heading', text: 'Representation trade-offs' },
      {
        kind: 'table',
        headers: ['Representation', 'Child Lookup Formula', 'Memory Overhead', 'Best Use Case'],
        rows: [
          ['Array (Complete Binary Tree)', 'Left: 2i + 1, Right: 2i + 2', 'Zero pointer overhead', 'Heaps and compact full trees'],
          ['Linked Nodes (General Tree)', 'Explicit left and right pointers', 'Two pointers per node', 'Dynamic trees with arbitrary insertions'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Null array elements must not enter the construction queue',
        body: 'A null element in the input array indicates the parent has no child at that position. If you enqueue a null marker as a valid node, subsequent iterations will attempt to attach children to a nonexistent parent, desynchronising the remaining tree levels.',
      },
    ],
    keyTakeaways: [
      'Each binary tree node holds a payload value and references to left and right child nodes.',
      'Level-order arrays map to tree hierarchies through FIFO queue-based breadth-first reconstruction.',
      'Null array entries indicate absent children and must not be queued to receive future child pointers.',
    ],
    practice: {
      prompt: 'Trace the array [1, null, 2, 3] by hand. Draw the resulting linked tree, and verify which node is the left or right child of each parent.',
    },
  },

  // =========================================================================
  // Lesson 3: Preorder, inorder and postorder: recursive
  // =========================================================================
  {
    sub: 3,
    summary: 'Traverse binary trees using recursive preorder, inorder, and postorder strategies.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Traversing a data structure means visiting every node exactly once. In linear arrays, there is only one natural traversal: left to right. In binary trees, each node possesses two subtrees, yielding three fundamental **depth-first traversals**. These three orders differ solely in when the current root node is processed relative to its left and right subtrees.',
      },
      { kind: 'heading', text: 'The three traversal orders' },
      {
        kind: 'text',
        body: 'Preorder processes the root first, then explores the left subtree, and finishes with the right subtree (Root, Left, Right). Inorder explores the left subtree first, processes the root, and then explores the right subtree (Left, Root, Right). Postorder explores both the left and right subtrees before processing the root (Left, Right, Root).',
      },
      { kind: 'heading', text: 'Implementation via recursion' },
      {
        kind: 'text',
        body: 'Recursion aligns with tree definitions because every child is itself the root of an independent subtree. The base case checks whether the current node pointer is null. If null, the function returns immediately; otherwise, it executes the traversal steps in the required order.',
      },
      {
        kind: 'code',
        caption: 'The three depth-first recursive traversals',
        code: {
          cpp: `#include <vector>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class TreeTraversals {
public:
    void inorder(TreeNode* root, vector<int>& out) {
        if (!root) return;
        inorder(root->left, out);
        out.push_back(root->val);
        inorder(root->right, out);
    }

    void preorder(TreeNode* root, vector<int>& out) {
        if (!root) return;
        out.push_back(root->val);
        preorder(root->left, out);
        preorder(root->right, out);
    }

    void postorder(TreeNode* root, vector<int>& out) {
        if (!root) return;
        postorder(root->left, out);
        postorder(root->right, out);
        out.push_back(root->val);
    }
};`,
          java: `import java.util.List;
import java.util.ArrayList;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int val) { this.val = val; }
}

public class TreeTraversals {
    public void inorder(TreeNode root, List<Integer> out) {
        if (root == null) return;
        inorder(root.left, out);
        out.add(root.val);
        inorder(root.right, out);
    }

    public void preorder(TreeNode root, List<Integer> out) {
        if (root == null) return;
        out.add(root.val);
        preorder(root.left, out);
        preorder(root.right, out);
    }

    public void postorder(TreeNode root, List<Integer> out) {
        if (root == null) return;
        postorder(root.left, out);
        postorder(root.right, out);
        out.add(root.val);
    }
}`,
          python: `class TreeNode:
    def __init__(self, val: int = 0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def inorder(root: TreeNode | None, out: list[int]) -> None:
    if not root:
        return
    inorder(root.left, out)
    out.append(root.val)
    inorder(root.right, out)

def preorder(root: TreeNode | None, out: list[int]) -> None:
    if not root:
        return
    out.append(root.val)
    preorder(root.left, out)
    preorder(root.right, out)

def postorder(root: TreeNode | None, out: list[int]) -> None:
    if not root:
        return
    postorder(root.left, out)
    postorder(root.right, out)
    out.append(root.val)`,
        },
      },
      { kind: 'heading', text: 'Traversal characteristics' },
      {
        kind: 'table',
        headers: ['Traversal', 'Sequence Pattern', 'Primary Application', 'Time / Space Complexity'],
        rows: [
          ['Preorder', 'Root -> Left -> Right', 'Copying trees, prefix expressions, serialisation', 'O(n) time / O(h) space'],
          ['Inorder', 'Left -> Root -> Right', 'Sorted sequence in BSTs, infix expressions', 'O(n) time / O(h) space'],
          ['Postorder', 'Left -> Right -> Root', 'Bottom-up metrics (height, size), node deletion', 'O(n) time / O(h) space'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Postorder for bottom-up computation',
        body: 'Whenever a parent node requires information computed from both of its children (such as calculating the subtree size, subtree sum, or tree height), postorder traversal is the natural choice because child subtrees are evaluated before the parent.',
      },
    ],
    keyTakeaways: [
      'Depth-first traversals are categorised by the placement of the root visit relative to its subtrees.',
      'Inorder traversal of a binary search tree visits keys in sorted ascending order.',
      'Each recursive traversal runs in O(n) time and consumes O(h) space on the call stack.',
    ],
    practice: {
      prompt: 'Given the root of a binary tree, return the inorder traversal of its nodes values using recursion.',
      leetcode: { title: 'Binary Tree Inorder Traversal', slug: 'binary-tree-inorder-traversal' },
    },
  },

  // =========================================================================
  // Lesson 4: Iterative traversals with an explicit stack
  // =========================================================================
  {
    sub: 4,
    summary: 'Simulate recursion using an explicit stack to perform preorder and inorder traversals iteratively.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'While recursive traversals are succinct, deep or unbalanced trees can exhaust the operating system call stack. A skewed tree of 100,000 nodes will exceed the default recursion stack limit and trigger a stack overflow error. By allocating an explicit stack on the heap, we retain full control over memory and eliminate the risk of call stack exhaustion.',
      },
      { kind: 'heading', text: 'Simulating inorder traversal with a stack' },
      {
        kind: 'text',
        body: 'To replicate recursive inorder traversal without recursion, we initialise an explicit stack and a pointer `curr` at the root. We push `curr` and step left repeatedly until `curr` becomes null. At that point, the top node on the stack represents the leftmost unprocessed element. We pop it, record its value, and redirect `curr` to its right child to process the right subtree.',
      },
      { kind: 'heading', text: 'Simulating preorder traversal' },
      {
        kind: 'text',
        body: 'Preorder traversal is even more direct: push the root onto the stack. While the stack is non-empty, pop the current node, record its value, and push its children. Because stacks are Last-In, First-Out (LIFO), we must push the **right child before the left child** so that the left child is popped and processed next.',
      },
      {
        kind: 'code',
        caption: 'Iterative preorder and inorder traversals using an explicit stack',
        code: {
          cpp: `#include <vector>
#include <stack>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class IterativeTraversals {
public:
    vector<int> preorder(TreeNode* root) {
        vector<int> res;
        if (!root) return res;
        stack<TreeNode*> st;
        st.push(root);

        while (!st.empty()) {
            TreeNode* node = st.top();
            st.pop();
            res.push_back(node->val);
            if (node->right) st.push(node->right);
            if (node->left) st.push(node->left);
        }
        return res;
    }

    vector<int> inorder(TreeNode* root) {
        vector<int> res;
        stack<TreeNode*> st;
        TreeNode* curr = root;

        while (curr != nullptr || !st.empty()) {
            while (curr != nullptr) {
                st.push(curr);
                curr = curr->left;
            }
            curr = st.top();
            st.pop();
            res.push_back(curr->val);
            curr = curr->right;
        }
        return res;
    }
};`,
          java: `import java.util.List;
import java.util.ArrayList;
import java.util.Deque;
import java.util.ArrayDeque;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int val) { this.val = val; }
}

public class IterativeTraversals {
    public List<Integer> preorder(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        if (root == null) return res;
        Deque<TreeNode> st = new ArrayDeque<>();
        st.push(root);

        while (!st.isEmpty()) {
            TreeNode node = st.pop();
            res.add(node.val);
            if (node.right != null) st.push(node.right);
            if (node.left != null) st.push(node.left);
        }
        return res;
    }

    public List<Integer> inorder(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        Deque<TreeNode> st = new ArrayDeque<>();
        TreeNode curr = root;

        while (curr != null || !st.isEmpty()) {
            while (curr != null) {
                st.push(curr);
                curr = curr.left;
            }
            curr = st.pop();
            res.add(curr.val);
            curr = curr.right;
        }
        return res;
    }
}`,
          python: `class TreeNode:
    def __init__(self, val: int = 0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def preorder_traversal(root: TreeNode | None) -> list[int]:
    res = []
    if not root:
        return res
    st = [root]

    while st:
        node = st.pop()
        res.append(node.val)
        if node.right:
            st.append(node.right)
        if node.left:
            st.append(node.left)
    return res

def inorder_traversal(root: TreeNode | None) -> list[int]:
    res = []
    st: list[TreeNode] = []
    curr = root

    while curr or st:
        while curr:
            st.append(curr)
            curr = curr.left
        curr = st.pop()
        res.append(curr.val)
        curr = curr.right
    return res`,
        },
      },
      { kind: 'heading', text: 'Call stack vs explicit stack comparison' },
      {
        kind: 'table',
        headers: ['Mechanism', 'Memory Location', 'Risk on Skewed Trees (n = 10^5)', 'Auxiliary Space'],
        rows: [
          ['Recursive DFS', 'System Call Stack', 'High (Triggers Stack Overflow / Segmentation Fault)', 'O(h) stack frames'],
          ['Explicit Stack DFS', 'Heap memory', 'None (Standard heap handles large allocations safely)', 'O(h) node pointers'],
          ['Morris Traversal', 'Tree modification (Threaded)', 'None (Modifies and restores child pointers)', 'O(1) auxiliary space'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Pushing left before right in iterative preorder',
        body: 'Because a stack inverts retrieval order, pushing `left` before `right` will cause `right` to sit on top of the stack and be popped first. You must push `right` first, so that `left` remains on top and executes next.',
      },
    ],
    keyTakeaways: [
      'Explicit stacks move traversal memory from the restricted call stack to the heap.',
      'Iterative inorder buffers leftward descendants, pops to evaluate, and advances right.',
      'Iterative preorder pushes the right child before the left child to preserve left-to-right order.',
    ],
    practice: {
      prompt: 'Given the root of a binary tree, return the preorder traversal of its nodes values using an iterative approach with an explicit stack.',
      leetcode: { title: 'Binary Tree Preorder Traversal', slug: 'binary-tree-preorder-traversal' },
    },
  },

  // =========================================================================
  // Lesson 5: Level order with a queue
  // =========================================================================
  {
    sub: 5,
    summary: 'Implement breadth-first search to process binary trees layer by layer using a FIFO queue.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Unlike depth-first traversals that explore full paths downward before backtracking, **level-order traversal** visits nodes horizontally from left to right, depth by depth. This is a form of Breadth-First Search (BFS). In technical interviews, problems asking for level averages, right-side views, or shortest paths between tree nodes rely directly on level-order traversal.',
      },
      { kind: 'heading', text: 'Batching levels with queue size' },
      {
        kind: 'text',
        body: 'A First-In, First-Out (FIFO) queue guarantees that nodes encountered first are processed first. To group outputs into discrete levels, we inspect `queue.size()` before processing a level. This size count indicates exactly how many nodes belong to the active level. We dequeue that precise count of nodes, record their values, and enqueue their child nodes for the subsequent level.',
      },
      {
        kind: 'code',
        caption: 'Level-order traversal grouping node values level by level',
        code: {
          cpp: `#include <vector>
#include <queue>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class Solution {
public:
    vector<vector<int>> levelOrder(TreeNode* root) {
        vector<vector<int>> levels;
        if (!root) return levels;
        queue<TreeNode*> q;
        q.push(root);

        while (!q.empty()) {
            int levelSize = q.size();
            vector<int> currentLevel;
            currentLevel.reserve(levelSize);

            for (int i = 0; i < levelSize; i++) {
                TreeNode* node = q.front();
                q.pop();
                currentLevel.push_back(node->val);

                if (node->left) q.push(node->left);
                if (node->right) q.push(node->right);
            }
            levels.push_back(currentLevel);
        }
        return levels;
    }
};`,
          java: `import java.util.List;
import java.util.ArrayList;
import java.util.Queue;
import java.util.ArrayDeque;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int val) { this.val = val; }
}

public class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> levels = new ArrayList<>();
        if (root == null) return levels;
        Queue<TreeNode> q = new ArrayDeque<>();
        q.offer(root);

        while (!q.isEmpty()) {
            int levelSize = q.size();
            List<Integer> currentLevel = new ArrayList<>(levelSize);

            for (int i = 0; i < levelSize; i++) {
                TreeNode node = q.poll();
                currentLevel.add(node.val);

                if (node.left != null) q.offer(node.left);
                if (node.right != null) q.offer(node.right);
            }
            levels.add(currentLevel);
        }
        return levels;
    }
}`,
          python: `from collections import deque

class TreeNode:
    def __init__(self, val: int = 0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def level_order(root: TreeNode | None) -> list[list[int]]:
    levels = []
    if not root:
        return levels
    q = deque([root])

    while q:
        level_size = len(q)
        current_level = []

        for _ in range(level_size):
            node = q.popleft()
            current_level.append(node.val)
            if node.left:
                q.append(node.left)
            if node.right:
                q.append(node.right)

        levels.append(current_level)
    return levels`,
        },
      },
      { kind: 'heading', text: 'Memory footprint across tree shapes' },
      {
        kind: 'table',
        headers: ['Tree Topology', 'Max BFS Queue Size', 'Max DFS Stack Depth', 'Preferred Traversal for Memory'],
        rows: [
          ['Completely Balanced Tree', 'O(n) — bottom level holds n / 2 nodes', 'O(log n) — height is logarithmic', 'DFS (O(log n) vs O(n))'],
          ['Completely Skewed Tree (Line)', 'O(1) — each level has 1 node', 'O(n) — height equals node count', 'BFS (O(1) vs O(n))'],
          ['Random / Bushy Tree', 'O(w) where w is max level width', 'O(h) where h is tree height', 'Depends on width vs height'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Re-evaluating queue size inside the loop',
        body: 'Writing `for (int i = 0; i < q.size(); i++)` directly causes bugs in languages where `q.size()` is recomputed on each iteration. As child nodes are enqueued, `q.size()` increases dynamically, leaking the next level into the current iteration. Always capture `int levelSize = q.size()` beforehand.',
      },
    ],
    keyTakeaways: [
      'Level order traversal visits tree nodes layer by layer using a FIFO queue.',
      'Freezing the queue size before inner iterations segments nodes into their respective depths.',
      'BFS queue memory is proportional to maximum level width, reaching up to n / 2 nodes on balanced trees.',
    ],
    practice: {
      prompt: 'Given the root of a binary tree, return the level order traversal of its nodes values (i.e., from left to right, level by level).',
      leetcode: { title: 'Binary Tree Level Order Traversal', slug: 'binary-tree-level-order-traversal' },
    },
  },

  // =========================================================================
  // Lesson 6: Height, depth and diameter
  // =========================================================================
  {
    sub: 6,
    summary: 'Calculate tree height, depths, and diameter in a single postorder traversal pass.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Structural properties of binary trees are evaluated by aggregating subtree dimensions from the bottom up. The **height** of a node is the length of the longest path down to any leaf. The **diameter** of a binary tree is the length of the longest path between any two nodes in the tree, measured by the number of edges connecting them.',
      },
      { kind: 'heading', text: 'Calculating diameter in O(n) time' },
      {
        kind: 'text',
        body: 'At any given node, the longest path that bends through this node as its highest point has length `height(left) + height(right)`. A naive algorithm computes heights repeatedly for every node in O(n²) time. A single-pass postorder traversal computes subtree heights bottom-up while simultaneously updating a running maximum diameter at each node in O(n) total time.',
      },
      {
        kind: 'code',
        caption: 'Single-pass height and diameter computation',
        code: {
          cpp: `#include <algorithm>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class Solution {
    int maxDiameter = 0;

    int computeHeight(TreeNode* node) {
        if (!node) return 0;
        int leftH = computeHeight(node->left);
        int rightH = computeHeight(node->right);

        maxDiameter = max(maxDiameter, leftH + rightH);
        return 1 + max(leftH, rightH);
    }

public:
    int diameterOfBinaryTree(TreeNode* root) {
        maxDiameter = 0;
        computeHeight(root);
        return maxDiameter;
    }
};`,
          java: `class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int val) { this.val = val; }
}

public class Solution {
    private int maxDiameter = 0;

    private int computeHeight(TreeNode node) {
        if (node == null) return 0;
        int leftH = computeHeight(node.left);
        int rightH = computeHeight(node.right);

        maxDiameter = Math.max(maxDiameter, leftH + rightH);
        return 1 + Math.max(leftH, rightH);
    }

    public int diameterOfBinaryTree(TreeNode root) {
        maxDiameter = 0;
        computeHeight(root);
        return maxDiameter;
    }
}`,
          python: `class TreeNode:
    def __init__(self, val: int = 0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def diameterOfBinaryTree(self, root: TreeNode | None) -> int:
        self.max_diameter = 0

        def compute_height(node: TreeNode | None) -> int:
            if not node:
                return 0
            left_h = compute_height(node.left)
            right_h = compute_height(node.right)

            self.max_diameter = max(self.max_diameter, left_h + right_h)
            return 1 + max(left_h, right_h)

        compute_height(root)
        return self.max_diameter`,
        },
      },
      { kind: 'heading', text: 'Metric comparisons' },
      {
        kind: 'table',
        headers: ['Metric', 'Measurement Basis', 'Recursive Formula', 'Complexity'],
        rows: [
          ['Node Depth', 'Distance from root down to node', 'depth(parent) + 1', 'O(depth) steps'],
          ['Node Height', 'Distance from node down to furthest leaf', '1 + max(leftH, rightH)', 'O(subtree size)'],
          ['Tree Diameter', 'Longest path between any two nodes', 'max across all nodes of (leftH + rightH)', 'O(n) single pass'],
        ],
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'The diameter path does not necessarily cross the root',
        body: 'A frequent misconception is assuming that the longest path always passes through the root node. If one subtree is deep and bifurcated while the other is shallow, the diameter can exist entirely within a child subtree without touching the root.',
      },
    ],
    keyTakeaways: [
      'Height is calculated bottom-up as 1 plus the maximum height of the two subtrees.',
      'The longest path curving through any node is the sum of its left and right child heights.',
      'Tracking a running maximum during postorder height computation finds diameter in O(n) time.',
    ],
    practice: {
      prompt: 'Given the root of a binary tree, return the length of the diameter of the tree.',
      leetcode: { title: 'Diameter of Binary Tree', slug: 'diameter-of-binary-tree' },
    },
  },

  // =========================================================================
  // Lesson 7: BST: search and insert
  // =========================================================================
  {
    sub: 7,
    summary: 'Leverage the binary search tree invariant to search and insert elements in O(log n) average time.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Searching an arbitrary binary tree requires inspecting all n nodes because values can reside anywhere. A **Binary Search Tree (BST)** enforces an ordering invariant: for any node, all keys in its left subtree are strictly smaller than its key, and all keys in its right subtree are strictly greater. This allows search algorithms to discard half of the remaining tree at each decision point.',
      },
      { kind: 'heading', text: 'The BST invariant' },
      {
        kind: 'text',
        body: 'For every node with value `k`: every node in its left subtree has value `< k`, and every node in its right subtree has value `> k`. Duplicate policies vary by application (some disallow duplicates, while others store counts or allow `<=` on the left). In standard LeetCode problems, values are unique unless stated otherwise.',
      },
      { kind: 'heading', text: 'Search and insert mechanics' },
      {
        kind: 'text',
        body: 'Searching compares the target key against the current node: if equal, the search succeeds; if smaller, search proceeds into the left child; if larger, it proceeds into the right child. Inserting follows the identical search path until encountering a null pointer, where the new node is linked as a new leaf.',
      },
      {
        kind: 'code',
        caption: 'Iterative search and insertion in a Binary Search Tree',
        code: {
          cpp: `struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class BSTOperations {
public:
    TreeNode* searchBST(TreeNode* root, int val) {
        while (root != nullptr && root->val != val) {
            if (val < root->val) root = root->left;
            else root = root->right;
        }
        return root;
    }

    TreeNode* insertIntoBST(TreeNode* root, int val) {
        if (!root) return new TreeNode(val);
        TreeNode* curr = root;

        while (true) {
            if (val < curr->val) {
                if (!curr->left) {
                    curr->left = new TreeNode(val);
                    break;
                }
                curr = curr->left;
            } else {
                if (!curr->right) {
                    curr->right = new TreeNode(val);
                    break;
                }
                curr = curr->right;
            }
        }
        return root;
    }
};`,
          java: `class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int val) { this.val = val; }
}

public class BSTOperations {
    public TreeNode searchBST(TreeNode root, int val) {
        while (root != null && root.val != val) {
            if (val < root.val) root = root.left;
            else root = root.right;
        }
        return root;
    }

    public TreeNode insertIntoBST(TreeNode root, int val) {
        if (root == null) return new TreeNode(val);
        TreeNode curr = root;

        while (true) {
            if (val < curr.val) {
                if (curr.left == null) {
                    curr.left = new TreeNode(val);
                    break;
                }
                curr = curr.left;
            } else {
                if (curr.right == null) {
                    curr.right = new TreeNode(val);
                    break;
                }
                curr = curr.right;
            }
        }
        return root;
    }
}`,
          python: `class TreeNode:
    def __init__(self, val: int = 0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def search_bst(root: TreeNode | None, val: int) -> TreeNode | None:
    curr = root
    while curr and curr.val != val:
        if val < curr.val:
            curr = curr.left
        else:
            curr = curr.right
    return curr

def insert_into_bst(root: TreeNode | None, val: int) -> TreeNode:
    if not root:
        return TreeNode(val)
    curr = root

    while True:
        if val < curr.val:
            if not curr.left:
                curr.left = TreeNode(val)
                break
            curr = curr.left
        else:
            if not curr.right:
                curr.right = TreeNode(val)
                break
            curr = curr.right
    return root`,
        },
      },
      { kind: 'heading', text: 'Operation complexity' },
      {
        kind: 'table',
        headers: ['Operation', 'Balanced BST (Average)', 'Skewed BST (Worst Case)', 'Space Complexity (Iterative)'],
        rows: [
          ['Search', 'O(log n)', 'O(n)', 'O(1)'],
          ['Insert', 'O(log n)', 'O(n)', 'O(1)'],
          ['Minimum Key', 'O(log n)', 'O(n)', 'O(1)'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Skewed trees degenerate to linked lists',
        body: 'Inserting elements in sorted sequence such as 1, 2, 3, 4, 5 into a standard BST attaches every item as a right child. The height becomes n, and search efficiency collapses from O(log n) to O(n).',
      },
    ],
    keyTakeaways: [
      'BST ordering requires all left descendants to be smaller and right descendants to be larger.',
      'Search and insertion eliminate half the remaining nodes at each step in balanced trees.',
      'Average time complexity is O(log n), but unbalanced trees degrade to O(n) linear chains.',
    ],
    practice: {
      prompt: 'Given the root node of a binary search tree and a value to insert into the tree, insert the value into the BST and return the root.',
      leetcode: { title: 'Insert into a Binary Search Tree', slug: 'insert-into-a-binary-search-tree' },
    },
  },

  // =========================================================================
  // Lesson 8: BST: delete
  // =========================================================================
  {
    sub: 8,
    summary: 'Delete a node from a BST while maintaining the ordering invariant across all child configurations.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Deleting a node from a binary search tree is more complex than insertion because removing a node can fracture descendant connections. To delete a key cleanly without violating the BST invariant, the deletion algorithm divides into three structural cases depending on whether the target node has zero, one, or two children.',
      },
      { kind: 'heading', text: 'The three deletion scenarios' },
      {
        kind: 'text',
        body: 'Case 1: The node is a **leaf** with no children. Sever the parent link directly by returning null. Case 2: The node has **one child**. Promote that child to replace the deleted node. Case 3: The node has **two children**. Locate the **inorder successor** (the minimum value node in its right subtree), copy its value into the target node, and recursively delete the successor from the right subtree.',
      },
      { kind: 'heading', text: 'Recursive delete implementation' },
      {
        kind: 'code',
        caption: 'Deleting a node from a BST across all three child cases',
        code: {
          cpp: `struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class Solution {
    TreeNode* findMin(TreeNode* node) {
        while (node->left != nullptr) node = node->left;
        return node;
    }

public:
    TreeNode* deleteNode(TreeNode* root, int key) {
        if (!root) return nullptr;

        if (key < root->val) {
            root->left = deleteNode(root->left, key);
        } else if (key > root->val) {
            root->right = deleteNode(root->right, key);
        } else {
            // Case 1 & 2: 0 or 1 child
            if (!root->left) {
                TreeNode* temp = root->right;
                delete root;
                return temp;
            } else if (!root->right) {
                TreeNode* temp = root->left;
                delete root;
                return temp;
            }
            // Case 3: 2 children
            TreeNode* successor = findMin(root->right);
            root->val = successor->val;
            root->right = deleteNode(root->right, successor->val);
        }
        return root;
    }
};`,
          java: `class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int val) { this.val = val; }
}

public class Solution {
    private TreeNode findMin(TreeNode node) {
        while (node.left != null) node = node.left;
        return node;
    }

    public TreeNode deleteNode(TreeNode root, int key) {
        if (root == null) return null;

        if (key < root.val) {
            root.left = deleteNode(root.left, key);
        } else if (key > root.val) {
            root.right = deleteNode(root.right, key);
        } else {
            // Case 1 & 2: 0 or 1 child
            if (root.left == null) return root.right;
            if (root.right == null) return root.left;

            // Case 3: 2 children
            TreeNode successor = findMin(root.right);
            root.val = successor.val;
            root.right = deleteNode(root.right, successor.val);
        }
        return root;
    }
}`,
          python: `class TreeNode:
    def __init__(self, val: int = 0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def find_min(node: TreeNode) -> TreeNode:
    while node.left:
        node = node.left
    return node

def delete_node(root: TreeNode | None, key: int) -> TreeNode | None:
    if not root:
        return None

    if key < root.val:
        root.left = delete_node(root.left, key)
    elif key > root.val:
        root.right = delete_node(root.right, key)
    else:
        # Case 1 & 2: 0 or 1 child
        if not root.left:
            return root.right
        if not root.right:
            return root.left

        # Case 3: 2 children
        successor = find_min(root.right)
        root.val = successor.val
        root.right = delete_node(root.right, successor.val)

    return root`,
        },
      },
      { kind: 'heading', text: 'Structural case breakdown' },
      {
        kind: 'table',
        headers: ['Configuration', 'Replacement Action', 'Time Complexity (Balanced)', 'Time Complexity (Skewed)'],
        rows: [
          ['Zero Children (Leaf)', 'Replace target with null pointer', 'O(log n)', 'O(n)'],
          ['One Child', 'Bypass node and point parent to child', 'O(log n)', 'O(n)'],
          ['Two Children', 'Overwrite value with successor and delete successor', 'O(log n)', 'O(n)'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Why the inorder successor is guaranteed to have at most one child',
        body: 'The inorder successor is located by moving right once, then following `left` pointers until reaching null. Because its left pointer is null, the successor never has two children. Its deletion will always resolve via Case 1 or Case 2 without further cascading.',
      },
    ],
    keyTakeaways: [
      'Leaf deletion severs the parent link directly.',
      'Single-child deletion promotes the child to take the target place.',
      'Two-child deletion replaces the node value with its inorder successor, then removes the successor.',
    ],
    practice: {
      prompt: 'Given a root node reference of a BST and a key, delete the node with the given key in the BST and return the new root.',
      leetcode: { title: 'Delete Node in a BST', slug: 'delete-node-in-a-bst' },
    },
  },

  // =========================================================================
  // Lesson 9: BST validation and the inorder property
  // =========================================================================
  {
    sub: 9,
    summary: 'Validate binary search trees using valid range boundaries and verify strictly ascending inorder traversals.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Verifying whether an arbitrary binary tree is a valid Binary Search Tree is a classic interview question. A common novice mistake is inspecting only immediate relationships: verifying `node.left.val < node.val < node.right.val`. This check is inadequate because it fails to detect violations where a deep descendant violates an ancestor constraint higher up in the tree.',
      },
      { kind: 'heading', text: 'Validating with propagated range intervals' },
      {
        kind: 'text',
        body: 'Every node in a BST must fall within an open interval `(lowerBound, upperBound)`. The root begins with bounds `(-infinity, +infinity)`. When traversing left, the upper bound tightens to `node.val` because all descendants must remain smaller. When traversing right, the lower bound increases to `node.val`. If any node violates its interval, the entire tree is invalid.',
      },
      { kind: 'heading', text: 'The inorder traversal property' },
      {
        kind: 'text',
        body: 'Because an inorder traversal visits nodes in the order Left -> Root -> Right, an inorder traversal of a valid BST always yields a **strictly ascending sequence**. If you maintain a reference to the previously visited node value and encounter any element that is less than or equal to the predecessor, the tree is not a valid BST.',
      },
      {
        kind: 'code',
        caption: 'Validating a BST using lower and upper bound intervals',
        code: {
          cpp: `#include <climits>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class Solution {
    bool validate(TreeNode* node, long long low, long long high) {
        if (!node) return true;
        if (node->val <= low || node->val >= high) return false;
        return validate(node->left, low, node->val) &&
               validate(node->right, node->val, high);
    }

public:
    bool isValidBST(TreeNode* root) {
        return validate(root, LLONG_MIN, LLONG_MAX);
    }
};`,
          java: `class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int val) { this.val = val; }
}

public class Solution {
    private boolean validate(TreeNode node, Long low, Long high) {
        if (node == null) return true;
        if (low != null && node.val <= low) return false;
        if (high != null && node.val >= high) return false;

        return validate(node.left, low, (long) node.val) &&
               validate(node.right, (long) node.val, high);
    }

    public boolean isValidBST(TreeNode root) {
        return validate(root, null, null);
    }
}`,
          python: `class TreeNode:
    def __init__(self, val: int = 0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def isValidBST(self, root: TreeNode | None) -> bool:
        def validate(node: TreeNode | None, low: float, high: float) -> bool:
            if not node:
                return True
            if not (low < node.val < high):
                return False
            return validate(node.left, low, node.val) and validate(node.right, node.val, high)

        return validate(root, float('-inf'), float('inf'))`,
        },
      },
      { kind: 'heading', text: 'Validation strategies' },
      {
        kind: 'table',
        headers: ['Method', 'Condition Checked', 'Time Complexity', 'Auxiliary Space'],
        rows: [
          ['Interval Range (low, high)', 'Each node lies strictly inside its inherited bound', 'O(n)', 'O(h) recursion stack'],
          ['Inorder Traversal Comparison', 'Every visited node is strictly greater than prev', 'O(n)', 'O(h) recursion stack'],
          ['Immediate Child Check (WRONG)', 'node.left < node < node.right', 'O(n)', 'O(h) — Fails on deep ancestor violations'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Integer overflow when setting boundary values',
        body: 'A tree node may hold `INT_MIN` or `INT_MAX`. If you initialise your lower and upper bounds using 32-bit signed integer limits (`int min = INT_MIN`), comparing `node.val <= min` will spuriously fail when a legitimate node has value `INT_MIN`. Use 64-bit integers (`long long` in C++, `Long` in Java, or `float("-inf")` in Python).',
      },
    ],
    keyTakeaways: [
      'Checking immediate child links is insufficient to prove a valid BST.',
      'Range propagation enforces global ancestor limits down the call stack in O(n) time.',
      'Inorder traversal of a valid BST must produce a strictly increasing sequence with zero duplicates.',
    ],
    practice: {
      prompt: 'Given the root of a binary tree, determine if it is a valid binary search tree (BST).',
      leetcode: { title: 'Validate Binary Search Tree', slug: 'validate-binary-search-tree' },
    },
  },

  // =========================================================================
  // Lesson 10: Lowest common ancestor
  // =========================================================================
  {
    sub: 10,
    summary: 'Identify the lowest common ancestor of two nodes in both general binary trees and binary search trees.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'The **Lowest Common Ancestor (LCA)** of two nodes `p` and `q` in a tree is defined as the deepest node that has both `p` and `q` as descendants, where a node is allowed to be a descendant of itself. LCA queries appear in directory structures (finding the closest shared folder) and genealogical networks.',
      },
      { kind: 'heading', text: 'LCA in general binary trees' },
      {
        kind: 'text',
        body: 'In an arbitrary binary tree lacking value invariants, we search recursively from the root: if the current node is null or matches either `p` or `q`, return it. We then search both left and right subtrees. If both return non-null, `p` and `q` lie in opposite subtrees, making the current node their LCA. If only one branch returns non-null, both target nodes lie within that branch.',
      },
      { kind: 'heading', text: 'LCA in Binary Search Trees' },
      {
        kind: 'text',
        body: 'In a Binary Search Tree, we leverage value ordering to locate the LCA without searching both branches: if both `p` and `q` have values smaller than the current node, the LCA must lie in the left subtree. If both values exceed the current node, the LCA must lie in the right subtree. The moment values split across the current node, the current node is the LCA.',
      },
      {
        kind: 'code',
        caption: 'Lowest common ancestor in BST and general binary trees',
        code: {
          cpp: `struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class LCASolutions {
public:
    TreeNode* lowestCommonAncestorBST(TreeNode* root, TreeNode* p, TreeNode* q) {
        TreeNode* curr = root;
        while (curr) {
            if (p->val < curr->val && q->val < curr->val) {
                curr = curr->left;
            } else if (p->val > curr->val && q->val > curr->val) {
                curr = curr->right;
            } else {
                return curr;
            }
        }
        return nullptr;
    }

    TreeNode* lowestCommonAncestorBT(TreeNode* root, TreeNode* p, TreeNode* q) {
        if (!root || root == p || root == q) return root;
        TreeNode* left = lowestCommonAncestorBT(root->left, p, q);
        TreeNode* right = lowestCommonAncestorBT(root->right, p, q);

        if (left && right) return root;
        return left ? left : right;
    }
};`,
          java: `class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int val) { this.val = val; }
}

public class LCASolutions {
    public TreeNode lowestCommonAncestorBST(TreeNode root, TreeNode p, TreeNode q) {
        TreeNode curr = root;
        while (curr != null) {
            if (p.val < curr.val && q.val < curr.val) {
                curr = curr.left;
            } else if (p.val > curr.val && q.val > curr.val) {
                curr = curr.right;
            } else {
                return curr;
            }
        }
        return null;
    }

    public TreeNode lowestCommonAncestorBT(TreeNode root, TreeNode p, TreeNode q) {
        if (root == null || root == p || root == q) return root;
        TreeNode left = lowestCommonAncestorBT(root.left, p, q);
        TreeNode right = lowestCommonAncestorBT(root.right, p, q);

        if (left != null && right != null) return root;
        return (left != null) ? left : right;
    }
}`,
          python: `class TreeNode:
    def __init__(self, val: int = 0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def lowest_common_ancestor_bst(root: TreeNode, p: TreeNode, q: TreeNode) -> TreeNode | None:
    curr: TreeNode | None = root
    while curr:
        if p.val < curr.val and q.val < curr.val:
            curr = curr.left
        elif p.val > curr.val and q.val > curr.val:
            curr = curr.right
        else:
            return curr
    return None

def lowest_common_ancestor_bt(root: TreeNode | None, p: TreeNode, q: TreeNode) -> TreeNode | None:
    if not root or root == p or root == q:
        return root
    left = lowest_common_ancestor_bt(root.left, p, q)
    right = lowest_common_ancestor_bt(root.right, p, q)

    if left and right:
        return root
    return left if left else right`,
        },
      },
      { kind: 'heading', text: 'Algorithm performance' },
      {
        kind: 'table',
        headers: ['Tree Type', 'Algorithm Structure', 'Time Complexity', 'Space Complexity'],
        rows: [
          ['Binary Search Tree (BST)', 'Directional search guiding path based on keys', 'O(h) -> O(log n) balanced', 'O(1) iterative'],
          ['General Binary Tree', 'Postorder search visiting subtrees until targets meet', 'O(n)', 'O(h) recursion stack'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Iterative BST LCA consumes zero auxiliary memory',
        body: 'Because BST search is strictly directional, the LCA in a BST requires no backtracking or recursion. A single `while` loop finds the answer in O(1) auxiliary memory.',
      },
    ],
    keyTakeaways: [
      'The LCA is the lowest node where search paths for p and q converge or split.',
      'In general binary trees, postorder recursion identifies where targets emerge from opposite subtrees.',
      'In BSTs, the LCA is the first node whose value falls between p.val and q.val.',
    ],
    practice: {
      prompt: 'Given a binary search tree, find the lowest common ancestor (LCA) node of two given nodes in the BST.',
      leetcode: { title: 'Lowest Common Ancestor of a Binary Search Tree', slug: 'lowest-common-ancestor-of-a-binary-search-tree' },
    },
  },

  // =========================================================================
  // Lesson 11: Why balance matters: AVL and red-black trees
  // =========================================================================
  {
    sub: 11,
    summary: 'Understand tree skew, balance invariants, and tree rotations in self-balancing binary search trees.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'The performance of BST operations depends on the height `h` of the tree. When keys arrive in random order, expected height is O(log n). However, when elements arrive in sorted order, an ordinary BST degenerates into a linear linked list of height n, degrading search and insert times from logarithmic to linear. **Self-balancing binary search trees** restructure nodes dynamically to guarantee `h = O(log n)`.',
      },
      { kind: 'heading', text: 'The balance factor and rotations' },
      {
        kind: 'text',
        body: 'An **AVL tree** tracks the **balance factor** of each node: `height(left) - height(right)`. A node is balanced if its balance factor lies in `{-1, 0, +1}`. When an insertion pushes the balance factor to +2 or -2, an O(1) pointer adjustment called a **tree rotation** restores the height balance without altering the BST inorder sequence.',
      },
      { kind: 'heading', text: 'Right rotation mechanics' },
      {
        kind: 'text',
        body: 'In a right rotation around node `y`, its left child `x` is promoted to become the new parent. Node `y` becomes the right child of `x`, and the right subtree of `x` (which holds keys between `x.val` and `y.val`) is transferred to become the new left child of `y`.',
      },
      {
        kind: 'code',
        caption: 'Right rotation restoring balance around an unbalanced node',
        code: {
          cpp: `struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

TreeNode* rightRotate(TreeNode* y) {
    TreeNode* x = y->left;
    TreeNode* T2 = x->right;

    // Perform rotation
    x->right = y;
    y->left = T2;

    // Return new subtree root
    return x;
}`,
          java: `class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int val) { this.val = val; }
}

public class TreeRotation {
    public static TreeNode rightRotate(TreeNode y) {
        TreeNode x = y.left;
        TreeNode T2 = x.right;

        // Perform rotation
        x.right = y;
        y.left = T2;

        // Return new subtree root
        return x;
    }
}`,
          python: `class TreeNode:
    def __init__(self, val: int = 0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def right_rotate(y: TreeNode) -> TreeNode:
    x = y.left
    assert x is not None
    t2 = x.right

    # Perform rotation
    x.right = y
    y.left = t2

    # Return new subtree root
    return x`,
        },
      },
      { kind: 'heading', text: 'AVL vs Red-Black tree trade-offs' },
      {
        kind: 'table',
        headers: ['Feature', 'AVL Tree', 'Red-Black Tree'],
        rows: [
          ['Balance Invariant', 'Strict: |leftH - rightH| <= 1', 'Relaxed: Color rules ensure max path <= 2 * min path'],
          ['Tree Height', 'Tighter: ~1.44 log2(n)', 'Looser: ~2.00 log2(n)'],
          ['Lookup Performance', 'Faster (shorter tree height)', 'Slightly slower (taller tree)'],
          ['Insertion / Deletion', 'More rotations required', 'Fewer rotations (preferred for C++ std::map and Java TreeMap)'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Why standard libraries choose Red-Black trees',
        body: 'Standard libraries such as C++ `std::map`, `std::set`, and Java `TreeMap` implement Red-Black trees rather than AVL trees. Because Red-Black trees require at most 2 rotations during insertion and 3 rotations during deletion, write operations execute faster while still maintaining O(log n) worst-case search guarantees.',
      },
    ],
    keyTakeaways: [
      'Degenerate BSTs have O(n) height, turning logarithmic operations into slow linear scans.',
      'Tree rotations modify child pointers in O(1) time without violating BST ordering.',
      'AVL trees maintain strict balance for lookup-heavy workloads; Red-Black trees favor frequent insertions and deletions.',
    ],
    practice: {
      prompt: 'Given the root of a binary search tree, return a balanced binary search tree with the same node values. Extract the sorted keys via inorder traversal, then recursively construct a height-balanced tree.',
      leetcode: { title: 'Balance a Binary Search Tree', slug: 'balance-a-binary-search-tree' },
    },
  },

  // =========================================================================
  // Lesson 12: N-ary trees
  // =========================================================================
  {
    sub: 12,
    summary: 'Model, construct, and traverse general trees where nodes maintain dynamic collections of children.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Many real-world data structures cannot be restricted to two children per node. File system folder structures, Document Object Models (DOM) in web browsers, and hierarchical categorisation systems allow a node to possess an arbitrary number of children. An **N-ary tree** (or general tree) represents these structures by storing children in a dynamic list.',
      },
      { kind: 'heading', text: 'The N-ary node structure' },
      {
        kind: 'text',
        body: 'An N-ary tree node replaces separate `left` and `right` child pointers with a dynamic collection of child pointers, typically represented as a vector or list named `children`. While preorder, postorder, and level-order traversals generalise naturally to N-ary trees, **inorder traversal is not defined** because there is no single middle child when a node has three or more children.',
      },
      { kind: 'heading', text: 'Traversing N-ary trees' },
      {
        kind: 'text',
        body: 'Level-order traversal in an N-ary tree mirrors the binary tree queue algorithm: record `queue.size()`, pop that number of nodes for the active level, and iterate across each child in `node.children` to enqueue them for the next level.',
      },
      {
        kind: 'code',
        caption: 'Level order traversal of an N-ary tree',
        code: {
          cpp: `#include <vector>
#include <queue>
using namespace std;

class Node {
public:
    int val;
    vector<Node*> children;

    Node() : val(0) {}
    Node(int _val) : val(_val) {}
    Node(int _val, vector<Node*> _children) : val(_val), children(_children) {}
};

class Solution {
public:
    vector<vector<int>> levelOrder(Node* root) {
        vector<vector<int>> result;
        if (!root) return result;
        queue<Node*> q;
        q.push(root);

        while (!q.empty()) {
            int size = q.size();
            vector<int> currentLevel;
            currentLevel.reserve(size);

            for (int i = 0; i < size; i++) {
                Node* curr = q.front();
                q.pop();
                currentLevel.push_back(curr->val);

                for (Node* child : curr->children) {
                    if (child) q.push(child);
                }
            }
            result.push_back(currentLevel);
        }
        return result;
    }
};`,
          java: `import java.util.List;
import java.util.ArrayList;
import java.util.Queue;
import java.util.LinkedList;

class Node {
    public int val;
    public List<Node> children;

    public Node() {}
    public Node(int val) { this.val = val; }
    public Node(int val, List<Node> children) {
        this.val = val;
        this.children = children;
    }
}

public class Solution {
    public List<List<Integer>> levelOrder(Node root) {
        List<List<Integer>> result = new ArrayList<>();
        if (root == null) return result;
        Queue<Node> q = new LinkedList<>();
        q.offer(root);

        while (!q.isEmpty()) {
            int size = q.size();
            List<Integer> currentLevel = new ArrayList<>(size);

            for (int i = 0; i < size; i++) {
                Node curr = q.poll();
                currentLevel.add(curr.val);

                if (curr.children != null) {
                    for (Node child : curr.children) {
                        if (child != null) q.offer(child);
                    }
                }
            }
            result.add(currentLevel);
        }
        return result;
    }
}`,
          python: `from collections import deque

class Node:
    def __init__(self, val: int = 0, children: list['Node'] | None = None):
        self.val = val
        self.children = children if children is not None else []

def level_order(root: Node | None) -> list[list[int]]:
    result = []
    if not root:
        return result
    q = deque([root])

    while q:
        size = len(q)
        current_level = []

        for _ in range(size):
            curr = q.popleft()
            current_level.append(curr.val)
            for child in curr.children:
                if child:
                    q.append(child)

        result.append(current_level)
    return result`,
        },
      },
      { kind: 'heading', text: 'Binary vs N-ary tree properties' },
      {
        kind: 'table',
        headers: ['Property', 'Binary Tree', 'N-ary Tree'],
        rows: [
          ['Child Pointers', 'Fixed two: left and right', 'Dynamic list: children'],
          ['Inorder Traversal', 'Well-defined (Left -> Root -> Right)', 'Not defined (no unique middle child)'],
          ['Leaf Condition', 'left == null and right == null', 'children is empty'],
          ['DFS Time Complexity', 'O(n) where n is node count', 'O(n) where n is node count'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Null child pointers vs empty children lists',
        body: 'In binary trees, missing children are represented by `null`. In N-ary trees, leaf nodes possess an initialised but empty collection of children (`children.empty()` or `len(children) == 0`). Checking for `node == null` vs iterating across `node.children` directly avoids null reference exceptions.',
      },
    ],
    keyTakeaways: [
      'N-ary trees represent multi-way hierarchies by storing child pointers in dynamic lists.',
      'Preorder, postorder, and BFS level-order traversals extend naturally to N-ary trees.',
      'Inorder traversal is not defined for N-ary trees because there is no unique median child.',
    ],
    practice: {
      prompt: 'Given an n-ary tree, return the level order traversal of its nodes values as a list of lists of integers.',
      leetcode: { title: 'N-ary Tree Level Order Traversal', slug: 'n-ary-tree-level-order-traversal' },
    },
  },
];
