/**
 * Publishing state machine test.
 * Run: npx tsx tests/publishing.test.ts
 */

import { canTransition, transitionState } from "../core";

/* ---------------------------------------------
 * Allowed transitions
 * --------------------------------------------- */

if (!canTransition("draft", "review")) {
  throw new Error("draft → review should be allowed");
}

if (!canTransition("review", "draft")) {
  throw new Error("review → draft should be allowed");
}

if (!canTransition("review", "published")) {
  throw new Error("review → published should be allowed");
}

if (!canTransition("published", "archived")) {
  throw new Error("published → archived should be allowed");
}

/* ---------------------------------------------
 * Forbidden transitions
 * --------------------------------------------- */

if (canTransition("draft", "published")) {
  throw new Error("draft → published should be forbidden");
}

if (canTransition("archived", "draft")) {
  throw new Error("archived → draft should be forbidden");
}

/* ---------------------------------------------
 * Transition execution
 * --------------------------------------------- */

const result = transitionState("draft", "review");
if (result !== "review") {
  throw new Error("transitionState should return target state");
}

/* ---------------------------------------------
 * Invalid transition throws
 * --------------------------------------------- */

try {
  transitionState("draft", "published");
  throw new Error("Invalid transition should throw");
} catch (e) {
  if (!(e instanceof Error) || !e.message.includes("Invalid")) {
    throw new Error("Wrong error type for invalid transition");
  }
}

console.log("✅ publishing test passed");
