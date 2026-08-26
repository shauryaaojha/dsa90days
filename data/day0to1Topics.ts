export type Phase0Language = 'cpp' | 'java' | 'python';

export interface Day0to1Chapter {
  chapter: number;
  title: string;
  language: Phase0Language;
}

export interface Day0to1Topic {
  id: string;                // e.g. "cpp-1.1", "java-3.4", "python-5.2"
  language: Phase0Language;
  chapter: number;           // 1–20 (varies by language)
  chapterTitle: string;      // "Language Setup and Core Syntax"
  subIndex: number;          // 1, 2, 3…
  title: string;             // "C++ program structure"
}

// ---------------------------------------------------------------------------
// C++ — 20 chapters (ch 20 is a goal summary, not topics → 19 trackable chapters)
// ---------------------------------------------------------------------------
const cppChapters: Day0to1Chapter[] = [
  { chapter: 1, title: 'Language Setup and Core Syntax', language: 'cpp' },
  { chapter: 2, title: 'Variables, Data Types, and Operators', language: 'cpp' },
  { chapter: 3, title: 'Control Flow', language: 'cpp' },
  { chapter: 4, title: 'Functions', language: 'cpp' },
  { chapter: 5, title: 'Arrays and Strings', language: 'cpp' },
  { chapter: 6, title: 'Pointers and References', language: 'cpp' },
  { chapter: 7, title: 'Memory Management', language: 'cpp' },
  { chapter: 8, title: 'Object-Oriented Programming', language: 'cpp' },
  { chapter: 9, title: 'Recursion and Backtracking', language: 'cpp' },
  { chapter: 10, title: 'STL Foundation', language: 'cpp' },
  { chapter: 11, title: 'STL Sequence Containers', language: 'cpp' },
  { chapter: 12, title: 'STL Container Adaptors', language: 'cpp' },
  { chapter: 13, title: 'STL Associative Containers', language: 'cpp' },
  { chapter: 14, title: 'STL Unordered Containers', language: 'cpp' },
  { chapter: 15, title: 'STL Utilities', language: 'cpp' },
  { chapter: 16, title: 'STL Algorithms', language: 'cpp' },
  { chapter: 17, title: 'Building Data Structures from Scratch', language: 'cpp' },
  { chapter: 18, title: 'Core DSA Patterns', language: 'cpp' },
  { chapter: 19, title: 'LeetCode Readiness Checklist', language: 'cpp' },
];

