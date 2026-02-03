/**
 * Content schema and validation.
 *
 * This file defines the formal validity rules for SiteContent.
 *
 * - No external libraries
 * - No defaults
 * - No mutation
 * - No rendering
 * - Explicit errors
 *
 * Validation is structural and semantic.
 */

import {
  SiteContent,
  SemanticVersion,
  ContentState,
  Locale,
  Page,
  SeoMetadata,
} from "./types";

/* ---------------------------------------------
 * Error model
 * --------------------------------------------- */

export class ContentValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ContentValidationError";
  }
}

/* ---------------------------------------------
 * Primitive validators
 * --------------------------------------------- */

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isIsoDateString(value: unknown): value is string {
  return typeof value === "string" && !Number.isNaN(Date.parse(value));
}

/* ---------------------------------------------
 * Semantic version validation
 * --------------------------------------------- */

function validateSemanticVersion(
  version: unknown
): asserts version is SemanticVersion {
  if (typeof version !== "object" || version === null) {
    throw new ContentValidationError("Version must be an object");
  }

  const v = version as SemanticVersion;

  if (
    !Number.isInteger(v.major) ||
    !Number.isInteger(v.minor) ||
    !Number.isInteger(v.patch) ||
    v.major < 0 ||
    v.minor < 0 ||
    v.patch < 0
  ) {
    throw new ContentValidationError(
      "Version must contain non-negative integers (major, minor, patch)"
    );
  }
}

/* ---------------------------------------------
 * Enum validation
 * --------------------------------------------- */

function validateLocale(value: unknown): asserts value is Locale {
  if (value !== "pt-BR" && value !== "en") {
    throw new ContentValidationError("Locale must be 'pt-BR' or 'en'");
  }
}

function validateContentState(
  value: unknown
): asserts value is ContentState {
  const allowed: ContentState[] = [
    "draft",
    "review",
    "published",
    "archived",
  ];

  if (!allowed.includes(value as ContentState)) {
    throw new ContentValidationError(
      `Invalid content state: ${String(value)}`
    );
  }
}

/* ---------------------------------------------
 * Page validation
 * --------------------------------------------- */

function validatePage(page: unknown): asserts page is Page {
  if (typeof page !== "object" || page === null) {
    throw new ContentValidationError("Page must be an object");
  }

  const p = page as Page;

  if (!isNonEmptyString(p.slug)) {
    throw new ContentValidationError("Page slug must be a non-empty string");
  }

  if (!isNonEmptyString(p.title)) {
    throw new ContentValidationError("Page title must be a non-empty string");
  }

  if (typeof p.body !== "string") {
    throw new ContentValidationError("Page body must be a string");
  }
}

/* ---------------------------------------------
 * SEO validation
 * --------------------------------------------- */

function validateSeoMetadata(seo: unknown): asserts seo is SeoMetadata {
  if (typeof seo !== "object" || seo === null) {
    throw new ContentValidationError("SEO metadata must be an object");
  }

  const s = seo as SeoMetadata;

  if (!isNonEmptyString(s.title)) {
    throw new ContentValidationError("SEO title must be a non-empty string");
  }

  if (!isNonEmptyString(s.description)) {
    throw new ContentValidationError(
      "SEO description must be a non-empty string"
    );
  }

  if (s.noindex !== undefined && typeof s.noindex !== "boolean") {
    throw new ContentValidationError(
      "SEO noindex must be a boolean if defined"
    );
  }
}

/* ---------------------------------------------
 * Root validation
 * --------------------------------------------- */

/**
 * Validates unknown input and returns typed SiteContent.
 * Throws ContentValidationError on failure.
 */
export function validateSiteContent(input: unknown): SiteContent {
  if (typeof input !== "object" || input === null) {
    throw new ContentValidationError("SiteContent must be an object");
  }

  const content = input as SiteContent;

  if (!isNonEmptyString(content.id)) {
    throw new ContentValidationError("id must be a non-empty string");
  }

  if (!isIsoDateString(content.createdAt)) {
    throw new ContentValidationError(
      "createdAt must be a valid ISO date string"
    );
  }

  if (!isIsoDateString(content.updatedAt)) {
    throw new ContentValidationError(
      "updatedAt must be a valid ISO date string"
    );
  }

  validateSemanticVersion(content.version);
  validateLocale(content.locale);

  if (!Array.isArray(content.pages) || content.pages.length === 0) {
    throw new ContentValidationError("At least one page is required");
  }

  content.pages.forEach(validatePage);

  validateSeoMetadata(content.seo);
  validateContentState(content.state);

  return content;
}

/**
 * Type guard variant.
 * Never throws.
 */
export function isValidSiteContent(input: unknown): input is SiteContent {
  try {
    validateSiteContent(input);
    return true;
  } catch {
    return false;
  }
}
