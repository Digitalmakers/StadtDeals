import { useAdminStore } from '../adminStore';
import { adminService } from '../../services/adminService';
import { AdminUserListItem } from '../../types/roles';

// Mock the admin service
jest.mock('../../services/adminService');
const mockAdminService = adminService as jest.Mocked<typeof adminService>;

// Mock user data
const mockUsers: AdminUserListItem[] = [
  {
    uid: 'user1',
    email: 'admin@test.com',
    role: 'admin',
    profile: { firstName: 'Admin', lastName: 'User' },
    createdAt: new Date('2024-01-01'),
  },
  {
    uid: 'user2',
    email: 'vendor@test.com',
    role: 'vendor',
    profile: { firstName: 'Vendor', lastName: 'User' },
    createdAt: new Date('2024-01-02'),
  },
  {
    uid: 'user3',
    email: 'customer@test.com',
    role: 'customer',
    profile: { firstName: 'Customer', lastName: 'User' },
    createdAt: new Date('2024-01-03'),
  },
];

const mockStats = {
  totalUsers: 3,
  customerCount: 1,
  vendorCount: 1,
  adminCount: 1,
  activeUsers: 3,
  inactiveUsers: 0,
};

describe('AdminStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset store state
    useAdminStore.setState({
      users: [],
      filteredUsers: [],
      stats: null,
      isLoading: false,
      error: null,
      selectedRole: 'all',
      searchQuery: '',
    });
  });

  describe('loadAllUsers', () => {
    it('should load users successfully', async () => {
      mockAdminService.getAllUsers.mockResolvedValue(mockUsers);

      const { loadAllUsers } = useAdminStore.getState();
      await loadAllUsers();

      const state = useAdminStore.getState();
      expect(state.users).toEqual(mockUsers);
      expect(state.filteredUsers).toEqual(mockUsers);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should handle loading error', async () => {
      const errorMessage = 'Failed to load users';
      mockAdminService.getAllUsers.mockRejectedValue(new Error(errorMessage));

      const { loadAllUsers } = useAdminStore.getState();
      await loadAllUsers();

      const state = useAdminStore.getState();
      expect(state.users).toEqual([]);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    it('should set loading state during request', async () => {
      let resolvePromise: (value: AdminUserListItem[]) => void;
      const promise = new Promise<AdminUserListItem[]>((resolve) => {
        resolvePromise = resolve;
      });
      mockAdminService.getAllUsers.mockReturnValue(promise);

      const { loadAllUsers } = useAdminStore.getState();
      const loadPromise = loadAllUsers();

      // Check loading state
      expect(useAdminStore.getState().isLoading).toBe(true);

      // Resolve the promise
      resolvePromise!(mockUsers);
      await loadPromise;

      // Check final state
      expect(useAdminStore.getState().isLoading).toBe(false);
    });
  });

  describe('loadUsersByRole', () => {
    it('should load users by role successfully', async () => {
      const vendorUsers = mockUsers.filter(u => u.role === 'vendor');
      mockAdminService.getUsersByRole.mockResolvedValue(vendorUsers);

      const { loadUsersByRole } = useAdminStore.getState();
      await loadUsersByRole('vendor');

      const state = useAdminStore.getState();
      expect(state.users).toEqual(vendorUsers);
      expect(state.selectedRole).toBe('vendor');
      expect(mockAdminService.getUsersByRole).toHaveBeenCalledWith('vendor');
    });
  });

  describe('loadUserStats', () => {
    it('should load user statistics successfully', async () => {
      mockAdminService.getUserStats.mockResolvedValue(mockStats);

      const { loadUserStats } = useAdminStore.getState();
      await loadUserStats();

      const state = useAdminStore.getState();
      expect(state.stats).toEqual(mockStats);
      expect(state.error).toBeNull();
    });

    it('should handle stats loading error', async () => {
      const errorMessage = 'Failed to load statistics';
      mockAdminService.getUserStats.mockRejectedValue(new Error(errorMessage));

      const { loadUserStats } = useAdminStore.getState();
      await loadUserStats();

      const state = useAdminStore.getState();
      expect(state.stats).toBeNull();
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('updateUserRole', () => {
    it('should update user role successfully', async () => {
      mockAdminService.updateUserRole.mockResolvedValue();
      mockAdminService.getUserStats.mockResolvedValue(mockStats);

      // Set initial users
      useAdminStore.setState({ users: mockUsers, filteredUsers: mockUsers });

      const { updateUserRole } = useAdminStore.getState();
      await updateUserRole('user3', 'vendor', 'admin123', 'admin');

      const state = useAdminStore.getState();
      const updatedUser = state.users.find(u => u.uid === 'user3');
      expect(updatedUser?.role).toBe('vendor');
      expect(mockAdminService.updateUserRole).toHaveBeenCalledWith('user3', 'vendor', 'admin123', 'admin');
    });

    it('should handle role update error', async () => {
      const errorMessage = 'Failed to update user role';
      mockAdminService.updateUserRole.mockRejectedValue(new Error(errorMessage));

      useAdminStore.setState({ users: mockUsers, filteredUsers: mockUsers });

      const { updateUserRole } = useAdminStore.getState();
      await updateUserRole('user3', 'vendor', 'admin123', 'admin');

      const state = useAdminStore.getState();
      expect(state.error).toBe(errorMessage);
      expect(state.isLoading).toBe(false);
    });
  });

  describe('filtering', () => {
    beforeEach(() => {
      useAdminStore.setState({ users: mockUsers });
    });

    it('should filter users by role', () => {
      const { setRoleFilter } = useAdminStore.getState();
      setRoleFilter('vendor');

      const state = useAdminStore.getState();
      expect(state.selectedRole).toBe('vendor');
      expect(state.filteredUsers).toHaveLength(1);
      expect(state.filteredUsers[0].role).toBe('vendor');
    });

    it('should filter users by search query', () => {
      const { setSearchQuery } = useAdminStore.getState();
      setSearchQuery('admin');

      const state = useAdminStore.getState();
      expect(state.searchQuery).toBe('admin');
      expect(state.filteredUsers).toHaveLength(1);
      expect(state.filteredUsers[0].email).toBe('admin@test.com');
    });

    it('should filter by both role and search query', () => {
      const { setRoleFilter, setSearchQuery } = useAdminStore.getState();
      
      setRoleFilter('customer');
      setSearchQuery('customer');

      const state = useAdminStore.getState();
      expect(state.filteredUsers).toHaveLength(1);
      expect(state.filteredUsers[0].role).toBe('customer');
      expect(state.filteredUsers[0].email).toBe('customer@test.com');
    });

    it('should show all users when role filter is "all"', () => {
      const { setRoleFilter } = useAdminStore.getState();
      setRoleFilter('all');

      const state = useAdminStore.getState();
      expect(state.filteredUsers).toHaveLength(3);
    });

    it('should handle empty search results', () => {
      const { setSearchQuery } = useAdminStore.getState();
      setSearchQuery('nonexistent');

      const state = useAdminStore.getState();
      expect(state.filteredUsers).toHaveLength(0);
    });
  });

  describe('deactivateUser', () => {
    it('should deactivate user successfully', async () => {
      mockAdminService.deactivateUser.mockResolvedValue();
      mockAdminService.getUserStats.mockResolvedValue(mockStats);

      useAdminStore.setState({ users: mockUsers, filteredUsers: mockUsers });

      const { deactivateUser } = useAdminStore.getState();
      await deactivateUser('user3', 'admin123', 'Test reason');

      const state = useAdminStore.getState();
      expect(state.users.find(u => u.uid === 'user3')).toBeUndefined();
      expect(mockAdminService.deactivateUser).toHaveBeenCalledWith('user3', 'admin123', 'Test reason');
    });
  });

  describe('error handling', () => {
    it('should clear error', () => {
      useAdminStore.setState({ error: 'Test error' });

      const { clearError } = useAdminStore.getState();
      clearError();

      const state = useAdminStore.getState();
      expect(state.error).toBeNull();
    });

    it('should set error', () => {
      const { setError } = useAdminStore.getState();
      setError('Test error');

      const state = useAdminStore.getState();
      expect(state.error).toBe('Test error');
    });

    it('should set loading state', () => {
      const { setLoading } = useAdminStore.getState();
      setLoading(true);

      const state = useAdminStore.getState();
      expect(state.isLoading).toBe(true);
    });
  });
});