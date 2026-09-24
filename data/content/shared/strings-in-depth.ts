import type { SharedLesson } from './types';

/**
 * Strings in Depth — what a string is underneath, the operations that are
 * secretly expensive, and the handful of techniques (counting, two pointers,
 * parsing, grids of characters) behind most string problems on LeetCode.
 */
export const lessons: SharedLesson[] = [
  // -------------------------------------------------------------------------
  {
    sub: 1,
    summary: 'See that every character is a number, and use that to reason about ordering and ranges.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'A string is a sequence of characters, and a character is a number wearing a costume. The letter A is stored as 65, B as 66, a as 97, the digit 0 as 48, a space as 32. The table that assigns these numbers is **ASCII** for the first 128 characters, and **Unicode** extends it to every script in the world. Once you see characters as numbers, comparisons, ranges and arithmetic on them stop being magic.',
      },
      {
        kind: 'table',
        headers: ['Characters', 'Codes', 'Useful fact'],
        rows: [
          ['\'0\' to \'9\'', '48 to 57', 'Consecutive; digit value is `c - \'0\'`'],
          ['\'A\' to \'Z\'', '65 to 90', 'Consecutive; index in alphabet is `c - \'A\'`'],
          ['\'a\' to \'z\'', '97 to 122', 'Consecutive; lowercase = uppercase + 32'],
          ['space', '32', 'Smaller than every letter and digit'],
          ['\'\\n\' newline', '10', 'Ends a line in input'],
        ],
      },
      {
        kind: 'code',
        caption: 'Looking at the numbers',
        code: {
          cpp: `char c = 'a';
cout << (int)c << endl;        // 97
cout << (char)(c + 1) << endl; // b
cout << ('a' < 'b') << endl;   // 1: compares 97 < 98`,
          java: `char c = 'a';
System.out.println((int) c);        // 97
System.out.println((char) (c + 1)); // b
System.out.println('a' < 'b');      // true: compares 97 < 98`,
          python: `c = 'a'
print(ord(c))           # 97
print(chr(ord(c) + 1))  # b
print('a' < 'b')        # True: compares 97 < 98`,
        },
      },
      {
        kind: 'text',
        body: {
          cpp: 'In C++ a `char` **is** a small integer; `(int)c` shows its code and `(char)n` shows the character with code n. Arithmetic on chars gives an `int`, which is why `c + 1` must be cast back to `char` to print as a letter.',
          java: 'In Java a `char` is a 16-bit number; `(int) c` shows its code and `(char) n` shows the character with code n. Arithmetic on chars gives an `int`, which is why `c + 1` must be cast back to `char` to print as a letter.',
          python: 'Python keeps characters as one-letter strings, so the conversion is explicit: `ord()` gives the code, `chr()` gives the character. `\'a\' + 1` is an error; `chr(ord(\'a\') + 1)` is what you mean.',
        },
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Uppercase sorts before lowercase',
        body: 'Because 65-90 comes before 97-122, "Zebra" < "apple" in a plain comparison. If a problem wants dictionary order regardless of case, convert everything to one case first. Do not assume the comparison is alphabetical in the everyday sense.',
      },
    ],
    keyTakeaways: [
      'Characters are numbers: \'a\' is 97, \'A\' is 65, \'0\' is 48.',
      'Digits, uppercase and lowercase letters are each consecutive runs.',
      'Comparisons compare codes, so uppercase sorts before lowercase.',
    ],
    practice: {
      prompt: 'Print the code of every character in a string, one per line. Then print the string with every letter replaced by the next letter in the alphabet, wrapping z to a, leaving non-letters unchanged.',
    },
  },
  // -------------------------------------------------------------------------
  {
    sub: 2,
    summary: 'Do arithmetic on characters to convert digits, shift letters and index counting arrays.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Three expressions cover nearly all character arithmetic you will ever write. `c - \'0\'` turns a digit character into its value. `c - \'a\'` turns a lowercase letter into 0-25, the index you need for a counting array. And `\'a\' + k` turns an index back into the letter. Everything else is a variation.',
      },
      {
        kind: 'code',
        caption: 'The three expressions',
        code: {
          cpp: `char d = '7';
int value = d - '0';          // 7

char c = 'e';
int idx = c - 'a';            // 4
char back = 'a' + idx;        // 'e'

char shifted = 'a' + (c - 'a' + 3) % 26;   // 'h': Caesar shift by 3 with wrap`,
          java: `char d = '7';
int value = d - '0';          // 7

char c = 'e';
int idx = c - 'a';            // 4
char back = (char) ('a' + idx);        // 'e'

char shifted = (char) ('a' + (c - 'a' + 3) % 26);   // 'h': Caesar shift with wrap`,
          python: `d = '7'
value = ord(d) - ord('0')     # 7   (or int(d))

c = 'e'
idx = ord(c) - ord('a')       # 4
back = chr(ord('a') + idx)    # 'e'

shifted = chr(ord('a') + (idx + 3) % 26)   # 'h': Caesar shift with wrap`,
        },
      },
      {
        kind: 'text',
        body: 'Why `% 26` in the shift: index 23 (x) plus 3 is 26, which is past z. Taking the remainder wraps it to 0, which is a. The same wrap-around idea as circular arrays.',
      },
      { kind: 'heading', text: 'Case conversion and classification' },
      {
        kind: 'table',
        headers: ['Task', 'By arithmetic', 'By library'],
        rows: [
          ['Is c a digit?', '`c >= \'0\' && c <= \'9\'`', { cpp: '`isdigit(c)`', java: '`Character.isDigit(c)`', python: '`c.isdigit()`' }],
          ['Is c a lowercase letter?', '`c >= \'a\' && c <= \'z\'`', { cpp: '`islower(c)`', java: '`Character.isLowerCase(c)`', python: '`c.islower()`' }],
          ['Upper to lower', '`c + 32` (letters only)', { cpp: '`tolower(c)`', java: '`Character.toLowerCase(c)`', python: '`c.lower()`' }],
          ['Is c a letter or digit?', 'combine the ranges', { cpp: '`isalnum(c)`', java: '`Character.isLetterOrDigit(c)`', python: '`c.isalnum()`' }],
        ],
      },
      {
        kind: 'text',
        body: 'Use the library functions in real code; they are clearer and handle edge cases. Know the arithmetic so you understand what they do and can reason about problems like "shift every letter" where no library function fits.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Building a number from digit characters',
        body: 'The string "472" is three characters, not the number 472. To convert by hand: `n = n * 10 + (c - \'0\')` for each character, the same multiply-and-add as reversing a number. Every language has a library function for this too, covered in the parsing lesson, but the by-hand version is what you need when the string has extra characters mixed in.',
      },
    ],
    keyTakeaways: [
      '`c - \'0\'` is the digit\u2019s value; `c - \'a\'` is the letter\u2019s index; `\'a\' + k` is the k-th letter.',
      'Shift letters with `(index + k) % 26` to wrap around.',
      'Prefer library classification functions in real code; know the arithmetic behind them.',
    ],
    practice: {
      prompt: 'Read a string and a shift k, and print the Caesar-shifted string (letters only, preserving case, wrapping). Then read a string that may contain letters and digits and print the sum of all digits in it.',
    },
  },
  // -------------------------------------------------------------------------
  {
    sub: 3,
    summary: 'Recognise why appending to a string in a loop can be quadratic, and build strings the fast way.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Strings look like arrays of characters, and mostly behave like them. The exception that costs the most is building one up piece by piece. Depending on the language and the operation, "add one character to the end" can copy the whole string every time, and adding n characters that way copies 1 + 2 + ... + n characters, which is O(n²). For a 10⁵-character result that is five billion character copies.',
      },
      {
        kind: 'text',
        body: {
          cpp: 'C++ `std::string` is mutable and `s += c` or `s.push_back(c)` appends in amortised O(1), the same way `vector::push_back` does. The trap is `s = s + c`, which builds a new string from `s` and `c` and then assigns it: a full copy each time. Use `+=`.',
          java: 'Java `String` is **immutable**: it can never change after creation. `s += c` looks like an append but creates a brand-new string containing the old contents plus `c`, copying everything. In a loop, that is O(n²). `StringBuilder` is a mutable buffer with an amortised O(1) `append`; build with it and call `toString()` once at the end.',
          python: 'Python `str` is **immutable**: it can never change after creation. `s += c` creates a new string containing the old contents plus `c`. CPython has an optimisation that often makes this fast in practice, but it is not guaranteed and does not apply in all situations. The reliable way is to collect pieces in a list and `\'\'.join()` them once at the end.',
        },
      },
      {
        kind: 'code',
        caption: 'Slow and fast ways to build a string of n characters',
        code: {
          cpp: `// Slow: each step copies the whole string
string s = "";
for (int i = 0; i < n; i++) s = s + 'a';   // O(n^2)

// Fast: amortised O(1) per append
string t = "";
for (int i = 0; i < n; i++) t += 'a';      // O(n)
// Fastest: t.reserve(n) first, or string t(n, 'a') for repetition`,
          java: `// Slow: each step copies the whole string
String s = "";
for (int i = 0; i < n; i++) s += 'a';        // O(n^2)

// Fast: amortised O(1) per append
StringBuilder sb = new StringBuilder();
for (int i = 0; i < n; i++) sb.append('a');  // O(n)
String t = sb.toString();`,
          python: `# Fragile: relies on an interpreter optimisation
s = ""
for i in range(n):
    s += "a"

# Reliable: collect, then join once
parts = []
for i in range(n):
    parts.append("a")
t = "".join(parts)         # O(n)
# For pure repetition: "a" * n`,
        },
      },
      {
        kind: 'table',
        headers: ['Operation', 'Cost', 'Note'],
        rows: [
          ['Read character at index i', 'O(1)', 'Strings are arrays underneath'],
          ['Length', 'O(1)', 'Stored, not counted'],
          [{ cpp: 'Append with `+=`', java: '`StringBuilder.append`', python: '`list.append` then `join`' }, 'O(1) amortised', 'The right way to build'],
          [{ cpp: '`s = s + c` in a loop', java: '`s += c` in a loop', python: '`s += c` in a loop (worst case)' }, 'O(n) each, O(n²) total', 'The wrong way'],
          ['Insert or delete in the middle', 'O(n)', 'Everything after shifts'],
          ['Compare two strings', 'O(min length)', 'Stops at the first difference'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Reversal and other rewrites: work on a character array',
        body: {
          cpp: '`std::string` is already mutable, so reverse it in place with two pointers or `std::reverse`. No conversion needed.',
          java: 'To reverse or rearrange, call `s.toCharArray()`, work on the `char[]` in place, then `new String(arr)`. Or use `new StringBuilder(s).reverse().toString()` for a plain reversal.',
          python: 'To rearrange characters, convert with `list(s)`, work on the list, then `\'\'.join(lst)`. For a plain reversal, `s[::-1]` is idiomatic and fast.',
        },
      },
    ],
    keyTakeaways: [
      { cpp: 'Use `+=` or `push_back`, never `s = s + c`, to append in a loop.', java: 'Strings are immutable; build with `StringBuilder` and `toString()` once.', python: 'Strings are immutable; collect pieces in a list and `join` once.' },
      'Repeated concatenation of an immutable string is O(n²).',
      'Reading by index and taking the length are O(1); inserting in the middle is O(n).',
    ],
    practice: {
      prompt: 'Read n and build a string of the first n lowercase letters repeated (abc...zabc...) the fast way. Then time the slow way for n = 100000 and the fast way, and note the difference.',
    },
  },
  // -------------------------------------------------------------------------
  {
    sub: 4,
    summary: 'Convert between strings and numbers, by library and by hand, and handle the inputs that break it.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Input arrives as text, answers go out as text, and in between you need numbers. Every language has a one-call conversion each way. The by-hand versions matter too: when the string has a sign, spaces, or letters mixed in, the library call either fails or does something you did not intend, and a manual parse gives you control.',
      },
      {
        kind: 'code',
        caption: 'Library conversions',
        code: {
          cpp: `int n = stoi("472");             // string to int
long long big = stoll("9000000000");
double x = stod("3.5");
string s = to_string(472);        // int to string
// stoi throws invalid_argument on "abc" and out_of_range on "99999999999"`,
          java: `int n = Integer.parseInt("472");     // string to int
long big = Long.parseLong("9000000000");
double x = Double.parseDouble("3.5");
String s = String.valueOf(472);      // int to string, or Integer.toString(472)
// parseInt throws NumberFormatException on "abc", " 42 " or "99999999999"`,
          python: `n = int("472")            # string to int
big = int("9000000000")   # no size limit
x = float("3.5")
s = str(472)              # int to string
# int("abc") raises ValueError; int(" 42 ") is fine (whitespace is stripped)`,
        },
      },
      { kind: 'heading', text: 'By hand: the multiply-and-add loop' },
      {
        kind: 'code',
        caption: 'Parse an optional sign followed by digits, stopping at the first non-digit',
        code: {
          cpp: `long long parse(const string& s) {
    int i = 0, sign = 1;
    while (i < s.size() && s[i] == ' ') i++;             // skip leading spaces
    if (i < s.size() && (s[i] == '-' || s[i] == '+')) {
        if (s[i] == '-') sign = -1;
        i++;
    }
    long long n = 0;
    while (i < s.size() && isdigit(s[i])) {
        n = n * 10 + (s[i] - '0');
        i++;
    }
    return sign * n;
}`,
          java: `static long parse(String s) {
    int i = 0, sign = 1;
    while (i < s.length() && s.charAt(i) == ' ') i++;    // skip leading spaces
    if (i < s.length() && (s.charAt(i) == '-' || s.charAt(i) == '+')) {
        if (s.charAt(i) == '-') sign = -1;
        i++;
    }
    long n = 0;
    while (i < s.length() && Character.isDigit(s.charAt(i))) {
        n = n * 10 + (s.charAt(i) - '0');
        i++;
    }
    return sign * n;
}`,
          python: `def parse(s):
    i, sign = 0, 1
    while i < len(s) and s[i] == ' ':          # skip leading spaces
        i += 1
    if i < len(s) and s[i] in '+-':
        if s[i] == '-':
            sign = -1
        i += 1
    n = 0
    while i < len(s) and s[i].isdigit():
        n = n * 10 + (ord(s[i]) - ord('0'))
        i += 1
    return sign * n`,
        },
      },
      {
        kind: 'text',
        body: 'Every `while` checks `i < length` **before** looking at `s[i]`, in that order. Reverse the two conditions and an all-spaces string reads one past the end. This shape, skip, optional sign, digits, stop, is exactly LeetCode\u2019s String to Integer (atoi) problem, plus a clamp to the 32-bit range that you add by checking `n` before each multiply.',
      },
      {
        kind: 'table',
        headers: ['Input', 'Library call', 'Hand parser above'],
        rows: [
          ['"42"', '42', '42'],
          ['"  -7"', { cpp: 'stoi: -7 (skips spaces)', java: 'parseInt: exception', python: 'int: -7' }, '-7'],
          ['"4x2"', { cpp: 'stoi: 4 (stops at x)', java: 'parseInt: exception', python: 'int: ValueError' }, '4'],
          ['"abc"', { cpp: 'stoi: exception', java: 'parseInt: exception', python: 'int: ValueError' }, '0'],
          ['"99999999999"', { cpp: 'stoi: exception; stoll: fine', java: 'parseInt: exception; parseLong: fine', python: 'int: fine' }, 'fine in 64 bits'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Leading zeros and number to string',
        body: 'Parsing "007" gives 7; converting 7 back gives "7". If the problem cares about the original width (zero-padded ids, times like 09:05), keep the string or pad on output. Number-to-string is the reverse loop: peel digits with `% 10`, which produces them backwards, so collect and reverse, or prepend.',
      },
    ],
    keyTakeaways: [
      { cpp: '`stoi`/`stoll`/`to_string` for the common case; they throw on garbage.', java: '`Integer.parseInt`/`String.valueOf` for the common case; parseInt throws on any non-digit, including spaces.', python: '`int()`/`str()` for the common case; `int` strips whitespace but rejects any other non-digit.' },
      'By hand: skip spaces, read an optional sign, then `n = n * 10 + digit` while digits last.',
      'Always test `i < length` before reading `s[i]`.',
    ],
    practice: {
      prompt: 'Implement the hand parser with a 32-bit clamp: if the value would exceed 2147483647 or go below -2147483648, return the limit. Test with "  -42", "4193 with words", "words and 987", "-91283472332".',
      leetcode: { title: 'String to Integer (atoi)', slug: 'string-to-integer-atoi' },
    },
  },
  // -------------------------------------------------------------------------
  {
    sub: 5,
    summary: 'Split a string into pieces on a separator and join pieces back together.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Most input is words separated by spaces, or fields separated by commas. Turning "the quick brown fox" into four words, and four words back into one string, are the two operations you do before and after almost every word-level problem: reversing word order, counting words, finding the longest, checking each against a dictionary.',
      },
      {
        kind: 'code',
        caption: 'Split on spaces and join with a separator',
        code: {
          cpp: `// Split: stringstream reads whitespace-separated tokens
string line = "the quick  brown fox";
stringstream ss(line);
vector<string> words;
string w;
while (ss >> w) words.push_back(w);   // ["the","quick","brown","fox"]; extra spaces ignored

// Join: no library one-liner; loop with a separator
string out;
for (int i = 0; i < words.size(); i++) {
    if (i > 0) out += " ";
    out += words[i];
}`,
          java: `// Split: regex "\\\\s+" means one or more whitespace characters
String line = "the quick  brown fox";
String[] words = line.trim().split("\\\\s+");   // ["the","quick","brown","fox"]

// Join
String out = String.join(" ", words);          // "the quick brown fox"`,
          python: `# Split: with no argument, split() collapses runs of whitespace and strips ends
line = "the quick  brown fox"
words = line.split()          # ['the', 'quick', 'brown', 'fox']

# Join: the separator is the string you call join on
out = " ".join(words)         # 'the quick brown fox'`,
        },
      },
      {
        kind: 'text',
        body: {
          cpp: 'Splitting on a specific character such as a comma is a small loop: walk the string, cut at each comma, and push the piece. `getline(ss, piece, \',\')` on a stringstream does exactly that. Unlike whitespace splitting, it keeps empty pieces: "a,,b" gives three pieces, the middle one empty.',
          java: '`split(",")` cuts on a literal comma and keeps interior empty pieces: "a,,b" gives ["a", "", "b"]. Note that `split` takes a regular expression, so splitting on "." or "|" needs escaping: `split("\\\\.")`. Trailing empty pieces are dropped unless you pass a negative limit.',
          python: '`split(",")` cuts on a literal comma and keeps every empty piece: "a,,b" gives [\'a\', \'\', \'b\'] and "a," gives [\'a\', \'\']. Only the no-argument form collapses runs and strips ends. Pick the form that matches what the problem promises about its separators.',
        },
      },
      { kind: 'heading', text: 'Splitting by hand' },
      {
        kind: 'text',
        body: 'Sometimes the separator rule is not a single character: split on any non-letter, or on transitions from lowercase to uppercase. Then you write the loop yourself: keep a start index, walk forward, and each time you hit a boundary, take the piece from start to here and move start past the boundary. Remember the last piece after the loop ends.',
      },
      {
        kind: 'code',
        caption: 'Split on any non-letter, by hand',
        code: {
          cpp: `vector<string> pieces;
string cur;
for (char c : s) {
    if (isalpha(c)) cur += c;
    else if (!cur.empty()) { pieces.push_back(cur); cur.clear(); }
}
if (!cur.empty()) pieces.push_back(cur);   // the last word`,
          java: `List<String> pieces = new ArrayList<>();
StringBuilder cur = new StringBuilder();
for (char c : s.toCharArray()) {
    if (Character.isLetter(c)) cur.append(c);
    else if (cur.length() > 0) { pieces.add(cur.toString()); cur.setLength(0); }
}
if (cur.length() > 0) pieces.add(cur.toString());   // the last word`,
          python: `pieces, cur = [], []
for c in s:
    if c.isalpha():
        cur.append(c)
    elif cur:
        pieces.append("".join(cur))
        cur = []
if cur:
    pieces.append("".join(cur))   # the last word`,
        },
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'The last piece',
        body: 'The loop only emits a piece when it sees a separator, so the final piece, which has no separator after it, must be emitted after the loop. Forgetting it drops the last word and passes every test whose input happens to end in a separator.',
      },
    ],
    keyTakeaways: [
      { cpp: '`stringstream >> word` splits on whitespace; `getline(ss, piece, sep)` splits on one character.', java: '`split("\\\\s+")` for whitespace, `split(",")` for one character; join with `String.join`.', python: '`split()` for whitespace, `split(",")` for one character; join with `sep.join(list)`.' },
      'Single-character splits keep empty pieces; whitespace splits usually collapse them.',
      'Hand-written splits must emit the final piece after the loop.',
    ],
    practice: {
      prompt: 'Read a line and print its words in reverse order, with single spaces, ignoring any extra spaces in the input. Then read a comma-separated line of numbers and print their sum.',
      leetcode: { title: 'Reverse Words in a String', slug: 'reverse-words-in-a-string' },
    },
  },
  // -------------------------------------------------------------------------
  {
    sub: 6,
    summary: 'Understand lexicographic order and sort strings by length, by custom keys and case-insensitively.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Strings compare the way words are ordered in a dictionary, with one twist: the ordering of individual characters is by code, not by the alphabet as you learned it. The rule is called **lexicographic** order: compare the first characters; if they differ, that decides it; if they are the same, move to the second; and if one string runs out first, the shorter one is smaller.',
      },
      {
        kind: 'table',
        headers: ['Comparison', 'Result', 'Why'],
        rows: [
          ['"apple" vs "apricot"', '"apple" first', 'Differ at index 2: l (108) < r (114)'],
          ['"app" vs "apple"', '"app" first', 'Prefix runs out; shorter is smaller'],
          ['"Zebra" vs "apple"', '"Zebra" first', 'Z (90) < a (97)'],
          ['"10" vs "9"', '"10" first', 'Character 1 (49) < 9 (57); not numeric!'],
        ],
      },
      {
        kind: 'code',
        caption: 'Comparing and sorting',
        code: {
          cpp: `string a = "apple", b = "apricot";
bool less = a < b;                    // true; operator< is lexicographic
int cmp = a.compare(b);               // negative, zero or positive

vector<string> v = {"pear", "fig", "apple"};
sort(v.begin(), v.end());             // fig, apple? No: apple, fig, pear`,
          java: `String a = "apple", b = "apricot";
int cmp = a.compareTo(b);             // negative, zero or positive
boolean same = a.equals(b);           // never use == for content

List<String> v = new ArrayList<>(List.of("pear", "fig", "apple"));
Collections.sort(v);                  // apple, fig, pear`,
          python: `a, b = "apple", "apricot"
less = a < b                          # True; comparison is lexicographic

v = ["pear", "fig", "apple"]
v.sort()                              # ['apple', 'fig', 'pear']`,
        },
      },
      { kind: 'heading', text: 'Sorting by something other than the default' },
      {
        kind: 'text',
        body: 'Sort by length, shortest first; by length then alphabetically; ignoring case; or by a computed key such as the sorted characters of each word (which groups anagrams together). All of these are the same sort with a different rule for comparing two strings.',
      },
      {
        kind: 'code',
        caption: 'Custom orders',
        code: {
          cpp: `// By length, ties alphabetical
sort(v.begin(), v.end(), [](const string& x, const string& y) {
    if (x.size() != y.size()) return x.size() < y.size();
    return x < y;
});

// Case-insensitive: compare lowered copies
auto lower = [](string s) { for (auto& c : s) c = tolower(c); return s; };
sort(v.begin(), v.end(), [&](const string& x, const string& y) { return lower(x) < lower(y); });`,
          java: `// By length, ties alphabetical
v.sort(Comparator.comparingInt(String::length).thenComparing(Comparator.naturalOrder()));

// Case-insensitive
v.sort(String.CASE_INSENSITIVE_ORDER);

// By a computed key: sorted characters, which groups anagrams
v.sort(Comparator.comparing(s -> {
    char[] c = s.toCharArray(); Arrays.sort(c); return new String(c);
}));`,
          python: `# By length, ties alphabetical: a tuple key compares element by element
v.sort(key=lambda s: (len(s), s))

# Case-insensitive
v.sort(key=str.lower)

# By a computed key: sorted characters, which groups anagrams
v.sort(key=lambda s: "".join(sorted(s)))`,
        },
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Numbers stored as strings do not sort numerically',
        body: '["10", "9", "100"] sorts to ["10", "100", "9"]. If the strings represent numbers, convert them or use a numeric key. The reverse trap appears in the problem Largest Number, where the right order for concatenation is neither numeric nor plain lexicographic: compare `a + b` against `b + a`.',
      },
    ],
    keyTakeaways: [
      'Lexicographic order: first differing character decides; a prefix is smaller than the longer string.',
      'Custom sorts are the default sort with a different comparison or key.',
      'Strings of digits sort as text, not as numbers.',
    ],
    practice: {
      prompt: 'Read n words and print them sorted by length, ties broken alphabetically ignoring case. Then group the words that are anagrams of each other by sorting with the sorted-characters key and printing consecutive words with equal keys on one line.',
      leetcode: { title: 'Group Anagrams', slug: 'group-anagrams' },
    },
  },
  // -------------------------------------------------------------------------
  {
    sub: 7,
    summary: 'Test whether two strings are anagrams by sorting or by counting, and know when each wins.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'Two strings are **anagrams** if they contain the same characters the same number of times, in any order: "listen" and "silent". Two approaches, and both come up again and again, because "same multiset of characters" is what a surprising number of problems reduce to.',
      },
      { kind: 'heading', text: 'Approach 1: sort both and compare' },
      {
        kind: 'code',
        caption: 'Sorting: short to write, O(n log n)',
        code: {
          cpp: `bool isAnagram(string a, string b) {
    if (a.size() != b.size()) return false;
    sort(a.begin(), a.end());
    sort(b.begin(), b.end());
    return a == b;
}`,
          java: `static boolean isAnagram(String a, String b) {
    if (a.length() != b.length()) return false;
    char[] x = a.toCharArray(), y = b.toCharArray();
    Arrays.sort(x);
    Arrays.sort(y);
    return Arrays.equals(x, y);
}`,
          python: `def is_anagram(a, b):
    return len(a) == len(b) and sorted(a) == sorted(b)`,
        },
      },
      { kind: 'heading', text: 'Approach 2: count characters' },
      {
        kind: 'code',
        caption: 'Counting: one pass each, O(n), for lowercase letters',
        code: {
          cpp: `bool isAnagram(const string& a, const string& b) {
    if (a.size() != b.size()) return false;
    int cnt[26] = {0};
    for (char c : a) cnt[c - 'a']++;
    for (char c : b) cnt[c - 'a']--;
    for (int x : cnt) if (x != 0) return false;
    return true;
}`,
          java: `static boolean isAnagram(String a, String b) {
    if (a.length() != b.length()) return false;
    int[] cnt = new int[26];
    for (char c : a.toCharArray()) cnt[c - 'a']++;
    for (char c : b.toCharArray()) cnt[c - 'a']--;
    for (int x : cnt) if (x != 0) return false;
    return true;
}`,
          python: `def is_anagram(a, b):
    if len(a) != len(b):
        return False
    cnt = [0] * 26
    for c in a:
        cnt[ord(c) - ord('a')] += 1
    for c in b:
        cnt[ord(c) - ord('a')] -= 1
    return all(x == 0 for x in cnt)
# or: from collections import Counter; Counter(a) == Counter(b)`,
        },
      },
      {
        kind: 'text',
        body: 'The counting version increments for one string and decrements for the other, so a single array ends at all zeros exactly when the counts matched. That trick, add for one side and subtract for the other, avoids a second array and a comparison loop.',
      },
      {
        kind: 'table',
        headers: ['', 'Sort', 'Count'],
        rows: [
          ['Time', 'O(n log n)', 'O(n + alphabet)'],
          ['Extra space', 'Copies of both strings (or in-place sort)', 'One small array'],
          ['Alphabet', 'Any', 'Needs a bounded alphabet, or a hash map'],
          ['As a grouping key', 'Sorted string is a natural key', 'Count array must be turned into a key'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Anagram as a sliding-window question',
        body: 'Find every position where a window of length m in a long string is an anagram of a pattern of length m: keep a count array for the window, add the character entering, subtract the one leaving, and compare to the pattern\u2019s counts. That is the sliding window pattern from Phase 1 applied to counting arrays.',
      },
    ],
    keyTakeaways: [
      'Anagram = same character counts. Check lengths first.',
      'Sort both and compare: simple, O(n log n). Count with +1/-1 in one array: O(n).',
      'The sorted string is the standard key for grouping anagrams.',
    ],
    practice: {
      prompt: 'Implement both versions and confirm they agree on ("listen","silent"), ("rat","car"), ("aab","abb"). Then find all start indices in "cbaebabacd" where a window of length 3 is an anagram of "abc" (expect 0 and 6).',
      leetcode: { title: 'Valid Anagram', slug: 'valid-anagram' },
    },
  },
  // -------------------------------------------------------------------------
  {
    sub: 8,
    summary: 'Check palindromes with two pointers, and find the longest palindrome by expanding around each centre.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A **palindrome** reads the same forwards and backwards: "level", "racecar", "abba". Checking one is the two-pointer reversal from the arrays chapter with a comparison instead of a swap. Finding the longest palindromic substring inside a string is a different problem, and the technique for it, expanding outwards from every possible centre, is the one interviewers expect.',
      },
      {
        kind: 'code',
        caption: 'Is it a palindrome? Two pointers from the ends',
        code: {
          cpp: `bool isPalindrome(const string& s) {
    int lo = 0, hi = s.size() - 1;
    while (lo < hi) {
        if (s[lo] != s[hi]) return false;
        lo++; hi--;
    }
    return true;
}`,
          java: `static boolean isPalindrome(String s) {
    int lo = 0, hi = s.length() - 1;
    while (lo < hi) {
        if (s.charAt(lo) != s.charAt(hi)) return false;
        lo++; hi--;
    }
    return true;
}`,
          python: `def is_palindrome(s):
    lo, hi = 0, len(s) - 1
    while lo < hi:
        if s[lo] != s[hi]:
            return False
        lo += 1
        hi -= 1
    return True
# Idiomatic one-liner: s == s[::-1]`,
        },
      },
      {
        kind: 'text',
        body: 'When the problem says to ignore case and non-alphanumeric characters ("A man, a plan, a canal: Panama"), keep the same two pointers but let each one skip forward past characters that do not count, and compare lowercased characters. Doing it in place this way avoids building a cleaned copy.',
      },
      { kind: 'heading', text: 'Longest palindromic substring: expand around centre' },
      {
        kind: 'text',
        body: 'Every palindrome has a centre: a single character for odd length ("rac**e**car"), or the gap between two equal characters for even length ("ab|ba"). There are 2n - 1 possible centres. From each, expand outwards while the characters on both sides match, and record the longest expansion. Each expansion is O(n) at worst, so O(n²) total, with O(1) extra space, and it is far simpler than the O(n) algorithm that exists.',
      },
      {
        kind: 'code',
        caption: 'Expand around every centre',
        code: {
          cpp: `string longestPalindrome(const string& s) {
    int bestStart = 0, bestLen = 0;
    auto expand = [&](int lo, int hi) {
        while (lo >= 0 && hi < s.size() && s[lo] == s[hi]) { lo--; hi++; }
        // now s[lo+1 .. hi-1] is the palindrome
        if (hi - lo - 1 > bestLen) { bestLen = hi - lo - 1; bestStart = lo + 1; }
    };
    for (int i = 0; i < s.size(); i++) {
        expand(i, i);       // odd length, centred on s[i]
        expand(i, i + 1);   // even length, centred between s[i] and s[i+1]
    }
    return s.substr(bestStart, bestLen);
}`,
          java: `static String longestPalindrome(String s) {
    int bestStart = 0, bestLen = 0;
    for (int i = 0; i < s.length(); i++) {
        for (int[] c : new int[][]{{i, i}, {i, i + 1}}) {   // odd, then even centre
            int lo = c[0], hi = c[1];
            while (lo >= 0 && hi < s.length() && s.charAt(lo) == s.charAt(hi)) { lo--; hi++; }
            if (hi - lo - 1 > bestLen) { bestLen = hi - lo - 1; bestStart = lo + 1; }
        }
    }
    return s.substring(bestStart, bestStart + bestLen);
}`,
          python: `def longest_palindrome(s):
    best_start, best_len = 0, 0
    for i in range(len(s)):
        for lo, hi in ((i, i), (i, i + 1)):      # odd, then even centre
            while lo >= 0 and hi < len(s) and s[lo] == s[hi]:
                lo -= 1
                hi += 1
            if hi - lo - 1 > best_len:
                best_len, best_start = hi - lo - 1, lo + 1
    return s[best_start:best_start + best_len]`,
        },
      },
      {
        kind: 'text',
        body: 'After the `while` stops, `lo` and `hi` have each gone one step too far, so the palindrome is `s[lo+1 .. hi-1]`, of length `hi - lo - 1`. Get that arithmetic right once and the rest is bookkeeping.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Even-length palindromes are the ones people forget',
        body: 'Expanding only from single characters finds "aba" but not "abba". The second `expand(i, i + 1)` call is what catches the even case. Test with "abba" and "cbbd" (answer "bb").',
      },
    ],
    keyTakeaways: [
      'Palindrome check: two pointers from the ends, compare, walk inwards.',
      'Longest palindromic substring: expand from each of 2n - 1 centres; O(n²) time, O(1) space.',
      'Handle both odd centres (i, i) and even centres (i, i + 1).',
    ],
    practice: {
      prompt: 'Implement the case-insensitive, alphanumeric-only palindrome check with in-place skipping. Then implement expand-around-centre and test with "babad" (bab or aba), "cbbd" (bb) and "a".',
      leetcode: { title: 'Longest Palindromic Substring', slug: 'longest-palindromic-substring' },
    },
  },
  // -------------------------------------------------------------------------
  {
    sub: 9,
    summary: 'Search for a pattern inside a text the straightforward way, and know exactly what it costs.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'Does the pattern "abc" appear in the text "xxabcxx", and where? The naive algorithm tries every starting position in the text and, at each, compares the pattern character by character until a mismatch or a full match. It is the algorithm you would invent yourself, it is what the library function does for short patterns, and knowing its cost tells you when you need something smarter.',
      },
      {
        kind: 'code',
        caption: 'Naive substring search: first occurrence, or -1',
        code: {
          cpp: `int find(const string& text, const string& pat) {
    int n = text.size(), m = pat.size();
    for (int i = 0; i + m <= n; i++) {          // every start where the pattern fits
        int j = 0;
        while (j < m && text[i + j] == pat[j]) j++;
        if (j == m) return i;                   // matched all m characters
    }
    return -1;
}
// Library: text.find(pat) returns the index or string::npos`,
          java: `static int find(String text, String pat) {
    int n = text.length(), m = pat.length();
    for (int i = 0; i + m <= n; i++) {          // every start where the pattern fits
        int j = 0;
        while (j < m && text.charAt(i + j) == pat.charAt(j)) j++;
        if (j == m) return i;                   // matched all m characters
    }
    return -1;
}
// Library: text.indexOf(pat) returns the index or -1`,
          python: `def find(text, pat):
    n, m = len(text), len(pat)
    for i in range(n - m + 1):                  # every start where the pattern fits
        j = 0
        while j < m and text[i + j] == pat[j]:
            j += 1
        if j == m:
            return i                            # matched all m characters
    return -1
# Library: text.find(pat) returns the index or -1; "pat in text" for a yes/no`,
        },
      },
      {
        kind: 'text',
        body: 'The outer loop bound `i + m <= n` is the important detail: the pattern must fit entirely, so the last valid start is n - m. Write it as `i <= n - m` and an empty text with a non-empty pattern gives a negative bound, which some languages handle and some do not; the `i + m <= n` form is safe everywhere.',
      },
      {
        kind: 'table',
        headers: ['Case', 'Cost', 'Example'],
        rows: [
          ['Typical text', 'About O(n)', 'Most positions mismatch on the first character'],
          ['Worst case', 'O(n × m)', 'text "aaaa...a", pattern "aaa...ab": every start nearly matches'],
          ['Memory', 'O(1)', 'No preprocessing'],
        ],
      },
      {
        kind: 'text',
        body: 'For most inputs the naive search is fast, because mismatches usually happen at the first or second character and the inner loop stops at once. The worst case is real but needs a repetitive text and pattern. When the problem is built around that worst case, or asks for all matches of many patterns, the KMP and rolling-hash algorithms in the tries and string algorithms chapter bring it to O(n + m).',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Counting occurrences and overlapping matches',
        body: 'To count occurrences instead of stopping at the first, replace `return i` with `count++`. Overlapping matches are found naturally, because the outer loop moves one position at a time: "aaa" in "aaaaa" gives 3. If the problem wants non-overlapping matches, jump `i` forward by m - 1 after a match.',
      },
    ],
    keyTakeaways: [
      'Naive search tries every start position and compares character by character.',
      'Fast in practice, O(n × m) on repetitive worst cases.',
      'The pattern must fit: loop while `i + m <= n`.',
    ],
    practice: {
      prompt: 'Implement the naive search and count how many character comparisons it makes on text "aaaaaaaaab" with pattern "aaab", versus text "the quick brown fox" with pattern "fox". Then modify it to return every match index.',
      leetcode: { title: 'Find the Index of the First Occurrence in a String', slug: 'find-the-index-of-the-first-occurrence-in-a-string' },
    },
  },
  // -------------------------------------------------------------------------
  {
    sub: 10,
    summary: 'Treat a list of strings as a grid of characters and search it for words in any direction.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A list of equal-length strings is a grid where `grid[r][c]` is one character: word searches, mazes drawn with # and ., game boards. The array traversal techniques carry over unchanged. The one new idea is that a search can move through the grid in eight directions, and that recursive exploration with a "visited" mark is how you find a word laid out along a winding path.',
      },
      {
        kind: 'code',
        caption: 'A grid of characters',
        code: {
          cpp: `vector<string> grid = {
    "ABCE",
    "SFCS",
    "ADEE"
};
int R = grid.size(), C = grid[0].size();
char ch = grid[1][2];   // 'C'`,
          java: `String[] rows = { "ABCE", "SFCS", "ADEE" };
char[][] grid = new char[rows.length][];
for (int r = 0; r < rows.length; r++) grid[r] = rows[r].toCharArray();
int R = grid.length, C = grid[0].length;
char ch = grid[1][2];   // 'C'`,
          python: `grid = [
    "ABCE",
    "SFCS",
    "ADEE",
]
R, C = len(grid), len(grid[0])
ch = grid[1][2]         # 'C'
# For in-place marking, convert rows to lists: grid = [list(row) for row in grid]`,
        },
      },
      { kind: 'heading', text: 'Straight-line search in eight directions' },
      {
        kind: 'text',
        body: 'For a classic word-search puzzle, a word runs in a straight line: horizontally, vertically or diagonally, forwards or backwards. That is eight direction vectors. From each cell, for each direction, step along the word\u2019s length checking bounds and characters. Cost O(R × C × 8 × m).',
      },
      {
        kind: 'code',
        caption: 'Does word start at (r, c) going in direction (dr, dc)?',
        code: {
          cpp: `int DR[8] = {-1,-1,-1, 0, 0, 1, 1, 1};
int DC[8] = {-1, 0, 1,-1, 1,-1, 0, 1};

bool matchesAt(const vector<string>& g, const string& w, int r, int c, int dr, int dc) {
    int R = g.size(), C = g[0].size();
    for (int k = 0; k < w.size(); k++) {
        int nr = r + k * dr, nc = c + k * dc;
        if (nr < 0 || nr >= R || nc < 0 || nc >= C || g[nr][nc] != w[k]) return false;
    }
    return true;
}`,
          java: `static final int[] DR = {-1,-1,-1, 0, 0, 1, 1, 1};
static final int[] DC = {-1, 0, 1,-1, 1,-1, 0, 1};

static boolean matchesAt(char[][] g, String w, int r, int c, int dr, int dc) {
    int R = g.length, C = g[0].length;
    for (int k = 0; k < w.length(); k++) {
        int nr = r + k * dr, nc = c + k * dc;
        if (nr < 0 || nr >= R || nc < 0 || nc >= C || g[nr][nc] != w.charAt(k)) return false;
    }
    return true;
}`,
          python: `DIRS = [(-1,-1), (-1,0), (-1,1), (0,-1), (0,1), (1,-1), (1,0), (1,1)]

def matches_at(g, w, r, c, dr, dc):
    R, C = len(g), len(g[0])
    for k, ch in enumerate(w):
        nr, nc = r + k * dr, c + k * dc
        if not (0 <= nr < R and 0 <= nc < C) or g[nr][nc] != ch:
            return False
    return True`,
        },
      },
      { kind: 'heading', text: 'Winding-path search: the DFS preview' },
      {
        kind: 'text',
        body: 'LeetCode\u2019s Word Search allows the word to turn corners: each next letter must be an unvisited 4-neighbour of the previous one. That needs recursion: at cell (r, c) matching `w[k]`, mark the cell visited, try each of the four neighbours for `w[k + 1]`, and unmark on the way back so other paths can use the cell. This is backtracking on a grid, and both the backtracking chapter and the graphs chapter build on exactly this shape. Read the code now to see the pattern; you will write it yourself there.',
      },
      {
        kind: 'code',
        caption: 'Word search with backtracking (preview)',
        code: {
          cpp: `bool dfs(vector<string>& g, const string& w, int r, int c, int k) {
    if (k == w.size()) return true;
    if (r < 0 || r >= g.size() || c < 0 || c >= g[0].size() || g[r][c] != w[k]) return false;
    char saved = g[r][c];
    g[r][c] = '#';                          // mark visited in place
    bool found = dfs(g, w, r+1, c, k+1) || dfs(g, w, r-1, c, k+1)
              || dfs(g, w, r, c+1, k+1) || dfs(g, w, r, c-1, k+1);
    g[r][c] = saved;                        // unmark on the way back
    return found;
}`,
          java: `static boolean dfs(char[][] g, String w, int r, int c, int k) {
    if (k == w.length()) return true;
    if (r < 0 || r >= g.length || c < 0 || c >= g[0].length || g[r][c] != w.charAt(k)) return false;
    char saved = g[r][c];
    g[r][c] = '#';                          // mark visited in place
    boolean found = dfs(g, w, r+1, c, k+1) || dfs(g, w, r-1, c, k+1)
                 || dfs(g, w, r, c+1, k+1) || dfs(g, w, r, c-1, k+1);
    g[r][c] = saved;                        // unmark on the way back
    return found;
}`,
          python: `def dfs(g, w, r, c, k):
    if k == len(w):
        return True
    if not (0 <= r < len(g) and 0 <= c < len(g[0])) or g[r][c] != w[k]:
        return False
    saved = g[r][c]
    g[r][c] = '#'                           # mark visited in place (g rows are lists)
    found = (dfs(g, w, r+1, c, k+1) or dfs(g, w, r-1, c, k+1)
             or dfs(g, w, r, c+1, k+1) or dfs(g, w, r, c-1, k+1))
    g[r][c] = saved                         # unmark on the way back
    return found`,
        },
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Check bounds before reading the cell',
        body: 'The order of the conditions in the second `if` matters: bounds first, then `g[r][c]`. Swap them and an out-of-range neighbour reads outside the grid before the bounds check can save you. In the straight-line version the same rule applies inside the loop.',
      },
    ],
    keyTakeaways: [
      'A list of strings is a character grid; `grid[r][c]` is a character, and array traversal rules apply.',
      'Straight-line word search: eight direction vectors, step k cells along each, check bounds then character.',
      'Winding-path search is backtracking: mark, recurse into neighbours, unmark.',
    ],
    practice: {
      prompt: 'Build a 5×5 grid of letters and implement the eight-direction straight-line search that prints every (row, col, direction) where a given word starts. Then read the DFS version, trace it by hand on the 3×4 grid above for the word "ABCCED", and note the order in which cells are marked and unmarked.',
      leetcode: { title: 'Word Search', slug: 'word-search' },
    },
  },
];
