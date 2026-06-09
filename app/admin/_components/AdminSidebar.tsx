'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const navLinks = [
  { href: '/admin', label: 'Dashboard', icon: 'ti-layout-dashboard', exact: true },
  { href: '/admin/users', label: 'Users', icon: 'ti-users', exact: false },
  { href: '/admin/analytics', label: 'Analytics', icon: 'ti-chart-bar', exact: false },
  { href: '/admin/quotes', label: 'Quotes', icon: 'ti-quote', exact: false },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <aside
      style={{
        width: '220px',
        flexShrink: 0,
        background: 'var(--surface-container-low)',
        borderRight: '1px solid var(--outline-variant)',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem 0',
        minHeight: '100vh',
        position: 'sticky',
        top: 0,
      }}
    >
      {/* Brand */}
      <div
        style={{
          padding: '0 1.25rem 1.25rem',
          marginBottom: '0.5rem',
          borderBottom: '1px solid var(--outline-variant)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '9px',
              background: 'var(--primary)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              fontFamily: 'serif',
              flexShrink: 0,
            }}
          >
            ॐ
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--on-surface)' }}>
              DSA Admin
            </div>
            <div style={{ fontSize: '11px', color: 'var(--outline)' }}>Control Panel</div>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav style={{ padding: '0.5rem 0.625rem', display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
        {navLinks.map((link) => {
          const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '0.6rem 0.875rem',
                borderRadius: '9px',
                fontSize: '13.5px',
                fontWeight: 600,
                color: isActive ? 'var(--primary)' : 'var(--on-surface-variant)',
                background: isActive ? 'var(--primary-container)' : 'transparent',
                textDecoration: 'none',
                transition: 'all var(--t-fast)',
              }}
            >
              <i className={`ti ${link.icon}`} style={{ fontSize: '15px', flexShrink: 0 }}></i>
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: '0 0.625rem', borderTop: '1px solid var(--outline-variant)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '0.6rem 0.875rem',
            width: '100%',
            borderRadius: '9px',
            fontSize: '13.5px',
            fontWeight: 600,
            color: 'var(--error)',
            background: 'transparent',
            cursor: 'pointer',
            border: 'none',
            transition: 'background var(--t-fast)',
          }}
        >
          <i className="ti ti-logout" style={{ fontSize: '15px' }}></i>
          Logout
        </button>
      </div>
    </aside>
  );
}
