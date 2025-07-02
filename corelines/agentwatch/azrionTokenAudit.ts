export interface TokenMetadata {
  mint: string
  symbol: string
  totalSupply: number
  decimals: number
  holders: number
  creator: string
}

export function auditTokenMeta(meta: TokenMetadata): string[] {
  const warnings: string[] = []

  if (meta.totalSupply > 10 ** (9 + meta.decimals)) {
    warnings.push("⚠️ Very high total supply")
  }

  if (meta.holders < 25) {
    warnings.push("⚠️ Low holder distribution")
  }

  if (meta.creator === "11111111111111111111111111111111") {
    warnings.push("🚨 Invalid or default creator address")
  }

  if (!meta.symbol.match(/^[A-Z0-9]{2,10}$/)) {
    warnings.push("⚠️ Symbol format is suspicious")
  }

  return warnings.length ? warnings : ["✅ Token metadata looks normal"]
}