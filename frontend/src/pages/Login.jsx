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
  X,
} from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [resetStep, setResetStep] = useState('request');
  const [resetOtp, setResetOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [resetPasswordData, setResetPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [resetError, setResetError] = useState('');
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
    setResetStep('request');
    setResetOtp('');
    setGeneratedOtp('');
    setResetPasswordData({ newPassword: '', confirmPassword: '' });
    setResetError('');
  };

  const closeForgotPasswordModal = () => {
    setShowForgotPasswordModal(false);
    setResetStep('request');
    setResetOtp('');
    setGeneratedOtp('');
    setResetPasswordData({ newPassword: '', confirmPassword: '' });
    setResetError('');
  };

  const maskEmail = (value) => {
    if (!value || !value.includes('@')) return value;

    const [localPart, domain] = value.split('@');
    if (localPart.length <= 2) {
      return `${localPart[0] || ''}***@${domain}`;
    }

    return `${localPart.slice(0, 2)}***${localPart.slice(-1)}@${domain}`;
  };

  const handleResetRequest = (e) => {
    e.preventDefault();
    setResetError('');

    const savedRecoveryEmail = localStorage.getItem('signupRecoveryEmail');

    if (!savedRecoveryEmail) {
      setResetError('No recovery email is configured for this account in demo mode');
      return;
    }

    const otp = `${Math.floor(100000 + Math.random() * 900000)}`;
    setGeneratedOtp(otp);
    setResetStep('verify');
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setResetError('');

    if (resetOtp !== generatedOtp) {
      setResetError('Invalid OTP. Use the demo OTP shown below.');
      return;
    }

    setResetStep('reset');
  };

  const handleResetPasswordSubmit = (e) => {
    e.preventDefault();
    setResetError('');

    if (!resetPasswordData.newPassword || !resetPasswordData.confirmPassword) {
      setResetError('Enter and confirm your new password');
      return;
    }

    if (resetPasswordData.newPassword.length < 6) {
      setResetError('Password must be at least 6 characters');
      return;
    }

    if (resetPasswordData.newPassword !== resetPasswordData.confirmPassword) {
      setResetError('Passwords do not match');
      return;
    }

    localStorage.setItem('mockResetPassword', resetPasswordData.newPassword);
    setResetStep('success');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
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

      {showForgotPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Reset Password</h2>
                <p className="text-sm text-slate-600 mt-1">
                  {resetStep === 'request' && 'Send OTP to your saved recovery email'}
                  {resetStep === 'verify' && 'Verify the OTP sent to your recovery email'}
                  {resetStep === 'reset' && 'Create a new password'}
                  {resetStep === 'success' && 'Password reset completed'}
                </p>
              </div>
              <button
                type="button"
                onClick={closeForgotPasswordModal}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {resetError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{resetError}</span>
              </div>
            )}

            {resetStep === 'request' && (
              <form onSubmit={handleResetRequest} className="space-y-4">
                <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                  <p className="text-sm text-slate-600 mb-1">Recovery email</p>
                  <p className="text-base font-semibold text-indigo-900">
                    {maskEmail(localStorage.getItem('signupRecoveryEmail') || 'Not available')}
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all"
                >
                  Send OTP
                </button>
              </form>
            )}

            {resetStep === 'verify' && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                  <p className="text-sm text-indigo-800">
                    OTP has been sent to <strong>{maskEmail(localStorage.getItem('signupRecoveryEmail') || '')}</strong>
                  </p>
                  <p className="text-xs text-indigo-600 mt-2">
                    Demo OTP: <strong>{generatedOtp}</strong>
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    value={resetOtp}
                    onChange={(e) => setResetOtp(e.target.value)}
                    placeholder="6-digit OTP"
                    maxLength={6}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-900 placeholder:text-slate-500 tracking-[0.3em]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all"
                >
                  Verify OTP
                </button>
              </form>
            )}

            {resetStep === 'reset' && (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="password"
                      value={resetPasswordData.newPassword}
                      onChange={(e) =>
                        setResetPasswordData({
                          ...resetPasswordData,
                          newPassword: e.target.value,
                        })
                      }
                      placeholder="Enter new password"
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-900 placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="password"
                      value={resetPasswordData.confirmPassword}
                      onChange={(e) =>
                        setResetPasswordData({
                          ...resetPasswordData,
                          confirmPassword: e.target.value,
                        })
                      }
                      placeholder="Re-enter new password"
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-900 placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all"
                >
                  Update Password
                </button>
              </form>
            )}

            {resetStep === 'success' && (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Password Updated</h3>
                <p className="text-slate-600 mb-5">
                  Your password reset flow is complete in demo mode. Backend integration will make this permanent.
                </p>
                <button
                  type="button"
                  onClick={closeForgotPasswordModal}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all"
                >
                  Back to Login
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
