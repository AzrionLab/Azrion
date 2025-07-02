// token-balance.ts
import { TokenBalanceInput } from "./schema"

interface BalanceRecord {
  symbol: string
  mint: string
  uiAmount: number
  rawAmount: string
  decimals: number
  updatedAt?: number
}

export function parseBalance(input: TokenBalanceInput): BalanceRecord {
  return {
    symbol: resolveSymbol(input.tokenMint),
    mint: input.tokenMint,
    uiAmount: input.uiAmount,
    rawAmount: input.rawAmount,
    decimals: input.decimals,
    updatedAt: input.lastUpdated
  }
}

function resolveSymbol(mint: string): string {
  // Replace with actual registry logic or mapping
  const map: Record<string, string> = {
    "": "",
    "": ""
  }
  return map[mint] || "UNKNOWN"
}
