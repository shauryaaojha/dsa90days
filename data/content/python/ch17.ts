import type { Lesson } from '../types';

/**
 * Chapter 17 — Setting Up Your Workspace (Python).
 * Installing Python 3.12, configuring VS Code, navigating the terminal,
 * interpreting tracebacks, and building a disciplined local practice routine.
 */
export const ch17: Lesson[] = [
  // -------------------------------------------------------------------------
  // 17.1: Installing Python 3
  // -------------------------------------------------------------------------
  {
    topicId: 'python-17.1',
    language: 'python',
    summary: 'Install Python 3.12, verify the installation from the terminal, and configure the system PATH.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'To write and execute Python programs, you need the Python interpreter installed. A computer processor cannot run Python text directly; it executes machine instructions. The **interpreter** is a program that reads your source file, converts each statement into bytecode, and carries out the instructions step by step.',
      },
      { kind: 'heading', text: 'Installing Python 3.12 and configuring PATH' },
      {
        kind: 'text',
        body: 'Download Python from python.org or install it via a package manager. Choose Python 3.12 or newer. On Windows, enable **Add python.exe to PATH** during installation. The **PATH** is an environment variable listing folders where executable programs live. Without it, the terminal cannot find Python when invoked.',
      },
      {
        kind: 'code',
        caption: 'Checking the installed version in your terminal',
        code: `# Windows (PowerShell / Command Prompt):
python --version

# macOS or Linux:
python3 --version`,
        output: 'Python 3.12.3',
      },
      { kind: 'heading', text: 'The interactive shell (REPL)' },
      {
        kind: 'text',
        body: 'Running Python without arguments starts the **REPL** (Read-Eval-Print Loop). The `>>>` prompt lets you evaluate expressions and inspect variables interactively. Type `exit()` and press Enter to return to the terminal prompt.',
      },
      {
        kind: 'code',
        caption: 'Testing arithmetic inside the REPL',
        code: `>>> 20 + 22
42
>>> print("Python 3 is configured")
Python 3 is configured
>>> exit()`,
        output: 'Python 3 is configured',
      },
      {
        kind: 'table',
        headers: ['Platform', 'Version Command', 'Installation Method'],
        rows: [
          ['Windows', '`python --version`', 'python.org installer (check Add to PATH)'],
          ['macOS', '`python3 --version`', 'Homebrew (`brew install python@3.12`) or python.org'],
          ['Linux (Ubuntu)', '`python3 --version`', 'APT package manager (`sudo apt install python3`)'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'The unchecked PATH checkbox on Windows',
        body: 'If you install Python on Windows without selecting "Add python.exe to PATH", typing `python` in PowerShell opens the Windows Store or reports command not found. To fix this, re-run the installer, select **Modify**, check the PATH box, and complete the wizard.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Python 2 versus Python 3',
        body: 'Python 2 is obsolete. Modern contest platforms and interview runners use Python 3. On macOS and Linux, `python` may point to legacy Python 2; use `python3` if `python --version` outputs a version starting with 2.',
      },
    ],
    keyTakeaways: [
      'The Python interpreter translates source text into bytecode and executes it instruction by instruction.',
      'Adding Python to the system PATH allows the terminal to invoke the interpreter from any folder.',
      'Verify your setup by running `python --version` or `python3 --version` to confirm version 3.12 or newer.',
    ],
    practice: {
      prompt: 'Open your terminal or command prompt. Run the command to check your installed Python version. Then launch the interactive interpreter, compute 37 * 43, print your name, and exit back to the terminal prompt.',
    },
  },

  // -------------------------------------------------------------------------
  // 17.2: Setting up VS Code for Python
  // -------------------------------------------------------------------------
  {
    topicId: 'python-17.2',
    language: 'python',
    summary: 'Configure Visual Studio Code with the official Python extension and select the active interpreter.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A dedicated code editor provides syntax highlighting, indentation, error checking, and integrated terminal access. Visual Studio Code (VS Code) is widely used for Python programming, but requires configuring the Python language environment.',
      },
      { kind: 'heading', text: 'Installing the Python extension' },
      {
        kind: 'text',
        body: 'Open the Extensions view by pressing `Ctrl+Shift+X` (`Cmd+Shift+X` on macOS). Search for **Python** published by Microsoft and click Install. This extension bundles language intelligence through Pylance, providing real-time syntax checking, parameter hints, and code completion as you type.',
      },
      { kind: 'heading', text: 'Selecting the Python interpreter' },
      {
        kind: 'text',
        body: 'When multiple Python installations exist on your machine, VS Code must be told which one to use. Open the Command Palette using `Ctrl+Shift+P` (`Cmd+Shift+P` on macOS), type `Python: Select Interpreter`, and choose your Python 3.12 installation. The selected version appears in the bottom status bar.',
      },
      {
        kind: 'table',
        headers: ['Action', 'Windows / Linux', 'macOS'],
        rows: [
          ['Command Palette', '`Ctrl+Shift+P`', '`Cmd+Shift+P`'],
          ['Toggle Terminal', '`Ctrl+\``', '`Cmd+\``'],
          ['Extensions View', '`Ctrl+Shift+X`', '`Cmd+Shift+X`'],
          ['Save File', '`Ctrl+S`', '`Cmd+S`'],
          ['Toggle Comment', '`Ctrl+/`', '`Cmd+/`'],
        ],
      },
      { kind: 'heading', text: 'Essential editor settings' },
      {
        kind: 'text',
        body: 'Two editor settings prevent common beginner mistakes: **Auto Save**, which writes modified buffers to disk whenever focus changes, and **Tab Size**, which should be 4 spaces to adhere to standard Python formatting conventions (PEP 8).',
      },
      {
        kind: 'code',
        caption: 'Recommended settings in .vscode/settings.json',
        code: `{
  "python.defaultInterpreterPath": "python3",
  "files.autoSave": "onFocusChange",
  "editor.tabSize": 4,
  "editor.insertSpaces": true
}`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Running unsaved file buffers',
        body: 'If Auto Save is disabled and you edit a file without saving, the changes exist only in memory. Running the script from the terminal executes the old version stored on disk. Turn on Auto Save under File > Auto Save to eliminate this issue.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Spaces versus tabs in Python indentation',
        body: 'Python uses indentation to delimit code blocks. Mixing tabs and spaces in the same file raises an `IndentationError`. Configure VS Code to convert every press of the Tab key into 4 spaces.',
      },
    ],
    keyTakeaways: [
      'The official Microsoft Python extension equips VS Code with code completion, type inspection, and linting.',
      'Use the Command Palette (`Ctrl+Shift+P`) to set the interpreter path via `Python: Select Interpreter`.',
      'Enable Auto Save and 4-space indentation to avoid running stale files or encountering indentation syntax errors.',
    ],
    practice: {
      prompt: 'Launch VS Code, open an empty folder, install the Microsoft Python extension, and use the Command Palette to select your Python 3.12 interpreter. Verify that the bottom status bar displays Python 3.12.',
    },
  },

  // -------------------------------------------------------------------------
  // 17.3: Running a script from the terminal
  // -------------------------------------------------------------------------
  {
    topicId: 'python-17.3',
    language: 'python',
    summary: 'Navigate directories in the terminal, execute Python scripts, and process console input.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'The terminal provides direct control over program execution, argument passing, and standard input/output streams. Running code from the terminal helps you observe runtime behavior, monitor execution time, and diagnose errors without intermediary editor buttons.',
      },
      { kind: 'heading', text: 'Working directory and file navigation' },
      {
        kind: 'text',
        body: 'The **working directory** is the folder where your active terminal session is located. When you instruct Python to run `solution.py`, the terminal looks inside the active working directory. If you are in a different folder, the operating system cannot locate the file.',
      },
      {
        kind: 'table',
        headers: ['PowerShell (Windows)', 'Bash / Zsh (macOS & Linux)', 'Function'],
        rows: [
          ['`pwd`', '`pwd`', 'Print working directory path'],
          ['`dir` or `ls`', '`ls`', 'List files in current directory'],
          ['`cd folder_name`', '`cd folder_name`', 'Change directory into folder_name'],
          ['`cd ..`', '`cd ..`', 'Move up one directory level'],
        ],
      },
      { kind: 'heading', text: 'Writing and running a script' },
      {
        kind: 'text',
        body: 'Create a file named `greet.py`. The script reads input with `input()`, converts strings to integers with `int()`, computes an arithmetic expression, and prints formatted text using an f-string.',
      },
      {
        kind: 'code',
        caption: 'greet.py',
        code: `name = input("Enter your name: ")
age_str = input("Enter your age: ")
age = int(age_str)

years_left = 100 - age
print(f"Hello, {name}! You reach 100 in {years_left} years.")`,
        output: 'Enter your name: Ada\nEnter your age: 20\nHello, Ada! You reach 100 in 80 years.',
      },
      {
        kind: 'code',
        caption: 'Executing greet.py from the terminal',
        code: `# Navigate to the folder containing greet.py
cd dsa-setup

# Run the Python script
python greet.py

# On macOS/Linux if python invokes Python 2:
python3 greet.py`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'FileNotFoundError: [Errno 2] No such file or directory',
        body: 'This error indicates that Python searched the active directory and found no matching file. Run `pwd` to inspect your current directory and `ls` or `dir` to view files. Use `cd` to navigate into the directory containing your script before running.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'The input() function always returns a string',
        body: 'In Python, `input()` captures user input as a string (`str`). Attempting arithmetic on the raw return value raises a `TypeError`. Explicitly convert numeric inputs using `int()` or `float()` before performing arithmetic.',
      },
    ],
    keyTakeaways: [
      'The terminal evaluates file paths relative to your active working directory.',
      'Execute Python scripts using `python filename.py` (or `python3 filename.py`).',
      'Resolve `FileNotFoundError` by checking your location with `pwd` and navigating with `cd`.',
    ],
    practice: {
      prompt: 'Create a file named `multiply.py` that prompts the user for two integers using `input()`, computes their product, and prints the result. Run the script from the terminal and confirm it produces the expected calculation.',
    },
  },

  // -------------------------------------------------------------------------
  // 17.4: Online interpreters and the LeetCode editor
  // -------------------------------------------------------------------------
  {
    topicId: 'python-17.4',
    language: 'python',
    summary: 'Understand the difference between local scripts and the LeetCode online judge execution model.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Online judges evaluate algorithms by compiling and running code in a secure container. Unlike standalone scripts where you write input handling and execution entry points, platforms such as LeetCode provide a class structure and invoke your method with test data loaded into memory.',
      },
      { kind: 'heading', text: 'Local scripts versus class Solution' },
      {
        kind: 'text',
        body: 'On LeetCode, every problem provides a boilerplate structure consisting of `class Solution:` containing a method definition. The online judge imports your solution, instantiates the class, and calls the method directly. Your code must return the computed result using a `return` statement rather than printing it to the terminal.',
      },
      {
        kind: 'code',
        caption: 'LeetCode method structure for Add Two Integers',
        code: `class Solution:
    def sum(self, num1: int, num2: int) -> int:
        return num1 + num2`,
      },
      {
        kind: 'text',
        body: 'Notice the `self` parameter in the method signature. In Python, class methods take `self` as the first argument, representing the class instance. The judge passes problem inputs (`num1` and `num2`) as subsequent arguments. You do not pass an argument for `self` when testing.',
      },
      {
        kind: 'table',
        headers: ['Aspect', 'Local Script', 'LeetCode Online Judge'],
        rows: [
          ['Entry point', 'Top-to-bottom script or `main` block', 'Method inside `class Solution`'],
          ['Input source', '`input()` or hardcoded variables', 'Passed into method arguments by judge'],
          ['Result delivery', '`print()` output displayed in terminal', '`return` value verified against expected answer'],
          ['Standard modules', 'Must write explicit `import` statements', '`collections`, `heapq`, `math` pre-imported'],
          ['Allowed packages', 'Any package in local environment', 'Python Standard Library only'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Printing an answer instead of returning it',
        body: 'Writing `print(answer)` instead of `return answer` inside a LeetCode method leaves the return value as `None`. The online judge compares `None` against the expected output and marks the test case as **Wrong Answer**. Always return the result.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Excessive print statements trigger Time Limit Exceeded',
        body: 'Writing `print()` outputs text to the "Stdout" section of the test console. While convenient for diagnosing small test cases, console output is slow. A loop running 100,000 iterations with a print statement will exceed the time limit (TLE). Remove all debug print calls before submitting.',
      },
    ],
    keyTakeaways: [
      'LeetCode creates an instance of `class Solution` and checks the value returned by your method.',
      'Input data is supplied through method parameters, not via `input()` prompts.',
      'Core standard modules like `collections` and `heapq` are pre-imported in the LeetCode Python environment.',
    ],
    practice: {
      prompt: 'Open LeetCode problem 2235 (Add Two Integers). Review the method signature provided in the editor, implement the calculation using `return num1 + num2`, run the test suite, and submit the solution.',
      leetcode: { title: 'Add Two Integers', slug: 'add-two-integers' },
    },
  },

  // -------------------------------------------------------------------------
  // 17.5: Reading your first traceback
  // -------------------------------------------------------------------------
  {
    topicId: 'python-17.5',
    language: 'python',
    summary: 'Decode Python tracebacks from bottom to top to identify exception names, locations, and causes.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'When a Python program encounters an error during execution, it halts and prints a **traceback**. A traceback details the active call stack at the failure point, showing the exact cause and location so you can diagnose bugs without guessing.',
      },
      { kind: 'heading', text: 'The bottom-to-top reading rule' },
      {
        kind: 'text',
        body: 'A traceback prints function calls chronologically, ending with the specific operation that failed. Always read a traceback from the bottom line upward. The bottom line names the exception type and explains what went wrong. The line immediately above points to the file name, line number, and statement that triggered the exception.',
      },
      {
        kind: 'code',
        caption: 'A script that triggers an IndexError',
        code: `def get_third(items):
    return items[2]


data = [10, 20]
result = get_third(data)
print(result)`,
      },
      {
        kind: 'code',
        caption: 'The resulting terminal traceback',
        code: `Traceback (most recent call last):
  File "example.py", line 6, in <module>
    result = get_third(data)
  File "example.py", line 2, in get_third
    return items[2]
IndexError: list index out of range`,
      },
      { kind: 'heading', text: 'Common exceptions in DSA practice' },
      {
        kind: 'table',
        headers: ['Exception Name', 'Underlying Cause', 'Prevention Strategy'],
        rows: [
          ['`IndexError`', 'List index outside bounds (`i >= len(arr)`)', 'Verify bounds: `0 <= i < len(arr)`'],
          ['`KeyError`', 'Dictionary key does not exist', 'Use `key in my_dict` or `my_dict.get(key)`'],
          ['`TypeError`', 'Incompatible types (e.g. `str + int`)', 'Check types and apply explicit conversions'],
          ['`ZeroDivisionError`', 'Dividing or modulo by zero (`x // 0`)', 'Guard with `if divisor != 0:`'],
          ['`RecursionError`', 'Exceeding recursion depth (missing base case)', 'Ensure branches reach a base condition'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Start at the bottom line',
        body: 'When a traceback appears in your terminal, look at the last line first to read the exception name (such as `IndexError: list index out of range`). Then look one line above to identify the source file and line number where the issue occurred.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'SyntaxError occurs before execution starts',
        body: 'A `SyntaxError` or `IndentationError` indicates that Python was unable to parse the file into valid grammar. Because parsing happens prior to execution, no part of your program runs when a syntax error is present. In contrast, runtime exceptions like `KeyError` occur while the program is actively executing.',
      },
    ],
    keyTakeaways: [
      'Read tracebacks starting from the final line to identify the exception type and diagnostic message.',
      'The line preceding the exception points to the exact file path and line number of the faulty statement.',
      'Distinguish parsing errors (`SyntaxError`) that prevent execution from runtime exceptions (`IndexError`, `KeyError`).',
    ],
    practice: {
      prompt: 'Write a small script that defines a dictionary with keys "a" and "b". Deliberately attempt to access key "c". Run the script, inspect the traceback from bottom to top, locate the reported line number, and then update the code using `dict.get()` to handle the missing key safely.',
    },
  },

  // -------------------------------------------------------------------------
  // 17.6: Naming, saving and organising practice files
  // -------------------------------------------------------------------------
  {
    topicId: 'python-17.6',
    language: 'python',
    summary: 'Organise your DSA workspace with consistent folder hierarchies, zero-padded filenames, and clean templates.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Over a 90-day practice sprint, you will write hundreds of solutions. Storing files under generic names like `temp.py` or `sol.py` prevents reviewing past solutions or identifying recurring patterns.',
      },
      { kind: 'heading', text: 'Recommended workspace directory layout' },
      {
        kind: 'text',
        body: 'Create a dedicated directory named `dsa-python`. Inside, partition problems into topic subdirectories corresponding to algorithmic categories.',
      },
      {
        kind: 'code',
        caption: 'Directory tree for structured DSA practice',
        code: `dsa-python/
├── 01-arrays/
│   ├── 0001_two_sum.py
│   └── 0026_remove_duplicates.py
└── 02-two-pointers/
    └── 0125_valid_palindrome.py`,
      },
      { kind: 'heading', text: 'File naming rules' },
      {
        kind: 'table',
        headers: ['Rule', 'Example', 'Purpose'],
        rows: [
          ['Zero-padding', '`0001_two_sum.py`', 'Preserves numerical sorting in file explorers'],
          ['Snake case', '`valid_palindrome.py`', 'Follows Python conventions without spaces'],
          ['`.py` extension', '`0121_stock.py`', 'Identifies the file as Python code'],
        ],
      },
      { kind: 'heading', text: 'Anatomy of a local solution file' },
      {
        kind: 'text',
        body: 'A standard practice file includes a header docstring, the solution class matching LeetCode, and an `if __name__ == "__main__":` test block.',
      },
      {
        kind: 'code',
        caption: '0001_two_sum.py complete template',
        code: `"""
LeetCode 1: Two Sum
Time: O(n) | Space: O(n)
"""
from typing import List


class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        seen = {}
        for i, val in enumerate(nums):
            diff = target - val
            if diff in seen:
                return [seen[diff], i]
            seen[val] = i
        return []


if __name__ == "__main__":
    sol = Solution()
    assert sol.twoSum([2, 7, 11, 15], 9) == [0, 1]
    print("Tests passed.")`,
        output: 'Tests passed.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Never name practice files after standard library modules',
        body: 'If you name a file `math.py`, `random.py`, `queue.py`, or `heapq.py`, Python searches the local directory first on import. Scripts executing `import math` in that folder import your local file instead of the standard library, causing an `AttributeError`.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Zero-padding preserves directory sorting',
        body: 'Alphabetical sorting places `10_file.py` before `2_file.py`. Padding problem numbers to four digits (`0002_` and `0010_`) ensures solutions sort numerically in terminals and IDE sidebars.',
      },
    ],
    keyTakeaways: [
      'Organise your practice repository into topic-based subfolders.',
      'Name solution files with four-digit zero-padded numbers and snake case (e.g. `0001_two_sum.py`).',
      'Never name practice files after standard modules like `queue.py` or `math.py` to prevent import collisions.',
    ],
    practice: {
      prompt: 'Create folder `dsa-python/01-arrays` and add `0001_two_sum.py` using the template above with docstrings, `class Solution`, and local assertions. Run it from your terminal to verify that all tests pass.',
    },
  },

  // -------------------------------------------------------------------------
  // 17.7: A daily practice routine: local file, run, submit
  // -------------------------------------------------------------------------
  {
    topicId: 'python-17.7',
    language: 'python',
    summary: 'Master the five-step problem-solving routine from understanding constraints to local testing and LeetCode submission.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Writing code directly in the browser editor encourages unreflective guessing. Submitting untested code produces avoidable penalties and reinforces poor habits. A disciplined daily workflow grounds your practice in careful reading, local testing, and systematic verification.',
      },
      { kind: 'heading', text: 'The five-step daily routine' },
      {
        kind: 'table',
        headers: ['Step', 'Phase', 'Action'],
        rows: [
          ['1', 'Understand', 'Read constraints and trace sample inputs on paper'],
          ['2', 'Scaffold', 'Create `0XXX_slug.py` and set up the local test harness'],
          ['3', 'Test locally', 'Write the algorithm and verify edge cases with `assert`'],
          ['4', 'Run on LeetCode', 'Paste `class Solution` and test against sample inputs'],
          ['5', 'Submit', 'Submit solution and record complexity in docstring'],
        ],
      },
      { kind: 'heading', text: 'Building a local test harness with assert' },
      {
        kind: 'text',
        body: 'The built-in `assert` statement tests conditions. If the condition is `True`, execution continues silently. If `False`, Python raises an `AssertionError` and halts immediately. This provides instant verification for multiple test cases in a single run.',
      },
      {
        kind: 'code',
        caption: 'Local testing template for Concatenation of Array',
        code: `from typing import List


class Solution:
    def getConcatenation(self, nums: List[int]) -> List[int]:
        return nums + nums


if __name__ == "__main__":
    solver = Solution()
    assert solver.getConcatenation([1, 2, 1]) == [1, 2, 1, 1, 2, 1]
    assert solver.getConcatenation([7]) == [7, 7]
    print("Tests passed.")`,
        output: 'Tests passed.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'The blind submit habit',
        body: 'Submitting directly to the online judge without verifying edge cases locally leads to avoidable Wrong Answer submissions. Test boundary inputs (single elements, empty inputs, negative numbers, duplicates) on your machine before submitting.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Diagnosing a failed submission',
        body: 'When LeetCode reports Wrong Answer or Runtime Error, it displays the exact input that caused the failure. Do not guess fixes in the browser. Copy the failing input directly into your local `assert` block, reproduce the failure in your terminal, inspect variable states, and submit only after the local assertion passes.',
      },
    ],
    keyTakeaways: [
      'Adhere to the five-step routine: understand, scaffold, test locally, run online, and submit.',
      'Use `assert` statements in an `if __name__ == "__main__":` block to validate multiple test cases in a single run.',
      'When a submission fails on a test case, add that exact input to your local file to reproduce and resolve it locally.',
    ],
    practice: {
      prompt: 'Practice the complete five-step workflow on LeetCode problem 1929 (Concatenation of Array). Create `01929_concatenation_of_array.py` locally, implement the method, verify standard and edge cases using `assert`, and submit the solution on LeetCode.',
      leetcode: { title: 'Concatenation of Array', slug: 'concatenation-of-array' },
    },
  },
];
