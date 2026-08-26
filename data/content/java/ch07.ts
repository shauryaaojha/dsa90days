import type { Lesson } from '../types';

/**
 * Java Chapter 7 — Recursion and Backtracking.
 * The first chapter where the student has to trust a method they have not
 * finished writing. Everything here is aimed at making that leap concrete.
 */
export const ch07: Lesson[] = [
  // -------------------------------------------------------------------------
  {
    topicId: 'java-7.1',
    language: 'java',
    summary: 'Understand what recursion actually is, and why it feels impossible at first.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Recursion is a method that calls itself. That one-line definition is true and completely useless the first time you meet it — the real difficulty is psychological, not technical. You have to write a call to a method you have not finished writing, and **trust that it works**.',
      },
      {
        kind: 'text',
        body: 'Here is the mental shift that makes it click. Do not try to trace the calls in your head. Instead, assume the method already works for smaller inputs, and ask only: *given a correct answer to the smaller problem, how do I build the answer to mine?*',
      },
      {
        kind: 'code',
        caption: 'Sum of 1..n, without a loop',
        code: `int sum(int n) {
    if (n == 0) return 0;        // BASE CASE: smallest problem, answered directly
    return n + sum(n - 1);       // RECURSIVE CASE: trust sum(n-1), add my bit
}

sum(4);   // 4 + sum(3) = 4 + 3 + sum(2) = ... = 10`,
        output: '10',
      },
      {
        kind: 'text',
        body: 'Notice you never had to think about what happens four levels deep. You only had to believe two things: `sum(0)` is 0, and `sum(n)` is `n` plus the sum of everything below it. That is the whole method.',
      },
      { kind: 'heading', text: 'Every recursive method has exactly two parts' },
      {
        kind: 'table',
        headers: ['Part', 'Job', 'What goes wrong without it'],
        rows: [
          ['Base case', 'Answer the smallest input directly, with no further calls', '`StackOverflowError` — the calls never stop'],
          ['Recursive case', 'Solve a **smaller** version, then combine', 'The method never reduces, so it never reaches the base case'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The recursive call must move toward the base case',
        body: 'This is the rule that makes recursion terminate. `sum(n - 1)` gets closer to 0 every call. `sum(n)` or `sum(n + 1)` never would. When a recursive method hangs, this is almost always why — check that every path shrinks the input.',
      },
      { kind: 'heading', text: 'Why bother, when a loop would work?' },
      {
        kind: 'text',
        body: 'For `sum` a loop is genuinely better. But some structures are *defined* recursively — a binary tree is a node with two subtrees, each of which is a binary tree — and for those, recursive code is dramatically shorter than the loop equivalent. Trees, graphs, permutations and divide-and-conquer sorts are where recursion earns its keep.',
      },
      {
        kind: 'code',
        caption: 'The same shape, on a tree',
        code: `int height(TreeNode root) {
    if (root == null) return 0;                    // base case
    return 1 + Math.max(height(root.left),         // trust both subtrees
                        height(root.right));
}`,
      },
    ],
    keyTakeaways: [
      'Recursion = a method calling itself on a **smaller** input.',
      'Do not trace the calls — assume the smaller call is correct and build on it.',
      'Every recursive method needs a base case and a shrinking recursive case.',
      'It shines on recursively-defined structures: trees, graphs, permutations.',
    ],
    practice: {
      prompt: 'Write `factorial(n)` recursively, then `power(base, exp)`. For each one, say out loud what the base case is before you write any code — that habit alone prevents most recursion bugs.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-7.2',
    language: 'java',
    summary: 'Write base cases that actually stop the recursion, including the ones people forget.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'The base case is the input so small you can answer it without thinking. It is the only thing standing between your method and a `StackOverflowError`, and it is where beginners lose the most time — usually not by omitting it, but by writing one that some inputs *skip over*.',
      },
      {
        kind: 'code',
        caption: 'Base cases for the structures you will meet',
        code: `// Numbers — counting down to zero
if (n == 0) return 0;

// Arrays — index walked off the end
if (i == nums.length) return 0;

// Strings — nothing left
if (s.isEmpty()) return true;

// Linked lists — fell off the end
if (head == null) return null;

// Trees — no node here
if (root == null) return 0;`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Use `>=`, not `==`, when the input can jump',
        body: 'If your recursion sometimes decreases by 2 — `solve(n - 2)` — then `if (n == 0)` is skipped entirely for odd `n`, and the method recurses into negatives forever. Write `if (n <= 0)` instead. The rule: the base case must catch **every** way of arriving there, not just the tidy one.',
      },
      {
        kind: 'code',
        caption: 'The bug, and the fix',
        code: `// BROKEN for odd n — jumps straight past 0 to -1, -3, -5...
int f(int n) {
    if (n == 0) return 1;
    return f(n - 2);
}

// FIXED
int f(int n) {
    if (n <= 0) return 1;
    return f(n - 2);
}`,
      },
      { kind: 'heading', text: 'Some methods need two base cases' },
      {
        kind: 'code',
        code: `int fib(int n) {
    if (n == 0) return 0;        // both are needed: the recursive case
    if (n == 1) return 1;        // reaches back TWO steps
    return fib(n - 1) + fib(n - 2);
}`,
      },
      {
        kind: 'text',
        body: 'The rule follows from the recursive case. `fib` looks back two steps, so it needs two starting values — with only `fib(0)` defined, `fib(2)` would call `fib(0)` and `fib(1)`, and the second one would recurse forever.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'A base case that returns the wrong value is worse than a crash',
        body: 'A missing base case fails loudly with a stack overflow. A base case returning `0` where it should return `1` — as in `power(x, 0)` — produces a confidently wrong answer with no error at all. Check the value, not just that the case exists.',
      },
    ],
    keyTakeaways: [
      'The base case is the input you can answer with no further calls.',
      'Prefer `<=` over `==` so no input can jump past it.',
      'Look back two steps in the recursive case → you need two base cases.',
      'A wrong base-case *value* fails silently; check it, do not just write it.',
    ],
    practice: {
      prompt: 'Write `power(base, exp)` and deliberately give the base case `return 0`. Run it, watch every answer come out as 0, then fix it to `return 1`. Seeing a wrong base case propagate is worth more than reading about it.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-7.3',
    language: 'java',
    summary: 'Write the recursive step so the problem genuinely shrinks toward the base case.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'The recursive case is where the work happens, and it always has the same two halves: **make the problem smaller**, and **combine that answer with your own contribution**. If you can name those two halves before writing code, the code writes itself.',
      },
      {
        kind: 'code',
        caption: 'The two halves, made explicit',
        code: `int sum(int[] nums, int i) {
    if (i == nums.length) return 0;      // base case

    int rest = sum(nums, i + 1);         // 1. SMALLER problem
    return nums[i] + rest;               // 2. COMBINE with my element
}`,
      },
      {
        kind: 'text',
        body: 'The "combine" step is what varies between problems. Adding gives you a sum; taking `Math.max` gives you a maximum; `&&` gives you "is every element valid?". The skeleton never changes.',
      },
      {
        kind: 'table',
        headers: ['Problem', 'Combine step'],
        rows: [
          ['Sum of an array', '`nums[i] + rest`'],
          ['Maximum of an array', '`Math.max(nums[i], rest)`'],
          ['Are all elements even?', '`nums[i] % 2 == 0 && rest`'],
          ['Count of a value', '`(nums[i] == target ? 1 : 0) + rest`'],
          ['Reverse a string', '`rest + s.charAt(0)`'],
        ],
      },
      { kind: 'heading', text: 'Shrinking is not always subtraction' },
      {
        kind: 'code',
        code: `// Move an index forward — the array itself never changes
solve(nums, i + 1);

// Walk down a tree — the subtree IS the smaller problem
solve(root.left);

// Halve the search space
solve(lo, mid - 1);

// Take a substring — correct, but O(n) per call. Prefer an index.
solve(s.substring(1));`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Pass an index rather than slicing',
        body: '`s.substring(1)` copies the whole remaining string on every call, turning an O(n) recursion into O(n²). Passing `i + 1` into the same string costs nothing. This is the standard way recursive string problems are written in Java.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Forgetting to return the recursive call',
        body: 'Writing `sum(nums, i + 1);` on its own line calls the method and throws the answer away. The compiler will not complain — it is a valid statement. You almost always want `return` in front of it, or to store it in a variable as the example above does.',
      },
    ],
    keyTakeaways: [
      'The recursive case = make it smaller, then combine with your own contribution.',
      'Only the combine step differs between problems; the skeleton is fixed.',
      'Shrink with an index, a subtree, or a halved range — not by copying data.',
      'A recursive call whose result you do not use or return is a silent bug.',
    ],
    practice: {
      prompt: 'Write `max(int[] nums, int i)` recursively. Then change only the combine line to turn it into `countEvens`. Doing the same skeleton twice is what makes it automatic.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-7.4',
    language: 'java',
    summary: 'See what the JVM is actually doing, so recursion stops feeling like magic.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Every method call gets its own **stack frame** — a small block of memory holding that call\'s parameters and local variables. Calls stack up as you go deeper, and unwind as each one returns. Once you can picture that stack, recursion stops being mysterious and becomes ordinary.',
      },
      {
        kind: 'code',
        caption: 'sum(3), traced',
        code: `sum(3)  ->  3 + sum(2)          <- frame 1 waits here
              2 + sum(1)        <- frame 2 waits here
                  1 + sum(0)    <- frame 3 waits here
                      0         <- frame 4 returns immediately

then everything unwinds, bottom up:
  sum(1) = 1 + 0 = 1
  sum(2) = 2 + 1 = 3
  sum(3) = 3 + 3 = 6`,
        output: '6',
      },
      {
        kind: 'text',
        body: 'The important detail: each frame has its **own** copy of `n`. Frame 1\'s `n` is 3 while frame 3\'s `n` is 1, at the same moment. They do not interfere, which is exactly why recursion works at all.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Work happens on the way down or on the way back up',
        body: 'Code **before** the recursive call runs top-down, deepest last — that is how preorder tree traversal works. Code **after** it runs bottom-up, deepest first — that is postorder. Choosing which side of the call to put your work on is a real design decision.',
      },
      {
        kind: 'code',
        caption: 'Same call, opposite orders',
        code: `void countDown(int n) {
    if (n == 0) return;
    System.out.print(n + " ");     // BEFORE -> 3 2 1
    countDown(n - 1);
}

void countUp(int n) {
    if (n == 0) return;
    countUp(n - 1);
    System.out.print(n + " ");     // AFTER  -> 1 2 3
}`,
        output: '3 2 1\n1 2 3',
      },
      { kind: 'heading', text: 'The stack has a limit' },
      {
        kind: 'text',
        body: 'Stack space is finite. The JVM default allows roughly 10,000–20,000 frames, so recursion depth beyond that throws `StackOverflowError`. For balanced trees this is a non-issue — a tree with a million nodes is only about 20 levels deep. It bites on **linked lists and degenerate trees**, where depth equals n.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: '`StackOverflowError` means one of two things',
        body: 'Either your base case is never reached (a genuine bug — check that the input shrinks on every path), or your input is legitimately too deep for the stack. The first is far more common. If it really is depth, rewrite the traversal iteratively with an explicit `Deque` as the stack.',
      },
    ],
    keyTakeaways: [
      'Each call gets its own frame with its own copy of the parameters.',
      'Code before the recursive call runs top-down; code after runs bottom-up.',
      'Depth is limited to roughly 10,000–20,000 frames in Java.',
      '`StackOverflowError` usually means a broken base case, not a deep input.',
    ],
    practice: {
      prompt: 'Write `countDown` and `countUp` above and run both. Then add `System.out.println("entering " + n)` at the top and `"leaving " + n` at the bottom of one method — the printed order is the call stack, made visible.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-7.5',
    language: 'java',
    summary: 'Apply recursion to arrays using an index, the pattern every array recursion uses.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Arrays have a fixed size, so "a smaller array" is not something you can cheaply make in Java. Instead you keep the same array and move an **index** — the index is what shrinks, and `i == nums.length` becomes your base case. Every array recursion you write will use this shape.',
      },
      {
        kind: 'code',
        caption: 'The standard array recursion',
        code: `int sum(int[] nums, int i) {
    if (i == nums.length) return 0;      // walked off the end
    return nums[i] + sum(nums, i + 1);   // my element + the rest
}

// Callers should not have to know about the index:
int sum(int[] nums) {
    return sum(nums, 0);                 // public wrapper
}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Wrap the helper so the caller sees a clean signature',
        body: 'LeetCode gives you `int sum(int[] nums)` — no index. Overloading lets you keep that signature and hide the recursive helper behind it. This wrapper-plus-helper pair is the most common shape in recursive Java solutions, and interviewers expect it.',
      },
      { kind: 'heading', text: 'Two ends instead of one' },
      {
        kind: 'code',
        caption: 'Palindrome check, recursively',
        code: `boolean isPalindrome(char[] c, int lo, int hi) {
    if (lo >= hi) return true;                  // met in the middle -> done
    if (c[lo] != c[hi]) return false;           // mismatch -> definitely not

    return isPalindrome(c, lo + 1, hi - 1);     // shrink from BOTH ends
}`,
      },
      {
        kind: 'text',
        body: 'Here two indices move toward each other, so the base case is `lo >= hi` rather than a length check. Use `>=` rather than `==` — with an even-length array the pointers cross without ever being equal.',
      },
      { kind: 'heading', text: 'Divide and conquer' },
      {
        kind: 'code',
        caption: 'Splitting in half instead of peeling one element',
        code: `int max(int[] nums, int lo, int hi) {
    if (lo == hi) return nums[lo];              // one element left

    int mid = lo + (hi - lo) / 2;
    int leftMax  = max(nums, lo, mid);          // solve both halves
    int rightMax = max(nums, mid + 1, hi);

    return Math.max(leftMax, rightMax);         // combine
}`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Recursion on arrays is rarely the fastest option',
        body: 'A loop does the same job with no stack frames. Learn these because the *shape* transfers directly to trees and graphs, where recursion genuinely wins — not because you should recurse over arrays in real solutions.',
      },
    ],
    keyTakeaways: [
      'Move an index rather than copying the array — `i == nums.length` is the base case.',
      'Hide the index behind an overloaded public wrapper.',
      'Two-ended recursion uses `lo >= hi`, because pointers can cross without meeting.',
      'The value here is the shape, which transfers to trees and graphs.',
    ],
    practice: {
      prompt: 'Write a recursive `contains(int[] nums, int target)` with a public wrapper. Then write `reverse(int[] nums)` recursively using the two-ended form — swap `lo` and `hi`, then recurse inward.',
      leetcode: { title: 'Reverse String', slug: 'reverse-string' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-7.6',
    language: 'java',
    summary: 'Recurse over strings without accidentally writing an O(n²) solution.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'String recursion works exactly like array recursion, with one performance trap on top. Because Java strings are immutable, `substring` **copies**, so the obvious recursive style quietly costs O(n) per call. The fix is the same as for arrays: pass an index.',
      },
      {
        kind: 'code',
        caption: 'The clean version and the costly one',
        code: `// COSTLY: substring copies -> O(n) per call -> O(n^2) total
String reverse(String s) {
    if (s.isEmpty()) return "";
    return reverse(s.substring(1)) + s.charAt(0);
}

// CLEAN: index moves, nothing is copied -> O(n)
void reverse(char[] c, int lo, int hi) {
    if (lo >= hi) return;
    char t = c[lo]; c[lo] = c[hi]; c[hi] = t;    // swap
    reverse(c, lo + 1, hi - 1);
}`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Building a String by `+` inside recursion is O(n²) twice over',
        body: 'Every `+` on strings allocates a new one, and doing it at every level of a recursion compounds. When you are assembling a result, pass a `StringBuilder` down through the calls and append to it — one object, no copying.',
      },
      { kind: 'heading', text: 'The index-based skeleton' },
      {
        kind: 'code',
        code: `boolean isPalindrome(String s, int lo, int hi) {
    if (lo >= hi) return true;
    if (s.charAt(lo) != s.charAt(hi)) return false;
    return isPalindrome(s, lo + 1, hi - 1);
}

int countChar(String s, char target, int i) {
    if (i == s.length()) return 0;
    int rest = countChar(s, target, i + 1);
    return (s.charAt(i) == target ? 1 : 0) + rest;
}`,
      },
      { kind: 'heading', text: 'Where string recursion genuinely pays off' },
      {
        kind: 'text',
        body: 'Generating things. Subsets of characters, all permutations of a word, every valid parenthesis arrangement — these are naturally recursive and painful to write as loops. That is the backtracking family, and it is what the next lessons build toward.',
      },
      {
        kind: 'code',
        caption: 'Every subsequence of a string',
        code: `void subsequences(String s, int i, StringBuilder cur, List<String> res) {
    if (i == s.length()) { res.add(cur.toString()); return; }

    cur.append(s.charAt(i));            // choice 1: take this character
    subsequences(s, i + 1, cur, res);
    cur.deleteCharAt(cur.length() - 1); // UNDO

    subsequences(s, i + 1, cur, res);   // choice 2: skip it
}`,
      },
    ],
    keyTakeaways: [
      '`substring` copies — pass an index instead to stay O(n).',
      'Use a shared `StringBuilder` rather than `+` when assembling results.',
      'Two-ended string recursion mirrors the array form exactly.',
      'Generation problems (subsets, permutations) are where it genuinely wins.',
    ],
    practice: {
      prompt: 'Write a recursive `isPalindrome(String s)` with a wrapper. Then run the subsequence generator on `"abc"` and check you get all 8 results — including the empty string.',
      leetcode: { title: 'Valid Palindrome', slug: 'valid-palindrome' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-7.7',
    language: 'java',
    summary: 'Use recursion on linked lists, where the structure is already recursive.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'A linked list is recursive by definition: a node, followed by a linked list. That makes `head == null` the natural base case and `head.next` the natural smaller problem — no index bookkeeping at all. Many list problems are three lines recursively and ten iteratively.',
      },
      {
        kind: 'code',
        caption: 'The node class LeetCode gives you',
        code: `class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
}`,
      },
      {
        kind: 'code',
        caption: 'The standard shape',
        code: `int length(ListNode head) {
    if (head == null) return 0;              // base case
    return 1 + length(head.next);            // me + the rest
}

