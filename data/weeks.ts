export interface WeekInfo {
  week: number;
  topic: string;
  dayRange: string;
  phase: 1 | 2;
}

export const weeks: WeekInfo[] = [
  { week: 1, topic: 'Arrays Easy', dayRange: 'Day 1-7', phase: 1 },
  { week: 2, topic: 'Arrays Hard + Strings', dayRange: 'Day 8-14', phase: 1 },
  { week: 3, topic: 'Sliding Window + Hashing', dayRange: 'Day 15-21', phase: 1 },
  { week: 4, topic: 'Linked Lists', dayRange: 'Day 22-28', phase: 1 },
  { week: 5, topic: 'Stacks & Queues', dayRange: 'Day 29-35', phase: 1 },
  { week: 6, topic: 'Binary Search', dayRange: 'Day 36-42', phase: 1 },
  { week: 7, topic: 'Recursion & Backtracking', dayRange: 'Day 43-49', phase: 1 },
  { week: 8, topic: 'Binary Trees', dayRange: 'Day 50-56', phase: 1 },
  { week: 9, topic: 'BST + Heaps', dayRange: 'Day 57-60', phase: 1 },
  { week: 10, topic: 'Graphs (BFS/DFS)', dayRange: 'Day 61-67', phase: 2 },
  { week: 11, topic: 'Graphs (SP/MST/Advanced)', dayRange: 'Day 68-74', phase: 2 },
  { week: 12, topic: 'Dynamic Programming 1D', dayRange: 'Day 75-80', phase: 2 },
  { week: 13, topic: 'DP 2D + Strings', dayRange: 'Day 81-87', phase: 2 },
  { week: 14, topic: 'Tries + Greedy + Bit + Mock', dayRange: 'Day 88-90', phase: 2 },
];
