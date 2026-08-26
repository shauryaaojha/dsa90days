import type { Lesson } from '../types';

/**
 * Python Chapter 5 — Tuples, Sets, and Dictionaries.
 * The hash-based containers that turn most O(n^2) solutions into O(n), plus
 * the collections module helpers that make them one-liners.
 */
export const ch05: Lesson[] = [
  // -------------------------------------------------------------------------
  {
    topicId: 'python-5.1',
    language: 'python',
    summary: 'Use immutable sequences — and understand why immutability makes them hashable.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A tuple is a list that cannot be changed after it is built. That sounds like a pure downside until you see what it buys: because a tuple can never change, Python can hash it — which means **a tuple can be a dict key or a set member, and a list cannot**. That single consequence is why tuples matter in DSA.',
      },
      {
        kind: 'code',
        code: `t = (1, 2, 3)
t = 1, 2, 3              # parentheses are optional
t = ()                   # empty tuple
t = (5,)                 # SINGLE-element tuple — the comma is required
t = (5)                  # just the integer 5, not a tuple!`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'A one-element tuple needs a trailing comma',
        body: '`(5)` is `5` in brackets — the parentheses are just grouping. `(5,)` is a tuple. This catches people building single-element tuples for a set or dict key, where the result is silently the wrong type.',
      },
      {
        kind: 'code',
        caption: 'Everything a list can do, minus mutation',
        code: `t = (10, 20, 30)

t[0]             # 10
t[-1]            # 30
t[1:]            # (20, 30) — slicing returns a tuple
len(t)           # 3
20 in t          # True
for x in t: ...

t[0] = 99        # TypeError: 'tuple' object does not support item assignment
t.append(4)      # AttributeError — no such method`,
      },
      { kind: 'heading', text: 'Unpacking' },
      {
        kind: 'code',
        code: `a, b = (1, 2)
a, b = b, a                     # swap — builds a tuple then unpacks it

for i, x in enumerate(nums):    # enumerate yields tuples
    ...
for k, v in d.items():          # items() yields tuples
    ...

first, *rest = (1, 2, 3, 4)     # first = 1, rest = [2, 3, 4]
_, value = get_pair()           # _ conventionally means "ignore"`,
      },
      {
        kind: 'text',
        body: 'Tuples are everywhere in Python precisely because they are the natural return type for multiple values and the natural element type for pairs. `return a, b` builds one implicitly.',
      },
      { kind: 'heading', text: 'They compare element-wise' },
      {
        kind: 'code',
        code: `(1, 2) < (1, 3)          # True — first elements tie, second decides
(1, 5) < (2, 0)          # True — first element decides
(1, 2) == (1, 2)         # True

sorted([(3, 'c'), (1, 'b'), (1, 'a')])
# [(1, 'a'), (1, 'b'), (3, 'c')] — by first, then second`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'This is why heapq and sort work on tuples with no comparator',
        body: '`sorted(intervals)` orders by start then end with no `key=` needed — exactly what Merge Intervals wants. And `heapq.heappush(h, (dist, node))` gives a min-heap by distance for free. Putting the sort key first is a habit worth forming.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'A tuple containing a list is not hashable',
        body: '`(1, [2, 3])` cannot be a dict key — hashability requires *every* element to be hashable. The tuple itself is immutable, but the list inside is not, so its hash could change. `(1, (2, 3))` works fine.',
      },
      {
        kind: 'text',
        body: 'One efficiency note: tuples are slightly smaller and faster to create than lists, because their size is fixed. It rarely matters in DSA, but for a large collection of fixed-size records it is a free win.',
      },
    ],
    keyTakeaways: [
      'Tuples are immutable sequences; `(5,)` needs the trailing comma.',
      'They support indexing, slicing and iteration — just not mutation.',
      'They compare element-wise, which is why sort and heapq need no comparator.',
      'A tuple is hashable only if every element inside it is.',
    ],
    practice: {
      prompt: 'Build `(5)` and `(5,)` and check `type()` on both. Then sort a list of `(start, end)` tuples with no `key=` and confirm it orders by start then end. Then try `(1, [2])` as a dict key and read the error.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-5.2',
    language: 'python',
    summary: 'Know the three situations where a tuple is the right choice.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'You will not agonise over this often — lists are the default and that is fine. But there are three situations where a tuple is clearly the right answer, and recognising them saves you from bugs that are otherwise hard to diagnose. Learn the three and treat everything else as a list.',
      },
      { kind: 'heading', text: '1. As a dict key or set element' },
      {
        kind: 'code',
        code: `visited = set()
visited.add((r, c))              # a grid coordinate — the standard idiom
if (nr, nc) not in visited: ...

memo = {}
memo[(r, c)] = result            # 2D memoisation, no nested dicts needed
memo[(i, j, k)] = result         # any number of dimensions

visited.add([r, c])              # TypeError: unhashable type: 'list'`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'This is the biggest single reason tuples matter in DSA',
        body: 'Tracking visited cells with a set of `(r, c)` tuples is cleaner than allocating a 2D boolean grid, works when coordinates are unbounded, and needs no dimensions. C++ requires a custom hash or an encoded integer for the same thing; Python gives it to you free.',
      },
      { kind: 'heading', text: '2. As a sort key' },
      {
        kind: 'code',
        code: `# Sort by frequency descending, then by value ascending
items.sort(key=lambda x: (-freq[x], x))

# Sort by length, then alphabetically
words.sort(key=lambda w: (len(w), w))

# heapq with a composite priority
heapq.heappush(heap, (dist, node))
heapq.heappush(heap, (-count, value))     # negate for a max-heap`,
      },
      {
        kind: 'text',
        body: 'Because tuples compare element-wise, one tuple key handles any number of sort levels. The equivalent in Java is a chained `Comparator` and in C++ a multi-branch lambda — this is one place Python is genuinely shorter.',
      },
      { kind: 'heading', text: '3. As a multi-value return' },
      {
        kind: 'code',
        code: `def min_max(nums):
    return min(nums), max(nums)          # implicitly a tuple

lo, hi = min_max(nums)

def divmod_like(a, b):
    return a // b, a % b

q, r = divmod(17, 5)                     # the built-in already does this`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Do not use a tuple where a list is meant to grow',
        body: 'Tuples cannot be appended to, so building a result incrementally needs a list. Convert at the end if a tuple is required. Using a tuple for an accumulator means rebuilding it every step — `t = t + (x,)` is O(n) per operation and O(n²) overall.',
      },
      { kind: 'heading', text: 'When to prefer a list instead' },
      {
        kind: 'table',
        headers: ['Use a tuple when', 'Use a list when'],
        rows: [
          ['It is a dict key or set element', 'You need to append or modify'],
          ['It is a fixed-size record — a coordinate, a pair', 'The length varies'],
          ['It is a multi-value return', 'It is a collection of similar items'],
          ['It is a composite sort key', 'You will sort or reverse it in place'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'namedtuple when the fields deserve names',
        body: '`from collections import namedtuple; Point = namedtuple("Point", "r c")` gives you `p.r` and `p.c` while staying a hashable tuple. It sorts and compares element-wise exactly like a plain tuple. Rarely necessary in DSA, but it makes longer solutions much more readable.',
      },
      {
        kind: 'code',
        code: `from collections import namedtuple

Point = namedtuple("Point", "r c")
p = Point(1, 2)
p.r                     # 1 — named access
p[0]                    # 1 — still indexable
visited.add(p)          # still hashable`,
      },
    ],
    keyTakeaways: [
      'A tuple of coordinates is the standard way to track visited cells.',
      'A tuple sort key handles multi-level ordering in one expression.',
      '`return a, b` is a tuple — the natural multi-value return.',
      'Never accumulate into a tuple; `t + (x,)` is O(n) each time.',
    ],
    practice: {
      prompt: 'Track visited grid cells with a set of `(r, c)` tuples in a DFS. Then use `memo[(r, c)]` for 2D memoisation instead of a nested dict. Then sort by two keys with a single tuple key.',
      leetcode: { title: 'Number of Islands', slug: 'number-of-islands' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-5.3',
    language: 'python',
    summary: 'Store unique values with O(1) membership — the most reusable trick in DSA.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A set holds **unique** values and answers "is this in here?" in O(1) — compared with O(n) for the same question on a list. Swapping one for the other is the single most reusable optimisation in beginner DSA: it is what turns "have I seen this before?" from a nested loop into a one-pass solution.',
      },
      {
        kind: 'code',
        code: `s = set()                  # EMPTY set — not {}
s = {1, 2, 3}              # from a literal
s = set([1, 2, 2, 3])      # {1, 2, 3} — duplicates dropped
s = set("hello")           # {'h', 'e', 'l', 'o'}
s = {x * x for x in nums}  # set comprehension`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: '{} is an empty dict, not an empty set',
        body: 'Dicts had the brace literal first. Writing `seen = {}` then `seen.add(x)` gives `AttributeError: dict object has no attribute add` — a confusing message pointing at the wrong thing. Use `set()`.',
      },
      {
        kind: 'table',
        headers: ['Operation', 'Cost'],
        rows: [
          ['`x in s`', '**O(1)** average'],
          ['`s.add(x)`', 'O(1) average'],
          ['`s.remove(x)` / `discard(x)`', 'O(1) average'],
          ['`len(s)`', 'O(1)'],
          ['Iteration', 'O(n), arbitrary order'],
          ['Indexing `s[0]`', '**Not supported**'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The whole point is O(1) membership',
        body: '`x in list` is O(n); `x in set` is O(1). Converting a list to a set costs O(n) once and pays for itself after two lookups. This single substitution fixes more Python timeouts than anything else.',
      },
      {
        kind: 'code',
        caption: 'The pattern it exists for',
        code: `def contains_duplicate(nums):
    seen = set()
    for x in nums:
        if x in seen:
            return True
        seen.add(x)
    return False

# Or the one-liner:
def contains_duplicate(nums):
    return len(set(nums)) != len(nums)`,
      },
      { kind: 'heading', text: 'Set algebra' },
      {
        kind: 'code',
        code: `a = {1, 2, 3}
b = {2, 3, 4}

a & b            # {2, 3}       intersection
a | b            # {1,2,3,4}    union
a - b            # {1}          difference
a ^ b            # {1, 4}       symmetric difference

a <= b           # is a a subset of b?
a >= b           # is a a superset?
a.isdisjoint(b)  # no common elements?`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Set operations collapse whole problems',
        body: '"Intersection of Two Arrays" is `list(set(a) & set(b))`. Finding elements in one list but not another is `set(a) - set(b)`. These read as maths and run in C — far better than nested loops.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Sets are unordered and elements must be hashable',
        body: 'Iteration order is arbitrary and can change between runs, so never write a solution whose output depends on it — sort at the end if order matters. And only immutable values can go in: `{(1,2)}` works, `{[1,2]}` raises `TypeError: unhashable type`.',
      },
      {
        kind: 'code',
        code: `s.remove(5)          # KeyError if 5 is absent
s.discard(5)         # silent if absent — usually what you want
s.pop()              # removes an ARBITRARY element
s.clear()

frozen = frozenset([1, 2, 3])       # an immutable set — can itself be a dict key`,
      },
    ],
    keyTakeaways: [
      'Use `set()` for an empty set; `{}` creates a dict.',
      '`x in s` is O(1) against O(n) for a list — the key substitution.',
      '`&`, `|`, `-`, `^` give intersection, union, difference in one expression.',
      'Elements must be hashable; iteration order is arbitrary.',
    ],
    practice: {
      prompt: 'Solve Contains Duplicate with a set and time it against the `x in list` version on 10⁵ elements. Then solve Intersection of Two Arrays with `&`. Then write `seen = {}` followed by `seen.add(x)` and read the confusing error.',
      leetcode: { title: 'Contains Duplicate', slug: 'contains-duplicate' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-5.4',
    language: 'python',
    summary: 'Add, remove and test membership efficiently, choosing the right method.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Sets have a small API, and the only real decision is between two pairs of near-identical methods: `remove` versus `discard`, and `add` versus `update`. The difference in each case is what happens in the awkward situation — a missing element, or a value that is already there — and picking the wrong one is how you get a `KeyError` on a perfectly reasonable input.',
      },
      {
        kind: 'code',
        caption: 'Adding',
        code: `s = set()
s.add(5)                 # one element — O(1)
s.add(5)                 # silently ignored, already present

s.update([1, 2, 3])      # add many — from any iterable
s.update("abc")          # adds 'a', 'b', 'c'
s |= {7, 8}              # union-assign — same as update`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'add takes one element; update takes an iterable',
        body: '`s.add([1, 2])` raises `TypeError: unhashable type: \'list\'`, because it tries to add the list itself. `s.update([1, 2])` adds the two elements. Mixing them up is the set equivalent of the `append` versus `extend` confusion with lists.',
      },
      {
        kind: 'code',
        caption: 'Removing',
        code: `s.remove(5)          # KeyError if absent
s.discard(5)         # silent if absent
s.pop()              # removes and returns an ARBITRARY element
                     # KeyError on an empty set
s.clear()`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'discard when absence is fine, remove when it would be a bug',
        body: 'Using `remove` where an element may legitimately be missing turns a normal case into a crash. Using `discard` where the element must be present hides a real bug. Pick deliberately — the choice documents your assumption.',
      },
      { kind: 'heading', text: 'Membership testing' },
      {
        kind: 'code',
        code: `if x in s: ...
if x not in s: ...

# Adding and testing in one step is NOT available on a set —
# unlike Java's set.add() which returns a boolean.
# So the two-step form is idiomatic:
if x in seen:
    return True
seen.add(x)

# Or use the length trick when you only need "was it new":
before = len(seen)
seen.add(x)
if len(seen) == before:
    ...          # it was already there`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'set.add() returns None, unlike Java',
        body: 'Java\'s `set.add(x)` returns false when the element was already present, so `if (!seen.add(x))` tests and inserts in one lookup. Python returns `None`, so you need the explicit `in` check first. Slightly more verbose, but the intent is clearer.',
      },
      { kind: 'heading', text: 'Modifying while iterating' },
      {
        kind: 'code',
        code: `for x in s:
    if x < 0:
        s.remove(x)      # RuntimeError: Set changed size during iteration

# Iterate over a copy
for x in set(s):
    if x < 0:
        s.remove(x)

# Or build a new set — usually clearest
s = {x for x in s if x >= 0}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Sets and dicts raise; lists fail silently',
        body: 'Changing a set\'s size during iteration raises immediately with a clear message. A list in the same situation silently skips elements. The loud failure is far more helpful — one of the few places Python is stricter than you might expect.',
      },
      {
        kind: 'code',
        caption: 'In-place set operations',
        code: `a |= b        # a = a | b   union-assign
a &= b        # intersection-assign
a -= b        # difference-assign
a ^= b        # symmetric-difference-assign

# The method forms, which accept any iterable rather than only a set:
a.update(b)              # |=
a.intersection_update(b) # &=
a.difference_update(b)   # -=`,
      },
      {
        kind: 'text',
        body: 'The operator forms require both sides to be sets; the method forms accept any iterable. So `a.update([1,2,3])` works while `a |= [1,2,3]` raises — a small asymmetry worth knowing.',
      },
    ],
    keyTakeaways: [
      '`add` takes one element, `update` takes an iterable.',
      '`remove` raises on a missing element; `discard` is silent.',
      '`set.add()` returns `None` — Python has no test-and-insert in one call.',
      'Changing a set while iterating raises; iterate a copy or rebuild it.',
    ],
    practice: {
      prompt: 'Call `s.add([1,2])` and read the unhashable error, then fix it with `update`. Then remove elements from a set inside a `for` loop over it and read the `RuntimeError`, then fix it with a comprehension.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-5.5',
    language: 'python',
    summary: 'Map keys to values in O(1) — the container behind more solutions than any other.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'A dict stores **key → value** pairs and finds any key in O(1). It is behind more accepted solutions than any other container: frequency counts, "have I seen this and where?", graph adjacency, memoisation. If you learn one container properly in this chapter, make it this one.',
      },
      {
        kind: 'code',
        code: `d = {}                              # empty dict
d = {"a": 1, "b": 2}                # from a literal
d = dict(a=1, b=2)                  # keyword form
d = dict([("a", 1), ("b", 2)])      # from pairs
d = {x: x * x for x in range(5)}    # dict comprehension`,
      },
      {
        kind: 'table',
        headers: ['Operation', 'Cost'],
        rows: [
          ['`d[key]`', '**O(1)** average'],
          ['`d[key] = value`', 'O(1) average'],
          ['`key in d`', '**O(1)** average'],
          ['`del d[key]`', 'O(1) average'],
          ['`len(d)`', 'O(1)'],
          ['Iteration', 'O(n), in insertion order'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Dicts preserve insertion order since Python 3.7',
        body: 'Guaranteed by the language, not an implementation detail. That is stronger than C++\'s `unordered_map` and Java\'s `HashMap`, both of which have unspecified order. It means "first unique character" style problems can iterate the dict directly rather than re-scanning the input.',
      },
      { kind: 'heading', text: 'Keys must be hashable' },
      {
        kind: 'code',
        code: `d[42] = "int key"           # fine
d["s"] = "string key"       # fine
d[(1, 2)] = "tuple key"     # fine — tuples are immutable
d[True] = "bool key"        # fine

d[[1, 2]] = "list"          # TypeError: unhashable type: 'list'
d[{1, 2}] = "set"           # TypeError — sets are mutable too`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'True and 1 are the same key',
        body: '`{1: "a", True: "b"}` has one entry, because `hash(True) == hash(1)` and `True == 1`. Same for `0` and `False`, and for `1` and `1.0`. Rarely matters, but it produces a genuinely baffling bug when it does.',
      },
      { kind: 'heading', text: 'The three roles a dict plays' },
      {
        kind: 'code',
        code: `# 1. Counting
freq = {}
for c in s:
    freq[c] = freq.get(c, 0) + 1

# 2. Remembering positions
last_seen = {}
for i, x in enumerate(nums):
    last_seen[x] = i

# 3. Grouping
groups = {}
for w in words:
    key = "".join(sorted(w))
    groups.setdefault(key, []).append(w)`,
      },
      {
        kind: 'text',
        body: 'Counting, position-tracking and grouping cover the large majority of dict usage in DSA. Recognising which one a problem needs usually structures the whole solution.',
      },
      {
        kind: 'code',
        caption: 'Two Sum — the archetype',
        code: `def two_sum(nums, target):
    seen = {}                        # value → index
    for i, x in enumerate(nums):
        if target - x in seen:       # O(1) lookup
            return [seen[target - x], i]
        seen[x] = i                  # insert AFTER checking
    return []`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Check before inserting',
        body: 'If you insert `x` first, an element can pair with itself whenever `target == 2 * x`. Checking first is the entire correctness argument for the one-pass version — and it is subtle enough to pass the sample tests either way.',
      },
      {
        kind: 'code',
        caption: 'Merging and copying',
        code: `d1 = {"a": 1}
d2 = {"b": 2}

merged = {**d1, **d2}        # unpacking
merged = d1 | d2             # Python 3.9+
d1.update(d2)                # in place

copy = d.copy()              # shallow copy
copy = dict(d)               # same`,
      },
    ],
    keyTakeaways: [
      'Dicts give O(1) key-value storage and preserve insertion order.',
      'Keys must be hashable — tuples work, lists and sets do not.',
      'Its three roles are counting, remembering positions, and grouping.',
      'In Two Sum, check for the complement before inserting.',
    ],
    practice: {
      prompt: 'Write Two Sum with a dict, then swap the insert above the check and find an input where it pairs an element with itself. Then try a list as a key and read the error. Then check `{1: "a", True: "b"}` and count the entries.',
      leetcode: { title: 'Two Sum', slug: 'two-sum' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-5.6',
    language: 'python',
    summary: 'Read and write dict entries safely, avoiding KeyError.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Writing to a dict never fails — `d[k] = v` creates the key if it is missing. **Reading** is where beginners get hurt: `d[k]` on an absent key raises `KeyError` and stops your program. Python gives you three safe alternatives, and choosing between them is most of what this lesson is about.',
      },
      {
        kind: 'code',
        code: `d = {"a": 1}

d["a"]          # 1
d["z"]          # KeyError: 'z'

d["z"] = 26     # assignment CREATES the key
del d["a"]      # remove — KeyError if absent`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Reading a missing key raises; writing creates it',
        body: 'This asymmetry differs from both C++ and Java. C++\'s `map[key]` silently creates a zero on read; Java\'s `map.get(key)` returns null. Python raises a clear `KeyError` — safer, but you must handle absence explicitly.',
      },
      { kind: 'heading', text: 'The safe access methods' },
      {
        kind: 'code',
        code: `d.get("z")              # None — never raises
d.get("z", 0)           # 0 — with a default
d.setdefault("z", 0)    # returns d["z"], INSERTING 0 first if absent

if "z" in d: ...        # membership test, no insertion
d.pop("z", None)        # remove and return, with a default`,
      },
      {
        kind: 'table',
        headers: ['Expression', 'Missing key behaviour', 'Inserts?'],
        rows: [
          ['`d[k]`', 'Raises `KeyError`', 'No'],
          ['`d.get(k)`', 'Returns `None`', 'No'],
          ['`d.get(k, 0)`', 'Returns `0`', 'No'],
          ['`d.setdefault(k, 0)`', 'Returns `0`', '**Yes**'],
          ['`k in d`', 'Returns `False`', 'No'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'get for reading, setdefault for building',
        body: '`freq[c] = freq.get(c, 0) + 1` counts without inserting a phantom key on the read. `groups.setdefault(key, []).append(w)` deliberately creates the empty list so you can append to it. Choosing between them is choosing whether the insertion is intended.',
      },
      { kind: 'heading', text: 'Iterating' },
      {
        kind: 'code',
        code: `for key in d:            # keys — the default
    ...
for key in d.keys():     # explicit, identical
for value in d.values():
for key, value in d.items():        # both — the most common form

# Sorted iteration
for key in sorted(d):                       # by key
for key, value in sorted(d.items(),
                         key=lambda kv: kv[1]):     # by value`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Changing the size while iterating raises',
        body: '`RuntimeError: dictionary changed size during iteration`. Modifying *values* is fine; adding or deleting keys is not. To delete while looping, iterate over `list(d.keys())` — which snapshots the keys first.',
      },
      {
        kind: 'code',
        code: `for k in list(d.keys()):        # snapshot — safe to delete
    if d[k] == 0:
        del d[k]

# Or rebuild:
d = {k: v for k, v in d.items() if v != 0}`,
      },
      {
        kind: 'code',
        caption: 'The views are live',
        code: `keys = d.keys()
d["new"] = 1
len(keys)                # includes "new" — keys() is a VIEW, not a copy

keys = list(d.keys())    # a real snapshot`,
      },
      {
        kind: 'text',
        body: '`keys()`, `values()` and `items()` return live views over the dict rather than copies. They are cheap to create, but they change as the dict changes — which is exactly why iterating one while modifying the dict raises.',
      },
    ],
    keyTakeaways: [
      '`d[k]` raises on a missing key; `d.get(k, default)` does not.',
      '`setdefault` inserts as a side effect — use it deliberately.',
      'Modifying values while iterating is fine; adding or deleting keys raises.',
      '`keys()`/`values()`/`items()` are live views, not snapshots.',
    ],
    practice: {
      prompt: 'Read a missing key with `[]` and with `get`, and note which raises. Then delete zero-valued entries while iterating and read the `RuntimeError`, then fix it with `list(d.keys())`. Then take `d.keys()`, add an entry, and see the view grow.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-5.7',
    language: 'python',
    summary: 'Use the four core dict methods fluently.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Four methods cover almost everything you will do with a dict: `get` reads safely, and `keys`, `values` and `items` give you the three ways to loop over one. `items()` in particular — unpacking straight into two variables — is the form you will write most, so it is worth making automatic.',
      },
      { kind: 'heading', text: 'get — read with a fallback' },
      {
        kind: 'code',
        code: `d.get(key)              # None if absent
d.get(key, 0)           # 0 if absent
d.get(key, [])          # any default you like

# The counting idiom
freq[c] = freq.get(c, 0) + 1

# Safe nested access
value = outer.get(k1, {}).get(k2, 0)`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'get never inserts',
        body: 'Unlike `setdefault` and unlike C++\'s `operator[]`, `get` is a pure read. So `if d.get(x, 0) > 0:` cannot corrupt your dict or change `len(d)` — which makes it the right choice for any conditional check.',
      },
      { kind: 'heading', text: 'keys, values, items' },
      {
        kind: 'code',
        code: `d = {"a": 1, "b": 2}

d.keys()          # dict_keys(['a', 'b'])
d.values()        # dict_values([1, 2])
d.items()         # dict_items([('a', 1), ('b', 2)])

list(d.keys())    # a real list snapshot
set(d.keys())     # a set — useful for set algebra on keys`,
      },
      {
        kind: 'code',
        caption: 'What you actually do with them',
        code: `# Iterate pairs — the most common
for key, value in d.items():
    ...

# Find the key with the maximum value
best = max(d, key=d.get)                    # d.get as the key function
best = max(d.items(), key=lambda kv: kv[1])[0]

# Sum or find extremes over values
total = sum(d.values())
biggest = max(d.values())

# Set algebra on keys
common = d1.keys() & d2.keys()              # views support set operations!
only_in_d1 = d1.keys() - d2.keys()`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'max(d, key=d.get) finds the most frequent element',
        body: 'Iterating a dict yields keys, and `key=d.get` scores each by its value — so this returns the key with the largest count in O(n) with no sorting. It is the shortest correct answer to "find the most frequent element" and worth memorising.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Key views support set operations; value views do not',
        body: '`d1.keys() & d2.keys()` works because keys are unique and hashable. `d1.values() & d2.values()` raises, because values may repeat and need not be hashable. If you need set algebra on values, convert explicitly with `set(d.values())`.',
      },
      { kind: 'heading', text: 'The other methods worth knowing' },
      {
        kind: 'code',
        code: `d.pop(key)              # remove and return — KeyError if absent
d.pop(key, None)        # with a default
d.popitem()             # remove and return the LAST inserted pair
d.update(other)         # merge another dict in
d.clear()
d.copy()                # shallow

# Counting-friendly, less common but useful:
d.setdefault(key, []).append(x)`,
      },
      {
        kind: 'code',
        caption: 'Inverting a dict',
        code: `inverted = {v: k for k, v in d.items()}        # values become keys

# If values repeat, group instead:
from collections import defaultdict
inverted = defaultdict(list)
for k, v in d.items():
    inverted[v].append(k)`,
      },
      {
        kind: 'text',
        body: 'Inverting comes up in problems asking "which key had this value" — but only works directly when values are unique and hashable. The grouped form handles duplicates.',
      },
    ],
    keyTakeaways: [
      '`get(key, default)` reads without inserting or raising.',
      '`items()` is the standard iteration form; `keys()` supports set algebra.',
      '`max(d, key=d.get)` returns the key with the largest value in O(n).',
      'Views are live — wrap in `list()` when you need a snapshot.',
    ],
    practice: {
      prompt: 'Build a frequency dict and find the most frequent element with `max(d, key=d.get)`. Then compute the common keys of two dicts with `d1.keys() & d2.keys()`, and try the same on `.values()` to see it fail.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-5.8',
    language: 'python',
    summary: 'Count occurrences four ways, and know which to reach for.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: '"How many times does each thing appear?" is one of the most common sub-problems in all of DSA — anagrams, majority elements, first unique character. Python gives you four ways to answer it, from the fully manual to the one-liner, and seeing them side by side makes it obvious why the last one wins.',
      },
      {
        kind: 'code',
        caption: 'The four forms, shortest last',
        code: `# 1. Plain dict with get
freq = {}
for c in s:
    freq[c] = freq.get(c, 0) + 1

# 2. Plain dict with setdefault
freq = {}
for c in s:
    freq.setdefault(c, 0)
    freq[c] += 1

# 3. defaultdict
from collections import defaultdict
freq = defaultdict(int)
for c in s:
    freq[c] += 1

# 4. Counter
from collections import Counter
freq = Counter(s)`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Counter for counting, defaultdict for grouping',
        body: '`Counter` is purpose-built and gives you `most_common` for free. `defaultdict(list)` is the right tool when the values are collections you append to. A plain dict with `get` is fine and needs no import — useful when you want to keep the solution dependency-free.',
      },
      {
        kind: 'code',
        caption: 'A fixed-size list, when the alphabet is known',
        code: `freq = [0] * 26
for c in s:
    freq[ord(c) - ord('a')] += 1`,
      },
      {
        kind: 'text',
        body: 'Faster than a dict for lowercase-only problems, because there is no hashing. But `ord(c) - ord(\'a\')` is more verbose than C++\'s `c - \'a\'`, and `Counter` is usually clearer. Reach for the list only when profiling says the hashing matters.',
      },
      { kind: 'heading', text: 'The patterns' },
      {
        kind: 'code',
        caption: 'Anagram check',
        code: `def is_anagram(s, t):
    return Counter(s) == Counter(t)          # one line

# Or without imports:
def is_anagram(s, t):
    if len(s) != len(t):
        return False
    freq = {}
    for c in s:
        freq[c] = freq.get(c, 0) + 1
    for c in t:
        if freq.get(c, 0) == 0:
            return False
        freq[c] -= 1
    return True`,
      },
      {
        kind: 'code',
        caption: 'First unique character — two passes',
        code: `def first_uniq_char(s):
    freq = Counter(s)
    for i, c in enumerate(s):
        if freq[c] == 1:
            return i
    return -1`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Two passes is usually the right shape',
        body: 'You cannot know a character is unique until you have seen the whole string. Trying to do it in one pass is a common instinct and generally wrong. Two O(n) passes is still O(n).',
      },
      { kind: 'heading', text: 'Frequency as a key' },
      {
        kind: 'code',
        code: `# Group anagrams by a count signature rather than by sorting
from collections import defaultdict

groups = defaultdict(list)
for w in words:
    key = tuple(sorted(Counter(w).items()))     # hashable canonical form
    groups[key].append(w)

# Or the simpler sorted-string key:
    key = "".join(sorted(w))`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'A Counter is not hashable',
        body: 'It is a dict subclass, so it cannot be a dict key directly. Convert to a `tuple(sorted(counter.items()))` or use a sorted string. Sorting the word is O(k log k) versus O(k) for counting, but for short words the sorted string is simpler and usually fast enough.',
      },
      {
        kind: 'code',
        caption: 'Sliding window with a frequency dict',
        code: `from collections import defaultdict

window = defaultdict(int)
left = best = 0

for right, c in enumerate(s):
    window[c] += 1

    while len(window) > k:
        window[s[left]] -= 1
        if window[s[left]] == 0:
            del window[s[left]]        # DELETE — do not leave zeros
        left += 1

    best = max(best, right - left + 1)`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Delete keys that reach zero',
        body: 'If you only decrement, zero-count keys linger and `len(window)` keeps counting characters no longer in the window — so the loop never exits correctly. Any sliding window testing `len(dict)` must delete zero-count keys.',
      },
    ],
    keyTakeaways: [
      '`Counter(iterable)` counts in one line; `defaultdict(list)` groups.',
      '`Counter(s) == Counter(t)` is the anagram check.',
      'Count in one pass, scan in a second — one pass usually cannot work.',
      'In sliding windows, delete keys whose count drops to zero.',
    ],
    practice: {
      prompt: 'Write frequency counting all four ways and compare the readability. Then solve Valid Anagram with `Counter` equality. Then write a sliding window over distinct characters, omit the `del`, and find the failing input.',
      leetcode: { title: 'Valid Anagram', slug: 'valid-anagram' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-5.9',
    language: 'python',
    summary: 'Build dicts of dicts, and know when a tuple key is simpler.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Sometimes one key is not enough — you want to look something up by row *and* column, or by student *and* subject. Nesting dicts works, but there is usually a flatter option: because tuples are hashable, `d[(r, c)]` is a single lookup and far less code. Knowing when to flatten is the point of this lesson.',
      },
      {
        kind: 'code',
        code: `graph = {
    "a": {"b": 3, "c": 5},
    "b": {"c": 1},
}

graph["a"]["b"]              # 3
graph["a"].get("z", 0)       # 0 — safe inner access
graph.get("z", {}).get("b", 0)   # 0 — safe at both levels`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Building nested dicts by assignment fails',
        body: '`graph["a"]["b"] = 3` raises `KeyError: \'a\'` when the outer key does not exist yet — Python will not create the intermediate dict for you. You need `setdefault`, a `defaultdict`, or an explicit check.',
      },
      {
        kind: 'code',
        caption: 'The three ways to build one',
        code: `# 1. setdefault
graph.setdefault("a", {})["b"] = 3

# 2. defaultdict — cleanest for a fixed depth
from collections import defaultdict
graph = defaultdict(dict)
graph["a"]["b"] = 3

# 3. Explicit check
if "a" not in graph:
    graph["a"] = {}
graph["a"]["b"] = 3`,
      },
      {
        kind: 'code',
        caption: 'A weighted adjacency list',
        code: `from collections import defaultdict

adj = defaultdict(dict)
for u, v, w in edges:
    adj[u][v] = w
    adj[v][u] = w                # undirected

for neighbour, weight in adj[node].items():
    ...

# Unweighted is simpler — a dict of lists:
adj = defaultdict(list)
for u, v in edges:
    adj[u].append(v)
    adj[v].append(u)`,
      },
      { kind: 'heading', text: 'The tuple-key alternative' },
      {
        kind: 'code',
        code: `# Nested
memo = defaultdict(dict)
memo[i][j] = value
if i in memo and j in memo[i]: ...

# Flat, with a tuple key — usually simpler
memo = {}
memo[(i, j)] = value
if (i, j) in memo: ...`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Prefer a tuple key for memoisation',
        body: 'One flat dict with `(i, j)` or `(i, j, k)` keys is shorter to write, easier to check for membership, and extends to any number of dimensions without more nesting. Reserve nested dicts for cases where you genuinely need to iterate one level — an adjacency list, where `adj[u]` is meaningful on its own.',
      },
      {
        kind: 'code',
        caption: 'Memoisation with a tuple key',
        code: `def solve(i, j, memo={}):        # careful — see the mutable-default trap!
    ...

# Better:
def solve(grid):
    memo = {}
    def helper(i, j):
        if (i, j) in memo:
            return memo[(i, j)]
        ...
        memo[(i, j)] = result
        return result
    return helper(0, 0)

# Or just use the decorator:
from functools import cache

def solve(grid):
    @cache
    def helper(i, j):
        ...
    return helper(0, 0)`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'defaultdict nesting deeper than two levels gets awkward',
        body: 'A three-level `defaultdict(lambda: defaultdict(dict))` works but is hard to read and easy to get wrong. At that point a tuple key is almost always the better answer — or restructure the data so you do not need three dimensions.',
      },
      {
        kind: 'text',
        body: 'One practical note: `defaultdict` creates entries on *read*, so `if graph["z"]:` inserts an empty dict for `"z"`. Use `if "z" in graph:` to test without inserting — the same trap as everywhere else with `defaultdict`.',
      },
    ],
    keyTakeaways: [
      '`d[k1][k2] = v` raises unless the outer key already exists.',
      '`defaultdict(dict)` or `setdefault` builds the intermediate level.',
      'For memoisation, a flat dict with a tuple key beats nesting.',
      'Reading a missing key on a `defaultdict` inserts it — use `in` to test.',
    ],
    practice: {
      prompt: 'Try `graph["a"]["b"] = 3` on an empty dict and read the `KeyError`, then fix it three ways. Then write 2D memoisation with a nested dict and with a `(i, j)` tuple key, and compare which reads better.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-5.10',
    language: 'python',
    summary: 'Use defaultdict to remove existence checks — especially for grouping.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Half the dict code beginners write is the same three lines: check whether a key exists, create it with an empty value if not, then use it. A `defaultdict` does that for you — you tell it what a missing value should look like, and the check disappears. For grouping problems it collapses four lines into one.',
      },
      {
        kind: 'code',
        code: `from collections import defaultdict

d = defaultdict(int)      # missing keys → 0
d = defaultdict(list)     # missing keys → []
d = defaultdict(set)      # missing keys → set()
d = defaultdict(dict)     # missing keys → {}

d = defaultdict(lambda: -1)      # any factory you like`,
      },
      {
        kind: 'text',
        body: 'The argument is a **factory** — a callable producing the default. `defaultdict(int)` works because `int()` returns 0; `defaultdict(list)` because `list()` returns `[]`. Note it is `list`, not `list()` — you pass the function, not a call to it.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Pass the factory, not a value',
        body: '`defaultdict([])` raises `TypeError: first argument must be callable or None`. And `defaultdict(list())` fails the same way — you called the function instead of passing it. The distinction is the same one as `sorted(key=len)` versus `key=len()`.',
      },
      { kind: 'heading', text: 'Where it genuinely shines: grouping' },
      {
        kind: 'code',
        code: `# Without defaultdict
groups = {}
for w in words:
    key = "".join(sorted(w))
    if key not in groups:
        groups[key] = []
    groups[key].append(w)

# With defaultdict
groups = defaultdict(list)
for w in words:
    groups["".join(sorted(w))].append(w)`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'This is the Python equivalent of computeIfAbsent',
        body: 'Java needs `map.computeIfAbsent(key, k -> new ArrayList<>()).add(w)` and C++ relies on `map[key].push_back(w)` default-constructing. `defaultdict(list)` gives the same thing with the cleanest syntax of the three.',
      },
      {
        kind: 'code',
        caption: 'Adjacency lists',
        code: `adj = defaultdict(list)
for u, v in edges:
    adj[u].append(v)
    adj[v].append(u)              # undirected

for neighbour in adj[node]:       # a missing node gives [] — no KeyError
    ...`,
      },
      {
        kind: 'text',
        body: 'That last detail matters: iterating `adj[node]` for a node with no edges returns an empty list rather than raising. It removes an entire class of guard from graph traversal code — though note it also *inserts* the empty list as a side effect.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Reading a missing key inserts it',
        body: '`if d[x] > 0:` on a `defaultdict` creates `x` with the default value, growing the dict and corrupting any `len()` or iteration that follows. Use `if x in d:` to test without inserting. This is the same footgun C++\'s `operator[]` has, and it is the main reason to prefer `Counter` when you only need counts.',
      },
      {
        kind: 'code',
        code: `d = defaultdict(int)
len(d)              # 0
if d["missing"] > 0:    # inserts "missing" → 0
    ...
len(d)              # 1  ← phantom key

# Safe:
if "missing" in d and d["missing"] > 0:
    ...`,
      },
      {
        kind: 'code',
        caption: 'Other useful factories',
        code: `defaultdict(set)              # for adjacency with deduplication
adj[u].add(v)

defaultdict(lambda: [0] * 26) # a frequency array per key

defaultdict(lambda: float("inf"))    # distances, for Dijkstra
dist[node] = min(dist[node], candidate)`,
      },
      {
        kind: 'text',
        body: 'A `defaultdict` is still a `dict` — it supports everything a dict does, and `dict(dd)` converts it back if a problem requires a plain dict as the return type.',
      },
    ],
    keyTakeaways: [
      '`defaultdict(factory)` supplies missing values — pass `list`, not `list()`.',
      'It makes grouping a single line: `groups[key].append(x)`.',
      'Reading a missing key inserts it — test membership with `in`.',
      'It is a `dict` subclass; `dict(dd)` converts back when needed.',
    ],
    practice: {
      prompt: 'Solve Group Anagrams with `defaultdict(list)` and compare it with the explicit-check version. Then read a missing key, print `len(d)`, and watch the phantom entry appear.',
      leetcode: { title: 'Group Anagrams', slug: 'group-anagrams' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-5.11',
    language: 'python',
    summary: 'Use Counter — the single biggest Python advantage in DSA.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'If there is one place Python simply beats C++ and Java for DSA, it is `Counter`. It counts an entire sequence in one call, compares two counts with `==`, and hands you the k most common items sorted. Problems that take twenty lines in Java take three here — so this is a lesson worth reading closely.',
      },
      {
        kind: 'code',
        code: `from collections import Counter

c = Counter("hello")            # Counter({'l': 2, 'h': 1, 'e': 1, 'o': 1})
c = Counter([1, 2, 2, 3])       # works on any iterable
c = Counter({"a": 3})           # from a dict
c = Counter(a=3, b=1)           # from keywords

c["l"]          # 2
c["z"]          # 0 — no KeyError, and NOT inserted
len(c)          # number of distinct keys
sum(c.values()) # total count`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Counter reads missing keys as 0 without inserting',
        body: 'That is the key difference from `defaultdict(int)`, which *does* insert. So `if c[x] == 1:` is completely safe on a `Counter` and quietly corrupts a `defaultdict`. For pure counting, `Counter` is strictly the better choice.',
      },
      { kind: 'heading', text: 'most_common' },
      {
        kind: 'code',
        code: `c = Counter("mississippi")

c.most_common()        # all, sorted by count descending
c.most_common(2)       # [('i', 4), ('s', 4)] — the top two
c.most_common()[-1]    # the least frequent

# Top K Frequent Elements, in one line:
def topKFrequent(nums, k):
    return [x for x, _ in Counter(nums).most_common(k)]`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'most_common solves Top K without a heap',
        body: 'C++ and Java need a `priority_queue` of size k and about fifteen lines. Python needs one. `most_common(k)` is O(n log k) internally — it uses a heap under the hood — so you get the right complexity as well as the short code.',
      },
      { kind: 'heading', text: 'Counter arithmetic' },
      {
        kind: 'code',
        code: `a = Counter("aabbc")
b = Counter("abbbd")

a == b          # equality — the anagram check
a + b           # combined counts
a - b           # Counter({'a': 1, 'c': 1}) — keeps POSITIVE counts only
a & b           # intersection: min of each count
a | b           # union: max of each count`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Subtraction drops zero and negative counts',
        body: '`Counter("a") - Counter("aa")` gives an empty Counter, not `{"a": -1}`. If you need signed differences, use `a.subtract(b)`, which modifies in place and keeps negatives. The `-` operator is designed for "what is left over", not for arithmetic.',
      },
      {
        kind: 'code',
        caption: 'The problems it collapses',
        code: `# Valid Anagram
def isAnagram(s, t):
    return Counter(s) == Counter(t)

# Ransom Note — can s be built from t?
def canConstruct(note, magazine):
    return not (Counter(note) - Counter(magazine))

# First unique character
def firstUniqChar(s):
    freq = Counter(s)
    for i, c in enumerate(s):
        if freq[c] == 1:
            return i
    return -1

# Find all anagrams in a string — sliding window with Counter comparison
def findAnagrams(s, p):
    need, window = Counter(p), Counter()
    result = []
    for i, c in enumerate(s):
        window[c] += 1
        if i >= len(p):
            left = s[i - len(p)]
            window[left] -= 1
            if window[left] == 0:
                del window[left]         # keep the dicts comparable
        if window == need:
            result.append(i - len(p) + 1)
    return result`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Delete zero counts before comparing Counters',
        body: '`Counter({"a": 1, "b": 0}) == Counter({"a": 1})` is actually `True` — Counter equality ignores zero counts. But `len()` and iteration do not, so a lingering zero key breaks any check based on `len(window)`. Deleting is safest and keeps both approaches working.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'A Counter is not hashable',
        body: 'It is a dict subclass, so it cannot be a set element or dict key. To use a count signature as a grouping key, convert: `tuple(sorted(c.items()))`. Or just use the sorted string, which is simpler for short words.',
      },
    ],
    keyTakeaways: [
      '`Counter(iterable)` counts in one line and reads missing keys as 0.',
      '`most_common(k)` solves Top K Frequent without writing a heap.',
      '`Counter(s) == Counter(t)` is the anagram check; `a - b` keeps positives only.',
      'A `Counter` is not hashable — convert to a tuple to use it as a key.',
    ],
    practice: {
      prompt: 'Solve Valid Anagram, Ransom Note and Top K Frequent Elements with `Counter` — each is one or two lines. Then check that `Counter({"a":1,"b":0}) == Counter({"a":1})` is True but their `len()` differs.',
      leetcode: { title: 'Top K Frequent Elements', slug: 'top-k-frequent-elements' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-5.12',
    language: 'python',
    summary: 'Round out the collections toolkit — setdefault, deque, OrderedDict and the rest.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'This lesson sweeps up the remaining pieces of the `collections` toolkit — the ones you will meet in other people\'s solutions and occasionally want yourself. None of them is essential on its own, but knowing they exist means you will recognise them when you read them, and reach for the right one when a problem calls for it.',
      },
      { kind: 'heading', text: 'setdefault — a one-off defaultdict' },
      {
        kind: 'code',
        code: `d.setdefault(key, [])          # returns d[key], inserting [] first if absent

groups.setdefault(key, []).append(w)      # grouping without an import
memo.setdefault(k, {})[j] = v             # building a nested level`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'setdefault when you need the behaviour once',
        body: 'A `defaultdict` applies to every access, which is what you want when the dict is used for grouping throughout. `setdefault` applies to one call, which is better when most accesses are ordinary reads and only one spot needs the default. It also needs no import.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'The default is evaluated every call',
        body: '`d.setdefault(k, expensive())` calls `expensive()` even when `k` already exists — the argument is evaluated before the method runs. `defaultdict` only calls its factory on an actual miss. For cheap defaults like `[]` it does not matter; for anything costly it does.',
      },
      { kind: 'heading', text: 'deque — the queue you must use' },
      {
        kind: 'code',
        code: `from collections import deque

q = deque()
q.append(x)          # right — O(1)
q.appendleft(x)      # left  — O(1)
q.pop()              # right — O(1)
q.popleft()          # left  — O(1)
q[0]                 # peek — O(1)
len(q)

dq = deque(maxlen=3)    # a bounded deque — drops from the other end when full`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Never use a list for a queue',
        body: '`list.pop(0)` is O(n), so a BFS written with a list is O(n²) and times out on large grids. `deque.popleft()` is O(1). Importing `deque` is one line and it is the single most important container substitution in Python DSA.',
      },
      {
        kind: 'code',
        caption: 'BFS with a deque',
        code: `from collections import deque

def bfs(grid, start):
    q = deque([start])
    visited = {start}

    while q:
        for _ in range(len(q)):          # snapshot the level size
            r, c = q.popleft()
            for dr, dc in ((-1,0),(1,0),(0,-1),(0,1)):
                nr, nc = r + dr, c + dc
                if (nr, nc) not in visited and in_bounds(nr, nc):
                    visited.add((nr, nc))       # mark on PUSH
                    q.append((nr, nc))`,
      },
      { kind: 'heading', text: 'The rest of the module' },
      {
        kind: 'code',
        code: `from collections import OrderedDict, namedtuple, ChainMap

# OrderedDict — dicts preserve order since 3.7, so this is mostly legacy.
# Its one remaining use: move_to_end, for an LRU cache.
od = OrderedDict()
od.move_to_end(key)              # O(1) — mark as most recently used
od.popitem(last=False)           # remove the OLDEST — O(1)

# namedtuple — a hashable record with named fields
Point = namedtuple("Point", "r c")
p = Point(1, 2)
p.r, p[0]                        # both work`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'OrderedDict makes LRU Cache trivial',
        body: '`move_to_end(key)` and `popitem(last=False)` are both O(1), which is exactly what LRU Cache needs. The Python solution is about eight lines against forty for the Java hash-map-plus-linked-list version. It is one of the clearest cases where the standard library does the hard part for you.',
      },
      {
        kind: 'code',
        caption: 'LRU Cache in Python',
        code: `from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity):
        self.cache = OrderedDict()
        self.capacity = capacity

    def get(self, key):
        if key not in self.cache:
            return -1
        self.cache.move_to_end(key)
        return self.cache[key]

    def put(self, key, value):
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.capacity:
            self.cache.popitem(last=False)     # evict the least recent`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Interviewers may want the manual version',
        body: 'Using `OrderedDict` is correct and idiomatic, but an interviewer asking LRU Cache usually wants to see you build the hash map plus doubly linked list yourself — that is the actual question. Mention the library solution, then offer to implement it manually.',
      },
    ],
    keyTakeaways: [
      '`setdefault` is a one-off default; its argument is always evaluated.',
      '`deque` gives O(1) at both ends — always use it for a queue.',
      '`OrderedDict.move_to_end` and `popitem(last=False)` make LRU Cache trivial.',
      '`namedtuple` gives a hashable record with named fields.',
    ],
    practice: {
      prompt: 'Write BFS with a `deque` and time it against a list-based version on a large grid. Then implement LRU Cache with `OrderedDict`, and then again manually with a dict plus linked list — interviewers ask for the second.',
      leetcode: { title: 'LRU Cache', slug: 'lru-cache' },
    },
  },
];