int sum(ListNode head) {
    if (head == null) return 0;
    return head.val + sum(head.next);
}`,
      },
      { kind: 'heading', text: 'Reversing a list — the one worth studying' },
      {
        kind: 'code',
        code: `ListNode reverse(ListNode head) {
    // base: empty list, or a single node — already reversed
    if (head == null || head.next == null) return head;

    ListNode newHead = reverse(head.next);   // trust: rest is now reversed

    head.next.next = head;                   // the node behind me now points BACK to me
    head.next = null;                        // and I become the new tail

    return newHead;                          // the head never changes as we unwind
}`,
      },
      {
        kind: 'text',
        body: 'The trick is `head.next.next = head`. After the recursive call, `head.next` is the **tail** of the reversed portion — so pointing its `next` back at `head` appends `head` to the end. Setting `head.next = null` then stops the list looping back on itself.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Forgetting `head.next = null` creates a cycle',
        body: 'Without it, two adjacent nodes point at each other and any later traversal loops forever. The symptom is a hang or a timeout rather than an exception, which makes it hard to spot — if a reversed list never terminates, this line is missing.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Recursion on a long list overflows the stack',
        body: 'Depth equals the number of nodes, so a 100,000-node list will throw `StackOverflowError`. The iterative reversal with three pointers uses O(1) space and no stack — know both, and prefer the iterative one when the constraints are large.',
      },
      {
        kind: 'code',
        caption: 'The iterative equivalent, for comparison',
        code: `ListNode reverse(ListNode head) {
    ListNode prev = null, cur = head;

    while (cur != null) {
        ListNode nextTemp = cur.next;   // save before we overwrite
        cur.next = prev;                // flip the arrow
        prev = cur;                     // shuffle both forward
        cur = nextTemp;
    }
    return prev;
}`,
      },
    ],
    keyTakeaways: [
      'A list is a node plus a list — `head == null` is the base case.',
      '`head.next.next = head` is what re-points the arrow during reversal.',
      'Always null out `head.next`, or you create a two-node cycle.',
      'Recursion depth equals list length — prefer iteration for large inputs.',
    ],
    practice: {
      prompt: 'Write recursive `length` and `sum`, then reverse a list recursively and print it to confirm. Finally write the iterative reversal from memory — it appears in interviews constantly.',
      leetcode: { title: 'Reverse Linked List', slug: 'reverse-linked-list' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-7.8',
    language: 'java',
    summary: 'Learn the choose / recurse / un-choose skeleton behind every "find all" problem.',
    readMinutes: 6,
    blocks: [
      {
        kind: 'text',
        body: 'Backtracking is recursion that **explores options and undoes them**. Whenever a problem says "find *all* subsets / permutations / paths / ways", this is the technique — and it is the same three lines every single time.',
      },
      {
        kind: 'code',
        caption: 'The skeleton. Memorise this shape.',
        code: `void backtrack(/* state */) {
    if (/* solution complete */) {
        res.add(new ArrayList<>(path));    // COPY, not the reference
        return;
    }

    for (/* each option */) {
        path.add(option);        // 1. CHOOSE
        backtrack(/* smaller */);// 2. RECURSE
        path.remove(path.size() - 1);   // 3. UN-CHOOSE
    }
}`,
      },
      {
        kind: 'text',
        body: 'Step 3 is the one people forget, and it is what makes this *backtracking* rather than plain recursion. Because `path` is shared across every branch, you must remove what you added before trying the next option — otherwise the choices from one branch leak into the next.',
      },
      {
        kind: 'code',
        caption: 'All subsets, in full',
        code: `List<List<Integer>> res = new ArrayList<>();
