import type { Lesson } from '../types';

/**
 * Python Chapter 6 — Recursion and Backtracking.
 * The highest-leverage chapter in the track. Trees, graphs, divide-and-conquer
 * and dynamic programming all rest on it.
 */
export const ch06: Lesson[] = [
  // -------------------------------------------------------------------------
  {
    topicId: 'python-6.1',
    language: 'python',
    summary: 'Build the mental model that makes recursive code readable instead of dizzying.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Recursion is a function calling itself on a **smaller version of the same problem**. The difficulty is never the syntax — it is trusting that the smaller call works without tracing it in your head.',
      },
      {
        kind: 'code',
        caption: 'The canonical example',
        code: `def factorial(n):
    if n <= 1:                    # base case: smallest input, answered directly
        return 1
    return n * factorial(n - 1)   # recursive case: a smaller problem`,
      },
      { kind: 'heading', text: 'The leap of faith' },
      {
        kind: 'text',
        body: 'When writing `factorial(n)`, do **not** trace what `factorial(n-1)` does. Assume it already returns the correct answer for `n-1`, and ask only: given that, how do I produce the answer for `n`? Here — multiply by `n`. That is the whole design step.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Three questions design any recursive function',
        body: '**1.** What is the smallest input I can answer immediately? (the base case) **2.** How do I make the input smaller? **3.** Given the correct answer for the smaller input, how do I build the answer for this one? Answer those three and the code writes itself — you never need to simulate the whole call tree.',
      },
      {
        kind: 'code',
        caption: 'The three questions applied to a tree',
        code: `def max_depth(root):
    # 1. Smallest input: an empty tree has depth 0.
    if not root:
        return 0
    # 2. Smaller inputs: the left and right subtrees.
    # 3. Given their depths, this tree is one deeper than the larger.
    return 1 + max(max_depth(root.left), max_depth(root.right))`,
      },
      {
        kind: 'text',
        body: 'Notice you never think about grandchildren. Each call handles exactly one node and delegates everything below it. That is why tree recursion in Python is usually three lines.',
      },
      { kind: 'heading', text: 'Why it fits trees and graphs' },
      {
        kind: 'text',
        body: 'A tree is defined recursively: a node with a left subtree and a right subtree, each itself a tree. When the data structure is recursive, the natural algorithm is too — which is why iterative tree traversal requires you to manage an explicit stack and simulate what recursion does for free.',
      },
      {
        kind: 'table',
        headers: ['Iteration', 'Recursion'],
        rows: [
          ['Explicit loop and counters', 'Implicit — the call stack tracks position'],
          ['Constant extra space', 'O(depth) stack space'],
          ['Natural for linear scans', 'Natural for trees, graphs, divide-and-conquer'],
          ['Faster — no call overhead', 'Slower, but usually far shorter'],
        ],
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Python function calls are expensive',
        body: 'Each call allocates a frame and Python\'s interpreter overhead is high, so recursion is noticeably slower here than in C++ or Java. Combined with the default 1000-frame limit, that makes iteration more attractive in Python than elsewhere. Use recursion where it genuinely clarifies — trees, backtracking — and a loop for linear scans.',
      },
      {
        kind: 'code',
        caption: 'The same computation, both ways',
        code: `# Iterative — faster, no stack cost
def factorial(n):
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result

# Recursive — clearer for branching problems, unnecessary here
def factorial(n):
    return 1 if n <= 1 else n * factorial(n - 1)`,
      },
      {
        kind: 'text',
        body: 'For factorial, iteration is genuinely better. Recursion earns its keep when the problem *branches* — trees and backtracking — because a loop cannot naturally follow two paths at once.',
      },
    ],
    keyTakeaways: [
      'Recursion solves a problem via a smaller instance of the same problem.',
      'Trust the recursive call — do not trace it.',
      'Design with three questions: base case, how to shrink, how to combine.',
      'Python calls are costly — prefer loops for linear scans.',
    ],
    practice: {
      prompt: 'Write `factorial` and `max_depth` recursively, stating each one\'s three design questions out loud. Then write `total(nums, i)` without tracing a single call — getting comfortable *not* simulating the call tree is the actual skill here.',
      leetcode: { title: 'Maximum Depth of Binary Tree', slug: 'maximum-depth-of-binary-tree' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-6.2',
    language: 'python',
    summary: 'Write the stopping condition correctly — the difference between a solution and a crash.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'The base case is the input small enough to answer without recursing. Without one — or with a wrong one — the recursion never stops and Python raises `RecursionError`.',
      },
      {
        kind: 'code',
        code: `def factorial(n):
    return n * factorial(n - 1)      # RecursionError: maximum recursion
                                     # depth exceeded`,
      },
      { kind: 'heading', text: 'The base cases you will write over and over' },
      {
        kind: 'code',
        code: `# Trees — the empty tree
if not root:
    return 0

# Linked lists — the end, and often the single node
if not head or not head.next:
    return head

# Lists — index reached the end
if i == len(nums):
    return 0

# Numbers — counted down
if n <= 1:
    return n

# Backtracking — the candidate is complete
if len(current) == target:
    result.append(current[:])
    return`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Write the base case first',
        body: 'Before the recursive line, before anything else. It forces you to decide what the smallest input is and what the function returns for it — which is usually where the whole design becomes clear. Adding it afterwards is how people end up with subtly wrong stopping conditions.',
      },
      { kind: 'heading', text: 'Use <= not ==' },
      {
        kind: 'code',
        code: `# FRAGILE — factorial(-1) recurses past the check forever
if n == 1:
    return 1

# ROBUST — anything at or below the boundary stops
if n <= 1:
    return 1`,
      },
      {
        kind: 'text',
        body: 'If a value can ever skip past your exact-equality check — through a negative input or a step of more than one — the recursion never terminates. An inequality catches every case at or beyond the boundary.',
      },
      { kind: 'heading', text: 'Some problems need more than one base case' },
      {
        kind: 'code',
        code: `def fib(n):
    if n == 0:
        return 0
    if n == 1:
        return 1              # BOTH are needed — fib(2) calls fib(1) and fib(0)
    return fib(n - 1) + fib(n - 2)`,
      },
      {
        kind: 'text',
        body: 'The rule: you need a base case for every input the recursive step can produce that cannot itself be recursed on. Since `fib` steps down by two, both `1` and `0` are reachable directly.',
      },
      {
        kind: 'code',
        caption: 'Linked list reversal needs both conditions',
        code: `def reverse(head):
    if not head or not head.next:      # empty AND single-node
        return head
    rest = reverse(head.next)
    head.next.next = head
    head.next = None
    return rest`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Check for None before accessing an attribute',
        body: '`if not head.next:` raises `AttributeError: NoneType object has no attribute next` on an empty list, because `head` itself is None. The None check must come first, and `or` short-circuits so the second test is only reached when `head` is valid.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: '"if not node" is idiomatic for tree and list nodes',
        body: 'Only `None` is falsy among node objects, so it is safe and reads well. But be careful applying the same style to *numbers*: `if not n:` is also true when `n` is 0, which is a bug if 0 is a valid value. For those, write `if n is None:` explicitly.',
      },
      {
        kind: 'text',
        body: 'A useful sanity check before running anything: pick the smallest possible input — empty tree, empty list, `n = 0` — and confirm your base case handles it without recursing. That single check catches most termination bugs.',
      },
    ],
    keyTakeaways: [
      'The base case is answered directly, with no recursion.',
      'Write it first — it usually clarifies the whole design.',
      'Prefer `<=` over `==` so values cannot skip past the boundary.',
      'Check for `None` before accessing an attribute: `not head or not head.next`.',
    ],
    practice: {
      prompt: 'Write `factorial` with `if n == 1` and call it with −1 to see the `RecursionError`, then fix it with `<=`. Then write recursive list reversal and test it on an empty list and a one-node list — those two inputs are what the compound base case exists for.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-6.3',
    language: 'python',
    summary: 'Shrink the problem and combine the results — the other half of every recursive function.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'The recursive case does two things: call itself on a **strictly smaller** input, and combine what comes back into this level\'s answer.',
      },
      {
        kind: 'code',
        code: `def total(nums, i=0):
    if i == len(nums):
        return 0
    return nums[i] + total(nums, i + 1)     # shrink (i+1), combine (+)`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'The input must get strictly smaller',
        body: 'If a recursive call can be made with the same input, the recursion never terminates. The subtle version is a graph traversal that revisits a node it has already seen — which is why graph DFS needs a `visited` set while tree DFS does not. A tree has no cycles; a graph does.',
      },
      { kind: 'heading', text: 'The three combining shapes' },
      {
        kind: 'code',
        caption: '1. One call — linear recursion',
        code: `def total(nums, i=0):
    if i == len(nums):
        return 0
    return nums[i] + total(nums, i + 1)
# depth n, one path — equivalent to a loop`,
      },
      {
        kind: 'code',
        caption: '2. Two calls — binary recursion',
        code: `def max_depth(root):
    if not root:
        return 0
    left = max_depth(root.left)
    right = max_depth(root.right)
    return 1 + max(left, right)          # combine both results`,
      },
      {
        kind: 'code',
        caption: '3. Many calls in a loop — branching recursion',
        code: `def dfs(node, adj, visited):
    visited.add(node)
    for nxt in adj[node]:
        if nxt not in visited:
            dfs(nxt, adj, visited)`,
      },
      { kind: 'heading', text: 'Where the work happens: before or after the call' },
      {
        kind: 'code',
        code: `# PRE-ORDER — act on this node, then recurse
def preorder(node):
    if not node:
        return
    visit(node)                  # work first
    preorder(node.left)
    preorder(node.right)

# POST-ORDER — recurse, then act using the children's results
def size(node):
    if not node:
        return 0
    l = size(node.left)
    r = size(node.right)
    return 1 + l + r             # work after — needs the children's answers

# IN-ORDER — left, act, right (sorted output on a BST)
def inorder(node):
    if not node:
        return
    inorder(node.left)
    visit(node)
    inorder(node.right)`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The ordering question answers itself',
        body: 'Ask: **do I need my children\'s answers to compute mine?** If yes, the work goes after the calls (post-order) — depth, size, sum, "is this balanced". If no, it can go before (pre-order) — printing, copying, path building. In-order is specifically for BSTs, where it yields sorted order.',
      },
      {
        kind: 'code',
        caption: 'Passing state down vs returning it up',
        code: `# Returning UP — each call computes its own answer
def sum_tree(node):
    if not node:
        return 0
    return node.val + sum_tree(node.left) + sum_tree(node.right)

# Passing DOWN — state accumulates as you descend
def collect(node, depth, result):
    if not node:
        return
    if depth == len(result):
        result.append(node.val)
    collect(node.left, depth + 1, result)
    collect(node.right, depth + 1, result)`,
      },
      {
        kind: 'text',
        body: 'Returning up is cleaner when each subtree has a self-contained answer. Passing down is needed when a node\'s handling depends on context from above — its depth, the path taken, or a running total. Many problems use both at once.',
      },
    ],
    keyTakeaways: [
      'The recursive call must be on a strictly smaller input.',
      'Graphs need a `visited` set because they have cycles; trees do not.',
      'Work before the calls is pre-order; work after is post-order.',
      'Post-order when you need your children\'s results; pre-order when you do not.',
    ],
    practice: {
      prompt: 'Write pre-order, in-order and post-order traversal of the same tree and compare the outputs. Then write `count_nodes` and notice the work must come *after* both calls. Placing the work correctly without thinking is most of what tree problems require.',
      leetcode: { title: 'Binary Tree Inorder Traversal', slug: 'binary-tree-inorder-traversal' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-6.4',
    language: 'python',
    summary: 'See what happens in memory during recursion, and why Python\'s limit is so low.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Every function call pushes a **stack frame** holding that call\'s parameters, local variables, and where to return to. Recursion pushes one frame per level, and they only unwind as calls return.',
      },
      {
        kind: 'code',
        caption: 'Tracing factorial(4)',
        code: `factorial(4)
  → 4 * factorial(3)
        → 3 * factorial(2)
              → 2 * factorial(1)
                    → returns 1          ← base case, unwinding starts
              ← 2 * 1 = 2
        ← 3 * 2 = 6
  ← 4 * 6 = 24`,
      },
      {
        kind: 'text',
        body: 'Four frames exist simultaneously at the deepest point. Nothing is computed on the way *down* — the multiplications all happen on the way back *up*, as each call receives its child\'s result.',
      },
      {
        kind: 'code',
        caption: 'Seeing it directly',
        code: `def trace(n, depth=0):
    print("  " * depth + f"enter {n}")
    if n > 0:
        trace(n - 1, depth + 1)
    print("  " * depth + f"exit  {n}")

trace(3)`,
        output: 'enter 3\n  enter 2\n    enter 1\n      enter 0\n      exit  0\n    exit  1\n  exit  2\nexit  3',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'This indented trace is the best recursion debugger there is',
        body: 'The symmetry of the output *is* the call stack: every "enter" has a matching "exit", and they nest. Adding four lines like this to a recursion you do not understand explains it faster than any amount of staring.',
      },
      { kind: 'heading', text: 'Each frame has its own locals' },
      {
        kind: 'code',
        code: `def f(n):
    local = n * 10          # a SEPARATE 'local' in every frame
    if n > 0:
        f(n - 1)
    print(local)            # this frame's own copy

f(3)                        # prints 0 10 20 30 — unwinding order`,
      },
      {
        kind: 'text',
        body: 'This is why recursion works at all: each level keeps its own state, untouched by deeper calls. It is also why slicing a list into a recursive call is so costly — every frame gets its own full copy.',
      },
      { kind: 'heading', text: 'Python\'s recursion limit' },
      {
        kind: 'code',
        code: `import sys
sys.getrecursionlimit()         # 1000 by default

def f(n):
    return 0 if n == 0 else f(n - 1)

f(1000)         # RecursionError: maximum recursion depth exceeded`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Python\'s limit is 1000 — far lower than C++ or Java',
        body: 'C++ manages roughly 10⁴–10⁵ frames and Java about 10⁴. Python stops at 1000 by default, which a linked list or degenerate tree of 10⁵ nodes blows through immediately. It is a soft limit designed to convert a real stack overflow into a catchable exception — but it means recursion depth is a genuine constraint in Python that it is not elsewhere.',
      },
      {
        kind: 'code',
        code: `import sys
sys.setrecursionlimit(10**6)        # the standard contest-template line

# But raising it too far can crash the interpreter outright, because the
# real C stack is still finite. 10**5 or so is usually safe.`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Converting to iteration is the robust fix',
        body: 'An explicit stack lives on the heap and has no depth limit. It is always possible, and it is the standard rescue when a degenerate tree or long linked list would overflow.',
      },
      {
        kind: 'code',
        caption: 'Iterative in-order traversal',
        code: `def inorder(root):
    result, stack, curr = [], [], root
    while curr or stack:
        while curr:                  # go as far left as possible
            stack.append(curr)
            curr = curr.left
        curr = stack.pop()
        result.append(curr.val)      # visit
        curr = curr.right            # then go right
    return result`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Python has no tail-call optimisation',
        body: 'Some languages reuse the frame when the recursive call is the last operation, turning recursion into a loop. Python deliberately does not — Guido van Rossum rejected it to keep tracebacks readable. So a tail-recursive function still consumes one frame per level, and you cannot rely on the optimisation the way you sometimes can in C++.',
      },
    ],
    keyTakeaways: [
      'Each call pushes a frame; all frames coexist until the calls return.',
      'Every frame has its own locals — hence the cost of slicing per level.',
      'Python\'s default limit is 1000 frames, far lower than C++ or Java.',
      'No tail-call optimisation — convert to an explicit stack when depth matters.',
    ],
    practice: {
      prompt: 'Write the indented `trace` function and run it — the nesting *is* the call stack. Then find the depth at which plain recursion raises `RecursionError`. Then convert recursive in-order traversal to the iterative stack version.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-6.5',
    language: 'python',
    summary: 'Recurse over lists with an index, and meet divide-and-conquer.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Lists are not recursive structures, so you shrink them with an **index** rather than by passing sublists. Never slice — copying at every level turns O(n) into O(n²).',
      },
      {
        kind: 'code',
        caption: 'Index, not slice',
        code: `# BAD — nums[1:] copies the rest at every level: O(n^2)
def total(nums):
    if not nums:
        return 0
    return nums[0] + total(nums[1:])

# GOOD — one list, one moving index: O(n)
def total(nums, i=0):
    if i == len(nums):
        return 0
    return nums[i] + total(nums, i + 1)`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Slicing is Python\'s version of pass-by-value',
        body: '`nums[1:]` allocates a new list of n−1 elements every level. Across n levels that is O(n²) copying, and the symptom is Time Limit Exceeded on a solution whose logic is perfectly correct. It is the single most common performance mistake in recursive Python.',
      },
      { kind: 'heading', text: 'Two indices for a range' },
      {
        kind: 'code',
        code: `def is_palindrome(s, left, right):
    if left >= right:                 # met or crossed
        return True
    if s[left] != s[right]:
        return False
    return is_palindrome(s, left + 1, right - 1)`,
      },
      { kind: 'heading', text: 'Divide and conquer' },
      {
        kind: 'text',
        body: 'Instead of peeling one element, split the range in half, solve both halves, and combine. This is where recursion beats iteration on lists.',
      },
      {
        kind: 'code',
        caption: 'Binary search',
        code: `def search(nums, target, low, high):
    if low > high:                        # empty range
        return -1

    mid = (low + high) // 2               # // not / !
    if nums[mid] == target:
        return mid
    if nums[mid] < target:
        return search(nums, target, mid + 1, high)
    return search(nums, target, low, mid - 1)`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Use // for the midpoint',
        body: '`(low + high) / 2` gives a float, and `nums[3.5]` raises `TypeError: list indices must be integers`. Python has no integer-overflow concern here, so `(low + high) // 2` is safe — unlike C++ and Java, where you need `low + (high - low) // 2`.',
      },
      {
        kind: 'code',
        caption: 'Merge sort — the archetype',
        code: `def merge_sort(nums, low, high):
    if low >= high:                       # 0 or 1 element is already sorted
        return

    mid = (low + high) // 2
    merge_sort(nums, low, mid)            # sort the left half
    merge_sort(nums, mid + 1, high)       # sort the right half
    merge(nums, low, mid, high)           # combine — the real work`,
      },
      {
        kind: 'text',
        body: 'Halving gives depth log n, and each level touches n elements once, so the total is **O(n log n)**. That structure — halve, recurse twice, combine linearly — is the shape of merge sort, quicksort and "build a balanced tree from a sorted array".',
      },
      {
        kind: 'code',
        caption: 'Building a balanced BST',
        code: `def build(nums, low, high):
    if low > high:
        return None

    mid = (low + high) // 2
    root = TreeNode(nums[mid])            # the middle becomes the root
    root.left = build(nums, low, mid - 1)
    root.right = build(nums, mid + 1, high)
    return root`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Recursion is not the best tool for simple list scans',
        body: 'Summing or finding a maximum recursively costs O(n) frames for no benefit — and in Python that means hitting the 1000-frame limit on a list of 1000 elements. Recursion earns its place when the problem *divides*: sorting, searching a sorted range, or building a balanced structure. For a straight scan, write the loop.',
      },
    ],
    keyTakeaways: [
      'Shrink lists with an index, never by slicing.',
      'Two indices `(low, high)` represent a range; `low > high` is the empty case.',
      'Use `//` for midpoints — `/` gives a float and breaks indexing.',
      'Divide and conquer halves the range: depth log n, O(n log n) total.',
    ],
    practice: {
      prompt: 'Write recursive binary search with `(low, high)` and test it on an empty range and a one-element list. Then write the slicing version of `total` and time it against the index version on 5000 elements — the quadratic blow-up is the point.',
      leetcode: { title: 'Convert Sorted Array to Binary Search Tree', slug: 'convert-sorted-array-to-binary-search-tree' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-6.6',
    language: 'python',
    summary: 'Recurse over strings without copying them at every level.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Strings behave exactly like lists here: pass the string unchanged and move an index. `s[1:]` at every level is the string equivalent of slicing a list, and just as costly — worse, in fact, because strings are immutable so every slice is a genuine allocation.',
      },
      {
        kind: 'code',
        caption: 'Index, not slice',
        code: `# BAD — O(n^2)
def check(s):
    if not s:
        return True
    return check(s[1:])

# GOOD — O(n)
def check(s, i=0):
    if i == len(s):
        return True
    return check(s, i + 1)`,
      },
      { kind: 'heading', text: 'Palindromes and reversal' },
      {
        kind: 'code',
        code: `def is_palindrome(s, left, right):
    if left >= right:
        return True
    if s[left] != s[right]:
        return False
    return is_palindrome(s, left + 1, right - 1)

def reverse(chars, left, right):        # a LIST of chars — strings are immutable
    if left >= right:
        return
    chars[left], chars[right] = chars[right], chars[left]
    reverse(chars, left + 1, right - 1)`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'You cannot reverse a string in place',
        body: 'Strings are immutable, so there is nothing to swap. Convert to a list of characters, reverse that, and `"".join()` it back. This is why LeetCode\'s "Reverse String" gives you `List[str]` rather than `str` — the signature is a direct consequence of immutability.',
      },
      { kind: 'heading', text: 'Building results as you descend' },
      {
        kind: 'code',
        caption: 'All subsets of a string',
        code: `def subsets(s, i, current, result):
    if i == len(s):
        result.append(current)
        return
    subsets(s, i + 1, current + s[i], result)    # include s[i]
    subsets(s, i + 1, current, result)           # exclude s[i]`,
      },
      {
        kind: 'text',
        body: 'Two calls per character — include it or skip it — giving 2ⁿ results. Here `current` is a string passed by value in effect, because strings are immutable: each branch gets its own. That is the one place the copying is correct.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Immutable state is branch-local for free',
        body: 'Because `current + s[i]` builds a new string, each branch naturally has its own copy with no explicit copying step. Compare that with a list accumulator, which is shared and needs an explicit `pop()` to undo. Strings make simple backtracking simpler — at the cost of an allocation per level.',
      },
      {
        kind: 'code',
        caption: 'The list-based form, for long strings',
        code: `def subsets(s, i, current, result):
    if i == len(s):
        result.append("".join(current))     # join once, at a leaf
        return

    current.append(s[i])                    # choose
    subsets(s, i + 1, current, result)
    current.pop()                           # un-choose

    subsets(s, i + 1, current, result)`,
      },
      {
        kind: 'text',
        body: 'One shared list, mutated and restored, joined only when a complete candidate is reached. More code, but no per-level string allocation — the standard form once strings get long.',
      },
      {
        kind: 'code',
        caption: 'Letter combinations of a phone number',
        code: `def letterCombinations(digits):
    if not digits:
        return []

    mapping = {"2": "abc", "3": "def", "4": "ghi", "5": "jkl",
               "6": "mno", "7": "pqrs", "8": "tuv", "9": "wxyz"}
    result = []

    def backtrack(i, current):
        if i == len(digits):
            result.append("".join(current))
            return
        for c in mapping[digits[i]]:
            current.append(c)
            backtrack(i + 1, current)
            current.pop()

    backtrack(0, [])
    return result`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Always test the empty string',
        body: 'Recursive string problems are routinely tested with `""`. The phone-number problem above needs the explicit `if not digits: return []` guard, because without it the base case fires immediately and produces one empty result instead of none.',
      },
    ],
    keyTakeaways: [
      'Pass the string unchanged and move an index — never `s[1:]` per level.',
      'Strings cannot be reversed in place; use a list and `"".join()`.',
      'Immutable `current` is branch-local for free; a list accumulator needs `pop()`.',
      'Always test the empty string — it is a standard hidden test case.',
    ],
    practice: {
      prompt: 'Generate all subsets of "abc" both ways — with string concatenation and with a shared list plus `pop()` — and confirm both give 8. Then write recursive palindrome checking with two indices and test it on `""` and a single character.',
      leetcode: { title: 'Letter Combinations of a Phone Number', slug: 'letter-combinations-of-a-phone-number' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-6.7',
    language: 'python',
    summary: 'Use the recursive structure of linked lists, where the pointer is already the smaller problem.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'A linked list is recursive by definition: a node plus a reference to a smaller list. So `head.next` already *is* the smaller subproblem — no index needed.',
      },
      {
        kind: 'code',
        caption: 'The basic shape',
        code: `def length(head):
    if not head:                    # base: empty list
        return 0
    return 1 + length(head.next)    # this node, plus the rest

def print_forward(head):
    if not head:
        return
    print(head.val)
    print_forward(head.next)

def print_reverse(head):
    if not head:
        return
    print_reverse(head.next)        # recurse FIRST
    print(head.val)                 # then print, on the way back up`,
      },
      {
        kind: 'text',
        body: 'That last one is worth pausing on. Moving one line changes the output order completely — printing on the way down gives forward order, printing on the way up gives reverse. This is pre-order versus post-order on a list.',
      },
      { kind: 'heading', text: 'Recursive reversal — the one to understand' },
      {
        kind: 'code',
        code: `def reverse(head):
    # Base: empty or single node is already reversed.
    if not head or not head.next:
        return head

    # Trust the recursion: everything after head is now reversed,
    # and new_head is the new front of the whole list.
    new_head = reverse(head.next)

    # head.next still points at the node that is now the TAIL of the
    # reversed part. Make that node point back at head.
    head.next.next = head
    head.next = None                # head becomes the new tail

    return new_head                 # unchanged all the way up`,
      },
      {
        kind: 'text',
        body: 'Take `1 → 2 → 3`. The call on `2` returns `3 → 2`, with `head` still at `1` and `head.next` still pointing at `2`. Since `2` is now the tail, `head.next.next = head` makes `2 → 1`, giving `3 → 2 → 1`. Then `head.next = None` terminates it.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'head.next is still valid after the recursive call',
        body: 'This is the part that confuses people. The recursion rearranges links, but `head.next` was never changed by it — it still refers to the same node, which has become the tail of the reversed portion. That is exactly what makes `head.next.next = head` reattach correctly. Draw three nodes on paper and trace it once; it clicks immediately.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Forgetting head.next = None creates a cycle',
        body: 'Without it, the last node still points forward at the node now behind it: `1 ⇄ 2`. Any later traversal loops forever, showing up as Time Limit Exceeded rather than a crash. Whenever a list solution hangs, look for a node that should have been terminated.',
      },
      { kind: 'heading', text: 'Merging two sorted lists' },
      {
        kind: 'code',
        code: `def merge(a, b):
    if not a:                       # one list empty → the other is the answer
        return b
    if not b:
        return a

    if a.val <= b.val:
        a.next = merge(a.next, b)   # a leads; merge the rest behind it
        return a
    else:
        b.next = merge(a, b.next)
        return b`,
      },
      {
        kind: 'text',
        body: 'Pick the smaller head, then trust the recursion to merge everything left over and attach it behind. Six lines, against a dozen for the iterative version with its dummy node and tail pointer.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Python\'s 1000-frame limit makes this risky',
        body: 'These functions use O(n) frames, and LeetCode list problems routinely allow 10⁵ nodes — which raises `RecursionError` well before you get there. This bites harder in Python than in C++ or Java. Write the recursive version to understand the structure; use the iterative one for real constraints.',
      },
      {
        kind: 'code',
        caption: 'Iterative reversal — O(1) space, no depth limit',
        code: `def reverse(head):
    prev = None
    while head:
        head.next, prev, head = prev, head, head.next
        # equivalently:
        # nxt = head.next
        # head.next = prev
        # prev = head
        # head = nxt
    return prev`,
      },
      {
        kind: 'text',
        body: 'The one-line tuple assignment works because Python evaluates the entire right-hand side first, then assigns left to right — so `head.next` is read before anything is overwritten. Clever, though the four-line version is easier to read under interview pressure.',
      },
    ],
    keyTakeaways: [
      '`head.next` is already the smaller subproblem — no index needed.',
      'Printing before the call gives forward order; after it gives reverse.',
      'In recursive reversal, `head.next` still points at the new tail — that is the key.',
      'Python\'s 1000-frame limit makes iterative list traversal the safer choice.',
    ],
    practice: {
      prompt: 'Draw `1 → 2 → 3` on paper and hand-trace recursive reversal, writing down every pointer after each step. Then code it, then code the iterative version. Then omit `head.next = None` and watch the traversal hang.',
      leetcode: { title: 'Reverse Linked List', slug: 'reverse-linked-list' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-6.8',
    language: 'python',
    summary: 'Explore every possibility systematically, undoing each choice as you retreat.',
    readMinutes: 6,
    blocks: [
      {
        kind: 'text',
        body: 'Backtracking is recursion that **builds a candidate incrementally and undoes each step** when it retreats. It generates permutations, subsets and combinations, and solves N-Queens and Sudoku.',
      },
      {
        kind: 'code',
        caption: 'The skeleton — memorise this',
        code: `def backtrack(current, result):
    if is_complete(current):
        result.append(current[:])        # save a COPY
        return

    for choice in available_choices():
        if not is_valid(choice):
            continue                     # prune

        apply(choice, current)           # CHOOSE
        backtrack(current, result)       # EXPLORE
        undo(choice, current)            # UN-CHOOSE`,
      },
      {
        kind: 'text',
        body: 'Choose, explore, un-choose. Every backtracking problem is this shape with different definitions of "complete", "choices" and "valid".',
      },
      { kind: 'heading', text: 'Subsets — include or exclude' },
      {
        kind: 'code',
        code: `def subsets(nums):
    result = []
    current = []

    def backtrack(start):
        result.append(current[:])            # EVERY node is a valid subset

        for i in range(start, len(nums)):
            current.append(nums[i])          # choose
            backtrack(i + 1)                 # explore — i+1 avoids reuse
            current.pop()                    # un-choose

    backtrack(0)
    return result`,
      },
      {
        kind: 'text',
        body: 'Note `i + 1` rather than `start + 1`: it prevents reusing earlier elements, which is what stops `[1,2]` and `[2,1]` both appearing. Subsets are unordered, so each combination must be generated once.',
      },
      { kind: 'heading', text: 'Permutations — order matters' },
      {
        kind: 'code',
        code: `def permute(nums):
    result = []
    current = []
    used = [False] * len(nums)

    def backtrack():
        if len(current) == len(nums):
            result.append(current[:])
            return

        for i in range(len(nums)):
            if used[i]:
                continue                     # skip what is already in use

            used[i] = True                   # choose
            current.append(nums[i])

            backtrack()

            current.pop()                    # un-choose — BOTH parts
            used[i] = False

    backtrack()
    return result`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Undo every part of the choice',
        body: 'Here "choose" touched two things — `used[i]` and `current` — so "un-choose" must restore both. Forgetting `used[i] = False` means that element is permanently unavailable to every sibling branch, and you silently get far fewer results. Write the undo immediately after writing the choose.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'current[:] is essential',
        body: '`result.append(current)` appends a *reference* to the list that keeps mutating, so every saved result ends up identical and empty. `current[:]` (or `list(current)`) copies it. This is the most common Python backtracking bug, and the output — a list of identical empty lists — is distinctive once you have seen it.',
      },
      {
        kind: 'table',
        headers: ['Problem type', 'Loop starts at', 'Tracking'],
        rows: [
          ['Subsets / combinations', '`start`, recurse with `i + 1`', 'None needed'],
          ['Permutations', '`0` every time', 'A `used` list'],
          ['Combination sum (reuse allowed)', '`start`, recurse with `i`', 'A running total'],
          ['Grid paths', 'Four directions', 'A `visited` set'],
        ],
      },
      { kind: 'heading', text: 'Pruning is what makes it fast enough' },
      {
        kind: 'code',
        caption: 'Combination sum — stop as soon as the branch is hopeless',
        code: `def combination_sum(candidates, target):
    result = []
    current = []

    def backtrack(start, remaining):
        if remaining == 0:
            result.append(current[:])
            return
        if remaining < 0:
            return                           # PRUNE — overshot

        for i in range(start, len(candidates)):
            current.append(candidates[i])
            backtrack(i, remaining - candidates[i])    # i, not i+1 — reuse allowed
            current.pop()

    backtrack(0, target)
    return result`,
      },
      {
        kind: 'text',
        body: 'Without `if remaining < 0: return`, the recursion keeps exploring branches that can never succeed. Pruning early is usually the difference between passing and exceeding the time limit — the search space is exponential, so cutting a branch high up removes an enormous subtree.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Sorting first enables stronger pruning',
        body: 'With candidates sorted ascending, once `candidates[i] > remaining` every later candidate is too, so you can `break` rather than `continue`. Sorting also groups duplicates together, which is how the "no duplicate combinations" variants skip repeats: `if i > start and candidates[i] == candidates[i-1]: continue`.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Python\'s speed makes pruning more important',
        body: 'An exponential search that squeaks through in C++ may time out in Python with the same time limit. Prune aggressively, and prefer generating results directly over filtering afterwards.',
      },
    ],
    keyTakeaways: [
      'Backtracking is choose → explore → un-choose, applied recursively.',
      'Undo every part of a choice, or state leaks into sibling branches.',
      'Save `current[:]`, never `current` — the list keeps mutating.',
      'Prune impossible branches early; Python\'s speed makes it matter more.',
    ],
    practice: {
      prompt: 'Write Subsets, then Permutations, then Combination Sum — in that order, since each adds one idea. Then remove the `current.pop()` from one and study the wrong output; seeing how state leaks between branches is what makes the un-choose step feel necessary.',
      leetcode: { title: 'Subsets', slug: 'subsets' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-6.9',
    language: 'python',
    summary: 'Recognise the eight recursion bugs that account for nearly every failure.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Recursion goes wrong in a small number of predictable ways, and once you can name them you stop losing afternoons to them. The eight below cover nearly every recursion failure a beginner hits — read them now, and come back whenever a recursive function misbehaves in a way you cannot immediately explain.',
      },
      { kind: 'heading', text: '1. Missing or unreachable base case' },
      {
        kind: 'code',
        code: `def f(n):
    return n * f(n - 1)          # RecursionError

if n == 1: return 1              # f(-1) skips straight past
if n <= 1: return 1              # robust`,
      },
      { kind: 'heading', text: '2. Not shrinking the input' },
      {
        kind: 'code',
        code: `return f(n)                  # identical input — infinite

# The subtle version — a graph without a visited set:
def dfs(node):
    for nxt in adj[node]:
        dfs(nxt)                 # cycles → infinite recursion`,
      },
      { kind: 'heading', text: '3. Forgetting to return the recursive result' },
      {
        kind: 'code',
        code: `def total(nums, i):
    if i == len(nums):
        return 0
    total(nums, i + 1)           # BUG — result computed and thrown away
                                 # falls off the end → returns None

def total(nums, i):
    if i == len(nums):
        return 0
    return nums[i] + total(nums, i + 1)     # correct`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Python returns None silently',
        body: 'Java refuses to compile a non-void method that can fall off the end, and C++ warns with `-Wall`. Python does neither — you get `None`, and then a confusing `TypeError` somewhere downstream when you try to add it. If a recursive function returns `None`, look for a missing `return`.',
      },
      { kind: 'heading', text: '4. Slicing instead of indexing' },
      {
        kind: 'code',
        code: `def f(nums):
    return f(nums[1:])           # O(n) copy per level → O(n^2) total

def f(nums, i=0):
    return f(nums, i + 1)        # O(1) per level → O(n) total`,
      },
      { kind: 'heading', text: '5. Forgetting to un-choose' },
      {
        kind: 'code',
        code: `current.append(x)
backtrack()
# missing current.pop()  → state leaks into every sibling branch`,
      },
      { kind: 'heading', text: '6. Appending the mutable object instead of a copy' },
      {
        kind: 'code',
        code: `result.append(current)       # BUG — all results end up identical
result.append(current[:])    # correct — a snapshot`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Bugs 5 and 6 look the same but are different',
        body: 'Forgetting `pop()` gives results that are too long and wrong. Forgetting `[:]` gives the right *number* of results, all of them identical and usually empty. Knowing which symptom you have tells you which line to fix.',
      },
      { kind: 'heading', text: '7. Mutable default arguments' },
      {
        kind: 'code',
        code: `def dfs(node, path=[]):      # BUG — path persists across separate calls
    path.append(node.val)
    ...

def dfs(node, path=None):    # correct
    if path is None:
        path = []`,
      },
      { kind: 'heading', text: '8. Recomputing the same subproblem' },
      {
        kind: 'code',
        code: `def fib(n):
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)      # O(2^n) — fib(35) takes seconds

from functools import cache

@cache
def fib(n):                             # O(n) — one added line
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Matching symptoms to causes',
        body: '**RecursionError** → infinite recursion (1, 2) or genuinely deep recursion. **TypeError involving None** → a missing return (3). **Time Limit Exceeded** → slicing (4) or unmemoised recomputation (8). **Wrong output** → missing un-choose (5), missing copy (6), or a mutable default (7). Reading the error first narrows the search enormously.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Python-specific extras',
        body: 'Two bugs on this list — mutable defaults and the copy-versus-reference distinction — are far more common in Python than in C++ or Java. If you are debugging recursive Python and nothing else fits, check those two first.',
      },
    ],
    keyTakeaways: [
      '`RecursionError` means infinite or too-deep recursion.',
      'A missing `return` gives `None` silently — Python warns about nothing.',
      'Slicing per level and unmemoised recomputation both cause TLE.',
      'Missing `pop()` gives oversized results; missing `[:]` gives identical ones.',
    ],
    practice: {
      prompt: 'Deliberately write each of the eight bugs in a small program and note its symptom. Ten minutes doing this is worth hours later — on LeetCode you get only a verdict and a failing input, so mapping symptom to cause is most of debugging recursion.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-6.10',
    language: 'python',
    summary: 'Work out the time and space cost of a recursive function before you submit it.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'The method: count how many calls happen in total, multiply by the work per call, and separately account for the stack depth as space.',
      },
      {
        kind: 'table',
        headers: ['Shape', 'Calls', 'Time', 'Space (stack)'],
        rows: [
          ['One call, shrink by 1', 'n', 'O(n)', 'O(n)'],
          ['One call, halve', 'log n', 'O(log n)', 'O(log n)'],
          ['Two calls, halve, O(n) merge', '—', 'O(n log n)', 'O(log n)'],
          ['Two calls, shrink by 1', '2ⁿ', 'O(2ⁿ)', 'O(n)'],
          ['Tree traversal', 'one per node', 'O(n)', 'O(h), h = height'],
          ['Permutations', 'n!', 'O(n · n!)', 'O(n)'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Time counts total calls; space counts the deepest single path',
        body: 'This is the distinction people miss. `fib(n)` makes O(2ⁿ) calls but only n of them exist at once — so it is O(2ⁿ) time and O(n) space. Frames are freed as calls return, so what matters for space is the longest chain from the root, not the total.',
      },
      { kind: 'heading', text: 'Worked examples' },
      {
        kind: 'code',
        caption: 'Tree traversal — O(n) time, O(h) space',
        code: `def size(root):
    if not root:
        return 0
    return 1 + size(root.left) + size(root.right)

# exactly one call per node → O(n) time
# depth = tree height → O(log n) if balanced, O(n) if degenerate`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Quote tree space as O(h), and say what h can be',
        body: 'Interviewers listen for this. A balanced tree gives h = log n, but a degenerate one — every node having only a right child — gives h = n. "O(h), which is O(log n) balanced and O(n) worst case" is the complete answer. And in Python the degenerate case is not just theoretical: at n = 10⁵ it raises `RecursionError`.',
      },
      {
        kind: 'code',
        caption: 'Naive Fibonacci — O(2ⁿ) time, O(n) space',
        code: `def fib(n):
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)

# each call spawns two → roughly 2^n calls
# but only n frames are alive at once`,
      },
      { kind: 'heading', text: 'Memoisation collapses the tree' },
      {
        kind: 'code',
        code: `from functools import cache

@cache
def fib(n):
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)

# each distinct n computed once → O(n) time, O(n) space`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The memoisation rule of thumb',
        body: 'With memoisation, **time = number of distinct states × work per state**. For `fib` there are n states and O(1) work each, so O(n). For a 2D grid problem there are rows × cols states, so O(rows × cols). Counting the states is far easier than analysing the raw recursion tree, and it is exactly how you reason about dynamic programming.',
      },
      { kind: 'heading', text: 'Hidden costs specific to Python' },
      {
        kind: 'code',
        code: `# These look O(n) and are not:
def f(nums):
    return f(nums[1:])           # O(n) slice per level → O(n^2)

def f(s):
    return f(s[1:])              # same for strings

for x in nums:
    if x in seen_list:           # O(n) membership → O(n^2) overall
        ...

result = ""
for c in chars:
    result += c                  # O(n) string rebuild → O(n^2)`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'When a "linear" solution times out, check these four',
        body: 'Slicing in recursion, `x in list` inside a loop, string concatenation with `+=`, and `list.pop(0)`. All four read as constant-time operations and are not. They are a more common cause of Python TLE than a genuinely wrong algorithm.',
      },
      {
        kind: 'table',
        headers: ['Constraint', 'What it suggests'],
        rows: [
          ['n ≤ 10', 'O(n!) — permutations'],
          ['n ≤ 20', 'O(2ⁿ) — subsets, bitmask DP'],
          ['n ≤ 10³', 'O(n²) is fine — though tight in Python'],
          ['n ≤ 10⁵', 'O(n log n) or O(n)'],
          ['n ≤ 10⁹', 'O(log n) — binary search or maths'],
        ],
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Python\'s constant factor shrinks the margin',
        body: 'Being 10–100× slower than C++ with the same time limit means an O(n²) solution at n = 5000 may pass in C++ and fail in Python. Aim for the intended complexity rather than hoping a slightly slow approach squeaks through, and push work into built-ins wherever possible.',
      },
    ],
    keyTakeaways: [
      'Time = total calls × work per call; space = maximum depth.',
      '`fib` is O(2ⁿ) time but only O(n) space — frames free as calls return.',
      'Tree recursion is O(n) time and O(h) space, where h can be n.',
      'With memoisation, time = distinct states × work per state.',
    ],
    practice: {
      prompt: 'Time naive `fib(35)` and then the `@cache` version — seconds becomes instant. Then state the time and space of every recursive function in this chapter out loud, in the form "O(x) time, O(y) space because…". That sentence is what an interviewer expects right after you finish coding.',
      leetcode: { title: 'Climbing Stairs', slug: 'climbing-stairs' },
    },
  },
];
