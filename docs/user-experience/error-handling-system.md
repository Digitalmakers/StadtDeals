# Error Handling & User Feedback System

## Comprehensive Error Management for StadtDeals

This document provides implementation-ready error handling specifications that integrate directly with your development sprints.

---

## Error Message Framework

### Core Error Message Structure
```typescript
interface ErrorMessage {
  id: string;
  type: 'network' | 'validation' | 'permission' | 'payment' | 'system';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  explanation?: string;
  actions: ErrorAction[];
  helpLink?: string;
  reportable: boolean;
}

interface ErrorAction {
  text: string;
  type: 'primary' | 'secondary' | 'destructive';
  action: () => void;
  analyticsEvent?: string;
}
```

---

## Sprint 1: Authentication & Basic Errors

### Authentication Error States
```typescript
export const authErrors: Record<string, ErrorMessage> = {
  INVALID_EMAIL: {
    id: 'auth.invalid_email',
    type: 'validation',
    severity: 'medium',
    title: 'E-Mail ungültig',
    message: 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
    explanation: 'Die E-Mail-Adresse muss das Format name@domain.de haben',
    actions: [
      {
        text: 'E-Mail korrigieren',
        type: 'primary',
        action: () => focusEmailField(),
        analyticsEvent: 'error_action_fix_email'
      }
    ],
    reportable: false
  },
  
  OTP_EXPIRED: {
    id: 'auth.otp_expired',
    type: 'validation', 
    severity: 'medium',
    title: 'Code abgelaufen',
    message: 'Der Bestätigungscode ist abgelaufen',
    explanation: 'Bestätigungscodes sind 10 Minuten gültig',
    actions: [
      {
        text: 'Neuen Code anfordern',
        type: 'primary',
        action: () => requestNewOTP(),
        analyticsEvent: 'error_action_new_otp'
      },
      {
        text: 'E-Mail ändern',
        type: 'secondary',
        action: () => goBackToEmailInput(),
        analyticsEvent: 'error_action_change_email'
      }
    ],
    helpLink: '/help/login-probleme',
    reportable: false
  },
  
  NETWORK_ERROR: {
    id: 'auth.network_error',
    type: 'network',
    severity: 'high',
    title: 'Verbindungsproblem',
    message: 'Keine Internetverbindung verfügbar',
    explanation: 'Überprüfen Sie Ihre WLAN- oder Mobilfunkverbindung',
    actions: [
      {
        text: 'Erneut versuchen',
        type: 'primary',
        action: () => retryLastAction(),
        analyticsEvent: 'error_action_retry'
      },
      {
        text: 'Offline fortfahren',
        type: 'secondary',
        action: () => enableOfflineMode(),
        analyticsEvent: 'error_action_offline'
      }
    ],
    helpLink: '/help/verbindungsprobleme',
    reportable: true
  }
};
```

### Location Permission Errors
```typescript
export const locationErrors: Record<string, ErrorMessage> = {
  PERMISSION_DENIED: {
    id: 'location.permission_denied',
    type: 'permission',
    severity: 'medium',
    title: 'Standortzugriff verweigert',
    message: 'Um lokale Geschäfte zu finden, benötigen wir Ihren Standort',
    explanation: 'Sie können den Standortzugriff in den Einstellungen aktivieren',
    actions: [
      {
        text: 'Einstellungen öffnen',
        type: 'primary',
        action: () => openAppSettings(),
        analyticsEvent: 'error_action_open_settings'
      },
      {
        text: 'Adresse eingeben',
        type: 'secondary',
        action: () => showManualLocationInput(),
        analyticsEvent: 'error_action_manual_location'
      },
      {
        text: 'Alle Geschäfte anzeigen',
        type: 'secondary',
        action: () => showAllBusinesses(),
        analyticsEvent: 'error_action_show_all'
      }
    ],
    helpLink: '/help/standort-aktivieren',
    reportable: false
  }
};
```

---

## Sprint 2: Vendor Onboarding Errors

