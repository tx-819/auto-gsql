import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

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

// Custom APIs for renderer
const api = {
  openExternalLink: (url: string) => ipcRenderer.invoke('open-external-link', url),
  database: {
    testConnection: (config: DbConnection) =>
      ipcRenderer.invoke('database:test-connection', config),
    createConnection: (config: DbConnection) =>
      ipcRenderer.invoke('database:create-connection', config),
    closeConnection: (connectionName: string) =>
      ipcRenderer.invoke('database:close-connection', connectionName),
    executeQuery: (connectionName: string, query: string) =>
      ipcRenderer.invoke('database:execute-query', connectionName, query),
    getConnectionStatus: (connectionName: string) =>
      ipcRenderer.invoke('database:get-connection-status', connectionName)
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
