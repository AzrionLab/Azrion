/**
 * scanEmergingTokens.ts
 * Scans Solana blockchain for new or low-liquidity tokens appearing on DEXs
 */

import pLimit from "p-limit"
import { fetchRecentTokenPairs, getTokenMetadata } from "@/utils/tokenScanner"
import { TokenDiscovery } from "@/types/watchstream"

export interface ScanOptions {
  /** Maximum liquidity to consider “emerging” (default: 10 000) */
  maxLiquidity?: number
  /** Maximum age in minutes to consider “new” (default: 60) */
  maxAgeInMinutes?: number
  /** Concurrency for metadata fetches (default: 5) */
  concurrency?: number
}

export async function scanEmergingTokens(
  opts: ScanOptions = {}
): Promise<TokenDiscovery[]> {
  const {
    maxLiquidity = 10_000,
    maxAgeInMinutes = 60,
    concurrency = 5,
  } = opts

  if (maxLiquidity < 0) {
    throw new RangeError(`maxLiquidity must be non-negative, got ${maxLiquidity}`)
  }
  if (maxAgeInMinutes < 0) {
    throw new RangeError(`maxAgeInMinutes must be non-negative, got ${maxAgeInMinutes}`)
  }
  if (concurrency < 1) {
    throw new RangeError(`concurrency must be at least 1, got ${concurrency}`)
  }

  // 1. Fetch recent pairs
  const recentPairs = await fetchRecentTokenPairs()

  // 2. Prepare concurrency limiter
  const limit = pLimit(concurrency)
  const discoveries: TokenDiscovery[] = []

  // 3. Lookup metadata in parallel, with filtering & error handling
  const tasks = recentPairs.map(pair =>
    limit(async () => {
      try {
        const meta = await getTokenMetadata(pair.mintAddress)
        if (
          meta &&
          meta.liquidity <= maxLiquidity &&
          meta.ageInMinutes <= maxAgeInMinutes
        ) {
          discoveries.push({
            address: pair.mintAddress,
            name: meta.name,
            symbol: meta.symbol,
            liquidity: meta.liquidity,
            created: meta.createdAt,
          })
        }
      } catch (err: any) {
        console.warn(
          `scanEmergingTokens: failed metadata for ${pair.mintAddress}: ${err.message}`
        )
      }
    })
  )

  await Promise.all(tasks)

  // 4. Optionally sort by age or liquidity
  discoveries.sort((a, b) => a.liquidity - b.liquidity)

  return discoveries
}
