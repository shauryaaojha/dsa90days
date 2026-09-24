import type { SharedLesson } from './types';

/**
 * Stacks and Queues in Depth — Master LIFO and FIFO primitives, scratch implementations
 * via arrays and linked lists, amortised two-stack queues, circular ring buffers, deques,
 * arithmetic expression evaluation, delimiter validation, and monotonic stacks.
 */
export const lessons: SharedLesson[] = [
  // =========================================================================
  // Lesson 1: Stack via array and via linked list
  // =========================================================================
  {
    sub: 1,
    summary: 'Implement a Last-In, First-Out (LIFO) stack from scratch using dynamic arrays and singly linked lists, analysing memory layout and access trade-offs.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A **stack** is a linear data structure that restricts insertion and deletion to one end of the sequence, designated as the **top**. It operates on the **Last-In, First-Out (LIFO)** principle: the item inserted most recently is the first item removed. Four core operations define the stack interface: `push` places an item onto the top, `pop` removes the top item, `peek` inspects the top item without removal, and `isEmpty` reports whether the stack contains elements.',
      },
      { kind: 'heading', text: 'Array backing versus linked list backing' },
      {
        kind: 'text',
        body: 'An array implementation tracks a top index over contiguous memory. This achieves high **cache locality**, meaning neighbouring elements load into CPU cache lines together. Resizing dynamic arrays incurs occasional reallocation pauses, though amortised push time remains constant. A singly linked list implementation stores values in discrete nodes with pointers. Pushing allocates a node at the head, guaranteeing strictly O(1) worst-case time without reallocation pauses, at the expense of extra pointer bytes per element and scattered memory addresses.',
      },
      {
        kind: 'code',
        caption: 'Array-based stack with amortised O(1) operations',
        code: {
          cpp: `#include <vector>
#include <stdexcept>
using namespace std;

class ArrayStack {
    vector<int> data;
public:
    void push(int val) { data.push_back(val); }
    int pop() {
        if (isEmpty()) throw runtime_error("Stack underflow");
        int val = data.back();
        data.pop_back();
        return val;
    }
    int peek() const {
        if (isEmpty()) throw runtime_error("Stack is empty");
        return data.back();
    }
    bool isEmpty() const { return data.empty(); }
    int size() const { return data.size(); }
};`,
          java: `import java.util.ArrayList;
import java.util.EmptyStackException;

public class ArrayStack {
    private ArrayList<Integer> data = new ArrayList<>();

    public void push(int val) { data.add(val); }
    public int pop() {
        if (isEmpty()) throw new EmptyStackException();
        return data.remove(data.size() - 1);
    }
    public int peek() {
        if (isEmpty()) throw new EmptyStackException();
        return data.get(data.size() - 1);
    }
    public boolean isEmpty() { return data.isEmpty(); }
    public int size() { return data.size(); }
}`,
          python: `class ArrayStack:
    def __init__(self):
        self.data: list[int] = []

    def push(self, val: int) -> None:
        self.data.append(val)

    def pop(self) -> int:
        if self.is_empty():
            raise IndexError("Stack underflow")
        return self.data.pop()

    def peek(self) -> int:
        if self.is_empty():
            raise IndexError("Stack is empty")
        return self.data[-1]

    def is_empty(self) -> bool:
        return len(self.data) == 0

    def size(self) -> int:
        return len(self.data)`,
        },
      },
      { kind: 'heading', text: 'Complexity and structural trade-offs' },
      {
        kind: 'table',
        headers: ['Operation / Attribute', 'Array Stack', 'Linked List Stack', 'Key Consideration'],
        rows: [
          ['`push(val)`', 'O(1) amortised', 'O(1) worst-case', 'Array resizes geometrically; list allocates heap nodes'],
          ['`pop()`', 'O(1)', 'O(1)', 'Array decrements index; list deallocates head node'],
          ['`peek()`', 'O(1)', 'O(1)', 'Direct index lookup vs head pointer dereference'],
          ['Memory Overhead', 'Low (capacity buffer)', 'High (one pointer per node)', 'List consumes 8 additional pointer bytes per node'],
          ['Cache Locality', 'High (contiguous buffer)', 'Low (heap pointer chasing)', 'Arrays trigger significantly fewer CPU cache misses'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Stack underflow on empty inspection',
        body: 'Invoking `pop()` or `peek()` on an empty stack triggers **stack underflow**, resulting in out-of-bounds index exceptions or null pointer dereferences. Always verify that `isEmpty()` evaluates to false before querying or removing the top element.',
      },
    ],
    keyTakeaways: [
      'A stack enforces Last-In, First-Out (LIFO) order where items enter and leave at the top.',
      'Array-backed stacks deliver superior cache locality and minimal memory overhead with amortised O(1) push time.',
      'Linked list stacks guarantee strictly O(1) worst-case push time at the cost of pointer memory overhead.',
      'Always guard pop and peek operations with an isEmpty check to prevent stack underflow.',
    ],
    practice: {
      prompt: 'Implement a bounded stack that stores integers with a fixed maximum size. Support push, pop, and an increment operation that adds a value to the bottom k elements.',
      leetcode: { title: 'Design a Stack With Increment Operation', slug: 'design-a-stack-with-increment-operation' },
    },
  },

  // =========================================================================
  // Lesson 2: Min-stack
  // =========================================================================
  {
    sub: 2,
    summary: 'Design a stack that retrieves the minimum element in O(1) constant time alongside standard push and pop operations.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A standard stack permits constant-time insertion, inspection, and removal of its topmost element. However, querying the minimum element across the entire collection requires scanning every stored value in O(n) linear time. A **min-stack** extends the stack contract with a `getMin()` operation that returns the smallest value currently stored in strictly O(1) time without compromising O(1) push and pop performance.',
      },
      { kind: 'heading', text: 'Prefix minimum tracking via an auxiliary stack' },
      {
        kind: 'text',
        body: 'Tracking the minimum value using a single variable fails when that minimum is popped, leaving no historical record of the preceding minimum. Because stack elements leave in reverse arrival order, the minimum for any stack height depends solely on elements situated beneath it. Maintaining a parallel auxiliary stack resolves this: each entry in the auxiliary stack stores the **prefix minimum** up to that depth, synchronised with the primary stack.',
      },
      {
        kind: 'code',
        caption: 'MinStack implementation using parallel primary and auxiliary stacks',
        code: {
          cpp: `#include <stack>
#include <algorithm>
using namespace std;

class MinStack {
    stack<int> mainSt;
    stack<int> minSt;
public:
    void push(int val) {
        mainSt.push(val);
        int currentMin = minSt.empty() ? val : min(val, minSt.top());
        minSt.push(currentMin);
    }
    void pop() {
        mainSt.pop();
        minSt.pop();
    }
    int top() const { return mainSt.top(); }
    int getMin() const { return minSt.top(); }
};`,
          java: `import java.util.ArrayDeque;
import java.util.Deque;

public class MinStack {
    private Deque<Integer> mainSt = new ArrayDeque<>();
    private Deque<Integer> minSt = new ArrayDeque<>();

    public void push(int val) {
        mainSt.push(val);
        int currentMin = minSt.isEmpty() ? val : Math.min(val, minSt.peek());
        minSt.push(currentMin);
    }
    public void pop() {
        mainSt.pop();
        minSt.pop();
    }
    public int top() { return mainSt.peek(); }
    public int getMin() { return minSt.peek(); }
}`,
          python: `class MinStack:
    def __init__(self):
        self.main_st: list[int] = []
        self.min_st: list[int] = []

    def push(self, val: int) -> None:
        self.main_st.append(val)
        current_min = val if not self.min_st else min(val, self.min_st[-1])
        self.min_st.append(current_min)

    def pop(self) -> None:
        self.main_st.pop()
        self.min_st.pop()

    def top(self) -> int:
        return self.main_st[-1]

    def get_min(self) -> int:
        return self.min_st[-1]`,
        },
      },
      { kind: 'heading', text: 'Operation complexity breakdown' },
      {
        kind: 'table',
        headers: ['Operation', 'Time Complexity', 'Auxiliary Space', 'State Invariant'],
        rows: [
          ['`push(val)`', 'O(1)', 'O(1) extra', 'Pushes val and records min(val, currentMin) to min stack'],
          ['`pop()`', 'O(1)', 'O(1)', 'Pops top element concurrently from both stacks'],
          ['`top()`', 'O(1)', 'O(1)', 'Reads topmost element from primary stack directly'],
          ['`getMin()`', 'O(1)', 'O(1)', 'Reads topmost element from auxiliary stack in constant time'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Duplicate minimum values and premature popping',
        body: 'Optimisations that push to the auxiliary stack conditionally (only when the new value is less than or equal to the current minimum) must account for duplicates. If a minimum value appears multiple times, popping one occurrence must not remove the tracking entry while other identical values remain in the primary stack. Synchronising parallel stacks at identical depths eliminates this hazard.',
      },
    ],
    keyTakeaways: [
      'A min-stack retrieves the current minimum element in O(1) time without sacrificing O(1) push or pop.',
      'A single minimum scalar variable fails because history is lost when the minimum element is popped.',
      'An auxiliary stack records running prefix minimums corresponding to each depth of the primary stack.',
      'Constant-time minimum queries require O(n) auxiliary memory to retain historical minimum states.',
    ],
    practice: {
      prompt: 'Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.',
      leetcode: { title: 'Min Stack', slug: 'min-stack' },
    },
  },

  // =========================================================================
  // Lesson 3: Queue via two stacks, stack via two queues
  // =========================================================================
  {
    sub: 3,
    summary: 'Implement a First-In, First-Out (FIFO) queue using two LIFO stacks with amortised O(1) operations, and examine the dual stack-from-queues construction.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A **queue** is a linear data structure governed by the **First-In, First-Out (FIFO)** principle: the earliest inserted element is the first element removed. Stacks, conversely, operate on LIFO order. Constructing a queue from stacks relies on reversing the reversal: pushing elements into an input stack reverses their order; transferring those elements into an output stack by popping and pushing reverses them a second time, restoring original FIFO sequence.',
      },
      { kind: 'heading', text: 'Transfer mechanics and amortised analysis' },
      {
        kind: 'text',
        body: 'The implementation maintains an `inStack` for enqueue operations and an `outStack` for dequeue operations. New values push directly to `inStack`. When `pop()` or `peek()` is invoked, elements are served from `outStack`. If `outStack` is empty, every element in `inStack` is transferred across. While a single transfer takes O(n) worst-case time, each element enters `inStack` once, moves to `outStack` once, and departs `outStack` once. Dividing cumulative operations across all elements yields an **amortised cost** of O(1) per operation.',
      },
      {
        kind: 'code',
        caption: 'Queue implementation using inStack and outStack',
        code: {
          cpp: `#include <stack>
using namespace std;

class MyQueue {
    stack<int> inSt, outSt;
    void transfer() {
        if (outSt.empty()) {
            while (!inSt.empty()) {
                outSt.push(inSt.top());
                inSt.pop();
            }
        }
    }
public:
    void push(int x) { inSt.push(x); }
    int pop() {
        transfer();
        int val = outSt.top();
        outSt.pop();
        return val;
    }
    int peek() {
        transfer();
        return outSt.top();
    }
    bool empty() const { return inSt.empty() && outSt.empty(); }
};`,
          java: `import java.util.ArrayDeque;
import java.util.Deque;

public class MyQueue {
    private Deque<Integer> inSt = new ArrayDeque<>();
    private Deque<Integer> outSt = new ArrayDeque<>();

    private void transfer() {
        if (outSt.isEmpty()) {
            while (!inSt.isEmpty()) {
                outSt.push(inSt.pop());
            }
        }
    }
    public void push(int x) { inSt.push(x); }
    public int pop() {
        transfer();
        return outSt.pop();
    }
    public int peek() {
        transfer();
        return outSt.peek();
    }
    public boolean empty() { return inSt.isEmpty() && outSt.isEmpty(); }
}`,
          python: `class MyQueue:
    def __init__(self):
        self.in_st: list[int] = []
        self.out_st: list[int] = []

    def _transfer(self) -> None:
        if not self.out_st:
            while self.in_st:
                self.out_st.append(self.in_st.pop())

    def push(self, x: int) -> None:
        self.in_st.append(x)

    def pop(self) -> int:
        self._transfer()
        return self.out_st.pop()

    def peek(self) -> int:
        self._transfer()
        return self.out_st[-1]

    def empty(self) -> bool:
        return len(self.in_st) == 0 and len(self.out_st) == 0`,
        },
      },
      { kind: 'heading', text: 'Queue operation complexities' },
      {
        kind: 'table',
        headers: ['Operation', 'Worst-Case Time', 'Amortised Time', 'Auxiliary Space', 'Mechanism'],
        rows: [
          ['`push(x)`', 'O(1)', 'O(1)', 'O(1)', 'Pushes directly onto inStack'],
          ['`pop()`', 'O(n) on transfer', 'O(1)', 'O(1)', 'Pops outStack; transfers from inStack if outStack empty'],
          ['`peek()`', 'O(n) on transfer', 'O(1)', 'O(1)', 'Inspects outStack top; transfers if outStack empty'],
          ['`empty()`', 'O(1)', 'O(1)', 'O(1)', 'Checks whether both inStack and outStack are empty'],
        ],
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Premature transfers violate FIFO ordering',
        body: 'Do not transfer elements from `inStack` to `outStack` while `outStack` still contains elements. Doing so places newer elements ahead of older ones, destroying FIFO order. Elements must be moved strictly when `outStack` is completely empty.',
      },
    ],
    keyTakeaways: [
      'Two successive LIFO reversals cancel out, allowing two stacks to emulate a FIFO queue.',
      'Elements transfer from inStack to outStack strictly when outStack becomes empty.',
      'Each element undergoes at most two pushes and two pops across its lifecycle, giving amortised O(1) cost.',
      'Queues constructed from stacks achieve amortised O(1), whereas stacks from queues require O(n) per push or pop.',
    ],
    practice: {
      prompt: 'Implement a first-in first-out (FIFO) queue using two stacks. The implemented queue should support push, peek, pop, and empty operations with amortised O(1) time complexity.',
      leetcode: { title: 'Implement Queue using Stacks', slug: 'implement-queue-using-stacks' },
    },
  },

  // =========================================================================
  // Lesson 4: Circular queue
  // =========================================================================
  {
    sub: 4,
    summary: 'Construct a fixed-size ring buffer queue using modulo arithmetic to eliminate element shifting and reuse freed memory slots.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'A linear queue implemented over a standard array suffers from memory drift. When items are dequeued, the front boundary advances, leaving abandoned slots behind. Once the rear boundary reaches the array end, further insertions fail even when leading slots sit empty. Shifting elements backward restores space but imposes an O(n) penalty per dequeue.',
      },
      { kind: 'heading', text: 'Ring buffer mechanics and modulo arithmetic' },
      {
        kind: 'text',
        body: 'A **circular queue** (or **ring buffer**) solves memory drift by treating the underlying array as an unbroken circle. When an index increments past `capacity - 1`, it wraps around to index `0` via **modulo arithmetic**: `(index + 1) % capacity`. Tracking an explicit `count` variable cleanly separates the empty state (`count == 0`) from the full state (`count == capacity`), with the write position located at `(head + count) % capacity`.',
      },
      {
        kind: 'code',
        caption: 'Circular queue implementation with explicit element count',
        code: {
          cpp: `#include <vector>
using namespace std;

class MyCircularQueue {
    vector<int> data;
    int head = 0, count = 0, cap;
public:
    MyCircularQueue(int k) : data(k), cap(k) {}
    bool enQueue(int value) {
        if (isFull()) return false;
        data[(head + count) % cap] = value;
        count++;
        return true;
    }
    bool deQueue() {
        if (isEmpty()) return false;
        head = (head + 1) % cap;
        count--;
        return true;
    }
    int Front() const { return isEmpty() ? -1 : data[head]; }
    int Rear() const {
        if (isEmpty()) return -1;
        return data[(head + count - 1) % cap];
    }
    bool isEmpty() const { return count == 0; }
    bool isFull() const { return count == cap; }
};`,
          java: `public class MyCircularQueue {
    private int[] data;
    private int head = 0, count = 0, cap;

    public MyCircularQueue(int k) {
        data = new int[k];
        cap = k;
    }
    public boolean enQueue(int value) {
        if (isFull()) return false;
        data[(head + count) % cap] = value;
        count++;
        return true;
    }
    public boolean deQueue() {
        if (isEmpty()) return false;
        head = (head + 1) % cap;
        count--;
        return true;
    }
    public int Front() { return isEmpty() ? -1 : data[head]; }
    public int Rear() {
        if (isEmpty()) return -1;
        return data[(head + count - 1) % cap];
    }
    public boolean isEmpty() { return count == 0; }
    public boolean isFull() { return count == cap; }
}`,
          python: `class MyCircularQueue:
    def __init__(self, k: int):
        self.data: list[int] = [0] * k
        self.head: int = 0
        self.count: int = 0
        self.cap: int = k

    def enQueue(self, value: int) -> bool:
        if self.isFull():
            return False
        self.data[(self.head + self.count) % self.cap] = value
        self.count += 1
        return True

    def deQueue(self) -> bool:
        if self.isEmpty():
            return False
        self.head = (self.head + 1) % self.cap
        self.count -= 1
        return True

    def Front(self) -> int:
        return -1 if self.isEmpty() else self.data[self.head]

    def Rear(self) -> int:
        if self.isEmpty():
            return -1
        return self.data[(self.head + self.count - 1) % self.cap]

    def isEmpty(self) -> bool:
        return self.count == 0

    def isFull(self) -> bool:
        return self.count == self.cap`,
        },
      },
      { kind: 'heading', text: 'Circular queue complexity breakdown' },
      {
        kind: 'table',
        headers: ['Operation', 'Time Complexity', 'Auxiliary Space', 'State Formula'],
        rows: [
          ['`enQueue(val)`', 'O(1)', 'O(1)', 'Writes at (head + count) % cap, increments count'],
          ['`deQueue()`', 'O(1)', 'O(1)', 'Advances head = (head + 1) % cap, decrements count'],
          ['`Front()`', 'O(1)', 'O(1)', 'Returns data[head] or -1 if empty'],
          ['`Rear()`', 'O(1)', 'O(1)', 'Returns data[(head + count - 1) % cap] or -1 if empty'],
          ['`isEmpty()` / `isFull()`', 'O(1)', 'O(1)', 'Evaluates count == 0 or count == cap'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Off-by-one in Rear index computation',
        body: 'Because `(head + count) % cap` points to the next vacant write slot, the rear element resides at `(head + count - 1) % cap`. Omitting the `- 1` offset inspects uninitialised memory at the upcoming insertion position rather than the currently stored tail.',
      },
    ],
    keyTakeaways: [
      'A circular queue wraps array endpoints, reusing memory freed by earlier dequeues.',
      'Modulo index wrapping eliminates element shifting, achieving strictly O(1) operations.',
      'Tracking an explicit element count cleanly separates full and empty queue states.',
      'Ring buffers underpin operating system schedulers, hardware I/O queues, and multimedia streaming buffers.',
    ],
    practice: {
      prompt: 'Design an implementation of the circular queue with fixed capacity k. Support Front, Rear, enQueue, deQueue, isEmpty, and isFull operations.',
      leetcode: { title: 'Design Circular Queue', slug: 'design-circular-queue' },
    },
  },

  // =========================================================================
  // Lesson 5: Deque implementation
  // =========================================================================
  {
    sub: 5,
    summary: 'Construct a double-ended queue supporting O(1) insertions and deletions at both ends using a circular buffer and a doubly linked list.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'A **double-ended queue**, abbreviated as **deque**, generalises both stacks and queues by permitting insertions and removals at both ends of the collection. It supports four mutators: `insertFront`, `insertLast`, `deleteFront`, and `deleteLast`. This flexibility makes deques central to sliding-window algorithms, work-stealing schedulers, and undo-redo buffers.',
      },
      { kind: 'heading', text: 'Circular array versus doubly linked list' },
      {
        kind: 'text',
        body: 'A **doubly linked list** with sentinel head and tail nodes achieves O(1) mutators at both boundaries with dynamic capacity growth, but incurs allocation overhead and pointer memory costs. A **circular array** stores elements contiguously within a fixed buffer. Moving the head pointer backward upon `insertFront` requires adding capacity before taking the modulo: `(head - 1 + cap) % cap`, ensuring the dividend remains non-negative across all runtime environments.',
      },
      {
        kind: 'code',
        caption: 'Circular array implementation of a double-ended queue',
        code: {
          cpp: `#include <vector>
using namespace std;

class MyCircularDeque {
    vector<int> data;
    int head = 0, count = 0, cap;
public:
    MyCircularDeque(int k) : data(k), cap(k) {}
    bool insertFront(int value) {
        if (isFull()) return false;
        head = (head - 1 + cap) % cap;
        data[head] = value;
        count++;
        return true;
    }
    bool insertLast(int value) {
        if (isFull()) return false;
        data[(head + count) % cap] = value;
        count++;
        return true;
    }
    bool deleteFront() {
        if (isEmpty()) return false;
        head = (head + 1) % cap;
        count--;
        return true;
    }
    bool deleteLast() {
        if (isEmpty()) return false;
        count--;
        return true;
    }
    int getFront() const { return isEmpty() ? -1 : data[head]; }
    int getRear() const {
        if (isEmpty()) return -1;
        return data[(head + count - 1) % cap];
    }
    bool isEmpty() const { return count == 0; }
    bool isFull() const { return count == cap; }
};`,
          java: `public class MyCircularDeque {
    private int[] data;
    private int head = 0, count = 0, cap;

    public MyCircularDeque(int k) {
        data = new int[k];
        cap = k;
    }
    public boolean insertFront(int value) {
        if (isFull()) return false;
        head = (head - 1 + cap) % cap;
        data[head] = value;
        count++;
        return true;
    }
    public boolean insertLast(int value) {
        if (isFull()) return false;
        data[(head + count) % cap] = value;
        count++;
        return true;
    }
    public boolean deleteFront() {
        if (isEmpty()) return false;
        head = (head + 1) % cap;
        count--;
        return true;
    }
    public boolean deleteLast() {
        if (isEmpty()) return false;
        count--;
        return true;
    }
    public int getFront() { return isEmpty() ? -1 : data[head]; }
    public int getRear() {
        if (isEmpty()) return -1;
        return data[(head + count - 1) % cap];
    }
    public boolean isEmpty() { return count == 0; }
    public boolean isFull() { return count == cap; }
}`,
          python: `class MyCircularDeque:
    def __init__(self, k: int):
        self.data: list[int] = [0] * k
        self.head: int = 0
        self.count: int = 0
        self.cap: int = k

    def insertFront(self, value: int) -> bool:
        if self.isFull():
            return False
        self.head = (self.head - 1 + self.cap) % self.cap
        self.data[self.head] = value
        self.count += 1
        return True

    def insertLast(self, value: int) -> bool:
        if self.isFull():
            return False
        self.data[(self.head + self.count) % self.cap] = value
        self.count += 1
        return True

    def deleteFront(self) -> bool:
        if self.isEmpty():
            return False
        self.head = (self.head + 1) % self.cap
        self.count -= 1
        return True

    def deleteLast(self) -> bool:
        if self.isEmpty():
            return False
        self.count -= 1
        return True

    def getFront(self) -> int:
        return -1 if self.isEmpty() else self.data[self.head]

    def getRear(self) -> int:
        if self.isEmpty():
            return -1
        return self.data[(self.head + self.count - 1) % self.cap]

    def isEmpty(self) -> bool:
        return self.count == 0

    def isFull(self) -> bool:
        return self.count == self.cap`,
        },
      },
      { kind: 'heading', text: 'Deque complexity breakdown' },
      {
        kind: 'table',
        headers: ['Operation', 'Circular Array Time', 'Doubly Linked List Time', 'Space Overhead', 'Index Logic'],
        rows: [
          ['`insertFront(val)`', 'O(1)', 'O(1)', 'O(1)', 'head = (head - 1 + cap) % cap'],
          ['`insertLast(val)`', 'O(1)', 'O(1)', 'O(1)', 'tail = (head + count) % cap'],
          ['`deleteFront()`', 'O(1)', 'O(1)', 'O(1)', 'head = (head + 1) % cap'],
          ['`deleteLast()`', 'O(1)', 'O(1)', 'O(1)', 'count decremented by 1'],
          ['`getFront()` / `getRear()`', 'O(1)', 'O(1)', 'O(1)', 'Direct array read via computed index'],
        ],
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Negative modulo behavior in C++ and Java',
        body: 'In C++ and Java, `%` computes truncated remainder, meaning `-1 % 5` yields `-1`. In Python, `%` calculates floor modulo, yielding `4`. Adding `cap` before computing the remainder (`(head - 1 + cap) % cap`) ensures positive dividends and prevents invalid negative array indices across all languages.',
      },
    ],
    keyTakeaways: [
      'A deque allows constant-time insertion, deletion, and inspection at both front and rear ends.',
      'Circular array deques achieve cache-efficient O(1) operations with zero dynamic node allocations.',
      'Backward index movements require adding buffer capacity before modulo to prevent negative indices.',
      'Deques form the foundation for sliding-window maximum queries and 0-1 breadth-first search algorithms.',
    ],
    practice: {
      prompt: 'Design an implementation of the circular double-ended queue with fixed capacity k. Support insertFront, insertLast, deleteFront, deleteLast, getFront, getRear, isEmpty, and isFull.',
      leetcode: { title: 'Design Circular Deque', slug: 'design-circular-deque' },
    },
  },

  // =========================================================================
  // Lesson 6: Expression evaluation: infix to postfix
  // =========================================================================
  {
    sub: 6,
    summary: 'Convert human-readable infix arithmetic expressions to postfix notation with Dijkstra’s Shunting-yard algorithm and evaluate them using an operand stack.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Standard arithmetic uses **infix notation**, where binary operators sit between operands, as in `(3 + 4) * 5`. Evaluating infix expressions requires resolving operator precedence, associativity, and parenthetical nesting. In contrast, **postfix notation** (also known as **Reverse Polish Notation** or **RPN**) places operators after their operands: `3 4 + 5 *`. Postfix eliminates all parentheses and precedence ambiguity, making linear stack-based evaluation straightforward.',
      },
      { kind: 'heading', text: 'Shunting-yard conversion and postfix evaluation' },
      {
        kind: 'text',
        body: 'Dijkstra’s **Shunting-yard algorithm** converts infix to postfix using an operator stack: operands go directly to output, operators pop higher or equal precedence operators from the stack before pushing themselves, and parentheses serve as stack delimiters. Evaluating the resulting postfix string requires an operand stack: numbers push onto the stack; operators pop the right operand `b` followed by the left operand `a`, evaluate `a op b`, and push the result.',
      },
      {
        kind: 'code',
        caption: 'Evaluating expressions in Reverse Polish Notation',
        code: {
          cpp: `#include <vector>
#include <string>
#include <stack>
using namespace std;

int evalRPN(vector<string>& tokens) {
    stack<int> st;
    for (const string& s : tokens) {
        if (s == "+" || s == "-" || s == "*" || s == "/") {
            int b = st.top(); st.pop();
            int a = st.top(); st.pop();
            if (s == "+") st.push(a + b);
            else if (s == "-") st.push(a - b);
            else if (s == "*") st.push(a * b);
            else if (s == "/") st.push(a / b);
        } else {
            st.push(stoi(s));
        }
    }
    return st.top();
};`,
          java: `import java.util.ArrayDeque;
import java.util.Deque;

public class Solution {
    public int evalRPN(String[] tokens) {
        Deque<Integer> stack = new ArrayDeque<>();
        for (String s : tokens) {
            if (s.equals("+") || s.equals("-") || s.equals("*") || s.equals("/")) {
                int b = stack.pop();
                int a = stack.pop();
                switch (s) {
                    case "+": stack.push(a + b); break;
                    case "-": stack.push(a - b); break;
                    case "*": stack.push(a * b); break;
                    case "/": stack.push(a / b); break;
                }
            } else {
                stack.push(Integer.parseInt(s));
            }
        }
        return stack.pop();
    }
}`,
          python: `def eval_rpn(tokens: list[str]) -> int:
    stack: list[int] = []
    for s in tokens:
        if s in {"+", "-", "*", "/"}:
            b = stack.pop()
            a = stack.pop()
            if s == "+":
                stack.append(a + b)
            elif s == "-":
                stack.append(a - b)
            elif s == "*":
                stack.append(a * b)
            elif s == "/":
                stack.append(int(a / b))
        else:
            stack.append(int(s))
    return stack[0]`,
        },
      },
      { kind: 'heading', text: 'Complexity and stage characteristics' },
      {
        kind: 'table',
        headers: ['Stage', 'Time Complexity', 'Space Complexity', 'Stack Purpose', 'Dominant Action'],
        rows: [
          ['Shunting-Yard Infix -> Postfix', 'O(n)', 'O(n)', 'Holds operators pending precedence resolution', 'Precedence comparisons'],
          ['Postfix Evaluation', 'O(n)', 'O(n)', 'Holds numeric operands awaiting operator execution', 'Pop two, apply operator, push result'],
          ['Direct Combined Evaluation', 'O(n)', 'O(n)', 'Maintains dual operator and value stacks', 'Resolves subexpressions on the fly'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Inverted operand order during non-commutative operations',
        body: 'Subtraction and division are non-commutative (`a - b != b - a`). Because a stack reverses retrieval order, the first popped value is right-hand operand `b`, and the second popped value is left-hand operand `a`. Inverting them corrupts the calculation. Note that Python integer division `//` floors toward negative infinity; use `int(a / b)` to match C++ and Java truncation toward zero.',
      },
    ],
    keyTakeaways: [
      'Postfix notation removes all parentheses and precedence rules by positioning operators after operands.',
      'The Shunting-yard algorithm converts infix expressions to postfix in linear O(n) time using an operator stack.',
      'Postfix evaluation uses an operand stack where operators consume the top two numbers and push the result.',
      'Always assign the first popped element to the right operand b and the second to left operand a.',
    ],
    practice: {
      prompt: 'Given an array of strings tokens representing an arithmetic expression in Reverse Polish Notation, evaluate the expression and return an integer that represents its arithmetic value.',
      leetcode: { title: 'Evaluate Reverse Polish Notation', slug: 'evaluate-reverse-polish-notation' },
    },
  },

  // =========================================================================
  // Lesson 7: Balanced brackets
  // =========================================================================
  {
    sub: 7,
    summary: 'Validate nested bracket sequences using a LIFO stack to match closing symbols with their most recent open counterparts.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Compilers and parsers verify that grouping delimiters such as parentheses, brackets, and braces nest correctly. A sequence is valid if every opening delimiter matches its closing counterpart of the identical type, and pairs close in strict reverse order of opening. For example, `{[()]}` is valid, whereas `[(])` is invalid because the square bracket closes before the inner round bracket terminates.',
      },
      { kind: 'heading', text: 'Why counters fail and stack matching succeeds' },
      {
        kind: 'text',
        body: 'For strings with only one bracket type, an integer counter suffices. With multiple delimiter varieties, counters fail because they count frequencies without tracking nesting sequence: `([)]` has equal opening and closing counts for both types, but violates nesting. A LIFO stack solves this by recording unclosed opening brackets in arrival order so the most recently opened symbol matches first.',
      },
      {
        kind: 'code',
        caption: 'Validating nested bracket sequences using a character stack',
        code: {
          cpp: `#include <string>
#include <stack>
using namespace std;

bool isValid(string s) {
    stack<char> st;
    for (char c : s) {
        if (c == '(' || c == '{' || c == '[') {
            st.push(c);
        } else {
            if (st.empty()) return false;
            char top = st.top();
            st.pop();
            if ((c == ')' && top != '(') ||
                (c == '}' && top != '{') ||
                (c == ']' && top != '[')) {
                return false;
            }
        }
    }
    return st.empty();
}`,
          java: `import java.util.ArrayDeque;
import java.util.Deque;

public class Solution {
    public boolean isValid(String s) {
        Deque<Character> stack = new ArrayDeque<>();
        for (char c : s.toCharArray()) {
            if (c == '(' || c == '{' || c == '[') {
                stack.push(c);
            } else {
                if (stack.isEmpty()) return false;
                char top = stack.pop();
                if ((c == ')' && top != '(') ||
                    (c == '}' && top != '{') ||
                    (c == ']' && top != '[')) {
                    return false;
                }
            }
        }
        return stack.isEmpty();
    }
}`,
          python: `def is_valid(s: str) -> bool:
    matching: dict[str, str] = {')': '(', '}': '{', ']': '['}
    stack: list[str] = []
    for char in s:
        if char in matching:
            if not stack or stack[-1] != matching[char]:
                return False
            stack.pop()
        else:
            stack.append(char)
    return len(stack) == 0`,
        },
      },
      { kind: 'heading', text: 'Validation complexity and failure states' },
      {
        kind: 'table',
        headers: ['Event / State', 'Time Complexity', 'Space Complexity', 'Failure Condition'],
        rows: [
          ['Opening bracket read', 'O(1)', 'O(1) push', 'Exceeding system memory buffer'],
          ['Closing bracket read', 'O(1)', 'O(1) pop', 'Stack is empty (underflow) or top symbol does not match'],
          ['Termination check', 'O(1)', 'O(1)', 'Stack remains non-empty (unclosed opening symbols remain)'],
          ['Overall string scan', 'O(n)', 'O(n) worst-case', 'Any mismatch or leftover open symbol across n characters'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Unclosed opening brackets at sequence termination',
        body: 'Strings like `"((("` never encounter a mismatched closing delimiter during iteration. Returning true without checking stack emptiness incorrectly validates these inputs. Always ensure the return statement confirms `stack.isEmpty()`, never an unconditional boolean true.',
      },
    ],
    keyTakeaways: [
      'A LIFO stack naturally validates nested bracket structures because the most recently opened symbol must close first.',
      'Integer counters cannot validate mixed bracket types because they ignore ordering and nesting sequence.',
      'Encountering a closing delimiter when the stack is empty represents an invalid underflow mismatch.',
      'A sequence is valid if and only if all bracket types match and the stack is completely empty at the end.',
    ],
    practice: {
      prompt: 'Given a string s containing only the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid.',
      leetcode: { title: 'Valid Parentheses', slug: 'valid-parentheses' },
    },
  },

  // =========================================================================
  // Lesson 8: Deriving the monotonic stack
  // =========================================================================
  {
    sub: 8,
    summary: 'Derive the monotonic stack pattern by identifying and pruning dominated elements to solve next greater element queries in linear time.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'A frequent algorithmic task is finding the **next greater element** for every position in an array: for each index `i`, identify the first index `j > i` where `arr[j] > arr[i]`. A brute-force nested scan launches forward searches from every index, taking O(n^2) quadratic time. Deriving an O(n) linear solution requires identifying which previous candidates remain viable and which can be permanently discarded.',
      },
      { kind: 'heading', text: 'Candidate domination and the monotonic invariant' },
      {
        kind: 'text',
        body: 'When element `arr[i]` is inspected, any earlier element `arr[k]` that is smaller than `arr[i]` can never serve as the next greater element for any position to the right of `i`. Because `arr[i]` is both larger and positioned closer, the earlier smaller element is **dominated** and can be discarded. A **monotonic stack** maintains candidates in strictly sorted order by popping dominated items before pushing the current index.',
      },
      {
        kind: 'code',
        caption: 'Daily temperatures: finding distance to next warmer day using a monotonic stack',
        code: {
          cpp: `#include <vector>
#include <stack>
using namespace std;

vector<int> dailyTemperatures(vector<int>& temperatures) {
    int n = temperatures.size();
    vector<int> answer(n, 0);
    stack<int> st;

    for (int i = 0; i < n; i++) {
        while (!st.empty() && temperatures[i] > temperatures[st.top()]) {
            int prevIndex = st.top();
            st.pop();
            answer[prevIndex] = i - prevIndex;
        }
        st.push(i);
    }
    return answer;
}`,
          java: `import java.util.ArrayDeque;
import java.util.Deque;

public class Solution {
    public int[] dailyTemperatures(int[] temperatures) {
        int n = temperatures.length;
        int[] answer = new int[n];
        Deque<Integer> stack = new ArrayDeque<>();

        for (int i = 0; i < n; i++) {
            while (!stack.isEmpty() && temperatures[i] > temperatures[stack.peek()]) {
                int prevIndex = stack.pop();
                answer[prevIndex] = i - prevIndex;
            }
            stack.push(i);
        }
        return answer;
    }
}`,
          python: `def daily_temperatures(temperatures: list[int]) -> list[int]:
    n = len(temperatures)
    answer = [0] * n
    stack: list[int] = []

    for i in range(n):
        while stack and temperatures[i] > temperatures[stack[-1]]:
            prev_index = stack.pop()
            answer[prev_index] = i - prev_index
        stack.append(i)

    return answer`,
        },
      },
      { kind: 'heading', text: 'Complexity and amortised linear proof' },
      {
        kind: 'table',
        headers: ['Approach', 'Time Complexity', 'Auxiliary Space', 'Mechanism', 'Limitation'],
        rows: [
          ['Brute Force Nested Loop', 'O(n^2)', 'O(1)', 'Forward scan from each index', 'Times out on large descending inputs'],
          ['Monotonic Decreasing Stack', 'O(n) amortised', 'O(n)', 'Pops dominated smaller elements to maintain sorted order', 'Requires auxiliary stack memory'],
          ['Monotonic Increasing Stack', 'O(n) amortised', 'O(n)', 'Pops dominated larger elements to find next smaller', 'Symmetric variant for range minimums'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Store indices instead of values',
        body: 'Storing array indices on the monotonic stack rather than raw values enables constant-time value lookup via `arr[i]`, allows direct distance calculations (`i - prevIndex`), and enables populating output arrays at `answer[prevIndex]` without secondary hash lookups.',
      },
    ],
    keyTakeaways: [
      'A monotonic stack maintains elements in sorted order by popping dominated candidates.',
      'Each element is pushed once and popped at most once, bounding cumulative inner-loop work to 2n and guaranteeing O(n) runtime.',
      'Decreasing stacks locate the next greater element; increasing stacks locate the next smaller element.',
      'Storing array indices instead of values provides simultaneous access to values and relative positional distances.',
    ],
    practice: {
      prompt: 'Given an array of integers temperatures representing daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature. If there is no future day for which this is possible, keep answer[i] == 0.',
      leetcode: { title: 'Daily Temperatures', slug: 'daily-temperatures' },
    },
  },
];