const cppTopics: Omit<Day0to1Topic, 'chapterTitle'>[] = [
  // Chapter 1
  { id: 'cpp-1.1', language: 'cpp', chapter: 1, subIndex: 1, title: 'C++ program structure' },
  { id: 'cpp-1.2', language: 'cpp', chapter: 1, subIndex: 2, title: '#include directives' },
  { id: 'cpp-1.3', language: 'cpp', chapter: 1, subIndex: 3, title: 'using namespace std' },
  { id: 'cpp-1.4', language: 'cpp', chapter: 1, subIndex: 4, title: 'main() function' },
  { id: 'cpp-1.5', language: 'cpp', chapter: 1, subIndex: 5, title: 'Input and output with cin, cout, getline' },
  { id: 'cpp-1.6', language: 'cpp', chapter: 1, subIndex: 6, title: 'Comments and formatting' },
  { id: 'cpp-1.7', language: 'cpp', chapter: 1, subIndex: 7, title: 'Compilation flow' },
  { id: 'cpp-1.8', language: 'cpp', chapter: 1, subIndex: 8, title: 'Common syntax errors in LeetCode submissions' },
  // Chapter 2
  { id: 'cpp-2.1', language: 'cpp', chapter: 2, subIndex: 1, title: 'Primitive data types' },
  { id: 'cpp-2.2', language: 'cpp', chapter: 2, subIndex: 2, title: 'int, long long, float, double, char, bool' },
  { id: 'cpp-2.3', language: 'cpp', chapter: 2, subIndex: 3, title: 'Type casting' },
  { id: 'cpp-2.4', language: 'cpp', chapter: 2, subIndex: 4, title: 'Constants and const' },
  { id: 'cpp-2.5', language: 'cpp', chapter: 2, subIndex: 5, title: 'Arithmetic operators' },
  { id: 'cpp-2.6', language: 'cpp', chapter: 2, subIndex: 6, title: 'Relational operators' },
  { id: 'cpp-2.7', language: 'cpp', chapter: 2, subIndex: 7, title: 'Logical operators' },
  { id: 'cpp-2.8', language: 'cpp', chapter: 2, subIndex: 8, title: 'Bitwise operators' },
  { id: 'cpp-2.9', language: 'cpp', chapter: 2, subIndex: 9, title: 'Increment and decrement' },
  { id: 'cpp-2.10', language: 'cpp', chapter: 2, subIndex: 10, title: 'Operator precedence' },
  { id: 'cpp-2.11', language: 'cpp', chapter: 2, subIndex: 11, title: 'Overflow handling in competitive coding' },
  // Chapter 3
  { id: 'cpp-3.1', language: 'cpp', chapter: 3, subIndex: 1, title: 'if, else if, else' },
  { id: 'cpp-3.2', language: 'cpp', chapter: 3, subIndex: 2, title: 'Nested conditions' },
  { id: 'cpp-3.3', language: 'cpp', chapter: 3, subIndex: 3, title: 'switch' },
  { id: 'cpp-3.4', language: 'cpp', chapter: 3, subIndex: 4, title: 'for loop' },
  { id: 'cpp-3.5', language: 'cpp', chapter: 3, subIndex: 5, title: 'while loop' },
  { id: 'cpp-3.6', language: 'cpp', chapter: 3, subIndex: 6, title: 'do-while loop' },
  { id: 'cpp-3.7', language: 'cpp', chapter: 3, subIndex: 7, title: 'break, continue, return' },
  { id: 'cpp-3.8', language: 'cpp', chapter: 3, subIndex: 8, title: 'Loop patterns used in DSA' },
  // Chapter 4
  { id: 'cpp-4.1', language: 'cpp', chapter: 4, subIndex: 1, title: 'Function declaration and definition' },
  { id: 'cpp-4.2', language: 'cpp', chapter: 4, subIndex: 2, title: 'Parameters and return values' },
  { id: 'cpp-4.3', language: 'cpp', chapter: 4, subIndex: 3, title: 'Pass by value' },
  { id: 'cpp-4.4', language: 'cpp', chapter: 4, subIndex: 4, title: 'Pass by reference' },
  { id: 'cpp-4.5', language: 'cpp', chapter: 4, subIndex: 5, title: 'Pass by pointer' },
  { id: 'cpp-4.6', language: 'cpp', chapter: 4, subIndex: 6, title: 'Default arguments' },
  { id: 'cpp-4.7', language: 'cpp', chapter: 4, subIndex: 7, title: 'Function overloading' },
  { id: 'cpp-4.8', language: 'cpp', chapter: 4, subIndex: 8, title: 'Scope of variables' },
  { id: 'cpp-4.9', language: 'cpp', chapter: 4, subIndex: 9, title: 'Global vs local variables' },
  { id: 'cpp-4.10', language: 'cpp', chapter: 4, subIndex: 10, title: 'Writing helper functions for LeetCode' },
  // Chapter 5
  { id: 'cpp-5.1', language: 'cpp', chapter: 5, subIndex: 1, title: 'One-dimensional arrays' },
  { id: 'cpp-5.2', language: 'cpp', chapter: 5, subIndex: 2, title: 'Two-dimensional arrays' },
  { id: 'cpp-5.3', language: 'cpp', chapter: 5, subIndex: 3, title: 'Static arrays vs dynamic arrays' },
  { id: 'cpp-5.4', language: 'cpp', chapter: 5, subIndex: 4, title: 'std::string basics' },
  { id: 'cpp-5.5', language: 'cpp', chapter: 5, subIndex: 5, title: 'C-style strings vs std::string' },
  { id: 'cpp-5.6', language: 'cpp', chapter: 5, subIndex: 6, title: 'Traversal and mutation' },
  { id: 'cpp-5.7', language: 'cpp', chapter: 5, subIndex: 7, title: 'Substrings' },
  { id: 'cpp-5.8', language: 'cpp', chapter: 5, subIndex: 8, title: 'Palindrome checks' },
  { id: 'cpp-5.9', language: 'cpp', chapter: 5, subIndex: 9, title: 'Frequency counting' },
  { id: 'cpp-5.10', language: 'cpp', chapter: 5, subIndex: 10, title: 'String concatenation' },
  { id: 'cpp-5.11', language: 'cpp', chapter: 5, subIndex: 11, title: 'Common string problems in LeetCode' },
  // Chapter 6
  { id: 'cpp-6.1', language: 'cpp', chapter: 6, subIndex: 1, title: 'Address-of operator &' },
  { id: 'cpp-6.2', language: 'cpp', chapter: 6, subIndex: 2, title: 'Dereference operator *' },
  { id: 'cpp-6.3', language: 'cpp', chapter: 6, subIndex: 3, title: 'Null pointers' },
  { id: 'cpp-6.4', language: 'cpp', chapter: 6, subIndex: 4, title: 'Pointer arithmetic' },
  { id: 'cpp-6.5', language: 'cpp', chapter: 6, subIndex: 5, title: 'Pointers and arrays' },
  { id: 'cpp-6.6', language: 'cpp', chapter: 6, subIndex: 6, title: 'Pointers and functions' },
  { id: 'cpp-6.7', language: 'cpp', chapter: 6, subIndex: 7, title: 'References' },
  { id: 'cpp-6.8', language: 'cpp', chapter: 6, subIndex: 8, title: 'Reference vs pointer' },
  { id: 'cpp-6.9', language: 'cpp', chapter: 6, subIndex: 9, title: 'Const references' },
  { id: 'cpp-6.10', language: 'cpp', chapter: 6, subIndex: 10, title: 'Passing large objects efficiently' },
  // Chapter 7
  { id: 'cpp-7.1', language: 'cpp', chapter: 7, subIndex: 1, title: 'Stack memory vs heap memory' },
  { id: 'cpp-7.2', language: 'cpp', chapter: 7, subIndex: 2, title: 'new and delete' },
  { id: 'cpp-7.3', language: 'cpp', chapter: 7, subIndex: 3, title: 'Dynamic allocation' },
  { id: 'cpp-7.4', language: 'cpp', chapter: 7, subIndex: 4, title: 'Memory leaks' },
  { id: 'cpp-7.5', language: 'cpp', chapter: 7, subIndex: 5, title: 'Dangling pointers' },
  { id: 'cpp-7.6', language: 'cpp', chapter: 7, subIndex: 6, title: 'Deep copy vs shallow copy' },
  { id: 'cpp-7.7', language: 'cpp', chapter: 7, subIndex: 7, title: 'Object lifetime' },
  // Chapter 8
  { id: 'cpp-8.1', language: 'cpp', chapter: 8, subIndex: 1, title: 'Class syntax' },
  { id: 'cpp-8.2', language: 'cpp', chapter: 8, subIndex: 2, title: 'Objects' },
  { id: 'cpp-8.3', language: 'cpp', chapter: 8, subIndex: 3, title: 'Access specifiers' },
  { id: 'cpp-8.4', language: 'cpp', chapter: 8, subIndex: 4, title: 'Constructors' },
  { id: 'cpp-8.5', language: 'cpp', chapter: 8, subIndex: 5, title: 'Destructor' },
  { id: 'cpp-8.6', language: 'cpp', chapter: 8, subIndex: 6, title: 'this pointer' },
  { id: 'cpp-8.7', language: 'cpp', chapter: 8, subIndex: 7, title: 'Static members' },
  { id: 'cpp-8.8', language: 'cpp', chapter: 8, subIndex: 8, title: 'Encapsulation' },
  { id: 'cpp-8.9', language: 'cpp', chapter: 8, subIndex: 9, title: 'Inheritance basics' },
  { id: 'cpp-8.10', language: 'cpp', chapter: 8, subIndex: 10, title: 'Polymorphism basics' },
  { id: 'cpp-8.11', language: 'cpp', chapter: 8, subIndex: 11, title: 'When OOP appears in DSA problems' },
  // Chapter 9
  { id: 'cpp-9.1', language: 'cpp', chapter: 9, subIndex: 1, title: 'Recursion intuition' },
  { id: 'cpp-9.2', language: 'cpp', chapter: 9, subIndex: 2, title: 'Base case' },
  { id: 'cpp-9.3', language: 'cpp', chapter: 9, subIndex: 3, title: 'Recursive case' },
  { id: 'cpp-9.4', language: 'cpp', chapter: 9, subIndex: 4, title: 'Call stack behavior' },
  { id: 'cpp-9.5', language: 'cpp', chapter: 9, subIndex: 5, title: 'Recursion on arrays' },
  { id: 'cpp-9.6', language: 'cpp', chapter: 9, subIndex: 6, title: 'Recursion on strings' },
  { id: 'cpp-9.7', language: 'cpp', chapter: 9, subIndex: 7, title: 'Recursion on linked lists' },
  { id: 'cpp-9.8', language: 'cpp', chapter: 9, subIndex: 8, title: 'Backtracking basics' },
  { id: 'cpp-9.9', language: 'cpp', chapter: 9, subIndex: 9, title: 'Common recursion mistakes' },
  { id: 'cpp-9.10', language: 'cpp', chapter: 9, subIndex: 10, title: 'Complexity of recursion' },
  // Chapter 10
  { id: 'cpp-10.1', language: 'cpp', chapter: 10, subIndex: 1, title: 'What STL is' },
  { id: 'cpp-10.2', language: 'cpp', chapter: 10, subIndex: 2, title: 'Containers, iterators, algorithms' },
  { id: 'cpp-10.3', language: 'cpp', chapter: 10, subIndex: 3, title: 'Why STL is critical for LeetCode' },
  { id: 'cpp-10.4', language: 'cpp', chapter: 10, subIndex: 4, title: 'Container selection logic' },
  { id: 'cpp-10.5', language: 'cpp', chapter: 10, subIndex: 5, title: 'Time complexity awareness' },
  // Chapter 11
  { id: 'cpp-11.1', language: 'cpp', chapter: 11, subIndex: 1, title: 'vector' },
  { id: 'cpp-11.2', language: 'cpp', chapter: 11, subIndex: 2, title: 'deque' },
  { id: 'cpp-11.3', language: 'cpp', chapter: 11, subIndex: 3, title: 'list' },
  { id: 'cpp-11.4', language: 'cpp', chapter: 11, subIndex: 4, title: 'forward_list' },
  { id: 'cpp-11.5', language: 'cpp', chapter: 11, subIndex: 5, title: 'array' },
  { id: 'cpp-11.6', language: 'cpp', chapter: 11, subIndex: 6, title: 'string as a container' },
  { id: 'cpp-11.7', language: 'cpp', chapter: 11, subIndex: 7, title: 'vector of vectors' },
  { id: 'cpp-11.8', language: 'cpp', chapter: 11, subIndex: 8, title: 'Nested sequence containers' },
  // Chapter 12
  { id: 'cpp-12.1', language: 'cpp', chapter: 12, subIndex: 1, title: 'stack' },
  { id: 'cpp-12.2', language: 'cpp', chapter: 12, subIndex: 2, title: 'queue' },
  { id: 'cpp-12.3', language: 'cpp', chapter: 12, subIndex: 3, title: 'priority_queue' },
  { id: 'cpp-12.4', language: 'cpp', chapter: 12, subIndex: 4, title: 'Heap behavior and use cases' },
  { id: 'cpp-12.5', language: 'cpp', chapter: 12, subIndex: 5, title: 'Custom comparators for heaps' },
  { id: 'cpp-12.6', language: 'cpp', chapter: 12, subIndex: 6, title: 'Typical LeetCode applications' },
  // Chapter 13
  { id: 'cpp-13.1', language: 'cpp', chapter: 13, subIndex: 1, title: 'set' },
  { id: 'cpp-13.2', language: 'cpp', chapter: 13, subIndex: 2, title: 'multiset' },
  { id: 'cpp-13.3', language: 'cpp', chapter: 13, subIndex: 3, title: 'map' },
  { id: 'cpp-13.4', language: 'cpp', chapter: 13, subIndex: 4, title: 'multimap' },
  { id: 'cpp-13.5', language: 'cpp', chapter: 13, subIndex: 5, title: 'Ordered nature and log-time operations' },
  { id: 'cpp-13.6', language: 'cpp', chapter: 13, subIndex: 6, title: 'lower_bound and upper_bound' },
  { id: 'cpp-13.7', language: 'cpp', chapter: 13, subIndex: 7, title: 'When to prefer tree-based containers' },
  // Chapter 14
  { id: 'cpp-14.1', language: 'cpp', chapter: 14, subIndex: 1, title: 'unordered_set' },
  { id: 'cpp-14.2', language: 'cpp', chapter: 14, subIndex: 2, title: 'unordered_map' },
  { id: 'cpp-14.3', language: 'cpp', chapter: 14, subIndex: 3, title: 'Hashing intuition' },
  { id: 'cpp-14.4', language: 'cpp', chapter: 14, subIndex: 4, title: 'Average O(1) operations' },
  { id: 'cpp-14.5', language: 'cpp', chapter: 14, subIndex: 5, title: 'Collision concept' },
  { id: 'cpp-14.6', language: 'cpp', chapter: 14, subIndex: 6, title: 'Frequency maps' },
  { id: 'cpp-14.7', language: 'cpp', chapter: 14, subIndex: 7, title: 'Prefix sum with hash maps' },
  // Chapter 15
  { id: 'cpp-15.1', language: 'cpp', chapter: 15, subIndex: 1, title: 'pair' },
  { id: 'cpp-15.2', language: 'cpp', chapter: 15, subIndex: 2, title: 'tuple' },
  { id: 'cpp-15.3', language: 'cpp', chapter: 15, subIndex: 3, title: 'make_pair' },
  { id: 'cpp-15.4', language: 'cpp', chapter: 15, subIndex: 4, title: 'Structured bindings' },
  { id: 'cpp-15.5', language: 'cpp', chapter: 15, subIndex: 5, title: 'Comparators' },
  { id: 'cpp-15.6', language: 'cpp', chapter: 15, subIndex: 6, title: 'Lambdas in STL' },
  { id: 'cpp-15.7', language: 'cpp', chapter: 15, subIndex: 7, title: 'auto with iterators and containers' },
  // Chapter 16
  { id: 'cpp-16.1', language: 'cpp', chapter: 16, subIndex: 1, title: 'sort()' },
  { id: 'cpp-16.2', language: 'cpp', chapter: 16, subIndex: 2, title: 'reverse()' },
  { id: 'cpp-16.3', language: 'cpp', chapter: 16, subIndex: 3, title: 'find()' },
  { id: 'cpp-16.4', language: 'cpp', chapter: 16, subIndex: 4, title: 'count()' },
  { id: 'cpp-16.5', language: 'cpp', chapter: 16, subIndex: 5, title: 'accumulate()' },
  { id: 'cpp-16.6', language: 'cpp', chapter: 16, subIndex: 6, title: 'lower_bound()' },
  { id: 'cpp-16.7', language: 'cpp', chapter: 16, subIndex: 7, title: 'upper_bound()' },
  { id: 'cpp-16.8', language: 'cpp', chapter: 16, subIndex: 8, title: 'binary_search()' },
  { id: 'cpp-16.9', language: 'cpp', chapter: 16, subIndex: 9, title: 'min_element() and max_element()' },
  { id: 'cpp-16.10', language: 'cpp', chapter: 16, subIndex: 10, title: 'next_permutation()' },
  { id: 'cpp-16.11', language: 'cpp', chapter: 16, subIndex: 11, title: 'unique()' },
  { id: 'cpp-16.12', language: 'cpp', chapter: 16, subIndex: 12, title: 'Erase-remove idiom' },
  // Chapter 17
  { id: 'cpp-17.1', language: 'cpp', chapter: 17, subIndex: 1, title: 'Singly linked list' },
  { id: 'cpp-17.2', language: 'cpp', chapter: 17, subIndex: 2, title: 'Doubly linked list' },
  { id: 'cpp-17.3', language: 'cpp', chapter: 17, subIndex: 3, title: 'Stack using array or vector' },
  { id: 'cpp-17.4', language: 'cpp', chapter: 17, subIndex: 4, title: 'Queue using array or deque' },
  { id: 'cpp-17.5', language: 'cpp', chapter: 17, subIndex: 5, title: 'Binary tree node structure' },
  { id: 'cpp-17.6', language: 'cpp', chapter: 17, subIndex: 6, title: 'Graph adjacency list' },
  { id: 'cpp-17.7', language: 'cpp', chapter: 17, subIndex: 7, title: 'Heap conceptually from array' },
  { id: 'cpp-17.8', language: 'cpp', chapter: 17, subIndex: 8, title: 'When to implement manually and when to use STL' },
  // Chapter 18
  { id: 'cpp-18.1', language: 'cpp', chapter: 18, subIndex: 1, title: 'Two pointers' },
  { id: 'cpp-18.2', language: 'cpp', chapter: 18, subIndex: 2, title: 'Sliding window' },
  { id: 'cpp-18.3', language: 'cpp', chapter: 18, subIndex: 3, title: 'Prefix sum' },
  { id: 'cpp-18.4', language: 'cpp', chapter: 18, subIndex: 4, title: 'Fast and slow pointers' },
  { id: 'cpp-18.5', language: 'cpp', chapter: 18, subIndex: 5, title: 'Monotonic stack' },
  { id: 'cpp-18.6', language: 'cpp', chapter: 18, subIndex: 6, title: 'Monotonic queue' },
  { id: 'cpp-18.7', language: 'cpp', chapter: 18, subIndex: 7, title: 'Binary search patterns' },
  { id: 'cpp-18.8', language: 'cpp', chapter: 18, subIndex: 8, title: 'DFS and BFS basics' },
  { id: 'cpp-18.9', language: 'cpp', chapter: 18, subIndex: 9, title: 'Tree traversal patterns' },
  { id: 'cpp-18.10', language: 'cpp', chapter: 18, subIndex: 10, title: 'Graph traversal patterns' },
  // Chapter 19
  { id: 'cpp-19.1', language: 'cpp', chapter: 19, subIndex: 1, title: 'Read constraints first' },
  { id: 'cpp-19.2', language: 'cpp', chapter: 19, subIndex: 2, title: 'Identify the pattern' },
  { id: 'cpp-19.3', language: 'cpp', chapter: 19, subIndex: 3, title: 'Choose the right container' },
  { id: 'cpp-19.4', language: 'cpp', chapter: 19, subIndex: 4, title: 'Write brute force first' },
  { id: 'cpp-19.5', language: 'cpp', chapter: 19, subIndex: 5, title: 'Optimize step by step' },
  { id: 'cpp-19.6', language: 'cpp', chapter: 19, subIndex: 6, title: 'Dry run on paper' },
  { id: 'cpp-19.7', language: 'cpp', chapter: 19, subIndex: 7, title: 'Handle edge cases' },
  { id: 'cpp-19.8', language: 'cpp', chapter: 19, subIndex: 8, title: 'Debug syntax separately from logic' },
  { id: 'cpp-19.9', language: 'cpp', chapter: 19, subIndex: 9, title: 'Build a personal syntax cheat sheet' },
  { id: 'cpp-19.10', language: 'cpp', chapter: 19, subIndex: 10, title: 'Maintain a revision list of mistakes' },
];

