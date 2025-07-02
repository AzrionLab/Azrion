import { useState, useEffect } from "react"
import type { TokenMetadata } from "./azrionTokenAudit"
import { auditTokenMeta } from "./azrionTokenAudit"

export function useTokenMetadataAudit(metadata: TokenMetadata) {
  const [report, setReport] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    let mounted = true
    setIsLoading(true)

    const runAudit = () => {
      const result = auditTokenMeta(metadata)
      if (mounted) {
        setReport(result)
        setIsLoading(false)
      }
    }

    setTimeout(runAudit, 300) // simulate async inspection

    return () => {
      mounted = false
    }
  }, [metadata])

  return { report, isLoading }
}