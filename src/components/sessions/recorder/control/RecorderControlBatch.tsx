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
import { clsx } from 'clsx'
import { AlertCircleIcon } from 'lucide-react'
import party, { Color } from 'party-js'
import { memo, useState } from 'react'
import { Badge } from '../../../ui/badge.tsx'
import { Button } from '../../../ui/button.tsx'
import { Slider } from '../../../ui/slider.tsx'

interface Props {
  disabled?: boolean
  latest?: number
  batch: (attempts: number, hits: number) => void
}

export default memo(RecorderControlBatch)

function RecorderControlBatch({ batch, latest, disabled }: Props) {
  const [batchAmount, setBatchAmount] = useState<number>(8)

  const batchProxy = async (hits: number) => {
    batch(batchAmount, hits)

    if (batchAmount > 3 && hits === batchAmount) {
      party.sparkles(document.body, {
        color: Color.fromHex('#332d90'),
        count: Math.floor(Math.random() * (60 - 40 + 1)) + 40
      })
      await Haptics.impact({ style: ImpactStyle.Heavy })
      setTimeout(async () => {
        await Haptics.impact({ style: ImpactStyle.Heavy })
      }, 80)
      setTimeout(async () => {
        await Haptics.impact({ style: ImpactStyle.Heavy })
      }, 160)
    }

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
        <Badge
          variant="secondary"
          className="rounded-full font-mono tabular-nums"
        >
          <NumberFlow value={batchAmount} /> throws
        </Badge>
        <Drawer>
          <DrawerTrigger>
            <Button className="!p-1.5" variant="secondary">
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
            variant="secondary"
            className={clsx(
              'w-full p-3 font-mono text-lg font-bold',
              latest === index &&
                'ring-offset-background ring-primary ring-2 ring-offset-2'
            )}
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
