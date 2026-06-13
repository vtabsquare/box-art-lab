import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  User, Mail, Phone, MapPin, ArrowRight, ArrowLeft,
  Loader2, CheckCircle2, Box, Sparkles, ShieldCheck,
  KeyRound, RefreshCw,
} from 'lucide-react';
import { sendVerificationEmail, verifyOTP } from '@/lib/brevoService';
import { storeVisitorData } from '@/lib/googleSheetsService';

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
        // Store details in localStorage for quote flow
        localStorage.setItem('user_name', formData.name);
        localStorage.setItem('user_email', formData.email);
        localStorage.setItem('user_mobile', formData.mobile);
        localStorage.setItem('user_location', formData.location);

        // Store data in Google Sheets
        await storeVisitorData(formData);
        setStep('success');
        // Navigate to home after brief success animation
        setTimeout(() => navigate('/home'), 2500);
      } else {
        setOtpError('Invalid or expired code. Please try again.');
      }
    } catch (err) {
      setOtpError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
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
                        <label className="register-label">{field.label}</label>
                        <div className={`register-input-wrapper ${errors[field.key] ? 'register-input-error' : ''}`}>
                          <Icon className="register-input-icon" />
                          <input
                            type={field.type}
                            placeholder={field.placeholder}
                            value={formData[field.key]}
                            onChange={(e) => updateField(field.key, e.target.value)}
                            className="register-input"
                          />
                        </div>
                        {errors[field.key] && (
                          <motion.p
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

                <motion.button
                  className="register-submit-btn"
                  onClick={handleVerify}
                  disabled={loading || otp.join('').length !== 6}
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

        {/* Skip link */}
        {step === 'details' && (
          <motion.button
            className="qr-skip-btn register-skip"
            onClick={() => navigate('/home')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Skip <span className="qr-skip-temp">(temporary)</span>
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
