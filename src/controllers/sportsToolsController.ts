import { Request, Response } from "express";
import { oddsApiService } from "../services/sports-tools/OddsApiService";
import { positiveEVService } from "../services/sports-tools/PositiveEVService";
import { cheatSheetService } from "../services/sports-tools/CheatSheetService";
import { ApiResponse } from "../types";

export const getSports = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const sports = await oddsApiService.getSports();
    res.json({
      success: true,
      data: { sports },
    } as ApiResponse);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { message: error?.message || "Failed to fetch sports" },
    } as ApiResponse);
  }
};

export const getPositiveEV = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const sportKey = (req.query.sport as string) || "basketball_nba";
    const region = (req.query.region as string) || "us";
    const markets = (req.query.markets as string) || "h2h,spreads,totals";
    const oddsFormat = (req.query.oddsFormat as any) || "american";

    const sport = await oddsApiService.getSportByKey(sportKey);

    const oddsResp = await oddsApiService.getOdds({
      sport: sportKey,
      regions: region
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      markets: markets
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      oddsFormat,
    });

    const bets = positiveEVService.findPositiveEVBets(
      (oddsResp as any).data as any[],
      sport?.title || sportKey,
      sport?.group || "Unknown",
      region
    );

    res.json({
      success: true,
      data: {
        sport: {
          key: sportKey,
          title: sport?.title || sportKey,
          group: sport?.group || "Unknown",
        },
        region,
        count: bets.length,
        bets,
      },
    } as ApiResponse);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        message: error?.message || "Failed to compute positive EV bets",
      },
    } as ApiResponse);
  }
};

export const getCheatSheet = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const sport = String(req.query.sport || "").trim();
    const market = String(req.query.market || "").trim();

    if (!sport) {
      res.status(400).json({
        success: false,
        error: { message: "sport is required" },
      } as ApiResponse);
      return;
    }
    if (!market) {
      res.status(400).json({
        success: false,
        error: { message: "market is required" },
      } as ApiResponse);
      return;
    }

    const regions =
      typeof req.query.regions === "string" && req.query.regions.trim().length
        ? req.query.regions
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : undefined;

    const oddsFormat = (req.query.oddsFormat as any) || "american";
    const top = req.query.top != null ? Number(req.query.top) : undefined;

    const sheet = await cheatSheetService.getPlayerPropsCheatSheet({
      sport,
      market,
      regions,
      oddsFormat,
      top,
    });

    res.json({ success: true, data: { cheatSheet: sheet } } as ApiResponse);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { message: error?.message || "Failed to fetch cheat sheet" },
    } as ApiResponse);
  }
};
