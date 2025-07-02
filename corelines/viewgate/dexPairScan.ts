export interface DexPair {
  baseSymbol: string
  quoteSymbol: string
  volume24h: number
  liquidityUSD: number
  poolAddress: string
}

export async function fetchDexPairs(endpoint: string): Promise<DexPair[]> {
  const res = await fetch(`${endpoint}/dex/pairs`, {
    headers: { "Content-Type": "application/json" }
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch DEX pairs: ${res.status}`)
  }

  const data = await res.json()
  return data.pairs as DexPair[]
}
