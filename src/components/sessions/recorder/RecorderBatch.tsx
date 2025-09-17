import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer.tsx'
import { Haptics, ImpactStyle } from '@capacitor/haptics'
import NumberFlow from '@number-flow/react'
import { AlertCircleIcon } from 'lucide-react'
import { memo, useState } from 'react'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Slider } from '../ui/slider'

interface Props {
  disabled?: boolean
  batch: (attempts: number, hits: number) => void
}

export default memo(RecorderBatch)

function RecorderBatch({ batch, disabled }: Props) {
  const [batchAmount, setBatchAmount] = useState<number>(8)

  const batchProxy = async (hits: number) => {
    batch(batchAmount, hits)
    await Haptics.impact({ style: ImpactStyle.Medium })
  }

  return (
    <>
      <div className="flex gap-2">
        <Slider
          defaultValue={[10]}
          min={1}
          max={25}
          step={1}
          value={[batchAmount]}
          onValueChange={(value) => setBatchAmount(value[0])}
          disabled={disabled}
        />
        <Badge className="rounded-full font-mono tabular-nums">
          <NumberFlow value={batchAmount} /> throws
        </Badge>
        <Drawer>
          <DrawerTrigger>
            <Button className="!p-1.5" variant="outline">
              <AlertCircleIcon />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Throw and record your putts</DrawerTitle>
              <DrawerDescription>
                Throw your set amount of putts and then record how many you made
                by clicking the correct button below.
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter className="mx-4">
              <DrawerClose>
                <Button className="w-full">Understood</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
      <div
        className="grid max-w-full gap-2"
        style={{
          gridTemplateColumns: `repeat(auto-fit, minmax(3rem, 1fr))`
        }}
      >
        {Array.from({ length: batchAmount + 1 }).map((_, index) => (
          <Button
            key={index}
            className="w-full p-3 font-mono text-lg font-bold"
            onClick={() => batchProxy(index)}
            disabled={disabled}
          >
            {index}
          </Button>
        ))}
      </div>
    </>
  )
}
