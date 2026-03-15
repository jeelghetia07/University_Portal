import { useMemo, useState } from 'react';
import { Plus, Trash2, UserCog } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import AdminPageHeader from '../../components/admin/AdminPageHeader';

const emptyAssignment = {
  id: '',
  facultyId: '',
  courseId: '',
  sectionId: '',
};

const AdminFacultyAllocation = () => {
  const { users, courses, sections, facultyAssignments, saveFacultyAssignment, deleteFacultyAssignment } = useAdmin();
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState(emptyAssignment);

  const facultyUsers = useMemo(() => users.filter((user) => user.role === 'faculty'), [users]);

  const displayRows = facultyAssignments.map((assignment) => ({
    ...assignment,
    faculty: facultyUsers.find((user) => user.id === assignment.facultyId),
    course: courses.find((course) => course.id === assignment.courseId),
    section: sections.find((section) => section.id === assignment.sectionId),
  }));

  const openModal = () => {
    setFormData({ ...emptyAssignment, id: `ALLOC${Date.now()}` });
    setError('');
    setShowModal(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const result = saveFacultyAssignment({
      ...formData,
      courseId: Number(formData.courseId),
    });

    if (!result.success) {
      setError(result.message);
      return;
    }

    setShowModal(false);
    setFormData(emptyAssignment);
    setError('');
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Faculty Allocation"
        description="Assign faculty to course and section combinations for the academic structure."
        action={
          <button onClick={openModal} className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold transition-all">
            <Plus className="w-4 h-4" />
            <span>Allocate Faculty</span>
          </button>
        }
      />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm overflow-x-auto">
        <table className="w-full min-w-[760px]">
          <thead>
            <tr className="text-left text-sm text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
              <th className="py-3 pr-4">Faculty</th>
              <th className="py-3 pr-4">Course</th>
              <th className="py-3 pr-4">Section</th>
              <th className="py-3 pr-4">Department</th>
              <th className="py-3 pr-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {displayRows.map((row) => (
              <tr key={row.id} className="border-b border-slate-100 dark:border-slate-800">
                <td className="py-4 pr-4">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{row.faculty?.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{row.faculty?.email}</p>
                </td>
                <td className="py-4 pr-4 text-slate-700 dark:text-slate-300">{row.course?.courseCode} | {row.course?.courseName}</td>
                <td className="py-4 pr-4 text-slate-700 dark:text-slate-300">Batch {row.section?.batch} | Sem {row.section?.semester} | {row.section?.sectionName}</td>
                <td className="py-4 pr-4 text-slate-700 dark:text-slate-300">{row.section?.department}</td>
                <td className="py-4 pr-4">
                  <button onClick={() => deleteFacultyAssignment(row.id)} className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl w-full max-w-xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/30 flex items-center justify-center">
                <UserCog className="w-5 h-5 text-amber-600 dark:text-amber-300" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Allocate Faculty</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Prevent duplicates and keep ownership clean.</p>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 text-sm text-red-700 dark:text-red-300">{error}</div>}
              <select value={formData.facultyId} onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" required>
                <option value="">Select faculty</option>
                {facultyUsers.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}
              </select>
              <select value={formData.courseId} onChange={(e) => setFormData({ ...formData, courseId: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" required>
                <option value="">Select course</option>
                {courses.map((course) => <option key={course.id} value={course.id}>{course.courseCode} | {course.courseName}</option>)}
              </select>
              <select value={formData.sectionId} onChange={(e) => setFormData({ ...formData, sectionId: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" required>
                <option value="">Select section</option>
                {sections.map((section) => <option key={section.id} value={section.id}>{section.department} | Batch {section.batch} | Sem {section.semester} | {section.sectionName}</option>)}
              </select>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">Cancel</button>
                <button type="submit" className="flex-1 py-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold transition-all">Save Allocation</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFacultyAllocation;
