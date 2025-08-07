import React, { useState, useEffect } from 'react'
import { Box, Alert } from '@mui/material'
import { useNavigate, useLocation } from 'react-router'
import {
  Header,
  DetectionStatus,
  TableList,
  RelationList,
  RelationDialog,
  DeleteDialog,
  TableRelationsDialog
} from './_components'
import { isSameRelation } from './_components/utils'
import {
  generateDatabaseMetadata,
  getTablesWithColumns,
  scanDatabase
} from '../../services/database'
import { DbLogicForeignKey, DbTableInfo } from '../../services/database'

const DatabaseModelDetection: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isDetecting, setIsDetecting] = useState(false)
  const [detectionComplete, setDetectionComplete] = useState(false)
  const [tables, setTables] = useState<DbTableInfo[]>([])
  const [relations, setRelations] = useState<Partial<DbLogicForeignKey>[]>([])
  const [relationDialogOpen, setRelationDialogOpen] = useState(false)
  const [selectedRelation, setSelectedRelation] = useState<DbLogicForeignKey | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isAddingNewRelation, setIsAddingNewRelation] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [relationToDelete, setRelationToDelete] = useState<DbLogicForeignKey | null>(null)
  const [selectedTableForRelations, setSelectedTableForRelations] = useState<string | null>(null)
  const [tableRelationsDialogOpen, setTableRelationsDialogOpen] = useState(false)

  // 模拟数据库连接信息（实际应该从路由参数或状态管理获取）
  const connectionInfo = location.state?.connectionInfo || {
    name: '测试数据库',
    type: 'mysql',
    host: 'localhost'
  }

  // 检查是否是从聊天页面跳转过来的（跳过AI检测）
  const isFromChat = location.state?.fromChat || false

  useEffect(() => {
    if (isFromChat) {
      // 从聊天页面跳转过来，直接加载现有数据，跳过AI检测
      getTablesWithColumns(23).then((res) => {
        setTables(res.data)
      })
      setDetectionComplete(true)
    } else {
      // 正常流程，进行AI检测
      handleDetectModel()
    }
  }, [isFromChat])

  const handleDetectModel = async (): Promise<void> => {
    setIsDetecting(true)
    setError(null)

    try {
      // 模拟AI检测过程
      const { dbTableInfo, uniqueArrayCols } = await scanDatabase(connectionInfo)
      const { data } = await generateDatabaseMetadata(
        connectionInfo.id,
        dbTableInfo,
        uniqueArrayCols
      )
      setTables(data.tables)
      setRelations(data.foreignKeys)
      setDetectionComplete(true)
    } catch {
      setError('生成数据库模型时发生错误，请检查连接配置')
    } finally {
      setIsDetecting(false)
    }
  }

  const handleBack = (): void => {
    navigate('/')
  }

  const handleConfigureRelation = (relation: DbLogicForeignKey): void => {
    setSelectedRelation(relation)
    setIsAddingNewRelation(false)
    setRelationDialogOpen(true)
  }

  const handleAddNewRelation = (): void => {
    setSelectedRelation(null)
    setIsAddingNewRelation(true)
    setRelationDialogOpen(true)
  }

  const handleSaveRelation = (relation: Partial<DbLogicForeignKey>): void => {
    console.log('handleSaveRelation', relation)
    if (isAddingNewRelation) {
      // 添加新的关联关系
      setRelations((prev) => [...prev, relation])
    } else {
      // 更新现有关联关系
      setRelations((prev) => prev.map((rel) => (isSameRelation(rel, relation) ? relation : rel)))
    }
    setRelationDialogOpen(false)
    setSelectedRelation(null)
    setIsAddingNewRelation(false)
  }

  const handleDeleteRelation = (relationToDelete: DbLogicForeignKey): void => {
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
      <Header connectionInfo={connectionInfo} onBack={handleBack} />

      {/* 检测状态 */}
      <DetectionStatus isDetecting={isDetecting} />

      {/* 错误提示 */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* 生成结果 */}
      {detectionComplete && !isDetecting && (
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          {/* 表结构列表 */}
          <Box sx={{ flex: { xs: 1, md: '1 1 50%' } }}>
            <TableList
              tables={tables}
              relations={relations}
              onDetectModel={handleDetectModel}
              onTableClick={handleTableClick}
            />
          </Box>

          {/* 关联关系 */}
          <Box sx={{ flex: { xs: 1, md: '1 1 50%' } }}>
            <RelationList
              relations={relations}
              onAddNewRelation={handleAddNewRelation}
              onConfigureRelation={handleConfigureRelation}
              onDeleteRelation={handleDeleteRelation}
            />
          </Box>
        </Box>
      )}

      {/* 关联关系配置对话框 */}
      <RelationDialog
        open={relationDialogOpen}
        onClose={() => setRelationDialogOpen(false)}
        selectedRelation={selectedRelation}
        isAddingNewRelation={isAddingNewRelation}
        tables={tables}
        onSave={handleSaveRelation}
      />

      {/* 删除确认对话框 */}
      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        relationToDelete={relationToDelete}
        onConfirm={confirmDeleteRelation}
      />

      {/* 表关联关系对话框 */}
      <TableRelationsDialog
        open={tableRelationsDialogOpen}
        onClose={handleCloseTableRelationsDialog}
        selectedTableForRelations={selectedTableForRelations}
        relations={relations}
        onConfigureRelation={handleConfigureRelation}
        onDeleteRelation={handleDeleteRelation}
      />
    </Box>
  )
}

export default DatabaseModelDetection
