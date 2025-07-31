# Technical Architecture

The architecture of StadtDeals is designed with a balanced approach, prioritizing scalability, performance, security, and maintainability from the outset. We rely on a serverless approach using the Firebase ecosystem, complemented by React Native for the mobile app.

## 1. Technology Stack

| Layer | Technology | Version (Example) | Purpose | Rationale |
|-------|------------|-------------------|---------|-----------|
| **Mobile App** | React Native CLI | Latest LTS | iOS/Android from a single codebase, native performance | Rapid development, cross-platform, large community |
| **State Management** | Zustand | Latest | State management for React Native | Minimalist, fast, scalable for React applications |
| **UI Library** | NativeBase | Latest | Reusable UI components, customizability | Provides a component-based system, adaptable to shadcn/ui philosophy |
| **Form Handling** | react-hook-form + zod | Latest | Validation, forms for onboarding, products, vouchers | Robust validation, performant, type-safe |
| **Backend** | Firebase Functions + Firestore | Latest | Serverless API, business logic, data persistence | Scalable, managed service, real-time updates, cost-effective |
| **Authentication** | Firebase Auth | Latest | OTP login, role-based access | Secure, easy to integrate, Google standard |
| **Payment** | Stripe Connect (Standard) | Latest | Split payments, 3D Secure, Refunds | Industry standard for marketplaces, robust, secure |
| **Storage** | Firebase Storage EU | Latest | Images, verification documents | Scalable, integrated with Firebase, DSGVO-compliant EU hosting |
| **Push Notifications** | Firebase Cloud Messaging (FCM) | Latest | Event-based notifications | Reliable, free, integrated with Firebase |
| **Monitoring** | Sentry (optional) | Latest | Crash reports, error analysis | Early error detection, performance monitoring |
| **QA & Releases** | TestFlight, Play Console | Latest | App review & app store publishing | Official channels for app distribution and beta testing |
| **Business Data API** | Google Places API | Latest | Automatic business data pre-filling and reviews | Accelerates onboarding, enhances data quality |

## 2. Data Model & Management (Firestore)

The data model is designed for efficiency, scalability, and secure access control. Firestore serves as the primary NoSQL database.

### Collections:

- **`users`**: User profiles (Customer, Admin, Vendor).
- **`vendors`**: Detailed business profiles, including `stripeAccountId` and `subscriptionStatus`. Stores Google Place ID and Google Photo References.
- **`products`**: Product details (per vendor), including `images`, `categories`, `variants` (for physical products), and `options` (for configurable gastronomy products). The `stock` field for gastronomy products will be set to a high value; availability can be toggled manually.
- **`orders`**: Order details, `customerId`, `totalAmount`, `paymentIntentId`, extended status chain. Contains `vendorOrders` as an array of objects for multi-vendor splits.
- **`promocodes`**: Voucher information, including `vendorId` (optional), `code`, `discountType`, `discountValue`, `minimumOrderValue`, `maxUses`.
- **`chats`**: Single chat document per customer-vendor pair (`customerId_vendorId`). Includes `initialChatOpenedByCustomer` and `vendorCanInitiateProactively` flags to control vendor communication. Messages as a `messages` subcollection.
- **`refund_requests`**: Refund requests with status tracking and escalation logic.
- **`categories`**: Predefined product categories.

### Principles:

- **Denormalization**: Targeted duplication of data to optimize read access.
- **Firestore Security Rules**: Strict, role-based rules enforce access rights at the database level, especially for chat access and sensitive data.
- **Indexing**: Planned indexes to optimize queries and sorting.

## 3. API Design & Business Logic (Firebase Functions)

Firebase Functions host the server-side logic and app interfaces.

- **API Style**: Primarily RESTful principles for resource naming and HTTP methods.
- **API Versioning**: Implementation of URL-based versioning (e.g., `/api/v1/`) to ensure backward compatibility for future API changes.
- **Error Responses**: Consistent and informative JSON error responses (`status`, `code`, `message`, `details`) with appropriate HTTP status codes (e.g., 400, 401, 403, 404, 500).

### Authentication & Authorization:

- App sends Firebase Auth ID Tokens in the `Authorization` header.
- Each protected Function verifies the token and checks the user's role and permissions (from the `users` collection) before executing actions.

### Server-side Validation:

Mandatory and comprehensive validation of all incoming data in every Function to ensure data integrity and security.

### Performance Optimization:

- Use of `minInstances` for critical Functions to reduce cold starts.
- Efficient code, optimized database queries (batch operations), appropriate region selection (EU hosting).
- Concurrency configuration for Functions.

### Location-based Search:

Implementation of proximity search logic in Firebase Functions to efficiently find businesses and offers near the user's location.

### Chat Logic:

Firebase Functions control the strict chat rules (customer initiates, vendor replies or proactively initiates if an order exists) and automated system messages.

### Google Places API Integration:

- New Firebase Functions endpoints to communicate with the Google Places API (e.g., for Place Search during onboarding, retrieving reviews).
- **Hybrid Caching Strategy**: Core Business Data (name, address, phone, website, location coordinates, Google Place ID) is stored in Firestore and updated regularly. Google Places photos are stored only as references/URLs and retrieved directly from Google endpoints with mandatory attribution upon request; the primary vendor image is a mandatory vendor upload and hosted in Firebase Storage.
- Google reviews are **not cached** and must be retrieved fresh from Google for every display, with mandatory attribution.

## 4. Deep Linking & QR Code Integration

- **URL Scheme**: Consistent deep link URLs (e.g., `https://app.stadtdeals.de/vendor/{vendorId}` or `/product/{productId}`), containing vendor and optional product/promo IDs.
- **App Integration**: Use of Universal Links (iOS) and App Links (Android) to open URLs directly in the app or redirect to the App Store if the app is not installed.
- **QR Code Generation**: The function to generate QR codes from these deep links will be implemented exclusively within the Admin Panel to ensure centralized control and consistency.

## 5. Development Environment & Testing

### iOS Development (Primary):

- **Physical Device**: Development and direct testing of the React Native app on a connected iPhone (via cable).
- **iOS Simulator**: Use of the iOS Simulator (part of Xcode) for rapid iterations.

### Android Development (Secondary/Later):

- **Android Emulator**: Use of the Android Emulator (part of Android Studio) for testing.

### Development Features:

- **Automatic Live Refresh (Fast Refresh)**: Code changes are displayed automatically and almost instantly on the connected physical device or simulator.
- **Debug Tools**: Use of React Native debugging tools (e.g., Chrome DevTools for JavaScript debugging, React Native Debugger).

### Testing Strategy:

- **Unit Tests**: Comprehensive unit tests for business logic (Firebase Functions) and React Native components.
- **Integration Tests**: Tests for interactions between components and services.
- **End-to-End Tests (E2E)**: Automated E2E tests for critical user workflows.
- **Device Tests**: Regular testing on physical devices and simulators/emulators to identify platform-specific issues.
- **CI/CD Integration**: Integration of automated tests into a Continuous Integration/Continuous Deployment (CI/CD) pipeline.