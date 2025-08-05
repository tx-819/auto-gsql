import React, { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Dataset as DatabaseIcon
} from '@mui/icons-material'
import { useNavigate } from 'react-router'
import {
  closeConnection,
  DbConnection,
  getConnectionList,
  getConnectionStatus,
  deleteConnection
} from '../../services/database'

const DatabaseConnections: React.FC = () => {
  const navigate = useNavigate()
  const [connections, setConnections] = useState<DbConnection[]>([])
  const [connectionStatuses, setConnectionStatuses] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    connection: DbConnection | null
  }>({
    open: false,
    connection: null
  })

  useEffect(() => {
    loadConnections()
  }, [])

  const loadConnections = async (): Promise<void> => {
    try {
      setLoading(true)
      setError(null)

      const response = await getConnectionList()
      if (response.code === 200) {
        setConnections(response.data)
        // 获取所有连接的状态
        await loadConnectionStatuses(response.data)
      } else {
        setError(response.message)
      }
    } catch (err) {
      setError('加载连接列表失败')
      console.error('加载连接列表失败:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadConnectionStatuses = async (connectionList: DbConnection[]): Promise<void> => {
    const statuses: Record<string, boolean> = {}
    for (const connection of connectionList) {
      try {
        statuses[connection.name] = await getConnectionStatus(connection.name)
      } catch (error) {
        console.error(`获取连接 ${connection.name} 状态失败:`, error)
        statuses[connection.name] = false
      }
    }
    setConnectionStatuses(statuses)
  }

  const handleAddConnection = (): void => {
    navigate('/database-connection')
  }

  const handleEditConnection = (connection: DbConnection): void => {
    navigate('/database-connection', {
      state: {
        editMode: true,
        connection: {
          id: connection.id,
          name: connection.name,
          dbType: connection.dbType,
          host: connection.host,
          port: connection.port,
          databaseName: connection.databaseName,
          username: connection.username,
          password: connection.password
        }
      }
    })
  }

  const handleDeleteConnection = (connection: DbConnection): void => {
    setDeleteDialog({ open: true, connection })
  }

  const confirmDelete = async (): Promise<void> => {
    if (!deleteDialog.connection) return

    try {
      // 这里调用删除连接的API
      await closeConnection(deleteDialog.connection.name)
      await deleteConnection(deleteDialog.connection.id)
      setDeleteDialog({ open: false, connection: null })
      await loadConnections()
    } catch (err) {
      setError('删除连接失败')
      console.error('删除连接失败:', err)
    }
  }

  const getDatabaseTypeLabel = (type: string): string => {
    const typeMap: Record<string, string> = {
      mysql: 'MySQL',
      postgresql: 'PostgreSQL',
      sqlserver: 'SQL Server',
      oracle: 'Oracle',
      sqlite: 'SQLite'
    }
    return typeMap[type] || type
  }

  const handleBack = (): void => {
    navigate('/')
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={handleBack} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          数据库连接管理
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" component="h2">
            连接列表
          </Typography>

          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddConnection}>
            新增连接
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : connections.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <DatabaseIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              暂无数据库连接
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              点击上方&ldquo;新增连接&rdquo;按钮创建您的第一个数据库连接
            </Typography>
          </Box>
        ) : (
          <List>
            {connections.map((connection, index) => (
              <React.Fragment key={connection.id}>
                <ListItem
                  secondaryAction={
                    <Box>
                      <IconButton
                        edge="end"
                        onClick={() => handleEditConnection(connection)}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        onClick={() => handleDeleteConnection(connection)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography sx={{ mr: 1 }}>{connection.name}</Typography>
                        <Typography
                          variant="caption"
                          color={
                            connectionStatuses[connection.name] ? 'success.main' : 'text.secondary'
                          }
                          sx={{ ml: 1 }}
                        >
                          {connectionStatuses[connection.name] ? '已连接' : '未连接'}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          <strong>类型：</strong>
                          {getDatabaseTypeLabel(connection.dbType)} |<strong>主机：</strong>
                          {connection.host}:{connection.port} |<strong>数据库：</strong>
                          {connection.databaseName}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {index < connections.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>

      {/* 删除确认对话框 */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, connection: null })}
      >
        <DialogTitle>确认删除</DialogTitle>
        <DialogContent>
          <Typography>
            确定要删除连接 &ldquo;{deleteDialog.connection?.name}&rdquo; 吗？此操作不可撤销。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, connection: null })}>取消</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            删除
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default DatabaseConnections
