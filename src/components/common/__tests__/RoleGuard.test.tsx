import React from 'react';
import { render } from '@testing-library/react-native';
import { NativeBaseProvider } from 'native-base';
import { RoleGuard, useRolePermissions } from '../RoleGuard';
import { useAuthStore } from '../../../stores/authStore';
import { User } from '../../../types/auth';

// Mock the auth store
jest.mock('../../../stores/authStore');
const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;

// Mock user data
const mockAdminUser: User = {
  uid: 'admin123',
  email: 'admin@test.com',
  role: 'admin',
  profile: {
    firstName: 'Admin',
    lastName: 'User',
  },
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockCustomerUser: User = {
  uid: 'customer123',
  email: 'customer@test.com',
  role: 'customer',
  profile: {
    firstName: 'Customer',
    lastName: 'User',
  },
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockVendorUser: User = {
  uid: 'vendor123',
  email: 'vendor@test.com',
  role: 'vendor',
  profile: {
    firstName: 'Vendor',
    lastName: 'User',
  },
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <NativeBaseProvider>{children}</NativeBaseProvider>
);

describe('RoleGuard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Role-based rendering', () => {
    it('should render children when user has allowed role', () => {
      mockUseAuthStore.mockReturnValue({
        user: mockAdminUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        login: jest.fn(),
        register: jest.fn(),
        verifyOTP: jest.fn(),
        logout: jest.fn(),
        setError: jest.fn(),
        setLoading: jest.fn(),
        checkAuthState: jest.fn(),
      });

      const { getByText } = render(
        <TestWrapper>
          <RoleGuard allowedRoles={['admin']}>
            <text>Admin Content</text>
          </RoleGuard>
        </TestWrapper>
      );

      expect(getByText('Admin Content')).toBeTruthy();
    });

    it('should not render children when user lacks required role', () => {
      mockUseAuthStore.mockReturnValue({
        user: mockCustomerUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        login: jest.fn(),
        register: jest.fn(),
        verifyOTP: jest.fn(),
        logout: jest.fn(),
        setError: jest.fn(),
        setLoading: jest.fn(),
        checkAuthState: jest.fn(),
      });

      const { queryByText } = render(
        <TestWrapper>
          <RoleGuard allowedRoles={['admin']}>
            <text>Admin Content</text>
          </RoleGuard>
        </TestWrapper>
      );

      expect(queryByText('Admin Content')).toBeNull();
    });

    it('should render fallback when user lacks required role', () => {
      mockUseAuthStore.mockReturnValue({
        user: mockCustomerUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        login: jest.fn(),
        register: jest.fn(),
        verifyOTP: jest.fn(),
        logout: jest.fn(),
        setError: jest.fn(),
        setLoading: jest.fn(),
        checkAuthState: jest.fn(),
      });

      const { getByText } = render(
        <TestWrapper>
          <RoleGuard 
            allowedRoles={['admin']} 
            fallback={<text>Access Denied</text>}
          >
            <text>Admin Content</text>
          </RoleGuard>
        </TestWrapper>
      );

      expect(getByText('Access Denied')).toBeTruthy();
    });

    it('should not render children when user is not authenticated', () => {
      mockUseAuthStore.mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        login: jest.fn(),
        register: jest.fn(),
        verifyOTP: jest.fn(),
        logout: jest.fn(),
        setError: jest.fn(),
        setLoading: jest.fn(),
        checkAuthState: jest.fn(),
      });

      const { queryByText } = render(
        <TestWrapper>
          <RoleGuard allowedRoles={['admin']}>
            <text>Admin Content</text>
          </RoleGuard>
        </TestWrapper>
      );

      expect(queryByText('Admin Content')).toBeNull();
    });
  });

  describe('Permission-based rendering', () => {
    it('should render children when user has required permission', () => {
      mockUseAuthStore.mockReturnValue({
        user: mockAdminUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        login: jest.fn(),
        register: jest.fn(),
        verifyOTP: jest.fn(),
        logout: jest.fn(),
        setError: jest.fn(),
        setLoading: jest.fn(),
        checkAuthState: jest.fn(),
      });

      const { getByText } = render(
        <TestWrapper>
          <RoleGuard requiredPermission="canViewAdminPanel">
            <text>Admin Panel</text>
          </RoleGuard>
        </TestWrapper>
      );

      expect(getByText('Admin Panel')).toBeTruthy();
    });

    it('should not render children when user lacks required permission', () => {
      mockUseAuthStore.mockReturnValue({
        user: mockCustomerUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        login: jest.fn(),
        register: jest.fn(),
        verifyOTP: jest.fn(),
        logout: jest.fn(),
        setError: jest.fn(),
        setLoading: jest.fn(),
        checkAuthState: jest.fn(),
      });

      const { queryByText } = render(
        <TestWrapper>
          <RoleGuard requiredPermission="canViewAdminPanel">
            <text>Admin Panel</text>
          </RoleGuard>
        </TestWrapper>
      );

      expect(queryByText('Admin Panel')).toBeNull();
    });
  });
});

