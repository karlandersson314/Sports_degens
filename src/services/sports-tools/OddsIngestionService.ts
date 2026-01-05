import { oddsApiService } from "./OddsApiService";
import { logger } from "../../utils/logger";
import { Sport } from "../../models/Sport";
import { Team } from "../../models/Team";
import { SportEvent } from "../../models/SportEvent";
import { Sportsbook } from "../../models/SportsBook";
import { Market } from "../../models/Market";
import { MarketSelection } from "../../models/MarketSelection";
import { OddsSnapshot, OddsFormat } from "../../models/OddsSnapshot";
import { OddsSnapshotArchive } from "../../models/OddsSnapshotArchive";
import {
  makeEventId,
  makeMarketId,
  makeOddsSnapshotId,
  makeSelectionId,
  makeSportIdFromKey,
  makeSportsbookId,
  makeTeamId,
} from "../../utils/oddsIds";
import { americanToImpliedProb, decimalToImpliedProb } from "../../utils/odds";

type OddsApiEvent = any;

export class OddsIngestionService {
  /**
   * Ingest odds for a sport + set of markets.
   * Creates/updates: Sport, Teams, SportEvent, Sportsbook, Market, MarketSelection, OddsSnapshot.
   */
  async refreshOdds(params: {
    sportKey: string;
    regions?: string[];
    markets?: string[];
    oddsFormat?: "american" | "decimal" | "hongkong";
  }): Promise<{ ingestedSnapshots: number; remaining: number }> {
    const { sportKey, regions, markets, oddsFormat } = params;
    const batchEpochMs = Date.now();

    const sportId = makeSportIdFromKey(sportKey);

    // Ensure Sport exists (minimal fields per schema)
    await Sport.updateOne(
      { id: sportId },
      {
        $setOnInsert: {
          id: sportId,
          name: sportKey,
          key: sportKey,
        },
      },
      { upsert: true }
    );

    const { data, remaining, warning } = await oddsApiService.getOdds({
      sport: sportKey,
      regions,
      markets,
      oddsFormat,
    });

    if (warning) {
      logger.warn(`Odds ingestion skipped: ${warning}`);
      return { ingestedSnapshots: 0, remaining };
    }

    const events: OddsApiEvent[] = Array.isArray(data) ? data : [];

    let snapshotIndex = 0;

    for (const evt of events) {
      // Odds API shape (typical):
      // { id, sport_key, commence_time, home_team, away_team, bookmakers: [ { key, title, markets: [ { key, outcomes: [...] } ] } ] }
      const externalEventId = String(evt.id || "");
      const eventId = makeEventId(externalEventId);

      const homeName = String(evt.home_team || "");
      const awayName = String(evt.away_team || "");
      const homeId = makeTeamId(sportId, homeName);
      const awayId = makeTeamId(sportId, awayName);

      // Teams
      await Team.updateOne(
        { id: homeId },
        {
          $setOnInsert: {
            id: homeId,
            sport_id: sportId,
            name: homeName,
            abbreviation: homeName.slice(0, 3).toUpperCase() || "UNK",
            external_ref: homeName,
          },
        },
        { upsert: true }
      );
      await Team.updateOne(
        { id: awayId },
        {
          $setOnInsert: {
            id: awayId,
            sport_id: sportId,
            name: awayName,
            abbreviation: awayName.slice(0, 3).toUpperCase() || "UNK",
            external_ref: awayName,
          },
        },
        { upsert: true }
      );

      // SportEvent
      await SportEvent.updateOne(
        { id: eventId },
        {
          $set: {
            id: eventId,
            sport_id: sportId,
            league_code: sportKey,
            home_team_id: homeId,
            away_team_id: awayId,
            starts_at: new Date(evt.commence_time || Date.now()),
            status: "scheduled",
            external_ref: externalEventId,
          },
        },
        { upsert: true }
      );

      const bookmakers = Array.isArray(evt.bookmakers) ? evt.bookmakers : [];
      for (const bm of bookmakers) {
        const bookKey = String(bm.key || bm.title || "unknown");
        const bookId = makeSportsbookId(bookKey);

        await Sportsbook.updateOne(
          { id: bookId },
          {
            $set: {
              id: bookId,
              name: String(bm.title || bookKey),
              code: bookKey,
              base_url: "",
            },
          },
          { upsert: true }
        );

        const marketsArr = Array.isArray(bm.markets) ? bm.markets : [];
        for (const mk of marketsArr) {
          const marketKey = String(mk.key || "");
          const marketId = makeMarketId(eventId, bookId, marketKey);

          await Market.updateOne(
            { id: marketId },
            {
              $set: {
                id: marketId,
                sport_event_id: eventId,
                key: marketKey,
                label: marketKey,
                metadata: {
                  bookmaker_key: bookKey,
                  last_update: bm.last_update,
                },
              },
            },
            { upsert: true }
          );

          const outcomes = Array.isArray(mk.outcomes) ? mk.outcomes : [];
          for (const out of outcomes) {
            const outcomeName = String(
              out.name || out.description || "outcome"
            );
            const point = typeof out.point === "number" ? out.point : null;
            const price = Number(out.price ?? out.odds ?? 0);

            const selectionId = makeSelectionId(marketId, outcomeName, point);

            await MarketSelection.updateOne(
              { id: selectionId },
              {
                $set: {
                  id: selectionId,
                  market_id: marketId,
                  label: outcomeName,
                  player_id: "",
                  line_value: point ?? 0,
                  side: outcomeName,
                },
              },
              { upsert: true }
            );

            // Snapshot
            let implied = 0;
            let fmt: OddsFormat = OddsFormat.AMERICAN;
            if ((oddsFormat || "american") === "decimal") {
              fmt = OddsFormat.DECIMAL;
              implied = decimalToImpliedProb(price);
            } else {
              fmt = OddsFormat.AMERICAN;
              implied = americanToImpliedProb(price);
            }

            const snapshotId = makeOddsSnapshotId(
              batchEpochMs,
              snapshotIndex++
            );

            await OddsSnapshot.updateOne(
              { id: snapshotId },
              {
                $set: {
                  id: snapshotId,
                  sportsbook_id: bookId,
                  selection_id: selectionId,
                  odds_format: fmt,
                  odds_value: price,
                  implied_prob: implied,
                  fetched_at: new Date(batchEpochMs),
                },
              },
              { upsert: true }
            );
          }
        }
      }
    }

    return { ingestedSnapshots: snapshotIndex, remaining };
  }

