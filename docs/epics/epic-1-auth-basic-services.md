# Epic 1: Authentication & Basic Services

## Epic Summary
**Goal**: Implement secure user authentication system with role-based access control and foundational customer profile functionality  
**Duration**: 3 weeks (18 PDs)  
**Epic Owner**: Backend Developer  
**Business Value**: Enables user-specific features and secure access to all subsequent functionalities

---

## Stories

### Story 1.1: Firebase Authentication Setup & Email/OTP Login
**Story ID**: STADT-008  
**Story Points**: 5  
**Assignee**: Backend Developer  

**User Story**:  
As a **Customer/Vendor**  
I want **to securely log in using my email and OTP verification**  
So that **I can access personalized features and my account is protected**

**Acceptance Criteria**:
- [ ] Users can register with email address
- [ ] OTP sent via email for verification during registration
- [ ] Users can log in with email and OTP
- [ ] Login session persists across app restarts
- [ ] Logout functionality clears session completely
- [ ] Error handling for invalid credentials and network issues

**Technical Implementation**:
```typescript
// Firebase Auth configuration
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

// OTP verification flow
const sendOTPEmail = async (email: string) => {
  // Firebase Functions endpoint for OTP generation
  await callFirebaseFunction('sendOTPEmail', { email });
};

const verifyOTP = async (email: string, otp: string) => {
  // Server-side OTP validation
  return await callFirebaseFunction('verifyOTP', { email, otp });
};
```

**Definition of Done**:
- ✅ Registration flow works with email + OTP
- ✅ Login flow authenticates and maintains session
- ✅ Error states handled gracefully
- ✅ Unit tests cover authentication logic
- ✅ Security rules prevent unauthorized access

---

### Story 1.2: User Role Management & Authorization
**Story ID**: STADT-009  
**Story Points**: 8  
**Assignee**: Backend Developer  

**User Story**:  
As an **Admin**  
I want **role-based access control for different user types**  
So that **Customers, Vendors, and Admins have appropriate permissions**

**Acceptance Criteria**:
- [ ] User roles defined: Customer, Vendor, Admin
- [ ] Role assignment during registration (Customer default)
- [ ] Role-based navigation and feature access
- [ ] Admin can view and modify user roles
- [ ] Firestore Security Rules enforce role permissions
- [ ] API endpoints validate user roles before actions

**Technical Implementation**:
```typescript
// User collection schema
interface User {
  uid: string;
  email: string;
  role: 'customer' | 'vendor' | 'admin';
  profile: {
    firstName: string;
    lastName: string;
    phone?: string;
    location?: GeoPoint;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Role-based middleware
const checkRole = (requiredRole: UserRole) => {
  return async (uid: string) => {
    const user = await getUserByUid(uid);
    return user.role === requiredRole || user.role === 'admin';
  };
};
```

**Definition of Done**:
- ✅ Users created with appropriate roles
- ✅ Navigation adapts based on user role
- ✅ Admin panel shows user management
- ✅ Security rules tested for all roles
- ✅ Role changes reflected immediately in app

---

### Story 1.3: Customer Profile Management
**Story ID**: STADT-010  
**Story Points**: 8  
**Assignee**: Frontend Developer  

**User Story**:  
As a **Customer**  
I want **to create and manage my profile information**  
So that **I can personalize my experience and manage my account**

**Acceptance Criteria**:
- [ ] Customer can create profile with name, phone, location
- [ ] Profile information can be edited and saved
- [ ] Location services integration for address selection
- [ ] Profile picture upload functionality
- [ ] Input validation for all profile fields
- [ ] Profile data syncs with Firestore

**Technical Implementation**:
```typescript
// Profile form with react-hook-form + zod
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name required'),
  lastName: z.string().min(2, 'Last name required'),
  phone: z.string().regex(/^\+[1-9]\d{10,14}$/, 'Valid phone number required'),
  location: z.object({
    address: z.string(),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number(),
    }),
  }),
});

// NativeBase components for UI
const ProfileScreen = () => {
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(profileSchema),
  });
  // Implementation
};
```

