import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Layout from './components/layout/Layout';
import AdminLayout from './components/admin/AdminLayout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CourseRegistration from './pages/CourseRegistration';
import MyCourses from './pages/MyCourses';
import Timetable from './pages/Timetable';
import Profile from './pages/Profile';
import Grades from './pages/Grades';
import Fees from './pages/Fees';
import CourseMaterials from './pages/CourseMaterials';
import Exams from './pages/Exams';
import Events from './pages/Events';
import Announcements from './pages/Announcements';
import Settings from './pages/Settings';
import Support from './pages/Support';
import Assignments from './pages/Assignments';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCourses from './pages/admin/AdminCourses';
import AdminSections from './pages/admin/AdminSections';
import AdminFacultyAllocation from './pages/admin/AdminFacultyAllocation';
import AdminTimetable from './pages/admin/AdminTimetable';
import AdminExams from './pages/admin/AdminExams';
import AdminAnnouncements from './pages/admin/AdminAnnouncements';
import AdminSettings from './pages/admin/AdminSettings';
import FacultyPlaceholder from './pages/admin/FacultyPlaceholder';
import { getDefaultRouteForRole } from './data/authMockData';

const getUserRole = () => localStorage.getItem('userRole') || 'student';

const RoleRoute = ({ children, allowedRoles }) => {
  const isAuthenticated = localStorage.getItem('authToken');
  const role = getUserRole();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to={getDefaultRouteForRole(role)} replace />;
  }

  return children;
};

const RootRedirect = () => {
  const isAuthenticated = localStorage.getItem('authToken');
  if (!isAuthenticated) return <Login />;
  return <Navigate to={getDefaultRouteForRole(getUserRole())} replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/library" element={<Navigate to="/course-materials" replace />} />

        <Route path="/faculty/overview" element={<RoleRoute allowedRoles={['faculty']}><AdminLayout><FacultyPlaceholder /></AdminLayout></RoleRoute>} />

        <Route path="/dashboard" element={<RoleRoute allowedRoles={['student']}><Layout><Dashboard /></Layout></RoleRoute>} />
        <Route path="/profile" element={<RoleRoute allowedRoles={['student']}><Layout><Profile /></Layout></RoleRoute>} />
        <Route path="/course-registration" element={<RoleRoute allowedRoles={['student']}><Layout><CourseRegistration /></Layout></RoleRoute>} />
        <Route path="/my-courses" element={<RoleRoute allowedRoles={['student']}><Layout><MyCourses /></Layout></RoleRoute>} />
        <Route path="/timetable" element={<RoleRoute allowedRoles={['student']}><Layout><Timetable /></Layout></RoleRoute>} />
        <Route path="/grades" element={<RoleRoute allowedRoles={['student']}><Layout><Grades /></Layout></RoleRoute>} />
        <Route path="/fees" element={<RoleRoute allowedRoles={['student']}><Layout><Fees /></Layout></RoleRoute>} />
        <Route path="/announcements" element={<RoleRoute allowedRoles={['student']}><Layout><Announcements /></Layout></RoleRoute>} />
        <Route path="/course-materials" element={<RoleRoute allowedRoles={['student']}><Layout><CourseMaterials /></Layout></RoleRoute>} />
        <Route path="/exams" element={<RoleRoute allowedRoles={['student']}><Layout><Exams /></Layout></RoleRoute>} />
        <Route path="/events" element={<RoleRoute allowedRoles={['student']}><Layout><Events /></Layout></RoleRoute>} />
        <Route path="/assignments" element={<RoleRoute allowedRoles={['student']}><Layout><Assignments /></Layout></RoleRoute>} />
        <Route path="/support" element={<RoleRoute allowedRoles={['student']}><Layout><Support /></Layout></RoleRoute>} />
        <Route path="/settings" element={<RoleRoute allowedRoles={['student']}><Layout><Settings /></Layout></RoleRoute>} />

        <Route path="/admin" element={<RoleRoute allowedRoles={['admin']}><Navigate to="/admin/dashboard" replace /></RoleRoute>} />
        <Route path="/admin/dashboard" element={<RoleRoute allowedRoles={['admin']}><AdminLayout><AdminDashboard /></AdminLayout></RoleRoute>} />
        <Route path="/admin/users" element={<RoleRoute allowedRoles={['admin']}><AdminLayout><AdminUsers /></AdminLayout></RoleRoute>} />
        <Route path="/admin/courses" element={<RoleRoute allowedRoles={['admin']}><AdminLayout><AdminCourses /></AdminLayout></RoleRoute>} />
        <Route path="/admin/sections" element={<RoleRoute allowedRoles={['admin']}><AdminLayout><AdminSections /></AdminLayout></RoleRoute>} />
        <Route path="/admin/faculty-allocation" element={<RoleRoute allowedRoles={['admin']}><AdminLayout><AdminFacultyAllocation /></AdminLayout></RoleRoute>} />
        <Route path="/admin/timetable" element={<RoleRoute allowedRoles={['admin']}><AdminLayout><AdminTimetable /></AdminLayout></RoleRoute>} />
        <Route path="/admin/exams" element={<RoleRoute allowedRoles={['admin']}><AdminLayout><AdminExams /></AdminLayout></RoleRoute>} />
        <Route path="/admin/announcements" element={<RoleRoute allowedRoles={['admin']}><AdminLayout><AdminAnnouncements /></AdminLayout></RoleRoute>} />
        <Route path="/admin/settings" element={<RoleRoute allowedRoles={['admin']}><AdminLayout><AdminSettings /></AdminLayout></RoleRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
