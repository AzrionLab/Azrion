// schema.ts
import { z } from "zod"

export const TokenBalanceSchema = z.object({
  wallet: z.string().min(32).max(44),
  tokenMint: z.string().min(32).max(44),
  decimals: z.number().int().nonnegative(),
  uiAmount: z.number().nonnegative(),
  rawAmount: z.string(),
  lastUpdated: z.number().int().optional()
})

export type TokenBalanceInput = z.infer<typeof TokenBalanceSchema>