**Definition of Done**:
- ✅ Profile creation screen functional
- ✅ Profile editing saves changes to Firestore
- ✅ Location selection works on both platforms
- ✅ Image upload stores in Firebase Storage
- ✅ Form validation prevents invalid submissions
- ✅ Loading states during save operations

---

### Story 1.4: Basic UI Framework & Navigation Structure
**Story ID**: STADT-011  
**Story Points**: 13  
**Assignee**: Frontend Developer  

**User Story**:  
As a **User**  
I want **consistent, intuitive navigation and UI components**  
So that **I can easily use the app and navigate between features**

**Acceptance Criteria**:
- [ ] Bottom tab navigation with 5 main tabs (Home, Search, Orders, Chat, Profile)
- [ ] Stack navigation within each tab
- [ ] Custom theme applied with brand colors
- [ ] Reusable components for buttons, inputs, cards
- [ ] Loading states and error handling components
- [ ] Navigation adapts based on user authentication state

**Technical Implementation**:
```typescript
// Navigation structure
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Custom theme configuration
const theme = {
  colors: {
    primary: '#007AFF',      // Brand blue
    secondary: '#FF6B35',    // Brand orange
    background: '#F8F9FA',   // Light gray
    surface: '#FFFFFF',      // White
    text: '#1F2937',         // Dark gray
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: 8,
        fontWeight: 'semibold',
      },
    },
  },
};

// Main navigation component
const AppNavigator = () => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) {
    return <AuthNavigator />;
  }
  
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Search" component={SearchStack} />
      <Tab.Screen name="Orders" component={OrdersStack} />
      <Tab.Screen name="Chat" component={ChatStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
};
```

**Definition of Done**:
- ✅ Tab navigation works on both platforms
- ✅ Custom theme applied throughout app
- ✅ Reusable component library created
- ✅ Navigation state persists correctly
- ✅ Authentication guard prevents unauthorized access
- ✅ Screen transitions smooth and consistent

---

### Story 1.5: Magic Link Implementation for Vendor Web-to-App Login
**Story ID**: STADT-012  
**Story Points**: 13  
**Assignee**: Full-Stack Developer  

**User Story**:  
As a **Vendor**  
I want **to seamlessly transition from web registration to mobile app**  
So that **I can manage my business without re-authentication**

**Acceptance Criteria**:
- [ ] Magic link generated during web vendor registration
- [ ] Link opens mobile app with auto-authentication
- [ ] Deep linking configured for iOS and Android
- [ ] Link expires after 24 hours for security
- [ ] Fallback to manual login if link fails
- [ ] Vendor role automatically assigned upon magic link login

**Technical Implementation**:
```typescript
// Deep linking configuration
import { Linking } from 'react-native';

// Firebase Function for magic link generation
export const generateMagicLink = functions.https.onCall(async (data, context) => {
  const { email, vendorId } = data;
  
  // Generate secure token
  const token = await admin.auth().createCustomToken(vendorId, {
    role: 'vendor',
    magicLink: true,
  });
  
  const magicLink = `stadtdeals://auth/magic?token=${token}&email=${email}`;
  
  // Send email with magic link
  await sendMagicLinkEmail(email, magicLink);
  
  return { success: true };
});

// App handling of deep links
const handleDeepLink = async (url: string) => {
  const { token } = parseURL(url);
  
  if (token) {
    try {
      await signInWithCustomToken(auth, token);
      // Navigate to vendor dashboard
    } catch (error) {
      // Handle error and show manual login
    }
  }
};
```

**Definition of Done**:
- ✅ Magic link generation works in web interface
- ✅ Deep links open app correctly on both platforms
- ✅ Auto-authentication successful with valid tokens
- ✅ Expired/invalid tokens show appropriate error
- ✅ Vendor dashboard accessible after magic link login
- ✅ Security audit confirms token handling is secure

---

### Story 1.6: Push Notification Foundation Setup
**Story ID**: STADT-013  
**Story Points**: 5  
**Assignee**: Backend Developer  

**User Story**:  
As a **User**  
I want **to receive relevant notifications about my account and orders**  
So that **I stay informed about important updates**

**Acceptance Criteria**:
- [ ] Firebase Cloud Messaging configured
- [ ] Push notification permissions requested appropriately
- [ ] Device tokens stored and managed
- [ ] Basic notification sending capability
- [ ] Notification handling when app is foreground/background
- [ ] Token refresh handling

**Technical Implementation**:
```typescript
// FCM setup
import messaging from '@react-native-firebase/messaging';

