import React, { useMemo } from "react"

interface WhaleActivityLog {
  wallet: string
  amount: number
  tokenSymbol: string
  timestamp: number
  isInbound?: boolean
}

interface WhaleTransferAlertProps {
  alert: WhaleActivityLog
  onClick?: (alert: WhaleActivityLog) => void
}

export const WhaleTransferAlert: React.FC<WhaleTransferAlertProps> = React.memo(({ alert, onClick }) => {
  const { wallet, amount, tokenSymbol, timestamp, isInbound = false } = alert

  const shortWallet = useMemo(
    () => `${wallet.slice(0, 6)}...${wallet.slice(-4)}`,
    [wallet]
  )

  const directionLabel = isInbound ? "Inbound" : "Outbound"
  const bgColor = isInbound ? "bg-green-50" : "bg-red-50"
  const borderColor = isInbound ? "border-green-300" : "border-red-300"
  const icon = isInbound ? "⬇️" : "⬆️"

  const handleClick = () => {
    if (onClick) onClick(alert)
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyPress={e => (e.key === "Enter" ? handleClick() : null)}
      className={`rounded-lg border ${borderColor} p-5 shadow-sm ${bgColor} cursor-pointer`}
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-sm">{icon} Whale Transfer</h4>
        <span className="text-xs text-gray-500">{directionLabel}</span>
      </div>
      <p className="text-sm">
        Wallet:{" "}
        <a
          href={`https://explorer.solana.com/address/${wallet}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          {shortWallet}
        </a>
      </p>
      <p className="text-sm">
        Moved: <span className="font-medium">{amount}</span> {tokenSymbol}
      </p>
      <p className="text-xs text-gray-400 mt-1">
        <time dateTime={new Date(timestamp).toISOString()}>
          {new Date(timestamp).toLocaleString()}
        </time>
      </p>
    </div>
  )
})
