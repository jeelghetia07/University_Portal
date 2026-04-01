import { Link } from 'react-router-dom';
import { BookOpen, FolderKanban, ClipboardList, CalendarDays, ArrowRight } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import { useAdmin } from '../../context/AdminContext';
import { getFacultyContext } from './facultyUtils';

const FacultyOverview = () => {
  const { users, courses, sections, facultyAssignments, timetableEntries, assignmentItems, materialLibrary } = useAdmin();
  const { facultyUser, assignedCourseViews, assignedCourseCodes, facultyTimetable } = getFacultyContext(
    users,
    courses,
    sections,
    facultyAssignments,
    timetableEntries
  );

  const materialCount = assignedCourseCodes.reduce((count, code) => count + (materialLibrary[code]?.length || 0), 0);
  const assignmentCount = assignmentItems.filter((assignment) => assignedCourseCodes.includes(assignment.courseCode)).length;

  const quickLinks = [
    { to: '/faculty/courses', label: 'View Assigned Courses' },
    { to: '/faculty/materials', label: 'Manage Materials' },
    { to: '/faculty/assignments', label: 'Manage Assignments' },
    { to: '/faculty/timetable', label: 'View Timetable' },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Faculty Overview"
        description={`Welcome${facultyUser?.name ? `, ${facultyUser.name}` : ''}. Manage the teaching work assigned to you.`}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-slate-500 dark:text-slate-400">Assigned course slots</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-2">{assignedCourseViews.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-slate-500 dark:text-slate-400">Unique courses</p>
          <p className="text-3xl font-bold text-emerald-600 mt-2">{assignedCourseCodes.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-slate-500 dark:text-slate-400">Materials managed</p>
          <p className="text-3xl font-bold text-cyan-600 mt-2">{materialCount}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-slate-500 dark:text-slate-400">Assignments active</p>
          <p className="text-3xl font-bold text-amber-600 mt-2">{assignmentCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Quick Actions</h2>
            <span className="text-sm text-slate-500 dark:text-slate-400">Faculty workflow shortcuts</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickLinks.map((link) => (
              <Link key={link.to} to={link.to} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all flex items-center justify-between">
                <span className="font-semibold text-slate-900 dark:text-slate-100">{link.label}</span>
                <ArrowRight className="w-5 h-5 text-slate-400" />
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-5">Teaching Snapshot</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900">
              <p className="text-sm text-emerald-700 dark:text-emerald-300">Timetable entries</p>
              <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-200 mt-1">{facultyTimetable.length}</p>
            </div>
            <div className="p-4 rounded-xl bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-900">
              <p className="text-sm text-cyan-700 dark:text-cyan-300">Sections handled</p>
              <p className="text-2xl font-bold text-cyan-900 dark:text-cyan-200 mt-1">{new Set(assignedCourseViews.map((item) => item.section.id)).size}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="w-5 h-5 text-emerald-500" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Assigned Course Summary</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assignedCourseViews.map((item) => (
            <div key={item.allocationId} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <p className="font-semibold text-slate-900 dark:text-slate-100">{item.course.courseCode} | {item.course.courseName}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Batch {item.section.batch} | Sem {item.section.semester} | Section {item.section.sectionName}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FacultyOverview;