const setupNotifications = async () => {
  // Request permission
  const authStatus = await messaging().requestPermission();
  
  if (authStatus === messaging.AuthorizationStatus.AUTHORIZED) {
    // Get and store FCM token
    const token = await messaging().getToken();
    await storeFCMToken(token);
    
    // Handle token refresh
    messaging().onTokenRefresh(async (newToken) => {
      await updateFCMToken(newToken);
    });
  }
};

// Firebase Function for sending notifications
export const sendNotification = functions.https.onCall(async (data, context) => {
  const { tokens, title, body, data: notificationData } = data;
  
  const message = {
    notification: { title, body },
    data: notificationData,
    tokens,
  };
  
  return await admin.messaging().sendMulticast(message);
});
```

**Definition of Done**:
- ✅ Notification permissions handled gracefully
- ✅ FCM tokens stored and updated automatically
- ✅ Test notifications can be sent and received
- ✅ Notification handling works in all app states
- ✅ Token management prevents duplicates
- ✅ Error handling for permission denied scenarios

---

## Epic Acceptance Criteria

### Technical Deliverables:
- [ ] Complete authentication system with email/OTP login
- [ ] Role-based access control for all user types
- [ ] Customer profile management fully functional
- [ ] Consistent UI framework and navigation structure
- [ ] Magic link authentication for vendor onboarding
- [ ] Push notification infrastructure ready

### Quality Gates:
- [ ] Authentication security audit passed
- [ ] All API endpoints protected with proper authorization
- [ ] UI components meet accessibility standards
- [ ] Performance benchmarks met (login <2s, navigation <500ms)
- [ ] Cross-platform compatibility verified
- [ ] Unit test coverage >85% for authentication flows

### Business Validation:
- [ ] Users can complete full registration and login flow
- [ ] Role-based features accessible only to appropriate users
- [ ] Vendor magic link flow works end-to-end
- [ ] Customer profiles support all required data
- [ ] Navigation UX approved by design team
- [ ] Ready for Epic 2 vendor onboarding features

---

## Dependencies

### From Epic 0 (Required):
- [Source: epic-0-project-initialization.md] Firebase project and SDK integration
- [Source: epic-0-project-initialization.md] React Native project with TypeScript
- [Source: epic-0-project-initialization.md] Zustand state management configured
- [Source: epic-0-project-initialization.md] NativeBase UI library integrated
- [Source: epic-0-project-initialization.md] Form handling (react-hook-form + zod) setup

### For Epic 2 (Provides):
- User authentication system for vendor registration
- Role-based access control for admin approval workflow
- Magic link functionality for seamless web-to-app transition
- Basic UI framework for vendor onboarding screens

### For Epic 3 (Provides):
- Customer profiles for personalized product browsing
- Location services for location-based product filtering
- Push notification foundation for product updates

---

## Risk Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Magic link deep linking fails | Medium | High | Fallback to manual login, thorough testing |
| OTP email delivery issues | Low | High | Multiple email providers, SMS backup |
| Role permission complexity | Medium | Medium | Clear documentation, comprehensive testing |
| Push notification setup | Low | Medium | Firebase documentation, community support |

---

## Success Metrics

- **Authentication Success Rate**: >98% successful logins
- **Registration Completion**: >85% users complete profile
- **Magic Link Success**: >90% vendors successfully transition
- **App Navigation**: <500ms between screen transitions
- **Role Security**: 0 unauthorized access incidents
- **Push Notification Delivery**: >95% delivery rate

This Epic 1 establishes the secure foundation needed for all user-specific features in subsequent epics.