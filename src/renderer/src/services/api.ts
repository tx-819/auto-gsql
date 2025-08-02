import { useAuthStore } from '../stores/authStore'

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
  code: number
  data: T
  message: string
}

// 请求拦截器
export const request = async <T>(
  endpoint: string,
  options: RequestInit = {},
  returnResponse: boolean = false
): Promise<ApiResponse<T> | Response> => {
  const url = `${API_BASE_URL}${endpoint}`

  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  }
  // 添加认证Token（如果存在）
  const token = useAuthStore.getState().token
  if (token) {
    defaultOptions.headers = {
      ...defaultOptions.headers,
      Authorization: `Bearer ${token}`
    }
  }
  const response = await fetch(url, defaultOptions)
  // 如果响应状态码为401，则清除Token并重定向到登录页面
  if (response.status === 401) {
    useAuthStore.getState().clearAuth()
    window.location.href = '/login'
  }

  // 如果需要返回原始Response对象（用于流式请求）
  if (returnResponse) {
    return response
  }

  return await response.json()
}
