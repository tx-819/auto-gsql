import React, { useState, useRef, useEffect } from 'react'
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  Select,
  MenuItem,
  Alert,
  Chip
} from '@mui/material'
import {
  Send as SendIcon,
  SmartToy as AgentIcon,
  Chat as ChatIcon,
  Storage as DatabaseIcon
} from '@mui/icons-material'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

type ChatMode = 'chat' | 'agent'

interface DatabaseConnection {
  id: string
  name: string
  type: string
  host: string
  database: string
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [chatMode, setChatMode] = useState<ChatMode>('chat')
  const [selectedDatabase, setSelectedDatabase] = useState<string>('')
  const [databaseConnections] = useState<DatabaseConnection[]>([
    {
      id: '1',
      name: '用户管理系统',
      type: 'mysql',
      host: 'localhost',
      database: 'user_management'
    },
    {
      id: '2',
      name: '订单数据库',
      type: 'postgresql',
      host: 'localhost',
      database: 'order_system'
    },
    { id: '3', name: '产品目录', type: 'mysql', host: 'localhost', database: 'product_catalog' }
  ])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newMode: ChatMode | null
  ): void => {
    if (newMode !== null) {
      setChatMode(newMode)
    }
  }

  const handleDatabaseChange = (databaseId: string): void => {
    // 如果已经有聊天内容，不允许变更数据库
    if (messages.length > 0) {
      return
    }
    setSelectedDatabase(databaseId)
  }

  const handleSendMessage = async (): Promise<void> => {
    if (!inputValue.trim()) return

    // agent模式下必须选择数据库
    if (chatMode === 'agent' && !selectedDatabase) {
      return
    }

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
      const selectedDb = databaseConnections.find((db) => db.id === selectedDatabase)
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `我收到了你的消息："${userMessage.content}"。这是一个模拟的AI回复。当前模式：${chatMode === 'chat' ? '聊天模式' : `智能代理模式 (数据库: ${selectedDb?.name || '未选择'})`}`,
        role: 'assistant',
        timestamp: new Date()
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }, 1000)
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
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          py: 2,
          px: { xs: 1, sm: 2 }
        }}
      >
        <Paper
          elevation={1}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}
        >
          <ToggleButtonGroup
            value={chatMode}
            exclusive
            onChange={handleModeChange}
            sx={{
              '& .MuiToggleButton-root': {
                px: 3,
                py: 1,
                border: 'none',
                borderRadius: 0,
                '&:first-of-type': {
                  borderTopLeftRadius: 12,
                  borderBottomLeftRadius: 12
                },
                '&:last-of-type': {
                  borderTopRightRadius: 12,
                  borderBottomRightRadius: 12
                },
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    bgcolor: 'primary.dark'
                  }
                },
                '&:not(.Mui-selected)': {
                  bgcolor: 'background.paper',
                  color: 'text.secondary',
                  '&:hover': {
                    bgcolor: 'action.hover'
                  }
                },
                '&.Mui-disabled': {
                  opacity: 0.5,
                  cursor: 'not-allowed'
                }
              }
            }}
          >
            <ToggleButton value="chat">
              <ChatIcon sx={{ mr: 1, fontSize: 20 }} />
              <Box sx={{ fontWeight: 500 }}>Chat</Box>
            </ToggleButton>
            <ToggleButton value="agent">
              <AgentIcon sx={{ mr: 1, fontSize: 20 }} />
              <Box sx={{ fontWeight: 500 }}>Agent</Box>
            </ToggleButton>
          </ToggleButtonGroup>
        </Paper>
      </Box>

      {/* 数据库选择区域 - 仅在agent模式下显示 */}
      {chatMode === 'agent' && (
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            pb: 1,
            px: { xs: 1, sm: 2 }
          }}
        >
          <Paper
            elevation={1}
            sx={{
              borderRadius: 2,
              p: 1.5,
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              maxWidth: 700,
              width: '100%'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0, flex: 1 }}>
                <DatabaseIcon sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />
                <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                  数据库:
                </Typography>
              </Box>

              <FormControl
                size="small"
                disabled={messages.length > 0}
                sx={{ minWidth: 200, flex: 1 }}
              >
                <Select
                  value={selectedDatabase}
                  onChange={(e) => handleDatabaseChange(e.target.value)}
                  displayEmpty
                  sx={{
                    '& .MuiSelect-select': {
                      py: 0.5,
                      px: 1
                    }
                  }}
                  startAdornment={
                    selectedDatabase && (
                      <Chip
                        label={databaseConnections
                          .find((db) => db.id === selectedDatabase)
                          ?.type.toUpperCase()}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ mr: 1, height: 20, fontSize: '0.7rem' }}
                      />
                    )
                  }
                >
                  <MenuItem value="" disabled>
                    <Typography variant="body2" color="text.secondary">
                      选择数据库连接
                    </Typography>
                  </MenuItem>
                  {databaseConnections.map((db) => (
                    <MenuItem key={db.id} value={db.id}>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          minWidth: 0
                        }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                          {db.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontSize: '0.75rem' }}
                        >
                          {db.host} / {db.database}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {selectedDatabase && (
                <Chip
                  label="已连接"
                  color="success"
                  variant="outlined"
                  size="small"
                  sx={{ height: 28, fontSize: '0.75rem' }}
                />
              )}
            </Box>

            {messages.length > 0 && (
              <Alert severity="info" sx={{ mt: 1, py: 0.5, fontSize: '0.75rem' }}>
                聊天已开始，无法更改数据库连接
              </Alert>
            )}
          </Paper>
        </Box>
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
                {message.role === 'user' ? (
                  <Paper
                    elevation={0}
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      borderRadius: 2,
                      px: 1.5,
                      py: 1,
                      maxWidth: { xs: '80vw', sm: 540 },
                      minWidth: 0,
                      boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                      fontSize: '1rem',
                      wordBreak: 'break-word',
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    <Typography variant="body1">{message.content}</Typography>
                  </Paper>
                ) : (
                  <Box
                    sx={{
                      bgcolor: '#ececf1',
                      color: 'text.primary',
                      borderRadius: 2,
                      px: 1.5,
                      py: 1,
                      maxWidth: { xs: '80vw', sm: 540 },
                      minWidth: 0,
                      fontSize: '1rem',
                      wordBreak: 'break-word',
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    <Typography variant="body1">{message.content}</Typography>
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
            disabled={!canSendMessage() || isLoading}
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
