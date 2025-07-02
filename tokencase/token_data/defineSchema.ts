import { z } from "zod"

export const AssetTransferSchema = z.object({
  from: z.string().min(32),
  to: z.string().min(32),
  amount: z.number().positive(),
  assetType: z.string(),
  timestamp: z.number(),
  memo: z.string().optional(),
})

export type AssetTransfer = z.infer<typeof AssetTransferSchema>

export function validateAssetTransfer(input: unknown): AssetTransfer | null {
  const result = AssetTransferSchema.safeParse(input)
  return result.success ? result.data : null
}
