import { ErrorHandler } from '../errorHandler';

describe('ErrorHandler', () => {
  describe('handleAuthError', () => {
    it('should handle invalid email error', () => {
      const error = { code: 'auth/invalid-email' };
      const result = ErrorHandler.handleAuthError(error);

      expect(result).toEqual({
        code: 'INVALID_EMAIL',
        message: 'Please enter a valid email address.',
        severity: 'medium',
      });
    });

    it('should handle user not found error', () => {
      const error = { code: 'auth/user-not-found' };
      const result = ErrorHandler.handleAuthError(error);

      expect(result).toEqual({
        code: 'USER_NOT_FOUND',
        message: 'No account found with this email. Please sign up first.',
        severity: 'medium',
      });
    });

    it('should handle invalid verification code error', () => {
      const error = { code: 'auth/invalid-verification-code' };
      const result = ErrorHandler.handleAuthError(error);

      expect(result).toEqual({
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid verification code. Please try again.',
        severity: 'medium',
      });
    });

    it('should handle too many requests error', () => {
      const error = { code: 'auth/too-many-requests' };
      const result = ErrorHandler.handleAuthError(error);

      expect(result).toEqual({
        code: 'TOO_MANY_REQUESTS',
        message: 'Too many attempts. Please try again later.',
        severity: 'high',
      });
    });

    it('should handle network request failed error', () => {
      const error = { code: 'auth/network-request-failed' };
      const result = ErrorHandler.handleAuthError(error);

      expect(result).toEqual({
        code: 'NETWORK_ERROR',
        message: 'Network error. Please check your connection and try again.',
        severity: 'high',
      });
    });

    it('should handle email already in use error', () => {
      const error = { code: 'auth/email-already-in-use' };
      const result = ErrorHandler.handleAuthError(error);

      expect(result).toEqual({
        code: 'EMAIL_IN_USE',
        message: 'This email is already registered. Please sign in instead.',
        severity: 'medium',
      });
    });

    it('should handle weak password error', () => {
      const error = { code: 'auth/weak-password' };
      const result = ErrorHandler.handleAuthError(error);

      expect(result).toEqual({
        code: 'WEAK_PASSWORD',
        message: 'Password is too weak. Please choose a stronger password.',
        severity: 'medium',
      });
    });

    it('should handle operation not allowed error', () => {
      const error = { code: 'auth/operation-not-allowed' };
      const result = ErrorHandler.handleAuthError(error);

      expect(result).toEqual({
        code: 'OPERATION_NOT_ALLOWED',
        message: 'This authentication method is not enabled.',
        severity: 'high',
      });
    });

    it('should handle unknown auth error', () => {
      const error = { code: 'auth/unknown-error' };
      const result = ErrorHandler.handleAuthError(error);

      expect(result).toEqual({
        code: 'UNKNOWN_AUTH_ERROR',
        message: 'An authentication error occurred. Please try again.',
        severity: 'medium',
      });
    });

    it('should handle network error by message', () => {
      const error = { message: 'Network request failed' };
      const result = ErrorHandler.handleAuthError(error);

      expect(result).toEqual({
        code: 'NETWORK_ERROR',
        message: 'Network error. Please check your connection and try again.',
        severity: 'high',
      });
    });

    it('should handle timeout error by message', () => {
      const error = { message: 'Request timeout' };
      const result = ErrorHandler.handleAuthError(error);

      expect(result).toEqual({
        code: 'TIMEOUT_ERROR',
        message: 'Request timed out. Please try again.',
        severity: 'medium',
      });
    });

    it('should handle generic error with custom message', () => {
      const error = { message: 'Custom error message' };
      const result = ErrorHandler.handleAuthError(error);

      expect(result).toEqual({
        code: 'UNKNOWN_ERROR',
        message: 'Custom error message',
        severity: 'medium',
      });
    });

    it('should handle error without message', () => {
      const error = {};
      const result = ErrorHandler.handleAuthError(error);

      expect(result).toEqual({
        code: 'UNKNOWN_ERROR',
        message: 'An unexpected error occurred. Please try again.',
        severity: 'medium',
      });
    });
  });

  describe('handleValidationError', () => {
    it('should handle validation error with message', () => {
      const error = { message: 'Invalid input' };
      const result = ErrorHandler.handleValidationError(error);

      expect(result).toEqual({
        code: 'VALIDATION_ERROR',
        message: 'Invalid input',
        severity: 'low',
      });
    });

    it('should handle validation error without message', () => {
      const error = {};
      const result = ErrorHandler.handleValidationError(error);

      expect(result).toEqual({
        code: 'VALIDATION_ERROR',
        message: 'Please check your input and try again.',
        severity: 'low',
      });
    });
  });

  describe('handleNetworkError', () => {
    it('should return network error', () => {
      const result = ErrorHandler.handleNetworkError();

      expect(result).toEqual({
        code: 'NETWORK_ERROR',
        message: 'Please check your internet connection and try again.',
        severity: 'high',
      });
    });
  });

  describe('isNetworkError', () => {
    it('should identify network request failed error', () => {
      const error = { code: 'auth/network-request-failed' };
      expect(ErrorHandler.isNetworkError(error)).toBe(true);
    });

    it('should identify network error by message', () => {
      const error = { message: 'Network connection failed' };
      expect(ErrorHandler.isNetworkError(error)).toBe(true);
    });

    it('should identify timeout error by message', () => {
      const error = { message: 'Request timeout occurred' };
      expect(ErrorHandler.isNetworkError(error)).toBe(true);
    });

    it('should not identify non-network errors', () => {
      const error = { code: 'auth/invalid-email' };
      expect(ErrorHandler.isNetworkError(error)).toBe(false);
    });
  });

  describe('shouldRetry', () => {
    it('should recommend retry for high severity network errors', () => {
      const error = {
        code: 'NETWORK_ERROR',
        message: 'Network error',
        severity: 'high' as const,
      };
      expect(ErrorHandler.shouldRetry(error)).toBe(true);
    });

    it('should recommend retry for high severity timeout errors', () => {
      const error = {
        code: 'TIMEOUT_ERROR',
        message: 'Timeout error',
        severity: 'high' as const,
      };
      expect(ErrorHandler.shouldRetry(error)).toBe(true);
    });

    it('should not recommend retry for medium severity errors', () => {
      const error = {
        code: 'NETWORK_ERROR',
        message: 'Network error',
        severity: 'medium' as const,
      };
      expect(ErrorHandler.shouldRetry(error)).toBe(false);
    });

    it('should not recommend retry for non-network errors', () => {
      const error = {
        code: 'INVALID_EMAIL',
        message: 'Invalid email',
        severity: 'high' as const,
      };
      expect(ErrorHandler.shouldRetry(error)).toBe(false);
    });
  });
});