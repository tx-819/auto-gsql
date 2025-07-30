import React, { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router'
import { Box, CircularProgress } from '@mui/material'
import { validateToken } from '../services/auth'

interface AuthGuardProps {
  children: React.ReactNode
}

const isAuthenticated = async (): Promise<boolean> => {
  try {
    const token = await window.api.getAuthToken()
    if (!token) {
      return false
    }
    // 验证Token有效性
    return await validateToken()
  } catch (error) {
    console.error('Auth check failed:', error)
    return false
  }
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const checkAuth = async (): Promise<void> => {
      try {
        const isAuth = await isAuthenticated()
        setAuthenticated(isAuth)
      } catch (error) {
        console.error('Auth check failed:', error)
        setAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
      >
        <CircularProgress size={60} sx={{ color: 'white' }} />
      </Box>
    )
  }

  if (!authenticated) {
    // 保存当前路径，登录后可以重定向回来
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

export default AuthGuard
