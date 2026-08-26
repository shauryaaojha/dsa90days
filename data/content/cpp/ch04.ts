import type { Lesson } from '../types';

/**
 * Chapter 4 — Functions.
 * Covers the three parameter-passing modes properly, since choosing the wrong
 * one is a leading cause of both Time Limit Exceeded and "why didn't my change
 * stick" bugs.
 */
export const ch04: Lesson[] = [
  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-4.1',
    language: 'cpp',
    summary: 'Split declaration from definition, and fix the "was not declared in this scope" error for good.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A function has two parts, and C++ lets you separate them. The **declaration** (or prototype) announces the name, the return type and the parameter types. The **definition** supplies the body.',
      },
      {
        kind: 'code',
        caption: 'Declaration and definition',
        code: `// Declaration — ends in a semicolon, no body
int add(int a, int b);

// Definition — the actual implementation
int add(int a, int b) {
    return a + b;
}`,
      },
      {
        kind: 'text',
        body: 'Usually you write both at once, which is a definition that also serves as a declaration. The split only matters because of one rule: **the compiler reads top to bottom and must have seen a declaration before the call.**',
      },
      {
        kind: 'code',
        caption: 'The error, and the two ways to fix it',
        code: `// BROKEN — helper is used before the compiler knows it exists
int main() {
    cout << helper(5);      // error: 'helper' was not declared in this scope
}
int helper(int x) { return x * 2; }

// FIX 1 — define it above main
int helper(int x) { return x * 2; }
int main() { cout << helper(5); }

// FIX 2 — declare it above, define it below
int helper(int x);
int main() { cout << helper(5); }
int helper(int x) { return x * 2; }`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Inside a class, order does not matter',
        body: 'This is why LeetCode never trips you up here. Member functions of a `class` can call each other in any order, because the compiler reads the entire class definition before compiling any of the bodies. So inside `class Solution` you can put your recursive helper below the method that calls it. In plain top-level code, order matters.',
      },
      { kind: 'heading', text: 'The signature is what identifies a function' },
      {
        kind: 'text',
        body: 'A function\'s **signature** is its name plus its parameter types. The return type is not part of it — which is why you can overload on parameters but not on return type alone.',
      },
      {
        kind: 'code',
        code: `int  process(int x);      // signature: process(int)
void process(double x);   // signature: process(double)  — different, fine

int  process(int x);
double process(int x);    // ERROR — same signature, only return type differs`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Declaring but never defining gives a link error',
        body: 'If you declare `int helper(int);` and call it but never write the body, the code compiles fine and then fails at the link stage with `undefined reference to \'helper(int)\'`. That message always means the same thing: something was promised to exist and never did. Check for a typo in the definition\'s signature — a mismatched parameter type makes it a *different* function.',
      },
      {
        kind: 'text',
        body: 'Parameter names are optional in a declaration — `int add(int, int);` is legal. Include them anyway; they document what each argument means at the point where a reader is most likely to look.',
      },
    ],
    keyTakeaways: [
      'A declaration announces the signature; a definition supplies the body.',
      'A function must be declared before it is called — define it above, or forward-declare it.',
      'Inside a class, member functions can be defined in any order.',
      '`undefined reference` at link time means declared-but-never-defined, often a signature typo.',
    ],
    practice: {
      prompt: 'Write a program calling a function defined below `main`, watch it fail, then fix it twice — once by moving the definition up and once by adding a forward declaration. Then declare a function you never define and read the link error, so you can tell it apart from a compile error on sight.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-4.2',
    language: 'cpp',
    summary: 'Take inputs and hand back results, including how to return more than one value.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Parameters are what a function needs; the return value is what it gives back. A C++ function returns exactly **one** value, which feels limiting the first time you need two — the answer is a `pair`, a `struct`, or an out-parameter, and this lesson shows them in the order you should reach for them.',
      },
      {
        kind: 'code',
        caption: 'Parameters in, one value out',
        code: `int maxOf(int a, int b) {      // two parameters
    return a > b ? a : b;      // one return value
}

int result = maxOf(3, 7);      // 3 and 7 are the arguments`,
      },
      {
        kind: 'text',
        body: '**Parameters** are the names in the definition; **arguments** are the actual values passed at the call site. The distinction matters when reading error messages, which talk about parameters.',
      },
      { kind: 'heading', text: 'void: functions that return nothing' },
      {
        kind: 'code',
        code: `void printAll(const vector<int>& v) {
    for (int x : v) cout << x << " ";
    cout << "\\n";
    // no return statement needed
}

// A bare 'return;' can still be used to exit early:
void process(int x) {
    if (x < 0) return;      // stop here
    cout << x;
}`,
      },
      { kind: 'heading', text: 'Returning multiple values' },
      {
        kind: 'text',
        body: 'C++ returns exactly one value, but that value can be a container or a pair. Four options, roughly in order of how often you will use them:',
      },
      {
        kind: 'code',
        caption: '1. vector — what LeetCode usually expects',
        code: `vector<int> twoSum(vector<int>& nums, int target) {
    // ...
    return {i, j};          // braces build the vector inline
}`,
      },
      {
        kind: 'code',
        caption: '2. pair — exactly two values',
        code: `#include <utility>

pair<int, int> minMax(vector<int>& v) {
    return {*min_element(v.begin(), v.end()),
            *max_element(v.begin(), v.end())};
}

auto [lo, hi] = minMax(nums);      // structured binding (C++17)`,
      },
      {
        kind: 'code',
        caption: '3. Output parameters — write into a reference',
        code: `void minMax(const vector<int>& v, int& lo, int& hi) {
    lo = *min_element(v.begin(), v.end());
    hi = *max_element(v.begin(), v.end());
}

int lo, hi;
minMax(nums, lo, hi);       // lo and hi are filled in`,
      },
      {
        kind: 'code',
        caption: '4. struct — when the values deserve names',
        code: `struct Result {
    int index;
    bool found;
};

Result search(vector<int>& v, int target) {
    for (int i = 0; i < v.size(); i++)
        if (v[i] == target) return {i, true};
    return {-1, false};
}`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Never return a reference or pointer to a local variable',
        body: 'A local variable is destroyed when the function returns, so a reference to it dangles — the caller reads freed memory. `int& bad() { int x = 5; return x; }` compiles with a warning and produces garbage or a crash. Returning by value is safe: modern C++ moves the result rather than copying it, so returning a large `vector` by value costs nothing.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Every path must return',
        body: 'Falling off the end of a non-void function is undefined behaviour — you get whatever happened to be in the return register. The compiler warns with `-Wall` (`control reaches end of non-void function`), but only warns. If a loop might not find anything, add the fallback `return -1;` at the bottom.',
      },
    ],
    keyTakeaways: [
      'Parameters are in the definition, arguments at the call site.',
      'Return several values with a `vector`, a `pair`, output references, or a `struct`.',
      'Never return a reference or pointer to a local variable — it dangles immediately.',
      'Returning a big container by value is cheap; the compiler moves rather than copies.',
    ],
    practice: {
      prompt: 'Write `minMax` three ways — returning a `pair`, using two output references, and returning a `struct` — then call each. Deciding which reads best is a judgement you will make constantly, and having written all three makes the choice fast.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-4.3',
    language: 'cpp',
    summary: 'Understand why changes inside a function do not always reach the caller.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Pass by value is the default: the function receives a **copy** of the argument. Changing the parameter changes only the copy — the caller\'s variable is untouched.',
      },
      {
        kind: 'code',
        caption: 'The copy is independent',
        code: `void increment(int x) {
    x++;                    // modifies the local copy only
}

int main() {
    int n = 5;
    increment(n);
    cout << n;              // still 5
}`,
      },
      {
        kind: 'text',
        body: 'This is the behaviour you want most of the time. The function cannot accidentally corrupt the caller\'s data, so it is easy to reason about.',
      },
      { kind: 'heading', text: 'The cost: copying a container copies everything' },
      {
        kind: 'code',
        code: `int sum(vector<int> v) {        // copies ALL n elements on every call
    int total = 0;
    for (int x : v) total += x;
    return total;
}`,
      },
      {
        kind: 'text',
        body: 'For a vector of 100,000 elements, every call allocates fresh memory and copies 100,000 integers. Do that inside a loop and you have turned an O(n) algorithm into O(n²) without changing a line of the actual logic.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'This is a real cause of Time Limit Exceeded',
        body: 'A recursive helper taking `vector<int> v` by value copies the whole vector at every level of recursion. The algorithm is correct, the complexity analysis on paper is right, and it still times out — because the copying is invisible in the code. If a recursive solution is unexpectedly slow, check the parameter types first.',
      },
      {
        kind: 'table',
        headers: ['Pass by value when…', 'Avoid it when…'],
        rows: [
          ['The type is small: `int`, `char`, `bool`, `double`', 'The type is a `vector`, `string`, `map` or `set`'],
          ['You want a scratch copy you can modify freely', 'The function is called inside a loop or recursion'],
          ['The function must not affect the caller', 'You actually need to modify the caller\'s data'],
        ],
      },
      {
        kind: 'code',
        caption: 'When a copy is genuinely what you want',
        code: `// Sorting a copy so the caller's vector stays in its original order
int median(vector<int> v) {          // deliberate copy
    sort(v.begin(), v.end());
    return v[v.size() / 2];
}`,
      },
      {
        kind: 'text',
        body: 'Here the copy is the point — the caller keeps their original ordering. Write a comment saying so, or the next reader will "optimise" it into a bug.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Arrays are the exception',
        body: 'A raw array passed to a function does *not* get copied — it silently decays to a pointer to its first element, so the function can modify the caller\'s data. `void f(int arr[])` is really `void f(int* arr)`. This inconsistency is one of several reasons to prefer `vector` over raw arrays.',
      },
    ],
    keyTakeaways: [
      'Pass by value copies the argument; the caller\'s variable is never modified.',
      'Copying a container copies every element — expensive in loops and recursion.',
      'Pass primitives by value; pass containers by reference.',
      'Raw arrays are the exception: they decay to pointers and are not copied.',
    ],
    practice: {
      prompt: 'Write a function taking `vector<int>` by value that sorts and returns the median, and confirm the caller\'s vector is unchanged. Then time it against the same function taking `const vector<int>&` on a million elements — the difference makes the cost concrete rather than theoretical.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-4.4',
    language: 'cpp',
    summary: 'Give a function direct access to the caller\'s variable — the mode LeetCode uses.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A reference parameter is an **alias** for the caller\'s variable. No copy is made, and any modification is visible to the caller. You create one with `&` in the parameter list.',
      },
      {
        kind: 'code',
        caption: 'The same function, with and without &',
        code: `void increment(int x)  { x++; }     // by value     — caller unaffected
void increment(int& x) { x++; }     // by reference — caller's variable changes

int n = 5;
increment(n);
cout << n;        // 6`,
      },
      { kind: 'heading', text: 'The two reasons to use it' },
      {
        kind: 'text',
        body: '**1. To modify the caller\'s data.** Swapping, filling an output parameter, sorting in place.',
      },
      {
        kind: 'code',
        code: `void swapValues(int& a, int& b) {
    int temp = a;
    a = b;
    b = temp;
}
// (the standard library already provides swap(a, b) — use that)`,
      },
      {
        kind: 'text',
        body: '**2. To avoid a copy**, even when you have no intention of modifying anything. That is what `const&` is for.',
      },
      {
        kind: 'code',
        code: `int sum(const vector<int>& v) {     // no copy, and cannot modify v
    int total = 0;
    for (int x : v) total += x;
    return total;
}`,
      },
      {
        kind: 'table',
        headers: ['Signature', 'Copies?', 'Can modify caller?', 'Use for'],
        rows: [
          ['`f(vector<int> v)`', 'Yes', 'No', 'Rarely — only when you want a scratch copy'],
          ['`f(vector<int>& v)`', 'No', 'Yes', 'In-place modification'],
          ['`f(const vector<int>& v)`', 'No', 'No', 'Reading — the default for containers'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Why LeetCode signatures use &',
        body: 'LeetCode writes `vector<int>& nums` — a non-const reference — for two reasons: it avoids copying the test input, and it permits you to sort or modify in place when that helps. You are free to mutate it. Just be aware the judge\'s vector really does change.',
      },
      { kind: 'heading', text: 'References in range-based for loops' },
      {
        kind: 'code',
        code: `vector<int> nums = {1, 2, 3};

for (int x : nums)  x *= 2;      // modifies copies — nums is unchanged
for (int& x : nums) x *= 2;      // modifies nums   → {2, 4, 6}

for (const string& s : words) { ... }   // no copy, read-only`,
      },
      {
        kind: 'text',
        body: 'That one `&` is the whole difference between a loop that works and a loop that silently does nothing. When a "modify every element" loop appears to have no effect, this is almost always why.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'A reference must be bound at creation and can never be re-seated',
        body: '`int& r = x;` binds `r` to `x` permanently. A later `r = y;` does not point `r` at `y` — it assigns `y`\'s value into `x`. You also cannot declare an uninitialised reference (`int& r;` is an error) and there is no such thing as a null reference. If you need something re-pointable or optionally absent, you need a pointer.',
      },
    ],
    keyTakeaways: [
      '`&` makes the parameter an alias — no copy, and modifications reach the caller.',
      '`const&` is the default for reading containers: no copy, no accidental modification.',
      '`for (int& x : v)` modifies the container; `for (int x : v)` modifies copies.',
      'A reference is bound once and cannot be re-seated or made null.',
    ],
    practice: {
      prompt: 'Write a `doubleAll` function that multiplies every element of a vector by two, first with `vector<int> v` and then with `vector<int>& v`, and print the caller\'s vector after each. Then do the same with `for (int x : v)` versus `for (int& x : v)` — this is the single most common "my code does nothing" bug.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-4.5',
    language: 'cpp',
    summary: 'Pass addresses explicitly — needed for linked lists, trees, and anything optional.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A pointer parameter receives a **memory address**. Like a reference it lets the function reach the caller\'s data, but the syntax is explicit: you pass `&x` and the function writes `*p`.',
      },
      {
        kind: 'code',
        caption: 'The three modes side by side',
        code: `void byValue(int x)      { x = 99; }        // caller unaffected
void byReference(int& x) { x = 99; }        // caller's variable becomes 99
void byPointer(int* x)   { *x = 99; }       // same, but explicit

int n = 5;
byValue(n);       // n is 5
byReference(n);   // n is 99
byPointer(&n);    // n is 99  — note the & at the call site`,
      },
      {
        kind: 'table',
        headers: ['', 'Reference `&`', 'Pointer `*`'],
        rows: [
          ['Can be null', 'No', 'Yes — `nullptr` means "nothing here"'],
          ['Can be re-pointed', 'No', 'Yes'],
          ['Call-site syntax', '`f(x)` — invisible', '`f(&x)` — explicit'],
          ['Inside the function', '`x`', '`*p`'],
          ['Needs a null check', 'Never', 'Usually'],
        ],
      },
      { kind: 'heading', text: 'Where you actually meet pointers in DSA' },
      {
        kind: 'text',
        body: 'Linked lists and trees. LeetCode\'s node types are always passed as pointers, because a node genuinely can be absent — and `nullptr` is how you say "no node here".',
      },
      {
        kind: 'code',
        caption: 'The shape of every tree problem',
        code: `struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
};

int maxDepth(TreeNode* root) {
    if (root == nullptr) return 0;              // the null check IS the base case
    return 1 + max(maxDepth(root->left), maxDepth(root->right));
}`,
      },
      {
        kind: 'text',
        body: 'This is why a reference would not work here: an empty subtree has to be representable, and references cannot be null. The null check doubles as the recursion\'s base case.',
      },
      {
        kind: 'code',
        caption: 'Arrow vs dot',
        code: `TreeNode* p = root;
p->val;         // through a pointer
(*p).val;       // identical, but nobody writes this

TreeNode node;
node.val;       // through an object directly`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Dereferencing null crashes',
        body: '`root->val` when `root` is `nullptr` is undefined behaviour — on LeetCode it shows up as a Runtime Error, often on a hidden test case with an empty tree or list. Check before you dereference, and remember short-circuiting: `if (node != nullptr && node->val == target)` is safe, the reverse order is not.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Prefer references unless you need null',
        body: 'The rule that keeps code simple: use a reference when the argument must always exist, and a pointer when "nothing" is a legitimate value or the target needs to change. In practice that means `const vector<int>&` for containers and `TreeNode*` for nodes.',
      },
      {
        kind: 'text',
        body: 'One more form you will occasionally see: `TreeNode*& node` — a *reference to a pointer*. It lets a function change which node the caller\'s pointer points at, which is how in-place BST insertion is sometimes written.',
      },
    ],
    keyTakeaways: [
      'Pointers hold addresses: pass `&x`, access with `*p` or `p->member`.',
      'Pointers can be null and re-pointed; references cannot be either.',
      'Tree and linked-list nodes are pointers because absence must be representable.',
      'Always null-check before dereferencing — `->` on `nullptr` is a Runtime Error.',
    ],
    practice: {
      prompt: 'Write `maxDepth` for a binary tree and test it on an empty tree (`nullptr`). Then remove the null check and watch it crash. The base case and the null check being the same line is the central idea of nearly every tree problem.',
      leetcode: { title: 'Maximum Depth of Binary Tree', slug: 'maximum-depth-of-binary-tree' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-4.6',
    language: 'cpp',
    summary: 'Give parameters fallback values so recursive helpers stay easy to call.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'A default argument is a value used when the caller omits that argument.',
      },
      {
        kind: 'code',
        code: `int power(int base, int exp = 2) {
    int result = 1;
    for (int i = 0; i < exp; i++) result *= base;
    return result;
}

power(5);       // 25 — exp defaults to 2
power(5, 3);    // 125`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Defaults must be the trailing parameters',
        body: 'Once one parameter has a default, every parameter after it must too. `f(int a = 1, int b)` is an error, because a call like `f(5)` would be ambiguous about which parameter the 5 belongs to. Arguments are matched by position, never by name.',
      },
      { kind: 'heading', text: 'Where this earns its place: recursive helpers' },
      {
        kind: 'text',
        body: 'Recursive functions usually need bookkeeping parameters — a depth, an index, an accumulator — that the first call should not have to supply. A default value hides that.',
      },
      {
        kind: 'code',
        caption: 'Without and with a default',
        code: `// Without — the caller has to know about the index
int helper(vector<int>& nums, int index);
helper(nums, 0);      // awkward: why 0?

// With — the entry call reads naturally
int helper(vector<int>& nums, int index = 0) {
    if (index == nums.size()) return 0;
    return nums[index] + helper(nums, index + 1);
}

helper(nums);         // clean`,
      },
      {
        kind: 'code',
        caption: 'A DFS with a depth counter',
        code: `void dfs(TreeNode* node, int depth = 0) {
    if (node == nullptr) return;
    cout << "depth " << depth << ": " << node->val << "\\n";
    dfs(node->left,  depth + 1);
    dfs(node->right, depth + 1);
}

dfs(root);      // starts at depth 0 automatically`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Put the default on the declaration, not both',
        body: 'If you forward-declare a function and also define it, the default belongs on the declaration only. Repeating it in the definition is a compile error (`default argument given for parameter 2`). Inside a class, put the default in the class declaration.',
      },
      {
        kind: 'code',
        caption: 'Inside class Solution',
        code: `class Solution {
public:
    int sumFrom(vector<int>& nums, int i = 0) {   // default lives here
        if (i == nums.size()) return 0;
        return nums[i] + sumFrom(nums, i + 1);
    }
};`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Defaults and overloading can become ambiguous',
        body: 'If you have both `f(int a)` and `f(int a, int b = 0)`, the call `f(5)` matches both and fails to compile. When you find yourself adding a default to an overloaded function, pick one mechanism or the other.',
      },
    ],
    keyTakeaways: [
      'Default arguments must occupy the trailing parameter positions.',
      'They keep recursive helper entry calls clean by hiding bookkeeping parameters.',
      'Specify the default once — on the declaration, not also on the definition.',
      'Combining defaults with overloading easily produces ambiguous calls.',
    ],
    practice: {
      prompt: 'Write a recursive sum over a vector using `int index = 0`, and call it as `sum(nums)`. Then add a second overload without the index parameter and watch the ambiguity error appear — knowing that error message saves confusion when it shows up in real code.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-4.7',
    language: 'cpp',
    summary: 'Give one name to several functions that differ by parameter types.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'Overloading means defining several functions with the same name but different parameter lists. The compiler picks the right one from the argument types at the call site.',
      },
      {
        kind: 'code',
        code: `int maxOf(int a, int b)          { return a > b ? a : b; }
double maxOf(double a, double b) { return a > b ? a : b; }
int maxOf(int a, int b, int c)   { return maxOf(maxOf(a, b), c); }

maxOf(3, 7);         // calls the int version
maxOf(3.5, 7.1);     // calls the double version
maxOf(1, 2, 3);      // calls the three-argument version`,
      },
      {
        kind: 'text',
        body: 'Overloads must differ in the **number or types** of parameters. Differing only in return type is an error, because the compiler chooses from the arguments alone and would have no way to decide.',
      },
      {
        kind: 'code',
        code: `int  process(int x);
void process(int x);      // ERROR — same parameters, only return type differs`,
      },
      { kind: 'heading', text: 'Where you meet it in the standard library' },
      {
        kind: 'text',
        body: 'You have been using overloads since your first `cout` line. `operator<<` is overloaded for `int`, `double`, `string`, `char` and more — which is why one syntax prints everything.',
      },
      {
        kind: 'code',
        code: `cout << 42;         // the int overload
cout << 3.14;       // the double overload
cout << "text";     // the const char* overload

sort(v.begin(), v.end());              // two-argument overload
sort(v.begin(), v.end(), comparator);  // three-argument overload`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Ambiguity when no overload is an exact match',
        body: 'Calling `maxOf(3, 7.5)` with only `maxOf(int,int)` and `maxOf(double,double)` available is ambiguous — converting the `int` up or the `double` down are equally valid, so the compiler refuses to guess. The error says `call of overloaded ... is ambiguous`. Fix it by casting explicitly at the call site.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'const alone is not enough to overload on',
        body: '`f(int x)` and `f(const int x)` are the *same* signature, because the parameter is a copy either way and the `const` changes nothing for the caller. However, `f(vector<int>&)` and `f(const vector<int>&)` genuinely are different overloads — there the const affects what the function may do with the caller\'s object.',
      },
      {
        kind: 'text',
        body: 'In DSA code you will overload rarely — usually a differently-named helper is clearer. The reason to understand it is reading the standard library and answering the interview question about the difference between overloading (same name, different parameters, chosen at compile time) and overriding (a derived class replacing a virtual method, chosen at run time).',
      },
    ],
    keyTakeaways: [
      'Overloads must differ in parameter number or types, not just return type.',
      'The compiler selects the overload from the argument types at compile time.',
      '`cout <<` and `sort` are overloads you already use constantly.',
      'Overloading is compile-time and by parameters; overriding is run-time and by inheritance.',
    ],
    practice: {
      prompt: 'Write three `maxOf` overloads — two ints, two doubles, three ints — and call each. Then call `maxOf(3, 7.5)` and read the ambiguity error. Being able to explain overloading versus overriding is a routine interview question, and having written both makes the answer concrete.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-4.8',
    language: 'cpp',
    summary: 'Know exactly where each variable lives and when it disappears.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A variable\'s **scope** is the region of code where its name is visible. In C++ scope is defined by braces: a variable exists from its declaration to the closing `}` of the block containing it, and is destroyed there.',
      },
      {
        kind: 'code',
        caption: 'Block scope',
        code: `int main() {
    int a = 1;                  // visible for the rest of main

    if (true) {
        int b = 2;              // visible only inside this if block
        cout << a << b;         // both visible here
    }

    cout << b;                  // ERROR — 'b' was not declared in this scope
}`,
      },
      { kind: 'heading', text: 'Loop variables die with the loop' },
      {
        kind: 'code',
        code: `for (int i = 0; i < n; i++) {
    // i is visible here
}
cout << i;          // ERROR — i no longer exists

// If you need the final value, declare it outside:
int i = 0;
for (; i < n; i++) { ... }
cout << i;          // fine`,
      },
      {
        kind: 'text',
        body: 'This matters in linear searches where you want to know where the loop stopped. Either declare the index outside, or restructure to return the answer from inside the loop.',
      },
      { kind: 'heading', text: 'Shadowing: an inner name hides an outer one' },
      {
        kind: 'code',
        code: `int count = 10;

void f() {
    int count = 5;          // shadows the outer count
    count++;                // modifies the INNER one → 6
    // the outer count is still 10
}`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Shadowing inside a loop is a real bug',
        body: 'Re-declaring a variable inside a loop body creates a *new* variable each iteration, so any value you accumulate is thrown away. `for (...) { int sum = 0; sum += x; }` resets `sum` every time and always ends at one element\'s value. Compile with `-Wshadow` to be warned about this.',
      },
      {
        kind: 'code',
        caption: 'The accumulator bug',
        code: `// BROKEN — sum is recreated each iteration
for (int x : nums) {
    int sum = 0;
    sum += x;
}

// CORRECT — declared once, outside
int sum = 0;
for (int x : nums) {
    sum += x;
}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Declare variables in the smallest scope that works',
        body: 'Narrow scope means fewer names in flight, no accidental reuse, and the compiler catching mistakes for you. Declare loop counters inside the `for`, temporaries inside the block that uses them, and only widen a variable\'s scope when you genuinely need the value afterwards.',
      },
      {
        kind: 'text',
        body: 'One special case worth knowing: a variable declared inside a `switch` case needs its own braces, since the case labels do not create scopes on their own. `case 1: { int x = 5; break; }`.',
      },
    ],
    keyTakeaways: [
      'Scope is bounded by braces — a variable dies at the closing `}`.',
      'A `for` loop\'s counter does not exist after the loop.',
      'An inner declaration shadows an outer one of the same name.',
      'Declaring an accumulator inside the loop resets it every iteration.',
    ],
    practice: {
      prompt: 'Write the accumulator bug deliberately — declare `sum` inside the loop — and confirm the total is wrong. Then compile with `-Wshadow` and read the warning. This bug is invisible on a quick read, so having seen it fire once is what makes you spot it later.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-4.9',
    language: 'cpp',
    summary: 'Use globals where they genuinely help in recursion, and know why they usually hurt.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A **local** variable is declared inside a function and exists only during that call. A **global** is declared outside every function and exists for the whole program, visible everywhere below its declaration.',
      },
      {
        kind: 'code',
        code: `int counter = 0;          // global — lives for the program's lifetime

