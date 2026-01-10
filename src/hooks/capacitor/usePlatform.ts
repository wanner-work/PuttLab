import { Capacitor } from '@capacitor/core'

export default function usePlatform() {
  return Capacitor.getPlatform()
}
