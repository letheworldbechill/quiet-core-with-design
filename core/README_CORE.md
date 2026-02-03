# Core Contract

The core module is the single source of truth.

## The builder MAY:

- call core functions
- display core errors
- store temporary UI state

## The builder may NOT:

- implement validation rules
- decide publishability
- generate artifacts independently
- modify core data structures

## Import rule

```typescript
// ✅ Allowed
import { validateSiteContent } from "../core";

// ❌ Forbidden
import { validateSiteContent } from "../core/content.schema";
```

## Consequence

If the builder violates this contract, it is considered a bug.
