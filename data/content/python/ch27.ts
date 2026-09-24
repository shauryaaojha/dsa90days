import type { Lesson } from '../types';

/**
 * Chapter 27 — The Language Toolbox (Python).
 * Advanced Python standard library utilities, performance optimizations,
 * syntactic idioms, and built-ins for competitive programming and LeetCode.
 */
export const ch27: Lesson[] = [
  // -------------------------------------------------------------------------
  // 27.1: Fast input with sys.stdin
  // -------------------------------------------------------------------------
  {
    topicId: 'python-27.1',
    language: 'python',
    summary: 'Read high-volume input streams efficiently using sys.stdin.readline and sys.stdin.read.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'In competitive programming, online assessments, and platform contests outside LeetCode, inputs arrive through the standard input stream rather than pre-packaged function arguments. The built-in `input()` function performs interactive prompt handling and strips newline characters on every call, creating measurable overhead when a test case supplies hundreds of thousands of integers.',
      },
      { kind: 'heading', text: 'The three levels of input reading' },
      {
        kind: 'text',
        body: 'When handling large datasets, Python provides three progressively faster ways to consume input from the `sys` module: line-by-line reading with `sys.stdin.readline`, loading the entire stream into memory with `sys.stdin.read`, and iterating over token streams with `sys.stdin.read().split()`.',
      },
      {
        kind: 'code',
        caption: 'Reading bulk integers efficiently',
        code: `import sys


def solve_line_by_line():
    # sys.stdin.readline is several times faster than input()
    line = sys.stdin.readline()
    if not line:
        return
    n, k = map(int, line.split())
    values = [int(sys.stdin.readline()) for _ in range(n)]
    return n, k, values


def solve_all_at_once():
    # sys.stdin.read consumes the entire input stream to EOF at C speed
    input_data = sys.stdin.read().split()
    if not input_data:
        return
    # Use an iterator to consume tokens sequentially
    iterator = iter(input_data)
    n = int(next(iterator))
    k = int(next(iterator))
    values = [int(next(iterator)) for _ in range(n)]
    return n, k, values`,
      },
      {
        kind: 'table',
        headers: ['Method', 'Mechanic', 'Best Use Case'],
        rows: [
          ['`input()`', 'Interactive prompt checks, strips newline', 'Small inputs, local debugging'],
          ['`sys.stdin.readline()`', 'Reads one line with newline kept', 'Memory-constrained problems, line-based data'],
          ['`sys.stdin.read().split()`', 'Loads whole input, splits on all whitespace', 'Fastest method; bulk integer arrays up to 10^6 tokens'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'The trailing newline in readline',
        body: 'Unlike `input()`, `sys.stdin.readline()` keeps the trailing newline character `\\n`. When reading strings or comparing values, forgetting to strip the newline with `.rstrip()` causes string comparison failures and unintended line breaks.',
      },
    ],
    keyTakeaways: [
      '`sys.stdin.readline()` runs significantly faster than `input()` by skipping interactive prompt checks.',
      '`sys.stdin.read().split()` consumes the entire input stream at once in C and handles arbitrary whitespace delimiters.',
      'Remember to strip the trailing newline when reading string values with `sys.stdin.readline().rstrip()`.',
    ],
    practice: {
      prompt: 'Write a script that reads an integer N followed by N integers from standard input. Test it using sys.stdin.read().split() and calculate the sum and maximum value. Compare the execution speed against input() on an input of 100,000 numbers.',
    },
  },

  // -------------------------------------------------------------------------
  // 27.2: List, set and dict comprehensions
  // -------------------------------------------------------------------------
  {
    topicId: 'python-27.2',
    language: 'python',
    summary: 'Build lists, sets, and hash maps efficiently with idiomatic comprehension syntax.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A **comprehension** constructs a new data collection by evaluating an expression across each element of an iterable. In CPython, comprehensions run in optimized bytecode loops rather than repeatedly resolving and executing the `.append()` method in Python interpreter space. This provides both conciseness and higher execution speed for transformations and filtering.',
      },
      { kind: 'heading', text: 'Syntactic forms for lists, sets, and dictionaries' },
      {
        kind: 'text',
        body: 'The syntax follows a unified structure: an output expression, one or more `for` clauses, and optional `if` filters. Changing the enclosing brackets determines whether the output is a list, set, or dictionary.',
      },
      {
        kind: 'code',
        caption: 'List, set, and dictionary comprehension patterns',
        code: `nums = [1, 2, 2, 3, 4, 5, 6]

# List comprehension: filter even numbers and square them
even_squares = [x * x for x in nums if x % 2 == 0]
# Result: [4, 16, 36]

# Set comprehension: collect unique remainder classes modulo 3
remainders = {x % 3 for x in nums}
# Result: {0, 1, 2}

# Dictionary comprehension: build a lookup table of value to index
val_to_index = {val: idx for idx, val in enumerate(nums)}
# Result: {1: 0, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6}

# Nested list comprehension: 2D grid creation
rows, cols = 3, 4
grid = [[0 for _ in range(cols)] for _ in range(rows)]`,
      },
      {
        kind: 'table',
        headers: ['Comprehension', 'Syntax Pattern', 'Result Type'],
        rows: [
          ['List', '`[expr for item in iterable if cond]`', '`list`'],
          ['Set', '`{expr for item in iterable if cond}`', '`set` (deduplicated)'],
          ['Dictionary', '`{key: value for item in iterable if cond}`', '`dict` (key-value mapping)'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Shallow copy hazard in grid multiplication',
        body: 'Writing `[[0] * cols] * rows` creates multiple references pointing to the exact same inner list. Modifying `grid[0][0] = 1` changes the first element across every row. Always use a list comprehension `[[0] * cols for _ in range(rows)]` to allocate independent rows.',
      },
    ],
    keyTakeaways: [
      'Comprehensions execute faster than manual append loops by avoiding repetitive method attribute lookups.',
      'Deduplicate while transforming by wrapping the comprehension in braces `{expr for item in iterable}`.',
      'Always allocate 2D grids with list comprehensions so each row has an independent memory identity.',
    ],
    practice: {
      prompt: 'Given a matrix of account balances where each row represents a customer wealth list, use a list comprehension with sum() to compute the total wealth of each customer, returning the maximum value.',
      leetcode: { title: 'Richest Customer Wealth', slug: 'richest-customer-wealth' },
    },
  },

  // -------------------------------------------------------------------------
  // 27.3: Generators and yield
  // -------------------------------------------------------------------------
  {
    topicId: 'python-27.3',
    language: 'python',
    summary: 'Stream elements lazily with O(1) auxiliary memory using generator functions and the yield keyword.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Standard functions compute their entire collection in memory and return all elements at once. When generating sequence values from a large tree, graph, or numeric range, allocating a full list requires O(N) memory. A **generator function** uses the `yield` statement to return values one at a time on demand. When execution reaches `yield`, the function pauses its execution frame, preserves all local variables, and resumes only when the consumer asks for the next item.',
      },
      { kind: 'heading', text: 'How yield preserves execution state' },
      {
        kind: 'text',
        body: 'Calling a generator function does not run the body immediately; it returns a **generator object**. Each call to `next()` advances the code until the next `yield` expression is reached. When the function returns or finishes its statements, it signals completion by raising `StopIteration`.',
      },
      {
        kind: 'code',
        caption: 'Inorder binary tree traversal with a generator',
        code: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def inorder(node):
    if node is not None:
        yield from inorder(node.left)
        yield node.val
        yield from inorder(node.right)


# Generator expression: O(1) auxiliary memory pipeline
root = TreeNode(2, TreeNode(1), TreeNode(3))
values_gen = (val for val in inorder(root) if val > 1)

print(next(values_gen))  # 2
print(next(values_gen))  # 3`,
        output: '2\n3',
      },
      {
        kind: 'table',
        headers: ['Feature', 'Regular Function with List', 'Generator Function with Yield'],
        rows: [
          ['Memory Usage', 'O(N) upfront allocation', 'O(1) auxiliary frame memory'],
          ['Evaluation Strategy', 'Eager (computes entire collection)', 'Lazy (computes on demand)'],
          ['Composition', 'Returns concrete list container', 'Yields an iterable pipeline'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Generators can only be consumed once',
        body: 'A generator stream is stateful and exhausts itself as items are retrieved. Iterating over an exhausted generator with a second loop yields zero elements without error. If you need to traverse the elements multiple times, convert the generator to a concrete list with `list(gen)`.',
      },
    ],
    keyTakeaways: [
      '`yield` pauses function execution and maintains local state until `next()` requests another item.',
      '`yield from iterable` delegates iteration directly to a sub-generator or nested sequence.',
      'Generators operate lazily, using O(1) memory beyond call stack frames instead of allocating an O(N) list.',
    ],
    practice: {
      prompt: 'Implement a binary search tree iterator class that initialises with the root of a BST and provides next() and hasNext() methods in O(1) amortised time using an explicit pointer stack or generator pattern.',
      leetcode: { title: 'Binary Search Tree Iterator', slug: 'binary-search-tree-iterator' },
    },
  },

  // -------------------------------------------------------------------------
  // 27.4: enumerate, zip, map and filter
  // -------------------------------------------------------------------------
  {
    topicId: 'python-27.4',
    language: 'python',
    summary: 'Process collections in parallel, with indices, and through functional transforms using core iteration built-ins.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Traversing collections with manual counter variables creates unnecessary index tracking and boundary bugs. Python provides built-in iteration primitives that handle index tracking, parallel iteration across sequences, and element transformations directly in C.',
      },
      { kind: 'heading', text: 'Index tracking and parallel pairing' },
      {
        kind: 'text',
        body: 'The `enumerate` function yields pairs of `(index, element)` over any iterable. The `zip` function aggregates elements from multiple iterables element-wise, terminating when the shortest input iterable ends. Combining `zip` with argument unpacking (`zip(*matrix)`) provides an elegant technique to transpose matrices.',
      },
      {
        kind: 'code',
        caption: 'Using enumerate, zip, map, and filter',
        code: `# 1. enumerate with custom start offset
words = ["apple", "banana", "cherry"]
for idx, word in enumerate(words, start=1):
    pass  # (1, 'apple'), (2, 'banana'), (3, 'cherry')

# 2. zip across parallel lists and matrix transpose
names = ["Alice", "Bob"]
scores = [95, 88]
pairs = list(zip(names, scores))  # [('Alice', 95), ('Bob', 88)]

matrix = [
    [1, 2, 3],
    [4, 5, 6],
]
transposed = [list(col) for col in zip(*matrix)]
# [[1, 4], [2, 5], [3, 6]]

# 3. map and filter with transformations
raw_nums = ["10", "-5", "20", "-8"]
integers = list(map(int, raw_nums))
positives = list(filter(lambda x: x > 0, integers))
# [10, 20]`,
      },
      {
        kind: 'table',
        headers: ['Built-in', 'Primary Purpose', 'Algorithmic Use Case'],
        rows: [
          ['`enumerate(seq, start=0)`', 'Tracks iteration index alongside value', 'Building value-to-index maps in Two Sum'],
          ['`zip(*iterables)`', 'Pairs corresponding elements in lockstep', 'Lockstep checks, matrix transpose'],
          ['`map(func, iterable)`', 'Applies callable to each element', 'Batch type conversion (e.g. string to int)'],
          ['`filter(func, iterable)`', 'Keeps elements where predicate is true', 'Filtering out invalid search branches'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Silent truncation in zip',
        body: 'By default, `zip()` terminates as soon as the shortest iterable runs out of elements, discarding remaining items from longer iterables without warning. If all iterables must have matching lengths, use `zip(..., strict=True)` in Python 3.10+ or `itertools.zip_longest`.',
      },
    ],
    keyTakeaways: [
      'Use `enumerate` to access indices without managing manual counter variables or `range(len(...))` lookups.',
      'Use `zip(*matrix)` to transpose two-dimensional grids into column tuples in one step.',
      'In Python 3.10+, specify `strict=True` in `zip` calls when differing list lengths indicate data mismatch.',
    ],
    practice: {
      prompt: 'Given an array of strings, use zip(*strs) to inspect character columns in parallel and find the longest common prefix string across all elements.',
      leetcode: { title: 'Longest Common Prefix', slug: 'longest-common-prefix' },
    },
  },

  // -------------------------------------------------------------------------
  // 27.5: *args, **kwargs and unpacking
  // -------------------------------------------------------------------------
  {
    topicId: 'python-27.5',
    language: 'python',
    summary: 'Unpack collections into variables and pass variable-length positional and keyword arguments with * and **.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: '**Unpacking** extracts individual elements from a collection and assigns them to distinct variables or function parameters in a single step. The single asterisk `*` unpacks ordered sequences like lists and tuples, while the double asterisk `**` unpacks key-value pairs from mappings like dictionaries.',
      },
      { kind: 'heading', text: 'Sequence unpacking and variable arguments' },
      {
        kind: 'text',
        body: 'Extended unpacking allows variable assignment with a starred target that collects unmatched elements into a list. In function signatures, `*args` captures arbitrary positional arguments into a tuple, while `**kwargs` captures arbitrary keyword arguments into a dictionary.',
      },
      {
        kind: 'code',
        caption: 'Unpacking patterns and flexible function arguments',
        code: `# Extended unpacking
first, *middle, last = [10, 20, 30, 40, 50]
# first = 10, middle = [20, 30, 40], last = 50

# Merging collections with unpacking
list_a = [1, 2]
list_b = [3, 4]
combined = [*list_a, *list_b]  # [1, 2, 3, 4]

dict_a = {"x": 1, "y": 2}
dict_b = {"y": 99, "z": 3}
merged = {**dict_a, **dict_b}  # {'x': 1, 'y': 99, 'z': 3}


# Argument forwarding with *args and **kwargs
def logger(func):
    def wrapper(*args, **kwargs):
        result = func(*args, **kwargs)
        return result
    return wrapper


# Rotating a matrix clockwise: reverse rows then transpose
matrix = [[1, 2], [3, 4]]
rotated = [list(col) for col in zip(*matrix[::-1])]
# [[3, 1], [4, 2]]`,
      },
      {
        kind: 'table',
        headers: ['Syntax', 'Context', 'Action'],
        rows: [
          ['`a, *b, c = seq`', 'Assignment target', 'Captures excess sequence items into a list'],
          ['`func(*args)`', 'Function invocation', 'Unpacks elements of `args` as positional parameters'],
          ['`func(**kwargs)`', 'Function invocation', 'Unpacks key-value pairs of `kwargs` as named arguments'],
          ['`{*set_a, *set_b}`', 'Collection literal', 'Merges sets or lists into a fresh container'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Target count mismatch in standard unpacking',
        body: 'Writing `x, y = [1, 2, 3]` triggers `ValueError: too many values to unpack`. Conversely, `x, y, z = [1, 2]` triggers `ValueError: not enough values to unpack`. When the collection length varies dynamically, capture excess values using `*rest`.',
      },
    ],
    keyTakeaways: [
      'Use `*` to unpack sequence elements into arguments or merge lists without explicit concatenation loops.',
      'Use `**` to unpack dictionary mappings into keyword arguments or combine dictionaries.',
      'Extended iterable unpacking `head, *tail = items` partitions sequences cleanly without manual slicing.',
    ],
    practice: {
      prompt: 'Rotate an N x N 2D matrix by 90 degrees clockwise in place. Contrast an in-place transpose-and-reverse approach with the one-liner list(zip(*matrix[::-1])) idiom.',
      leetcode: { title: 'Rotate Image', slug: 'rotate-image' },
    },
  },

  // -------------------------------------------------------------------------
  // 27.6: f-strings and formatting
  // -------------------------------------------------------------------------
  {
    topicId: 'python-27.6',
    language: 'python',
    summary: 'Format strings, numbers, binary bitfields, and debug values with formatted string literals.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: '**Formatted string literals**, or **f-strings**, prefix a string with `f` or `F` and evaluate embedded replacement expressions enclosed in curly braces `{}`. Because f-strings parse and interpolate at runtime directly in C bytecode, they execute faster than older `%` operator formatting or `.format()` method calls.',
      },
      { kind: 'heading', text: 'Precision, padding, and base formatting' },
      {
        kind: 'text',
        body: 'Format specifiers are added following a colon inside the replacement field `{value:specifier}`. These control floating-point rounding precision, minimum width alignment, zero-padding for numbers, and representations in binary, octal, or hexadecimal format.',
      },
      {
        kind: 'code',
        caption: 'Common formatting patterns in algorithm problems',
        code: `# 1. Decimal precision
pi = 3.14159265
formatted_pi = f"{pi:.3f}"  # '3.142'

# 2. Zero-padding and integer bitfield formatting
val = 42
padded = f"{val:05d}"      # '00042'
binary_rep = f"{val:08b}"  # '00101010'
hex_rep = f"{val:04x}"     # '002a'

# 3. String padding and alignment
left_aligned = f"{'left':<8}"    # 'left    '
centered = f"{'center':^10}"     # '  center  '
right_aligned = f"{'right':>8}"  # '   right'

# 4. Debugging specifier (=)
count = 7
debug_str = f"{count=}"  # 'count=7'`,
      },
      {
        kind: 'table',
        headers: ['Specifier', 'Meaning', 'Example Output'],
        rows: [
          ['`{x:.2f}`', 'Floating-point rounded to 2 decimal places', '`3.14`'],
          ['`{x:08b}`', 'Binary representation padded to 8 bits with leading zeros', '`00101010`'],
          ['`{x:06d}`', 'Integer padded to 6 digits with leading zeros', '`000042`'],
          ['`{x=}`', 'Variable name and current evaluation value', '`x=10`'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Avoid f-strings as coordinate keys in hash maps',
        body: 'Using `f"{row},{col}"` to create keys for a visited set or memoisation dictionary incurs string formatting and dynamic memory allocation on every lookup. Use a lightweight immutable tuple `(row, col)` instead, which hashes much faster and consumes less memory.',
      },
    ],
    keyTakeaways: [
      'f-strings evaluate expressions at runtime in C bytecode, offering clean syntax and high execution speed.',
      'Use `{num:0Nb}` to generate fixed-width binary representations when manipulating bitmasks.',
      'Avoid building string keys for graph and grid states; use immutable tuples `(r, c)` for hash collections.',
    ],
    practice: {
      prompt: 'Given two complex numbers represented as strings in the format "real+imaginaryi", parse the integer coefficients, perform multiplication, and format the resulting string using an f-string.',
      leetcode: { title: 'Complex Number Multiplication', slug: 'complex-number-multiplication' },
    },
  },

  // -------------------------------------------------------------------------
  // 27.7: itertools essentials
  // -------------------------------------------------------------------------
  {
    topicId: 'python-27.7',
    language: 'python',
    summary: 'Generate permutations, combinations, cartesian products, and running prefix accumulations with itertools.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'The `itertools` module provides memory-efficient, C-speed iterator building blocks. While writing recursive backtracking algorithms from scratch is essential for interviews, understanding `itertools` accelerates combinatorial prototyping, test generation, and brute-force verification in competitive programming.',
      },
      { kind: 'heading', text: 'Permutations, combinations, product, and accumulate' },
      {
        kind: 'text',
        body: 'The four most common tools are `permutations` (ordered arrangements), `combinations` (unordered selections without replacement), `product` (Cartesian product across iterables, mimicking nested loops), and `accumulate` (running prefix reductions).',
      },
      {
        kind: 'code',
        caption: 'Generating arrangements and prefix values',
        code: `import itertools

items = [1, 2, 3]

# Permutations: all ordered arrangements of length r
perms = list(itertools.permutations(items, r=2))
# [(1, 2), (1, 3), (2, 1), (2, 3), (3, 1), (3, 2)]

# Combinations: unique unordered selections without replacement
combs = list(itertools.combinations(items, r=2))
# [(1, 2), (1, 3), (2, 3)]

# Cartesian product: equivalent to nested for-loops
grid_points = list(itertools.product(range(2), range(3)))
# [(0, 0), (0, 1), (0, 2), (1, 0), (1, 1), (1, 2)]

# Accumulate: running prefix sums and running maximums
nums = [3, 1, 4, 1, 5]
prefix_sums = list(itertools.accumulate(nums))
# [3, 4, 8, 9, 14]
running_max = list(itertools.accumulate(nums, func=max))
# [3, 3, 4, 4, 5]`,
      },
      {
        kind: 'table',
        headers: ['Function', 'Order Matters', 'Replacement', 'Output Count (size n, choose r)'],
        rows: [
          ['`permutations(n, r)`', 'Yes', 'No', 'n! / (n - r)!'],
          ['`combinations(n, r)`', 'No', 'No', 'n! / (r! * (n - r)!)'],
          ['`product(*iterables)`', 'Yes', 'N/A', 'Product of iterable lengths'],
          ['`accumulate(iterable)`', 'Preserves sequence', 'N/A', 'n (running intermediate outputs)'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Combinatorial explosion and memory limits',
        body: 'Combinations and permutations grow factorially. For `n = 12`, `permutations` yields 479,001,600 tuples. Wrapping an itertools generator in `list(...)` forces the entire sequence into memory at once, causing an Out Of Memory crash or Time Limit Exceeded.',
      },
    ],
    keyTakeaways: [
      '`itertools` functions return lazy iterators that produce elements one by one without allocating entire result sets.',
      'Use `itertools.accumulate` with custom functions like `max` or `min` to compute prefix extremes in linear time.',
      'Avoid converting combinatorial generators directly to lists on inputs where N exceeds 10 without calculating cardinality.',
    ],
    practice: {
      prompt: 'Given an array of distinct integers, generate all possible permutations using itertools.permutations. Then implement the backtracking solution from scratch and compare the structures.',
      leetcode: { title: 'Permutations', slug: 'permutations' },
    },
  },

  // -------------------------------------------------------------------------
  // 27.8: functools: lru_cache, reduce and cmp_to_key
  // -------------------------------------------------------------------------
  {
    topicId: 'python-27.8',
    language: 'python',
    summary: 'Memoize recursive functions with lru_cache, transform custom sort comparisons with cmp_to_key, and fold collections with reduce.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'The `functools` module provides higher-order functions that transform or augment other callables. In algorithmic problem solving, three functions stand out: `@lru_cache` for automatic dynamic programming memoisation, `cmp_to_key` for custom comparator sorting, and `reduce` for iterative accumulation.',
      },
      { kind: 'heading', text: 'Automatic memoisation and custom comparators' },
      {
        kind: 'text',
        body: 'The `@lru_cache(maxsize=None)` decorator wraps a recursive function with an internal dictionary that maps input argument tuples to return values. When arguments repeat, the cached value returns in O(1) time. For sorting where items must be compared pairwise with non-standard logic (such as concatenating numbers as strings), `cmp_to_key` adapts a two-argument comparator into a key function.',
      },
      {
        kind: 'code',
        caption: 'Using lru_cache, cmp_to_key, and reduce',
        code: `from functools import cmp_to_key, lru_cache, reduce


# 1. Automatic DP memoisation
@lru_cache(maxsize=None)
def min_coins(rem: int, coins: tuple[int, ...]) -> int:
    if rem == 0:
        return 0
    if rem < 0:
        return -1
    best = float("inf")
    for coin in coins:
        res = min_coins(rem - coin, coins)
        if res != -1:
            best = min(best, res + 1)
    return int(best) if best != float("inf") else -1


# 2. Custom sort comparator: LeetCode Largest Number
def compare_concat(a: str, b: str) -> int:
    # return negative if a should precede b, positive if b should precede a
    if a + b > b + a:
        return -1
    elif a + b < b + a:
        return 1
    return 0


nums = ["3", "30", "34", "5", "9"]
sorted_nums = sorted(nums, key=cmp_to_key(compare_concat))
# Result: ['9', '5', '34', '3', '30']

# 3. Cumulative fold with reduce
product = reduce(lambda acc, x: acc * x, [1, 2, 3, 4], 1)  # 24`,
      },
      {
        kind: 'table',
        headers: ['Utility', 'Input Arguments', 'Functionality'],
        rows: [
          ['`@lru_cache(maxsize=None)`', 'Function callable', 'Caches argument-to-return mappings in a hash table'],
          ['`cmp_to_key(func)`', 'Two-argument comparator `(a, b) -> int`', 'Converts comparator to modern `key` parameter'],
          ['`reduce(func, iterable, init)`', 'Two-argument reduction lambda', 'Folds collection elements into a single aggregate'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Unhashable arguments with lru_cache',
        body: 'The `@lru_cache` decorator stores arguments as dictionary keys. If you pass a mutable collection like a `list` or `dict` as a parameter to a cached function, Python raises `TypeError: unhashable type: list`. Always pass immutable types like `tuple` or integer indices.',
      },
    ],
    keyTakeaways: [
      '`@lru_cache(maxsize=None)` turns exponential top-down recursive relations into polynomial dynamic programming.',
      'Function arguments passed into cached functions must be hashable; convert lists to tuples before passing.',
      'Use `cmp_to_key` when sorting logic depends on pairwise comparisons between two elements rather than an independent property.',
    ],
    practice: {
      prompt: 'Given a list of non-negative integers, arrange them such that they form the largest possible number when concatenated. Use cmp_to_key to implement the string comparison logic.',
      leetcode: { title: 'Largest Number', slug: 'largest-number' },
    },
  },

  // -------------------------------------------------------------------------
  // 27.9: The math module
  // -------------------------------------------------------------------------
  {
    topicId: 'python-27.9',
    language: 'python',
    summary: 'Execute exact integer square roots, greatest common divisors, and combinatorial calculations using the math module.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Python provides arbitrary-precision integers that never overflow 32-bit or 64-bit bounds. Floating-point numbers, however, conform to IEEE 754 64-bit precision and lose exactness beyond 53 bits (around 9 quadrillion). Relying on floating-point arithmetic for integer problems introduces precision errors. The standard `math` module provides integer-exact mathematical algorithms that avoid floating-point inaccuracies.',
      },
      { kind: 'heading', text: 'Integer roots, GCD, and combinatorics' },
      {
        kind: 'text',
        body: 'Key functions include `math.isqrt(n)` for exact integer square roots (`floor(sqrt(n))`), `math.gcd` and `math.lcm` for number theory calculations, `math.comb(n, k)` and `math.perm(n, k)` for combinatorial calculations without floating-point division, and `math.inf` for sentinel boundary values.',
      },
      {
        kind: 'code',
        caption: 'Essential math module functions',
        code: `import math

# 1. Exact integer square root
large_num = 10**16 + 1
root = math.isqrt(large_num)  # Exactly 100,000,000

# 2. Number theory: GCD and LCM
gcd_val = math.gcd(24, 60, 36)  # 12
lcm_val = math.lcm(12, 18)      # 36

# 3. Exact combinatorics: combinations and permutations
ways = math.comb(10, 3)         # Exactly 120 (10! / (3! * 7!))
arrangements = math.perm(5, 2)  # 20

# 4. Integer ceiling division without floating-point errors
a, b = 10, 3
ceil_div = (a + b - 1) // b      # 4 (exact integer arithmetic)
ceil_func = math.ceil(a / b)     # 4`,
      },
      {
        kind: 'table',
        headers: ['Function', 'Return Type', 'Purpose'],
        rows: [
          ['`math.isqrt(n)`', '`int`', 'Exact `floor(sqrt(n))` without float rounding'],
          ['`math.gcd(*integers)`', '`int`', 'Greatest common divisor of given integers'],
          ['`math.lcm(*integers)`', '`int`', 'Least common multiple of given integers'],
          ['`math.comb(n, k)`', '`int`', 'Binomial coefficient n-choose-k computed in exact integers'],
          ['`math.inf`', '`float`', 'Positive infinity sentinel for minimum-tracking'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Floating-point precision loss with math.sqrt',
        body: 'Evaluating `int(math.sqrt(n))` on a large perfect square like `(10**9)**2 - 1` can produce an incorrect value because `math.sqrt` converts its argument to a 64-bit float before computing the root. Always use `math.isqrt(n)` when working with integers.',
      },
    ],
    keyTakeaways: [
      'Use `math.isqrt(n)` instead of `int(math.sqrt(n))` to avoid float truncation errors on large integers.',
      'Compute binomial coefficients with `math.comb(n, k)` to obtain exact results without manual factorial divisions.',
      '`math.gcd` accepts an arbitrary number of integer arguments in modern Python.',
    ],
    practice: {
      prompt: 'Determine whether you can measure target liters using two jugs with capacities x and y. Apply the Bezout identity using math.gcd.',
      leetcode: { title: 'Water and Jug Problem', slug: 'water-and-jug-problem' },
    },
  },

  // -------------------------------------------------------------------------
  // 27.10: String methods deep dive
  // -------------------------------------------------------------------------
  {
    topicId: 'python-27.10',
    language: 'python',
    summary: 'Manipulate strings efficiently using character classifications, splitting variants, and delimiter joining.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Strings in Python are **immutable sequences** of Unicode characters. Modifying a string does not update its characters in place; every alteration allocates a new string object in memory. Understanding which string methods operate in linear time and how to avoid repeated string concatenation prevents quadratic time complexity bottlenecks on LeetCode.',
      },
      { kind: 'heading', text: 'Character tests, splitting, and buffer concatenation' },
      {
        kind: 'text',
        body: 'Methods like `.isalnum()`, `.isalpha()`, `.isdigit()`, and `.isspace()` inspect character categories. The `.split()` method partitions strings into lists, while `separator.join(list_of_strings)` reassembles lists into a single string in linear time.',
      },
      {
        kind: 'code',
        caption: 'Efficient string manipulation techniques',
        code: `# 1. Character classification for palindrome checks
s = "A man, a plan, a canal: Panama"
cleaned = [ch.lower() for ch in s if ch.isalnum()]
is_palindrome = cleaned == cleaned[::-1]

# 2. Whitespace splitting: split() vs split(' ')
text = "  the   sky  is   blue  "
# split() with no arguments condenses runs of whitespace and strips ends
tokens = text.split()
# Result: ['the', 'sky', 'is', 'blue']
reversed_sentence = " ".join(reversed(tokens))
# Result: 'blue is sky the'

# 3. Trimming and prefix/suffix removal
raw_path = "///root/folder/data.json//"
cleaned_path = raw_path.strip("/")                # 'root/folder/data.json'
without_ext = cleaned_path.removesuffix(".json")  # 'root/folder/data'`,
      },
      {
        kind: 'table',
        headers: ['Method', 'Time Complexity', 'Behavior'],
        rows: [
          ['`s.split()`', 'O(N)', 'Splits on arbitrary runs of whitespace, discards empty tokens'],
          ['`s.split(delim)`', 'O(N)', 'Splits on exact delimiter; keeps empty strings between adjacent delimiters'],
          ['`delim.join(iterable)`', 'O(N total chars)', 'Allocates exact buffer once and joins elements in linear time'],
          ['`s.startswith(prefix)`', 'O(len(prefix))', 'Checks prefix without slicing full string'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Repeated string concatenation inside loops',
        body: 'Writing `s += ch` inside a loop of length N repeatedly creates a new string of growing length, yielding an O(N^2) total runtime. Always collect characters in a list using `.append(ch)` and combine them at the end with `"".join(buffer)` in O(N) time.',
      },
    ],
    keyTakeaways: [
      'Strings are immutable; repeated concatenation with `+=` leads to quadratic O(N^2) memory copies.',
      'Use `s.split()` with no arguments to automatically filter out consecutive whitespace tokens.',
      'Use `delim.join(buffer)` to construct strings from lists in linear O(N) time.',
    ],
    practice: {
      prompt: 'Given a string s, determine if it is a palindrome considering only alphanumeric characters and ignoring cases. Implement it using character classification methods.',
      leetcode: { title: 'Valid Palindrome', slug: 'valid-palindrome' },
    },
  },

  // -------------------------------------------------------------------------
  // 27.11: dataclass and namedtuple
  // -------------------------------------------------------------------------
  {
    topicId: 'python-27.11',
    language: 'python',
    summary: 'Design structured, comparable records for heap queues and graph models with dataclass and namedtuple.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Algorithm problems frequently involve composite records such as graph edges with weights, coordinate states with step counts, or tree node references. Storing these in raw tuples (`item[0]`, `item[1]`) creates unreadable code, while full custom classes require verbose `__init__`, `__repr__`, and `__eq__` implementations. Python provides `@dataclass` and `namedtuple` to represent clean structured records with minimal overhead.',
      },
      { kind: 'heading', text: 'Lightweight tuples vs rich data classes' },
      {
        kind: 'text',
        body: '`namedtuple` produces an immutable tuple with named field access and zero memory overhead over raw tuples. The `@dataclass` decorator automatically generates initialisation and representation methods, and with `order=True` can synthesize comparison operators (`<`, `<=`, `>`, `>=`) for direct use in `heapq` and sorting.',
      },
      {
        kind: 'code',
        caption: 'Structured models with namedtuple and dataclass',
        code: `from collections import namedtuple
from dataclasses import dataclass, field
import heapq

# 1. namedtuple: immutable, unpackable, zero memory overhead
Edge = namedtuple("Edge", ["u", "v", "weight"])
e = Edge(1, 2, 10)
print(e.u, e.weight)  # 1, 10
u, v, w = e           # Unpackable like a regular tuple


# 2. dataclass with heap order support
@dataclass(order=True)
class HeapItem:
    priority: int
    # Exclude non-comparable payloads from tie-breaking comparisons
    item: object = field(compare=False)


heap = []
heapq.heappush(heap, HeapItem(3, "low priority"))
heapq.heappush(heap, HeapItem(1, "high priority"))

top = heapq.heappop(heap)
print(top.priority, top.item)  # 1, 'high priority'`,
        output: '1 10\n1 high priority',
      },
      {
        kind: 'table',
        headers: ['Feature', 'namedtuple', '@dataclass'],
        rows: [
          ['Mutability', 'Immutable', 'Mutable by default (`frozen=True` optional)'],
          ['Memory Footprint', 'Identical to plain tuple', 'Standard Python object instance'],
          ['Tuple Unpacking', 'Supported (`a, b = obj`)', 'Requires manual conversion or `astuple`'],
          ['Custom Comparison', 'Lexicographical on all fields', 'Configurable with `order=True` and `field(compare=False)`'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Comparison crashes in heaps during priority ties',
        body: 'When two objects in a min-heap have identical priority values, Python compares the next field. If the next field is an unorderable object like a `ListNode`, Python raises `TypeError: < not supported between instances`. When using `@dataclass(order=True)`, set `field(compare=False)` on all payload fields.',
      },
    ],
    keyTakeaways: [
      'Use `namedtuple` for immutable, unpackable records where field names clarify index access.',
      'Use `@dataclass(order=True)` to create custom structures for sorting and min-heaps.',
      'Mark non-comparable payload fields with `field(compare=False)` to prevent priority tie crashes.',
    ],
    practice: {
      prompt: 'Merge k sorted linked lists and return it as one sorted list. Use a min-heap with a custom wrapper or dataclass with field(compare=False) to avoid comparison errors on ListNode instances during priority ties.',
      leetcode: { title: 'Merge k Sorted Lists', slug: 'merge-k-sorted-lists' },
    },
  },

  // -------------------------------------------------------------------------
  // 27.12: Exceptions and try/except
  // -------------------------------------------------------------------------
  {
    topicId: 'python-27.12',
    language: 'python',
    summary: 'Handle edge cases, parse numeric conversions, and configure recursion depth limits safely.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'In Python, runtime errors trigger **exceptions**. Python embraces the **EAFP** philosophy ("Easier to Ask for Forgiveness than Permission"), which handles borderline operations by attempting them inside a `try` block and intercepting predictable exceptions in an `except` clause. Understanding exception categories also clarifies the runtime errors reported by LeetCode.',
      },
      { kind: 'heading', text: 'Catching exceptions and configuring system limits' },
      {
        kind: 'text',
        body: 'A complete exception block includes `try`, specific `except ExceptionType as err:`, an optional `else` block (executes only when no exception was raised), and `finally` (always executes). For deep recursive graph traversals, Python enforces a default recursion limit of 1,000 frames to prevent C stack overflow, which can be adjusted with `sys.setrecursionlimit`.',
      },
      {
        kind: 'code',
        caption: 'Exception handling and recursion limit configuration',
        code: `import sys

# 1. Raising the recursion limit for deep DFS (default is 1000)
sys.setrecursionlimit(200_000)


# 2. Defensive numeric conversion
def parse_token(token: str) -> int | None:
    try:
        return int(token)
    except ValueError:
        # Non-numeric string encountered
        return None


# 3. Intercepting specific LeetCode errors
lookup = {"a": 10, "b": 20}
try:
    val = lookup["c"]
except KeyError:
    val = 0`,
      },
      {
        kind: 'table',
        headers: ['Exception', 'Root Cause', 'Defensive Solution'],
        rows: [
          ['`IndexError`', 'List index out of range', 'Verify `0 <= idx < len(nums)`'],
          ['`KeyError`', 'Dictionary key missing', 'Use `dict.get(key, default)` or `defaultdict`'],
          ['`ZeroDivisionError`', 'Division or modulo by zero', 'Check denominator before `/` or `%`'],
          ['`RecursionError`', 'Recursion depth exceeded 1000', 'Use `sys.setrecursionlimit` or iterative stack'],
          ['`ValueError`', 'Inappropriate value (e.g. `int("abc")`)', 'Catch `ValueError` around conversion'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'The danger of bare except clauses',
        body: 'Writing a bare `except:` without specifying an exception class catches system-level signals including `KeyboardInterrupt` and `SystemExit`. This prevents you from stopping an infinite loop in your terminal and conceals underlying syntax errors. Always catch specific exception classes.',
      },
    ],
    keyTakeaways: [
      'Catch only expected exception classes (like `ValueError` or `KeyError`), never bare `except:`.',
      'Deep graph and tree recursions on test cases of size 10^5 require `sys.setrecursionlimit(200_000)`.',
      'Prefer container methods like `dict.get(key, default)` over try/except for standard missing key checks.',
    ],
    practice: {
      prompt: 'Implement a string-to-integer conversion function that trims whitespace, parses an optional sign, processes numeric digits, handles overflow clamped to 32-bit signed integer limits, and uses defensive checks or try/except.',
      leetcode: { title: 'String to Integer (atoi)', slug: 'string-to-integer-atoi' },
    },
  },

  // -------------------------------------------------------------------------
  // 27.13: Type hints for reading LeetCode signatures
  // -------------------------------------------------------------------------
  {
    topicId: 'python-27.13',
    language: 'python',
    summary: 'Decode type annotations, Optional wrappers, and union operators in LeetCode problem signatures.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Every LeetCode problem provides a method signature decorated with type hints, such as `def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:`. These annotations communicate the exact input structures the judge provides and the return type it checks. Python does not enforce these annotations at runtime; they serve as structural contracts for readability and static analysis tools like mypy.',
      },
      { kind: 'heading', text: 'Deciphering modern and legacy annotations' },
      {
        kind: 'text',
        body: 'In Python 3.10+, generic collections like `list[int]`, `dict[str, int]`, and `tuple[int, ...]` can be used directly without importing from the `typing` module. You will also encounter `Optional[T]` (which means `T | None`), `Union[T1, T2]`, and references to judge-defined classes like `ListNode` and `TreeNode`.',
      },
      {
        kind: 'code',
        caption: 'Reading LeetCode signatures and type annotations',
        code: `from typing import Optional


# Judge definition for linked list node
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


# Dissecting a typical LeetCode signature:
# - head can be a ListNode or None (empty list)
# - returns either a ListNode or None
class Solution:
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        prev: Optional[ListNode] = None
        curr: Optional[ListNode] = head
        while curr is not None:
            nxt: Optional[ListNode] = curr.next
            curr.next = prev
            prev = curr
            curr = nxt
        return prev`,
      },
      {
        kind: 'table',
        headers: ['Annotation', 'Python 3.10+ Equivalent', 'Meaning in Judge Signatures'],
        rows: [
          ['`Optional[ListNode]`', '`ListNode | None`', 'A node pointer or `None` if list or tree is empty'],
          ['`List[int]`', '`list[int]`', 'A dynamic list containing integers'],
          ['`List[List[int]]`', '`list[list[int]]`', 'A 2D matrix of integers'],
          ['`Tuple[int, ...]`', '`tuple[int, ...]`', 'A tuple of arbitrary length containing integers'],
          ['`Union[int, str]`', '`int | str`', 'An argument that may be an integer or a string'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Type hints do not validate values at runtime',
        body: 'A variable typed as `head: ListNode` will not trigger a runtime error if passed `None` or an integer. Type hints do not validate types during execution; they are purely informational. Defensive checks like `if not head:` are still required in your logic.',
      },
    ],
    keyTakeaways: [
      'Type annotations in LeetCode signatures are structural guides, not runtime constraints.',
      '`Optional[T]` indicates that a parameter or return value can be `None`, common in trees and linked lists.',
      'Modern Python 3.10+ uses native collections `list[int]` and union pipe `int | None` instead of typing imports.',
    ],
    practice: {
      prompt: 'Reverse a singly linked list given its head node. Inspect the method signature, annotate intermediate pointer variables with Optional[ListNode], and return the reversed list.',
      leetcode: { title: 'Reverse Linked List', slug: 'reverse-linked-list' },
    },
  },

  // -------------------------------------------------------------------------
  // 27.14: Decorators: just enough for lru_cache
  // -------------------------------------------------------------------------
  {
    topicId: 'python-27.14',
    language: 'python',
    summary: 'Understand how function decorators work internally to use @lru_cache and custom wrappers effectively.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'In Python, functions are **first-class objects**: they can be assigned to variables, passed as arguments to other functions, and returned from functions. A **decorator** is a callable that accepts a function as an argument, adds functionality around it, and returns the modified function. The `@decorator` syntax is syntactic sugar that rebinds the function name to the wrapped output.',
      },
      { kind: 'heading', text: 'Deconstructing the @ symbol' },
      {
        kind: 'text',
        body: 'Writing `@memoize` above `def fib(n):` is equivalent to writing `fib = memoize(fib)`. By understanding this mechanism, you can understand how standard memoisation decorators like `@lru_cache` intercept recursive calls, inspect arguments, and return cached results from a hash table.',
      },
      {
        kind: 'code',
        caption: 'Building a memoisation decorator from scratch',
        code: `from functools import lru_cache, wraps


# Building a manual memoisation decorator
def custom_memoize(func):
    cache = {}

    @wraps(func)
    def wrapper(*args):
        if args not in cache:
            cache[args] = func(*args)
        return cache[args]

    return wrapper


@custom_memoize
def fib_custom(n: int) -> int:
    if n < 2:
        return n
    return fib_custom(n - 1) + fib_custom(n - 2)


# The standard library equivalent:
@lru_cache(maxsize=None)
def fib_standard(n: int) -> int:
    if n < 2:
        return n
    return fib_standard(n - 1) + fib_standard(n - 2)`,
      },
      {
        kind: 'table',
        headers: ['Step', 'Code Equivalent', 'Underlying Action'],
        rows: [
          ['Decorator Application', '`@decorator` above `def f():`', 'Passes `f` into `decorator` and rebinds `f = decorator(f)`'],
          ['Closure Creation', '`def wrapper(*args):` inside decorator', 'Encloses state (such as cache dictionary) in wrapper function frame'],
          ['Metadata Preservation', '`@wraps(func)` above `wrapper`', 'Copies original `__name__` and `__doc__` to the wrapper function'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Decorating class methods and the self parameter',
        body: 'If you apply `@lru_cache` to a method inside `class Solution`, `self` becomes the first cached argument. If `self` has mutable attributes or different instances are created, caching behaviour can become unpredictable. Inside `class Solution`, write recursive dynamic programming functions as inner functions inside the method and decorate the inner function.',
      },
    ],
    keyTakeaways: [
      'The `@` decorator syntax is shorthand for function transformation: `func = decorator(func)`.',
      '`@wraps(func)` preserves the original function name and docstring when authoring wrapper decorators.',
      'Decorating an inner helper function inside `class Solution` methods avoids caching the `self` reference.',
    ],
    practice: {
      prompt: 'Find the minimum cost to reach the top of a staircase. Implement a top-down recursive solution with an inner helper function decorated with @lru_cache(maxsize=None).',
      leetcode: { title: 'Min Cost Climbing Stairs', slug: 'min-cost-climbing-stairs' },
    },
  },
];
