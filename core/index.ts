/**
 * Core public API.
 *
 * This file defines the hard system boundary.
 * All external consumers (Builder, Build, Backend, Workers)
 * MUST import exclusively from this module.
 *
 * No logic is allowed here.
 * This file is the frozen contract surface of the core.
 *
 * CORE INVARIANTS
 *
 * - Core never performs I/O
 * - Core never persists state
 * - Core never reads environment variables
 * - Core never depends on time, except where explicitly documented
 *
 * Any violation of these rules is a breaking change.
 */

/* ---------------------------------------------
 * Domain types
 * --------------------------------------------- */

export type {
  UUID,
  ISODateString,
  SemanticVersion,
  ContentState,
  Locale,
  BaseEntity,
  Page,
  SeoMetadata,
  SiteContent,
} from "./types";

/* ---------------------------------------------
 * Content validation
 * --------------------------------------------- */

export {
  ContentValidationError,
  validateSiteContent,
  isValidSiteContent,
} from "./content.schema";

/* ---------------------------------------------
 * Publishing lifecycle
 * --------------------------------------------- */

export {
  getAllowedTransitions,
  canTransition,
  transitionState,
} from "./publishing.machine";

/* ---------------------------------------------
 * Migration
 * --------------------------------------------- */

export { registerMigration, migrateContent } from "./migration.engine";

/* ---------------------------------------------
 * Diffing
 * --------------------------------------------- */

export { diffSiteContent, type ContentDiff } from "./diff";

/* ---------------------------------------------
 * Templates
 * --------------------------------------------- */

export {
  createHomePage,
  createContactPage,
  createEmptySiteContent,
} from "./templates";

/* ---------------------------------------------
 * Rendering
 * --------------------------------------------- */

export { renderSiteContent, type RenderedArtifact } from "./content.renderer";
