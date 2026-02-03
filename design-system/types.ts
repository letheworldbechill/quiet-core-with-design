/**
 * Design System Types.
 *
 * This file defines the visual vocabulary of the system.
 * It contains NO logic, NO defaults, NO side effects.
 *
 * Types align with core/types.ts patterns.
 * Changing this file requires version bump.
 */

/* ---------------------------------------------
 * Declaration Types (internal, not exposed in UI)
 * --------------------------------------------- */

export type DeclarationType =
  | "a"   // Focus Opening
  | "b"   // Explanation / Context
  | "c"   // Enumeration / Structure
  | "d"   // Emphasis / Decision
  | "e"; // Closure / Context End

/* ---------------------------------------------
 * Grid Patterns (exactly 2 + mirror)
 * --------------------------------------------- */

export type GridPattern =
  | "a"         // Centered
  | "b"         // Two-column
  | "b-mirror"; // Two-column mirrored

/* ---------------------------------------------
 * Slot Types (typography roles)
 * --------------------------------------------- */

export type SlotType =
  | "primary"
  | "secondary"
  | "meta"
  | "list"
  | "quote";

/* ---------------------------------------------
 * Color Tokens (semantic, not decorative)
 * --------------------------------------------- */

export type ColorToken =
  | "base"
  | "structure"
  | "context"
  | "intent"
  | "action"
  | "final"
  | "text-main"
  | "text-soft"
  | "text-muted";

/* ---------------------------------------------
 * Section Definition
 * --------------------------------------------- */

export type Section = {
  decl: DeclarationType;
  grid: GridPattern;
  slots: Slot[];
};

export type Slot = {
  type: SlotType;
  content: string;
};

/* ---------------------------------------------
 * Page Layout
 * --------------------------------------------- */

export type PageLayout = {
  sections: Section[];
};

/* ---------------------------------------------
 * Design Tokens (immutable values)
 * --------------------------------------------- */

export type DesignTokens = {
  colors: Record<ColorToken, string>;
  spacing: {
    sectionPaddingY: string;
    sectionPaddingX: string;
    sectionGap: string;
    slotGap: string;
  };
  typography: {
    lineMax: string;
  };
};
