import type { SharedLesson } from './types';

/**
 * First Programs, Step by Step — the reader's first real code.
 * Each lesson is one complete, runnable program built one line at a time and
 * then varied. Syntax is explained only as far as the program needs it; the
 * language chapters that follow give the full rules.
 */

// The boilerplate every complete program needs, so lessons can show it once
// and then focus on the lines that change.
const SHELL_NOTE = {
  cpp: 'Every complete C++ program has the same frame: an `#include` line to get input and output, `using namespace std;` to keep names short, and `int main() { ... }` where your steps go. Copy the frame; only the inside changes from program to program.',
  java: 'Every complete Java program has the same frame: a class whose name matches the file name, and inside it `public static void main(String[] args) { ... }` where your steps go. Copy the frame; only the inside changes from program to program.',
  python: 'A Python program has no frame at all. The file is the program, and the interpreter runs it from the first line to the last. That is why the examples here are so short.',
};

export const lessons: SharedLesson[] = [
  // -------------------------------------------------------------------------
  {
    sub: 1,
    summary: 'Write, run and change a program that prints text and numbers.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'The first program anyone writes prints something, because printing is the only way to see that the program ran at all. You will type the program below exactly as shown, run it, and see the text appear. Then you will change it and run it again. That loop of edit, run, look is how every program you will ever write gets built.',
      },
      { kind: 'text', body: SHELL_NOTE },
      {
        kind: 'code',
        caption: 'Print one line of text',
        code: {
          cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, DSA!" << endl;
    return 0;
}`,
          java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, DSA!");
    }
}`,
          python: `print("Hello, DSA!")`,
        },
        output: 'Hello, DSA!',
      },
      {
        kind: 'text',
        body: {
          cpp: 'The line that does the work is `cout << "Hello, DSA!" << endl;`. `cout` is the screen. `<<` sends things to it, left to right. The text in double quotes is printed exactly as written. `endl` ends the line so the next print starts underneath. The semicolon ends the instruction.',
          java: 'The line that does the work is `System.out.println("Hello, DSA!");`. `System.out` is the screen, `println` prints what is in the brackets and then ends the line so the next print starts underneath. The text in double quotes is printed exactly as written. The semicolon ends the instruction.',
          python: '`print` shows whatever is in the brackets and then ends the line so the next print starts underneath. The text in double quotes is printed exactly as written.',
        },
      },
      { kind: 'heading', text: 'Text and numbers are different' },
      {
        kind: 'text',
        body: 'Anything in double quotes is **text**, printed as-is. Anything not in quotes is treated as a value to be worked out first. `"2 + 3"` prints the five characters 2, space, +, space, 3. `2 + 3` prints 5.',
      },
      {
        kind: 'code',
        caption: 'Quoted and unquoted',
        code: {
          cpp: `cout << "2 + 3" << endl;
cout << 2 + 3 << endl;`,
          java: `System.out.println("2 + 3");
System.out.println(2 + 3);`,
          python: `print("2 + 3")
print(2 + 3)`,
        },
        output: '2 + 3\n5',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'The first error everyone makes',
        body: {
          cpp: 'A missing semicolon or a missing closing quote. The compiler will point at the line after the mistake, not the line with it, because that is where it first notices something is wrong. When an error message names a line, look at that line and the one above it.',
          java: 'A missing semicolon, a missing closing quote, or a class name that does not match the file name (`Main` must live in `Main.java`). The compiler names the line where it noticed the problem, which is often the line after the mistake. Look at that line and the one above it.',
          python: 'A missing closing quote or bracket. Python reports a `SyntaxError` and points at the place it got confused, which can be the line after the mistake. Look at that line and the one above it.',
        },
      },
    ],
    keyTakeaways: [
      'Edit, run, look. Every program is built by repeating those three steps.',
      'Text in double quotes is printed as written; values outside quotes are worked out first.',
      'When an error names a line, check that line and the one above it.',
    ],
    practice: {
      prompt: 'Change the program to print three lines: your name, your favourite number, and the result of multiplying that number by 7 (worked out by the program, not by you). Run it after each change.',
    },
  },
  // -------------------------------------------------------------------------
  {
    sub: 2,
    summary: 'Read a number typed by the user and print it back.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'A program that only prints fixed text does the same thing every time. The moment it can read a value typed by the user, it becomes a tool. This lesson adds one line: reading a number into a variable. Everything else stays the same as before.',
      },
      {
        kind: 'code',
        caption: 'Read a number, then print it',
        code: {
          cpp: `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    cout << "You typed " << n << endl;
    return 0;
}`,
          java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        System.out.println("You typed " + n);
    }
}`,
          python: `n = int(input())
