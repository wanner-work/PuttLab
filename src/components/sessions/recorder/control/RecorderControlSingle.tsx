import vibrate from '@/methods/effects/vibrate.ts'
import { ImpactStyle } from '@capacitor/haptics'
import { clsx } from 'clsx'
import { memo } from 'react'
import { Button } from '../../../ui/button.tsx'

interface Props {
  disabled?: boolean
  latest?: 'hit' | 'miss'
  hit: () => void
  miss: () => void
}

export default memo(RecorderControlSingle)

function RecorderControlSingle({ hit, miss, latest, disabled }: Props) {
  const hitProxy = async () => {
    hit()
    await vibrate()
  }

  const missProxy = async () => {
    miss()
    await vibrate(ImpactStyle.Light)
  }

  return (
    <>
      <Button
        variant="secondary"
        className={clsx(
          'w-full font-bold',
          latest === 'hit' &&
            'ring-offset-background ring-primary ring-2 ring-offset-2'
        )}
        disabled={disabled}
        onClick={hitProxy}
      >
        Hit
      </Button>
      <Button
        variant="secondary"
        className={clsx(
          'w-full font-bold',
          latest === 'miss' &&
            'ring-offset-background ring-primary ring-2 ring-offset-2'
        )}
        disabled={disabled}
        onClick={missProxy}
      >
        Miss
      </Button>
    </>
  )
}
