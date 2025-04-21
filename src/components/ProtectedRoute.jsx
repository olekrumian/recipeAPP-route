import { Navigate } from 'react-router-dom';
import { authService } from '../firebase/authService';

const ProtectedRoute = ({ children }) => {
  const currentUser = authService.getCurrentUser();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
