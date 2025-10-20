import { SplashScreen } from '@capacitor/splash-screen'
import { QueryClientProvider } from '@tanstack/react-query'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import QUERY from './constants/QUERY'
import initSqlite from './methods/setup/initSqlite'
import { routeTree } from './routeTree.gen'

import 'reflect-metadata'

import getSettings from '@/methods/data/get/getSettings.ts'
import '@fontsource-variable/inter'
import '@fontsource/erica-one'
import './styles/style.css'
import './styles/transitions.css'

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultStaleTime: Infinity,
  scrollRestoration: true,
  defaultPendingMinMs: 0
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const settings = await getSettings()

const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  QUERY.CLIENT.setQueryData([QUERY.CACHE_KEYS.SETTINGS], settings)

  const root = createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryClientProvider client={QUERY.CLIENT}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>
  )
}

await SplashScreen.hide()

await initSqlite()
