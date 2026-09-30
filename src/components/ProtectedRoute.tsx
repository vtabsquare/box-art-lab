import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '@/lib/sessionService';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Wraps a route and redirects unauthenticated users to /register.
 * Preserves the intended destination so the user can be sent back after login.
 */
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();

  if (!isAuthenticated()) {
    // Pass the attempted URL so RegisterPage can redirect back after login
    return <Navigate to="/register" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
