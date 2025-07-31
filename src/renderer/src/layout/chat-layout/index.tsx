import React, { useEffect, useState } from 'react'
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
  Chip,
  ButtonProps
} from '@mui/material'
import {
  Menu as MenuIcon,
  Add as AddIcon,
  Person as PersonIcon,
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
  Storage as StorageIcon,
  Settings as SettingsIcon
} from '@mui/icons-material'
import { Outlet, useNavigate } from 'react-router'
import { styled } from '@mui/material/styles'
import { grey } from '@mui/material/colors'
import { useAuthStore, useChatStore } from '../../stores'

const drawerWidth = 280

const Layout: React.FC = () => {
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [selectedChat, setSelectedChat] = useState<number | null>(null)
  const { topics, loadTopics, deleteMessages, currentTopicId } = useChatStore()
  const { user } = useAuthStore()

  useEffect(() => {
    loadTopics()
  }, [loadTopics])

  const handleDrawerToggle = (): void => {
    setMobileOpen(!mobileOpen)
  }

  const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
    color: theme.palette.getContrastText(grey[50]),
    backgroundColor: grey[50],
    '&:hover': {
      backgroundColor: grey[200]
    },
    border: 'none'
  }))

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2 }}>
        <ColorButton
          variant="outlined"
          startIcon={<AddIcon />}
          fullWidth
          sx={{
            borderRadius: 2,
            mb: 1
          }}
          onClick={() => {
            if (currentTopicId) {
              deleteMessages(currentTopicId)
            }
            navigate('/')
          }}
        >
          新建对话
        </ColorButton>
        <ColorButton
          variant="outlined"
          startIcon={<StorageIcon />}
          fullWidth
          sx={{
            borderRadius: 2
          }}
          onClick={() => navigate('/database-connection')}
        >
          新建数据库连接
        </ColorButton>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

      {/* 对话历史列表 */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List sx={{ py: 0 }}>
          {topics.map((topic) => (
            <ListItem
              key={topic.id}
              disablePadding
              sx={{
                '&:hover .chat-actions': {
                  opacity: 1
                }
              }}
            >
              <ListItemButton
                selected={selectedChat === topic.id}
                onClick={() => {
                  setSelectedChat(topic.id)
                  navigate(`/chat/${topic.id}`)
                }}
                sx={{
                  borderRadius: 1,
                  mx: 1,
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
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: '14px',
                        fontWeight: selectedChat === topic.id ? 500 : 400,
                        color: selectedChat === topic.id ? 'text.primary' : 'text.secondary',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {topic.title}
                    </Typography>
                  }
                />
                <Box
                  className="chat-actions"
                  sx={{
                    opacity: 0,
                    transition: 'opacity 0.2s',
                    display: 'flex'
                  }}
                >
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
                {user?.username}
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
              height: 24,
              mr: 1
            }}
          />
          <IconButton
            color="inherit"
            aria-label="settings"
            onClick={() => navigate('/settings')}
            sx={{ color: 'text.secondary' }}
          >
            <SettingsIcon />
          </IconButton>
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
