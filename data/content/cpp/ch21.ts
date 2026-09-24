import type { Lesson } from '../types';

/**
 * Chapter 21 — Setting Up Your Workspace.
 * Everything a student needs to install modern C++ tools, configure VS Code,
 * compile from the terminal, decode errors, and establish a daily practice routine.
 */
export const ch21: Lesson[] = [
  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-21.1',
    language: 'cpp',
    summary: 'Install a modern C++ compiler like g++ or clang and verify it from the terminal.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'To write and run C++ programs, your computer requires a **compiler**. A compiler is a program that reads the human-readable text you write—called **source code**—and translates it into binary instructions your processor can execute directly, known as **machine code**.',
      },
      {
        kind: 'text',
        body: 'In C++, the two standard free compilers are **GCC** (which provides the `g++` command) and **Clang** (which provides `clang++`). Both implement modern C++ standards and are used on online judges.',
      },
      { kind: 'heading', text: 'Installing on your operating system' },
      {
        kind: 'table',
        headers: ['Operating System', 'Toolchain', 'Verification Command'],
        rows: [
          ['Windows 10 / 11', 'MinGW-w64 (via MSYS2 or WinLibs)', '`g++ --version`'],
          ['macOS', 'Apple Clang (via Xcode Command Line Tools)', '`clang++ --version`'],
          ['Linux (Ubuntu/Debian)', 'GCC (`build-essential` package)', '`g++ --version`'],
        ],
      },
      {
        kind: 'text',
        body: 'On Windows, download a standalone distribution of **MinGW-w64** and extract it to a permanent folder such as `C:\\mingw64`. On macOS, open Terminal and run `xcode-select --install`. On Ubuntu or Debian Linux, run `sudo apt update && sudo apt install build-essential`.',
      },
      { kind: 'heading', text: 'The PATH environment variable' },
      {
        kind: 'text',
        body: 'Your operating system needs to know where compiler executables live. The **PATH environment variable** is a list of folders searched whenever you enter a command. If the `bin` folder containing `g++.exe` is omitted from PATH, the terminal reports that the command was not recognized.',
      },
      {
        kind: 'code',
        caption: 'Verifying your compiler from the terminal',
        code: `// Run in terminal or PowerShell:
// g++ --version
// Expected output:
// g++ (GCC) 13.2.0
// Copyright (C) 2023 Free Software Foundation, Inc.`,
        output: 'g++ (GCC) 13.2.0',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Forgetting to add the bin folder to PATH',
        body: 'A frequent obstacle on Windows is extracting MinGW to `C:\\mingw64` but forgetting to add `C:\\mingw64\\bin` to system Environment Variables. When this happens, typing `g++` produces: `The term \'g++\' is not recognized`. Ensure the folder containing `g++.exe` is in your PATH, and restart your terminal.',
      },
      {
        kind: 'code',
        caption: 'A minimal verification program',
        code: `#include <iostream>
using namespace std;

int main() {
    cout << "C++ compiler is ready!" << endl;
    return 0;
}`,
        output: 'C++ compiler is ready!',
      },
    ],
    keyTakeaways: [
      'A compiler translates human-readable source code into runnable machine code.',
      '`g++` and `clang++` are the primary compilers used for competitive programming and DSA.',
      'The `PATH` variable tells your operating system where compiler executables reside.',
      'Running `g++ --version` verifies that the compiler is installed and discoverable.',
    ],
    practice: {
      prompt: 'Open your terminal (PowerShell on Windows, Terminal on macOS or Linux) and run `g++ --version` or `clang++ --version`. If the command fails, locate your compiler directory, add its `bin` folder to your system PATH, restart the terminal, and verify the output.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-21.2',
    language: 'cpp',
    summary: 'Install and configure Visual Studio Code with the C/C++ extension for smooth local problem solving.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A **code editor** is a tool designed for writing and navigating plain text source code. Visual Studio Code (VS Code) is the most widely used editor in competitive programming and software engineering.',
      },
      {
        kind: 'text',
        body: 'VS Code is an editor, not a compiler. It provides an interface to edit and organize code, but relies on your installed `g++` or `clang++` compiler to actually build and run programs.',
      },
      { kind: 'heading', text: 'Essential extensions for C++' },
      {
        kind: 'text',
        body: 'By default, VS Code treats C++ files as plain text. Open the Extensions view (`Ctrl + Shift + X` on Windows and Linux, `Cmd + Shift + X` on macOS) and install the official **C/C++ extension** from Microsoft. This adds **IntelliSense**, which provides auto-completion, parameter hints, syntax highlighting, and live error detection.',
      },
      {
        kind: 'table',
        headers: ['Feature', 'What it does', 'Benefit for DSA'],
        rows: [
          ['Syntax Highlighting', 'Colors keywords, types, and strings differently', 'Makes code structure readable and spots typos'],
          ['IntelliSense', 'Suggests method names and container functions', 'Speeds up typing standard library calls'],
          ['Error Squiggles', 'Underlines syntax mistakes with red wavy lines', 'Alerts you to errors before running the compiler'],
          ['Integrated Terminal', 'Hosts a terminal directly inside the editor window', 'Allows compiling and running without switching apps'],
        ],
      },
      { kind: 'heading', text: 'Configuring the C++ language standard' },
      {
        kind: 'text',
        body: 'C++ evolves through numbered language standards, such as C++11, C++17, and C++20. Online judges like LeetCode run modern C++ (C++17 or C++20). If VS Code defaults to an older standard, it marks valid modern syntax with false error squiggles.',
      },
      {
        kind: 'code',
        caption: 'Testing modern C++17 syntax in VS Code',
        code: `#include <iostream>
#include <utility>
using namespace std;

int main() {
    pair<int, string> student = {101, "Aarav"};
    auto [rollNumber, name] = student; // C++17 structured binding

    cout << "Roll: " << rollNumber << ", Name: " << name << endl;
    return 0;
}`,
        output: 'Roll: 101, Name: Aarav',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'False red squiggles from outdated standard settings',
        body: 'If VS Code underlines valid modern C++ with red squiggles, open settings (`Ctrl + ,`), search for `C_Cpp: Default Cpp Standard`, and set it to `c++17` or `c++20`. This synchronizes editor checks with your compiler.',
      },
      {
        kind: 'text',
        body: 'Press `Ctrl + \`` (backtick) to toggle the integrated terminal. The terminal opens directly in your active workspace directory, ready for compilation commands.',
      },
    ],
    keyTakeaways: [
      'VS Code is an editor that delegates compilation to `g++` or `clang++`.',
      'The Microsoft C/C++ extension provides IntelliSense and immediate syntax diagnostics.',
      'Configure the C++ standard to `c++17` or `c++20` to eliminate false error squiggles.',
      'Use the integrated terminal (`Ctrl + \``) to compile and test code within the editor.',
    ],
    practice: {
      prompt: 'Install VS Code and the Microsoft C/C++ extension. Create `verify_vscode.cpp`, paste the C++17 structured binding snippet, and verify that IntelliSense shows no red error squiggles. Toggle the integrated terminal with `Ctrl + \``.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-21.3',
    language: 'cpp',
    summary: 'Compile C++ programs directly from the terminal using standard competitive programming flags.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Relying on editor "Run" buttons hides the build process and makes troubleshooting difficult. Compiling directly from the command line gives you complete clarity on how code is built, optimized, and executed.',
      },
      {
        kind: 'text',
        body: 'When compiling with `g++`, you pass **compiler flags** (options beginning with a dash) to specify language standards, error checking rigor, and output locations.',
      },
      { kind: 'heading', text: 'The standard competitive programming command' },
      {
        kind: 'code',
        caption: 'The standard build command',
        code: `g++ -std=c++17 -Wall -Wextra -O2 main.cpp -o main`,
      },
      { kind: 'heading', text: 'What each flag achieves' },
      {
        kind: 'table',
        headers: ['Flag', 'Name', 'Why It Matters'],
        rows: [
          ['`-std=c++17`', 'Standard version', 'Enables modern C++17 features matching LeetCode'],
          ['`-Wall`', 'All warnings', 'Catches uninitialised variables and logic typos'],
          ['`-Wextra`', 'Extra warnings', 'Flags subtle bugs like signed/unsigned comparisons'],
          ['`-O2`', 'Optimization', 'Enables compiler optimizations matching judge performance'],
          ['`-o main`', 'Output binary', 'Names the output `main` instead of default `a.out`'],
        ],
      },
      { kind: 'heading', text: 'Running the compiled executable' },
      {
        kind: 'text',
        body: 'After compilation, run the binary from the current directory. In Windows PowerShell, execute `.\\main.exe`. In macOS or Linux bash, execute `./main`. The leading prefix tells the terminal to look in the active folder.',
      },
      {
        kind: 'code',
        caption: 'A complete program to compile and run',
        code: `#include <iostream>
using namespace std;

int main() {
    int width = 8, height = 5;
    cout << "Area: " << (width * height) << endl;
    return 0;
}`,
        output: 'Area: 40',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Chaining compile and run into one line',
        body: 'Chain the commands to iterate rapidly. In Windows PowerShell: `g++ -std=c++17 -Wall main.cpp -o main; .\\main.exe`. In macOS or Linux: `g++ -std=c++17 -Wall main.cpp -o main && ./main`. The `&&` operator ensures the program runs only if compilation succeeds.',
      },
    ],
    keyTakeaways: [
      'Compiling from the terminal reveals how source code converts into a standalone executable.',
      'Flags like `-std=c++17` and `-Wall` enforce standard syntax and catch subtle bugs early.',
      'Execute the binary with `.\\program.exe` on Windows or `./program` on macOS and Linux.',
      'Chain compile and execute commands to iterate quickly without GUI buttons.',
    ],
    practice: {
      prompt: 'Create `multiply.cpp` with a program that reads two numbers using `cin` and prints their product. In the terminal, compile with `g++ -std=c++17 -Wall multiply.cpp -o multiply`, run the executable, and test it with several inputs.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-21.4',
    language: 'cpp',
    summary: 'Understand the LeetCode online judge environment, pre-included headers, and how class Solution functions.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Moving from local files to an online judge like LeetCode changes how code runs. In local files, you write `main()`, read input with `cin`, and print with `cout`. Online judges evaluate code differently.',
      },
      {
        kind: 'text',
        body: 'Platforms like LeetCode provide a **class Solution** containing a single method. The judge runs a hidden **test harness** (a driver program) that instantiates your class, passes arguments directly into the method, and asserts the returned value.',
      },
      { kind: 'heading', text: 'Local files versus online judges' },
      {
        kind: 'table',
        headers: ['Aspect', 'Local File', 'LeetCode Judge'],
        rows: [
          ['Entry point', 'Requires `int main()`', 'Hidden driver calls your method in `class Solution`'],
          ['Headers', 'Must write `#include` lines', 'Standard headers are pre-included automatically'],
          ['Input', 'Read from console with `cin`', 'Passed as typed function parameters'],
          ['Output', 'Printed to terminal with `cout`', 'Returned with a `return` statement'],
          ['Validation', 'Manually checked by programmer', 'Automated assertion against test cases'],
        ],
      },
      { kind: 'heading', text: 'Connecting the two models' },
      {
        kind: 'text',
        body: 'Here is how a LeetCode problem maps to a local test file. The algorithm inside `findMax` is identical in both places.',
      },
      {
        kind: 'code',
        caption: 'Testing a LeetCode method locally',
        code: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

// This class is what you submit on LeetCode:
class Solution {
public:
    int findMax(vector<int>& nums) {
        int highest = nums[0];
        for (int x : nums) highest = max(highest, x);
        return highest;
    }
};

// This driver tests the class on your machine:
int main() {
    Solution solver;
    vector<int> sample = {12, 45, 7, 89, 23};
    cout << "Max: " << solver.findMax(sample) << endl;
    return 0;
}`,
        output: 'Max: 89',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Debug print statements can cause Time Limit Exceeded (TLE)',
        body: 'Writing `cout << val << endl;` prints to the Stdout panel on LeetCode. However, terminal I/O is slow. Printing inside loops on large inputs will trigger Time Limit Exceeded even if your algorithmic complexity is optimal. Remove or comment out debug print statements before submitting.',
      },
    ],
    keyTakeaways: [
      'LeetCode requires implementing a method inside `class Solution` rather than a full program.',
      'The judge passes test inputs as function arguments and checks the returned result.',
      'Standard library headers and namespace declarations are pre-loaded by the judge.',
      'Remove debug `cout` statements before final submission to avoid I/O-related timeouts.',
    ],
    practice: {
      prompt: 'Open the LeetCode problem "Two Sum". Inspect the starter code template and parameter signatures. Write a short local harness in VS Code that creates a `Solution` object and tests it with sample vectors.',
      leetcode: { title: 'Two Sum', slug: 'two-sum' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-21.5',
    language: 'cpp',
    summary: 'Read and diagnose compiler error messages methodically instead of feeling overwhelmed by verbose output.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Compiler errors are an everyday part of programming. In C++, a small syntax mistake can trigger dozens of lines of diagnostic text. While this output looks intimidating, compiler error messages follow a consistent structure that pinpoints the exact location of the issue.',
      },
      {
        kind: 'text',
        body: 'Every compiler diagnostic begins with four colon-separated components: the **filename**, the **line number**, the **column number**, and the **message severity** with an explanation.',
      },
      { kind: 'heading', text: 'Anatomy of an error message' },
      {
        kind: 'code',
        caption: 'Deconstructing a compiler diagnostic',
        code: `// solution.cpp:8:5: error: expected ';' before 'return'
//  ^file       ^line ^col  ^severity and explanation`,
      },
      { kind: 'heading', text: 'The Golden Rule: Fix the first error first' },
      {
        kind: 'text',
        body: 'Compilers parse code sequentially. After the first mistake, the parser loses alignment with your code and emits numerous **cascading errors** that are not real problems. Always scroll to the top of the terminal output and fix only the first reported error. Recompiling usually clears most or all downstream errors.',
      },
      {
        kind: 'table',
        headers: ['Message Pattern', 'Common Cause', 'Fix'],
        rows: [
          ['`expected \';\' before ...`', 'Missing semicolon on this or previous line', 'Check the end of the preceding statement'],
          ['`was not declared in this scope`', 'Typo or missing variable declaration', 'Verify spelling and ensure declaration precedes use'],
          ['`no matching function for call to`', 'Wrong argument count or mismatched types', 'Compare arguments against function signature'],
          ['`undefined reference to \'main\'`', 'Executable missing entry point', 'Add `int main()` when compiling a standalone file'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Missing semicolons often point to the next line',
        body: 'When you omit a semicolon, the compiler does not know the statement was supposed to end. It keeps reading until it hits the first token of the next line. Therefore, an `expected \';\'` error usually points to the line *after* the line missing the semicolon.',
      },
      {
        kind: 'code',
        caption: 'A deliberate syntax error example',
        code: `#include <iostream>
using namespace std;

int main() {
    int count = 10; // Omitting this semicolon triggers an error on the line below!
    cout << "Count: " << count << endl;
    return 0;
}`,
        output: 'Count: 10',
      },
    ],
    keyTakeaways: [
      'Compiler errors specify `file:line:column` indicating where the compiler encountered trouble.',
      'Always fix the very first error first; subsequent warnings and errors are often cascading noise.',
      'Semicolon errors frequently highlight the beginning of the next line.',
      '`not declared in this scope` indicates a spelling error, missing header, or undeclared variable.',
    ],
    practice: {
      prompt: 'Create `broken.cpp` with three intentional errors: omit a semicolon, misspell `vector` as `vektor`, and call a function with missing arguments. Run `g++ -Wall broken.cpp`, locate the first error from top output, fix it, and recompile to watch the error count shrink.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-21.6',
    language: 'cpp',
    summary: 'Set up an organized folder and file structure for your daily problem-solving solutions to facilitate future revision.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Interview preparation involves solving hundreds of algorithmic problems over several months. Beginners often save solutions as `test.cpp`, `temp.cpp`, or `sol.cpp` on their Desktop. Within weeks, locating past solutions to review becomes impossible.',
      },
      {
        kind: 'text',
        body: 'A clean folder structure allows you to find solutions in seconds, review core patterns before interviews, and maintain a track record of your learning progress.',
      },
      { kind: 'heading', text: 'Recommended folder organization' },
      {
        kind: 'code',
        caption: 'Standard directory layout for DSA practice',
        code: `dsa-practice/
├── 01-arrays-and-strings/
│   ├── 0001-two-sum.cpp
│   ├── 0026-remove-duplicates.cpp
│   └── 0242-valid-anagram.cpp
├── 02-two-pointers/
│   ├── 0015-3sum.cpp
│   └── 0125-valid-palindrome.cpp
└── templates/
    └── solution_template.cpp`,
      },
      { kind: 'heading', text: 'File naming rules' },
      {
        kind: 'text',
        body: 'Follow three conventions for solution files: use lowercase letters, separate words with hyphens instead of spaces, and prefix filenames with the four-digit problem number. Number prefixes keep files sorted in order matching online judge problem IDs.',
      },
      {
        kind: 'table',
        headers: ['Style', 'Example', 'Evaluation'],
        rows: [
          ['Spaces and capitals', '`My Two Sum.cpp`', 'Poor: spaces break terminal commands without quotes'],
          ['Arbitrary names', '`code.cpp`', 'Poor: impossible to search or remember contents later'],
          ['Structured slug', '`0001-two-sum.cpp`', 'Optimal: matches problem URL, sorts cleanly, shell-friendly'],
        ],
      },
      { kind: 'heading', text: 'Reusable solution template' },
      {
        kind: 'text',
        body: 'Add a header comment block to each file to record the problem link and algorithmic complexity for quick revision.',
      },
      {
        kind: 'code',
        caption: 'solution_template.cpp — starter skeleton',
        code: `/**
 * Problem: 0001 - Two Sum
 * Link:    https://leetcode.com/problems/two-sum/
 * Pattern: Hash Map
 * Time:    O(n) | Space: O(n)
 */

#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> seen;
        for (int i = 0; i < (int)nums.size(); i++) {
            int complement = target - nums[i];
            if (seen.count(complement)) return {seen[complement], i};
            seen[nums[i]] = i;
        }
        return {};
    }
};

int main() {
    Solution solver;
    vector<int> nums = {2, 7, 11, 15};
    vector<int> ans = solver.twoSum(nums, 9);
    if (!ans.empty()) cout << ans[0] << " " << ans[1] << endl;
    return 0;
}`,
        output: '0 1',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Never use spaces in code filenames',
        body: 'Filenames with spaces require quotation marks in terminal commands (`g++ "two sum.cpp"`). Omitted quotes cause the compiler to treat words as multiple separate files. Hyphenated names like `0001-two-sum.cpp` enable tab-completion in the shell without quoting issues.',
      },
    ],
    keyTakeaways: [
      'Group solutions by topic folder (e.g. `01-arrays`, `02-two-pointers`) for organized revision.',
      'Prefix filenames with four-digit problem numbers and use hyphens instead of spaces.',
      'Include a header comment noting the problem link, pattern, and complexity.',
      'Maintain a reusable template file to start new problems quickly.',
    ],
    practice: {
      prompt: 'Create a `dsa-practice` directory with subfolders `01-arrays` and `templates`. In `templates`, create `solution_template.cpp` with a header comment block and a clean `class Solution` outline. Copy it into `01-arrays` as `0001-two-sum.cpp`.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-21.7',
    language: 'cpp',
    summary: 'Adopt a disciplined 5-step daily routine: understand constraints, code locally, test edge cases, and submit.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A common pitfall is coding directly in the browser editor and repeatedly clicking "Submit" after minor guesses. This trial-and-error approach builds bad habits for technical interviews where code must be reasoned through systematically before running.',
      },
      {
        kind: 'text',
        body: 'Adopting a disciplined 5-step routine turns practice into deliberate engineering skill. Working locally gives you full editor support, builds an archive of tested code, and deepens debugging ability.',
      },
      { kind: 'heading', text: 'The 5-step problem solving cycle' },
      {
        kind: 'table',
        headers: ['Step', 'Action', 'Key Objective'],
        rows: [
          ['1. Analyze Constraints', 'Read problem statement and input bounds', 'Determine target complexity (e.g. O(n) vs O(n^2))'],
          ['2. Plan on Paper', 'Trace examples and outline logic', 'Verify the approach before writing C++ syntax'],
          ['3. Implement Locally', 'Write clean code in VS Code', 'Leverage formatting, autocomplete, and compiler warnings'],
          ['4. Test Edge Cases', 'Run `main()` with boundary inputs', 'Catch off-by-one errors and empty inputs offline'],
          ['5. Submit and Archive', 'Copy `class Solution` to judge and save file', 'Confirm acceptance and store for future revision'],
        ],
      },
      { kind: 'heading', text: 'Testing boundary inputs locally' },
      {
        kind: 'text',
        body: 'Before submitting, test your solution locally with boundary cases: single elements, empty inputs, negative numbers, and duplicates. Catching a bug locally takes seconds; debugging a failed judge submission takes much longer.',
      },
      {
        kind: 'code',
        caption: 'A complete local workflow implementation for Concatenation of Array',
        code: `#include <iostream>
#include <vector>
using namespace std;

class Solution {
public:
    vector<int> getConcatenation(vector<int>& nums) {
        int n = nums.size();
        vector<int> ans(2 * n);
        for (int i = 0; i < n; i++) {
            ans[i] = nums[i];
            ans[i + n] = nums[i];
        }
        return ans;
    }
};

int main() {
    Solution solver;

    // Test case 1: Standard input
    vector<int> t1 = {1, 2, 1};
    vector<int> r1 = solver.getConcatenation(t1);
    for (int x : r1) cout << x << " ";
    cout << endl;

    // Test case 2: Single-element boundary
    vector<int> t2 = {7};
    vector<int> r2 = solver.getConcatenation(t2);
    for (int x : r2) cout << x << " ";
    cout << endl;

    return 0;
}`,
        output: '1 2 1 1 2 1 \n7 7',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Only copy class Solution to the judge',
        body: 'When moving your code from your local file to LeetCode, copy only the `class Solution` block. Do not copy `#include` lines or the local `main()` function into the online editor; the platform wraps your class in its own test harness.',
      },
      {
        kind: 'text',
        body: 'After your submission is accepted, review top community submissions to discover alternative idioms or standard library functions.',
      },
    ],
    keyTakeaways: [
      'Follow the 5-step cycle: analyze bounds, plan logic, code locally, test boundary inputs, and submit.',
      'Local testing catches boundary bugs before you incur submission penalties.',
      'Copy only the `class Solution` definition to the online judge editor.',
      'Archive every accepted solution with complexity notes for interview review.',
    ],
    practice: {
      prompt: 'Follow the 5-step routine to solve "Concatenation of Array": create `01-arrays-and-strings/1929-concatenation-of-array.cpp`, write `getConcatenation`, test both normal and single-element inputs locally with `main()`, compile from terminal, and submit the `class Solution` on LeetCode.',
      leetcode: { title: 'Concatenation of Array', slug: 'concatenation-of-array' },
    },
  },
];
