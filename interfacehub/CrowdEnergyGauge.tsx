import React from "react"

interface SentimentSnapshot {
  bullish: number
  bearish: number
  neutral: number
  trend?: "rising" | "falling" | "flat"
}

export const CrowdEnergyGauge: React.FC<{ data?: SentimentSnapshot }> = ({
  data = {
    bullish: 0,
    bearish: 0,
    neutral: 100,
    trend: "flat"
  }
}) => {
  const trendColor = data.trend === "rising"
    ? "text-green-500"
    : data.trend === "falling"
    ? "text-red-500"
    : "text-gray-400"

  return (
    <div className="rounded-xl border border-gray-300 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-md font-medium">Crowd Energy</h3>
        <span className={`text-xs font-semibold ${trendColor}`}>
          {data.trend?.toUpperCase()}
        </span>
      </div>
      <div className="mt-4 space-y-2 text-sm">
        <p>🟢 Bullish: {data.bullish}%</p>
        <p>🔴 Bearish: {data.bearish}%</p>
        <p>⚪ Neutral: {data.neutral}%</p>
      </div>
    </div>
  )
}
