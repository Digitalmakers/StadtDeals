import { FirebaseAuthTypes } from '@react-native-firebase/auth';

export interface User {
  uid: string;
  email: string;
  role: 'customer' | 'vendor' | 'admin';
  profile: {
    firstName: string;
    lastName: string;
    phone?: string;
    location?: {
      latitude: number;
      longitude: number;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionData {
  uid: string;
  email: string | null;
  role: string;
  lastLogin: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginFormData {
  email: string;
}

export interface RegisterFormData {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface OTPFormData {
  otp: string;
}

export interface AuthActions {
  login: (email: string) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  verifyOTP: (otp: string) => Promise<void>;
  logout: () => Promise<void>;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  checkAuthState: () => Promise<void>;
}

export type AuthStore = AuthState & AuthActions;