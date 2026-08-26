'use client';

import { useMemo, useState } from 'react';
import type { Phase0Language } from '@/data/day0to1Topics';

/**
 * A tiny syntax highlighter for C++, Java and Python.
 *
 * Deliberately hand-rolled rather than pulling in Shiki or highlight.js: Phase 0
 * snippets are a few lines each, and one small tokenizer keeps the client bundle
 * unchanged. It produces React elements (never raw HTML), so lesson content can
 * never inject markup.
 *
 * All three lexers share the same capture-group layout so one loop handles them:
 *   1 comment · 2 string · 3 directive/annotation · 4 number · 5 identifier
 */

const CPP_LEXER =
  /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(^[ \t]*#\w+)|(\b\d[\d.'a-fA-FxX]*\b)|([A-Za-z_]\w*)/gm;

const JAVA_LEXER =
  /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(@\w+)|(\b\d[\d._a-fA-FxXlL]*\b)|([A-Za-z_$][\w$]*)/gm;

// Triple-quoted strings must be tried before single-quoted ones.
const PY_LEXER =
  /(#[^\n]*)|("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*')|(@\w+)|(\b\d[\d._a-fA-FxXjJ]*\b)|([A-Za-z_]\w*)/gm;

const CPP_KEYWORDS = new Set([
  'alignas', 'alignof', 'and', 'asm', 'auto', 'break', 'case', 'catch', 'class',
  'const', 'consteval', 'constexpr', 'const_cast', 'continue', 'decltype',
  'default', 'delete', 'do', 'dynamic_cast', 'else', 'enum', 'explicit',
  'export', 'extern', 'false', 'for', 'friend', 'goto', 'if', 'inline',
  'mutable', 'namespace', 'new', 'noexcept', 'not', 'nullptr', 'operator', 'or',
  'override', 'private', 'protected', 'public', 'register', 'reinterpret_cast',
  'return', 'sizeof', 'static', 'static_assert', 'static_cast', 'struct',
  'switch', 'template', 'this', 'throw', 'true', 'try', 'typedef', 'typeid',
  'typename', 'union', 'using', 'virtual', 'volatile', 'while',
]);

const CPP_TYPES = new Set([
  'bool', 'char', 'double', 'float', 'int', 'long', 'short', 'signed',
  'unsigned', 'void', 'size_t', 'string', 'vector', 'map', 'set', 'pair',
  'queue', 'stack', 'deque', 'list', 'array', 'tuple', 'unordered_map',
  'unordered_set', 'multiset', 'multimap', 'priority_queue', 'forward_list',
  'ListNode', 'TreeNode', 'Solution',
]);

const JAVA_KEYWORDS = new Set([
  'abstract', 'assert', 'break', 'case', 'catch', 'class', 'const', 'continue',
  'default', 'do', 'else', 'enum', 'extends', 'final', 'finally', 'for', 'goto',
  'if', 'implements', 'import', 'instanceof', 'interface', 'native', 'new',
  'package', 'private', 'protected', 'public', 'return', 'static', 'strictfp',
  'super', 'switch', 'synchronized', 'this', 'throw', 'throws', 'transient',
  'try', 'var', 'volatile', 'while', 'true', 'false', 'null', 'record', 'yield',
]);

const JAVA_TYPES = new Set([
  'boolean', 'byte', 'char', 'double', 'float', 'int', 'long', 'short', 'void',
  'Boolean', 'Byte', 'Character', 'Double', 'Float', 'Integer', 'Long', 'Short',
  'String', 'StringBuilder', 'StringBuffer', 'Object', 'Math', 'System',
  'Arrays', 'Collections', 'Comparator', 'Comparable', 'Iterator', 'Scanner',
  'List', 'ArrayList', 'LinkedList', 'Vector', 'Map', 'HashMap', 'TreeMap',
  'LinkedHashMap', 'Set', 'HashSet', 'TreeSet', 'LinkedHashSet', 'Queue',
  'Deque', 'ArrayDeque', 'PriorityQueue', 'Stack', 'Optional', 'Exception',
  'ListNode', 'TreeNode', 'Solution',
]);

const PY_KEYWORDS = new Set([
  'and', 'as', 'assert', 'async', 'await', 'break', 'class', 'continue', 'def',
  'del', 'elif', 'else', 'except', 'finally', 'for', 'from', 'global', 'if',
  'import', 'in', 'is', 'lambda', 'match', 'nonlocal', 'not', 'or', 'pass',
  'raise', 'return', 'try', 'while', 'with', 'yield', 'True', 'False', 'None',
  'self',
]);

const PY_TYPES = new Set([
  'int', 'float', 'str', 'bool', 'list', 'dict', 'set', 'tuple', 'bytes',
  'complex', 'frozenset', 'object', 'type', 'range', 'deque', 'defaultdict',
  'Counter', 'OrderedDict', 'heapq', 'bisect', 'List', 'Dict', 'Set', 'Tuple',
  'Optional', 'ListNode', 'TreeNode', 'Solution',
]);

interface LangSpec {
  lexer: RegExp;
  keywords: Set<string>;
  types: Set<string>;
  /** Colour the `<header>` that follows an `#include` (C++ only). */
  includeHeaders: boolean;
}

const SPECS: Record<Phase0Language, LangSpec> = {
  cpp: { lexer: CPP_LEXER, keywords: CPP_KEYWORDS, types: CPP_TYPES, includeHeaders: true },
  java: { lexer: JAVA_LEXER, keywords: JAVA_KEYWORDS, types: JAVA_TYPES, includeHeaders: false },
  python: { lexer: PY_LEXER, keywords: PY_KEYWORDS, types: PY_TYPES, includeHeaders: false },
};

type Token = { text: string; cls: string | null };

function tokenize(source: string, lang: Phase0Language): Token[] {
  const spec = SPECS[lang];
  const tokens: Token[] = [];
  let last = 0;

  const push = (text: string, cls: string | null) => {
    if (text) tokens.push({ text, cls });
  };

  // An explicit exec loop rather than matchAll: the `#include` branch consumes
  // the header name itself, and only exec lets us push the regex cursor past
  // it. With matchAll the header would be re-scanned and emitted twice.
  spec.lexer.lastIndex = 0;
  let m: RegExpExecArray | null;

  while ((m = spec.lexer.exec(source)) !== null) {
    const index = m.index;
    push(source.slice(last, index), null);
    last = index + m[0].length;

    const [, comment, str, special, num, ident] = m;

    if (comment) {
      push(m[0], 'tok-com');
    } else if (str) {
      push(m[0], 'tok-str');
    } else if (special) {
      // `#include`/`#define` in C++, `@Override` in Java, `@decorator` in Python.
      push(m[0], 'tok-pre');
      if (spec.includeHeaders) {
        const rest = /^[ \t]*(<[^>\n]*>|"[^"\n]*")/.exec(source.slice(last));
        if (rest) {
          push(rest[0].slice(0, rest[0].length - rest[1].length), null);
          push(rest[1], 'tok-str');
          last += rest[0].length;
          spec.lexer.lastIndex = last;
        }
      }
    } else if (num) {
      push(m[0], 'tok-num');
    } else if (ident) {
      if (spec.keywords.has(ident)) push(ident, 'tok-kw');
      else if (spec.types.has(ident)) push(ident, 'tok-typ');
      else if (source[last] === '(') push(ident, 'tok-fn');
      else push(ident, null);
    }
  }

  push(source.slice(last), null);
  return tokens;
}

const LANG_LABEL: Record<Phase0Language, string> = {
  cpp: 'C++',
  java: 'Java',
  python: 'Python',
};

interface CodeBlockProps {
  code: string;
  caption?: string;
  /** What the snippet prints, shown in a muted strip underneath. */
  output?: string;
  /** Which highlighter to use. Defaults to C++. */
  lang?: Phase0Language;
}

export default function CodeBlock({ code, caption, output, lang = 'cpp' }: CodeBlockProps) {
  const tokens = useMemo(() => tokenize(code, lang), [code, lang]);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard unavailable (insecure origin / denied) — leave the label alone.
    }
  };

  return (
    <figure className="lsn-code">
      <div className="lsn-code-bar">
        <span className="lsn-code-caption">{caption ?? LANG_LABEL[lang]}</span>
        <button type="button" className="lsn-code-copy" onClick={copy}>
          <i className={`ti ti-${copied ? 'check' : 'copy'}`} />
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="lsn-code-pre">
        <code>
          {tokens.map((t, i) =>
            t.cls ? (
              <span key={i} className={t.cls}>
                {t.text}
              </span>
            ) : (
              <span key={i}>{t.text}</span>
            )
          )}
        </code>
      </pre>
      {output && (
        <figcaption className="lsn-code-out">
          <span className="lsn-code-out-label">Output</span>
          <pre>{output}</pre>
        </figcaption>
      )}
    </figure>
  );
}
