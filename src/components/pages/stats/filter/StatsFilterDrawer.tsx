import StatsFilter from '@/components/pages/stats/filter/StatsFilter.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Drawer, DrawerContent, DrawerFooter } from '@/components/ui/drawer.tsx'
import type FilterValue from '@/interfaces/data/filter/FilterValue.ts'

interface Props {
  open: boolean
  filterValue?: FilterValue
  onOpenChange: (open: boolean) => void
  onFilterChange: (filter: FilterValue) => void
}

export default function StatsFilterDrawer({
  open,
  filterValue,
  onFilterChange,
  onOpenChange
}: Readonly<Props>) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="overflow-y-auto">
          <div className="mx-4 my-4 flex gap-3 px-4">
            <StatsFilter onChange={onFilterChange} value={filterValue} />
          </div>
          <DrawerFooter className="mx-4">
            <Button onClick={() => onOpenChange(false)}>Apply</Button>
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="w-full"
            >
              Cancel
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
