import React from 'react'
import { Box, Paper, Typography, CircularProgress } from '@mui/material'

const LoadingMessage: React.FC = () => {
  return (
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
  )
}

export default LoadingMessage
