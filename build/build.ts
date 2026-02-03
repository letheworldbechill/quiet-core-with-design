import {
  SiteContent,
  SemanticVersion,
  renderSiteContent,
  migrateContent,
} from "../core";

/**
 * Build result.
 * Pure data structure, no I/O.
 */
export type BuildResult = {
  version: SemanticVersion;
  artifacts: {
    path: string;
    content: string;
  }[];
};

/**
 * Executes a deterministic build.
 *
 * - Assumes input content is already validated
 * - Applies migrations if needed
 * - Renders static artifacts
 */
export function buildSite(
  content: SiteContent,
  targetVersion: SemanticVersion
): BuildResult {
  const migrated =
    content.version.major === targetVersion.major &&
    content.version.minor === targetVersion.minor &&
    content.version.patch === targetVersion.patch
      ? content
      : migrateContent(content, targetVersion);

  const artifacts = renderSiteContent(migrated);

  return {
    version: migrated.version,
    artifacts,
  };
}
