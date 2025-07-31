import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// 主题类型
export type Theme = 'light' | 'dark' | 'system'

// 语言类型
export type Language = 'zh-CN' | 'en-US'

// 应用设置接口
export interface AppSettings {
  theme: Theme
  language: Language
  autoSave: boolean
  notifications: boolean
  soundEnabled: boolean
  fontSize: number
  compactMode: boolean
}

// 设置状态接口
interface SettingsState {
  // 状态
  settings: AppSettings
  isLoading: boolean
  error: string | null

  // 动作
  updateSettings: (settings: Partial<AppSettings>) => void
  resetSettings: () => void
  setTheme: (theme: Theme) => void
  setLanguage: (language: Language) => void
  toggleAutoSave: () => void
  toggleNotifications: () => void
  toggleSound: () => void
  setFontSize: (size: number) => void
  toggleCompactMode: () => void
  clearError: () => void
  setLoading: (loading: boolean) => void
}

// 默认设置
const defaultSettings: AppSettings = {
  theme: 'system',
  language: 'zh-CN',
  autoSave: true,
  notifications: true,
  soundEnabled: true,
  fontSize: 14,
  compactMode: false
}

// 创建设置store
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // 初始状态
      settings: defaultSettings,
      isLoading: false,
      error: null,

      // 更新设置
      updateSettings: (newSettings: Partial<AppSettings>) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        }))
      },

      // 重置设置
      resetSettings: () => {
        set({ settings: defaultSettings })
      },

      // 设置主题
      setTheme: (theme: Theme) => {
        set((state) => ({
          settings: { ...state.settings, theme }
        }))
      },

      // 设置语言
      setLanguage: (language: Language) => {
        set((state) => ({
          settings: { ...state.settings, language }
        }))
      },

      // 切换自动保存
      toggleAutoSave: () => {
        set((state) => ({
          settings: { ...state.settings, autoSave: !state.settings.autoSave }
        }))
      },

      // 切换通知
      toggleNotifications: () => {
        set((state) => ({
          settings: { ...state.settings, notifications: !state.settings.notifications }
        }))
      },

      // 切换声音
      toggleSound: () => {
        set((state) => ({
          settings: { ...state.settings, soundEnabled: !state.settings.soundEnabled }
        }))
      },

      // 设置字体大小
      setFontSize: (size: number) => {
        set((state) => ({
          settings: { ...state.settings, fontSize: Math.max(10, Math.min(20, size)) }
        }))
      },

      // 切换紧凑模式
      toggleCompactMode: () => {
        set((state) => ({
          settings: { ...state.settings, compactMode: !state.settings.compactMode }
        }))
      },

      // 清除错误
      clearError: () => {
        set({ error: null })
      },

      // 设置加载状态
      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      }
    }),
    {
      name: 'settings-storage',
      partialize: (state) => ({
        // 持久化所有设置
        settings: state.settings
      })
    }
  )
)
