import { loadSettings, saveSettings, type AppSettings } from './settings'

const LEGACY_SETTINGS_KEY = 'app-settings'

export const migrateFromLocalStorage = async (): Promise<boolean> => {
  try {
    // 检查localStorage中是否有旧设置
    const legacySettings = localStorage.getItem(LEGACY_SETTINGS_KEY)
    if (!legacySettings) {
      return false // 没有需要迁移的数据
    }

    // 解析旧设置
    const parsedSettings = JSON.parse(legacySettings) as Partial<AppSettings>

    // 加载当前keytar设置
    const currentSettings = await loadSettings()

    // 合并设置，优先使用localStorage中的值
    const mergedSettings = { ...currentSettings, ...parsedSettings }

    // 保存到keytar
    const success = await saveSettings(mergedSettings)

    if (success) {
      // 迁移成功后删除localStorage中的数据
      localStorage.removeItem(LEGACY_SETTINGS_KEY)
      console.log('Settings migrated from localStorage to keytar successfully')
    }

    return success
  } catch (error) {
    console.error('Failed to migrate settings:', error)
    return false
  }
}

export const checkAndMigrate = async (): Promise<void> => {
  const hasLegacyData = localStorage.getItem(LEGACY_SETTINGS_KEY) !== null
  if (hasLegacyData) {
    console.log('Found legacy settings in localStorage, attempting migration...')
    await migrateFromLocalStorage()
  }
}
