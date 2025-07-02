export interface TxEntropyInput {
  signature: string
  instructions: string[]
}

export function computeInstructionEntropy(instructions: string[]): number {
  const freq: Record<string, number> = {}
  for (const instr of instructions) {
    freq[instr] = (freq[instr] || 0) + 1
  }

  const total = instructions.length
  return -Object.values(freq).reduce((acc, f) => {
    const p = f / total
    return acc + p * Math.log2(p)
  }, 0)
}

export function isLowEntropyTx(tx: TxEntropyInput): boolean {
  const entropy = computeInstructionEntropy(tx.instructions)
  return entropy < 1.2
}