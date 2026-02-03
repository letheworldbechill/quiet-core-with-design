/**
 * Migration engine.
 *
 * This file defines how SiteContent evolves across versions.
 *
 * - Migrations are explicit
 * - Order is deterministic
 * - No automatic guessing
 * - No side effects
 *
 * If a version jump is not explicitly registered, it is forbidden.
 */

import { SiteContent, SemanticVersion } from "./types";

/* ---------------------------------------------
 * Migration types
 * --------------------------------------------- */

export type Migration = {
  from: SemanticVersion;
  to: SemanticVersion;
  migrate: (input: SiteContent) => SiteContent;
};

/* ---------------------------------------------
 * Internal registry
 * --------------------------------------------- */

const migrations: Migration[] = [];

/* ---------------------------------------------
 * Registration API
 * --------------------------------------------- */

/**
 * Registers a migration.
 * Migrations must be registered in ascending order.
 */
export function registerMigration(migration: Migration): void {
  migrations.push(migration);
}

/* ---------------------------------------------
 * Utilities
 * --------------------------------------------- */

function versionsEqual(
  a: SemanticVersion,
  b: SemanticVersion
): boolean {
  return (
    a.major === b.major &&
    a.minor === b.minor &&
    a.patch === b.patch
  );
}

/* ---------------------------------------------
 * Migration execution
 * --------------------------------------------- */

/**
 * Migrates SiteContent to a target version.
 *
 * Throws if no valid migration path exists.
 */
export function migrateContent(
  content: SiteContent,
  targetVersion: SemanticVersion
): SiteContent {
  let current = content;

  if (versionsEqual(current.version, targetVersion)) {
    return current;
  }

  let migrated = true;

  while (!versionsEqual(current.version, targetVersion)) {
    migrated = false;

    for (const migration of migrations) {
      if (versionsEqual(current.version, migration.from)) {
        current = migration.migrate(current);
        migrated = true;
        break;
      }
    }

    if (!migrated) {
      throw new Error(
        `No migration path from version ` +
          `${current.version.major}.${current.version.minor}.${current.version.patch} ` +
          `to target version ` +
          `${targetVersion.major}.${targetVersion.minor}.${targetVersion.patch}`
      );
    }
  }

  return {
    ...current,
    version: targetVersion,
    // NOTE: Controlled side effect (timestamp).
    // If full determinism is required, inject updatedAt externally.
    updatedAt: new Date().toISOString(),
  };
}
