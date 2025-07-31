import React from 'react';
import { Badge } from 'native-base';
import { useRolePermissions } from './RoleGuard';

interface RoleBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const AdminBadge: React.FC<RoleBadgeProps> = ({ 
  size = 'sm', 
  showLabel = true 
}) => {
  const { isAdmin } = useRolePermissions();

  if (!isAdmin) {
    return null;
  }

  return (
    <Badge colorScheme="orange" size={size}>
      {showLabel ? 'Admin' : ''}
    </Badge>
  );
};

export const VendorBadge: React.FC<RoleBadgeProps> = ({ 
  size = 'sm', 
  showLabel = true 
}) => {
  const { isVendor } = useRolePermissions();

  if (!isVendor) {
    return null;
  }

  return (
    <Badge colorScheme="blue" size={size}>
      {showLabel ? 'Vendor' : ''}
    </Badge>
  );
};

export const CustomerBadge: React.FC<RoleBadgeProps> = ({ 
  size = 'sm', 
  showLabel = true 
}) => {
  const { isCustomer } = useRolePermissions();

  if (!isCustomer) {
    return null;
  }

  return (
    <Badge colorScheme="green" size={size}>
      {showLabel ? 'Customer' : ''}
    </Badge>
  );
};

export const RoleBadge: React.FC<RoleBadgeProps> = ({ 
  size = 'sm', 
  showLabel = true 
}) => {
  const { currentRole, isAdmin, isVendor, isCustomer } = useRolePermissions();

  if (!currentRole) {
    return null;
  }

  if (isAdmin) {
    return <AdminBadge size={size} showLabel={showLabel} />;
  }

  if (isVendor) {
    return <VendorBadge size={size} showLabel={showLabel} />;
  }

  if (isCustomer) {
    return <CustomerBadge size={size} showLabel={showLabel} />;
  }

  return null;
};