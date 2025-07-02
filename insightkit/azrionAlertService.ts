import { z } from "zod"
import type { AzrionActionCore } from "./baseAzrionAction"

export const auraReadAction: AzrionActionCore<
  z.ZodObject<{
    contractAddress: z.ZodString
    timeframeHours: z.ZodNumber
  }>,
  {
    auraIntensity: number
    decodedPatterns: string[]
  },
  {
    endpoint: string
    token: string
  }
> = {
  id: "auraRead",
  summary: "Decode aura patterns over time from Azrion AI core",
  input: z.object({
    contractAddress: z.string(),
    timeframeHours: z.number().int().positive()
  }),
  execute: async ({ payload, context }) => {
    const { contractAddress, timeframeHours } = payload
    const { endpoint, token } = context

    const response = await fetch(
      `${endpoint}/azrion/aura-scan?address=${encodeURIComponent(contractAddress)}&hours=${timeframeHours}`,
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Azrion API error: ${response.status} ${response.statusText}`)
    }

    const result = await response.json()
    return {
      notice: `Aura read complete for ${contractAddress}`,
      data: {
        auraIntensity: result.intensity,
        decodedPatterns: result.patterns as string[]
      }
    }
  }
}