import type SettingsData from '@/interfaces/data/SettingsData'

const SETTINGS = {
  keys: {
    metric: 'settings.metric',
    putters: 'settings.putters'
  },
  defaults: {
    metric: true,
    putters: 0
  }
} satisfies {
  keys: Record<keyof SettingsData, string>
  defaults: Record<keyof SettingsData, unknown>
}

export default SETTINGS
