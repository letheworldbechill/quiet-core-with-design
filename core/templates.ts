/**
 * Content templates.
 *
 * This file provides optional starting structures for SiteContent.
 *
 * - Templates are NOT defaults
 * - Templates do NOT enforce usage
 * - Templates do NOT contain logic
 * - Templates do NOT create truth
 *
 * They are convenience helpers only.
 */

import { Page, SiteContent, SemanticVersion } from "./types";

/* ---------------------------------------------
 * Version helper
 * --------------------------------------------- */

function initialVersion(): SemanticVersion {
  return {
    major: 1,
    minor: 0,
    patch: 0,
  };
}

/* ---------------------------------------------
 * Page templates
 * --------------------------------------------- */

export function createHomePage(): Page {
  return {
    slug: "home",
    title: "Home",
    body: "",
  };
}

export function createContactPage(): Page {
  return {
    slug: "contact",
    title: "Contact",
    body: "",
  };
}

/* ---------------------------------------------
 * Site templates
 * --------------------------------------------- */

/**
 * Creates a minimal SiteContent structure.
 *
 * Returns a valid, immediately usable structure.
 * SEO fields contain placeholder values that satisfy validation.
 */
export function createEmptySiteContent(
  id: string,
  locale: "pt-BR" | "en",
  createdAt: string
): SiteContent {
  return {
    id,
    createdAt,
    updatedAt: createdAt,
    version: initialVersion(),
    locale,
    pages: [createHomePage()],
    seo: {
      title: "Untitled",
      description: "No description",
    },
    state: "draft",
  };
}
