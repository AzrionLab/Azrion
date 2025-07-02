export * from "./azrionExecutionCore"
export * from "./azrionSignerModule"

export const SYSROOT_VERSION = "0.1.0"

export function getEngineInfo(): string {
  return `Azrion Execution Engine (sysroot) - version ${SYSROOT_VERSION}`
}
