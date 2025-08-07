import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from '@mui/material'
import { DbLogicForeignKey } from '../../../services/database'

interface DeleteDialogProps {
  open: boolean
  onClose: () => void
  relationToDelete: DbLogicForeignKey | null
  onConfirm: () => void
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({
  open,
  onClose,
  relationToDelete,
  onConfirm
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>确认删除</DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          确定要删除以下关联关系吗？
        </Typography>
        {relationToDelete && (
          <Typography variant="body2" color="text.secondary">
            {relationToDelete.sourceTableName}.{relationToDelete.sourceColumnName} →{' '}
            {relationToDelete.targetTableName}.{relationToDelete.targetColumnName}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          确认删除
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteDialog
