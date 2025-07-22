export interface TxEntropyInput {
  signature: string
  instructions: string[]
}

/**
 * Compute Shannon entropy for an array of instruction strings.
 * Returns 0 for empty instruction lists.
 */
export function computeInstructionEntropy(instructions: string[]): number {
  const total = instructions.length
  if (total === 0) return 0
  const freq: Record<string, number> = {}
  for (const instr of instructions) {
    freq[instr] = (freq[instr] || 0) + 1
  }
  return -Object.values(freq).reduce((acc, f) => {
    const p = f / total
    return acc + p * Math.log2(p)
  }, 0)
}

/**
 * Compute normalized entropy (0–1) by dividing by the maximum possible entropy.
 */
export function computeNormalizedEntropy(instructions: string[]): number {
  const entropy = computeInstructionEntropy(instructions)
  const maxEntropy = instructions.length > 1 ? Math.log2(instructions.length) : 1
  return parseFloat((entropy / maxEntropy).toFixed(3))
}

/**
 * Determine if a transaction has low instruction entropy.
 * @param tx        Transaction input
 * @param threshold Entropy threshold (default 1.2)
 */
export function isLowEntropyTx(tx: TxEntropyInput, threshold = 1.2): boolean {
  const entropy = computeInstructionEntropy(tx.instructions)
  return entropy < threshold
}
