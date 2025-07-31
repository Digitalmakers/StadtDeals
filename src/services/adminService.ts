import firestore from '@react-native-firebase/firestore';
import { User } from '../types/auth';
import { UserRole, AdminUserListItem } from '../types/roles';
import { roleService } from './roleService';
import { validateRoleAssignment, validateAdminUserUpdate } from '../utils/roleValidation';

class AdminService {
  private usersCollection = firestore().collection('users');

  async getAllUsers(limit: number = 100): Promise<AdminUserListItem[]> {
    try {
      const querySnapshot = await this.usersCollection
        .limit(limit)
        .orderBy('createdAt', 'desc')
        .get();

      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          uid: doc.id,
          email: data.email,
          role: data.role,
          profile: {
            firstName: data.profile.firstName,
            lastName: data.profile.lastName,
          },
          createdAt: data.createdAt?.toDate(),
          lastLogin: data.lastLogin?.toDate(),
        };
      });
    } catch (error) {
      console.error('Error getting all users:', error);
      throw new Error('Failed to retrieve users');
    }
  }

  async getUsersByRole(role: UserRole, limit: number = 50): Promise<AdminUserListItem[]> {
    try {
      const querySnapshot = await this.usersCollection
        .where('role', '==', role)
        .limit(limit)
        .orderBy('createdAt', 'desc')
        .get();

      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          uid: doc.id,
          email: data.email,
          role: data.role,
          profile: {
            firstName: data.profile.firstName,
            lastName: data.profile.lastName,
          },
          createdAt: data.createdAt?.toDate(),
          lastLogin: data.lastLogin?.toDate(),
        };
      });
    } catch (error) {
      console.error('Error getting users by role:', error);
      throw new Error('Failed to retrieve users by role');
    }
  }

  async updateUserRole(
    targetUserId: string, 
    newRole: UserRole, 
    adminUserId: string,
    adminRole: UserRole
  ): Promise<void> {
    try {
      // Validate the role assignment request
      const assignmentData = {
        uid: targetUserId,
        role: newRole,
        assignedBy: adminUserId,
      };

      validateRoleAssignment(assignmentData);

      // Get current user data
      const userDoc = await this.usersCollection.doc(targetUserId).get();
      if (!userDoc.exists) {
        throw new Error('User not found');
      }

      const currentUser = userDoc.data() as User;
      
      // Validate role transition permissions
      if (!roleService.validateRoleTransition(currentUser.role, newRole, adminRole)) {
        throw new Error('Insufficient permissions for role change');
      }

      // Update user role
      await roleService.updateUserRole(targetUserId, newRole, adminUserId);

      // Log the role change for audit
      await this.logRoleChange(targetUserId, currentUser.role, newRole, adminUserId);

    } catch (error) {
      console.error('Error updating user role:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to update user role');
    }
  }

  async updateUserProfile(
    targetUserId: string,
    profileUpdates: Partial<User['profile']>,
    adminUserId: string
  ): Promise<void> {
    try {
      const updateData = {
        uid: targetUserId,
        profile: profileUpdates,
      };

      validateAdminUserUpdate(updateData);

      await this.usersCollection.doc(targetUserId).update({
        'profile.firstName': profileUpdates.firstName,
        'profile.lastName': profileUpdates.lastName,
        'profile.phone': profileUpdates.phone,
        'profile.location': profileUpdates.location,
        updatedAt: firestore.Timestamp.now(),
        lastModifiedBy: adminUserId,
      });

    } catch (error) {
      console.error('Error updating user profile:', error);
      throw new Error('Failed to update user profile');
    }
  }

  async deactivateUser(targetUserId: string, adminUserId: string, reason?: string): Promise<void> {
    try {
      await this.usersCollection.doc(targetUserId).update({
        isActive: false,
        deactivatedAt: firestore.Timestamp.now(),
        deactivatedBy: adminUserId,
        deactivationReason: reason || 'No reason provided',
        updatedAt: firestore.Timestamp.now(),
      });

      // Log the deactivation
      await this.logUserAction(targetUserId, 'deactivated', adminUserId, reason);

    } catch (error) {
      console.error('Error deactivating user:', error);
      throw new Error('Failed to deactivate user');
    }
  }

  async reactivateUser(targetUserId: string, adminUserId: string): Promise<void> {
    try {
      await this.usersCollection.doc(targetUserId).update({
        isActive: true,
        reactivatedAt: firestore.Timestamp.now(),
        reactivatedBy: adminUserId,
        deactivatedAt: firestore.FieldValue.delete(),
        deactivatedBy: firestore.FieldValue.delete(),
        deactivationReason: firestore.FieldValue.delete(),
        updatedAt: firestore.Timestamp.now(),
      });

      // Log the reactivation
      await this.logUserAction(targetUserId, 'reactivated', adminUserId);

    } catch (error) {
      console.error('Error reactivating user:', error);
      throw new Error('Failed to reactivate user');
    }
  }

  async getUserStats(): Promise<{
    totalUsers: number;
    customerCount: number;
    vendorCount: number;
    adminCount: number;
    activeUsers: number;
    inactiveUsers: number;
  }> {
    try {
      const [customers, vendors, admins, activeUsers] = await Promise.all([
        this.usersCollection.where('role', '==', 'customer').get(),
        this.usersCollection.where('role', '==', 'vendor').get(),
        this.usersCollection.where('role', '==', 'admin').get(),
        this.usersCollection.where('isActive', '!=', false).get(),
      ]);

      const totalUsers = customers.size + vendors.size + admins.size;

      return {
        totalUsers,
        customerCount: customers.size,
        vendorCount: vendors.size,
        adminCount: admins.size,
        activeUsers: activeUsers.size,
        inactiveUsers: totalUsers - activeUsers.size,
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      throw new Error('Failed to retrieve user statistics');
    }
  }

  private async logRoleChange(
    userId: string,
    oldRole: UserRole,
    newRole: UserRole,
    adminId: string
  ): Promise<void> {
    try {
      await firestore().collection('auditLog').add({
        action: 'role_change',
        targetUserId: userId,
        adminId,
        oldRole,
        newRole,
        timestamp: firestore.Timestamp.now(),
        details: `Role changed from ${oldRole} to ${newRole}`,
      });
    } catch (error) {
      console.error('Error logging role change:', error);
      // Don't throw - logging failure shouldn't break the main operation
    }
  }

  private async logUserAction(
    userId: string,
    action: string,
    adminId: string,
    details?: string
  ): Promise<void> {
    try {
      await firestore().collection('auditLog').add({
        action,
        targetUserId: userId,
        adminId,
        timestamp: firestore.Timestamp.now(),
        details: details || `User ${action}`,
      });
    } catch (error) {
      console.error(`Error logging ${action}:`, error);
      // Don't throw - logging failure shouldn't break the main operation
    }
  }
}

export const adminService = new AdminService();