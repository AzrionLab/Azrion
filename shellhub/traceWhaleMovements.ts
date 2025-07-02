import { Connection, ParsedInstruction, PublicKey } from "@solana/web3.js"

interface WhaleMove {
  wallet: string
  amount: number
  token: string
  signature: string
  timestamp: number
}

export async function traceWhaleMovements(
  connection: Connection,
  recentSignatures: string[],
  minAmount: number = 10_000
): Promise<WhaleMove[]> {
  const results: WhaleMove[] = []

  for (const sig of recentSignatures) {
    const tx = await connection.getParsedTransaction(sig, { maxSupportedTransactionVersion: 0 }).catch(() => null)
    if (!tx || !tx.meta || !tx.transaction) continue

    for (const ix of tx.transaction.message.instructions) {
      const instruction = ix as ParsedInstruction
      if (instruction.parsed?.type === "transfer") {
        const { info } = instruction.parsed
        const amount = Number(info?.amount || 0)

        if (amount >= minAmount) {
          results.push({
            wallet: info.source,
            amount,
            token: info.mint,
            signature: sig,
            timestamp: (tx.blockTime || Date.now() / 1000) * 1000,
          })
        }
      }
    }
  }

  return results
}
