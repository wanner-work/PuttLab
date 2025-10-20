/**
 * Interface for Settings which are stored
 * with @capacitor/preferences
 *
 * If some thing is added here, it also need
 * to be added to the SETTINGS.ts constant.
 */
export default interface SettingsData {
  metric: boolean
  putters: number
  intro: boolean
}
