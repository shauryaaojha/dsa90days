import type { Pattern } from './types';

/**
 * Arrays & strings — the five patterns that cover most Easy/Medium problems.
 * Templates across the three languages are kept line-comparable on purpose.
 */
export const arrayStringPatterns: Pattern[] = [
  // ==========================================================================
  {
    slug: 'two-pointers',
    name: 'Two Pointers',
    category: 'array-string',
    oneLiner:
      'Walk two indices through one array instead of nesting two loops — turns O(n²) into O(n).',
    triggers: [
      'The array is **sorted**, or sorting it first does not break the problem',
      '"Find a pair / triplet that sums to X"',
      '"Palindrome", "reverse in place", "compare from both ends"',
      '"Do it in O(1) extra space" on an array you are allowed to modify',
      'Two sequences you need to walk in step (merging, matching subsequences)',
    ],
    idea: [
      'A brute-force pair search tries every `(i, j)` — that is O(n²). Two pointers works because **sorted order tells you which way to move**. If `nums[l] + nums[r]` is too small, no smaller `r` can help, so the only useful move is `l++`. Every step permanently eliminates a whole row or column of the O(n²) search space, which is why the scan finishes in one pass.',
      'There are two arrangements. **Opposite ends**: `l` starts at 0, `r` at the end, and they walk toward each other — used for pair sums, palindromes and "area between two lines". **Same direction**: both start at the left, `r` scans ahead while `l` marks where the next kept element goes — used for in-place removal and de-duplication.',
      'The same-direction form is worth naming clearly: `r` is the *reader* and `l` is the *writer*. You are compacting the array in place, and `l` ends up as the new length. That is the whole trick behind every "remove X in place and return the new length" problem.',
    ],
    time: 'O(n), or O(n log n) if you must sort first',
    timeShort: 'O(n)',
    space: 'O(1)',
    template: {
      cpp: `// Opposite ends, sorted array: find a pair summing to target.
int l = 0, r = nums.size() - 1;

while (l < r) {
    int sum = nums[l] + nums[r];

    if (sum == target)      return {l, r};   // found it
    else if (sum < target)  l++;             // need bigger  -> move left up
    else                    r--;             // need smaller -> move right down
}
return {-1, -1};`,
      java: `// Opposite ends, sorted array: find a pair summing to target.
int l = 0, r = nums.length - 1;

while (l < r) {
    int sum = nums[l] + nums[r];

    if (sum == target)      return new int[]{l, r};   // found it
    else if (sum < target)  l++;                      // need bigger  -> move left up
    else                    r--;                      // need smaller -> move right down
}
return new int[]{-1, -1};`,
      python: `# Opposite ends, sorted array: find a pair summing to target.
l, r = 0, len(nums) - 1

while l < r:
    total = nums[l] + nums[r]

    if total == target:
        return [l, r]        # found it
    elif total < target:
        l += 1               # need bigger  -> move left up
    else:
        r -= 1               # need smaller -> move right down
return [-1, -1]`,
    },
    variants: [
      {
        name: 'Same direction (read / write)',
        when: 'In-place removal or de-duplication, O(1) extra space, order preserved.',
        code: {
          cpp: `// l = where the next kept element goes. r = what we are inspecting.
int l = 0;

for (int r = 0; r < nums.size(); r++) {
    if (nums[r] != val) {        // keep it
        nums[l] = nums[r];
        l++;
    }
}
return l;                        // l is the new length`,
          java: `// l = where the next kept element goes. r = what we are inspecting.
int l = 0;

for (int r = 0; r < nums.length; r++) {
    if (nums[r] != val) {        // keep it
        nums[l] = nums[r];
        l++;
    }
}
return l;                        // l is the new length`,
          python: `# l = where the next kept element goes. r = what we are inspecting.
l = 0

for r in range(len(nums)):
    if nums[r] != val:           # keep it
        nums[l] = nums[r]
        l += 1

return l                         # l is the new length`,
        },
      },
    ],
    problems: [
      {
        title: 'Two Sum II — Input Array Is Sorted',
        slug: 'two-sum-ii-input-array-is-sorted',
        difficulty: 'Medium',
        note: 'The bare template. Do this one first.',
      },
      {
        title: 'Valid Palindrome',
        slug: 'valid-palindrome',
        difficulty: 'Easy',
        note: 'Opposite ends, plus skipping characters that do not count.',
      },
      {
        title: 'Remove Duplicates from Sorted Array',
        slug: 'remove-duplicates-from-sorted-array',
        difficulty: 'Easy',
        note: 'The read/write variant, and where "return the new length" clicks.',
      },
      {
        title: '3Sum',
        slug: '3sum',
        difficulty: 'Medium',
        note: 'Fix one index, two-point the rest. The classic follow-up.',
      },
      {
        title: 'Trapping Rain Water',
        slug: 'trapping-rain-water',
        difficulty: 'Hard',
        note: 'Two pointers carrying running maxima — the hardest common form.',
      },
    ],
    pitfalls: [
      {
        title: '`l < r` versus `l <= r`',
        body: 'For pair problems use `l < r` — with `l == r` you would pair an element with itself, which almost every prompt forbids. Binary search is the opposite case and normally wants `l <= r`. Mixing the two up is the single most common two-pointer bug.',
      },
      {
        title: 'Forgetting to skip duplicates in 3Sum',
        body: 'After recording a valid triplet you must advance past every repeat of the value you just used: `while (l < r && nums[l] == nums[l+1]) l++;`. Without it you return the same triplet many times, and the failing test is usually something like `[0,0,0,0]`.',
      },
      {
        title: 'Moving both pointers on a match',
        body: 'When `sum < target` move only `l`. Advancing both skips candidate pairs and produces a wrong answer that still looks plausible on small inputs — it typically passes the samples and fails a hidden test.',
      },
      {
        title: 'Two pointers on an unsorted array',
        body: 'The technique is only valid because sorted order tells you which pointer to move. On unsorted input there is no such signal — reach for a hash map instead. If the problem asks for *indices from the original array*, sorting destroys them, so store `(value, index)` pairs before sorting.',
      },
    ],
    related: ['sliding-window', 'binary-search', 'slow-fast-pointers'],
  },

  // ==========================================================================
  {
    slug: 'sliding-window',
    name: 'Sliding Window',
    category: 'array-string',
    oneLiner:
      'Keep a contiguous run of elements and slide it, updating in O(1) instead of re-scanning.',
    triggers: [
      'The words **contiguous**, "subarray" or "substring"',
      '"Longest / shortest / maximum / minimum … such that <condition>"',
      '"Of size k" — that is the fixed-size form',
      '"At most k distinct", "no repeating characters", "sum ≥ target"',
      'A brute force of "try every subarray" would be O(n²) and n is 10⁵',
    ],
    idea: [
      'Every subarray problem has an obvious O(n²) solution: try every start, extend every end. Sliding window collapses it by noticing that when the window moves right by one, you do not need to recompute anything from scratch — **one element enters and some number leave**, so the update is O(1).',
      'The variable-size form is a three-step loop, and writing it in this order every time removes most of the bugs: **grow** (admit `s[r]`), **shrink** while the window is invalid, **record** the answer. Because the shrink loop only ever runs forward, `l` and `r` each traverse the array once — the nested `while` does *not* make it O(n²).',
      'The step that actually needs thought is "what does invalid mean, and what do I track to detect it?". A count map for distinct characters, a running sum for a sum bound, a counter of how many required characters are still missing. Get that state right and the skeleton is identical every time.',
      'For "longest" problems you record **after** shrinking (the window is valid then). For "shortest" problems you record **inside** the shrink loop, because you want the smallest still-valid window. That one-line difference is the whole distinction.',
    ],
    time: 'O(n) — each index enters and leaves the window once',
    timeShort: 'O(n)',
    space: 'O(k) for the window state',
    template: {
      cpp: `// Variable window: the LONGEST window that stays valid.
unordered_map<char,int> count;
int best = 0, l = 0;

for (int r = 0; r < s.size(); r++) {
    count[s[r]]++;                      // 1. GROW: admit s[r]

    while (count[s[r]] > 1) {           // 2. SHRINK while INVALID
        count[s[l]]--;
        l++;
    }

    best = max(best, r - l + 1);        // 3. RECORD: valid here
}
return best;`,
      java: `// Variable window: the LONGEST window that stays valid.
Map<Character,Integer> count = new HashMap<>();
int best = 0, l = 0;

for (int r = 0; r < s.length(); r++) {
    count.merge(s.charAt(r), 1, Integer::sum);      // 1. GROW: admit s[r]

    while (count.get(s.charAt(r)) > 1) {            // 2. SHRINK while INVALID
        count.merge(s.charAt(l), -1, Integer::sum);
        l++;
    }

    best = Math.max(best, r - l + 1);               // 3. RECORD: valid here
}
return best;`,
      python: `# Variable window: the LONGEST window that stays valid.
count = defaultdict(int)
best, l = 0, 0

for r, ch in enumerate(s):
    count[ch] += 1                   # 1. GROW: admit s[r]

    while count[ch] > 1:             # 2. SHRINK while INVALID
        count[s[l]] -= 1
        l += 1

    best = max(best, r - l + 1)      # 3. RECORD: valid here
return best`,
    },
    variants: [
      {
        name: 'Fixed size k',
        when: 'The prompt names the window size. No shrink loop — the window just slides.',
        code: {
          cpp: `int sum = 0, best = INT_MIN;

for (int r = 0; r < nums.size(); r++) {
    sum += nums[r];                      // element enters

    if (r >= k) sum -= nums[r - k];      // element leaves
    if (r >= k - 1) best = max(best, sum);   // window is full
}
return best;`,
          java: `int sum = 0, best = Integer.MIN_VALUE;

for (int r = 0; r < nums.length; r++) {
    sum += nums[r];                      // element enters

    if (r >= k) sum -= nums[r - k];      // element leaves
    if (r >= k - 1) best = Math.max(best, sum);   // window is full
}
return best;`,
          python: `total, best = 0, float("-inf")

for r in range(len(nums)):
    total += nums[r]                     # element enters

    if r >= k:
        total -= nums[r - k]             # element leaves
    if r >= k - 1:
        best = max(best, total)          # window is full
return best`,
        },
      },
      {
        name: 'Shortest valid window',
        when: '"Minimum size subarray with sum ≥ target". Record *inside* the shrink loop.',
        code: {
          cpp: `int sum = 0, best = INT_MAX, l = 0;

for (int r = 0; r < nums.size(); r++) {
    sum += nums[r];                        // GROW

    while (sum >= target) {                // SHRINK while STILL VALID
        best = min(best, r - l + 1);       // RECORD inside
        sum -= nums[l];
        l++;
    }
}
return best == INT_MAX ? 0 : best;`,
          java: `int sum = 0, best = Integer.MAX_VALUE, l = 0;

for (int r = 0; r < nums.length; r++) {
    sum += nums[r];                        // GROW

    while (sum >= target) {                // SHRINK while STILL VALID
        best = Math.min(best, r - l + 1);  // RECORD inside
        sum -= nums[l];
        l++;
    }
}
return best == Integer.MAX_VALUE ? 0 : best;`,
          python: `total, best, l = 0, float("inf"), 0

for r in range(len(nums)):
    total += nums[r]                       # GROW

    while total >= target:                 # SHRINK while STILL VALID
        best = min(best, r - l + 1)        # RECORD inside
        total -= nums[l]
        l += 1

return 0 if best == float("inf") else best`,
        },
      },
    ],
    problems: [
      {
        title: 'Maximum Average Subarray I',
        slug: 'maximum-average-subarray-i',
        difficulty: 'Easy',
        note: 'The fixed-size form, stripped to its bones.',
      },
      {
        title: 'Longest Substring Without Repeating Characters',
        slug: 'longest-substring-without-repeating-characters',
        difficulty: 'Medium',
        note: 'The canonical variable window — this is the template above.',
      },
      {
        title: 'Minimum Size Subarray Sum',
        slug: 'minimum-size-subarray-sum',
        difficulty: 'Medium',
        note: 'The "shortest" variant, where you record inside the shrink loop.',
      },
      {
        title: 'Permutation in String',
        slug: 'permutation-in-string',
        difficulty: 'Medium',
        note: 'Fixed window plus a frequency comparison.',
      },
      {
        title: 'Minimum Window Substring',
        slug: 'minimum-window-substring',
        difficulty: 'Hard',
        note: 'The boss fight. A "how many required chars am I still missing" counter.',
      },
    ],
    pitfalls: [
      {
        title: 'Window length is `r - l + 1`, not `r - l`',
        body: 'Both indices are inclusive. Dropping the `+ 1` gives an answer that is consistently one too small — it often still passes the first sample, which makes it hard to spot.',
      },
      {
        title: 'Recording the answer in the wrong place',
        body: 'For "longest", record after the shrink loop, when the window is valid. For "shortest", record inside it, before you shrink further. Swapping them produces answers that are wrong in one direction only.',
      },
      {
        title: 'Sliding window on an array with negative numbers',
        body: 'The "sum ≥ target" shrink logic assumes growing the window never *decreases* the sum. With negative values that assumption breaks and the window can be shrunk wrongly. Use prefix sums with a hash map instead.',
      },
      {
        title: 'Leaving stale keys in the count map',
        body: 'In C++ and Python a count can hit 0 but the key stays in the map, so `map.size()` overstates the number of distinct characters. If you are testing "at most k distinct" by size, erase the key when its count reaches 0.',
      },
    ],
    related: ['two-pointers', 'hash-map-set', 'prefix-sum'],
  },

  // ==========================================================================
  {
    slug: 'hash-map-set',
    name: 'Hash Map / Set',
    category: 'array-string',
    oneLiner:
      'Trade memory for time — remember what you have seen so lookups become O(1).',
    triggers: [
      '"Have I seen this before?" — duplicates, anagram groups, first unique',
      '"Count the occurrences of…" — a frequency map',
      'A brute force whose inner loop is a *search* ("does the array contain target - x?")',
      '"Group by" some derived key',
      'You need the *index* of a value, not just whether it exists',
    ],
    idea: [
      'Most O(n²) solutions have an inner loop that is really a search: "for each x, does the rest of the array contain something?". A hash map converts that search from O(n) to O(1), so the whole algorithm drops to O(n). Recognising the inner loop as a lookup is the entire skill.',
      'The one-pass Two Sum trick is worth internalising as a shape, not a special case: **look before you insert**. Check whether the complement is already in the map, and only then add the current element. That ordering is what stops an element from pairing with itself, and it removes the need for a second pass.',
      'When you need *grouping* rather than lookup, the key is something you derive: the sorted letters of a word for anagrams, `row/3 * 3 + col/3` for sudoku boxes, `(r - c)` for a diagonal. Choosing that derived key is usually the whole problem.',
      'Reach for a **set** when you only care about presence, a **map** when you need a count or an index attached. Order almost never matters — if it does, you want a `TreeMap`/`map`/`SortedDict` instead, and the complexity becomes O(log n) per operation.',
    ],
    time: 'O(n) average — O(1) per lookup',
    timeShort: 'O(n) avg',
    space: 'O(n)',
    template: {
      cpp: `// Two Sum in one pass: look BEFORE you insert.
unordered_map<int,int> seen;              // value -> index

for (int i = 0; i < nums.size(); i++) {
    int need = target - nums[i];

    if (seen.count(need))                 // look first...
        return {seen[need], i};

    seen[nums[i]] = i;                    // ...then insert
}
return {};`,
      java: `// Two Sum in one pass: look BEFORE you insert.
Map<Integer,Integer> seen = new HashMap<>();   // value -> index

for (int i = 0; i < nums.length; i++) {
    int need = target - nums[i];

    if (seen.containsKey(need))                // look first...
        return new int[]{seen.get(need), i};

    seen.put(nums[i], i);                      // ...then insert
}
return new int[]{};`,
      python: `# Two Sum in one pass: look BEFORE you insert.
seen = {}                            # value -> index

for i, x in enumerate(nums):
    need = target - x

    if need in seen:                 # look first...
        return [seen[need], i]

    seen[x] = i                      # ...then insert
return []`,
    },
    variants: [
      {
        name: 'Frequency map',
        when: 'Counting occurrences — anagrams, majority element, "k most frequent".',
        code: {
          cpp: `unordered_map<char,int> freq;
for (char c : s) freq[c]++;          // missing keys default to 0

for (auto& [ch, n] : freq)
    if (n == 1) return ch;`,
          java: `Map<Character,Integer> freq = new HashMap<>();
for (char c : s.toCharArray())
    freq.merge(c, 1, Integer::sum);  // insert-or-add in one call

for (var e : freq.entrySet())
    if (e.getValue() == 1) return e.getKey();`,
          python: `from collections import Counter

freq = Counter(s)                    # the whole loop, in one call

for ch, n in freq.items():
    if n == 1:
        return ch`,
        },
      },
      {
        name: 'Group by a derived key',
        when: 'Anagram grouping, and anything phrased as "group all X that share Y".',
        code: {
          cpp: `unordered_map<string, vector<string>> groups;

for (auto& w : words) {
    string key = w;
    sort(key.begin(), key.end());    // the derived key
    groups[key].push_back(w);        // operator[] default-constructs
}`,
          java: `Map<String, List<String>> groups = new HashMap<>();

for (String w : words) {
    char[] k = w.toCharArray();
    Arrays.sort(k);                              // the derived key
    groups.computeIfAbsent(new String(k), x -> new ArrayList<>()).add(w);
}`,
          python: `from collections import defaultdict

groups = defaultdict(list)

for w in words:
    key = "".join(sorted(w))         # the derived key
    groups[key].append(w)            # defaultdict makes the list`,
        },
      },
    ],
    problems: [
      {
        title: 'Two Sum',
        slug: 'two-sum',
        difficulty: 'Easy',
        note: 'The template. Every DSA journey starts here.',
      },
      {
        title: 'Contains Duplicate',
        slug: 'contains-duplicate',
        difficulty: 'Easy',
        note: 'A set, and nothing else.',
      },
      {
        title: 'Group Anagrams',
        slug: 'group-anagrams',
        difficulty: 'Medium',
        note: 'The derived-key idea in its purest form.',
      },
      {
        title: 'Longest Consecutive Sequence',
        slug: 'longest-consecutive-sequence',
        difficulty: 'Medium',
        note: 'A set turns an O(n log n) sort into O(n) — only start counting at run starts.',
      },
      {
        title: 'LRU Cache',
        slug: 'lru-cache',
        difficulty: 'Medium',
        note: 'Hash map plus doubly linked list. The classic design question.',
      },
    ],
    pitfalls: [
      {
        title: 'Inserting before looking, in Two Sum',
        body: 'If you insert `nums[i]` first and then search for `target - nums[i]`, an element whose value is exactly half the target matches itself and you return `[i, i]`. Always look first, then insert.',
      },
      {
        title: 'C++ `operator[]` inserts on read',
        body: '`if (mp[x] > 0)` on an `unordered_map` *creates* `x` with value 0, silently growing the map and breaking any later `size()` or iteration. Use `mp.count(x)` or `mp.find(x)` to test. Python `defaultdict` has exactly the same footgun.',
      },
      {
        title: 'Comparing boxed integers with `==` in Java',
        body: '`Integer a = 200, b = 200; a == b` is `false` — outside the −128..127 cache you are comparing references. Always `.equals()`, or unbox to `int` first. This bites hardest when comparing values pulled out of a `Map<Integer,Integer>`.',
      },
      {
        title: 'Assuming iteration order',
        body: '`unordered_map`, `HashMap` and (pre-3.7 semantics) `dict` make no ordering promise you should lean on. If the expected output is ordered, sort explicitly or use the tree-based container.',
      },
    ],
    related: ['prefix-sum', 'sliding-window', 'trie'],
  },

  // ==========================================================================
  {
    slug: 'prefix-sum',
    name: 'Prefix Sum',
    category: 'array-string',
    oneLiner:
      'Precompute running totals so any range sum becomes one subtraction.',
    triggers: [
      '"Sum of the subarray between i and j", asked many times',
      '"How many subarrays sum to k"',
      '"Range query" on an array that does not change',
      'Sliding window fails because the array has **negative numbers**',
      '"Product except self", "running total", "balance point"',
    ],
    idea: [
      'Build `pre[i]` = sum of the first `i` elements. Then the sum of `nums[l..r]` is `pre[r+1] - pre[l]` — O(1) per query after one O(n) pass. Using a prefix array of length `n + 1` with `pre[0] = 0` removes every special case for `l == 0`, and is worth doing every time.',
      'The powerful version pairs prefix sums with a **hash map**. To count subarrays summing to `k`: as you scan, the number of subarrays ending here equals how many earlier prefixes had value `running - k`. So you keep a map from prefix value to how many times it has occurred. This is the technique that handles negative numbers, where sliding window cannot.',
      'Seed that map with `{0: 1}` before the loop. That single entry represents the empty prefix and is what lets a subarray starting at index 0 be counted. Forgetting it is *the* classic bug in this pattern.',
      'The same idea generalises: prefix XOR for "subarray with XOR k", prefix counts for "equal numbers of 0s and 1s" (map 0 to −1 and look for a repeated running sum), and 2-D prefix sums for submatrix queries.',
    ],
    time: 'O(n) to build, O(1) per query',
    timeShort: 'O(n)',
    space: 'O(n)',
    template: {
      cpp: `// Count subarrays summing to k. Works with negative numbers.
unordered_map<long long,int> seen;
seen[0] = 1;                      // the empty prefix — do NOT omit

long long running = 0;
int count = 0;

for (int x : nums) {
    running += x;

    if (seen.count(running - k))          // a prefix that closes a valid subarray
        count += seen[running - k];

    seen[running]++;
}
return count;`,
      java: `// Count subarrays summing to k. Works with negative numbers.
Map<Long,Integer> seen = new HashMap<>();
seen.put(0L, 1);                  // the empty prefix — do NOT omit

long running = 0;
int count = 0;

for (int x : nums) {
    running += x;

    count += seen.getOrDefault(running - k, 0);   // prefixes that close a subarray

    seen.merge(running, 1, Integer::sum);
}
return count;`,
      python: `# Count subarrays summing to k. Works with negative numbers.
seen = defaultdict(int)
seen[0] = 1                       # the empty prefix — do NOT omit

running = 0
count = 0

for x in nums:
    running += x

    count += seen[running - k]    # prefixes that close a valid subarray

    seen[running] += 1
return count`,
    },
    variants: [
      {
        name: 'Range-sum array',
        when: 'Many "sum of i..j" queries on an array that never changes.',
        code: {
          cpp: `vector<long long> pre(nums.size() + 1, 0);       // pre[0] = 0

for (int i = 0; i < nums.size(); i++)
    pre[i + 1] = pre[i] + nums[i];

// sum of nums[l..r] inclusive:
long long sum = pre[r + 1] - pre[l];`,
          java: `long[] pre = new long[nums.length + 1];          // pre[0] = 0

for (int i = 0; i < nums.length; i++)
    pre[i + 1] = pre[i] + nums[i];

// sum of nums[l..r] inclusive:
long sum = pre[r + 1] - pre[l];`,
          python: `pre = [0] * (len(nums) + 1)                     # pre[0] = 0

for i, x in enumerate(nums):
    pre[i + 1] = pre[i] + x

# sum of nums[l..r] inclusive:
total = pre[r + 1] - pre[l]

# or, in one line:
# pre = list(accumulate(nums, initial=0))`,
        },
      },
    ],
    problems: [
      {
        title: 'Running Sum of 1d Array',
        slug: 'running-sum-of-1d-array',
        difficulty: 'Easy',
        note: 'Literally just building the prefix array.',
      },
      {
        title: 'Find Pivot Index',
        slug: 'find-pivot-index',
        difficulty: 'Easy',
        note: 'Left sum vs right sum — prefix thinking without the map.',
      },
      {
        title: 'Subarray Sum Equals K',
        slug: 'subarray-sum-equals-k',
        difficulty: 'Medium',
        note: 'The template. The `{0: 1}` seed is the whole lesson.',
      },
      {
        title: 'Product of Array Except Self',
        slug: 'product-of-array-except-self',
        difficulty: 'Medium',
        note: 'Prefix and suffix passes, no division.',
      },
      {
        title: 'Contiguous Array',
        slug: 'contiguous-array',
        difficulty: 'Medium',
        note: 'Map 0 to −1, then look for a repeated running sum.',
      },
    ],
    pitfalls: [
      {
        title: 'Forgetting the `{0: 1}` seed',
        body: 'Without it, any subarray that starts at index 0 goes uncounted. The symptom is an answer exactly one too low on inputs where the prefix itself equals `k` — and the first sample often still passes.',
      },
      {
        title: 'Off-by-one between `pre` and `nums`',
        body: 'With `pre` of length `n + 1`, the sum of `nums[l..r]` is `pre[r+1] - pre[l]`. Writing `pre[r] - pre[l]` drops the last element. Keep `pre[i]` meaning "sum of the first i elements" and the indices follow.',
      },
      {
        title: 'Integer overflow on the running total',
        body: 'With `n = 10⁵` and values up to 10⁴ the total exceeds a 32-bit `int`. Use `long long` in C++ and `long` in Java. Python integers are arbitrary precision, so this is one of the rare cases where Python is simply safer.',
      },
      {
        title: 'Counting instead of adding',
        body: 'Write `count += seen[running - k]`, not `count++`. Several earlier prefixes can have the same value, and each one closes a distinct valid subarray.',
      },
    ],
    related: ['hash-map-set', 'sliding-window', 'bit-manipulation'],
  },

  // ==========================================================================
  {
    slug: 'monotonic-stack',
    name: 'Monotonic Stack',
    category: 'array-string',
    oneLiner:
      'A stack kept sorted, so "the next element bigger than me" falls out in O(n) total.',
    triggers: [
      '"Next greater element", "previous smaller element", "days until warmer"',
      '"Largest rectangle", "how far can this span extend before something blocks it"',
      '"Stock span", "visible buildings", "sunset view"',
      'A brute force of "for each i, scan right until…" that is O(n²)',
      'Parentheses / bracket matching (the plain-stack cousin)',
    ],
    idea: [
      'Keep a stack whose values are always in order — decreasing, say. When a new element arrives that breaks the order, everything it beats is popped, and **the new element is exactly the "next greater" for each popped item**. That is the entire pattern: the pop is where the answer gets recorded.',
      'It is O(n) despite the inner `while` loop, and the reason is worth stating precisely: each index is pushed once and popped once, so the total number of pop operations across the whole run is at most n. Amortised, the inner loop is free.',
      'Choose the direction from what you need. **Decreasing stack** (pop while the top is smaller) finds the next greater element. **Increasing stack** finds the next smaller. Whether you iterate left-to-right or right-to-left, and whether you store indices or values, follows from the question — storing **indices** is almost always more useful, because you can recover distances.',
      'The histogram family is the same machine with a twist: when you pop a bar, the popped bar\'s rectangle is bounded on the right by the current index and on the left by whatever is now on top of the stack. Getting that width formula right is the only hard part of Largest Rectangle in Histogram.',
    ],
    time: 'O(n) — each index pushed and popped once',
    timeShort: 'O(n)',
    space: 'O(n)',
    template: {
      cpp: `// Next greater element to the right. Stack holds INDICES, values decreasing.
vector<int> res(nums.size(), -1);
stack<int> st;

for (int i = 0; i < nums.size(); i++) {
    // nums[i] is the next greater element for everything it beats
    while (!st.empty() && nums[st.top()] < nums[i]) {
        res[st.top()] = nums[i];
        st.pop();
    }
    st.push(i);
}
// whatever is left on the stack has no greater element -> stays -1
return res;`,
      java: `// Next greater element to the right. Stack holds INDICES, values decreasing.
int[] res = new int[nums.length];
Arrays.fill(res, -1);
Deque<Integer> st = new ArrayDeque<>();

for (int i = 0; i < nums.length; i++) {
    // nums[i] is the next greater element for everything it beats
    while (!st.isEmpty() && nums[st.peek()] < nums[i]) {
        res[st.pop()] = nums[i];
    }
    st.push(i);
}
// whatever is left on the stack has no greater element -> stays -1
return res;`,
      python: `# Next greater element to the right. Stack holds INDICES, values decreasing.
res = [-1] * len(nums)
st = []

for i, x in enumerate(nums):
    # x is the next greater element for everything it beats
    while st and nums[st[-1]] < x:
        res[st.pop()] = x
    st.append(i)

# whatever is left on the stack has no greater element -> stays -1
return res`,
    },
    variants: [
      {
        name: 'Monotonic deque (sliding window maximum)',
        when: 'You need the max/min of a *moving window*, not of the whole array.',
        code: {
          cpp: `deque<int> dq;                  // indices, values decreasing
vector<int> res;

for (int i = 0; i < nums.size(); i++) {
    if (!dq.empty() && dq.front() <= i - k) dq.pop_front();   // drop out-of-window

    while (!dq.empty() && nums[dq.back()] < nums[i]) dq.pop_back();
    dq.push_back(i);

    if (i >= k - 1) res.push_back(nums[dq.front()]);          // front = window max
}
return res;`,
          java: `Deque<Integer> dq = new ArrayDeque<>();   // indices, values decreasing
int[] res = new int[nums.length - k + 1];

for (int i = 0; i < nums.length; i++) {
    if (!dq.isEmpty() && dq.peekFirst() <= i - k) dq.pollFirst();  // out-of-window

    while (!dq.isEmpty() && nums[dq.peekLast()] < nums[i]) dq.pollLast();
    dq.addLast(i);

    if (i >= k - 1) res[i - k + 1] = nums[dq.peekFirst()];         // front = max
}
return res;`,
          python: `from collections import deque

dq = deque()                    # indices, values decreasing
res = []

for i, x in enumerate(nums):
    if dq and dq[0] <= i - k:
        dq.popleft()            # drop out-of-window

    while dq and nums[dq[-1]] < x:
        dq.pop()
    dq.append(i)

    if i >= k - 1:
        res.append(nums[dq[0]])  # front = window max
return res`,
        },
      },
    ],
    problems: [
      {
        title: 'Valid Parentheses',
        slug: 'valid-parentheses',
        difficulty: 'Easy',
        note: 'Plain stack — the warm-up that makes the mechanics obvious.',
      },
      {
        title: 'Next Greater Element I',
        slug: 'next-greater-element-i',
        difficulty: 'Easy',
        note: 'The template, with a map layered on top.',
      },
      {
        title: 'Daily Temperatures',
        slug: 'daily-temperatures',
        difficulty: 'Medium',
        note: 'The template storing indices, so you can subtract for a distance.',
      },
      {
        title: 'Sliding Window Maximum',
        slug: 'sliding-window-maximum',
        difficulty: 'Hard',
        note: 'The monotonic deque variant.',
      },
      {
        title: 'Largest Rectangle in Histogram',
        slug: 'largest-rectangle-in-histogram',
        difficulty: 'Hard',
        note: 'The width formula on pop is the whole difficulty.',
      },
    ],
    pitfalls: [
      {
        title: 'Storing values instead of indices',
        body: 'Store indices. "Daily Temperatures" wants `i - st.top()`, and the histogram width needs positions. You can always read the value back with `nums[idx]`, but you cannot recover an index from a value.',
      },
      {
        title: '`<` versus `<=` when popping',
        body: 'With duplicates this decides whether equal elements pop each other. For "next *strictly* greater" use `<`. Getting it wrong usually still passes on distinct inputs and fails only on a test with repeats.',
      },
      {
        title: 'Leaving the stack unhandled at the end',
        body: 'Indices still on the stack after the loop have no next-greater element. Either pre-fill the result with the sentinel (as above) or drain the stack afterwards — silently doing neither leaves garbage values.',
      },
      {
        title: 'Java: using `Stack` instead of `ArrayDeque`',
        body: '`java.util.Stack` extends `Vector`, so every method is synchronised and slower, and its iteration order is bottom-to-top, which surprises people. `ArrayDeque` is the modern choice for both stack and queue.',
      },
    ],
    related: ['sliding-window', 'two-pointers', 'greedy'],
  },
];
