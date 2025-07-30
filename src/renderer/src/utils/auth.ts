import { registerUser, loginUser, getUserInfo, validateToken, logoutUser } from '../services/api'

export interface User {
  id: number
  username: string
  email?: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface RegisterCredentials {
  username: string
  email: string
  password: string
}

// 从API获取当前用户
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    // 首先验证Token是否有效
    const isValid = await validateToken()
    if (!isValid) {
      // Token无效，清除存储的Token
      await window.api.clearAuthToken()
      return null
    }

    // Token有效，获取用户信息
    const user = await getUserInfo()
    return user
  } catch (error) {
    console.error('Failed to get current user:', error)
    // 清除无效的Token
    await window.api.clearAuthToken()
    return null
  }
}

// 检查用户是否已登录
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const token = await window.api.getAuthToken()
    if (!token) {
      return false
    }

    // 验证Token有效性
    return await validateToken()
  } catch (error) {
    console.error('Auth check failed:', error)
    return false
  }
}

// 登录
export const login = async (credentials: LoginCredentials): Promise<boolean> => {
  try {
    const response = await loginUser(credentials)

    // 保存Token到keytar
    const success = await window.api.saveAuthToken(response.data.access_token)
    return success
  } catch (error) {
    console.error('Login failed:', error)
    return false
  }
}

// 注册
export const register = async (credentials: RegisterCredentials): Promise<boolean> => {
  try {
    await registerUser(credentials)
    return true
  } catch (error) {
    console.error('Registration failed:', error)
    return false
  }
}

// 登出
export const logout = async (): Promise<boolean> => {
  try {
    // 调用API登出
    await logoutUser()

    // 清除本地Token
    const success = await window.api.clearAuthToken()
    return success
  } catch (error) {
    console.error('Logout failed:', error)
    // 即使API调用失败，也要清除本地Token
    return await window.api.clearAuthToken()
  }
}
