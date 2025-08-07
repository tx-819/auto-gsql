import React, { useState, useMemo } from 'react'
import {
  Paper,
  Typography,
  Button,
  TextField,
  List,
  Card,
  CardContent,
  Chip,
  TablePagination,
  InputAdornment,
  Box
} from '@mui/material'
import {
  Refresh as RefreshIcon,
  TableChart as TableIcon,
  Search as SearchIcon
} from '@mui/icons-material'
import { getTableRelations } from './utils'
import { DbLogicForeignKey, DbTableInfo } from '../../../services/database'

interface TableListProps {
  tables: DbTableInfo[]
  relations: Partial<DbLogicForeignKey>[]
  onDetectModel: () => void
  onTableClick: (tableName: string) => void
}

const TableList: React.FC<TableListProps> = ({
  tables,
  relations,
  onDetectModel,
  onTableClick
}) => {
  // 内部状态管理
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  // 使用 useMemo 优化过滤和分页计算
  const { filteredTables, paginatedTables } = useMemo(() => {
    const filtered = tables.filter(
      (table) =>
        table.tableName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        table.columns.some((col) => col.columnName.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

    return { filteredTables: filtered, paginatedTables: paginated }
  }, [tables, searchTerm, page, rowsPerPage])

  const handlePageChange = (_: unknown, newPage: number): void => {
    setPage(newPage)
  }

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  return (
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
        <Button size="small" startIcon={<RefreshIcon />} onClick={onDetectModel}>
          重新生成
        </Button>
      </Box>

      {/* 表搜索 */}
      <TextField
        fullWidth
        size="small"
        placeholder="搜索表名或字段名..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
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
            key={table.tableName}
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
            onClick={() => onTableClick(table.tableName)}
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
                  {table.tableName}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    label={`${getTableRelations(table.tableName, relations).length} 关联`}
                    size="small"
                    color="info"
                    variant="outlined"
                  />
                </Box>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                主键: {table.primaryKey} | 外键:{' '}
                {getTableRelations(table.tableName, relations).length}个
              </Typography>

              <Box sx={{ mt: 1 }}>
                {table.columns.slice(0, 3).map((column) => (
                  <Chip
                    key={column.columnName}
                    label={`${column.columnName}: ${column.dataType}`}
                    size="small"
                    variant="outlined"
                    sx={{ mr: 0.5, mb: 0.5 }}
                    color={
                      column.isPrimary ? 'primary' : column.isForeignKey ? 'secondary' : 'default'
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
        page={page}
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
        rowsPerPageOptions={[3, 5, 10, 20]}
        labelRowsPerPage="每页显示:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} / ${count}`}
      />
    </Paper>
  )
}

export default TableList
