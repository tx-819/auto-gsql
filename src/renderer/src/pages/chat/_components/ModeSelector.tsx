import React from 'react'
import { Box, Paper, ToggleButton, ToggleButtonGroup } from '@mui/material'
import { SmartToy as AgentIcon, Chat as ChatIcon } from '@mui/icons-material'

type ChatMode = 'chat' | 'agent'

interface ModeSelectorProps {
  chatMode: ChatMode
  onModeChange: (mode: ChatMode) => void
  messagesLength: number
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ chatMode, onModeChange, messagesLength }) => {
  const handleModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newMode: ChatMode | null
  ): void => {
    if (newMode !== null) {
      onModeChange(newMode)
    }
  }

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        py: 2,
        px: { xs: 1, sm: 2 }
      }}
    >
      <Paper
        elevation={1}
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}
      >
        <ToggleButtonGroup
          value={chatMode}
          exclusive
          onChange={handleModeChange}
          sx={{
            '& .MuiToggleButton-root': {
              px: 3,
              py: 1,
              border: 'none',
              borderRadius: 0,
              '&:first-of-type': {
                borderTopLeftRadius: 12,
                borderBottomLeftRadius: 12
              },
              '&:last-of-type': {
                borderTopRightRadius: 12,
                borderBottomRightRadius: 12
              },
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                '&:hover': {
                  bgcolor: 'primary.dark'
                }
              },
              '&:not(.Mui-selected)': {
                bgcolor: 'background.paper',
                color: 'text.secondary',
                '&:hover': {
                  bgcolor: 'action.hover'
                }
              },
              '&.Mui-disabled': {
                opacity: 0.5,
                cursor: 'not-allowed'
              }
            }
          }}
        >
          <ToggleButton value="chat" disabled={messagesLength > 0}>
            <ChatIcon sx={{ mr: 1, fontSize: 20 }} />
            <Box sx={{ fontWeight: 500 }}>Chat</Box>
          </ToggleButton>
          <ToggleButton value="agent" disabled={messagesLength > 0}>
            <AgentIcon sx={{ mr: 1, fontSize: 20 }} />
            <Box sx={{ fontWeight: 500 }}>Agent</Box>
          </ToggleButton>
        </ToggleButtonGroup>
      </Paper>
    </Box>
  )
}

export default ModeSelector
