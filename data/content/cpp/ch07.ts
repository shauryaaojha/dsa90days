import type { Lesson } from '../types';

/**
 * Chapter 7 — Memory Management.
 * Why recursion depth is limited, why `new` without `delete` leaks, and why
 * modern C++ hands nearly all of this to containers and smart pointers.
 */
export const ch07: Lesson[] = [
  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-7.1',
    language: 'cpp',
    summary: 'Know which of your variables live on the stack, which on the heap, and what that costs.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'A running program divides its memory into regions. Two matter for DSA: the **stack**, which holds local variables and function calls, and the **heap**, which holds anything allocated at run time.',
      },
      {
        kind: 'table',
        headers: ['', 'Stack', 'Heap'],
        rows: [
          ['Holds', 'Locals, parameters, return addresses', 'Anything from `new` or a container'],
          ['Managed by', 'The compiler, automatically', 'You (or a container, on your behalf)'],
          ['Freed when', 'The function returns', 'You `delete` it, or the container dies'],
          ['Speed', 'Very fast — just moves a pointer', 'Slower — must find a free block'],
          ['Size', 'Small: roughly 1–8 MB', 'Large: essentially your RAM'],
          ['Layout', 'Contiguous, grows and shrinks in order', 'Scattered, can fragment'],
        ],
      },
      {
        kind: 'code',
        caption: 'Which is which',
        code: `void f() {
    int x = 5;                  // stack
    int arr[100];               // stack — 400 bytes

    int* p = new int(5);        // p is on the STACK, the int is on the HEAP
    vector<int> v(1000);        // v is on the stack; its 1000 ints are on the heap

    delete p;
}   // x, arr, p and v are destroyed here.
    // v frees its heap buffer automatically. p's int would have leaked
    // without the delete.`,
      },
      {
        kind: 'text',
        body: 'Note the pattern for `vector`: the small bookkeeping object sits on the stack, while the actual elements live on the heap. That is precisely why a `vector` of a million ints is fine while a raw array of a million ints inside a function is not.',
      },
      { kind: 'heading', text: 'The stack is small — two consequences' },
      {
        kind: 'code',
        caption: '1. Large local arrays crash',
        code: `void f() {
    int arr[1000000];        // ~4 MB on a ~1 MB stack → stack overflow
}

void g() {
    vector<int> v(1000000);  // fine — the elements are on the heap
}`,
      },
      {
        kind: 'code',
        caption: '2. Deep recursion crashes',
        code: `int depth(int n) {
    if (n == 0) return 0;
    return 1 + depth(n - 1);
}

depth(100000);      // stack overflow — 100,000 stack frames`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'This is why recursion depth is limited',
        body: 'Every call pushes a **stack frame** holding that call\'s parameters, locals and return address. Roughly 10,000–100,000 frames exhausts a typical stack, depending on frame size. On LeetCode the symptom is a bare "Runtime Error" with no message. A recursive solution on a 10⁵-element input that is really a linked list — a completely unbalanced tree — will hit this. Convert to an iterative loop with an explicit `stack` when it does.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Fewer and smaller locals means deeper recursion',
        body: 'A recursive function carrying a large local array in each frame runs out of stack far sooner than a lean one. Passing containers by reference rather than by value helps here too — a by-value `vector` parameter is a bigger frame *and* a copy.',
      },
      {
        kind: 'text',
        body: 'The heap is slower because allocation has to search for a suitably sized free block and record the bookkeeping. That is why `push_back` amortises its growth by doubling — each reallocation is expensive enough to be worth avoiding.',
      },
    ],
    keyTakeaways: [
      'Stack: locals and call frames, automatic, fast, small (~1 MB).',
      'Heap: runtime allocations, manual or container-managed, slower, large.',
      'A `vector` object is on the stack; its elements are on the heap.',
      'Deep recursion overflows the stack — the cause of many bare Runtime Errors.',
    ],
    practice: {
      prompt: 'Write a recursive function with no base case and see how many levels it reaches before crashing — that number is your stack budget in frames. Then declare `int arr[1000000]` inside a function versus `vector<int> v(1000000)` and confirm only the first crashes.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-7.2',
    language: 'cpp',
    summary: 'Allocate on the heap by hand, and pair every allocation with the right release.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: '`new` asks for memory that outlives the current scope, and `delete` hands it back. Every `new` needs exactly one matching `delete`, and the array forms `new[]`/`delete[]` must be paired with each other. Getting this wrong leaks memory or corrupts the heap — which is precisely why modern C++ prefers containers and smart pointers.',
      },
      {
        kind: 'code',
        caption: 'The two forms',
        code: `// Single object
int* p = new int(42);        // allocate one int, initialised to 42
cout << *p;                  // 42
delete p;                    // release it

// Array
int* arr = new int[100];     // allocate 100 ints
arr[0] = 5;
delete[] arr;                // release with delete[], note the brackets`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'new[] must be matched with delete[]',
        body: 'Using plain `delete` on an array allocated with `new[]` is undefined behaviour — it typically frees only the first element and destroys none of the others. The brackets must match: `new` with `delete`, `new[]` with `delete[]`. Nothing warns you; the corruption surfaces later somewhere unrelated.',
      },
      {
        kind: 'text',
        body: 'Unlike a stack variable, a heap allocation survives past the end of the block it was created in. It lives until you explicitly `delete` it — which is both the power and the danger.',
      },
      {
        kind: 'code',
        caption: 'Why that matters — the linked list node',
        code: `ListNode* createNode(int val) {
    ListNode* node = new ListNode(val);
    return node;              // SAFE — the node is on the heap and outlives this call
}

ListNode* bad(int val) {
    ListNode node(val);
    return &node;             // DANGLING — node was on the stack and is now gone
}`,
      },
      {
        kind: 'text',
        body: 'This is why every linked list and tree node in real code is heap-allocated. A function that builds a node must return something that outlives it, and only the heap can do that.',
      },
      { kind: 'heading', text: 'The rules' },
      {
        kind: 'code',
        code: `int* p = new int(5);

delete p;          // release
delete p;          // DOUBLE DELETE — undefined behaviour, often a crash

p = nullptr;       // good habit: null it after deleting
delete p;          // deleting nullptr is explicitly safe — does nothing`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Deleting nullptr is always safe',
        body: 'The standard guarantees `delete nullptr;` is a no-op, so setting a pointer to `nullptr` after deleting protects you against a later double-delete. It costs one assignment and eliminates a whole bug class.',
      },
      { kind: 'heading', text: 'Modern C++: you should rarely write this' },
      {
        kind: 'code',
        code: `// Manual — you must remember to delete, on EVERY exit path
int* arr = new int[n];
// ... if anything returns or throws here, the memory leaks ...
delete[] arr;

// Container — frees itself, always
vector<int> arr(n);

// Smart pointer — frees itself when it goes out of scope
#include <memory>
unique_ptr<int[]> arr = make_unique<int[]>(n);`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'On LeetCode you almost never call new',
        body: 'Nodes are constructed for you by the judge, and `vector` covers dynamic arrays. The main exception is problems that ask you to *build* a list or tree, where `new ListNode(val)` is the normal way. You are not expected to `delete` anything — the judge process exits and reclaims everything.',
      },
      {
        kind: 'text',
        body: 'Understand `new`/`delete` so you can read C++ written before smart pointers, answer memory-management interview questions, and reason about what containers are doing for you. Then use containers.',
      },
    ],
    keyTakeaways: [
      '`new` allocates on the heap; the object lives until you `delete` it.',
      'Match the forms: `new`/`delete`, `new[]`/`delete[]`.',
      'Double-delete is undefined; set the pointer to `nullptr` after deleting.',
      'Prefer `vector` and smart pointers — they release memory automatically.',
    ],
    practice: {
      prompt: 'Allocate an array with `new int[10]`, fill it, print it, and `delete[]` it. Then write a function returning a heap-allocated `ListNode*` and another returning the address of a stack `ListNode` — only the first is usable, and seeing that contrast explains why nodes are always heap-allocated.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-7.3',
    language: 'cpp',
    summary: 'Size structures at run time, and know which tool to reach for.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Dynamic allocation means deciding a size while the program runs rather than when it compiles. Every data structure that grows depends on it.',
      },
      {
        kind: 'code',
        caption: 'The progression',
        code: `int n;
cin >> n;

int arr[n];                     // GCC extension — not standard C++
int* arr = new int[n];          // standard, but you must delete[]
vector<int> arr(n);             // standard, safe, and resizable  ← use this`,
      },
      { kind: 'heading', text: 'Allocating a 2D structure' },
      {
        kind: 'code',
        caption: 'Manual — three lines to build, three to tear down',
        code: `// Allocate
int** grid = new int*[rows];
for (int i = 0; i < rows; i++) grid[i] = new int[cols];

// Use
grid[r][c] = 5;

// Free — inner arrays FIRST, then the outer one
for (int i = 0; i < rows; i++) delete[] grid[i];
delete[] grid;`,
      },
      {
        kind: 'code',
        caption: 'With vector — one line',
        code: `vector<vector<int>> grid(rows, vector<int>(cols, 0));`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Free the inner arrays before the outer one',
        body: 'Deleting `grid` first destroys the array of pointers, so you no longer know where the rows are — every one of them leaks, unrecoverably. The order matters, and getting it wrong leaks the majority of the memory. This kind of easily-inverted rule is exactly why `vector<vector<int>>` is worth the small overhead.',
      },
      { kind: 'heading', text: 'How vector grows underneath' },
      {
        kind: 'text',
        body: 'A vector holds a heap buffer plus a size and a capacity. On `push_back` past capacity it allocates a bigger buffer (typically double), moves the elements across, and frees the old one.',
      },
      {
        kind: 'code',
        code: `vector<int> v;
for (int i = 0; i < 10; i++) {
    v.push_back(i);
    cout << "size " << v.size() << ", capacity " << v.capacity() << "\\n";
}
// capacity goes 1, 2, 4, 4, 8, 8, 8, 8, 16, 16 — doubling as needed`,
        output: 'size 1, capacity 1\nsize 2, capacity 2\nsize 3, capacity 4\nsize 4, capacity 4\nsize 5, capacity 8',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'reserve() when you know the count in advance',
        body: '`v.reserve(n)` allocates once and skips every intermediate reallocation and move. It changes capacity, never size. Building a result vector of known length is the standard place to use it — a one-line, zero-risk speedup.',
      },
      { kind: 'heading', text: 'Smart pointers, briefly' },
      {
        kind: 'code',
        code: `#include <memory>

unique_ptr<int> p = make_unique<int>(42);    // sole owner; frees itself
shared_ptr<int> s = make_shared<int>(42);    // reference-counted; frees at zero
// no delete needed for either`,
      },
      {
        kind: 'text',
        body: 'A smart pointer is an object that owns a heap allocation and frees it in its destructor. `unique_ptr` has one owner; `shared_ptr` counts owners and frees when the last one disappears. They cost nothing extra in the `unique_ptr` case and remove the entire class of leak bugs.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Do not use smart pointers on LeetCode tree problems',
        body: 'The judge\'s node types use raw `TreeNode*` and `ListNode*`, and its harness constructs and owns them. Trying to wrap those in smart pointers fights the interface and can cause double frees. Use raw pointers there — it is the one place where they remain the right answer.',
      },
    ],
    keyTakeaways: [
      '`vector` is the default dynamic array — standard, safe, self-freeing.',
      'Manual 2D allocation must free the inner arrays before the outer one.',
      'A vector doubles capacity on growth; `reserve()` skips the intermediate steps.',
      'Smart pointers own and auto-free heap memory — but use raw pointers for LeetCode nodes.',
    ],
    practice: {
      prompt: 'Build a 2D grid manually with `new int*[rows]` and free it correctly, then rebuild it as one line of `vector<vector<int>>`. Then print size and capacity through twenty `push_back` calls and watch the doubling — that pattern explains why `push_back` is only *amortised* O(1).',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-7.4',
    language: 'cpp',
    summary: 'Recognise leaked memory and understand why containers make the problem vanish.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A memory leak is heap memory you allocated and can no longer free, because you lost every pointer to it. The memory stays reserved until the program exits.',
      },
      {
        kind: 'code',
        caption: 'The four ways to leak',
        code: `// 1. Simply forgetting
void f() {
    int* p = new int(5);
}   // p is destroyed; the int is unreachable forever

// 2. Overwriting the only pointer
int* p = new int(5);
p = new int(10);          // the first int is now unreachable

// 3. Returning early past the delete
void f() {
    int* p = new int[100];
    if (error) return;    // leaks
    delete[] p;
}

// 4. Losing a pointer inside a loop
for (int i = 0; i < 1000; i++) {
    int* p = new int(i);  // 1000 leaks
}`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Leaks in a loop are the dangerous kind',
        body: 'A single leaked int is harmless in practice. A leak inside a loop that runs a million times exhausts memory and crashes — and the crash happens long after the buggy line, often in unrelated code that simply happened to allocate next. That distance between cause and symptom is what makes leaks hard to track down.',
      },
      { kind: 'heading', text: 'The fix: let objects own their memory' },
      {
        kind: 'code',
        code: `// Leak-prone: every exit path needs a delete
void f() {
    int* arr = new int[100];
    if (a) return;                // leak
    if (b) throw runtime_error(); // leak
    delete[] arr;
}

// Cannot leak: the destructor runs on EVERY exit path
void f() {
    vector<int> arr(100);
    if (a) return;                // arr is freed
    if (b) throw runtime_error(); // arr is freed
}                                 // arr is freed`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'RAII — the idea behind all of it',
        body: '"Resource Acquisition Is Initialisation": an object acquires a resource in its constructor and releases it in its destructor. Because C++ guarantees destructors run when scope ends — including on an early return or an exception — the resource cannot be leaked. Every standard container and smart pointer is built on this, and it is why modern C++ code rarely contains a `delete`.',
      },
      { kind: 'heading', text: 'Leaks and LeetCode' },
      {
        kind: 'text',
        body: 'The judge does not check for leaks and the process exits after each run, reclaiming everything. So a leaked node will not fail a submission. It can still matter in two places: an interviewer may ask who frees the nodes you allocated, and a problem that allocates inside a hot loop can genuinely run out of memory.',
      },
      {
        kind: 'code',
        caption: 'Freeing a whole linked list, if asked',
        code: `void freeList(ListNode* head) {
    while (head != nullptr) {
        ListNode* next = head->next;   // save it BEFORE deleting
        delete head;
        head = next;
    }
}`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Save the next pointer before deleting the node',
        body: 'Writing `delete head; head = head->next;` reads freed memory — the node is gone, so `head->next` is undefined. It may appear to work, because the freed bytes often still hold the old value, and then fail unpredictably. Always capture `next` first.',
      },
      {
        kind: 'text',
        body: 'The practical takeaway: use containers and you will not write leaks. Understand leaks so you can explain what containers are doing for you, and so you can read older code that manages memory by hand.',
      },
    ],
    keyTakeaways: [
      'A leak is heap memory you can no longer reach, and therefore can never free.',
      'Leaks inside loops exhaust memory; the crash appears far from the cause.',
      'RAII ties release to destruction, so early returns and exceptions cannot leak.',
      'When freeing a list, save `next` before deleting the current node.',
    ],
    practice: {
      prompt: 'Write a loop allocating with `new` a million times without deleting, and watch memory usage climb in Task Manager. Then rewrite it with `vector` and watch it stay flat. Then write `freeList` correctly and also the broken `delete head; head = head->next;` version — the second often *appears* to work, which is the real lesson.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-7.5',
    language: 'cpp',
    summary: 'Spot pointers that outlive what they point at — the bugs that appear to work.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A dangling pointer holds the address of memory that has been freed or destroyed. Reading it is undefined behaviour, and the cruelty is that it *often works* — the bytes are usually still there — until something else reuses that memory.',
      },
      {
        kind: 'code',
        caption: 'The three ways to create one',
        code: `// 1. Returning the address of a local
int* f() {
    int x = 5;
    return &x;          // x dies when f returns
}

// 2. Using a pointer after delete
int* p = new int(5);
delete p;
cout << *p;             // dangling — p still holds the old address

// 3. Holding a pointer into a container that reallocates
vector<int> v = {1, 2, 3};
int* p = &v[0];
v.push_back(4);         // may reallocate — p now points at freed memory
cout << *p;             // dangling`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'The bug that passes your tests and fails the judge',
        body: 'Freed memory usually retains its old contents until something else claims it, so a dangling read frequently returns the correct value on a small test. On a larger input — where more allocation happens — the memory gets reused and you get garbage or a crash. A bug that passes locally and fails on the judge, with no obvious pattern, is worth checking for this.',
      },
      { kind: 'heading', text: 'The third case is the one you will actually hit' },
      {
        kind: 'code',
        code: `vector<int> v = {1, 2, 3};

int& first = v[0];        // a reference is just as vulnerable
auto it = v.begin();      // so is an iterator

v.push_back(4);           // reallocation invalidates ALL THREE

first = 10;               // undefined behaviour
*it;                      // undefined behaviour`,
      },
      {
        kind: 'text',
        body: 'Any pointer, reference or iterator into a `vector` is only valid until the vector reallocates. This is the same rule that makes it illegal to `push_back` while range-looping — the loop\'s internal iterator dangles.',
      },
      {
        kind: 'table',
        headers: ['Container', 'What invalidates references to elements'],
        rows: [
          ['`vector`', 'Any reallocation — so any growing `push_back`, `insert`, `resize`'],
          ['`deque`', 'Any insert or erase in the middle'],
          ['`list`', 'Only erasing that specific element'],
          ['`map`, `set`', 'Only erasing that specific element'],
          ['`unordered_map`', 'A rehash invalidates *iterators*, but not references to elements'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Need stable references while growing? Use list or deque',
        body: 'If an algorithm must hold pointers to elements while the container keeps growing, `vector` is the wrong choice. `list` never invalidates references to other elements, and `deque` never invalidates references on `push_back`. Alternatively, store indices instead of pointers — an index stays valid across reallocation.',
      },
      { kind: 'heading', text: 'Defensive habits' },
      {
        kind: 'code',
        code: `int* p = new int(5);
delete p;
p = nullptr;            // now a mistaken *p crashes immediately and visibly,
                        // instead of silently reading stale data

// Prefer indices over pointers when a container may grow
int index = 0;          // stays valid
int* ptr = &v[0];       // does not`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Nulling turns a silent bug into a loud one',
        body: 'Setting a pointer to `nullptr` after deleting does not fix the logic error — but it converts an unpredictable, input-dependent misbehaviour into an immediate, reproducible crash at the exact offending line. That trade is almost always worth making.',
      },
    ],
    keyTakeaways: [
      'A dangling pointer refers to memory that has been freed or destroyed.',
      'It often appears to work, then fails on larger inputs — a classic local-pass/judge-fail bug.',
      'Any reallocation invalidates every pointer, reference and iterator into a `vector`.',
      'Store indices rather than pointers when a container may grow.',
    ],
    practice: {
      prompt: 'Take `int* p = &v[0]`, `push_back` enough elements to force reallocation, then print `*p`. Run it a few times — sometimes the old value survives, sometimes it does not. That inconsistency *is* undefined behaviour, and experiencing it makes the invalidation rules feel like a real constraint rather than pedantry.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-7.6',
    language: 'cpp',
    summary: 'Understand what copying an object actually duplicates, and when that is not enough.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'A **shallow** copy duplicates an object\'s members as they are. A **deep** copy also duplicates anything those members point at. The distinction only matters when the object owns heap memory.',
      },
      {
        kind: 'code',
        caption: 'Where shallow copying goes wrong',
        code: `class Buffer {
public:
    int* data;
    int size;

    Buffer(int n) : size(n) { data = new int[n]; }
    ~Buffer() { delete[] data; }
};

Buffer a(10);
Buffer b = a;        // default copy: copies the POINTER, not the array

// Now a.data and b.data are the SAME address.
// When both destructors run → double delete → crash.`,
      },
      {
        kind: 'text',
        body: 'The compiler-generated copy duplicates each member. For an `int` that is correct. For a pointer, it copies the address — so both objects now claim to own the same array. Whichever is destroyed first frees it; the second frees it again.',
      },
      {
        kind: 'code',
        caption: 'A deep copy fixes it',
        code: `class Buffer {
public:
    int* data;
    int size;

    Buffer(int n) : size(n) { data = new int[n]; }

    // Copy constructor — allocate our own array and copy the contents
    Buffer(const Buffer& other) : size(other.size) {
        data = new int[size];
        for (int i = 0; i < size; i++) data[i] = other.data[i];
    }

    ~Buffer() { delete[] data; }
};`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The Rule of Three',
        body: 'If a class needs any one of a **destructor**, a **copy constructor**, or a **copy assignment operator**, it almost certainly needs all three — they all exist for the same reason, that the class owns a resource. Defining only the destructor is the classic error that produces exactly the double-delete above. (With move semantics this becomes the Rule of Five.)',
      },
      { kind: 'heading', text: 'Standard containers already do this correctly' },
      {
        kind: 'code',
        code: `vector<int> a = {1, 2, 3};
vector<int> b = a;        // DEEP copy — b gets its own buffer

b[0] = 99;
cout << a[0];             // 1 — a is untouched

string s = "hello";
string t = s;             // also a deep copy`,
      },
      {
        kind: 'text',
        body: 'Every standard container implements deep copying properly. This is a large part of why using them removes so many bugs — you get correct copy semantics for free.',
      },
      { kind: 'heading', text: 'Where this bites in DSA' },
      {
        kind: 'code',
        caption: 'Copying a 2D grid',
        code: `vector<vector<int>> a = {{1, 2}, {3, 4}};
vector<vector<int>> b = a;      // fully deep — inner vectors are copied too

b[0][0] = 99;
cout << a[0][0];                // 1 — unaffected`,
      },
      {
        kind: 'code',
        caption: 'But a grid of pointers is only shallow-copied',
        code: `vector<TreeNode*> a = { node1, node2 };
vector<TreeNode*> b = a;        // copies the POINTERS

b[0]->val = 99;
cout << a[0]->val;              // 99 — same underlying node!`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Copying a container of pointers copies only the pointers',
        body: 'The vector is deep-copied, but its elements are addresses — so both vectors point at the same objects. This is exactly what "Clone Graph" and "Copy List with Random Pointer" are testing: you must explicitly allocate new nodes and rebuild the links, usually with a hash map from old node to new node.',
      },
      {
        kind: 'code',
        caption: 'The clone pattern',
        code: `unordered_map<Node*, Node*> cloned;

Node* clone(Node* node) {
    if (node == nullptr) return nullptr;
    if (cloned.count(node)) return cloned[node];    // already copied — reuse

    Node* copy = new Node(node->val);
    cloned[node] = copy;                            // record BEFORE recursing,
                                                    // so cycles terminate
    for (Node* neighbour : node->neighbours)
        copy->neighbours.push_back(clone(neighbour));

    return copy;
}`,
      },
      {
        kind: 'text',
        body: 'Recording the mapping *before* recursing is what makes this work on cyclic graphs — when the recursion loops back to a node already in progress, it finds the entry and stops rather than recursing forever.',
      },
    ],
    keyTakeaways: [
      'Shallow copy duplicates members; deep copy also duplicates what pointers point at.',
      'Rule of Three: needing a destructor means also needing copy construction and assignment.',
      'Standard containers deep-copy correctly — one more reason to use them.',
      'Copying a container of pointers is shallow: both copies share the same objects.',
    ],
    practice: {
      prompt: 'Write the `Buffer` class with only a destructor, copy it, and watch the double-delete crash. Add a copy constructor and confirm the crash disappears. Then solve Clone Graph with the hash-map pattern — recording the mapping before recursing is the detail that makes cycles terminate.',
      leetcode: { title: 'Clone Graph', slug: 'clone-graph' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-7.7',
    language: 'cpp',
    summary: 'Know precisely when objects are created and destroyed, and use it deliberately.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Every object has a lifetime: a point where it is constructed and a point where it is destroyed. C++ makes both points precise and predictable — unlike garbage-collected languages, where destruction happens at some unspecified later time.',
      },
      {
        kind: 'code',
        caption: 'Destruction is in reverse order of construction',
        code: `void f() {
    Widget a("first");
    Widget b("second");
    Widget c("third");
}   // destroyed in the order c, b, a`,
        output: 'construct first\nconstruct second\nconstruct third\ndestroy third\ndestroy second\ndestroy first',
      },
      {
        kind: 'text',
        body: 'Reverse order matters because a later object may depend on an earlier one. Destroying in reverse guarantees dependencies are still alive when their dependents are torn down.',
      },
      {
        kind: 'table',
        headers: ['Storage', 'Created', 'Destroyed'],
        rows: [
          ['Local (stack)', 'At its declaration', 'At the closing `}`'],
          ['Global / static', 'Before `main` runs', 'After `main` returns'],
          ['Heap (`new`)', 'At the `new`', 'At the `delete` — never automatically'],
          ['Temporary', 'Mid-expression', 'At the end of the full statement'],
          ['Container element', 'On insertion', 'On erase, or when the container dies'],
        ],
      },
      { kind: 'heading', text: 'Destructors run on every exit path' },
      {
        kind: 'code',
        code: `void f() {
    vector<int> v(1000);

    if (a) return;                  // v destroyed
    if (b) throw runtime_error(""); // v destroyed
    for (...) { if (c) return; }    // v destroyed
}                                   // v destroyed`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'This guarantee is what makes RAII work',
        body: 'Because destruction is guaranteed on every path out of a scope — normal exit, early return, or exception — an object that frees its resource in its destructor can never leak it. That is the entire mechanism behind `vector`, `string`, `unique_ptr` and every other self-managing type.',
      },
      { kind: 'heading', text: 'Temporaries die at the end of the statement' },
      {
        kind: 'code',
        code: `string getName() { return "hello"; }

const char* p = getName().c_str();    // DANGLING
// the temporary string is destroyed at the semicolon;
// p now points at freed memory

string s = getName();                 // safe — s owns a real string
const char* p = s.c_str();            // valid as long as s lives`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Binding a pointer into a temporary',
        body: 'A temporary lives only until the end of the full expression that created it. Taking `c_str()`, `data()`, or a reference to an element of a temporary and storing it beyond that statement leaves you with a dangling pointer. The one exception: binding a temporary to a `const&` extends its lifetime to match the reference.',
      },
      { kind: 'heading', text: 'Where lifetime shows up in your solutions' },
      {
        kind: 'code',
        caption: 'Loop-scoped objects are recreated each iteration',
        code: `for (int i = 0; i < n; i++) {
    vector<int> temp;         // constructed and destroyed n times
    // ...
}

vector<int> temp;             // constructed once
for (int i = 0; i < n; i++) {
    temp.clear();             // reuse the already-allocated buffer
    // ...
}`,
      },
      {
        kind: 'text',
        body: 'The second version reuses the heap buffer instead of allocating and freeing on every iteration. `clear()` sets the size to zero while keeping the capacity — a genuine speedup in a hot loop, and a good illustration of lifetime being something you can control deliberately.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Static locals are created once and never reset',
        body: '`static int count = 0;` inside a function is initialised on the first call only and keeps its value across all subsequent calls. That makes it another way to hold recursion state — and another thing that carries over between LeetCode test cases, exactly like a member variable. Reset it explicitly if you use one.',
      },
    ],
    keyTakeaways: [
      'Locals are destroyed at the closing brace, in reverse order of construction.',
      'Destructors run on every exit path — normal, early return, or exception.',
      'Temporaries die at the end of the full statement; pointers into them dangle.',
      'Hoisting a container out of a loop and calling `clear()` reuses its buffer.',
    ],
    practice: {
      prompt: 'Write a small class printing in its constructor and destructor, create three in a scope, and confirm the reverse destruction order. Then add an early `return` and verify all three still get destroyed. Finally, store `getName().c_str()` in a pointer and print it — the garbage you get is the temporary-lifetime rule made visible.',
    },
  },
];
