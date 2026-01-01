/**
 * This is a product of Scalovate Systems Solutions.
 * All rights reserved.
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const AdminRoute = ({ children, requiredRole = 'admin' }) => {
  const { user, userProfile, loading, hasAdminAccess, hasRole, isSuperAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user || !userProfile) {
    return <Navigate to="/login" replace />;
  }

  // Super admin has access to everything
  if (isSuperAdmin()) {
    return children;
  }
  
  // Check if user has admin access (admin or super_admin)
  if (!hasAdminAccess()) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // If specific role is required (and not super_admin), check for that role
  if (requiredRole && requiredRole !== 'admin' && !hasRole(requiredRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminRoute; 