export interface SurgeEntry {
  token: string
  timestamp: number
  price: number
  volume: number
}

export function traceSurge(entries: SurgeEntry[], threshold = 0.25): string[] {
  const flagged: string[] = []

  for (let i = 1; i < entries.length; i++) {
    const prev = entries[i - 1]
    const curr = entries[i]

    const priceChange = (curr.price - prev.price) / prev.price
    const volumeSpike = curr.volume > prev.volume * 2

    if (priceChange > threshold || volumeSpike) {
      flagged.push(`${curr.token} surge @ ${new Date(curr.timestamp).toISOString()}`)
    }
  }

  return flagged
}
