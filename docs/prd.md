# Product Requirements Document (PRD)

## 1. Introduction & Project Overview

This document serves as the finalized and binding statement of work, as well as the implementation guideline for the StadtDeals project. It summarizes all jointly developed and optimized specifications, architectural decisions, UI/UX concepts, sprint planning, and identified risks and their countermeasures.

### 1.1 Management Summary

**Project Name:** StadtDeals (formerly Frankzone)

**Project Goal:** Development of a mobile multi-vendor platform for local businesses, including online payment, vouchers & vendor onboarding. Customers order via the app, while businesses manage their products and orders independently.

**Target Audience:** End-customers (mobile), local businesses (Vendors), platform operators (Admin).

### Core Features (MVP):

- Vendor registration with verification & Stripe integration (web-based for subscription payment, app only shows status).
- Product management (incl. variants & configurable options for gastronomy products), vouchers (incl. minimum order value), stock status.
- Checkout with multi-vendor shopping cart, promocode validation & split payment via Stripe Connect (incl. 3D Secure & Refund API).
- Order status tracking (detailed status chain) & refund functionality with escalation.
- 1:1 Unified Chat per customer-vendor pair (customer can initiate; vendor can only reply or proactively initiate if an order exists).
- Role-based user management (Admin/Vendor/Customer).
- Push & email notifications.
- Location-based product search and business display as default filter.
- QR code generation for deep links (exclusively within the Admin Panel).
- Display of Google Reviews on vendor profiles.

### Technology:

- **Mobile App:** React Native CLI + Zustand.
- **UI Library:** NativeBase (following shadcn/ui philosophy).
- **Form Handling:** react-hook-form + zod.
- **Backend:** Firebase Functions + Firestore.
- **Auth:** Firebase Auth (Email + OTP).
- **Payment:** Stripe Connect (Standard).
- **Storage:** Firebase Storage EU.
- **Push:** Firebase Cloud Messaging (FCM).
- **Monitoring (optional):** Sentry.
- **QA & Releases:** TestFlight, Play Console.
- **Business Data API:** Google Places API (for automatic data pre-filling and reviews).

### Timeline & Costs (Adjusted):

- **Development Time:** 26 weeks.
- **4 weeks buffer** (App Store Review & QA, Hypercare).
- **Total Duration incl. Buffer:** 30 weeks.
- **Total Effort:** 165 Person-Days.
- **Total Budget:** €66,000.

### Release Platforms:

- **iOS** (App Store via TestFlight) - iOS-first.
- **Android** (optional, after MVP).

### Special Notes:

- MVP is scalable for >8000 users.
- Modularly expandable (e.g., rating system, analytics, additional payment methods).

### 1.2 Vision & Core Principles

StadtDeals' vision is to connect local businesses with end-customers via an intuitive mobile platform, strengthening local commerce in the digital age. Our project follows a balanced approach, combining speed of MVP delivery with a strong commitment to quality, robustness, and long-term expandability. This minimizes technical debt and ensures the future viability of the platform.

## 2. MVP Scope & Features

The MVP of StadtDeals encompasses all essential functionalities required to deliver a functional, bilingual multi-vendor platform. Modules are categorized thematically and follow a balanced approach that prioritizes quality, security, and user-friendliness.

### 2.1 Onboarding & Management

#### Vendor Onboarding:

- Vendor registration occurs **exclusively via a web interface**, to comply with app store guidelines regarding provisions for digital subscriptions.
- Includes document upload for verification, admin approval, Stripe Connect integration, and subscription status display (subscription handling strictly via web).
- **Automatic Business Data Pre-filling:** During web onboarding, vendors can search for their business. If a match is found via the Google Places API, business data such as name, address, phone number, location (latitude and longitude), and photos will be suggested automatically and pre-filled for review/confirmation. For the vendor's primary profile image, a mandatory upload by the vendor is required; Google Places photos can be integrated as secondary/supplementary images.
- **Seamless App Login for Vendors:** After successful web registration, the vendor's initial app login occurs seamlessly via a one-time, time-limited "Magic Link" sent via email. Alternatively, a passwordless login (OTP via email) is always available in the app.

#### Admin Panel:

- Central management for the platform operator.
- Functions: Review & approval of vendors, voucher overview, escalation for refunds, vendor activation/deactivation.
- **QR Code & Deep Link Management:** Exclusively Admins can generate and download QR codes and associated deep links (with vendor ID, optional product or promo ID) for marketing purposes.

### 2.2 Customer Profile & Order History

#### Customer Profile:

- Management of profile data (name, email, address).
- Overview of past orders.
- Consent to Terms & Conditions and Privacy Policy during registration.
- **T&C/Privacy Policy at Checkout:** A passive disclaimer with links to external URLs for T&C and Privacy Policy will be placed before final checkout, without requiring renewed active consent.

