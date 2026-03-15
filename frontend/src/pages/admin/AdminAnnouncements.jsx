import { useMemo, useState } from 'react';
import { Megaphone, Plus, Pin, Archive, Pencil } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import AdminPageHeader from '../../components/admin/AdminPageHeader';

const emptyAnnouncement = {
  id: '',
  title: '',
  description: '',
  date: new Date().toISOString().split('T')[0],
  category: 'General',
  priority: 'medium',
  visibility: 'all',
  createdBy: 'ADM001',
  pinned: false,
  archived: false,
};

const AdminAnnouncements = () => {
  const { announcements, saveAnnouncement, toggleAnnouncementPin, toggleAnnouncementArchive } = useAdmin();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(emptyAnnouncement);
  const activeAnnouncements = useMemo(() => announcements.filter((item) => !item.archived), [announcements]);

  const openModal = (announcement = null) => {
    setFormData(announcement || { ...emptyAnnouncement, id: Date.now() });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData(emptyAnnouncement);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    saveAnnouncement(formData);
    closeModal();
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Announcement Management"
        description="Create and control announcements that appear in the student portal."
        action={
          <button onClick={() => openModal()} className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold transition-all">
            <Plus className="w-4 h-4" />
            <span>New Announcement</span>
          </button>
        }
      />

      <div className="space-y-4">
        {activeAnnouncements.map((announcement) => (
          <div key={announcement.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-xs font-semibold">{announcement.category}</span>
                  <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-300 text-xs font-semibold">{announcement.priority}</span>
                  <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300 text-xs font-semibold">{announcement.visibility}</span>
                  {announcement.pinned && <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-950/30 dark:text-orange-300 text-xs font-semibold">Pinned</span>}
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{announcement.title}</h2>
                <p className="text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">{announcement.description}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">{announcement.date}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => openModal(announcement)} className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"><Pencil className="w-4 h-4 text-slate-600 dark:text-slate-300" /></button>
                <button onClick={() => toggleAnnouncementPin(announcement.id)} className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"><Pin className="w-4 h-4 text-orange-500" /></button>
                <button onClick={() => toggleAnnouncementArchive(announcement.id)} className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"><Archive className="w-4 h-4 text-red-500" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl w-full max-w-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/30 flex items-center justify-center"><Megaphone className="w-5 h-5 text-orange-600 dark:text-orange-300" /></div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{formData.title ? 'Edit Announcement' : 'New Announcement'}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Admin-controlled announcement publishing.</p>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Title" className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" required />
              <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} placeholder="Description" className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" required />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" required />
                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                  {['Academic', 'Events', 'General'].map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
                <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} className="px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                  {['high', 'medium', 'low'].map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
                <select value={formData.visibility} onChange={(e) => setFormData({ ...formData, visibility: e.target.value })} className="px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                  {['all', 'students', 'faculty'].map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="flex-1 py-3 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">Cancel</button>
                <button type="submit" className="flex-1 py-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold transition-all">Save Announcement</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnnouncements;
