import { BuildResult } from "./build";

/**
 * Export model for downstream adapters.
 */
export type ExportFile = {
  path: string;
  content: string;
};

/**
 * Prepares build artifacts for export.
 *
 * This function does NOT write files.
 * It only normalizes output for adapters (ZIP, FS, Cloud).
 */
export function prepareExport(build: BuildResult): ExportFile[] {
  return build.artifacts.map((artifact) => ({
    path: artifact.path,
    content: artifact.content,
  }));
}
