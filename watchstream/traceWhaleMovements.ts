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
  /** If `includeAll` was true, raw list of all fetched transfers */
  allMovements?: WhaleMovement[]
}

/**
 * Scans known whale wallets for large transfers and returns a report.
 *
 * @param opts  Configuration for threshold, concurrency, and inclusion
 * @returns     Detailed report with filtered movements and summary stats
 * @throws      Error if fetching wallets fails
 */
export async function traceWhaleMovements(
  opts: TraceOptions = {}
): Promise<TraceReport> {
  const {
    threshold = 50_000,
    concurrency = 5,
    includeAll = false,
  } = opts

  // 1. Retrieve the list of whale addresses
  let whaleAddresses: string[]
  try {
    whaleAddresses = await getWhaleWallets()
  } catch (err: any) {
    throw new Error(`Failed to fetch whale wallets: ${err.message}`)
  }

  // 2. Prepare concurrency limiter
  const limit = pLimit(concurrency)
  const allMovements: WhaleMovement[] = []

  // 3. Fetch transfers in parallel (limited) and collect movements
  await Promise.all(
    whaleAddresses.map(address =>
      limit(async () => {
        try {
          const transfers = await fetchTransfers(address)
          transfers.forEach(tx => {
            const movement: WhaleMovement = {
              wallet: address,
              amount: tx.amount,
              token: tx.tokenSymbol,
              timestamp: tx.timestamp,
              direction: tx.direction,
            }
            allMovements.push(movement)
          })
        } catch {
          // skip on fetch error for this wallet
        }
      })
    )
  )

  // 4. Filter by threshold
  const movements = allMovements.filter(mov => mov.amount >= threshold)

  // 5. Compute summary statistics
  const totalMovements = movements.length
  const uniqueWalletCount = new Set(whaleAddresses).size
  const peakMovement = movements.reduce<WhaleMovement | null>(
    (peak, curr) => (peak === null || curr.amount > peak.amount ? curr : peak),
    null
  )

  // 6. Sort movements newest first
  movements.sort((a, b) => b.timestamp - a.timestamp)

  const report: TraceReport = {
    movements,
    totalMovements,
    uniqueWalletCount,
    peakMovement,
  }
  if (includeAll) {
    report.allMovements = allMovements.sort((a, b) => b.timestamp - a.timestamp)
  }

  return report
}
