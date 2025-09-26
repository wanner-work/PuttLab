import vibrate from '@/methods/effects/vibrate'
import { ImpactStyle } from '@capacitor/haptics'
import { type RefObject, useEffect, useState } from 'react'

export function useSwipe(
  ref: RefObject<HTMLElement | null>,
  callback?: (distance: number) => void,
  threshold: number = 50
): number {
  const [playedHaptic, setPlayedHaptic] = useState(false)
  const [swipeDistance, setSwipeDistance] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [touchStartY, setTouchStartY] = useState<number | null>(null)

  useEffect(() => {
    if (!ref?.current) return

    const handleTouchStart = (e: TouchEvent) => {
      if (
        e.target &&
        (e.target as HTMLElement).getAttribute('role') === 'slider'
      ) {
        // don't interfere with sliders
        return
      }

      setTouchEnd(null)
      setSwipeDistance(0)
      setTouchStart(e.targetTouches[0].clientX)
      setTouchStartY(e.targetTouches[0].clientY)
    }

    const handleTouchMove = async (e: TouchEvent) => {
      if (touchStart === null || touchStartY === null) return

      const currentX = e.targetTouches[0].clientX
      const currentY = e.targetTouches[0].clientY

      const deltaX = currentX - touchStart
      const deltaY = currentY - touchStartY

      // only consider horizontal swipes when X movement > Y movement
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        setTouchEnd(currentX)
        setSwipeDistance(deltaX)
      }

      if (deltaX >= threshold) {
        if (!playedHaptic) {
          setPlayedHaptic(true)
          await vibrate(ImpactStyle.Medium)
        }
      } else if (deltaX < threshold) {
        setPlayedHaptic(false)
      }
    }

    const handleTouchEnd = () => {
      if (touchStart === null || touchEnd === null) return

      const distance = touchEnd - touchStart

      if (distance > threshold) {
        callback?.(distance)
      } else {
        // only reset if swipe was below threshold
        setSwipeDistance(0)
      }
    }

    const node = ref.current
    node.addEventListener('touchstart', handleTouchStart)
    node.addEventListener('touchmove', handleTouchMove)
    node.addEventListener('touchend', handleTouchEnd)

    return () => {
      node.removeEventListener('touchstart', handleTouchStart)
      node.removeEventListener('touchmove', handleTouchMove)
      node.removeEventListener('touchend', handleTouchEnd)
    }
  }, [
    ref,
    touchStart,
    touchEnd,
    touchStartY,
    playedHaptic,
    callback,
    threshold
  ])

  return swipeDistance
}
