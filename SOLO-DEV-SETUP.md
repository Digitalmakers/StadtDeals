# StadtDeals - Solo-Entwickler Setup Guide

## 🎯 Übersicht

Dieser Guide ist optimiert für Solo-Entwicklung - kein Team-Overhead, nur das Wesentliche.

## 📋 Quick Start Checklist

```markdown
□ Firebase Projekt erstellen
□ GitHub Repo anlegen (privat)
□ Entwicklungsumgebung einrichten
□ Monitoring aktivieren
□ Erste Story starten
```

## 1️⃣ Firebase Setup (Tag 1)

### Projekt erstellen
```bash
# 1. Gehe zu https://console.firebase.google.com
# 2. "Create Project" → Name: stadtdeals-prod
# 3. Wähle Region: europe-west3 (Frankfurt)
# 4. Google Analytics: Ja (auch EU Region)
```

### Services aktivieren
```markdown
□ Authentication → Email/Password aktivieren
□ Firestore → Datenbank in EU erstellen
□ Storage → Bucket in EU
□ Functions → Region: europe-west1
```

### Budget-Alerts einrichten
```markdown
Firebase Console → ⚙️ Settings → Budget & alerts
- Alert bei 50€ → deine E-Mail
- Alert bei 100€ → deine E-Mail  
- Hard Cap bei 200€ (optional)
```

### Konfigurationsdateien
```bash
# Lade diese Dateien herunter:
- google-services.json (für Android)
- GoogleService-Info.plist (für iOS)

# Erstelle .env
FIREBASE_PROJECT_ID=stadtdeals-prod
FIREBASE_API_KEY=dein-key
# ... weitere Werte aus Firebase Console
```

## 2️⃣ Entwicklungsumgebung

### Minimal Setup
```bash
# Node.js installieren
nvm install 18.17.0
nvm use 18.17.0

# React Native CLI
npm install -g @react-native-community/cli

# Projekt erstellen
npx react-native init StadtDeals --template react-native-template-typescript
cd StadtDeals

# Dependencies
npm install zustand native-base react-hook-form zod
npm install @react-native-firebase/app @react-native-firebase/auth
```

### iOS Setup (nur macOS)
```bash
cd ios && pod install && cd ..
npm run ios
```

### Android Setup
```bash
# Android Studio installieren
# Emulator einrichten
npm run android
```

## 3️⃣ Monitoring für Solo-Devs

### E-Mail Benachrichtigungen

**Firebase Functions für Alerts:**
```typescript
// functions/src/monitoring.ts
import * as functions from 'firebase-functions';
import * as nodemailer from 'nodemailer';

const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'deine-email@gmail.com',
    pass: 'app-specific-password'
  }
});

export const budgetAlert = functions.pubsub
  .schedule('every 6 hours')
  .onRun(async (context) => {
    const usage = await checkFirebaseUsage();
    
    if (usage.percentage > 75) {
      await mailTransport.sendMail({
        to: 'deine-email@gmail.com',
        subject: '⚠️ StadtDeals: Budget bei ' + usage.percentage + '%',
        text: `Aktueller Verbrauch: €${usage.current} von €${usage.budget}`
      });
    }
  });
```

### Lokales Monitoring Dashboard

**monitoring.md** in deinem Projekt:
```markdown
# StadtDeals Monitoring

## Woche 1 (31.01.2025)

### Budget
- Montag: €0.12
- Dienstag: €0.18  
- Mittwoch: €0.15
- **Woche Total: €0.45**

### Progress
- [x] Firebase Setup
- [x] Auth Implementation  
- [ ] Design System

### Issues
- Firebase Auth: Langsame Response Zeit (gelöst mit region config)

### Nächste Woche
- Design System fertigstellen
- Epic 1 starten
```

## 4️⃣ GitHub Setup (Vereinfacht)

```bash
# Repo erstellen
gh repo create stadtdeals-app --private

# Basis-Struktur
mkdir -p src/{components,screens,services,utils}
mkdir -p docs/{stories,architecture}

# Git Flow für Solo
git checkout -b develop
# Arbeite auf develop
# Merge zu main nur bei Meilensteinen
```

**Wichtig**: Siehe [GIT-WORKFLOW.md](./GIT-WORKFLOW.md) für detaillierte Git-Anleitung, falls andere Entwickler später helfen!

### GitHub Actions (Optional aber hilfreich)
```yaml
# .github/workflows/ci.yml
name: CI
on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install
      - run: npm test
      - run: npm run lint
```

## 5️⃣ Risiko-Tracking (Vereinfacht)

**risks.md** im Projekt-Root:
```markdown
# Risiken

## Aktiv
- **Google Places API Kosten**: Limit setzen, Caching implementieren
- **Stripe Integration**: Früh testen, Dokumentation studieren

## Gelöst
- ✓ Firebase EU Region: Dokumentiert in Setup
```

## 6️⃣ Tägliche Routine

### Morgen (5 Min)
```markdown
□ Firebase Console checken (Kosten, Errors)
□ GitHub Actions Status prüfen
□ risks.md aktualisieren wenn nötig
```

### Abend (10 Min)
```markdown
□ Code committen
□ monitoring.md aktualisieren
□ Morgen planen
```

### Wöchentlich (30 Min)
```markdown
□ Budget Review
□ Fortschritt vs Plan prüfen
□ Risiken neu bewerten
□ Nächste Woche planen
```

## 7️⃣ Quick Commands

```bash
# Alias für häufige Commands (.zshrc)
alias sd-ios="cd ~/StadtDeals && npm run ios"
alias sd-android="cd ~/StadtDeals && npm run android"
alias sd-test="cd ~/StadtDeals && npm test"
alias sd-deploy="cd ~/StadtDeals && npm run deploy"

# Git Aliases
alias gs="git status"
alias gc="git commit -m"
alias gp="git push"
```

## 8️⃣ Notfall-Kontakte

- **Firebase Support**: https://firebase.google.com/support
- **React Native**: https://github.com/react-native-community
- **Stripe Support**: https://support.stripe.com

## 🚀 Fertig!

Du hast jetzt:
- ✅ Firebase mit E-Mail Alerts
- ✅ Lokale Entwicklungsumgebung  
- ✅ Einfaches Monitoring
- ✅ Minimaler Overhead

**Starte mit:**
```bash
cd StadtDeals
npm start
# In neuem Terminal
npm run ios # oder npm run android
```

Viel Erfolg! 🎯