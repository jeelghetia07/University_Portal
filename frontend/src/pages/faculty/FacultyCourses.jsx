import { BookOpen } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import { useAdmin } from '../../context/AdminContext';
import { getFacultyContext } from './facultyUtils';

const FacultyCourses = () => {
  const { users, courses, sections, facultyAssignments, timetableEntries } = useAdmin();
  const { assignedCourseViews } = getFacultyContext(users, courses, sections, facultyAssignments, timetableEntries);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Assigned Courses"
        description="Courses and sections currently allocated to this faculty account."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {assignedCourseViews.map((item) => (
          <div key={item.allocationId} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300 text-xs font-semibold">
                    {item.course.courseCode}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-xs font-semibold">
                    {item.course.credits} credits
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{item.course.courseName}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{item.course.department}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-emerald-600 dark:text-emerald-300" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-5">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400">Batch</p>
                <p className="font-semibold text-slate-900 dark:text-slate-100 mt-1">{item.section.batch}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400">Semester</p>
                <p className="font-semibold text-slate-900 dark:text-slate-100 mt-1">{item.section.semester}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400">Section</p>
                <p className="font-semibold text-slate-900 dark:text-slate-100 mt-1">{item.section.sectionName}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FacultyCourses;
