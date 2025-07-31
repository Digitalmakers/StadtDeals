import firestore from '@react-native-firebase/firestore';
import { UserRole, UserPermissions, ROLE_PERMISSIONS, DEFAULT_ROLE } from '../types/roles';
import { User } from '../types/auth';

class RoleService {
  private usersCollection = firestore().collection('users');

  async getUserRole(uid: string): Promise<UserRole | null> {
    try {
      const userDoc = await this.usersCollection.doc(uid).get();
      if (userDoc.exists) {
        const userData = userDoc.data() as User;
        return userData.role || DEFAULT_ROLE;
      }
      return null;
    } catch (error) {
      console.error('Error getting user role:', error);
      throw new Error('Failed to get user role');
    }
  }

  async updateUserRole(uid: string, newRole: UserRole, assignedBy: string): Promise<void> {
    try {
      await this.usersCollection.doc(uid).update({
        role: newRole,
        updatedAt: firestore.Timestamp.now(),
        roleHistory: firestore.FieldValue.arrayUnion({
          role: newRole,
          assignedAt: firestore.Timestamp.now(),
          assignedBy,
        }),
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      throw new Error('Failed to update user role');
    }
  }

  async assignDefaultRole(uid: string): Promise<void> {
    try {
      await this.usersCollection.doc(uid).update({
        role: DEFAULT_ROLE,
        updatedAt: firestore.Timestamp.now(),
      });
    } catch (error) {
      console.error('Error assigning default role:', error);
      throw new Error('Failed to assign default role');
    }
  }

  getUserPermissions(role: UserRole): UserPermissions {
    return ROLE_PERMISSIONS[role];
  }

  hasPermission(role: UserRole, permission: keyof UserPermissions): boolean {
    const permissions = this.getUserPermissions(role);
    return permissions[permission];
  }

  canUserAccessRoute(role: UserRole, route: string): boolean {
    const permissions = this.getUserPermissions(role);
    
    switch (route) {
      case 'AdminPanel':
      case 'UserManagement':
        return permissions.canViewAdminPanel;
      case 'VendorDashboard':
      case 'ProductManagement':
        return permissions.canCreateProducts || permissions.canManageOwnProducts;
      case 'Chat':
        return permissions.canAccessChat;
      default:
        return true; // Allow access to common routes
    }
  }

  validateRoleTransition(currentRole: UserRole, newRole: UserRole, requestorRole: UserRole): boolean {
    const requestorPermissions = this.getUserPermissions(requestorRole);
    
    // Only admins can modify roles
    if (!requestorPermissions.canModifyUserRoles) {
      return false;
    }

    // Prevent privilege escalation - only admins can create other admins
    if (newRole === 'admin' && requestorRole !== 'admin') {
      return false;
    }

    return true;
  }

  async getUsersByRole(role: UserRole, limit: number = 50): Promise<User[]> {
    try {
      const querySnapshot = await this.usersCollection
        .where('role', '==', role)
        .limit(limit)
        .get();

      return querySnapshot.docs.map(doc => ({
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as User[];
    } catch (error) {
      console.error('Error getting users by role:', error);
      throw new Error('Failed to get users by role');
    }
  }

  async getAllUsers(limit: number = 100): Promise<User[]> {
    try {
      const querySnapshot = await this.usersCollection
        .limit(limit)
        .orderBy('createdAt', 'desc')
        .get();

      return querySnapshot.docs.map(doc => ({
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as User[];
    } catch (error) {
      console.error('Error getting all users:', error);
      throw new Error('Failed to get all users');
    }
  }
}

export const roleService = new RoleService();