print("You typed", n)`,
        },
        output: 'You typed 42   (when the user types 42)',
      },
      {
        kind: 'text',
        body: {
          cpp: '`int n;` creates a box called `n` for a whole number. `cin >> n;` waits for the user to type something and press Enter, then puts it in the box. `cin` is the keyboard, the mirror image of `cout`, and the arrows point the other way: from the keyboard into `n`.',
          java: '`Scanner sc = new Scanner(System.in);` sets up a reader attached to the keyboard; you write it once at the top of `main`. `int n = sc.nextInt();` waits for the user to type a whole number and press Enter, then puts it in the box called `n`. The `import` line at the top makes `Scanner` available.',
          python: '`input()` waits for the user to type something and press Enter, and gives back what they typed as **text**. `int(...)` converts that text into a whole number. `n = ...` stores it in the box called `n`. Forgetting `int()` is the classic mistake: `"42" + 1` is an error, because you cannot add a number to text.',
        },
      },
      { kind: 'heading', text: 'Printing text and a value together' },
      {
        kind: 'text',
        body: {
          cpp: 'You can send several things to `cout` in a row with more `<<` arrows: first the quoted text, then the variable. They are printed side by side on one line.',
          java: 'The `+` between text and a number joins them into one piece of text. `"You typed " + 42` becomes `"You typed 42"`. The space before the closing quote is what keeps the words from running together.',
          python: '`print` accepts several things separated by commas and prints them with a space between each. `print("You typed", n)` prints the text, a space, then the number.',
        },
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Running with input',
        body: 'When you run the program it will appear to freeze. It is waiting for you. Type a number, press Enter, and it continues. On LeetCode you never write input code; the site passes values straight into your function. Locally you need it so you can test.',
      },
    ],
    keyTakeaways: [
      'Reading input stores what the user typed in a variable.',
      { cpp: '`cin >> n` reads into n; `cout << n` prints it. The arrows show the direction of travel.', java: '`sc.nextInt()` reads a whole number; `+` joins text and values for printing.', python: '`input()` gives text; wrap it in `int()` to get a number.' },
      'A program waiting for input looks frozen. Type a value and press Enter.',
    ],
    practice: {
      prompt: 'Extend the program to read two numbers, one after the other, and print them on one line separated by the word "and". Test with 3 and 8; the output should be "3 and 8".',
    },
  },
  // -------------------------------------------------------------------------
  {
    sub: 3,
    summary: 'Create variables, change them and reuse them within one program.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'A variable is a labelled box. This lesson uses several boxes in one program and changes what is in them as the program runs. Watch for the pattern `x = x + something`: it means "take what is in x, add to it, and put the result back". After it, x holds the new value and the old one is gone.',
      },
      {
        kind: 'code',
        caption: 'A shop bill built up step by step',
        code: {
          cpp: `#include <iostream>
using namespace std;

int main() {
    int price = 40;
    int quantity = 3;
    int total = price * quantity;   // 120
    cout << "Before discount: " << total << endl;

    total = total - 20;             // 100
    cout << "After discount: " << total << endl;

    quantity = quantity + 1;        // 4
    total = price * quantity;       // 160, recomputed from scratch
    cout << "With one more: " << total << endl;
    return 0;
}`,
          java: `public class Main {
    public static void main(String[] args) {
        int price = 40;
        int quantity = 3;
        int total = price * quantity;   // 120
        System.out.println("Before discount: " + total);

        total = total - 20;             // 100
        System.out.println("After discount: " + total);

        quantity = quantity + 1;        // 4
        total = price * quantity;       // 160, recomputed from scratch
        System.out.println("With one more: " + total);
    }
}`,
          python: `price = 40
quantity = 3
total = price * quantity     # 120
print("Before discount:", total)

total = total - 20           # 100
print("After discount:", total)

