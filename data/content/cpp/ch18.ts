import type { Lesson } from '../types';

/**
 * Chapter 18 — Core DSA Patterns.
 * The bridge into Phase 1: ten templates that between them cover most of the
 * 90-day problem set, each with its recognition signal and its failure mode.
 */
export const ch18: Lesson[] = [
  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-18.1',
    language: 'cpp',
    summary: 'Collapse an O(n²) pair search into O(n) using two converging indices.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'A brute-force pair search tries every `(i, j)` — that is O(n²). Two pointers works because **sorted order tells you which way to move**: if the current pair sums too low, no smaller right index can help, so the only useful move is to advance the left one. Every step eliminates a whole row of the search space.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Recognition signal',
        body: 'A **sorted** array (or one you may sort) plus a question about a pair or a triple. Also palindromes, reversal, and merging two sorted sequences. If the input is sorted and you were about to write a nested loop, two pointers is almost certainly the intended answer.',
      },
      {
        kind: 'code',
        caption: 'The converging template',
        code: `int left = 0, right = n - 1;

while (left < right) {
    int sum = nums[left] + nums[right];
    if (sum == target) return {left, right};
    if (sum < target) left++;        // need larger → move the small end up
    else              right--;       // need smaller → move the large end down
}`,
      },
      {
        kind: 'text',
        body: 'The correctness argument is worth being able to state: because the array is sorted, if the sum is too small then *no* pair using the current `left` can work — every remaining partner is smaller than `right`. So `left` can be discarded safely. Each step eliminates one index, giving **O(n)**.',
      },
      { kind: 'heading', text: 'The three shapes' },
      {
        kind: 'code',
        caption: '1. Opposite ends — pair sums, palindromes',
        code: `bool isPalindrome(const string& s) {
    int l = 0, r = s.size() - 1;
    while (l < r) {
        if (s[l] != s[r]) return false;
        l++; r--;
    }
    return true;
}`,
      },
      {
        kind: 'code',
        caption: '2. Same direction, different speeds — in-place filtering',
        code: `int removeElement(vector<int>& nums, int val) {
    int write = 0;
    for (int read = 0; read < nums.size(); read++)
        if (nums[read] != val)
            nums[write++] = nums[read];
    return write;                     // the new length
}`,
      },
      {
        kind: 'code',
        caption: '3. Two separate arrays — merging',
        code: `vector<int> merge(vector<int>& a, vector<int>& b) {
    vector<int> result;
    int i = 0, j = 0;
    while (i < a.size() && j < b.size())
        result.push_back(a[i] <= b[j] ? a[i++] : b[j++]);

    while (i < a.size()) result.push_back(a[i++]);   // drain the leftovers
    while (j < b.size()) result.push_back(b[j++]);
    return result;
}`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Do not forget to drain the remaining elements',
        body: 'The main merge loop stops as soon as *either* array is exhausted, so the other still has elements. Omitting the two drain loops silently truncates the result — and it passes any test where the arrays happen to end together, which is why it survives casual checking.',
      },
      { kind: 'heading', text: 'Extending to three pointers' },
      {
        kind: 'code',
        caption: '3Sum — fix one, two-point the rest',
        code: `vector<vector<int>> threeSum(vector<int>& nums) {
    sort(nums.begin(), nums.end());
    vector<vector<int>> result;

    for (int i = 0; i < (int)nums.size() - 2; i++) {
        if (i > 0 && nums[i] == nums[i-1]) continue;      // skip duplicate anchors

        int l = i + 1, r = nums.size() - 1;
        while (l < r) {
            int sum = nums[i] + nums[l] + nums[r];
            if (sum < 0) l++;
            else if (sum > 0) r--;
            else {
                result.push_back({nums[i], nums[l], nums[r]});
                while (l < r && nums[l] == nums[l+1]) l++;    // skip duplicates
                while (l < r && nums[r] == nums[r-1]) r--;
                l++; r--;
            }
        }
    }
    return result;
}`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Duplicate skipping is where 3Sum is usually lost',
        body: 'Three separate places need it: the outer anchor, and both pointers after recording a match. Miss any one and you emit duplicate triples. The `l < r` guard inside those inner `while` loops matters too — without it the pointers can cross and read out of range.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Cast size() before subtracting',
        body: '`nums.size() - 2` is unsigned, so on an array of fewer than two elements it wraps to an enormous number and the loop runs out of bounds. `(int)nums.size() - 2` is the fix — the same unsigned trap from Chapter 2, appearing in a real solution.',
      },
    ],
    keyTakeaways: [
      'Sorted input plus a pair question means two pointers — O(n) instead of O(n²).',
      'Three shapes: opposite ends, same-direction read/write, and two-array merge.',
      'Always drain the leftovers after a merge loop.',
      '3Sum needs duplicate skipping in three separate places.',
    ],
    practice: {
      prompt: 'Write Two Sum II with converging pointers, then Move Zeroes with the read/write pair, then 3Sum. In 3Sum, remove each of the three duplicate-skip lines in turn and observe which duplicates appear — that tells you what each one is actually for.',
      leetcode: { title: '3Sum', slug: '3sum' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-18.2',
    language: 'cpp',
    summary: 'Find the best contiguous subarray or substring in a single pass.',
    readMinutes: 6,
    blocks: [
      {
        kind: 'text',
        body: 'Every subarray problem has an obvious O(n²) solution: try every start, extend every end. Sliding window collapses it by noticing that when the window moves right by one, **one element enters and some leave** — so the update is O(1) rather than a full rescan.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Recognition signal',
        body: 'The words "**contiguous**", "**subarray**" or "**substring**", combined with "longest", "shortest", "maximum" or "contains at most k". If the answer is a *contiguous stretch* and you were about to check every start and end, use a sliding window.',
      },
      { kind: 'heading', text: 'Variable-size window — the general template' },
      {
        kind: 'code',
        code: `int left = 0;
int best = 0;

for (int right = 0; right < n; right++) {
    // 1. EXPAND — add nums[right] to the window state
    add(nums[right]);

    // 2. SHRINK — while the window is invalid, remove from the left
    while (!valid()) {
        remove(nums[left]);
        left++;
    }

    // 3. RECORD — the window is now valid
    best = max(best, right - left + 1);
}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Why the nested while still gives O(n)',
        body: '`left` only ever moves forward, and it can advance at most n times in total across the entire outer loop. So each element is added once and removed at most once — 2n operations, not n². Being able to explain this is what separates "I memorised a template" from "I understand it", and interviewers do ask.',
      },
      { kind: 'heading', text: 'Longest substring without repeating characters' },
      {
        kind: 'code',
        code: `int lengthOfLongestSubstring(string s) {
    unordered_map<char,int> count;
    int left = 0, best = 0;

    for (int right = 0; right < s.size(); right++) {
        count[s[right]]++;                          // expand

        while (count[s[right]] > 1) {               // invalid: a duplicate
            count[s[left]]--;
            left++;
        }

        best = max(best, right - left + 1);         // record
    }
    return best;
}`,
      },
      { kind: 'heading', text: 'Minimum window — record on shrink instead' },
      {
        kind: 'code',
        code: `string minWindow(string s, string t) {
    unordered_map<char,int> need;
    for (char c : t) need[c]++;

    int required = need.size(), formed = 0;
    unordered_map<char,int> window;
    int left = 0, bestLen = INT_MAX, bestStart = 0;

    for (int right = 0; right < s.size(); right++) {
        char c = s[right];
        window[c]++;
        if (need.count(c) && window[c] == need[c]) formed++;

        while (formed == required) {                // valid — try to shrink
            if (right - left + 1 < bestLen) {       // record HERE
                bestLen = right - left + 1;
                bestStart = left;
            }
            char d = s[left];
            window[d]--;
            if (need.count(d) && window[d] < need[d]) formed--;
            left++;
        }
    }
    return bestLen == INT_MAX ? "" : s.substr(bestStart, bestLen);
}`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Maximum records after shrinking; minimum records during',
        body: 'For a *longest* window you shrink until valid, then record. For a *shortest* window you shrink **while** valid, recording before each removal — because you want the smallest valid window, and it stops being valid the moment you shrink too far. Getting this backwards is the commonest sliding-window mistake.',
      },
      { kind: 'heading', text: 'Fixed-size window' },
      {
        kind: 'code',
        code: `int maxSum(vector<int>& nums, int k) {
    int sum = 0;
    for (int i = 0; i < k; i++) sum += nums[i];      // the first window

    int best = sum;
    for (int i = k; i < nums.size(); i++) {
        sum += nums[i] - nums[i - k];                // slide: add one, drop one
        best = max(best, sum);
    }
    return best;
}`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Erase map keys that reach zero',
        body: 'If your validity check uses `window.size()` to count distinct characters, decrementing without erasing leaves zero-count keys behind, so the size never shrinks and the loop never exits correctly. Any window testing `map.size()` must `erase` when a count hits zero.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Sliding window needs monotonicity',
        body: 'It works because widening the window can only push the quantity one way — a sum grows as you add elements, a distinct count only rises. With **negative numbers** that breaks: adding an element can *decrease* the sum, so shrinking is no longer guaranteed to help. That is why "subarray sum equals k" with negatives needs prefix sums and a hash map instead.',
      },
    ],
    keyTakeaways: [
      'Expand right, shrink left while invalid, record — O(n) because left only advances.',
      'Longest: record after shrinking. Shortest: record while still valid.',
      'Erase zero-count keys when the check depends on `map.size()`.',
      'Negative numbers break the monotonicity — use prefix sums instead.',
    ],
    practice: {
      prompt: 'Write Longest Substring Without Repeating Characters, then Minimum Window Substring. Then explain aloud why the nested `while` keeps the whole thing O(n) — that explanation is asked for in interviews more often than the code itself.',
      leetcode: { title: 'Minimum Window Substring', slug: 'minimum-window-substring' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-18.3',
    language: 'cpp',
    summary: 'Answer range-sum and subarray-count questions in O(1) after O(n) setup.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Build a running total, and any range sum becomes one subtraction. That alone turns repeated range queries from O(n) each into O(1) each — and paired with a hash map it answers "how many subarrays sum to k?" in a single pass, including the negative-number case that sliding window cannot handle.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Recognition signal',
        body: '"Sum of the range i to j" asked **many times**, or "count subarrays whose sum equals k" — especially when **negative numbers are allowed**, which rules out a sliding window.',
      },
      {
        kind: 'code',
        caption: 'The construction',
        code: `vector<int> prefix(n + 1, 0);
for (int i = 0; i < n; i++)
    prefix[i + 1] = prefix[i] + nums[i];

// Sum of nums[i..j] inclusive:
int rangeSum = prefix[j + 1] - prefix[i];`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Size it n+1 with a leading zero',
        body: 'The extra slot represents the empty prefix, which removes the special case for ranges starting at index 0. Without it you need `i == 0 ? prefix[j] : prefix[j] - prefix[i-1]` everywhere. One extra element eliminates a branch from every query.',
      },
      { kind: 'heading', text: 'Combined with a hash map — the powerful form' },
      {
        kind: 'code',
        caption: 'Subarray Sum Equals K',
        code: `int subarraySum(vector<int>& nums, int k) {
    unordered_map<int,int> seen;      // prefix sum → how many times seen
    seen[0] = 1;                      // the empty prefix

    int sum = 0, count = 0;
    for (int x : nums) {
        sum += x;
        if (seen.count(sum - k)) count += seen[sum - k];
        seen[sum]++;
    }
    return count;
}`,
      },
      {
        kind: 'text',
        body: 'The rearrangement is the whole idea: a subarray ending here sums to `k` exactly when some earlier prefix equalled `sum - k`. So instead of trying every start, you *look up* how many qualifying starts exist. **O(n)** instead of O(n²).',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'seen[0] = 1 is mandatory',
        body: 'It accounts for subarrays starting at index 0. Without it, `nums = [3], k = 3` returns 0. It fails only on subarrays that begin at the very start — which sample tests frequently miss, so the bug survives until a hidden test catches it.',
      },
      { kind: 'heading', text: 'The variants' },
      {
        kind: 'code',
        caption: 'Longest subarray with sum k — store the earliest index',
        code: `unordered_map<int,int> firstIndex;
firstIndex[0] = -1;                        // empty prefix ends before index 0

int sum = 0, best = 0;
for (int i = 0; i < nums.size(); i++) {
    sum += nums[i];
    if (firstIndex.count(sum - k))
        best = max(best, i - firstIndex[sum - k]);
    if (!firstIndex.count(sum))            // record only the FIRST occurrence
        firstIndex[sum] = i;
}`,
      },
      {
        kind: 'text',
        body: 'Counting stores frequencies; *longest* stores the earliest index and never overwrites it, because an earlier start yields a longer subarray. That one `if (!count(sum))` guard is the entire difference between the two variants.',
      },
      {
        kind: 'code',
        caption: 'Divisible by k — store remainders',
        code: `int r = ((sum % k) + k) % k;          // safe modulo — sums can be negative
count += seen[r];
seen[r]++;`,
      },
      {
        kind: 'code',
        caption: '2D prefix sums — range sums over a matrix',
        code: `// prefix[i][j] = sum of the rectangle from (0,0) to (i-1,j-1)
vector<vector<int>> prefix(rows + 1, vector<int>(cols + 1, 0));

for (int i = 0; i < rows; i++)
    for (int j = 0; j < cols; j++)
        prefix[i+1][j+1] = matrix[i][j] + prefix[i][j+1]
                         + prefix[i+1][j] - prefix[i][j];

// Sum of the rectangle (r1,c1) to (r2,c2):
int sum = prefix[r2+1][c2+1] - prefix[r1][c2+1]
        - prefix[r2+1][c1] + prefix[r1][c1];`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Inclusion-exclusion: the overlap is subtracted twice',
        body: 'Both the construction and the query subtract the top-left region twice and add it back once. Getting a sign wrong gives answers that are correct for rectangles touching an edge and wrong elsewhere — draw the four rectangles on paper once and the formula stops needing memorisation.',
      },
    ],
    keyTakeaways: [
      'Prefix sums make any range sum O(1) after O(n) setup.',
      'Size the array `n+1` with a leading zero to remove the index-0 special case.',
      'Prefix sum plus hash map counts subarrays in O(n), even with negatives.',
      'Seed with `seen[0] = 1` for counting, `firstIndex[0] = -1` for longest.',
    ],
    practice: {
      prompt: 'Build a prefix-sum array and answer range queries in O(1). Then solve Subarray Sum Equals K, remove `seen[0] = 1`, and find the input it breaks on. Then solve Contiguous Array by mapping 0 to −1 — the same pattern in disguise.',
      leetcode: { title: 'Subarray Sum Equals K', slug: 'subarray-sum-equals-k' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-18.4',
    language: 'cpp',
    summary: 'Use two pointers at different speeds to find cycles, middles and nth-from-end.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Move one pointer a step at a time and another two steps at a time. If the structure ends, the fast one falls off and there is no cycle. If there is a cycle, the fast pointer gains exactly one position per iteration and therefore **must** land on the slow one — it cannot step over it.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Recognition signal',
        body: 'A **linked list** plus "cycle", "middle", "nth from the end", or "palindrome". Also any problem where you need a positional relationship in a structure you can only walk forwards, in O(1) space.',
      },
      { kind: 'heading', text: 'Cycle detection — Floyd\'s algorithm' },
      {
        kind: 'code',
        code: `bool hasCycle(ListNode* head) {
    ListNode *slow = head, *fast = head;

    while (fast != nullptr && fast->next != nullptr) {
        slow = slow->next;              // one step
        fast = fast->next->next;        // two steps
        if (slow == fast) return true;  // they met — there is a loop
    }
    return false;                       // fast reached the end — no loop
}`,
      },
      {
        kind: 'text',
        body: 'If there is a cycle, `fast` laps `slow` and they must eventually land on the same node — the gap closes by one each step, so it cannot be skipped over. If there is no cycle, `fast` runs off the end. **O(n)** time, **O(1)** space, versus O(n) space for a hash set of visited nodes.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'The guard must check two levels',
        body: '`fast != nullptr && fast->next != nullptr` — the body dereferences `fast->next->next`, so both must be valid. Dropping the first check crashes on even-length lists; dropping the second crashes on odd-length ones. Every fast-pointer loop needs exactly this condition.',
      },
      { kind: 'heading', text: 'Finding the cycle start' },
      {
        kind: 'code',
        code: `ListNode* detectCycle(ListNode* head) {
    ListNode *slow = head, *fast = head;

    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) {                    // phase 1: they met
            ListNode* p = head;
            while (p != slow) {                // phase 2: walk at equal speed
                p = p->next;
                slow = slow->next;
            }
            return p;                          // the cycle's entry point
        }
    }
    return nullptr;
}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Why phase 2 works',
        body: 'Let the distance from head to the cycle entry be `a`, and from the entry to the meeting point be `b`. When they meet, `slow` has walked `a + b` and `fast` has walked twice that. Working through the algebra shows the remaining distance from the meeting point back to the entry equals `a`. So walking one pointer from the head and one from the meeting point, both at one step, lands them together at the entry.',
      },
      { kind: 'heading', text: 'The other two uses' },
      {
        kind: 'code',
        caption: 'Middle of the list',
        code: `ListNode* middle(ListNode* head) {
    ListNode *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
    }
    return slow;        // fast at the end → slow at the middle
}`,
      },
      {
        kind: 'code',
        caption: 'Nth node from the end — a fixed gap',
        code: `ListNode* removeNthFromEnd(ListNode* head, int n) {
    ListNode dummy(0);
    dummy.next = head;
    ListNode *fast = &dummy, *slow = &dummy;

    for (int i = 0; i <= n; i++) fast = fast->next;   // open a gap of n+1

    while (fast) { fast = fast->next; slow = slow->next; }

    slow->next = slow->next->next;                    // slow is just before the target
    return dummy.next;
}`,
      },
      {
        kind: 'text',
        body: 'Here the pointers move at the *same* speed with a fixed gap between them. When `fast` reaches the end, `slow` is exactly n nodes behind. The dummy head handles the case where the node to remove is the first one — otherwise that needs its own branch.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'The technique is not only for linked lists',
        body: 'Find the Duplicate Number applies Floyd\'s algorithm to an array by treating `nums[i]` as a "next pointer", turning the array into an implicit linked list with a cycle. Recognising that reframing is what makes an otherwise very hard problem tractable in O(1) space.',
      },
    ],
    keyTakeaways: [
      'Fast/slow detects a cycle in O(n) time and O(1) space.',
      'The guard `fast && fast->next` is required — the body dereferences two levels.',
      'After they meet, walking from head and meeting point at equal speed finds the entry.',
      'A fixed gap between same-speed pointers gives nth-from-the-end in one pass.',
    ],
    practice: {
      prompt: 'Write cycle detection, find-the-middle, and remove-nth-from-end. Test each on a one-node list and an empty list. Then solve Find the Duplicate Number with Floyd\'s algorithm — seeing the array as a linked list is the insight worth having.',
      leetcode: { title: 'Linked List Cycle II', slug: 'linked-list-cycle-ii' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-18.5',
    language: 'cpp',
    summary: 'Answer "next greater element" style questions for every index in O(n).',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'A monotonic stack is one you deliberately keep in order, by popping anything that would break that order. When a new element arrives and breaks it, **that element is the answer for everything it pops**. The pop is where you record the result — and that is the entire pattern.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Recognition signal',
        body: '"**Next greater**", "**previous smaller**", "how many days until…", "largest rectangle", "trapping rain water". Any problem asking, for every element, about the nearest element on one side satisfying a comparison.',
      },
      {
        kind: 'code',
        caption: 'The template',
        code: `stack<int> st;                        // holds INDICES
vector<int> result(n, -1);

for (int i = 0; i < n; i++) {
    // Pop everything the current element resolves
    while (!st.empty() && nums[st.top()] < nums[i]) {
        result[st.top()] = i;             // or nums[i], or i - st.top()
        st.pop();
    }
    st.push(i);
}
// Indices left in the stack have no answer — they keep -1`,
      },
      {
        kind: 'text',
        body: 'The stack holds indices whose answers are still unknown, and their values are always **decreasing** — hence "monotonic". A new element resolves everything smaller than itself, then joins the stack to wait.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Why the inner while does not make it O(n²)',
        body: 'Each index is pushed exactly once and popped at most once, so across the whole loop there are at most n pops. Total work is 2n — **O(n)**. This is the same amortisation argument as the sliding window, and interviewers ask for it.',
      },
      { kind: 'heading', text: 'Choosing the comparison direction' },
      {
        kind: 'table',
        headers: ['You want', 'Stack holds', 'Pop while'],
        rows: [
          ['Next greater', 'Decreasing values', '`nums[top] < nums[i]`'],
          ['Next smaller', 'Increasing values', '`nums[top] > nums[i]`'],
          ['Previous greater', 'Decreasing values', 'Same loop; answer is `st.top()` **before** pushing'],
          ['Previous smaller', 'Increasing values', 'Same loop; answer is `st.top()` before pushing'],
        ],
      },
      {
        kind: 'text',
        body: '"Next" answers are written when an element is **popped**; "previous" answers are read from `st.top()` just **before pushing**. One loop can produce both at once.',
      },
      {
        kind: 'code',
        caption: 'Daily Temperatures — distance instead of value',
        code: `vector<int> dailyTemperatures(vector<int>& temps) {
    vector<int> result(temps.size(), 0);
    stack<int> st;

    for (int i = 0; i < temps.size(); i++) {
        while (!st.empty() && temps[st.top()] < temps[i]) {
            result[st.top()] = i - st.top();      // days waited
            st.pop();
        }
        st.push(i);
    }
    return result;
}`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Store indices, not values',
        body: 'Distances like `i - st.top()` and writes like `result[st.top()]` both need the position. Storing values throws that away and forces an extra lookup or a parallel structure. Index-storing is the default for every monotonic stack problem.',
      },
      { kind: 'heading', text: 'Largest Rectangle in Histogram' },
      {
        kind: 'code',
        code: `int largestRectangleArea(vector<int>& heights) {
    heights.push_back(0);                  // sentinel flushes the stack at the end
    stack<int> st;
    int best = 0;

    for (int i = 0; i < heights.size(); i++) {
        while (!st.empty() && heights[st.top()] > heights[i]) {
            int h = heights[st.top()]; st.pop();
            int left = st.empty() ? -1 : st.top();     // previous smaller
            best = max(best, h * (i - left - 1));      // width between the two
        }
        st.push(i);
    }
    return best;
}`,
      },
      {
        kind: 'text',
        body: 'For each bar, the rectangle it can anchor extends until the first smaller bar on each side. The stack gives both boundaries: `i` is the next smaller, and the new `st.top()` after popping is the previous smaller.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The zero sentinel',
        body: 'Appending a height of 0 guarantees every remaining bar is popped and evaluated, removing the need for a separate drain loop after the main one. The same trick applies whenever leftover stack entries would otherwise need special handling — a small, reusable simplification.',
      },
    ],
    keyTakeaways: [
      'A monotonic stack answers nearest-greater/smaller queries in O(n).',
      'Each index is pushed once and popped once — the inner `while` is amortised.',
      '"Next" answers are written on pop; "previous" answers are read before pushing.',
      'A sentinel value at the end flushes the stack and removes the drain loop.',
    ],
    practice: {
      prompt: 'Write Next Greater Element, then Daily Temperatures — noticing they are the same loop with a different stored result. Then work through Largest Rectangle in Histogram by hand on `[2,1,5,6,2,3]`, tracking the stack at every step.',
      leetcode: { title: 'Daily Temperatures', slug: 'daily-temperatures' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-18.6',
    language: 'cpp',
    summary: 'Track the maximum of a moving window in O(n) using a deque.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'A monotonic deque is the monotonic stack with one addition: because the window also moves on the left, you must discard elements that have fallen out of range. Removing from both ends is exactly what a deque provides, which is where the name comes from.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Recognition signal',
        body: '"**Maximum (or minimum) of every window of size k**", or a sliding window whose validity depends on the extreme value inside it. When a window needs an extreme and elements expire from the front, a plain stack is not enough — you need both ends.',
      },
      {
        kind: 'code',
        caption: 'Sliding Window Maximum',
        code: `vector<int> maxSlidingWindow(vector<int>& nums, int k) {
    deque<int> dq;                    // INDICES, values decreasing
    vector<int> result;

    for (int i = 0; i < nums.size(); i++) {
        // 1. Expire indices that have left the window
        if (!dq.empty() && dq.front() <= i - k) dq.pop_front();

        // 2. Discard values that can never be the maximum again
        while (!dq.empty() && nums[dq.back()] <= nums[i]) dq.pop_back();

        // 3. Add the new index
        dq.push_back(i);

        // 4. Once the window is full, the front is the maximum
        if (i >= k - 1) result.push_back(nums[dq.front()]);
    }
    return result;
}`,
      },
      {
        kind: 'text',
        body: 'The deque holds indices whose values decrease from front to back. The front is therefore always the window\'s maximum. Both ends are modified — expiring at the front, discarding at the back — which is exactly why a `deque` and not a `stack` or `queue`.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Why discarding smaller values is safe',
        body: 'If `nums[i]` is at least as large as something already in the deque, that older element can never be the maximum again — `nums[i]` is both larger and expires later, so it dominates completely. Removing it loses nothing. That argument is the correctness proof, and it is what interviewers want to hear.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Each index enters and leaves once — O(n)',
        body: 'Despite the inner `while`, every index is pushed exactly once and popped at most once. Total work is 2n. The brute force is O(n·k), which on n = 10⁵ and k = 10⁴ is 10⁹ operations and a guaranteed timeout.',
      },
      { kind: 'heading', text: 'The three details that break it' },
      {
        kind: 'code',
        code: `// 1. Expire by INDEX, which is why the deque stores indices
if (!dq.empty() && dq.front() <= i - k) dq.pop_front();

// 2. Use <= not < when discarding, so equal values do not accumulate
while (!dq.empty() && nums[dq.back()] <= nums[i]) dq.pop_back();

// 3. Only record once the window is actually full
if (i >= k - 1) result.push_back(nums[dq.front()]);`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'The most common bug is recording too early',
        body: 'Without `if (i >= k - 1)` you emit results for partial windows at the start, so the output has k−1 extra entries. It is easy to miss because the *values* look plausible — only the count is wrong.',
      },
      { kind: 'heading', text: 'For a minimum, flip the comparison' },
      {
        kind: 'code',
        code: `// Maximum: keep values DECREASING
while (!dq.empty() && nums[dq.back()] <= nums[i]) dq.pop_back();

// Minimum: keep values INCREASING
while (!dq.empty() && nums[dq.back()] >= nums[i]) dq.pop_back();`,
      },
      {
        kind: 'code',
        caption: 'Two deques when a window needs both',
        code: `// Longest subarray where max - min <= limit
deque<int> maxDq, minDq;
int left = 0, best = 0;

for (int right = 0; right < nums.size(); right++) {
    while (!maxDq.empty() && nums[maxDq.back()] <= nums[right]) maxDq.pop_back();
    while (!minDq.empty() && nums[minDq.back()] >= nums[right]) minDq.pop_back();
    maxDq.push_back(right);
    minDq.push_back(right);

    while (nums[maxDq.front()] - nums[minDq.front()] > limit) {   // shrink
        if (maxDq.front() == left) maxDq.pop_front();
        if (minDq.front() == left) minDq.pop_front();
        left++;
    }
    best = max(best, right - left + 1);
}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'A multiset is the simpler alternative',
        body: 'A `multiset` gives both extremes via `*begin()` and `*rbegin()` and handles arbitrary removal, at O(log n) per operation rather than O(1). It is easier to write correctly. Use two deques when you need the O(n); use a `multiset` when clarity matters more than the log factor.',
      },
    ],
    keyTakeaways: [
      'A monotonic deque gives the window maximum in O(n) rather than O(n·k).',
      'Store indices so you can expire by position with `dq.front() <= i - k`.',
      'Discarding smaller values is safe — they are dominated and expire sooner.',
      'Only record once `i >= k - 1`, or you emit partial windows.',
    ],
    practice: {
      prompt: 'Implement Sliding Window Maximum and hand-trace the deque on `[1,3,-1,-3,5,3,6,7]` with k = 3. Then remove the `i >= k - 1` guard and count the extra outputs. Then solve the max-minus-min-within-limit problem with two deques and again with a `multiset`.',
      leetcode: { title: 'Sliding Window Maximum', slug: 'sliding-window-maximum' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-18.7',
    language: 'cpp',
    summary: 'Apply binary search to arrays, to boundaries, and to the answer space itself.',
    readMinutes: 6,
    blocks: [
      {
        kind: 'text',
        body: 'Binary search halves the search space each step. The idea is easy; the **loop invariant** is what people get wrong. Beyond the classic array search there is a far more valuable form — searching the range of possible **answers** — and that is the one that unlocks the most problems.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Recognition signal',
        body: 'A **sorted** array, or a monotonic predicate — something that is false, false, false, then true, true, true. Also constraints like n ≤ 10⁹, where only a logarithmic approach can fit.',
      },
      { kind: 'heading', text: 'Form 1 — exact match' },
      {
        kind: 'code',
        code: `int search(vector<int>& nums, int target) {
    int low = 0, high = nums.size() - 1;

    while (low <= high) {                      // note <=
        int mid = low + (high - low) / 2;      // overflow-safe
        if (nums[mid] == target) return mid;
        if (nums[mid] < target) low = mid + 1;
        else                    high = mid - 1;
    }
    return -1;
}`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'The three details that cause infinite loops',
        body: '**1.** `low + (high - low) / 2`, never `(low + high) / 2` — the sum can overflow. **2.** With `high = size - 1`, the condition must be `low <= high`. **3.** Always `mid + 1` and `mid - 1`, never bare `mid`, or the range stops shrinking when two elements remain and the loop spins forever.',
      },
      { kind: 'heading', text: 'Form 2 — find a boundary' },
      {
        kind: 'code',
        caption: 'The first index where a predicate becomes true',
        code: `int firstTrue(int low, int high) {
    while (low < high) {                       // note < , and high is exclusive-ish
        int mid = low + (high - low) / 2;
        if (check(mid)) high = mid;            // mid might be the answer — keep it
        else            low = mid + 1;         // mid is not — discard it
    }
    return low;                                // low == high == the boundary
}`,
      },
      {
        kind: 'text',
        body: 'This form is more useful than exact match, because most real problems ask for a boundary rather than a value. Note the asymmetry: `high = mid` keeps the candidate, `low = mid + 1` discards it. That asymmetry is what guarantees progress.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Do not mix the two forms',
        body: '`while (low <= high)` with `high = mid` never terminates; `while (low < high)` with `high = mid - 1` can skip the answer. Pick one form and keep its three pieces consistent: the loop condition, the initial `high`, and the update. Most binary-search bugs are a mixture of the two.',
      },
      { kind: 'heading', text: 'Form 3 — binary search on the answer' },
      {
        kind: 'code',
        caption: 'Koko Eating Bananas',
        code: `int minEatingSpeed(vector<int>& piles, int h) {
    int low = 1, high = *max_element(piles.begin(), piles.end());

    while (low < high) {
        int mid = low + (high - low) / 2;
        if (canFinish(piles, mid, h)) high = mid;    // feasible → try slower
        else                          low = mid + 1; // too slow → speed up
    }
    return low;
}

bool canFinish(vector<int>& piles, int speed, int h) {
    long long hours = 0;
    for (int p : piles) hours += (p + speed - 1) / speed;   // ceiling division
    return hours <= h;
}`,
      },
      {
        kind: 'text',
        body: 'There is no array being searched. The search space is the **range of possible answers**, and `canFinish` is the monotonic predicate: once a speed works, every faster speed works too. This form solves Split Array Largest Sum, Capacity to Ship Packages, and Minimum Days to Make Bouquets.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'How to recognise it',
        body: 'The problem asks for a **minimum or maximum value** such that a condition holds, the answer lies in a numeric range, and checking a single candidate is easy while finding the best directly is hard. Write the `check(x)` function first; if it is monotonic, binary search over the range.',
      },
      {
        kind: 'code',
        caption: 'Rotated sorted array — one half is always sorted',
        code: `int search(vector<int>& nums, int target) {
    int low = 0, high = nums.size() - 1;

    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (nums[mid] == target) return mid;

        if (nums[low] <= nums[mid]) {                    // left half is sorted
            if (nums[low] <= target && target < nums[mid]) high = mid - 1;
            else                                          low  = mid + 1;
        } else {                                         // right half is sorted
            if (nums[mid] < target && target <= nums[high]) low  = mid + 1;
            else                                            high = mid - 1;
        }
    }
    return -1;
}`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Ceiling division without floating point',
        body: '`(a + b - 1) / b` computes ⌈a/b⌉ using only integers. Using `ceil(a / (double)b)` risks precision errors on large values and is slower. This idiom appears constantly in binary-search-on-the-answer problems.',
      },
    ],
    keyTakeaways: [
      'Use `low + (high - low) / 2` and keep the loop form internally consistent.',
      'Boundary search — `while (low < high)` with `high = mid` — is the most useful form.',
      'Binary search on the answer needs a monotonic `check(x)`, not a sorted array.',
      '`(a + b - 1) / b` is integer ceiling division.',
    ],
    practice: {
      prompt: 'Write both loop forms and test each on an empty array, a one-element array, and a two-element array — the two-element case is where the `mid + 1` bug appears. Then solve Koko Eating Bananas by writing `canFinish` first and binary searching over the speed range.',
      leetcode: { title: 'Koko Eating Bananas', slug: 'koko-eating-bananas' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-18.8',
    language: 'cpp',
    summary: 'Explore a structure exhaustively, and know which traversal answers which question.',
    readMinutes: 6,
    blocks: [
      {
        kind: 'text',
        body: 'DFS goes deep down one branch before backtracking; BFS explores in rings. The practical difference comes down to one guarantee: **BFS finds shortest paths on unweighted graphs and DFS does not.** That alone decides most choices between them.',
      },
      {
        kind: 'table',
        headers: ['', 'DFS', 'BFS'],
        rows: [
          ['Structure', 'Stack (or recursion)', 'Queue'],
          ['Explores', 'One path fully, then backtracks', 'Level by level'],
          ['Shortest path (unweighted)', '**No**', '**Yes**'],
          ['Space', 'O(depth)', 'O(width)'],
          ['Best for', 'Path existence, connectivity, backtracking', 'Shortest path, level-order'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The choice, in one line',
        body: 'If the question contains "**minimum steps**", "**shortest**", or "**fewest moves**" on an unweighted graph, use BFS — it reaches every node by the shortest route first. For anything else — does a path exist, count components, explore all possibilities — DFS is simpler, especially recursively.',
      },
      { kind: 'heading', text: 'DFS' },
      {
        kind: 'code',
        caption: 'Recursive — the default',
        code: `void dfs(int node, vector<vector<int>>& adj, vector<bool>& visited) {
    visited[node] = true;
    for (int next : adj[node])
        if (!visited[next]) dfs(next, adj, visited);
}`,
      },
      {
        kind: 'code',
        caption: 'Iterative — when depth could overflow the stack',
        code: `void dfs(int start, vector<vector<int>>& adj, vector<bool>& visited) {
    stack<int> st;
    st.push(start);

    while (!st.empty()) {
        int node = st.top(); st.pop();
        if (visited[node]) continue;          // may be pushed more than once
        visited[node] = true;

        for (int next : adj[node])
            if (!visited[next]) st.push(next);
    }
}`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Iterative DFS marks on pop, BFS marks on push',
        body: 'In iterative DFS a node can be pushed by several neighbours before it is processed, so you check `visited` when popping. In BFS you must mark when **pushing**, or the queue balloons with duplicates and the same node is expanded repeatedly — enough to cause Time Limit Exceeded on a large grid.',
      },
      { kind: 'heading', text: 'BFS' },
      {
        kind: 'code',
        caption: 'With level counting',
        code: `int shortestPath(int start, int target, vector<vector<int>>& adj) {
    queue<int> q;
    vector<bool> visited(adj.size(), false);
    q.push(start);
    visited[start] = true;
    int steps = 0;

    while (!q.empty()) {
        int count = q.size();                 // snapshot BEFORE the inner loop
        for (int i = 0; i < count; i++) {
            int node = q.front(); q.pop();
            if (node == target) return steps;

            for (int next : adj[node])
                if (!visited[next]) {
                    visited[next] = true;     // mark on PUSH
                    q.push(next);
                }
        }
        steps++;                              // one increment per level
    }
    return -1;
}`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Snapshot q.size() before the level loop',
        body: 'The inner loop pushes children, so the queue grows while it runs. Writing `for (int i = 0; i < q.size(); i++)` re-reads the growing value and merges every level into one, making the step count meaningless. This one line is the difference between a working BFS and a subtly wrong one.',
      },
      { kind: 'heading', text: 'On a grid' },
      {
        kind: 'code',
        code: `int dr[] = {-1, 1, 0, 0}, dc[] = {0, 0, -1, 1};

void dfs(int r, int c, vector<vector<char>>& grid) {
    if (r < 0 || r >= grid.size() || c < 0 || c >= grid[0].size()) return;
    if (grid[r][c] != '1') return;            // wall, or already visited

    grid[r][c] = '0';                         // mark by mutating the grid
    for (int d = 0; d < 4; d++)
        dfs(r + dr[d], c + dc[d], grid);
}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Putting the bounds check inside the function',
        body: 'Checking at the top of the recursive call rather than before each of the four calls means writing the condition once instead of four times. Mutating the grid to mark visited also avoids a separate `visited` array — acceptable when the problem allows modifying the input, which LeetCode usually does.',
      },
      {
        kind: 'code',
        caption: 'Multi-source BFS',
        code: `queue<pair<int,int>> q;
for (int r = 0; r < rows; r++)
    for (int c = 0; c < cols; c++)
        if (grid[r][c] == SOURCE) q.push({r, c});     // seed EVERY source

// Then one ordinary BFS expands from all of them simultaneously.`,
      },
      {
        kind: 'text',
        body: 'Seeding all sources before the loop makes the wavefront expand from every start at once, so the level count is the time for the last cell to be reached. It turns what looks like "run a BFS per source" — O(V·E) — into a single O(V + E) pass. Rotting Oranges, 01 Matrix and Walls and Gates all use it.',
      },
    ],
    keyTakeaways: [
      'BFS gives shortest paths on unweighted graphs; DFS does not.',
      'BFS marks visited on push; iterative DFS checks visited on pop.',
      'Snapshot `q.size()` before the level loop or the levels merge.',
      'Multi-source BFS seeds every start and stays a single O(V + E) pass.',
    ],
    practice: {
      prompt: 'Solve Number of Islands with DFS, then with BFS. Then solve Rotting Oranges with multi-source BFS. Then move the `visited` marking in your BFS from push to pop and observe the queue growing — that experiment explains the rule better than the rule does.',
      leetcode: { title: 'Number of Islands', slug: 'number-of-islands' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-18.9',
    language: 'cpp',
    summary: 'Choose the right traversal and the right information flow for tree problems.',
    readMinutes: 6,
    blocks: [
      {
        kind: 'text',
        body: 'Almost every tree problem is a traversal plus a decision about *where the work goes* and *which way information flows*. Get those two right and the code is four lines.',
      },
      { kind: 'heading', text: 'The four traversals' },
      {
        kind: 'code',
        code: `// PRE-ORDER — work before the calls
void preorder(TreeNode* n) {
    if (!n) return;
    visit(n);
    preorder(n->left);
    preorder(n->right);
}

// IN-ORDER — between; on a BST this yields sorted order
void inorder(TreeNode* n) {
    if (!n) return;
    inorder(n->left);
    visit(n);
    inorder(n->right);
}

// POST-ORDER — after; you have both children's results
void postorder(TreeNode* n) {
    if (!n) return;
    postorder(n->left);
    postorder(n->right);
    visit(n);
}

// LEVEL-ORDER — a queue, not recursion`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The question that picks the traversal',
        body: 'Ask: **do I need my children\'s answers to compute mine?** If yes → post-order (depth, size, sum, balanced, diameter). If no → pre-order (copy, serialise, build a path, propagate a value downward). Sorted output from a BST → in-order. Anything organised by depth → level-order.',
      },
      { kind: 'heading', text: 'Information flowing up' },
      {
        kind: 'code',
        caption: 'Each call returns its own subtree\'s answer',
        code: `int maxDepth(TreeNode* root) {
    if (!root) return 0;
    return 1 + max(maxDepth(root->left), maxDepth(root->right));
}

int sumTree(TreeNode* root) {
    if (!root) return 0;
    return root->val + sumTree(root->left) + sumTree(root->right);
}`,
      },
      { kind: 'heading', text: 'Information flowing down' },
      {
        kind: 'code',
        caption: 'Context is passed as a parameter',
        code: `bool isValidBST(TreeNode* n, long lo = LONG_MIN, long hi = LONG_MAX) {
    if (!n) return true;
    if (n->val <= lo || n->val >= hi) return false;
    return isValidBST(n->left, lo, n->val)
        && isValidBST(n->right, n->val, hi);      // range narrows on the way down
}

void paths(TreeNode* n, string current, vector<string>& result) {
    if (!n) return;
    current += to_string(n->val);
    if (!n->left && !n->right) { result.push_back(current); return; }
    paths(n->left,  current + "->", result);
    paths(n->right, current + "->", result);
}`,
      },
      { kind: 'heading', text: 'Both at once — the pattern people find hardest' },
      {
        kind: 'code',
        caption: 'Diameter: return one thing, record another',
        code: `class Solution {
    int best = 0;

    int depth(TreeNode* node) {                  // RETURNS depth
        if (!node) return 0;
        int l = depth(node->left);
        int r = depth(node->right);
        best = max(best, l + r);                 // RECORDS the diameter
        return 1 + max(l, r);
    }

public:
    int diameterOfBinaryTree(TreeNode* root) {
        best = 0;                                // reset — the judge reuses the object
        depth(root);
        return best;
    }
};`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The return value need not be the answer',
        body: 'Here the function returns *depth* while the answer — the diameter — accumulates in a member variable. Recognising that these can differ is the key to Diameter, Maximum Path Sum, and Longest Univalue Path. Always write a comment saying what the helper returns, because it is not obvious from the name.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Reset member state in the public method',
        body: 'LeetCode may call your method several times on one `Solution` object, so `best` still holds the previous test case\'s value. The symptom is passing test 1 and failing everything after. `best = 0;` at the top of the public method fixes it.',
      },
      { kind: 'heading', text: 'Level-order and its variants' },
      {
        kind: 'code',
        code: `vector<vector<int>> levelOrder(TreeNode* root) {
    vector<vector<int>> result;
    if (!root) return result;

    queue<TreeNode*> q;
    q.push(root);

    while (!q.empty()) {
        int count = q.size();               // snapshot before the loop
        vector<int> level;
        for (int i = 0; i < count; i++) {
            TreeNode* n = q.front(); q.pop();
            level.push_back(n->val);
            if (n->left)  q.push(n->left);
            if (n->right) q.push(n->right);
        }
        result.push_back(level);
    }
    return result;
}`,
      },
      {
        kind: 'text',
        body: 'Right Side View takes the last element of each level; Zigzag reverses alternate levels; Level Averages divides each level\'s sum by its count; Minimum Depth returns the level of the first leaf. All are this loop with one line changed.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Watch the recursion depth on degenerate trees',
        body: 'A tree that is really a straight line of 10⁵ nodes gives depth 10⁵, which overflows the stack — a bare Runtime Error. Tree recursion is O(h) space, and h can equal n. When the constraints allow that many nodes, consider the iterative form.',
      },
    ],
    keyTakeaways: [
      'Post-order when you need your children\'s results; pre-order when you do not.',
      'Information flows up as return values and down as parameters — often both.',
      'A helper\'s return value may differ from the answer, as in Diameter.',
      'Reset member state in the public method; the judge reuses the object.',
    ],
    practice: {
      prompt: 'Write maxDepth (up), isValidBST (down) and Diameter (both). For Diameter, state in one sentence what `depth` returns versus what `best` records. Then write level-order and adapt it into Right Side View by changing one line.',
      leetcode: { title: 'Diameter of Binary Tree', slug: 'diameter-of-binary-tree' },
    },
  },

  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-18.10',
    language: 'cpp',
    summary: 'Handle cycles, components, ordering and weights — the four graph problem families.',
    readMinutes: 6,
    blocks: [
      {
        kind: 'text',
        body: 'Graph problems come in a small number of families. Recognising which one a problem belongs to picks the algorithm almost immediately.',
      },
      {
        kind: 'table',
        headers: ['The problem asks…', 'Use'],
        rows: [
          ['"Are these connected?", "how many groups?"', 'DFS/BFS, or Union-Find'],
          ['"Fewest steps", unweighted', 'BFS'],
          ['"Shortest path", weighted', 'Dijkstra — BFS with a heap'],
          ['"Is there a cycle?"', 'DFS with colours (directed) or Union-Find (undirected)'],
          ['"Valid ordering", "prerequisites"', 'Topological sort'],
          ['"Connect everything cheaply"', 'Minimum spanning tree — Kruskal or Prim'],
        ],
      },
      { kind: 'heading', text: 'Connected components' },
      {
        kind: 'code',
        code: `int countComponents(int n, vector<vector<int>>& adj) {
    vector<bool> visited(n, false);
    int count = 0;

    for (int i = 0; i < n; i++)
        if (!visited[i]) {
            dfs(i, adj, visited);       // one traversal reaches one whole component
            count++;
        }
    return count;
}`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'A single traversal only reaches one component',
        body: 'Starting a DFS at node 0 visits only what is reachable from node 0. Disconnected graphs need the outer loop over every node. Forgetting it gives an answer of 1 for every input — a bug that passes any connected test case.',
      },
      { kind: 'heading', text: 'Cycle detection differs by direction' },
      {
        kind: 'code',
        caption: 'Directed — three colours',
        code: `// 0 = unvisited, 1 = in progress (on the current path), 2 = done
bool hasCycle(int node, vector<vector<int>>& adj, vector<int>& state) {
    state[node] = 1;

    for (int next : adj[node]) {
        if (state[next] == 1) return true;                    // back edge → cycle
        if (state[next] == 0 && hasCycle(next, adj, state)) return true;
    }

    state[node] = 2;                    // finished — safe to revisit
    return false;
}`,
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'A plain visited flag is not enough for directed graphs',
        body: 'Meeting an already-visited node does not imply a cycle — it may just be a node you finished exploring on a different branch. Only meeting a node **currently on your path** (state 1) is a cycle. Two states give false positives on diamond-shaped graphs; three states is the correct approach.',
      },
      {
        kind: 'code',
        caption: 'Undirected — ignore the edge you came from',
        code: `bool hasCycle(int node, int parent, vector<vector<int>>& adj, vector<bool>& visited) {
    visited[node] = true;

    for (int next : adj[node]) {
        if (next == parent) continue;                  // the edge we arrived on
        if (visited[next]) return true;                // any other visit = cycle
        if (hasCycle(next, node, adj, visited)) return true;
    }
    return false;
}`,
      },
      { kind: 'heading', text: 'Topological sort' },
      {
        kind: 'code',
        caption: 'Kahn\'s algorithm — BFS on in-degrees',
        code: `vector<int> topoSort(int n, vector<vector<int>>& adj) {
    vector<int> indegree(n, 0);
    for (int u = 0; u < n; u++)
        for (int v : adj[u]) indegree[v]++;

    queue<int> q;
    for (int i = 0; i < n; i++)
        if (indegree[i] == 0) q.push(i);          // no prerequisites

    vector<int> order;
    while (!q.empty()) {
        int u = q.front(); q.pop();
        order.push_back(u);

        for (int v : adj[u])
            if (--indegree[v] == 0) q.push(v);    // its last prerequisite is done
    }

    return order.size() == n ? order : vector<int>{};   // short → there is a cycle
}`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'A short result detects the cycle for free',
        body: 'If the ordering contains fewer than n nodes, some nodes never reached in-degree 0 — they are stuck in a cycle. So Kahn\'s algorithm answers both "give me a valid order" and "is this even possible", which is exactly what Course Schedule I and II ask.',
      },
      { kind: 'heading', text: 'Dijkstra — BFS with a priority queue' },
      {
        kind: 'code',
        code: `vector<int> dijkstra(int start, int n, vector<vector<pair<int,int>>>& adj) {
    vector<int> dist(n, INT_MAX);
    priority_queue<pair<int,int>, vector<pair<int,int>>,
                   greater<pair<int,int>>> pq;      // MIN-heap of (distance, node)

    dist[start] = 0;
    pq.push({0, start});

    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d > dist[u]) continue;                  // a stale entry — skip it

        for (auto& [v, w] : adj[u])
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
    }
    return dist;
}`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Distance goes in .first, and stale entries must be skipped',
        body: 'Putting the distance first lets the default pair ordering do the work, so no custom comparator is needed. And because we push a new entry rather than updating an existing one, the heap accumulates outdated pairs — `if (d > dist[u]) continue;` discards them. Without that line the algorithm still works but does far more work than necessary.',
      },
      {
        kind: 'text',
        body: 'Note that Dijkstra requires **non-negative** weights. With negative edges you need Bellman-Ford, which is O(V·E) but handles them correctly.',
      },
    ],
    keyTakeaways: [
      'Counting components needs an outer loop over every unvisited node.',
      'Directed cycle detection needs three states; undirected needs a parent check.',
      'Kahn\'s algorithm gives a topological order and detects cycles at once.',
      'Dijkstra is BFS with a min-heap of `(distance, node)` and non-negative weights.',
    ],
    practice: {
      prompt: 'Solve Number of Provinces (components), Course Schedule (topological sort with cycle detection), and Network Delay Time (Dijkstra). Between them they cover three of the four families, and the fourth — MST — reuses the Union-Find you wrote in Chapter 17.',
      leetcode: { title: 'Course Schedule', slug: 'course-schedule' },
    },
  },
];
