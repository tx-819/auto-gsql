import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { loginUser, registerUser, getUserInfo, validateToken, logoutUser } from '../services/auth'

// 用户信息接口
export interface User {
  id: number
  username: string
  email?: string
}

// 认证状态接口
interface AuthState {
  // 状态
  isAuthenticated: boolean
  isLoading: boolean
  user: User | null
  token: string | null
  error: string | null

  // 动作
  login: (username: string, password: string) => Promise<boolean>
  register: (username: string, password: string, email?: string) => Promise<boolean>
  logout: () => Promise<void>
  checkAuth: () => Promise<boolean>
  clearError: () => void
  setLoading: (loading: boolean) => void
}

// 创建认证store
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // 初始状态
      isAuthenticated: false,
      isLoading: false,
      user: null,
      token: null,
      error: null,

      // 登录
      login: async (username: string, password: string) => {
        set({ isLoading: true, error: null })

        try {
          const response = await loginUser({ username, password })

          if (response.code === 200) {
            const { access_token } = response.data

            // 保存token
            await window.api.saveAuthToken(access_token)

            // 获取用户信息
            const user = await getUserInfo()

            set({
              isAuthenticated: true,
              user,
              token: access_token,
              isLoading: false,
              error: null
            })

            return true
          } else {
            set({
              isLoading: false,
              error: response.message || '登录失败'
            })
            return false
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : '登录失败'
          set({
            isLoading: false,
            error: errorMessage
          })
          return false
        }
      },

      // 注册
      register: async (username: string, password: string, email?: string) => {
        set({ isLoading: true, error: null })

        try {
          const response = await registerUser({ username, password, email })

          if (response.code === 200) {
            set({
              isLoading: false,
              error: null
            })
            return true
          } else {
            set({
              isLoading: false,
              error: response.message || '注册失败'
            })
            return false
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : '注册失败'
          set({
            isLoading: false,
            error: errorMessage
          })
          return false
        }
      },

      // 登出
      logout: async () => {
        set({ isLoading: true })

        try {
          await logoutUser()
        } catch (error) {
          console.warn('Logout request failed:', error)
        }

        // 清除本地token
        await window.api.clearAuthToken()

        set({
          isAuthenticated: false,
          user: null,
          token: null,
          isLoading: false,
          error: null
        })
      },

      // 检查认证状态
      checkAuth: async () => {
        const token = await window.api.getAuthToken()

        if (!token) {
          set({
            isAuthenticated: false,
            user: null,
            token: null
          })
          return false
        }

        try {
          const isValid = await validateToken()

          if (isValid) {
            const user = await getUserInfo()
            set({
              isAuthenticated: true,
              user,
              token
            })
            return true
          } else {
            // Token无效，清除状态
            await window.api.clearAuthToken()
            set({
              isAuthenticated: false,
              user: null,
              token: null
            })
            return false
          }
        } catch (error) {
          console.error('Auth check failed:', error)
          // 验证失败，清除状态
          await window.api.clearAuthToken()
          set({
            isAuthenticated: false,
            user: null,
            token: null
          })
          return false
        }
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
      name: 'auth-storage', // 本地存储的key
      partialize: (state) => ({
        // 只持久化这些字段
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token
      })
    }
  )
)
