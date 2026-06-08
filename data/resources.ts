export interface Resource {
  name: string;
  url: string;
  description: string;
}

export interface ResourceCategory {
  title: string;
  icon: string;
  resources: Resource[];
}

export const resourceCategories: ResourceCategory[] = [
  {
    title: 'YouTube Channels',
    icon: '🎥',
    resources: [
      { name: 'Striver – TakeUForward', url: 'https://www.youtube.com/@takeUforward', description: 'Full A2Z DSA playlist, pattern-based' },
      { name: 'Apna College', url: 'https://www.youtube.com/@ApnaCollegeOfficial', description: 'Hindi, beginner-friendly, very clear' },
      { name: 'Padho with Pratyush', url: 'https://www.youtube.com/@padhowithpratyush', description: 'Code walkthrough, interview focus' },
      { name: 'NeetCode', url: 'https://www.youtube.com/@NeetCode', description: 'Fast visual explanations (English)' },
      { name: 'Abdul Bari', url: 'https://www.youtube.com/@abdul_bari', description: 'Deep theory explanations' },
    ],
  },
  {
    title: 'Practice Sheets',
    icon: '📋',
    resources: [
      { name: "Striver's A2Z Sheet", url: 'https://takeuforward.org/strivers-a2z-dsa-course/', description: '450+ curated problems' },
      { name: 'LeetCode NeetCode 150', url: 'https://neetcode.io/practice', description: 'Top 150 interview problems' },
      { name: 'LeetCode Top Interview', url: 'https://leetcode.com/problem-list/top-interview-questions/', description: 'Top interview questions' },
      { name: 'GFG Must Do', url: 'https://www.geeksforgeeks.org/must-do-coding-questions-for-companies-like-amazon-microsoft-adobe/', description: 'Company-wise Qs' },
    ],
  },
  {
    title: 'Platform Links',
    icon: '🔗',
    resources: [
      { name: 'LeetCode', url: 'https://leetcode.com', description: 'Primary practice platform' },
      { name: 'GeeksForGeeks', url: 'https://www.geeksforgeeks.org', description: 'Theory + GFG-specific Qs' },
      { name: 'Codeforces', url: 'https://codeforces.com', description: 'Competitive programming' },
      { name: 'CodeStudio (Coding Ninjas)', url: 'https://www.codingninjas.com/studio', description: 'Interview prep + free courses' },
    ],
  },
  {
    title: 'Key Playlists',
    icon: '📖',
    resources: [
      { name: 'Striver DP Playlist', url: 'https://www.youtube.com/playlist?list=PLgUwDviBIf0qUlt5H_kiKYaNSqJ81PMMY', description: 'Complete DP series' },
      { name: 'Striver Graph Series', url: 'https://www.youtube.com/playlist?list=PLgUwDviBIf0oE3gA41TKO2H5bHpPd7fzn', description: 'Complete Graph series' },
      { name: 'Apna College DSA Playlist', url: 'https://www.youtube.com/playlist?list=PLfqMhTWNBTe0b2nM6JHVCnAkhQRGiZMSJ', description: 'Full DSA Hindi' },
      { name: 'Striver A2Z Full', url: 'https://www.youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz', description: 'A2Z complete playlist' },
    ],
  },
];
