import type { SharedLesson } from './types';

/**
 * Sorting from Scratch — Master fundamental and advanced sorting algorithms,
 * stability, custom comparators, and production standard library implementations.
 */
export const lessons: SharedLesson[] = [
  // =========================================================================
  // Lesson 1: Why sorting is the first thing to try
  // =========================================================================
  {
    sub: 1,
    summary: 'Recognise problem patterns where arranging data in order reduces time complexity from brute force to O(n log n).',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'An unsorted collection forces an algorithm to inspect every location. When searching an unsorted array for duplicates, you must compare each element against every other element, taking quadratic time. Once the array is arranged in ascending order, duplicate values sit directly next to each other, reducing the search to a single linear pass.',
      },
      { kind: 'heading', text: 'Algorithmic advantages of sorted data' },
      {
        kind: 'text',
        body: 'Sorting transforms unstructured input into an ordered sequence where multiple foundational techniques become possible. Binary search requires sorted order to discard half the search space at each step. Two-pointer techniques rely on monotonicity to move pointers inward from opposing boundaries. Greedy strategies succeed because the smallest or largest candidate is immediately available at an array boundary.',
      },
      {
        kind: 'code',
        caption: 'Duplicate detection: O(n log n) sorting replaces O(n²) pairwise search',
        code: {
          cpp: `bool hasDuplicate(vector<int>& nums) {
    sort(nums.begin(), nums.end());
    for (size_t i = 1; i < nums.size(); i++) {
        if (nums[i] == nums[i - 1]) return true;
    }
    return false;
}`,
          java: `public boolean hasDuplicate(int[] nums) {
    Arrays.sort(nums);
    for (int i = 1; i < nums.length; i++) {
        if (nums[i] == nums[i - 1]) return true;
    }
    return false;
}`,
          python: `def has_duplicate(nums: list[int]) -> bool:
    nums.sort()
    for i in range(1, len(nums)):
        if nums[i] == nums[i - 1]:
            return True
    return False`,
        },
      },
      { kind: 'heading', text: 'Complexity before and after sorting' },
      {
        kind: 'table',
        headers: ['Problem Pattern', 'Unsorted Cost', 'Sorted Cost', 'Primary Benefit'],
        rows: [
          ['Duplicate detection', 'O(n^2) pairwise check', 'O(n log n) sort + O(n) scan', 'Duplicates become adjacent without extra hash memory'],
          ['Pair target sum', 'O(n^2) nested loops', 'O(n log n) sort + O(n) two-pointer', 'Opposite-end pointer movement replaces nested scans'],
          ['Repeated search queries', 'O(n) per query', 'O(n log n) sort + O(log n) binary search', 'Sub-linear lookup time for subsequent queries'],
          ['Interval scheduling', 'O(n!) combinatorial choices', 'O(n log n) sort by endpoint', 'Earliest deadline choice becomes immediate'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Losing original element indices after sorting',
        body: 'Sorting rearranges array elements in place. If a problem requires returning the original indices of elements that satisfy a condition, sorting raw values destroys their starting positions. Store each element alongside its initial index in a pair or struct prior to sorting.',
      },
    ],
    keyTakeaways: [
      'Sorting groups identical and related elements into contiguous neighbouring positions.',
      'An O(n log n) sort followed by an O(n) scan regularly beats an O(n²) nested loop.',
      'Binary search and opposite-end two-pointer algorithms strictly require sorted input.',
      'Preserve original indices before sorting if the problem output requires them.',
    ],
    practice: {
      prompt: 'Write a function that accepts an integer array and determines whether any value appears at least twice, sorting the input to achieve O(n log n) time and O(1) auxiliary space.',
      leetcode: { title: 'Contains Duplicate', slug: 'contains-duplicate' },
    },
  },

  // =========================================================================
  // Lesson 2: Bubble sort
  // =========================================================================
  {
    sub: 2,
    summary: 'Implement bubble sort with an early-exit flag and analyse its quadratic worst-case behaviour.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: '**Bubble sort** is an elementary comparison-based algorithm that iterates through an array, compares neighbouring elements, and swaps them whenever they are out of order. Through successive passes, larger elements migrate toward the end of the array, resembling air bubbles ascending to the surface of water.',
      },
      { kind: 'heading', text: 'Pass mechanics and early termination' },
      {
        kind: 'text',
        body: 'During pass 1 of an array of length n, the largest element is compared across every index until reaching position `n - 1`. During pass 2, the second largest element reaches position `n - 2`. An unoptimised implementation always performs `n - 1` complete passes. Adding a boolean flag to track whether any swap occurred allows the algorithm to terminate early if the array is already sorted.',
      },
      {
        kind: 'code',
        caption: 'Optimised bubble sort with early-exit flag',
        code: {
          cpp: `void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`,
          java: `public void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        boolean swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`,
          python: `def bubble_sort(arr: list[int]) -> None:
    n = len(arr)
    for i in range(n - 1):
        swapped = False
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break`,
        },
      },
      { kind: 'heading', text: 'Performance characteristics' },
      {
        kind: 'table',
        headers: ['Metric', 'Bound', 'Explanation'],
        rows: [
          ['Best time', 'O(n)', 'Pre-sorted array triggers early termination on the first pass'],
          ['Average time', 'O(n^2)', 'Performs approximately n² / 2 comparisons on arbitrary inputs'],
          ['Worst time', 'O(n^2)', 'Reverse-sorted array requires maximum comparisons and swaps'],
          ['Auxiliary space', 'O(1)', 'Operates in place with a single swap variable'],
          ['Stability', 'Stable', 'Preserves arrival order because equal elements are never swapped'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Quadratic timeout on large inputs',
        body: 'When input size n reaches 10⁵, an O(n²) algorithm executes approximately 5 × 10⁹ operations, exceeding standard 1.0-second online judge limits fifty times over. Bubble sort is valuable for learning swap mechanics and stability, but fails on large contest inputs.',
      },
    ],
    keyTakeaways: [
      'Bubble sort repeatedly compares adjacent items and swaps them when misordered.',
      'Each pass guarantees that the next largest remaining value reaches its final index.',
      'Tracking swaps with a boolean flag reduces best-case time complexity to O(n).',
      'The algorithm is stable because strictly greater comparisons never swap equal values.',
    ],
    practice: {
      prompt: 'Implement bubble sort on an array of integers representing colors (values 0, 1, and 2). Track and return the total number of swaps executed during sorting.',
      leetcode: { title: 'Sort Colors', slug: 'sort-colors' },
    },
  },

  // =========================================================================
  // Lesson 3: Selection sort
  // =========================================================================
  {
    sub: 3,
    summary: 'Implement selection sort, understand its minimum-write property, and contrast its fixed quadratic cost with adaptive sorts.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: '**Selection sort** maintains two conceptual partitions within an array: a sorted prefix at the beginning and an unsorted suffix at the end. In each pass, the algorithm inspects the entire unsorted suffix to locate the minimum element, and then performs a single swap with the first element of that unsorted suffix, expanding the sorted prefix by one position.',
      },
      { kind: 'heading', text: 'The selection mechanism' },
      {
        kind: 'text',
        body: 'For an array of length n, an outer loop advances index `i` from 0 to `n - 2`. At the start of iteration `i`, all elements in the prefix `[0 .. i - 1]` are sorted and smaller than or equal to every element in the remaining suffix `[i .. n - 1]`. An inner loop scans from index `i + 1` to `n - 1` to locate the index of the absolute minimum. Once found, one swap places that value at index `i`.',
      },
      {
        kind: 'code',
        caption: 'Selection sort implementation',
        code: {
          cpp: `void selectionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) minIdx = j;
        }
        if (minIdx != i) swap(arr[i], arr[minIdx]);
    }
}`,
          java: `public void selectionSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) minIdx = j;
        }
        if (minIdx != i) {
            int temp = arr[i]; arr[i] = arr[minIdx]; arr[minIdx] = temp;
        }
    }
}`,
          python: `def selection_sort(arr: list[int]) -> None:
    n = len(arr)
    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        if min_idx != i:
            arr[i], arr[min_idx] = arr[min_idx], arr[i]`,
        },
      },
      { kind: 'heading', text: 'Memory writes versus comparison overhead' },
      {
        kind: 'table',
        headers: ['Metric', 'Bound', 'Analysis'],
        rows: [
          ['Best time', 'O(n^2)', 'Scans the full suffix even on already sorted input'],
          ['Average time', 'O(n^2)', 'Unconditionally executes n(n - 1) / 2 comparisons'],
          ['Worst time', 'O(n^2)', 'Comparison count is completely invariant to input order'],
          ['Auxiliary space', 'O(1)', 'Requires an integer variable for tracking the minimum index'],
          ['Memory writes', 'O(n)', 'Executes at most n - 1 swaps in total across the entire sort'],
          ['Stability', 'Unstable', 'Long swaps skip over equal elements and invert relative order'],
        ],
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Selection sort cannot adapt to pre-sorted arrays',
        body: 'Both bubble sort and insertion sort detect sorted data and run in O(n) linear time. Selection sort possesses no mechanism to detect sorted regions; the inner loop executes every comparison regardless of whether the suffix is already in ascending order.',
      },
    ],
    keyTakeaways: [
      'Selection sort locates the minimum value in the unsorted suffix and moves it forward.',
      'It executes at most n - 1 swap operations, providing an advantage when writes are costly.',
      'Comparisons remain strictly O(n²) under all conditions with zero adaptivity.',
      'Long-range swapping renders standard array selection sort unstable.',
    ],
    practice: {
      prompt: 'Implement selection sort to sort an integer array in non-decreasing order, and return all indices where a target integer appears in the sorted result.',
      leetcode: { title: 'Find Target Indices After Sorting Array', slug: 'find-target-indices-after-sorting-array' },
    },
  },

  // =========================================================================
  // Lesson 4: Insertion sort
  // =========================================================================
  {
    sub: 4,
    summary: 'Build insertion sort, understand its adaptive O(n) behaviour on nearly-sorted data, and see why hybrid algorithms use it for small arrays.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: '**Insertion sort** constructs the sorted array incrementally, mimicking how a player arranges a hand of playing cards. You pick up cards one by one from an unsorted deck. For each new card, you scan backwards through the cards held in your hand, shift larger cards one position to the right to create an opening, and insert the new card into its correct location.',
      },
      { kind: 'heading', text: 'The element-shifting mechanism' },
      {
        kind: 'text',
        body: 'An array containing one element at index 0 is sorted by definition. Starting at index `i = 1`, the algorithm copies the current element into a variable called `key`. It then iterates backwards through index `j = i - 1`. For every item where `arr[j] > key`, that item shifts right to `arr[j + 1]`. When reaching an item less than or equal to `key` (or index -1), shifting stops and `key` is written into `arr[j + 1]`.',
      },
      {
        kind: 'code',
        caption: 'Insertion sort using element shifting',
        code: {
          cpp: `void insertionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 1; i < n; i++) {
        int key = arr[i], j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`,
          java: `public void insertionSort(int[] arr) {
    int n = arr.length;
    for (int i = 1; i < n; i++) {
        int key = arr[i], j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`,
          python: `def insertion_sort(arr: list[int]) -> None:
    n = len(arr)
    for i in range(1, n):
        key, j = arr[i], i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key`,
        },
      },
      { kind: 'heading', text: 'Adaptivity and small partition dominance' },
      {
        kind: 'table',
        headers: ['Metric', 'Bound', 'Analysis'],
        rows: [
          ['Best time', 'O(n)', 'Pre-sorted array requires 0 shifts; inner loop condition fails immediately'],
          ['Average time', 'O(n^2)', 'Shifts half the prefix elements on average per insertion'],
          ['Worst time', 'O(n^2)', 'Reverse-sorted array requires shifting the full prefix every time'],
          ['Auxiliary space', 'O(1)', 'Operates in place with a single key variable'],
          ['Stability', 'Stable', 'Equal elements never shift past each other because condition is arr[j] > key'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Shifting beats repeated swapping',
        body: 'A naive implementation repeatedly swaps adjacent elements backwards. Shifting elements rightward and assigning the key value once into the final open slot executes roughly one-third as many memory writes as continuous swapping.',
      },
    ],
    keyTakeaways: [
      'Insertion sort inserts each element into its proper position within an expanding sorted prefix.',
      'On sorted or nearly sorted arrays, it runs in adaptive O(n) linear time.',
      'The algorithm is stable and executes in place with O(1) auxiliary memory.',
      'Standard library sorting implementations use insertion sort to complete small partitions.',
    ],
    practice: {
      prompt: 'Implement insertion sort on an array of integers. Track and return the total number of shift operations performed while placing elements into the sorted prefix.',
      leetcode: { title: 'Insertion Sort List', slug: 'insertion-sort-list' },
    },
  },

  // =========================================================================
  // Lesson 5: Merge sort
  // =========================================================================
  {
    sub: 5,
    summary: 'Implement merge sort using divide and conquer, trace the two-pointer merge step, and understand its guaranteed O(n log n) bound.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: '**Merge sort** is a divide-and-conquer algorithm that guarantees `O(n log n)` time complexity across all input distributions. Rather than comparing elements across the entire array at once, it recursively divides the array into two halves until reaching subarrays of length 0 or 1. Because any single element is sorted, it combines pairs of sorted subarrays into larger sorted sequences using a two-pointer merge procedure.',
      },
      { kind: 'heading', text: 'Divide, conquer, and combine' },
      {
        kind: 'text',
        body: 'The algorithm operates in three distinct phases. First, **Divide**: compute midpoint `mid = left + (right - left) / 2` to split range `[left, right]` into `[left, mid]` and `[mid + 1, right]`. Second, **Conquer**: recursively call merge sort on each half. Third, **Combine**: merge the two sorted halves into an auxiliary buffer using two pointers, and copy the merged sequence back to the original array.',
      },
      {
        kind: 'code',
        caption: 'Merge sort with a pre-allocated auxiliary buffer',
        code: {
          cpp: `void merge(vector<int>& arr, int l, int m, int r, vector<int>& tmp) {
    int i = l, j = m + 1, k = l;
    while (i <= m && j <= r) tmp[k++] = (arr[i] <= arr[j]) ? arr[i++] : arr[j++];
    while (i <= m) tmp[k++] = arr[i++];
    while (j <= r) tmp[k++] = arr[j++];
    for (int p = l; p <= r; p++) arr[p] = tmp[p];
}

void mergeSort(vector<int>& arr, int l, int r, vector<int>& tmp) {
    if (l >= r) return;
    int m = l + (r - l) / 2;
    mergeSort(arr, l, m, tmp);
    mergeSort(arr, m + 1, r, tmp);
    merge(arr, l, m, r, tmp);
}`,
          java: `void merge(int[] arr, int l, int m, int r, int[] tmp) {
    int i = l, j = m + 1, k = l;
    while (i <= m && j <= r) tmp[k++] = (arr[i] <= arr[j]) ? arr[i++] : arr[j++];
    while (i <= m) tmp[k++] = arr[i++];
    while (j <= r) tmp[k++] = arr[j++];
    for (int p = l; p <= r; p++) arr[p] = tmp[p];
}

void mergeSort(int[] arr, int l, int r, int[] tmp) {
    if (l >= r) return;
    int m = l + (r - l) / 2;
    mergeSort(arr, l, m, tmp);
    mergeSort(arr, m + 1, r, tmp);
    merge(arr, l, m, r, tmp);
}`,
          python: `def merge(arr: list[int], l: int, m: int, r: int, tmp: list[int]) -> None:
    i, j, k = l, m + 1, l
    while i <= m and j <= r:
        if arr[i] <= arr[j]:
            tmp[k] = arr[i]; i += 1
        else:
            tmp[k] = arr[j]; j += 1
        k += 1
    while i <= m:
        tmp[k] = arr[i]; i += 1; k += 1
    while j <= r:
        tmp[k] = arr[j]; j += 1; k += 1
    arr[l:r + 1] = tmp[l:r + 1]

def merge_sort(arr: list[int], l: int, r: int, tmp: list[int]) -> None:
    if l >= r:
        return
    m = l + (r - l) // 2
    merge_sort(arr, l, m, tmp)
    merge_sort(arr, m + 1, r, tmp)
    merge(arr, l, m, r, tmp)`,
        },
      },
      { kind: 'heading', text: 'Recurrence analysis: T(n) = 2T(n/2) + O(n)' },
      {
        kind: 'table',
        headers: ['Metric', 'Bound', 'Analysis'],
        rows: [
          ['Best time', 'O(n log n)', 'Recursion depth is log2(n) with linear merge work at every level'],
          ['Average time', 'O(n log n)', 'Identical operation count regardless of initial element ordering'],
          ['Worst time', 'O(n log n)', 'No adversarial input can trigger quadratic degradation'],
          ['Auxiliary space', 'O(n)', 'Requires a temporary array for merging elements'],
          ['Stability', 'Stable', 'Preserves arrival order when ties select left subarray elements (<=)'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Allocating temporary arrays inside recursive calls',
        body: 'Creating a new vector or array buffer inside every recursive invocation of merge triggers thousands of heap allocations and deallocations. Pre-allocate a single auxiliary buffer of length n at the root call and pass it down through recursive helpers.',
      },
    ],
    keyTakeaways: [
      'Merge sort divides an array recursively into halves and merges them with two pointers.',
      'It delivers guaranteed O(n log n) runtime across all input cases without exception.',
      'Selecting items from the left subarray on equal values maintains stability.',
      'Array merge sort requires O(n) auxiliary memory for buffer merging.',
    ],
    practice: {
      prompt: 'Implement merge sort on an integer array in non-decreasing order using a single pre-allocated auxiliary buffer to avoid repeated memory allocations.',
      leetcode: { title: 'Sort an Array', slug: 'sort-an-array' },
    },
  },

  // =========================================================================
  // Lesson 6: Quick sort and partitioning
  // =========================================================================
  {
    sub: 6,
    summary: 'Implement quicksort with in-place partitioning, understand pivot selection strategies, and protect against worst-case quadratic degradation.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: '**Quicksort** is a divide-and-conquer algorithm that operates in reverse order compared to merge sort. Merge sort divides without checking values and performs all work during merging. Quicksort does the heavy lifting upfront during a **partitioning** step: it chooses an element called the **pivot**, rearranges elements so values smaller than or equal to the pivot move left and larger values move right, and then recursively sorts the resulting partitions in place.',
      },
      { kind: 'heading', text: 'In-place partitioning and pivot selection' },
      {
        kind: 'text',
        body: 'In Lomuto partitioning, a pivot is selected and elements are scanned from left to right. A boundary pointer tracks the last position occupied by values less than or equal to the pivot. Selecting the boundary element on pre-sorted data causes worst-case `O(n²)` degradation, because one partition receives 0 elements and the other receives `n - 1`. Selecting the midpoint or a random index distributes elements evenly.',
      },
      {
        kind: 'code',
        caption: 'In-place quicksort with middle-element pivot selection',
        code: {
          cpp: `int partition(vector<int>& arr, int low, int high) {
    int mid = low + (high - low) / 2;
    swap(arr[mid], arr[high]);
    int pivot = arr[high], i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) swap(arr[++i], arr[j]);
    }
    swap(arr[i + 1], arr[high]);
    return i + 1;
}

void quickSort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,
          java: `int partition(int[] arr, int low, int high) {
    int mid = low + (high - low) / 2;
    int temp = arr[mid]; arr[mid] = arr[high]; arr[high] = temp;
    int pivot = arr[high], i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++; int t = arr[i]; arr[i] = arr[j]; arr[j] = t;
        }
    }
    int t = arr[i + 1]; arr[i + 1] = arr[high]; arr[high] = t;
    return i + 1;
}