### 2.3 Product & Order

#### Product Creation & Management (Vendor App):

- Product creation including variants, image upload, stock management.
- **Camera Usage with Overlay:** The app provides a camera function with a transparent overlay that dictates dimensions and aspect ratio. Includes visual quality indicators for poor lighting or blur directly during capture.
- **Configurable Products (Gastronomy):** Support for products with flexible options (e.g., "Extras", "Sides") with selection mechanisms (radio buttons for single selection, checkboxes for multi-selection) and dynamic price updates. For gastronomy products, the stock field will be set to a high value; vendors can set these products to "temporarily unavailable".

#### Voucher Management (Vendor App):

- Creation of promocodes with conditions such as **minimum order value**, validity, and single-use. Includes analytics on redemptions.

#### Product Catalog & Search (Customer App):

- Product search and filters (by text, category, price).
- **Location-based Display (Default):** Search results and displayed businesses are based on the user's current geographical proximity by default. Manual location change is possible.
- Assignment of products to existing categories or suggestion to admin.
- Attractive product display with clear cards, images, prices, and discount badges.
- **Display of Google Reviews:** Average Google star ratings for vendors will be displayed on vendor profiles. A detailed view will list Google user reviews, fetched directly from the Google Places API (no caching allowed, with attribution).

#### Shopping Cart:

- Multi-vendor shopping cart, promocode entry & price calculation.
- **Quantity Stepper:** Direct adjustment of quantity for fixed items on the product card.

#### Checkout & Payment:

- Secure payment via Stripe (split payment via Stripe Connect, 3D Secure, Refund API).
- **Dynamic Free Delivery Hint:** Display of progress towards achieving free delivery in the checkout.

#### Order Status & Refund:

- Customers track status in their profile: "Ordered", "Accepted", "In Preparation", "Shipped/Ready for Pickup", "Completed". Vendor can manually set status.
- Customer can request a refund; vendor receives a push notification.
- **Escalation Workflow:** If the vendor does not respond within 72 hours to a refund request, the admin is notified and can intervene.

### 2.4 Communication & Notifications

#### In-App Chat (Unified & Rule-based):

- Direct 1:1 chat per customer-vendor pair. All messages appear in a single, continuous thread.
- **Customer Initiation:** Customer can initiate chat at any time (even without an order).
- **Vendor Communication:** Vendor can only reply if the customer has initiated the chat, OR proactively initiate if an order exists between them.
- **System Messages:** Automated messages for order status changes within the chat thread (e.g., "Order accepted").

#### Notifications:

- Push notifications (via FCM) for new orders, chat messages, or refund requests.
- Customer receives an order summary via email after checkout (incl. products, total, vendor shares).

### 2.5 Infrastructure & Services

**Basic Services:** Firebase Auth (Email + OTP), role-based access (Customer, Vendor, Admin), DSGVO-compliant hosting (EU), bilingual UI (German & English), Firebase Push (FCM), customer account with profile data, passwordless login, order history view.

**System Services:** Vendor can be manually deactivated by Admin (e.g., for subscription default, inactivity, violation). System logic manages status updates, order history, refund workflow with vendor approval and escalation.

## 3. Non-functional Requirements (Quality Goals)

The following non-functional requirements define the quality attributes of StadtDeals. They are crucial for user satisfaction, system stability, and the long-term success of the platform. Our balanced approach ensures that these goals are considered from the outset in design and implementation.

### 3.1 Performance

- **Target Value:** 95% of API calls < 500 ms.
- **Measures:** Optimized Firestore data model and queries (denormalization, indexing, pagination), Firebase Functions optimization (Min-Instances, efficient code), frontend performance (optimized rendering, virtualization, image optimization), continuous monitoring (Sentry), and load tests.

### 3.2 Availability

- **Target Value:** ≥ 99% uptime.
- **Measures:** Use of managed services (Firebase), robust error handling (retries, fallbacks), monitoring, and notification for service outages (Firebase/Stripe status pages).

### 3.3 Security

- **Principles:** HTTPS, role-based, RLS (Row Level Security for Firestore), Stripe SCA (Strong Customer Authentication).
- **Measures:** Strict Firebase Security Rules (Least Privilege), robust server-side validation and authorization in Firebase Functions, secure Stripe Connect integration (webhook signatures, idempotency keys), data protection (DSGVO-compliant, data minimization), regular security reviews, and dependency audits.

### 3.4 Data Protection

