import { useState, useEffect, useRef } from "react"
import type { TokenMetadata } from "./azrionTokenAudit"
import { auditTokenMeta } from "./azrionTokenAudit"

export interface UseTokenMetadataAuditOptions {
  delay?: number  // debounce delay in ms
}

/**
 * Hook to audit token metadata asynchronously with cancellation,
 * debouncing, and error handling.
 *
 * @param metadata  The token metadata to audit
 * @param options   Optional settings (e.g. debounce delay)
 * @returns         { report, isLoading, error }
 */
export function useTokenMetadataAudit(
  metadata: TokenMetadata,
  { delay = 300 }: UseTokenMetadataAuditOptions = {}
) {
  const [report, setReport] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const auditIdRef = useRef(0)

  useEffect(() => {
    let cancelled = false
    const currentAuditId = ++auditIdRef.current

    const performAudit = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // debounce / simulate async work
        await new Promise((res) => setTimeout(res, delay))

        const result = auditTokenMeta(metadata)

        // ignore outdated or cancelled audits
        if (cancelled || auditIdRef.current !== currentAuditId) return

        setReport(result)
      } catch (err) {
        if (cancelled) return
        console.error("Token metadata audit error:", err)
        setError("⚠️ Audit failed")
      } finally {
        if (cancelled) return
        setIsLoading(false)
      }
    }

    performAudit()

    return () => {
      cancelled = true
    }
  }, [metadata, delay])

  return { report, isLoading, error }
}
