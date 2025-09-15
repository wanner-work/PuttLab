import { memo } from 'react'
import { Button } from '../ui/button'

interface Props {
  disabled?: boolean
  hit: () => void
  miss: () => void
}

export default memo(RecorderSingle)

function RecorderSingle({ hit, miss, disabled }: Props) {
  return (
    <>
      <Button
        color="primary"
        className="w-full p-6 font-bold"
        disabled={disabled}
        onClick={() => hit()}
      >
        Hit
      </Button>
      <Button
        variant="outline"
        className="w-full p-6 font-bold"
        disabled={disabled}
        onClick={() => miss()}
      >
        Miss
      </Button>
    </>
  )
}