- **Principles:** EU hosting, data deletion and export functionality, Art. 6/13 DSGVO.
- **Measures:** Implementation of data deletion and export functions, clear consent to T&Cs and Privacy Policy, transparent data collection, secure processing of user data. T&Cs and Privacy Policy will be embedded via external URLs to allow for quick updates without app updates.

### 3.5 Scalability

- **Target Value:** 10,000+ users without re-architecture.
- **Measures:** Serverless architecture (Firebase Functions, Firestore), efficient data modeling, performance optimization, modular components for future expandability.

### 3.6 Accessibility

- **Target Value:** WCAG-AA compliant (App UI).
- **Measures:** Consideration of accessibility standards in UI design (color contrasts, font sizes, keyboard navigation), use of accessible UI components (NativeBase).

### 3.7 Bilingualism

- **Target Value:** Fully bilingual UI from the outset.
- **Languages:** German and English.
- **Measures:** Integration of a localization framework (e.g., react-native-localize with i18n-js), management of all text strings in both languages, dynamic adjustment of date and currency formats, user selection of language in settings.

## 4. UI Design & Visual Concept

The UI design of StadtDeals is based on a modern, clean, and functional style, inspired by references such as Bolt Food. It emphasizes intuitive user guidance and an appealing, consistent appearance.

### 4.1 Visual Identity & Design Language

**Overall Style:** Modern, clean, minimalist, and functional. Focus on content and ease of use.

#### Color Palette:

