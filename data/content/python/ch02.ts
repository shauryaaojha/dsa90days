import type { Lesson } from '../types';

/**
 * Python Chapter 2 — Data Types, Operators, and Control Flow.
 * Covers the built-in types, all five operator families, and the loop forms —
 * with emphasis on where Python differs from C-family languages.
 */
export const ch02: Lesson[] = [
  // -------------------------------------------------------------------------
  {
    topicId: 'python-2.1',
    language: 'python',
    summary: 'Know the four scalar types and the properties that matter in DSA.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Python has four everyday scalar types: whole numbers, decimals, text and true/false. You never declare which one a variable holds — Python works it out — so most of what matters here is not syntax but **behaviour**, and two behaviours in particular will save you from bugs that C++ and Java programmers spend hours on.',
      },
      {
        kind: 'code',
        code: `n = 42              # int
f = 3.14            # float
s = "hello"         # str
b = True            # bool  (capital T and F!)

type(n)             # <class 'int'>
isinstance(n, int)  # True`,
      },
      { kind: 'heading', text: 'int has no size limit' },
      {
        kind: 'code',
        code: `big = 2 ** 1000          # perfectly fine — hundreds of digits
factorial = 1
for i in range(1, 101):
    factorial *= i       # 100! computed exactly, no overflow`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Python integers never overflow',
        body: 'This is a genuine advantage over C++ and Java, where you must reason about `int` versus `long` and cast before multiplying. In Python you simply do not think about it — the interpreter grows the integer as needed. Problems that require careful overflow handling elsewhere are trivial here.',
      },
      {
        kind: 'text',
        body: 'The trade-off is speed: arbitrary-precision arithmetic on very large numbers is slower than fixed-width machine integers. For normal DSA values the difference is negligible.',
      },
      { kind: 'heading', text: 'float has the usual precision limits' },
      {
        kind: 'code',
        code: `0.1 + 0.2               # 0.30000000000000004
0.1 + 0.2 == 0.3        # False

abs(0.1 + 0.2 - 0.3) < 1e-9     # True — compare within a tolerance

float('inf'), float('-inf')      # useful as initial min/max sentinels`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'float("inf") beats a magic large number',
        body: '`best = float("inf")` for a running minimum is clearer and safer than picking an arbitrary big constant, and it works regardless of the input range. C++ needs `INT_MAX`; Python has a real infinity.',
      },
      { kind: 'heading', text: 'str is immutable' },
      {
        kind: 'code',
        code: `s = "hello"
s[0]                # 'h' — indexing works
s[0] = 'H'          # TypeError: 'str' object does not support item assignment

s = 'H' + s[1:]     # build a new string instead
chars = list(s)     # or convert to a list, mutate, and join back
chars[0] = 'H'
s = ''.join(chars)`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Immutability makes character-by-character building O(n²)',
        body: 'Every `s += c` creates a whole new string. Over n characters that is quadratic — the same trap as C++\'s `s = s + c`, but unavoidable in Python because strings genuinely cannot be modified. The fix is to collect characters in a list and `"".join()` once at the end, which is O(n).',
      },
      {
        kind: 'code',
        code: `# O(n^2) — a new string every iteration
result = ""
for c in chars:
    result += c

# O(n) — the idiomatic Python way
result = "".join(chars)`,
      },
      { kind: 'heading', text: 'bool is a subclass of int' },
      {
        kind: 'code',
        code: `True + True         # 2  — bools really are ints
sum([True, False, True])    # 2  — counting matches in one expression

# Which makes this idiom work:
count = sum(1 for x in nums if x > 0)
count = sum(x > 0 for x in nums)      # same thing, shorter`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Truthiness: empty things are False',
        body: '`0`, `0.0`, `""`, `[]`, `{}`, `set()` and `None` are all falsy; everything else is truthy. So `if nums:` means "if the list is non-empty" — idiomatic and preferred over `if len(nums) > 0`. But be careful: `if x:` is False when `x` is `0`, which is a bug if 0 is a valid value. Use `if x is not None:` when that matters.',
      },
    ],
    keyTakeaways: [
      'Python `int` has unlimited precision — overflow is not a concern.',
      '`float("inf")` is a clean sentinel for running minima and maxima.',
      'Strings are immutable, so build with a list and `"".join()`.',
      '`bool` is an `int`, so `sum(x > 0 for x in nums)` counts matches.',
    ],
    practice: {
      prompt: 'Compute 100! and confirm it is exact. Then build a 100,000-character string with `+=` and with `"".join()` and time both — the quadratic version is unmistakably slower. Then check `0.1 + 0.2 == 0.3`.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-2.2',
    language: 'python',
    summary: 'Use None correctly — the value that means "nothing here".',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: '`None` is Python\'s null: a single object meaning "no value". It is the equivalent of `nullptr` in C++ and `null` in Java, and it is what linked-list and tree problems use to mark the end.',
      },
      {
        kind: 'code',
        code: `x = None

x is None           # True — the correct check
x == None           # also True, but non-idiomatic
if x is not None:   # the standard guard`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Always use "is" for None',
        body: 'There is exactly one `None` object in a running program, so identity comparison is both correct and fastest. `==` can be overridden by a class\'s `__eq__` method and give surprising results; `is` cannot. Every style guide specifies `is None`.',
      },
      { kind: 'heading', text: 'Where you meet it in DSA' },
      {
        kind: 'code',
        code: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next          # None marks the end of the list

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left          # None means "no child"
        self.right = right`,
      },
      {
        kind: 'code',
        caption: 'The null check is the recursion base case',
        code: `def max_depth(root):
    if not root:                  # idiomatic — None is falsy
        return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))

# Equivalent, more explicit:
    if root is None:
        return 0`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: '"if not node" is fine for nodes, dangerous for numbers',
        body: '`if not root:` works for tree nodes because only `None` is falsy there. But `if not x:` is also True when `x` is `0` or `""` — so using it as a null check on a value that could legitimately be zero silently takes the wrong branch. For anything that might be 0, write `if x is None:` explicitly.',
      },
      {
        kind: 'code',
        code: `def f(count=None):
    if not count:        # BUG — also triggers when count is 0
        count = 10
    ...

def f(count=None):
    if count is None:    # correct — only when genuinely absent
        count = 10`,
      },
      { kind: 'heading', text: 'Functions return None implicitly' },
      {
        kind: 'code',
        code: `def no_return():
    x = 5                # no return statement

print(no_return())       # None

