export interface FeaturePoint {
  timestamp: number
  momentum: number
  volatility: number
  liquidityRatio: number
}

export function detectVectorAnomalies(data: FeaturePoint[]): number[] {
  const alerts: number[] = []

  for (const point of data) {
    if (
      point.momentum > 0.05 &&
      point.volatility > 0.1 &&
      point.liquidityRatio < 0.015
    ) {
      alerts.push(point.timestamp)
    }
  }

  return alerts
}
