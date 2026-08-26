import type { Lesson } from '../types';

/**
 * Chapter 3 — Control Flow.
 * Branching and looping, ending with the loop shapes that recur across the
 * whole 90-day plan.
 */
export const ch03: Lesson[] = [
  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-3.1',
    language: 'cpp',
    summary: 'Branch on conditions cleanly, and order your cases so the logic stays readable.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'An `if` runs a block only when a condition is true. That much you already understand. What separates readable code from a tangle is **ordering** — arranging the cases so each one only has to handle what the branches above it did not already catch.',
      },
      {
        kind: 'code',
        caption: 'The full form',
        code: `if (score >= 90) {
    grade = 'A';
} else if (score >= 80) {
    grade = 'B';
} else if (score >= 70) {
    grade = 'C';
} else {
    grade = 'F';
}`,
      },
      {
        kind: 'text',
        body: 'Conditions are checked top to bottom and **the first true branch wins** — everything after it is skipped. That is why the example above does not need upper bounds: by the time you reach `score >= 80`, you already know the score is below 90.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Order matters — a wrong order silently swallows cases',
        body: 'If you put `score >= 70` first, then every score of 95 also matches it and gets a C. Nothing errors; the answers are just wrong. When your branches are ranges, always order them from most restrictive to least.',
      },
      { kind: 'heading', text: 'Always use braces' },
      {
        kind: 'code',
        code: `// Legal but fragile — only the next single statement is inside the if
if (found)
    cout << "yes";
    count++;            // runs ALWAYS, despite the indentation

// Safe
if (found) {
    cout << "yes";
    count++;
}`,
      },
      {
        kind: 'text',
        body: 'The braceless form is legal C++ and reads fine until someone adds a second line. This exact pattern caused a well-known TLS security bug ("goto fail") in 2014. Brace everything.',
      },
      { kind: 'heading', text: 'The ternary operator' },
      {
        kind: 'code',
        code: `int maxVal = (a > b) ? a : b;      // condition ? value_if_true : value_if_false

// equivalent to:
int maxVal;
if (a > b) maxVal = a;
else maxVal = b;`,
      },
      {
        kind: 'text',
        body: 'Use the ternary when you are *choosing a value*. Do not use it for side effects, and do not nest it more than one level — a chain of nested ternaries is unreadable, and readability is what an interviewer is grading.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Guard clauses beat deep nesting',
        body: 'Handle the edge cases first and return early, so the main logic stays at one indent level. Instead of wrapping everything in `if (node != nullptr) { ... }`, write `if (node == nullptr) return 0;` and continue. Recursive solutions read far better this way.',
      },
      {
        kind: 'code',
        caption: 'Guard clause vs nesting',
        code: `// Nested — the real work drifts rightwards
int depth(TreeNode* root) {
    if (root != nullptr) {
        return 1 + max(depth(root->left), depth(root->right));
    } else {
        return 0;
    }
}

// Guard clause — base case out of the way, logic stays flat
int depth(TreeNode* root) {
    if (root == nullptr) return 0;
    return 1 + max(depth(root->left), depth(root->right));
}`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'if (x) means if (x != 0)',
        body: 'Any non-zero value is true, so `if (count)` runs whenever `count` is not zero — including negative counts. It is idiomatic for pointers (`if (node)`), but be deliberate: `if (n)` and `if (n > 0)` differ for negative numbers.',
      },
    ],
    keyTakeaways: [
      'The first true branch wins; order range checks from most to least restrictive.',
      'Always brace `if` bodies — indentation does not group statements.',
      'Use the ternary to pick a value, not to run side effects.',
      'Guard clauses (early return) keep recursive code flat and readable.',
    ],
    practice: {
      prompt: 'Write FizzBuzz. The trick is ordering: check divisibility by 15 *before* 3 and 5, or the 15 case never fires. Then rewrite a nested `if/else` function using guard clauses and compare how the two read.',
      leetcode: { title: 'Fizz Buzz', slug: 'fizz-buzz' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-3.2',
    language: 'cpp',
    summary: 'Handle multi-condition logic without drowning in indentation.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'A nested condition is an `if` inside another `if`. Sometimes necessary, often a sign the logic can be flattened.',
      },
      {
        kind: 'code',
        caption: 'The same check, three ways',
        code: `// Nested
if (r >= 0) {
    if (r < rows) {
        if (grid[r][c] == 1) { ... }
    }
}

// Flattened with && — short-circuiting makes this safe
if (r >= 0 && r < rows && grid[r][c] == 1) { ... }

// Guard clause — best when the function can return early
if (r < 0 || r >= rows) return;
if (grid[r][c] != 1) return;
// main logic here, at one indent level`,
      },
      {
        kind: 'text',
        body: 'The flattened `&&` version is safe precisely because of short-circuiting: if `r` is out of range, `grid[r][c]` is never evaluated. Without that guarantee you would be forced into the nested form.',
      },
      { kind: 'heading', text: 'When nesting is genuinely right' },
      {
        kind: 'text',
        body: 'Nest when the inner decision only makes sense given the outer one, and each level has its own `else`.',
      },
      {
        kind: 'code',
        code: `if (node != nullptr) {
    if (target < node->val) {
        node = node->left;
    } else {
        node = node->right;
    }
} else {
    return false;      // the outer condition has its own alternative
}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Three levels is the warning sign',
        body: 'Past three levels of indentation, extract a helper function or invert the conditions into guard clauses. Deeply nested code is where off-by-one and missing-else bugs hide, because you can no longer see which branch you are in.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'The dangling else',
        body: 'Without braces, an `else` binds to the **nearest** unmatched `if`, not the one your indentation suggests. In `if (a) if (b) x(); else y();` the `else` belongs to `if (b)`, not `if (a)`. Braces remove the ambiguity entirely — another reason to always use them.',
      },
      {
        kind: 'code',
        caption: 'The grid-bounds helper worth writing once',
        code: `bool inBounds(int r, int c, int rows, int cols) {
    return r >= 0 && r < rows && c >= 0 && c < cols;
}

// Now every grid traversal reads cleanly:
if (inBounds(nr, nc, rows, cols) && grid[nr][nc] == 1) { ... }`,
      },
      {
        kind: 'text',
        body: 'You will write that bounds check in every DFS, BFS and flood-fill problem. Pulling it into a named helper removes four conditions from every call site.',
      },
    ],
    keyTakeaways: [
      'Flatten nested `if`s with `&&` — short-circuiting keeps the guard safe.',
      'Guard clauses with early returns beat nesting when a function can bail out.',
      'More than three indent levels means extract a helper or invert the logic.',
      'Without braces, `else` binds to the nearest `if`, not the one you indented it under.',
    ],
    practice: {
      prompt: 'Write `inBounds(r, c, rows, cols)` and use it to count how many cells in a 2D grid equal 1, checking all four neighbours of each. Getting this helper into your muscle memory now pays off through every graph and matrix problem later.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-3.3',
    language: 'cpp',
    summary: 'Use switch for multi-way branching on a single value — and never forget break.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'When you are comparing **one variable** against a list of fixed values, a chain of `else if` works but reads badly. `switch` says the same thing more directly. It also carries one notorious hazard — fall-through — which is the reason `break` appears at the end of every case.',
      },
      {
        kind: 'code',
        caption: 'Basic switch',
        code: `switch (op) {
    case '+':
        result = a + b;
        break;
    case '-':
        result = a - b;
        break;
    case '*':
        result = a * b;
        break;
    default:
        result = 0;
}`,
      },
      {
        kind: 'text',
        body: '`switch` compares one value against a list of constant cases. It only works on integral types — `int`, `char`, `enum`, `bool`. You cannot switch on a `string` or a `double`.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Missing break causes fall-through',
        body: 'Without `break`, execution continues into the *next* case, ignoring its label. So a missing `break` in the `+` case above would compute `a + b` and then immediately overwrite it with `a - b`. This is the defining bug of `switch` statements, and the compiler does not warn by default.',
      },
      { kind: 'heading', text: 'Deliberate fall-through is useful' },
      {
        kind: 'code',
        code: `switch (c) {
    case 'a':
    case 'e':
    case 'i':
    case 'o':
    case 'u':
        isVowel = true;     // all five labels share this body
        break;
    default:
        isVowel = false;
}`,
      },
      {
        kind: 'text',
        body: 'Stacking labels with no code between them is the idiomatic way to give several values the same handling.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Declaring a variable inside a case needs braces',
        body: '`case 1: int x = 5; break;` fails to compile, because `x` would be in scope for the later cases without being initialised. Wrap the case body in its own braces — `case 1: { int x = 5; break; }` — to give it a proper scope.',
      },
      { kind: 'heading', text: 'switch or if/else?' },
      {
        kind: 'table',
        headers: ['Use `switch` when', 'Use `if/else` when'],
        rows: [
          ['Comparing one value to several constants', 'Testing ranges (`score >= 90`)'],
          ['The cases are `int`, `char` or `enum`', 'Comparing strings or doubles'],
          ['There are four or more cases', 'Conditions involve `&&` / `||`'],
        ],
      },
      {
        kind: 'text',
        body: 'In DSA, `switch` shows up mainly in calculator and expression-parsing problems, and in state machines. Most solution logic involves ranges or compound conditions, so `if/else` dominates — but knowing `switch` keeps operator-dispatch code tidy.',
      },
    ],
    keyTakeaways: [
      '`switch` only works on integral types — not strings, not doubles.',
      'Every case needs `break`, or execution falls through into the next one.',
      'Stacked labels with no body between them deliberately share a handler.',
      'Declaring a variable inside a case requires wrapping that case in braces.',
    ],
    practice: {
      prompt: 'Write a calculator that takes two numbers and an operator char and switches on the operator. Then delete one `break` and trace what the wrong answer tells you about fall-through — recognising that symptom saves real debugging time.',
      leetcode: { title: 'Evaluate Reverse Polish Notation', slug: 'evaluate-reverse-polish-notation' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-3.4',
    language: 'cpp',
    summary: 'Write for loops that iterate exactly the right number of times.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'The `for` loop is the workhorse of DSA — you will write it thousands of times. Its three parts run at different moments (**once** at the start, **before** every pass, **after** every pass), and knowing which is which is what lets you write a loop that stops exactly where you intended rather than one element short or one too far.',
      },
      {
        kind: 'code',
        caption: 'The three parts',
        code: `for (int i = 0; i < n; i++) {
    // body
}
//   ^init      ^condition  ^step

// 1. init      runs once, before anything
// 2. condition checked BEFORE each iteration; false → loop ends
// 3. step      runs AFTER each iteration`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Index loops are half-open by convention',
        body: '`i = 0; i < n` visits exactly `n` elements: indices 0 through n−1. This half-open range — inclusive start, exclusive end — is the convention the whole standard library follows, which is why `v.end()` points one past the last element. Sticking to it eliminates most off-by-one errors.',
      },
      {
        kind: 'code',
        caption: 'The four shapes you will write constantly',
        code: `// Forward
for (int i = 0; i < n; i++) { ... }

// Backward
for (int i = n - 1; i >= 0; i--) { ... }

// Every pair (i, j) with j after i
for (int i = 0; i < n; i++)
    for (int j = i + 1; j < n; j++) { ... }

// 2D grid
for (int r = 0; r < rows; r++)
    for (int c = 0; c < cols; c++) { ... }`,
      },
      { kind: 'heading', text: 'Range-based for: prefer it when you do not need the index' },
      {
        kind: 'code',
        code: `vector<int> nums = {1, 2, 3};

for (int x : nums) sum += x;           // copies each element
for (int& x : nums) x *= 2;            // reference — modifies the vector
for (const int& x : nums) sum += x;    // no copy, read-only

// For strings and big objects the reference form matters:
for (const string& word : words) { ... }   // avoids copying every string`,
      },
      {
        kind: 'text',
        body: 'The range-based form cannot go out of bounds and reads more clearly. Use it whenever the index itself is not needed.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Never modify a container while ranging over it',
        body: 'Calling `push_back` inside a `for (int x : nums)` loop can reallocate the vector\'s storage, leaving the loop walking freed memory. The symptom is garbage values or a crash that appears only for large inputs. Build a separate result vector instead, or loop by index and handle the resizing deliberately.',
      },
      { kind: 'heading', text: 'The signed/unsigned trap, again' },
      {
        kind: 'code',
        code: `// Fine going forward
for (int i = 0; i < nums.size(); i++)

// BROKEN going backward on an empty vector:
for (int i = nums.size() - 1; i >= 0; i--)   // size()-1 wraps to a huge number

// Fixed
for (int i = (int)nums.size() - 1; i >= 0; i--)`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'The empty body typo',
        body: '`for (int i = 0; i < n; i++);` — note the semicolon — is a complete loop with an empty body. The block that follows then runs exactly once. It compiles silently, and the bug is almost invisible on screen.',
      },
    ],
    keyTakeaways: [
      '`i = 0; i < n` visits exactly n elements — the half-open convention.',
      'Use `for (const T& x : c)` to iterate without copying when you do not need the index.',
      'Modifying a container while range-looping over it is undefined behaviour.',
      'Cast `size()` to `int` before subtracting, or a backward loop can wrap.',
    ],
    practice: {
      prompt: 'Print a vector forwards, then backwards, then print every pair `(i, j)` with `j > i`. Run all three on an empty vector too — the backward one will misbehave until you add the cast, which is the fastest way to internalise that trap.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-3.5',
    language: 'cpp',
    summary: 'Loop when you do not know the iteration count in advance.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'Use `for` when you know how many iterations you need. Use `while` when you are looping until some condition changes — traversing a linked list, converging a binary search, extracting digits.',
      },
      {
        kind: 'code',
        code: `while (condition) {
    // body — condition is checked BEFORE each iteration
}`,
      },
      {
        kind: 'code',
        caption: 'The three canonical while loops',
        code: `// 1. Walk a linked list — you do not know its length
while (node != nullptr) {
    sum += node->val;
    node = node->next;
}

// 2. Extract digits
while (n > 0) {
    digits.push_back(n % 10);
    n /= 10;
}

// 3. Binary search
while (low <= high) {
    int mid = low + (high - low) / 2;
    if (nums[mid] == target) return mid;
    if (nums[mid] < target) low = mid + 1;
    else high = mid - 1;
}`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Every while loop needs something that changes',
        body: 'The commonest infinite loop is forgetting to advance: omitting `node = node->next;` or `n /= 10;` leaves the condition permanently true. On LeetCode this shows up as Time Limit Exceeded rather than a hang. Before you leave a `while` loop, point at the line that makes progress toward the exit.',
      },
      { kind: 'heading', text: 'Binary search is where this goes subtly wrong' },
      {
        kind: 'code',
        caption: 'Two mistakes that cause infinite loops',
        code: `// INFINITE — mid never moves past low when high = low + 1
while (low < high) {
    int mid = (low + high) / 2;
    if (check(mid)) high = mid;
    else low = mid;            // BUG: should be mid + 1
}

// Correct
while (low < high) {
    int mid = low + (high - low) / 2;
    if (check(mid)) high = mid;
    else low = mid + 1;
}`,
      },
      {
        kind: 'text',
        body: 'Because integer division rounds down, `mid` equals `low` when the range shrinks to two elements. Assigning `low = mid` then changes nothing and the loop spins forever. Whenever you write a binary search, hand-check the two-element case.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'while (true) with an internal break',
        body: 'When the natural exit point is in the middle of the body rather than the top, `while (true) { ... if (done) break; ... }` is clearer than contorting the condition. Just make sure every path can reach a `break`.',
      },
      {
        kind: 'text',
        body: 'One more difference worth noting: a variable declared in a `for` initialiser disappears when the loop ends, but a variable used by a `while` must be declared before it and stays in scope afterwards — occasionally useful when you need the final value.',
      },
    ],
    keyTakeaways: [
      '`for` for a known count, `while` for "until a condition changes".',
      'Every `while` needs a statement that moves it toward termination.',
      'In binary search, `low = mid` instead of `low = mid + 1` loops forever.',
      'Time Limit Exceeded on simple logic usually means an infinite loop.',
    ],
    practice: {
      prompt: 'Write binary search on a sorted vector with a `while` loop. Test it on a two-element array and on an empty one — those are the inputs where the `mid + 1` bug and the boundary conditions actually show up. Getting binary search exactly right by hand is worth the time; it appears in dozens of problems.',
      leetcode: { title: 'Binary Search', slug: 'binary-search' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-3.6',
    language: 'cpp',
    summary: 'Run a loop body at least once, and know why you will rarely need this.',
    readMinutes: 2,
    blocks: [
      {
        kind: 'text',
        body: 'A `do-while` checks its condition **after** running the body, so the body always executes at least once. It is the rarest of the three loops — worth recognising when you read someone else\'s code, but in DSA you will reach for `for` or `while` almost every time.',
      },
      {
        kind: 'code',
        code: `do {
    // body — always runs at least once
} while (condition);      // note the semicolon`,
      },
      {
        kind: 'text',
        body: 'The only difference from `while` is *when* the condition is checked: at the bottom rather than the top. The body therefore always executes at least once, even if the condition is false from the start.',
      },
      {
        kind: 'code',
        caption: 'The difference in one example',
        code: `int n = 0;

while (n > 0) {  cout << "runs"; }        // prints nothing
do            {  cout << "runs"; } while (n > 0);   // prints once`,
      },
      { kind: 'heading', text: 'Where it genuinely fits' },
      {
        kind: 'code',
        caption: 'Digit extraction, handling n = 0 correctly',
        code: `// while version: for n = 0 this produces NOTHING, but 0 has one digit
while (n > 0) { digits.push_back(n % 10); n /= 10; }

// do-while version: correctly yields a single 0
do {
    digits.push_back(n % 10);
    n /= 10;
} while (n > 0);`,
      },
      {
        kind: 'text',
        body: 'That zero case is a genuine edge case in digit problems, and `do-while` handles it without a special branch. The other classic use is input validation — prompt, read, and repeat while the input is invalid.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'The semicolon is required',
        body: '`do { ... } while (x)` without the trailing semicolon is a compile error, and the message is often confusing because the compiler reads on into the next statement. It is the only loop form that ends with a semicolon.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Honestly — you will barely use this',
        body: 'In DSA, `for` and `while` cover nearly everything, and reviewers find `do-while` harder to scan because the exit condition is at the bottom. Know it so you can read other people\'s code and answer the interview question about the difference. Reach for it only when "at least once" is genuinely part of the requirement.',
      },
    ],
    keyTakeaways: [
      '`do-while` checks its condition at the bottom, so the body always runs once.',
      'It handles the `n = 0` case in digit extraction without a special branch.',
      'It is the only loop that ends with a semicolon.',
      'Rare in practice — `for` and `while` cover almost every DSA loop.',
    ],
    practice: {
      prompt: 'Write digit extraction both ways and run each on `n = 0`. The `while` version silently produces an empty result while `do-while` correctly gives one digit — a small, concrete demonstration of when "at least once" is the right semantics.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-3.7',
    language: 'cpp',
    summary: 'Exit loops and functions early, and know exactly how far each keyword jumps.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'Once you have found what you were looking for, carrying on is wasted work — and on a large input it is the difference between passing and timing out. These three keywords are how you stop, and the only thing to get straight is **how far each one jumps**.',
      },
      {
        kind: 'table',
        headers: ['Keyword', 'What it does'],
        rows: [
          ['`break`', 'Exits the innermost loop or `switch` entirely'],
          ['`continue`', 'Skips the rest of this iteration and starts the next one'],
          ['`return`', 'Exits the whole function immediately, however deeply nested'],
        ],
      },
      {
        kind: 'code',
        caption: 'break — stop as soon as you have the answer',
        code: `int firstEven = -1;
for (int x : nums) {
    if (x % 2 == 0) {
        firstEven = x;
        break;          // no point scanning the rest
    }
}`,
      },
      {
        kind: 'code',
        caption: 'continue — skip the ones you do not care about',
        code: `for (int x : nums) {
    if (x < 0) continue;    // ignore negatives
    sum += x;
}`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'continue in a for loop still runs the step — in a while loop it does not',
        body: 'In `for (int i = 0; i < n; i++)`, a `continue` still executes `i++`, so the loop advances. In a `while` loop the increment is inside the body, and jumping past it means `i` never changes — an instant infinite loop. This is the most common `continue` bug.',
      },
      {
        kind: 'code',
        caption: 'The while-loop continue bug',
        code: `int i = 0;
while (i < n) {
    if (nums[i] < 0) continue;   // INFINITE — i never advances
    sum += nums[i];
    i++;
}

// Fixed — advance before continuing
while (i < n) {
    if (nums[i] < 0) { i++; continue; }
    sum += nums[i];
    i++;
}`,
      },
      { kind: 'heading', text: 'break only escapes one level' },
      {
        kind: 'code',
        code: `// This break exits only the inner loop
for (int i = 0; i < rows; i++) {
    for (int j = 0; j < cols; j++) {
        if (grid[i][j] == target) break;    // outer loop keeps going
    }
}

// To exit both, use a flag or — better — return from a helper function
for (int i = 0; i < rows; i++)
    for (int j = 0; j < cols; j++)
        if (grid[i][j] == target) return {i, j};   // leaves everything at once`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Returning directly is cleaner than a found flag',
        body: 'When a search succeeds, returning the answer from inside the nested loops is clearer than setting `found = true` and breaking out level by level. It is also why extracting a search into its own function often simplifies the control flow.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'goto exists; do not use it',
        body: 'C++ has `goto`, and it is occasionally used to break out of deeply nested loops. Avoid it — a helper function with a `return` achieves the same thing and stays readable. Interviewers will read `goto` as a red flag.',
      },
    ],
    keyTakeaways: [
      '`break` exits one loop level; `continue` skips to the next iteration.',
      '`continue` in a `while` loop skips your increment — an easy infinite loop.',
      '`break` inside nested loops escapes only the inner one.',
      'Returning from inside nested loops is cleaner than flag-and-break.',
    ],
    practice: {
      prompt: 'Write a linear search that `break`s on the first match, then a sum that `continue`s past negatives. Then deliberately write the `while` + `continue` infinite loop and watch it hang — that symptom is worth recognising instantly, since on the judge it appears only as Time Limit Exceeded.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-3.8',
    language: 'cpp',
    summary: 'Recognise the handful of loop shapes that nearly every array problem reduces to.',
    readMinutes: 6,
    blocks: [
      {
        kind: 'text',
        body: 'Most array and string problems are one of a small number of loop shapes. Recognising which one applies is most of solving the problem — this lesson is a preview of Chapter 18, framed as loop structure.',
      },
      { kind: 'heading', text: '1. Single pass — accumulate' },
      {
        kind: 'code',
        code: `int maxSoFar = INT_MIN, sum = 0;
for (int x : nums) {
    sum += x;
    maxSoFar = max(maxSoFar, x);
}`,
      },
      {
        kind: 'text',
        body: 'One variable carrying information forward. Sums, maxima, counts, and running state all fit here. **O(n)**.',
      },
      { kind: 'heading', text: '2. Two pointers from both ends' },
      {
        kind: 'code',
        code: `int left = 0, right = n - 1;
while (left < right) {
    if (nums[left] + nums[right] == target) return {left, right};
    if (nums[left] + nums[right] < target) left++;
    else right--;
}`,
      },
      {
        kind: 'text',
        body: 'Requires a **sorted** array. Each step eliminates one candidate, giving O(n) where brute force would be O(n²). Palindrome checks and reversals use the same shape.',
      },
      { kind: 'heading', text: '3. Fast and slow pointers' },
      {
        kind: 'code',
        code: `ListNode *slow = head, *fast = head;
while (fast != nullptr && fast->next != nullptr) {
    slow = slow->next;
    fast = fast->next->next;
    if (slow == fast) return true;      // cycle detected
}`,
      },
      {
        kind: 'text',
        body: 'Two pointers moving at different speeds. Finds cycles, middles, and nth-from-end in one pass with O(1) extra space. Note the `fast != nullptr && fast->next != nullptr` guard — short-circuiting again.',
      },
      { kind: 'heading', text: '4. Sliding window' },
      {
        kind: 'code',
        code: `int left = 0, sum = 0, best = 0;
for (int right = 0; right < n; right++) {
    sum += nums[right];                 // grow the window
    while (sum > limit) {               // shrink until valid again
        sum -= nums[left];
        left++;
    }
    best = max(best, right - left + 1);
}`,
      },
      {
        kind: 'text',
        body: 'A window that grows on the right and shrinks on the left. Despite the nested `while`, this is **O(n)** — each element enters and leaves the window at most once. Use it for "longest/shortest contiguous subarray with property X".',
      },
      { kind: 'heading', text: '5. Prefix sum' },
      {
        kind: 'code',
        code: `vector<int> prefix(n + 1, 0);
for (int i = 0; i < n; i++) prefix[i + 1] = prefix[i] + nums[i];

// Now any range sum is O(1):
int rangeSum = prefix[j + 1] - prefix[i];   // sum of nums[i..j]`,
      },
      {
        kind: 'text',
        body: 'Pay O(n) once to make every subsequent range query O(1). The `n + 1` sizing with a leading zero removes the special case for ranges starting at index 0.',
      },
      { kind: 'heading', text: '6. Nested loops — all pairs' },
      {
        kind: 'code',
        code: `for (int i = 0; i < n; i++)
    for (int j = i + 1; j < n; j++)
        // each unordered pair exactly once`,
      },
      {
        kind: 'text',
        body: '**O(n²)**. Fine when n ≤ 1000, too slow beyond that. If the constraints allow n = 10⁵, an O(n²) loop will exceed the time limit — that is your signal to reach for a hash map or two pointers instead.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Let the constraints choose the shape',
        body: 'Judges typically allow about 10⁸ simple operations per second. So n ≤ 10⁵ rules out O(n²) and points to O(n) or O(n log n); n ≤ 1000 makes O(n²) fine; n ≤ 20 suggests an exponential approach like subsets or permutations is intended. Reading the constraint first tells you which loop shape to aim for before you write anything.',
      },
      {
        kind: 'table',
        headers: ['Problem sounds like…', 'Reach for'],
        rows: [
          ['"pair summing to target", sorted input', 'Two pointers'],
          ['"longest/shortest contiguous subarray"', 'Sliding window'],
          ['"sum of range i..j", many queries', 'Prefix sum'],
          ['"does the linked list have a cycle"', 'Fast and slow pointers'],
          ['"have I seen this value before"', 'Hash map in a single pass'],
        ],
      },
    ],
    keyTakeaways: [
      'Most array problems are one of: single pass, two pointers, sliding window, or prefix sum.',
      'Sliding window is O(n) despite the inner `while` — each element enters and leaves once.',
      'Two pointers needs sorted input; prefix sums trade O(n) setup for O(1) queries.',
      'Constraints pick the shape: n ≤ 10⁵ rules out O(n²); n ≤ 20 suggests exponential search.',
    ],
    practice: {
      prompt: 'Implement each of the six shapes above once, on small hand-made inputs, without looking at the code here. They are the vocabulary of the next 90 days — the goal is that reading a problem statement makes one of these shapes come to mind before you start typing.',
      leetcode: { title: 'Maximum Subarray', slug: 'maximum-subarray' },
    },
  },
];
