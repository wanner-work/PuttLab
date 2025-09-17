import { Haptics, ImpactStyle } from '@capacitor/haptics'
import { memo } from 'react'
import { Button } from '../../ui/button'

interface Props {
  disabled?: boolean
  hit: () => void
  miss: () => void
}

export default memo(RecorderSingle)

function RecorderSingle({ hit, miss, disabled }: Props) {
  const hitProxy = async () => {
    hit()
    await Haptics.impact({ style: ImpactStyle.Heavy })
  }

  const missProxy = async () => {
    miss()
    await Haptics.impact({ style: ImpactStyle.Light })
  }

  return (
    <>
      <Button
        color="primary"
        className="w-full font-bold"
        disabled={disabled}
        onClick={hitProxy}
      >
        Hit
      </Button>
      <Button
        variant="secondary"
        className="w-full font-bold"
        disabled={disabled}
        onClick={missProxy}
      >
        Miss
      </Button>
    </>
  )
}
