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
import QUERY from '@/constants/QUERY.ts'
import type { Session } from '@/data/entities/session.ts'
import useSettings from '@/hooks/data/settings/useSettings.ts'
import vibrate from '@/methods/effects/vibrate.ts'
import vibratePattern from '@/methods/effects/vibratePattern.ts'
import { ImpactStyle } from '@capacitor/haptics'
import { clsx } from 'clsx'
import { AlertCircleIcon, Diff } from 'lucide-react'
import party, { Color } from 'party-js'
import { memo, useMemo, useState } from 'react'
import { Button } from '../../../ui/button.tsx'
import RecorderControlBatchDrawer from './RecorderControlBatchDrawer.tsx'

interface Props {
  session: Session | null | undefined
  attempts: number
  disabled?: boolean
  latest?: number
  batch: (attempts: number, hits: number) => void
}

export default memo(RecorderControlBatch)

function RecorderControlBatch({
  batch,
  latest,
  disabled,
  session,
  attempts
}: Props) {
  const { settings } = useSettings()

  const [openSelectBatchAmount, setOpenSelectBatchAmount] = useState(false)

  const putters = useMemo(() => {
    if (settings?.putters && settings.putters > 0) {
      const p = settings.putters

      if (session?.maxAttempts) {
        const remaining = session.maxAttempts - attempts

        if (remaining < p) {
          return remaining
        }
      }

      return p
    }

    return 0
  }, [settings, session, attempts])

  const isDismissible = useMemo(() => {
    return !(settings?.putters !== undefined && settings.putters === 0)
  }, [settings])

  const isOpen = useMemo(() => {
    return (
      openSelectBatchAmount ||
      (settings?.putters !== undefined && settings.putters === 0)
    )
  }, [openSelectBatchAmount, settings])

  const batchProxy = async (hits: number) => {
    batch(putters, hits)

    if (putters > 3 && hits === putters) {
      party.sparkles(document.body, {
        color: Color.fromHex('#332d90'),
        count: Math.floor(Math.random() * (60 - 40 + 1)) + 40
      })

      await vibratePattern(3)
    } else {
      if (putters > 3 && hits < 3) {
        await vibrate(ImpactStyle.Light)
      } else {
        await vibrate(ImpactStyle.Medium)
      }
    }
  }

  return (
    <>
      <RecorderControlBatchDrawer
        dismissible={isDismissible}
        open={isOpen}
        onOpenChange={setOpenSelectBatchAmount}
        onSuccess={() => {
          QUERY.CLIENT.invalidateQueries({
            queryKey: [QUERY.CACHE_KEYS.SETTINGS]
          })
        }}
      />
      <div className="mt-1 flex justify-between gap-2">
        <div className="flex gap-1">
          <Button
            className="!p-2 !px-2.5 text-xs"
            variant="secondary"
            disabled={disabled}
          >
            Batch Mode
          </Button>
          <Drawer>
            <DrawerTrigger asChild>
              <Button
                className="!p-2 text-xs"
                variant="secondary"
                disabled={disabled}
              >
                <AlertCircleIcon />
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Throw and record your putts</DrawerTitle>
                <DrawerDescription>
                  Throw your set amount of putts and then record how many you
                  made by clicking the correct button below.
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

        <div className="flex gap-2">
          <Button
            disabled={disabled}
            onClick={() => setOpenSelectBatchAmount(true)}
            className="!p-2 !pl-2.5 text-xs"
            variant="secondary"
          >
            Define Amount
            <Diff />
          </Button>
        </div>
      </div>
      {putters !== undefined && putters > 0 && (
        <div
          className="grid max-w-full gap-2"
          style={{
            gridTemplateColumns: `repeat(auto-fit, minmax(3rem, 1fr))`
          }}
        >
          {Array.from({ length: putters + 1 }).map((_, index) => (
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
      )}
    </>
  )
}
