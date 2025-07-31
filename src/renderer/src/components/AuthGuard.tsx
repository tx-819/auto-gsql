import React, { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router'
import { Box, CircularProgress } from '@mui/material'
import { useAuthStore } from '../stores'

interface AuthGuardProps {
  children: React.ReactNode
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const [loading, setLoading] = useState(true)
  const { isAuthenticated, checkAuth } = useAuthStore()
  const location = useLocation()

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      try {
        await checkAuth()
      } catch {
        setLoading(false)
      } finally {
        setLoading(false)
      }
    }
    initAuth()
  }, [checkAuth])

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

  if (!isAuthenticated) {
    // 保存当前路径，登录后可以重定向回来
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

export default AuthGuard
