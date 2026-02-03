/**
 * Renderer and determinism test.
 * Run: npx tsx tests/renderer.test.ts
 */

import { renderSiteContent, createEmptySiteContent } from "../core";

const site = createEmptySiteContent(
  "test-id",
  "en",
  "2024-01-01T00:00:00.000Z"
);

/* ---------------------------------------------
 * Basic rendering
 * --------------------------------------------- */

const artifacts = renderSiteContent(site);

if (artifacts.length === 0) {
  throw new Error("Renderer returned no artifacts");
}

if (!artifacts[0].content.includes("<!DOCTYPE html>")) {
  throw new Error("Invalid HTML output");
}

if (!artifacts[0].content.includes('lang="en"')) {
  throw new Error("Locale not rendered");
}

if (artifacts[0].path !== "index.html") {
  throw new Error("Home page should render as index.html");
}

console.log("✅ renderer test passed");

/* ---------------------------------------------
 * Determinism test
 * --------------------------------------------- */

const a = renderSiteContent(site);
const b = renderSiteContent(site);

if (JSON.stringify(a) !== JSON.stringify(b)) {
  throw new Error("Renderer is not deterministic");
}

console.log("✅ determinism test passed");
