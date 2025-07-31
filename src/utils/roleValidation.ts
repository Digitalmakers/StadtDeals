import { z } from 'zod';
import { UserRole } from '../types/roles';

export const UserRoleSchema = z.enum(['customer', 'vendor', 'admin']);

export const UserProfileUpdateSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }).optional(),
});

export const RoleAssignmentSchema = z.object({
  uid: z.string().min(1, 'User ID is required'),
  role: UserRoleSchema,
  assignedBy: z.string().min(1, 'Assigner ID is required'),
});

export const AdminUserUpdateSchema = z.object({
  uid: z.string().min(1, 'User ID is required'),
  role: UserRoleSchema.optional(),
  profile: UserProfileUpdateSchema.partial().optional(),
});

// Validation functions
export const validateUserRole = (role: string): role is UserRole => {
  return UserRoleSchema.safeParse(role).success;
};

export const validateRoleAssignment = (data: unknown) => {
  return RoleAssignmentSchema.parse(data);
};

export const validateAdminUserUpdate = (data: unknown) => {
  return AdminUserUpdateSchema.parse(data);
};

export const validateUserProfileUpdate = (data: unknown) => {
  return UserProfileUpdateSchema.parse(data);
};