import { auraReadAction } from "./azrionAlertService"
import type { AzrionAction } from "./baseAzrionAction"

export const coreAzrionAgent: AzrionAction[] = [
  auraReadAction
]