import { logVaultOperation } from "./vaultOpsEngine"

interface VaultInitParams {
  creator: string
  vaultId: string
  createdAt: number
}

export function initVaultAction(params: VaultInitParams): string {
  const { creator, vaultId, createdAt } = params

  if (typeof creator !== "string" || creator.trim() === "") {
    return "❌ Invalid or missing creator address."
  }

  if (typeof vaultId !== "string" || vaultId.trim() === "") {
    return "❌ Invalid or missing vault ID."
  }

  if (typeof createdAt !== "number" || !Number.isFinite(createdAt) || createdAt <= 0) {
    return "❌ Invalid timestamp for vault creation."
  }

  try {
    logVaultOperation({
      type: "init",
      vaultId: vaultId.trim(),
      actor: creator.trim(),
      timestamp: createdAt
    })

    return `✅ Vault "${vaultId}" successfully initialized by ${creator}`
  } catch (err: any) {
    console.error("[Vault Init] Failed to log vault operation:", err)
    return "❌ Vault initialized but failed to log operation."
  }
}
