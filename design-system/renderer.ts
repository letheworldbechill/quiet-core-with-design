/**
 * Design System Renderer.
 *
 * Transforms Section definitions into HTML/CSS artifacts.
 *
 * - Deterministic output
 * - No I/O
 * - No side effects
 * - No mutation of input
 *
 * Rendering is a pure function:
 *   PageLayout → RenderedDesignArtifact
 */

import type {
  DeclarationType,
  GridPattern,
  SlotType,
  Section,
  Slot,
  PageLayout,
} from "./types";

/* ---------------------------------------------
 * Rendered artifact model
 * --------------------------------------------- */

export type RenderedDesignArtifact = {
  html: string;
  dataAttributes: Record<string, string>;
};

/* ---------------------------------------------
 * Declaration Rules (visual properties)
 * --------------------------------------------- */

const DECLARATION_RULES: Record<DeclarationType, {
  purpose: string;
  allowedSlots: SlotType[];
  allowedGrids: GridPattern[];
}> = {
  a: {
    purpose: "Focus Opening",
    allowedSlots: ["primary", "secondary"],
    allowedGrids: ["a"],
  },
  b: {
    purpose: "Explanation / Context",
    allowedSlots: ["primary", "secondary", "meta"],
    allowedGrids: ["b", "b-mirror"],
  },
  c: {
    purpose: "Enumeration / Structure",
    allowedSlots: ["secondary", "list", "quote", "meta"],
    allowedGrids: ["b", "b-mirror"],
  },
  d: {
    purpose: "Emphasis / Decision",
    allowedSlots: ["primary"],
    allowedGrids: ["a"],
  },
  e: {
    purpose: "Closure / Context End",
    allowedSlots: ["secondary", "meta"],
    allowedGrids: ["a"],
  },
};

/* ---------------------------------------------
 * Validation
 * --------------------------------------------- */

export type ValidationResult = {
  valid: boolean;
  errors: string[];
};

export function validateSection(section: Section): ValidationResult {
  const rules = DECLARATION_RULES[section.decl];
  const errors: string[] = [];

  // Check grid pattern
  if (!rules.allowedGrids.includes(section.grid)) {
    errors.push(
      `Declaration ${section.decl} does not allow grid "${section.grid}". ` +
      `Allowed: ${rules.allowedGrids.join(", ")}`
    );
  }

  // Check slots
  for (const slot of section.slots) {
    if (!rules.allowedSlots.includes(slot.type)) {
      errors.push(
        `Declaration ${section.decl} does not allow slot type "${slot.type}". ` +
        `Allowed: ${rules.allowedSlots.join(", ")}`
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validatePageLayout(layout: PageLayout): ValidationResult {
  const allErrors: string[] = [];

  // Rule: Declaration D only at ≥5 sections
  const hasDeclD = layout.sections.some(s => s.decl === "d");
  if (hasDeclD && layout.sections.length < 5) {
    allErrors.push(
      `Declaration D (Emphasis) is only allowed when page has ≥5 sections. ` +
      `Current: ${layout.sections.length}`
    );
  }

  // Validate each section
  for (let i = 0; i < layout.sections.length; i++) {
    const result = validateSection(layout.sections[i]);
    if (!result.valid) {
      allErrors.push(...result.errors.map(e => `Section ${i + 1}: ${e}`));
    }
  }

  return {
    valid: allErrors.length === 0,
    errors: allErrors,
  };
}

/* ---------------------------------------------
 * Slot Rendering
 * --------------------------------------------- */

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderSlot(slot: Slot): string {
  const content = escapeHtml(slot.content);
  
  switch (slot.type) {
    case "primary":
      return `<h2 class="slot slot--primary">${content}</h2>`;
    case "secondary":
      return `<p class="slot slot--secondary">${content}</p>`;
    case "meta":
      return `<p class="slot slot--meta">${content}</p>`;
    case "quote":
      return `<blockquote class="slot slot--quote">"${content}"</blockquote>`;
    case "list":
      // List content is comma-separated
      const items = slot.content.split(",").map(i => i.trim());
      const listItems = items.map(i => `<li>${escapeHtml(i)}</li>`).join("\n        ");
      return `<div class="slot slot--list">
      <ul>
        ${listItems}
      </ul>
    </div>`;
  }
}

/* ---------------------------------------------
 * Section Rendering
 * --------------------------------------------- */

function renderSection(section: Section): string {
  const slotsHtml = section.slots.map(renderSlot).join("\n      ");

  return `<section class="section" data-decl="${section.decl}" data-grid="${section.grid}">
    <div class="slot-group">
      ${slotsHtml}
    </div>
  </section>`;
}

/* ---------------------------------------------
 * Page Rendering
 * --------------------------------------------- */

export function renderPageLayout(layout: PageLayout): RenderedDesignArtifact {
  const validation = validatePageLayout(layout);
  if (!validation.valid) {
    throw new Error(
      `Invalid page layout:\n${validation.errors.join("\n")}`
    );
  }

  const sectionsHtml = layout.sections.map(renderSection).join("\n\n  ");

  const html = `<main id="main" class="surface">
  ${sectionsHtml}
</main>`;

  return {
    html,
    dataAttributes: {
      sectionCount: String(layout.sections.length),
    },
  };
}
