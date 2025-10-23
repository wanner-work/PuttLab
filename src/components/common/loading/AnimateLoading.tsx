import { AnimatePresence } from 'motion/react'
import { useState, type ReactNode } from 'react'
import LoadingDisplay from './LoadingDisplay'

interface Props {
  isLoading: boolean

  /*
   * Render the actual component when not loading.
   *
   * @param params - The parameters for the render function.
   * @param params.wasLoading - Indicates if the component was displayed directly or after a loading state.
   * @returns A ReactNode to be rendered when not loading.
   */
  render: (params: { wasLoading: boolean }) => ReactNode
}

export default function AnimateLoading({ isLoading, render }: Props) {
  const [wasLoading, setWasLoading] = useState(false)

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <LoadingDisplay onMount={() => setWasLoading(true)} />
      ) : (
        render({
          wasLoading
        })
      )}
    </AnimatePresence>
  )
}