// ---------------------------------------------------------------------------
// Java — 18 chapters (ch 18 is a goal summary → 17 trackable chapters)
// ---------------------------------------------------------------------------
const javaChapters: Day0to1Chapter[] = [
  { chapter: 1, title: 'Java Setup and Core Syntax', language: 'java' },
  { chapter: 2, title: 'Variables, Data Types, and Operators', language: 'java' },
  { chapter: 3, title: 'Control Flow', language: 'java' },
  { chapter: 4, title: 'Functions and Methods', language: 'java' },
  { chapter: 5, title: 'Arrays and Strings', language: 'java' },
  { chapter: 6, title: 'OOP Fundamentals', language: 'java' },
  { chapter: 7, title: 'Recursion and Backtracking', language: 'java' },
  { chapter: 8, title: 'Java Collection Framework Foundations', language: 'java' },
  { chapter: 9, title: 'List Implementations', language: 'java' },
  { chapter: 10, title: 'Stack and Queue', language: 'java' },
  { chapter: 11, title: 'Priority Queue and Heap', language: 'java' },
  { chapter: 12, title: 'Set and Map Collections', language: 'java' },
  { chapter: 13, title: 'Queue Variants and Deque', language: 'java' },
  { chapter: 14, title: 'Utility Classes and Helpers', language: 'java' },
  { chapter: 15, title: 'Building Data Structures from Scratch', language: 'java' },
  { chapter: 16, title: 'Core DSA Patterns', language: 'java' },
  { chapter: 17, title: 'LeetCode Readiness Checklist', language: 'java' },
];

