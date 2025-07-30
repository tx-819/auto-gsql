// API配置
export const API_CONFIG = {
  // API基础URL
  BASE_URL: process.env.NODE_ENV === 'production' ? 'https://your-production-api.com' : '/api', // 使用Vite代理

  // 请求超时时间（毫秒）
  TIMEOUT: 10000,

  // 重试次数
  RETRY_COUNT: 3,

  // 重试延迟（毫秒）
  RETRY_DELAY: 1000
}

// API端点
export const API_ENDPOINTS = {
  // 认证相关
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    VALIDATE: '/auth/validate'
  },

  // 用户相关
  USERS: {
    REGISTER: '/users/register',
    PROFILE: '/users/profile'
  },

  // 聊天相关
  CHAT: {
    TOPICS: '/chat/topics',
    MESSAGES: '/chat/messages'
  }
}

// 错误消息
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接失败，请检查网络设置',
  TIMEOUT_ERROR: '请求超时，请稍后重试',
  UNAUTHORIZED: '认证失败，请重新登录',
  FORBIDDEN: '权限不足',
  NOT_FOUND: '请求的资源不存在',
  SERVER_ERROR: '服务器内部错误',
  UNKNOWN_ERROR: '未知错误，请稍后重试'
}
