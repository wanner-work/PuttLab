import Header from '@/components/common/layout/Header.tsx'
import Layout from '@/components/common/layout/Layout.tsx'
import EightyDistance from '@/components/pages/stats/EightyDistance.tsx'
import SelectedSessions from '@/components/pages/stats/filter/stats/SelectedSessions.tsx'
import StatsFilterDrawer from '@/components/pages/stats/filter/StatsFilterDrawer.tsx'
import { Button } from '@/components/ui/button.tsx'
import useSessionsFilter from '@/hooks/data/sessions/useSessionsFilter.ts'
import type FilterValue from '@/interfaces/data/filter/FilterValue.ts'
import { createFileRoute } from '@tanstack/react-router'
import { Funnel } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/stats/advanced/')({
  component: RouteComponent
})

function RouteComponent() {
  const [filterOpen, setFilterOpen] = useState(false)
  const [filter, setFilter] = useState<FilterValue>({
    distanceMode: 'dg',
    distance: 'all',
    timeframe: 'all'
  })
  const { data, isLoading } = useSessionsFilter(filter)

  return (
    <Layout rows={['1fr']} className="overflow-auto pb-0" backTo="/stats">
      <Header backTo="/stats" className="sticky top-6" />

      <div className="h-full">
        <SelectedSessions isLoading={isLoading} sessions={data} />
        <EightyDistance useSpecificSessions specificSessions={data} />
      </div>

      <div className="fixed bottom-6 left-0 flex w-full justify-center">
        <Button
          className="mr-4 rounded-full font-bold"
          onClick={() => setFilterOpen(true)}
        >
          <Funnel strokeWidth={3} />
          Filter
        </Button>
        <StatsFilterDrawer
          open={filterOpen}
          filterValue={filter}
          onOpenChange={setFilterOpen}
          onFilterChange={setFilter}
        />
      </div>
    </Layout>
  )
}