quantity = quantity + 1      # 4
total = price * quantity     # 160, recomputed from scratch
print("With one more:", total)`,
        },
        output: 'Before discount: 120\nAfter discount: 100\nWith one more: 160',
      },
      {
        kind: 'text',
        body: 'The last block is the important one. Changing `quantity` does **not** change `total`. A variable holds a value, not a formula. `total` was worked out once, when its line ran, and it keeps that value until a line stores a new one. To get the updated total you must compute it again.',
      },
      { kind: 'heading', text: 'Naming boxes' },
      {
        kind: 'text',
        body: 'A name should say what the box holds. `total`, `price`, `count` are good. `x`, `a1`, `temp2` are bad, because two weeks from now you will not remember what they meant. Names cannot contain spaces or start with a digit; join words like `totalPrice` or `total_price`. Names are case-sensitive: `Total` and `total` are two different boxes.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Using a box before putting something in it',
        body: {
          cpp: '`int x; cout << x;` prints garbage: whatever happened to be in that memory. C++ does not clear boxes for you. Always give a variable a value when you create it, `int x = 0;`, unless the very next line reads into it.',
          java: 'Java refuses to compile a program that reads a variable before assigning it: "variable x might not have been initialized". It is an error, not a bug, which is a kindness. Give the variable a value when you create it.',
          python: 'Using a name before assigning it is a `NameError`. If you see "name x is not defined", either you have not stored anything in `x` yet, or you have spelled it differently somewhere.',
        },
      },
    ],
    keyTakeaways: [
      'A variable holds a value, not a formula. Changing the inputs does not update it; recompute it.',
      '`x = x + 1` reads x, adds one, and stores the result back in x.',
      'Name boxes for what they hold, and give every box a value when you create it.',
    ],
    practice: {
      prompt: 'Two variables, a = 5 and b = 9. Write a program that swaps their values so a holds 9 and b holds 5, then prints both. You will need a third box. Trace it on paper first.',
    },
  },
  // -------------------------------------------------------------------------
  {
    sub: 4,
    summary: 'Do arithmetic on values the user typed, and handle the division that does not come out even.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Input, process, output, with real arithmetic in the middle. This program reads three marks and prints their average. It is nine lines long, and one of those lines hides a trap that catches nearly every beginner: dividing whole numbers.',
      },
      {
        kind: 'code',
        caption: 'Average of three marks',
        code: {
          cpp: `#include <iostream>
using namespace std;

int main() {
    int a, b, c;
    cin >> a >> b >> c;
    int sum = a + b + c;
    double average = sum / 3.0;
    cout << "Average: " << average << endl;
    return 0;
}`,
          java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        int c = sc.nextInt();
        int sum = a + b + c;
        double average = sum / 3.0;
        System.out.println("Average: " + average);
    }
}`,
          python: `a = int(input())
b = int(input())
c = int(input())
total = a + b + c
average = total / 3
print("Average:", average)`,
        },
        output: 'Average: 83.3333   (for 80, 90, 80)',
      },
      { kind: 'heading', text: 'The five operators' },
      {
        kind: 'table',
        headers: ['Symbol', 'Meaning', 'Example', 'Result'],
        rows: [
          ['`+`', 'add', '`7 + 2`', '9'],
          ['`-`', 'subtract', '`7 - 2`', '5'],
          ['`*`', 'multiply', '`7 * 2`', '14'],
          ['`/`', 'divide', '`7 / 2`', { cpp: '3 (whole numbers only!)', java: '3 (whole numbers only!)', python: '3.5' }],
          ['`%`', 'remainder after division', '`7 % 2`', '1'],
        ],
      },
      {
        kind: 'text',
        body: {
          cpp: 'When both sides of `/` are whole numbers, C++ throws the fraction away. `7 / 2` is 3, not 3.5. That is why the program divides by `3.0` and not `3`: a decimal on one side makes the whole division decimal, and `double` is the box type that can hold decimals. `sum / 3` would have printed 83, silently wrong.',
          java: 'When both sides of `/` are whole numbers, Java throws the fraction away. `7 / 2` is 3, not 3.5. That is why the program divides by `3.0` and not `3`: a decimal on one side makes the whole division decimal, and `double` is the box type that can hold decimals. `sum / 3` would have printed 83, silently wrong.',
          python: 'Python’s `/` always gives a decimal: `7 / 2` is 3.5. If you want the whole-number part, use `//`: `7 // 2` is 3. Beginners coming from other languages sometimes use `/` when they need a whole number, then get errors later because 3.5 cannot be used as, say, a list position.',
        },
      },
      {
        kind: 'text',
        body: 'The `%` operator, called **modulo**, gives the remainder. `17 % 5` is 2 because 17 is three fives with 2 left over. It looks obscure now. It is used constantly: to test whether a number is even (`n % 2` is 0), to get the last digit (`n % 10`), and to wrap around the end of a list.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Order of operations is the same as in school',
        body: '`*`, `/` and `%` happen before `+` and `-`, so `a + b + c / 3` divides only c by 3. Use brackets whenever there is any doubt: `(a + b + c) / 3`. Brackets cost nothing and prevent a whole class of wrong answers.',
      },
    ],
    keyTakeaways: [
      { cpp: 'Whole number divided by whole number throws away the fraction. Use `3.0` or a `double` when you need decimals.', java: 'Whole number divided by whole number throws away the fraction. Use `3.0` or a `double` when you need decimals.', python: '`/` gives a decimal, `//` gives the whole-number part. Pick the one you mean.' },
      '`%` is the remainder: `n % 2` tests even/odd, `n % 10` is the last digit.',
      'Bracket anything with mixed operators.',
    ],
    practice: {
      prompt: 'Read a number of seconds and print it as minutes and seconds. For 125, print "2 minutes 5 seconds". You need one division for the minutes and one remainder for the seconds.',
    },
  },
  // -------------------------------------------------------------------------
  {
    sub: 5,
    summary: 'Make the program choose between two actions with if and else.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'So far every line has run, in order, every time. A **decision** lets the program skip lines. `if` asks a yes/no question; the lines that belong to it run only when the answer is yes. `else` gives the lines to run when the answer is no. This is the diamond from the flowchart lesson, written as code.',
      },
      {
        kind: 'code',
        caption: 'Even or odd',
        code: {
          cpp: `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    if (n % 2 == 0) {
        cout << n << " is even" << endl;
    } else {
        cout << n << " is odd" << endl;
    }
    return 0;
}`,
          java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        if (n % 2 == 0) {
            System.out.println(n + " is even");
        } else {
            System.out.println(n + " is odd");
        }
    }
}`,
          python: `n = int(input())
