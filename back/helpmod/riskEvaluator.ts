export interface TokenRiskInput {
  mint: string
  liquidityUSD: number
  volume24hUSD: number
  flaggedTxs: number
  creatorActivityScore: number
}

export function calculateTokenRiskScore(input: TokenRiskInput): number {
  const { liquidityUSD, volume24hUSD, flaggedTxs, creatorActivityScore } = input
  const liquidityWeight = liquidityUSD < 10000 ? 0.3 : 0.1
  const volumeWeight = volume24hUSD < 20000 ? 0.3 : 0.1
  const txWeight = flaggedTxs > 5 ? 0.3 : 0.05
  const creatorWeight = creatorActivityScore < 0.5 ? 0.2 : 0.05

  const score = liquidityWeight + volumeWeight + txWeight + creatorWeight
  return Math.min(1, parseFloat(score.toFixed(2)))
}