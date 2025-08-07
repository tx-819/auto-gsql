import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  List,
  Card,
  CardContent,
  CardActions,
  Chip,
  Alert
} from '@mui/material'
import {
  TableChart as TableIcon,
  Settings as SettingsIcon,
  Delete as DeleteIcon
} from '@mui/icons-material'
import { getRelationTypeColor, getTableRelations } from './utils'
import { DbLogicForeignKey } from '../../../services/database'

interface TableRelationsDialogProps {
  open: boolean
  onClose: () => void
  selectedTableForRelations: string | null
  relations: Partial<DbLogicForeignKey>[]
  onConfigureRelation: (relation: DbLogicForeignKey) => void
  onDeleteRelation: (relation: DbLogicForeignKey) => void
}

const TableRelationsDialog: React.FC<TableRelationsDialogProps> = ({
  open,
  onClose,
  selectedTableForRelations,
  relations,
  onConfigureRelation,
  onDeleteRelation
}) => {
  if (!selectedTableForRelations) return null

  const tableRelations = getTableRelations(selectedTableForRelations, relations)

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TableIcon />
          {selectedTableForRelations} 表的关联关系
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            显示与 {selectedTableForRelations} 表相关的所有关联关系配置
          </Typography>

          {tableRelations.length === 0 ? (
            <Alert severity="info">该表目前没有任何关联关系配置</Alert>
          ) : (
            <List>
              {tableRelations.map((relation, index) => (
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
                        {relation.sourceTableName === selectedTableForRelations ? (
                          <>
                            <Box
                              component="span"
                              sx={{ color: 'primary.main', fontWeight: 'bold' }}
                            >
                              {relation.sourceTableName}
                            </Box>
                            .{relation.sourceColumnName} → {relation.targetTableName}.
                            {relation.targetColumnName}
                          </>
                        ) : (
                          <>
                            {relation.sourceTableName}.{relation.sourceColumnName} →{' '}
                            <Box
                              component="span"
                              sx={{ color: 'primary.main', fontWeight: 'bold' }}
                            >
                              {relation.targetTableName}
                            </Box>
                            .{relation.targetColumnName}
                          </>
                        )}
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
                      onClick={() => {
                        onConfigureRelation(relation as DbLogicForeignKey)
                      }}
                    >
                      修改配置
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => {
                        onDeleteRelation(relation as DbLogicForeignKey)
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>关闭</Button>
      </DialogActions>
    </Dialog>
  )
}

export default TableRelationsDialog
