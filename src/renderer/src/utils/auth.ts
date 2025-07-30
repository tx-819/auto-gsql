export interface User {
  id: string
  username: string
  email?: string
  avatar?: string
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

// 模拟用户数据（实际应用中应该从服务器获取）
const MOCK_USERS = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    email: 'admin@example.com'
  },
  {
    id: '2',
    username: 'user',
    password: 'user123',
    email: 'user@example.com'
  }
]

// 从keytar获取当前用户
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const userData = await window.api.getCurrentUser()
    return userData ? JSON.parse(userData) : null
  } catch (error) {
    console.error('Failed to get current user:', error)
    return null
  }
}

// 保存用户登录状态到keytar
export const saveUserSession = async (user: User): Promise<boolean> => {
  try {
    return await window.api.saveUserSession(JSON.stringify(user))
  } catch (error) {
    console.error('Failed to save user session:', error)
    return false
  }
}

// 清除用户登录状态
export const clearUserSession = async (): Promise<boolean> => {
  try {
    return await window.api.clearUserSession()
  } catch (error) {
    console.error('Failed to clear user session:', error)
    return false
  }
}

// 验证登录凭据
export const validateCredentials = async (credentials: LoginCredentials): Promise<User | null> => {
  try {
    // 模拟API调用延迟
    await new Promise((resolve) => setTimeout(resolve, 500))

    // 查找匹配的用户
    const user = MOCK_USERS.find(
      (u) => u.username === credentials.username && u.password === credentials.password
    )

    if (user) {
      // 返回用户信息（不包含密码）
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userInfo } = user
      return userInfo as User
    }

    return null
  } catch (error) {
    console.error('Failed to validate credentials:', error)
    return null
  }
}

// 检查用户是否已登录
export const isAuthenticated = async (): Promise<boolean> => {
  const user = await getCurrentUser()
  return user !== null
}

// 登录
export const login = async (credentials: LoginCredentials): Promise<boolean> => {
  try {
    const user = await validateCredentials(credentials)
    if (user) {
      const success = await saveUserSession(user)
      return success
    }
    return false
  } catch (error) {
    console.error('Login failed:', error)
    return false
  }
}

// 注册
export const register = async (credentials: RegisterCredentials): Promise<boolean> => {
  try {
    return await window.api.register(credentials)
  } catch (error) {
    console.error('Registration failed:', error)
    return false
  }
}

// 登出
export const logout = async (): Promise<boolean> => {
  try {
    return await clearUserSession()
  } catch (error) {
    console.error('Logout failed:', error)
    return false
  }
}
