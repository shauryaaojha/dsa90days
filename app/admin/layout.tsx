import AdminSidebar from './_components/AdminSidebar';

export const metadata = {
  title: 'Admin — DSA Tracker',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--background)' }}>
      <AdminSidebar />
      <main
        style={{
          flex: 1,
          padding: '2rem 2.5rem',
          overflowY: 'auto',
          minWidth: 0,
        }}
      >
        {children}
      </main>
    </div>
  );
}
