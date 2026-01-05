/**
 * Positive EV Calculation Service
 * 
 * Formula: (Probability of Winning × Potential Profit) - (Probability of Losing × Amount Wagered)
 * Adapted from positive-ev-bets-main
 */

export interface PositiveEVBet {
  game: string;
  sport: string;
  group: string;
  market: string;
  team: string;
  bookmaker: string;
  price: number;
  point?: number;
  impliedProbability: number;
  averageOdds: number;
  averageImpliedProbability: number;
  expectedValue: number;
  region: string;
}

export interface OddsData {
  away_team: string;
  home_team: string;
  bookmakers: Array<{
    title: string;
    markets: Array<{
      key: string;
      outcomes: Array<{
        name: string;
        price: number;
        point?: number;
      }>;
    }>;
  }>;
  commence_time: string;
  sport_key: string;
  sport_title: string;
}

export class PositiveEVService {
  /**
   * Calculate implied probability from American odds
   * Adapted from positive-ev-bets-main
   */
  calculateImpliedProbability(price: number): number {
    if (price > 0) {
      return 100 / (price + 100);
    }
    return -price / (-price + 100);
  }

  /**
   * Calculate average odds from multiple outcomes
   * Adapted from positive-ev-bets-main
   */
  calculateAverageOdds(outcomes: { price: number }[]): number {
    const totalOdds = outcomes.reduce((acc, outcome) => acc + outcome.price, 0);
    return Math.round(totalOdds / outcomes.length);
  }

  /**
   * Calculate expected value
   * Adapted from positive-ev-bets-main
   * Formula: impliedProbability * profit - (1 - impliedProbability) * 100
   */
  calculateExpectedValue(price: number, marketImpliedProbability: number): number {
    const profit = price > 0 ? price : 100 / Math.abs(price);
    return marketImpliedProbability * profit - (1 - marketImpliedProbability) * 100;
  }

  /**
   * Check if game happens in next 3 days
   */
  gameHappensInNext3Days(commenceTime: string): boolean {
    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    return new Date(commenceTime) <= threeDaysFromNow;
  }

  /**
   * Find positive EV bets from odds data
   * Adapted from positive-ev-bets-main getPositiveEVBets function
   */
  findPositiveEVBets(
    oddsData: OddsData[],
    sportTitle: string,
    sportGroup: string,
    region: string
  ): PositiveEVBet[] {
    const positiveEVBets: PositiveEVBet[] = [];

    if (!Array.isArray(oddsData) || oddsData.length === 0) {
      return positiveEVBets;
    }

    for (const game of oddsData) {
      // Validate game data
      if (!game || !game.bookmakers || !Array.isArray(game.bookmakers)) {
        continue;
      }

      // Only process games happening in next 3 days
      if (!this.gameHappensInNext3Days(game.commence_time)) {
        continue;
      }

      // Process each bookmaker's markets
      for (const bookmaker of game.bookmakers) {
        if (!bookmaker || !bookmaker.markets || !Array.isArray(bookmaker.markets)) {
          continue;
        }

        for (const market of bookmaker.markets) {
          if (!market || !market.outcomes || !Array.isArray(market.outcomes) || market.outcomes.length === 0) {
            continue;
          }

          const averageOdds = this.calculateAverageOdds(market.outcomes);
          const marketImpliedProbability = this.calculateImpliedProbability(averageOdds);

          // Check each outcome for positive EV
          for (const outcome of market.outcomes) {
            if (!outcome || typeof outcome.price !== 'number') {
              continue;
            }

            const impliedProbability = this.calculateImpliedProbability(outcome.price);
            const expectedValue = this.calculateExpectedValue(
              outcome.price,
              marketImpliedProbability
            );

            // Only include if expected value is positive
            if (expectedValue > 0) {
              positiveEVBets.push({
                sport: sportTitle,
                group: sportGroup,
                team: outcome.name || 'Unknown',
                price: outcome.price,
                point: outcome.point,
                bookmaker: bookmaker.title || 'Unknown',
                game: `${game.home_team || 'Home'} vs ${game.away_team || 'Away'}`,
                impliedProbability,
                region,
                market: market.key || 'unknown',
                averageOdds,
                averageImpliedProbability: marketImpliedProbability,
                expectedValue: Number(expectedValue.toFixed(2)),
              });
            }
          }
        }
      }
    }

    return positiveEVBets;
  }
}

export const positiveEVService = new PositiveEVService();

