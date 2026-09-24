# Phase 0 Curriculum — Redesign Spec

Status: **implemented** (2026-09-21, branch `phase0-expansion`). Governs the
expansion of the Phase 0 language-foundation track for C++, Java and Python.
Chapter definitions live in `data/phase0Expansion.ts`; lesson content in
`data/content/shared/` (shared chapters) and `data/content/<lang>/chNN.ts`
(language-specific). Authoring rules: `docs/phase0-authoring-guide.md`.

## Goals

1. **True beginners can start.** The current syllabus assumes the reader can
   already read a program. A new *Tier A* sits underneath it.
2. **Higher data structures and algorithms are covered.** A new *Tier C* teaches
   linked lists, trees, heaps, hash tables, tries, union-find, graphs, range-query
   structures, DP, backtracking and number theory *from scratch*, so Phase 1's
   problem weeks are not the first time a student meets them.
3. **Nothing existing moves.** All 478 current topic ids and lessons are kept
   verbatim. New chapters are inserted around them. Student progress rows stay
   valid.
4. **Tokens are spent once.** Concept chapters are authored once as *shared*
   lessons with per-language code and expanded into all three languages at
   import time. Only language-specific chapters are written three times.

## Tiers

| Tier | Purpose | Chapters | Topics / lang |
|---|---|---|---|
| A — Absolute beginner | From "what is a program" to writing a 20-line solution | 4 new | 37 |
| B — Foundation | Existing chapters (kept) + enrichment on complexity, arrays, strings, bits, sorting, searching, hashing, debugging, language toolbox, pitfalls | 19/17/15 existing + 10 new | 166/163/149 existing + 103 new |
| C — Advanced DS & algorithms | Implement every structure Phase 1 relies on | 13 new | 98 |
| **Total (as built)** | | **46 / 44 / 42** | **C++ 404 · Java 401 · Python 387** |

That is ~2.4× the original size, about 28 hours of reading per track. The 2×
target was set before the advanced tier was requested; the "Trim list" at the
end shows what could be removed to land at ~2×.

Legend: **S** = shared lesson (one source, three code variants). **L** =
language-specific lesson (written per language). `[kept]` = existing chapter,
untouched.

---

## Display order and chapter ids

Existing chapter numbers are ids, not positions. New chapters get the next free
number per language (C++ from 20, Java from 18, Python from 16) in the order
they appear below, and the UI shows each chapter's **ordinal position** in the
sequence (1, 2, 3…) rather than its id. Topic labels follow the same rule
(`7.3` = third topic of the seventh chapter on screen). Ids like `cpp-23.4`
appear only in URLs and the database.

### C++ sequence

