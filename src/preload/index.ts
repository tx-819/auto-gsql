import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { AIConfig, AIProvider } from './index.d'

// Custom APIs for renderer
const api = {
  getAIConfig: (provider: AIProvider) => ipcRenderer.invoke('get-ai-config', provider),
  saveAIConfig: (provider: AIProvider, config: AIConfig) =>
    ipcRenderer.invoke('save-ai-config', provider, config),
  getAuthToken: () => ipcRenderer.invoke('get-auth-token'),
  saveAuthToken: (token: string) => ipcRenderer.invoke('save-auth-token', token),
  clearAuthToken: () => ipcRenderer.invoke('clear-auth-token')
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
