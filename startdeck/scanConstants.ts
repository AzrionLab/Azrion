

/**
 * Default time interval between full blockchain scans
 * (in milliseconds)
 */
export const DEFAULT_SCAN_INTERVAL = 600_000  // 10 minutes

/**
 * Maximum number of transactions to look back in a single block scan
 */
export const MAX_TX_LOOKBACK = 200

/**
 * Minimum token amount movement to be considered a "whale" event
 */
export const MIN_WHALE_THRESHOLD = 10_000

/**
 * Time window (in ms) for detecting burst/flash activity
 */
export const FLASH_ACTIVITY_WINDOW_MS = 300_000  // 5 minutes

/**
 * Risk score above which an alert should be triggered
 */
export const RISK_SCORE_ALERT_THRESHOLD = 0.85

/**
 * Minimum on-chain token liquidity to include in analysis
 */
export const MIN_TOKEN_LIQUIDITY = 5_000

/**
 * Messaging channels or topics for different alert types
 */
export const ALERT_CHANNELS = {
  whaleMoves:        "alerts/whales",
  suspiciousTokens: "alerts/tokens",
  flashPumps:       "alerts/flash",
}
