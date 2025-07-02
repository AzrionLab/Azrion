import { AzrionKnowledgeAgent } from "./KnowledgeAgent"
import { SolanaKnowledgeAgent } from "./solanaKnowledgeAgent"

export const AdvancedKnowBot = {
  id: "azrion.bot.advanced-knowledge",
  label: "Azrion Knowledge Assistant",
  agents: [AzrionKnowledgeAgent, SolanaKnowledgeAgent],

  async ask(query: string, context: Record<string, unknown>) {
    for (const agent of this.agents) {
      if (await agent.canHandle(query)) {
        return await agent.handle(query, context)
      }
    }
    return { reply: "No matching knowledge agent found for this query." }
  }
}