| # | Id | Chapter | Tier |
|---|---|---|---|
| 1 | cpp-20 | How Computers Run Programs | A · S |
| 2 | cpp-21 | Setting Up Your C++ Workspace | A · L |
| 3 | cpp-22 | First Programs, Step by Step | A · S |
| 4 | cpp-1 | Language Setup and Core Syntax | [kept] |
| 5 | cpp-2 | Variables, Data Types, and Operators | [kept] |
| 6 | cpp-3 | Control Flow | [kept] |
| 7 | cpp-23 | Math You Need for Programming | A · S |
| 8 | cpp-4 | Functions | [kept] |
| 9 | cpp-24 | Time and Space Complexity | B · S |
| 10 | cpp-5 | Arrays and Strings | [kept] |
| 11 | cpp-25 | Arrays and Matrices in Depth | B · S |
| 12 | cpp-26 | Strings in Depth | B · S |
| 13 | cpp-6 | Pointers and References | [kept] |
| 14 | cpp-7 | Memory Management | [kept] |
| 15 | cpp-8 | Object-Oriented Programming | [kept] |
| 16 | cpp-9 | Recursion and Backtracking | [kept] |
| 17 | cpp-27 | Bit Manipulation | B · S |
| 18 | cpp-28 | Sorting from Scratch | B · S |
| 19 | cpp-29 | Searching from Scratch | B · S |
| 20–26 | cpp-10…16 | STL Foundation … STL Algorithms | [kept] |
| 27 | cpp-30 | Hashing in Depth | B · S |
| 28 | cpp-31 | The C++ Toolbox | B · L |
| 29 | cpp-17 | Building Data Structures from Scratch | [kept] |
| 30 | cpp-32 | Linked Lists in Depth | C · S |
| 31 | cpp-33 | Stacks and Queues in Depth | C · S |
| 32 | cpp-34 | Trees | C · S |
| 33 | cpp-35 | Heaps from Scratch | C · S |
| 34 | cpp-36 | Hash Tables from Scratch | C · S |
| 35 | cpp-37 | Tries and String Algorithms | C · S |
| 36 | cpp-38 | Union-Find | C · S |
| 37 | cpp-39 | Graphs | C · S |
| 38 | cpp-40 | Range Query Structures | C · S |
| 39 | cpp-41 | Dynamic Programming Foundations | C · S |
| 40 | cpp-42 | Number Theory Algorithms | C · S |
| 41 | cpp-43 | Backtracking in Depth | C · S |
| 42 | cpp-18 | Core DSA Patterns | [kept] |
| 43 | cpp-44 | Debugging, Testing and Edge Cases | B · S |
| 44 | cpp-45 | C++ Idioms and Pitfalls | B · L |
| 45 | cpp-46 | Capstone Programs | C · L |
| 46 | cpp-19 | LeetCode Readiness Checklist | [kept] |

### Java sequence

Same shape. Kept chapters slot in as: ch1–3 after First Programs; ch4 after
Math; ch5 after Complexity; ch6 (OOP) and ch7 (Recursion) after Strings in
Depth; ch8–13 (Collections) after Searching; ch14 (Utility Classes) after
Hashing; ch15 (DS from Scratch) after The Java Toolbox; ch16 (Patterns) after
Backtracking; ch17 (Readiness) last. New ids: java-18 … java-44 in the order
listed for C++ (44 chapters total).

### Python sequence

Same shape. Kept chapters: ch1–2 after First Programs; ch3 (Functions) after
Math; ch4 (Lists & Strings) after Complexity; ch5 (Tuples/Sets/Dicts), ch6
(Recursion), ch7 (OOP) after Strings in Depth; ch8–11 (Built-ins, Stack/Queue,
Heap, Search/Sort helpers) after Searching; ch12 (DS from Scratch) after The
Python Toolbox; ch13 (Trees & Graph Basics) is kept immediately before the new
Trees chapter; ch14 (Patterns) after Backtracking; ch15 (Readiness) last. New
ids: python-16 … python-42 (42 chapters total).

---

## Tier A — Absolute Beginner (37 topics)

### A1 · How Computers Run Programs (S, 8)
Audience: has never written code. No syntax yet — every code sample is
pseudocode plus the same three-line program in the reader's language.

1. What a program is — instructions, in order, for a machine that does exactly what it is told
2. Source code vs machine code — compilers (C++/Java) and interpreters (Python) in one picture
3. Memory as labelled boxes — what a variable really is
4. Input → process → output — the shape of every program you will write
5. What an algorithm is — the recipe analogy and why order matters
6. Pseudocode — writing the steps in plain English before any syntax
7. Flowcharts and decision points — drawing an if and a loop
8. Tracing by hand — the trace table, your most important debugging tool

### A2 · Setting Up Your Workspace (L, 7)
1. Installing the toolchain (C++: g++/MinGW or clang · Java: JDK 21 · Python: 3.12)
2. Installing and configuring VS Code for the language
3. Running your first program from the terminal
4. Online compilers and the LeetCode editor — what is and is not available there
5. Reading your first error message (compile error / stack trace / traceback)
6. Naming, saving and organising practice files
7. A daily practice routine: local file → run → LeetCode submit

