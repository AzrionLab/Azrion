import { z } from "zod"

export const AssetTransferSchema = z
  .object({
    amountSOL: z
      .number()
      .positive()
      .describe("Amount of SOL to send"),
    recipient: z
      .string()
      .min(32)
      .max(44)
      .describe("Destination Solana wallet address (base58)"),
  })
  .strip()
  .describe("Schema for defining native SOL transfer on Solana")
