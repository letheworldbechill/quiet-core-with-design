# STRUCTURE.md

Aktuelle Projektstruktur.

```
quiet-core-with-design/
│
├── FROZEN.md                 (Core-Vertrag)
├── STRUCTURE.md              (Diese Datei)
│
├── core/                     (🧊 EINGEFROREN)
│   ├── README_CORE.md
│   ├── index.ts              (Einziger Vertrag)
│   └── ...
│
├── design-system/            (🧊 EINGEFROREN)
│   ├── README.md
│   ├── index.ts              (Einziger Vertrag)
│   ├── types.ts              (Visuelle Vokabular)
│   ├── tokens.ts             (Immutable Design Tokens)
│   ├── renderer.ts           (Pure Rendering)
│   ├── css.generator.ts      (CSS Output)
│   └── tests.ts              (Beweise)
│
├── build/                    (Build-Pipeline)
│   └── ...
│
├── distribution/             (Share-Logik)
│   └── ...
│
├── observability/            (Events/Metrics)
│   └── ...
│
├── worker/                   (Edge Runtime)
│   └── index.ts
│
├── builder/                  (UI Client)
│   ├── core.ts               (Goldener Import)
│   ├── projetoStore.ts       (UI State)
│   ├── App.tsx
│   │
│   ├── screens/
│   │   ├── Content.tsx
│   │   ├── Design.tsx
│   │   └── Publish.tsx
│   │
│   └── components/
│       ├── MediaPlaceholder.tsx
│       └── SharePlaceholder.tsx
│
├── dist/                     (Generierte Artefakte)
│   ├── index.html            (später)
│   ├── images/               (leer - R2 Platzhalter)
│   ├── qr/                   (leer - QR Platzhalter)
│   └── og/                   (leer - OpenGraph Platzhalter)
│
└── tests/
    └── ...
```

## Design System

Das Design System definiert die visuelle Sprache:

| Konzept | Anzahl | Status |
|---------|--------|--------|
| Deklarationstypen | 5 (a-e) | 🧊 |
| Grid-Muster | 2 (+mirror) | 🧊 |
| Slot-Typen | 5 | 🧊 |
| Farb-Tokens | 9 | 🧊 |

## Datenfluss

```
UI → BuilderState → Core → Content
         ↓            ↓
   Design System → Visual Structure
         ↓
    Final HTML/CSS
```

## Regeln

1. Builder importiert nur via `builder/core.ts`
2. Builder importiert Design via `design-system/index.ts`
3. Builder erzeugt keine Wahrheit
4. Core ist eingefroren
5. Design System ist eingefroren
6. Platzhalter haben keine Funktion
