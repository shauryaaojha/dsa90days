import type { Lesson } from '../types';

/**
 * Java Capstone Programs.
 * Four complete programs combining core data structures and algorithmic patterns:
 * text analysis with hash maps, stack-based expression evaluation, contact
 * indexing with binary search, and network connectivity using BFS and union-find.
 */
export const ch44: Lesson[] = [
  // -------------------------------------------------------------------------
  // 44.1: Text analyser
  // -------------------------------------------------------------------------
  {
    topicId: 'java-44.1',
    language: 'java',
    summary: 'Build a document analysis pipeline that tokenises text, tallies word frequencies, and ranks top terms using hash maps and sorting.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'A text analyser converts raw prose into structured metrics: total word count, unique vocabulary size, average word length, and the most frequent terms. Search engines and indexing pipelines rely on this process as an initial transformation stage before ranking or retrieval.',
      },
      { kind: 'heading', text: 'Tokenisation, frequency mapping, and sorting' },
      {
        kind: 'text',
        body: 'The analysis pipeline contains three stages. The **tokenisation** step splits raw text on non-alphanumeric characters and normalises words to lowercase. The **frequency aggregation** step tallies occurrences in a `HashMap`. The **ranking** step sorts unique entries by frequency descending, using alphabetical order to break ties.',
      },
      {
        kind: 'code',
        caption: 'TextAnalyser.java — document analysis pipeline',
        code: `import java.util.*;

public class TextAnalyser {
    private final List<String> tokens = new ArrayList<>();
    private final Map<String, Integer> counts = new HashMap<>();
    private long totalChars = 0;

    public TextAnalyser(String doc) {
        for (String raw : doc.split("[^a-zA-Z0-9]+")) {
            if (raw.isEmpty()) continue;
            String word = raw.toLowerCase();
            tokens.add(word);
            counts.put(word, counts.getOrDefault(word, 0) + 1);
            totalChars += word.length();
        }
    }

    public int totalWords() { return tokens.size(); }
    public int uniqueWords() { return counts.size(); }

    public double averageWordLength() {
        return tokens.isEmpty() ? 0.0 : (double) totalChars / tokens.size();
    }

    public List<Map.Entry<String, Integer>> topK(int k) {
        List<Map.Entry<String, Integer>> list = new ArrayList<>(counts.entrySet());
        list.sort((a, b) -> {
            int cmp = Integer.compare(b.getValue(), a.getValue());
            return cmp != 0 ? cmp : a.getKey().compareTo(b.getKey());
        });
        return list.subList(0, Math.min(k, list.size()));
    }

    public static void main(String[] args) {
        String doc = "The cat sat on the mat. The mat was warm.";
        TextAnalyser analyser = new TextAnalyser(doc);
        System.out.println("Total: " + analyser.totalWords());
        System.out.println("Unique: " + analyser.uniqueWords());
        System.out.printf("Avg length: %.2f%n", analyser.averageWordLength());
        System.out.println("Top 2: " + analyser.topK(2));
    }
}`,
        output: `Total: 9
Unique: 7
Avg length: 3.44
Top 2: [the=3, mat=2]`,
      },
      { kind: 'heading', text: 'Complexity profile' },
      {
        kind: 'table',
        headers: ['Stage', 'Time Complexity', 'Space Complexity'],
        rows: [
          ['Tokenisation', 'O(N) string length', 'O(W) tokens'],
          ['Frequency counting', 'O(W) tokens', 'O(U) unique words'],
          ['Top-K sorting', 'O(U log U)', 'O(U) auxiliary list'],
          ['Word lookup', 'O(1) average', 'O(1) auxiliary'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Regex boundary tokens and tie-breaking ambiguity',
        body: 'Splitting on regular expressions like `[^a-zA-Z0-9]+` creates empty string tokens when input begins or ends with punctuation. Filtering empty tokens prevents corrupted word totals. Additionally, sorting entries solely by value leaves duplicate counts in indeterminate order; always specify a secondary comparison on keys for deterministic ranking.',
      },
    ],
    keyTakeaways: [
      'Tokenisation requires filtering empty strings produced by delimiter splits at text boundaries.',
      'HashMap aggregates token frequencies in O(W) linear time using getOrDefault.',
      'Composite comparator logic guarantees deterministic tie-breaking by frequency and name.',
      'Guarding against zero tokens avoids division-by-zero errors when calculating average lengths.',
    ],
    practice: {
      prompt: 'Write a command-line text analyser that accepts text from standard input. Parse words into clean tokens, compute average word length, and output the top 5 words with alphabetical tie-breaking. Handle empty input gracefully without raising exceptions.',
      leetcode: { title: 'Top K Frequent Words', slug: 'top-k-frequent-words' },
    },
  },

  // -------------------------------------------------------------------------
  // 44.2: Expression calculator
  // -------------------------------------------------------------------------
  {
    topicId: 'java-44.2',
    language: 'java',
    summary: 'Implement a two-stack arithmetic evaluator that parses infix expressions, operator precedence, and nested parentheses.',
    readMinutes: 6,
    blocks: [
      {
        kind: 'text',
        body: 'An expression calculator evaluates arithmetic strings containing integers, operators, and parentheses. Production calculation engines and parsing algorithms implement a **two-stack algorithm** to process operations according to mathematical precedence in linear time.',
      },
      { kind: 'heading', text: 'Evaluation with value and operator stacks' },
      {
        kind: 'text',
        body: 'The evaluator maintains an operand stack for numbers and an operator stack for symbols. When scanning an operator, higher or equal precedence operators on the stack resolve first. Parentheses create evaluation boundaries: an opening parenthesis pauses reductions until its closing counterpart unwinds all intermediate operations.',
      },
      {
        kind: 'code',
        caption: 'ExpressionCalculator.java — two-stack arithmetic evaluator',
        code: `import java.util.ArrayDeque;
import java.util.Deque;

public class ExpressionCalculator {
    private static void applyOp(Deque<Integer> vals, Deque<Character> ops) {
        char op = ops.pop();
        int right = vals.pop(), left = vals.pop();
        switch (op) {
            case '+': vals.push(left + right); break;
            case '-': vals.push(left - right); break;
            case '*': vals.push(left * right); break;
            case '/':
                if (right == 0) throw new ArithmeticException("Division by zero");
                vals.push(left / right);
                break;
        }
    }

    private static int precedence(char op) {
        return (op == '*' || op == '/') ? 2 : (op == '+' || op == '-') ? 1 : 0;
    }

    public static int evaluate(String s) {
        Deque<Integer> vals = new ArrayDeque<>();
        Deque<Character> ops = new ArrayDeque<>();
        int i = 0, n = s.length();

        while (i < n) {
            char c = s.charAt(i);
            if (Character.isWhitespace(c)) {
                i++;
            } else if (Character.isDigit(c)) {
                int val = 0;
                while (i < n && Character.isDigit(s.charAt(i))) {
                    val = val * 10 + (s.charAt(i++) - '0');
                }
                vals.push(val);
            } else if (c == '(') {
                ops.push(s.charAt(i++));
            } else if (c == ')') {
                while (!ops.isEmpty() && ops.peek() != '(') applyOp(vals, ops);
                ops.pop();
                i++;
            } else {
                while (!ops.isEmpty() && precedence(ops.peek()) >= precedence(c)) {
                    applyOp(vals, ops);
                }
                ops.push(c);
                i++;
            }
        }
        while (!ops.isEmpty()) applyOp(vals, ops);
        return vals.isEmpty() ? 0 : vals.pop();
    }

    public static void main(String[] args) {
        System.out.println("Result: " + evaluate("14 - (2 + 3) * 2 + 8 / 2"));
    }
}`,
        output: 'Result: 8',
      },
      { kind: 'heading', text: 'Operational complexity' },
      {
        kind: 'table',
        headers: ['Component', 'Time Complexity', 'Space Complexity'],
        rows: [
          ['Token scanning', 'O(N) expression length', 'O(N) stack depth'],
          ['Stack operations', 'O(1) amortised per token', 'O(N) values & operators'],
          ['Total evaluation', 'O(N) overall time', 'O(N) auxiliary space'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Reversed operand order in stack reductions',
        body: 'Stacks retrieve elements in last-in, first-out order. When reducing binary operations, the first popped value is the right operand, and the second popped value is the left operand. Computing `b - a` or `b / a` instead of `left - right` reverses non-commutative operations and generates invalid results.',
      },
    ],
    keyTakeaways: [
      'Two stacks decouple multi-digit integer scanning from operator precedence resolution.',
      'Operators of greater or equal precedence must resolve before lower ones are pushed.',
      'Parentheses create sub-expression boundaries that resolve upon encountering the closing symbol.',
      'The first element popped from an operand stack represents the right-hand operand.',
    ],
    practice: {
      prompt: 'Extend the evaluator into an interactive calculator. Add validation for mismatched parentheses and division by zero, printing informative error messages instead of throwing uncaught exceptions.',
      leetcode: { title: 'Basic Calculator II', slug: 'basic-calculator-ii' },
    },
  },

  // -------------------------------------------------------------------------
  // 44.3: Contact book
  // -------------------------------------------------------------------------
  {
    topicId: 'java-44.3',
    language: 'java',
    summary: 'Design an in-memory contact directory using structured classes, sorted collections, and binary search for autocompletion.',
    readMinutes: 6,
    blocks: [
      {
        kind: 'text',
        body: 'A contact book manages records and provides rapid lookups. While unsorted collections require scanning every entry linearly, an **in-memory sorted list** enables exact lookups and prefix-based autocompletion in logarithmic time through binary search.',
      },
      { kind: 'heading', text: 'Record encapsulation and binary search bounds' },
      {
        kind: 'text',
        body: 'Contacts are encapsulated in a class implementing `Comparable<Contact>` for case-insensitive alphabetical ordering. The directory maintains an ordered `ArrayList`. Calling `Collections.binarySearch` locates target records in O(log N) comparisons, providing immediate insertion points and prefix range boundaries.',
      },
      {
        kind: 'code',
        caption: 'ContactBook.java — sorted directory with prefix autocompletion',
        code: `import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class ContactBook {
    public static class Contact implements Comparable<Contact> {
        private final String name;
        private final String phone;
        private final String email;

        public Contact(String name, String phone, String email) {
            this.name = name;
            this.phone = phone;
            this.email = email;
        }

        public String getName() { return name; }

        @Override
        public int compareTo(Contact other) {
            return this.name.compareToIgnoreCase(other.name);
        }

        @Override
        public String toString() {
            return name + " (" + phone + ", " + email + ")";
        }
    }

    private final List<Contact> contacts = new ArrayList<>();

    public void add(String name, String phone, String email) {
        Contact c = new Contact(name, phone, email);
        int idx = Collections.binarySearch(contacts, c);
        if (idx >= 0) contacts.set(idx, c);
        else contacts.add(-(idx + 1), c);
    }

    public Contact find(String name) {
        int idx = Collections.binarySearch(contacts, new Contact(name, "", ""));
        return idx >= 0 ? contacts.get(idx) : null;
    }

    public List<String> suggest(String prefix, int limit) {
        int idx = Collections.binarySearch(contacts, new Contact(prefix, "", ""));
        int start = idx >= 0 ? idx : -(idx + 1);
        List<String> matches = new ArrayList<>();
        String pre = prefix.toLowerCase();

        for (int i = start; i < contacts.size() && matches.size() < limit; i++) {
            if (contacts.get(i).getName().toLowerCase().startsWith(pre)) {
                matches.add(contacts.get(i).getName());
            } else break;
        }
        return matches;
    }

    public static void main(String[] args) {
        ContactBook book = new ContactBook();
        book.add("Alice Smith", "555-0101", "alice@example.com");
        book.add("Bob Jones", "555-0102", "bob@example.com");
        book.add("Clara Oswald", "555-0104", "clara@example.com");

        Contact entry = book.find("Bob Jones");
        System.out.println("Found: " + (entry != null ? entry.getName() : "null"));
        System.out.println("Suggestions: " + book.suggest("Cl", 5));
    }
}`,
        output: `Found: Bob Jones
Suggestions: [Clara Oswald]`,
      },
      { kind: 'heading', text: 'Performance trade-offs' },
      {
        kind: 'table',
        headers: ['Operation', 'Time Complexity', 'Space Complexity'],
        rows: [
          ['Exact search (find)', 'O(log N) comparisons', 'O(1) auxiliary'],
          ['Prefix search (suggest)', 'O(log N + K) matches', 'O(K) results'],
          ['Insert contact (add)', 'O(N) list shift', 'O(1) auxiliary'],
          ['Total directory memory', 'O(N) records', 'O(N) memory'],
        ],
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Linear shifting cost on array insertion',
        body: 'Binary search locates insertion positions in O(log N) comparisons, but inserting into an `ArrayList` shifts subsequent elements rightward in O(N) time. For read-heavy applications, sorted contiguous arrays provide strong cache locality and logarithmic prefix lookups.',
      },
    ],
    keyTakeaways: [
      'Implementing Comparable enables binary search utilities to order domain objects.',
      'Binary search finds exact keys and prefix starting boundaries in O(log N) steps.',
      'Prefix autocompletion runs in O(log N + K) by scanning only consecutive matches.',
      'Sorted lists trade O(N) insertion element shifts for logarithmic query speeds.',
    ],
    practice: {
      prompt: 'Build a contact book supporting add, find, suggest, and delete operations. Maintain records in alphabetical order with binary search, implement case-insensitive matching, and ensure deletions correctly update the sorted list.',
      leetcode: { title: 'Search Suggestions System', slug: 'search-suggestions-system' },
    },
  },

  // -------------------------------------------------------------------------
  // 44.4: Mini social graph
  // -------------------------------------------------------------------------
  {
    topicId: 'java-44.4',
    language: 'java',
    summary: 'Construct a graph analysis engine using adjacency lists, breadth-first traversal, and disjoint sets to model networks.',
    readMinutes: 6,
    blocks: [
      {
        kind: 'text',
        body: 'A social network represents members as vertices and friendships as edges. Analysing networks requires determining shortest connection degrees between two members and verifying community clustering. Combining **Breadth-First Search** with a **Disjoint Set Union** structure answers both queries efficiently.',
      },
      { kind: 'heading', text: 'Adjacency models, BFS paths, and union-find' },
      {
        kind: 'text',
        body: 'An **adjacency list** maps each user to a set of direct friends. Breadth-First Search explores friends layer by layer using a queue, guaranteeing the shortest path in unweighted networks. Concurrently, a **Union-Find** structure maintains connected components, answering connectivity queries in nearly constant time.',
      },
      {
        kind: 'code',
        caption: 'SocialGraph.java — network modelling with BFS and Union-Find',
        code: `import java.util.*;

public class SocialGraph {
    private static class UnionFind {
        private final int[] parent;
        UnionFind(int n) {
            parent = new int[n];
            for (int i = 0; i < n; i++) parent[i] = i;
        }
        int find(int i) {
            return parent[i] == i ? i : (parent[i] = find(parent[i]));
        }
        void union(int i, int j) { parent[find(i)] = find(j); }
        boolean connected(int i, int j) { return find(i) == find(j); }
    }

    private final int vertices;
    private final List<Set<Integer>> adj;
    private final UnionFind uf;

    public SocialGraph(int vertices) {
        this.vertices = vertices;
        this.adj = new ArrayList<>(vertices);
        for (int i = 0; i < vertices; i++) adj.add(new HashSet<>());
        this.uf = new UnionFind(vertices);
    }

    public void addFriendship(int u, int v) {
        adj.get(u).add(v);
        adj.get(v).add(u);
        uf.union(u, v);
    }

    public boolean areConnected(int u, int v) { return uf.connected(u, v); }

    public int shortestDegree(int src, int dst) {
        if (src == dst) return 0;
        if (!uf.connected(src, dst)) return -1;

        Queue<Integer> q = new ArrayDeque<>();
        int[] dist = new int[vertices];
        Arrays.fill(dist, -1);
        q.offer(src);
        dist[src] = 0;

        while (!q.isEmpty()) {
            int cur = q.poll();
            if (cur == dst) return dist[cur];
            for (int nbr : adj.get(cur)) {
                if (dist[nbr] == -1) {
                    dist[nbr] = dist[cur] + 1;
                    q.offer(nbr);
                }
            }
        }
        return -1;
    }

    public List<Integer> suggestFriends(int u) {
        Map<Integer, Integer> mutuals = new HashMap<>();
        Set<Integer> direct = adj.get(u);
        for (int f : direct) {
            for (int cand : adj.get(f)) {
                if (cand != u && !direct.contains(cand)) {
                    mutuals.put(cand, mutuals.getOrDefault(cand, 0) + 1);
                }
            }
        }
        List<Integer> list = new ArrayList<>(mutuals.keySet());
        list.sort((a, b) -> mutuals.get(b).compareTo(mutuals.get(a)));
        return list;
    }

    public static void main(String[] args) {
        SocialGraph g = new SocialGraph(5);
        g.addFriendship(0, 1);
        g.addFriendship(1, 2);
        g.addFriendship(2, 3);
        System.out.println("0 and 3 connected: " + g.areConnected(0, 3));
        System.out.println("0 and 4 connected: " + g.areConnected(0, 4));
        System.out.println("Shortest degree: " + g.shortestDegree(0, 3));
        System.out.println("Suggestions: " + g.suggestFriends(0));
    }
}`,
        output: `0 and 3 connected: true
0 and 4 connected: false
Shortest degree: 3
Suggestions: [2]`,
      },
      { kind: 'heading', text: 'Structural complexity' },
      {
        kind: 'table',
        headers: ['Operation', 'Time Complexity', 'Space Complexity'],
        rows: [
          ['Add friendship edge', 'O(1) adjacency insert', 'O(1) edge memory'],
          ['Component check', 'O(α(V)) nearly constant', 'O(V) parent array'],
          ['Shortest degree (BFS)', 'O(V + E) traversal', 'O(V) visited queue'],
          ['Friend suggestions', 'O(D^2) degree exploration', 'O(V) candidates'],
        ],
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Validating connectivity before launching BFS traversal',
        body: 'Breadth-First Search traverses every reachable vertex in a connected component. When two users belong to disjoint clusters, BFS scans the entire component before reporting failure. Querying Union-Find first avoids initializing queues or distance arrays when no path exists.',
      },
    ],
    keyTakeaways: [
      'Adjacency lists represent sparse social networks with O(V + E) memory.',
      'Union-Find provides O(α(V)) connectivity queries across dynamic friend additions.',
      'Breadth-First Search identifies shortest path degrees in unweighted networks.',
      'Friend suggestions evaluate the two-hop neighbourhood by counting mutual connections.',
    ],
    practice: {
      prompt: 'Extend the social graph to return the actual chain of user IDs representing the shortest connection path between two members rather than only the numerical distance.',
      leetcode: { title: 'Find if Path Exists in Graph', slug: 'find-if-path-exists-in-graph' },
    },
  },
];
