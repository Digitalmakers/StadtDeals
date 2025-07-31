import React, { useEffect, useState } from 'react';
import {
  Box,
  ScrollView,
  VStack,
  HStack,
  Text,
  Button,
  Input,
  Select,
  Badge,
  Spinner,
  Center,
  Alert,
  Modal,
  FormControl,
  Pressable,
  Card,
  Avatar,
  Menu,
  Divider,
  useToast,
} from 'native-base';
import { AuthGuard } from '../../components/common/AuthGuard';
import { useAdminStore } from '../../stores/adminStore';
import { useAuthStore } from '../../stores/authStore';
import { AdminUserListItem, UserRole, ROLE_CONFIGS } from '../../types/roles';

interface UserManagementScreenProps {
  navigation: any;
}

export const UserManagementScreen: React.FC<UserManagementScreenProps> = ({ navigation }) => {
  const { user } = useAuthStore();
  const { 
    filteredUsers,
    isLoading, 
    error, 
    selectedRole,
    searchQuery,
    loadAllUsers,
    setRoleFilter,
    setSearchQuery,
    updateUserRole,
    deactivateUser,
    clearError
  } = useAdminStore();

  const toast = useToast();
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUserListItem | null>(null);
  const [newRole, setNewRole] = useState<UserRole>('customer');

  useEffect(() => {
    loadAllUsers();
  }, [loadAllUsers]);

  const handleRoleChange = async () => {
    if (!selectedUser || !user) return;

    try {
      await updateUserRole(selectedUser.uid, newRole, user.uid, user.role);
      setShowRoleModal(false);
      setSelectedUser(null);
      
      toast.show({
        description: `User role updated to ${newRole}`,
        status: 'success',
      });
    } catch (error) {
      toast.show({
        description: 'Failed to update user role',
        status: 'error',
      });
    }
  };

  const handleDeactivateUser = async (targetUser: AdminUserListItem) => {
    if (!user) return;

    try {
      await deactivateUser(targetUser.uid, user.uid, 'Deactivated by admin');
      toast.show({
        description: 'User deactivated successfully',
        status: 'success',
      });
    } catch (error) {
      toast.show({
        description: 'Failed to deactivate user',
        status: 'error',
      });
    }
  };

  const openRoleModal = (targetUser: AdminUserListItem) => {
    setSelectedUser(targetUser);
    setNewRole(targetUser.role);
    setShowRoleModal(true);
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'orange';
      case 'vendor': return 'blue';
      case 'customer': return 'green';
      default: return 'gray';
    }
  };

  const renderUserCard = (targetUser: AdminUserListItem) => (
    <Card key={targetUser.uid} mb={3} p={4}>
      <HStack alignItems="center" space={3}>
        <Avatar size="md" bg="gray.300">
          {targetUser.profile.firstName.charAt(0)}{targetUser.profile.lastName.charAt(0)}
        </Avatar>
        
        <VStack flex={1} space={1}>
          <Text fontSize="md" fontWeight="semibold">
            {targetUser.profile.firstName} {targetUser.profile.lastName}
          </Text>
          <Text fontSize="sm" color="gray.600">
            {targetUser.email}
          </Text>
          <HStack alignItems="center" space={2}>
            <Badge colorScheme={getRoleBadgeColor(targetUser.role)} size="sm">
              {ROLE_CONFIGS[targetUser.role].displayName}
            </Badge>
            <Text fontSize="xs" color="gray.500">
              Joined {targetUser.createdAt?.toLocaleDateString()}
            </Text>
          </HStack>
        </VStack>

        <Menu trigger={triggerProps => (
          <Pressable {...triggerProps}>
            <Text fontSize="lg">⋮</Text>
          </Pressable>
        )}>
          <Menu.Item onPress={() => openRoleModal(targetUser)}>
            Change Role
          </Menu.Item>
          <Menu.Item onPress={() => handleDeactivateUser(targetUser)}>
            Deactivate User
          </Menu.Item>
        </Menu>
      </HStack>
    </Card>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <Center flex={1}>
          <Spinner size="lg" color="primary.600" />
          <Text mt={2}>Loading users...</Text>
        </Center>
      );
    }

    return (
      <VStack flex={1} space={4} p={4}>
        {/* Header */}
        <Box>
          <Text fontSize="2xl" fontWeight="bold" mb={2}>
            User Management
          </Text>
          <Text color="gray.600">
            Manage user roles and permissions
          </Text>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert status="error" onClose={clearError}>
            <Alert.Icon />
            <Text>{error}</Text>
          </Alert>
        )}

        {/* Filters */}
        <VStack space={3}>
          <Input
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            bg="gray.50"
          />
          
          <Select
            selectedValue={selectedRole}
            onValueChange={(value) => setRoleFilter(value as UserRole | 'all')}
            placeholder="Filter by role"
            bg="gray.50"
          >
            <Select.Item label="All Roles" value="all" />
            <Select.Item label="Customers" value="customer" />
            <Select.Item label="Vendors" value="vendor" />
            <Select.Item label="Admins" value="admin" />
          </Select>
        </VStack>

        {/* User List */}
        <ScrollView flex={1}>
          <VStack space={2}>
            {filteredUsers.length === 0 ? (
              <Center py={8}>
                <Text color="gray.500">No users found</Text>
              </Center>
            ) : (
              filteredUsers.map(renderUserCard)
            )}
          </VStack>
        </ScrollView>

        {/* Role Change Modal */}
        <Modal isOpen={showRoleModal} onClose={() => setShowRoleModal(false)}>
          <Modal.Content>
            <Modal.CloseButton />
            <Modal.Header>Change User Role</Modal.Header>
            <Modal.Body>
              <VStack space={4}>
                <Text>
                  Change role for {selectedUser?.profile.firstName} {selectedUser?.profile.lastName}
                </Text>
                
                <FormControl>
                  <FormControl.Label>New Role</FormControl.Label>
                  <Select
                    selectedValue={newRole}
                    onValueChange={(value) => setNewRole(value as UserRole)}
                  >
                    <Select.Item label="Customer" value="customer" />
                    <Select.Item label="Vendor" value="vendor" />
                    <Select.Item label="Admin" value="admin" />
                  </Select>
                </FormControl>

                <Text fontSize="sm" color="gray.600">
                  {ROLE_CONFIGS[newRole].description}
                </Text>
              </VStack>
            </Modal.Body>
            <Modal.Footer>
              <Button.Group space={2}>
                <Button 
                  variant="ghost" 
                  onPress={() => setShowRoleModal(false)}
                >
                  Cancel
                </Button>
                <Button onPress={handleRoleChange}>
                  Update Role
                </Button>
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </VStack>
    );
  };

  return (
    <AuthGuard requiredRole="admin" fallback={
      <Center flex={1} bg="white">
        <Text>Access denied: Admin role required</Text>
      </Center>
    }>
      <Box flex={1} bg="white">
        {renderContent()}
      </Box>
    </AuthGuard>
  );
};