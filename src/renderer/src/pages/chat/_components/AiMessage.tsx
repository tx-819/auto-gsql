import React from 'react'
import { Box } from '@mui/material'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

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
        width: '100%',
        fontSize: '1rem',
        wordBreak: 'break-word',
        whiteSpace: 'pre-wrap',
        '& pre': {
          backgroundColor: '#f6f8fa',
          borderRadius: 1,
          padding: 1,
          overflow: 'auto',
          margin: '8px 0'
        },
        '& code': {
          backgroundColor: '#f6f8fa',
          padding: '2px 4px',
          borderRadius: 1,
          fontSize: '0.9em'
        },
        '& p': {
          margin: '8px 0'
        },
        '& ul, & ol': {
          margin: '8px 0',
          paddingLeft: '20px'
        },
        '& li': {
          margin: '4px 0'
        },
        '& blockquote': {
          borderLeft: '4px solid #ddd',
          margin: '8px 0',
          paddingLeft: '16px',
          color: '#666'
        }
      }}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </Box>
  )
}

export default AiMessage
