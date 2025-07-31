export type UserRole = 'customer' | 'vendor' | 'admin';

export interface UserPermissions {
  canViewCustomers: boolean;
  canViewVendors: boolean;
  canViewAdminPanel: boolean;
  canModifyUserRoles: boolean;
  canViewAllOrders: boolean;
  canCreateProducts: boolean;
  canManageOwnProducts: boolean;
  canProcessOrders: boolean;
  canAccessChat: boolean;
}

export interface RoleConfig {
  role: UserRole;
  permissions: UserPermissions;
  displayName: string;
  description: string;
}

export interface UserRoleExtended {
  role: UserRole;
  permissions: string[];
  assignedAt: Date;
  assignedBy?: string;
}

export interface AdminUserListItem {
  uid: string;
  email: string;
  role: UserRole;
  profile: {
    firstName: string;
    lastName: string;
  };
  createdAt: Date;
  lastLogin?: Date;
}

export const ROLE_PERMISSIONS: Record<UserRole, UserPermissions> = {
  customer: {
    canViewCustomers: false,
    canViewVendors: false,
    canViewAdminPanel: false,
    canModifyUserRoles: false,
    canViewAllOrders: false,
    canCreateProducts: false,
    canManageOwnProducts: false,
    canProcessOrders: false,
    canAccessChat: true,
  },
  vendor: {
    canViewCustomers: false,
    canViewVendors: false,
    canViewAdminPanel: false,
    canModifyUserRoles: false,
    canViewAllOrders: false,
    canCreateProducts: true,
    canManageOwnProducts: true,
    canProcessOrders: true,
    canAccessChat: true,
  },
  admin: {
    canViewCustomers: true,
    canViewVendors: true,
    canViewAdminPanel: true,
    canModifyUserRoles: true,
    canViewAllOrders: true,
    canCreateProducts: true,
    canManageOwnProducts: true,
    canProcessOrders: true,
    canAccessChat: true,
  },
};

export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  customer: {
    role: 'customer',
    permissions: ROLE_PERMISSIONS.customer,
    displayName: 'Customer',
    description: 'Can browse products, place orders, and chat with vendors',
  },
  vendor: {
    role: 'vendor',
    permissions: ROLE_PERMISSIONS.vendor,
    displayName: 'Vendor',
    description: 'Can manage products, process orders, and communicate with customers',
  },
  admin: {
    role: 'admin',
    permissions: ROLE_PERMISSIONS.admin,
    displayName: 'Administrator',
    description: 'Full system access including user management and platform oversight',
  },
};

export const DEFAULT_ROLE: UserRole = 'customer';