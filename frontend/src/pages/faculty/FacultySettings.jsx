import AdminPageHeader from '../../components/admin/AdminPageHeader';
import { useAdmin } from '../../context/AdminContext';
import { getFacultyContext } from './facultyUtils';

const FacultySettings = () => {
  const { users, courses, sections, facultyAssignments, timetableEntries } = useAdmin();
  const { facultyUser } = getFacultyContext(users, courses, sections, facultyAssignments, timetableEntries);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Faculty Settings"
        description="Faculty profile and teaching account information."
      />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">Name</p>
            <p className="font-semibold text-slate-900 dark:text-slate-100 mt-1">{facultyUser?.name || '-'}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">Email</p>
            <p className="font-semibold text-slate-900 dark:text-slate-100 mt-1">{facultyUser?.email || '-'}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">Department</p>
            <p className="font-semibold text-slate-900 dark:text-slate-100 mt-1">{facultyUser?.department || '-'}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">Role</p>
            <p className="font-semibold text-slate-900 dark:text-slate-100 mt-1">Faculty</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultySettings;
