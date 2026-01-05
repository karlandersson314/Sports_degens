import cron from "node-cron";
import { logger } from "../utils/logger";
import { oddsIngestionService } from "../services/sports-tools/OddsIngestionService";

/**
 * v04 cron jobs:
 * - Refresh odds periodically (hot data)
 * - Archive old snapshots (keep history, reduce hot storage)
 */
export function startOddsJobs() {
  const enabled =
    (process.env.ODDS_INGESTION_ENABLED || "true").toLowerCase() === "true";
  if (!enabled) {
    logger.info("Odds ingestion jobs disabled (ODDS_INGESTION_ENABLED=false)");
    return;
  }

  const refreshCron = process.env.ODDS_REFRESH_CRON || "*/10 * * * *"; // every 10 minutes
  const archiveCron = process.env.ODDS_ARCHIVE_CRON || "0 4 * * *"; // daily 04:00
  const archiveDays = Number(process.env.ODDS_ARCHIVE_DAYS || 7);
  const sportKey = process.env.ODDS_DEFAULT_SPORT_KEY || "basketball_nba";
  const regions = (process.env.ODDS_DEFAULT_REGIONS || "us")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const markets = (process.env.ODDS_DEFAULT_MARKETS || "h2h,spreads,totals")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  cron.schedule(refreshCron, async () => {
    try {
      logger.info(`Odds refresh job running (sport=${sportKey})`);
      const r = await oddsIngestionService.refreshOdds({
        sportKey,
        regions,
        markets,
        oddsFormat: "american",
      });
      logger.info(`Odds refresh job done (snapshots=${r.ingestedSnapshots})`);
    } catch (e) {
      logger.error("Odds refresh job failed", e);
    }
  });

  cron.schedule(archiveCron, async () => {
    try {
      logger.info(`Odds archive job running (daysOld=${archiveDays})`);
      const r = await oddsIngestionService.archiveOldSnapshots(archiveDays);
      logger.info(`Odds archive job done (archived=${r.archived})`);
    } catch (e) {
      logger.error("Odds archive job failed", e);
    }
  });

  logger.info(
    `Odds jobs scheduled: refresh='${refreshCron}', archive='${archiveCron}', archiveDays=${archiveDays}`
  );
}
