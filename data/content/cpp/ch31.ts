import type { Lesson } from '../types';

/**
 * Chapter 31 — The Language Toolbox.
 * Essential modern C++ language features, standard library utilities,
 * performance optimizations, and idiom patterns for competitive programming
 * and technical interview assessments.
 */
export const ch31: Lesson[] = [
  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-31.1',
    language: 'cpp',
    summary: 'Disable C++ stream synchronisation and untie standard streams to read large inputs within competitive time limits.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Standard C++ input and output streams such as `cin` and `cout` are designed for safety and backward interoperability. By default, the C++ runtime synchronises its internal stream buffers with the underlying C standard I/O library buffers (`stdin` and `stdout`). This synchronisation guarantees that programs interleaving C calls like `printf` and `scanf` with C++ streams like `cout` and `cin` produce correctly ordered output. However, coordinating these two independent buffering layers adds substantial function call overhead on every single read and write operation.',
      },
      { kind: 'heading', text: 'Why default stream I/O causes Time Limit Exceeded' },
      {
        kind: 'text',
        body: 'In competitive programming and online assessments, problems routinely supply inputs containing 100,000 to 1,000,000 values. Under default stream settings, reading this volume of data through `cin` can consume more than one second of CPU execution time, exhausting the entire time budget before the algorithm begins processing. Turning off synchronisation gives C++ streams independent memory buffers and throughput comparable to raw C standard I/O.',
      },
      {
        kind: 'code',
        caption: 'Fast I/O configuration boilerplate',
        code: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    // Optimise standard stream performance
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    if (cin >> n) {
        vector<int> a(n);
        for (int i = 0; i < n; i++) {
            cin >> a[i];
        }
        for (int i = 0; i < n; i++) {
            cout << a[i] << '\\n';
        }
    }
    return 0;
}`,
      },
      { kind: 'heading', text: 'Deconstructing the optimizations' },
      {
        kind: 'table',
        headers: ['Statement', 'Mechanism', 'Performance impact'],
        rows: [
          ['`ios::sync_with_stdio(false);`', 'Disconnects C++ streams from C stdio buffers', 'Eliminates dual-buffer synchronization overhead'],
          ['`cin.tie(nullptr);`', 'Unties `cin` from `cout`', 'Prevents automatic flushing of `cout` before every `cin` read'],
          ['`\'\\n\'` instead of `endl`', 'Outputs newline character without flush', 'Avoids expensive operating system buffer flushes on every line'],
        ],
      },
      {
        kind: 'text',
        body: 'The `cin.tie(nullptr)` call is equally vital. By default, `cin` is tied to `cout`. This connection ensures that if an interactive user is prompted with `cout << "Enter value: "`, the text displays on screen before `cin` blocks waiting for input. On automated judges, input is supplied in full through piped files. Flushing the output buffer before every single read operation wastes thousands of CPU cycles.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Do not mix C and C++ I/O after disabling sync',
        body: 'Once `ios::sync_with_stdio(false)` executes, never invoke `scanf`, `printf`, `getchar`, or `puts`. Because the C and C++ stream buffers no longer communicate, input and output operations will interleave unpredictably, causing wrong answers or reading desynchronised tokens.',
      },
    ],
    keyTakeaways: [
      '`ios::sync_with_stdio(false)` decouples C++ streams from C library buffers for massive speedups.',
      '`cin.tie(nullptr)` prevents `cin` from flushing `cout` before every read operation.',
      'Output `\'\\n\'` rather than `endl` because `endl` forces a full stream flush on every line.',
      'Never mix `cin`/`cout` with `scanf`/`printf` once stream synchronisation is disabled.',
    ],
    practice: {
      prompt: 'Write a program that reads 200,000 integers into a vector. Benchmark execution time using standard cin and cout with endl, then rerun with ios::sync_with_stdio(false), cin.tie(nullptr), and \'\\n\'. Record the difference in elapsed time.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-31.2',
    language: 'cpp',
    summary: 'Use INT_MAX, LLONG_MAX, and numeric_limits to initialise bounds safely and guard against integer overflow.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Every numeric type in C++ occupies a fixed number of bytes in memory, defining a strict range of values it can represent. A standard signed 32-bit `int` stores values from -2,147,483,648 to 2,147,483,647. A signed 64-bit `long long` stores values up to approximately 9.22 × 10¹⁸. When tracking running minimums or maximums, algorithms initialise boundary tracking variables so that any real data element immediately updates the candidate answer.',
      },
      { kind: 'heading', text: 'Standard macros versus numeric_limits' },
      {
        kind: 'text',
        body: 'The legacy C header `<climits>` defines preprocessor macros including `INT_MAX`, `INT_MIN`, `LLONG_MAX`, and `LLONG_MIN`. Modern C++ introduces `<limits>`, which provides the templated struct `std::numeric_limits<T>`. The template approach is type-safe and enables writing generic functions that adapt to any integer or floating-point type.',
      },
      {
        kind: 'code',
        caption: 'Initialising bounds and checking for overflow',
        code: `#include <iostream>
#include <climits>
#include <limits>
using namespace std;

int main() {
    // Macro constants from <climits>
    int best_min = INT_MAX;
    int best_max = INT_MIN;

    // Type-safe limits from <limits>
    long long safe_min = numeric_limits<long long>::max();
    long long safe_max = numeric_limits<long long>::min();

    int a = 2000000000;
    int b = 1000000000;

    // Check before addition to prevent signed overflow
    if (a > INT_MAX - b) {
        cout << "Adding would overflow 32-bit int\\n";
    }

    return 0;
}`,
      },
      { kind: 'heading', text: 'Common integer boundaries' },
      {
        kind: 'table',
        headers: ['Type', 'Macro Constant', 'Template Equivalent', 'Approximate Limit'],
        rows: [
          ['`int` (32-bit signed)', '`INT_MAX` / `INT_MIN`', '`numeric_limits<int>::max()`', '±2.14 × 10⁹'],
          ['`long long` (64-bit signed)', '`LLONG_MAX` / `LLONG_MIN`', '`numeric_limits<long long>::max()`', '±9.22 × 10¹⁸'],
          ['`double` (64-bit float)', '`DBL_MAX`', '`numeric_limits<double>::infinity()`', '±1.79 × 10³⁰⁸'],
        ],
      },
      {
        kind: 'text',
        body: 'For floating-point types like `double`, `numeric_limits<double>::min()` returns the smallest positive normal value, not the most negative number. To obtain negative infinity or the lowest representable negative value, use `numeric_limits<double>::lowest()` or `-numeric_limits<double>::infinity()`.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Adding to INT_MAX causes undefined behaviour',
        body: 'In C++, signed integer overflow is undefined behaviour. Evaluating `INT_MAX + 1` does not wrap predictably in compliant code; the compiler is permitted to assume overflow never happens and discard downstream safety checks. In shortest-path algorithms such as Dijkstra where distance sentinels have edge weights added, use 1e9 or 1e18, or check whether the distance equals infinity before adding.',
      },
    ],
    keyTakeaways: [
      '`INT_MAX` is roughly 2.14 × 10⁹, while `LLONG_MAX` is roughly 9.22 × 10¹⁸.',
      '`numeric_limits<T>::max()` provides a type-safe upper bound that works inside templates.',
      'For floating-point types, use `lowest()` for the most negative value; `min()` returns the smallest positive value.',
      'Never add positive quantities to `INT_MAX`; use a safe sentinel like `1e9` or check before addition.',
    ],
    practice: {
      prompt: 'Implement a string-to-integer parser that checks for potential 32-bit overflow before multiplying by 10 or adding a new digit. Clamp the result to INT_MAX or INT_MIN when the bounds are exceeded.',
      leetcode: {
        title: 'String to Integer (atoi)',
        slug: 'string-to-integer-atoi',
      },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-31.3',
    language: 'cpp',
    summary: 'Avoid underflow and incorrect loop conditions caused by implicit signed to unsigned conversions with size_t.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'In C++, container methods such as `vector::size()`, `string::length()`, and the `sizeof` operator return values of type `size_t`. The `size_t` type is an unsigned integer guaranteed to be large enough to hold the byte size of any object in memory. Because unsigned types cannot represent negative numbers, subtracting from zero wraps around modulo 2 raised to the word width, producing gigantic positive numbers.',
      },
      { kind: 'heading', text: 'The signed and unsigned comparison trap' },
      {
        kind: 'text',
        body: 'When an expression compares a signed integer with an unsigned integer, standard C++ promotion rules convert the signed integer into an unsigned integer of matching rank. A negative signed integer like `-1` becomes `4,294,967,295` in 32-bit representation or `18,446,744,073,709,551,615` in 64-bit representation. As a consequence, the condition `-1 < v.size()` evaluates to `false` whenever `v.size()` is less than that maximum unsigned value.',
      },
      {
        kind: 'code',
        caption: 'Unsigned underflow and comparison failures',
        code: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> empty_vec;

    int i = -1;
    // Trap 1: signed promoted to unsigned
    if (i < empty_vec.size()) {
        cout << "Never printed\\n";
    } else {
        cout << "-1 is not less than unsigned 0!\\n";
    }

    // Trap 2: subtraction on zero size wraps
    // empty_vec.size() - 1 produces 18446744073709551615ULL
    size_t bad_bound = empty_vec.size() - 1;
    cout << "Underflowed bound: " << bad_bound << '\\n';

    // Safe pattern: cast to int or restructure condition
    int n = static_cast<int>(empty_vec.size());
    for (int idx = 0; idx < n - 1; idx++) {
        // Correctly does not execute when empty
    }

    return 0;
}`,
      },
      { kind: 'heading', text: 'Loop boundary hazards' },
      {
        kind: 'text',
        body: 'A frequent error occurs when checking adjacent elements using `for (int i = 0; i < v.size() - 1; i++)`. If the vector `v` is empty, `v.size()` evaluates to `0u`. The subtraction `0u - 1u` wraps to `18446744073709551615ULL`. The loop condition `0 < 18446744073709551615ULL` evaluates to true, the loop body enters, accesses `v[0]`, and crashes with a segmentation fault.',
      },
      {
        kind: 'table',
        headers: ['Hazardous Expression', 'Why It Fails When Empty', 'Safe Alternative'],
        rows: [
          ['`i < v.size() - 1`', '`0u - 1u` wraps to `SIZE_MAX`', '`i + 1 < v.size()`'],
          ['`int i = -1; i < v.size()`', '`-1` promotes to `SIZE_MAX`', '`i < static_cast<int>(v.size())`'],
          ['`for (size_t i = n-1; i >= 0; i--)`', '`i >= 0` is perpetually true (infinite loop)', 'Use signed index: `for (int i = n - 1; i >= 0; i--)`'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Reverse loops with size_t never terminate',
        body: 'Writing `for (size_t i = v.size() - 1; i >= 0; i--)` creates an infinite loop. Because `size_t` is unsigned, the condition `i >= 0` is satisfied for every possible value. When `i` is 0 and decrements, it wraps to `SIZE_MAX`, continuing the loop and accessing invalid memory.',
      },
    ],
    keyTakeaways: [
      '`size_t` is an unsigned integer type returned by all standard container size methods.',
      'Comparing a negative signed integer to `size_t` promotes the negative number to an enormous positive value.',
      'Subtracting 1 from `0u` causes modular wraparound to the maximum representable unsigned integer.',
      'Write `i + 1 < v.size()` or cast with `static_cast<int>(v.size())` to avoid unsigned underflow bugs.',
    ],
    practice: {
      prompt: 'Write a function that compares adjacent elements in a vector. Test it with an empty vector using the condition i < v.size() - 1 to observe the segmentation fault, then fix it using i + 1 < v.size() and verify safe execution.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-31.4',
    language: 'cpp',
    summary: 'Write expressive, copy-free loops and simplify complex declarations using auto and range-based for.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'In modern C++, declaring exact types for nested containers—such as `unordered_map<string, vector<pair<int, int>>>::const_iterator`—adds visual clutter and invites typographic mistakes. The `auto` keyword directs the compiler to deduce the variable type from its initialiser expression at compile time. This deduction takes place entirely during compilation and produces identical machine code to manual type declarations.',
      },
      { kind: 'heading', text: 'Range-based for loops and reference semantics' },
      {
        kind: 'text',
        body: 'Range-based `for` loops iterate over any container providing `begin()` and `end()` iterators. Choosing the appropriate qualifier with `auto` determines whether elements are copied, inspected in place, or modified directly.',
      },
      {
        kind: 'code',
        caption: 'Range-based for variations and structured bindings',
        code: `#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
