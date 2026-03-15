import { Shield, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import AdminPageHeader from '../../components/admin/AdminPageHeader';

const AdminSettings = () => {
  const { theme, setTheme, activeTheme } = useTheme();

  const themeOptions = [
    { key: 'light', icon: Sun, label: 'Light' },
    { key: 'dark', icon: Moon, label: 'Dark' },
    { key: 'auto', icon: Shield, label: 'Auto' },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Admin Settings"
        description="Basic prototype settings for the admin portal and its visual mode."
      />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">Appearance</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {themeOptions.map((option) => {
            const Icon = option.icon;
            const active = theme === option.key;
            return (
              <button
                key={option.key}
                onClick={() => setTheme(option.key)}
                className={`p-5 rounded-xl border-2 transition-all text-left ${
                  active
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <Icon className={`w-6 h-6 mb-3 ${active ? 'text-amber-600 dark:text-amber-300' : 'text-slate-400'}`} />
                <p className={`font-semibold ${active ? 'text-amber-700 dark:text-amber-300' : 'text-slate-900 dark:text-slate-100'}`}>{option.label}</p>
              </button>
            );
          })}
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">Active theme: {activeTheme}</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">Prototype Notes</h2>
        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
          <p>This admin portal is frontend-only mock CRUD for now.</p>
          <p>Later we will connect users, allocations, timetable, and announcements to MERN backend APIs.</p>
          <p>Faculty portal and real RBAC auth will be added after the admin structure is stable.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
