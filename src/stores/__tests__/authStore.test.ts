import { useAuthStore } from '../authStore';
import { AuthService } from '../../services/authService';
import { ErrorHandler } from '../../utils/errorHandler';
import { NetworkUtils } from '../../utils/networkUtils';

// Mock dependencies
jest.mock('../../services/authService');
jest.mock('../../utils/errorHandler');
jest.mock('../../utils/networkUtils');
jest.mock('@react-native-firebase/auth', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    onAuthStateChanged: jest.fn(),
  })),
}));

const mockAuthService = {
  loginWithEmailOTP: jest.fn(),
  registerWithEmailOTP: jest.fn(),
  verifyOTP: jest.fn(),
  logout: jest.fn(),
  getCurrentUser: jest.fn(),
  isAuthenticated: jest.fn(),
  getStoredSession: jest.fn(),
} as jest.Mocked<AuthService>;

const mockErrorHandler = ErrorHandler as jest.Mocked<typeof ErrorHandler>;
const mockNetworkUtils = NetworkUtils as jest.Mocked<typeof NetworkUtils>;

// Mock AuthService.getInstance
(AuthService.getInstance as jest.Mock).mockReturnValue(mockAuthService);

describe('AuthStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset store state
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  });

  describe('login', () => {
    it('should successfully initiate login', async () => {
      mockNetworkUtils.checkConnectivity.mockResolvedValue(true);
      mockNetworkUtils.withRetry.mockImplementation((fn) => fn());
      mockAuthService.loginWithEmailOTP.mockResolvedValue();

      const { login } = useAuthStore.getState();
      await login('test@example.com');

      expect(mockAuthService.loginWithEmailOTP).toHaveBeenCalledWith('test@example.com');
    });

    it('should handle network connectivity errors', async () => {
      mockNetworkUtils.checkConnectivity.mockResolvedValue(false);
      mockErrorHandler.handleAuthError.mockReturnValue({
        code: 'NETWORK_ERROR',
        message: 'No internet connection',
        severity: 'high',
      });

      const { login } = useAuthStore.getState();

      await expect(login('test@example.com')).rejects.toThrow();
      
      const state = useAuthStore.getState();
      expect(state.error).toBe('No internet connection');
      expect(state.isLoading).toBe(false);
    });

    it('should handle auth service errors', async () => {
      mockNetworkUtils.checkConnectivity.mockResolvedValue(true);
      mockNetworkUtils.withRetry.mockRejectedValue(new Error('Auth failed'));
      mockErrorHandler.handleAuthError.mockReturnValue({
        code: 'AUTH_ERROR',
        message: 'Authentication failed',
        severity: 'medium',
      });
      mockErrorHandler.isNetworkError.mockReturnValue(false);

      const { login } = useAuthStore.getState();

      await expect(login('test@example.com')).rejects.toThrow();
      
      const state = useAuthStore.getState();
      expect(state.error).toBe('Authentication failed');
      expect(state.isLoading).toBe(false);
    });
  });

  describe('register', () => {
    const mockRegisterData = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890',
    };

    it('should successfully initiate registration', async () => {
      mockAuthService.registerWithEmailOTP.mockResolvedValue();

      const { register } = useAuthStore.getState();
      await register(mockRegisterData);

      expect(mockAuthService.registerWithEmailOTP).toHaveBeenCalledWith(
        'test@example.com',
        expect.objectContaining({
          email: 'test@example.com',
          role: 'customer',
          profile: {
            firstName: 'John',
            lastName: 'Doe',
            phone: '+1234567890',
          },
        })
      );
    });

    it('should handle registration errors', async () => {
      mockAuthService.registerWithEmailOTP.mockRejectedValue(new Error('Registration failed'));
      mockErrorHandler.handleAuthError.mockReturnValue({
        code: 'REGISTRATION_ERROR',
        message: 'Registration failed',
        severity: 'medium',
      });

      const { register } = useAuthStore.getState();

      await expect(register(mockRegisterData)).rejects.toThrow();
      
      const state = useAuthStore.getState();
      expect(state.error).toBe('Registration failed');
      expect(state.isLoading).toBe(false);
    });
  });

  describe('verifyOTP', () => {
    it('should successfully verify OTP and authenticate user', async () => {
      const mockUserCredential = {
        user: {
          uid: 'test-uid',
          email: 'test@example.com',
        },
      };

      mockAuthService.verifyOTP.mockResolvedValue(mockUserCredential as any);

      const { verifyOTP } = useAuthStore.getState();
      await verifyOTP('123456');

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(
        expect.objectContaining({
          uid: 'test-uid',
          email: 'test@example.com',
          role: 'customer',
        })
      );
      expect(state.error).toBeNull();
    });

    it('should handle OTP verification errors', async () => {
      mockAuthService.verifyOTP.mockRejectedValue(new Error('Invalid OTP'));
      mockErrorHandler.handleAuthError.mockReturnValue({
        code: 'INVALID_OTP',
        message: 'Invalid verification code',
        severity: 'medium',
      });

      const { verifyOTP } = useAuthStore.getState();

      await expect(verifyOTP('123456')).rejects.toThrow();
      
      const state = useAuthStore.getState();
      expect(state.error).toBe('Invalid verification code');
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('logout', () => {
    it('should successfully logout user', async () => {
      // Set initial authenticated state
      useAuthStore.setState({
        user: { uid: 'test-uid', email: 'test@example.com' } as any,
        isAuthenticated: true,
      });

      mockAuthService.logout.mockResolvedValue();

      const { logout } = useAuthStore.getState();
      await logout();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should handle logout errors', async () => {
      mockAuthService.logout.mockRejectedValue(new Error('Logout failed'));
      mockErrorHandler.handleAuthError.mockReturnValue({
        code: 'LOGOUT_ERROR',
        message: 'Logout failed',
        severity: 'medium',
      });

      const { logout } = useAuthStore.getState();

      await expect(logout()).rejects.toThrow();
      
      const state = useAuthStore.getState();
      expect(state.error).toBe('Logout failed');
    });
  });

  describe('checkAuthState', () => {
    it('should restore authenticated state from stored session', async () => {
      const mockSession = {
        uid: 'test-uid',
        email: 'test@example.com',
        lastLogin: Date.now(),
      };

      const mockUser = {
        uid: 'test-uid',
        email: 'test@example.com',
      };

      mockAuthService.getStoredSession.mockResolvedValue(mockSession);
      mockAuthService.isAuthenticated.mockReturnValue(true);
      mockAuthService.getCurrentUser.mockReturnValue(mockUser as any);

      const { checkAuthState } = useAuthStore.getState();
      await checkAuthState();

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(
        expect.objectContaining({
          uid: 'test-uid',
          email: 'test@example.com',
        })
      );
    });

    it('should handle missing session gracefully', async () => {
      mockAuthService.getStoredSession.mockResolvedValue(null);

      const { checkAuthState } = useAuthStore.getState();
      await checkAuthState();

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
    });
  });

  describe('setError', () => {
    it('should update error state', () => {
      const { setError } = useAuthStore.getState();
      setError('Test error');

      const state = useAuthStore.getState();
      expect(state.error).toBe('Test error');
    });

    it('should clear error state', () => {
      useAuthStore.setState({ error: 'Existing error' });
      
      const { setError } = useAuthStore.getState();
      setError(null);

      const state = useAuthStore.getState();
      expect(state.error).toBeNull();
    });
  });

  describe('setLoading', () => {
    it('should update loading state', () => {
      const { setLoading } = useAuthStore.getState();
      setLoading(true);

      const state = useAuthStore.getState();
      expect(state.isLoading).toBe(true);
    });
  });
});