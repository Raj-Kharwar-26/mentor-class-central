
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children,
  requiredRole,
  allowedRoles
}) => {
  const { isAuthenticated, profile, loading } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    // Force a rerender if loading changes
    console.log("Auth state loading:", loading);
    console.log("Auth state authenticated:", isAuthenticated);
    if (profile) {
      console.log("Auth state profile role:", profile.role);
    }
  }, [loading, isAuthenticated, profile]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <span>Loading...</span>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  const rolesToCheck = requiredRole ? [requiredRole] : allowedRoles;
  
  if (rolesToCheck && profile && !rolesToCheck.includes(profile.role)) {
    // Redirect to appropriate dashboard or home based on role
    switch (profile.role) {
      case 'student':
        return <Navigate to="/student" replace />;
      case 'tutor':
        return <Navigate to="/tutor" replace />;
      case 'admin':
        return <Navigate to="/admin" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  // If authenticated and role is allowed (or no role check is required)
  return <>{children}</>;
};

export default ProtectedRoute;
