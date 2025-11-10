import QUERY from '@/constants/QUERY'
import deleteAllSessions from '@/methods/data/delete/deleteAllSessions'
import getSessions from '@/methods/data/get/getSessions'
import seedSessions from '@/methods/data/seed/seedSessions'
import { useMutation } from '@tanstack/react-query'
import { Loader2Icon } from 'lucide-react'
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
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function SeedDrawer({ open, onOpenChange }: Readonly<Props>) {
  const { mutate: seed, isPending } = useMutation({
    mutationFn: () => seedSessions(),
    onSuccess: () => {
      void QUERY.CLIENT.invalidateQueries({
        queryKey: [QUERY.CACHE_KEYS.ALL_SESSIONS]
      })
      void QUERY.CLIENT.prefetchQuery({
        queryKey: [QUERY.CACHE_KEYS.ALL_SESSIONS, 'all'],
        queryFn: () => getSessions()
      })
    }
  })

  const { mutate: deleteAll, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteAllSessions(),
    onSuccess: () => {
      void QUERY.CLIENT.invalidateQueries({
        queryKey: [QUERY.CACHE_KEYS.ALL_SESSIONS]
      })
      void QUERY.CLIENT.prefetchQuery({
        queryKey: [QUERY.CACHE_KEYS.ALL_SESSIONS, 'all'],
        queryFn: () => getSessions()
      })
    }
  })

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Developer options</DrawerTitle>
          <DrawerDescription>
            If you are not a developer, close this drawer. All changes made here
            are experimental and may not work as expected.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="mx-4">
          <Button onClick={() => seed()} disabled={isPending}>
            {isPending && <Loader2Icon className="animate-spin" />}
            Seed database with test data
          </Button>
          <Button
            onClick={() => deleteAll()}
            disabled={isDeleting}
            variant="destructive"
          >
            {isDeleting && <Loader2Icon className="animate-spin" />}
            Delete all sessions
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
