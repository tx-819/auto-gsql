import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  sendMessage,
  getTopics,
  getTopicMessages,
  archiveTopic,
  deleteTopic,
  type Topic,
  type Message,
  type StreamChunk,
  type StreamResult
} from '../services/chat'
import { type AIProvider } from '../utils/modelConfig'

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
  messages: Message[] // topicId -> messages
  isLoading: boolean
  error: string | null
  aiConfigs: AIConfigs

  // 动作
  loadTopics: () => Promise<void>
  loadMessages: (topicId: number) => Promise<void>
  deleteMessages: () => Promise<void>
  sendMessage: (
    content: string,
    onChunk: (chunk: StreamChunk) => void,
    onComplete: (result: StreamResult) => void,
    onError: (error: Error | string) => void,
    topicId?: number,
    provider?: AIProvider
  ) => Promise<boolean>
  archiveTopic: (topicId: number) => Promise<boolean>
  deleteTopic: (topicId: number) => Promise<boolean>
  setCurrentTopic: (topicId: number | null) => void
  setAIConfig: (provider: AIProvider, config: AIConfigs[AIProvider]) => void
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
    apiKey: '',
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
      messages: [],
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
          set({
            messages: messages,
            isLoading: false
          })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : '加载消息失败'
          set({ error: errorMessage, isLoading: false })
        }
      },

      // 删除消息
      deleteMessages: async () => {
        set({ messages: [], currentTopicId: null })
      },

      // 流式发送消息
      sendMessage: async (
        content: string,
        onChunk: (chunk: StreamChunk) => void,
        onComplete: (result: StreamResult) => void,
        onError: (error: Error | string) => void,
        topicId?: number,
        provider: AIProvider = 'openai'
      ) => {
        const { aiConfigs } = get()
        const selectedConfig = aiConfigs[provider]

        if (!selectedConfig?.apiKey) {
          const error = new Error(
            `请先配置${provider === 'openai' ? 'OpenAI' : 'DeepSeek'} API密钥`
          )
          set({ error: error.message })
          onError(error)
          return false
        }

        set({ isLoading: true, error: null })

        // 添加用户消息
        const userMessage: Message = {
          id: Date.now(),
          topicId: topicId || 0,
          userId: 1,
          role: 'user',
          content,
          createdAt: new Date().toISOString()
        }

        // 创建临时AI消息
        const tempAiMessage: Message = {
          id: Date.now() + 1,
          topicId: topicId || 0,
          userId: 1,
          role: 'assistant',
          content: '',
          createdAt: new Date().toISOString()
        }

        // 更新消息列表
        set((state) => ({
          messages: [...state.messages, userMessage, tempAiMessage],
          currentTopicId: topicId || 0
        }))

        let accumulatedContent = ''

        try {
          await sendMessage(content, {
            topicId,
            apiKey: selectedConfig.apiKey,
            baseURL: selectedConfig.baseURL,
            model: selectedConfig.model,
            onChunk: (chunk) => {
              if (chunk.content) {
                accumulatedContent += chunk.content
                // 更新AI消息内容
                set((state) => ({
                  messages: state.messages.map((msg) =>
                    msg.id === tempAiMessage.id ? { ...msg, content: accumulatedContent } : msg
                  )
                }))
              }
              onChunk(chunk)
            },
            onComplete: (result) => {
              // 更新最终消息
              set((state) => ({
                messages: state.messages.map((msg) =>
                  msg.id === tempAiMessage.id
                    ? { ...msg, id: result.messageId, content: result.fullContent }
                    : msg
                ),
                currentTopicId: result.topicId,
                isLoading: false
              }))

              // 如果是新话题，更新话题列表
              if (result.topicTitle) {
                set((state) => ({
                  topics: [
                    ...state.topics,
                    {
                      id: result.topicId,
                      userId: 1,
                      title: result.topicTitle || '新对话',
                      status: 1,
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString()
                    }
                  ]
                }))
              }

              onComplete(result)
            },
            onError: (error) => {
              set({
                isLoading: false,
                error: error instanceof Error ? error.message : String(error)
              })
              onError(error)
            }
          })
          return true
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : '发送消息失败'
          set({ error: errorMessage, isLoading: false })
          onError(error instanceof Error ? error : new Error(errorMessage))
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
              return {
                topics: state.topics.filter((topic) => topic.id !== topicId),
                messages: state.currentTopicId === topicId ? [] : state.messages,
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
        set((state) => ({
          aiConfigs: {
            ...state.aiConfigs,
            [provider]: config
          }
        }))
      },
      // 获取AI配置
      getAIConfig: async (provider: AIProvider) => {
        return get().aiConfigs[provider]
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
        currentTopicId: state.currentTopicId,
        aiConfigs: state.aiConfigs
      })
    }
  )
)
