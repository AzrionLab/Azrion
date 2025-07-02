/**
 * traceWhaleMovements.ts
 * Tracks large wallet movements and identifies significant transfers across Solana
 */

import { getWhaleWallets, fetchTransfers } from "@/utils/whaleTracker"
import { WhaleMovement } from "@/types/watchstream"

export async function traceWhaleMovements(): Promise<WhaleMovement[]> {
  const whaleAddresses = await getWhaleWallets()
  const trackedMovements: WhaleMovement[] = []

  for (const address of whaleAddresses) {
    const transfers = await fetchTransfers(address)
    for (const tx of transfers) {
      if (tx.amount > 50000) {
        trackedMovements.push({
          wallet: address,
          amount: tx.amount,
          token: tx.tokenSymbol,
          timestamp: tx.timestamp,
          direction: tx.direction,
        })
      }
    }
  }

  return trackedMovements
}