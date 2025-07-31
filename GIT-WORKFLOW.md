# Git Workflow für StadtDeals

## 🎯 Übersicht

Dieser Git-Workflow ist optimiert für Solo-Entwicklung mit der Möglichkeit, dass später andere Entwickler temporär helfen können.

## 📋 Branch-Strategie

```
main (production)
├── develop (integration)
│   ├── feature/auth-system
│   ├── feature/shopping-cart
│   ├── feature/design-system
│   └── fix/payment-bug
└── hotfix/critical-issue
```

### Branch-Typen

**main**
- Produktions-ready Code
- Nur getestete Features
- Tagged für Releases (v1.0.0, v1.1.0)

**develop**
- Integrations-Branch
- Hier kommen alle Features zusammen
- Basis für neue Feature-Branches

**feature/**
- Neue Features entwickeln
- Naming: `feature/kurze-beschreibung`
- Beispiel: `feature/user-profile`

**fix/**
- Bug-Fixes (nicht kritisch)
- Naming: `fix/was-ist-kaputt`
- Beispiel: `fix/login-validation`

**hotfix/**
- Kritische Prod-Fixes
- Direkt von main erstellt
- Zurück zu main UND develop

## 🚀 Typischer Workflow

### 1. Neues Feature starten
```bash
# Sicherstellen, dass develop aktuell ist
git checkout develop
git pull origin develop

# Feature-Branch erstellen
git checkout -b feature/vendor-onboarding

# Arbeiten...
git add .
git commit -m "feat: Add vendor registration form"
git commit -m "feat: Add document upload for vendors"
```

### 2. Commit-Nachrichten Format

**Format**: `<type>: <description>`

**Types:**
- `feat:` Neues Feature
- `fix:` Bug-Fix
- `docs:` Nur Dokumentation
- `style:` Formatierung (kein Code-Change)
- `refactor:` Code-Umstrukturierung
- `test:` Tests hinzufügen/ändern
- `chore:` Build-Prozess, Tools

**Beispiele:**
```bash
git commit -m "feat: Add email OTP authentication"
git commit -m "fix: Resolve cart calculation error"
git commit -m "docs: Update API documentation"
git commit -m "refactor: Simplify payment logic"
git commit -m "test: Add unit tests for auth service"
```

### 3. Feature fertigstellen
```bash
# Lokale Commits aufräumen (optional)
git rebase -i develop

# Develop-Branch aktualisieren
git checkout develop
git pull origin develop

# Feature-Branch rebasen
git checkout feature/vendor-onboarding
git rebase develop

# Falls Konflikte:
# 1. Konflikte lösen
# 2. git add <files>
# 3. git rebase --continue

# Feature pushen
git push origin feature/vendor-onboarding

# Pull Request erstellen (auf GitHub)
```

### 4. Code Review (wenn andere helfen)

**Pull Request Beschreibung Template:**
```markdown
## Was macht dieser PR?
Kurze Beschreibung der Änderungen

## Warum?
Kontext und Motivation

## Wie testen?
1. Schritt 1
2. Schritt 2
3. Erwartetes Ergebnis

## Checkliste
- [ ] Tests geschrieben/aktualisiert
- [ ] Dokumentation aktualisiert
- [ ] Keine Console.logs vergessen
- [ ] Performance getestet
```

### 5. Merge zu Develop
```bash
# Nach Review/Approval
git checkout develop
git merge --no-ff feature/vendor-onboarding
git push origin develop

# Feature-Branch löschen
git branch -d feature/vendor-onboarding
git push origin --delete feature/vendor-onboarding
```

## 📝 Für andere Entwickler

### Projekt Setup
```bash
# Repository klonen
git clone https://github.com/[username]/stadtdeals-app.git
cd stadtdeals-app

# Develop branch auschecken
git checkout develop

# Dependencies installieren
npm install
cd ios && pod install && cd ..

# Environment einrichten
cp .env.example .env
# .env mit korrekten Werten füllen (vom Hauptentwickler erfragen)
```

### Arbeiten an einem Feature
```bash
# 1. Aktuellen Stand holen
git checkout develop
git pull origin develop

# 2. Feature-Branch erstellen
git checkout -b feature/mein-feature

# 3. Regelmäßig committen
git add src/components/MyComponent.tsx
git commit -m "feat: Add MyComponent base structure"

# 4. Täglich develop-Updates holen
git fetch origin
git rebase origin/develop

# 5. Feature pushen
git push origin feature/mein-feature
```

### Wichtige Regeln

**✅ DO:**
- Kleine, fokussierte Commits
- Aussagekräftige Commit-Messages
- Tests für neue Features
- Dokumentation aktualisieren
- Vor Push: `npm test` und `npm run lint`

**❌ DON'T:**
- Direkt auf main/develop pushen
- Große, unzusammenhängende Commits
- Sensible Daten committen (.env, API Keys)
- Force-Push auf geteilte Branches
- Ungetesteten Code mergen

## 🔧 Git Konfiguration

### Nützliche Aliases
```bash
# In ~/.gitconfig oder mit git config --global
git config --global alias.st "status -sb"
git config --global alias.co "checkout"
git config --global alias.br "branch"
git config --global alias.cm "commit -m"
git config --global alias.last "log -1 HEAD --stat"
git config --global alias.ll "log --oneline -10"
git config --global alias.visual "log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"
```

### Beispiel-Nutzung:
```bash
git st          # Status kurz
git co develop  # Checkout develop
git cm "feat: Add new feature"  # Commit
git ll          # Letzte 10 commits
git visual      # Schöne Branch-Visualisierung
```

## 🚨 Notfall-Prozeduren

### Letzten Commit rückgängig machen
```bash
# Soft reset (Änderungen bleiben)
git reset --soft HEAD~1

# Hard reset (Änderungen weg!)
git reset --hard HEAD~1
```

### Versehentlich auf main gepusht
```bash
# NICHT force-pushen!
# Stattdessen: Revert commit erstellen
git revert HEAD
git push origin main
```

### Merge-Konflikt lösen
```bash
# 1. Konflikt-Dateien finden
git status

# 2. Dateien öffnen und Konflikte lösen
# Suche nach <<<<<<< HEAD

# 3. Gelöste Dateien stagen
git add <resolved-files>

# 4. Merge/Rebase fortsetzen
git merge --continue
# oder
git rebase --continue
```

## 📊 Git Flow Visualisierung

```
main     ─────●─────────────────●──────────► v1.0
              ↑                 ↑
develop  ──●──┼──●──●──●────●──┼──●──●────►
           │  │     │  │    │  │
feature/1  └──●──●──┘  │    │  │
                       │    │  │
feature/2              └────●──┘
```

## 🤝 Kommunikation

### Wenn andere helfen:

**Vor Arbeitsbeginn:**
```markdown
# In GitHub Issue oder Discord/Email
"Ich arbeite an Feature X (Issue #123)"
"Branch: feature/payment-integration"
"Geschätzte Zeit: 2 Tage"
```

**Bei Problemen:**
```markdown
"Brauche Hilfe mit Firebase Auth"
"Branch: feature/auth-system" 
"Problem: OTP wird nicht gesendet"
```

**Nach Fertigstellung:**
```markdown
"PR ready for review: #45"
"Tests: ✅ Alle grün"
"Bitte testen: Login-Flow mit neuer UI"
```

## 📚 Weiterführende Ressourcen

- [Git Dokumentation](https://git-scm.com/doc)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Interactive Rebase Tutorial](https://www.atlassian.com/git/tutorials/rewriting-history/git-rebase)

---

**Tipp für Solo-Entwickler**: Auch wenn du alleine arbeitest, halte dich an diesen Workflow. Es macht es viel einfacher, wenn später jemand hilft oder das Projekt übernimmt!