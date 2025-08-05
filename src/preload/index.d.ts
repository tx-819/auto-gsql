import { ElectronAPI } from '@electron-toolkit/preload'

interface DbConnection {
  id: number
  name: string
  dbType: string
  host: string
  port: string
  databaseName: string
  username: string
  password: string
}

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
  }
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: Api
  }
}
