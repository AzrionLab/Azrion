export interface LiquidityPoint {
  timestamp: number
  volume: number
  liquidity: number
}

export function detectLiquiditySurge(data: LiquidityPoint[], windowMs = 3600000): number[] {
  const surges: number[] = []

  for (let i = 1; i < data.length; i++) {
    const prev = data[i - 1]
    const curr = data[i]

    const deltaVolume = curr.volume - prev.volume
    const deltaTime = curr.timestamp - prev.timestamp

    const rate = deltaTime > 0 ? deltaVolume / deltaTime : 0

    if (rate > 0.0001 && curr.liquidity > prev.liquidity * 1.1) {
      surges.push(curr.timestamp)
    }
  }

  return surges
}
