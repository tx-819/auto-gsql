import React from 'react'
import { Box, Typography } from '@mui/material'

interface AiMessageProps {
  content: string
}

const AiMessage: React.FC<AiMessageProps> = ({ content }) => {
  return (
    <Box
      sx={{
        bgcolor: '#ececf1',
        color: 'text.primary',
        borderRadius: 2,
        px: 1.5,
        py: 1,
        maxWidth: { xs: '80vw', sm: 540 },
        minWidth: 0,
        fontSize: '1rem',
        wordBreak: 'break-word',
        whiteSpace: 'pre-wrap'
      }}
    >
      <Typography variant="body1">{content}</Typography>
    </Box>
  )
}

export default AiMessage
