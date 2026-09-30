import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  User, Mail, Phone, MapPin, ArrowRight, ArrowLeft,
  Loader2, CheckCircle2, Box, Sparkles, ShieldCheck,
  KeyRound, RefreshCw,
} from 'lucide-react';
import { sendVerificationEmail, verifyOTP, getOTPLockoutInfo, resetOTPAttempts } from '@/lib/brevoService';
import { storeVisitorData } from '@/lib/googleSheetsService';
import { setSession } from '@/lib/sessionService';
import { logAuditEvent } from '@/lib/auditLogger';
import { useGoogleLogin } from '@react-oauth/google';

type Step = 'details' | 'verification' | 'success';

interface FormData {
  name: string;
  email: string;
  mobile: string;
  location: string;
}

interface FieldError {
  name?: string;
  email?: string;
  mobile?: string;
  location?: string;
}

// Google SSO is opt-in: only shown when VITE_GOOGLE_CLIENT_ID is configured
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('details');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    mobile: '',
    location: '',
  });
  const [errors, setErrors] = useState<FieldError>({});
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [demoCode, setDemoCode] = useState<string | null>(null);
  const [otpError, setOtpError] = useState('');
  const [resending, setResending] = useState(false);
  // True when the user has exhausted OTP attempts and must wait for lockout to expire
  const [isLocked, setIsLocked] = useState(false);
  // User preference: extend session to 30 days
  const [rememberDevice, setRememberDevice] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const validate = (): boolean => {
    const newErrors: FieldError = {};
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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const result = await sendVerificationEmail(formData.email, formData.name);
      if (result.success) {
        if (result.code) setDemoCode(result.code);
        setStep('verification');
      }
    } catch (err) {
      console.error('Email send error:', err);
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

    // Auto-focus next input
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

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length !== 6) {
      setOtpError('Please enter all 6 digits');
      return;
    }
    setLoading(true);
    try {
      const isValid = verifyOTP(formData.email, code);
      if (isValid) {
        // Create an authenticated session (24-hour or 30-day depending on preference)
        setSession(formData, { rememberDevice });
        logAuditEvent('LOGIN_SUCCESS', formData.email, { method: 'otp' });

        // Store data in Google Sheets CRM
        await storeVisitorData(formData);
        setStep('success');
        // Navigate to home after brief success animation
        setTimeout(() => navigate('/home'), 2500);
      } else {
        // Check current lockout state for a precise error message
        const lock = getOTPLockoutInfo(formData.email);
        if (lock.locked) {
          const mins = Math.ceil(lock.remainingMs / 60000);
          setOtpError(
            `Too many failed attempts. Try again in ${mins} minute${mins !== 1 ? 's' : ''}.`
          );
          setIsLocked(true);
        } else {
          const left = lock.attemptsLeft;
          setOtpError(
            left > 0
              ? `Invalid or expired code. ${left} attempt${left !== 1 ? 's' : ''} remaining.`
              : 'Invalid or expired code. Please try again.'
          );
          logAuditEvent('LOGIN_FAILED', formData.email, { reason: 'invalid_code', attemptsLeft: left });
        }
      }
    } catch (err) {
      setOtpError('Verification failed. Please try again.');
      logAuditEvent('LOGIN_FAILED', formData.email, { reason: 'error', details: err });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    // Clear lockout so the new OTP gets a fresh attempt slate
    resetOTPAttempts(formData.email);
    setIsLocked(false);
    setResending(true);
    setOtp(['', '', '', '', '', '']);
    setOtpError('');
    try {
      const result = await sendVerificationEmail(formData.email, formData.name);
      if (result.code) setDemoCode(result.code);
    } catch (err) {
      console.error('Resend error:', err);
    } finally {
      setResending(false);
    }
  };

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // ── Google SSO handler ───────────────────────────────────────────────────
  const handleGoogleSignIn = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true);
      try {
        // Fetch profile from Google's userinfo endpoint using the access token
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        }).then((r) => r.json());

        const googleData = {
          name: userInfo.name || userInfo.email,
          email: userInfo.email,
          mobile: '',   // Not available via Google profile
          location: '', // Not available via Google profile
        };

        setSession(googleData, { rememberDevice: false });
        logAuditEvent('LOGIN_SUCCESS', googleData.email, { method: 'google_sso' });
        
        // Record the SSO lead in Google Sheets
        await storeVisitorData(googleData);
        navigate('/home');
      } catch (err) {
        console.error('[Google SSO] Failed to fetch user profile:', err);
        logAuditEvent('LOGIN_FAILED', 'unknown', { reason: 'google_sso_fetch_error' });
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => {
      console.error('[Google SSO] Authentication failed');
      logAuditEvent('LOGIN_FAILED', 'unknown', { reason: 'google_sso_auth_error' });
      setGoogleLoading(false);
    },
  });

  const fields = [
    { key: 'name' as const, label: 'Full Name', icon: User, type: 'text', placeholder: 'Enter your full name' },
    { key: 'email' as const, label: 'Email Address', icon: Mail, type: 'email', placeholder: 'your@email.com' },
    { key: 'mobile' as const, label: 'Mobile Number', icon: Phone, type: 'tel', placeholder: '+91 98765 43210' },
    { key: 'location' as const, label: 'Location', icon: MapPin, type: 'text', placeholder: 'City, Country' },
  ];

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

        {/* Progress indicator */}
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

        {/* Card */}
        <AnimatePresence mode="wait">
          {/* ── Step 1: Details ── */}
          {step === 'details' && (
            <motion.div
              key="details"
              className="register-card"
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50, scale: 0.95 }}
              transition={{ duration: 0.5, type: 'spring', stiffness: 120 }}
            >
              <div className="register-card-glow" />
              <div className="register-card-inner">
                <div className="register-card-header">
                  <div className="register-card-icon-wrapper">
                    <Sparkles className="register-card-icon" />
                  </div>
                  <h2 className="register-card-title">Welcome to Box Art Lab</h2>
                  <p className="register-card-desc">
                    Fill in your details to access our premium packaging design studio
                  </p>
                </div>

                <div className="register-form">
                  {fields.map((field, i) => {
                    const Icon = field.icon;
                    return (
                      <motion.div
                        key={field.key}
                        className="register-field"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.08 }}
                      >
                        <label
                          htmlFor={`field-${field.key}`}
                          className="register-label"
                        >
                          {field.label}
                        </label>
                        <div className={`register-input-wrapper ${errors[field.key] ? 'register-input-error' : ''}`}>
                          <Icon className="register-input-icon" aria-hidden="true" />
                          <input
                            id={`field-${field.key}`}
                            type={field.type}
                            placeholder={field.placeholder}
                            value={formData[field.key]}
                            onChange={(e) => updateField(field.key, e.target.value)}
                            aria-invalid={!!errors[field.key]}
                            aria-describedby={errors[field.key] ? `error-${field.key}` : undefined}
                            className="register-input"
                          />
                        </div>
                        {errors[field.key] && (
                          <motion.p
                            id={`error-${field.key}`}
                            role="alert"
                            className="register-error-text"
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            {errors[field.key]}
                          </motion.p>
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                <motion.button
                  className="register-submit-btn"
                  onClick={handleSubmit}
                  disabled={loading}
                  aria-busy={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Sending Code...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit & Verify</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>

                {/* Google Sign-In — only rendered when VITE_GOOGLE_CLIENT_ID is configured */}
                {GOOGLE_CLIENT_ID && (
                  <>
                    <div className="flex items-center gap-3 my-1">
                      <span className="flex-1 h-px bg-border" />
                      <span className="text-xs text-muted-foreground font-body">or sign in with</span>
                      <span className="flex-1 h-px bg-border" />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleGoogleSignIn()}
                      disabled={googleLoading}
                      aria-busy={googleLoading}
                      aria-label="Sign in with Google"
                      className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-white dark:bg-white/5 border border-border hover:border-amber-500/40 text-gray-700 dark:text-white font-body font-medium text-sm rounded-xl transition-all duration-300 hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {googleLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                      )}
                      <span>{googleLoading ? 'Signing in...' : 'Continue with Google'}</span>
                    </button>
                  </>
                )}

                <button className="register-back-link" onClick={() => navigate('/')}>
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to QR page</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Step 2: Verification ── */}
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
                    We've sent a 6-digit code to{' '}
                    <strong className="register-email-highlight">{formData.email}</strong>
                  </p>
                </div>

                {/* Demo code hint */}
                {demoCode && (
                  <motion.div
                    className="register-demo-hint"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>Demo Mode — Your code: <strong>{demoCode}</strong></span>
                  </motion.div>
                )}

                {/* OTP Input */}
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
                        aria-label={`Verification digit ${i + 1} of 6`}
                        aria-invalid={!!otpError}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        className={`register-otp-input ${digit ? 'has-value' : ''} ${otpError ? 'has-error' : ''}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 + i * 0.06 }}
                      />
                    ))}
                  </div>

                  {otpError && (
                    <motion.p
                      role="alert"
                      aria-live="assertive"
                      className="register-otp-error"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {otpError}
                    </motion.p>
                  )}

                  <button
                    className="register-resend-btn"
                    onClick={handleResend}
                    disabled={resending}
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
                    <span>{resending ? 'Resending...' : "Didn't receive the code? Resend"}</span>
                  </button>
                </div>

                {/* Remember device checkbox */}
                <label className="flex items-center gap-2.5 cursor-pointer select-none mb-1 mt-1">
                  <input
                    type="checkbox"
                    id="remember-device"
                    checked={rememberDevice}
                    onChange={(e) => setRememberDevice(e.target.checked)}
                    className="w-4 h-4 rounded accent-amber-500 cursor-pointer"
                    aria-label="Remember this device for 30 days"
                  />
                  <span className="text-sm text-muted-foreground font-body">
                    Remember this device for <span className="text-foreground font-medium">30 days</span>
                  </span>
                </label>

                <motion.button
                  className="register-submit-btn"
                  onClick={handleVerify}
                  disabled={loading || otp.join('').length !== 6 || isLocked}
                  aria-busy={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5" />
                      <span>Verify & Continue</span>
                    </>
                  )}
                </motion.button>

                <button className="register-back-link" onClick={() => setStep('details')}>
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to details</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Step 3: Success ── */}
          {step === 'success' && (
            <motion.div
              key="success"
              className="register-card register-success-card"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
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
                  Welcome, {formData.name.split(' ')[0]}!
                </motion.h2>
                <motion.p
                  className="register-success-desc"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  Verification complete. Redirecting you to the studio...
                </motion.p>
                <motion.div
                  className="register-success-loader"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 0.3, duration: 2.2, ease: 'easeInOut' }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Skip link removed — authentication is required */}
      </div>
    </div>
  );
};

export default RegisterPage;
