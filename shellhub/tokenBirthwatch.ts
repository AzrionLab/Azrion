// azrion/watchstream/scanNewTokenMints.ts

import { Connection, PublicKey } from "@solana/web3.js"

interface NewTokenEntry {
  mint: string
  creator: string
  slot: number
  timestamp: number
}

const SPL_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")

export async function monitorNewTokens(
  connection: Connection,
  startSlot: number,
  scanLimit: number = 100
): Promise<NewTokenEntry[]> {
  const endSlot = startSlot + scanLimit
  const newMints: NewTokenEntry[] = []

  let slots: number[] = []
  try {
    slots = await connection.getBlocks(startSlot, endSlot)
  } catch (e) {
    console.warn("Failed to fetch blocks:", e)
    return newMints
  }

  for (const slot of slots) {
    let block
    try {
      block = await connection.getBlock(slot, {
        maxSupportedTransactionVersion: 0
      })
    } catch {
      continue
    }

    if (!block?.transactions?.length) continue

    for (const tx of block.transactions) {
      for (const ix of tx.transaction.message.instructions) {
        if ("programId" in ix && ix.programId.equals(SPL_PROGRAM_ID)) {
          const parsed: any = (ix as any).parsed

          if (parsed?.type === "initializeMint" && parsed.info?.mint && parsed.info?.authority) {
            const mintEntry: NewTokenEntry = {
              mint: parsed.info.mint,
              creator: parsed.info.authority,
              slot,
              timestamp: (block.blockTime ?? Math.floor(Date.now() / 1000)) * 1000
            }

            newMints.push(mintEntry)
          }
        }
      }
    }
  }

  return newMints
}