  /**
   * Archive snapshots older than N days (copy to OddsSnapshotArchive then delete from hot).
   */
  async archiveOldSnapshots(daysOld: number): Promise<{ archived: number }> {
    const cutoff = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);
    const old = await OddsSnapshot.find({ fetched_at: { $lt: cutoff } }).lean();
    if (!old.length) return { archived: 0 };

    const docs = old.map((o) => ({ ...o, archived_at: new Date() }));
    // Insert (ignore dup key by ordered:false)
    await OddsSnapshotArchive.insertMany(docs, { ordered: false }).catch(() => {
      // Best-effort: duplicates are ok; we still delete hot entries below.
    });
    const ids = old.map((o) => o.id);
    await OddsSnapshot.deleteMany({ id: { $in: ids } });
    return { archived: old.length };
  }

  async status(): Promise<{
    snapshots: number;
    lastFetchedAt: Date | null;
    archived: number;
  }> {
    const snapshots = await OddsSnapshot.countDocuments();
    const last = await OddsSnapshot.findOne().sort({ fetched_at: -1 }).lean();
    const archived = await OddsSnapshotArchive.countDocuments();
    return {
      snapshots,
      lastFetchedAt: last ? (last as any).fetched_at : null,
      archived,
    };
  }
}

export const oddsIngestionService = new OddsIngestionService();
