import { useMemo, useState } from 'react';
import { ClipboardList, Plus, Trash2, Star } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import { useAdmin } from '../../context/AdminContext';
import { getFacultyContext } from './facultyUtils';

const emptyAssignment = {
  id: '',
  title: '',
  courseCode: '',
  courseName: '',
  postedDate: new Date().toISOString().split('T')[0],
  deadline: '',
  maxMarks: 20,
  description: '',
  questionFile: 'Assignment.pdf',
  allowedTypes: ['PDF'],
  status: 'Pending',
  submission: null,
};

const FacultyAssignments = () => {
  const { users, courses, sections, facultyAssignments, timetableEntries, assignmentItems, saveAssignment, deleteAssignment, saveAssignmentReview } = useAdmin();
  const { facultyUser, assignedCourseCodes, assignedCourseViews } = getFacultyContext(users, courses, sections, facultyAssignments, timetableEntries);
  const [formData, setFormData] = useState({ ...emptyAssignment, courseCode: assignedCourseCodes[0] || '' });
  const [reviewState, setReviewState] = useState({ assignmentId: '', marks: '', feedback: '' });

  const facultyAssignmentsList = useMemo(
    () => assignmentItems.filter((assignment) => assignedCourseCodes.includes(assignment.courseCode)),
    [assignmentItems, assignedCourseCodes]
  );

  const handleCreateAssignment = (event) => {
    event.preventDefault();
    const selectedCourse = assignedCourseViews.find((item) => item.course.courseCode === formData.courseCode)?.course;
    if (!selectedCourse) return;

    saveAssignment({
      ...formData,
      id: formData.id || `ASN${Date.now()}`,
      courseName: selectedCourse.courseName,
      faculty: facultyUser?.name || 'Faculty',
      maxMarks: Number(formData.maxMarks),
      allowedTypes: ['PDF'],
    });

    setFormData({ ...emptyAssignment, courseCode: assignedCourseCodes[0] || '' });
  };

  const handleReviewSubmit = (assignment) => {
    if (!assignment.submission) return;

    saveAssignmentReview(assignment.id, {
      ...assignment.submission,
      marks: reviewState.assignmentId === assignment.id ? Number(reviewState.marks) : assignment.submission.marks,
      feedback: reviewState.assignmentId === assignment.id ? reviewState.feedback : assignment.submission.feedback,
      status: 'Graded',
    });

    setReviewState({ assignmentId: '', marks: '', feedback: '' });
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Assignments"
        description="Create assignments for your courses and review submitted work."
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">Create Assignment</h2>
          <form onSubmit={handleCreateAssignment} className="space-y-4">
            <select value={formData.courseCode} onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" required>
              {assignedCourseCodes.map((code) => (
                <option key={code} value={code}>{code}</option>
              ))}
            </select>
            <input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Assignment title" className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" required />
            <input type="date" value={formData.deadline} onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" required />
            <input type="number" min="1" value={formData.maxMarks} onChange={(e) => setFormData({ ...formData, maxMarks: e.target.value })} placeholder="Max marks" className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" required />
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows="4" placeholder="Assignment description" className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" required />
            <button type="submit" className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-all">
              <Plus className="w-4 h-4" />
              <span>Save Assignment</span>
            </button>
          </form>
        </div>

        <div className="xl:col-span-2 space-y-4">
          {facultyAssignmentsList.map((assignment) => (
            <div key={assignment.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300 text-xs font-semibold">{assignment.courseCode}</span>
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-xs font-semibold">{assignment.status}</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{assignment.title}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Deadline: {assignment.deadline} | Max marks: {assignment.maxMarks}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">{assignment.description}</p>
                </div>
                <button onClick={() => deleteAssignment(assignment.id)} className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>

              {assignment.submission ? (
                <div className="mt-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">Submission: {assignment.submission.fileName}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Submitted on {assignment.submission.submittedAt}</p>
                    </div>
                    {assignment.submission.marks !== null && (
                      <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300 text-xs font-semibold">
                        {assignment.submission.marks}/{assignment.maxMarks}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input type="number" min="0" max={assignment.maxMarks} value={reviewState.assignmentId === assignment.id ? reviewState.marks : assignment.submission.marks ?? ''} onChange={(e) => setReviewState({ assignmentId: assignment.id, marks: e.target.value, feedback: reviewState.assignmentId === assignment.id ? reviewState.feedback : assignment.submission.feedback || '' })} placeholder="Award marks" className="px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" />
                    <input value={reviewState.assignmentId === assignment.id ? reviewState.feedback : assignment.submission.feedback || ''} onChange={(e) => setReviewState({ assignmentId: assignment.id, marks: reviewState.assignmentId === assignment.id ? reviewState.marks : assignment.submission.marks ?? '', feedback: e.target.value })} placeholder="Faculty feedback" className="px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" />
                  </div>

                  <button onClick={() => handleReviewSubmit(assignment)} className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold transition-all">
                    <Star className="w-4 h-4" />
                    <span>Save Review</span>
                  </button>
                </div>
              ) : (
                <div className="mt-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-sm">
                  No student submission yet.
                </div>
              )}
            </div>
          ))}

          {facultyAssignmentsList.length === 0 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-10 text-center shadow-sm">
              <ClipboardList className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
              <p className="text-slate-500 dark:text-slate-400">No assignments for your allocated courses yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FacultyAssignments;
