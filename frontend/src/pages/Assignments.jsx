import { useMemo, useState } from 'react';
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  FileText,
  Upload,
  X,
} from 'lucide-react';
import { assignmentsData } from '../data/mockData';

const Assignments = () => {
  const [assignments, setAssignments] = useState(assignmentsData);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const summary = useMemo(() => {
    const total = assignments.length;
    const pending = assignments.filter((item) => item.status === 'Pending').length;
    const submitted = assignments.filter((item) => item.status === 'Submitted').length;
    const overdue = assignments.filter((item) => item.status === 'Overdue').length;

    return { total, pending, submitted, overdue };
  }, [assignments]);

  const getStatusClasses = (status) => {
    switch (status) {
      case 'Submitted':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300';
      case 'Graded':
        return 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300';
      case 'Overdue':
        return 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300';
      default:
        return 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300';
    }
  };

  const openSubmissionModal = (assignment) => {
    setSelectedAssignment(assignment);
    setSelectedFile(null);
    setShowSubmissionModal(true);
  };

  const closeSubmissionModal = () => {
    setShowSubmissionModal(false);
    setSelectedAssignment(null);
    setSelectedFile(null);
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleSubmitAssignment = (event) => {
    event.preventDefault();

    if (!selectedAssignment || !selectedFile) {
      alert('Please choose a file before submitting.');
      return;
    }

    const submittedAt = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    setAssignments((current) =>
      current.map((item) =>
        item.id === selectedAssignment.id
          ? {
              ...item,
              status: 'Submitted',
              submission: {
                fileName: selectedFile.name,
                submittedAt,
                marks: item.submission?.marks ?? null,
                feedback: 'Submission received. Awaiting faculty review',
              },
            }
          : item
      )
    );

    closeSubmissionModal();
    alert('Assignment submitted successfully! (Demo mode)');
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Assignments</h1>
        <p className="text-indigo-100">
          View faculty assignments, check deadlines, and upload your solutions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Assignments</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-2">{summary.total}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
          <p className="text-sm text-slate-500 dark:text-slate-400">Pending</p>
          <p className="text-3xl font-bold text-amber-600 mt-2">{summary.pending}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
          <p className="text-sm text-slate-500 dark:text-slate-400">Submitted</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{summary.submitted}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
          <p className="text-sm text-slate-500 dark:text-slate-400">Overdue</p>
          <p className="text-3xl font-bold text-red-600 mt-2">{summary.overdue}</p>
        </div>
      </div>

      <div className="space-y-4">
        {assignments.map((assignment) => (
          <div
            key={assignment.id}
            className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6"
          >
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
              <div className="space-y-4 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
                        {assignment.courseCode}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClasses(assignment.status)}`}>
                        {assignment.status}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                      {assignment.title}
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {assignment.courseName} | {assignment.faculty}
                    </p>
                  </div>
                </div>

                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {assignment.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mb-2">
                      <Calendar className="w-4 h-4" />
                      <span>Deadline</span>
                    </div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{assignment.deadline}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mb-2">
                      <Clock className="w-4 h-4" />
                      <span>Posted</span>
                    </div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{assignment.postedDate}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mb-2">
                      <FileText className="w-4 h-4" />
                      <span>Max Marks</span>
                    </div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{assignment.maxMarks}</p>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Assignment file</p>
                      <p className="font-medium text-slate-900 dark:text-slate-100">{assignment.questionFile}</p>
                    </div>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Question</span>
                    </button>
                  </div>
                </div>

                {assignment.submission ? (
                  <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                      <div className="space-y-1">
                        <p className="font-semibold text-emerald-900 dark:text-emerald-300">
                          Submitted File: {assignment.submission.fileName}
                        </p>
                        <p className="text-sm text-emerald-700 dark:text-emerald-400">
                          Submitted on {assignment.submission.submittedAt}
                        </p>
                        <p className="text-sm text-emerald-700 dark:text-emerald-400">
                          {assignment.submission.marks !== null
                            ? `Marks: ${assignment.submission.marks}/${assignment.maxMarks}`
                            : assignment.submission.feedback}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : assignment.status === 'Overdue' ? (
                  <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                    <div>
                      <p className="font-semibold text-red-900 dark:text-red-300">Submission window closed</p>
                      <p className="text-sm text-red-700 dark:text-red-400">
                        This assignment is overdue. Faculty can reopen it later from their portal.
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="lg:w-56 flex flex-col gap-3">
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Allowed formats</p>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    {assignment.allowedTypes.join(', ')}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={assignment.status === 'Overdue'}
                  onClick={() => openSubmissionModal(assignment)}
                  className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
                    assignment.status === 'Overdue'
                      ? 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  <span>{assignment.submission ? 'Resubmit Solution' : 'Upload Solution'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showSubmissionModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Submit Assignment</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{selectedAssignment.title}</p>
              </div>
              <button
                type="button"
                onClick={closeSubmissionModal}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmitAssignment} className="p-6 space-y-5">
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 space-y-2">
                <p className="text-sm text-slate-500 dark:text-slate-400">Course</p>
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  {selectedAssignment.courseCode} | {selectedAssignment.courseName}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Deadline: {selectedAssignment.deadline} | Allowed: {selectedAssignment.allowedTypes.join(', ')}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Upload Solution File
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
                {selectedFile && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    Selected file: <span className="font-medium">{selectedFile.name}</span>
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeSubmissionModal}
                  className="flex-1 py-3 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all"
                >
                  Submit Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assignments;
