import React, { useState, useRef, useEffect } from 'react'
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Avatar,
  CircularProgress
} from '@mui/material'
import { Send as SendIcon, Person as UserIcon } from '@mui/icons-material'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([])
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
        bgcolor: '#f7f7f8',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pt: '64px'
      }}
    >
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
            <Box
              key={message.id}
              sx={{
                display: 'flex',
                justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                px: 1,
                py: 0.5
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: message.role === 'user' ? 'row-reverse' : 'row',
                  alignItems: 'flex-end',
                  gap: 1,
                  width: '100%',
                  maxWidth: '90%'
                }}
              >
                {message.role === 'user' && (
                  <Avatar
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      width: 36,
                      height: 36,
                      fontSize: 22,
                      boxShadow: 2
                    }}
                  >
                    <UserIcon />
                  </Avatar>
                )}
                {message.role === 'user' ? (
                  <Paper
                    elevation={0}
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      borderRadius: '18px 18px 4px 18px',
                      px: 2,
                      py: 1.5,
                      maxWidth: { xs: '80vw', sm: 540 },
                      minWidth: 0,
                      boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                      fontSize: '1.05rem',
                      wordBreak: 'break-word',
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    <Typography variant="body1" sx={{ fontSize: '1.05rem', mb: 0.5 }}>
                      {message.content}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        opacity: 0.5,
                        fontSize: '0.72rem',
                        display: 'block',
                        textAlign: 'right',
                        mt: 0.5
                      }}
                    >
                      {formatTime(message.timestamp)}
                    </Typography>
                  </Paper>
                ) : (
                  <Box
                    sx={{
                      bgcolor: '#ececf1',
                      color: 'text.primary',
                      borderRadius: 2,
                      px: 2,
                      py: 1.5,
                      maxWidth: { xs: '80vw', sm: 540 },
                      minWidth: 0,
                      fontSize: '1.05rem',
                      wordBreak: 'break-word',
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    <Typography variant="body1" sx={{ fontSize: '1.05rem', mb: 0.5 }}>
                      {message.content}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        opacity: 0.5,
                        fontSize: '0.72rem',
                        display: 'block',
                        textAlign: 'left',
                        mt: 0.5
                      }}
                    >
                      {formatTime(message.timestamp)}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          ))}
        </Box>

        {/* 加载状态 */}
        {isLoading && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: 1,
                width: '100%',
                maxWidth: 700,
                px: 1,
                py: 0.5
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  bgcolor: '#ececf1',
                  borderRadius: 2,
                  px: 2,
                  py: 1.5,
                  minWidth: 0,
                  boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
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
          width: '100%',
          bgcolor: 'transparent',
          pb: 2,
          display: 'flex',
          justifyContent: 'center',
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
            borderRadius: 6,
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            maxWidth: 700
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
          <IconButton
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            color="primary"
            sx={{
              alignSelf: 'flex-end'
            }}
          >
            <SendIcon />
          </IconButton>
        </Paper>
      </Box>
    </Box>
  )
}

export default ChatPage
