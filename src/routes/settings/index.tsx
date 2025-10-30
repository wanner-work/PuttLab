import Header from '@/components/common/layout/Header'
import Headline from '@/components/common/layout/Headline'
import Layout from '@/components/common/layout/Layout'
import LoadingDisplay from '@/components/common/loading/LoadingDisplay'
import Editor from '@/components/pages/settings/Editor'
import Version from '@/components/pages/settings/Version'
import useSettings from '@/hooks/data/settings/useSettings'
import { createFileRoute } from '@tanstack/react-router'
import { AnimatePresence } from 'motion/react'

export const Route = createFileRoute('/settings/')({
  component: RouteComponent
})

function RouteComponent() {
  const { settings, isLoading } = useSettings()

  return (
    <Layout rows={['auto', 'auto', '1fr', 'auto']} backTo="/">
      <Header backTo="/" />
      <Headline title="Settings" subtitle="Fine-tune your experience" />

      <AnimatePresence mode="wait">
        {isLoading || !settings ? (
          <LoadingDisplay />
        ) : (
          <Editor settings={settings} />
        )}
      </AnimatePresence>

      <Version />
    </Layout>
  )
}
