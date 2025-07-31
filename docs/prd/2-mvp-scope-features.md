# 2. MVP Scope & Features

The MVP of StadtDeals encompasses all essential functionalities required to deliver a functional, bilingual multi-vendor platform. Modules are categorized thematically and follow a balanced approach that prioritizes quality, security, and user-friendliness.

## 2.1 Onboarding & Management

### Vendor Onboarding:

- Vendor registration occurs **exclusively via a web interface**, to comply with app store guidelines regarding provisions for digital subscriptions.
- Includes document upload for verification, admin approval, Stripe Connect integration, and subscription status display (subscription handling strictly via web).
- **Automatic Business Data Pre-filling:** During web onboarding, vendors can search for their business. If a match is found via the Google Places API, business data such as name, address, phone number, location (latitude and longitude), and photos will be suggested automatically and pre-filled for review/confirmation. For the vendor's primary profile image, a mandatory upload by the vendor is required; Google Places photos can be integrated as secondary/supplementary images.
- **Seamless App Login for Vendors:** After successful web registration, the vendor's initial app login occurs seamlessly via a one-time, time-limited "Magic Link" sent via email. Alternatively, a passwordless login (OTP via email) is always available in the app.

### Admin Panel:

- Central management for the platform operator.
- Functions: Review & approval of vendors, voucher overview, escalation for refunds, vendor activation/deactivation.
- **QR Code & Deep Link Management:** Exclusively Admins can generate and download QR codes and associated deep links (with vendor ID, optional product or promo ID) for marketing purposes.

## 2.2 Customer Profile & Order History

### Customer Profile:

- Management of profile data (name, email, address).
- Overview of past orders.
- Consent to Terms & Conditions and Privacy Policy during registration.
- **T&C/Privacy Policy at Checkout:** A passive disclaimer with links to external URLs for T&C and Privacy Policy will be placed before final checkout, without requiring renewed active consent.

## 2.3 Product & Order

### Product Creation & Management (Vendor App):

- Product creation including variants, image upload, stock management.
- **Camera Usage with Overlay:** The app provides a camera function with a transparent overlay that dictates dimensions and aspect ratio. Includes visual quality indicators for poor lighting or blur directly during capture.
- **Configurable Products (Gastronomy):** Support for products with flexible options (e.g., "Extras", "Sides") with selection mechanisms (radio buttons for single selection, checkboxes for multi-selection) and dynamic price updates. For gastronomy products, the stock field will be set to a high value; vendors can set these products to "temporarily unavailable".

### Voucher Management (Vendor App):

- Creation of promocodes with conditions such as **minimum order value**, validity, and single-use. Includes analytics on redemptions.

### Product Catalog & Search (Customer App):

- Product search and filters (by text, category, price).
- **Location-based Display (Default):** Search results and displayed businesses are based on the user's current geographical proximity by default. Manual location change is possible.
- Assignment of products to existing categories or suggestion to admin.
- Attractive product display with clear cards, images, prices, and discount badges.
- **Display of Google Reviews:** Average Google star ratings for vendors will be displayed on vendor profiles. A detailed view will list Google user reviews, fetched directly from the Google Places API (no caching allowed, with attribution).

### Shopping Cart:

- Multi-vendor shopping cart, promocode entry & price calculation.
- **Quantity Stepper:** Direct adjustment of quantity for fixed items on the product card.

### Checkout & Payment:

- Secure payment via Stripe (split payment via Stripe Connect, 3D Secure, Refund API).
- **Dynamic Free Delivery Hint:** Display of progress towards achieving free delivery in the checkout.

### Order Status & Refund:

- Customers track status in their profile: "Ordered", "Accepted", "In Preparation", "Shipped/Ready for Pickup", "Completed". Vendor can manually set status.
- Customer can request a refund; vendor receives a push notification.
- **Escalation Workflow:** If the vendor does not respond within 72 hours to a refund request, the admin is notified and can intervene.

## 2.4 Communication & Notifications

### In-App Chat (Unified & Rule-based):

- Direct 1:1 chat per customer-vendor pair. All messages appear in a single, continuous thread.
- **Customer Initiation:** Customer can initiate chat at any time (even without an order).
- **Vendor Communication:** Vendor can only reply if the customer has initiated the chat, OR proactively initiate if an order exists between them.
- **System Messages:** Automated messages for order status changes within the chat thread (e.g., "Order accepted").

### Notifications:

- Push notifications (via FCM) for new orders, chat messages, or refund requests.
- Customer receives an order summary via email after checkout (incl. products, total, vendor shares).

## 2.5 Infrastructure & Services

**Basic Services:** Firebase Auth (Email + OTP), role-based access (Customer, Vendor, Admin), DSGVO-compliant hosting (EU), bilingual UI (German & English), Firebase Push (FCM), customer account with profile data, passwordless login, order history view.

**System Services:** Vendor can be manually deactivated by Admin (e.g., for subscription default, inactivity, violation). System logic manages status updates, order history, refund workflow with vendor approval and escalation.
