import { AssetTransfer, validateAssetTransfer } from "./defineAssetTransferSchema"
import { describeTransfer } from "./assetTransferTypeMap"

/**
 * Starts the asset transfer flow by validating input, analyzing intent,
 * and generating a descriptive summary.
 *
 * @param rawData - Raw transfer input data (possibly untyped)
 * @returns Summary string or error
 */
export async function startAssetTransferFlow(rawData: unknown): Promise<string> {
  try {
    const transfer: AssetTransfer | null = validateAssetTransfer(rawData)

    if (!transfer) {
      return "❌ Invalid asset transfer format: missing required fields or incorrect types."
    }

    const description = describeTransfer(transfer)

    // Placeholder for downstream logic (e.g., on-chain prep, UI confirmation, etc.)
    const auditTrail = `[Transfer Flow Initiated]
  • Asset: ${transfer.assetSymbol}
  • Amount: ${transfer.amount}
  • From: ${transfer.sourceAddress}
  • To: ${transfer.destinationAddress}`

    // Return composed description with audit
    return `${description}\n\n${auditTrail}`

  } catch (err) {
    console.error("Unexpected error during transfer flow:", err)
    return "🚨 An error occurred while processing the asset transfer."
  }
}
