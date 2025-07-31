import { adminService } from '../adminService';
import { roleService } from '../roleService';
import { AdminUserListItem } from '../../types/roles';

// Mock dependencies
jest.mock('../roleService');
jest.mock('../../utils/roleValidation');

// Mock Firestore
jest.mock('@react-native-firebase/firestore', () => {
  const mockFirestore = {
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        update: jest.fn(),
        get: jest.fn(),
        set: jest.fn(),
      })),
      add: jest.fn(),
      where: jest.fn(() => ({
        limit: jest.fn(() => ({
          orderBy: jest.fn(() => ({
            get: jest.fn(),
          })),
          get: jest.fn(),
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
      delete: jest.fn(),
    },
  };

  return () => mockFirestore;
});

const mockRoleService = roleService as jest.Mocked<typeof roleService>;

describe('AdminService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('should return all users successfully', async () => {
      const mockUsers = [
        {
          email: 'user1@test.com',
          role: 'customer',
          profile: { firstName: 'User', lastName: 'One' },
          createdAt: { toDate: () => new Date('2024-01-01') },
          lastLogin: { toDate: () => new Date('2024-01-02') },
        },
        {
          email: 'user2@test.com',
          role: 'vendor',
          profile: { firstName: 'User', lastName: 'Two' },
          createdAt: { toDate: () => new Date('2024-01-01') },
        },
      ];

      const mockQuerySnapshot = {
        docs: mockUsers.map((user, index) => ({
          id: `user${index + 1}`,
          data: () => user,
        })),
      };

      const firestore = require('@react-native-firebase/firestore')();
      firestore.collection().limit().orderBy().get.mockResolvedValue(mockQuerySnapshot);

      const result = await adminService.getAllUsers();

      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({
        uid: 'user1',
        email: 'user1@test.com',
        role: 'customer',
        profile: { firstName: 'User', lastName: 'One' },
      });
    });

    it('should handle errors when getting all users', async () => {
      const firestore = require('@react-native-firebase/firestore')();
      firestore.collection().limit().orderBy().get.mockRejectedValue(new Error('Database error'));

      await expect(adminService.getAllUsers()).rejects.toThrow('Failed to retrieve users');
    });
  });

  describe('getUsersByRole', () => {
    it('should return users filtered by role', async () => {
      const mockVendors = [
        {
          email: 'vendor@test.com',
          role: 'vendor',
          profile: { firstName: 'Vendor', lastName: 'User' },
          createdAt: { toDate: () => new Date('2024-01-01') },
        },
      ];

      const mockQuerySnapshot = {
        docs: mockVendors.map((user, index) => ({
          id: `vendor${index + 1}`,
          data: () => user,
        })),
      };

      const firestore = require('@react-native-firebase/firestore')();
      firestore.collection().where().limit().orderBy().get.mockResolvedValue(mockQuerySnapshot);

      const result = await adminService.getUsersByRole('vendor');

      expect(result).toHaveLength(1);
      expect(result[0].role).toBe('vendor');
      expect(firestore.collection().where).toHaveBeenCalledWith('role', '==', 'vendor');
    });
  });

  describe('updateUserRole', () => {
    it('should update user role successfully', async () => {
      const mockUser = {
        uid: 'user123',
        role: 'customer',
        email: 'user@test.com',
      };

      const firestore = require('@react-native-firebase/firestore')();
      firestore.collection().doc().get.mockResolvedValue({
        exists: true,
        data: () => mockUser,
      });

      mockRoleService.validateRoleTransition.mockReturnValue(true);
      mockRoleService.updateUserRole.mockResolvedValue();

      await adminService.updateUserRole('user123', 'vendor', 'admin123', 'admin');

      expect(mockRoleService.validateRoleTransition).toHaveBeenCalledWith('customer', 'vendor', 'admin');
      expect(mockRoleService.updateUserRole).toHaveBeenCalledWith('user123', 'vendor', 'admin123');
    });

    it('should throw error if user not found', async () => {
      const firestore = require('@react-native-firebase/firestore')();
      firestore.collection().doc().get.mockResolvedValue({
        exists: false,
      });

      await expect(
        adminService.updateUserRole('nonexistent', 'vendor', 'admin123', 'admin')
      ).rejects.toThrow('User not found');
    });

    it('should throw error if role transition is invalid', async () => {
      const mockUser = {
        uid: 'user123',
        role: 'customer',
        email: 'user@test.com',
      };

      const firestore = require('@react-native-firebase/firestore')();
      firestore.collection().doc().get.mockResolvedValue({
        exists: true,
        data: () => mockUser,
      });

      mockRoleService.validateRoleTransition.mockReturnValue(false);

      await expect(
        adminService.updateUserRole('user123', 'admin', 'vendor123', 'vendor')
      ).rejects.toThrow('Insufficient permissions for role change');
    });
  });

  describe('updateUserProfile', () => {
    it('should update user profile successfully', async () => {
      const profileUpdates = {
        firstName: 'Updated',
        lastName: 'Name',
        phone: '+1234567890',
      };

      const firestore = require('@react-native-firebase/firestore')();
      firestore.collection().doc().update.mockResolvedValue();

      await adminService.updateUserProfile('user123', profileUpdates, 'admin123');

      expect(firestore.collection().doc().update).toHaveBeenCalledWith({
        'profile.firstName': 'Updated',
        'profile.lastName': 'Name',
        'profile.phone': '+1234567890',
        'profile.location': undefined,
        updatedAt: expect.any(Object),
        lastModifiedBy: 'admin123',
      });
    });

    it('should handle profile update errors', async () => {
      const firestore = require('@react-native-firebase/firestore')();
      firestore.collection().doc().update.mockRejectedValue(new Error('Update failed'));

      await expect(
        adminService.updateUserProfile('user123', { firstName: 'Test' }, 'admin123')
      ).rejects.toThrow('Failed to update user profile');
    });
  });

  describe('deactivateUser', () => {
    it('should deactivate user successfully', async () => {
      const firestore = require('@react-native-firebase/firestore')();
      firestore.collection().doc().update.mockResolvedValue();
      firestore.collection().add.mockResolvedValue();

      await adminService.deactivateUser('user123', 'admin123', 'Violation of terms');

      expect(firestore.collection().doc().update).toHaveBeenCalledWith({
        isActive: false,
        deactivatedAt: expect.any(Object),
        deactivatedBy: 'admin123',
        deactivationReason: 'Violation of terms',
        updatedAt: expect.any(Object),
      });
    });

    it('should use default reason when none provided', async () => {
      const firestore = require('@react-native-firebase/firestore')();
      firestore.collection().doc().update.mockResolvedValue();
      firestore.collection().add.mockResolvedValue();

      await adminService.deactivateUser('user123', 'admin123');

      expect(firestore.collection().doc().update).toHaveBeenCalledWith(
        expect.objectContaining({
          deactivationReason: 'No reason provided',
        })
      );
    });
  });

  describe('reactivateUser', () => {
    it('should reactivate user successfully', async () => {
      const firestore = require('@react-native-firebase/firestore')();
      firestore.collection().doc().update.mockResolvedValue();
      firestore.collection().add.mockResolvedValue();

      await adminService.reactivateUser('user123', 'admin123');

      expect(firestore.collection().doc().update).toHaveBeenCalledWith({
        isActive: true,
        reactivatedAt: expect.any(Object),
        reactivatedBy: 'admin123',
        deactivatedAt: expect.any(Object), // FieldValue.delete()
        deactivatedBy: expect.any(Object), // FieldValue.delete()
        deactivationReason: expect.any(Object), // FieldValue.delete()
        updatedAt: expect.any(Object),
      });
    });
  });

  describe('getUserStats', () => {
    it('should return user statistics', async () => {
      const mockQuerySnapshots = [
        { size: 2 }, // customers
        { size: 1 }, // vendors
        { size: 1 }, // admins
        { size: 4 }, // active users
      ];

      const firestore = require('@react-native-firebase/firestore')();
      firestore.collection().where().get
        .mockResolvedValueOnce(mockQuerySnapshots[0])
        .mockResolvedValueOnce(mockQuerySnapshots[1])
        .mockResolvedValueOnce(mockQuerySnapshots[2])
        .mockResolvedValueOnce(mockQuerySnapshots[3]);

      const stats = await adminService.getUserStats();

      expect(stats).toEqual({
        totalUsers: 4,
        customerCount: 2,
        vendorCount: 1,
        adminCount: 1,
        activeUsers: 4,
        inactiveUsers: 0,
      });
    });

    it('should handle stats query errors', async () => {
      const firestore = require('@react-native-firebase/firestore')();
      firestore.collection().where().get.mockRejectedValue(new Error('Query failed'));

      await expect(adminService.getUserStats()).rejects.toThrow('Failed to retrieve user statistics');
    });
  });
});