// Test component for useRolePermissions hook
const TestHookComponent: React.FC = () => {
  const {
    hasRole,
    hasAnyRole,
    hasPermission,
    isAdmin,
    isVendor,
    isCustomer,
    currentRole,
  } = useRolePermissions();

  return (
    <view>
      <text testID="hasAdminRole">{hasRole('admin').toString()}</text>
      <text testID="hasAnyVendorOrAdmin">{hasAnyRole(['vendor', 'admin']).toString()}</text>
      <text testID="canViewAdminPanel">{hasPermission('canViewAdminPanel').toString()}</text>
      <text testID="isAdmin">{isAdmin.toString()}</text>
      <text testID="isVendor">{isVendor.toString()}</text>
      <text testID="isCustomer">{isCustomer.toString()}</text>
      <text testID="currentRole">{currentRole || 'null'}</text>
    </view>
  );
};

describe('useRolePermissions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return correct values for admin user', () => {
    mockUseAuthStore.mockReturnValue({
      user: mockAdminUser,
      isAuthenticated: true,
      isLoading: false,
      error: null,
      login: jest.fn(),
      register: jest.fn(),
      verifyOTP: jest.fn(),
      logout: jest.fn(),
      setError: jest.fn(),
      setLoading: jest.fn(),
      checkAuthState: jest.fn(),
    });

    const { getByTestId } = render(
      <TestWrapper>
        <TestHookComponent />
      </TestWrapper>
    );

    expect(getByTestId('hasAdminRole').children[0]).toBe('true');
    expect(getByTestId('hasAnyVendorOrAdmin').children[0]).toBe('true');
    expect(getByTestId('canViewAdminPanel').children[0]).toBe('true');
    expect(getByTestId('isAdmin').children[0]).toBe('true');
    expect(getByTestId('isVendor').children[0]).toBe('false');
    expect(getByTestId('isCustomer').children[0]).toBe('false');
    expect(getByTestId('currentRole').children[0]).toBe('admin');
  });

  it('should return correct values for customer user', () => {
    mockUseAuthStore.mockReturnValue({
      user: mockCustomerUser,
      isAuthenticated: true,
      isLoading: false,
      error: null,
      login: jest.fn(),
      register: jest.fn(),
      verifyOTP: jest.fn(),
      logout: jest.fn(),
      setError: jest.fn(),
      setLoading: jest.fn(),
      checkAuthState: jest.fn(),
    });

    const { getByTestId } = render(
      <TestWrapper>
        <TestHookComponent />
      </TestWrapper>
    );

    expect(getByTestId('hasAdminRole').children[0]).toBe('false');
    expect(getByTestId('canViewAdminPanel').children[0]).toBe('false');
    expect(getByTestId('isAdmin').children[0]).toBe('false');
    expect(getByTestId('isCustomer').children[0]).toBe('true');
    expect(getByTestId('currentRole').children[0]).toBe('customer');
  });

  it('should return correct values for vendor user', () => {
    mockUseAuthStore.mockReturnValue({
      user: mockVendorUser,
      isAuthenticated: true,
      isLoading: false,
      error: null,
      login: jest.fn(),
      register: jest.fn(),
      verifyOTP: jest.fn(),
      logout: jest.fn(),
      setError: jest.fn(),
      setLoading: jest.fn(),
      checkAuthState: jest.fn(),
    });

    const { getByTestId } = render(
      <TestWrapper>
        <TestHookComponent />
      </TestWrapper>
    );

    expect(getByTestId('hasAnyVendorOrAdmin').children[0]).toBe('true');
    expect(getByTestId('isVendor').children[0]).toBe('true');
    expect(getByTestId('isAdmin').children[0]).toBe('false');
    expect(getByTestId('currentRole').children[0]).toBe('vendor');
  });

  it('should handle null user', () => {
    mockUseAuthStore.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      login: jest.fn(),
      register: jest.fn(),
      verifyOTP: jest.fn(),
      logout: jest.fn(),
      setError: jest.fn(),
      setLoading: jest.fn(),
      checkAuthState: jest.fn(),
    });

    const { getByTestId } = render(
      <TestWrapper>
        <TestHookComponent />
      </TestWrapper>
    );

    expect(getByTestId('hasAdminRole').children[0]).toBe('false');
    expect(getByTestId('canViewAdminPanel').children[0]).toBe('false');
    expect(getByTestId('isAdmin').children[0]).toBe('false');
    expect(getByTestId('currentRole').children[0]).toBe('null');
  });
});