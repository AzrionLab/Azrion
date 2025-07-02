export interface TokenActivity {
  timestamp: number
  wallet: string
  amount: number
}

export function buildHourlyHeatmap(activity: TokenActivity[]): Record<string, number[]> {
  const map: Record<string, number[]> = {}

  for (const tx of activity) {
    const hour = new Date(tx.timestamp).getUTCHours()
    if (!map[tx.wallet]) map[tx.wallet] = Array(24).fill(0)
    map[tx.wallet][hour] += tx.amount
  }

  return map
}

export function normalizeHeatmap(map: Record<string, number[]>): Record<string, number[]> {
  const norm: Record<string, number[]> = {}

  for (const wallet in map) {
    const total = map[wallet].reduce((a, b) => a + b, 0) || 1
    norm[wallet] = map[wallet].map(v => parseFloat((v / total).toFixed(3)))
  }

  return norm
}