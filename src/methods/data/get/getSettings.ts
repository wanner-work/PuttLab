import SETTINGS from '@/constants/SETTINGS'
import type SettingsData from '@/interfaces/data/SettingsData'
import { Preferences } from '@capacitor/preferences'

export default async function getSettings() {
  const settings: Partial<SettingsData> = {}

  for (const key in SETTINGS.keys) {
    const { value } = await Preferences.get({
      key: SETTINGS.keys[key as keyof SettingsData]
    })

    if (value === null) {
      settings[key as keyof SettingsData] = SETTINGS.defaults[
        key as keyof SettingsData
      ] as SettingsData[keyof SettingsData]
    } else if (value === 'true' || value === 'false') {
      settings[key as keyof SettingsData] = value === 'true'
    } else if (!isNaN(Number(value))) {
      settings[key as keyof SettingsData] = Number(value)
    } else {
      settings[key as keyof SettingsData] = value
    }
  }

  return settings
}
