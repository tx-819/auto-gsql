import React from 'react'
import { Box, Typography, IconButton, Chip } from '@mui/material'
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material'

interface HeaderProps {
  connectionInfo: {
    name: string
    type: string
    host: string
  }
  onBack: () => void
}

const Header: React.FC<HeaderProps> = ({ connectionInfo, onBack }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', my: 3, flexShrink: 0 }}>
      <IconButton onClick={onBack} sx={{ mr: 2 }}>
        <ArrowBackIcon />
      </IconButton>
      <Typography variant="h5" component="h1">
        数据库模型生成
      </Typography>
      <Chip label={connectionInfo.name} color="primary" variant="outlined" sx={{ ml: 2 }} />
    </Box>
  )
}

export default Header
