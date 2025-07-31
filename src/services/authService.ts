import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, SessionData, RegisterFormData } from '../types/auth';
import { DEFAULT_ROLE } from '../types/roles';
import { ErrorHandler } from '../utils/errorHandler';

export class AuthService {
  private static instance: AuthService;
  private confirmation: FirebaseAuthTypes.ConfirmationResult | null = null;
  private usersCollection = firestore().collection('users');

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Send OTP to email for registration or login
   */
  async sendOTPToEmail(email: string): Promise<void> {
    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Invalid email format');
      }

      // For email OTP, we use phone auth with a custom provider
      // This is a placeholder - actual implementation would use Firebase Functions
      // to send OTP via email and return confirmation result
      
      // Note: navigator.onLine not available in React Native
      // Network connectivity handled by NetworkUtils in store layer
      
      console.log(`Sending OTP to ${email}`);
      
      // TODO: Implement Firebase Function call to send OTP via email
      // const response = await fetch('/api/v1/sendOTPEmail', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email })
      // });
      
      throw new Error('Email OTP not implemented yet - requires Firebase Functions setup');
    } catch (error) {
      console.error('Error sending OTP:', error);
      const appError = ErrorHandler.handleAuthError(error);
      throw new Error(appError.message);
    }
  }

  /**
   * Verify OTP and complete authentication
   */
  async verifyOTP(otp: string): Promise<FirebaseAuthTypes.UserCredential> {
    try {
      if (!this.confirmation) {
        throw new Error('No OTP confirmation available. Please request OTP first.');
      }

      const userCredential = await this.confirmation.confirm(otp);
      
      // Store user session
      await this.storeUserSession(userCredential.user);
      
      return userCredential;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw error;
    }
  }

  /**
   * Register user with email and OTP
   */
  async registerWithEmailOTP(email: string, userData: RegisterFormData): Promise<void> {
    try {
      await this.sendOTPToEmail(email);
      // Store registration data for after OTP verification
      await AsyncStorage.setItem('pendingRegistration', JSON.stringify(userData));
    } catch (error) {
      console.error('Error in registration:', error);
      throw error;
    }
  }

  /**
   * Create user profile in Firestore after successful authentication
   */
  async createUserProfile(user: FirebaseAuthTypes.User, userData?: RegisterFormData): Promise<User> {
    try {
      let registrationData = userData;
      
      // Get pending registration data if not provided
      if (!registrationData) {
        const pendingData = await AsyncStorage.getItem('pendingRegistration');
        if (pendingData) {
          registrationData = JSON.parse(pendingData) as RegisterFormData;
          await AsyncStorage.removeItem('pendingRegistration');
        }
      }

      const userProfile: User = {
        uid: user.uid,
        email: user.email || registrationData?.email || '',
        role: DEFAULT_ROLE, // Assign default customer role
        profile: {
          firstName: registrationData?.firstName || '',
          lastName: registrationData?.lastName || '',
          phone: registrationData?.phone,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Save to Firestore
      await this.usersCollection.doc(user.uid).set({
        ...userProfile,
        createdAt: firestore.Timestamp.now(),
        updatedAt: firestore.Timestamp.now(),
      });

      return userProfile;
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw new Error('Failed to create user profile');
    }
  }

  /**
   * Get user profile from Firestore
   */
  async getUserProfile(uid: string): Promise<User | null> {
    try {
      const userDoc = await this.usersCollection.doc(uid).get();
      if (userDoc.exists) {
        const data = userDoc.data();
        return {
          ...data,
          createdAt: data?.createdAt?.toDate(),
          updatedAt: data?.updatedAt?.toDate(),
        } as User;
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw new Error('Failed to get user profile');
    }
  }

  /**
   * Login user with email and OTP
   */
  async loginWithEmailOTP(email: string): Promise<void> {
    try {
      await this.sendOTPToEmail(email);
    } catch (error) {
      console.error('Error in login:', error);
      throw error;
    }
  }

  /**
   * Store user session in AsyncStorage with role data
   */
  private async storeUserSession(user: FirebaseAuthTypes.User): Promise<void> {
    try {
      // Get user profile to include role in session
      const userProfile = await this.getUserProfile(user.uid);
      
      const sessionData = {
        uid: user.uid,
        email: user.email,
        role: userProfile?.role || DEFAULT_ROLE,
        lastLogin: Date.now(),
      };
      await AsyncStorage.setItem('userSession', JSON.stringify(sessionData));
    } catch (error) {
      console.error('Error storing user session:', error);
      throw error;
    }
  }

  /**
   * Get stored user session
   */
  async getStoredSession(): Promise<SessionData | null> {
    try {
      const sessionData = await AsyncStorage.getItem('userSession');
      return sessionData ? JSON.parse(sessionData) as SessionData : null;
    } catch (error) {
      console.error('Error getting stored session:', error);
      return null;
    }
  }

  /**
   * Logout user and clear session
   */
  async logout(): Promise<void> {
    try {
      await auth().signOut();
      await AsyncStorage.removeItem('userSession');
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  }

  /**
   * Get current user
   */
  getCurrentUser(): FirebaseAuthTypes.User | null {
    return auth().currentUser;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!auth().currentUser;
  }
}