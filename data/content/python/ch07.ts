import type { Lesson } from '../types';

/**
 * Python Chapter 7 — Object-Oriented Programming.
 * Deliberately practical: the goal is being able to write ListNode, TreeNode
 * and a DSU class fluently, not a full tour of Python's object model.
 */
export const ch07: Lesson[] = [
  // -------------------------------------------------------------------------
  {
    topicId: 'python-7.1',
    language: 'python',
    summary: 'Understand what a class is, and why DSA needs them at all.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A class is a **blueprint**; an object is a thing built from it. You have been using objects all along — a list is an object, and `nums.append(x)` calls a method on it. This chapter is about writing your own, and in DSA the reason is almost always the same: you need to represent a **node**.',
      },
      {
        kind: 'text',
        body: 'A linked list node, a tree node, a trie node, a disjoint-set structure — each bundles some data with the operations on it. That bundling is all OOP means here. You will not need inheritance hierarchies or design patterns; you will need to write `TreeNode` from memory.',
      },
      {
        kind: 'code',
        caption: 'The class you will write most often',
        code: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val          # data this node holds
        self.next = next        # link to the next node


# Build 1 -> 2 -> 3
a = ListNode(1)
b = ListNode(2)
a.next = b
b.next = ListNode(3)

print(a.val, a.next.val, a.next.next.val)`,
        output: '1 2 3',
      },
      {
        kind: 'text',
        body: 'Note the two halves: `class ListNode:` declares the blueprint, and `ListNode(1)` builds one object from it. Each object gets its **own** `val` and `next` — `a` and `b` do not share anything.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'LeetCode gives you these classes already written',
        body: 'On a linked-list or tree problem the definition appears commented out at the top of the editor. You do not write it — but you must be able to *read* it, and you will write your own for design questions like implementing a trie or an LRU cache.',
      },
      {
        kind: 'code',
        caption: 'The other one you will meet constantly',
        code: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Do not reach for a class when a tuple will do',
        body: 'For a coordinate pair or a `(distance, node)` heap entry, a plain tuple is shorter, faster and hashable. Write a class when the thing has **links to other instances of itself** — that is the case a tuple genuinely cannot express.',
      },
    ],
    keyTakeaways: [
      'A class is a blueprint; an object is one thing built from it.',
      'In DSA you write classes mainly to represent nodes.',
      'Each object gets its own copy of the attributes.',
      'Prefer a tuple for simple pairs — use a class for self-referencing structures.',
    ],
    practice: {
      prompt: 'Write `ListNode` and build a four-node list by hand. Then write a loop that walks from the head and prints every value — that walk is the basis of every linked-list problem.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-7.2',
    language: 'python',
    summary: 'Use __init__ to set up a new object, and know when it runs.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: '`__init__` is the **constructor** — Python calls it automatically the moment you build an object, and its job is to set up that object\'s starting state. The double underscores mark it as one of Python\'s special methods; you define it, but you never call it directly.',
      },
      {
        kind: 'code',
        code: `class Stack:
    def __init__(self):
        self.items = []         # every Stack starts with its own empty list
        self.max_size = 100

s = Stack()                     # __init__ runs here, automatically
print(s.items, s.max_size)`,
        output: '[] 100',
      },
      { kind: 'heading', text: 'Parameters and defaults' },
      {
        kind: 'code',
        code: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

TreeNode()              # val=0,  left=None, right=None
TreeNode(5)             # val=5,  rest default
TreeNode(5, TreeNode(3))# val=5,  left set
TreeNode(val=5, right=TreeNode(7))   # keyword args — clearest`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Never use a mutable default',
        body: '`def __init__(self, children=[])` creates the list **once**, when the class is defined — so every object that takes the default shares the *same* list. Adding a child to one node adds it to all of them. Use `children=None` and then `self.children = children or []` inside.',
      },
      {
        kind: 'code',
        caption: 'The bug, made visible',
        code: `class Bad:
    def __init__(self, items=[]):      # shared across ALL instances
        self.items = items

a, b = Bad(), Bad()
a.items.append(1)
print(b.items)                          # [1]  — b was never touched!

class Good:
    def __init__(self, items=None):
        self.items = items if items is not None else []`,
        output: '[1]',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: '`__init__` returns nothing',
        body: 'It sets up an object that Python has already created — so it must not `return` a value. Writing `return self` is an error. If you need alternative ways to construct an object, use a `@staticmethod` factory rather than trying to return from `__init__`.',
      },
    ],
    keyTakeaways: [
      '`__init__` runs automatically when you build an object.',
      'It sets up state and must not return a value.',
      'Default parameters make objects flexible to construct.',
      'Never use a mutable default — it is shared across every instance.',
    ],
    practice: {
      prompt: 'Write the `Bad` class above and reproduce the shared-list bug yourself. Then fix it with the `None` idiom. This is the most-reported Python gotcha and worth meeting once deliberately.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-7.3',
    language: 'python',
    summary: 'Store per-object data, and understand that attributes are created on assignment.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'An instance attribute is a piece of data belonging to **one object**. You create one simply by assigning to `self.something` — there is no declaration step, which makes Python far more forgiving than Java here, and also easier to typo your way into a bug.',
      },
      {
        kind: 'code',
        code: `class Counter:
    def __init__(self):
        self.count = 0          # attribute created right here

    def increment(self):
        self.count += 1         # read and write the same attribute

c1, c2 = Counter(), Counter()
c1.increment(); c1.increment()

print(c1.count, c2.count)       # independent`,
        output: '2 0',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'A typo creates a new attribute instead of failing',
        body: '`self.cont = 5` when you meant `self.count` silently adds a *second* attribute. Nothing errors, and your real value never changes. When an object seems to ignore an update, check the spelling first — Python will not catch this for you.',
      },
      {
        kind: 'text',
        body: 'You can also add attributes from outside the class entirely, though it is rarely a good idea:',
      },
      {
        kind: 'code',
        code: `c1.colour = "red"        # legal — creates the attribute on this object only
print(c2.colour)         # AttributeError — c2 never got one`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Set every attribute in `__init__`',
        body: 'Even ones you fill in later — assign `None` or an empty value. It documents the object\'s full shape in one place, and it means no method can hit an `AttributeError` on a field that was never created.',
      },
      {
        kind: 'code',
        caption: 'A DSU, whose attributes carry all the state',
        code: `class DSU:
    def __init__(self, n):
        self.parent = list(range(n))    # each node is its own root
        self.size = [1] * n
        self.components = n             # declared up front, updated later`,
      },
    ],
    keyTakeaways: [
      'Assigning to `self.x` creates the attribute — no declaration needed.',
      'Each object holds its own independent copy.',
      'A typo silently creates a new attribute rather than raising.',
      'Initialise every attribute in `__init__`, even placeholders.',
    ],
    practice: {
      prompt: 'Write the `Counter` class, then deliberately typo the attribute name inside `increment`. Run it and watch `count` stay at 0 with no error — then fix it.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-7.4',
    language: 'python',
    summary: 'Share data across all instances with class attributes, and avoid the mutable trap.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A class attribute is defined in the class body rather than inside `__init__`, and it is **shared by every instance**. Use it for constants that belong to the concept rather than to any one object — and be careful, because sharing a *mutable* class attribute causes the same bug as a mutable default.',
      },
      {
        kind: 'code',
        code: `class Circle:
    PI = 3.14159            # class attribute — one copy, shared

    def __init__(self, r):
        self.r = r          # instance attribute — one per object

    def area(self):
        return Circle.PI * self.r ** 2

print(Circle.PI)            # readable without any object
print(Circle(2).area())`,
        output: '3.14159\n12.56636',
      },
      {
        kind: 'table',
        headers: ['', 'Class attribute', 'Instance attribute'],
        rows: [
          ['Defined', 'In the class body', 'Inside `__init__` via `self.`'],
          ['Copies', 'One, shared by all', 'One per object'],
          ['Access', '`Circle.PI` or `obj.PI`', '`obj.r` only'],
          ['Good for', 'Constants, shared config', 'Per-object state'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'A mutable class attribute is shared state',
        body: 'A list or dict at class level is one object shared by every instance. `Node.children.append(x)` from any object changes it for all of them. Constants are fine; anything you intend to mutate belongs in `__init__`.',
      },
      {
        kind: 'code',
        caption: 'Shared when you did not mean it',
        code: `class Bad:
    items = []              # ONE list for the whole class

a, b = Bad(), Bad()
a.items.append(1)
print(b.items)              # [1]

class Good:
    def __init__(self):
        self.items = []     # a fresh list per object`,
        output: '[1]',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Assigning through an instance creates a *new* instance attribute',
        body: '`a.PI = 3` does not change `Circle.PI` — it shadows it with a new instance attribute on `a` alone. Every other object still sees the class value. To change the shared one you must write `Circle.PI = 3`.',
      },
    ],
    keyTakeaways: [
      'Class attributes are shared; instance attributes are per-object.',
      'Use them for constants — not for anything you will mutate.',
      'A mutable class attribute is shared state and a classic bug.',
      '`obj.attr = x` shadows the class attribute rather than updating it.',
    ],
    practice: {
      prompt: 'Reproduce the `Bad`/`Good` pair above. Then set `a.items = [9]` (assignment, not append) and print `b.items` — understanding why it stays `[1]` is the whole lesson.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-7.5',
    language: 'python',
    summary: 'Write methods, including the special ones that make objects print and compare well.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'A method is a function defined inside a class. The only structural difference from a plain function is the first parameter, `self`, which is the object the method was called on. Beyond ordinary methods, Python has **special methods** — named with double underscores — that hook your class into built-in syntax.',
      },
      {
        kind: 'code',
        code: `class Stack:
    def __init__(self):
        self.items = []

    def push(self, x):
        self.items.append(x)

    def pop(self):
        if self.is_empty():
            return None
        return self.items.pop()

    def is_empty(self):             # methods may call each other via self
        return len(self.items) == 0

s = Stack()
s.push(1); s.push(2)
print(s.pop(), s.is_empty())`,
        output: '2 False',
      },
      { kind: 'heading', text: 'The special methods worth knowing' },
      {
        kind: 'code',
        code: `class Point:
    def __init__(self, x, y):
        self.x, self.y = x, y

    def __repr__(self):             # what print() and the debugger show
        return f"Point({self.x}, {self.y})"

    def __eq__(self, other):        # makes == compare VALUES
        return self.x == other.x and self.y == other.y

    def __lt__(self, other):        # makes sorting and heapq work
        return (self.x, self.y) < (other.x, other.y)

    def __hash__(self):             # required to use it in a set or dict key
        return hash((self.x, self.y))

print(Point(1, 2))
print(Point(1, 2) == Point(1, 2))`,
        output: 'Point(1, 2)\nTrue',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: '`__lt__` is what `heapq` and `sort` actually call',
        body: 'If you want to put your own objects in a heap, defining `__lt__` is enough — `heapq` needs nothing else. Without it you get `TypeError: < not supported between instances`. This is the usual fix when a heap of custom objects refuses to work.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Defining `__eq__` silently removes hashing',
        body: 'A class with `__eq__` but no `__hash__` becomes unhashable, so it can no longer go in a set or be used as a dict key — `TypeError: unhashable type`. If you define one, define both.',
      },
      {
        kind: 'text',
        body: 'Forgetting `self` is the most common beginner error here. `def push(x)` then `s.push(1)` raises `TypeError: push() takes 1 positional argument but 2 were given`, because Python passed the object as the first argument and your signature had nowhere to put it.',
      },
    ],
    keyTakeaways: [
      'A method is a function whose first parameter is `self`.',
      '`__repr__` controls printing; `__eq__` controls `==`; `__lt__` enables sorting and heaps.',
      'Define `__hash__` whenever you define `__eq__`.',
      '"takes 1 positional argument but 2 were given" means a missing `self`.',
    ],
    practice: {
      prompt: 'Write the `Point` class with all four special methods. Put several in a `set`, sort a list of them, and push them into a `heapq` — each one exercises a different method you defined.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-7.6',
    language: 'python',
    summary: 'Understand what self actually is, and why Python makes you write it.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: '`self` is the object the method was called on. Python passes it automatically — `s.push(1)` becomes `Stack.push(s, 1)` behind the scenes — which is exactly why your definition needs a parameter for it. Once you see that translation, `self` stops looking like boilerplate.',
      },
      {
        kind: 'code',
        code: `class Stack:
    def push(self, x):
        self.items.append(x)

s.push(1)              # what you write
Stack.push(s, 1)       # what Python actually does — identical`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: '`self` is a convention, not a keyword',
        body: 'You could legally name it anything — `this`, `obj`, `me`. Every Python programmer writes `self`, so do too; the point is that it is an ordinary parameter, which is what makes the `Stack.push(s, 1)` translation possible.',
      },
      { kind: 'heading', text: 'The two mistakes' },
      {
        kind: 'code',
        code: `class Broken:
    def __init__(self):
        self.count = 0

    def bad1(self):
        count += 1              # NameError — bare 'count' is a local variable

    def bad2():                 # no self in the signature
        pass

    def good(self):
        self.count += 1         # correct — attributes always need self.`,
      },
      {
        kind: 'text',
        body: 'Inside a method, a bare name is a **local variable**, not an attribute. There is no implicit lookup on the object the way there is in Java or C++. If you want the object\'s data, you must say `self.`, every time.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Nested functions inside methods still need `self` captured',
        body: 'When you define a DFS helper inside a method, it closes over `self` from the enclosing scope, so `self.res.append(...)` works. But rebinding — `self = something` — inside the helper does not do what you expect. Read from `self`; assign to its attributes.',
      },
      {
        kind: 'code',
        caption: 'The shape you will write on tree problems',
        code: `class Solution:
    def maxDepth(self, root):
        def dfs(node):                  # nested helper — no self parameter
            if not node:
                return 0
            return 1 + max(dfs(node.left), dfs(node.right))

        return dfs(root)`,
      },
      {
        kind: 'text',
        body: 'Note the helper takes no `self` — it is a plain nested function, not a method. That is the standard shape for LeetCode solutions in Python, and it is why the class wrapper mostly stays out of your way.',
      },
    ],
    keyTakeaways: [
      '`s.push(1)` is really `Stack.push(s, 1)` — `self` is just the first parameter.',
      'Bare names inside methods are locals; attributes always need `self.`.',
      'A missing `self` gives "takes 1 positional argument but 2 were given".',
      'Nested helper functions inside a method do not take `self`.',
    ],
    practice: {
      prompt: 'Write a method that increments a counter, first with a bare `count += 1` (watch the `NameError`) and then with `self.count += 1`. Then call the method both ways — `s.method()` and `Class.method(s)` — and see they are identical.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-7.7',
    language: 'python',
    summary: 'Follow Python\'s privacy conventions, which are social rather than enforced.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'Python has no `private` keyword. Instead it has **conventions** — a leading underscore means "this is internal, do not touch from outside". Nothing stops you; the language trusts you to read the signal. This surprises people arriving from Java, where the compiler enforces it.',
      },
      {
        kind: 'code',
        code: `class Account:
    def __init__(self):
        self.owner = "me"        # public — use freely
        self._balance = 0        # internal — please do not touch
        self.__secret = 42       # name-mangled — actively awkward to reach

a = Account()
print(a.owner)        # fine
print(a._balance)     # works, but you are ignoring a clear signal
print(a.__secret)     # AttributeError`,
      },
      {
        kind: 'table',
        headers: ['Prefix', 'Means', 'Enforced?'],
        rows: [
          ['`name`', 'Public API', '—'],
          ['`_name`', 'Internal; may change without warning', 'No, convention only'],
          ['`__name`', 'Name-mangled to `_Class__name`', 'Partially — renamed, not hidden'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Double underscore is about collisions, not security',
        body: '`__x` gets rewritten to `_Account__x` so a subclass defining its own `__x` cannot clash. It is not a security feature — `a._Account__secret` reaches it. Use a single underscore unless you specifically need that collision protection.',
      },
      {
        kind: 'text',
        body: 'In DSA this barely matters. Your `TreeNode.val` is public and should be. The convention is worth knowing so you can read other people\'s code, and so that a design question like "implement an LRU cache" produces a class with an obvious public interface.',
      },
      {
        kind: 'code',
        caption: 'Where it genuinely reads well',
        code: `class LRUCache:
    def __init__(self, capacity):
        self.capacity = capacity        # public — part of the contract
        self._cache = {}                # internal storage
        self._head = None               # internal linked-list plumbing

    def get(self, key): ...             # public API
    def put(self, key, value): ...

    def _evict(self): ...               # internal helper`,
      },
    ],
    keyTakeaways: [
      'Python enforces no privacy — a leading underscore is a signal, not a lock.',
      '`_name` = internal; `__name` = name-mangled to avoid subclass collisions.',
      'Double underscore is collision avoidance, not security.',
      'Useful mainly for design questions, where a clean public API is the point.',
    ],
    practice: {
      prompt: 'Write a class with `_x` and `__y`, then try to access both from outside. Find `__y` via `obj._Class__y` — seeing that it is only renamed makes the convention clearer than any rule would.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-7.8',
    language: 'python',
    summary: 'Reuse a class by extending it, and call the parent with super().',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Inheritance lets a class build on another: the child gets everything the parent has, and adds or replaces what it needs. It matters far less in DSA than interviews suggest — but you should be able to read it, and occasionally a design question wants it.',
      },
      {
        kind: 'code',
        code: `class Node:
    def __init__(self, val):
        self.val = val

class TreeNode(Node):                    # TreeNode inherits from Node
    def __init__(self, val, left=None, right=None):
        super().__init__(val)            # run the parent's setup first
        self.left = left
        self.right = right

t = TreeNode(5)
print(t.val, t.left)                     # val came from Node`,
        output: '5 None',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Forgetting `super().__init__()`',
        body: 'If the child defines its own `__init__` and never calls the parent\'s, the parent\'s attributes are never created — and you get `AttributeError: object has no attribute \'val\'` from a completely unrelated line. Call `super().__init__(...)` first thing.',
      },
      { kind: 'heading', text: 'Overriding' },
      {
        kind: 'code',
        code: `class Animal:
    def speak(self):
        return "..."

class Dog(Animal):
    def speak(self):                     # replaces the parent version
        return "Woof"

class Puppy(Dog):
    def speak(self):
        return super().speak() + "!"     # extend rather than replace

print(Dog().speak(), Puppy().speak())`,
        output: 'Woof Woof!',
      },
      {
        kind: 'text',
        body: 'Python resolves `speak` by walking up the chain — `Puppy`, then `Dog`, then `Animal` — and uses the first one it finds. `super()` explicitly asks for the *next* one up, which is how you extend behaviour instead of discarding it.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Prefer composition to inheritance',
        body: 'A class that *has* a list is usually simpler than a class that *is* a list. `class Stack: def __init__(self): self.items = []` beats `class Stack(list)` — the second exposes every list method, including ones that break the stack abstraction, like `insert(0, x)`.',
      },
      {
        kind: 'text',
        body: 'Python allows inheriting from several classes at once. You will almost never want it in DSA, and it brings real complexity around method resolution order — treat it as something to recognise, not something to write.',
      },
    ],
    keyTakeaways: [
      '`class Child(Parent)` inherits everything, then adds or overrides.',
      'Call `super().__init__(...)` or the parent\'s attributes never get created.',
      '`super().method()` extends the parent instead of replacing it.',
      'Composition ("has a") is usually the better choice over inheritance ("is a").',
    ],
    practice: {
      prompt: 'Write the `Animal`/`Dog`/`Puppy` chain and confirm the outputs. Then delete `super().__init__(val)` from a subclass and read the `AttributeError` it causes — the message points at the wrong place, which is why the fix is worth recognising.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-7.9',
    language: 'python',
    summary: 'Understand duck typing — Python\'s version of polymorphism.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Polymorphism means "the same call does the right thing for different types". Python does this without any type declarations at all, through **duck typing**: if an object has the method you need, Python calls it and does not care what class it came from.',
      },
      {
        kind: 'code',
        code: `class Dog:
    def speak(self): return "Woof"

class Cat:
    def speak(self): return "Meow"

class Robot:                        # unrelated to the other two
    def speak(self): return "Beep"

for thing in [Dog(), Cat(), Robot()]:
    print(thing.speak())            # works — each has speak()`,
        output: 'Woof\nMeow\nBeep',
      },
      {
        kind: 'text',
        body: 'In Java these three would need a shared interface. Python requires nothing — "if it walks like a duck and quacks like a duck, treat it as a duck". The check happens at call time, not compile time.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'You have been relying on this all along',
        body: '`len()` works on lists, strings, dicts, sets and your own classes — anything defining `__len__`. `for x in thing` works on anything defining `__iter__`. Python\'s built-ins are duck typing in action, which is why they feel so uniform.',
      },
      {
        kind: 'code',
        caption: 'Making your own class work with built-ins',
        code: `class Stack:
    def __init__(self):
        self.items = []

    def __len__(self):              # now len(s) works
        return len(self.items)

    def __bool__(self):             # now "if s:" works
        return len(self.items) > 0

    def __iter__(self):             # now "for x in s:" works
        return iter(self.items)

s = Stack()
s.items = [1, 2, 3]
print(len(s), bool(s), list(s))`,
        output: '3 True [1, 2, 3]',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'The failure arrives at runtime',
        body: 'Duck typing trades compile-time safety for flexibility. Passing an object without the expected method raises `AttributeError` only when that line executes — possibly deep inside a submission. When it matters, check with `hasattr(obj, "speak")` or catch the error.',
      },
      {
        kind: 'text',
        body: 'For DSA the practical upshot is small but real: define `__lt__` and your objects sort and heap correctly; define `__len__` and `len()` works; define `__eq__` and `__hash__` and they can live in sets. You are plugging into Python\'s existing vocabulary rather than inventing your own.',
      },
    ],
    keyTakeaways: [
      'Duck typing: having the method is enough — no shared base class needed.',
      'Built-ins like `len()` and `for` are duck typing you already use.',
      'Define `__len__`, `__iter__`, `__lt__` to plug into built-in syntax.',
      'Mistakes surface at runtime as `AttributeError`, not at compile time.',
    ],
    practice: {
      prompt: 'Add `__len__`, `__bool__` and `__iter__` to a `Stack` class, then use `len(s)`, `if s:` and `for x in s:`. Watching built-in syntax start working on your own class is the clearest demonstration of the idea.',
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-7.10',
    language: 'python',
    summary: 'Bundle data with the operations on it, and expose a clean interface.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Encapsulation means keeping data and the operations on it **together**, and exposing only what callers need. Python does not enforce it, so it is a design habit rather than a language feature — but it is the habit that makes a design question go smoothly.',
      },
      {
        kind: 'code',
        caption: 'Scattered versus encapsulated',
        code: `# Scattered — the caller must know how a DSU works internally
parent = list(range(n))
size = [1] * n
# ...and every caller re-implements find and union correctly

# Encapsulated — the caller just asks questions
class DSU:
    def __init__(self, n):
        self._parent = list(range(n))
        self._size = [1] * n
        self.components = n

    def find(self, x):
        while self._parent[x] != x:
            self._parent[x] = self._parent[self._parent[x]]
            x = self._parent[x]
        return x

    def connected(self, a, b):
        return self.find(a) == self.find(b)`,
      },
      {
        kind: 'text',
        body: 'The caller writes `dsu.connected(a, b)` and never touches `_parent`. That means path compression, union by size, or a switch to a different structure entirely can all happen inside the class without any caller changing.',
      },
      { kind: 'heading', text: 'Properties — computed attributes' },
      {
        kind: 'code',
        code: `class Rectangle:
    def __init__(self, w, h):
        self.w, self.h = w, h

    @property
    def area(self):                 # called like an attribute, computed on demand
        return self.w * self.h

r = Rectangle(3, 4)
print(r.area)                       # note: no brackets`,
        output: '12',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Do not write Java-style getters and setters',
        body: '`get_val()` and `set_val()` are unidiomatic in Python. Expose the attribute directly, and if you later need logic on access, convert it to a `@property` — the caller\'s code does not change. That is precisely why Python programmers skip getters from the start.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Encapsulation is not the goal in a timed contest',
        body: 'For an ordinary LeetCode problem, a plain function is right — do not wrap everything in a class for its own sake. Reach for this when the problem *asks* for a design ("implement an LRU cache", "design a Twitter feed"), which is exactly when interviewers are grading structure.',
      },
    ],
    keyTakeaways: [
      'Keep data and its operations together; expose only what callers need.',
      'A clean interface lets the internals change freely.',
      'Use `@property` for computed values instead of getter methods.',
      'Do not over-apply it — plain functions are right for most problems.',
    ],
    practice: {
      prompt: 'Write the `DSU` class with `find`, `unite` and `connected`, then use it to count connected components. Notice you never touch `_parent` from outside — that is encapsulation doing its job.',
      leetcode: { title: 'Number of Provinces', slug: 'number-of-provinces' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'python-7.11',
    language: 'python',
    summary: 'Know the handful of DSA situations that genuinely need a class.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Most LeetCode solutions need no classes at all beyond the `Solution` wrapper the judge supplies. There are four situations where you genuinely want one — recognising them saves you from both over-engineering and from fighting a tuple that cannot do the job.',
      },
      { kind: 'heading', text: '1. Nodes that link to each other' },
      {
        kind: 'code',
        code: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val, self.next = val, next

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val, self.left, self.right = val, left, right

class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_word = False`,
      },
      {
        kind: 'text',
        body: 'This is the case a tuple cannot express: a structure containing references to more of its own kind. Every linked list, tree and trie problem starts here.',
      },
      { kind: 'heading', text: '2. Explicit "design X" problems' },
      {
        kind: 'text',
        body: 'LRU Cache, Min Stack, Implement Trie, Design Twitter — the problem statement hands you a class skeleton and names the methods. Here the class *is* the answer, and structure is what is being graded.',
      },
      { kind: 'heading', text: '3. A structure you will reuse across calls' },
      {
        kind: 'code',
        code: `class DSU:              # used across many problems — worth having memorised
    def __init__(self, n): ...
    def find(self, x): ...
    def unite(self, a, b): ...`,
      },
      { kind: 'heading', text: '4. Objects needing custom ordering in a heap' },
      {
        kind: 'code',
        code: `import heapq

class Task:
    def __init__(self, priority, name):
        self.priority, self.name = priority, name

    def __lt__(self, other):            # heapq needs only this
        return self.priority < other.priority

heap = []
heapq.heappush(heap, Task(3, "c"))
heapq.heappush(heap, Task(1, "a"))
print(heapq.heappop(heap).name)`,
        output: 'a',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'A tuple usually beats a class in a heap',
        body: '`heapq.heappush(heap, (priority, name))` sorts by the first element automatically, with no class and no `__lt__`. Only write the class when the object carries more than the heap needs, or when ties must break on a rule tuples cannot express.',
      },
      {
        kind: 'table',
        headers: ['Situation', 'Use'],
        rows: [
          ['A coordinate pair', 'tuple `(r, c)`'],
          ['A heap entry', 'tuple `(dist, node)`'],
          ['Grouped values', '`dict` or `defaultdict`'],
          ['Self-referencing structure', '**class**'],
          ['"Design ..." problem', '**class**'],
          ['Reusable structure (DSU, Trie)', '**class**'],
        ],
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Do not wrap a plain algorithm in a class',
        body: 'If a problem asks for one function, write one function. A class with a single method and no state adds indirection and nothing else — interviewers read it as unfamiliarity with the language rather than good design.',
      },
    ],
    keyTakeaways: [
      'Self-referencing structures are the case only a class can express.',
      '"Design X" problems hand you a class — that is the answer.',
      'A tuple beats a class for heap entries and coordinate pairs.',
      'Do not wrap a single stateless function in a class.',
    ],
    practice: {
      prompt: 'Implement Min Stack — a stack with `push`, `pop`, `top` and `getMin`, all O(1). It is the cleanest example of a problem where the class genuinely is the solution.',
      leetcode: { title: 'Min Stack', slug: 'min-stack' },
    },
  },
];
