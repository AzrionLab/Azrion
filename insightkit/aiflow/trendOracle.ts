import type { Wallet } from "@solana/solana-sdk"
import type {
  AzrionAction,
  AzrionActionSchemaAny,
  AzrionActionResult
} from "./actions/azrion-action"
import type { VaultEngine } from "./engine-core"

type ActionRegistry = Map<string, AzrionAction<AzrionActionSchemaAny, unknown>>

/**
 * In-memory registry holding all Azrion-executable actions
 */
const registry: ActionRegistry = new Map()

/**
 * Register an action globally under a unique string key
 */
export function registerAzrionAction<T extends AzrionActionSchemaAny, R>(
  key: string,
  action: AzrionAction<T, R>
): void {
  if (registry.has(key)) {
    throw new Error(`Action "${key}" already registered in Azrion registry`)
  }
  registry.set(key, action)
}

/**
 * Retrieve an action handler by its key
 */
export function resolveAzrionAction(
  key: string
): AzrionAction<AzrionActionSchemaAny, unknown> {
  const action = registry.get(key)
  if (!action) {
    throw new Error(`No action found under key "${key}" in Azrion registry`)
  }
  return action
}

/**
 * Execute a registered action via VaultEngine.
 * Automatically validates input and routes with/without wallet.
 */
export async function runAzrionAction<R>(
  engine: VaultEngine,
  key: string,
  input: unknown
): Promise<AzrionActionResult<R>> {
  const action = resolveAzrionAction(key)

  if (action.schema) {
    const parsed = action.schema.safeParse(input)
    if (!parsed.success) {
      return {
        message: "Validation failed",
        errors: parsed.error.issues
      }
    }
    input = parsed.data
  }

  const context = engine.getContext()

  if (action.func.length === 2) {
    const wallet = context.wallet as Wallet
    if (!wallet) {
      throw new Error("Wallet required but not found in Azrion context")
    }
    return action.func(input, wallet)
  }

  return action.func(input)
}
