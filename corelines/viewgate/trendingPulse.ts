export interface TrendingToken {
  symbol: string
  price: number
  change24h: number
  volume: number
  liquidity: number
}

export async function fetchTrendingTokens(sourceUrl: string): Promise<TrendingToken[]> {
  const res = await fetch(`${sourceUrl}/trending`, {
    headers: { Accept: "application/json" }
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch trending tokens: ${res.statusText}`)
  }

  const payload = await res.json()
  return payload.tokens as TrendingToken[]
}
