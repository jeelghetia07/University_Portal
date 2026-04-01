import { useState } from 'react';
import FacultySidebar from './FacultySidebar';
import FacultyNavbar from './FacultyNavbar';

const FacultyLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <FacultySidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen((value) => !value)} />
      <div className="lg:ml-72 transition-all duration-300">
        <FacultyNavbar toggleSidebar={() => setSidebarOpen((value) => !value)} />
        <main className="p-4 lg:p-6 min-h-[calc(100vh-64px)]">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default FacultyLayout;
