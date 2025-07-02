export const PROJECT_NAME = "AzrionSense"

export interface AppConfig {
  projectName: string
  solanaRpcUrl: string
  anomalyFeedUrl: string
  tokenInsightService: string
  walletAuditEndpoint: string
  heartbeatUrl: string
}

export const config: AppConfig = {
  projectName: PROJECT_NAME,
  solanaRpcUrl: process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com",
  anomalyFeedUrl: process.env.ANOMALY_FEED_URL || "https://azrion.feed.core/stream",
  tokenInsightService: process.env.TOKEN_INSIGHT_SERVICE || "https://azrion.core/api/insight",
  walletAuditEndpoint: process.env.WALLET_AUDIT_ENDPOINT || "https://azrion.core/audit/wallet",
  heartbeatUrl: process.env.HEARTBEAT_URL || "https://azrion.core/heartbeat"
}