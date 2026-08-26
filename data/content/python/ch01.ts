import type { Lesson } from '../types';

/**
 * Python Chapter 1 — Python Setup and Core Syntax.
 * Aimed at getting a first LeetCode submission to run, with emphasis on the
 * indentation and mutability rules that surprise people coming from C-family
 * languages.
 */
export const ch01: Lesson[] = [
  // -------------------------------------------------------------------------
  {
    topicId: 'python-1.1',
    language: 'python',
    summary: 'Read a Python file top to bottom and know what every line is doing.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Python has no required class, no `main`, no semicolons and no braces. A script is simply a sequence of statements executed top to bottom — which makes the smallest useful program one line long.',
      },
      {
        kind: 'code',
        caption: 'hello.py',
        code: `print("Ready for DSA")`,
        output: 'Ready for DSA',
      },
      {
        kind: 'text',
        body: 'Compare that with C++ or Java, which need a class, a `main`, an include and a return. Python\'s brevity is why it is often the fastest language to write a solution in — and why the syntax rarely gets in the way of the algorithm.',
      },
      {
        kind: 'code',
        caption: 'A more realistic file',
        code: `from typing import List


def two_sum(nums: List[int], target: int) -> List[int]:
    seen = {}
    for i, x in enumerate(nums):
        if target - x in seen:
            return [seen[target - x], i]
        seen[x] = i
    return []


if __name__ == "__main__":
    print(two_sum([2, 7, 11, 15], 9))`,
        output: '[0, 1]',
      },
      { kind: 'heading', text: 'Line by line' },
      {
        kind: 'table',
        headers: ['Part', 'What it does'],
        rows: [
          ['`from typing import List`', 'Type hints — optional, but LeetCode includes them'],
          ['`def name(params) -> ret:`', 'Defines a function; the colon opens a block'],
          ['`for i, x in enumerate(nums):`', 'Loops with both index and value'],
          ['`if x in seen:`', 'Membership test — O(1) on a dict or set'],
          ['`if __name__ == "__main__":`', 'Runs only when the file is executed directly'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Type hints are documentation, not enforcement',
        body: '`nums: List[int]` does not make Python check anything at runtime — you can still pass a string. They exist for readers and for tools like mypy. LeetCode includes them in every signature, so it is worth being able to read them; you are free to omit them in your own code.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'On LeetCode you write a method inside class Solution',
        body: 'LeetCode gives you `class Solution:` with one method taking `self` as its first parameter. You do not write a `main` — the judge calls your method directly. Forgetting `self`, or writing a bare function outside the class, produces an error before your logic ever runs.',
      },
      {
        kind: 'code',
        caption: 'The LeetCode shape',
        code: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        seen = {}
        for i, x in enumerate(nums):
            if target - x in seen:
                return [seen[target - x], i]
            seen[x] = i
        return []`,
      },
      {
        kind: 'text',
        body: 'The body is byte-for-byte identical to the standalone function above — only the `class` line and the `self` parameter differ. That is why practising locally with plain functions transfers directly to the judge.',
      },
    ],
    keyTakeaways: [
      'No class, no `main`, no semicolons — statements run top to bottom.',
      'A colon opens a block; the indented lines beneath it are the body.',
      'Type hints are documentation only and are never enforced at runtime.',
      'On LeetCode, write a method inside `class Solution` with `self` first.',
    ],
    practice: {
      prompt: 'Write `two_sum` as a standalone function with a `if __name__ == "__main__":` test, then convert it into a `class Solution` method by adding the class line and `self`. Confirm the body did not change at all — that equivalence is what makes local practice transfer.',
      leetcode: { title: 'Two Sum', slug: 'two-sum' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-1.2',
    language: 'python',
    summary: 'Understand why whitespace is syntax, and avoid the errors it causes.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Python uses **indentation** to group statements where other languages use braces. This is not a style convention — it is the actual syntax, and the interpreter enforces it.',
      },
      {
        kind: 'code',
        code: `if x > 0:
    print("positive")       # inside the if
    print("still inside")   # same block
print("always runs")        # outside — dedented`,
      },
      {
        kind: 'text',
        body: 'A colon opens a block; everything indented beneath it belongs to that block. Dedenting closes it. Nesting works the same way — each level is one more indent.',
      },
      {
        kind: 'code',
        code: `for i in range(3):
    for j in range(3):
        if i == j:
            print(i, j)     # three levels deep
    print("inner done")     # back to the outer for
print("all done")           # top level`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Four spaces, never tabs',
        body: 'PEP 8 specifies four spaces per level. Mixing tabs and spaces produces `TabError: inconsistent use of tabs and spaces in indentation` — and because both look identical on screen, it can be genuinely baffling. Set your editor to insert spaces for the Tab key and the problem disappears permanently.',
      },
      { kind: 'heading', text: 'The two errors you will see' },
      {
        kind: 'code',
        code: `# IndentationError: expected an indented block
if x > 0:
print("oops")               # must be indented after the colon

# IndentationError: unexpected indent
print("a")
    print("b")              # nothing opened a block here`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Indentation errors are usually caused by the line above',
        body: 'The interpreter reports the line where it noticed the problem, but the cause is nearly always the previous line — a missing colon, or a block that was never closed. When you get an `IndentationError`, look up one line first.',
      },
      { kind: 'heading', text: 'Where this bites in DSA' },
      {
        kind: 'code',
        caption: 'A misplaced return changes the algorithm',
        code: `# Returns after checking only the FIRST element
def has_target(nums, target):
    for x in nums:
        if x == target:
            return True
        return False        # ← wrong indent: inside the loop

# Correct — return False only after the whole loop
def has_target(nums, target):
    for x in nums:
        if x == target:
            return True
    return False            # ← dedented, outside the loop`,
      },
      {
        kind: 'text',
        body: 'Both versions run without error. The first is simply wrong, and the only difference is four spaces. This is the Python equivalent of C++\'s brace-less `if` bug — indentation being meaningful makes it a real correctness concern, not a formatting one.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Statements that need a body cannot be empty',
        body: 'An `if`, `for`, `def` or `class` with nothing indented beneath it is a syntax error. Use `pass` as a placeholder: `def todo(): pass`. There is no empty-braces equivalent.',
      },
      {
        kind: 'code',
        code: `def not_implemented_yet():
    pass                    # a legal, do-nothing body

for x in nums:
    pass                    # placeholder while you write the logic`,
      },
    ],
    keyTakeaways: [
      'Indentation is syntax — it defines blocks, replacing braces.',
      'Use four spaces and never tabs; mixing them causes a `TabError`.',
      'An `IndentationError` is usually caused by the line above it.',
      'A misplaced `return` inside a loop is a silent logic bug, not an error.',
    ],
    practice: {
      prompt: 'Write the `has_target` function with `return False` inside the loop, test it on `[1, 2, 3]` looking for 3, and watch it return False. Then dedent one level and confirm it works. Four spaces changed the algorithm — that is worth experiencing once.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-1.3',
    language: 'python',
    summary: 'Use variables without declaring types, and understand what a name really points at.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Python is **dynamically typed**: a variable has no declared type, and the same name can hold different kinds of value at different times. The *value* still has a type — the variable simply does not commit to one.',
      },
      {
        kind: 'code',
        code: `x = 5              # int
x = "hello"        # now a str — perfectly legal
x = [1, 2, 3]      # now a list

type(x)            # <class 'list'>
isinstance(x, list)  # True`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Dynamic, but still strongly typed',
        body: 'Python will not silently convert between unrelated types: `"5" + 5` raises `TypeError`, unlike JavaScript. So you get flexibility about *which* type a name holds, without the implicit coercions that make some languages unpredictable.',
      },
      { kind: 'heading', text: 'Names are references, not boxes' },
      {
        kind: 'code',
        code: `a = [1, 2, 3]
b = a              # b refers to the SAME list, not a copy
b.append(4)
print(a)           # [1, 2, 3, 4] — a changed too!

c = a.copy()       # a real (shallow) copy
c.append(5)
print(a)           # [1, 2, 3, 4] — unchanged`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'This is the single most common Python surprise',
        body: 'Assignment binds a *name* to an object; it never copies. For immutable values (int, str, tuple) you never notice, because you cannot modify them in place. For lists, dicts and sets it matters enormously — and it is why an "unrelated" list changing is such a common bug.',
      },
      {
        kind: 'code',
        caption: 'Copying properly',
        code: `import copy

b = a.copy()                  # shallow — top level only
b = a[:]                      # same thing, slice syntax
b = list(a)                   # same thing

grid2 = copy.deepcopy(grid)   # deep — nested lists copied too

# Why shallow is not enough for a 2D grid:
grid = [[0] * 3 for _ in range(3)]
shallow = grid.copy()
shallow[0][0] = 9
print(grid[0][0])             # 9 — the inner lists are shared!`,
      },
      { kind: 'heading', text: 'The 2D-grid initialisation trap' },
      {
        kind: 'code',
        code: `# BROKEN — all three rows are the SAME list object
grid = [[0] * 3] * 3
grid[0][0] = 1
print(grid)        # [[1, 0, 0], [1, 0, 0], [1, 0, 0]]

# CORRECT — a comprehension builds a fresh list each time
grid = [[0] * 3 for _ in range(3)]
grid[0][0] = 1
print(grid)        # [[1, 0, 0], [0, 0, 0], [0, 0, 0]]`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Never build a 2D grid with * on the outer list',
        body: '`[[0] * 3] * 3` repeats the *same inner list reference* three times, so writing to one row writes to all of them. `[[0] * cols for _ in range(rows)]` evaluates the inner expression fresh each iteration. This breaks every DP table and grid problem, and the symptom — rows changing together — is confusing until you know the cause.',
      },
      {
        kind: 'code',
        caption: 'Multiple assignment and swapping',
        code: `a, b = 1, 2
a, b = b, a             # swap — no temporary needed

x = y = 0               # both names point at the same 0 (fine for immutables)

left, right = 0, len(nums) - 1      # the two-pointer idiom

for i, x in enumerate(nums):        # index and value together
    ...`,
      },
      {
        kind: 'text',
        body: 'The tuple swap `a, b = b, a` is genuinely useful — it makes in-place reversals and partition steps a single readable line, with no temporary variable.',
      },
    ],
    keyTakeaways: [
      'Variables have no declared type, but values do and are not silently coerced.',
      'Assignment binds a name to an object — it never copies.',
      '`[[0] * c] * r` shares one inner list; use a comprehension instead.',
      '`a, b = b, a` swaps without a temporary.',
    ],
    practice: {
      prompt: 'Build a 3×3 grid with `[[0] * 3] * 3`, set `grid[0][0] = 1`, and print it — all three rows change. Then build it with a comprehension and confirm only one does. That single experiment prevents a bug you would otherwise spend an hour on.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-1.4',
    language: 'python',
    summary: 'Print results readably and read input, including the pitfalls of each.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: '`print()` is how you see what your program is thinking, and for your first weeks it doubles as your debugger. Python\'s version is unusually generous — it prints anything, separates arguments with spaces and adds a newline for you — which means most of this lesson is about the handful of times you want to override that helpfulness.',
      },
      {
        kind: 'code',
        caption: 'Output',
        code: `print("hello")                       # adds a newline
print("a", "b")                      # "a b" — space-separated by default
print("a", "b", sep="-")             # "a-b"
print("no newline", end="")          # suppress the newline

name, n = "DSA", 42
print(f"{name} has {n} items")       # f-string — the modern way
print(f"{3.14159:.2f}")              # "3.14" — two decimal places`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'f-strings are the only formatting you need',
        body: 'Prefix the string with `f` and put expressions in braces. They handle arithmetic (`f"{a+b}"`), formatting (`f"{x:.2f}"`), and even debugging (`f"{x=}"` prints `x=5`). They replaced `%` formatting and `.format()` entirely — use them everywhere.',
      },
      {
        kind: 'text',
        body: 'Unlike Java, printing a list works perfectly: `print([1, 2, 3])` shows `[1, 2, 3]`, and nested lists print readably too. There is no `Arrays.toString` equivalent needed.',
      },
      {
        kind: 'code',
        code: `print([1, 2, 3])                     # [1, 2, 3]
print([[1, 2], [3, 4]])              # [[1, 2], [3, 4]]
print({"a": 1})                      # {'a': 1}
print({1, 2, 3})                     # {1, 2, 3}`,
      },
      { kind: 'heading', text: 'Input' },
      {
        kind: 'code',
        code: `s = input()                          # always returns a STRING
n = int(input())                     # parse it yourself
a, b = map(int, input().split())     # two ints on one line

nums = list(map(int, input().split()))     # a whole line of ints
nums = [int(x) for x in input().split()]   # equivalent comprehension`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'input() always returns a string',
        body: '`input() + 1` raises `TypeError: can only concatenate str`, and `if input() == 5` is silently always false because `"5" != 5`. Every numeric input needs an explicit `int()` or `float()`. This is the most common beginner input bug in Python.',
      },
      {
        kind: 'code',
        caption: 'Reading n lines',
        code: `n = int(input())
nums = [int(input()) for _ in range(n)]

# Or a grid:
rows, cols = map(int, input().split())
grid = [list(map(int, input().split())) for _ in range(rows)]`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'sys.stdin for large input',
        body: '`input()` is slow for 10⁵ lines. `import sys; data = sys.stdin.read().split()` reads everything at once and is dramatically faster in contests. On LeetCode it never matters — arguments arrive as method parameters — but it is standard in competitive templates.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'On LeetCode, print only for debugging',
        body: 'The judge reads your **return value** and ignores stdout. Printing the answer instead of returning it gives "Wrong Answer" on code that looks right in your terminal. Remove debug prints before submitting — printing inside a loop over 10⁵ elements can also cause a timeout.',
      },
    ],
    keyTakeaways: [
      'f-strings handle all formatting: `f"{x:.2f}"`, `f"{a+b}"`, `f"{x=}"`.',
      'Lists, dicts and sets all print readably — no helper needed.',
      '`input()` always returns a string; parse it explicitly.',
      'The judge reads your return value, not what you print.',
    ],
    practice: {
      prompt: 'Read an integer and a line of space-separated numbers with `map(int, input().split())`, then print them formatted with an f-string. Then try `input() + 1` and read the `TypeError` — it is the error you will meet first.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-1.5',
    language: 'python',
    summary: 'Write comments and docstrings, and follow the conventions Python enforces socially.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'Comments are invisible to the interpreter, which makes them easy to skip — but in an interview the person watching your screen is judging whether they can follow your reasoning, and one line naming your approach helps more than any amount of tidy formatting. Write comments that explain **why**, not what.',
      },
      {
        kind: 'code',
        code: `# A single-line comment — everything after the hash is ignored.

x = 5  # an inline comment (two spaces before the hash, by convention)

"""
A triple-quoted string. Not technically a comment — it is a string
expression that gets discarded — but commonly used to block out text.
"""`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Python has no block-comment syntax',
        body: 'Triple-quoted strings are often used as one, but they are real string objects being created and thrown away. The genuine way to comment out several lines is `#` on each (Ctrl+/ in most editors). This matters inside a function, where a stray triple-quoted string is harmless but wasteful.',
      },
      { kind: 'heading', text: 'Docstrings' },
      {
        kind: 'code',
        code: `def binary_search(nums, target):
    """Return the index of target in sorted nums, or -1 if absent.

    Runs in O(log n) time and O(1) space.
    """
    ...

binary_search.__doc__      # the docstring is accessible at runtime
help(binary_search)        # and shown by help()`,
      },
      {
        kind: 'text',
        body: 'A string as the *first statement* of a function or class becomes its docstring — genuinely part of the language, unlike a comment. Tools and `help()` read it.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The habit that pays off in interviews',
        body: 'Put a one-line docstring on each solution stating the approach and complexity: `"""Sliding window with a frequency dict. O(n) time, O(k) space."""`. It forces you to articulate the approach before coding, and interviewers consistently read it as a signal of clear thinking.',
      },
      { kind: 'heading', text: 'PEP 8 — the conventions everyone follows' },
      {
        kind: 'table',
        headers: ['Convention', 'Example'],
        rows: [
          ['Functions and variables: `snake_case`', '`max_sum`, `def two_sum():`'],
          ['Classes: `PascalCase`', '`class ListNode:`'],
          ['Constants: `UPPER_SNAKE_CASE`', '`MOD = 10**9 + 7`'],
          ['Four spaces per indent level', '— never tabs'],
          ['Spaces around operators', '`a + b`, not `a+b`'],
          ['Two blank lines between top-level defs', '— one inside a class'],
        ],
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'LeetCode signatures use camelCase, not snake_case',
        body: 'LeetCode gives you `def twoSum(self, nums, target)` because the method names are shared across languages. Do not rename it — the judge calls that exact name. Your own helper methods can and should use `snake_case`, which is the mild inconsistency every Python LeetCode solution lives with.',
      },
      {
        kind: 'code',
        code: `class Solution:
    def twoSum(self, nums, target):          # given — leave it
        return self._solve(nums, target)     # your helper — snake_case

    def _solve(self, nums, target):          # leading _ means "internal"
        ...`,
      },
      {
        kind: 'text',
        body: 'A single leading underscore is the convention for "this is internal, do not call it from outside". Python does not enforce it, but every reader understands it.',
      },
    ],
    keyTakeaways: [
      '`#` for comments; Python has no true block-comment syntax.',
      'A string as a function\'s first statement is its docstring.',
      'PEP 8: `snake_case` functions, `PascalCase` classes, four spaces.',
      'Keep LeetCode\'s camelCase method name; use snake_case for your helpers.',
    ],
    practice: {
      prompt: 'Add a one-line docstring giving the approach and complexity to a solution you have written, then print its `__doc__`. If you cannot state the complexity in one line, that is a useful signal you do not yet fully understand your own solution.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-1.6',
    language: 'python',
    summary: 'Run Python code, and know what "interpreted" actually means for performance.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Python runs your file line by line instead of compiling it ahead of time. That is why you get instant feedback and no build step — and also why Python is roughly **10 to 100 times slower** than C++ on the same loop. Neither fact is a problem, but the second one shapes how you write DSA code, so it is worth understanding now rather than after a time-limit failure.',
      },
      {
        kind: 'code',
        caption: 'Running code',
        code: `python script.py             # run a file
python -i script.py          # run it, then drop into an interactive shell
python                       # the REPL — type expressions, see results
python -c "print(2+2)"       # run a one-liner`,
      },
      {
        kind: 'text',
        body: 'Python is **interpreted**: there is no separate compile step you invoke. The interpreter compiles source to bytecode internally (cached in `__pycache__`) and then executes it. That is why there is no `javac` equivalent and why syntax errors appear when you run rather than when you build.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The REPL is a genuine debugging tool',
        body: 'Typing `python` gives you an interactive prompt where you can test an expression instantly — check what `sorted("cab")` returns, or whether `-7 % 3` is 2. For DSA that immediate feedback loop is faster than writing a test file, and it is something C++ and Java simply do not offer.',
      },
      {
        kind: 'code',
        code: `>>> sorted("cab")
['a', 'b', 'c']
>>> -7 % 3
2
>>> divmod(17, 5)
(3, 2)
>>> [x*x for x in range(5)]
[0, 1, 4, 9, 16]`,
      },
      { kind: 'heading', text: 'Errors appear at runtime' },
      {
        kind: 'code',
        code: `def f():
    return undefined_name       # no error until f() is actually CALLED

print("this runs first")
f()                             # NameError raised here`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'A typo in an untaken branch will not be caught',
        body: 'Python only checks names when a line executes, so a misspelled variable inside an `if` that never fires stays hidden. C++ and Java catch this at compile time. It is the main downside of dynamic typing, and it is why testing edge-case branches matters more in Python.',
      },
      { kind: 'heading', text: 'The performance reality' },
      {
        kind: 'table',
        headers: ['', 'Rough relative speed'],
        rows: [
          ['C++', '1× (fastest)'],
          ['Java', '1–2×'],
          ['Python', '**10–100× slower**'],
        ],
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'LeetCode gives Python the same time limit',
        body: 'It does not scale the limit by language, so an O(n²) solution that passes in C++ may time out in Python. Two consequences: aim for the intended complexity rather than hoping a slightly slow approach squeaks through, and push work into built-ins — `sorted()`, `sum()`, `in` on a set — because those run in C rather than interpreted Python.',
      },
      {
        kind: 'code',
        caption: 'Built-ins are dramatically faster than manual loops',
        code: `# Slow — interpreted loop
total = 0
for x in nums:
    total += x

# Fast — the loop runs in C
total = sum(nums)

# Same idea:
mx = max(nums)
srt = sorted(nums)
found = target in num_set        # O(1), and in C`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Jupyter and notebooks',
        body: 'Notebooks run the same interpreter with cells you execute individually, keeping state between them. Useful for exploring a data structure interactively. Just remember that out-of-order cell execution can leave stale variables around — when something makes no sense, restart the kernel.',
      },
    ],
    keyTakeaways: [
      '`python script.py` — no separate compile step; bytecode is cached automatically.',
      'Errors surface at runtime, so typos in untaken branches stay hidden.',
      'Python is 10–100× slower than C++ with the same LeetCode time limit.',
      'Push work into built-ins like `sum`, `sorted` and `in` — they run in C.',
    ],
    practice: {
      prompt: 'Open the REPL and check `-7 % 3`, `sorted("cab")` and `divmod(17, 5)`. Then time summing a million numbers with a manual loop against `sum()` — the gap explains why "use the built-in" is real advice in Python, not just style.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-1.7',
    language: 'python',
    summary: 'Recognise the errors behind most failed Python submissions.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Nearly every error you hit in your first month is one of a small handful, repeated. That is good news: once you can recognise a traceback on sight, fixing it takes seconds instead of twenty frustrated minutes. Treat this lesson as a lookup table — skim it now, then return to it whenever Python raises something at you.',
      },
      { kind: 'heading', text: '1. Mutable default arguments' },
      {
        kind: 'code',
        code: `# BROKEN — the default list is created ONCE and reused across calls
def add(item, target=[]):
    target.append(item)
    return target

add(1)      # [1]
add(2)      # [1, 2]  ← not a fresh list!

# CORRECT
def add(item, target=None):
    if target is None:
        target = []
    target.append(item)
    return target`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Default arguments are evaluated once, at definition time',
        body: 'A mutable default — list, dict, set — is shared by every call that omits it. In DSA this bites in recursive helpers with `path=[]`, where results accumulate across calls. Use `None` and create the object inside. This is the most notorious Python gotcha there is.',
      },
      { kind: 'heading', text: '2. Modifying a list while iterating it' },
      {
        kind: 'code',
        code: `nums = [1, 2, 3, 4]
for x in nums:
    if x % 2 == 0:
        nums.remove(x)      # skips elements — [1, 3] is wrong for some inputs

# CORRECT — build a new list
nums = [x for x in nums if x % 2 != 0]

# Or iterate over a copy
for x in nums[:]:
    if x % 2 == 0:
        nums.remove(x)`,
      },
      { kind: 'heading', text: '3. Integer division vs true division' },
      {
        kind: 'code',
        code: `7 / 2               # 3.5  — ALWAYS a float in Python 3
7 // 2              # 3    — floor division
-7 // 2             # -4   — floors toward negative infinity, not zero!

mid = (low + high) // 2      # binary search needs // , not /`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: '/ gives a float, and // floors toward negative infinity',
        body: 'Using `/` for a midpoint gives `3.5` and then `nums[3.5]` raises `TypeError: list indices must be integers`. And `-7 // 2` is `-4`, whereas C++ and Java give `-3` — they truncate toward zero, Python floors. For negative values that is a genuine difference in behaviour.',
      },
      { kind: 'heading', text: '4. Modulo on negatives differs from C++' },
      {
        kind: 'code',
        code: `-7 % 3              # 2 in Python  (it is -1 in C++ and Java)

# So the ((a % m) + m) % m guard that C++ needs is unnecessary here —
# Python's % already returns a non-negative result for a positive modulus.`,
      },
      {
        kind: 'text',
        body: 'This is one of the rare cases where Python is *less* error-prone than C++: negative indices and hash buckets work without a correction. Worth knowing if you switch between languages, because the C++ habit is harmless but redundant here.',
      },
      { kind: 'heading', text: '5. Shadowing built-ins' },
      {
        kind: 'code',
        code: `list = [1, 2, 3]           # shadows the built-in list type
list(range(5))             # TypeError: 'list' object is not callable

# Also commonly shadowed: sum, max, min, str, dict, set, input, id, type
# Use nums, total, mx, mn instead.`,
      },
      { kind: 'heading', text: '6. is vs ==' },
      {
        kind: 'code',
        code: `a = [1, 2]
b = [1, 2]
a == b              # True  — same contents
a is b              # False — different objects

x = None
if x is None: ...   # correct — always use 'is' for None
if x == None: ...   # works but non-idiomatic`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Use == for values and is for None',
        body: '`is` asks "the same object", `==` asks "the same value". It appears to work for small integers because Python caches −5 to 256 — `256 is 256` is True while `257 is 257` may be False. The rule: `is` only for `None`, `True` and `False`.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'A thirty-second pre-submit checklist',
        body: 'Mutable defaults replaced with `None` · `//` not `/` for indices · not mutating a list while looping it · no shadowed built-ins · `is None` for null checks · returning rather than printing · recursion limit considered for deep recursion.',
      },
    ],
    keyTakeaways: [
      'Mutable default arguments are created once and shared across calls.',
      '`/` always returns a float; use `//` for indices and midpoints.',
      '`-7 % 3` is `2` in Python but `-1` in C++ — the safe-mod guard is unneeded.',
      'Use `==` for values and `is` only for `None`, `True`, `False`.',
    ],
    practice: {
      prompt: 'Write a function with `target=[]` as a default, call it three times, and watch results accumulate. Then compare `-7 // 2` and `-7 % 3` against what C++ would give. Then shadow `list` and try to call it — all three are errors that produce confusing symptoms rather than clear messages.',
    },
  },
];