### A3 · First Programs, Step by Step (S, 10)
Each lesson is one complete program built line by line, then varied.
1. Print text and numbers
2. Read a number from input and print it back
3. Store, change and reuse a value — first variables
4. Arithmetic on inputs: average of three numbers
5. Your first decision: is the number even?
6. Your first loop: count from 1 to N
7. Loop + if: sum of even numbers up to N
8. Loop + input: read N numbers, find the largest
9. Turning a problem statement into steps — worked example
10. Ten beginner programs to write before moving on (with expected outputs)

### A4 · Math You Need for Programming (S, 12)
Placed after Control Flow so every lesson ends in a loop-based program.
1. Integer division and remainder
2. Modulo with negative numbers (and how each language differs)
3. Digits of a number: extract, reverse, sum
4. Even/odd, divisibility, multiples
5. GCD and LCM — Euclid's algorithm
6. Primes and checking primality up to √n
7. Factorials and how quickly they overflow
8. Powers of two and counting in binary
9. Number bases: decimal ↔ binary ↔ hexadecimal
10. Floating point is approximate — why 0.1 + 0.2 ≠ 0.3
11. Sum formulas: 1+2+…+n, and why they turn loops into O(1)
12. Logarithms: how many times can you halve n? and 1e9+7 modular arithmetic

---

## Tier B — Foundation enrichment (97 topics)

Existing chapters are kept as-is. The chapters below fill the gaps between them.
Where an existing topic already covers "how to call it" (e.g. `sort()`), the
new lesson covers "how it works and when it breaks", and links back.

### B1 · Time and Space Complexity (S, 12)
1. Why speed matters — roughly 10⁸ simple operations per second
2. Counting operations, not seconds
3. Big-O: drop constants and lower-order terms
4. O(1), O(log n), O(n) with concrete code
5. O(n log n), O(n²), O(2ⁿ), O(n!) with concrete code
6. Analysing a single loop
7. Analysing nested and dependent loops
8. Analysing recursion: draw the call tree
9. Amortised cost: why push_back / add / append is O(1)
10. Space complexity and the recursion stack
11. Constraints → target complexity table (n ≤ 20, 10³, 10⁵, 10⁷)
12. Common complexity mistakes (hidden loops in library calls, string concat)

### B2 · Arrays and Matrices in Depth (S, 10)
1. In-place vs extra space
2. Reverse and rotate an array (three-reversal trick)
3. Prefix sums (1D) and range-sum queries
4. 2D prefix sums
5. Row, column and diagonal traversal
6. Spiral and boundary traversal
7. Transpose and rotate a matrix by 90°
8. Counting / bucket arrays (index as key)
9. Running best: Kadane's idea without calling it DP
10. Index off-by-one errors and boundary checks

### B3 · Strings in Depth (S, 10)
1. Characters are numbers: ASCII and Unicode
2. Character arithmetic: `'a' + 1`, `c - '0'`, case toggling
3. Building strings efficiently — why `+=` in a loop is O(n²)
4. Parsing numbers from strings and formatting numbers to strings
5. Splitting and joining
6. Comparing and sorting strings (lexicographic order)
7. Anagram techniques: sort vs count
8. Palindrome techniques: two pointers, expand around centre
9. Naive substring search and its cost
10. 2D character grids and word search traversal

### B4 · Bit Manipulation (S, 10)
1. Binary representation and two's complement
2. AND, OR, XOR, NOT — truth tables and the mental model
3. Left and right shifts, multiply/divide by 2
4. Check, set, clear and toggle the i-th bit
5. Power-of-two test: `n & (n-1)`
6. Counting set bits (Kernighan and built-ins)
7. XOR tricks: swap, find the unique element
8. Bitmasks as subsets
9. Iterating over all subsets of a mask
10. Pitfalls: signed shifts, overflow, operator precedence of `&`

