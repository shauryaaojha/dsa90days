import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Phase 0 — Language Foundation',
  description: 'Build coding fluency in C++, Java, or Python before tackling DSA problems.',
};

export default function Day0to1Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
