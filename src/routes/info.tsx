import PageContainer from '@/components/basic/PageContainer'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { createFileRoute } from '@tanstack/react-router'
import pack from '../../package.json'

export const Route = createFileRoute('/info')({
  component: Info
})

function Info() {
  return (
    <PageContainer
      title="Information"
      subtitle="Get assistance and learn more about the app."
      back="/"
      className="flex flex-col gap-4"
    >
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
            The app is open-source and available on{' '}
            <a
              href="https://github.com/wanner-work/puttlab"
              target="_blank"
              className="underline"
              rel="noopener noreferrer"
            >
              GitHub
            </a>{' '}
            under the MIT license.
          </p>
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
      <Card>
        <CardHeader className="items-center pb-0">
          <CardTitle>Version</CardTitle>
          <CardDescription>{pack.version}</CardDescription>
        </CardHeader>
      </Card>
    </PageContainer>
  )
}
