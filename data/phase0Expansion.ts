import type { Phase0Language } from './day0to1Topics';

/**
 * Phase 0 expansion — the chapters added on top of the original syllabus.
 * The full rationale and topic-by-topic spec is docs/phase0-curriculum.md.
 *
 * Original chapter numbers are ids, not positions: a student's progress row
 * is keyed by "cpp-3.4", so those never change. Every new chapter takes the
 * next free number per language (C++ from 20, Java from 18, Python from 16)
 * and `chapterOrder` below decides where it appears on screen. The UI shows
 * the position in that order, never the raw number.
 */

export type PerLanguage<T> = Record<Phase0Language, T>;

export interface NewChapterDef {
  /** Stable key, also the shared-content file name (data/content/shared/<key>.ts). */
  key: string;
  title: string;
  /**
   * Shared chapters are authored once with per-language code blocks and
   * expanded into all three languages. Language-specific chapters have their
   * own topic list and their own lesson file per language.
   */
  topics: string[] | PerLanguage<string[]>;
}

const NEW_CHAPTER_START: PerLanguage<number> = { cpp: 20, java: 18, python: 16 };

/** Chapter number of the k-th new chapter in `newChapters`, per language. */
export function newChapterNumber(language: Phase0Language, index: number): number {
  return NEW_CHAPTER_START[language] + index;
}

