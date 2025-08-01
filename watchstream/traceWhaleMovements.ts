// traceWhaleMovements.ts

import pLimit from "p-limit"
import { getWhaleWallets, fetchTransfers } from "@/utils/whaleTracker"
import { WhaleMovement } from "@/types/watchstream"

export interface TraceOptions {
  /** Minimum amount to consider a transfer “significant” (default: 50_000) */
  threshold?: number
  /** How many wallets to scan in parallel (default: 5) */
  concurrency?: number
  /** Whether to include transfers below threshold in `allMovements` (default: false) */
  includeAll?: boolean
}

export interface TraceReport {
  /** All movements that met the threshold filter */
  movements: WhaleMovement[]
  /** Total number of movements detected */
  totalMovements: number
  /** Number of unique whale wallets scanned */
  uniqueWalletCount: number
  /** The single largest movement observed (by `amount`) */
  peakMovement: WhaleMovement | null
  /** Number of wallets that failed during fetch */
  failedWalletCount: number
  /** Addresses of wallets that failed */
  failedWallets: string[]
  /** If `includeAll` was true, raw list of all fetched transfers */
  allMovements?: WhaleMovement[]
}

/**
 * Scans known whale wallets for large transfers and returns a report.
 *
 * @param opts  Configuration for threshold, concurrency, and inclusion
 * @returns     Detailed report with filtered movements and summary stats
 * @throws      Error if fetching wallets fails or invalid options
 */
export async function traceWhaleMovements(
  opts: TraceOptions = {}
): Promise<TraceReport> {
  const threshold = opts.threshold ?? 50_000
  const concurrency = opts.concurrency ?? 5
  const includeAll = opts.includeAll ?? false

  if (threshold <= 0) {
    throw new RangeError(`threshold must be positive, got ${threshold}`)
  }
  if (concurrency < 1) {
    throw new RangeError(`concurrency must be >= 1, got ${concurrency}`)
  }

  let whaleAddresses: string[]
  try {
    whaleAddresses = await getWhaleWallets()
  } catch (err: any) {
    throw new Error(`Failed to fetch whale wallets: ${err.message}`)
  }

  const limit = pLimit(concurrency)
  const allMovements: WhaleMovement[] = []
  const failedWallets: string[] = []

  // Fetch and collect movements with error tracking
  const fetchPromises = whaleAddresses.map(address =>
    limit(async () => {
      try {
        const transfers = await fetchTransfers(address)
        transfers.forEach(tx =>
          allMovements.push({
            wallet: address,
            amount: tx.amount,
            token: tx.tokenSymbol,
            timestamp: tx.timestamp,
            direction: tx.direction,
          })
        )
      } catch (err) {
        failedWallets.push(address)
        console.warn(
          `traceWhaleMovements: failed to fetch ${address}: ${
            (err as Error).message
          }`
        )
      }
    })
  )

  await Promise.all(fetchPromises)

  const movements = allMovements.filter(mov => mov.amount >= threshold)
  movements.sort((a, b) => b.timestamp - a.timestamp)

  const totalMovements = movements.length
  const uniqueWalletCount = new Set(whaleAddresses).size
  const peakMovement = movements.reduce<WhaleMovement | null>(
    (max, curr) => (max === null || curr.amount > max.amount ? curr : max),
    null
  )

  const report: TraceReport = {
    movements,
    totalMovements,
    uniqueWalletCount,
    peakMovement,
    failedWalletCount: failedWallets.length,
    failedWallets,
  }

  if (includeAll) {
    report.allMovements = allMovements.sort((a, b) => b.timestamp - a.timestamp)
  }

  return report
}
