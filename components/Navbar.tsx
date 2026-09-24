'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

// The admin console has its own chrome, and track selection is a first-run
// flow that should be finished before anything else is reachable.
const HIDDEN_PREFIXES = ['/admin', '/track-select'];

interface NavItem {
  href: string;
  label: string;
  icon: string;
  hint?: string;
}

interface NavGroup {
  key: string;
  label: string;
  icon: string;
  items: NavItem[];
}

const GROUPS: NavGroup[] = [
  {
    key: 'learn',
    label: 'Learn',
    icon: 'book',
    items: [
      { href: '/day0to1', label: 'Phase 0', icon: 'seedling', hint: 'Language foundation' },
      { href: '/phase/1', label: 'Phase 1', icon: 'route', hint: 'DSA sprint, days 1–60' },
      { href: '/phase/2', label: 'Phase 2', icon: 'rocket', hint: 'Days 61–90' },
      { href: '/patterns', label: 'Patterns', icon: 'map-2', hint: 'Cheatsheets' },
      { href: '/resources', label: 'Resources', icon: 'books', hint: 'Playlists and sheets' },
    ],
  },
];

/**
 * Student navigation: Dashboard, the Learn group and an avatar menu. On
 * desktop a group opens on hover or click; under 900px the whole thing
 * becomes a single panel behind a menu button — before this the links were
 * hidden on phones with no way to reach them.
 */
export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  // A menu is only open on the page it was opened on, so navigating closes
  // it without an effect having to reset state.
  const [menu, setMenu] = useState<{ key: string; path: string } | null>(null); // key: group, 'user' or 'mobile'
  const open = menu && menu.path === pathname ? menu.key : null;
  const setOpen = (next: string | null | ((current: string | null) => string | null)) => {
    const key = typeof next === 'function' ? next(open) : next;
    setMenu(key ? { key, path: pathname } : null);
  };
  const rootRef = useRef<HTMLElement>(null);

  // Close on outside click and Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!session || HIDDEN_PREFIXES.some((p) => pathname.startsWith(p))) return null;

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`));
  const groupActive = (g: NavGroup) => g.items.some((i) => isActive(i.href));

  const userName = session.user?.name || 'User';
  const initials = userName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const renderItem = (item: NavItem) => (
    <Link key={item.href} href={item.href} className={`nav-menu-item ${isActive(item.href) ? 'active' : ''}`}>
      <i className={`ti ti-${item.icon}`} />
      <span>
        {item.label}
        {item.hint && <small>{item.hint}</small>}
      </span>
    </Link>
  );

  return (
    <header className="navbar-wrap" ref={rootRef}>
      <nav className="navbar-dock animate-fade-in" aria-label="Main">
        <Link href="/" className="nav-logo-dock" style={{ textDecoration: 'none' }}>
          <div className="logo-icon-dock logo-om-dock">
            ॐ
          </div>
          <span className="logo-text-dock">DSA <span>Tracker</span></span>
        </Link>

        {/* Desktop */}
        <div className="nav-links-dock">
          <Link href="/" className={`nav-link-dock ${isActive('/') ? 'active' : ''}`}>
            Dashboard
          </Link>
          {GROUPS.map((g) => (
            <div
              key={g.key}
              className={`nav-group ${open === g.key ? 'open' : ''}`}
              onMouseEnter={() => setOpen(g.key)}
              onMouseLeave={() => setOpen((o) => (o === g.key ? null : o))}
            >
              <button
                type="button"
                className={`nav-link-dock nav-group-btn ${groupActive(g) ? 'active' : ''}`}
                aria-haspopup="menu"
                aria-expanded={open === g.key}
                onClick={() => setOpen((o) => (o === g.key ? null : g.key))}
              >
                {g.label} <i className="ti ti-chevron-down" />
              </button>
              <div className="nav-menu" role="menu">
                {g.items.map(renderItem)}
              </div>
            </div>
          ))}
        </div>

        <div className="nav-user-dock">
          <div
            className={`nav-group nav-user-group ${open === 'user' ? 'open' : ''}`}
            onMouseEnter={() => setOpen('user')}
            onMouseLeave={() => setOpen((o) => (o === 'user' ? null : o))}
          >
            <button
              type="button"
              className="avatar-dock"
              aria-haspopup="menu"
              aria-expanded={open === 'user'}
              aria-label="Account menu"
              onClick={() => setOpen((o) => (o === 'user' ? null : 'user'))}
            >
              {initials}
            </button>
            <div className="nav-menu nav-menu-right" role="menu">
              <div className="nav-menu-who">
                <strong>{userName}</strong>
                <small>{session.user?.email}</small>
              </div>
              <Link href="/profile" className={`nav-menu-item ${isActive('/profile') ? 'active' : ''}`}>
                <i className="ti ti-user-circle" />
                <span>
                  My profile<small>Stats, details, password</small>
                </span>
              </Link>
              <button type="button" className="nav-menu-item" onClick={() => signOut({ callbackUrl: '/login' })}>
                <i className="ti ti-logout" />
                <span>Sign out</span>
              </button>
            </div>
          </div>
          <button
            type="button"
            className="nav-burger"
            aria-label={open === 'mobile' ? 'Close menu' : 'Open menu'}
            aria-expanded={open === 'mobile'}
            onClick={() => setOpen((o) => (o === 'mobile' ? null : 'mobile'))}
          >
            <i className={`ti ${open === 'mobile' ? 'ti-x' : 'ti-menu-2'}`} />
          </button>
        </div>
      </nav>

      {/* Mobile panel */}
      {open === 'mobile' && (
        <div className="nav-mobile animate-fade-in">
          <Link href="/" className={`nav-menu-item ${isActive('/') ? 'active' : ''}`}>
            <i className="ti ti-layout-dashboard" />
            <span>Dashboard</span>
          </Link>
          {GROUPS.map((g) => (
            <div key={g.key} className="nav-mobile-group">
              <div className="nav-mobile-title">
                <i className={`ti ti-${g.icon}`} /> {g.label}
              </div>
              {g.items.map(renderItem)}
            </div>
          ))}
          <div className="nav-mobile-group">
            <Link href="/profile" className={`nav-menu-item ${isActive('/profile') ? 'active' : ''}`}>
              <i className="ti ti-user-circle" />
              <span>My profile</span>
            </Link>
            <button type="button" className="nav-menu-item" onClick={() => signOut({ callbackUrl: '/login' })}>
              <i className="ti ti-logout" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
