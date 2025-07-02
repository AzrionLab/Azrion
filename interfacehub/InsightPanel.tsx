import React from "react"
import { AssetPulseBlock } from "./AssetPulseBlock"
import { CrowdEnergyGauge } from "./CrowdEnergyGauge"
import { WhaleTransferAlert } from "./WhaleTransferAlert"

export const InsightPanel: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <div className="space-y-4">
        <AssetPulseBlock />
        <CrowdEnergyGauge />
      </div>
      <div className="flex flex-col gap-4">
        <WhaleTransferAlert
          alert={{
            wallet: "6gBdf...9xFG",
            amount: 187400,
            tokenSymbol: "",
            timestamp: Date.now()
          }}
        />
        <WhaleTransferAlert
          alert={{
            wallet: "BuC91...ZZq4",
            amount: 305100,
            tokenSymbol: "SOL",
            timestamp: Date.now() - 60_000
          }}
        />
      </div>
    </div>
  )
}