### B5 · Sorting from Scratch (S, 10)
1. Why sorting is the first thing to try
2. Bubble sort
3. Selection sort
4. Insertion sort
5. Merge sort — divide and conquer
6. Quick sort and partitioning
7. Counting sort and when it applies
8. Stability and why it matters for pairs
9. Custom order: comparators / keys, and the "strict weak ordering" rule
10. What the built-in sort actually is (introsort / TimSort) and its cost

### B6 · Searching from Scratch (S, 8)
1. Linear search and early exit
2. Binary search on a sorted array — the template
3. Off-by-one, infinite loops and the `(l+r)/2` overflow bug
4. First and last occurrence
5. Lower bound and upper bound by hand
6. Binary search on the answer (intro)
7. Search in a sorted 2D matrix
8. Ternary search and unimodal functions (concept)

### B7 · Hashing in Depth (S, 7)
1. What a hash function does
2. Collisions and chaining
3. Load factor and rehashing — the cost behind "O(1)"
4. Hashing pairs, tuples and custom objects
5. Ordered vs unordered: what you give up for speed
6. Hash set vs hash map patterns (seen-before, complement, grouping)
7. When hashing is the wrong tool (need order, range queries, adversarial input)

### B8 · Debugging, Testing and Edge Cases (S, 10)
1. Reading an error message / stack trace / traceback line by line
2. Print debugging done right
3. The dry-run table
4. Off-by-one errors
5. Infinite loops and wrong loop bounds
6. WA · TLE · MLE · RE — what each verdict tells you
7. The edge-case checklist (empty, one element, duplicates, negatives, max size, overflow)
8. Writing your own test cases before submitting
9. Brute-force checker: stress-testing a fast solution against a slow one
10. Rubber-duck debugging and reading your own code aloud

### B9 · The Language Toolbox (L, 14 each)

**C++**
1. Fast I/O: `ios::sync_with_stdio(false)`, `cin.tie`
2. `INT_MAX`, `LLONG_MAX`, `numeric_limits`
3. `size_t` and the signed/unsigned comparison trap
4. `auto` and range-based `for`
5. Lambdas and captures
6. Function templates
7. Iterators: `begin/end`, categories, `distance`
8. `emplace_back`, `reserve`, `shrink_to_fit`
9. `swap`, `min`, `max`, `minmax`, `clamp`
10. `iota`, `partial_sum`, `fill`, `count_if`
11. `stringstream` for parsing
12. `bitset`
13. Custom hash for `unordered_map` keys
14. Smart pointers: `unique_ptr`, `shared_ptr` (and why LeetCode rarely needs them)

**Java**
1. `Scanner` vs `BufferedReader`
2. `StringTokenizer` and buffered output
3. `Integer`, `Long`, `Character` utility methods
4. The `Math` class
5. Integer caching and `==` on wrappers
6. `equals()` / `hashCode()` contract for custom keys
7. Generics: type parameters, bounded types, wildcards
8. Records and enums
9. Exceptions: try/catch, checked vs unchecked, the ones LeetCode throws
10. `Arrays`: `fill`, `copyOf`, `asList`, `deepToString`
11. `Collections`: `reverse`, `max`, `frequency`, `unmodifiableList`
12. `Iterator` and `ConcurrentModificationException`
13. Lambdas and functional interfaces
14. Streams — and why to avoid them in hot loops

**Python**
1. Fast input with `sys.stdin`
2. List, set and dict comprehensions
3. Generators and `yield`
4. `enumerate`, `zip`, `map`, `filter`
5. `*args`, `**kwargs` and unpacking
6. f-strings and formatting
7. `itertools`: `permutations`, `combinations`, `product`, `accumulate`
8. `functools`: `lru_cache`, `reduce`, `cmp_to_key`
9. `math` module essentials
10. String methods deep dive
11. `dataclass` and `namedtuple`
12. Exceptions and `try/except`
13. Type hints (just enough to read LeetCode signatures)
14. Decorators — just enough to understand `@lru_cache`

