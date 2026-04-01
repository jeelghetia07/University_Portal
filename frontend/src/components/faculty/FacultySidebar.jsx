import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  FolderKanban,
  ClipboardList,
  CalendarDays,
  Settings,
  GraduationCap,
  X,
} from 'lucide-react';

const menuItems = [
  { name: 'Overview', path: '/faculty/overview', icon: LayoutDashboard },
  { name: 'Assigned Courses', path: '/faculty/courses', icon: BookOpen },
  { name: 'Materials', path: '/faculty/materials', icon: FolderKanban },
  { name: 'Assignments', path: '/faculty/assignments', icon: ClipboardList },
  { name: 'Timetable', path: '/faculty/timetable', icon: CalendarDays },
  { name: 'Settings', path: '/faculty/settings', icon: Settings },
];

const FacultySidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={toggleSidebar} />}

      <aside
        className={`fixed top-0 left-0 h-full w-72 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 overflow-y-auto bg-gradient-to-b from-emerald-950 via-teal-900 to-slate-950 text-white border-r border-emerald-900 shadow-2xl`}
      >
        <div className="p-6 border-b border-emerald-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Faculty Portal</h1>
                <p className="text-xs text-emerald-200/70">Teaching Workspace</p>
              </div>
            </div>
            <button onClick={toggleSidebar} className="lg:hidden text-slate-300 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  active
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default FacultySidebar;
