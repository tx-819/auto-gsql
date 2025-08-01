import { ApiResponse, request } from './api'

// ==================== 类型定义 ====================

// 消息发送请求参数
export interface SendMessageRequest {
  content: string // 用户消息内容
  topicId?: number // 话题ID，不传则创建新话题
  apiKey: string // AI服务API密钥
  baseURL?: string // AI服务基础URL，默认使用OpenAI
  model?: string // 对话模型名称，默认gpt-3.5-turbo
}

// 消息发送响应
export interface SendMessageResponse {
  messageId: number // AI回复消息ID
  topicId: number // 话题ID
  content: string // AI回复内容
  topicTitle?: string // 话题标题（仅新话题时返回）
}

// 流式消息块
export interface StreamChunk {
  content: string
  done: boolean
  topicId?: number
  messageId?: number
  topicTitle?: string
}

// 流式消息结果
export interface StreamResult {
  messageId: number
  topicId: number
  topicTitle?: string
  fullContent: string
}

// 流式消息选项
export interface StreamMessageOptions {
  topicId?: number
  apiKey: string
  baseURL?: string
  model?: string
  onChunk?: (chunk: StreamChunk) => void
  onComplete?: (result: StreamResult) => void
  onError?: (error: Error | string) => void
}

// 话题信息
export interface Topic {
  id: number // 话题ID
  userId: number // 用户ID
  title: string // 话题标题
  status: number // 话题状态：1-活跃，2-已归档
  createdAt: string // 创建时间
  updatedAt: string // 更新时间
}

// 消息信息
export interface Message {
  id: number // 消息ID
  topicId: number // 话题ID
  userId: number // 用户ID
  role: 'user' | 'assistant' // 消息角色：user-用户，assistant-AI助手
  content: string // 消息内容
  createdAt: string // 创建时间
}

// 话题统计信息
export interface TopicStats {
  messageCount: number // 总消息数
  userMessageCount: number // 用户消息数
  assistantMessageCount: number // AI助手消息数
  lastActivity: string // 最后活动时间
}

// ==================== API函数 ====================

/**
 * 发送消息并获取AI回复
 * @param messageData 消息数据
 * @returns AI回复信息
 */
export const sendMessage = async (
  messageData: SendMessageRequest
): Promise<ApiResponse<SendMessageResponse>> => {
  const response = (await request<SendMessageResponse>('/chat/send', {
    method: 'POST',
    body: JSON.stringify(messageData)
  })) as ApiResponse<SendMessageResponse>
  return response
}

/**
 * 获取当前用户的所有话题列表
 * @returns 话题列表
 */
export const getTopics = async (): Promise<Topic[]> => {
  const response = (await request<Topic[]>('/chat/topics')) as ApiResponse<Topic[]>
  return response.data
}

/**
 * 获取指定话题的所有消息记录
 * @param topicId 话题ID
 * @returns 消息列表
 */
export const getTopicMessages = async (topicId: number): Promise<Message[]> => {
  const response = (await request<Message[]>(`/chat/topics/${topicId}/messages`)) as ApiResponse<
    Message[]
  >
  return response.data
}

/**
 * 将指定话题标记为已归档
 * @param topicId 话题ID
 * @returns 操作结果
 */
export const archiveTopic = async (topicId: number): Promise<ApiResponse<{ success: boolean }>> => {
  const response = (await request<{ success: boolean }>(`/chat/topics/${topicId}/archive`, {
    method: 'PUT'
  })) as ApiResponse<{ success: boolean }>
  return response
}

/**
 * 删除话题
 * @param topicId 话题ID
 * @returns 操作结果
 */
export const deleteTopic = async (topicId: number): Promise<ApiResponse<{ success: boolean }>> => {
  const response = (await request<{ success: boolean }>(`/chat/topics/${topicId}`, {
    method: 'DELETE'
  })) as ApiResponse<{ success: boolean }>
  return response
}

/**
 * 流式发送消息
 * @param content 消息内容
 * @param options 流式选项
 */
export const sendMessageStream = async (
  content: string,
  options: StreamMessageOptions
): Promise<void> => {
  try {
    const response = (await request(
      '/chat/send',
      {
        method: 'POST',
        body: JSON.stringify({
          content,
          topicId: options.topicId,
          apiKey: options.apiKey,
          baseURL: options.baseURL,
          model: options.model
        })
      },
      true
    )) as Response

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    if (!reader) {
      throw new Error('Response body is null')
    }

    let buffer = ''
    let accumulatedContent = ''

    while (true) {
      const { done, value } = await reader.read()

      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')

      // 保留最后一个不完整的行
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6))

            if (data.error) {
              options.onError?.(new Error(data.error))
              return
            }

            const chunk: StreamChunk = {
              content: data.content,
              done: data.done,
              topicId: data.topicId,
              messageId: data.messageId,
              topicTitle: data.topicTitle
            }

            if (data.content) {
              accumulatedContent += data.content
            }

            options.onChunk?.(chunk)

            if (data.done) {
              const result: StreamResult = {
                messageId: data.messageId,
                topicId: data.topicId,
                topicTitle: data.topicTitle,
                fullContent: accumulatedContent
              }
              options.onComplete?.(result)
              return
            }
          } catch (error) {
            console.error('Error parsing SSE data:', error)
          }
        }
      }
    }
  } catch (error) {
    options.onError?.(error instanceof Error ? error : new Error(String(error)))
  }
}
