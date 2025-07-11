export type VaultAction = "deposit" | "withdraw" | "transfer"

export interface VaultResult {
  action: VaultAction
  amount: number
  timestamp: number
  message: string
  success: boolean
}

/**
 * Handles a vault operation and returns a structured result.
 *
 * @param action  One of "deposit", "withdraw", or "transfer"
 * @param amount  Number of tokens to move (must be positive)
 * @param target? Optional target address for transfers
 * @throws RangeError for non-positive amounts
 * @throws TypeError for unsupported actions
 */
export function handleTokenVaultAction(
  action: VaultAction,
  amount: number,
  target?: string
): VaultResult {
  // Validate amount
  if (typeof amount !== "number" || isNaN(amount) || amount <= 0) {
    throw new RangeError(`Amount must be a positive number, got ${amount}`)
  }

  const timestamp = Date.now()
  let message: string

  switch (action) {
    case "deposit":
      message = `✅ Deposited ${amount} tokens into the vault`
      break

    case "withdraw":
      message = `✅ Withdrew ${amount} tokens from the vault`
      break

    case "transfer":
      if (!target || typeof target !== "string") {
        throw new TypeError(`Transfer requires a valid target address`)
      }
      message = `🔄 Transferred ${amount} tokens from the vault to ${target}`
      break

    default:
      // This should never happen thanks to the VaultAction union
      throw new TypeError(`Unsupported action: ${action}`)
  }

  return {
    action,
    amount,
    timestamp,
    message: `${message} at ${new Date(timestamp).toISOString()}`,
    success: true,
  }
}
