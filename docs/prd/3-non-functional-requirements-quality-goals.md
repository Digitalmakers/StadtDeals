# 3. Non-functional Requirements (Quality Goals)

The following non-functional requirements define the quality attributes of StadtDeals. They are crucial for user satisfaction, system stability, and the long-term success of the platform. Our balanced approach ensures that these goals are considered from the outset in design and implementation.

## 3.1 Performance

- **Target Value:** 95% of API calls < 500 ms.
- **Measures:** Optimized Firestore data model and queries (denormalization, indexing, pagination), Firebase Functions optimization (Min-Instances, efficient code), frontend performance (optimized rendering, virtualization, image optimization), continuous monitoring (Sentry), and load tests.

## 3.2 Availability

- **Target Value:** ≥ 99% uptime.
- **Measures:** Use of managed services (Firebase), robust error handling (retries, fallbacks), monitoring, and notification for service outages (Firebase/Stripe status pages).

## 3.3 Security

- **Principles:** HTTPS, role-based, RLS (Row Level Security for Firestore), Stripe SCA (Strong Customer Authentication).
- **Measures:** Strict Firebase Security Rules (Least Privilege), robust server-side validation and authorization in Firebase Functions, secure Stripe Connect integration (webhook signatures, idempotency keys), data protection (DSGVO-compliant, data minimization), regular security reviews, and dependency audits.

## 3.4 Data Protection

- **Principles:** EU hosting, data deletion and export functionality, Art. 6/13 DSGVO.
- **Measures:** Implementation of data deletion and export functions, clear consent to T&Cs and Privacy Policy, transparent data collection, secure processing of user data. T&Cs and Privacy Policy will be embedded via external URLs to allow for quick updates without app updates.

## 3.5 Scalability

- **Target Value:** 10,000+ users without re-architecture.
- **Measures:** Serverless architecture (Firebase Functions, Firestore), efficient data modeling, performance optimization, modular components for future expandability.

## 3.6 Accessibility

- **Target Value:** WCAG-AA compliant (App UI).
- **Measures:** Consideration of accessibility standards in UI design (color contrasts, font sizes, keyboard navigation), use of accessible UI components (NativeBase).

## 3.7 Bilingualism

- **Target Value:** Fully bilingual UI from the outset.
- **Languages:** German and English.
- **Measures:** Integration of a localization framework (e.g., react-native-localize with i18n-js), management of all text strings in both languages, dynamic adjustment of date and currency formats, user selection of language in settings.
