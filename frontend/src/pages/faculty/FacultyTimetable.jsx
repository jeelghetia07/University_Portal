import { CalendarDays } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import { useAdmin } from '../../context/AdminContext';
import { getFacultyContext } from './facultyUtils';

const FacultyTimetable = () => {
  const { users, courses, sections, facultyAssignments, timetableEntries } = useAdmin();
  const { facultyTimetable } = getFacultyContext(users, courses, sections, facultyAssignments, timetableEntries);

  const groupedByDay = facultyTimetable.reduce((acc, entry) => {
    const course = courses.find((item) => item.id === entry.courseId);
    const section = sections.find((item) => item.id === entry.sectionId);
    if (!acc[entry.day]) acc[entry.day] = [];
    acc[entry.day].push({ ...entry, course, section });
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Faculty Timetable"
        description="View the timetable entries assigned to this faculty account."
      />

      <div className="space-y-4">
        {Object.entries(groupedByDay).map(([day, entries]) => (
          <div key={day} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <CalendarDays className="w-5 h-5 text-emerald-500" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{day}</h2>
            </div>
            <div className="space-y-3">
              {entries.map((entry) => (
                <div key={entry.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{entry.course?.courseCode} | {entry.course?.courseName}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{entry.time} | Room {entry.room}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300 text-xs font-semibold">
                    Batch {entry.section?.batch} | Sem {entry.section?.semester} | Section {entry.section?.sectionName}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {facultyTimetable.length === 0 && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-10 text-center shadow-sm">
            <p className="text-slate-500 dark:text-slate-400">No timetable entries are assigned yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyTimetable;