if n % 2 == 0:
    print(n, "is even")
else:
    print(n, "is odd")`,
        },
        output: '10 is even   (for 10)\n7 is odd     (for 7)',
      },
      {
        kind: 'text',
        body: 'The question is `n % 2 == 0`: is the remainder when n is divided by 2 equal to zero? Note the **double** equals. A single `=` stores; a double `==` compares. `n = 0` would put zero in the box. `n == 0` asks whether the box holds zero. Mixing them up is the most common bug in beginner conditions.',
      },
      {
        kind: 'table',
        headers: ['Question', 'Written as', 'Yes when'],
        rows: [
          ['equal', '`a == b`', 'a and b hold the same value'],
          ['not equal', '`a != b`', 'they differ'],
          ['less than', '`a < b`', 'a is smaller'],
          ['greater than', '`a > b`', 'a is bigger'],
          ['at most', '`a <= b`', 'a is smaller or the same'],
          ['at least', '`a >= b`', 'a is bigger or the same'],
        ],
      },
      { kind: 'heading', text: 'Which lines belong to the if?' },
      {
        kind: 'text',
        body: {
          cpp: 'The lines between `{` and `}` after the `if` belong to it. The braces are what matter to the compiler; the indentation is for you. An `if` without braces controls only the very next line, which trips people up, so always use braces even for one line.',
          java: 'The lines between `{` and `}` after the `if` belong to it. The braces are what matter to the compiler; the indentation is for you. An `if` without braces controls only the very next line, which trips people up, so always use braces even for one line.',
          python: 'The indented lines after the colon belong to the `if`. Indentation is not decoration in Python: it is the grammar. Every line in the block must be indented by the same amount, and the block ends at the first line that is indented less.',
        },
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'More than two choices',
        body: {
          cpp: 'Chain them: `if (marks >= 90) { ... } else if (marks >= 75) { ... } else { ... }`. The questions are asked top to bottom and the first yes wins; the rest are skipped. Put the most specific question first.',
          java: 'Chain them: `if (marks >= 90) { ... } else if (marks >= 75) { ... } else { ... }`. The questions are asked top to bottom and the first yes wins; the rest are skipped. Put the most specific question first.',
          python: 'Chain them with `elif`: `if marks >= 90: ... elif marks >= 75: ... else: ...`. The questions are asked top to bottom and the first yes wins; the rest are skipped. Put the most specific question first.',
        },
      },
    ],
    keyTakeaways: [
      '`if` runs its block only when the question is yes; `else` runs when it is no.',
      '`=` stores, `==` compares. Conditions use `==`.',
      { cpp: 'Braces decide what belongs to the if. Always use them.', java: 'Braces decide what belongs to the if. Always use them.', python: 'Indentation decides what belongs to the if. Keep it consistent.' },
    ],
    practice: {
      prompt: 'Read a temperature. Print "freezing" below 0, "cold" from 0 to 15, "warm" from 16 to 30, and "hot" above 30. Test with -5, 0, 15, 16, 30 and 31: boundary values are where these programs go wrong.',
    },
  },
  // -------------------------------------------------------------------------
  {
    sub: 6,
    summary: 'Repeat an action with a counting loop.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A **loop** runs the same lines again and again. The most common kind counts: it runs once for i = 1, once for i = 2, and so on up to some limit. This is the backwards arrow from the flowchart lesson. The program below prints the numbers from 1 to n, and it is four lines shorter than writing n print statements would be, for any n.',
      },
      {
        kind: 'code',
        caption: 'Count from 1 to n',
        code: {
          cpp: `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    for (int i = 1; i <= n; i++) {
        cout << i << endl;
    }
    return 0;
}`,
          java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 1; i <= n; i++) {
            System.out.println(i);
        }
    }
}`,
          python: `n = int(input())
for i in range(1, n + 1):
    print(i)`,
        },
        output: '1\n2\n3\n4\n5   (for 5)',
      },
      {
        kind: 'text',
        body: {
          cpp: 'The `for` line has three parts separated by semicolons. `int i = 1` runs once, at the start: create the counter. `i <= n` is checked before every run of the block: keep going? `i++` runs after every run of the block: add one to i. The block runs while the check says yes.',
          java: 'The `for` line has three parts separated by semicolons. `int i = 1` runs once, at the start: create the counter. `i <= n` is checked before every run of the block: keep going? `i++` runs after every run of the block: add one to i. The block runs while the check says yes.',
          python: '`range(1, n + 1)` produces the numbers from 1 up to but **not including** n + 1, so 1 to n. The loop takes them one at a time and stores each in `i` before running the indented block. The "not including" rule surprises everyone once; `range(1, n)` stops at n - 1.',
        },
      },
      { kind: 'heading', text: 'Doing work inside the loop' },
      {
        kind: 'text',
        body: 'Printing the counter is the least interesting thing a loop can do. Usually the loop builds something up in a variable that lives outside it. Here the loop adds each number to a running total.',
      },
      {
        kind: 'code',
        caption: 'Sum of 1 to n',
        code: {
          cpp: `int total = 0;
for (int i = 1; i <= n; i++) {
    total = total + i;
}
cout << total << endl;`,
          java: `int total = 0;
for (int i = 1; i <= n; i++) {
    total = total + i;
}
System.out.println(total);`,
          python: `total = 0
for i in range(1, n + 1):
    total = total + i
print(total)`,
        },
        output: '15   (for 5)',
      },
      {
        kind: 'text',
        body: '`total` is created **before** the loop, so it survives between runs of the block. If it were created inside, it would start from 0 every time. The print is **after** the loop, so it happens once with the final value. Put it inside and you print a running total on every step, which is sometimes what you want and usually not.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Off by one',
        body: {
          cpp: '`i < n` runs the block n - 1 times. `i <= n` runs it n times. Starting at `i = 0` with `i < n` also runs n times, and that is the form you will use for lists, whose positions start at 0. Trace with n = 2 whenever you are not sure.',
          java: '`i < n` runs the block n - 1 times. `i <= n` runs it n times. Starting at `i = 0` with `i < n` also runs n times, and that is the form you will use for lists, whose positions start at 0. Trace with n = 2 whenever you are not sure.',
          python: '`range(n)` gives 0 to n - 1: n numbers, starting at 0, which is the form you will use for lists. `range(1, n + 1)` gives 1 to n. Trace with n = 2 whenever you are not sure.',
        },
      },
    ],
    keyTakeaways: [
      'A counting loop runs a block once per value of a counter.',
      'Variables that accumulate across runs are created before the loop; the final print goes after it.',
      'Check the loop bounds by tracing n = 2 on paper.',
    ],
    practice: {
      prompt: 'Print the multiplication table of a number read from input, from 1 times to 10 times, one line each in the form "7 x 3 = 21". Then change it to print the table backwards, from 10 down to 1.',
    },
  },
  // -------------------------------------------------------------------------
  {
    sub: 7,
    summary: 'Combine a loop and a decision to count or sum only some of the values.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'A loop visits every value; an `if` inside the loop decides which of them to act on. This combination, loop plus filter, is behind an enormous number of programs: count the even numbers, sum the positive ones, find how many marks are above 40. The program below sums the even numbers from 1 to n.',
      },
      {
        kind: 'code',
        caption: 'Sum of even numbers up to n',
        code: {
          cpp: `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int total = 0;
    for (int i = 1; i <= n; i++) {
        if (i % 2 == 0) {
            total = total + i;
        }
    }
    cout << total << endl;
    return 0;
}`,
          java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int total = 0;
        for (int i = 1; i <= n; i++) {
            if (i % 2 == 0) {
                total = total + i;
            }
        }
        System.out.println(total);
    }
}`,
          python: `n = int(input())
