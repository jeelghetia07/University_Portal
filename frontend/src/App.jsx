import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CourseRegistration from './pages/CourseRegistration';

// Temporary placeholder component for other pages
const ComingSoon = ({ pageName }) => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="text-center">
      <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-3xl">🚧</span>
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">{pageName}</h2>
      <p className="text-slate-600">This page is coming soon!</p>
    </div>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('authToken');
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected Routes - Require Login */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout><Dashboard /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Layout><ComingSoon pageName="My Profile" /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/course-registration" element={
        <ProtectedRoute>
          <Layout><CourseRegistration /></Layout>
        </ProtectedRoute>
        } />
        <Route path="/my-courses" element={
          <ProtectedRoute>
            <Layout><ComingSoon pageName="My Courses" /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/timetable" element={
          <ProtectedRoute>
            <Layout><ComingSoon pageName="Timetable" /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/attendance" element={
          <ProtectedRoute>
            <Layout><ComingSoon pageName="Attendance" /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/grades" element={
          <ProtectedRoute>
            <Layout><ComingSoon pageName="Grades" /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/fees" element={
          <ProtectedRoute>
            <Layout><ComingSoon pageName="Fees" /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/announcements" element={
          <ProtectedRoute>
            <Layout><ComingSoon pageName="Announcements" /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/faculty" element={
          <ProtectedRoute>
            <Layout><ComingSoon pageName="Faculty Directory" /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/library" element={
          <ProtectedRoute>
            <Layout><ComingSoon pageName="Library" /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/exams" element={
          <ProtectedRoute>
            <Layout><ComingSoon pageName="Exams" /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/events" element={
          <ProtectedRoute>
            <Layout><ComingSoon pageName="Events" /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/support" element={
          <ProtectedRoute>
            <Layout><ComingSoon pageName="Support" /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <Layout><ComingSoon pageName="Settings" /></Layout>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;