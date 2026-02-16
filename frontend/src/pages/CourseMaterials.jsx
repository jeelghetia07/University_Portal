import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { BookOpen, Download, FileText, File, X, Calendar, User, Search } from 'lucide-react';
import { enrolledCourses, courseMaterials } from '../data/mockData';

const CourseMaterials = () => {
  const location = useLocation();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showMaterialsModal, setShowMaterialsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '' });

  const openCourseMaterials = (course) => {
    setSelectedCourse(course);
    setShowMaterialsModal(true);
  };

  // Auto-open modal if coming from MyCourses
  useEffect(() => {
    if (location.state?.selectedCourseCode) {
      const course = enrolledCourses.find(c => c.courseCode === location.state.selectedCourseCode);
      if (course) {
        openCourseMaterials(course);
      }
      // Clear the state to prevent reopening on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleDownload = (material) => {
    // In real app, this would download the actual file from server
    console.log('Downloading:', material.title);
    
    // Show notification
    setNotification({ show: true, message: `Downloading "${material.title}"...` });
    setTimeout(() => {
      setNotification({ show: false, message: '' });
    }, 3000);

    // In production, this would be:
    /*
    const response = await fetch(`/api/materials/download/${material.id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${material.title}.pdf`;
    a.click();
    */
  };

  // Filter courses based on search
  const filteredCourses = enrolledCourses.filter(course => 
    course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.courseCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get materials for selected course
  const materials = selectedCourse ? (courseMaterials[selectedCourse.courseCode] || []) : [];

  // Calculate total materials across all enrolled courses
  const totalMaterials = enrolledCourses.reduce((total, course) => {
    return total + (courseMaterials[course.courseCode]?.length || 0);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Course Materials</h1>
        <p className="text-blue-100">Access lecture notes, assignments, and study materials</p>
      </div>

      {/* Notification */}
      {notification.show && (
        <div className="fixed top-6 right-6 z-50 p-4 rounded-lg shadow-xl flex items-center space-x-3 animate-fadeIn bg-blue-50 border-2 border-blue-500">
          <Download className="w-6 h-6 text-blue-600 animate-bounce" />
          <span className="font-medium text-blue-900">{notification.message}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
              Active
            </span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">{enrolledCourses.length}</h3>
          <p className="text-sm text-slate-600 mt-1">Enrolled Courses</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
              Available
            </span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">{totalMaterials}</h3>
          <p className="text-sm text-slate-600 mt-1">Total Materials</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Download className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
              Ready
            </span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">PDF</h3>
          <p className="text-sm text-slate-600 mt-1">Download Format</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-slate-400" />
          <input
            type="text"
            placeholder="Search courses by name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 text-lg border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Courses with Materials */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-6">
          Your Courses ({filteredCourses.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => {
            const materialsCount = courseMaterials[course.courseCode]?.length || 0;
            
            return (
              <div
                key={course.courseCode}
                onClick={() => openCourseMaterials(course)}
                className="border-2 border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    materialsCount > 0 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {materialsCount} Materials
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {course.courseName}
                </h3>
                <p className="text-sm text-slate-600 mb-1">{course.courseCode}</p>
                <p className="text-xs text-slate-500">{course.faculty}</p>

                <button className="w-full mt-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-semibold group-hover:bg-blue-600 group-hover:text-white transition-all">
                  View Materials
                </button>
              </div>
            );
          })}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <p className="text-lg">No courses found</p>
            <p className="text-sm">Try adjusting your search</p>
          </div>
        )}
      </div>

      {/* Materials Modal */}
      {showMaterialsModal && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 text-white rounded-t-2xl sticky top-0 z-10">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{selectedCourse.courseName}</h2>
                  <p className="text-blue-100">{selectedCourse.courseCode} • {selectedCourse.faculty}</p>
                </div>
                <button
                  onClick={() => setShowMaterialsModal(false)}
                  className="text-white hover:bg-white/20 rounded-lg p-2 transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {materials.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-900">
                      Available Materials ({materials.length})
                    </h3>
                    <span className="text-sm text-slate-600">
                      All files are in PDF format
                    </span>
                  </div>

                  {materials.map(material => (
                    <div
                      key={material.id}
                      className="border border-slate-200 rounded-xl p-4 hover:shadow-md hover:border-blue-300 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          {/* File Icon */}
                          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <File className="w-6 h-6 text-red-600" />
                          </div>

                          {/* Material Info */}
                          <div className="flex-1">
                            <h4 className="font-semibold text-slate-900 mb-1">
                              {material.title}
                            </h4>
                            <p className="text-sm text-slate-600 mb-3">
                              {material.description}
                            </p>

                            <div className="flex items-center space-x-4 text-xs text-slate-500">
                              <div className="flex items-center space-x-1">
                                <User className="w-3 h-3" />
                                <span>{material.uploadedBy}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-3 h-3" />
                                <span>
                                  {new Date(material.uploadDate).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </span>
                              </div>
                              <span className="font-medium">{material.size}</span>
                            </div>
                          </div>
                        </div>

                        {/* Download Button */}
                        <button
                          onClick={() => handleDownload(material)}
                          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all shadow-md hover:shadow-lg ml-4"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">
                    No Materials Available Yet
                  </h3>
                  <p className="text-sm">
                    Your faculty hasn't uploaded any materials for this course yet.
                  </p>
                  <p className="text-sm mt-1">Check back later!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseMaterials;