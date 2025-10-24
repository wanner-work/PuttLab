import Header from '@/components/common/layout/Header'
import Headline from '@/components/common/layout/Headline'
import Layout from '@/components/common/layout/Layout'
import ModesList from '@/components/pages/modes/list/ModesList'
import useModes from '@/hooks/data/modes/useModes'
import { createFileRoute } from '@tanstack/react-router'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { memo } from 'react'

dayjs.extend(relativeTime)

export const Route = createFileRoute('/improved/modes/')({
  component: memo(Modes)
})

function Modes() {
  const modes = useModes()

  return (
    <Layout rows={['auto', 'auto', '1fr']} className="pb-0">
      <Header backTo="/improved" />
      <Headline title="Modes" subtitle="Train by playing a mode" />

      <ModesList modes={modes} />
    </Layout>
  )
}
