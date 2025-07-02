export interface WalletActivity {
  wallet: string
  timestamp: number
  inbound: number
  outbound: number
  tokenMint: string
}

export function detectAnomalies(
  activity: WalletActivity[],
  inThreshold = 100000,
  outThreshold = 100000
): WalletActivity[] {
  return activity.filter(w =>
    w.inbound > inThreshold || w.outbound > outThreshold
  )
}

export function flagByVelocity(
  activity: WalletActivity[],
  timeWindowMs = 60 * 60 * 1000
): string[] {
  const flagged: string[] = []
  const grouped: Record<string, WalletActivity[]> = {}

  for (const entry of activity) {
    if (!grouped[entry.wallet]) grouped[entry.wallet] = []
    grouped[entry.wallet].push(entry)
  }

  for (const wallet in grouped) {
    const entries = grouped[wallet].sort((a, b) => a.timestamp - b.timestamp)
    for (let i = 1; i < entries.length; i++) {
      const deltaTime = entries[i].timestamp - entries[i - 1].timestamp
      if (deltaTime < timeWindowMs) {
        flagged.push(wallet)
        break
      }
    }
  }

  return flagged
}