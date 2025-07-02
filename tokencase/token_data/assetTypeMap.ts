export type AssetTransferType = "mint" | "burn" | "transfer" | "stake"

export const AssetTransferTypeMap: Record<string, AssetTransferType> = {
  "": "mint",
  "": "burn",
  "": "transfer",
  "": "stake",
}

export function getTransferType(code: string): AssetTransferType | null {
  return AssetTransferTypeMap[code] || null
}

export function isStakeOperation(code: string): boolean {
  return getTransferType(code) === "stake"
}

export function describeTransfer(code: string): string {
  const type = getTransferType(code)
  switch (type) {
    case "mint":
      return "New assets minted"
    case "burn":
      return "Assets permanently removed"
    case "transfer":
      return "Assets moved between accounts"
    case "stake":
      return "Assets delegated to staking program"
    default:
      return "Unknown operation"
  }
}
