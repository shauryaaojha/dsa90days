import type { Metadata } from 'next';
import './globals.css';
import SessionProvider from '@/components/SessionProvider';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'DSA 90-Day Tracker | Master Data Structures & Algorithms',
  description:
    'Track your 90-day DSA mastery journey. 200+ curated problems, organized by topic, with progress tracking, pattern cheatsheets, and video resources.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='%23944521'/><text x='50%25' y='58%25' dominant-baseline='middle' text-anchor='middle' font-family='serif' font-size='20' fill='white'>%E0%A5%90</text></svg>" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css" />
      </head>
      <body>
        <SessionProvider>
          <Navbar />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
