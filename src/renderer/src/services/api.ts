const API_CONFIG = {
  // API基础URL
  BASE_URL: process.env.NODE_ENV === 'production' ? 'https://your-production-api.com' : '/api', // 使用Vite代理

  // 请求超时时间（毫秒）
  TIMEOUT: 10000,

  // 重试次数
  RETRY_COUNT: 3,

  // 重试延迟（毫秒）
  RETRY_DELAY: 1000
}

// API基础配置
const API_BASE_URL = API_CONFIG.BASE_URL

export interface ApiResponse<T> {
  data: T
  message: string
  status: number
}

// 请求拦截器
export const request = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
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
