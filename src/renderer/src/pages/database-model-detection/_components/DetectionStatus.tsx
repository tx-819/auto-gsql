import React from 'react'
import { Paper, Box, Typography, CircularProgress } from '@mui/material'

interface DetectionStatusProps {
  isDetecting: boolean
}

const DetectionStatus: React.FC<DetectionStatusProps> = ({ isDetecting }) => {
  if (!isDetecting) return null

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <CircularProgress size={24} />
        <Typography variant="h6">AI正在检测数据库模型结构...</Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        正在分析表结构、字段类型、主键、外键等信息
      </Typography>
    </Paper>
  )
}

export default DetectionStatus
