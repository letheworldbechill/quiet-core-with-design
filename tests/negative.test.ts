/**
 * Negative tests.
 * Proves the system correctly rejects invalid operations.
 * Run: npx tsx tests/negative.test.ts
 */

import { transitionState, validateSiteContent } from "../core";

/* ---------------------------------------------
 * Invalid state transition
 * --------------------------------------------- */

try {
  transitionState("draft", "archived");
  throw new Error("Invalid transition did not throw");
} catch (e) {
  if (e instanceof Error && e.message === "Invalid transition did not throw") {
    throw e;
  }
  console.log("✅ invalid transition correctly rejected");
}

try {
  transitionState("draft", "published");
  throw new Error("Invalid transition did not throw");
} catch (e) {
  if (e instanceof Error && e.message === "Invalid transition did not throw") {
    throw e;
  }
  console.log("✅ draft → published correctly rejected");
}

try {
  transitionState("archived", "draft");
  throw new Error("Invalid transition did not throw");
} catch (e) {
  if (e instanceof Error && e.message === "Invalid transition did not throw") {
    throw e;
  }
  console.log("✅ archived → draft correctly rejected");
}

/* ---------------------------------------------
 * Invalid content validation
 * --------------------------------------------- */

try {
  validateSiteContent(null);
  throw new Error("Null content should be rejected");
} catch (e) {
  if (e instanceof Error && e.message === "Null content should be rejected") {
    throw e;
  }
  console.log("✅ null content correctly rejected");
}

try {
  validateSiteContent({ id: "" });
  throw new Error("Empty id should be rejected");
} catch (e) {
  if (e instanceof Error && e.message === "Empty id should be rejected") {
    throw e;
  }
  console.log("✅ empty id correctly rejected");
}

try {
  validateSiteContent({
    id: "test",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    version: { major: 1, minor: 0, patch: 0 },
    locale: "en",
    pages: [],
    seo: { title: "Test", description: "Test" },
    state: "draft",
  });
  throw new Error("Empty pages should be rejected");
} catch (e) {
  if (e instanceof Error && e.message === "Empty pages should be rejected") {
    throw e;
  }
  console.log("✅ empty pages correctly rejected");
}

try {
  validateSiteContent({
    id: "test",
    createdAt: "invalid-date",
    updatedAt: "2024-01-01T00:00:00.000Z",
    version: { major: 1, minor: 0, patch: 0 },
    locale: "en",
    pages: [{ slug: "home", title: "Home", body: "" }],
    seo: { title: "Test", description: "Test" },
    state: "draft",
  });
  throw new Error("Invalid date should be rejected");
} catch (e) {
  if (e instanceof Error && e.message === "Invalid date should be rejected") {
    throw e;
  }
  console.log("✅ invalid date correctly rejected");
}

console.log("\n✅ all negative tests passed");
