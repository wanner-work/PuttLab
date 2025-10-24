import Header from '@/components/common/layout/Header'
import Headline from '@/components/common/layout/Headline'
import Layout from '@/components/common/layout/Layout'
import ModeRequirements from '@/components/pages/modes/description/ModeRequirements'
import useMode from '@/hooks/modes/useMode'
import { createFileRoute } from '@tanstack/react-router'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { memo } from 'react'

dayjs.extend(relativeTime)

export const Route = createFileRoute('/improved/modes/$modeId')({
  component: memo(Modes)
})

function Modes() {
  const mode = useMode(Route.useParams().modeId)

  return (
    <Layout rows={['auto', 'auto', '1fr']} className="pb-0">
      <Header backTo="/improved/modes" />
      <Headline title={mode.name} subtitle={mode.description} />

      <ModeRequirements requirements={mode.requirements} />
    </Layout>
  )
}
