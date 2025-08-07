import { ElectronAPI } from '@electron-toolkit/preload'
import { DbConnection, DbTableInfo } from '../main/database'

interface ConnectionResult {
  success: boolean
  message: string
  error?: string
}

interface Api {
  openExternalLink: (url: string) => Promise<boolean>
  database: {
    testConnection: (config: DbConnection) => Promise<ConnectionResult>
    createConnection: (config: DbConnection) => Promise<ConnectionResult>
    closeConnection: (connectionName: string) => Promise<ConnectionResult>
    executeQuery: (connectionName: string, query: string) => Promise<unknown>
    getConnectionStatus: (connectionName: string) => Promise<boolean>
    scanDatabase: (config: DbConnection) => Promise<{
      dbTableInfo: DbTableInfo[]
      uniqueArrayCols: string[]
    }>
  }
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: Api
  }
}
