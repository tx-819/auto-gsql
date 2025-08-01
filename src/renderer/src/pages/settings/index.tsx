import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardHeader,
  Alert,
  Snackbar,
  Switch,
  FormControlLabel,
  Stack
} from '@mui/material'
import { Save as SaveIcon, Key as KeyIcon } from '@mui/icons-material'
import { useChatStore } from '../../stores'

const Settings: React.FC = () => {
  const { aiConfigs, setAIConfig, getAIConfig } = useChatStore()
  const [showApiKey, setShowApiKey] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info'
  })

  useEffect(() => {
    // 从keytar加载设置
    const loadSettingsData = async (): Promise<void> => {
      await getAIConfig('openai')
      await getAIConfig('deepseek')
    }
    loadSettingsData()
  }, [getAIConfig, setAIConfig])

  const handleSave = async (): Promise<void> => {
    const success = await setAIConfig('openai', aiConfigs.openai!)
    const success2 = await setAIConfig('deepseek', aiConfigs.deepseek!)
    setSnackbar({
      open: true,
      message: success && success2 ? '设置已保存' : '保存失败',
      severity: success && success2 ? 'success' : 'error'
    })
  }

  const handleCloseSnackbar = (): void => {
    setSnackbar((prev) => ({ ...prev, open: false }))
  }

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto', height: '100vh', overflow: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        系统设置
      </Typography>
      <Stack spacing={3}>
        {/* API 配置 */}
        <Card>
          <CardHeader title="OpenAI API 配置" avatar={<KeyIcon color="primary" />} />
          <CardContent>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="API Key"
                type={showApiKey ? 'text' : 'password'}
                value={aiConfigs.openai?.apiKey}
                onChange={(e) =>
                  setAIConfig('openai', { ...aiConfigs.openai!, apiKey: e.target.value })
                }
                placeholder="sk-..."
                helperText="请输入您的OpenAI API Key"
              />
              <TextField
                fullWidth
                label="API Base URL"
                value={aiConfigs.openai?.baseURL}
                onChange={(e) =>
                  setAIConfig('openai', { ...aiConfigs.openai!, baseURL: e.target.value })
                }
                placeholder="https://api.openai.com/v1"
                helperText="OpenAI API的基础URL，如果使用代理请修改"
              />
            </Stack>
          </CardContent>
        </Card>
        <Card>
          <CardHeader title="DeepSeek API 配置" avatar={<KeyIcon color="primary" />} />
          <CardContent>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="API Key"
                type={showApiKey ? 'text' : 'password'}
                value={aiConfigs.deepseek?.apiKey}
                onChange={(e) =>
                  setAIConfig('deepseek', { ...aiConfigs.deepseek!, apiKey: e.target.value })
                }
                placeholder="sk-..."
                helperText="请输入您的DeepSeek API Key"
              />
              <TextField
                fullWidth
                label="API Base URL"
                value={aiConfigs.deepseek?.baseURL}
                onChange={(e) =>
                  setAIConfig('deepseek', { ...aiConfigs.deepseek!, baseURL: e.target.value })
                }
                placeholder="https://api.deepseek.com/v1"
                helperText="DeepSeek API的基础URL，如果使用代理请修改"
              />
            </Stack>
          </CardContent>
        </Card>

        {/* 保存按钮 */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <FormControlLabel
            control={
              <Switch checked={showApiKey} onChange={(e) => setShowApiKey(e.target.checked)} />
            }
            label="显示API Key"
          />
          <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave} size="large">
            保存设置
          </Button>
        </Box>
      </Stack>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default Settings
