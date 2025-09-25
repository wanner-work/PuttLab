import SETTINGS from '@/constants/SETTINGS'

export default function getUnitString(
  metric: boolean | undefined,
  short = true
) {
  const defaultedMetric = metric ?? (SETTINGS.defaults.metric as boolean)
  return defaultedMetric ? (short ? 'm' : 'meter') : short ? 'ft' : 'feet'
}
