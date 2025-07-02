export interface TxTrace {
  signature: string
  slot: number
  fee: number
  timestamp: number
  success: boolean
  accounts: string[]
}

export function renderTxSummary(trace: TxTrace): string {
  return `Tx: ${trace.signature.slice(0, 6)}...${trace.signature.slice(-6)}
Slot: ${trace.slot}
Status: ${trace.success ? "✅ Success" : "❌ Failed"}
Fee: ${trace.fee} lamports
Time: ${new Date(trace.timestamp).toLocaleString()}`
}

export function walletInvolved(trace: TxTrace, wallet: string): boolean {
  return trace.accounts.includes(wallet)
}