total = 0
for i in range(1, n + 1):
    if i % 2 == 0:
        total = total + i
print(total)`,
        },
        output: '12   (for 7: 2 + 4 + 6)',
      },
      {
        kind: 'text',
        body: 'Read the nesting from the outside in. The loop runs for i = 1, 2, 3, ... The `if` is inside the loop, so it is asked once per value. The addition is inside the `if`, so it happens only for values where the answer is yes. Three levels; each level is indented one step further.',
      },
      {
        kind: 'table',
        headers: ['i', 'i % 2 == 0 ?', 'total after'],
        rows: [
          ['1', 'no', '0'],
          ['2', 'yes', '2'],
          ['3', 'no', '2'],
          ['4', 'yes', '6'],
          ['5', 'no', '6'],
          ['6', 'yes', '12'],
          ['7', 'no', '12'],
        ],
      },
      { kind: 'heading', text: 'Counting instead of summing' },
      {
        kind: 'text',
        body: 'To count how many values pass the test instead of adding them up, change one line: `count = count + 1` instead of `total = total + i`. Same loop, same if. Counting and summing are the two things you will do inside loops most often, and both are the same shape.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Two loops in one? Not needed',
        body: 'Beginners sometimes write one loop to find the evens and another to add them. One loop with an `if` inside does both in a single pass. Whenever you find yourself writing two loops over the same values, ask whether one loop with a decision would do.',
      },
    ],
    keyTakeaways: [
      'A decision inside a loop is asked once per value; the action inside the decision happens only on yes.',
      'Summing and counting inside a loop are the same shape with one line different.',
      'One loop with an if usually beats two loops.',
    ],
    practice: {
      prompt: 'Read n and print how many numbers from 1 to n are divisible by 3 or by 5. For n = 15 the answer is 7. Then print the sum of those numbers instead.',
    },
  },
  // -------------------------------------------------------------------------
  {
    sub: 8,
    summary: 'Read many values inside a loop and keep track of the best one seen so far.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Until now the loop counted and the values came from the counter. Here the values come from the user: the program reads how many numbers are coming, then reads that many, and prints the largest. It is the "largest number" algorithm from the earlier lesson, made real. The trick is a variable that remembers the best value seen so far.',
      },
      {
        kind: 'code',
        caption: 'Largest of n numbers',
        code: {
          cpp: `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int biggest;
    cin >> biggest;                 // the first number is the best so far
    for (int i = 2; i <= n; i++) {
        int x;
        cin >> x;
        if (x > biggest) {
            biggest = x;
        }
    }
    cout << "Largest: " << biggest << endl;
    return 0;
}`,
          java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int biggest = sc.nextInt();      // the first number is the best so far
        for (int i = 2; i <= n; i++) {
            int x = sc.nextInt();
            if (x > biggest) {
                biggest = x;
            }
        }
        System.out.println("Largest: " + biggest);
    }
}`,
          python: `n = int(input())
biggest = int(input())        # the first number is the best so far
for i in range(2, n + 1):
    x = int(input())
    if x > biggest:
        biggest = x
print("Largest:", biggest)`,
        },
        output: 'Largest: 9   (for 4 numbers: 4 9 2 7)',
      },
      {
        kind: 'text',
        body: 'The first number is read before the loop and becomes the starting `biggest`. The loop then reads the remaining n - 1 numbers, which is why the counter starts at 2. Each new number is compared to the best so far and replaces it only if it is larger. When the loop ends, `biggest` holds the largest of all of them.',
      },
      { kind: 'heading', text: 'Why not start biggest at 0?' },
      {
        kind: 'text',
        body: 'Because the numbers might all be negative. If the input is -3, -8, -1, a `biggest` that started at 0 would stay 0 and the program would print a number that was never in the list. Starting from the first real value cannot go wrong. When you cannot read a first value, start from the smallest number the type can hold, which the language chapters will show you.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The same shape finds the smallest, the longest, the closest',
        body: 'Swap `>` for `<` and it finds the smallest. Compare lengths and it finds the longest word. Compare distances and it finds the closest point. "Best so far, replaced when beaten" is one of the most reused ideas in the whole track.',
      },
    ],
    keyTakeaways: [
      'Keep a best-so-far variable, start it from the first real value, and replace it whenever a value beats it.',
      'Starting the best-so-far at 0 is wrong when values can be negative.',
      'Change the comparison and the same loop finds the smallest, longest or closest.',
    ],
    practice: {
      prompt: 'Read n and then n numbers. Print both the largest and the smallest. Then also print the position (1 for the first number read) at which the largest appeared.',
    },
  },
  // -------------------------------------------------------------------------
  {
    sub: 9,
    summary: 'Turn a problem written in words into a program, one step at a time.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'You now know enough to solve real problems, and the hard part is no longer the syntax. It is going from a paragraph of English to a program. This lesson walks through that once, slowly, with the questions to ask at each stage. The problem: **a shop gives 10% off any bill over 500. Read a bill amount and print what the customer pays.**',
      },
      { kind: 'heading', text: 'Step 1: input, process, output' },
      {
        kind: 'table',
        headers: ['Question', 'Answer for this problem'],
        rows: [
          ['What is the input?', 'One number: the bill'],
          ['What is the output?', 'One number: what is paid'],
          ['What is the process?', 'If bill > 500, take 10% off; otherwise leave it'],
        ],
      },
      { kind: 'heading', text: 'Step 2: pseudocode' },
      {
        kind: 'code',
        caption: 'Plain steps before real code',
        code: {
          cpp: `read bill
if bill is greater than 500:
    set paid to bill minus 10% of bill
otherwise:
    set paid to bill
print paid`,
          java: `read bill
if bill is greater than 500:
    set paid to bill minus 10% of bill
otherwise:
    set paid to bill
print paid`,
          python: `read bill
if bill is greater than 500:
    set paid to bill minus 10% of bill
otherwise:
    set paid to bill
print paid`,
        },
      },
      { kind: 'heading', text: 'Step 3: translate line by line' },
      {
        kind: 'code',
        caption: 'Each pseudocode line becomes one or two real lines',
        code: {
          cpp: `#include <iostream>
using namespace std;

int main() {
    double bill;
    cin >> bill;
    double paid;
    if (bill > 500) {
        paid = bill - bill * 0.10;
    } else {
        paid = bill;
    }
    cout << paid << endl;
    return 0;
}`,
          java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double bill = sc.nextDouble();
        double paid;
        if (bill > 500) {
            paid = bill - bill * 0.10;
        } else {
            paid = bill;
        }
        System.out.println(paid);
    }
}`,
          python: `bill = float(input())
