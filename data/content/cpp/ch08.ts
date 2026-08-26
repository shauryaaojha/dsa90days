import type { Lesson } from '../types';

/**
 * Chapter 8 — Object-Oriented Programming.
 * Kept deliberately DSA-focused: enough to read `class Solution`, define node
 * types and comparators, and answer the standard interview questions —
 * without drifting into an enterprise-design-patterns course.
 */
export const ch08: Lesson[] = [
  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-8.1',
    language: 'cpp',
    summary: 'Read and write a class definition — the thing every LeetCode solution lives inside.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A class bundles **data** and the **functions that operate on it** into one type. You have been writing inside one since your first submission: `class Solution`.',
      },
      {
        kind: 'code',
        caption: 'The anatomy',
        code: `class Counter {
private:
    int value;                    // data member (field)

public:
    Counter() { value = 0; }      // constructor
    void add()  { value++; }      // member function (method)
    int  get() const { return value; }
};                                // ← the semicolon is REQUIRED`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'The semicolon after the closing brace',
        body: 'A class definition ends with `};`. Functions do not. Forgetting it produces an error that usually points at the *next* line, which makes it confusing — you will stare at a perfectly correct function while the real problem sits above it. This is the single most common C++ syntax error on LeetCode.',
      },
      { kind: 'heading', text: 'Defining methods inside or outside' },
      {
        kind: 'code',
        code: `// Inside — normal for short methods and for LeetCode
class Counter {
public:
    void add() { value++; }
};

// Outside — the :: says which class it belongs to
class Counter {
public:
    void add();
};

void Counter::add() { value++; }`,
      },
      {
        kind: 'text',
        body: 'Both are equivalent. Real projects split them so headers stay readable; single-file solutions define everything inline.',
      },
      { kind: 'heading', text: 'struct vs class' },
      {
        kind: 'code',
        code: `class Foo {
    int x;          // PRIVATE by default
};

struct Bar {
    int x;          // PUBLIC by default
};`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'That default is the only difference',
        body: 'In C++ a `struct` is a `class` whose members default to public. Everything else — constructors, methods, inheritance — works identically. The convention: use `struct` for plain data holders like `TreeNode`, and `class` when you have behaviour and want things hidden. That is exactly why LeetCode declares nodes as `struct` and solutions as `class`.',
      },
      {
        kind: 'code',
        caption: 'The two definitions you meet constantly',
        code: `struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};`,
      },
      {
        kind: 'text',
        body: 'Being able to read these — and write one from memory when a problem asks you to build a list — is most of what OOP is for in DSA. The `: val(x), next(nullptr)` part is an initialiser list, covered in the constructors lesson.',
      },
    ],
    keyTakeaways: [
      'A class groups data members with the methods that act on them.',
      'A class definition ends with `};` — the missing semicolon is the classic error.',
      '`struct` members default to public, `class` members to private; nothing else differs.',
      'Use `struct` for node types, `class` for solutions with hidden state.',
    ],
    practice: {
      prompt: 'Write a `Counter` class with a private `value`, a constructor, `add()` and `get()`. Then delete the semicolon after the closing brace and read the error, noting that it points at the following line. Then write `ListNode` and `TreeNode` from memory — you will need them whenever a problem asks you to construct a list or tree.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-8.2',
    language: 'cpp',
    summary: 'Create instances of a class and know where each one lives.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'A class is a blueprint; an **object** is one actual thing built from it. Each object has its own copy of the data members.',
      },
      {
        kind: 'code',
        code: `Counter a;          // object on the stack
Counter b;          // a completely separate object

a.add();
a.add();
b.add();

a.get();            // 2
b.get();            // 1 — independent state`,
      },
      { kind: 'heading', text: 'Stack objects vs heap objects' },
      {
        kind: 'code',
        code: `// On the stack — destroyed automatically at the end of the scope
Counter a;
a.add();

// On the heap — lives until you delete it
Counter* p = new Counter();
p->add();                       // arrow, because p is a pointer
delete p;`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Dot for objects, arrow for pointers',
        body: '`a.add()` when you have the object; `p->add()` when you have a pointer to it. Mixing them up is a compile error, not a silent bug, so the compiler will keep you honest — but knowing which you are holding is the point. In tree problems you almost always hold pointers, hence the arrows everywhere.',
      },
      {
        kind: 'code',
        caption: 'The most common object creation in DSA',
        code: `// Building linked list nodes — always on the heap
ListNode* head = new ListNode(1);
head->next = new ListNode(2);
head->next->next = new ListNode(3);

// A dummy head, the idiom that simplifies list problems
ListNode dummy(0);              // on the stack — no delete needed
dummy.next = head;
ListNode* tail = &dummy;`,
      },
      {
        kind: 'text',
        body: 'The dummy-head trick deserves noting: a stack-allocated placeholder node whose `next` points at the real list. It removes the special case for "inserting before the first element", which otherwise needs its own branch in nearly every list problem.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Counter a(); does not create an object',
        body: 'It declares a *function* named `a` taking no arguments and returning a `Counter`. This is the "most vexing parse", and the error it produces later is baffling. For a default-constructed object write `Counter a;` with no brackets, or `Counter a{};` with braces.',
      },
      {
        kind: 'code',
        caption: 'Objects inside containers',
        code: `vector<Counter> counters(3);        // three default-constructed objects

counters[0].add();
counters[0].get();                 // 1

for (Counter& c : counters) c.add();   // note the & — without it you
                                       // increment copies and nothing happens`,
      },
    ],
    keyTakeaways: [
      'Each object holds its own copy of the class\'s data members.',
      'Use `.` on an object and `->` on a pointer to one.',
      'Stack objects self-destruct at scope end; heap objects need `delete`.',
      '`Counter a();` declares a function — write `Counter a;` instead.',
    ],
    practice: {
      prompt: 'Create two `Counter` objects, increment them different numbers of times, and confirm their states are independent. Then build a three-node linked list with `new`, and print the values by walking it. Then loop a `vector<Counter>` with and without `&` — only the reference version actually modifies the stored objects.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-8.3',
    language: 'cpp',
    summary: 'Control what is visible from outside — and fix the "is private" LeetCode error.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'Access specifiers decide who is allowed to touch a member. In a LeetCode solution nobody else reads your class, so the stakes look low — but there is one specific way this bites, and it produces a compiler error that confuses almost everyone the first time they meet it.',
      },
      {
        kind: 'table',
        headers: ['Specifier', 'Accessible from'],
        rows: [
          ['`public`', 'Anywhere'],
          ['`private`', 'Only inside the class itself'],
          ['`protected`', 'Inside the class and its derived classes'],
        ],
      },
      {
        kind: 'code',
        code: `class Account {
private:
    int balance = 0;              // hidden from outside

public:
    void deposit(int amount) {    // the controlled way in
        if (amount > 0) balance += amount;
    }
    int getBalance() const { return balance; }
};

Account a;
a.deposit(100);      // fine
a.balance = 999;     // ERROR: 'balance' is private within this context`,
      },
      {
        kind: 'text',
        body: 'A specifier applies to everything after it until the next one, so you can group members under each heading rather than labelling them individually.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'The LeetCode error you will actually see',
        body: '`class Solution` members are **private by default**. If you delete or forget the `public:` label, the judge cannot call your method and you get `\'int Solution::twoSum(...)\' is private within this context`. LeetCode\'s template always includes `public:` — never remove it. This is one of the most common Compile Error causes for beginners.',
      },
      {
        kind: 'code',
        caption: 'The correct layout for a solution with a helper',
        code: `class Solution {
private:
    // Helpers are private — the judge does not need them.
    void dfs(TreeNode* node, int& count) {
        if (!node) return;
        count++;
        dfs(node->left, count);
        dfs(node->right, count);
    }

public:
    // The judge calls this one, so it MUST be public.
    int countNodes(TreeNode* root) {
        int count = 0;
        dfs(root, count);
        return count;
    }
};`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'You can skip private on LeetCode',
        body: 'Members before any label are private anyway, so writing helpers above `public:` with no explicit `private:` works fine and is what most solutions do. Being explicit is clearer; both are correct.',
      },
      {
        kind: 'text',
        body: 'One more rule worth knowing: access is checked **per class, not per object**. A method of `Account` can read `other.balance` on a *different* `Account` — which is how comparison and copy operations are written.',
      },
      {
        kind: 'code',
        code: `class Account {
    int balance;
public:
    bool richerThan(const Account& other) const {
        return balance > other.balance;      // legal — same class
    }
};`,
      },
    ],
    keyTakeaways: [
      '`public` is open, `private` is class-only, `protected` adds derived classes.',
      'A label applies to everything until the next label.',
      '`class` members are private by default — keep LeetCode\'s `public:`.',
      'Access is per-class: a method can touch private members of another instance.',
    ],
    practice: {
      prompt: 'Write a class with a private field and try to assign it from outside — read the exact error text, since it is the same one LeetCode gives when `public:` goes missing. Then structure a `Solution` with a private helper and a public entry point.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-8.4',
    language: 'cpp',
    summary: 'Initialise objects properly, and read the initialiser lists in every node definition.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'A constructor runs automatically when an object is created. It has the same name as the class and no return type. Its job is to leave the object in a valid state.',
      },
      {
        kind: 'code',
        code: `class Point {
public:
    int x, y;

    Point() { x = 0; y = 0; }                 // default constructor
    Point(int a, int b) { x = a; y = b; }     // parameterised
};

Point p1;           // calls the default
Point p2(3, 4);     // calls the parameterised one`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Writing any constructor removes the free default one',
        body: 'The compiler supplies a default constructor only if you declare none at all. Once you write `Point(int, int)`, plain `Point p;` stops compiling. Add `Point() = default;` to get it back. This surprises people the moment they put a custom-constructed type into a `vector<T>(n)`, which needs default construction.',
      },
      { kind: 'heading', text: 'Initialiser lists — what the colon means' },
      {
        kind: 'code',
        code: `// Assignment inside the body
Point(int a, int b) { x = a; y = b; }

// Initialiser list — the preferred form
Point(int a, int b) : x(a), y(b) {}`,
      },
      {
        kind: 'text',
        body: 'The difference is real, not cosmetic. Members are *always* initialised before the constructor body runs. With assignment, each member is default-initialised first and then overwritten — two steps. With an initialiser list, each member is constructed directly with its final value — one step.',
      },
      {
        kind: 'table',
        headers: ['Member kind', 'Assignment in body', 'Initialiser list'],
        rows: [
          ['`int`, `double`', 'Fine — negligible difference', 'Fine'],
          ['`string`, `vector`', 'Constructs empty, then assigns — wasteful', 'Constructs once'],
          ['`const` member', '**Illegal** — cannot assign to const', 'Required'],
          ['Reference member', '**Illegal** — must bind at construction', 'Required'],
        ],
      },
      {
        kind: 'code',
        caption: 'Now the node definitions make sense',
        code: `struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* l, TreeNode* r) : val(x), left(l), right(r) {}
};`,
      },
      {
        kind: 'text',
        body: 'Three overloaded constructors, all using initialiser lists. Being able to read that line is what lets you construct test trees by hand.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Members initialise in declaration order, not list order',
        body: 'If `x` is declared before `y`, then `x` is initialised first — even if you write `: y(1), x(y)`. That code reads `y` before it exists, giving garbage. Compilers warn with `-Wall`. Keep the initialiser list in the same order as the declarations and the problem cannot arise.',
      },
      {
        kind: 'code',
        caption: 'Default member initialisers — often simpler',
        code: `struct TreeNode {
    int val = 0;
    TreeNode* left = nullptr;      // defaults written at the declaration
    TreeNode* right = nullptr;

    TreeNode() {}
    TreeNode(int x) : val(x) {}    // only override what differs
};`,
      },
      {
        kind: 'text',
        body: 'Since C++11 you can give members default values where they are declared. Constructors then only need to specify what differs — less repetition across several constructors.',
      },
    ],
    keyTakeaways: [
      'A constructor runs on creation; defining any removes the free default one.',
      'Initialiser lists construct members directly instead of default-then-assign.',
      '`const` and reference members *must* use an initialiser list.',
      'Members initialise in declaration order regardless of the list order.',
    ],
    practice: {
      prompt: 'Write `Point` with both constructor styles and confirm they behave the same. Then add a `const int id` member and watch body-assignment fail while the initialiser list works. Then write `TreeNode` from memory and build a three-node tree by hand — you will need exactly this to test tree solutions locally.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-8.5',
    language: 'cpp',
    summary: 'Clean up when an object dies — the mechanism behind every self-managing container.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A destructor runs automatically when an object is destroyed. Its name is the class name with a `~` in front. It takes no parameters, returns nothing, and there is exactly one per class.',
      },
      {
        kind: 'code',
        code: `class Buffer {
    int* data;
public:
    Buffer(int n) { data = new int[n]; }
    ~Buffer() { delete[] data; }        // destructor — releases the memory
};

void f() {
    Buffer b(100);
}   // ~Buffer() runs here automatically — nothing leaks`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'This is RAII, concretely',
        body: 'C++ guarantees the destructor runs when the object leaves scope — on a normal exit, an early `return`, or an exception. So an object that acquires a resource in its constructor and releases it in its destructor can never leak it. Every standard container works exactly this way, which is why you never write `delete` when you use `vector`.',
      },
      { kind: 'heading', text: 'When does it run?' },
      {
        kind: 'table',
        headers: ['Object', 'Destructor runs'],
        rows: [
          ['Local (stack)', 'At the closing `}` of its scope'],
          ['Heap (`new`)', 'When you call `delete` — never automatically'],
          ['Container element', 'On erase, or when the container is destroyed'],
          ['Temporary', 'At the end of the full statement'],
          ['Global / static', 'After `main` returns'],
        ],
      },
      {
        kind: 'text',
        body: 'Destruction is in reverse order of construction, so an object built later is torn down before the objects it might depend on.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'A destructor alone is a warning sign — Rule of Three',
        body: 'If a class needs a destructor, it owns a resource, which means the compiler-generated *copy* is almost certainly wrong: it copies the pointer, so two objects end up owning the same memory and both free it. Needing a destructor means also needing a copy constructor and a copy assignment operator. Defining only the destructor is exactly how you produce a double-delete crash.',
      },
      {
        kind: 'code',
        caption: 'The bug the Rule of Three prevents',
        code: `Buffer a(10);
Buffer b = a;      // default copy duplicates the POINTER
                   // now a.data == b.data
// Both destructors run → delete[] on the same address twice → crash`,
      },
      { kind: 'heading', text: 'Do you need one in DSA?' },
      {
        kind: 'text',
        body: 'Almost never. `vector`, `string` and `map` manage themselves, and your `Solution` class holds no raw resources. Two places it does come up:',
      },
      {
        kind: 'code',
        caption: 'Design problems that build structures',
        code: `class Trie {
    struct Node {
        Node* children[26] = {nullptr};
        bool isWord = false;
        ~Node() { for (Node* c : children) delete c; }   // recursive cleanup
    };
    Node* root = new Node();
public:
    ~Trie() { delete root; }
};`,
      },
      {
        kind: 'text',
        body: 'Deleting the root triggers each child\'s destructor, which deletes its children, and so on — the whole trie unwinds recursively. LeetCode will not fail you for omitting this, but an interviewer may ask who frees the nodes.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Base-class destructors must be virtual',
        body: 'If you `delete` an object through a base-class pointer and the base destructor is not `virtual`, only the base part is destroyed — the derived class\'s destructor never runs, and anything it owned leaks. Any class intended for inheritance needs `virtual ~Base() {}`. This is a standard interview question.',
      },
    ],
    keyTakeaways: [
      '`~ClassName()` runs automatically when an object is destroyed.',
      'Guaranteed on every exit path — this is the mechanism behind RAII.',
      'Needing a destructor means also needing copy construction and assignment.',
      'A base class used polymorphically needs a `virtual` destructor.',
    ],
    practice: {
      prompt: 'Write a class printing in its constructor and destructor, create one in a scope with an early `return`, and confirm the destructor still runs. Then write the `Buffer` double-delete from the Rule of Three note and watch it crash — that crash is the single best argument for using `vector`.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-8.6',
    language: 'cpp',
    summary: 'Understand the hidden pointer every method receives.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'Every non-static member function receives a hidden parameter called `this` — a pointer to the object the method was called on. It is how a method knows *which* object\'s data to use.',
      },
      {
        kind: 'code',
        code: `class Counter {
    int value;
public:
    void add() {
        value++;            // what you write
        this->value++;      // what it actually means
    }
};

Counter a, b;
a.add();      // inside add(), this == &a
b.add();      // inside add(), this == &b`,
      },
      {
        kind: 'text',
        body: 'You rarely write `this->` explicitly, because plain `value` already resolves to `this->value`. There are three situations where it is genuinely needed.',
      },
      { kind: 'heading', text: '1. Disambiguating a shadowed parameter' },
      {
        kind: 'code',
        code: `class Point {
    int x, y;
public:
    Point(int x, int y) {
        this->x = x;        // this->x is the member, x is the parameter
        this->y = y;
    }
};

// Or avoid the clash entirely with an initialiser list:
Point(int x, int y) : x(x), y(y) {}      // unambiguous — legal and idiomatic`,
      },
      {
        kind: 'text',
        body: 'That second form looks like it should be circular, but it is not: inside an initialiser list, the name before the bracket is always the member and the name inside is the parameter.',
      },
      { kind: 'heading', text: '2. Returning the object for chaining' },
      {
        kind: 'code',
        code: `class Builder {
    string s;
public:
    Builder& add(const string& part) {
        s += part;
        return *this;                    // return the object itself
    }
};

Builder b;
b.add("a").add("b").add("c");            // chained calls`,
      },
      {
        kind: 'text',
        body: 'Note `*this` — dereferencing gives the object, which the `Builder&` return type binds to. Returning `this` would return a pointer instead. This is why `cout << a << b` chains: `operator<<` returns the stream.',
      },
      { kind: 'heading', text: '3. Passing the current object elsewhere' },
      {
        kind: 'code',
        code: `void registerWith(Manager& m) {
    m.track(this);          // hand over a pointer to myself
}`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Static methods have no this',
        body: 'A `static` member function belongs to the class rather than to any object, so there is no instance for `this` to point at. Trying to use `this` — or any non-static member — inside one is a compile error. That is the defining limitation of static methods.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'In a const method, this is a pointer to const',
        body: 'Inside `int get() const`, the type of `this` becomes `const Counter*`, which is precisely what stops the method modifying any member. That is the whole mechanism behind the `const` suffix — nothing more mysterious than a differently-typed hidden parameter.',
      },
    ],
    keyTakeaways: [
      '`this` is a hidden pointer to the object a method was called on.',
      'Needed to disambiguate a shadowed parameter, or to return `*this` for chaining.',
      'Return `*this` (the object), not `this` (the pointer), for chained calls.',
      'Static methods have no `this` and cannot touch non-static members.',
    ],
    practice: {
      prompt: 'Write a constructor whose parameters share names with the members and make it work with `this->`, then rewrite it with an initialiser list. Then build a small chainable class returning `*this` and call three methods in one line — that pattern is exactly how `cout <<` chaining works.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-8.7',
    language: 'cpp',
    summary: 'Share one value across every object of a class, and know the LeetCode gotcha.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A `static` member belongs to the **class**, not to any individual object. There is exactly one copy, shared by every instance and existing even if no instance ever exists.',
      },
      {
        kind: 'code',
        code: `class Counter {
public:
    static int totalCreated;      // declared here
    int myValue = 0;              // one per object

    Counter() { totalCreated++; }
};

int Counter::totalCreated = 0;    // DEFINED once, outside the class

Counter a, b, c;
cout << Counter::totalCreated;    // 3 — accessed via the class name`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'A static data member needs an out-of-class definition',
        body: 'Declaring it inside the class does not allocate storage. Without the `int Counter::totalCreated = 0;` line you get `undefined reference to Counter::totalCreated` at link time. Since C++17 you can avoid this by writing `inline static int totalCreated = 0;` inside the class — which is what most modern code does.',
      },
      { kind: 'heading', text: 'Static member functions' },
      {
        kind: 'code',
        code: `class MathUtils {
public:
    static int square(int x) { return x * x; }    // no object needed
};

MathUtils::square(5);      // 25 — called on the class

// A static method cannot touch non-static members:
class Bad {
    int value;
    static void f() { value++; }    // ERROR — which object's value?
};`,
      },
      {
        kind: 'text',
        body: 'A static method has no `this`, so it can only use static members and its own parameters. That restriction is exactly what makes it usable as a plain function pointer — which is why comparator functions are often declared static.',
      },
      { kind: 'heading', text: 'Static local variables' },
      {
        kind: 'code',
        code: `void f() {
    static int callCount = 0;      // initialised ONCE, on the first call
    callCount++;
    cout << callCount;
}

f();  // 1
f();  // 2
f();  // 3 — the value persists between calls`,
      },
      {
        kind: 'text',
        body: 'A static local lives for the whole program but is only visible inside the function. It is occasionally used to memoise, or to hold recursion state without a member variable.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Static state survives between LeetCode test cases',
        body: 'This is the same trap as member variables, but worse — a `static` is *not* reset even if the judge constructs a fresh `Solution` object, because it belongs to the class rather than the instance. Your solution passes the first test and fails every one after it. If you use a static for memoisation, clear it at the start of the public method.',
      },
      {
        kind: 'code',
        caption: 'Memoisation done safely',
        code: `class Solution {
    unordered_map<int, long long> memo;      // member, not static

public:
    long long fib(int n) {
        memo.clear();            // reset per call — safe against object reuse
        return helper(n);
    }
private:
    long long helper(int n) {
        if (n <= 1) return n;
        if (memo.count(n)) return memo[n];
        return memo[n] = helper(n - 1) + helper(n - 2);
    }
};`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'When static is actually the right answer',
        body: 'Constants shared by all instances (`static const int MOD = 1e9 + 7;`), comparator functions passed to `sort`, and genuine utility helpers that need no object state. Outside those, prefer members — they are reset with the object and much easier to reason about.',
      },
    ],
    keyTakeaways: [
      'A static member is shared by the whole class; there is exactly one copy.',
      'Static data members need an out-of-class definition, or `inline static`.',
      'Static methods have no `this` and can only use static members.',
      'Static state persists across LeetCode test cases — clear it or avoid it.',
    ],
    practice: {
      prompt: 'Write a class counting how many objects have been created with a static member, and confirm the out-of-class definition is required by omitting it first. Then write a function with a `static int` counter, call it three times, and watch it accumulate — that persistence is the exact behaviour that breaks memoised LeetCode solutions.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-8.8',
    language: 'cpp',
    summary: 'Hide internal state behind a controlled interface, and see why STL containers do it.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Encapsulation means keeping data private and exposing only the operations that make sense. The point is not secrecy — it is that the class can guarantee its own invariants, because nothing outside can put it into an invalid state.',
      },
      {
        kind: 'code',
        caption: 'Without and with',
        code: `// Unprotected — anyone can break it
struct Account {
    int balance;
};
Account a;
a.balance = -5000;          // nothing stops this

// Encapsulated — the invariant is enforced in one place
class Account {
    int balance = 0;

public:
    bool withdraw(int amount) {
        if (amount <= 0 || amount > balance) return false;   // invariant guarded
        balance -= amount;
        return true;
    }
    int getBalance() const { return balance; }
};`,
      },
      {
        kind: 'text',
        body: 'The rule "balance is never negative" is now stated once, inside the class. Without encapsulation that rule has to be re-checked at every place in the program that touches the field — and one missed check breaks it.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'You already rely on this constantly',
        body: '`vector` keeps its buffer pointer, size and capacity private. That is why `v.size()` is always correct — you cannot desynchronise it from the actual contents, because you cannot reach it. If those fields were public, every vector bug in your program would be possible.',
      },
      { kind: 'heading', text: 'Getters and setters are not the point' },
      {
        kind: 'code',
        code: `// This achieves nothing — the field is effectively public with extra steps
class Point {
    int x;
public:
    int getX() const { return x; }
    void setX(int v) { x = v; }      // no validation, no invariant
};

// This is encapsulation — the interface is meaningful operations
class Stack {
    vector<int> data;
public:
    void push(int x)  { data.push_back(x); }
    void pop()        { if (!data.empty()) data.pop_back(); }
    int  top()  const { return data.back(); }
    bool empty() const { return data.empty(); }
};`,
      },
      {
        kind: 'text',
        body: 'The second class exposes *what you can do* rather than *what it stores*. That is why you could swap the `vector` for a linked list without any caller changing — the interface does not mention the storage.',
      },
      { kind: 'heading', text: 'Where it shows up in DSA' },
      {
        kind: 'text',
        body: 'The "design a data structure" problems are encapsulation exercises: LRU Cache, Min Stack, Trie, Time-Based Key-Value Store. Each gives you a public interface and asks you to choose the internals that hit the required complexity.',
      },
      {
        kind: 'code',
        caption: 'Min Stack — the classic',
        code: `class MinStack {
    vector<int> data;
    vector<int> mins;          // parallel stack of running minimums

public:
    void push(int val) {
        data.push_back(val);
        mins.push_back(mins.empty() ? val : min(val, mins.back()));
    }
    void pop() { data.pop_back(); mins.pop_back(); }
    int top()    const { return data.back(); }
    int getMin() const { return mins.back(); }     // O(1), thanks to the design
};`,
      },
      {
        kind: 'text',
        body: 'The caller never learns there are two vectors. That freedom — to pick whatever internals achieve O(1) `getMin` — is precisely what the private section buys you.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'A getter returning a non-const reference leaks the encapsulation',
        body: '`vector<int>& getData() { return data; }` hands the caller full write access to your internals, undoing everything the `private` label was for. Return `const vector<int>&` if callers only need to read, or return a copy if they need their own.',
      },
    ],
    keyTakeaways: [
      'Private data lets a class enforce its invariants in one place.',
      'A meaningful interface exposes operations, not storage.',
      'Design-a-data-structure problems are encapsulation exercises.',
      'Returning a non-const reference to a private member defeats the purpose.',
    ],
    practice: {
      prompt: 'Implement Min Stack with the two-vector approach so `getMin()` is O(1). Then try to make it work with a single vector and a linear scan, and note that the public interface is identical while the complexity is not — that substitutability is the whole benefit of encapsulation.',
      leetcode: { title: 'Min Stack', slug: 'min-stack' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-8.9',
    language: 'cpp',
    summary: 'Build a class on top of another, and know how much of this DSA actually needs.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Inheritance lets a class reuse and extend another. The **derived** class gets all the base class\'s members and can add or replace behaviour.',
      },
      {
        kind: 'code',
        code: `class Animal {
protected:
    string name;
public:
    Animal(const string& n) : name(n) {}
    void breathe() { cout << name << " breathes\\n"; }
};

class Dog : public Animal {
public:
    Dog(const string& n) : Animal(n) {}    // must construct the base part
    void bark() { cout << name << " barks\\n"; }   // 'name' is protected → visible
};

Dog d("Rex");
d.breathe();      // inherited from Animal
d.bark();         // its own`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'The derived constructor must initialise the base',
        body: 'The base part is constructed first, via the initialiser list: `Dog(const string& n) : Animal(n) {}`. If the base has no default constructor and you omit this, you get an error about no matching call. Construction runs base-first; destruction runs derived-first — the exact reverse.',
      },
      {
        kind: 'table',
        headers: ['Base member is…', 'In the derived class it is…'],
        rows: [
          ['`public`', 'Accessible'],
          ['`protected`', 'Accessible'],
          ['`private`', '**Not** accessible — inherited but unreachable'],
        ],
      },
      {
        kind: 'text',
        body: '`protected` exists exactly for this: visible to derived classes but still hidden from the outside world.',
      },
      { kind: 'heading', text: 'Overriding a base method' },
      {
        kind: 'code',
        code: `class Animal {
public:
    virtual void speak() { cout << "...\\n"; }
    virtual ~Animal() {}                       // virtual destructor — essential
};

class Dog : public Animal {
public:
    void speak() override { cout << "Woof\\n"; }   // 'override' catches typos
};`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Always write override',
        body: 'It is optional but it makes the compiler verify that you really are overriding something. Without it, a slightly wrong signature — a missing `const`, a different parameter type — silently creates a *new* method instead, and the base version keeps being called. That bug is genuinely hard to spot; `override` turns it into a compile error.',
      },
      { kind: 'heading', text: 'How much of this does DSA need?' },
      {
        kind: 'text',
        body: 'Honestly, very little. You will essentially never write an inheritance hierarchy to solve a LeetCode problem. It matters for three things:',
      },
      {
        kind: 'text',
        body: '**1. Reading the standard library.** `stack` and `queue` are container adaptors wrapping `deque`; stream classes form a hierarchy. **2. Interview questions.** "Explain inheritance", "what is a virtual destructor", "overloading vs overriding" are routine. **3. Design problems.** A few ask for a small hierarchy — a file system, a parking lot, a shape area calculator.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'A non-virtual destructor leaks the derived part',
        body: 'Deleting a `Derived` through a `Base*` when `~Base()` is not virtual destroys only the base sub-object. The derived destructor never runs, so anything it owned leaks. Any class you intend to inherit from needs `virtual ~Base() {}` — this is one of the most frequently asked C++ interview questions.',
      },
      {
        kind: 'text',
        body: 'Prefer composition over inheritance: a `MinStack` that *has* two vectors is simpler and more flexible than one that *is* a vector. Most real-world code — and virtually all DSA code — is better served by composition.',
      },
    ],
    keyTakeaways: [
      'A derived class inherits public and protected members, not private ones.',
      'The derived constructor initialises the base part via its initialiser list.',
      'Always mark overrides with `override` so typos become compile errors.',
      'A class meant for inheritance needs a `virtual` destructor.',
    ],
    practice: {
      prompt: 'Write `Animal` and `Dog`, override a virtual method, and call it through an `Animal*`. Then remove `virtual` from the destructor, delete a `Dog` through an `Animal*`, and observe the derived destructor never running — that is precisely the leak the interview question is about.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-8.10',
    language: 'cpp',
    summary: 'Call the right implementation through a base pointer, and distinguish it from overloading.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Polymorphism means one interface, several behaviours. In C++ it comes in two forms, and interviewers ask you to tell them apart.',
      },
      {
        kind: 'table',
        headers: ['', 'Compile-time', 'Run-time'],
        rows: [
          ['Mechanism', 'Overloading, templates', '`virtual` functions'],
          ['Resolved', 'At compile time', 'At run time, via a vtable'],
          ['Chosen by', 'Argument types', 'The actual object type'],
          ['Cost', 'None', 'One indirect call'],
        ],
      },
      { kind: 'heading', text: 'Run-time polymorphism needs virtual' },
      {
        kind: 'code',
        code: `class Shape {
public:
    virtual double area() const { return 0; }
    virtual ~Shape() {}
};

class Circle : public Shape {
    double r;
public:
    Circle(double r) : r(r) {}
    double area() const override { return 3.14159 * r * r; }
};

class Square : public Shape {
    double s;
public:
    Square(double s) : s(s) {}
    double area() const override { return s * s; }
};

vector<Shape*> shapes = { new Circle(1), new Square(2) };
for (Shape* sh : shapes)
    cout << sh->area() << "\\n";     // 3.14159, then 4 — each picks its own`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Without virtual, the base version always runs',
        body: 'Drop the `virtual` keyword and `sh->area()` calls `Shape::area()` for every element, returning 0 each time — because the call is resolved from the *pointer* type rather than the object type. This produces no error and no warning, just silently wrong answers. `virtual` is what makes the decision happen at run time.',
      },
      {
        kind: 'text',
        body: 'The mechanism: a class with virtual functions gets a hidden pointer to a **vtable**, a per-class table of function addresses. A virtual call looks up the address there rather than being fixed at compile time. That is the one indirection you pay for.',
      },
      { kind: 'heading', text: 'Abstract classes' },
      {
        kind: 'code',
        code: `class Shape {
public:
    virtual double area() const = 0;      // pure virtual — no implementation
    virtual ~Shape() {}
};

Shape s;              // ERROR — cannot instantiate an abstract class
Circle c(1);          // fine — Circle implements area()`,
      },
      {
        kind: 'text',
        body: '`= 0` makes a function **pure virtual**, and a class with any pure virtual function is abstract: it cannot be instantiated and every derived class must implement it. This is C++\'s equivalent of an interface.',
      },
      { kind: 'heading', text: 'Object slicing' },
      {
        kind: 'code',
        code: `Circle c(1);
Shape s = c;          // SLICED — only the Shape part is copied
s.area();             // 0 — the Circle part is gone

Shape* p = &c;        // correct — polymorphism needs a pointer or reference
p->area();            // 3.14159`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Polymorphism requires a pointer or reference',
        body: 'Assigning a derived object to a base *value* copies only the base portion — the derived data is literally sliced off. It compiles silently. This is why polymorphic collections are `vector<Shape*>` and never `vector<Shape>`.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The interview answer',
        body: '"Overloading is compile-time: same name, different parameters, chosen from the argument types. Overriding is run-time: a derived class replaces a `virtual` base method, chosen from the actual object type via the vtable. Overriding needs `virtual`, a pointer or reference, and a virtual destructor." That covers the question completely.',
      },
    ],
    keyTakeaways: [
      '`virtual` moves the decision from compile time to run time via the vtable.',
      'Without `virtual`, the pointer\'s type decides and the base version runs.',
      '`= 0` makes a pure virtual function and its class abstract.',
      'Polymorphism needs a pointer or reference — assigning to a base value slices.',
    ],
    practice: {
      prompt: 'Build the `Shape`/`Circle`/`Square` hierarchy and call `area()` through a `vector<Shape*>`. Then remove `virtual` and watch every call return 0. Then assign a `Circle` to a `Shape` by value and see the slicing. Those two silent failures are what the `virtual` keyword and the pointer requirement exist to prevent.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-8.11',
    language: 'cpp',
    summary: 'Know the handful of places OOP genuinely earns its place in a DSA solution.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'You will not build inheritance hierarchies to solve array problems. But OOP appears in four concrete places across the 90-day plan, and each is worth recognising.',
      },
      { kind: 'heading', text: '1. class Solution — every single problem' },
      {
        kind: 'code',
        code: `class Solution {
private:
    vector<int> result;                     // shared recursion state

    void dfs(TreeNode* node) {              // private helper
        if (!node) return;
        result.push_back(node->val);
        dfs(node->left);
        dfs(node->right);
    }

public:
    vector<int> preorder(TreeNode* root) {  // the judge calls this
        result.clear();                     // reset — the object is reused
        dfs(root);
        return result;
    }
};`,
      },
      {
        kind: 'text',
        body: 'Public entry point, private helpers, member variables for state you would otherwise thread through every recursive call. That is the shape of most non-trivial solutions.',
      },
      { kind: 'heading', text: '2. Node types you define or construct' },
      {
        kind: 'code',
        code: `struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

// Needed whenever you build a list rather than just traverse one:
ListNode* head = new ListNode(1);
head->next = new ListNode(2);`,
      },
      { kind: 'heading', text: '3. Custom comparators' },
      {
        kind: 'code',
        caption: 'The struct form, for priority_queue',
        code: `struct Compare {
    bool operator()(const pair<int,int>& a, const pair<int,int>& b) {
        return a.second > b.second;      // '>' gives a MIN-heap
    }
};

priority_queue<pair<int,int>, vector<pair<int,int>>, Compare> pq;`,
      },
      {
        kind: 'text',
        body: 'A struct with `operator()` is a **functor** — an object callable like a function. `priority_queue` takes the comparator as a *type* parameter, which is why a struct is used rather than a lambda. For `sort`, a lambda is simpler:',
      },
      {
        kind: 'code',
        code: `sort(v.begin(), v.end(), [](const auto& a, const auto& b) {
    return a.second > b.second;
});`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'The priority_queue comparator reads backwards',
        body: 'For `sort`, the comparator means "a comes before b". For `priority_queue` it means "a has *lower* priority than b" — so `>` produces a min-heap and `<` a max-heap, the opposite of what most people expect. Whenever a heap gives you the wrong end, flipping the comparison is the fix.',
      },
      { kind: 'heading', text: '4. Design-a-data-structure problems' },
      {
        kind: 'code',
        caption: 'LRU Cache — the archetype',
        code: `class LRUCache {
    int capacity;
    list<pair<int,int>> items;                              // most recent at front
    unordered_map<int, list<pair<int,int>>::iterator> pos;  // key → its node

public:
    LRUCache(int capacity) : capacity(capacity) {}

    int get(int key) {
        if (!pos.count(key)) return -1;
        items.splice(items.begin(), items, pos[key]);       // move to front, O(1)
        return pos[key]->second;
    }

    void put(int key, int value) {
        if (pos.count(key)) items.erase(pos[key]);
        else if (items.size() == capacity) {
            pos.erase(items.back().first);                  // evict least recent
            items.pop_back();
        }
        items.push_front({key, value});
        pos[key] = items.begin();
    }
};`,
      },
      {
        kind: 'text',
        body: 'The whole problem is choosing internals that hit the required complexity. A `list` gives O(1) reordering; a hash map gives O(1) lookup; together they give O(1) `get` and `put`. The public interface is fixed by the problem — your job is the private section.',
      },
      {
        kind: 'table',
        headers: ['Problem', 'What the internals need to give you'],
        rows: [
          ['Min Stack', 'O(1) minimum — a parallel stack of running minimums'],
          ['LRU Cache', 'O(1) get/put — hash map plus doubly linked list'],
          ['Trie', 'Prefix lookup — nodes with 26 children'],
          ['Time-Based Store', 'Latest value at or before a timestamp — sorted vector plus binary search'],
          ['Randomised Set', 'O(1) insert/remove/random — vector plus index map'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'What to take from this chapter',
        body: 'Read a class definition confidently, write `struct ListNode` from memory, structure a solution as public-entry-plus-private-helpers, write a comparator both ways, and be able to answer the four standard interview questions — encapsulation, inheritance, overloading vs overriding, and virtual destructors. That is genuinely all the OOP the plan requires.',
      },
    ],
    keyTakeaways: [
      'Every solution is a class: public entry point, private helpers, member state.',
      'Comparators are functors for `priority_queue`, lambdas for `sort`.',
      'A `priority_queue` comparator is inverted — `>` gives a min-heap.',
      'Design problems fix the public interface; your job is choosing the internals.',
    ],
    practice: {
      prompt: 'Implement LRU Cache with a `list` and an `unordered_map`. It is the clearest example of a public interface fixed by the problem and a private design chosen entirely for complexity — and it is one of the most frequently asked interview questions there is.',
      leetcode: { title: 'LRU Cache', slug: 'lru-cache' },
    },
  },
];
