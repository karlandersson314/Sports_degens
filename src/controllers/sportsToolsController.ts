import { Request, Response } from 'express';
import { oddsApiService } from '../services/sports-tools/OddsApiService';
import { positiveEVService } from '../services/sports-tools/PositiveEVService';
import { ApiResponse } from '../types';

export const getSports = async (_req: Request, res: Response): Promise<void> => {
  try {
    const sports = await oddsApiService.getSports();
    res.json({
      success: true,
      data: { sports },
    } as ApiResponse);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { message: error?.message || 'Failed to fetch sports' },
    } as ApiResponse);
  }
};

export const getPositiveEV = async (req: Request, res: Response): Promise<void> => {
  try {
    const sportKey = (req.query.sport as string) || 'basketball_nba';
    const region = (req.query.region as string) || 'us';
    const markets = (req.query.markets as string) || 'h2h,spreads,totals';
    const oddsFormat = (req.query.oddsFormat as any) || 'american';

    const sport = await oddsApiService.getSportByKey(sportKey);

    const oddsResp = await oddsApiService.getOdds({
      sport: sportKey,
      regions: region.split(',').map((s) => s.trim()).filter(Boolean),
      markets: markets.split(',').map((s) => s.trim()).filter(Boolean),
      oddsFormat,
    });

    const bets = positiveEVService.findPositiveEVBets(
      (oddsResp as any).data as any[],
      sport?.title || sportKey,
      sport?.group || 'Unknown',
      region
    );

    res.json({
      success: true,
      data: {
        sport: {
          key: sportKey,
          title: sport?.title || sportKey,
          group: sport?.group || 'Unknown',
        },
        region,
        count: bets.length,
        bets,
      },
    } as ApiResponse);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { message: error?.message || 'Failed to compute positive EV bets' },
    } as ApiResponse);
  }
};