void increment() {
    int temp = 1;         // local — created and destroyed each call
    counter += temp;      // globals are visible without being passed
}`,
      },
      {
        kind: 'table',
        headers: ['', 'Local', 'Global'],
        rows: [
          ['Lifetime', 'One function call', 'Whole program'],
          ['Visibility', 'Its own block', 'Every function below it'],
          ['Initial value', 'Garbage unless you initialise', 'Zero-initialised automatically'],
          ['Stored in', 'The stack', 'Static memory'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Globals are zero-initialised; locals are not',
        body: 'This is a genuine difference, not a stylistic one. `int global;` is reliably 0, while `int local;` inside a function holds whatever was in that memory. Never rely on the local case — always initialise explicitly.',
      },
      { kind: 'heading', text: 'The legitimate use: recursion state' },
      {
        kind: 'text',
        body: 'Threading a result variable through every level of a deep recursion is noisy. A member variable (in `class Solution`) or a global holds it cleanly.',
      },
      {
        kind: 'code',
        caption: 'The idiomatic LeetCode pattern',
        code: `class Solution {
    int best = 0;                          // member — shared across the recursion

    int dfs(TreeNode* node) {
        if (node == nullptr) return 0;
        int left  = max(0, dfs(node->left));
        int right = max(0, dfs(node->right));
        best = max(best, node->val + left + right);   // update shared state
        return node->val + max(left, right);
    }

public:
    int maxPathSum(TreeNode* root) {
        best = INT_MIN;                    // reset before starting
        dfs(root);
        return best;
    }
};`,
      },
      {
        kind: 'text',
        body: 'A member variable is the right tool here — it is the same idea as a global but scoped to the class, so it does not leak into the rest of the program.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'LeetCode reuses your Solution object across test cases',
        body: 'The judge may call your method many times on one `Solution` instance, so member state left over from the previous test case is still there. Always reset it at the start of the public method, as `best = INT_MIN;` does above. Symptom: your solution passes the first test and fails every one after it — a genuinely confusing bug if you do not know the cause.',
      },
      { kind: 'heading', text: 'Why globals are discouraged otherwise' },
      {
        kind: 'text',
        body: 'Any function can modify a global, so when its value is wrong you have to read the whole program to find out who changed it. Function signatures stop describing what a function actually depends on, and testing a function in isolation becomes impossible.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Shadowing hides the global silently',
        body: 'If a local has the same name as a global, the local wins inside that function, and the global goes untouched. You can reach the global explicitly with the scope operator — `::counter` — but if you need that, the names should have been different.',
      },
    ],
    keyTakeaways: [
      'Globals live for the whole program and are zero-initialised; locals are not.',
      'Shared recursion state belongs in a class member, not a true global.',
      'Reset member state at the start of the public method — LeetCode reuses the object.',
      'Otherwise prefer parameters: they document what a function actually depends on.',
    ],
    practice: {
      prompt: 'Write a recursive tree function that tracks a maximum in a class member, then call it twice on different trees without resetting — watch the second answer be wrong. That is exactly the bug LeetCode\'s object reuse produces, and it is much easier to recognise once you have caused it yourself.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-4.10',
    language: 'cpp',
    summary: 'Structure a LeetCode solution with helpers so the recursion stays readable.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'LeetCode gives you one method with a fixed signature. Almost every non-trivial solution needs a second function alongside it — because recursion needs parameters the given signature does not have.',
      },
      {
        kind: 'code',
        caption: 'The standard shape',
        code: `class Solution {
private:
    // The helper carries the extra parameters recursion needs.
    void dfs(TreeNode* node, int depth, vector<int>& result) {
        if (node == nullptr) return;
        if (depth == result.size()) result.push_back(node->val);
        dfs(node->right, depth + 1, result);
        dfs(node->left,  depth + 1, result);
    }

public:
    // The judge calls this one. It sets up and delegates.
    vector<int> rightSideView(TreeNode* root) {
        vector<int> result;
        dfs(root, 0, result);
        return result;
    }
};`,
      },
      {
        kind: 'text',
        body: 'The public method\'s job is to create the state, call the helper, and return the answer. The helper does the actual work.',
      },
      { kind: 'heading', text: 'Pass accumulators by reference' },
      {
        kind: 'code',
        code: `void dfs(TreeNode* node, vector<int> result)    // WRONG — copies at every level
