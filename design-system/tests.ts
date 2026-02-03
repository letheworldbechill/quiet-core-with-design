/**
 * Design System Tests.
 *
 * Validates:
 * - Token integrity
 * - Validation rules
 * - Renderer determinism
 * - CSS generation
 */

import {
  TOKENS,
  generateCSS,
  renderPageLayout,
  validatePageLayout,
  validateSection,
} from "./index";
import type { Section, PageLayout } from "./types";

/* ---------------------------------------------
 * Test utilities
 * --------------------------------------------- */

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`FAIL: ${message}`);
  }
}

function assertThrows(fn: () => void, message: string): void {
  try {
    fn();
    throw new Error(`FAIL: Expected error but got none - ${message}`);
  } catch (e) {
    if ((e as Error).message.startsWith("FAIL:")) throw e;
    // Expected error
  }
}

/* ---------------------------------------------
 * Token Tests
 * --------------------------------------------- */

function testTokensExist(): void {
  assert(TOKENS.colors["base"] === "#0B2839", "Base color correct");
  assert(TOKENS.colors["text-main"] === "#F3F6F8", "Text main color correct");
  assert(TOKENS.spacing.sectionGap === "2rem", "Section gap correct");
  assert(TOKENS.typography.lineMax === "75ch", "Line max correct");
  console.log("✓ Tokens exist and are correct");
}

/* ---------------------------------------------
 * Validation Tests
 * --------------------------------------------- */

function testValidSection(): void {
  const section: Section = {
    decl: "a",
    grid: "a",
    slots: [{ type: "primary", content: "Test" }],
  };
  const result = validateSection(section);
  assert(result.valid, "Valid section should pass");
  console.log("✓ Valid section passes validation");
}

function testInvalidGridForDeclaration(): void {
  const section: Section = {
    decl: "a",
    grid: "b", // Invalid: decl 'a' only allows grid 'a'
    slots: [{ type: "primary", content: "Test" }],
  };
  const result = validateSection(section);
  assert(!result.valid, "Invalid grid should fail");
  assert(result.errors.length > 0, "Should have error message");
  console.log("✓ Invalid grid rejected");
}

function testInvalidSlotForDeclaration(): void {
  const section: Section = {
    decl: "d",
    grid: "a",
    slots: [{ type: "list", content: "Test" }], // Invalid: decl 'd' only allows 'primary'
  };
  const result = validateSection(section);
  assert(!result.valid, "Invalid slot should fail");
  console.log("✓ Invalid slot rejected");
}

function testDeclDRequiresFiveSections(): void {
  const layout: PageLayout = {
    sections: [
      { decl: "a", grid: "a", slots: [{ type: "primary", content: "1" }] },
      { decl: "d", grid: "a", slots: [{ type: "primary", content: "2" }] },
    ],
  };
  const result = validatePageLayout(layout);
  assert(!result.valid, "Decl D with <5 sections should fail");
  assert(
    result.errors.some(e => e.includes("≥5 sections")),
    "Error should mention 5 sections rule"
  );
  console.log("✓ Declaration D requires ≥5 sections");
}

/* ---------------------------------------------
 * Renderer Tests
 * --------------------------------------------- */

function testRenderValidLayout(): void {
  const layout: PageLayout = {
    sections: [
      { decl: "a", grid: "a", slots: [{ type: "primary", content: "Hello" }] },
      { decl: "b", grid: "b", slots: [{ type: "secondary", content: "World" }] },
    ],
  };
  const artifact = renderPageLayout(layout);
  assert(artifact.html.includes('data-decl="a"'), "Contains decl attribute");
  assert(artifact.html.includes('data-grid="b"'), "Contains grid attribute");
  assert(artifact.html.includes("Hello"), "Contains content");
  console.log("✓ Render produces valid HTML");
}

function testRenderRejectsInvalid(): void {
  const layout: PageLayout = {
    sections: [
      { decl: "a", grid: "b", slots: [] }, // Invalid
    ],
  };
  assertThrows(() => renderPageLayout(layout), "Should reject invalid layout");
  console.log("✓ Renderer rejects invalid layout");
}

function testRenderIsDeterministic(): void {
  const layout: PageLayout = {
    sections: [
      { decl: "a", grid: "a", slots: [{ type: "primary", content: "Test" }] },
    ],
  };
  const result1 = renderPageLayout(layout);
  const result2 = renderPageLayout(layout);
  assert(result1.html === result2.html, "Same input produces same output");
  console.log("✓ Renderer is deterministic");
}

/* ---------------------------------------------
 * CSS Generation Tests
 * --------------------------------------------- */

function testCSSGeneration(): void {
  const css = generateCSS();
  assert(css.includes("--base:"), "Contains color tokens");
  assert(css.includes("--section-gap:"), "Contains spacing tokens");
  assert(css.includes('[data-grid="a"]'), "Contains grid rules");
  assert(css.includes('[data-decl="d"]'), "Contains declaration rules");
  assert(css.includes("prefers-reduced-motion"), "Contains a11y rules");
  console.log("✓ CSS generation complete");
}

function testCSSIsDeterministic(): void {
  const css1 = generateCSS();
  const css2 = generateCSS();
  assert(css1 === css2, "Same output every time");
  console.log("✓ CSS generation is deterministic");
}

/* ---------------------------------------------
 * Run all tests
 * --------------------------------------------- */

export function runDesignSystemTests(): void {
  console.log("\n=== Design System Tests ===\n");

  // Token tests
  testTokensExist();

  // Validation tests
  testValidSection();
  testInvalidGridForDeclaration();
  testInvalidSlotForDeclaration();
  testDeclDRequiresFiveSections();

  // Renderer tests
  testRenderValidLayout();
  testRenderRejectsInvalid();
  testRenderIsDeterministic();

  // CSS tests
  testCSSGeneration();
  testCSSIsDeterministic();

  console.log("\n=== All Tests Passed ===\n");
}

// Run if executed directly
runDesignSystemTests();
