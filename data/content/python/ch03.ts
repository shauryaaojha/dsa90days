import type { Lesson } from '../types';

/**
 * Python Chapter 3 — Functions.
 * Definition, arguments, scope, closures and lambdas — with the mutable-default
 * and late-binding traps given the weight they deserve.
 */
export const ch03: Lesson[] = [
  // -------------------------------------------------------------------------
  {
    topicId: 'python-3.1',
    language: 'python',
    summary: 'Define functions, and know what Python does with the ones you write.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A function is a named block of code you can run whenever you like. Splitting a solution into functions is not tidiness for its own sake — it is how you hold a hard problem in your head, because each piece can be understood and tested alone. Python\'s version is unusually light on ceremony: `def`, a name, brackets, a colon.',
      },
      {
        kind: 'code',
        caption: 'The anatomy',
        code: `def add(a, b):
    """Return the sum of a and b."""
    return a + b
#   ^keyword ^name ^parameters ^colon opens the block

result = add(3, 5)`,
      },
      {
        kind: 'text',
        body: 'No return type, no access modifier, no class required. The colon opens the block and indentation defines the body — the same rule as `if` and `for`.',
      },
      {
        kind: 'code',
        caption: 'With type hints, as LeetCode writes them',
        code: `from typing import List, Optional

def two_sum(nums: List[int], target: int) -> List[int]:
    ...

def find(root: Optional[TreeNode]) -> Optional[TreeNode]:
    ...`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Type hints are never enforced',
        body: 'Python ignores them at runtime — you can pass a string where `int` is annotated and nothing complains. They exist for readers and for tools like mypy. Read them on LeetCode signatures; write them in your own code if you find them useful, but they change no behaviour.',
      },
      { kind: 'heading', text: 'Functions are objects' },
      {
        kind: 'code',
        code: `def square(x):
    return x * x

f = square              # bind another name to the same function
f(4)                    # 16

def apply(fn, value):   # pass a function as an argument
    return fn(value)

apply(square, 4)        # 16

sorted(words, key=len)  # this is why key= works — len is just an object`,
      },
      {
        kind: 'text',
        body: 'A function is a first-class value: assignable, passable, storable in a list or dict. That is what makes `key=`, `map()` and callbacks work without any special syntax.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'square and square() are different things',
        body: '`f = square` binds the function; `f = square(4)` calls it and binds the *result*. Passing `sorted(words, key=len())` instead of `key=len` is the classic version of this mistake — the parentheses call it immediately and pass the wrong thing.',
      },
      { kind: 'heading', text: 'Every function returns something' },
      {
        kind: 'code',
        code: `def no_return():
    x = 5

print(no_return())      # None — there is always a return value`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'A missing return gives None, silently',
        body: 'Java refuses to compile a non-void method that can fall off the end; Python just returns `None`. If your solution returns `None` where a number was expected, look for a code path with no `return` — on LeetCode this shows as a wrong answer rather than an error.',
      },
      {
        kind: 'code',
        caption: 'The LeetCode shape',
        code: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        return self._helper(nums, target)     # call helpers via self

    def _helper(self, nums, target):          # leading _ means "internal"
        ...`,
      },
      {
        kind: 'text',
        body: 'Methods take `self` as their first parameter and call each other through `self.`. Forgetting either is a common first-day error — `self` is explicit in Python where it is implicit in Java and C++.',
      },
    ],
    keyTakeaways: [
      '`def name(params):` — no return type, no modifiers, indentation defines the body.',
      'Type hints are documentation and are never enforced at runtime.',
      'Functions are objects: `f = square` binds it, `f = square()` calls it.',
      'A function with no `return` returns `None` silently.',
    ],
    practice: {
      prompt: 'Write a function, bind it to another name, and pass it to `sorted` as `key=`. Then write one whose loop can fall through without returning and confirm it yields `None` rather than erroring.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-3.2',
    language: 'python',
    summary: 'Take inputs and return results — including several values at once.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Parameters are what a function needs; the return value is what it hands back. Python is far more relaxed than Java here — a function can return **several values at once**, which removes all the awkwardness of wrapping results in an array. And a function with no `return` still returns something: `None`.',
      },
      {
        kind: 'code',
        code: `def divide(a, b):
    return a // b, a % b        # returns a TUPLE

q, r = divide(17, 5)            # unpacked into two names
result = divide(17, 5)          # or kept as a tuple: (3, 2)`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Multiple return values are just a tuple',
        body: 'There is no special syntax — `return a, b` builds a tuple and `x, y = f()` unpacks it. This is far lighter than Java, where you need an array or a class, and it is why Python solutions returning two values read so cleanly.',
      },
      {
        kind: 'code',
        caption: 'Unpacking variations',
        code: `a, b, c = 1, 2, 3
a, *rest = [1, 2, 3, 4]         # a = 1, rest = [2, 3, 4]
first, *middle, last = [1,2,3,4] # first=1, middle=[2,3], last=4
_, value = get_pair()           # _ conventionally means "ignore this"`,
      },
      { kind: 'heading', text: 'Arguments are passed by object reference' },
      {
        kind: 'code',
        code: `def modify(lst):
    lst.append(4)               # MUTATES the caller's list

def reassign(lst):
    lst = [9, 9]                # rebinds the LOCAL name only

nums = [1, 2, 3]
modify(nums)
print(nums)                     # [1, 2, 3, 4] — changed

reassign(nums)
print(nums)                     # [1, 2, 3, 4] — unchanged`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'You can mutate the object, never rebind the caller\'s name',
        body: 'This is exactly Java\'s rule. `lst.append(4)` reaches through the shared reference; `lst = [...]` only changes what this function\'s local name points at. It is why a helper can build up a shared result list with no copying — and why "reassigning the parameter" silently does nothing.',
      },
      {
        kind: 'code',
        caption: 'The consequence in DSA',
        code: `def dfs(node, result):          # result is shared — no copying
    if not node:
        return
    result.append(node.val)
    dfs(node.left, result)
    dfs(node.right, result)

def preorder(root):
    result = []
    dfs(root, result)
    return result`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Immutable arguments always behave like copies',
        body: 'Integers, strings and tuples cannot be mutated, so a function can never change the caller\'s value — `def f(n): n += 1` never affects anything. To "return" an updated number you must actually return it, exactly as in Java.',
      },
      { kind: 'heading', text: 'Returning early' },
      {
        kind: 'code',
        code: `def find(nums, target):
    for i, x in enumerate(nums):
        if x == target:
            return i            # exits immediately
    return -1                   # the fallback — do not forget it

def process(x):
    if x < 0:
        return                  # bare return → returns None
    ...`,
      },
      {
        kind: 'text',
        body: 'A bare `return` exits with `None`, which is the idiomatic way to leave a void-style function early. Guard clauses using it keep recursive code flat.',
      },
    ],
    keyTakeaways: [
      '`return a, b` returns a tuple; `x, y = f()` unpacks it.',
      'Arguments share the object — mutation is visible, rebinding is not.',
      'A shared list parameter costs nothing and is the standard accumulator.',
      'A bare `return` exits with `None`.',
    ],
    practice: {
      prompt: 'Write a function returning two values and unpack them. Then write `modify` and `reassign` on the same list and confirm only the first is visible to the caller — that distinction explains every parameter surprise in Python.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-3.3',
    language: 'python',
    summary: 'Give parameters fallback values — and avoid the most notorious Python bug.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A default value lets the caller leave an argument out — handy for recursive helpers where the first call passes extra state. It also hides the most famous trap in the language: **a default is created once, when the function is defined, not each time it is called.** With a list or dict as the default, that is a genuine bug, and this lesson shows exactly how it bites.',
      },
      {
        kind: 'code',
        code: `def power(base, exp=2):
    return base ** exp

power(5)        # 25 — exp defaults to 2
power(5, 3)     # 125`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Defaults must be the trailing parameters',
        body: '`def f(a=1, b)` is a syntax error — once one parameter has a default, every parameter after it must too. Otherwise a call like `f(5)` would be ambiguous about which parameter the 5 belongs to.',
      },
      { kind: 'heading', text: 'The mutable default trap' },
      {
        kind: 'code',
        code: `# BROKEN — the list is created ONCE, at definition time, and reused
def add(item, target=[]):
    target.append(item)
    return target

add(1)      # [1]
add(2)      # [1, 2]   ← not a fresh list!
add(3)      # [1, 2, 3]

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
        title: 'Default values are evaluated once, when the function is defined',
        body: 'Not on each call. So a mutable default — list, dict, set — is a single object shared by every call that omits it. This is the most notorious gotcha in Python, and in DSA it bites hardest in recursive helpers written as `def dfs(node, path=[])`, where results leak between top-level calls.',
      },
      {
        kind: 'code',
        caption: 'The DSA version of the bug',
        code: `# BROKEN — path persists across separate calls to collect()
def collect(node, path=[]):
    if not node:
        return
    path.append(node.val)
    ...

# CORRECT
def collect(node, path=None):
    if path is None:
        path = []
    ...`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Immutable defaults are perfectly safe',
        body: '`def f(x=0)`, `def f(s="")`, `def f(t=())` are all fine — they cannot be mutated, so sharing one object is harmless. The rule is only about mutable defaults: lists, dicts and sets.',
      },
      { kind: 'heading', text: 'Where defaults genuinely help' },
      {
        kind: 'code',
        code: `# Recursive helpers — hide the bookkeeping from the entry call
def helper(nums, index=0):
    if index == len(nums):
        return 0
    return nums[index] + helper(nums, index + 1)

helper(nums)                # clean — no need to pass 0

def dfs(node, depth=0):
    if not node:
        return
    print("  " * depth, node.val)
    dfs(node.left, depth + 1)
    dfs(node.right, depth + 1)

dfs(root)                   # starts at depth 0 automatically`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Defaults are evaluated in the defining scope, not the calling one',
        body: '`def f(x=some_global)` captures the value `some_global` had *when the function was defined*. Changing the global later does not change the default. Another consequence of once-only evaluation, and another reason to prefer `None` plus an explicit assignment.',
      },
    ],
    keyTakeaways: [
      'Default values are evaluated once, at definition time.',
      'A mutable default is shared across every call — use `None` and create inside.',
      'Immutable defaults (`0`, `""`, `()`) are safe.',
      'Defaults keep recursive helper entry calls clean by hiding bookkeeping.',
    ],
    practice: {
      prompt: 'Write the `add(item, target=[])` version, call it three times, and watch results accumulate. Then fix it with `None`. This is the single most famous Python gotcha and worth causing on purpose once.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-3.4',
    language: 'python',
    summary: 'Pass arguments by position or by name, and read *args and **kwargs.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Arguments can be passed by **position** (order matters) or by **name** (order does not). Naming them costs a few characters and buys real clarity — `dfs(node, depth=0)` says more than `dfs(node, 0)`. You will also meet `*args` and `**kwargs` in library signatures, so it is worth being able to read them even if you rarely write them.',
      },
      {
        kind: 'code',
        code: `def describe(name, age, city):
    ...

describe("Ana", 20, "Chennai")                   # positional
describe(name="Ana", age=20, city="Chennai")     # keyword
describe("Ana", city="Chennai", age=20)          # mixed — keywords can reorder`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Positional arguments must come before keyword ones',
        body: '`describe(name="Ana", 20)` is a syntax error. Once you start using keywords, everything after must also be a keyword. The rule exists because otherwise the interpreter could not tell which position a later positional argument refers to.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Keywords make calls self-documenting',
        body: '`binary_search(nums, target, reverse=True)` is far clearer than `binary_search(nums, target, True)`, where the reader has to look up what the third argument means. For boolean flags especially, always use the keyword form.',
      },
      { kind: 'heading', text: '*args — any number of positional arguments' },
      {
        kind: 'code',
        code: `def total(*nums):
    return sum(nums)            # nums is a TUPLE inside

total()             # 0
total(1, 2, 3)      # 6

# Unpacking at the call site — the same star, opposite direction
values = [1, 2, 3]
total(*values)      # 6 — spreads the list into separate arguments`,
      },
      {
        kind: 'code',
        caption: 'Where you actually meet the unpacking form',
        code: `pairs = [(1, 2), (3, 4)]
list(zip(*pairs))               # [(1, 3), (2, 4)] — transposes

grid = [[1, 2], [3, 4]]
transposed = list(zip(*grid))   # [(1, 3), (2, 4)]

print(*nums)                    # prints elements separated by spaces
print(*nums, sep=", ")`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'zip(*grid) transposes a matrix in one line',
        body: 'It unpacks each row as a separate argument to `zip`, which then pairs them column-wise. Rotate-Image and similar problems become two lines: transpose, then reverse each row. Worth memorising — it is one of Python\'s genuine expressive wins over C++ and Java.',
      },
      { kind: 'heading', text: '**kwargs — any number of keyword arguments' },
      {
        kind: 'code',
        code: `def configure(**options):
    for key, value in options.items():      # options is a DICT inside
        print(key, value)

configure(debug=True, level=3)

settings = {"debug": True, "level": 3}
configure(**settings)           # unpacks a dict into keyword arguments`,
      },
      {
        kind: 'code',
        caption: 'The full parameter order',
        code: `def f(positional, default=1, *args, keyword_only, **kwargs):
    ...
# positional → defaults → *args → keyword-only → **kwargs`,
      },
      {
        kind: 'text',
        body: 'Anything after `*args` becomes **keyword-only** — it cannot be passed positionally. You will rarely define such a function in DSA, but you will call plenty: `sorted(iterable, key=..., reverse=...)` has keyword-only parameters, which is why you must write `reverse=True` rather than `sorted(nums, None, True)`.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'The single star as a separator',
        body: '`def f(a, *, b)` forces `b` to be passed by keyword: `f(1, b=2)` works, `f(1, 2)` does not. You will see this in library signatures. It exists to stop callers depending on argument order for options.',
      },
    ],
    keyTakeaways: [
      'Positional arguments must precede keyword arguments.',
      '`*args` collects positionals into a tuple; `**kwargs` collects keywords into a dict.',
      'The same `*` at a call site unpacks — `zip(*grid)` transposes a matrix.',
      'Parameters after `*args` or a bare `*` are keyword-only.',
    ],
    practice: {
      prompt: 'Transpose a 2D list with `list(zip(*grid))` and confirm it works. Then write a function taking `*args` and call it both with separate values and with `*a_list`. That one star, used both ways, is worth being fluent with.',
      leetcode: { title: 'Rotate Image', slug: 'rotate-image' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-3.5',
    language: 'python',
    summary: 'Know where names are visible, and why assignment inside a function is special.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Python resolves a name by searching four scopes in order: **Local**, **Enclosing**, **Global**, **Built-in** — the LEGB rule.',
      },
      {
        kind: 'code',
        code: `x = "global"

def outer():
    x = "enclosing"

    def inner():
        x = "local"
        print(x)        # local

    inner()
    print(x)            # enclosing

outer()
print(x)                # global`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Python has no block scope',
        body: 'A variable created inside an `if` or `for` is visible for the rest of the *function* — unlike C++ and Java, where it dies at the closing brace. So `for i in range(n): ...` leaves `i` alive afterwards, and a name first assigned inside an `if` may or may not exist depending on whether the branch ran.',
      },
      {
        kind: 'code',
        code: `def f(flag):
    if flag:
        result = 1
    return result       # UnboundLocalError when flag is False`,
      },
      { kind: 'heading', text: 'Assignment makes a name local for the whole function' },
      {
        kind: 'code',
        code: `count = 0

def bump():
    count += 1          # UnboundLocalError: local variable 'count'
                        # referenced before assignment

# Python sees the assignment and treats 'count' as LOCAL throughout the
# function — including on the right-hand side, where it does not yet exist.`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Reading a global is fine; assigning to it makes the name local',
        body: 'This asymmetry surprises everyone. `print(count)` inside a function reads the global happily. But `count += 1` makes `count` local for the *entire* function body, so the read on the right-hand side fails. The error message points at the read, while the cause is the assignment.',
      },
      {
        kind: 'code',
        caption: 'The three fixes',
        code: `# 1. global — modify a module-level name
def bump():
    global count
    count += 1

# 2. nonlocal — modify an enclosing function's name
def outer():
    count = 0
    def inner():
        nonlocal count
        count += 1
    inner()
    return count

# 3. Mutate instead of rebinding — no declaration needed
def outer():
    count = [0]
    def inner():
        count[0] += 1       # mutation, not assignment
    inner()
    return count[0]`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The list-of-one trick avoids nonlocal entirely',
        body: '`count = [0]` then `count[0] += 1` mutates the existing list rather than rebinding the name, so no declaration is needed. It is the same workaround Java needs for the identical reason, and it appears constantly in recursive closures that accumulate a value.',
      },
      { kind: 'heading', text: 'In DSA: use self, not global' },
      {
        kind: 'code',
        code: `class Solution:
    def diameterOfBinaryTree(self, root):
        self.best = 0                    # instance attribute — clean
        self._depth(root)
        return self.best

    def _depth(self, node):
        if not node:
            return 0
        l, r = self._depth(node.left), self._depth(node.right)
        self.best = max(self.best, l + r)      # no nonlocal needed
        return 1 + max(l, r)`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Reset instance state in the public method',
        body: 'LeetCode may call your method several times on one `Solution` object, so `self.best` still holds the previous test case\'s value. Assigning it fresh at the top of the public method — as above — is what prevents "passes test 1, fails everything after".',
      },
    ],
    keyTakeaways: [
      'Names resolve Local → Enclosing → Global → Built-in.',
      'Python has no block scope — loop and `if` variables outlive their block.',
      'Assigning to a name makes it local for the whole function; use `global`/`nonlocal` or mutate.',
      'In DSA prefer `self.x` over globals, and reset it in the public method.',
    ],
    practice: {
      prompt: 'Write a function that does `count += 1` on a global and read the `UnboundLocalError`. Fix it three ways — `global`, `nonlocal` in a nested function, and the `count = [0]` mutation trick. The third is what you will actually use.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-3.6',
    language: 'python',
    summary: 'Define functions inside functions, and use closures for recursive helpers.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'A function defined inside another function can **see the outer function\'s variables**. That sounds academic until you write your first DFS: the inner helper can read `grid`, `visited` and `res` without any of them being passed down through every recursive call. This is the standard shape of a Python LeetCode solution, so it is worth learning properly.',
      },
      {
        kind: 'code',
        code: `def outer(n):
    def inner(x):           # defined fresh on every call to outer
        return x * n        # captures n from the enclosing scope
    return inner

double = outer(2)
double(5)                   # 10`,
      },
      {
        kind: 'text',
        body: 'A nested function can read names from its enclosing function — that combination of a function plus its captured environment is a **closure**. It is what makes recursive helpers so clean in Python.',
      },
      { kind: 'heading', text: 'The DSA pattern this enables' },
      {
        kind: 'code',
        caption: 'A recursive helper with no parameters to thread',
        code: `class Solution:
    def preorder(self, root):
        result = []

        def dfs(node):
            if not node:
                return
            result.append(node.val)     # captured from the enclosing scope
            dfs(node.left)
            dfs(node.right)

        dfs(root)
        return result`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'This is the most idiomatic Python solution shape',
        body: 'The inner `dfs` reads `result` directly — no parameter, no `self`, no reset needed because `result` is created fresh on every call to the outer method. It is cleaner than both the parameter-passing form and the instance-attribute form, and it is what most Python LeetCode solutions look like.',
      },
      {
        kind: 'code',
        caption: 'Capturing several things at once',
        code: `def solve(self, grid):
    rows, cols = len(grid), len(grid[0])
    visited = set()

    def dfs(r, c):
        if not (0 <= r < rows and 0 <= c < cols):    # rows, cols captured
            return
        if (r, c) in visited or grid[r][c] == 0:     # visited, grid captured
            return
        visited.add((r, c))
        for dr, dc in ((-1,0), (1,0), (0,-1), (0,1)):
            dfs(r + dr, c + dc)

    dfs(0, 0)`,
      },
      {
        kind: 'text',
        body: 'Compare that with the C++ or Java version, which must pass `grid`, `rows`, `cols` and `visited` through every recursive call. The closure captures them once and the recursive signature stays down to the two things that actually change.',
      },
      { kind: 'heading', text: 'Reading is free; writing needs nonlocal' },
      {
        kind: 'code',
        code: `def solve():
    count = 0

    def bump():
        count += 1              # UnboundLocalError

    def bump_fixed():
        nonlocal count          # declares intent to rebind the outer name
        count += 1

    # Or avoid the issue by mutating:
    total = [0]
    def bump_alt():
        total[0] += 1           # no declaration needed`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Appending to a captured list needs no declaration',
        body: '`result.append(x)` is a mutation, not an assignment, so it works without `nonlocal`. But `result = []` or `count += 1` rebinds the name and fails. That is why accumulating into a list is so much smoother than accumulating into a number — and why `best = [0]` shows up in closures that track a maximum.',
      },
      { kind: 'heading', text: 'Late binding in loops' },
      {
        kind: 'code',
        code: `funcs = []
for i in range(3):
    funcs.append(lambda: i)         # all capture the SAME i

[f() for f in funcs]                # [2, 2, 2] — not [0, 1, 2]!

# Fix: bind the current value as a default argument
funcs = [lambda i=i: i for i in range(3)]
[f() for f in funcs]                # [0, 1, 2]`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Closures capture the variable, not its value',
        body: 'All three lambdas refer to the same `i`, which is 2 by the time they run. The default-argument trick evaluates `i` at definition time and freezes it. This is rare in DSA but appears whenever you build a list of callbacks in a loop.',
      },
    ],
    keyTakeaways: [
      'A nested function captures names from its enclosing scope — a closure.',
      'The inner-`dfs`-reading-`result` pattern is the idiomatic Python solution shape.',
      'Mutating a captured object is free; rebinding a captured name needs `nonlocal`.',
      'Closures capture the variable, not its value — hence late binding in loops.',
    ],
    practice: {
      prompt: 'Rewrite a tree traversal using a nested `dfs` that captures `result`, and compare it with the version that passes `result` as a parameter. Then build three lambdas in a loop and observe they all return 2 — that is late binding made visible.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-3.7',
    language: 'python',
    summary: 'Write one-expression functions inline — mainly for sort keys.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A lambda is a small function written inline, with no name and no `def`. It is limited to a single expression, which sounds restrictive but covers the one job you will actually use it for: telling `sort` **what to sort by**. Ninety percent of the lambdas in DSA code are sort keys.',
      },
      {
        kind: 'code',
        code: `square = lambda x: x * x
square(4)               # 16

# Equivalent to:
def square(x):
    return x * x`,
      },
      {
        kind: 'text',
        body: 'A lambda is an anonymous function limited to a **single expression** — no statements, no `if/else` blocks, no loops. The expression\'s value is returned automatically.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Do not assign a lambda to a name',
        body: '`square = lambda x: x * x` works but PEP 8 explicitly advises against it — a `def` is clearer, gets a proper name in tracebacks, and can hold a docstring. Lambdas are for passing inline, not for defining named functions.',
      },
      { kind: 'heading', text: 'Where they genuinely belong: sort keys' },
      {
        kind: 'code',
        code: `# Sort by second element
pairs.sort(key=lambda p: p[1])

# Sort by frequency descending, then value ascending
items.sort(key=lambda x: (-freq[x], x))

# Sort strings by length
words.sort(key=len)                       # no lambda needed — len is a function

# Sort by distance from a target
nums.sort(key=lambda x: abs(x - target))`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The tuple key handles multi-level sorting',
        body: '`key=lambda x: (-freq[x], x)` sorts by frequency descending (via the minus) then by value ascending. Tuples compare element-wise, so one key expression handles any number of levels. This is much shorter than the equivalent Java `Comparator` chain or C++ comparator.',
      },
      {
        kind: 'code',
        caption: 'Negating for descending order',
        code: `nums.sort(key=lambda x: -x)         # descending, via negation
nums.sort(reverse=True)             # simpler when the whole sort reverses

# But for MIXED directions you need the negation trick:
items.sort(key=lambda x: (-x.score, x.name))    # score down, name up`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Negation only works on numbers',
        body: 'You cannot write `-x.name` to reverse a string sort. When you need one string field descending and another ascending, sort twice — Python\'s sort is stable, so sorting by the secondary key first and the primary key second gives the right result.',
      },
      {
        kind: 'code',
        code: `# Stable sort trick: least significant key first
items.sort(key=lambda x: x.name)                 # secondary
items.sort(key=lambda x: x.score, reverse=True)  # primary`,
      },
      { kind: 'heading', text: 'Other places lambdas appear' },
      {
        kind: 'code',
        code: `# With min/max
oldest = max(people, key=lambda p: p.age)
closest = min(points, key=lambda p: p[0]**2 + p[1]**2)

# In a heap, via a tuple key
heapq.heappush(heap, (-count, value))       # negate for a max-heap

# defaultdict with a factory
from collections import defaultdict
graph = defaultdict(list)                   # list, not lambda: []`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'min and max take key= too',
        body: '`max(points, key=lambda p: p[0]**2 + p[1]**2)` finds the farthest point without sorting — O(n) instead of O(n log n). Whenever you find yourself sorting only to take the first element, `min`/`max` with a key is the better answer.',
      },
      {
        kind: 'text',
        body: 'One limitation worth knowing: a lambda cannot contain an assignment, a `return`, or multiple statements. If you need any of those, write a nested `def` — it is not less Pythonic, and it reads better.',
      },
    ],
    keyTakeaways: [
      'A lambda is a single expression — no statements, no assignments.',
      'Use them inline for `key=`; use `def` for anything with a name.',
      '`key=lambda x: (-a, b)` sorts by multiple keys in one expression.',
      '`min`/`max` with `key=` beats sorting when you only need one element.',
    ],
    practice: {
      prompt: 'Sort a list of `(name, score)` tuples by score descending then name ascending, using a single tuple key. Then find the maximum with `max(..., key=...)` instead of sorting — same answer, O(n) instead of O(n log n).',
      leetcode: { title: 'K Closest Points to Origin', slug: 'k-closest-points-to-origin' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-3.8',
    language: 'python',
    summary: 'Structure a LeetCode solution so the recursion stays short and readable.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'LeetCode gives you one method with a fixed signature. Non-trivial solutions need a helper, because recursion needs parameters the given signature does not have. Python offers three ways to write one.',
      },
      { kind: 'heading', text: '1. Nested function — the idiomatic choice' },
      {
        kind: 'code',
        code: `class Solution:
    def rightSideView(self, root):
        result = []

        def dfs(node, depth):
            if not node:
                return
            if depth == len(result):
                result.append(node.val)
            dfs(node.right, depth + 1)
            dfs(node.left, depth + 1)

        dfs(root, 0)
        return result`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'No self, no reset, no extra parameters',
        body: '`result` is created fresh on every call and captured by the closure, so there is nothing to reinitialise between test cases and nothing to thread through the recursion. This is why most Python LeetCode solutions use a nested function — it is genuinely the cleanest of the three options.',
      },
      { kind: 'heading', text: '2. A separate method — when the helper is long' },
      {
        kind: 'code',
        code: `class Solution:
    def isValidBST(self, root):
        return self._validate(root, float("-inf"), float("inf"))

    def _validate(self, node, lo, hi):
        if not node:
            return True
        if not (lo < node.val < hi):        # chained comparison
            return False
        return (self._validate(node.left, lo, node.val)
                and self._validate(node.right, node.val, hi))`,
      },
      {
        kind: 'text',
        body: 'Note `float("-inf")` and `float("inf")` as the initial bounds — cleaner than picking sentinel integers, and they work regardless of the value range. Java needs `Long.MIN_VALUE` to dodge the `Integer.MIN_VALUE` edge case; Python has real infinities.',
      },
      { kind: 'heading', text: '3. An instance attribute — when the answer differs from the return' },
      {
        kind: 'code',
        code: `class Solution:
    def diameterOfBinaryTree(self, root):
        self.best = 0                       # reset — the judge reuses the object

        def depth(node):                    # RETURNS depth, RECORDS diameter
            if not node:
                return 0
            l, r = depth(node.left), depth(node.right)
            self.best = max(self.best, l + r)
            return 1 + max(l, r)

        depth(root)
        return self.best`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'A nested function cannot rebind a captured number',
        body: '`best = max(best, l + r)` inside `depth` raises `UnboundLocalError` — assignment makes the name local. That is why this shape uses `self.best` (an attribute, so it is a mutation not a rebinding) or `nonlocal best`. Appending to a captured *list* has no such problem.',
      },
      {
        kind: 'code',
        caption: 'The nonlocal alternative',
        code: `def diameterOfBinaryTree(self, root):
    best = 0

    def depth(node):
        nonlocal best                       # declares intent to rebind
        if not node:
            return 0
        l, r = depth(node.left), depth(node.right)
        best = max(best, l + r)
        return 1 + max(l, r)

    depth(root)
    return best`,
      },
      { kind: 'heading', text: 'The backtracking shape' },
      {
        kind: 'code',
        code: `class Solution:
    def permute(self, nums):
        result = []
        current = []
        used = [False] * len(nums)

        def backtrack():
            if len(current) == len(nums):
                result.append(current[:])       # a COPY — current keeps changing
                return

            for i in range(len(nums)):
                if used[i]:
                    continue

                used[i] = True                  # choose
                current.append(nums[i])

                backtrack()

                current.pop()                   # un-choose — BOTH parts
                used[i] = False

        backtrack()
        return result`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'current[:] is essential',
        body: '`result.append(current)` appends a *reference* to the list that keeps mutating, so every saved result ends up identical and empty. `current[:]` (or `list(current)`) copies it. This is the same reference-semantics bug Java has, and it is the most common Python backtracking mistake.',
      },
      {
        kind: 'text',
        body: 'Note that `backtrack()` here takes no parameters at all — everything is captured. That is the closure advantage in its clearest form.',
      },
    ],
    keyTakeaways: [
      'A nested function capturing the result list is the idiomatic solution shape.',
      'Use `float("inf")` / `float("-inf")` for initial bounds.',
      'Rebinding a captured number needs `nonlocal` or `self.`; appending does not.',
      'In backtracking, save `current[:]` — never `current` itself.',
    ],
    practice: {
      prompt: 'Write `permute` with a nested `backtrack()` taking no parameters. Then replace `current[:]` with `current` and study the output — every result comes out empty, which makes the reference-semantics lesson concrete.',
      leetcode: { title: 'Permutations', slug: 'permutations' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-3.9',
    language: 'python',
    summary: 'Design recursive functions that terminate, stay fast, and survive the depth limit.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Three design questions produce a correct recursive function: what is the smallest input I can answer directly, how do I shrink the input, and given the smaller answer how do I build this one?',
      },
      {
        kind: 'code',
        code: `def max_depth(root):
    if not root:                    # 1. base case
        return 0
    # 2. smaller inputs: the two subtrees
    # 3. combine: one deeper than the larger
    return 1 + max(max_depth(root.left), max_depth(root.right))`,
      },
      { kind: 'heading', text: 'Shrink with an index, never a slice' },
      {
        kind: 'code',
        code: `# BAD — nums[1:] copies the rest of the list at EVERY level: O(n^2)
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
        title: 'Slicing in a recursive call is the Python version of pass-by-value',
        body: '`nums[1:]` allocates a new list of n−1 elements every level. Across n levels that is O(n²) copying, and the symptom is Time Limit Exceeded on a solution whose logic is perfectly correct. The same applies to `s[1:]` for strings. Always pass the original plus an index.',
      },
      { kind: 'heading', text: 'The recursion limit' },
      {
        kind: 'code',
        code: `import sys
sys.getrecursionlimit()         # 1000 by default!

def f(n):
    return 0 if n == 0 else f(n - 1)

f(1000)         # RecursionError: maximum recursion depth exceeded`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Python\'s default limit is only 1000 — far lower than C++ or Java',
        body: 'A linked list or degenerate tree with 10⁵ nodes will blow it immediately. LeetCode raises the limit on its judge, but not always high enough, and locally you will hit it constantly. The competitive-programming fix is `sys.setrecursionlimit(10**6)` at the top of the file — but converting to an iterative loop is the more robust answer.',
      },
      {
        kind: 'code',
        code: `import sys
sys.setrecursionlimit(10**6)        # the usual contest-template line

# Or convert to iteration with an explicit stack:
def inorder(root):
    result, stack, curr = [], [], root
    while curr or stack:
        while curr:
            stack.append(curr)
            curr = curr.left
        curr = stack.pop()
        result.append(curr.val)
        curr = curr.right
    return result`,
      },
      { kind: 'heading', text: 'Memoisation is one decorator' },
      {
        kind: 'code',
        code: `from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n):
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)

# Python 3.9+:
from functools import cache

@cache
def fib(n):
    ...`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'lru_cache turns O(2ⁿ) into O(n) with one line',
        body: 'It caches results keyed by the arguments. This is top-down dynamic programming with no manual dictionary — a genuine Python advantage over C++ and Java, where you write the memo table by hand. It works on any function whose arguments are hashable.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Arguments must be hashable, and the cache persists',
        body: '`@cache` fails on a list argument (`unhashable type`) — pass a tuple or an index instead. And on a method, the cache is shared across test cases because it is attached to the function object, so results from the previous input can leak. For LeetCode, prefer a plain dict created inside the public method, or apply `@cache` to a *nested* function so it is rebuilt each call.',
      },
      {
        kind: 'code',
        caption: 'The safe pattern on LeetCode',
        code: `class Solution:
    def climbStairs(self, n):
        @cache                       # nested — a fresh cache per call
        def helper(k):
            if k <= 2:
                return k
            return helper(k - 1) + helper(k - 2)
        return helper(n)`,
      },
    ],
    keyTakeaways: [
      'Design with three questions: base case, how to shrink, how to combine.',
      'Shrink with an index — slicing in a recursive call is O(n²).',
      'Python\'s recursion limit is 1000 by default; raise it or go iterative.',
      '`@cache` gives memoisation in one line, but nest it so it resets per call.',
    ],
    practice: {
      prompt: 'Write recursive `total` with slicing and with an index, and time both on 5000 elements. Then write naive `fib(35)` and add `@cache` — seconds becomes instant. Then find the depth at which plain recursion raises `RecursionError`.',
      leetcode: { title: 'Climbing Stairs', slug: 'climbing-stairs' },
    },
  },
];
