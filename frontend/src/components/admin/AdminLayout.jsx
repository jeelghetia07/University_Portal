import { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <AdminSidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen((value) => !value)} />
      <div className="lg:ml-72 transition-all duration-300">
        <AdminNavbar toggleSidebar={() => setSidebarOpen((value) => !value)} />
        <main className="p-4 lg:p-6 min-h-[calc(100vh-64px)]">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