const javaTopics: Omit<Day0to1Topic, 'chapterTitle'>[] = [
  // Chapter 1
  { id: 'java-1.1', language: 'java', chapter: 1, subIndex: 1, title: 'Java program structure' },
  { id: 'java-1.2', language: 'java', chapter: 1, subIndex: 2, title: 'class and main()' },
  { id: 'java-1.3', language: 'java', chapter: 1, subIndex: 3, title: 'public static void main(String[] args)' },
  { id: 'java-1.4', language: 'java', chapter: 1, subIndex: 4, title: 'System.out.println() and input methods' },
  { id: 'java-1.5', language: 'java', chapter: 1, subIndex: 5, title: 'Comments and formatting' },
  { id: 'java-1.6', language: 'java', chapter: 1, subIndex: 6, title: 'Compilation and execution flow' },
  { id: 'java-1.7', language: 'java', chapter: 1, subIndex: 7, title: 'Common syntax mistakes in Java submissions' },
  // Chapter 2
  { id: 'java-2.1', language: 'java', chapter: 2, subIndex: 1, title: 'Primitive data types' },
  { id: 'java-2.2', language: 'java', chapter: 2, subIndex: 2, title: 'int, long, float, double, char, boolean' },
  { id: 'java-2.3', language: 'java', chapter: 2, subIndex: 3, title: 'Wrapper classes' },
  { id: 'java-2.4', language: 'java', chapter: 2, subIndex: 4, title: 'Type casting' },
  { id: 'java-2.5', language: 'java', chapter: 2, subIndex: 5, title: 'final keyword' },
  { id: 'java-2.6', language: 'java', chapter: 2, subIndex: 6, title: 'Arithmetic operators' },
  { id: 'java-2.7', language: 'java', chapter: 2, subIndex: 7, title: 'Relational operators' },
  { id: 'java-2.8', language: 'java', chapter: 2, subIndex: 8, title: 'Logical operators' },
  { id: 'java-2.9', language: 'java', chapter: 2, subIndex: 9, title: 'Bitwise operators' },
  { id: 'java-2.10', language: 'java', chapter: 2, subIndex: 10, title: 'Operator precedence' },
  { id: 'java-2.11', language: 'java', chapter: 2, subIndex: 11, title: 'Integer overflow awareness' },
  // Chapter 3
  { id: 'java-3.1', language: 'java', chapter: 3, subIndex: 1, title: 'if, else if, else' },
  { id: 'java-3.2', language: 'java', chapter: 3, subIndex: 2, title: 'Nested conditions' },
  { id: 'java-3.3', language: 'java', chapter: 3, subIndex: 3, title: 'switch' },
  { id: 'java-3.4', language: 'java', chapter: 3, subIndex: 4, title: 'for loop' },
  { id: 'java-3.5', language: 'java', chapter: 3, subIndex: 5, title: 'Enhanced for-each loop' },
  { id: 'java-3.6', language: 'java', chapter: 3, subIndex: 6, title: 'while loop' },
  { id: 'java-3.7', language: 'java', chapter: 3, subIndex: 7, title: 'do-while loop' },
  { id: 'java-3.8', language: 'java', chapter: 3, subIndex: 8, title: 'break, continue, return' },
  { id: 'java-3.9', language: 'java', chapter: 3, subIndex: 9, title: 'Loop patterns used in DSA' },
  // Chapter 4
  { id: 'java-4.1', language: 'java', chapter: 4, subIndex: 1, title: 'Method declaration and calling' },
  { id: 'java-4.2', language: 'java', chapter: 4, subIndex: 2, title: 'Parameters and return values' },
  { id: 'java-4.3', language: 'java', chapter: 4, subIndex: 3, title: 'Method overloading' },
  { id: 'java-4.4', language: 'java', chapter: 4, subIndex: 4, title: 'Pass-by-value in Java' },
  { id: 'java-4.5', language: 'java', chapter: 4, subIndex: 5, title: 'Scope of variables' },
  { id: 'java-4.6', language: 'java', chapter: 4, subIndex: 6, title: 'Static methods' },
  { id: 'java-4.7', language: 'java', chapter: 4, subIndex: 7, title: 'Utility/helper methods for LeetCode' },
  { id: 'java-4.8', language: 'java', chapter: 4, subIndex: 8, title: 'Method signatures and return types' },
  { id: 'java-4.9', language: 'java', chapter: 4, subIndex: 9, title: 'Reusable recursive helpers' },
  // Chapter 5
  { id: 'java-5.1', language: 'java', chapter: 5, subIndex: 1, title: 'One-dimensional arrays' },
  { id: 'java-5.2', language: 'java', chapter: 5, subIndex: 2, title: 'Two-dimensional arrays' },
  { id: 'java-5.3', language: 'java', chapter: 5, subIndex: 3, title: 'Array traversal' },
  { id: 'java-5.4', language: 'java', chapter: 5, subIndex: 4, title: 'ArrayList vs array' },
  { id: 'java-5.5', language: 'java', chapter: 5, subIndex: 5, title: 'String basics' },
  { id: 'java-5.6', language: 'java', chapter: 5, subIndex: 6, title: 'StringBuilder and StringBuffer' },
  { id: 'java-5.7', language: 'java', chapter: 5, subIndex: 7, title: 'Substrings' },
  { id: 'java-5.8', language: 'java', chapter: 5, subIndex: 8, title: 'String comparison' },
  { id: 'java-5.9', language: 'java', chapter: 5, subIndex: 9, title: 'Character arrays and conversion' },
  { id: 'java-5.10', language: 'java', chapter: 5, subIndex: 10, title: 'Frequency counting' },
  { id: 'java-5.11', language: 'java', chapter: 5, subIndex: 11, title: 'Common string manipulation problems' },
  // Chapter 6
  { id: 'java-6.1', language: 'java', chapter: 6, subIndex: 1, title: 'Classes and objects' },
  { id: 'java-6.2', language: 'java', chapter: 6, subIndex: 2, title: 'Fields and methods' },
  { id: 'java-6.3', language: 'java', chapter: 6, subIndex: 3, title: 'Access modifiers' },
  { id: 'java-6.4', language: 'java', chapter: 6, subIndex: 4, title: 'Constructors' },
  { id: 'java-6.5', language: 'java', chapter: 6, subIndex: 5, title: 'Constructor overloading' },
  { id: 'java-6.6', language: 'java', chapter: 6, subIndex: 6, title: 'this keyword' },
  { id: 'java-6.7', language: 'java', chapter: 6, subIndex: 7, title: 'static members' },
  { id: 'java-6.8', language: 'java', chapter: 6, subIndex: 8, title: 'final keyword in classes, methods, variables' },
  { id: 'java-6.9', language: 'java', chapter: 6, subIndex: 9, title: 'Inheritance' },
  { id: 'java-6.10', language: 'java', chapter: 6, subIndex: 10, title: 'Polymorphism' },
  { id: 'java-6.11', language: 'java', chapter: 6, subIndex: 11, title: 'Abstraction' },
  { id: 'java-6.12', language: 'java', chapter: 6, subIndex: 12, title: 'Encapsulation' },
  { id: 'java-6.13', language: 'java', chapter: 6, subIndex: 13, title: 'Interfaces' },
  { id: 'java-6.14', language: 'java', chapter: 6, subIndex: 14, title: 'Abstract classes' },
  { id: 'java-6.15', language: 'java', chapter: 6, subIndex: 15, title: 'Inner classes basics' },
  { id: 'java-6.16', language: 'java', chapter: 6, subIndex: 16, title: 'OOP relevance in DSA solutions' },
  // Chapter 7
  { id: 'java-7.1', language: 'java', chapter: 7, subIndex: 1, title: 'Recursion intuition' },
  { id: 'java-7.2', language: 'java', chapter: 7, subIndex: 2, title: 'Base case' },
  { id: 'java-7.3', language: 'java', chapter: 7, subIndex: 3, title: 'Recursive case' },
  { id: 'java-7.4', language: 'java', chapter: 7, subIndex: 4, title: 'Call stack behavior' },
  { id: 'java-7.5', language: 'java', chapter: 7, subIndex: 5, title: 'Recursion on arrays' },
  { id: 'java-7.6', language: 'java', chapter: 7, subIndex: 6, title: 'Recursion on strings' },
  { id: 'java-7.7', language: 'java', chapter: 7, subIndex: 7, title: 'Recursion on linked lists' },
  { id: 'java-7.8', language: 'java', chapter: 7, subIndex: 8, title: 'Backtracking basics' },
  { id: 'java-7.9', language: 'java', chapter: 7, subIndex: 9, title: 'Common recursion mistakes' },
  { id: 'java-7.10', language: 'java', chapter: 7, subIndex: 10, title: 'Recursion complexity' },
  // Chapter 8
  { id: 'java-8.1', language: 'java', chapter: 8, subIndex: 1, title: 'What the Collection Framework is' },
  { id: 'java-8.2', language: 'java', chapter: 8, subIndex: 2, title: 'Interfaces and implementations' },
  { id: 'java-8.3', language: 'java', chapter: 8, subIndex: 3, title: 'List, Set, Queue, Map overview' },
  { id: 'java-8.4', language: 'java', chapter: 8, subIndex: 4, title: 'Generic types' },
  { id: 'java-8.5', language: 'java', chapter: 8, subIndex: 5, title: 'Iterators' },
  { id: 'java-8.6', language: 'java', chapter: 8, subIndex: 6, title: 'Comparable and Comparator' },
  { id: 'java-8.7', language: 'java', chapter: 8, subIndex: 7, title: 'Why collections matter in LeetCode' },
  // Chapter 9
  { id: 'java-9.1', language: 'java', chapter: 9, subIndex: 1, title: 'ArrayList' },
  { id: 'java-9.2', language: 'java', chapter: 9, subIndex: 2, title: 'LinkedList' },
  { id: 'java-9.3', language: 'java', chapter: 9, subIndex: 3, title: 'Vector' },
  { id: 'java-9.4', language: 'java', chapter: 9, subIndex: 4, title: 'Stack legacy class overview' },
  { id: 'java-9.5', language: 'java', chapter: 9, subIndex: 5, title: 'Adding, removing, accessing elements' },
  { id: 'java-9.6', language: 'java', chapter: 9, subIndex: 6, title: 'Traversing lists' },
  { id: 'java-9.7', language: 'java', chapter: 9, subIndex: 7, title: 'List use cases in DSA' },
  { id: 'java-9.8', language: 'java', chapter: 9, subIndex: 8, title: 'When to prefer ArrayList over LinkedList' },
  // Chapter 10
  { id: 'java-10.1', language: 'java', chapter: 10, subIndex: 1, title: 'Stack concept' },
  { id: 'java-10.2', language: 'java', chapter: 10, subIndex: 2, title: 'Stack class basics' },
  { id: 'java-10.3', language: 'java', chapter: 10, subIndex: 3, title: 'push(), pop(), peek()' },
  { id: 'java-10.4', language: 'java', chapter: 10, subIndex: 4, title: 'Queue interface' },
  { id: 'java-10.5', language: 'java', chapter: 10, subIndex: 5, title: 'LinkedList as queue implementation' },
  { id: 'java-10.6', language: 'java', chapter: 10, subIndex: 6, title: 'ArrayDeque as stack and queue' },
  { id: 'java-10.7', language: 'java', chapter: 10, subIndex: 7, title: 'offer(), poll(), peek()' },
  { id: 'java-10.8', language: 'java', chapter: 10, subIndex: 8, title: 'FIFO and LIFO behavior' },
  { id: 'java-10.9', language: 'java', chapter: 10, subIndex: 9, title: 'Stack and queue problems in LeetCode' },
  { id: 'java-10.10', language: 'java', chapter: 10, subIndex: 10, title: 'Monotonic stack and deque usage' },
  // Chapter 11
  { id: 'java-11.1', language: 'java', chapter: 11, subIndex: 1, title: 'Heap concept' },
  { id: 'java-11.2', language: 'java', chapter: 11, subIndex: 2, title: 'PriorityQueue in Java' },
  { id: 'java-11.3', language: 'java', chapter: 11, subIndex: 3, title: 'Min heap by default' },
  { id: 'java-11.4', language: 'java', chapter: 11, subIndex: 4, title: 'Max heap with comparator' },
  { id: 'java-11.5', language: 'java', chapter: 11, subIndex: 5, title: 'offer(), poll(), peek()' },
  { id: 'java-11.6', language: 'java', chapter: 11, subIndex: 6, title: 'Custom comparators' },
  { id: 'java-11.7', language: 'java', chapter: 11, subIndex: 7, title: 'Pair-like handling with custom objects' },
  { id: 'java-11.8', language: 'java', chapter: 11, subIndex: 8, title: 'Top K problems' },
  { id: 'java-11.9', language: 'java', chapter: 11, subIndex: 9, title: 'Kth largest and smallest elements' },
  { id: 'java-11.10', language: 'java', chapter: 11, subIndex: 10, title: 'Heap use in greedy and graph problems' },
  // Chapter 12
  { id: 'java-12.1', language: 'java', chapter: 12, subIndex: 1, title: 'HashSet' },
  { id: 'java-12.2', language: 'java', chapter: 12, subIndex: 2, title: 'LinkedHashSet' },
  { id: 'java-12.3', language: 'java', chapter: 12, subIndex: 3, title: 'TreeSet' },
  { id: 'java-12.4', language: 'java', chapter: 12, subIndex: 4, title: 'HashMap' },
  { id: 'java-12.5', language: 'java', chapter: 12, subIndex: 5, title: 'LinkedHashMap' },
  { id: 'java-12.6', language: 'java', chapter: 12, subIndex: 6, title: 'TreeMap' },
  { id: 'java-12.7', language: 'java', chapter: 12, subIndex: 7, title: 'put(), get(), containsKey()' },
  { id: 'java-12.8', language: 'java', chapter: 12, subIndex: 8, title: 'remove() and iteration' },
  { id: 'java-12.9', language: 'java', chapter: 12, subIndex: 9, title: 'Sorted vs unsorted collections' },
  { id: 'java-12.10', language: 'java', chapter: 12, subIndex: 10, title: 'Frequency map patterns' },
  { id: 'java-12.11', language: 'java', chapter: 12, subIndex: 11, title: 'Prefix sum with HashMap' },
  { id: 'java-12.12', language: 'java', chapter: 12, subIndex: 12, title: 'lowerKey() and higherKey() in sorted maps' },
  // Chapter 13
  { id: 'java-13.1', language: 'java', chapter: 13, subIndex: 1, title: 'ArrayDeque' },
  { id: 'java-13.2', language: 'java', chapter: 13, subIndex: 2, title: 'Double-ended queue concept' },
  { id: 'java-13.3', language: 'java', chapter: 13, subIndex: 3, title: 'addFirst(), addLast()' },
  { id: 'java-13.4', language: 'java', chapter: 13, subIndex: 4, title: 'removeFirst(), removeLast()' },
  { id: 'java-13.5', language: 'java', chapter: 13, subIndex: 5, title: 'Deque in sliding window problems' },
  { id: 'java-13.6', language: 'java', chapter: 13, subIndex: 6, title: 'Monotonic deque' },
  { id: 'java-13.7', language: 'java', chapter: 13, subIndex: 7, title: 'Queue vs deque vs priority queue' },
  // Chapter 14
  { id: 'java-14.1', language: 'java', chapter: 14, subIndex: 1, title: 'Pair alternative patterns in Java' },
  { id: 'java-14.2', language: 'java', chapter: 14, subIndex: 2, title: 'Custom node classes' },
  { id: 'java-14.3', language: 'java', chapter: 14, subIndex: 3, title: 'Comparator implementation' },
  { id: 'java-14.4', language: 'java', chapter: 14, subIndex: 4, title: 'Comparable implementation' },
  { id: 'java-14.5', language: 'java', chapter: 14, subIndex: 5, title: 'Anonymous classes and lambdas' },
  { id: 'java-14.6', language: 'java', chapter: 14, subIndex: 6, title: 'Arrays utility class' },
  { id: 'java-14.7', language: 'java', chapter: 14, subIndex: 7, title: 'Collections utility class' },
  { id: 'java-14.8', language: 'java', chapter: 14, subIndex: 8, title: 'Arrays.sort() and Collections.sort()' },
  // Chapter 15
  { id: 'java-15.1', language: 'java', chapter: 15, subIndex: 1, title: 'Singly linked list' },
  { id: 'java-15.2', language: 'java', chapter: 15, subIndex: 2, title: 'Doubly linked list' },
  { id: 'java-15.3', language: 'java', chapter: 15, subIndex: 3, title: 'Custom stack' },
  { id: 'java-15.4', language: 'java', chapter: 15, subIndex: 4, title: 'Custom queue' },
  { id: 'java-15.5', language: 'java', chapter: 15, subIndex: 5, title: 'Binary tree node class' },
  { id: 'java-15.6', language: 'java', chapter: 15, subIndex: 6, title: 'Graph adjacency list' },
  { id: 'java-15.7', language: 'java', chapter: 15, subIndex: 7, title: 'Heap from array conceptually' },
  { id: 'java-15.8', language: 'java', chapter: 15, subIndex: 8, title: 'Design tradeoff between custom and built-in structures' },
  // Chapter 16
  { id: 'java-16.1', language: 'java', chapter: 16, subIndex: 1, title: 'Two pointers' },
  { id: 'java-16.2', language: 'java', chapter: 16, subIndex: 2, title: 'Sliding window' },
  { id: 'java-16.3', language: 'java', chapter: 16, subIndex: 3, title: 'Prefix sum' },
  { id: 'java-16.4', language: 'java', chapter: 16, subIndex: 4, title: 'Fast and slow pointers' },
  { id: 'java-16.5', language: 'java', chapter: 16, subIndex: 5, title: 'Monotonic stack' },
  { id: 'java-16.6', language: 'java', chapter: 16, subIndex: 6, title: 'Monotonic queue' },
  { id: 'java-16.7', language: 'java', chapter: 16, subIndex: 7, title: 'Binary search patterns' },
  { id: 'java-16.8', language: 'java', chapter: 16, subIndex: 8, title: 'DFS and BFS' },
  { id: 'java-16.9', language: 'java', chapter: 16, subIndex: 9, title: 'Tree traversal patterns' },
  { id: 'java-16.10', language: 'java', chapter: 16, subIndex: 10, title: 'Graph traversal patterns' },
  // Chapter 17
  { id: 'java-17.1', language: 'java', chapter: 17, subIndex: 1, title: 'Understand the problem statement' },
  { id: 'java-17.2', language: 'java', chapter: 17, subIndex: 2, title: 'Read constraints carefully' },
  { id: 'java-17.3', language: 'java', chapter: 17, subIndex: 3, title: 'Choose the correct Java collection' },
  { id: 'java-17.4', language: 'java', chapter: 17, subIndex: 4, title: 'Draft brute force first' },
  { id: 'java-17.5', language: 'java', chapter: 17, subIndex: 5, title: 'Optimize iteratively' },
  { id: 'java-17.6', language: 'java', chapter: 17, subIndex: 6, title: 'Dry run sample inputs' },
  { id: 'java-17.7', language: 'java', chapter: 17, subIndex: 7, title: 'Handle edge cases' },
  { id: 'java-17.8', language: 'java', chapter: 17, subIndex: 8, title: 'Keep syntax and logic debugging separate' },
  { id: 'java-17.9', language: 'java', chapter: 17, subIndex: 9, title: 'Build a Java snippet notebook' },
  { id: 'java-17.10', language: 'java', chapter: 17, subIndex: 10, title: 'Keep a container cheat sheet' },
];

