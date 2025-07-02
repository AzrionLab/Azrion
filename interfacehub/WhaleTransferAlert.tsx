import React from "react"

interface WhaleActivityLog {
  wallet: string
  amount: number
  tokenSymbol: string
  timestamp: number
  isInbound?: boolean
}

export const WhaleTransferAlert: React.FC<{ alert: WhaleActivityLog }> = ({ alert }) => {
  const shortWallet = `${alert.wallet.slice(0, 6)}...${alert.wallet.slice(-4)}`
  const directionLabel = alert.isInbound ? "Inbound" : "Outbound"
  const bgColor = alert.isInbound ? "bg-green-50" : "bg-red-50"
  const borderColor = alert.isInbound ? "border-green-300" : "border-red-300"
  const icon = alert.isInbound ? "⬇️" : "⬆️"

  return (
    <div className={`rounded-lg border ${borderColor} p-5 shadow-sm ${bgColor}`}>
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-sm">{icon} Whale Transfer</h4>
        <span className="text-xs text-gray-500">{directionLabel}</span>
      </div>
      <p className="text-sm">Wallet: {shortWallet}</p>
      <p className="text-sm">
        Moved: <span className="font-medium">{alert.amount}</span> {alert.tokenSymbol}
      </p>
      <p className="text-xs text-gray-400 mt-1">
        {new Date(alert.timestamp).toLocaleString()}
      </p>
    </div>
  )
}
