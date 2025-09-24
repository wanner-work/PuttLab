import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '@/components/ui/drawer'
import { WheelPicker, WheelPickerWrapper } from '@/components/ui/wheel-picker'
import useSettings from '@/hooks/data/settings/useSettings'
import useSettingsMutate from '@/hooks/data/settings/useSettingsMutate'
import type DrawerProps from '@/interfaces/ui/DrawerProps'
import { Loader2Icon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

interface Props extends DrawerProps {
  dismissible: boolean
}

export default function RecorderControlBatchDrawer({
  open,
  dismissible,
  onOpenChange,
  onSuccess
}: Props) {
  const { settings } = useSettings()
  const { mutate: updateSettings, isPending } = useSettingsMutate(() =>
    onSuccess?.()
  )

  const [amount, setAmount] = useState('5')

  useEffect(() => {
    if (settings && settings?.putters && settings.putters > 0) {
      setAmount(String(settings.putters))
    }
  }, [settings])

  const options = useMemo(() => {
    const opts = []
    for (let i = 1; i <= 50; i++) {
      opts.push({ label: `${i} Putter`, value: String(i) })
    }
    return opts
  }, [])

  const save = () => {
    updateSettings({ putters: Number(amount) })
    onOpenChange?.(false)
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} dismissible={dismissible}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Amount of putters</DrawerTitle>
          <DrawerDescription>
            Define the amount of putters that you want to throw per batch.
          </DrawerDescription>
        </DrawerHeader>
        <div className="mx-4 my-4 px-4" data-vaul-no-drag>
          <WheelPickerWrapper>
            <WheelPicker
              optionItemHeight={40}
              visibleCount={12}
              options={options}
              value={amount}
              onValueChange={setAmount}
            />
          </WheelPickerWrapper>
        </div>
        <DrawerFooter className="mx-4">
          <Button onClick={save} disabled={isPending}>
            {isPending && <Loader2Icon className="animate-spin" />}
            Save
          </Button>
          <Button
            onClick={() => onOpenChange?.(false)}
            variant="outline"
            className="w-full"
          >
            Cancel
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
