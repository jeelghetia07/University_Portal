import { useMemo, useState } from 'react';
import { FolderKanban, Plus, Trash2 } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import { useAdmin } from '../../context/AdminContext';
import { getFacultyContext } from './facultyUtils';

const emptyMaterial = {
  id: '',
  title: '',
  type: 'pdf',
  uploadDate: new Date().toISOString().split('T')[0],
  size: '1.0 MB',
  description: '',
};

const FacultyMaterials = () => {
  const { users, courses, sections, facultyAssignments, timetableEntries, materialLibrary, saveMaterial, deleteMaterial } = useAdmin();
  const { facultyUser, assignedCourseViews, assignedCourseCodes } = getFacultyContext(users, courses, sections, facultyAssignments, timetableEntries);
  const [selectedCourseCode, setSelectedCourseCode] = useState(assignedCourseCodes[0] || '');
  const [formData, setFormData] = useState(emptyMaterial);

  const selectedCourse = useMemo(
    () => assignedCourseViews.find((item) => item.course.courseCode === selectedCourseCode)?.course,
    [assignedCourseViews, selectedCourseCode]
  );

  const materials = materialLibrary[selectedCourseCode] || [];

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!selectedCourseCode) return;

    saveMaterial(selectedCourseCode, {
      ...formData,
      id: formData.id || `MAT${Date.now()}`,
      uploadedBy: facultyUser?.name || 'Faculty',
    });

    setFormData(emptyMaterial);
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Materials Management"
        description="Upload and manage study materials for the courses assigned to you."
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">Add Material</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <select value={selectedCourseCode} onChange={(e) => setSelectedCourseCode(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" required>
              {assignedCourseCodes.map((code) => (
                <option key={code} value={code}>{code}</option>
              ))}
            </select>
            <input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Material title" className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" required />
            <input value={formData.size} onChange={(e) => setFormData({ ...formData, size: e.target.value })} placeholder="File size e.g. 2.4 MB" className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" required />
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows="4" placeholder="Short description" className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" required />
            <button type="submit" className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-all">
              <Plus className="w-4 h-4" />
              <span>Save Material</span>
            </button>
          </form>
        </div>

        <div className="xl:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{selectedCourse?.courseName || 'Course Materials'}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{selectedCourseCode || 'Select a course'} | Faculty-managed resources</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {assignedCourseCodes.map((code) => (
                <button key={code} onClick={() => setSelectedCourseCode(code)} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${selectedCourseCode === code ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>
                  {code}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {materials.map((material) => (
              <div key={material.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{material.title}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{material.description}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{material.uploadDate} | {material.size} | Uploaded by {material.uploadedBy}</p>
                </div>
                <button onClick={() => deleteMaterial(selectedCourseCode, material.id)} className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            ))}

            {materials.length === 0 && (
              <div className="p-10 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center">
                <FolderKanban className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <p className="text-slate-500 dark:text-slate-400">No materials have been added for this course yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyMaterials;
