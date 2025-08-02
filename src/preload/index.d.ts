import { ElectronAPI } from '@electron-toolkit/preload'

interface Api {
  openExternalLink: (url: string) => Promise<boolean>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: Api
  }
}
