/**
 * CSS Generator.
 *
 * Generates complete CSS from design tokens.
 * Output is deterministic and complete.
 *
 * - No external dependencies
 * - No I/O
 * - Pure function
 */

import { TOKENS, tokensToCSSVariables } from "./tokens";

/* ---------------------------------------------
 * CSS Components
 * --------------------------------------------- */

const RESET_CSS = `*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
}

body {
  min-height: 100vh;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

ul, ol {
  list-style: none;
}

a {
  color: inherit;
  text-decoration: none;
}`;

const BASE_CSS = `body {
  background: var(--base);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: var(--text-main);
}`;

const LAYOUT_CSS = `.surface {
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
}

.section {
  background: var(--structure);
  padding: var(--section-padding-y) var(--section-padding-x);
}

[data-grid="a"] {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--section-gap);
}

[data-grid="b"] {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: start;
  gap: var(--section-gap);
}

[data-grid="b-mirror"] {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: start;
  gap: var(--section-gap);
  direction: rtl;
}

[data-grid="b-mirror"] > * {
  direction: ltr;
}

[data-decl="a"] {
  padding-top: calc(var(--section-padding-y) * 1.5);
  padding-bottom: calc(var(--section-padding-y) * 1.5);
}

[data-decl="d"] {
  background: var(--context);
  padding-top: calc(var(--section-padding-y) * 1.25);
  padding-bottom: calc(var(--section-padding-y) * 1.25);
}

@media (max-width: 900px) {
  [data-grid="b"],
  [data-grid="b-mirror"] {
    grid-template-columns: 1fr;
    direction: ltr;
  }
}`;

const TYPOGRAPHY_CSS = `.slot--primary {
  font-size: 2.1rem;
  font-weight: 500;
  line-height: 1.25;
  letter-spacing: -0.01em;
}

.slot--secondary {
  font-size: 1.15rem;
  font-weight: 400;
  line-height: 1.6;
  color: var(--text-soft);
}

.slot--meta {
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--text-muted);
}

.slot--list {
  font-size: 1rem;
  line-height: 1.45;
}

.slot--quote {
  font-size: 1.2rem;
  font-style: italic;
  line-height: 1.5;
}`;

const COMPONENTS_CSS = `.slot {
  max-width: var(--line-max);
}

.slot-group {
  display: flex;
  flex-direction: column;
  gap: var(--slot-gap);
}

.skip-link {
  position: absolute;
  top: -100px;
  left: 0;
  background: var(--action);
  color: var(--text-main);
  padding: 1rem;
  z-index: 1000;
}

.skip-link:focus {
  top: 0;
}

:focus-visible {
  outline: 3px solid var(--intent);
  outline-offset: 2px;
}

.action {
  display: inline-block;
  background: var(--action);
  color: var(--text-main);
  padding: 1rem 1.5rem;
  min-height: 44px;
  margin-top: 1.25rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
}

.action:hover {
  background: var(--final);
  text-decoration: underline;
}

.slot--list ul {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.slot--list li {
  position: relative;
  padding-left: 1.25rem;
}

.slot--list li::before {
  content: "—";
  position: absolute;
  left: 0;
  color: var(--intent);
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}`;

/* ---------------------------------------------
 * Public API
 * --------------------------------------------- */

export function generateCSS(): string {
  const tokens = tokensToCSSVariables(TOKENS);

  return `/* Design System CSS - Generated */
/* DO NOT EDIT MANUALLY */

/* Tokens */
${tokens}

/* Reset */
${RESET_CSS}

/* Base */
${BASE_CSS}

/* Layout */
${LAYOUT_CSS}

/* Typography */
${TYPOGRAPHY_CSS}

/* Components */
${COMPONENTS_CSS}`;
}
