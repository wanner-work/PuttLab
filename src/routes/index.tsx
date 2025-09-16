import AnalyticsCard from '@/components/analytics/AnalyticsCard'
import PageContainer from '@/components/basic/PageContainer'
import Logo from '@/components/brand/Logo'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'

export default function Index() {
  return (
    <PageContainer className="pb-26">
      <Logo className="max-w-full px-12" />
      <p className="text-muted-foreground mx-auto -mt-2 mb-8 max-w-64 text-center text-balance">
        Track and analyze your putting practice.
      </p>

      <AnalyticsCard />
      <div className="fixed bottom-6 left-1/2 w-full -translate-x-1/2 px-6">
        <Link to="/sessions" className="w-full">
          <Button className="w-full rounded-full font-bold">Sessions</Button>
        </Link>
      </div>
    </PageContainer>
  )
}
