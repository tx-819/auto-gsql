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
  register: (
    username: string,
    password: string,
    email?: string,
    confirmPassword?: string
  ) => Promise<boolean>
  logout: () => Promise<void>
  checkAuth: () => Promise<boolean>
  clearAuth: () => void
  clearError: () => void
  setLoading: (loading: boolean) => void
}

// 创建认证store
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // 初始状态
      isAuthenticated: false,
      isLoading: false,
      user: null,
      token: null,
      error: null,

      // 登录
      login: async (username: string, password: string) => {
        set({ isLoading: true, error: null })
        if (!username.trim() || !password.trim()) {
          set({
            isLoading: false,
            error: '请输入用户名和密码'
          })
          return false
        }
        try {
          const response = await loginUser({ username, password })

          if (response.code === 200) {
            const { access_token } = response.data
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
      register: async (
        username: string,
        password: string,
        email?: string,
        confirmPassword?: string
      ) => {
        set({ isLoading: true, error: null })
        if (!username.trim()) {
          set({
            isLoading: false,
            error: '请输入用户名'
          })
          return false
        }
        if (username.length < 3) {
          set({
            isLoading: false,
            error: '用户名至少需要3个字符'
          })
          return false
        }
        if (!email?.trim()) {
          set({
            isLoading: false,
            error: '请输入邮箱地址'
          })
          return false
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email!)) {
          set({
            isLoading: false,
            error: '请输入有效的邮箱地址'
          })
          return false
        }
        if (!password) {
          set({
            isLoading: false,
            error: '请输入密码'
          })
          return false
        }
        if (password.length < 6) {
          set({
            isLoading: false,
            error: '密码至少需要6个字符'
          })
          return false
        }
        if (password !== confirmPassword) {
          set({
            isLoading: false,
            error: '两次输入的密码不一致'
          })
          return false
        }
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
        const token = get().token

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
          set({
            isAuthenticated: false,
            user: null,
            token: null
          })
          return false
        }
      },

      // 清除认证状态
      clearAuth: () => {
        set({ isAuthenticated: false, user: null, token: null })
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