// ---------------------------------------------------------------------------
// Python — 16 chapters (ch 16 is a goal summary → 15 trackable chapters)
// ---------------------------------------------------------------------------
const pythonChapters: Day0to1Chapter[] = [
  { chapter: 1, title: 'Python Setup and Core Syntax', language: 'python' },
  { chapter: 2, title: 'Data Types, Operators, and Control Flow', language: 'python' },
  { chapter: 3, title: 'Functions', language: 'python' },
  { chapter: 4, title: 'Lists and Strings', language: 'python' },
  { chapter: 5, title: 'Tuples, Sets, and Dictionaries', language: 'python' },
  { chapter: 6, title: 'Recursion and Backtracking', language: 'python' },
  { chapter: 7, title: 'Object-Oriented Programming', language: 'python' },
  { chapter: 8, title: 'Built-in DSA Containers', language: 'python' },
  { chapter: 9, title: 'Stack, Queue, and Deque', language: 'python' },
  { chapter: 10, title: 'Heap and Priority Queue', language: 'python' },
  { chapter: 11, title: 'Searching and Sorting Helpers', language: 'python' },
  { chapter: 12, title: 'Building Data Structures from Scratch', language: 'python' },
  { chapter: 13, title: 'Trees and Graph Basics', language: 'python' },
  { chapter: 14, title: 'Core DSA Patterns', language: 'python' },
  { chapter: 15, title: 'Python-Specific LeetCode Readiness', language: 'python' },
];

