// AI模型配置
export type AIProvider = 'openai' | 'deepseek'

// 可用的模型列表
export const AVAILABLE_MODELS = {
  openai: [
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
    { value: 'gpt-3.5-turbo-16k', label: 'GPT-3.5 Turbo 16K' },
    { value: 'gpt-4', label: 'GPT-4' },
    { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
    { value: 'gpt-4-turbo-preview', label: 'GPT-4 Turbo Preview' },
    { value: 'gpt-4o', label: 'GPT-4o' },
    { value: 'gpt-4o-mini', label: 'GPT-4o Mini' }
  ],
  deepseek: [
    { value: 'deepseek-chat', label: 'DeepSeek Chat' },
    { value: 'deepseek-coder', label: 'DeepSeek Coder' },
    { value: 'deepseek-coder-33b-instruct', label: 'DeepSeek Coder 33B' },
    { value: 'deepseek-coder-6.7b-instruct', label: 'DeepSeek Coder 6.7B' },
    { value: 'deepseek-coder-1.3b-instruct', label: 'DeepSeek Coder 1.3B' }
  ]
} as const

// 模型显示名称映射
export const MODEL_DISPLAY_NAMES: Record<string, string> = {
  'gpt-3.5-turbo': 'GPT-3.5 Turbo',
  'gpt-3.5-turbo-16k': 'GPT-3.5 Turbo 16K',
  'gpt-4': 'GPT-4',
  'gpt-4-turbo': 'GPT-4 Turbo',
  'gpt-4-turbo-preview': 'GPT-4 Turbo Preview',
  'gpt-4o': 'GPT-4o',
  'gpt-4o-mini': 'GPT-4o Mini',
  'deepseek-chat': 'DeepSeek Chat',
  'deepseek-coder': 'DeepSeek Coder',
  'deepseek-coder-33b-instruct': 'DeepSeek Coder 33B',
  'deepseek-coder-6.7b-instruct': 'DeepSeek Coder 6.7B',
  'deepseek-coder-1.3b-instruct': 'DeepSeek Coder 1.3B'
}

// 获取模型显示名称
export const getModelDisplayName = (modelName: string): string => {
  return MODEL_DISPLAY_NAMES[modelName] || modelName
}

// 获取提供商显示名称
export const getProviderDisplayName = (provider: AIProvider): string => {
  return provider === 'openai' ? 'OpenAI' : 'DeepSeek'
}