### Document Upload Errors
```typescript
export const uploadErrors: Record<string, ErrorMessage> = {
  FILE_TOO_LARGE: {
    id: 'upload.file_too_large',
    type: 'validation',
    severity: 'medium',
    title: 'Datei zu groß',
    message: 'Die Datei darf maximal 5 MB groß sein',
    explanation: 'Komprimieren Sie das Bild oder verwenden Sie ein anderes Format',
    actions: [
      {
        text: 'Andere Datei wählen',
        type: 'primary',
        action: () => openFilePicker(),
        analyticsEvent: 'error_action_choose_different_file'
      },
      {
        text: 'Bild komprimieren',
        type: 'secondary',
        action: () => showCompressionOptions(),
        analyticsEvent: 'error_action_compress'
      }
    ],
    helpLink: '/help/dokumente-hochladen',
    reportable: false
  },
  
  INVALID_DOCUMENT_TYPE: {
    id: 'upload.invalid_type',
    type: 'validation',
    severity: 'medium',
    title: 'Ungültiges Dateiformat',
    message: 'Nur PDF, JPG und PNG Dateien sind erlaubt',
    explanation: 'Bitte wandeln Sie Ihr Dokument in ein unterstütztes Format um',
    actions: [
      {
        text: 'Andere Datei wählen',
        type: 'primary',
        action: () => openFilePicker(),
        analyticsEvent: 'error_action_choose_different_type'
      }
    ],
    helpLink: '/help/unterstuetzte-dateiformate',
    reportable: false
  }
};
```

### Stripe Integration Errors
```typescript
export const stripeErrors: Record<string, ErrorMessage> = {
  ACCOUNT_SETUP_FAILED: {
    id: 'stripe.setup_failed',
    type: 'system',
    severity: 'high',
    title: 'Zahlungskonto konnte nicht eingerichtet werden',
    message: 'Bei der Einrichtung Ihres Zahlungskontos ist ein Fehler aufgetreten',
    explanation: 'Dies kann an unvollständigen Daten oder technischen Problemen liegen',
    actions: [
      {
        text: 'Erneut versuchen',
        type: 'primary',
        action: () => retryStripeSetup(),
        analyticsEvent: 'error_action_retry_stripe'
      },
      {
        text: 'Support kontaktieren',
        type: 'secondary',
        action: () => contactSupport('stripe_setup_failed'),
        analyticsEvent: 'error_action_contact_support'
      }
    ],
    helpLink: '/help/zahlungskonto-einrichten',
    reportable: true
  }
};
```

---

## Sprint 3: Product Management Errors

### Product Creation Errors
```typescript
export const productErrors: Record<string, ErrorMessage> = {
  INVALID_PRICE: {
    id: 'product.invalid_price',
    type: 'validation',
    severity: 'medium',
    title: 'Ungültiger Preis',
    message: 'Der Preis muss zwischen 0,01 € und 999,99 € liegen',
    explanation: 'Geben Sie einen gültigen Preis im Euro-Format ein (z.B. 12,99)',
    actions: [
      {
        text: 'Preis korrigieren',
        type: 'primary',
        action: () => focusPriceField(),
        analyticsEvent: 'error_action_fix_price'
      }
    ],
    reportable: false
  },
  
  IMAGE_UPLOAD_FAILED: {
    id: 'product.image_upload_failed',
    type: 'system',
    severity: 'high',
    title: 'Bild konnte nicht hochgeladen werden',
    message: 'Das Produktbild konnte nicht gespeichert werden',
    explanation: 'Überprüfen Sie Ihre Internetverbindung und versuchen Sie es erneut',
    actions: [
      {
        text: 'Erneut versuchen',
        type: 'primary',
        action: () => retryImageUpload(),
        analyticsEvent: 'error_action_retry_image'
      },
      {
        text: 'Anderes Bild wählen',
        type: 'secondary',
        action: () => selectDifferentImage(),
        analyticsEvent: 'error_action_different_image'
      },
      {
        text: 'Ohne Bild fortfahren',
        type: 'secondary',
        action: () => skipImageUpload(),
        analyticsEvent: 'error_action_skip_image'
      }
    ],
    helpLink: '/help/produktbilder-hochladen',
    reportable: true
  }
};
```

