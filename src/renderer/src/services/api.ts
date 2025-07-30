import { API_CONFIG, API_ENDPOINTS } from '../config/api'

// API基础配置
const API_BASE_URL = API_CONFIG.BASE_URL

interface ApiResponse<T> {
  data: T
  message: string
  status: number
}

// 请求拦截器
const request = async <T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> => {
  const url = `${API_BASE_URL}${endpoint}`

  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  }

  // 添加认证Token（如果存在）
  const token = await window.api.getAuthToken()
  if (token) {
    defaultOptions.headers = {
      ...defaultOptions.headers,
      Authorization: `Bearer ${token}`
    }
  }
  const response = await fetch(url, defaultOptions)
  return await response.json()
}

// 用户注册
export const registerUser = async (userData: {
  username: string
  password: string
  email?: string
}): Promise<ApiResponse<{ id: number; username: string }>> => {
  const response = await request<{ id: number; username: string }>(API_ENDPOINTS.USERS.REGISTER, {
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
  const response = await request<{ access_token: string }>(API_ENDPOINTS.AUTH.LOGIN, {
    method: 'POST',
    body: JSON.stringify(credentials)
  })
  return response
}

// 获取用户信息
export const getUserInfo = async (): Promise<{ id: number; username: string; email?: string }> => {
  const response = await request<{ id: number; username: string; email?: string }>(
    API_ENDPOINTS.USERS.PROFILE
  )
  return response.data
}

// 验证Token有效性
export const validateToken = async (): Promise<boolean> => {
  try {
    await request(API_ENDPOINTS.AUTH.VALIDATE)
    return true
  } catch {
    return false
  }
}

// 登出
export const logoutUser = async (): Promise<void> => {
  try {
    await request(API_ENDPOINTS.AUTH.LOGOUT, { method: 'POST' })
  } catch (error) {
    console.warn('Logout request failed:', error)
  }
}
