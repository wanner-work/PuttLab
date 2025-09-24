import { WheelPicker, WheelPickerWrapper } from '@/components/wheel-picker.tsx'
import QUERY from '@/constants/QUERY.ts'
import type { Session } from '@/data/entities/session.ts'
import useUnit from '@/hooks/units/useUnit.ts'
import createSession from '@/methods/data/create/createSession.ts'
import { useMutation } from '@tanstack/react-query'
import { Loader2Icon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Button } from '../../ui/button.tsx'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '../../ui/drawer.tsx'

interface Props {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSuccess?: (session: Session) => void
}

export default function CreateSessionDrawer({
  open,
  onOpenChange,
  onSuccess
}: Props) {
  const { mutate, isPending } = useMutation({
    mutationFn: createSession,
    onSuccess: (session) => {
      QUERY.CLIENT.invalidateQueries({
        queryKey: [QUERY.CACHE_KEYS.ALL_SESSIONS]
      })
      onSuccess?.(session)
    }
  })

  const [distance, setDistance] = useState<string>('8')

  const create = () => {
    mutate(Number(distance))
  }

  const { getDistance, unit } = useUnit()

  const options = useMemo(() => {
    const opts = []
    for (let i = 1; i <= 50; i++) {
      opts.push({ label: `${getDistance(i)} ${unit}`, value: String(i) })
    }
    return opts
  }, [unit, getDistance])

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        onTouchStart={(e) => {
          console.log('drag start', e, (e.target as HTMLElement).dataset)
          if (
            (e.target as HTMLElement).dataset.rwpOption ||
            (e.target as HTMLElement).dataset.rwpHighlightItem
          ) {
            console.log('stop!')
            e.stopPropagation()
          }
        }}
      >
        <DrawerHeader>
          <DrawerTitle>Create a new training session</DrawerTitle>
          <DrawerDescription>Define the distance.</DrawerDescription>
        </DrawerHeader>
        <div className="mx-4 my-4 px-4">
          <WheelPickerWrapper>
            <WheelPicker
              optionItemHeight={40}
              visibleCount={12}
              options={options}
              value={distance}
              onValueChange={setDistance}
            />
          </WheelPickerWrapper>
        </div>
        <DrawerFooter className="mx-4">
          <Button onClick={create} disabled={isPending}>
            {isPending && <Loader2Icon className="animate-spin" />}
            Create
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
