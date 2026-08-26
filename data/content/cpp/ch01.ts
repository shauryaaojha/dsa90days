import type { Lesson } from '../types';

/**
 * Chapter 1 — Language Setup and Core Syntax.
 * The student has never written C++. Everything here is aimed at getting a
 * first LeetCode submission to compile.
 */
export const ch01: Lesson[] = [
  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-1.1',
    language: 'cpp',
    summary: 'Read a C++ file top to bottom and know what every line is doing.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Every C++ program is a block of text that a **compiler** turns into a runnable file. Unlike Python, nothing runs top-to-bottom as it is read — the compiler reads the whole file first, then execution begins at one specific place: `main()`.',
      },
      {
        kind: 'text',
        body: 'Here is the smallest complete C++ program that does something visible. Read it once, then we will take it apart line by line.',
      },
      {
        kind: 'code',
        caption: 'hello.cpp — the anatomy of a C++ file',
        code: `#include <iostream>
using namespace std;

int main() {
    cout << "Ready for DSA" << endl;
    return 0;
}`,
        output: 'Ready for DSA',
      },
      { kind: 'heading', text: 'Line by line' },
      {
        kind: 'table',
        headers: ['Line', 'What it does'],
        rows: [
          ['`#include <iostream>`', 'Pulls in the input/output library so `cout` exists. Without it the compiler has never heard of `cout`.'],
          ['`using namespace std;`', 'Lets you write `cout` instead of `std::cout`.'],
          ['`int main() {`', 'The starting point. Execution begins on the first line inside these braces.'],
          ['`cout << "..." << endl;`', 'Prints text, then a newline.'],
          ['`return 0;`', 'Tells the operating system the program finished successfully.'],
          ['`}`', 'Closes `main`. The program ends here.'],
        ],
      },
      { kind: 'heading', text: 'The three rules that trip everyone up' },
      {
        kind: 'text',
        body: '**1. Statements end in a semicolon.** A newline means nothing to C++. This is the single most common first-day error.',
      },
      {
        kind: 'text',
        body: '**2. Blocks are made of braces, not indentation.** You *should* indent for readability, but `{` and `}` are what actually group code. Python habits will mislead you here.',
      },
      {
        kind: 'text',
        body: '**3. Everything must be declared before it is used.** The compiler reads top to bottom. If you call a function on line 5 that you define on line 40, it fails — unless you declared it earlier (covered in Chapter 4).',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'On LeetCode you do not write main()',
        body: 'LeetCode gives you a `class Solution` with one method to fill in, and runs its own hidden `main()` behind the scenes. Writing your own `main()` there is harmless but pointless. Practise with `main()` locally; on the judge, write only inside the method they give you.',
      },
      {
        kind: 'code',
        caption: 'The same logic, as LeetCode would present it',
        code: `class Solution {
public:
    int addOne(int x) {
        return x + 1;
    }
};`,
      },
    ],
    keyTakeaways: [
      'Execution always starts at `main()`, no matter where it sits in the file.',
      'Semicolons end statements; braces make blocks. Indentation is only for humans.',
      'Names must be declared before they are used, because the compiler reads top to bottom.',
      'On LeetCode you fill in a method inside `class Solution` — the judge supplies `main()`.',
    ],
    practice: {
      prompt: 'Type the hello.cpp program by hand (do not copy-paste) and run it. Then deliberately break it three ways: delete a semicolon, delete a closing brace, and delete the `#include` line. Read each error message carefully — learning to recognise these three messages will save you hours later.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-1.2',
    language: 'cpp',
    summary: 'Know which headers to include so vector, string and sort actually exist.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'C++ ships almost nothing by default. `vector`, `sort`, `string` — none of them exist until you *include* the header file that declares them. An `#include` line is a literal copy-paste instruction: before compiling, the preprocessor replaces that line with the entire contents of the named file.',
      },
      {
        kind: 'code',
        caption: 'The headers you will actually use in DSA',
        code: `#include <iostream>      // cin, cout, endl
#include <vector>        // vector
#include <string>        // string
#include <algorithm>     // sort, reverse, min, max, binary_search
#include <unordered_map> // unordered_map, unordered_set
#include <map>           // map, set
#include <queue>         // queue, priority_queue
#include <stack>         // stack
#include <climits>       // INT_MAX, INT_MIN`,
      },
      {
        kind: 'text',
        body: 'Angle brackets `<...>` mean "look in the standard library". Double quotes `"..."` mean "look in my own project folder" — you will not need that form on LeetCode.',
      },
      { kind: 'heading', text: 'The shortcut everyone uses' },
      {
        kind: 'text',
        body: 'Competitive programmers include one header that drags in the entire standard library at once:',
      },
      {
        kind: 'code',
        code: `#include <bits/stdc++.h>
using namespace std;`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'bits/stdc++.h works on LeetCode, but not everywhere',
        body: 'It is a GCC-only convenience header — it does not exist in Apple Clang or MSVC, so it may fail to compile on your own Mac or in a Windows IDE even though LeetCode accepts it. It also slows compilation noticeably. Use it on the judge if you like; know the real headers for interviews and for local work.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: '"error: \'vector\' was not declared in this scope"',
        body: 'This almost always means a missing `#include`, not a typo. Match the error to the table above and add the header. Note that headers include each other unpredictably — your code might compile without `<string>` on one machine and fail on another, so always include what you use.',
      },
    ],
    keyTakeaways: [
      '`#include` is a literal copy-paste of another file, performed before compilation.',
      '`<angle>` = standard library, `"quotes"` = your own files.',
      '"was not declared in this scope" for a standard name means a missing header.',
      '`<bits/stdc++.h>` includes everything but is GCC-only — fine on LeetCode, risky elsewhere.',
    ],
    practice: {
      prompt: 'Write a program that makes a `vector<int>` holding 5, 3, 9, sorts it, and prints all three values. Start with only `#include <iostream>`, then add headers one at a time as the compiler complains. This teaches you to read errors instead of guessing.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-1.3',
    language: 'cpp',
    summary: 'Understand what std:: means and why one line lets you stop typing it.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'Every name in the standard library lives inside a **namespace** called `std` — a container for names, invented so that the library\'s `sort` does not collide with a `sort` you write yourself. The full name of the printing object is `std::cout`; the `::` is the scope operator, meaning "inside".',
      },
      {
        kind: 'code',
        caption: 'The same program, written both ways',
        code: `// Without the shortcut — fully qualified
#include <iostream>
int main() {
    std::string name = "DSA";
    std::cout << name << std::endl;
}

// With the shortcut
#include <iostream>
using namespace std;
int main() {
    string name = "DSA";
    cout << name << endl;
}`,
      },
      {
        kind: 'text',
        body: '`using namespace std;` tells the compiler: if you meet a name you do not recognise, try looking for it inside `std` before giving up. It saves typing and nothing else — it does not make the program faster or slower.',
      },
      { kind: 'heading', text: 'Why professionals avoid it' },
      {
        kind: 'text',
        body: 'It imports *every* name from the standard library into your file. Some of those names are extremely common words, and if you happen to define your own, the compiler can no longer tell which one you meant.',
      },
      {
        kind: 'code',
        caption: 'A real collision',
        code: `#include <algorithm>
using namespace std;

int count = 0;   // std::count is an algorithm — this name now clashes

int main() {
    count++;     // error: reference to 'count' is ambiguous
}`,
      },
      {
        kind: 'table',
        headers: ['Situation', 'What to do'],
        rows: [
          ['LeetCode / contests', '`using namespace std;` — single file, speed matters, collisions are rare'],
          ['Header files (`.h`)', 'Never. It leaks into every file that includes yours'],
          ['Real projects', 'Write `std::` explicitly, or import just what you need'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The middle ground',
        body: 'You can import individual names instead of the whole namespace: `using std::cout;` and `using std::vector;`. You get the short spelling without opening the floodgates.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Watch out for these names',
        body: '`count`, `size`, `data`, `begin`, `end`, `distance`, `swap`, `max`, `min`, `left`, `right`, `next`, `prev` all exist in `std`. If you name a variable one of these while `using namespace std;` is active, you may get a confusing "ambiguous" error. Renaming your variable is the fix.',
      },
    ],
    keyTakeaways: [
      '`std` is a namespace; `std::cout` is the real, full name of `cout`.',
      '`using namespace std;` only saves typing — it has no runtime cost.',
      'It can cause ambiguity errors when your own names collide with library names.',
      'Fine for a single-file LeetCode solution; never put it in a header file.',
    ],
    practice: {
      prompt: 'Write a short program using `std::` on every standard name, with no `using` line at all. It will feel verbose — that is the point. Then reproduce the `int count = 0;` collision above so you recognise the "ambiguous" error when it appears in your own code.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-1.4',
    language: 'cpp',
    summary: 'Know exactly what main() is, what it returns, and why LeetCode hides it.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: '`main` is the entry point. When the operating system launches your program, it calls `main`, and when `main` returns, the program is over. There is exactly one `main` per program.',
      },
      {
        kind: 'code',
        caption: 'The two legal signatures',
        code: `int main() { ... }                        // most common
int main(int argc, char* argv[]) { ... }  // when you need command-line args`,
      },
      {
        kind: 'text',
        body: 'The return type is always `int`. That integer is the **exit code**, handed back to the operating system: `0` means success, anything else means failure. Test runners and judges read it.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'main() is the one function allowed to skip its return',
        body: 'Leaving out `return 0;` in `main` is legal — the compiler inserts it for you. Every *other* non-void function must return explicitly. Writing `return 0;` anyway is a good habit and costs nothing.',
      },
      { kind: 'heading', text: 'How a local program differs from a LeetCode submission' },
      {
        kind: 'text',
        body: 'Locally you write `main`, read input, call your logic, print the result. On LeetCode the judge owns `main` — it parses the test case, constructs a `Solution` object, calls your method, and compares the returned value. You never see any of it.',
      },
      {
        kind: 'code',
        caption: 'Local version — you drive everything',
        code: `#include <iostream>
#include <vector>
using namespace std;

int sumAll(vector<int>& nums) {
    int total = 0;
    for (int n : nums) total += n;
    return total;
}

int main() {
    vector<int> data = {1, 2, 3, 4};
    cout << sumAll(data) << endl;
    return 0;
}`,
        output: '10',
      },
      {
        kind: 'code',
        caption: 'LeetCode version — the judge drives',
        code: `class Solution {
public:
    int sumAll(vector<int>& nums) {
        int total = 0;
        for (int n : nums) total += n;
        return total;
    }
};`,
      },
      {
        kind: 'text',
        body: 'Notice the logic is byte-for-byte identical. Only the wrapper changes. This is why practising locally with `main` transfers perfectly to the judge.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Printing instead of returning',
        body: 'The single most common beginner failure on LeetCode: using `cout` to print the answer instead of `return`-ing it. The judge ignores what you print and checks the returned value, so you get "Wrong Answer" on a solution that looks correct in your terminal. Print only for debugging; always return the real answer.',
      },
    ],
    keyTakeaways: [
      '`main` returns `int` — the exit code, where `0` means success.',
      '`main` may omit `return 0;`; no other non-void function may omit its return.',
      'LeetCode supplies its own `main` and calls your method inside `class Solution`.',
      'The judge reads your **return value**, not your printed output.',
    ],
    practice: {
      prompt: 'Write a local program with a function `int maxOf(vector<int>& v)` plus a `main` that tests it on `{3, 7, 2}`. Then rewrite it as a `class Solution` with no `main`, and confirm the function body did not change at all.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-1.5',
    language: 'cpp',
    summary: 'Read numbers, words and whole lines from input, and print results cleanly.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'C++ handles console I/O with two stream objects: `cin` for input and `cout` for output. The arrows show which way the data is moving — `cout << x` pushes `x` out to the console, `cin >> x` pulls a value in and stores it in `x`.',
      },
      {
        kind: 'code',
        caption: 'Reading and printing',
        code: `#include <iostream>
using namespace std;

int main() {
    int age;
    cout << "Enter your age: ";
    cin >> age;
    cout << "Next year you will be " << age + 1 << endl;
    return 0;
}`,
        output: 'Enter your age: 20\nNext year you will be 21',
      },
      {
        kind: 'text',
        body: 'You can chain as many `<<` as you like, mixing text, variables and expressions. `endl` ends the line.',
      },
      { kind: 'heading', text: 'cin stops at whitespace — getline does not' },
      {
        kind: 'text',
        body: 'This distinction causes more confusion than anything else in beginner C++. `cin >> s` reads a single **word**: it skips leading whitespace, reads until it hits a space, tab or newline, and stops. To capture a whole line including spaces, use `getline`.',
      },
      {
        kind: 'code',
        caption: 'The difference, with input "Shaurya Ojha"',
        code: `string a;
cin >> a;              // a == "Shaurya"  — stops at the space

string b;
getline(cin, b);       // b == "Shaurya Ojha"  — takes the whole line`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'The leftover-newline bug',
        body: 'Mixing `cin >>` and `getline` breaks in a way that looks like getline was skipped entirely. `cin >> n` reads the number but leaves the newline you pressed sitting in the buffer. The next `getline` finds that newline immediately, returns an empty string, and moves on. Fix it by discarding the leftover newline first.',
      },
      {
        kind: 'code',
        caption: 'Broken, then fixed',
        code: `// BROKEN — name comes out empty
int n;
string name;
cin >> n;
getline(cin, name);          // reads the leftover newline, returns ""

// FIXED
#include <limits>
int n;
string name;
cin >> n;
cin.ignore(numeric_limits<streamsize>::max(), '\\n');  // discard to end of line
getline(cin, name);          // now reads the real line`,
      },
      {
        kind: 'text',
        body: 'A shorter fix that works for the common case is `cin.ignore();` — it discards exactly one character, which is enough when you know only the newline is pending.',
      },
      { kind: 'heading', text: 'endl vs \\n' },
      {
        kind: 'table',
        headers: ['', 'Newline', 'Flushes buffer', 'Speed'],
        rows: [
          ['`endl`', 'yes', 'yes — forces output immediately', 'slower in loops'],
          ['`"\\n"`', 'yes', 'no', 'faster'],
        ],
      },
      {
        kind: 'text',
        body: 'Flushing means forcing the text out to the console right now instead of letting it buffer. Inside a loop that prints 100,000 lines, `endl` can be dramatically slower. Prefer `"\\n"` and use `endl` only when you genuinely need the output to appear at once.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The competitive-programming speed line',
        body: 'For problems with very large input, put `ios_base::sync_with_stdio(false); cin.tie(NULL);` at the top of `main`. It unhooks C++ streams from C stdio and can make I/O several times faster. You will rarely need it on LeetCode, where input is handed to you directly rather than read from stdin.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'On LeetCode you almost never use cin',
        body: 'Arguments arrive as function parameters, so there is nothing to read. `cout` still has one important use: debugging. Print intermediate values to understand why a test fails, then delete those lines before your final submission.',
      },
    ],
    keyTakeaways: [
      '`cin >>` reads one whitespace-delimited token; `getline` reads an entire line.',
      'After `cin >>`, call `cin.ignore(...)` before `getline` or you will read an empty string.',
      '`"\\n"` is faster than `endl` because it does not flush — prefer it inside loops.',
      'On LeetCode, input arrives as parameters; `cout` is for debugging only.',
    ],
    practice: {
      prompt: 'Write a program that reads an integer `n`, then reads `n` full names (with spaces) and prints them numbered. You will hit the leftover-newline bug on the first name — fix it with `cin.ignore`. This one exercise inoculates you against the most common I/O bug in C++.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-1.6',
    language: 'cpp',
    summary: 'Write comments and format code so an interviewer can follow your thinking.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'Comments are ignored by the compiler and written purely for humans — including you, three weeks later, revisiting a problem you half-remember.',
      },
      {
        kind: 'code',
        caption: 'Both comment forms',
        code: `// Single-line: everything after the slashes is ignored.

/* Multi-line: everything between the markers
   is ignored, across as many lines as you like. */

int left = 0;   // comments can also sit after code`,
      },
      { kind: 'heading', text: 'Comment the why, not the what' },
      {
        kind: 'text',
        body: 'A comment restating the code is noise. A comment explaining the *reasoning* is what makes a solution readable in an interview.',
      },
      {
        kind: 'code',
        caption: 'Useless vs useful',
        code: `// USELESS — the code already says this
i++;  // increment i

// USEFUL — explains a decision the code cannot express
// Move the left pointer in: the window is too wide, so shrinking
// it is the only way the sum can come back down.
left++;`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The habit that pays off in interviews',
        body: 'Write a two-line comment above each solution stating your approach and its complexity — for example `// Two pointers from both ends. O(n) time, O(1) space.` It forces you to articulate the approach before coding, and interviewers consistently read it as a signal of clear thinking.',
      },
      { kind: 'heading', text: 'Formatting that keeps you out of trouble' },
      {
        kind: 'text',
        body: 'C++ ignores whitespace entirely, so formatting is a discipline you impose on yourself. Four conventions matter:',
      },
      {
        kind: 'table',
        headers: ['Convention', 'Why'],
        rows: [
          ['Indent one level per nested block', 'Makes mismatched braces visible at a glance'],
          ['Always use braces, even for one-line `if`s', 'Adding a second line later silently breaks brace-less `if`s'],
          ['Spaces around operators: `a + b`, not `a+b`', 'Readability under time pressure'],
          ['Descriptive names: `left`, `maxSum` — not `a`, `x`', 'You will re-read this code during a debug'],
        ],
      },
      {
        kind: 'code',
        caption: 'Why the braces rule matters',
        code: `// DANGEROUS — only the first line is inside the if
if (found)
    cout << "yes";
    count++;          // ALWAYS runs — the indentation is a lie

// SAFE
if (found) {
    cout << "yes";
    count++;
}`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Comments do not nest',
        body: 'You cannot wrap a `/* ... */` block inside another `/* ... */` — the first `*/` closes both, and the rest of the outer comment becomes code. To comment out a large region that already contains block comments, use `//` on every line (most editors do this with Ctrl+/).',
      },
    ],
    keyTakeaways: [
      '`//` comments to end of line; `/* */` spans lines but cannot nest.',
      'Explain *why*, not *what* — the code already says what.',
      'Label each solution with its approach and complexity; interviewers notice.',
      'Always brace your `if` bodies — indentation is not what groups statements.',
    ],
    practice: {
      prompt: 'Take any solution you have already written and add a two-line header comment giving the approach and its time/space complexity. If you cannot state the complexity in one line, that is a signal you do not yet fully understand your own solution — a genuinely useful thing to discover now rather than in an interview.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-1.7',
    language: 'cpp',
    summary: 'Trace source code through preprocessing, compiling and linking — and know which stage your error came from.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'C++ is a **compiled** language. Nothing runs until a compiler has translated your entire source file into machine code. That translation happens in four stages, and knowing which stage failed tells you what kind of mistake you made.',
      },
      {
        kind: 'table',
        headers: ['Stage', 'What happens', 'Typical error'],
        rows: [
          ['**Preprocess**', 'Handles `#include` and `#define` — pure text substitution', '`iostream: No such file or directory`'],
          ['**Compile**', 'Checks syntax and types, produces assembly', '`expected \';\' before \'}\'` · `\'x\' was not declared`'],
          ['**Assemble**', 'Turns assembly into an object file (`.o`)', 'Almost never fails'],
          ['**Link**', 'Joins object files and libraries into one executable', '`undefined reference to \'foo()\'`'],
        ],
      },
      {
        kind: 'text',
        body: 'The practical split: **compile errors** mean your code is malformed or misuses a type. **Link errors** mean your code is well-formed but something it promised exists was never actually defined.',
      },
      {
        kind: 'code',
        caption: 'Compiling by hand',
        code: `g++ solution.cpp -o solution     # compile into an executable named "solution"
./solution                       # run it  (Windows: .\\solution.exe)

# Recommended flags while learning:
g++ -std=c++17 -Wall -g solution.cpp -o solution`,
      },
      {
        kind: 'table',
        headers: ['Flag', 'What it gives you'],
        rows: [
          ['`-std=c++17`', 'Enables modern features like structured bindings. LeetCode uses C++17 or newer'],
          ['`-Wall`', 'Turns on all common warnings — catches real bugs the compiler would otherwise let pass'],
          ['`-g`', 'Embeds debug info so a debugger can show your variable names'],
          ['`-O2`', 'Optimises for speed. Use for timing tests, not while debugging'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Fix the first error first',
        body: 'One missing semicolon can produce thirty errors, because the compiler loses track of where statements end and then misreads everything after. Always fix the topmost error and recompile before reading the rest — the other twenty-nine often vanish.',
      },
      { kind: 'heading', text: 'A compile error is not a failure' },
      {
        kind: 'text',
        body: 'Coming from Python, compilation feels like an obstacle. Reframe it: the compiler is a free reviewer that catches type mismatches, typos and undeclared names *before* you waste a submission. A language without this step lets the same bugs through to runtime, where they are far more expensive to find.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'What LeetCode actually reports',
        body: '"Compile Error" means it never ran your code — a syntax or type problem. "Runtime Error" means it compiled and crashed while executing, usually an out-of-bounds index or a null-pointer dereference. "Time Limit Exceeded" means it ran correctly but too slowly — a complexity problem, not a bug. Three different failures needing three different fixes.',
      },
    ],
    keyTakeaways: [
      'Source becomes an executable via preprocess → compile → assemble → link.',
      'Compile errors mean malformed code; link errors mean a missing definition.',
      'Build with `-std=c++17 -Wall -g` while learning.',
      'Always fix the first error, then recompile — later errors are often knock-on effects.',
    ],
    practice: {
      prompt: 'Compile a working program with `g++ -Wall`. Then introduce one error from each stage: misspell a header name, delete a semicolon, and declare a function `int foo();` that you call but never define. Note how differently each failure is reported — recognising the three categories instantly is a real time-saver.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-1.8',
    language: 'cpp',
    summary: 'Recognise the handful of errors responsible for most failed C++ submissions.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Almost every compile error a beginner hits on LeetCode is one of six things. Learn to recognise the message and the fix becomes automatic.',
      },
      { kind: 'heading', text: '1. Missing semicolon after a class' },
      {
        kind: 'code',
        code: `class Solution {
public:
    int solve() { return 0; }
}          // ERROR — a class declaration must end with a semicolon

// Correct:
};`,
      },
      {
        kind: 'text',
        body: 'Classes and structs need a trailing `;`. Functions do not. The error often points at the *next* line, which makes it confusing.',
      },
      { kind: 'heading', text: '2. Forgetting public:' },
      {
        kind: 'code',
        code: `class Solution {
    int twoSum(vector<int>& nums, int target) { ... }  // private by default!
};
// ERROR: 'int Solution::twoSum(...)' is private within this context`,
      },
      {
        kind: 'text',
        body: 'Members of a `class` are private unless you say otherwise, so the judge cannot call your method. LeetCode\'s template includes `public:` — never delete it. (A `struct` is public by default, which is the only real difference between the two.)',
      },
      { kind: 'heading', text: '3. Not returning on every path' },
      {
        kind: 'code',
        code: `int findFirst(vector<int>& nums, int target) {
    for (int i = 0; i < nums.size(); i++) {
        if (nums[i] == target) return i;
    }
    // ERROR: control reaches end of non-void function
}`,
      },
      {
        kind: 'text',
        body: 'If the loop finds nothing, the function falls off the end and returns garbage. Every path must return. Add `return -1;` at the bottom.',
      },
      { kind: 'heading', text: '4. The size() comparison warning' },
      {
        kind: 'code',
        code: `for (int i = 0; i < nums.size(); i++)      // warning: signed/unsigned comparison`,
      },
      {
        kind: 'text',
        body: '`nums.size()` returns an **unsigned** type, and comparing it with a signed `int` triggers a warning. It is harmless in a normal forward loop, but genuinely dangerous when you count downwards: on an empty vector `nums.size() - 1` does not give `-1`, it wraps around to a huge positive number and your loop runs billions of times.',
      },
      {
        kind: 'code',
        caption: 'The wrap-around trap',
        code: `vector<int> nums;                          // empty
for (int i = nums.size() - 1; i >= 0; i--) // size()-1 wraps to 18446744073709551615
    cout << nums[i];                       // crashes

// Safe:
for (int i = (int)nums.size() - 1; i >= 0; i--)`,
      },
      { kind: 'heading', text: '5. Out-of-bounds access' },
      {
        kind: 'code',
        code: `for (int i = 0; i <= nums.size(); i++)   // <= reads one past the end
    sum += nums[i];                       // Runtime Error / garbage value`,
      },
      {
        kind: 'text',
        body: 'Valid indices run `0` to `size() - 1`. Use `<`, not `<=`. C++ does not bounds-check `[]`, so this may silently read junk instead of crashing — which is worse, because the bug hides.',
      },
      { kind: 'heading', text: '6. Integer overflow' },
      {
        kind: 'code',
        code: `int a = 2000000000, b = 2000000000;
int sum = a + b;              // overflows — result is negative

long long sum = (long long)a + b;   // correct`,
      },
      {
        kind: 'text',
        body: 'An `int` holds roughly ±2.1 billion. When a problem\'s constraints allow sums beyond that, use `long long`. Note the cast must come *before* the addition — `(long long)(a + b)` is too late, the overflow already happened.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'A 30-second pre-submit checklist',
        body: 'Semicolon after the class brace · `public:` present · every path returns · loops use `<` not `<=` · sums that could exceed 2.1 billion use `long long` · debug `cout` lines deleted. Running through this catches the overwhelming majority of avoidable rejections.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Read the caret, not just the message',
        body: 'The compiler prints a `^` under the exact character it objected to. Beginners read the message and guess; the caret usually tells you more. And remember the real mistake often sits on the line *above* the one reported — especially for missing semicolons.',
      },
    ],
    keyTakeaways: [
      'A class declaration ends with `};` — the error usually points at the following line.',
      '`class` members are private by default; keep LeetCode\'s `public:`.',
      'Every non-void code path must return, or you get undefined behaviour.',
      '`size()` is unsigned — cast to `int` before subtracting, or it wraps to a huge number.',
      'Cast to `long long` *before* adding, not after.',
    ],
    practice: {
      prompt: 'Deliberately write all six errors above, one at a time, and read each message and caret position carefully. Ten minutes doing this on purpose saves hours of confusion later, because you will recognise every one of these messages on sight instead of re-deriving the cause each time.',
      leetcode: { title: 'Two Sum', slug: 'two-sum' },
    },
  },
];
