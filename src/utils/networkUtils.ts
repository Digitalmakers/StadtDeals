import { Alert } from 'react-native';

export class NetworkUtils {
  static async checkConnectivity(): Promise<boolean> {
    try {
      // Simple connectivity check using fetch to a reliable endpoint
      const response = await fetch('https://www.google.com', {
        method: 'HEAD',
        timeout: 5000,
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  static showNetworkError(): void {
    Alert.alert(
      'Network Error',
      'Please check your internet connection and try again.',
      [{ text: 'OK' }]
    );
  }

  static async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry validation errors
        if (error.message?.includes('Invalid') || error.message?.includes('format')) {
          throw error;
        }

        // Check if we should retry
        const isNetworkError = error.message?.toLowerCase().includes('network') ||
                              error.message?.toLowerCase().includes('timeout');
        
        if (!isNetworkError || attempt === maxRetries) {
          throw error;
        }

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }

    throw lastError!;
  }
}