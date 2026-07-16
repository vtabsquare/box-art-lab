import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  User, Mail, Phone, MapPin, ArrowRight, ArrowLeft,
  Loader2, CheckCircle2, Box, Sparkles, ShieldCheck,
  KeyRound, RefreshCw, Eye, EyeOff, Lock
} from 'lucide-react';
import { sendVerificationEmail, verifyOTP } from '@/lib/brevoService';
import { registerUser, loginUser, changePasswordInSheet, hashPassword } from '@/lib/googleSheetsService';

type Mode = 'login' | 'register' | 'forgot' | 'reset';
type Step = 'details' | 'verification' | 'success';

interface FormData {
  name: string;
  email: string;
  mobile: string;
  location: string;
}

interface FieldErrors {
  name?: string;
  email?: string;
  mobile?: string;
  location?: string;
  password?: string;
  confirmPassword?: string;
}

const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Auth state machine initialized dynamically
  const [mode, setMode] = useState<Mode>(() => {
    const stateVal = (location.state as { initialMode?: Mode })?.initialMode;
    return stateVal || 'login';
  });

  const [step, setStep] = useState<Step>('details');
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    mobile: '',
    location: '',
  });
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  
  const [errors, setErrors] = useState<FieldErrors>({});
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  
  const [loading, setLoading] = useState(false);
  const [demoCode, setDemoCode] = useState<string | null>(null);
  const [otpError, setOtpError] = useState('');
  const [resending, setResending] = useState(false);
  
  // Failed OTP Lockout & Cooldown states
  const [lockoutSecs, setLockoutSecs] = useState(0);
  const [resendSecs, setResendSecs] = useState(0);

  // Monitor OTP Lockout Timer
  useEffect(() => {
    const checkTimer = () => {
      const lockoutTimeStr = localStorage.getItem('otpLockoutTime');
      if (lockoutTimeStr) {
        const remaining = parseInt(lockoutTimeStr, 10) - Date.now();
        if (remaining > 0) {
          setLockoutSecs(Math.ceil(remaining / 1000));
        } else {
          setLockoutSecs(0);
          localStorage.removeItem('otpLockoutTime');
          localStorage.setItem('otpFailedAttempts', '0');
        }
      } else {
        setLockoutSecs(0);
      }
    };

    checkTimer();
    const interval = setInterval(checkTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  // Monitor Resend OTP Cooldown Timer
  useEffect(() => {
    if (resendSecs <= 0) return;
    const timer = setTimeout(() => {
      setResendSecs((s) => s - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [resendSecs]);

  const getRemainingLockoutTime = (): string => {
    const mins = Math.floor(lockoutSecs / 60);
    const secs = lockoutSecs % 60;
    return `${mins}m ${secs}s`;
  };

  const getPasswordStrength = (pwd: string) => {
    let score = 0;
    if (!pwd) return { label: 'Empty', color: 'bg-muted', percentage: 0 };
    if (pwd.length >= 12) score += 1;
    if (/[a-z]/.test(pwd)) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/\d/.test(pwd)) score += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) score += 1;

    if (score <= 2) return { label: 'Weak', color: 'bg-destructive', percentage: 25 };
    if (score <= 4) return { label: 'Fair', color: 'bg-amber-500', percentage: 50 };
    if (score < 5) return { label: 'Good', color: 'bg-blue-500', percentage: 75 };
    return { label: 'Strong', color: 'bg-emerald-500', percentage: 100 };
  };

  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 12) return 'Password must be at least 12 characters long';
    if (pwd.length > 128) return 'Password must not exceed 128 characters';
    if (!/[a-z]/.test(pwd)) return 'Password must contain at least one lowercase letter';
    if (!/[A-Z]/.test(pwd)) return 'Password must contain at least one uppercase letter';
    if (!/\d/.test(pwd)) return 'Password must contain at least one number';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) return 'Password must contain at least one special character';
    return null;
  };

  const validate = (): boolean => {
    const newErrors: FieldErrors = {};
    
    if (mode === 'register') {
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
      if (!formData.mobile.trim()) {
        newErrors.mobile = 'Mobile number is required';
      } else if (!/^[\d\s\-+()]{7,15}$/.test(formData.mobile)) {
        newErrors.mobile = 'Invalid phone number';
      }
      if (!formData.location.trim()) newErrors.location = 'Location is required';
      
      const pwdError = validatePassword(password);
      if (pwdError) newErrors.password = pwdError;
    }
    
    if (mode === 'login') {
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
      if (!password) newErrors.password = 'Password is required';
    }

    if (mode === 'forgot') {
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
    }

    if (mode === 'reset') {
      const pwdError = validatePassword(password);
      if (pwdError) newErrors.password = pwdError;
      if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Step 1 details
  const handleSubmitDetails = async () => {
    if (!validate()) return;
    
    if (mode === 'login') {
      setLoading(true);
      try {
        const pwdHash = await hashPassword(password);
        const result = await loginUser(formData.email, pwdHash);
        if (result.success && result.user) {
          localStorage.setItem('userName', result.user.name);
          localStorage.setItem('userEmail', result.user.email);
          localStorage.setItem('userMobile', result.user.mobile);
          localStorage.setItem('userLocation', result.user.location);
          
          setStep('success');
          setTimeout(() => navigate('/home'), 2200);
        } else {
          setErrors({ password: result.error || 'Login failed' });
        }
      } catch (err) {
        setErrors({ password: 'Login failed due to a network error' });
      } finally {
        setLoading(false);
      }
      return;
    }
    
    // Register / Forgot flows trigger OTP
    setLoading(true);
    try {
      const result = await sendVerificationEmail(formData.email, formData.name || 'User');
      if (result.success) {
        if (result.code) setDemoCode(result.code);
        setStep('verification');
        setResendSecs(60);
      } else {
        setErrors({ email: result.error || 'Failed to send verification code' });
      }
    } catch (err) {
      console.error('Email send error:', err);
      setErrors({ email: 'Failed to send code' });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError('');

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      const lastInput = document.getElementById('otp-5');
      lastInput?.focus();
    }
  };

  // Verify OTP Action
  const handleVerify = async () => {
    // Check brute-force lockout status
    const lockoutTimeStr = localStorage.getItem('otpLockoutTime');
    if (lockoutTimeStr && Date.now() < parseInt(lockoutTimeStr, 10)) {
      setOtpError(`Too many failed attempts. Locked out for ${getRemainingLockoutTime()}.`);
      return;
    }

    const code = otp.join('');
    if (code.length !== 6) {
      setOtpError('Please enter all 6 digits');
      return;
    }
    setLoading(true);
    try {
      const isValid = verifyOTP(formData.email, code);
      if (isValid) {
        // Reset brute-force lockout counters
        localStorage.removeItem('otpLockoutTime');
        localStorage.setItem('otpFailedAttempts', '0');

        if (mode === 'register') {
          const pwdHash = await hashPassword(password);
          const result = await registerUser(formData, pwdHash);
          
          if (result.success) {
            localStorage.setItem('userName', formData.name);
            localStorage.setItem('userEmail', formData.email);
            localStorage.setItem('userMobile', formData.mobile);
            localStorage.setItem('userLocation', formData.location);
            setStep('success');
            setTimeout(() => navigate('/home'), 2200);
          } else {
            setOtpError(result.error || 'Registration failed. Please try again.');
          }
        } else if (mode === 'forgot') {
          // Verify success for forgot password -> Go to reset screen
          setMode('reset');
          setStep('details');
          setPassword('');
          setConfirmPassword('');
        }
      } else {
        // Handle failed attempts increment
        const attemptsStr = localStorage.getItem('otpFailedAttempts') || '0';
        const attempts = parseInt(attemptsStr, 10) + 1;
        localStorage.setItem('otpFailedAttempts', attempts.toString());
        
        if (attempts >= 5) {
          const lockoutTime = Date.now() + 15 * 60 * 1000;
          localStorage.setItem('otpLockoutTime', lockoutTime.toString());
          setOtpError('Too many failed attempts. You are locked out for 15 minutes.');
        } else {
          setOtpError(`Invalid code. ${5 - attempts} attempts remaining.`);
        }
      }
    } catch (err) {
      setOtpError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP Action
  const handleResend = async () => {
    if (resendSecs > 0) return;
    setResending(true);
    setOtp(['', '', '', '', '', '']);
    setOtpError('');
    try {
      const result = await sendVerificationEmail(formData.email, formData.name || 'User');
      if (result.success) {
        if (result.code) setDemoCode(result.code);
        setResendSecs(60);
      } else {
        setOtpError(result.error || 'Failed to resend code');
      }
    } catch (err) {
      console.error('Resend error:', err);
      setOtpError('Failed to resend code');
    } finally {
      setResending(false);
    }
  };

  // Handle new password submit in Reset mode
  const handleResetPassword = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const pwdHash = await hashPassword(password);
      const result = await changePasswordInSheet(formData.email, pwdHash);
      if (result.success) {
        setStep('success');
        setTimeout(() => {
          setMode('login');
          setStep('details');
          setPassword('');
          setFormData({ name: '', email: '', mobile: '', location: '' });
        }, 2200);
      } else {
        setErrors({ password: result.error || 'Failed to update password' });
      }
    } catch (err) {
      setErrors({ password: 'Failed to update password' });
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const strength = getPasswordStrength(password);

  return (
    <div className="register-page">
      {/* Background effects */}
      <div className="qr-bg-effects">
        <div className="qr-orb qr-orb-1" />
        <div className="qr-orb qr-orb-2" />
        <div className="qr-orb qr-orb-3" />
        <div className="qr-grid-pattern" />
      </div>

      <div className="register-content-wrapper">
        {/* Brand header */}
        <motion.div
          className="qr-brand register-brand"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <button onClick={() => navigate('/')} className="qr-logo-icon register-logo-btn">
            <Box className="qr-logo-box-icon" />
          </button>
          <h1 className="qr-brand-name register-brand-name">Box Art Lab</h1>
        </motion.div>

        {/* Progress indicator (Only during register wizard flow) */}
        {mode === 'register' && (
          <motion.div
            className="register-progress"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className={`register-progress-step ${step === 'details' ? 'active' : step !== 'details' ? 'completed' : ''}`}>
              <div className="register-progress-dot">
                {step !== 'details' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <span>1</span>}
              </div>
              <span className="register-progress-label">Details</span>
            </div>
            <div className={`register-progress-line ${step !== 'details' ? 'active' : ''}`} />
            <div className={`register-progress-step ${step === 'verification' ? 'active' : step === 'success' ? 'completed' : ''}`}>
              <div className="register-progress-dot">
                {step === 'success' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <span>2</span>}
              </div>
              <span className="register-progress-label">Verify</span>
            </div>
            <div className={`register-progress-line ${step === 'success' ? 'active' : ''}`} />
            <div className={`register-progress-step ${step === 'success' ? 'active' : ''}`}>
              <div className="register-progress-dot"><span>3</span></div>
              <span className="register-progress-label">Done</span>
            </div>
          </motion.div>
        )}

        {/* Main interactive auth card */}
        <AnimatePresence mode="wait">
          
          {/* ── SUCCESS SCREEN ── */}
          {step === 'success' && (
            <motion.div
              key="success"
              className="register-card register-success-card"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
            >
              <div className="register-card-glow success-glow" />
              <div className="register-card-inner register-success-inner">
                <motion.div
                  className="register-success-check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                >
                  <div className="register-success-ring" />
                  <CheckCircle2 className="register-success-icon" />
                </motion.div>
                <motion.h2
                  className="register-success-title"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {mode === 'reset' ? 'Password Updated!' : `Welcome, ${formData.name ? formData.name.split(' ')[0] : 'User'}!`}
                </motion.h2>
                <motion.p
                  className="register-success-desc"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  {mode === 'reset' 
                    ? 'Your password has been changed. Redirecting to login...' 
                    : 'Verification complete. Redirecting you to the studio...'}
                </motion.p>
                <motion.div
                  className="register-success-loader animate-pulse bg-amber-500"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 0.3, duration: 1.9, ease: 'easeInOut' }}
                />
              </div>
            </motion.div>
          )}

          {/* ── VERIFICATION CODE (OTP) SCREEN ── */}
          {step === 'verification' && (
            <motion.div
              key="verification"
              className="register-card"
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50, scale: 0.95 }}
              transition={{ duration: 0.5, type: 'spring', stiffness: 120 }}
            >
              <div className="register-card-glow" />
              <div className="register-card-inner">
                <div className="register-card-header">
                  <div className="register-card-icon-wrapper verify-icon">
                    <ShieldCheck className="register-card-icon" />
                  </div>
                  <h2 className="register-card-title">Verify Your Email</h2>
                  <p className="register-card-desc">
                    We've sent a 6-digit verification code to{' '}
                    <strong className="register-email-highlight">{formData.email}</strong>
                  </p>
                </div>

                {/* Demo mode hint if no real key */}
                {demoCode && (
                  <motion.div
                    className="register-demo-hint"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>Demo Mode — Your code: <strong>{demoCode}</strong></span>
                  </motion.div>
                )}

                {/* OTP Input block */}
                <div className="register-otp-section">
                  <div className="register-otp-inputs" onPaste={handleOtpPaste}>
                    {otp.map((digit, i) => (
                      <motion.input
                        key={i}
                        id={`otp-${i}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        className={`register-otp-input ${digit ? 'has-value' : ''} ${otpError ? 'has-error' : ''}`}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.05 }}
                      />
                    ))}
                  </div>

                  {otpError && (
                    <motion.p
                      className="register-otp-error"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {otpError}
                    </motion.p>
                  )}

                  {/* Resend Cooldown Counter */}
                  <button
                    className="register-resend-btn"
                    onClick={handleResend}
                    disabled={resending || resendSecs > 0}
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
                    <span>
                      {resending 
                        ? 'Resending...' 
                        : resendSecs > 0 
                        ? `Resend available in ${resendSecs}s` 
                        : "Didn't receive the code? Resend"}
                    </span>
                  </button>
                </div>

                <motion.button
                  className="register-submit-btn"
                  onClick={handleVerify}
                  disabled={loading || otp.join('').length !== 6 || lockoutSecs > 0}
                  whileHover={{ scale: loading || lockoutSecs > 0 ? 1 : 1.02 }}
                  whileTap={{ scale: loading || lockoutSecs > 0 ? 1 : 0.98 }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : lockoutSecs > 0 ? (
                    <span>Locked Out ({getRemainingLockoutTime()})</span>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5" />
                      <span>Verify & Continue</span>
                    </>
                  )}
                </motion.button>

                <button 
                  className="register-back-link" 
                  onClick={() => {
                    setStep('details');
                    setOtpError('');
                    setOtp(['', '', '', '', '', '']);
                  }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* ── DETAILS (LOGIN / REGISTER / FORGOT / RESET) INPUT SCREENS ── */}
          {step === 'details' && (
            <motion.div
              key={mode}
              className="register-card"
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            >
              <div className="register-card-glow" />
              <div className="register-card-inner">
                
                {/* Header Section */}
                <div className="register-card-header">
                  <div className="register-card-icon-wrapper">
                    <Sparkles className="register-card-icon" />
                  </div>
                  <h2 className="register-card-title">
                    {mode === 'login' && 'Welcome Back'}
                    {mode === 'register' && 'Create Account'}
                    {mode === 'forgot' && 'Reset Password'}
                    {mode === 'reset' && 'Choose New Password'}
                  </h2>
                  <p className="register-card-desc">
                    {mode === 'login' && 'Access the premium packaging design studio'}
                    {mode === 'register' && 'Fill in details to set up your design workspace'}
                    {mode === 'forgot' && 'Enter your registered email to request a reset code'}
                    {mode === 'reset' && 'Set a strong password for your account'}
                  </p>
                </div>

                {/* Form fields */}
                <div className="register-form">
                  
                  {/* --- MODE: LOGIN --- */}
                  {mode === 'login' && (
                    <>
                      <div className="register-field">
                        <label className="register-label">Email Address</label>
                        <div className={`register-input-wrapper ${errors.email ? 'register-input-error' : ''}`}>
                          <Mail className="register-input-icon" />
                          <input
                            type="email"
                            placeholder="your@email.com"
                            value={formData.email}
                            onChange={(e) => updateField('email', e.target.value)}
                            className="register-input"
                          />
                        </div>
                        {errors.email && <p className="register-error-text">{errors.email}</p>}
                      </div>

                      <div className="register-field">
                        <div className="flex justify-between items-center mb-2">
                          <label className="register-label mb-0">Password</label>
                          <button 
                            type="button" 
                            className="text-xs text-amber-500 hover:text-amber-400 font-body"
                            onClick={() => {
                              setMode('forgot');
                              setErrors({});
                            }}
                          >
                            Forgot Password?
                          </button>
                        </div>
                        <div className={`relative register-input-wrapper ${errors.password ? 'register-input-error' : ''}`}>
                          <Lock className="register-input-icon" />
                          <input
                            type={passwordVisible ? 'text' : 'password'}
                            placeholder="••••••••••••"
                            value={password}
                            onChange={(e) => {
                              setPassword(e.target.value);
                              if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
                            }}
                            className="register-input pr-12"
                          />
                          <button
                            type="button"
                            onClick={() => setPasswordVisible(!passwordVisible)}
                            className="absolute right-4 text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center"
                          >
                            {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                        {errors.password && <p className="register-error-text">{errors.password}</p>}
                      </div>
                    </>
                  )}

                  {/* --- MODE: REGISTER --- */}
                  {mode === 'register' && (
                    <>
                      <div className="register-field">
                        <label className="register-label">Full Name</label>
                        <div className={`register-input-wrapper ${errors.name ? 'register-input-error' : ''}`}>
                          <User className="register-input-icon" />
                          <input
                            type="text"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={(e) => updateField('name', e.target.value)}
                            className="register-input"
                          />
                        </div>
                        {errors.name && <p className="register-error-text">{errors.name}</p>}
                      </div>

                      <div className="register-field">
                        <label className="register-label">Email Address</label>
                        <div className={`register-input-wrapper ${errors.email ? 'register-input-error' : ''}`}>
                          <Mail className="register-input-icon" />
                          <input
                            type="email"
                            placeholder="your@email.com"
                            value={formData.email}
                            onChange={(e) => updateField('email', e.target.value)}
                            className="register-input"
                          />
                        </div>
                        {errors.email && <p className="register-error-text">{errors.email}</p>}
                      </div>

                      <div className="register-field">
                        <label className="register-label">Mobile Number</label>
                        <div className={`register-input-wrapper ${errors.mobile ? 'register-input-error' : ''}`}>
                          <Phone className="register-input-icon" />
                          <input
                            type="tel"
                            placeholder="+91 98765 43210"
                            value={formData.mobile}
                            onChange={(e) => updateField('mobile', e.target.value)}
                            className="register-input"
                          />
                        </div>
                        {errors.mobile && <p className="register-error-text">{errors.mobile}</p>}
                      </div>

                      <div className="register-field">
                        <label className="register-label">Location</label>
                        <div className={`register-input-wrapper ${errors.location ? 'register-input-error' : ''}`}>
                          <MapPin className="register-input-icon" />
                          <input
                            type="text"
                            placeholder="City, Country"
                            value={formData.location}
                            onChange={(e) => updateField('location', e.target.value)}
                            className="register-input"
                          />
                        </div>
                        {errors.location && <p className="register-error-text">{errors.location}</p>}
                      </div>

                      <div className="register-field">
                        <label className="register-label">Create Password</label>
                        <div className={`relative register-input-wrapper ${errors.password ? 'register-input-error' : ''}`}>
                          <Lock className="register-input-icon" />
                          <input
                            type={passwordVisible ? 'text' : 'password'}
                            placeholder="Min 12 chars (Abcde@#12345)"
                            value={password}
                            onChange={(e) => {
                              setPassword(e.target.value);
                              if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
                            }}
                            className="register-input pr-12"
                          />
                          <button
                            type="button"
                            onClick={() => setPasswordVisible(!passwordVisible)}
                            className="absolute right-4 text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center"
                          >
                            {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                        {password && (
                          <div className="mt-2">
                            <div className="flex justify-between items-center text-xs mb-1 font-body">
                              <span className="text-muted-foreground">Password strength:</span>
                              <span className={
                                strength.label === 'Strong' ? 'text-emerald-500 font-semibold' :
                                strength.label === 'Good' ? 'text-blue-400' :
                                strength.label === 'Fair' ? 'text-amber-500' : 'text-destructive'
                              }>{strength.label}</span>
                            </div>
                            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                              <div 
                                className={`h-full transition-all duration-300 ${strength.color}`} 
                                style={{ width: `${strength.percentage}%` }}
                              />
                            </div>
                          </div>
                        )}
                        {errors.password && <p className="register-error-text">{errors.password}</p>}
                      </div>
                    </>
                  )}

                  {/* --- MODE: FORGOT PASSWORD --- */}
                  {mode === 'forgot' && (
                    <div className="register-field">
                      <label className="register-label">Email Address</label>
                      <div className={`register-input-wrapper ${errors.email ? 'register-input-error' : ''}`}>
                        <Mail className="register-input-icon" />
                        <input
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) => updateField('email', e.target.value)}
                          className="register-input"
                        />
                      </div>
                      {errors.email && <p className="register-error-text">{errors.email}</p>}
                    </div>
                  )}

                  {/* --- MODE: RESET PASSWORD --- */}
                  {mode === 'reset' && (
                    <>
                      <div className="register-field">
                        <label className="register-label">New Password</label>
                        <div className={`relative register-input-wrapper ${errors.password ? 'register-input-error' : ''}`}>
                          <Lock className="register-input-icon" />
                          <input
                            type={passwordVisible ? 'text' : 'password'}
                            placeholder="Min 12 chars (Abcde@#12345)"
                            value={password}
                            onChange={(e) => {
                              setPassword(e.target.value);
                              if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
                            }}
                            className="register-input pr-12"
                          />
                          <button
                            type="button"
                            onClick={() => setPasswordVisible(!passwordVisible)}
                            className="absolute right-4 text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center"
                          >
                            {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                        {password && (
                          <div className="mt-2">
                            <div className="flex justify-between items-center text-xs mb-1 font-body">
                              <span className="text-muted-foreground">Password strength:</span>
                              <span className={
                                strength.label === 'Strong' ? 'text-emerald-500 font-semibold' :
                                strength.label === 'Good' ? 'text-blue-400' :
                                strength.label === 'Fair' ? 'text-amber-500' : 'text-destructive'
                              }>{strength.label}</span>
                            </div>
                            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                              <div 
                                className={`h-full transition-all duration-300 ${strength.color}`} 
                                style={{ width: `${strength.percentage}%` }}
                              />
                            </div>
                          </div>
                        )}
                        {errors.password && <p className="register-error-text">{errors.password}</p>}
                      </div>

                      <div className="register-field">
                        <label className="register-label">Confirm New Password</label>
                        <div className={`relative register-input-wrapper ${errors.confirmPassword ? 'register-input-error' : ''}`}>
                          <Lock className="register-input-icon" />
                          <input
                            type={confirmPasswordVisible ? 'text' : 'password'}
                            placeholder="Re-enter your new password"
                            value={confirmPassword}
                            onChange={(e) => {
                              setConfirmPassword(e.target.value);
                              if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: undefined }));
                            }}
                            className="register-input pr-12"
                          />
                          <button
                            type="button"
                            onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                            className="absolute right-4 text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center"
                          >
                            {confirmPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                        {errors.confirmPassword && <p className="register-error-text">{errors.confirmPassword}</p>}
                      </div>
                    </>
                  )}

                </div>

                {/* Submission CTA */}
                <motion.button
                  className="register-submit-btn"
                  onClick={mode === 'reset' ? handleResetPassword : handleSubmitDetails}
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>{mode === 'login' ? 'Authenticating...' : 'Sending Code...'}</span>
                    </>
                  ) : (
                    <>
                      <span>
                        {mode === 'login' && 'Login & Continue'}
                        {mode === 'register' && 'Submit & Verify'}
                        {mode === 'forgot' && 'Send Reset Code'}
                        {mode === 'reset' && 'Update Password'}
                      </span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>

                {/* Secondary Toggles */}
                <div className="flex flex-col items-center gap-3 mt-6">
                  {mode === 'login' && (
                    <button 
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors font-body"
                      onClick={() => {
                        setMode('register');
                        setErrors({});
                        setPassword('');
                      }}
                    >
                      Don't have an account? <span className="text-amber-500 font-semibold">Register</span>
                    </button>
                  )}

                  {mode === 'register' && (
                    <button 
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors font-body"
                      onClick={() => {
                        setMode('login');
                        setErrors({});
                        setPassword('');
                      }}
                    >
                      Already have an account? <span className="text-amber-500 font-semibold">Login</span>
                    </button>
                  )}

                  {mode === 'forgot' && (
                    <button 
                      className="register-back-link justify-center mt-0"
                      onClick={() => {
                        setMode('login');
                        setErrors({});
                      }}
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back to Login</span>
                    </button>
                  )}
                  
                  {mode === 'reset' && (
                    <button 
                      className="register-back-link justify-center mt-0"
                      onClick={() => {
                        setMode('login');
                        setStep('details');
                        setErrors({});
                      }}
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  )}

                  {/* Simple link back to scanning */}
                  {(mode === 'login' || mode === 'register') && (
                    <button className="register-back-link justify-center mt-2" onClick={() => navigate('/')}>
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back to QR page</span>
                    </button>
                  )}
                </div>

              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

export default RegisterPage;
