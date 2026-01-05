import crypto from "crypto";

/**
 * Convert American odds to implied probability (no vig removal).
 * +150 => 100 / (150 + 100) = 0.4
 * -150 => 150 / (150 + 100) = 0.6
 */
export function americanToImpliedProb(american: number): number {
  if (!Number.isFinite(american) || american === 0) return 0;
  if (american > 0) return 100 / (american + 100);
  return Math.abs(american) / (Math.abs(american) + 100);
}

/**
 * Convert American odds to decimal odds.
 * +150 => 2.5
 * -150 => 1.666...
 */
export function americanToDecimal(american: number): number {
  if (!Number.isFinite(american) || american === 0) return 0;
  if (american > 0) return 1 + american / 100;
  return 1 + 100 / Math.abs(american);
}

export function decimalToImpliedProb(decimal: number): number {
  if (!decimal || decimal <= 0) return 0;
  return 1 / decimal;
}

/**
 * Deterministic numeric id from a string key (stable across restarts).
 * We use a 32-bit slice of SHA256 to avoid a counter collection.
 */
export function stableIntId(key: string): number {
  const h = crypto.createHash("sha256").update(key).digest();
  // uint32 from first 4 bytes
  return h.readUInt32BE(0);
}

export function toAbbrev(name: string, maxLen = 4): string {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "UNK";
  const ab = parts.map((p) => p[0]?.toUpperCase() || "").join("");
  return (ab || parts[0].slice(0, maxLen)).slice(0, maxLen).toUpperCase();
}
