/**
 * Core domain types.
 *
 * This file defines the complete vocabulary of the system.
 * It contains NO logic, NO defaults, NO side effects.
 * All other core modules depend on these types.
 *
 * Changing this file is a breaking change and must be versioned explicitly.
 */

/* ---------------------------------------------
 * Primitive domain aliases
 * --------------------------------------------- */

export type UUID = string;
export type ISODateString = string;

/* ---------------------------------------------
 * Versioning
 * --------------------------------------------- */

export type SemanticVersion = {
  major: number;
  minor: number;
  patch: number;
};

/* ---------------------------------------------
 * Content lifecycle
 * --------------------------------------------- */

export type ContentState =
  | "draft"
  | "review"
  | "published"
  | "archived";

/* ---------------------------------------------
 * Localization
 * --------------------------------------------- */

export type Locale =
  | "pt-BR"
  | "en";

/* ---------------------------------------------
 * Base entity
 * --------------------------------------------- */

export type BaseEntity = {
  id: UUID;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  version: SemanticVersion;
};

/* ---------------------------------------------
 * Page model
 * --------------------------------------------- */

export type Page = {
  slug: string;
  title: string;
  body: string;
};

/* ---------------------------------------------
 * SEO model
 * --------------------------------------------- */

export type SeoMetadata = {
  title: string;
  description: string;
  noindex?: boolean;
};

/* ---------------------------------------------
 * Site content (root aggregate)
 * --------------------------------------------- */

export type SiteContent = BaseEntity & {
  locale: Locale;
  pages: Page[];
  seo: SeoMetadata;
  state: ContentState;
};
