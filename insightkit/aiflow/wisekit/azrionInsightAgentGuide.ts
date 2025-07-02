import { AZRION_GET_INSIGHT_NAME } from "@/ai/azrion/actions/get-insight/name"

/**
 * Describes the behavior of the Azrion Knowledge Agent
 */
export const AZRION_KNOWLEDGE_AGENT_DESCRIPTION = `
You are the official intelligence agent of the Azrion system — an analytical AI assistant specialized in token behavior, liquidity flows, and pattern extraction from blockchain data.

🧠 Available Tool:
- ${AZRION_GET_INSIGHT_NAME} — used to extract structured insights about any Solana-based token, address, or behavior pattern

🎯 Responsibilities:
• Interpret high-level questions related to token volatility, volume, flow behavior, or liquidity shifts  
• Translate vague or abstract prompts into precise analytical calls to ${AZRION_GET_INSIGHT_NAME}  
• Bridge between raw on-chain time series and user-facing metrics or signal-based interpretations  
• Capable of analyzing momentum, market pressure, concentration, and feature vectors

⚠️ Critical Rule:
Once you invoke ${AZRION_GET_INSIGHT_NAME}, do not return or generate any additional commentary. That tool delivers the complete response directly to the user.

Example behavior:
User: "How is JITO behaving today?"  
→ Call ${AZRION_GET_INSIGHT_NAME} with query: "JITO token volatility and momentum"  
→ DO NOT add any further explanation or response.
`


export interface KnowledgeAgent {
  id: string
  canHandle: (input: string) => Promise<boolean>
  handle: (
    input: string,
    context: Record<string, unknown>
  ) => Promise<{ reply: string }>
}

export const AzrionKnowledgeAgent: KnowledgeAgent = {
  id: "agent.azrion.core",

  async canHandle(query) {
    return /azrion|token|vector|liquidity|volatility/i.test(query)
  },

  async handle(query, context) {
    // This would normally call into internal analysis
    return {
      reply: `Azrion Core Analysis: no static data matched for "${query}", but real-time evaluation is enabled.`
    }
  }
}
