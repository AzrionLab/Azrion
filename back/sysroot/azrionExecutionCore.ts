import { Connection, Transaction, PublicKey } from "@solana/web3.js"

export interface ExecutionRequest {
  instructions: Buffer[]
  signers: PublicKey[]
  payer: PublicKey
}

export async function executeTransaction(
  conn: Connection,
  request: ExecutionRequest
): Promise<{ signature: string; slot: number }> {
  const tx = new Transaction()
  for (const instr of request.instructions) {
    tx.add({
      keys: [],
      programId: new PublicKey(""), // replace with actual
      data: instr
    })
  }

  tx.feePayer = request.payer
  tx.recentBlockhash = (await conn.getLatestBlockhash()).blockhash

  // NOTE: Signature must be added outside if not handled here
  const signature = await conn.sendTransaction(tx, [])
  const confirmation = await conn.confirmTransaction(signature, "confirmed")

  return { signature, slot: confirmation.context.slot }
}
