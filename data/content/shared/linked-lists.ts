import type { SharedLesson } from './types';

/**
 * Linked Lists in Depth — Master singly, doubly, and circular linked lists,
 * pointer manipulation, cycle detection, memory management, and sentinels.
 */
export const lessons: SharedLesson[] = [
  // =========================================================================
  // Lesson 1: Node design and ownership
  // =========================================================================
  {
    sub: 1,
    summary: 'Construct a linked list node, contrast contiguous array layout with scattered heap allocations, and manage pointer lifetimes.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'An array stores elements in a single contiguous block of memory, allowing constant-time indexing via arithmetic. A **linked list** arranges elements across independent containers called **nodes**. Each node bundles an element value with a pointer or reference pointing to the subsequent node. Because nodes do not reside contiguously, a linked list grows and shrinks dynamically without reallocating memory or copying existing elements.',
      },
      { kind: 'heading', text: 'Anatomy of a node and memory ownership' },
      {
        kind: 'text',
        body: 'A singly linked list node contains two fields: a value and a `next` pointer. Nodes are allocated on demand at runtime. In C++, every node created with `new` resides on the heap and requires an explicit `delete` when discarded to avoid memory leaks. In Java and Python, the runtime garbage collector automatically reclaims a node once all references to it are dropped.',
      },
      {
        kind: 'code',
        caption: 'Constructing and linking nodes manually',
        code: {
          cpp: `#include <iostream>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

int main() {
    ListNode* head = new ListNode(10);
    head->next = new ListNode(20);
    head->next->next = new ListNode(30);

    for (ListNode* curr = head; curr != nullptr; curr = curr->next) {
        cout << curr->val << " ";
    }
    cout << "\\n";

    while (head != nullptr) {
        ListNode* temp = head;
        head = head->next;
        delete temp;
    }
    return 0;
}`,
          java: `class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
}

public class Main {
    public static void main(String[] args) {
        ListNode head = new ListNode(10);
        head.next = new ListNode(20);
        head.next.next = new ListNode(30);

        for (ListNode curr = head; curr != null; curr = curr.next) {
            System.out.print(curr.val + " ");
        }
        System.out.println();
    }
}`,
          python: `class ListNode:
    def __init__(self, val: int = 0, next: 'ListNode | None' = None):
        self.val = val
        self.next = next

head = ListNode(10)
head.next = ListNode(20)
head.next.next = ListNode(30)

curr = head
while curr is not None:
    print(curr.val, end=" ")
    curr = curr.next
print()`,
        },
        output: '10 20 30',
      },
      { kind: 'heading', text: 'Complexity trade-offs: Array vs Linked List' },
      {
        kind: 'table',
        headers: ['Operation / Metric', 'Dynamic Array', 'Singly Linked List', 'Reason'],
        rows: [
          ['Access at index k', 'O(1)', 'O(k)', 'Arrays calculate address directly; lists traverse k pointers'],
          ['Insert at head', 'O(n)', 'O(1)', 'Arrays shift all elements; lists rewire one next link'],
          ['Insert at tail (with tail pointer)', 'O(1) amortised', 'O(1)', 'Array may resize buffer; list attaches new node'],
          ['Memory overhead', '0 extra bytes per element', '8 bytes per node (pointer)', 'Each node stores a heap pointer to successor'],
          ['Cache locality', 'High (contiguous)', 'Low (scattered heap)', 'Contiguous array items share CPU cache lines'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Dangling pointers and memory leaks',
        body: 'In languages with manual memory control, reassigning a pointer before freeing the original node leaks memory. Conversely, reading `curr->val` after executing `delete curr` causes undefined behaviour via a dangling pointer. Always cache the successor pointer before freeing any node.',
      },
    ],
    keyTakeaways: [
      'A linked list node couples an element payload with a pointer to the next node.',
      'Index access requires O(k) sequential pointer traversals due to scattered heap memory.',
      'Linked lists trade CPU cache locality for constant-time head insertions.',
    ],
    practice: {
      prompt: 'Implement a linked list class supporting getting the value at index k, adding a node at the head, appending a node at the tail, and inserting or deleting a node at index k.',
      leetcode: { title: 'Design Linked List', slug: 'design-linked-list' },
    },
  },

  // =========================================================================
  // Lesson 2: Insert at head, tail and position
  // =========================================================================
  {
    sub: 2,
    summary: 'Insert new nodes at the head, tail, and arbitrary positions while preserving pointer ordering invariants.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Inserting an element into an array requires shifting subsequent elements to open a vacancy, incurring O(n) runtime. A linked list inserts elements by altering pointer references without moving surrounding data. Because existing links guide traversal, performing pointer updates out of order severs downstream nodes permanently.',
      },
      { kind: 'heading', text: 'Pointer rewiring sequence during insertion' },
      {
        kind: 'text',
        body: 'To insert after a node `prevNode`, point the new node forward first: `newNode->next = prevNode->next`. Then redirect the predecessor: `prevNode->next = newNode`. Reversing these two assignments overwrites `prevNode->next` before capturing the successor, permanently detaching the remainder of the list. Inserting at the head is the special case where `prevNode` is absent, and the list head itself updates.',
      },
      {
        kind: 'code',
        caption: 'Inserting at arbitrary position including head',
        code: {
          cpp: `ListNode* insertAt(ListNode* head, int index, int val) {
    ListNode* newNode = new ListNode(val);
    if (index == 0) {
        newNode->next = head;
        return newNode;
    }
    ListNode* curr = head;
    for (int i = 0; i < index - 1 && curr != nullptr; i++) {
        curr = curr->next;
    }
    if (!curr) return head;
    newNode->next = curr->next;
    curr->next = newNode;
    return head;
}`,
          java: `public ListNode insertAt(ListNode head, int index, int val) {
    ListNode newNode = new ListNode(val);
    if (index == 0) {
        newNode.next = head;
        return newNode;
    }
    ListNode curr = head;
    for (int i = 0; i < index - 1 && curr != null; i++) {
        curr = curr.next;
    }
    if (curr == null) return head;
    newNode.next = curr.next;
    curr.next = newNode;
    return head;
}`,
          python: `def insert_at(head: ListNode | None, index: int, val: int) -> ListNode | None:
    if index == 0:
        return ListNode(val, head)
    curr = head
    for _ in range(index - 1):
        if curr is None:
            break
        curr = curr.next
    if curr is None:
        return head
    curr.next = ListNode(val, curr.next)
    return head`,
        },
      },
      { kind: 'heading', text: 'Complexity of insertion operations' },
      {
        kind: 'table',
        headers: ['Insertion Point', 'Time Complexity', 'Auxiliary Space', 'Prerequisite'],
        rows: [
          ['Head', 'O(1)', 'O(1)', 'Update head pointer directly'],
          ['Tail (without tail pointer)', 'O(n)', 'O(1)', 'Traverse all n nodes to locate end'],
          ['Tail (with tail pointer)', 'O(1)', 'O(1)', 'Attach to tail->next directly'],
          ['Arbitrary index k', 'O(k)', 'O(1)', 'Advance through k - 1 predecessor nodes'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Severing the chain before linking forward',
        body: 'Writing `curr->next = newNode` before setting `newNode->next = curr->next` overwrites the only reference to the rest of the list. In garbage-collected runtimes, the lost nodes are collected; in manual memory runtimes, they leak. Always link the new node to its successor first.',
      },
    ],
    keyTakeaways: [
      'Inserting at the head takes O(1) time and requires zero element shifting.',
      'Always point newNode->next to the successor before redirecting the predecessor.',
      'Inserting at index k requires walking k - 1 steps to reach the preceding node.',
    ],
    practice: {
      prompt: 'Given the head of a linked list, insert a new node containing the greatest common divisor of every two adjacent nodes between each pair, and return the modified list.',
      leetcode: { title: 'Insert Greatest Common Divisors in Linked List', slug: 'insert-greatest-common-divisors-in-linked-list' },
    },
  },

  // =========================================================================
  // Lesson 3: Delete by value and by position
  // =========================================================================
  {
    sub: 3,
    summary: 'Unlink nodes by value or position, manage predecessor references, and release heap memory.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Deleting a node from a singly linked list requires bypassing it: pointing the preceding node directly to the subsequent node (`prev->next = curr->next`). Because singly linked nodes hold no backwards references, deleting an interior node requires either maintaining a dedicated `prev` pointer during traversal or inspecting `curr->next` directly from the preceding node.',
      },
      { kind: 'heading', text: 'Handling head deletions and consecutive matches' },
      {
        kind: 'text',
        body: 'When the target value resides at the head, no predecessor exists; the head pointer itself advances to `head->next`. When removing all occurrences of a target value, identical values may appear consecutively (such as `[6, 6, 2]`). The removal logic must continue evaluating the same position until a non-matching value appears, rather than advancing unconditionally.',
      },
      {
        kind: 'code',
        caption: 'Removing all nodes matching a target value',
        code: {
          cpp: `ListNode* removeElements(ListNode* head, int val) {
    while (head != nullptr && head->val == val) {
        ListNode* toDelete = head;
        head = head->next;
        delete toDelete;
    }
    ListNode* curr = head;
    while (curr != nullptr && curr->next != nullptr) {
        if (curr->next->val == val) {
            ListNode* toDelete = curr->next;
            curr->next = curr->next->next;
            delete toDelete;
        } else {
            curr = curr->next;
        }
    }
    return head;
}`,
          java: `public ListNode removeElements(ListNode head, int val) {
    while (head != null && head.val == val) {
        head = head.next;
    }
    ListNode curr = head;
    while (curr != null && curr.next != null) {
        if (curr.next.val == val) {
            curr.next = curr.next.next;
        } else {
            curr = curr.next;
        }
    }
    return head;
}`,
          python: `def remove_elements(head: ListNode | None, val: int) -> ListNode | None:
    while head is not None and head.val == val:
        head = head.next
    curr = head
    while curr is not None and curr.next is not None:
        if curr.next.val == val:
            curr.next = curr.next.next
        else:
            curr = curr.next
    return head`,
        },
      },
      { kind: 'heading', text: 'Complexity of deletion operations' },
      {
        kind: 'table',
        headers: ['Deletion Type', 'Time Complexity', 'Auxiliary Space', 'Key Constraint'],
        rows: [
          ['Delete head node', 'O(1)', 'O(1)', 'Advance head pointer and free initial node'],
          ['Delete by index k', 'O(k)', 'O(1)', 'Traverse k - 1 steps to reach predecessor'],
          ['Delete by value (all matches)', 'O(n)', 'O(1)', 'Single pass inspecting every node in list'],
          ['Delete node given pointer (non-tail)', 'O(1)', 'O(1)', 'Copy next node val, then bypass next node'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Advancing the traversal pointer after a deletion',
        body: 'When `curr->next->val == val`, setting `curr->next = curr->next->next` pulls a new node into `curr->next`. Advancing `curr = curr->next` on the same step skips evaluating that new node. When consecutive nodes match the target value, this bug leaves duplicates behind.',
      },
    ],
    keyTakeaways: [
      'Unlinking an interior node requires pointing its predecessor to its successor.',
      'Head deletions must be handled as a separate condition or unified using a sentinel dummy.',
      'Only advance curr when no deletion occurred on the current step.',
    ],
    practice: {
      prompt: 'Given the head of a linked list and an integer val, remove all nodes of the linked list that have Node.val == val, and return the new head.',
      leetcode: { title: 'Remove Linked List Elements', slug: 'remove-linked-list-elements' },
    },
  },

  // =========================================================================
  // Lesson 4: Reverse: iteratively and recursively
  // =========================================================================
  {
    sub: 4,
    summary: 'Invert the direction of all list edges using three iterative pointers or recursive call-stack unwinding.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Reversing a linked list inverts the direction of every pointer in the structure. The node that originally served as the tail becomes the new head, and the original head becomes the tail pointing to null. Reversing must be achieved in place by modifying pointer fields without allocating new node objects or copying values into an auxiliary array.',
      },
      { kind: 'heading', text: 'Iterative reversal using three pointers' },
      {
        kind: 'text',
        body: 'The iterative technique tracks three positions: `prev` (initialised to null), `curr` (initialised to head), and `nextTemp`. On each step, record `nextTemp = curr->next` to preserve the rest of the list. Next, redirect `curr->next = prev`. Finally, shift `prev = curr` and `curr = nextTemp`. When `curr` reaches null, `prev` references the new head.',
      },
      {
        kind: 'code',
        caption: 'Iterative and recursive list reversal',
        code: {
          cpp: `ListNode* reverseIterative(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* curr = head;
    while (curr != nullptr) {
        ListNode* nextTemp = curr->next;
        curr->next = prev;
        prev = curr;
        curr = nextTemp;
    }
    return prev;
}

ListNode* reverseRecursive(ListNode* head) {
    if (!head || !head->next) return head;
    ListNode* newHead = reverseRecursive(head->next);
    head->next->next = head;
    head->next = nullptr;
    return newHead;
}`,
          java: `public ListNode reverseIterative(ListNode head) {
    ListNode prev = null, curr = head;
    while (curr != null) {
        ListNode nextTemp = curr.next;
        curr.next = prev;
        prev = curr;
        curr = nextTemp;
    }
    return prev;
}

public ListNode reverseRecursive(ListNode head) {
    if (head == null || head.next == null) return head;
    ListNode newHead = reverseRecursive(head.next);
    head.next.next = head;
    head.next = null;
    return newHead;
}`,
          python: `def reverse_iterative(head: ListNode | None) -> ListNode | None:
    prev = None
    curr = head
    while curr is not None:
        next_temp = curr.next
        curr.next = prev
        prev = curr
        curr = next_temp
    return prev

def reverse_recursive(head: ListNode | None) -> ListNode | None:
    if head is None or head.next is None:
        return head
    new_head = reverse_recursive(head.next)
    head.next.next = head
    head.next = None
    return new_head`,
        },
      },
      { kind: 'heading', text: 'Complexity: Iterative vs Recursive reversal' },
      {
        kind: 'table',
        headers: ['Approach', 'Time Complexity', 'Auxiliary Space', 'Recursion Risk'],
        rows: [
          ['Iterative (3 pointers)', 'O(n)', 'O(1)', 'Zero risk; runs in constant space'],
          ['Recursive', 'O(n)', 'O(n)', 'High on long lists; call stack reaches depth n'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Omitting head->next = nullptr in recursive reversal',
        body: 'In recursive reversal, `head->next->next = head` turns the link between the first two nodes into a cycle. Failing to clear `head->next = nullptr` leaves that two-node cycle in place. Any subsequent traversal loops endlessly between those two nodes.',
      },
    ],
    keyTakeaways: [
      'The iterative approach uses prev, curr, and nextTemp to reverse links in O(1) space.',
      'Recursive reversal unwinds from the tail, wiring head->next->next = head at each step.',
      'Always nullify the original head next pointer to prevent creating a cycle.',
    ],
    practice: {
      prompt: 'Given the head of a singly linked list, reverse the list and return the reversed list using both the iterative and recursive approaches.',
      leetcode: { title: 'Reverse Linked List', slug: 'reverse-linked-list' },
    },
  },

  // =========================================================================
  // Lesson 5: Find the middle with slow and fast pointers
  // =========================================================================
  {
    sub: 5,
    summary: 'Locate the middle node of a linked list in a single pass using two pointers advancing at different speeds.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Finding the middle element of an array takes O(1) time because the midpoint index `n // 2` can be computed directly. For a linked list, determining length requires an initial pass of n steps, followed by a second traversal of `n // 2` steps to reach the node. The **two-pointer fast and slow technique** (Tortoise and Hare) locates the middle node in a single traversal pass.',
      },
      { kind: 'heading', text: 'Fast and slow pointer mechanics' },
      {
        kind: 'text',
        body: 'Initialise two pointers, `slow` and `fast`, at the head of the list. On each step, advance `slow` by one node and `fast` by two nodes. Because `fast` moves at double the speed of `slow`, whenever `fast` reaches the end of the list, `slow` has traversed half the distance and stands at the middle node.',
      },
      {
        kind: 'code',
        caption: 'Locating the middle node in one pass',
        code: {
          cpp: `ListNode* middleNode(ListNode* head) {
    ListNode* slow = head;
    ListNode* fast = head;
    while (fast != nullptr && fast->next != nullptr) {
        slow = slow->next;
        fast = fast->next->next;
    }
    return slow;
}`,
          java: `public ListNode middleNode(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    return slow;
}`,
          python: `def middle_node(head: ListNode | None) -> ListNode | None:
    slow = head
    fast = head
    while fast is not None and fast.next is not None:
        slow = slow.next
        fast = fast.next.next
    return slow`,
        },
      },
      { kind: 'heading', text: 'Termination conditions on odd vs even lengths' },
      {
        kind: 'table',
        headers: ['Length Parity', 'Loop Condition', 'Fast Position at End', 'Slow Node Location'],
        rows: [
          ['Odd length (e.g. 5 nodes)', 'fast != null && fast.next != null', 'At last node (node 5)', 'Exact middle (node 3)'],
          ['Even length (e.g. 6 nodes)', 'fast != null && fast.next != null', 'At null (past tail)', 'Second middle (node 4)'],
          ['Even length (e.g. 6 nodes)', 'fast.next != null && fast.next.next != null', 'At node 5', 'First middle (node 3)'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Null pointer dereference order in while conditions',
        body: 'Writing `while (fast.next != null && fast != null)` evaluates `fast.next` before checking whether `fast` is null. When `fast` reaches null on even-length lists, this statement crashes. Always place `fast != null` first to take advantage of short-circuit evaluation.',
      },
    ],
    keyTakeaways: [
      'A 1x slow pointer and a 2x fast pointer locate the midpoint in a single O(n) pass.',
      'Checking fast != null and fast.next != null returns the second middle for even lengths.',
      'Use first-middle condition when splitting a list for merge sort to balance halves.',
    ],
    practice: {
      prompt: 'Given the head of a singly linked list, return the middle node of the linked list. If there are two middle nodes, return the second middle node.',
      leetcode: { title: 'Middle of the Linked List', slug: 'middle-of-the-linked-list' },
    },
  },

  // =========================================================================
  // Lesson 6: Detect and remove a cycle
  // =========================================================================
  {
    sub: 6,
    summary: 'Detect cycle presence, locate the cycle entrance, and break the cycle using Floyd cycle-finding algorithm.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'A **cycle** in a linked list exists when a node points back to a previously visited node, forming a closed loop. Traversing a cyclic list with a standard null-check loop causes an infinite execution loop. Detecting and resolving cycles in O(1) auxiliary space without modifying node values relies on **Floyd Cycle-Finding Algorithm**.',
      },
      { kind: 'heading', text: 'Meeting point and the mathematical derivation' },
      {
        kind: 'text',
        body: 'Run a `slow` pointer at 1 step per turn and a `fast` pointer at 2 steps per turn from `head`. If the list is acyclic, `fast` reaches null. If a cycle exists, `fast` enters the loop first; each step reduces the gap between them by 1 until they meet. Let L be the distance from `head` to the cycle entrance, and C be the cycle length. When they meet, moving one pointer back to `head` and advancing both pointers at 1 step per turn guarantees they meet at the cycle entrance after L steps.',
      },
      {
        kind: 'code',
        caption: 'Cycle detection, entrance identification, and cycle breaking',
        code: {
          cpp: `ListNode* detectAndBreakCycle(ListNode* head) {
    ListNode* slow = head;
    ListNode* fast = head;
    while (fast != nullptr && fast->next != nullptr) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) break;
    }
    if (fast == nullptr || fast->next == nullptr) return nullptr;

    slow = head;
    while (slow != fast) {
        slow = slow->next;
        fast = fast->next;
    }
    ListNode* entrance = slow;

    ListNode* curr = entrance;
    while (curr->next != entrance) {
        curr = curr->next;
    }
    curr->next = nullptr; // Break cycle
    return entrance;
}`,
          java: `public ListNode detectAndBreakCycle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) break;
    }
    if (fast == null || fast.next == null) return null;

    slow = head;
    while (slow != fast) {
        slow = slow.next;
        fast = fast.next;
    }
    ListNode entrance = slow;

    ListNode curr = entrance;
    while (curr.next != entrance) {
        curr = curr.next;
    }
    curr.next = null; // Break cycle
    return entrance;
}`,
          python: `def detect_and_break_cycle(head: ListNode | None) -> ListNode | None:
    slow = head
    fast = head
    while fast is not None and fast.next is not None:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            break
    if fast is None or fast.next is None:
        return None

    slow = head
    while slow != fast:
        slow = slow.next
        fast = fast.next
    entrance = slow

    curr = entrance
    while curr.next != entrance:
        curr = curr.next
    curr.next = None  # Break cycle
    return entrance`,
        },
      },
      { kind: 'heading', text: 'Complexity of cycle algorithms' },
      {
        kind: 'table',
        headers: ['Algorithm Phase', 'Time Complexity', 'Auxiliary Space', 'Mathematical Guarantee'],
        rows: [
          ['Cycle detection', 'O(n)', 'O(1)', 'Fast meets slow within one cycle traversal'],
          ['Find cycle entrance', 'O(n)', 'O(1)', 'Pointers cover distance L from head and meeting point'],
          ['Break cycle', 'O(C)', 'O(1)', 'Walk around cycle length C to find node pointing to entrance'],
          ['Hash set alternative', 'O(n)', 'O(n)', 'Requires storing addresses of all visited nodes'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Starting fast one step ahead alters the entrance proof',
        body: 'Setting `fast = head->next` to avoid an initial `slow == fast` check breaks the mathematical equality `dist(head, entrance) == dist(meeting, entrance)`. Initialise both pointers at `head`, and use a standard loop with internal equality check or do-while structure.',
      },
    ],
    keyTakeaways: [
      'Floyd cycle detection confirms loop existence in O(n) time and O(1) space.',
      'The distance from head to entrance equals the distance from meeting point to entrance.',
      'Breaking a cycle requires finding the node whose next pointer targets the cycle entrance.',
    ],
    practice: {
      prompt: 'Given head, the head of a linked list, determine if the linked list has a cycle in it using O(1) memory.',
      leetcode: { title: 'Linked List Cycle', slug: 'linked-list-cycle' },
    },
  },

  // =========================================================================
  // Lesson 7: Merge two sorted lists
  // =========================================================================
  {
    sub: 7,
    summary: 'Interleave two sorted linked lists into a single sorted list in place without allocating new nodes.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Merging two sorted arrays of lengths m and n requires allocating an output array of size m + n and copying elements into it. With linked lists, elements already reside inside existing heap nodes. Merging two sorted linked lists requires zero node allocations: existing nodes are spliced together by reassigning their `next` pointers.',
      },
      { kind: 'heading', text: 'Pointer splicing and constant-time remainder attachment' },
      {
        kind: 'text',
        body: 'Use a dummy sentinel node to anchor the result. Maintain a `tail` pointer at the end of the newly merged chain. Compare the current heads of both lists: append the smaller node to `tail->next`, and advance that list pointer. Once one list becomes empty, attach the entire remainder of the other list directly to `tail->next` with a single pointer assignment.',
      },
      {
        kind: 'code',
        caption: 'Merging two sorted lists via iterative splicing',
        code: {
          cpp: `ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
    ListNode dummy(0);
    ListNode* tail = &dummy;

    while (list1 != nullptr && list2 != nullptr) {
        if (list1->val <= list2->val) {
            tail->next = list1;
            list1 = list1->next;
        } else {
            tail->next = list2;
            list2 = list2->next;
        }
        tail = tail->next;
    }
    tail->next = (list1 != nullptr) ? list1 : list2;
    return dummy.next;
}`,
          java: `public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
    ListNode dummy = new ListNode(0);
    ListNode tail = dummy;

    while (list1 != null && list2 != null) {
        if (list1.val <= list2.val) {
            tail.next = list1;
            list1 = list1.next;
        } else {
            tail.next = list2;
            list2 = list2.next;
        }
        tail = tail.next;
    }
    tail.next = (list1 != null) ? list1 : list2;
    return dummy.next;
}`,
          python: `def merge_two_lists(list1: ListNode | None, list2: ListNode | None) -> ListNode | None:
    dummy = ListNode(0)
    tail = dummy

    while list1 is not None and list2 is not None:
        if list1.val <= list2.val:
            tail.next = list1
            list1 = list1.next
        else:
            tail.next = list2
            list2 = list2.next
        tail = tail.next

    tail.next = list1 if list1 is not None else list2
    return dummy.next`,
        },
      },
      { kind: 'heading', text: 'Comparison of merging linked lists vs arrays' },
      {
        kind: 'table',
        headers: ['Structure', 'Time Complexity', 'Auxiliary Space', 'Remainder Handling'],
        rows: [
          ['Linked list (iterative dummy)', 'O(m + n)', 'O(1)', 'Single pointer assignment attaches remaining chain'],
          ['Array merge', 'O(m + n)', 'O(m + n)', 'Must copy all remaining elements in a loop'],
          ['Linked list (recursive)', 'O(m + n)', 'O(m + n)', 'Allocates m + n recursive stack frames'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Splicing the remainder in O(1) time',
        body: 'Unlike array merges that require looping through remaining items, a linked list already has its elements linked in order. Assigning `tail->next = (list1 != null) ? list1 : list2;` splices all remaining nodes in constant time.',
      },
    ],
    keyTakeaways: [
      'Merging two sorted linked lists requires O(1) auxiliary space via in-place pointer splicing.',
      'A sentinel dummy head eliminates conditional checks for establishing the return head.',
      'The non-empty list remainder connects with a single constant-time assignment.',
    ],
    practice: {
      prompt: 'You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list by splicing together the nodes of the first two lists, and return the head of the merged linked list.',
      leetcode: { title: 'Merge Two Sorted Lists', slug: 'merge-two-sorted-lists' },
    },
  },

  // =========================================================================
  // Lesson 8: The dummy-head technique
  // =========================================================================
  {
    sub: 8,
    summary: 'Eliminate head-modification special cases by prepending a sentinel node before the list.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'When writing linked list algorithms, modifying the head node introduces cumbersome edge cases. Deleting the head node requires updating the head variable itself, while deleting an interior node requires modifying `prev->next`. Writing defensive `if (curr == head)` checks clutters logic and creates opportunities for null pointer errors. The **dummy-head technique** introduces a sentinel node positioned immediately before the head.',
      },
      { kind: 'heading', text: 'How sentinel nodes eliminate edge cases' },
      {
        kind: 'text',
        body: 'Create a temporary sentinel node whose `next` pointer references the original `head`. Because the sentinel node precedes the true head, every node in the actual list — including the first node — now has a guaranteed non-null predecessor. When the algorithm finishes, `dummy->next` points to the new head, cleanly accommodating deletions or replacements of the original first node.',
      },
      {
        kind: 'code',
        caption: 'Removing nth node from end cleanly with a dummy head',
        code: {
          cpp: `ListNode* removeNthFromEnd(ListNode* head, int n) {
    ListNode dummy(0);
    dummy.next = head;
    ListNode* fast = &dummy;
    ListNode* slow = &dummy;

    for (int i = 0; i <= n; i++) {
        fast = fast->next;
    }
    while (fast != nullptr) {
        slow = slow->next;
        fast = fast->next;
    }

    ListNode* toDelete = slow->next;
    slow->next = slow->next->next;
    delete toDelete;

    return dummy.next;
}`,
          java: `public ListNode removeNthFromEnd(ListNode head, int n) {
    ListNode dummy = new ListNode(0);
    dummy.next = head;
    ListNode fast = dummy, slow = dummy;

    for (int i = 0; i <= n; i++) {
        fast = fast.next;
    }
    while (fast != null) {
        slow = slow.next;
        fast = fast.next;
    }

    slow.next = slow.next.next;
    return dummy.next;
}`,
          python: `def remove_nth_from_end(head: ListNode | None, n: int) -> ListNode | None:
    dummy = ListNode(0, head)
    fast: ListNode | None = dummy
    slow: ListNode | None = dummy

    for _ in range(n + 1):
        if fast is not None:
            fast = fast.next

    while fast is not None:
        slow = slow.next  # type: ignore[union-attr]
        fast = fast.next

    if slow is not None and slow.next is not None:
        slow.next = slow.next.next

    return dummy.next`,
        },
      },
      { kind: 'heading', text: 'Comparison of operations with and without a dummy head' },
      {
        kind: 'table',
        headers: ['Scenario', 'Without Dummy Head', 'With Dummy Head', 'Primary Benefit'],
        rows: [
          ['Deleting the first node', 'Separate branch: head = head->next', 'Unified: prev->next = curr->next', 'Eliminates special-case branching'],
          ['Building a new list', 'Must check if head is null on first item', 'Always attach to tail->next', 'Consistent loop body for all elements'],
          ['Empty list input', 'Guard clause: if (!head) return null', 'dummy->next evaluates to null automatically', 'Handles boundary naturally'],
          ['Memory overhead', '0 bytes', '1 stack or heap node object', 'Negligible O(1) space cost'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: { cpp: 'Stack allocation prevents memory leaks', java: 'The dummy node is garbage collected', python: 'The dummy node is garbage collected' },
        body: { cpp: 'Instantiate the dummy node on the stack with `ListNode dummy(0); dummy.next = head;` instead of allocating it on the heap with `new`. Stack memory automatically unwinds when the function returns, eliminating the need to call `delete` on the dummy sentinel.', java: 'Create the dummy with `ListNode dummy = new ListNode(0); dummy.next = head;`. It is an ordinary object: once the method returns and nothing references it, the garbage collector reclaims it. Return `dummy.next`, never `dummy`.', python: 'Create the dummy with `dummy = ListNode(0); dummy.next = head`. It is an ordinary object that is reclaimed once nothing refers to it. Return `dummy.next`, never `dummy`.' },
      },
    ],
    keyTakeaways: [
      'A sentinel dummy node provides a reliable predecessor for every node in the list.',
      'Special checks for modifying or deleting the head node are rendered unnecessary.',
      'Always return dummy.next or dummy->next rather than the initial head variable.',
    ],
    practice: {
      prompt: 'Given the head of a linked list, remove the nth node from the end of the list and return its head, using a dummy node to handle head removal cleanly.',
      leetcode: { title: 'Remove Nth Node From End of List', slug: 'remove-nth-node-from-end-of-list' },
    },
  },

  // =========================================================================
  // Lesson 9: Doubly linked list operations
  // =========================================================================
  {
    sub: 9,
    summary: 'Design bidirectional nodes, perform O(1) deletions with direct node references, and manage four pointer updates per insertion.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'In a singly linked list, each node maintains only a forward pointer. Deleting an arbitrary node or inserting a new element before it requires traversing from the head to locate the preceding node, taking O(n) time. A **doubly linked list (DLL)** equips each node with two references: `next` pointing to the subsequent node and `prev` pointing to the preceding node.',
      },
      { kind: 'heading', text: 'Bidirectional linking and pointer rewiring mechanics' },
      {
        kind: 'text',
        body: 'Because each node directly references its predecessor, deleting a node given only its pointer requires zero traversal: update `node->prev->next = node->next` and `node->next->prev = node->prev`. Inserting a new node between `nodeA` and `nodeB` requires four pointer updates: link `newNode` forward to `nodeB` and backward to `nodeA`, then point `nodeA->next` to `newNode` and `nodeB->prev` to `newNode`. Sentinel head and tail nodes eliminate null checks at both ends.',
      },
      {
        kind: 'code',
        caption: 'Doubly linked list node insertion and deletion in O(1)',
        code: {
          cpp: `struct DLNode {
    int val;
    DLNode* prev;
    DLNode* next;
    DLNode(int v) : val(v), prev(nullptr), next(nullptr) {}
};

void insertAfter(DLNode* node, int val) {
    DLNode* newNode = new DLNode(val);
    newNode->next = node->next;
    newNode->prev = node;
    if (node->next) node->next->prev = newNode;
    node->next = newNode;
}

void removeNode(DLNode* node) {
    if (node->prev) node->prev->next = node->next;
    if (node->next) node->next->prev = node->prev;
    delete node;
}`,
          java: `class DLNode {
    int val;
    DLNode prev, next;
    DLNode(int val) { this.val = val; }
}

public void insertAfter(DLNode node, int val) {
    DLNode newNode = new DLNode(val);
    newNode.next = node.next;
    newNode.prev = node;
    if (node.next != null) node.next.prev = newNode;
    node.next = newNode;
}

public void removeNode(DLNode node) {
    if (node.prev != null) node.prev.next = node.next;
    if (node.next != null) node.next.prev = node.prev;
}`,
          python: `class DLNode:
    def __init__(self, val: int = 0):
        self.val = val
        self.prev: 'DLNode | None' = None
        self.next: 'DLNode | None' = None

def insert_after(node: DLNode, val: int) -> DLNode:
    new_node = DLNode(val)
    new_node.next = node.next
    new_node.prev = node
    if node.next is not None:
        node.next.prev = new_node
    node.next = new_node
    return new_node

def remove_node(node: DLNode) -> None:
    if node.prev is not None:
        node.prev.next = node.next
    if node.next is not None:
        node.next.prev = node.prev`,
        },
      },
      { kind: 'heading', text: 'Complexity: Singly vs Doubly Linked Lists' },
      {
        kind: 'table',
        headers: ['Operation', 'Singly Linked List', 'Doubly Linked List', 'Structural Reason'],
        rows: [
          ['Delete node (given pointer to it)', 'O(n)', 'O(1)', 'DLL reads node->prev directly without scanning from head'],
          ['Insert before node (given pointer)', 'O(n)', 'O(1)', 'DLL splices between node->prev and node in constant time'],
          ['Bidirectional traversal', 'Impossible', 'Supported', 'Backward iteration enabled by prev pointer'],
          ['Pointer memory per node', '1 pointer (8 bytes)', '2 pointers (16 bytes)', 'Stores both next and prev references'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Dangling backward pointers after deletion',
        body: 'Updating `node->prev->next = node->next` but omitting `node->next->prev = node->prev` leaves the successor pointing backward to a detached node. Traversing forward and then immediately backward then returns to stale memory, causing corruption.',
      },
    ],
    keyTakeaways: [
      'Doubly linked lists enable O(1) insertion and deletion given a direct node reference.',
      'Every insertion requires 4 pointer updates; every deletion requires 2 updates.',
      'Pairing a hash map with a doubly linked list produces O(1) get and put in LRU caches.',
    ],
    practice: {
      prompt: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache, supporting get and put operations in O(1) average time complexity.',
      leetcode: { title: 'LRU Cache', slug: 'lru-cache' },
    },
  },

  // =========================================================================
  // Lesson 10: Circular linked lists
  // =========================================================================
  {
    sub: 10,
    summary: 'Construct closed-loop circular lists, handle traversal termination conditions, and maintain head and tail via a single reference.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'In a linear linked list, the final node references null, signalling the end of the data structure. In a **circular linked list (CLL)**, the final node references the first node, forming a closed ring. Circular linked lists naturally model recurring cyclic systems, including round-robin process scheduling in operating systems, turn-based games, and circular audio buffers.',
      },
      { kind: 'heading', text: 'Single tail-pointer representation and traversal loops' },
      {
        kind: 'text',
        body: 'Maintaining a single pointer to `tail` provides constant-time access to both ends of the list, because `tail->next` points directly to the head. Inserting at the head requires inserting after `tail`, while inserting at the tail requires the identical pointer rewiring followed by advancing `tail = tail->next`. Because `curr != null` never occurs, traversal loops must compare `curr != head` using a do-while loop.',
      },
      {
        kind: 'code',
        caption: 'Circular linked list insertion and traversal with single tail pointer',
        code: {
          cpp: `struct CNode {
    int val;
    CNode* next;
    CNode(int x) : val(x), next(nullptr) {}
};

CNode* insertTail(CNode* tail, int val) {
    CNode* newNode = new CNode(val);
    if (!tail) {
        newNode->next = newNode;
        return newNode;
    }
    newNode->next = tail->next;
    tail->next = newNode;
    return newNode; // New tail
}

void printCircular(CNode* tail) {
    if (!tail) return;
    CNode* curr = tail->next; // Start at head
    do {
        cout << curr->val << " ";
        curr = curr->next;
    } while (curr != tail->next);
    cout << "\\n";
}`,
          java: `class CNode {
    int val;
    CNode next;
    CNode(int val) { this.val = val; }
}

public static CNode insertTail(CNode tail, int val) {
    CNode newNode = new CNode(val);
    if (tail == null) {
        newNode.next = newNode;
        return newNode;
    }
    newNode.next = tail.next;
    tail.next = newNode;
    return newNode; // New tail
}

public static void printCircular(CNode tail) {
    if (tail == null) return;
    CNode curr = tail.next;
    do {
        System.out.print(curr.val + " ");
        curr = curr.next;
    } while (curr != tail.next);
    System.out.println();
}`,
          python: `class CNode:
    def __init__(self, val: int = 0):
        self.val = val
        self.next: 'CNode | None' = None

def insert_tail(tail: CNode | None, val: int) -> CNode:
    new_node = CNode(val)
    if tail is None:
        new_node.next = new_node
        return new_node
    new_node.next = tail.next
    tail.next = new_node
    return new_node  # New tail

def to_list(tail: CNode | None) -> list[int]:
    if tail is None or tail.next is None:
        return []
    res: list[int] = []
    curr = tail.next
    while True:
        res.append(curr.val)
        curr = curr.next  # type: ignore[assignment]
        if curr == tail.next:
            break
    return res`,
        },
      },
      { kind: 'heading', text: 'Complexity of circular list operations' },
      {
        kind: 'table',
        headers: ['Operation', 'Tail-Pointer Architecture', 'Head-Pointer Architecture', 'Structural Advantage'],
        rows: [
          ['Access head', 'O(1) via tail->next', 'O(1) direct', 'Both provide instant head reference'],
          ['Access tail', 'O(1) direct', 'O(n) traversal', 'Tail pointer avoids traversing whole ring'],
          ['Insert at head', 'O(1)', 'O(n)', 'Tail pointer rewires tail->next without traversal'],
          ['Insert at tail', 'O(1)', 'O(n)', 'Insert after tail then advance tail in O(1)'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Infinite loops when using standard while conditions',
        body: 'A standard loop `while (curr != nullptr)` runs infinitely on a circular list because no pointer ever holds null. Always terminate iterations by checking `curr != head` or by decrementing an explicit element counter.',
      },
    ],
    keyTakeaways: [
      'Circular linked lists eliminate null endings by pointing the final node back to the head.',
      'Storing a single tail pointer enables O(1) insertions at both the head and tail.',
      'Traversals must use do-while or comparison against the origin node to avoid infinite loops.',
    ],
    practice: {
      prompt: 'There are n friends sitting in a circle numbered 1 to n. Starting at friend 1, count k friends clockwise and eliminate the kth friend, repeating until one winner remains. Simulate the process using a circular linked list.',
      leetcode: { title: 'Find the Winner of the Circular Game', slug: 'find-the-winner-of-the-circular-game' },
    },
  },
];
