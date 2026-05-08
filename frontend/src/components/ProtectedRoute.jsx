import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { token, user } = useAuth();
  
  if (!token) return <Navigate to="/login" replace />;
  
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/not-admin" replace />;
  }
  
  return children;
};

export default ProtectedRoute;