List<Integer> path = new ArrayList<>();

void backtrack(int start, int[] nums) {
    res.add(new ArrayList<>(path));        // every node is a valid subset

    for (int i = start; i < nums.length; i++) {
        path.add(nums[i]);                 // CHOOSE
        backtrack(i + 1, nums);            // RECURSE — i+1 means no reuse
        path.remove(path.size() - 1);      // UN-CHOOSE
    }
}`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: '`res.add(path)` stores a reference, not a snapshot',
        body: 'Java lists are objects. Adding `path` directly puts the *same* list into `res` every time, and since you keep mutating it, every entry ends up identical — usually empty. Always `new ArrayList<>(path)`. This is the number one backtracking bug in Java.',
      },
      { kind: 'heading', text: 'Subsets vs combinations vs permutations' },
      {
        kind: 'table',
        headers: ['Problem', 'Loop starts at', 'Why'],
        rows: [
          ['Subsets', '`start`', 'Each element considered once; order irrelevant'],
          ['Combinations', '`start`', 'Same, but only records at a target size'],
          ['Combination Sum (reuse allowed)', '`i`', 'Passing `i` rather than `i + 1` lets an element repeat'],
          ['Permutations', '`0`, skipping used', 'Order matters, so every unused element is a candidate'],
        ],
      },
      {
        kind: 'code',
        caption: 'Permutations — the only real difference is the loop',
        code: `void backtrack(int[] nums, boolean[] used) {
    if (path.size() == nums.length) { res.add(new ArrayList<>(path)); return; }

    for (int i = 0; i < nums.length; i++) {     // from 0, not from start
        if (used[i]) continue;

        used[i] = true;  path.add(nums[i]);     // CHOOSE (both)
        backtrack(nums, used);
        used[i] = false; path.remove(path.size() - 1);   // UN-CHOOSE (both)
    }
}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Every mutation before the call needs a matching undo after it',
        body: 'If you set `used[i] = true` and add to `path`, you must reverse **both**. Treating them as a pair — two lines up, two lines down, symmetric around the recursive call — makes the mistake visible on sight.',
      },
    ],
    keyTakeaways: [
      'Choose → recurse → un-choose. The undo is what makes it backtracking.',
      'Copy the path when recording: `new ArrayList<>(path)`.',
      'Subsets/combinations pass `i + 1`; permutations loop from 0 with a `used[]`.',
      'Every mutation before the recursive call needs a matching undo after it.',
    ],
    practice: {
      prompt: 'Write Subsets with the template. Then delete the un-choose line and run it — seeing the results grow into nonsense teaches the purpose of that line better than any explanation.',
      leetcode: { title: 'Subsets', slug: 'subsets' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-7.9',
    language: 'java',
    summary: 'Recognise the recursion bugs that cause nearly every failure.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Recursion goes wrong in a small number of predictable ways. Once you can name them, you stop losing afternoons — most "my recursion is broken" moments are one of the seven below.',
      },
      { kind: 'heading', text: '1. Missing or unreachable base case' },
      {
        kind: 'code',
        code: `int f(int n) {
    return n + f(n - 1);          // no base case -> StackOverflowError
}

int g(int n) {
    if (n == 0) return 0;
    return g(n - 2);              // odd n skips 0 -> use n <= 0
}`,
      },
      { kind: 'heading', text: '2. Not returning the recursive call' },
      {
        kind: 'code',
        code: `int sum(int[] a, int i) {
    if (i == a.length) return 0;
    sum(a, i + 1);                // BUG: result thrown away
    return a[i];                  // only ever returns one element
}`,
      },
      { kind: 'heading', text: '3. Forgetting to undo in backtracking' },
      {
        kind: 'code',
        code: `path.add(nums[i]);
backtrack(i + 1, nums);
// missing path.remove(...) -> path grows forever, results are garbage`,
      },
      { kind: 'heading', text: '4. Storing a reference instead of a copy' },
      {
        kind: 'code',
        code: `res.add(path);                    // BUG: every entry is the SAME list
res.add(new ArrayList<>(path));   // correct`,
      },
      { kind: 'heading', text: '5. Recomputing the same subproblem' },
      {
        kind: 'code',
        code: `int fib(int n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);      // O(2^n) — fib(40) takes ~a second,
}                                        // fib(50) takes ~15 minutes

// Fix: memoise
int fib(int n, Integer[] memo) {
    if (n <= 1) return n;
    if (memo[n] != null) return memo[n];
    return memo[n] = fib(n - 1, memo) + fib(n - 2, memo);   // now O(n)
}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Memoisation is the bridge to dynamic programming',
        body: 'If a recursion recomputes subproblems, caching the answers is usually the entire optimisation. Use `Integer[]` rather than `int[]` so `null` can mean "not computed yet" — with `int[]`, a legitimate answer of 0 is indistinguishable from an empty cell.',
      },
      { kind: 'heading', text: '6. Shared mutable state across branches' },
      {
        kind: 'text',
        body: 'A field or an array passed by reference is visible to *every* recursive branch. That is exactly what you want for `visited` in a graph search, and exactly what you do not want for a per-path counter. Ask yourself for each variable: should siblings see this?',
      },
      { kind: 'heading', text: '7. Modifying a collection while recursing over it' },
      {
        kind: 'callout',
        tone: 'trap',
        title: '`ConcurrentModificationException`',
        body: 'Adding to or removing from a `List` while a for-each loop over it is still running throws at runtime. If a recursive method must modify a shared collection, iterate over an index or over a copy.',
      },
    ],
    keyTakeaways: [
      'Most failures are: no base case, no `return`, or no undo.',
      '`res.add(path)` stores a reference — copy it.',
      'Exponential recursion usually just needs memoisation.',
      'Decide deliberately whether each variable is shared across branches.',
    ],
    practice: {
      prompt: 'Write naive `fib(40)` and time it. Add memoisation and time it again. The gap — seconds to microseconds — is the most persuasive argument for DP you will ever see.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-7.10',
    language: 'java',
    summary: 'Work out the time and space cost of a recursive method.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Recursive complexity looks intimidating but reduces to two questions: **how many calls happen in total**, and **how deep does the stack get**. The first gives you time, the second gives you space.',
      },
      { kind: 'heading', text: 'Time: count the calls' },
      {
        kind: 'table',
        headers: ['Shape', 'Calls', 'Time', 'Example'],
        rows: [
          ['One call, shrink by 1', 'n', 'O(n)', 'Array sum, list length'],
          ['One call, halve the input', 'log n', 'O(log n)', 'Binary search'],
          ['Two calls, shrink by 1', '2ⁿ', 'O(2ⁿ)', 'Naive fibonacci, subsets'],
          ['Two calls, halve the input', 'n', 'O(n log n)', 'Merge sort'],
          ['n calls, shrink by 1', 'n!', 'O(n!)', 'Permutations'],
        ],
      },
      {
        kind: 'text',
        body: 'The pattern to notice: **branching is what makes recursion expensive, not depth**. One recursive call per level is linear no matter how deep. Two calls per level doubles the work at every step, which is where the exponentials come from.',
      },
      { kind: 'heading', text: 'Space: measure the deepest single path' },
      {
        kind: 'text',
        body: 'Stack space is *not* the total number of calls — it is the maximum number alive **at the same moment**. Naive fibonacci makes 2ⁿ calls but only ever holds n frames, because one branch fully completes before the next begins. So `fib` is O(2ⁿ) time and O(n) space.',
      },
      {
        kind: 'code',
        caption: 'Same depth, very different totals',
        code: `// O(n) time, O(n) stack
int sum(int[] a, int i) {
    if (i == a.length) return 0;
    return a[i] + sum(a, i + 1);
}

// O(2^n) time, O(n) stack — branching costs time, not space
int fib(int n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}

// O(n) time, O(log n) stack for a BALANCED tree
int height(TreeNode root) {
    if (root == null) return 0;
    return 1 + Math.max(height(root.left), height(root.right));
}`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Tree recursion is O(h), and h can be n',
        body: 'A balanced tree of a million nodes is about 20 deep — fine. A **degenerate** tree (every node has one child) is a linked list, so h = n and the stack overflows. When a problem says the tree may be skewed, that is a hint the recursive solution needs care.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Backtracking cost = number of results × cost to build each',
        body: 'Subsets produces 2ⁿ results, each up to n long, so it is O(n · 2ⁿ) — the copy into the result list is not free. Permutations is O(n · n!). These are unavoidable when the problem asks you to *list* everything; the output itself is that big.',
      },
      {
        kind: 'table',
        headers: ['n', 'O(2ⁿ)', 'Feasible?'],
        rows: [
          ['20', '~1 million', 'Yes, instant'],
          ['30', '~1 billion', 'Borderline — seconds'],
          ['40', '~1 trillion', 'No'],
        ],
      },
      {
        kind: 'text',
        body: 'This table is a practical constraint-reading tool. If n ≤ 20 the problem is quietly telling you an exponential solution is expected. If n is 10⁵, it is telling you to find something linear.',
      },
    ],
    keyTakeaways: [
      'Time = number of calls; space = deepest single path.',
      'Branching drives time cost; depth drives space cost.',
      'Balanced tree recursion is O(log n) stack; a skewed tree is O(n).',
      'n ≤ 20 in the constraints is a hint that exponential is acceptable.',
    ],
    practice: {
      prompt: 'For each method you wrote in this chapter, state its time and space complexity out loud before checking. Then look at three LeetCode problems and predict the intended complexity from the constraints alone.',
    },
  },
];
