# StadtDeals - Risiko-Tracking

## 🔴 Kritische Risiken

### RISK-001: Firebase EU-Konfiguration
- **Status**: Mitigiert ✓
- **Lösung**: Detaillierte Anleitung in Story 0.0
- **Nächste Schritte**: Bei Setup genau befolgen

### RISK-002: Epic 4 Komplexität
- **Status**: Mitigiert ✓  
- **Lösung**: Aufgeteilt in Epic 4A (Cart) und 4B (Chat)
- **Nächste Schritte**: Parallel-Entwicklung planen

## 🟡 Aktive Risiken

### RISK-003: Google Places API Kosten
- **Status**: Überwachung
- **Mitigation**: 
  - Quota Limits setzen
  - Caching implementieren
  - Tägliche Kosten tracken
- **Alert bei**: >€5/Tag

### RISK-004: Stripe Connect Approval
- **Status**: Vorbereitung
- **Mitigation**:
  - Früh beantragen (Woche 2)
  - Test-Account nutzen
  - Dokumentation vorbereiten

### RISK-005: App Store Approval
- **Status**: Zukunft (Woche 24)
- **Mitigation**:
  - Guidelines früh studieren
  - TestFlight ab Woche 20
  - Keine In-App Subscriptions

## 🟢 Gelöste Risiken

### ~~RISK-000: Kein Firebase Setup~~
- **Gelöst**: 31.01.2025
- **Lösung**: Story 0.0 erstellt mit Checkliste

## 📊 Risiko-Matrix

```
Wahrscheinlichkeit
    ↓   Niedrig  Mittel   Hoch
Niedrig    🟢      🟢      🟡
Mittel     🟢      🟡      🟠
Hoch       🟡      🟠      🔴
         Impact →
```

## 🚨 Eskalations-Trigger

- Budget >150€/Monat → Sofort Features reduzieren
- Timeline >1 Woche Verzug → Scope anpassen
- Kritischer Bug in Prod → Rollback Plan aktivieren
- API Kosten >€10/Tag → Caching verstärken

## 📝 Wöchentliche Review-Fragen

```markdown
□ Neue Risiken diese Woche?
□ Status-Updates für aktive Risiken?
□ Budget im grünen Bereich?
□ Timeline noch realistisch?
□ Externe Dependencies verfügbar?
```

## 🔄 Update-Log

**31.01.2025**
- Initiales Risk-Tracking erstellt
- 5 Risiken identifiziert
- 2 bereits mitigiert durch Planung