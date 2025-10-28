import type { NumberFlowElement } from '@number-flow/react'
import type { Variation } from 'node_modules/party-js/lib/systems/variation'
import party, { Color } from 'party-js'
import { useRef } from 'react'

export default function useParty() {
  const ref = useRef<
    HTMLDivElement | HTMLParagraphElement | NumberFlowElement | null
  >(null)

  const run = ({
    count,
    size
  }: {
    count?: number
    size?: Variation<number>
  }) => {
    if (ref.current) {
      party.sparkles(ref.current, {
        color: Color.fromHex('#332d90'),
        size: size || party.variation.range(1, 1.5),
        count: count || Math.floor(Math.random() * (60 - 40 + 1)) + 40
      })
    }
  }

  return { ref, run }
}
