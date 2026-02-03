/**
 * Pipeline integration test.
 * Proves the core works as a complete system.
 * Run: npx tsx tests/pipeline.test.ts
 */

import {
  validateSiteContent,
  renderSiteContent,
  createEmptySiteContent,
  canTransition,
  transitionState,
  diffSiteContent,
} from "../core";

/* ---------------------------------------------
 * Create → Validate → Render pipeline
 * --------------------------------------------- */

const validSite = createEmptySiteContent("id", "en", "2024-01-01T00:00:00.000Z");

// Step 1: Validate
validateSiteContent(validSite);
console.log("✅ validation passed");

// Step 2: Render
const artifacts = renderSiteContent(validSite);
if (artifacts.length === 0) {
  throw new Error("No artifacts rendered");
}
console.log("✅ rendering passed");

/* ---------------------------------------------
 * State transition pipeline
 * --------------------------------------------- */

// draft → review → published → archived
if (!canTransition(validSite.state, "review")) {
  throw new Error("Cannot transition to review");
}

const reviewState = transitionState(validSite.state, "review");
const reviewSite = { ...validSite, state: reviewState };

const publishedState = transitionState(reviewSite.state, "published");
const publishedSite = { ...reviewSite, state: publishedState };

const archivedState = transitionState(publishedSite.state, "archived");
const archivedSite = { ...publishedSite, state: archivedState };

if (archivedSite.state !== "archived") {
  throw new Error("Full lifecycle failed");
}

console.log("✅ state lifecycle passed");

/* ---------------------------------------------
 * Diff pipeline
 * --------------------------------------------- */

const diffs = diffSiteContent(validSite, archivedSite);
const stateChange = diffs.find((d) => d.field === "state");

if (!stateChange || stateChange.before !== "draft" || stateChange.after !== "archived") {
  throw new Error("Diff did not detect state change");
}

console.log("✅ diff detection passed");

/* ---------------------------------------------
 * Summary
 * --------------------------------------------- */

console.log("\n🧊 core pipeline test passed");
console.log("   - create ✓");
console.log("   - validate ✓");
console.log("   - render ✓");
console.log("   - transition ✓");
console.log("   - diff ✓");
