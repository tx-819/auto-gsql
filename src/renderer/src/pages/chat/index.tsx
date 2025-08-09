import React, { useState, useRef, useEffect } from 'react'
import { Box, Paper, TextField, IconButton } from '@mui/material'
import { Send as SendIcon } from '@mui/icons-material'
import {
  AiMessage,
  UserMessage,
  MessageContainer,
  LoadingMessage,
  DatabaseSelector,
  ModeSelector,
  ModelSelector
} from './_components'
import { useChatStore } from '../../stores'
import { type AIProvider } from '../../utils/modelConfig'
import { DbConnection } from '../../services/database'

type ChatMode = 'chat' | 'agent'

const ChatPage: React.FC = () => {
  const [inputValue, setInputValue] = useState('')
  const [chatMode, setChatMode] = useState<ChatMode>('chat')
  const [selectedDatabase, setSelectedDatabase] = useState<DbConnection | null>(null)
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>('deepseek')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { currentTopicId, loadMessages, messages, sendMessage, isLoading } = useChatStore()

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (currentTopicId) {
      loadMessages(currentTopicId)
    }
  }, [currentTopicId, loadMessages])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (): Promise<void> => {
    if (!inputValue.trim()) return
    // agent模式下必须选择数据库
    if (chatMode === 'agent' && !selectedDatabase) {
      return
    }

    // 使用流式发送消息
    const success = await sendMessage(
      inputValue,
      (chunk) => {
        // 实时更新消息内容，这里不需要额外处理，因为store已经处理了
        console.log('收到消息块:', chunk)
      },
      (result) => {
        // 消息发送完成
        console.log('消息发送完成:', result)
        setInputValue('')
      },
      (error) => {
        // 处理错误
        console.error('发送消息失败:', error)
      },
      currentTopicId as number,
      selectedProvider
    )

    if (!success) {
      console.error('发送消息失败')
    }
  }

  const canSendMessage = (): boolean => {
    if (!inputValue.trim()) return false
    if (chatMode === 'agent' && !selectedDatabase) return false
    return true
  }

  return (
    <Box
      sx={{
        height: '100vh',
        bgcolor: '#f7f7f8',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pt: '64px'
      }}
    >
      {/* 模式切换区域 */}
      <ModeSelector
        chatMode={chatMode}
        onModeChange={setChatMode}
        messagesLength={messages.length}
      />

      {/* 数据库选择区域 - 仅在agent模式下显示 */}
      {chatMode === 'agent' && (
        <DatabaseSelector
          selectedDatabase={selectedDatabase}
          messagesLength={messages.length}
          onDatabaseChange={(database: DbConnection) => {
            // 如果已经有聊天内容，不允许变更数据库
            if (messages.length > 0) {
              return
            }
            setSelectedDatabase(database)
          }}
        />
      )}

      {/* 消息列表区域 */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          width: '100%',
          mx: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
          py: 2,
          px: { xs: 0, sm: 2 },
          overflowY: 'auto',
          overflowX: 'hidden',
          scrollbarWidth: 'thin',
          scrollbarColor: '#bdbdbd #ececf1'
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 700, mx: 'auto' }}>
          {messages.map((message) => (
            <MessageContainer key={message.id} isUser={message.role === 'user'}>
              {message.role === 'user' ? (
                <UserMessage content={message.content} />
              ) : (
                <AiMessage content={message.content} />
              )}
            </MessageContainer>
          ))}
        </Box>

        {/* 加载状态 */}
        {isLoading && <LoadingMessage />}

        <div ref={messagesEndRef} />
      </Box>

      {/* 输入区域 */}
      <Box
        sx={{
          width: '100%',
          bgcolor: 'transparent',
          pb: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
          px: { xs: 0, sm: 2 }
        }}
      >
        <Paper
          elevation={3}
          sx={{
            px: 2,
            py: 1,
            mx: 1,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            borderRadius: 6,
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            maxWidth: 700,
            width: '100%'
          }}
        >
          <TextField
            multiline
            maxRows={4}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(event: React.KeyboardEvent) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault()
                handleSendMessage()
              }
            }}
            placeholder="输入消息... (按Enter发送，Shift+Enter换行)"
            variant="standard"
            fullWidth
            disabled={isLoading}
            sx={{
              '& .MuiInputBase-root': {
                fontSize: '1rem',
                bgcolor: 'transparent'
              },
              '& .MuiInput-underline:before, & .MuiInput-underline:after': {
                borderBottom: 'none'
              }
            }}
            slotProps={{
              input: {
                disableUnderline: true
              }
            }}
          />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%'
            }}
          >
            {/* 大模型选择器 */}
            <ModelSelector
              selectedProvider={selectedProvider}
              onProviderChange={(provider: AIProvider) => {
                // 如果已经有聊天内容，不允许变更模型
                if (messages.length > 0) {
                  return
                }
                setSelectedProvider(provider)
              }}
              messagesLength={messages.length}
            />

            <IconButton
              onClick={handleSendMessage}
              disabled={!canSendMessage() || isLoading}
              color="primary"
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}

export default ChatPage
