import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  TrendingUp, 
  Calendar, 
  Bell,
  Award,
  Users,
  Clock,
  ArrowRight
} from 'lucide-react';
import { currentUser, announcements, enrolledCourses, timetable } from '../data/mockData';

const Dashboard = () => {
  // Get user's department from localStorage (set during login)
  const userDepartment = localStorage.getItem('userDepartment') || currentUser.department;
  const userName = localStorage.getItem('userName') || currentUser.name;
  
  // Get today's classes
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todayClasses = timetable.find(day => day.day === today)?.classes || [];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 md:p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Welcome back, {userName.split(' ')[0]}! 👋
            </h1>
            <p className="text-indigo-100 text-lg">
              Here's what's happening with your courses today
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Award className="w-12 h-12" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Enrolled Courses */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-indigo-600" />
            </div>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
              Active
            </span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">{enrolledCourses.length}/6</h3>
          <p className="text-sm text-slate-600 mt-1">Enrolled Courses</p>
        </div>

        {/* Attendance */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
              Good
            </span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">{currentUser.attendance}%</h3>
          <p className="text-sm text-slate-600 mt-1">Overall Attendance</p>
        </div>

        {/* CGPA */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
              Excellent
            </span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">{currentUser.cgpa}/10</h3>
          <p className="text-sm text-slate-600 mt-1">Current CGPA</p>
        </div>

        {/* Semester & Department */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
              Current
            </span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">Semester {currentUser.semester}</h3>
          <p className="text-sm text-slate-600 mt-1">{userDepartment}</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Today's Schedule</h2>
                <p className="text-sm text-slate-600">{today}</p>
              </div>
            </div>
            <Link 
              to="/timetable"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center space-x-1"
            >
              <span>View Full</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-3">
            {todayClasses.length > 0 ? (
              todayClasses.map((cls, index) => (
                <div 
                  key={index}
                  className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="flex-shrink-0 w-16 text-center">
                    <p className="text-xs font-semibold text-indigo-600">
                      {cls.time.split(' - ')[0]}
                    </p>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{cls.course}</h3>
                    <p className="text-sm text-slate-600">{cls.faculty}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-medium">
                      {cls.room}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p>No classes scheduled for today</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Announcements */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-orange-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Announcements</h2>
            </div>
            <Link 
              to="/announcements"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {announcements.slice(0, 4).map((announcement) => (
              <div 
                key={announcement.id}
                className="p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    announcement.priority === 'high' ? 'bg-red-500' :
                    announcement.priority === 'medium' ? 'bg-orange-500' :
                    'bg-green-500'
                  }`} />
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-slate-900 mb-1">
                      {announcement.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {announcement.description}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(announcement.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/course-registration"
            className="flex flex-col items-center p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg hover:shadow-md transition-all group"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-900">Register Courses</span>
          </Link>

          <Link
            to="/attendance"
            className="flex flex-col items-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg hover:shadow-md transition-all group"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-900">View Attendance</span>
          </Link>

          <Link
            to="/grades"
            className="flex flex-col items-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg hover:shadow-md transition-all group"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Award className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-900">Check Grades</span>
          </Link>

          <Link
            to="/faculty"
            className="flex flex-col items-center p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg hover:shadow-md transition-all group"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-900">Faculty Directory</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;