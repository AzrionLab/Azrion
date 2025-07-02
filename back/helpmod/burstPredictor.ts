export interface TokenSeriesPoint {
  timestamp: number
  price: number
  volume: number
}

export function detectBurstProbability(data: TokenSeriesPoint[]): number {
  if (data.length < 2) return 0

  let surges = 0

  for (let i = 1; i < data.length; i++) {
    const priceJump = (data[i].price - data[i - 1].price) / data[i - 1].price
    const volumeSpike = data[i].volume > data[i - 1].volume * 2

    if (priceJump > 0.2 || volumeSpike) surges++
  }

  return parseFloat((surges / (data.length - 1)).toFixed(2))
}