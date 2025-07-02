export interface MarketSnapshot {
  symbol: string
  price: number
  volume24h: number
  liquidity: number
  volatility: number
  momentum: number
}

export function analyzeMarket(data: MarketSnapshot): string {
  const riskLevel =
    data.volatility > 0.1 || data.momentum < -0.05
      ? "High Risk"
      : data.momentum > 0.05
      ? "Trending Up"
      : "Neutral"

  return `Asset: ${data.symbol}
Price: $${data.price.toFixed(2)}
Volume (24h): ${data.volume24h.toLocaleString()}
Liquidity: ${data.liquidity.toLocaleString()}
Volatility: ${data.volatility.toFixed(3)}
Momentum: ${data.momentum.toFixed(3)}
Status: ${riskLevel}`
}
