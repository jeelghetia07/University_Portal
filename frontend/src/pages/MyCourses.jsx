import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Users,
  Clock,
  MapPin,
  Award,
  TrendingUp,
  Calendar,
  FileText,
  X,
  Mail,
  Send,
  AlertTriangle,
} from "lucide-react";
import { enrolledCourses } from "../data/mockData";

const MyCourses = () => {
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showDropRequestModal, setShowDropRequestModal] = useState(false);
  const [facultyMessage, setFacultyMessage] = useState("");
  const [dropRequestData, setDropRequestData] = useState({
    courseToDropName: '',
    courseToDropCode: '',
    reason: '',
    facultyEmail: ''
  });
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  const openCourseDetails = (course) => {
    setSelectedCourse(course);
    setShowDetailsModal(true);
  };

  const openDropRequestModal = (course) => {
    setDropRequestData({
      courseToDropName: course.courseName,
      courseToDropCode: course.courseCode,
      reason: '',
      facultyEmail: course.faculty.toLowerCase().replace(/\s+/g, '.') + '@university.edu'
    });
    setShowDetailsModal(false);
    setShowDropRequestModal(true);
  };

  // Navigate to Course Materials with selected course
  const handleViewMaterials = (course) => {
    navigate('/course-materials', { state: { selectedCourseCode: course.courseCode } });
  };

  const handleDropRequestSubmit = (e) => {
    e.preventDefault();

    if (!dropRequestData.reason.trim()) {
      showNotification('error', 'Please provide a reason for dropping the course!');
      return;
    }

    console.log('Drop request submitted:', dropRequestData);
    
    showNotification('success', 'Drop request sent to faculty successfully!');
    setShowDropRequestModal(false);
    setDropRequestData({
      courseToDropName: '',
      courseToDropCode: '',
      reason: '',
      facultyEmail: ''
    });
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 3000);
  };

  const totalCredits = enrolledCourses.reduce(
    (sum, course) => sum + course.credits,
    0,
  );

  const getAttendanceStatus = (percentage) => {
    if (percentage >= 85) return { color: "green", text: "Excellent" };
    if (percentage >= 75) return { color: "blue", text: "Good" };
    if (percentage >= 65) return { color: "yellow", text: "Warning" };
    return { color: "red", text: "Critical" };
  };

  const getGradeColor = (grade) => {
    if (grade === "A+" || grade === "A") return "green";
    if (grade === "B+" || grade === "B") return "blue";
    if (grade === "C+" || grade === "C") return "yellow";
    return "slate";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">My Courses</h1>
        <p className="text-purple-100">View and manage your enrolled courses</p>
      </div>

      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-6 right-6 z-50 p-4 rounded-lg shadow-xl flex items-center space-x-3 animate-fadeIn ${
          notification.type === 'success' ? 'bg-green-50 border-2 border-green-500' : 'bg-red-50 border-2 border-red-500'
        }`}>
          {notification.type === 'success' ? (
            <TrendingUp className="w-6 h-6 text-green-600" />
          ) : (
            <AlertTriangle className="w-6 h-6 text-red-600" />
          )}
          <span className={`font-medium ${notification.type === 'success' ? 'text-green-900' : 'text-red-900'}`}>
            {notification.message}
          </span>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
              Active
            </span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">
            {enrolledCourses.length}
          </h3>
          <p className="text-sm text-slate-600 mt-1">Total Courses</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-indigo-600" />
            </div>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
              Semester 5
            </span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">{totalCredits}</h3>
          <p className="text-sm text-slate-600 mt-1">Total Credits</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
              Average
            </span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">
            {(
              enrolledCourses.reduce((sum, c) => sum + c.attendance, 0) /
              enrolledCourses.length
            ).toFixed(0)}
            %
          </h3>
          <p className="text-sm text-slate-600 mt-1">Overall Attendance</p>
        </div>
      </div>

      {/* Courses List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Enrolled Courses</h2>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {enrolledCourses.map((course) => {
            const attendanceStatus = getAttendanceStatus(course.attendance);
            const gradeColor = getGradeColor(course.grade);

            return (
              <div
                key={course.courseCode}
                className="border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer"
                onClick={() => openCourseDetails(course)}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">
                          {course.courseName}
                        </h3>
                        <p className="text-sm text-slate-600">
                          {course.courseCode}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold bg-${gradeColor}-100 text-${gradeColor}-700`}
                      >
                        Grade: {course.grade}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center text-sm text-slate-600">
                        <Users className="w-4 h-4 mr-2 text-slate-400" />
                        <span>{course.faculty}</span>
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <Clock className="w-4 h-4 mr-2 text-slate-400" />
                        <span>{course.schedule}</span>
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                        <span>{course.room}</span>
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <Award className="w-4 h-4 mr-2 text-slate-400" />
                        <span>{course.credits} Credits</span>
                      </div>
                    </div>
                  </div>

                  <div className="lg:w-64 space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700">
                          Attendance
                        </span>
                        <span
                          className={`text-sm font-bold text-${attendanceStatus.color}-600`}
                        >
                          {course.attendance}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className={`bg-${attendanceStatus.color}-500 h-2 rounded-full transition-all`}
                          style={{ width: `${course.attendance}%` }}
                        ></div>
                      </div>
                      <p
                        className={`text-xs text-${attendanceStatus.color}-600 font-medium mt-1`}
                      >
                        {attendanceStatus.text}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Drop Request Modal */}
      {showDropRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full">
            <div className="bg-gradient-to-r from-red-600 to-orange-600 p-6 text-white rounded-t-2xl">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Request Course Drop</h2>
                  <p className="text-red-100">Send request to faculty</p>
                </div>
                <button
                  onClick={() => setShowDropRequestModal(false)}
                  className="text-white hover:bg-white/20 rounded-lg p-2 transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleDropRequestSubmit} className="p-6 space-y-4">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-sm text-orange-700 mb-2">
                  <strong>Note:</strong> Your drop request will be sent to the course faculty for approval.
                </p>
                <p className="text-sm text-orange-600">
                  Course: <strong>{dropRequestData.courseToDropName}</strong> ({dropRequestData.courseToDropCode})
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Faculty Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={dropRequestData.facultyEmail}
                    disabled
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-slate-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Reason for Dropping <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={dropRequestData.reason}
                  onChange={(e) => setDropRequestData({ ...dropRequestData, reason: e.target.value })}
                  placeholder="Please explain why you want to drop this course..."
                  rows="6"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                  required
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowDropRequestModal(false)}
                  className="flex-1 py-3 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg font-semibold hover:from-red-700 hover:to-orange-700 transition-all shadow-lg flex items-center justify-center space-x-2"
                >
                  <Send className="w-5 h-5" />
                  <span>Send Request</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Course Details Modal */}
      {showDetailsModal && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white rounded-t-2xl sticky top-0 z-10">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    {selectedCourse.courseName}
                  </h2>
                  <p className="text-purple-100">{selectedCourse.courseCode}</p>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-white hover:bg-white/20 rounded-lg p-2 transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-purple-50 dark:bg-slate-800 rounded-lg p-4 text-center">
                  <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-slate-900">
                    {selectedCourse.credits}
                  </p>
                  <p className="text-xs text-slate-600">Credits</p>
                </div>
                <div className="bg-green-50 dark:bg-slate-800 rounded-lg p-4 text-center">
                  <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-slate-900">
                    {selectedCourse.attendance}%
                  </p>
                  <p className="text-xs text-slate-600">Attendance</p>
                </div>
                <div
                  className={`bg-${getGradeColor(selectedCourse.grade)}-50 dark:bg-slate-800 rounded-lg p-4 text-center`}
                >
                  <FileText
                    className={`w-8 h-8 text-${getGradeColor(selectedCourse.grade)}-600 mx-auto mb-2`}
                  />
                  <p className="text-2xl font-bold text-slate-900">
                    {selectedCourse.grade}
                  </p>
                  <p className="text-xs text-slate-600">Current Grade</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-4 text-lg">
                  Course Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                    <Users className="w-5 h-5 text-slate-400 mr-3 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-slate-600 mb-1">Instructor</p>
                      <p className="font-medium text-slate-900">
                        {selectedCourse.faculty}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                    <Clock className="w-5 h-5 text-slate-400 mr-3 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-slate-600 mb-1">
                        Class Schedule
                      </p>
                      <p className="font-medium text-slate-900">
                        {selectedCourse.schedule}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                    <MapPin className="w-5 h-5 text-slate-400 mr-3 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-slate-600 mb-1">Classroom</p>
                      <p className="font-medium text-slate-900">
                        {selectedCourse.room}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                    <Calendar className="w-5 h-5 text-slate-400 mr-3 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-slate-600 mb-1">
                        Enrollment Date
                      </p>
                      <p className="font-medium text-slate-900">
                        {new Date(
                          selectedCourse.enrollmentDate,
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-4 text-lg">
                  Attendance Overview
                </h3>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-slate-800 dark:to-slate-800 rounded-lg p-6 border border-green-200 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-semibold text-slate-900">
                      Current Attendance
                    </span>
                    <span className="text-3xl font-bold text-green-600">
                      {selectedCourse.attendance}%
                    </span>
                  </div>
                  <div className="w-full bg-white dark:bg-slate-700 rounded-full h-3 mb-3">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all"
                      style={{ width: `${selectedCourse.attendance}%` }}
                    ></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-slate-900">
                        {Math.round((selectedCourse.attendance / 100) * 50)}
                      </p>
                      <p className="text-sm text-slate-600">Classes Attended</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-slate-900">50</p>
                      <p className="text-sm text-slate-600">Total Classes</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons with Navigation */}
              <div className="grid grid-cols-3 gap-3 pt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewMaterials(selectedCourse);
                  }}
                  className="py-3 border-2 border-purple-600 text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-all"
                >
                  View Materials
                </button>
                <button
                  onClick={() => setShowContactModal(true)}
                  className="py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all"
                >
                  Contact Faculty
                </button>
                <button
                  onClick={() => openDropRequestModal(selectedCourse)}
                  className="py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg font-semibold hover:from-red-700 hover:to-orange-700 transition-all"
                >
                  Request Drop
                </button>
              </div>
            </div>
          </div>

          {/* Contact Faculty Modal */}
          {showContactModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl w-full max-w-lg p-6">
                <h2 className="text-xl font-bold mb-4">
                  Contact {selectedCourse?.faculty}
                </h2>

                <textarea
                  rows="6"
                  placeholder="Write your message to the faculty..."
                  value={facultyMessage}
                  onChange={(e) => setFacultyMessage(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={() => {
                      setShowContactModal(false);
                      setFacultyMessage("");
                    }}
                    className="px-4 py-2 border rounded-lg"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() => {
                      alert("Message sent to faculty!");
                      setShowContactModal(false);
                      setFacultyMessage("");
                    }}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyCourses;
