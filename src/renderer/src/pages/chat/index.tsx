import React, { useState, useRef, useEffect } from 'react'
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Avatar,
  Stack,
  Chip,
  CircularProgress
} from '@mui/material'
import { Send as SendIcon, SmartToy as BotIcon, Person as UserIcon } from '@mui/icons-material'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '你好！我是AI助手，有什么可以帮助你的吗？',
      role: 'assistant',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (): Promise<void> => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date()
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    // 模拟AI回复
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `我收到了你的消息："${userMessage.content}"。这是一个模拟的AI回复。`,
        role: 'assistant',
        timestamp: new Date()
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }, 1000)
  }

  const handleKeyPress = (event: React.KeyboardEvent): void => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
        paddingTop: '64px' // 为顶部栏预留空间
      }}
    >
      {/* 消息列表区域 */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          boxSizing: 'border-box'
        }}
      >
        {messages.map((message) => (
          <Box
            key={message.id}
            sx={{
              display: 'flex',
              justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
              mb: 2
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1,
                maxWidth: '70%',
                flexDirection: message.role === 'user' ? 'row-reverse' : 'row'
              }}
            >
              <Avatar
                sx={{
                  bgcolor: message.role === 'user' ? 'primary.main' : 'grey.500',
                  width: 32,
                  height: 32
                }}
              >
                {message.role === 'user' ? <UserIcon /> : <BotIcon />}
              </Avatar>

              <Paper
                elevation={1}
                sx={{
                  p: 1,
                  bgcolor: message.role === 'user' ? 'primary.main' : 'background.paper',
                  color: message.role === 'user' ? 'primary.contrastText' : 'text.primary',
                  borderRadius: 2,
                  maxWidth: '100%',
                  wordBreak: 'break-word'
                }}
              >
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {message.content}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    opacity: 0.7,
                    fontSize: '0.75rem'
                  }}
                >
                  {formatTime(message.timestamp)}
                </Typography>
              </Paper>
            </Box>
          </Box>
        ))}

        {/* 加载状态 */}
        {isLoading && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
              mb: 2
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1
              }}
            >
              <Avatar
                sx={{
                  bgcolor: 'grey.500',
                  width: 32,
                  height: 32
                }}
              >
                <BotIcon />
              </Avatar>
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <CircularProgress size={16} />
                <Typography variant="body2" color="text.secondary">
                  AI正在思考中...
                </Typography>
              </Paper>
            </Box>
          </Box>
        )}

        <div ref={messagesEndRef} />
      </Box>

      {/* 输入区域 */}
      <Box
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper'
        }}
      >
        <Paper
          elevation={2}
          sx={{
            p: 1,
            display: 'flex',
            alignItems: 'flex-end',
            gap: 1
          }}
        >
          <TextField
            multiline
            maxRows={4}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入消息... (按Enter发送，Shift+Enter换行)"
            variant="standard"
            fullWidth
            disabled={isLoading}
            sx={{
              '& .MuiInputBase-root': {
                fontSize: '1rem'
              }
            }}
          />
          <IconButton
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            color="primary"
            sx={{
              alignSelf: 'flex-end',
              mb: 0.5
            }}
          >
            <SendIcon />
          </IconButton>
        </Paper>

        {/* 快捷提示 */}
        <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
          <Chip
            label="帮我写代码"
            size="small"
            onClick={() => setInputValue('帮我写一个React组件')}
            sx={{ cursor: 'pointer' }}
          />
          <Chip
            label="解释概念"
            size="small"
            onClick={() => setInputValue('请解释一下什么是React Hooks')}
            sx={{ cursor: 'pointer' }}
          />
          <Chip
            label="代码优化"
            size="small"
            onClick={() => setInputValue('请帮我优化这段代码的性能')}
            sx={{ cursor: 'pointer' }}
          />
        </Stack>
      </Box>
    </Box>
  )
}

export default ChatPage
