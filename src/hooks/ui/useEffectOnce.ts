import { useEffect, useRef } from 'react'

export default function useEffectOnce(
  effect: () => void | (() => void),
  dependencies: unknown[] = []
) {
  const hasRunRef = useRef(false)

  useEffect(() => {
    if (hasRunRef.current) return

    const cleanup = effect()
    hasRunRef.current = true

    return () => {
      if (cleanup) {
        cleanup()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies)
}
