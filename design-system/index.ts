/**
 * Design System Public API.
 *
 * This file defines the hard boundary of the design system.
 * All external consumers MUST import exclusively from this module.
 *
 * DESIGN SYSTEM INVARIANTS
 *
 * - Exactly 2 grid patterns (a, b + mirror)
 * - Exactly 5 declaration types (a-e)
 * - Exactly 5 slot types
 * - No decorative colors
 * - No user configuration
 * - Deterministic output
 */

/* ---------------------------------------------
 * Domain types
 * --------------------------------------------- */

export type {
  DeclarationType,
  GridPattern,
  SlotType,
  ColorToken,
  Section,
  Slot,
  PageLayout,
  DesignTokens,
} from "./types";

/* ---------------------------------------------
 * Tokens
 * --------------------------------------------- */

export {
  TOKENS,
  tokensToCSSVariables,
  isValidColorToken,
} from "./tokens";

/* ---------------------------------------------
 * Rendering
 * --------------------------------------------- */

export {
  renderPageLayout,
  validateSection,
  validatePageLayout,
  type RenderedDesignArtifact,
  type ValidationResult,
} from "./renderer";

/* ---------------------------------------------
 * CSS Generation
 * --------------------------------------------- */

export { generateCSS } from "./css.generator";