### Search & Filtering Errors
```typescript
export const searchErrors: Record<string, ErrorMessage> = {
  NO_RESULTS_FOUND: {
    id: 'search.no_results',
    type: 'validation',
    severity: 'low',
    title: 'Keine Ergebnisse gefunden',
    message: 'Für Ihre Suche wurden keine Produkte gefunden',
    explanation: 'Versuchen Sie andere Suchbegriffe oder erweitern Sie Ihren Suchbereich',
    actions: [
      {
        text: 'Suchbereich erweitern',
        type: 'primary',
        action: () => expandSearchRadius(),
        analyticsEvent: 'error_action_expand_search'
      },
      {
        text: 'Alle Kategorien anzeigen',
        type: 'secondary',
        action: () => showAllCategories(),
        analyticsEvent: 'error_action_show_categories'
      },
      {
        text: 'Filter zurücksetzen',
        type: 'secondary',
        action: () => clearAllFilters(),
        analyticsEvent: 'error_action_clear_filters'
      }
    ],
    reportable: false
  }
};
```

---

## Sprint 4: Payment & Order Errors

### Payment Processing Errors
```typescript
export const paymentErrors: Record<string, ErrorMessage> = {
  CARD_DECLINED: {
    id: 'payment.card_declined',
    type: 'payment',
    severity: 'high',
    title: 'Karte abgelehnt',
    message: 'Ihre Zahlung wurde von der Bank abgelehnt',
    explanation: 'Dies kann verschiedene Gründe haben: unzureichende Deckung, Kartenlimit oder Sicherheitsmaßnahmen',
    actions: [
      {
        text: 'Andere Karte verwenden',
        type: 'primary',
        action: () => showPaymentMethodSelector(),
        analyticsEvent: 'error_action_different_card'
      },
      {
        text: 'Erneut versuchen',
        type: 'secondary',
        action: () => retryPayment(),
        analyticsEvent: 'error_action_retry_payment'
      },
      {
        text: 'Bank kontaktieren',
        type: 'secondary',
        action: () => showBankContactInfo(),
        analyticsEvent: 'error_action_contact_bank'
      }
    ],
    helpLink: '/help/zahlung-fehlgeschlagen',
    reportable: true
  },
  
  THREEDS_FAILED: {
    id: 'payment.threeds_failed',
    type: 'payment',
    severity: 'high',
    title: '3D Secure Authentifizierung fehlgeschlagen',
    message: 'Die Sicherheitsprüfung Ihrer Bank konnte nicht abgeschlossen werden',
    explanation: 'Überprüfen Sie Ihre Eingaben in der Banking-App oder beim Online-Banking',
    actions: [
      {
        text: 'Erneut authentifizieren',
        type: 'primary',
        action: () => retry3DSAuthentication(),
        analyticsEvent: 'error_action_retry_3ds'
      },
      {
        text: 'Andere Zahlungsmethode',
        type: 'secondary',
        action: () => showAlternativePaymentMethods(),
        analyticsEvent: 'error_action_alternative_payment'
      }
    ],
    helpLink: '/help/3d-secure-probleme',
    reportable: true
  },
  
  INSUFFICIENT_FUNDS: {
    id: 'payment.insufficient_funds',
    type: 'payment',
    severity: 'high',
    title: 'Unzureichende Deckung',
    message: 'Auf Ihrem Konto ist nicht genügend Guthaben verfügbar',
    explanation: 'Überprüfen Sie Ihr Kontoguthaben oder verwenden Sie eine andere Zahlungsmethode',
    actions: [
      {
        text: 'Andere Zahlungsmethode',
        type: 'primary',
        action: () => showPaymentMethodSelector(),
        analyticsEvent: 'error_action_different_payment_method'
      },
      {
        text: 'Bestellwert reduzieren',
        type: 'secondary',
        action: () => goBackToCart(),
        analyticsEvent: 'error_action_reduce_order'
      }
    ],
    helpLink: '/help/zahlungsprobleme',
    reportable: false
  }
};
```

