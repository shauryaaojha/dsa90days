'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!session) return null;

  const links = [
    { href: '/', label: 'Dashboard' },
    { href: '/phase/1', label: 'Phase 1' },
    { href: '/phase/2', label: 'Phase 2' },
    { href: '/patterns', label: 'Patterns' },
    { href: '/resources', label: 'Resources' },
  ];

  // Get dynamic initials for the mockup avatar
  const userName = session.user?.name || 'User';
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div style={{ maxWidth: '1024px', margin: '0 auto', padding: '0 1.5rem' }}>
      <nav className="navbar-dock animate-fade-in">
        <Link href="/" className="nav-logo-dock" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ffdbce' }}>
            <img
              src="/logo.png"
              alt="DSA Tracker Logo"
              style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(3)', transformOrigin: 'center' }}
            />
          </div>
          <span className="logo-text-dock">DSA Tracker</span>
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
          <div className="avatar-dock">{initials}</div>
          <span style={{ fontWeight: 500 }} className="navbar-user-name-dock">{userName}</span>
          <button
            className="btn-logout-dock"
            onClick={() => signOut({ callbackUrl: '/login' })}
          >
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
}
