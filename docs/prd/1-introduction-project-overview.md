# 1. Introduction & Project Overview

This document serves as the finalized and binding statement of work, as well as the implementation guideline for the StadtDeals project. It summarizes all jointly developed and optimized specifications, architectural decisions, UI/UX concepts, sprint planning, and identified risks and their countermeasures.

## 1.1 Management Summary

**Project Name:** StadtDeals (formerly Frankzone)

**Project Goal:** Development of a mobile multi-vendor platform for local businesses, including online payment, vouchers & vendor onboarding. Customers order via the app, while businesses manage their products and orders independently.

**Target Audience:** End-customers (mobile), local businesses (Vendors), platform operators (Admin).

## Core Features (MVP):

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

## Technology:

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

## Timeline & Costs (Adjusted):

- **Development Time:** 26 weeks.
- **4 weeks buffer** (App Store Review & QA, Hypercare).
- **Total Duration incl. Buffer:** 30 weeks.
- **Total Effort:** 165 Person-Days.
- **Total Budget:** €66,000.

## Release Platforms:

- **iOS** (App Store via TestFlight) - iOS-first.
- **Android** (optional, after MVP).

## Special Notes:

- MVP is scalable for >8000 users.
- Modularly expandable (e.g., rating system, analytics, additional payment methods).

## 1.2 Vision & Core Principles

StadtDeals' vision is to connect local businesses with end-customers via an intuitive mobile platform, strengthening local commerce in the digital age. Our project follows a balanced approach, combining speed of MVP delivery with a strong commitment to quality, robustness, and long-term expandability. This minimizes technical debt and ensures the future viability of the platform.