using namespace std;

int main() {
    vector<string> words = {"apple", "banana", "cherry"};

    // 1. By const reference: zero copy, read-only
    for (const auto& w : words) {
        cout << w << ' ';
    }
    cout << '\\n';

    // 2. By reference: modifies container elements in place
    vector<int> nums = {1, 2, 3, 4};
    for (auto& x : nums) {
        x *= 10;
    }

    // 3. Structured bindings (C++17) with maps
    unordered_map<string, int> counts = {{"alpha", 5}, {"beta", 9}};
    for (const auto& [word, count] : counts) {
        cout << word << ": " << count << '\\n';
    }

    return 0;
}`,
      },
      { kind: 'heading', text: 'Loop qualifiers compared' },
      {
        kind: 'table',
        headers: ['Syntax', 'Semantics', 'When to use'],
        rows: [
          ['`for (auto x : c)`', 'Copies each element', 'Primitive scalars (`int`, `char`, `double`)'],
          ['`for (const auto& x : c)`', 'Reference to element, read-only', 'Large objects (`string`, `vector`), prevents copying'],
          ['`for (auto& x : c)`', 'Mutable reference to element', 'Modifying container elements in place'],
          ['`for (const auto& [k, v] : c)`', 'Unpacks pair or tuple elements', 'Iterating over maps, adjacency lists, or pairs'],
        ],
      },
      {
        kind: 'text',
        body: 'C++17 structured bindings allow unpacking pairs and tuples directly into named variables: `const auto& [u, weight] = edge;`. This replaces legacy member access like `edge.first` and `edge.second` with clear, self-documenting identifiers.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Accidental deep copying of containers',
        body: 'Writing `for (auto row : matrix)` or `for (auto s : words)` creates a full copy of every inner vector or string on every single iteration. For an N × N matrix or long strings, this silent copying turns an O(N²) traversal into a memory-copying bottleneck that triggers Time Limit Exceeded. Always write `const auto&` for non-primitive types.',
      },
    ],
    keyTakeaways: [
      '`auto` deduces variable types at compile time with zero runtime overhead.',
      'Always use `const auto&` when reading non-primitive container elements to prevent deep copies.',
      'Use `auto&` when you need to modify container elements directly in place.',
      'Use structured bindings `const auto& [key, val]` to cleanly unpack map entries and pairs.',
    ],
    practice: {
      prompt: 'Build a frequency table from a list of strings using unordered_map. Iterate over the map using structured bindings and const auto& to find and print the element with the maximum frequency.',
      leetcode: {
        title: 'Top K Frequent Elements',
        slug: 'top-k-frequent-elements',
      },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-31.5',
    language: 'cpp',
    summary: 'Construct inline anonymous functions with custom variable captures for sorting and nested recursion.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A **lambda expression** is an anonymous function defined inline at the exact point where it is required. In algorithmic problem solving, lambdas serve two critical roles: providing custom comparison logic to standard algorithms like `sort` and `priority_queue`, and writing nested recursive helper functions (such as depth-first search) without declaring separate member methods or global variables.',
      },
      { kind: 'heading', text: 'Lambda syntax and capture mechanics' },
      {
        kind: 'text',
        body: 'The syntax of a lambda consists of four primary parts: `[capture](parameters) -> return_type { body }`. The capture clause determines which variables from the enclosing scope are accessible inside the lambda body, and whether they are accessed by value or by reference.',
      },
      {
        kind: 'code',
        caption: 'Sorting with lambdas and recursive DFS',
        code: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<pair<int, int>> points = {{1, 4}, {2, 3}, {1, 2}};

    // Custom sort: primary key ascending, secondary key descending
    sort(points.begin(), points.end(), [](const auto& a, const auto& b) {
        if (a.first != b.first) return a.first < b.first;
        return a.second > b.second;
    });

    // Recursive lambda for graph traversal
    int n = 4;
    vector<vector<int>> adj = {{1, 2}, {3}, {}, {}};
    vector<bool> visited(n, false);

    // Generic lambda recursion pattern (C++14)
    auto dfs = [&](auto&& self, int u) -> void {
        visited[u] = true;
        cout << "Visited: " << u << '\\n';
        for (int v : adj[u]) {
            if (!visited[v]) {
                self(self, v);
            }
        }
    };

    dfs(dfs, 0);
    return 0;
}`,
      },
      { kind: 'heading', text: 'Capture modes compared' },
      {
        kind: 'table',
        headers: ['Capture Clause', 'Access Mode', 'Implication'],
        rows: [
          ['`[]`', 'No captures', 'Can only access its own parameters and global variables'],
          ['`[&]`', 'Capture all by reference', 'Zero copying; direct access to all outer local variables'],
          ['`[=]`', 'Capture all by value', 'Copies referenced variables; read-only access by default'],
          ['`[&var, x]`', 'Explicit capture', 'Captures `var` by reference and `x` by value copy'],
        ],
      },
      {
        kind: 'text',
        body: 'Notice the recursive lambda pattern: `auto dfs = [&](auto&& self, int u) -> void`. By passing `self` as the first argument, the lambda can call itself recursively as `self(self, v)` without requiring `std::function`. This avoids dynamic heap allocations and virtual function dispatch overhead, compiling down to a fast direct call.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Comparators must enforce strict weak ordering',
        body: 'A comparator passed to `std::sort` must return `false` for equal elements. Writing `return a <= b;` violates strict weak ordering: when two elements are equal, both `comp(a, b)` and `comp(b, a)` evaluate to `true`. This causes undefined behaviour in `std::sort`, leading to out-of-bounds memory reads or segmentation faults on large test inputs.',
      },
    ],
    keyTakeaways: [
      'Lambdas enable defining local custom comparators and recursive helper functions.',
      'Use `[&]` to capture outer variables by reference without copying memory buffers.',
      'For recursion without `std::function` overhead, pass `self` as a generic parameter.',
      'Comparators must strictly return `false` when two compared elements are equal.',
    ],
    practice: {
      prompt: 'Given a list of intervals represented as pairs of start and end times, sort them primarily by start time ascending. When start times match, sort by end time descending using an inline lambda comparator.',
      leetcode: {
        title: 'Merge Intervals',
        slug: 'merge-intervals',
      },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-31.6',
    language: 'cpp',
    summary: 'Write reusable, type-independent utility functions using C++ function templates.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'In algorithmic code, operations like computing the minimum of three values or updating a dynamic programming state work identically whether handling `int`, `long long`, or `double`. Writing separate functions for every type duplicates logic and increases the likelihood of maintenance errors. A **function template** is a code blueprint that directs the compiler to generate concrete, type-specific function instances automatically during compilation.',
      },
      { kind: 'heading', text: 'Template syntax and argument deduction' },
      {
        kind: 'text',
        body: 'A function template begins with `template <typename T>` or `template <class T>`, where `T` acts as a placeholder type. When you invoke the template function, the compiler inspects the arguments passed at the call site and infers what `T` should be. This process is called **template argument deduction**.',
      },
      {
        kind: 'code',
        caption: 'Generic helper templates',
        code: `#include <iostream>
#include <algorithm>
using namespace std;

// Updates target with minimum; returns true if changed
template <typename T>
bool chmin(T& target, const T& candidate) {
    if (candidate < target) {
        target = candidate;
        return true;
    }
    return false;
}

// Computes the median of three values of any comparable type
template <typename T>
T median3(T a, T b, T c) {
    return max(min(a, b), min(max(a, b), c));
}

int main() {
    int dist = 100;
    if (chmin(dist, 42)) {
        cout << "Distance improved to: " << dist << '\\n';
    }

    long long big_dist = 1000000000000LL;
    chmin(big_dist, 500000000000LL);
    cout << "Big distance: " << big_dist << '\\n';

    cout << "Median: " << median3(10, 30, 20) << '\\n';
    return 0;
}`,
      },
      { kind: 'heading', text: 'The utility of chmin and chmax' },
      {
        kind: 'text',
        body: 'The `chmin` and `chmax` templates are widely used in competitive programming and dynamic programming solutions. Instead of writing `dp[i][j] = min(dp[i][j], new_cost);`, writing `chmin(dp[i][j], new_cost);` is concise and avoids repeating complex multi-dimensional array indexing expressions.',
      },
      {
        kind: 'table',
        headers: ['Call Site', 'Deduced Type `T`', 'Generated Function'],
        rows: [
          ['`chmin(dist, 42)`', '`int`', '`bool chmin(int&, const int&)`'],
          ['`chmin(big_dist, 500LL)`', '`long long`', '`bool chmin(long long&, const long long&)`'],
          ['`median3(1.5, 3.2, 2.1)`', '`double`', '`double median3(double, double, double)`'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Mismatched types prevent template deduction',
        body: 'If a template declares `template <typename T> T my_min(T a, T b)`, calling `my_min(5, 10LL)` fails compilation. The compiler cannot deduce whether `T` should be `int` or `long long`. Resolve this by either casting one argument, specifying the type explicitly as `my_min<long long>(5, 10LL)`, or declaring two distinct type parameters `template <typename T, typename U>`.',
      },
    ],
    keyTakeaways: [
      'Function templates generate type-specific functions at compile time with zero runtime penalty.',
      'Template argument deduction automatically infers type parameters from call arguments.',
      'The `chmin` and `chmax` template idioms streamline state updates in dynamic programming.',
      'Mismatched argument types require explicit template arguments like `my_func<long long>(a, b)`.',
    ],
    practice: {
      prompt: 'Write a template function clamp_value<T>(T val, T low, T high) that returns low if val < low, high if val > high, and val otherwise. Verify that it compiles and operates correctly for both int and double inputs.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-31.7',
    language: 'cpp',
    summary: 'Navigate containers and compute ranges using standard iterators, categories, and distance operations.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'In C++, containers and standard algorithms do not interface directly with one another. Algorithms like `std::sort`, `std::reverse`, and `std::lower_bound` do not contain code specific to vectors, deques, or arrays. Instead, they interact with data exclusively through **iterators**. An iterator is an abstraction representing a position within a container, providing pointer-like semantics to access and advance across elements.',
      },
      { kind: 'heading', text: 'Half-open ranges [begin, end)' },
      {
        kind: 'text',
        body: 'Every standard container range is specified as a half-open interval `[begin, end)`. The iterator returned by `c.begin()` points to the first valid element. The iterator returned by `c.end()` points to a conceptual element one position past the last valid element. You must never dereference `c.end()`; it acts solely as a stopping boundary.',
      },
      {
        kind: 'code',
        caption: 'Iterator traversal and index computation',
        code: `#include <iostream>
#include <vector>
#include <algorithm>
#include <iterator>
using namespace std;

int main() {
    vector<int> nums = {10, 20, 30, 40, 50};

    // Forward iteration
    for (auto it = nums.begin(); it != nums.end(); ++it) {
        cout << *it << ' ';
    }
    cout << '\\n';

    // Searching and computing index
    auto it = find(nums.begin(), nums.end(), 30);
    if (it != nums.end()) {
        // distance computes difference between iterators
        int index = distance(nums.begin(), it);
        cout << "Found 30 at index: " << index << '\\n';
    }

    // Advance and next
    auto third = next(nums.begin(), 2);
    cout << "Third element: " << *third << '\\n';

    return 0;
}`,
      },
      { kind: 'heading', text: 'Iterator categories and performance' },
      {
        kind: 'table',
        headers: ['Category', 'Containers', 'Supported Moves', '`distance` Complexity'],
        rows: [
          ['Random Access', '`vector`, `deque`, raw array', '`it + n`, `it[n]`, `it2 - it1`', 'O(1)'],
          ['Bidirectional', '`set`, `map`, `list`', '`++it`, `--it`', 'O(N)'],
          ['Forward', '`unordered_set`, `unordered_map`', '`++it` only', 'O(N)'],
        ],
      },
      {
        kind: 'text',
        body: 'Because `vector` iterators are random-access, operations like `it2 - it1` and `distance(first, last)` execute in constant O(1) time via address subtraction. On trees like `std::set` or hash tables like `std::unordered_map`, iterators are bidirectional or forward, meaning `distance` must step through elements one by one in O(N) time.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Using distance on set iterators inside loops',
        body: 'Calling `distance(s.begin(), it)` on a `std::set` or `std::map` walks through node pointers one step at a time, taking O(N) time. Placing that call inside a loop across all elements creates an unintended O(N²) time complexity that causes Time Limit Exceeded. If you need rank queries by index in sorted order, an ordered data structure is required instead.',
      },
    ],
    keyTakeaways: [
      'Standard algorithms operate on half-open ranges `[begin, end)`.',
      '`c.end()` points past the final element; dereferencing it causes undefined behaviour.',
      '`distance` runs in O(1) time for vectors and deques, but takes O(N) time for sets and maps.',
      'Use `next(it, k)` and `prev(it, k)` to safely obtain offset iterators without mutating `it`.',
    ],
    practice: {
      prompt: 'Use std::lower_bound to find the insertion point of a target in a sorted vector. Compute its 0-based index using std::distance and verify the time complexity is O(log N).',
      leetcode: {
        title: 'Search Insert Position',
        slug: 'search-insert-position',
      },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-31.8',
    language: 'cpp',
    summary: 'Eliminate reallocation overhead and avoid redundant object copies using reserve, emplace_back, and shrink_to_fit.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A `std::vector` stores elements in a contiguous block of heap memory. It tracks two distinct quantities: **size** (the count of elements currently present) and **capacity** (the maximum number of elements the allocated memory buffer can hold before needing reallocation). When `push_back` is called and `size == capacity`, the vector must allocate a larger memory block (typically doubling capacity), copy or move all existing elements to the new block, and release the old memory.',
      },
      { kind: 'heading', text: 'Pre-allocating memory with reserve' },
      {
        kind: 'text',
        body: 'If you know in advance how many elements will be inserted, calling `v.reserve(n)` allocates sufficient capacity upfront. This single allocation completely eliminates all intermediate reallocations and element copying during subsequent insertions, converting a series of amortized operations into deterministic O(1) operations.',
      },
      {
        kind: 'code',
        caption: 'Reserve, emplace_back, and capacity controls',
        code: `#include <iostream>
#include <vector>
using namespace std;

struct Edge {
    int to;
    int weight;
    Edge(int t, int w) : to(t), weight(w) {}
};

int main() {
    vector<Edge> edges;
    // Pre-allocate buffer for 100,000 edges
    edges.reserve(100000);

    // emplace_back constructs Edge directly in memory:
    // avoids creating a temporary Edge object
    edges.emplace_back(2, 50);
    edges.emplace_back(3, 80);

    cout << "Size: " << edges.size() << '\\n';         // 2
    cout << "Capacity: " << edges.capacity() << '\\n'; // 100000

    // Release unneeded buffer memory
    edges.shrink_to_fit();
    cout << "Capacity after shrink: " << edges.capacity() << '\\n'; // 2

    return 0;
}`,
      },
      { kind: 'heading', text: 'emplace_back versus push_back' },
      {
        kind: 'text',
        body: '`push_back` expects a fully constructed object. When passing arguments like `v.push_back({to, weight})`, a temporary object is constructed first, then moved or copied into the vector buffer, and finally destroyed. `emplace_back(to, weight)` forwards its arguments directly to the element constructor inside the allocated vector buffer, avoiding temporary object construction and destruction entirely.',
      },
      {
        kind: 'table',
        headers: ['Method', 'Affects Size?', 'Affects Capacity?', 'Primary Purpose'],
        rows: [
          ['`reserve(n)`', 'No', 'Yes (sets ≥ n)', 'Eliminates reallocations when total element count is anticipated'],
          ['`resize(n)`', 'Yes (sets == n)', 'Yes (if n > capacity)', 'Creates or destroys elements, making indices `0..n-1` accessible'],
          ['`emplace_back(...)`', 'Yes (+1)', 'Yes (if full)', 'Constructs an element in place inside the vector buffer'],
          ['`shrink_to_fit()`', 'No', 'Yes (reduces to size)', 'Frees unused capacity back to the memory allocator'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Indexing after reserve causes undefined behaviour',
        body: 'Calling `v.reserve(100)` increases capacity, but `v.size()` remains 0. Writing `v[0] = 42;` immediately after `reserve` accesses uninitialised memory out of bounds. To access indices directly with `v[i]`, use `v.resize(100)` or construct the vector with a size: `vector<int> v(100);`.',
      },
    ],
    keyTakeaways: [
      '`reserve(n)` pre-allocates memory buffer capacity without altering container size.',
      '`emplace_back` constructs objects in place, avoiding redundant copies and temporaries.',
      '`resize(n)` creates real elements; `reserve(n)` only reserves storage space.',
      '`shrink_to_fit()` frees unused excess capacity after large element deletions.',
    ],
    practice: {
      prompt: 'Construct an adjacency list for a directed graph with V vertices and E edges. Read all edge counts per vertex, call reserve on each vertex list, and insert edges using emplace_back.',
      leetcode: {
        title: 'All Paths From Source to Target',
        slug: 'all-paths-from-source-to-target',
      },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-31.9',
    language: 'cpp',
    summary: 'Perform efficient value exchanges and range bounds checks using swap, min, max, minmax, and clamp.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Writing manual conditional logic or temporary variables for fundamental operations like swapping values, clamping bounds, or selecting minimums introduces boilerplate and visual noise. The standard library provides optimized utility functions in `<algorithm>` and `<utility>` that express these operations cleanly and compile down to single CPU instructions.',
      },
      { kind: 'heading', text: 'Optimized swapping and multi-element comparisons' },
      {
        kind: 'text',
        body: '`std::swap(a, b)` exchanges the values of two variables. For standard containers like `vector` and `string`, `swap` exchanges internal heap pointers and size metadata in O(1) time without copying the underlying elements. `std::min` and `std::max` accept an initializer list of arbitrary length, finding extreme values across multiple variables in a single expression.',
      },
      {
        kind: 'code',
        caption: 'Using swap, minmax, and clamp',
        code: `#include <iostream>
#include <algorithm>
#include <utility>
#include <vector>
using namespace std;

int main() {
    int x = 10, y = 20;
    swap(x, y);
    cout << "x: " << x << ", y: " << y << '\\n'; // 20, 10

    // Compare multiple values cleanly
    int low = 5, mid = 15, high = 25;
    int smallest = min({low, mid, high, 2});
    int largest = max({low, mid, high, 40});
    cout << "Min: " << smallest << ", Max: " << largest << '\\n';

    // minmax computes both in a single pass
    auto [mn, mx] = minmax({12, 45, 7, 89, 23});
    cout << "Pair min: " << mn << ", max: " << mx << '\\n';

    // clamp restricts a value to [lower, upper] (C++17)
    int raw_val = 150;
    int bounded = clamp(raw_val, 0, 100);
    cout << "Bounded: " << bounded << '\\n'; // 100

    return 0;
}`,
      },
      { kind: 'heading', text: 'Syntax and operations comparison' },
      {
        kind: 'table',
        headers: ['Function', 'Header', 'Usage Example', 'Operational Benefit'],
        rows: [
          ['`std::swap`', '`<utility>`', '`swap(a, b)`', 'O(1) pointer swap for containers; no temporary copies'],
          ['`std::min` / `std::max`', '`<algorithm>`', '`max({a, b, c, d})`', 'Evaluates multiple arguments without nested function calls'],
          ['`std::minmax`', '`<algorithm>`', '`auto [lo, hi] = minmax(a, b)`', 'Computes both minimum and maximum in fewer comparisons'],
          ['`std::clamp`', '`<algorithm>`', '`clamp(val, low, high)`', 'Replaces verbose `max(low, min(val, high))` bounds checks'],
        ],
      },
      {
        kind: 'text',
        body: 'The `std::clamp(val, low, high)` function, introduced in C++17, bounds a value within a specified interval `[low, high]`. It requires that `low <= high`; passing arguments where `low > high` produces undefined behaviour.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Mismatched types in min and max',
        body: 'Writing `min(v.size(), 10)` results in a compilation error because `v.size()` is of type `size_t` while `10` is a signed `int`. The template signature for `std::min` requires both arguments to have the exact same type. You must cast one argument explicitly: `min(v.size(), static_cast<size_t>(10))` or `min(static_cast<int>(v.size()), 10)`.',
      },
    ],
    keyTakeaways: [
      '`std::swap` performs O(1) pointer exchanges for vectors, strings, and standard containers.',
      '`std::min` and `std::max` accept initializer lists to evaluate three or more arguments concisely.',
      '`std::minmax` calculates both minimum and maximum values in a single pass.',
      '`std::clamp(v, lo, hi)` restricts values to a range; ensure `lo <= hi` to avoid undefined behaviour.',
    ],
    practice: {
      prompt: 'Implement the Dutch National Flag partitioning algorithm (sort an array containing only 0, 1, and 2 in place in a single pass) using std::swap and three pointers.',
      leetcode: {
        title: 'Sort Colors',
        slug: 'sort-colors',
      },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-31.10',
    language: 'cpp',
    summary: 'Streamline sequence generation, prefix sums, and condition tallies using iota, partial_sum, fill, and count_if.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Algorithmic challenges frequently begin with repetitive setup tasks: populating arrays with consecutive integers (such as vertex indices 0 through N-1), calculating running prefix sums, filling buffers with default markers, or tallying elements that satisfy a predicate. Hand-written `for` loops for these tasks introduce clutter and off-by-one errors. Standard numeric and algorithmic utilities in `<numeric>` and `<algorithm>` express these intentions in single, highly optimized statements.',
      },
      { kind: 'heading', text: 'Filling, sequencing, and accumulating' },
      {
        kind: 'text',
        body: '`std::iota` populates a range with sequentially increasing values starting from an initial number. It is especially useful for creating permutation index arrays or initialising Disjoint Set Union (Union-Find) parent tables. `std::partial_sum` calculates cumulative prefix sums, writing the results into either a new container or directly back into the source range.',
      },
      {
        kind: 'code',
        caption: 'Standard algorithms in action',
        code: `#include <iostream>
#include <vector>
#include <numeric>
#include <algorithm>
using namespace std;

int main() {
    int n = 5;

    // 1. iota: fill with consecutive values 0, 1, 2, 3, 4
    vector<int> p(n);
    iota(p.begin(), p.end(), 0);

    // 2. fill: set all values to -1
    vector<int> memo(n);
    fill(memo.begin(), memo.end(), -1);

    // 3. partial_sum: compute prefix sums
    vector<int> vals = {3, 1, 4, 1, 5};
    vector<int> pref(n);
    partial_sum(vals.begin(), vals.end(), pref.begin());
    // pref is now: {3, 4, 8, 9, 14}

    // 4. count_if: count elements matching condition
    int odd_count = count_if(vals.begin(), vals.end(), [](int x) {
        return x % 2 != 0;
    });

    cout << "Odd elements count: " << odd_count << '\\n'; // 4
    return 0;
}`,
      },
      { kind: 'heading', text: 'Numeric algorithm reference' },
      {
        kind: 'table',
        headers: ['Function', 'Header', 'Signature Pattern', 'Typical Use Case'],
        rows: [
          ['`std::iota`', '`<numeric>`', '`iota(first, last, val)`', 'Initialising parent pointers in Union-Find or index vectors'],
          ['`std::fill`', '`<algorithm>`', '`fill(first, last, val)`', 'Resetting DP memoization tables or visited flags'],
          ['`std::partial_sum`', '`<numeric>`', '`partial_sum(in_first, in_last, out_first)`', 'Constructing prefix sum arrays for fast range sum queries'],
          ['`std::count_if`', '`<algorithm>`', '`count_if(first, last, pred)`', 'Counting elements satisfying a boolean condition or lambda'],
        ],
      },
      {
        kind: 'text',
        body: 'A notable application of `std::iota` is performing an indirect sort: instead of sorting an array of large structs directly, initialise an index vector `p` with `std::iota(p.begin(), p.end(), 0)` and sort `p` using a lambda that compares `structs[a] < structs[b]`. This reorders indices in O(N log N) without moving large data blocks.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Overflow during partial_sum',
        body: '`std::partial_sum` uses the value type of the input range for intermediate accumulations. If you invoke `partial_sum` on a `vector<int>` where prefix sums exceed 2.14 × 10⁹, the additions silently overflow into negative integers. When the cumulative sum can exceed 32-bit limits, store the input in `vector<long long>` or pass a destination iterator of type `vector<long long>`.',
      },
    ],
    keyTakeaways: [
      '`std::iota` fills ranges with increasing values, ideal for Union-Find and index sorting.',
      '`std::partial_sum` generates prefix sum arrays in a single linear pass.',
      '`std::fill` resets vectors and arrays cleanly without manual index looping.',
      'Watch for integer overflow with `partial_sum`: use `long long` containers when totals exceed 2 × 10⁹.',
    ],
    practice: {
      prompt: 'Given an array nums, compute its running 1D prefix sum array using std::partial_sum and return the resulting array.',
      leetcode: {
        title: 'Running Sum of 1d Array',
        slug: 'running-sum-of-1d-array',
      },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-31.11',
    language: 'cpp',
    summary: 'Tokenise strings, parse mixed formats, and split on custom delimiters using stringstream.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'In string processing problems, input frequently arrives as a single string containing multiple tokens separated by variable whitespace, commas, or slashes. Manually iterating over character indices to extract words and convert them to numbers requires writing tedious boundary checks. A `std::stringstream` from `<sstream>` wraps a `std::string` inside an input/output stream buffer, enabling the use of stream extraction operators (`>>`) and `getline` directly on in-memory text.',
      },
      { kind: 'heading', text: 'Whitespace tokenisation and delimiter splitting' },
      {
        kind: 'text',
        body: 'Extracting whitespace-separated words is as direct as `while (ss >> word)`. The stream automatically consumes and ignores leading, trailing, and repeated spaces. When tokens are separated by specific non-whitespace delimiters like commas or colons, `std::getline(ss, token, delimiter)` extracts text up to the designated delimiter character.',
      },
      {
        kind: 'code',
        caption: 'Tokenising words and delimited parsing',
        code: `#include <iostream>
#include <string>
#include <sstream>
#include <vector>
using namespace std;

int main() {
    // 1. Extract whitespace-delimited words
    string sentence = "   The   quick brown   fox  ";
    stringstream ss(sentence);
    string word;
    vector<string> words;

    while (ss >> word) {
        words.push_back(word);
    }
    // words contains: {"The", "quick", "brown", "fox"}

    // 2. Parse comma-separated values and convert to integer
    string csv = "128,255,0,64";
    stringstream ss_csv(csv);
    string token;
    vector<int> numbers;

    while (getline(ss_csv, token, ',')) {
        numbers.push_back(stoi(token));
    }
    // numbers contains: {128, 255, 0, 64}

    return 0;
}`,
      },
      { kind: 'heading', text: 'Common stringstream operations' },
      {
        kind: 'table',
        headers: ['Operation', 'Code Pattern', 'Extraction Behavior'],
        rows: [
          ['Word extraction', '`ss >> word`', 'Skips all whitespace; reads until next whitespace'],
          ['Typed extraction', '`ss >> int_val`', 'Parses leading valid numeric characters into specified type'],
          ['Delimited extraction', '`getline(ss, token, \',\')`', 'Reads characters until matching delimiter character or EOF'],
          ['Resetting stream content', '`ss.str(new_str); ss.clear();`', 'Assigns new buffer string and clears EOF error flags'],
        ],
      },
      {
        kind: 'text',
        body: 'When parsing mixed structures—such as `"id:42 status:active"`—stream extraction can alternate between strings and integers: `string label1, label2; int id; ss >> label1 >> id >> label2;`. The stream handles type conversions automatically.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Reusing stringstream without clear() fails silently',
        body: 'When a `stringstream` reaches the end of its content, it sets an internal EOF (end-of-file) state flag. If you assign new text with `ss.str(new_text)` without also calling `ss.clear()`, all subsequent extraction attempts will fail immediately because the EOF flag remains set. In LeetCode solutions, constructing a fresh `stringstream` inside your function or loop is cleaner and avoids state reuse bugs.',
      },
    ],
    keyTakeaways: [
      '`stringstream` wraps a string in a stream buffer, allowing `>>` extraction and type conversion.',
      '`while (ss >> word)` automatically handles irregular and repeated whitespace.',
      'Use `getline(ss, token, delimiter)` to split strings on custom single-character delimiters.',
      'Always call `ss.clear()` in addition to `ss.str(new_content)` if reusing a stream across iterations.',
    ],
    practice: {
      prompt: 'Given an input string containing words separated by irregular spaces, parse the words using stringstream and return them concatenated in reverse order separated by a single space.',
      leetcode: {
        title: 'Reverse Words in a String',
        slug: 'reverse-words-in-a-string',
      },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-31.12',
    language: 'cpp',
    summary: 'Track thousands of boolean states and accelerate subset algorithms using std::bitset.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'When an algorithm tracks large sets of boolean flags—such as prime sieves, subset sum reachability, or visited states across thousands of items—using `vector<bool>` or boolean arrays incurs performance overhead. Standard boolean arrays allocate one full byte per boolean flag. `std::bitset<N>` from `<bitset>` packs boolean flags compactly into 64-bit machine words (using 1 bit per flag) and executes bitwise operations like `&`, `|`, `^`, `<<`, and `>>` across 64 bits simultaneously in a single CPU cycle.',
      },
      { kind: 'heading', text: 'Bitset declaration and core operations' },
      {
        kind: 'text',
        body: 'A `std::bitset<N>` requires the size `N` to be a compile-time constant. It provides an array-like interface along with dedicated bit-manipulation member functions for querying and updating individual bits or the entire collection.',
      },
      {
        kind: 'code',
        caption: 'Bitset member methods and 64x knapsack speedup',
        code: `#include <iostream>
#include <bitset>
#include <vector>
using namespace std;

int main() {
    // Fixed-size bitset of 100 bits, all initialised to 0
    bitset<100> b;

    b.set(5);         // b[5] = 1
    b.set(10);        // b[10] = 1
    b.flip(5);        // toggles b[5] to 0
    b.reset(10);      // b[10] = 0

    cout << "Count of set bits: " << b.count() << '\\n';
    cout << "Is any bit set? " << b.any() << '\\n';

    // 64x speedup: Subset sum reachability using bitset shifts
    // Given coins, can we form a target sum S?
    vector<int> coins = {2, 3, 7};
    const int MAX_SUM = 100;
    bitset<MAX_SUM + 1> dp;
    dp[0] = 1; // base case: sum 0 is reachable

    for (int coin : coins) {
        // Shift all reachable sums by coin, union with current states
        dp |= (dp << coin);
    }

    cout << "Is sum 12 reachable? " << dp.test(12) << '\\n'; // 1 (true)
    return 0;
}`,
      },
      { kind: 'heading', text: 'Bitset method reference' },
      {
        kind: 'table',
        headers: ['Method', 'Syntax', 'Operation', 'Complexity'],
        rows: [
          ['`.set(pos)`', '`b.set(i)`', 'Sets bit at position `i` to 1', 'O(1)'],
          ['`.reset(pos)`', '`b.reset(i)`', 'Sets bit at position `i` to 0', 'O(1)'],
          ['`.flip(pos)`', '`b.flip(i)`', 'Inverts bit at position `i`', 'O(1)'],
          ['`.count()`', '`b.count()`', 'Counts total number of set bits (popcount)', 'O(N / 64)'],
          ['`.test(pos)`', '`b.test(i)` or `b[i]`', 'Returns boolean value at position `i`', 'O(1)'],
          ['`dp |= (dp << x)`', 'Bitwise shift & OR', 'Propagates reachable subset sums in 64-bit chunks', 'O(N / 64)'],
        ],
      },
      {
        kind: 'text',
        body: 'In the knapsack subset-sum algorithm, normal dynamic programming loops take O(N × W) steps. By expressing the transition as `dp |= (dp << coin)`, the processor updates 64 state transitions per cycle using bitwise word shifts, providing a 64× speedup that easily passes strict time limits.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Bitset size must be a compile-time constant',
        body: 'You cannot declare `bitset<n> b;` where `n` is a runtime variable read from input. The size parameter `N` must be a compile-time constant expression. In competitive programming, set `N` to the upper bound specified in the problem constraints: `const int MAXN = 100005; bitset<MAXN> b;`.',
      },
    ],
    keyTakeaways: [
      '`std::bitset<N>` stores boolean flags packed into machine words, using 1 bit per flag.',
      'Bitwise operators on bitsets execute across 64 bits simultaneously, delivering a 64x speedup.',
      'The capacity `N` must be a compile-time constant based on the constraint upper bound.',
      'Transitions like `dp |= (dp << x)` compute reachability dynamic programming efficiently.',
    ],
    practice: {
      prompt: 'Given an array of positive integers, determine if the array can be partitioned into two subsets with equal sum using std::bitset to compute all reachable subset sums.',
      leetcode: {
        title: 'Partition Equal Subset Sum',
        slug: 'partition-equal-subset-sum',
      },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-31.13',
    language: 'cpp',
    summary: 'Provide custom hash functors for composite keys like pairs and protect against collision attacks in unordered_map.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'In C++, `std::unordered_map` and `std::unordered_set` rely on two elements for their key type: an equality operator `==` to resolve bucket collisions, and a hash function specialization of `std::hash<Key>`. While the standard library provides default hash specializations for primitive types like `int`, `string`, and `char`, it supplies no default hash specialization for composite types such as `std::pair` or `std::vector`. Writing `unordered_map<pair<int, int>, int>` causes a compilation failure unless you supply a custom hash function.',
      },
      { kind: 'heading', text: 'Writing a custom hash functor' },
      {
        kind: 'text',
        body: 'To use a composite key like `pair<int, int>`, you define a functor struct containing a `size_t operator()(const Key& k) const`. A quality hash function must combine the hashes of individual members so that different coordinate permutations do not collide into the same bucket.',
      },
      {
        kind: 'code',
        caption: 'Custom hash functor for coordinate pairs',
        code: `#include <iostream>
#include <unordered_map>
#include <utility>
using namespace std;

// Custom hash functor for pair<int, int>
struct PairHash {
    size_t operator()(const pair<int, int>& p) const {
        size_t h1 = hash<int>()(p.first);
        size_t h2 = hash<int>()(p.second);
        // Combine hashes using golden ratio constant to prevent collisions
        return h1 ^ (h2 + 0x9e3779b9 + (h1 << 6) + (h1 >> 2));
    }
};

int main() {
    // Pass PairHash as the third template parameter
    unordered_map<pair<int, int>, int, PairHash> point_counts;

    point_counts[{10, 20}] = 1;
    point_counts[{20, 10}] = 2; // distinct bucket from {10, 20}
    point_counts[{10, 20}]++;

    cout << "Count at (10, 20): " << point_counts[{10, 20}] << '\\n'; // 2
    return 0;
}`,
      },
      { kind: 'heading', text: 'Bit-shifting versus naive XOR' },
      {
        kind: 'text',
        body: 'A common mistake when writing a pair hash is using plain XOR: `h1 ^ h2`. Under naive XOR, any symmetric coordinate pair like `(5, 5)` or `(42, 42)` evaluates to `h1 ^ h1 = 0`. Furthermore, `(a, b)` and `(b, a)` produce the exact same hash value, causing systematic bucket collisions that degrade lookups from O(1) to O(N). Incorporating bit shifts and a large prime or irrational constant (like `0x9e3779b9`) breaks symmetry.',
      },
      {
        kind: 'table',
        headers: ['Hash Strategy', 'Implementation', 'Collision Resistance', 'Suitability'],
        rows: [
          ['Naive XOR', '`h1 ^ h2`', 'Very poor: `(x, x)` always hashes to 0; `(a, b) == (b, a)`', 'Do not use'],
          ['Bit-mixing (Boost)', '`h1 ^ (h2 + 0x9e3779b9 + (h1<<6) + (h1>>2))`', 'High: breaks symmetry and distributes bits evenly', 'Recommended for composite pairs and tuples'],
          ['64-bit coordinate packing', '`((long long)x << 32) | (unsigned int)y`', 'Perfect: zero collisions for 32-bit coordinates', 'Optimal when both coordinates fit in 32-bit integers'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Anti-hash tests in competitive programming',
        body: 'In GCC libstdc++, the default `std::hash<int>` is the identity function: `hash(x) = x`. In competitive programming platforms with open hack phases, opponents can craft test cases where thousands of integers share the same modulo table size, turning `unordered_map` into an O(N²) linked list that triggers Time Limit Exceeded. Using `std::map` (O(log N) red-black tree) or a custom randomised hash wrapper prevents these worst-case attacks.',
      },
    ],
    keyTakeaways: [
      '`std::unordered_map` cannot hash `std::pair` or `std::vector` without a custom hash functor.',
      'Pass the custom hash struct as the third template parameter to `unordered_map`.',
      'Never combine field hashes using raw XOR alone; incorporate bit shifts to avoid symmetry collisions.',
      'For 32-bit coordinate pairs, packing both into a single 64-bit integer avoids custom hash structs entirely.',
    ],
    practice: {
      prompt: 'Given a collection of 2D points, find the maximum number of points that lie on the same straight line by storing slope fractions pair<int, int> in an unordered_map using a custom hash functor.',
      leetcode: {
        title: 'Max Points on a Line',
        slug: 'max-points-on-a-line',
      },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-31.14',
    language: 'cpp',
    summary: 'Manage dynamic resources using unique_ptr and shared_ptr, and recognize why LeetCode relies on raw pointers.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'In traditional C++, memory allocated on the heap using `new` must be manually reclaimed using `delete`. If a program returns early, encounters an unexpected edge case, or loses track of a pointer, that memory is leaked. Modern C++ manages heap memory through **Resource Acquisition Is Initialization (RAII)** using **smart pointers** from `<memory>`. Smart pointers are class templates that encapsulate raw pointers and automatically deallocate the underlying heap memory when the smart pointer leaves scope.',
      },
      { kind: 'heading', text: 'unique_ptr versus shared_ptr' },
      {
        kind: 'text',
        body: '`std::unique_ptr<T>` maintains exclusive ownership of a heap resource. It cannot be copied, ensuring that exactly one owner is responsible for deleting the object. It incurs zero memory or execution overhead compared to a raw pointer. `std::shared_ptr<T>` maintains shared ownership through an internal reference counter. Each time a `shared_ptr` is copied, the reference count increments; when a copy goes out of scope, the count decrements. When the reference count reaches zero, the managed object is deleted.',
      },
      {
        kind: 'code',
        caption: 'RAII with unique_ptr and ownership transfer',
        code: `#include <iostream>
#include <memory>
using namespace std;

struct TreeNode {
    int val;
    unique_ptr<TreeNode> left;
    unique_ptr<TreeNode> right;
    TreeNode(int v) : val(v), left(nullptr), right(nullptr) {}
};

int main() {
    // make_unique allocates on heap safely (C++14)
    auto root = make_unique<TreeNode>(10);
    root->left = make_unique<TreeNode>(5);
    root->right = make_unique<TreeNode>(15);

    cout << "Root value: " << root->val << '\\n';
    cout << "Left child: " << root->left->val << '\\n';

    // Transfer ownership using std::move
    unique_ptr<TreeNode> new_owner = move(root);
    // root is now nullptr; new_owner manages the tree

    if (!root) {
        cout << "Original root pointer is now null\\n";
    }

    // Entire tree is automatically deleted when new_owner exits main
    return 0;
}`,
      },
      { kind: 'heading', text: 'Why LeetCode rarely uses smart pointers' },
      {
        kind: 'text',
        body: 'LeetCode problem definitions use raw pointers almost exclusively: `TreeNode* root` and `ListNode* head`. Understanding why helps avoid over-engineering during technical interviews.',
      },
      {
        kind: 'table',
        headers: ['Factor', 'Production Systems', 'LeetCode / Online Judges'],
        rows: [
          ['Lifetime management', 'Long-running services must prevent memory leaks', 'The judge process terminates after evaluating test cases'],
          ['Signature constraints', 'Designed by the team using modern RAII types', 'Locked fixed signatures: `TreeNode*`, `ListNode*`'],
          ['Performance overhead', 'Preventing leaks outweighs small overhead', 'Atomic increments in `shared_ptr` add overhead on tight loops'],
          ['Ownership clarity', 'Distinct unique vs shared ownership semantics', 'The judge harness owns the memory; solutions only inspect it'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Attempting to copy a unique_ptr',
        body: 'Because `unique_ptr` enforces exclusive ownership, its copy constructor and copy assignment operator are explicitly deleted. Writing `unique_ptr<Node> p2 = p1;` causes a compilation error. To transfer ownership to a new variable or function, you must explicitly write `unique_ptr<Node> p2 = std::move(p1);`.',
      },
    ],
    keyTakeaways: [
      '`unique_ptr` guarantees exclusive ownership and automatically frees memory with zero runtime overhead.',
      '`shared_ptr` uses reference counting for shared ownership, deleting memory when the count reaches zero.',
      'Use `std::make_unique` and `std::make_shared` to instantiate smart pointers safely.',
      'LeetCode uses raw pointers because test runners own the memory and process teardown reclaims heap space.',
    ],
    practice: {
      prompt: 'Implement a binary tree node struct where left and right children are unique_ptr<TreeNode>. Write a recursive function to compute the height of the tree, passing the root by const reference.',
    },
  },
];
