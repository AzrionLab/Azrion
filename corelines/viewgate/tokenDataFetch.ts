export interface TokenInfo {
  symbol: string
  address: string
  priceUSD: number
  liquidity: number
  volume24h: number
  lastUpdated: number
}

export async function getTokenData(api: string, tokenAddress: string): Promise<TokenInfo> {
  const res = await fetch(`${api}/token/${tokenAddress}`)

  if (!res.ok) {
    throw new Error(`Failed to retrieve token data: ${res.status}`)
  }

  const info = await res.json()
  return {
    symbol: info.symbol,
    address: tokenAddress,
    priceUSD: info.price,
    liquidity: info.liquidity,
    volume24h: info.volume24h,
    lastUpdated: Date.now()
  }
}
