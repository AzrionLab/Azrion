export interface TokenActivity {
  timestamp: number
  wallet: string
  amount: number
}

/**
 * Build per-wallet hourly heatmap.
 * @param activity  Array of token activities
 * @param tzOffset  Optional timezone offset in hours (default 0)
 */
export function buildHourlyHeatmap(
  activity: TokenActivity[],
  tzOffset: number = 0
): Record<string, number[]> {
  const map: Record<string, number[]> = {}

  for (const tx of activity) {
    const dt = new Date(tx.timestamp)
    // apply timezone offset
    const hour = (dt.getUTCHours() + tzOffset + 24) % 24
    if (!map[tx.wallet]) map[tx.wallet] = Array(24).fill(0)
    map[tx.wallet][hour] += tx.amount
  }

  return map
}

/**
 * Normalize each wallet's hourly amounts to proportions,
 * optionally skipping wallets below a minimum total.
 * @param map      Raw hourly map
 * @param minTotal Minimum total activity to include (default 0)
 */
export function normalizeHeatmap(
  map: Record<string, number[]>,
  minTotal: number = 0
): Record<string, number[]> {
  const norm: Record<string, number[]> = {}

  for (const wallet in map) {
    const total = map[wallet].reduce((a, b) => a + b, 0)
    if (total < minTotal) continue // skip low-activity wallets
    // divide by total to get proportion per hour
    norm[wallet] = map[wallet].map(v => parseFloat((v / total).toFixed(3)))
  }

  return norm
}
