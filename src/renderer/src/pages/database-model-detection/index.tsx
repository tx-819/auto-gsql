import React, { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  List,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  CardActions,
  TablePagination,
  InputAdornment
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  Refresh as RefreshIcon,
  TableChart as TableIcon,
  AccountTree as RelationIcon,
  Settings as SettingsIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router'
import { TableInfo, TableRelation } from './types'
import { mockTables, mockRelations } from './mockData'

const DatabaseModelDetection: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isDetecting, setIsDetecting] = useState(false)
  const [detectionComplete, setDetectionComplete] = useState(false)
  const [tables, setTables] = useState<TableInfo[]>([])
  const [relations, setRelations] = useState<TableRelation[]>([])
  const [relationDialogOpen, setRelationDialogOpen] = useState(false)
  const [selectedRelation, setSelectedRelation] = useState<TableRelation | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isAddingNewRelation, setIsAddingNewRelation] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [relationToDelete, setRelationToDelete] = useState<TableRelation | null>(null)
  const [tableSearchTerm, setTableSearchTerm] = useState('')
  const [relationSearchTerm, setRelationSearchTerm] = useState('')
  const [selectedRelationType, setSelectedRelationType] = useState<string>('all')
  const [tablePage, setTablePage] = useState(0)
  const [relationPage, setRelationPage] = useState(0)
  const [tableRowsPerPage, setTableRowsPerPage] = useState(5)
  const [relationRowsPerPage, setRelationRowsPerPage] = useState(5)
  const [selectedTableForRelations, setSelectedTableForRelations] = useState<string | null>(null)
  const [tableRelationsDialogOpen, setTableRelationsDialogOpen] = useState(false)

  // 模拟数据库连接信息（实际应该从路由参数或状态管理获取）
  const connectionInfo = location.state?.connectionInfo || {
    name: '测试数据库',
    type: 'mysql',
    host: 'localhost'
  }

  useEffect(() => {
    // 页面加载时自动开始检测
    handleDetectModel()
  }, [])

  const handleDetectModel = async (): Promise<void> => {
    setIsDetecting(true)
    setError(null)

    try {
      // 模拟AI检测过程
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // 使用导入的模拟数据

      setTables(mockTables)
      setRelations(mockRelations)
      setDetectionComplete(true)
    } catch {
      setError('检测数据库模型时发生错误，请检查连接配置')
    } finally {
      setIsDetecting(false)
    }
  }

  const handleBack = (): void => {
    navigate('/')
  }

  const handleConfigureRelation = (relation: TableRelation): void => {
    setSelectedRelation(relation)
    setIsAddingNewRelation(false)
    setRelationDialogOpen(true)
  }

  const handleAddNewRelation = (): void => {
    setSelectedRelation({
      sourceTable: '',
      sourceColumn: '',
      targetTable: '',
      targetColumn: '',
      relationType: 'many-to-one',
      isConfigured: false
    })
    setIsAddingNewRelation(true)
    setRelationDialogOpen(true)
  }

  const handleSaveRelation = (): void => {
    if (selectedRelation) {
      if (isAddingNewRelation) {
        // 添加新的关联关系
        setRelations((prev) => [...prev, { ...selectedRelation, isConfigured: true }])
      } else {
        // 更新现有关联关系
        setRelations((prev) =>
          prev.map((rel) => (rel === selectedRelation ? { ...rel, isConfigured: true } : rel))
        )
      }
    }
    setRelationDialogOpen(false)
    setSelectedRelation(null)
    setIsAddingNewRelation(false)
  }

  const handleDeleteRelation = (relationToDelete: TableRelation): void => {
    setRelationToDelete(relationToDelete)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteRelation = (): void => {
    if (relationToDelete) {
      setRelations((prev) => prev.filter((rel) => rel !== relationToDelete))
    }
    setDeleteDialogOpen(false)
    setRelationToDelete(null)
  }

  const handleTableClick = (tableName: string): void => {
    setSelectedTableForRelations(tableName)
    setTableRelationsDialogOpen(true)
  }

  const handleCloseTableRelationsDialog = (): void => {
    setTableRelationsDialogOpen(false)
    setTimeout(() => {
      setSelectedTableForRelations(null)
    })
  }

  // 获取指定表的所有关联关系
  const getTableRelations = (tableName: string): TableRelation[] => {
    return relations.filter(
      (relation) => relation.sourceTable === tableName || relation.targetTable === tableName
    )
  }

  const getRelationTypeColor = (
    type: string
  ): 'primary' | 'secondary' | 'info' | 'warning' | 'default' => {
    switch (type) {
      case 'one-to-one':
        return 'primary'
      case 'one-to-many':
        return 'secondary'
      case 'many-to-one':
        return 'info'
      case 'many-to-many':
        return 'warning'
      default:
        return 'default'
    }
  }

  // 过滤表数据
  const filteredTables = tables.filter(
    (table) =>
      table.name.toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
      table.columns.some((col) => col.name.toLowerCase().includes(tableSearchTerm.toLowerCase()))
  )

  // 过滤关联关系数据
  const filteredRelations = relations.filter((relation) => {
    const matchesSearch =
      relation.sourceTable.toLowerCase().includes(relationSearchTerm.toLowerCase()) ||
      relation.targetTable.toLowerCase().includes(relationSearchTerm.toLowerCase()) ||
      relation.sourceColumn.toLowerCase().includes(relationSearchTerm.toLowerCase()) ||
      relation.targetColumn.toLowerCase().includes(relationSearchTerm.toLowerCase())

    const matchesType =
      selectedRelationType === 'all' || relation.relationType === selectedRelationType

    return matchesSearch && matchesType
  })

  // 分页后的表数据
  const paginatedTables = filteredTables.slice(
    tablePage * tableRowsPerPage,
    tablePage * tableRowsPerPage + tableRowsPerPage
  )

  // 分页后的关联关系数据
  const paginatedRelations = filteredRelations.slice(
    relationPage * relationRowsPerPage,
    relationPage * relationRowsPerPage + relationRowsPerPage
  )

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
          数据库模型检测
        </Typography>
        <Chip label={connectionInfo.name} color="primary" variant="outlined" sx={{ ml: 2 }} />
      </Box>

      {/* 检测状态 */}
      {isDetecting && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CircularProgress size={24} />
            <Typography variant="h6">AI正在检测数据库模型结构...</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            正在分析表结构、字段类型、主键、外键等信息
          </Typography>
        </Paper>
      )}

      {/* 错误提示 */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* 检测结果 */}
      {detectionComplete && !isDetecting && (
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          {/* 表结构列表 */}
          <Box sx={{ flex: { xs: 1, md: '1 1 50%' } }}>
            <Paper sx={{ p: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 2
                }}
              >
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TableIcon />
                  检测到的表结构 ({filteredTables.length}/{tables.length})
                </Typography>
                <Button size="small" startIcon={<RefreshIcon />} onClick={handleDetectModel}>
                  重新检测
                </Button>
              </Box>

              {/* 表搜索 */}
              <TextField
                fullWidth
                size="small"
                placeholder="搜索表名或字段名..."
                value={tableSearchTerm}
                onChange={(e) => setTableSearchTerm(e.target.value)}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  )
                }}
              />

              <List>
                {paginatedTables.map((table) => (
                  <Card
                    key={table.name}
                    sx={{
                      mb: 2,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        boxShadow: 3,
                        transform: 'translateY(-2px)',
                        borderColor: 'primary.main'
                      }
                    }}
                    onClick={() => handleTableClick(table.name)}
                  >
                    <CardContent sx={{ pb: 1 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <Typography variant="subtitle1" fontWeight="bold">
                          {table.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip label={`${table.rowCount} 行`} size="small" variant="outlined" />
                          <Chip
                            label={`${getTableRelations(table.name).length} 关联`}
                            size="small"
                            color="info"
                            variant="outlined"
                          />
                        </Box>
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        主键: {table.primaryKey} | 外键: {table.foreignKeys.length} 个
                      </Typography>

                      <Box sx={{ mt: 1 }}>
                        {table.columns.slice(0, 3).map((column) => (
                          <Chip
                            key={column.name}
                            label={`${column.name}: ${column.type}`}
                            size="small"
                            variant="outlined"
                            sx={{ mr: 0.5, mb: 0.5 }}
                            color={
                              column.isPrimaryKey
                                ? 'primary'
                                : column.isForeignKey
                                  ? 'secondary'
                                  : 'default'
                            }
                          />
                        ))}
                        {table.columns.length > 3 && (
                          <Chip
                            label={`+${table.columns.length - 3} 更多字段`}
                            size="small"
                            variant="outlined"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </List>

              {/* 表分页 */}
              <TablePagination
                component="div"
                count={filteredTables.length}
                page={tablePage}
                onPageChange={(_, newPage) => setTablePage(newPage)}
                rowsPerPage={tableRowsPerPage}
                onRowsPerPageChange={(e) => {
                  setTableRowsPerPage(parseInt(e.target.value, 10))
                  setTablePage(0)
                }}
                rowsPerPageOptions={[3, 5, 10, 20]}
                labelRowsPerPage="每页显示:"
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} / ${count}`}
              />
            </Paper>
          </Box>

          {/* 关联关系 */}
          <Box sx={{ flex: { xs: 1, md: '1 1 50%' } }}>
            <Paper sx={{ p: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 2
                }}
              >
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <RelationIcon />
                  表关联关系 ({filteredRelations.length}/{relations.length})
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddNewRelation}
                >
                  新增关联
                </Button>
              </Box>

              {/* 关联关系搜索和筛选 */}
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="搜索关联关系..."
                  value={relationSearchTerm}
                  onChange={(e) => setRelationSearchTerm(e.target.value)}
                  sx={{ mb: 1 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    )
                  }}
                />
                <FormControl size="small" sx={{ minWidth: 120, mt: 1 }}>
                  <InputLabel>关联类型</InputLabel>
                  <Select
                    value={selectedRelationType}
                    label="关联类型"
                    onChange={(e) => setSelectedRelationType(e.target.value)}
                    startAdornment={
                      <InputAdornment position="start">
                        <FilterListIcon />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="all">全部类型</MenuItem>
                    <MenuItem value="one-to-one">一对一</MenuItem>
                    <MenuItem value="one-to-many">一对多</MenuItem>
                    <MenuItem value="many-to-one">多对一</MenuItem>
                    <MenuItem value="many-to-many">多对多</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {filteredRelations.length === 0 ? (
                <Alert severity="info">
                  {relations.length === 0 ? '未检测到表之间的关联关系' : '没有找到匹配的关联关系'}
                </Alert>
              ) : (
                <List>
                  {paginatedRelations.map((relation, index) => (
                    <Card key={index} sx={{ mb: 2 }}>
                      <CardContent sx={{ pb: 1 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            mb: 1
                          }}
                        >
                          <Typography variant="subtitle2" fontWeight="bold">
                            {relation.sourceTable}.{relation.sourceColumn} → {relation.targetTable}.
                            {relation.targetColumn}
                          </Typography>
                          <Chip
                            label={relation.relationType}
                            size="small"
                            color={getRelationTypeColor(relation.relationType)}
                          />
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {relation.isConfigured ? (
                            <Chip
                              icon={<CheckCircleIcon />}
                              label="已配置"
                              size="small"
                              color="success"
                            />
                          ) : (
                            <Chip icon={<InfoIcon />} label="待配置" size="small" color="warning" />
                          )}
                        </Box>
                      </CardContent>
                      <CardActions>
                        <Button
                          size="small"
                          startIcon={<SettingsIcon />}
                          onClick={() => handleConfigureRelation(relation)}
                        >
                          {relation.isConfigured ? '修改配置' : '配置关系'}
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDeleteRelation(relation)}
                        >
                          删除
                        </Button>
                      </CardActions>
                    </Card>
                  ))}
                </List>
              )}

              {/* 关联关系分页 */}
              {filteredRelations.length > 0 && (
                <TablePagination
                  component="div"
                  count={filteredRelations.length}
                  page={relationPage}
                  onPageChange={(_, newPage) => setRelationPage(newPage)}
                  rowsPerPage={relationRowsPerPage}
                  onRowsPerPageChange={(e) => {
                    setRelationRowsPerPage(parseInt(e.target.value, 10))
                    setRelationPage(0)
                  }}
                  rowsPerPageOptions={[3, 5, 10, 20]}
                  labelRowsPerPage="每页显示:"
                  labelDisplayedRows={({ from, to, count }) => `${from}-${to} / ${count}`}
                />
              )}
            </Paper>
          </Box>
        </Box>
      )}

      {/* 关联关系配置对话框 */}
      <Dialog
        open={relationDialogOpen}
        onClose={() => setRelationDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{isAddingNewRelation ? '新增表关联关系' : '配置表关联关系'}</DialogTitle>
        <DialogContent>
          {selectedRelation && (
            <Box sx={{ pt: 1 }}>
              {isAddingNewRelation ? (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  创建新的表关联关系
                </Typography>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  配置 {selectedRelation.sourceTable}.{selectedRelation.sourceColumn} 与{' '}
                  {selectedRelation.targetTable}.{selectedRelation.targetColumn} 之间的关联关系
                </Typography>
              )}

              {isAddingNewRelation && (
                <>
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <FormControl sx={{ flex: 1 }}>
                      <InputLabel>源表</InputLabel>
                      <Select
                        value={selectedRelation.sourceTable}
                        label="源表"
                        onChange={(e) =>
                          setSelectedRelation({
                            ...selectedRelation,
                            sourceTable: e.target.value
                          })
                        }
                      >
                        {tables.map((table) => (
                          <MenuItem key={table.name} value={table.name}>
                            {table.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl sx={{ flex: 1 }}>
                      <InputLabel>源字段</InputLabel>
                      <Select
                        value={selectedRelation.sourceColumn}
                        label="源字段"
                        onChange={(e) =>
                          setSelectedRelation({
                            ...selectedRelation,
                            sourceColumn: e.target.value
                          })
                        }
                        disabled={!selectedRelation.sourceTable}
                      >
                        {selectedRelation.sourceTable &&
                          tables
                            .find((t) => t.name === selectedRelation.sourceTable)
                            ?.columns.map((column) => (
                              <MenuItem key={column.name} value={column.name}>
                                {column.name} ({column.type})
                              </MenuItem>
                            ))}
                      </Select>
                    </FormControl>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <FormControl sx={{ flex: 1 }}>
                      <InputLabel>目标表</InputLabel>
                      <Select
                        value={selectedRelation.targetTable}
                        label="目标表"
                        onChange={(e) =>
                          setSelectedRelation({
                            ...selectedRelation,
                            targetTable: e.target.value
                          })
                        }
                      >
                        {tables.map((table) => (
                          <MenuItem key={table.name} value={table.name}>
                            {table.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl sx={{ flex: 1 }}>
                      <InputLabel>目标字段</InputLabel>
                      <Select
                        value={selectedRelation.targetColumn}
                        label="目标字段"
                        onChange={(e) =>
                          setSelectedRelation({
                            ...selectedRelation,
                            targetColumn: e.target.value
                          })
                        }
                        disabled={!selectedRelation.targetTable}
                      >
                        {selectedRelation.targetTable &&
                          tables
                            .find((t) => t.name === selectedRelation.targetTable)
                            ?.columns.map((column) => (
                              <MenuItem key={column.name} value={column.name}>
                                {column.name} ({column.type})
                              </MenuItem>
                            ))}
                      </Select>
                    </FormControl>
                  </Box>
                </>
              )}

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>关联类型</InputLabel>
                <Select
                  value={selectedRelation.relationType}
                  label="关联类型"
                  onChange={(e) =>
                    setSelectedRelation({
                      ...selectedRelation,
                      relationType: e.target.value as
                        | 'one-to-one'
                        | 'one-to-many'
                        | 'many-to-one'
                        | 'many-to-many'
                    })
                  }
                >
                  <MenuItem value="one-to-one">一对一 (1:1)</MenuItem>
                  <MenuItem value="one-to-many">一对多 (1:N)</MenuItem>
                  <MenuItem value="many-to-one">多对一 (N:1)</MenuItem>
                  <MenuItem value="many-to-many">多对多 (M:N)</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="关联描述"
                multiline
                rows={3}
                placeholder="描述这个关联关系的业务含义..."
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRelationDialogOpen(false)}>取消</Button>
          <Button
            onClick={handleSaveRelation}
            variant="contained"
            disabled={
              isAddingNewRelation && selectedRelation
                ? !selectedRelation.sourceTable ||
                  !selectedRelation.sourceColumn ||
                  !selectedRelation.targetTable ||
                  !selectedRelation.targetColumn
                : false
            }
          >
            {isAddingNewRelation ? '创建关联' : '保存配置'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 删除确认对话框 */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>确认删除</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            确定要删除以下关联关系吗？
          </Typography>
          {relationToDelete && (
            <Typography variant="body2" color="text.secondary">
              {relationToDelete.sourceTable}.{relationToDelete.sourceColumn} →{' '}
              {relationToDelete.targetTable}.{relationToDelete.targetColumn}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>取消</Button>
          <Button onClick={confirmDeleteRelation} color="error" variant="contained">
            确认删除
          </Button>
        </DialogActions>
      </Dialog>

      {/* 表关联关系对话框 */}
      <Dialog
        open={tableRelationsDialogOpen}
        onClose={handleCloseTableRelationsDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TableIcon />
            {selectedTableForRelations} 表的关联关系
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedTableForRelations && (
            <Box sx={{ pt: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                显示与 {selectedTableForRelations} 表相关的所有关联关系配置
              </Typography>

              {getTableRelations(selectedTableForRelations).length === 0 ? (
                <Alert severity="info">该表目前没有任何关联关系配置</Alert>
              ) : (
                <List>
                  {getTableRelations(selectedTableForRelations).map((relation, index) => (
                    <Card key={index} sx={{ mb: 2 }}>
                      <CardContent sx={{ pb: 1 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            mb: 1
                          }}
                        >
                          <Typography variant="subtitle2" fontWeight="bold">
                            {relation.sourceTable === selectedTableForRelations ? (
                              <>
                                <Box
                                  component="span"
                                  sx={{ color: 'primary.main', fontWeight: 'bold' }}
                                >
                                  {relation.sourceTable}
                                </Box>
                                .{relation.sourceColumn} → {relation.targetTable}.
                                {relation.targetColumn}
                              </>
                            ) : (
                              <>
                                {relation.sourceTable}.{relation.sourceColumn} →{' '}
                                <Box
                                  component="span"
                                  sx={{ color: 'primary.main', fontWeight: 'bold' }}
                                >
                                  {relation.targetTable}
                                </Box>
                                .{relation.targetColumn}
                              </>
                            )}
                          </Typography>
                          <Chip
                            label={relation.relationType}
                            size="small"
                            color={getRelationTypeColor(relation.relationType)}
                          />
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {relation.isConfigured ? (
                            <Chip
                              icon={<CheckCircleIcon />}
                              label="已配置"
                              size="small"
                              color="success"
                            />
                          ) : (
                            <Chip icon={<InfoIcon />} label="待配置" size="small" color="warning" />
                          )}
                        </Box>
                      </CardContent>
                      <CardActions>
                        <Button
                          size="small"
                          startIcon={<SettingsIcon />}
                          onClick={() => {
                            handleConfigureRelation(relation)
                          }}
                        >
                          {relation.isConfigured ? '修改配置' : '配置关系'}
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => {
                            handleDeleteRelation(relation)
                          }}
                        >
                          删除
                        </Button>
                      </CardActions>
                    </Card>
                  ))}
                </List>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTableRelationsDialog}>关闭</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default DatabaseModelDetection
