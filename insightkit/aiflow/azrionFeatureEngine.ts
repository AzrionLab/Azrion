export interface AzrionTickPoint {
  timestamp: number  // Unix epoch ms
  volume: number
  price: number
  liquidity: number
}

export interface AzrionFeatureVector {
  timestamp: number
  movingAverages: {
    short: number
    medium: number
    long: number
  }
  momentum: number
  volatility: number
  liquidityRatio: number
}

/** Lightweight numeric window for fast avg/volatility calculations */
class NumericWindow {
  private readonly size: number
  private values: number[] = []
  private sum = 0

  constructor(size: number) {
    this.size = size
  }

  push(value: number): void {
    this.values.push(value)
    this.sum += value
    if (this.values.length > this.size) {
      this.sum -= this.values.shift() as number
    }
  }

  average(): number {
    return this.values.length ? this.sum / this.values.length : 0
  }
}

export class AzrionFeatureEngine {
  static extract(
    feed: AzrionTickPoint[],
    focusTimestamps: number[] = []
  ): AzrionFeatureVector[] {
    const shortWindow = new NumericWindow(5)
    const mediumWindow = new NumericWindow(15)
    const longWindow = new NumericWindow(60)

    const result: AzrionFeatureVector[] = []
    let previousPrice: number | null = null
    const hourWindow = 60 * 60 * 1000

    for (const entry of feed) {
      shortWindow.push(entry.price)
      mediumWindow.push(entry.price)
      longWindow.push(entry.price)

      const maShort = shortWindow.average()
      const maMedium = mediumWindow.average()
      const maLong = longWindow.average()

      const momentum =
        previousPrice !== null && previousPrice !== 0
          ? (entry.price - previousPrice) / previousPrice
          : 0

      const pricesInHour = feed
        .filter(
          e =>
            e.timestamp >= entry.timestamp - hourWindow &&
            e.timestamp <= entry.timestamp
        )
        .map(e => e.price)

      const mean =
        pricesInHour.reduce((sum, val) => sum + val, 0) /
        (pricesInHour.length || 1)
      const variance =
        pricesInHour.reduce((sum, val) => sum + (val - mean) ** 2, 0) /
        (pricesInHour.length || 1)
      const volatility = Math.sqrt(variance)

      const liquidityRatio =
        entry.liquidity !== 0 ? entry.volume / entry.liquidity : 0

      if (
        focusTimestamps.length === 0 ||
        focusTimestamps.includes(entry.timestamp)
      ) {
        result.push({
          timestamp: entry.timestamp,
          movingAverages: {
            short: maShort,
            medium: maMedium,
            long: maLong
          },
          momentum,
          volatility,
          liquidityRatio
        })
      }

      previousPrice = entry.price
    }

    return result
  }
}
