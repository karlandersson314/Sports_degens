/**
 * Application-wide constants
 */

// House Edge percentages
export const HOUSE_EDGE = {
  BLACKJACK: 0.005, // 0.5%
  POKER: 0, // 0%
  CASES_BATTLES: 0.1, // 10%
  MINES: 0.05, // 5%
  DICE: 0.005, // 0.5%
  CRASH: 0.05, // 5%
  UPGRADER: 0.1, // 10%
  SNAKE: 0.0666, // 6.66%
} as const;

// XP Rates and Bonuses
export const XP_CONFIG = {
  RATE: 1, // 1 XP per $1 wagered
  FRIEND_BONUS: 0.25, // +25%
  BATTLE_BONUS: 0.1, // +10%
  STREAK_BONUS: 0.1, // +10%
} as const;

// Free XP Actions
export const FREE_XP = {
  VERIFY_EMAIL: 250,
  JOIN_DISCORD: 250,
  FOLLOW_TWITTER: 150,
  FOLLOW_INSTAGRAM: 200,
  FOLLOW_YOUTUBE: 200,
  FOLLOW_KICK: 150,
  FOLLOW_TIKTOK: 100,
  FOLLOW_FACEBOOK: 100,
} as const;

// Rakeback Configuration
export const RAKEBACK_CONFIG = {
  RETURN_RATE: 0.15 / 180, // 15% over 180 days
  BASE_CASE_VALUE: 0.25, // $0.25
  MAX_CASE_VALUE_MULTIPLIER: 0.1,
} as const;

// Level Calculation
export const LEVEL_CONFIG = {
  BASE_XP: 100,
  EXPONENT: 1.4,
} as const;

// Affiliate Commission Rates
export const AFFILIATE_COMMISSION = {
  CASINO_AFFILIATE: 0.3, // 30% lifetime
  CASINO_CREATOR: 0.3, // 30% for 30 days
  CASINO_SPLIT: 0.15, // 15% each when both present
  TOOLS_AFFILIATE: 0.6, // 60% lifetime
} as const;

// Game Session Timeouts
export const GAME_TIMEOUTS = {
  SNAKE_INACTIVITY: 10 * 60 * 1000, // 10 minutes
  SNAKE_MAX_GAME_TIME: 15 * 60 * 1000, // 15 minutes
  SNAKE_SESSION_DURATION: 30 * 60 * 1000, // 30 minutes
} as const;

// Data Archiving Thresholds
export const ARCHIVE_THRESHOLDS = {
  CASE_BATTLES: 60 * 60 * 1000, // 1 hour
  CRASH: 24 * 60 * 60 * 1000, // 1 day
  MINES: 24 * 60 * 60 * 1000, // 1 day
} as const;

