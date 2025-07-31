import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NativeBaseProvider } from 'native-base';
import { LoginScreen } from '../LoginScreen';
import { useAuthStore } from '../../../stores/authStore';

// Mock the auth store
jest.mock('../../../stores/authStore');
const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  reset: jest.fn(),
};

// NativeBase provider wrapper for tests
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <NativeBaseProvider
    initialWindowMetrics={{
      frame: { x: 0, y: 0, width: 0, height: 0 },
      insets: { top: 0, left: 0, right: 0, bottom: 0 },
    }}
  >
    {children}
  </NativeBaseProvider>
);

describe('LoginScreen', () => {
  const mockLogin = jest.fn();
  const defaultStoreState = {
    login: mockLogin,
    isLoading: false,
    error: null,
    // Add other required store properties
    user: null,
    isAuthenticated: false,
    register: jest.fn(),
    verifyOTP: jest.fn(),
    logout: jest.fn(),
    setError: jest.fn(),
    setLoading: jest.fn(),
    checkAuthState: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuthStore.mockReturnValue(defaultStoreState);
  });

  const renderLoginScreen = () => {
    return render(
      <TestWrapper>
        <LoginScreen navigation={mockNavigation} />
      </TestWrapper>
    );
  };

  it('should render login form correctly', () => {
    const { getByText, getByPlaceholderText } = renderLoginScreen();

    expect(getByText('Welcome Back')).toBeTruthy();
    expect(getByText('Enter your email to receive an OTP')).toBeTruthy();
    expect(getByPlaceholderText('Enter your email')).toBeTruthy();
    expect(getByText('Send OTP')).toBeTruthy();
    expect(getByText("Don't have an account?")).toBeTruthy();
    expect(getByText('Sign Up')).toBeTruthy();
  });

  it('should show error message when error exists', () => {
    mockUseAuthStore.mockReturnValue({
      ...defaultStoreState,
      error: 'Invalid email address',
    });

    const { getByText } = renderLoginScreen();
    expect(getByText('Invalid email address')).toBeTruthy();
  });

  it('should show loading state when submitting', () => {
    mockUseAuthStore.mockReturnValue({
      ...defaultStoreState,
      isLoading: true,
    });

    const { getByText } = renderLoginScreen();
    expect(getByText('Sending OTP...')).toBeTruthy();
  });

  it('should validate email format', async () => {
    const { getByPlaceholderText, getByText } = renderLoginScreen();
    
    const emailInput = getByPlaceholderText('Enter your email');
    const submitButton = getByText('Send OTP');

    fireEvent.changeText(emailInput, 'invalid-email');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(getByText('Invalid email address')).toBeTruthy();
    });

    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('should submit valid email', async () => {
    const { getByPlaceholderText, getByText } = renderLoginScreen();
    
    const emailInput = getByPlaceholderText('Enter your email');
    const submitButton = getByText('Send OTP');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com');
    });
  });

  it('should navigate to OTP verification on successful login', async () => {
    const { getByPlaceholderText, getByText } = renderLoginScreen();
    
    mockLogin.mockResolvedValue(undefined);

    const emailInput = getByPlaceholderText('Enter your email');
    const submitButton = getByText('Send OTP');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith('OTPVerification', {
        email: 'test@example.com',
        type: 'login',
      });
    });
  });

  it('should handle login errors gracefully', async () => {
    const { getByPlaceholderText, getByText } = renderLoginScreen();
    
    mockLogin.mockRejectedValue(new Error('Login failed'));

    const emailInput = getByPlaceholderText('Enter your email');
    const submitButton = getByText('Send OTP');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
    });

    // Error handling is done by the store, so we just verify login was called
    expect(mockNavigation.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to register screen when sign up is pressed', () => {
    const { getByText } = renderLoginScreen();
    
    const signUpButton = getByText('Sign Up');
    fireEvent.press(signUpButton);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Register');
  });

  it('should clear validation errors when input changes', async () => {
    const { getByPlaceholderText, getByText, queryByText } = renderLoginScreen();
    
    const emailInput = getByPlaceholderText('Enter your email');
    const submitButton = getByText('Send OTP');

    // First, trigger validation error
    fireEvent.changeText(emailInput, 'invalid-email');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(getByText('Invalid email address')).toBeTruthy();
    });

    // Then, enter valid email
    fireEvent.changeText(emailInput, 'test@example.com');

    await waitFor(() => {
      expect(queryByText('Invalid email address')).toBeNull();
    });
  });
});