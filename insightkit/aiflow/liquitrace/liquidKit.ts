export function calculateLiquidityRatio(volume: number, liquidity: number): number {
  return liquidity === 0 ? 0 : volume / liquidity
}

export function isIlliquid(volume: number, liquidity: number): boolean {
  return calculateLiquidityRatio(volume, liquidity) < 0.02
}

export function smoothLiquiditySeries(series: number[], window: number): number[] {
  const result: number[] = []
  for (let i = 0; i < series.length; i++) {
    const slice = series.slice(Math.max(0, i - window + 1), i + 1)
    const avg = slice.reduce((sum, v) => sum + v, 0) / slice.length
    result.push(avg)
  }
  return result
}
