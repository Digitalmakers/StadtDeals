# 3. API Design & Business Logic (Firebase Functions)

Firebase Functions host the server-side logic and app interfaces.

- **API Style**: Primarily RESTful principles for resource naming and HTTP methods.
- **API Versioning**: Implementation of URL-based versioning (e.g., `/api/v1/`) to ensure backward compatibility for future API changes.
- **Error Responses**: Consistent and informative JSON error responses (`status`, `code`, `message`, `details`) with appropriate HTTP status codes (e.g., 400, 401, 403, 404, 500).

## Authentication & Authorization:

- App sends Firebase Auth ID Tokens in the `Authorization` header.
- Each protected Function verifies the token and checks the user's role and permissions (from the `users` collection) before executing actions.

## Server-side Validation:

Mandatory and comprehensive validation of all incoming data in every Function to ensure data integrity and security.

## Performance Optimization:

- Use of `minInstances` for critical Functions to reduce cold starts.
- Efficient code, optimized database queries (batch operations), appropriate region selection (EU hosting).
- Concurrency configuration for Functions.

## Location-based Search:

Implementation of proximity search logic in Firebase Functions to efficiently find businesses and offers near the user's location.

## Chat Logic:

Firebase Functions control the strict chat rules (customer initiates, vendor replies or proactively initiates if an order exists) and automated system messages.

## Google Places API Integration:

- New Firebase Functions endpoints to communicate with the Google Places API (e.g., for Place Search during onboarding, retrieving reviews).
- **Hybrid Caching Strategy**: Core Business Data (name, address, phone, website, location coordinates, Google Place ID) is stored in Firestore and updated regularly. Google Places photos are stored only as references/URLs and retrieved directly from Google endpoints with mandatory attribution upon request; the primary vendor image is a mandatory vendor upload and hosted in Firebase Storage.
- Google reviews are **not cached** and must be retrieved fresh from Google for every display, with mandatory attribution.