void quickSort(int[] arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,
          python: `def partition(arr: list[int], low: int, high: int) -> int:
    mid = low + (high - low) // 2
    arr[mid], arr[high] = arr[high], arr[mid]
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1

def quick_sort(arr: list[int], low: int, high: int) -> None:
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)`,
        },
      },
      { kind: 'heading', text: 'Complexity and stack depth' },
      {
        kind: 'table',
        headers: ['Metric', 'Bound', 'Analysis'],
        rows: [
          ['Best time', 'O(n log n)', 'Pivot bisects the subarray into equal partitions at every depth'],
          ['Average time', 'O(n log n)', 'Random or middle pivot choices produce balanced splits'],
          ['Worst time', 'O(n^2)', 'Repeatedly selecting the minimum or maximum element creates n levels'],
          ['Auxiliary space', 'O(log n)', 'Call stack space for recursive calls on balanced partitions'],
          ['Stability', 'Unstable', 'Swapping elements across the pivot alters relative arrival order'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Call stack overflow on pre-sorted input',
        body: 'When pivot selection always picks the boundary element on pre-sorted data of 10⁵ items, recursion depth reaches 10⁵ frames. This triggers a stack overflow crash before any time limit expires. Always swap the middle element or a randomised candidate into the pivot position.',
      },
    ],
    keyTakeaways: [
      'Quicksort partitions the array around a pivot value prior to making recursive calls.',
      'Partitioning happens in place, eliminating the need for an O(n) auxiliary merge buffer.',
      'Middle or randomised pivot selection safeguards against O(n²) worst-case degradation on sorted inputs.',
      'Partition swaps across long distances make standard quicksort unstable.',
    ],
    practice: {
      prompt: 'Implement the quickselect partitioning algorithm to find the kth largest element in an unsorted integer array in O(n) average time without sorting the entire array.',
      leetcode: { title: 'Kth Largest Element in an Array', slug: 'kth-largest-element-in-an-array' },
    },
  },

  // =========================================================================
  // Lesson 7: Counting sort
  // =========================================================================
  {
    sub: 7,
    summary: 'Implement counting sort to achieve linear O(n + k) time on bounded integer inputs and understand the non-comparison sorting model.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Comparison-based sorting algorithms possess a proven mathematical lower bound of **O(n log n)** in the worst case. An array of n distinct elements has `n!` potential permutations. Because each comparison yields 1 bit of information (less than or greater than), distinguishing one permutation among `n!` requires a decision tree depth of at least `log2(n!) ≈ n log2(n)`. **Counting sort** bypasses this limit because it does not compare elements with each other.',
      },
      { kind: 'heading', text: 'The frequency array technique' },
      {
        kind: 'text',
        body: 'Counting sort applies when elements are integers situated within a known bounded range `[min_val, max_val]`. It allocates an auxiliary array of size `k = max_val - min_val + 1` where each index records how many times that specific integer appears in the input. Once counts are recorded, iterating across the frequency array regenerates the elements in ascending order.',
      },
      {
        kind: 'code',
        caption: 'Counting sort supporting negative and positive integer ranges',
        code: {
          cpp: `void countingSort(vector<int>& arr) {
    if (arr.empty()) return;
    int minVal = *min_element(arr.begin(), arr.end());
    int maxVal = *max_element(arr.begin(), arr.end());
    vector<int> count(maxVal - minVal + 1, 0);
    for (int x : arr) count[x - minVal]++;
    int idx = 0;
    for (size_t i = 0; i < count.size(); i++) {
        while (count[i]-- > 0) arr[idx++] = i + minVal;
    }
}`,
          java: `public void countingSort(int[] arr) {
    if (arr.length == 0) return;
    int minVal = arr[0], maxVal = arr[0];
    for (int x : arr) {
        if (x < minVal) minVal = x;
        if (x > maxVal) maxVal = x;
    }
    int[] count = new int[maxVal - minVal + 1];
    for (int x : arr) count[x - minVal]++;
    int idx = 0;
    for (int i = 0; i < count.length; i++) {
        while (count[i]-- > 0) arr[idx++] = i + minVal;
    }
}`,
          python: `def counting_sort(arr: list[int]) -> None:
    if not arr:
        return
    min_val, max_val = min(arr), max(arr)
    count = [0] * (max_val - min_val + 1)
    for x in arr:
        count[x - min_val] += 1
    idx = 0
    for i, c in enumerate(count):
        for _ in range(c):
            arr[idx] = i + min_val
            idx += 1`,
        },
      },
      { kind: 'heading', text: 'Linear speed versus range sensitivity' },
      {
        kind: 'table',
        headers: ['Metric', 'Bound', 'Analysis'],
        rows: [
          ['Time complexity', 'O(n + k)', 'One pass to count frequencies, one pass through the count array'],
          ['Auxiliary space', 'O(k)', 'Requires frequency storage matching the value span max - min + 1'],
          ['Sorting model', 'Non-comparison', 'Directly indexes memory via integer values rather than pairs'],
          ['Input constraints', 'Bounded integers', 'Requires discrete values; cannot index arbitrary floats or strings directly'],
        ],
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Negative numbers require an offset shift',
        body: 'Negative integers cannot be used directly as array indices. Always compute the minimum element first and subtract minVal from each value so that indices map to non-negative positions starting at 0.',
      },
    ],
    keyTakeaways: [
      'Comparison-based sorting has a proven theoretical lower bound of O(n log n).',
      'Counting sort achieves O(n + k) linear time by using integer values directly as array indices.',
      'It requires O(k) extra memory, making it ideal when value range k is comparable to or smaller than n.',
      'Subtracting the minimum element shifts negative values into valid non-negative indices.',
    ],
    practice: {
      prompt: 'Sort an array arr1 such that the relative ordering of elements matches the sequence defined in arr2. For elements not present in arr2, sort them at the end in ascending order using counting sort.',
      leetcode: { title: 'Relative Sort Array', slug: 'relative-sort-array' },
    },
  },

  // =========================================================================
  // Lesson 8: Stability and why it matters
  // =========================================================================
  {
    sub: 8,
    summary: 'Determine whether a sorting algorithm is stable and use stable sorting to sort multi-attribute objects across multiple passes.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A sorting algorithm is defined as **stable** if elements with equivalent comparison keys preserve their original relative order in the sorted output. If two records share identical sort keys and record A appeared before record B in the input, a stable sort guarantees that record A remains ahead of record B in the final array.',
      },
      { kind: 'heading', text: 'Multi-pass sorting using stability' },
      {
        kind: 'text',
        body: 'Consider a table of student records containing Department and Score. To arrange students by Department, and within each department sorted by Score in descending order, a stable sort accomplishes this in two passes. First, sort the entire dataset by the secondary key (Score descending). Next, sort the entire dataset by the primary key (Department ascending) using a **stable** sort. Because the second pass preserves arrival order for identical departments, students inside each department remain sorted by score.',
      },
      {
        kind: 'code',
        caption: 'Multi-key ordering using consecutive stable sorts',
        code: {
          cpp: `struct Student {
    string name;
    string dept;
    int score;
};

void sortStudents(vector<Student>& students) {
    // 1. Sort by secondary key (score descending)
    stable_sort(students.begin(), students.end(), [](const Student& a, const Student& b) {
        return a.score > b.score;
    });
    // 2. Stably sort by primary key (dept ascending)
    stable_sort(students.begin(), students.end(), [](const Student& a, const Student& b) {
        return a.dept < b.dept;
    });
}`,
          java: `class Student {
    String name, dept;
    int score;
}

public void sortStudents(List<Student> students) {
    students.sort((a, b) -> Integer.compare(b.score, a.score));
    students.sort((a, b) -> a.dept.compareTo(b.dept));
}`,
          python: `def sort_students(students: list[dict]) -> None:
    students.sort(key=lambda s: s["score"], reverse=True)
    students.sort(key=lambda s: s["dept"])`,
        },
      },
      { kind: 'heading', text: 'Stability classification across algorithms' },
      {
        kind: 'table',
        headers: ['Algorithm', 'Stable?', 'Primary Structural Reason'],
        rows: [
          ['Merge Sort', 'Stable', 'Ties resolve by taking elements from the left subarray first'],
          ['Insertion Sort', 'Stable', 'Shifts only elements strictly greater than the key'],
          ['Bubble Sort', 'Stable', 'Swaps only when left is strictly greater than right'],
          ['Counting Sort', 'Stable', 'Prefix sum placement from right to left preserves arrival sequence'],
          ['Quick Sort', 'Unstable', 'Long-distance partition swaps reorder equal elements unpredictably'],
          ['Selection Sort', 'Unstable', 'Swapping minimum element backwards jumps over intermediate duplicates'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Assuming default library sorts are always stable',
        body: 'In C++, std::sort uses Introsort and is unstable; using it for multi-pass sorting corrupts earlier passes. Use std::stable_sort when stability is needed. In Java, Arrays.sort on primitive arrays is unstable, whereas Object sorting and Python list.sort are stable TimSort.',
      },
    ],
    keyTakeaways: [
      'A stable sort guarantees that items with equal keys maintain their initial arrival order.',
      'Multi-key ordering can be achieved by sorting from least significant key to most significant key with stable sorts.',
      'Merge sort, insertion sort, and bubble sort are structurally stable.',
      'Quicksort, heapsort, and selection sort are unstable in their standard formulations.',
    ],
    practice: {
      prompt: 'Given a sequence string and an order string defining character precedence, stably rearrange characters so matching characters appear in the custom order while preserving the relative arrival order of characters omitted from order.',
      leetcode: { title: 'Custom Sort String', slug: 'custom-sort-string' },
    },
  },

  // =========================================================================
  // Lesson 9: Custom order and the strict weak ordering rule
  // =========================================================================
  {
    sub: 9,
    summary: 'Write custom comparators that satisfy strict weak ordering and avoid runtime crashes caused by comparison contract violations.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Default library sorting orders elements ascendingly using the `<` operator. Real-world tasks frequently require custom rules: ordering intervals by start time, ordering points by distance from origin, or sorting strings by concatenated magnitude. To support this, languages allow custom **comparators** or key extraction functions.',
      },
      { kind: 'heading', text: 'The strict weak ordering mathematical contract' },
      {
        kind: 'text',
        body: 'Standard library sorting routines require that a comparator function `cmp(a, b)` (which returns true if `a` must precede `b`) obeys the axioms of **strict weak ordering**. First, **Irreflexivity**: `cmp(a, a)` must be false for every value. Second, **Asymmetry**: if `cmp(a, b)` is true, then `cmp(b, a)` must be false. Third, **Transitivity**: if `cmp(a, b)` is true and `cmp(b, c)` is true, then `cmp(a, c)` must also be true.',
      },
      {
        kind: 'code',
        caption: 'Multi-field comparators satisfying strict weak ordering',
        code: {
          cpp: `struct Interval {
    int start, end;
};

void sortIntervals(vector<Interval>& intervals) {
    sort(intervals.begin(), intervals.end(), [](const Interval& a, const Interval& b) {
        if (a.start != b.start) return a.start < b.start;
        return a.end > b.end;
    });
}`,
          java: `class Interval {
    int start, end;
}

public void sortIntervals(List<Interval> intervals) {
    intervals.sort((a, b) -> {
        if (a.start != b.start) return Integer.compare(a.start, b.start);
        return Integer.compare(b.end, a.end);
    });
}`,
          python: `def sort_intervals(intervals: list[list[int]]) -> None:
    intervals.sort(key=lambda x: (x[0], -x[1]))`,
        },
      },
      { kind: 'heading', text: 'The fatal less-than-or-equal trap' },
      {
        kind: 'table',
        headers: ['Contract Property', 'Rule for cmp(a, b)', 'Consequence if Violated'],
        rows: [
          ['Irreflexivity', 'cmp(a, a) == false', 'Pointer runs out of allocated buffer; segmentation fault'],
          ['Asymmetry', 'cmp(a, b) implies !cmp(b, a)', 'Infinite loops during partitioning or corrupted output'],
          ['Transitivity', 'cmp(a, b) and cmp(b, c) imply cmp(a, c)', 'Failed assertion checks and inconsistent item ordering'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Never return true for equal elements in a comparator',
        body: { cpp: 'A comparator must return true only when the first argument strictly precedes the second. When values are equal, return false. Returning true for equal items breaks the strict weak ordering that `sort` assumes, and it can read past the end of the array and crash.', java: 'A comparator must return a negative number only when the first argument strictly precedes the second, and 0 when they are equal. An inconsistent comparator makes TimSort throw "Comparison method violates its general contract".', python: 'A key function sidesteps this: `sort` compares the keys with `<`, which is always consistent. If you use `cmp_to_key`, the function must return 0 for equal items and be consistent, or the result is unpredictable.' },
      },
    ],
    keyTakeaways: [
      'Custom comparators must model strict less-than (<), never less-than-or-equal (<=).',
      'The strict weak ordering contract requires irreflexivity, asymmetry, and transitivity.',
      { cpp: 'Comparing pairs or tuples with the built-in `<` is a valid strict weak ordering; prefer it over a hand-written comparator when the fields compare naturally.', java: '`Comparator.comparing(...).thenComparing(...)` builds a valid comparator from keys; prefer it over hand-written subtraction.', python: 'Using tuple sort keys avoids comparator contract violations entirely.' },
      'Violating comparator axioms causes segmentation faults in C++ and runtime exceptions in Java.',
    ],
    practice: {
      prompt: 'Given a list of non-negative integers, arrange them such that they form the largest possible number when concatenated. Use a custom comparator that evaluates concatenated string pairs.',
      leetcode: { title: 'Largest Number', slug: 'largest-number' },
    },
  },

  // =========================================================================
  // Lesson 10: What the built-in sort actually is
  // =========================================================================
  {
    sub: 10,
    summary: 'Explain the architecture of production sorting algorithms (Introsort, Dual-Pivot Quicksort, TimSort) and their practical performance characteristics.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Production programming runtimes avoid textbook quicksort, merge sort, or bubble sort in isolation. Textbook algorithms carry critical liabilities: quicksort degrades to `O(n²)` on adversarial inputs, merge sort incurs `O(n)` memory overhead, and heapsort suffers poor CPU cache locality. Standard libraries utilise sophisticated **hybrid algorithms** that combine multiple algorithms dynamically.',
      },
      { kind: 'heading', text: 'Introsort, Dual-Pivot Quicksort, and TimSort' },
      {
        kind: 'text',
        body: 'In C++, `std::sort` implements **Introsort** (Introspective Sort). It begins with quicksort for speed and cache efficiency. If the recursion depth exceeds `2 * log2(n)`, signaling a degenerate split, it switches to heapsort to guarantee an `O(n log n)` upper ceiling. When partitions fall below 16 items, it switches to insertion sort. In Java, primitive arrays use Yaroslavskiy’s **Dual-Pivot Quicksort**, while object sorting in Java and Python’s built-in `sort()` use **TimSort**, an adaptive stable algorithm that identifies already sorted runs.',
      },
      {
        kind: 'code',
        caption: 'Sorting large arrays reliably with the language standard library sort',
        code: {
          cpp: `// C++: std::sort uses Introsort (Quicksort + Heapsort + Insertion Sort)
void sortNumbers(vector<int>& nums) {
    sort(nums.begin(), nums.end());
}`,
          java: `// Java: Arrays.sort on primitives uses Dual-Pivot Quicksort
public void sortNumbers(int[] nums) {
    Arrays.sort(nums);
}`,
          python: `# Python: list.sort() uses TimSort (Adaptive Merge Sort + Insertion Sort)
def sort_numbers(nums: list[int]) -> None:
    nums.sort()`,
        },
      },
      { kind: 'heading', text: 'Runtime engine comparison' },
      {
        kind: 'table',
        headers: ['Language / Context', 'Underlying Algorithm', 'Worst-Case Time', 'Auxiliary Space', 'Stable?'],
        rows: [
          ['C++ std::sort', 'Introsort (Quick + Heap + Insertion)', 'O(n log n)', 'O(log n)', 'No'],
          ['C++ std::stable_sort', 'Block Sort / Adaptive Merge Sort', 'O(n log n)', 'O(n) or O(1)', 'Yes'],
          ['Java Arrays.sort(int[])', 'Dual-Pivot Quicksort', 'O(n log n)', 'O(log n)', 'No'],
          ['Java Arrays.sort(Object[])', 'TimSort', 'O(n log n)', 'O(n)', 'Yes'],
          ['Python list.sort()', 'TimSort / Powersort', 'O(n log n)', 'O(n)', 'Yes'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Prefer standard library sort in competitive programming',
        body: 'Do not write manual sorting routines in interviews unless specifically instructed to implement an algorithm from scratch. Standard library sorts are implemented in heavily optimised native assembly and compiled code featuring SIMD instructions and branch prediction that run substantially faster than hand-written implementations.',
      },
    ],
    keyTakeaways: [
      'Production language runtimes use hybrid sorting algorithms instead of textbook routines.',
      { cpp: 'Introsort safeguards quicksort by falling back to heapsort when recursion exceeds logarithmic limits.', java: '`Arrays.sort` on primitive arrays uses dual-pivot quicksort: not stable, but stability is meaningless for primitives.', python: 'TimSort detects runs that are already sorted, so sorting nearly-sorted input is close to O(n).' },
      { cpp: '`std::stable_sort` is a merge sort: stable, O(n log n), using extra memory.', java: '`Arrays.sort` on objects and `Collections.sort` use TimSort, which identifies existing sorted runs: stable, adaptive, O(n log n).', python: '`list.sort` and `sorted` use TimSort, which identifies existing sorted runs: stable, adaptive, O(n log n).' },
      'Standard library sorts are faster and more robust than hand-rolled sorting implementations.',
    ],
    practice: {
      prompt: 'Given an array of intervals where intervals[i] = [starti, endi], sort the intervals by start time using the standard library sort, then merge all overlapping intervals into a consolidated non-overlapping list.',
      leetcode: { title: 'Merge Intervals', slug: 'merge-intervals' },
    },
  },
];
