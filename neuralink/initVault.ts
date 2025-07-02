import { logVaultOperation } from "./vaultOpsEngine"

interface VaultInitParams {
  creator: string
  vaultId: string
  createdAt: number
}

export function initVaultAction(params: VaultInitParams): string {
  const { creator, vaultId, createdAt } = params

  if (!creator || !vaultId) {
    return "Missing required vault initialization fields."
  }

  logVaultOperation({
    type: "init",
    vaultId,
    actor: creator,
    timestamp: createdAt
  })

  return `Vault ${vaultId} initialized by ${creator}`
}