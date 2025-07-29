import React from 'react'
import { Box } from '@mui/material'

interface MessageContainerProps {
  children: React.ReactNode
  isUser: boolean
}

const MessageContainer: React.FC<MessageContainerProps> = ({ children, isUser }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        px: 1,
        py: 0.5
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: isUser ? 'row-reverse' : 'row',
          alignItems: 'flex-end',
          gap: 1,
          width: '100%',
          maxWidth: '90%'
        }}
      >
        {children}
      </Box>
    </Box>
  )
}

export default MessageContainer
