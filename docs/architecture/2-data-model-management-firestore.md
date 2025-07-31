# 2. Data Model & Management (Firestore)

The data model is designed for efficiency, scalability, and secure access control. Firestore serves as the primary NoSQL database.

## Collections:

- **`users`**: User profiles (Customer, Admin, Vendor).
- **`vendors`**: Detailed business profiles, including `stripeAccountId` and `subscriptionStatus`. Stores Google Place ID and Google Photo References.
- **`products`**: Product details (per vendor), including `images`, `categories`, `variants` (for physical products), and `options` (for configurable gastronomy products). The `stock` field for gastronomy products will be set to a high value; availability can be toggled manually.
- **`orders`**: Order details, `customerId`, `totalAmount`, `paymentIntentId`, extended status chain. Contains `vendorOrders` as an array of objects for multi-vendor splits.
- **`promocodes`**: Voucher information, including `vendorId` (optional), `code`, `discountType`, `discountValue`, `minimumOrderValue`, `maxUses`.
- **`chats`**: Single chat document per customer-vendor pair (`customerId_vendorId`). Includes `initialChatOpenedByCustomer` and `vendorCanInitiateProactively` flags to control vendor communication. Messages as a `messages` subcollection.
- **`refund_requests`**: Refund requests with status tracking and escalation logic.
- **`categories`**: Predefined product categories.

## Principles:

- **Denormalization**: Targeted duplication of data to optimize read access.
- **Firestore Security Rules**: Strict, role-based rules enforce access rights at the database level, especially for chat access and sensitive data.
- **Indexing**: Planned indexes to optimize queries and sorting.
