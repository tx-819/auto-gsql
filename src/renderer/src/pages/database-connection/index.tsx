import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Alert,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Switch
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Save as SaveIcon,
  Wifi as TestConnectionIcon
} from '@mui/icons-material'
import { useNavigate } from 'react-router'

interface DatabaseConfig {
  name: string
  type: string
  host: string
  port: string
  database: string
  username: string
  password: string
  useSSL: boolean
  timeout: string
}

const DatabaseConnection: React.FC = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [config, setConfig] = useState<DatabaseConfig>({
    name: '',
    type: 'mysql',
    host: 'localhost',
    port: '3306',
    database: '',
    username: '',
    password: '',
    useSSL: false,
    timeout: '30'
  })

  const databaseTypes = [
    { value: 'mysql', label: 'MySQL' },
    { value: 'postgresql', label: 'PostgreSQL' },
    { value: 'sqlserver', label: 'SQL Server' },
    { value: 'oracle', label: 'Oracle' },
    { value: 'sqlite', label: 'SQLite' }
  ]

  const defaultPorts = {
    mysql: '3306',
    postgresql: '5432',
    sqlserver: '1433',
    oracle: '1521',
    sqlite: ''
  }

  const handleConfigChange = (field: keyof DatabaseConfig, value: string | boolean): void => {
    setConfig((prev) => ({
      ...prev,
      [field]: value
    }))

    // 当数据库类型改变时，自动设置默认端口
    if (field === 'type' && typeof value === 'string') {
      setConfig((prev) => ({
        ...prev,
        type: value,
        port: defaultPorts[value as keyof typeof defaultPorts] || ''
      }))
    }
  }

  const handleTestConnection = (): void => {
    // TODO: 实现测试连接逻辑
    console.log('Testing connection with config:', config)
  }

  const handleSaveConnection = (): void => {
    // TODO: 实现保存连接逻辑
    console.log('Saving connection config:', config)
    navigate('/database-model-detection', {
      state: { connectionInfo: config }
    })
  }

  const handleBack = (): void => {
    navigate('/')
  }

  return (
    <Box
      sx={{
        height: '100vh',
        overflowY: 'auto',
        px: 3,
        mx: 'auto',
        pt: '64px',
        pb: 3,
        boxSizing: 'border-box',
        scrollbarWidth: 'thin',
        scrollbarColor: '#bdbdbd #ececf1'
      }}
    >
      {/* 头部 */}
      <Box sx={{ display: 'flex', alignItems: 'center', my: 3, flexShrink: 0 }}>
        <IconButton onClick={handleBack} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" component="h1">
          新建数据库连接
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          连接配置
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* 连接名称 */}
          <TextField
            fullWidth
            label="连接名称"
            value={config.name}
            onChange={(e) => handleConfigChange('name', e.target.value)}
            placeholder="例如：生产环境MySQL"
            helperText="为这个数据库连接起一个便于识别的名称"
          />

          {/* 数据库类型和主机地址 */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl sx={{ flex: 1 }}>
              <InputLabel>数据库类型</InputLabel>
              <Select
                value={config.type}
                label="数据库类型"
                onChange={(e) => handleConfigChange('type', e.target.value)}
              >
                {databaseTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              sx={{ flex: 1 }}
              label="主机地址"
              value={config.host}
              onChange={(e) => handleConfigChange('host', e.target.value)}
              placeholder="localhost"
            />
          </Box>

          {/* 端口和数据库名 */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              sx={{ flex: 1 }}
              label="端口"
              value={config.port}
              onChange={(e) => handleConfigChange('port', e.target.value)}
              placeholder={defaultPorts[config.type as keyof typeof defaultPorts]}
              disabled={config.type === 'sqlite'}
            />

            <TextField
              sx={{ flex: 1 }}
              label="数据库名"
              value={config.database}
              onChange={(e) => handleConfigChange('database', e.target.value)}
              placeholder="数据库名称"
              disabled={config.type === 'sqlite'}
            />
          </Box>

          {/* 用户名和密码 */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              sx={{ flex: 1 }}
              label="用户名"
              value={config.username}
              onChange={(e) => handleConfigChange('username', e.target.value)}
              placeholder="用户名"
              disabled={config.type === 'sqlite'}
            />

            <TextField
              sx={{ flex: 1 }}
              label="密码"
              type={showPassword ? 'text' : 'password'}
              value={config.password}
              onChange={(e) => handleConfigChange('password', e.target.value)}
              placeholder="密码"
              disabled={config.type === 'sqlite'}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  )
                }
              }}
            />
          </Box>

          {/* 高级选项 */}
          <Divider sx={{ my: 2 }}>
            <Typography variant="body2" color="text.secondary">
              高级选项
            </Typography>
          </Divider>

          {/* SSL连接和连接超时 */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={config.useSSL}
                  onChange={(e) => handleConfigChange('useSSL', e.target.checked)}
                  disabled={config.type === 'sqlite'}
                />
              }
              label="使用SSL连接"
            />

            <TextField
              sx={{ flex: 1, maxWidth: 200 }}
              label="连接超时（秒）"
              type="number"
              value={config.timeout}
              onChange={(e) => handleConfigChange('timeout', e.target.value)}
              slotProps={{
                input: {
                  inputProps: {
                    min: 1,
                    max: 300
                  }
                }
              }}
            />
          </Box>
        </Box>

        {/* 操作按钮 */}
        <Box sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            startIcon={<TestConnectionIcon />}
            onClick={handleTestConnection}
            disabled={!config.name || !config.host}
          >
            测试连接
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSaveConnection}
            disabled={!config.name || !config.host}
          >
            保存连接
          </Button>
        </Box>

        {/* 提示信息 */}
        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="body2">
            <strong>提示：</strong>
            <br />
            • 连接名称用于在应用中识别不同的数据库连接
            <br />
            • 建议使用有意义的名称，如&ldquo;生产环境MySQL&rdquo;、&ldquo;测试数据库&rdquo;等
            <br />• 保存前建议先测试连接以确保配置正确
          </Typography>
        </Alert>
      </Paper>
    </Box>
  )
}

export default DatabaseConnection
