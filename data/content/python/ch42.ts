import type { Lesson } from '../types';

/**
 * Chapter 42 — Capstone Programs (Python).
 * Four complete programs combining core data structures and algorithmic patterns:
 * text analysis with hash maps, stack-based expression evaluation, contact
 * indexing with binary search, and network connectivity using BFS and union-find.
 */
export const ch42: Lesson[] = [
  // -------------------------------------------------------------------------
  // 42.1: Text analyser
  // -------------------------------------------------------------------------
  {
    topicId: 'python-42.1',
    language: 'python',
    summary: 'Build a document analysis pipeline that tokenizes text, counts frequencies, and ranks terms.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'A text analyser transforms raw prose into structured metrics: total word count, vocabulary size, and the most frequent terms. The pipeline has three stages: **tokenization** to strip punctuation and lowercase characters, **frequency aggregation** in a hash map (`dict`), and **ranking** with composite sorting keys.',
      },
      {
        kind: 'code',
        caption: 'Core text analyser implementation',
        code: `import string
from collections import Counter


class TextAnalyser:
    def __init__(self, text: str):
        table = str.maketrans("", "", string.punctuation)
        self.tokens = text.translate(table).lower().split()
        self.counts = Counter(self.tokens)

    def total_words(self) -> int:
        return len(self.tokens)

    def unique_words(self) -> int:
        return len(self.counts)

    def top_k(self, k: int) -> list[tuple[str, int]]:
        return sorted(
            self.counts.items(),
            key=lambda item: (-item[1], item[0])
        )[:k]


if __name__ == "__main__":
    doc = "The cat sat on the mat. The mat was warm, and the cat slept."
    analyser = TextAnalyser(doc)
    print("Total:", analyser.total_words())
    print("Unique:", analyser.unique_words())
    print("Top 3:", analyser.top_k(3))`,
        output: "Total: 13\nUnique: 9\nTop 3: [('the', 4), ('cat', 2), ('mat', 2)]",
      },
      { kind: 'heading', text: 'Complexity' },
      {
        kind: 'table',
        headers: ['Stage', 'Time Complexity', 'Space Complexity'],
        rows: [
          ['Tokenization', 'O(N) string length', 'O(W) tokens'],
          ['Frequency Count', 'O(W) tokens', 'O(U) unique words'],
          ['Top-K Sorting', 'O(U log U)', 'O(U) unique words'],
          ['Word Lookup', 'O(1) average', 'O(1) auxiliary'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Punctuation retention and tie-breaking ambiguity',
        body: 'Calling `split()` without removing punctuation treats `"cat."` and `"cat"` as distinct tokens, distorting metrics. Sorting by count alone produces arbitrary order for equal frequencies; always specify a composite key like `(-count, word)` for deterministic ranking.',
      },
    ],
    keyTakeaways: [
      'Tokenization requires explicit punctuation removal and lowercasing before counting.',
      'Hash maps (`dict` or `Counter`) aggregate token frequencies in O(W) linear time.',
      'A composite key `(-count, word)` guarantees deterministic tie-breaking.',
      'Separating token cleaning from statistical reporting keeps code modular and testable.',
    ],
    practice: {
      prompt: 'Write a command-line text analyser that accepts text from input. Parse words into clean tokens, compute average word length, and output the top 5 words with alphabetical tie-breaking. Handle empty input gracefully without raising exceptions.',
      leetcode: { title: 'Top K Frequent Words', slug: 'top-k-frequent-words' },
    },
  },

  // -------------------------------------------------------------------------
  // 42.2: Expression calculator
  // -------------------------------------------------------------------------
  {
    topicId: 'python-42.2',
    language: 'python',
    summary: 'Implement a stack-based arithmetic parser that handles operator precedence and sub-expressions.',
    readMinutes: 6,
    blocks: [
      {
        kind: 'text',
        body: 'An expression calculator evaluates arithmetic strings containing numbers, basic operators, and parentheses. Calculation engines and interview tasks implement a **two-stack algorithm** with an operand stack for numbers and an operator stack for symbols to enforce mathematical precedence and parentheses boundaries.',
      },
      {
        kind: 'code',
        caption: 'Two-stack arithmetic expression evaluator',
        code: `def evaluate(expr: str) -> int:
    def apply_op():
        op = ops.pop()
        r, l = values.pop(), values.pop()
        if op == '+': values.append(l + r)
        elif op == '-': values.append(l - r)
        elif op == '*': values.append(l * r)
        elif op == '/': values.append(int(l / r))

    prec = {'+': 1, '-': 1, '*': 2, '/': 2}
    values: list[int] = []
    ops: list[str] = []
    i, n = 0, len(expr)

    while i < n:
        if expr[i] == ' ':
            i += 1
        elif expr[i].isdigit():
            val = 0
            while i < n and expr[i].isdigit():
                val = val * 10 + int(expr[i])
                i += 1
            values.append(val)
        elif expr[i] == '(':
            ops.append(expr[i])
            i += 1
        elif expr[i] == ')':
            while ops and ops[-1] != '(':
                apply_op()
            ops.pop()
            i += 1
        elif expr[i] in prec:
            while ops and ops[-1] in prec and prec[ops[-1]] >= prec[expr[i]]:
                apply_op()
            ops.append(expr[i])
            i += 1

    while ops:
        apply_op()
    return values[0]


if __name__ == "__main__":
    print("Result:", evaluate("14 - (2 + 3) * 2 + 8 / 2"))`,
        output: 'Result: 8',
      },
      { kind: 'heading', text: 'Complexity' },
      {
        kind: 'table',
        headers: ['Component', 'Time Complexity', 'Space Complexity'],
        rows: [
          ['Token Scanning', 'O(N) expression length', 'O(N) stack depth'],
          ['Stack Operations', 'O(1) amortised', 'O(N) operands & operators'],
          ['Total Evaluation', 'O(N) time', 'O(N) auxiliary space'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Floor division differs from integer truncation',
        body: 'Python `//` rounds toward negative infinity (`-7 // 2 = -4`), while problem specifications require truncation toward zero (`-7 / 2 = -3`). Use `int(left / right)` instead of `//` to avoid sign bugs on negative quotients.',
      },
    ],
    keyTakeaways: [
      'Two stacks decouple number extraction from operator application.',
      'Higher precedence operators must resolve before lower ones are pushed.',
      'Parentheses delimit sub-expressions that resolve upon closing.',
      'Division truncating toward zero requires `int(a / b)` in Python.',
    ],
    practice: {
      prompt: 'Extend the evaluator into an interactive calculator shell. Validate input for mismatched parentheses and division by zero, printing error notices instead of raising uncaught exceptions.',
      leetcode: { title: 'Basic Calculator II', slug: 'basic-calculator-ii' },
    },
  },

  // -------------------------------------------------------------------------
  // 42.3: Contact book
  // -------------------------------------------------------------------------
  {
    topicId: 'python-42.3',
    language: 'python',
    summary: 'Design an in-memory contact directory using structured classes, sorted arrays, and binary search for autocompletion.',
    readMinutes: 6,
    blocks: [
      {
        kind: 'text',
        body: 'A contact book maintains records in alphabetical order. Encapsulating records in a class with `__lt__` allows maintaining an **in-memory sorted array**. The `bisect_left` algorithm locates exact entries and prefix boundaries in O(log N) comparisons, avoiding full linear scans.',
      },
      {
        kind: 'code',
        caption: 'Sorted contact book with prefix autocompletion',
        code: `import bisect
from dataclasses import dataclass


@dataclass
class Contact:
    name: str
    phone: str

    def __lt__(self, other: "Contact") -> bool:
        return self.name < other.name


class ContactBook:
    def __init__(self):
        self.contacts: list[Contact] = []

    def add(self, name: str, phone: str) -> None:
        c = Contact(name, phone)
        idx = bisect.bisect_left(self.contacts, c)
        if idx < len(self.contacts) and self.contacts[idx].name == name:
            self.contacts[idx] = c
        else:
            self.contacts.insert(idx, c)

    def find(self, name: str) -> Contact | None:
        idx = bisect.bisect_left(self.contacts, Contact(name, ""))
        return self.contacts[idx] if idx < len(self.contacts) and self.contacts[idx].name == name else None

    def suggest(self, prefix: str, limit: int = 5) -> list[str]:
        idx = bisect.bisect_left(self.contacts, Contact(prefix, ""))
        res: list[str] = []
        while idx < len(self.contacts) and len(res) < limit:
            if self.contacts[idx].name.startswith(prefix):
                res.append(self.contacts[idx].name)
                idx += 1
            else:
                break
        return res


if __name__ == "__main__":
    book = ContactBook()
    book.add("Alice", "555-01")
    book.add("Bob", "555-02")
    book.add("Charlie", "555-03")
    print("Found:", book.find("Bob") is not None)
    print("Suggest:", book.suggest("Ch"))`,
        output: "Found: True\nSuggest: ['Charlie']",
      },
      { kind: 'heading', text: 'Complexity' },
      {
        kind: 'table',
        headers: ['Operation', 'Time Complexity', 'Space Complexity'],
        rows: [
          ['Exact Search (`find`)', 'O(log N) comparisons', 'O(1) auxiliary'],
          ['Prefix Search (`suggest`)', 'O(log N + K) matches', 'O(K) results'],
          ['Insert Contact (`add`)', 'O(N) list shift', 'O(1) auxiliary'],
        ],
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Linear shifting cost on array insertion',
        body: 'Binary search locates insertion indices in O(log N) time, but `list.insert()` shifts elements rightward in O(N) time. For read-heavy address books, sorted arrays provide strong cache locality and logarithmic prefix lookups.',
      },
    ],
    keyTakeaways: [
      'Implementing `__lt__` allows standard library utilities like `bisect` to order objects.',
      'Binary search finds keys and prefix start points in O(log N) steps.',
      'Prefix autocompletion runs in O(log N + K) by scanning consecutive matches.',
      'Sorted arrays trade O(N) insertion shifts for fast logarithmic queries.',
    ],
    practice: {
      prompt: 'Build a contact book supporting add, find, suggest, and delete operations. Maintain records in alphabetical order with binary search, implement case-insensitive matching, and ensure deletions correctly update the sorted list.',
      leetcode: { title: 'Search Suggestions System', slug: 'search-suggestions-system' },
    },
  },

  // -------------------------------------------------------------------------
  // 42.4: Mini social graph
  // -------------------------------------------------------------------------
  {
    topicId: 'python-42.4',
    language: 'python',
    summary: 'Construct a graph analysis engine using adjacency lists, breadth-first traversal, and disjoint sets to model networks.',
    readMinutes: 6,
    blocks: [
      {
        kind: 'text',
        body: 'A social network represents members as nodes and friendships as edges. An **adjacency list** maps each user to direct friends. Combining **Breadth-First Search** with a **Disjoint Set Union** structure allows finding shortest connection paths level by level and verifying community membership in near-constant time.',
      },
      {
        kind: 'code',
        caption: 'Social graph with BFS pathfinding and Union-Find',
        code: `from collections import deque


class SocialGraph:
    def __init__(self):
        self.adj: dict[str, set[str]] = {}
        self.parent: dict[str, str] = {}

    def find(self, u: str) -> str:
        if self.parent.setdefault(u, u) != u:
            self.parent[u] = self.find(self.parent[u])
        return self.parent[u]

    def add_friendship(self, u: str, v: str) -> None:
        self.adj.setdefault(u, set()).add(v)
        self.adj.setdefault(v, set()).add(u)
        ru, rv = self.find(u), self.find(v)
        if ru != rv:
            self.parent[ru] = rv

    def shortest_path(self, start: str, target: str) -> list[str] | None:
        if start not in self.adj or target not in self.adj:
            return None
        queue: deque[list[str]] = deque([[start]])
        visited = {start}
        while queue:
            path = queue.popleft()
            if path[-1] == target:
                return path
            for nbr in self.adj[path[-1]]:
                if nbr not in visited:
                    visited.add(nbr)
                    queue.append(path + [nbr])
        return None

    def connected(self, u: str, v: str) -> bool:
        return self.find(u) == self.find(v) if u in self.adj and v in self.adj else False


if __name__ == "__main__":
    g = SocialGraph()
    g.add_friendship("A", "B")
    g.add_friendship("B", "C")
    g.add_friendship("D", "E")
    print("Path:", g.shortest_path("A", "C"))
    print("A-C:", g.connected("A", "C"))
    print("A-D:", g.connected("A", "D"))`,
        output: "Path: ['A', 'B', 'C']\nA-C: True\nA-D: False",
      },
      { kind: 'heading', text: 'Complexity' },
      {
        kind: 'table',
        headers: ['Operation', 'Time Complexity', 'Space Complexity'],
        rows: [
          ['Add Friendship', 'O(alpha(V)) amortised', 'O(1) auxiliary'],
          ['Shortest Path (BFS)', 'O(V + E)', 'O(V) queue & visited'],
          ['Connected Check', 'O(alpha(V)) amortised', 'O(V) parent map'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Unchecked cycles in bidirectional graph search',
        body: 'Undirected social links create cycles. Traversing neighbors without tracking visited nodes causes Breadth-First Search to alternate endlessly between mutual connections. Record nodes in a visited set immediately upon queuing.',
      },
    ],
    keyTakeaways: [
      'Adjacency lists using sets permit O(1) membership checks and neighbour traversal.',
      'Breadth-First Search finds the shortest unweighted path level by level.',
      'A visited set prevents infinite loops in cyclic, bidirectional networks.',
      'Union-Find with path compression tests component connectivity in near-constant time.',
    ],
    practice: {
      prompt: 'Build an interactive social graph tool. Support commands: link two members, calculate degrees of separation, recommend friends-of-friends ranked by mutual connection count, and report the count of isolated social circles.',
      leetcode: { title: 'Number of Provinces', slug: 'number-of-provinces' },
    },
  },
];
