import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  sendMessage,
  getTopics,
  getTopicMessages,
  archiveTopic,
  deleteTopic,
  type SendMessageRequest,
  type Topic,
  type Message
} from '../services/chat'

type AIProvider = 'openai' | 'deepseek'

// AI配置接口
export type AIConfigs = Record<
  AIProvider,
  {
    apiKey: string
    baseURL: string
    model: string
  }
>

// 聊天状态接口
interface ChatState {
  // 状态
  topics: Topic[]
  currentTopicId: number | null
  messages: Record<number, Message[]> // topicId -> messages
  isLoading: boolean
  error: string | null
  aiConfigs: AIConfigs

  // 动作
  loadTopics: () => Promise<void>
  loadMessages: (topicId: number) => Promise<void>
  deleteMessages: (topicId: number) => Promise<void>
  sendMessage: (content: string, topicId?: number, provider?: AIProvider) => Promise<boolean>
  archiveTopic: (topicId: number) => Promise<boolean>
  deleteTopic: (topicId: number) => Promise<boolean>
  setCurrentTopic: (topicId: number | null) => void
  setAIConfig: (provider: AIProvider, config: AIConfigs[AIProvider]) => Promise<boolean>
  getAIConfig: (provider: AIProvider) => Promise<AIConfigs[AIProvider]>
  clearError: () => void
  setLoading: (loading: boolean) => void
}

// 默认AI配置（可在初始化时使用）
export const defaultAIConfig: AIConfigs = {
  openai: {
    apiKey: '',
    baseURL: 'https://api.openai.com/v1',
    model: 'gpt-3.5-turbo'
  },
  deepseek: {
    apiKey: 'sk-ceaf96b004774124bf6a557e8595683f',
    baseURL: 'https://api.deepseek.com/v1',
    model: 'deepseek-chat'
  }
}

// 创建聊天store
export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      // 初始状态
      topics: [],
      currentTopicId: null,
      messages: {},
      isLoading: false,
      error: null,
      aiConfigs: defaultAIConfig,

      // 加载话题列表
      loadTopics: async () => {
        set({ isLoading: true, error: null })

        try {
          const topics = await getTopics()
          set({ topics, isLoading: false })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : '加载话题失败'
          set({ error: errorMessage, isLoading: false })
        }
      },

      // 加载话题消息
      loadMessages: async (topicId: number) => {
        set({ isLoading: true, error: null })

        try {
          const messages = await getTopicMessages(topicId)
          set((state) => ({
            messages: {
              ...state.messages,
              [topicId]: messages
            },
            isLoading: false
          }))
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : '加载消息失败'
          set({ error: errorMessage, isLoading: false })
        }
      },

      // 删除消息
      deleteMessages: async (topicId: number) => {
        set((state) => {
          const newMessages = { ...state.messages }
          delete newMessages[topicId]
          return { messages: newMessages, currentTopicId: null }
        })
      },

      // 发送消息
      sendMessage: async (content: string, topicId?: number, provider: AIProvider = 'openai') => {
        const { aiConfigs } = get()
        const selectedConfig = aiConfigs[provider]

        if (!selectedConfig?.apiKey) {
          set({ error: `请先配置${provider === 'openai' ? 'OpenAI' : 'DeepSeek'} API密钥` })
          return false
        }

        set({ isLoading: true, error: null })

        try {
          const messageData: SendMessageRequest = {
            content,
            topicId,
            apiKey: selectedConfig.apiKey,
            baseURL: selectedConfig.baseURL,
            model: selectedConfig.model
          }

          const response = await sendMessage(messageData)
          if (response.code === 200) {
            const { messageId, topicId: newTopicId, content: aiContent, topicTitle } = response.data

            // 更新话题列表（如果是新话题）
            if (topicTitle) {
              set((state) => ({
                topics: [
                  ...state.topics,
                  {
                    id: newTopicId,
                    userId: 1, // 这里应该从auth store获取
                    title: topicTitle,
                    status: 1,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                  }
                ]
              }))
            }

            // 添加用户消息
            const userMessage: Message = {
              id: Date.now(), // 临时ID
              topicId: newTopicId,
              userId: 1, // 这里应该从auth store获取
              role: 'user',
              content,
              createdAt: new Date().toISOString()
            }

            // 添加AI回复
            const aiMessage: Message = {
              id: messageId,
              topicId: newTopicId,
              userId: 1, // 这里应该从auth store获取
              role: 'assistant',
              content: aiContent,
              createdAt: new Date().toISOString()
            }

            // 更新消息列表
            set((state) => ({
              messages: {
                ...state.messages,
                [newTopicId]: [...(state.messages[newTopicId] || []), userMessage, aiMessage]
              },
              currentTopicId: newTopicId,
              isLoading: false
            }))

            return true
          } else {
            set({
              isLoading: false,
              error: response.message || '发送消息失败'
            })
            return false
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : '发送消息失败'
          set({ error: errorMessage, isLoading: false })
          return false
        }
      },

      // 归档话题
      archiveTopic: async (topicId: number) => {
        set({ isLoading: true, error: null })

        try {
          const response = await archiveTopic(topicId)

          if (response.code === 200) {
            set((state) => ({
              topics: state.topics.map((topic) =>
                topic.id === topicId ? { ...topic, status: 2 } : topic
              ),
              isLoading: false
            }))
            return true
          } else {
            set({
              isLoading: false,
              error: response.message || '归档话题失败'
            })
            return false
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : '归档话题失败'
          set({ error: errorMessage, isLoading: false })
          return false
        }
      },

      // 删除话题
      deleteTopic: async (topicId: number) => {
        set({ isLoading: true, error: null })

        try {
          const response = await deleteTopic(topicId)

          if (response.code === 200) {
            set((state) => {
              const newMessages = { ...state.messages }
              delete newMessages[topicId]

              return {
                topics: state.topics.filter((topic) => topic.id !== topicId),
                messages: newMessages,
                currentTopicId: state.currentTopicId === topicId ? null : state.currentTopicId,
                isLoading: false
              }
            })
            return true
          } else {
            set({
              isLoading: false,
              error: response.message || '删除话题失败'
            })
            return false
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : '删除话题失败'
          set({ error: errorMessage, isLoading: false })
          return false
        }
      },

      // 设置当前话题
      setCurrentTopic: (topicId: number | null) => {
        set({ currentTopicId: topicId })
      },

      // 设置AI配置
      setAIConfig: async (provider: AIProvider, config: AIConfigs[AIProvider]) => {
        const success = await window.api.saveAIConfig(provider, config)
        set((state) => ({
          aiConfigs: {
            ...state.aiConfigs,
            [provider]: config
          }
        }))
        return success
      },
      // 获取AI配置
      getAIConfig: async (provider: AIProvider) => {
        const config = await window.api.getAIConfig(provider)
        set((state) => ({
          aiConfigs: {
            ...state.aiConfigs,
            [provider]: config
          }
        }))
        return config
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
      name: 'chat-storage',
      partialize: (state) => ({
        currentTopicId: state.currentTopicId
      })
    }
  )
)
