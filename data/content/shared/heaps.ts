import type { SharedLesson } from './types';

/**
 * Heaps from Scratch — Master binary heap invariants, array index arithmetic,
 * sift-up and sift-down operations, linear-time build-heap, in-place heap sort,
 * bounded streaming heaps, custom priority comparators, and the two-heap median algorithm.
 */
export const lessons: SharedLesson[] = [
  // =========================================================================
  // Lesson 1: Array representation and index arithmetic
  // =========================================================================
  {
    sub: 1,
    summary: 'Represent a complete binary tree as a flat array and compute parent and child locations using zero-based index arithmetic.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A **binary heap** is a tree-based data structure governed by two fundamental constraints: the **structural property** and the **heap property**. Structurally, a heap is a **complete binary tree**, meaning every level is completely filled except possibly the final level, which is populated sequentially from left to right. Because no gaps exist between nodes, the tree requires no node objects or left and right pointers. Instead, the tree maps into a contiguous 1D array.',
      },
      { kind: 'heading', text: 'Zero-based index arithmetic' },
      {
        kind: 'text',
        body: 'In a zero-indexed array, the root resides at index 0. For any node at index `i`, relative tree positions are calculated via integer arithmetic: the parent sits at `(i - 1) / 2`, the left child at `2 * i + 1`, and the right child at `2 * i + 2`. A child index represents a valid node if and only if its index is strictly less than the total element count `n`.',
      },
      {
        kind: 'code',
        caption: 'Index navigation and min-heap validation',
        code: {
          cpp: `#include <vector>
using namespace std;

int parent(int i) { return (i - 1) / 2; }
int leftChild(int i) { return 2 * i + 1; }
int rightChild(int i) { return 2 * i + 2; }

bool isMinHeap(const vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i <= (n - 2) / 2; i++) {
        if (2 * i + 1 < n && arr[i] > arr[2 * i + 1]) return false;
        if (2 * i + 2 < n && arr[i] > arr[2 * i + 2]) return false;
    }
    return true;
}`,
          java: `public class HeapIndex {
    public static int parent(int i) { return (i - 1) / 2; }
    public static int leftChild(int i) { return 2 * i + 1; }
    public static int rightChild(int i) { return 2 * i + 2; }

    public static boolean isMinHeap(int[] arr) {
        int n = arr.length;
        for (int i = 0; i <= (n - 2) / 2; i++) {
            if (2 * i + 1 < n && arr[i] > arr[2 * i + 1]) return false;
            if (2 * i + 2 < n && arr[i] > arr[2 * i + 2]) return false;
        }
        return true;
    }
}`,
          python: `def parent(i: int) -> int:
    return (i - 1) // 2

def left_child(i: int) -> int:
    return 2 * i + 1

def right_child(i: int) -> int:
    return 2 * i + 2

def is_min_heap(arr: list[int]) -> bool:
    n = len(arr)
    for i in range((n - 2) // 2 + 1):
        if 2 * i + 1 < n and arr[i] > arr[2 * i + 1]:
            return False
        if 2 * i + 2 < n and arr[i] > arr[2 * i + 2]:
            return False
    return True`,
        },
      },
      { kind: 'heading', text: 'Structural bounds and index properties' },
      {
        kind: 'table',
        headers: ['Property', 'Formula', 'Complexity', 'Notes'],
        rows: [
          ['Parent index', '(i - 1) / 2', 'O(1)', 'Valid when i > 0; root has no parent'],
          ['Left child', '2 * i + 1', 'O(1)', 'Valid when 2 * i + 1 < n'],
          ['Right child', '2 * i + 2', 'O(1)', 'Valid when 2 * i + 2 < n'],
          ['Last internal node', '(n - 2) / 2', 'O(1)', 'Indices beyond this value are leaves'],
          ['Tree height', 'floor(log2(n))', 'O(1)', 'Bounds worst-case traversal length'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Evaluating parent index of the root',
        body: 'Evaluating `(0 - 1) / 2` in C++ and Java truncates toward zero to produce `0`, whereas in Python `(0 - 1) // 2` evaluates to `-1`. Both outputs are invalid parent indices because the root at index 0 has no parent. When traversing upward toward the root in a loop, you must explicitly guard the condition with `i > 0` rather than checking `parent(i) >= 0`.',
      },
    ],
    keyTakeaways: [
      'A complete binary tree maps directly into a contiguous array without storing child or parent pointers.',
      'In a zero-indexed array, node `i` has parent `(i - 1) / 2`, left child `2 * i + 1`, and right child `2 * i + 2`.',
      'All nodes located at indices strictly greater than `(n - 2) / 2` are leaf nodes with zero children.',
      'Guard upward parent traversals with `i > 0` to prevent infinite loops at the root node.',
    ],
    practice: {
      prompt: 'Write a function that validates whether an integer array forms a valid max-heap: ensure that for every node at index i, both of its existing children are less than or equal to the parent element.',
    },
  },

  // =========================================================================
  // Lesson 2: Sift up
  // =========================================================================
  {
    sub: 2,
    summary: 'Restore the min-heap invariant after inserting an element by bubbling it upward toward the root in O(log n) time.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'When inserting a new element into a heap, we must preserve the complete binary tree structure before adjusting element positions. In an array representation, the only location that avoids gaps is index `n` at the end of the array. Appending to a dynamic array takes O(1) amortised time. However, this newly appended value may be smaller than its parent (in a min-heap), which violates the heap order invariant.',
      },
      { kind: 'heading', text: 'The sift-up operation' },
      {
        kind: 'text',
        body: 'The **sift up** operation (also called bubble-up or swim) repairs the heap invariant by moving the inserted value upward. We compare the element at index `i` with its parent at `(i - 1) / 2`. If the child is smaller than the parent, we swap them and set `i` to the parent index. We repeat this check until the parent is less than or equal to the current node, or until `i` reaches 0. Because a complete tree of `n` nodes has height `floor(log2(n))`, sift up executes at most `log2(n)` swaps.',
      },
      {
        kind: 'code',
        caption: 'Min-heap insertion using sift up',
        code: {
          cpp: `#include <vector>
#include <utility>
using namespace std;

class MinHeap {
    vector<int> data;

    void siftUp(int i) {
        while (i > 0) {
            int p = (i - 1) / 2;
            if (data[i] >= data[p]) break;
            swap(data[i], data[p]);
            i = p;
        }
    }

public:
    void push(int val) {
        data.push_back(val);
        siftUp(data.size() - 1);
    }
};`,
          java: `import java.util.ArrayList;

public class MinHeap {
    private ArrayList<Integer> data = new ArrayList<>();

    private void siftUp(int i) {
        while (i > 0) {
            int p = (i - 1) / 2;
            if (data.get(i) >= data.get(p)) break;
            int temp = data.get(i);
            data.set(i, data.get(p));
            data.set(p, temp);
            i = p;
        }
    }

    public void push(int val) {
        data.add(val);
        siftUp(data.size() - 1);
    }
}`,
          python: `class MinHeap:
    def __init__(self):
        self.data: list[int] = []

    def _sift_up(self, i: int) -> None:
        while i > 0:
            p = (i - 1) // 2
            if self.data[i] >= self.data[p]:
                break
            self.data[i], self.data[p] = self.data[p], self.data[i]
            i = p

    def push(self, val: int) -> None:
        self.data.append(val)
        self._sift_up(len(self.data) - 1)`,
        },
      },
      { kind: 'heading', text: 'Insertion performance' },
      {
        kind: 'table',
        headers: ['Scenario', 'Time Complexity', 'Space Complexity', 'Description'],
        rows: [
          ['Best-case insertion', 'O(1)', 'O(1)', 'New element is greater than or equal to parent; 0 swaps'],
          ['Worst-case insertion', 'O(log n)', 'O(1)', 'New element is global minimum and travels to index 0'],
          ['Average-case insertion', 'O(1)', 'O(1)', 'Most nodes reside in lowest levels; updates settle quickly'],
          ['push(val) overall', 'O(log n)', 'O(1) amortised', 'Append to dynamic array plus upward sift traversal'],
        ],
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Swapping values versus shifting positions',
        body: 'Performing a swap at every level requires three memory writes: storing one value into a temporary variable, copying the other, and writing the temporary value back. You can optimise sift up by storing the inserted value in a local variable, shifting parent values down into child positions while traversing upward, and writing the inserted value into its final position once the loop terminates.',
      },
    ],
    keyTakeaways: [
      'New elements are always appended to the array end to maintain the complete binary tree structure.',
      'Sift up moves an element upward by repeatedly comparing and swapping it with its parent.',
      'The upward path has length bounded by tree height, guaranteeing worst-case O(log n) insertion time.',
      'Average-case insertion takes O(1) time because the majority of nodes reside at the lowest tree levels.',
    ],
    practice: {
      prompt: 'Modify the sift-up implementation to eliminate full element swaps: store the inserted element in a local variable, shift parent values down during the upward traversal, and place the value into its final index once.',
    },
  },

  // =========================================================================
  // Lesson 3: Sift down
  // =========================================================================
  {
    sub: 3,
    summary: 'Extract the root element and restore heap order in O(log n) time by moving the replacement value downward.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'The primary purpose of a priority queue is to retrieve and remove the element with the highest priority (the minimum in a min-heap, located at index 0). Removing index 0 directly would leave an empty slot at the root and break contiguous array storage. To avoid shifting remaining elements leftward in O(n) time, we overwrite the root with the last element in the array (`data[n - 1]`), delete the last element in O(1) time, and then restore the heap invariant from the root downward.',
      },
      { kind: 'heading', text: 'The sift-down mechanism' },
      {
        kind: 'text',
        body: 'The replacement element at index 0 was previously a leaf, so it is typically larger than its new children. The **sift down** operation (also known as bubble-down or sink) walks this value down to a valid position. At each node `i`, we examine the left child `2 * i + 1` and right child `2 * i + 2`. If at least one child exists and is smaller than `data[i]`, we swap `data[i]` with the **smaller** child. Swapping with the smaller child ensures that the smaller value becomes the new parent, satisfying the min-heap property for both branches.',
      },
      {
        kind: 'code',
        caption: 'Extract-min operation using sift down',
        code: {
          cpp: `#include <vector>
#include <utility>
using namespace std;

class MinHeap {
    vector<int> data;

    void siftDown(int i) {
        int n = data.size();
        while (true) {
            int smallest = i, l = 2 * i + 1, r = 2 * i + 2;
            if (l < n && data[l] < data[smallest]) smallest = l;
            if (r < n && data[r] < data[smallest]) smallest = r;
            if (smallest == i) break;
            swap(data[i], data[smallest]);
            i = smallest;
        }
    }

public:
    int pop() {
        int rootVal = data[0];
        data[0] = data.back();
        data.pop_back();
        if (!data.empty()) siftDown(0);
        return rootVal;
    }
};`,
          java: `import java.util.ArrayList;

public class MinHeap {
    private ArrayList<Integer> data = new ArrayList<>();

    private void siftDown(int i) {
        int n = data.size();
        while (true) {
            int smallest = i, l = 2 * i + 1, r = 2 * i + 2;
            if (l < n && data.get(l) < data.get(smallest)) smallest = l;
            if (r < n && data.get(r) < data.get(smallest)) smallest = r;
            if (smallest == i) break;
            int temp = data.get(i);
            data.set(i, data.get(smallest));
            data.set(smallest, temp);
            i = smallest;
        }
    }

    public int pop() {
        int rootVal = data.get(0);
        int lastVal = data.remove(data.size() - 1);
        if (!data.isEmpty()) {
            data.set(0, lastVal);
            siftDown(0);
        }
        return rootVal;
    }
}`,
          python: `class MinHeap:
    def __init__(self):
        self.data: list[int] = []

    def _sift_down(self, i: int) -> None:
        n = len(self.data)
        while True:
            smallest, l, r = i, 2 * i + 1, 2 * i + 2
            if l < n and self.data[l] < self.data[smallest]:
                smallest = l
            if r < n and self.data[r] < self.data[smallest]:
                smallest = r
            if smallest == i:
                break
            self.data[i], self.data[smallest] = self.data[smallest], self.data[i]
            i = smallest

    def pop(self) -> int:
        root_val = self.data[0]
        last_val = self.data.pop()
        if self.data:
            self.data[0] = last_val
            self._sift_down(0)
        return root_val`,
        },
      },
      { kind: 'heading', text: 'Extraction complexity' },
      {
        kind: 'table',
        headers: ['Operation', 'Time Complexity', 'Space Complexity', 'Description'],
        rows: [
          ['peek()', 'O(1)', 'O(1)', 'Inspect root element at index 0 without removal'],
          ['Best-case sift down', 'O(1)', 'O(1)', 'Replacement value is already smaller than both children'],
          ['Worst-case sift down', 'O(log n)', 'O(1)', 'Replacement value travels full height to a leaf'],
          ['pop() overall', 'O(log n)', 'O(1)', 'Swap root with back, pop back in O(1), sift down root'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Always swap with the smaller child in a min-heap',
        body: 'When sifting down in a min-heap, swapping with the larger child when both children are smaller than the parent creates an immediate violation: the larger child becomes the parent of the smaller child, breaking the heap invariant. You must evaluate both child candidates and strictly swap with whichever child holds the minimum value.',
      },
    ],
    keyTakeaways: [
      'To remove the root, overwrite it with the final array element and remove the last index in O(1).',
      'Sift down must swap the parent with its smaller child in a min-heap to preserve valid subtrees.',
      'Sifting down terminates when the node is smaller than both children or has reached a leaf index.',
      'Both push and pop guarantee O(log n) worst-case time complexity, providing predictable performance.',
    ],
    practice: {
      prompt: 'Implement a heap method `replace(val)` that writes a new value directly into the root at index 0 and sifts down in a single pass, avoiding the overhead of separate pop() and push() invocations.',
    },
  },

  // =========================================================================
  // Lesson 4: Build-heap in O(n)
  // =========================================================================
  {
    sub: 4,
    summary: 'Transform an arbitrary array into a valid heap in linear O(n) time using Floyd’s bottom-up sift-down algorithm.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Given an unsorted array of `n` items, one way to build a heap is to start with an empty collection and insert elements sequentially using `push`. Because each insertion takes O(log n) worst-case time, inserting `n` elements consumes `O(n log n)` total time. However, Robert Floyd discovered an algorithm that constructs a valid heap in-place in strictly **O(n)** time.',
      },
      { kind: 'heading', text: 'Floyd’s bottom-up heap construction' },
      {
        kind: 'text',
        body: 'Floyd’s algorithm treats the raw array directly as a complete binary tree. Instead of inserting new elements, it fixes existing subtrees from the bottom upward using **sift down**. Leaf nodes already satisfy the heap property because they have no children. In a zero-indexed array, elements from index `n / 2` to `n - 1` are leaves. Floyd’s algorithm starts at the last non-leaf node at index `(n - 2) / 2` and loops backward to index 0, running `siftDown` at each step.',
      },
      {
        kind: 'code',
        caption: 'In-place linear-time build heap',
        code: {
          cpp: `#include <vector>
#include <utility>
using namespace std;

void siftDown(vector<int>& arr, int n, int i) {
    while (true) {
        int smallest = i, l = 2 * i + 1, r = 2 * i + 2;
        if (l < n && arr[l] < arr[smallest]) smallest = l;
        if (r < n && arr[r] < arr[smallest]) smallest = r;
        if (smallest == i) break;
        swap(arr[i], arr[smallest]);
        i = smallest;
    }
}

void buildMinHeap(vector<int>& arr) {
    int n = arr.size();
    for (int i = (n - 2) / 2; i >= 0; i--) {
        siftDown(arr, n, i);
    }
}`,
          java: `public class HeapBuilder {
    private static void siftDown(int[] arr, int n, int i) {
        while (true) {
            int smallest = i, l = 2 * i + 1, r = 2 * i + 2;
            if (l < n && arr[l] < arr[smallest]) smallest = l;
            if (r < n && arr[r] < arr[smallest]) smallest = r;
            if (smallest == i) break;
            int temp = arr[i];
            arr[i] = arr[smallest];
            arr[smallest] = temp;
            i = smallest;
        }
    }

    public static void buildMinHeap(int[] arr) {
        int n = arr.length;
        for (int i = (n - 2) / 2; i >= 0; i--) {
            siftDown(arr, n, i);
        }
    }
}`,
          python: `def sift_down(arr: list[int], n: int, i: int) -> None:
    while True:
        smallest, l, r = i, 2 * i + 1, 2 * i + 2
        if l < n and arr[l] < arr[smallest]:
            smallest = l
        if r < n and arr[r] < arr[smallest]:
            smallest = r
        if smallest == i:
            break
        arr[i], arr[smallest] = arr[smallest], arr[i]
        i = smallest

def build_min_heap(arr: list[int]) -> None:
    n = len(arr)
    for i in range((n - 2) // 2, -1, -1):
        sift_down(arr, n, i)`,
        },
      },
      { kind: 'heading', text: 'Why bottom-up sift down runs in O(n)' },
      {
        kind: 'text',
        body: 'The proof relies on how nodes are distributed across tree heights. Roughly `n / 2` nodes are leaves at height 0, requiring 0 work. Roughly `n / 4` nodes sit at height 1, requiring at most 1 sift-down step. Only 1 node (the root) sits at height `h = log2(n)`. The total work is proportional to the sum of `h / 2^h`, which converges to a constant upper bound of 2. Multiplying by `n` yields strictly O(n) operations. In contrast, repeated insertion does `log2(n)` work on the bottom `n / 2` nodes, which costs `O(n log n)`.',
      },
      {
        kind: 'table',
        headers: ['Method', 'Operation Used', 'Time Complexity', 'Auxiliary Space', 'Work Distribution'],
        rows: [
          ['Top-down insertion', 'Repeated push() with sift-up', 'O(n log n)', 'O(1) in-place', 'n / 2 leaves each travel up to log n levels'],
          ['Floyd bottom-up', 'Reverse sift-down from (n-2)/2', 'O(n)', 'O(1) in-place', 'n / 2 leaves do 0 work; only 1 root travels log n'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Skipping leaf nodes in bottom-up construction',
        body: 'Starting the backward loop at `n - 1` is functionally correct but does unnecessary work checking children of leaf nodes that do not exist. Starting strictly at `(n - 2) / 2` skips the entire leaf half of the array without performing redundant child boundary checks.',
      },
    ],
    keyTakeaways: [
      'Floyd’s bottom-up algorithm constructs a valid heap in O(n) linear time rather than O(n log n).',
      'The linear bound is achieved because the majority of nodes reside near the bottom where height is minimal.',
      'Leaf nodes start at index n / 2 and require zero sift-down work.',
      'Iterating backward from index `(n - 2) / 2` down to 0 guarantees that every sub-heap is valid before its parent is processed.',
    ],
    practice: {
      prompt: 'Write an in-place buildMaxHeap function that converts an arbitrary array into a max-heap in O(n) time. Test it on an inverted array [1, 2, 3, 4, 5, 6, 7] and confirm that every parent is greater than or equal to its children.',
    },
  },

  // =========================================================================
  // Lesson 5: Heap sort
  // =========================================================================
  {
    sub: 5,
    summary: 'Sort an array in-place in O(n log n) time and O(1) space by building a max-heap and repeatedly moving maximums to the back.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: '**Heap sort** is an in-place sorting algorithm with guaranteed `O(n log n)` worst-case time complexity and `O(1)` auxiliary space. It converts the array into a **max-heap**, then repeatedly moves the maximum element to the back of the array while shrinking the active heap range.',
      },
      { kind: 'heading', text: 'Why ascending sort requires a max-heap' },
      {
        kind: 'text',
        body: 'A common mistake is attempting to sort in ascending order with a min-heap. Extracting the minimum element yields the smallest value, but placing it at index 0 would overwrite active heap data, requiring a second array. With a **max-heap**, the root contains the maximum element. Swapping the root with the element at index `end` places the largest element in its permanent sorted location. Decreasing `end` and sifting down index 0 within `[0, end)` leaves the array sorted in ascending order with zero extra memory.',
      },
      {
        kind: 'code',
        caption: 'In-place heap sort implementation',
        code: {
          cpp: `#include <vector>
#include <utility>
using namespace std;

void siftDownMax(vector<int>& arr, int n, int i) {
    while (true) {
        int largest = i, l = 2 * i + 1, r = 2 * i + 2;
        if (l < n && arr[l] > arr[largest]) largest = l;
        if (r < n && arr[r] > arr[largest]) largest = r;
        if (largest == i) break;
        swap(arr[i], arr[largest]);
        i = largest;
    }
}

void heapSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = (n - 2) / 2; i >= 0; i--) {
        siftDownMax(arr, n, i);
    }
    for (int end = n - 1; end > 0; end--) {
        swap(arr[0], arr[end]);
        siftDownMax(arr, end, 0);
    }
}`,
          java: `public class HeapSort {
    private static void siftDownMax(int[] arr, int n, int i) {
        while (true) {
            int largest = i, l = 2 * i + 1, r = 2 * i + 2;
            if (l < n && arr[l] > arr[largest]) largest = l;
            if (r < n && arr[r] > arr[largest]) largest = r;
            if (largest == i) break;
            int temp = arr[i];
            arr[i] = arr[largest];
            arr[largest] = temp;
            i = largest;
        }
    }

    public static void heapSort(int[] arr) {
        int n = arr.length;
        for (int i = (n - 2) / 2; i >= 0; i--) {
            siftDownMax(arr, n, i);
        }
        for (int end = n - 1; end > 0; end--) {
            int temp = arr[0];
            arr[0] = arr[end];
            arr[end] = temp;
            siftDownMax(arr, end, 0);
        }
    }
}`,
          python: `def sift_down_max(arr: list[int], n: int, i: int) -> None:
    while True:
        largest, l, r = i, 2 * i + 1, 2 * i + 2
        if l < n and arr[l] > arr[largest]:
            largest = l
        if r < n and arr[r] > arr[largest]:
            largest = r
        if largest == i:
            break
        arr[i], arr[largest] = arr[largest], arr[i]
        i = largest

def heap_sort(arr: list[int]) -> None:
    n = len(arr)
    for i in range((n - 2) // 2, -1, -1):
        sift_down_max(arr, n, i)
    for end in range(n - 1, 0, -1):
        arr[0], arr[end] = arr[end], arr[0]
        sift_down_max(arr, end, 0)`,
        },
      },
      { kind: 'heading', text: 'Algorithm comparison' },
      {
        kind: 'table',
        headers: ['Algorithm', 'Best Time', 'Average Time', 'Worst Time', 'Auxiliary Space', 'Stable?'],
        rows: [
          ['Heap Sort', 'O(n log n)', 'O(n log n)', 'O(n log n)', 'O(1)', 'No'],
          ['Merge Sort', 'O(n log n)', 'O(n log n)', 'O(n log n)', 'O(n)', 'Yes'],
          ['Quick Sort', 'O(n log n)', 'O(n log n)', 'O(n^2)', 'O(log n)', 'No'],
        ],
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Heap sort instability and cache locality trade-offs',
        body: 'Heap sort is not a **stable sort**: swapping the root with the element at index `end` moves identical values across large distances, destroying their original relative order. Furthermore, because sift down repeatedly doubles indices (`2 * i + 1`), memory accesses jump across cache lines rather than scanning contiguous blocks, causing more CPU cache misses than Quick Sort in practice.',
      },
    ],
    keyTakeaways: [
      'Heap sort sorts in-place using O(1) auxiliary memory and guarantees O(n log n) worst-case time.',
      'An ascending sort requires a max-heap so each extracted maximum lands at the shrinking rear boundary.',
      'Phase 1 builds a max-heap in O(n); Phase 2 performs n - 1 extractions each costing O(log n).',
      'Heap sort is unstable and exhibits higher CPU cache misses compared to Quick Sort.',
    ],
    practice: {
      prompt: 'Sort an integer array in ascending order using in-place heap sort without allocating additional arrays or calling built-in sort functions.',
      leetcode: { title: 'Sort an Array', slug: 'sort-an-array' },
    },
  },

  // =========================================================================
  // Lesson 6: Kth largest with a size-k heap
  // =========================================================================
  {
    sub: 6,
    summary: 'Find the kth largest element in an unsorted stream or array in O(n log k) time using a fixed-size min-heap.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A standard interview problem asks for the **kth largest element** in an unsorted collection. Sorting the entire array requires `O(n log n)` time. When `n` is large or when values arrive continuously in an infinite data stream, sorting the full dataset is impossible. By maintaining a **min-heap bounded to size k**, we can solve this problem in `O(n log k)` time and `O(k)` space.',
      },
      { kind: 'heading', text: 'The size-k min-heap invariant' },
      {
        kind: 'text',
        body: 'To find the kth *largest* element, we maintain a *min-heap*. The min-heap holds the `k` largest elements seen so far. Because it is a min-heap, the smallest among these `k` largest items sits at index 0 (`peek()`). For each incoming value `x`: if the heap holds fewer than `k` items, we push `x`. If the heap holds `k` items and `x > heap.peek()`, `x` belongs in the top `k`, so we pop the root and push `x`. If `x <= heap.peek()`, `x` cannot be in the top `k` and is discarded. After processing all elements, `heap.peek()` is the kth largest element.',
      },
      {
        kind: 'code',
        caption: 'Kth largest element via size-k min-heap',
        code: {
          cpp: `#include <vector>
#include <queue>
using namespace std;

int findKthLargest(vector<int>& nums, int k) {
    priority_queue<int, vector<int>, greater<int>> minHeap;
    for (int num : nums) {
        if (minHeap.size() < (size_t)k) {
            minHeap.push(num);
        } else if (num > minHeap.top()) {
            minHeap.pop();
            minHeap.push(num);
        }
    }
    return minHeap.top();
}`,
          java: `import java.util.PriorityQueue;

public class Solution {
    public int findKthLargest(int[] nums, int k) {
        PriorityQueue<Integer> minHeap = new PriorityQueue<>(k);
        for (int num : nums) {
            if (minHeap.size() < k) {
                minHeap.offer(num);
            } else if (num > minHeap.peek()) {
                minHeap.poll();
                minHeap.offer(num);
            }
        }
        return minHeap.peek();
    }
}`,
          python: `import heapq

def find_kth_largest(nums: list[int], k: int) -> int:
    min_heap: list[int] = []
    for num in nums:
        if len(min_heap) < k:
            heapq.heappush(min_heap, num)
        elif num > min_heap[0]:
            heapq.heapreplace(min_heap, num)
    return min_heap[0]`,
        },
      },
      { kind: 'heading', text: 'Approaches to finding kth largest' },
      {
        kind: 'table',
        headers: ['Approach', 'Time Complexity', 'Auxiliary Space', 'Streaming Capable?', 'Key Characteristic'],
        rows: [
          ['Full sort', 'O(n log n)', 'O(1) to O(n)', 'No', 'Requires entire array upfront before processing'],
          ['Max-heap of size n', 'O(n + k log n)', 'O(n)', 'No', 'Build-heap in O(n), followed by k extractions'],
          ['Min-heap of size k', 'O(n log k)', 'O(k)', 'Yes', 'Maintains running top-k window; ideal when k << n'],
          ['Quickselect', 'O(n) avg, O(n^2) worst', 'O(1) in-place', 'No', 'Fastest offline average time, but mutates input'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Discarding candidates before heap mutation',
        body: 'Checking `num > minHeap.top()` before performing a push or pop operation avoids unnecessary heap modifications. If the incoming value is smaller than or equal to the current kth largest element, discarding it takes O(1) time without triggering an O(log k) sift operation.',
      },
    ],
    keyTakeaways: [
      'A min-heap of size k retains the k largest values; its root is the kth largest value overall.',
      'Using a size-k heap bounds memory to O(k) and runtime to O(n log k), outperforming full sorting when k << n.',
      'Streaming inputs can be processed in real time without storing earlier discarded elements.',
      { cpp: 'Replacing the root is a pop followed by a push; together they cost O(log k).', java: 'Replacing the root is a poll followed by an offer; together they cost O(log k).', python: 'In Python, heapq.heapreplace pops the root and inserts the new value in a single O(log k) pass.' },
    ],
    practice: {
      prompt: 'Given an integer array nums and an integer k, return the kth largest element in the array using a min-heap bounded to size k.',
      leetcode: { title: 'Kth Largest Element in an Array', slug: 'kth-largest-element-in-an-array' },
    },
  },

  // =========================================================================
  // Lesson 7: Custom priority: pairs and objects
  // =========================================================================
  {
    sub: 7,
    summary: 'Define custom comparators to order tuples, pairs, and objects in priority queues across languages.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Algorithmic tasks frequently require prioritizing composite structures: points ordered by distance to origin, graph edges ordered by weight, or words ordered by frequency with alphabetical tie-breaking. Standard library priority queues require custom comparators to establish order over these objects. Understanding how each language defines priority direction prevents inverted heap bugs.',
      },
      { kind: 'heading', text: 'Language comparator semantics' },
      {
        kind: 'text',
        body: 'In C++, `std::priority_queue` defaults to a max-heap via `std::less`. Passing a custom struct with `bool operator()(const T& a, const T& b)` creates a min-heap when returning `a.val > b.val` (returning true means `a` has lower priority than `b`). In Java, `PriorityQueue` defaults to a min-heap via natural order. Passing `(a, b) -> Integer.compare(a.val, b.val)` orders elements ascending. In Python, `heapq` always provides a min-heap, comparing elements by their first tuple entry and breaking ties with subsequent entries.',
      },
      {
        kind: 'code',
        caption: 'K closest points to origin using bounded max-heap',
        code: {
          cpp: `#include <vector>
#include <queue>
using namespace std;

struct Point {
    int x, y;
    int distSq() const { return x * x + y * y; }
};

struct ComparePoint {
    bool operator()(const Point& a, const Point& b) const {
        return a.distSq() < b.distSq();
    }
};

vector<vector<int>> kClosest(vector<vector<int>>& points, int k) {
    priority_queue<Point, vector<Point>, ComparePoint> maxHeap;
    for (const auto& p : points) {
        maxHeap.push({p[0], p[1]});
        if (maxHeap.size() > (size_t)k) maxHeap.pop();
    }
    vector<vector<int>> result;
    while (!maxHeap.empty()) {
        result.push_back({maxHeap.top().x, maxHeap.top().y});
        maxHeap.pop();
    }
    return result;
}`,
          java: `import java.util.PriorityQueue;

public class Solution {
    public int[][] kClosest(int[][] points, int k) {
        PriorityQueue<int[]> maxHeap = new PriorityQueue<>(
            (a, b) -> Integer.compare(b[0] * b[0] + b[1] * b[1], a[0] * a[0] + a[1] * a[1])
        );
        for (int[] p : points) {
            maxHeap.offer(p);
            if (maxHeap.size() > k) maxHeap.poll();
        }
        int[][] result = new int[k][2];
        for (int i = 0; i < k; i++) {
            result[i] = maxHeap.poll();
        }
        return result;
    }
}`,
          python: `import heapq

def k_closest(points: list[list[int]], k: int) -> list[list[int]]:
    heap: list[tuple[int, list[int]]] = []
    for x, y in points:
        dist_sq = x * x + y * y
        heapq.heappush(heap, (-dist_sq, [x, y]))
        if len(heap) > k:
            heapq.heappop(heap)
    return [pt for (_, pt) in heap]`,
        },
      },
      { kind: 'heading', text: 'Standard library priority queue comparison' },
      {
        kind: 'table',
        headers: ['Language', 'Default Queue Type', 'Comparator Direction for Min-Heap', 'Tie-Breaking Rule'],
        rows: [
          ['C++', 'Max-heap (std::less)', 'operator() returning a.val > b.val', 'Equal keys compared by subsequent struct fields'],
          ['Java', 'Min-heap (natural order)', '(a, b) -> Integer.compare(a.val, b.val)', 'Comparator must return 0 or evaluate secondary field'],
          ['Python', 'Min-heap (heapq module)', 'Natural order on first tuple element', 'Compares second tuple element if first is equal'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: { cpp: 'Ties fall through to the second field', java: 'Ties fall through to the second field', python: 'Tuple comparison crashes on uncomparable objects' },
        body: { cpp: 'When two `pair`s share the same priority, `operator<` compares the second element. For a `pair<int, Node*>` that compares pointer values, which compiles but gives an arbitrary order; for a struct without `operator<` it does not compile at all. Give the struct a comparator, or add a unique counter as the second field: `tuple<int, int, Node*>`.', java: 'When two entries share the same priority, the comparator decides the order. `Comparator.comparingInt(x -> x[0])` never looks at the payload, which is what you want. If you add a tie-break, make it a numeric field or a unique counter, never an object without a natural order.', python: 'When storing `(priority, object)` tuples, if two entries share the exact same priority value, the second tuple element is compared using `object_a < object_b`. If the object does not implement `__lt__`, a runtime `TypeError` is raised. To avoid this, insert a unique tie-breaker counter as the middle element: `(priority, count, object)`.' },
      },
    ],
    keyTakeaways: [
      'C++ priority_queue defaults to a max-heap; Java PriorityQueue and Python heapq default to min-heaps.',
      { cpp: 'A custom comparator returns `a > b` to place smaller elements at the top, the opposite sense from std::sort.', java: 'A comparator such as `(a, b) -> Integer.compare(b, a)` or `Collections.reverseOrder()` turns the min-heap into a max-heap.', python: 'There is no comparator parameter; wrap each item so that the natural tuple order is the priority you want.' },
      { cpp: 'Store `pair<int, T>` with the priority first; negate the priority, or use `greater<>`, to flip the order.', java: 'Store `int[]` or a small record with the priority first and compare on it; negate the priority to simulate a max-heap with a min-heap.', python: 'Storing `(priority, item)` tuples orders by priority; use negative numbers to simulate a max-heap.' },
      'Include an explicit tie-breaker in tuples to prevent runtime comparison errors when priorities collide.',
    ],
    practice: {
      prompt: 'Given an array of points where points[i] = [xi, yi] represents a point on the X-Y plane and an integer k, return the k closest points to the origin (0, 0) using a bounded max-heap of size k.',
      leetcode: { title: 'K Closest Points to Origin', slug: 'k-closest-points-to-origin' },
    },
  },

  // =========================================================================
  // Lesson 8: Two-heap median trick
  // =========================================================================
  {
    sub: 8,
    summary: 'Maintain the running median of a data stream in O(log n) insertion and O(1) query time using balanced max and min heaps.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'The **running median** problem requires reporting the median of a dynamically growing number stream after each insertion. Sorting an array on each query requires `O(n log n)` time. Maintaining a sorted array via insertion sort requires `O(n)` time per insertion to shift elements. The **two-heap technique** solves both requirements simultaneously: inserting a new number takes `O(log n)` time and querying the median takes `O(1)` time.',
      },
      { kind: 'heading', text: 'Partitioning numbers into two balanced heaps' },
      {
        kind: 'text',
        body: 'The median divides an ordered sequence into two equal halves. We represent this division with two heaps: the lower half is stored in a **max-heap** (`small`), and the upper half is stored in a **min-heap** (`large`). Two invariants are maintained: first, the **order invariant**, requiring every element in `small` to be less than or equal to every element in `large` (`small.peek() <= large.peek()`). Second, the **size invariant**, requiring the count in `small` to equal that in `large`, or exceed it by exactly 1. When querying: if total count is odd, `small.peek()` is the median. If even, the median is `(small.peek() + large.peek()) / 2.0`.',
      },
      {
        kind: 'code',
        caption: 'Two-heap MedianFinder implementation',
        code: {
          cpp: `#include <queue>
#include <vector>
using namespace std;

class MedianFinder {
    priority_queue<int> small; // max-heap
    priority_queue<int, vector<int>, greater<int>> large; // min-heap

public:
    void addNum(int num) {
        small.push(num);
        large.push(small.top());
        small.pop();

        if (small.size() < large.size()) {
            small.push(large.top());
            large.pop();
        }
    }

    double findMedian() {
        if (small.size() > large.size()) return small.top();
        return ((double)small.top() + large.top()) / 2.0;
    }
};`,
          java: `import java.util.PriorityQueue;
import java.util.Collections;

public class MedianFinder {
    private PriorityQueue<Integer> small = new PriorityQueue<>(Collections.reverseOrder());
    private PriorityQueue<Integer> large = new PriorityQueue<>();

    public void addNum(int num) {
        small.offer(num);
        large.offer(small.poll());
        if (small.size() < large.size()) {
            small.offer(large.poll());
        }
    }

    public double findMedian() {
        if (small.size() > large.size()) return small.peek();
        return ((double) small.peek() + large.peek()) / 2.0;
    }
}`,
          python: `import heapq

class MedianFinder:
    def __init__(self):
        self.small: list[int] = []  # max-heap (negated)
        self.large: list[int] = []  # min-heap

    def add_num(self, num: int) -> None:
        heapq.heappush(self.small, -num)
        largest_small = -heapq.heappop(self.small)
        heapq.heappush(self.large, largest_small)

        if len(self.small) < len(self.large):
            heapq.heappush(self.small, -heapq.heappop(self.large))

    def find_median(self) -> float:
        if len(self.small) > len(self.large):
            return float(-self.small[0])
        return (-self.small[0] + self.large[0]) / 2.0`,
        },
      },
      { kind: 'heading', text: 'Streaming median complexity' },
      {
        kind: 'table',
        headers: ['Approach', 'addNum() Time', 'findMedian() Time', 'Auxiliary Space', 'Trade-off'],
        rows: [
          ['Two Heaps (Balanced)', 'O(log n)', 'O(1)', 'O(n)', 'Optimal streaming balance; fast inserts and instant queries'],
          ['Sorted Array (Insertion Sort)', 'O(n)', 'O(1)', 'O(n)', 'Costly linear element shifts on every new arrival'],
          ['Unsorted Array + Quickselect', 'O(1)', 'O(n) avg', 'O(n)', 'Fast insertions but sluggish queries on demand'],
          ['Balanced BST (with counts)', 'O(log n)', 'O(log n)', 'O(n)', 'Higher implementation complexity and pointer memory overhead'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Integer overflow when averaging even-length medians',
        body: 'In languages with fixed-width integer types such as C++ and Java, calculating `(small.top() + large.top()) / 2.0` can overflow a 32-bit signed integer if both values are large positive integers. Always cast at least one operand to `double` before performing the addition: `((double)small.top() + large.top()) / 2.0`.',
      },
    ],
    keyTakeaways: [
      'The two-heap pattern divides data into a lower half max-heap and an upper half min-heap.',
      'Enforcing size balance guarantees that the median sits directly at one or both heap tops.',
      'Adding a number takes O(log n) time while retrieving the current median takes O(1) time.',
      'Cast operands to floating-point types before addition to prevent integer overflow on large stream values.',
    ],
    practice: {
      prompt: 'Implement the MedianFinder class that records numbers from a continuous stream and returns the running median in O(1) time.',
      leetcode: { title: 'Find Median from Data Stream', slug: 'find-median-from-data-stream' },
    },
  },
];