export const newChapters: NewChapterDef[] = [
  // ---- Tier A: absolute beginner --------------------------------------------
  {
    key: 'how-computers-run',
    title: 'How Computers Run Programs',
    topics: [
      'What a program is',
      'Source code vs machine code: compilers and interpreters',
      'Memory as labelled boxes: what a variable really is',
      'Input, process, output',
      'What an algorithm is',
      'Pseudocode: steps in plain English',
      'Flowcharts and decision points',
      'Tracing by hand with a trace table',
    ],
  },
  {
    key: 'workspace',
    title: 'Setting Up Your Workspace',
    topics: {
      cpp: [
        'Installing g++ (MinGW or clang)',
        'Setting up VS Code for C++',
        'Compiling and running from the terminal',
        'Online compilers and the LeetCode editor',
        'Reading your first compiler error',
        'Naming, saving and organising practice files',
        'A daily practice routine: local file, run, submit',
      ],
      java: [
        'Installing the JDK',
        'Setting up VS Code for Java',
        'Compiling and running from the terminal',
        'Online compilers and the LeetCode editor',
        'Reading your first stack trace',
        'Naming, saving and organising practice files',
        'A daily practice routine: local file, run, submit',
      ],
      python: [
        'Installing Python 3',
        'Setting up VS Code for Python',
        'Running a script from the terminal',
        'Online interpreters and the LeetCode editor',
        'Reading your first traceback',
        'Naming, saving and organising practice files',
        'A daily practice routine: local file, run, submit',
      ],
    },
  },
  {
    key: 'first-programs',
    title: 'First Programs, Step by Step',
    topics: [
      'Print text and numbers',
      'Read a number and print it back',
      'Store, change and reuse a value',
      'Arithmetic on inputs: average of three numbers',
      'Your first decision: is the number even?',
      'Your first loop: count from 1 to N',
      'Loop plus if: sum of even numbers up to N',
      'Loop plus input: find the largest of N numbers',
      'Turning a problem statement into steps',
      'Ten beginner programs to write before moving on',
    ],
  },
  {
    key: 'math-for-programming',
    title: 'Math You Need for Programming',
    topics: [
      'Integer division and remainder',
      'Modulo with negative numbers',
      'Digits of a number: extract, reverse, sum',
      'Even, odd, divisibility and multiples',
      'GCD and LCM with Euclid’s algorithm',
      'Primes and primality up to the square root',
      'Factorials and how quickly they overflow',
      'Powers of two and counting in binary',
      'Number bases: decimal, binary, hexadecimal',
      'Floating point is approximate',
      'Sum formulas: turning loops into O(1)',
      'Logarithms and modular arithmetic with 1e9+7',
    ],
  },
  // ---- Tier B: foundation enrichment ---------------------------------------
  {
    key: 'complexity',
    title: 'Time and Space Complexity',
    topics: [
      'Why speed matters: 10^8 operations per second',
      'Counting operations, not seconds',
      'Big-O: drop constants and lower-order terms',
      'O(1), O(log n), O(n)',
      'O(n log n), O(n^2), O(2^n), O(n!)',
      'Analysing a single loop',
      'Analysing nested and dependent loops',
      'Analysing recursion: draw the call tree',
      'Amortised cost: why append is O(1)',
      'Space complexity and the recursion stack',
      'Constraints to target complexity',
      'Common complexity mistakes',
    ],
  },
  {
    key: 'arrays-in-depth',
    title: 'Arrays and Matrices in Depth',
    topics: [
      'In-place vs extra space',
      'Reverse and rotate an array',
      'Prefix sums and range-sum queries',
      '2D prefix sums',
      'Row, column and diagonal traversal',
      'Spiral and boundary traversal',
      'Transpose and rotate a matrix',
      'Counting and bucket arrays',
      'Running best: Kadane’s idea',
      'Index off-by-one errors and boundary checks',
    ],
  },
  {
    key: 'strings-in-depth',
    title: 'Strings in Depth',
    topics: [
      'Characters are numbers: ASCII and Unicode',
      'Character arithmetic',
      'Building strings efficiently',
      'Parsing numbers from strings and back',
      'Splitting and joining',
      'Comparing and sorting strings',
      'Anagram techniques: sort vs count',
      'Palindrome techniques',
      'Naive substring search and its cost',
      '2D character grids',
    ],
  },
  {
    key: 'bits',
    title: 'Bit Manipulation',
    topics: [
      'Binary representation and two’s complement',
      'AND, OR, XOR, NOT',
      'Left and right shifts',
      'Check, set, clear and toggle a bit',
      'Power-of-two test',
      'Counting set bits',
      'XOR tricks: swap and the unique element',
      'Bitmasks as subsets',
      'Iterating over all subsets of a mask',
      'Bit pitfalls: signed shifts, overflow, precedence',
    ],
  },
  {
    key: 'sorting',
    title: 'Sorting from Scratch',
    topics: [
      'Why sorting is the first thing to try',
      'Bubble sort',
      'Selection sort',
      'Insertion sort',
      'Merge sort',
      'Quick sort and partitioning',
      'Counting sort',
      'Stability and why it matters',
      'Custom order and the strict weak ordering rule',
      'What the built-in sort actually is',
    ],
  },
  {
    key: 'searching',
    title: 'Searching from Scratch',
    topics: [
      'Linear search and early exit',
      'Binary search: the template',
      'Off-by-one, infinite loops and the mid overflow bug',
      'First and last occurrence',
      'Lower bound and upper bound by hand',
      'Binary search on the answer',
      'Search in a sorted 2D matrix',
      'Ternary search and unimodal functions',
    ],
  },
  {
    key: 'hashing',
    title: 'Hashing in Depth',
    topics: [
      'What a hash function does',
      'Collisions and chaining',
      'Load factor and rehashing',
      'Hashing pairs, tuples and custom objects',
      'Ordered vs unordered: what you give up',
      'Hash set vs hash map patterns',
      'When hashing is the wrong tool',
    ],
  },
  {
    key: 'toolbox',
    title: 'The Language Toolbox',
    topics: {
      cpp: [
        'Fast I/O: ios::sync_with_stdio and cin.tie',
        'INT_MAX, LLONG_MAX and numeric_limits',
        'size_t and the signed/unsigned comparison trap',
        'auto and range-based for',
        'Lambdas and captures',
        'Function templates',
        'Iterators: begin, end, categories, distance',
        'emplace_back, reserve and shrink_to_fit',
        'swap, min, max, minmax and clamp',
        'iota, partial_sum, fill and count_if',
        'stringstream for parsing',
        'bitset',
        'Custom hash for unordered_map keys',
        'Smart pointers: unique_ptr and shared_ptr',
      ],
      java: [
        'Scanner vs BufferedReader',
        'StringTokenizer and buffered output',
        'Integer, Long and Character utility methods',
        'The Math class',
        'Integer caching and == on wrappers',
        'The equals and hashCode contract',
        'Generics: type parameters, bounds and wildcards',
        'Records and enums',
        'Exceptions: try/catch and the ones LeetCode throws',
        'Arrays: fill, copyOf, asList and deepToString',
        'Collections: reverse, max, frequency and unmodifiableList',
        'Iterator and ConcurrentModificationException',
        'Lambdas and functional interfaces',
        'Streams, and why to avoid them in hot loops',
      ],
      python: [
        'Fast input with sys.stdin',
        'List, set and dict comprehensions',
        'Generators and yield',
        'enumerate, zip, map and filter',
        '*args, **kwargs and unpacking',
        'f-strings and formatting',
        'itertools essentials',
        'functools: lru_cache, reduce and cmp_to_key',
        'The math module',
        'String methods deep dive',
        'dataclass and namedtuple',
        'Exceptions and try/except',
        'Type hints for reading LeetCode signatures',
        'Decorators: just enough for lru_cache',
      ],
    },
  },
  // ---- Tier C: advanced data structures and algorithms ---------------------
  {
    key: 'linked-lists',
    title: 'Linked Lists in Depth',
    topics: [
      'Node design and ownership',
      'Insert at head, tail and position',
      'Delete by value and by position',
      'Reverse: iteratively and recursively',
      'Find the middle with slow and fast pointers',
      'Detect and remove a cycle',
      'Merge two sorted lists',
      'The dummy-head technique',
      'Doubly linked list operations',
      'Circular linked lists',
    ],
  },
  {
    key: 'stacks-queues',
    title: 'Stacks and Queues in Depth',
    topics: [
      'Stack via array and via linked list',
      'Min-stack',
      'Queue via two stacks, stack via two queues',
      'Circular queue',
      'Deque implementation',
      'Expression evaluation: infix to postfix',
      'Balanced brackets',
      'Deriving the monotonic stack',
    ],
  },
  {
    key: 'trees',
    title: 'Trees',
    topics: [
      'Tree terminology',
      'Binary tree node and building from an array',
      'Preorder, inorder and postorder: recursive',
      'Iterative traversals with an explicit stack',
      'Level order with a queue',
      'Height, depth and diameter',
      'BST: search and insert',
      'BST: delete',
      'BST validation and the inorder property',
      'Lowest common ancestor',
      'Why balance matters: AVL and red-black trees',
      'N-ary trees',
    ],
  },
  {
    key: 'heaps',
    title: 'Heaps from Scratch',
    topics: [
      'Array representation and index arithmetic',
      'Sift up',
      'Sift down',
      'Build-heap in O(n)',
      'Heap sort',
      'Kth largest with a size-k heap',
      'Custom priority: pairs and objects',
      'Two-heap median trick',
    ],
  },
  {
    key: 'hash-tables',
    title: 'Hash Tables from Scratch',
    topics: [
      'Array plus hash function',
      'Chaining implementation',
      'Open addressing',
      'Resize and rehash',
      'LRU cache: hash map plus doubly linked list',
      'Design questions: choosing the structure',
    ],
  },
  {
    key: 'tries',
    title: 'Tries and String Algorithms',
    topics: [
      'Trie node and insert',
      'Search and prefix search',
      'Delete from a trie',
      'Word count and autocomplete',
      'Rolling hash and Rabin-Karp',
      'KMP prefix function',
    ],
  },
  {
    key: 'union-find',
    title: 'Union-Find',
    topics: [
      'The connectivity question',
      'Parent array and find',
      'Union by rank and size',
      'Path compression',
      'Counting components and detecting cycles',
    ],
  },
  {
    key: 'graphs',
    title: 'Graphs',
    topics: [
      'Terminology: directed, weighted, degree, path, cycle',
      'Adjacency list vs adjacency matrix',
      'Building a graph from an edge list',
      'BFS implementation',
      'DFS: recursive and iterative',
      'Connected components',
      'Cycle detection: undirected and directed',
      'Topological sort: Kahn’s and DFS',
      'Shortest path in an unweighted graph',
      'Dijkstra',
      'Minimum spanning tree: Kruskal and Prim',
      'Grids as graphs',
    ],
  },
  {
    key: 'range-queries',
    title: 'Range Query Structures',
    topics: [
      'Prefix sums vs updates: the problem these solve',
      'Fenwick tree: point update',
      'Fenwick tree: prefix and range query',
      'Segment tree: build',
      'Segment tree: query',
      'Segment tree: point update',
      'Lazy propagation',
      'Sparse table for range-minimum queries',
    ],
  },
  {
    key: 'dp',
    title: 'Dynamic Programming Foundations',
    topics: [
      'Overlapping subproblems and optimal substructure',
      'Memoisation: top-down',
      'Tabulation: bottom-up',
      'Fibonacci to climbing stairs',
      '1D DP: the house-robber shape',
      '2D DP: grid paths',
      '0/1 knapsack',
      'State design and space optimisation',
    ],
  },
  {
    key: 'number-theory',
    title: 'Number Theory Algorithms',
    topics: [
      'Sieve of Eratosthenes',
      'Fast exponentiation',
      'Modular inverse and Fermat’s little theorem',
      'Prime factorisation',
      'nCr with factorials mod p',
    ],
  },
  {
    key: 'backtracking',
    title: 'Backtracking in Depth',
    topics: [
      'The choose, explore, un-choose template',
      'Subsets',
      'Permutations',
      'Combination sum with de-duplication',
      'N-Queens',
      'Pruning',
    ],
  },
  // ---- Closing chapters ------------------------------------------------------
  {
    key: 'debugging',
    title: 'Debugging, Testing and Edge Cases',
    topics: [
      'Reading an error message line by line',
      'Print debugging done right',
      'The dry-run table',
      'Off-by-one errors',
      'Infinite loops and wrong loop bounds',
      'WA, TLE, MLE, RE: what each verdict tells you',
      'The edge-case checklist',
      'Writing your own test cases before submitting',
      'Brute-force checker: stress testing',
      'Rubber-duck debugging',
    ],
  },
  {
    key: 'pitfalls',
    title: 'Idioms and Pitfalls',
    topics: {
      cpp: [
        'Uninitialised variables',
        'Integer promotion and mixed int/long long arithmetic',
        'Comparing floating-point values',
        'vector<bool> is not a vector of bools',
        'Iterator invalidation',
        'References into a vector that grows',
        'Copying containers by accident',
        '% with negative operands',
        'char and int conversion',
        'Global arrays vs large local arrays',
        'Stack overflow from deep recursion',
        'Undefined-behaviour cheat sheet',
      ],
      java: [
        'String == vs equals',
        'Integer == on wrappers',
        'Array default values and null',
        'ArrayList<Integer>.remove(int) vs remove(Object)',
        'Arrays.asList is fixed-size',
        '2D array copies are shallow',
        'char arithmetic and casting',
        '(l + r) / 2 overflow',
        'Autoboxing cost in hot loops',
        'Modifying a collection while iterating',
        'Deep recursion and StackOverflowError',
        'Mutable keys in HashMap',
      ],
      python: [
        'Mutable default arguments',
        'is vs ==',
        'Aliasing: [[0]*n]*m',
        'Shallow vs deep copy',
        'Truthiness of empty containers and 0',
        '// and % with negatives',
        'Float precision and math.isclose',
        'Recursion limit',
        'in on a list vs a set',
        'String concatenation in loops',
        'Sorted stability and multi-key sorting',
        'Hashability, mutable keys and tuple comparison in heapq',
      ],
    },
  },
  {
    key: 'capstones',
    title: 'Capstone Programs',
    topics: {
      cpp: [
        'Text analyser',
        'Expression calculator',
        'Contact book',
        'Mini social graph',
      ],
      java: [
        'Text analyser',
        'Expression calculator',
        'Contact book',
        'Mini social graph',
      ],
      python: [
        'Text analyser',
        'Expression calculator',
        'Contact book',
        'Mini social graph',
      ],
    },
  },
];

