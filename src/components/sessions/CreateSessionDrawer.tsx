import { WheelPicker, WheelPickerWrapper } from '@/components/wheel-picker.tsx'
import QUERY from '@/constants/QUERY'
import useUnit from '@/hooks/units/useUnit'
import createSession from '@/methods/data/create/createSession'
import { useMutation } from '@tanstack/react-query'
import type { UseNavigateResult } from '@tanstack/react-router'
import { Loader2Icon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Button } from '../ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '../ui/drawer'

interface Props {
  navigate: UseNavigateResult<string>
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function CreateSessionDrawer({
  open,
  onOpenChange,
  navigate
}: Props) {
  const { mutate, isPending } = useMutation({
    mutationFn: createSession,
    onSuccess: (session) => {
      QUERY.CLIENT.invalidateQueries({
        queryKey: [QUERY.CACHE_KEYS.ALL_SESSIONS]
      })
      void navigate({
        to: '/sessions/$sessionId',
        params: { sessionId: String(session.id) },
        viewTransition: { types: ['slide-left'] }
      })
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
