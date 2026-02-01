import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermissions = [],
}) => {
  const location = useLocation();
  const { isAuthenticated, hasAnyPermission, isSuperAdmin } = useAuthStore();

  // Vérifier l'authentification
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Vérifier les permissions si nécessaires
  if (requiredPermissions.length > 0) {
    const hasAccess = isSuperAdmin() || hasAnyPermission(requiredPermissions);
    if (!hasAccess) {
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
