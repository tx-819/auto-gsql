import { ElectronAPI } from '@electron-toolkit/preload'

interface SettingsAPI {
  getSettings: () => Promise<unknown>
  saveSettings: (settings: unknown) => Promise<boolean>
  getCurrentUser: () => Promise<string | null>
  getAuthToken: () => Promise<string | null>
  saveAuthToken: (token: string) => Promise<boolean>
  clearAuthToken: () => Promise<boolean>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: SettingsAPI
  }
}
