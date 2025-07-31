import React from 'react';
import { UserRole, ROLE_PERMISSIONS } from '../../types/roles';
import { useAuthStore } from '../../stores/authStore';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requiredPermission?: keyof typeof ROLE_PERMISSIONS.admin;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  allowedRoles,
  requiredPermission,
  fallback = null,
}) => {
  const { user } = useAuthStore();

  if (!user) {
    return <>{fallback}</>;
  }

  // Check allowed roles
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <>{fallback}</>;
  }

  // Check specific permission
  if (requiredPermission) {
    const userPermissions = ROLE_PERMISSIONS[user.role];
    if (!userPermissions[requiredPermission]) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
};

interface UseRolePermissionsReturn {
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  hasPermission: (permission: keyof typeof ROLE_PERMISSIONS.admin) => boolean;
  isAdmin: boolean;
  isVendor: boolean;
  isCustomer: boolean;
  currentRole: UserRole | null;
}

export const useRolePermissions = (): UseRolePermissionsReturn => {
  const { user } = useAuthStore();

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return user ? roles.includes(user.role) : false;
  };

  const hasPermission = (permission: keyof typeof ROLE_PERMISSIONS.admin): boolean => {
    if (!user) return false;
    const userPermissions = ROLE_PERMISSIONS[user.role];
    return userPermissions[permission];
  };

  return {
    hasRole,
    hasAnyRole,
    hasPermission,
    isAdmin: hasRole('admin'),
    isVendor: hasRole('vendor'),
    isCustomer: hasRole('customer'),
    currentRole: user?.role || null,
  };
};