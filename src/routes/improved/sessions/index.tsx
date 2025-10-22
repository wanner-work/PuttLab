import Header from '@/components/common/layout/Header'
import Headline from '@/components/common/layout/Headline'
import Layout from '@/components/common/layout/Layout'
import { createFileRoute } from '@tanstack/react-router'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { memo } from 'react'

dayjs.extend(relativeTime)

export const Route = createFileRoute('/improved/sessions/')({
  component: memo(Sessions)
})

function Sessions() {
  return (
    <Layout rows={['auto', 'auto', '1fr']}>
      <Header />
      <Headline title="Sessions" subtitle="Manage your sessions effectively" />
    </Layout>
  )
}