void dfs(TreeNode* node, vector<int>& result)   // right — one shared vector`,
      },
      {
        kind: 'text',
        body: 'This is the pass-by-value cost from earlier, in the place it hurts most. Copying the result vector at every recursion level turns a linear traversal into a quadratic one, and the only symptom is Time Limit Exceeded on large inputs.',
      },
      { kind: 'heading', text: 'The backtracking shape' },
      {
        kind: 'code',
        caption: 'Choose, recurse, un-choose',
        code: `class Solution {
    void backtrack(vector<int>& nums, vector<int>& current,
                   vector<bool>& used, vector<vector<int>>& result) {
        if (current.size() == nums.size()) {
            result.push_back(current);      // a copy is correct HERE — we save it
            return;
        }
        for (int i = 0; i < nums.size(); i++) {
            if (used[i]) continue;

            used[i] = true;                 // choose
            current.push_back(nums[i]);

            backtrack(nums, current, used, result);

            current.pop_back();             // un-choose
            used[i] = false;
        }
    }

public:
    vector<vector<int>> permute(vector<int>& nums) {
        vector<vector<int>> result;
        vector<int> current;
        vector<bool> used(nums.size(), false);
        backtrack(nums, current, used, result);
        return result;
    }
};`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Every backtracking solution is this shape',
        body: 'Base case saves a copy of the current state; the loop chooses an option, recurses, then undoes the choice. Once you can write this skeleton from memory, permutations, subsets, combinations, N-Queens and Sudoku are variations on it rather than separate problems.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Forgetting to un-choose',
        body: 'Leaving out `current.pop_back()` or `used[i] = false` is the defining backtracking bug. The state leaks into sibling branches and you get duplicate or malformed results. Whenever you write a "choose" line, write its matching "un-choose" immediately, before filling in anything else.',
      },
      { kind: 'heading', text: 'Two other useful patterns' },
      {
        kind: 'code',
        caption: 'Lambdas for short helpers',
        code: `vector<int> result;
function<void(TreeNode*)> dfs = [&](TreeNode* node) {
    if (!node) return;
    result.push_back(node->val);
    dfs(node->left);
    dfs(node->right);
};
dfs(root);`,
      },
      {
        kind: 'text',
        body: 'Capturing by reference with `[&]` gives the lambda access to everything around it, so there are no parameters to thread. A recursive lambda needs the `std::function` type from `<functional>` because it must name itself.',
      },
      {
        kind: 'code',
        caption: 'Member variables instead of parameters',
        code: `class Solution {
    vector<int> result;              // shared — no need to pass it down

    void dfs(TreeNode* node) {
        if (!node) return;
        result.push_back(node->val);
        dfs(node->left);
        dfs(node->right);
    }

public:
    vector<int> inorder(TreeNode* root) {
        result.clear();              // reset — the judge reuses the object
        dfs(root);
        return result;
    }
};`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Name helpers for what they do',
        body: '`dfs`, `backtrack` and `helper` are conventional and fine. But `countPaths` or `maxFrom` tells a reader more, and in an interview the naming is part of what is being assessed. Add a one-line comment stating what the helper returns — especially when the return value differs from the answer, as in the max-path-sum example.',
      },
    ],
    keyTakeaways: [
      'The public method sets up state and delegates; a private helper does the recursion.',
      'Pass accumulators by reference — copying them per level causes Time Limit Exceeded.',
      'Backtracking is always choose → recurse → un-choose.',
      'Reset member state at the start of the public method, since the judge reuses the object.',
    ],
    practice: {
      prompt: 'Write `permute` using the backtracking skeleton above, from memory if you can. Then deliberately remove the `pop_back()` and study the wrong output — seeing exactly how the state leaks between branches is what makes the un-choose step feel necessary rather than ceremonial.',
      leetcode: { title: 'Permutations', slug: 'permutations' },
    },
  },
];
