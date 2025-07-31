import { UserRole } from '../types/roles';
import { permissionService } from './permissionService';

export interface ApiError {
  status: number;
  code: string;
  message: string;
  details?: any;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

class ApiErrorHandler {
  /**
   * Create a standardized API error response
   */
  createErrorResponse(
    status: number,
    code: string,
    message: string,
    details?: any
  ): ApiResponse {
    return {
      success: false,
      error: {
        status,
        code,
        message,
        details,
      },
    };
  }

  /**
   * Create a success response
   */
  createSuccessResponse<T>(data: T): ApiResponse<T> {
    return {
      success: true,
      data,
    };
  }

  /**
   * Handle authentication errors
   */
  handleAuthError(message?: string): ApiResponse {
    return this.createErrorResponse(
      401,
      'AUTH_REQUIRED',
      message || 'Authentication required',
    );
  }

  /**
   * Handle authorization/permission errors
   */
  handlePermissionError(
    userRole: UserRole | null,
    requiredRoles?: UserRole[],
    requiredPermission?: string
  ): ApiResponse {
    const message = permissionService.generateAccessDeniedMessage(
      userRole,
      requiredRoles,
      requiredPermission
    );

    return this.createErrorResponse(
      403,
      'ACCESS_DENIED',
      message,
      {
        userRole,
        requiredRoles,
        requiredPermission,
      }
    );
  }

  /**
   * Handle role validation errors
   */
  handleRoleValidationError(message: string, details?: any): ApiResponse {
    return this.createErrorResponse(
      400,
      'ROLE_VALIDATION_ERROR',
      message,
      details
    );
  }

  /**
   * Handle resource not found errors
   */
  handleNotFoundError(resource: string, id?: string): ApiResponse {
    return this.createErrorResponse(
      404,
      'RESOURCE_NOT_FOUND',
      `${resource} not found${id ? ` with ID: ${id}` : ''}`,
      { resource, id }
    );
  }

  /**
   * Handle validation errors
   */
  handleValidationError(message: string, validationErrors?: any): ApiResponse {
    return this.createErrorResponse(
      400,
      'VALIDATION_ERROR',
      message,
      validationErrors
    );
  }

  /**
   * Handle server errors
   */
  handleServerError(message?: string, error?: any): ApiResponse {
    console.error('Server error:', error);
    
    return this.createErrorResponse(
      500,
      'INTERNAL_SERVER_ERROR',
      message || 'Internal server error',
      process.env.NODE_ENV === 'development' ? error : undefined
    );
  }

  /**
   * Handle rate limiting errors
   */
  handleRateLimitError(): ApiResponse {
    return this.createErrorResponse(
      429,
      'RATE_LIMIT_EXCEEDED',
      'Too many requests. Please try again later.'
    );
  }

  /**
   * Handle role-specific business logic errors
   */
  handleRoleBusinessError(
    userRole: UserRole,
    operation: string,
    reason: string
  ): ApiResponse {
    return this.createErrorResponse(
      400,
      'ROLE_BUSINESS_ERROR',
      `${operation} not allowed for ${userRole}: ${reason}`,
      {
        userRole,
        operation,
        reason,
      }
    );
  }

  /**
   * Wrapper for async API operations with error handling
   */
  async handleAsyncOperation<T>(
    operation: () => Promise<T>,
    errorContext?: string
  ): Promise<ApiResponse<T>> {
    try {
      const result = await operation();
      return this.createSuccessResponse(result);
    } catch (error) {
      console.error(`Error in ${errorContext || 'API operation'}:`, error);
      
      if (error instanceof Error) {
        // Handle specific error types
        if (error.message.includes('permission')) {
          return this.handlePermissionError(null);
        }
        if (error.message.includes('not found')) {
          return this.handleNotFoundError('Resource');
        }
        if (error.message.includes('validation')) {
          return this.handleValidationError(error.message);
        }
      }
      
      return this.handleServerError(
        errorContext ? `Failed to ${errorContext}` : undefined,
        error
      );
    }
  }
}

export const apiErrorHandler = new ApiErrorHandler();