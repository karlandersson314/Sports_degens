import { americanToDecimal } from "../../utils/odds";
import { oddsApiService } from "./OddsApiService";

export type ArbitrageLeg = {
  outcome: string;
  bestBookmaker?: string;
  bestPrice?: number | null; // American odds
  decimalOdds?: number | null;
  impliedProbability?: number | null; // 1/decimal
};

export type ArbitrageOpportunity = {
  eventId: string;
  commenceTime: string;
  homeTeam?: string;
  awayTeam?: string;
  sportKey: string;
  market: string;

  impliedSum: number; // sum of impliedProbability across legs
  edgePercent: number; // (1/impliedSum - 1) * 100

  legs: ArbitrageLeg[];
};

export type ArbitrageResult = {
  data: ArbitrageOpportunity[];
  remaining: number;
  warning?: string;
};

export class ArbitrageService {
  /**
   * Detect simple 2-way arbitrage on market=h2h.
   *
   * If you need spreads/totals later, we can extend the "legs" builder.
   */
  async getArbitrage(params: {
    sport: string;
    market: string;
    regions?: string[];
    oddsFormat?: "american" | "decimal" | "hongkong";
    top?: number;
  }): Promise<ArbitrageResult> {
    const {
      sport,
      market,
      regions = ["us"],
      oddsFormat = "american",
      top = 50,
    } = params;

    if (market !== "h2h") {
      const err: any = new Error(
        `UNSUPPORTED_MARKET: arbitrage currently supports market=h2h only (received: ${market})`
      );
      err.status = 422;
      err.code = "UNSUPPORTED_MARKET";
      throw err;
    }

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

    const events: any[] = Array.isArray(oddsRes?.data) ? oddsRes.data : [];
    const out: ArbitrageOpportunity[] = [];

    for (const ev of events) {
      const eventId = ev?.id;
      const commenceTime = ev?.commence_time;
      const homeTeam = ev?.home_team;
      const awayTeam = ev?.away_team;

      // BEST per team
      const best: Record<
        string,
        { bookmaker?: string; price?: number | null }
      > = {};

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
          const outcomeName = String(o?.name || "").trim();
          const price =
            typeof o?.price === "number"
              ? o.price
              : o?.price != null
              ? Number(o.price)
              : null;
          if (!outcomeName || price == null || !Number.isFinite(price))
            continue;

          const existing = best[outcomeName];
          if (!existing || (existing.price ?? -Infinity) < price) {
            // Higher American odds is better payout
            best[outcomeName] = { bookmaker: bookmakerKey, price };
          }
        }
      }

      const outcomes = Object.keys(best);
      if (outcomes.length !== 2) continue; // keep it simple for 2-way h2h

      const legs: ArbitrageLeg[] = outcomes.map((name) => {
        const price = best[name]?.price ?? null;
        const dec = price != null ? americanToDecimal(price) : NaN;
        const implied = Number.isFinite(dec) && dec > 0 ? 1 / dec : NaN;
        return {
          outcome: name,
          bestBookmaker: best[name]?.bookmaker,
          bestPrice: price,
          decimalOdds: Number.isFinite(dec) ? dec : null,
          impliedProbability: Number.isFinite(implied) ? implied : null,
        };
      });

      const impliedSum = legs.reduce(
        (acc, l) => acc + (l.impliedProbability ?? 0),
        0
      );
      if (!Number.isFinite(impliedSum) || impliedSum <= 0) continue;

      if (impliedSum < 1) {
        const edgePercent = (1 / impliedSum - 1) * 100;
        out.push({
          eventId,
          commenceTime,
          homeTeam,
          awayTeam,
          sportKey: sport,
          market,
          impliedSum,
          edgePercent,
          legs,
        });
      }
    }

    // Sort best arbitrage first (higher edge)
    out.sort((a, b) => b.edgePercent - a.edgePercent);

    const limit = Math.max(1, Math.min(200, top));
    return {
      data: out.slice(0, limit),
      remaining: oddsRes.remaining ?? 0,
    };
  }
}

export const arbitrageService = new ArbitrageService();
