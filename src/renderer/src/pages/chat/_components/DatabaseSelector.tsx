import React, { useEffect, useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Alert,
  Chip,
  Button,
  CircularProgress
} from '@mui/material'
import {
  Storage as DatabaseIcon,
  Settings as SettingsIcon,
  ManageAccounts as ManageIcon,
  Power as ConnectIcon
} from '@mui/icons-material'
import { useNavigate } from 'react-router'
import {
  DbConnection,
  getConnectionList,
  getConnectionStatus,
  createConnection
} from '../../../services/database'

interface DatabaseSelectorProps {
  selectedDatabase: DbConnection | null
  messagesLength: number
  onDatabaseChange: (database: DbConnection) => void
}

const DatabaseSelector: React.FC<DatabaseSelectorProps> = ({
  selectedDatabase,
  messagesLength,
  onDatabaseChange
}) => {
  const navigate = useNavigate()
  const [databaseConnections, setDatabaseConnections] = useState<DbConnection[]>([])
  const [connectionStatus, setConnectionStatus] = useState<boolean>(false)
  const [isConnecting, setIsConnecting] = useState<boolean>(false)
  const [checkingStatus, setCheckingStatus] = useState<boolean>(false)

  useEffect(() => {
    getConnectionList().then((res) => {
      setDatabaseConnections(res.data)
    })
  }, [])

  // 检查连接状态
  useEffect(() => {
    if (selectedDatabase) {
      setCheckingStatus(true)
      getConnectionStatus(selectedDatabase.name)
        .then((status) => {
          setConnectionStatus(status)
        })
        .catch(() => {
          setConnectionStatus(false)
        })
        .finally(() => {
          setCheckingStatus(false)
        })
    } else {
      setConnectionStatus(false)
    }
  }, [selectedDatabase])

  // 连接数据库
  const handleConnect = async (): Promise<void> => {
    if (!selectedDatabase) return

    setIsConnecting(true)
    try {
      const result = await createConnection(selectedDatabase)
      if (result.success) {
        setConnectionStatus(true)
      } else {
        console.error('连接失败:', result.message)
      }
    } catch (error) {
      console.error('连接错误:', error)
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        pb: 1,
        px: { xs: 1, sm: 2 }
      }}
    >
      <Paper
        elevation={1}
        sx={{
          borderRadius: 2,
          p: 1.5,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          maxWidth: 700,
          width: '100%'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0, flex: 1 }}>
            <DatabaseIcon sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
              数据库:
            </Typography>
          </Box>

          <FormControl size="small" disabled={messagesLength > 0} sx={{ minWidth: 200, flex: 1 }}>
            <Select
              value={selectedDatabase?.id || ''}
              onChange={(e) => {
                const selectedDb = databaseConnections.find((db) => db.id === e.target.value)
                if (selectedDb) {
                  onDatabaseChange(selectedDb)
                }
              }}
              displayEmpty
              sx={{
                '& .MuiSelect-select': {
                  py: 0.5,
                  px: 1
                }
              }}
              startAdornment={
                selectedDatabase && (
                  <Chip
                    label={selectedDatabase.dbType.toUpperCase()}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ mr: 1, height: 20, fontSize: '0.7rem' }}
                  />
                )
              }
              renderValue={(value) => {
                if (!value) {
                  return (
                    <Typography variant="body2" color="text.secondary">
                      选择数据库连接
                    </Typography>
                  )
                }
                const selectedDb = databaseConnections.find((db) => db.id === value)
                return selectedDb ? (
                  <Typography variant="body2" color="text.primary">
                    {selectedDb.name}
                  </Typography>
                ) : (
                  ''
                )
              }}
            >
              <MenuItem value="" disabled>
                <Typography variant="body2" color="text.secondary">
                  选择数据库连接
                </Typography>
              </MenuItem>
              {databaseConnections.map((db) => (
                <MenuItem key={db.id} value={db.id}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      minWidth: 0
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                      {db.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontSize: '0.75rem' }}
                    >
                      {db.host} / {db.databaseName}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedDatabase && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {checkingStatus ? (
                <Chip
                  label="检查中..."
                  color="default"
                  variant="outlined"
                  size="small"
                  icon={<CircularProgress size={12} />}
                  sx={{ height: 28, fontSize: '0.75rem' }}
                />
              ) : (
                <Chip
                  label={connectionStatus ? '已连接' : '未连接'}
                  color={connectionStatus ? 'success' : 'error'}
                  variant="outlined"
                  size="small"
                  sx={{ height: 28, fontSize: '0.75rem' }}
                />
              )}

              {!connectionStatus && !checkingStatus && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={isConnecting ? <CircularProgress size={12} /> : <ConnectIcon />}
                  onClick={handleConnect}
                  disabled={isConnecting || messagesLength > 0}
                  sx={{
                    height: 28,
                    fontSize: '0.75rem',
                    px: 1.5,
                    minWidth: 'auto',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {isConnecting ? '连接中...' : '连接'}
                </Button>
              )}
            </Box>
          )}

          <Button
            variant="outlined"
            size="small"
            startIcon={<ManageIcon />}
            onClick={() => navigate('/database-connections')}
            sx={{
              height: 28,
              fontSize: '0.75rem',
              px: 1.5,
              minWidth: 'auto',
              whiteSpace: 'nowrap'
            }}
          >
            管理连接
          </Button>

          {selectedDatabase && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<SettingsIcon />}
              onClick={() => {
                const selectedDb = databaseConnections.find((db) => db.id === selectedDatabase?.id)
                if (selectedDb) {
                  navigate('/database-model-detection', {
                    state: {
                      connectionInfo: selectedDb,
                      fromChat: true
                    }
                  })
                }
              }}
              sx={{
                height: 28,
                fontSize: '0.75rem',
                px: 1.5,
                minWidth: 'auto',
                whiteSpace: 'nowrap'
              }}
            >
              模型关系
            </Button>
          )}
        </Box>

        {messagesLength > 0 && (
          <Alert severity="info" sx={{ mt: 1, py: 0.5, fontSize: '0.75rem' }}>
            聊天已开始，无法更改数据库连接
          </Alert>
        )}
      </Paper>
    </Box>
  )
}

export default DatabaseSelector
