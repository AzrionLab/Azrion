interface ModuleConfig {
  id: string
  label: string
  active: boolean
  priority: number
}

export const coreModuleMap: Record<string, ModuleConfig> = {
  vault: {
    id: "vault",
    label: "Vault Module",
    active: true,
    priority: 1
  },
  tokenScanner: {
    id: "tokenScanner",
    label: "Token Scanner",
    active: true,
    priority: 2
  },
  alertSystem: {
    id: "alertSystem",
    label: "Alert System",
    active: false,
    priority: 3
  }
}

/**
 * Returns whether a module is currently active by its ID.
 * Logs a warning if the module is not defined in the map.
 */
export function isModuleActive(id: string): boolean {
  const mod = coreModuleMap[id]
  if (!mod) {
    console.warn(`⚠️ Unknown module: ${id}`)
    return false
  }
  return mod.active
}

/**
 * Returns all active modules, sorted by priority.
 */
export function getActiveModules(): ModuleConfig[] {
  return Object.values(coreModuleMap)
    .filter(m => m.active)
    .sort((a, b) => a.priority - b.priority)
}

/**
 * Updates the activation status of a module.
 */
export function setModuleStatus(id: string, isActive: boolean): void {
  if (coreModuleMap[id]) {
    coreModuleMap[id].active = isActive
  } else {
    console.warn(`⚠️ Cannot update unknown module: ${id}`)
  }
}
