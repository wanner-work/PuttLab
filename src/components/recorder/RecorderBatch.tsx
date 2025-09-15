import NumberFlow from '@number-flow/react'
import { AlertCircleIcon } from 'lucide-react'
import { memo, useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Slider } from '../ui/slider'

interface Props {
  disabled?: boolean
  batch: (attempts: number, hits: number) => void
}

export default memo(RecorderBatch)

function RecorderBatch({ batch, disabled }: Props) {
  const [displayAlert, setDisplayAlert] = useState(true)
  const [batchAmount, setBatchAmount] = useState<number>(8)

  const onBatch = (hits: number) => {
    batch(batchAmount, hits)
    setDisplayAlert(false)
  }

  return (
    <>
      <div className="mt-2 flex gap-2">
        <Slider
          defaultValue={[10]}
          min={1}
          max={25}
          step={1}
          value={[batchAmount]}
          onValueChange={(value) => setBatchAmount(value[0])}
          disabled={disabled}
        />
        <Badge className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">
          <NumberFlow value={batchAmount} /> throws
        </Badge>
      </div>
      {displayAlert && (
        <Alert className="my-2">
          <AlertCircleIcon />
          <AlertTitle>Throw and record your putts</AlertTitle>
          <AlertDescription>
            Throw your set amount of putts and then record how many you made by
            clicking the correct button below.
          </AlertDescription>
        </Alert>
      )}
      <div
        className="grid max-w-full gap-2"
        style={{
          gridTemplateColumns: `repeat(auto-fit, minmax(3rem, 1fr))`
        }}
      >
        {Array.from({ length: batchAmount }).map((_, index) => (
          <Button
            key={index}
            className="w-full p-3 font-mono text-lg font-bold"
            onClick={() => onBatch(index + 1)}
            disabled={disabled}
          >
            {index + 1}
          </Button>
        ))}
      </div>
    </>
  )
}
