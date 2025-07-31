import { UserRole, ROLE_PERMISSIONS } from '../types/roles';
import { roleService } from '../services/roleService';

class PermissionService {
  /**
   * Check if user has a specific permission
   */
  async hasPermission(userId: string, permission: keyof typeof ROLE_PERMISSIONS.admin): Promise<boolean> {
    try {
      const userRole = await roleService.getUserRole(userId);
      if (!userRole) return false;
      
      const permissions = ROLE_PERMISSIONS[userRole];
      return permissions[permission];
    } catch (error) {
      console.error('Error checking permission:', error);
      return false;
    }
  }

  /**
   * Check if user has any of the specified roles
   */
  async hasAnyRole(userId: string, roles: UserRole[]): Promise<boolean> {
    try {
      const userRole = await roleService.getUserRole(userId);
      return userRole ? roles.includes(userRole) : false;
    } catch (error) {
      console.error('Error checking roles:', error);
      return false;
    }
  }

  /**
   * Check if user can access a specific route
   */
  async canAccessRoute(userId: string, routeName: string): Promise<boolean> {
    try {
      const userRole = await roleService.getUserRole(userId);
      if (!userRole) return false;
      
      return roleService.canUserAccessRoute(userRole, routeName);
    } catch (error) {
      console.error('Error checking route access:', error);
      return false;
    }
  }

  /**
   * Validate role-based API access
   */
  async validateApiAccess(
    userId: string, 
    requiredRoles?: UserRole[], 
    requiredPermission?: keyof typeof ROLE_PERMISSIONS.admin
  ): Promise<{ allowed: boolean; reason?: string }> {
    try {
      const userRole = await roleService.getUserRole(userId);
      
      if (!userRole) {
        return { allowed: false, reason: 'User role not found' };
      }

      // Check required roles
      if (requiredRoles && !requiredRoles.includes(userRole)) {
        return { 
          allowed: false, 
          reason: `Required role: ${requiredRoles.join(' or ')}, but user has: ${userRole}` 
        };
      }

      // Check required permission
      if (requiredPermission) {
        const permissions = ROLE_PERMISSIONS[userRole];
        if (!permissions[requiredPermission]) {
          return { 
            allowed: false, 
            reason: `Permission '${requiredPermission}' required but not granted to ${userRole}` 
          };
        }
      }

      return { allowed: true };
    } catch (error) {
      console.error('Error validating API access:', error);
      return { allowed: false, reason: 'Permission validation failed' };
    }
  }

  /**
   * Get all permissions for a user role
   */
  getPermissionsForRole(role: UserRole) {
    return ROLE_PERMISSIONS[role];
  }

  /**
   * Check if a role transition is valid
   */
  async canChangeRole(
    requestorId: string, 
    targetUserId: string, 
    newRole: UserRole
  ): Promise<{ allowed: boolean; reason?: string }> {
    try {
      const requestorRole = await roleService.getUserRole(requestorId);
      const targetRole = await roleService.getUserRole(targetUserId);
      
      if (!requestorRole || !targetRole) {
        return { allowed: false, reason: 'User roles not found' };
      }

      // Check if requestor has permission to modify roles
      const canModifyRoles = ROLE_PERMISSIONS[requestorRole].canModifyUserRoles;
      if (!canModifyRoles) {
        return { allowed: false, reason: 'Insufficient permissions to modify user roles' };
      }

      // Validate the role transition
      const isValidTransition = roleService.validateRoleTransition(targetRole, newRole, requestorRole);
      if (!isValidTransition) {
        return { allowed: false, reason: 'Invalid role transition' };
      }

      return { allowed: true };
    } catch (error) {
      console.error('Error checking role change permission:', error);
      return { allowed: false, reason: 'Role change validation failed' };
    }
  }

  /**
   * Generate role-based error message
   */
  generateAccessDeniedMessage(
    userRole: UserRole | null, 
    requiredRoles?: UserRole[], 
    requiredPermission?: string
  ): string {
    if (!userRole) {
      return 'Authentication required';
    }

    if (requiredRoles) {
      return `Access denied. Required role: ${requiredRoles.join(' or ')}, current role: ${userRole}`;
    }

    if (requiredPermission) {
      return `Access denied. Permission '${requiredPermission}' required`;
    }

    return 'Access denied. Insufficient permissions';
  }
}

export const permissionService = new PermissionService();