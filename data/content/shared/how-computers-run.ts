import type { SharedLesson } from './types';

/**
 * How Computers Run Programs — the chapter before any syntax.
 * The reader has never written code. Every idea is shown as pseudocode first,
 * and the only real code is the same tiny program in the reader's language,
 * so the shape of a program is familiar before the rules of one are taught.
 */
export const lessons: SharedLesson[] = [
  // -------------------------------------------------------------------------
  {
    sub: 1,
    summary: 'Explain what a program is and why a computer needs every step spelled out.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'A **program** is a list of instructions for a computer, written in an order, that the computer follows one at a time. That is the whole idea. Everything you will learn in this track is a way of writing those instructions more clearly, more quickly, or so that they run faster.',
      },
      {
        kind: 'text',
        body: 'The difficult part for beginners is not the writing. It is realising how little a computer assumes. A friend told to "make tea" fills the kettle without being asked. A computer told to "make tea" does nothing, because "make tea" is not an instruction it knows. You have to write: fill kettle, switch on kettle, wait until it boils, put tea in cup, pour water. Skip a step and the step is skipped. Swap two steps and they happen swapped.',
      },
      { kind: 'heading', text: 'Your first program, as plain steps' },
      {
        kind: 'text',
        body: 'Here is a program that decides whether a number is big. Read it as a list a very literal-minded person will follow exactly.',
      },
      {
        kind: 'code',
        caption: 'Pseudocode: not a real language, only numbered steps',
        code: {
          cpp: `1. Take a number from the person and call it n.
2. If n is greater than 100, print "big".
3. Otherwise, print "small".`,
          java: `1. Take a number from the person and call it n.
2. If n is greater than 100, print "big".
3. Otherwise, print "small".`,
          python: `1. Take a number from the person and call it n.
2. If n is greater than 100, print "big".
3. Otherwise, print "small".`,
        },
      },
      {
        kind: 'text',
        body: 'Notice what the program does *not* say. It does not say what "big" means in general; it says exactly "greater than 100". It does not say "tell the person the answer"; it says "print". Programs are precise because computers cannot fill in gaps.',
      },
      {
        kind: 'text',
        body: 'The same three steps in a real language look like this. You are not expected to understand the symbols yet; only to see that it is still three steps in order.',
      },
      {
        kind: 'code',
        caption: 'The same program, in the language you will learn',
        code: {
          cpp: `int n;
cin >> n;
if (n > 100) cout << "big";
else cout << "small";`,
          java: `int n = sc.nextInt();
if (n > 100) System.out.println("big");
else System.out.println("small");`,
          python: `n = int(input())
if n > 100:
    print("big")
else:
    print("small")`,
        },
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'The computer is not clever, and that is good news',
        body: 'Because the computer only does what is written, every bug is in the text you wrote. You never have to guess what the machine "was thinking". You only have to read your own steps slowly enough.',
      },
    ],
    keyTakeaways: [
      'A program is an ordered list of instructions the computer follows exactly.',
      'Nothing is assumed: a missing step is a missing action, a swapped step is a swapped action.',
      'Every bug lives in the text you wrote, which is why reading your own program carefully works.',
    ],
    practice: {
      prompt: 'Write, in numbered plain-English steps, a program that takes two numbers and prints the larger one. Then check: does your list handle the case where both numbers are the same? If not, add the step.',
    },
  },
  // -------------------------------------------------------------------------
  {
    sub: 2,
    summary: 'Know the difference between the text you write and what the machine actually runs.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'The text you type is called **source code**. A computer’s processor cannot read it. The processor only understands **machine code**: long strings of numbers that mean "add these", "copy that", "jump to there". Something has to turn your text into those numbers, and there are two ways to do it.',
      },
      { kind: 'heading', text: 'Compilers and interpreters' },
      {
        kind: 'text',
        body: 'A **compiler** reads your whole source file first, translates all of it into machine code, and saves the result as a separate runnable file. You then run that file. If there is a mistake anywhere in the text, the compiler refuses to produce the file and tells you where the mistake is. Nothing runs until everything is correct.',
      },
      {
        kind: 'text',
        body: 'An **interpreter** reads your source one instruction at a time and carries each one out immediately. There is no separate file. A mistake on line 30 is only discovered when the interpreter reaches line 30, so the first 29 lines have already run.',
      },
      {
        kind: 'table',
        headers: ['', 'Compiler', 'Interpreter'],
        rows: [
          ['When errors appear', 'Before anything runs', 'When that line is reached'],
          ['Speed of the running program', 'Fast: already machine code', 'Slower: translated as it goes'],
          ['Extra step for you', 'Compile, then run', 'Run'],
          ['Languages', 'C++, Java (to bytecode)', 'Python'],
        ],
      },
      {
        kind: 'text',
        body: {
          cpp: 'C++ is compiled. You will write a file, run the compiler `g++` on it, and get a program file you can run as many times as you like. The compiler is strict, and that strictness is your friend: a typo cannot reach the running program.',
          java: 'Java is compiled, but in two stages. The compiler `javac` turns your file into **bytecode**, a machine code for an imaginary machine. The Java Virtual Machine (JVM) then runs that bytecode on your real computer. You still get the compiler’s error checking before anything runs.',
          python: 'Python is interpreted. You write a file and run it with the `python` command, and each line is carried out as it is reached. This makes experimenting quick, but it also means a typo on a line that is rarely reached can hide for a long time.',
        },
      },
      { kind: 'heading', text: 'Why this matters on LeetCode' },
      {
        kind: 'text',
        body: 'When you press Run on LeetCode, the site does exactly this behind the scenes: it feeds your source to a compiler or interpreter, then runs the result against test inputs. Two of the verdicts you will see come straight from this lesson. **Compile Error** means the translation step refused your text. **Runtime Error** means the translation worked but the running program hit something impossible, like dividing by zero.',
      },
      {
        kind: 'code',
        caption: 'The command you will type to turn source into a running program',
        code: {
          cpp: `g++ hello.cpp -o hello    # compile: makes a file called hello
./hello                   # run it`,
          java: `javac Hello.java    # compile: makes Hello.class (bytecode)
java Hello          # run it on the JVM`,
          python: `python hello.py    # no compile step: the interpreter runs the file`,
        },
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'A program that compiles is not a program that is correct',
        body: 'The compiler checks that your text follows the rules of the language. It has no idea what you meant. A program that adds when you meant to subtract compiles perfectly and is completely wrong.',
      },
    ],
    keyTakeaways: [
      'Source code is the text you write; machine code is what the processor runs.',
      'A compiler translates the whole file before anything runs; an interpreter runs line by line.',
      'Compile Error and Runtime Error on LeetCode are the two halves of this process failing.',
    ],
    practice: {
      prompt: 'Without running anything, write down what you expect to happen in each case: a compiled program with a typo on the last line, and an interpreted program with a typo on the last line. Then say which one prints anything before stopping.',
    },
  },
  // -------------------------------------------------------------------------
  {
    sub: 3,
    summary: 'Picture memory as labelled boxes so that variables stop being mysterious.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A computer’s **memory** is a very long row of tiny boxes. Each box holds one small number and has an address, like a house on a street. A running program spends its life putting numbers into boxes and reading them back out.',
      },
      {
        kind: 'text',
        body: 'Addresses are awkward to work with, so programming languages let you put a **label** on a box and refer to it by that label. A labelled box is a **variable**. When you write `count = 5`, you are saying: find the box labelled `count` and put 5 in it. When you later write `count + 1`, you are saying: read what is in the `count` box and add one to it.',
      },
      { kind: 'heading', text: 'Three things every variable has' },
      {
        kind: 'table',
        headers: ['Part', 'Meaning', 'Example'],
        rows: [
          ['Name', 'The label on the box', '`total`'],
          ['Value', 'What is inside right now', '`42`'],
          ['Type', 'What kind of thing the box holds', 'a whole number, some text, true/false'],
        ],
      },
      {
        kind: 'text',
        body: {
          cpp: 'C++ makes you state the type when you create the box, and the box only ever holds that type. `int total = 42;` creates a box for whole numbers (an *integer*, hence `int`) labelled `total`, containing 42. Trying to put text into it is a compile error.',
          java: 'Java makes you state the type when you create the box, and the box only ever holds that type. `int total = 42;` creates a box for whole numbers (an *integer*, hence `int`) labelled `total`, containing 42. Trying to put text into it is a compile error.',
          python: 'Python does not make you state the type. `total = 42` creates the box and puts a whole number in it; the type is whatever you put in. This is convenient, but it means Python will happily let you put text into `total` later, and only complain when you try to do arithmetic on it.',
        },
      },
      {
        kind: 'code',
        caption: 'Putting a value in a box, changing it, and reading it',
        code: {
          cpp: `int total = 42;   // create the box, put 42 in it
total = total + 8; // read 42, add 8, put 50 back in the same box
cout << total;     // read the box and print it`,
          java: `int total = 42;    // create the box, put 42 in it
total = total + 8;  // read 42, add 8, put 50 back in the same box
System.out.println(total);`,
          python: `total = 42        # create the box, put 42 in it
total = total + 8 # read 42, add 8, put 50 back in the same box
print(total)`,
        },
        output: '50',
      },
      {
        kind: 'text',
        body: 'The line `total = total + 8` confuses almost every beginner, because in mathematics it is nonsense: nothing equals itself plus eight. In programming, `=` does not mean "is equal to". It means **store**: work out the right-hand side first, then put the result into the box named on the left. Read it as "total becomes total plus eight".',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'A box holds one value. Storing a new one throws the old one away.',
        body: 'After `total = 50`, the 42 is gone. There is no history. If you need both the old and the new value, you need two boxes.',
      },
    ],
    keyTakeaways: [
      'A variable is a labelled box in memory that holds one value at a time.',
      '`=` means store, not "equals": evaluate the right side, then put it in the box on the left.',
      'Storing a new value replaces the old one completely.',
    ],
    practice: {
      prompt: 'Draw three boxes labelled a, b and c. Follow these steps by hand and write what each box holds at the end: a = 3; b = 4; c = a + b; a = c; b = a - 1.',
    },
  },
  // -------------------------------------------------------------------------
  {
    sub: 4,
    summary: 'Recognise the input, process, output shape that every program you will write follows.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'Strip away the details and every program does three things. It takes some **input**, it **processes** it, and it produces some **output**. A calculator app takes two numbers and a button press, does arithmetic, and shows a result. A LeetCode solution takes the test case, computes an answer, and returns it. Seeing this shape turns "I do not know where to start" into three smaller questions.',
      },
      {
        kind: 'table',
        headers: ['Question', 'What you are deciding', 'Example: average of three marks'],
        rows: [
          ['What is the input?', 'What the program is given, and in what form', 'Three whole numbers'],
          ['What is the process?', 'The steps that turn input into answer', 'Add them, divide by 3'],
          ['What is the output?', 'What must be printed or returned, and how', 'One number, possibly with decimals'],
        ],
      },
      { kind: 'heading', text: 'The three parts in code' },
      {
        kind: 'code',
        caption: 'Input, then process, then output. Most programs keep this order.',
        code: {
          cpp: `int a, b, c;
cin >> a >> b >> c;           // input
double avg = (a + b + c) / 3.0; // process
cout << avg;                  // output`,
          java: `int a = sc.nextInt(), b = sc.nextInt(), c = sc.nextInt(); // input
double avg = (a + b + c) / 3.0;                            // process
System.out.println(avg);                                   // output`,
          python: `a, b, c = map(int, input().split())  # input
avg = (a + b + c) / 3                # process
print(avg)                           # output`,
        },
      },
      {
        kind: 'text',
        body: 'On LeetCode the shape is the same, but the site handles the input and output for you. It calls a function you write, hands the input in as the function’s parameters, and takes your output from the function’s return value. You only write the process. That is why LeetCode solutions look shorter than complete programs: two of the three parts are already done.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Stuck? Write the output line first',
        body: 'If you do not know how to begin a program, write the line that prints the answer, using a variable that does not exist yet. Now you have a concrete goal: make that variable hold the right value. Work backwards from there.',
      },
    ],
    keyTakeaways: [
      'Every program is input, process, output. Identify all three before writing any code.',
      'On LeetCode, input and output are done for you: the function parameters are the input and the return value is the output.',
      'When stuck, decide what the output line looks like and work backwards.',
    ],
    practice: {
      prompt: 'For each of these, write one line each for input, process and output, in plain English: (1) convert a temperature from Celsius to Fahrenheit, (2) count how many of five numbers are negative, (3) print a name in capital letters.',
    },
  },
  // -------------------------------------------------------------------------
  {
    sub: 5,
    summary: 'Define an algorithm and see why the order and precision of steps decide whether it works.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'An **algorithm** is a precise, finite list of steps that solves a problem. "Precise" means each step is unambiguous. "Finite" means it eventually stops. A recipe is the usual comparison and it is a good one, as long as the recipe is written for someone who has never cooked.',
      },
      {
        kind: 'text',
        body: 'Consider "find the largest number in a list". A person glances at the list and points. A computer cannot glance. It needs steps it can follow one number at a time.',
      },
      {
        kind: 'code',
        caption: 'An algorithm for the largest number, as steps',
        code: {
          cpp: `1. Let biggest be the first number in the list.
2. For each remaining number, one at a time:
     if this number is greater than biggest, let biggest be this number.
3. When there are no numbers left, biggest is the answer.`,
          java: `1. Let biggest be the first number in the list.
2. For each remaining number, one at a time:
     if this number is greater than biggest, let biggest be this number.
3. When there are no numbers left, biggest is the answer.`,
          python: `1. Let biggest be the first number in the list.
2. For each remaining number, one at a time:
     if this number is greater than biggest, let biggest be this number.
3. When there are no numbers left, biggest is the answer.`,
        },
      },
      {
        kind: 'text',
        body: 'Test it by hand on the list 4, 9, 2, 7. Biggest starts at 4. Compare 9: greater, so biggest becomes 9. Compare 2: not greater, no change. Compare 7: not greater, no change. Answer 9. Correct. Checking an algorithm on a small example like this is something you will do for the rest of the track.',
      },
      { kind: 'heading', text: 'Why order and precision matter' },
      {
        kind: 'text',
        body: 'Swap steps 1 and 2 and the algorithm compares numbers to a `biggest` that does not exist yet. Replace "greater than" with "greater than or equal to" and it still works, but does slightly more work. Replace step 1 with "let biggest be 0" and it fails on a list of negative numbers, which is a real bug that real students submit.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'The same problem has many algorithms, and they are not equally good',
        body: 'Another algorithm for the largest number: sort the whole list, then take the last one. It is correct. It is also far more work than one pass through the list. Choosing the algorithm that does the least work is most of what Phase 1 will teach you.',
      },
    ],
    keyTakeaways: [
      'An algorithm is a precise, finite list of steps that solves a problem.',
      'Check an algorithm by following it by hand on a tiny example.',
      'Different algorithms solve the same problem with very different amounts of work.',
    ],
    practice: {
      prompt: 'Write an algorithm, as numbered steps, that counts how many times the number 7 appears in a list. Test it by hand on the list 7, 1, 7, 7, 2. Then find the bug in this alternative: "1. Let count be 1. 2. For each number, if it is 7, add one to count."',
    },
  },
  // -------------------------------------------------------------------------
  {
    sub: 6,
    summary: 'Write pseudocode so you can design a solution before fighting with syntax.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: '**Pseudocode** is a program written in plain language with a little structure, for a human reader. It is not run by any computer. Its purpose is to let you think about the steps without also thinking about semicolons, brackets and spelling. Beginners who skip pseudocode try to solve the problem and learn the language in the same moment, and get both wrong.',
      },
      {
        kind: 'text',
        body: 'There are no official rules. The conventions below are enough, and they match the way real code is shaped, so translating later is easy.',
      },
      {
        kind: 'table',
        headers: ['Idea', 'Pseudocode', 'Meaning'],
        rows: [
          ['Store a value', '`set total to 0`', 'Put 0 in the box called total'],
          ['Decision', '`if n is even then ... otherwise ...`', 'Do one of two things'],
          ['Repeat a fixed number of times', '`for i from 1 to n: ...`', 'Do the indented steps n times'],
          ['Repeat while something holds', '`while n is not 0: ...`', 'Keep going until the condition fails'],
          ['Show a result', '`print total`', 'Output'],
        ],
      },
      { kind: 'heading', text: 'An example, then its translation' },
      {
        kind: 'code',
        caption: 'Pseudocode: sum of the numbers from 1 to n',
        code: {
          cpp: `read n
set total to 0
for i from 1 to n:
    set total to total + i
print total`,
          java: `read n
set total to 0
for i from 1 to n:
    set total to total + i
print total`,
          python: `read n
set total to 0
for i from 1 to n:
    set total to total + i
print total`,
        },
      },
      {
        kind: 'code',
        caption: 'The same thing in real code. Line for line, it matches.',
        code: {
          cpp: `int n;
cin >> n;
int total = 0;
for (int i = 1; i <= n; i++) {
    total = total + i;
}
cout << total;`,
          java: `int n = sc.nextInt();
int total = 0;
for (int i = 1; i <= n; i++) {
    total = total + i;
}
System.out.println(total);`,
          python: `n = int(input())
total = 0
for i in range(1, n + 1):
    total = total + i
print(total)`,
        },
      },
      {
        kind: 'text',
        body: 'Indentation shows which steps belong inside the loop. In the pseudocode, only `set total to total + i` is indented, so only that line repeats; `print total` happens once, after the loop ends. Get this wrong and you print n times instead of once.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Pseudocode in comments',
        body: 'When a LeetCode problem feels hard, write the pseudocode as comments inside the empty function first. Then replace each comment with the real line beneath it. The comments become documentation for free.',
      },
    ],
    keyTakeaways: [
      'Pseudocode is structured plain language for designing steps without syntax.',
      'Use set, if/otherwise, for, while and print. Indent the steps that repeat or depend on a condition.',
      'Translate pseudocode line by line; the shape of the real code matches it.',
    ],
    practice: {
      prompt: 'Write pseudocode that reads n and prints every even number from 2 up to n. Then write pseudocode that reads ten numbers and prints how many of them are greater than 50.',
    },
  },
  // -------------------------------------------------------------------------
  {
    sub: 7,
    summary: 'Draw the flow of a program so decisions and loops become visible shapes.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'A **flowchart** is a drawing of a program’s steps with arrows showing where control goes next. Some people never need them. Beginners usually do, because the two ideas that give the most trouble, decisions and loops, are exactly the two that are hard to see in a list of steps and easy to see in a drawing.',
      },
      {
        kind: 'table',
        headers: ['Shape', 'Used for', 'Arrows out'],
        rows: [
          ['Rounded box', 'Start and End', 'One (Start), none (End)'],
          ['Rectangle', 'An action: store, compute, print', 'One'],
          ['Diamond', 'A question with a yes/no answer', 'Two, labelled yes and no'],
          ['Parallelogram', 'Input or output', 'One'],
        ],
      },
      { kind: 'heading', text: 'A decision is a diamond with two exits' },
      {
        kind: 'code',
        caption: 'Flowchart for "print big or small", drawn in text',
        code: {
          cpp: `   (Start)
      |
 [read n]
      |
 < n > 100 ? >
   yes /   \\ no
[print big] [print small]
       \\   /
       (End)`,
          java: `   (Start)
      |
 [read n]
      |
 < n > 100 ? >
   yes /   \\ no
[print big] [print small]
       \\   /
       (End)`,
          python: `   (Start)
      |
 [read n]
      |
 < n > 100 ? >
   yes /   \\ no
[print big] [print small]
       \\   /
       (End)`,
        },
      },
      {
        kind: 'text',
        body: 'Both branches rejoin before End. That is the picture of `if ... else`: exactly one of the two paths is taken, and afterwards the program continues from the same place either way.',
      },
      { kind: 'heading', text: 'A loop is an arrow that goes backwards' },
      {
        kind: 'code',
        caption: 'Flowchart for "count from 1 to n"',
        code: {
          cpp: `   (Start)
      |
 [read n]  [set i to 1]
      |
 < i <= n ? > --no--> (End)
      | yes
 [print i]
      |
 [set i to i + 1]
      |
      +----- back up to the question`,
          java: `   (Start)
      |
 [read n]  [set i to 1]
      |
 < i <= n ? > --no--> (End)
      | yes
 [print i]
      |
 [set i to i + 1]
      |
      +----- back up to the question`,
          python: `   (Start)
      |
 [read n]  [set i to 1]
      |
 < i <= n ? > --no--> (End)
      | yes
 [print i]
      |
 [set i to i + 1]
      |
      +----- back up to the question`,
        },
      },
      {
        kind: 'text',
        body: 'The backwards arrow is what makes it a loop. Follow it with your finger for n = 2: question (1 <= 2, yes), print 1, i becomes 2, question (2 <= 2, yes), print 2, i becomes 3, question (3 <= 2, no), End. Two numbers printed. If the step `set i to i + 1` were missing, i would stay 1 forever and the arrow would go round forever. That is an **infinite loop**, and it is the most common beginner loop bug.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Every loop needs three things',
        body: 'A starting value (`set i to 1`), a question that can eventually be answered no (`i <= n ?`), and a step that moves towards no (`i + 1`). When a loop misbehaves, check which of the three is missing or wrong.',
      },
    ],
    keyTakeaways: [
      'A diamond is a decision with a yes exit and a no exit that rejoin later.',
      'A loop is an arrow going back to an earlier question.',
      'Every loop needs a start value, a question that can become no, and a step that moves towards no.',
    ],
    practice: {
      prompt: 'Draw a flowchart, on paper, for: read n; if n is negative print "negative"; otherwise print every number from n down to 1. Check it by tracing n = 3 and n = -1 with your finger.',
    },
  },
  // -------------------------------------------------------------------------
  {
    sub: 8,
    summary: 'Trace a program by hand with a trace table, the debugging tool you will use for the rest of the track.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A **trace table** is a table with one column per variable and one row per step. You walk through the program line by line and, whenever a variable changes, you write its new value in the next row. It is slow, boring, and the single most reliable way to find out what a program actually does, as opposed to what you believe it does.',
      },
      {
        kind: 'text',
        body: 'Professionals use it too, in their heads or on paper, whenever a program surprises them. Learn it now with tiny programs and it will be automatic when the programs are large.',
      },
      { kind: 'heading', text: 'Tracing a loop' },
      {
        kind: 'code',
        caption: 'The program to trace, with n = 4',
        code: {
          cpp: `int n = 4;
int total = 0;
int i = 1;
while (i <= n) {
    total = total + i;
    i = i + 1;
}
cout << total;`,
          java: `int n = 4;
int total = 0;
int i = 1;
while (i <= n) {
    total = total + i;
    i = i + 1;
}
System.out.println(total);`,
          python: `n = 4
total = 0
i = 1
while i <= n:
    total = total + i
    i = i + 1
print(total)`,
        },
        output: '10',
      },
      {
        kind: 'table',
        headers: ['Step', 'i <= n ?', 'total', 'i'],
        rows: [
          ['start', '', '0', '1'],
          ['loop 1', '1 <= 4 yes', '0 + 1 = 1', '2'],
          ['loop 2', '2 <= 4 yes', '1 + 2 = 3', '3'],
          ['loop 3', '3 <= 4 yes', '3 + 3 = 6', '4'],
          ['loop 4', '4 <= 4 yes', '6 + 4 = 10', '5'],
          ['check', '5 <= 4 no', '10', '5'],
          ['print', '', 'prints 10', ''],
        ],
      },
      {
        kind: 'text',
        body: 'Two things the table makes obvious that reading the code does not. First, the loop body runs four times, not five, even though `i` reaches 5: the question is asked a fifth time and answered no. Second, the final value of `i` is one more than `n`. Both facts are the source of endless off-by-one bugs, and the table shows them without any thinking.',
      },
      { kind: 'heading', text: 'Tracing to find a bug' },
      {
        kind: 'text',
        body: 'Suppose the two lines inside the loop were swapped: `i = i + 1` first, then `total = total + i`. Trace it. Loop 1: i becomes 2, total becomes 0 + 2 = 2. Loop 2: i becomes 3, total 5. Loop 3: i becomes 4, total 9. Loop 4: i becomes 5, total 14. Prints 14, not 10. The table shows the first wrong row (total = 2 instead of 1), and the first wrong row points at the bug.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Trace the smallest input that shows the problem',
        body: 'Never trace with n = 1000. Use n = 0, n = 1, n = 2 and the smallest failing case. If a program is wrong for large inputs it is almost always wrong for a small one too, and small ones fit on paper.',
      },
    ],
    keyTakeaways: [
      'A trace table has a column per variable and a row per change; fill it in line by line.',
      'The table reveals how many times a loop really runs and what the variables hold afterwards.',
      'The first wrong row in a trace points at the bug.',
    ],
    practice: {
      prompt: 'Trace this by hand with n = 5 and write the full table: total = 0; i = 1; while i <= n: if i is odd, total = total + i; i = i + 1; print total. Then predict the output for n = 6 without tracing, and check by tracing.',
    },
  },
];
