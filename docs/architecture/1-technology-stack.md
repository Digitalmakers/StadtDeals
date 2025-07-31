# 1. Technology Stack

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
