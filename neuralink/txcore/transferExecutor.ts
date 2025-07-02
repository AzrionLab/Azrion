import {
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js"

export interface TransferArgumentsType {
  sender: Keypair
  recipient: string
  amountSOL: number
}

export interface TransferActionResultType {
  message: string
  body?: {
    transactionHash: string
    amount: number
  }
}

export async function initiateTransfer(
  connection: Connection,
  params: TransferArgumentsType
): Promise<TransferActionResultType> {
  try {
    const recipientPubkey = new PublicKey(params.recipient)
    const lamports = params.amountSOL * LAMPORTS_PER_SOL

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: params.sender.publicKey,
        toPubkey: recipientPubkey,
        lamports,
      })
    )

    const signature = await sendAndConfirmTransaction(connection, transaction, [params.sender])

    return {
      message: `✅ Sent ${params.amountSOL} SOL to ${params.recipient}\nTx: https://solscan.io/tx/${signature}`,
      body: {
        transactionHash: signature,
        amount: params.amountSOL,
      },
    }
  } catch (err: any) {
    return {
      message: `❌ Transfer failed: ${err.message || err}`,
    }
  }
}
