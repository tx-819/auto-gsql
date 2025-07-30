import React, { useState } from 'react'
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
  IconButton,
  Link
} from '@mui/material'
import {
  Visibility,
  VisibilityOff,
  Person as PersonIcon,
  Lock as LockIcon,
  Email as EmailIcon
} from '@mui/icons-material'
import { useNavigate } from 'react-router'
import { registerUser } from '../../services/auth'

interface RegisterForm {
  username: string
  email: string
  password: string
  confirmPassword: string
}

// 注册
const register = async (credentials: {
  username: string
  email: string
  password: string
}): Promise<boolean> => {
  try {
    await registerUser(credentials)
    return true
  } catch (error) {
    console.error('Registration failed:', error)
    return false
  }
}

const Register: React.FC = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState<RegisterForm>({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange =
    (field: keyof RegisterForm) =>
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
      if (error) setError('')
    }

  const validateForm = (): string | null => {
    if (!form.username.trim()) {
      return '请输入用户名'
    }
    if (form.username.length < 3) {
      return '用户名至少需要3个字符'
    }
    if (!form.email.trim()) {
      return '请输入邮箱地址'
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      return '请输入有效的邮箱地址'
    }
    if (!form.password) {
      return '请输入密码'
    }
    if (form.password.length < 6) {
      return '密码至少需要6个字符'
    }
    if (form.password !== form.confirmPassword) {
      return '两次输入的密码不一致'
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    setError('')

    try {
      // 使用注册API
      const success = await register({
        username: form.username,
        email: form.email,
        password: form.password
      })
      if (success) {
        // 注册成功，跳转到登录页面
        navigate('/login', {
          state: {
            message: '注册成功！请使用新账户登录。',
            username: form.username
          }
        })
      } else {
        setError('用户名或邮箱已存在')
      }
    } catch {
      setError('注册失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleTogglePassword = (): void => {
    setShowPassword(!showPassword)
  }

  const handleToggleConfirmPassword = (): void => {
    setShowConfirmPassword(!showConfirmPassword)
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
          maxWidth: 450,
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
              创建您的账户
            </Typography>
          </Box>

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
              disabled={loading}
              helperText="至少3个字符"
            />

            <TextField
              fullWidth
              label="邮箱地址"
              type="email"
              value={form.email}
              onChange={handleInputChange('email')}
              margin="normal"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                )
              }}
              disabled={loading}
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
                    <IconButton onClick={handleTogglePassword} edge="end" disabled={loading}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              disabled={loading}
              helperText="至少6个字符"
            />

            <TextField
              fullWidth
              label="确认密码"
              type={showConfirmPassword ? 'text' : 'password'}
              value={form.confirmPassword}
              onChange={handleInputChange('confirmPassword')}
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
                    <IconButton onClick={handleToggleConfirmPassword} edge="end" disabled={loading}>
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              disabled={loading}
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
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1.1rem'
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : '注册'}
            </Button>
          </form>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              已有账户？{' '}
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/login')}
                sx={{ textTransform: 'none' }}
              >
                立即登录
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default Register
