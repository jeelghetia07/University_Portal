import { useState } from 'react';
import { Settings as SettingsIcon, Bell, Moon, Sun, Info, Lock, X, Mail, Smartphone, Download } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Settings = () => {
  const { theme, setTheme, activeTheme } = useTheme();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    announcements: true,
    grades: true,
    fees: true
  });

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters!');
      return;
    }

    console.log('Changing password...');
    alert('Password changed successfully!');
    setShowPasswordModal(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleNotificationToggle = (key) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key]
    });
  };

  const handleDownloadData = () => {
    alert('Downloading your data... (Demo mode)');
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-900 rounded-2xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-slate-300">Manage your account preferences and settings</p>
      </div>

      {/* Account Settings */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
            <SettingsIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Account Settings</h2>
        </div>

        <button
          onClick={() => setShowPasswordModal(true)}
          className="w-full flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
        >
          <div className="flex items-center space-x-3">
            <Lock className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            <div className="text-left">
              <p className="font-medium text-slate-900 dark:text-slate-100">Change Password</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Update your account password</p>
            </div>
          </div>
          <span className="text-slate-400">&rarr;</span>
        </button>
      </div>

      {/* Appearance */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
            <Moon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Appearance</h2>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Theme</label>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handleThemeChange('light')}
              className={`flex flex-col items-center p-4 border-2 rounded-lg transition-all ${
                theme === 'light'
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <Sun className={`w-6 h-6 mb-2 ${theme === 'light' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
              <span className={`text-sm font-medium ${theme === 'light' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>
                Light
              </span>
            </button>

            <button
              onClick={() => handleThemeChange('dark')}
              className={`flex flex-col items-center p-4 border-2 rounded-lg transition-all ${
                theme === 'dark'
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <Moon className={`w-6 h-6 mb-2 ${theme === 'dark' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
              <span className={`text-sm font-medium ${theme === 'dark' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>
                Dark
              </span>
            </button>

            <button
              onClick={() => handleThemeChange('auto')}
              className={`flex flex-col items-center p-4 border-2 rounded-lg transition-all ${
                theme === 'auto'
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <SettingsIcon className={`w-6 h-6 mb-2 ${theme === 'auto' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
              <span className={`text-sm font-medium ${theme === 'auto' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>
                Auto
              </span>
            </button>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
            Active theme: <span className="capitalize font-semibold">{activeTheme}</span>
          </p>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
            <Bell className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Notifications</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100">Email Notifications</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Receive updates via email</p>
              </div>
            </div>
            <button
              onClick={() => handleNotificationToggle('email')}
              className={`relative w-14 h-8 rounded-full transition-all ${
                notifications.email ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                notifications.email ? 'translate-x-6' : ''
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <div className="flex items-center space-x-3">
              <Smartphone className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100">SMS Notifications</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Receive updates via SMS</p>
              </div>
            </div>
            <button
              onClick={() => handleNotificationToggle('sms')}
              className={`relative w-14 h-8 rounded-full transition-all ${
                notifications.sms ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                notifications.sms ? 'translate-x-6' : ''
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100">Push Notifications</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Browser notifications</p>
              </div>
            </div>
            <button
              onClick={() => handleNotificationToggle('push')}
              className={`relative w-14 h-8 rounded-full transition-all ${
                notifications.push ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                notifications.push ? 'translate-x-6' : ''
              }`} />
            </button>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Notification Preferences</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.announcements}
                  onChange={() => handleNotificationToggle('announcements')}
                  className="w-5 h-5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">Announcement Alerts</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.grades}
                  onChange={() => handleNotificationToggle('grades')}
                  className="w-5 h-5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">Grade Updates</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.fees}
                  onChange={() => handleNotificationToggle('fees')}
                  className="w-5 h-5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">Fee Reminders</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <Download className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Data Management</h2>
        </div>

        <button
          onClick={handleDownloadData}
          className="w-full flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
        >
          <div className="flex items-center space-x-3">
            <Download className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            <div className="text-left">
              <p className="font-medium text-slate-900 dark:text-slate-100">Download My Data</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Get a copy of your academic information</p>
            </div>
          </div>
          <span className="text-slate-400">&rarr;</span>
        </button>
      </div>

      {/* About */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
            <Info className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">About</h2>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3">
            <span className="text-sm text-slate-600 dark:text-slate-400">App Version</span>
            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">1.0.0</span>
          </div>
          <button className="w-full text-left p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all">
            <span className="text-sm text-slate-700 dark:text-slate-300">Terms & Conditions</span>
          </button>
          <button className="w-full text-left p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all">
            <span className="text-sm text-slate-700 dark:text-slate-300">Privacy Policy</span>
          </button>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Change Password</h2>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                    placeholder="Min. 6 characters"
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    placeholder="Re-enter new password"
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 py-3 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
