import AnalyticsCard from '@/components/analytics/AnalyticsCard'
import PageContainer from '@/components/basic/PageContainer'
import { Button } from '@/components/ui/button'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index
})

function Index() {
  return (
    <PageContainer
      className="pt-20 pb-26"
      title="PuttLab"
      subtitle="Welcome to PuttLab"
    >
      <AnalyticsCard />
      <div className="fixed bottom-6 left-1/2 w-full -translate-x-1/2 px-6">
        <Link to="/sessions" className="w-full">
          <Button className="w-full rounded-full font-bold">Sessions</Button>
        </Link>
      </div>
    </PageContainer>
  )
}
