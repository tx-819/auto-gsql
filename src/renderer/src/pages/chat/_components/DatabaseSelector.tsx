import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Alert,
  Chip,
  Button
} from '@mui/material'
import { Storage as DatabaseIcon, Settings as SettingsIcon } from '@mui/icons-material'
import { useNavigate } from 'react-router'

interface DatabaseConnection {
  id: string
  name: string
  type: string
  host: string
  database: string
}

interface DatabaseSelectorProps {
  selectedDatabase: DatabaseConnection | null
  messagesLength: number
  onDatabaseChange: (database: DatabaseConnection) => void
}

const DatabaseSelector: React.FC<DatabaseSelectorProps> = ({
  selectedDatabase,
  messagesLength,
  onDatabaseChange
}) => {
  const navigate = useNavigate()
  const [databaseConnections] = useState<DatabaseConnection[]>([
    {
      id: '1',
      name: '用户管理系统',
      type: 'mysql',
      host: 'localhost',
      database: 'user_management'
    },
    {
      id: '2',
      name: '订单数据库',
      type: 'postgresql',
      host: 'localhost',
      database: 'order_system'
    },
    { id: '3', name: '产品目录', type: 'mysql', host: 'localhost', database: 'product_catalog' }
  ])

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
                    label={selectedDatabase.type.toUpperCase()}
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
                      {db.host} / {db.database}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedDatabase && (
            <Chip
              label="已连接"
              color="success"
              variant="outlined"
              size="small"
              sx={{ height: 28, fontSize: '0.75rem' }}
            />
          )}

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
                      connectionInfo: {
                        name: selectedDb.name,
                        type: selectedDb.type,
                        host: selectedDb.host,
                        database: selectedDb.database
                      },
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