const pythonTopics: Omit<Day0to1Topic, 'chapterTitle'>[] = [
  // Chapter 1
  { id: 'python-1.1', language: 'python', chapter: 1, subIndex: 1, title: 'Python program structure' },
  { id: 'python-1.2', language: 'python', chapter: 1, subIndex: 2, title: 'Indentation and blocks' },
  { id: 'python-1.3', language: 'python', chapter: 1, subIndex: 3, title: 'Variables and dynamic typing' },
  { id: 'python-1.4', language: 'python', chapter: 1, subIndex: 4, title: 'print() and input handling' },
  { id: 'python-1.5', language: 'python', chapter: 1, subIndex: 5, title: 'Comments and formatting' },
  { id: 'python-1.6', language: 'python', chapter: 1, subIndex: 6, title: 'Running scripts and notebook usage' },
  { id: 'python-1.7', language: 'python', chapter: 1, subIndex: 7, title: 'Common syntax mistakes in Python submissions' },
  // Chapter 2
  { id: 'python-2.1', language: 'python', chapter: 2, subIndex: 1, title: 'Integers, floats, strings, booleans' },
  { id: 'python-2.2', language: 'python', chapter: 2, subIndex: 2, title: 'None' },
  { id: 'python-2.3', language: 'python', chapter: 2, subIndex: 3, title: 'Lists, tuples, sets, dictionaries overview' },
  { id: 'python-2.4', language: 'python', chapter: 2, subIndex: 4, title: 'Arithmetic operators' },
  { id: 'python-2.5', language: 'python', chapter: 2, subIndex: 5, title: 'Relational operators' },
  { id: 'python-2.6', language: 'python', chapter: 2, subIndex: 6, title: 'Logical operators' },
  { id: 'python-2.7', language: 'python', chapter: 2, subIndex: 7, title: 'Membership operators' },
  { id: 'python-2.8', language: 'python', chapter: 2, subIndex: 8, title: 'Identity operators' },
  { id: 'python-2.9', language: 'python', chapter: 2, subIndex: 9, title: 'if, elif, else' },
  { id: 'python-2.10', language: 'python', chapter: 2, subIndex: 10, title: 'for loop' },
  { id: 'python-2.11', language: 'python', chapter: 2, subIndex: 11, title: 'while loop' },
  { id: 'python-2.12', language: 'python', chapter: 2, subIndex: 12, title: 'break, continue, pass' },
  { id: 'python-2.13', language: 'python', chapter: 2, subIndex: 13, title: 'Range-based iteration' },
  { id: 'python-2.14', language: 'python', chapter: 2, subIndex: 14, title: 'Loop patterns used in DSA' },
  // Chapter 3
  { id: 'python-3.1', language: 'python', chapter: 3, subIndex: 1, title: 'Function definition' },
  { id: 'python-3.2', language: 'python', chapter: 3, subIndex: 2, title: 'Parameters and return values' },
  { id: 'python-3.3', language: 'python', chapter: 3, subIndex: 3, title: 'Default arguments' },
  { id: 'python-3.4', language: 'python', chapter: 3, subIndex: 4, title: 'Positional and keyword arguments' },
  { id: 'python-3.5', language: 'python', chapter: 3, subIndex: 5, title: 'Variable scope' },
  { id: 'python-3.6', language: 'python', chapter: 3, subIndex: 6, title: 'Nested functions' },
  { id: 'python-3.7', language: 'python', chapter: 3, subIndex: 7, title: 'Lambda functions' },
  { id: 'python-3.8', language: 'python', chapter: 3, subIndex: 8, title: 'Helper functions for LeetCode' },
  { id: 'python-3.9', language: 'python', chapter: 3, subIndex: 9, title: 'Recursion-friendly function design' },
  // Chapter 4
  { id: 'python-4.1', language: 'python', chapter: 4, subIndex: 1, title: 'Python list basics' },
  { id: 'python-4.2', language: 'python', chapter: 4, subIndex: 2, title: 'List traversal' },
  { id: 'python-4.3', language: 'python', chapter: 4, subIndex: 3, title: 'Append, insert, pop, remove' },
  { id: 'python-4.4', language: 'python', chapter: 4, subIndex: 4, title: 'Slicing' },
  { id: 'python-4.5', language: 'python', chapter: 4, subIndex: 5, title: 'Nested lists' },
  { id: 'python-4.6', language: 'python', chapter: 4, subIndex: 6, title: 'string basics' },
  { id: 'python-4.7', language: 'python', chapter: 4, subIndex: 7, title: 'String immutability' },
  { id: 'python-4.8', language: 'python', chapter: 4, subIndex: 8, title: 'Substrings and slicing' },
  { id: 'python-4.9', language: 'python', chapter: 4, subIndex: 9, title: 'Concatenation and join' },
  { id: 'python-4.10', language: 'python', chapter: 4, subIndex: 10, title: 'Character frequency counting' },
  { id: 'python-4.11', language: 'python', chapter: 4, subIndex: 11, title: 'Palindrome checks' },
  { id: 'python-4.12', language: 'python', chapter: 4, subIndex: 12, title: 'Common string manipulation problems' },
  // Chapter 5
  { id: 'python-5.1', language: 'python', chapter: 5, subIndex: 1, title: 'Tuple basics' },
  { id: 'python-5.2', language: 'python', chapter: 5, subIndex: 2, title: 'When to use tuples' },
  { id: 'python-5.3', language: 'python', chapter: 5, subIndex: 3, title: 'Set basics' },
  { id: 'python-5.4', language: 'python', chapter: 5, subIndex: 4, title: 'Add, remove, membership checks' },
  { id: 'python-5.5', language: 'python', chapter: 5, subIndex: 5, title: 'Dictionary basics' },
  { id: 'python-5.6', language: 'python', chapter: 5, subIndex: 6, title: 'Key-value access' },
  { id: 'python-5.7', language: 'python', chapter: 5, subIndex: 7, title: 'get(), keys(), values(), items()' },
  { id: 'python-5.8', language: 'python', chapter: 5, subIndex: 8, title: 'Frequency maps' },
  { id: 'python-5.9', language: 'python', chapter: 5, subIndex: 9, title: 'Nested dictionaries' },
  { id: 'python-5.10', language: 'python', chapter: 5, subIndex: 10, title: 'defaultdict use cases' },
  { id: 'python-5.11', language: 'python', chapter: 5, subIndex: 11, title: 'Counter use cases' },
  { id: 'python-5.12', language: 'python', chapter: 5, subIndex: 12, title: 'setdefault() and collections patterns' },
  // Chapter 6
  { id: 'python-6.1', language: 'python', chapter: 6, subIndex: 1, title: 'Recursion intuition' },
  { id: 'python-6.2', language: 'python', chapter: 6, subIndex: 2, title: 'Base case' },
  { id: 'python-6.3', language: 'python', chapter: 6, subIndex: 3, title: 'Recursive case' },
  { id: 'python-6.4', language: 'python', chapter: 6, subIndex: 4, title: 'Call stack behavior' },
  { id: 'python-6.5', language: 'python', chapter: 6, subIndex: 5, title: 'Recursion on lists' },
  { id: 'python-6.6', language: 'python', chapter: 6, subIndex: 6, title: 'Recursion on strings' },
  { id: 'python-6.7', language: 'python', chapter: 6, subIndex: 7, title: 'Recursion on linked lists' },
  { id: 'python-6.8', language: 'python', chapter: 6, subIndex: 8, title: 'Backtracking basics' },
  { id: 'python-6.9', language: 'python', chapter: 6, subIndex: 9, title: 'Common recursion mistakes' },
  { id: 'python-6.10', language: 'python', chapter: 6, subIndex: 10, title: 'Recursion complexity' },
  // Chapter 7
  { id: 'python-7.1', language: 'python', chapter: 7, subIndex: 1, title: 'Classes and objects' },
  { id: 'python-7.2', language: 'python', chapter: 7, subIndex: 2, title: '__init__ constructor' },
  { id: 'python-7.3', language: 'python', chapter: 7, subIndex: 3, title: 'Instance attributes' },
  { id: 'python-7.4', language: 'python', chapter: 7, subIndex: 4, title: 'Class attributes' },
  { id: 'python-7.5', language: 'python', chapter: 7, subIndex: 5, title: 'Methods' },
  { id: 'python-7.6', language: 'python', chapter: 7, subIndex: 6, title: 'self keyword' },
  { id: 'python-7.7', language: 'python', chapter: 7, subIndex: 7, title: 'Access conventions' },
  { id: 'python-7.8', language: 'python', chapter: 7, subIndex: 8, title: 'Inheritance' },
  { id: 'python-7.9', language: 'python', chapter: 7, subIndex: 9, title: 'Polymorphism basics' },
  { id: 'python-7.10', language: 'python', chapter: 7, subIndex: 10, title: 'Encapsulation concepts' },
  { id: 'python-7.11', language: 'python', chapter: 7, subIndex: 11, title: 'When OOP matters in DSA problems' },
  // Chapter 8
  { id: 'python-8.1', language: 'python', chapter: 8, subIndex: 1, title: 'Python list as dynamic array' },
  { id: 'python-8.2', language: 'python', chapter: 8, subIndex: 2, title: 'collections.deque' },
  { id: 'python-8.3', language: 'python', chapter: 8, subIndex: 3, title: 'collections.defaultdict' },
  { id: 'python-8.4', language: 'python', chapter: 8, subIndex: 4, title: 'collections.Counter' },
  { id: 'python-8.5', language: 'python', chapter: 8, subIndex: 5, title: 'heapq' },
  { id: 'python-8.6', language: 'python', chapter: 8, subIndex: 6, title: 'bisect' },
  { id: 'python-8.7', language: 'python', chapter: 8, subIndex: 7, title: 'dict as hash map' },
  { id: 'python-8.8', language: 'python', chapter: 8, subIndex: 8, title: 'set as hash set' },
  { id: 'python-8.9', language: 'python', chapter: 8, subIndex: 9, title: 'Which built-in to use in which problem' },
  // Chapter 9
  { id: 'python-9.1', language: 'python', chapter: 9, subIndex: 1, title: 'Stack concept' },
  { id: 'python-9.2', language: 'python', chapter: 9, subIndex: 2, title: 'Stack using Python list' },
  { id: 'python-9.3', language: 'python', chapter: 9, subIndex: 3, title: 'append() and pop()' },
  { id: 'python-9.4', language: 'python', chapter: 9, subIndex: 4, title: 'Queue concept' },
  { id: 'python-9.5', language: 'python', chapter: 9, subIndex: 5, title: 'collections.deque for queue behavior' },
  { id: 'python-9.6', language: 'python', chapter: 9, subIndex: 6, title: 'popleft() and appendleft()' },
  { id: 'python-9.7', language: 'python', chapter: 9, subIndex: 7, title: 'Deque for sliding window problems' },
  { id: 'python-9.8', language: 'python', chapter: 9, subIndex: 8, title: 'Monotonic stack' },
  { id: 'python-9.9', language: 'python', chapter: 9, subIndex: 9, title: 'Monotonic deque' },
  { id: 'python-9.10', language: 'python', chapter: 9, subIndex: 10, title: 'Parentheses and next greater element problems' },
  // Chapter 10
  { id: 'python-10.1', language: 'python', chapter: 10, subIndex: 1, title: 'Heap concept' },
  { id: 'python-10.2', language: 'python', chapter: 10, subIndex: 2, title: 'heapq module' },
  { id: 'python-10.3', language: 'python', chapter: 10, subIndex: 3, title: 'Min heap behavior' },
  { id: 'python-10.4', language: 'python', chapter: 10, subIndex: 4, title: 'Simulating max heap' },
  { id: 'python-10.5', language: 'python', chapter: 10, subIndex: 5, title: 'heappush() and heappop()' },
  { id: 'python-10.6', language: 'python', chapter: 10, subIndex: 6, title: 'heapify()' },
  { id: 'python-10.7', language: 'python', chapter: 10, subIndex: 7, title: 'Top K problems' },
  { id: 'python-10.8', language: 'python', chapter: 10, subIndex: 8, title: 'Kth largest and smallest' },
  { id: 'python-10.9', language: 'python', chapter: 10, subIndex: 9, title: 'Heap use in greedy and graph problems' },
  // Chapter 11
  { id: 'python-11.1', language: 'python', chapter: 11, subIndex: 1, title: 'Linear search' },
  { id: 'python-11.2', language: 'python', chapter: 11, subIndex: 2, title: 'Binary search concept' },
  { id: 'python-11.3', language: 'python', chapter: 11, subIndex: 3, title: 'bisect_left()' },
  { id: 'python-11.4', language: 'python', chapter: 11, subIndex: 4, title: 'bisect_right()' },
  { id: 'python-11.5', language: 'python', chapter: 11, subIndex: 5, title: 'Sorting with sorted()' },
  { id: 'python-11.6', language: 'python', chapter: 11, subIndex: 6, title: 'In-place list.sort()' },
  { id: 'python-11.7', language: 'python', chapter: 11, subIndex: 7, title: 'Key functions' },
  { id: 'python-11.8', language: 'python', chapter: 11, subIndex: 8, title: 'Sorting tuples and custom keys' },
  { id: 'python-11.9', language: 'python', chapter: 11, subIndex: 9, title: 'Comparator-style thinking in Python' },
  // Chapter 12
  { id: 'python-12.1', language: 'python', chapter: 12, subIndex: 1, title: 'Singly linked list' },
  { id: 'python-12.2', language: 'python', chapter: 12, subIndex: 2, title: 'Doubly linked list' },
  { id: 'python-12.3', language: 'python', chapter: 12, subIndex: 3, title: 'Stack from list' },
  { id: 'python-12.4', language: 'python', chapter: 12, subIndex: 4, title: 'Queue from deque' },
  { id: 'python-12.5', language: 'python', chapter: 12, subIndex: 5, title: 'Binary tree node' },
  { id: 'python-12.6', language: 'python', chapter: 12, subIndex: 6, title: 'Graph adjacency list' },
  { id: 'python-12.7', language: 'python', chapter: 12, subIndex: 7, title: 'Heap conceptually from array' },
  { id: 'python-12.8', language: 'python', chapter: 12, subIndex: 8, title: 'When to implement manually and when to use built-ins' },
  // Chapter 13
  { id: 'python-13.1', language: 'python', chapter: 13, subIndex: 1, title: 'Tree terminology' },
  { id: 'python-13.2', language: 'python', chapter: 13, subIndex: 2, title: 'Binary tree node structure' },
  { id: 'python-13.3', language: 'python', chapter: 13, subIndex: 3, title: 'Traversal concepts' },
  { id: 'python-13.4', language: 'python', chapter: 13, subIndex: 4, title: 'Preorder, inorder, postorder' },
  { id: 'python-13.5', language: 'python', chapter: 13, subIndex: 5, title: 'Level order traversal' },
  { id: 'python-13.6', language: 'python', chapter: 13, subIndex: 6, title: 'Graph representation' },
  { id: 'python-13.7', language: 'python', chapter: 13, subIndex: 7, title: 'BFS' },
  { id: 'python-13.8', language: 'python', chapter: 13, subIndex: 8, title: 'DFS' },
  { id: 'python-13.9', language: 'python', chapter: 13, subIndex: 9, title: 'Connected components' },
  { id: 'python-13.10', language: 'python', chapter: 13, subIndex: 10, title: 'Cycle detection basics' },
  // Chapter 14
  { id: 'python-14.1', language: 'python', chapter: 14, subIndex: 1, title: 'Two pointers' },
  { id: 'python-14.2', language: 'python', chapter: 14, subIndex: 2, title: 'Sliding window' },
  { id: 'python-14.3', language: 'python', chapter: 14, subIndex: 3, title: 'Prefix sum' },
  { id: 'python-14.4', language: 'python', chapter: 14, subIndex: 4, title: 'Fast and slow pointers' },
  { id: 'python-14.5', language: 'python', chapter: 14, subIndex: 5, title: 'Monotonic stack' },
  { id: 'python-14.6', language: 'python', chapter: 14, subIndex: 6, title: 'Monotonic queue' },
  { id: 'python-14.7', language: 'python', chapter: 14, subIndex: 7, title: 'Binary search patterns' },
  { id: 'python-14.8', language: 'python', chapter: 14, subIndex: 8, title: 'Tree DFS/BFS patterns' },
  { id: 'python-14.9', language: 'python', chapter: 14, subIndex: 9, title: 'Graph traversal patterns' },
  { id: 'python-14.10', language: 'python', chapter: 14, subIndex: 10, title: 'Backtracking patterns' },
  // Chapter 15
  { id: 'python-15.1', language: 'python', chapter: 15, subIndex: 1, title: 'Choosing the right built-in container' },
  { id: 'python-15.2', language: 'python', chapter: 15, subIndex: 2, title: 'Avoiding slow patterns' },
  { id: 'python-15.3', language: 'python', chapter: 15, subIndex: 3, title: 'Copy vs reference behavior' },
  { id: 'python-15.4', language: 'python', chapter: 15, subIndex: 4, title: 'Slice-related mistakes' },
  { id: 'python-15.5', language: 'python', chapter: 15, subIndex: 5, title: 'Dict and set edge cases' },
  { id: 'python-15.6', language: 'python', chapter: 15, subIndex: 6, title: 'Recursion limit awareness' },
  { id: 'python-15.7', language: 'python', chapter: 15, subIndex: 7, title: 'Debugging input/output issues' },
  { id: 'python-15.8', language: 'python', chapter: 15, subIndex: 8, title: 'Reading constraints and selecting an approach' },
  { id: 'python-15.9', language: 'python', chapter: 15, subIndex: 9, title: 'Building a personal Python snippet notebook' },
];

