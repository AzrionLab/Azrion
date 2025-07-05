import { useState, useEffect } from "react"
import type { TokenMetadata } from "./azrionTokenAudit"
import { auditTokenMeta } from "./azrionTokenAudit"

export function useTokenMetadataAudit(metadata: TokenMetadata) {
  const [report, setReport] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const performAudit = async () => {
      setIsLoading(true)

      try {
        // simulate async audit or replace with real async logic if needed
        await new Promise(resolve => setTimeout(resolve, 300))
        const result = auditTokenMeta(metadata)
        if (!cancelled) {
          setReport(result)
        }
      } catch (error) {
        if (!cancelled) {
          setReport(["⚠️ Audit failed"])
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    performAudit()

    return () => {
      cancelled = true
    }
  }, [metadata])

  return { report, isLoading }
}
