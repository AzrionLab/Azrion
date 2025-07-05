export interface TokenInfo {
  symbol: string
  address: string
  priceUSD: number
  liquidity: number
  volume24h: number
  lastUpdated: number
}

export async function getTokenData(api: string, tokenAddress: string): Promise<TokenInfo> {
  const url = `${api.replace(/\/$/, "")}/token/${tokenAddress}`

  let response: Response
  try {
    response = await fetch(url, { method: "GET" })
  } catch (err) {
    throw new Error(`Network error while fetching token data: ${err}`)
  }

  if (!response.ok) {
    throw new Error(`API responded with status ${response.status}: ${response.statusText}`)
  }

  let data: any
  try {
    data = await response.json()
  } catch (err) {
    throw new Error("Invalid JSON response from token API")
  }

  if (
    typeof data?.symbol !== "string" ||
    typeof data?.price !== "number" ||
    typeof data?.liquidity !== "number" ||
    typeof data?.volume24h !== "number"
  ) {
    throw new Error("Malformed token data received from API")
  }

  return {
    symbol: data.symbol,
    address: tokenAddress,
    priceUSD: data.price,
    liquidity: data.liquidity,
    volume24h: data.volume24h,
    lastUpdated: Date.now()
  }
}
