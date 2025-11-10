import Header from '@/components/common/layout/Header.tsx'
import Layout from '@/components/common/layout/Layout.tsx'
import StatsFilter from '@/components/pages/stats/filter/StatsFilter.tsx'
import useSessionsFilter from '@/hooks/data/sessions/useSessionsFilter.ts'
import type FilterValue from '@/interfaces/data/filter/FilterValue.ts'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/stats/filter/')({
  component: RouteComponent
})

function RouteComponent() {
  const [filter, setFilter] = useState<FilterValue>()

  const { data } = useSessionsFilter(filter)
  return (
    <Layout rows={['auto', 'auto', '1fr']} backTo="/stats">
      <Header backTo="/stats" />
      <StatsFilter onChange={setFilter} />
      Length: {data?.length || 0}
    </Layout>
  )
}
