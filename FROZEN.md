# 🧊 FROZEN.md

**Status:** Core ist eingefroren.

---

## Was bedeutet "eingefroren"?

Der Core ist die einzige Wahrheitsquelle des Systems.
Er definiert, was gültig ist, was erlaubt ist, und was gerendert wird.

**Nach diesem Zeitpunkt gilt:**

| Aktion | Erlaubt? |
|--------|----------|
| Bugfixes im Core | ✅ Ja |
| Neue Typen hinzufügen | ⚠️ Nur via Migration |
| Bestehende Typen ändern | ❌ Nein |
| Neue Transitions hinzufügen | ⚠️ Breaking Change |
| Validierungsregeln lockern | ❌ Nein |
| Validierungsregeln verschärfen | ⚠️ Breaking Change |

---

## Der Vertrag

### `core/index.ts` ist die einzige erlaubte Import-Quelle

```typescript
// ✅ Erlaubt
import { validateSiteContent } from "../core";

// ❌ Verboten
import { validateSiteContent } from "../core/content.schema";
```

### Builder erzeugt keine Wahrheit

```typescript
// ❌ Verboten
if (pages.length > 0) canPublish = true;

// ✅ Erlaubt
canPublish = canTransition(site.state, "published");
```

### Datenfluss ist unidirektional

```
UI → BuilderState → Core → Artifacts
         ↑            |
         └────────────┘
```

---

## Was darf sich ändern?

| Modul | Änderbar? | Bedingung |
|-------|-----------|-----------|
| `core/` | ❌ | Eingefroren |
| `build/` | ⚠️ | Nur Adapter-Logik |
| `distribution/` | ✅ | Neue Kanäle erlaubt |
| `observability/` | ✅ | Neue Events erlaubt |
| `worker/` | ✅ | Routing-Änderungen |
| `builder/` | ✅ | UI-Änderungen |

---

## Beweise

Tests beweisen Korrektheit:

```bash
npx tsx tests/run.ts
```

| Test | Prüft |
|------|-------|
| `schema.test.ts` | Validierung funktioniert |
| `publishing.test.ts` | State-Machine ist korrekt |
| `renderer.test.ts` | Output ist deterministisch |
| `negative.test.ts` | System lehnt Ungültiges ab |
| `pipeline.test.ts` | Gesamtsystem funktioniert |

---

## Versionierung

Änderungen am Core erfordern:

1. Neue `SemanticVersion`
2. Migration in `migration.engine.ts`
3. Dokumentation in CHANGELOG.md

**Keine stillschweigenden Änderungen.**

---

_Eingefroren am: 2025-01-21_
