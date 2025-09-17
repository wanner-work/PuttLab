import QUERY from '@/constants/QUERY'
import createSession from '@/methods/data/create/createSession'
import NumberFlow from '@number-flow/react'
import { useMutation } from '@tanstack/react-query'
import type { UseNavigateResult } from '@tanstack/react-router'
import { Loader2Icon } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '../ui/badge'
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '../ui/select'
import { Slider } from '../ui/slider'

interface Props {
  navigate: UseNavigateResult<string>
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function CreateSession({ open, onOpenChange, navigate }: Props) {
  const { mutate, isPending } = useMutation({
    mutationFn: createSession,
    onSuccess: (session) => {
      QUERY.CLIENT.invalidateQueries({
        queryKey: [QUERY.CACHE_KEYS.ALL_SESSIONS]
      })
      void navigate({
        to: '/sessions/$sessionId',
        params: { sessionId: String(session.id) }
      })
    }
  })

  const [selectedDistance, setSelectedDistance] = useState<string>('8')
  const [customDistance, setCustomDistance] = useState<number>(10)

  const create = () => {
    const distance =
      selectedDistance === 'custom' ? customDistance : Number(selectedDistance)

    mutate(distance)
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create a new training session</DrawerTitle>
          <DrawerDescription>Define the distance.</DrawerDescription>
        </DrawerHeader>
        <div className="mx-4 my-4 px-4">
          <Select onValueChange={setSelectedDistance} value={selectedDistance}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Distance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="custom">Custom</SelectItem>

              <SelectGroup>
                <SelectLabel>Bullseye</SelectLabel>
                <SelectItem value="2">2 meters</SelectItem>
                <SelectItem value="3">3 meters</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Circle 1</SelectLabel>
                <SelectItem value="4">4 meters</SelectItem>
                <SelectItem value="6">6 meters</SelectItem>
                <SelectItem value="8">8 meters</SelectItem>
                <SelectItem value="10">10 meters</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Circle 2</SelectLabel>
                <SelectItem value="12">12 meters</SelectItem>
                <SelectItem value="16">16 meters</SelectItem>
                <SelectItem value="20">20 meters</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {selectedDistance === 'custom' && (
            <div className="mt-5 flex gap-2">
              <Slider
                defaultValue={[10]}
                min={1}
                max={35}
                step={1}
                value={[customDistance]}
                onValueChange={(value) => setCustomDistance(value[0])}
              />
              <Badge className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">
                <NumberFlow value={customDistance} />m
              </Badge>
            </div>
          )}
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
