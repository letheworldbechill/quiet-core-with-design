/**
 * Schema validation test.
 * Run: npx tsx tests/schema.test.ts
 */

import { validateSiteContent, createEmptySiteContent } from "../core";

const site = createEmptySiteContent(
  "test-id",
  "pt-BR",
  "2024-01-01T00:00:00.000Z"
);

try {
  validateSiteContent(site);
  console.log("✅ schema test passed");
} catch (e) {
  console.error("❌ schema test failed", e);
  process.exit(1);
}
