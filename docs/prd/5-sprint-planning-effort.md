# 5. Sprint Planning & Effort

The following sprint plan has been comprehensively optimized to ensure a balanced approach. This includes more detailed feature implementation, elevated quality standards, and the integration of all discussed functionalities. Timelines and Person-Days (PDs) have been adjusted accordingly to provide a realistic effort estimate.

## 5.1 Finalized Sprint Overview

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

## 5.2 Timeline & Costs

- **Total Duration:** The project has a projected total duration of **30 weeks** (approx. 7.5 months).
- **Total Effort:** The pure development effort (for Sprints 0-5) totals **165 Person-Days**.
- **Total Budget:** The entire project budget, which covers personnel costs over the full project duration of 30 weeks (including the buffer and hypercare phase), amounts to **€66,000**.

## 5.3 Acceptance Criteria (MVP)

- Vendor can register via web, upload documents, connect Stripe account, and subscribe.
- Customer can find products via the app, add to a multi-vendor shopping cart, enter a promocode, and securely pay via credit card/Apple Pay.
- The Unified Chat is accessible per order or after customer initiation. Customer can initiate; vendor can only reply or proactively initiate if an order exists.
- Vouchers reduce the price live, server-side validation is present.
- The app meets the quality goals defined in the "Non-functional Requirements" section for performance, security, data protection, scalability, accessibility, and bilingualism.

## 5.4 Risks & Countermeasures (Detailed Overview)

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
