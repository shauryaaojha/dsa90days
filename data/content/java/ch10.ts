import type { Lesson } from '../types';

/**
 * Java Chapter 10 — Stack and Queue.
 * Two structures, one class: ArrayDeque does both, and doing them well is what
 * unlocks DFS, BFS and the monotonic-stack family.
 */
export const ch10: Lesson[] = [
  // -------------------------------------------------------------------------
  {
    topicId: 'java-10.1',
    language: 'java',
    summary: 'Understand LIFO, and recognise the problems that are secretly stack problems.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A stack is **last in, first out** — like a stack of plates, you can only take the one on top. That single restriction sounds limiting, but it is exactly what a surprising number of problems need: anything where the most recent unresolved thing is the one you must deal with first.',
      },
      {
        kind: 'table',
        headers: ['Operation', 'Meaning', 'Cost'],
        rows: [
          ['`push(x)`', 'Put x on top', 'O(1)'],
          ['`pop()`', 'Remove and return the top', 'O(1)'],
          ['`peek()`', 'Look at the top without removing', 'O(1)'],
          ['`isEmpty()`', 'Is there anything left?', 'O(1)'],
        ],
      },
      { kind: 'heading', text: 'The problems that are stacks in disguise' },
      {
        kind: 'text',
        body: 'Matching brackets: an opening bracket is "unresolved" until its partner arrives, and the most recent unresolved one must close first. Undo history: the last action reverses first. Function calls: the innermost call returns first — the *call stack* is literally a stack. Expression evaluation, and the monotonic-stack family in Chapter 16.',
      },
      {
        kind: 'code',
        caption: 'Valid Parentheses — the canonical example',
        code: `boolean isValid(String s) {
    Deque<Character> stack = new ArrayDeque<>();

    for (char c : s.toCharArray()) {
        if (c == '(' || c == '[' || c == '{') {
            stack.push(c);                       // unresolved — remember it
        } else {
            if (stack.isEmpty()) return false;   // closer with nothing open

            char open = stack.pop();             // must match the MOST RECENT
            if ((c == ')' && open != '(') ||
                (c == ']' && open != '[') ||
                (c == '}' && open != '{')) return false;
        }
    }
    return stack.isEmpty();                      // anything left = unclosed
}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The tell: "most recent" or "innermost"',
        body: 'If a problem cares about the most recently seen unresolved item — the nearest opening bracket, the last greater element, the innermost nesting level — that is a stack. Spotting that phrasing is worth more than memorising any particular solution.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Check `isEmpty()` before every `pop()`',
        body: 'Popping an empty `ArrayDeque` throws `NoSuchElementException`. In bracket matching this happens on input like `")"` — a closer with nothing open. Forgetting the guard is the most common way this problem fails on hidden tests.',
      },
    ],
    keyTakeaways: [
      'A stack is LIFO — only the top is reachable.',
      'All four operations are O(1).',
      'The tell is "most recent unresolved" or "innermost".',
      'Always check `isEmpty()` before popping.',
    ],
    practice: {
      prompt: 'Solve Valid Parentheses. Then extend it with a `Map<Character,Character>` from closer to opener, which removes the three-way condition entirely.',
      leetcode: { title: 'Valid Parentheses', slug: 'valid-parentheses' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-10.2',
    language: 'java',
    summary: 'Know the Stack class well enough to read it — and why to write ArrayDeque instead.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: '`java.util.Stack` is the obvious-sounding choice and it works on every judge. It is nonetheless discouraged, for two concrete reasons rather than fashion.',
      },
      {
        kind: 'code',
        code: `Stack<Integer> st = new Stack<>();
st.push(1);
st.push(2);
st.peek();        // 2
st.pop();         // 2
st.isEmpty();
st.size();`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Reason 1: it extends `Vector`, so every method is synchronised',
        body: 'Each `push` and `pop` acquires a lock you almost certainly do not need. That is pure overhead in single-threaded code, and it is not enough for real thread safety anyway.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Reason 2: it iterates bottom-to-top',
        body: 'A for-each loop over a `Stack` returns elements in *insertion* order — the reverse of pop order. Printing a stack while debugging shows it upside down, which is genuinely disorienting when you are already unsure of your logic.',
      },
      {
        kind: 'code',
        caption: 'Same program, two classes',
        code: `Stack<Integer> a = new Stack<>();
a.push(1); a.push(2); a.push(3);
for (int x : a) System.out.print(x + " ");     // 1 2 3   <- bottom first

Deque<Integer> b = new ArrayDeque<>();
b.push(1); b.push(2); b.push(3);
for (int x : b) System.out.print(x + " ");     // 3 2 1   <- top first`,
        output: '1 2 3\n3 2 1',
      },
      {
        kind: 'text',
        body: 'The `ArrayDeque` order matches how you think about a stack, which makes debugging output trustworthy. That alone is worth the switch.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'One genuine advantage of `Stack`',
        body: 'It can hold `null`; `ArrayDeque` rejects nulls with a `NullPointerException`. That is almost never what you want in DSA — but if you are pushing possibly-null tree nodes, you have to guard, or use `LinkedList` as your `Deque`.',
      },
    ],
    keyTakeaways: [
      '`Stack` works but is synchronised and slow.',
      'It iterates bottom-to-top, the reverse of pop order.',
      '`Deque<T> stack = new ArrayDeque<>()` is the modern form.',
      '`ArrayDeque` rejects `null` — guard before pushing tree children.',
    ],
    practice: {
      prompt: 'Run the two-class comparison above and see the reversed iteration for yourself. Then try `deque.push(null)` and read the exception.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-10.3',
    language: 'java',
    summary: 'Use push, pop and peek correctly, including which end ArrayDeque uses.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'The three stack operations are simple, but `ArrayDeque` has a detail worth pinning down: `push` and `pop` operate on the **front** (the head), not the back. Get that straight and everything else follows.',
      },
      {
        kind: 'code',
        code: `Deque<Integer> stack = new ArrayDeque<>();

stack.push(1);      // == addFirst(1)     [1]
stack.push(2);      // == addFirst(2)     [2, 1]
stack.push(3);      //                    [3, 2, 1]

stack.peek();       // == peekFirst()  -> 3
stack.pop();        // == removeFirst()-> 3
stack.size();       // 2`,
      },
      {
        kind: 'table',
        headers: ['Stack method', 'Deque equivalent', 'Operates on'],
        rows: [
          ['`push(x)`', '`addFirst(x)`', 'Front'],
          ['`pop()`', '`removeFirst()`', 'Front'],
          ['`peek()`', '`peekFirst()`', 'Front'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Two families that behave differently when empty',
        body: 'The `xxxFirst`/`xxxLast` methods **throw** `NoSuchElementException` on an empty deque. The `peek`/`poll` family returns **null** instead. Mixing them up means either an unexpected crash or a silent null you then unbox into an `int` — a `NullPointerException` one line later.',
      },
      {
        kind: 'table',
        headers: ['Action', 'Throws when empty', 'Returns null when empty'],
        rows: [
          ['Look at head', '`getFirst()` / `element()`', '`peek()` / `peekFirst()`'],
          ['Remove head', '`removeFirst()` / `remove()`', '`poll()` / `pollFirst()`'],
          ['Add', '`addFirst()` / `add()`', '`offerFirst()` / `offer()`'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Pick one family and stay in it',
        body: 'For stacks, use `push` / `pop` / `peek` and always guard with `isEmpty()`. For queues, use `offer` / `poll` / `peek` and check for null. Consistency here removes an entire class of confusion.',
      },
      {
        kind: 'code',
        caption: 'The safe pattern',
        code: `while (!stack.isEmpty()) {
    int top = stack.pop();
    // ...
}

// Or, for the null-returning family:
Integer top;
while ((top = stack.poll()) != null) { ... }`,
      },
    ],
    keyTakeaways: [
      'On `ArrayDeque`, push/pop/peek all work at the **front**.',
      '`xxxFirst`/`xxxLast` throw when empty; `peek`/`poll` return null.',
      'Pick one family per structure and stay consistent.',
      'Guard with `isEmpty()` rather than relying on exceptions.',
    ],
    practice: {
      prompt: 'Pop from an empty `ArrayDeque` using both `pop()` and `poll()`. One throws, one gives null — knowing which is which prevents a confusing NullPointerException later.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-10.4',
    language: 'java',
    summary: 'Understand FIFO and the Queue interface, the backbone of BFS.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A queue is **first in, first out** — a supermarket queue. You add at the back and remove from the front. Where a stack goes deep, a queue goes **wide**, and that difference is exactly what makes BFS find shortest paths while DFS does not.',
      },
      {
        kind: 'code',
        code: `Queue<Integer> q = new ArrayDeque<>();

q.offer(1);      // add at the BACK
q.offer(2);
q.offer(3);

q.peek();        // 1 — front, without removing
q.poll();        // 1 — remove from the FRONT
q.size();        // 2`,
      },
      {
        kind: 'table',
        headers: ['Method', 'Does', 'When empty/full'],
        rows: [
          ['`offer(x)`', 'Add at the back', 'Returns false if capacity-bound'],
          ['`add(x)`', 'Add at the back', 'Throws if capacity-bound'],
          ['`poll()`', 'Remove from the front', 'Returns `null`'],
          ['`remove()`', 'Remove from the front', 'Throws'],
          ['`peek()`', 'Look at the front', 'Returns `null`'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Prefer `offer` / `poll` / `peek`',
        body: 'They signal failure with a return value rather than an exception, which is usually easier to handle. `ArrayDeque` is unbounded so `offer` never fails — but the habit transfers cleanly to bounded queues.',
      },
      { kind: 'heading', text: 'Why a queue gives shortest paths' },
      {
        kind: 'text',
        body: 'A queue processes nodes in the order they were discovered, so everything at distance 1 is handled before anything at distance 2. That means **the first time you reach a node is by a shortest path** — a guarantee a stack cannot give you, because DFS commits to one branch before exploring alternatives.',
      },
      {
        kind: 'code',
        caption: 'BFS on a graph',
        code: `int bfs(int start, int target, List<List<Integer>> adj, int n) {
    Queue<Integer> q = new ArrayDeque<>();
    boolean[] visited = new boolean[n];

    q.offer(start);
    visited[start] = true;                 // mark on ENQUEUE
    int level = 0;

    while (!q.isEmpty()) {
        int size = q.size();               // snapshot BEFORE the inner loop

        for (int i = 0; i < size; i++) {
            int node = q.poll();
            if (node == target) return level;

            for (int next : adj.get(node)) {
                if (!visited[next]) {
                    visited[next] = true;
                    q.offer(next);
                }
            }
        }
        level++;                           // one full ring done
    }
    return -1;
}`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Mark visited when you enqueue, not when you dequeue',
        body: 'If you wait until dequeue, a node reachable from several neighbours gets pushed many times before any copy is processed. The queue balloons and the solution times out on dense graphs.',
      },
    ],
    keyTakeaways: [
      'A queue is FIFO: add at the back, remove from the front.',
      '`offer`/`poll`/`peek` fail with a return value; `add`/`remove` throw.',
      'FIFO order is what makes BFS find shortest paths.',
      'Mark nodes visited on enqueue.',
    ],
    practice: {
      prompt: 'Write BFS over a small adjacency list and print the level of each node. Then swap the queue for a stack and watch the traversal order change from wide to deep.',
      leetcode: { title: 'Binary Tree Level Order Traversal', slug: 'binary-tree-level-order-traversal' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-10.5',
    language: 'java',
    summary: 'Know that LinkedList implements Queue, and when that is actually useful.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: '`LinkedList` implements both `List` and `Deque`, so it can serve as a queue. You will see it used this way in older tutorials — `Queue<Integer> q = new LinkedList<>();` — and it works correctly. It is simply slower than `ArrayDeque`.',
      },
      {
        kind: 'code',
        code: `Queue<Integer> q = new LinkedList<>();     // works
Queue<Integer> q = new ArrayDeque<>();     // preferred — faster`,
      },
      {
        kind: 'table',
        headers: ['', '`LinkedList`', '`ArrayDeque`'],
        rows: [
          ['Queue operations', 'O(1)', 'O(1)'],
          ['Memory per element', 'Value + 2 references', 'Just the value'],
          ['Cache behaviour', 'Scattered nodes', 'Contiguous — much better'],
          ['Allows `null`', 'Yes', '**No**'],
          ['Speed in practice', 'Slower', '**Faster**'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The one time `LinkedList` is the right queue',
        body: 'When you need to store `null` elements. `ArrayDeque` throws `NullPointerException` on `offer(null)`, so a level-order traversal that pushes `node.left` without a null check will crash. Either guard the null — which is better practice anyway — or use `LinkedList`.',
      },
      {
        kind: 'code',
        caption: 'The null trap in tree traversal',
        code: `Queue<TreeNode> q = new ArrayDeque<>();
q.offer(root);

while (!q.isEmpty()) {
    TreeNode node = q.poll();

    q.offer(node.left);      // NullPointerException when left is null!

    // Correct:
    if (node.left != null) q.offer(node.left);
    if (node.right != null) q.offer(node.right);
}`,
      },
      {
        kind: 'text',
        body: 'Guarding the null is better than switching classes: it makes the intent explicit and avoids putting meaningless entries in the queue. Reach for `LinkedList` only when a null genuinely carries meaning — a level separator, for instance.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Do not use `LinkedList` as a queue out of habit',
        body: 'It appears in a great many tutorials because it predates `ArrayDeque` (added in Java 6). Seeing it does not mean it is the current recommendation. Default to `ArrayDeque`.',
      },
    ],
    keyTakeaways: [
      '`LinkedList` works as a queue but is slower than `ArrayDeque`.',
      '`ArrayDeque` rejects `null`; `LinkedList` accepts it.',
      'Guard `node.left != null` rather than switching classes.',
      'Its prevalence in tutorials is historical, not a recommendation.',
    ],
    practice: {
      prompt: 'Write a level-order traversal with `ArrayDeque` and deliberately omit the null checks. Read the NullPointerException, then add the guards.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-10.6',
    language: 'java',
    summary: 'Use one class for both stack and queue, and keep the two APIs straight.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: '`ArrayDeque` is a double-ended queue backed by a **circular array**. Because both ends are O(1), the same class serves as a stack and as a queue — which is why it is the only container you need for this whole chapter.',
      },
      {
        kind: 'code',
        caption: 'Same class, two roles',
        code: `// As a STACK (LIFO) — everything at the front
Deque<Integer> stack = new ArrayDeque<>();
stack.push(1);  stack.push(2);
stack.pop();                       // 2  <- last in, first out

// As a QUEUE (FIFO) — in at the back, out at the front
Queue<Integer> queue = new ArrayDeque<>();
queue.offer(1); queue.offer(2);
queue.poll();                      // 1  <- first in, first out`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The declaration documents your intent',
        body: 'Declaring `Deque<Integer> stack` versus `Queue<Integer> queue` tells a reader which behaviour you rely on, even though both are `ArrayDeque` underneath. The `Queue` interface also hides `push`/`pop`, which prevents accidentally mixing the two APIs.',
      },
      {
        kind: 'text',
        body: 'The circular array is what makes both ends cheap. There is no "start of the array" to shift toward — the deque keeps head and tail indices that wrap around, so adding at either end is just a write and an index adjustment.',
      },
      {
        kind: 'code',
        caption: 'The full double-ended API',
        code: `Deque<Integer> dq = new ArrayDeque<>();

dq.addFirst(1);     dq.addLast(2);        // add at either end
dq.peekFirst();     dq.peekLast();        // look at either end
dq.pollFirst();     dq.pollLast();        // remove from either end

dq.descendingIterator();                  // walk it backwards`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Do not mix stack and queue methods on the same object',
        body: 'Calling `push` (front) and `poll` (front) on one deque gives you LIFO, not FIFO — both touch the head. Mixing `push` with `offer` gives you something that is neither. Decide the role once and use only that role\'s methods.',
      },
      {
        kind: 'table',
        headers: ['Role', 'Add', 'Remove', 'Peek'],
        rows: [
          ['Stack (LIFO)', '`push`', '`pop`', '`peek`'],
          ['Queue (FIFO)', '`offer`', '`poll`', '`peek`'],
          ['Deque (both)', '`addFirst`/`addLast`', '`pollFirst`/`pollLast`', '`peekFirst`/`peekLast`'],
        ],
      },
    ],
    keyTakeaways: [
      '`ArrayDeque` is a circular array with O(1) at both ends.',
      'It serves as both stack and queue — declare the interface for your role.',
      'Stack uses push/pop; queue uses offer/poll. Do not mix them.',
      'Its `descendingIterator` walks the structure backwards.',
    ],
    practice: {
      prompt: 'Create one `ArrayDeque` and use it as a stack, then create another and use it as a queue, pushing the same values into both. Compare the removal orders side by side.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-10.7',
    language: 'java',
    summary: 'Choose between the throwing and null-returning method families.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'Java gives you two methods for every queue operation — one that throws on failure, one that returns a sentinel. They are otherwise identical, and knowing which family you are in prevents both surprise exceptions and surprise nulls.',
      },
      {
        kind: 'table',
        headers: ['Operation', 'Throws on failure', 'Returns sentinel'],
        rows: [
          ['Insert', '`add(x)` — throws if full', '`offer(x)` — returns `false`'],
          ['Remove', '`remove()` — throws if empty', '`poll()` — returns `null`'],
          ['Examine', '`element()` — throws if empty', '`peek()` — returns `null`'],
        ],
      },
      {
        kind: 'code',
        code: `Queue<Integer> q = new ArrayDeque<>();

q.poll();        // null — empty queue, no exception
q.peek();        // null

q.remove();      // NoSuchElementException
q.element();     // NoSuchElementException`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Unboxing a null result throws NullPointerException',
        body: '`int x = q.poll();` on an empty queue: `poll` returns `null`, Java tries to unbox it into an `int`, and you get an NPE whose stack trace points at the assignment rather than at the empty queue. Either guard with `isEmpty()` first, or receive it as an `Integer` and check.',
      },
      {
        kind: 'code',
        caption: 'Three safe forms',
        code: `// 1. Guard first — clearest
while (!q.isEmpty()) {
    int x = q.poll();
}

// 2. Receive as Integer and test
Integer x = q.poll();
if (x != null) { ... }

// 3. Assignment inside the condition
Integer x;
while ((x = q.poll()) != null) { ... }`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The habit worth forming',
        body: 'Use `offer` / `poll` / `peek`, and always check `isEmpty()` before removing. That single pattern works for every queue and deque in the library and never surprises you.',
      },
      {
        kind: 'text',
        body: 'The distinction exists because `Queue` was designed to cover bounded queues too — a `BlockingQueue` with a capacity really can refuse an insert. For `ArrayDeque`, which is unbounded, `offer` always succeeds and only the removal side matters.',
      },
    ],
    keyTakeaways: [
      'Two families: `add`/`remove`/`element` throw; `offer`/`poll`/`peek` return sentinels.',
      '`int x = q.poll()` on an empty queue throws NPE via unboxing.',
      'Guard with `isEmpty()` before removing.',
      'The split exists for bounded queues; `ArrayDeque` never rejects an insert.',
    ],
    practice: {
      prompt: 'On an empty `ArrayDeque`, call all six methods and note which throw and which return null. Then write `int x = q.poll();` and read the NullPointerException carefully — the trace is misleading, which is why it is worth seeing once.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-10.8',
    language: 'java',
    summary: 'Internalise FIFO versus LIFO by seeing how the same traversal changes.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'The clearest way to feel the difference is to write one traversal and change only the container. The code is otherwise identical; the behaviour is completely different — and that contrast is the whole of DFS versus BFS.',
      },
      {
        kind: 'code',
        caption: 'One algorithm, two containers',
        code: `// STACK -> depth first: dive down one branch fully, then backtrack
Deque<TreeNode> stack = new ArrayDeque<>();
stack.push(root);
while (!stack.isEmpty()) {
    TreeNode n = stack.pop();
    visit(n);
    if (n.right != null) stack.push(n.right);
    if (n.left  != null) stack.push(n.left);
}

// QUEUE -> breadth first: finish each level before the next
Queue<TreeNode> queue = new ArrayDeque<>();
queue.offer(root);
while (!queue.isEmpty()) {
    TreeNode n = queue.poll();
    visit(n);
    if (n.left  != null) queue.offer(n.left);
    if (n.right != null) queue.offer(n.right);
}`,
      },
      {
        kind: 'table',
        headers: ['', 'Stack (DFS)', 'Queue (BFS)'],
        rows: [
          ['Explores', 'Deep first', 'Wide first'],
          ['Finds shortest path?', '**No**', '**Yes** (unweighted)'],
          ['Memory', 'O(height)', 'O(width) — can be large'],
          ['Natural form', 'Recursion', 'Iteration'],
          ['Good for', 'Paths, backtracking, cycles', 'Shortest path, levels'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Memory is the real trade-off',
        body: 'DFS holds one root-to-leaf path — O(height). BFS holds an entire level, which for a balanced binary tree is about half of all the nodes — O(width). On a wide shallow tree DFS wins on memory; on a deep narrow one BFS does.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Push the right child first for left-to-right DFS',
        body: 'A stack reverses order, so pushing left then right pops right first. To visit left-to-right you must push **right first**. Getting this backwards produces a mirror-image traversal that still looks plausible.',
      },
      {
        kind: 'text',
        body: 'The recursive DFS you already know uses the *call stack* instead of an explicit one. Both are stacks — writing it iteratively just makes that visible, and is the standard escape route when recursion would overflow.',
      },
    ],
    keyTakeaways: [
      'Swapping stack for queue turns DFS into BFS; nothing else changes.',
      'Only BFS guarantees a shortest path on an unweighted graph.',
      'DFS costs O(height) memory; BFS costs O(width).',
      'Push the right child first to get left-to-right DFS.',
    ],
    practice: {
      prompt: 'Build a small binary tree and run both traversals, printing the visit order. Then swap the push order in the DFS version and confirm the traversal mirrors.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-10.9',
    language: 'java',
    summary: 'Recognise the families of LeetCode problems these two structures unlock.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Stacks and queues appear in far more problems than their simplicity suggests. Here are the families, with the phrase in the prompt that gives each one away.',
      },
      { kind: 'heading', text: 'Stack problems' },
      {
        kind: 'table',
        headers: ['Family', 'The tell', 'Example'],
        rows: [
          ['Bracket matching', '"valid", "balanced", "nested"', 'Valid Parentheses'],
          ['Next greater / smaller', '"next warmer day", "next larger"', 'Daily Temperatures'],
          ['Expression evaluation', '"evaluate", "RPN", "calculator"', 'Evaluate RPN'],
          ['Undo / history', '"previous state", "backspace"', 'Backspace String Compare'],
          ['Iterative DFS', '"all paths", "explore"', 'Binary Tree Preorder'],
          ['Min/max in O(1)', '"getMin in constant time"', 'Min Stack'],
        ],
      },
      { kind: 'heading', text: 'Queue problems' },
      {
        kind: 'table',
        headers: ['Family', 'The tell', 'Example'],
        rows: [
          ['Level order', '"level by level", "depth k"', 'Level Order Traversal'],
          ['Shortest path (unweighted)', '"minimum steps", "fewest moves"', 'Word Ladder'],
          ['Multi-source spread', '"rot", "infect", "spread"', 'Rotting Oranges'],
          ['Grid traversal', '"islands", "regions", "flood"', 'Number of Islands'],
          ['Sliding window max', '"maximum in each window"', 'Sliding Window Maximum'],
        ],
      },
      {
        kind: 'code',
        caption: 'Min Stack — the classic design question',
        code: `class MinStack {
    private Deque<Integer> stack = new ArrayDeque<>();
    private Deque<Integer> mins  = new ArrayDeque<>();   // running minimum

    public void push(int x) {
        stack.push(x);
        // keep the min so far on top of the second stack
        mins.push(mins.isEmpty() ? x : Math.min(x, mins.peek()));
    }

    public void pop()     { stack.pop(); mins.pop(); }   // always in lockstep
    public int  top()     { return stack.peek(); }
    public int  getMin()  { return mins.peek(); }        // O(1)
}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The two-stack trick generalises',
        body: 'Keeping a second stack of "the answer so far" gives O(1) queries for any property that can be maintained incrementally — minimum, maximum, running sum. The same idea implements a queue from two stacks.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Push to `mins` on every push, even duplicates',
        body: 'It is tempting to skip pushing when the new value is not smaller — but then `pop` cannot stay in lockstep and `getMin` goes wrong after a pop. Push every time; the memory cost is worth the simplicity.',
      },
    ],
    keyTakeaways: [
      'Stack tells: brackets, next greater, expressions, undo, iterative DFS.',
      'Queue tells: levels, shortest path, spreading, grids.',
      'A second stack of "best so far" gives O(1) min/max queries.',
      'Keep the two stacks in lockstep — push on every push.',
    ],
    practice: {
      prompt: 'Implement Min Stack, then Implement Queue using Stacks. The second one forces you to think about amortised cost, which is a genuinely useful idea.',
      leetcode: { title: 'Min Stack', slug: 'min-stack' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-10.10',
    language: 'java',
    summary: 'Meet the monotonic stack and deque — the pattern that makes O(n²) scans linear.',
    readMinutes: 6,
    blocks: [
      {
        kind: 'text',
        body: 'A **monotonic** stack is one you deliberately keep sorted — always increasing or always decreasing — by popping anything that would break the order. That discipline turns "for each element, scan right until I find something bigger" from O(n²) into O(n), and it is the most valuable stack technique in DSA.',
      },
      {
        kind: 'text',
        body: 'The insight: when a new element arrives that breaks the order, **it is the answer for everything it pops**. The pop is where you record the result — that is the entire pattern.',
      },
      {
        kind: 'code',
        caption: 'Next greater element to the right',
        code: `int[] nextGreater(int[] nums) {
    int[] res = new int[nums.length];
    Arrays.fill(res, -1);                    // default: nothing greater
    Deque<Integer> stack = new ArrayDeque<>();   // holds INDICES

    for (int i = 0; i < nums.length; i++) {
        // nums[i] is the next greater element for everything it beats
        while (!stack.isEmpty() && nums[stack.peek()] < nums[i]) {
            res[stack.pop()] = nums[i];
        }
        stack.push(i);
    }
    return res;                              // leftovers keep -1
}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'It is O(n) despite the inner loop',
        body: 'Each index is pushed exactly once and popped at most once, so the total number of pops across the whole run is at most n. Amortised, the inner `while` is free. This is worth being able to explain — interviewers ask.',
      },
      {
        kind: 'table',
        headers: ['You want', 'Keep the stack', 'Pop while'],
        rows: [
          ['Next **greater** element', 'Decreasing', 'top < current'],
          ['Next **smaller** element', 'Increasing', 'top > current'],
          ['Previous greater', 'Decreasing (scan left)', 'top < current'],
          ['Previous smaller', 'Increasing (scan left)', 'top > current'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Store indices, not values',
        body: 'Daily Temperatures wants `i - stack.peek()`, a *distance*. Largest Rectangle needs positions to compute widths. You can always recover the value with `nums[idx]`, but you can never recover an index from a value — so default to storing indices.',
      },
      { kind: 'heading', text: 'The monotonic deque — sliding window maximum' },
      {
        kind: 'text',
        body: 'The same idea with one addition: because the window also moves on the left, you need to discard elements that have fallen out of range. That requires removing from both ends, which is exactly what a deque provides.',
      },
      {
        kind: 'code',
        code: `int[] maxSlidingWindow(int[] nums, int k) {
    Deque<Integer> dq = new ArrayDeque<>();      // indices, values decreasing
    int[] res = new int[nums.length - k + 1];

    for (int i = 0; i < nums.length; i++) {
        // 1. drop indices that have slid out of the window
        if (!dq.isEmpty() && dq.peekFirst() <= i - k) dq.pollFirst();

        // 2. drop values smaller than the incoming one — they can never win
        while (!dq.isEmpty() && nums[dq.peekLast()] < nums[i]) dq.pollLast();

        dq.addLast(i);

        // 3. the front is always the window maximum
        if (i >= k - 1) res[i - k + 1] = nums[dq.peekFirst()];
    }
    return res;
}`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Why discarding smaller values is safe',
        body: 'If `nums[j] < nums[i]` and `j < i`, then `j` can never be the maximum again — `i` is both larger and stays in the window longer. Convincing yourself of that is what makes the algorithm believable rather than magic.',
      },
    ],
    keyTakeaways: [
      'A monotonic stack records the answer at the moment it pops.',
      'Each index is pushed and popped once, so the scan is O(n).',
      'Decreasing stack → next greater; increasing → next smaller.',
      'A monotonic deque adds left-side eviction, giving sliding-window maxima.',
    ],
    practice: {
      prompt: 'Solve Daily Temperatures with a monotonic stack — the answer is `i - stack.peek()`. Then attempt Sliding Window Maximum with the deque version; it is hard, and worth the time.',
      leetcode: { title: 'Daily Temperatures', slug: 'daily-temperatures' },
    },
  },
];
