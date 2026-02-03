/**
 * Content diffing.
 *
 * This file provides a deterministic way to compare two
 * SiteContent objects and describe their differences.
 *
 * - No mutation
 * - No side effects
 * - No deep traversal magic
 * - Human-readable output
 */

import { SiteContent } from "./types";

/* ---------------------------------------------
 * Diff model
 * --------------------------------------------- */

export type ContentDiff = {
  field: string;
  before: unknown;
  after: unknown;
};

/* ---------------------------------------------
 * Diffing logic
 * --------------------------------------------- */

/**
 * Compares two SiteContent objects and returns a list of differences.
 *
 * Comparison is shallow per top-level field.
 * Nested objects are compared via JSON serialization to ensure determinism.
 */
export function diffSiteContent(
  before: SiteContent,
  after: SiteContent
): ContentDiff[] {
  const diffs: ContentDiff[] = [];
  const keys = Object.keys(before) as (keyof SiteContent)[];

  for (const key of keys) {
    const a = before[key];
    const b = after[key];

    if (JSON.stringify(a) !== JSON.stringify(b)) {
      diffs.push({
        field: key as string,
        before: a,
        after: b,
      });
    }
  }

  return diffs;
}
