import { useState } from 'react';
import { CalendarDays, Pencil, Plus, Trash2 } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import AdminPageHeader from '../../components/admin/AdminPageHeader';

const emptyExam = {
  id: '',
  course: '',
  code: '',
  date: '',
  time: '',
  room: '',
};

const AdminExams = () => {
  const { examSchedule, saveExam, deleteExam } = useAdmin();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(emptyExam);

  const openModal = (exam = null) => {
    setFormData(exam || { ...emptyExam, id: `EXAM${Date.now()}` });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData(emptyExam);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    saveExam(formData);
    closeModal();
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Examination Management"
        description="Control the exam schedule that students see inside the examination portal."
        action={
          <button
            onClick={() => openModal()}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Exam</span>
          </button>
        }
      />

      <div className="space-y-4">
        {examSchedule.map((exam, index) => (
          <div key={exam.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-300 text-xs font-semibold">{exam.code}</span>
                  {index === 0 && (
                    <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300 text-xs font-semibold">Next Exam</span>
                  )}
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{exam.course}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{exam.date} | {exam.time} | {exam.room}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => openModal(exam)} className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                  <Pencil className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                </button>
                <button onClick={() => deleteExam(exam.id)} className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl w-full max-w-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/30 flex items-center justify-center">
                <CalendarDays className="w-5 h-5 text-red-600 dark:text-red-300" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{formData.course ? 'Edit Exam' : 'Add Exam'}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Admin updates here are reflected in the student exam page.</p>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input value={formData.course} onChange={(e) => setFormData({ ...formData, course: e.target.value })} placeholder="Course name" className="px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" required />
                <input value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} placeholder="Course code" className="px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" required />
                <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" required />
                <input value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} placeholder="9:00 AM - 12:00 PM" className="px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" required />
              </div>
              <input value={formData.room} onChange={(e) => setFormData({ ...formData, room: e.target.value })} placeholder="Exam room" className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" required />
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="flex-1 py-3 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">Cancel</button>
                <button type="submit" className="flex-1 py-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold transition-all">Save Exam</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminExams;
