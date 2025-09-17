import AnalyticsCard from '@/components/analytics/AnalyticsCard'
import PageContainer from '@/components/basic/PageContainer'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/analytics')({
  component: Analytics
})

function Analytics() {
  return (
    <PageContainer
      title="Analytics"
      subtitle="Track and analyze your putting practice."
      back="/"
    >
      <AnalyticsCard />
    </PageContainer>
  )
}
