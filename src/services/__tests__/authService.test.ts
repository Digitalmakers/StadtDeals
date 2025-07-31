import { AuthService } from '../authService';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock Firebase Auth
jest.mock('@react-native-firebase/auth', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    currentUser: null,
    signOut: jest.fn(),
    onAuthStateChanged: jest.fn(),
  })),
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock ErrorHandler
jest.mock('../../utils/errorHandler', () => ({
  ErrorHandler: {
    handleAuthError: jest.fn((error) => ({
      code: 'TEST_ERROR',
      message: error.message || 'Test error',
      severity: 'medium',
    })),
  },
}));

describe('AuthService', () => {
  let authService: AuthService;
  const mockAuth = auth as jest.MockedFunction<typeof auth>;
  const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

  beforeEach(() => {
    authService = AuthService.getInstance();
    jest.clearAllMocks();
  });

  describe('getInstance', () => {
    it('should return singleton instance', () => {
      const instance1 = AuthService.getInstance();
      const instance2 = AuthService.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('sendOTPToEmail', () => {
    it('should validate email format', async () => {
      await expect(authService.sendOTPToEmail('invalid-email')).rejects.toThrow(
        'Invalid email format'
      );
    });

    it('should throw error for valid email (not implemented)', async () => {
      await expect(authService.sendOTPToEmail('test@example.com')).rejects.toThrow(
        'Email OTP not implemented yet - requires Firebase Functions setup'
      );
    });
  });

  describe('verifyOTP', () => {
    it('should throw error when no confirmation available', async () => {
      await expect(authService.verifyOTP('123456')).rejects.toThrow(
        'No OTP confirmation available. Please request OTP first.'
      );
    });
  });

  describe('logout', () => {
    it('should sign out user and clear session', async () => {
      const mockSignOut = jest.fn().mockResolvedValue(undefined);
      mockAuth.mockReturnValue({
        signOut: mockSignOut,
        currentUser: null,
        onAuthStateChanged: jest.fn(),
      } as any);

      mockAsyncStorage.removeItem.mockResolvedValue();

      await authService.logout();

      expect(mockSignOut).toHaveBeenCalled();
      expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith('userSession');
    });

    it('should handle logout errors', async () => {
      const mockSignOut = jest.fn().mockRejectedValue(new Error('Logout failed'));
      mockAuth.mockReturnValue({
        signOut: mockSignOut,
        currentUser: null,
        onAuthStateChanged: jest.fn(),
      } as any);

      await expect(authService.logout()).rejects.toThrow('Logout failed');
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user from Firebase Auth', () => {
      const mockUser = { uid: 'test-uid', email: 'test@example.com' };
      mockAuth.mockReturnValue({
        currentUser: mockUser,
        signOut: jest.fn(),
        onAuthStateChanged: jest.fn(),
      } as any);

      const user = authService.getCurrentUser();
      expect(user).toBe(mockUser);
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when user is authenticated', () => {
      const mockUser = { uid: 'test-uid', email: 'test@example.com' };
      mockAuth.mockReturnValue({
        currentUser: mockUser,
        signOut: jest.fn(),
        onAuthStateChanged: jest.fn(),
      } as any);

      expect(authService.isAuthenticated()).toBe(true);
    });

    it('should return false when user is not authenticated', () => {
      mockAuth.mockReturnValue({
        currentUser: null,
        signOut: jest.fn(),
        onAuthStateChanged: jest.fn(),
      } as any);

      expect(authService.isAuthenticated()).toBe(false);
    });
  });

  describe('storeUserSession', () => {
    it('should store user session in AsyncStorage', async () => {
      const mockUser = {
        uid: 'test-uid',
        email: 'test@example.com',
      } as any;

      mockAsyncStorage.setItem.mockResolvedValue();

      // Use reflection to access private method for testing
      const storeUserSession = (authService as any).storeUserSession.bind(authService);
      await storeUserSession(mockUser);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        'userSession',
        expect.stringContaining('"uid":"test-uid"')
      );
    });
  });

  describe('getStoredSession', () => {
    it('should return parsed session data', async () => {
      const sessionData = {
        uid: 'test-uid',
        email: 'test@example.com',
        lastLogin: Date.now(),
      };

      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(sessionData));

      const result = await authService.getStoredSession();
      expect(result).toEqual(sessionData);
    });

    it('should return null when no session data exists', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);

      const result = await authService.getStoredSession();
      expect(result).toBeNull();
    });

    it('should handle JSON parse errors', async () => {
      mockAsyncStorage.getItem.mockResolvedValue('invalid-json');

      const result = await authService.getStoredSession();
      expect(result).toBeNull();
    });
  });
});