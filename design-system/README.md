# Design System

**Status:** Frozen alongside core.

---

## What is frozen?

| Item | Frozen? |
|------|---------|
| Color tokens | ✅ Yes |
| Grid patterns (2) | ✅ Yes |
| Declaration types (5) | ✅ Yes |
| Slot types (5) | ✅ Yes |
| Typography scale | ✅ Yes |
| Spacing tokens | ✅ Yes |

---

## Declaration Types

Types are system-internal. No names appear in UI.
Differentiation is purely visual.

| Type | Purpose | Allowed Grids |
|------|---------|---------------|
| `a` | Focus Opening | `a` |
| `b` | Explanation | `b`, `b-mirror` |
| `c` | Enumeration | `b`, `b-mirror` |
| `d` | Emphasis | `a` (only ≥5 sections) |
| `e` | Closure | `a` |

---

## Grid Patterns

Exactly 2 patterns + mirror:

| Pattern | Layout |
|---------|--------|
| `a` | Centered |
| `b` | Two-column |
| `b-mirror` | Two-column mirrored |

---

## Usage

```typescript
import {
  TOKENS,
  generateCSS,
  renderPageLayout,
  validatePageLayout,
} from "../design-system";

// Generate complete CSS
const css = generateCSS();

// Validate layout
const result = validatePageLayout(layout);
if (!result.valid) {
  console.error(result.errors);
}

// Render to HTML
const artifact = renderPageLayout(layout);
```

---

## Integration with Core

The design system integrates with `core/content.renderer.ts`:

```
SiteContent → Core Renderer → Page Content
                    ↓
            Design System → Visual Structure
                    ↓
              Final HTML
```

---

## Rules

1. No color serves multiple meanings
2. User cannot configure visual tokens
3. No decorative color use
4. Exactly 2 grid patterns
5. Declaration D only at ≥5 sections
6. All validation is explicit

---

_Frozen alongside core: 2025-01-21_