### Cart & Checkout Errors
```typescript
export const cartErrors: Record<string, ErrorMessage> = {
  ITEM_OUT_OF_STOCK: {
    id: 'cart.out_of_stock',
    type: 'validation',
    severity: 'medium',
    title: 'Artikel nicht mehr verfügbar',
    message: 'Ein Artikel in Ihrem Warenkorb ist leider ausverkauft',
    explanation: 'Der Anbieter hat den Artikel zwischenzeitlich als nicht verfügbar markiert',
    actions: [
      {
        text: 'Artikel entfernen',
        type: 'primary',
        action: () => removeOutOfStockItem(),
        analyticsEvent: 'error_action_remove_item'
      },
      {
        text: 'Anbieter kontaktieren',
        type: 'secondary',
        action: () => contactVendor(),
        analyticsEvent: 'error_action_contact_vendor'
      }
    ],
    reportable: false
  },
  
  MINIMUM_ORDER_NOT_REACHED: {
    id: 'cart.minimum_order',
    type: 'validation',
    severity: 'medium',
    title: 'Mindestbestellwert nicht erreicht',
    message: 'Der Mindestbestellwert von {minAmount} wurde nicht erreicht',
    explanation: 'Fügen Sie weitere Artikel hinzu oder entfernen Sie den Gutscheincode',
    actions: [
      {
        text: 'Weitere Artikel hinzufügen',
        type: 'primary',
        action: () => continueShopping(),
        analyticsEvent: 'error_action_add_more_items'
      },
      {
        text: 'Gutschein entfernen',
        type: 'secondary',
        action: () => removePromoCode(),
        analyticsEvent: 'error_action_remove_promo'
      }
    ],
    reportable: false
  }
};
```

### Chat System Errors
```typescript
export const chatErrors: Record<string, ErrorMessage> = {
  MESSAGE_FAILED: {
    id: 'chat.message_failed',
    type: 'network',
    severity: 'medium',
    title: 'Nachricht konnte nicht gesendet werden',
    message: 'Ihre Nachricht wurde nicht übertragen',
    explanation: 'Überprüfen Sie Ihre Internetverbindung',
    actions: [
      {
        text: 'Erneut senden',
        type: 'primary',
        action: () => resendMessage(),
        analyticsEvent: 'error_action_resend_message'
      },
      {
        text: 'Als Entwurf speichern',
        type: 'secondary',
        action: () => saveAsDraft(),
        analyticsEvent: 'error_action_save_draft'
      }
    ],
    reportable: true
  }
};
```

---

## Error Analytics & Reporting

### Error Tracking Configuration
```typescript
interface ErrorAnalytics {
  errorId: string;
  userId?: string;
  sessionId: string;
  timestamp: number;
  userAgent: string;
  appVersion: string;
  sprint: string;
  context: {
    screen: string;
    action: string;
    additionalData?: Record<string, any>;
  };
  resolution?: {
    action: string;
    timestamp: number;
    successful: boolean;
  };
}

// Error reporting thresholds
const errorThresholds = {
  network: { maxPerHour: 10, escalate: true },
  payment: { maxPerHour: 5, escalate: true },
  validation: { maxPerHour: 50, escalate: false },
  system: { maxPerHour: 3, escalate: true }
};
```

### Automated Error Response System
```typescript
// Automated error handling and user assistance
const automatedResponses = {
  networkErrors: {
    retryAttempts: 3,
    retryDelay: [1000, 2000, 5000], // Progressive backoff
    offlineFallback: true
  },
  
  paymentErrors: {
    alternativeMethodSuggestion: true,
    customerSupportEscalation: true,
    retryAttempts: 2
  },
  
  validationErrors: {
    realTimeValidation: true,
    preventiveMessages: true,
    autocorrectSuggestions: true
  }
};
```

---

## User Feedback Integration

### Post-Error Feedback Collection
```typescript
interface ErrorFeedback {
  errorId: string;
  wasHelpful: boolean;
  resolution: 'resolved' | 'partially_resolved' | 'not_resolved';
  improvementSuggestion?: string;
  contactSupport: boolean;
}

// Feedback prompts after error resolution
const feedbackPrompts = {
  afterResolution: {
    delay: 5000, // 5 seconds after successful resolution
    message: 'Konnten Sie das Problem lösen?',
    options: ['Ja, perfekt', 'Teilweise', 'Nein, brauche Hilfe']
  },
  
  afterSupport: {
    delay: 24 * 60 * 60 * 1000, // 24 hours after support contact
    message: 'Wie zufrieden waren Sie mit unserem Support?',
    scale: 5,
    followUp: true
  }
};
```

This comprehensive error handling system ensures that users receive helpful, actionable guidance at every step of their journey through StadtDeals, reducing frustration and support tickets while improving overall user experience.