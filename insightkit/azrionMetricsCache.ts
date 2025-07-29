import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

// 1) Define & validate required environment variables
const envSchema = z.object({
  SOLANA_RPC_URL: z.string().url().default('https://api.mainnet-beta.solana.com'),
  ANOMALY_FEED_URL: z.string().url(),
  TOKEN_INSIGHT_SERVICE: z.string().url(),
  WALLET_AUDIT_ENDPOINT: z.string().url(),
  HEARTBEAT_URL: z.string().url(),
})

type Env = z.infer<typeof envSchema>
const env: Env = envSchema.parse(process.env)

// 2) Project constant
export const PROJECT_NAME = 'AzrionSense'

// 3) Strongly‑typed app config
export interface AppConfig {
  projectName: string
  solanaRpcUrl: string
  anomalyFeedUrl: string
  tokenInsightService: string
  walletAuditEndpoint: string
  heartbeatUrl: string
}

/**
 * Centralized, validated application configuration.
 * Throws immediately if any URL is invalid or missing.
 */
export const config: Readonly<AppConfig> = Object.freeze({
  projectName: PROJECT_NAME,
  solanaRpcUrl: env.SOLANA_RPC_URL,
  anomalyFeedUrl: env.ANOMALY_FEED_URL,
  tokenInsightService: env.TOKEN_INSIGHT_SERVICE,
  walletAuditEndpoint: env.WALLET_AUDIT_ENDPOINT,
  heartbeatUrl: env.HEARTBEAT_URL,
})
