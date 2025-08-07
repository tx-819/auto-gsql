import React, { useState, useMemo } from 'react'
import {
  Paper,
  Typography,
  Button,
  TextField,
  List,
  Card,
  CardContent,
  CardActions,
  Chip,
  TablePagination,
  InputAdornment,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  SelectChangeEvent
} from '@mui/material'
import {
  AccountTree as RelationIcon,
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Settings as SettingsIcon,
  Delete as DeleteIcon
} from '@mui/icons-material'
import { getRelationTypeColor } from './utils'
import { DbLogicForeignKey } from '../../../services/database'

interface RelationListProps {
  relations: Partial<DbLogicForeignKey>[]
  onAddNewRelation: () => void
  onConfigureRelation: (relation: DbLogicForeignKey) => void
  onDeleteRelation: (relation: DbLogicForeignKey) => void
}

const RelationList: React.FC<RelationListProps> = ({
  relations,
  onAddNewRelation,
  onConfigureRelation,
  onDeleteRelation
}) => {
  // 内部状态管理
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  // 使用 useMemo 优化过滤和分页计算
  const { filteredRelations, paginatedRelations } = useMemo(() => {
    const filtered = relations.filter((relation) => {
      const matchesSearch =
        relation.sourceTableName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        relation.targetTableName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        relation.sourceColumnName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        relation.targetColumnName?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesType = selectedType === 'all' || relation.relationType === selectedType

      return matchesSearch && matchesType
    })

    const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

    return { filteredRelations: filtered, paginatedRelations: paginated }
  }, [relations, searchTerm, selectedType, page, rowsPerPage])

  const handlePageChange = (_: unknown, newPage: number): void => {
    setPage(newPage)
  }

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleTypeChange = (event: SelectChangeEvent<string>): void => {
    setSelectedType(event.target.value)
    setPage(0) // 重置页码
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
          <RelationIcon />
          表关联关系 ({filteredRelations.length}/{relations.length})
        </Typography>
        <Button size="small" variant="outlined" startIcon={<AddIcon />} onClick={onAddNewRelation}>
          新增关联
        </Button>
      </Box>

      {/* 关联关系搜索和筛选 */}
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="搜索关联关系..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
            value={selectedType}
            label="关联类型"
            onChange={handleTypeChange}
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
                    {relation.sourceTableName}.{relation.sourceColumnName} →{' '}
                    {relation.targetTableName}.{relation.targetColumnName}
                  </Typography>
                  <Chip
                    label={relation.relationType}
                    size="small"
                    color={getRelationTypeColor(relation.relationType || '')}
                  />
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  startIcon={<SettingsIcon />}
                  onClick={() => onConfigureRelation(relation as DbLogicForeignKey)}
                >
                  修改配置
                </Button>
                <Button
                  size="small"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => onDeleteRelation(relation as DbLogicForeignKey)}
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
          page={page}
          onPageChange={handlePageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[3, 5, 10, 20]}
          labelRowsPerPage="每页显示:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} / ${count}`}
        />
      )}
    </Paper>
  )
}

export default RelationList
