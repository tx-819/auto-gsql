export interface AppSettings {
  openaiApiKey: string
  openaiBaseUrl: string
  model: string
}

const DEFAULT_SETTINGS: AppSettings = {
  openaiApiKey: '',
  openaiBaseUrl: 'https://api.openai.com/v1',
  model: 'gpt-4'
}

export const loadSettings = async (): Promise<AppSettings> => {
  try {
    const savedSettings = await window.api.getSettings()
    if (savedSettings) {
      return { ...DEFAULT_SETTINGS, ...savedSettings }
    }
  } catch (error) {
    console.error('Failed to load settings:', error)
  }
  return { ...DEFAULT_SETTINGS }
}

export const saveSettings = async (settings: AppSettings): Promise<boolean> => {
  try {
    return await window.api.saveSettings(settings)
  } catch (error) {
    console.error('Failed to save settings:', error)
    return false
  }
}

export const getApiKey = async (): Promise<string> => {
  const settings = await loadSettings()
  return settings.openaiApiKey
}

export const getApiBaseUrl = async (): Promise<string> => {
  const settings = await loadSettings()
  return settings.openaiBaseUrl
}

export const getModel = async (): Promise<string> => {
  const settings = await loadSettings()
  return settings.model
}

export const hasValidApiKey = async (): Promise<boolean> => {
  const apiKey = await getApiKey()
  return apiKey.trim().length > 0 && apiKey.startsWith('sk-')
}
