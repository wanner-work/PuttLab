import QUERY from '@/constants/QUERY'
import getFeetFromMeter from '@/methods/calculations/getFeetFromMeter.ts'
import getSettings from '@/methods/data/get/getSettings'
import getUnitString from '@/methods/units/getUnitString'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'

export default function useUnit() {
  const { data: settings } = useQuery({
    queryKey: [QUERY.CACHE_KEYS.SETTINGS],
    queryFn: getSettings
  })

  const unit = useMemo(() => {
    return getUnitString(settings?.metric, false)
  }, [settings])

  const shortUnit = useMemo(() => {
    return getUnitString(settings?.metric, true)
  }, [settings])

  const getDistance = useCallback(
    (distance: number) => {
      if (settings?.metric) {
        return distance
      }
      return getFeetFromMeter(distance)
    },
    [settings]
  )

  return { unit, shortUnit, getDistance }
}
