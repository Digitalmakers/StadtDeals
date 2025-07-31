import React, { useEffect } from 'react';
import {
  Box,
  ScrollView,
  VStack,
  HStack,
  Text,
  Button,
  Badge,
  Spinner,
  Center,
  Alert,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
} from 'native-base';
import { AuthGuard } from '../../components/common/AuthGuard';
import { useAdminStore } from '../../stores/adminStore';
import { useAuthStore } from '../../stores/authStore';
import { AdminBadge } from '../../components/common/AdminBadge';

interface AdminScreenProps {
  navigation: any;
}

export const AdminScreen: React.FC<AdminScreenProps> = ({ navigation }) => {
  const { user } = useAuthStore();
  const { 
    stats, 
    isLoading, 
    error, 
    loadUserStats, 
    clearError 
  } = useAdminStore();

  useEffect(() => {
    loadUserStats();
  }, [loadUserStats]);

  const handleNavigateToUserManagement = () => {
    navigation.navigate('UserManagement');
  };

  const renderStats = () => {
    if (!stats) return null;

    return (
      <StatGroup mb={6}>
        <Stat flex="1" alignItems="center">
          <StatLabel>Total Users</StatLabel>
          <StatNumber>{stats.totalUsers}</StatNumber>
        </Stat>
        <Stat flex="1" alignItems="center">
          <StatLabel>Customers</StatLabel>
          <StatNumber color="green.500">{stats.customerCount}</StatNumber>
        </Stat>
        <Stat flex="1" alignItems="center">
          <StatLabel>Vendors</StatLabel>
          <StatNumber color="blue.500">{stats.vendorCount}</StatNumber>
        </Stat>
        <Stat flex="1" alignItems="center">
          <StatLabel>Admins</StatLabel>
          <StatNumber color="orange.500">{stats.adminCount}</StatNumber>
        </Stat>
      </StatGroup>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <Center flex={1}>
          <Spinner size="lg" color="primary.600" />
          <Text mt={2}>Loading admin dashboard...</Text>
        </Center>
      );
    }

    return (
      <ScrollView flex={1} p={4}>
        <VStack space={6}>
          {/* Header */}
          <Box>
            <HStack alignItems="center" space={2} mb={2}>
              <Text fontSize="2xl" fontWeight="bold">
                Admin Dashboard
              </Text>
              <AdminBadge />
            </HStack>
            <Text color="gray.600">
              Welcome back, {user?.profile.firstName}
            </Text>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert status="error" onClose={clearError}>
              <Alert.Icon />
              <Text>{error}</Text>
            </Alert>
          )}

          {/* Statistics */}
          {renderStats()}

          {/* Quick Actions */}
          <Box>
            <Text fontSize="lg" fontWeight="semibold" mb={4}>
              Quick Actions
            </Text>
            <VStack space={3}>
              <Button
                onPress={handleNavigateToUserManagement}
                bg="orange.500"
                _pressed={{ bg: 'orange.600' }}
              >
                <HStack alignItems="center" space={2}>
                  <Text color="white" fontWeight="medium">
                    Manage Users
                  </Text>
                </HStack>
              </Button>

              <Button
                variant="outline"
                borderColor="orange.500"
                _text={{ color: 'orange.500' }}
                onPress={() => {
                  // TODO: Navigate to audit logs
                  console.log('Navigate to audit logs');
                }}
              >
                View audit Logs
              </Button>

              <Button
                variant="outline"
                borderColor="orange.500"
                _text={{ color: 'orange.500' }}
                onPress={() => {
                  // TODO: Navigate to system settings
                  console.log('Navigate to system settings');
                }}
              >
                System Settings
              </Button>
            </VStack>
          </Box>

          {/* Activity Summary */}
          <Box>
            <Text fontSize="lg" fontWeight="semibold" mb={4}>
              System Status
            </Text>
            <VStack space={2}>
              <HStack justifyContent="space-between" alignItems="center">
                <Text>Active Users</Text>
                <Badge colorScheme="green" variant="solid">
                  {stats?.activeUsers || 0}
                </Badge>
              </HStack>
              <HStack justifyContent="space-between" alignItems="center">
                <Text>Inactive Users</Text>
                <Badge colorScheme="red" variant="solid">
                  {stats?.inactiveUsers || 0}
                </Badge>
              </HStack>
            </VStack>
          </Box>
        </VStack>
      </ScrollView>
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