import { ApiResponse, request } from './api'

// ==================== 类型定义 ====================

// 消息发送请求参数
export interface SendMessageRequest {
  content: string // 用户消息内容
  topicId?: number // 话题ID，不传则创建新话题
  apiKey: string // AI服务API密钥
  baseURL?: string // AI服务基础URL，默认使用OpenAI
  model?: string // 对话模型名称，默认gpt-3.5-turbo
  embeddingModel?: string // 嵌入模型名称，默认text-embedding-ada-002
}

// 消息发送响应
export interface SendMessageResponse {
  messageId: number // AI回复消息ID
  topicId: number // 话题ID
  content: string // AI回复内容
  topicTitle?: string // 话题标题（仅新话题时返回）
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
  const response = await request<SendMessageResponse>('/chat/send', {
    method: 'POST',
    body: JSON.stringify(messageData)
  })
  return response
}

/**
 * 获取当前用户的所有话题列表
 * @returns 话题列表
 */
export const getTopics = async (): Promise<Topic[]> => {
  const response = await request<Topic[]>('/chat/topics')
  return response.data
}

/**
 * 获取指定话题的所有消息记录
 * @param topicId 话题ID
 * @returns 消息列表
 */
export const getTopicMessages = async (topicId: number): Promise<Message[]> => {
  const response = await request<Message[]>(`/chat/topics/${topicId}/messages`)
  return response.data
}

/**
 * 将指定话题标记为已归档
 * @param topicId 话题ID
 * @returns 操作结果
 */
export const archiveTopic = async (topicId: number): Promise<ApiResponse<{ success: boolean }>> => {
  const response = await request<{ success: boolean }>(`/chat/topics/${topicId}/archive`, {
    method: 'PUT'
  })
  return response
}

/**
 * 删除话题
 * @param topicId 话题ID
 * @returns 操作结果
 */
export const deleteTopic = async (topicId: number): Promise<ApiResponse<{ success: boolean }>> => {
  const response = await request<{ success: boolean }>(`/chat/topics/${topicId}`, {
    method: 'DELETE'
  })
  return response
}
