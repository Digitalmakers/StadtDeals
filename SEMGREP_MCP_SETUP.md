# Semgrep MCP Server Installation

## Installation abgeschlossen ✅

Der Semgrep MCP Server wurde erfolgreich installiert und konfiguriert.

### Was wurde installiert:

1. **Homebrew** - Paketmanager für macOS
2. **Python 3.11** - Neuere Python-Version (benötigt für Semgrep MCP)
3. **Semgrep MCP Server** - Der eigentliche MCP Server
4. **Cursor Konfiguration** - MCP Server ist in Cursor konfiguriert

### Konfiguration:

Die MCP-Konfiguration wurde in `~/.cursor/mcp.json` erstellt:

```json
{
  "mcpServers": {
    "semgrep": {
      "command": "semgrep-mcp",
      "args": []
    }
  }
}
```

### Verwendung:

#### In Cursor:
- Der Semgrep MCP Server ist jetzt in Cursor verfügbar
- Du kannst Sicherheitsanalysen direkt in deinem Code durchführen
- Der Server läuft im stdio-Modus (Standard)

#### Kommandozeile:
```bash
# Direkter Scan einer Datei
semgrep scan --config=auto your_file.py

# Scan mit spezifischen Regeln
semgrep scan --config="p/security-audit" your_file.py

# Scan des gesamten Projekts
semgrep scan --config=auto .
```

### Verfügbare Regelpakete:

- `auto` - Automatische Regelauswahl (Standard)
- `p/security-audit` - Sicherheitsaudit-Regeln
- `p/secrets` - Geheimnis-Erkennung
- `p/owasp-top-ten` - OWASP Top 10 Sicherheitsprobleme

### Nächste Schritte:

1. **Cursor neu starten** - Starte Cursor neu, damit die MCP-Konfiguration aktiv wird
2. **Testen** - Teste die Sicherheitsanalyse in deinem React Native Projekt
3. **Registrierung** (optional) - Erstelle ein kostenloses Konto bei Semgrep für erweiterte Regeln: `semgrep login`

### Troubleshooting:

Falls der MCP Server nicht funktioniert:

1. Überprüfe die Python-Version: `python3.11 --version`
2. Teste Semgrep direkt: `semgrep-mcp --help`
3. Überprüfe die Cursor-Konfiguration: `cat ~/.cursor/mcp.json`

### Nützliche Links:

- [Semgrep MCP GitHub Repository](https://github.com/semgrep/mcp)
- [Semgrep Dokumentation](https://semgrep.dev/docs/)
- [MCP Protokoll](https://modelcontextprotocol.io/) 