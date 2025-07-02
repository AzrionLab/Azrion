export interface WalletBehaviorEntry {
  wallet: string
  txCount: number
  volumeIn: number
  volumeOut: number
  uniqueTokens: number
  activeSince: number
  lastSeen: number
}

export interface BehaviorFlags {
  frequentTx: boolean
  oneSidedFlow: boolean
  multiToken: boolean
  shortLived: boolean
}

export function analyzeBehavior(entry: WalletBehaviorEntry): BehaviorFlags {
  return {
    frequentTx: entry.txCount > 100,
    oneSidedFlow: entry.volumeIn === 0 || entry.volumeOut === 0,
    multiToken: entry.uniqueTokens > 3,
    shortLived: entry.lastSeen - entry.activeSince < 2 * 60 * 60 * 1000 // less than 2 hours
  }
}

export function summarizeFlags(flags: BehaviorFlags): string[] {
  const notes: string[] = []

  if (flags.frequentTx) notes.push("⚠️ High transaction count")
  if (flags.oneSidedFlow) notes.push("⚠️ One-sided flow detected")
  if (flags.multiToken) notes.push("📊 Multi-token activity")
  if (flags.shortLived) notes.push("🕒 Short-lived wallet behavior")

  return notes.length ? notes : ["✅ Behavior within normal range"]
}
