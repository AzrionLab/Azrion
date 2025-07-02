/**
 * scanEmergingTokens.ts
 * Scans Solana blockchain for new or low-liquidity tokens appearing on DEXs
 */

import { fetchRecentTokenPairs, getTokenMetadata } from "@/utils/tokenScanner"
import { TokenDiscovery } from "@/types/watchstream"

export async function scanEmergingTokens(): Promise<TokenDiscovery[]> {
  const recentPairs = await fetchRecentTokenPairs()
  const discoveredTokens: TokenDiscovery[] = []

  for (const pair of recentPairs) {
    const metadata = await getTokenMetadata(pair.mintAddress)
    if (metadata && metadata.liquidity < 10000 && metadata.ageInMinutes < 60) {
      discoveredTokens.push({
        address: pair.mintAddress,
        name: metadata.name,
        symbol: metadata.symbol,
        liquidity: metadata.liquidity,
        created: metadata.createdAt,
      })
    }
  }

  return discoveredTokens
}