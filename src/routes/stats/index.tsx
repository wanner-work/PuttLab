import Header from '@/components/common/layout/Header.tsx'
import Headline from '@/components/common/layout/Headline.tsx'
import Layout from '@/components/common/layout/Layout.tsx'
import MakeDistance from '@/components/pages/stats/MakeDistance.tsx'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/stats/')({
  component: RouteComponent
})

function RouteComponent() {
  return (
    <Layout rows={['auto', 'auto', '1fr']} backTo="/">
      <Header backTo="/" />
      <Headline title="Stats" subtitle="Analyze your putting game." />

      <div>
        <MakeDistance />
      </div>
    </Layout>
  )
}
