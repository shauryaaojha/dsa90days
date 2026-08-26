import type { Lesson } from '../types';

/**
 * Chapter 6 — Pointers and References.
 * Chapter 4 covered these as *parameter modes*. This chapter covers the
 * mechanics: what an address is, what dereferencing does, and why linked
 * structures cannot be built without them.
 */
export const ch06: Lesson[] = [
  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-6.1',
    language: 'cpp',
    summary: 'Get the memory address of a variable and understand what that number means.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Every variable lives at some numbered location in memory. The `&` operator, placed before a variable, gives you that number — its **address**.',
      },
      {
        kind: 'code',
        caption: 'Looking at an address',
        code: `#include <iostream>
using namespace std;

int main() {
    int x = 42;

    cout << x  << endl;      // 42            — the value
    cout << &x << endl;      // 0x7ffee3b8c   — the address (varies every run)
    return 0;
}`,
        output: '42\n0x7ffee3b8c',
      },
      {
        kind: 'text',
        body: 'Think of memory as a very long street of numbered houses, each holding one byte. A variable is a house (or several adjacent ones for a multi-byte type), and `&x` is its house number.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'The address changes on every run',
        body: 'Modern operating systems randomise where a program\'s memory is placed, as a security measure. So the exact number is meaningless to memorise — what matters is the *relationships* between addresses, such as two array elements being four bytes apart.',
      },
      { kind: 'heading', text: 'Storing an address: the pointer' },
      {
        kind: 'code',
        code: `int x = 42;
int* p = &x;         // p holds the ADDRESS of x

cout << p;           // 0x7ffee3b8c — the address
cout << *p;          // 42          — the value at that address (next lesson)`,
      },
      {
        kind: 'text',
        body: 'Read `int* p` as "p is a pointer to an int". The type matters: a pointer knows what kind of thing it points at, which is how the compiler knows how many bytes to read and how far to step in pointer arithmetic.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: '& means three different things',
        body: 'Context decides. Before a *variable* — `&x` — it takes an address. In a *declaration* — `int& r = x;` — it declares a reference. Between two *values* — `a & b` — it is bitwise AND. Reading C++ is largely a matter of noticing which position the symbol is in.',
      },
      {
        kind: 'code',
        caption: 'Addresses of array elements are contiguous',
        code: `int arr[3] = {10, 20, 30};

cout << &arr[0];     // 0x1000
cout << &arr[1];     // 0x1004   — exactly 4 bytes later
cout << &arr[2];     // 0x1008`,
      },
      {
        kind: 'text',
        body: 'This is the contiguity from Chapter 5, made visible. Because elements sit exactly `sizeof(int)` apart, the computer finds `arr[i]` by computing `address_of_arr + i * 4` — one multiplication and one addition, regardless of `i`. That is the whole reason array indexing is O(1).',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Printing a char* prints text, not an address',
        body: '`cout` has a special overload for `char*` that assumes it is a C-string and prints characters until the null terminator. So `cout << &someChar` prints garbage text rather than a number. Cast to `(void*)` when you genuinely want the address.',
      },
    ],
    keyTakeaways: [
      '`&x` yields the memory address of `x`.',
      '`int* p` declares a pointer to an int; `p = &x` makes it point at `x`.',
      'Addresses differ every run because the OS randomises memory layout.',
      'Array elements sit `sizeof(T)` bytes apart — the basis of O(1) indexing.',
    ],
    practice: {
      prompt: 'Print the addresses of three separate `int` variables and of the three elements of an `int` array. The array addresses will be exactly 4 apart while the loose variables may not be — that contrast is the clearest possible demonstration of what "contiguous" actually means.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-6.2',
    language: 'cpp',
    summary: 'Follow a pointer to the value it points at, and write through it.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'The `*` operator, placed before a pointer, **dereferences** it: go to that address and give me what is there. It is the exact inverse of `&`.',
      },
      {
        kind: 'code',
        code: `int x = 42;
int* p = &x;      // p holds x's address

cout << p;        // 0x7ffee3b8c  — the address itself
cout << *p;       // 42           — follow it, read the value

*p = 99;          // follow it, WRITE a value
cout << x;        // 99           — x really did change`,
      },
      {
        kind: 'text',
        body: 'That last part is the point of pointers: writing through `*p` modifies the original variable. There is only one integer here — `x` and `*p` are two ways of naming it.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: '* also means two different things',
        body: 'In a *declaration* — `int* p` — the star is part of the type, meaning "pointer to int". In an *expression* — `*p = 99` — it is the dereference operator. And between two values, `a * b` is multiplication. Same symbol, three jobs, distinguished only by position.',
      },
      { kind: 'heading', text: 'The round trip' },
      {
        kind: 'code',
        code: `int x = 42;

&x        // address of x
*(&x)     // value at the address of x  →  42, i.e. back to x itself`,
      },
      {
        kind: 'text',
        body: '`&` and `*` undo each other. Once that clicks, pointer expressions stop looking cryptic.',
      },
      { kind: 'heading', text: 'Accessing members through a pointer' },
      {
        kind: 'code',
        code: `struct TreeNode {
    int val;
    TreeNode* left;
};

TreeNode* node = /* ... */;

(*node).val;      // dereference, then access the member — correct but clumsy
node->val;        // identical, and what everyone writes`,
      },
      {
        kind: 'text',
        body: '`->` is pure shorthand for `(*ptr).member`. The brackets in the long form are required because `.` binds tighter than `*`, so `*node.val` would try to dereference `node.val` — a compile error that briefly confuses everyone.',
      },
      {
        kind: 'code',
        caption: 'Chaining arrows to walk a structure',
        code: `node->left->right->val;      // three hops down a tree

// Equivalent to, but far more readable than:
(*(*(*node).left).right).val;`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Each arrow in a chain can be null',
        body: '`node->left->val` crashes if `node->left` is `nullptr` — even when `node` itself is perfectly valid. Chained arrows need a check at every level, which is exactly why tree recursion checks `if (!node) return;` at the top of each call rather than testing children before descending.',
      },
      {
        kind: 'code',
        caption: 'Dereferencing an iterator uses the same syntax',
        code: `vector<int> v = {1, 2, 3};
auto it = v.begin();

cout << *it;                 // 1 — iterators dereference like pointers
cout << *max_element(v.begin(), v.end());   // 3

// This is why max_element needs a star — it returns an iterator, not a value`,
      },
    ],
    keyTakeaways: [
      '`*p` reads the value at the address in `p`; `*p = x` writes through it.',
      '`&` and `*` are inverses: `*(&x)` is `x`.',
      '`ptr->member` is shorthand for `(*ptr).member`.',
      'Iterators dereference with `*` too — that is why `max_element` needs one.',
    ],
    practice: {
      prompt: 'Declare an int, take a pointer to it, then modify the original *through the pointer* and confirm the change. Then write `*node.val` instead of `node->val` and read the error, so the operator-precedence reason for `->` existing makes sense.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-6.3',
    language: 'cpp',
    summary: 'Represent "nothing here" safely — the single most important pointer value in DSA.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: '`nullptr` is the pointer value meaning "this points at nothing". It is how a linked list says "no next node" and how a tree says "no child" — which makes it the foundation of every linked-structure problem.',
      },
      {
        kind: 'code',
        code: `int* p = nullptr;        // explicitly points nowhere

if (p == nullptr) cout << "empty";
if (p != nullptr) cout << *p;

if (!p) cout << "empty";      // idiomatic shorthand
if (p)  cout << *p;           // a pointer converts to bool: null is false`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Dereferencing null is the classic Runtime Error',
        body: '`*p` or `p->val` when `p` is `nullptr` is undefined behaviour. On LeetCode it appears as "Runtime Error", usually on a hidden test case with an empty tree, an empty list, or a single node whose child you assumed existed. It is by a wide margin the most common runtime failure in tree and list problems.',
      },
      { kind: 'heading', text: 'Always check before you dereference' },
      {
        kind: 'code',
        code: `// SAFE — short-circuiting stops before the dereference
if (node != nullptr && node->val == target) { ... }

// CRASHES — the dereference happens first
if (node->val == target && node != nullptr) { ... }`,
      },
      {
        kind: 'text',
        body: 'Order matters entirely, and the reason is the short-circuiting from Chapter 2. The guard must come first.',
      },
      {
        kind: 'code',
        caption: 'The two traversal guards worth memorising',
        code: `// Walking a linked list
while (node != nullptr) {
    // safe to use node->val and node->next
    node = node->next;
}

// Fast/slow pointers — check BOTH the pointer and its next
while (fast != nullptr && fast->next != nullptr) {
    slow = slow->next;
    fast = fast->next->next;      // needs fast->next to be valid
}`,
      },
      {
        kind: 'text',
        body: 'The second guard checks two levels because the body dereferences two levels. Match the guard to the deepest access in the body — that rule alone prevents most list-traversal crashes.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Null checks are base cases in disguise',
        body: 'In tree recursion, `if (root == nullptr) return 0;` is simultaneously the null-safety check and the recursion\'s base case. That is not a coincidence — the empty tree *is* the smallest case. Writing the null check first gives you the base case for free.',
      },
      {
        kind: 'code',
        code: `int maxDepth(TreeNode* root) {
    if (root == nullptr) return 0;        // null check AND base case
    return 1 + max(maxDepth(root->left), maxDepth(root->right));
}`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Use nullptr, not NULL or 0',
        body: '`NULL` is an old C macro that is really just `0`, so it can accidentally match an `int` overload instead of a pointer one. `nullptr` has its own type and only ever matches pointers. Modern C++ uses `nullptr` exclusively; you will still see `NULL` in older LeetCode discussion posts.',
      },
      {
        kind: 'text',
        body: 'One last habit: an uninitialised pointer (`int* p;`) is *not* null — it holds garbage that may look like a valid address. Always initialise pointers to `nullptr` if you have nothing to point at yet.',
      },
    ],
    keyTakeaways: [
      '`nullptr` means "points at nothing"; dereferencing it is a Runtime Error.',
      'Guard first: `node != nullptr && node->val == x`, never the reverse.',
      'Match the guard depth to the body — `fast && fast->next` for two-level access.',
      'An uninitialised pointer holds garbage, not null — initialise it explicitly.',
    ],
    practice: {
      prompt: 'Write a linked-list length function and run it on an empty list (`nullptr`). Then remove the null check and watch it crash. Then write the fast/slow guard and try it on a one-node list — the `fast->next` check is precisely what stops that case from crashing.',
      leetcode: { title: 'Middle of the Linked List', slug: 'middle-of-the-linked-list' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-6.4',
    language: 'cpp',
    summary: 'Move a pointer through memory and see why arr[i] is really pointer arithmetic.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'You can add integers to pointers. The key rule: arithmetic is **scaled by the pointed-to type**. Adding 1 moves forward by one *element*, not one byte.',
      },
      {
        kind: 'code',
        code: `int arr[5] = {10, 20, 30, 40, 50};
int* p = arr;          // points at arr[0]

cout << *p;            // 10
cout << *(p + 1);      // 20   — moved 4 bytes, one int
cout << *(p + 3);      // 40

p++;                   // now points at arr[1]
cout << *p;            // 20`,
      },
      {
        kind: 'text',
        body: 'With a `double*`, `p + 1` would move 8 bytes. With a `char*`, one byte. The compiler multiplies by `sizeof(T)` for you — which is exactly why a pointer must know its type.',
      },
      { kind: 'heading', text: 'Indexing is pointer arithmetic' },
      {
        kind: 'code',
        code: `arr[i]        // is DEFINED as
*(arr + i)    // these are identical, always

// Which leads to a genuinely legal curiosity:
3[arr]        // same as *(3 + arr) — same as arr[3]. Never write this.`,
      },
      {
        kind: 'text',
        body: 'Array subscripting is not a separate feature; it is syntactic sugar over pointer arithmetic. That is why indexing costs one multiply and one add regardless of `i`, and why an out-of-range index does not error — it just computes an address you had no right to.',
      },
      {
        kind: 'code',
        caption: 'Pointer difference gives an element count',
        code: `int* start = &arr[1];
int* end   = &arr[4];

end - start;      // 3 — the number of ELEMENTS between them, not bytes`,
      },
      {
        kind: 'text',
        body: 'Subtracting two pointers yields how many elements apart they are. This is how `end() - begin()` gives a container\'s size, and how `distance()` works.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Running past the end is undefined behaviour',
        body: 'A pointer may legally point at one position past the last element (that is what `end()` is), but you may not dereference it. Going further than that is undefined even without dereferencing. This is the mechanism behind every buffer-overrun bug: the arithmetic quietly produces an address, and reading it gives whatever happens to live there.',
      },
      { kind: 'heading', text: 'Iterators behave the same way' },
      {
        kind: 'code',
        code: `vector<int> v = {1, 2, 3, 4, 5};

auto it = v.begin();
*it;              // 1
*(it + 2);        // 3
v.end() - v.begin();   // 5 — the size

sort(v.begin() + 1, v.end());        // sort all but the first element
v.erase(v.begin() + 2);              // erase the third element`,
      },
      {
        kind: 'text',
        body: 'A `vector` iterator is essentially a pointer, so all of this transfers. It is why `v.begin() + 2` is a normal thing to write and why the half-open `[begin, end)` convention exists — `end` is the one-past-the-last address.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Only vector and array iterators support + n',
        body: 'Pointer-like arithmetic requires contiguous storage. `vector`, `array` and `string` iterators support `it + 5`; `map`, `set` and `list` iterators do not — they only support `++` and `--`, because their elements are scattered. Use `next(it, 5)` or `advance(it, 5)` when you need to move a non-contiguous iterator.',
      },
    ],
    keyTakeaways: [
      'Pointer arithmetic is scaled by `sizeof(T)` — `p + 1` advances one element.',
      '`arr[i]` is defined as `*(arr + i)`.',
      'Subtracting two pointers gives an element count, not a byte count.',
      '`vector` iterators support `+ n`; `map`, `set` and `list` iterators do not.',
    ],
    practice: {
      prompt: 'Walk an array using only a pointer and `++`, never using `[]`. Then print `p + 1` minus `p` as raw numbers for an `int*` and a `char*` and see the scaling. Understanding that `arr[i]` *is* `*(arr + i)` explains why out-of-range indexing silently misbehaves rather than erroring.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-6.5',
    language: 'cpp',
    summary: 'Understand array-to-pointer decay and why arrays lose their size when passed.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'An array name used in most expressions **decays** into a pointer to its first element. This single rule explains most of the surprising behaviour of raw arrays.',
      },
      {
        kind: 'code',
        code: `int arr[5] = {1, 2, 3, 4, 5};

int* p = arr;         // no & needed — arr decays to &arr[0]
arr[2];               // 3
p[2];                 // 3 — identical
*(arr + 2);           // 3 — also identical`,
      },
      { kind: 'heading', text: 'The consequence: arrays forget their size' },
      {
        kind: 'code',
        code: `int arr[5];

sizeof(arr);          // 20 — five ints, here in the declaring scope
sizeof(arr) / sizeof(arr[0]);      // 5 — the classic size idiom

void f(int a[]) {
    sizeof(a);        // 8 — the size of a POINTER, not the array!
}`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'The size idiom silently breaks inside a function',
        body: '`sizeof(arr) / sizeof(arr[0])` gives the correct count only in the scope where the array was declared. Pass the array to a function and it has decayed to a pointer, so the same expression yields 8/4 = 2 regardless of the real size. This bug produces loops that read two elements of a hundred-element array. Always pass the size as a separate parameter — or use `vector`.',
      },
      {
        kind: 'code',
        caption: 'These three declarations are identical',
        code: `void f(int a[5]);      // the 5 is documentation; the compiler ignores it
void f(int a[]);
void f(int* a);        // what all three actually mean`,
      },
      {
        kind: 'text',
        body: 'Because the parameter is really a pointer, arrays are never copied when passed — the function modifies the caller\'s data. That is the exception to pass-by-value noted back in Chapter 4.',
      },
      {
        kind: 'code',
        code: `void doubleAll(int a[], int n) {
    for (int i = 0; i < n; i++) a[i] *= 2;    // modifies the CALLER's array
}

int arr[3] = {1, 2, 3};
doubleAll(arr, 3);
// arr is now {2, 4, 6}`,
      },
      { kind: 'heading', text: '2D arrays decay awkwardly' },
      {
        kind: 'code',
        code: `int grid[3][4];

void f(int g[][4], int rows);      // the column count is REQUIRED
void f(int g[3][4], int rows);     // fine
void f(int** g);                   // WRONG — a 2D array is not a pointer-to-pointer`,
      },
      {
        kind: 'text',
        body: 'A 2D array is one contiguous block, and the compiler needs the column count to compute `g[r][c]` as `*(base + r * cols + c)`. This awkwardness is a major reason `vector<vector<int>>` is preferred despite being slightly slower.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'vector does not decay',
        body: 'A `vector` is a real object that carries its own size, so passing it preserves everything: `v.size()` works inside the function, and `const vector<int>&` prevents both copying and modification. Every problem in this chapter disappears by using `vector`, which is why LeetCode signatures use it.',
      },
    ],
    keyTakeaways: [
      'An array name decays to a pointer to its first element in most expressions.',
      '`sizeof(arr)/sizeof(arr[0])` only works in the array\'s declaring scope.',
      '`f(int a[])` really means `f(int* a)` — arrays are never copied when passed.',
      '2D array parameters must specify the column count; `vector` avoids all of this.',
    ],
    practice: {
      prompt: 'Print `sizeof(arr)/sizeof(arr[0])` in `main` and then inside a function taking the same array — watch it change from the real count to 2. Then confirm a function really does modify the caller\'s array without any `&`. That asymmetry with every other type is worth seeing directly.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-6.6',
    language: 'cpp',
    summary: 'Pass pointers into functions, return them safely, and store functions in variables.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Chapter 4 covered pointer parameters as one of the three passing modes. Here we look at the cases that go beyond that: returning pointers, changing which node a pointer refers to, and pointers *to functions*.',
      },
      { kind: 'heading', text: 'Returning a pointer' },
      {
        kind: 'code',
        code: `// SAFE — returns a pointer to something the caller already owns
TreeNode* findNode(TreeNode* root, int target) {
    if (root == nullptr || root->val == target) return root;
    TreeNode* left = findNode(root->left, target);
    return left != nullptr ? left : findNode(root->right, target);
}

// DANGEROUS — returns a pointer to a local that no longer exists
int* bad() {
    int x = 5;
    return &x;          // x dies when the function returns
}`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Returning the address of a local is a dangling pointer',
        body: 'The local variable is destroyed the moment the function returns, so the caller holds a pointer into dead stack memory. Reading it may give the right answer once and garbage the next time, because the space gets reused by the next function call. Compilers warn with `-Wall`; take the warning seriously.',
      },
      {
        kind: 'text',
        body: 'Returning a pointer is fine when the thing pointed at outlives the function — a heap allocation, a node in a tree the caller gave you, or a member of a longer-lived object.',
      },
      { kind: 'heading', text: 'Pointer to pointer, and reference to pointer' },
      {
        kind: 'code',
        code: `// To change WHICH node the caller's pointer points at:
void insert(TreeNode*& node, int val) {          // reference to a pointer
    if (node == nullptr) {
        node = new TreeNode(val);                // the caller's pointer changes
        return;
    }
    if (val < node->val) insert(node->left, val);
    else                 insert(node->right, val);
}`,
      },
      {
        kind: 'text',
        body: 'Without the `&`, the function would receive a copy of the pointer, set the copy to a new node, and the caller would see nothing. `TreeNode*&` is the clean way to write recursive BST insertion. The older C equivalent is `TreeNode**`, which does the same thing with more stars.',
      },
      { kind: 'heading', text: 'Function pointers and lambdas' },
      {
        kind: 'code',
        caption: 'A function stored in a variable',
        code: `bool ascending(int a, int b)  { return a < b; }
bool descending(int a, int b) { return a > b; }

bool (*cmp)(int, int) = ascending;      // pointer to a function
sort(v.begin(), v.end(), cmp);

cmp = descending;                       // swap the behaviour at run time
sort(v.begin(), v.end(), cmp);`,
      },
      {
        kind: 'text',
        body: 'That declaration syntax is famously ugly. In practice you almost never write it — you pass a lambda or use `auto`.',
      },
      {
        kind: 'code',
        caption: 'What you will actually write',
        code: `// A lambda passed directly
sort(v.begin(), v.end(), [](int a, int b) { return a > b; });

// Stored, with auto
auto cmp = [](int a, int b) { return a > b; };
sort(v.begin(), v.end(), cmp);

// Capturing surrounding variables — a function pointer cannot do this
int pivot = 5;
auto nearPivot = [pivot](int a, int b) {
    return abs(a - pivot) < abs(b - pivot);
};
sort(v.begin(), v.end(), nearPivot);`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Lambdas are the modern answer',
        body: 'A lambda can capture surrounding variables; a plain function pointer cannot. That is why custom comparators for `sort` and `priority_queue` are written as lambdas. Chapter 15 covers capture syntax in depth — for now, `[](int a, int b) { return a > b; }` for descending order is worth memorising.',
      },
    ],
    keyTakeaways: [
      'Never return the address of a local variable — it dangles immediately.',
      'Returning a pointer is safe when the target outlives the function.',
      '`TreeNode*&` lets a function change which node the caller\'s pointer refers to.',
      'Prefer lambdas over function pointers — only lambdas can capture context.',
    ],
    practice: {
      prompt: 'Write recursive BST insertion using `TreeNode*& node`, then try it with plain `TreeNode* node` and watch the tree stay empty — that failure explains exactly what the `&` is doing. Then sort a vector descending with a lambda comparator.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-6.7',
    language: 'cpp',
    summary: 'Create an alias for an existing variable — safer than a pointer, with no syntax overhead.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A reference is another name for an existing variable. Once bound, using the reference is indistinguishable from using the original — there is no dereference syntax and nothing to check.',
      },
      {
        kind: 'code',
        code: `int x = 10;
int& r = x;        // r is now another name for x

r = 20;            // no star needed
cout << x;         // 20 — there is only one variable here

&r == &x;          // true — same address, because it IS x`,
      },
      { kind: 'heading', text: 'The three rules' },
      {
        kind: 'code',
        code: `int x = 10, y = 99;

int& r;            // ERROR — a reference must be initialised
int& r = x;        // fine

r = y;             // does NOT re-point r at y —
                   // it assigns y's VALUE into x. Now x == 99.

int& r2 = nullptr; // ERROR — there is no null reference`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Assigning to a reference writes through it',
        body: 'This surprises people expecting pointer-like behaviour. `r = y` copies `y` into whatever `r` refers to. A reference can never be re-seated after initialisation — that is the property that makes it safe, and the reason you need a pointer when the target must change.',
      },
      { kind: 'heading', text: 'Where references earn their place' },
      {
        kind: 'code',
        caption: '1. Modifying in a range-based loop',
        code: `for (int& x : v) x *= 2;              // modifies v
for (const string& s : words) { ... }   // reads without copying`,
      },
      {
        kind: 'code',
        caption: '2. Shortening a deeply nested expression',
        code: `// Instead of repeating this four times:
grid[r][c].neighbours.push_back(x);

// Bind a reference once:
auto& cell = grid[r][c];
cell.neighbours.push_back(x);
cell.visited = true;`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'auto drops the reference unless you write auto&',
        body: '`auto cell = grid[r][c];` makes a *copy* — modifying it changes nothing. You must write `auto&` (or `const auto&`) to get a reference. This is a very common silent bug: the code compiles, runs, and quietly does nothing.',
      },
      {
        kind: 'code',
        caption: '3. Iterating a map without copying each pair',
        code: `unordered_map<string, int> counts;

for (auto& [key, value] : counts) value++;        // modifies the map
for (const auto& [key, value] : counts) { ... }   // reads, no copies

for (auto [key, value] : counts) value++;         // BUG — copies, map unchanged`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'A reference to a vector element can dangle',
        body: 'Binding `int& first = v[0];` and then calling `v.push_back(...)` may reallocate the vector, leaving `first` pointing at freed memory. References into containers are only valid until the container resizes. This is the same invalidation rule as iterators.',
      },
      {
        kind: 'text',
        body: 'A reference occupies no storage of its own in most cases — the compiler usually implements it as a pointer under the hood but optimises the indirection away. You get pointer efficiency with plain-variable syntax.',
      },
    ],
    keyTakeaways: [
      'A reference must be initialised, can never be re-seated, and can never be null.',
      '`r = y` writes `y`\'s value through `r`; it does not re-point it.',
      '`auto` copies — write `auto&` or `const auto&` to get a reference.',
      'References into a container dangle if the container reallocates.',
    ],
    practice: {
      prompt: 'Bind `int& r = x`, assign a different variable to `r`, and confirm `x` changed rather than `r` moving. Then loop a map with `auto [k, v]` and again with `auto& [k, v]`, incrementing the value each time — only the second actually modifies the map, and that one missing `&` is a bug you will otherwise write for real.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-6.8',
    language: 'cpp',
    summary: 'Choose between a reference and a pointer with one question: can it be absent?',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'References and pointers both let a function reach the caller\'s data, and beginners agonise over which to use. There is one question that decides it almost every time: **can this legitimately be absent?** If yes, you need a pointer, because only a pointer can be null. If no, use a reference — it is safer and reads better.',
      },
      {
        kind: 'table',
        headers: ['', 'Reference `T&`', 'Pointer `T*`'],
        rows: [
          ['Must be initialised', 'Yes', 'No'],
          ['Can be null', 'No', 'Yes — `nullptr`'],
          ['Can be re-pointed', 'No', 'Yes'],
          ['Syntax to access', '`r` — like a normal variable', '`*p` or `p->`'],
          ['Arithmetic (`p + 1`)', 'No', 'Yes'],
          ['Needs a null check', 'Never', 'Almost always'],
          ['At the call site', '`f(x)` — invisible', '`f(&x)` — explicit'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The decision rule',
        body: 'Ask: **can this legitimately refer to nothing, or need to change what it refers to?** If yes, use a pointer. If no, use a reference. That one question resolves nearly every case, and it defaults you to references — which is what you want, since they cannot be null and need no checking.',
      },
      { kind: 'heading', text: 'Applying it in DSA' },
      {
        kind: 'code',
        caption: 'References — the thing always exists',
        code: `int sum(const vector<int>& nums);      // there is always a vector
void sortInPlace(vector<int>& nums);   // there is always a vector
for (int& x : v) x *= 2;               // every element exists`,
      },
      {
        kind: 'code',
        caption: 'Pointers — absence is meaningful',
        code: `TreeNode* left;             // a node may have no left child
ListNode* next;             // the last node has no next
TreeNode* find(...);        // the search may find nothing → return nullptr`,
      },
      {
        kind: 'text',
        body: 'Notice that linked structures *require* pointers. There is no way to express "no child" with a reference, because references cannot be null. This is not a style preference — it is a structural necessity, and it is why every tree and list problem is written with pointers.',
      },
      { kind: 'heading', text: 'The self-referential structure' },
      {
        kind: 'code',
        code: `struct ListNode {
    int val;
    ListNode* next;        // a POINTER to the same type — legal
    // ListNode next;      // ERROR — infinite size, and no way to end the list
};`,
      },
      {
        kind: 'text',
        body: 'A struct cannot contain an instance of itself — that would be infinitely large. A *pointer* to itself is fixed-size and can be null, which is what terminates the chain. This is why linked structures exist in the form they do.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Under the hood they are the same thing',
        body: 'Compilers typically implement references as pointers and then optimise the indirection away. The difference is entirely in what the *compiler enforces*: a reference is guaranteed non-null and non-reassignable, so the compiler can reason about it and you do not have to check it. The safety is the feature.',
      },
      {
        kind: 'text',
        body: 'One combined form worth recognising: `TreeNode*&` — a reference to a pointer. Used when a function must change which node the caller\'s pointer refers to, as in recursive BST insertion. Read it right to left: a reference, to a pointer, to a TreeNode.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The interview answer',
        body: '"A reference is an alias that must be bound at creation, cannot be null and cannot be reassigned; a pointer is a variable holding an address, which can be null, reassigned, and arithmetic-ed. Use references when the target always exists — which is why tree nodes are pointers and container parameters are references." That covers the question completely.',
      },
    ],
    keyTakeaways: [
      'Use a pointer when absence is meaningful or the target must change; otherwise a reference.',
      'Linked structures require pointers — references cannot express "no child".',
      'A struct can hold a pointer to itself, never an instance of itself.',
      'References need no null checks, which is exactly why they are the safer default.',
    ],
    practice: {
      prompt: 'Try to declare `ListNode next;` inside `struct ListNode` and read the error, then fix it with a pointer. Then write a function taking `const vector<int>&` and one taking `TreeNode*`, and articulate in one sentence why each choice is correct — that is very close to the interview answer verbatim.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-6.9',
    language: 'cpp',
    summary: 'Read data without copying it and without being able to damage it.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: '`const T&` combines two guarantees: no copy is made, and the function cannot modify the caller\'s object. It is the default way to accept a container you only need to read.',
      },
      {
        kind: 'code',
        code: `int sum(const vector<int>& v) {
    int total = 0;
    for (int x : v) total += x;
    // v.push_back(1);      // ERROR — v is const
    return total;
}`,
      },
      {
        kind: 'table',
        headers: ['Parameter', 'Copies?', 'Can modify?', 'Use when'],
        rows: [
          ['`vector<int> v`', 'Yes', 'The copy only', 'You want a scratch copy'],
          ['`vector<int>& v`', 'No', 'Yes', 'Modifying in place'],
          ['`const vector<int>& v`', 'No', 'No', '**Reading — the default**'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Why const& and not just &',
        body: 'Both avoid the copy, so the performance is identical. `const` adds a compiler-enforced promise: this function will not change your data. It documents intent, catches accidental writes at compile time, and — crucially — allows the function to accept temporaries and literals.',
      },
      { kind: 'heading', text: 'const& binds to temporaries; plain & does not' },
      {
        kind: 'code',
        code: `void f(vector<int>& v);
void g(const vector<int>& v);

f({1, 2, 3});          // ERROR — cannot bind a temporary to a non-const reference
g({1, 2, 3});          // fine

void h(const string& s);
h("hello");            // fine — a temporary string is created and bound`,
      },
      {
        kind: 'text',
        body: 'A temporary has no name and disappears at the end of the statement, so C++ refuses to bind it to a non-const reference — you would be modifying something about to vanish. `const&` is allowed because you have promised not to modify it, and the temporary\'s lifetime is extended to match the reference.',
      },
      { kind: 'heading', text: 'const propagates' },
      {
        kind: 'code',
        code: `void f(const vector<int>& v) {
    v[0];               // fine — reading
    v[0] = 5;           // ERROR — cannot write through a const reference
    v.size();           // fine — size() is a const member function
    v.push_back(1);     // ERROR — push_back is not const

    sort(v.begin(), v.end());   // ERROR — v.begin() on a const vector
                                //   gives a const_iterator
}`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'You cannot sort through a const reference',
        body: 'If a function needs to sort, it must either take a non-const reference (modifying the caller\'s data) or take a copy. Taking `const&` and then trying to sort produces a wall of template errors that look far more alarming than the actual problem. When you see pages of iterator errors from `sort`, check for a stray `const`.',
      },
      { kind: 'heading', text: 'const member functions' },
      {
        kind: 'code',
        code: `class Counter {
    int value = 0;
public:
    int get() const { return value; }    // promises not to modify
    void add()      { value++; }         // modifies
};

void report(const Counter& c) {
    c.get();      // fine
    c.add();      // ERROR — cannot call a non-const method on a const object
}`,
      },
      {
        kind: 'text',
        body: 'This is why library methods like `size()`, `empty()` and `at()` are marked `const` — so they remain callable on objects you received as `const&`. If you write your own class and forget `const` on a getter, it becomes unusable through a const reference.',
      },
    ],
    keyTakeaways: [
      '`const T&` avoids the copy and forbids modification — the default for reading.',
      'Only `const&` can bind to temporaries and literals.',
      'Through a `const&` you may call only `const` member functions.',
      'You cannot `sort` through a `const&` — take a copy or a non-const reference.',
    ],
    practice: {
      prompt: 'Write a function taking `const vector<int>&` and try to `push_back` and to `sort` inside it. Read both errors — the `sort` one is a template avalanche whose real cause is a single `const`, and recognising that pattern saves genuine confusion later.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-6.10',
    language: 'cpp',
    summary: 'Stop hidden copies from turning a correct algorithm into a timeout.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'A correct O(n) algorithm can still exceed the time limit if it copies a container at every step. The copies are invisible in the code — this lesson is about learning to see them.',
      },
      { kind: 'heading', text: 'The four places copies hide' },
      {
        kind: 'code',
        caption: '1. Function parameters',
        code: `void solve(vector<int> nums)          // copies all n elements per call
void solve(const vector<int>& nums)   // no copy`,
      },
      {
        kind: 'code',
        caption: '2. Recursive helpers — the worst case',
        code: `// Each of the n recursion levels copies the whole vector: O(n^2) total
void dfs(vector<int> path, int depth);

// One shared vector, mutated and restored: O(n)
void dfs(vector<int>& path, int depth);`,
      },
      {
        kind: 'code',
        caption: '3. Range-based loops',
        code: `for (string s : words)          // copies every string
for (const string& s : words)   // no copies

for (auto p : bigMap)           // copies every key-value pair
for (const auto& p : bigMap)    // no copies`,
      },
      {
        kind: 'code',
        caption: '4. auto discarding the reference',
        code: `auto cell = grid[r][c];         // COPY — modifications go nowhere
auto& cell = grid[r][c];        // reference — modifications land`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'The symptom is TLE on a correct solution',
        body: 'Your logic is right, your complexity analysis on paper is right, and the judge still says Time Limit Exceeded. When that happens, read every parameter and every `for` loop looking for a missing `&`. It is more often the cause than a genuinely wrong algorithm.',
      },
      { kind: 'heading', text: 'When a copy is genuinely correct' },
      {
        kind: 'code',
        code: `// Backtracking: saving a snapshot of the current path
if (path.size() == n) {
    result.push_back(path);      // a COPY is required — path keeps changing
    return;
}`,
      },
      {
        kind: 'text',
        body: 'Here the copy is the whole point: `path` is about to be mutated further, so you must store a snapshot. Copying in the base case is fine — it happens once per result, not once per recursion level.',
      },
      {
        kind: 'code',
        caption: 'And when you deliberately want to preserve the caller\'s data',
        code: `int median(vector<int> v) {          // deliberate copy — caller keeps their order
    sort(v.begin(), v.end());
    return v[v.size() / 2];
}`,
      },
      { kind: 'heading', text: 'Moving instead of copying' },
      {
        kind: 'code',
        code: `vector<int> build() {
    vector<int> result;
    // ... fill it ...
    return result;              // NOT copied — the compiler moves or elides
}

vector<int> data = build();     // cheap, regardless of size`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Returning a large container by value is free',
        body: 'Modern C++ moves the internal buffer rather than copying it, and often elides the operation entirely. So do not contort your code to avoid returning a `vector` — returning by value is both the clearest and the fastest option. The cost is in *parameters* and *loops*, not returns.',
      },
      {
        kind: 'code',
        caption: 'std::move when you are finished with the source',
        code: `vector<int> temp = buildSomething();
result.push_back(std::move(temp));    // transfers the buffer instead of copying
// temp is now in a valid but unspecified state — do not use it again`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'A quick pre-submit scan',
        body: 'Before submitting anything recursive or loop-heavy: does every container parameter have `&`? Does every range-based loop over non-primitives have `&` or `const&`? Does every `auto` that should alias have `auto&`? Three questions, ten seconds, and they catch the large majority of avoidable timeouts.',
      },
    ],
    keyTakeaways: [
      'Copies hide in parameters, recursive helpers, range loops, and bare `auto`.',
      'A recursive helper taking a container by value is O(n²) rather than O(n).',
      'Copying is correct when saving a snapshot, as in backtracking base cases.',
      'Returning a container by value is cheap — the cost is in parameters and loops.',
    ],
    practice: {
      prompt: 'Write a recursive function taking `vector<int> path` by value, run it on a large input and time it, then change one character to `vector<int>& path` and time it again. The gap on a few thousand elements is dramatic, and it makes the invisible cost of a missing `&` permanently visible.',
    },
  },
];