if bill > 500:
    paid = bill - bill * 0.10
else:
    paid = bill
print(paid)`,
        },
        output: '540   (for 600)\n400   (for 400)',
      },
      { kind: 'heading', text: 'Step 4: test the edges' },
      {
        kind: 'text',
        body: 'Try 600 (discount), 400 (no discount), and then the values the sentence is vague about: exactly 500, and 0. "Over 500" means 500 itself gets no discount, so the condition is `>` and not `>=`. If the problem said "500 or more" it would be `>=`. Reading the words that carefully is not pedantry; on LeetCode it is the difference between accepted and wrong answer.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'When you cannot write the pseudocode, you do not understand the problem yet',
        body: 'That is useful information. Go back to the words, pick a concrete example, and work out the answer by hand. The steps you took by hand are the pseudocode.',
      },
    ],
    keyTakeaways: [
      'Words to program: identify input/process/output, write pseudocode, translate line by line, test the edges.',
      'Words like "over", "at least", "between" decide `>` versus `>=`. Read them twice.',
      'If you cannot write the steps in English, solve one example by hand first.',
    ],
    practice: {
      prompt: 'Follow all four steps for this problem: "A student passes if their average over three subjects is at least 40 and no single subject is below 30. Read three marks and print PASS or FAIL." Test with 50 50 50, 40 40 40, 90 90 20 and 39 40 41.',
    },
  },
  // -------------------------------------------------------------------------
  {
    sub: 10,
    summary: 'Ten short programs that use everything so far; write all of them before moving on.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Reading about programming does not teach programming. Writing does. Below are ten small programs, in rough order of difficulty, each using only input, variables, arithmetic, `if` and counting loops. Write every one, run it, and compare with the expected output. Do not skip the easy ones: speed at the easy ones is what makes the hard ones possible.',
      },
      {
        kind: 'table',
        headers: ['#', 'Program', 'Example input', 'Expected output'],
        rows: [
          ['1', 'Read two numbers, print their sum, difference and product on three lines', '7 3', '10, 4, 21'],
          ['2', 'Read a number, print whether it is positive, negative or zero', '-4', 'negative'],
          ['3', 'Read a year, print whether it is a leap year (divisible by 4, except centuries unless divisible by 400)', '1900', 'not leap'],
          ['4', 'Read n, print the sum of the squares 1² + 2² + ... + n²', '3', '14'],
          ['5', 'Read n, print n! (1 × 2 × ... × n)', '5', '120'],
          ['6', 'Read n, print the sum of its digits', '4721', '14'],
          ['7', 'Read n, print n reversed', '4721', '1274'],
          ['8', 'Read n, print whether it is prime (no divisor from 2 to n-1)', '29', 'prime'],
          ['9', 'Read n then n numbers, print how many are above their average', '4 then 1 2 3 10', '1'],
          ['10', 'Read n, print the first n Fibonacci numbers (each is the sum of the previous two, starting 0 1)', '7', '0 1 1 2 3 5 8'],
        ],
      },
      { kind: 'heading', text: 'Hints, only if you are stuck' },
      {
        kind: 'text',
        body: 'For 6 and 7: `n % 10` is the last digit and `n / 10` (whole-number division) removes it. Loop while n is not zero. For 8: loop i from 2 while i is less than n and set a flag variable to false the moment `n % i == 0`; a number is prime if the flag is still true afterwards. For 9: you must read all the numbers before you know the average, so store them; a first attempt can read them twice. For 10: keep two variables, `a` and `b`, and each step set `a` to `b` and `b` to the old `a` plus `b`. That last one needs a temporary box, exactly like the swap exercise.',
      },
      {
        kind: 'code',
        caption: 'The digit-stripping loop from hints 6 and 7, since it appears everywhere',
        code: {
          cpp: `int sum = 0;
