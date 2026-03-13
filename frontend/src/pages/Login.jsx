import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  BookOpen,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import PasswordResetModal from '../components/auth/PasswordResetModal';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const navigate = useNavigate();

  const syncSignupState = () => {
    const justSignedUp = localStorage.getItem('justSignedUp');
    const signupEmail = localStorage.getItem('signupEmail');

    if (justSignedUp === 'true') {
      setShowSuccessMessage(true);
      setEmail(signupEmail || '');

      localStorage.removeItem('justSignedUp');

      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
    }
  };

  useEffect(() => {
    syncSignupState();

    const handleWindowFocus = () => {
      syncSignupState();
    };

    const handleStorage = (event) => {
      if (event.key === 'justSignedUp' || event.key === 'signupEmail') {
        syncSignupState();
      }
    };

    window.addEventListener('focus', handleWindowFocus);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const validateEmail = (value) => {
    if (!value.endsWith('@university.edu')) {
      return { valid: false, message: 'Please use your university email (@university.edu)' };
    }

    const rollNumber = value.split('@')[0].toUpperCase();
    const rollPattern = /^\d{2}B[A-Z]{2}\d{3,}$/;

    if (!rollPattern.test(rollNumber)) {
      return {
        valid: false,
        message: 'Invalid roll number format. Use format like 24BCP001@university.edu',
      };
    }

    const validDeptCodes = ['CP', 'IT', 'EC', 'CV', 'ME', 'EE'];
    const deptCode = rollNumber.substring(3, 5).toUpperCase();

    if (!validDeptCodes.includes(deptCode)) {
      return {
        valid: false,
        message: `Invalid department code "${deptCode}". Valid codes: CP, IT, EC, CV, ME, EE`,
      };
    }

    return { valid: true, message: '' };
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please enter both email and password');
      setLoading(false);
      return;
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      setError(emailValidation.message);
      setLoading(false);
      return;
    }

    setTimeout(() => {
      const rollNumber = email.split('@')[0].toUpperCase();

      const getDepartmentFromRollNumber = (value) => {
        if (!value || value.length < 5) return 'Computer Science';

        const deptCode = value.substring(3, 5).toUpperCase();
        const deptMap = {
          CP: 'Computer Science',
          IT: 'Information Technology',
          EC: 'Electronics & Communication',
          CV: 'Civil Engineering',
          ME: 'Mechanical Engineering',
          EE: 'Electrical Engineering',
        };

        return deptMap[deptCode] || 'Computer Science';
      };

      const department = getDepartmentFromRollNumber(rollNumber);

      localStorage.setItem('authToken', 'dummy-token-12345');
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userRollNumber', rollNumber);
      localStorage.setItem('userDepartment', department);
      localStorage.setItem('userName', rollNumber);

      setLoading(false);
      navigate('/dashboard');
    }, 1000);
  };

  const handleCreateAccount = () => {
    window.open('/signup', '_blank');
  };

  const openForgotPasswordModal = () => {
    setShowForgotPasswordModal(true);
  };

  const closeForgotPasswordModal = () => {
    setShowForgotPasswordModal(false);
  };

  return (
    <div className="auth-page min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-2xl mb-4">
            <BookOpen className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">UniPortal</h1>
          <p className="text-indigo-100">Student Portal Login</p>
        </div>

        {showSuccessMessage && (
          <div className="mb-6 bg-green-50 border-2 border-green-500 rounded-xl p-4 animate-fadeIn">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-green-900 font-semibold text-lg">Account Created Successfully!</h3>
                <p className="text-green-700 text-sm mt-1">You can now login with your credentials.</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Welcome back!</h2>
            <p className="text-slate-600 mt-1">Please login to your account</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
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
                  placeholder="Enter your university Email."
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-500 text-slate-900"
                />
              </div>
            </div>

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
                  className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-500 text-slate-900"
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
              <button
                type="button"
                onClick={openForgotPasswordModal}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Forgot password?
              </button>
            </div>

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

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-500">Don't have an account?</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCreateAccount}
            className="w-full text-center py-3 border-2 border-indigo-600 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-all"
          >
            Create Account
          </button>
        </div>

        <p className="text-center text-indigo-100 text-sm mt-6">
          (c) 2025 University Portal. All rights reserved.
        </p>
      </div>

      <PasswordResetModal
        isOpen={showForgotPasswordModal}
        onClose={closeForgotPasswordModal}
        successButtonLabel="Back to Login"
        forceLight
      />
    </div>
  );
};

export default Login;