### B10 · Idioms and Pitfalls (L, 12 each)

**C++**
1. Uninitialised variables
2. Integer promotion and mixed `int`/`long long` arithmetic
3. Comparing floating-point values
4. `vector<bool>` is not a vector of bools
5. Iterator invalidation
6. References into a vector that grows
7. Copying containers by accident (pass by value)
8. `%` with negative operands
9. `char` ↔ `int` conversion
10. Global arrays vs large local arrays
11. Stack overflow from deep recursion
12. Undefined-behaviour cheat sheet

**Java**
1. `String ==` vs `equals`
2. `Integer ==` on wrappers
3. Array default values and `null`
4. `ArrayList<Integer>.remove(int)` vs `remove(Object)`
5. `Arrays.asList` is fixed-size
6. 2D array copies are shallow
7. `char` arithmetic and casting
8. `(l + r) / 2` overflow
9. Autoboxing cost in hot loops
10. Modifying a collection while iterating
11. Deep recursion and `StackOverflowError`
12. Mutable keys in `HashMap`

**Python**
1. Mutable default arguments
2. `is` vs `==`
3. Aliasing: `[[0]*n]*m`
4. Shallow vs deep copy
5. Truthiness of empty containers and `0`
6. `//` and `%` with negatives
7. Float precision and `math.isclose`
8. Recursion limit
9. `in` on a list vs a set
10. String concatenation in loops
11. Sorted stability and multi-key sorting
12. Hashability, mutable keys and tuple comparison in `heapq`

---

## Tier C — Advanced Data Structures & Algorithms (98 topics)

Every lesson implements the structure by hand in the reader's language, states
the complexity of each operation, and ends with one LeetCode problem that uses
it directly. Phase 1 problem sets are not repeated here.

### C1 · Linked Lists in Depth (S, 10)
1. Node design and who owns what
2. Insert at head, tail and position
3. Delete by value and by position
4. Reverse — iteratively and recursively
5. Find the middle with slow/fast pointers
6. Detect and remove a cycle (Floyd)
7. Merge two sorted lists
8. The dummy-head technique
9. Doubly linked list operations
10. Circular linked lists

### C2 · Stacks and Queues in Depth (S, 8)
1. Stack via array and via linked list
2. Min-stack
3. Queue via two stacks, stack via two queues
4. Circular queue
5. Deque implementation
6. Expression evaluation: infix → postfix → result
7. Balanced brackets
8. Deriving the monotonic stack

### C3 · Trees (S, 12)
1. Tree terminology
2. Binary tree node and building a tree from an array
3. Preorder, inorder, postorder — recursive
4. Iterative traversals with an explicit stack
5. Level order with a queue
6. Height, depth, diameter
7. BST: search and insert
8. BST: delete
9. BST validation and the inorder property
10. Lowest common ancestor
11. Why balance matters: AVL and red-black trees (concept, one rotation)
12. N-ary trees

### C4 · Heaps from Scratch (S, 8)
1. Array representation and index arithmetic
2. Sift up
3. Sift down
4. Build-heap in O(n)
5. Heap sort
6. Kth largest with a size-k heap
7. Custom priority: pairs and objects
8. Two-heap median trick

### C5 · Hash Tables from Scratch (S, 6)
1. Array + hash function
2. Chaining implementation
3. Open addressing (concept)
4. Resize and rehash
5. LRU cache: hash map + doubly linked list
6. Design questions: choosing the structure

### C6 · Tries and String Algorithms (S, 6)
1. Trie node and insert
2. Search and prefix search
3. Delete from a trie
4. Word count and autocomplete
5. Rolling hash and Rabin-Karp
6. KMP prefix function

