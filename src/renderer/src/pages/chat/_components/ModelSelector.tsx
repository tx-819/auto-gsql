import React, { useState } from 'react'
import { Box, Menu, MenuItem, Chip } from '@mui/material'

type AIProvider = 'openai' | 'deepseek'

interface ModelSelectorProps {
  selectedProvider: AIProvider
  onProviderChange: (provider: AIProvider) => void
  messagesLength: number
}

const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedProvider,
  onProviderChange,
  messagesLength
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = (): void => {
    setAnchorEl(null)
  }

  const handleProviderSelect = (provider: AIProvider): void => {
    onProviderChange(provider)
    handleClose()
  }

  const getProviderDisplayName = (provider: AIProvider): string => {
    return provider === 'openai' ? 'OpenAI' : 'DeepSeek'
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <Chip
        label={getProviderDisplayName(selectedProvider)}
        size="small"
        onClick={handleClick}
        disabled={messagesLength > 0}
        color="primary"
      />
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            minWidth: 120
          }
        }}
      >
        <MenuItem
          onClick={() => handleProviderSelect('openai')}
          selected={selectedProvider === 'openai'}
          sx={{ fontSize: '0.8rem' }}
        >
          OpenAI
        </MenuItem>
        <MenuItem
          onClick={() => handleProviderSelect('deepseek')}
          selected={selectedProvider === 'deepseek'}
          sx={{ fontSize: '0.8rem' }}
        >
          DeepSeek
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default ModelSelector
