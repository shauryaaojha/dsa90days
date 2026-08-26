import { Fragment } from 'react';

/**
 * Minimal inline formatter for lesson prose: `code` spans and **bold**.
 *
 * Lesson bodies are authored by us in TypeScript, not user input, so the goal
 * here is authoring convenience rather than sanitisation — but rendering to
 * React elements instead of HTML means untrusted text could never inject
 * markup even if the content source changed later.
 */

const INLINE = /(`[^`]+`)|(\*\*[^*]+\*\*)/g;

export default function RichText({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  let last = 0;

  for (const m of text.matchAll(INLINE)) {
    const index = m.index ?? 0;
    if (index > last) parts.push(text.slice(last, index));

    if (m[1]) {
      parts.push(
        <code key={index} className="lsn-inline-code">
          {m[1].slice(1, -1)}
        </code>
      );
    } else if (m[2]) {
      parts.push(<strong key={index}>{m[2].slice(2, -2)}</strong>);
    }
    last = index + m[0].length;
  }

  if (last < text.length) parts.push(text.slice(last));

  return (
    <>
      {parts.map((p, i) => (
        <Fragment key={i}>{p}</Fragment>
      ))}
    </>
  );
}
