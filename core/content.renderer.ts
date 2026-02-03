/**
 * Content renderer.
 *
 * This file transforms validated SiteContent into static artifacts.
 *
 * - Deterministic output
 * - No I/O
 * - No filesystem access
 * - No side effects
 * - No mutation of input
 *
 * Rendering is a pure function:
 *   SiteContent → RenderedArtifact[]
 */

import { SiteContent, Page } from "./types";

/* ---------------------------------------------
 * Rendered artifact model
 * --------------------------------------------- */

export type RenderedArtifact = {
  path: string;
  content: string;
};

/* ---------------------------------------------
 * Internal helpers
 * --------------------------------------------- */

function renderHtmlDocument(
  locale: string,
  title: string,
  description: string,
  noindex: boolean | undefined,
  body: string
): string {
  return `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  ${noindex ? `<meta name="robots" content="noindex" />` : ""}
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body>
${body}
</body>
</html>`;
}

function renderPageBody(page: Page): string {
  return `<main>
  <h1>${escapeHtml(page.title)}</h1>
  ${page.body}
</main>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function pagePathFromSlug(slug: string): string {
  return slug === "home" ? "index.html" : `${slug}.html`;
}

/* ---------------------------------------------
 * Public rendering API
 * --------------------------------------------- */

/**
 * Renders a SiteContent object into static HTML artifacts.
 *
 * The input MUST already be validated.
 * This function does not perform validation.
 */
export function renderSiteContent(
  content: SiteContent
): RenderedArtifact[] {
  return content.pages.map((page) => {
    const html = renderHtmlDocument(
      content.locale,
      page.title,
      content.seo.description,
      content.seo.noindex,
      renderPageBody(page)
    );
    return {
      path: pagePathFromSlug(page.slug),
      content: html,
    };
  });
}
