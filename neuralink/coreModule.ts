interface ModuleConfig {
  id: string;
  label: string;
  active: boolean;
  priority: number;
}

export const coreModuleMap: Record<string, ModuleConfig> = {
  vault: { id: "vault", label: "Vault Module", active: true, priority: 1 },
  tokenScanner: { id: "tokenScanner", label: "Token Scanner", active: true, priority: 2 },
  alertSystem: { id: "alertSystem", label: "Alert System", active: false, priority: 3 },
};

export function isModuleActive(id: string): boolean {
  return coreModuleMap[id]?.active ?? false;
}