/** Index of a new chapter in `newChapters` by key. */
export function newChapterIndex(key: string): number {
  const i = newChapters.findIndex((c) => c.key === key);
  if (i < 0) throw new Error(`Unknown Phase 0 chapter key: ${key}`);
  return i;
}

/** Chapter number for a new chapter key in a language. */
export function chapterNumberFor(language: Phase0Language, key: string): number {
  return newChapterNumber(language, newChapterIndex(key));
}

/** Whether a chapter is shared (one authored source, three languages). */
export function isSharedChapter(def: NewChapterDef): boolean {
  return Array.isArray(def.topics);
}

/** Topic titles of a new chapter in a language. */
export function topicsFor(def: NewChapterDef, language: Phase0Language): string[] {
  return Array.isArray(def.topics) ? def.topics : def.topics[language];
}

// Shorthands for the order tables below, keeping them readable.
const N = (language: Phase0Language, key: string) => chapterNumberFor(language, key);

/**
 * On-screen order of every chapter, original and new, per language. The UI
 * numbers chapters by their position in this list.
 */
export const chapterOrder: PerLanguage<number[]> = {
  cpp: [
    N('cpp', 'how-computers-run'),
    N('cpp', 'workspace'),
    N('cpp', 'first-programs'),
    1, 2, 3,
    N('cpp', 'math-for-programming'),
    4,
    N('cpp', 'complexity'),
    5,
    N('cpp', 'arrays-in-depth'),
    N('cpp', 'strings-in-depth'),
    6, 7, 8, 9,
    N('cpp', 'bits'),
    N('cpp', 'sorting'),
    N('cpp', 'searching'),
    10, 11, 12, 13, 14, 15, 16,
    N('cpp', 'hashing'),
    N('cpp', 'toolbox'),
    17,
    N('cpp', 'linked-lists'),
    N('cpp', 'stacks-queues'),
    N('cpp', 'trees'),
    N('cpp', 'heaps'),
    N('cpp', 'hash-tables'),
    N('cpp', 'tries'),
    N('cpp', 'union-find'),
    N('cpp', 'graphs'),
    N('cpp', 'range-queries'),
    N('cpp', 'dp'),
    N('cpp', 'number-theory'),
    N('cpp', 'backtracking'),
    18,
    N('cpp', 'debugging'),
    N('cpp', 'pitfalls'),
    N('cpp', 'capstones'),
    19,
  ],
  java: [
    N('java', 'how-computers-run'),
    N('java', 'workspace'),
    N('java', 'first-programs'),
    1, 2, 3,
    N('java', 'math-for-programming'),
    4,
    N('java', 'complexity'),
    5,
    N('java', 'arrays-in-depth'),
    N('java', 'strings-in-depth'),
    6, 7,
    N('java', 'bits'),
    N('java', 'sorting'),
    N('java', 'searching'),
    8, 9, 10, 11, 12, 13,
    N('java', 'hashing'),
    14,
    N('java', 'toolbox'),
    15,
    N('java', 'linked-lists'),
    N('java', 'stacks-queues'),
    N('java', 'trees'),
    N('java', 'heaps'),
    N('java', 'hash-tables'),
    N('java', 'tries'),
    N('java', 'union-find'),
    N('java', 'graphs'),
    N('java', 'range-queries'),
    N('java', 'dp'),
    N('java', 'number-theory'),
    N('java', 'backtracking'),
    16,
    N('java', 'debugging'),
    N('java', 'pitfalls'),
    N('java', 'capstones'),
    17,
  ],
  python: [
    N('python', 'how-computers-run'),
    N('python', 'workspace'),
    N('python', 'first-programs'),
    1, 2,
    N('python', 'math-for-programming'),
    3,
    N('python', 'complexity'),
    4,
    N('python', 'arrays-in-depth'),
    N('python', 'strings-in-depth'),
    5, 6, 7,
    N('python', 'bits'),
    N('python', 'sorting'),
    N('python', 'searching'),
    8, 9, 10, 11,
    N('python', 'hashing'),
    N('python', 'toolbox'),
    12,
    N('python', 'linked-lists'),
    N('python', 'stacks-queues'),
    13,
    N('python', 'trees'),
    N('python', 'heaps'),
    N('python', 'hash-tables'),
    N('python', 'tries'),
    N('python', 'union-find'),
    N('python', 'graphs'),
    N('python', 'range-queries'),
    N('python', 'dp'),
    N('python', 'number-theory'),
    N('python', 'backtracking'),
    14,
    N('python', 'debugging'),
    N('python', 'pitfalls'),
    N('python', 'capstones'),
    15,
  ],
};
