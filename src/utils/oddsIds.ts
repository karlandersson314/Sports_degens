/**
 * Helpers to generate IDs for ingested sports/odds entities.
 *
 * Design goals:
 * - Avoid changing existing schemas.
 * - Provide stable string IDs for relational-style docs (event/market/selection).
 * - Provide unique numeric IDs for OddsSnapshot (required by schema).
 */

export function makeSportIdFromKey(sportKey: string): number {
  // Simple stable hash to a positive 32-bit int.
  let h = 0;
  for (let i = 0; i < sportKey.length; i++) {
    h = (h * 31 + sportKey.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export function makeTeamId(sportId: number, teamName: string): string {
  return `team:${sportId}:${slug(teamName)}`;
}

export function makeSportsbookId(bookKey: string): string {
  return `book:${slug(bookKey)}`;
}

export function makeEventId(externalEventId: string): string {
  return `evt:${slug(externalEventId)}`;
}

export function makeMarketId(eventId: string, bookId: string, marketKey: string): string {
  return `mkt:${eventId}:${bookId}:${slug(marketKey)}`;
}

export function makeSelectionId(
  marketId: string,
  outcomeName: string,
  point?: number | null
): string {
  const pt = typeof point === "number" ? `:${point}` : "";
  return `sel:${marketId}:${slug(outcomeName)}${pt}`;
}

/**
 * OddsSnapshot schema requires a numeric unique id.
 * We generate a unique id per refresh by using an epoch-ms base plus the index.
 */
export function makeOddsSnapshotId(batchEpochMs: number, index: number): number {
  // Keep it within MAX_SAFE_INTEGER: epochMs (~1.7e12) * 1000 + index (<1e3)
  return batchEpochMs * 1000 + index;
}

function slug(v: string): string {
  return (v || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-:_]/g, "");
}