### C7 · Union-Find (S, 5)
1. The connectivity question
2. Parent array and `find`
3. Union by rank / size
4. Path compression
5. Counting components and detecting cycles

### C8 · Graphs (S, 12)
1. Terminology: directed, weighted, degree, path, cycle
2. Adjacency list vs adjacency matrix
3. Building a graph from an edge list
4. BFS implementation
5. DFS — recursive and iterative
6. Connected components
7. Cycle detection (undirected and directed)
8. Topological sort — Kahn's and DFS
9. Shortest path in an unweighted graph
10. Dijkstra
11. MST: Kruskal and Prim
12. Grids as graphs

### C9 · Range Query Structures (S, 8)
1. Prefix sums vs updates — the problem these solve
2. Fenwick tree: point update
3. Fenwick tree: prefix and range query
4. Segment tree: build
5. Segment tree: query
6. Segment tree: point update
7. Lazy propagation (concept)
8. Sparse table for range-minimum queries

### C10 · Dynamic Programming Foundations (S, 8)
1. Overlapping subproblems and optimal substructure
2. Memoisation (top-down)
3. Tabulation (bottom-up)
4. Fibonacci → climbing stairs
5. 1D DP: the house-robber shape
6. 2D DP: grid paths
7. 0/1 knapsack
8. State-design checklist and space optimisation

### C11 · Number Theory Algorithms (S, 5)
1. Sieve of Eratosthenes
2. Fast exponentiation
3. Modular inverse and Fermat's little theorem
4. Prime factorisation
5. nCr with factorials mod p

### C12 · Backtracking in Depth (S, 6)
1. The choose → explore → un-choose template
2. Subsets
3. Permutations
4. Combination sum with de-duplication
5. N-Queens
6. Pruning

### C13 · Capstone Programs (L, 4)
Each is a 100–200 line program the student writes in full, with a spec, sample
I/O and a checklist. No hand-holding beyond the spec.
1. Text analyser (strings, hash map, sorting)
2. Expression calculator (stack, parsing)
3. Contact book (classes, sorted map/list, binary search)
4. Mini social graph (adjacency list, BFS, union-find)

---

## Overlap with existing chapters

| New | Existing that it extends | Rule |
|---|---|---|
| B5 Sorting / B6 Searching | cpp-16 `sort()`, python-11 helpers, java-14 `Arrays.sort` | Existing = how to call; new = how it works |
| C2 Stacks & Queues | cpp-12, java-10, python-9 | Existing = library usage; new = build it |
| C3 Trees, C8 Graphs | python-13 (Trees & Graph Basics), *-18/16/14 patterns | python-13 stays as the gentle intro before C3 |
| C1 Linked Lists | cpp-17.1–2, java-15.1–2, python-12.1–2 | Existing = node struct; new = every operation |
| C4 Heaps | cpp-12.4, java-11, python-10 | Existing = `priority_queue`/`heapq`; new = sift up/down |
| B7 Hashing | cpp-14, java-12, python-5/8 | Existing = usage; new = internals |

---

## Content rules (unchanged from the current tracks, plus)

- Every lesson opens with prose, not code.
- Target size 2.5–4 KB per lesson, `readMinutes` 3–6. Tier A lessons may be
  shorter; Tier C lessons may reach 5 KB when a full implementation is shown.
- Tier A vocabulary: no term is used before it is defined. No "obviously".
- Tier C: state the complexity of every operation in a table block.
- One `practice` per lesson; a `leetcode` link whenever a real problem fits.

## Trim list (to land at ~2× instead of ~2.4×)

Drop, in this order, until the count fits: C13 Capstones (−4), B8 Debugging
to 6 topics (−4), C9 Range Queries → concept-only 4 topics (−4), C11 Number
Theory (−5), B2/B3 to 8 topics each (−4), A4 Math to 8 (−4), B9/B10 to 10
each (−12). That reaches ~330 per language.
