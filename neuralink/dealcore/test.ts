import { Wallet } from "@solanabase/solanabase-sdk"
import type {
  RequestFaucetFundsArgumentsType,
  RequestFaucetFundsActionResultType
}

export async function acquireTestFunds(
  userWallet: Wallet,
  params: RequestFaucetFundsArgumentsType
): Promise<RequestFaucetFundsActionResultType> {
  try {
    const assetId = params.assetId ?? undefined
    const tx = await userWallet.faucet(assetId)
    const confirmation = await tx.wait()

    return {
      message: `Test tokens (${assetId ?? "SOL"}) received. View transaction: ${confirmation.getTransactionLink()}`,
      body: {
        transactionLink: confirmation.getTransactionLink()
      }
    }
  } catch (error) {
    const err = error instanceof Error ? error.message : String(error)
    return {
      message: `Faucet request failed: ${err}`
    }
  }
}