while (n != 0) {
    sum = sum + n % 10;   // add the last digit
    n = n / 10;           // drop the last digit
}`,
          java: `int sum = 0;
while (n != 0) {
    sum = sum + n % 10;   // add the last digit
    n = n / 10;           // drop the last digit
}`,
          python: `total = 0
while n != 0:
    total = total + n % 10   # add the last digit
    n = n // 10              # drop the last digit`,
        },
      },
      {
        kind: 'text',
        body: 'This is a `while` loop: it has no counter, and repeats as long as the question is yes. It is the right loop when you do not know in advance how many times to go round. Trace it with n = 4721 and watch the digits fall off one at a time.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Stuck for more than twenty minutes on one of these?',
        body: 'Write the pseudocode for it in plain English, trace that by hand on the example input, and only then go back to code. If the pseudocode itself will not come, re-read the lesson that the program depends on. Nothing later in the track is easier than these ten, so it is worth getting them solid now.',
      },
    ],
    keyTakeaways: [
      'Write all ten. Fluency with small programs is what makes larger ones possible.',
      '`n % 10` and `n / 10` peel digits off a number one at a time.',
      'A `while` loop repeats as long as a question stays yes; use it when the number of repeats is not known in advance.',
    ],
    practice: {
      prompt: 'Complete all ten programs. Then, for programs 6, 7 and 8, write down the trace table for the example input before running, and check your table against the real output.',
    },
  },
];
