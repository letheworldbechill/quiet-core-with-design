/**
 * Design Tokens.
 *
 * Immutable design values.
 * These are the ONLY allowed values in the system.
 *
 * Rules:
 * - No color serves multiple meanings
 * - User cannot configure colors
 * - No decorative color use
 * - Exactly two grid patterns
 */

import type { DesignTokens, ColorToken } from "./types";

/* ---------------------------------------------
 * Frozen Token Values
 * --------------------------------------------- */

export const TOKENS: DesignTokens = {
  colors: {
    "base": "#0B2839",
    "structure": "#10475E",
    "context": "#3D717E",
    "intent": "#D68631",
    "action": "#964405",
    "final": "#5A3211",
    "text-main": "#F3F6F8",
    "text-soft": "#C7D3DB",
    "text-muted": "#A9BAC6",
  },
  spacing: {
    sectionPaddingY: "4rem",
    sectionPaddingX: "3rem",
    sectionGap: "2rem",
    slotGap: "1.5rem",
  },
  typography: {
    lineMax: "75ch",
  },
} as const;

/* ---------------------------------------------
 * CSS Custom Properties Export
 * --------------------------------------------- */

export function tokensToCSSVariables(tokens: DesignTokens): string {
  const colorVars = Object.entries(tokens.colors)
    .map(([key, value]) => `  --${key}: ${value};`)
    .join("\n");

  return `:root {
${colorVars}

  --line-max: ${tokens.typography.lineMax};
  --section-padding-y: ${tokens.spacing.sectionPaddingY};
  --section-padding-x: ${tokens.spacing.sectionPaddingX};
  --section-gap: ${tokens.spacing.sectionGap};
  --slot-gap: ${tokens.spacing.slotGap};
}`;
}

/* ---------------------------------------------
 * Validation
 * --------------------------------------------- */

export function isValidColorToken(token: string): token is ColorToken {
  return token in TOKENS.colors;
}
