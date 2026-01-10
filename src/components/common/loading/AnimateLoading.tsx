import { AnimatePresence } from 'motion/react'
import { useState, type ReactNode } from 'react'
import LoadingDisplay from './LoadingDisplay'

interface RenderParams {
  /**
   * Indicates if the component was displayed directly or after a loading state.
   */
  wasLoading: boolean

  /**
   * Indicates if the data is empty.
   */
  isEmpty?: boolean
}

interface Props {
  isLoading: boolean
  isEmpty?: boolean

  /*
   * Render the actual component when not loading.
   *
   * @param params - The parameters for the render function.
   * @returns A ReactNode to be rendered when not loading.
   */
  render: (params: RenderParams) => ReactNode

  /**
   * Render a fallback UI when there is no data after the loading. If not provided, the main render function will be used.
   *
   * @returns A ReactNode to be rendered when there is no data after the loading.
   */
  renderEmpty?: (params: RenderParams) => ReactNode

  /**
   * Render a UI while loading. If not provided, a default loading display will be used.
   *
   * @returns A ReactNode to be rendered when loading.
   */
  renderLoading?: () => ReactNode
}

export default function AnimateLoading({
  isLoading,
  isEmpty,
  render,
  renderEmpty,
  renderLoading
}: Props) {
  const [wasLoading, setWasLoading] = useState(false)

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <>
          {renderLoading ? (
            <>
              {setWasLoading(true)}
              {renderLoading()}
            </>
          ) : (
            <LoadingDisplay onMount={() => setWasLoading(true)} />
          )}
        </>
      ) : isEmpty && renderEmpty ? (
        renderEmpty({
          wasLoading,
          isEmpty
        })
      ) : (
        render({
          wasLoading,
          isEmpty
        })
      )}
    </AnimatePresence>
  )
}
