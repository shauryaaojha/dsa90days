import type { Lesson } from '../types';

/**
 * Java Chapter 6 — OOP Fundamentals.
 * The largest chapter in the track. Kept DSA-focused: enough to read the
 * collections framework, write node types and comparators, structure design
 * problems, and answer the standard interview questions.
 */
export const ch06: Lesson[] = [
  // -------------------------------------------------------------------------
  {
    topicId: 'java-6.1',
    language: 'java',
    summary: 'Read a class definition and create objects from it.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A class is a blueprint bundling **data** with the **methods that operate on it**. An object is one instance built from that blueprint, with its own copy of the data.',
      },
      {
        kind: 'code',
        code: `class Counter {
    private int value;                      // field — data

    public Counter() { value = 0; }         // constructor
    public void add() { value++; }          // method — behaviour
    public int get() { return value; }
}

Counter a = new Counter();
Counter b = new Counter();

a.add(); a.add();
b.add();

a.get();      // 2
b.get();      // 1 — independent state`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'No semicolon after a class in Java',
        body: 'C++ requires `};` after a class definition and forgetting it is a classic error. Java does not — a stray semicolon is harmless but unnecessary. One fewer thing to remember when switching between the two.',
      },
      { kind: 'heading', text: 'new allocates on the heap' },
      {
        kind: 'code',
        code: `Counter c = new Counter();     // c holds a REFERENCE; the object is on the heap
Counter d = c;                 // both refer to the SAME object
d.add();
c.get();                       // reflects d's change

Counter e = null;              // refers to nothing
e.add();                       // NullPointerException`,
      },
      {
        kind: 'text',
        body: 'Every object in Java lives on the heap and every variable of a class type holds a reference. There is no stack-allocated object form as in C++ — which is why Java has no `->` operator and no manual `delete`.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Garbage collection removes an entire bug class',
        body: 'Java frees objects automatically once nothing refers to them, so there is no `delete`, no memory leaks from forgotten frees, and no dangling pointers. The C++ Rule of Three and its double-delete crashes simply do not exist here.',
      },
      { kind: 'heading', text: 'The definitions you will meet' },
      {
        kind: 'code',
        code: `class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Note the missing null initialisation',
        body: 'C++ node constructors write `next(nullptr)` explicitly. Java fields default to `null` automatically, so `ListNode(int val) { this.val = val; }` leaves `next` correctly null with no extra code. Being able to write these two classes from memory is what lets you build test data locally.',
      },
      {
        kind: 'code',
        caption: 'Building a test list and tree',
        code: `ListNode head = new ListNode(1);
head.next = new ListNode(2);
head.next.next = new ListNode(3);

TreeNode root = new TreeNode(1,
                    new TreeNode(2),
                    new TreeNode(3));`,
      },
    ],
    keyTakeaways: [
      'A class bundles fields with methods; each object has its own field values.',
      'Every object is on the heap; variables hold references, and `new` creates them.',
      'Garbage collection means no `delete`, no leaks, no dangling references.',
      'Fields default to 0/null, so node constructors are shorter than in C++.',
    ],
    practice: {
      prompt: 'Write `ListNode` and `TreeNode` from memory and build a three-node list and a three-node tree. Then assign one object reference to a second variable, modify through the second, and confirm the first sees it.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-6.2',
    language: 'java',
    summary: 'Declare state and behaviour, and know what fields default to.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A class holds two kinds of member: **fields**, which are what an object knows, and **methods**, which are what it can do. A `TreeNode` knows its value and its two children; a `DSU` knows its parent array and can `find` and `unite`. Getting comfortable naming those two halves is most of what OOP asks of you in DSA.',
      },
      {
        kind: 'code',
        code: `class Student {
    // Fields — the object's state
    private String name;
    private int score;
    private List<String> subjects = new ArrayList<>();   // inline initialiser

    // Methods — the object's behaviour
    public void addSubject(String s) { subjects.add(s); }
    public int getScore() { return score; }
    public boolean isPassing() { return score >= 40; }
}`,
      },
      { kind: 'heading', text: 'Fields get defaults; locals do not' },
      {
        kind: 'table',
        headers: ['Field type', 'Default'],
        rows: [
          ['`int`, `long`, `short`, `byte`', '`0`'],
          ['`double`, `float`', '`0.0`'],
          ['`char`', "`'\\u0000'`"],
          ['`boolean`', '`false`'],
          ['Any object type', '`null`'],
        ],
      },
      {
        kind: 'code',
        code: `class Demo {
    int count;              // 0 automatically
    String name;            // null automatically
    boolean flag;           // false automatically

    void method() {
        int local;
        System.out.println(local);   // ERROR: variable local might not
                                     // have been initialized
    }
}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The asymmetry is deliberate and helpful',
        body: 'Fields get safe defaults so an object is always in a valid state. Locals must be definitely assigned, because a garbage local is almost always a bug — and Java catches it at compile time. C++ gives you garbage in both cases.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'An object field defaults to null, not an empty object',
        body: '`private List<String> items;` leaves `items` null, so `items.add(x)` throws a `NullPointerException`. Either initialise inline (`= new ArrayList<>()`) or in the constructor. Forgetting this is the most common NPE source in design problems.',
      },
      { kind: 'heading', text: 'Instance vs static fields' },
      {
        kind: 'code',
        code: `class Counter {
    static int totalCreated;      // ONE copy, shared by all objects
    int myValue;                  // one copy PER object

    Counter() { totalCreated++; }
}

new Counter(); new Counter();
Counter.totalCreated;             // 2 — accessed via the class name`,
      },
      { kind: 'heading', text: 'Methods access fields directly' },
      {
        kind: 'code',
        code: `class Counter {
    private int value;

    public void add() {
        value++;              // no this. needed — the field is in scope
        this.value++;         // identical, but explicit
    }

    public void setValue(int value) {
        this.value = value;   // HERE this. IS needed — the parameter shadows
    }
}`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'A parameter with the same name shadows the field',
        body: 'Inside `setValue(int value)`, a bare `value` refers to the parameter. Writing `value = value;` assigns the parameter to itself and the field is never set — a silent bug with no warning. Use `this.value = value;`, which is why constructors are full of `this.`.',
      },
      {
        kind: 'text',
        body: 'One naming convention worth following: fields and methods are `camelCase`, and boolean getters conventionally start with `is` or `has` (`isEmpty`, `hasNext`). Every Java codebase follows it, and interviewers notice when you do not.',
      },
    ],
    keyTakeaways: [
      'Fields get type defaults (0, false, null); locals must be assigned before use.',
      'An uninitialised object field is `null`, not an empty object.',
      '`static` fields are shared by the class; instance fields are per object.',
      'Use `this.x = x` when a parameter shadows a field.',
    ],
    practice: {
      prompt: 'Declare a `List` field without initialising it, call `add` on it, and read the NPE. Then write a setter with `value = value;` and confirm the field stays 0 — both are silent bugs that the `this.` habit prevents.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-6.3',
    language: 'java',
    summary: 'Control visibility with the four access levels.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Access modifiers decide who is allowed to touch a field or call a method. In a LeetCode solution nobody else is reading your class, so the stakes are low — but interviewers do notice, and the habit is easy: **fields private, methods public unless there is a reason otherwise**.',
      },
      {
        kind: 'table',
        headers: ['Modifier', 'Same class', 'Same package', 'Subclass', 'Anywhere'],
        rows: [
          ['`private`', 'Yes', 'No', 'No', 'No'],
          ['(none) — package-private', 'Yes', 'Yes', 'No', 'No'],
          ['`protected`', 'Yes', 'Yes', 'Yes', 'No'],
          ['`public`', 'Yes', 'Yes', 'Yes', 'Yes'],
        ],
      },
      {
        kind: 'code',
        code: `public class Account {
    private int balance;              // only this class
    int transactionCount;             // package-private (the default)
    protected String owner;           // + subclasses
    public String accountId;          // everywhere

    public int getBalance() { return balance; }
}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Java has four levels; C++ has three',
        body: 'The extra one is package-private — the *default* when you write no modifier at all. C++ defaults to `private` in a class and `public` in a struct. So an unmodified Java field is more visible than an unmodified C++ one, which surprises people switching over.',
      },
      { kind: 'heading', text: 'On LeetCode' },
      {
        kind: 'code',
        code: `class Solution {
    private int[] memo;                      // your state — private

    public int solve(int[] nums) {           // the judge calls this — MUST be public
        memo = new int[nums.length];
        return helper(nums, 0);
    }

    private int helper(int[] nums, int i) {  // your helper — private
        ...
    }
}`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'The judge\'s method must stay public',
        body: 'LeetCode constructs a `Solution` and calls the given method from outside. Changing it to `private` gives a compile error against their harness. Note that `class Solution` itself is package-private (no `public`) in their template — that is deliberate and correct, since the file is not named `Solution.java` in their build.',
      },
      { kind: 'heading', text: 'Access is per class, not per object' },
      {
        kind: 'code',
        code: `class Account {
    private int balance;

    public boolean richerThan(Account other) {
        return balance > other.balance;      // LEGAL — same class
    }
}`,
      },
      {
        kind: 'text',
        body: 'A method may read another instance\'s private fields, as long as both are the same class. That is how `equals`, `compareTo` and copy constructors are written without exposing anything publicly.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'protected is broader than it looks',
        body: 'It grants access to subclasses **and** to every class in the same package. That surprises people who expect it to mean "subclasses only". In practice, prefer `private` with a `protected` accessor if a subclass genuinely needs the value.',
      },
      {
        kind: 'code',
        caption: 'Nested classes in DSA',
        code: `class LRUCache {
    private class Node {              // private nested class — invisible outside
        int key, value;
        Node prev, next;
        Node(int k, int v) { key = k; value = v; }
    }

    private Node head, tail;
    ...
}`,
      },
      {
        kind: 'text',
        body: 'Design problems often need a helper node type. Declaring it `private` inside the solution class keeps it invisible to the judge and signals that it is an implementation detail. Making it `static` too avoids an unnecessary reference to the outer object — covered in the inner-classes lesson.',
      },
    ],
    keyTakeaways: [
      'Four levels: `private`, package-private (default), `protected`, `public`.',
      'The default is package-private, more visible than C++\'s default.',
      'Keep the judge\'s method `public` and your helpers `private`.',
      '`protected` also grants package access, not just subclass access.',
    ],
    practice: {
      prompt: 'Write a class with one field at each access level and try to reach each from another class. Then write a method comparing two instances\' private fields and confirm it compiles — the per-class rule is what makes `equals` possible.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-6.4',
    language: 'java',
    summary: 'Initialise objects properly, and know when the free constructor disappears.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A constructor runs automatically when an object is created. It has the same name as the class, no return type, and its job is to leave the object in a valid state.',
      },
      {
        kind: 'code',
        code: `class Point {
    int x, y;

    Point() {                    // no-argument constructor
        x = 0;
        y = 0;
    }

    Point(int x, int y) {        // parameterised
        this.x = x;
        this.y = y;
    }
}

Point a = new Point();
Point b = new Point(3, 4);`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Writing any constructor removes the free default one',
        body: 'Java supplies a no-argument constructor only if you declare none at all. Once you write `Point(int, int)`, plain `new Point()` stops compiling. This bites the moment you put a custom type into a collection or framework that needs default construction — add an explicit `Point() {}` to get it back.',
      },
      { kind: 'heading', text: 'Java has no initialiser lists' },
      {
        kind: 'code',
        code: `// C++ style — does not exist in Java
// Point(int x, int y) : x(x), y(y) {}

// Java: assign in the body
Point(int x, int y) {
    this.x = x;
    this.y = y;
}

// Or use inline field initialisers for defaults
class Node {
    int val = 0;
    Node next = null;               // explicit, though null is the default
    List<Node> children = new ArrayList<>();     // genuinely useful
}`,
      },
      {
        kind: 'text',
        body: 'Inline initialisers run before the constructor body, in declaration order. They are the clean place to give collections a starting value so every constructor does not have to repeat it.',
      },
      { kind: 'heading', text: 'Order of initialisation' },
      {
        kind: 'code',
        code: `class Demo {
    int a = 1;                  // 3. inline initialisers, in order
    { a = 2; }                  // 4. instance initialiser block
    static int s = 10;          // 1. static fields, once when the class loads
    static { s = 20; }          // 2. static initialiser block

    Demo() {
        a = 3;                  // 5. constructor body — runs last
    }
}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The constructor body always runs last',
        body: 'So a value assigned inline can be overwritten by the constructor, never the other way round. In practice you rarely need initialiser blocks — inline initialisers plus a constructor cover everything. Knowing the order matters mainly for reading unfamiliar code.',
      },
      { kind: 'heading', text: 'Constructors in DSA' },
      {
        kind: 'code',
        code: `class LRUCache {
    private final int capacity;
    private final Map<Integer, Node> map;

    public LRUCache(int capacity) {        // the problem specifies this signature
        this.capacity = capacity;
        this.map = new HashMap<>();
        this.head = new Node(0, 0);        // sentinels
        this.tail = new Node(0, 0);
        head.next = tail;
        tail.prev = head;
    }
}`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Design problems specify the constructor',
        body: 'LRU Cache, Min Stack, Trie and similar problems give you a constructor signature to implement — usually taking a capacity or nothing at all. Set up all your internal structures there, because the judge constructs the object once and then calls methods on it many times.',
      },
      {
        kind: 'text',
        body: 'One thing you never write in Java: a destructor. Garbage collection handles cleanup, so there is no `~ClassName()` and no Rule of Three to worry about.',
      },
    ],
    keyTakeaways: [
      'A constructor has the class name and no return type.',
      'Writing any constructor removes the free no-argument one.',
      'Java has no initialiser lists — assign in the body or inline.',
      'Inline initialisers run first; the constructor body runs last.',
    ],
    practice: {
      prompt: 'Write a class with only a parameterised constructor, then try `new ClassName()` and read the error. Then add an inline field initialiser and a constructor assignment to the same field, and confirm the constructor wins.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-6.5',
    language: 'java',
    summary: 'Provide several ways to construct an object, and chain them with this().',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'Overloaded constructors let the caller build an object in whatever way suits them — `new TreeNode()`, `new TreeNode(5)`, or `new TreeNode(5, left, right)`. LeetCode\'s own `TreeNode` and `ListNode` classes are defined exactly like this, so you have already been using the pattern. `this(...)` lets one constructor delegate to another so the real work is written once.',
      },
      {
        kind: 'code',
        code: `class TreeNode {
    int val;
    TreeNode left, right;

    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}`,
      },
      {
        kind: 'text',
        body: 'Constructor overloading follows the same rules as method overloading: the versions must differ in the number or types of parameters. This is exactly why LeetCode\'s node classes have three constructors — so you can write `new TreeNode(5)` or build a whole subtree in one expression.',
      },
      { kind: 'heading', text: 'Chaining with this()' },
      {
        kind: 'code',
        code: `class Rectangle {
    int width, height;

    Rectangle() {
        this(1, 1);                  // delegates to the two-arg constructor
    }

    Rectangle(int size) {
        this(size, size);            // a square
    }

    Rectangle(int width, int height) {    // the ONE that does the real work
        this.width = width;
        this.height = height;
    }
}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Funnel every constructor into one',
        body: 'Having one constructor do the actual initialisation and the others delegate to it means validation and setup live in a single place. Adding a new field later means changing one constructor, not four. This is the standard Java pattern.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'this() must be the very first statement',
        body: 'You cannot do anything before it — not even a validation check. `Rectangle() { validate(); this(1,1); }` is a compile error. The rule exists because the object must be fully constructed before any other code touches it. The same applies to `super()`.',
      },
      {
        kind: 'code',
        code: `Rectangle() {
    System.out.println("before");     // ERROR
    this(1, 1);
}

Rectangle() {
    this(1, 1);
    System.out.println("after");      // fine
}`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'this() and super() cannot both appear',
        body: 'A constructor calls exactly one of them, and it must be first. If you write neither, Java inserts an implicit `super()` call to the superclass\'s no-argument constructor — which is why a superclass without one forces every subclass constructor to call `super(...)` explicitly.',
      },
      {
        kind: 'code',
        caption: 'Overloading in a design problem',
        code: `class Trie {
    private final Node root;

    public Trie() {
        this(26);                     // default: lowercase alphabet
    }

    public Trie(int alphabetSize) {
        this.root = new Node(alphabetSize);
    }
}`,
      },
      {
        kind: 'text',
        body: 'In DSA you will mostly *use* overloaded constructors rather than write them — `new ArrayList<>()` versus `new ArrayList<>(capacity)` versus `new ArrayList<>(otherCollection)` are three overloads you reach for constantly.',
      },
    ],
    keyTakeaways: [
      'Constructors overload on parameter count and types, like methods.',
      '`this(...)` delegates to another constructor and must be the first statement.',
      'Funnel every constructor into one that does the real initialisation.',
      'A constructor calls either `this()` or `super()`, never both.',
    ],
    practice: {
      prompt: 'Write a class with three constructors chained via `this()`, with only the last doing real work. Then try putting a statement before the `this()` call and read the error — that ordering rule is a common interview question.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-6.6',
    language: 'java',
    summary: 'Understand the implicit reference every instance method receives.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: '`this` is a reference to the object the method was called on. Every instance method receives it implicitly — it is how a method knows *which* object\'s fields to use.',
      },
      {
        kind: 'code',
        code: `class Counter {
    private int value;

    public void add() {
        value++;              // what you write
        this.value++;         // what it means
    }
}

Counter a = new Counter(), b = new Counter();
a.add();      // inside add(), this refers to a
b.add();      // inside add(), this refers to b`,
      },
      { kind: 'heading', text: 'The three places you need it explicitly' },
      {
        kind: 'code',
        caption: '1. Disambiguating a shadowed parameter — by far the most common',
        code: `class Point {
    int x, y;

    Point(int x, int y) {
        this.x = x;           // this.x is the field, x is the parameter
        this.y = y;
    }

    void setX(int x) {
        this.x = x;
    }
}`,
      },
      {
        kind: 'code',
        caption: '2. Returning the object for chaining',
        code: `class Builder {
    private StringBuilder sb = new StringBuilder();

    public Builder add(String part) {
        sb.append(part);
        return this;                  // return the object itself
    }
}

new Builder().add("a").add("b").add("c");`,
      },
      {
        kind: 'code',
        caption: '3. Passing the current object elsewhere',
        code: `class Node {
    void registerWith(Manager m) {
        m.track(this);                // hand over a reference to myself
    }
}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Java returns this, C++ returns *this',
        body: 'In C++ you must dereference — `return *this;` — because `this` is a pointer. In Java it is already a reference, so `return this;` is correct. A small syntactic difference worth noting if you write both languages.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Static methods have no this',
        body: 'A `static` method belongs to the class, not an object, so there is nothing for `this` to refer to. Using `this` — or any instance field — inside one gives `non-static variable cannot be referenced from a static context`. That is the defining limitation of static methods.',
      },
      {
        kind: 'code',
        caption: 'this() versus this',
        code: `class Demo {
    Demo() {
        this(5);          // this(...) — calls another CONSTRUCTOR
    }

    Demo(int x) { }

    Demo getSelf() {
        return this;      // this — the current OBJECT
    }
}`,
      },
      {
        kind: 'text',
        body: 'Same keyword, two meanings, distinguished by the parentheses. `this(...)` only works as the first statement of a constructor; bare `this` works anywhere in an instance method.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Inside a lambda, this refers to the enclosing object',
        body: 'Unlike an anonymous inner class, where `this` means the anonymous instance, a lambda does not introduce a new `this`. So `list.forEach(x -> this.count++)` refers to the outer object\'s field — usually what you want, but a genuine difference between the two forms.',
      },
    ],
    keyTakeaways: [
      '`this` references the object a method was called on.',
      'Its main use is `this.x = x` when a parameter shadows a field.',
      '`return this;` enables method chaining — no dereference, unlike C++.',
      'Static methods have no `this` and cannot touch instance state.',
    ],
    practice: {
      prompt: 'Write a constructor whose parameters shadow the fields and make it work with `this.`. Then build a chainable class returning `this` and call three methods in one expression. Then try `this` inside a static method and read the error.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-6.7',
    language: 'java',
    summary: 'Share state across all instances — and avoid the LeetCode trap it creates.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A `static` member belongs to the **class**, not to any object. There is exactly one copy, shared by every instance, and it exists even if no object is ever created.',
      },
      {
        kind: 'code',
        code: `class Counter {
    static int totalCreated = 0;      // one copy for the whole class
    int myValue = 0;                  // one copy per object

    Counter() { totalCreated++; }
}

new Counter(); new Counter(); new Counter();
Counter.totalCreated;                 // 3 — accessed via the class name`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'No out-of-class definition needed, unlike C++',
        body: 'C++ requires `int Counter::totalCreated = 0;` in a source file or you get a link error. Java initialises static fields inline and needs nothing extra. One fewer piece of boilerplate.',
      },
      { kind: 'heading', text: 'Static methods' },
      {
        kind: 'code',
        code: `class MathUtils {
    static int gcd(int a, int b) {
        return b == 0 ? a : gcd(b, a % b);
    }
}

MathUtils.gcd(12, 18);        // no object needed

// The library is full of them:
Math.max(a, b);   Arrays.sort(arr);   Integer.parseInt(s);   Collections.reverse(list);`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Static state persists across LeetCode test cases',
        body: 'A `static` field belongs to the class, so it survives even when the judge constructs a **fresh** `Solution` object. Your solution passes the first test and fails every one after. This is worse than the instance-field version of the trap, because a new object does not reset it. Avoid mutable static state, or clear it explicitly.',
      },
      {
        kind: 'code',
        caption: 'The bug and the fix',
        code: `class Solution {
    private static Map<Integer,Integer> memo = new HashMap<>();  // DANGER

    public int fib(int n) {
        return helper(n);            // memo still holds the previous test's data
    }
}

class Solution {
    private Map<Integer,Integer> memo;      // instance field

    public int fib(int n) {
        memo = new HashMap<>();      // fresh each call — safe
        return helper(n);
    }
}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'static final constants are completely safe',
        body: 'The problem is only mutable static state. `private static final int MOD = 1_000_000_007;` and `private static final int[] DR = {-1,1,0,0};` are immutable, correctly shared, and avoid reallocating on every call. Use them freely — they are the idiomatic place for a modulus or a direction array.',
      },
      { kind: 'heading', text: 'Static nested classes' },
      {
        kind: 'code',
        code: `class Solution {
    private static class Node {          // static — no reference to the outer object
        int val;
        Node next;
        Node(int val) { this.val = val; }
    }
}`,
      },
      {
        kind: 'text',
        body: 'A helper class inside a solution should almost always be `static`. Without it, every `Node` silently holds a reference to the enclosing `Solution` — wasting memory and, in long-lived code, preventing garbage collection. The inner-classes lesson covers this in more detail.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'A static method cannot call an instance method',
        body: 'It has no object to call it on. If your helper touches instance fields, it must be an instance method. Keep helpers static only when they are pure functions of their arguments — like `gcd` above.',
      },
    ],
    keyTakeaways: [
      '`static` members belong to the class; there is exactly one copy.',
      'Java initialises static fields inline — no out-of-class definition.',
      'Mutable static state survives across LeetCode test cases — avoid it.',
      '`static final` constants and `static` nested classes are the safe uses.',
    ],
    practice: {
      prompt: 'Add a static counter to a class, create three objects, and print the count. Then put a static `HashMap` in a `Solution`, call the method twice, and watch stale data carry over — that is exactly the "passes test 1, fails the rest" bug.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-6.8',
    language: 'java',
    summary: 'Lock variables, methods and classes — and know what final does not do.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: '`final` means "this cannot be reassigned". The catch — and it is the same shape as the `==` catch with strings — is that on an object reference it freezes **the reference, not the object**. A `final` list can still have things added to it; you just cannot point the variable at a different list.',
      },
      {
        kind: 'table',
        headers: ['`final` on a…', 'Means'],
        rows: [
          ['Variable', 'Cannot be reassigned after initialisation'],
          ['Method', 'Cannot be overridden by a subclass'],
          ['Class', 'Cannot be extended at all'],
          ['Parameter', 'Cannot be reassigned inside the method'],
        ],
      },
      {
        kind: 'code',
        code: `final int MAX = 100;
MAX = 200;                        // ERROR

final class Immutable { }         // no subclass allowed
class Sub extends Immutable { }   // ERROR

class Base {
    final void cannotOverride() { }
}`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'final freezes the reference, not the object',
        body: 'A `final List` cannot be pointed at a different list, but you can `add` to it all day. This is the most misunderstood thing about `final`: it is about the *variable*, not the contents. For genuinely unmodifiable contents you need `List.of(...)` or `Collections.unmodifiableList(...)`.',
      },
      {
        kind: 'code',
        code: `final List<Integer> list = new ArrayList<>();
list.add(1);                      // fine — contents are mutable
list = new ArrayList<>();         // ERROR — the reference is final

final int[] arr = {1, 2, 3};
arr[0] = 99;                      // fine
arr = new int[5];                 // ERROR`,
      },
      { kind: 'heading', text: 'Why String and the wrappers are final' },
      {
        kind: 'text',
        body: '`String`, `Integer`, `Long` and the other wrappers are all `final` classes. Nobody can subclass them and change their behaviour, which is what makes them safe to pool, cache and use as `HashMap` keys — their hash code can never be subverted.',
      },
      {
        kind: 'code',
        caption: 'Where you will actually write it',
        code: `class Solution {
    private static final int MOD = 1_000_000_007;
    private static final int[] DR = {-1, 1, 0, 0};
    private static final int[] DC = {0, 0, -1, 1};

    private final int capacity;               // set once in the constructor

    public Solution(int capacity) {
        this.capacity = capacity;             // a final field may be assigned
    }                                          // exactly once, in the constructor
}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'A final field can be assigned in the constructor',
        body: 'It does not have to be initialised at declaration — it just has to be assigned exactly once before the constructor finishes. That is how design problems store an immutable `capacity` passed in at construction time.',
      },
      { kind: 'heading', text: 'Effectively final and lambdas' },
      {
        kind: 'code',
        code: `int count = 0;
list.forEach(x -> count++);       // ERROR: local variables referenced from a
                                  // lambda must be final or effectively final

int[] count = {0};
list.forEach(x -> count[0]++);    // works — the reference never changes

// Or use an instance field:
this.count++;                     // fields have no such restriction`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Lambdas can only capture effectively-final locals',
        body: '"Effectively final" means never reassigned, whether or not you wrote the keyword. The restriction exists because a lambda may outlive the method call, and Java captures by value rather than by reference. The one-element-array workaround is standard, and it is the same trick Python needs for the same reason.',
      },
      {
        kind: 'text',
        body: 'In DSA you will use `final` mainly for constants and occasionally to satisfy the lambda rule. It is not something to sprinkle everywhere — but `private static final` on a modulus or direction array is genuinely idiomatic.',
      },
    ],
    keyTakeaways: [
      '`final` prevents reassignment of the variable, not mutation of the object.',
      'A `final` field may be assigned once in the constructor.',
      '`String` and the wrappers are `final` classes, which is why they are safe as keys.',
      'Lambdas capture only effectively-final locals — use an array or a field.',
    ],
    practice: {
      prompt: 'Declare a `final List`, add to it, then try to reassign it. Then write a lambda incrementing a local counter, read the "effectively final" error, and fix it with the `int[]` trick.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-6.9',
    language: 'java',
    summary: 'Extend a class, and understand constructor chaining up the hierarchy.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Inheritance lets one class build on another: the subclass gets everything the superclass has, and adds or replaces what it needs. It matters far less in DSA than interviews imply — you will use it rarely — but you should be able to read it, and the constructor-chaining rule is genuinely worth knowing because the compiler enforces it strictly.',
      },
      {
        kind: 'code',
        code: `class Animal {
    protected String name;

    Animal(String name) { this.name = name; }

    void breathe() { System.out.println(name + " breathes"); }
}

class Dog extends Animal {
    Dog(String name) {
        super(name);                 // MUST construct the base part first
    }

    void bark() { System.out.println(name + " barks"); }   // name is protected
}

Dog d = new Dog("Rex");
d.breathe();      // inherited
d.bark();         // its own`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'super(...) must be the first statement',
        body: 'And if you omit it, Java inserts an implicit `super()` — a call to the superclass\'s **no-argument** constructor. If the superclass has none (because it defines only a parameterised one), you get `constructor Animal in class Animal cannot be applied to given types`. That error message is confusing until you know it means "you forgot super(...)".',
      },
      {
        kind: 'table',
        headers: ['Base member is…', 'In the subclass it is…'],
        rows: [
          ['`public`', 'Accessible'],
          ['`protected`', 'Accessible'],
          ['package-private', 'Accessible only in the same package'],
          ['`private`', '**Not** accessible — inherited but unreachable'],
        ],
      },
      {
        kind: 'text',
        body: '`protected` exists exactly for this: visible to subclasses but still hidden from unrelated code. A private field is still *there* in the object — it just cannot be named from the subclass.',
      },
      { kind: 'heading', text: 'Java allows only single inheritance' },
      {
        kind: 'code',
        code: `class A extends B, C { }        // ERROR — no multiple inheritance in Java

class A extends B implements C, D { }    // but any number of INTERFACES`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'One superclass, many interfaces',
        body: 'C++ allows multiple inheritance and inherits its diamond problem. Java deliberately does not: a class extends at most one class but may implement any number of interfaces. Since interfaces (traditionally) carried no state, there is nothing to conflict. This is one of Java\'s defining design decisions.',
      },
      { kind: 'heading', text: 'Overriding' },
      {
        kind: 'code',
        code: `class Animal {
    void speak() { System.out.println("..."); }
}

class Dog extends Animal {
    @Override
    void speak() { System.out.println("Woof"); }      // replaces the base version

    void both() {
        speak();          // the Dog version
        super.speak();    // explicitly the Animal version
    }
}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Always write @Override',
        body: 'It is optional but makes the compiler verify you really are overriding something. Without it, a slightly wrong signature — a missing parameter, a different type — silently creates a *new* method and the base version keeps being called. `@Override` turns that hard-to-spot bug into a compile error.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Every class extends Object',
        body: 'Even one with no `extends` clause. That is where `toString()`, `equals()`, `hashCode()` and `getClass()` come from — and why you can call `toString()` on anything. Overriding `equals` and `hashCode` together is what makes a custom class usable as a `HashMap` key.',
      },
      {
        kind: 'text',
        body: 'In DSA you will rarely build a hierarchy. Inheritance matters here for three things: reading the collections framework, answering interview questions, and the occasional design problem — a file system, a shape-area calculator. Prefer composition otherwise: a `MinStack` that *has* two stacks is simpler than one that *is* a stack.',
      },
    ],
    keyTakeaways: [
      '`super(...)` must be the first statement; Java inserts `super()` if you omit it.',
      'Subclasses inherit public and protected members, not private ones.',
      'One superclass, any number of interfaces — no multiple inheritance.',
      'Always mark overrides with `@Override` so typos become compile errors.',
    ],
    practice: {
      prompt: 'Write `Animal` with only a parameterised constructor, then a `Dog` subclass that omits `super(...)` — read the confusing error. Then override a method with a slightly wrong signature, with and without `@Override`, and see which one the compiler catches.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-6.10',
    language: 'java',
    summary: 'Call the right implementation through a base reference — and distinguish it from overloading.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Polymorphism means one interface, several behaviours. Java has two forms, and telling them apart is a standard interview question.',
      },
      {
        kind: 'table',
        headers: ['', 'Overloading', 'Overriding'],
        rows: [
          ['Same name, different…', 'Parameters', 'Nothing — identical signature'],
          ['Resolved', 'At **compile** time', 'At **run** time'],
          ['Chosen by', 'Argument types', 'The actual object type'],
          ['Needs inheritance', 'No', '**Yes**'],
          ['Also called', 'Static polymorphism', 'Dynamic polymorphism'],
        ],
      },
      {
        kind: 'code',
        caption: 'Overriding in action',
        code: `class Shape {
    double area() { return 0; }
}

class Circle extends Shape {
    double r;
    Circle(double r) { this.r = r; }
    @Override double area() { return Math.PI * r * r; }
}

class Square extends Shape {
    double s;
    Square(double s) { this.s = s; }
    @Override double area() { return s * s; }
}

List<Shape> shapes = List.of(new Circle(1), new Square(2));
for (Shape sh : shapes)
    System.out.println(sh.area());       // 3.14159, then 4 — each picks its own`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Java methods are virtual by default — C++ methods are not',
        body: 'In C++ you must write `virtual` or the base version is always called, silently returning wrong answers. In Java every non-final, non-static method is dynamically dispatched automatically. That removes one of C++\'s nastiest silent bugs — and it is why `final` on a method exists, to opt *out*.',
      },
      { kind: 'heading', text: 'Upcasting and downcasting' },
      {
        kind: 'code',
        code: `Shape s = new Circle(1);          // upcast — always safe, implicit
s.area();                         // calls Circle.area()
// s.r;                           // ERROR — the Shape type has no r

Circle c = (Circle) s;            // downcast — checked at runtime
c.r;                              // now accessible

Shape sq = new Square(2);
Circle bad = (Circle) sq;         // compiles, throws ClassCastException

if (sq instanceof Circle circle) {    // safe, and binds the variable (Java 16+)
    circle.r;
}`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'No object slicing in Java',
        body: 'In C++, `Shape s = circle;` copies only the base part and the derived data is lost — silently. Java has no such problem because every variable holds a reference, never an object by value. Assigning a `Circle` to a `Shape` variable keeps the whole object; only the *visible* methods narrow.',
      },
      { kind: 'heading', text: 'Where it appears in DSA' },
      {
        kind: 'code',
        code: `// Programming to the interface — polymorphism you use every day
List<Integer> list = new ArrayList<>();      // could swap in LinkedList
Map<String,Integer> map = new HashMap<>();   // could swap in TreeMap
Queue<Integer> q = new ArrayDeque<>();
Deque<Integer> stack = new ArrayDeque<>();

// The method called depends on the actual object, not the declared type.`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Declare the interface, instantiate the implementation',
        body: '`List<Integer> list = new ArrayList<>();` rather than `ArrayList<Integer> list = ...`. It documents that you only rely on `List` behaviour and lets you swap the implementation by changing one word. This is the single most visible use of polymorphism in everyday Java, and interviewers notice when you do it.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Fields are not polymorphic',
        body: 'Only methods are dynamically dispatched. If both `Shape` and `Circle` declare a field `name`, which one you get depends on the *declared* type of the variable, not the object. This is called field hiding, it is confusing, and the fix is simply never to redeclare a field in a subclass.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The interview answer',
        body: '"Overloading is compile-time: same name, different parameters, chosen from argument types. Overriding is run-time: a subclass replaces a superclass method with an identical signature, chosen from the actual object type. Java methods are virtual by default, so overriding needs no keyword — unlike C++."',
      },
    ],
    keyTakeaways: [
      'Overloading is compile-time by parameters; overriding is run-time by object type.',
      'Java methods are virtual by default — no `virtual` keyword needed.',
      'There is no object slicing, because variables always hold references.',
      'Declare the interface (`List`), instantiate the implementation (`ArrayList`).',
    ],
    practice: {
      prompt: 'Build the `Shape`/`Circle`/`Square` hierarchy and call `area()` through a `List<Shape>`. Then downcast a `Square` to a `Circle` and read the `ClassCastException`, then guard it with `instanceof`.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-6.11',
    language: 'java',
    summary: 'Hide implementation behind a contract — and see where DSA actually uses it.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Abstraction means exposing **what** something does while hiding **how**. Encapsulation hides *data*; abstraction hides *implementation*. They are related but not the same thing.',
      },
      {
        kind: 'code',
        caption: 'You rely on this constantly',
        code: `List<Integer> list = new ArrayList<>();
list.add(5);
list.get(0);

// You do not know or care that ArrayList uses a growable Object[],
// that it grows by 1.5x, or where the elements physically live.
// The List INTERFACE is the abstraction; ArrayList is one implementation.`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The payoff is substitutability',
        body: 'Because your code depends on `List`, swapping `new ArrayList<>()` for `new LinkedList<>()` changes one word and nothing else. That is only possible because the abstraction never mentioned arrays. Every time you write `Map<String,Integer> m = new HashMap<>();` you are using this.',
      },
      { kind: 'heading', text: 'The two mechanisms Java provides' },
      {
        kind: 'code',
        code: `// 1. Interface — a pure contract, no implementation
interface Shape {
    double area();
}

// 2. Abstract class — a partial implementation
abstract class Shape {
    abstract double area();                  // subclasses must supply this
    void describe() {                        // shared, already written
        System.out.println("Area: " + area());
    }
}`,
      },
      {
        kind: 'text',
        body: 'Both declare "every Shape can report its area" without saying how. The next two lessons cover each in detail; the point here is that abstraction is the *goal* and these are the tools.',
      },
      { kind: 'heading', text: 'Where DSA genuinely uses it' },
      {
        kind: 'code',
        caption: 'Comparable — "I know how to order myself"',
        code: `class Task implements Comparable<Task> {
    int priority;

    @Override
    public int compareTo(Task other) {
        return Integer.compare(this.priority, other.priority);
    }
}

List<Task> tasks = new ArrayList<>();
Collections.sort(tasks);                     // works — Task is Comparable
PriorityQueue<Task> pq = new PriorityQueue<>();   // also works`,
      },
      {
        kind: 'code',
        caption: 'Comparator — "here is how to order them"',
        code: `// When you cannot modify the class, or want several orderings
tasks.sort(Comparator.comparingInt(t -> t.priority));
tasks.sort((a, b) -> Integer.compare(b.priority, a.priority));   // descending

PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[1] - b[1]);`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Comparable is intrinsic; Comparator is external',
        body: 'A class implements `Comparable` to define its one natural ordering. A `Comparator` is a separate object supplying any ordering you like, including for classes you did not write. `sort` accepts either, because both are abstractions over "how do I compare two of these" — that is a very common interview question.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Never subtract inside a comparator',
        body: '`(a, b) -> a.value - b.value` overflows when the values are far apart, producing a wrong ordering and occasionally a crash inside the sort. `Integer.compare(a.value, b.value)` cannot overflow. This is a genuine bug that only surfaces on extreme inputs.',
      },
      {
        kind: 'text',
        body: 'The practical takeaway for DSA: you will *consume* abstractions far more than you define them. Declaring variables by their interface type and writing comparators are the two places it shows up in almost every solution.',
      },
    ],
    keyTakeaways: [
      'Abstraction hides implementation; encapsulation hides data.',
      'Interfaces and abstract classes are the two mechanisms Java provides.',
      '`Comparable` defines a class\'s natural order; `Comparator` supplies one externally.',
      'Use `Integer.compare`, never subtraction, inside a comparator.',
    ],
    practice: {
      prompt: 'Make a class implement `Comparable` and sort a list of them. Then sort the same list three different ways with `Comparator` lambdas. Then write a subtracting comparator and test it with `Integer.MIN_VALUE` to see the overflow.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-6.12',
    language: 'java',
    summary: 'Protect invariants with private state — the principle behind design problems.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Encapsulation means keeping data private and exposing only meaningful operations. The point is not secrecy — it is that the class can **guarantee its own invariants**, because nothing outside can put it into an invalid state.',
      },
      {
        kind: 'code',
        caption: 'Without and with',
        code: `// Unprotected — anyone can break it
class Account {
    public int balance;
}
account.balance = -5000;              // nothing stops this

// Encapsulated — the rule lives in one place
class Account {
    private int balance;

    public boolean withdraw(int amount) {
        if (amount <= 0 || amount > balance) return false;    // invariant guarded
        balance -= amount;
        return true;
    }

    public int getBalance() { return balance; }
}`,
      },
      {
        kind: 'text',
        body: 'The rule "balance is never negative" is now stated once. Without encapsulation it must be re-checked everywhere the field is touched, and one missed check breaks it.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'You already depend on this',
        body: '`ArrayList` keeps its backing array and size private. That is why `list.size()` is always correct — you cannot desynchronise it from the contents, because you cannot reach it. If those fields were public, every list bug in your program would be possible.',
      },
      { kind: 'heading', text: 'Getters and setters are not the point' },
      {
        kind: 'code',
        code: `// This achieves nothing — the field is public with extra steps
class Point {
    private int x;
    public int getX() { return x; }
    public void setX(int x) { this.x = x; }      // no validation, no invariant
}

// This is encapsulation — the interface is meaningful operations
class MinStack {
    private Deque<Integer> data = new ArrayDeque<>();
    private Deque<Integer> mins = new ArrayDeque<>();

    public void push(int val) {
        data.push(val);
        mins.push(mins.isEmpty() ? val : Math.min(val, mins.peek()));
    }
    public void pop()    { data.pop(); mins.pop(); }
    public int top()     { return data.peek(); }
    public int getMin()  { return mins.peek(); }      // O(1)
}`,
      },
      {
        kind: 'text',
        body: 'The second class exposes *what you can do*, not *what it stores*. The caller never learns there are two deques — which is exactly the freedom that lets you choose internals achieving O(1) `getMin`.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Returning a mutable field leaks the encapsulation',
        body: '`public List<Integer> getItems() { return items; }` hands the caller full write access to your internals, undoing everything `private` was for. Return `Collections.unmodifiableList(items)`, or a copy — `new ArrayList<>(items)` — if the caller needs their own.',
      },
      { kind: 'heading', text: 'Design problems are encapsulation exercises' },
      {
        kind: 'table',
        headers: ['Problem', 'What the internals must give you'],
        rows: [
          ['Min Stack', 'O(1) minimum — a parallel stack of running minimums'],
          ['LRU Cache', 'O(1) get/put — `HashMap` plus a doubly linked list'],
          ['Trie', 'Prefix lookup — nodes with 26 children'],
          ['Time-Based Store', 'Latest value at or before a time — sorted list plus binary search'],
          ['Randomised Set', 'O(1) insert/remove/random — `ArrayList` plus an index map'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The problem fixes the public interface; you choose the private part',
        body: 'That is the entire exercise. The method signatures are given, and the whole difficulty is picking internals that hit the required complexity. Recognising that reframes "design a data structure" problems from open-ended to quite specific.',
      },
    ],
    keyTakeaways: [
      'Private data lets a class enforce its invariants in one place.',
      'A meaningful interface exposes operations, not storage.',
      'Returning a mutable internal collection defeats the purpose.',
      'Design problems fix the public interface; your job is the internals.',
    ],
    practice: {
      prompt: 'Implement Min Stack with two deques so `getMin()` is O(1). Then try it with a single stack and a linear scan — the public interface is identical while the complexity is not, which is the whole benefit of hiding the internals.',
      leetcode: { title: 'Min Stack', slug: 'min-stack' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-6.13',
    language: 'java',
    summary: 'Define contracts, and understand the interfaces behind every collection you use.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'An interface is a **promise about what a class can do**, with none of the how. This is the one OOP topic that pays off immediately in DSA, because the entire collections framework is built from interfaces — every time you write `List<Integer> list = new ArrayList<>()` you are using one, whether or not you knew its name.',
      },
      {
        kind: 'code',
        code: `interface Shape {
    double area();                       // implicitly public abstract
    double perimeter();
}

class Circle implements Shape {
    double r;
    Circle(double r) { this.r = r; }

    @Override public double area()      { return Math.PI * r * r; }
    @Override public double perimeter() { return 2 * Math.PI * r; }
}`,
      },
      {
        kind: 'text',
        body: 'An interface is a contract: any class implementing it **must** provide every method. Methods are implicitly `public abstract`, and fields are implicitly `public static final` — so an interface cannot hold instance state.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'A class implements any number of interfaces',
        body: 'Unlike `extends`, which allows one superclass. `class Task extends Base implements Comparable<Task>, Runnable` is fine. That is Java\'s answer to multiple inheritance: many contracts, one implementation lineage, and therefore no diamond problem.',
      },
      { kind: 'heading', text: 'The collections framework is interfaces' },
      {
        kind: 'code',
        code: `Collection
 ├── List      → ArrayList, LinkedList, Vector
 ├── Set       → HashSet, LinkedHashSet, TreeSet
 └── Queue     → ArrayDeque, LinkedList, PriorityQueue
      └── Deque → ArrayDeque, LinkedList

Map (separate)  → HashMap, LinkedHashMap, TreeMap`,
      },
      {
        kind: 'code',
        code: `List<Integer> list = new ArrayList<>();       // declare the interface
Set<String> set = new HashSet<>();
Map<String,Integer> map = new HashMap<>();
Deque<Integer> stack = new ArrayDeque<>();
Queue<Integer> queue = new ArrayDeque<>();`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Declare the interface, instantiate the implementation',
        body: 'It documents that you depend only on the contract, and swapping `HashMap` for `TreeMap` becomes a one-word change. Interviewers read `ArrayList<Integer> list = new ArrayList<>()` as slightly unpolished; `List<Integer> list = ...` is the expected form.',
      },
      { kind: 'heading', text: 'Functional interfaces and lambdas' },
      {
        kind: 'code',
        code: `// An interface with exactly ONE abstract method can be written as a lambda
Comparator<Integer> desc = (a, b) -> Integer.compare(b, a);
Runnable r = () -> System.out.println("run");
Predicate<Integer> positive = x -> x > 0;
Function<Integer,Integer> square = x -> x * x;

list.sort((a, b) -> a.score - b.score);      // Comparator as a lambda
list.removeIf(x -> x < 0);                   // Predicate as a lambda
list.forEach(x -> System.out.println(x));    // Consumer as a lambda`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'A lambda is an interface implementation in disguise',
        body: 'When you pass `(a, b) -> ...` to `sort`, Java creates an object implementing `Comparator` with that body as `compare`. Understanding this explains why lambdas work only where a single-method interface is expected — and why `Comparator.comparingInt(...)` returns a `Comparator` you can chain with `.thenComparing(...)`.',
      },
      {
        kind: 'code',
        caption: 'Comparator chaining',
        code: `list.sort(Comparator.comparingInt(Person::getAge)
                    .thenComparing(Person::getName));

list.sort(Comparator.comparingInt(Person::getScore).reversed());`,
      },
      { kind: 'heading', text: 'Default methods' },
      {
        kind: 'code',
        code: `interface Shape {
    double area();

    default String describe() {           // Java 8+ — a body in an interface
        return "Area is " + area();
    }
}`,
      },
      {
        kind: 'text',
        body: '`default` methods let an interface gain new behaviour without breaking every existing implementation. That is how `List.sort` and `Collection.removeIf` were added in Java 8 — they are default methods, so no existing class had to change.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'An interface still cannot hold instance state',
        body: 'Fields are implicitly `static final`, so there is no per-object data. That is precisely why implementing several interfaces cannot conflict the way C++ multiple inheritance can — there is no state to duplicate.',
      },
    ],
    keyTakeaways: [
      'An interface is a contract; a class may implement any number of them.',
      'The collections framework is interfaces — declare `List`, instantiate `ArrayList`.',
      'A single-abstract-method interface can be written as a lambda.',
      '`default` methods add behaviour without breaking existing implementations.',
    ],
    practice: {
      prompt: 'Write an interface with two methods and a class implementing it. Then sort a list three ways using `Comparator` lambdas and `Comparator.comparingInt(...).thenComparing(...)` — that chaining is worth being fluent with.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-6.14',
    language: 'java',
    summary: 'Share partial implementation, and know when to pick an abstract class over an interface.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'An abstract class sits between a normal class and an interface: it can hold real fields and finished methods, but it also leaves some methods unwritten for subclasses to fill in, and it cannot be instantiated on its own. The practical question is when to choose it over an interface — the short answer is **when the subclasses need to share state**.',
      },
      {
        kind: 'code',
        code: `abstract class Shape {
    protected String name;                    // interfaces cannot have this

    Shape(String name) { this.name = name; }  // interfaces cannot have this either

    abstract double area();                   // subclasses MUST implement

    void describe() {                         // shared implementation
        System.out.println(name + " has area " + area());
    }
}

class Circle extends Shape {
    private double r;
    Circle(double r) { super("Circle"); this.r = r; }
    @Override double area() { return Math.PI * r * r; }
}

Shape s = new Shape("x");        // ERROR — cannot instantiate an abstract class
Shape s = new Circle(1);         // fine`,
      },
      {
        kind: 'text',
        body: 'An `abstract` class cannot be instantiated. It exists to be extended, providing some implementation and requiring the rest. Any class with an abstract method must itself be abstract.',
      },
      {
        kind: 'table',
        headers: ['', 'Interface', 'Abstract class'],
        rows: [
          ['Instance fields', 'No', '**Yes**'],
          ['Constructor', 'No', '**Yes**'],
          ['How many per class', '**Many**', 'One'],
          ['Method bodies', '`default` / `static` only', 'Any'],
          ['Access modifiers on methods', 'Public only', 'Any'],
          ['Keyword', '`implements`', '`extends`'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The choice, in one line',
        body: 'Use an **interface** when unrelated classes share a capability — "can be compared", "can be run". Use an **abstract class** when related classes share both state and behaviour, and you want to write part of it once. If you need a constructor or instance fields, only the abstract class can do it.',
      },
      { kind: 'heading', text: 'The template method pattern' },
      {
        kind: 'code',
        code: `abstract class Solver {
    // The algorithm's shape is fixed here...
    public final int solve(int[] input) {
        int[] prepared = preprocess(input);
        return compute(prepared);
    }

    private int[] preprocess(int[] a) { ... }    // shared

    protected abstract int compute(int[] a);     // ...but this step varies
}`,
      },
      {
        kind: 'text',
        body: 'The base class fixes the sequence of steps and subclasses fill in the varying part. `final` on `solve` prevents a subclass from changing the sequence. You will not write this in DSA, but it is the classic reason abstract classes exist and it appears in framework code constantly.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Since Java 8 the distinction has narrowed',
        body: 'Interfaces gained `default` and `static` methods, so they can now carry behaviour. What they still cannot have is **instance state** and **constructors**. That is now the real dividing line, and it is what the interview question is really testing.',
      },
      {
        kind: 'code',
        caption: 'You already extend abstract classes',
        code: `// AbstractList, AbstractMap, AbstractSet exist so that writing a custom
// collection means implementing two or three methods rather than twenty.

class MyList extends AbstractList<Integer> {
    @Override public Integer get(int i) { ... }
    @Override public int size() { ... }
    // everything else — iterator(), contains(), toString() — is inherited
}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'In DSA, prefer composition',
        body: 'You will essentially never build a hierarchy to solve a LeetCode problem. `MinStack` that *has* two deques is simpler and more flexible than one that *is* a stack. Know abstract classes for the interview question and for reading library source; reach for composition when writing solutions.',
      },
    ],
    keyTakeaways: [
      'An abstract class cannot be instantiated and may mix abstract and concrete methods.',
      'Only abstract classes can have instance fields and constructors.',
      'One superclass, many interfaces — that often decides the choice for you.',
      'Prefer composition over inheritance in DSA solutions.',
    ],
    practice: {
      prompt: 'Write an abstract `Shape` with a constructor, a shared `describe()` and an abstract `area()`, then two subclasses. Then try to instantiate `Shape` directly and read the error. Then state in one sentence when you would pick an interface instead.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-6.15',
    language: 'java',
    summary: 'Define classes inside classes — and always mark them static in DSA.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Java lets you declare a class inside another. There are four kinds, but for DSA only the first two matter.',
      },
      {
        kind: 'code',
        caption: '1. Static nested class — the one you want',
        code: `class LRUCache {
    private static class Node {              // static — independent of the outer object
        int key, value;
        Node prev, next;
        Node(int k, int v) { key = k; value = v; }
    }

    private Node head, tail;
}`,
      },
      {
        kind: 'code',
        caption: '2. Inner (non-static) class — holds a hidden outer reference',
        code: `class Outer {
    private int x = 5;

    class Inner {                    // NOT static
        void show() {
            System.out.println(x);   // can read the outer object's fields
        }
    }
}

Outer o = new Outer();
Outer.Inner i = o.new Inner();       // needs an outer instance — odd syntax`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Always mark a helper class static',
        body: 'A non-static inner class silently stores a reference to the enclosing object. For a `Node` in a linked list with 10⁵ nodes, that is 10⁵ wasted references — and in long-lived code it prevents the outer object from ever being garbage collected. There is no benefit unless you genuinely need the outer fields, which node classes never do.',
      },
      {
        kind: 'code',
        caption: 'The three shapes you will actually write',
        code: `class Solution {
    // A node type for a design problem
    private static class Node {
        int val;
        Node next;
        Node(int val) { this.val = val; }
    }

    // A trie node
    private static class TrieNode {
        TrieNode[] children = new TrieNode[26];
        boolean isWord;
    }

    // A small record for grouped values (Java 16+)
    private record Pair(int index, int value) {}
}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'A record is the shortest option for a plain data holder',
        body: '`private record Pair(int a, int b) {}` generates the constructor, accessors `a()` and `b()`, plus `equals`, `hashCode` and `toString`. LeetCode supports it. For a two-field bundle it beats both a static class and the usual `int[]` workaround — and unlike `int[]`, it works correctly as a `HashMap` key.',
      },
      { kind: 'heading', text: 'Anonymous classes' },
      {
        kind: 'code',
        code: `// The pre-lambda way to supply a Comparator
Comparator<Integer> desc = new Comparator<Integer>() {
    @Override
    public int compare(Integer a, Integer b) {
        return Integer.compare(b, a);
    }
};

// The lambda equivalent — same thing, far shorter
Comparator<Integer> desc = (a, b) -> Integer.compare(b, a);`,
      },
      {
        kind: 'text',
        body: 'An anonymous class defines and instantiates a class in one expression. Lambdas replaced them for single-method interfaces, but you still meet them in older code and in cases needing more than one method.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'this means different things in the two forms',
        body: 'Inside an anonymous class, `this` refers to the anonymous instance. Inside a lambda, `this` refers to the *enclosing* object, because a lambda does not create a new scope for it. That difference matters whenever a lambda touches a field.',
      },
      {
        kind: 'code',
        caption: 'Local classes — rare but legal',
        code: `void method() {
    class Helper {                   // declared inside a method
        void go() { }
    }
    new Helper().go();
}`,
      },
      {
        kind: 'text',
        body: 'You will almost never need this. The reason to know it exists is that a local class, like a lambda, can only capture effectively-final locals — the same restriction, for the same reason.',
      },
    ],
    keyTakeaways: [
      'Static nested classes are independent; inner classes hold an outer reference.',
      'Always mark helper node classes `static` — the hidden reference is pure waste.',
      'A `record` is the shortest correct data holder and works as a map key.',
      'In a lambda `this` is the enclosing object; in an anonymous class it is not.',
    ],
    practice: {
      prompt: 'Write a `private static class Node` inside a solution and build a small linked structure. Then remove `static` and note that you now need `outer.new Node()` to create one — that awkwardness is the clue that you wanted static all along.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'java-6.16',
    language: 'java',
    summary: 'Know the handful of places OOP genuinely earns its place in a solution.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'You will not build inheritance hierarchies to solve array problems. But OOP appears in five concrete places across the 90-day plan, and each is worth recognising.',
      },
      { kind: 'heading', text: '1. class Solution — every single problem' },
      {
        kind: 'code',
        code: `class Solution {
    private List<Integer> result;             // shared recursion state

    private void dfs(TreeNode node) {         // private helper
        if (node == null) return;
        result.add(node.val);
        dfs(node.left);
        dfs(node.right);
    }

    public List<Integer> preorder(TreeNode root) {    // the judge calls this
        result = new ArrayList<>();           // reset — the object is reused
        dfs(root);
        return result;
    }
}`,
      },
      { kind: 'heading', text: '2. Node types you define or construct' },
      {
        kind: 'code',
        code: `class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
}

// Needed whenever you BUILD a list rather than just traverse one:
ListNode dummy = new ListNode(0);
ListNode tail = dummy;
tail.next = new ListNode(5);`,
      },
      { kind: 'heading', text: '3. Comparators — the most common OOP in DSA' },
      {
        kind: 'code',
        code: `// Sorting
Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
list.sort(Comparator.comparingInt(Person::getAge).thenComparing(Person::getName));

// A min-heap by the second element
PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[1] - b[1]);

// A max-heap
PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Two comparator rules worth memorising',
        body: 'Use `Integer.compare(a, b)` rather than `a - b`, which overflows on extreme values. And Java\'s `PriorityQueue` is a **min**-heap by default — the opposite of C++\'s `priority_queue`. For a max-heap you need `Collections.reverseOrder()` or a reversed comparator.',
      },
      { kind: 'heading', text: '4. Design-a-data-structure problems' },
      {
        kind: 'code',
        caption: 'LRU Cache — the archetype',
        code: `class LRUCache {
    private static class Node {
        int key, value;
        Node prev, next;
        Node(int k, int v) { key = k; value = v; }
    }

    private final int capacity;
    private final Map<Integer, Node> map = new HashMap<>();
    private final Node head = new Node(0, 0), tail = new Node(0, 0);

    public LRUCache(int capacity) {
        this.capacity = capacity;
        head.next = tail;
        tail.prev = head;
    }

    private void remove(Node n) { n.prev.next = n.next; n.next.prev = n.prev; }
    private void addFront(Node n) {
        n.next = head.next; n.prev = head;
        head.next.prev = n; head.next = n;
    }

    public int get(int key) {
        if (!map.containsKey(key)) return -1;
        Node n = map.get(key);
        remove(n); addFront(n);
        return n.value;
    }

    public void put(int key, int value) {
        if (map.containsKey(key)) remove(map.get(key));
        else if (map.size() == capacity) {
            Node lru = tail.prev;
            remove(lru); map.remove(lru.key);
        }
        Node n = new Node(key, value);
        addFront(n); map.put(key, n);
    }
}`,
      },
      {
        kind: 'text',
        body: 'Private static node class, private helper methods, `final` fields set in the constructor, sentinels to remove null checks. Every OOP feature here is doing real work — this is what the chapter was for.',
      },
      { kind: 'heading', text: '5. equals and hashCode for custom map keys' },
      {
        kind: 'code',
        code: `// A class used as a HashMap key MUST override both
private record Point(int r, int c) {}        // record does it automatically

// Without a record, you write:
private static class Point {
    int r, c;
    @Override public boolean equals(Object o) {
        if (!(o instanceof Point p)) return false;
        return r == p.r && c == p.c;
    }
    @Override public int hashCode() { return Objects.hash(r, c); }
}`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Override both, or neither',
        body: 'A `HashMap` finds a key by hashing first and comparing second. Overriding only `equals` means two equal objects hash to different buckets and lookups miss; overriding only `hashCode` means they collide but never compare equal. Both, consistently — or use a `record`, which generates them for you.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'What to take from this chapter',
        body: 'Read a class definition confidently, write `ListNode` and `TreeNode` from memory, structure a solution as public-entry-plus-private-helpers, write comparators three ways, and answer the four standard interview questions — encapsulation, inheritance, overloading vs overriding, and interface vs abstract class. That is genuinely all the OOP the plan requires.',
      },
    ],
    keyTakeaways: [
      'Every solution is a class: public entry point, private helpers, member state.',
      'Comparators are the most frequent OOP in DSA — use `Integer.compare`.',
      'Java\'s `PriorityQueue` is a min-heap by default, unlike C++.',
      'A custom map key needs both `equals` and `hashCode` — or use a `record`.',
    ],
    practice: {
      prompt: 'Implement LRU Cache with a private static `Node` class and sentinels. Then use a `record` as a `HashMap` key for grid coordinates, and try the same with a plain class missing `hashCode` to see every lookup fail.',
      leetcode: { title: 'LRU Cache', slug: 'lru-cache' },
    },
  },
];
