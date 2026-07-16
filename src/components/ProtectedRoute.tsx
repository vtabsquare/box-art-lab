import { useEffect, useRef } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const isRegistered = !!localStorage.getItem('userEmail');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      // Clear localStorage session
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userMobile');
      localStorage.removeItem('userLocation');
      
      // Redirect
      navigate('/register', { replace: true });
    }, INACTIVITY_TIMEOUT);
  };

  useEffect(() => {
    if (!isRegistered) return;

    // Set up event listeners for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    // Initialize timer
    resetTimer();

    const handleActivity = () => resetTimer();

    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [isRegistered, navigate]);

  if (!isRegistered) {
    return <Navigate to="/register" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
