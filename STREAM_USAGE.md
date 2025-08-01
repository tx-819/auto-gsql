# 流式消息发送使用说明

## 概述

已成功将聊天功能从普通请求改为流式返回处理，支持实时显示AI回复内容。

## 主要改动

### 1. 服务层 (`src/renderer/src/services/chat.ts`)

- 添加了流式消息相关的类型定义：
  - `StreamChunk`: 流式消息块
  - `StreamResult`: 流式消息结果
  - `StreamMessageOptions`: 流式消息选项

- 新增 `sendMessageStream` 函数，支持：
  - Server-Sent Events (SSE) 流式处理
  - 实时内容累积
  - 错误处理
  - 完成回调

### 2. 状态管理 (`src/renderer/src/stores/chatStore.ts`)

- 在 `ChatState` 接口中添加 `sendMessageStream` 方法
- 实现流式消息发送逻辑：
  - 立即添加用户消息和临时AI消息
  - 实时更新AI消息内容
  - 处理新话题创建
  - 完成时更新最终消息ID

### 3. 页面组件 (`src/renderer/src/pages/chat/index.tsx`)

- 修改 `handleSendMessage` 函数使用流式发送
- 添加实时回调处理

## 使用方法

### 基本用法

```typescript
import { useChatStore } from '../stores'

const { sendMessageStream } = useChatStore()

const handleSend = async () => {
  await sendMessageStream(
    '你好，请介绍一下自己',
    (chunk) => {
      // 实时处理每个消息块
      console.log('收到内容:', chunk.content)
    },
    (result) => {
      // 消息发送完成
      console.log('完整内容:', result.fullContent)
    },
    (error) => {
      // 错误处理
      console.error('发送失败:', error)
    },
    topicId, // 可选，话题ID
    'openai' // 可选，AI提供商
  )
}
```

### 参数说明

- `content`: 要发送的消息内容
- `onChunk`: 每个消息块的回调函数
- `onComplete`: 消息发送完成的回调函数
- `onError`: 错误处理的回调函数
- `topicId`: 话题ID（可选，不传则创建新话题）
- `provider`: AI提供商（可选，默认为'openai'）

## 技术特点

1. **实时显示**: AI回复内容会实时显示，无需等待完整响应
2. **状态管理**: 自动管理消息状态，包括临时消息和最终消息
3. **错误处理**: 完善的错误处理机制
4. **话题管理**: 自动处理新话题创建和现有话题更新
5. **类型安全**: 完整的TypeScript类型定义

## 注意事项

1. 确保后端API支持 `/chat/send/stream` 端点
2. 后端需要返回符合SSE格式的数据流
3. 每个数据块应包含 `content`、`done`、`topicId`、`messageId`、`topicTitle` 等字段
4. 流式处理会自动累积内容，无需手动拼接
