import { Request, Response } from "express";
import { oddsIngestionService } from "../services/sports-tools/OddsIngestionService";
import { logger } from "../utils/logger";

export async function getOddsIngestionStatus(_req: Request, res: Response) {
  try {
    const status = await oddsIngestionService.status();
    return res.json({ success: true, data: status });
  } catch (err) {
    logger.error("Failed to get odds ingestion status", err);
    return res.status(500).json({ success: false, error: { message: "Internal server error" } });
  }
}

export async function refreshOddsNow(req: Request, res: Response) {
  try {
    const { sportKey, regions, markets, oddsFormat } = req.body || {};
    if (!sportKey || typeof sportKey !== "string") {
      return res.status(400).json({ success: false, error: { message: "sportKey is required" } });
    }
    const result = await oddsIngestionService.refreshOdds({
      sportKey,
      regions,
      markets,
      oddsFormat,
    });
    return res.json({ success: true, data: result });
  } catch (err: any) {
    const status = err?.status || 500;
    const message = err?.message || "Internal server error";
    return res.status(status).json({ success: false, error: { message } });
  }
}

export async function archiveOddsSnapshots(req: Request, res: Response) {
  try {
    const daysOld = Number(req.body?.daysOld ?? 7);
    const result = await oddsIngestionService.archiveOldSnapshots(daysOld);
    return res.json({ success: true, data: result });
  } catch (err) {
    logger.error("Failed to archive snapshots", err);
    return res.status(500).json({ success: false, error: { message: "Internal server error" } });
  }
}
