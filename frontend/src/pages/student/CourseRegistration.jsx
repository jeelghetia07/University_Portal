import { useState } from 'react';
import {
  Search,
  BookOpen,
  Users,
  Clock,
  MapPin,
  CheckCircle,
  AlertCircle,
  X,
  User,
  Mail,
  Hash,
  UserCircle,
} from 'lucide-react';
import { enrolledCourses as initialEnrolled, currentUser, availableCourses } from '../../data/mockData';
import { useAdmin } from '../../context/AdminContext';

const CourseRegistration = () => {
  const { courses } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [enrolledCourses, setEnrolledCourses] = useState(initialEnrolled);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [registrationData, setRegistrationData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    rollNumber: currentUser.id,
    gender: '',
  });

  const courseCatalog = courses.length ? courses : availableCourses;
  const availableCoursesOnly = courseCatalog.filter(
    (course) => !enrolledCourses.some((enrolled) => enrolled.courseCode === course.courseCode)
  );

  const filteredCourses = availableCoursesOnly.filter((course) => {
    const searchableFaculty = (course.faculty || 'to be assigned').toLowerCase();
    return (
      course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      searchableFaculty.includes(searchTerm.toLowerCase())
    );
  });

  const coreCourses = filteredCourses.filter((course) => (course.courseType || 'core') === 'core');
  const electiveCourses = filteredCourses.filter((course) => course.courseType === 'elective');
  const enrolledElective = enrolledCourses.find((course) => course.courseType === 'elective');
  const totalCoreCourses = courseCatalog.filter(
    (course) => (course.courseType || 'core') === 'core'
  ).length;
  const completedCoreCourses = enrolledCourses.filter(
    (course) => (course.courseType || 'core') === 'core'
  ).length;

  const handleRegistrationFormChange = (event) => {
    setRegistrationData({
      ...registrationData,
      [event.target.name]: event.target.value,
    });
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 3000);
  };

  const getCapacity = (course) => Number(course.capacity ?? course.seats ?? 0);
  const getEnrolledCount = (course) => Number(course.enrolled ?? 0);

  const openRegistrationForm = (course) => {
    if (course.courseType === 'elective' && enrolledElective) {
      showNotification(
        'error',
        `Only one elective is allowed. Current elective: ${enrolledElective.courseCode}`
      );
      return;
    }

    if (getEnrolledCount(course) >= getCapacity(course)) {
      showNotification('error', 'Course is full!');
      return;
    }

    setSelectedCourse(course);
    setShowRegistrationModal(true);
  };

  const openCourseDetailsModal = (course) => {
    setSelectedCourse(course);
    setShowDetailsModal(true);
  };

  const handleRegisterSubmit = (event) => {
    event.preventDefault();

    if (!registrationData.gender) {
      showNotification('error', 'Please select gender!');
      return;
    }

    const newEnrollment = {
      id: selectedCourse.id,
      courseName: selectedCourse.courseName,
      courseCode: selectedCourse.courseCode,
      courseType: selectedCourse.courseType || 'core',
      credits: selectedCourse.credits,
      faculty: selectedCourse.faculty || 'Faculty to be assigned',
      schedule: selectedCourse.schedule || 'Schedule to be assigned',
      room: selectedCourse.room || 'Room to be assigned',
      attendance: 0,
      grade: '-',
      enrollmentDate: new Date().toISOString().split('T')[0],
      status: 'Active',
    };

    setEnrolledCourses([...enrolledCourses, newEnrollment]);
    setShowRegistrationModal(false);
    setShowSuccessModal(true);
    setRegistrationData({
      ...registrationData,
      gender: '',
    });

    setTimeout(() => {
      setShowSuccessModal(false);
    }, 3000);
  };

  const courseSections = [
    {
      title: 'Compulsory Core Courses',
      description: 'Mandatory subjects every student in this structure must complete.',
      courses: coreCourses,
    },
    {
      title: 'Elective Courses',
      description: 'Choose only one elective from the available options.',
      courses: electiveCourses,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Course Registration</h1>
        <p className="text-indigo-100">Register semester core courses and choose only one elective.</p>
      </div>

      {notification.show && (
        <div
          className={`fixed top-6 right-6 z-50 p-4 rounded-lg shadow-xl flex items-center space-x-3 animate-fadeIn ${
            notification.type === 'success'
              ? 'bg-green-50 border-2 border-green-500'
              : 'bg-red-50 border-2 border-red-500'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle className="w-6 h-6 text-green-600" />
          ) : (
            <AlertCircle className="w-6 h-6 text-red-600" />
          )}
          <span
            className={`font-medium ${
              notification.type === 'success' ? 'text-green-900' : 'text-red-900'
            }`}
          >
            {notification.message}
          </span>
        </div>
      )}

      {showSuccessModal && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Successfully Enrolled!</h2>
            <p className="text-slate-600 mb-6">You have been successfully enrolled in</p>
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-6">
              <h3 className="font-bold text-lg text-green-900 mb-1">{selectedCourse.courseName}</h3>
              <p className="text-sm text-green-700">{selectedCourse.courseCode}</p>
              <p className="text-sm text-green-600 mt-2">
                {selectedCourse.faculty || 'Faculty to be assigned'}
              </p>
            </div>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {showRegistrationModal && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white rounded-t-2xl">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Course Registration</h2>
                  <p className="text-indigo-100">{selectedCourse.courseName}</p>
                </div>
                <button
                  onClick={() => setShowRegistrationModal(false)}
                  className="text-white hover:bg-white/20 rounded-lg p-2 transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleRegisterSubmit} className="p-6 space-y-4">
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-indigo-700">
                  Please confirm your details to complete the registration.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name <span className="text-xs text-slate-500">(Cannot be changed)</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={registrationData.name}
                    disabled
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-slate-600 outline-none cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address <span className="text-xs text-slate-500">(Cannot be changed)</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={registrationData.email}
                    disabled
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-slate-600 outline-none cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Roll Number <span className="text-xs text-slate-500">(Cannot be changed)</span>
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={registrationData.rollNumber}
                    disabled
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-slate-600 outline-none cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Gender <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <select
                    name="gender"
                    value={registrationData.gender}
                    onChange={handleRegistrationFormChange}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all appearance-none bg-white"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-3">Course Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Course Code:</span>
                    <span className="font-medium text-slate-900">{selectedCourse.courseCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Course Type:</span>
                    <span className="font-medium text-slate-900 capitalize">
                      {selectedCourse.courseType || 'core'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Credits:</span>
                    <span className="font-medium text-slate-900">{selectedCourse.credits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Faculty:</span>
                    <span className="font-medium text-slate-900">
                      {selectedCourse.faculty || 'Faculty to be assigned'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Schedule:</span>
                    <span className="font-medium text-slate-900">
                      {selectedCourse.schedule || 'Schedule to be assigned'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowRegistrationModal(false)}
                  className="flex-1 py-3 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
                >
                  Confirm Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-sky-200 dark:border-sky-900/60 bg-sky-50 dark:bg-sky-950/20 p-4">
            <p className="text-sm text-sky-700 dark:text-sky-300 font-medium">Compulsory Core Courses</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2">
              {completedCoreCourses} / {totalCoreCourses}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              These subjects are mandatory for the semester.
            </p>
          </div>
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50 dark:bg-emerald-950/20 p-4">
            <p className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">Elective Choice Limit</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2">
              {enrolledElective ? '1 / 1' : '0 / 1'}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {enrolledElective
                ? `${enrolledElective.courseName} selected`
                : 'Choose only one elective course.'}
            </p>
          </div>
          <div className="rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/20 p-4">
            <p className="text-sm text-amber-700 dark:text-amber-300 font-medium">Registration Rule</p>
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-2">
              {totalCoreCourses} cores + 1 elective
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Core subjects are compulsory, and only one elective can be taken.
            </p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-slate-400" />
          <input
            type="text"
            placeholder="Search available courses by name, code, or faculty..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full pl-14 pr-6 py-4 text-lg border-2 border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      {courseSections.map((section) => (
        <div
          key={section.title}
          className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6"
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2 mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {section.title} ({section.courses.length})
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{section.description}</p>
            </div>
            {section.title === 'Elective Courses' && enrolledElective && (
              <div className="px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300 text-sm font-semibold">
                Elective locked: {enrolledElective.courseCode}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {section.courses.map((course) => {
              const capacity = getCapacity(course);
              const enrolledCount = getEnrolledCount(course);
              const isFull = enrolledCount >= capacity;
              const availableSeats = Math.max(capacity - enrolledCount, 0);
              const isElectiveLocked =
                course.courseType === 'elective' &&
                Boolean(enrolledElective) &&
                enrolledElective.courseCode !== course.courseCode;

              return (
                <div
                  key={course.id}
                  className="border border-slate-200 dark:border-slate-700 rounded-xl p-6 hover:shadow-lg dark:hover:shadow-none transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                          {course.courseName}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            course.courseType === 'elective'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300'
                              : 'bg-sky-100 text-sky-700 dark:bg-sky-950/30 dark:text-sky-300'
                          }`}
                        >
                          {course.courseType === 'elective' ? 'Elective' : 'Core'}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{course.courseCode}</p>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          isFull ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {isFull ? 'Full' : `${availableSeats} Seats Left`}
                      </span>
                      <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full text-xs font-semibold">
                        {course.credits} Credits
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                      <Users className="w-4 h-4 mr-2" />
                      <span>{course.faculty || 'Faculty to be assigned'}</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{course.schedule || 'Schedule to be assigned'}</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{course.room || 'Room to be assigned'}</span>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => openCourseDetailsModal(course)}
                      className="flex-1 py-2 border border-indigo-600 text-indigo-600 dark:text-indigo-300 rounded-lg font-semibold hover:bg-indigo-50 dark:hover:bg-slate-800 transition-all"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => openRegistrationForm(course)}
                      disabled={isFull || isElectiveLocked}
                      className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                        isFull || isElectiveLocked
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700'
                      }`}
                    >
                      {isFull ? 'Full' : isElectiveLocked ? 'Elective Locked' : 'Register'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {section.courses.length === 0 && (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-700" />
              <p className="text-lg">No courses found in this section</p>
              <p className="text-sm">Try adjusting your search or add more courses from admin.</p>
            </div>
          )}
        </div>
      ))}

      {showDetailsModal && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white rounded-t-2xl">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{selectedCourse.courseName}</h2>
                  <p className="text-indigo-100">{selectedCourse.courseCode}</p>
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
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-slate-600 mb-1">Credits</p>
                  <p className="text-xl font-bold text-slate-900">{selectedCourse.credits}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-slate-600 mb-1">Available Seats</p>
                  <p className="text-xl font-bold text-slate-900">
                    {Math.max(getCapacity(selectedCourse) - getEnrolledCount(selectedCourse), 0)} /{' '}
                    {getCapacity(selectedCourse)}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Course Information</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Users className="w-5 h-5 text-slate-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-slate-600">Faculty</p>
                      <p className="font-medium text-slate-900">
                        {selectedCourse.faculty || 'Faculty to be assigned'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="w-5 h-5 text-slate-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-slate-600">Schedule</p>
                      <p className="font-medium text-slate-900">
                        {selectedCourse.schedule || 'Schedule to be assigned'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-slate-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-slate-600">Location</p>
                      <p className="font-medium text-slate-900">
                        {selectedCourse.room || 'Room to be assigned'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Description</h3>
                <p className="text-slate-600">
                  {selectedCourse.description ||
                    'Detailed course information will be updated by admin and faculty.'}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Prerequisites</h3>
                <p className="text-slate-600">
                  {selectedCourse.prerequisites || 'No prerequisites configured yet.'}
                </p>
              </div>

              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  openRegistrationForm(selectedCourse);
                }}
                disabled={
                  getEnrolledCount(selectedCourse) >= getCapacity(selectedCourse) ||
                  (selectedCourse.courseType === 'elective' &&
                    Boolean(enrolledElective) &&
                    enrolledElective.courseCode !== selectedCourse.courseCode)
                }
                className={`w-full py-3 rounded-lg font-semibold transition-all ${
                  getEnrolledCount(selectedCourse) >= getCapacity(selectedCourse) ||
                  (selectedCourse.courseType === 'elective' &&
                    Boolean(enrolledElective) &&
                    enrolledElective.courseCode !== selectedCourse.courseCode)
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700'
                }`}
              >
                {getEnrolledCount(selectedCourse) >= getCapacity(selectedCourse)
                  ? 'Course Full'
                  : selectedCourse.courseType === 'elective' &&
                      Boolean(enrolledElective) &&
                      enrolledElective.courseCode !== selectedCourse.courseCode
                    ? 'Elective Limit Reached'
                    : 'Register for this Course'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseRegistration;

