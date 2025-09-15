import { Button } from '@/components/ui/button'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index
})

function Index() {
  return (
    <div className="p-6">
      <h1 className="mt-6 text-3xl font-bold">Sessions</h1>
      <p className="text-muted-foreground mb-8">
        Here you can view and manage all your training sessions.
      </p>
      <Link to="/sessions">
        <Button>Sessions</Button>
      </Link>
    </div>
  )
}
