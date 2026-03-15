import { useState } from 'react';
import { Plus, Pencil, BookOpen } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import AdminPageHeader from '../../components/admin/AdminPageHeader';

const emptyCourse = {
  id: null,
  courseCode: '',
  courseName: '',
  credits: 3,
  seats: 60,
  department: 'Computer Science',
  semester: 5,
};

const AdminCourses = () => {
  const { courses, saveCourse } = useAdmin();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(emptyCourse);

  const openModal = (course = null) => {
    setFormData(course || { ...emptyCourse, id: Date.now() });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData(emptyCourse);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    saveCourse({
      ...formData,
      credits: Number(formData.credits),
      seats: Number(formData.seats),
      semester: Number(formData.semester),
    });
    closeModal();
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Courses"
        description="Manage course definitions that later feed student and faculty workflows."
        action={
          <button onClick={() => openModal()} className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold transition-all">
            <Plus className="w-4 h-4" />
            <span>Add Course</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {courses.map((course) => (
          <div key={course.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-300 text-xs font-semibold">{course.courseCode}</span>
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-xs font-semibold">{course.credits} credits</span>
                  <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300 text-xs font-semibold">{course.seats} seats</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{course.courseName}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{course.department} | Semester {course.semester}</p>
              </div>
              <button onClick={() => openModal(course)} className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                <Pencil className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl w-full max-w-xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/30 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{formData.id && formData.courseCode ? 'Edit Course' : 'Add Course'}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Keep course structure aligned with the future backend model.</p>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input value={formData.courseCode} onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })} placeholder="Course code" className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" required />
              <input value={formData.courseName} onChange={(e) => setFormData({ ...formData, courseName: e.target.value })} placeholder="Course name" className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" required />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input value={formData.credits} onChange={(e) => setFormData({ ...formData, credits: e.target.value })} type="number" min="1" max="6" placeholder="Credits" className="px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" required />
                <input value={formData.seats} onChange={(e) => setFormData({ ...formData, seats: e.target.value })} type="number" min="1" placeholder="Seats" className="px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" required />
                <input value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} placeholder="Department" className="px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" required />
                <input value={formData.semester} onChange={(e) => setFormData({ ...formData, semester: e.target.value })} type="number" min="1" max="8" placeholder="Semester" className="px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" required />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="flex-1 py-3 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">Cancel</button>
                <button type="submit" className="flex-1 py-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold transition-all">Save Course</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCourses;
