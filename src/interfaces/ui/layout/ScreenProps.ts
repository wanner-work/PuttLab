import { motion } from 'motion/react'
import type { ComponentProps } from 'react'

export default interface ScreenProps extends ComponentProps<typeof motion.div> {
  /**
   * Defines the row structure of the content area.
   * If there are multiple rows present, pass an array defining each row's height.
   */
  rows?: string[]
}
