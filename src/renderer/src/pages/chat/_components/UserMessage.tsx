import React from 'react'
import { Paper, Typography } from '@mui/material'

interface UserMessageProps {
  content: string
}

const UserMessage: React.FC<UserMessageProps> = ({ content }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        borderRadius: 2,
        px: 1.5,
        py: 1,
        maxWidth: { xs: '80vw', sm: 540 },
        minWidth: 0,
        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
        fontSize: '1rem',
        wordBreak: 'break-word',
        whiteSpace: 'pre-wrap'
      }}
    >
      <Typography variant="body1">{content}</Typography>
    </Paper>
  )
}

export default UserMessage
