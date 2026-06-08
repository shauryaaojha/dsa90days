'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  if (!session) return null;

  const links = [
    { href: '/', label: 'Dashboard' },
    { href: '/phase/1', label: 'Phase 1' },
    { href: '/phase/2', label: 'Phase 2' },
    { href: '/patterns', label: 'Patterns' },
    { href: '/resources', label: 'Resources' },
  ];

  const userName = session.user?.name || 'User';
  const initials = userName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <header className="navbar-wrap">
      <nav className="navbar-dock animate-fade-in">
        <Link href="/" className="nav-logo-dock" style={{ textDecoration: 'none' }}>
          <div className="logo-icon-dock">
            <i className="ti ti-code" style={{ fontSize: '17px' }}></i>
          </div>
          <span className="logo-text-dock">DSA <span>Tracker</span></span>
        </Link>

        <div className="nav-links-dock">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link-dock ${pathname === link.href ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="nav-user-dock">
          <Link href="/profile" className="avatar-dock" title="My Profile">
            {initials}
          </Link>
          <button
            className="btn-logout-dock"
            onClick={() => signOut({ callbackUrl: '/login' })}
          >
            <i className="ti ti-logout" style={{ fontSize: '13px' }}></i>
            Sign out
          </button>
        </div>
      </nav>
    </header>
  );
}
