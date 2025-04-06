
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)
  const [forcedMode, setForcedMode] = React.useState<boolean | null>(null)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      if (forcedMode === null) {
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
      }
    }
    mql.addEventListener("change", onChange)
    if (forcedMode === null) {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    return () => mql.removeEventListener("change", onChange)
  }, [forcedMode])

  const toggleView = React.useCallback(() => {
    setForcedMode(prev => {
      if (prev === null) {
        return !isMobile
      }
      return !prev
    })
    setIsMobile(prev => !prev)
  }, [isMobile])

  return {
    isMobile,
    toggleView,
    isForced: forcedMode !== null
  }
}

// Export both names for backward compatibility
export const useMobile = useIsMobile;
