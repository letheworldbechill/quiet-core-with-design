/**
 * Shortlink resolution.
 * Pure mapping, no persistence, no I/O.
 */

export type Shortlink = {
  key: string;
  targetPath: string;
};

export function resolveShortlink(
  shortlinks: Shortlink[],
  key: string
): string | null {
  const match = shortlinks.find((s) => s.key === key);
  return match ? match.targetPath : null;
}
