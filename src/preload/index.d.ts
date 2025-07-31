import { ElectronAPI } from '@electron-toolkit/preload'

// AI配置接口
export interface AIConfig {
  apiKey: string
  baseURL: string
  model: string
}

type AIProvider = 'openai' | 'deepseek'

interface SettingsAPI {
  getAIConfig: (provider: AIProvider) => Promise<AIConfig>
  saveAIConfig: (provider: AIProvider, config: AIConfig) => Promise<boolean>
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
