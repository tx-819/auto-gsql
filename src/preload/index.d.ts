import { ElectronAPI } from '@electron-toolkit/preload'

interface SettingsAPI {
  getSettings: () => Promise<unknown>
  saveSettings: (settings: unknown) => Promise<boolean>
  getCurrentUser: () => Promise<string | null>
  saveUserSession: (userData: string) => Promise<boolean>
  clearUserSession: () => Promise<boolean>
  login: (credentials: { username: string; password: string }) => Promise<boolean>
  register: (userData: { username: string; email: string; password: string }) => Promise<boolean>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: SettingsAPI
  }
}
