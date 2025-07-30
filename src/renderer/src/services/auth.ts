import { ApiResponse, request } from './api'

// 用户注册
export const registerUser = async (userData: {
  username: string
  password: string
  email?: string
}): Promise<ApiResponse<{ id: number; username: string }>> => {
  const response = await request<{ id: number; username: string }>('/users/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  })
  return response
}

// 用户登录
export const loginUser = async (credentials: {
  username: string
  password: string
}): Promise<ApiResponse<{ access_token: string }>> => {
  const response = await request<{ access_token: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  })
  return response
}

// 获取用户信息
export const getUserInfo = async (): Promise<{ id: number; username: string; email?: string }> => {
  const response = await request<{ id: number; username: string; email?: string }>('/users/profile')
  return response.data
}

// 验证Token有效性
export const validateToken = async (): Promise<boolean> => {
  try {
    await request('/auth/validate')
    return true
  } catch {
    return false
  }
}

// 登出
export const logoutUser = async (): Promise<void> => {
  try {
    await request('/auth/logout', { method: 'POST' })
  } catch (error) {
    console.warn('Logout request failed:', error)
  }
}
