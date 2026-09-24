import type { SharedLesson } from './types';

/**
 * Debugging, Testing and Edge Cases — the habits that separate a student who
 * gets Accepted on the third submission from one who gets it on the first.
 * Nothing here is an algorithm; all of it is what you do when the algorithm
 * you wrote does not behave.
 */
export const lessons: SharedLesson[] = [
  // -------------------------------------------------------------------------
  {
    sub: 1,
    summary: 'Read an error message from the bottom up and turn it into a line number and a cause.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'An error message is not the computer being unhelpful. It is the most precise bug report you will ever receive: it names the file, the line, and usually the exact thing that went wrong. Students skip it because it looks like noise. Learn its shape once and it becomes the first place you look, not the last.',
      },
      {
        kind: 'text',
        body: {
          cpp: 'A compiler error has three parts: **where** (`main.cpp:12:9` means line 12, column 9), **what** (`error: \'vecotr\' was not declared in this scope`), and sometimes **a hint** (`did you mean \'vector\'?`). A long list of errors is usually one real mistake plus its consequences; fix the **first** one and recompile before reading the rest.',
          java: 'A compile error names the file and line: `Main.java:12: error: cannot find symbol`, followed by the offending line with a caret under the problem. A runtime error is a **stack trace**: the exception type and message at the top (`ArrayIndexOutOfBoundsException: Index 5 out of bounds for length 5`), then one `at` line per function call, innermost first. The first `at` line that names **your** file is the one to look at.',
          python: 'A **traceback** lists the chain of calls that led to the error, outermost first, and ends with the exception type and message: `IndexError: list index out of range`. Read it from the **bottom**: the last line says what went wrong, the line above it says where (`File "main.py", line 12, in solve`), and the lines above that say how the program got there.',
        },
      },
      {
        kind: 'code',
        caption: 'A runtime error and how to read it',
        code: {
          cpp: `// A crash in C++ often prints nothing useful:
//   Segmentation fault (core dumped)
// That means an invalid memory access: an index out of range, a null
// pointer, or recursion that ran too deep. Find it by adding prints,
// or compile with -fsanitize=address -g to get a real line number:
//   ERROR: AddressSanitizer: heap-buffer-overflow ... main.cpp:14`,
          java: `Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException:
    Index 5 out of bounds for length 5
    at Main.solve(Main.java:14)      <- your code: look here first
    at Main.main(Main.java:6)
// Line 14 used index 5 on an array of length 5. Valid indices are 0..4.`,
          python: `Traceback (most recent call last):
  File "main.py", line 6, in <module>
    print(solve([1, 2, 3, 4, 5]))
  File "main.py", line 14, in solve      <- innermost: look here first
    return a[i]
IndexError: list index out of range
# Line 14 used an index outside 0..4.`,
        },
      },
      {
        kind: 'table',
        headers: ['Message contains', 'Almost always means'],
        rows: [
          [{ cpp: '`was not declared in this scope`', java: '`cannot find symbol`', python: '`NameError: name \'x\' is not defined`' }, 'Typo in a name, or using it before defining it'],
          [{ cpp: '`expected \';\' before`', java: '`\';\' expected`', python: '`SyntaxError: invalid syntax`' }, 'Missing punctuation on this line or the one above'],
          [{ cpp: '`Segmentation fault`', java: '`ArrayIndexOutOfBoundsException`', python: '`IndexError`' }, 'Index outside the array; check loop bounds'],
          [{ cpp: '`no matching function for call`', java: '`incompatible types`', python: '`TypeError`' }, 'Wrong type passed: string where a number was expected, or similar'],
          [{ cpp: 'Program hangs, then killed', java: '`StackOverflowError`', python: '`RecursionError`' }, 'Recursion with no base case, or too deep'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The line number is where it was noticed, not always where it is',
        body: 'A missing bracket on line 10 is reported on line 11 or later, because that is where the parser realised something was wrong. An index that went bad on line 8 crashes on line 14 where it is finally used. Start at the reported line and read upwards.',
      },
    ],
    keyTakeaways: [
      { cpp: 'Compiler errors: fix the first one, recompile. Crashes: use -fsanitize=address for a line number.', java: 'Read a stack trace top-down: exception and message, then the first `at` line in your own file.', python: 'Read a traceback bottom-up: the last line is the error, the line above is where.' },
      'The reported line is where the problem was noticed; the cause may be earlier.',
      'Most messages map to a small set of causes: typo, missing punctuation, bad index, wrong type, runaway recursion.',
    ],
    practice: {
      prompt: 'Deliberately introduce four bugs into a working program, one at a time: misspell a variable, remove a semicolon or colon, index one past the end of an array, and call a function with a string instead of a number. Run each, read the message, and write down in one sentence what it told you and where it pointed.',
    },
  },
  // -------------------------------------------------------------------------
  {
    sub: 2,
    summary: 'Use print statements to see what the program actually does, without drowning in output.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'A program that gives the wrong answer with no error is telling you nothing. Print statements make it talk. Done carelessly they produce a wall of numbers; done well they answer one question at a time: what is this variable, right here, on this step? Print debugging is not a beginner’s crutch. It is what most professionals reach for first.',
      },
      { kind: 'heading', text: 'Three rules' },
      {
        kind: 'text',
        body: '**Label everything.** `print(x)` produces `7`, and five prints later you do not know which 7 is which. Print the name with the value: `x = 7`. **Print at the decision points.** Not on every line: immediately before an `if`, at the top of each loop iteration, at the start and end of a function. **Print the inputs of the thing that is wrong.** If a function returns nonsense, print what it was given. Half the time the bug is upstream.',
      },
      {
        kind: 'code',
        caption: 'Labelled prints at the top of a loop',
        code: {
          cpp: `for (int i = 0; i < n; i++) {
    cerr << "i=" << i << " total=" << total << " a[i]=" << a[i] << "\\n";
    // ... the real work
}
// cerr goes to the error stream, so it does not mix with the judge's expected output
// (LeetCode ignores stderr; local runs show it)`,
          java: `for (int i = 0; i < n; i++) {
    System.err.println("i=" + i + " total=" + total + " a[i]=" + a[i]);
    // ... the real work
}
// System.err is separate from System.out, so debug lines never corrupt the answer`,
          python: `import sys
for i in range(n):
    print(f"i={i} total={total} a[i]={a[i]}", file=sys.stderr)
    # ... the real work
# Writing to stderr keeps debug output separate from the answer the judge reads`,
        },
      },
      {
        kind: 'text',
        body: 'The debug output for a loop is a trace table, generated for you. Read it the same way: find the first row where a value is not what it should be. The bug is in the code that ran between that row and the previous one.',
      },
      { kind: 'heading', text: 'When output is too much' },
      {
        kind: 'text',
        body: 'For n = 10⁵ the loop prints 10⁵ lines. Print only when a condition holds (`if (i < 5 || i > n - 5)`), or only every thousandth step, or shrink the input to n = 6 first. A bug that shows up at n = 10⁵ almost always shows up at n = 6 too, and six lines of output can be read.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Remove the prints before submitting',
        body: {
          cpp: 'Debug output to `cout` becomes part of your answer and the judge marks it Wrong Answer. Output to `cerr` is safe on LeetCode but still costs time; 10⁵ lines to stderr can cause a Time Limit Exceeded on their own. Delete or comment out before the final run.',
          java: 'Debug output to `System.out` becomes part of your answer and the judge marks it Wrong Answer. `System.err` is safe on LeetCode but still costs time; 10⁵ lines can cause a Time Limit Exceeded on their own. Delete or comment out before the final run.',
          python: 'Debug output to stdout becomes part of your answer and the judge marks it Wrong Answer. Printing to stderr is safe on LeetCode but still costs time; 10⁵ lines can cause a Time Limit Exceeded on their own. Delete or comment out before the final run.',
        },
      },
    ],
    keyTakeaways: [
      'Label every print with the variable name; print at decision points, not everywhere.',
      'Print the inputs of the function that misbehaves; the bug is often upstream.',
      'Send debug output to the error stream, shrink the input, and remove prints before submitting.',
    ],
    practice: {
      prompt: 'Take the Kadane’s algorithm loop and add labelled prints of i, endingHere and best each iteration. Run it on [-2,1,-3,4,-1,2,1,-5,4] and confirm the output matches the trace table from the arrays chapter. Then break the initialisation (start best at 0), run on [-3,-1,-2], and find the first wrong line.',
    },
  },
  // -------------------------------------------------------------------------
  {
    sub: 3,
    summary: 'Trace a function on paper to check your understanding before trusting the computer.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'The trace table from the first chapter was introduced for tiny programs. It is worth more, not less, as programs grow, because it forces you to execute the code as written rather than as intended. Every experienced programmer has spent an hour on a bug that a five-minute trace would have found, and most of them now trace first.',
      },
      { kind: 'heading', text: 'When to reach for it' },
      {
        kind: 'table',
        headers: ['Situation', 'Trace what'],
        rows: [
          ['A loop gives a result that is off by one or by one iteration', 'The loop with n = 2 and n = 3'],
          ['A recursive function returns the wrong thing', 'The call tree for the smallest input that fails'],
          ['Two pointers cross or never meet', 'lo and hi on an array of length 1, 2, 3'],
          ['You are not sure what a piece of code you read does', 'It, on one concrete input, before running it'],
        ],
      },
      { kind: 'heading', text: 'Tracing recursion' },
      {
        kind: 'text',
        body: 'For a recursive function, the table becomes a tree: one box per call, showing its arguments and, once known, its return value. Draw each call under the one that made it, fill in return values from the leaves upwards. Recursion bugs are almost always a wrong base case or a result that is computed but not returned, and both are obvious in the tree.',
      },
      {
        kind: 'code',
        caption: 'A function with a bug, and its trace',
        code: {
          cpp: `int sumDigits(int n) {
    if (n < 10) return n;
    sumDigits(n / 10) + n % 10;   // bug: result computed but not returned
}
// Trace sumDigits(47):
//   sumDigits(47): n >= 10, calls sumDigits(4) ... then returns nothing
//     sumDigits(4): returns 4
//   The + n % 10 happens, but no return: garbage comes back.`,
          java: `static int sumDigits(int n) {
    if (n < 10) return n;
    return sumDigits(n / 10) + n % 1;   // bug: % 1 is always 0
}
// Trace sumDigits(47):
//   sumDigits(47): returns sumDigits(4) + 47 % 1 = sumDigits(4) + 0
//     sumDigits(4): returns 4
//   Result 4. The trace shows the digit 7 was never added.`,
          python: `def sum_digits(n):
    if n < 10:
        return n
    sum_digits(n // 10) + n % 10     # bug: result computed but not returned

# Trace sum_digits(47):
#   sum_digits(47): n >= 10, evaluates sum_digits(4) + 7 = 11 ... then falls off the end
#     sum_digits(4): returns 4
#   Falls off the end, so returns None. The trace shows 11 was computed and dropped.`,
        },
      },
      {
        kind: 'text',
        body: 'In the trace, the inner call is correct and the outer call computes the right thing and then loses it. Reading the code, the missing `return` is easy to skim past; tracing it, you write "returns ..." for the outer call and realise there is nothing to write.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Trace the code, not your intention',
        body: 'The whole value of a trace is that you follow what the text says, including the bug. If you catch yourself writing the value you meant the variable to have, stop and re-read the line. The moment where the trace and your intention disagree is the bug.',
      },
    ],
    keyTakeaways: [
      'Trace loops with n = 2 or 3, two-pointer code with lengths 1 to 3, recursion as a call tree.',
      'Follow the code literally; where it diverges from what you intended is the bug.',
      'Recursion bugs are usually a wrong base case or a missing return, both visible in the tree.',
    ],
    practice: {
      prompt: 'Trace binary search for target 7 on [1, 3, 5, 7, 9] as a table of lo, mid, hi. Then trace it for target 4 (absent) and confirm the loop ends. Then change `hi = mid - 1` to `hi = mid` and trace target 4 again to see what goes wrong.',
    },
  },
  // -------------------------------------------------------------------------
  {
    sub: 4,
    summary: 'Recognise the four shapes of off-by-one error and the habits that prevent each.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Off-by-one errors are so common they have a nickname, OBOE, and a dedicated joke (there are two hard problems in computer science: cache invalidation, naming things, and off-by-one errors). They come from four sources, and each has a fix that is a habit rather than a check.',
      },
      {
        kind: 'table',
        headers: ['Shape', 'Symptom', 'Habit that prevents it'],
        rows: [
          ['Loop bound', 'One iteration too many or too few', 'Half-open ranges: `i < n` visits 0..n-1, exactly n items'],
          ['Inclusive vs exclusive', 'Range sums or substrings one element short or long', 'Decide once: is `end` included? Name it `hiInclusive` or use [lo, hi)'],
          ['Counting vs indexing', 'The 3rd element is at index 2', 'Convert at the boundary: `k-th` means index `k - 1`'],
          ['Fencepost', '10 metres of fence with posts every metre needs 11 posts', 'Ask: items or gaps between items?'],
        ],
      },
      { kind: 'heading', text: 'Half-open ranges everywhere' },
      {
        kind: 'text',
        body: 'Represent every range as [start, end): start included, end excluded. Then the length is `end - start` with no `+ 1`, an empty range is `start == end`, and splitting at m gives [start, m) and [m, end) with nothing lost or doubled. Most library functions use this convention (substring, slicing, sort ranges), so matching it keeps your code consistent with theirs.',
      },
      {
        kind: 'code',
        caption: 'Half-open in practice',
        code: {
          cpp: `// Substring from index 2, length 3: characters at 2, 3, 4
string t = s.substr(2, 3);              // (start, length) in C++
// Sort positions 2, 3, 4 only
sort(a.begin() + 2, a.begin() + 5);     // [2, 5)
// Count of elements in [lo, hi)
int count = hi - lo;`,
          java: `// Substring covering indices 2, 3, 4
String t = s.substring(2, 5);           // [2, 5): end excluded
// Copy positions 2, 3, 4 only
int[] part = Arrays.copyOfRange(a, 2, 5);  // [2, 5)
// Count of elements in [lo, hi)
int count = hi - lo;`,
          python: `# Slice covering indices 2, 3, 4
t = s[2:5]                              # [2, 5): end excluded
# Positions 2, 3, 4 only
part = a[2:5]
# Count of elements in [lo, hi)
count = hi - lo
# range(2, 5) gives 2, 3, 4 for the same reason`,
        },
      },
      { kind: 'heading', text: 'The fencepost question' },
      {
        kind: 'text',
        body: 'Positions 3 to 7 inclusive: how many? Not 7 - 3 = 4, but 5, because both ends count. Days between the 3rd and the 7th: 4. Same numbers, different answers, and the difference is whether you are counting the posts or the gaps. When a problem involves "from a to b", write down which one you mean before writing the subtraction.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Test the boundaries, not the middle',
        body: 'An off-by-one never shows up on a typical input. It shows up at n = 0, n = 1, the first element, the last element, and a range that covers the whole array. Those five tests take a minute and catch nearly every OBOE before submission.',
      },
    ],
    keyTakeaways: [
      'Use half-open [start, end) everywhere; length is `end - start`.',
      'k-th element is index k - 1; posts versus gaps decides whether to add 1.',
      'Test n = 0, n = 1, first, last and whole-array cases.',
    ],
    practice: {
      prompt: 'Write a function that returns the number of integers in [a, b] inclusive, and one for the number of integers in [a, b). Test both with a = 3, b = 7 and a = b = 5. Then write a function that returns the k-th smallest element of a sorted array for k counted from 1, and test k = 1 and k = n.',
    },
  },
  // -------------------------------------------------------------------------
  {
    sub: 5,
    summary: 'Diagnose a loop that never ends or ends too soon by checking its three ingredients.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'A program that runs forever, or prints one line and stops when it should print ten, has a loop problem. Every loop has three ingredients: something that starts a variable, a condition that reads it, and something that changes it so the condition eventually fails. A loop bug is one of the three being wrong, and there are only a few ways for that to happen.',
      },
      {
        kind: 'table',
        headers: ['Symptom', 'Likely cause', 'Example'],
        rows: [
          ['Runs forever', 'The update never happens or never moves towards the exit', '`while (i < n) { ... }` with no `i++`; or `i++` inside an `if` that is never true'],
          ['Runs forever', 'The condition can never become false', '`while (n != 0) n -= 2;` starting from an odd n'],
          ['Runs forever', 'Update goes the wrong way', '`for (i = n; i >= 0; i++)`'],
          ['Runs zero times', 'Condition false at the start', '`for (i = n; i < n; i++)`; or `while (lo < hi)` with lo == hi'],
          ['Runs once', 'Exit or return inside the loop body unconditionally', 'A `return` meant for the end placed inside the loop'],
          ['Ends one short or one long', 'Off-by-one in the condition', '`<` vs `<=`'],
        ],
      },
      { kind: 'heading', text: 'The two-pointer loop that never meets' },
      {
        kind: 'text',
        body: 'A common infinite loop in binary search: `while (lo < hi)` with `mid = (lo + hi) / 2` and `lo = mid` on one branch. When `hi = lo + 1`, `mid` rounds down to `lo`, `lo = mid` changes nothing, and the loop spins forever. The fix is to make sure every branch moves at least one pointer strictly: `lo = mid + 1`, or round `mid` up when assigning `lo = mid`. Tracing with `lo = 3, hi = 4` reveals it immediately.',
      },
      {
        kind: 'code',
        caption: 'Spot the spin',
        code: {
          cpp: `while (lo < hi) {
    int mid = (lo + hi) / 2;
    if (check(mid)) hi = mid;      // shrinks: ok
    else lo = mid;                 // when hi == lo + 1, mid == lo: no progress!
}
// Fix: else lo = mid + 1;  (if check(mid) false means mid is excluded)`,
          java: `while (lo < hi) {
    int mid = (lo + hi) / 2;
    if (check(mid)) hi = mid;      // shrinks: ok
    else lo = mid;                 // when hi == lo + 1, mid == lo: no progress!
}
// Fix: else lo = mid + 1;  (if check(mid) false means mid is excluded)`,
          python: `while lo < hi:
    mid = (lo + hi) // 2
    if check(mid):
        hi = mid                   # shrinks: ok
    else:
        lo = mid                   # when hi == lo + 1, mid == lo: no progress!
# Fix: lo = mid + 1  (if check(mid) is False, mid is excluded)`,
        },
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'A safety counter while debugging',
        body: 'When you suspect an infinite loop, add a counter and break after, say, 10⁶ iterations with a print of the loop variables. The program stops, and the print shows the state that was not making progress. Remove the counter once the loop is fixed.',
      },
    ],
    keyTakeaways: [
      'Every loop needs a start, a condition that can fail, and an update that moves towards failing.',
      'Two-pointer loops must move a pointer strictly on every branch.',
      'Trace with the smallest interval (`hi = lo + 1`) to expose no-progress steps.',
    ],
    practice: {
      prompt: 'Write a loop that reads numbers until a 0 is entered and prints their sum. Then deliberately create each symptom from the table (never ends, runs zero times, runs once) by changing one line, and confirm which line was responsible each time.',
    },
  },
  // -------------------------------------------------------------------------
  {
    sub: 6,
    summary: 'Decode each LeetCode verdict into what it says about your code and what to do next.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'When you submit, the judge runs your code on hidden tests and replies with a verdict. Each verdict is a different diagnosis and calls for a different response. Treating them all as "it failed, try again" wastes submissions; reading them as information saves them.',
      },
      {
        kind: 'table',
        headers: ['Verdict', 'What happened', 'First thing to do'],
        rows: [
          ['Compile Error', 'Your code did not build', 'Read the message; fix syntax or a missing import'],
          ['Wrong Answer (WA)', 'Ran to completion, returned something else', 'Look at the failing input shown; trace your code on it by hand'],
          ['Time Limit Exceeded (TLE)', 'Too slow on a large test', 'Check constraints; your complexity is too high, or there is an accidental inner loop'],
          ['Memory Limit Exceeded (MLE)', 'Used too much memory', 'Huge array, unbounded recursion, or storing what you only need to count'],
          ['Runtime Error (RE)', 'Crashed mid-run', 'Bad index, null access, division by zero, stack overflow; the message usually says which'],
          ['Output Limit Exceeded', 'Printed far too much', 'Leftover debug prints, or a print inside a loop that should be after it'],
        ],
      },
      { kind: 'heading', text: 'The failing case is a gift' },
      {
        kind: 'text',
        body: 'On Wrong Answer, LeetCode shows the input, your output and the expected output for the first failing test. That input is small enough to trace by hand more often than not. Copy it into a local run, add prints, and find the first place your state is wrong. Do not resubmit with a guess; each submission on the same failing input teaches you nothing new.',
      },
      {
        kind: 'text',
        body: 'On Time Limit Exceeded, look at the constraints again. If n is up to 10⁵, an O(n²) solution does 10¹⁰ operations and will never pass, no matter how you tune it. You need a different algorithm, not a faster loop. If n is small and you still get TLE, look for an infinite loop or an accidental O(n) operation inside a loop, such as searching a list with `in`, or building a string with `+`.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'A partial pass is still a fail',
        body: '"47 / 52 test cases passed" means your algorithm is probably right and an edge case is wrong: empty input, one element, all equal, negative numbers, the maximum size. The edge-case checklist in the next lesson is written for exactly this moment.',
      },
    ],
    keyTakeaways: [
      'WA: trace the shown failing input. TLE: reconsider the algorithm against the constraints.',
      'RE: bad index, null, division by zero or deep recursion. MLE: storing what should be counted.',
      'Never resubmit without changing something you can explain.',
    ],
    practice: {
      prompt: 'Pick any three problems you have already solved. For each, write one input that would cause a Wrong Answer if you removed a specific line, and one change that would cause a Time Limit Exceeded at the maximum constraint. Explaining why is the point.',
    },
  },
  // -------------------------------------------------------------------------
  {
    sub: 7,
    summary: 'Run through a fixed checklist of edge cases before every submission.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'An **edge case** is an input at the boundary of what the problem allows: the smallest, the largest, the empty, the degenerate. Hidden tests are full of them because that is where solutions break. The fix is not cleverness. It is a list, checked every time, until it becomes automatic.',
      },
      {
        kind: 'table',
        headers: ['Category', 'Cases to try', 'What usually breaks'],
        rows: [
          ['Size', 'Empty; one element; two elements; maximum n', 'Index -1, loops that assume n ≥ 2, TLE'],
          ['Values', 'All equal; all zero; negatives; the min and max value of the type', 'Initialising best to 0; overflow in sums and products'],
          ['Order', 'Already sorted; reverse sorted; all the same', 'Quick sort worst case; "no swap needed" paths'],
          ['Structure', 'Target absent; target at first / last position; duplicates of the target', 'Off-by-one in search; returning the wrong occurrence'],
          ['Strings', 'Empty string; one character; all spaces; upper and lower case; non-letters', 'Splitting; case-insensitive compares; `c - \'a\'` on uppercase'],
          ['Trees and lists', 'Null root; single node; a straight line (every node has one child)', 'Null dereference; recursion depth equal to n'],
          ['Graphs', 'No edges; self-loop; disconnected; a single cycle', 'Visiting only one component; infinite loops without a visited set'],
          ['Numbers', 'Zero; one; negative; k larger than n; k equal to zero', 'Division by zero; `k % n` forgotten; empty rotation'],
        ],
      },
      { kind: 'heading', text: 'Reading the constraints backwards' },
      {
        kind: 'text',
        body: 'The constraints section is the problem setter telling you which edge cases exist. `1 <= n <= 10⁵` means n = 1 is a test and n = 0 is not. `-10⁹ <= a[i] <= 10⁹` means negatives are tested and sums need 64 bits. `k <= n` means you need not handle k > n, but k = n is a test. Read each constraint and write down the case at each end of it.',
      },
      {
        kind: 'code',
        caption: 'A minimal local test harness',
        code: {
          cpp: `void check(vector<int> a, int expected) {
    int got = solve(a);
    if (got != expected) cerr << "FAIL: expected " << expected << " got " << got << "\\n";
}
int main() {
    check({}, 0);            // empty
    check({5}, 5);           // one element
    check({-3, -1, -2}, -1); // all negative
    check({2, 2, 2}, 2);     // all equal
}`,
          java: `static void check(int[] a, int expected) {
    int got = solve(a);
    if (got != expected) System.err.println("FAIL: expected " + expected + " got " + got);
}
public static void main(String[] args) {
    check(new int[]{}, 0);           // empty
    check(new int[]{5}, 5);          // one element
    check(new int[]{-3, -1, -2}, -1);// all negative
    check(new int[]{2, 2, 2}, 2);    // all equal
}`,
          python: `def check(a, expected):
    got = solve(a)
    if got != expected:
        print(f"FAIL: expected {expected} got {got}", file=sys.stderr)

check([], 0)             # empty
check([5], 5)            # one element
check([-3, -1, -2], -1)  # all negative
check([2, 2, 2], 2)      # all equal`,
        },
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Decide the answer before you run',
        body: 'Write the expected value from the problem statement, not from what your code prints. If you run first and copy the output into the test, the test can only confirm the bug. For an empty array, ask: does the problem define the answer, or promise it will not happen?',
      },
    ],
    keyTakeaways: [
      'Check size, values, order, structure, strings and numbers at their boundaries, every time.',
      'Each constraint names two edge cases: its lower and upper end.',
      'Write the expected answer from the statement before running.',
    ],
    practice: {
      prompt: 'Take a solved problem and write eight edge-case tests for it from the table, deciding each expected answer from the statement. Run them. If any fails, fix the solution; if all pass, remove one guard from your code and see which test catches it.',
    },
  },
  // -------------------------------------------------------------------------
  {
    sub: 8,
    summary: 'Write your own test cases from the statement so that a bug is found by you, not by the judge.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'The examples in a problem are chosen to explain the problem, not to test a solution. A solution that passes all of them and fails submission is the normal experience, not the exception. The habit that changes this is writing three or four tests of your own **before** running the code, each aimed at something the examples do not cover.',
      },
      { kind: 'heading', text: 'What to write' },
      {
        kind: 'table',
        headers: ['Test', 'Purpose'],
        rows: [
          ['The given examples', 'Confirms you read the input format and the output format correctly'],
          ['A tiny case you can compute by hand', 'n = 1 or 2, so you can verify the answer with certainty'],
          ['One edge case from the checklist', 'Whichever the constraints say exists'],
          ['A case that exercises the "else" branch', 'Target absent, no valid answer, ties'],
          ['A random medium case, if you can compute the answer another way', 'Catches logic errors that small cases hide'],
        ],
      },
      {
        kind: 'text',
        body: 'Each test is an input plus the answer you worked out **without running your code**. For the tiny case, work it out on paper. For the edge case, reason from the statement. If you cannot decide the expected answer, you have found something you do not understand about the problem, which is worth more than a test.',
      },
      {
        kind: 'code',
        caption: 'Tests as a list of input and expected pairs',
        code: {
          cpp: `struct Test { vector<int> nums; int target; vector<int> expected; };
vector<Test> tests = {
    {{2, 7, 11, 15}, 9, {0, 1}},     // given example
    {{3, 3}, 6, {0, 1}},             // duplicates as the answer
    {{1, 2}, 3, {0, 1}},             // minimum size
    {{-1, -2, -3, -4}, -6, {1, 3}},  // negatives
};
for (auto& t : tests) {
    auto got = twoSum(t.nums, t.target);
    if (got != t.expected) cerr << "FAIL on target " << t.target << "\\n";
}`,
          java: `record Test(int[] nums, int target, int[] expected) {}
Test[] tests = {
    new Test(new int[]{2, 7, 11, 15}, 9, new int[]{0, 1}),     // given example
    new Test(new int[]{3, 3}, 6, new int[]{0, 1}),             // duplicates as the answer
    new Test(new int[]{1, 2}, 3, new int[]{0, 1}),             // minimum size
    new Test(new int[]{-1, -2, -3, -4}, -6, new int[]{1, 3}),  // negatives
};
for (Test t : tests) {
    int[] got = twoSum(t.nums(), t.target());
    if (!Arrays.equals(got, t.expected())) System.err.println("FAIL on target " + t.target());
}`,
          python: `tests = [
    ([2, 7, 11, 15], 9, [0, 1]),     # given example
    ([3, 3], 6, [0, 1]),             # duplicates as the answer
    ([1, 2], 3, [0, 1]),             # minimum size
    ([-1, -2, -3, -4], -6, [1, 3]),  # negatives
]
for nums, target, expected in tests:
    got = two_sum(nums, target)
    if got != expected:
        print(f"FAIL on target {target}: got {got}", file=sys.stderr)`,
        },
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Keep the tests when you refactor',
        body: 'The first version that passes is rarely the last: you will optimise it, or rewrite it after seeing a better approach. The tests you wrote for version one tell you instantly whether version two still works. That is the whole reason professional codebases have test suites.',
      },
    ],
    keyTakeaways: [
      'The examples explain the problem; they do not test your solution.',
      'Write a tiny hand-computable case, an edge case and an "else branch" case before running.',
      'Decide expected answers from the statement, never from your program’s output.',
    ],
    practice: {
      prompt: 'For the problem "return the length of the longest run of equal adjacent elements", write five tests with expected answers before writing any code: the empty array, one element, all equal, no two equal, and a run at the very end. Then implement and run them.',
    },
  },
  // -------------------------------------------------------------------------
  {
    sub: 9,
    summary: 'Find a bug you cannot see by comparing a fast solution against a slow one that cannot be wrong, on random inputs.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Sometimes a solution fails a hidden test and every case you can think of passes. **Stress testing** finds the failing input for you. Write the slowest, dumbest solution you can, one so simple it cannot be wrong, generate thousands of small random inputs, and compare the two solutions’ answers. The first input where they disagree is your bug, delivered.',
      },
      { kind: 'heading', text: 'The three parts' },
      {
        kind: 'text',
        body: 'A **brute force**: try everything, no cleverness, O(n²) or O(2ⁿ) is fine because inputs will be tiny. A **generator**: produces a random small input, with n between 1 and 8 and values in a narrow range so duplicates and edge cases occur often. A **loop**: generate, run both, compare, and stop and print the input at the first mismatch.',
      },
      {
        kind: 'code',
        caption: 'Stress test: is the fast maximum-subarray right?',
        code: {
          cpp: `long long brute(const vector<int>& a) {              // every (l, r): cannot be wrong
    long long best = LLONG_MIN;
    for (int l = 0; l < a.size(); l++) {
        long long s = 0;
        for (int r = l; r < a.size(); r++) { s += a[r]; best = max(best, s); }
    }
    return best;
}
int main() {
    mt19937 rng(42);
    for (int t = 0; t < 10000; t++) {
        int n = rng() % 8 + 1;
        vector<int> a(n);
        for (int& x : a) x = (int)(rng() % 11) - 5;      // -5..5, so negatives are common
        if (fast(a) != brute(a)) {
            cerr << "Mismatch on:"; for (int x : a) cerr << " " << x; cerr << "\\n";
            return 1;
        }
    }
    cerr << "all good\\n";
}`,
          java: `static long brute(int[] a) {                       // every (l, r): cannot be wrong
    long best = Long.MIN_VALUE;
    for (int l = 0; l < a.length; l++) {
        long s = 0;
        for (int r = l; r < a.length; r++) { s += a[r]; best = Math.max(best, s); }
    }
    return best;
}
public static void main(String[] args) {
    Random rng = new Random(42);
    for (int t = 0; t < 10000; t++) {
        int n = rng.nextInt(8) + 1;
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = rng.nextInt(11) - 5;   // -5..5
        if (fast(a) != brute(a)) {
            System.err.println("Mismatch on: " + Arrays.toString(a));
            return;
        }
    }
    System.err.println("all good");
}`,
          python: `import random

def brute(a):                                   # every (l, r): cannot be wrong
    best = float("-inf")
    for l in range(len(a)):
        s = 0
        for r in range(l, len(a)):
            s += a[r]
            best = max(best, s)
    return best

random.seed(42)
for t in range(10000):
    n = random.randint(1, 8)
    a = [random.randint(-5, 5) for _ in range(n)]   # negatives are common
    if fast(a) != brute(a):
        print("Mismatch on:", a, file=sys.stderr)
        break
else:
    print("all good", file=sys.stderr)`,
        },
      },
      {
        kind: 'text',
        body: 'Small n and a narrow value range are deliberate. With n up to 8 and values from -5 to 5, ten thousand trials cover an enormous variety of shapes, including all-negative, all-equal and single-element arrays, and any failing input is short enough to trace by hand. Large random inputs almost never hit edge cases and are useless when they fail.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Once you have the failing input, shrink it',
        body: 'Remove elements one at a time while the mismatch persists. A failing input of length 2 or 3 usually makes the bug obvious on sight. This is also how you produce the minimal test to add to your test list so it never comes back.',
      },
    ],
    keyTakeaways: [
      'Stress test = brute force + random small generator + comparison loop.',
      'Keep inputs tiny (n ≤ 8) with a narrow value range so edge shapes appear often.',
      'Shrink the first failing input until the bug is visible.',
    ],
    practice: {
      prompt: 'Write a brute-force "does the array contain two numbers summing to k" (double loop) and a fast version using a set. Stress test them with n up to 6 and values from -3 to 3. Then introduce a subtle bug in the fast version (check the set before inserting, or after) and confirm the stress test catches it.',
    },
  },
  // -------------------------------------------------------------------------
  {
    sub: 10,
    summary: 'Explain your code out loud, line by line, to find the bug your eyes keep skipping.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'When you have read the same ten lines six times and they still look correct, your eyes are no longer reading them; they are recognising them. **Rubber-duck debugging** breaks that: explain the code, line by line, to something that cannot help you, such as a rubber duck on the desk. The act of putting each line into words forces you to read what it says instead of what you remember writing. It sounds absurd and it works.',
      },
      { kind: 'heading', text: 'How to do it' },
      {
        kind: 'text',
        body: 'Start at the top of the function. For each line say, out loud or in writing, what it does and why it is there: "this creates a counter starting at zero, because we have not seen any yet." Do not skip lines you are sure about; those are the ones hiding the bug. When you reach a line you cannot explain, or your explanation does not match the code, stop. That is it.',
      },
      {
        kind: 'table',
        headers: ['What you say', 'What you notice'],
        rows: [
          ['"This loop goes from 1 to n..." ', '"...but the array starts at 0, so it skips the first element."'],
          ['"If the count is greater than the best, update the best..."', '"...and I never update the best index alongside it."'],
          ['"Then we return the total..."', '"...which is inside the loop, so it returns after one iteration."'],
          ['"This resets the sum when it goes negative..."', '"...it checks `< 0` but the reset should be on `<= 0`? No: on negative only. Fine." (and you move on, now certain)'],
        ],
      },
      {
        kind: 'text',
        body: 'The last row matters: the technique also confirms lines are right, and each confirmation narrows where the bug can be. Explaining is a search, and every line you can explain is a line you can rule out.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Writing the explanation as comments',
        body: 'Explaining to a duck out loud is awkward in a shared room. Writing a one-line comment above every line of the suspect function is the same exercise on paper, and the comments that come out wrong or that you cannot write are the bug. Delete them afterwards, or keep the good ones.',
      },
    ],
    keyTakeaways: [
      'Explain each line in words; the line you cannot explain, or explain differently from what it says, is the bug.',
      'Do not skip the lines you are sure about.',
      'Every line you can explain narrows the search.',
    ],
    practice: {
      prompt: 'Take the last function you wrote that had a bug you eventually fixed. Restore the bug, then explain the function line by line in writing as if to someone who has never seen it. Note how many lines in you find it, and whether you would have found it faster this way.',
    },
  },
];
