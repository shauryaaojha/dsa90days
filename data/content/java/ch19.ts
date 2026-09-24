import type { Lesson } from '../types';

/**
 * Java Chapter 19 — Setting Up Your Workspace.
 * Sets up a complete local Java environment for DSA preparation:
 * installing JDK 21 LTS, configuring VS Code, terminal compiling and running,
 * understanding online judges, reading stack traces, organising practice files,
 * and establishing a daily local-to-submit routine.
 */
export const ch19: Lesson[] = [
  // -------------------------------------------------------------------------
  // java-19.1 — Installing the JDK
  // -------------------------------------------------------------------------
  {
    topicId: 'java-19.1',
    language: 'java',
    summary: 'Install Java Development Kit 21 and verify both the compiler and runtime from the terminal.',
    readMinutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'Before you can write and execute Java programs, you need the **Java Development Kit (JDK)**. A computer cannot execute Java source code directly from text files. The JDK provides the tools required to translate your code into machine instructions and run it.',
      },
      { kind: 'heading', text: 'JDK, JRE, and JVM' },
      {
        kind: 'table',
        headers: ['Component', 'Full Name', 'Role'],
        rows: [
          ['JDK', 'Java Development Kit', 'The developer toolbox containing the compiler (`javac`), debugger, and libraries needed to build code.'],
          ['JRE', 'Java Runtime Environment', 'The bundle needed to run existing applications, containing standard libraries and the JVM. Bundled inside modern JDKs.'],
          ['JVM', 'Java Virtual Machine', 'The execution engine that loads compiled bytecode and executes it on your specific operating system.'],
        ],
      },
      { kind: 'heading', text: 'Installing JDK 21 LTS' },
      {
        kind: 'text',
        body: 'Install **Java 21 LTS** (**Long Term Support**). Java releases a new version every six months, but only LTS versions receive multi-year support. Coding judges and enterprise systems standardise on LTS releases. You can download JDK 21 from providers such as **Eclipse Temurin** (Adoptium) or **Oracle OpenJDK**. On Windows, run the installer and check **Add to PATH**. On macOS, use the installer package or Homebrew. On Linux, install the OpenJDK package through your package manager.',
      },
      { kind: 'heading', text: 'Verifying in the terminal' },
      {
        kind: 'text',
        body: 'Open a fresh terminal window and verify both `javac` (the compiler) and `java` (the runtime launcher).',
      },
      {
        kind: 'code',
        caption: 'Checking compiler and runtime versions',
        code: `javac -version\njava -version`,
        output: `javac 21.0.2\nopenjdk version "21.0.2" 2024-01-16 LTS`,
      },
      {
        kind: 'text',
        body: 'Both commands must report version 21. If `javac -version` prints 21, your compiler is ready. If `java -version` prints 21, commands route to the matching runtime.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: "'javac' is not recognized as an internal or external command",
        body: 'This error indicates the operating system cannot locate `javac`. The system searches directories listed in the `PATH` environment variable. If the JDK `bin` directory was not added to `PATH`, terminal commands fail. Restart your terminal so updated variables load. If the error remains, add the JDK `bin` directory to your system `PATH` manually.',
      },
    ],
    keyTakeaways: [
      'The JDK provides the compiler (javac) and runtime tools needed to build and run Java software.',
      'Install JDK 21 LTS for long-term stability and compatibility with coding platforms.',
      'Verify setup by confirming javac -version and java -version both report version 21.',
      'The PATH environment variable must include the JDK bin directory for commands to be recognised.',
    ],
    practice: {
      prompt: 'Install JDK 21 LTS on your machine. Open a terminal and run javac -version followed by java -version. Confirm that both outputs report version 21, and note the directory where the JDK is installed.',
    },
  },

  // -------------------------------------------------------------------------
  // java-19.2 — Setting up VS Code for Java
  // -------------------------------------------------------------------------
  {
    topicId: 'java-19.2',
    language: 'java',
    summary: 'Configure Visual Studio Code with the Extension Pack for Java for writing, navigating, and debugging code.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'A basic text editor treats code as plain text. An **Integrated Development Environment (IDE)** or modern editor understands language grammar, highlights syntax, flags errors before compilation, and assists with autocompletion. Visual Studio Code (VS Code) is a lightweight editor that provides full Java support through extensions.',
      },
      { kind: 'heading', text: 'The Extension Pack for Java' },
      {
        kind: 'text',
        body: 'Open the Extensions view in VS Code (`Ctrl+Shift+X` on Windows and Linux, `Cmd+Shift+X` on macOS). Search for **Extension Pack for Java** published by Microsoft and click Install.',
      },
      {
        kind: 'table',
        headers: ['Extension', 'Purpose'],
        rows: [
          ['Language Support for Java by Red Hat', 'Provides code completion, error detection, and code formatting.'],
          ['Debugger for Java', 'Allows setting breakpoints and inspecting variables during execution.'],
          ['Test Runner for Java', 'Discovers and executes unit tests from within the editor.'],
          ['Project Manager for Java', 'Handles project configuration, classpath settings, and dependencies.'],
        ],
      },
      { kind: 'heading', text: 'Open a dedicated workspace folder' },
      {
        kind: 'text',
        body: 'Java requires directory context to resolve classes. Opening a single loose `.java` file forces VS Code into single-file mode, which disables complete autocompletion and workspace diagnostics. Create a folder named `dsa-practice` and use **File -> Open Folder** to open it.',
      },
      { kind: 'heading', text: 'Your first file in VS Code' },
      {
        kind: 'text',
        body: 'With the folder open, create a file named `Main.java` and enter this code.',
      },
      {
        kind: 'code',
        caption: 'Main.java in your VS Code workspace',
        code: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("VS Code Java setup complete.");\n    }\n}`,
        output: 'VS Code Java setup complete.',
      },
      {
        kind: 'text',
        body: 'After saving, the Java extension displays small buttons above the `main` method: **Run | Debug**. Clicking **Run** compiles and executes the class in the integrated terminal.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Opening loose files instead of a folder',
        body: 'Opening an individual `.java` file prevents the Java language server from indexing your workspace. Cross-file references and quick-fix suggestions will fail to work. Always open the enclosing folder with File -> Open Folder.',
      },
    ],
    keyTakeaways: [
      'The Extension Pack for Java by Microsoft adds language intelligence, running, and debugging to VS Code.',
      'Always open a parent directory with File -> Open Folder rather than opening single files.',
      'The Run and Debug CodeLens buttons above main allow one-click execution in the integrated terminal.',
      'Enable Format on Save in settings to keep braces and indentation aligned automatically.',
    ],
    practice: {
      prompt: 'Create a folder named dsa-practice and open it in VS Code using File -> Open Folder. Install the Extension Pack for Java. Create Main.java, enter the verification program, and execute it by clicking the Run button above main.',
    },
  },

  // -------------------------------------------------------------------------
  // java-19.3 — Compiling and running from the terminal
  // -------------------------------------------------------------------------
  {
    topicId: 'java-19.3',
    language: 'java',
    summary: 'Compile Java source files to bytecode with javac and execute them on the JVM using java.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Editor run buttons automate building and execution, but technical assessments, online servers, and automated pipelines run code directly from the terminal. Understanding the command-line workflow explains how Java compiles and runs.',
      },
      { kind: 'heading', text: 'The two-step execution model' },
      {
        kind: 'table',
        headers: ['Step', 'Command', 'Input', 'Output', 'Role'],
        rows: [
          ['1. Compile', 'javac Main.java', 'Main.java', 'Main.class', 'Checks syntax and translates source into bytecode.'],
          ['2. Execute', 'java Main', 'Main.class', 'Terminal output', 'JVM loads the class bytecode and executes instructions.'],
        ],
      },
      { kind: 'heading', text: 'A program reading terminal arguments' },
      {
        kind: 'text',
        body: 'Here is a complete program that reads values passed to it from the terminal invocation.',
      },
      {
        kind: 'code',
        caption: 'Main.java — handling command-line arguments',
        code: `public class Main {\n    public static void main(String[] args) {\n        if (args.length > 0) {\n            System.out.println("Hello, " + args[0] + "!");\n        } else {\n            System.out.println("Hello, terminal user!");\n        }\n    }\n}`,
      },
      { kind: 'heading', text: 'Compiling and executing' },
      {
        kind: 'text',
        body: 'Navigate to the folder containing `Main.java` and execute these commands in your terminal.',
      },
      {
        kind: 'code',
        caption: 'Compiling and running from the terminal',
        code: `javac Main.java\njava Main\njava Main Alex`,
        output: `Hello, terminal user!\nHello, Alex!`,
      },
      {
        kind: 'text',
        body: 'When `javac Main.java` succeeds, it emits no text. Silence indicates success. A binary file named `Main.class` containing compiled bytecode is created next to your source file.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Running java Main.class instead of java Main',
        body: 'The compiler (`javac`) requires a file name with its extension: `javac Main.java`. The runtime launcher (`java`) expects a **class name**, not a file: `java Main`. Adding `.class` causes the JVM to search for a nested class named `Main/class` and throw `Could not find or load main class Main.class`.',
      },
    ],
    keyTakeaways: [
      'javac translates human-readable .java source files into portable .class bytecode.',
      'java launches the JVM and runs the bytecode of the specified class.',
      'Pass the full file name to javac (javac Main.java) and only the class name to java (java Main).',
      'Successful compilation produces no console output and generates a .class file.',
    ],
    practice: {
      prompt: 'Write Main.java on your machine. Open a terminal, compile it with javac Main.java, and verify Main.class was created. Run java Main, then run java Main Alex. Intentionally run java Main.class to observe and recognise the resulting error.',
    },
  },

  // -------------------------------------------------------------------------
  // java-19.4 — Online compilers and the LeetCode editor
  // -------------------------------------------------------------------------
  {
    topicId: 'java-19.4',
    language: 'java',
    summary: 'Understand how online judges differ from local environments and navigate the LeetCode Java editor.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Local development requires writing a `public static void main(String[] args)` method, parsing inputs, and printing output. Algorithmic platforms like LeetCode execute code under different rules.',
      },
      { kind: 'heading', text: 'How an online judge evaluates code' },
      {
        kind: 'text',
        body: 'An **online judge** evaluates solutions against hidden test cases on remote servers. The platform instantiates `class Solution`, passes arguments into your method, and checks the returned value.',
      },
      { kind: 'heading', text: 'Local program versus LeetCode Solution' },
      {
        kind: 'code',
        caption: 'Local Main.java vs LeetCode class Solution',
        code: `// Local: you manage class, main, and output\npublic class Main {\n    public static void main(String[] args) {\n        int[] res = new Solution().twoSum(new int[]{2, 7, 11, 15}, 9);\n        System.out.println("[" + res[0] + ", " + res[1] + "]");\n    }\n}\n\n// LeetCode: write only inside class Solution\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        for (int i = 0; i < nums.length; i++) {\n            for (int j = i + 1; j < nums.length; j++) {\n                if (nums[i] + nums[j] == target) return new int[]{i, j};\n            }\n        }\n        return new int[]{};\n    }\n}`,
        output: '[0, 1]',
      },
      { kind: 'heading', text: 'Environment comparison' },
      {
        kind: 'table',
        headers: ['Feature', 'Local Environment', 'LeetCode Online Judge'],
        rows: [
          ['Entry Point', 'public static void main(String[] args)', 'Instance method in class Solution'],
          ['Inputs', 'Scanner or hardcoded arrays', 'Passed as method arguments'],
          ['Outputs', 'System.out.println(...) to console', 'return statement with expected type'],
          ['Imports', 'Must write import statements', 'java.util.* pre-imported automatically'],
          ['Limits', 'Hardware dependent', 'Strict time and memory limits'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Printing results instead of returning them',
        body: 'Calling `System.out.println(...)` does not return an answer to the judge. The harness inspects the value emitted by your `return` statement. Printing causes a compilation failure or Wrong Answer verdict.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Leftover print statements cause Time Limit Exceeded',
        body: 'Terminal I/O is slow. Printing debug lines inside loops that run 100,000 times will exhaust your time limit. Remove all `System.out.println` statements before submitting.',
      },
    ],
    keyTakeaways: [
      'On LeetCode you implement a method inside class Solution; no main method is required.',
      'Inputs arrive via method arguments and answers must be returned using a return statement.',
      'Standard utility packages such as java.util are pre-imported automatically by the platform.',
      'Remove debugging print statements before submitting to prevent Time Limit Exceeded errors.',
    ],
    practice: {
      prompt: 'Open Two Sum on LeetCode. Review the pre-populated class Solution and the method signature public int[] twoSum(int[] nums, int target). Observe the parameter types and the return type int[]. Run the starter code with the sample case.',
      leetcode: { title: 'Two Sum', slug: 'two-sum' },
    },
  },

  // -------------------------------------------------------------------------
  // java-19.5 — Reading your first stack trace
  // -------------------------------------------------------------------------
  {
    topicId: 'java-19.5',
    language: 'java',
    summary: 'Read and dissect a Java stack trace from top to bottom to identify the error type and exact line number.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'When a Java program crashes during execution, the JVM outputs a diagnostic message known as a **stack trace**. Red text in the terminal is not an insult; it pinpoints the failure type and the exact line responsible.',
      },
      { kind: 'heading', text: 'Compile errors versus runtime exceptions' },
      {
        kind: 'table',
        headers: ['Error Kind', 'When Detected', 'Detected By', 'Example'],
        rows: [
          ['Compile Error', 'Before execution', 'javac compiler', 'Syntax errors, mismatched types, missing symbols.'],
          ['Runtime Exception', 'During execution', 'JVM runtime', 'Dividing by zero, invalid array index, null reference.'],
        ],
      },
      { kind: 'heading', text: 'Anatomy of a runtime crash' },
      {
        kind: 'code',
        caption: 'BuggyArray.java — accessing an invalid index',
        code: `public class BuggyArray {\n    public static void main(String[] args) {\n        int[] numbers = {10, 20, 30};\n        printElement(numbers, 5);\n    }\n\n    public static void printElement(int[] arr, int index) {\n        System.out.println("Value: " + arr[index]);\n    }\n}`,
      },
      {
        kind: 'code',
        caption: 'The Java stack trace output',
        code: `Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: Index 5 out of bounds for length 3\n\tat BuggyArray.printElement(BuggyArray.java:8)\n\tat BuggyArray.main(BuggyArray.java:4)`,
      },
      { kind: 'heading', text: 'How to read the trace' },
      {
        kind: 'table',
        headers: ['Part', 'Meaning', 'In This Example'],
        rows: [
          ['Exception Name', 'The category of error that occurred', 'java.lang.ArrayIndexOutOfBoundsException'],
          ['Detail Message', 'Specific values causing the crash', 'Index 5 out of bounds for length 3'],
          ['Top Code Frame', 'The method, file, and line that failed', 'BuggyArray.printElement(BuggyArray.java:8)'],
          ['Calling Frame', 'The line that called the failing method', 'BuggyArray.main(BuggyArray.java:4)'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Reading from the bottom instead of the top',
        body: 'Python outputs tracebacks bottom-up, placing the crash at the end. Java prints stack traces **top-down**: the exception name, detail message, and failing line are at the very top. Reading the bottom of a Java trace shows internal JVM launcher frames.',
      },
    ],
    keyTakeaways: [
      'A stack trace reports the exception name, detail message, and sequence of active method calls.',
      'Java stack traces read top to bottom: the error type and offending line appear on the first lines.',
      'Find the first line referencing your own source file to locate where the crash occurred.',
      'ArrayIndexOutOfBoundsException indicates an index was negative or greater than or equal to length.',
    ],
    practice: {
      prompt: 'Write BuggyArray.java on your computer and run it. Inspect the stack trace: locate the exception name, the failing index, and the exact line number. Change index 5 to 1, recompile, and verify the crash disappears.',
    },
  },

  // -------------------------------------------------------------------------
  // java-19.6 — Naming, saving and organising practice files
  // -------------------------------------------------------------------------
  {
    topicId: 'java-19.6',
    language: 'java',
    summary: 'Organise practice solutions into a structured directory and follow strict Java file naming conventions.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'During a 90-day DSA sprint, you will solve over a hundred problems. Storing loose files named `temp.java` or `solution.java` on your Desktop makes review difficult. A structured folder layout and disciplined naming scheme keep solutions accessible.',
      },
      { kind: 'heading', text: 'The class-to-filename contract' },
      {
        kind: 'text',
        body: 'In Java, file naming is enforced by the compiler: a `public class` must be saved in a file matching its exact name, including case sensitivity, with the `.java` extension.',
      },
      {
        kind: 'table',
        headers: ['Class Declaration', 'Valid File Name', 'Invalid File Name', 'Result of Mismatch'],
        rows: [
          ['public class TwoSum', 'TwoSum.java', 'twosum.java', 'Compile error: class TwoSum should be declared in TwoSum.java'],
          ['public class TwoSum', 'TwoSum.java', 'Two-Sum.java', 'Compile error: hyphens are illegal in Java class names'],
          ['public class TwoSum', 'TwoSum.java', 'Problem1.java', 'Compile error: class TwoSum should be declared in TwoSum.java'],
        ],
      },
      { kind: 'heading', text: 'Recommended practice folder structure' },
      {
        kind: 'text',
        body: 'Create a root directory named `dsa-practice`. Group solutions by topic folder, prefixing files with their four-digit problem number.',
      },
      {
        kind: 'code',
        caption: 'Directory layout for DSA solutions',
        code: `dsa-practice/\n|-- 01_arrays/\n|   |-- P0001_TwoSum.java\n|   |-- P0026_RemoveDuplicates.java\n|   +-- P0121_BestTimeToBuyAndSellStock.java\n|-- 02_strings/\n|   |-- P0020_ValidParentheses.java\n|   |-- P0125_ValidPalindrome.java\n|   +-- P0242_ValidAnagram.java\n+-- 03_two_pointers/\n    |-- P0011_ContainerWithMostWater.java\n    +-- P0015_ThreeSum.java`,
      },
      {
        kind: 'text',
        body: 'Using four digits (`P0001_`) ensures files sort in numeric problem order. Keep practice files in the **default package** (do not add a `package` line). This allows you to compile and run each file directly from inside its directory without package path flags.',
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Using hyphens or spaces in file names',
        body: 'Operating systems allow hyphens and spaces in file names, but Java identifiers do not. Saving a class as `two-sum.java` fails compilation immediately because `two-sum` is not a valid Java class name. Always use PascalCase: `TwoSum.java`.',
      },
    ],
    keyTakeaways: [
      'A public class must be stored in a file with the identical name and capitalisation plus .java.',
      'Use PascalCase for class and file names; spaces and hyphens are syntax errors.',
      'Organise practice into topic folders with four-digit zero-padded problem prefixes.',
      'Omit package declarations in standalone practice files to simplify terminal execution.',
    ],
    practice: {
      prompt: 'Create the dsa-practice directory structure with folders 01_arrays and 02_strings. Inside 01_arrays, create P0001_TwoSum.java with a matching public class P0001_TwoSum. Compile and run it from inside that folder to verify your setup.',
    },
  },

  // -------------------------------------------------------------------------
  // java-19.7 — A daily practice routine: local file, run, submit
  // -------------------------------------------------------------------------
  {
    topicId: 'java-19.7',
    language: 'java',
    summary: 'Adopt a reliable 5-step daily routine from local development and edge-case testing to final LeetCode submission.',
    readMinutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Typing an unverified solution directly into a browser editor and clicking Submit repeatedly slows down progress. Diagnosing failures on large hidden test cases in the browser is difficult. A disciplined routine develops locally first, tests edge cases, and submits with confidence.',
      },
      { kind: 'heading', text: 'The 5-step daily workflow' },
      {
        kind: 'table',
        headers: ['Step', 'Action', 'Goal'],
        rows: [
          ['1. Understand', 'Read prompt, trace cases, check constraints', 'Determine target time and space complexity.'],
          ['2. Scaffold', 'Write Solution class and local test harness', 'Prepare runnable code on your machine.'],
          ['3. Test Edge Cases', 'Run sample inputs plus boundary tests locally', 'Catch edge-case failures early.'],
          ['4. Transfer', 'Paste Solution into LeetCode editor and run', 'Verify integration with judge harness.'],
          ['5. Submit', 'Submit and log complexity notes', 'Preserve working code and track progress.'],
        ],
      },
      { kind: 'heading', text: 'The local scaffolding template' },
      {
        kind: 'code',
        caption: 'P0001_TwoSum.java — complete local test harness',
        code: `import java.util.Arrays;\nimport java.util.HashMap;\nimport java.util.Map;\n\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int comp = target - nums[i];\n            if (map.containsKey(comp)) return new int[]{map.get(comp), i};\n            map.put(nums[i], i);\n        }\n        return new int[]{};\n    }\n}\n\npublic class P0001_TwoSum {\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        System.out.println("T1: " + Arrays.toString(sol.twoSum(new int[]{2, 7, 11, 15}, 9)));\n        System.out.println("T2: " + Arrays.toString(sol.twoSum(new int[]{-3, 4, 3, 90}, 0)));\n    }\n}`,
        output: `T1: [0, 1]\nT2: [0, 2]`,
      },
      { kind: 'heading', text: 'Edge cases to test locally' },
      {
        kind: 'table',
        headers: ['Edge Case', 'Example Input', 'Risk Caught'],
        rows: [
          ['Minimum size', 'Array of length 2', 'Assumptions that three or more elements exist.'],
          ['Negative numbers', 'nums = [-5, -2], target = -7', 'Logic assuming values are non-negative.'],
          ['Duplicate values', 'nums = [3, 3], target = 6', 'Maps overwriting identical keys too early.'],
        ],
      },
      {
        kind: 'callout',
        tone: 'trap',
        title: 'Pasting the driver class into LeetCode',
        body: 'Copy **only** `class Solution` to LeetCode. Including `public class P0001_TwoSum` and `main` causes a compile error because the judge supplies its own execution wrapper.',
      },
    ],
    keyTakeaways: [
      'A local test harness allows fast iteration and debugging before submitting to an online judge.',
      'Always test minimum size inputs, negative numbers, and duplicates before submitting.',
      'Copy only class Solution into the LeetCode editor; omit the local driver class and main method.',
      'Record time and space complexity at the top of your solution for review.',
    ],
    practice: {
      prompt: 'Follow the 5-step routine for Two Sum. Create P0001_TwoSum.java locally, run it with sample and negative inputs in your terminal, and verify output. Then copy class Solution to LeetCode and submit.',
      leetcode: { title: 'Two Sum', slug: 'two-sum' },
    },
  },
];
