import { Capacitor } from '@capacitor/core'
import { ImpactStyle } from '@capacitor/haptics'
import vibrate from './vibrate'

export default async function vibratePattern(
  ammount: number,
  style: ImpactStyle = ImpactStyle.Heavy
) {
  if (Capacitor.getPlatform() === 'web') {
    return
  }

  for (let i = 0; i < ammount; i++) {
    await new Promise<void>((resolve) => {
      setTimeout(async () => {
        await vibrate(style)
        if (i === ammount - 1) {
          resolve()
        }
      }, i * 80)
    })
  }
}
