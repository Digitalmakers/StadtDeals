import React from 'react';
import { Box, HStack, Text, Badge } from 'native-base';
import { useRolePermissions } from './RoleGuard';
import { ROLE_CONFIGS } from '../../types/roles';

interface NavigationItem {
  id: string;
  label: string;
  icon?: string;
  route: string;
  requiredPermission?: keyof typeof ROLE_CONFIGS.admin.permissions;
  allowedRoles?: Array<keyof typeof ROLE_CONFIGS>;
}

interface RoleBasedNavigationProps {
  items: NavigationItem[];
  onNavigate: (route: string) => void;
  orientation?: 'horizontal' | 'vertical';
}

export const RoleBasedNavigation: React.FC<RoleBasedNavigationProps> = ({
  items,
  onNavigate,
  orientation = 'vertical',
}) => {
  const { hasPermission, hasAnyRole, currentRole } = useRolePermissions();

  const visibleItems = items.filter(item => {
    // Check role requirements
    if (item.allowedRoles && !hasAnyRole(item.allowedRoles as any)) {
      return false;
    }

    // Check permission requirements
    if (item.requiredPermission && !hasPermission(item.requiredPermission)) {
      return false;
    }

    return true;
  });

  if (visibleItems.length === 0) {
    return null;
  }

  const Container = orientation === 'horizontal' ? HStack : Box;

  return (
    <Container space={2}>
      {visibleItems.map(item => (
        <Box
          key={item.id}
          p={3}
          borderRadius="md"
          bg="gray.50"
          _pressed={{ bg: 'gray.100' }}
          onTouchEnd={() => onNavigate(item.route)}
        >
          <HStack alignItems="center" space={2}>
            <Text fontSize="md" fontWeight="medium">
              {item.label}
            </Text>
            {currentRole === 'admin' && (
              <Badge colorScheme="orange" size="sm">
                Admin
              </Badge>
            )}
          </HStack>
        </Box>
      ))}
    </Container>
  );
};

export const AdminBadge: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'sm' }) => {
  const { isAdmin } = useRolePermissions();

  if (!isAdmin) {
    return null;
  }

  return (
    <Badge colorScheme="orange" size={size}>
      Admin
    </Badge>
  );
};

export const VendorBadge: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'sm' }) => {
  const { isVendor } = useRolePermissions();

  if (!isVendor) {
    return null;
  }

  return (
    <Badge colorScheme="blue" size={size}>
      Vendor
    </Badge>
  );
};