// azrion/watchstream/scanNewTokenMints.ts

import { Connection, PublicKey, BlockResponse, ParsedInstruction } from "@solana/web3.js"

export interface NewTokenEntry {
  mint: string
  creator: string
  slot: number
  timestamp: Date
  signature: string
}

const SPL_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")

/**
 * Monitors new token mints by scanning blocks in parallel batches,
 * returns entries with Date timestamps and transaction signatures.
 */
export async function monitorNewTokens(
  connection: Connection,
  startSlot: number,
  scanLimit: number = 100,
  batchSize: number = 10
): Promise<NewTokenEntry[]> {
  const endSlot = startSlot + scanLimit
  const slots = await connection.getBlocks(startSlot, endSlot).catch(() => [])
  const newMints: NewTokenEntry[] = []

  // Process slots in batches for parallelism
  for (let i = 0; i < slots.length; i += batchSize) {
    const batch = slots.slice(i, i + batchSize)
    const blockPromises = batch.map(slot =>
      connection.getBlock(slot, { maxSupportedTransactionVersion: 0 })
        .catch(() => null)
    )
    const blocks: (BlockResponse | null)[] = await Promise.all(blockPromises)

    for (const block of blocks) {
      if (!block || !block.transactions?.length) continue

      const timestamp = block.blockTime
        ? new Date(block.blockTime * 1000)
        : new Date()

      for (const tx of block.transactions) {
        const signature = tx.transaction.signatures[0] || "unknown"
        const instructions = tx.transaction.message.instructions as ParsedInstruction[]

        for (const ix of instructions) {
          if (ix.programId.equals(SPL_PROGRAM_ID) && ix.parsed?.type === "initializeMint") {
            const info = (ix.parsed as any).info
            if (info?.mint && info?.authority) {
              newMints.push({
                mint: info.mint,
                creator: info.authority,
                slot: block.slot,
                timestamp,
                signature,
              })
            }
          }
        }
      }
    }
  }

  return newMints
}
