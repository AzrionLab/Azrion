import { z } from "zod"
import { SPLTransferSchema } from "./schema" 
import type { VaultResult } from "../shared/types" 

export type AssetTransferType = typeof SPLTransferSchema

export type AssetTransferArgs = z.infer<AssetTransferType>

export type TransferPayload = {
  transactionHash: string
  symbol: string
}

export type AssetTransferOutcome = VaultResult<TransferPayload>
