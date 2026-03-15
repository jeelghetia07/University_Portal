import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Layers3,
  UserCog,
  CalendarDays,
  FileText,
  Megaphone,
  Settings,
  Shield,
  X,
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Users', path: '/admin/users', icon: Users },
  { name: 'Courses', path: '/admin/courses', icon: BookOpen },
  { name: 'Sections', path: '/admin/sections', icon: Layers3 },
  { name: 'Faculty Allocation', path: '/admin/faculty-allocation', icon: UserCog },
  { name: 'Timetable', path: '/admin/timetable', icon: CalendarDays },
  { name: 'Examinations', path: '/admin/exams', icon: FileText },
  { name: 'Announcements', path: '/admin/announcements', icon: Megaphone },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
];

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-72 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 overflow-y-auto bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white border-r border-slate-800 shadow-2xl`}
      >
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Admin Portal</h1>
                <p className="text-xs text-slate-400">University Control Center</p>
              </div>
            </div>
            <button onClick={toggleSidebar} className="lg:hidden text-slate-400 hover:text-white transition-colors">
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
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-orange-500/20'
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

export default AdminSidebar;
