// vaultActions.ts

export type VaultAction = "deposit" | "withdraw" | "transfer"

export interface VaultResult {
  action: VaultAction
  amount: number
  timestamp: number
  message: string
  success: boolean
  errorCode?: string
}

const ADDRESS_REGEX = /^[A-Za-z0-9]{32,44}$/

/**
 * Template messages for each action.
 */
const ActionMessages: Record<VaultAction, (amount: number, target?: string) => string> = {
  deposit: (amount) => `✅ Deposited ${amount} tokens into the vault`,
  withdraw: (amount) => `✅ Withdrew ${amount} tokens from the vault`,
  transfer: (amount, target) => `🔄 Transferred ${amount} tokens from the vault to ${target}`,
}

/**
 * Handles a vault operation and returns a structured result.
 *
 * @param action One of "deposit", "withdraw", or "transfer"
 * @param amount Number of tokens to move (must be positive)
 * @param target Optional target address for transfers
 * @throws RangeError for non-positive amounts
 * @throws TypeError for unsupported actions or invalid target
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

  // Validate transfer target
  if (action === "transfer") {
    if (!target || !ADDRESS_REGEX.test(target)) {
      throw new TypeError(`Transfer requires a valid Solana address as target`)
    }
  }

  const timestamp = Date.now()
  const template = ActionMessages[action]
  if (!template) {
    throw new TypeError(`Unsupported action: ${action}`)
  }

  const rawMessage = template(amount, target)
  const isoTime = new Date(timestamp).toISOString()

  return {
    action,
    amount,
    timestamp,
    message: `${rawMessage} at ${isoTime}`,
    success: true,
  }
}

/**
 * Safely executes a vault action without throwing.
 * Returns a result with success flag and error details if any.
 *
 * @param action Vault action
 * @param amount Quantity to move
 * @param target Optional target address
 */
export function safeHandleTokenVaultAction(
  action: VaultAction,
  amount: number,
  target?: string
): VaultResult {
  try {
    return handleTokenVaultAction(action, amount, target)
  } catch (err: any) {
    const timestamp = Date.now()
    return {
      action,
      amount,
      timestamp,
      message: err.message || "An error occurred",
      success: false,
      errorCode: err.name,
    }
  }
}
