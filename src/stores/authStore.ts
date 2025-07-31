import { create } from 'zustand';
import { AuthStore, User, RegisterFormData } from '../types/auth';
import { AuthService } from '../services/authService';
import { ErrorHandler } from '../utils/errorHandler';
import { NetworkUtils } from '../utils/networkUtils';
import auth from '@react-native-firebase/auth';

const authService = AuthService.getInstance();

export const useAuthStore = create<AuthStore>((set, _get) => ({
  // State
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Actions
  login: async (email: string) => {
    try {
      set({ isLoading: true, error: null });
      
      // Check network connectivity
      const isConnected = await NetworkUtils.checkConnectivity();
      if (!isConnected) {
        throw new Error('No internet connection');
      }

      // Use retry mechanism for network operations
      await NetworkUtils.withRetry(
        () => authService.loginWithEmailOTP(email),
        3,
        1000
      );
      
      // OTP sent successfully - user needs to verify
    } catch (error) {
      const appError = ErrorHandler.handleAuthError(error);
      set({ error: appError.message });
      
      if (ErrorHandler.isNetworkError(error)) {
        NetworkUtils.showNetworkError();
      }
      
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (data: RegisterFormData) => {
    try {
      set({ isLoading: true, error: null });
      
      const userData: Partial<User> = {
        email: data.email,
        role: 'customer',
        profile: {
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
        },
      };

      await authService.registerWithEmailOTP(data.email, userData);
      // OTP sent successfully - user needs to verify
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  verifyOTP: async (otp: string) => {
    try {
      set({ isLoading: true, error: null });
      const userCredential = await authService.verifyOTP(otp);
      
      // Create user object from Firebase user
      const firebaseUser = userCredential.user;
      const user: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        role: 'customer', // Default role
        profile: {
          firstName: '', // To be filled from registration data
          lastName: '',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      set({ 
        user, 
        isAuthenticated: true,
        error: null 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'OTP verification failed';
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true });
      await authService.logout();
      set({ 
        user: null, 
        isAuthenticated: false,
        error: null 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Logout failed';
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  setError: (error: string | null) => {
    set({ error });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  checkAuthState: async () => {
    try {
      set({ isLoading: true });
      
      // Check for stored session
      const session = await authService.getStoredSession();
      if (session && authService.isAuthenticated()) {
        const firebaseUser = authService.getCurrentUser();
        if (firebaseUser) {
          const user: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            role: 'customer', // Default role - should be fetched from Firestore
            profile: {
              firstName: '',
              lastName: '',
            },
            createdAt: new Date(session.lastLogin),
            updatedAt: new Date(),
          };

          set({ 
            user, 
            isAuthenticated: true,
            error: null 
          });
        }
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
      set({ 
        user: null, 
        isAuthenticated: false,
        error: null 
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));

// Firebase auth state listener
auth().onAuthStateChanged((_firebaseUser) => {
  const { checkAuthState } = useAuthStore.getState();
  checkAuthState();
});