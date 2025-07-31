// import { FirebaseAuthTypes } from '@react-native-firebase/auth';

export interface AppError {
  code: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
}

export class ErrorHandler {
  static handleAuthError(error: any): AppError {
    if (error.code) {
      switch (error.code) {
        case 'auth/invalid-email':
          return {
            code: 'INVALID_EMAIL',
            message: 'Please enter a valid email address.',
            severity: 'medium',
          };
        
        case 'auth/user-not-found':
          return {
            code: 'USER_NOT_FOUND',
            message: 'No account found with this email. Please sign up first.',
            severity: 'medium',
          };
        
        case 'auth/wrong-password':
        case 'auth/invalid-verification-code':
          return {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid verification code. Please try again.',
            severity: 'medium',
          };
        
        case 'auth/too-many-requests':
          return {
            code: 'TOO_MANY_REQUESTS',
            message: 'Too many attempts. Please try again later.',
            severity: 'high',
          };
        
        case 'auth/network-request-failed':
          return {
            code: 'NETWORK_ERROR',
            message: 'Network error. Please check your connection and try again.',
            severity: 'high',
          };
        
        case 'auth/email-already-in-use':
          return {
            code: 'EMAIL_IN_USE',
            message: 'This email is already registered. Please sign in instead.',
            severity: 'medium',
          };
        
        case 'auth/weak-password':
          return {
            code: 'WEAK_PASSWORD',
            message: 'Password is too weak. Please choose a stronger password.',
            severity: 'medium',
          };
        
        case 'auth/operation-not-allowed':
          return {
            code: 'OPERATION_NOT_ALLOWED',
            message: 'This authentication method is not enabled.',
            severity: 'high',
          };
        
        default:
          return {
            code: 'UNKNOWN_AUTH_ERROR',
            message: 'An authentication error occurred. Please try again.',
            severity: 'medium',
          };
      }
    }

    // Handle network errors
    if (error.message?.toLowerCase().includes('network')) {
      return {
        code: 'NETWORK_ERROR',
        message: 'Network error. Please check your connection and try again.',
        severity: 'high',
      };
    }

    // Handle timeout errors
    if (error.message?.toLowerCase().includes('timeout')) {
      return {
        code: 'TIMEOUT_ERROR',
        message: 'Request timed out. Please try again.',
        severity: 'medium',
      };
    }

    // Default error
    return {
      code: 'UNKNOWN_ERROR',
      message: error.message || 'An unexpected error occurred. Please try again.',
      severity: 'medium',
    };
  }

  static handleValidationError(error: any): AppError {
    return {
      code: 'VALIDATION_ERROR',
      message: error.message || 'Please check your input and try again.',
      severity: 'low',
    };
  }

  static handleNetworkError(): AppError {
    return {
      code: 'NETWORK_ERROR',
      message: 'Please check your internet connection and try again.',
      severity: 'high',
    };
  }

  static isNetworkError(error: any): boolean {
    return (
      error.code === 'auth/network-request-failed' ||
      error.message?.toLowerCase().includes('network') ||
      error.message?.toLowerCase().includes('timeout')
    );
  }

  static shouldRetry(error: AppError): boolean {
    return error.severity === 'high' && 
           ['NETWORK_ERROR', 'TIMEOUT_ERROR'].includes(error.code);
  }
}