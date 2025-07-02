// azrion/utils/truncate.ts

interface TruncateOptions {
  prefixLength?: number
  suffixLength?: number
  fallback?: string
  showFullOnHover?: boolean  // UI-only feature hint
}

export const truncateAddress = (
  address: string | undefined | null,
  options: TruncateOptions = {}
): string => {
  const {
    prefixLength = 6,
    suffixLength = 6,
    fallback = "Unknown",
    showFullOnHover = false // future use in tooltip rendering
  } = options

  if (typeof address !== "string" || address.length === 0) {
    console.warn("Empty or non-string address input:", address)
    return fallback
  }

  if (address.length <= prefixLength + suffixLength + 3) {
    // No need to truncate very short addresses
    return address
  }

  const prefix = address.slice(0, prefixLength)
  const suffix = address.slice(-suffixLength)
  const truncated = `${prefix}...${suffix}`

  // Optionally could return full HTML if used in frontend
  if (showFullOnHover) {
    return `<span title="${address}">${truncated}</span>`
  }

  return truncated
}
