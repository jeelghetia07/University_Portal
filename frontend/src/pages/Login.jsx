import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, BookOpen, AlertCircle, CheckCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const navigate = useNavigate();

  // Check if user just signed up
  useEffect(() => {
    const justSignedUp = localStorage.getItem('justSignedUp');
    const signupEmail = localStorage.getItem('signupEmail');
    
    if (justSignedUp === 'true') {
      setShowSuccessMessage(true);
      setEmail(signupEmail || '');
      
      // Clear the signup flag
      localStorage.removeItem('justSignedUp');
      
      // Hide message after 5 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
    }
  }, []);

  // Email validation function
  const validateEmail = (email) => {
    // Check if email ends with @university.edu
    if (!email.endsWith('@university.edu')) {
      return { valid: false, message: 'Please use your university email (@university.edu)' };
    }

    // Extract roll number (part before @)
    const rollNumber = email.split('@')[0].toUpperCase();

    // Check if roll number has valid format (e.g., 24BCP001)
    // Format: YearBDeptCodeNumber
    const rollPattern = /^\d{2}B[A-Z]{2}\d{3,}$/;
    
    if (!rollPattern.test(rollNumber)) {
      return { 
        valid: false, 
        message: 'Invalid roll number format. Use format like 24BCP001@university.edu' 
      };
    }

    // Valid department codes
    const validDeptCodes = ['CP', 'IT', 'EC', 'CV', 'ME', 'EE'];
    const deptCode = rollNumber.substring(3, 5).toUpperCase();

    if (!validDeptCodes.includes(deptCode)) {
      return { 
        valid: false, 
        message: `Invalid department code "${deptCode}". Valid codes: CP, IT, EC, CV, ME, EE` 
      };
    }

    return { valid: true, message: '' };
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simple validation
    if (!email || !password) {
      setError('Please enter both email and password');
      setLoading(false);
      return;
    }

    // Validate email format
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      setError(emailValidation.message);
      setLoading(false);
      return;
    }

    setTimeout(() => {
      // Extract roll number from email
      const rollNumber = email.split('@')[0].toUpperCase();
      
      // Get department from roll number
      const getDepartmentFromRollNumber = (rollNumber) => {
        if (!rollNumber || rollNumber.length < 5) return 'Computer Science';
        
        const deptCode = rollNumber.substring(3, 5).toUpperCase();
        const deptMap = {
          'CP': 'Computer Science',
          'IT': 'Information Technology',
          'EC': 'Electronics & Communication',
          'CV': 'Civil Engineering',
          'ME': 'Mechanical Engineering',
          'EE': 'Electrical Engineering'
        };
        
        return deptMap[deptCode] || 'Computer Science';
      };
      
      const department = getDepartmentFromRollNumber(rollNumber);
      
      // Store auth data
      localStorage.setItem('authToken', 'dummy-token-12345');
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userRollNumber', rollNumber);
      localStorage.setItem('userDepartment', department);
      localStorage.setItem('userName', rollNumber); // You can improve this later
      
      setLoading(false);
      navigate('/dashboard');
    }, 1000);
  };

  const handleCreateAccount = () => {
    // Open signup in new tab
    window.open('/signup', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-2xl mb-4">
            <BookOpen className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">UniPortal</h1>
          <p className="text-indigo-100">Student Portal Login</p>
        </div>

        {/* Success Message (After Signup) */}
        {showSuccessMessage && (
          <div className="mb-6 bg-green-50 border-2 border-green-500 rounded-xl p-4 animate-fadeIn">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-green-900 font-semibold text-lg">Account Created Successfully! 🎉</h3>
                <p className="text-green-700 text-sm mt-1">You can now login with your credentials.</p>
              </div>
            </div>
          </div>
        )}

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Welcome back!</h2>
            <p className="text-slate-600 mt-1">Please login to your account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                University Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="24BCP001@university.edu"
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                Forgot password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Logging in...</span>
                </span>
              ) : (
                'Login'
              )}
            </button>
          </form>

          {/* Valid Email Format Info */}
          <div className="mt-4 p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
            <p className="text-xs text-indigo-700">
              <strong>Email Format:</strong> Use your university email
            </p>
            <p className="text-xs text-indigo-600 mt-1">
              Example: 24BCP001@university.edu
            </p>
            <p className="text-xs text-indigo-600 mt-1">
              Valid Departments: CP, IT, EC, CV, ME, EE
            </p>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-500">Don't have an account?</span>
            </div>
          </div>

          {/* Sign Up Button - Opens in New Tab */}
          <button
            type="button"
            onClick={handleCreateAccount}
            className="w-full text-center py-3 border-2 border-indigo-600 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-all"
          >
            Create Account
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-indigo-100 text-sm mt-6">
          © 2025 University Portal. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;