import AnalyticsCard from '@/components/analytics/AnalyticsCard'
import PageContainer from '@/components/basic/PageContainer'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
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
      <Card className="mt-4">
        <CardHeader className="items-center pb-0">
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>
            More insights and features are on the way! Stay tuned for updates.
          </CardDescription>
        </CardHeader>
      </Card>
    </PageContainer>
  )
}
