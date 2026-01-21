import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  Search,
  Menu,
  User,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { currentUser } from "../../data/mockData";

const Navbar = ({ toggleSidebar }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  const notifications = [
    {
      id: 1,
      title: "New assignment posted",
      time: "2 hours ago",
      unread: true,
    },
    {
      id: 2,
      title: "Exam schedule updated",
      time: "5 hours ago",
      unread: true,
    },
    { id: 3, title: "Fee payment reminder", time: "1 day ago", unread: false },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleLogout = () => {
    // Clear any stored data
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="px-4 lg:px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <button
              onClick={toggleSidebar}
              className="lg:hidden text-slate-600 hover:text-slate-900 transition-colors p-2 hover:bg-slate-100 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Search Bar */}
            <div className="hidden md:flex items-center bg-slate-100 rounded-lg px-4 py-2 w-80 group focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
              <Search className="w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <input
                type="text"
                placeholder="Search courses, faculty, events..."
                className="bg-transparent border-none outline-none ml-2 text-sm text-slate-700 placeholder-slate-400 w-full"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200 py-2 animate-fadeIn">
                  <div className="px-4 py-2 border-b border-slate-200">
                    <h3 className="text-sm font-semibold text-slate-900">
                      Notifications
                    </h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors ${
                          notif.unread ? "bg-indigo-50/50" : ""
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          {notif.unread && (
                            <div className="w-2 h-2 bg-indigo-600 rounded-full mt-1.5"></div>
                          )}
                          <div className="flex-1">
                            <p className="text-sm text-slate-900 font-medium">
                              {notif.title}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {notif.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2 border-t border-slate-200">
                    <Link
                      to="/announcements"
                      className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                      onClick={() => setShowNotifications(false)}
                    >
                      View all notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-3 hover:bg-slate-100 rounded-lg px-3 py-2 transition-all group"
              >
                <img
                  src={currentUser.profilePic}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full ring-2 ring-slate-200 group-hover:ring-indigo-500 transition-all"
                />
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-slate-900">
                    {currentUser.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {localStorage.getItem("userDepartment") ||
                      currentUser.department}
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
              </button>

              {/* Profile Menu Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-slate-200 py-2 animate-fadeIn">
                  <div className="px-4 py-3 border-b border-slate-200">
                    <p className="text-sm font-semibold text-slate-900">
                      {currentUser.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {currentUser.email}
                    </p>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/profile"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span>My Profile</span>
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </Link>
                  </div>

                  <div className="border-t border-slate-200 py-1">
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
