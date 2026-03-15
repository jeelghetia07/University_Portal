import { useMemo, useState } from 'react';
import { CalendarDays, Pencil, Plus, Trash2 } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import AdminPageHeader from '../../components/admin/AdminPageHeader';

const emptyEntry = {
  id: '',
  sectionId: '',
  courseId: '',
  facultyId: '',
  day: 'Monday',
  time: '',
  room: '',
};

const AdminTimetable = () => {
  const { timetableEntries, sections, courses, users, saveTimetableEntry, deleteTimetableEntry } = useAdmin();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(emptyEntry);

  const facultyUsers = useMemo(() => users.filter((user) => user.role === 'faculty'), [users]);

  const mappedEntries = timetableEntries.map((entry) => ({
    ...entry,
    section: sections.find((section) => section.id === entry.sectionId),
    course: courses.find((course) => course.id === entry.courseId),
    faculty: facultyUsers.find((faculty) => faculty.id === entry.facultyId),
  }));

  const openModal = (entry = null) => {
    setFormData(entry || { ...emptyEntry, id: `TT${Date.now()}` });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData(emptyEntry);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    saveTimetableEntry({ ...formData, courseId: Number(formData.courseId) });
    closeModal();
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Timetable Management"
        description="Edit section-wise timetable slots that later map into the student timetable view."
        action={
          <button onClick={() => openModal()} className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold transition-all">
            <Plus className="w-4 h-4" />
            <span>Add Slot</span>
          </button>
        }
      />

      <div className="space-y-4">
        {mappedEntries.map((entry) => (
          <div key={entry.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-300 text-xs font-semibold">{entry.day}</span>
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-xs font-semibold">{entry.time}</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{entry.course?.courseCode} | {entry.course?.courseName}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{entry.section?.department} | Batch {entry.section?.batch} | Sem {entry.section?.semester} | Section {entry.section?.sectionName}</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">{entry.faculty?.name} | Room {entry.room}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => openModal(entry)} className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"><Pencil className="w-4 h-4 text-slate-600 dark:text-slate-300" /></button>
              <button onClick={() => deleteTimetableEntry(entry.id)} className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"><Trash2 className="w-4 h-4 text-red-500" /></button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl w-full max-w-xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/30 flex items-center justify-center"><CalendarDays className="w-5 h-5 text-indigo-600 dark:text-indigo-300" /></div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{formData.time ? 'Edit Slot' : 'Add Slot'}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Create a timetable entry for a section.</p>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <select value={formData.sectionId} onChange={(e) => setFormData({ ...formData, sectionId: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" required>
                <option value="">Select section</option>
                {sections.map((section) => <option key={section.id} value={section.id}>{section.department} | Batch {section.batch} | Sem {section.semester} | {section.sectionName}</option>)}
              </select>
              <select value={formData.courseId} onChange={(e) => setFormData({ ...formData, courseId: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" required>
                <option value="">Select course</option>
                {courses.map((course) => <option key={course.id} value={course.id}>{course.courseCode} | {course.courseName}</option>)}
              </select>
              <select value={formData.facultyId} onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" required>
                <option value="">Select faculty</option>
                {facultyUsers.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}
              </select>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select value={formData.day} onChange={(e) => setFormData({ ...formData, day: e.target.value })} className="px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => <option key={day} value={day}>{day}</option>)}
                </select>
                <input value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} placeholder="9:00 AM - 10:00 AM" className="px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" required />
                <input value={formData.room} onChange={(e) => setFormData({ ...formData, room: e.target.value })} placeholder="Room" className="px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" required />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="flex-1 py-3 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">Cancel</button>
                <button type="submit" className="flex-1 py-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold transition-all">Save Slot</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTimetable;
