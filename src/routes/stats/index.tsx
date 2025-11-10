import Header from '@/components/common/layout/Header.tsx'
import Headline from '@/components/common/layout/Headline.tsx'
import Layout from '@/components/common/layout/Layout.tsx'
import EightyDistance from '@/components/pages/stats/EightyDistance.tsx'
import ProjectedDistance from '@/components/pages/stats/ProjectedDistance.tsx'
import TotalPutts from '@/components/pages/stats/TotalPutts'
import { Button } from '@/components/ui/button.tsx'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ChartNoAxesCombined } from 'lucide-react'

export const Route = createFileRoute('/stats/')({
  component: RouteComponent
})

function RouteComponent() {
  return (
    <Layout rows={['auto', 'auto', '1fr']} backTo="/">
      <Header backTo="/" />
      <Headline title="Stats" subtitle="Analyze your putting game." />

      <div className="flex flex-col gap-4">
        <EightyDistance />
        <ProjectedDistance />
        <TotalPutts />
      </div>

      <div className="fixed bottom-6 left-0 flex w-full justify-center">
        <Link
          to="/stats/filter"
          viewTransition={{
            types: ['slide-left']
          }}
        >
          <Button className="mr-4 rounded-full font-bold">
            <ChartNoAxesCombined strokeWidth={3} />
            <span>Advanced</span>
          </Button>
        </Link>
      </div>
    </Layout>
  )
}
