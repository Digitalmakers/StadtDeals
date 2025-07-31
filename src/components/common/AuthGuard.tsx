import React, { useEffect } from 'react';
import { Box, Spinner, Center } from 'native-base';
import { useAuthStore } from '../../stores/authStore';
import { UserRole } from '../../types/roles';
import { roleService } from '../../services/roleService';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requiredRole?: UserRole;
  allowedRoles?: UserRole[];
  routeName?: string;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  fallback,
  requiredRole,
  allowedRoles,
  routeName
}) => {
  const { isAuthenticated, isLoading, user, checkAuthState } = useAuthStore();

  useEffect(() => {
    checkAuthState();
  }, [checkAuthState]);

  if (isLoading) {
    return fallback || (
      <Center flex={1} bg="white">
        <Spinner size="lg" color="primary.600" />
      </Center>
    );
  }

  if (!isAuthenticated) {
    return fallback || (
      <Center flex={1} bg="white">
        <Box>Authentication required</Box>
      </Center>
    );
  }

  // Role-based access control
  if (user && (requiredRole || allowedRoles || routeName)) {
    const userRole = user.role;

    // Check specific required role
    if (requiredRole && userRole !== requiredRole) {
      return fallback || (
        <Center flex={1} bg="white">
          <Box>Access denied: {requiredRole} role required</Box>
        </Center>
      );
    }

    // Check allowed roles
    if (allowedRoles && !allowedRoles.includes(userRole)) {
      return fallback || (
        <Center flex={1} bg="white">
          <Box>Access denied: Insufficient permissions</Box>
        </Center>
      );
    }

    // Check route access
    if (routeName && !roleService.canUserAccessRoute(userRole, routeName)) {
      return fallback || (
        <Center flex={1} bg="white">
          <Box>Access denied: Route not accessible</Box>
        </Center>
      );
    }
  }

  return <>{children}</>;
};