import type { SharedLesson } from './types';

/**
 * Hash Tables from Scratch — Master direct addressing, hash functions, collision
 * resolution via chaining and open addressing, dynamic resizing with rehashing,
 * composite data structures like LRU cache, and trade-off design decisions.
 */
export const lessons: SharedLesson[] = [
  // =========================================================================
  // Lesson 1: Array plus hash function
  // =========================================================================
  {
    sub: 1,
    summary: 'Map arbitrary keys to bounded array indices using a deterministic hash function and modulo arithmetic.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'An array provides instant O(1) read and write access because memory addresses are calculated through direct offset arithmetic: base address plus index multiplied by item size. When keys are contiguous integers `0, 1, ...`, a direct-address table stores values directly at index `key`. However, when keys are sparse large integers or arbitrary strings, sizing an array to the entire key universe is impossible. A **hash table** resolves this by pairing an array of bounded capacity with a mathematical function that maps arbitrary keys to valid array indices.',
      },
      { kind: 'heading', text: 'The hash function contract' },
      {
        kind: 'text',
        body: 'A **hash function** accepts a key and returns an integer **hash code**. Modulo arithmetic then compresses the hash code into a valid array slot: `index = hash(key) % capacity`. A valid hash function must be **deterministic**, returning identical output for identical inputs every time, and **uniform**, scattering distinct keys evenly across all available buckets to prevent clustering.',
      },
      {
        kind: 'code',
        caption: 'Direct array indexing with a modulo hash function',
        code: {
          cpp: `int hashKey(int key, int cap) {
    int idx = key % cap;
    return idx < 0 ? idx + cap : idx;
}

void insert(vector<int>& table, int key, int val, int cap) {
    table[hashKey(key, cap)] = val;
}

int get(const vector<int>& table, int key, int cap) {
    return table[hashKey(key, cap)];
}`,
          java: `public class DirectHashArray {
    public static int hashKey(int key, int cap) {
        return Math.floorMod(key, cap);
    }

    public static void insert(int[] table, int key, int val, int cap) {
        table[hashKey(key, cap)] = val;
    }

    public static int get(int[] table, int key, int cap) {
        return table[hashKey(key, cap)];
    }
}`,
          python: `def hash_key(key: int, cap: int) -> int:
    return key % cap

def insert(table: list[int], key: int, val: int, cap: int) -> None:
    table[hash_key(key, cap)] = val

def get(table: list[int], key: int, cap: int) -> int:
    return table[hash_key(key, cap)]`,
        },
      },
      { kind: 'heading', text: 'Direct addressing versus hashing' },
      {
        kind: 'table',
        headers: ['Attribute', 'Direct Addressing Table', 'Hash Table with Modulo'],
        rows: [
          ['Key Domain', 'Small non-negative integers (`0` to `U-1`)', 'Arbitrary integers, strings, or complex objects'],
          ['Array Size Required', 'Equal to universe size `U`', 'Proportional to number of stored elements `n`'],
          ['Lookup Time', 'Guaranteed O(1)', 'Average O(1), dependent on collision handling'],
          ['Memory Efficiency', 'Extremely wasteful if keys are sparse', 'Compact, scales with stored item count'],
          ['Key Collisions', 'Impossible (each key has a dedicated slot)', 'Inevitable by the Pigeonhole Principle when keys exceed capacity'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Negative hash codes and remainder operators',
        body: 'In C++ and Java, the `%` operator calculates the algebraic remainder rather than the mathematical modulo. If a hash function returns a negative integer, `-7 % 5` evaluates to `-2`. Attempting to access an array with a negative index causes an out-of-bounds error or memory corruption. In Java, use `Math.floorMod(key, capacity)` or bitwise masking with `0x7fffffff`. In C++, write `(key % capacity + capacity) % capacity`.',
      },
    ],
    keyTakeaways: [
      'A hash table maps arbitrary keys to bounded array slots by applying a hash function followed by modulo reduction.',
      'Hash functions must be deterministic and distribute keys evenly across table indices.',
      'Direct addressing guarantees O(1) access without collisions but wastes immense memory when key spaces are large or sparse.',
      'Modulo on negative integers yields negative results in C++ and Java; always normalize remainders to non-negative indices.',
    ],
    practice: {
      prompt: 'Construct a simple hash set for non-negative integers using a fixed-size bucket array and modulo indexing to support add, remove, and contains.',
      leetcode: { title: 'Design HashSet', slug: 'design-hashset' },
    },
  },

  // =========================================================================
  // Lesson 2: Chaining implementation
  // =========================================================================
  {
    sub: 2,
    summary: 'Resolve bucket collisions by implementing separate chaining with singly linked lists.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Because a hash function compresses an infinite universe of potential keys into a finite array of `m` buckets, two distinct keys will eventually map to the same index. This event is called a **collision**. By the **Pigeonhole Principle**, if you place `n` items into `m` slots and `n > m`, at least one slot must hold two or more items. The standard technique to handle collisions is **separate chaining**, where every bucket in the array serves as the head of an independent linked list.',
      },
      { kind: 'heading', text: 'Separate chaining mechanics' },
      {
        kind: 'text',
        body: 'In separate chaining, each table slot stores a pointer to a list node containing a key, a value, and a `next` pointer. When inserting with `put(key, val)`, the table hashes the key to locate the bucket and scans the linked list. If a node with matching key exists, its value is updated. If the key is absent, a new node is created and attached to the list. When reading with `get(key)`, the table computes the bucket index and walks only that bucket chain.',
      },
      {
        kind: 'code',
        caption: 'Collision resolution via separate chaining',
        code: {
          cpp: `struct Node {
    int key, val;
    Node* next;
    Node(int k, int v, Node* n = nullptr) : key(k), val(v), next(n) {}
};

void put(vector<Node*>& table, int key, int val, int cap) {
    int idx = (key % cap + cap) % cap;
    for (Node* curr = table[idx]; curr; curr = curr->next) {
        if (curr->key == key) { curr->val = val; return; }
    }
    table[idx] = new Node(key, val, table[idx]);
}

int get(const vector<Node*>& table, int key, int cap) {
    int idx = (key % cap + cap) % cap;
    for (Node* curr = table[idx]; curr; curr = curr->next) {
        if (curr->key == key) return curr->val;
    }
    return -1;
}`,
          java: `class Node {
    int key, val;
    Node next;
    Node(int key, int val, Node next) { this.key = key; this.val = val; this.next = next; }
}

public class ChainingMap {
    public static void put(Node[] table, int key, int val, int cap) {
        int idx = Math.floorMod(key, cap);
        for (Node curr = table[idx]; curr != null; curr = curr.next) {
            if (curr.key == key) { curr.val = val; return; }
        }
        table[idx] = new Node(key, val, table[idx]);
    }

    public static int get(Node[] table, int key, int cap) {
        int idx = Math.floorMod(key, cap);
        for (Node curr = table[idx]; curr != null; curr = curr.next) {
            if (curr.key == key) return curr.val;
        }
        return -1;
    }
}`,
          python: `class Node:
    def __init__(self, key: int, val: int, next_node: 'Node | None' = None):
        self.key, self.val, self.next = key, val, next_node

def put(table: list[Node | None], key: int, val: int, cap: int) -> None:
    idx = key % cap
    curr = table[idx]
    while curr:
        if curr.key == key:
            curr.val = val
            return
        curr = curr.next
    table[idx] = Node(key, val, table[idx])

def get(table: list[Node | None], key: int, cap: int) -> int:
    curr = table[key % cap]
    while curr:
        if curr.key == key:
            return curr.val
        curr = curr.next
    return -1`,
        },
      },
      { kind: 'heading', text: 'Time and space complexity of chaining' },
      {
        kind: 'table',
        headers: ['Operation', 'Average Case', 'Worst Case', 'Worst-Case Explanation'],
        rows: [
          ['`put(key, val)`', 'O(1)', 'O(n)', 'All keys map to the same bucket; list traversal visits n nodes'],
          ['`get(key)`', 'O(1)', 'O(n)', 'Searching a single degenerated chain of length n'],
          ['`remove(key)`', 'O(1)', 'O(n)', 'Target node is at the end of an n-length chain'],
          ['Memory Overhead', 'O(m + n)', 'O(m + n)', 'm bucket pointer slots plus one heap node and pointer per entry'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Blind insertion produces duplicate keys',
        body: 'A frequent implementation bug in `put()` is immediately allocating a new node at the bucket head without checking if the key is already present. A map cannot hold duplicate keys: if a key exists, you must update its existing node value and exit. Blind insertion produces duplicate nodes, breaking subsequent lookup and removal guarantees.',
      },
    ],
    keyTakeaways: [
      'Separate chaining resolves collisions by storing entries that share a bucket in an auxiliary linked list.',
      'Average-case operations run in O(1) time when the hash function distributes keys uniformly across buckets.',
      'Worst-case operations degrade to O(n) if all keys collide into a single chain.',
      'Always scan the target bucket to overwrite existing keys before inserting a new node.',
    ],
    practice: {
      prompt: 'Implement a hash map supporting put, get, and remove from scratch using separate chaining with linked list nodes.',
      leetcode: { title: 'Design HashMap', slug: 'design-hashmap' },
    },
  },

  // =========================================================================
  // Lesson 3: Open addressing
  // =========================================================================
  {
    sub: 3,
    summary: 'Store all entries directly inside the table array using open addressing and tombstone markers.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'While separate chaining allocates nodes outside the array on the heap, **open addressing** stores all key-value entries directly within the primary array slots. Every slot holds at most one element. When an insertion encounters an occupied slot, the algorithm executes a **probing sequence** to test subsequent slots until an empty position is discovered. Because open addressing avoids pointer dereferencing and heap allocations, it provides superior CPU cache locality.',
      },
      { kind: 'heading', text: 'Linear probing and the clustering challenge' },
      {
        kind: 'text',
        body: 'The foundational probing strategy is **linear probing**, where candidate slots are evaluated sequentially: `(hash(key) + i) % capacity` for step numbers `i = 0, 1, 2, ...`. While linear probing maximizes memory locality by scanning contiguous array elements, it causes **primary clustering**: contiguous blocks of occupied slots merge together into long chains. As clusters expand, any key that hashes into a cluster must probe through the entire block, steadily degrading lookup and insertion performance.',
      },
      {
        kind: 'code',
        caption: 'Open addressing with linear probing and tombstones',
        code: {
          cpp: `enum State { EMPTY, OCCUPIED, DELETED };
struct Entry { int key = 0, val = 0; State state = EMPTY; };

void put(vector<Entry>& table, int key, int val, int cap) {
    int idx = (key % cap + cap) % cap, tomb = -1;
    for (int i = 0; i < cap; ++i) {
        int slot = (idx + i) % cap;
        if (table[slot].state == OCCUPIED) {
            if (table[slot].key == key) { table[slot].val = val; return; }
        } else if (table[slot].state == DELETED) {
            if (tomb == -1) tomb = slot;
        } else {
            int target = (tomb != -1) ? tomb : slot;
            table[target] = {key, val, OCCUPIED};
            return;
        }
    }
    if (tomb != -1) table[tomb] = {key, val, OCCUPIED};
}

int get(const vector<Entry>& table, int key, int cap) {
    int idx = (key % cap + cap) % cap;
    for (int i = 0; i < cap; ++i) {
        int slot = (idx + i) % cap;
        if (table[slot].state == EMPTY) return -1;
        if (table[slot].state == OCCUPIED && table[slot].key == key)
            return table[slot].val;
    }
    return -1;
}`,
          java: `class Entry {
    int key, val, state; // 0: EMPTY, 1: OCCUPIED, 2: DELETED
    Entry(int k, int v, int s) { key = k; val = v; state = s; }
}

public class OpenAddressingMap {
    public static void put(Entry[] table, int key, int val, int cap) {
        int idx = Math.floorMod(key, cap), tomb = -1;
        for (int i = 0; i < cap; i++) {
            int slot = (idx + i) % cap;
            if (table[slot] != null && table[slot].state == 1) {
                if (table[slot].key == key) { table[slot].val = val; return; }
            } else if (table[slot] != null && table[slot].state == 2) {
                if (tomb == -1) tomb = slot;
            } else {
                int target = (tomb != -1) ? tomb : slot;
                table[target] = new Entry(key, val, 1);
                return;
            }
        }
        if (tomb != -1) table[tomb] = new Entry(key, val, 1);
    }

    public static int get(Entry[] table, int key, int cap) {
        int idx = Math.floorMod(key, cap);
        for (int i = 0; i < cap; i++) {
            int slot = (idx + i) % cap;
            if (table[slot] == null || table[slot].state == 0) return -1;
            if (table[slot].state == 1 && table[slot].key == key) return table[slot].val;
        }
        return -1;
    }
}`,
          python: `class Entry:
    def __init__(self, key: int = 0, val: int = 0, state: int = 0):
        self.key, self.val, self.state = key, val, state

def put(table: list[Entry | None], key: int, val: int, cap: int) -> None:
    idx, tomb = key % cap, -1
    for i in range(cap):
        slot = (idx + i) % cap
        entry = table[slot]
        if entry and entry.state == 1:
            if entry.key == key:
                entry.val = val
                return
        elif entry and entry.state == 2:
            if tomb == -1: tomb = slot
        else:
            target = tomb if tomb != -1 else slot
            table[target] = Entry(key, val, 1)
            return
    if tomb != -1: table[tomb] = Entry(key, val, 1)

def get(table: list[Entry | None], key: int, cap: int) -> int:
    idx = key % cap
    for i in range(cap):
        slot = (idx + i) % cap
        entry = table[slot]
        if not entry or entry.state == 0: return -1
        if entry.state == 1 and entry.key == key: return entry.val
    return -1`,
        },
      },
      { kind: 'heading', text: 'Open addressing vs Separate chaining' },
      {
        kind: 'table',
        headers: ['Factor', 'Separate Chaining', 'Linear Probing Open Addressing'],
        rows: [
          ['Storage Location', 'External linked lists on heap', 'Directly in contiguous array slots'],
          ['Cache Locality', 'Lower (pointer dereferences across memory)', 'High (sequential array index scanning)'],
          ['Memory Footprint', 'Extra pointer per node', 'Zero pointer overhead; stores keys/values inline'],
          ['Load Factor Tolerance', 'Functions well even if load factor exceeds 1.0', 'Degrades severely when load factor exceeds 0.70'],
          ['Deletion Complexity', 'Simple node splice and deallocation', 'Requires tombstones to prevent breaking probe paths'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Clearing slots to empty breaks search chains',
        body: 'In open addressing, deleting a key by resetting its slot to empty breaks future searches. A search for a key that collided and was placed downstream terminates immediately upon encountering an empty slot, reporting that the key does not exist. You must replace deleted entries with a **tombstone** marker. Search probes continue past tombstones, while insertions can reuse them.',
      },
    ],
    keyTakeaways: [
      'Open addressing stores all keys directly in the array, eliminating heap nodes and pointer overhead.',
      'Linear probing checks consecutive slots, benefiting from cache locality but causing primary clustering.',
      'Deletions must record a tombstone marker so subsequent search probes do not terminate prematurely.',
      'Open addressing requires maintaining a low load factor, typically below 0.70, to avoid long probe sequences.',
    ],
    practice: {
      prompt: 'Implement a hash map using open addressing with linear probing and tombstone markers, handling both updates and deletions correctly.',
      leetcode: { title: 'Design HashMap', slug: 'design-hashmap' },
    },
  },

  // =========================================================================
  // Lesson 4: Resize and rehash
  // =========================================================================
  {
    sub: 4,
    summary: 'Maintain O(1) performance by monitoring the load factor and dynamically resizing and rehashing the table.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'As more items are inserted into a hash table, performance deteriorates. In separate chaining, linked lists lengthen; in open addressing, probe sequences grow longer. To quantify table congestion, we calculate the **load factor**: `alpha = n / m`, where `n` is the count of stored keys and `m` is the total number of buckets. When the load factor breaches a fixed threshold (conventionally 0.75 for chaining and 0.70 for open addressing), the table must expand to preserve constant-time operations.',
      },
      { kind: 'heading', text: 'Why rehashing is mandatory' },
      {
        kind: 'text',
        body: 'When an ordinary dynamic array doubles in size, existing items keep their current indices. A hash table cannot blindly copy elements over. Because an element bucket is determined by `hash(key) % capacity`, changing capacity from `m` to `2m` changes the divisor. A key with hash code `21` resides in bucket `21 % 8 = 5` in an 8-slot table, but moves to bucket `21 % 16 = 5` in a 16-slot table, whereas a key with hash code `13` moves from `13 % 8 = 5` to `13 % 16 = 13`. Every entry must be **rehashed** using the new capacity and re-inserted into the new array.',
      },
      {
        kind: 'code',
        caption: 'Rehashing nodes into an expanded bucket array',
        code: {
          cpp: `vector<Node*> rehash(const vector<Node*>& oldTable, int oldCap, int newCap) {
    vector<Node*> newTable(newCap, nullptr);
    for (int i = 0; i < oldCap; ++i) {
        Node* curr = oldTable[i];
        while (curr) {
            Node* nextNode = curr->next;
            int newIdx = (curr->key % newCap + newCap) % newCap;
            curr->next = newTable[newIdx];
            newTable[newIdx] = curr;
            curr = nextNode;
        }
    }
    return newTable;
}`,
          java: `public static Node[] rehash(Node[] oldTable, int oldCap, int newCap) {
    Node[] newTable = new Node[newCap];
    for (int i = 0; i < oldCap; i++) {
        Node curr = oldTable[i];
        while (curr != null) {
            Node nextNode = curr.next;
            int newIdx = Math.floorMod(curr.key, newCap);
            curr.next = newTable[newIdx];
            newTable[newIdx] = curr;
            curr = nextNode;
        }
    }
    return newTable;
}`,
          python: `def rehash(old_table: list[Node | None], old_cap: int, new_cap: int) -> list[Node | None]:
    new_table: list[Node | None] = [None] * new_cap
    for i in range(old_cap):
        curr = old_table[i]
        while curr:
            next_node = curr.next
            new_idx = curr.key % new_cap
            curr.next = new_table[new_idx]
            new_table[new_idx] = curr
            curr = next_node
    return new_table`,
        },
      },
      { kind: 'heading', text: 'Amortised cost of resizing' },
      {
        kind: 'table',
        headers: ['Event / Step', 'Individual Step Cost', 'Frequency of Occurrence', 'Amortised Impact'],
        rows: [
          ['Regular Insert', 'O(1)', 'Almost every operation', 'Dominates the runtime at O(1) average'],
          ['Rehashing Pass', 'O(n)', 'Once every doubling (exponentially rarer)', 'Spread over preceding n inserts, contributing O(1)'],
          ['Bucket Allocation', 'O(new capacity)', 'Occurs strictly during resize', 'Doubles geometrically: 4, 8, 16, 32, ...'],
          ['Total Over N Inserts', 'O(n) total time', 'Runs across entire lifecycle', 'Strictly O(1) amortised per operation'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Power-of-two capacities and bitwise modulo',
        body: 'Standard integer modulo `%` requires hardware division, which costs tens of CPU cycles per invocation. If capacity `m` is constrained to a power of two (`2^k`), the expression `hash % m` is mathematically identical to the bitwise AND `hash & (m - 1)`. The bitwise operation executes in a single clock cycle, which is why standard library hash tables universally employ power-of-two capacities.',
      },
    ],
    keyTakeaways: [
      'Load factor alpha = n / m measures the average number of items per bucket.',
      'When the load factor exceeds a threshold (typically 0.75), the table must expand to avoid performance degradation.',
      'Doubling capacity requires rehashing all keys because the modulo divisor has changed.',
      'Because resizing doubles capacity geometrically, the O(n) rehash cost amortises to O(1) per insert.',
    ],
    practice: {
      prompt: 'Construct a dynamically resizing hash set starting from an initial capacity of 4 that doubles its bucket count and rehashes all elements whenever the load factor exceeds 0.75.',
      leetcode: { title: 'Design HashSet', slug: 'design-hashset' },
    },
  },

  // =========================================================================
  // Lesson 5: LRU cache: hash map plus doubly linked list
  // =========================================================================
  {
    sub: 5,
    summary: 'Combine a hash map with a doubly linked list to build an LRU cache with O(1) get and put.',
    readMinutes: 6,
    blocks: [
      {
        kind: 'text',
        body: 'A **Least Recently Used (LRU) Cache** is a fixed-capacity data structure that evicts the least recently accessed item when inserting into a full cache. Every access—whether reading via `get(key)` or updating/inserting via `put(key, val)`—marks that element as the most recently used. To serve modern high-throughput applications, both `get` and `put` must execute in strictly **O(1)** time.',
      },
      { kind: 'heading', text: 'Why neither structure suffices alone' },
      {
        kind: 'text',
        body: 'A hash map provides O(1) key lookup and insertion, but does not maintain access order or track which key was read least recently. A doubly linked list maintains exact ordering: moving a node to the front or evicting from the back takes O(1) time, but finding a specific key requires an O(n) linear scan through the nodes. By pairing a hash map with a doubly linked list, the hash map maps each `key` directly to its corresponding node reference, enabling instant O(1) node lookup, while the doubly linked list handles reordering and eviction in O(1) pointer operations.',
      },
      {
        kind: 'code',
        caption: 'LRU Cache implementation with sentinel nodes',
        code: {
          cpp: `class LRUCache {
    struct Node { int key, val; Node *prev = nullptr, *next = nullptr; Node(int k = 0, int v = 0) : key(k), val(v) {} };
    int cap;
    unordered_map<int, Node*> map;
    Node *head = new Node(), *tail = new Node();

    void detach(Node* n) { n->prev->next = n->next; n->next->prev = n->prev; }
    void insertHead(Node* n) { n->next = head->next; n->prev = head; head->next->prev = n; head->next = n; }

public:
    LRUCache(int c) : cap(c) { head->next = tail; tail->prev = head; }

    int get(int key) {
        if (!map.count(key)) return -1;
        Node* n = map[key];
        detach(n); insertHead(n);
        return n->val;
    }

    void put(int key, int val) {
        if (map.count(key)) {
            Node* n = map[key];
            n->val = val; detach(n); insertHead(n); return;
        }
        if ((int)map.size() >= cap) {
            Node* lru = tail->prev;
            detach(lru); map.erase(lru->key); delete lru;
        }
        Node* n = new Node(key, val);
        insertHead(n); map[key] = n;
    }
};`,
          java: `public class LRUCache {
    static class Node {
        int key, val; Node prev, next;
        Node(int k, int v) { key = k; val = v; }
    }
    private int cap;
    private Map<Integer, Node> map = new HashMap<>();
    private Node head = new Node(0, 0), tail = new Node(0, 0);

    public LRUCache(int c) { this.cap = c; head.next = tail; tail.prev = head; }

    private void detach(Node n) { n.prev.next = n.next; n.next.prev = n.prev; }
    private void insertHead(Node n) { n.next = head.next; n.prev = head; head.next.prev = n; head.next = n; }

    public int get(int key) {
        Node n = map.get(key);
        if (n == null) return -1;
        detach(n); insertHead(n);
        return n.val;
    }

    public void put(int key, int val) {
        if (map.containsKey(key)) {
            Node n = map.get(key);
            n.val = val; detach(n); insertHead(n); return;
        }
        if (map.size() >= cap) {
            Node lru = tail.prev;
            detach(lru); map.remove(lru.key);
        }
        Node n = new Node(key, val);
        insertHead(n); map.put(key, n);
    }
}`,
          python: `class Node:
    def __init__(self, key: int = 0, val: int = 0):
        self.key, self.val = key, val
        self.prev: 'Node | None' = None
        self.next: 'Node | None' = None

class LRUCache:
    def __init__(self, cap: int):
        self.cap, self.map = cap, {}
        self.head, self.tail = Node(), Node()
        self.head.next, self.tail.prev = self.tail, self.head

    def _detach(self, n: Node) -> None:
        if n.prev and n.next:
            n.prev.next, n.next.prev = n.next, n.prev

    def _insert_head(self, n: Node) -> None:
        n.next, n.prev = self.head.next, self.head
        if self.head.next: self.head.next.prev = n
        self.head.next = n

    def get(self, key: int) -> int:
        if key not in self.map: return -1
        n = self.map[key]
        self._detach(n); self._insert_head(n)
        return n.val

    def put(self, key: int, val: int) -> None:
        if key in self.map:
            n = self.map[key]
            n.val = val; self._detach(n); self._insert_head(n)
            return
        if len(self.map) >= self.cap:
            lru = self.tail.prev
            if lru:
                self._detach(lru)
                del self.map[lru.key]
        n = Node(key, val)
        self._insert_head(n)
        self.map[key] = n`,
        },
      },
      { kind: 'heading', text: 'Comparing component roles in LRU cache' },
      {
        kind: 'table',
        headers: ['Responsibility', 'Hash Map Role', 'Doubly Linked List Role', 'Unified LRU Outcome'],
        rows: [
          ['Find node by key', 'O(1) average lookup via key hash', 'O(n) sequential pointer traversal', 'O(1) direct node address'],
          ['Track access ordering', 'Unsupported (no recency concept)', 'Maintains head-to-tail temporal order', 'O(1) move-to-front on access'],
          ['Evict oldest item', 'Cannot locate oldest without scan', 'O(1) detachment of `tail->prev` node', 'O(1) removal from both list and map'],
          ['Insert new key', 'O(1) insert into bucket', 'O(1) insert after dummy head', 'O(1) addition to both structures'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Dummy sentinels eradicate pointer edge cases',
        body: 'Wiring a doubly linked list requires updating four pointers per insertion and two per deletion. If `head` and `tail` can be null, every method needs complex branches to check for empty lists or single-element updates. Introducing permanent dummy `head` and `tail` sentinel nodes ensures every active node always has non-null `prev` and `next` pointers, reducing list manipulation to invariant pointer updates.',
      },
    ],
    keyTakeaways: [
      'An LRU cache pairs a hash map for O(1) key lookup with a doubly linked list for O(1) recency ordering.',
      'Reading or modifying a key moves its corresponding node to the front of the list.',
      'When the cache exceeds capacity, the node directly preceding the dummy tail is evicted from both the list and the map.',
      'Permanent dummy head and tail sentinel nodes eliminate null checks and edge cases during pointer rewires.',
    ],
    practice: {
      prompt: 'Implement the LRUCache class with get and put methods executing in O(1) time using a hash map and a doubly linked list with dummy sentinels.',
      leetcode: { title: 'LRU Cache', slug: 'lru-cache' },
    },
  },

  // =========================================================================
  // Lesson 6: Design questions: choosing the structure
  // =========================================================================
  {
    sub: 6,
    summary: 'Deconstruct complex problem constraints and combine primitive data structures to achieve optimal time complexities.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Advanced system design and technical interview questions often present requirements that no single standard data structure can satisfy alone. A problem might require constant-time lookups, ordered traversals, and uniform random sampling simultaneously. The key to solving these challenges is decomposing the problem: identify the specific capability each candidate structure provides, recognise where their individual trade-offs conflict, and weave them into a composite data structure.',
      },
      { kind: 'heading', text: 'Core data structure capabilities and limits' },
      {
        kind: 'table',
        headers: ['Data Structure', 'Core Strengths', 'Primary Weakness', 'Best Suited Operations'],
        rows: [
          ['Hash Map / Set', 'O(1) average lookup, insert, delete by key', 'No order, no index access, no random pick', 'Exact key lookups, frequency counting'],
          ['Dynamic Array', 'O(1) random index access, cache locality', 'O(n) search by value, O(n) middle deletion', 'Random sampling, ordered indexing, stack buffer'],
          ['Doubly Linked List', 'O(1) insertion and deletion given node pointer', 'O(n) search, high memory pointer overhead', 'Order maintenance, LRU/LFU caches, deques'],
          ['Balanced BST / Map', 'O(log n) search, insert, min/max, predecessor', 'Slower than O(1) hash maps, pointer overhead', 'Range queries, sliding window medians, ordered keys'],
        ],
      },
      { kind: 'heading', text: 'Case study: Insert, Delete, and GetRandom in O(1)' },
      {
        kind: 'text',
        body: 'Suppose you must design a set supporting `insert(val)`, `remove(val)`, and `getRandom()`—all in strictly O(1) average time. A hash set handles `insert` and `remove` in O(1), but cannot choose a random element in O(1) because its buckets contain empty gaps, preventing uniform random index selection. A dynamic array allows O(1) random choice via `array[rand() % size]`, but deleting an arbitrary value requires an O(n) search and element shifting. Combining both yields the solution: a dynamic array holds the values, while a hash map tracks each value index in the array.',
      },
      {
        kind: 'code',
        caption: 'O(1) Insert, Delete, and GetRandom using Array plus Map',
        code: {
          cpp: `class RandomizedSet {
    vector<int> nums;
    unordered_map<int, int> valToIdx;
public:
    bool insert(int val) {
        if (valToIdx.count(val)) return false;
        valToIdx[val] = nums.size();
        nums.push_back(val);
        return true;
    }

    bool remove(int val) {
        if (!valToIdx.count(val)) return false;
        int idx = valToIdx[val], last = nums.back();
        nums[idx] = last;
        valToIdx[last] = idx;
        nums.pop_back();
        valToIdx.erase(val);
        return true;
    }

    int getRandom() { return nums[rand() % nums.size()]; }
};`,
          java: `public class RandomizedSet {
    private List<Integer> nums = new ArrayList<>();
    private Map<Integer, Integer> valToIdx = new HashMap<>();
    private Random rand = new Random();

    public boolean insert(int val) {
        if (valToIdx.containsKey(val)) return false;
        valToIdx.put(val, nums.size());
        nums.add(val);
        return true;
    }

    public boolean remove(int val) {
        if (!valToIdx.containsKey(val)) return false;
        int idx = valToIdx.get(val), last = nums.get(nums.size() - 1);
        nums.set(idx, last);
        valToIdx.put(last, idx);
        nums.remove(nums.size() - 1);
        valToIdx.remove(val);
        return true;
    }

    public int getRandom() { return nums.get(rand.nextInt(nums.size())); }
}`,
          python: `import random

class RandomizedSet:
    def __init__(self):
        self.nums, self.val_to_idx = [], {}

    def insert(self, val: int) -> bool:
        if val in self.val_to_idx: return False
        self.val_to_idx[val] = len(self.nums)
        self.nums.append(val)
        return True

    def remove(self, val: int) -> bool:
        if val not in self.val_to_idx: return False
        idx, last = self.val_to_idx[val], self.nums[-1]
        self.nums[idx] = last
        self.val_to_idx[last] = idx
        self.nums.pop()
        del self.val_to_idx[val]
        return True

    def get_random(self) -> int:
        return random.choice(self.nums)`,
        },
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The swap-with-last removal trick',
        body: 'Deleting an element from the middle of an array typically costs O(n) because subsequent elements must shift left to close the gap. Whenever element order does not matter, you can delete in O(1) time by copying the last element into the deleted slot and calling `pop_back()`. Always update the moved element index in your index lookup map before erasing the target key.',
      },
    ],
    keyTakeaways: [
      'Complex design problems often require pairing complementary data structures to meet multiple O(1) constraints.',
      'A dynamic array enables uniform random sampling in O(1), while a hash map provides O(1) key-to-index lookup.',
      'The swap-with-last trick enables O(1) deletion from an array when element ordering does not need to be preserved.',
      'Always update the index map for the relocated element before deleting the target element.',
    ],
    practice: {
      prompt: 'Implement the RandomizedSet class supporting insert, remove, and getRandom in O(1) average time by combining a dynamic array and a hash map.',
      leetcode: { title: 'Insert Delete GetRandom O(1)', slug: 'insert-delete-getrandom-o1' },
    },
  },
];
