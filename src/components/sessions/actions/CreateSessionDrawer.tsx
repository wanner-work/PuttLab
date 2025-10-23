import {
  WheelPicker,
  WheelPickerWrapper
} from '@/components/ui/wheel-picker.tsx'
import QUERY from '@/constants/QUERY.ts'
import type { Session } from '@/data/entities/session.ts'
import useUnit from '@/hooks/units/useUnit.ts'
import type DrawerProps from '@/interfaces/ui/DrawerProps.ts'
import createSession from '@/methods/data/create/createSession.ts'
import { useMutation } from '@tanstack/react-query'
import { Loader2Icon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Button } from '../../ui/button.tsx'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '../../ui/drawer.tsx'

export default function CreateSessionDrawer({
  open,
  onOpenChange,
  onSuccess
}: Readonly<DrawerProps<Session>>) {
  const [attempts, setAttempts] = useState<string>('unlimited')
  const [distance, setDistance] = useState<string>('8')

  const { getDistance, unit } = useUnit()

  const { mutate, isPending } = useMutation({
    mutationFn: createSession,
    onSuccess: (session) => {
      QUERY.CLIENT.invalidateQueries({
        queryKey: [QUERY.CACHE_KEYS.ALL_SESSIONS]
      })
      onSuccess?.(session)
    }
  })

  const create = () => {
    if (attempts === 'unlimited') {
      mutate({
        distance: Number(distance)
      })
    } else {
      mutate({
        distance: Number(distance),
        maxAttempts: Number(attempts)
      })
    }
  }

  const distanceOptions = useMemo(() => {
    const opts = []
    for (let i = 1; i <= 50; i++) {
      opts.push({ label: `${getDistance(i)} ${unit}`, value: String(i) })
    }
    return opts
  }, [unit, getDistance])

  const attemptsOptions = useMemo(() => {
    const opts = []
    opts.push({ label: 'Unlimited', value: 'unlimited' })
    for (const amount of [25, 50, 80, 100, 150, 200, 500]) {
      opts.push({ label: `${amount} attempts`, value: String(amount) })
    }
    return opts
  }, [])

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create a new training session</DrawerTitle>
          <DrawerDescription>
            Define the distance and the <br />
            amount of attempts.
          </DrawerDescription>
        </DrawerHeader>
        <div className="mx-4 my-4 flex gap-3 px-4" data-vaul-no-drag>
          <WheelPickerWrapper>
            <WheelPicker
              optionItemHeight={40}
              visibleCount={12}
              options={distanceOptions}
              value={distance}
              onValueChange={setDistance}
            />
          </WheelPickerWrapper>
          <WheelPickerWrapper>
            <WheelPicker
              optionItemHeight={40}
              visibleCount={12}
              options={attemptsOptions}
              value={attempts}
              onValueChange={setAttempts}
            />
          </WheelPickerWrapper>
        </div>
        <DrawerFooter className="mx-4">
          <Button onClick={create} disabled={isPending}>
            {isPending && <Loader2Icon className="animate-spin" />}
            Create
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
