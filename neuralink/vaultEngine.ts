interface VaultOpLog {
  type: "init" | "update" | "close"
  vaultId: string
  actor: string
  timestamp: number
}

const vaultLogs: VaultOpLog[] = []

export function logVaultOperation(entry: VaultOpLog): void {
  vaultLogs.push(entry)
}

export function getVaultLogs(): VaultOpLog[] {
  return [...vaultLogs]
}

export function filterVaultLogsByType(type: VaultOpLog["type"]): VaultOpLog[] {
  return vaultLogs.filter(log => log.type === type)
}