# Which is why forgetting a return gives None rather than an error:
def find(nums, target):
    for i, x in enumerate(nums):
        if x == target:
            return i
    # falls off the end → returns None, not -1`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'A missing return gives None, silently',
        body: 'C++ warns about a non-void function reaching its end; Python just returns `None`. If your solution returns `None` where a number was expected, look for a code path with no `return`. On LeetCode this usually shows as a wrong answer rather than an error.',
      },
      {
        kind: 'text',
        body: 'Also worth knowing: methods that mutate in place — `list.sort()`, `list.append()`, `list.reverse()` — return `None` by design. `nums = nums.sort()` sets `nums` to `None`, which is a very common beginner bug. Use `sorted(nums)` when you want a returned value.',
      },
    ],
    keyTakeaways: [
      '`None` is Python\'s null; always test it with `is` / `is not`.',
      'For tree and list nodes, `if not node:` is idiomatic and safe.',
      'For values that could be 0, use `is None` — `not x` is also true for 0.',
      'In-place methods like `sort()` return `None`; use `sorted()` for a value.',
    ],
    practice: {
      prompt: 'Write `nums = nums.sort()` and print the result — `None`. Then write a function whose loop can fall through without returning and confirm it yields `None`. Both bugs produce confusing symptoms rather than errors.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-2.3',
    language: 'python',
    summary: 'Know the four built-in containers and which problem each one solves.',
    readMinutes: 6,
    blocks: [
      {
        kind: 'text',
        body: 'Python ships four containers, and picking the right one is the single most common decision you will make in a DSA solution. They are not interchangeable — each trades something away for speed at a particular job. This lesson is a map: what each one is for, and the question that tells you which to reach for.',
      },
      {
        kind: 'table',
        headers: ['Type', 'Ordered', 'Mutable', 'Duplicates', 'Lookup'],
        rows: [
          ['`list`', 'Yes', 'Yes', 'Yes', 'O(n) by value, O(1) by index'],
          ['`tuple`', 'Yes', '**No**', 'Yes', 'O(n) by value, O(1) by index'],
          ['`set`', 'No', 'Yes', '**No**', '**O(1)**'],
          ['`dict`', 'Insertion order', 'Yes', 'Unique keys', '**O(1)**'],
        ],
      },
      {
        kind: 'code',
        code: `nums = [1, 2, 2, 3]          # list — the default sequence
point = (3, 4)               # tuple — immutable, hashable
unique = {1, 2, 3}           # set — membership testing
ages = {"alice": 30}         # dict — key-value mapping`,
      },
      { kind: 'heading', text: 'list — the workhorse' },
      {
        kind: 'code',
        code: `nums = [3, 1, 4]

nums.append(5)          # O(1) at the end
nums.pop()              # O(1) from the end
nums.pop(0)             # O(n) — everything shifts!
nums.insert(0, 9)       # O(n)
len(nums)               # O(1)
nums[0]                 # O(1)
5 in nums               # O(n) — a linear scan
nums.sort()             # O(n log n), in place, returns None
sorted(nums)            # O(n log n), returns a new list`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'pop(0) is O(n) — use a deque for a queue',
        body: 'Removing from the front shifts every remaining element. A loop of n `pop(0)` calls is O(n²) — the standard hidden cost in BFS written with a list. `collections.deque` gives O(1) `popleft()` and is what every Python BFS uses.',
      },
      { kind: 'heading', text: 'tuple — immutable, and therefore hashable' },
      {
        kind: 'code',
        code: `point = (3, 4)
point[0] = 5            # TypeError — tuples are immutable

# Which is exactly why they can be dict keys and set members:
visited = set()
visited.add((r, c))              # a coordinate as a set element
seen = {(0, 0): "start"}         # a coordinate as a dict key

visited.add([r, c])              # TypeError: unhashable type: 'list'`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Tuples are how you use coordinates as keys',
        body: 'Lists cannot be hashed because their contents can change, so `visited.add([r, c])` fails. Tuples can. This is the standard way to track visited cells in a grid without allocating a 2D boolean array — and it is far cleaner than C++, where you would need a custom hash or an encoded integer.',
      },
      { kind: 'heading', text: 'set — O(1) membership' },
      {
        kind: 'code',
        code: `seen = set()                 # NOT {} — that creates an empty dict!
seen.add(5)
5 in seen                    # O(1)
seen.remove(5)               # KeyError if absent
seen.discard(5)              # silent if absent
len(seen)

a = {1, 2, 3}
b = {2, 3, 4}
a & b                        # {2, 3}    intersection
a | b                        # {1,2,3,4} union
a - b                        # {1}       difference
a ^ b                        # {1, 4}    symmetric difference`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: '{} is an empty dict, not an empty set',
        body: 'Use `set()` for an empty set. `{}` has meant an empty dict since before sets had literal syntax. Writing `seen = {}` and then calling `seen.add(x)` gives `AttributeError: dict object has no attribute add` — a confusing message pointing at the wrong thing.',
      },
      { kind: 'heading', text: 'dict — the most useful container in DSA' },
      {
        kind: 'code',
        code: `counts = {}
counts["a"] = 1
counts.get("b")              # None — does NOT raise
counts.get("b", 0)           # 0 — with a default
counts["b"]                  # KeyError if absent

"a" in counts                # O(1) membership
counts.keys(), counts.values(), counts.items()

for key, value in counts.items():
    ...

# The counting idiom:
for c in s:
    counts[c] = counts.get(c, 0) + 1`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'dict preserves insertion order since Python 3.7',
        body: 'Iterating a dict yields keys in the order they were first inserted — guaranteed by the language, not an implementation detail. That is stronger than C++\'s `unordered_map`, whose order is unspecified. It means "first unique character" style problems can iterate the dict directly.',
      },
      {
        kind: 'text',
        body: '`collections.defaultdict` and `collections.Counter` make counting and grouping even shorter — both are covered in Chapter 8, and both are worth reaching for once you have the plain `dict` version fluent.',
      },
    ],
    keyTakeaways: [
      '`list` for sequences, `set` for membership, `dict` for mapping, `tuple` for keys.',
      '`pop(0)` is O(n) — use `collections.deque` for queue behaviour.',
      'Tuples are hashable, so `(r, c)` works as a set element or dict key.',
      '`{}` is an empty dict; use `set()` for an empty set.',
    ],
    practice: {
      prompt: 'Count characters in a string with a plain dict and `get(c, 0) + 1`. Then track visited grid cells in a set of `(r, c)` tuples, and try adding a list instead to see the `unhashable type` error. Then time `pop(0)` against `deque.popleft()` on 10⁵ elements.',
      leetcode: { title: 'Contains Duplicate', slug: 'contains-duplicate' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-2.4',
    language: 'python',
    summary: 'Use the arithmetic operators, including the two that differ from C++.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Most arithmetic behaves exactly as you would expect. Two operators do not, and both bite people arriving from C++ or Java: `/` **always** produces a decimal even when dividing two whole numbers, and `%` on negative numbers gives a different answer than it does in those languages. Learn these two now and the rest is free.',
      },
      {
        kind: 'code',
        code: `a, b = 17, 5

a + b       # 22
a - b       # 12
a * b       # 85
a / b       # 3.4   ← ALWAYS a float
a // b      # 3     ← floor division
a % b       # 2
a ** b      # 1419857  ← exponentiation, built in`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: '/ always returns a float',
        body: 'Even `4 / 2` is `2.0`. Using it for an index gives `TypeError: list indices must be integers or slices, not float`. Binary search midpoints, grid coordinates and array indices all need `//`. This is the most common arithmetic bug for people arriving from C++ or Java.',
      },
      {
        kind: 'code',
        code: `mid = (low + high) // 2          # correct
mid = (low + high) / 2           # 3.5 → TypeError when used as an index

row, col = i // cols, i % cols   # flat index to grid coordinates`,
      },
      { kind: 'heading', text: 'Floor division rounds toward negative infinity' },
      {
        kind: 'code',
        code: `7 // 2        #  3
-7 // 2       # -4      ← C++ and Java both give -3

# Python floors; C-family languages truncate toward zero.
# For positive values they agree; for negatives they do not.

int(-7 / 2)   # -3  — if you need C-style truncation
math.trunc(-7 / 2)   # -3`,
      },
      { kind: 'heading', text: 'Modulo follows the sign of the divisor' },
      {
        kind: 'code',
        code: `-7 % 3        # 2    in Python
                 # -1   in C++ and Java

7 % -3        # -2   — follows the divisor's sign`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Python needs no safe-modulo helper',
        body: 'Because `%` returns a non-negative result for a positive modulus, the `((a % m) + m) % m` guard that C++ requires is unnecessary. Circular indexing with `(i - 1) % n` just works, even when `i` is 0. One fewer thing to remember.',
      },
      {
        kind: 'code',
        code: `# Wrapping backwards around a circular array:
prev = (i - 1) % n           # correct in Python even when i == 0
                             # in C++ this would give -1`,
      },
      { kind: 'heading', text: 'Useful built-ins' },
      {
        kind: 'code',
        code: `abs(-5)             # 5
pow(2, 10)          # 1024
pow(2, 10, 1000)    # 24 — (2**10) % 1000, computed efficiently
divmod(17, 5)       # (3, 2) — quotient and remainder together
round(3.7)          # 4
min(a, b), max(a, b)
sum(nums)

import math
math.floor(-3.5), math.ceil(-3.5), math.sqrt(16), math.gcd(12, 18)
math.inf                                  # same as float("inf")

# Compound assignment
x += 3;  x -= 2;  x *= 4;  x //= 2;  x %= 5;  x **= 2`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Three-argument pow is genuinely useful',
        body: '`pow(base, exp, mod)` computes modular exponentiation efficiently, without ever building the enormous intermediate value. For problems asking for a result "modulo 10^9 + 7" involving large powers, it is both faster and simpler than a manual loop.',
      },
      {
        kind: 'text',
        body: '`divmod` is another small win: `q, r = divmod(n, 10)` extracts a digit and shrinks the number in one line, which makes digit-manipulation loops noticeably tidier.',
      },
    ],
    keyTakeaways: [
      '`/` always returns a float — use `//` for indices and midpoints.',
      '`-7 // 2` is `-4` (floors), unlike C++ which truncates to `-3`.',
      '`-7 % 3` is `2`, so no safe-modulo guard is needed.',
      '`pow(b, e, m)` does modular exponentiation; `divmod` returns both results.',
    ],
    practice: {
      prompt: 'Write a binary search using `/` instead of `//` and read the `TypeError`. Then compare `-7 // 2` and `-7 % 3` with what C++ gives. Then rewrite a digit-extraction loop using `divmod`.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-2.5',
    language: 'python',
    summary: 'Compare values, and use the chained comparisons Python uniquely allows.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'Comparison operators answer yes/no questions and hand back `True` or `False`. Python adds one genuine convenience no other mainstream language has: you can **chain** them, writing `0 <= i < n` exactly as you would in mathematics. That single form removes the most common bounds-check bug in grid problems.',
      },
      {
        kind: 'code',
        code: `a, b = 5, 10

a == b      # False
a != b      # True
a < b       # True
a <= b      # True
a > b       # False
a >= b      # False`,
      },
      { kind: 'heading', text: 'Chained comparisons actually work' },
      {
        kind: 'code',
        code: `if 0 <= x <= 10:          # reads as maths, and means what it says
    ...

# Equivalent to, but evaluates x only once:
if 0 <= x and x <= 10:
    ...

if 0 <= r < rows and 0 <= c < cols:      # the grid bounds check
    ...`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'This is a genuine Python advantage',
        body: 'In C++, `0 <= x <= 10` compiles and silently means something else entirely — it is a classic bug. Java rejects it. Python evaluates it correctly, which makes grid bounds checks noticeably more readable: `0 <= r < rows and 0 <= c < cols` is one clear line.',
      },
      { kind: 'heading', text: 'Comparison works on containers too' },
      {
        kind: 'code',
        code: `[1, 2, 3] == [1, 2, 3]         # True — element-wise
"apple" < "banana"             # True — lexicographic
(1, 2) < (1, 3)                # True — element-wise, first difference wins
{1, 2} == {2, 1}               # True — sets are unordered

[1, 2] < [1, 2, 3]             # True — a prefix sorts first`,
      },
      {
        kind: 'text',
        body: 'Tuple comparison being element-wise is what makes `sorted(pairs)` order by first element then second, exactly like C++\'s `pair`. It is why `heapq` with `(distance, node)` tuples works without a comparator.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Uppercase sorts before lowercase',
        body: 'String comparison is by Unicode code point, so `"Zebra" < "apple"` is True — `Z` is 90 and `a` is 97. If a problem wants case-insensitive ordering, normalise first with `.lower()`, or sort with `key=str.lower`.',
      },
      {
        kind: 'code',
        code: `sorted(words)                       # uppercase first
sorted(words, key=str.lower)        # case-insensitive`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Comparing incompatible types raises',
        body: '`1 < "a"` raises `TypeError: \'<\' not supported between instances of \'int\' and \'str\'`. Python 2 allowed it with an arbitrary ordering; Python 3 correctly refuses. If you sort a mixed-type list you will get this error — usually a sign that your data is not what you thought.',
      },
      {
        kind: 'text',
        body: 'One more difference from C++: `==` on lists compares *contents*, not identity, so there is no `.equals()` versus `==` distinction to remember. `is` is the identity check, and you only need it for `None`.',
      },
    ],
    keyTakeaways: [
      'Chained comparisons like `0 <= x < n` work correctly and read clearly.',
      '`==` compares contents for all containers — no `.equals()` needed.',
      'Tuples compare element-wise, which is why `(dist, node)` heaps work.',
      'String order is by code point, so all uppercase sorts before lowercase.',
    ],
    practice: {
      prompt: 'Write a grid bounds check as `0 <= r < rows and 0 <= c < cols` and appreciate how much clearer it is than the four-condition C++ version. Then sort a list of mixed-case words with and without `key=str.lower`.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-2.6',
    language: 'python',
    summary: 'Combine conditions with and, or, not — and use their return values.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Python spells its logical operators as English words — `and`, `or`, `not` — rather than `&&`, `||` and `!`. They short-circuit just like their C++ counterparts, which is what makes `if i < len(a) and a[i] == x` a safe guard. The surprise is that they do **not** return `True` or `False`: they return one of the operands, and that turns out to be useful.',
      },
      {
        kind: 'code',
        code: `and     # True when both sides are true — short-circuits
or      # True when either side is true — short-circuits
not     # negation

if 0 <= i < len(nums) and nums[i] == target:
    ...

if not found:
    ...`,
      },
      {
        kind: 'text',
        body: 'Python spells them as words rather than `&&`, `||`, `!`. The `&`, `|` and `^` symbols exist too, but they are **bitwise** operators — using them on booleans works but does not short-circuit.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Use "and", not "&"',
        body: '`node is not None & node.val == 5` does not short-circuit *and* has wrong precedence — `&` binds tighter than `==`, so it parses as `node is not (None & node.val) == 5`. Always use the word forms for logic; reserve `&` and `|` for genuine bitwise work on integers.',
      },
      { kind: 'heading', text: 'Short-circuiting as a safety guard' },
      {
        kind: 'code',
        code: `# SAFE — nums[i] is never evaluated when i is out of range
if i < len(nums) and nums[i] == target:
    ...

# IndexError — the access happens first
if nums[i] == target and i < len(nums):
    ...

# The linked-list and tree idioms:
while node and node.val != target:
    node = node.next

while fast and fast.next:            # two levels, matching the body
    slow, fast = slow.next, fast.next.next`,
      },
      { kind: 'heading', text: 'They return a value, not just a boolean' },
      {
        kind: 'code',
        code: `"a" or "b"          # "a"  — returns the first truthy operand
"" or "b"           # "b"
0 or 5              # 5
None or []          # []

"a" and "b"         # "b"  — returns the last operand if all truthy
0 and 5             # 0    — returns the first falsy one`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The "or" default idiom',
        body: '`name = user_input or "anonymous"` supplies a fallback when the left side is empty or None. It is concise and common. Just remember it triggers on *any* falsy value including `0` and `""` — so for a numeric default use `if x is None:` instead, or the value 0 will be silently replaced.',
      },
      {
        kind: 'code',
        code: `count = provided or 10       # BUG if provided is legitimately 0
count = 10 if provided is None else provided     # correct`,
      },
      { kind: 'heading', text: 'The ternary conditional' },
      {
        kind: 'code',
        code: `result = a if a > b else b           # value_if_true if condition else value_if_false

# Equivalent to C++'s  (a > b) ? a : b
# but reads left-to-right in English order.

sign = "positive" if n > 0 else "negative" if n < 0 else "zero"`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'all() and any() over a whole iterable',
        body: '`all(x > 0 for x in nums)` and `any(x < 0 for x in nums)` replace an explicit loop with a single readable expression, and both short-circuit — `any` stops at the first match. They are the idiomatic way to ask "do all/any elements satisfy this".',
      },
      {
        kind: 'code',
        code: `all(x > 0 for x in nums)              # every element positive
any(x < 0 for x in nums)              # at least one negative
all(s[i] == s[-1-i] for i in range(len(s)//2))    # palindrome, in one line`,
      },
    ],
    keyTakeaways: [
      'Use `and` / `or` / `not`, never `&` / `|` — the symbols are bitwise.',
      'They short-circuit, so the guard must come first.',
      'They return an operand, not a boolean — hence the `x or default` idiom.',
      '`all()` and `any()` express whole-iterable conditions in one line.',
    ],
    practice: {
      prompt: 'Write a bounds-checked access relying on short-circuiting, then flip the order and watch it raise `IndexError`. Then print `0 or 5` and `"" or "b"` to see the operand-returning behaviour, and write a palindrome check with `all()`.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-2.7',
    language: 'python',
    summary: 'Use "in" for membership — and know which container makes it fast.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: '`x in container` asks "is this here?" and reads like English. The catch is that identical-looking code can be fast or catastrophically slow depending on **which container you asked**: it is O(1) on a set or dict and O(n) on a list. That one distinction is the most common cause of a Python solution timing out.',
      },
      {
        kind: 'code',
        code: `3 in [1, 2, 3]              # True
3 not in [1, 2, 3]          # False

"ell" in "hello"            # True — substring test
"a" in {"a": 1}             # True — checks KEYS, not values
1 in {"a": 1}               # False`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: '"in" on a dict checks keys, not values',
        body: '`1 in {"a": 1}` is False because `in` looks at keys. To check values use `1 in d.values()` — but note that is O(n), unlike the O(1) key lookup. If you need fast lookup by value, you need a second dict mapping the other way.',
      },
      { kind: 'heading', text: 'The complexity depends entirely on the container' },
      {
        kind: 'table',
        headers: ['Container', '`x in c`', 'Why'],
        rows: [
          ['`list`', '**O(n)**', 'Linear scan'],
          ['`tuple`', '**O(n)**', 'Linear scan'],
          ['`str`', 'O(n·m)', 'Substring search'],
          ['`set`', '**O(1)**', 'Hash lookup'],
          ['`dict`', '**O(1)**', 'Hash lookup on keys'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: '"x in list" inside a loop is O(n²)',
        body: 'It reads the same as the set version and is dramatically slower. This is the single most common cause of Time Limit Exceeded in Python solutions — the code looks linear because `in` is one short word. Convert to a set first: `seen = set(nums)`, then `x in seen` is O(1).',
      },
      {
        kind: 'code',
        code: `# O(n^2) — a linear scan on every iteration
for x in nums:
    if x in seen_list:
        ...
    seen_list.append(x)

# O(n) — one hash lookup per iteration
seen = set()
for x in nums:
    if x in seen:
        ...
    seen.add(x)`,
      },
      { kind: 'heading', text: 'Where it makes solutions short' },
      {
        kind: 'code',
        code: `# Two Sum — the whole algorithm is a membership test
def two_sum(nums, target):
    seen = {}
    for i, x in enumerate(nums):
        if target - x in seen:        # O(1)
            return [seen[target - x], i]
        seen[x] = i
    return []

# Contains Duplicate — one line
def contains_duplicate(nums):
    return len(set(nums)) != len(nums)

# Longest Consecutive Sequence relies on O(1) membership
s = set(nums)
for x in s:
    if x - 1 not in s:                # only start from a run's beginning
        length = 1
        while x + length in s:
            length += 1`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: '"in" also drives iteration',
        body: 'The same keyword appears in `for x in nums:`, where it means "iterate over" rather than "is a member of". Context distinguishes them — `in` after `for` is iteration, `in` in an expression is a membership test.',
      },
      {
        kind: 'code',
        code: `for x in nums:              # iteration
    ...

if x in nums:               # membership test
    ...

for k, v in d.items():      # iteration over pairs
    ...`,
      },
      {
        kind: 'text',
        body: 'One practical note: converting a list to a set costs O(n) once. If you will do more than a couple of membership tests, that conversion pays for itself immediately — and it is a one-line change that often fixes a timeout.',
      },
    ],
    keyTakeaways: [
      '`in` is O(1) on sets and dicts, O(n) on lists, tuples and strings.',
      '`x in list` inside a loop is O(n²) — the top cause of Python TLE.',
      'On a dict, `in` tests keys; `in d.values()` is O(n).',
      'Converting to a set costs O(n) once and pays back after two lookups.',
    ],
    practice: {
      prompt: 'Solve Contains Duplicate with `x in seen_list` and with `x in seen_set`, and time both on 10⁵ elements. The gap is dramatic and both versions look almost identical — which is exactly why this one is worth feeling.',
      leetcode: { title: 'Contains Duplicate', slug: 'contains-duplicate' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-2.8',
    language: 'python',
    summary: 'Understand is versus ==, and why the difference matters.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'These two look interchangeable and are not. `==` asks "do these hold the same value?"; `is` asks "are these literally the same object in memory?". You want `==` almost always — the exception is comparing against `None`, where `is` is the correct and conventional choice.',
      },
      {
        kind: 'code',
        code: `is       # same OBJECT in memory
==       # same VALUE

a = [1, 2, 3]
b = [1, 2, 3]
c = a

a == b      # True  — same contents
a is b      # False — different objects
a is c      # True  — the same object

id(a), id(b), id(c)     # c has the same id as a`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The rule: == for values, is only for None, True, False',
        body: 'Those three are singleton objects — there is exactly one `None` in a running program — so identity comparison is both correct and fast. For everything else use `==`. Following this rule mechanically avoids every problem in this lesson.',
      },
      { kind: 'heading', text: 'Small integer caching makes "is" look deceptively fine' },
      {
        kind: 'code',
        code: `a = 256
b = 256
a is b          # True  — CPython caches -5 to 256

a = 257
b = 257
a is b          # may be False — outside the cache

# Same story for short strings, which are interned:
"hello" is "hello"          # usually True
("hel" + "lo") is "hello"   # may be False`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'This is the same trap as Java\'s Integer caching',
        body: 'Small values are cached, so `is` appears to work and then fails for larger ones — passing every small test case. If you have written Java, the symptom is identical. The fix is identical too: use `==`.',
      },
      { kind: 'heading', text: 'Where "is" is genuinely correct' },
      {
        kind: 'code',
        code: `if x is None: ...
if x is not None: ...
if flag is True: ...             # rare — usually just  if flag:

# Detecting aliasing — do two names refer to the same list?
if a is b:
    print("same object — mutating one mutates the other")`,
      },
      {
        kind: 'text',
        body: 'That aliasing check connects back to Chapter 1: assignment binds names to objects rather than copying, so `b = a` makes `a is b` True and mutations visible through both names. `is` is the tool for reasoning about that.',
      },
      {
        kind: 'code',
        caption: 'Copying breaks the identity',
        code: `a = [1, 2, 3]
b = a
b is a          # True — b.append(4) changes a too

c = a.copy()
c is a          # False — independent
c == a          # True  — but equal in value`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Never use "is" to compare numbers or strings from input',
        body: 'Values built at runtime — parsed from input, produced by concatenation or slicing — are new objects, so `is` returns False even when the values match. This is precisely the bug that passes on literals in your test file and fails on the judge.',
      },
      {
        kind: 'text',
        body: 'A related note for tree problems: comparing two `TreeNode` objects with `==` uses identity by default unless the class defines `__eq__`. So for LeetCode node types, `a == b` and `a is b` mean the same thing — which is usually what you want when checking whether two pointers reached the same node.',
      },
    ],
    keyTakeaways: [
      '`is` compares object identity; `==` compares value.',
      'Use `is` only for `None`, `True` and `False`.',
      'Small ints and interned strings make `is` deceptively work, then fail.',
      '`a is b` after `b = a` is True — which is why mutations are shared.',
    ],
    practice: {
      prompt: 'Compare `256 is 256` and `257 is 257`, then compare two lists with `is` and `==`. Then alias a list with `b = a`, mutate `b`, and confirm `a` changed and `a is b` is True — that single experiment ties together identity, aliasing and copying.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-2.9',
    language: 'python',
    summary: 'Branch cleanly, and use the Python-specific forms that shorten conditionals.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Branching in Python needs no brackets around the condition and no braces around the body — a colon and an indented block do both jobs. Beyond the basics there are two Python-specific forms worth knowing, because they turn several lines of `if` into one readable line you will use constantly.',
      },
      {
        kind: 'code',
        code: `if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "F"`,
      },
      {
        kind: 'text',
        body: 'Note `elif`, not `else if` — Python has a dedicated keyword. Conditions are checked top to bottom and **the first true branch wins**, so range checks need no upper bounds: by the time you reach `>= 80`, the score is already known to be below 90.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Order matters — a wrong order silently swallows cases',
        body: 'Putting `score >= 70` first means every score of 95 also matches it and gets a C. Nothing errors; the answers are just wrong. When branches are ranges, always order from most restrictive to least.',
      },
      { kind: 'heading', text: 'Truthiness makes conditions shorter' },
      {
        kind: 'code',
        code: `if nums:                # non-empty list — idiomatic
if not nums:            # empty list
if s:                   # non-empty string
if node:                # not None

# Rather than:
if len(nums) > 0:
if node is not None:`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'But `if x:` is False when x is 0',
        body: 'For a value that could legitimately be zero — a count, a coordinate, an array element — `if x:` takes the wrong branch. Use `if x is not None:` when absence and zero must be distinguished. This is the one place truthiness causes real bugs.',
      },
      { kind: 'heading', text: 'The ternary and guard clauses' },
      {
        kind: 'code',
        code: `# Ternary — reads left to right
biggest = a if a > b else b

# Guard clauses keep recursion flat
def max_depth(root):
    if not root:
        return 0                       # handle the edge case and leave
    return 1 + max(max_depth(root.left), max_depth(root.right))`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Early return beats deep nesting',
        body: 'Handle base cases first and return, so the main logic stays at one indent level. In Python this matters more than in C++, because indentation is visually load-bearing — three levels of nesting is genuinely harder to read when there are no closing braces to anchor you.',
      },
      { kind: 'heading', text: 'match — Python\'s switch' },
      {
        kind: 'code',
        code: `match command:                    # Python 3.10+
    case "add":
        result = a + b
    case "sub":
        result = a - b
    case _:                       # the default
        result = 0`,
      },
      {
        kind: 'text',
        body: 'Unlike C++ `switch`, there is no fall-through and no `break` needed — each case is independent. It also supports structural patterns like `case [x, y]:`. It rarely appears in DSA, where conditions are usually ranges, but it is worth recognising.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Assignment is not allowed in a condition',
        body: '`if x = 5:` is a syntax error — Python deliberately forbids it to prevent the classic C++ bug. If you genuinely want to assign and test, the walrus operator does it explicitly: `if (n := len(nums)) > 10:`. Requiring different syntax makes the intent unambiguous.',
      },
      {
        kind: 'code',
        code: `if (n := len(nums)) > 10:        # assigns n AND tests it
    print(f"{n} elements")

while (line := input()) != "":   # a common walrus use`,
      },
    ],
    keyTakeaways: [
      '`elif`, not `else if`; the first true branch wins.',
      '`if nums:` is idiomatic for non-empty, but is also False for `0`.',
      'Guard clauses with early return keep recursive code flat.',
      'Assignment in a condition is a syntax error; use `:=` when you mean it.',
    ],
    practice: {
      prompt: 'Write FizzBuzz — the trick is checking divisibility by 15 before 3 and 5. Then write a function using `if x:` on a value that can be 0 and find the input where it takes the wrong branch.',
      leetcode: { title: 'Fizz Buzz', slug: 'fizz-buzz' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-2.10',
    language: 'python',
    summary: 'Iterate over sequences directly — Python has no C-style for loop.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Python\'s `for` always iterates over a collection. There is no `for (int i = 0; i < n; i++)` form — you iterate the items themselves, or use `range()` when you genuinely need indices.',
      },
      {
        kind: 'code',
        code: `for x in nums:                # the values
    print(x)

for i in range(len(nums)):    # the indices
    print(i, nums[i])

for i, x in enumerate(nums):  # both — the idiomatic form
    print(i, x)`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Prefer enumerate over range(len(...))',
        body: '`for i in range(len(nums)): x = nums[i]` works but is the clearest possible sign of a C++ or Java background. `enumerate` gives you both without the indexing, cannot go out of bounds, and reads better. Reviewers and interviewers notice.',
      },
      { kind: 'heading', text: 'Iterating other containers' },
      {
        kind: 'code',
        code: `for c in "hello":                 # characters
for key in my_dict:               # keys (the default)
for value in my_dict.values():
for key, value in my_dict.items():    # both — very common
for x in my_set:                  # arbitrary order

for a, b in zip(list1, list2):    # two lists in parallel
for i, (a, b) in enumerate(pairs):    # index plus an unpacked tuple`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'zip stops at the shorter list',
        body: '`zip([1,2,3], [4,5])` yields two pairs, not three — no error, it simply stops. That is usually what you want when comparing two sequences element-wise, but it silently ignores the extra elements, so check the lengths first if that matters.',
      },
      { kind: 'heading', text: 'Modifying while iterating' },
      {
        kind: 'code',
        code: `# BROKEN — removing shifts elements and the loop skips some
for x in nums:
    if x % 2 == 0:
        nums.remove(x)

# Build a new list instead
nums = [x for x in nums if x % 2 != 0]

# Or iterate over a copy
for x in nums[:]:
    if x % 2 == 0:
        nums.remove(x)`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Changing a dict\'s size while iterating raises',
        body: '`RuntimeError: dictionary changed size during iteration`. Unlike lists, which fail silently by skipping elements, dicts raise immediately — which is more helpful. Iterate over `list(d.keys())` if you need to delete entries while looping.',
      },
      { kind: 'heading', text: 'for...else' },
      {
        kind: 'code',
        code: `for x in nums:
    if x == target:
        print("found")
        break
else:
    print("not found")        # runs only if the loop was NOT broken out of`,
      },
      {
        kind: 'text',
        body: 'The `else` runs when the loop finishes without hitting `break`. It is unique to Python and removes the "found" flag variable that search loops otherwise need. Uncommon in practice, but genuinely tidy when you meet the pattern.',
      },
      {
        kind: 'code',
        caption: 'Comprehensions — a for loop as an expression',
        code: `squares = [x * x for x in nums]
evens = [x for x in nums if x % 2 == 0]
grid = [[0] * cols for _ in range(rows)]        # the correct 2D init

pairs = {x: x * x for x in nums}                # dict comprehension
unique = {x for x in nums}                      # set comprehension`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Comprehensions are faster as well as shorter',
        body: 'The loop runs largely in C rather than interpreted bytecode, so a comprehension typically beats the equivalent explicit loop with `append`. Given Python\'s speed disadvantage on LeetCode, that is a real benefit — and `[[0] * cols for _ in range(rows)]` is also the only correct way to build a 2D grid.',
      },
    ],
    keyTakeaways: [
      'Python `for` iterates a collection; use `enumerate` when you need indices.',
      '`zip` pairs two sequences and stops at the shorter one.',
      'Never mutate a list or dict while iterating it.',
      'Comprehensions are shorter, faster, and the correct way to build 2D grids.',
    ],
    practice: {
      prompt: 'Rewrite a `range(len(nums))` loop with `enumerate`. Then try removing elements from a list while iterating it and find an input where elements are skipped. Then build a 2D grid with a comprehension.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-2.11',
    language: 'python',
    summary: 'Loop until a condition changes, and avoid the infinite-loop patterns.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Use `for` when you know what you are iterating over. Use `while` when you are looping until something changes — walking a linked list, converging a binary search, extracting digits.',
      },
      {
        kind: 'code',
        code: `while condition:
    # body — condition is checked BEFORE each iteration`,
      },
      {
        kind: 'code',
        caption: 'The three canonical while loops',
        code: `# 1. Walk a linked list — length unknown
while node:
    total += node.val
    node = node.next

# 2. Extract digits
while n > 0:
    digits.append(n % 10)
    n //= 10                 # note // not /

# 3. Binary search
while low <= high:
    mid = (low + high) // 2
    if nums[mid] == target:
        return mid
    if nums[mid] < target:
        low = mid + 1
    else:
        high = mid - 1`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Every while loop needs something that changes',
        body: 'The commonest infinite loop is forgetting to advance — omitting `node = node.next` or `n //= 10`. On LeetCode this shows as Time Limit Exceeded rather than a hang. Before leaving a `while` loop, point at the line that makes progress toward the exit.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Using / instead of // never terminates',
        body: '`n /= 10` turns `n` into a float that approaches zero without ever reaching it — `1.0`, `0.1`, `0.01`… and `n > 0` stays true forever. This is a Python-specific version of the infinite-loop bug, and it is easy to write by habit from other languages.',
      },
      { kind: 'heading', text: 'Binary search termination' },
      {
        kind: 'code',
        code: `# INFINITE — mid equals low when only two elements remain
while low < high:
    mid = (low + high) // 2
    if check(mid):
        high = mid
    else:
        low = mid            # BUG — should be mid + 1

# Correct
while low < high:
    mid = (low + high) // 2
    if check(mid):
        high = mid
    else:
        low = mid + 1`,
      },
      {
        kind: 'text',
        body: 'Because floor division rounds down, `mid` equals `low` when the range shrinks to two. Assigning `low = mid` changes nothing and the loop spins. Always hand-check the two-element case when writing a binary search.',
      },
      { kind: 'heading', text: 'Python has no do-while' },
      {
        kind: 'code',
        code: `# The equivalent: while True with a break at the bottom
while True:
    value = get_next()
    process(value)
    if done:
        break

# Which is also the cleanest form when the exit is mid-body:
while True:
    if not queue:
        break
    node = queue.pop()
    ...`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'while...else exists too',
        body: 'Like `for...else`, the `else` block runs if the loop ended without `break`. Rare, but it removes a flag variable in search loops: `while lo <= hi: ... else: return -1`.',
      },
      {
        kind: 'text',
        body: 'One scope difference from C++: a variable used by a `while` must exist before it and remains in scope afterwards — Python has no block scope at all. A `for` loop\'s variable also survives the loop, which occasionally surprises people expecting C++ behaviour.',
      },
    ],
    keyTakeaways: [
      '`for` for known iteration, `while` for "until a condition changes".',
      'Use `//` not `/` when shrinking a number, or the loop never terminates.',
      'In binary search, `low = mid` instead of `low = mid + 1` loops forever.',
      'Python has no `do-while`; use `while True` with a `break`.',
    ],
    practice: {
      prompt: 'Write digit extraction with `n /= 10` and watch it hang, then fix it with `//=`. Then write binary search and test it on a two-element list — that is where the `mid + 1` bug shows up.',
      leetcode: { title: 'Binary Search', slug: 'binary-search' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-2.12',
    language: 'python',
    summary: 'Exit loops early, skip iterations, and use pass as a placeholder.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'Once you have found what you were looking for, continuing to loop is wasted work — and on a large input it is the difference between passing and timing out. `break` leaves the loop, `continue` jumps to the next pass, and `pass` does nothing at all, which sounds useless until you need a syntactically valid empty block.',
      },
      {
        kind: 'table',
        headers: ['Keyword', 'Effect'],
        rows: [
          ['`break`', 'Exits the innermost loop entirely'],
          ['`continue`', 'Skips the rest of this iteration, starts the next'],
          ['`pass`', 'Does nothing — a syntactic placeholder'],
          ['`return`', 'Exits the whole function, however deeply nested'],
        ],
      },
      {
        kind: 'code',
        code: `# break — stop as soon as you have the answer
for x in nums:
    if x % 2 == 0:
        first_even = x
        break

# continue — skip the ones you do not care about
for x in nums:
    if x < 0:
        continue
    total += x`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'continue is safer in Python than in C++',
        body: 'In a C++ `while` loop, `continue` skips the increment and causes an infinite loop. Python `for` loops advance automatically, so `continue` is always safe there. In a Python `while` loop the same C++ hazard applies — advance before continuing.',
      },
      {
        kind: 'code',
        code: `# The while-loop hazard still exists:
i = 0
while i < len(nums):
    if nums[i] < 0:
        continue          # INFINITE — i never advances
    total += nums[i]
    i += 1

# Fixed
while i < len(nums):
    if nums[i] < 0:
        i += 1
        continue
    total += nums[i]
    i += 1`,
      },
      { kind: 'heading', text: 'break only escapes one level' },
      {
        kind: 'code',
        code: `# This break exits only the inner loop
for r in range(rows):
    for c in range(cols):
        if grid[r][c] == target:
            break              # the outer loop continues

# To exit both, return from a function — much cleaner than a flag
def find(grid, target):
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == target:
                return (r, c)      # leaves everything at once
    return None`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Returning beats the found-flag pattern',
        body: 'Setting `found = True` and breaking out level by level is verbose and error-prone. Extracting the search into a function and returning directly is clearer — and it is why so many DSA solutions are structured as small helper functions.',
      },
      { kind: 'heading', text: 'pass' },
      {
        kind: 'code',
        code: `def not_implemented():
    pass                  # a legal empty body

if condition:
    pass                  # placeholder while you write the logic
else:
    handle()

class Empty:
    pass`,
      },
      {
        kind: 'text',
        body: 'Because Python has no `{}` for an empty block, `pass` is the only way to write one. It does nothing at all — unlike `continue`, which affects the loop. Confusing the two is a real bug: `pass` inside a loop falls through to the rest of the body.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'pass is not continue',
        body: '`pass` does nothing and execution carries on to the next statement; `continue` jumps to the next iteration. Writing `pass` where you meant `continue` means the code you intended to skip runs anyway — a silent logic bug with no error message.',
      },
      {
        kind: 'text',
        body: 'Both `for` and `while` support an `else` block that runs when the loop completes without `break` — useful for "searched everything and found nothing" without a flag variable.',
      },
    ],
    keyTakeaways: [
      '`break` exits one loop level; `continue` starts the next iteration.',
      'In a `while` loop, advance before `continue` or you loop forever.',
      'Returning from a helper is cleaner than flag-and-break for nested loops.',
      '`pass` is an empty placeholder — it is not `continue`.',
    ],
    practice: {
      prompt: 'Write a `while` loop with `continue` before the increment and watch it hang. Then replace a flag-and-break nested search with a function that returns directly. Then write `pass` where `continue` belongs and observe the silent difference.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-2.13',
    language: 'python',
    summary: 'Generate index sequences with range, including the reverse form.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Python\'s `for` loop walks over a collection, so when you genuinely need **numbers** — indices, counters, a countdown — `range` is what produces them. Its one rule governs everything else: the start is included and the stop is **excluded**, which is exactly why `range(len(nums))` covers every valid index and no more.',
      },
      {
        kind: 'code',
        code: `range(5)            # 0 1 2 3 4        — stop only
range(2, 5)         # 2 3 4            — start, stop
range(0, 10, 2)     # 0 2 4 6 8        — start, stop, step
range(5, 0, -1)     # 5 4 3 2 1        — negative step counts down`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The stop value is always exclusive',
        body: '`range(5)` yields 0 through 4, matching `for (int i = 0; i < 5; i++)`. This half-open convention is the same one slicing uses and the same one the standard library follows everywhere, so `range(len(nums))` covers exactly the valid indices.',
      },
      { kind: 'heading', text: 'The forms you will write constantly' },
      {
        kind: 'code',
        code: `for i in range(n):                  # 0 to n-1
for i in range(1, n):               # skip the first
for i in range(n - 1, -1, -1):      # BACKWARDS: n-1 down to 0
for i in range(0, n, 2):            # every other index

# Every pair (i, j) with j after i
for i in range(n):
    for j in range(i + 1, n):
        ...`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'The backward range needs -1 as the stop',
        body: '`range(n-1, 0, -1)` stops at 1 and never reaches index 0 — silently missing the first element. To include 0 the stop must be `-1`: `range(n-1, -1, -1)`. This off-by-one is the most common `range` mistake, and it fails only on whatever depends on index 0.',
      },
      {
        kind: 'code',
        code: `list(range(4, 0, -1))       # [4, 3, 2, 1]   ← misses 0
list(range(4, -1, -1))      # [4, 3, 2, 1, 0]  ← correct

# Or avoid the whole issue with reversed():
for i in reversed(range(n)):        # n-1 down to 0, clearer
for x in reversed(nums):            # the values, backwards`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'reversed(range(n)) is easier to read',
        body: 'It says what it means and cannot be got wrong. Use it unless you need a step other than 1. Similarly, `reversed(nums)` iterates values backwards without building a copy — unlike `nums[::-1]`, which allocates a new list.',
      },
      { kind: 'heading', text: 'range is lazy' },
      {
        kind: 'code',
        code: `r = range(1000000)
# No list is built — range generates values on demand, O(1) memory

list(r)              # NOW a million-element list exists
len(r)               # 1000000 — still O(1), computed arithmetically
500 in r             # O(1) for ranges — computed, not searched`,
      },
      {
        kind: 'text',
        body: 'In Python 3, `range` is an object that produces values as needed rather than a list. So `for i in range(10**9)` uses constant memory. Wrapping it in `list()` is what actually allocates — and rarely necessary.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'A negative step needs stop below start',
        body: '`range(0, 5, -1)` produces nothing at all — no error, just an empty sequence, so the loop body never runs. If a backward loop appears to do nothing, check that start is greater than stop.',
      },
      {
        kind: 'code',
        caption: 'Grid traversal',
        code: `for r in range(rows):
    for c in range(cols):
        ...

# Direction offsets — the Python form of the dr/dc arrays
for dr, dc in ((-1, 0), (1, 0), (0, -1), (0, 1)):
    nr, nc = r + dr, c + dc
    if 0 <= nr < rows and 0 <= nc < cols:
        ...`,
      },
      {
        kind: 'text',
        body: 'That direction loop is the Python equivalent of C++\'s parallel `dr`/`dc` arrays, and unpacking the tuple directly makes it read better. Combined with chained comparisons, the bounds check is one clear line.',
      },
    ],
    keyTakeaways: [
      '`range(stop)`, `range(start, stop)`, `range(start, stop, step)` — stop is exclusive.',
      'Backwards needs `range(n-1, -1, -1)`; `reversed(range(n))` is clearer.',
      '`range` is lazy — it generates values without building a list.',
      'A negative step with stop above start silently yields nothing.',
    ],
    practice: {
      prompt: 'Print `list(range(4, 0, -1))` and `list(range(4, -1, -1))` and note which one misses zero. Then write a grid neighbour loop with tuple unpacking and a chained bounds check — that pattern recurs in every matrix and graph problem.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-2.14',
    language: 'python',
    summary: 'Recognise the loop shapes that nearly every array problem reduces to.',
    readMinutes: 6,
    blocks: [
      {
        kind: 'text',
        body: 'Most array and string problems are one of a small number of loop shapes. Recognising which one applies is most of solving the problem — this previews Chapter 14, framed as loop structure.',
      },
      { kind: 'heading', text: '1. Single pass — accumulate' },
      {
        kind: 'code',
        code: `total = 0
best = float("-inf")
for x in nums:
    total += x
    best = max(best, x)`,
      },
      {
        kind: 'text',
        body: 'One variable carrying information forward. **O(n)**. Note `float("-inf")` as the initial maximum — cleaner than picking an arbitrary small constant.',
      },
      { kind: 'heading', text: '2. Two pointers from both ends' },
      {
        kind: 'code',
        code: `left, right = 0, len(nums) - 1
while left < right:
    total = nums[left] + nums[right]
    if total == target:
        return [left, right]
    if total < target:
        left += 1
    else:
        right -= 1`,
      },
      {
        kind: 'text',
        body: 'Requires **sorted** input. Each step eliminates one candidate, giving O(n) where brute force is O(n²). Palindromes and reversals use the same shape.',
      },
      { kind: 'heading', text: '3. Fast and slow pointers' },
      {
        kind: 'code',
        code: `slow = fast = head
while fast and fast.next:
    slow = slow.next
    fast = fast.next.next
    if slow is fast:
        return True            # cycle detected`,
      },
      {
        kind: 'text',
        body: 'Note `while fast and fast.next` — the guard matches the two-level access in the body, and `is` is the correct comparison for "the same node".',
      },
      { kind: 'heading', text: '4. Sliding window' },
      {
        kind: 'code',
        code: `left = 0
total = 0
best = 0
for right, x in enumerate(nums):
    total += x                          # expand
    while total > limit:                # shrink until valid
        total -= nums[left]
        left += 1
    best = max(best, right - left + 1)  # record`,
      },
      {
        kind: 'text',
        body: 'Despite the nested `while`, this is **O(n)** — each element enters and leaves the window at most once. Use it for "longest/shortest contiguous subarray with property X".',
      },
      { kind: 'heading', text: '5. Prefix sum' },
      {
        kind: 'code',
        code: `prefix = [0] * (len(nums) + 1)
for i, x in enumerate(nums):
    prefix[i + 1] = prefix[i] + x

range_sum = prefix[j + 1] - prefix[i]     # sum of nums[i..j], O(1)

# Or with itertools:
from itertools import accumulate
prefix = [0] + list(accumulate(nums))`,
      },
      { kind: 'heading', text: '6. Nested loops — all pairs' },
      {
        kind: 'code',
        code: `for i in range(n):
    for j in range(i + 1, n):
        ...                    # each unordered pair exactly once`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'O(n²) is riskier in Python than in C++',
        body: 'Python is 10–100× slower with the same time limit, so an O(n²) loop that squeaks through in C++ will usually time out here. Treat n ≤ 1000 as the practical ceiling for nested loops, and reach for a dict or two pointers sooner than you would in C++.',
      },
      {
        kind: 'table',
        headers: ['Problem sounds like…', 'Reach for'],
        rows: [
          ['"pair summing to target", sorted input', 'Two pointers'],
          ['"longest/shortest contiguous subarray"', 'Sliding window'],
          ['"sum of range i..j", many queries', 'Prefix sum'],
          ['"cycle in a linked list"', 'Fast and slow pointers'],
          ['"have I seen this value"', 'A `set` in a single pass'],
          ['"count occurrences"', 'A `dict` or `Counter`'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Let the constraints choose the shape',
        body: 'n ≤ 10⁵ rules out O(n²) and points at O(n) or O(n log n). n ≤ 1000 makes O(n²) acceptable. n ≤ 20 suggests subsets or permutations. Reading the constraint before you start tells you which shape to aim for — and in Python it matters more, because the margin is thinner.',
      },
    ],
    keyTakeaways: [
      'Most array problems are single pass, two pointers, sliding window, or prefix sum.',
      'Sliding window is O(n) despite the inner `while` — each element enters once.',
      '`float("inf")` and `float("-inf")` are clean initial sentinels.',
      'Python\'s speed penalty makes O(n²) riskier — aim for the intended complexity.',
    ],
    practice: {
      prompt: 'Implement each of the six shapes once on small hand-made inputs, without looking back at the code. They are the vocabulary of the next 90 days — the goal is that reading a problem brings one of these to mind before you start typing.',
      leetcode: { title: 'Maximum Subarray', slug: 'maximum-subarray' },
    },
  },
];
