import connection from '@/data/connections/defaultConnection'
import PuttLabDataSource from '@/data/sources/PuttLabDataSource'
import { CapacitorSQLite } from '@capacitor-community/sqlite'
import { Capacitor } from '@capacitor/core'
import { defineCustomElements as jeepSqlite } from 'jeep-sqlite/loader'

export default async function initSqlite() {
  jeepSqlite(window)

  const platform = Capacitor.getPlatform()

  try {
    if (platform === 'web') {
      const jeepEl = document.createElement('jeep-sqlite')
      document.body.appendChild(jeepEl)

      await customElements.whenDefined('jeep-sqlite')
      await connection.initWebStore()
    }

    await CapacitorSQLite.checkConnectionsConsistency({
      dbNames: [],
      openModes: []
    }).catch((e) => {
      console.log(e)
      console.log('closing all connections')
      return {}
    })

    for (const connection of [PuttLabDataSource]) {
      if (!connection.isInitialized) {
        await connection.initialize()
      }

      await connection.runMigrations()
    }

    if (platform === 'web') {
      // save the database from memory to store
      await connection.saveToStore('puttlab')
    }
  } catch (err) {
    console.error(err)
  }
}
