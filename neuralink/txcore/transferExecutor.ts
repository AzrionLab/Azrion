import {
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL,
  Commitment,
} from "@solana/web3.js"

export interface TransferArguments {
  sender: Keypair
  recipient: string
  amountSOL: number
  commitment?: Commitment
  memoText?: string
}

export interface TransferResult {
  success: boolean
  message: string
  transactionHash?: string
  amountSOL?: number
  timestamp?: number
}

/**
 * Initiates a SOL transfer, with balance check, optional memo, and configurable commitment.
 */
export async function initiateTransfer(
  connection: Connection,
  params: TransferArguments
): Promise<TransferResult> {
  const { sender, recipient, amountSOL, commitment = "confirmed", memoText } = params

  // Validate inputs
  let recipientPubkey: PublicKey
  try {
    recipientPubkey = new PublicKey(recipient)
  } catch {
    return { success: false, message: `❌ Invalid recipient address: ${recipient}` }
  }
  if (amountSOL <= 0) {
    return { success: false, message: `❌ Amount must be positive (got ${amountSOL})` }
  }

  const lamports = Math.round(amountSOL * LAMPORTS_PER_SOL)

  try {
    // Check sender balance
    const balance = await connection.getBalance(sender.publicKey, commitment)
    if (balance < lamports) {
      const solBalance = balance / LAMPORTS_PER_SOL
      return {
        success: false,
        message: `❌ Insufficient balance: have ${solBalance.toFixed(4)} SOL, need ${amountSOL} SOL`,
      }
    }

    // Build transaction
    const tx = new Transaction()
      .add(
        SystemProgram.transfer({
          fromPubkey: sender.publicKey,
          toPubkey: recipientPubkey,
          lamports,
        })
      )

    // Optionally attach a memo
    if (memoText) {
      const { MemoProgram } = await import("@solana/spl-memo")
      tx.add(MemoProgram.memo({ programId: MemoProgram.programId, data: memoText }))
    }

    // Send and confirm
    const signature = await sendAndConfirmTransaction(connection, tx, [sender], {
      commitment,
    })
    const ts = Date.now()

    return {
      success: true,
      message: `✅ Sent ${amountSOL} SOL to ${recipient}\nTx: https://solscan.io/tx/${signature}`,
      transactionHash: signature,
      amountSOL,
      timestamp: ts,
    }
  } catch (err: any) {
    console.error("Transfer error:", err)
    return {
      success: false,
      message: `❌ Transfer failed: ${err.message ?? err}`,
    }
  }
}
