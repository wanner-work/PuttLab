import { SplashScreen } from '@capacitor/splash-screen'
import { IonRouterOutlet } from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Route } from 'react-router-dom'
import QUERY from './constants/QUERY'
import initSqlite from './methods/setup/initSqlite'

import 'reflect-metadata'

import '@fontsource-variable/inter'
import '@fontsource/erica-one'
import './styles/style.css'

import '@ionic/react/css/core.css'
import Index from './routes'

const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryClientProvider client={QUERY.CLIENT}>
        <IonReactRouter>
          <IonRouterOutlet>
            <Route path="/sessions" render={() => <p>sessions</p>} />
            <Route path="/" exact render={() => <Index />} />
          </IonRouterOutlet>
        </IonReactRouter>
      </QueryClientProvider>
    </StrictMode>
  )
}

await SplashScreen.hide()

await initSqlite()
