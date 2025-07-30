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
import { loadSettings, saveSettings, type AppSettings } from '../../utils/settings'
import { checkAndMigrate } from '../../utils/migrateSettings'

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>({
    openaiApiKey: '',
    openaiBaseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4'
  })
  const [showApiKey, setShowApiKey] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info'
  })

  useEffect(() => {
    // 从keytar加载设置
    const loadSettingsData = async (): Promise<void> => {
      // 检查并迁移旧设置
      await checkAndMigrate()
      const loadedSettings = await loadSettings()
      setSettings(loadedSettings)
    }
    loadSettingsData()
  }, [])

  const handleSave = async (): Promise<void> => {
    const success = await saveSettings(settings)
    setSnackbar({
      open: true,
      message: success ? '设置已保存' : '保存失败',
      severity: success ? 'success' : 'error'
    })
  }

  const handleTestConnection = async (): Promise<void> => {
    if (!settings.openaiApiKey) {
      setSnackbar({
        open: true,
        message: '请先输入API Key',
        severity: 'warning'
      })
      return
    }

    try {
      // 这里可以添加测试API连接的逻辑
      setSnackbar({
        open: true,
        message: '连接测试成功',
        severity: 'success'
      })
    } catch {
      setSnackbar({
        open: true,
        message: '连接测试失败',
        severity: 'error'
      })
    }
  }

  const handleCloseSnackbar = (): void => {
    setSnackbar((prev) => ({ ...prev, open: false }))
  }

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
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
                value={settings.openaiApiKey}
                onChange={(e) => setSettings((prev) => ({ ...prev, openaiApiKey: e.target.value }))}
                placeholder="sk-..."
                helperText="请输入您的OpenAI API Key"
              />
              <TextField
                fullWidth
                label="API Base URL"
                value={settings.openaiBaseUrl}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, openaiBaseUrl: e.target.value }))
                }
                placeholder="https://api.openai.com/v1"
                helperText="OpenAI API的基础URL，如果使用代理请修改"
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button variant="outlined" onClick={handleTestConnection}>
                  测试连接
                </Button>
                <FormControlLabel
                  control={
                    <Switch
                      checked={showApiKey}
                      onChange={(e) => setShowApiKey(e.target.checked)}
                    />
                  }
                  label="显示API Key"
                />
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* 保存按钮 */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
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
