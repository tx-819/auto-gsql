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
  Switch,
  CircularProgress
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Save as SaveIcon,
  Wifi as TestConnectionIcon
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router'
import {
  testConnection,
  createConnection,
  DbConnection,
  updateConnection,
  saveConnection
} from '../../services/database'

const DatabaseConnection: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [showPassword, setShowPassword] = useState(false)

  // 检查是否为编辑模式
  const isEditMode = location.state?.editMode || false
  const editConnection = location.state?.connection || null

  const [config, setConfig] = useState<DbConnection>({
    id: editConnection?.id || 0,
    name: editConnection?.name || '',
    dbType: editConnection?.dbType || 'mysql',
    host: editConnection?.host || 'localhost',
    port: editConnection?.port || '3306',
    databaseName: editConnection?.databaseName || '',
    username: editConnection?.username || '',
    password: editConnection?.password || ''
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

  const handleConfigChange = (field: keyof DbConnection, value: string | boolean): void => {
    setConfig((prev) => ({
      ...prev,
      [field]: value
    }))

    // 当数据库类型改变时，自动设置默认端口
    if (field === 'dbType' && typeof value === 'string') {
      setConfig((prev) => ({
        ...prev,
        dbType: value,
        port: defaultPorts[value as keyof typeof defaultPorts] || ''
      }))
    }
  }

  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const [isTesting, setIsTesting] = useState(false)

  const handleTestConnection = async (): Promise<void> => {
    setIsTesting(true)
    setTestResult(null)

    try {
      const result = await testConnection(config)
      setTestResult(result)
    } catch (error) {
      setTestResult({
        success: false,
        message: error instanceof Error ? error.message : '测试连接失败'
      })
    } finally {
      setIsTesting(false)
    }
  }

  const handleSaveConnection = async (): Promise<void> => {
    try {
      const result = await createConnection(config)
      if (result.success) {
        if (isEditMode) {
          // 编辑模式保存后返回连接列表页
          updateConnection(config).then((response) => {
            if (response.code === 200) {
              navigate('/database-connections')
            } else {
              setTestResult({
                success: false,
                message: response.message
              })
            }
          })
        } else {
          // 新建模式保存后跳转到模型检测页
          saveConnection(config).then((response) => {
            if (response.code === 200) {
              navigate('/database-model-detection', {
                state: { connectionInfo: config }
              })
            } else {
              setTestResult({
                success: false,
                message: response.message
              })
            }
          })
        }
      } else {
        setTestResult(result)
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: error instanceof Error ? error.message : '保存连接失败'
      })
    }
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
          {isEditMode ? '编辑数据库连接' : '新建数据库连接'}
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
                value={config.dbType}
                label="数据库类型"
                onChange={(e) => handleConfigChange('dbType', e.target.value)}
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
              placeholder={defaultPorts[config.dbType as keyof typeof defaultPorts]}
              disabled={config.dbType === 'sqlite'}
            />

            <TextField
              sx={{ flex: 1 }}
              label="数据库名"
              value={config.databaseName}
              onChange={(e) => handleConfigChange('databaseName', e.target.value)}
              placeholder="数据库名称"
              disabled={config.dbType === 'sqlite'}
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
              disabled={config.dbType === 'sqlite'}
            />

            <TextField
              sx={{ flex: 1 }}
              label="密码"
              type={showPassword ? 'text' : 'password'}
              value={config.password}
              onChange={(e) => handleConfigChange('password', e.target.value)}
              placeholder="密码"
              disabled={config.dbType === 'sqlite'}
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
                  checked={config.dbType === 'sqlite'}
                  onChange={(e) => handleConfigChange('dbType', e.target.checked)}
                  disabled={config.dbType === 'sqlite'}
                />
              }
              label="使用SSL连接"
            />
          </Box>
        </Box>

        {/* 测试结果 */}
        {testResult && (
          <Alert
            severity={testResult.success ? 'success' : 'error'}
            sx={{ mt: 3 }}
            onClose={() => setTestResult(null)}
          >
            {testResult.message}
          </Alert>
        )}

        {/* 操作按钮 */}
        <Box sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            startIcon={isTesting ? <CircularProgress size={20} /> : <TestConnectionIcon />}
            onClick={handleTestConnection}
            disabled={!config.name || !config.host || isTesting}
          >
            {isTesting ? '测试中...' : '测试连接'}
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSaveConnection}
            disabled={!config.name || !config.host}
          >
            {isEditMode ? '更新连接' : '保存连接'}
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
