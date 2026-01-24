import { Link, useLocation } from "react-router-dom";
import {
  Home,
  User,
  BookOpen,
  Book,
  Calendar,
  Award,
  DollarSign,
  Bell,
  Library,
  FileText,
  Sparkles,
  HelpCircle,
  Settings,
  X,
} from "lucide-react";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "My Profile", path: "/profile", icon: User },
    {
      name: "Course Registration",
      path: "/course-registration",
      icon: BookOpen,
    },
    { name: "My Courses", path: "/my-courses", icon: Book },
    { name: "Timetable", path: "/timetable", icon: Calendar },
    { name: "Grades", path: "/grades", icon: Award },
    { name: "Fees", path: "/fees", icon: DollarSign },
    { name: "Announcements", path: "/announcements", icon: Bell },
    { name: "Library", path: "/library", icon: Library },
    { name: "Exams", path: "/exams", icon: FileText },
    { name: "Events", path: "/events", icon: Sparkles },
    { name: "Support", path: "/support", icon: HelpCircle },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-slate-900 to-slate-800 text-white w-64 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 overflow-y-auto shadow-2xl`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <Book className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  UniPortal
                </h1>
                <p className="text-xs text-slate-400">Student Dashboard</p>
              </div>
            </div>
            <button
              onClick={toggleSidebar}
              className="lg:hidden text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  active
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30"
                    : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    active ? "" : "group-hover:scale-110"
                  }`}
                />
                <span className="font-medium text-sm">{item.name}</span>

                {active && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Support Button at Bottom */}
        <div className="p-4 border-t border-slate-700/50">
          <Link
            to="/support"
            onClick={() => window.innerWidth < 1024 && toggleSidebar()}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-white rounded-lg hover:from-indigo-500/30 hover:to-purple-500/30 transition-all"
          >
            <HelpCircle className="w-5 h-5" />
            <span className="font-medium text-sm">Contact Support</span>
          </Link>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
