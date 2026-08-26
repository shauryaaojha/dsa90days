import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'What the DSA 90-Day Tracker stores about you, and who can see it.',
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

export default function PrivacyPolicy() {
  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 1.5rem', lineHeight: '1.8' }}>
      <h1 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '1rem' }}>
        Privacy Policy
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem' }}>
        Last updated: August 2026
      </p>

      <section style={section}>
        <h2 style={h2}>1. What this is</h2>
        <p>
          The DSA 90-Day Tracker is a study tool for working through a curated set of Data
          Structures and Algorithms problems. This page describes exactly what the application
          stores, where it goes, and who can read it. It covers only this application — not
          LeetCode, and not any other site linked from it.
        </p>
      </section>

      <section style={section}>
        <h2 style={h2}>2. Data we store</h2>
        <p>Everything below is stored in our own database. There is nothing else.</p>
        <ul style={list}>
          <li>
            <strong>Account:</strong> your name, email address, and — if you signed up with a
            password rather than Google — a bcrypt hash of that password. The password itself is
            never stored and cannot be recovered from the hash.
          </li>
          <li>
            <strong>Study plan:</strong> the track you chose (Phase 0 or Phase 1), your Phase 0
            language, the date you accepted the pledge, and the date your 90-day clock started.
          </li>
          <li>
            <strong>Progress:</strong> which problems and Phase 0 topics you have marked complete,
            and when.
          </li>
          <li>
            <strong>Your notes:</strong> the approach notes you write against each problem. These
            are free text — whatever you type is stored verbatim, so do not put anything in them
            you would not want an administrator to read.
          </li>
          <li>
            <strong>Rate-limit counters:</strong> short-lived request counts tied to your account
            id, kept only long enough to stop abuse (a few minutes) and then expired.
          </li>
        </ul>
        <p style={{ marginTop: '1rem' }}>
          We do not collect your registration number, phone number, location, or any LeetCode
          account. There is no analytics or advertising tracker on this site.
        </p>
      </section>

      <section style={section}>
        <h2 style={h2}>3. Who can see it</h2>
        <ul style={list}>
          <li>
            <strong>You.</strong> Your progress and notes are shown only to you when you are
            signed in.
          </li>
          <li>
            <strong>Administrators.</strong> This application has a password-protected admin panel.
            An administrator can see the full account list — names, emails, sign-up dates, and
            progress totals — and aggregate completion statistics. Password hashes are excluded
            from that view.
          </li>
          <li>
            <strong>Nobody else.</strong> Your data is not sold, shared for marketing, or exposed
            on a public leaderboard.
          </li>
        </ul>
      </section>

      <section style={section}>
        <h2 style={h2}>4. Third parties</h2>
        <p>Operating the site involves these services:</p>
        <ul style={list}>
          <li>
            <strong>MongoDB Atlas</strong> — hosts the database where everything in section 2
            lives.
          </li>
          <li>
            <strong>Google</strong> — only if you choose &ldquo;Sign in with Google&rdquo;. Google
            tells us your name and email address; we tell Google nothing about your progress.
          </li>
          <li>
            <strong>Google Fonts and jsDelivr</strong> — your browser fetches the site&rsquo;s font
            and icon set from these CDNs, which means they see your IP address and browser version
            as part of that request. They receive no account data.
          </li>
          <li>
            <strong>Our hosting provider</strong> — serves the application and keeps standard
            server logs.
          </li>
        </ul>
        <p style={{ marginTop: '1rem' }}>
          Problem titles link out to <strong>leetcode.com</strong>. Those are ordinary links: we do
          not read your LeetCode account, and LeetCode learns nothing about you until you click
          through.
        </p>
      </section>

      <section style={section}>
        <h2 style={h2}>5. Cookies and browser storage</h2>
        <ul style={list}>
          <li>
            <strong>Session cookie:</strong> set when you sign in, so the site knows it is you. It
            is required — the application does not work without it.
          </li>
          <li>
            <strong>Admin cookie:</strong> set only when someone signs into the admin panel.
          </li>
          <li>
            <strong>Local storage:</strong> the date you last saw the daily quote, and the language
            you last picked on the pattern cheatsheet. Both stay in your browser and are never sent
            to us.
          </li>
        </ul>
      </section>

      <section style={section}>
        <h2 style={h2}>6. Retention and deletion</h2>
        <p>
          Your account and progress are kept until you ask for them to be deleted. Rate-limit
          counters expire automatically within minutes. To delete your account and everything
          attached to it, contact us at the address below — deletion is permanent and your progress
          cannot be restored afterwards.
        </p>
      </section>

      <section style={section}>
        <h2 style={h2}>7. Contact</h2>
        <p>
          Questions about this policy, or a deletion request, can go to the administrator of this
          tracker. If you are unsure who that is, use the account that invited you to the platform.
        </p>
      </section>

      <p style={{ marginTop: '3rem' }}>
        <Link href="/terms" style={{ color: 'var(--primary)' }}>
          Terms of Service
        </Link>
      </p>
    </main>
  );
}
