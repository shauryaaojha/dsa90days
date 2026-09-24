import type { Lesson } from '../types';

/**
 * Chapter 46 — Capstone Programs (C++).
 * Four complete, end-to-end programs that synthesise core data structures
 * into production-style command-line tools.
 */
export const ch46: Lesson[] = [
  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-46.1',
    language: 'cpp',
    summary: 'Build a text analyser that tokenises input streams, computes word frequencies, and ranks them using custom sorting.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'Writing standalone functions differs from building complete software. A text analyser turns raw text into structured frequency metrics. It exercises string tokenisation, hash map counting, running accumulators, and sorting with custom comparators. In this capstone, you will build a command-line tool that parses input and reports word statistics.',
      },
      { kind: 'heading', text: 'Program specification' },
      {
        kind: 'text',
        body: 'Read text from standard input until EOF. Clean punctuation by treating non-alphanumeric characters as delimiters, convert letters to lowercase, and track total words, unique words, and average word length. Output the top-k words sorted by frequency descending. Break ties by sorting alphabetically in ascending order.',
      },
      {
        kind: 'table',
        headers: ['Component', 'Data Structure', 'Time Complexity', 'Space Complexity'],
        rows: [
          ['Tokeniser', 'std::string parsing', 'O(N) chars', 'O(L) per word'],
          ['Frequencies', 'unordered_map<string, int>', 'O(1) average', 'O(U) unique words'],
          ['Top-k rank', 'vector<pair<string, int>> + sort', 'O(U log U)', 'O(U) auxiliary'],
          ['Summary', 'Running counters', 'O(1) per word', 'O(1)'],
        ],
      },
      { kind: 'heading', text: 'Architecture skeleton' },
      {
        kind: 'code',
        caption: 'text_analyser.cpp — interface skeleton',
        code: `#include <bits/stdc++.h>
using namespace std;

struct WordStat {
    string word;
    int count;
};

class TextAnalyser {
    unordered_map<string, int> freq;
    long long totalChars = 0, totalWords = 0;
public:
    string cleanToken(const string& raw);
    void processLine(const string& line);
    vector<WordStat> getTopK(int k) const;
    void printReport(int k) const;
};`,
      },
      { kind: 'heading', text: 'Sample session' },
      {
        kind: 'text',
        body: 'Input:\nData structures and algorithms. Algorithms shape data structures!\n\nOutput:\n--- Analysis Report ---\nTotal words: 8\nUnique words: 4\nAverage length: 7.75\nTop words:\n  algorithms: 2\n  data: 2\n  structures: 2',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Comparator tie-breaking',
        body: 'In sorting by frequency, returning only `a.count > b.count` leaves equal counts in undefined order, violating strict weak ordering. Always provide an explicit tie-breaker: compare counts descending, and break ties alphabetically with `a.word < b.word`.',
      },
      { kind: 'heading', text: 'Verification checklist' },
      {
        kind: 'text',
        body: 'Check before finishing: 1. Empty or whitespace-only inputs yield 0 words without division by zero. 2. Punctuation around words like `end.` is stripped cleanly. 3. Tied frequencies sort alphabetically. 4. Large inputs process without redundant string copies.',
      },
    ],
    keyTakeaways: [
      'Normalise tokens to lowercase before map insertion so punctuation does not alter keys.',
      'Guard average length calculations against division by zero when the input is empty.',
      'Supply an explicit secondary comparison key to keep frequency sorting deterministic.',
    ],
    practice: {
      prompt: 'Implement TextAnalyser in full with an interactive CLI supporting two commands: "load <file>" to ingest text and "top <k>" to display the top k words.',
      starter: `#include <bits/stdc++.h>
using namespace std;

int main() {
    return 0;
}`,
      leetcode: { title: 'Top K Frequent Words', slug: 'top-k-frequent-words' },
    },
  },
  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-46.2',
    language: 'cpp',
    summary: 'Build an arithmetic expression evaluator supporting operator precedence, nested parentheses, and syntax validation with stacks.',
    readMinutes: 6,
    blocks: [
      {
        kind: 'text',
        body: 'Evaluating expressions like "3 + 5 * (2 - 8)" is the benchmark for stack-based parsing. Without structured stacks, operator precedence and nested parentheses turn code into fragile branching logic. In this capstone, you will implement a dual-stack calculator that parses and evaluates infix expressions.',
      },
      { kind: 'heading', text: 'Program specification' },
      {
        kind: 'text',
        body: 'The program evaluates infix expressions with non-negative integers, binary operators (+, -, *, /, %), parentheses, and whitespace. It enforces operator precedence (*, /, % before +, -) with left-to-right associativity, supports nested parentheses, and throws runtime errors for division by zero, mismatched parentheses, or missing operands.',
      },
      {
        kind: 'table',
        headers: ['Token', 'Precedence', 'Associativity', 'Stack Action'],
        rows: [
          ['+ , -', '1', 'Left-to-right', 'Pop and evaluate operators with precedence >= 1'],
          ['* , / , %', '2', 'Left-to-right', 'Pop and evaluate operators with precedence >= 2'],
          ['( (open)', '0', 'None', 'Push directly onto operator stack'],
          [') (close)', 'N/A', 'None', 'Pop and evaluate until matching ( is removed'],
        ],
      },
      { kind: 'heading', text: 'Architecture skeleton' },
      {
        kind: 'code',
        caption: 'calculator.cpp — dual-stack evaluator skeleton',
        code: `#include <bits/stdc++.h>
using namespace std;

class ExpressionCalculator {
    int precedence(char op) const;
    long long applyOp(long long a, long long b, char op) const;
    void processTop(stack<long long>& values, stack<char>& ops) const;
public:
    long long evaluate(const string& expr) const;
};`,
      },
      { kind: 'heading', text: 'Sample session' },
      {
        kind: 'text',
        body: '> 10 + 2 * 6\n= 22\n> (10 + 2) * 6\n= 72\n> 15 / (3 - 3)\nError: Division by zero\n> 4 + * 2\nError: Malformed expression',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Operand popping order',
        body: 'Popping two operands inverts their order: the first popped value is the right operand (b) and the second is the left operand (a). Computing `b - a` or `b / a` inverts the operation. Always assign explicitly: `long long b = values.top(); values.pop(); long long a = values.top(); values.pop();` followed by `applyOp(a, b, op)`.',
      },
      { kind: 'heading', text: 'Verification checklist' },
      {
        kind: 'text',
        body: 'Check before finishing: 1. Multi-digit numbers are parsed accumulatively. 2. Operators with equal precedence evaluate left-to-right (10 - 4 + 2 equals 8, not 4). 3. Whitespace around tokens is ignored. 4. Unmatched parentheses throw exceptions instead of returning incorrect numbers.',
      },
    ],
    keyTakeaways: [
      'Maintain two stacks: one for numerical values and one for operator characters.',
      'The top value of the operand stack is the right-hand operand; pop order is reversed.',
      'Resolve operators of equal or higher precedence before pushing new operators to preserve left-to-right evaluation.',
    ],
    practice: {
      prompt: 'Implement ExpressionCalculator in full and extend it into a REPL supporting variable assignment (e.g. "x = 4", "y = x * 3", "x + y").',
      starter: `#include <bits/stdc++.h>
using namespace std;

int main() {
    return 0;
}`,
      leetcode: { title: 'Basic Calculator II', slug: 'basic-calculator-ii' },
    },
  },
  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-46.3',
    language: 'cpp',
    summary: 'Design an object-oriented contact directory featuring binary search lookups and prefix auto-completion.',
    readMinutes: 5,
    blocks: [
      {
        kind: 'text',
        body: 'A contact book combines object-oriented domain classes with sorted collections for logarithmic lookups. Real software cannot perform linear scans across thousands of entries on every search keystroke; users expect instant prefix auto-completion. In this capstone, you will design a Contact entity and a ContactBook container that provides logarithmic lookup and prefix queries.',
      },
      { kind: 'heading', text: 'Program specification' },
      {
        kind: 'text',
        body: 'Store records with name, phone, and email. Support: 1. Adding contacts sorted alphabetically by name (updating existing entries on duplicates). 2. Deleting by exact name. 3. Finding contacts in O(log N) time via binary search. 4. Querying prefix matches in O(log N + K) time, where K is the number of matching records.',
      },
      {
        kind: 'table',
        headers: ['Operation', 'Technique', 'Time Complexity', 'Space Complexity'],
        rows: [
          ['Add contact', 'std::lower_bound + vector::insert', 'O(N)', 'O(1) amortised'],
          ['Delete contact', 'Binary search + vector::erase', 'O(N)', 'O(1)'],
          ['Exact search', 'Binary search on sorted vector', 'O(log N)', 'O(1)'],
          ['Prefix lookup', 'std::lower_bound + range scan', 'O(log N + K)', 'O(K) results'],
        ],
      },
      { kind: 'heading', text: 'Architecture skeleton' },
      {
        kind: 'code',
        caption: 'contact_book.cpp — interface skeleton',
        code: `#include <bits/stdc++.h>
using namespace std;

class Contact {
public:
    string name, phone, email;
    Contact(string n, string p, string e);
    bool operator<(const Contact& other) const;
};

class ContactBook {
    vector<Contact> contacts;
public:
    bool add(const string& name, const string& phone, const string& email);
    bool remove(const string& name);
    const Contact* get(const string& name) const;
    vector<Contact> findByPrefix(const string& prefix) const;
};`,
      },
      { kind: 'heading', text: 'Sample session' },
      {
        kind: 'text',
        body: 'Input:\nADD "Alice Smith" 555-0100 alice@example.com\nADD "Albert Wu" 555-0102 albert@example.com\nPREFIX "Al"\n\nOutput:\nAlbert Wu | 555-0102 | albert@example.com\nAlice Smith | 555-0100 | alice@example.com',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Prefix search termination',
        body: 'When scanning forward from `lower_bound`, stop immediately once a name no longer starts with the prefix. Continuing the scan until `end()` degrades query time from O(log N + K) to O(N), defeating the purpose of binary search.',
      },
      { kind: 'heading', text: 'Verification checklist' },
      {
        kind: 'text',
        body: 'Check before finishing: 1. Adding an existing name updates phone and email instead of creating duplicates. 2. Queries matching zero contacts return an empty vector without errors. 3. Erasing the first or last entry preserves sorted order. 4. Binary search handles sizes 0, 1, and 2 correctly.',
      },
    ],
    keyTakeaways: [
      'A sorted vector enables O(log N) binary search and cache-efficient contiguous iteration.',
      'Use std::lower_bound to locate the start of a prefix range in logarithmic time.',
      'Separate the domain model (Contact) from the storage manager (ContactBook) to keep logic clean.',
    ],
    practice: {
      prompt: 'Implement ContactBook in full and add persistent storage with "SAVE <file>" and "LOAD <file>" commands using CSV format.',
      starter: `#include <bits/stdc++.h>
using namespace std;

int main() {
    return 0;
}`,
      leetcode: { title: 'Search Suggestions System', slug: 'search-suggestions-system' },
    },
  },
  // -------------------------------------------------------------------------
  {
    topicId: 'cpp-46.4',
    language: 'cpp',
    summary: 'Construct a social graph engine supporting friendship connections, degrees of separation via BFS, and community detection via Disjoint Set Union.',
    readMinutes: 6,
    blocks: [
      {
        kind: 'text',
        body: 'Social platforms model users as vertices and friendships as undirected edges. Querying these relationships requires BFS for shortest degree of separation and Disjoint Set Union (DSU) for near O(1) community checks. This capstone unites both techniques into an end-to-end graph engine.',
      },
      { kind: 'heading', text: 'Program specification' },
      {
        kind: 'text',
        body: 'Identify users by string usernames. Support: 1. Adding bidirectional friendships. 2. Shortest degree of separation via BFS (returns -1 if disconnected). 3. Community membership check via Union-Find. 4. Friend suggestions: ranking non-friends by shared mutual friend count.',
      },
      {
        kind: 'table',
        headers: ['Feature', 'Algorithm / Structure', 'Time Complexity', 'Space Complexity'],
        rows: [
          ['Add friendship', 'Adjacency list + DSU union', 'O(alpha(V))', 'O(1) auxiliary'],
          ['Community check', 'DSU find with path compression', 'O(alpha(V)) amortised', 'O(1)'],
          ['Degrees of separation', 'Breadth-First Search (BFS)', 'O(V + E)', 'O(V) queue and visited'],
          ['Friend suggestions', 'Two-hop neighbor frequency tally', 'O(deg(u) * max_deg)', 'O(V) counts'],
        ],
      },
      { kind: 'heading', text: 'Architecture skeleton' },
      {
        kind: 'code',
        caption: 'social_graph.cpp — graph engine skeleton',
        code: `#include <bits/stdc++.h>
using namespace std;

class DSU {
    vector<int> parent;
public:
    DSU(int n);
    int find(int i);
    bool unite(int i, int j);
    bool connected(int i, int j);
};

class SocialGraph {
    unordered_map<string, int> nameToId;
    vector<string> idToName;
    vector<vector<int>> adj;
    unique_ptr<DSU> dsu;
public:
    void initDSU(int expectedUsers);
    void addFriendship(const string& u, const string& v);
    int shortestPath(const string& start, const string& target);
    bool inSameCommunity(const string& u, const string& v);
    vector<string> recommendFriends(const string& user, int k = 3);
};`,
      },
      { kind: 'heading', text: 'Sample session' },
      {
        kind: 'text',
        body: 'Friendships:\nAlice <-> Bob\nBob <-> Charlie\nDavid <-> Emma\n\nOutput:\nDistance Alice to Charlie: 2\nDistance Alice to David: -1\nAlice & Charlie same community? Yes\nAlice & David same community? No',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Undirected edge symmetry',
        body: 'Friendship is symmetric. When user A adds user B, insert edges into both `adj[A]` and `adj[B]`. Omitting the reverse edge makes the graph directed, causing BFS shortest-path queries to fail depending on who initiated the connection.',
      },
      { kind: 'heading', text: 'Verification checklist' },
      {
        kind: 'text',
        body: 'Check before finishing: 1. Self-friendships (Alice adding Alice) are ignored. 2. Duplicate edges are prevented. 3. Disconnected BFS queries return -1 without looping. 4. Suggestions exclude direct friends.',
      },
    ],
    keyTakeaways: [
      'Use a symbol table (hash map plus vector) to map string usernames to continuous integer IDs.',
      'Run Breadth-First Search with a visited distance array to compute shortest paths in unweighted graphs.',
      'Use Union-Find for near O(1) connectivity queries without traversing the adjacency list.',
    ],
    practice: {
      prompt: 'Implement SocialGraph with interactive CLI commands: "friend <u> <v>", "path <u> <v>", "community <u> <v>", and "suggest <u>".',
      starter: `#include <bits/stdc++.h>
using namespace std;

int main() {
    return 0;
}`,
      leetcode: { title: 'Number of Provinces', slug: 'number-of-provinces' },
    },
  },
];
