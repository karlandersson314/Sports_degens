import { oddsApiService } from "./OddsApiService";

export type CheatSheetOutcome = {
  eventId: string;
  commenceTime: string;
  homeTeam?: string;
  awayTeam?: string;
  sportKey: string;

  player: string;
  side: "Over" | "Under" | string;
  line: number | null;

  bestBookmaker?: string;
  bestPrice?: number | null;

  impliedProbability?: number | null;
};

export type CheatSheetResult = {
  data: CheatSheetOutcome[];
  remaining: number;
  warning?: string;
};

function americanToImpliedProb(price: number): number {
  // price can be negative or positive (American odds).
  // Negative: -110 => 110 / (110 + 100)
  // Positive: +120 => 100 / (120 + 100)
  const p = Number(price);
  if (!Number.isFinite(p) || p === 0) return NaN;
  if (p < 0) {
    const abs = Math.abs(p);
    return abs / (abs + 100);
  }
  return 100 / (p + 100);
}

export class CheatSheetService {
  /**
   * Build a simple "Cheat Sheet" for player props by selecting the best price
   * across all bookmakers for each (player, side, line).
   *
   * This is intentionally computation-only (no DB writes) to avoid model changes.
   */
  async getPlayerPropsCheatSheet(params: {
    sport: string;
    market: string;
    regions?: string[];
    oddsFormat?: "american" | "decimal" | "hongkong";
    top?: number;
  }): Promise<CheatSheetResult> {
    const {
      sport,
      market,
      regions = ["us"],
      oddsFormat = "american",
      top = 50,
    } = params;

    const isPlayerProp = market.toLowerCase().startsWith("player_");
    let remaining = 0;
    let events: any[] = [];

    if (!isPlayerProp) {
      const oddsRes: any = await oddsApiService.getOdds({
        sport,
        regions,
        markets: [market],
        oddsFormat,
      });

      // Pass through warning behavior if Odds API key isn't configured
      if (oddsRes?.warning) {
        return {
          data: [],
          remaining: oddsRes.remaining ?? 0,
          warning: oddsRes.warning,
        };
      }
      remaining = oddsRes.remaining ?? 0;
      events = Array.isArray(oddsRes?.data) ? oddsRes.data : [];
    } else {
      const eventsRes: any = await oddsApiService.getEvents({ sport });

      if (eventsRes?.warning) {
        return {
          data: [],
          remaining: eventsRes.remaining ?? 0,
          warning: eventsRes.warning,
        };
      }

      remaining = eventsRes.remaining ?? 0;

      const evs: any[] = Array.isArray(eventsRes?.data) ? eventsRes.data : [];

      const maxEventsToFetch = 10;
      const selected = evs.slice(0, maxEventsToFetch);

      const enriched: any[] = [];
      for (const ev of selected) {
        const eventId = ev?.id;
        if (!eventId) continue;

        const evOddsRes: any = await oddsApiService.getEventOdds({
          sport,
          eventId,
          regions,
          markets: [market],
          oddsFormat,
        });

        remaining = evOddsRes.remaining ?? remaining;

        if (evOddsRes?.data) enriched.push(evOddsRes.data);
      }
      events = enriched;
    }

    const bestMap = new Map<string, CheatSheetOutcome>();

    for (const ev of events) {
      const eventId = ev?.id;
      const commenceTime = ev?.commence_time;
      const homeTeam = ev?.home_team;
      const awayTeam = ev?.away_team;

      const bookmakers: any[] = Array.isArray(ev?.bookmakers)
        ? ev.bookmakers
        : [];
      for (const bm of bookmakers) {
        const bookmakerKey: string | undefined = bm?.key;
        const markets: any[] = Array.isArray(bm?.markets) ? bm.markets : [];
        const marketObj = markets.find((m) => m?.key === market);
        if (!marketObj) continue;

        const outcomes: any[] = Array.isArray(marketObj?.outcomes)
          ? marketObj.outcomes
          : [];
        for (const o of outcomes) {
          const outcomeName = (o?.name ?? "").trim();

          // player props usually keep player name in description/participant/player
          const participant = (
            o?.description ||
            o?.participant ||
            o?.player ||
            ""
          ).trim();

          const isPlayerProp = market.toLowerCase().startsWith("player_");

          // For player props: player = participant name, side = Over/Under
          // For non-player markets (h2h/spreads/totals): player = outcome name (team), side = market key
          const player = isPlayerProp
            ? participant
            : outcomeName || participant;
          const side = isPlayerProp ? outcomeName : market;

          const line =
            typeof o?.point === "number"
              ? o.point
              : o?.point != null
              ? Number(o.point)
              : null;

          const price =
            typeof o?.price === "number"
              ? o.price
              : o?.price != null
              ? Number(o.price)
              : null;

          if (!player || !side) continue;

          const key = `${eventId}|${player}|${side}|${line ?? "null"}`;
          const existing = bestMap.get(key);

          const implied =
            price != null && Number.isFinite(price)
              ? americanToImpliedProb(price)
              : null;

          const candidate: CheatSheetOutcome = {
            eventId,
            commenceTime,
            homeTeam,
            awayTeam,
            sportKey: sport,
            player,
            side,
            line: Number.isFinite(line as any) ? (line as number) : null,
            bestBookmaker: bookmakerKey,
            bestPrice: Number.isFinite(price as any) ? (price as number) : null,
            impliedProbability: Number.isFinite(implied as any)
              ? implied
              : null,
          };

          // choose best price for the bettor: higher American odds is better payout
          if (!existing) {
            bestMap.set(key, candidate);
            continue;
          }

          const existingPrice = existing.bestPrice ?? null;
          const candPrice = candidate.bestPrice ?? null;

          if (existingPrice == null && candPrice != null) {
            bestMap.set(key, candidate);
          } else if (existingPrice != null && candPrice != null) {
            // For American odds, compare numerically:
            // +200 > +150; -105 > -110 (less negative is better)
            if (candPrice > existingPrice) bestMap.set(key, candidate);
          }
        }
      }
    }

    const rows = Array.from(bestMap.values());

    // Sort: soonest event first, then by impliedProbability ascending (higher payout / lower implied) is "spicier"
    rows.sort((a, b) => {
      const ta = a.commenceTime ? Date.parse(a.commenceTime) : 0;
      const tb = b.commenceTime ? Date.parse(b.commenceTime) : 0;
      if (ta !== tb) return ta - tb;

      const pa = a.impliedProbability ?? 1;
      const pb = b.impliedProbability ?? 1;
      return pa - pb;
    });

    return {
      data: rows.slice(0, Math.max(1, Math.min(500, top))),
      remaining: remaining ?? 0,
    };
  }
}

export const cheatSheetService = new CheatSheetService();
