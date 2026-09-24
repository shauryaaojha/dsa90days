import type { SharedLesson } from './types';

/**
 * Tries and String Algorithms — Master prefix tree node representation and insertion,
 * exact word search and prefix search, bottom-up node deletion with memory pruning,
 * frequency augmentation for prefix counting and autocomplete, rolling hashes with
 * Rabin-Karp substring matching, and the KMP prefix function (LPS array).
 */
export const lessons: SharedLesson[] = [
  // =========================================================================
  // Lesson 1: Trie node and insert
  // =========================================================================
  {
    sub: 1,
    summary: 'Construct a trie node and insert words character by character along shared prefix paths.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A **trie**, also known as a **prefix tree**, is a tree-based search data structure designed to store and retrieve collections of strings. In a standard hash table, storing strings requires hashing the entire string of length L in O(L) time, and identical prefixes between words like "cat", "cater", and "cattle" are duplicated in memory across separate buckets. A trie resolves this by storing strings along character pathways where words sharing a common prefix traverse the exact same sequence of ancestor nodes. Each node stores an array of 26 child pointers for lowercase letters \'a\' through \'z\' indexed by `ch - \'a\'`, along with a boolean flag `isEnd`. To insert a word, start at the root, allocate child nodes whenever links are missing, and mark `isEnd = true` at the final node.',
      },
      {
        kind: 'code',
        caption: 'Trie node declaration and word insertion',
        code: {
          cpp: `#include <bits/stdc++.h>
using namespace std;

struct TrieNode {
    TrieNode* children[26] = {};
    bool isEnd = false;
};

class Trie {
    TrieNode* root = new TrieNode();
public:
    void insert(const string& word) {
        TrieNode* curr = root;
        for (char ch : word) {
            int idx = ch - 'a';
            if (!curr->children[idx]) curr->children[idx] = new TrieNode();
            curr = curr->children[idx];
        }
        curr->isEnd = true;
    }
};`,
          java: `public class Trie {
    static class TrieNode {
        TrieNode[] children = new TrieNode[26];
        boolean isEnd = false;
    }
    private final TrieNode root = new TrieNode();

    public void insert(String word) {
        TrieNode curr = root;
        for (char ch : word.toCharArray()) {
            int idx = ch - 'a';
            if (curr.children[idx] == null) curr.children[idx] = new TrieNode();
            curr = curr.children[idx];
        }
        curr.isEnd = true;
    }
}`,
          python: `class TrieNode:
    def __init__(self):
        self.children: dict[str, TrieNode] = {}
        self.is_end: bool = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        curr = self.root
        for ch in word:
            if ch not in curr.children:
                curr.children[ch] = TrieNode()
            curr = curr.children[ch]
        curr.is_end = True`,
        },
      },
      { kind: 'heading', text: 'Time and space complexity' },
      {
        kind: 'table',
        headers: ['Operation', 'Time Complexity', 'Auxiliary Space', 'Details'],
        rows: [
          ['Node creation', 'O(Σ)', 'O(Σ)', 'Σ is alphabet size (26 for lowercase English letters)'],
          ['Insert word of length L', 'O(L)', 'O(L × Σ)', 'Allocates at most L new nodes; existing prefixes reuse nodes'],
          ['Prefix node sharing', 'O(1) amortized', 'O(1)', 'Words with identical prefixes share all initial ancestor nodes'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Storing characters directly inside nodes',
        body: 'A frequent error is defining a `char val` variable inside each TrieNode. The root node represents an empty prefix and holds no character. Characters belong to the edges connecting nodes, which correspond to array indices or dictionary keys. Storing characters inside nodes wastes memory and makes root initialization inconsistent.',
      },
    ],
    keyTakeaways: [
      'A trie stores words hierarchically so that shared prefixes share the same sequence of nodes.',
      'Edges or array indices represent characters; nodes store child links and an end-of-word flag.',
      'Insertion runs in O(L) time where L is the string length, allocating nodes only for new branches.',
      'The isEnd boolean distinguishes completed words from prefix subpaths.',
    ],
    practice: {
      prompt: 'Implement a trie supporting the insert operation. Store lowercase English words and confirm that inserting "car" and "card" reuses existing prefix nodes for the shared letters.',
      leetcode: { title: 'Implement Trie (Prefix Tree)', slug: 'implement-trie-prefix-tree' },
    },
  },

  // =========================================================================
  // Lesson 2: Search and prefix search
  // =========================================================================
  {
    sub: 2,
    summary: 'Search for whole words and prefix matches in O(L) time by traversing trie pathways.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Once a dictionary of strings is inserted into a trie, querying words is deterministic and efficient. A trie naturally handles two distinct query types: **exact word search** (verifying whether a complete word exists in the dictionary) and **prefix search** (verifying whether any word starts with a given prefix). Both operations walk down the tree following one character at a time in O(L) time where L is the query length. If any child pointer along the query path is null, the string is absent and both operations return `false`. The key difference lies in the termination condition: `startsWith(prefix)` succeeds immediately upon reaching the end of the prefix path, whereas `search(word)` also requires the terminal node\'s `isEnd` flag to be `true`.',
      },
      {
        kind: 'code',
        caption: 'Word search and prefix search implementation',
        code: {
          cpp: `#include <bits/stdc++.h>
using namespace std;

struct TrieNode {
    TrieNode* children[26] = {};
    bool isEnd = false;
};

class Trie {
    TrieNode* root = new TrieNode();
public:
    bool search(const string& word) {
        TrieNode* curr = root;
        for (char ch : word) {
            int idx = ch - 'a';
            if (!curr->children[idx]) return false;
            curr = curr->children[idx];
        }
        return curr->isEnd;
    }

    bool startsWith(const string& prefix) {
        TrieNode* curr = root;
        for (char ch : prefix) {
            int idx = ch - 'a';
            if (!curr->children[idx]) return false;
            curr = curr->children[idx];
        }
        return true;
    }
};`,
          java: `public class Trie {
    static class TrieNode {
        TrieNode[] children = new TrieNode[26];
        boolean isEnd = false;
    }
    private final TrieNode root = new TrieNode();

    public boolean search(String word) {
        TrieNode curr = root;
        for (char ch : word.toCharArray()) {
            int idx = ch - 'a';
            if (curr.children[idx] == null) return false;
            curr = curr.children[idx];
        }
        return curr.isEnd;
    }

    public boolean startsWith(String prefix) {
        TrieNode curr = root;
        for (char ch : prefix.toCharArray()) {
            int idx = ch - 'a';
            if (curr.children[idx] == null) return false;
            curr = curr.children[idx];
        }
        return true;
    }
}`,
          python: `class TrieNode:
    def __init__(self):
        self.children: dict[str, TrieNode] = {}
        self.is_end: bool = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def search(self, word: str) -> bool:
        curr = self.root
        for ch in word:
            if ch not in curr.children:
                return False
            curr = curr.children[ch]
        return curr.is_end

    def starts_with(self, prefix: str) -> bool:
        curr = self.root
        for ch in prefix:
            if ch not in curr.children:
                return False
            curr = curr.children[ch]
        return True`,
        },
      },
      { kind: 'heading', text: 'Query cost comparison' },
      {
        kind: 'table',
        headers: ['Data Structure', 'Exact Search Time', 'Prefix Search Time', 'Space Trade-off'],
        rows: [
          ['Hash Set', 'O(L) average', 'O(N × L) full scan', 'No prefix sharing; cannot query prefixes efficiently'],
          ['Sorted Array', 'O(L × log N)', 'O(L × log N)', 'Compact memory; binary search requires sorted order'],
          ['Trie', 'O(L)', 'O(L)', 'Pointer overhead per node; optimal for prefix searches'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Treating node existence as word presence',
        body: 'Traversing a complete character path does not prove the word was inserted. For instance, if the trie contains "painting", all nodes for "p-a-i-n-t" exist. Searching for "paint" navigates to a valid node, but its `isEnd` flag is false unless "paint" was independently inserted. Forgetting to inspect `curr.isEnd` returns false positives on prefix fragments.',
      },
    ],
    keyTakeaways: [
      'Search and prefix search both execute in O(L) time, where L is query length.',
      'Exact search requires both an unbroken character path and isEnd == true at the terminal node.',
      'Prefix search requires only an unbroken character path; isEnd can be true or false.',
      'Tries avoid scanning the whole dataset, making them superior to hash tables for prefix queries.',
    ],
    practice: {
      prompt: 'Implement a complete trie supporting insert, search, and startsWith. Test edge cases where a short queried word is an uninserted prefix of a longer stored word.',
      leetcode: { title: 'Implement Trie (Prefix Tree)', slug: 'implement-trie-prefix-tree' },
    },
  },

  // =========================================================================
  // Lesson 3: Delete from a trie
  // =========================================================================
  {
    sub: 3,
    summary: 'Delete words from a trie recursively while unsetting end flags and pruning unused branch nodes.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Deleting a word from a trie requires more care than insertion or search. Setting `isEnd = false` at the terminal node logically removes the word from the dictionary. However, if that terminal node has no children and is not part of any other stored word, leaving it allocated leaves **dangling nodes** that leak memory. A complete deletion unmarks the word and prunes all nodes that have become unnecessary, working bottom-up from leaf to root. When deleting a word of length L, recursion traverses to the terminal node and prunes on return: if the word is absent, it aborts; if it is a prefix of a longer word, only `isEnd` is cleared; if it has unique nodes with no children, they are pruned until reaching an ancestor with other children or with `isEnd == true`.',
      },
      {
        kind: 'code',
        caption: 'Recursive trie deletion with bottom-up pruning',
        code: {
          cpp: `#include <bits/stdc++.h>
using namespace std;

struct TrieNode {
    TrieNode* children[26] = {};
    bool isEnd = false;
};

class Trie {
    TrieNode* root = new TrieNode();

    bool hasChildren(TrieNode* node) {
        for (int i = 0; i < 26; i++) {
            if (node->children[i]) return true;
        }
        return false;
    }

    bool removeHelper(TrieNode* curr, const string& word, int depth) {
        if (!curr) return false;
        if (depth == (int)word.size()) {
            if (!curr->isEnd) return false;
            curr->isEnd = false;
            return !hasChildren(curr);
        }
        int idx = word[depth] - 'a';
        if (!curr->children[idx]) return false;

        if (removeHelper(curr->children[idx], word, depth + 1)) {
            delete curr->children[idx];
            curr->children[idx] = nullptr;
            return !curr->isEnd && !hasChildren(curr);
        }
        return false;
    }
public:
    bool remove(const string& word) {
        return removeHelper(root, word, 0);
    }
};`,
          java: `public class Trie {
    static class TrieNode {
        TrieNode[] children = new TrieNode[26];
        boolean isEnd = false;
    }
    private final TrieNode root = new TrieNode();

    private boolean hasChildren(TrieNode node) {
        for (TrieNode child : node.children) {
            if (child != null) return true;
        }
        return false;
    }

    private boolean removeHelper(TrieNode curr, String word, int depth) {
        if (curr == null) return false;
        if (depth == word.length()) {
            if (!curr.isEnd) return false;
            curr.isEnd = false;
            return !hasChildren(curr);
        }
        int idx = word.charAt(depth) - 'a';
        if (curr.children[idx] == null) return false;

        if (removeHelper(curr.children[idx], word, depth + 1)) {
            curr.children[idx] = null;
            return !curr.isEnd && !hasChildren(curr);
        }
        return false;
    }

    public boolean remove(String word) {
        return removeHelper(root, word, 0);
    }
}`,
          python: `class TrieNode:
    def __init__(self):
        self.children: dict[str, TrieNode] = {}
        self.is_end: bool = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def remove(self, word: str) -> bool:
        def helper(curr: TrieNode, depth: int) -> bool:
            if depth == len(word):
                if not curr.is_end:
                    return False
                curr.is_end = False
                return len(curr.children) == 0

            ch = word[depth]
            if ch not in curr.children:
                return False

            if helper(curr.children[ch], depth + 1):
                del curr.children[ch]
                return not curr.is_end and len(curr.children) == 0
            return False

        return helper(self.root, 0)`,
        },
      },
      { kind: 'heading', text: 'Deletion operation complexity' },
      {
        kind: 'table',
        headers: ['Scenario', 'Terminal Node Action', 'Pruning Behaviour', 'Time Complexity'],
        rows: [
          ['Word not found', 'No change', 'Returns false early; no node pruned', 'O(L)'],
          ['Word is prefix of another', 'Unset isEnd to false', 'No nodes pruned; child branches preserved', 'O(L)'],
          ['Word has unique suffix', 'Unset isEnd to false', 'Prunes unique nodes up to branch point', 'O(L)'],
          ['Word shares no letters', 'Unset isEnd to false', 'Prunes all nodes from leaf back to root child', 'O(L)'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Pruning nodes that belong to other words',
        body: 'Pruning must halt immediately when a node either has remaining children or has `isEnd == true`. For instance, when deleting "apple", nodes for \'e\', \'l\', and the second \'p\' are pruned, but if "app" is also stored, the second \'p\' has `isEnd == true` and must not be pruned. Deleting past an active prefix corrupts other words in the trie.',
      },
    ],
    keyTakeaways: [
      'Deleting from a trie requires a post-order traversal to prune unused nodes from bottom to top.',
      'If a deleted word is an internal prefix of another word, only its isEnd flag is cleared.',
      'Nodes can only be pruned if they have no remaining children and their isEnd flag is false.',
      'Deletion runs in O(L) time and consumes O(L) call stack space during recursive unwinding.',
    ],
    practice: {
      prompt: 'Implement insert, search, and delete in a trie. Verify that deleting "apple" leaves "app" intact and searchable, while deleting "app" removes "app" without deleting the "apple" branch.',
      leetcode: { title: 'Implement Trie II (Prefix Tree)', slug: 'implement-trie-ii-prefix-tree' },
    },
  },

  // =========================================================================
  // Lesson 4: Word count and autocomplete
  // =========================================================================
  {
    sub: 4,
    summary: 'Augment trie nodes with prefix counters and retrieve lexicographical completions using depth-first search.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'A standard trie stores only whether words exist. By **augmenting** each trie node with integer counters, we can answer statistical prefix queries in O(P) time without traversing child trees. Two common fields are `count` (number of words terminating at this node) and `prefix` (number of words in the sub-tree rooted at this node). During insertion, every node along the path increments its `prefix` counter, and the terminal node increments its `count`. To answer "how many words start with prefix P?", walk the path for P and read `curr->prefix` in O(P) time. For **autocomplete**, navigate to the prefix node and run a depth-first search (DFS) visiting children in alphabetical order from \'a\' to \'z\'. Traversing in index order guarantees suggestions appear in sorted **lexicographical order**, while a result limit ensures fast response times.',
      },
      {
        kind: 'code',
        caption: 'Prefix counting and autocomplete search suggestions',
        code: {
          cpp: `#include <bits/stdc++.h>
using namespace std;

struct TrieNode {
    TrieNode* children[26] = {};
    int count = 0, prefix = 0;
};

class AutocompleteTrie {
    TrieNode* root = new TrieNode();

    void dfs(TrieNode* curr, string& path, vector<string>& out, int limit) {
        if (!curr || (int)out.size() >= limit) return;
        if (curr->count > 0) out.push_back(path);
        for (int i = 0; i < 26 && (int)out.size() < limit; i++) {
            if (curr->children[i]) {
                path.push_back('a' + i);
                dfs(curr->children[i], path, out, limit);
                path.pop_back();
            }
        }
    }
public:
    void insert(const string& word) {
        TrieNode* curr = root;
        for (char ch : word) {
            int idx = ch - 'a';
            if (!curr->children[idx]) curr->children[idx] = new TrieNode();
            curr = curr->children[idx];
            curr->prefix++;
        }
        curr->count++;
    }

    int countPrefix(const string& pref) {
        TrieNode* curr = root;
        for (char ch : pref) {
            int idx = ch - 'a';
            if (!curr->children[idx]) return 0;
            curr = curr->children[idx];
        }
        return curr->prefix;
    }

    vector<string> autocomplete(const string& pref, int limit = 3) {
        TrieNode* curr = root;
        for (char ch : pref) {
            int idx = ch - 'a';
            if (!curr->children[idx]) return {};
            curr = curr->children[idx];
        }
        vector<string> out;
        string path = pref;
        dfs(curr, path, out, limit);
        return out;
    }
};`,
          java: `import java.util.*;

public class AutocompleteTrie {
    static class TrieNode {
        TrieNode[] children = new TrieNode[26];
        int count = 0, prefix = 0;
    }
    private final TrieNode root = new TrieNode();

    public void insert(String word) {
        TrieNode curr = root;
        for (char ch : word.toCharArray()) {
            int idx = ch - 'a';
            if (curr.children[idx] == null) curr.children[idx] = new TrieNode();
            curr = curr.children[idx];
            curr.prefix++;
        }
        curr.count++;
    }

    public int countPrefix(String pref) {
        TrieNode curr = root;
        for (char ch : pref.toCharArray()) {
            int idx = ch - 'a';
            if (curr.children[idx] == null) return 0;
            curr = curr.children[idx];
        }
        return curr.prefix;
    }

    private void dfs(TrieNode curr, StringBuilder path, List<String> out, int limit) {
        if (curr == null || out.size() >= limit) return;
        if (curr.count > 0) out.add(path.toString());
        for (int i = 0; i < 26 && out.size() < limit; i++) {
            if (curr.children[i] != null) {
                path.append((char) ('a' + i));
                dfs(curr.children[i], path, out, limit);
                path.deleteCharAt(path.length() - 1);
            }
        }
    }

    public List<String> autocomplete(String pref, int limit) {
        TrieNode curr = root;
        for (char ch : pref.toCharArray()) {
            int idx = ch - 'a';
            if (curr.children[idx] == null) return Collections.emptyList();
            curr = curr.children[idx];
        }
        List<String> out = new ArrayList<>();
        dfs(curr, new StringBuilder(pref), out, limit);
        return out;
    }
}`,
          python: `class TrieNode:
    def __init__(self):
        self.children: dict[str, TrieNode] = {}
        self.count: int = 0
        self.prefix: int = 0

class AutocompleteTrie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        curr = self.root
        for ch in word:
            if ch not in curr.children:
                curr.children[ch] = TrieNode()
            curr = curr.children[ch]
            curr.prefix += 1
        curr.count += 1

    def count_prefix(self, pref: str) -> int:
        curr = self.root
        for ch in pref:
            if ch not in curr.children:
                return 0
            curr = curr.children[ch]
        return curr.prefix

    def autocomplete(self, pref: str, limit: int = 3) -> list[str]:
        curr = self.root
        for ch in pref:
            if ch not in curr.children:
                return []
            curr = curr.children[ch]

        out: list[str] = []
        def dfs(node: TrieNode, path: list[str]) -> None:
            if len(out) >= limit:
                return
            if node.count > 0:
                out.append("".join(path))
            for ch in sorted(node.children):
                path.append(ch)
                dfs(node.children[ch], path)
                path.pop()
                if len(out) >= limit:
                    return

        dfs(curr, list(pref))
        return out`,
        },
      },
      { kind: 'heading', text: 'Augmented operation complexity' },
      {
        kind: 'table',
        headers: ['Operation', 'Time Complexity', 'Auxiliary Space', 'Explanation'],
        rows: [
          ['countPrefix(P)', 'O(P)', 'O(1)', 'Direct read of prefix counter at prefix node'],
          ['autocomplete(P, K)', 'O(P + K × L)', 'O(L) recursion', 'Walks P steps to prefix, then DFS collects at most K matches'],
          ['Lexicographical order', 'O(Σ) per node', 'O(1)', 'Scanning children 0..25 yields alphabetical sort naturally'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Early termination in autocomplete search',
        body: 'In practice, users only require a small number of suggestions, such as the top 3 or 5 matches. Always check whether the result list has reached the limit before making recursive DFS calls. Failing to stop early forces the algorithm to traverse every descendant in the sub-tree, which degrades performance on broad prefixes like "a".',
      },
    ],
    keyTakeaways: [
      'Augmenting trie nodes with prefix counters answers frequency queries in O(P) time.',
      'Autocomplete walks to the prefix node and performs DFS to collect completions.',
      'Visiting child links in alphabetical order guarantees completions appear in lexicographical order.',
      'Stopping DFS once the result limit is reached prevents unnecessary exploration of deep sub-trees.',
    ],
    practice: {
      prompt: 'Build a search suggestion system that stores a product list and returns up to 3 lexicographically smallest suggestions after each character of a search prefix is typed.',
      leetcode: { title: 'Search Suggestions System', slug: 'search-suggestions-system' },
    },
  },

  // =========================================================================
  // Lesson 5: Rolling hash and Rabin-Karp
  // =========================================================================
  {
    sub: 5,
    summary: 'Search for substring matches in linear average time by sliding a polynomial rolling hash.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Finding all occurrences of a pattern of length M inside a text of length N naively compares M characters at every possible window starting position, leading to O(N × M) worst-case time on repetitive strings like matching "aaaaab" inside "aaaaaaaaaa". The **Rabin-Karp algorithm** improves upon this by treating substrings as integer **hash values**. A string of length M is viewed as a base-B polynomial modulo a large prime modulus M_mod: `H = (s[0]*B^(M-1) + s[1]*B^(M-2) + ... + s[M-1]*B^0) % M_mod`. When sliding the window one position to the right from index i to i+1, the leftmost character `s[i]` leaves the window and the new character `s[i+M]` enters. The new hash is updated in O(1) time: `H_new = ((H_old - s[i] * B^(M-1)) * B + s[i+M]) % M_mod`. When hashes match, characters are verified directly to guard against collisions.',
      },
      {
        kind: 'code',
        caption: 'Rabin-Karp substring search with rolling hash',
        code: {
          cpp: `#include <bits/stdc++.h>
using namespace std;

int rabinKarp(const string& text, const string& pattern) {
    int n = text.size(), m = pattern.size();
    if (m == 0) return 0;
    if (m > n) return -1;

    const long long BASE = 256;
    const long long MOD = 1000000007;

    long long patternHash = 0, windowHash = 0, highPower = 1;
    for (int i = 0; i < m - 1; i++) highPower = (highPower * BASE) % MOD;

    for (int i = 0; i < m; i++) {
        patternHash = (patternHash * BASE + (unsigned char)pattern[i]) % MOD;
        windowHash = (windowHash * BASE + (unsigned char)text[i]) % MOD;
    }

    for (int i = 0; i <= n - m; i++) {
        if (windowHash == patternHash && text.compare(i, m, pattern) == 0) {
            return i;
        }
        if (i < n - m) {
            windowHash = (windowHash - (unsigned char)text[i] * highPower) % MOD;
            windowHash = (windowHash * BASE + (unsigned char)text[i + m]) % MOD;
            if (windowHash < 0) windowHash += MOD;
        }
    }
    return -1;
}`,
          java: `public class RabinKarp {
    public static int search(String text, String pattern) {
        int n = text.length(), m = pattern.length();
        if (m == 0) return 0;
        if (m > n) return -1;

        long base = 256, mod = 1_000_000_007L;
        long patternHash = 0, windowHash = 0, highPower = 1;
        for (int i = 0; i < m - 1; i++) highPower = (highPower * base) % mod;

        for (int i = 0; i < m; i++) {
            patternHash = (patternHash * base + pattern.charAt(i)) % mod;
            windowHash = (windowHash * base + text.charAt(i)) % mod;
        }

        for (int i = 0; i <= n - m; i++) {
            if (windowHash == patternHash && text.substring(i, i + m).equals(pattern)) {
                return i;
            }
            if (i < n - m) {
                windowHash = (windowHash - text.charAt(i) * highPower) % mod;
                windowHash = (windowHash * base + text.charAt(i + m)) % mod;
                if (windowHash < 0) windowHash += mod;
            }
        }
        return -1;
    }
}`,
          python: `def rabin_karp(text: str, pattern: str) -> int:
    n, m = len(text), len(pattern)
    if m == 0:
        return 0
    if m > n:
        return -1

    base, mod = 256, 1_000_000_007
    high_power = pow(base, m - 1, mod)

    pattern_hash, window_hash = 0, 0
    for i in range(m):
        pattern_hash = (pattern_hash * base + ord(pattern[i])) % mod
        window_hash = (window_hash * base + ord(text[i])) % mod

    for i in range(n - m + 1):
        if window_hash == pattern_hash and text[i:i + m] == pattern:
            return i
        if i < n - m:
            window_hash = (window_hash - ord(text[i]) * high_power) % mod
            window_hash = (window_hash * base + ord(text[i + m])) % mod
            if window_hash < 0:
                window_hash += mod
    return -1`,
        },
      },
      { kind: 'heading', text: 'Rabin-Karp complexity breakdown' },
      {
        kind: 'table',
        headers: ['Approach', 'Average Time', 'Worst-Case Time', 'Auxiliary Space'],
        rows: [
          ['Brute Force Scanning', 'O(N)', 'O(N × M)', 'O(1)'],
          ['Rabin-Karp (single hash)', 'O(N + M)', 'O(N × M) on frequent collisions', 'O(1)'],
          ['Rabin-Karp (double hash)', 'O(N + M)', 'O(N + M) practically collision-free', 'O(1)'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Negative remainders during window eviction',
        body: 'Subtracting `s[i] * highPower` from `windowHash` can produce a negative number. In C++ and Java, the `%` operator preserves the sign of negative dividends (for example, `-7 % 10` evaluates to `-7`). Always check `if (windowHash < 0) windowHash += MOD;` to normalize the hash to a valid positive remainder before multiplying by the base.',
      },
    ],
    keyTakeaways: [
      'A polynomial rolling hash updates sliding window hashes in O(1) time.',
      'Rabin-Karp achieves O(N + M) average time for substring search with O(1) auxiliary space.',
      'Hash equality requires explicit substring verification to guard against collisions.',
      'Intermediate hash subtractions must be adjusted by adding the modulus when negative.',
    ],
    practice: {
      prompt: 'Find all 10-letter substrings that occur more than once in a DNA sequence using a rolling hash with a sliding window.',
      leetcode: { title: 'Repeated DNA Sequences', slug: 'repeated-dna-sequences' },
    },
  },

  // =========================================================================
  // Lesson 6: KMP prefix function
  // =========================================================================
  {
    sub: 6,
    summary: 'Precompute the longest prefix-suffix (LPS) array to achieve deterministic O(N + M) string matching without backtracking in the text.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'When matching pattern P against text T, a character mismatch after matching several letters discards information if the search restarts at `T[i+1]` and `P[0]`. The **Knuth-Morris-Pratt (KMP)** algorithm eliminates redundant comparisons by observing that the pattern itself encodes where matching can safely resume. By precomputing the **prefix function** (commonly known as the **π array** or **LPS array** for *Longest Prefix Suffix*), KMP achieves guaranteed O(N + M) worst-case time without ever moving the text pointer backward. For pattern P of length M, `lps[i]` stores the length of the longest proper prefix of `P[0..i]` that is also a suffix of `P[0..i]`. On mismatch, the pattern pointer j falls back to `lps[j - 1]` while the text pointer i continues forward.',
      },
      {
        kind: 'code',
        caption: 'KMP prefix function construction and string search',
        code: {
          cpp: `#include <bits/stdc++.h>
using namespace std;

vector<int> computeLPS(const string& pattern) {
    int m = pattern.size(), len = 0, i = 1;
    vector<int> lps(m, 0);
    while (i < m) {
        if (pattern[i] == pattern[len]) {
            lps[i++] = ++len;
        } else if (len != 0) {
            len = lps[len - 1];
        } else {
            lps[i++] = 0;
        }
    }
    return lps;
}

int kmpSearch(const string& text, const string& pattern) {
    int n = text.size(), m = pattern.size();
    if (m == 0) return 0;
    if (m > n) return -1;

    vector<int> lps = computeLPS(pattern);
    int i = 0, j = 0;
    while (i < n) {
        if (text[i] == pattern[j]) {
            i++; j++;
            if (j == m) return i - m;
        } else if (j != 0) {
            j = lps[j - 1];
        } else {
            i++;
        }
    }
    return -1;
}`,
          java: `public class KMP {
    public static int[] computeLPS(String pattern) {
        int m = pattern.length(), len = 0, i = 1;
        int[] lps = new int[m];
        while (i < m) {
            if (pattern.charAt(i) == pattern.charAt(len)) {
                lps[i++] = ++len;
            } else if (len != 0) {
                len = lps[len - 1];
            } else {
                lps[i++] = 0;
            }
        }
        return lps;
    }

    public static int search(String text, String pattern) {
        int n = text.length(), m = pattern.length();
        if (m == 0) return 0;
        if (m > n) return -1;

        int[] lps = computeLPS(pattern);
        int i = 0, j = 0;
        while (i < n) {
            if (text.charAt(i) == pattern.charAt(j)) {
                i++; j++;
                if (j == m) return i - m;
            } else if (j != 0) {
                j = lps[j - 1];
            } else {
                i++;
            }
        }
        return -1;
    }
}`,
          python: `def compute_lps(pattern: str) -> list[int]:
    m, length, i = len(pattern), 0, 1
    lps = [0] * m
    while i < m:
        if pattern[i] == pattern[length]:
            length += 1
            lps[i] = length
            i += 1
        elif length != 0:
            length = lps[length - 1]
        else:
            lps[i] = 0
            i += 1
    return lps

def kmp_search(text: str, pattern: str) -> int:
    n, m = len(text), len(pattern)
    if m == 0:
        return 0
    if m > n:
        return -1

    lps = compute_lps(pattern)
    i, j = 0, 0
    while i < n:
        if text[i] == pattern[j]:
            i += 1
            j += 1
            if j == m:
                return i - m
        elif j != 0:
            j = lps[j - 1]
        else:
            i += 1
    return -1`,
        },
      },
      { kind: 'heading', text: 'KMP complexity breakdown' },
      {
        kind: 'table',
        headers: ['Phase', 'Time Complexity', 'Auxiliary Space', 'Key Invariant'],
        rows: [
          ['LPS Precomputation', 'O(M)', 'O(M)', 'len increases at most M times; falls back via previous lps entries'],
          ['Text Search Traversal', 'O(N)', 'O(1) extra', 'Text pointer i strictly moves forward; pattern pointer j shifts via lps'],
          ['Overall KMP Matching', 'O(N + M)', 'O(M)', 'Guaranteed linear worst-case bound without resetting text pointer'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Advancing pointer i during LPS fallback',
        body: 'When `pattern[i] != pattern[len]`, do not advance pointer `i`. Setting `len = lps[len - 1]` shifts back to the previous matching prefix to test the same character `pattern[i]` against a shorter candidate. Incrementing `i` on a mismatch skips character evaluation and corrupts subsequent LPS values.',
      },
    ],
    keyTakeaways: [
      'The LPS array stores the length of the longest proper prefix that is also a suffix for each prefix of the pattern.',
      'LPS construction runs in O(M) time by recycling previously computed prefix lengths upon mismatches.',
      'KMP never decrements the text pointer i, guaranteeing O(N + M) worst-case search time.',
      'When a mismatch occurs, the pattern shifts to index lps[j - 1] instead of resetting back to index 0.',
    ],
    practice: {
      prompt: 'Given two strings needle and haystack, find the first index of needle in haystack using the KMP pattern-matching algorithm, returning -1 if needle is not found.',
      leetcode: { title: 'Find the Index of the First Occurrence in a String', slug: 'find-the-index-of-the-first-occurrence-in-a-string' },
    },
  },
];
