import PageContainer from '@/components/basic/PageContainer'
import SeedDrawer from '@/components/seed/SeedDrawer'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { createFileRoute } from '@tanstack/react-router'
import { Coffee } from 'lucide-react'
import { memo, useState } from 'react'
import pack from '../../package.json'

export const Route = createFileRoute('/info')({
  component: memo(Info)
})

function Info() {
  const [clicks, setClicks] = useState(0)

  const handleVersionClick = () => {
    setClicks((prev) => prev + 1)
  }

  return (
    <PageContainer
      title="Information"
      subtitle="Get assistance and learn more about the app."
      back="/"
      className="flex flex-col gap-4"
    >
      <SeedDrawer open={clicks > 5} onOpenChange={() => setClicks(0)} />
      <Card className="gap-3">
        <CardHeader className="items-center pb-0">
          <CardTitle>Developer</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground text-sm">
            This app is developed by{' '}
            <a
              href="https://wanner.work"
              target="_blank"
              className="underline"
              rel="noopener noreferrer"
            >
              wanner.work
            </a>
            , Jonas Wanner in Switzerland.
          </p>
          <p className="text-foreground mt-2 text-sm">
            The app is free, open-source and available on{' '}
            <a
              href="https://github.com/wanner-work/puttlab"
              target="_blank"
              className="underline"
              rel="noopener noreferrer"
            >
              GitHub
            </a>{' '}
            under the AGPL-3.0 license.
          </p>
          <a
            href="https://www.buymeacoffee.com/wanner.work"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 block"
          >
            <Button size="sm" className="w-full font-bold">
              <Coffee strokeWidth={3} />
              Buy me a coffee :)
            </Button>
          </a>
        </CardContent>
      </Card>
      <Card className="gap-3">
        <CardHeader className="items-center pb-0">
          <CardTitle>Feature Requests & Issues</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground text-sm">
            I appreciate your feedback! If you encounter any issues or have
            feature requests, please don't hesitate to create an issue on{' '}
            <a
              href="https://github.com/wanner-work/puttlab/issues"
              target="_blank"
              className="underline"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            .
          </p>
        </CardContent>
      </Card>
      <Card className="gap-3">
        <CardHeader className="items-center pb-0">
          <CardTitle>Roadmap</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground text-sm">
            I'am continuously working on improving the app and adding new
            features. Stay tuned for updates and new releases!
          </p>
          <p className="text-foreground mt-2 text-sm">
            The current planed features include:
          </p>
          <ul className="text-foreground mt-2 list-inside list-disc text-sm">
            <li>
              More analytics and insights, specifically analytics for each
              distance category (bullseye, circle one, circle two and outside
              the circle)
            </li>
            <li>
              Optional (!) social feature to connect and compete with others
            </li>
          </ul>
        </CardContent>
      </Card>
      <Card onClick={handleVersionClick}>
        <CardHeader className="items-center pb-0 select-none">
          <CardTitle>Version</CardTitle>
          <CardDescription>{pack.version}</CardDescription>
        </CardHeader>
      </Card>
    </PageContainer>
  )
}
