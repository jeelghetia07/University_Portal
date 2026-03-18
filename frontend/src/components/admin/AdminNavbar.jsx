import { useState } from 'react';
import { Menu, Bell, LogOut, ChevronDown, Settings } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { AvatarWithFallback } from '../common/Avatar';
import { clearAuthSession, getAuthValue } from '../../utils/authStorage';

const AdminNavbar = ({ toggleSidebar }) => {
  const [openProfile, setOpenProfile] = useState(false);
  const { setRole } = useTheme();
  const navigate = useNavigate();

  const adminName = getAuthValue('userName') || 'Admin';
  const adminEmail = getAuthValue('userEmail') || 'admin@university.edu';
  const adminAvatar = getAuthValue('userProfilePic') || '';

  const handleLogout = () => {
    clearAuthSession();
    setRole('student');
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="px-4 lg:px-6 py-3 flex items-center justify-between">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="hidden lg:block">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Administrative Workspace</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage structure, people, and oversight from one place.</p>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <div className="relative">
            <button
              onClick={() => setOpenProfile((value) => !value)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              <AvatarWithFallback
                name={adminName}
                role="admin"
                imageUrl={adminAvatar}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{adminName}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Administrator</p>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {openProfile && (
              <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl py-2">
                <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{adminName}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{adminEmail}</p>
                </div>
                <Link
                  to="/admin/settings"
                  onClick={() => setOpenProfile(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <Settings className="w-4 h-4" />
                  <span>Admin Settings</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
