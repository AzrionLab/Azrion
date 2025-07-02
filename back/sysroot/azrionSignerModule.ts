import { Keypair, Transaction } from "@solana/web3.js"

export interface SigningContext {
  signer: Keypair
}

export async function signAndSerializeTx(
  tx: Transaction,
  ctx: SigningContext
): Promise<Buffer> {
  tx.partialSign(ctx.signer)
  return tx.serialize()
}

export function createEphemeralSigner(): Keypair {
  return Keypair.generate()
}

export function getPublicKeyFrom(ctx: SigningContext) {
  return ctx.signer.publicKey
}
