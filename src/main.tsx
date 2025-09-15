import { CapacitorSQLite } from '@capacitor-community/sqlite'
import { Capacitor } from '@capacitor/core'
import '@fontsource-variable/inter'
import '@fontsource/erica-one'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { defineCustomElements as jeepSqlite } from 'jeep-sqlite/loader'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'reflect-metadata'
import DataSource from './data/sources/DataSource'
import connection from './database'
import { routeTree } from './routeTree.gen'
import './styles/style.css'

import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Create a client
const queryClient = new QueryClient()

// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>
  )
}

jeepSqlite(window)

const platform = Capacitor.getPlatform()

console.log('Platform:', platform)

try {
  if (platform === 'web') {
    const jeepEl = document.createElement('jeep-sqlite')
    document.body.appendChild(jeepEl)
    await customElements.whenDefined('jeep-sqlite')
    await connection.initWebStore()

    console.log('initialized web store')
  }

  // when using Capacitor, you might want to close existing connections,
  // otherwise new connections will fail when using dev-live-reload
  // see https://github.com/capacitor-community/sqlite/issues/106
  await CapacitorSQLite.checkConnectionsConsistency({
    dbNames: [], // i.e. "i expect no connections to be open"
    openModes: []
  }).catch((e) => {
    // the plugin throws an error when closing connections. we can ignore
    // that since it is expected behaviour
    console.log(e)
    console.log('closing all connections')
    return {}
  })

  for (const connection of [DataSource]) {
    if (!connection.isInitialized) {
      await connection.initialize()
    }

    console.log(`Using database: ${connection.options.database}`)
    await connection.runMigrations()
  }

  if (platform === 'web') {
    console.log('saving to store')
    // save the database from memory to store
    await connection.saveToStore('puttlab')
  }
} catch (err) {
  console.error(err)
}

console.log('Database initialized')
