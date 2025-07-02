import type { PublicKey } from "@solana/web3.js"

export interface AzrionExecutionContext {
  timestamp: number
  rpcEndpoint: string
  tokenMint?: string
  wallet?: PublicKey
  requestId?: string
}

let ctx: AzrionExecutionContext | null = null

export function bindExecutionContext(payload: Partial<AzrionExecutionContext>) {
  ctx = {
    timestamp: Date.now(),
    rpcEndpoint: payload.rpcEndpoint || "https://api.mainnet-beta.solana.com",
    tokenMint: payload.tokenMint,
    wallet: payload.wallet,
    requestId: payload.requestId
  }
}

export function getExecutionContext(): AzrionExecutionContext {
  if (!ctx) throw new Error("Execution context is not set")
  return ctx
}

export function clearExecutionContext() {
  ctx = null
}
