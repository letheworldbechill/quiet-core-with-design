# Zukünftige Verbesserungen

## Selbstkritische Analyse - Durchgeführt am 2025-02-03

### Behobene Probleme ✅

| Problem | Lösung |
|---------|--------|
| Fehlende TypeScript-Typen (@types/node, workers-types) | Abhängigkeiten hinzugefügt |
| React `key={index}` Anti-Pattern | Geändert zu `key={slug-index}` |
| Kein LocalStorage - State verloren bei Refresh | Auto-Save implementiert |
| Hardcoded Locale | Locale-Selector hinzugefügt |
| Generiertes HTML ohne CSS | CSS wird nun injiziert |
| Keine Live-Vorschau | iframe-Preview implementiert |
| Multiple Downloads geblockt | Bundle-Download als Alternative |
| Design Screen war Platzhalter | Token-Visualisierung hinzugefügt |

---

## Offene Verbesserungen 🚧

### Hohe Priorität

1. **Echte ZIP-Generierung**
   - JSZip-Library integrieren
   - Einzelne Dateien: index.html, styles.css, weitere Seiten
   - Ermöglicht direktes Deployment

2. **Bildupload**
   - MediaPlaceholder mit echtem Upload ersetzen
   - Base64 oder Blob-URLs für lokale Vorschau
   - Export als Data-URLs oder separate Dateien

3. **Design System Integration**
   - PageLayout aus design-system im Builder verwenden
   - Sections/Slots visuell editierbar machen
   - Declaration-Type-Auswahl pro Section

4. **Validierung während der Eingabe**
   - Real-time Feedback bei ungültigen Werten
   - Slug-Format validieren (keine Sonderzeichen)
   - SEO-Längenempfehlungen anzeigen

### Mittlere Priorität

5. **Import/Export JSON**
   - Projekt als JSON exportieren
   - JSON-Datei importieren
   - Backup/Restore Funktion

6. **Mehrsprachigkeit UI**
   - Builder-Interface in DE/EN
   - i18n-System einführen
   - Konsistent mit Locale des Contents

7. **Markdown-Support**
   - Body als Markdown statt HTML
   - Live-Preview mit Markdown-Renderer
   - Optional: WYSIWYG-Editor

8. **Responsive Preview**
   - Mobile/Tablet/Desktop Vorschau
   - Viewport-Größe einstellbar

### Niedrige Priorität

9. **Undo/Redo**
   - History-Stack für Änderungen
   - Tastenkürzel Ctrl+Z/Ctrl+Y

10. **Themes/Varianten**
    - Alternative Farbpaletten (ohne Core zu ändern)
    - Dark/Light Mode Toggle

11. **PWA-Support**
    - Service Worker für Offline-Nutzung
    - Install-Prompt

12. **Analytics-Integration**
    - Observability-Events im Builder visualisieren
    - Build-Metriken anzeigen

---

## Architektur-Schulden 🏗️

### Code-Qualität

- [ ] ESLint + Prettier konfigurieren
- [ ] Husky Pre-Commit Hooks
- [ ] Unit-Tests für Builder-Komponenten
- [ ] E2E-Tests mit Playwright/Cypress
- [ ] Storybook für UI-Komponenten

### Build-Pipeline

- [ ] Dependabot für Dependency-Updates
- [ ] Bundle-Size Monitoring
- [ ] Lighthouse CI Integration
- [ ] Semantic Versioning automatisieren

### Dokumentation

- [ ] JSDoc-Kommentare für alle Exports
- [ ] README mit Screenshots
- [ ] Contributing Guide
- [ ] API-Dokumentation generieren

---

## Design-Entscheidungen zur Überprüfung 🤔

1. **Locale nur en/pt-BR**
   - Sollte "de" hinzugefügt werden?
   - Core-Änderung erforderlich (Breaking Change)

2. **Publishing State Machine**
   - Fehlt: `published → draft` für Korrekturen?
   - Aktuell: Archiviert ist terminal

3. **SEO noindex Default**
   - Template setzt kein noindex
   - Sollte Draft automatisch noindex sein?

4. **Page Body als HTML**
   - Sicherheitsrisiko: XSS bei User-Input
   - Alternativen: Sanitization, Markdown-Only

---

## Performance-Optimierungen ⚡

- [ ] React.memo für häufig gerenderte Komponenten
- [ ] useMemo für teure Berechnungen (generateCSS)
- [ ] Code-Splitting für Design-System
- [ ] Lazy Loading für große JSON-Vorschau
