import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'The rules for using the DSA 90-Day Tracker.',
};

const section = { marginBottom: '2.5rem' } as const;
const h2 = { fontSize: '1.5rem', marginBottom: '1rem' } as const;
const list = {
  paddingLeft: '1.5rem',
  marginTop: '0.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
} as const;

export default function TermsOfService() {
  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 1.5rem', lineHeight: '1.8' }}>
      <h1 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '1rem' }}>
        Terms of Service
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem' }}>
        Last updated: August 2026
      </p>

      <section style={section}>
        <h2 style={h2}>1. Acceptance</h2>
        <p>
          By creating an account on the DSA 90-Day Tracker you agree to these terms. If you do not
          agree with them, do not use the platform.
        </p>
      </section>

      <section style={section}>
        <h2 style={h2}>2. Your account</h2>
        <ul style={list}>
          <li>One account per person. Do not share your login with anyone else.</li>
          <li>
            Keep your password to yourself. You are responsible for what happens under your
            account.
          </li>
          <li>Give a real email address — it is the only way to reach you about your account.</li>
        </ul>
      </section>

      <section style={section}>
        <h2 style={h2}>3. Honest tracking</h2>
        <p>
          Progress here is self-reported. Nothing in the application checks whether you actually
          solved a problem, which means the only person a false tick misleads is you.
        </p>
        <ul style={list}>
          <li>
            Mark a problem complete when you have solved and understood it — not when you have read
            someone else&rsquo;s solution.
          </li>
          <li>
            Write approach notes in your own words. They exist so that the pattern is still there
            when you come back to it in three months.
          </li>
          <li>
            If you are using this tracker for a course or a programme, the people running it may
            have their own rules about what counts as complete. Those rules take precedence over
            this section.
          </li>
        </ul>
      </section>

      <section style={section}>
        <h2 style={h2}>4. Content and conduct</h2>
        <ul style={list}>
          <li>
            Do not put anything unlawful, abusive, or someone else&rsquo;s private information into
            your notes.
          </li>
          <li>
            Do not attempt to break, overload, or gain unauthorised access to the platform or other
            users&rsquo; data. Requests are rate-limited; working around those limits is a breach of
            these terms.
          </li>
          <li>
            You keep ownership of the notes you write. You grant us only what is needed to store and
            display them back to you.
          </li>
        </ul>
      </section>

      <section style={section}>
        <h2 style={h2}>5. Study material</h2>
        <p>
          The Phase 0 lessons, pattern cheatsheet, and problem lists are learning aids, not a
          guarantee of any outcome — academic, interview, or otherwise. Problems link out to
          LeetCode, which is an independent service with its own terms; we do not control it and are
          not responsible for it.
        </p>
      </section>

      <section style={section}>
        <h2 style={h2}>6. Availability</h2>
        <p>
          The platform is provided as-is. There is no uptime guarantee, features may change, and
          while your data is backed up by our database provider, you should not treat this as the
          only record of your work.
        </p>
      </section>

      <section style={section}>
        <h2 style={h2}>7. Suspension</h2>
        <p>
          Accounts that breach section 3 or section 4 may be suspended or removed. You can stop
          using the platform at any time and request deletion of your account — see the{' '}
          <Link href="/privacy" style={{ color: 'var(--primary)' }}>
            Privacy Policy
          </Link>
          .
        </p>
      </section>

      <section style={section}>
        <h2 style={h2}>8. Changes</h2>
        <p>
          These terms may be updated; the date at the top reflects the last change. Continuing to
          use the platform after an update means you accept the revised terms.
        </p>
      </section>

      <p style={{ marginTop: '3rem' }}>
        <Link href="/privacy" style={{ color: 'var(--primary)' }}>
          Privacy Policy
        </Link>
      </p>
    </main>
  );
}
