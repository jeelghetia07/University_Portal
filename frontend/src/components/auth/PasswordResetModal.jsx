import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Lock, X } from 'lucide-react';

const getInitialPasswordData = () => ({
  newPassword: '',
  confirmPassword: '',
});

const PasswordResetModal = ({
  isOpen,
  onClose,
  onSuccess,
  successButtonLabel = 'Done',
  forceLight = false,
}) => {
  const [resetStep, setResetStep] = useState('request');
  const [resetOtp, setResetOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [resetPasswordData, setResetPasswordData] = useState(getInitialPasswordData());
  const [resetError, setResetError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setResetStep('request');
      setResetOtp('');
      setGeneratedOtp('');
      setResetPasswordData(getInitialPasswordData());
      setResetError('');
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const panelClassName = forceLight
    ? 'bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 border border-slate-200'
    : 'bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md p-6 border border-slate-200 dark:border-slate-700';

  const headingClassName = forceLight
    ? 'text-2xl font-bold text-slate-900'
    : 'text-2xl font-bold text-slate-900 dark:text-slate-100';

  const subheadingClassName = forceLight
    ? 'text-sm text-slate-600 mt-1'
    : 'text-sm text-slate-600 dark:text-slate-400 mt-1';

  const recoveryEmail = localStorage.getItem('signupRecoveryEmail') || '';

  const maskEmail = (value) => {
    if (!value || !value.includes('@')) return value || 'Not available';

    const [localPart, domain] = value.split('@');
    if (localPart.length <= 2) {
      return `${localPart[0] || ''}***@${domain}`;
    }

    return `${localPart.slice(0, 2)}***${localPart.slice(-1)}@${domain}`;
  };

  const handleResetRequest = (e) => {
    e.preventDefault();
    setResetError('');

    if (!recoveryEmail) {
      setResetError('No recovery email is configured for this account in demo mode.');
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
      setResetError('Enter and confirm your new password.');
      return;
    }

    if (resetPasswordData.newPassword.length < 6) {
      setResetError('Password must be at least 6 characters.');
      return;
    }

    if (resetPasswordData.newPassword !== resetPasswordData.confirmPassword) {
      setResetError('Passwords do not match.');
      return;
    }

    localStorage.setItem('mockResetPassword', resetPasswordData.newPassword);
    setResetStep('success');
    if (onSuccess) {
      onSuccess(resetPasswordData.newPassword);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={panelClassName}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className={headingClassName}>Reset Password</h2>
            <p className={subheadingClassName}>
              {resetStep === 'request' && 'Send OTP to your saved recovery email'}
              {resetStep === 'verify' && 'Verify the OTP sent to your recovery email'}
              {resetStep === 'reset' && 'Create a new password'}
              {resetStep === 'success' && 'Password reset completed'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={forceLight
              ? 'text-slate-400 hover:text-slate-600 transition-colors'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors'}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {resetError && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg flex items-center space-x-2 text-red-700 dark:text-red-300">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{resetError}</span>
          </div>
        )}

        {resetStep === 'request' && (
          <form onSubmit={handleResetRequest} className="space-y-4">
            <div className="p-4 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900 rounded-lg">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Recovery email</p>
              <p className="text-base font-semibold text-indigo-900 dark:text-indigo-300">
                {maskEmail(recoveryEmail)}
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
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900 rounded-lg">
              <p className="text-sm text-indigo-800 dark:text-indigo-300">
                OTP has been sent to <strong>{maskEmail(recoveryEmail)}</strong>
              </p>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-2">
                Demo OTP: <strong>{generatedOtp}</strong>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Enter OTP
              </label>
              <input
                type="text"
                value={resetOtp}
                onChange={(e) => setResetOtp(e.target.value)}
                placeholder="6-digit OTP"
                maxLength={6}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 tracking-[0.3em]"
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
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
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
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
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
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-500"
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
            <div className="w-16 h-16 bg-green-100 dark:bg-green-950/40 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Password Updated</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-5">
              Your password reset flow is complete in demo mode. Backend integration will make this permanent.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all"
            >
              {successButtonLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordResetModal;
