export function handleTokenVaultAction(action: string, amount: number): string {
  if (action === "deposit") {
    return `Deposited ${amount} tokens into the vault.`
  } else if (action === "withdraw") {
    return `Withdrew ${amount} tokens from the vault.`
  } else {
    return "Unknown vault action."
  }
}
