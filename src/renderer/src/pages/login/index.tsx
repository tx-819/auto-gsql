import React, { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material'
import {
  Visibility,
  VisibilityOff,
  Person as PersonIcon,
  Lock as LockIcon
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router'
import { useAuthStore } from '../../stores/authStore'

interface LoginForm {
  username: string
  password: string
}

const Login: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState<LoginForm>({
    username: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoading, error, clearError } = useAuthStore()
  const [successMessage, setSuccessMessage] = useState('')

  // 检查是否有注册成功消息
  useEffect(() => {
    const state = location.state as { message?: string; username?: string } | null
    if (state?.message) {
      setSuccessMessage(state.message)
      if (state.username) {
        setForm((prev) => ({ ...prev, username: state.username || '' }))
      }
    }
  }, [location.state])

  const handleInputChange =
    (field: keyof LoginForm) =>
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
      if (error) clearError()
    }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    // 使用登录API
    const success = await login(form.username, form.password)
    if (success) {
      // 登录成功，跳转到主页面
      navigate('/')
    }
  }

  const handleTogglePassword = (): void => {
    setShowPassword(!showPassword)
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 2
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 400,
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 700,
                color: 'primary.main',
                mb: 1
              }}
            >
              Auto GSQL
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              请登录您的账户
            </Typography>
          </Box>

          {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successMessage}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="用户名"
              value={form.username}
              onChange={handleInputChange('username')}
              margin="normal"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                )
              }}
              disabled={isLoading}
            />

            <TextField
              fullWidth
              label="密码"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleInputChange('password')}
              margin="normal"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePassword} edge="end" disabled={isLoading}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              disabled={isLoading}
            />

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1.1rem'
              }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : '登录'}
            </Button>
          </form>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              还没有账户？{' '}
              <Button
                variant="text"
                size="small"
                onClick={() => navigate('/register')}
                sx={{ textTransform: 'none' }}
              >
                立即注册
              </Button>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default Login
