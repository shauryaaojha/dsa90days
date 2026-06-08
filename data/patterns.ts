export interface Pattern {
  name: string;
  whenToUse: string;
  keyQuestions: string;
  timeComplexity: string;
}

export const patterns: Pattern[] = [
  { name: 'Two Pointers', whenToUse: 'Sorted array; pair/triplet sum; palindrome; partitioning', keyQuestions: '3Sum, Container w/ Most Water, Trapping Rain Water', timeComplexity: 'O(n)' },
  { name: 'Sliding Window', whenToUse: 'Contiguous subarray/substring; fixed or variable window', keyQuestions: 'Longest substr w/o repeat, Min Window Substr, Fruit Baskets', timeComplexity: 'O(n)' },
  { name: 'Binary Search', whenToUse: "Sorted data; minimize/maximize answer; 'how many ≥ k?'", keyQuestions: 'Rotated Array, Koko Eating Bananas, Aggressive Cows', timeComplexity: 'O(log n)' },
  { name: 'Hash Map / Set', whenToUse: 'Fast lookup; frequency count; seen before', keyQuestions: 'Two Sum, Group Anagrams, Longest Consec Sequence', timeComplexity: 'O(n) avg' },
  { name: 'Prefix Sum', whenToUse: 'Range sum queries; subarray sum == k', keyQuestions: 'Subarray Sum = K, Product Except Self', timeComplexity: 'O(n)' },
  { name: 'Monotonic Stack', whenToUse: 'Next greater/smaller; histogram; span', keyQuestions: 'Daily Temps, Largest Rect Histogram, Trapping Rain', timeComplexity: 'O(n)' },
  { name: 'Slow–Fast Pointers', whenToUse: 'Cycle detection in LL / array; middle element', keyQuestions: 'Linked List Cycle, Find Duplicate, Middle of LL', timeComplexity: 'O(n)' },
  { name: 'BFS (Level Order)', whenToUse: 'Shortest path unweighted; level-by-level tree', keyQuestions: 'Word Ladder, Rotting Oranges, Level Order Traversal', timeComplexity: 'O(V+E)' },
  { name: 'DFS + Backtracking', whenToUse: 'Exhaustive search; permutations; paths in grid', keyQuestions: 'Subsets, N-Queens, Word Search, Combination Sum', timeComplexity: 'O(2^n)' },
  { name: '0/1 Knapsack DP', whenToUse: 'Include/exclude item; weight capacity limit', keyQuestions: '0/1 Knapsack, Partition Equal Subset, Target Sum', timeComplexity: 'O(n·W)' },
  { name: 'Unbounded Knapsack', whenToUse: 'Item reusable; coin change; rod cutting', keyQuestions: 'Coin Change, Coin Change II, Ribbon Cut', timeComplexity: 'O(n·W)' },
  { name: 'LCS / Edit Distance', whenToUse: 'Strings; alignment; transformation cost', keyQuestions: 'LCS, Edit Distance, Interleaving String', timeComplexity: 'O(m·n)' },
  { name: 'Interval Merge', whenToUse: 'Overlapping ranges; meeting rooms', keyQuestions: 'Merge Intervals, Insert Interval, Burst Balloons', timeComplexity: 'O(n log n)' },
  { name: "Topo Sort (Kahn's)", whenToUse: 'Dependency ordering; cycle detection directed', keyQuestions: 'Course Schedule, Alien Dictionary, Safe States', timeComplexity: 'O(V+E)' },
  { name: 'Dijkstra', whenToUse: 'Shortest path weighted non-negative graph', keyQuestions: 'Network Delay, Cheapest Flights, Path w/ Min Effort', timeComplexity: 'O((V+E)logV)' },
  { name: 'Union-Find', whenToUse: 'Dynamic connectivity; cycle detection undirected', keyQuestions: 'Number of Provinces, Graph Valid Tree, Kruskal MST', timeComplexity: 'O(α(n))' },
  { name: 'Trie', whenToUse: 'Prefix search; dictionary; word search', keyQuestions: 'Implement Trie, Word Search II, Replace Words', timeComplexity: 'O(L) per op' },
  { name: 'Two Heaps', whenToUse: 'Maintain running median; split dataset', keyQuestions: 'Find Median from Data Stream', timeComplexity: 'O(log n)' },
  { name: 'Bit Manipulation', whenToUse: 'Even/odd; XOR tricks; subset enumeration', keyQuestions: 'Single Number, Sum of Two Integers, Missing Number', timeComplexity: 'O(1) / O(n)' },
  { name: 'Greedy', whenToUse: 'Local optimal → global optimal; sorting-based', keyQuestions: 'Jump Game, Gas Station, Activity Selection, Task Scheduler', timeComplexity: 'O(n log n)' },
];
