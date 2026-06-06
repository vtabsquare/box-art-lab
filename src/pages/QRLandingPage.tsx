import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ScanLine, ArrowRight, Box } from 'lucide-react';

const QRLandingPage = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [scanPulse, setScanPulse] = useState(false);

  // The QR code will link to the details page
  const detailsUrl = `${window.location.origin}/register`;

  useEffect(() => {
    setMounted(true);
    // Periodic pulse animation for the scan indicator
    const interval = setInterval(() => {
      setScanPulse(true);
      setTimeout(() => setScanPulse(false), 1200);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="qr-landing-page">
      {/* Animated background particles */}
      <div className="qr-bg-effects">
        <div className="qr-orb qr-orb-1" />
        <div className="qr-orb qr-orb-2" />
        <div className="qr-orb qr-orb-3" />
        <div className="qr-grid-pattern" />
      </div>

      <AnimatePresence>
        {mounted && (
          <motion.div
            className="qr-content-wrapper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Logo & Brand */}
            <motion.div
              className="qr-brand"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="qr-logo-icon">
                <Box className="qr-logo-box-icon" />
              </div>
              <h1 className="qr-brand-name">Box Art Lab</h1>
              <p className="qr-brand-tagline">PACKAGING STUDIO</p>
            </motion.div>

            {/* QR Code Card */}
            <motion.div
              className="qr-card"
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, type: 'spring', stiffness: 120 }}
            >
              {/* Glowing border effect */}
              <div className="qr-card-glow" />

              <div className="qr-card-inner">
                {/* Header */}
                <div className="qr-card-header">
                  <div className="qr-card-badge">
                    <ScanLine className="qr-badge-icon" />
                    <span>Scan to Register</span>
                  </div>
                </div>

                {/* QR Code Container */}
                <div className={`qr-code-container ${scanPulse ? 'qr-pulse-active' : ''}`}>
                  {/* Corner decorations */}
                  <div className="qr-corner qr-corner-tl" />
                  <div className="qr-corner qr-corner-tr" />
                  <div className="qr-corner qr-corner-bl" />
                  <div className="qr-corner qr-corner-br" />

                  {/* Scan line animation */}
                  <div className="qr-scan-line" />

                  <QRCodeSVG
                    value={detailsUrl}
                    size={200}
                    bgColor="transparent"
                    fgColor="hsl(38, 90%, 50%)"
                    level="H"
                    includeMargin={false}
                    imageSettings={{
                      src: '',
                      x: undefined,
                      y: undefined,
                      height: 0,
                      width: 0,
                      excavate: false,
                    }}
                  />
                </div>

                {/* Instructions */}
                <div className="qr-instructions">
                  <p className="qr-instructions-main">
                    Scan this QR code with your phone to access our premium packaging design studio
                  </p>
                  <div className="qr-divider">
                    <span className="qr-divider-line" />
                    <span className="qr-divider-text">or</span>
                    <span className="qr-divider-line" />
                  </div>
                </div>

                {/* Register Button */}
                <motion.button
                  className="qr-register-btn"
                  onClick={() => navigate('/register')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Sparkles className="qr-btn-icon" />
                  <span>Register Now</span>
                  <ArrowRight className="qr-btn-arrow" />
                </motion.button>
              </div>
            </motion.div>

            {/* Skip Button */}
            <motion.button
              className="qr-skip-btn"
              onClick={() => navigate('/home')}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Skip <span className="qr-skip-temp">(temporary)</span>
            </motion.button>

            {/* Bottom decorative text */}
            <motion.p
              className="qr-footer-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.6 }}
            >
              Premium Packaging & Printing Solutions
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QRLandingPage;
