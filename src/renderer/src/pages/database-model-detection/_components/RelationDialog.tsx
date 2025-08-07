import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField
} from '@mui/material'
import { DbLogicForeignKey, DbTableInfo, RelationType } from '../../../services/database'

interface RelationDialogProps {
  open: boolean
  onClose: () => void
  selectedRelation: DbLogicForeignKey | null
  isAddingNewRelation: boolean
  tables: DbTableInfo[]
  onSave: (relation: Partial<DbLogicForeignKey>) => void
}

const RelationDialog: React.FC<RelationDialogProps> = ({
  open,
  onClose,
  selectedRelation,
  isAddingNewRelation,
  tables,
  onSave
}) => {
  // 内部表单状态管理
  const [formData, setFormData] = useState<Partial<DbLogicForeignKey>>({
    sourceTableName: '',
    sourceColumnName: '',
    targetTableName: '',
    targetColumnName: '',
    relationType: RelationType.ONE_TO_ONE
  })
  const [description, setDescription] = useState('')

  // 当对话框打开或选中关系变化时，重置表单
  useEffect(() => {
    if (open && selectedRelation) {
      setFormData(selectedRelation)
      setDescription('') // 重置描述
    } else if (open && isAddingNewRelation) {
      setFormData({
        sourceTableName: '',
        sourceColumnName: '',
        targetTableName: '',
        targetColumnName: '',
        relationType: RelationType.MANY_TO_ONE
      })
      setDescription('')
    }
  }, [open, selectedRelation, isAddingNewRelation])

  const handleFormChange = (field: keyof DbLogicForeignKey, value: string): void => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = (): void => {
    onSave(formData)
    onClose()
  }

  const isFormValid = (): boolean | string | undefined => {
    if (isAddingNewRelation) {
      return (
        formData.sourceTableName &&
        formData.sourceColumnName &&
        formData.targetTableName &&
        formData.targetColumnName
      )
    }
    return true
  }

  if (!open) return null

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isAddingNewRelation ? '新增表关联关系' : '配置表关联关系'}</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          {isAddingNewRelation ? (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              创建新的表关联关系
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              配置 {formData.sourceTableName}.{formData.sourceColumnName} 与{' '}
              {formData.targetTableName}.{formData.targetColumnName} 之间的关联关系
            </Typography>
          )}

          {isAddingNewRelation && (
            <>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <FormControl sx={{ flex: 1 }}>
                  <InputLabel>源表</InputLabel>
                  <Select
                    value={formData.sourceTableName}
                    label="源表"
                    onChange={(e) => handleFormChange('sourceTableName', e.target.value)}
                  >
                    {tables.map((table) => (
                      <MenuItem key={table.tableName} value={table.tableName}>
                        {table.tableName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl sx={{ flex: 1 }}>
                  <InputLabel>源字段</InputLabel>
                  <Select
                    value={formData.sourceColumnName}
                    label="源字段"
                    onChange={(e) => handleFormChange('sourceColumnName', e.target.value)}
                    disabled={!formData.sourceTableName}
                  >
                    {formData.sourceTableName &&
                      tables
                        .find((t) => t.tableName === formData.sourceTableName)
                        ?.columns.map((column) => (
                          <MenuItem key={column.columnName} value={column.columnName}>
                            {column.columnName} ({column.dataType})
                          </MenuItem>
                        ))}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <FormControl sx={{ flex: 1 }}>
                  <InputLabel>目标表</InputLabel>
                  <Select
                    value={formData.targetTableName}
                    label="目标表"
                    onChange={(e) => handleFormChange('targetTableName', e.target.value)}
                  >
                    {tables.map((table) => (
                      <MenuItem key={table.tableName} value={table.tableName}>
                        {table.tableName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl sx={{ flex: 1 }}>
                  <InputLabel>目标字段</InputLabel>
                  <Select
                    value={formData.targetColumnName}
                    label="目标字段"
                    onChange={(e) => handleFormChange('targetColumnName', e.target.value)}
                    disabled={!formData.targetTableName}
                  >
                    {formData.targetTableName &&
                      tables
                        .find((t) => t.tableName === formData.targetTableName)
                        ?.columns.map((column) => (
                          <MenuItem key={column.columnName} value={column.columnName}>
                            {column.columnName} ({column.dataType})
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
              value={formData.relationType}
              label="关联类型"
              onChange={(e) => handleFormChange('relationType', e.target.value)}
            >
              <MenuItem value="one-to-one">一对一 (1:1)</MenuItem>
              <MenuItem value="many-to-one">多对一 (N:1)</MenuItem>
              <MenuItem value="many-to-many">多对多 (M:N)</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="关联描述"
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="描述这个关联关系的业务含义..."
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <Button onClick={handleSave} variant="contained" disabled={!isFormValid()}>
          {isAddingNewRelation ? '创建关联' : '保存配置'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default RelationDialog
