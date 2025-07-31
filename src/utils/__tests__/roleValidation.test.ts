import {
  validateUserRole,
  validateRoleAssignment,
  validateAdminUserUpdate,
  validateUserProfileUpdate,
  UserRoleSchema,
  RoleAssignmentSchema,
  AdminUserUpdateSchema,
  UserProfileUpdateSchema,
} from '../roleValidation';

describe('roleValidation', () => {
  describe('UserRoleSchema', () => {
    it('should validate valid user roles', () => {
      expect(UserRoleSchema.safeParse('customer').success).toBe(true);
      expect(UserRoleSchema.safeParse('vendor').success).toBe(true);
      expect(UserRoleSchema.safeParse('admin').success).toBe(true);
    });

    it('should reject invalid user roles', () => {
      expect(UserRoleSchema.safeParse('invalid').success).toBe(false);
      expect(UserRoleSchema.safeParse(null).success).toBe(false);
      expect(UserRoleSchema.safeParse(123).success).toBe(false);
    });
  });

  describe('validateUserRole', () => {
    it('should return true for valid roles', () => {
      expect(validateUserRole('customer')).toBe(true);
      expect(validateUserRole('vendor')).toBe(true);
      expect(validateUserRole('admin')).toBe(true);
    });

    it('should return false for invalid roles', () => {
      expect(validateUserRole('invalid')).toBe(false);
      expect(validateUserRole('')).toBe(false);
      expect(validateUserRole('ADMIN')).toBe(false); // Case sensitive
    });
  });

  describe('RoleAssignmentSchema', () => {
    it('should validate valid role assignment data', () => {
      const validData = {
        uid: 'user123',
        role: 'vendor',
        assignedBy: 'admin123',
      };

      const result = RoleAssignmentSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid role assignment data', () => {
      const invalidData = {
        uid: '',
        role: 'invalid-role',
        assignedBy: 'admin123',
      };

      const result = RoleAssignmentSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should require all fields', () => {
      const incompleteData = {
        uid: 'user123',
        role: 'vendor',
        // missing assignedBy
      };

      const result = RoleAssignmentSchema.safeParse(incompleteData);
      expect(result.success).toBe(false);
    });
  });

  describe('validateRoleAssignment', () => {
    it('should validate and return parsed role assignment data', () => {
      const validData = {
        uid: 'user123',
        role: 'vendor',
        assignedBy: 'admin123',
      };

      const result = validateRoleAssignment(validData);
      expect(result).toEqual(validData);
    });

    it('should throw error for invalid role assignment data', () => {
      const invalidData = {
        uid: '',
        role: 'invalid-role',
        assignedBy: 'admin123',
      };

      expect(() => validateRoleAssignment(invalidData)).toThrow();
    });
  });

  describe('UserProfileUpdateSchema', () => {
    it('should validate valid profile update data', () => {
      const validData = {
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890',
        location: {
          latitude: 37.7749,
          longitude: -122.4194,
        },
      };

      const result = UserProfileUpdateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate minimal profile update data', () => {
      const minimalData = {
        firstName: 'John',
        lastName: 'Doe',
      };

      const result = UserProfileUpdateSchema.safeParse(minimalData);
      expect(result.success).toBe(true);
    });

    it('should reject empty required fields', () => {
      const invalidData = {
        firstName: '',
        lastName: 'Doe',
      };

      const result = UserProfileUpdateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should validate optional fields', () => {
      const dataWithOptionals = {
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890',
      };

      const result = UserProfileUpdateSchema.safeParse(dataWithOptionals);
      expect(result.success).toBe(true);
    });

    it('should validate location coordinates', () => {
      const dataWithLocation = {
        firstName: 'John',
        lastName: 'Doe',
        location: {
          latitude: 37.7749,
          longitude: -122.4194,
        },
      };

      const result = UserProfileUpdateSchema.safeParse(dataWithLocation);
      expect(result.success).toBe(true);
    });

    it('should reject invalid location coordinates', () => {
      const dataWithInvalidLocation = {
        firstName: 'John',
        lastName: 'Doe',
        location: {
          latitude: 'invalid',
          longitude: -122.4194,
        },
      };

      const result = UserProfileUpdateSchema.safeParse(dataWithInvalidLocation);
      expect(result.success).toBe(false);
    });
  });

  describe('AdminUserUpdateSchema', () => {
    it('should validate admin user update with role change', () => {
      const validData = {
        uid: 'user123',
        role: 'vendor',
        profile: {
          firstName: 'John',
          lastName: 'Doe',
        },
      };

      const result = AdminUserUpdateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate admin user update with only profile changes', () => {
      const validData = {
        uid: 'user123',
        profile: {
          firstName: 'John',
        },
      };

      const result = AdminUserUpdateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate admin user update with only role change', () => {
      const validData = {
        uid: 'user123',
        role: 'admin',
      };

      const result = AdminUserUpdateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should require uid', () => {
      const invalidData = {
        role: 'vendor',
      };

      const result = AdminUserUpdateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('validateAdminUserUpdate', () => {
    it('should validate and return parsed admin user update data', () => {
      const validData = {
        uid: 'user123',
        role: 'vendor',
        profile: {
          firstName: 'John',
          lastName: 'Doe',
        },
      };

      const result = validateAdminUserUpdate(validData);
      expect(result).toEqual(validData);
    });

    it('should throw error for invalid admin user update data', () => {
      const invalidData = {
        uid: '',
        role: 'invalid-role',
      };

      expect(() => validateAdminUserUpdate(invalidData)).toThrow();
    });
  });

  describe('validateUserProfileUpdate', () => {
    it('should validate and return parsed user profile update data', () => {
      const validData = {
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890',
      };

      const result = validateUserProfileUpdate(validData);
      expect(result).toEqual(validData);
    });

    it('should throw error for invalid user profile update data', () => {
      const invalidData = {
        firstName: '',
        lastName: 'Doe',
      };

      expect(() => validateUserProfileUpdate(invalidData)).toThrow();
    });
  });
});