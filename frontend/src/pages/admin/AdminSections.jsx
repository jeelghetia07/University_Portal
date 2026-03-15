import { useState } from 'react';
import { Layers3, Pencil, Plus } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import AdminPageHeader from '../../components/admin/AdminPageHeader';

const emptySection = {
  id: '',
  department: 'Computer Science',
  batch: '2024',
  semester: 5,
  sectionName: 'A',
};

const AdminSections = () => {
  const { sections, saveSection } = useAdmin();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(emptySection);

  const openModal = (section = null) => {
    setFormData(section || { ...emptySection, id: `SEC${Date.now()}` });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData(emptySection);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    saveSection({ ...formData, semester: Number(formData.semester) });
    closeModal();
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Sections"
        description="Control batch-semester-section groupings used for allocations and timetable management."
        action={
          <button onClick={() => openModal()} className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold transition-all">
            <Plus className="w-4 h-4" />
            <span>Add Section</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {sections.map((section) => (
          <div key={section.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <Layers3 className="w-6 h-6 text-slate-700 dark:text-slate-200" />
              </div>
              <button onClick={() => openModal(section)} className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                <Pencil className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              </button>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{section.department}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Batch {section.batch} | Semester {section.semester}</p>
            <p className="mt-4 inline-flex px-3 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300 text-sm font-semibold">Section {section.sectionName}</p>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl w-full max-w-xl p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">{formData.id && formData.id !== '' ? 'Edit Section' : 'Add Section'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} placeholder="Department" className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" required />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input value={formData.batch} onChange={(e) => setFormData({ ...formData, batch: e.target.value })} placeholder="Batch" className="px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" required />
                <input value={formData.semester} onChange={(e) => setFormData({ ...formData, semester: e.target.value })} type="number" min="1" max="8" placeholder="Semester" className="px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" required />
                <input value={formData.sectionName} onChange={(e) => setFormData({ ...formData, sectionName: e.target.value })} placeholder="Section" className="px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" required />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="flex-1 py-3 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">Cancel</button>
                <button type="submit" className="flex-1 py-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold transition-all">Save Section</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSections;
