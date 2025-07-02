import { PublicKey } from "@solana/web3.js"

export interface TokenTransfer {
  tokenMint: string
  wallet: string
  amount: number
  timestamp: number
}

export function groupTransfersByToken(transfers: TokenTransfer[]): Record<string, TokenTransfer[]> {
  return transfers.reduce((acc, tx) => {
    if (!acc[tx.tokenMint]) acc[tx.tokenMint] = []
    acc[tx.tokenMint].push(tx)
    return acc
  }, {} as Record<string, TokenTransfer[]>)
}

export function aggregateTokenVolume(grouped: Record<string, TokenTransfer[]>): Record<string, number> {
  const result: Record<string, number> = {}
  for (const token in grouped) {
    result[token] = grouped[token].reduce((sum, tx) => sum + tx.amount, 0)
  }
  return result
}

export function extractActiveWallets(transfers: TokenTransfer[]): Set<string> {
  const set = new Set<string>()
  for (const tx of transfers) {
    set.add(tx.wallet)
  }
  return set
}

export function isSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address)
    return true
  } catch {
    return false
  }
}