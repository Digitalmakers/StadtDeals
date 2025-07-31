import { roleService } from '../roleService';
import { UserRole, DEFAULT_ROLE, ROLE_PERMISSIONS } from '../../types/roles';

// Mock Firestore
jest.mock('@react-native-firebase/firestore', () => {
  const mockFirestore = {
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        get: jest.fn(),
        update: jest.fn(),
      })),
      where: jest.fn(() => ({
        limit: jest.fn(() => ({
          get: jest.fn(),
          orderBy: jest.fn(() => ({
            get: jest.fn(),
          })),
        })),
      })),
      limit: jest.fn(() => ({
        orderBy: jest.fn(() => ({
          get: jest.fn(),
        })),
      })),
    })),
    Timestamp: {
      now: jest.fn(() => ({ toDate: () => new Date() })),
    },
    FieldValue: {
      arrayUnion: jest.fn((value) => value),
    },
  };

  return () => mockFirestore;
});

describe('RoleService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserRole', () => {
    it('should return user role when user exists', async () => {
      const mockGet = jest.fn().mockResolvedValue({
        exists: true,
        data: () => ({ role: 'vendor' }),
      });

      const firestore = require('@react-native-firebase/firestore')();
      firestore.collection().doc().get = mockGet;

      const role = await roleService.getUserRole('user123');
      expect(role).toBe('vendor');
      expect(firestore.collection).toHaveBeenCalledWith('users');
    });

    it('should return null when user does not exist', async () => {
      const mockGet = jest.fn().mockResolvedValue({
        exists: false,
      });

      const firestore = require('@react-native-firebase/firestore')();
      firestore.collection().doc().get = mockGet;

      const role = await roleService.getUserRole('nonexistent');
      expect(role).toBeNull();
    });

    it('should return default role when user exists but has no role', async () => {
      const mockGet = jest.fn().mockResolvedValue({
        exists: true,
        data: () => ({}),
      });

      const firestore = require('@react-native-firebase/firestore')();
      firestore.collection().doc().get = mockGet;

      const role = await roleService.getUserRole('user123');
      expect(role).toBe(DEFAULT_ROLE);
    });
  });

  describe('getUserPermissions', () => {
    it('should return correct permissions for customer role', () => {
      const permissions = roleService.getUserPermissions('customer');
      expect(permissions).toEqual(ROLE_PERMISSIONS.customer);
      expect(permissions.canViewAdminPanel).toBe(false);
      expect(permissions.canAccessChat).toBe(true);
    });

    it('should return correct permissions for vendor role', () => {
      const permissions = roleService.getUserPermissions('vendor');
      expect(permissions).toEqual(ROLE_PERMISSIONS.vendor);
      expect(permissions.canCreateProducts).toBe(true);
      expect(permissions.canViewAdminPanel).toBe(false);
    });

    it('should return correct permissions for admin role', () => {
      const permissions = roleService.getUserPermissions('admin');
      expect(permissions).toEqual(ROLE_PERMISSIONS.admin);
      expect(permissions.canViewAdminPanel).toBe(true);
      expect(permissions.canModifyUserRoles).toBe(true);
    });
  });

  describe('hasPermission', () => {
    it('should return true for valid permission', () => {
      const hasPermission = roleService.hasPermission('admin', 'canModifyUserRoles');
      expect(hasPermission).toBe(true);
    });

    it('should return false for invalid permission', () => {
      const hasPermission = roleService.hasPermission('customer', 'canModifyUserRoles');
      expect(hasPermission).toBe(false);
    });
  });

  describe('canUserAccessRoute', () => {
    it('should allow admin to access admin routes', () => {
      const canAccess = roleService.canUserAccessRoute('admin', 'AdminPanel');
      expect(canAccess).toBe(true);
    });

    it('should deny customer access to admin routes', () => {
      const canAccess = roleService.canUserAccessRoute('customer', 'AdminPanel');
      expect(canAccess).toBe(false);
    });

    it('should allow vendor to access product management', () => {
      const canAccess = roleService.canUserAccessRoute('vendor', 'ProductManagement');
      expect(canAccess).toBe(true);
    });

    it('should allow all roles to access common routes', () => {
      const canAccess = roleService.canUserAccessRoute('customer', 'Home');
      expect(canAccess).toBe(true);
    });
  });

  describe('validateRoleTransition', () => {
    it('should allow admin to promote customer to vendor', () => {
      const isValid = roleService.validateRoleTransition('customer', 'vendor', 'admin');
      expect(isValid).toBe(true);
    });

    it('should deny non-admin from changing roles', () => {
      const isValid = roleService.validateRoleTransition('customer', 'vendor', 'customer');
      expect(isValid).toBe(false);
    });

    it('should deny non-admin from creating admin', () => {
      const isValid = roleService.validateRoleTransition('customer', 'admin', 'vendor');
      expect(isValid).toBe(false);
    });

    it('should allow admin to create another admin', () => {
      const isValid = roleService.validateRoleTransition('customer', 'admin', 'admin');
      expect(isValid).toBe(true);
    });
  });

  describe('updateUserRole', () => {
    it('should update user role successfully', async () => {
      const mockUpdate = jest.fn().mockResolvedValue({});
      
      const firestore = require('@react-native-firebase/firestore')();
      firestore.collection().doc().update = mockUpdate;

      await roleService.updateUserRole('user123', 'vendor', 'admin123');

      expect(mockUpdate).toHaveBeenCalledWith({
        role: 'vendor',
        updatedAt: expect.any(Object),
        roleHistory: expect.any(Object),
      });
    });

    it('should throw error when update fails', async () => {
      const mockUpdate = jest.fn().mockRejectedValue(new Error('Update failed'));
      
      const firestore = require('@react-native-firebase/firestore')();
      firestore.collection().doc().update = mockUpdate;

      await expect(
        roleService.updateUserRole('user123', 'vendor', 'admin123')
      ).rejects.toThrow('Failed to update user role');
    });
  });

  describe('assignDefaultRole', () => {
    it('should assign default customer role', async () => {
      const mockUpdate = jest.fn().mockResolvedValue({});
      
      const firestore = require('@react-native-firebase/firestore')();
      firestore.collection().doc().update = mockUpdate;

      await roleService.assignDefaultRole('user123');

      expect(mockUpdate).toHaveBeenCalledWith({
        role: DEFAULT_ROLE,
        updatedAt: expect.any(Object),
      });
    });
  });
});