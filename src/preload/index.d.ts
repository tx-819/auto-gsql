import { ElectronAPI } from '@electron-toolkit/preload'

interface SettingsAPI {
  getSettings: () => Promise<unknown>
  saveSettings: (settings: unknown) => Promise<boolean>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: SettingsAPI
  }
}
