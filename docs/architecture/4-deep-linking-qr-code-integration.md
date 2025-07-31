# 4. Deep Linking & QR Code Integration

- **URL Scheme**: Consistent deep link URLs (e.g., `https://app.stadtdeals.de/vendor/{vendorId}` or `/product/{productId}`), containing vendor and optional product/promo IDs.
- **App Integration**: Use of Universal Links (iOS) and App Links (Android) to open URLs directly in the app or redirect to the App Store if the app is not installed.
- **QR Code Generation**: The function to generate QR codes from these deep links will be implemented exclusively within the Admin Panel to ensure centralized control and consistency.
