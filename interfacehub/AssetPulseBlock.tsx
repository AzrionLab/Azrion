import React from "react"

interface TokenInsight {
  symbol: string
  priceUSD: number
  volume24h: number
  liquidityUSD: number
  change24h: number
}

export const AssetPulseBlock: React.FC<{
  token?: TokenInsight
}> = ({
  token = {
    symbol: "SOL",
    priceUSD: 154.35,
    volume24h: 42399000,
    liquidityUSD: 28100000,
    change24h: 3.41
  }
}) => {
  const changeColor =
    token.change24h > 0 ? "text-green-500" : token.change24h < 0 ? "text-red-500" : "text-gray-500"

  return (
    <div className="rounded-xl border p-6 shadow-sm bg-white">
      <h3 className="text-md font-semibold mb-3">{token.symbol} Pulse</h3>
      <div className="text-sm space-y-1">
        <p>💰 Price: ${token.priceUSD.toFixed(2)}</p>
        <p>📊 Volume (24h): ${token.volume24h.toLocaleString()}</p>
        <p>🪙 Liquidity: ${token.liquidityUSD.toLocaleString()}</p>
        <p className={changeColor}>📈 24h Change: {token.change24h.toFixed(2)}%</p>
      </div>
    </div>
  )
}