- **Primary Color (Accent/Interactive):** A warm, accessible Orange (for primary CTAs, links, active states).
- **Neutral Colors:** Pure white (#FFFFFF) or very light off-white for backgrounds. Dark anthracite/near-black for primary text, medium gray for secondary text. Very light gray for separators/borders.
- **Status Colors:** Muted green (success), darkened yellow (warning), clear red (error).

**Typography:** A modern, highly legible sans-serif typeface for the entire app. A clear font size and weight system for hierarchy.

**Iconography:** Simple, linear icons.

### 4.2 Layout & Navigation

- **Clear Screens:** Plenty of white space, clear hierarchy through spacing and typography.
- **Card-based Design:** Use of cards for products, vendors, and order summaries for visual separation.

#### Main Navigation (Customer App - 5 Tabs at the Bottom):

1. **Home/Discover:** Home screen with personalized content, offers, categories, and the search bar in the header.
2. **Vendors/Stores:** Dedicated tab for Browse, filtering, and finding vendors.
3. **Search:** Dedicated, comprehensive search tab for both products and vendors.
4. **Orders:** Overview of current and past orders.
5. **Profile/My Account:** Access to personal settings and management.

**Top Navigation (Header):** Clear title, action icons (search icon, notifications, shopping cart badge), back arrow.

**Secondary Navigation:** Filter and sort options as a top bar or pop-up modal. Modals/bottom sheets for actions and detailed selections.

**Transitions:** Smooth, native transitions and subtle animations.

### 4.3 Important UI Components

#### Buttons:

- **Primary CTAs:** Solid fill, warm orange background, white text, slightly rounded corners.
- **Secondary Buttons:** Transparent background, orange border and text.
- **Text Buttons:** Text only, in the orange primary color.

**Input Fields:** Clean, minimalist, light background, subtle gray border. Border highlighted in orange when focused. Clear labels. OTP entry in separate boxes.

#### Product Cards & List Views:

- **Product Cards:** Clean, card-based, high-quality product images, clear info (name, price, vendor name). Discount badges in Orange.
- **Quantity Stepper:** Dynamic quantity + stepper directly on the product card (for fixed items) or within the configuration modal (for gastronomy).
- **List Views:** Clear rows, subtle separators, icons/status indicators.

**Dynamic "View Cart" Bar:** Large, primary button at the bottom of the screen, in Orange, appearing when items are in the cart, displaying the total sum.

**Dynamic Free Delivery Hint:** Message in the checkout showing progress towards free delivery.

**Camera Overlay (Vendor App):** Transparent overlay with size/aspect ratio guidelines and visual quality indicators (brightness, blur) for product photos.

**Configuration Modal (Gastronomy):** Bottom sheet with clear option groups (headings), selection mechanisms (radio buttons for single selection, checkboxes for multiple selection), and dynamic price updates.

**Form Validation:** Real-time feedback directly on the field, clear error messages.

**In-App Browser:** Use of in-app browsers for external links (e.g., T&Cs).

### 4.4 Onboarding Design Principles

**Style:** Clean, minimalist, functional.

**Progress:** Linear flow for customers; explicit step indicator for web-based vendor onboarding.

**Visual Guidance:** Use of icons and colors to guide through the process (e.g., for OTP entry).

## 5. Sprint Planning & Effort

The following sprint plan has been comprehensively optimized to ensure a balanced approach. This includes more detailed feature implementation, elevated quality standards, and the integration of all discussed functionalities. Timelines and Person-Days (PDs) have been adjusted accordingly to provide a realistic effort estimate.

### 5.1 Finalized Sprint Overview

| Sprint | Duration (Weeks) | Effort (PDs) | Contents |
|--------|------------------|--------------|----------|
| **0: Kick-off & Specification** | 2 | 10 | Detailed specifications, API design, data model (incl. Firestore Security Rules), initial Deep Linking architecture, conception of the web-to-app vendor login flow. Planning of Google Places API integration. |
| **1: Auth & Basic Services** | 3 | 18 | Login (Email & OTP), roles, basic UI framework, customer profile (screens & API), implementation of the "Magic Link" for vendor login (web-to-app). |
| **2: Vendor Onboarding** | 6 | 33 | Vendor registration (web interface), document upload, admin approval, Stripe Connect integration (Standard type), subscription status display (web to app). Automatic business data pre-filling via Google Places API. Display of average Google rating during onboarding. |
| **3: Product Catalog & Vouchers** | 5 | 42 | Product CRUD (incl. variants, image upload, stock management), product search & filters (by text, category, price), category assignment. Voucher management (creation, conditions like minimum order value, validity, single-use, analytics). Implementation of product management for gastronomy products with configurable options. Display of Google Reviews on vendor detail pages. |
| **4: Shopping Cart, Checkout, Chat** | 6 | 42 | Multi-vendor shopping cart, promocode entry & price calculation, split payment via Stripe & Refund API (incl. 3D Secure). Unified 1:1 chat (order-related and pre-order) incl. system messages for status changes and extended order status chain. |
| **5: QA & Launch** | 4 | 20 | Comprehensive bug fixing, preparation for App Store (TestFlight) & Google Play Store, implementation & review of data privacy texts. Initial performance tests. |
| **Total (Development)** | **26** | **165** | **MVP feature-complete according to a balanced approach.** |
| **6: Buffer & Hypercare** | 4 | n/a | Unplanned corrections, App Store review, stabilization. |
| **Total incl. Buffer** | **30** | **165** | **MVP Go-Live & Stabilized.** |

### 5.2 Timeline & Costs

- **Total Duration:** The project has a projected total duration of **30 weeks** (approx. 7.5 months).
- **Total Effort:** The pure development effort (for Sprints 0-5) totals **165 Person-Days**.
- **Total Budget:** The entire project budget, which covers personnel costs over the full project duration of 30 weeks (including the buffer and hypercare phase), amounts to **€66,000**.

### 5.3 Acceptance Criteria (MVP)

- Vendor can register via web, upload documents, connect Stripe account, and subscribe.
- Customer can find products via the app, add to a multi-vendor shopping cart, enter a promocode, and securely pay via credit card/Apple Pay.
- The Unified Chat is accessible per order or after customer initiation. Customer can initiate; vendor can only reply or proactively initiate if an order exists.
- Vouchers reduce the price live, server-side validation is present.
- The app meets the quality goals defined in the "Non-functional Requirements" section for performance, security, data protection, scalability, accessibility, and bilingualism.

### 5.4 Risks & Countermeasures (Detailed Overview)

Detailed risk analysis and proactive countermeasures are an integral part of the project plan:

- **Refund not processed:** Financial risks for the platform due to chargebacks, proactive monitoring, automated reminders, admin intervention.
- **In-app subscription payment causes app store blocking:** Strict web-based subscription handling, clear communication with app store reviewers.
- **Stripe setup delay:** Early test account, proactive support, parallelization of onboarding, admin status tracking.
- **Chat misuse:** Strict technical rules for chat initiation and permissions, user reporting function, vendor deactivation for misuse.
- **App Store review blocks launch:** Thorough preparation, internal pre-reviews, compliance verification.
- **NEW: Complexity due to more detailed features/requirements:** Modular development, strict code quality (reviews), testing strategy, detailed technical documentation, refactoring.
- **NEW: Dependency on third-party/cloud services:** Abstraction layers, monitoring, contingency plans, budget control.
- **NEW: Quality ambition vs. reality:** Adherence to processes and standards, proactive technical debt management, training.
- **NEW: Detailed security risks:** Precise Security Rules, robust server-side validation/authorization, secure Stripe integration, data protection measures.
- **NEW: Performance risks:** Optimized data model, Functions optimization, frontend performance, continuous monitoring and load tests.
- **NEW: Google Places API Costs & Data Quality:** Implementation of a hybrid caching strategy compliant with Google Places API ToS (cache core data and regularly update; fetch Google Photos directly via Google endpoints with mandatory attribution; primary vendor image is a mandatory vendor upload; fetch Google Reviews fresh with attribution).
