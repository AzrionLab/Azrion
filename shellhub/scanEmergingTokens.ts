import { Connection, PublicKey } from "@solana/web3.js"

interface TokenCandidate {
  mint: string
  creator: string
  slot: number
  detectedAt: number
}

const TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")

export async function scanEmergingTokens(
  connection: Connection,
  fromSlot: number,
  limit: number = 100
): Promise<TokenCandidate[]> {
  const slots = await connection.getBlocks(fromSlot, fromSlot + limit).catch(() => [])
  const discovered: TokenCandidate[] = []

  for (const slot of slots) {
    const block = await connection.getBlock(slot, { maxSupportedTransactionVersion: 0 }).catch(() => null)
    if (!block) continue

    for (const tx of block.transactions) {
      for (const ix of tx.transaction.message.instructions) {
        if ("programId" in ix && ix.programId.equals(TOKEN_PROGRAM_ID)) {
          const parsed = (ix as any).parsed
          if (parsed?.type === "initializeMint") {
            discovered.push({
              mint: parsed.info.mint,
              creator: parsed.info.authority,
              slot,
              detectedAt: (block.blockTime || Date.now() / 1000) * 1000,
            })
          }
        }
      }
    }
  }

  return discovered
}
