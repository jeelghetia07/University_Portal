import { useMemo, useState } from 'react';
import { Building2, Layers3, Pencil, Plus, Trash2, Users } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import AdminPageHeader from '../../components/admin/AdminPageHeader';

const emptySection = {
  id: '',
  department: 'Computer Science',
  batch: '2024',
  semester: 5,
  sectionName: 'A',
  totalSeats: 100,
  filledSeats: 0,
};

const AdminSections = () => {
  const { sections, saveSection, deleteSection } = useAdmin();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(emptySection);
  const [openBranch, setOpenBranch] = useState(() => sections[0]?.department || '');
  const [branchFilters, setBranchFilters] = useState({});
  const [formError, setFormError] = useState('');

  const branches = useMemo(() => {
    const grouped = sections.reduce((accumulator, section) => {
      if (!accumulator[section.department]) {
        accumulator[section.department] = [];
      }
      accumulator[section.department].push(section);
      return accumulator;
    }, {});

    return Object.entries(grouped)
      .map(([department, branchSections]) => {
        const currentSemester = Math.max(
          ...branchSections.map((section) => Number(section.semester || 0))
        );
        const totalSeats = branchSections.reduce(
          (sum, section) => sum + Number(section.totalSeats || 0),
          0
        );
        const filledSeats = branchSections.reduce(
          (sum, section) => sum + Number(section.filledSeats || 0),
          0
        );
        const batches = [...new Set(branchSections.map((section) => section.batch))].sort();

        return {
          department,
          currentSemester,
          sections: branchSections.sort(
            (a, b) =>
              Number(a.batch) - Number(b.batch) ||
              Number(a.semester) - Number(b.semester) ||
              a.sectionName.localeCompare(b.sectionName)
          ),
          totalSeats,
          filledSeats,
          batches,
        };
      })
      .sort((a, b) => a.department.localeCompare(b.department));
  }, [sections]);

  const getBranchFilterState = (department) =>
    branchFilters[department] || {
      search: '',
      batch: 'all',
    };

  const openModal = (section = null) => {
    setFormError('');
    setFormData(section || { ...emptySection, id: `SEC${Date.now()}` });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData(emptySection);
    setFormError('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (Number(formData.filledSeats) > Number(formData.totalSeats)) {
      setFormError('Filled seats cannot be greater than total seats.');
      return;
    }

    const duplicateSection = sections.find(
      (section) =>
        section.id !== formData.id &&
        section.department.trim().toLowerCase() === formData.department.trim().toLowerCase() &&
        section.batch.trim() === formData.batch.trim() &&
        Number(section.semester) === Number(formData.semester) &&
        section.sectionName.trim().toLowerCase() === formData.sectionName.trim().toLowerCase()
    );

    if (duplicateSection) {
      setFormError(
        `Section ${formData.sectionName.toUpperCase()} already exists in ${formData.department}, Batch ${formData.batch}, Semester ${formData.semester}. Edit the existing section or use a different section name.`
      );
      return;
    }

    saveSection({
      ...formData,
      department: formData.department.trim(),
      batch: formData.batch.trim(),
      sectionName: formData.sectionName.trim().toUpperCase(),
      semester: Number(formData.semester),
      totalSeats: Number(formData.totalSeats),
      filledSeats: Number(formData.filledSeats),
    });
    setOpenBranch(formData.department);
    closeModal();
  };

  const handleDeleteSection = (section) => {
    const confirmed = window.confirm(
      `Delete ${section.department} Batch ${section.batch} Section ${section.sectionName}?`
    );
    if (!confirmed) return;
    deleteSection(section.id);
  };

  const handleDeleteBatch = (department, batch, batchSections) => {
    const confirmed = window.confirm(
      `Delete ${department} Batch ${batch} and all its sections?`
    );
    if (!confirmed) return;
    batchSections.forEach((section) => deleteSection(section.id));
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

      <div className="space-y-5">
        {branches.map((branch) => {
          const branchFilter = getBranchFilterState(branch.department);
          const batchOptions = [...new Set(branch.sections.map((section) => section.batch))].sort();
          const branchFilteredSections = branch.sections.filter((section) => {
            const searchTerm = branchFilter.search.trim().toLowerCase();
            const matchesSearch =
              !searchTerm ||
              section.sectionName.toLowerCase().includes(searchTerm) ||
              section.id.toLowerCase().includes(searchTerm) ||
              section.batch.toLowerCase().includes(searchTerm);
            const matchesBatch =
              branchFilter.batch === 'all' || section.batch === branchFilter.batch;
            return matchesSearch && matchesBatch;
          });

          return (
            <div
              key={branch.department}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden"
            >
              <button
                type="button"
                onClick={() =>
                  setOpenBranch((current) => (current === branch.department ? '' : branch.department))
                }
                className="w-full px-6 py-5 flex items-start justify-between gap-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/30 flex items-center justify-center shrink-0">
                    <Building2 className="w-6 h-6 text-indigo-700 dark:text-indigo-300" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {branch.department}
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Current semester {branch.currentSemester} | {branch.batches.length} batches | {branch.sections.length} sections
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap justify-end gap-2">
                  <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
                    Total seats {branch.totalSeats}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                    Filled {branch.filledSeats}
                  </span>
                </div>
              </button>

              {openBranch === branch.department && (
                <div className="px-6 pb-6 border-t border-slate-200 dark:border-slate-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <input
                      value={branchFilter.search}
                      onChange={(e) =>
                        setBranchFilters((current) => ({
                          ...current,
                          [branch.department]: {
                            ...getBranchFilterState(branch.department),
                            search: e.target.value,
                          },
                        }))
                      }
                      placeholder="Search batches, sections, or IDs"
                      className="px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />

                    <select
                      value={branchFilter.batch}
                      onChange={(e) =>
                        setBranchFilters((current) => ({
                          ...current,
                          [branch.department]: {
                            ...getBranchFilterState(branch.department),
                            batch: e.target.value,
                          },
                        }))
                      }
                      className="px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    >
                      <option value="all">All batches</option>
                      {batchOptions.map((batch) => (
                        <option key={batch} value={batch}>
                          Batch {batch}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Showing {branchFilteredSections.length} of {branch.sections.length} sections in{' '}
                      {branch.department}
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        setBranchFilters((current) => ({
                          ...current,
                          [branch.department]: {
                            search: '',
                            batch: 'all',
                          },
                        }))
                      }
                      className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                    >
                      Clear Branch Filters
                    </button>
                  </div>

                  <div className="mt-6 space-y-4">
                    {(() => {
                      const groupedBatches = branchFilteredSections.reduce((accumulator, section) => {
                        if (!accumulator[section.batch]) {
                          accumulator[section.batch] = [];
                        }
                        accumulator[section.batch].push(section);
                        return accumulator;
                      }, {});

                      const branchBatches = Object.entries(groupedBatches)
                        .map(([batch, batchSections]) => {
                          const currentSemester = Math.max(
                            ...batchSections.map((section) => Number(section.semester || 0))
                          );
                          const totalSeats = batchSections.reduce(
                            (sum, section) => sum + Number(section.totalSeats || 0),
                            0
                          );
                          const filledSeats = batchSections.reduce(
                            (sum, section) => sum + Number(section.filledSeats || 0),
                            0
                          );

                          return {
                            batch,
                            currentSemester,
                            totalSeats,
                            filledSeats,
                            sections: batchSections.sort(
                              (a, b) =>
                                Number(a.semester) - Number(b.semester) ||
                                a.sectionName.localeCompare(b.sectionName)
                            ),
                          };
                        })
                        .sort((a, b) => Number(a.batch) - Number(b.batch));

                      return branchBatches.map((batchItem) => (
                        <div
                          key={batchItem.batch}
                          className="border border-slate-200 dark:border-slate-700 rounded-xl p-5"
                        >
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
                            <div>
                              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                Batch {batchItem.batch}
                              </h3>
                              <p className="text-sm text-slate-500 dark:text-slate-400">
                                Current semester {batchItem.currentSemester}
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-2 items-center">
                              <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
                                Total seats {batchItem.totalSeats}
                              </span>
                              <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                                Filled {batchItem.filledSeats}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteBatch(
                                    branch.department,
                                    batchItem.batch,
                                    batchItem.sections
                                  )
                                }
                                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all text-sm font-medium"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span>Delete Batch</span>
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {batchItem.sections.map((section) => (
                              <div
                                key={section.id}
                                className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700"
                              >
                                <div className="flex items-center justify-between gap-4 mb-4">
                                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center">
                                    <Layers3 className="w-5 h-5 text-slate-700 dark:text-slate-200" />
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => openModal(section)}
                                      className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-900 transition-all"
                                    >
                                      <Pencil className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteSection(section)}
                                      className="p-2 rounded-lg border border-red-200 dark:border-red-900/40 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                                    >
                                      <Trash2 className="w-4 h-4 text-red-600 dark:text-red-300" />
                                    </button>
                                  </div>
                                </div>
                                <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                  Section {section.sectionName}
                                </h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                  {section.id}
                                </p>
                                <p className="mt-2 inline-flex px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
                                  Semester {section.semester}
                                </p>
                                <div className="mt-4 grid grid-cols-2 gap-3">
                                  <div className="rounded-lg bg-white dark:bg-slate-900 p-3 border border-slate-200 dark:border-slate-700">
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Capacity</p>
                                    <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                      {section.totalSeats}
                                    </p>
                                  </div>
                                  <div className="rounded-lg bg-white dark:bg-slate-900 p-3 border border-slate-200 dark:border-slate-700">
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Filled</p>
                                    <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                      {section.filledSeats}
                                    </p>
                                  </div>
                                </div>
                                <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                  <Users className="w-4 h-4" />
                                  <span>{Math.max(Number(section.totalSeats || 0) - Number(section.filledSeats || 0), 0)} seats left</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ));
                    })()}
                  </div>

                  {branchFilteredSections.length === 0 && (
                    <div className="mt-6 rounded-xl border border-slate-200 dark:border-slate-700 p-10 text-center">
                      <Layers3 className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        No batch found
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                        Try changing the branch filters.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {branches.length === 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-10 text-center shadow-sm">
          <Building2 className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">No branches found</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Add a section to create the first branch intake structure.
          </p>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl w-full max-w-xl p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">{formData.id && formData.id !== '' ? 'Edit Section' : 'Add Section'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {formError && (
                <div className="rounded-lg border border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-950/20 px-4 py-3 text-sm text-red-700 dark:text-red-300">
                  {formError}
                </div>
              )}
              <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                One batch can contain multiple sections, but each section name must be unique within the same department, batch, and semester.
              </div>
              <input value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} placeholder="Department" className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" required />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input value={formData.batch} onChange={(e) => setFormData({ ...formData, batch: e.target.value })} placeholder="Batch" className="px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" required />
                <input value={formData.semester} onChange={(e) => setFormData({ ...formData, semester: e.target.value })} type="number" min="1" max="8" placeholder="Semester" className="px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" required />
                <input value={formData.sectionName} onChange={(e) => setFormData({ ...formData, sectionName: e.target.value })} placeholder="Section" className="px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input value={formData.totalSeats} onChange={(e) => setFormData({ ...formData, totalSeats: e.target.value })} type="number" min="1" placeholder="Total seats" className="px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" required />
                <input value={formData.filledSeats} onChange={(e) => setFormData({ ...formData, filledSeats: e.target.value })} type="number" min="0" max={formData.totalSeats || 0} placeholder="Filled seats" className="px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" required />
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
