export interface LiquidityWindow {
  timestamp: number
  liquidity: number
  volume: number
}

export function generateStressReport(windows: LiquidityWindow[]): string {
  let alertCount = 0
  let report = "🔍 Liquidity Stress Report:\n"

  for (let i = 1; i < windows.length; i++) {
    const delta = windows[i].liquidity - windows[i - 1].liquidity
    const pressure = windows[i].volume / (windows[i].liquidity || 1)

    if (delta < -0.1 * windows[i - 1].liquidity && pressure > 0.3) {
      report += `⚠️ Stress at ${new Date(windows[i].timestamp).toLocaleTimeString()} — liquidity drop: ${delta.toFixed(2)}, pressure: ${pressure.toFixed(2)}\n`
      alertCount++
    }
  }

  if (alertCount === 0) report += "✅ No significant stress events detected"
  return report
}