// ---------------------------------------------------------------------------
// Merge helpers
// ---------------------------------------------------------------------------

function attachChapterTitles(
  topics: Omit<Day0to1Topic, 'chapterTitle'>[],
  chapters: Day0to1Chapter[],
): Day0to1Topic[] {
  const chapterMap = new Map(chapters.map((c) => [`${c.language}-${c.chapter}`, c.title]));
  return topics.map((t) => ({
    ...t,
    chapterTitle: chapterMap.get(`${t.language}-${t.chapter}`) ?? '',
  }));
}

/** All Phase 0 topics across all three languages. */
export const day0to1Topics: Day0to1Topic[] = [
  ...attachChapterTitles(cppTopics, cppChapters),
  ...attachChapterTitles(javaTopics, javaChapters),
  ...attachChapterTitles(pythonTopics, pythonChapters),
];

/** All chapters across all three languages. */
export const day0to1Chapters: Day0to1Chapter[] = [
  ...cppChapters,
  ...javaChapters,
  ...pythonChapters,
];

/** Get topics filtered by language. */
export function getTopicsForLanguage(language: Phase0Language): Day0to1Topic[] {
  return day0to1Topics.filter((t) => t.language === language);
}

/** Get chapters filtered by language. */
export function getChaptersForLanguage(language: Phase0Language): Day0to1Chapter[] {
  return day0to1Chapters.filter((c) => c.language === language);
}

/** Look up a single topic by its id, e.g. "cpp-1.1". */
export function getTopicById(topicId: string): Day0to1Topic | null {
  return day0to1Topics.find((t) => t.id === topicId) ?? null;
}

/**
 * The topics immediately before and after a topic, within its own language.
 * Drives prev/next navigation in the lesson reader so a student can read a
 * chapter straight through without returning to the dashboard.
 */
export function getAdjacentTopics(topicId: string): {
  prev: Day0to1Topic | null;
  next: Day0to1Topic | null;
} {
  const topic = getTopicById(topicId);
  if (!topic) return { prev: null, next: null };
  const siblings = getTopicsForLanguage(topic.language);
  const i = siblings.findIndex((t) => t.id === topicId);
  return {
    prev: i > 0 ? siblings[i - 1] : null,
    next: i >= 0 && i < siblings.length - 1 ? siblings[i + 1] : null,
  };
}

/** Language display names and metadata. */
export const languageMeta: Record<Phase0Language, { name: string; icon: string }> = {
  cpp: { name: 'C++', icon: 'ti-brand-cpp' },
  java: { name: 'Java', icon: 'ti-coffee' },
  python: { name: 'Python', icon: 'ti-brand-python' },
};
