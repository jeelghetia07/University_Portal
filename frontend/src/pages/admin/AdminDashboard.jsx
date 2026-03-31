import { Link } from 'react-router-dom';
import { BookOpen, CalendarDays, Megaphone, Users, UserCog, Layers3, ArrowRight, AlertCircle } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import AdminPageHeader from '../../components/admin/AdminPageHeader';

const AdminDashboard = () => {
  const { users, courses, sections, facultyAssignments, timetableEntries, announcements, materialStats, supportTickets, feeRecords } = useAdmin();

  const stats = [
    { label: 'Students', value: users.filter((user) => user.role === 'student').length, icon: Users, tone: 'indigo' },
    { label: 'Faculty', value: users.filter((user) => user.role === 'faculty').length, icon: UserCog, tone: 'emerald' },
    { label: 'Courses', value: courses.length, icon: BookOpen, tone: 'amber' },
    { label: 'Sections', value: sections.length, icon: Layers3, tone: 'rose' },
  ];

  const quickLinks = [
    { to: '/admin/users', label: 'Manage Users' },
    { to: '/admin/faculty-allocation', label: 'Allocate Faculty' },
    { to: '/admin/timetable', label: 'Update Timetable' },
    { to: '/admin/fees', label: 'Review Fees' },
    { to: '/admin/support', label: 'Handle Support' },
    { to: '/admin/announcements', label: 'Post Announcement' },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Admin Dashboard"
        description="Overview of the academic structure and key admin actions for the current prototype."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-slate-700 dark:text-slate-200" />
                </div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Prototype</span>
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{item.value}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{item.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Quick Actions</h2>
            <span className="text-sm text-slate-500 dark:text-slate-400">Move faster through admin workflows</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all flex items-center justify-between"
              >
                <span className="font-semibold text-slate-900 dark:text-slate-100">{link.label}</span>
                <ArrowRight className="w-5 h-5 text-slate-400" />
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-5">Pending Focus</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900">
              <p className="text-sm text-amber-700 dark:text-amber-300">Unallocated course slots</p>
              <p className="text-2xl font-bold text-amber-900 dark:text-amber-200 mt-1">{Math.max(courses.length - facultyAssignments.length, 0)}</p>
            </div>
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900">
              <p className="text-sm text-blue-700 dark:text-blue-300">Timetable entries</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-200 mt-1">{timetableEntries.length}</p>
            </div>
            <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900">
              <p className="text-sm text-indigo-700 dark:text-indigo-300">Pinned announcements</p>
              <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-200 mt-1">{announcements.filter((item) => item.pinned && !item.archived).length}</p>
            </div>
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900">
              <p className="text-sm text-rose-700 dark:text-rose-300">Open support tickets</p>
              <p className="text-2xl font-bold text-rose-900 dark:text-rose-200 mt-1">{supportTickets.filter((ticket) => ticket.status === 'Open').length}</p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900">
              <p className="text-sm text-emerald-700 dark:text-emerald-300">Total fee pending</p>
              <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-200 mt-1">Rs {feeRecords.reduce((sum, record) => sum + Number(record.pendingAmount || 0), 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Megaphone className="w-5 h-5 text-orange-500" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Recent Announcements</h2>
          </div>
          <div className="space-y-3">
            {announcements.slice(0, 3).map((announcement) => (
              <div key={announcement.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{announcement.title}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{announcement.category} | {announcement.visibility}</p>
                  </div>
                  {announcement.pinned && <span className="text-xs font-semibold px-2 py-1 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-950/30 dark:text-orange-300">Pinned</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Oversight Snapshot</h2>
          </div>
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-400">Assignments awaiting review</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">1 module</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-400">Course material modules</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{Object.keys(materialStats).length}</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-400">Upcoming timetable operations</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{sections.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
