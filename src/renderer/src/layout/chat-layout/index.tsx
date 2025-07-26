import React, { useState } from 'react'
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Button,
  Divider,
  Avatar,
  Chip
} from '@mui/material'
import {
  Menu as MenuIcon,
  Add as AddIcon,
  Chat as ChatIcon,
  Person as PersonIcon,
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material'
import { Outlet } from 'react-router'

const drawerWidth = 280

const Layout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [selectedChat, setSelectedChat] = useState<string | null>(null)

  const handleDrawerToggle = (): void => {
    setMobileOpen(!mobileOpen)
  }

  // 模拟对话历史数据
  const chatHistory = [
    { id: '1', title: '如何学习React', date: '2024-01-15', type: 'chat' },
    { id: '2', title: 'TypeScript最佳实践', date: '2024-01-14', type: 'chat' },
    { id: '3', title: 'Material-UI组件使用', date: '2024-01-13', type: 'chat' },
    { id: '4', title: 'Electron应用开发', date: '2024-01-12', type: 'chat' },
    { id: '5', title: '前端性能优化', date: '2024-01-11', type: 'chat' }
  ]

  const handleChatSelect = (chatId: string): void => {
    setSelectedChat(chatId)
  }

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 新建对话按钮 */}
      <Box sx={{ p: 2 }}>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          fullWidth
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '14px',
            py: 1.5,
            borderColor: 'rgba(255,255,255,0.2)',
            color: 'text.primary',
            '&:hover': {
              borderColor: 'rgba(255,255,255,0.3)',
              backgroundColor: 'rgba(255,255,255,0.05)'
            }
          }}
        >
          新建对话
        </Button>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

      {/* 对话历史列表 */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List sx={{ py: 0 }}>
          {chatHistory.map((chat) => (
            <ListItem
              key={chat.id}
              disablePadding
              sx={{
                '&:hover .chat-actions': {
                  opacity: 1
                }
              }}
            >
              <ListItemButton
                selected={selectedChat === chat.id}
                onClick={() => handleChatSelect(chat.id)}
                sx={{
                  borderRadius: 1,
                  mx: 1,
                  mb: 0.5,
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.15)'
                    }
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.05)'
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <ChatIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: '14px',
                        fontWeight: selectedChat === chat.id ? 500 : 400,
                        color: selectedChat === chat.id ? 'text.primary' : 'text.secondary',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {chat.title}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: '12px',
                        color: 'text.disabled'
                      }}
                    >
                      {chat.date}
                    </Typography>
                  }
                />
                <Box
                  className="chat-actions"
                  sx={{
                    opacity: 0,
                    transition: 'opacity 0.2s',
                    display: 'flex',
                    gap: 0.5
                  }}
                >
                  <IconButton size="small" sx={{ color: 'text.secondary' }}>
                    <EditIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                  <IconButton size="small" sx={{ color: 'text.secondary' }}>
                    <DeleteIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

      {/* 底部用户信息和设置 */}
      <Box sx={{ p: 2 }}>
        <ListItemButton
          sx={{
            borderRadius: 2,
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.05)'
            }
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
              <PersonIcon sx={{ fontSize: 18 }} />
            </Avatar>
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography variant="body2" sx={{ fontSize: '14px', fontWeight: 500 }}>
                用户
              </Typography>
            }
            secondary={
              <Typography variant="caption" sx={{ fontSize: '12px', color: 'text.disabled' }}>
                免费用户
              </Typography>
            }
          />
          <IconButton size="small" sx={{ color: 'text.secondary' }}>
            <MoreVertIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </ListItemButton>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: 'background.paper',
          color: 'text.primary',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Auto GSQL
          </Typography>
          <Chip
            label="GPT-4"
            size="small"
            sx={{
              backgroundColor: 'primary.main',
              color: 'white',
              fontSize: '12px',
              height: 24
            }}
          />
        </Toolbar>
      </AppBar>
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: 'background.default',
              borderRight: '1px solid rgba(255,255,255,0.1)'
            }
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: 'background.default',
              borderRight: '1px solid rgba(255,255,255,0.1)'
            }
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: 'background.default'
        }}
      >
        <Outlet />
      </Box>
    </Box>
  )
}

export default Layout
