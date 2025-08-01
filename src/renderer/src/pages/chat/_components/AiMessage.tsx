import React from 'react'
import { Box } from '@mui/material'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface AiMessageProps {
  content: string
}

const AiMessage: React.FC<AiMessageProps> = ({ content }) => {
  const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement>): void => {
    event.preventDefault()
    const url = event.currentTarget.href
    if (url) {
      window.api.openExternalLink(url)
    }
  }

  return (
    <Box
      sx={{
        bgcolor: '#f7f7f8',
        color: '#24292e',
        borderRadius: '12px',
        px: 2,
        py: 1.5,
        width: '100%',
        fontSize: '16px',
        lineHeight: 1.6,
        wordBreak: 'break-word',
        userSelect: 'text',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
        '& h1, & h2, & h3, & h4, & h5, & h6': {
          marginTop: '24px',
          marginBottom: '16px',
          fontWeight: 600,
          lineHeight: 1.25,
          '&:first-of-type': {
            marginTop: 0
          }
        },
        '& h1': {
          fontSize: '2em',
          borderBottom: '1px solid #eaecef',
          paddingBottom: '0.3em'
        },
        '& h2': {
          fontSize: '1.5em',
          borderBottom: '1px solid #eaecef',
          paddingBottom: '0.3em'
        },
        '& h3': {
          fontSize: '1.25em'
        },
        '& h4': {
          fontSize: '1em'
        },
        '& h5': {
          fontSize: '0.875em'
        },
        '& h6': {
          fontSize: '0.85em',
          color: '#6a737d'
        },
        '& p, & blockquote, & ul, & ol, & dl, & table, & pre': {
          marginTop: 0,
          marginBottom: '16px'
        },
        '& p': {
          lineHeight: 1.6
        },
        '& blockquote': {
          padding: '0 1em',
          color: '#6a737d',
          borderLeft: '0.25em solid #dfe2e5',
          margin: '0 0 16px 0'
        },
        '& ul, & ol': {
          paddingLeft: '2em'
        },
        '& li': {
          lineHeight: 1.6
        },
        '& li + li': {
          marginTop: '0.25em'
        },
        '& dl': {
          padding: 0
        },
        '& dl dt': {
          padding: 0,
          marginTop: '16px',
          fontSize: '1em',
          fontStyle: 'italic',
          fontWeight: 600
        },
        '& dl dd': {
          padding: '0 16px',
          marginBottom: '16px'
        },
        '& table': {
          borderSpacing: 0,
          borderCollapse: 'collapse',
          display: 'block',
          width: '100%',
          overflow: 'auto',
          fontSize: '14px'
        },
        '& table th': {
          fontWeight: 600,
          padding: '6px 13px',
          border: '1px solid #dfe2e5'
        },
        '& table td': {
          padding: '6px 13px',
          border: '1px solid #dfe2e5'
        },
        '& table tr': {
          backgroundColor: '#fff',
          borderTop: '1px solid #c6cbd1'
        },
        '& table tr:nth-child(2n)': {
          backgroundColor: '#f6f8fa'
        },
        '& pre': {
          wordWrap: 'normal',
          padding: '16px',
          overflow: 'auto',
          fontSize: '85%',
          lineHeight: 1.45,
          backgroundColor: '#f6f8fa',
          borderRadius: '6px',
          border: '1px solid #e1e4e8'
        },
        '& pre code': {
          display: 'inline',
          maxWidth: 'auto',
          padding: 0,
          margin: 0,
          overflow: 'visible',
          lineHeight: 'inherit',
          wordWrap: 'normal',
          backgroundColor: 'transparent',
          border: 0,
          fontSize: 'inherit'
        },
        '& code': {
          padding: '0.2em 0.4em',
          margin: 0,
          fontSize: '85%',
          backgroundColor: 'rgba(27,31,35,0.05)',
          borderRadius: '3px',
          fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace'
        },
        '& hr': {
          height: '0.25em',
          padding: 0,
          margin: '24px 0',
          backgroundColor: '#e1e4e8',
          border: 0
        },
        '& a': {
          color: '#0366d6',
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline'
          }
        },
        '& strong': {
          fontWeight: 600
        },
        '& em': {
          fontStyle: 'italic'
        },
        '& img': {
          maxWidth: '100%',
          boxSizing: 'content-box',
          backgroundColor: '#fff'
        },
        '& kbd': {
          display: 'inline-block',
          padding: '3px 5px',
          fontSize: '11px',
          lineHeight: '10px',
          color: '#444d56',
          verticalAlign: 'middle',
          backgroundColor: '#fafbfc',
          border: '1px solid #c6cbd1',
          borderBottomColor: '#959da5',
          borderRadius: '3px',
          boxShadow: 'inset 0 -1px 0 #959da5'
        }
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children, ...props }) => (
            <a href={href} onClick={handleLinkClick} {...props}>
              {children}
            </a>
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </Box>
  )
}

export default AiMessage
