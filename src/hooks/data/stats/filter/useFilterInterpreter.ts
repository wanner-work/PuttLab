import type FilterValue from '@/interfaces/data/filter/FilterValue.ts'
import { useMemo } from 'react'

export default function useFilterInterpreter(filter?: FilterValue) {
  const isSingleDistanceSelected = useMemo(() => {
    if (!filter) return false

    if (filter.distanceMode === 'dg') {
      return filter.distance !== 'all'
    } else {
      return true
    }
  }, [filter])

  return {
    isSingleDistanceSelected
  }
}
