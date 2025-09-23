import ANIMATION from '@/constants/ANIMATION'
import { useMotionValue } from 'motion/react'
import { useEffect, useState } from 'react'

interface Options {
  actionRight?: () => void
  actionLeft?: () => void
}

export default function useDragAction(options: Options) {
  const [isDragging, setIsDragging] = useState(false)
  const [x, setX] = useState(0)

  const xMotionValue = useMotionValue(0)

  useEffect(() => {
    xMotionValue.on('change', (latest) => {
      setX(latest)
    })
  }, [x])

  const onDragStart = () => {
    setIsDragging(true)
  }

  const onDragEnd = () => {
    setIsDragging(false)

    if (options.actionRight) {
      if (x <= ANIMATION.thresholdLeft) {
        options.actionRight()
      }
    }
    if (options.actionLeft) {
      if (x >= ANIMATION.thresholdRight) {
        options.actionLeft()
      }
    }
  }

  return {
    isDragging,
    x,
    xMotionValue,
    onDragEnd,
    onDragStart
  }
}
