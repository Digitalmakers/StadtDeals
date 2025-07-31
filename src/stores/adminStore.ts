import { create } from 'zustand';
import { AdminUserListItem, UserRole } from '../types/roles';
import { adminService } from '../services/adminService';

interface AdminStats {
  totalUsers: number;
  customerCount: number;
  vendorCount: number;
  adminCount: number;
  activeUsers: number;
  inactiveUsers: number;
}

interface AdminState {
  users: AdminUserListItem[];
  filteredUsers: AdminUserListItem[];
  stats: AdminStats | null;
  isLoading: boolean;
  error: string | null;
  selectedRole: UserRole | 'all';
  searchQuery: string;
}

interface AdminActions {
  loadAllUsers: () => Promise<void>;
  loadUsersByRole: (role: UserRole) => Promise<void>;
  loadUserStats: () => Promise<void>;
  updateUserRole: (userId: string, newRole: UserRole, adminId: string, adminRole: UserRole) => Promise<void>;
  updateUserProfile: (userId: string, profileData: any, adminId: string) => Promise<void>;
  deactivateUser: (userId: string, adminId: string, reason?: string) => Promise<void>;
  reactivateUser: (userId: string, adminId: string) => Promise<void>;
  setRoleFilter: (role: UserRole | 'all') => void;
  setSearchQuery: (query: string) => void;
  filterUsers: () => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  clearError: () => void;
}

type AdminStore = AdminState & AdminActions;

export const useAdminStore = create<AdminStore>((set, get) => ({
  // Initial state
  users: [],
  filteredUsers: [],
  stats: null,
  isLoading: false,
  error: null,
  selectedRole: 'all',
  searchQuery: '',

  // Actions
  loadAllUsers: async () => {
    try {
      set({ isLoading: true, error: null });
      const users = await adminService.getAllUsers();
      set({ users, filteredUsers: users, isLoading: false });
      get().filterUsers();
    } catch (error) {
      console.error('Error loading users:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load users',
        isLoading: false 
      });
    }
  },

  loadUsersByRole: async (role: UserRole) => {
    try {
      set({ isLoading: true, error: null });
      const users = await adminService.getUsersByRole(role);
      set({ users, filteredUsers: users, selectedRole: role, isLoading: false });
      get().filterUsers();
    } catch (error) {
      console.error('Error loading users by role:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load users',
        isLoading: false 
      });
    }
  },

  loadUserStats: async () => {
    try {
      set({ error: null });
      const stats = await adminService.getUserStats();
      set({ stats });
    } catch (error) {
      console.error('Error loading user stats:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load statistics'
      });
    }
  },

  updateUserRole: async (userId: string, newRole: UserRole, adminId: string, adminRole: UserRole) => {
    try {
      set({ isLoading: true, error: null });
      await adminService.updateUserRole(userId, newRole, adminId, adminRole);
      
      // Update local state
      const { users } = get();
      const updatedUsers = users.map(user => 
        user.uid === userId ? { ...user, role: newRole } : user
      );
      set({ users: updatedUsers, isLoading: false });
      get().filterUsers();
      await get().loadUserStats(); // Refresh stats
    } catch (error) {
      console.error('Error updating user role:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update user role',
        isLoading: false 
      });
    }
  },

  updateUserProfile: async (userId: string, profileData: any, adminId: string) => {
    try {
      set({ isLoading: true, error: null });
      await adminService.updateUserProfile(userId, profileData, adminId);
      
      // Update local state
      const { users } = get();
      const updatedUsers = users.map(user => 
        user.uid === userId ? { ...user, profile: { ...user.profile, ...profileData } } : user
      );
      set({ users: updatedUsers, isLoading: false });
      get().filterUsers();
    } catch (error) {
      console.error('Error updating user profile:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update user profile',
        isLoading: false 
      });
    }
  },

  deactivateUser: async (userId: string, adminId: string, reason?: string) => {
    try {
      set({ isLoading: true, error: null });
      await adminService.deactivateUser(userId, adminId, reason);
      
      // Remove user from local state or mark as inactive
      const { users } = get();
      const updatedUsers = users.filter(user => user.uid !== userId);
      set({ users: updatedUsers, isLoading: false });
      get().filterUsers();
      await get().loadUserStats(); // Refresh stats
    } catch (error) {
      console.error('Error deactivating user:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to deactivate user',
        isLoading: false 
      });
    }
  },

  reactivateUser: async (userId: string, adminId: string) => {
    try {
      set({ isLoading: true, error: null });
      await adminService.reactivateUser(userId, adminId);
      set({ isLoading: false });
      await get().loadAllUsers(); // Reload all users
      await get().loadUserStats(); // Refresh stats
    } catch (error) {
      console.error('Error reactivating user:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to reactivate user',
        isLoading: false 
      });
    }
  },

  setRoleFilter: (role: UserRole | 'all') => {
    set({ selectedRole: role });
    get().filterUsers();
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
    get().filterUsers();
  },

  filterUsers: () => {
    const { users, selectedRole, searchQuery } = get();
    let filtered = [...users];

    // Filter by role
    if (selectedRole !== 'all') {
      filtered = filtered.filter(user => user.role === selectedRole);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(user => 
        user.email.toLowerCase().includes(query) ||
        user.profile.firstName.toLowerCase().includes(query) ||
        user.profile.lastName.toLowerCase().includes(query)
      );
    }

    set({ filteredUsers: filtered });
  },

  setError: (error: string | null) => set({ error }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  clearError: () => set({ error: null }),
}));